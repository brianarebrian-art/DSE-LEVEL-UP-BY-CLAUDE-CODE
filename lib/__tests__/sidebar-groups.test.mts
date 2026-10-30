// Desktop sidebar: four primary tabs match BottomNav, then More + off-syllabus.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const side = readFileSync('components/Sidebar.tsx', 'utf8')
const dict = readFileSync('lib/dictionary.ts', 'utf8')
const bottom = readFileSync('components/BottomNav.tsx', 'utf8')
const items = [...side.matchAll(/\{ href: '([^']+)', key: '[a-zA-Z]+', Icon: \w+, exact: \w+, group: '(\w+)' \}/g)].map((m) => ({
  href: m[1],
  group: m[2],
}))

test('primary four match the bottom tab hrefs in the same order', () => {
  const primary = items.filter((i) => i.group === 'primary').map((i) => i.href)
  assert.deepEqual(primary, ['/subjects', '/dashboard', '/bookmarks', '/account'])
  for (const href of primary) {
    assert.ok(bottom.includes(`'${href}'`), `bottom nav missing ${href}`)
  }
})

test('destinations: primary + more tools + off-syllabus last', () => {
  assert.deepEqual(
    items.map((i) => i.href),
    [
      '/subjects',
      '/dashboard',
      '/bookmarks',
      '/account',
      '/notes',
      '/dashboard#error-dna',
      '/predictor',
      '/relax',
      '/off-syllabus',
    ],
  )
  assert.deepEqual([...new Set(items.map((i) => i.group))], ['primary', 'more', 'other'])
  assert.equal(items.at(-1)?.href, '/off-syllabus')
})

test('each group is announced as a group and has a label in both languages', () => {
  assert.match(side, /role="group"\s+aria-label=\{label\}/)
  for (const k of ['groupMain', 'groupMore']) {
    assert.equal(dict.match(new RegExp(`\\b${k}: '`, 'g'))?.length, 2, k)
  }
})

test('sidebar primary labels match nav tab strings (no second vocabulary)', () => {
  // zh：練習／進度／收藏／帳戶；en：Practise／Progress／Saved／Account
  assert.match(dict, /tabProgress: '進度'/)
  assert.match(dict, /progress: '進度'/)
  assert.match(dict, /tabAccount: '帳戶'/)
  assert.match(dict, /account: '帳戶'/)
  assert.match(dict, /tabProgress: 'Progress'/)
  assert.match(dict, /progress: 'Progress'/)
})

test('a short laptop screen scrolls the list instead of cutting off the last items', () => {
  assert.match(side, /className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto/)
})

test('on short screens the decorative quote gives way to the navigation', () => {
  assert.match(side, /className="sidebar-quote hidden gap-3/)
  const css = readFileSync('app/globals.css', 'utf8')
  const at = css.lastIndexOf('@media (max-height: 760px)')
  assert.ok(at > 0 && /\.sidebar-quote \{ display: none; \}/.test(css.slice(at, at + 120)))
  assert.equal(css[at - 1], '\n')
})
