// ============================================================================
// replace-m1.mts —— 數學延伸單元一（微積分與統計）模板替換 102 條
// ----------------------------------------------------------------------------
// 被替換的克隆組：標準分數 36、冪函數求導 20、代入求導 18、冪函數積分 16、
// 指數求導 14、二項期望值 13、乘積求導 12、組合數 10、二項機率 9、
// 二次極值 9、組合數 8、排列數 8。全部是「換個數字再問同一句」。
//
// ══ 一個【偏離大綱】的發現：排列組合不屬 M1 ══
//
// 封頂計劃要求為 permutation_combination 補 4 條。本批【不補】。
//
// 現有那批題目全部是純計算：「計算 $C^{5}_{2}$」「計算 $P^{5}_{2}$」。
// 排列與組合屬【必修部分】（更多關於概率），並不在 M1 課程範圍之內。
// M1（微積分與統計）三個範疇為：
//   基礎知識：二項展開式、指數與對數函數
//   微積分：導數、微分應用、不定積分、定積分及其應用
//   統計：條件概率與貝氏定理、離散隨機變量、二項／幾何／泊松分佈、
//         正態分佈、抽樣分佈與點估計、置信區間
// M1 只在二項展開式與二項分佈之內【用到】組合數作為工具，不會獨立考它本身。
//
// 同 m2/complex_numbers 屬同一類問題（見 replace-m2.mts）。那 4 個名額改為
// 分配給仍在範圍內、而且零容易題的 statistics_inference。
//
// ── 本批同時修正的單一難度／極端傾斜課題 ────────────────────────────────
//   normal_distribution   現有 易1 中45 難4  → 本批補 12 易
//   binomial_theorem      現有 易10 中0 難0  → 本批補 4 中
//   statistics_inference  現有 易0 中8 難3   → 本批補 4 易
//   integration           現有 易20 中5 難0  → 本批補 8 中 + 2 難
//
// ── 難度分佈同封頂計劃的落差 ────────────────────────────────────────────
// 計劃訂明易 53 / 中 47 / 難 2；本批為易 52 / 中 48 / 難 2，各差一條。
// 原因同 m2 一樣：一個原型只有一種難度，重新分配課題之後不可再任意切細。
//
// ── 公式（人手覆核點）──────────────────────────────────────────────────
//   積法則 $(uv)' = u'v + uv'$；商法則 $(u/v)' = (u'v - uv')/v^2$
//   鏈式法則 $\frac{d}{dx}f(g(x)) = f'(g(x))g'(x)$
//   $\frac{d}{dx}\ln f(x) = f'(x)/f(x)$
//   標準分數 $z = (x - \mu)/\sigma$；反查 $x = \mu + z\sigma$
//   正態經驗法則：$\pm1\sigma$ 約 68%、$\pm2\sigma$ 約 95%、$\pm3\sigma$ 約 99.7%
//   二項分佈 $E(X) = np$、$\mathrm{Var}(X) = np(1-p)$
//   $P(X \geq 1) = 1 - P(X = 0)$
//   二項展開式第 $r+1$ 項 $= \binom{n}{r} a^{n-r} b^{r}$
//   樣本平均數的標準誤 $= \sigma/\sqrt{n}$
// ============================================================================
import { emit, num, frac, type Arch } from './_archetype.mts'

const T = {
  dif: ['differentiation', '微分法', 'Differentiation'],
  nor: ['normal_distribution', '正態分佈', 'Normal Distribution'],
  itg: ['integration', '積分法', 'Integration'],
  bid: ['binomial_distribution', '二項分佈', 'Binomial Distribution'],
  // ⚠️ 唔可以用 'binomial_theorem' —— 佢喺 m1 係【未註冊】嘅孤兒課題（現有 10 條
  //    題掛喺上面，學生用課題入口永遠篩唔到）。已註冊嘅係 'binomial'。
  //    入庫閘正確攔截咗第一次嘗試，唔畀再製造孤兒。
  bit: ['binomial', '二項式定理', 'Binomial Theorem'],
  inf: ['statistics_inference', '統計推斷', 'Statistical Inference'],
} as const

const P_prod = [{ a: 2, n: 3 }, { a: 3, n: 2 }, { a: 4, n: 3 }, { a: 5, n: 2 }, { a: 2, n: 4 }, { a: 6, n: 3 }]
const P_quo  = [{ a: 3, b: 2 }, { a: 5, b: 3 }, { a: 2, b: 7 }, { a: 4, b: 5 }, { a: 7, b: 2 }, { a: 6, b: 5 }]
const P_chain= [{ a: 3, b: 2, n: 4 }, { a: 2, b: 5, n: 3 }, { a: 5, b: 1, n: 2 }, { a: 4, b: 3, n: 5 }, { a: 2, b: 7, n: 3 }, { a: 3, b: 4, n: 2 }]
const P_ln   = [{ a: 3, b: 2 }, { a: 5, b: 4 }, { a: 2, b: 9 }, { a: 7, b: 3 }, { a: 4, b: 5 }, { a: 6, b: 7 }]
const P_imp  = [{ a: 2, b: 3 }, { a: 5, b: 2 }, { a: 3, b: 7 }, { a: 4, b: 5 }, { a: 6, b: 5 }, { a: 7, b: 2 }]
const P_2nd  = [{ a: 2, b: 5, c: 3 }, { a: 3, b: 2, c: 7 }, { a: 5, b: 4, c: 2 }, { a: 4, b: 7, c: 5 }, { a: 6, b: 3, c: 4 }, { a: 7, b: 5, c: 6 }]
const P_inc  = [{ a: 1, b: -8 }, { a: 2, b: -12 }, { a: 1, b: -4 }, { a: 3, b: -18 }, { a: 1, b: -10 }, { a: 2, b: -20 }]
const P_2der = [{ a: 1, b: -6, c: 2 }, { a: 2, b: -12, c: 5 }]
const P_z    = [{ mu: 60, sd: 8, k: 1 }, { mu: 100, sd: 15, k: 2 }, { mu: 50, sd: 5, k: 1 },
                { mu: 72, sd: 8, k: 2 }, { mu: 120, sd: 20, k: 1 }, { mu: 45, sd: 4, k: 3 }]
const P_emp  = [{ mu: 70, sd: 10, k: 1 }, { mu: 500, sd: 100, k: 2 }, { mu: 160, sd: 5, k: 1 },
                { mu: 82, sd: 6, k: 2 }, { mu: 250, sd: 25, k: 3 }, { mu: 36, sd: 3, k: 1 }]
const P_rev  = [{ mu: 60, sd: 8, z: 1.5 }, { mu: 100, sd: 15, z: -2 }, { mu: 50, sd: 5, z: 2.4 },
                { mu: 72, sd: 6, z: -1.5 }, { mu: 200, sd: 25, z: 1.2 }, { mu: 88, sd: 4, z: -0.5 }]
