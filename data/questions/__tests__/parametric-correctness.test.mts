// Mathematical-correctness spot-checks for the Mode A parametric banks.
//
// WHY THIS EXISTS: `createBank().add()` (../_parametric.ts) only guarantees the
// 4 option STRINGS are textually distinct — it never checks that the option at
// index 0 is actually the right answer. A formula bug (e.g. `v = d * t` instead
// of `d / t`) would ship a wrong "correct answer" to real students with zero
// guard catching it. This suite independently recomputes the expected answer
// from the numbers embedded in each question's own content string (parsed by
// regex — NOT by re-calling the bank file's own formula) and asserts it
// matches options[0]. Parsing from `content` (the problem statement) rather
// than from `id` means a bug that makes the id and the shown numbers disagree
// would also be caught.
//
// COVERAGE — this is a SAMPLE, not exhaustive. Covered: physics-bank.ts
// (pb_e1/e2/e3, pb_m1/m2, pb_h2 — 6 of ~17 families), chemistry-bank.ts
// (cb_e1, cb_m1, cb_h1, cb_h3 — 4 of ~9 families), math-bank.ts (mb_e1/e2/e3 —
// 3 of 15 families), m1-bank.ts (m1_e3 content-parsed, m1_e4 id-parsed — 2 of
// 12 families). NOT covered: the remaining families in these 4 banks, and
// every other Mode A bank (m2, economics/bafs numeric, etc.) and the earlier
// math-parametric.ts / *-hell.ts generators. Extend this file's pattern
// (regex the content, recompute independently, compare to options[0]) when
// touching an uncovered family, rather than trusting `createBank`'s
// distinctness guard to mean "correct."
//
// Same dynamic-import() requirement as structural.test.mts — see that file's
// header comment for why.

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { physicsBankQuestions } = await import('../physics-bank.ts')
const { chemistryBankQuestions } = await import('../chemistry-bank.ts')
const { mathBankQuestions } = await import('../math-bank.ts')
const { m1BankQuestions } = await import('../m1-bank.ts')

/** First numeric token in a rendered option string, e.g. "$\frac{1}{2}$ V" mis-parses fractions — only used on options built from plain numbers. */
function firstNumber(s: string): number {
  const m = s.match(/-?\d+(?:\.\d+)?/)
  assert.ok(m, `no number found in "${s}"`)
  return Number(m[0])
}

function byPrefix(bank: any[], prefix: string): any[] {
  const found = bank.filter((q) => q.id.startsWith(prefix))
  assert.ok(found.length > 0, `no questions found with id prefix "${prefix}" — has the bank been renamed/restructured?`)
  return found
}

function closeTo(actual: number, expected: number, id: string, epsilon = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) < epsilon,
    `${id}: expected ${expected}, got ${actual} (options[0]="${actual}")`,
  )
}

const fact = (k: number): number => (k <= 1 ? 1 : k * fact(k - 1))
const nCr = (k: number, r: number): number => fact(k) / (fact(r) * fact(k - r))

// ═══════════════════════════════════════════════════════════════════════════
// physics-bank.ts
// ═══════════════════════════════════════════════════════════════════════════

test('physics pb_e1: v = d / t', () => {
  for (const q of byPrefix(physicsBankQuestions, 'pb_e1_')) {
    const m = q.content.match(/\$(\d+)\$ 秒內行走 \$(\d+)\$ 米/)
    assert.ok(m, `pb_e1 content format changed, can't parse: ${q.content}`)
    const [, t, d] = m.map(Number)
    closeTo(firstNumber(q.options[0]), d / t, q.id)
  }
})

test('physics pb_e2: V = I × R (Ohm\'s law)', () => {
  for (const q of byPrefix(physicsBankQuestions, 'pb_e2_')) {
    const m = q.content.match(/電流 \$(\d+)\$ A 流過 \$(\d+)\$ Ω/)
    assert.ok(m, `pb_e2 content format changed, can't parse: ${q.content}`)
    const [, I, R] = m.map(Number)
    closeTo(firstNumber(q.options[0]), I * R, q.id)
  }
})

