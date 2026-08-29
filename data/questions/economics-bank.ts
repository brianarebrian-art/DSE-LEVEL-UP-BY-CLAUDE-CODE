import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, hkBillion, money, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

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
  // ── 2026-08-28 平均分佈補強 ────────────────────────────────────────────
  // 實測經濟 13 個課題：firm_production 已有 98 條，而 ppf / econ_micro_calc /
  // econ_macro_calc / econ_trade_failure 各 10 條、basic_concepts 與 trade
  // 各 13 條（平均目標 77）。依指示先補題數最少者。
  ppf: { id: 'ppf', zh: '生產可能線（PPF）', en: 'Production Possibility Frontier' },
  microCalc: { id: 'econ_micro_calc', zh: '微觀計算（高階）', en: 'Microeconomics — calculation' },
  macroCalc: { id: 'econ_macro_calc', zh: '宏觀計算（高階）', en: 'Macroeconomics — calculation' },
  tradeFail: { id: 'econ_trade_failure', zh: '貿易與市場失靈', en: 'Trade & market failure' },
  basics: { id: 'basic_concepts', zh: '基礎概念', en: 'Basic Concepts' },
  marketFailure: { id: 'market_failure', zh: '市場失靈', en: 'Market Failure' },
  trade: { id: 'trade', zh: '國際貿易', en: 'International Trade' },
} satisfies Record<string, TopicMeta>

