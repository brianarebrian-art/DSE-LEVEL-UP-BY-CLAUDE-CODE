#!/usr/bin/env node
// gen-long-drafts-b2.mjs —— 書寫題（long）草稿生成器・計算型科目第二批
//
// 承接 gen-long-drafts.mjs（理科第一批 185 條）。同一原則：
//   題幹給定數據 → 參考答案由同一組參數算出 → 數值必然自洽。
//   人手覆核只需判斷「呢條題值唔值得出」，唔使逐條驗算。
//
// ⚠️ 憲章 §5：數學科（含 M1／M2）嘅解析【必須附帶 Casio fx-50FH II /
//    3650P 計數機操作教學】。本檔數學三科每條參考答案末段均附機款操作，
//    唔係裝飾 —— 考場實際用嘅就係呢兩款，識公式而唔識入機一樣做唔完卷。
//
// ⚠️ 憲章 §5 術語紅線（經濟科）：
//    Public Good 一律寫「共用品」，禁「公共財」；
//    Entrepreneurship 一律寫「企業家職能」，禁單用「企業」。
//    _gate.mjs 有 ECON_REDLINES 會逐條掃，寫錯即自動退件。
//
// ⚠️ 憲章 §16.A：markingScheme 係【自評對照表】，機器永不批改。
// ⚠️ 憲章 §12：decisions 嘅 reviewer 欄一律留空，機器永不代簽。
//
// 用法：node scripts/qbank/gen-long-drafts-b2.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const OUT = path.join(ROOT, 'scripts/qbank/drafts')

const TAIL_ZH =
  '本題所列分數為本平台練習用尺度，並非香港考試及評核局的分數分配。' +
  '參考答案只列必達步驟與判準，刻意不提供可直接抄錄的完整答卷。' +
  '交卷後請逐項對照自評，機器不會為本題評分。'
const TAIL_EN =
  'The marks shown are a practice scale used on this platform, not an HKEAA mark allocation. ' +
  'The reference answer lists required steps and criteria rather than a copyable model script. ' +
  'Compare your own work against it point by point; nothing here is machine-marked.'

const CASIO = (steps) =>
  `\n【計數機（Casio fx-50FH II / 3650P）】${steps}\n` +
  `提醒：入機之前先寫低算式，入完之後對一次數量級 —— 撳錯一個掣而答案「睇落合理」，` +
  `係考場最難自己發現嘅錯。`

const TOPIC_ID = {
  // economics
  基礎概念: 'basic_concepts', '生產可能線（PPF）': 'ppf', 需求與供應: 'demand_supply',
  彈性: 'elasticity', 廠商與生產: 'firm_production', 市場結構: 'market_structure',
  市場失靈: 'market_failure', 宏觀經濟: 'macroeconomics',
  // geography
  板塊與自然災害: 'plate_hazards', 河流與海岸環境: 'rivers_coasts', 天氣與氣候: 'weather_climate',
  城市發展: 'urban', 工業區位: 'industry', 糧食與飢荒: 'food', 氣候變化與環境管理: 'climate_change',
  // bafs
  會計: 'accounting', 財務管理: 'financial_mgmt', 個人理財: 'personal_finance',
  折舊: 'depreciation', 利息: 'interest', 成本與定價: 'costing', 財務比率: 'ratios',
  // ict
  資料表示與處理: 'data_representation', 電腦系統與硬件: 'computer_systems',
  網絡與互聯網: 'networking', 程式編寫與算法: 'programming', 資料庫: 'databases',
  資訊保安與道德: 'security_ethics', 多媒體與網絡技術: 'multimedia_web',
  // math
  二次方程: 'quadratic_equations', 百分數與利率: 'percentage', 三角函數: 'trigonometry',
  數列: 'sequences', 概率: 'probability', 統計: 'statistics', 對數與指數: 'logarithms',
  坐標幾何: 'coordinate_geometry', 圓的幾何特性: 'circles', 變分: 'variation',
  // m1
  '排列與組合': 'permutation_combination', 二項式定理: 'binomial', 微分: 'differentiation',
  積分: 'integration', 二項分佈: 'binomial_distribution', 正態分佈: 'normal_distribution',
  統計推斷: 'statistics_inference',
  // m2
  微分法: 'differentiation', 積分法: 'integration', 極限: 'limits',
  矩陣與行列式: 'matrices', 向量: 'vectors', 數學歸納法: 'mathematical_induction',
  線性方程組: 'linear_systems',
}

