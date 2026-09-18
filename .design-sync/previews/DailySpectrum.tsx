import { DailySpectrum } from 'dse-level-up'

// 今日學習光譜 —— 10 段對應每日 3:5:2 建議節奏（3 基礎 · 5 核心 · 2 進階）。
// 數據 100% 來自今日真實作答，唔靠估算。
// 大愛紅線：冇 XP／升級／通關／血量字眼；未做完唔會有任何「落後」暗示。
//
// 日界線係 04:00 HKT（唔係午夜）—— 凌晨 00:30 溫書仍然計作前一晚。

function hkDay(): string {
  const now = new Date(Date.now() - 4 * 3_600_000)
  const hkt = new Date(now.getTime() + 8 * 3_600_000)
  return hkt.toISOString().slice(0, 10)
}

function seed(easy: number, medium: number, hard: number) {
  try {
    localStorage.setItem('dse_daily_spectrum', JSON.stringify({ date: hkDay(), easy, medium, hard }))
  } catch {
    /* 封鎖咗 storage 就 render 零狀態 */
  }
}

export function PartWayThrough() {
  seed(3, 2, 0)
  return (
    <div className="max-w-lg">
      <DailySpectrum />
    </div>
  )
}

export function FullDay() {
  seed(3, 5, 2)
  return (
    <div className="max-w-lg">
      <DailySpectrum />
    </div>
  )
}