test('physics pb_e3: W = mg (g = 10)', () => {
  for (const q of byPrefix(physicsBankQuestions, 'pb_e3_')) {
    const m = q.content.match(/一物體質量 \$(\d+)\$ kg/)
    assert.ok(m, `pb_e3 content format changed, can't parse: ${q.content}`)
    const mass = Number(m[1])
    closeTo(firstNumber(q.options[0]), mass * 10, q.id)
  }
})

test('physics pb_m1: v = u + at', () => {
  for (const q of byPrefix(physicsBankQuestions, 'pb_m1_')) {
    const m = q.content.match(/物體初速 \$(\d+)\$ m\/s，加速度 \$(\d+)\$ m\/s²，經過 \$(\d+)\$ s/)
    assert.ok(m, `pb_m1 content format changed, can't parse: ${q.content}`)
    const [, u, a, t] = m.map(Number)
    closeTo(firstNumber(q.options[0]), u + a * t, q.id)
  }
})

test('physics pb_m2: KE = ½mv²', () => {
  for (const q of byPrefix(physicsBankQuestions, 'pb_m2_')) {
    const m = q.content.match(/質量 \$(\d+)\$ kg 的物體以 \$(\d+)\$ m\/s 運動，求其動能/)
    assert.ok(m, `pb_m2 content format changed, can't parse: ${q.content}`)
    const [, mass, v] = m.map(Number)
    closeTo(firstNumber(q.options[0]), 0.5 * mass * v * v, q.id)
  }
})

test('physics pb_h2: parallel resistance R = R1R2/(R1+R2)', () => {
  for (const q of byPrefix(physicsBankQuestions, 'pb_h2_')) {
    const m = q.content.match(/兩個電阻 \$(\d+)\$ Ω 及 \$(\d+)\$ Ω 並聯/)
    assert.ok(m, `pb_h2 content format changed, can't parse: ${q.content}`)
    const [, r1, r2] = m.map(Number)
    const expected = Math.round(((r1 * r2) / (r1 + r2)) * 100) / 100
    closeTo(firstNumber(q.options[0]), expected, q.id)
  }
})

// ═══════════════════════════════════════════════════════════════════════════
// chemistry-bank.ts
// ═══════════════════════════════════════════════════════════════════════════

test('chemistry cb_e1: n = m / M', () => {
  for (const q of byPrefix(chemistryBankQuestions, 'cb_e1_')) {
    const m = q.content.match(/\$(\d+(?:\.\d+)?)\$ g .*?M_r = (\d+)/)
    assert.ok(m, `cb_e1 content format changed, can't parse: ${q.content}`)
    const [, mass, mr] = m.map(Number)
    closeTo(firstNumber(q.options[0]), mass / mr, q.id)
  }
})

test('chemistry cb_m1: c = n / V', () => {
  for (const q of byPrefix(chemistryBankQuestions, 'cb_m1_')) {
    const m = q.content.match(/把 \$(\d+)\$ mol 溶質溶於 \$(\d+)\$ dm³/)
    assert.ok(m, `cb_m1 content format changed, can't parse: ${q.content}`)
    const [, nn, V] = m.map(Number)
    const expected = Math.round((nn / V) * 1000) / 1000
    closeTo(firstNumber(q.options[0]), expected, q.id)
  }
})

test('chemistry cb_h1: gas volume V = 24 × (m / M)', () => {
  for (const q of byPrefix(chemistryBankQuestions, 'cb_h1_')) {
    const m = q.content.match(/\$(\d+(?:\.\d+)?)\$ g .*?M_r = (\d+)/)
    assert.ok(m, `cb_h1 content format changed, can't parse: ${q.content}`)
    const [, mass, mr] = m.map(Number)
    const expected = Math.round(24 * (mass / mr) * 100) / 100
    closeTo(firstNumber(q.options[0]), expected, q.id)
  }
})

