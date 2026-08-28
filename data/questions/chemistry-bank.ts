import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, n, round, gcd, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// CHEMISTRY — PARAMETRIC BANK (Mode A, correct-by-construction, 3-tier)
// Uses exact DSE relative atomic masses; only integer-Mr compounds are used so
// answers stay clean. Every distractor models a named error. rtp molar volume
// = 24 dm³/mol; Avogadro Nₐ = 6.02×10²³.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  // 2026-08-23：id 由 'mole_concept' 改為 'mole'。
  // chemistry.ts 早已註冊 `mole`（摩爾概念 / The Mole Concept），本檔卻另立
  // 一個 'mole_concept'，令 29 條題目掛在一個【未註冊】的課題之上。科目頁的
  // 課題 chip 只列已註冊課題，故學生由課題入口永遠篩不到這 29 條。
  // 英文名一併對齊註冊表（The Mole → The Mole Concept）。
  mole: { id: 'mole', zh: '摩爾概念', en: 'The Mole Concept' },
  formula: { id: 'formula_mass', zh: '化學式與式量', en: 'Formulae & Formula Mass' },
  concentration: { id: 'concentration', zh: '濃度', en: 'Concentration' },
  // ── 2026-08-28 平均分佈補強 ────────────────────────────────────────────
  // 實測化學 14 個課題全部低於平均值 71（總缺 675）。以下六個課題最薄
  // （15–24 條）而且原本不在參數化題庫覆蓋範圍之內，故各加母模板。
  acidsBases: { id: 'acids_bases', zh: '酸鹼', en: 'Acids & Bases' },
  redox: { id: 'redox', zh: '氧化還原', en: 'Redox' },
  ratesEnergy: { id: 'rates_energy', zh: '反應速率與能量', en: 'Reaction Rates & Energy' },
  bonding: { id: 'bonding', zh: '化學鍵', en: 'Chemical Bonding' },
  periodic: { id: 'periodic_table', zh: '週期表', en: 'The Periodic Table' },
  organic: { id: 'organic', zh: '有機化學', en: 'Organic Chemistry' },
  // 第二批：四個「高階」課題各僅 10 條，係全科最薄。
  hellQuant: { id: 'chem_hell_quant', zh: '定量計算（高階）', en: 'Quantitative killers' },
  hellRedox: { id: 'chem_hell_redox_equil', zh: '氧化還原與平衡', en: 'Redox & equilibrium' },
  hellOrganic: { id: 'chem_hell_organic', zh: '有機化學（高階）', en: 'Organic killers' },
  gasVolume: { id: 'gas_volume', zh: '氣體體積', en: 'Gas Volume' },
  stoichiometry: { id: 'stoichiometry', zh: '化學計量', en: 'Stoichiometry' },
  gas: { id: 'gas_volume', zh: '氣體體積', en: 'Gas Volume' },
} satisfies Record<string, TopicMeta>

const FW = {
  quantity: { id: 'chemical_quantity', zh: '化學計量', en: 'Chemical Quantity', emoji: '⚗️' },
  calc: { id: 'formula_calc', zh: '公式運算', en: 'Formula Calculation', emoji: '🧪' },
  reaction: { id: 'reaction_analysis', zh: '反應分析', en: 'Reaction Analysis', emoji: '🔬' },
  equilibrium: { id: 'equilibrium_concepts', zh: '平衡概念', en: 'Equilibrium Concepts', emoji: '⚗️' },
  electron: { id: 'electron_transfer', zh: '電子轉移', en: 'Electron Transfer', emoji: '🔋' },
  dynamics: { id: 'reaction_dynamics', zh: '反應動力', en: 'Reaction Dynamics', emoji: '🔥' },
  structure: { id: 'structure_properties', zh: '結構與性質', en: 'Structure & Properties', emoji: '🔗' },
  carbon: { id: 'carbon_compounds', zh: '碳化合物', en: 'Carbon Compounds', emoji: '🛢️' },
  quantReason: { id: 'quantitative_reasoning', zh: '定量推理', en: 'Quantitative Reasoning', emoji: '⚖️' },
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
      [`$${m}$ g $\\mathrm{${c.f}}$（$M_r = ${c.mr}$）含有多少摩爾？`, `How many moles are in $${m}$ g of $\\mathrm{${c.f}}$ ($M_r = ${c.mr}$)?`],
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
      [`$${nn}$ mol $\\mathrm{${c.f}}$（$M_r = ${c.mr}$）的質量是多少？`, `What is the mass of $${nn}$ mol of $\\mathrm{${c.f}}$ ($M_r = ${c.mr}$)?`],
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
    [`求 $\\mathrm{${c.f}}$（$M_r = ${c.mr}$）中${c.el[0]}的質量百分比。`, `Find the percentage by mass of ${c.el[1]} in $\\mathrm{${c.f}}$ ($M_r = ${c.mr}$).`],
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
        [`把 $${m}$ g $\\mathrm{${c.f}}$（$M_r = ${c.mr}$）溶於水配成 $${V}$ dm³ 溶液，求濃度。`,
         `$${m}$ g of $\\mathrm{${c.f}}$ ($M_r = ${c.mr}$) is dissolved to make $${V}$ dm³ of solution. Find the concentration.`],
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
        [`在室溫及壓力（rtp）下，$${m}$ g $\\mathrm{${c.f}}$（$M_r = ${c.mr}$）氣體佔的體積是多少（$V_m = 24$ dm³/mol）？`,
         `At rtp, what volume does $${m}$ g of $\\mathrm{${c.f}}$ gas ($M_r = ${c.mr}$) occupy ($V_m = 24$ dm³/mol)?`],
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
        [`用 $${cb}$ mol/dm³ NaOH 中和 $${Va}$ cm³ 的 $${ca}$ mol/dm³ HCl（$\\mathrm{HCl}+\\mathrm{NaOH}\\to\\mathrm{NaCl}+\\mathrm{H}_2\\mathrm{O}$），需要多少 cm³ NaOH？`,
         `What volume of $${cb}$ mol/dm³ NaOH neutralises $${Va}$ cm³ of $${ca}$ mol/dm³ HCl ($\\mathrm{HCl}+\\mathrm{NaOH}\\to\\mathrm{NaCl}+\\mathrm{H}_2\\mathrm{O}$)?`],
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
    [`完全分解 $${m}$ g $\\mathrm{CaCO}_3$（$\\mathrm{CaCO}_3 \\to \\mathrm{CaO} + \\mathrm{CO}_2$，$M_r$：$100 \\to 56$）可得多少 g CaO？`,
     `Decomposing $${m}$ g of $\\mathrm{CaCO}_3$ completely ($\\mathrm{CaCO}_3 \\to \\mathrm{CaO} + \\mathrm{CO}_2$, $M_r$: $100 \\to 56$) gives how many g of CaO?`],
    [n(`$${cao}$ g`), n(`$${co2}$ g`), n(`$${m}$ g`), n(`$${round((m * 100) / 56, 2)}$ g`)],
    [`摩爾比 $1:1$。$n(\\mathrm{CaCO}_3) = \\dfrac{${m}}{100}$，$m(\\mathrm{CaO}) = n \\times 56 = \\dfrac{${m}\\times56}{100} = ${cao}$ g。陷阱：$${co2}$ 是放出的 $\\mathrm{CO}_2$ 質量（$56+44=100$）；$${m}$ 當沒有質量損失。`,
     `1:1 ratio ⇒ $m(\\mathrm{CaO}) = \\frac{${m}\\times56}{100} = ${cao}$ g. Trap: $${co2}$ g is the CO₂ released; $${m}$ g assumes no mass loss.`])
}

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強 —— 六個最薄課題（2026-08-28）
// 正解與三個干擾項全部由公式計出；每個干擾項模擬一個具名錯誤。
// ═══════════════════════════════════════════════════════════════════════════

