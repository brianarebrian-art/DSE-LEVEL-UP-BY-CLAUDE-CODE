// 溫習時長分析嘅行為測試。
//
// 呢個模組冇 localStorage 依賴，全部係純函數 —— 可以完全喺 Node 度測。
// 重點守兩樣：① 唔會捏造結論（樣本唔夠就唔出「最佳時段」）；
// ② 唔會因為壞數據而出 NaN／負數落畫面。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const {
  studyTotals,
  dailyBars,
  timeSlots,
  bestSlot,
  formatDuration,
  MIN_QUESTIONS_PER_SLOT,
} = await import('../studyTime.ts')

type A = {
  subjectId: string
  subjectName: string
  topicFilter: string | null
  score: number
  total: number
  grade: string
  topicResults: { topic: string; correct: number; total: number }[]
  elapsed: number
  timestamp: number
}

const NOW = new Date(2026, 7, 5, 15, 0, 0).getTime() // 本地時間，同實作嘅本地日界一致
const DAY = 86400000

function at(over: Partial<A> = {}): A {
  return {
    subjectId: 'math',
    subjectName: '數學',
    topicFilter: null,
    score: 14,
    total: 20,
    grade: '5',
    topicResults: [],
    elapsed: 600,
    timestamp: NOW,
    ...over,
  }
}

/** 指定本地鐘數嘅時間戳（同日）。 */
function atHour(h: number, over: Partial<A> = {}): A {
  const d = new Date(NOW)
  d.setHours(h, 30, 0, 0)
  return at({ timestamp: d.getTime(), ...over })
}

// ── studyTotals ─────────────────────────────────────────────────────────

test('累計秒數、卷數、題數都係實數相加', () => {
  const t = studyTotals([at({ elapsed: 600, total: 20 }), at({ elapsed: 300, total: 10 })], null, NOW)
  assert.equal(t.seconds, 900)
  assert.equal(t.papers, 2)
  assert.equal(t.questions, 30)
  assert.equal(t.secondsPerQuestion, 30)
  assert.equal(t.secondsPerPaper, 450)
})

test('零記錄唔會出 NaN，平均值用 null 而唔係 0', () => {
  const t = studyTotals([], null, NOW)
  assert.equal(t.seconds, 0)
  assert.equal(t.papers, 0)
  assert.equal(t.secondsPerQuestion, null) // 唔可以出 0 扮成「每題 0 秒」
  assert.equal(t.secondsPerPaper, null)
  assert.equal(t.activeDays, 0)
})

test('窗口外嘅記錄唔計入', () => {
  const t = studyTotals([at({ timestamp: NOW - 40 * DAY }), at({ timestamp: NOW })], 30, NOW)
  assert.equal(t.papers, 1)
})

test('windowDays = null 代表計全部歷史', () => {
  const t = studyTotals([at({ timestamp: NOW - 400 * DAY }), at()], null, NOW)
  assert.equal(t.papers, 2)
})

test('同一日做幾份卷，activeDays 只計一日', () => {
  const t = studyTotals([atHour(9), atHour(14), atHour(21)], null, NOW)
  assert.equal(t.activeDays, 1)
  assert.equal(t.papers, 3)
})

test('壞數據（elapsed 缺失／NaN／負數／timestamp 壞）一律跳過，唔會污染統計', () => {
  const bad = [
    at({ elapsed: NaN }),
    at({ elapsed: -100 }),
    at({ elapsed: undefined as unknown as number }),
    at({ timestamp: NaN }),
    at({ timestamp: undefined as unknown as number }),
  ]
  const t = studyTotals([...bad, at({ elapsed: 600, total: 20 })], null, NOW)
  assert.equal(t.papers, 1)
  assert.equal(t.seconds, 600)
  assert.ok(Number.isFinite(t.secondsPerQuestion!))
})

// ── dailyBars ───────────────────────────────────────────────────────────

test('回傳格數 = 要求日數，冇練習嘅日子亦有一格（休息日唔會視覺上消失）', () => {
  const bars = dailyBars([at()], 14, NOW)
  assert.equal(bars.length, 14)
  assert.equal(bars.filter((b) => b.seconds > 0).length, 1)
  assert.equal(bars.filter((b) => b.seconds === 0).length, 13)
})

test('最後一格係今日，第一格係 days-1 日前', () => {
  const bars = dailyBars([], 7, NOW)
  const today = new Date(NOW)
  today.setHours(0, 0, 0, 0)
  assert.equal(bars[6].ts, today.getTime())
  const first = new Date(today)
  first.setDate(first.getDate() - 6)
  assert.equal(bars[0].ts, first.getTime())
})

