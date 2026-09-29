#!/usr/bin/env -S npx tsx
// ============================================================================
// repairs/m1-01.mts — rationale repair, batch M1-01 (m1_rep_0001 … m1_rep_0010)
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repairs/m1-01.mts          → writes the batch file
//   npx tsx scripts/qbank/repair-rationale.mts --batch M1-01   → applies it
//
// Both templates in this batch are parametric, so the repair is computed, not
// hand-written:
//   product rule   d/dx( x^a sin bx )   ids 0001–0006
//   quotient rule  d/dx( kx / (x + c) ) ids 0007–0010
//
// For each question the parameters are read from the stem, the correct answer and
// the three known distractors are recomputed, and every STORED option is matched to
// exactly one of them. That match is what gives each note its optionId. If any
// option matches none or more than one, the script stops and writes nothing: the
// stored question is not what this template says it is, and a person must look.
//
// Content fixes made on the way (recorded in docs/rationale-repairs.md):
//   · "2x^{1}" is printed as "2x".
//   · The quotient-rule distractor k was described as "treating the expression as
//     linear". It is u'/v' — differentiating numerator and denominator separately.
//   · The prose explanation keeps only the derivation, in written Chinese; what each
//     wrong option did now sits on that option as a note.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH = 'M1-01'
const IDS = Array.from({ length: 10 }, (_, i) => `m1_rep_${String(i + 1).padStart(4, '0')}`)

type Kind = 'correct' | 'multiply' | 'missingFactor' | 'swapped' | 'reversed' | 'numeratorOnly' | 'ratio'
interface Note { optionId: number; kind: Kind; zh: string; en: string }
export interface Repair {
  id: string
  template: 'product-x^a-sin-bx' | 'quotient-kx-over-x+c'
  params: Record<string, number>
  options: string[]
  optionsEn: string[]
  explanation: string
  explanationEn: string
  optionNotes: Note[]
}

/** "2x^{1}" → "2x". Only the exponent 1, never "x^{10}". */
const tidy = (s: string) => s.replace(/x\^\{1\}(?!\d)/g, 'x')

const m = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (m.default?.getSubjectQuestionsRaw ? m.default : m) as {
  getSubjectQuestionsRaw: (s: string) => Array<Record<string, unknown> & { id: string; content: string; options: string[]; optionsEn?: string[]; correctIndex: number }>
}
const bank = new Map(idx.getSubjectQuestionsRaw('m1').map((q) => [q.id, q]))

function product(a: number, b: number) {
  // Stored option strings, in the format the original generator used (so they match).
  const du = `${a}x^{${a - 1}}` // u' for u = x^a
  const expected: Record<Kind, string> = {
    correct: `$${du} \\sin ${b}x + ${b}x^{${a}} \\cos ${b}x$`,
    multiply: `$${a * b}x^{${a - 1}} \\cos ${b}x$`,
    missingFactor: `$${du} \\sin ${b}x + x^{${a}} \\cos ${b}x$`,
    swapped: `$${du} \\cos ${b}x + ${b}x^{${a}} \\sin ${b}x$`,
  } as Record<Kind, string>
  const U = tidy(du)
  const ans = tidy(expected.correct)
  const notes: Record<string, { zh: string; en: string }> = {
    correct: {
      zh: `正確。$u'v = ${U} \\sin ${b}x$，$uv' = ${b}x^{${a}} \\cos ${b}x$，兩項相加即得。`,
      en: `Correct. $u'v = ${U} \\sin ${b}x$ and $uv' = ${b}x^{${a}} \\cos ${b}x$; add the two terms.`,
    },
    multiply: {
      zh: `把兩個導數直接相乘：$${U} \\times ${b}\\cos ${b}x = ${tidy(`${a * b}x^{${a - 1}}`)} \\cos ${b}x$。導數沒有這種乘法規則，這是初學積法則最常見的錯誤。`,
      en: `This multiplies the two derivatives: $${U} \\times ${b}\\cos ${b}x = ${tidy(`${a * b}x^{${a - 1}}`)} \\cos ${b}x$. Derivatives have no such rule; it is the most common first mistake with products.`,
    },
    missingFactor: {
      zh: `$uv'$ 一項漏了鏈式法則帶出的因子 $${b}$：$\\sin ${b}x$ 的導數是 $${b}\\cos ${b}x$，不是 $\\cos ${b}x$。`,
      en: `The $uv'$ term is missing the factor $${b}$ from the chain rule: the derivative of $\\sin ${b}x$ is $${b}\\cos ${b}x$, not $\\cos ${b}x$.`,
    },
    swapped: {
      zh: `$\\sin$ 與 $\\cos$ 放錯了位置。被求導的是 $v = \\sin ${b}x$，所以 $\\cos ${b}x$ 應出現在 $uv'$ 一項；$u'v$ 一項保留原來的 $\\sin ${b}x$。`,
      en: `$\\sin$ and $\\cos$ are in the wrong places. It is $v = \\sin ${b}x$ that is differentiated, so $\\cos ${b}x$ belongs in the $uv'$ term, while the $u'v$ term keeps $\\sin ${b}x$.`,
    },
  }
  return {
    expected,
    notes,
    explanation: `兩個函數相乘，要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{${a}}$、$v = \\sin ${b}x$，則 $u' = ${U}$；$\\sin ${b}x$ 對 $x$ 求導時，鏈式法則帶出因子 $${b}$，所以 $v' = ${b}\\cos ${b}x$。代入得 ${ans}。`,
    explanationEn: `A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{${a}}$ and $v = \\sin ${b}x$, so $u' = ${U}$; differentiating $\\sin ${b}x$, the chain rule brings out the factor $${b}$, so $v' = ${b}\\cos ${b}x$. Substituting gives ${ans}.`,
  }
}

