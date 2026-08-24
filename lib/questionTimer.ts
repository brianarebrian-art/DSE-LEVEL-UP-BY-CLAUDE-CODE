// 可選計時模式（第 3 週 · 引擎五之二）
//
// 規格書 §4.9。設計上最緊要嗰三點：
//   1. 【純可選，預設關閉】—— 焦慮症考生唔應該喺無意之中被計時。
//   2. 【時間到唔強制結束】—— 到零之後題目照做，冇自動交卷、冇跳題、冇扣分。
//      到零只係出一句「時間到，休息一下」，然後就冇下文。
//   3. 【隱藏計時器設定蓋過呢個模式】—— A11yPanel 嘅「隱藏練習計時器」一開，
//      連倒數同「時間到」提示都唔會出。呢點係刻意行得比規格書更遠：
//      規格書 §4.9 只講「計時器可隱藏」，但一句「時間到」本身就係時間壓力，
//      藏起數字而留低嗰句，等於冇藏過。
//
// 純 localStorage，零成本。

export const QUESTION_TIMER_KEY = 'dse_question_timer'

/** 0 = 關閉。其餘係每題秒數。 */
export const TIMER_OPTIONS = [0, 60, 90] as const
export type TimerOption = (typeof TIMER_OPTIONS)[number]

export const DEFAULT_TIMER: TimerOption = 0

function isOption(n: number): n is TimerOption {
  return (TIMER_OPTIONS as readonly number[]).includes(n)
}

/** 讀取每題秒數設定。任何唔認得嘅值一律當關閉 —— 出錯要向「唔計時」嗰邊倒。 */
export function getQuestionTimer(): TimerOption {
  if (typeof window === 'undefined') return DEFAULT_TIMER
  try {
    const n = Number(localStorage.getItem(QUESTION_TIMER_KEY))
    return isOption(n) ? n : DEFAULT_TIMER
  } catch {
    return DEFAULT_TIMER
  }
}

export function setQuestionTimer(v: TimerOption): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(QUESTION_TIMER_KEY, String(v))
  } catch {
    /* ignore */
  }
}

/** 剩返幾多秒。永遠唔會負數 —— 「超時咗幾多」本身就係一個責備。 */
export function remainingSeconds(limit: TimerOption, spentSeconds: number): number {
  if (limit === 0) return 0
  return Math.max(0, limit - Math.max(0, Math.floor(spentSeconds)))
}

/** 時間到未。limit = 0（關閉）永遠當作未到。 */
export function isTimeUp(limit: TimerOption, spentSeconds: number): boolean {
  return limit !== 0 && remainingSeconds(limit, spentSeconds) === 0
}
