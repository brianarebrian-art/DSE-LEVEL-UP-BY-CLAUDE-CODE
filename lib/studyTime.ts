// 溫習時長分析 —— 純運算，零新表、零新 API、零新依賴。
//
// 數據源就係 `dse_progress`（`AttemptRecord[]`）已有嘅欄位：
//   elapsed（秒）· timestamp · score · total
// 呢啲欄位由 2026 年頭起就一直寫緊，亦一直經 /api/progress snapshot 同步，
// 所以「幾時溫、溫幾耐、邊個時段最有狀態」全部算得返出嚟，唔使加 `user_sessions`
// 呢類 server-side 追蹤（詳見 CHANGELOG 2026-08-05c 對 B 嘅判斷）。
//
// 大愛紅線：呢度所有輸出都係【描述】，唔係【評分】。冇「達標時數」、冇「你溫少咗」、
// 冇同其他人比較。學生睇完應該係「原來我夜晚清醒啲」，唔係「原來我唔夠勤力」。

import type { AttemptRecord } from '@/lib/progress'

/** 日界跟 lib/progress.ts 嘅 `dayKey` —— 本地零時，唔用 04:00 邊界，兩處保持一致。 */
function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function isUsable(a: AttemptRecord): boolean {
  return (
    typeof a?.timestamp === 'number' &&
    Number.isFinite(a.timestamp) &&
    typeof a.elapsed === 'number' &&
    Number.isFinite(a.elapsed) &&
    a.elapsed >= 0
  )
}

// ── 總覽 ────────────────────────────────────────────────────────────────

export interface StudyTotals {
  /** 累計秒數（窗口內） */
  seconds: number
  papers: number
  questions: number
  /** 平均每題秒數；冇題目時為 null（唔會出 0 扮成「快」） */
  secondsPerQuestion: number | null
  /** 平均每份卷秒數；冇卷時為 null */
  secondsPerPaper: number | null
  /** 有練習嘅日數（去重） */
  activeDays: number
}

/** `windowDays` 為 null 代表計全部歷史。 */
export function studyTotals(
  attempts: readonly AttemptRecord[],
  windowDays: number | null = null,
  now: number = Date.now(),
): StudyTotals {
  const from = windowDays === null ? -Infinity : startOfWindow(windowDays, now)
  const rows = attempts.filter((a) => isUsable(a) && a.timestamp >= from)

  const seconds = rows.reduce((s, a) => s + a.elapsed, 0)
  const questions = rows.reduce((s, a) => s + (a.total || 0), 0)
  const days = new Set(rows.map((a) => dayKey(a.timestamp)))

  return {
    seconds,
    papers: rows.length,
    questions,
    secondsPerQuestion: questions > 0 ? seconds / questions : null,
    secondsPerPaper: rows.length > 0 ? seconds / rows.length : null,
    activeDays: days.size,
  }
}

/** 窗口起點 = 今日零時往前推 (windowDays - 1) 日，令「今日」計入窗口。 */
function startOfWindow(windowDays: number, now: number): number {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - (windowDays - 1))
  return d.getTime()
}

// ── 逐日節奏 ────────────────────────────────────────────────────────────

export interface DayBar {
  /** 本地日 key，同 lib/progress.ts 一致 */
  key: string
  /** 當日零時 epoch ms，畀 UI 自己格式化 */
  ts: number
  seconds: number
  questions: number
}

/**
 * 最近 `days` 日逐日時長。**冇練習嘅日子照樣回傳一格（seconds = 0）**，
 * 咁條形圖先會保持等距，唔會令「休息咗兩日」視覺上消失。
 */
