#!/usr/bin/env -S npx tsx
// ============================================================================
// repairs/phy-01.mts — rationale repair, batch PHY-01 (35 questions, 6 templates)
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repairs/phy-01.mts          → writes the batch file
//   npx tsx scripts/qbank/repair-rationale.mts --batch PHY-01  → applies it
//   npx tsx scripts/qbank/restore-computed.mts --batch PHY-01  → back into practice
//
// Founders' reply 34a (2026-10-08): computed repairs for physics. Six of the seven
// withdrawn physics templates are here.
//
// Left out on purpose: phy_rep_0013–0018 (total resistance in series). Their options
// write the unit as \text{\Omega}, which KaTeX cannot parse, so students would see a
// red "\Omega" instead of Ω. Eleven live questions (phy_rep_0055–0060, 0076–0080)
// have the same fault. Changing option text is outside what a rationale repair may
// do, so the template waits for the founders' decision.
//
// Same method as M2-01: parameters from the stem, the four options recomputed (Chinese
// and English at the same index), one note per option. Old explanations named the
// last option by position, and one (phy_rep_0012) wrote "4 − 8 = 4".
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH = 'PHY-01'
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => `phy_rep_${String(a + i).padStart(4, '0')}`)
const IDS = [...range(1, 12), ...range(25, 36), ...range(43, 48), ...range(71, 75)]

type Text = { zh: string; en: string }
interface Note { optionId: number; kind: string; zh: string; en: string }
interface Built {
  template: string
  params: Record<string, number>
  expected: Record<string, string>
  expectedEn: Record<string, string>
  notes: Record<string, Text>
  explanation: Text
}

/** Up to four decimals, no trailing zeros. */
const num = (v: number) => String(Math.round(v * 1e4) / 1e4)
/** "=" when the four-decimal value is exact, "\approx" otherwise. */
const eq = (v: number) => (Math.round(v * 1e4) / 1e4 === v ? '=' : '\\approx')
const unit = (u: string) => (v: number) => `$${num(v)}\\,\\text{${u}}$`
const A = unit('A'), W = unit('W'), V = unit('V')
const same = (e: Record<string, string>) => e

function ohm(R: number, Vs: number): Built {
  const I = Vs / R
  const expected = { correct: A(I), product: A(Vs * R), inverted: A(R / Vs), difference: A(Vs - R) }
  return {
    template: 'ohm-current-from-v-and-r',
    params: { R, V: Vs },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。$I = \\dfrac{V}{R} = \\dfrac{${Vs}}{${R}} ${eq(I)} ${num(I)}\\,\\text{A}$。`, en: `Correct. $I = \\dfrac{V}{R} = \\dfrac{${Vs}}{${R}} ${eq(I)} ${num(I)}\\,\\text{A}$.` },
      product: { zh: `$${Vs} \\times ${R} = ${num(Vs * R)}$ 把電壓與電阻相乘。電阻越大，電流應該越小；相乘卻令電流隨電阻上升。`, en: `$${Vs} \\times ${R} = ${num(Vs * R)}$ multiplies voltage by resistance. A larger resistance should give a smaller current; multiplying makes it larger.` },
      inverted: { zh: `$\\dfrac{${R}}{${Vs}} ${eq(R / Vs)} ${num(R / Vs)}$ 把分子分母對調了，數值上是電流的倒數，並非電流。`, en: `$\\dfrac{${R}}{${Vs}} ${eq(R / Vs)} ${num(R / Vs)}$ has the fraction upside down; it is the reciprocal of the current, not the current.` },
      difference: { zh: `$${Vs} - ${R} = ${num(Vs - R)}$ 把電壓減去電阻；兩者單位不同，不能相減。`, en: `$${Vs} - ${R} = ${num(Vs - R)}$ subtracts resistance from voltage; quantities with different units cannot be subtracted.` },
    },
    explanation: {
      zh: `歐姆定律 $V = IR$，移項得 $I = \\dfrac{V}{R} = \\dfrac{${Vs}}{${R}} ${eq(I)} ${num(I)}\\,\\text{A}$。可用常理檢查：電壓不變時，電阻越大，電流越小。`,
      en: `Ohm's law $V = IR$ rearranges to $I = \\dfrac{V}{R} = \\dfrac{${Vs}}{${R}} ${eq(I)} ${num(I)}\\,\\text{A}$. A quick check: at a fixed voltage, a larger resistance gives a smaller current.`,
    },
  }
}

