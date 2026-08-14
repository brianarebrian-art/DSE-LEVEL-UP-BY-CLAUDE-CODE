// 紙筆戰士 Paper Warrior —— 一份可打印 A4 卷嘅「確定性重建」核心。
//
// 設計要點（同原 spec 刻意唔同，已向創辦人提報）：
//   原 spec 想 QR 內含 `session=localStorage_session_key`。兩個問題：
//     (1) 把 session key 放落 URL＝會被影相／分享／入瀏覽器紀錄（私隱）；
//     (2) 綁 localStorage ⇒ 喺電腦印、用手機掃就搵唔返條卷。
//   改用【確定性 seed code】：一份卷 = (科目, 課題, 題數, seed) 四個公開參數。
//   同一個 code 喺【任何裝置】都由靜態題庫重建出一模一樣嘅題目【同選項次序】，
//   所以：唔使 QR library（零新 dependency）、URL 冇任何個人資料、跨裝置照用。
//
// 選項次序都要由 seed 決定 —— 唔係嘅話印出嚟嗰張紙嘅 A/B/C/D 會同對答案頁唔同。

import type { Question, MCQuestion, AnyQuestion, WrittenQuestion } from '@/data/questions/types'
import { isWrittenQuestion } from '@/data/questions/types'
import { SITE_ORIGIN } from '@/lib/site'

export interface PaperSpec {
  subject: string
  topic: string // '' = 全部課題
  size: number
  seed: string // base36
  /**
   * 乙部書寫題數目（0 或省略 = 冇乙部）。
   *
   * 卷號第 5 段【只喺 > 0 先出現】，寫成 `w2` 咁樣自我描述。咁樣 2026-08-14
   * 之前印出嘅四段式卷號逐字不變，張紙照樣開得返同一份卷。
   */
  written?: number
}

export interface PaperItem {
  question: MCQuestion
  options: string[] // 已按 seed 洗牌（顯示次序）
  optionsEn: string[]
  answerIndex: number // 正確答案喺【洗牌後】嘅位置
}

const SEP = '~'
export const PAPER_SIZES = [10, 20, 30, 40] as const
const MAX_SIZE = 40

// 乙部書寫題。上限 3 條，同 `DEFAULT_LONG_SESSION` 一致 —— 一條長題目建議用時
// 5–15 分鐘，四條以上就唔再係「一份可以坐低做完嘅卷」。
export const WRITTEN_SIZES = [0, 1, 2, 3] as const
const MAX_WRITTEN = 3