// AB1 — 由氫離子濃度求 pH：[H⁺] = 10⁻ⁿ ⇒ pH = n
for (let k = 1; k <= 7; k++) {
  for (const acid of ['鹽酸', '硝酸', '氫溴酸'] as const) {
    add(`cb_ab1_${k}_${acid}`, T.acidsBases, FW.equilibrium, 'easy',
      [`某${acid}溶液的氫離子濃度為 $10^{-${k}}$ M。其 pH 值是多少？`,
       `A solution has a hydrogen ion concentration of $10^{-${k}}$ M. What is its pH?`],
      [n(`$${k}$`), n(`$${-k}$`), n(`$${14 - k}$`), n(`$${k * 2}$`)],
      [`pH $= -\\log[\\mathrm{H^+}]$。當 $[\\mathrm{H^+}] = 10^{-${k}}$ M 時，pH $= -\\log(10^{-${k}}) = ${k}$。陷阱：$${-k}$ 漏了負號（pH 在中學範圍內不會是負數）；$${14 - k}$ 是 pOH；$${k * 2}$ 把指數乘了 2。記住 pH 愈細酸性愈強，每差 1 個單位，氫離子濃度相差 10 倍。`,
       `pH $= -\\log[\\mathrm{H^+}]$, so with $[\\mathrm{H^+}] = 10^{-${k}}$ M the pH is $-\\log(10^{-${k}}) = ${k}$. Traps: $${-k}$ drops the minus sign, and pH is not negative in the school range; $${14 - k}$ is the pOH; $${k * 2}$ doubles the exponent. Remember that a lower pH means a stronger acid, and each unit of pH is a tenfold change in hydrogen ion concentration.`])
  }
}

// AB2 — 一元酸鹼中和：M₁V₁ = M₂V₂
for (const Ma of [0.1, 0.2, 0.5]) {
  for (const Va of [20, 25, 40, 50]) {
    for (const Mb of [0.1, 0.2, 0.5]) {
      const Vb = (Ma * Va) / Mb
      if (!Number.isInteger(Vb) || Ma === Mb) continue
      add(`cb_ab2_${String(Ma).replace('.', '')}_${Va}_${String(Mb).replace('.', '')}`, T.acidsBases, FW.equilibrium, 'medium',
        [`用 $${Mb}$ M 氫氧化鈉溶液中和 $${Va}$ cm³ 的 $${Ma}$ M 鹽酸（兩者均為一元）。所需氫氧化鈉溶液的體積是多少？`,
         `What volume of $${Mb}$ M sodium hydroxide is needed to neutralise $${Va}$ cm³ of $${Ma}$ M hydrochloric acid? (Both are monobasic.)`],
        [n(`$${Vb}$ cm³`), n(`$${round(Mb * Va / Ma, 2)}$ cm³`), n(`$${round(Ma * Mb * Va, 2)}$ cm³`), n(`$${Va}$ cm³`)],
        [`一元酸與一元鹼按 $1 : 1$ 反應，故 $M_aV_a = M_bV_b$。代入：$${Ma} \\times ${Va} = ${Mb} \\times V_b$，得 $V_b = ${Vb}$ cm³。陷阱：$${round(Mb * Va / Ma, 2)}$ cm³ 把兩個濃度調轉；$${round(Ma * Mb * Va, 2)}$ cm³ 用了相乘；$${Va}$ cm³ 以為體積必定相同——只有兩者濃度相等時才成立。`,
         `A monobasic acid and a monoacidic base react $1 : 1$, so $M_aV_a = M_bV_b$. Substituting: $${Ma} \\times ${Va} = ${Mb} \\times V_b$, giving $V_b = ${Vb}$ cm³. Traps: $${round(Mb * Va / Ma, 2)}$ cm³ swaps the two concentrations; $${round(Ma * Mb * Va, 2)}$ cm³ multiplies; $${Va}$ cm³ assumes equal volumes, which holds only when the concentrations are equal.`])
    }
  }
}

// RX1 — 含氧酸中中心原子的氧化數：H_aXO_b ⇒ x = 2b − a
for (const [a, b, f] of [[2, 4, 'H_2XO_4'], [1, 3, 'HXO_3'], [2, 3, 'H_2XO_3'], [1, 4, 'HXO_4'], [3, 4, 'H_3XO_4'], [1, 2, 'HXO_2'], [2, 7, 'H_2X_2O_7']] as [number, number, string][]) {
  const x = f.includes('X_2') ? (2 * b - a) / 2 : 2 * b - a
  if (!Number.isInteger(x) || x <= 0) continue
  add(`cb_rx1_${a}_${b}`, T.redox, FW.electron, 'medium',
    [`在化合物 $\\mathrm{${f}}$ 之中，元素 $\\mathrm{X}$ 的氧化數是多少？（$\\mathrm{H}$ 為 $+1$，$\\mathrm{O}$ 為 $-2$）`,
     `What is the oxidation number of $\\mathrm{X}$ in $\\mathrm{${f}}$? (Take $\\mathrm{H}$ as $+1$ and $\\mathrm{O}$ as $-2$.)`],
    [n(`$+${x}$`), n(`$-${x}$`), n(`$+${2 * b}$`), n(`$+${Math.abs(2 * b - a - 2)}$`)],
    [`化合物中各原子氧化數的總和為 $0$。設 $\\mathrm{X}$ 為 $x$：${a} 個 $\\mathrm{H}$ 貢獻 $+${a}$，${b} 個 $\\mathrm{O}$ 貢獻 $-${2 * b}$，故 $x = ${2 * b} - ${a} = +${x}$。陷阱：$-${x}$ 正負號相反；$+${2 * b}$ 漏了氫的貢獻；$+${Math.abs(2 * b - a - 2)}$ 少算了一個氧。`,
     `The oxidation numbers in a compound sum to $0$. Let $\\mathrm{X}$ be $x$: the ${a} hydrogens contribute $+${a}$ and the ${b} oxygens $-${2 * b}$, so $x = ${2 * b} - ${a} = +${x}$. Traps: $-${x}$ has the wrong sign; $+${2 * b}$ omits the hydrogen contribution; $+${Math.abs(2 * b - a - 2)}$ counts one oxygen too few.`])
}

// RE1 — 平均反應速率 = 變化量 ÷ 時間
for (const dm of [12, 18, 24, 30, 36, 48]) {
  for (const dt of [2, 3, 4, 6]) {
    const rate = dm / dt
    if (!Number.isInteger(rate)) continue
    add(`cb_re1_${dm}_${dt}`, T.ratesEnergy, FW.dynamics, 'easy',
      [`某反應在 $${dt}$ 分鐘內放出 $${dm}$ cm³ 氣體。其平均反應速率是多少？`,
       `A reaction releases $${dm}$ cm³ of gas in $${dt}$ minutes. What is the average rate of reaction?`],
      [n(`$${rate}$ cm³/min`), n(`$${round(dt / dm, 3)}$ cm³/min`), n(`$${dm * dt}$ cm³/min`), n(`$${dm}$ cm³/min`)],
      [`平均反應速率 $=$ 變化量 $\\div$ 時間 $= ${dm} \\div ${dt} = ${rate}$ cm³/min。陷阱：$${round(dt / dm, 3)}$ 上下倒轉；$${dm * dt}$ 用了乘法；$${dm}$ 漏了除以時間。留意反應速率一般隨時間下降，因為反應物濃度不斷減少，所以「平均速率」與任何一刻的「瞬時速率」通常不同。`,
       `Average rate = change ÷ time = $${dm} \\div ${dt} = ${rate}$ cm³/min. Traps: $${round(dt / dm, 3)}$ inverts the fraction; $${dm * dt}$ multiplies; $${dm}$ omits the division by time. Note that the rate generally falls over time as the reactants are used up, so an average rate usually differs from the instantaneous rate at any moment.`])
  }
}

