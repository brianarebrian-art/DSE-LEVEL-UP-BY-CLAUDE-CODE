import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, money, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

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
  // ── 2026-08-28 平均分佈補強 ────────────────────────────────────────────
  // 實測企會財 13 個課題：ratios 已有 53 條，而 financial_mgmt 與
  // personal_finance 各 21 條、business_env 24 條（平均目標 77）。
  // bafs_depreciation / bafs_ratio_analysis / bafs_costing_pricing 三個課題
  // 有一批 22 條人手草稿正在等審批，本節不觸碰，避免與之重疊。
  finMgmt: { id: 'financial_mgmt', zh: '財務管理', en: 'Financial Management' },
  personalFin: { id: 'personal_finance', zh: '個人理財', en: 'Personal Finance' },
} satisfies Record<string, TopicMeta>

const FW = {
  acct: { id: 'accounting', zh: '會計', en: 'Accounting', emoji: '📒' },
  finance: { id: 'finance', zh: '財務', en: 'Finance', emoji: '💰' },
  quant: { id: 'quantitative_analysis', zh: '計算分析', en: 'Quantitative Analysis', emoji: '🧮' },
  concepts: { id: 'concepts', zh: '概念理解', en: 'Concepts', emoji: '📘' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('bafs')

// ── 補底 (easy) ──────────────────────────────────────────────────────────────

// E1 — gross profit = sales − cost of goods sold
for (const sales of [100, 150, 200, 250, 300]) {
  for (const cogs of [60, 90, 120]) {
    add(`bf_e1_${sales}_${cogs}`, T.statements, FW.acct, 'easy',
      [`銷貨 ${sales} 元，銷貨成本 ${cogs} 元，求毛利。`, `Sales \\$${sales}, cost of goods sold \\$${cogs}. Find gross profit.`],
      [money(sales - cogs), money(sales + cogs), money(cogs - sales), money(round(sales / cogs, 2))],
      [`毛利 = 銷貨 − 銷貨成本 = ${sales} − ${cogs} = ${sales - cogs} 元。陷阱：${sales + cogs} 元加了；${cogs - sales} 元符號反。`,
       `Gross profit = sales − COGS = ${sales - cogs}. Trap: ${sales + cogs} adds instead.`])
  }
}

// E2 — working capital = current assets − current liabilities
for (const ca of [80, 120, 160, 200]) {
  for (const cl of [40, 60, 100]) {
    add(`bf_e2_${ca}_${cl}`, T.ratios, FW.acct, 'easy',
      [`流動資產 ${ca} 元，流動負債 ${cl} 元，求營運資金。`, `Current assets \\$${ca}, current liabilities \\$${cl}. Find working capital.`],
      [money(ca - cl), money(ca + cl), n(`${round(ca / cl, 2)}`), money(cl - ca)],
      [`營運資金 = 流動資產 − 流動負債 = ${ca} − ${cl} = ${ca - cl} 元。陷阱：${round(ca / cl, 2)} 是流動比率（並非營運資金）。`,
       `Working capital = CA − CL = ${ca - cl}. Trap: ${round(ca / cl, 2)} is the current ratio, not working capital.`])
  }
}

// E3 — net profit = gross profit − expenses
for (const gp of [100, 150, 200, 250]) {
  for (const exp of [30, 50, 80]) {
    add(`bf_e3_${gp}_${exp}`, T.statements, FW.acct, 'easy',
      [`毛利 ${gp} 元，營業費用 ${exp} 元，求淨利。`, `Gross profit \\$${gp}, expenses \\$${exp}. Find net profit.`],
      [money(gp - exp), money(gp + exp), money(exp - gp), money(round(gp / exp, 2))],
      [`淨利 = 毛利 − 費用 = ${gp} − ${exp} = ${gp - exp} 元。陷阱：${gp + exp} 元加了費用（應該減）。`,
       `Net profit = gross profit − expenses = ${gp - exp}. Trap: ${gp + exp} adds expenses.`])
  }
}

// ── 普通 (medium) ────────────────────────────────────────────────────────────

// M1 — gross profit margin = gross profit / sales × 100%
;([[200, 50], [400, 100], [500, 200], [300, 90], [250, 100], [800, 200], [1000, 350], [600, 150], [400, 120], [500, 150], [750, 300], [1000, 250], [640, 160]] as const)
  .forEach(([sales, gp], i) => {
    const margin = round((gp / sales) * 100, 1)
    add(`bf_m1_${i}`, T.ratios, FW.acct, 'medium',
      [`銷貨 ${sales} 元，毛利 ${gp} 元，求毛利率（%）。`, `Sales \\$${sales}, gross profit \\$${gp}. Find the gross profit margin (%).`],
      [n(`${margin}%`), n(`${round((sales / gp) * 100, 1)}%`), n(`${round(gp / sales, 2)}%`), n(`${round(((sales - gp) / sales) * 100, 1)}%`)],
      [`毛利率 = 毛利 / 銷貨 × 100% = ${gp}/${sales} × 100% = ${margin}%。陷阱：${round(((sales - gp) / sales) * 100, 1)}% 是成本率；${round((sales / gp) * 100, 1)}% 分子分母倒轉。`,
       `Margin = GP/sales × 100% = ${margin}%. Trap: inverting gives ${round((sales / gp) * 100, 1)}%.`])
  })

// M2 — straight-line depreciation = (cost − residual) / useful life
;([[10000, 1000, 3], [12000, 2000, 5], [8000, 800, 4], [20000, 5000, 5], [15000, 3000, 4], [9000, 900, 3], [24000, 4000, 5], [6000, 600, 2], [16000, 1000, 5], [18000, 3000, 3], [11000, 2000, 3], [30000, 6000, 4], [7500, 1500, 2]] as const)
  .forEach(([cost, res, life], i) => {
    const dep = round((cost - res) / life, 1)
    add(`bf_m2_${i}`, T.depreciation, FW.acct, 'medium',
      [`資產成本 ${cost} 元，殘值 ${res} 元，可用 ${life} 年，求每年直線折舊。`,
       `Asset cost \\$${cost}, residual \\$${res}, useful life ${life} years. Find the annual straight-line depreciation.`],
      [money(dep), money(round(cost / life, 1)), money(round((cost + res) / life, 1)), money(round((cost - res) * life, 0))],
      [`直線折舊 = (成本 − 殘值) / 年限 = (${cost} − ${res}) / ${life} = ${dep} 元。陷阱：${round(cost / life, 1)} 元漏了減殘值。`,
       `Depreciation = (cost − residual)/life = ${dep}. Trap: ${round(cost / life, 1)} forgets to deduct the residual.`])
  })

// M3 — simple interest = P × r × t / 100
;([[1000, 5, 2], [2000, 4, 3], [5000, 6, 2], [1500, 8, 1], [3000, 5, 4], [4000, 3, 5], [2500, 6, 2], [8000, 4, 3], [6000, 5, 3], [10000, 4, 2], [3500, 6, 4], [7000, 5, 2], [12000, 3, 5]] as const)
  .forEach(([P, r, t], i) => {
    const si = round((P * r * t) / 100, 1)
    add(`bf_m3_${i}`, T.interest, FW.finance, 'medium',
      [`本金 ${P} 元，年利率 ${r}%，存 ${t} 年，求單利利息。`, `Principal \\$${P}, rate ${r}% p.a., ${t} years. Find the simple interest.`],
      [money(si), money(round(P * r * t, 0)), money(round((P * r) / 100, 1)), money(round((P + r * t) / 100, 1))],
      [`單利 = 本金 × 利率 × 年期 / 100 = ${P} × ${r} × ${t} / 100 = ${si} 元。陷阱：${round((P * r) / 100, 1)} 元漏了年期 t。`,
       `SI = Prt/100 = ${si}. Trap: ${round((P * r) / 100, 1)} drops the time t.`])
  })

// M4 — cost-plus pricing: selling price = cost × (1 + markup%)
;([[100, 20], [200, 25], [80, 50], [150, 40], [120, 30], [500, 10], [90, 20], [250, 60], [160, 25], [300, 20], [75, 40], [220, 40], [400, 15]] as const)
  .forEach(([cost, mk], i) => {
    const price = round(cost * (1 + mk / 100), 1)
    add(`bf_m4_${i}`, T.costing, FW.finance, 'medium',
      [`成本 ${cost} 元，加成 ${mk}%，求售價。`, `Cost \\$${cost}, markup ${mk}%. Find the selling price.`],
      [money(price), money(round(cost * (1 - mk / 100), 1)), money(cost + mk), money(round(cost * mk / 100, 1))],
      [`售價 = 成本 × (1 + 加成%) = ${cost} × (1 + ${mk}%) = ${price} 元。陷阱：${cost + mk} 元直接加了 ${mk}（並非 ${mk}%）。`,
       `Price = cost × (1 + markup%) = ${price}. Trap: ${cost + mk} adds ${mk} directly, not ${mk}%.`])
  })

// ── 拔尖 (hard) ──────────────────────────────────────────────────────────────

// H1 — break-even quantity = fixed cost / (price − variable cost)
;([[1000, 20, 10], [1200, 15, 9], [2000, 25, 5], [900, 12, 6], [1500, 30, 15], [800, 10, 6], [2400, 40, 16], [600, 8, 5], [1800, 25, 10], [3000, 30, 12]] as const)
  .forEach(([fc, price, vc], i) => {
    const cm = price - vc
    const be = round(fc / cm, 1)
    add(`bf_h1_${i}`, T.costing, FW.finance, 'hard',
      [`固定成本 ${fc} 元，售價 ${price} 元/件，單位變動成本 ${vc} 元，求收支平衡銷量（件）。`,
       `Fixed cost \\$${fc}, price \\$${price}/unit, variable cost \\$${vc}/unit. Find the break-even quantity (units).`],
      [qty(be, '件', 'units'), qty(round(fc / price, 1), '件', 'units'), qty(round(fc / vc, 1), '件', 'units'), qty(round(fc / (price + vc), 1), '件', 'units')],
      [`每件貢獻 = 售價 − 變動成本 = ${price} − ${vc} = ${cm} 元；收支平衡 = 固定成本 / 貢獻 = ${fc} / ${cm} = ${be} 件。陷阱：${round(fc / price, 1)} 件用了售價（漏減變動成本）。`,
       `Contribution = ${price}−${vc} = ${cm}; break-even = FC/contribution = ${be}. Trap: using price gives ${round(fc / price, 1)}.`])
  })

// H2 — compound amount = P(1 + r/100)^t (params chosen for a clean value)
;([[1000, 10, 2, 1210], [2000, 5, 2, 2205], [1000, 20, 2, 1440], [5000, 10, 2, 6050], [1000, 10, 3, 1331], [4000, 5, 2, 4410], [2500, 20, 2, 3600], [1000, 5, 3, 1157.625], [2000, 10, 2, 2420], [3000, 10, 2, 3630]] as const)
  .forEach(([P, r, t, amt], i) => {
    const simple = round(P + (P * r * t) / 100, 3)
    add(`bf_h2_${i}`, T.interest, FW.finance, 'hard',
      [`本金 ${P} 元，年利率 ${r}%，每年複利，${t} 年後的本利和是多少？`,
       `Principal \\$${P}, ${r}% p.a. compounded yearly. Find the amount after ${t} years.`],
      [money(amt), money(simple), money(round((P * r * t) / 100, 2)), money(round(P * r / 100, 2))],
      [`本利和 = 本金 × (1 + 利率)^年期 = ${P} × (1 + ${r}%)^${t} = ${amt} 元。陷阱：${simple} 元用了單利（沒有複利效應）。`,
       `Amount = P(1 + r)^t = ${amt}. Trap: ${simple} uses simple interest (no compounding).`])
  })

// H3 — net profit margin = (sales − COGS − expenses) / sales × 100%
;([[500, 300, 100], [1000, 600, 200], [800, 500, 100], [400, 250, 50], [600, 360, 120], [1200, 800, 200], [250, 150, 50], [900, 600, 150], [1000, 650, 150], [750, 450, 150]] as const)
  .forEach(([sales, cogs, exp], i) => {
    const np = sales - cogs - exp
    const margin = round((np / sales) * 100, 1)
    add(`bf_h3_${i}`, T.ratios, FW.acct, 'hard',
      [`銷貨 ${sales} 元，銷貨成本 ${cogs} 元，費用 ${exp} 元，求淨利率（%）。`,
       `Sales \\$${sales}, COGS \\$${cogs}, expenses \\$${exp}. Find the net profit margin (%).`],
      [n(`${margin}%`), n(`${round(((sales - cogs) / sales) * 100, 1)}%`), n(`${round((np / cogs) * 100, 1)}%`), n(`${np}%`)],
      [`淨利 = ${sales} − ${cogs} − ${exp} = ${np} 元；淨利率 = ${np}/${sales} × 100% = ${margin}%。陷阱：${round(((sales - cogs) / sales) * 100, 1)}% 是毛利率（漏減費用）。`,
       `Net margin = (sales−COGS−expenses)/sales × 100% = ${margin}%. Trap: ${round(((sales - cogs) / sales) * 100, 1)}% is the gross margin.`])
  })

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強 —— 兩個最薄課題（2026-08-28）
// 只補 financial_mgmt 與 personal_finance；bafs_depreciation /
// bafs_ratio_analysis / bafs_costing_pricing 三者有人手草稿在審，不重疊。
// ═══════════════════════════════════════════════════════════════════════════

// FM1 — 營運資金 = 流動資產 − 流動負債
for (const [ca, cl] of [[600000, 240000], [500000, 250000], [800000, 320000], [450000, 180000], [720000, 400000], [900000, 500000], [360000, 150000], [640000, 280000]] as [number, number][]) {
  const wc = ca - cl
  add(`bb_fm1_${ca}_${cl}`, T.finMgmt, FW.quant, 'easy',
    [`某公司流動資產 \\$${ca.toLocaleString('en-US')}，流動負債 \\$${cl.toLocaleString('en-US')}。其營運資金是多少？`,
     `A company has current assets of \\$${ca.toLocaleString('en-US')} and current liabilities of \\$${cl.toLocaleString('en-US')}. What is its working capital?`],
    [money(wc.toLocaleString('en-US')), money((ca + cl).toLocaleString('en-US')), money(round(ca / cl, 2)), money(cl.toLocaleString('en-US'))],
    [`營運資金 $=$ 流動資產 $-$ 流動負債 $= ${ca.toLocaleString('en-US')} - ${cl.toLocaleString('en-US')} = ${wc.toLocaleString('en-US')}$ 元。它是一個【金額】，量度企業償還短期債務之後尚餘多少短期資源。陷阱：${(ca + cl).toLocaleString('en-US')} 元用了加法；${round(ca / cl, 2)} 是流動比率——那是一個【比率】而非金額，兩者不可混用；${cl.toLocaleString('en-US')} 元只抄了流動負債。`,
     `Working capital is current assets less current liabilities: ${ca.toLocaleString('en-US')} − ${cl.toLocaleString('en-US')} = ${wc.toLocaleString('en-US')}. It is an amount, measuring the short-term resources left after short-term debts are met. Traps: ${(ca + cl).toLocaleString('en-US')} adds; ${round(ca / cl, 2)} is the current ratio, which is a ratio rather than an amount and must not be confused with it; ${cl.toLocaleString('en-US')} merely copies the liabilities.`])
}

// FM2 — 存貨周轉率 = 銷貨成本 ÷ 平均存貨
for (const [cogs, inv] of [[600000, 100000], [800000, 200000], [450000, 90000], [960000, 120000], [720000, 180000], [540000, 135000], [1200000, 300000], [640000, 160000]] as [number, number][]) {
  const turn = cogs / inv
  if (!Number.isInteger(turn)) continue
  add(`bb_fm2_${cogs}_${inv}`, T.finMgmt, FW.quant, 'medium',
    [`某商號的銷貨成本為 \\$${cogs.toLocaleString('en-US')}，平均存貨為 \\$${inv.toLocaleString('en-US')}。其存貨周轉率是多少？`,
     `A business has cost of goods sold of \\$${cogs.toLocaleString('en-US')} and average inventory of \\$${inv.toLocaleString('en-US')}. What is its inventory turnover?`],
    [qty(turn, '次', 'times'), qty(round(inv / cogs, 3), '次', 'times'), qty(round(365 / turn, 1), '次', 'times'), qty((cogs - inv).toLocaleString('en-US'), '次', 'times')],
    [`存貨周轉率 $=$ 銷貨成本 $\\div$ 平均存貨 $= ${cogs.toLocaleString('en-US')} \\div ${inv.toLocaleString('en-US')} = ${turn}$ 次，表示一年內存貨平均售出並補充 ${turn} 次。周轉率愈高，一般代表存貨管理愈有效率、資金積壓愈少。陷阱：${round(inv / cogs, 3)} 次上下倒轉；${round(365 / turn, 1)} 是存貨周轉【天數】而非次數，兩者互為倒數關係；最後一項用了相減。`,
     `Inventory turnover is cost of goods sold divided by average inventory: ${cogs.toLocaleString('en-US')} ÷ ${inv.toLocaleString('en-US')} = ${turn} times, meaning inventory is sold and replaced ${turn} times a year. A higher figure generally indicates more efficient inventory management and less capital tied up. Traps: ${round(inv / cogs, 3)} inverts the ratio; ${round(365 / turn, 1)} is the inventory turnover period in days rather than a number of times, the two being reciprocals; the last option subtracts.`])
}

// PF1 — 單利 I = P × r × t
for (const P of [10000, 20000, 50000, 80000]) {
  for (const r of [0.03, 0.05, 0.06]) {
    for (const t of [2, 3, 5]) {
      const I = P * r * t
      if (!Number.isInteger(I)) continue
      add(`bb_pf1_${P}_${String(r).replace('.', '')}_${t}`, T.personalFin, FW.concepts, 'easy',
        [`把 \\$${P.toLocaleString('en-US')} 以年利率 ${r * 100}% 的【單利】存款 ${t} 年。所得利息是多少？`,
         `\\$${P.toLocaleString('en-US')} is deposited at ${r * 100}% simple interest per year for ${t} years. How much interest is earned?`],
        [money(I.toLocaleString('en-US')), money((P * r).toLocaleString('en-US')), money((P + I).toLocaleString('en-US')), money(round(P * ((1 + r) ** t - 1), 2))],
        [`單利 $= P \\times r \\times t = ${P.toLocaleString('en-US')} \\times ${r} \\times ${t} = ${I.toLocaleString('en-US')}$ 元。單利每年只按【本金】計息，利息不會再生利息。陷阱：${(P * r).toLocaleString('en-US')} 元只計了一年；${(P + I).toLocaleString('en-US')} 元是本利和而非利息；最後一項用了複利公式——複利所得較多，因為利息會滾入本金再生息，兩者的分別隨年期拉長而擴大。`,
         `Simple interest is $P \\times r \\times t = ${P.toLocaleString('en-US')} \\times ${r} \\times ${t} = ${I.toLocaleString('en-US')}$. Simple interest is charged on the principal alone each year, so interest never earns interest. Traps: ${(P * r).toLocaleString('en-US')} covers one year only; ${(P + I).toLocaleString('en-US')} is the total of principal and interest rather than the interest; the last option applies the compound formula, which gives more because interest is added to the principal and itself earns interest, the gap widening with time.`])
    }
  }
}

// PF2 — 複利本利和 A = P(1 + r)ᵗ
for (const P of [10000, 20000, 50000]) {
  for (const r of [0.05, 0.1, 0.2]) {
    for (const t of [2, 3]) {
      const A = P * (1 + r) ** t
      if (!Number.isInteger(A)) continue
      add(`bb_pf2_${P}_${String(r).replace('.', '')}_${t}`, T.personalFin, FW.concepts, 'medium',
        [`把 \\$${P.toLocaleString('en-US')} 以年利率 ${r * 100}% 的【複利】存款 ${t} 年（每年結息一次）。到期本利和是多少？`,
         `\\$${P.toLocaleString('en-US')} is deposited at ${r * 100}% compound interest per year for ${t} years, compounded annually. What is the amount at maturity?`],
        [money(A.toLocaleString('en-US')), money((P * (1 + r * t)).toLocaleString('en-US')), money((A - P).toLocaleString('en-US')), money((P * r * t).toLocaleString('en-US'))],
        [`複利本利和 $= P(1 + r)^{t} = ${P.toLocaleString('en-US')} \\times ${1 + r}^{${t}} = ${A.toLocaleString('en-US')}$ 元。陷阱：${(P * (1 + r * t)).toLocaleString('en-US')} 元用了單利公式；${(A - P).toLocaleString('en-US')} 元是【利息】而非本利和，題目問的是到期總額；${(P * r * t).toLocaleString('en-US')} 元是單利的利息。留意公式中的指數 ${t} 正是複利與單利的分別所在：複利是連乘，單利是連加。`,
         `The compound amount is $P(1 + r)^{t} = ${P.toLocaleString('en-US')} \\times ${1 + r}^{${t}} = ${A.toLocaleString('en-US')}$. Traps: ${(P * (1 + r * t)).toLocaleString('en-US')} uses the simple interest formula; ${(A - P).toLocaleString('en-US')} is the interest rather than the amount, and the question asks for the total at maturity; ${(P * r * t).toLocaleString('en-US')} is the simple interest. The exponent ${t} is exactly where compound and simple interest part company: compounding multiplies where simple interest adds.`])
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 第三批母模板 —— 平均分佈補強（2026-08-28）
// ---------------------------------------------------------------------------
// 補強前實測企會財 13 個課題：個人理財 63、財務比率 53、財務報表 43，
// 而折舊計算僅 2 條、比率分析（高階）與成本・定價・回本各 3 條，
// 不均比高達 31.5×（全站最差）。本節按缺口由大到小補寫計算型母模板。
//
// 商業環境（24 條）與管理（25 條）屬概念型課題，並非可由公式構造正確答案
// 的內容，不適用本工廠，須另循人手出題與覆核管線處理 —— 此處刻意不動。
//
// 折舊計算／比率分析（高階）／成本・定價・回本 三個課題另有 22 條人手草稿
// 待審批。本節所出全為計算題，與該批草稿的題幹不重疊（已用
// check-draft-overlap 核對）。
// ═══════════════════════════════════════════════════════════════════════════

const T2 = {
  depCalc: { id: 'bafs_depreciation', zh: '折舊計算', en: 'Depreciation calculations' },
  ratioAdv: { id: 'bafs_ratio_analysis', zh: '比率分析（高階）', en: 'Ratio analysis (advanced)' },
  costPrice: { id: 'bafs_costing_pricing', zh: '成本・定價・回本', en: 'Costing, pricing and payback' },
  accounting: { id: 'accounting', zh: '會計', en: 'Accounting' },
} satisfies Record<string, TopicMeta>

const fmt = (v: number): string => v.toLocaleString('en-US')

// ── 折舊計算（bafs_depreciation）──────────────────────────────────────────

// DP1 — 直線法：每年折舊 = (成本 − 殘值) ÷ 可使用年期
for (const cost of [60000, 80000, 100000, 120000, 150000, 180000]) {
  for (const life of [4, 5, 6]) {
    for (const scrapPct of [10, 20]) {
      const scrap = (cost * scrapPct) / 100
      const ans = (cost - scrap) / life
      if (!Number.isInteger(ans)) continue
      add(`bafs_dp1_${cost}_${life}_${scrapPct}`, T2.depCalc, FW.quant, 'easy',
        [`一部機器成本 ${fmt(cost)} 元，估計可使用 ${life} 年，殘值為成本的 ${scrapPct}%。以直線法計算，每年折舊是多少？`,
         `A machine costs \\$${fmt(cost)}, has a useful life of ${life} years and a residual value of ${scrapPct}% of cost. Using the straight-line method, what is the annual depreciation?`],
        [money(fmt(ans)), money(fmt(cost / life)), money(fmt(scrap / life)), money(fmt(cost - scrap))],
        [`直線法每年折舊 = (成本 − 殘值) ÷ 可使用年期。殘值 = ${fmt(cost)} × ${scrapPct}% = ${fmt(scrap)} 元，故每年折舊 = (${fmt(cost)} − ${fmt(scrap)}) ÷ ${life} = ${fmt(ans)} 元。陷阱：${fmt(cost / life)} 元漏了扣除殘值；${fmt(scrap / life)} 元只把殘值攤分；${fmt(cost - scrap)} 元是可折舊總額，尚未除以年期。`,
         `Straight-line depreciation = (cost − residual) ÷ useful life. The residual is \\$${fmt(cost)} × ${scrapPct}% = \\$${fmt(scrap)}, so the annual charge is (\\$${fmt(cost)} − \\$${fmt(scrap)}) ÷ ${life} = \\$${fmt(ans)}. Traps: \\$${fmt(cost / life)} omits the residual; \\$${fmt(scrap / life)} spreads only the residual; \\$${fmt(cost - scrap)} is the total depreciable amount before dividing by the life.`])
    }
  }
}

// DP2 — 直線法下第 n 年年末的帳面淨值
for (const cost of [60000, 90000, 120000, 150000]) {
  for (const life of [5, 6]) {
    for (let yr = 2; yr <= 4; yr++) {
      const scrap = cost / 10
      const annual = (cost - scrap) / life
      if (!Number.isInteger(annual)) continue
      const acc = annual * yr
      add(`bafs_dp2_${cost}_${life}_${yr}`, T2.depCalc, FW.quant, 'medium',
        [`一項資產成本 ${fmt(cost)} 元，殘值 ${fmt(scrap)} 元，可使用 ${life} 年，採用直線法。第 ${yr} 年年末的帳面淨值是多少？`,
         `An asset costing \\$${fmt(cost)} with a residual value of \\$${fmt(scrap)} is depreciated on a straight-line basis over ${life} years. What is its net book value at the end of year ${yr}?`],
        [money(fmt(cost - acc)), money(fmt(acc)), money(fmt(cost - annual)), money(fmt(cost - acc - scrap))],
        [`每年折舊 = (${fmt(cost)} − ${fmt(scrap)}) ÷ ${life} = ${fmt(annual)} 元，${yr} 年的累計折舊 = ${fmt(annual)} × ${yr} = ${fmt(acc)} 元。帳面淨值 = 成本 − 累計折舊 = ${fmt(cost)} − ${fmt(acc)} = ${fmt(cost - acc)} 元。陷阱：${fmt(acc)} 元是累計折舊本身；${fmt(cost - annual)} 元只扣了一年；${fmt(cost - acc - scrap)} 元把殘值重複扣除一次（殘值已包含在帳面淨值之內）。`,
         `The annual charge is (\\$${fmt(cost)} − \\$${fmt(scrap)}) ÷ ${life} = \\$${fmt(annual)}, so accumulated depreciation after ${yr} years is \\$${fmt(annual)} × ${yr} = \\$${fmt(acc)}. Net book value = cost − accumulated depreciation = \\$${fmt(cost)} − \\$${fmt(acc)} = \\$${fmt(cost - acc)}. Traps: \\$${fmt(acc)} is the accumulated depreciation itself; \\$${fmt(cost - annual)} deducts only one year; \\$${fmt(cost - acc - scrap)} deducts the residual a second time, since it is already contained in the net book value.`])
    }
  }
}

// DP3 — 減值餘額法（首兩年）
for (const cost of [50000, 80000, 100000, 200000]) {
  for (const rate of [20, 25, 40, 50]) {
    const y1 = (cost * rate) / 100
    const y2 = ((cost - y1) * rate) / 100
    if (!Number.isInteger(y2)) continue
    add(`bafs_dp3_${cost}_${rate}`, T2.depCalc, FW.quant, 'hard',
      [`一部設備成本 ${fmt(cost)} 元，按【減值餘額法】以每年 ${rate}% 計算折舊。第二年的折舊額是多少？`,
       `Equipment costing \\$${fmt(cost)} is depreciated at ${rate}% per year using the reducing-balance method. What is the depreciation charge for the second year?`],
      [money(fmt(y2)), money(fmt(y1)), money(fmt(y1 + y2)), money(fmt((cost * rate * 2) / 100))],
      [`減值餘額法以【帳面淨值】而非成本為計算基礎。第一年折舊 = ${fmt(cost)} × ${rate}% = ${fmt(y1)} 元，年末帳面淨值 = ${fmt(cost - y1)} 元；第二年折舊 = ${fmt(cost - y1)} × ${rate}% = ${fmt(y2)} 元。陷阱：${fmt(y1)} 元是第一年的折舊，誤以為兩年相同（那是直線法的特徵）；${fmt(y1 + y2)} 元是兩年的累計折舊；${fmt((cost * rate * 2) / 100)} 元把成本乘以兩倍稅率。`,
       `The reducing-balance method applies the rate to the net book value rather than to cost. Year 1: \\$${fmt(cost)} × ${rate}% = \\$${fmt(y1)}, leaving a net book value of \\$${fmt(cost - y1)}. Year 2: \\$${fmt(cost - y1)} × ${rate}% = \\$${fmt(y2)}. Traps: \\$${fmt(y1)} is the year-1 charge and assumes the two years are equal, which is the straight-line pattern; \\$${fmt(y1 + y2)} is the two-year accumulated total; \\$${fmt((cost * rate * 2) / 100)} applies twice the rate to cost.`])
  }
}

// DP4 — 出售資產的損益
for (const cost of [80000, 120000, 160000]) {
  for (const acc of [30000, 50000, 70000]) {
    for (const proceeds of [40000, 60000, 90000]) {
      const nbv = cost - acc
      const gain = proceeds - nbv
      if (gain === 0) continue
      add(`bafs_dp4_${cost}_${acc}_${proceeds}`, T2.depCalc, FW.acct, 'hard',
        [`一項資產成本 ${fmt(cost)} 元，累計折舊 ${fmt(acc)} 元，現以 ${fmt(proceeds)} 元售出。出售的損益是多少？`,
         `An asset costing \\$${fmt(cost)} with accumulated depreciation of \\$${fmt(acc)} is sold for \\$${fmt(proceeds)}. What is the gain or loss on disposal?`],
        [money(fmt(gain)), money(fmt(proceeds - cost)), money(fmt(nbv)), money(fmt(proceeds - acc))],
        [`出售損益 = 售價 − 帳面淨值。帳面淨值 = 成本 − 累計折舊 = ${fmt(cost)} − ${fmt(acc)} = ${fmt(nbv)} 元，故損益 = ${fmt(proceeds)} − ${fmt(nbv)} = ${fmt(gain)} 元${gain > 0 ? '（收益）' : '（虧損）'}。陷阱：${fmt(proceeds - cost)} 元用了原成本而非帳面淨值，忽略了資產已折舊多年；${fmt(nbv)} 元只是帳面淨值；${fmt(proceeds - acc)} 元把累計折舊當成了帳面淨值。`,
         `Gain or loss on disposal = proceeds − net book value. The net book value is cost − accumulated depreciation = \\$${fmt(cost)} − \\$${fmt(acc)} = \\$${fmt(nbv)}, so the result is \\$${fmt(proceeds)} − \\$${fmt(nbv)} = \\$${fmt(gain)}${gain > 0 ? ' (a gain)' : ' (a loss)'}. Traps: \\$${fmt(proceeds - cost)} compares with original cost and ignores the years already depreciated; \\$${fmt(nbv)} is merely the net book value; \\$${fmt(proceeds - acc)} treats accumulated depreciation as the net book value.`])
    }
  }
}

// ── 比率分析（高階）（bafs_ratio_analysis）────────────────────────────────

// RA1 — 流動比率 = 流動資產 ÷ 流動負債
for (const cl of [20000, 25000, 40000, 50000, 60000, 80000]) {
  for (const mult of [15, 20, 25, 30]) {
    const ca = (cl * mult) / 10
    const ratio = mult / 10
    add(`bafs_ra1_${cl}_${mult}`, T2.ratioAdv, FW.quant, 'easy',
      [`某公司流動資產 ${fmt(ca)} 元、流動負債 ${fmt(cl)} 元。流動比率是多少？`,
       `A company has current assets of \\$${fmt(ca)} and current liabilities of \\$${fmt(cl)}. What is its current ratio?`],
      [n(`${ratio} : 1`), n(`${round(cl / ca, 2)} : 1`), n(`${round((ca - cl) / cl, 2)} : 1`), n(fmt(ca - cl))],
      [`流動比率 = 流動資產 ÷ 流動負債 = ${fmt(ca)} ÷ ${fmt(cl)} = ${ratio}，即 ${ratio} : 1。此比率量度短期償債能力，一般以 2 : 1 為參考水平。陷阱：${round(cl / ca, 2)} : 1 把分子分母倒轉；${round((ca - cl) / cl, 2)} : 1 用了營運資金而非流動資產作分子；${fmt(ca - cl)} 是營運資金的【金額】，並非比率。`,
       `Current ratio = current assets ÷ current liabilities = \\$${fmt(ca)} ÷ \\$${fmt(cl)} = ${ratio}, that is ${ratio} : 1. The ratio measures short-term solvency and is commonly benchmarked at 2 : 1. Traps: ${round(cl / ca, 2)} : 1 inverts the fraction; ${round((ca - cl) / cl, 2)} : 1 uses working capital in the numerator; ${fmt(ca - cl)} is the working capital amount, not a ratio.`])
  }
}

// RA2 — 速動比率 = (流動資產 − 存貨) ÷ 流動負債
for (const cl of [20000, 30000, 40000, 50000]) {
  for (const mult of [20, 25, 30]) {
    for (const invPct of [20, 40]) {
      const ca = (cl * mult) / 10
      const inv = (ca * invPct) / 100
      const q = (ca - inv) / cl
      if (!Number.isInteger(q * 100)) continue
      add(`bafs_ra2_${cl}_${mult}_${invPct}`, T2.ratioAdv, FW.quant, 'medium',
        [`某公司流動資產 ${fmt(ca)} 元，其中存貨 ${fmt(inv)} 元，流動負債 ${fmt(cl)} 元。速動比率是多少？`,
         `A company has current assets of \\$${fmt(ca)}, of which inventory is \\$${fmt(inv)}, and current liabilities of \\$${fmt(cl)}. What is its quick ratio?`],
        [n(`${round(q, 2)} : 1`), n(`${round(ca / cl, 2)} : 1`), n(`${round(inv / cl, 2)} : 1`), n(`${round(cl / (ca - inv), 2)} : 1`)],
        [`速動比率 = (流動資產 − 存貨) ÷ 流動負債 = (${fmt(ca)} − ${fmt(inv)}) ÷ ${fmt(cl)} = ${round(q, 2)}，即 ${round(q, 2)} : 1。剔除存貨是因為存貨變現最慢，未必能即時用以償還短期債務。陷阱：${round(ca / cl, 2)} : 1 是流動比率，未剔除存貨；${round(inv / cl, 2)} : 1 只用了存貨；${round(cl / (ca - inv), 2)} : 1 把分子分母倒轉。`,
         `Quick ratio = (current assets − inventory) ÷ current liabilities = (\\$${fmt(ca)} − \\$${fmt(inv)}) ÷ \\$${fmt(cl)} = ${round(q, 2)}, that is ${round(q, 2)} : 1. Inventory is excluded because it is the slowest current asset to convert into cash. Traps: ${round(ca / cl, 2)} : 1 is the current ratio and leaves inventory in; ${round(inv / cl, 2)} : 1 uses inventory alone; ${round(cl / (ca - inv), 2)} : 1 inverts the fraction.`])
    }
  }
}

// RA3 — 存貨周轉期（日）= 平均存貨 ÷ 銷貨成本 × 365
for (const cogs of [365000, 730000, 1095000, 1460000]) {
  for (const days of [30, 45, 60, 73, 90]) {
    const avgInv = (cogs / 365) * days
    if (!Number.isInteger(avgInv)) continue
    add(`bafs_ra3_${cogs}_${days}`, T2.ratioAdv, FW.quant, 'hard',
      [`某公司全年銷貨成本 ${fmt(cogs)} 元，平均存貨 ${fmt(avgInv)} 元。存貨周轉期約為多少日（以一年 365 日計）？`,
       `A company reports annual cost of goods sold of \\$${fmt(cogs)} and average inventory of \\$${fmt(avgInv)}. What is its inventory turnover period, in days, based on a 365-day year?`],
      [qty(days, '日', 'days'), qty(round(365 / days, 1), '日', 'days'), qty(round((avgInv / cogs) * 100, 1), '日', 'days'), qty(round(cogs / avgInv, 2), '日', 'days')],
      [`存貨周轉期 = 平均存貨 ÷ 銷貨成本 × 365 = ${fmt(avgInv)} ÷ ${fmt(cogs)} × 365 = ${days} 日。此數字愈短，代表存貨愈快售出、資金積壓愈少。陷阱：${round(365 / days, 1)} 日把周轉【次數】與周轉【日數】倒轉；${round((avgInv / cogs) * 100, 1)} 日乘了 100 而非 365；${round(cogs / avgInv, 2)} 是存貨周轉率（次數），單位並非日。`,
       `Inventory turnover period = average inventory ÷ cost of goods sold × 365 = \\$${fmt(avgInv)} ÷ \\$${fmt(cogs)} × 365 = ${days} days. A shorter period means inventory sells faster and less capital is tied up. Traps: ${round(365 / days, 1)} days confuses the number of turns with the number of days; ${round((avgInv / cogs) * 100, 1)} multiplies by 100 instead of 365; ${round(cogs / avgInv, 2)} is the turnover rate in times, not days.`])
  }
}

// RA4 — 資本負債比率 = 總負債 ÷ 總資產 × 100%
for (const assets of [200000, 400000, 500000, 800000, 1000000]) {
  for (const pct of [25, 40, 60, 75]) {
    const debt = (assets * pct) / 100
    add(`bafs_ra4_${assets}_${pct}`, T2.ratioAdv, FW.quant, 'medium',
      [`某公司總資產 ${fmt(assets)} 元，總負債 ${fmt(debt)} 元。資本負債比率（總負債對總資產）是多少？`,
       `A company has total assets of \\$${fmt(assets)} and total liabilities of \\$${fmt(debt)}. What is its debt-to-total-assets ratio?`],
      [n(`${pct}%`), n(`${round((debt / (assets - debt)) * 100, 1)}%`), n(`${round(((assets - debt) / assets) * 100, 1)}%`), n(`${round((assets / debt) * 100, 1)}%`)],
      [`資本負債比率 = 總負債 ÷ 總資產 × 100% = ${fmt(debt)} ÷ ${fmt(assets)} × 100% = ${pct}%。比率愈高代表財務槓桿愈大、利息負擔愈重。陷阱：${round((debt / (assets - debt)) * 100, 1)}% 用了權益而非總資產作分母（那是負債權益比）；${round(((assets - debt) / assets) * 100, 1)}% 算的是權益比率；${round((assets / debt) * 100, 1)}% 把分子分母倒轉。`,
       `Debt-to-total-assets = total liabilities ÷ total assets × 100% = \\$${fmt(debt)} ÷ \\$${fmt(assets)} × 100% = ${pct}%. A higher ratio means greater financial leverage and a heavier interest burden. Traps: ${round((debt / (assets - debt)) * 100, 1)}% uses equity as the denominator, which is the debt-to-equity ratio; ${round(((assets - debt) / assets) * 100, 1)}% is the equity ratio; ${round((assets / debt) * 100, 1)}% inverts the fraction.`])
  }
}

// ── 成本・定價・回本（bafs_costing_pricing）──────────────────────────────

// CP1 — 邊際貢獻 = 售價 − 單位變動成本；總邊際貢獻 = 邊際貢獻 × 銷量
for (const price of [50, 80, 120, 150, 200]) {
  for (const vcPct of [40, 60]) {
    for (const unitsK of [2, 5, 10]) {
      const vc = (price * vcPct) / 100
      const cm = price - vc
      const units = unitsK * 1000
      add(`bafs_cp1_${price}_${vcPct}_${unitsK}`, T2.costPrice, FW.quant, 'medium',
        [`某產品售價每件 ${price} 元，單位變動成本 ${vc} 元。售出 ${fmt(units)} 件，總邊際貢獻是多少？`,
         `A product sells for \\$${price} per unit with a variable cost of \\$${vc} per unit. If ${fmt(units)} units are sold, what is the total contribution margin?`],
        [money(fmt(cm * units)), money(fmt(price * units)), money(fmt(vc * units)), money(fmt(cm))],
        [`單位邊際貢獻 = 售價 − 單位變動成本 = ${price} − ${vc} = ${cm} 元，總邊際貢獻 = ${cm} × ${fmt(units)} = ${fmt(cm * units)} 元。邊際貢獻先用以抵銷固定成本，餘額才是利潤。陷阱：${fmt(price * units)} 元是總銷售收入；${fmt(vc * units)} 元是總變動成本；${fmt(cm)} 元只是【單位】邊際貢獻，未乘銷量。`,
         `Unit contribution margin = price − variable cost = \\$${price} − \\$${vc} = \\$${cm}, so the total is \\$${cm} × ${fmt(units)} = \\$${fmt(cm * units)}. Contribution first covers fixed costs; only the remainder is profit. Traps: \\$${fmt(price * units)} is total sales revenue; \\$${fmt(vc * units)} is total variable cost; \\$${fmt(cm)} is the unit contribution and has not been multiplied by volume.`])
    }
  }
}

// CP2 — 回本期 = 初始投資 ÷ 每年淨現金流入
for (const invK of [60, 90, 120, 180, 240]) {
  for (const flowK of [15, 20, 30, 40]) {
    const inv = invK * 1000, flow = flowK * 1000
    const yrs = inv / flow
    if (!Number.isInteger(yrs) || yrs > 10) continue
    add(`bafs_cp2_${invK}_${flowK}`, T2.costPrice, FW.finance, 'medium',
      [`一項投資初期支出 ${fmt(inv)} 元，預計每年帶來淨現金流入 ${fmt(flow)} 元。回本期是多少年？`,
       `An investment requires an initial outlay of \\$${fmt(inv)} and is expected to generate net cash inflows of \\$${fmt(flow)} per year. What is the payback period?`],
      [qty(yrs, '年', 'years'), qty(round(flow / inv, 3), '年', 'years'), qty(round(inv / (flow * 12), 2), '年', 'years'), qty(round((inv - flow) / flow, 2), '年', 'years')],
      [`回本期 = 初始投資 ÷ 每年淨現金流入 = ${fmt(inv)} ÷ ${fmt(flow)} = ${yrs} 年。回本期法只看收回本金的快慢，不理會回本之後的收益，亦不考慮金錢的時間價值，這是它最主要的局限。陷阱：${round(flow / inv, 3)} 年把分子分母倒轉；${round(inv / (flow * 12), 2)} 年誤把每年流入當作每月；${round((inv - flow) / flow, 2)} 年多扣了第一年的流入。`,
       `Payback period = initial outlay ÷ annual net cash inflow = \\$${fmt(inv)} ÷ \\$${fmt(flow)} = ${yrs} years. Payback measures only how quickly the outlay is recovered; it ignores cash flows after payback and the time value of money, which are its main limitations. Traps: ${round(flow / inv, 3)} inverts the fraction; ${round(inv / (flow * 12), 2)} treats the annual inflow as monthly; ${round((inv - flow) / flow, 2)} deducts the first year's inflow twice.`])
  }
}

// CP3 — 加成定價下的成本回推：成本 = 售價 ÷ (1 + 加成率)
for (const cost of [200, 400, 500, 800, 1000, 1500]) {
  for (const mk of [20, 25, 50]) {
    const price = (cost * (100 + mk)) / 100
    if (!Number.isInteger(price)) continue
    add(`bafs_cp3_${cost}_${mk}`, T2.costPrice, FW.quant, 'hard',
      [`某貨品按成本加成 ${mk}% 定價，售價為 ${fmt(price)} 元。其成本是多少？`,
       `An item is priced at a mark-up of ${mk}% on cost and sells for \\$${fmt(price)}. What is its cost?`],
      [money(fmt(cost)), money(fmt((price * (100 - mk)) / 100)), money(fmt(price - mk)), money(fmt(price - cost))],
      [`加成是以【成本】為基數：售價 = 成本 × (1 + ${mk}%)，故成本 = ${fmt(price)} ÷ ${(100 + mk) / 100} = ${fmt(cost)} 元。陷阱：${fmt((price * (100 - mk)) / 100)} 元把加成當作以售價為基數的折扣（那是毛利率的算法）；${fmt(price - mk)} 元把百分率當成了金額直接相減；${fmt(price - cost)} 元是加成的金額而非成本。`,
       `A mark-up is applied to cost: price = cost × (1 + ${mk}%), so cost = \\$${fmt(price)} ÷ ${(100 + mk) / 100} = \\$${fmt(cost)}. Traps: \\$${fmt((price * (100 - mk)) / 100)} treats the mark-up as a margin on the selling price; \\$${fmt(price - mk)} subtracts the percentage as if it were an amount; \\$${fmt(price - cost)} is the mark-up itself rather than the cost.`])
  }
}

// ── 會計（accounting）────────────────────────────────────────────────────

// AC1 — 會計等式：資產 = 負債 + 權益
for (const assets of [150000, 250000, 360000, 480000, 600000, 750000]) {
  for (const pct of [30, 40, 60]) {
    const liab = (assets * pct) / 100
    add(`bafs_ac1_${assets}_${pct}`, T2.accounting, FW.acct, 'easy',
      [`某企業總資產 ${fmt(assets)} 元，總負債 ${fmt(liab)} 元。業主權益是多少？`,
       `A business has total assets of \\$${fmt(assets)} and total liabilities of \\$${fmt(liab)}. What is the owner's equity?`],
      [money(fmt(assets - liab)), money(fmt(assets + liab)), money(fmt(liab)), money(fmt(assets))],
      [`會計等式為：資產 = 負債 + 業主權益，移項得業主權益 = 資產 − 負債 = ${fmt(assets)} − ${fmt(liab)} = ${fmt(assets - liab)} 元。陷阱：${fmt(assets + liab)} 元把負債加上而非減去；${fmt(liab)} 元與 ${fmt(assets)} 元分別是負債與資產本身。`,
       `The accounting equation is assets = liabilities + owner's equity, so equity = assets − liabilities = \\$${fmt(assets)} − \\$${fmt(liab)} = \\$${fmt(assets - liab)}. Traps: \\$${fmt(assets + liab)} adds instead of subtracting; \\$${fmt(liab)} and \\$${fmt(assets)} are the liabilities and the assets themselves.`])
  }
}

// AC2 — 銷貨成本 = 期初存貨 + 購貨 − 期末存貨
for (const open of [20000, 35000, 50000]) {
  for (const purch of [80000, 120000, 160000, 200000]) {
    for (const close of [15000, 30000, 45000]) {
      const cogs = open + purch - close
      add(`bafs_ac2_${open}_${purch}_${close}`, T2.accounting, FW.acct, 'medium',
        [`某商號期初存貨 ${fmt(open)} 元，本期購貨 ${fmt(purch)} 元，期末存貨 ${fmt(close)} 元。本期銷貨成本是多少？`,
         `A trader has opening inventory of \\$${fmt(open)}, purchases of \\$${fmt(purch)} and closing inventory of \\$${fmt(close)}. What is the cost of goods sold for the period?`],
        [money(fmt(cogs)), money(fmt(open + purch + close)), money(fmt(purch - close)), money(fmt(purch))],
        [`銷貨成本 = 期初存貨 + 購貨 − 期末存貨 = ${fmt(open)} + ${fmt(purch)} − ${fmt(close)} = ${fmt(cogs)} 元。期末存貨要【減去】，因為它尚未售出，不構成本期成本。陷阱：${fmt(open + purch + close)} 元把期末存貨加上；${fmt(purch - close)} 元漏了期初存貨；${fmt(purch)} 元只計購貨。`,
         `Cost of goods sold = opening inventory + purchases − closing inventory = \\$${fmt(open)} + \\$${fmt(purch)} − \\$${fmt(close)} = \\$${fmt(cogs)}. Closing inventory is deducted because it remains unsold and is not a cost of this period. Traps: \\$${fmt(open + purch + close)} adds the closing inventory; \\$${fmt(purch - close)} omits opening inventory; \\$${fmt(purch)} counts purchases only.`])
    }
  }
}

export const bafsBankQuestions: Question[] = bank

// ── 課題登記（2026-07-28 稽核修正）──────────────────────────────────────────
// 本題庫所用的 topic id 從未登記於科目的 *Topics 清單，令相關試題雖然存在於
// 題庫，學生卻無法經課題入口（/practice?topic=、/subjects 課題標籤、/notes）
// 篩選得到。現依 *-hell.ts 的既有慣例，由題庫自行匯出課題，再於科目檔案
// push 併入：T/FW 已在上方定義，毋須兩處重複維護，日後新增題目族亦自動登記。
// `count` 於 getSubjectTopics() 讀取時按真實題數計算，此處填 0 僅作佔位
// （見 types.ts 的說明）。
export const bafsBankTopics: Topic[] = topicList([
  { topic: T.statements, fw: FW.acct, count: 0 },
  { topic: T.ratios, fw: FW.acct, count: 0 },
  { topic: T.depreciation, fw: FW.acct, count: 0 },
  { topic: T.interest, fw: FW.finance, count: 0 },
  { topic: T.costing, fw: FW.finance, count: 0 },
])
