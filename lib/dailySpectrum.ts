'use client'

// F-PRG: 今日學習光譜數據層 — 每答一題按難度記一筆，純 localStorage、按日自動重置。
// 誠實原則：只記真實作答（唔靠估算），冇歷史數據嗰日就由 0 開始。
// 3:5:2 目標（3 基礎／5 核心／2 進階）只係當日建議節奏，唔係壓力指標。

import { hkDayString } from '@/lib/hkTime'

export interface DaySpectrum {
  date: string // YYYY-MM-DD（HKT，04:00 日界線 — 見 lib/hkTime.ts）
  easy: number
  medium: number
  hard: number
  /** 答對數。舊紀錄冇呢三個欄，介面就只顯示已練習、唔假裝知道答對幾多。 */
  easyCorrect?: number
  mediumCorrect?: number
  hardCorrect?: number
}

const KEY = 'dse_daily_spectrum'

// 「一日」嘅界線 = 04:00 HKT（同「今晚唔溫得」對齊）：凌晨 00:30 溫書仍計作前
// 一晚，唔會過咗午夜就無情歸零 —— 深夜溫書係 DSE 考生真實場景。
// 憲章 v3.2 §1.4：以香港時間計，唔跟裝置時區（每日重置全港一致）。
function todayStr(): string {
  return hkDayString()
}

export function getTodaySpectrum(): DaySpectrum {
  const empty: DaySpectrum = { date: todayStr(), easy: 0, medium: 0, hard: 0 }
  if (typeof window === 'undefined') return empty
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return empty
    const s: DaySpectrum = JSON.parse(raw)
    return s.date === todayStr() ? s : empty // 過咗一日自動歸零
  } catch {
    return empty
  }
}

const CORRECT_KEY = {
  easy: 'easyCorrect',
  medium: 'mediumCorrect',
  hard: 'hardCorrect',
} as const

/** 每答一題記一次已練習；correct 為真先另計答對。兩組數字分開，避免把做過當成掌握。 */
export function recordSpectrumAnswer(difficulty: 'easy' | 'medium' | 'hard', correct = false): void {
  if (typeof window === 'undefined') return
  try {
    const s = getTodaySpectrum()
    s[difficulty] += 1
    const key = CORRECT_KEY[difficulty]
    s[key] = (s[key] ?? 0) + (correct ? 1 : 0)
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* best-effort */
  }
}
