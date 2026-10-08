// The 176-question rationale repair (Yuna 2026-09-29; docs/rationale-repairs.md).
//
//   withdrawn → rewritten → automated-checked → content-reviewed → restored
//
// These tests are the gate between the stages:
//   · nothing is back in the bank unless its record says restored AND names the person
//     who reviewed it; nothing short of content-reviewed carries a reviewer (§16.C);
//   · what a batch file says was written is what the bank holds (an old draft
//     re-promoted over a repaired question fails here);
//   · the maths of each M1-01 question is recomputed here, separately from the script
//     that generated it, and every note must sit on the option it describes.
//
// Founders' reply 31-1c (2026-10-04): a COMPUTED batch (batch file `computed: true`,
// every template recomputed independently in this file) may go back into practice
// without a person's review, recorded as `restoreBasis: "machine-gate"`. Such a record
// carries no reviewer. Hand-written repairs still need the full review above.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const I = pick(await import('../../data/questions/index.ts'))

type Stage = 'withdrawn' | 'rewritten' | 'automated-checked' | 'content-reviewed' | 'restored'
const ORDER: Stage[] = ['withdrawn', 'rewritten', 'automated-checked', 'content-reviewed', 'restored']
// The six content-review items (Yuna 2026-09-29, decision ①). All six must pass;
// "5 of 6" is a fail and the question stays withdrawn.
const ITEMS = ['stem', 'answer', 'optionNotes', 'concept', 'teaching', 'language'] as const
interface Review {
  by: string
  date: string
  decision: 'pass' | 'fail'
  items: Record<(typeof ITEMS)[number], 'pass' | 'fail'>
  notes: string
}
interface Rec { subject: string; batch: string | null; stage: Stage; updated: string; contentReview: null | Review; restoreBasis?: string }
const log = JSON.parse(read('data/questions/rationale-repairs.json')) as Record<string, Rec>
const withdrawn = JSON.parse(read('data/questions/withdrawn.json')) as Record<string, Record<string, unknown>>