// RE2 — 由鍵能求焓變：ΔH = Σ(斷鍵) − Σ(成鍵)
for (const broken of [800, 900, 1000, 1200, 1400]) {
  for (const formed of [700, 850, 1100, 1300, 1500]) {
    const dH = broken - formed
    if (dH === 0) continue
    add(`cb_re2_${broken}_${formed}`, T.ratesEnergy, FW.dynamics, 'medium',
      [`某反應斷開舊鍵共需吸收 $${broken}$ kJ，形成新鍵共放出 $${formed}$ kJ。其焓變 $\\Delta H$ 是多少？該反應屬放熱還是吸熱？`,
       `A reaction absorbs $${broken}$ kJ breaking bonds and releases $${formed}$ kJ forming bonds. What is $\\Delta H$, and is the reaction exothermic or endothermic?`],
      [n(`$${dH > 0 ? '+' : ''}${dH}$ kJ，${dH > 0 ? '吸熱' : '放熱'}`),
       n(`$${dH > 0 ? '-' : '+'}${Math.abs(dH)}$ kJ，${dH > 0 ? '放熱' : '吸熱'}`),
       n(`$+${broken + formed}$ kJ，吸熱`), n(`$${formed - broken > 0 ? '+' : ''}${formed - broken}$ kJ，${formed - broken > 0 ? '吸熱' : '放熱'}`)],
      [`$\\Delta H = $ 斷鍵吸收的能量 $-$ 成鍵放出的能量 $= ${broken} - ${formed} = ${dH > 0 ? '+' : ''}${dH}$ kJ。$\\Delta H$ 為${dH > 0 ? '正表示吸熱' : '負表示放熱'}。斷鍵永遠吸熱、成鍵永遠放熱，兩者相減決定整體方向。陷阱：$+${broken + formed}$ kJ 把兩者相加；另外兩項的正負號或方向弄反。`,
       `$\\Delta H = $ energy absorbed breaking bonds $-$ energy released forming bonds $= ${broken} - ${formed} = ${dH > 0 ? '+' : ''}${dH}$ kJ, and a ${dH > 0 ? 'positive value means endothermic' : 'negative value means exothermic'}. Breaking bonds always absorbs energy and forming them always releases it; the difference sets the overall direction. Traps: $+${broken + formed}$ kJ adds the two; the others reverse the sign or the direction.`])
  }
}

// BD1 — 離子化合物的化學式（由電荷交叉配平）
// 干擾項設計：三個都必須恆與正解相異，否則 add() 會丟棄整組。
//   w1 未交叉（直接把電荷數當下標）· w2 陽離子下標多一 · w3 陰離子下標多一
// 電荷同為 1 的組合（如 Na⁺Cl⁻）會令 w1 等於正解，故一律跳過。
// 元素符號直接列出，不由 LaTeX 字串反解 —— 反解會把 `\mathrm{Mg^{2+}}` 切成
// `Mg}`（正則食到第一個右括號便停），令輸出的大括號不平衡。validate-banks
// 只驗 `$` 配對而不驗括號配對，故此類錯誤能一路綠燈流到學生眼前。
for (const [C2, cat, cc, A2, an, ac] of [
  ['Mg', '\\mathrm{Mg^{2+}}', 2, 'Cl', '\\mathrm{Cl^-}', 1],
  ['Al', '\\mathrm{Al^{3+}}', 3, 'Cl', '\\mathrm{Cl^-}', 1],
  ['Na', '\\mathrm{Na^+}', 1, 'O', '\\mathrm{O^{2-}}', 2],
  ['Mg', '\\mathrm{Mg^{2+}}', 2, 'O', '\\mathrm{O^{2-}}', 2],
  ['Al', '\\mathrm{Al^{3+}}', 3, 'O', '\\mathrm{O^{2-}}', 2],
  ['Ca', '\\mathrm{Ca^{2+}}', 2, 'N', '\\mathrm{N^{3-}}', 3],
  ['K', '\\mathrm{K^+}', 1, 'S', '\\mathrm{S^{2-}}', 2],
  ['Al', '\\mathrm{Al^{3+}}', 3, 'S', '\\mathrm{S^{2-}}', 2],
  ['Ca', '\\mathrm{Ca^{2+}}', 2, 'Cl', '\\mathrm{Cl^-}', 1],
  ['Li', '\\mathrm{Li^+}', 1, 'N', '\\mathrm{N^{3-}}', 3],
  ['Ba', '\\mathrm{Ba^{2+}}', 2, 'Br', '\\mathrm{Br^-}', 1],
  ['Fe', '\\mathrm{Fe^{3+}}', 3, 'O', '\\mathrm{O^{2-}}', 2],
] as [string, string, number, string, string, number][]) {
  if (cc === 1 && ac === 1) continue
  const gg = gcd(cc, ac)
  const nc = ac / gg, na = cc / gg
  const sub = (e: string, k: number) => (k === 1 ? e : `${e}_${k}`)
  const right = `\\mathrm{${sub(C2, nc)}${sub(A2, na)}}`
  const w1 = `\\mathrm{${sub(C2, cc)}${sub(A2, ac)}}`
  const w2 = `\\mathrm{${sub(C2, nc + 1)}${sub(A2, na)}}`
  const w3 = `\\mathrm{${sub(C2, nc)}${sub(A2, na + 1)}}`
  add(`cb_bd1_${C2}${A2}_${cc}${ac}`, T.bonding, FW.structure, 'medium',
    [`由 $${cat}$ 與 $${an}$ 形成的離子化合物，其化學式是甚麼？`,
     `What is the formula of the ionic compound formed from $${cat}$ and $${an}$?`],
    [n(`$${right}$`), n(`$${w1}$`), n(`$${w2}$`), n(`$${w3}$`)],
    [`離子化合物整體必須電中性，正負電荷總量要相等。$${cat}$ 帶 $${cc}$ 個正電、$${an}$ 帶 $${ac}$ 個負電；把電荷數交叉寫成對方的下標再約簡，得 $${right}$（$${nc} \\times ${cc} = ${na} \\times ${ac}$，正負相抵）。陷阱：$${w1}$ 把電荷數直接寫成自己的下標而未交叉；$${w2}$ 與 $${w3}$ 各有一個下標多算了一，代入檢查電荷即知不平衡。`,
     `An ionic compound must be electrically neutral, so the total positive and negative charges must be equal. $${cat}$ carries $${cc}$ positive charges and $${an}$ carries $${ac}$ negative; crossing the charge numbers over as subscripts and simplifying gives $${right}$, since $${nc} \\times ${cc} = ${na} \\times ${ac}$ and the charges cancel. Traps: $${w1}$ uses each charge as its own subscript without crossing; $${w2}$ and $${w3}$ each have one subscript too many, which fails a charge check.`])
}

// PT1 — 由原子序推電子排布與週期／族（Z ≤ 20）
for (const [Z, el, per, grp, cfg] of [
  [3, 'Li', 2, 1, '2, 1'], [4, 'Be', 2, 2, '2, 2'], [6, 'C', 2, 14, '2, 4'], [7, 'N', 2, 15, '2, 5'],
  [8, 'O', 2, 16, '2, 6'], [9, 'F', 2, 17, '2, 7'], [10, 'Ne', 2, 18, '2, 8'], [11, 'Na', 3, 1, '2, 8, 1'],
  [12, 'Mg', 3, 2, '2, 8, 2'], [13, 'Al', 3, 13, '2, 8, 3'], [14, 'Si', 3, 14, '2, 8, 4'],
  [15, 'P', 3, 15, '2, 8, 5'], [16, 'S', 3, 16, '2, 8, 6'], [17, 'Cl', 3, 17, '2, 8, 7'],
  [18, 'Ar', 3, 18, '2, 8, 8'], [19, 'K', 4, 1, '2, 8, 8, 1'], [20, 'Ca', 4, 2, '2, 8, 8, 2'],
] as [number, string, number, number, string][]) {
  add(`cb_pt1_${Z}`, T.periodic, FW.structure, 'easy',
    [`某元素的原子序為 $${Z}$。其電子排布是甚麼？`, `An element has atomic number $${Z}$. What is its electronic arrangement?`],
    [n(`$${cfg}$`), n(`$${cfg.split(', ').reverse().join(', ')}$`), n(`$${Z}$`), n(`$2, ${Z - 2}$`)],
    [`中性原子的電子數等於原子序，即 $${Z}$ 個。由內層向外填充，每層上限依次為 2、8、8，得 $${cfg}$。由此可讀出：電子層數 $= ${per}$，即位於第 ${per} 週期；最外層電子數決定族數。陷阱：$${cfg.split(', ').reverse().join(', ')}$ 把次序倒轉；$${Z}$ 直接寫了總數而未分層；$2, ${Z - 2}$ 忽略了第二層 8 個的上限。`,
     `A neutral atom has as many electrons as its atomic number, that is $${Z}$. Filling from the inner shells outward with capacities 2, 8, 8 gives $${cfg}$. From this: the number of shells is ${per}, so the element lies in Period ${per}, and the outermost shell determines the group. Traps: $${cfg.split(', ').reverse().join(', ')}$ reverses the order; $${Z}$ gives the total without arranging it in shells; $2, ${Z - 2}$ ignores the eight-electron limit of the second shell.`])
}

