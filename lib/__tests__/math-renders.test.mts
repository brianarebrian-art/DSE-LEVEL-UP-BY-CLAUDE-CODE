// ============================================================================
// math-renders.test.mts — every formula in every question can be drawn
// ----------------------------------------------------------------------------
// Founders' reply 39a (2026-10-08). Seventeen physics questions wrote the unit as
// \text{\Omega}. KaTeX cannot parse that, and components/MathText.tsx renders with
// throwOnError: false, so instead of failing anywhere visible the page showed a red
// "\Omega" to students, eleven of them live. Nothing caught it because no check ever
// drew the formulas.
//
// This test splits every string of every question (all subjects, withdrawn included)
// the way MathText does and parses each math span with KaTeX, strictly.
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const katex = pick(await import('katex')) as { renderToString: (tex: string, o: object) => string }
const I = pick(await import('../../data/questions/index.ts')) as { getSubjectQuestionsRaw: (s: string) => object[] }
const S = pick(await import('../../data/subjects.ts')) as { subjects: { id: string }[] }

// Same tokenising as components/MathText.tsx (checked against its source below).
const ESC = ' DLR '
const SPLIT = /(\$\$[^$]+\$\$|\$[^$]+\$)/g

/** The math spans of one string, as MathText would hand them to KaTeX. */
function mathSpans(text: string): { tex: string; display: boolean }[] {
  const out: { tex: string; display: boolean }[] = []
  for (const part of text.replace(/\\\$/g, ESC).split(SPLIT)) {
    if (part.length > 4 && part.startsWith('$$') && part.endsWith('$$')) out.push({ tex: part.slice(2, -2), display: true })
    else if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) out.push({ tex: part.slice(1, -1), display: false })
  }
  return out.map((s) => ({ ...s, tex: s.tex.split(ESC).join('\\$') }))
}

/** KaTeX's complaint about the first span of `text` it cannot parse, or null. */
function unparsable(text: string): string | null {
  for (const { tex, display } of mathSpans(text)) {
    try {
      katex.renderToString(tex, { throwOnError: true, strict: 'ignore', displayMode: display })
    } catch (e) {
      return `${tex.slice(0, 60)} → ${(e as Error).message.slice(0, 80)}`
    }
  }
  return null
}

function strings(v: unknown, field: string, out: [string, string][]): void {
  if (typeof v === 'string') out.push([field, v])
  else if (Array.isArray(v)) for (const x of v) strings(x, field, out)
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) strings(x, k, out)
}

test('the tokenising here matches components/MathText.tsx', () => {
  const src = readFileSync(`${ROOT}components/MathText.tsx`, 'utf8')
  assert.ok(src.includes(`const ESC = '${ESC}'`), 'escaped-dollar placeholder')
  assert.ok(src.includes('.replace(/\\\\\\$/g, ESC)'), 'escaped dollars are protected before splitting')
  assert.ok(src.includes(`.split(${SPLIT.source.replace(/^/, '/')}/g)`), 'same split pattern')
})

test('self-test: the check catches an unparsable span and leaves currency alone', () => {
  assert.ok(unparsable('$10\\,\\text{\\Omega}$'))
  assert.equal(unparsable('$10\\,\\Omega$'), null)
  assert.equal(unparsable('售價 \\$500，成本 \\$300'), null)
  assert.ok(unparsable('$$\\frac{1}{$$'))
})

test('every formula in every question bank can be drawn', () => {
  const bad: string[] = []
  let questions = 0
  for (const { id: subject } of S.subjects) {
    for (const q of I.getSubjectQuestionsRaw(subject)) {
      questions++
      const fields: [string, string][] = []
      strings(q, '', fields)
      for (const [field, text] of fields) {
        const why = unparsable(text)
        if (why) bad.push(`${subject}/${(q as { id: string }).id} [${field}] ${why}`)
      }
    }
  }
  assert.ok(questions > 20000, `only ${questions} questions scanned; the scan went blind`)
  assert.deepEqual(bad, [], `${bad.length} formula(s) cannot be drawn:\n  ${bad.slice(0, 20).join('\n  ')}`)
})
