// Clear System sidebar: four primary tabs match BottomNav; More tools follow.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const side = readFileSync('components/Sidebar.tsx', 'utf8')
const dict = readFileSync('lib/dictionary.ts', 'utf8')
const bottom = readFileSync('components/BottomNav.tsx', 'utf8')

const primaryBlock = side.slice(side.indexOf('const PRIMARY'), side.indexOf(']', side.indexOf('const PRIMARY')) + 1)
const moreBlock = side.slice(side.indexOf('const MORE'), side.indexOf(']', side.indexOf('const MORE')) + 1)
const primary = [...primaryBlock.matchAll(/href: '([^']+)'/g)].map((m) => m[1])
const more = [...moreBlock.matchAll(/href: '([^']+)'/g)].map((m) => m[1])

test('primary four match the bottom tab hrefs in the same order', () => {
  assert.deepEqual(primary, ['/subjects', '/dashboard', '/bookmarks', '/account'])
  for (const href of primary) {
    assert.ok(bottom.includes(`'${href}'`), `bottom nav missing ${href}`)
  }
})

test('more tools end with off-syllabus', () => {
  assert.ok(more.includes('/notes'))
  assert.equal(more.at(-1), '/off-syllabus')
})

test('group labels exist in both languages', () => {
  for (const k of ['groupMain', 'groupMore']) {
    assert.equal(dict.match(new RegExp(`\\b${k}: '`, 'g'))?.length, 2, k)
  }
})

test('sidebar uses material chrome class', () => {
  assert.match(side, /chrome-material/)
})
