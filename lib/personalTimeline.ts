// 個人進度時間軸（第 3 週 · 引擎二之二）
//
// 規格書 §4.8。唯一嘅比較對象係【你自己嘅上一段時間】。
// 呢個模組結構上收唔到任何其他人嘅數據 —— 三個資料源全部係本機 localStorage，
// 冇任何一個帶得到班別、平均分或者百分位。所以「你超越咗 X% 學生」呢類句子
// 唔係我哋忍住唔寫，而係根本冇數可以計。
//
// 大愛紅線（憲章第 7 條）：數字跌咗【唔可以】讀成失敗。
// 所以呢個模組只回傳原始數字同差額，唔回傳任何「進步／退步」嘅判斷，
// 亦唔提供好壞方向 —— 由 UI 用中性措辭呈現。
// 一個星期做少咗題，可能係考試週、可能係病咗、可能係屋企有事，
// 平台冇資格幫呢件事定性。

import { loadAttempts } from '@/lib/progress'
import { getReverseLog, type ReverseCause } from '@/lib/reverseLog'
import { loadReviewDone } from '@/lib/reviewSchedule'

export interface PeriodStats {
  /** 呢段時間做咗幾多題 */
  questions: number
  /** 完成咗幾多次錯題重溫 */
  reviews: number
  /** 有練習嘅日數 */
  activeDays: number
  /** 三種錯因各出現幾多次 */
  causes: Record<ReverseCause, number>
}

export interface TimelineComparison {
  label: 'week' | 'month'
  current: PeriodStats
  previous: PeriodStats
}

const DAY = 86400000

function emptyPeriod(): PeriodStats {
  return { questions: 0, reviews: 0, activeDays: 0, causes: { A: 0, B: 0, C: 0 } }
}

/**
 * 一段時間嘅窗口 [start, end)。
 * 星期以【星期一 00:00】為界（香港學生嘅一週普遍咁數）；月份以 1 號為界。
 * 用本地時區 —— 呢個平台嘅使用者全部喺香港，冇必要為咗時區純度而令
 * 「今個星期」同學生自己嘅日曆對唔上。
 */
export function windowFor(kind: 'week' | 'month', offset: number, now: number = Date.now()): [number, number] {
  const d = new Date(now)
  if (kind === 'week') {
    const dow = (d.getDay() + 6) % 7 // 星期一 = 0
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dow)
    const start = monday.getTime() + offset * 7 * DAY
    return [start, start + 7 * DAY]
  }
  const start = new Date(d.getFullYear(), d.getMonth() + offset, 1).getTime()
  const end = new Date(d.getFullYear(), d.getMonth() + offset + 1, 1).getTime()
  return [start, end]
}

/** `dse_review_done` 存嘅係 `{ [questionId]: 'YYYY-MM-DD' }`。 */
function reviewsIn(start: number, end: number): number {
  const done = loadReviewDone()
  let n = 0
  for (const day of Object.values(done)) {
    const t = new Date(`${day}T00:00:00`).getTime()
    if (Number.isFinite(t) && t >= start && t < end) n++
  }
  return n
}

export function statsIn(start: number, end: number): PeriodStats {
  const out = emptyPeriod()
  const days = new Set<string>()
  for (const a of loadAttempts()) {
    if (a.timestamp < start || a.timestamp >= end) continue
    out.questions += a.total
    const d = new Date(a.timestamp)
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
  }
  out.activeDays = days.size
  for (const e of getReverseLog()) {
    if (e.ts < start || e.ts >= end) continue
    out.causes[e.cause]++
  }
  out.reviews = reviewsIn(start, end)
  return out
}

export function compare(kind: 'week' | 'month', now: number = Date.now()): TimelineComparison {
  const [cs, ce] = windowFor(kind, 0, now)
  const [ps, pe] = windowFor(kind, -1, now)
  return { label: kind, current: statsIn(cs, ce), previous: statsIn(ps, pe) }
}

/**
 * 兩段時間都完全冇數據 —— UI 應該乜都唔顯示，而唔係顯示一堆 0。
 * 一版 0 對啱啱開始用嘅學生嚟講，讀落係「你乜都冇做過」。
 */
export function isBlank(c: TimelineComparison): boolean {
  const empty = (p: PeriodStats) =>
    p.questions === 0 && p.reviews === 0 && p.activeDays === 0 &&
    p.causes.A === 0 && p.causes.B === 0 && p.causes.C === 0
  return empty(c.current) && empty(c.previous)
}
