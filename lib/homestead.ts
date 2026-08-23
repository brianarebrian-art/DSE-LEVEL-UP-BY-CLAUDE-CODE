// ============================================================================
// homestead.ts —— 邏輯家園（Logic Homestead）
// ----------------------------------------------------------------------------
// 規格書：SPEC-GAMIFY-P1-20260822 §模組二。
//
// ══ 全部等級都是導出值 ══
//
// 規格書自己寫明：「家園等級完全由現有數據衍生計算，不需要獨立儲存家園
// 經驗值」，並列出三個理由（減少負擔、資料遺失可重建、防止只刷等級不做題）。
// 本實作照做，故 `dse_homestead_state` 與 `dse_homestead_cache` 兩個 key
// 【不會被寫入】——沒有東西需要快取，四個等級是幾百筆記錄的一次加總，
// 比讀一次 localStorage 還便宜。
//
// ══ 兩個區域的意義與規格書不同 ══
//
// 一、【圖書館：框架掌握 → 課題涉獵廣度】
//     平台並無量度「框架掌握」。理由與 lib/logicLog.ts 分歧二相同：題目上的
//     `framework` 是出題端的分類標籤，不是學生的掌握程度。改為數「做過多少個
//     不同課題」——涉獵廣度是真正記錄得到的，亦切合圖書館的意象。
//
// 二、【天文台：等級預測上升 → 重溫紀律】
//     規格書要求「等級預測持續上升或維持高檔」作為升級條件。不採用，兩個
//     理由：其一，把預測等級變成升級條件，等於叫學生追一個預測數字，與憲章 §7
//     「不可以有打擊自信的元素」的用意相反——預測跌了就等於家園倒退。其二，
//     「持續上升」需要逐日的預測快照，平台從來沒有存過，硬做出來就是虛構數據
//     （憲章 §8）。改為數已完成的艾賓浩斯重溫次數（`dse_review_done`）：
//     這是真實記錄，而且獎勵的正是最值得獎勵的行為——回頭重溫做錯過的題。
//
// ══ 憲章 §7：只升不跌 ══
//
// 四個輸入全部是累計計數（做題數、自診次數、涉獵課題數、重溫次數），
// 所以等級在數學上不可能下降。這不是巧合，是選擇這四個輸入的原因。
// ============================================================================

import { loadAttempts, type AttemptRecord } from '@/lib/progress'
import { getReverseLog, type ReverseLogEntry } from '@/lib/reverseLog'

export type ZoneId = 'forge' | 'garden' | 'library' | 'observatory'

export interface Zone {
  id: ZoneId
  zh: string
  en: string
  emoji: string
  /** 這個區域代表什麼學習行為（點擊建築時顯示）。 */
  meaningZh: string
  meaningEn: string
  /** 升到 Level 2–5 各自所需的數值；Level 1 為起步，門檻為 0。 */
  thresholds: [number, number, number, number]
  unitZh: string
  unitEn: string
}

/** 熔爐只計三個核心科——規格書 §模組二：數學／英文／中文。 */
export const CORE_SUBJECTS = ['math', 'english', 'chinese'] as const

