// Floating tools on the practice page (UX loop 3, 2026-09-30).
//
// Measured at 375×812 before the change: a row of three chips (字級, 易讀字體,
// 今日夠了) at y=714–748, plus the accessibility button, the reading-ruler chip and
// the emotional-support button below it, covered the question progress dots and
// the first line of feedback after a wrong answer. Font size and the easy-read
// font were already in the accessibility panel, so the chips were duplicates.
//
// What must stay true:
//   • every setting is still reachable: font size, easy-read font and the ruler
//     from the accessibility panel; 今日夠了 from the practice header
//   • the ruler chip appears only while the ruler is on (to resize or switch off)
//   • the emotional-support button is untouched
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const code = (p: string) => read(p).replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')

const panel = code('components/A11yPanel.tsx')
const support = code('components/PracticeSupport.tsx')
const ruler = code('components/ReadingRuler.tsx')

test('font size and the easy-read font live in the accessibility panel, not in a practice chip', () => {
  assert.match(panel, /applyFontSize/)
  assert.match(panel, /onClick=\{toggleEasy\}\s+aria-pressed=\{easy\}/)
  assert.doesNotMatch(support, /applyFontSize|font-easy|dse_easy_font/)
})

test('the panel has its own ruler switch that the ruler overlay listens to', () => {
  assert.match(panel, /onClick=\{toggleRuler\}\s+aria-pressed=\{ruler\}/)
  const fn = panel.slice(panel.indexOf('const toggleRuler'), panel.indexOf('const toggleTimer'))
  assert.match(fn, /localStorage\.setItem\(RULER_KEY/)
  assert.match(fn, /dispatchEvent\(new Event\('dse-a11y'\)\)/)
  // Both sides use the same storage key and event.
  assert.match(read('components/ReadingRuler.tsx'), /const KEY = 'dse_reading_ruler'/)
  assert.match(panel, /const RULER_KEY = 'dse_reading_ruler'/)
  assert.match(ruler, /addEventListener\('dse-a11y', sync\)/)
})

test('the ruler chip is rendered only while the ruler is on', () => {
  const at = ruler.indexOf('className="fixed floating-bottom floating-left-2')
  assert.ok(at > 0, 'ruler chip container')
  assert.match(ruler.slice(0, at), /\{on && \(\s*<div\s*$/, 'the chip container must sit inside {on && ( … )}')
})

test('今日夠了 sits in both practice headers and opens the one dialog', () => {
  assert.match(support, /export const ENOUGH_TODAY_EVENT = 'dse-enough-today'/)
  assert.match(support, /addEventListener\(ENOUGH_TODAY_EVENT/)
  for (const f of ['app/practice/PracticeSession.tsx', 'app/practice/LongPracticeSession.tsx']) {
    assert.match(code(f), /<EnoughTodayButton \/>/, f)
  }
  // The dialog listener is mounted once, around both runners.
  assert.match(code('app/practice/PracticeShell.tsx'), /<PracticeSupport \/>/)
  // In the MC header it sits beside 休息吓, the other way to stop.
  const header = code('app/practice/PracticeSession.tsx')
  assert.ok(header.indexOf('<EnoughTodayButton />') > header.indexOf("tr('休息吓', 'Rest')"))
})

test('the dialog is announced as a dialog and closes with Escape', () => {
  assert.match(support, /role="dialog" aria-modal="true" aria-labelledby="enough-today-title"/)
  assert.match(support, /e\.key === 'Escape'/)
})

test('the emotional-support button is still on every page except /relax', () => {
  const sos = code('components/GlobalA11y.tsx')
  assert.match(sos, /aria-label=\{en \? 'Emotional support' : '情緒支援'\}/)
  assert.match(sos, /fixed floating-bottom right-4/)
})

test('negative self-test: a chip outside {on && …} would be caught', () => {
  const always = '<>\n      <div className="fixed floating-bottom floating-left-2 z-50">'
  const at = always.indexOf('className="fixed floating-bottom floating-left-2')
  assert.doesNotMatch(always.slice(0, at), /\{on && \(\s*<div\s*$/)
})