// OR1 — 同系物通式代入：烷 CₙH₂ₙ₊₂、烯 CₙH₂ₙ、炔 CₙH₂ₙ₋₂
for (let c = 2; c <= 8; c++) {
  add(`cb_or1a_${c}`, T.organic, FW.carbon, 'easy',
    [`含 $${c}$ 個碳原子的烯烴，其分子式是甚麼？`, `What is the molecular formula of the alkene with $${c}$ carbon atoms?`],
    [n(`$\\mathrm{C_${c}H_{${2 * c}}}$`), n(`$\\mathrm{C_${c}H_{${2 * c + 2}}}$`), n(`$\\mathrm{C_${c}H_{${2 * c - 2}}}$`), n(`$\\mathrm{C_${c}H_${c}}$`)],
    [`烯烴含一個碳碳雙鍵，通式為 $\\mathrm{C_nH_{2n}}$。代入 $n = ${c}$ 得 $\\mathrm{C_${c}H_{${2 * c}}}$。陷阱：$\\mathrm{C_${c}H_{${2 * c + 2}}}$ 是同碳數的烷烴（通式 $\\mathrm{C_nH_{2n+2}}$）；$\\mathrm{C_${c}H_{${2 * c - 2}}}$ 是炔烴；$\\mathrm{C_${c}H_${c}}$ 誤把氫碳比當成 $1 : 1$。三個通式相差的氫數反映不飽和度：每多一個雙鍵或一個環，就少 2 個氫。`,
     `An alkene contains one carbon–carbon double bond and has the general formula $\\mathrm{C_nH_{2n}}$, so with $n = ${c}$ it is $\\mathrm{C_${c}H_{${2 * c}}}$. Traps: $\\mathrm{C_${c}H_{${2 * c + 2}}}$ is the alkane with the same carbon count ($\\mathrm{C_nH_{2n+2}}$); $\\mathrm{C_${c}H_{${2 * c - 2}}}$ is the alkyne; $\\mathrm{C_${c}H_${c}}$ assumes a $1 : 1$ ratio. The differences in hydrogen count reflect unsaturation: each extra double bond or ring costs two hydrogens.`])
  add(`cb_or1b_${c}`, T.organic, FW.carbon, 'medium',
    [`含 $${c}$ 個碳原子的飽和一元醇，其分子式是甚麼？`, `What is the molecular formula of the saturated alcohol with one hydroxyl group and $${c}$ carbon atoms?`],
    [n(`$\\mathrm{C_${c}H_{${2 * c + 2}}O}$`), n(`$\\mathrm{C_${c}H_{${2 * c}}O}$`), n(`$\\mathrm{C_${c}H_{${2 * c + 2}}}$`), n(`$\\mathrm{C_${c}H_{${2 * c + 1}}O_2}$`)],
    [`飽和一元醇可看成烷烴的一個氫被 $-\\mathrm{OH}$ 取代：$\\mathrm{C_nH_{2n+2}}$ 去掉一個 $\\mathrm{H}$ 再加上 $\\mathrm{OH}$，氫數不變而多一個氧，故通式為 $\\mathrm{C_nH_{2n+2}O}$。代入 $n = ${c}$ 得 $\\mathrm{C_${c}H_{${2 * c + 2}}O}$。陷阱：$\\mathrm{C_${c}H_{${2 * c}}O}$ 少算兩個氫；$\\mathrm{C_${c}H_{${2 * c + 2}}}$ 漏了氧；$\\mathrm{C_${c}H_{${2 * c + 1}}O_2}$ 多加一個氧。`,
     `A saturated alcohol with one hydroxyl group is an alkane with one hydrogen replaced by $-\\mathrm{OH}$: removing one $\\mathrm{H}$ from $\\mathrm{C_nH_{2n+2}}$ and adding $\\mathrm{OH}$ leaves the hydrogen count unchanged and adds one oxygen, giving $\\mathrm{C_nH_{2n+2}O}$. With $n = ${c}$ this is $\\mathrm{C_${c}H_{${2 * c + 2}}O}$. Traps: $\\mathrm{C_${c}H_{${2 * c}}O}$ is two hydrogens short; $\\mathrm{C_${c}H_{${2 * c + 2}}}$ omits the oxygen; $\\mathrm{C_${c}H_{${2 * c + 1}}O_2}$ adds an extra oxygen.`])
}

// ═══════════════════════════════════════════════════════════════════════════
// 化學第二批（2026-08-28）—— 四個「高階」課題各僅 10 條，全科最薄。
// 高階題以【兩步串連】為特徵：中間值與最終值都由公式算出，
// 干擾項模擬「停在第一步」或「第二步用錯關係」。
// ═══════════════════════════════════════════════════════════════════════════

// HQ1 — 先由質量求摩爾，再由方程式係數求生成物摩爾
// 係數比刻意【不取 1】：ratio = 1 時 out 等於 mol，干擾項「停在第一步」會與
// 正解相同，add() 會丟棄整組（實測 8 組只剩 1 組）。
for (const [m0, Mr, ratio, prod] of [[64, 32, 2, 'H_2O'], [128, 32, 2, 'H_2O'], [96, 32, 2, 'H_2O'], [56, 28, 2, 'NH_3'], [84, 28, 3, 'NH_3'], [100, 50, 2, 'SO_3'], [150, 50, 3, 'SO_3'], [80, 40, 2, 'MgO'], [120, 40, 3, 'MgO'], [90, 18, 2, 'H_2'], [54, 18, 3, 'H_2'], [200, 100, 2, 'CaO']] as [number, number, number, string][]) {
  const mol = m0 / Mr, out = mol * ratio
  if (!Number.isInteger(mol)) continue
  add(`cb_hq1_${m0}_${Mr}_${prod.replace(/[_{}]/g, '')}`, T.hellQuant, FW.quantReason, 'hard',
    [`$${m0}$ g 某反應物（$M_r = ${Mr}$）完全反應，按方程式每 $1$ mol 反應物生成 $${ratio}$ mol $\\mathrm{${prod}}$。可生成多少摩爾 $\\mathrm{${prod}}$？`,
     `$${m0}$ g of a reactant ($M_r = ${Mr}$) reacts completely; the equation gives $${ratio}$ mol of $\\mathrm{${prod}}$ per mol of reactant. How many moles of $\\mathrm{${prod}}$ form?`],
    [n(`$${out}$ mol`), n(`$${mol}$ mol`), n(`$${round(mol / ratio, 3)}$ mol`), n(`$${m0}$ mol`)],
    [`第一步由質量求摩爾：$n = \\dfrac{m}{M_r} = \\dfrac{${m0}}{${Mr}} = ${mol}$ mol。第二步按方程式係數比 $1 : ${ratio}$ 換算：生成 $${mol} \\times ${ratio} = ${out}$ mol。${ratio === 1 ? '本題係數比為 $1 : 1$，兩步的數值相同，但步驟不可省 —— 換一條方程式便不同。' : ''}陷阱：$${mol}$ mol 停在第一步；$${round(mol / ratio, 3)}$ mol 把係數比倒轉；$${m0}$ mol 把質量當成摩爾。`,
     `Step one converts mass to moles: $n = \\frac{m}{M_r} = \\frac{${m0}}{${Mr}} = ${mol}$ mol. Step two applies the coefficient ratio $1 : ${ratio}$: $${mol} \\times ${ratio} = ${out}$ mol.${ratio === 1 ? ' Here the ratio is $1 : 1$ so the two steps give the same number, but the step cannot be skipped — another equation would differ.' : ''} Traps: $${mol}$ mol stops at step one; $${round(mol / ratio, 3)}$ mol inverts the coefficient ratio; $${m0}$ mol treats mass as moles.`])
}