// ── 經濟 ────────────────────────────────────────────────────────────────
const ECON = [
  { topic: '需求與供應', n: 13, make: (k) => {
      const p0 = 20 + k * 5, q0 = 100 - k * 3, dp = 5 + (k % 4)
      const q1 = q0 - dp * 2
      return { q: `某市場的均衡價格為 \\$${p0}、均衡數量為 ${q0} 單位。政府其後徵收每單位 \\$${dp} 的從量稅。\n（a）說明徵稅如何影響供應曲線，並指出移動的方向與幅度。\n（b）若新均衡數量為 ${q1} 單位，計算數量的變動百分比。\n（c）稅項由買方還是賣方繳交，會否影響最終的稅負分擔？試說明。`,
        ans: `（a）從量稅令每一數量下賣方所需的價格上升 \\$${dp}，故供應曲線【向左上移動】，垂直移動幅度剛好等於稅額 \\$${dp}。\n（b）變動 = (${q1} − ${q0}) / ${q0} × 100% = ${(((q1 - q0) / q0) * 100).toFixed(1)}%，即減少約 ${Math.abs(((q1 - q0) / q0) * 100).toFixed(1)}%。\n（c）【不影響】。法定繳稅者（legal incidence）與實際承擔者（economic incidence）是兩回事：無論由誰入賬，稅負的分擔由需求與供應的相對彈性決定 —— 較無彈性的一方承擔較多。\n直觀理解：買方無法輕易減少購買時，賣方就有條件把稅轉嫁出去。\n⚠️ 本題最常見的失分位，是答「由賣方交就賣方承擔」，把法律責任誤讀為經濟負擔。`,
        ansEn: `(a) A specific tax raises the price sellers need at every quantity, so supply shifts LEFT/UP by exactly the tax of \\$${dp}. (b) Change = ${(((q1 - q0) / q0) * 100).toFixed(1)}%. (c) It does NOT matter. Legal incidence and economic incidence differ: the burden is split according to the relative elasticities of demand and supply, with the less elastic side bearing more. The common error is to read legal liability as economic burden.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '彈性', n: 13, make: (k) => {
      const p1 = 40 + k * 4, p2 = p1 + 8, q1 = 200 - k * 6, q2 = q1 - 20 - k
      const ed = (((q2 - q1) / q1) / ((p2 - p1) / p1)).toFixed(2)
      return { q: `某商品的價格由 \\$${p1} 升至 \\$${p2}，需求量由 ${q1} 單位降至 ${q2} 單位。\n（a）計算需求價格彈性（用起點法）。\n（b）判斷該需求屬富有彈性還是缺乏彈性，並說明廠商提價後總收益的變化方向。\n（c）舉出【兩個】會令此商品的需求變得較富有彈性的因素，並解釋機制。`,
        ans: `（a）Ed = (ΔQ/Q₁) ÷ (ΔP/P₁) = (${q2 - q1}/${q1}) ÷ (${p2 - p1}/${p1}) = ${ed}（取絕對值 ${Math.abs(Number(ed)).toFixed(2)}）。\n（b）|Ed| ${Math.abs(Number(ed)) > 1 ? '大於 1，屬【富有彈性】；提價後總收益【下降】' : '小於 1，屬【缺乏彈性】；提價後總收益【上升】'}。\n判斷準則：|Ed| > 1 時，數量的百分比跌幅大於價格的百分比升幅，收益下降；反之上升。\n（c）兩個因素（各須說機制）：\n一、【代用品數目】—— 代用品愈多，價格上升時消費者愈容易轉買別的，需求量反應愈大。\n二、【時間長短】—— 時間愈長，消費者愈有機會調整習慣或尋找代替，故長期彈性通常大於短期。\n（其他可接受：該商品佔收入比重、屬必需品還是奢侈品。）\n⚠️ 只列因素而不說機制，一般只取一半分數。`,
        ansEn: `(a) Ed = ${ed} (absolute value ${Math.abs(Number(ed)).toFixed(2)}). (b) ${Math.abs(Number(ed)) > 1 ? 'Elastic; total revenue FALLS after a price rise.' : 'Inelastic; total revenue RISES after a price rise.'} (c) Two factors with mechanisms: the number of substitutes (more substitutes make switching easier, so quantity responds more) and the time horizon (longer periods allow habits and alternatives to adjust, so long-run elasticity generally exceeds short-run). Listing factors without mechanisms earns only half.`,
        min: 14, diff: 'hard' } } },
  { topic: '生產可能線（PPF）', n: 13, make: (k) => {
      const a1 = 100 + k * 10, b1 = 60 + k * 5, a2 = a1 - 20, b2 = b1 + 8
      return { q: `某經濟體只生產甲、乙兩種產品。若全部資源用於甲，可生產 ${a1} 單位；由 ${a1} 單位甲減至 ${a2} 單位甲時，乙的產量可由 ${b1} 單位增至 ${b2} 單位。\n（a）計算多生產每一單位乙的機會成本（以甲表示）。\n（b）解釋為何生產可能線通常向外凸出（凹向原點），而非直線。\n（c）若該經濟體目前的生產組合位於線【之內】，說明這代表甚麼，以及與「線上移動」有何分別。`,
        ans: `（a）甲減少 ${a1 - a2} 單位換取乙增加 ${b2 - b1} 單位，故每單位乙的機會成本 = ${a1 - a2} ÷ ${b2 - b1} = ${((a1 - a2) / (b2 - b1)).toFixed(2)} 單位甲。\n（b）因為資源【並非同質】：各種資源適合生產甲或乙的程度不同。起初把最適合生產乙的資源調過去，代價較小；愈往後調用的資源愈不適合，機會成本遞增，故曲線向外凸出。若所有資源完全同質，機會成本不變，線就會是直線。\n（c）位於線【之內】代表資源【未被充分或有效運用】（失業或效率不足），此時可以【同時】增加甲與乙的產量而無須取捨。\n線上移動則代表資源已充分運用，增加一者【必須】減少另一者 —— 兩者的分別正在於「有沒有免費午餐」。\n⚠️ 常見錯誤：把線內的點說成「產能不足」。產能是線本身的位置，線內只代表未用盡。`,
        ansEn: `(a) ${a1 - a2} units of A give up for ${b2 - b1} of B, so the opportunity cost is ${((a1 - a2) / (b2 - b1)).toFixed(2)} units of A per unit of B. (b) Resources are not homogeneous: the ones best suited to B move first at low cost, and later transfers are increasingly ill-suited, so opportunity cost rises and the curve bows outward. Perfectly homogeneous resources would give a straight line. (c) A point INSIDE means resources are unemployed or used inefficiently, so both goods can rise together; on the curve, more of one requires less of the other. Points inside do not mean low capacity — capacity is where the curve sits.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '市場失靈', n: 13, make: (k) => {
      const ext = 10 + k * 3, q = 500 + k * 25
      return { q: `某工廠的生產每單位對周邊居民造成 \\$${ext} 的外部成本，目前產量為 ${q} 單位。\n（a）說明私人成本、外部成本與社會成本三者的關係，並計算該產量下的外部成本總額。\n（b）解釋為何在自由市場中，這類產品的產量會高於社會最適水平。\n（c）指出【兩種】可以處理這個問題的政策工具，並各說明其作用機制與一項限制。`,
        ans: `（a）社會成本 = 私人成本 + 外部成本。該產量下外部成本總額 = ${ext} × ${q} = \\$${ext * q}。\n（b）廠商決策時只計【私人成本】，看不見外部成本，故其邊際成本低於社會邊際成本。均衡發生在私人邊際成本等於邊際收益之處，而該點的產量高於社會最適產量（社會邊際成本等於邊際收益之處），出現【生產過多】。\n（c）兩種工具（各須有機制與限制）：\n一、【徵稅】—— 按外部成本徵稅，把外部成本「內部化」，令廠商的私人成本上升至接近社會成本。限制：外部成本的準確金額難以量度，稅率定得過高或過低都會偏離最適產量。\n二、【可交易排放許可】—— 以總量管制加交易，由市場決定減排由誰承擔。限制：總量設定同樣需要資料，而且初始分配方式會影響公平。\n（其他可接受：規管標準、界定產權由當事人協商。）\n⚠️ 只寫工具名稱而不寫機制與限制，屬未完成作答。`,
        ansEn: `(a) Social cost = private cost + external cost; total external cost = \\$${ext * q}. (b) The firm counts only private cost, so its marginal cost lies below the social marginal cost and equilibrium output exceeds the social optimum — overproduction. (c) Two tools, each with a mechanism and a limit: a tax set at the external cost internalises it, but the true figure is hard to measure and a mis-set rate misses the optimum; tradable permits cap the total and let the market allocate abatement, but the cap needs the same information and the initial allocation raises fairness questions.`,
        min: 15, diff: 'hard' } } },
  { topic: '宏觀經濟', n: 13, make: (k) => {
      const c = 400 + k * 30, i = 120 + k * 10, g = 200 + k * 15, x = 80 + k * 5, m = 60 + k * 4
      const y = c + i + g + x - m
      return { q: `某經濟體某年的支出資料如下（單位：億元）：私人消費 ${c}、投資 ${i}、政府開支 ${g}、出口 ${x}、進口 ${m}。\n（a）以支出法計算本地生產總值。\n（b）解釋為何計算時要【減去】進口。\n（c）若翌年政府開支增加 ${Math.round(g * 0.1)} 億元而其他項目不變，本地生產總值的增幅會等於、大於還是小於 ${Math.round(g * 0.1)} 億元？試說明。`,
        ans: `（a）GDP = C + I + G + (X − M) = ${c} + ${i} + ${g} + (${x} − ${m}) = ${y} 億元。\n（b）因為 C、I、G 三項之中已經包含了對進口貨的支出，而進口貨【並非本地生產】。若不減去，就會把外地的產出算成本地的產出。減進口不是因為進口「不好」，而是為了把統計範圍還原為「本地生產」。\n（c）【大於】${Math.round(g * 0.1)} 億元。政府開支增加會成為某些人的收入，其中一部分再被用於消費，如此循環 —— 即【乘數效應】。\n不過實際倍數受制於：邊際消費傾向、稅率與進口傾向（漏出愈大，乘數愈細），故不能斷言必為某一固定倍數。\n⚠️ 只答「因為有乘數」而不指出漏出如何限制倍數，論述不完整。`,
        ansEn: `(a) GDP = C + I + G + (X − M) = ${y} (hundred million). (b) C, I and G already include spending on imported goods, which are NOT produced locally; subtracting imports restores the measure to domestic production. It is a scoping adjustment, not a judgement on imports. (c) GREATER than ${Math.round(g * 0.1)}, through the multiplier: the extra spending becomes income, part of which is spent again. The size depends on the marginal propensity to consume, tax rates and import propensity — larger leakages give a smaller multiplier.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '市場結構', n: 13, make: (k) => {
      // ⚠️ 教訓②：第一版寫 `n = 2 + (k % 4)`，四個取值跑 13 次，
      //    題幹只有四種寫法 —— 機器閘一次過捉出 9 條撞題。
      //    修法是令每一輪嘅題幹都帶一個唯一嘅數，而唔係加豁免。
      const n = 2 + (k % 4), share = 30 + k * 4
      return { q: `試比較完全競爭市場與只有 ${n} 家廠商的市場（該市場中最大一家佔有約 ${share}% 市場份額）。\n（a）指出兩者在【廠商數目】、【產品差異】與【訂價能力】三方面的分別。\n（提示：最大一家佔 ${share}% 這一項數據，本身說明了甚麼？）\n（b）解釋為何完全競爭下的廠商是「價格接受者」。\n（c）有同學說「廠商數目愈少，價格必然愈高」。這句話哪一部分成立、哪一部分過度簡化？`,
        ans: `（a）最大一家佔 ${share}% 份額，本身已顯示市場【集中度高】，個別廠商的行為足以影響市價。\n完全競爭：廠商數目【極多】、產品【同質】、個別廠商【沒有】訂價能力。\n只有 ${n} 家的市場：廠商數目【極少】、產品可以同質或有差異、個別廠商【具備】相當訂價能力，且須考慮對手反應。\n（b）在完全競爭下，任何一家廠商的產量相對市場總量微不足道，而產品同質、資訊流通、進出自由。若它訂價高於市價，買家會即時轉向其他賣家，銷量歸零；訂價低於市價則無謂地放棄收益。故它只能接受市價。\n（c）成立的部分：廠商數目減少通常削弱競爭壓力，價格傾向較高。\n過度簡化的部分：價格還取決於【進入障礙】（潛在競爭者的威脅本身已有紀律作用）、產品差異程度、以及廠商之間是競爭還是協調。少數廠商若彼此激烈競爭，價格未必高於多廠商但各自壟斷一個細分市場的情況。\n⚠️ 本題考的是「數目」與「競爭程度」並非同一回事。`,
        ansEn: `(a) Perfect competition: very many firms, homogeneous product, no price-setting power. With ${n} firms: very few firms, product may be differentiated, substantial price-setting power and firms must anticipate rivals. (b) Each firm is tiny relative to the market, the product is homogeneous, information flows and entry is free; pricing above the market loses all sales and pricing below needlessly forgoes revenue. (c) Fewer firms usually weakens competitive pressure, so the direction is right; but price also depends on barriers to entry (potential entrants discipline incumbents), product differentiation, and whether the few firms compete or coordinate. Number of firms is not the same thing as degree of competition.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '基礎概念', n: 13, make: (k) => {
      const opts = ['自修一小時', '兼職兩小時', '陪家人吃飯', '參加球隊訓練'][k % 4]
      const pay = 60 + k * 5
      return { q: `一名學生有一段兩小時的空檔，可選擇：溫習、以時薪 \\$${pay} 兼職、或${opts}。他最終選擇了溫習。\n（a）界定「機會成本」，並指出此例中溫習的機會成本是甚麼。\n（b）解釋為何機會成本【不是】把所有放棄的選項相加。\n（c）若兼職時薪升至 \\$${pay * 2}，他的選擇會否必然改變？試以「邊際」的角度說明。`,
        ans: `（a）機會成本是為取得某項選擇而放棄的、【價值最高的一項】其他選擇。此例中溫習的機會成本，是他心目中次優那一項的價值（若兼職為次優，即 2 × \\$${pay} = \\$${pay * 2} 的收入及相關得失）。\n（b）因為各項選擇【互相排斥】：即使不溫習，他也只能選其中一項，不可能同時做齊。把全部放棄項相加，等於假設他本來可以同時得到全部，與事實不符。\n（c）【不必然改變】。時薪上升令兼職這一選項的價值上升，故機會成本上升；但是否改變選擇，取決於溫習本身對他的價值有多高。\n邊際的角度：他要比較的是「多兼職這兩小時所增加的收入」與「少溫習這兩小時所減少的預期得益」。只有當前者超過後者，選擇才會轉向。\n⚠️ 答「一定會去兼職」屬忽略了另一邊的價值；機會成本上升只是使天秤傾斜，不等於必然翻轉。`,
        ansEn: `(a) Opportunity cost is the value of the BEST forgone alternative. Here it is the value of his next-best option (if that is the job, 2 × \\$${pay} = \\$${pay * 2} plus the associated pros and cons). (b) The options are mutually exclusive: forgoing study still leaves only one alternative, so summing them all assumes he could have had them together. (c) Not necessarily. A higher wage raises the value of the job and hence the opportunity cost, but whether he switches depends on how much the study is worth to him. At the margin he compares the extra income from those two hours against the expected loss from studying less.`,
        min: 12, diff: 'basic' } } },
  { topic: '廠商與生產', n: 13, make: (k) => {
      const fc = 2000 + k * 200, vc = 15 + k * 2, q = 200 + k * 20, p = 40 + k * 3
      const tc = fc + vc * q, tr = p * q, prof = tr - tc
      return { q: `某廠商的固定成本為 \\$${fc}，每單位可變成本為 \\$${vc}，售價為 \\$${p}，產量為 ${q} 單位。\n（a）計算總成本、總收益與利潤。\n（b）計算平均成本，並解釋為何平均成本會隨產量增加而先下降。\n（c）若短期內售價跌至 \\$${vc + 3}，該廠商應否立即停產？試以「可變成本」的角度說明。`,
        ans: `（a）總成本 = ${fc} + ${vc} × ${q} = \\$${tc}；總收益 = ${p} × ${q} = \\$${tr}；利潤 = ${tr} − ${tc} = \\$${prof}。\n（b）平均成本 = ${tc} / ${q} = \\$${(tc / q).toFixed(2)}。\n先下降的原因：固定成本 \\$${fc} 不隨產量改變，產量愈大，每單位分擔的固定成本愈少（\\$${fc}/Q 遞減），故平均成本下降。（其後可能因報酬遞減而回升。）\n（c）【不應立即停產】。售價 \\$${vc + 3} 高於平均可變成本 \\$${vc}，代表每賣一單位除了收回可變成本外，仍有 \\$3 用於分擔固定成本。停產的話固定成本 \\$${fc} 照樣要付，虧損反而更大。\n短期停產的準則是：售價低於【平均可變成本】才停產，而不是低於平均總成本。\n⚠️ 這是本課題最常見的失分位：用「有沒有蝕本」判斷停產，而正確準則是「有沒有補到可變成本」。`,
        ansEn: `(a) TC = \\$${tc}; TR = \\$${tr}; profit = \\$${prof}. (b) AC = \\$${(tc / q).toFixed(2)}. It falls initially because the fixed cost of \\$${fc} is spread over more units, so \\$${fc}/Q declines (it may rise later as returns diminish). (c) Do NOT shut down. A price of \\$${vc + 3} exceeds average variable cost of \\$${vc}, so each unit covers its variable cost and contributes \\$3 towards the fixed cost, which must be paid anyway. The short-run shutdown rule compares price with AVERAGE VARIABLE COST, not with average total cost — the classic error here is using "making a loss" as the test.`,
        min: 15, diff: 'hard' } } },
]

// ── 地理 ────────────────────────────────────────────────────────────────
const GEO = [
  { topic: '板塊與自然災害', n: 15, make: (k) => {
      const rate = 3 + (k % 6), yrs = 100 + k * 50
      return { q: `兩塊板塊以每年 ${rate} cm 的速度相互分離。\n（a）計算 ${yrs} 年間累積的分離距離（以米表示）。\n（b）說明這類板塊邊界的主要地貌與地質活動，並解釋成因。\n（c）有人說「板塊移動速度慢，所以離散邊界的災害風險低」。試指出這個推論的問題。`,
        ans: `（a）${rate} cm/年 × ${yrs} 年 = ${rate * yrs} cm = ${(rate * yrs) / 100} m。\n（b）離散邊界的主要地貌：中洋脊、裂谷、新生海洋地殼；活動包括淺源地震與基性岩漿的火山活動。\n成因：兩板分離令壓力釋放，地幔物質上湧、減壓熔融形成岩漿，於裂隙處噴出並冷卻成新地殼。\n（c）推論的問題在於把【平均速度】等同【風險】。三點：\n一、板塊移動並非平滑進行 —— 應變長期累積，突然釋放時就是地震，速度慢不代表釋放時的能量小。\n二、災害風險 = 危害 × 暴露 × 脆弱性。人口與基礎設施是否處於危害範圍，往往比速度更決定後果。\n三、離散邊界仍有火山活動，其風險與板塊分離速度並非線性關係。\n⚠️ 本題考的是「速度」不等於「風險」—— 而風險要三個因素一齊看。`,
        ansEn: `(a) ${rate} cm/yr × ${yrs} yr = ${(rate * yrs) / 100} m. (b) Divergent margins show mid-ocean ridges, rift valleys and new oceanic crust, with shallow earthquakes and basaltic volcanism; separation releases pressure, the mantle rises and melts by decompression, and magma erupts along the fissures. (c) The inference equates average speed with risk. Movement is not smooth — strain accumulates and releases suddenly; risk is hazard × exposure × vulnerability, so where people and infrastructure sit often matters more than the rate; and volcanic activity does not scale linearly with spreading rate.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '河流與海岸環境', n: 15, make: (k) => {
      const up = 12 + k, down = 3 + (k % 5)
      return { q: `某河流上游河道坡度約為每公里下降 ${up} 米，下游約為每公里下降 ${down} 米。\n（a）比較上下游的流速與主要作用（侵蝕、搬運或沉積）。\n（b）解釋為何下游雖然坡度較小，流量與河道寬度卻通常較大。\n（c）若上游進行大規模植樹，預期對下游的沉積作用有何影響？請說明因果鏈。`,
        ans: `（a）上游坡度大（每公里 ${up} 米），勢能轉為動能較多，流速較快，以【垂直侵蝕】為主，河谷呈 V 形。\n下游坡度小（每公里 ${down} 米），流速相對較慢但流量大，以【搬運與沉積】為主，出現曲流、氾濫平原與三角洲。\n（b）下游流量較大，是因為沿途不斷有支流匯入及地下水補給，集水面積累積增加；河道加寬則是因為側蝕與流量增加共同作用。\n坡度只影響單位重力分量，不決定水量 —— 兩者是不同的變量。\n（c）因果鏈：植樹 → 樹冠截留與根系固土 → 地表徑流減慢、土壤侵蝕減少 → 進入河流的泥沙量下降 → 下游的沉積物供應減少 → 三角洲與氾濫平原的沉積速率下降，河床甚至可能因「清水沖刷」而下切。\n⚠️ 因果鏈題必須逐環寫出，跳步（例如直接寫「植樹所以沉積減少」）會失去大部分分數。`,
        ansEn: `(a) Upstream, a gradient of ${up} m/km gives faster flow and dominant VERTICAL EROSION, producing a V-shaped valley. Downstream, at ${down} m/km, flow is slower but discharge is large, so TRANSPORT and DEPOSITION dominate, giving meanders, floodplains and deltas. (b) Discharge grows downstream because tributaries and groundwater keep adding to an ever-larger catchment; the channel widens through lateral erosion and greater discharge. Gradient affects the gravity component, not the volume of water. (c) Chain: planting → interception and root binding → less surface runoff and soil erosion → less sediment entering the river → reduced supply downstream → slower deposition, and possibly bed incision by sediment-starved "hungry water". Skipping links loses most of the marks.`,
        min: 15, diff: 'hard' } } },
  { topic: '天氣與氣候', n: 15, make: (k) => {
      const t1 = 28 + (k % 6), rh = 60 + k * 2
      return { q: `某日午後某地氣溫為 ${t1} °C，相對濕度為 ${rh}%。\n（a）解釋相對濕度的定義，並說明為何同一空氣團在氣溫下降時相對濕度會上升。\n（b）說明對流雨的形成過程，並指出為何多在午後出現。\n（c）比較對流雨與鋒面雨在【成因】與【持續時間】上的分別。`,
        ans: `（a）相對濕度是空氣中實際水汽含量與該溫度下飽和水汽含量之比，以百分數表示。\n氣溫下降時，飽和水汽含量（分母）下降，而實際水汽含量（分子）不變，故比值上升 —— 這也是為何夜間降溫容易起霧或結露。\n（b）對流雨：地面受太陽輻射加熱 → 近地面空氣受熱膨脹上升 → 上升過程中絕熱冷卻 → 降至露點以下，水汽凝結成雲 → 雲滴增大至無法懸浮而降落。\n多在午後：因為地面吸熱需時，氣溫通常在午後達到最高，對流最旺盛。\n（c）成因：對流雨由【局部受熱】引起；鋒面雨由【兩個性質不同的氣團相遇】、暖空氣被抬升引起。\n持續時間：對流雨範圍小、時間短、強度大；鋒面雨範圍廣、時間長、強度相對溫和（暖鋒尤其如此）。\n⚠️ 兩項都要答齊，只寫成因不寫持續時間，屬未完成作答。`,
        ansEn: `(a) Relative humidity is actual water vapour content as a percentage of the saturation content at that temperature. Cooling lowers the saturation capacity (the denominator) while the vapour present is unchanged, so the ratio rises — which is why fog and dew form on cool nights. (b) Convectional rain: solar heating warms the surface, air rises and cools adiabatically, cooling below dew point condenses vapour into cloud, and droplets grow until they fall. It peaks in the afternoon because ground heating takes time and temperatures are then highest. (c) Cause: local heating versus the meeting of two air masses with warm air forced to rise. Duration: convectional rain is localised, brief and intense; frontal rain is widespread, prolonged and gentler.`,
        min: 15, diff: 'intermediate' } } },
  { topic: '城市發展', n: 15, make: (k) => {
      const pop0 = 200 + k * 40, pop1 = pop0 + 60 + k * 8, area = 40 + k * 3
      return { q: `某市人口由 ${pop0} 千人增至 ${pop1} 千人，市區面積為 ${area} 平方公里。\n（a）計算人口增幅百分比及最終的人口密度。\n（b）指出城市擴張常見的【兩項】環境問題，並各說明成因。\n（c）有人主張「以增加建築高度取代向外擴張」。試指出這項主張的一個優點與一個限制。`,
        ans: `（a）增幅 = (${pop1} − ${pop0}) / ${pop0} × 100% = ${(((pop1 - pop0) / pop0) * 100).toFixed(1)}%；\n人口密度 = ${pop1} 千人 ÷ ${area} 平方公里 = ${(pop1 / area).toFixed(1)} 千人／平方公里。\n（b）兩項問題（各須成因）：\n一、【城市熱島效應】—— 建築與路面材料吸熱能力強、綠地減少令蒸散降溫作用下降，加上人為排熱，令市區氣溫高於周邊。\n二、【地表徑流增加與水浸風險】—— 不透水面積上升，雨水無法下滲，短時間內大量匯入排水系統，超出容量即成水浸。\n（c）優點：向上發展可在同一土地面積容納更多人口，減少侵佔郊野與農地，並使公共交通與各項設施的服務更具效率。\n限制：高密度會加重局部的交通、供水、排污與通風負荷；建築過密亦可能阻擋風道，反而加劇熱島效應。故高度不是單向的解決方案，須配合規劃。\n⚠️ 只答優點而不答限制，屬未按題作答。`,
        ansEn: `(a) Growth = ${(((pop1 - pop0) / pop0) * 100).toFixed(1)}%; density = ${(pop1 / area).toFixed(1)} thousand per km². (b) Two problems with causes: the urban heat island (heat-absorbing surfaces, less vegetation to cool by evapotranspiration, plus anthropogenic heat) and increased runoff and flood risk (impermeable surfaces prevent infiltration, so drains receive a sudden large volume). (c) Building upward houses more people on the same land, sparing countryside and farmland and making transport and services more efficient. But high density loads local traffic, water, sewerage and ventilation, and dense towers can block air corridors and worsen the heat island. Height is not a one-way solution.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '氣候變化與環境管理', n: 15, make: (k) => {
      const base = 380 + k * 4, now = base + 40 + k * 2
      return { q: `某測站錄得的大氣二氧化碳濃度由 ${base} ppm 上升至 ${now} ppm。\n（a）計算升幅及百分比變化。\n（b）解釋溫室效應的機制，並指出「溫室效應」與「增強的溫室效應」有何分別。\n（c）評估「單靠個人減少用電即可解決氣候變化」這個說法。`,
        ans: `（a）升幅 = ${now} − ${base} = ${now - base} ppm；百分比 = ${(((now - base) / base) * 100).toFixed(1)}%。\n（b）機制：太陽短波輻射穿過大氣被地面吸收，地面以【長波輻射】放出熱量；溫室氣體吸收長波輻射再向各方向再輻射，部分回到地面，令近地面溫度高於沒有大氣時的情況。\n分別：溫室效應本身是【自然現象】，沒有它地表平均溫度會低得多，不適合生命；增強的溫室效應是指人為排放令溫室氣體濃度上升，使這個自然效應【超出原有水平】，導致額外升溫。\n（c）評估（須兩面）：\n有道理的部分：用電對應發電排放，個人節能確有直接的減排作用，而且行為改變可以帶動需求轉向。\n不足的部分：排放的主要來源包括發電結構、工業、運輸與土地利用，個人用電只佔其中一部分；而且個人的選擇受制於既有的能源結構與基建 —— 若電力本身來自高碳排放的來源，個人節能的減幅有限。故個人行動【必要但不充分】，須與能源結構轉型及政策配合。\n⚠️ 評估題若只寫一面（無論支持或反對），一般只取一半分數。`,
        ansEn: `(a) Rise = ${now - base} ppm, i.e. ${(((now - base) / base) * 100).toFixed(1)}%. (b) Short-wave solar radiation passes through and is absorbed at the surface, which re-emits LONG-WAVE radiation; greenhouse gases absorb and re-radiate it in all directions, part returning to the surface. The natural greenhouse effect keeps the planet habitable; the ENHANCED effect is the additional warming from anthropogenic increases in those gases. (c) Both sides: individual saving does cut emissions directly and can shift demand; but generation mix, industry, transport and land use dominate the total, and individual choices are constrained by the existing energy system. Individual action is necessary but not sufficient.`,
        min: 15, diff: 'hard' } } },
  { topic: '工業區位', n: 15, make: (k) => {
      const rawCost = 40 + k * 5, transIn = 12 + k, transOut = 8 + (k % 6)
      return { q: `某工廠的原料成本為每單位 \\$${rawCost}，運入原料的運費為每單位 \\$${transIn}，運出製成品的運費為每單位 \\$${transOut}。\n（a）比較兩項運費，判斷該工廠傾向【原料導向】還是【市場導向】，並說明理由。\n（b）解釋「重量減輕工業」與「重量增加工業」的區位傾向有何不同。\n（c）指出【兩項】會令傳統區位因素的重要性下降的現代發展，並說明機制。`,
        ans: `（a）運入 \\$${transIn} ${transIn > transOut ? '大於' : '小於'} 運出 \\$${transOut}，故該工廠傾向【${transIn > transOut ? '原料導向' : '市場導向'}】——${transIn > transOut ? '把工廠設於原料產地可減少較昂貴的原料運費' : '把工廠設於市場附近可減少較昂貴的製成品運費'}。\n（b）重量減輕工業（如選礦、製糖）在加工後重量大減，運製成品較便宜，故傾向【接近原料產地】；\n重量增加工業（如汽水裝瓶，加入大量水）製成品較原料重或體積較大，故傾向【接近市場】。\n（c）兩項發展（各須機制）：\n一、【運輸成本佔總成本比重下降】—— 貨櫃化與規模化令單位運費大幅下降，運費在區位決策中的權重隨之減少。\n二、【資訊與通訊技術】—— 生產可以分拆到不同地點而仍能協調，使勞動力成本、稅制與人才供應等因素的相對重要性上升。\n（其他可接受：政府政策與工業邨、電力普及使能源不再綁定產地。）\n⚠️ 只答「科技進步」而不指出機制，不能取分。`,
        ansEn: `(a) Inward freight of \\$${transIn} is ${transIn > transOut ? 'greater' : 'less'} than outward freight of \\$${transOut}, so the plant tends to be ${transIn > transOut ? 'RAW-MATERIAL oriented' : 'MARKET oriented'}. (b) Weight-losing industries lose mass in processing, so shipping the product is cheaper and they locate near the raw material; weight-gaining industries produce something heavier or bulkier and locate near the market. (c) Two developments with mechanisms: falling transport costs (containerisation and scale reduce unit freight, lowering its weight in the decision) and information technology (production can be split across sites and still coordinated, raising the relative importance of labour cost, tax regime and talent supply).`,
        min: 14, diff: 'intermediate' } } },
  { topic: '糧食與飢荒', n: 15, make: (k) => {
      const prod = 800 + k * 60, pop = 500 + k * 40
      return { q: `某地區年糧食產量為 ${prod} 千噸，人口為 ${pop} 千人。\n（a）計算人均糧食產量（公斤／人／年）。\n（b）若人均產量高於基本需求，該地區仍可能出現飢荒。試指出【兩個】原因並說明機制。\n（c）評估「增加糧食產量是解決飢荒的根本方法」這個說法。`,
        ans: `（a）人均 = ${prod} 千噸 ÷ ${pop} 千人 = ${(prod / pop).toFixed(2)} 噸／人 = ${((prod / pop) * 1000).toFixed(0)} 公斤／人／年。\n（b）兩個原因（各須機制）：\n一、【分配與購買力】—— 糧食存在但部分人無力購買。飢荒往往不是總量不足，而是取得糧食的能力（收入、就業、社會保障）崩潰。\n二、【運輸與儲存損耗，或衝突阻斷通路】—— 產地有糧而災區運不到，或收成後因儲存設施不足而大量損耗。\n（其他可接受：糧食用於出口或轉作飼料與燃料。）\n（c）評估（兩面）：\n有道理的部分：長期而言產量必須跟得上人口與飲食結構的變化，否則任何分配安排都無以為繼。\n不足的部分：如 (b) 所示，多數飢荒發生在總量足夠的情況下 —— 若不同時處理分配、購買力、基建與衝突，單增產量可能只是令剩餘增加而未惠及最需要的一群。\n故增產是【必要條件之一】，而非充分的根本方法。\n⚠️ 評估題必須兩面兼顧，並以一句明確的判斷收結。`,
        ansEn: `(a) ${(prod / pop).toFixed(2)} tonnes per person = ${((prod / pop) * 1000).toFixed(0)} kg per person per year. (b) Two reasons with mechanisms: distribution and purchasing power (food exists but some cannot buy it — famines often follow a collapse in entitlement rather than in supply) and losses in transport or storage, or conflict cutting access. (c) Both sides: output must keep pace with population and diet over the long run, or no distribution scheme is sustainable; yet most famines occur where aggregate supply suffices, so raising output alone may enlarge a surplus that never reaches those in need. Increased production is one necessary condition, not a sufficient remedy.`,
        min: 15, diff: 'hard' } } },
]

const build = (subject, subjectZh, groups, prefix) => {
  const out = []
  groups.forEach((g, gi) => {
    for (let k = 0; k < g.n; k++) {
      const r = g.make(k)
      out.push({
        id: `${prefix}_${gi}_${String(k + 1).padStart(2, '0')}`,
        type: 'long',
        subject,
        topic: g.topic,
        topicId: TOPIC_ID[g.topic] ?? null,
        topicZh: g.topic,
        difficulty: r.diff,
        marks: 8,
        suggestedMinutes: r.min,
        question: r.q,
        explanation:
          '本題考核的是【由資料走到結論】的完整過程：計算要寫得出步驟，'
          + '解釋要指出機制而非複述現象，延伸部分要處理題目指定的比較或條件。'
          + '評卷關注的不是最終數字，而是每一步是否有依據 —— '
          + '答案正確而過程跳步，與過程完整而末步算錯，前者失分往往更多。',
        referenceAnswer: r.ans,
        referenceAnswerEn: r.ansEn,
        markingScheme:
          `本題分三部分評分（本平台練習用尺度）：\n`
          + `（a）計算或辨識 —— 步驟是否寫出、單位是否正確。\n`
          + `（b）解釋 —— 是否指出機制而非只複述現象。\n`
          + `（c）延伸判斷 —— 是否處理了題目指定的比較、限制或評估，並說明理由。\n`
          + `建議用時 ${r.min} 分鐘。\n${TAIL_ZH}`,
        markingSchemeEn:
          `Three parts (a practice scale used on this platform):\n`
          + `(a) calculation or identification — steps shown, units correct;\n`
          + `(b) explanation — a mechanism given rather than the observation restated;\n`
          + `(c) extension — the specified comparison, limitation or evaluation addressed with reasons.\n`
          + `Suggested time: ${r.min} minutes.\n${TAIL_EN}`,
      })
    }
  })
  fs.writeFileSync(path.join(OUT, `${subject}-long-b1.json`), JSON.stringify(out, null, 1) + '\n', 'utf8')
  fs.writeFileSync(
    path.join(OUT, `${subject}-long-b1.decisions.json`),
    JSON.stringify({
      _meta: { source: `${subject}-long-b1.json`, subject, reviewer: '', reviewedAt: '' },
      decisions: Object.fromEntries(out.map((q) => [q.id, 'pending'])),
    }, null, 1) + '\n',
    'utf8',
  )
  console.log(`  ${subjectZh.padEnd(6)} → ${out.length} 條`)
  return out.length
}

console.log('生成書寫題草稿・第二批（reviewer 欄一律留空，待真人逐題簽署）：')
let total = 0
total += build('economics', '經濟', ECON, 'ec_l')
total += build('geography', '地理', GEO, 'ge_l')
console.log(`\n合計 ${total} 條。`)
export { build, TOPIC_ID, TAIL_ZH, TAIL_EN, CASIO }