export const ZONES: Zone[] = [
  {
    id: 'forge', zh: '熔爐', en: 'The Forge', emoji: '🔥',
    meaningZh: '核心三科（數學、英文、中文）累積做題數。三科是所有 DSE 考生都要面對的，故獨立成一區。',
    meaningEn: 'Questions attempted across the three core subjects — mathematics, English and Chinese — the papers every DSE candidate must sit.',
    thresholds: [60, 200, 500, 1000], unitZh: '題', unitEn: 'questions',
  },
  {
    id: 'garden', zh: '花園', en: 'The Garden', emoji: '🌱',
    meaningZh: '完成 60 秒反思鎖、為自己的錯誤定位過的次數。找出盲點本身就是進步，不論那一題最後有沒有答對。',
    meaningEn: 'Times you worked through the 60-second reflection lock and named the cause of a mistake. Locating a blind spot is progress in itself.',
    thresholds: [10, 40, 100, 250], unitZh: '次', unitEn: 'times',
  },
  {
    id: 'library', zh: '圖書館', en: 'The Library', emoji: '📚',
    meaningZh: '做過的不同課題數目。書架上多一格，代表你的涉獵闊了一分，而不是某一題答得多好。',
    meaningEn: 'The number of distinct topics you have practised. Each shelf marks breadth of coverage, not marks on any single question.',
    thresholds: [15, 45, 90, 160], unitZh: '個課題', unitEn: 'topics',
  },
  {
    id: 'observatory', zh: '天文台', en: 'The Observatory', emoji: '🔭',
    meaningZh: '完成的錯題重溫次數。回頭做一次做錯過的課題，比多做一題新題有用——這一區獎勵的就是這件事。',
    meaningEn: 'Spaced reviews completed. Returning to a topic you once got wrong is worth more than one more fresh question — this is what this zone rewards.',
    thresholds: [3, 12, 30, 70], unitZh: '次', unitEn: 'times',
  },
]

export const MAX_LEVEL = 5

export interface ZoneState {
  zone: Zone
  /** 1–5 */
  level: number
  /** 目前的累計數值 */
  value: number
  /** 升到下一級所需數值；已滿級為 null */
  nextAt: number | null
  /** 目前等級區間內的進度（0–1）；滿級為 1 */
  progress: number
}

export interface HomesteadState {
  zones: ZoneState[]
  /** 四區等級總和（5–20），用於「家園整體」的一句話摘要 */
  total: number
}

function levelFor(value: number, thresholds: Zone['thresholds']): ZoneState['level'] {
  let level = 1
  for (const t of thresholds) if (value >= t) level++
  return level
}

function zoneState(zone: Zone, value: number): ZoneState {
  const level = levelFor(value, zone.thresholds)
  const floor = level === 1 ? 0 : zone.thresholds[level - 2]
  const nextAt = level >= MAX_LEVEL ? null : zone.thresholds[level - 1]
  const span = nextAt === null ? 0 : nextAt - floor
  return {
    zone,
    level,
    value,
    nextAt,
    progress: nextAt === null || span <= 0 ? 1 : Math.min(1, Math.max(0, (value - floor) / span)),
  }
}

export interface HomesteadInput {
  attempts: readonly AttemptRecord[]
  reverse: readonly ReverseLogEntry[]
  /** 已完成的重溫次數（`dse_review_done` 的項目數）。 */
  reviewsDone: number
}

/** 由現有數據導出家園狀態。純函數——不碰 localStorage，方便測試。 */
export function computeHomestead(input: HomesteadInput): HomesteadState {
  let core = 0
  const topics = new Set<string>()
  for (const a of input.attempts) {
    const total = Number.isFinite(a.total) ? Math.max(0, a.total) : 0
    if ((CORE_SUBJECTS as readonly string[]).includes(a.subjectId)) core += total
    for (const r of a.topicResults ?? []) if (r?.topic) topics.add(`${a.subjectId}/${r.topic}`)
  }
  const values: Record<ZoneId, number> = {
    forge: core,
    garden: input.reverse.length,
    library: topics.size,
    observatory: Math.max(0, input.reviewsDone),
  }
  const zones = ZONES.map((z) => zoneState(z, values[z.id]))
  return { zones, total: zones.reduce((s, z) => s + z.level, 0) }
}

const REVIEW_DONE_KEY = 'dse_review_done'

/** 讀已完成重溫次數。與 components/ReviewScheduler.tsx 寫入的是同一個 key。 */
export function readReviewsDone(): number {
  if (typeof window === 'undefined') return 0
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(REVIEW_DONE_KEY) ?? '{}')
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return 0
    return Object.keys(parsed as Record<string, unknown>).length
  } catch {
    return 0
  }
}

/** 讀本機資料並導出家園狀態。SSR 之下全部來源回空，故安全。 */
export function getHomestead(): HomesteadState {
  return computeHomestead({
    attempts: loadAttempts(),
    reverse: getReverseLog(),
    reviewsDone: readReviewsDone(),
  })
}