// HQ2 — 先由摩爾求體積（rtp），再求密度比較
for (const mol of [0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4]) {
  const V = mol * 24
  add(`cb_hq2_${String(mol).replace('.', '')}`, T.hellQuant, FW.quantReason, 'hard',
    [`在室溫及標準大氣壓下，$${mol}$ mol 任何氣體所佔的體積是多少？（莫耳體積 $= 24$ dm³ mol⁻¹）`,
     `At room temperature and pressure, what volume does $${mol}$ mol of any gas occupy? (molar volume $= 24$ dm³ mol⁻¹)`],
    [n(`$${V}$ dm³`), n(`$${round(mol / 24, 4)}$ dm³`), n(`$24$ dm³`), n(`$${mol}$ dm³`)],
    [`氣體體積 $= n \\times V_m = ${mol} \\times 24 = ${V}$ dm³。重點在於莫耳體積與氣體【種類無關】—— 同溫同壓下，$${mol}$ mol 氧氣與 $${mol}$ mol 氫氣佔同一體積，儘管兩者質量相差 16 倍。這就是亞佛加德羅定律，亦是氣體反應可以直接用體積比代替摩爾比的理由。陷阱：$${round(mol / 24, 4)}$ dm³ 用了除法；$24$ dm³ 直接抄了莫耳體積；$${mol}$ dm³ 把摩爾當成體積。`,
     `Gas volume is $n \\times V_m = ${mol} \\times 24 = ${V}$ dm³. The key point is that molar volume does not depend on the identity of the gas: at the same temperature and pressure, $${mol}$ mol of oxygen and $${mol}$ mol of hydrogen occupy the same volume despite a sixteenfold difference in mass. This is Avogadro's law, and it is why volume ratios can replace mole ratios in reactions between gases. Traps: $${round(mol / 24, 4)}$ dm³ divides; $24$ dm³ copies the molar volume; $${mol}$ dm³ treats moles as a volume.`])
}

// HR1 — 由氧化數變化求得失電子數
for (const [from, to, el] of [[7, 2, 'Mn'], [6, 3, 'Cr'], [5, 2, 'N'], [4, 2, 'S'], [3, 0, 'Fe'], [2, 0, 'Cu'], [0, 2, 'Zn'], [0, 3, 'Al'], [6, 4, 'S'], [5, 3, 'N']] as [number, number, string][]) {
  const change = Math.abs(to - from)
  const gained = to < from
  add(`cb_hr1_${el}_${from}_${to}`, T.hellRedox, FW.electron, 'hard',
    [`元素 $\\mathrm{${el}}$ 的氧化數由 $${from > 0 ? '+' : ''}${from}$ 變為 $${to > 0 ? '+' : ''}${to}$。該元素每個原子${gained ? '得到' : '失去'}多少個電子？它被氧化還是被還原？`,
     `The oxidation number of $\\mathrm{${el}}$ changes from $${from > 0 ? '+' : ''}${from}$ to $${to > 0 ? '+' : ''}${to}$. How many electrons does each atom ${gained ? 'gain' : 'lose'}, and is it oxidised or reduced?`],
    [[`${change} 個，被${gained ? '還原' : '氧化'}`, `${change}, ${gained ? 'reduced' : 'oxidised'}`],
     [`${change} 個，被${gained ? '氧化' : '還原'}`, `${change}, ${gained ? 'oxidised' : 'reduced'}`],
     [`${from + to} 個，被${gained ? '還原' : '氧化'}`, `${from + to}, ${gained ? 'reduced' : 'oxidised'}`],
     [`${change + 1} 個，被${gained ? '還原' : '氧化'}`, `${change + 1}, ${gained ? 'reduced' : 'oxidised'}`]],
    [`氧化數的變化量即得失電子數：$|${to} - (${from})| = ${change}$ 個。氧化數${gained ? '下降表示得到電子，即被還原' : '上升表示失去電子，即被氧化'}。記法：氧化數升＝失電子＝被氧化；氧化數降＝得電子＝被還原。陷阱：方向相反的一項把氧化與還原調轉，是本課最常見的錯誤；$${from + to}$ 個把兩個氧化數相加而非相減。`,
     `The change in oxidation number is the number of electrons transferred: $|${to} - (${from})| = ${change}$. A ${gained ? 'fall in oxidation number means electrons are gained, so the species is reduced' : 'rise in oxidation number means electrons are lost, so the species is oxidised'}. A useful phrasing: number up, electrons lost, oxidised; number down, electrons gained, reduced. Traps: the option with the opposite direction swaps oxidation and reduction, the commonest error here; ${from + to} adds the two oxidation numbers instead of subtracting.`])
}

// HO1 — 由分子式求不飽和度（環＋π鍵數）= (2C + 2 − H) / 2
for (const [C1, H1] of [[4, 8], [5, 10], [6, 12], [4, 6], [5, 8], [6, 10], [6, 6], [7, 8], [3, 4], [8, 10]] as [number, number][]) {
  const du = (2 * C1 + 2 - H1) / 2
  if (!Number.isInteger(du) || du < 0) continue
  add(`cb_ho1_${C1}_${H1}`, T.hellOrganic, FW.carbon, 'hard',
    [`分子式為 $\\mathrm{C_${C1}H_{${H1}}}$ 的烴，其不飽和度（環與雙鍵的總數）是多少？`,
     `A hydrocarbon has molecular formula $\\mathrm{C_${C1}H_{${H1}}}$. What is its degree of unsaturation (rings plus double bonds)?`],
    [n(`$${du}$`), n(`$${du + 1}$`), n(`$${C1 - du}$`), n(`$0$`)],
    [`不飽和度 $= \\dfrac{2C + 2 - H}{2} = \\dfrac{2(${C1}) + 2 - ${H1}}{2} = \\dfrac{${2 * C1 + 2 - H1}}{2} = ${du}$。它的意思是：相對於同碳數的飽和烷烴 $\\mathrm{C_${C1}H_{${2 * C1 + 2}}}$，本分子每少 2 個氫就多一個環或一個雙鍵（三鍵計作 2）。所以 $${du}$ 代表環與雙鍵合共 $${du}$ 個。陷阱：$${du + 1}$ 多計一個；$0$ 誤以為飽和；$${C1 - du}$ 用碳數相減。這個數字係推斷結構的第一步：知道不飽和度，就知道要畫幾多個環或雙鍵。`,
     `The degree of unsaturation is $\\frac{2C + 2 - H}{2} = \\frac{2(${C1}) + 2 - ${H1}}{2} = \\frac{${2 * C1 + 2 - H1}}{2} = ${du}$. It means that relative to the saturated alkane with the same carbon count, $\\mathrm{C_${C1}H_{${2 * C1 + 2}}}$, every two hydrogens short corresponds to one ring or one double bond, with a triple bond counting as two. So ${du} means rings and double bonds total ${du}. Traps: ${du + 1} counts one too many; 0 assumes saturation; ${C1 - du} subtracts from the carbon count. This figure is the first step in deducing a structure: knowing the unsaturation tells you how many rings or double bonds to draw.`])
}

// GV1 — 氣體反應體積比 = 摩爾比（同溫同壓）
for (const [va, ra, rb, ga, gb] of [[10, 1, 2, 'H_2', 'H_2O'], [20, 1, 2, 'H_2', 'H_2O'], [30, 1, 2, 'H_2', 'H_2O'], [10, 1, 3, 'N_2', 'NH_3'], [20, 1, 3, 'N_2', 'NH_3'], [15, 1, 2, 'O_2', 'SO_3'], [24, 2, 1, 'CO', 'CO_2'], [36, 2, 1, 'CO', 'CO_2']] as [number, number, number, string, string][]) {
  const vb = (va / ra) * rb
  if (!Number.isInteger(vb)) continue
  add(`cb_gv1_${va}_${ra}_${rb}_${ga.replace(/[_{}]/g, '')}`, T.gasVolume, FW.reaction, 'medium',
    [`某氣體反應中 $\\mathrm{${ga}}$ 與 $\\mathrm{${gb}}$ 的係數比為 $${ra} : ${rb}$。在同溫同壓下，$${va}$ cm³ 的 $\\mathrm{${ga}}$ 完全反應可生成多少 cm³ $\\mathrm{${gb}}$？`,
     `In a gas reaction the coefficients of $\\mathrm{${ga}}$ and $\\mathrm{${gb}}$ are in the ratio $${ra} : ${rb}$. At the same temperature and pressure, what volume of $\\mathrm{${gb}}$ forms from $${va}$ cm³ of $\\mathrm{${ga}}$?`],
    // 注意：va × ra × rb 在 ra = 1 時等於 vb，不可用作干擾項（實測 8 組全被丟棄）。
    [n(`$${vb}$ cm³`), n(`$${va}$ cm³`), n(`$${round(va * ra / rb, 1)}$ cm³`), n(`$${va * (ra + rb)}$ cm³`)],
    [`由亞佛加德羅定律，同溫同壓下氣體的體積比等於摩爾比，故可直接用係數比換算，毋須先求摩爾數：$${va} \\times \\dfrac{${rb}}{${ra}} = ${vb}$ cm³。陷阱：$${va}$ cm³ 以為體積不變；$${round(va * ra / rb, 1)}$ cm³ 把比例倒轉；$${va * (ra + rb)}$ cm³ 把兩個係數相加而非取比例。留意此捷徑【只適用於氣體】—— 固體與液體的體積與摩爾數並無這種簡單關係。`,
     `By Avogadro's law, gas volumes at the same temperature and pressure are in the same ratio as the moles, so the coefficients can be applied directly without converting to moles: $${va} \\times \\frac{${rb}}{${ra}} = ${vb}$ cm³. Traps: $${va}$ cm³ assumes the volume is unchanged; $${round(va * ra / rb, 1)}$ cm³ inverts the ratio; $${va * (ra + rb)}$ cm³ adds the coefficients instead of taking their ratio. Note that this shortcut applies only to gases — solids and liquids have no such simple relation between volume and moles.`])
}

