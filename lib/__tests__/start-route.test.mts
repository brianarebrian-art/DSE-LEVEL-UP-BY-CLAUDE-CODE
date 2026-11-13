// /start: 開始練習 goes straight to practice for a returning student (UX loop 31,
// 2026-09-30; hardening prompt §11). First-time visitors still pick a subject.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

type Mod = typeof import('../quickStart.ts')
const qs = (await import('../quickStart.ts')) as Mod & { default?: Mod }
const Q = qs.default ?? qs
const live = (id: string) => id !== 'gone'

type ActiveSession = import('../sessionResume.ts').ActiveSession
const session = (over: Partial<ActiveSession> = {}): ActiveSession => ({
  v: 1, subjectId: 'math', topicFilter: null, mode: 'normal', questionIds: Array.from({ length: 10 }, (_, i) => `q${i}`),
  answers: [], current: 3, elapsed: 120, updatedAt: Date.now(), ...over,
})

test('first-time visitor → homepage subject picker, same path as the hero', () => {
  assert.equal(Q.startHref(null, [], live), '/#quick-start')
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

test('/start is the homepage document, and in-site start links go to the picker', () => {
  const config = readFileSync('next.config.ts', 'utf8')
  assert.match(config, /source:\s*'\/start',\s*destination:\s*'\/'/)
  assert.match(config, /source:\s*'\/start'[\s\S]*noindex/)
  assert.equal(existsSync('app/start/page.tsx'), false, 'a separate /start document would client-redirect')
  assert.equal(existsSync('app/start/StartRedirect.tsx'), false)
  const home = readFileSync('app/HomePageClient.tsx', 'utf8')
  assert.match(home, /pathname !== '\/start'/)
  assert.match(home, /getElementById\('quick-start'\)/)
  assert.doesNotMatch(home, /router\.(replace|push)\(/)
  const nav = readFileSync('components/Navbar.tsx', 'utf8')
  assert.equal((nav.match(/href="\/#quick-start"/g) ?? []).length, 2)
  assert.doesNotMatch(nav, /href="\/start"/)
  assert.doesNotMatch(readFileSync('lib/pageOrder.ts', 'utf8'), /'\/start':/)
  assert.match(readFileSync('lib/pageOrder.ts', 'utf8'), /href: '\/#quick-start'/)
  assert.match(readFileSync('lib/quickStart.ts', 'utf8'), /if \(!session && attempts\.length === 0\) return '\/#quick-start'/)
  assert.match(readFileSync('lib/quickStart.ts', 'utf8'), /return '\/subjects'/)
})

// Refinement loop 2 (2026-09-30; prompt §39): the five cases named in the prompt, against
// the real list of live subjects rather than a stub.
test('regression: new, returning, unfinished, nothing unfinished, invalid subject', async () => {
  type S = typeof import('../../data/subjects.ts')
  const sm = (await import('../../data/subjects.ts')) as S & { default?: S }
  const { getActiveSubjects } = sm.default ?? sm
  const liveIds = new Set(getActiveSubjects().map((s) => s.id))
  const isLive = (id: string) => liveIds.has(id)
  const now = Date.now()
  // New user: nothing on this device — same picker as the homepage hero.
  assert.equal(Q.startHref(null, [], isLive), '/#quick-start')
  // Returning user, no unfinished set: a new set in the latest subject.
  assert.equal(Q.startHref(null, [{ subjectId: 'math', timestamp: now - 5 }, { subjectId: 'physics', timestamp: now }], isLive), '/practice?subject=physics')
  // Unfinished set: resumed.
  assert.equal(Q.startHref(session({ subjectId: 'chemistry' }), [{ subjectId: 'physics', timestamp: now }], isLive), '/practice?subject=chemistry')
  // Invalid subject in both the session and the history: subject list, never a broken link.
  assert.equal(Q.startHref(session({ subjectId: 'no-such-subject' }), [{ subjectId: 'no-such-subject', timestamp: now }], isLive), '/subjects')
  // Invalid session subject, valid history: the history wins.
  assert.equal(Q.startHref(session({ subjectId: 'no-such-subject' }), [{ subjectId: 'math', timestamp: now }], isLive), '/practice?subject=math')
})

// R2-11 (2026-10-01): the practice page only offers to resume when every saved question is
// still in the bank. A removed or unknown subject has an empty bank and must not ask.
test('the practice page does not offer a resume it cannot honour', () => {
  const src = readFileSync('app/practice/PracticeSession.tsx', 'utf8')
  const init = src.slice(src.indexOf('const [resumeOffer, setResumeOffer]'), src.indexOf('const [answerState'))
  assert.match(init, /isResumable\(saved, subjectId, topicFilter, mode\)/)
  assert.match(init, /saved\.questionIds\.every\(\(id\) => ids\.has\(id\)\)/)
})