function ratio(V1: number, V2: number): Built {
  const r = V2 / V1
  const times = (v: number) => `$${num(v)}$ 倍`
  const timesEn = (v: number) => `$${num(v)}$ times`
  const d = Math.abs(V2 - V1)
  return {
    template: 'current-ratio-when-voltage-changes',
    params: { V1, V2 },
    expected: { correct: times(r), inverse: times(V1 / V2), unchanged: times(1), difference: times(d) },
    expectedEn: { correct: timesEn(r), inverse: timesEn(V1 / V2), unchanged: timesEn(1), difference: timesEn(d) },
    notes: {
      correct: { zh: `正確。電阻不變時，電流與電壓成正比：$\\dfrac{${V2}}{${V1}} ${eq(r)} ${num(r)}$。`, en: `Correct. With the resistance fixed, current is proportional to voltage: $\\dfrac{${V2}}{${V1}} ${eq(r)} ${num(r)}$.` },
      inverse: { zh: `$\\dfrac{${V1}}{${V2}} ${eq(V1 / V2)} ${num(V1 / V2)}$ 把關係看成反比。與電流成反比的是電阻，不是電壓。`, en: `$\\dfrac{${V1}}{${V2}} ${eq(V1 / V2)} ${num(V1 / V2)}$ treats the relation as inverse. Current is inversely proportional to resistance, not to voltage.` },
      unchanged: { zh: `電阻不變不代表電流不變；電壓改變，電流會按相同比例改變。`, en: `A fixed resistance does not mean a fixed current; when the voltage changes, the current changes in the same proportion.` },
      difference: { zh: `$|${V2} - ${V1}| = ${num(d)}$ 是電壓的變化量，不是比值。`, en: `$|${V2} - ${V1}| = ${num(d)}$ is the change in voltage, not the ratio.` },
    },
    explanation: {
      zh: `由 $I = \\dfrac{V}{R}$，電阻不變時電流與電壓成【正比】，故電流變為原來的 $\\dfrac{${V2}}{${V1}} ${eq(r)} ${num(r)}$ 倍。與電流成反比的是電阻，不是電壓。`,
      en: `From $I = \\dfrac{V}{R}$, with the resistance fixed the current is *proportional* to the voltage, so it becomes $\\dfrac{${V2}}{${V1}} ${eq(r)} ${num(r)}$ times the original. Current is inversely proportional to resistance, not to voltage.`,
    },
  }
}

function power(Vs: number, I: number): Built {
  const P = Vs * I
  const expected = { correct: W(P), resistance: W(Vs / I), sum: W(Vs + I), perMinute: W(P * 60) }
  return {
    template: 'electric-power-from-v-and-i',
    params: { V: Vs, I },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。$P = VI = ${Vs} \\times ${I} = ${num(P)}\\,\\text{W}$。`, en: `Correct. $P = VI = ${Vs} \\times ${I} = ${num(P)}\\,\\text{W}$.` },
      resistance: { zh: `$\\dfrac{V}{I} = \\dfrac{${Vs}}{${I}} ${eq(Vs / I)} ${num(Vs / I)}$ 是電器的電阻（單位為 $\\Omega$），不是功率。`, en: `$\\dfrac{V}{I} = \\dfrac{${Vs}}{${I}} ${eq(Vs / I)} ${num(Vs / I)}$ is the appliance's resistance (in $\\Omega$), not its power.` },
      sum: { zh: `$${Vs} + ${I} = ${num(Vs + I)}$ 把電壓與電流相加；兩者單位不同，不能相加。`, en: `$${Vs} + ${I} = ${num(Vs + I)}$ adds voltage and current; quantities with different units cannot be added.` },
      perMinute: { zh: `$VI \\times 60 = ${num(P * 60)}$ 多乘了 $60$ 秒，得出的是一分鐘內轉換的能量（焦耳），不是功率。功率是每秒轉換的能量。`, en: `$VI \\times 60 = ${num(P * 60)}$ multiplies by $60$ seconds, giving the energy converted in one minute (in joules), not the power. Power is energy per second.` },
    },
    explanation: {
      zh: `電功率 $P = VI = ${Vs} \\times ${I} = ${num(P)}\\,\\text{W}$。功率是每秒轉換的能量，計算時不涉及時間；答案的單位必須是瓦特。`,
      en: `Electrical power is $P = VI = ${Vs} \\times ${I} = ${num(P)}\\,\\text{W}$. Power is energy per second, so no time enters the calculation, and the answer must be in watts.`,
    },
  }
}

