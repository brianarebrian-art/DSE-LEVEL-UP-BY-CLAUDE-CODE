// /start: 開始練習 goes straight to practice for a returning student (UX loop 31,
// 2026-09-30; hardening prompt §11). First-time visitors still pick a subject.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const qs: any = await import('../quickStart.ts')
const Q = qs.default?.startHref ? qs.default : qs
const live = (id: string) => id !== 'gone'

const session = (over = {}) => ({
  v: 1, subjectId: 'math', topicFilter: null, mode: 'normal', questionIds: Array.from({ length: 10 }, (_, i) => `q${i}`),
  answers: [], current: 3, elapsed: 120, updatedAt: Date.now(), ...over,
})

test('first-time visitor → subject list', () => {
  assert.equal(Q.startHref(null, [], live), '/subjects')
})

test('returning student without an unfinished set → a new set in the most recent subject', () => {
  const attempts = [{ subjectId: 'physics', timestamp: 1 }, { subjectId: 'chemistry', timestamp: 5 }, { subjectId: 'gone', timestamp: 9 }]
  assert.equal(Q.startHref(null, attempts, live), '/practice?subject=chemistry')
})

test('an unfinished set the practice page would resume → that set, even if another subject was more recent', () => {
  const recent = [{ subjectId: 'physics', timestamp: Date.now() }]
  assert.equal(Q.startHref(session(), recent, live), '/practice?subject=math')
  assert.equal(Q.startHref(session({ topicFilter: 'quadratic' }), recent, live), '/practice?subject=math&topic=quadratic')
  // Nothing answered yet, or already finished: not worth resuming, so the most recent subject.
  assert.equal(Q.startHref(session({ current: 0 }), recent, live), '/practice?subject=physics')
  assert.equal(Q.startHref(session({ current: 10 }), recent, live), '/practice?subject=physics')
  // A subject no longer live is never offered.
  assert.equal(Q.startHref(session({ subjectId: 'gone' }), [], live), '/subjects')
})

test('the page replaces itself, reads only local records, and the top bar CTA uses it', () => {
  const src = readFileSync('app/start/StartRedirect.tsx', 'utf8')
  assert.match(src, /router\.replace\(startHref\(loadActiveSession\(\), loadAttempts\(\)/)
  assert.doesNotMatch(src, /localStorage\.setItem|fetch\(/)
  assert.match(src, /href="\/subjects"/, 'fallback link if the redirect fails')
  assert.match(readFileSync('app/start/page.tsx', 'utf8'), /robots: \{ index: false, follow: false \}/)
  const nav = readFileSync('components/Navbar.tsx', 'utf8')
  assert.equal((nav.match(/href="\/start"/g) ?? []).length, 2)
  assert.match(readFileSync('lib/pageOrder.ts', 'utf8'), /'\/start': '/)
  assert.match(readFileSync('lib/quickStart.ts', 'utf8'), /pickContinueTarget\(session, last \?\? null, isLive\)\?\.href \?\? '\/subjects'/)
})