test('chemistry cb_h3: CaCO3 -> CaO stoichiometry (Mr 100 -> 56)', () => {
  for (const q of byPrefix(chemistryBankQuestions, 'cb_h3_')) {
    const m = q.content.match(/完全分解 \$(\d+)\$ g/)
    assert.ok(m, `cb_h3 content format changed, can't parse: ${q.content}`)
    const mass = Number(m[1])
    const expected = Math.round(((mass * 56) / 100) * 100) / 100
    closeTo(firstNumber(q.options[0]), expected, q.id)
  }
})

// ═══════════════════════════════════════════════════════════════════════════
// math-bank.ts
// ═══════════════════════════════════════════════════════════════════════════

test('math mb_e1: x^a . x^b = x^(a+b)', () => {
  for (const q of byPrefix(mathBankQuestions, 'mb_e1_')) {
    const m = q.content.match(/x\^\{(\d+)\} \\cdot x\^\{(\d+)\}/)
    assert.ok(m, `mb_e1 content format changed, can't parse: ${q.content}`)
    const [, a, b] = m.map(Number)
    closeTo(firstNumber(q.options[0]), a + b, q.id)
  }
})

test('math mb_e2: f(x) = ax + b evaluated at x = k', () => {
  for (const q of byPrefix(mathBankQuestions, 'mb_e2_')) {
    const coeffs = q.content.match(/f\(x\) = (\d+)x \+ (\d+)/)
    const kMatch = q.content.match(/\$f\((\d+)\)\$/)
    assert.ok(coeffs && kMatch, `mb_e2 content format changed, can't parse: ${q.content}`)
    const [, a, b] = coeffs.map(Number)
    const k = Number(kMatch[1])
    closeTo(firstNumber(q.options[0]), a * k + b, q.id)
  }
})

test('math mb_e3: percentage increase', () => {
  for (const q of byPrefix(mathBankQuestions, 'mb_e3_')) {
    const m = q.content.match(/原價 \$\\\$(\d+)\$，加價 \$(\d+)\\%\$/)
    assert.ok(m, `mb_e3 content format changed, can't parse: ${q.content}`)
    const [, P, r] = m.map(Number)
    closeTo(firstNumber(q.options[0]), (P * (100 + r)) / 100, q.id)
  }
})

// ═══════════════════════════════════════════════════════════════════════════
// m1-bank.ts
// ═══════════════════════════════════════════════════════════════════════════

test('m1 m1_e3: binomial coefficient C(m, r)', () => {
  for (const q of byPrefix(m1BankQuestions, 'm1_e3_')) {
    const m = q.content.match(/\\binom\{(\d+)\}\{(\d+)\}/)
    assert.ok(m, `m1_e3 content format changed, can't parse: ${q.content}`)
    const [, mm, r] = m.map(Number)
    closeTo(firstNumber(q.options[0]), nCr(mm, r), q.id)
  }
})

// m1_e4 (binomial mean E(X) = np) parsed from `id` instead of `content`: the
// content embeds the probability as a LaTeX \frac{p}{q} produced by the same
// `frac()` helper the bank imports, so parsing it independently would just be
// re-deriving the bank's own formatting code. The id already encodes the raw
// (m, pn, pd) generator params, e.g. "m1_e4_20_1_4", giving a genuinely
// separate check.
test('m1 m1_e4: binomial mean E(X) = n * p (parsed from id)', () => {
  for (const q of byPrefix(m1BankQuestions, 'm1_e4_')) {
    const m = q.id.match(/^m1_e4_(\d+)_(\d+)_(\d+)$/)
    assert.ok(m, `m1_e4 id format changed, can't parse: ${q.id}`)
    const [, n, pn, pd] = m.map(Number)
    closeTo(firstNumber(q.options[0]), (n * pn) / pd, q.id)
  }
})