// ═══════════════════════════════════════════════════════════════════════════
// 第三批母模板 —— 平均分佈補強（2026-08-28）
// ---------------------------------------------------------------------------
// 補強前實測化學 14 個課題：濃度 66、酸鹼 64，而化學式與式量僅 10 條、
// 氧化還原與平衡 16 條、有機化學（高階）17 條、週期表 23 條（平均目標 71）。
// 依指示先補題數最少者。
//
// 化學式一律用 \mathrm{}，不可用 \text{}：\text{} 會切換至文字模式，
// 令下標語法 _ 失效，KaTeX 直接拋出解析錯誤（2026-08-27 曾有 73 條中招）。
// ═══════════════════════════════════════════════════════════════════════════

// ── 化學式與式量 ──────────────────────────────────────────────────────────

// FM1 — 式量計算（二元化合物）
;([['NaCl', 23, 35.5, 1, 1], ['MgO', 24, 16, 1, 1], ['CaO', 40, 16, 1, 1], ['KBr', 39, 80, 1, 1],
  ['LiF', 7, 19, 1, 1], ['CaCl_2', 40, 35.5, 1, 2], ['MgCl_2', 24, 35.5, 1, 2], ['Na_2O', 23, 16, 2, 1],
  ['K_2O', 39, 16, 2, 1], ['AlF_3', 27, 19, 1, 3], ['FeCl_3', 56, 35.5, 1, 3], ['CuO', 64, 16, 1, 1],
  ['ZnO', 65, 16, 1, 1], ['BaCl_2', 137, 35.5, 1, 2], ['SrO', 88, 16, 1, 1], ['AgCl', 108, 35.5, 1, 1],
  ['PbO', 207, 16, 1, 1], ['Li_2O', 7, 16, 2, 1]] as [string, number, number, number, number][])
  .forEach(([f, ma, mb, ca, cb]) => {
    const mr = ma * ca + mb * cb
    add(`chemc_fm1_${f.replace(/[^A-Za-z0-9]/g, '')}`, T.formula, FW.calc, 'easy',
      [`求 $\\mathrm{${f}}$ 的式量。（相對原子質量按題中所給：${ma}、${mb}）`,
       `Find the formula mass of $\\mathrm{${f}}$, using the relative atomic masses ${ma} and ${mb} given.`],
      [n(`$${round(mr, 1)}$`), n(`$${round(ma + mb, 1)}$`), n(`$${round(ma * ca * mb * cb, 1)}$`), n(`$${round(mr - mb, 1)}$`)],
      [`式量為分子式中各原子相對原子質量之總和，下標代表該元素的原子數目，必須乘上：$${ma} \\times ${ca} + ${mb} \\times ${cb} = ${round(ma * ca, 1)} + ${round(mb * cb, 1)} = ${round(mr, 1)}$。陷阱：$${round(ma + mb, 1)}$ 忽略了下標，把每種原子當成只有一個；$${round(ma * ca * mb * cb, 1)}$ 把兩部分相乘而非相加；$${round(mr - mb, 1)}$ 少數了一個原子。`,
       `The formula mass is the sum of the relative atomic masses of every atom in the formula; the subscripts give how many atoms of each element and must be applied: $${ma} \\times ${ca} + ${mb} \\times ${cb} = ${round(ma * ca, 1)} + ${round(mb * cb, 1)} = ${round(mr, 1)}$. Traps: $${round(ma + mb, 1)}$ ignores the subscripts and counts one atom of each; $${round(ma * ca * mb * cb, 1)}$ multiplies the two parts instead of adding; $${round(mr - mb, 1)}$ counts one atom too few.`])
  })

// FM2 — 元素的質量百分比
;([['MgO', 24, 40], ['CaO', 40, 56], ['NaCl', 23, 58.5], ['CuO', 64, 80], ['ZnO', 65, 81],
  ['H_2O', 16, 18], ['CO_2', 12, 44], ['SO_2', 32, 64], ['CH_4', 12, 16], ['NH_3', 14, 17],
  ['FeO', 56, 72], ['Al_2O_3', 54, 102], ['SO_3', 32, 80], ['NO_2', 14, 46],
  ['PbO', 207, 223], ['AgCl', 108, 143.5]] as [string, number, number][])
  .forEach(([f, part, total]) => {
    const pct = (part / total) * 100
    add(`chemc_fm2_${f.replace(/[^A-Za-z0-9]/g, '')}`, T.formula, FW.calc, 'medium',
      [`$\\mathrm{${f}}$ 的式量為 ${total}，其中指定元素在化合物中的總質量為 ${part}。該元素的質量百分比是多少？`,
       `The formula mass of $\\mathrm{${f}}$ is ${total}, and the total mass of one specified element within it is ${part}. What is that element's percentage by mass?`],
      [n(`${round(pct, 1)}%`), n(`${round((total / part) * 100, 1)}%`), n(`${round(((total - part) / total) * 100, 1)}%`), n(`${round(part, 1)}%`)],
      [`質量百分比 = 該元素的總質量 ÷ 式量 × 100% = ${part} ÷ ${total} × 100% = ${round(pct, 1)}%。分子必須是該元素在【整條化學式】中的總質量，若元素出現多於一個原子便要先乘上原子數目。陷阱：${round((total / part) * 100, 1)}% 把分子分母倒轉；${round(((total - part) / total) * 100, 1)}% 算的是其餘元素的百分比；${round(part, 1)}% 把質量當成百分率。`,
       `Percentage by mass = total mass of the element ÷ formula mass × 100% = ${part} ÷ ${total} × 100% = ${round(pct, 1)}%. The numerator must be the element's total mass across the WHOLE formula, so an element appearing more than once must first be multiplied by its subscript. Traps: ${round((total / part) * 100, 1)}% inverts the fraction; ${round(((total - part) / total) * 100, 1)}% is the percentage of everything else; ${round(part, 1)}% reads a mass as a percentage.`])
  })

// ── 週期表 ────────────────────────────────────────────────────────────────