function fuse(P: number, Vs: number, ratings: number[]): Built {
  const I = P / Vs
  const above = ratings.filter((r) => r > I)
  const below = ratings.filter((r) => r < I)
  if (!above.length || !below.length || above.length < 2) throw new Error(`fuse: ratings ${ratings} do not bracket ${I}`)
  const [right, high] = above
  const low = below[below.length - 1]
  const expected = { correct: A(right), tooLow: A(low), tooHigh: A(high), powerOverTen: A(P / 10) }
  const Iline = `I = \\dfrac{P}{V} = \\dfrac{${P}}{${Vs}} ${eq(I)} ${num(I)}\\,\\text{A}`
  return {
    template: 'fuse-rating-choice',
    params: { P, V: Vs },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。正常工作電流 $${Iline}$，額定值要略高於此值，可選的額定值中最接近的是 $${right}\\,\\text{A}$。`, en: `Correct. The working current is $${Iline}$; the fuse rating should be just above it, and the closest available is $${right}\\,\\text{A}$.` },
      tooLow: { zh: `$${low}\\,\\text{A}$ 低於正常工作電流 $${num(I)}\\,\\text{A}$，電器一開保險絲就會熔斷。`, en: `$${low}\\,\\text{A}$ is below the working current of $${num(I)}\\,\\text{A}$, so the fuse would blow as soon as the appliance is switched on.` },
      tooHigh: { zh: `$${high}\\,\\text{A}$ 不會熔斷，但比所需高；出現故障時，電流要升到很高才會切斷，保護作用減弱。`, en: `$${high}\\,\\text{A}$ would not blow, but it is higher than needed; in a fault the current must rise much further before it cuts off, so it protects less.` },
      powerOverTen: { zh: `$\\dfrac{${P}}{10} = ${num(P / 10)}$ 把功率除以 $10$，與電壓無關；電流應是 $\\dfrac{P}{V}$。`, en: `$\\dfrac{${P}}{10} = ${num(P / 10)}$ divides the power by $10$, which has nothing to do with the voltage; the current is $\\dfrac{P}{V}$.` },
    },
    explanation: {
      zh: `先求正常工作電流：$${Iline}$。保險絲的額定值要略高於這個電流：太低，電器一開就熔斷；太高，出現故障時未能及時切斷。可選的額定值中最合適的是 $${right}\\,\\text{A}$。`,
      en: `First find the working current: $${Iline}$. The fuse rating should be just above it: too low and it blows when the appliance starts; too high and it does not cut off quickly in a fault. The best of the available ratings is $${right}\\,\\text{A}$.`,
    },
  }
}

function cost(P: number, t: number, c: number): Built {
  const kW = P / 1000, E = kW * t, total = E * c
  const yuan = (v: number) => `$${num(v)}$ 元`
  const dollars = (v: number) => `$${num(v)}$ dollars`
  return {
    template: 'electricity-cost-kwh',
    params: { P, t, c },
    expected: { correct: yuan(total), wattsAsKw: yuan(P * t * c), energyOnly: yuan(E), noTime: yuan(kW * c) },
    expectedEn: { correct: dollars(total), wattsAsKw: dollars(P * t * c), energyOnly: dollars(E), noTime: dollars(kW * c) },
    notes: {
      correct: { zh: `正確。$${P}\\,\\text{W} = ${num(kW)}\\,\\text{kW}$，耗電 $${num(kW)} \\times ${t} = ${num(E)}\\,\\text{kW}\\,\\text{h}$，電費 $${num(E)} \\times ${c} = ${num(total)}$ 元。`, en: `Correct. $${P}\\,\\text{W} = ${num(kW)}\\,\\text{kW}$, energy $${num(kW)} \\times ${t} = ${num(E)}\\,\\text{kW}\\,\\text{h}$, cost $${num(E)} \\times ${c} = ${num(total)}$ dollars.` },
      wattsAsKw: { zh: `沒有把瓦特化為千瓦，數值大了一千倍：$${P} \\times ${t} \\times ${c} = ${num(P * t * c)}$。`, en: `The watts were not converted to kilowatts, so the value is a thousand times too big: $${P} \\times ${t} \\times ${c} = ${num(P * t * c)}$.` },
      energyOnly: { zh: `$${num(E)}$ 是耗電量（$\\text{kW}\\,\\text{h}$），還要乘以每度電的收費 $${c}$ 元。`, en: `$${num(E)}$ is the energy used (in $\\text{kW}\\,\\text{h}$); it still has to be multiplied by the price of $${c}$ dollars per unit.` },
      noTime: { zh: `$${num(kW)} \\times ${c} = ${num(kW * c)}$ 漏了使用時間 $${t}\\,\\text{h}$。`, en: `$${num(kW)} \\times ${c} = ${num(kW * c)}$ leaves out the time of $${t}\\,\\text{h}$.` },
    },
    explanation: {
      zh: `先把功率化為千瓦：$${P}\\,\\text{W} = ${num(kW)}\\,\\text{kW}$。耗電量 $= ${num(kW)} \\times ${t} = ${num(E)}\\,\\text{kW}\\,\\text{h}$（即 $${num(E)}$ 度電），電費 $= ${num(E)} \\times ${c} = ${num(total)}$ 元。`,
      en: `Convert the power to kilowatts: $${P}\\,\\text{W} = ${num(kW)}\\,\\text{kW}$. Energy used $= ${num(kW)} \\times ${t} = ${num(E)}\\,\\text{kW}\\,\\text{h}$ ($${num(E)}$ units), so the cost is $${num(E)} \\times ${c} = ${num(total)}$ dollars.`,
    },
  }
}

function divider(Vs: number, R1: number, R2: number): Built {
  const I = Vs / (R1 + R2), Rp = (R1 * R2) / (R1 + R2)
  const expected = { correct: V(I * R1), otherResistor: V(I * R2), half: V(Vs / 2), parallelResistance: V(I * Rp) }
  return {
    template: 'series-voltage-divider',
    params: { V: Vs, R1, R2 },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。$I = \\dfrac{${Vs}}{${R1} + ${R2}} ${eq(I)} ${num(I)}\\,\\text{A}$，$V_1 = IR_1 = ${num(I)} \\times ${R1} ${eq(I * R1)} ${num(I * R1)}\\,\\text{V}$。`, en: `Correct. $I = \\dfrac{${Vs}}{${R1} + ${R2}} ${eq(I)} ${num(I)}\\,\\text{A}$, so $V_1 = IR_1 = ${num(I)} \\times ${R1} ${eq(I * R1)} ${num(I * R1)}\\,\\text{V}$.` },
      otherResistor: { zh: `$${num(I * R2)}\\,\\text{V}$ 是 $${R2}\\,\\Omega$ 兩端的電壓。分壓式的分子要放所求的電阻 $${R1}\\,\\Omega$。`, en: `$${num(I * R2)}\\,\\text{V}$ is the p.d. across the $${R2}\\,\\Omega$ resistor. In the divider formula, the resistor asked about goes on top.` },
      half: { zh: `$\\dfrac{${Vs}}{2} = ${num(Vs / 2)}$ 假設兩個電阻平分電壓，只在兩個電阻相等時才成立。`, en: `$\\dfrac{${Vs}}{2} = ${num(Vs / 2)}$ assumes the two resistors share the voltage equally, which holds only when they are equal.` },
      parallelResistance: { zh: `用了並聯組合電阻 $\\dfrac{${R1} \\times ${R2}}{${R1} + ${R2}} ${eq(Rp)} ${num(Rp)}\\,\\Omega$ 乘以電流；但兩個電阻是串聯的。`, en: `This multiplies the current by the parallel combination $\\dfrac{${R1} \\times ${R2}}{${R1} + ${R2}} ${eq(Rp)} ${num(Rp)}\\,\\Omega$, but the resistors are in series.` },
    },
    explanation: {
      zh: `串聯電路中電流處處相同：$I = \\dfrac{${Vs}}{${R1} + ${R2}} ${eq(I)} ${num(I)}\\,\\text{A}$，故 $V_1 = IR_1 ${eq(I * R1)} ${num(I * R1)}\\,\\text{V}$。等價寫法是分壓式 $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$：分子放所求的電阻。`,
      en: `In a series circuit the current is the same everywhere: $I = \\dfrac{${Vs}}{${R1} + ${R2}} ${eq(I)} ${num(I)}\\,\\text{A}$, so $V_1 = IR_1 ${eq(I * R1)} ${num(I * R1)}\\,\\text{V}$. Equivalently, the divider formula $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$ puts the resistor asked about on top.`,
    },
  }
}

