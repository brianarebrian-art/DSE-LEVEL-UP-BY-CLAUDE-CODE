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
