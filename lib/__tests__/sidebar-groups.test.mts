// Desktop sidebar grouped by what the student is doing (UX loop 13, P1-I, 2026-09-30).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const side = readFileSync('components/Sidebar.tsx', 'utf8')
const dict = readFileSync('lib/dictionary.ts', 'utf8')
const items = [...side.matchAll(/\{ href: '([^']+)', key: '[a-zA-Z]+', Icon: \w+, exact: \w+, group: '(\w+)' \}/g)].map((m) => ({
  href: m[1],
  group: m[2],
}))

test('no destination was added or removed, only regrouped', () => {
  assert.deepEqual(
    items.map((i) => i.href).sort(),
    ['/bookmarks', '/dashboard', '/dashboard#error-dna', '/off-syllabus', '/predictor', '/relax', '/subjects'],
  )
})

test('practising comes first, then reviewing, then resting, with 不考之地 last', () => {
  assert.equal(items[0].href, '/subjects')
  assert.deepEqual([...new Set(items.map((i) => i.group))], ['study', 'review', 'rest', 'other'])
  // Each group is contiguous, so the rendered order matches ITEMS.
  const order = items.map((i) => i.group)
  for (let i = 1; i < order.length; i++) {
    if (order[i] !== order[i - 1]) assert.ok(!order.slice(0, i).includes(order[i]), `${order[i]} split`)
  }
  assert.equal(items.at(-1)?.href, '/off-syllabus')
})

test('each group is announced as a group and has a label in both languages', () => {
  assert.match(side, /role="group"\s+aria-label=\{label\}/)
  for (const k of ['groupStudy', 'groupReview', 'groupRest']) {
    assert.equal(dict.match(new RegExp(`\\b${k}: '`, 'g'))?.length, 2, k)
  }
})

test('a short laptop screen scrolls the list instead of cutting off the last items', () => {
  assert.match(side, /className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto/)
})

test('on short screens the decorative quote gives way to the navigation', () => {
  assert.match(side, /className="sidebar-quote hidden gap-3/)
  const css = readFileSync('app/globals.css', 'utf8')
  const at = css.lastIndexOf('@media (max-height: 760px)')
  assert.ok(at > 0 && /\.sidebar-quote \{ display: none; \}/.test(css.slice(at, at + 120)))
  // Top level (column 0), not nested in an @layer block, so it wins over the xl:flex
  // utility; the rendered result was checked at 1280×720 (docs/ux-loop-progress.md, LOOP 13).
  assert.equal(css[at - 1], '\n')
})
