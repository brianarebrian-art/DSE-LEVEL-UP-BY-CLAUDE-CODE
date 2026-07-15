'use client'

// F-PRG: 今日學習光譜數據層 — 每答一題按難度記一筆，純 localStorage、按日自動重置。
// 誠實原則：只記真實作答（唔靠估算），冇歷史數據嗰日就由 0 開始。
// 3:5:2 目標（3 基礎／5 核心／2 進階）只係當日建議節奏，唔係壓力指標。

export interface DaySpectrum {
  date: string // YYYY-MM-DD（學生裝置時區）
  easy: number
  medium: number
  hard: number
}

const KEY = 'dse_daily_spectrum'

function todayStr(): string {
  return new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
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

export function recordSpectrumAnswer(difficulty: 'easy' | 'medium' | 'hard'): void {
  if (typeof window === 'undefined') return
  try {
    const s = getTodaySpectrum()
    s[difficulty] += 1
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* best-effort */
  }
}
