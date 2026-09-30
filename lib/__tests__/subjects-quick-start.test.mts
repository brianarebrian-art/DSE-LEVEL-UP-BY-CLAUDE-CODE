// /subjects: start a session from the subject list (UX loop 5, 2026-09-30).
//
// Each card used to be one link to the subject page, with 開始練習 written at the
// bottom; the student then had to find 立即開始 on the subject page. The card now
// holds two separate links: the subject name (stretched over the card, to the
// subject page as before) and 開始 10 題 (straight to a session).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = readFileSync(join(ROOT, 'app/subjects/SubjectsView.tsx'), 'utf8')
const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')
const card = code.slice(code.indexOf('const ActiveCard'), code.indexOf('const ComingSoonCard'))

test('every live card starts a session with the same URL as the homepage quick start', () => {
  assert.match(card, /href=\{quickStartHref\(s\.id\)\}/)
  assert.match(code, /import \{ quickStartHref \} from '@\/lib\/quickStart'/)
  // The count comes from SESSION_SIZE, never a literal.
  assert.match(card, /開始 \$\{SESSION_SIZE\} 題/)
  assert.doesNotMatch(card, /開始 10 題|Start 10 questions/)
})

test('the subject page is still one tap away, through the subject name', () => {
  assert.match(card, /<Link\s+href=\{`\/subjects\/\$\{s\.id\}`\}\s+className="after:absolute after:inset-0/)
  // The start link sits above the stretched link, or taps on it would open the subject page.
  assert.match(card, /href=\{quickStartHref\(s\.id\)\}[\s\S]{0,300}className="relative z-10/)
})

test('links are not nested and the card no longer says 開始練習 while opening the subject page', () => {
  // The card's root is a <div>, and it contains exactly two links.
  assert.match(card, /return \(\s*<div className=\{`group relative flex flex-col/)
  assert.equal(card.match(/<Link\b/g)?.length, 2)
  assert.doesNotMatch(card, /tl\.startPractice/)
})

test('the start link is a 48px target with a name that includes its visible text', () => {
  const link = card.slice(card.indexOf('href={quickStartHref(s.id)}'), card.indexOf('</Link>', card.indexOf('href={quickStartHref(s.id)}')))
  assert.match(link, /min-h-12/)
  assert.match(link, /aria-label=\{en \? `\$\{s\.nameEn\}: start \$\{SESSION_SIZE\} questions` : `\$\{s\.name\}：開始 \$\{SESSION_SIZE\} 題`\}/)
})

test('the printable-paper mode keeps an entry on this page, after the subject grid', () => {
  const grid = code.indexOf('sortGroup(subjects.filter(matches))')
  const paper = code.indexOf('href="/paper-warrior"')
  assert.ok(grid > 0 && paper > grid, 'paper-warrior link after the grid')
})