// ── 確定性 PRNG（mulberry32）——同一 seed 永遠同一序列，跨裝置一致。
function rngFrom(seedStr: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  let a = h >>> 0
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffled<T>(list: T[], rnd: () => number): T[] {
  const out = list.slice()
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function newSeed(): string {
  return Math.floor(Math.random() * 36 ** 4).toString(36).padStart(4, '0')
}

// ── code ⇄ spec。code 印喺紙上，學生打得返、掃得返，唔含任何個人資料。
export function encodePaperCode(spec: PaperSpec): string {
  const parts = [spec.subject, spec.topic || 'all', String(spec.size), spec.seed]
  // 第 5 段只喺有乙部先加，冇乙部嘅卷號同舊格式逐字相同（見 PaperSpec.written）。
  if (spec.written && spec.written > 0) parts.push(`w${Math.min(spec.written, MAX_WRITTEN)}`)
  return parts.join(SEP)
}

/**
 * 對答案深連結 —— 印喺卷上供掃描。
 *
 * 只含公開卷號，冇任何個人資料，所以同檔頭嗰個「QR 唔可以載 session key」嘅
 * 決定冇衝突：被否決嘅係「QR 內含 localStorage session key」，唔係掃描本身。
 * 用正式網域而唔用 `location.origin`：張紙印出嚟之後就離開咗當時個 session，
 * 喺 localhost 印就會印低一條開發機網址，張紙一出到街即刻係死連結。
 */
export function answerSheetUrl(spec: PaperSpec): string {
  return `${SITE_ORIGIN}/answer-sheet?p=${encodeURIComponent(encodePaperCode(spec))}`
}

export function decodePaperCode(code: string): PaperSpec | null {
  const parts = String(code ?? '').trim().toLowerCase().split(SEP)
  if (parts.length !== 4 && parts.length !== 5) return null
  const [subject, topic, sizeRaw, seed, writtenRaw] = parts
  const size = Number(sizeRaw)
  if (!subject || !seed || !Number.isInteger(size) || size < 1 || size > MAX_SIZE) return null

  const base = { subject, topic: topic === 'all' ? '' : topic, size, seed }
  if (parts.length === 4) return base // 四段式 = 冇乙部，`written` 索性唔出現

  const m = /^w(\d+)$/.exec(writtenRaw ?? '')
  if (!m) return null
  const written = Number(m[1])
  if (written < 1 || written > MAX_WRITTEN) return null
  return { ...base, written }
}

// ── 3:5:2 分層抽題。刻意【唔】用 localStorage 嘅「做過未」排序（practice 先要），
// 因為一份卷必須喺任何裝置都重建到同一結果 —— 排序只可以由 seed 決定。
const DIFF_RATIO = { easy: 0.3, medium: 0.5, hard: 0.2 } as const

function pickByDifficulty(ordered: MCQuestion[], size: number): MCQuestion[] {
  if (ordered.length <= size) return ordered
  const easy = Math.round(size * DIFF_RATIO.easy)
  const hard = Math.round(size * DIFF_RATIO.hard)
  const target = { easy, hard, medium: size - easy - hard }

  const buckets: Record<string, MCQuestion[]> = { easy: [], medium: [], hard: [] }
  for (const q of ordered) buckets[q.difficulty]?.push(q)

  const chosen: MCQuestion[] = []
  const taken = new Set<string>()
  const take = (d: 'easy' | 'medium' | 'hard', n: number) => {
    for (const q of buckets[d]) {
      if (chosen.length >= size || n <= 0) break
      if (taken.has(q.id)) continue
      chosen.push(q)
      taken.add(q.id)
      n--
    }
  }
  take('easy', target.easy)
  take('medium', target.medium)
  take('hard', target.hard)
  // 某一層唔夠就由剩低嘅補足，唔會少過可出嘅題數。
  if (chosen.length < size) {
    for (const q of ordered) {
      if (chosen.length >= size) break
      if (taken.has(q.id)) continue
      chosen.push(q)
      taken.add(q.id)
    }
  }
  return chosen
}

/**
 * 由 spec + 題庫重建一份卷。純函數：同樣輸入 ⇒ 同樣輸出（跨裝置一致）。
 * pool 由 caller 傳入（getSubjectQuestions / getQuestionsByTopic），方便 code-split。
 */
/**
 * 抽乙部書寫題。同 `buildPaper` 一樣係純函數，同一 spec 跨裝置重建到同一批題。
 *
 * ⚠️ 刻意用【獨立 seed 流】（`${seed}|written|…`），唔可以把 `written` 併入
 * `buildPaper` 嗰條 rng 字串 —— 一併就會令加乙部連甲部 MC 都換咗一批，
 * 舊卷號重建唔到原本嗰份卷。兩部各行各路，加乙部對甲部零影響。
 */
export function buildWrittenSection(spec: PaperSpec, pool: AnyQuestion[]): WrittenQuestion[] {
  const n = Math.min(spec.written ?? 0, MAX_WRITTEN)
  if (n <= 0) return []
  const written = pool.filter(isWrittenQuestion)
  if (written.length === 0) return []
  const rnd = rngFrom(`${spec.seed}|written|${spec.subject}|${spec.topic}`)
  return shuffled(written, rnd).slice(0, n)
}

export function buildPaper(spec: PaperSpec, pool: Question[]): PaperItem[] {
  const mc = pool.filter((q): q is MCQuestion => q.type === 'mc')
  const rnd = rngFrom(`${spec.subject}|${spec.topic}|${spec.size}|${spec.seed}`)
  const picked = pickByDifficulty(shuffled(mc, rnd), Math.min(spec.size, MAX_SIZE))

  return picked.map((q) => {
    // 每題自己一條 seed 流，令選項次序同樣可重建。
    const optRnd = rngFrom(`${spec.seed}|${q.id}`)
    const order = shuffled(
      q.options.map((_, i) => i),
      optRnd,
    )
    return {
      question: q,
      options: order.map((i) => q.options[i]),
      optionsEn: order.map((i) => q.optionsEn?.[i] ?? q.options[i]),
      answerIndex: order.indexOf(q.correctIndex),
    }
  })
}

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const
