// 不考之地 (/off-syllabus). Yuna 2026-09-26: non-DSE content stays in the site but out of
// prominent places; the Cantonese course is reached through it, not from the homepage.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('the hamburger menu and the sidebar end with 不考之地', () => {
  const nav = read('components/Navbar.tsx')
  const links = [...nav.matchAll(/\{ href: '([^']+)', key: '[a-zA-Z]+' \}/g)].map((m) => m[1])
  assert.equal(links.at(-1), '/off-syllabus', 'last hamburger item')
  const side = read('components/Sidebar.tsx')
  const items = [...side.matchAll(/\{ href: '([^']+)', key: '[a-zA-Z]+', Icon/g)].map((m) => m[1])
  assert.equal(items.at(-1), '/off-syllabus', 'last sidebar item')
})

test('name and tagline are as decided', () => {
  const dict = read('lib/dictionary.ts')
  assert.match(dict, /offSyllabus: '不考之地'/)
  assert.match(dict, /tagline: '純粹為樂趣而學'/)
})

test('the homepage no longer links to /cantonese; 不考之地 does', () => {
  assert.doesNotMatch(read('app/page.tsx'), /href="\/cantonese"/)
  assert.match(read('app/off-syllabus/OffSyllabusView.tsx'), /href: '\/cantonese'/)
  assert.match(read('app/cantonese/CantoneseView.tsx'), /href="\/off-syllabus"/, 'the course links back')
})
