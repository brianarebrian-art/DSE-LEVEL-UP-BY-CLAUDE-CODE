// Written-question cards must keep the line breaks in question text.
//
// Found 2026-09-26: LongQuestionCard and TextQuestionCard rendered content,
// reference answers, marking schemes and explanations without any white-space
// rule, so every "\n" collapsed into a space. 906 of the 1,065 written questions
// have line breaks in their content: sub-parts (a)(b)(c) ran together, and the
// BAFS accounting questions showed thirteen lines of figures as one paragraph.
// MathText outputs the "\n" characters as they are; only CSS decides whether
// they show, so the rule has to sit on the wrapper.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..', '..')
const CARDS = ['components/LongQuestionCard.tsx', 'components/TextQuestionCard.tsx']
const FIELDS = /<MathText>\{tr\(q\.(content|referenceAnswer|markingScheme|explanation),/

/** For each MathText that renders a question field, the class list of the element that wraps it. */
function wrappers(src: string) {
  const lines = src.split('\n')
  const out: { field: string; cls: string }[] = []
  lines.forEach((line, i) => {
    const m = line.match(FIELDS)
    if (m) out.push({ field: m[1], cls: lines[i - 1] ?? '' })
  })
  return out
}

test('every question field in the written cards keeps its line breaks', () => {
  const missing: string[] = []
  for (const f of CARDS) {
    const found = wrappers(readFileSync(join(ROOT, f), 'utf8'))
    assert.ok(found.length > 0, `${f}: no question fields found; the test pattern is out of date`)
    for (const w of found) if (!/whitespace-pre-(line|wrap)/.test(w.cls)) missing.push(`${f}: ${w.field}`)
  }
  assert.deepEqual(missing, [], `line breaks collapse in: ${missing.join(', ')}`)
})

test('negative self-test: a wrapper without the rule is detected', () => {
  const src = '<div className="text-sm leading-relaxed">\n  <MathText>{tr(q.content, q.contentEn)}</MathText>'
  const [w] = wrappers(src)
  assert.equal(w.field, 'content')
  assert.ok(!/whitespace-pre-(line|wrap)/.test(w.cls))
})