interface Note { optionId: number; zh: string; en: string; kind: string }
interface Repair { id: string; template: string; params: Record<string, number>; options: string[]; explanation: string; explanationEn: string; optionNotes: Note[] }
const batches = readdirSync(join(ROOT, 'data/questions/rationale-repairs'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(read(`data/questions/rationale-repairs/${f}`)) as { batch: string; subject: string; computed?: boolean; repairs: Repair[] })

test('the repair log covers the positional withdrawals of 2026-09-29, one record per question', () => {
  // First decision: 176. Fourth decision: 135 machine-generated plus the hand-written
  // class A (lib/__tests__/posref-cohorts.test.mts checks the cohorts themselves).
  assert.equal(Object.values(log).filter((r) => (r as { cohort?: string }).cohort === 'positional-first').length, 176)
  for (const [id, r] of Object.entries(log)) {
    assert.ok(ORDER.includes(r.stage), `${id}: unknown stage ${r.stage}`)
    assert.ok(I.getSubjectQuestionsRaw(r.subject).some((q) => q.id === id), `${id} not in the ${r.subject} bank`)
  }
})

/** Every rule a repair record must satisfy. Returns the problems found (empty = fine). */
function gateProblems(id: string, r: Rec, isWithdrawn: boolean, computedHere: Set<string> = recomputedHere()): string[] {
  const out: string[] = []
  const bad = (m: string) => out.push(`${id}: ${m}`)
  const machine = r.restoreBasis === 'machine-gate'
  if (r.restoreBasis !== undefined && !machine) bad(`unknown restoreBasis ${r.restoreBasis}`)
  if (machine) {
    // 31-1c: only a computed batch, only as the final stage, never with a reviewer.
    if (r.stage !== 'restored') bad('restoreBasis is recorded only when the question is restored')
    if (r.contentReview !== null) bad('a machine-gate restore carries no review')
    if (!computedHere.has(r.batch ?? '')) bad(`machine-gate restore needs a computed batch recomputed in this test, not ${r.batch}`)
  }
  if (r.stage === 'restored' && isWithdrawn) bad('marked restored but still withdrawn')
  if (r.stage !== 'restored' && !isWithdrawn) bad(`back in the bank but its stage is ${r.stage}`)
  const cr = r.contentReview
  if (cr) {
    // A recorded review is complete: who, when, the decision, all six items, notes.
    if (!cr.by?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(cr.date ?? '')) bad('review needs the reviewer and a date')
    if (cr.decision !== 'pass' && cr.decision !== 'fail') bad('decision must be pass or fail')
    for (const k of ITEMS) if (cr.items?.[k] !== 'pass' && cr.items?.[k] !== 'fail') bad(`item ${k} not recorded`)
    const allPass = ITEMS.every((k) => cr.items?.[k] === 'pass')
    if ((cr.decision === 'pass') !== allPass) bad('decision is pass only when all six items pass')
    if (cr.decision === 'fail' && !cr.notes?.trim()) bad('a failed review must say why')
  }
  const at = ORDER.indexOf(r.stage)
  if (at >= ORDER.indexOf('content-reviewed')) {
    if (!machine && cr?.decision !== 'pass') bad(`${r.stage} needs a passed review`)
  } else if (at < ORDER.indexOf('automated-checked')) {
    // §16.C: no review is recorded for something that has not been rewritten yet.
    if (cr !== null) bad('review recorded before the rewrite')
  } else if (cr !== null && cr.decision !== 'fail') {
    // automated-checked: not reviewed yet, or reviewed and failed (back to rework).
    bad('a passed review must move the stage on')
  }
  return out
}

test('restore gate: back in the bank only when restored, and only after a full passed review', () => {
  const problems = Object.entries(log).flatMap(([id, r]) => gateProblems(id, r, !!withdrawn[r.subject]?.[id]))
  assert.deepEqual(problems, [])
})

test('restore gate rejects the shortcuts it exists to stop', () => {
  const allPass = Object.fromEntries(ITEMS.map((k) => [k, 'pass'])) as Review['items']
  const review = (over: Partial<Review> = {}): Review => ({ by: 'Reviewer', date: '2026-10-01', decision: 'pass', items: { ...allPass }, notes: '', ...over })
  const rec = (stage: Stage, contentReview: Review | null): Rec => ({ subject: 'm1', batch: 'M1-01', stage, updated: '2026-10-01', contentReview })
  const fiveOfSix = review({ items: { ...allPass, teaching: 'fail' } })
  // 5 of 6 recorded as a pass
  assert.ok(gateProblems('x', rec('content-reviewed', fiveOfSix), true).some((p) => p.includes('all six')))
  // restored with no review, or back in the bank without being restored
  assert.ok(gateProblems('x', rec('restored', null), false).length > 0)
  assert.ok(gateProblems('x', rec('automated-checked', null), false).some((p) => p.includes('back in the bank')))
  // a reviewer filled in before the rewrite (§16.C)
  assert.ok(gateProblems('x', rec('withdrawn', review()), true).some((p) => p.includes('before the rewrite')))
  // a failed review without a reason
  assert.ok(gateProblems('x', rec('automated-checked', review({ decision: 'fail', items: { ...allPass, language: 'fail' } })), true).some((p) => p.includes('say why')))
  // 31-1c machine-gate restore: refused for a batch not recomputed here, with a review
  // attached, or before the restore; accepted for a computed batch with no reviewer.
  const machine = (stage: Stage, batch: string, cr: Review | null = null): Rec => ({ ...rec(stage, cr), batch, restoreBasis: 'machine-gate' })
  const computed = new Set(['M1-01'])
  assert.ok(gateProblems('x', machine('restored', 'BAFS-01'), false, computed).some((p) => p.includes('computed batch')))
  assert.ok(gateProblems('x', machine('restored', 'M1-01', review()), false, computed).some((p) => p.includes('carries no review')))
  assert.ok(gateProblems('x', machine('automated-checked', 'M1-01'), true, computed).some((p) => p.includes('only when the question is restored')))
  assert.ok(gateProblems('x', { ...rec('restored', null), restoreBasis: 'teacher-said-ok' }, false, computed).some((p) => p.includes('unknown restoreBasis')))
  assert.deepEqual(gateProblems('x', machine('restored', 'M1-01'), false, computed), [])
  // the legitimate paths pass
  assert.deepEqual(gateProblems('x', rec('automated-checked', null), true), [])
  assert.deepEqual(gateProblems('x', rec('automated-checked', review({ decision: 'fail', items: { ...allPass, concept: 'fail' }, notes: 'wrong rule named' })), true), [])
  assert.deepEqual(gateProblems('x', rec('restored', review()), false), [])
})

test('each batch file matches the log and the bank', () => {
  for (const b of batches) {
    const bank = new Map(I.getSubjectQuestionsRaw(b.subject).map((q) => [q.id, q as unknown as Record<string, unknown>]))
    for (const r of b.repairs) {
      assert.equal(log[r.id]?.batch, b.batch, `${r.id}: log batch`)
      assert.ok(ORDER.indexOf(log[r.id].stage) >= ORDER.indexOf('automated-checked'), `${r.id}: stage ${log[r.id].stage}`)
      const q = bank.get(r.id)!
      assert.deepEqual(q.options, r.options, `${r.id}: options in the bank differ from the batch`)
      assert.equal(q.explanation, r.explanation, `${r.id}: explanation in the bank differs from the batch`)
      assert.deepEqual(q.optionNotes, r.optionNotes.map(({ optionId, zh, en }) => ({ optionId, zh, en })), `${r.id}: notes differ`)
    }
  }
})

// ── M1-01: recompute, independently of scripts/qbank/repairs/m1-01.mts ──
const x = (coef: number, pow: number) => `${coef === 1 ? '' : coef}${pow === 0 ? '' : pow === 1 ? 'x' : `x^{${pow}}`}`
const expectM1: Record<string, (p: Record<string, number>) => Record<string, string>> = {
  'product-x^a-sin-bx': ({ a, b }) => ({
    // d/dx (x^a sin bx) = a x^(a-1) sin bx + b x^a cos bx
    correct: `$${x(a, a - 1)} \\sin ${b}x + ${x(b, a)} \\cos ${b}x$`,
    multiply: `$${x(a * b, a - 1)} \\cos ${b}x$`, // u'·v'
    missingFactor: `$${x(a, a - 1)} \\sin ${b}x + ${x(1, a)} \\cos ${b}x$`, // v' without the chain-rule factor
    swapped: `$${x(a, a - 1)} \\cos ${b}x + ${x(b, a)} \\sin ${b}x$`,
  }),
  'quotient-kx-over-x+c': ({ k, c }) => ({
    // d/dx (kx/(x+c)) = kc/(x+c)^2
    correct: `$\\dfrac{${k * c}}{(x + ${c})^{2}}$`,
    reversed: `$\\dfrac{-${k * c}}{(x + ${c})^{2}}$`, // uv' − u'v
    numeratorOnly: `$\\dfrac{${k}}{(x + ${c})^{2}}$`, // u'/v²
    ratio: `$${k}$`, // u'/v'
  }),
}

test('M1-01: parameters read from the stem, every option recomputed, every note on its own option', () => {
  const b = batches.find((x) => x.batch === 'M1-01')
  assert.ok(b, 'batch M1-01 exists')
  const bank = new Map(I.getSubjectQuestionsRaw('m1').map((q) => [q.id, q as unknown as { content: string; options: string[]; correctIndex: number }]))
  assert.equal(b!.repairs.length, 10)
  for (const r of b!.repairs) {
    const q = bank.get(r.id)!
    const pm = q.content.match(/x\^\{(\d+)\} \\sin (\d+)x/)
    const qm = q.content.match(/\\dfrac\{(\d+)x\}\{x \+ (\d+)\}/)
    const params: Record<string, number> | null = pm ? { a: +pm[1], b: +pm[2] } : qm ? { k: +qm[1], c: +qm[2] } : null
    assert.ok(params, `${r.id}: stem not recognised`)
    assert.deepEqual(r.params, params, `${r.id}: params in the batch differ from the stem`)
    const exp = expectM1[r.template](params!)
    for (const n of r.optionNotes) {
      assert.equal(q.options[n.optionId], exp[n.kind], `${r.id}: note "${n.kind}" is on option ${n.optionId} = ${q.options[n.optionId]}`)
    }
    const correct = r.optionNotes.filter((n) => n.kind === 'correct')
    assert.equal(correct.length, 1)
    assert.equal(correct[0].optionId, q.correctIndex, `${r.id}: correctIndex`)
    assert.equal(new Set(q.options).size, q.options.length, `${r.id}: options distinct`)
    assert.doesNotMatch(q.options.join(' '), /x\^\{1\}(?!\d)/, `${r.id}: x^{1} left in an option`)
  }
})

// ── M1-02 (2026-10-04): recompute, independently of scripts/qbank/repairs/m1-02.mts ──
// Each entry reads the parameters from the stem with its own pattern and rebuilds the
// four options from the arithmetic. Written separately on purpose: if the generator
// and this file shared code, a shared mistake would pass.
const sup = (k: number) => (k === 1 ? '' : `^{${k}}`)
const dec = (v: number) => String(Math.round(v * 10000) / 10000)
const M1_02: Record<string, { parse: (stem: string) => Record<string, number> | null; expect: (p: Record<string, number>) => Record<string, string> }> = {
  'chain-(ax+b)^n': {
    parse: (s) => { const m = s.match(/\(\((\d+)x \+ (\d+)\)\^\{(\d+)\}/); return m ? { a: +m[1], b: +m[2], n: +m[3] } : null },
    // d/dx (ax+b)^n = na(ax+b)^(n-1)
    expect: ({ a, b, n }) => ({
      correct: `$${n * a}(${a}x + ${b})${sup(n - 1)}$`,
      missingInner: `$${n}(${a}x + ${b})${sup(n - 1)}$`,
      exponentKept: `$${n * a}(${a}x + ${b})${sup(n)}$`,
      bracketReplaced: `$${n}(${a})${sup(n - 1)}$`,
    }),
  },
  'ln(ax^2+c)': {
    parse: (s) => { const m = s.match(/\\ln\((\d+)x\^\{2\} \+ (\d+)\)/); return m ? { a: +m[1], c: +m[2] } : null },
    // d/dx ln(ax^2 + c) = 2ax / (ax^2 + c)
    expect: ({ a, c }) => ({
      correct: `$\\dfrac{${a + a}x}{${a}x^{2} + ${c}}$`,
      missingInner: `$\\dfrac{1}{${a}x^{2} + ${c}}$`,
      droppedConstant: `$\\dfrac{${a + a}x}{${a}x^{2}}$`,
      logFactor: `$${a + a}x \\ln(${a}x^{2} + ${c})$`,
    }),
  },
  'implicit-px^2+qy^2': {
    parse: (s) => { const m = s.match(/(\d+)x\^\{2\} \+ (\d+)y\^\{2\}/); return m ? { p: +m[1], q: +m[2] } : null },
    // 2px + 2qy y' = 0  =>  y' = -px/(qy)
    expect: ({ p, q }) => ({
      correct: `$-\\dfrac{${p}x}{${q}y}$`,
      missingNeg: `$\\dfrac{${p}x}{${q}y}$`,
      numeratorUnreduced: `$-\\dfrac{${p * 2}x}{${q}y}$`,
      denominatorUnreduced: `$-\\dfrac{${p}x}{${q * 2}y}$`,
    }),
  },
  'second-derivative-cubic': {
    parse: (s) => { const m = s.match(/f\(x\) = (\d+)x\^\{3\} \+ (\d+)x\^\{2\} \+ (\d+)x\$/); return m ? { a: +m[1], b: +m[2], c: +m[3] } : null },
    // f = ax^3 + bx^2 + cx: f' = 3ax^2 + 2bx + c, f'' = 6ax + 2b, f''' = 6a
    expect: ({ a, b, c }) => ({
      correct: `$${a * 6}x + ${b * 2}$`,
      firstOnly: `$${a * 3}x^{2} + ${b * 2}x + ${c}$`,
      keptX: `$${a * 6}x + ${b * 2}x$`,
      third: `$${a * 6}$`,
    }),
  },
  'increasing-ax^2-kx': {
    parse: (s) => { const m = s.match(/f\(x\) = (\d*)x\^\{2\} -(\d+) x\$。求 \$f\(x\)\$ 為【遞增】/); return m ? { a: m[1] ? +m[1] : 1, k: +m[2] } : null },
    // f' = 2ax - k > 0  <=>  x > k / 2a
    expect: ({ a, k }) => ({ correct: `$x > ${k / (2 * a)}$`, reversed: `$x < ${k / (2 * a)}$`, forgotCoefficient: `$x > ${k}$`, positive: '$x > 0$' }),
  },
  'second-derivative-test-quadratic': {
    parse: (s) => { const m = s.match(/f\(x\) = (\d*)x\^\{2\} -(\d+) x \+ (\d+)\$。試用二階導數判別法，判斷 \$x = (\d+)\$/); return m ? { a: m[1] ? +m[1] : 1, k: +m[2], c: +m[3], x0: +m[4] } : null },
    // f'' = 2a > 0 everywhere, so the stationary point is a minimum
    expect: ({ a, x0 }) => ({
      correct: `極小值點，因為 $f''(${x0}) = ${2 * a} > 0$`,
      reversed: `極大值點，因為 $f''(${x0}) = ${2 * a} > 0$`,
      inflection: `拐點，因為 $f''(${x0}) = 0$`,
      firstDerivative: `極大值點，因為 $f'(${x0}) = 0$`,
    }),
  },
  'z-score-normal': {
    parse: (s) => { const m = s.match(/平均分 \$(\d+)\$，標準差 \$(\d+)\$。小明考獲 \$(\d+)\$ 分/); return m ? { mu: +m[1], sigma: +m[2], x: +m[3] } : null },
    expect: ({ mu, sigma, x }) => ({
      correct: `$${dec((x - mu) / sigma)}$ 個標準差`,
      differenceOnly: `$${dec(x - mu)}$ 個標準差`,
      scoreOverSigma: `$${dec(x / sigma)}$ 個標準差`,
      meanOverSigma: `$${dec(mu / sigma)}$ 個標準差`,
    }),
  },
}

// ── M1-03 (2026-10-08, founders' reply 32a): recompute, independently of repairs/m1-03.mts ──
const r4 = (v: number) => String(Math.round(v * 10000) / 10000)
const pm = (c: number) => (c < 0 ? `− ${Math.abs(c)}` : `+ ${c}`)
const M1_03: typeof M1_02 = {
  'quotient-kx-over-x+c': {
    parse: (s) => { const m = s.match(/\\dfrac\{(\d+)x\}\{x \+ (\d+)\}/); return m ? { k: +m[1], c: +m[2] } : null },
    expect: (p) => expectM1['quotient-kx-over-x+c'](p),
  },
  'normal-x-from-z': {
    parse: (s) => { const m = s.match(/N\((\d+), (\d+)\^\{2\}\)\$。已知某觀測值的標準分數為 \$z = (-?[\d.]+)\$/); return m ? { mu: +m[1], sigma: +m[2], z: +m[3] } : null },
    // x = μ + zσ
    expect: ({ mu, sigma, z }) => ({ correct: `$${r4(mu + sigma * z)}$`, reversed: `$${r4(mu - sigma * z)}$`, offsetOnly: `$${r4(sigma * z)}$`, zPlusMean: `$${r4(z + mu)}$` }),
  },
  'binomial-normal-approximation': {
    parse: (s) => { const m = s.match(/B\((\d+), ([\d.]+)\)\$。當 \$n\$ 足夠大時/); return m ? { n: +m[1], p: +m[2] } : null },
    // μ = np, σ² = np(1 − p)
    expect: ({ n, p }) => {
      const failures = n - n * p
      const variance = n * p * (1 - p)
      const pair = (m: number, s: number) => `$\\mu = ${r4(m)}$，$\\sigma = ${r4(s)}$`
      return { correct: pair(n * p, Math.sqrt(variance)), varianceAsSd: pair(n * p, variance), failuresMean: pair(failures, Math.sqrt(variance)), missingQ: pair(n * p, Math.sqrt(n * p)) }
    },
  },
  'definite-integral-kx': {
    parse: (s) => { const m = s.match(/f\(x\) = (\d+)x\$。試求 \$f\$ 在區間 \$\[(\d+), (\d+)\]\$/); return m ? { k: +m[1], a: +m[2], b: +m[3] } : null },
    // ∫ kx dx from a to b = k(b² − a²)/2
    expect: ({ k, a, b }) => ({ correct: `$${r4((k * (b * b - a * a)) / 2)}$`, reversed: `$${r4((k * (a * a - b * b)) / 2)}$`, upperOnly: `$${r4((k * b * b) / 2)}$`, constantTimesLength: `$${r4(k * b - k * a)}$` }),
  },
  'antiderivative-through-point': {
    parse: (s) => { const m = s.match(/= (\d+)x\$，且曲線經過點 \$\((\d+), (\d+)\)\$/); return m ? { k: +m[1], a: +m[2], b: +m[3] } : null },
    // y = (k/2)x² + C with C = b − (k/2)a²
    expect: ({ k, a, b }) => {
      const C = b - (k * a * a) / 2
      return { correct: `$y = ${k / 2}x^{2} ${pm(C)}$`, noConstant: `$y = ${k / 2}x^{2}$`, notHalved: `$y = ${k}x^{2} ${pm(C)}$`, signFlipped: `$y = ${k / 2}x^{2} ${pm(-C)}$` }
    },
  },
  'area-under-cx^2': {
    parse: (s) => { const m = s.match(/曲線 \$y = (\d*)x\^\{2\}\$ 與 \$x\$ 軸及直線 \$x = (\d+)\$/); return m ? { c: m[1] ? +m[1] : 1, b: +m[2] } : null },
    // ∫₀ᵇ cx² dx = cb³/3
    expect: ({ c, b }) => {
      const sq = (v: number) => `$${r4(v)}$ 平方單位`
      const cube = c * b * b * b
      return { correct: sq(cube / 3), height: sq(c * b * b), halfInstead: sq(cube / 2), halved: sq(cube / 6) }
    },
  },
  'binomial-variance': {
    parse: (s) => { const m = s.match(/B\((\d+), ([\d.]+)\)\$。求 \$\\mathrm\{Var\}\(X\)\$/); return m ? { n: +m[1], p: +m[2] } : null },
    expect: ({ n, p }) => ({ correct: `$${r4(n * p * (1 - p))}$`, mean: `$${r4(n * p)}$`, sd: `$${r4(Math.sqrt(n * p * (1 - p)))}$`, missingP: `$${r4(n - n * p)}$` }),
  },
  'binomial-at-least-one': {
    parse: (s) => { const m = s.match(/B\((\d+), ([\d.]+)\)\$。求 \$P\(X \\geq 1\)\$/); return m ? { n: +m[1], p: +m[2] } : null },
    // P(X ≥ 1) = 1 − (1 − p)ⁿ
    expect: ({ n, p }) => ({ correct: `$${r4(1 - Math.pow(1 - p, n))}$`, complement: `$${r4(Math.pow(1 - p, n))}$`, exactlyOne: `$${r4(n * p * Math.pow(1 - p, n - 1))}$`, expectation: `$${r4(n * p)}$` }),
  },
  'sum-of-coefficients': {
    parse: (s) => { const m = s.match(/求 \$\((\d+)x \+ (\d+)\)\^\{(\d+)\}\$ 展開式中/); return m ? { a: +m[1], b: +m[2], n: +m[3] } : null },
    // put x = 1
    expect: ({ a, b, n }) => ({ correct: `$${Math.pow(a + b, n)}$`, termwise: `$${Math.pow(a, n) + Math.pow(b, n)}$`, twoToN: `$${Math.pow(2, n)}$`, product: `$${n * (a + b)}$` }),
  },
  'standard-error-of-mean': {
    parse: (s) => { const m = s.match(/總體的標準差為 \$(\d+)\$。現從中隨機抽取一個大小為 \$(\d+)\$ 的樣本/); return m ? { sigma: +m[1], n: +m[2] } : null },
    // σ / √n
    expect: ({ sigma, n }) => ({ correct: `$${r4(sigma / Math.sqrt(n))}$`, populationSd: `$${sigma}$`, overN: `$${r4(sigma / n)}$`, times: `$${r4(sigma * Math.sqrt(n))}$` }),
  },
}

// ── M1-04 (2026-10-08, founders' reply 33a): recompute, independently of repairs/m1-04.mts ──
// Two papers compared by standard score. Options carry words, so the English option at
// the same index is checked too.
const paperZ = (mean: number, sd: number, mark: number) => (mark - mean) / sd
const M1_04: typeof M1_02 = {
  'compare-two-papers-by-z': {
    parse: (s) => {
      const nums = s.match(/甲卷平均分 \$(\d+)\$、標準差 \$(\d+)\$，他得 \$(\d+)\$ 分；乙卷平均分 \$(\d+)\$、標準差 \$(\d+)\$，他得 \$(\d+)\$ 分/)
      if (!nums) return null
      const [muA, sA, xA, muB, sB, xB] = nums.slice(1).map(Number)
      return { muA, sA, xA, muB, sB, xB }
    },
    expect: ({ muA, sA, xA, muB, sB, xB }) => {
      const a = paperZ(muA, sA, xA), b = paperZ(muB, sB, xB)
      const better = a > b ? '甲' : '乙', worse = a > b ? '乙' : '甲'
      return {
        correct: `${better}卷，因為其標準分數較高（甲 $z = ${r4(a)}$，乙 $z = ${r4(b)}$）`,
        otherPaper: `${worse}卷，因為其標準分數較高`,
        rawMark: `${xA > xB ? '甲' : '乙'}卷，因為原始分數較高`,
        bothAbove: '兩卷表現相同，因為兩者都高於各自的平均分',
      }
    },
  },
}
const M1_04_EN: Record<string, (p: Record<string, number>) => Record<string, string>> = {
  'compare-two-papers-by-z': ({ muA, sA, xA, muB, sB, xB }) => {
    const a = paperZ(muA, sA, xA), b = paperZ(muB, sB, xB)
    return {
      correct: `Paper ${a > b ? 'A' : 'B'}, because its standard score is higher (A: $z = ${r4(a)}$, B: $z = ${r4(b)}$)`,
      otherPaper: `Paper ${a > b ? 'B' : 'A'}, because its standard score is higher`,
      rawMark: `Paper ${xA > xB ? 'A' : 'B'}, because the raw mark is higher`,
      bothAbove: 'Equally well, since both marks are above their respective means',
    }
  },
}

// ── M2-01 and PHY-01 (2026-10-08, founders' reply 34a): recompute, independently of
// repairs/m2-01.mts and repairs/phy-01.mts. Each template gives the Chinese and the
// English option for every kind; both are checked at the stored index.
type Pair = Record<string, [string, string]>
type Tpl = { parse: (stem: string) => Record<string, number> | null; expect: (p: Record<string, number>) => Pair }
const both = (zh: string, en = zh): [string, string] => [zh, en]
const reduced = (p: number, q: number) => {
  let [a, b] = [Math.abs(p), Math.abs(q)]
  while (b) [a, b] = [b, a % b]
  return q / a === 1 ? `$${p / a}$` : `$\\dfrac{${p / a}}{${q / a}}$`
}
const kEq = (v: number) => `$k = ${r4(v)}$`
const mat = (e: number[]) => `$\\begin{pmatrix} ${e[0]} & ${e[1]} \\\\ ${e[2]} & ${e[3]} \\end{pmatrix}$`
const M2_01: Record<string, Tpl> = {
  'singular-2x2-find-k': {
    parse: (s) => { const m = s.match(/begin\{pmatrix\} (-?\d+) & (-?\d+) \\\\ (-?\d+) & k \\end\{pmatrix\}\$。求 \$k\$ 的值，使 \$A\$ 【沒有】逆矩陣/); return m ? { a: +m[1], b: +m[2], c: +m[3] } : null },
    // det = ak − bc = 0
    expect: ({ a, b, c }) => ({ correct: both(kEq(b * c / a)), signFlip: both(kEq(-b * c / a)), swapped: both(kEq(a * b / c)), combined: both(kEq(a * c - b)) }),
  },
  'scalar-multiple-2x2': {
    parse: (s) => { const m = s.match(/begin\{pmatrix\} (-?\d+) & (-?\d+) \\\\ (-?\d+) & (-?\d+) \\end\{pmatrix\}\$。求 \$(\d+)A\$/); return m ? { n: +m[5], p: +m[1], q: +m[2], r: +m[3], s: +m[4] } : null },
    expect: ({ n, p, q, r, s }) => ({
      correct: both(mat([p, q, r, s].map((x) => n * x))),
      diagonalOnly: both(mat([n * p, q, r, n * s])),
      added: both(mat([p, q, r, s].map((x) => x + n))),
      transposed: both(mat([n * p, n * r, n * q, n * s])),
    }),
  },
  'polynomial-limit-substitution': {
    parse: (s) => {
      const m = s.match(/\\lim_\{x \\to (-?\d+)\} \((\d+)x\^2 ([+−]) (\d+)x ([+−]) (\d+)\)/)
      return m ? { x0: +m[1], A: +m[2], B: (m[3] === '+' ? 1 : -1) * +m[4], C: (m[5] === '+' ? 1 : -1) * +m[6] } : null
    },
    expect: ({ x0, A, B, C }) => {
      const at = (x: number) => (A * x + B) * x + C // Horner form
      return { correct: both(`$${r4(at(x0))}$`), noConstant: both(`$${r4(at(x0) - C)}$`), derivative: both(`$${r4(2 * A * x0 + B)}$`), atOne: both(`$${r4(A + B + C)}$`) }
    },
  },
  'homogeneous-system-find-k': {
    parse: (s) => { const m = s.match(/\\begin\{cases\} (\d+)x \+ (\d+)y = 0 \\\\ (\d+)x \+ ky = 0/); return m ? { a: +m[1], b: +m[2], c: +m[3] } : null },
    expect: ({ a, b, c }) => ({ correct: both(kEq(b * c / a)), signFlip: both(kEq(-b * c / a)), crossPaired: both(kEq(a * c / b)), anyK: both('任何 $k$ 值皆可', 'Any value of $k$ will do') }),
  },
  'perpendicular-vectors-find-t': {
    parse: (s) => { const m = s.match(/\\vec\{a\} = \((-?\d+), (-?\d+)\)\$、\$\\vec\{b\} = \((-?\d+), t\)\$。求 \$t\$ 的值，使 \$\\vec\{a\}\$ 與 \$\\vec\{b\}\$ 互相垂直/); return m ? { a1: +m[1], a2: +m[2], b1: +m[3] } : null },
    // a1·b1 + a2·t = 0
    expect: ({ a1, a2, b1 }) => {
      const tEq = (v: number) => `$t = ${r4(v)}$`
      return { correct: both(tEq(-a1 * b1 / a2)), signFlip: both(tEq(a1 * b1 / a2)), parallel: both(tEq(b1 * a2 / a1)), ratio: both(tEq(a2 / b1)) }
    },
  },
  'rational-limit-at-infinity': {
    parse: (s) => { const m = s.match(/\\lim_\{x \\to \\infty\} \\dfrac\{(\d*)x\^(\d+) \+ 1\}\{(\d*)x\^(\d+) \+ x\}/); return m ? { p: +(m[1] || 1), m: +m[2], q: +(m[3] || 1), n: +m[4] } : null },
    expect: ({ p, m, q, n }) => {
      const out: Pair = { zero: both('$0$'), infinite: both('不存在（趨向無限大）', 'Does not exist (tends to infinity)'), ratio: both(reduced(p, q)), inverse: both(reduced(q, p)) }
      const right = m < n ? 'zero' : m > n ? 'infinite' : 'ratio'
      out.correct = out[right]
      delete out[right]
      return out
    },
  },
  'sin-px-over-qx': {
    parse: (s) => { const m = s.match(/\\lim_\{x \\to 0\} \\dfrac\{\\sin (\d+)x\}\{(\d+)x\}/); return m ? { p: +m[1], q: +m[2] } : null },
    expect: ({ p, q }) => ({ correct: both(reduced(p, q)), inverse: both(reduced(q, p)), one: both('$1$'), zero: both('$0$') }),
  },
}
const withUnit = (u: string) => (v: number) => both(`$${r4(v)}\\,\\text{${u}}$`)
const amp = withUnit('A'), watt = withUnit('W'), volt = withUnit('V')
const PHY_01: Record<string, Tpl> = {
  'ohm-current-from-v-and-r': {
    parse: (s) => { const m = s.match(/^一個電阻為 \$([\d.]+)\\,\\Omega\$ 的電器接上 \$([\d.]+)\\,\\text\{V\}\$ 的電源/); return m ? { R: +m[1], V: +m[2] } : null },
    expect: ({ R, V }) => ({ correct: amp(V / R), product: amp(V * R), inverted: amp(R / V), difference: amp(V - R) }),
  },
  'current-ratio-when-voltage-changes': {
    parse: (s) => { const m = s.match(/電壓由 \$([\d.]+)\\,\\text\{V\}\$ 改為 \$([\d.]+)\\,\\text\{V\}\$，電阻值不變/); return m ? { V1: +m[1], V2: +m[2] } : null },
    expect: ({ V1, V2 }) => {
      const x = (v: number) => both(`$${r4(v)}$ 倍`, `$${r4(v)}$ times`)
      return { correct: x(V2 / V1), inverse: x(V1 / V2), unchanged: x(1), difference: x(Math.abs(V1 - V2)) }
    },
  },
  'electric-power-from-v-and-i': {
    parse: (s) => { const m = s.match(/^某電器在 \$([\d.]+)\\,\\text\{V\}\$ 下工作，通過的電流為 \$([\d.]+)\\,\\text\{A\}\$/); return m ? { V: +m[1], I: +m[2] } : null },
    expect: ({ V, I }) => ({ correct: watt(V * I), resistance: watt(V / I), sum: watt(V + I), perMinute: watt(60 * V * I) }),
  },
  'fuse-rating-choice': {
    parse: (s) => { const m = s.match(/^一件 \$([\d.]+)\\,\\text\{W\}\$ 的電器接在 \$([\d.]+)\\,\\text\{V\}\$ 的家庭電源上/); return m ? { P: +m[1], V: +m[2] } : null },
    // The available ratings are the same in every question of this template.
    expect: ({ P, V }) => {
      const ratings = [3, 5, 10, 13], I = P / V
      const ok = ratings.findIndex((r) => r > I)
      return { correct: amp(ratings[ok]), tooLow: amp(ratings[ok - 1] < I ? ratings[ok - 1] : ratings[ok - 2]), tooHigh: amp(ratings[ok + 1]), powerOverTen: amp(P / 10) }
    },
  },
  'electricity-cost-kwh': {
    parse: (s) => { const m = s.match(/^一件 \$([\d.]+)\\,\\text\{W\}\$ 的電器連續使用 \$([\d.]+)\\,\\text\{h\}\$。若每度電.*收費 \$([\d.]+)\$ 元/); return m ? { P: +m[1], t: +m[2], c: +m[3] } : null },
    expect: ({ P, t, c }) => {
      const x = (v: number) => both(`$${r4(v)}$ 元`, `$${r4(v)}$ dollars`)
      return { correct: x((P * t * c) / 1000), wattsAsKw: x(P * t * c), energyOnly: x((P * t) / 1000), noTime: x((P * c) / 1000) }
    },
  },
  // PHY-02 (founders' reply 39a): options use \Omega after the notation fix.
  'series-total-resistance': {
    parse: (s) => { const m = s.match(/^三個電阻 \$([\d.]+)\\,\\Omega\$、\$([\d.]+)\\,\\Omega\$ 及 \$([\d.]+)\\,\\Omega\$ 串聯/); return m ? { R1: +m[1], R2: +m[2], R3: +m[3] } : null },
    expect: ({ R1, R2, R3 }) => {
      const o = (v: number) => both(`$${r4(v)}\\,\\Omega$`)
      return { correct: o(R1 + R2 + R3), parallel: o(1 / (1 / R1 + 1 / R2 + 1 / R3)), twoOnly: o(R1 + R2), product: o(R1 * R2 * R3) }
    },
  },
  'series-voltage-divider': {
    parse: (s) => { const m = s.match(/^\$([\d.]+)\\,\\text\{V\}\$ 電源接上串聯的 \$([\d.]+)\\,\\Omega\$ 與 \$([\d.]+)\\,\\Omega\$。求 \$([\d.]+)\\,\\Omega\$ 兩端的電壓/); return m && m[4] === m[2] ? { V: +m[1], R1: +m[2], R2: +m[3] } : null },
    expect: ({ V, R1, R2 }) => ({ correct: volt((V * R1) / (R1 + R2)), otherResistor: volt((V * R2) / (R1 + R2)), half: volt(V / 2), parallelResistance: volt((V * R1 * R2) / ((R1 + R2) * (R1 + R2))) }),
  },
}

function checkBatch(name: string, subject: string, size: number, tpls: Record<string, Tpl>) {
  const b = batches.find((x) => x.batch === name)
  assert.ok(b, `batch ${name} exists`)
  assert.equal(b!.computed, true)
  assert.equal(b!.repairs.length, size)
  const bank = new Map(I.getSubjectQuestionsRaw(subject).map((q) => [q.id, q as unknown as { content: string; options: string[]; optionsEn?: string[]; correctIndex: number }]))
  for (const r of b!.repairs) {
    const q = bank.get(r.id)!
    const t = tpls[r.template]
    assert.ok(t, `${r.id}: template ${r.template} has no independent recomputation`)
    const params = t.parse(q.content)
    assert.ok(params, `${r.id}: stem not recognised by ${r.template}`)
    assert.deepEqual(r.params, params, `${r.id}: params in the batch differ from the stem`)
    const exp = t.expect(params!)
    assert.equal(new Set(Object.values(exp).map(([zh]) => zh)).size, 4, `${r.id}: four different options expected`)
    assert.equal(r.optionNotes.length, q.options.length)
    for (const n of r.optionNotes) {
      assert.ok(exp[n.kind], `${r.id}: unknown kind ${n.kind}`)
      assert.equal(q.options[n.optionId], exp[n.kind][0], `${r.id}: note "${n.kind}" is on option ${n.optionId} = ${q.options[n.optionId]}`)
      assert.equal((q.optionsEn ?? q.options)[n.optionId], exp[n.kind][1], `${r.id}: English option ${n.optionId} is not ${n.kind}`)
    }
    const correct = r.optionNotes.filter((n) => n.kind === 'correct')
    assert.equal(correct.length, 1)
    assert.equal(correct[0].optionId, q.correctIndex, `${r.id}: correctIndex`)
    assert.equal(new Set(r.optionNotes.map((n) => n.kind)).size, 4, `${r.id}: four different kinds`)
  }
}

/** Batches that may use the machine gate: marked computed, every template recomputed in this file. */
function recomputedHere(): Set<string> {
  const known = new Set([...Object.keys(expectM1), ...Object.keys(M1_02), ...Object.keys(M1_03), ...Object.keys(M1_04), ...Object.keys(M2_01), ...Object.keys(PHY_01)])
  return new Set(batches.filter((b) => b.computed === true && b.repairs.every((r) => known.has(r.template))).map((b) => b.batch))
}

test('M1-02: parameters read from the stem, every option recomputed, every note on its own option', () => {
  const b = batches.find((x) => x.batch === 'M1-02')
  assert.ok(b, 'batch M1-02 exists')
  assert.equal(b!.computed, true)
  assert.equal(b!.repairs.length, 38)
  const bank = new Map(I.getSubjectQuestionsRaw('m1').map((q) => [q.id, q as unknown as { content: string; options: string[]; correctIndex: number }]))
  for (const r of b!.repairs) {
    const q = bank.get(r.id)!
    const t = M1_02[r.template]
    assert.ok(t, `${r.id}: template ${r.template} has no independent recomputation`)
    const params = t.parse(q.content)
    assert.ok(params, `${r.id}: stem not recognised by ${r.template}`)
    assert.deepEqual(r.params, params, `${r.id}: params in the batch differ from the stem`)
    const exp = t.expect(params!)
    assert.equal(r.optionNotes.length, q.options.length)
    for (const n of r.optionNotes) {
      assert.equal(q.options[n.optionId], exp[n.kind], `${r.id}: note "${n.kind}" is on option ${n.optionId} = ${q.options[n.optionId]}`)
    }
    const correct = r.optionNotes.filter((n) => n.kind === 'correct')
    assert.equal(correct.length, 1)
    assert.equal(correct[0].optionId, q.correctIndex, `${r.id}: correctIndex`)
    assert.equal(new Set(r.optionNotes.map((n) => n.kind)).size, 4, `${r.id}: four different kinds`)
    assert.doesNotMatch(q.options.join(' '), /\^\{1\}(?!\d)/, `${r.id}: ^{1} left in an option`)
  }
})

test('M1-03: parameters read from the stem, every option recomputed, every note on its own option', () => {
  const b = batches.find((x) => x.batch === 'M1-03')
  assert.ok(b, 'batch M1-03 exists')
  assert.equal(b!.computed, true)
  assert.equal(b!.repairs.length, 42)
  // 0063–0068 are held back: in 0067 the option marked correct is wrong (equal standard scores).
  assert.ok(!b!.repairs.some((r) => /^m1_rep_006[3-8]$/.test(r.id)), 'the standard-score comparison template is not in this batch')
  const bank = new Map(I.getSubjectQuestionsRaw('m1').map((q) => [q.id, q as unknown as { content: string; options: string[]; correctIndex: number }]))
  for (const r of b!.repairs) {
    const q = bank.get(r.id)!
    const t = M1_03[r.template]
    assert.ok(t, `${r.id}: template ${r.template} has no independent recomputation`)
    const params = t.parse(q.content)
    assert.ok(params, `${r.id}: stem not recognised by ${r.template}`)
    assert.deepEqual(r.params, params, `${r.id}: params in the batch differ from the stem`)
    const exp = t.expect(params!)
    assert.equal(r.optionNotes.length, q.options.length)
    for (const n of r.optionNotes) {
      assert.equal(q.options[n.optionId], exp[n.kind], `${r.id}: note "${n.kind}" is on option ${n.optionId} = ${q.options[n.optionId]}`)
    }
    const correct = r.optionNotes.filter((n) => n.kind === 'correct')
    assert.equal(correct.length, 1)
    assert.equal(correct[0].optionId, q.correctIndex, `${r.id}: correctIndex`)
    assert.equal(new Set(r.optionNotes.map((n) => n.kind)).size, 4, `${r.id}: four different kinds`)
  }
})

test('M1-04: the standard-score comparison, 0067 left out and still withdrawn', () => {
  const b = batches.find((x) => x.batch === 'M1-04')
  assert.ok(b, 'batch M1-04 exists')
  assert.equal(b!.computed, true)
  assert.deepEqual(b!.repairs.map((r) => r.id), ['m1_rep_0063', 'm1_rep_0064', 'm1_rep_0065', 'm1_rep_0066', 'm1_rep_0068'])
  // 33a: in 0067 both standard scores are 2, so no option is correct; it stays withdrawn.
  assert.ok(withdrawn.m1?.m1_rep_0067, 'm1_rep_0067 is still withdrawn')
  assert.equal(log.m1_rep_0067?.stage, 'withdrawn')
  const bank = new Map(I.getSubjectQuestionsRaw('m1').map((q) => [q.id, q as unknown as { content: string; options: string[]; optionsEn: string[]; correctIndex: number }]))
  const p67 = M1_04['compare-two-papers-by-z'].parse(bank.get('m1_rep_0067')!.content)!
  assert.equal(paperZ(p67.muA, p67.sA, p67.xA), paperZ(p67.muB, p67.sB, p67.xB), '0067 still has equal standard scores')
  for (const r of b!.repairs) {
    const q = bank.get(r.id)!
    const t = M1_04[r.template]
    assert.ok(t, `${r.id}: template ${r.template} has no independent recomputation`)
    const params = t.parse(q.content)
    assert.ok(params, `${r.id}: stem not recognised by ${r.template}`)
    assert.deepEqual(r.params, params, `${r.id}: params in the batch differ from the stem`)
    const exp = t.expect(params!)
    const expEn = M1_04_EN[r.template](params!)
    assert.equal(r.optionNotes.length, q.options.length)
    for (const n of r.optionNotes) {
      assert.equal(q.options[n.optionId], exp[n.kind], `${r.id}: note "${n.kind}" is on option ${n.optionId} = ${q.options[n.optionId]}`)
      assert.equal(q.optionsEn[n.optionId], expEn[n.kind], `${r.id}: English option ${n.optionId} is not ${n.kind}`)
    }
    const correct = r.optionNotes.filter((n) => n.kind === 'correct')
    assert.equal(correct.length, 1)
    assert.equal(correct[0].optionId, q.correctIndex, `${r.id}: correctIndex`)
    assert.equal(new Set(r.optionNotes.map((n) => n.kind)).size, 4, `${r.id}: four different kinds`)
  }
})

test('M2-01: every withdrawn M2 template, options in both languages recomputed', () => {
  checkBatch('M2-01', 'm2', 36, M2_01)
})

test('PHY-01: six physics templates; series resistance held back (unrenderable Omega)', () => {
  checkBatch('PHY-01', 'physics', 35, PHY_01)
  // 0013–0018 write the unit as \text{\Omega}, which KaTeX cannot parse; they wait for the founders (2026-10-08).
  const b = batches.find((x) => x.batch === 'PHY-01')!
  assert.ok(!b.repairs.some((r) => /^phy_rep_001[3-8]$/.test(r.id)), 'the series-resistance template is not in this batch')
})

test('PHY-02: series total resistance, after the Omega notation fix', () => {
  checkBatch('PHY-02', 'physics', 6, PHY_01)
})

test('every machine-gate restore is from a computed batch recomputed in this file', () => {
  const ok = recomputedHere()
  assert.ok(['M1-01', 'M1-02', 'M1-03', 'M1-04', 'M2-01', 'PHY-01', 'PHY-02'].every((x) => ok.has(x)), 'every computed batch so far is recomputed here')
  for (const [id, r] of Object.entries(log)) if (r.restoreBasis === 'machine-gate') assert.ok(ok.has(r.batch ?? ''), `${id}: ${r.batch}`)
})

test('/transparency shows the repair progress from the log, not a hand-written number', () => {
  assert.match(read('data/questions/repair-stats.ts'), /from '\.\/rationale-repairs\.json'/)
  assert.match(read('app/transparency/page.tsx'), /<TransparencyClient stats=\{repairStats\(\)\} content=\{CONTENT_STATS\} withdrawals=\{recentWithdrawals\(\)\} \/>/)
  const page = read('app/transparency/TransparencyClient.tsx')
  for (const k of ['stats.found', 'stats.rewritten', 'stats.restored']) assert.ok(page.includes(`n(${k})`), k)
})
