// 今日提示（溫和提醒 + 每日溫習信）的行為測試。
// 最要緊的兩條：一日只出一則；沒有資料時絕不出聲。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const m = await import('../dailyNote.ts')
const { buildGentleNudge, buildDailyNote, pickTodayMessage, localDayStart, NUDGE_ERROR_THRESHOLD } = m

const DAY = 86_400_000
const NOW = new Date('2026-07-31T14:00:00+08:00').getTime()
const err = (topicId: string, ts: number, subjectId = 'math') => ({
  subjectId, questionId: 'q' + ts, topic: '二次方程', topicId, cause: 'A' as const,
  selected: 'x', correct: 'y', ts,
})
const attempt = (ts: number, total = 10, subjectName = '數學') => ({
  subjectId: 'math', subjectName, topicFilter: null, score: 6, total, grade: '4',
  topicResults: [], elapsed: 600, timestamp: ts,
})

// ── 06 溫和提醒 ──────────────────────────────────────────────────────────────

test('未夠門檻不會提醒', () => {
  const log = Array.from({ length: NUDGE_ERROR_THRESHOLD - 1 }, (_, i) => err('quadratic', NOW - i * 1000))
  assert.equal(buildGentleNudge(log, NOW), null)
})

test('達門檻就提醒，並回報次數同課題', () => {
  const log = Array.from({ length: 3 }, (_, i) => err('quadratic', NOW - i * 1000))
  const n = buildGentleNudge(log, NOW)
  assert.ok(n)
  assert.equal(n.kind, 'nudge')
  assert.equal(n.topicId, 'quadratic')
  assert.equal(n.count, 3)
})

test('超出時間窗的舊錯題不計入', () => {
  const old = Array.from({ length: 5 }, (_, i) => err('quadratic', NOW - 30 * DAY - i * 1000))
  assert.equal(buildGentleNudge(old, NOW), null)
})

test('冷卻期內同一課題不會再提醒', () => {
  const log = Array.from({ length: 5 }, (_, i) => err('quadratic', NOW - i * 1000))
  const key = 'math::quadratic'
  assert.equal(buildGentleNudge(log, NOW, { [key]: NOW - 3600_000 }), null, '一小時前提過，唔應該再提')
  assert.ok(buildGentleNudge(log, NOW, { [key]: NOW - 2 * DAY }), '兩日前提過，可以再提')
})

test('多個課題達標時，取錯得最多嗰個', () => {
  const log = [
    ...Array.from({ length: 3 }, (_, i) => err('quadratic', NOW - i * 1000)),
    ...Array.from({ length: 6 }, (_, i) => err('trigonometry', NOW - i * 1000)),
  ]
  assert.equal(buildGentleNudge(log, NOW)?.topicId, 'trigonometry')
})

test('冇 topicId 嘅舊記錄唔會令佢爆，亦唔會被計入', () => {
  const log = Array.from({ length: 5 }, (_, i) => ({ ...err('quadratic', NOW - i * 1000), topicId: undefined }))
  assert.equal(buildGentleNudge(log as never, NOW), null)
})

test('未來時間戳唔計入（防本機時鐘錯亂）', () => {
  const log = Array.from({ length: 5 }, (_, i) => err('quadratic', NOW + DAY + i * 1000))
  assert.equal(buildGentleNudge(log, NOW), null)
})

// ── 02 每日溫習信 ────────────────────────────────────────────────────────────

test('昨日冇練習就完全唔出聲（唔可以令學生內疚）', () => {
  assert.equal(buildDailyNote([], [], NOW), null)
  const onlyToday = [attempt(NOW - 3600_000)]
  assert.equal(buildDailyNote(onlyToday, [], NOW), null, '今日做過但昨日冇，一樣唔出')
})

test('昨日有練習就總結題數同科目', () => {
  const y = localDayStart(NOW) - DAY + 3600_000
  const note = buildDailyNote([attempt(y, 10), attempt(y + 1000, 5, '物理')], [], NOW)
  assert.ok(note)
  assert.equal(note.yesterdayQuestions, 15)
  assert.deepEqual(note.yesterdaySubjects, ['數學', '物理'])
})

test('建議取錯得最兇嘅課題，樣本太少嘅唔會被揀', () => {
  const y = localDayStart(NOW) - DAY + 3600_000
  const stats = [
    { key: 'math::a', subjectId: 'math', topic: 'a', label: '甲', total: 2, wrong: 2 },   // 樣本太少
    { key: 'math::b', subjectId: 'math', topic: 'b', label: '乙', total: 10, wrong: 7 },  // 70% 錯
    { key: 'math::c', subjectId: 'math', topic: 'c', label: '丙', total: 10, wrong: 2 },
  ]
  const note = buildDailyNote([attempt(y)], stats, NOW)
  assert.equal(note?.suggestion?.topicId, 'b')
})

test('冇合適建議對象時 suggestion 為 null，但仍然有總結', () => {
  const y = localDayStart(NOW) - DAY + 3600_000
  const note = buildDailyNote([attempt(y)], [{ key: 'math::c', subjectId: 'math', topic: 'c', label: '丙', total: 10, wrong: 0 }], NOW)
  assert.ok(note)
  assert.equal(note.suggestion, null)
})

// ── 合併：一日只出一則 ───────────────────────────────────────────────────────

test('提醒優先於溫習信 —— 兩者都符合時只出提醒', () => {
  const y = localDayStart(NOW) - DAY + 3600_000
  const log = Array.from({ length: 4 }, (_, i) => err('quadratic', NOW - i * 1000))
  const msg = pickTodayMessage({ log, attempts: [attempt(y)], stats: [], now: NOW })
  assert.equal(msg?.kind, 'nudge')
})

test('兩者都唔符合時回傳 null（唔會硬砌一句說話出嚟）', () => {
  assert.equal(pickTodayMessage({ log: [], attempts: [], stats: [], now: NOW }), null)
})
