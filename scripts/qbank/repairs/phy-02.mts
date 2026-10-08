#!/usr/bin/env -S npx tsx
// ============================================================================
// repairs/phy-02.mts — rationale repair, batch PHY-02 (6 questions, 1 template)
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repairs/phy-02.mts          → writes the batch file
//   npx tsx scripts/qbank/repair-rationale.mts --batch PHY-02  → applies it
//   npx tsx scripts/qbank/restore-computed.mts --batch PHY-02  → back into practice
//
// Founders' reply 39a (2026-10-08): phy_rep_0013–0018 (total resistance in series),
// held back from PHY-01 because their options wrote the unit as \text{\Omega}. That
// notation was corrected in the bank first (lib/__tests__/math-renders.test.mts);
// this batch then repairs the explanations the same way as PHY-01.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH = 'PHY-02'
const IDS = ['phy_rep_0013', 'phy_rep_0014', 'phy_rep_0015', 'phy_rep_0016', 'phy_rep_0017', 'phy_rep_0018']

/** Up to four decimals, no trailing zeros. */
const num = (v: number) => String(Math.round(v * 1e4) / 1e4)
const eq = (v: number) => (Math.round(v * 1e4) / 1e4 === v ? '=' : '\\approx')
const ohm = (v: number) => `$${num(v)}\\,\\Omega$`

function series(a: number, b: number, c: number) {
  const sum = a + b + c, par = 1 / (1 / a + 1 / b + 1 / c), two = a + b, prod = a * b * c
  const expected: Record<string, string> = { correct: ohm(sum), parallel: ohm(par), twoOnly: ohm(two), product: ohm(prod) }
  const parLine = `\\dfrac{1}{R} = \\dfrac{1}{${a}} + \\dfrac{1}{${b}} + \\dfrac{1}{${c}}`
  return {
    template: 'series-total-resistance',
    params: { R1: a, R2: b, R3: c },
    expected,
    notes: {
      correct: { zh: `正確。串聯時電阻直接相加：$${a} + ${b} + ${c} = ${num(sum)}\\,\\Omega$。`, en: `Correct. In series the resistances simply add: $${a} + ${b} + ${c} = ${num(sum)}\\,\\Omega$.` },
      parallel: { zh: `這是並聯公式 $${parLine}$ 的結果（$R ${eq(par)} ${num(par)}\\,\\Omega$），但三個電阻是串聯的。串聯的總電阻必定大於其中任何一個。`, en: `This is the parallel formula $${parLine}$ (giving $R ${eq(par)} ${num(par)}\\,\\Omega$), but the three resistors are in series. A series total is always larger than any one of them.` },
      twoOnly: { zh: `$${a} + ${b} = ${num(two)}$ 漏了第三個電阻 $${c}\\,\\Omega$。`, en: `$${a} + ${b} = ${num(two)}$ leaves out the third resistor, $${c}\\,\\Omega$.` },
      product: { zh: `$${a} \\times ${b} \\times ${c} = ${num(prod)}$ 把相加誤作相乘。`, en: `$${a} \\times ${b} \\times ${c} = ${num(prod)}$ multiplies the resistances instead of adding them.` },
    } as Record<string, { zh: string; en: string }>,
    explanation: {
      zh: `串聯時電流只有一條路徑，各電阻逐個相加：$R = ${a} + ${b} + ${c} = ${num(sum)}\\,\\Omega$。分辨方法：串聯的總電阻必定大於其中任何一個；並聯的總電阻必定小於最小的一個。`,
      en: `In series there is only one path for the current, so the resistances add: $R = ${a} + ${b} + ${c} = ${num(sum)}\\,\\Omega$. A quick check: a series total is always larger than any one resistor; a parallel total is always smaller than the smallest.`,
    },
  }
}

const STEM = /^三個電阻 \$([\d.]+)\\,\\Omega\$、\$([\d.]+)\\,\\Omega\$ 及 \$([\d.]+)\\,\\Omega\$ 串聯接在同一電路中。求總電阻。/

const mod = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (mod.default?.getSubjectQuestionsRaw ? mod.default : mod) as {
  getSubjectQuestionsRaw: (s: string) => Array<{ id: string; content: string; options: string[]; optionsEn?: string[]; correctIndex: number }>
}
const bank = new Map(idx.getSubjectQuestionsRaw('physics').map((q) => [q.id, q]))

const out = []
for (const id of IDS) {
  const q = bank.get(id)
  if (!q) throw new Error(`${id} not in the raw physics bank`)
  const m = q.content.match(STEM)
  if (!m) throw new Error(`${id}: stem matches no template: ${q.content}`)
  const t = series(+m[1], +m[2], +m[3])
  if (new Set(Object.values(t.expected)).size !== 4) throw new Error(`${id}: two kinds give the same option`)
  const notes = q.options.map((opt, optionId) => {
    const kinds = Object.entries(t.expected).filter(([, s]) => s === opt).map(([k]) => k)
    if (kinds.length !== 1) throw new Error(`${id} option ${optionId} "${opt}" matched ${kinds.length} kinds`)
    if ((q.optionsEn ?? q.options)[optionId] !== opt) throw new Error(`${id} option ${optionId}: English option differs`)
    return { optionId, kind: kinds[0], ...t.notes[kinds[0]] }
  })
  const correct = notes.filter((n) => n.kind === 'correct').map((n) => n.optionId)
  if (correct.length !== 1 || correct[0] !== q.correctIndex) throw new Error(`${id}: recomputed correct option ${correct} ≠ stored ${q.correctIndex}`)
  out.push({ id, template: t.template, params: t.params, options: q.options, optionsEn: q.optionsEn ?? q.options, explanation: t.explanation.zh, explanationEn: t.explanation.en, optionNotes: notes })
}

mkdirSync(join(ROOT, 'data/questions/rationale-repairs'), { recursive: true })
writeFileSync(
  join(ROOT, `data/questions/rationale-repairs/${BATCH}.json`),
  JSON.stringify({ batch: BATCH, subject: 'physics', computed: true, generatedBy: 'scripts/qbank/repairs/phy-02.mts', repairs: out }, null, 2) + '\n',
)
console.log(`✓ ${BATCH}: ${out.length} repairs written to data/questions/rationale-repairs/${BATCH}.json`)
