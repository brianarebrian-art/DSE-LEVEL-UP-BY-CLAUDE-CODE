// 無聲難度自適應（第 3 週 · 引擎五）
//
// 規格書 §4.6。呢個模組【只做排序，唔做抽樣】—— 呢點係整個設計嘅關鍵。
//
// 點解唔重新抽題？同一節 §4.6 一邊要求「連續答對 3 題 → 下一題難度 +1」，
// 一邊又要求「整體維持 3:5:2 比例」。兩者只有一個做法可以同時成立：
// 一節嘅二十條題目喺開始嗰刻已經按 3:5:2 抽好（見 PracticeSession.buildPool），
// 之後自適應只決定【下一條由呢廿條入面攞邊一條】。
// 於是比例分毫不變，而學生真係感受到節奏跟住佢走。
//
// 「無聲」嘅意思係字面：呢個模組唔會回傳任何可顯示嘅訊息，
// 呼叫端亦冇任何 UI 講「難度上升／下降」。學生只會覺得「啱啱好」。
// 憲章第 7 條：難度變化提示本身就係一種評價，會令答錯嗰下再被講多一次。

import type { Difficulty } from '@/data/questions'

/** 連續答對幾多題，先向上調。 */
export const UP_STREAK = 3
/** 連續答錯幾多題，先向下調。 */
export const DOWN_STREAK = 2

/** 由淺入深。上限 hard，下限 easy —— 兩端都唔會再郁。 */
export const TIERS: readonly Difficulty[] = ['easy', 'medium', 'hard'] as const

export interface StreakState {
  /** 連續答對數（答錯即歸零） */
  correct: number
  /** 連續答錯數（答啱即歸零） */
  wrong: number
}

export const EMPTY_STREAK: StreakState = { correct: 0, wrong: 0 }

/** 記一題結果，回傳新嘅連續狀態。純函數，方便測試。 */
export function advanceStreak(prev: StreakState, isCorrect: boolean): StreakState {
  return isCorrect ? { correct: prev.correct + 1, wrong: 0 } : { correct: 0, wrong: prev.wrong + 1 }
}

function shift(tier: Difficulty, step: number): Difficulty {
  const i = TIERS.indexOf(tier)
  if (i < 0) return tier
  return TIERS[Math.min(TIERS.length - 1, Math.max(0, i + step))]
}

/**
 * 下一題想要邊個層級。null = 冇偏好，照原本次序行。
 *
 * @param current 啱啱做完嗰題嘅層級（決定由邊度加減）
 * @param streak  連續狀態
 * @param manual  學生手動揀咗嘅層級。有嘅話【永遠】蓋過自適應 ——
 *                規格書 §4.6 設計原則：始終保留手動選擇權。
 */
export function preferredTier(
  current: Difficulty | null,
  streak: StreakState,
  manual: Difficulty | null = null,
): Difficulty | null {
  if (manual) return manual
  if (!current) return null
  if (streak.correct >= UP_STREAK) return shift(current, +1)
  if (streak.wrong >= DOWN_STREAK) return shift(current, -1)
  return null
}

/**
 * 由剩低嘅題目入面揀下一條嘅索引。
 *
 * 搵唔到偏好層級就回傳 0 —— 即係照原本已經洗好牌嘅次序行。
 * 【唔會】為咗夾硬達成偏好而換走題目：一節嘅題目集合由頭到尾唔變，
 * 所以 3:5:2 比例喺任何情況下都保持原樣。
 */
export function nextIndex(remaining: readonly Difficulty[], preferred: Difficulty | null): number {
  if (remaining.length === 0) return -1
  if (!preferred) return 0
  const i = remaining.indexOf(preferred)
  return i >= 0 ? i : 0
}
