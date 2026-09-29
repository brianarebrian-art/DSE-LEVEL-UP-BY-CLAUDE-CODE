// Homepage quick start (UX loop 2, 2026-09-30; lib/quickStart.ts).
//
// The promise on the homepage is "pick a subject and the first question opens".
// These tests check that the links really do that: each one reaches a full
// session of an active subject, never an elective dialog or a sign-in, and the
// time shown comes from the same place as the subject page's estimate.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)

const QS = pick(await import('../quickStart.ts'))
const E = pick(await import('../entitlements.ts'))
const EL = pick(await import('../electives.ts'))
const S = pick(await import('../../data/subjects.ts'))
const I = pick(await import('../../data/questions/index.ts'))

const quick = QS.quickStartSubjects()

test('the quick start offers exactly the four core subjects, all live', () => {
  assert.deepEqual(quick.map((s) => s.id).sort(), ['chinese', 'csd', 'english', 'math'])
  for (const s of quick) assert.ok(S.getSubject(s.id)?.isActive, s.id)
})

test('each link opens a plain session of that subject, not a filtered or written one', () => {
  for (const s of quick) {
    const url = new URL(QS.quickStartHref(s.id), 'http://x')
    assert.equal(url.pathname, '/practice')
    // PracticeShell reads ?subject= and treats a missing ?mode= as a normal session.
    assert.deepEqual([...url.searchParams.entries()], [['subject', s.id]], s.id)
  }
})

test('no quick-start subject opens the elective dialog before its first question', () => {
  for (const s of quick) assert.equal(EL.hasElectives(s.id), false, `${s.id} has electives; drop it from the quick start`)
})

test('each quick-start subject has enough multiple-choice questions for a full session', () => {
  for (const s of quick) {
    const mc = I.getSubjectQuestions(s.id).filter((q: { type?: string }) => q.type !== 'long' && q.type !== 'text')
    assert.ok(mc.length >= E.SESSION_SIZE, `${s.id}: ${mc.length} MC`)
  }
})

test('the practice path never asks the student to sign in', () => {
  for (const f of ['app/practice/PracticeShell.tsx', 'app/practice/PracticeGate.tsx', 'app/practice/PracticeSession.tsx', 'components/NotTonightGate.tsx']) {
    assert.doesNotMatch(read(f), /useAuthSession|useSession|signIn\(|next-auth|better-auth/, f)
  }
})

test('session length in minutes has one source', () => {
  assert.equal(E.sessionMinutes(), 15)
  assert.equal(E.sessionMinutes(10), 15)
  assert.equal(E.sessionMinutes(2), 5)
  const home = read('app/page.tsx')
  const subject = read('app/subjects/[subject]/SubjectDetailView.tsx')
  assert.match(home, /sessionMinutes\(\)/)
  assert.match(subject, /sessionMinutes\(sessionQuestions\)/)
  // Neither page may compute or hard-code its own estimate again.
  for (const [name, src] of [['home', home], ['subject', subject]] as const) {
    assert.doesNotMatch(src, /\* 1\.5\b/, name)
    assert.doesNotMatch(src, /約 1\d 分鐘|About 1\d minutes/, name)
  }
})

test('the quick start sits in the hero, before the trust chips, with the other-subjects link beside it', () => {
  const page = read('app/page.tsx')
  const hero = page.slice(page.indexOf('── HERO ──'), page.indexOf('── 信任列 ──'))
  const at = hero.indexOf('quickStartHref(s.id)')
  assert.ok(at > 0, 'quick-start links in the hero')
  assert.ok(at < hero.indexOf('h.trust1'), 'quick start before trust chips')
  assert.ok(hero.indexOf('hero.ctaStartHref') > at, 'other-subjects link after the quick start')
  // The seasonal link (/waiting and /relax in results season) stays on the first screen.
  assert.match(hero, /hero\.ctaSecHref/)
  assert.match(hero, /唔使登入/)
})

test('negative self-test: an elective subject would be caught', () => {
  assert.equal(EL.hasElectives('ethics-religious'), true)
})
