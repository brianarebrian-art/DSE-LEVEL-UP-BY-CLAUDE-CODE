// Homepage "continue" card (components/ContinueCard.tsx, 2026-09-29).
// The choice of where to send a returning student lives in lib/sessionResume.ts so it
// can be tested here without a browser.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

const mod = await import('../sessionResume.ts')
const R = (mod as { default?: typeof mod }).default ?? mod
type ActiveSession = import('../sessionResume.ts').ActiveSession

const live = (id: string) => ['math', 'physics', 'economics'].includes(id)

function run(over: Partial<ActiveSession> = {}): ActiveSession {
  return {
    v: 1,
    subjectId: 'math',
    topicFilter: null,
    mode: 'normal',
    questionIds: Array.from({ length: 10 }, (_, i) => `q${i}`),
    answers: Array(10).fill(null),
    current: 3,
    elapsed: 120,
    updatedAt: Date.now(),
    ...over,
  }
}

test('an unfinished run is resumed at the next question', () => {
  const t = R.pickContinueTarget(run(), 'physics', live)
  assert.deepEqual(t, { kind: 'resume', subjectId: 'math', href: '/practice?subject=math', done: 3, total: 10 })
})

test('the resume link rebuilds topic and weakness mode so the practice page matches', () => {
  const t = R.pickContinueTarget(run({ topicFilter: 'quadratic', mode: 'weakness' }), null, live)
  assert.equal(t?.href, '/practice?subject=math&topic=quadratic&mode=weakness')
})

test('runs the practice page would not offer fall back to the last subject', () => {
  const cases: Partial<ActiveSession>[] = [
    { current: 0 }, // nothing answered yet
    { current: 10 }, // already finished
    { updatedAt: Date.now() - 8 * 24 * 60 * 60 * 1000 }, // older than seven days
    { mode: 'cause' }, // the cause is not saved, so the URL cannot be rebuilt
    { mode: undefined as unknown as ActiveSession['mode'] }, // very old or hand-edited storage
    { subjectId: 'withdrawn-subject' },
  ]
  for (const c of cases) {
    const t = R.pickContinueTarget(run(c), 'economics', live)
    assert.deepEqual(t, { kind: 'again', subjectId: 'economics', href: '/practice?subject=economics' }, JSON.stringify(c))
  }
})

test('a first-time visitor gets no card', () => {
  assert.equal(R.pickContinueTarget(null, null, live), null)
  assert.equal(R.pickContinueTarget(null, 'withdrawn-subject', live), null)
})

test('the card is on the homepage and stays out of the way', () => {
  assert.match(read('app/page.tsx'), /<ContinueCard \/>/)
  const card = read('components/ContinueCard.tsx')
  assert.match(card, /isNotTonight\(\)/, 'hidden while 今晚唔溫得 is on')
  // No streaks, day counts or grades (charter §8.1).
  const code = card.replace(/\/\/.*$/gm, '')
  assert.doesNotMatch(code, /streak|連續|日冇|days? (ago|since)|grade|等級|setItem/i)
})