test('同日多份卷會加落同一格', () => {
  const bars = dailyBars([atHour(9, { elapsed: 300 }), atHour(20, { elapsed: 200 })], 14, NOW)
  const nonZero = bars.filter((b) => b.seconds > 0)
  assert.equal(nonZero.length, 1)
  assert.equal(nonZero[0].seconds, 500)
})

test('窗口外嘅記錄唔會塞爆條形圖', () => {
  const bars = dailyBars([at({ timestamp: NOW - 90 * DAY })], 14, NOW)
  assert.equal(bars.length, 14)
  assert.equal(bars.every((b) => b.seconds === 0), true)
})

// ── timeSlots ───────────────────────────────────────────────────────────

test('四個時段覆蓋 0–23 點，冇窿冇重疊', () => {
  const slots = timeSlots([])
  assert.equal(slots.length, 4)
  for (let h = 0; h <= 23; h++) {
    const hit = slots.filter((s) => h >= s.fromHour && h <= s.toHour)
    assert.equal(hit.length, 1, `${h} 點命中 ${hit.length} 個時段`)
  }
})

test('按本地鐘數分派到正確時段', () => {
  const slots = timeSlots([atHour(2), atHour(8), atHour(14), atHour(21)])
  const by = Object.fromEntries(slots.map((s) => [s.key, s.papers]))
  assert.deepEqual(by, { dawn: 1, morning: 1, afternoon: 1, evening: 1 })
})

test('正確率按題數計；零樣本時段係 null 而唔係 0', () => {
  const slots = timeSlots([atHour(21, { score: 18, total: 20 })])
  const evening = slots.find((s) => s.key === 'evening')!
  const morning = slots.find((s) => s.key === 'morning')!
  assert.equal(evening.accuracy, 0.9)
  assert.equal(morning.accuracy, null) // 唔可以顯示成「早上 0%」
})

// ── bestSlot：唔夠樣本就唔出結論 ────────────────────────────────────────

test('【核心】樣本唔夠門檻 → 唔出「最佳時段」', () => {
  const few = Array.from({ length: 2 }, () => atHour(21, { score: 10, total: 5 })) // 10 題
  assert.ok(10 < MIN_QUESTIONS_PER_SLOT)
  assert.equal(bestSlot(timeSlots(few)), null)
})

test('【核心】得一個時段夠樣本 → 仍然唔出（冇比較就冇「最」）', () => {
  const only = Array.from({ length: 5 }, () => atHour(21, { score: 18, total: 20 })) // 100 題
  const b = bestSlot(timeSlots(only))
  assert.equal(b, null)
})

test('兩個時段都夠樣本 → 出正確率較高嗰個', () => {
  const rows = [
    ...Array.from({ length: 5 }, () => atHour(21, { score: 18, total: 20 })), // 夜晚 90%
    ...Array.from({ length: 5 }, () => atHour(14, { score: 10, total: 20 })), // 下午 50%
  ]
  const b = bestSlot(timeSlots(rows))
  assert.ok(b)
  assert.equal(b.key, 'evening')
  assert.equal(b.accuracy, 0.9)
})

test('剛好踩到樣本門檻就算數', () => {
  const rows = [
    at({ timestamp: hourTs(21), score: MIN_QUESTIONS_PER_SLOT, total: MIN_QUESTIONS_PER_SLOT }),
    at({ timestamp: hourTs(14), score: 0, total: MIN_QUESTIONS_PER_SLOT }),
  ]
  const b = bestSlot(timeSlots(rows))
  assert.ok(b)
  assert.equal(b.key, 'evening')
})

function hourTs(h: number): number {
  const d = new Date(NOW)
  d.setHours(h, 30, 0, 0)
  return d.getTime()
}

// ── formatDuration ──────────────────────────────────────────────────────

test('少過 1 分鐘照講秒，唔會四捨五入成 0 分鐘', () => {
  assert.equal(formatDuration(48, false), '48 秒')
  assert.equal(formatDuration(48, true), '48 sec')
  assert.equal(formatDuration(0, false), '0 秒')
})

test('分鐘同小時', () => {
  assert.equal(formatDuration(600, false), '10 分鐘')
  assert.equal(formatDuration(3600, false), '1 小時')
  assert.equal(formatDuration(9300, false), '2 小時 35 分')
  assert.equal(formatDuration(9300, true), '2 hr 35 min')
})

test('負數／NaN 唔會出負時間落畫面', () => {
  assert.equal(formatDuration(-500, false), '0 秒')
  assert.ok(!formatDuration(NaN, false).includes('NaN'))
})
