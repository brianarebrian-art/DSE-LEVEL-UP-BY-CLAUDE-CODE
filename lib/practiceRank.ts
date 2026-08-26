// ============================================================================
// practiceRank.ts —— 練習段位狀態機（EXP／段位／累積練習）
//
// 2026-08-26 由 arena.ts 改名（日次 4，Yuna 拍板）。純命名改動，行為零改變。
// 點解要改：舊名「競技場」暗示同儕比較，同 2027 安全文件嘅「不可同儕比較」
// 讀落好似撞。實情本模組【從來冇】任何同儕比較、排行榜或百分位 —— 學生見到
// 嘅一直都係「練習段位」。改名係令個名對得返住個行為，唔係改行為。
// ----------------------------------------------------------------------------
// 憲章 §8.1（2026-08-22 解禁）之下嘅遊戲化層。
//
// ══ 最重要嘅一個設計決定：全部係【導出值】，唔係另一份儲存 ══
//
// 本模組【唔會】寫任何嘢入 localStorage，亦【唔會】要求練習頁記錄任何額外資料。
// EXP、段位、連續練習日全部由既有嘅 `dse_progress`（loadAttempts）當場算出。
//
// 點解要咁：Yuna 2026-08-22 指示「遊戲化盡量唔可以影響到 practice 嗰度」。
// 一旦遊戲化層有自己嘅一份儲存，練習頁就要負責喺每次作答時同步佢 ——
// 咁就等於將遊戲化嘅節奏塞入咗學生嘅作答流程，正正係嗰句指示想避免嘅嘢。
// 導出值冇呢個問題：練習頁一行都唔使改，數據對唔上亦唔可能（同一個來源）。
//
// 代價要講清楚：規格書 §2.6 嘅「練習期間即時連擊火焰」做唔到，因為逐題對錯
// 喺一節完成之後就冇再保留（saveActiveSession 完成即清）。要做真・逐題連擊
// 就一定要改 PracticeSession。故此本模組嘅「連擊」係【節與節之間】嘅連續，
// 唔係題與題之間 —— 呢個係刻意取捨，唔係做漏。
//
// ══ 憲章 §7 大愛設計：呢個層【永不倒扣】 ══
//
// EXP 只加唔減，段位只升唔跌。休息一日、考得差、放棄一節 —— 一律唔會令
// 學生睇住個數字跌返落去。理由同 progress.ts 嘅「連續打卡改為窗口計數」
// 一樣：歸零式回饋對焦慮傾向嘅學生係純粹嘅壓力源，對 ADHD 學生就令重新
// 開始嘅門檻更高。
// ============================================================================

import { loadAttempts, type AttemptRecord } from '@/lib/progress'

export interface Rank {
  id: string
  zh: string
  en: string
  /** 升到呢個段位所需嘅累計 EXP */
  at: number
}

/**
 * 段位名刻意描述【習慣】而唔係【成績】。
 *
 * 唔可以用任何似 DSE 等級或者暗示考試結果嘅名（例如「5** 級」「Band A」）——
 * 咁樣等於做等級預測，而等級預測屬憲章 §8 永久否決項目，亦係虛構統計。
 * 用「起步／站穩／上手」呢類講練習狀態嘅詞，講嘅係學生做咗幾多、有幾持續，
 * 呢個係我哋真係量度得到嘅嘢。
 */
export const RANKS: Rank[] = [
  { id: 'start',    zh: '起步', en: 'Starting Out',    at: 0 },
  { id: 'footing',  zh: '站穩', en: 'Finding Footing', at: 500 },
  { id: 'fluent',   zh: '上手', en: 'Getting Fluent',  at: 1500 },
  { id: 'practised',zh: '熟練', en: 'Well Practised',  at: 3500 },
  { id: 'sharp',    zh: '精進', en: 'Sharpening',      at: 7000 },
  { id: 'staying',  zh: '恆心', en: 'Staying Power',   at: 12000 },
]

/**
 * 一次練習所得 EXP。
 *
 * 兩個部分：答對得 10 分，答過（唔論啱唔啱）得 2 分。
 * 後者刻意保留 —— 一個答錯十九題嘅學生依然攞到分。呢個唔係「參與獎」，
 * 而係因為對基礎薄弱嘅學生嚟講，肯做完二十題本身就係要克服嘅嘢；
 * 若果 EXP 淨係獎勵準確率，越弱嘅學生獲得嘅回饋越少，同大愛設計相反。
 */
export function attemptExp(a: Pick<AttemptRecord, 'score' | 'total'>): number {
  const score = Number.isFinite(a.score) ? Math.max(0, a.score) : 0
  const total = Number.isFinite(a.total) ? Math.max(0, a.total) : 0
  return score * 10 + total * 2
}

export interface PracticeRankState {
  exp: number
  rank: Rank
  /** 下一段位；已到頂則為 null */
  next: Rank | null
  /** 距離下一段位仲差幾多 EXP；已到頂則為 0 */
  toNext: number
  /** 喺目前段位區間之內嘅進度（0–1）；已到頂則為 1 */
  progress: number
  /** 練習過嘅不同日子總數（去重，唔會因為休息而歸零）*/
  activeDays: number
  /** 累計完成嘅練習節數 */
  sessions: number
}

/** 由 attempts 導出競技場狀態。純函數 —— 方便測試，亦唔掂 localStorage。 */
export function computePracticeRank(attempts: AttemptRecord[]): PracticeRankState {
  let exp = 0
  const days = new Set<string>()
  for (const a of attempts) {
    exp += attemptExp(a)
    if (typeof a.timestamp === 'number') {
      const d = new Date(a.timestamp)
      days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
    }
  }

  // 由高至低搵第一個達標嘅段位 —— 只升不跌係定義上嘅結果，
  // 因為 exp 只加唔減，而段位純粹係 exp 嘅函數。
  let rank = RANKS[0]
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (exp >= RANKS[i].at) { rank = RANKS[i]; break }
  }
  const idx = RANKS.indexOf(rank)
  const next = idx < RANKS.length - 1 ? RANKS[idx + 1] : null
  const span = next ? next.at - rank.at : 0
  const done = exp - rank.at

  return {
    exp,
    rank,
    next,
    toNext: next ? Math.max(0, next.at - exp) : 0,
    progress: next && span > 0 ? Math.min(1, Math.max(0, done / span)) : 1,
    activeDays: days.size,
    sessions: attempts.length,
  }
}

/** 讀本機進度並導出競技場狀態。SSR 之下 loadAttempts 回 []，故安全。 */
export function getPracticeRank(): PracticeRankState {
  return computePracticeRank(loadAttempts())
}
