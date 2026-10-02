// From a chosen error cause to something the student can do (UX loop 10, P1-F, 2026-09-30).
//
// Before: after 概念盲區／審題陷阱／運算粗心 the page only said "saved to your reverse
// error log". The spaced review (1/3/7/14/30 days, lib/reviewSchedule.ts) and the
// cause-ordered session (lib/causeMode.ts) both existed, but nothing on the practice
// or result page pointed to them.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const N = pick(await import('../resultNextSteps.ts'))
const CM = pick(await import('../causeMode.ts'))
const RS = pick(await import('../reviewSchedule.ts'))

const T0 = 1_790_000_000_000
const entry = (cause: 'A' | 'B' | 'C', ts: number, subjectId = 'math', topicId = 'quadratic_equations') => ({
  subjectId, questionId: `q${ts}`, topic: '二次方程', topicId, cause, selected: 'x', correct: 'y', ts,
})

test('the most chosen cause in this session is found; older entries and other subjects are ignored', () => {
  const log = [
    entry('B', T0 + 50),
    entry('A', T0 + 40),
    entry('B', T0 + 30),
    entry('A', T0 - 10), // before this session
    entry('A', T0 + 20, 'physics'), // another subject
  ]
  assert.deepEqual(N.sessionCause(log, 'math', T0), { cause: 'B', count: 2 })
})

test('a tie goes to the cause chosen most recently (the log is newest first)', () => {
  assert.deepEqual(N.sessionCause([entry('C', T0 + 2), entry('A', T0 + 1)], 'math', T0), { cause: 'C', count: 1 })
})

test('the result page link is the cause-ordered session, only when that session has material', () => {
  const log = [entry('A', T0 + 5)]
  const s = N.resultNextSteps({ subjectId: 'math', topicResults: [], startedAt: T0, log })
  assert.deepEqual(s.cause, { cause: 'A', count: 1, href: '/practice?subject=math&mode=cause&cause=A' })
  // A without a topic id has nothing to put first (causeHasMaterial), so no link.
  const bare = [{ ...entry('A', T0 + 5), topicId: undefined }]
  assert.equal(N.resultNextSteps({ subjectId: 'math', topicResults: [], startedAt: T0, log: bare }).cause, null)
  // No session start (older results) or no log: no link.
  assert.equal(N.resultNextSteps({ subjectId: 'math', topicResults: [], log }).cause, null)
  assert.equal(N.resultNextSteps({ subjectId: 'math', topicResults: [], startedAt: T0 }).cause, null)
})

test('the practice URL parses back to a cause session', () => {
  const url = new URL(CM.causePracticeHref('chinese-history', 'B'), 'http://x')
  assert.equal(url.searchParams.get('subject'), 'chinese-history')
  assert.equal(url.searchParams.get('mode'), 'cause')
  assert.equal(CM.parseCause(url.searchParams.get('cause')), 'B')
})

test('ErrorDNA and /result build the URL in one place', () => {
  assert.match(read('components/ErrorDNA.tsx'), /causePracticeHref\(subjectId, head\)/)
  assert.doesNotMatch(read('components/ErrorDNA.tsx'), /mode=cause&cause=/)
  assert.match(read('app/result/ResultPageClient.tsx'), /resultNextSteps\(\{ \.\.\.result, log: getReverseLog\(\) \}\)/)
})

// 2026-10-02（憲章 §7.2）：練習頁答錯不再寫入錯題日誌，所以亦不可以再承諾「呢題會喺第 N 日重溫」。
test('the practice page no longer promises a review it does not schedule', () => {
  const s = read('app/practice/PracticeSession.tsx')
  assert.doesNotMatch(s, /呢題會喺第/)
  assert.doesNotMatch(s, /logReverseError/)
  assert.deepEqual([...RS.INTERVALS], [1, 3, 7, 14, 30])
  assert.equal(RS.DAILY_REVIEW_LIMIT, 5)
  assert.match(read('lib/reviewSchedule.ts'), /export function dueReviews\(limit = DAILY_REVIEW_LIMIT\)/)
})
