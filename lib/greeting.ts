// 時段問候語 —— 規格 §3.2。
//
// ══ 點解要抽做純函數 ══
// 呢個判斷有四個邊界（05／12／18／22），全部係「大於等於」定「大於」一字之差
// 就會喺半夜三點祝人早晨。抽出嚟先至測得到；擺喺組件入面就只能靠人手撳到
// 嗰個鐘數先發現。
//
// ══ 點解唔用 Date 直接喺組件度計 ══
// 伺服器同瀏覽器唔同時區，SSR render 出「Good morning」而 client 係
// 「Good night」會 hydration 不匹配。所以組件一律 mount 之後先叫呢個函數
// （同 ThemeProvider 一樣嘅處理），呢度只負責純粹嘅時段對映。

export type GreetingSlot = 'morning' | 'afternoon' | 'evening' | 'night'

/**
 * 由 0–23 嘅鐘數映射到時段。
 * 規格 §3.2：05:00–11:59 早上／12:00–17:59 下午／18:00–21:59 晚上／22:00–04:59 深夜。
 */
export function greetingSlot(hour: number): GreetingSlot {
  const h = Math.floor(hour)
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 18) return 'afternoon'
  if (h >= 18 && h < 22) return 'evening'
  return 'night'
}

/** 深夜同晚上出月亮，日間出太陽。 */
export function isNightSlot(slot: GreetingSlot): boolean {
  return slot === 'evening' || slot === 'night'
}