const D = '([\\d.]+)'
function build(content: string): Built {
  let m: RegExpMatchArray | null
  if ((m = content.match(new RegExp(`^一個電阻為 \\$${D}\\\\,\\\\Omega\\$ 的電器接上 \\$${D}\\\\,\\\\text\\{V\\}\\$ 的電源。求通過它的電流。`)))) return ohm(+m[1], +m[2])
  if ((m = content.match(new RegExp(`電壓由 \\$${D}\\\\,\\\\text\\{V\\}\\$ 改為 \\$${D}\\\\,\\\\text\\{V\\}\\$，電阻值不變。`)))) return ratio(+m[1], +m[2])
  if ((m = content.match(new RegExp(`^某電器在 \\$${D}\\\\,\\\\text\\{V\\}\\$ 下工作，通過的電流為 \\$${D}\\\\,\\\\text\\{A\\}\\$。求它的電功率。`)))) return power(+m[1], +m[2])
  if ((m = content.match(new RegExp(`^一件 \\$${D}\\\\,\\\\text\\{W\\}\\$ 的電器接在 \\$${D}\\\\,\\\\text\\{V\\}\\$ 的家庭電源上。可選的保險絲額定值為 (.+)。應選哪一個？`)))) {
    const ratings = [...m[3].matchAll(/\$([\d.]+)\\,\\text\{A\}\$/g)].map((x) => +x[1])
    return fuse(+m[1], +m[2], ratings)
  }
  if ((m = content.match(new RegExp(`^一件 \\$${D}\\\\,\\\\text\\{W\\}\\$ 的電器連續使用 \\$${D}\\\\,\\\\text\\{h\\}\\$。若每度電（\\$1\\\\,\\\\text\\{kW\\}\\\\,\\\\text\\{h\\}\\$）收費 \\$${D}\\$ 元，求電費。`)))) return cost(+m[1], +m[2], +m[3])
  if ((m = content.match(new RegExp(`^\\$${D}\\\\,\\\\text\\{V\\}\\$ 電源接上串聯的 \\$${D}\\\\,\\\\Omega\\$ 與 \\$${D}\\\\,\\\\Omega\\$。求 \\$${D}\\\\,\\\\Omega\\$ 兩端的電壓。`)))) {
    if (m[4] !== m[2]) throw new Error('divider: the question asks about the second resistor')
    return divider(+m[1], +m[2], +m[3])
  }
  throw new Error(`stem matches no template: ${content}`)
}

