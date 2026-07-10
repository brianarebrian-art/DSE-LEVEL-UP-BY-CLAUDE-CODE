import type { Question } from './types'
import { createBank, n, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// CHEMISTRY — PARAMETRIC BANK (Mode A, correct-by-construction, 3-tier)
// Uses exact DSE relative atomic masses; only integer-Mr compounds are used so
// answers stay clean. Every distractor models a named error. rtp molar volume
// = 24 dm³/mol; Avogadro Nₐ = 6.02×10²³.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  mole: { id: 'mole_concept', zh: '摩爾概念', en: 'The Mole' },
  formula: { id: 'formula_mass', zh: '化學式與式量', en: 'Formulae & Formula Mass' },
  concentration: { id: 'concentration', zh: '濃度', en: 'Concentration' },
  stoichiometry: { id: 'stoichiometry', zh: '化學計量', en: 'Stoichiometry' },
  gas: { id: 'gas_volume', zh: '氣體體積', en: 'Gas Volume' },
} satisfies Record<string, TopicMeta>

const FW = {
  quantity: { id: 'chemical_quantity', zh: '化學計量', en: 'Chemical Quantity', emoji: '⚗️' },
  calc: { id: 'formula_calc', zh: '公式運算', en: 'Formula Calculation', emoji: '🧪' },
  reaction: { id: 'reaction_analysis', zh: '反應分析', en: 'Reaction Analysis', emoji: '🔬' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('chemistry')

// integer-Mr compounds (relative formula mass computed from DSE atomic masses)
const COMP: { f: string; mr: number }[] = [
  { f: 'H_2O', mr: 18 }, { f: 'CO_2', mr: 44 }, { f: 'CH_4', mr: 16 }, { f: 'NaOH', mr: 40 },
  { f: 'CaCO_3', mr: 100 }, { f: 'CaO', mr: 56 }, { f: 'MgO', mr: 40 }, { f: 'NH_3', mr: 17 },
  { f: 'O_2', mr: 32 }, { f: 'N_2', mr: 28 }, { f: 'H_2SO_4', mr: 98 }, { f: 'CuO', mr: 80 },
]

// ═══════════════════════════════════════════════════════════════════════════
// 補底 (easy)
// ═══════════════════════════════════════════════════════════════════════════

// E1 — moles n = m / M
COMP.forEach((c, ci) => {
  for (let nn = 1; nn <= 2; nn++) {
    const m = nn * c.mr
    add(`cb_e1_${ci}_${nn}`, T.mole, FW.quantity, 'easy',
      [`$${m}$ g $\\text{${c.f}}$（$M_r = ${c.mr}$）含有多少摩爾？`, `How many moles are in $${m}$ g of $\\text{${c.f}}$ ($M_r = ${c.mr}$)?`],
      [n(`$${nn}$ mol`), n(`$${m * c.mr}$ mol`), n(`$${round(c.mr / m, 3)}$ mol`), n(`$${m + c.mr}$ mol`)],
      [`$n = \\dfrac{m}{M} = \\dfrac{${m}}{${c.mr}} = ${nn}$ mol。陷阱：$${m * c.mr}$ 用了乘法；$${round(c.mr / m, 3)}$ 上下倒轉。`,
       `$n = \\frac{m}{M} = ${nn}$ mol. Trap: $${m * c.mr}$ multiplies instead of dividing.`])
  }
})

// E2 — mass m = n × M
COMP.forEach((c, ci) => {
  for (const nn of [3]) {
    const m = nn * c.mr
    add(`cb_e2_${ci}_${nn}`, T.mole, FW.quantity, 'easy',
      [`$${nn}$ mol $\\text{${c.f}}$（$M_r = ${c.mr}$）的質量是多少？`, `What is the mass of $${nn}$ mol of $\\text{${c.f}}$ ($M_r = ${c.mr}$)?`],
      [n(`$${m}$ g`), n(`$${round(nn / c.mr, 3)}$ g`), n(`$${c.mr}$ g`), n(`$${nn + c.mr}$ g`)],
      [`$m = nM = ${nn} \\times ${c.mr} = ${m}$ g。陷阱：$${round(nn / c.mr, 3)}$ 用了除法；$${c.mr}$ 漏了 $\\times n$。`,
       `$m = nM = ${m}$ g. Trap: $${c.mr}$ forgets to multiply by $n$.`])
  }
})

// E3 — percentage by mass of one element
;([
  { f: 'H_2O', mr: 18, part: 16, el: ['氧 O', 'oxygen O'] },
  { f: 'CaO', mr: 56, part: 16, el: ['氧 O', 'oxygen O'] },
  { f: 'CO_2', mr: 44, part: 12, el: ['碳 C', 'carbon C'] },
  { f: 'CH_4', mr: 16, part: 12, el: ['碳 C', 'carbon C'] },
  { f: 'NaOH', mr: 40, part: 23, el: ['鈉 Na', 'sodium Na'] },
  { f: 'MgO', mr: 40, part: 24, el: ['鎂 Mg', 'magnesium Mg'] },
  { f: 'NH_3', mr: 17, part: 14, el: ['氮 N', 'nitrogen N'] },
  { f: 'CaCO_3', mr: 100, part: 40, el: ['鈣 Ca', 'calcium Ca'] },
] as const).forEach((c, i) => {
  const pct = round((c.part / c.mr) * 100, 1)
  add(`cb_e3_${i}`, T.formula, FW.calc, 'easy',
    [`求 $\\text{${c.f}}$（$M_r = ${c.mr}$）中${c.el[0]}的質量百分比。`, `Find the percentage by mass of ${c.el[1]} in $\\text{${c.f}}$ ($M_r = ${c.mr}$).`],
    [n(`$${pct}\\%$`), n(`$${round(((c.mr - c.part) / c.mr) * 100, 1)}\\%$`), n(`$${round(c.part / c.mr, 3)}$`), n(`$${round(c.mr / c.part, 2)}$`)],
    [`質量百分比 $= \\dfrac{\\text{該元素質量}}{M_r} \\times 100\\% = \\dfrac{${c.part}}{${c.mr}} \\times 100\\% = ${pct}\\%$。陷阱：$${round(((c.mr - c.part) / c.mr) * 100, 1)}\\%$ 是其餘部分；$${round(c.part / c.mr, 3)}$ 漏了 $\\times 100\\%$。`,
     `% by mass $= \\frac{${c.part}}{${c.mr}} \\times 100\\% = ${pct}\\%$. Trap: the "rest" is $${round(((c.mr - c.part) / c.mr) * 100, 1)}\\%$.`])
})

// ═══════════════════════════════════════════════════════════════════════════
// 普通 (medium)
// ═══════════════════════════════════════════════════════════════════════════

// M1 — concentration c = n / V  (V in dm³)
for (let nn = 1; nn <= 6; nn++) {
  for (const V of [2, 4, 5]) {
    const conc = nn / V
    add(`cb_m1_${nn}_${V}`, T.concentration, FW.calc, 'medium',
      [`把 $${nn}$ mol 溶質溶於 $${V}$ dm³ 溶液中，求其摩爾濃度。`, `$${nn}$ mol of solute is dissolved to make $${V}$ dm³ of solution. Find the molarity.`],
      [n(`$${round(conc, 3)}$ mol/dm³`), n(`$${round(V / nn, 3)}$ mol/dm³`), n(`$${nn * V}$ mol/dm³`), n(`$${nn + V}$ mol/dm³`)],
      [`$c = \\dfrac{n}{V} = \\dfrac{${nn}}{${V}} = ${round(conc, 3)}$ mol/dm³。陷阱：$${round(V / nn, 3)}$ 上下倒轉；$${nn * V}$ 用了乘法。`,
       `$c = \\frac{n}{V} = ${round(conc, 3)}$ mol/dm³. Trap: $${round(V / nn, 3)}$ inverts the ratio.`])
  }
}

// M2 — concentration from mass: c = (m/M)/V
COMP.filter((c) => c.mr <= 100).forEach((c, ci) => {
  for (const nn of [1, 2]) {
    for (const V of [2, 5]) {
      const m = nn * c.mr
      const conc = nn / V
      // opts: correct n/V · mass/V (forgot ÷Mr) · n×V (×V not ÷V) · gave n as answer (forgot ÷V)
      add(`cb_m2_${ci}_${nn}_${V}`, T.concentration, FW.calc, 'medium',
        [`把 $${m}$ g $\\text{${c.f}}$（$M_r = ${c.mr}$）溶於水配成 $${V}$ dm³ 溶液，求濃度。`,
         `$${m}$ g of $\\text{${c.f}}$ ($M_r = ${c.mr}$) is dissolved to make $${V}$ dm³ of solution. Find the concentration.`],
        [n(`$${round(conc, 3)}$ mol/dm³`), n(`$${round(m / V, 3)}$ mol/dm³`), n(`$${round(nn * V, 3)}$ mol/dm³`), n(`$${nn}$ mol/dm³`)],
        [`先求摩爾：$n = \\dfrac{${m}}{${c.mr}} = ${nn}$ mol，再 $c = \\dfrac{n}{V} = \\dfrac{${nn}}{${V}} = ${round(conc, 3)}$ mol/dm³。陷阱：$${round(m / V, 3)}$ 用了質量而非摩爾；$${nn}$ 漏了 $\\div V$。`,
         `$n = \\frac{${m}}{${c.mr}} = ${nn}$ mol, then $c = \\frac{n}{V} = ${round(conc, 3)}$ mol/dm³. Trap: $${round(m / V, 3)}$ uses mass, not moles; $${nn}$ forgets $\\div V$.`])
    }
  }
})

// M3 — number of particles = n × Nₐ  (Nₐ = 6.02×10²³)
for (const nn of [2, 3, 4, 5, 0.5]) {
  const val = round(nn * 6.02, 2)
  add(`cb_m3_${String(nn).replace('.', '_')}`, T.mole, FW.quantity, 'medium',
    [`$${nn}$ mol 物質含有多少個粒子（$N_A = 6.02\\times10^{23}$）？`, `How many particles are in $${nn}$ mol ($N_A = 6.02\\times10^{23}$)?`],
    [n(`$${val}\\times10^{23}$`), n(`$6.02\\times10^{23}$`), n(`$${val}\\times10^{-23}$`), n(`$${round(nn + 6.02, 2)}\\times10^{23}$`)],
    [`粒子數 $= n \\times N_A = ${nn} \\times 6.02\\times10^{23} = ${val}\\times10^{23}$。陷阱：$6.02\\times10^{23}$ 漏了 $\\times n$；$${val}\\times10^{-23}$ 指數符號錯。`,
     `Particles $= n \\times N_A = ${val}\\times10^{23}$. Trap: $6.02\\times10^{23}$ forgets the $\\times n$.`])
}

// ═══════════════════════════════════════════════════════════════════════════
// 拔尖 (hard)
// ═══════════════════════════════════════════════════════════════════════════

// H1 — gas volume at rtp: V = 24 × (m/M)  (two-step)
;([{ f: 'O_2', mr: 32 }, { f: 'CO_2', mr: 44 }, { f: 'CH_4', mr: 16 }, { f: 'N_2', mr: 28 }] as const)
  .forEach((c, ci) => {
    for (const nn of [0.5, 1, 1.5, 2, 2.5, 3]) {
      const m = nn * c.mr
      const V = 24 * nn
      add(`cb_h1_${ci}_${String(nn).replace('.', '_')}`, T.gas, FW.reaction, 'hard',
        [`在室溫及壓力（rtp）下，$${m}$ g $\\text{${c.f}}$（$M_r = ${c.mr}$）氣體佔的體積是多少（$V_m = 24$ dm³/mol）？`,
         `At rtp, what volume does $${m}$ g of $\\text{${c.f}}$ gas ($M_r = ${c.mr}$) occupy ($V_m = 24$ dm³/mol)?`],
        [n(`$${round(V, 2)}$ dm³`), n(`$${nn}$ dm³`), n(`$${round(24 * m, 2)}$ dm³`), n(`$${round(24 / nn, 2)}$ dm³`)],
        [`先求摩爾 $n = \\dfrac{${m}}{${c.mr}} = ${nn}$ mol，再 $V = n \\times 24 = ${nn} \\times 24 = ${round(V, 2)}$ dm³。陷阱：$${nn}$ 漏了 $\\times 24$；$${round(24 * m, 2)}$ 用了質量而非摩爾。`,
         `$n = \\frac{${m}}{${c.mr}} = ${nn}$ mol, then $V = 24n = ${round(V, 2)}$ dm³. Trap: $${round(24 * m, 2)}$ uses mass instead of moles.`])
    }
  })

// H2 — acid–base titration (1:1), find base volume: Vb = ca·Va / cb
// (cb ≥ 2 and ca ≠ cb so the "÷cb" and "equal-volume" distractors stay distinct)
for (const ca of [1, 2, 3]) {
  for (const cb of [2, 3, 4]) {
    if (ca === cb) continue
    for (const Va of [20, 24, 30, 36, 40, 48, 60]) {
      const Vb = (ca * Va) / cb
      if (!Number.isInteger(Vb)) continue
      add(`cb_h2_${ca}_${cb}_${Va}`, T.stoichiometry, FW.reaction, 'hard',
        [`用 $${cb}$ mol/dm³ NaOH 中和 $${Va}$ cm³ 的 $${ca}$ mol/dm³ HCl（$\\text{HCl}+\\text{NaOH}\\to\\text{NaCl}+\\text{H}_2\\text{O}$），需要多少 cm³ NaOH？`,
         `What volume of $${cb}$ mol/dm³ NaOH neutralises $${Va}$ cm³ of $${ca}$ mol/dm³ HCl ($\\text{HCl}+\\text{NaOH}\\to\\text{NaCl}+\\text{H}_2\\text{O}$)?`],
        [n(`$${Vb}$ cm³`), n(`$${round((cb * Va) / ca, 2)}$ cm³`), n(`$${ca * Va}$ cm³`), n(`$${Va}$ cm³`)],
        [`酸鹼摩爾比 $1:1$：$c_aV_a = c_bV_b$ ⇒ $V_b = \\dfrac{c_aV_a}{c_b} = \\dfrac{${ca}\\times${Va}}{${cb}} = ${Vb}$ cm³。陷阱：$${round((cb * Va) / ca, 2)}$ 將兩個濃度倒轉；$${ca * Va}$ 漏了 $\\div c_b$；$${Va}$ 當兩者體積相等。`,
         `1:1 ratio: $c_aV_a=c_bV_b$ ⇒ $V_b = \\frac{c_aV_a}{c_b} = ${Vb}$ cm³. Trap: $${ca * Va}$ forgets $\\div c_b$; $${Va}$ assumes equal volumes.`])
    }
  }
}

// H3 — mass of product from 1:1 decomposition CaCO₃ → CaO + CO₂ (Mr 100→56, CO₂ 44)
for (const m of [25, 50, 75, 100, 125, 150, 175, 200, 250, 300]) {
  const cao = round((m * 56) / 100, 2)
  const co2 = round((m * 44) / 100, 2)
  add(`cb_h3_${m}`, T.stoichiometry, FW.reaction, 'hard',
    [`完全分解 $${m}$ g $\\text{CaCO}_3$（$\\text{CaCO}_3 \\to \\text{CaO} + \\text{CO}_2$，$M_r$：$100 \\to 56$）可得多少 g CaO？`,
     `Decomposing $${m}$ g of $\\text{CaCO}_3$ completely ($\\text{CaCO}_3 \\to \\text{CaO} + \\text{CO}_2$, $M_r$: $100 \\to 56$) gives how many g of CaO?`],
    [n(`$${cao}$ g`), n(`$${co2}$ g`), n(`$${m}$ g`), n(`$${round((m * 100) / 56, 2)}$ g`)],
    [`摩爾比 $1:1$。$n(\\text{CaCO}_3) = \\dfrac{${m}}{100}$，$m(\\text{CaO}) = n \\times 56 = \\dfrac{${m}\\times56}{100} = ${cao}$ g。陷阱：$${co2}$ 是放出的 $\\text{CO}_2$ 質量（$56+44=100$）；$${m}$ 當沒有質量損失。`,
     `1:1 ratio ⇒ $m(\\text{CaO}) = \\frac{${m}\\times56}{100} = ${cao}$ g. Trap: $${co2}$ g is the CO₂ released; $${m}$ g assumes no mass loss.`])
}

export const chemistryBankQuestions: Question[] = bank