// PT2 — 由電子排布推出族數與週期
;([['Li', 3, '2, 1', 1, 2], ['Be', 4, '2, 2', 2, 2], ['B', 5, '2, 3', 13, 2], ['C', 6, '2, 4', 14, 2],
  ['N', 7, '2, 5', 15, 2], ['O', 8, '2, 6', 16, 2], ['F', 9, '2, 7', 17, 2], ['Ne', 10, '2, 8', 18, 2],
  ['Na', 11, '2, 8, 1', 1, 3], ['Mg', 12, '2, 8, 2', 2, 3], ['Al', 13, '2, 8, 3', 13, 3],
  ['Si', 14, '2, 8, 4', 14, 3], ['P', 15, '2, 8, 5', 15, 3], ['S', 16, '2, 8, 6', 16, 3],
  ['Cl', 17, '2, 8, 7', 17, 3], ['Ar', 18, '2, 8, 8', 18, 3], ['K', 19, '2, 8, 8, 1', 1, 4],
  ['Ca', 20, '2, 8, 8, 2', 2, 4]] as [string, number, string, number, number][])
  .forEach(([sym, z, cfg, group, period]) => {
    add(`chemc_pt2_${sym}`, T.periodic, FW.structure, 'medium',
      [`某元素的原子序為 ${z}，電子排布為 ${cfg}。該元素位於週期表的第幾週期？`,
       `An element has atomic number ${z} and electron arrangement ${cfg}. Which period of the periodic table does it belong to?`],
      [[`第 ${period} 週期`, `Period ${period}`], [`第 ${group} 週期`, `Period ${group}`],
       [`第 ${z} 週期`, `Period ${z}`], [`第 ${period + 1} 週期`, `Period ${period + 1}`]],
      [`週期數等於【已佔用電子殼層的數目】。電子排布 ${cfg} 共有 ${period} 層，故該元素位於第 ${period} 週期；而最外層電子數則決定族數。陷阱：第 ${group} 週期把族數當成週期數，兩者由不同的資料決定（族看最外層電子，週期看殼層數目）；第 ${z} 週期把原子序當成週期數；第 ${period + 1} 週期多數了一層。`,
       `The period number equals the NUMBER OF OCCUPIED ELECTRON SHELLS. The arrangement ${cfg} has ${period} shells, so the element lies in period ${period}; the number of outermost electrons determines the group instead. Traps: period ${group} confuses the group with the period, and the two come from different data (outer electrons versus shell count); period ${z} reads the atomic number as the period; period ${period + 1} counts one shell too many.`])
    add(`chemc_pt2g_${sym}`, T.periodic, FW.structure, 'easy',
      [`某元素的電子排布為 ${cfg}。該元素屬於週期表的哪一族？`,
       `An element has the electron arrangement ${cfg}. To which group of the periodic table does it belong?`],
      [[`第 ${group} 族`, `Group ${group}`], [`第 ${period} 族`, `Group ${period}`],
       [`第 ${z} 族`, `Group ${z}`], [`第 ${group === 18 ? 17 : group + 1} 族`, `Group ${group === 18 ? 17 : group + 1}`]],
      [`第 1、2 及 13 至 18 族的族數由最外層電子數決定：最外層有 1 至 2 個電子時，族數即該數目；有 3 至 8 個電子時，族數為該數目加 10。電子排布 ${cfg} 的最外層電子數對應第 ${group} 族。同族元素最外層電子數相同，化學性質因而相似 —— 這正是週期表按族排列的理由。陷阱：第 ${period} 族把週期數當成族數；第 ${z} 族用了原子序；第 ${group === 18 ? 17 : group + 1} 族數多或數少了一個電子。`,
       `For groups 1, 2 and 13 to 18 the group number follows from the outermost electrons: with 1 or 2 outer electrons the group is that number; with 3 to 8 it is that number plus 10. The arrangement ${cfg} therefore gives group ${group}. Elements in the same group share the same number of outer electrons and hence similar chemistry, which is precisely why the table is arranged this way. Traps: group ${period} uses the period number; group ${z} uses the atomic number; group ${group === 18 ? 17 : group + 1} miscounts the outer electrons by one.`])
  })

// ── 氧化還原 ──────────────────────────────────────────────────────────────

// RX2 — 由「氧化數總和 = 離子電荷」推算指定元素的氧化數
;([['Fe_2O_3', 'Fe', 2, 3, 0], ['SO_2', 'S', 1, 2, 0], ['SO_3', 'S', 1, 3, 0], ['N_2O_5', 'N', 2, 5, 0],
  ['P_2O_5', 'P', 2, 5, 0], ['Cl_2O_7', 'Cl', 2, 7, 0], ['MnO_4^{-}', 'Mn', 1, 4, -1],
  ['Cr_2O_7^{2-}', 'Cr', 2, 7, -2], ['SO_4^{2-}', 'S', 1, 4, -2], ['NO_3^{-}', 'N', 1, 3, -1],
  ['CO_3^{2-}', 'C', 1, 3, -2], ['ClO_3^{-}', 'Cl', 1, 3, -1], ['ClO^{-}', 'Cl', 1, 1, -1],
  ['MnO_2', 'Mn', 1, 2, 0], ['Cu_2O', 'Cu', 2, 1, 0], ['Al_2O_3', 'Al', 2, 3, 0],
  ['PbO_2', 'Pb', 1, 2, 0], ['V_2O_5', 'V', 2, 5, 0], ['CrO_4^{2-}', 'Cr', 1, 4, -2],
  ['NO_2^{-}', 'N', 1, 2, -1]] as [string, string, number, number, number][])
  .forEach(([f, sym, cx, nO, charge]) => {
    const ox = (charge + 2 * nO) / cx
    if (!Number.isInteger(ox)) return
    add(`chemc_rx2_${sym}_${nO}_${charge < 0 ? `m${-charge}` : charge}`, T.redox, FW.electron, 'medium',
      [`求 $\\mathrm{${f}}$ 中 ${sym} 的氧化數。`, `Find the oxidation number of ${sym} in $\\mathrm{${f}}$.`],
      [n(`$+${ox}$`), n(`$-${ox}$`), n(`$+${nO}$`), n(`$+${2 * nO}$`)],
      [`氧在化合物中的氧化數通常為 $-2$，而全部原子的氧化數總和必須等於該粒子的電荷（${charge === 0 ? '中性化合物為 0' : `此離子為 ${charge}`}）。設 ${sym} 的氧化數為 $x$：$${cx === 1 ? '' : cx}x + ${nO}(-2) = ${charge}$，解得 $x = +${ox}$。陷阱：$-${ox}$ 符號寫反；$+${nO}$ 直接抄了氧原子數目；$+${2 * nO}$ 忘記除以 ${sym} 的原子數 ${cx}。`,
       `Oxygen is normally $-2$ in compounds, and the oxidation numbers of all atoms must sum to the charge on the species (${charge === 0 ? '0 for a neutral compound' : `${charge} for this ion`}). Letting $x$ be the oxidation number of ${sym}: $${cx === 1 ? '' : cx}x + ${nO}(-2) = ${charge}$, so $x = +${ox}$. Traps: $-${ox}$ has the wrong sign; $+${nO}$ copies the number of oxygen atoms; $+${2 * nO}$ omits the division by the ${cx} ${sym} atoms.`])
  })

// ── 化學鍵 ────────────────────────────────────────────────────────────────

// BD2 — 由離子電荷推出離子化合物的化學式
// 只取兩個電荷數【不相等】的組合：相等時交叉法的結果與「不交叉」「忽略電荷」
// 三者會化簡成同一條化學式，四個選項不再相異，整組參數會被丟棄。
;([['Mg', 2, 'Cl', 1], ['Al', 3, 'Cl', 1], ['Na', 1, 'O', 2], ['Al', 3, 'O', 2], ['Ca', 2, 'F', 1],
  ['K', 1, 'S', 2], ['Ca', 2, 'N', 3], ['Mg', 2, 'N', 3], ['Li', 1, 'N', 3], ['Ba', 2, 'Br', 1],
  ['Al', 3, 'S', 2], ['Li', 1, 'O', 2], ['Na', 1, 'S', 2], ['K', 1, 'N', 3],
  ['Ca', 2, 'Cl', 1], ['Sr', 2, 'Cl', 1], ['Fe', 3, 'O', 2], ['Fe', 3, 'Cl', 1], ['Cu', 2, 'Cl', 1],
  ['Cu', 2, 'N', 3], ['Ag', 1, 'O', 2], ['Zn', 2, 'Cl', 1], ['Ba', 2, 'N', 3],
  ['Al', 3, 'Br', 1], ['Mg', 2, 'Br', 1]] as [string, number, string, number][])
  .forEach(([cat, cv, an, av]) => {
    const g = gcd(cv, av)
    const nc = av / g, na = cv / g
    const sub = (k: number) => (k === 1 ? '' : `_${k}`)
    const ans = `\\mathrm{${cat}${sub(nc)}${an}${sub(na)}}`
    add(`chemc_bd2_${cat}${cv}${an}${av}`, T.bonding, FW.structure, 'medium',
      [`${cat} 形成 $${cv}+$ 的陽離子，${an} 形成 $${av}-$ 的陰離子。兩者形成的離子化合物的化學式是甚麼？`,
       `${cat} forms a $${cv}+$ cation and ${an} forms an $${av}-$ anion. What is the formula of the ionic compound they form?`],
      [n(`$${ans}$`), n(`$\\mathrm{${cat}${sub(na)}${an}${sub(nc)}}$`), n(`$\\mathrm{${cat}${an}}$`), n(`$\\mathrm{${cat}${an}${sub(cv + av)}}$`)],
      [`離子化合物整體必須電中性，故正電荷總量要等於負電荷總量。$${cv}$ 與 $${av}$ 的最小公倍數為 ${(cv * av) / g}，需要 ${nc} 個 ${cat} 離子與 ${na} 個 ${an} 離子，化學式為 $${ans}$。留意下標是【對方】的電荷數再約簡，這就是交叉法。陷阱：把兩個下標對調；$\\mathrm{${cat}${an}}$ 忽略了電荷不相等；$\\mathrm{${cat}${an}${sub(cv + av)}}$ 把兩個電荷數相加當成下標。`,
       `An ionic compound must be electrically neutral, so the total positive charge equals the total negative charge. The lowest common multiple of $${cv}$ and $${av}$ is ${(cv * av) / g}, requiring ${nc} ${cat} ions and ${na} ${an} ions, giving $${ans}$. Note that each subscript comes from the OTHER ion's charge, after cancelling — this is the crossover rule. Traps: the two subscripts are interchanged; $\\mathrm{${cat}${an}}$ ignores the unequal charges; $\\mathrm{${cat}${an}${sub(cv + av)}}$ adds the two charges and uses the sum as a subscript.`])
  })

