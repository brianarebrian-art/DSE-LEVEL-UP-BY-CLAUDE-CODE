import type { Question } from './types'
import { createBank, n, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// BAFS — PARAMETRIC BANK (Mode A, correct-by-construction; NUMERIC items)
// Quantitative slice of 企業、會計與財務概論: profit, ratios, depreciation,
// interest, break-even. Conceptual BAFS is Mode B (deferred). Plain-number
// items; distractors model named accounting/finance errors.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  statements: { id: 'financial_statements', zh: '財務報表', en: 'Financial Statements' },
  ratios: { id: 'ratios', zh: '財務比率', en: 'Financial Ratios' },
  depreciation: { id: 'depreciation', zh: '折舊', en: 'Depreciation' },
  costing: { id: 'costing', zh: '成本與定價', en: 'Costing & Pricing' },
  interest: { id: 'interest', zh: '利息', en: 'Interest' },
} satisfies Record<string, TopicMeta>

const FW = {
  acct: { id: 'accounting', zh: '會計', en: 'Accounting', emoji: '📒' },
  finance: { id: 'finance', zh: '財務', en: 'Finance', emoji: '💰' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('bafs')

// ── 補底 (easy) ──────────────────────────────────────────────────────────────

// E1 — gross profit = sales − cost of goods sold
for (const sales of [100, 150, 200, 250, 300]) {
  for (const cogs of [60, 90, 120]) {
    add(`bf_e1_${sales}_${cogs}`, T.statements, FW.acct, 'easy',
      [`銷貨 ${sales} 元，銷貨成本 ${cogs} 元，求毛利。`, `Sales $${sales}, cost of goods sold $${cogs}. Find gross profit.`],
      [n(`${sales - cogs} 元`), n(`${sales + cogs} 元`), n(`${cogs - sales} 元`), n(`${round(sales / cogs, 2)} 元`)],
      [`毛利 = 銷貨 − 銷貨成本 = ${sales} − ${cogs} = ${sales - cogs} 元。陷阱：${sales + cogs} 元加了；${cogs - sales} 元符號反。`,
       `Gross profit = sales − COGS = ${sales - cogs}. Trap: ${sales + cogs} adds instead.`])
  }
}

// E2 — working capital = current assets − current liabilities
for (const ca of [80, 120, 160, 200]) {
  for (const cl of [40, 60, 100]) {
    add(`bf_e2_${ca}_${cl}`, T.ratios, FW.acct, 'easy',
      [`流動資產 ${ca} 元，流動負債 ${cl} 元，求營運資金。`, `Current assets $${ca}, current liabilities $${cl}. Find working capital.`],
      [n(`${ca - cl} 元`), n(`${ca + cl} 元`), n(`${round(ca / cl, 2)}`), n(`${cl - ca} 元`)],
      [`營運資金 = 流動資產 − 流動負債 = ${ca} − ${cl} = ${ca - cl} 元。陷阱：${round(ca / cl, 2)} 是流動比率（並非營運資金）。`,
       `Working capital = CA − CL = ${ca - cl}. Trap: ${round(ca / cl, 2)} is the current ratio, not working capital.`])
  }
}

// E3 — net profit = gross profit − expenses
for (const gp of [100, 150, 200, 250]) {
  for (const exp of [30, 50, 80]) {
    add(`bf_e3_${gp}_${exp}`, T.statements, FW.acct, 'easy',
      [`毛利 ${gp} 元，營業費用 ${exp} 元，求淨利。`, `Gross profit $${gp}, expenses $${exp}. Find net profit.`],
      [n(`${gp - exp} 元`), n(`${gp + exp} 元`), n(`${exp - gp} 元`), n(`${round(gp / exp, 2)} 元`)],
      [`淨利 = 毛利 − 費用 = ${gp} − ${exp} = ${gp - exp} 元。陷阱：${gp + exp} 元加了費用（應該減）。`,
       `Net profit = gross profit − expenses = ${gp - exp}. Trap: ${gp + exp} adds expenses.`])
  }
}

// ── 普通 (medium) ────────────────────────────────────────────────────────────

// M1 — gross profit margin = gross profit / sales × 100%
;([[200, 50], [400, 100], [500, 200], [300, 90], [250, 100], [800, 200], [1000, 350], [600, 150]] as const)
  .forEach(([sales, gp], i) => {
    const margin = round((gp / sales) * 100, 1)
    add(`bf_m1_${i}`, T.ratios, FW.acct, 'medium',
      [`銷貨 ${sales} 元，毛利 ${gp} 元，求毛利率（%）。`, `Sales $${sales}, gross profit $${gp}. Find the gross profit margin (%).`],
      [n(`${margin}%`), n(`${round((sales / gp) * 100, 1)}%`), n(`${round(gp / sales, 2)}%`), n(`${round(((sales - gp) / sales) * 100, 1)}%`)],
      [`毛利率 = 毛利 / 銷貨 × 100% = ${gp}/${sales} × 100% = ${margin}%。陷阱：${round(((sales - gp) / sales) * 100, 1)}% 是成本率；${round((sales / gp) * 100, 1)}% 分子分母倒轉。`,
       `Margin = GP/sales × 100% = ${margin}%. Trap: inverting gives ${round((sales / gp) * 100, 1)}%.`])
  })

// M2 — straight-line depreciation = (cost − residual) / useful life
;([[10000, 1000, 3], [12000, 2000, 5], [8000, 800, 4], [20000, 5000, 5], [15000, 3000, 4], [9000, 900, 3], [24000, 4000, 5], [6000, 600, 2]] as const)
  .forEach(([cost, res, life], i) => {
    const dep = round((cost - res) / life, 1)
    add(`bf_m2_${i}`, T.depreciation, FW.acct, 'medium',
      [`資產成本 ${cost} 元，殘值 ${res} 元，可用 ${life} 年，求每年直線折舊。`,
       `Asset cost $${cost}, residual $${res}, useful life ${life} years. Find the annual straight-line depreciation.`],
      [n(`${dep} 元`), n(`${round(cost / life, 1)} 元`), n(`${round((cost + res) / life, 1)} 元`), n(`${round((cost - res) * life, 0)} 元`)],
      [`直線折舊 = (成本 − 殘值) / 年限 = (${cost} − ${res}) / ${life} = ${dep} 元。陷阱：${round(cost / life, 1)} 元漏了減殘值。`,
       `Depreciation = (cost − residual)/life = ${dep}. Trap: ${round(cost / life, 1)} forgets to deduct the residual.`])
  })

// M3 — simple interest = P × r × t / 100
;([[1000, 5, 2], [2000, 4, 3], [5000, 6, 2], [1500, 8, 1], [3000, 5, 4], [4000, 3, 5], [2500, 6, 2], [8000, 4, 3]] as const)
  .forEach(([P, r, t], i) => {
    const si = round((P * r * t) / 100, 1)
    add(`bf_m3_${i}`, T.interest, FW.finance, 'medium',
      [`本金 ${P} 元，年利率 ${r}%，存 ${t} 年，求單利利息。`, `Principal $${P}, rate ${r}% p.a., ${t} years. Find the simple interest.`],
      [n(`${si} 元`), n(`${round(P * r * t, 0)} 元`), n(`${round((P * r) / 100, 1)} 元`), n(`${round((P + r * t) / 100, 1)} 元`)],
      [`單利 = 本金 × 利率 × 年期 / 100 = ${P} × ${r} × ${t} / 100 = ${si} 元。陷阱：${round((P * r) / 100, 1)} 元漏了年期 t。`,
       `SI = Prt/100 = ${si}. Trap: ${round((P * r) / 100, 1)} drops the time t.`])
  })

// M4 — cost-plus pricing: selling price = cost × (1 + markup%)
;([[100, 20], [200, 25], [80, 50], [150, 40], [120, 30], [500, 10], [90, 20], [250, 60]] as const)
  .forEach(([cost, mk], i) => {
    const price = round(cost * (1 + mk / 100), 1)
    add(`bf_m4_${i}`, T.costing, FW.finance, 'medium',
      [`成本 ${cost} 元，加成 ${mk}%，求售價。`, `Cost $${cost}, markup ${mk}%. Find the selling price.`],
      [n(`${price} 元`), n(`${round(cost * (1 - mk / 100), 1)} 元`), n(`${cost + mk} 元`), n(`${round(cost * mk / 100, 1)} 元`)],
      [`售價 = 成本 × (1 + 加成%) = ${cost} × (1 + ${mk}%) = ${price} 元。陷阱：${cost + mk} 元直接加了 ${mk}（並非 ${mk}%）。`,
       `Price = cost × (1 + markup%) = ${price}. Trap: ${cost + mk} adds ${mk} directly, not ${mk}%.`])
  })

// ── 拔尖 (hard) ──────────────────────────────────────────────────────────────

// H1 — break-even quantity = fixed cost / (price − variable cost)
;([[1000, 20, 10], [1200, 15, 9], [2000, 25, 5], [900, 12, 6], [1500, 30, 15], [800, 10, 6], [2400, 40, 16], [600, 8, 5]] as const)
  .forEach(([fc, price, vc], i) => {
    const cm = price - vc
    const be = round(fc / cm, 1)
    add(`bf_h1_${i}`, T.costing, FW.finance, 'hard',
      [`固定成本 ${fc} 元，售價 ${price} 元/件，單位變動成本 ${vc} 元，求收支平衡銷量（件）。`,
       `Fixed cost $${fc}, price $${price}/unit, variable cost $${vc}/unit. Find the break-even quantity (units).`],
      [n(`${be} 件`), n(`${round(fc / price, 1)} 件`), n(`${round(fc / vc, 1)} 件`), n(`${round(fc / (price + vc), 1)} 件`)],
      [`每件貢獻 = 售價 − 變動成本 = ${price} − ${vc} = ${cm} 元；收支平衡 = 固定成本 / 貢獻 = ${fc} / ${cm} = ${be} 件。陷阱：${round(fc / price, 1)} 件用了售價（漏減變動成本）。`,
       `Contribution = ${price}−${vc} = ${cm}; break-even = FC/contribution = ${be}. Trap: using price gives ${round(fc / price, 1)}.`])
  })

// H2 — compound amount = P(1 + r/100)^t (params chosen for a clean value)
;([[1000, 10, 2, 1210], [2000, 5, 2, 2205], [1000, 20, 2, 1440], [5000, 10, 2, 6050], [1000, 10, 3, 1331], [4000, 5, 2, 4410], [2500, 20, 2, 3600], [1000, 5, 3, 1157.625]] as const)
  .forEach(([P, r, t, amt], i) => {
    const simple = round(P + (P * r * t) / 100, 3)
    add(`bf_h2_${i}`, T.interest, FW.finance, 'hard',
      [`本金 ${P} 元，年利率 ${r}%，每年複利，${t} 年後的本利和是多少？`,
       `Principal $${P}, ${r}% p.a. compounded yearly. Find the amount after ${t} years.`],
      [n(`${amt} 元`), n(`${simple} 元`), n(`${round((P * r * t) / 100, 2)} 元`), n(`${round(P * r / 100, 2)} 元`)],
      [`本利和 = 本金 × (1 + 利率)^年期 = ${P} × (1 + ${r}%)^${t} = ${amt} 元。陷阱：${simple} 元用了單利（沒有複利效應）。`,
       `Amount = P(1 + r)^t = ${amt}. Trap: ${simple} uses simple interest (no compounding).`])
  })

// H3 — net profit margin = (sales − COGS − expenses) / sales × 100%
;([[500, 300, 100], [1000, 600, 200], [800, 500, 100], [400, 250, 50], [600, 360, 120], [1200, 800, 200], [250, 150, 50], [900, 600, 150]] as const)
  .forEach(([sales, cogs, exp], i) => {
    const np = sales - cogs - exp
    const margin = round((np / sales) * 100, 1)
    add(`bf_h3_${i}`, T.ratios, FW.acct, 'hard',
      [`銷貨 ${sales} 元，銷貨成本 ${cogs} 元，費用 ${exp} 元，求淨利率（%）。`,
       `Sales $${sales}, COGS $${cogs}, expenses $${exp}. Find the net profit margin (%).`],
      [n(`${margin}%`), n(`${round(((sales - cogs) / sales) * 100, 1)}%`), n(`${round((np / cogs) * 100, 1)}%`), n(`${np}%`)],
      [`淨利 = ${sales} − ${cogs} − ${exp} = ${np} 元；淨利率 = ${np}/${sales} × 100% = ${margin}%。陷阱：${round(((sales - cogs) / sales) * 100, 1)}% 是毛利率（漏減費用）。`,
       `Net margin = (sales−COGS−expenses)/sales × 100% = ${margin}%. Trap: ${round(((sales - cogs) / sales) * 100, 1)}% is the gross margin.`])
  })

export const bafsBankQuestions: Question[] = bank
