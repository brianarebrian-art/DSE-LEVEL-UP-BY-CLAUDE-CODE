'use client'

// F-NTM: 今晚唔溫得 (Not Tonight Mode) — Sarah 情緒安全網。
// 開啟後 Dashboard 收起所有題目推送／進度計數，只顯示休息畫面；/relax 照常開放。
// 純 localStorage（隱私紅線：休息習慣唔上 server）；到下一個 04:00 HKT 自動失效
// —— 唔使 cron，讀取時比較 timestamp 就得，$0。
// 憲章 v3.2 §1.4：日界線以香港時間計，唔跟裝置時區（見 lib/hkTime.ts）。

import { nextHkFourAm } from '@/lib/hkTime'

const KEY = 'dse_not_tonight_until'

// 下一個 04:00 HKT：而家未夠 4 點（香港時間）就係今日 04:00，否則聽日 04:00
export function nextFourAm(): number {
  return nextHkFourAm()
}

export function isNotTonight(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return Number(localStorage.getItem(KEY) ?? 0) > Date.now()
  } catch {
    return false
  }
}

export function setNotTonight(on: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (on) localStorage.setItem(KEY, String(nextFourAm()))
    else localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
  // 同頁其他組件即時響應（Dashboard 監聽）
  window.dispatchEvent(new Event('dse-ntm'))
}
