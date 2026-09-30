// Practice page at 1440px and wider: a context column on the left (UX loop 40, 2026-09-30;
// hardening prompt §19). Display only; no links, so the session is never interrupted.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const rail = readFileSync('components/PracticeContextRail.tsx', 'utf8')
const session = readFileSync('app/practice/PracticeSession.tsx', 'utf8')

test('the rail shows from 1440px only, as the first grid column', () => {
  // A named breakpoint, not min-[1440px]: Tailwind v4 emits arbitrary min-[…] before lg, so lg:grid-cols-2 won (seen 2026-09-30).
  assert.match(readFileSync('app/globals.css', 'utf8'), /--breakpoint-desk: 90rem;/)
  assert.match(rail, /className="focus-dim hidden desk:block sticky top-20/)
  const grid = session.indexOf('desk:grid-cols-[220px_1fr_1fr]')
  const railAt = session.indexOf('<PracticeContextRail subjectId={subjectId}')
  const cardAt = session.indexOf('<div key={currentQ.id} className="bg-surface-raised')
  assert.ok(grid > 0 && grid < railAt && railAt < cardAt)
})

test('display only: no links or buttons, reads local stats, writes nothing, loads no topic tables', () => {
  assert.doesNotMatch(rail, /<Link|<a\s|<button|href=/)
  assert.doesNotMatch(rail, /localStorage\.setItem|fetch\(|summary\.generated/)
  assert.match(rail, /getTopicStats\(\)/)
})

test('weakest topics need evidence and are ranked by accuracy', async () => {
  const m: any = await import('../topicEvidence.ts')
  const W = m.default?.weakestInSubject ? m.default : m
  const row = (topic: string, total: number, wrong: number, subjectId = 'math') => ({ subjectId, topic, total, wrong })
  const out = W.weakestInSubject([row('a', 10, 3), row('b', 10, 7), row('c', 3, 3), row('d', 20, 0), row('e', 10, 9, 'physics')], 'math')
  assert.deepEqual(out.map((x: any) => x.r.topic), ['b', 'a'])
  assert.match(rail, /import \{ weakestInSubject \} from '@\/lib\/topicEvidence'/)
})