function quotient(k: number, c: number) {
  const expected: Record<string, string> = {
    correct: `$\\dfrac{${k * c}}{(x + ${c})^{2}}$`,
    reversed: `$\\dfrac{-${k * c}}{(x + ${c})^{2}}$`,
    numeratorOnly: `$\\dfrac{${k}}{(x + ${c})^{2}}$`,
    ratio: `$${k}$`,
  }
  const notes: Record<string, { zh: string; en: string }> = {
    correct: {
      zh: `正確。分子 $u'v - uv' = ${k}(x + ${c}) - ${k}x = ${k * c}$，分母為 $(x + ${c})^{2}$。`,
      en: `Correct. The numerator is $u'v - uv' = ${k}(x + ${c}) - ${k}x = ${k * c}$ and the denominator is $(x + ${c})^{2}$.`,
    },
    reversed: {
      zh: `分子寫成 $uv' - u'v$，減法次序調轉了，所以答案的正負號相反。商法則的分子必須是 $u'v$ 在前。`,
      en: `The numerator was written as $uv' - u'v$, the subtraction the wrong way round, so the sign is flipped. In the quotient rule $u'v$ always comes first.`,
    },
    numeratorOnly: {
      zh: `分子只寫了 $u' = ${k}$，漏了 $u'v - uv'$ 的結構。`,
      en: `The numerator is just $u' = ${k}$; the $u'v - uv'$ structure is missing.`,
    },
    ratio: {
      zh: `分別對分子和分母求導再相除：$\\dfrac{u'}{v'} = \\dfrac{${k}}{1} = ${k}$。商的導數並不等於導數的商。`,
      en: `This differentiates the top and the bottom separately and divides: $\\dfrac{u'}{v'} = \\dfrac{${k}}{1} = ${k}$. The derivative of a quotient is not the quotient of the derivatives.`,
    },
  }
  return {
    expected,
    notes,
    explanation: `用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = ${k}x$、$v = x + ${c}$，則 $u' = ${k}$、$v' = 1$。分子 $= ${k}(x + ${c}) - ${k}x \\cdot 1 = ${k * c}$，故導數為 ${expected.correct}。分子的 $x$ 項恰好抵銷，是這類題目的特徵。`,
    explanationEn: `Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = ${k}x$ and $v = x + ${c}$, so $u' = ${k}$ and $v' = 1$. The numerator is $${k}(x + ${c}) - ${k}x \\cdot 1 = ${k * c}$, giving ${expected.correct}. The $x$ terms cancel exactly, which is characteristic of this type.`,
  }
}

const out: Repair[] = []
for (const id of IDS) {
  const q = bank.get(id)
  if (!q) throw new Error(`${id} not in the raw m1 bank`)
  const pm = q.content.match(/\\left\(x\^\{(\d+)\} \\sin (\d+)x\\right\)/)
  const qm = q.content.match(/\\dfrac\{(\d+)x\}\{x \+ (\d+)\}/)
  let t: ReturnType<typeof product> | ReturnType<typeof quotient>
  let template: Repair['template']
  let params: Record<string, number>
  if (pm) { params = { a: +pm[1], b: +pm[2] }; t = product(params.a, params.b); template = 'product-x^a-sin-bx' }
  else if (qm) { params = { k: +qm[1], c: +qm[2] }; t = quotient(params.k, params.c); template = 'quotient-kx-over-x+c' }
  else throw new Error(`${id}: stem does not match either template: ${q.content}`)

  // Match every stored option to exactly one recomputed answer.
  const notes: Note[] = q.options.map((opt, optionId) => {
    const kinds = Object.entries(t.expected).filter(([, s]) => s === opt).map(([k]) => k as Kind)
    if (kinds.length !== 1) throw new Error(`${id} option ${optionId} "${opt}" matched ${kinds.length} kinds`)
    const kind = kinds[0]
    return { optionId, kind, ...t.notes[kind] }
  })
  const correctIds = notes.filter((n) => n.kind === 'correct').map((n) => n.optionId)
  if (correctIds.length !== 1 || correctIds[0] !== q.correctIndex) {
    throw new Error(`${id}: recomputed correct option ${correctIds} ≠ stored correctIndex ${q.correctIndex}`)
  }
  if (q.optionsEn && q.optionsEn.some((o, i) => o !== q.options[i])) throw new Error(`${id}: optionsEn differs from options`)

  out.push({
    id,
    template,
    params,
    options: q.options.map(tidy),
    optionsEn: q.options.map(tidy),
    explanation: t.explanation,
    explanationEn: t.explanationEn,
    optionNotes: notes,
  })
}

mkdirSync(join(ROOT, 'data/questions/rationale-repairs'), { recursive: true })
const file = join(ROOT, `data/questions/rationale-repairs/${BATCH}.json`)
writeFileSync(file, JSON.stringify({ batch: BATCH, subject: 'm1', generatedBy: 'scripts/qbank/repairs/m1-01.mts', repairs: out }, null, 2) + '\n')
console.log(`✓ ${BATCH}: ${out.length} repairs written to data/questions/rationale-repairs/${BATCH}.json`)
