// 憲章 v3.2 §1.4 時間基準：平台「一日」以香港時間計（HKT = UTC+8，全年無夏令
// 時間），唔跟裝置時區 —— 裝置時區設錯／人在外地嘅學生，每日光譜重置同
// 「今晚唔溫得」失效時刻都同香港同學一致。
//
// 澄清（2026-07-17 已向創辦人提報）：HKO 開放數據 API 提供嘅係天氣／警告數據，
// 唔係授時服務；為攞「時間」而加網絡請求，反而令慢網／離線學生嘅每日重置失效，
// 違反基層優先。HKT 係固定 UTC+8，純本地運算已達到「香港基準」目標 ——
// $0、零網絡、零依賴。裝置時鐘本身撥錯嘅情況冇 server 都修唔到，而平台冇
// 排名、冇真鎖（NTM 係溫柔確認），公平風險有限。

const HOUR = 3600 * 1000
const DAY = 24 * HOUR

/** 平台日界線：04:00 HKT —— 凌晨溫書仍計作前一晚（DSE 考生真實場景） */
const BOUNDARY_HOUR = 4

/**
 * 今日日期字串（YYYY-MM-DD，HKT，04:00 日界線）。
 * 推導：HKT 日曆時刻 = UTC 讀數 + 8h；再減 4h 日界線 ⇒ 淨位移 +4h 後讀 UTC 日期。
 */
export function hkDayString(now: number = Date.now()): string {
  return new Date(now + (8 - BOUNDARY_HOUR) * HOUR).toISOString().slice(0, 10)
}

/**
 * 下一個 04:00 HKT 嘅 timestamp（ms）。
 * 04:00 HKT = 20:00 UTC，即所有滿足 T ≡ 20h (mod 24h) 嘅 UTC 時刻。
 * 啱啱好係 04:00 嗰刻會取下一日（同舊有裝置時區版行為一致）。
 */
export function nextHkFourAm(now: number = Date.now()): number {
  const anchor = (24 + BOUNDARY_HOUR - 8) * HOUR // = 20h UTC
  return (Math.floor((now - anchor) / DAY) + 1) * DAY + anchor
}
