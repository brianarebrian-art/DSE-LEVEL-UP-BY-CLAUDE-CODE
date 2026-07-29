// ── 主題：Light（清晨圖書館）／ Cyber（深夜霓虹）────────────────────────────
//
// 設計決定（Brian 2026-07-29 拍板）：
// ① 預設隨時間走 —— 日出後至日落前用 Light，日落後至日出前用 Cyber。
// ② Cyber 主題必須通過 WCAG AA。可讀性優先於風格：任何令文字睇唔清的配色一律不用。
//    目標對象包括讀寫障礙與視障學生。
// ③ 主題與語言完全獨立，各自有自己的 localStorage 鍵，互不影響。
//
// 為何自行計算日出日落，而不呼叫 API 或用 Geolocation：
// - 呼叫第三方 API 會產生費用與依賴，違反成本紅線。
// - Geolocation 會向未成年用戶彈權限視窗，並取得非必要的位置資料。
// 平台受眾百分百在香港，故直接以香港座標常數計算，零依賴、零權限、零成本。

export type ThemePref = 'auto' | 'light' | 'cyber'
export type ThemeName = 'light' | 'cyber'

export const THEME_KEY = 'dse-theme'

// 香港天文台總部座標（22.3019°N, 114.1742°E），時區 UTC+8（標準子午線 120°E）。
const LAT = 22.3019
const LON = 114.1742
const TZ_MERIDIAN = 120
const TZ_OFFSET_H = 8

const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

/**
 * 回傳指定日期在香港的日出、日落時間（以當地時鐘的小時數表示，例如 5.92 即 05:55）。
 *
 * 採用標準日出方程：太陽赤緯以年積日近似，另加時差（equation of time）修正，
 * 並修正本地經度與時區標準子午線之差。
 *
 * 精度：實測全年抽樣，與公布的香港日出日落時間相差最多約 10 分鐘（赤緯用的是
 * 近似式，非完整天文曆）。此誤差只令主題早或遲十分鐘切換，對用途無影響；
 * 若日後有需要精確到分鐘，應改用完整算法而非在此微調常數。
 */
export function sunTimes(date: Date): { sunrise: number; sunset: number } {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const n = Math.floor((date.getTime() - start) / 86400000)

  // 太陽赤緯（度）
  const decl = -23.44 * Math.cos(rad((360 / 365) * (n + 10)))

  // 時差（分鐘）
  const b = rad((360 / 364) * (n - 81))
  const eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b)

  // 時角。|cos| > 1 代表極晝／極夜 —— 香港不會發生，但保留保護以免回傳 NaN。
  const cosOmega = -Math.tan(rad(LAT)) * Math.tan(rad(decl))
  if (cosOmega > 1) return { sunrise: 12, sunset: 12 } // 極夜：整天當夜晚
  if (cosOmega < -1) return { sunrise: 0, sunset: 24 } // 極晝：整天當白晝
  const omega = deg(Math.acos(cosOmega))

  const solarNoon = 12 - eot / 60 + (TZ_MERIDIAN - LON) / 15
  return { sunrise: solarNoon - omega / 15, sunset: solarNoon + omega / 15 }
}

/** 依香港時間判斷此刻應為日間（light）還是夜間（cyber）。 */
export function themeByClock(now: Date = new Date()): ThemeName {
  // 一律以香港時區判斷，不受使用者裝置時區影響 —— 考生即使在外地，
  // 作息仍然跟香港走。
  const hk = new Date(now.getTime() + (TZ_OFFSET_H * 60 + now.getTimezoneOffset()) * 60000)
  const { sunrise, sunset } = sunTimes(hk)
  const h = hk.getHours() + hk.getMinutes() / 60
  return h >= sunrise && h < sunset ? 'light' : 'cyber'
}

/** 將偏好設定解析為實際主題。`auto` 交由時間決定。 */
export function resolveTheme(pref: ThemePref, now: Date = new Date()): ThemeName {
  return pref === 'auto' ? themeByClock(now) : pref
}

export function readPref(): ThemePref {
  if (typeof window === 'undefined') return 'auto'
  const v = window.localStorage.getItem(THEME_KEY)
  return v === 'light' || v === 'cyber' || v === 'auto' ? v : 'auto'
}
