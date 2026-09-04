#!/usr/bin/env node
// gen-long-drafts-b3.mjs —— 書寫題（long）草稿生成器・第四批
//
// 承接前三批（理科 185、經濟地理 209、企會財 ICT 210）。
// 本批覆蓋六科：數學 M1、數學 M2、旅遊與款待、健康管理、設計與應用科技、體育。
//
// ⚠️ 憲章 §5：數學科（含 M1／M2）嘅解析【必須附帶 Casio fx-50FH II /
//    3650P 計數機操作教學】。本檔 M1／M2 每條參考答案末段均附機款操作 ——
//    唔係裝飾：考場實際用嘅就係呢兩款，識公式而唔識入機一樣做唔完卷。
//
// ⚠️ 憲章 §16.A：markingScheme 係【自評對照表】，機器永不批改。
// ⚠️ 憲章 §12：decisions 嘅 reviewer 欄一律留空，機器永不代簽。
//
// ⚠️ 三批累積落嚟嘅寫法教訓（本檔開工前逐條核過）：
//   · 金額一律寫 `\\$`（JS 原始碼層）—— template literal 會食走單反斜線，
//     而 `$` 係本庫嘅 LaTeX 分隔符。企會財第一版 105 條因此全數被退。
//   · 每個迴圈變數必須令題幹輸出真正改變。取值數目少過迴圈次數就會撞題
//     （經濟市場結構 9 條、ICT 演算法 9 條，都係同一個成因）。
//   · long 題除 referenceAnswer 之外仲要 explanation（≥10 字），兩者用途不同。
//
// 用法：node scripts/qbank/gen-long-drafts-b3.mjs

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const OUT = path.join(ROOT, 'scripts/qbank/drafts')

const TAIL_ZH =
  '本題所列分數為本平台練習用尺度，並非香港考試及評核局的分數分配。'
  + '參考答案只列必達步驟與判準，刻意不提供可直接抄錄的完整答卷。'
  + '交卷後請逐項對照自評，機器不會為本題評分。'
const TAIL_EN =
  'The marks shown are a practice scale used on this platform, not an HKEAA mark allocation. '
  + 'The reference answer lists required steps and criteria rather than a copyable model script. '
  + 'Compare your own work against it point by point; nothing here is machine-marked.'

// 憲章 §5 指定機款。步驟按實機鍵序寫，唔係泛泛講「用計數機計」。
const CASIO = (steps) =>
  `\n【計數機・Casio fx-50FH II / 3650P】${steps}`
  + `\n入機之前先寫低算式，入完之後對一次數量級 —— 撳錯一個掣而答案「睇落合理」，`
  + `係考場最難自己發現嘅錯。`

const TOPIC_ID = {
  // m1
  '排列與組合': 'permutation_combination', 二項式定理: 'binomial', 微分: 'differentiation',
  積分: 'integration', 二項分佈: 'binomial_distribution', 正態分佈: 'normal_distribution',
  統計推斷: 'statistics_inference',
  // m2
  微分法: 'differentiation', 積分法: 'integration', 極限: 'limits',
  矩陣與行列式: 'matrices', 向量: 'vectors', 數學歸納法: 'mathematical_induction',
  線性方程組: 'linear_systems',
  // ths
  旅遊與款待業概論: 'intro', 優質顧客服務: 'service', 旅遊目的地: 'destinations',
  住宿營運: 'accommodation', 餐飲服務: 'food_beverage', 可持續旅遊: 'sustainable',
  旅遊影響: 'impacts',
  // health-management
  健康概念: 'health_concept', 人生發展: 'lifespan', 醫療與社會照顧系統: 'care_systems',
  促進健康: 'health_promotion', 社區照顧: 'community_care',
  公共衞生與疾病預防: 'public_health', 照顧倫理: 'care_ethics',
  // design-tech
  設計過程: 'design_process', 設計元素與原則: 'design_elements', 材料與特性: 'materials',
  結構與機械: 'structures_mech', 生產工序: 'manufacturing', 人體工學: 'ergonomics',
  可持續設計: 'sustainability',
  // pe
  解剖學: 'anatomy', 運動生理學: 'physiology', 生物力學: 'biomechanics',
  體適能與訓練: 'fitness_training', 營養與健康: 'nutrition_health',
  運動創傷: 'injuries', 運動心理學: 'psychology',
}

