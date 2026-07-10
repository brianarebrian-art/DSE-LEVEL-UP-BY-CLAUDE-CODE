import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// Chemistry — multi-step "hell" set (genuine 5★★). Every numeric answer is
// hand-computed in the working; distractors are the standard DSE traps (using the
// excess reagent, forgetting a diprotic acid gives 2 H⁺, "higher T always raises
// yield", inverting a concentration ratio, etc.). All hard.
// Molar volume at r.t.p. = 24 dm³/mol. Ar: H=1, C=12, O=16, Ca=40, Cr=52.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('chemistry')
const opt = (v: string): Pair => [v, v]
const optm = (v: string): Pair => [`$${v}$`, `$${v}$`]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  quant: { id: 'chem_hell_quant',        zh: '定量計算（高階）',         en: 'Quantitative killers' },
  re:    { id: 'chem_hell_redox_equil',  zh: '氧化還原與平衡',   en: 'Redox & equilibrium' },
  org:   { id: 'chem_hell_organic',      zh: '有機化學（高階）',         en: 'Organic killers' },
} satisfies Record<string, TopicMeta>

const FW = {
  quant:    { id: 'quantitative', zh: '定量推理', en: 'Quantitative Reasoning', emoji: '⚖️' },
  electron: { id: 'electron', zh: '電子轉移', en: 'Electron Transfer', emoji: '🔋' },
  carbon:   { id: 'carbon', zh: '碳化合物', en: 'Carbon Compounds', emoji: '🛢️' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `chemh_${p}_${++uid}`

// ── Quantitative killers ─────────────────────────────────────────────────────
const quant: Question[] = [
  q(id('qu'), T.quant, FW.quant, 'hard', 2024, 3,
    C('將 $0.5\\,\\text{mol}$ 氫氣與 $0.5\\,\\text{mol}$ 氧氣點燃完全反應：$2H_2 + O_2 \\rightarrow 2H_2O$。生成的水的質量是？（$M(H_2O)=18$）',
      'Igniting $0.5\\,\\text{mol}$ H₂ with $0.5\\,\\text{mol}$ O₂: $2H_2 + O_2 \\rightarrow 2H_2O$. The mass of water formed is? ($M(H_2O)=18$)'),
    [opt('9 g'), opt('18 g'), opt('4.5 g'), opt('36 g')],
    C('比例 $H_2:O_2 = 2:1$。$0.5\\,\\text{mol}$ H₂ 只需 $0.25\\,\\text{mol}$ O₂，但有 $0.5\\,\\text{mol}$ O₂ ⇒ O₂ 過量、H₂ 為限量試劑。生成水 $= $ mol(H₂) $= 0.5\\,\\text{mol}$，質量 $= 0.5\\times18 = 9\\,\\text{g}$。\n\n【陷阱】$18\\,\\text{g}$ 用了過量的 O₂（$1\\,\\text{mol}$ 水）——忽略了限量試劑，正是此題的關鍵陷阱；$4.5$、$36$ 為比例算錯。',
      'Ratio $H_2:O_2 = 2:1$. $0.5\\,\\text{mol}$ H₂ needs only $0.25\\,\\text{mol}$ O₂, but $0.5\\,\\text{mol}$ O₂ is present ⇒ O₂ in excess, H₂ is limiting. Water $= $ mol(H₂) $= 0.5\\,\\text{mol}$, mass $= 9\\,\\text{g}$.\n\n【Trap】 $18\\,\\text{g}$ uses the excess O₂ — ignoring the limiting reagent, the killer here; $4.5$/$36$ mis-scale.')),

  q(id('qu'), T.quant, FW.quant, 'hard', 2023, 3,
    C('用 $20.0\\,\\text{cm}^3$ 的 $0.10\\,\\text{M}$ 鹽酸完全中和 $25.0\\,\\text{cm}^3$ 氫氧化鈉溶液（$NaOH + HCl \\rightarrow NaCl + H_2O$）。氫氧化鈉的濃度是？',
      '$20.0\\,\\text{cm}^3$ of $0.10\\,\\text{M}$ HCl exactly neutralises $25.0\\,\\text{cm}^3$ of NaOH ($NaOH + HCl \\rightarrow NaCl + H_2O$). The concentration of NaOH is?'),
    [opt('0.08 M'), opt('0.125 M'), opt('0.10 M'), opt('0.002 M')],
    C('mol HCl $= 0.0200\\times0.10 = 0.0020\\,\\text{mol}$ $=$ mol NaOH（1:1）。$[NaOH] = 0.0020 / 0.0250 = 0.08\\,\\text{M}$。\n\n【陷阱】$0.125$ 把體積比倒轉（$25/20$ 而非 $20/25$）；$0.10$ 直接抄 HCl 濃度；$0.002$ 漏除體積。',
      'mol HCl $= 0.0200\\times0.10 = 0.0020\\,\\text{mol}$ $=$ mol NaOH (1:1). $[NaOH] = 0.0020/0.0250 = 0.08\\,\\text{M}$.\n\n【Trap】 $0.125$ inverts the volume ratio ($25/20$ not $20/25$); $0.10$ copies the HCl conc.; $0.002$ forgets to divide by volume.')),

  q(id('qu'), T.quant, FW.quant, 'hard', 2024, 3,
    C('$5.0\\,\\text{g}$ 碳酸鈣 $CaCO_3$（$M=100$）完全分解：$CaCO_3 \\rightarrow CaO + CO_2$。在室溫及標準壓力（摩爾體積 $24\\,\\text{dm}^3/\\text{mol}$）下放出的 $CO_2$ 體積是？',
      '$5.0\\,\\text{g}$ of CaCO₃ ($M=100$) decomposes fully: $CaCO_3 \\rightarrow CaO + CO_2$. The volume of CO₂ released at r.t.p. (molar volume $24\\,\\text{dm}^3/\\text{mol}$) is?'),
    [opt('1.2 dm³'), opt('24 dm³'), opt('2.4 dm³'), opt('0.05 dm³')],
    C('mol CaCO₃ $= 5.0/100 = 0.05\\,\\text{mol}$ ⇒ mol CO₂ $= 0.05$（1:1）。體積 $= 0.05\\times24 = 1.2\\,\\text{dm}^3$。\n\n【陷阱】$24$ 漏乘摩爾數；$2.4$ 用了 $0.1\\,\\text{mol}$；$0.05$ 漏乘摩爾體積。',
      'mol CaCO₃ $= 5.0/100 = 0.05\\,\\text{mol}$ ⇒ mol CO₂ $= 0.05$ (1:1). Volume $= 0.05\\times24 = 1.2\\,\\text{dm}^3$.\n\n【Trap】 $24$ forgets to multiply by moles; $2.4$ uses $0.1\\,\\text{mol}$; $0.05$ forgets the molar volume.')),

  q(id('qu'), T.quant, FW.quant, 'hard', 2023, 3,
    C('某化合物按質量計含 $40.0\\%$ 碳、$6.7\\%$ 氫、$53.3\\%$ 氧（$Ar$: C=12, H=1, O=16）。其實驗式（最簡式）是？',
      'A compound is $40.0\\%$ C, $6.7\\%$ H, $53.3\\%$ O by mass ($Ar$: C=12, H=1, O=16). Its empirical formula is?'),
    [optm('CH_2O'), optm('C_2H_4O_2'), optm('CHO'), optm('CH_4O')],
    C('摩爾比：C $40/12=3.33$、H $6.7/1=6.7$、O $53.3/16=3.33$。同除以最小值 $3.33$：C:H:O $= 1:2:1$ ⇒ 實驗式 $CH_2O$。\n\n【陷阱】$C_2H_4O_2$ 是分子式之一（非最簡）；$CHO$ 氫算少了；$CH_4O$ 氧漏了。',
      'Mole ratio: C $40/12=3.33$, H $6.7/1=6.7$, O $53.3/16=3.33$. Divide by $3.33$: C:H:O $= 1:2:1$ ⇒ empirical formula $CH_2O$.\n\n【Trap】 $C_2H_4O_2$ is a molecular formula (not simplest); $CHO$ undercounts H; $CH_4O$ drops the O.')),

  q(id('qu'), T.quant, FW.quant, 'hard', 2024, 3,
    C('假設完全電離，$0.05\\,\\text{M}$ 硫酸 $H_2SO_4$ 溶液的 pH 約為？（$\\log 2 \\approx 0.30$）',
      'Assuming full dissociation, the pH of $0.05\\,\\text{M}$ sulfuric acid $H_2SO_4$ is about? ($\\log 2 \\approx 0.30$)'),
    [opt('1.0'), opt('1.3'), opt('2.0'), opt('0.05')],
    C('$H_2SO_4$ 是二元酸，每摩爾放出 2 個 $H^+$：$[H^+] = 2\\times0.05 = 0.10\\,\\text{M}$。$pH = -\\log(0.10) = 1.0$。\n\n【陷阱】$1.3 = -\\log(0.05)$，忘了二元酸放 2 個 $H^+$，正是此題的關鍵陷阱；$2.0$ 用 $0.01$；$0.05$ 直接抄濃度。',
      '$H_2SO_4$ is diprotic — each mole releases 2 $H^+$: $[H^+] = 2\\times0.05 = 0.10\\,\\text{M}$. $pH = -\\log(0.10) = 1.0$.\n\n【Trap】 $1.3 = -\\log(0.05)$ forgets the diprotic acid gives 2 $H^+$ — the killer; $2.0$ uses $0.01$; $0.05$ copies the concentration.')),
]

// ── Redox & equilibrium ──────────────────────────────────────────────────────
const re: Question[] = [
  q(id('re'), T.re, FW.electron, 'hard', 2024, 2,
    C('在重鉻酸根離子 $Cr_2O_7^{2-}$ 中，鉻 Cr 的氧化數是？（O 為 $-2$）',
      'In the dichromate ion $Cr_2O_7^{2-}$, the oxidation number of chromium (Cr) is? (O is $-2$)'),
    [opt('+6'), opt('+3'), opt('+7'), opt('+12')],
    C('設 Cr 氧化數為 $x$：$2x + 7(-2) = -2 \\Rightarrow 2x - 14 = -2 \\Rightarrow 2x = 12 \\Rightarrow x = +6$。\n\n【陷阱】$+3$ 是 $Cr^{3+}$（還原產物）；$+7$ 套用了錳的 $+7$；$+12$ 漏除 2 個 Cr。',
      'Let Cr be $x$: $2x + 7(-2) = -2 \\Rightarrow 2x = 12 \\Rightarrow x = +6$.\n\n【Trap】 $+3$ is $Cr^{3+}$ (the reduced product); $+7$ borrows Mn’s value; $+12$ forgets to divide by the 2 Cr atoms.')),

  q(id('re'), T.re, FW.electron, 'hard', 2023, 3,
    C('合成氨的正反應為放熱反應：$N_2 + 3H_2 \\rightleftharpoons 2NH_3$（$\\Delta H < 0$）。在其他條件不變下，升高溫度對平衡時氨的產率有何影響？',
      'The forward synthesis of ammonia is exothermic: $N_2 + 3H_2 \\rightleftharpoons 2NH_3$ ($\\Delta H < 0$). Other things equal, how does raising the temperature affect the equilibrium yield of ammonia?'),
    [C('產率下降（平衡向吸熱的逆方向移動）', 'the yield falls (equilibrium shifts backward, the endothermic direction)'),
      C('產率上升', 'the yield rises'),
      C('產率不變', 'the yield is unchanged'),
      C('反應完全停止', 'the reaction stops completely')],
    C('依勒沙特列原理，升溫令平衡向吸熱方向（此處為逆反應）移動，故氨的平衡產率下降。注意：升溫會加快反應「速率」，但對放熱反應而言「產率」反而下降——速率與產率是兩回事，正是此題的關鍵陷阱。\n\n【陷阱】「產率上升」混淆了速率與產率；「不變」「完全停止」都與勒沙特列原理相違。',
      'By Le Chatelier, raising temperature shifts equilibrium toward the endothermic direction (here the reverse), so the equilibrium yield of NH₃ falls. Note: higher T speeds up the RATE but lowers the YIELD for an exothermic reaction — rate ≠ yield, the killer here.\n\n【Trap】 “Yield rises” confuses rate with yield; “unchanged”/“stops” contradict Le Chatelier.')),
]

// ── Organic killers ──────────────────────────────────────────────────────────
const org: Question[] = [
  q(id('or'), T.org, FW.carbon, 'hard', 2024, 3,
    C('分子式為 $C_4H_9Cl$ 的化合物，其結構異構體（不計立體異構）共有多少個？',
      'How many structural isomers (excluding stereoisomers) have the molecular formula $C_4H_9Cl$?'),
    [opt('4'), opt('2'), opt('3'), opt('5')],
    C('$C_4H_9Cl$ 的結構異構體有 4 個：1-氯丁烷、2-氯丁烷、1-氯-2-甲基丙烷、2-氯-2-甲基丙烷（碳骨架有直鏈與支鏈，氯位置不同）。\n\n【陷阱】$2$ 只數了直鏈兩個；$3$ 漏了一個支鏈異構；$5$ 重複計算。',
      '$C_4H_9Cl$ has 4 structural isomers: 1-chlorobutane, 2-chlorobutane, 1-chloro-2-methylpropane and 2-chloro-2-methylpropane (straight and branched carbon skeletons, different Cl positions).\n\n【Trap】 $2$ counts only the straight chain; $3$ misses a branched isomer; $5$ double-counts.')),

  q(id('or'), T.org, FW.carbon, 'hard', 2023, 3,
    C('將乙烯 $C_2H_4$ 通入溴水。下列哪項最準確描述所發生的反應？',
      'Ethene $C_2H_4$ is bubbled into bromine water. Which best describes the reaction?'),
    [C('加成反應 —— 室溫下迅速使溴水褪色，生成 1,2-二溴乙烷', 'an addition reaction — it rapidly decolourises the bromine water at room temperature, forming 1,2-dibromoethane'),
      C('取代反應 —— 需要紫外光才會進行', 'a substitution reaction — it needs UV light to proceed'),
      C('沒有反應發生', 'no reaction occurs'),
      C('燃燒反應 —— 生成二氧化碳和水', 'a combustion reaction — forming carbon dioxide and water')],
    C('乙烯含 C=C 雙鍵，能在室溫下與溴「加成」，迅速使溴水（橙黃色）褪色，生成 1,2-二溴乙烷——這正是區分烯烴（不飽和）與烷烴（飽和）的測試。\n\n【陷阱】「取代需紫外光」是烷烴（如乙烷）的反應；「沒有反應」否定了雙鍵的活性；「燃燒」與通入溴水的條件無關。',
      'Ethene has a C=C double bond and undergoes ADDITION with bromine at room temperature, rapidly decolourising the orange bromine water to form 1,2-dibromoethane — the standard test distinguishing unsaturated alkenes from saturated alkanes.\n\n【Trap】 “Substitution needing UV” is the alkane (e.g. ethane) reaction; “no reaction” denies the double bond’s reactivity; “combustion” is irrelevant to bubbling into bromine water.')),
]

export const chemistryHellQuestions: Question[] = [...quant, ...re, ...org]

export const chemistryHellTopics: Topic[] = topicList([
  { topic: T.quant, fw: FW.quant,    count: quant.length },
  { topic: T.re,    fw: FW.electron, count: re.length },
  { topic: T.org,   fw: FW.carbon,   count: org.length },
])
