// 等級預測頁嘅兩個聚合（lib/scoreStory.ts）。
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { weeklyAccuracy, causeShares } = await import('../scoreStory.ts')

const DAY = 86_400_000
const NOW = Date.UTC(2026, 8, 19, 12)

/** 一節合格嘅練習：每題 30 秒，遠高於 3 秒下限。 */
const att = (daysAgo: number, score: number, total = 10, elapsed = total * 30) => ({
  subjectId: 'economics',
  subjectName: '經濟',
  topicFilter: null,
  score,
  total,
  grade: '4',
  topicResults: [],
  elapsed,
  timestamp: NOW - daysAgo * DAY,
})

test('冇作答嘅週係 null，唔係 0 —— 冇做過同做錯晒係兩回事', () => {
  const w = weeklyAccuracy([], NOW, 4)
  assert.equal(w.length, 4)
  assert.ok(w.every((b) => b.total === 0 && b.accuracy === null))
})

test('由舊至新排列，最右一格係過去七日', () => {
  const w = weeklyAccuracy([att(1, 8), att(8, 5)], NOW, 3)
  assert.deepEqual(w.map((b) => b.weeksAgo), [2, 1, 0])
  assert.equal(w[2].accuracy, 0.8)
  assert.equal(w[1].accuracy, 0.5)
  assert.equal(w[0].accuracy, null)
})

test('同一週多節要合埋計題數，唔係將正確率平均', () => {
  // 10 題對 9 + 20 題對 10 = 19/30，唔係 (0.9 + 0.5) / 2 = 0.7
  const w = weeklyAccuracy([att(1, 9, 10), att(2, 10, 20)], NOW, 1)
  assert.equal(w[0].correct, 19)
  assert.equal(w[0].total, 30)
  assert.ok(Math.abs(w[0].accuracy! - 19 / 30) < 1e-9)
})

test('太快完成嘅節唔計 —— 同等級估算用同一條規則', () => {
  // 10 題 20 秒 = 每題 2 秒，低過 mastery.ts 嘅 3 秒下限
  const w = weeklyAccuracy([att(1, 10, 10, 20), att(1, 5, 10)], NOW, 1)
  assert.equal(w[0].total, 10)
  assert.equal(w[0].accuracy, 0.5)
})

test('超出範圍同未來時間戳都唔入任何一格', () => {
  const w = weeklyAccuracy([att(60, 10), att(-3, 10)], NOW, 8)
  assert.ok(w.every((b) => b.total === 0))
})

test('週界線：啱啱七日屬上一週，唔係本週', () => {
  const w = weeklyAccuracy([att(7, 10)], NOW, 2)
  assert.equal(w[1].total, 0, '本週唔應該有')
  assert.equal(w[0].total, 10, '應該落喺上一週')
})

test('錯因比例：只計時間窗之內，唔認得嘅 cause 唔計', () => {
  const e = (cause: string, daysAgo: number) =>
    ({ subjectId: 's', questionId: 'q', topic: 't', cause, selected: 'x', correct: 'y', ts: NOW - daysAgo * DAY }) as never
  const r = causeShares([e('A', 1), e('A', 2), e('B', 3), e('C', 20), e('Z', 1)], NOW - 7 * DAY)
  assert.deepEqual(r.counts, { A: 2, B: 1, C: 0 })
  assert.equal(r.total, 3)
})