// ── 氣體體積 ──────────────────────────────────────────────────────────────

// GV2 — 摩爾體積換算（室溫及壓力下 24.0 dm³ mol⁻¹）
for (const mol of [0.5, 1, 1.5, 2, 2.5, 3, 4, 5]) {
  for (const mv of [24]) {
    const vol = mol * mv
    add(`chemc_gv2_${String(mol).replace('.', 'p')}`, T.gasVolume, FW.quantity, 'easy',
      [`在室溫及壓力下，${mol} mol 氣體所佔的體積是多少？（氣體摩爾體積為 ${mv}.0 dm³ mol⁻¹）`,
       `At room temperature and pressure, what volume is occupied by ${mol} mol of a gas? (Molar volume ${mv}.0 dm³ mol⁻¹.)`],
      [n(`${round(vol, 1)} dm³`), n(`${round(mol / mv, 4)} dm³`), n(`${round(mv, 1)} dm³`), n(`${round(mol, 2)} dm³`)],
      [`體積 = 摩爾數 × 氣體摩爾體積 = ${mol} × ${mv} = ${round(vol, 1)} dm³。氣體摩爾體積與氣體的種類無關 —— 相同溫度壓力下，等摩爾數的任何氣體佔相同體積（亞佛加德羅定律）。陷阱：${round(mol / mv, 4)} dm³ 改成了相除；${round(mv, 1)} dm³ 漏了乘摩爾數；${round(mol, 2)} dm³ 只抄了摩爾數。`,
       `Volume = amount in moles × molar volume = ${mol} × ${mv} = ${round(vol, 1)} dm³. The molar volume does not depend on the identity of the gas: at the same temperature and pressure equal amounts of any gas occupy equal volumes (Avogadro's law). Traps: ${round(mol / mv, 4)} dm³ divides instead; ${round(mv, 1)} dm³ omits the amount; ${round(mol, 2)} dm³ copies the amount.`])
  }
}

// ── 有機化學 ──────────────────────────────────────────────────────────────

// OR2 — 烷烴完全燃燒所需的氧氣（取碳數為單數，使係數為整數）
for (const nc of [1, 3, 5, 7, 9, 11]) {
  const o2 = (3 * nc + 1) / 2
  add(`chemc_or2_${nc}`, T.organic, FW.carbon, 'hard',
    [`1 mol 烷烴 $\\mathrm{C_{${nc}}H_{${2 * nc + 2}}}$ 完全燃燒，需要多少 mol 氧氣？`,
     `How many moles of oxygen are required for the complete combustion of 1 mol of the alkane $\\mathrm{C_{${nc}}H_{${2 * nc + 2}}}$?`],
    [n(`$${o2}$`), n(`$${nc}$`), n(`$${nc + 1}$`), n(`$${3 * nc + 1}$`)],
    [`完全燃燒的產物為 $\\mathrm{CO_2}$ 與 $\\mathrm{H_2O}$：$\\mathrm{C_{${nc}}H_{${2 * nc + 2}}} + ${o2}\\,\\mathrm{O_2} \\rightarrow ${nc}\\,\\mathrm{CO_2} + ${nc + 1}\\,\\mathrm{H_2O}$。氧原子數目：右方共 $2 \\times ${nc} + ${nc + 1} = ${2 * nc + nc + 1}$ 個，除以 2 得 $${o2}$ mol $\\mathrm{O_2}$。陷阱：$${nc}$ 是 $\\mathrm{CO_2}$ 的摩爾數；$${nc + 1}$ 是 $\\mathrm{H_2O}$ 的摩爾數；$${3 * nc + 1}$ 是氧【原子】數而非氧【分子】數，忘記除以 2。`,
     `Complete combustion gives $\\mathrm{CO_2}$ and $\\mathrm{H_2O}$: $\\mathrm{C_{${nc}}H_{${2 * nc + 2}}} + ${o2}\\,\\mathrm{O_2} \\rightarrow ${nc}\\,\\mathrm{CO_2} + ${nc + 1}\\,\\mathrm{H_2O}$. Counting oxygen atoms on the right gives $2 \\times ${nc} + ${nc + 1} = ${2 * nc + nc + 1}$, and dividing by 2 gives $${o2}$ mol of $\\mathrm{O_2}$. Traps: $${nc}$ is the amount of $\\mathrm{CO_2}$; $${nc + 1}$ is the amount of $\\mathrm{H_2O}$; $${3 * nc + 1}$ counts oxygen ATOMS rather than molecules and omits the division by 2.`])
}

// ── 定量計算（高階）──────────────────────────────────────────────────────

// HQ2 — 產率百分比 = 實際產量 ÷ 理論產量 × 100%
for (const theo of [20, 25, 40, 50, 80, 100]) {
  for (const pct of [40, 60, 75, 80, 90]) {
    const act = (theo * pct) / 100
    if (!Number.isInteger(act * 10)) continue
    add(`chemc_hq2_${theo}_${pct}`, T.hellQuant, FW.quantReason, 'medium',
      [`某反應的理論產量為 ${theo} g，實際得到 ${round(act, 1)} g 產物。產率百分比是多少？`,
       `A reaction has a theoretical yield of ${theo} g and actually produces ${round(act, 1)} g. What is the percentage yield?`],
      [n(`${pct}%`), n(`${round((theo / act) * 100, 1)}%`), n(`${round(((theo - act) / theo) * 100, 1)}%`), n(`${round(act, 1)}%`)],
      [`產率百分比 = 實際產量 ÷ 理論產量 × 100% = ${round(act, 1)} ÷ ${theo} × 100% = ${pct}%。理論產量由限量反應物按化學計量算出，實際產量必然不高於它；產率低於 100% 的常見原因包括副反應、可逆反應未完全進行，以及過濾與轉移時的損耗。陷阱：${round((theo / act) * 100, 1)}% 把分子分母倒轉，會得出大於 100% 的荒謬結果；${round(((theo - act) / theo) * 100, 1)}% 算的是損失率；${round(act, 1)}% 把質量當成百分率。`,
       `Percentage yield = actual yield ÷ theoretical yield × 100% = ${round(act, 1)} ÷ ${theo} × 100% = ${pct}%. The theoretical yield follows from the limiting reactant by stoichiometry, and the actual yield can never exceed it; yields fall below 100% because of side reactions, incomplete reversible reactions, and losses during filtration and transfer. Traps: ${round((theo / act) * 100, 1)}% inverts the fraction and gives an impossible value above 100%; ${round(((theo - act) / theo) * 100, 1)}% is the loss; ${round(act, 1)}% reads a mass as a percentage.`])
  }
}

export const chemistryBankQuestions: Question[] = bank

// ── 課題登記（2026-07-28 稽核修正）──────────────────────────────────────────
// 本題庫所用的 topic id 從未登記於科目的 *Topics 清單，令相關試題雖然存在於
// 題庫，學生卻無法經課題入口（/practice?topic=、/subjects 課題標籤、/notes）
// 篩選得到。現依 *-hell.ts 的既有慣例，由題庫自行匯出課題，再於科目檔案
// push 併入：T/FW 已在上方定義，毋須兩處重複維護，日後新增題目族亦自動登記。
// `count` 於 getSubjectTopics() 讀取時按真實題數計算，此處填 0 僅作佔位
// （見 types.ts 的說明）。
export const chemistryBankTopics: Topic[] = topicList([
  { topic: T.formula, fw: FW.calc, count: 0 },
  { topic: T.concentration, fw: FW.calc, count: 0 },
  { topic: T.gas, fw: FW.reaction, count: 0 },
  { topic: T.stoichiometry, fw: FW.reaction, count: 0 },
])