const P_cmp  = [{ mA: 70, sA: 5, xA: 80, mB: 60, sB: 10, xB: 75 }, { mA: 50, sA: 4, xA: 58, mB: 100, sB: 20, xB: 130 },
                { mA: 120, sA: 15, xA: 150, mB: 80, sB: 6, xB: 89 }, { mA: 65, sA: 10, xA: 85, mB: 40, sB: 5, xB: 48 },
                { mA: 200, sA: 25, xA: 250, mB: 30, sB: 3, xB: 36 }, { mA: 90, sA: 12, xA: 108, mB: 45, sB: 9, xB: 63 }]
const P_apx  = [{ n: 100, p: 0.4 }, { n: 400, p: 0.25 }, { n: 200, p: 0.1 }, { n: 900, p: 0.2 }, { n: 500, p: 0.4 }, { n: 300, p: 0.3 }]
// ⚠️ 下限【不可為 0】：F(0) = 0 會令「只代上限、忘記減下限」這個干擾項
//    啱啱等於正解，該題就再攔唔到嗰個錯誤。
const P_def  = [{ a: 3, lo: 1, hi: 2 }, { a: 2, lo: 1, hi: 3 }, { a: 4, lo: 1, hi: 3 },
                { a: 6, lo: 2, hi: 4 }, { a: 5, lo: 1, hi: 2 }, { a: 3, lo: 2, hi: 5 }]
const P_area = [{ a: 1, hi: 4 }, { a: 2, hi: 5 }]
const P_init = [{ a: 6, x0: 1, y0: 5 }, { a: 4, x0: 2, y0: 3 }]
const P_var  = [{ n: 20, p: 0.4 }, { n: 50, p: 0.2 }, { n: 12, p: 0.25 }, { n: 80, p: 0.15 }, { n: 30, p: 0.6 }, { n: 45, p: 0.8 }]
const P_atl1 = [{ n: 5, p: 0.2 }, { n: 4, p: 0.5 }, { n: 6, p: 0.1 }, { n: 3, p: 0.4 }]
// 「求展開式中某項係數」嘅問法同題庫已有嘅 $(1+x)^n$ 係數題 78% 重複 ——
// 換個第二項唔算真正唔同嘅題。改為考【係數之和】：代 $x = 1$ 即得，
// 考嘅係對「展開式係一條恆等式」嘅理解，唔係機械展開。題庫零覆蓋。
// ⚠️ `a` 不可為 1 —— 題幹會寫成「1x」，唔係數學寫法（m2 同一個坑踩過一次）。
const P_term = [{ a: 2, b: 1, n: 4 }, { a: 2, b: 5, n: 3 }, { a: 3, b: 2, n: 3 }, { a: 2, b: 3, n: 4 }]
const P_se   = [{ sd: 12, n: 36 }, { sd: 20, n: 100 }, { sd: 15, n: 25 }, { sd: 8, n: 64 }]

/** 係數 1 唔寫出嚟（"1x^2" 唔係數學寫法）。 */
const co = (k: number) => (k === 1 ? '' : String(k))

const nCr = (n: number, r: number): number => { let v = 1; for (let i = 0; i < r; i++) v = (v * (n - i)) / (i + 1); return Math.round(v) }
const pct = (k: number) => (k === 1 ? '68%' : k === 2 ? '95%' : '99.7%')