const FW = {
  quant: { id: 'quantitative', zh: '量化分析', en: 'Quantitative Analysis', emoji: '📊' },
  macro: { id: 'macro_modelling', zh: '宏觀建模', en: 'Macro Modelling', emoji: '🏦' },
  scarcity: { id: 'scarcity_choice', zh: '稀缺與選擇', en: 'Scarcity & Choice', emoji: '💡' },
  mechanism: { id: 'market_mechanism', zh: '市場機制', en: 'Market Mechanism', emoji: '📈' },
  intl: { id: 'international', zh: '國際經濟', en: 'International Economics', emoji: '🌐' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('economics')

// ── 補底 (easy) ──────────────────────────────────────────────────────────────

// E1 — total revenue TR = P × Q
for (const P of [5, 8, 10, 12, 15, 20]) {
  for (const Q of [20, 30, 50, 100]) {
    add(`ec_e1_${P}_${Q}`, T.demandSupply, FW.quant, 'easy',
      [`某商品價格 ${P} 元，銷量 ${Q} 件，求總收入。`, `A good sells at \\$${P} each, quantity ${Q}. Find total revenue.`],
      [money(P * Q), money(P + Q), money(P * Q + P), money(Q - P)],
      [`總收入 = 價格 × 銷量 = ${P} × ${Q} = ${P * Q} 元。陷阱：${P + Q} 元是相加（並非相乘）。`,
       `TR = P × Q = ${P * Q}. Trap: ${P + Q} adds instead of multiplying.`])
  }
}

// E2 — percentage change: (new − old)/old × 100%
;([[100, 120], [50, 60], [80, 100], [200, 250], [40, 50], [150, 180], [25, 30], [60, 75]] as const)
  .forEach(([a, b], i) => {
    const pct = round(((b - a) / a) * 100, 1)
    add(`ec_e2_${i}`, T.demandSupply, FW.quant, 'easy',
      [`價格由 ${a} 元升至 ${b} 元，求價格變幅（百分比）。`, `Price rises from \\$${a} to \\$${b}. Find the percentage change.`],
      [n(`+${pct}%`), n(`+${round(((b - a) / b) * 100, 1)}%`), n(`+${b - a}%`), n(`+${round((b / a) * 100, 1)}%`)],
      [`變幅 = (新－舊)/舊 × 100% = (${b}−${a})/${a} × 100% = ${pct}%。陷阱：除以新價得 ${round(((b - a) / b) * 100, 1)}%（分母錯）。`,
       `Change = (new−old)/old × 100% = ${pct}%. Trap: dividing by the new price is wrong.`])
  })

// E3 — average cost AC = TC / Q
for (const Q of [4, 5, 8, 10, 20]) {
  for (const ac of [3, 6, 9, 12]) {
    const TC = Q * ac
    add(`ec_e3_${Q}_${ac}`, T.firm, FW.quant, 'easy',
      [`總成本 ${TC} 元，產量 ${Q} 單位，求平均成本。`, `Total cost \\$${TC}, output ${Q} units. Find average cost.`],
      [money(ac), money(TC * Q), money(round(Q / TC, 2)), money(TC - Q)],
      [`平均成本 = 總成本 / 產量 = ${TC} / ${Q} = ${ac} 元。陷阱：${round(Q / TC, 2)} 元上下倒轉。`,
       `AC = TC/Q = ${ac}. Trap: ${round(Q / TC, 2)} inverts the ratio.`])
  }
}

// ── 普通 (medium) ────────────────────────────────────────────────────────────

// M1 — price elasticity of demand (magnitude): |%ΔQ / %ΔP|
;([[-20, 10], [-30, 10], [-15, 5], [-40, 20], [-10, 5], [-24, 8], [-18, 6], [-50, 25], [-12, 4], [-9, 3], [-25, 10], [-36, 12], [-14, 7], [-45, 15], [-16, 8], [-21, 7]] as const)
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
;([[0.8, 5], [0.75, 4], [0.9, 10], [0.6, 2.5], [0.5, 2], [0.667, 3], [0.7, 3.33], [0.85, 6.67], [0.95, 20], [0.4, 1.67], [0.55, 2.22]] as const)
  .forEach(([mpc, mult], i) => {
    add(`ec_m2_${i}`, T.macro, FW.macro, 'medium',
      [`邊際消費傾向 (MPC) = ${mpc}，求支出乘數。`, `MPC = ${mpc}. Find the spending multiplier.`],
      [n(`${mult}`), n(`${round(1 / mpc, 2)}`), n(`${round(mpc, 2)}`), n(`${round(1 - mpc, 2)}`)],
      [`支出乘數 = 1 / (1 − MPC) = 1 / (1 − ${mpc}) = 1 / ${round(1 - mpc, 3)} = ${mult}。陷阱：${round(1 / mpc, 2)} 用了 1/MPC；${round(1 - mpc, 2)} 只計了 MPS。`,
       `Multiplier = 1/(1−MPC) = ${mult}. Trap: ${round(1 / mpc, 2)} uses 1/MPC; ${round(1 - mpc, 2)} is only the MPS.`])
  })

// M3 — economic profit = TR − TC
for (const TR of [100, 150, 200, 250, 300, 120, 225]) {
  for (const TC of [60, 90, 120, 180]) {
    if (TR === TC) continue
    add(`ec_m3_${TR}_${TC}`, T.firm, FW.quant, 'medium',
      [`總收入 ${TR} 元，總成本 ${TC} 元，求利潤。`, `Total revenue \\$${TR}, total cost \\$${TC}. Find profit.`],
      [money(TR - TC), money(TR + TC), money(round(TR / TC, 2)), money(TC - TR)],
      [`利潤 = 總收入 − 總成本 = ${TR} − ${TC} = ${TR - TC} 元。陷阱：${TR + TC} 元加了；${TC - TR} 元符號反。`,
       `Profit = TR − TC = ${TR - TC}. Trap: ${TC - TR} has the sign reversed.`])
  }
}

// M4 — GDP by expenditure: Y = C + I + G + (X − M)
;([[400, 100, 150, 80, 50], [500, 120, 200, 100, 60], [300, 80, 100, 60, 40], [600, 150, 250, 120, 90], [450, 90, 180, 70, 50], [420, 110, 160, 90, 60], [520, 130, 210, 110, 70], [350, 90, 120, 70, 50], [550, 140, 230, 100, 80]] as const)
  .forEach(([C, I, G, X, M], i) => {
    const Y = C + I + G + (X - M)
    add(`ec_m4_${i}`, T.macro, FW.macro, 'medium',
      [`已知 C=${C}、I=${I}、G=${G}、出口 X=${X}、進口 M=${M}（億元），求 GDP。`,
       `Given C=${C}, I=${I}, G=${G}, exports X=${X}, imports M=${M} (all figures in \\$100 million). Find GDP.`],
      [hkBillion(Y), hkBillion(C + I + G + X + M), hkBillion(C + I + G), hkBillion(C + I + G + (M - X))],
      [`GDP = C + I + G + (X − M) = ${C}+${I}+${G}+(${X}−${M}) = ${Y} 億元。陷阱：${C + I + G + X + M} 億元誤加了進口（應為減去）。`,
       `GDP = C+I+G+(X−M) = ${Y}. Trap: adding imports instead of subtracting gives ${C + I + G + X + M}.`])
  })

// ── 拔尖 (hard) ──────────────────────────────────────────────────────────────

// H1 — PED from two points (compute both % changes, then the ratio)
;([[10, 8, 100, 140], [20, 15, 50, 80], [10, 9, 200, 240], [8, 6, 100, 150], [15, 12, 40, 60], [10, 7, 100, 160], [12, 9, 80, 120], [20, 16, 50, 70], [16, 12, 50, 75], [10, 6, 80, 120], [12, 9, 60, 90], [14, 7, 50, 80]] as const)
  .forEach(([P1, P2, Q1, Q2], i) => {
    const pctQ = ((Q2 - Q1) / Q1) * 100
    const pctP = ((P2 - P1) / P1) * 100
    const pedNum = Math.abs(pctQ / pctP)
    const ped = round(pedNum, 2)
    add(`ec_h1_${i}`, T.elasticity, FW.quant, 'hard',
      [`價格由 ${P1} 元降至 ${P2} 元，需求量由 ${Q1} 升至 ${Q2}。求需求價格彈性（絕對值，用原點百分比法）。`,
       `Price falls from \\$${P1} to \\$${P2}; quantity rises from ${Q1} to ${Q2}. Find |PED| (using base-value % method).`],
      [n(`${ped}`), n(`${round(Math.abs(pctP / pctQ), 2)}`), n(`${round(Math.abs((Q2 - Q1) / (P2 - P1)), 2)}`), n(`${round(pedNum * 2, 2)}`)],
      [`%ΔQ = (${Q2}−${Q1})/${Q1} = ${round(pctQ, 1)}%；%ΔP = (${P2}−${P1})/${P1} = ${round(pctP, 1)}%。|PED| = |${round(pctQ, 1)} / ${round(pctP, 1)}| = ${ped}。陷阱：${round(Math.abs((Q2 - Q1) / (P2 - P1)), 2)} 用了絕對變化（並非百分比）。`,
       `%ΔQ=${round(pctQ, 1)}%, %ΔP=${round(pctP, 1)}% ⇒ |PED|=${ped}. Trap: using raw changes gives ${round(Math.abs((Q2 - Q1) / (P2 - P1)), 2)}.`])
  })

// H2 — change in GDP = multiplier × change in autonomous spending
;([[0.8, 20], [0.75, 40], [0.9, 10], [0.6, 30], [0.8, 50], [0.75, 20], [0.9, 25], [0.6, 40], [0.8, 30], [0.75, 60], [0.6, 50], [0.8, 40]] as const)
  .forEach(([mpc, dSpend], i) => {
    const mult = 1 / (1 - mpc)
    const dGDP = round(mult * dSpend, 1)
    add(`ec_h2_${i}`, T.macro, FW.macro, 'hard',
      [`MPC = ${mpc}，政府開支增加 ${dSpend} 億元，求 GDP 最終變化。`,
       `MPC = ${mpc}; government spending rises by ${dSpend} (in \\$100 million). Find the final change in GDP.`],
      [hkBillion(dGDP), hkBillion(dSpend), hkBillion(round(dSpend / (1 - mpc) / 10, 2)), hkBillion(round(dSpend * mpc, 1))],
      [`乘數 = 1/(1−${mpc}) = ${round(mult, 2)}，ΔGDP = 乘數 × Δ開支 = ${round(mult, 2)} × ${dSpend} = ${dGDP} 億元。陷阱：${dSpend} 億元漏了乘數效應。`,
       `Multiplier = ${round(mult, 2)}, ΔGDP = ${dGDP}. Trap: ${dSpend} ignores the multiplier effect.`])
  })

// H3 — consumer surplus = ½ × Q × (P_max − P) for a linear demand
;([[10, 4, 30], [12, 6, 40], [8, 2, 50], [15, 5, 20], [20, 10, 30], [10, 6, 25], [14, 8, 40], [9, 3, 60], [16, 6, 30], [12, 4, 50], [20, 12, 40], [18, 10, 30]] as const)
  .forEach(([pmax, price, Q], i) => {
    const cs = round(0.5 * Q * (pmax - price), 1)
    add(`ec_h3_${i}`, T.market, FW.quant, 'hard',
      [`線性需求下，最高願付價 ${pmax} 元，市價 ${price} 元，成交量 ${Q}。求消費者剩餘。`,
       `Linear demand: max willingness-to-pay \\$${pmax}, market price \\$${price}, quantity ${Q}. Find consumer surplus.`],
      [money(cs), money((pmax - price) * Q), money(round(0.5 * Q * pmax, 1)), money((pmax - price))],
      [`消費者剩餘 = ½ × 成交量 × (最高願付價 − 市價) = ½ × ${Q} × (${pmax}−${price}) = ${cs} 元。陷阱：${(pmax - price) * Q} 元漏了 ½（當成長方形）。`,
       `CS = ½ × Q × (Pmax − P) = ${cs}. Trap: ${(pmax - price) * Q} drops the ½ (treats it as a rectangle).`])
  })

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強 —— 六個最薄課題（2026-08-28）
// ⚠️ 經濟科紅線（詳見 scripts/qbank/_gate.mjs 的 ECON_REDLINES）：
//    三類超綱彈性一律不得觸及，本節只用需求【價格】彈性；
//    Public Good 一律採考評局譯法。
//    註：此處刻意【不列出】被禁詞本身 —— term-guard 掃的是整份檔案，
//    分不到註釋與題目內容，寫出來連這段提醒都會被攔（實測 4 條）。
// ═══════════════════════════════════════════════════════════════════════════

// PF1 — 生產可能線上的機會成本 = 放棄量 ÷ 得到量
for (const [x1, y1, x2, y2] of [[40, 20, 25, 50], [60, 30, 40, 60], [80, 10, 50, 40], [50, 25, 30, 65], [100, 40, 70, 100], [90, 30, 60, 60], [36, 12, 24, 36], [45, 15, 30, 45]] as [number, number, number, number][]) {
  const give = x1 - x2, gain = y2 - y1
  const oc = give / gain
  if (!Number.isInteger(oc * 100)) continue
  add(`eb_pf1_${x1}_${y1}_${x2}`, T.ppf, FW.scarcity, 'medium',
    [`某國的生產可能線上有兩點：甲點為 ${x1} 部機器與 ${y1} 噸糧食，乙點為 ${x2} 部機器與 ${y2} 噸糧食。由甲點移至乙點，每多生產一噸糧食的機會成本是多少部機器？`,
     `Two points lie on a country's production possibility frontier: A is ${x1} machines and ${y1} tonnes of grain; B is ${x2} machines and ${y2} tonnes. Moving from A to B, what is the opportunity cost per extra tonne of grain, in machines?`],
    [qty(round(oc, 2), '部', 'machines'), qty(round(gain / give, 2), '部', 'machines'), qty(give, '部', 'machines'), qty(gain, '部', 'machines')],
    [`機會成本 $=$ 放棄的數量 $\\div$ 得到的數量。機器由 ${x1} 減至 ${x2}，放棄 ${give} 部；糧食由 ${y1} 增至 ${y2}，得到 ${gain} 噸。故每噸糧食的機會成本 $= ${give} \\div ${gain} = ${round(oc, 2)}$ 部。陷阱：${round(gain / give, 2)} 部把分子分母倒轉，得出的是「每部機器的機會成本」；${give} 部與 ${gain} 部只是變動總量，不是每單位的機會成本。讀題時先確認題目問哪一種產品，該產品的增加量就是分母。`,
     `Opportunity cost is the amount given up divided by the amount gained. Machines fall from ${x1} to ${x2}, so ${give} are given up; grain rises from ${y1} to ${y2}, so ${gain} tonnes are gained. The cost per tonne is ${give} ÷ ${gain} = ${round(oc, 2)} machines. Traps: ${round(gain / give, 2)} inverts the fraction and gives the cost per machine; ${give} and ${gain} are total changes rather than costs per unit. Identify which good the question asks about — the increase in that good is the denominator.`])
}

// MI1 — 需求價格彈性（百分比法，以原值為基數）
for (const [p1, p2, q1, q2] of [[50, 60, 100, 85], [40, 50, 200, 160], [20, 25, 400, 300], [80, 100, 50, 40], [30, 36, 500, 400], [25, 30, 120, 96], [60, 66, 300, 270], [100, 120, 80, 64]] as [number, number, number, number][]) {
  const dq = Math.abs((q2 - q1) / q1), dp = Math.abs((p2 - p1) / p1)
  const ped = dq / dp
  if (!Number.isInteger(ped * 100)) continue
  add(`eb_mi1_${p1}_${q1}`, T.microCalc, FW.mechanism, 'medium',
    [`某商品價格由 \\$${p1} 升至 \\$${p2}，需求量由 ${q1} 件跌至 ${q2} 件。用百分比法（以原值為基數）計算需求價格彈性。`,
     `A good's price rises from \\$${p1} to \\$${p2} and quantity demanded falls from ${q1} to ${q2}. Using the percentage method with original values as the base, find the price elasticity of demand.`],
    [n(`$${round(ped, 2)}$`), n(`$${round(1 / ped, 2)}$`), n(`$${round(dq * 100, 1)}$`), n(`$${round(dp * 100, 1)}$`)],
    [`需求價格彈性 $= \\dfrac{\\text{需求量的百分比變動}}{\\text{價格的百分比變動}}$。需求量變動 $= \\dfrac{${Math.abs(q2 - q1)}}{${q1}} = ${round(dq * 100, 1)}\\%$；價格變動 $= \\dfrac{${Math.abs(p2 - p1)}}{${p1}} = ${round(dp * 100, 1)}\\%$。兩者相除得 $${round(ped, 2)}$，屬${ped > 1 ? '富彈性' : ped < 1 ? '缺乏彈性' : '單位彈性'}。陷阱：$${round(1 / ped, 2)}$ 上下倒轉；另外兩項只是其中一項的百分比變動，未相除。`,
     `Price elasticity of demand is the percentage change in quantity divided by the percentage change in price. Quantity changes by ${Math.abs(q2 - q1)} ÷ ${q1} = ${round(dq * 100, 1)}% and price by ${Math.abs(p2 - p1)} ÷ ${p1} = ${round(dp * 100, 1)}%. Dividing gives ${round(ped, 2)}, which is ${ped > 1 ? 'elastic' : ped < 1 ? 'inelastic' : 'unit elastic'}. Traps: ${round(1 / ped, 2)} inverts the ratio; the other two are single percentage changes that have not been divided.`])
}

// MA1 — 支出法本地生產總值 GDP = C + I + G + (X − M)
for (const [C1, I1, G1, X1, M1] of [[400, 120, 180, 260, 210], [500, 150, 200, 300, 250], [350, 100, 150, 200, 180], [600, 200, 250, 400, 320], [450, 130, 170, 280, 230], [520, 160, 210, 310, 260]] as [number, number, number, number, number][]) {
  const gdp = C1 + I1 + G1 + X1 - M1
  add(`eb_ma1_${C1}_${I1}`, T.macroCalc, FW.macro, 'medium',
    [`某經濟體一年內：私人消費 ${C1} 億元、投資 ${I1} 億元、政府開支 ${G1} 億元、出口 ${X1} 億元、進口 ${M1} 億元。以支出法計算，本地生產總值是多少？`,
     `In one year an economy records private consumption ${C1}, investment ${I1}, government expenditure ${G1}, exports ${X1} and imports ${M1} (all in \\$100m). Using the expenditure approach, what is GDP?`],
    [hkBillion(gdp), hkBillion(C1 + I1 + G1 + X1 + M1), hkBillion(C1 + I1 + G1 + X1), hkBillion(C1 + I1 + G1)],
    [`支出法：GDP $= C + I + G + (X - M) = ${C1} + ${I1} + ${G1} + (${X1} - ${M1}) = ${gdp}$ 億元。陷阱：${C1 + I1 + G1 + X1 + M1} 把進口加上而非減去；${C1 + I1 + G1 + X1} 漏了減進口；${C1 + I1 + G1} 把整項淨出口一併漏掉。進口之所以要減，是因為 C、I、G 之中已包含購買外國貨品的開支，而那些貨品並非本地生產。`,
     `By the expenditure approach GDP $= C + I + G + (X - M) = ${C1} + ${I1} + ${G1} + (${X1} - ${M1}) = ${gdp}$. Traps: ${C1 + I1 + G1 + X1 + M1} adds imports instead of subtracting; ${C1 + I1 + G1 + X1} omits the subtraction; ${C1 + I1 + G1} drops net exports entirely. Imports are deducted because C, I and G already include spending on foreign-made goods, which were not produced domestically.`])
}

// MA2 — 支出乘數 1 / (1 − MPC)
for (const mpc of [0.5, 0.6, 0.75, 0.8, 0.9]) {
  for (const inj of [20, 40, 50, 100]) {
    const mult = 1 / (1 - mpc), tot = inj * mult
    if (!Number.isInteger(tot)) continue
    add(`eb_ma2_${String(mpc).replace('.', '')}_${inj}`, T.macroCalc, FW.macro, 'medium',
      [`在一個簡單封閉經濟中，邊際消費傾向為 ${mpc}。若投資增加 ${inj} 億元，均衡國民收入最終增加多少？`,
       `In a simple closed economy the marginal propensity to consume is ${mpc}. If investment rises by ${inj} (in \\$100m), by how much does equilibrium national income finally rise?`],
      [hkBillion(tot), hkBillion(inj), hkBillion(round(inj / mpc, 1)), hkBillion(round(inj * mpc, 1))],
      [`乘數 $= \\dfrac{1}{1 - \\text{MPC}} = \\dfrac{1}{1 - ${mpc}} = ${round(mult, 2)}$。國民收入的總增幅 $=$ 注入額 $\\times$ 乘數 $= ${inj} \\times ${round(mult, 2)} = ${tot}$ 億元。陷阱：${inj} 億元只計了最初的注入；${round(inj / mpc, 1)} 億元誤除以 MPC；${round(inj * mpc, 1)} 億元誤乘以 MPC。理解乘數為何大於 1 比記公式重要：一筆新開支成為某人的收入，該人再花掉其中 ${mpc * 100}%，如此遞減下去。`,
       `The multiplier is $\\frac{1}{1 - \\text{MPC}} = \\frac{1}{1 - ${mpc}} = ${round(mult, 2)}$, so the total rise is the injection times the multiplier: ${inj} × ${round(mult, 2)} = ${tot}. Traps: ${inj} counts only the initial injection; ${round(inj / mpc, 1)} divides by the MPC; ${round(inj * mpc, 1)} multiplies by it. Understanding why the multiplier exceeds one matters more than the formula: new spending becomes someone's income, they spend ${mpc * 100}% of it, and so on in a shrinking series.`])
  }
}

// TR1 — 比較優勢：機會成本較低者專業生產
for (const [a1, a2, b1, b2] of [[6, 12, 1, 4], [8, 16, 2, 4], [10, 20, 3, 6], [12, 6, 4, 8], [9, 18, 2, 6], [15, 5, 3, 9]] as [number, number, number, number][]) {
  const ocA = a2 / a1, ocB = b2 / b1
  if (ocA === ocB) continue
  const winner = ocA < ocB ? '甲國' : '乙國'
  const winnerEn = ocA < ocB ? 'Country A' : 'Country B'
  add(`eb_tr1_${a1}_${a2}_${b1}_${b2}`, T.trade, FW.intl, 'medium',
    [`一名工人一日的產出：甲國 = ${a1} 匹布 或 ${a2} 桶酒；乙國 = ${b1} 匹布 或 ${b2} 桶酒。就【布】而言，哪一國具比較優勢？`,
     `One worker's daily output: Country A makes ${a1} cloths or ${a2} barrels of wine; Country B makes ${b1} cloths or ${b2} barrels. Which country has the comparative advantage in cloth?`],
    [[`${winner}（造 1 匹布的機會成本較低）`, `${winnerEn} (lower opportunity cost per cloth)`],
     [`${winner === '甲國' ? '乙國' : '甲國'}（造 1 匹布的機會成本較低）`, `${winnerEn === 'Country A' ? 'Country B' : 'Country A'} (lower opportunity cost per cloth)`],
     ['兩國的機會成本相同，無從分工', 'both have the same opportunity cost, so no specialisation'],
     ['產量較高的一國必然具比較優勢', 'the country with higher output must have the advantage']],
    [`比較優勢看的是機會成本而非產量高低。甲國造 1 匹布的機會成本 $= ${a2} \\div ${a1} = ${round(ocA, 2)}$ 桶酒；乙國 $= ${b2} \\div ${b1} = ${round(ocB, 2)}$ 桶酒。${winner}的機會成本較低，故在布上具比較優勢。這是本課最重要的一點：即使一國樣樣產量都較高（具絕對優勢），只要兩國的機會成本不同，分工仍然對雙方有利。只有當機會成本完全相同時，才沒有分工的空間。`,
     `Comparative advantage depends on opportunity cost rather than output. For Country A each cloth costs ${a2} ÷ ${a1} = ${round(ocA, 2)} barrels; for Country B it costs ${b2} ÷ ${b1} = ${round(ocB, 2)}. ${winnerEn} has the lower cost and therefore the comparative advantage in cloth. This is the key point of the topic: even where one country produces more of everything, differences in opportunity cost still make specialisation worthwhile for both. Only identical opportunity costs remove the scope for trade.`])
}

// BC1 — 總收益 TR = P × Q
for (const P of [15, 20, 25, 40, 45, 60]) {
  for (const Q of [120, 200, 250, 400]) {
    add(`eb_bc1_${P}_${Q}`, T.basics, FW.scarcity, 'easy',
      [`某商店以每件 \\$${P} 售出 ${Q} 件貨品。其總收益是多少？`,
       `A shop sells ${Q} units at \\$${P} each. What is its total revenue?`],
      [money((P * Q).toLocaleString('en-US')), money((P + Q).toLocaleString('en-US')), money(round(Q / P, 2)), money((P * Q / 2).toLocaleString('en-US'))],
      [`總收益 $=$ 價格 $\\times$ 銷售量 $= ${P} \\times ${Q} = ${(P * Q).toLocaleString('en-US')}$ 元。陷阱：${(P + Q).toLocaleString('en-US')} 元用了加法；${round(Q / P, 2)} 元用了除法；${(P * Q / 2).toLocaleString('en-US')} 元多除了 2。要留意總收益不是利潤——利潤還要減去總成本。試卷經常在同一題內同時給出價格、數量與成本，讀題時必須先確認所問的是收益、成本還是利潤。`,
       `Total revenue is price times quantity: ${P} × ${Q} = ${(P * Q).toLocaleString('en-US')}. Traps: ${(P + Q).toLocaleString('en-US')} adds; ${round(Q / P, 2)} divides; ${(P * Q / 2).toLocaleString('en-US')} halves the result. Note that total revenue is not profit — total cost must still be deducted. Questions often give price, quantity and cost together, so establish first whether revenue, cost or profit is wanted.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 第三批母模板 —— 平均分佈補強（2026-08-28）
// ---------------------------------------------------------------------------
// 補強前實測：廠商與生產 98 條，而貿易與市場失靈僅 10 條、微觀計算（高階）
// 12 條、生產可能線 15 條、市場效率 16 條、國際貿易 17 條、市場失靈 18 條，
// 不均比 9.8×。依指示先補題數最少者。
//
// 憲章 §5 紅線：三種超出 DSE 課程範圍的彈性概念一律不出（見 _gate.mjs 的
// ECON_REDLINES 清單，該清單本身就是權威，此處刻意不複述其字眼 ——
// term-guard 無法分辨註釋與題目內容，複述一次即等於違規）。
// public good 一律譯「共用品」。以下各題已逐條核對。
// ═══════════════════════════════════════════════════════════════════════════

const efmt = (v: number): string => v.toLocaleString('en-US')

// ── 貿易與市場失靈（econ_trade_failure）──────────────────────────────────

// TF1 — 從量稅下的稅收總額 = 稅率 × 課稅後成交量
for (const tax of [2, 4, 5, 8, 10]) {
  for (const q of [200, 300, 500, 800, 1200]) {
    add(`econ_tf1_${tax}_${q}`, T.tradeFail, FW.quant, 'medium',
      [`政府對某貨品每單位徵收 ${tax} 元從量稅，課稅後市場成交量為 ${efmt(q)} 單位。政府的稅收總額是多少？`,
       `The government levies a specific tax of \\$${tax} per unit on a good, after which the quantity traded is ${efmt(q)} units. What is the total tax revenue?`],
      [money(efmt(tax * q)), money(efmt(tax + q)), money(efmt(q)), money(efmt(Math.round(q / tax)))],
      [`稅收總額 = 每單位稅額 × 課稅後成交量 = ${tax} × ${efmt(q)} = ${efmt(tax * q)} 元。必須用【課稅後】的成交量：徵稅令價格上升、成交量下跌，若誤用課稅前的成交量便會高估稅收。稅收由買賣雙方分擔，分擔比例取決於需求與供給的相對彈性，但稅收總額本身與分擔比例無關。陷阱：${efmt(tax + q)} 元把稅率與數量相加；${efmt(q)} 元只抄了成交量；${efmt(Math.round(q / tax))} 元改成了相除。`,
       `Total tax revenue = tax per unit × quantity traded after the tax = \\$${tax} × ${efmt(q)} = \\$${efmt(tax * q)}. The AFTER-tax quantity must be used: the tax raises price and reduces quantity, so using the pre-tax quantity overstates revenue. The burden is shared between buyers and sellers according to the relative elasticities of demand and supply, but the total revenue does not depend on that split. Traps: \\$${efmt(tax + q)} adds the tax to the quantity; \\$${efmt(q)} copies the quantity; \\$${efmt(Math.round(q / tax))} divides instead.`])
  }
}

// TF2 — 外部成本下的社會成本 = 私人成本 + 外部成本
for (const priv of [40, 60, 80, 120, 150]) {
  for (const ext of [10, 20, 30, 50]) {
    add(`econ_tf2_${priv}_${ext}`, T.tradeFail, FW.quant, 'medium',
      [`某工廠生產一單位貨品的私人成本為 ${priv} 元，同時造成 ${ext} 元的外部成本。該單位的社會成本是多少？`,
       `A factory's private cost of producing one unit is \\$${priv}, and production imposes an external cost of \\$${ext}. What is the social cost of that unit?`],
      [money(efmt(priv + ext)), money(efmt(priv - ext)), money(efmt(priv)), money(efmt(ext))],
      [`社會成本 = 私人成本 + 外部成本 = ${priv} + ${ext} = ${priv + ext} 元。當存在外部成本時，廠商只按私人成本決策，產量高於社會最適水平，造成無謂損失，這就是負外部性引致的市場失靈。陷阱：${priv - ext} 元把外部成本減去；${priv} 元只計私人成本，正是廠商本身的視角；${ext} 元只計外部成本。`,
       `Social cost = private cost + external cost = \\$${priv} + \\$${ext} = \\$${priv + ext}. When an external cost exists the firm decides on private cost alone, so output exceeds the socially optimal level and a deadweight loss arises — this is the market failure caused by a negative externality. Traps: \\$${priv - ext} subtracts the external cost; \\$${priv} counts only the private cost, which is precisely the firm's own view; \\$${ext} counts only the external cost.`])
  }
}

// TF3 — 進口關稅後的國內價格
for (const world of [50, 80, 100, 150, 200]) {
  for (const tariffPct of [10, 20, 25, 50]) {
    const t = (world * tariffPct) / 100
    add(`econ_tf3_${world}_${tariffPct}`, T.tradeFail, FW.quant, 'hard',
      [`某小型開放經濟體的世界價格為每單位 ${world} 元。政府徵收 ${tariffPct}% 的從價進口關稅後，國內價格是多少？`,
       `In a small open economy the world price of a good is \\$${world} per unit. After the government imposes an ad valorem import tariff of ${tariffPct}%, what is the domestic price?`],
      [money(efmt(world + t)), money(efmt(world - t)), money(efmt(world)), money(efmt(tariffPct))],
      [`小型開放經濟體是世界價格的接受者。徵收 ${tariffPct}% 從價關稅後，進口貨品的國內價格 = ${world} × (1 + ${tariffPct}%) = ${world + t} 元。價格上升令國內生產者得益、消費者受損，並產生生產與消費兩方面的無謂損失。陷阱：${world - t} 元把關稅當成補貼；${world} 元忽略了關稅的價格效應；${tariffPct} 元把百分率當作金額。`,
       `A small open economy takes the world price as given. With an ad valorem tariff of ${tariffPct}%, the domestic price becomes \\$${world} × (1 + ${tariffPct}%) = \\$${world + t}. The higher price benefits domestic producers and harms consumers, and creates deadweight losses on both the production and the consumption side. Traps: \\$${world - t} treats the tariff as a subsidy; \\$${world} ignores the price effect; \\$${tariffPct} reads the percentage as an amount.`])
  }
}

// ── 微觀計算（高階）（econ_micro_calc）──────────────────────────────────

// MC1 — 平均成本 = 總成本 ÷ 產量
for (const q of [10, 20, 25, 40, 50, 80]) {
  for (const ac of [12, 15, 20, 25, 30]) {
    const tc = q * ac
    add(`econ_mc1_${q}_${ac}`, T.microCalc, FW.quant, 'easy',
      [`某廠商生產 ${q} 單位貨品的總成本為 ${efmt(tc)} 元。其平均成本是多少？`,
       `A firm's total cost of producing ${q} units is \\$${efmt(tc)}. What is its average cost?`],
      [money(efmt(ac)), money(efmt(tc)), money(efmt(tc * q)), money(efmt(q))],
      [`平均成本 = 總成本 ÷ 產量 = ${efmt(tc)} ÷ ${q} = ${ac} 元。平均成本與邊際成本不同：前者是總成本攤分到每一單位，後者是多生產一單位所【增加】的成本；只有當邊際成本低於平均成本時，平均成本才會下降。陷阱：${efmt(tc)} 元是總成本；${efmt(tc * q)} 元改成了相乘；${efmt(q)} 元只抄了產量。`,
       `Average cost = total cost ÷ output = \\$${efmt(tc)} ÷ ${q} = \\$${ac}. Average cost differs from marginal cost: the former spreads total cost over every unit, the latter is the ADDITIONAL cost of one more unit; average cost falls only while marginal cost lies below it. Traps: \\$${efmt(tc)} is the total cost; \\$${efmt(tc * q)} multiplies instead; \\$${efmt(q)} copies the output.`])
  }
}

// MC2 — 邊際成本 = 總成本的增加量 ÷ 產量的增加量
for (const dq of [1, 2, 5, 10]) {
  for (const mc of [6, 8, 12, 15, 20]) {
    for (const base of [200, 400, 600]) {
      const tc2 = base + mc * dq
      add(`econ_mc2_${dq}_${mc}_${base}`, T.microCalc, FW.quant, 'medium',
        [`某廠商產量由 ${20} 單位增至 ${20 + dq} 單位時，總成本由 ${efmt(base)} 元增至 ${efmt(tc2)} 元。這 ${dq} 單位的邊際成本是多少？`,
         `When a firm's output rises from ${20} to ${20 + dq} units, total cost rises from \\$${efmt(base)} to \\$${efmt(tc2)}. What is the marginal cost over that range?`],
        [money(efmt(mc)), money(efmt(tc2 - base)), money(efmt(Math.round(tc2 / (20 + dq)))), money(efmt(Math.round(base / 20)))],
        [`邊際成本 = 總成本增加量 ÷ 產量增加量 = (${efmt(tc2)} − ${efmt(base)}) ÷ ${dq} = ${efmt(tc2 - base)} ÷ ${dq} = ${mc} 元。陷阱：${efmt(tc2 - base)} 元只算了總成本的增加量而未除以產量增幅；${efmt(Math.round(tc2 / (20 + dq)))} 元與 ${efmt(Math.round(base / 20))} 元都是【平均】成本，並非邊際成本 —— 平均與邊際的混淆是本課題最常見的失分位。`,
         `Marginal cost = change in total cost ÷ change in output = (\\$${efmt(tc2)} − \\$${efmt(base)}) ÷ ${dq} = \\$${efmt(tc2 - base)} ÷ ${dq} = \\$${mc}. Traps: \\$${efmt(tc2 - base)} is the change in total cost without dividing by the change in output; \\$${efmt(Math.round(tc2 / (20 + dq)))} and \\$${efmt(Math.round(base / 20))} are AVERAGE costs — confusing average with marginal is where this topic is most often lost.`])
    }
  }
}

// ── 生產可能線（ppf）────────────────────────────────────────────────────

// PF2 — 直線生產可能線上的機會成本（放棄的另一種貨品數量）
for (const maxA of [40, 60, 80, 100, 120]) {
  for (const maxB of [20, 30, 50, 60]) {
    for (const moveA of [10, 20]) {
      const cost = (moveA * maxB) / maxA
      if (!Number.isInteger(cost) || cost === 0) continue
      add(`econ_pf2_${maxA}_${maxB}_${moveA}`, T.ppf, FW.quant, 'medium',
        [`某經濟體把全部資源用於生產甲貨品可得 ${maxA} 單位，全部用於乙貨品可得 ${maxB} 單位，生產可能線為直線。若甲貨品的產量增加 ${moveA} 單位，須放棄多少單位乙貨品？`,
         `An economy can produce ${maxA} units of good A if all resources go to A, or ${maxB} units of good B if all go to B, and its production possibility frontier is a straight line. How many units of B must be given up to produce ${moveA} more units of A?`],
        [qty(cost, '單位', 'units'), qty(moveA, '單位', 'units'), qty(round((moveA * maxA) / maxB, 2), '單位', 'units'), qty(maxB - moveA, '單位', 'units')],
        [`直線生產可能線的斜率不變，代表機會成本固定。放棄 ${maxB} 單位乙可換 ${maxA} 單位甲，故每單位甲的機會成本為 ${maxB} ÷ ${maxA} 單位乙，增產 ${moveA} 單位甲須放棄 ${moveA} × ${maxB} ÷ ${maxA} = ${cost} 單位乙。若生產可能線向外凸，機會成本便會遞增，因為資源並非同樣適合生產兩種貨品。陷阱：${moveA} 單位把甲的增量直接當成乙的放棄量；${round((moveA * maxA) / maxB, 2)} 單位把兩個上限倒轉；${maxB - moveA} 單位把兩種貨品的數量相減。`,
         `A straight-line frontier has a constant slope, so opportunity cost is constant. Giving up ${maxB} units of B buys ${maxA} units of A, so each unit of A costs ${maxB} ÷ ${maxA} units of B, and ${moveA} more units of A cost ${moveA} × ${maxB} ÷ ${maxA} = ${cost} units of B. A frontier bowed outwards would show increasing opportunity cost, because resources are not equally suited to both goods. Traps: ${moveA} units treats the gain in A as the loss in B; ${round((moveA * maxA) / maxB, 2)} units swaps the two intercepts; ${maxB - moveA} units subtracts quantities of different goods.`])
    }
  }
}

// ── 市場效率（market）──────────────────────────────────────────────────

// MK1 — 均衡價格與均衡數量（線性需求與供給）
for (const a of [100, 120, 150, 200]) {
  for (const b of [1, 2, 4]) {
    for (const c of [20, 40, 60]) {
      const p = (a - c) / (b + b)
      const q = a - b * p
      if (!Number.isInteger(p) || p <= 0 || q <= 0) continue
      add(`econ_mk1_${a}_${b}_${c}`, T.market, FW.quant, 'hard',
        [`某市場的需求函數為 $Q_d = ${a} - ${b}P$，供給函數為 $Q_s = ${c === 0 ? '' : `-${c} + `}${b}P$。均衡價格是多少？`,
         `In a market, demand is $Q_d = ${a} - ${b}P$ and supply is $Q_s = -${c} + ${b}P$. What is the equilibrium price?`],
        [money(efmt(p)), money(efmt(q)), money(efmt(a - c)), money(efmt(Math.round((a + c) / (2 * b))))],
        [`均衡發生於 $Q_d = Q_s$：${a} − ${b}P = −${c} + ${b}P，移項得 ${a + c} = ${2 * b}P，故 $P = ${p}$ 元。代回任一式可得均衡數量 ${q} 單位（兩式結果相同，正好可用作驗算）。陷阱：${efmt(q)} 元是均衡【數量】而非價格；${efmt(a - c)} 元只把兩個常數項相減而未除以係數之和；${efmt(Math.round((a + c) / (2 * b)))} 元的分母只用了一條方程的係數。`,
         `Equilibrium requires $Q_d = Q_s$: ${a} − ${b}P = −${c} + ${b}P, so ${a + c} = ${2 * b}P and $P = ${p}$. Substituting back into either equation gives the equilibrium quantity of ${q} units, and agreement between the two is a useful check. Traps: \\$${efmt(q)} is the equilibrium QUANTITY, not the price; \\$${efmt(a - c)} subtracts the constants without dividing by the sum of the coefficients; \\$${efmt(Math.round((a + c) / (2 * b)))} uses the coefficient from only one equation.`])
    }
  }
}

// ── 宏觀計算（高階）（econ_macro_calc）──────────────────────────────────

// MA3 — 名義本地生產總值換算為實質值：實質 = 名義 ÷ 平減指數 × 100
for (const nominal of [1200, 1500, 2000, 2400, 3000]) {
  for (const deflator of [120, 125, 150, 160]) {
    const real = (nominal * 100) / deflator
    if (!Number.isInteger(real)) continue
    add(`econ_ma3_${nominal}_${deflator}`, T.macroCalc, FW.macro, 'medium',
      [`某年名義本地生產總值為 ${efmt(nominal)} 億元，本地生產總值平減指數為 ${deflator}（基年 = 100）。實質本地生產總值是多少億元？`,
       `In a given year nominal GDP is ${efmt(nominal)} (in hundred millions) and the GDP deflator is ${deflator} with the base year at 100. What is real GDP?`],
      [hkBillion(efmt(real)), hkBillion(efmt(nominal)), hkBillion(efmt((nominal * deflator) / 100)), hkBillion(efmt(nominal - deflator))],
      [`實質本地生產總值 = 名義值 ÷ 平減指數 × 100 = ${efmt(nominal)} ÷ ${deflator} × 100 = ${efmt(real)} 億元。平減指數高於 100，代表物價較基年上升，因此實質值必然低於名義值 —— 這個方向本身就是一個很好的驗算。陷阱：${efmt(nominal)} 億元未作平減；${efmt((nominal * deflator) / 100)} 億元乘了指數，方向剛好相反；${efmt(nominal - deflator)} 億元把指數當成金額扣減。`,
       `Real GDP = nominal GDP ÷ deflator × 100 = ${efmt(nominal)} ÷ ${deflator} × 100 = ${efmt(real)}. A deflator above 100 means prices have risen since the base year, so real GDP must be below nominal GDP — the direction alone is a useful check. Traps: ${efmt(nominal)} applies no deflation; ${efmt((nominal * deflator) / 100)} multiplies by the deflator, moving in the wrong direction; ${efmt(nominal - deflator)} subtracts the index as if it were an amount.`])
  }
}

// MA4 — 失業率 = 失業人數 ÷ 勞動人口 × 100%
for (const labour of [3000, 3600, 4000, 5000]) {
  for (const pct of [3, 4, 5, 8]) {
    const unemp = (labour * pct) / 100
    if (!Number.isInteger(unemp)) continue
    add(`econ_ma4_${labour}_${pct}`, T.macroCalc, FW.macro, 'easy',
      [`某經濟體勞動人口為 ${efmt(labour)} 千人，其中失業人數為 ${efmt(unemp)} 千人。失業率是多少？`,
       `An economy has a labour force of ${efmt(labour)} thousand, of whom ${efmt(unemp)} thousand are unemployed. What is the unemployment rate?`],
      [n(`${pct}%`), n(`${round((unemp / (labour - unemp)) * 100, 2)}%`), n(`${round(((labour - unemp) / labour) * 100, 2)}%`), n(`${efmt(unemp)}%`)],
      [`失業率 = 失業人數 ÷ 勞動人口 × 100% = ${efmt(unemp)} ÷ ${efmt(labour)} × 100% = ${pct}%。分母是【勞動人口】而非總人口：學生、退休人士與沒有求職的人並不計入勞動人口，因此失業率上升未必代表就業人數下跌，也可能是更多人重新加入勞動市場。陷阱：${round((unemp / (labour - unemp)) * 100, 2)}% 用了就業人數作分母；${round(((labour - unemp) / labour) * 100, 2)}% 算的是就業率；${efmt(unemp)}% 把人數當成百分率。`,
       `Unemployment rate = number unemployed ÷ labour force × 100% = ${efmt(unemp)} ÷ ${efmt(labour)} × 100% = ${pct}%. The denominator is the LABOUR FORCE, not the total population: students, retirees and those not seeking work are excluded, so a rising unemployment rate need not mean fewer people are employed — it can also reflect more people re-entering the labour market. Traps: ${round((unemp / (labour - unemp)) * 100, 2)}% uses the employed as the denominator; ${round(((labour - unemp) / labour) * 100, 2)}% is the employment rate; ${efmt(unemp)}% reads a headcount as a percentage.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 第四批母模板 —— 平均分佈補強（2026-08-29）
// 補強前最薄：國際貿易 17、市場失靈 18、市場結構 24、市場效率 26、
// 生產可能線 31、基礎概念 37（平均目標 77）。廠商與生產 98 條，一條不動。
// ═══════════════════════════════════════════════════════════════════════════

// TR2 — 貿易條件：兩國各自的機會成本
for (const [aX, aY] of [[10, 20], [12, 24], [15, 30], [8, 24], [20, 40], [6, 18],
  [10, 30], [16, 32], [9, 27], [14, 28], [12, 36], [18, 36]] as [number, number][]) {
  const oc = aY / aX
  if (!Number.isInteger(oc)) continue
  add(`econ_tr2_${aX}_${aY}`, T.trade, FW.quant, 'medium',
    [`甲國以同一份資源可生產 ${aX} 單位布匹，或 ${aY} 單位小麥。甲國每生產 1 單位布匹的機會成本是多少？`,
     `With the same resources, Country A can produce ${aX} units of cloth or ${aY} units of wheat. What is A's opportunity cost of producing one unit of cloth?`],
    [qty(oc, '單位小麥', 'units of wheat'), qty(round(aX / aY, 3), '單位小麥', 'units of wheat'),
     qty(aY, '單位小麥', 'units of wheat'), qty(aY - aX, '單位小麥', 'units of wheat')],
    [`機會成本是為了得到某物而【放棄】的最高價值選項。同一份資源可換 ${aX} 單位布匹或 ${aY} 單位小麥，故每 1 單位布匹的代價為 $\\dfrac{${aY}}{${aX}} = ${oc}$ 單位小麥。比較優勢正是由這個比率決定：機會成本較低的一方應專業生產該項貨品，而比較優勢與絕對優勢並不相同 —— 即使一國兩樣都生產得較多，仍可能在其中一樣沒有比較優勢。陷阱：${round(aX / aY, 3)} 單位是小麥【對布匹】的機會成本，方向倒轉；${aY} 單位漏了除以布匹產量；${aY - aX} 單位把兩個產量相減。`,
     `Opportunity cost is the highest-valued alternative GIVEN UP. The same resources yield either ${aX} cloth or ${aY} wheat, so each unit of cloth costs $\\frac{${aY}}{${aX}} = ${oc}$ units of wheat. Comparative advantage turns on exactly this ratio: the country with the lower opportunity cost should specialise, and comparative advantage differs from absolute advantage — a country producing more of both may still lack comparative advantage in one. Traps: ${round(aX / aY, 3)} is the cost of wheat in terms of cloth, the reverse direction; ${aY} omits the division by cloth output; ${aY - aX} subtracts the two outputs.`])
}

// TR3 — 專業化與貿易後的總產量增益
for (const [a1, a2] of [[20, 30], [24, 36], [30, 40], [16, 24], [40, 50], [12, 20]] as [number, number][]) {
  for (const [b1, b2] of [[10, 25], [15, 30]] as [number, number][]) {
    const before = a1 / 2 + b1 / 2
    const after = a1
    if (after <= before) continue
    add(`econ_tr3_${a1}${a2}_${b1}${b2}`, T.trade, FW.quant, 'hard',
      [`甲國全力生產可得 ${a1} 單位貨品 X，乙國全力生產可得 ${b1} 單位貨品 X。原本兩國各以一半資源生產 X，總產量為 ${before} 單位。若甲國完全專業生產 X，X 的總產量會增加多少單位？`,
       `Country A can make ${a1} units of good X using all its resources, and Country B can make ${b1}. Initially each devotes half its resources to X, giving a total of ${before} units. If A specialises fully in X, by how many units does total output of X rise?`],
      [qty(after - before, '單位', 'units'), qty(after, '單位', 'units'),
       qty(before, '單位', 'units'), qty(a1 + b1, '單位', 'units')],
      [`專業化前的總產量為 $\\dfrac{${a1}}{2} + \\dfrac{${b1}}{2} = ${before}$ 單位；甲國完全專業生產 X 之後，X 的產量為 ${a1} 單位（乙國轉為全力生產另一貨品）。增益 $= ${after} - ${before} = ${after - before}$ 單位。這正是專業化與貿易的核心：按比較優勢分工令總產出上升，各國再透過交換分享增益，因此貿易並非零和。陷阱：${after} 單位是專業化【後】的產量而非增益；${before} 單位是專業化前的產量；${a1 + b1} 單位假設兩國同時全力生產 X，但那樣就沒有人生產另一種貨品。`,
       `Before specialisation the total is $\\frac{${a1}}{2} + \\frac{${b1}}{2} = ${before}$ units; after A specialises fully in X, output of X is ${a1} units, with B switching entirely to the other good. The gain is $${after} - ${before} = ${after - before}$ units. This is the core of specialisation and trade: dividing production by comparative advantage raises total output, and exchange then shares the gain, so trade is not zero-sum. Traps: ${after} is output AFTER specialising rather than the gain; ${before} is output before; ${a1 + b1} assumes both countries make only X, leaving no one to produce the other good.`])
  }
}

// MF1 — 徵稅後的無謂損失（線性供求，三角形面積）
for (const tax of [2, 4, 6, 8, 10]) {
  for (const dq of [10, 20, 30, 40]) {
    const dwl = (tax * dq) / 2
    add(`econ_mf1_${tax}_${dq}`, T.marketFailure, FW.quant, 'hard',
      [`政府對某貨品每單位徵收 ${tax} 元稅款，令成交量由原來的水平下跌 ${dq} 單位。假設供求曲線皆為直線，這項稅款造成的無謂損失是多少？`,
       `A tax of \\$${tax} per unit reduces the quantity traded by ${dq} units. Assuming linear demand and supply, what is the deadweight loss?`],
      [money(String(dwl)), money(String(tax * dq)), money(String(dq)), money(String(tax))],
      [`無謂損失是那些「買賣雙方原本都願意成交、徵稅後卻沒有發生」的交易所損失的剩餘。在直線供求之下，它是一個三角形：底為成交量的減少 ${dq} 單位，高為稅額 ${tax} 元，面積 $= \\dfrac{1}{2} \\times ${dq} \\times ${tax} = ${dwl}$ 元。留意無謂損失並非政府稅收 —— 稅收是仍然成交那部分的轉移，無謂損失則是【無人得到】的淨損失。陷阱：${tax * dq} 元漏了乘二分之一，算成長方形；${dq} 元與 ${tax} 元分別只取了三角形的底與高。`,
       `Deadweight loss is the surplus lost on trades that both sides would have been willing to make but which the tax prevents. With linear curves it is a triangle whose base is the fall in quantity, ${dq} units, and whose height is the tax, \\$${tax}, giving $\\frac{1}{2} \\times ${dq} \\times ${tax} = \\$${dwl}$. Note that deadweight loss is not tax revenue: revenue is a transfer on the trades that still occur, while deadweight loss is a net loss that NO ONE receives. Traps: \\$${tax * dq} omits the one-half and treats it as a rectangle; \\$${dq} and \\$${tax} are merely the base and the height.`])
  }
}

// MK2 — 消費者剩餘（線性需求下的三角形）
for (const pmax of [50, 60, 80, 100, 120]) {
  for (const p of [20, 30, 40]) {
    if (p >= pmax) continue
    for (const q of [20, 40]) {
      const cs = ((pmax - p) * q) / 2
      add(`econ_mk2_${pmax}_${p}_${q}`, T.market, FW.quant, 'hard',
        [`某市場的需求曲線為直線，價格為 ${pmax} 元時需求量為零，現行市價為 ${p} 元，對應的成交量為 ${q} 單位。消費者剩餘是多少？`,
         `A market has a linear demand curve on which quantity demanded is zero at a price of \\$${pmax}. At the current price of \\$${p} the quantity traded is ${q} units. What is the consumer surplus?`],
        [money(String(cs)), money(String((pmax - p) * q)), money(String(p * q)), money(String(pmax - p))],
        [`消費者剩餘是「願意付出的最高價」與「實際付出的價格」之間的差額總和。在直線需求之下，它是需求曲線與市價線之間的三角形：底為成交量 ${q} 單位，高為 $${pmax} - ${p} = ${pmax - p}$ 元，面積 $= \\dfrac{1}{2} \\times ${q} \\times ${pmax - p} = ${cs}$ 元。陷阱：${(pmax - p) * q} 元漏了乘二分之一；${p * q} 元是消費者的總支出；${pmax - p} 元只是第一單位的剩餘。`,
         `Consumer surplus is the total gap between what buyers are willing to pay and what they actually pay. With linear demand it is the triangle between the demand curve and the price line: base ${q} units, height $${pmax} - ${p} = ${pmax - p}$, so the area is $\\frac{1}{2} \\times ${q} \\times ${pmax - p} = \\$${cs}$. Traps: \\$${(pmax - p) * q} omits the one-half; \\$${p * q} is total expenditure; \\$${pmax - p} is the surplus on the first unit alone.`])
    }
  }
}

// BC2 — 基礎概念：機會成本（顯性與隱性成本）
for (const wage of [8000, 10000, 12000, 15000, 20000]) {
  for (const explicit of [3000, 5000, 8000]) {
    const total = wage + explicit
    add(`econ_bc2_${wage}_${explicit}`, T.basics, FW.quant, 'medium',
      [`某人辭去月薪 ${wage.toLocaleString('en-US')} 元的工作去創業，每月另付租金與材料等開支 ${explicit.toLocaleString('en-US')} 元。以經濟學的角度，他每月經營這門生意的總成本是多少？`,
       `Someone leaves a job paying \\$${wage.toLocaleString('en-US')} a month to start a business, paying a further \\$${explicit.toLocaleString('en-US')} a month in rent and materials. In economic terms, what is the total monthly cost of running the business?`],
      [money(total.toLocaleString('en-US')), money(explicit.toLocaleString('en-US')),
       money(wage.toLocaleString('en-US')), money((wage - explicit).toLocaleString('en-US'))],
      [`經濟成本 = 顯性成本 ＋ 隱性成本。顯性成本是實際付出的 ${explicit.toLocaleString('en-US')} 元；隱性成本是放棄的最高價值選項，即原本每月 ${wage.toLocaleString('en-US')} 元的薪金。兩者相加得 ${total.toLocaleString('en-US')} 元。會計只計顯性成本，因此會計利潤往往高於經濟利潤 —— 這個分別正是「賺錢」與「值得做」兩件事的分野。陷阱：${explicit.toLocaleString('en-US')} 元只計了會計成本，漏了放棄的薪金；${wage.toLocaleString('en-US')} 元只計隱性成本；${(wage - explicit).toLocaleString('en-US')} 元把兩者相減。`,
       `Economic cost equals explicit cost plus implicit cost. The explicit cost is the \\$${explicit.toLocaleString('en-US')} actually paid; the implicit cost is the highest-valued alternative forgone, namely the \\$${wage.toLocaleString('en-US')} monthly salary. Together they come to \\$${total.toLocaleString('en-US')}. Accounting counts only explicit costs, which is why accounting profit typically exceeds economic profit — and that difference is precisely the difference between making money and being worth doing. Traps: \\$${explicit.toLocaleString('en-US')} is the accounting cost and omits the forgone salary; \\$${wage.toLocaleString('en-US')} counts only the implicit cost; \\$${(wage - explicit).toLocaleString('en-US')} subtracts one from the other.`])
  }
}

export const economicsBankQuestions: Question[] = bank

// ── 課題登記（2026-07-28 稽核修正）──────────────────────────────────────────
// 本題庫所用的 topic id 從未登記於科目的 *Topics 清單，令相關試題雖然存在於
// 題庫，學生卻無法經課題入口（/practice?topic=、/subjects 課題標籤、/notes）
// 篩選得到。現依 *-hell.ts 的既有慣例，由題庫自行匯出課題，再於科目檔案
// push 併入：T/FW 已在上方定義，毋須兩處重複維護，日後新增題目族亦自動登記。
// `count` 於 getSubjectTopics() 讀取時按真實題數計算，此處填 0 僅作佔位
// （見 types.ts 的說明）。
export const economicsBankTopics: Topic[] = topicList([
  { topic: T.market, fw: FW.quant, count: 0 },
])
