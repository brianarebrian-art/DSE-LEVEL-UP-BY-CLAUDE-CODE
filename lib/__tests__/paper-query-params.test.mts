import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const Q = pick(await import('../paper/queryParams.ts'))

test('keeps a valid active subject', () => {
  assert.equal(Q.resolvePaperSubject('math'), 'math')
})

test('falls back when subject is unknown', () => {
  const fallback = Q.resolvePaperSubject('not-a-real-subject')
  assert.ok(fallback.length > 0)
  assert.notEqual(fallback, 'not-a-real-subject')
})

test('accepts quadratic_equations for math', () => {
  assert.equal(Q.resolvePaperTopic('math', 'quadratic_equations'), 'quadratic_equations')
})

test('clears unknown topic ids', () => {
  assert.equal(Q.resolvePaperTopic('math', 'no_such_topic_xyz'), '')
})

test('trims whitespace', () => {
  assert.equal(Q.resolvePaperSubject('  math  '), 'math')
  assert.equal(Q.resolvePaperTopic('math', '  quadratic_equations  '), 'quadratic_equations')
})

test('quadratic editorial page wires practice CTA (WP3-A / WP4)', () => {
  const src = readFileSync(join(ROOT, 'app/dse-maths/quadratic-equations/page.tsx'), 'utf8')
  assert.match(src, /href="\/practice\?subject=math&topic=quadratic_equations"/)
  assert.match(src, /href="\/notes\/math\?topic=quadratic_equations"/)
  assert.match(src, /href="\/paper-warrior\?subject=math&topic=quadratic_equations"/)
})

test('result guest copy states refresh clears memory progress (WP3-C / WP4)', () => {
  const src = readFileSync(join(ROOT, 'app/result/ResultPageClient.tsx'), 'utf8')
  assert.match(src, /訪客模式：刷新或關閉分頁會清走呢一節喺記憶體嘅進度/)
  assert.match(src, /Guest mode: refreshing or closing this tab clears this session/)
})

test('AdSlot and dual robots stay gone (WP3-B / WP4 regression)', () => {
  assert.equal(readFileSync.length > 0, true)
  let adExists = false
  try {
    readFileSync(join(ROOT, 'components/AdSlot.tsx'))
    adExists = true
  } catch {
    adExists = false
  }
  assert.equal(adExists, false)
  let publicRobots = false
  try {
    readFileSync(join(ROOT, 'public/robots.txt'))
    publicRobots = true
  } catch {
    publicRobots = false
  }
  assert.equal(publicRobots, false)
  const robots = readFileSync(join(ROOT, 'app/robots.ts'), 'utf8')
  assert.match(robots, /disallow:\s*\['\/api\/'\]/)
})