const archs: Arch[] = [
  // ── 微分法 44（30 易 + 14 中）──────────────────────────────────────────
  {
    key: 'm1_product_rule', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, n } = P_prod[i]
      return {
        q: [`求 $\\dfrac{d}{dx}\\left(x^{${n}} \\sin ${a}x\\right)$。`,
            `Find $\\dfrac{d}{dx}\\left(x^{${n}} \\sin ${a}x\\right)$.`],
        ans: `$${n}x^{${n - 1}} \\sin ${a}x + ${a}x^{${n}} \\cos ${a}x$`,
        wrong: [
          `$${n * a}x^{${n - 1}} \\cos ${a}x$`,
          `$${n}x^{${n - 1}} \\sin ${a}x + x^{${n}} \\cos ${a}x$`,
          `$${n}x^{${n - 1}} \\cos ${a}x + ${a}x^{${n}} \\sin ${a}x$`,
        ],
        e: [`兩個函數相乘要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{${n}}$、$v = \\sin ${a}x$，則 $u' = ${n}x^{${n - 1}}$、$v' = ${a}\\cos ${a}x$（$\\sin ${a}x$ 對 $x$ 求導時，鏈式法則帶出一個因子 $${a}$）。代入得 $${n}x^{${n - 1}} \\sin ${a}x + ${a}x^{${n}} \\cos ${a}x$。第一個干擾項把兩個導數【直接相乘】—— 導數並無這種乘法規則，是初學積法則最常見的錯。第二項漏了 $v'$ 內部的因子 $${a}$。第三項把 $\\sin$ 同 $\\cos$ 的位置調轉了。`,
            `A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{${n}}$ and $v = \\sin ${a}x$, so $u' = ${n}x^{${n - 1}}$ and $v' = ${a}\\cos ${a}x$ — the chain rule contributes the factor $${a}$ when differentiating $\\sin ${a}x$. Substituting gives $${n}x^{${n - 1}} \\sin ${a}x + ${a}x^{${n}} \\cos ${a}x$. The first distractor simply multiplies the two derivatives, a rule that does not exist and the classic first error with products. The second omits the inner factor $${a}$, and the third swaps $\\sin$ and $\\cos$.`],
      }
    },
  },
  {
    key: 'm1_quotient_rule', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b } = P_quo[i]
      return {
        q: [`求 $\\dfrac{d}{dx}\\left(\\dfrac{${a}x}{x + ${b}}\\right)$。`,
            `Find $\\dfrac{d}{dx}\\left(\\dfrac{${a}x}{x + ${b}}\\right)$.`],
        ans: `$\\dfrac{${a * b}}{(x + ${b})^{2}}$`,
        wrong: [`$\\dfrac{${a}}{(x + ${b})^{2}}$`, `$${a}$`, `$\\dfrac{-${a * b}}{(x + ${b})^{2}}$`],
        e: [`用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = ${a}x$、$v = x + ${b}$，則 $u' = ${a}$、$v' = 1$。分子 $= ${a}(x + ${b}) - ${a}x \\cdot 1 = ${a}x + ${a * b} - ${a}x = ${a * b}$，故導數為 $\\dfrac{${a * b}}{(x + ${b})^{2}}$。留意分子的 $x$ 項【恰好抵銷】，這是本類題目的特徵。第一個干擾項只把分子的導數搬上去，忽略了商法則。答 $${a}$ 的把整條式當成一次函數直接求導。最後一項把分子兩項的減法次序調轉 —— 商法則的分子【必定是 $u'v$ 在前】，次序調轉會令整個符號相反。`,
            `Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = ${a}x$, $v = x + ${b}$, so $u' = ${a}$ and $v' = 1$. The numerator is $${a}(x + ${b}) - ${a}x \\cdot 1 = ${a}x + ${a * b} - ${a}x = ${a * b}$, giving $\\dfrac{${a * b}}{(x + ${b})^{2}}$. Note that the $x$ terms cancel exactly, which is characteristic of this type. The first distractor just moves the derivative of the numerator up and ignores the rule. Answering $${a}$ treats the whole expression as linear. The last option reverses the order of subtraction — in the quotient rule $u'v$ must come first, and reversing it flips every sign.`],
      }
    },
  },
  {
    key: 'm1_chain_rule', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b, n } = P_chain[i]
      return {
        q: [`求 $\\dfrac{d}{dx}\\left((${a}x + ${b})^{${n}}\\right)$。`,
            `Find $\\dfrac{d}{dx}\\left((${a}x + ${b})^{${n}}\\right)$.`],
        ans: `$${n * a}(${a}x + ${b})^{${n - 1}}$`,
        wrong: [`$${n}(${a}x + ${b})^{${n - 1}}$`, `$${n * a}(${a}x + ${b})^{${n}}$`, `$${n}(${a})^{${n - 1}}$`],
        e: [`鏈式法則：先當作整體求外層導數，再乘以內層的導數。外層 $u^{${n}}$ 的導數為 $${n}u^{${n - 1}}$，內層 $${a}x + ${b}$ 的導數為 $${a}$，兩者相乘得 $${n} \\times ${a} = ${n * a}$，故答案為 $${n * a}(${a}x + ${b})^{${n - 1}}$。第一個干擾項【漏了內層導數】$${a}$ —— 這是鏈式法則最集中的失分位，而且因為答案形式看似正確，特別難自己察覺。第二項忘記把指數減一。第三項把括號內整項誤當成單一個 $${a}x$。`,
            `Chain rule: differentiate the outer function treating the bracket as one object, then multiply by the derivative of the inside. The outer $u^{${n}}$ gives $${n}u^{${n - 1}}$; the inside $${a}x + ${b}$ gives $${a}$; multiplying, $${n} \\times ${a} = ${n * a}$, so the answer is $${n * a}(${a}x + ${b})^{${n - 1}}$. The first distractor drops the inner derivative $${a}$ — the commonest slip with the chain rule, and a hard one to catch because the answer still looks right in shape. The second forgets to reduce the exponent, and the third treats the whole bracket as just $${a}x$.`],
      }
    },
  },
  {
    key: 'm1_log_derivative', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { a, b } = P_ln[i]
      return {
        q: [`求 $\\dfrac{d}{dx}\\ln(${a}x^{2} + ${b})$。`,
            `Find $\\dfrac{d}{dx}\\ln(${a}x^{2} + ${b})$.`],
        ans: `$\\dfrac{${2 * a}x}{${a}x^{2} + ${b}}$`,
        wrong: [`$\\dfrac{1}{${a}x^{2} + ${b}}$`, `$\\dfrac{${2 * a}x}{${a}x^{2}}$`, `$${2 * a}x \\ln(${a}x^{2} + ${b})$`],
        e: [`$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子放它的導數。此處 $f(x) = ${a}x^{2} + ${b}$，$f'(x) = ${2 * a}x$，故答案為 $\\dfrac{${2 * a}x}{${a}x^{2} + ${b}}$。第一個干擾項只寫了 $\\dfrac{1}{f(x)}$，漏了分子的 $f'(x)$ —— 那是 $\\ln x$ 本身的導數，套到複合函數上就不成立，屬鏈式法則的同一類疏漏。第二項把分母的常數項刪掉，但分母必須完整保留原式。第三項把對數當成可以直接搬到外面的因子。`,
            `$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: copy the original expression into the denominator and put its derivative on top. Here $f(x) = ${a}x^{2} + ${b}$ and $f'(x) = ${2 * a}x$, giving $\\dfrac{${2 * a}x}{${a}x^{2} + ${b}}$. The first distractor writes only $\\dfrac{1}{f(x)}$ and drops $f'(x)$ — that is the derivative of $\\ln x$ itself, which does not carry over to a composite, and it is the same chain-rule oversight in another guise. The second deletes the constant from the denominator, which must reproduce the original expression in full. The third treats the logarithm as a factor that can be pulled outside.`],
      }
    },
  },
  {
    key: 'm1_implicit', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { a, b } = P_imp[i]
      return {
        q: [`已知 $${a}x^{2} + ${b}y^{2} = 10$。求 $\\dfrac{dy}{dx}$。`,
            `Given $${a}x^{2} + ${b}y^{2} = 10$, find $\\dfrac{dy}{dx}$.`],
        ans: `$-\\dfrac{${a}x}{${b}y}$`,
        wrong: [`$\\dfrac{${a}x}{${b}y}$`, `$-\\dfrac{${2 * a}x}{${b}y}$`, `$-\\dfrac{${a}x}{${2 * b}y}$`],
        e: [`兩邊同時對 $x$ 求導。左邊：$${2 * a}x + ${2 * b}y\\dfrac{dy}{dx}$ —— 對 $y^{2}$ 求導時，因為 $y$ 是 $x$ 的函數，鏈式法則會帶出 $\\dfrac{dy}{dx}$ 這個因子，這正是隱函數微分的關鍵一步。右邊常數的導數為 $0$。整理得 $\\dfrac{dy}{dx} = -\\dfrac{${2 * a}x}{${2 * b}y} = -\\dfrac{${a}x}{${b}y}$。第一個干擾項漏了負號 —— 移項時 $${2 * a}x$ 過到右邊必定變號。餘下兩項只約簡了分子或分母其中一邊的系數 $2$，另一邊卻沒有約，屬計算疏漏。`,
            `Differentiate both sides with respect to $x$. The left side gives $${2 * a}x + ${2 * b}y\\dfrac{dy}{dx}$ — differentiating $y^{2}$ brings out the factor $\\dfrac{dy}{dx}$ by the chain rule, because $y$ is a function of $x$, and this is the key step in implicit differentiation. The constant on the right differentiates to $0$. Rearranging, $\\dfrac{dy}{dx} = -\\dfrac{${2 * a}x}{${2 * b}y} = -\\dfrac{${a}x}{${b}y}$. The first distractor drops the minus sign, which must appear when $${2 * a}x$ is moved across. The other two cancel the factor $2$ on only one side of the fraction.`],
      }
    },
  },
  {
    key: 'm1_second_derivative', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b, c } = P_2nd[i]
      return {
        q: [`設 $f(x) = ${a}x^{3} + ${b}x^{2} + ${c}x$。求 $f''(x)$。`,
            `Let $f(x) = ${a}x^{3} + ${b}x^{2} + ${c}x$. Find $f''(x)$.`],
        ans: `$${6 * a}x + ${2 * b}$`,
        wrong: [`$${3 * a}x^{2} + ${2 * b}x + ${c}$`, `$${6 * a}x + ${2 * b}x$`, `$${6 * a}$`],
        e: [`求導兩次。第一次：$f'(x) = ${3 * a}x^{2} + ${2 * b}x + ${c}$。第二次：$f''(x) = ${6 * a}x + ${2 * b}$ —— 常數項 $${c}$ 在第二次求導時歸零。第一個干擾項只求了【一次】導數，是本題最主要的失分位，讀題時要留意撇號的數目。第二項把常數 $${2 * b}$ 誤寫成仍帶 $x$：$${2 * b}x$ 求導之後應為 $${2 * b}$，$x$ 必須消去。第三項多求了一次，那是 $f'''(x)$。`,
            `Differentiate twice. First, $f'(x) = ${3 * a}x^{2} + ${2 * b}x + ${c}$. Again, $f''(x) = ${6 * a}x + ${2 * b}$ — the constant $${c}$ vanishes on the second differentiation. The first distractor stops after one differentiation, the main trap here; count the primes when reading the question. The second keeps an $x$ on the constant term: $${2 * b}x$ differentiates to $${2 * b}$, and the $x$ must go. The third differentiates once too often and gives $f'''(x)$.`],
      }
    },
  },
  {
    key: 'm1_increasing_interval', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b } = P_inc[i]
      const root = -b / (2 * a)
      return {
        q: [`設 $f(x) = ${co(a)}x^{2} ${b} x$。求 $f(x)$ 為【遞增】的 $x$ 範圍。`,
            `Let $f(x) = ${co(a)}x^{2} ${b} x$. For which values of $x$ is $f(x)$ *increasing*?`],
        ans: `$x > ${num(root)}$`,
        wrong: [`$x < ${num(root)}$`, `$x > ${num(-b)}$`, `$x > 0$`],
        e: [`函數遞增即導數為正。$f'(x) = ${2 * a}x ${b}$，令 $f'(x) > 0$ 得 $x > ${num(root)}$。可以用圖像檢查：這是開口向上的拋物線，頂點在 $x = ${num(root)}$，頂點右邊上升、左邊下降。第一個干擾項把不等號方向弄反了，即答成遞減的範圍 —— 讀題時要看清楚問的是遞增還是遞減。第二項忘記了求導時 $x^{2}$ 帶出的因子 $2$。第三項憑直覺答「正數區間」，但頂點並不在原點。`,
            `A function increases where its derivative is positive. $f'(x) = ${2 * a}x ${b}$, and $f'(x) > 0$ gives $x > ${num(root)}$. Check it graphically: this is an upward parabola with vertex at $x = ${num(root)}$, rising to the right of the vertex and falling to the left. The first distractor reverses the inequality and describes where the function decreases — read carefully which is asked. The second forgets the factor $2$ that differentiating $x^{2}$ produces. The third guesses "the positive side", but the vertex is not at the origin.`],
      }
    },
  },
  {
    key: 'm1_second_derivative_test', topic: T.dif[0], topicZh: T.dif[1], topicEn: T.dif[2], diff: 'intermediate', n: 2,
    gen: (i) => {
      const { a, b, c } = P_2der[i]
      const cp = -b / (2 * a)
      return {
        q: [`設 $f(x) = ${co(a)}x^{2} ${b} x + ${c}$。試用二階導數判別法，判斷 $x = ${num(cp)}$ 這個駐點的性質。`,
            `Let $f(x) = ${co(a)}x^{2} ${b} x + ${c}$. Use the second derivative test to classify the stationary point at $x = ${num(cp)}$.`],
        ans: `極小值點，因為 $f''(${num(cp)}) = ${2 * a} > 0$`,
        wrong: [
          `極大值點，因為 $f''(${num(cp)}) = ${2 * a} > 0$`,
          `拐點，因為 $f''(${num(cp)}) = 0$`,
          `極大值點，因為 $f'(${num(cp)}) = 0$`,
        ],
        ansEn: `A minimum, since $f''(${num(cp)}) = ${2 * a} > 0$`,
        wrongEn: [
          `A maximum, since $f''(${num(cp)}) = ${2 * a} > 0$`,
          `A point of inflexion, since $f''(${num(cp)}) = 0$`,
          `A maximum, since $f'(${num(cp)}) = 0$`,
        ],
        e: [`二階導數判別法：先求駐點（$f' = 0$ 之處），再看該點的二階導數。$f'(x) = ${2 * a}x ${b}$，令其為零確認駐點在 $x = ${num(cp)}$；$f''(x) = ${2 * a}$，恆為正。二階導數為【正】代表曲線在該處向上凹，故為極小值點。記法：$f'' > 0$ 像個「U」形，是低點；$f'' < 0$ 像個「∩」形，是高點。第一個干擾項把方向記反了。第二項誤以為二階導數為零 —— 此處它恆等於 $${2 * a}$，並不為零。第三項用 $f' = 0$ 作判別理由，但 $f' = 0$ 只能【找出】駐點，不能判斷它是高是低。`,
            `The second derivative test: locate the stationary point where $f' = 0$, then examine the second derivative there. $f'(x) = ${2 * a}x ${b}$, which vanishes at $x = ${num(cp)}$; and $f''(x) = ${2 * a}$, which is positive everywhere. A *positive* second derivative means the curve is concave up, so this is a minimum. As a memory aid: $f'' > 0$ looks like a "U" and sits at the bottom; $f'' < 0$ looks like an "∩" and sits at the top. The first distractor reverses this. The second wrongly claims the second derivative is zero, when it is identically $${2 * a}$. The third cites $f' = 0$ as the reason, but that only *locates* a stationary point and cannot classify it.`],
      }
    },
  },

  // ── 正態分佈 30（12 易 + 18 中；現有 50 條只得 1 條易題）─────────────────
  {
    key: 'm1_zscore_meaning', topic: T.nor[0], topicZh: T.nor[1], topicEn: T.nor[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { mu, sd, k } = P_z[i]
      const x = mu + k * sd
      return {
        q: [`某校測驗成績服從正態分佈，平均分 $${mu}$，標準差 $${sd}$。小明考獲 $${x}$ 分。\n\n他的成績高於平均分多少個標準差？`,
            `Test scores at a school are normally distributed with mean $${mu}$ and standard deviation $${sd}$. Ming scored $${x}$.\n\nHow many standard deviations above the mean is his score?`],
        ans: `$${k}$ 個標準差`,
        wrong: [`$${x - mu}$ 個標準差`, `$${num(mu / sd)}$ 個標準差`, `$${num(x / sd)}$ 個標準差`],
        ansEn: `$${k}$ standard deviations`,
        wrongEn: [`$${x - mu}$ standard deviations`, `$${num(mu / sd)}$ standard deviations`, `$${num(x / sd)}$ standard deviations`],
        e: [`標準分數量度的正是「距離平均值多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{${x} - ${mu}}{${sd}} = ${k}$。兩個步驟缺一不可 —— 先【減平均】看差距，再【除標準差】把差距換算成「幾多個標準差」。第一個干擾項停在 $${x - mu}$，那是分數的差距，單位仍然是分而不是標準差，是本題最主要的失分位。餘下兩項漏了減平均這一步。標準分數的用處在於：不同科目、不同卷別的分數本來無法直接比較，換算成 $z$ 之後就有了共同尺度。`,
            `A standard score measures exactly this — how many standard deviations a value lies from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{${x} - ${mu}}{${sd}} = ${k}$. Both steps are needed: subtract the mean to get the gap, then divide by the standard deviation to express that gap in standard deviations. The first distractor stops at $${x - mu}$, which is a gap in marks, not in standard deviations — the main trap here. The other two omit the subtraction. The value of standard scores is that marks from different subjects or papers, which cannot be compared directly, share a common scale once converted to $z$.`],
      }
    },
  },
  {
    key: 'm1_empirical_rule', topic: T.nor[0], topicZh: T.nor[1], topicEn: T.nor[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { mu, sd, k } = P_emp[i]
      const lo = mu - k * sd, hi = mu + k * sd
      return {
        q: [`某產品的重量服從正態分佈，平均 $${mu}$ 克，標準差 $${sd}$ 克。\n\n根據正態分佈的經驗法則，重量介乎 $${lo}$ 克與 $${hi}$ 克之間的產品約佔多少？`,
            `The weight of a product is normally distributed with mean $${mu}$ g and standard deviation $${sd}$ g.\n\nBy the empirical rule, roughly what proportion of products weigh between $${lo}$ g and $${hi}$ g?`],
        ans: `約 ${pct(k)}`,
        wrong: [
          `約 ${k === 1 ? '95%' : k === 2 ? '68%' : '95%'}`,
          `約 ${k === 3 ? '68%' : '99.7%'}`,
          '約 50%',
        ],
        ansEn: `About ${pct(k)}`,
        wrongEn: [
          `About ${k === 1 ? '95%' : k === 2 ? '68%' : '95%'}`,
          `About ${k === 3 ? '68%' : '99.7%'}`,
          'About 50%',
        ],
        e: [`先看題目給的範圍距離平均值多遠：$${hi} - ${mu} = ${k * sd}$，而 $${k * sd} \\div ${sd} = ${k}$，即上下各 $${k}$ 個標準差。經驗法則：$\\pm1\\sigma$ 涵蓋約 68%、$\\pm2\\sigma$ 約 95%、$\\pm3\\sigma$ 約 99.7%，故答案為約 ${pct(k)}。做這類題目要【先換算成標準差個數】才對照法則，直接看克數毫無意義。答「約 50%」的把「平均值兩邊」理解成「一半」—— 對稱確實令兩邊各佔一半，但題目問的是這個區間之內的比例，不是其中一邊。`,
            `First measure how far the stated range reaches from the mean: $${hi} - ${mu} = ${k * sd}$, and $${k * sd} \\div ${sd} = ${k}$, so the range spans $${k}$ standard deviations either side. The empirical rule gives about 68% within $\\pm1\\sigma$, about 95% within $\\pm2\\sigma$ and about 99.7% within $\\pm3\\sigma$, so the answer is about ${pct(k)}. Always convert to a number of standard deviations before applying the rule; the raw grams mean nothing on their own. Answering "about 50%" reads "either side of the mean" as "half" — symmetry does split the distribution in half, but the question asks for the proportion *inside* the interval, not on one side of it.`],
      }
    },
  },
  {
    key: 'm1_reverse_zscore', topic: T.nor[0], topicZh: T.nor[1], topicEn: T.nor[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { mu, sd, z } = P_rev[i]
      const ans = mu + z * sd
      return {
        q: [`設 $X \\sim N(${mu}, ${sd}^{2})$。已知某觀測值的標準分數為 $z = ${z}$，求該觀測值 $x$。`,
            `Let $X \\sim N(${mu}, ${sd}^{2})$. An observation has standard score $z = ${z}$. Find $x$.`],
        ans: `$${num(ans)}$`,
        wrong: [`$${num(mu - z * sd)}$`, `$${num(z * sd)}$`, `$${num(mu + z)}$`],
        e: [`把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉即得 $x = \\mu + z\\sigma = ${mu} + (${z})(${sd}) = ${num(ans)}$。${z < 0 ? `注意 $z$ 為負，代表該觀測值【低於】平均值，所以答案必定細過 $${mu}$ —— 見到大過平均值的答案就應該起疑。` : `注意 $z$ 為正，代表該觀測值【高於】平均值，所以答案必定大過 $${mu}$。`}第一個干擾項把加號寫成減號，方向剛好相反。第二項只算了 $z\\sigma$，即偏離平均值的距離，忘記加回平均值本身。第三項把 $z$ 直接加上平均值，漏了乘標準差 —— $z$ 是「幾多個標準差」，要先乘返標準差才是實際數值。`,
            `Rearranging $z = \\dfrac{x - \\mu}{\\sigma}$ gives $x = \\mu + z\\sigma = ${mu} + (${z})(${sd}) = ${num(ans)}$. ${z < 0 ? `Since $z$ is negative the observation lies *below* the mean, so the answer must be smaller than $${mu}$ — an answer above the mean should raise suspicion.` : `Since $z$ is positive the observation lies *above* the mean, so the answer must exceed $${mu}$.`} The first distractor subtracts where it should add, reversing the direction. The second computes only $z\\sigma$, the distance from the mean, and forgets to add the mean back. The third adds $z$ directly to the mean without multiplying by the standard deviation — $z$ counts standard deviations, so it must be scaled before it becomes a real value.`],
      }
    },
  },
  {
    key: 'm1_compare_zscores', topic: T.nor[0], topicZh: T.nor[1], topicEn: T.nor[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { mA, sA, xA, mB, sB, xB } = P_cmp[i]
      const zA = (xA - mA) / sA, zB = (xB - mB) / sB
      const better = zA > zB ? '甲' : '乙'
      const betterEn = zA > zB ? 'Paper A' : 'Paper B'
      return {
        q: [`某生應考兩份試卷。甲卷平均分 $${mA}$、標準差 $${sA}$，他得 $${xA}$ 分；乙卷平均分 $${mB}$、標準差 $${sB}$，他得 $${xB}$ 分。兩卷成績均服從正態分佈。\n\n就相對表現而言，他在哪一卷表現較佳？`,
            `A student sits two papers. Paper A has mean $${mA}$ and standard deviation $${sA}$; he scored $${xA}$. Paper B has mean $${mB}$ and standard deviation $${sB}$; he scored $${xB}$. Both are normally distributed.\n\nIn relative terms, on which paper did he do better?`],
        ans: `${better}卷，因為其標準分數較高（甲 $z = ${num(zA)}$，乙 $z = ${num(zB)}$）`,
        wrong: [
          `${better === '甲' ? '乙' : '甲'}卷，因為其標準分數較高`,
          `${xA > xB ? '甲' : '乙'}卷，因為原始分數較高`,
          '兩卷表現相同，因為兩者都高於各自的平均分',
        ],
        ansEn: `${betterEn}, because its standard score is higher (A: $z = ${num(zA)}$, B: $z = ${num(zB)}$)`,
        wrongEn: [
          `${betterEn === 'Paper A' ? 'Paper B' : 'Paper A'}, because its standard score is higher`,
          `${xA > xB ? 'Paper A' : 'Paper B'}, because the raw mark is higher`,
          'Equally well, since both marks are above their respective means',
        ],
        e: [`兩份卷的平均分與標準差都不相同，原始分數【不可直接比較】—— 這正是標準分數存在的理由。甲卷 $z = \\dfrac{${xA} - ${mA}}{${sA}} = ${num(zA)}$；乙卷 $z = \\dfrac{${xB} - ${mB}}{${sB}} = ${num(zB)}$。${better}卷的 $z$ 較高，故相對表現較佳。用原始分數比較是本題設下的主要陷阱：一份卷考 $${xA}$ 分，另一份考 $${xB}$ 分，數字大小與「表現好壞」並無必然關係，要看在各自的分佈中站在甚麼位置。最後一項只確認了兩卷都高於平均，但「都高於平均」並不代表「高得一樣多」。`,
            `The two papers have different means and standard deviations, so the raw marks *cannot* be compared directly — which is precisely why standard scores exist. Paper A gives $z = \\dfrac{${xA} - ${mA}}{${sA}} = ${num(zA)}$ and Paper B gives $z = \\dfrac{${xB} - ${mB}}{${sB}} = ${num(zB)}$. The higher $z$ belongs to ${betterEn}, so that is the better relative performance. Comparing raw marks is the main trap: scoring $${xA}$ on one paper and $${xB}$ on another says nothing on its own — what matters is where each mark sits within its own distribution. The last option notes only that both are above average, which does not mean both are above it by the same amount.`],
      }
    },
  },
  {
    key: 'm1_normal_approx', topic: T.nor[0], topicZh: T.nor[1], topicEn: T.nor[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { n, p } = P_apx[i]
      const mu = n * p, va = n * p * (1 - p), sd = Math.sqrt(va)
      return {
        q: [`設 $X \\sim B(${n}, ${p})$。當 $n$ 足夠大時可用正態分佈逼近。\n\n求該逼近正態分佈的平均值與標準差。`,
            `Let $X \\sim B(${n}, ${p})$. For large $n$ this may be approximated by a normal distribution.\n\nFind the mean and standard deviation of that approximation.`],
        ans: `$\\mu = ${num(mu)}$，$\\sigma = ${num(sd)}$`,
        wrong: [
          `$\\mu = ${num(mu)}$，$\\sigma = ${num(va)}$`,
          `$\\mu = ${num(n * (1 - p))}$，$\\sigma = ${num(sd)}$`,
          `$\\mu = ${num(mu)}$，$\\sigma = ${num(Math.sqrt(n * p))}$`,
        ],
        ansEn: `$\\mu = ${num(mu)}$, $\\sigma = ${num(sd)}$`,
        wrongEn: [
          `$\\mu = ${num(mu)}$, $\\sigma = ${num(va)}$`,
          `$\\mu = ${num(n * (1 - p))}$, $\\sigma = ${num(sd)}$`,
          `$\\mu = ${num(mu)}$, $\\sigma = ${num(Math.sqrt(n * p))}$`,
        ],
        e: [`逼近正態分佈直接沿用二項分佈的平均值與變異數：$\\mu = np = ${n} \\times ${p} = ${num(mu)}$，$\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(1 - p)} = ${num(va)}$，而標準差是變異數的【平方根】：$\\sigma = \\sqrt{${num(va)}} = ${num(sd)}$。第一個干擾項把變異數當成標準差，忘記開方 —— 這是本題最主要的失分位，亦是統計題最常見的單位混淆。第二項用了 $n(1-p)$ 作平均值，那是「失敗次數」的期望而非題目所問。第三項開方時漏了因子 $(1-p)$。`,
            `The approximating normal keeps the binomial's mean and variance: $\\mu = np = ${n} \\times ${p} = ${num(mu)}$ and $\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(1 - p)} = ${num(va)}$; the standard deviation is the *square root* of the variance, $\\sigma = \\sqrt{${num(va)}} = ${num(sd)}$. The first distractor reports the variance as the standard deviation, forgetting to take the root — the main trap here and the commonest unit confusion in statistics. The second uses $n(1-p)$ as the mean, which is the expected number of failures. The third omits the factor $(1-p)$ before taking the root.`],
      }
    },
  },

  // ── 積分法 10（8 中 + 2 難；現有 25 條零難題）───────────────────────────
  {
    key: 'm1_definite_integral', topic: T.itg[0], topicZh: T.itg[1], topicEn: T.itg[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { a, lo, hi } = P_def[i]
      const F = (x: number) => (a * x * x) / 2
      const ans = F(hi) - F(lo)
      return {
        q: [`已知 $f(x) = ${a}x$。試求 $f$ 在區間 $[${lo}, ${hi}]$ 上的定積分值。`,
            `Let $f(x) = ${a}x$. Find the value of the definite integral of $f$ over the interval $[${lo}, ${hi}]$.`],
        ans: `$${num(ans)}$`,
        wrong: [`$${num(F(hi))}$`, `$${num(F(lo) - F(hi))}$`, `$${num(a * (hi - lo))}$`],
        e: [`先求原函數：$\\displaystyle\\int ${a}x \\, dx = \\dfrac{${a}x^{2}}{2}$。再代入上下限相減：$\\dfrac{${a}(${hi})^{2}}{2} - \\dfrac{${a}(${lo})^{2}}{2} = ${num(F(hi))} - ${num(F(lo))} = ${num(ans)}$。第一個干擾項只代入了上限而忘記減去下限的值 —— 定積分永遠是【上限減下限】兩項之差，這是最主要的失分位。第二項把相減次序調轉，得出的答案符號相反。第三項把被積函數當成常數乘以區間長度，那只有在被積函數確實是常數時才成立。`,
            `First find an antiderivative: $\\displaystyle\\int ${a}x \\, dx = \\dfrac{${a}x^{2}}{2}$. Then substitute the limits and subtract: $\\dfrac{${a}(${hi})^{2}}{2} - \\dfrac{${a}(${lo})^{2}}{2} = ${num(F(hi))} - ${num(F(lo))} = ${num(ans)}$. The first distractor substitutes the upper limit only and forgets to subtract the lower — a definite integral is always the difference *upper minus lower*, and this is the main trap. The second reverses the subtraction and flips the sign. The third multiplies the integrand by the width of the interval, which is valid only when the integrand really is constant.`],
      }
    },
  },
  {
    key: 'm1_integral_initial', topic: T.itg[0], topicZh: T.itg[1], topicEn: T.itg[2], diff: 'intermediate', n: 2,
    gen: (i) => {
      const { a, x0, y0 } = P_init[i]
      const C = y0 - (a * x0 * x0) / 2
      return {
        q: [`已知 $\\dfrac{dy}{dx} = ${a}x$，且曲線經過點 $(${x0}, ${y0})$。求 $y$ 關於 $x$ 的表達式。`,
            `Given $\\dfrac{dy}{dx} = ${a}x$ and that the curve passes through $(${x0}, ${y0})$, express $y$ in terms of $x$.`],
        ans: `$y = ${num(a / 2)}x^{2} ${C >= 0 ? '+' : '−'} ${Math.abs(C)}$`,
        wrong: [`$y = ${num(a / 2)}x^{2}$`, `$y = ${a}x^{2} ${C >= 0 ? '+' : '−'} ${Math.abs(C)}$`, `$y = ${num(a / 2)}x^{2} ${C >= 0 ? '−' : '+'} ${Math.abs(C)}$`],
        e: [`不定積分得 $y = \\dfrac{${a}x^{2}}{2} + C = ${num(a / 2)}x^{2} + C$，其中 $C$ 是【積分常數】，必須靠題目給的一點定出來。代入 $(${x0}, ${y0})$：$${y0} = ${num(a / 2)}(${x0})^{2} + C$，得 $C = ${num(C)}$。第一個干擾項漏了積分常數 —— 不定積分的答案永遠帶一個 $C$，題目既然給了一點，就是要求你把它定出來，這是本題最主要的失分位。第二項積分時忘記除以 $2$。第三項的常數符號相反。`,
            `Integrating gives $y = \\dfrac{${a}x^{2}}{2} + C = ${num(a / 2)}x^{2} + C$, where $C$ is the *constant of integration* and must be pinned down by the given point. Substituting $(${x0}, ${y0})$: $${y0} = ${num(a / 2)}(${x0})^{2} + C$, so $C = ${num(C)}$. The first distractor omits the constant — an indefinite integral always carries one, and supplying a point is exactly how the question asks you to determine it. This is the main trap. The second forgets to divide by $2$ when integrating, and the third has the wrong sign on the constant.`],
      }
    },
  },
  {
    key: 'm1_area_under_curve', topic: T.itg[0], topicZh: T.itg[1], topicEn: T.itg[2], diff: 'hard', n: 2,
    gen: (i) => {
      const { a, hi } = P_area[i]
      const F = (x: number) => (a * x * x * x) / 3
      const ans = F(hi)
      return {
        q: [`曲線 $y = ${co(a)}x^{2}$ 與 $x$ 軸及直線 $x = ${hi}$ 所圍成的區域（$0 \\leq x \\leq ${hi}$）。\n\n求該區域的面積。`,
            `Find the area of the region bounded by the curve $y = ${co(a)}x^{2}$, the $x$-axis and the line $x = ${hi}$, for $0 \\leq x \\leq ${hi}$.`],
        ans: `$${num(ans)}$ 平方單位`,
        wrong: [`$${num(a * hi * hi)}$ 平方單位`, `$${num((a * hi * hi * hi) / 2)}$ 平方單位`, `$${num((a * hi * hi * hi) / 3 / 2)}$ 平方單位`],
        ansEn: `$${num(ans)}$ square units`,
        wrongEn: [`$${num(a * hi * hi)}$ square units`, `$${num((a * hi * hi * hi) / 2)}$ square units`, `$${num((a * hi * hi * hi) / 3 / 2)}$ square units`],
        e: [`曲線下的面積由定積分求出：$\\displaystyle\\int_{0}^{${hi}} ${a}x^{2}\\,dx = \\left[\\dfrac{${a}x^{3}}{3}\\right]_{0}^{${hi}} = \\dfrac{${a}(${hi})^{3}}{3} - 0 = ${num(ans)}$。第一個干擾項只把 $x = ${hi}$ 代入原函數，得出的是該點的【高度】而非面積 —— 面積必須經積分累加，不能用單一點的函數值代替。第二項積分時把 $x^{2}$ 的原函數誤寫成除以 $2$（應為除以 $3$，因為指數加一之後是 $3$）。第三項把答案再除一次 $2$，那是三角形面積公式的殘留 —— 曲線下的區域並非三角形，不可套用。`,
            `The area under a curve is given by a definite integral: $\\displaystyle\\int_{0}^{${hi}} ${a}x^{2}\\,dx = \\left[\\dfrac{${a}x^{3}}{3}\\right]_{0}^{${hi}} = \\dfrac{${a}(${hi})^{3}}{3} - 0 = ${num(ans)}$. The first distractor substitutes $x = ${hi}$ into the original function, which gives the *height* at that point, not an area; areas must be accumulated by integration and cannot be read off a single function value. The second divides by $2$ instead of $3$ when integrating $x^{2}$ — raising the index gives $3$. The third halves the correct answer, a leftover from the triangle formula, which does not apply to a region bounded by a curve.`],
      }
    },
  },

  // ── 二項分佈 10 ─────────────────────────────────────────────────────────
  {
    key: 'm1_binomial_variance', topic: T.bid[0], topicZh: T.bid[1], topicEn: T.bid[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { n, p } = P_var[i]
      const ans = n * p * (1 - p)
      return {
        q: [`設 $X \\sim B(${n}, ${p})$。求 $\\mathrm{Var}(X)$。`,
            `Let $X \\sim B(${n}, ${p})$. Find $\\mathrm{Var}(X)$.`],
        ans: `$${num(ans)}$`,
        wrong: [`$${num(n * p)}$`, `$${num(Math.sqrt(ans))}$`, `$${num(n * (1 - p))}$`],
        e: [`二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(1 - p)} = ${num(ans)}$。三個因子缺一不可。第一個干擾項 $${num(n * p)}$ 是【期望值】$E(X) = np$ —— 期望值同變異數用同一組參數但意義完全不同，混淆兩者是本題最主要的失分位。第二項開了平方根，那是標準差而非變異數。第三項把 $p$ 同 $(1-p)$ 的角色搞混，漏了其中一個因子。記法：變異數的公式一定同時出現 $p$ 同 $(1-p)$，因為它量度的是「成功與失敗兩邊的不確定性」。`,
            `The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(1 - p)} = ${num(ans)}$; all three factors are required. The first distractor, $${num(n * p)}$, is the *expectation* $E(X) = np$ — the two use the same parameters but mean quite different things, and confusing them is the main trap. The second takes a square root, giving the standard deviation rather than the variance. The third drops one factor by muddling $p$ with $(1-p)$. As a memory aid: the variance formula always contains both $p$ and $(1-p)$, because it measures uncertainty on both the success and failure sides.`],
      }
    },
  },
  {
    key: 'm1_at_least_one', topic: T.bid[0], topicZh: T.bid[1], topicEn: T.bid[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { n, p } = P_atl1[i]
      const p0 = Math.pow(1 - p, n)
      const ans = 1 - p0
      return {
        q: [`設 $X \\sim B(${n}, ${p})$。求 $P(X \\geq 1)$。`,
            `Let $X \\sim B(${n}, ${p})$. Find $P(X \\geq 1)$.`],
        ans: `$${num(ans)}$`,
        wrong: [`$${num(p0)}$`, `$${num(n * p * Math.pow(1 - p, n - 1))}$`, `$${num(n * p)}$`],
        e: [`「至少一次」的反面是「一次也沒有」，用補集算最快：$P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - ${p})^{${n}} = 1 - ${num(p0)} = ${num(ans)}$。若逐項相加 $P(X=1) + P(X=2) + \\cdots + P(X=${n})$，要算 $${n}$ 項，既慢又易漏。第一個干擾項答了 $P(X = 0)$ 本身，即補集而非題目所問。第二項只算了 $P(X = 1)$ —— 「至少一次」包括一次、兩次…以至 $${n}$ 次，不止一次。第三項答了期望值 $np$，那是次數不是概率，而且可以大過 $1$，僅憑這一點就應該排除。`,
            `The complement of "at least one" is "none at all", which is far quicker: $P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - ${p})^{${n}} = 1 - ${num(p0)} = ${num(ans)}$. Summing $P(X=1) + P(X=2) + \\cdots + P(X=${n})$ instead means $${n}$ separate terms, slower and easy to leave one out. The first distractor gives $P(X = 0)$, the complement rather than the answer. The second gives only $P(X = 1)$ — "at least one" also covers two, three and so on up to $${n}$. The third gives the expectation $np$, which counts occurrences rather than probability and can exceed $1$, ruling it out on that ground alone.`],
      }
    },
  },

  // ── 二項式定理 4（現有 10 條全易，本批補中等）───────────────────────────
  {
    key: 'm1_binomial_coeff_sum', topic: T.bit[0], topicZh: T.bit[1], topicEn: T.bit[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { a, b, n } = P_term[i]
      const ans = Math.pow(a + b, n)
      const w0 = Math.pow(a, n) + Math.pow(b, n)
      const w1 = Math.pow(2, n)
      const w2 = (a + b) * n
      return {
        q: [`求 $(${a}x + ${b})^{${n}}$ 展開式中【所有係數之和】。`,
            `Find the sum of *all* the coefficients in the expansion of $(${a}x + ${b})^{${n}}$.`],
        ans: `$${ans}$`,
        wrong: [`$${w0}$`, `$${w1}$`, `$${w2}$`],
        e: [`展開式是一條【恆等式】，對任何 $x$ 都成立。把每一項寫成 $c_k x^{k}$，代入 $x = 1$ 之後每個 $x^{k}$ 都變成 $1$，剩下的正好就是所有係數之和。故只需代 $x = 1$：$(${a} \\times 1 + ${b})^{${n}} = ${a + b}^{${n}} = ${ans}$ —— 完全不需展開。第一個干擾項 $${w0}$ 把指數分別作用到兩項之上，但 $(u+v)^{${n}} \\neq u^{${n}} + v^{${n}}$，這是代數上最常見的錯誤展開。$${w1}$ 是 $(1+x)^{${n}}$ 的係數之和，套錯了公式 —— 只有當兩項都是 $1$ 時才等於 $2^{${n}}$。$${w2}$ 把乘方誤作乘法。`,
            `A binomial expansion is an *identity*, valid for every $x$. Writing each term as $c_k x^{k}$ and substituting $x = 1$ turns every $x^{k}$ into $1$, leaving exactly the sum of the coefficients. So simply put $x = 1$: $(${a} \\times 1 + ${b})^{${n}} = ${a + b}^{${n}} = ${ans}$ — no expansion needed at all. The first distractor, $${w0}$, applies the power to each term separately, but $(u+v)^{${n}} \\neq u^{${n}} + v^{${n}}$ — the commonest false expansion in algebra. $${w1}$ is the coefficient sum for $(1+x)^{${n}}$, a formula that holds only when both terms are $1$. $${w2}$ mistakes exponentiation for multiplication.`],
      }
    },
  },

  // ── 統計推斷 4（原屬排列組合的名額，改分至此；現有零易題）─────────────
  {
    key: 'm1_standard_error', topic: T.inf[0], topicZh: T.inf[1], topicEn: T.inf[2], diff: 'basic', n: 4,
    gen: (i) => {
      const { sd, n } = P_se[i]
      const ans = sd / Math.sqrt(n)
      return {
        q: [`某總體的標準差為 $${sd}$。現從中隨機抽取一個大小為 $${n}$ 的樣本。\n\n求樣本平均數的標準差（標準誤）。`,
            `A population has standard deviation $${sd}$. A random sample of size $${n}$ is drawn.\n\nFind the standard deviation of the sample mean (the standard error).`],
        ans: `$${num(ans)}$`,
        wrong: [`$${sd}$`, `$${num(sd / n)}$`, `$${num(sd * Math.sqrt(n))}$`],
        e: [`樣本平均數的標準差為 $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sd}}{\\sqrt{${n}}} = \\dfrac{${sd}}{${Math.sqrt(n)}} = ${num(ans)}$。意義是：樣本越大，樣本平均數就越集中在總體平均值附近，故標準誤越細 —— 但它隨【樣本量的平方根】下降，不是隨樣本量本身下降，所以樣本量要加大四倍，標準誤才減半。第一個干擾項照抄總體標準差，忽略了抽樣會令平均數的波動變細。第二項除以 $n$ 而非 $\\sqrt{n}$，令標準誤下降得太快。第三項把除號當成乘號，方向完全相反 —— 樣本越大反而波動越大，明顯不合理。`,
            `The standard deviation of the sample mean is $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sd}}{\\sqrt{${n}}} = \\dfrac{${sd}}{${Math.sqrt(n)}} = ${num(ans)}$. The meaning: larger samples cluster more tightly around the population mean, so the standard error shrinks — but it shrinks with the *square root* of the sample size, not the size itself, so quadrupling the sample only halves the standard error. The first distractor reuses the population standard deviation and ignores that averaging reduces variability. The second divides by $n$ rather than $\\sqrt{n}$, shrinking it far too fast. The third multiplies instead of dividing, which would make larger samples *more* variable — clearly wrong.`],
      }
    },
  },
]

emit('m1', 'm1_rep', archs, 'scripts/qbank/drafts/m1-replace.json')
