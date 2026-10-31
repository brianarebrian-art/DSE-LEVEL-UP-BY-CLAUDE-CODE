// The home page does not pull in KaTeX (UX loop 38, 2026-09-30; hardening prompt §36).
// Measured before: 256 KB (uncompressed) of KaTeX on the landing page for six fixed formulas
// in the demo. They are now plain text.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const home = readFileSync('app/HomePageClient.tsx', 'utf8')

test('the home page imports neither MathText nor katex', () => {
  // Clear／Morandi 首頁已唔再放 demo 公式；閘只守「唔拉 KaTeX 入 landing」。
  assert.doesNotMatch(home, /from '@\/components\/MathText'|from 'katex'/)
  assert.doesNotMatch(home, /\bMathText\b|\bkatex\b/i)
})

test('root layout does not globally load katex CSS', () => {
  const layout = readFileSync('app/layout.tsx', 'utf8')
  assert.doesNotMatch(layout, /katex\/dist\/katex\.min\.css/)
  assert.match(layout, /preferredRegion/)
})

test('MathText loads katex CSS locally', () => {
  const src = readFileSync('components/MathText.tsx', 'utf8')
  assert.match(src, /katex\/dist\/katex\.min\.css/)
})

test('components the home page renders do not import KaTeX either', () => {
  const imports = [...home.matchAll(/import \w+ from '@\/components\/(\w+)'/g)].map((m) => m[1])
  assert.ok(imports.length > 3)
  for (const c of imports) {
    const src = readFileSync(`components/${c}.tsx`, 'utf8')
    assert.doesNotMatch(src, /MathText|from 'katex'/, c)
  }
})
