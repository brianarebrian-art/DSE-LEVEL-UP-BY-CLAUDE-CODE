'use client'

// 休息日護盾 (Rest Day Shield) —— 2026-09-13
//
// ══ 佢係乜 ══
// 學生自己揀每星期邊幾日係休息日。到咗嗰日，dashboard 嘅「只做 1 題」卡
// 轉成一句放鬆文案，唔再推題。
//
// ══ 佢【唔】係乜 ══
// 唔係鎖。呢個唔係品味問題 —— 2026-07-16 Emma/UDL 就「今晚唔溫得」裁決過：
// ❌ 真・鎖，✅ 增加摩擦。一個真鎖會製造兩種傷害：想溫嗰個覺得被平台阻住，
// 唔想溫嗰個覺得自己「破咗戒」。所以休息日照樣有一條「今日想做少少」嘅路，
// 撳落去乜都唔會發生（唔會彈確認、唔會記低、唔會下次提你）。
//
// ══ 日界線 ══
// 用 lib/hkTime.ts 嘅 04:00 HKT 日界線，同每日光譜、「今晚唔溫得」一致 ——
// 星期五凌晨 2 點做緊題，計作星期四。三個功能各自寫一套日界線嘅話，
// 學生會喺同一刻見到三個唔同嘅「今日」。
//
// ══ 私隱 ══
// 純 localStorage。⚠️ 刻意【唔】入 lib/sync.ts：憲章 §16.E 執行第 1 點寫明
// 每個上雲 key 要創辦人書面批准，而且「休息習慣」呢類嘢同 notTonight.ts
// 檔頭嗰句「休息習慣唔上 server」係同一條線。跨機同步要另外開題。

import { hkDayString } from '@/lib/hkTime'

const KEY = 'dse_rest_days'

/** 0 = 星期日 … 6 = 星期六（同 Date.getDay() 一致）。 */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * 香港「今日」係星期幾（04:00 日界線）。
 *
 * 由 hkDayString() 嘅 YYYY-MM-DD 反推，而唔係直接 new Date().getDay()：
 * 後者讀裝置時區，人喺外地或者時區設錯就會差成日。用 `T00:00:00Z` 解析
 * 係要避開「唔帶時區嘅日期字串」喺唔同瀏覽器有唔同解讀嗰個舊坑。
 */
export function hkWeekday(now: number = Date.now()): Weekday {
  return new Date(`${hkDayString(now)}T00:00:00Z`).getUTCDay() as Weekday
}

function parse(raw: string | null): Weekday[] {
  if (!raw) return []
  try {
    const v: unknown = JSON.parse(raw)
    if (!Array.isArray(v)) return []
    // 逐個過濾而唔係信個 array：呢個值學生自己改得到（DevTools、導入檔案），
    // 一個 7 或者一個字串入到嚟就會令下面嘅比較永遠唔命中，而且完全靜默。
    return [...new Set(v.filter((d): d is Weekday => Number.isInteger(d) && d >= 0 && d <= 6))].sort()
  } catch {
    return []
  }
}

export function getRestDays(): Weekday[] {
  if (typeof window === 'undefined') return []
  try {
    return parse(localStorage.getItem(KEY))
  } catch {
    return []
  }
}

export function setRestDays(days: Weekday[]): Weekday[] {
  const clean = parse(JSON.stringify(days))
  if (typeof window === 'undefined') return clean
  try {
    if (clean.length) localStorage.setItem(KEY, JSON.stringify(clean))
    else localStorage.removeItem(KEY) // 一日都冇揀 = 冇呢個功能，唔好留低一個空 array
  } catch {
    /* ignore */
  }
  // 同頁其他組件即時響應（JustOneCard 聽緊）
  window.dispatchEvent(new Event('dse-rest-day'))
  return clean
}

export function isRestDayToday(now: number = Date.now()): boolean {
  return getRestDays().includes(hkWeekday(now))
}

/** 星期標籤。短名（一個字）畀七粒掣用，長名畀文案用。 */
export const WEEKDAY_LABELS: Record<Weekday, { zh: string; en: string; zhLong: string; enLong: string }> = {
  0: { zh: '日', en: 'S', zhLong: '星期日', enLong: 'Sunday' },
  1: { zh: '一', en: 'M', zhLong: '星期一', enLong: 'Monday' },
  2: { zh: '二', en: 'T', zhLong: '星期二', enLong: 'Tuesday' },
  3: { zh: '三', en: 'W', zhLong: '星期三', enLong: 'Wednesday' },
  4: { zh: '四', en: 'T', zhLong: '星期四', enLong: 'Thursday' },
  5: { zh: '五', en: 'F', zhLong: '星期五', enLong: 'Friday' },
  6: { zh: '六', en: 'S', zhLong: '星期六', enLong: 'Saturday' },
}