// ── 數學 M1 ─────────────────────────────────────────────────────────────
const M1 = [
  { topic: '二項式定理', n: 15, make: (k) => {
      const n = 5 + (k % 6), a = 2 + (k % 4), r = 2 + (k % 3)
      const C = (nn, rr) => { let v = 1; for (let i = 0; i < rr; i++) v = v * (nn - i) / (i + 1); return Math.round(v) }
      const coef = C(n, r) * Math.pow(a, n - r)
      return { q: `考慮 (x + ${a})^${n} 的展開式。\n（a）寫出通項公式，並求 x^${n - r} 項的係數。\n（b）求展開式中所有係數之和。\n（c）若把 ${a} 改為 −${a}，(b) 的答案會如何變化？試說明原因，不要重新展開一次。`,
        ans: `（a）通項：T(r+1) = C(${n}, r) · x^(${n}−r) · ${a}^r。\n取 r = ${r} 得 x^${n - r} 項係數 = C(${n}, ${r}) × ${a}^${r} = ${C(n, r)} × ${Math.pow(a, r)} = ${coef}。\n（b）係數之和：把 x = 1 代入即得 (1 + ${a})^${n} = ${Math.pow(1 + a, n)}。\n（c）改為 (x − ${a})^${n} 時，代入 x = 1 得 (1 − ${a})^${n} = ${Math.pow(1 - a, n)}。\n原因：「係數之和」等於把 x = 1 代入原式 —— 這是一條可以直接用的技巧，不必逐項展開。符號一變，代入後的底數由 ${1 + a} 變成 ${1 - a}，故結果隨之改變（${n} 為${n % 2 === 0 ? '偶' : '奇'}數，故結果為${Math.pow(1 - a, n) >= 0 ? '正' : '負'}）。\n⚠️ 常見錯誤：把「係數之和」與「二項式係數之和」混淆。後者是 C(${n},0)+…+C(${n},${n}) = 2^${n} = ${Math.pow(2, n)}，並不包含 ${a} 的冪。${CASIO(`求 C(${n}, ${r})：按 ${n} → SHIFT nCr → ${r} → =，得 ${C(n, r)}；再乘 ${a}^${r}（用 x^y 掣）。切勿逐項手算，考場冇時間。`)}`,
        ansEn: `(a) T(r+1) = C(${n}, r)·x^(${n}-r)·${a}^r; at r = ${r} the coefficient is ${C(n, r)} × ${Math.pow(a, r)} = ${coef}. (b) Put x = 1: (1 + ${a})^${n} = ${Math.pow(1 + a, n)}. (c) With -${a}, putting x = 1 gives (1 - ${a})^${n} = ${Math.pow(1 - a, n)}. The sum of coefficients is always found by substituting x = 1 — no expansion needed. Do not confuse this with the sum of BINOMIAL coefficients, 2^${n} = ${Math.pow(2, n)}, which omits the constant. On a Casio fx-50FH II / 3650P: ${n} SHIFT nCr ${r} =, then multiply by ${a}^${r} using x^y.`,
        min: 12, diff: 'intermediate' } } },
  { topic: '二項分佈', n: 15, make: (k) => {
      const n = 6 + (k % 7), p = (0.2 + (k % 4) * 0.1).toFixed(1), x = 2 + (k % 3)
      const C = (nn, rr) => { let v = 1; for (let i = 0; i < rr; i++) v = v * (nn - i) / (i + 1); return Math.round(v) }
      const pr = C(n, x) * Math.pow(Number(p), x) * Math.pow(1 - Number(p), n - x)
      return { q: `某獨立重複試驗進行 ${n} 次，每次成功的概率為 ${p}。設 X 為成功次數。\n（a）指出 X 服從甚麼分佈，並寫出其概率質量函數。\n（b）求 P(X = ${x})。\n（c）求 E(X) 與 Var(X)，並說明為何 Var(X) 不等於 E(X)。`,
        ans: `（a）X ~ B(${n}, ${p})，即二項分佈。\nP(X = r) = C(${n}, r) · ${p}^r · (1 − ${p})^(${n} − r)，r = 0, 1, …, ${n}。\n三個條件必須齊：試驗次數固定、每次只有成功與失敗、各次獨立且成功概率不變。\n（b）P(X = ${x}) = C(${n}, ${x}) × ${p}^${x} × ${(1 - Number(p)).toFixed(1)}^${n - x} = ${pr.toFixed(4)}。\n（c）E(X) = np = ${n} × ${p} = ${(n * Number(p)).toFixed(2)}；Var(X) = np(1−p) = ${(n * Number(p) * (1 - Number(p))).toFixed(3)}。\n兩者不相等，是因為方差多乘了一個 (1 − p) 因子，而 0 < 1 − p < 1，故 Var(X) 恆小於 E(X)。\n只有當 p 極小時兩者才接近 —— 那正是二項分佈可用泊松分佈近似的情況。\n⚠️ 把 E(X) 當成 Var(X) 是本課題最常見的失分位。${CASIO(`P(X = ${x})：先按 ${n} SHIFT nCr ${x} =，記下 ${C(n, x)}；再 × ${p} x^y ${x} × ${(1 - Number(p)).toFixed(1)} x^y ${n - x} =。分三段入機、每段記低中間值，好過一次過打一條長式。`)}`,
        ansEn: `(a) X ~ B(${n}, ${p}); P(X = r) = C(${n}, r)·${p}^r·(1-${p})^(${n}-r). The three conditions are a fixed number of trials, two outcomes, and independence with constant p. (b) P(X = ${x}) = ${pr.toFixed(4)}. (c) E(X) = np = ${(n * Number(p)).toFixed(2)}; Var(X) = np(1-p) = ${(n * Number(p) * (1 - Number(p))).toFixed(3)}. They differ by the factor (1-p), which lies strictly between 0 and 1, so the variance is always the smaller. Confusing the two is the commonest error here.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '正態分佈', n: 15, make: (k) => {
      const mu = 50 + k * 3, sd = 5 + (k % 5), x = mu + sd * (1 + (k % 3))
      const z = ((x - mu) / sd).toFixed(2)
      return { q: `某連續變量 X 服從正態分佈，平均數為 ${mu}，標準差為 ${sd}。\n（a）求 X = ${x} 對應的標準分數 z。\n（b）說明標準分數的意義，並解釋為何要先化成標準分數才查表。\n（c）若另一組數據的平均數與標準差都不同，兩組的原始分數可否直接比較？標準分數又可否？`,
        ans: `（a）z = (x − μ) / σ = (${x} − ${mu}) / ${sd} = ${z}。\n（b）標準分數表示該數值距離平均數【幾多個標準差】。\n要先化標準分數，是因為正態分佈有無限多個（每一組 μ 與 σ 都對應一個），不可能逐個造表；化成 z 之後全部歸到同一條標準正態曲線（μ = 0、σ = 1），一張表就足夠。\n（c）原始分數【不可】直接比較 —— 同樣是 ${x}，在一組數據中可能屬中游，在另一組可能屬高位，取決於各自的 μ 與 σ。\n標準分數【可以】比較，因為它已經把單位與離散程度都除走，剩下的是相對位置。\n這正是標準分數的用途：把不同尺度的量放到同一把尺上。\n⚠️ 留意 z 只描述相對位置，不代表「較好」—— 若該變量是失誤次數，z 愈大反而愈差。${CASIO(`計 (${x} − ${mu}) ÷ ${sd}：先入括號 ( ${x} − ${mu} ) ÷ ${sd} =。查標準正態表時 z 通常取兩位小數，故此處記 ${z}；本機無內建正態累積函數，必須配合試卷所附的表。`)}`,
        ansEn: `(a) z = (${x} - ${mu})/${sd} = ${z}. (b) A z-score states how many standard deviations a value lies from the mean. Standardising is necessary because there is a different normal curve for every μ and σ; converting to z maps them all onto one standard curve (μ = 0, σ = 1) so a single table suffices. (c) Raw scores cannot be compared across groups with different μ and σ; z-scores can, because units and spread have been divided out, leaving relative position. Note that a larger z is not automatically "better" — if the variable counts errors, it is worse.`,
        min: 13, diff: 'intermediate' } } },
  { topic: '微分', n: 15, make: (k) => {
      const a = 2 + (k % 5), b = 3 + (k % 4), x0 = 1 + (k % 3)
      const d = 3 * a * x0 * x0 - 2 * b * x0
      return { q: `設 f(x) = ${a}x³ − ${b}x²。\n（a）求 f′(x)。\n（b）求曲線在 x = ${x0} 處切線的斜率。\n（c）求 f(x) 的所有駐點，並判斷各為極大、極小還是拐點。須說明判斷方法。`,
        ans: `（a）f′(x) = ${3 * a}x² − ${2 * b}x。\n（b）f′(${x0}) = ${3 * a} × ${x0}² − ${2 * b} × ${x0} = ${d}。\n（c）令 f′(x) = 0：x(${3 * a}x − ${2 * b}) = 0，得 x = 0 或 x = ${(2 * b / (3 * a)).toFixed(4)}。\n判斷方法（二階導數測試）：f″(x) = ${6 * a}x − ${2 * b}。\n· x = 0：f″(0) = −${2 * b} < 0，故為【極大】。\n· x = ${(2 * b / (3 * a)).toFixed(4)}：f″ = ${(6 * a * (2 * b / (3 * a)) - 2 * b).toFixed(4)} > 0，故為【極小】。\n若 f″ = 0 則二階測試失效，須改用一階導數在該點兩側的正負變化來判斷 —— 這時才可能是拐點。\n⚠️ 常見錯誤：見 f″ = 0 就直接斷定為拐點。f″ = 0 只是必要而非充分條件。${CASIO(`本機可用數值微分驗算：SHIFT d/dx，輸入函數與 x = ${x0}，答案應接近 ${d}。此法只作【核對】用 —— 考試要求寫出 f′(x) 的代數式，直接寫數值答案不得分。`)}`,
        ansEn: `(a) f'(x) = ${3 * a}x² - ${2 * b}x. (b) f'(${x0}) = ${d}. (c) Setting f'(x) = 0 gives x = 0 or x = ${(2 * b / (3 * a)).toFixed(4)}. With f''(x) = ${6 * a}x - ${2 * b}: at x = 0, f'' < 0 so it is a MAXIMUM; at the other root f'' > 0 so it is a MINIMUM. Where f'' = 0 the second-derivative test is inconclusive and the sign change of f' on either side must be used instead — only then can a point of inflexion arise. Treating f'' = 0 as proof of inflexion is the common error.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '積分', n: 15, make: (k) => {
      const a = 2 + (k % 5), b = 1 + (k % 4), lo = 0, hi = 1 + (k % 3)
      const F = (x) => (a * Math.pow(x, 3)) / 3 + (b * Math.pow(x, 2)) / 2
      const val = (F(hi) - F(lo)).toFixed(4)
      return { q: `設 f(x) = ${a}x² + ${b}x。\n（a）求 ∫ f(x) dx。\n（b）求 ∫ 由 ${lo} 至 ${hi} 的定積分。\n（c）解釋定積分與不定積分的分別，並說明 (b) 的答案在幾何上代表甚麼、在甚麼條件下才等於「面積」。`,
        ans: `（a）∫ (${a}x² + ${b}x) dx = ${a}x³/3 + ${b}x²/2 + C。\n（b）代入上下限：[${a}x³/3 + ${b}x²/2] 由 ${lo} 至 ${hi}\n= (${a} × ${hi}³/3 + ${b} × ${hi}²/2) − 0 = ${val}。\n（c）不定積分得出的是【一族函數】（相差一個常數 C）；定積分得出的是【一個數值】，常數 C 在相減時抵消，所以定積分不需要寫 C。\n幾何意義：定積分是曲線與 x 軸之間的【有向面積】—— 曲線在 x 軸上方的部分計正，下方的部分計負。\n只有當 f(x) 在整個積分區間內【不變號】時，定積分的值才等於實際面積。若區間內有變號，須先求零點、分段積分再取絕對值相加。\n⚠️ 本題最常見的失分位：把「定積分」直接讀成「面積」而不檢查符號。${CASIO(`驗算定積分：SHIFT ∫dx，輸入函數、下限 ${lo}、上限 ${hi}，應得約 ${val}。同樣只作核對 —— 考試要寫出原函數與代入過程，只寫數值不得分。`)}`,
        ansEn: `(a) ${a}x³/3 + ${b}x²/2 + C. (b) Substituting the limits gives ${val}. (c) An indefinite integral is a FAMILY of functions differing by C; a definite integral is a NUMBER, and C cancels on subtraction. Geometrically it is the SIGNED area between the curve and the x-axis — positive above, negative below — so it equals the actual area only where f(x) does not change sign on the interval. Otherwise find the zeros, integrate piecewise and add the absolute values. Reading "definite integral" as "area" without checking the sign is the usual error.`,
        min: 14, diff: 'hard' } } },
  { topic: '排列與組合', n: 15, make: (k) => {
      const n = 6 + (k % 6), r = 3 + (k % 3)
      const P = (nn, rr) => { let v = 1; for (let i = 0; i < rr; i++) v *= nn - i; return v }
      const C = (nn, rr) => Math.round(P(nn, rr) / P(rr, rr))
      return { q: `由 ${n} 名學生中選出 ${r} 名。\n（a）若要選出並排成一行合照，有多少種安排？\n（b）若只需選出而不分次序，有多少種選法？\n（c）解釋 (a) 與 (b) 相差的倍數是甚麼，並說明何時該用排列、何時該用組合。`,
        ans: `（a）排列：P(${n}, ${r}) = ${n} × ${n - 1} × … = ${P(n, r)} 種。\n（b）組合：C(${n}, ${r}) = ${C(n, r)} 種。\n（c）相差 ${r}! = ${P(r, r)} 倍，即 P(${n},${r}) ÷ C(${n},${r}) = ${P(n, r)} ÷ ${C(n, r)} = ${P(r, r)}。\n原因：組合只計「揀邊 ${r} 個」，而每一組被揀中的 ${r} 個人，自己之間仍有 ${r}! 種排法 —— 排列把這些都當成不同安排，組合則當成同一種。\n判斷方法：問一句「調轉次序算唔算另一種情況」。\n算 → 用排列（排隊、頒獎名次、密碼）；\n唔算 → 用組合（選代表、抽樣、分組）。\n⚠️ 本題失分多數不在計算，而在判斷用哪一個 —— 先答這一問，再入機。${CASIO(`P(${n}, ${r})：按 ${n} SHIFT nPr ${r} =；C(${n}, ${r})：按 ${n} SHIFT nCr ${r} =。兩個掣通常在同一粒鍵的上下檔，撳錯檔位是常見失誤 —— 入完之後可用「排列必大於或等於組合」快速核對方向。`)}`,
        ansEn: `(a) P(${n}, ${r}) = ${P(n, r)}. (b) C(${n}, ${r}) = ${C(n, r)}. (c) They differ by ${r}! = ${P(r, r)}, because a combination counts only WHICH ${r} are chosen while each such set can still be ordered in ${r}! ways. Ask whether reordering counts as a different case: if yes use permutations (queues, placings, passcodes); if no use combinations (representatives, samples, groups). Marks are usually lost on the choice, not the arithmetic.`,
        min: 12, diff: 'basic' } } },
  { topic: '統計推斷', n: 15, make: (k) => {
      const n = 30 + k * 10, mean = 60 + k * 2, sd = 8 + (k % 5)
      const se = (sd / Math.sqrt(n)).toFixed(3)
      return { q: `由某總體隨機抽取 ${n} 個樣本，樣本平均數為 ${mean}，總體標準差已知為 ${sd}。\n（a）求樣本平均數的標準誤。\n（b）構造 95% 置信區間（z = 1.96）。\n（c）若把樣本量由 ${n} 增至 ${n * 4}，區間寬度會如何變化？請計算並說明為何不是變成四分之一。`,
        ans: `（a）標準誤 SE = σ / √n = ${sd} / √${n} = ${se}。\n（b）95% 置信區間 = ${mean} ± 1.96 × ${se} = ${mean} ± ${(1.96 * Number(se)).toFixed(3)}\n即 (${(mean - 1.96 * Number(se)).toFixed(3)}, ${(mean + 1.96 * Number(se)).toFixed(3)})。\n（c）樣本量增至 ${n * 4} 時，SE = ${sd} / √${n * 4} = ${(sd / Math.sqrt(n * 4)).toFixed(3)}，即原來的【一半】。\n區間寬度隨之減半，而非減至四分之一。\n原因：標準誤與 √n 成反比，不是與 n 成反比。樣本量增至四倍，√n 只增至兩倍，故精度只提升一倍。\n實務含意：要把區間再收窄一半，樣本量又要再增四倍 —— 精度的邊際成本上升得很快，這正是抽樣調查不會無限加大樣本的原因。\n⚠️ 「四倍樣本 = 四分之一寬度」是本課題最常見的直覺錯誤。${CASIO(`√${n} 用 √ 掣；${sd} ÷ √${n} 建議分兩步入機並記低中間值 ${se}，再乘 1.96。一次過打成一條長式好易漏括號。`)}`,
        ansEn: `(a) SE = σ/√n = ${se}. (b) ${mean} ± 1.96 × ${se}, i.e. (${(mean - 1.96 * Number(se)).toFixed(3)}, ${(mean + 1.96 * Number(se)).toFixed(3)}). (c) At n = ${n * 4} the standard error becomes ${(sd / Math.sqrt(n * 4)).toFixed(3)} — HALF, not a quarter. The standard error varies with 1/√n, so quadrupling n only doubles √n and halves the width. Halving the interval again would need another fourfold increase; the marginal cost of precision rises steeply, which is why surveys do not simply enlarge the sample without limit.`,
        min: 15, diff: 'hard' } } },
]

// ── 數學 M2 ─────────────────────────────────────────────────────────────
const M2 = [
  { topic: '極限', n: 15, make: (k) => {
      const a = 2 + (k % 5), b = 3 + (k % 4)
      return { q: `求下列極限並說明每一步的依據。\n（a）lim(x→∞) (${a}x² + ${b}x) / (${b}x² + ${a})\n（b）lim(x→0) sin(${a}x) / x\n（c）解釋為何 (a) 不可以直接把 x = ∞ 代入，而 (b) 亦不可以直接把 x = 0 代入。兩者屬於哪一類不定型？`,
        ans: `（a）分子分母同除以 x²：\nlim (${a} + ${b}/x) / (${b} + ${a}/x²) = ${a} / ${b} = ${(a / b).toFixed(4)}。\n依據：x → ∞ 時 ${b}/x → 0、${a}/x² → 0。\n（b）利用標準極限 lim(u→0) sin u / u = 1：\n把式寫成 ${a} · [sin(${a}x) / (${a}x)]，當 x → 0 時 ${a}x → 0，故極限 = ${a} × 1 = ${a}。\n（c）(a) 直接代入得 ∞/∞，(b) 直接代入得 0/0 —— 兩者都是【不定型】：這些式子本身沒有確定值，同樣形狀的不同函數可以趨向完全不同的極限。\n所以必須先【變形】（同除最高次冪、湊標準極限、因式分解或用洛必達法則），把不定型化掉之後才可以代入。\n⚠️ 常見錯誤：見到 0/0 就答「0」或「不存在」。0/0 不是一個值，而是一個「要繼續做」的訊號。${CASIO(`本機無符號運算，但可用數值逼近核對方向：把 x 依次代 1000、10000 入 (a)，觀察是否趨向 ${(a / b).toFixed(4)}；把 x 代 0.001 入 (b)，應接近 ${a}。此法只作【核對】，考試必須寫出變形過程。`)}`,
        ansEn: `(a) Divide numerator and denominator by x²: the limit is ${a}/${b} = ${(a / b).toFixed(4)}, since ${b}/x and ${a}/x² both tend to 0. (b) Write it as ${a}·[sin(${a}x)/(${a}x)] and use lim(u→0) sin u/u = 1, giving ${a}. (c) Direct substitution gives ∞/∞ and 0/0 respectively — INDETERMINATE forms, which have no value in themselves: different functions of the same shape approach different limits. The expression must first be transformed. Answering "0" or "does not exist" on sight of 0/0 is the common error; 0/0 is a signal to keep working.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '微分法', n: 15, make: (k) => {
      const a = 2 + (k % 5), n1 = 2 + (k % 3), b = 1 + (k % 4)
      return { q: `設 y = (${a}x + ${b})^${n1 + 1}。\n（a）用鏈式法則求 dy/dx。\n（b）求 x = 1 處的 dy/dx 值。\n（c）若改為隱函數 x² + y² = ${a * a + b * b}，求 dy/dx，並說明隱函數求導與 (a) 的做法有何根本分別。`,
        ans: `（a）令 u = ${a}x + ${b}，y = u^${n1 + 1}。\ndy/dx = dy/du × du/dx = ${n1 + 1}u^${n1} × ${a} = ${a * (n1 + 1)}(${a}x + ${b})^${n1}。\n（b）x = 1 時，${a}x + ${b} = ${a + b}；dy/dx = ${a * (n1 + 1)} × ${a + b}^${n1} = ${(a * (n1 + 1) * Math.pow(a + b, n1)).toFixed(0)}。\n（c）對 x² + y² = ${a * a + b * b} 兩邊同時對 x 求導：\n2x + 2y · (dy/dx) = 0，故 dy/dx = −x / y。\n根本分別：(a) 的 y 是【x 的顯式函數】，可以直接寫出 y = f(x) 再求導；隱函數則無法（或不必）解出 y，而是把 y 視為 x 的函數，對含 y 的項用鏈式法則多乘一個 dy/dx，再解出它。\n所以隱函數的答案通常同時含 x 與 y —— 這不是做錯，而是隱函數的正常形態。\n⚠️ 常見錯誤：對 y² 求導寫成 2y 而漏了 dy/dx。呢個乘數正是「y 是 x 的函數」這個事實的體現。${CASIO(`(b) 的數值可用 SHIFT d/dx 核對：輸入 (${a}x + ${b})^${n1 + 1}、x = 1，應得 ${(a * (n1 + 1) * Math.pow(a + b, n1)).toFixed(0)}。隱函數本機做唔到，(c) 必須手做。`)}`,
        ansEn: `(a) With u = ${a}x + ${b}, dy/dx = ${n1 + 1}u^${n1} × ${a} = ${a * (n1 + 1)}(${a}x + ${b})^${n1}. (b) At x = 1 this is ${(a * (n1 + 1) * Math.pow(a + b, n1)).toFixed(0)}. (c) Differentiating x² + y² = ${a * a + b * b} throughout gives 2x + 2y(dy/dx) = 0, so dy/dx = -x/y. The difference: in (a) y is an EXPLICIT function of x; implicitly, y is not solved for but treated as a function of x, so every term in y carries an extra dy/dx by the chain rule. An answer containing both x and y is normal here. Writing d(y²)/dx as 2y without dy/dx is the standard slip.`,
        min: 15, diff: 'hard' } } },
  { topic: '積分法', n: 15, make: (k) => {
      const a = 2 + (k % 4), b = 1 + (k % 5)
      return { q: `求 ∫ x·(${a}x² + ${b})^3 dx。\n（a）指出應採用哪一種積分技巧，並說明如何辨認。\n（b）完成積分。\n（c）若被積函數改為 (${a}x² + ${b})^3（少了前面的 x），(a) 的方法是否仍然適用？試說明。`,
        ans: `（a）採用【換元法】。辨認方法：被積函數中出現一個複合結構 (${a}x² + ${b})，而它的導數 ${2 * a}x 與式中另一因子 x 只差一個常數倍 —— 這正是換元法可用的標誌。\n（b）設 u = ${a}x² + ${b}，則 du = ${2 * a}x dx，即 x dx = du / ${2 * a}。\n∫ x(${a}x² + ${b})³ dx = ∫ u³ · du/${2 * a} = (1/${2 * a}) · u⁴/4 + C = (${a}x² + ${b})⁴ / ${8 * a} + C。\n（c）【不適用】。少了 x 之後，式中再沒有 u 的導數那一部分，湊不出 du，換元後會剩下一個仍含 x 的因子。\n此時要改用其他做法：把 (${a}x² + ${b})³ 直接展開成多項式，再逐項積分。\n⚠️ 這一問正是本課題的分辨點：換元法能否使用，取決於【式中有沒有 u 的導數】，而不是取決於式子看起來複不複雜。${CASIO(`核對：SHIFT ∫dx 求 0 至 1 的定積分，答案應等於把 (${a}x² + ${b})⁴/${8 * a} 代入上下限之差，即 ${((Math.pow(a + b, 4) - Math.pow(b, 4)) / (8 * a)).toFixed(4)}。核對用，過程仍要手寫。`)}`,
        ansEn: `(a) SUBSTITUTION. The tell-tale sign is that the composite (${a}x² + ${b}) has derivative ${2 * a}x, which differs from the other factor x only by a constant. (b) With u = ${a}x² + ${b} and x dx = du/${2 * a}, the integral is u⁴/(${8 * a}) + C = (${a}x² + ${b})⁴/${8 * a} + C. (c) It no longer works: without the x there is nothing to supply du, and after substituting an x would remain. Expand the cube into a polynomial and integrate term by term instead. Whether substitution applies depends on the presence of du, not on how complicated the expression looks.`,
        min: 15, diff: 'hard' } } },
  { topic: '矩陣與行列式', n: 15, make: (k) => {
      const a = 1 + (k % 4), b = 2 + (k % 3), c = 3 + (k % 5), d = 4 + (k % 4)
      const det = a * d - b * c
      return { q: `設 A = [[${a}, ${b}], [${c}, ${d}]]。\n（a）求 det A。\n（b）判斷 A 是否可逆；若可逆，求 A⁻¹。\n（c）解釋 det A = 0 在解線性方程組上代表甚麼。`,
        ans: `（a）det A = ${a} × ${d} − ${b} × ${c} = ${det}。\n（b）det A = ${det}，${det === 0 ? '等於 0，故 A【不可逆】，A⁻¹ 不存在。' : `不等於 0，故 A【可逆】。\nA⁻¹ = (1/${det}) [[${d}, −${b}], [−${c}, ${a}]]，即 [[${(d / det).toFixed(4)}, ${(-b / det).toFixed(4)}], [${(-c / det).toFixed(4)}, ${(a / det).toFixed(4)}]]。\n口訣：主對角線兩項對調，副對角線兩項變號，全體除以行列式。`}\n（c）det A = 0 代表 A 不可逆，對應的方程組 Ax = b 【沒有唯一解】——\n它或者無解（兩條方程互相矛盾），或者有無限多組解（兩條方程實質是同一條）。\n幾何上：兩條直線由「相交於一點」變成「平行」或「重合」。\n所以 det ≠ 0 是唯一解存在的判準，而不是「解比較容易求」。\n⚠️ 常見錯誤：把 det = 0 直接讀成「無解」。無解與無限多解都對應 det = 0，要再看常數項才分得出。`,
        ansEn: `(a) det A = ${a}·${d} - ${b}·${c} = ${det}. (b) ${det === 0 ? 'Since det A = 0, A is SINGULAR and has no inverse.' : `Since det A = ${det} ≠ 0, A is invertible and A⁻¹ = (1/${det})[[${d}, -${b}], [-${c}, ${a}]]. Swap the leading diagonal, negate the other, divide by the determinant.`} (c) det A = 0 means Ax = b has NO UNIQUE solution — either none (contradictory equations) or infinitely many (the same equation twice). Geometrically the two lines go from crossing at a point to being parallel or coincident. Reading det = 0 as "no solution" is the common error; the constant terms decide which case it is.`,
        min: 13, diff: 'intermediate' } } },
  { topic: '向量', n: 15, make: (k) => {
      const a1 = 1 + (k % 4), a2 = 2 + (k % 3), b1 = 3 + (k % 5), b2 = 1 + (k % 4)
      const dot = a1 * b1 + a2 * b2
      const ma = Math.sqrt(a1 * a1 + a2 * a2), mb = Math.sqrt(b1 * b1 + b2 * b2)
      const cos = (dot / (ma * mb)).toFixed(4)
      return { q: `設 a = ${a1}i + ${a2}j，b = ${b1}i + ${b2}j。\n（a）求 a · b 及兩者的模。\n（b）求 a 與 b 之間夾角的餘弦值。\n（c）說明點積為零代表甚麼幾何關係，並解釋為何點積可以用來判斷垂直而模不能。`,
        ans: `（a）a · b = ${a1} × ${b1} + ${a2} × ${b2} = ${dot}；\n|a| = √(${a1}² + ${a2}²) = ${ma.toFixed(4)}；|b| = √(${b1}² + ${b2}²) = ${mb.toFixed(4)}。\n（b）cos θ = (a · b) / (|a||b|) = ${dot} / (${ma.toFixed(4)} × ${mb.toFixed(4)}) = ${cos}。\n（c）a · b = 0 代表兩向量【互相垂直】（在兩者皆非零向量的前提下）。\n原因：a · b = |a||b| cos θ，兩個模皆不為零時，點積為零只可能因為 cos θ = 0，即 θ = 90°。\n模不能用來判斷垂直，是因為模只描述【單一向量的長度】，完全不含兩者之間的方向關係；兩條等長的向量可以垂直、可以平行、可以任意夾角。\n點積之所以做得到，正正因為它同時吃進兩個向量，並且把方向差以 cos θ 的形式帶進結果。\n⚠️ 留意「非零向量」這個前提：零向量與任何向量的點積都是零，但不能說它垂直於一切。${CASIO(`√(${a1}² + ${a2}²)：先算 ${a1}² + ${a2}² 再開方，或用 Pol( 極座標轉換一次過得出模與角。用 Pol( 時記得先確認角度單位（DEG／RAD）—— 單位設錯係呢類題最常見嘅失分。`)}`,
        ansEn: `(a) a·b = ${dot}; |a| = ${ma.toFixed(4)}, |b| = ${mb.toFixed(4)}. (b) cos θ = ${cos}. (c) A zero dot product means the vectors are PERPENDICULAR, provided neither is the zero vector: since a·b = |a||b|cos θ, with non-zero magnitudes the product vanishes only when cos θ = 0. Magnitude cannot test perpendicularity because it describes one vector's length alone and carries no information about the angle between two. The dot product can because it takes both vectors and encodes their angular difference through cos θ. Note the non-zero proviso: the zero vector has zero dot product with everything but is not perpendicular to everything.`,
        min: 14, diff: 'intermediate' } } },
  { topic: '數學歸納法', n: 15, make: (k) => {
      const c = 1 + (k % 5)
      return { q: `試用數學歸納法證明：對所有正整數 n，1 + 2 + … + n = n(n+1)/2，並回答以下問題。\n（a）寫出基礎步驟（n = 1）的驗證。\n（b）寫出歸納步驟的假設與所需證明的目標。\n（c）有同學說「試多幾個 n（例如 n = 1 至 ${c + 5}）都成立，就等於證明咗」。試指出這個說法錯在哪裏。`,
        ans: `（a）基礎步驟：n = 1 時，左邊 = 1；右邊 = 1 × 2 / 2 = 1。左右相等，故命題對 n = 1 成立。\n（b）歸納假設：設 n = m 時命題成立，即 1 + 2 + … + m = m(m+1)/2。\n需要證明：n = m + 1 時亦成立，即 1 + 2 + … + m + (m+1) = (m+1)(m+2)/2。\n證明：左邊 = m(m+1)/2 + (m+1)（用了歸納假設）\n= (m+1)[m/2 + 1] = (m+1)(m+2)/2 = 右邊。故命題對 n = m + 1 成立。\n由基礎步驟與歸納步驟，按數學歸納法，命題對所有正整數 n 成立。\n（c）該說法錯在把【有限次驗證】當成【對無限多個情況的證明】。\n正整數有無限多個，驗證到 ${c + 5} 只排除了頭 ${c + 5} 個反例，其後仍有無限多個未檢查。\n數學史上有不少命題在極大的範圍內成立而最終仍被推翻，正說明窮舉不能取代證明。\n歸納法的力量在於：基礎步驟建立起點，歸納步驟建立【由任何一個推到下一個】的通用機制，兩者合起來才覆蓋無限。\n⚠️ 答本題必須把「無限」這一點寫出來，只答「唔夠嚴謹」不足以取分。`,
        ansEn: `(a) At n = 1 the left side is 1 and the right side is 1×2/2 = 1, so the statement holds. (b) Assume it holds at n = m; show it holds at n = m+1: the left side is m(m+1)/2 + (m+1) = (m+1)(m+2)/2, which is the required right side. (c) The claim mistakes finitely many checks for a proof over infinitely many cases: verifying up to ${c + 5} rules out only the first ${c + 5} counterexamples. Mathematics contains statements that hold over vast ranges and still fail. Induction works because the base case fixes a starting point and the inductive step supplies a general mechanism from any case to the next; together they cover the infinite. The word "infinite" must appear in the answer.`,
        min: 15, diff: 'hard' } } },
  { topic: '線性方程組', n: 15, make: (k) => {
      const a = 1 + (k % 4), b = 2 + (k % 3), c = 3 + (k % 5), d = 4 + (k % 4)
      const e = 5 + (k % 6), f = 6 + (k % 5)
      const det = a * d - b * c
      return { q: `考慮方程組：${a}x + ${b}y = ${e}；${c}x + ${d}y = ${f}。\n（a）寫成矩陣形式並求係數矩陣的行列式。\n（b）解該方程組（若有唯一解）。\n（c）說明行列式的值如何決定解的個數，並指出三種可能情況。`,
        ans: `（a）矩陣形式：[[${a}, ${b}], [${c}, ${d}]] [x, y]ᵀ = [${e}, ${f}]ᵀ。\ndet = ${a} × ${d} − ${b} × ${c} = ${det}。\n（b）${det === 0 ? `det = 0，故【沒有唯一解】。須進一步檢查兩條方程是否成比例：若常數項亦成同一比例則有無限多解，否則無解。` : `det = ${det} ≠ 0，有唯一解。\n用克拉瑪法則：\nx = |[[${e}, ${b}], [${f}, ${d}]]| / det = (${e} × ${d} − ${b} × ${f}) / ${det} = ${((e * d - b * f) / det).toFixed(4)}；\ny = |[[${a}, ${e}], [${c}, ${f}]]| / det = (${a} × ${f} − ${e} × ${c}) / ${det} = ${((a * f - e * c) / det).toFixed(4)}。`}\n（c）三種情況：\n一、det ≠ 0 —— 【唯一解】，幾何上兩直線相交於一點。\n二、det = 0 且兩式（連常數項）成比例 —— 【無限多解】，兩直線重合。\n三、det = 0 但常數項不成比例 —— 【無解】，兩直線平行而不重合。\n⚠️ det = 0 只把情況二與三區分開一半，必須再看常數項 —— 這是本題最常見的漏答位。${CASIO(`本機無矩陣模式，行列式須手算 ${a}×${d} − ${b}×${c}。克拉瑪法則的兩個分子同樣手算，最後兩次除法先入機。建議把 det 記低喺草稿紙，兩次除法共用同一個分母，可省一次輸入。`)}`,
        ansEn: `(a) [[${a}, ${b}], [${c}, ${d}]][x, y]ᵀ = [${e}, ${f}]ᵀ with det = ${det}. (b) ${det === 0 ? 'det = 0, so there is no unique solution; check whether the constants share the same ratio to decide between infinitely many and none.' : `det ≠ 0, so by Cramer's rule x = ${((e * d - b * f) / det).toFixed(4)} and y = ${((a * f - e * c) / det).toFixed(4)}.`} (c) Three cases: det ≠ 0 gives a unique solution (lines crossing); det = 0 with proportional constants gives infinitely many (coincident lines); det = 0 with non-proportional constants gives none (parallel lines). A zero determinant only narrows it to the last two — the constants must still be checked.`,
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
          '本題考核的是【由已知走到結論】的完整過程：計算要寫得出步驟與依據，'
          + '解釋要指出機制而非複述現象，延伸部分要處理題目指定的比較、限制或評估。'
          + '評卷關注的不是最終數字，而是每一步是否有依據 —— '
          + '答案正確而過程跳步，與過程完整而末步算錯，前者失分往往更多。',
        referenceAnswer: r.ans,
        referenceAnswerEn: r.ansEn,
        markingScheme:
          `本題分三部分評分（本平台練習用尺度）：\n`
          + `（a）計算或辨識 —— 步驟是否寫出、依據是否註明、單位是否正確。\n`
          + `（b）解釋 —— 是否指出機制而非只複述現象。\n`
          + `（c）延伸判斷 —— 是否處理了題目指定的比較、限制或評估，並說明理由。\n`
          + `建議用時 ${r.min} 分鐘。\n${TAIL_ZH}`,
        markingSchemeEn:
          `Three parts (a practice scale used on this platform):\n`
          + `(a) calculation or identification — steps shown, reasoning named, units correct;\n`
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
  console.log(`  ${subjectZh.padEnd(8)} → ${out.length} 條`)
  return out.length
}

console.log('生成書寫題草稿・第四批（reviewer 欄一律留空，待真人逐題簽署）：')
let total = 0
total += build('m1', '數學 M1', M1, 'm1_l')
total += build('m2', '數學 M2', M2, 'm2_l')
console.log(`\n合計 ${total} 條。`)
