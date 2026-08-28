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
