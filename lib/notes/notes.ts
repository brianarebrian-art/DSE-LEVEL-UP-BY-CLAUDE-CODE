// 知識凝結 CONDENSE —— 按課題聚合出「筆記」。
//
// ⚠️ 呢度【冇】任何 AI 摘要，亦【唔會】生成新內容。原 spec 要求「取該 topic 下所有
// 解析嘅交集精華」自動生成 ConceptNode —— 同時又禁用任何付費 API。冇 LLM 之下，
// 純 JS 對中文做語義摘要只會出垃圾，而呢啲字係俾學生當溫書筆記讀嘅，作嘢比出錯題
// 更危險。所以改為【確定性聚合】：全部內容都係已經人手審過／公式保證嘅原文，
// 只係換個角度（by topic + by 你嘅錯題）重新排列。
//
// 三種素材，全部真實可追溯：
//   1. 題庫本身 —— 題數、難度分佈、解析【原文】（唔改寫、唔截斷語義）
//   2. 解析入面嘅「陷阱：…」段落 —— 呢個係作者寫落去嘅【結構化標記】，
//      用字面分隔符切出嚟係確定性解析，唔係語義摘要。冇呢個標記就唔顯示。
//   3. 你自己嘅 localStorage —— reverseLog（做錯咗邊題、錯因 A/B/C）、topicStats（命中率）
//
// 冇數據就老實講「仲未有」，唔會砌假數。

import type { AnyQuestion, MCQuestion } from '@/data/questions/types'
import type { ReverseLogEntry } from '@/lib/reverseLog'
import type { TopicStatEntry } from '@/lib/topicStats'

export interface TrapNote {
  questionId: string
  /** 解析入面「陷阱：」之後嗰段原文（唔改寫） */
  text: string
}

export interface WrongNote {
  questionId: string
  content: string
  explanation: string
  /** 你當時揀咗嘅錯因 A/B/C（最近一次） */
  cause: ReverseLogEntry['cause']
  ts: number
}

export interface TopicNote {
  topicId: string
  label: string
  emoji: string
  total: number
  difficulty: { easy: number; medium: number; hard: number }
  /** 你做過幾多、錯咗幾多（冇做過 = null，唔會當 0% 咁寫） */
  attempted: number | null
  wrong: number | null
  /** 你喺呢個課題錯過嘅題（最近優先，最多 5 條） */
  yourMistakes: WrongNote[]
  /** 作者標註嘅常見陷阱（原文，最多 6 條，已去重） */
  traps: TrapNote[]
}

// 解析入面嘅「陷阱：」段。作者慣例係喺解析尾寫「…。陷阱：xxx。」
// 用字面標記切割 —— 確定性，唔涉理解內容。
const TRAP_RE = /陷阱[：:]\s*([^]*)$/

export function extractTrap(explanation: string): string | null {
  const m = TRAP_RE.exec(String(explanation ?? ''))
  const seg = m?.[1]?.trim()
  return seg ? seg : null
}

/**
 * 去重用嘅「形狀」key。參數化題庫同一個 family 會生成一大堆只係數字唔同嘅陷阱
 * （「由 (x−1)=0 移項…」「由 (x−2)=0 移項…」…），字面去重攔唔到，結果一個課題
 * 會顯示六條同一句嘢 —— 當筆記睇完全冇用。所以剷走所有數字同空白先比較，
 * 同一 family 只會留一條代表。
 */
export function trapShape(text: string): string {
  return String(text)
    // 先剷 LaTeX：\frac{25}{4} 同 9 都應該當「一個數」，唔係兩種陷阱
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[${}\\]/g, '')
    .replace(/[0-9０-９]+/g, '')
    .replace(/[−\-+/]/g, '')
    .replace(/\s+/g, '')
}

// 本檔一早已經有呢個守衛（`Question = MCQuestion` 年代嘅前瞻寫法），
// 2026-07-31 題庫真正變成混合型之後，佢由「防禦性」變成「必要」。
function isMC(q: AnyQuestion): q is MCQuestion {
  return q.type === 'mc'
}

/**
 * 由真題庫 + 你嘅 localStorage 砌一個課題嘅筆記。純函數、確定性。
 * 冇 localStorage 數據時 attempted/wrong = null，UI 會顯示「仲未做過」。
 */
export function buildTopicNote(
  topicId: string,
  label: string,
  emoji: string,
  questions: AnyQuestion[],
  reverseLog: ReverseLogEntry[],
  stat: TopicStatEntry | undefined,
): TopicNote {
  const inTopic = questions.filter((q) => q.topic === topicId)

  const difficulty = { easy: 0, medium: 0, hard: 0 }
  for (const q of inTopic) difficulty[q.difficulty]++

  // 你錯過嘅題（reverseLog 已係最近優先）
  const byId = new Map(inTopic.map((q) => [q.id, q]))
  const seen = new Set<string>()
  const yourMistakes: WrongNote[] = []
  for (const entry of reverseLog) {
    if (entry.topicId !== topicId && entry.topic !== label) continue
    if (seen.has(entry.questionId)) continue
    const q = byId.get(entry.questionId)
    if (!q || !isMC(q)) continue
    seen.add(entry.questionId)
    yourMistakes.push({
      questionId: q.id,
      content: q.content,
      explanation: q.explanation,
      cause: entry.cause,
      ts: entry.ts,
    })
    if (yourMistakes.length >= 5) break
  }

  // 作者標註嘅陷阱（原文、去重）—— 優先出你錯過嗰啲題嘅陷阱
  const wrongIds = new Set(yourMistakes.map((m) => m.questionId))
  const ordered = [...inTopic].sort((a, b) => Number(wrongIds.has(b.id)) - Number(wrongIds.has(a.id)))
  const traps: TrapNote[] = []
  const shapes = new Set<string>()
  for (const q of ordered) {
    if (!isMC(q)) continue
    const t = extractTrap(q.explanation)
    if (!t) continue
    const shape = trapShape(t)
    if (shapes.has(shape)) continue // 同一 family 嘅數字變體只留一條
    shapes.add(shape)
    traps.push({ questionId: q.id, text: t })
    if (traps.length >= 6) break
  }

  return {
    topicId,
    label,
    emoji,
    total: inTopic.length,
    difficulty,
    attempted: stat ? stat.total : null,
    wrong: stat ? stat.wrong : null,
    yourMistakes,
    traps,
  }
}

/** 命中率（%）。未做過回傳 null —— 唔會當 0% 顯示。 */
export function accuracy(note: TopicNote): number | null {
  if (note.attempted === null || note.attempted === 0 || note.wrong === null) return null
  return Math.round(((note.attempted - note.wrong) / note.attempted) * 100)
}
