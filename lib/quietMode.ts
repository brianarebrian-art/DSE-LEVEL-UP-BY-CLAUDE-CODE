'use client'

import { useEffect, useState } from 'react'

// 安靜模式 —— dashboard 收埋段位／EXP 同溫習時數（2026-09-15）。
//
// ══ 點解要有 ══
// 憲章 §8.1 約束 4：「SEN 必須可以整層關掉 —— 一鍵舒適模式之下，連擊、火焰、粒子、
// 成就彈窗全部隱藏，唔係調慢。」2026-09-15 查到舒適模式只收埋 html.font-easy 嘅
// 裝飾層（粒子、火焰），PracticeRankCard（段位＋EXP）完全冇理佢 —— 即係約束 4
// 喺 dashboard 冇兌現。《v4 Final Lean》§6 嘅「安靜模式」正好補呢個洞。
//
// ══ 收埋咩（刻意收窄）══
// 只收：段位／EXP（PracticeRankCard）、溫習時數（StudyTimeInsight）。
// 唔收：錯因雷達、正確率曲線 —— 嗰啲係學習資訊，唔係遊戲化或者計時壓力。
// 規格書寫嘅「streak／排名」本身唔存在（no-daily-streak 測試、§16.E 約束 3），冇嘢可收。
//
// ══ 同步 ══
// 用現有嘅 `dse-a11y` 事件：A11yPanel 嘅一鍵舒適模式開嘅時候會一齊寫呢個 key，
// dashboard 唔使 reload 就跟到。⚠️ 刻意唔入 lib/sync.ts（§16.E）。

export const QUIET_KEY = 'dse_quiet_mode'

export function isQuiet(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(QUIET_KEY) === '1'
  } catch {
    return false
  }
}

export function setQuiet(on: boolean): void {
  try {
    localStorage.setItem(QUIET_KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('dse-a11y'))
}

/** SSR 同第一格都當 false（hydration 一致），mount 之後先讀。 */
export function useQuiet(): boolean {
  const [quiet, setQ] = useState(false)
  useEffect(() => {
    const read = () => setQ(isQuiet())
    read()
    window.addEventListener('dse-a11y', read)
    return () => window.removeEventListener('dse-a11y', read)
  }, [])
  return quiet
}
