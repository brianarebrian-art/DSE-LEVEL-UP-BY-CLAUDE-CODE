import type { Question } from './types'
import { createBank, n, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// ECONOMICS — PARAMETRIC BANK (Mode A, correct-by-construction; NUMERIC items)
// Only the quantitative slice of DSE Econ (elasticity, revenue, cost, multiplier,
// GDP, surplus). Conceptual/essay Econ is Mode B (deferred). Plain-number word
// problems (no LaTeX) — distractors model named arithmetic/economic errors.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  elasticity: { id: 'elasticity', zh: '彈性', en: 'Elasticity' },
  demandSupply: { id: 'demand_supply', zh: '需求與供給', en: 'Demand & Supply' },
  firm: { id: 'firm_production', zh: '廠商與生產', en: 'Firm & Production' },
  macro: { id: 'macroeconomics', zh: '宏觀經濟', en: 'Macroeconomics' },
  market: { id: 'market', zh: '市場效率', en: 'Market Efficiency' },
} satisfies Record<string, TopicMeta>

const FW = {
  quant: { id: 'quantitative', zh: '量化分析', en: 'Quantitative Analysis', emoji: '📊' },
  macro: { id: 'macro_modelling', zh: '宏觀建模', en: 'Macro Modelling', emoji: '🏦' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('economics')

// ── 補底 (easy) ──────────────────────────────────────────────────────────────

// E1 — total revenue TR = P × Q
for (const P of [5, 8, 10, 12, 15, 20]) {
  for (const Q of [20, 30, 50, 100]) {
    add(`ec_e1_${P}_${Q}`, T.demandSupply, FW.quant, 'easy',
      [`某商品價格 ${P} 元，銷量 ${Q} 件，求總收入。`, `A good sells at $${P} each, quantity ${Q}. Find total revenue.`],
      [n(`${P * Q} 元`), n(`${P + Q} 元`), n(`${P * Q + P} 元`), n(`${Q - P} 元`)],
      [`總收入 = 價格 × 銷量 = ${P} × ${Q} = ${P * Q} 元。陷阱：${P + Q} 元係相加（唔係相乘）。`,
       `TR = P × Q = ${P * Q}. Trap: ${P + Q} adds instead of multiplying.`])
  }
}

// E2 — percentage change: (new − old)/old × 100%
;([[100, 120], [50, 60], [80, 100], [200, 250], [40, 50], [150, 180], [25, 30], [60, 75]] as const)
  .forEach(([a, b], i) => {
    const pct = round(((b - a) / a) * 100, 1)
    add(`ec_e2_${i}`, T.demandSupply, FW.quant, 'easy',
      [`價格由 ${a} 元升至 ${b} 元，求價格變幅（百分比）。`, `Price rises from $${a} to $${b}. Find the percentage change.`],
      [n(`+${pct}%`), n(`+${round(((b - a) / b) * 100, 1)}%`), n(`+${b - a}%`), n(`+${round((b / a) * 100, 1)}%`)],
      [`變幅 = (新－舊)/舊 × 100% = (${b}−${a})/${a} × 100% = ${pct}%。陷阱：除以新價得 ${round(((b - a) / b) * 100, 1)}%（分母錯）。`,
       `Change = (new−old)/old × 100% = ${pct}%. Trap: dividing by the new price is wrong.`])
  })

// E3 — average cost AC = TC / Q
for (const Q of [4, 5, 8, 10, 20]) {
  for (const ac of [3, 6, 9, 12]) {
    const TC = Q * ac
    add(`ec_e3_${Q}_${ac}`, T.firm, FW.quant, 'easy',
      [`總成本 ${TC} 元，產量 ${Q} 單位，求平均成本。`, `Total cost $${TC}, output ${Q} units. Find average cost.`],
      [n(`${ac} 元`), n(`${TC * Q} 元`), n(`${round(Q / TC, 2)} 元`), n(`${TC - Q} 元`)],
      [`平均成本 = 總成本 / 產量 = ${TC} / ${Q} = ${ac} 元。陷阱：${round(Q / TC, 2)} 元上下倒轉。`,
       `AC = TC/Q = ${ac}. Trap: ${round(Q / TC, 2)} inverts the ratio.`])
  }
}

// ── 普通 (medium) ────────────────────────────────────────────────────────────

// M1 — price elasticity of demand (magnitude): |%ΔQ / %ΔP|
;([[-20, 10], [-30, 10], [-15, 5], [-40, 20], [-10, 5], [-24, 8], [-18, 6], [-50, 25], [-12, 4], [-9, 3]] as const)
  .forEach(([dQ, dP], i) => {
    const ped = round(Math.abs(dQ / dP), 2)
    add(`ec_m1_${i}`, T.elasticity, FW.quant, 'medium',
      [`價格上升 ${dP}%，需求量下降 ${-dQ}%，求需求價格彈性（絕對值）。`,
       `Price rises ${dP}%, quantity demanded falls ${-dQ}%. Find |PED|.`],
      [n(`${ped}`), n(`${round(Math.abs(dP / dQ), 2)}`), n(`${Math.abs(dQ) + dP}`), n(`${Math.abs(dQ) - dP}`)],
      [`|PED| = |%ΔQ / %ΔP| = |${dQ}% / ${dP}%| = ${ped}。陷阱：${round(Math.abs(dP / dQ), 2)} 將分子分母倒轉。`,
       `|PED| = |%ΔQ / %ΔP| = ${ped}. Trap: ${round(Math.abs(dP / dQ), 2)} inverts numerator and denominator.`])
  })

// M2 — spending multiplier = 1/(1 − MPC)
;([[0.8, 5], [0.75, 4], [0.9, 10], [0.6, 2.5], [0.5, 2], [0.667, 3]] as const)
  .forEach(([mpc, mult], i) => {
    add(`ec_m2_${i}`, T.macro, FW.macro, 'medium',
      [`邊際消費傾向 (MPC) = ${mpc}，求支出乘數。`, `MPC = ${mpc}. Find the spending multiplier.`],
      [n(`${mult}`), n(`${round(1 / mpc, 2)}`), n(`${round(mpc, 2)}`), n(`${round(1 - mpc, 2)}`)],
      [`支出乘數 = 1 / (1 − MPC) = 1 / (1 − ${mpc}) = 1 / ${round(1 - mpc, 3)} = ${mult}。陷阱：${round(1 / mpc, 2)} 用咗 1/MPC；${round(1 - mpc, 2)} 只計咗 MPS。`,
       `Multiplier = 1/(1−MPC) = ${mult}. Trap: ${round(1 / mpc, 2)} uses 1/MPC; ${round(1 - mpc, 2)} is only the MPS.`])
  })

// M3 — economic profit = TR − TC
for (const TR of [100, 150, 200, 250, 300]) {
  for (const TC of [60, 90, 120, 180]) {
    if (TR === TC) continue
    add(`ec_m3_${TR}_${TC}`, T.firm, FW.quant, 'medium',
      [`總收入 ${TR} 元，總成本 ${TC} 元，求利潤。`, `Total revenue $${TR}, total cost $${TC}. Find profit.`],
      [n(`${TR - TC} 元`), n(`${TR + TC} 元`), n(`${round(TR / TC, 2)} 元`), n(`${TC - TR} 元`)],
      [`利潤 = 總收入 − 總成本 = ${TR} − ${TC} = ${TR - TC} 元。陷阱：${TR + TC} 元加咗；${TC - TR} 元符號反。`,
       `Profit = TR − TC = ${TR - TC}. Trap: ${TC - TR} has the sign reversed.`])
  }
}

// M4 — GDP by expenditure: Y = C + I + G + (X − M)
;([[400, 100, 150, 80, 50], [500, 120, 200, 100, 60], [300, 80, 100, 60, 40], [600, 150, 250, 120, 90], [450, 90, 180, 70, 50]] as const)
  .forEach(([C, I, G, X, M], i) => {
    const Y = C + I + G + (X - M)
    add(`ec_m4_${i}`, T.macro, FW.macro, 'medium',
      [`已知 C=${C}、I=${I}、G=${G}、出口 X=${X}、進口 M=${M}（億元），求 GDP。`,
       `Given C=${C}, I=${I}, G=${G}, exports X=${X}, imports M=${M}. Find GDP.`],
      [n(`${Y} 億元`), n(`${C + I + G + X + M} 億元`), n(`${C + I + G} 億元`), n(`${C + I + G + (M - X)} 億元`)],
      [`GDP = C + I + G + (X − M) = ${C}+${I}+${G}+(${X}−${M}) = ${Y} 億元。陷阱：${C + I + G + X + M} 億元加埋咗進口（應該減）。`,
       `GDP = C+I+G+(X−M) = ${Y}. Trap: adding imports instead of subtracting gives ${C + I + G + X + M}.`])
  })

// ── 拔尖 (hard) ──────────────────────────────────────────────────────────────

// H1 — PED from two points (compute both % changes, then the ratio)
;([[10, 8, 100, 140], [20, 15, 50, 80], [10, 9, 200, 240], [8, 6, 100, 150], [15, 12, 40, 60], [10, 7, 100, 160], [12, 9, 80, 120], [20, 16, 50, 70]] as const)
  .forEach(([P1, P2, Q1, Q2], i) => {
    const pctQ = ((Q2 - Q1) / Q1) * 100
    const pctP = ((P2 - P1) / P1) * 100
    const pedNum = Math.abs(pctQ / pctP)
    const ped = round(pedNum, 2)
    add(`ec_h1_${i}`, T.elasticity, FW.quant, 'hard',
      [`價格由 ${P1} 元降至 ${P2} 元，需求量由 ${Q1} 升至 ${Q2}。求需求價格彈性（絕對值，用原點百分比法）。`,
       `Price falls from $${P1} to $${P2}; quantity rises from ${Q1} to ${Q2}. Find |PED| (using base-value % method).`],
      [n(`${ped}`), n(`${round(Math.abs(pctP / pctQ), 2)}`), n(`${round(Math.abs((Q2 - Q1) / (P2 - P1)), 2)}`), n(`${round(pedNum * 2, 2)}`)],
      [`%ΔQ = (${Q2}−${Q1})/${Q1} = ${round(pctQ, 1)}%；%ΔP = (${P2}−${P1})/${P1} = ${round(pctP, 1)}%。|PED| = |${round(pctQ, 1)} / ${round(pctP, 1)}| = ${ped}。陷阱：${round(Math.abs((Q2 - Q1) / (P2 - P1)), 2)} 用咗絕對變化（唔係百分比）。`,
       `%ΔQ=${round(pctQ, 1)}%, %ΔP=${round(pctP, 1)}% ⇒ |PED|=${ped}. Trap: using raw changes gives ${round(Math.abs((Q2 - Q1) / (P2 - P1)), 2)}.`])
  })

// H2 — change in GDP = multiplier × change in autonomous spending
;([[0.8, 20], [0.75, 40], [0.9, 10], [0.6, 30], [0.8, 50], [0.75, 20], [0.9, 25], [0.6, 40]] as const)
  .forEach(([mpc, dSpend], i) => {
    const mult = 1 / (1 - mpc)
    const dGDP = round(mult * dSpend, 1)
    add(`ec_h2_${i}`, T.macro, FW.macro, 'hard',
      [`MPC = ${mpc}，政府開支增加 ${dSpend} 億元，求 GDP 最終變化。`,
       `MPC = ${mpc}; government spending rises by ${dSpend}. Find the final change in GDP.`],
      [n(`${dGDP} 億元`), n(`${dSpend} 億元`), n(`${round(dSpend / (1 - mpc) / 10, 2)} 億元`), n(`${round(dSpend * mpc, 1)} 億元`)],
      [`乘數 = 1/(1−${mpc}) = ${round(mult, 2)}，ΔGDP = 乘數 × Δ開支 = ${round(mult, 2)} × ${dSpend} = ${dGDP} 億元。陷阱：${dSpend} 億元漏咗乘數效應。`,
       `Multiplier = ${round(mult, 2)}, ΔGDP = ${dGDP}. Trap: ${dSpend} ignores the multiplier effect.`])
  })

// H3 — consumer surplus = ½ × Q × (P_max − P) for a linear demand
;([[10, 4, 30], [12, 6, 40], [8, 2, 50], [15, 5, 20], [20, 10, 30], [10, 6, 25], [14, 8, 40], [9, 3, 60]] as const)
  .forEach(([pmax, price, Q], i) => {
    const cs = round(0.5 * Q * (pmax - price), 1)
    add(`ec_h3_${i}`, T.market, FW.quant, 'hard',
      [`線性需求下，最高願付價 ${pmax} 元，市價 ${price} 元，成交量 ${Q}。求消費者剩餘。`,
       `Linear demand: max willingness-to-pay $${pmax}, market price $${price}, quantity ${Q}. Find consumer surplus.`],
      [n(`${cs} 元`), n(`${(pmax - price) * Q} 元`), n(`${round(0.5 * Q * pmax, 1)} 元`), n(`${(pmax - price)} 元`)],
      [`消費者剩餘 = ½ × 成交量 × (最高願付價 − 市價) = ½ × ${Q} × (${pmax}−${price}) = ${cs} 元。陷阱：${(pmax - price) * Q} 元漏咗 ½（當成長方形）。`,
       `CS = ½ × Q × (Pmax − P) = ${cs}. Trap: ${(pmax - price) * Q} drops the ½ (treats it as a rectangle).`])
  })

export const economicsBankQuestions: Question[] = bank
