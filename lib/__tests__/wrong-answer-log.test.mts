// Wrong MC answers are logged again (founders' reply 7a, 2026-10-04).
//
// The cause card removed on 2026-10-02 had been the only writer of wrong MC answers, so due
// reviews, topic nudges and recommendations stopped receiving them. Practice now logs every
// wrong answer without a cause. Cause-based views must still see only diagnosed entries,
// or they would count an "undefined" cause.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const DAY = 86400_000
const store = new Map<string, string>()
;(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
}
;(globalThis as { window?: unknown }).window = globalThis

const { getReverseLog, getWrongAnswerLog, logReverseError } = await import('../reverseLog.ts')
const { dueReviews } = await import('../reviewSchedule.ts')

const base = { subjectId: 'math', topic: '數列', topicEn: 'Sequences', topicId: 'seq', selected: '22', correct: '14' }

test('entries without a cause are kept for reviews but hidden from cause views', () => {
  store.clear()
  logReverseError({ ...base, questionId: 'q1', ts: Date.now() - 1 * DAY })
  logReverseError({ ...base, questionId: 'q2', cause: 'B', ts: Date.now() - 3 * DAY })
  assert.equal(getWrongAnswerLog().length, 2)
  assert.deepEqual(getReverseLog().map((e) => e.questionId), ['q2'])
})

test('a wrong answer without a cause becomes due for review', () => {
  store.clear()
  logReverseError({ ...base, questionId: 'q1', ts: Date.now() - 1 * DAY })
  const due = dueReviews(5)
  assert.deepEqual(due.map((d) => d.questionId), ['q1'])
  assert.equal(due[0].cause, undefined)
})

test('a corrupt log reads as empty instead of throwing', () => {
  store.set('dse_reverse_log', '{"not":"a list"}')
  assert.deepEqual(getWrongAnswerLog(), [])
  assert.deepEqual(getReverseLog(), [])
})

test('practice logs wrong answers with the picked option only, and the views read the right log', () => {
  const practice = readFileSync('app/practice/PracticeSession.tsx', 'utf8')
  const block = practice.slice(practice.indexOf('if (isCorrect) playCorrectChime()'), practice.indexOf('recordSpectrumAnswer(currentQ.difficulty)'))
  assert.match(block, /else\s+logReverseError\(\{/)
  assert.match(block, /selected: zh,/)
  assert.doesNotMatch(block, /cause:/)
  for (const f of ['components/SubjectProgressPanel.tsx', 'components/PracticeSupport.tsx', 'components/TodayNote.tsx', 'lib/reviewSchedule.ts'])
    assert.match(readFileSync(f, 'utf8'), /getWrongAnswerLog\(\)/, f)
  assert.match(readFileSync('components/ReviewScheduler.tsx', 'utf8'), /const tag = d\.cause \? CAUSE_TAG\[d\.cause\] : null/)
})
