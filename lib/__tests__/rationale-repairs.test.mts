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
interface Rec { subject: string; batch: string | null; stage: Stage; updated: string; contentReview: null | Review }
const log = JSON.parse(read('data/questions/rationale-repairs.json')) as Record<string, Rec>
const withdrawn = JSON.parse(read('data/questions/withdrawn.json')) as Record<string, Record<string, unknown>>

interface Note { optionId: number; zh: string; en: string; kind: string }
interface Repair { id: string; template: string; params: Record<string, number>; options: string[]; explanation: string; explanationEn: string; optionNotes: Note[] }
const batches = readdirSync(join(ROOT, 'data/questions/rationale-repairs'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(read(`data/questions/rationale-repairs/${f}`)) as { batch: string; subject: string; repairs: Repair[] })

test('the repair log covers the 176 questions withdrawn on 2026-09-29, and only them', () => {
  assert.equal(Object.keys(log).length, 176)
  for (const [id, r] of Object.entries(log)) {
    assert.ok(ORDER.includes(r.stage), `${id}: unknown stage ${r.stage}`)
    assert.ok(I.getSubjectQuestionsRaw(r.subject).some((q) => q.id === id), `${id} not in the ${r.subject} bank`)
  }
})

/** Every rule a repair record must satisfy. Returns the problems found (empty = fine). */
function gateProblems(id: string, r: Rec, isWithdrawn: boolean): string[] {
  const out: string[] = []
  const bad = (m: string) => out.push(`${id}: ${m}`)
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
    if (cr?.decision !== 'pass') bad(`${r.stage} needs a passed review`)
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

test('/transparency shows the repair progress from the log, not a hand-written number', () => {
  const page = read('app/transparency/TransparencyClient.tsx')
  assert.match(page, /rationale-repairs\.json/)
  assert.match(page, /REPAIR_RESTORED/)
})