const mod = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (mod.default?.getSubjectQuestionsRaw ? mod.default : mod) as {
  getSubjectQuestionsRaw: (s: string) => Array<{ id: string; content: string; options: string[]; optionsEn?: string[]; correctIndex: number }>
}
const bank = new Map(idx.getSubjectQuestionsRaw('physics').map((q) => [q.id, q]))

const out = []
for (const id of IDS) {
  const q = bank.get(id)
  if (!q) throw new Error(`${id} not in the raw physics bank`)
  const t = build(q.content)
  if (new Set(Object.values(t.expected)).size !== 4) throw new Error(`${id}: two kinds give the same option`)
  const notes: Note[] = q.options.map((opt, optionId) => {
    const kinds = Object.entries(t.expected).filter(([, s]) => s === opt).map(([k]) => k)
    if (kinds.length !== 1) throw new Error(`${id} option ${optionId} "${opt}" matched ${kinds.length} kinds`)
    if ((q.optionsEn ?? q.options)[optionId] !== t.expectedEn[kinds[0]]) throw new Error(`${id} option ${optionId}: English "${q.optionsEn?.[optionId]}" is not ${kinds[0]}`)
    return { optionId, kind: kinds[0], ...t.notes[kinds[0]] }
  })
  const correct = notes.filter((n) => n.kind === 'correct').map((n) => n.optionId)
  if (correct.length !== 1 || correct[0] !== q.correctIndex) throw new Error(`${id}: recomputed correct option ${correct} ≠ stored ${q.correctIndex}`)
  out.push({ id, template: t.template, params: t.params, options: q.options, optionsEn: q.optionsEn ?? q.options, explanation: t.explanation.zh, explanationEn: t.explanation.en, optionNotes: notes })
}

mkdirSync(join(ROOT, 'data/questions/rationale-repairs'), { recursive: true })
writeFileSync(
  join(ROOT, `data/questions/rationale-repairs/${BATCH}.json`),
  JSON.stringify({ batch: BATCH, subject: 'physics', computed: true, generatedBy: 'scripts/qbank/repairs/phy-01.mts', repairs: out }, null, 2) + '\n',
)
console.log(`✓ ${BATCH}: ${out.length} repairs written to data/questions/rationale-repairs/${BATCH}.json`)
