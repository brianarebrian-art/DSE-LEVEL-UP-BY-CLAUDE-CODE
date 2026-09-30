// The home page does not pull in KaTeX (UX loop 38, 2026-09-30; hardening prompt §36).
// Measured before: 256 KB (uncompressed) of KaTeX on the landing page for six fixed formulas
// in the demo. They are now plain text.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const home = readFileSync('app/page.tsx', 'utf8')

test('the home page imports neither MathText nor katex', () => {
  assert.doesNotMatch(home, /from '@\/components\/MathText'|from 'katex'/)
  assert.match(home, /<M>2x² \+ 3x − 5 = 0<\/M>/)
})

test('components the home page renders do not import KaTeX either', () => {
  const imports = [...home.matchAll(/import \w+ from '@\/components\/(\w+)'/g)].map((m) => m[1])
  assert.ok(imports.length > 3)
  for (const c of imports) {
    const src = readFileSync(`components/${c}.tsx`, 'utf8')
    assert.doesNotMatch(src, /MathText|from 'katex'/, c)
  }
})