export function dailyBars(
  attempts: readonly AttemptRecord[],
  days = 14,
  now: number = Date.now(),
): DayBar[] {
  const buckets = new Map<string, DayBar>()
  const base = new Date(now)
  base.setHours(0, 0, 0, 0)

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base)
    d.setDate(d.getDate() - i)
    const ts = d.getTime()
    buckets.set(dayKey(ts), { key: dayKey(ts), ts, seconds: 0, questions: 0 })
  }

  for (const a of attempts) {
    if (!isUsable(a)) continue
    const b = buckets.get(dayKey(a.timestamp))
    if (!b) continue // 窗口外
    b.seconds += a.elapsed
    b.questions += a.total || 0
  }

  return [...buckets.values()]
}

// ── 時段狀態 ────────────────────────────────────────────────────────────

export type SlotKey = 'dawn' | 'morning' | 'afternoon' | 'evening'

export interface TimeSlot {
  key: SlotKey
  /** 起始鐘數（含）同結束鐘數（含），本地時間 */
  fromHour: number
  toHour: number
  papers: number
  questions: number
  correct: number
  seconds: number
  /** 正確率 0–1；樣本為 0 時係 null（唔會用 0 扮成「全錯」） */
  accuracy: number | null
}

const SLOT_DEFS: { key: SlotKey; fromHour: number; toHour: number }[] = [
  { key: 'dawn', fromHour: 0, toHour: 4 }, // 深夜
  { key: 'morning', fromHour: 5, toHour: 11 }, // 早上
  { key: 'afternoon', fromHour: 12, toHour: 17 }, // 下午
  { key: 'evening', fromHour: 18, toHour: 23 }, // 夜晚
]

export function timeSlots(attempts: readonly AttemptRecord[]): TimeSlot[] {
  const slots: TimeSlot[] = SLOT_DEFS.map((d) => ({
    ...d,
    papers: 0,
    questions: 0,
    correct: 0,
    seconds: 0,
    accuracy: null,
  }))

  for (const a of attempts) {
    if (!isUsable(a)) continue
    const h = new Date(a.timestamp).getHours()
    const slot = slots.find((s) => h >= s.fromHour && h <= s.toHour)
    if (!slot) continue
    slot.papers++
    slot.questions += a.total || 0
    slot.correct += a.score || 0
    slot.seconds += a.elapsed
  }

  for (const s of slots) {
    s.accuracy = s.questions > 0 ? s.correct / s.questions : null
  }
  return slots
}

/**
 * 樣本門檻：一個時段要夠 `MIN_QUESTIONS_PER_SLOT` 題先算得上「有規律」。
 * 低過呢個數就唔顯示「你最有狀態嘅時段」—— 用兩三題去講一個學生嘅生理節奏，
 * 就係虛構統計，同憲章禁「假數據」係同一條線。
 */
export const MIN_QUESTIONS_PER_SLOT = 20

/** 樣本足夠嘅時段之中，正確率最高嗰個。唔夠樣本就回 null（UI 顯示「再做多幾份」）。 */
export function bestSlot(slots: readonly TimeSlot[]): TimeSlot | null {
  const eligible = slots.filter(
    (s) => s.questions >= MIN_QUESTIONS_PER_SLOT && s.accuracy !== null,
  )
  if (eligible.length < 2) return null // 得一個時段唔存在「最」，冇比較就冇意義
  return eligible.reduce((best, s) => (s.accuracy! > best.accuracy! ? s : best))
}

// ── 格式化 ──────────────────────────────────────────────────────────────

/** 「2 小時 35 分」／「35 分鐘」／「48 秒」。少過 1 分鐘照講秒，唔會四捨五入成 0。 */
export function formatDuration(seconds: number, en: boolean): string {
  // ⚠️ Math.max(0, NaN) 係 NaN（唔會被夾住），跟住每個比較都 false，
  // 最後會渲染出「NaN 分鐘」。所以要先擋 NaN／Infinity 再夾。
  const s = Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : 0
  if (s < 60) return en ? `${s} sec` : `${s} 秒`
  const m = Math.round(s / 60)
  if (m < 60) return en ? `${m} min` : `${m} 分鐘`
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (rem === 0) return en ? `${h} hr` : `${h} 小時`
  return en ? `${h} hr ${rem} min` : `${h} 小時 ${rem} 分`
}
