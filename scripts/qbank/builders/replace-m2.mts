// ============================================================================
// replace-m2.mts —— 數學延伸單元二（代數與微積分）模板替換 68 條
// ----------------------------------------------------------------------------
// 被替換的克隆組：極限 20、線性方程組 14、2×2 行列式 12、矩陣乘法 5、
// 向量點積 4、複數的模 4、複數實部 3。全部是「換個數字再問同一句」。
//
// ══ 一個【偏離大綱】的發現：複數不屬 M2 ══
//
// 封頂計劃原本要求為 complex_numbers 補 9 條。本批【不補】，理由如下。
//
// HKDSE 數學延伸部分單元二（代數與微積分）的課程範圍為三個範疇：
//   基礎知識：根式、數學歸納法、二項式定理、三角函數、常數 e
//   代數：矩陣與行列式、線性方程組、向量、純量積與向量積
//   微積分：極限、微分法、積分法
// 複數並不在其中 —— 它屬於【必修部分】（方程與代數範疇）。
// 當時題庫的 m2/complex_numbers 有 30 條，屬歸類錯誤，不是本批造成，
// 但既然發現了，就不應該再往上面加 9 條，令超綱題目由 30 條變 39 條。
//
// 【2026-08-23 後續】創辦人拍板：那 30 條連同 m2-hell.ts 一條複數模長題
// 已全部移除（見 m2-bank.ts 檔頭的影響統計）。m2 由 308 條減至 277 條。
// 本批當時「不補」的決定因此成為最終處理的第一步，而不是把問題留在原地。
//
// 那 9 個名額改為分配給仍在範圍內、而且【零容易題】的課題：
//   mathematical_induction  現有 易0 中5 難3  → 本批補 5 易
//   calculus_app            現有 易0 中6 難6  → 本批補 4 中
//
// ── 本批同時修正的單一難度課題（dse-conformance 第 2 節）────────────────
//   linear_systems  現有 20 條【全難】 → 本批補 10 易 + 4 中
//
// ── 難度分佈同封頂計劃的落差（要講清楚）─────────────────────────────────
// 計劃訂明易 42 / 中 26；本批為易 41 / 中 27，各差一條。原因是課題重新分配
// 之後，原型的難度不可再任意切細（一個原型只有一種難度）。差一條不影響
// 抽樣派題，故不為遷就數字而扭曲題目本身的難度。
//
// ── 公式（人手覆核點）──────────────────────────────────────────────────
//   2×2 行列式 = ad − bc；矩陣可逆 ⟺ 行列式 ≠ 0
//   (m×n)(n×p) 可乘，結果為 m×p
//   3×3 行列式沿首行展開 = a(ei−fh) − b(di−fg) + c(dh−eg)
//   連續函數的極限可直接代入
//   x→∞ 有理式：比較分子分母最高次數
//   lim(x→0) sin(ax)/(bx) = a/b
//   齊次線性方程組有非零解 ⟺ 係數行列式 = 0
//   兩向量垂直 ⟺ 純量積 = 0
// ============================================================================
import { emit, num, frac, type Arch } from './_archetype.mts'

const T = {
  mat:  ['matrices', '矩陣與行列式', 'Matrices and Determinants'],
  lim:  ['limits', '極限', 'Limits'],
  sys:  ['linear_systems', '線性方程組', 'Systems of Linear Equations'],
  ind:  ['mathematical_induction', '數學歸納法', 'Mathematical Induction'],
  app:  ['calculus_app', '微積分應用', 'Applications of Calculus'],
  vec:  ['vectors', '向量', 'Vectors'],
} as const

const M1 = [{ a: 2, b: 3, c: 4 }, { a: 1, b: 5, c: 2 }, { a: 3, b: 2, c: 6 },
            { a: 4, b: 1, c: 8 }, { a: 5, b: 3, c: 10 }, { a: 2, b: 7, c: 3 }]
const M2P = [{ a: 1, b: 2, c: 3, d: 4, k: 3 }, { a: 2, b: 0, c: 1, d: 5, k: 4 }, { a: 3, b: 1, c: 2, d: 2, k: 2 },
             { a: 5, b: 2, c: 0, d: 3, k: 5 }, { a: 1, b: 4, c: 6, d: 1, k: 3 }, { a: 4, b: 3, c: 2, d: 6, k: 2 }]
const M3 = [{ m: 2, n: 3, p: 4 }, { m: 3, n: 2, p: 5 }, { m: 4, n: 4, p: 2 }, { m: 1, n: 5, p: 3 }, { m: 5, n: 3, p: 1 }]
const M4 = [
  { r: [[2, 1, 0], [1, 3, 1], [0, 2, 2]] },
  { r: [[1, 2, 3], [0, 1, 4], [5, 6, 0]] },
  { r: [[3, 1, 2], [2, 1, 1], [1, 2, 4]] },
  { r: [[1, 2, 3], [2, 4, 6], [1, 0, 1]] }, // 第二行 = 第一行 × 2 ⇒ 行列式為 0
]
const L1 = [{ a: 2, b: -3, c: 5, x: 2 }, { a: 1, b: 4, c: -6, x: 3 }, { a: 3, b: -1, c: 2, x: -2 },
            { a: 2, b: 5, c: 1, x: -2 }, { a: 4, b: 0, c: -7, x: 3 }, { a: 1, b: -6, c: 9, x: 4 }]
const L2 = [{ an: 3, ad: 6, deg: 'eq' }, { an: 5, ad: 2, deg: 'eq' }, { an: 1, ad: 4, deg: 'lo' },
            { an: 2, ad: 1, deg: 'hi' }, { an: 7, ad: 14, deg: 'eq' }, { an: 3, ad: 5, deg: 'lo' }]
const L3 = [{ a: 3, b: 5 }, { a: 2, b: 7 }, { a: 4, b: 3 }, { a: 6, b: 2 }]
const L4 = [{ p: 2, l: 5, r: 5 }, { p: 1, l: 3, r: 7 }, { p: 3, l: 4, r: 4 }, { p: -1, l: 2, r: 6 }]
const S1 = [{ a: 2, b: 1, c: 1, d: 3 }, { a: 1, b: 2, c: 2, d: 4 }, { a: 3, b: 1, c: 2, d: 5 },
            { a: 4, b: 2, c: 6, d: 3 }, { a: 1, b: 3, c: 2, d: 6 }, { a: 5, b: 2, c: 1, d: 4 }]
const S2 = [{ x: 1, y: 2, z: 4 }, { x: 2, y: -1, z: 1 }, { x: -1, y: 3, z: 2 }, { x: 3, y: 1, z: -2 }]
const S3 = [{ a: 2, b: 4 }, { a: 3, b: 6 }, { a: 1, b: 5 }, { a: 4, b: 2 }]
const V1 = [{ x1: 3, y1: 4, k: 2 }, { x1: 2, y1: -6, k: 3 }, { x1: 5, y1: 2, k: 4 }, { x1: 1, y1: 8, k: 2 }]
const A1 = [{ a: 1, b: -6, c: 5 }, { a: 2, b: -8, c: 3 }, { a: 1, b: 4, c: -1 }, { a: 3, b: -12, c: 7 }]

/** 係數 1 唔寫出嚟（"1x^2" 唔係數學寫法）。 */
const co = (k: number) => (k === 1 ? '' : String(k))

const det3 = (r: number[][]) =>
  r[0][0] * (r[1][1] * r[2][2] - r[1][2] * r[2][1])
  - r[0][1] * (r[1][0] * r[2][2] - r[1][2] * r[2][0])
  + r[0][2] * (r[1][0] * r[2][1] - r[1][1] * r[2][0])
const mtx = (r: number[][]) =>
  `\\begin{pmatrix} ${r.map((row) => row.join(' & ')).join(' \\\\ ')} \\end{pmatrix}`

const archs: Arch[] = [
  // ── 矩陣與行列式 21 ─────────────────────────────────────────────────────
  {
    key: 'm2_singular_k', topic: T.mat[0], topicZh: T.mat[1], topicEn: T.mat[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b, c } = M1[i]
      const ans = (b * c) / a // ad − bc = 0 ⇒ d = bc/a
      return {
        q: [`設 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & k \\end{pmatrix}$。求 $k$ 的值，使 $A$ 【沒有】逆矩陣。`,
            `Let $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & k \\end{pmatrix}$. Find $k$ such that $A$ has *no* inverse.`],
        ans: `$k = ${num(ans)}$`,
        wrong: [`$k = ${num(-ans)}$`, `$k = ${num(a * c - b)}$`, `$k = ${num((a * b) / c)}$`],
        e: [`一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。$\\det A = ${a}k - (${b})(${c}) = ${a}k - ${b * c}$，令其為 $0$ 得 $k = ${num(ans)}$。要留意題目問的是【沒有】逆矩陣，即要令行列式等於零；若看漏了否定字眼而去求「有逆矩陣」的條件，答案便會變成一個範圍（$k \\neq ${num(ans)}$）而非單一數值 —— 選項全部是單一數值，本身已經提示了題目要的是使行列式歸零的那一點。第一個干擾項漏了符號，其餘兩項把矩陣元素的位置對調。`,
            `A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. $\\det A = ${a}k - (${b})(${c}) = ${a}k - ${b * c}$; setting this to $0$ gives $k = ${num(ans)}$. Note the question asks when the inverse does *not* exist, i.e. when the determinant vanishes. Missing the negative would turn the answer into a range ($k \\neq ${num(ans)}$) rather than a single value — and since every option is a single value, that in itself signals which condition is wanted. The first distractor drops a sign; the other two swap the positions of the entries.`],
      }
    },
  },
  {
    key: 'm2_matrix_scalar', topic: T.mat[0], topicZh: T.mat[1], topicEn: T.mat[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b, c, d, k } = M2P[i]
      const R = [[k * a, k * b], [k * c, k * d]]
      return {
        q: [`設 $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$。求 $${k}A$。`,
            `Let $A = \\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$. Find $${k}A$.`],
        ans: `$${mtx(R)}$`,
        wrong: [
          `$${mtx([[k * a, b], [c, k * d]])}$`,
          `$${mtx([[a + k, b + k], [c + k, d + k]])}$`,
          `$${mtx([[k * a, k * c], [k * b, k * d]])}$`,
        ],
        e: [`純量乘法要把該數乘以矩陣的【每一個】元素，故 $${k}A = ${mtx(R)}$。第一個干擾項只乘了主對角線，是把純量乘法同「乘以單位矩陣的倍數」混淆了 —— 後者才只影響對角線。第二個把乘法做成了加法。第三個乘對了每個元素，但同時把矩陣轉置了：$${k}A$ 不會改變元素的位置，只改變它們的大小。純量乘法的結果，行列數必定同原矩陣一樣。`,
            `Scalar multiplication multiplies *every* entry, so $${k}A = ${mtx(R)}$. The first distractor scales only the leading diagonal, confusing scalar multiplication with multiplying by a multiple of the identity matrix, which is what affects the diagonal alone. The second adds instead of multiplying. The third scales every entry correctly but also transposes the matrix: $${k}A$ changes the size of the entries, never their positions. The result always has the same dimensions as the original.`],
      }
    },
  },
  {
    key: 'm2_product_dimension', topic: T.mat[0], topicZh: T.mat[1], topicEn: T.mat[2], diff: 'intermediate', n: 5,
    gen: (i) => {
      const { m, n, p } = M3[i]
      return {
        q: [`設 $A$ 為 $${m} \\times ${n}$ 矩陣，$B$ 為 $${n} \\times ${p}$ 矩陣。關於乘積 $AB$ 與 $BA$，以下哪一項正確？`,
            `Let $A$ be a $${m} \\times ${n}$ matrix and $B$ a $${n} \\times ${p}$ matrix. Which statement about $AB$ and $BA$ is correct?`],
        ans: m === p
          ? `$AB$ 為 $${m} \\times ${p}$ 矩陣，$BA$ 為 $${n} \\times ${n}$ 矩陣，兩者都有定義但一般並不相等`
          : `$AB$ 為 $${m} \\times ${p}$ 矩陣；$BA$ 沒有定義`,
        wrong: [
          `$AB$ 為 $${n} \\times ${n}$ 矩陣；$BA$ 沒有定義`,
          `$AB$ 與 $BA$ 都沒有定義`,
          `$AB$ 為 $${m} \\times ${p}$ 矩陣，且必定等於 $BA$`,
        ],
        ansEn: m === p
          ? `$AB$ is $${m} \\times ${p}$ and $BA$ is $${n} \\times ${n}$; both are defined but they are not equal in general`
          : `$AB$ is $${m} \\times ${p}$; $BA$ is undefined`,
        wrongEn: [
          `$AB$ is $${n} \\times ${n}$; $BA$ is undefined`,
          'Neither $AB$ nor $BA$ is defined',
          `$AB$ is $${m} \\times ${p}$ and must equal $BA$`,
        ],
        e: [`矩陣相乘的條件是：前者的【行數】要等於後者的【列數】。$A$ 為 $${m} \\times ${n}$、$B$ 為 $${n} \\times ${p}$，中間兩個數同為 $${n}$，故 $AB$ 有定義，結果取外面兩個數，即 $${m} \\times ${p}$。至於 $BA$：$B$ 的行數為 $${p}$，$A$ 的列數為 $${m}$，${m === p ? `兩者相同，故 $BA$ 亦有定義，結果為 $${n} \\times ${n}$ —— 但兩個乘積連大小都不一樣，當然不會相等。` : `$${p} \\neq ${m}$，故 $BA$ 沒有定義。`}矩陣乘法【不符合交換律】，這是它同數字乘法最根本的分別，亦是本題的考點。`,
            `Two matrices can be multiplied when the *columns* of the first match the *rows* of the second. Here $A$ is $${m} \\times ${n}$ and $B$ is $${n} \\times ${p}$: the inner dimensions agree at $${n}$, so $AB$ exists and takes the outer dimensions, $${m} \\times ${p}$. For $BA$, the columns of $B$ number $${p}$ and the rows of $A$ number $${m}$; ${m === p ? `these agree, so $BA$ also exists and is $${n} \\times ${n}$ — but the two products differ even in size, so they cannot be equal.` : `$${p} \\neq ${m}$, so $BA$ is undefined.`} Matrix multiplication is *not commutative*, which is its most basic departure from ordinary multiplication and the point being tested.`],
      }
    },
  },
  {
    // 唔可以照抄被替換嗰組克隆嘅問法（「求行列式的值」）—— 三階同二階問得
    // 一模一樣，只係尺寸大咗，唔算真正唔同嘅題。改為考【可逆性判斷】：
    // 行列式喺 M2 嘅實際用途就係判斷矩陣可唔可逆、方程組有冇唯一解，
    // 而唔係為咗展開而展開。原型內含一個奇異矩陣（第二行 = 第一行 × 2）。
    key: 'm2_det_3x3', topic: T.mat[0], topicZh: T.mat[1], topicEn: T.mat[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { r } = M4[i]
      const ans = det3(r)
      const wrongSign = r[0][0] * (r[1][1] * r[2][2] - r[1][2] * r[2][1])
        + r[0][1] * (r[1][0] * r[2][2] - r[1][2] * r[2][0])
        + r[0][2] * (r[1][0] * r[2][1] - r[1][1] * r[2][0])
      const diagOnly = r[0][0] * r[1][1] * r[2][2]
      const inv = ans !== 0
      const zh = (v: number) => `${v === 0 ? '不可逆' : '可逆'}，且 $\\det A = ${v}$`
      const en = (v: number) => `${v === 0 ? 'Not invertible' : 'Invertible'}, with $\\det A = ${v}$`
      // 干擾項優先用【具名錯誤】（漏符號、只乘對角線、誤判可逆性），
      // 但呢啲值有機會互相碰撞或者撞正解（實測 diagOnly 曾經啱啱等於 0），
      // 故備用池排喺後面，逐個補到夠三個互異為止。
      const pool = [wrongSign, diagOnly, inv ? 0 : ans + 1, -ans, ans + 1, ans - 1, ans * 2 + 1]
      const w: number[] = []
      for (const v of pool) { if (v !== ans && !w.includes(v)) w.push(v); if (w.length === 3) break }
      return {
        q: [`設 $A = ${mtx(r)}$。\n\n$A$ 是否可逆？其行列式的值為何？`,
            `Let $A = ${mtx(r)}$.\n\nIs $A$ invertible, and what is its determinant?`],
        ans: zh(ans),
        wrong: [zh(w[0]), zh(w[1]), zh(w[2])],
        ansEn: en(ans),
        wrongEn: [en(w[0]), en(w[1]), en(w[2])],
        e: [`矩陣可逆當且僅當行列式不為零，所以要先把行列式算出來。沿第一行展開，注意【正負相間】：$${r[0][0]} \\times (${r[1][1]} \\times ${r[2][2]} - ${r[1][2]} \\times ${r[2][1]}) - ${r[0][1]} \\times (${r[1][0]} \\times ${r[2][2]} - ${r[1][2]} \\times ${r[2][0]}) + ${r[0][2]} \\times (${r[1][0]} \\times ${r[2][1]} - ${r[1][1]} \\times ${r[2][0]}) = ${ans}$，${inv ? '不為零，故 $A$ 可逆。' : `等於零，故 $A$ 【不可逆】。留意本題第二行剛好是第一行的兩倍 —— 任何一行是另一行的倍數，行列式必定為零，看得出這一點就不必展開。`}三項的符號依次為 $+,-,+$，中間一項【必須變號】，忘記這一點會得出 $${wrongSign}$，是三階行列式最集中的失分位。$${diagOnly}$ 只把主對角線相乘，那是把二階的做法搬過來，對三階並不成立。`,
            `A matrix is invertible exactly when its determinant is non-zero, so evaluate the determinant first. Expanding along the first row with alternating signs: $${r[0][0]} \\times (${r[1][1]} \\times ${r[2][2]} - ${r[1][2]} \\times ${r[2][1]}) - ${r[0][1]} \\times (${r[1][0]} \\times ${r[2][2]} - ${r[1][2]} \\times ${r[2][0]}) + ${r[0][2]} \\times (${r[1][0]} \\times ${r[2][1]} - ${r[1][1]} \\times ${r[2][0]}) = ${ans}$, which is ${inv ? 'non-zero, so $A$ is invertible.' : 'zero, so $A$ is *not* invertible. Note that the second row here is exactly twice the first — whenever one row is a multiple of another the determinant must vanish, which can be seen without expanding at all.'} The three terms carry signs $+,-,+$ and the middle one *must* change sign; forgetting that gives $${wrongSign}$, the commonest error on $3 \\times 3$ determinants. $${diagOnly}$ multiplies the leading diagonal only, carrying over a $2 \\times 2$ shortcut that does not hold here.`],
      }
    },
  },

  // ── 極限 20 ─────────────────────────────────────────────────────────────
  {
    key: 'm2_limit_direct', topic: T.lim[0], topicZh: T.lim[1], topicEn: T.lim[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b, c, x } = L1[i]
      const ans = a * x * x + b * x + c
      return {
        q: [`求 $\\lim_{x \\to ${x}} (${a}x^2 ${b >= 0 ? '+' : '−'} ${Math.abs(b)}x ${c >= 0 ? '+' : '−'} ${Math.abs(c)})$。`,
            `Evaluate $\\lim_{x \\to ${x}} (${a}x^2 ${b >= 0 ? '+' : '−'} ${Math.abs(b)}x ${c >= 0 ? '+' : '−'} ${Math.abs(c)})$.`],
        ans: `$${ans}$`,
        wrong: [`$${a * x * x + b * x}$`, `$${2 * a * x + b}$`, `$${a + b + c}$`],
        e: [`多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入即可：$${a}(${x})^2 ${b >= 0 ? '+' : '−'} ${Math.abs(b)}(${x}) ${c >= 0 ? '+' : '−'} ${Math.abs(c)} = ${ans}$。第一個干擾項漏了常數項。第二個代入了【導函數】$${2 * a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b)}$ —— 求極限同求導數是兩件事，混淆兩者是初學極限時最常見的錯。第三項把 $x$ 當成 $1$ 代入。留意：只有當代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。`,
            `A polynomial is continuous everywhere, and the limit of a continuous function at a point is simply its value there, so substitute directly: $${a}(${x})^2 ${b >= 0 ? '+' : '−'} ${Math.abs(b)}(${x}) ${c >= 0 ? '+' : '−'} ${Math.abs(c)} = ${ans}$. The first distractor drops the constant term. The second substitutes into the *derivative* $${2 * a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b)}$ — taking a limit and differentiating are different operations, and confusing them is the classic beginner's error. The third substitutes $x = 1$. Note that simplification is needed only when substitution produces an indeterminate form such as $\\frac{0}{0}$, which is not the case here.`],
      }
    },
  },
  {
    key: 'm2_limit_infinity', topic: T.lim[0], topicZh: T.lim[1], topicEn: T.lim[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { an, ad, deg } = L2[i]
      const num2 = deg === 'hi' ? `${co(an)}x^3` : `${co(an)}x^2`
      const den = deg === 'lo' ? `${co(ad)}x^3` : `${co(ad)}x^2`
      const ansTxt = deg === 'eq' ? `$${frac(an, ad)}$` : deg === 'lo' ? '$0$' : '不存在（趨向無限大）'
      return {
        q: [`求 $\\lim_{x \\to \\infty} \\dfrac{${num2} + 1}{${den} + x}$。`,
            `Evaluate $\\lim_{x \\to \\infty} \\dfrac{${num2} + 1}{${den} + x}$.`],
        ans: ansTxt,
        wrong: [
          deg === 'eq' ? '$0$' : `$${frac(an, ad)}$`,
          deg === 'hi' ? '$0$' : '不存在（趨向無限大）',
          `$${frac(ad, an)}$`,
        ],
        ansEn: deg === 'eq' ? `$${frac(an, ad)}$` : deg === 'lo' ? '$0$' : 'Does not exist (tends to infinity)',
        wrongEn: [
          deg === 'eq' ? '$0$' : `$${frac(an, ad)}$`,
          deg === 'hi' ? '$0$' : 'Does not exist (tends to infinity)',
          `$${frac(ad, an)}$`,
        ],
        e: [`$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題分子最高次為 $${deg === 'hi' ? 3 : 2}$ 次，分母為 $${deg === 'lo' ? 3 : 2}$ 次，${deg === 'eq' ? `兩者同次，極限等於最高次項係數之比 $\\dfrac{${an}}{${ad}} = ${frac(an, ad)}$。` : deg === 'lo' ? '分母次數較高，分母增長得快得多，故整體趨向 $0$。' : '分子次數較高，分子增長得快得多，故無有限極限。'}判斷次序應為：先比次數，同次才比係數。一上手就約掉係數而不看次數，是本題最主要的失分位。最後一項把係數之比倒轉。`,
            `As $x \\to \\infty$ the limit of a rational function is governed by the *highest-degree* terms; lower-order terms and constants become negligible. Here the numerator has degree $${deg === 'hi' ? 3 : 2}$ and the denominator degree $${deg === 'lo' ? 3 : 2}$. ${deg === 'eq' ? `The degrees match, so the limit is the ratio of leading coefficients, $\\dfrac{${an}}{${ad}} = ${frac(an, ad)}$.` : deg === 'lo' ? 'The denominator has the higher degree and grows far faster, so the quotient tends to $0$.' : 'The numerator has the higher degree and grows far faster, so no finite limit exists.'} The order of reasoning matters: compare degrees first, and only compare coefficients when the degrees agree. Jumping straight to the coefficients is where most marks are lost. The final option inverts the ratio.`],
      }
    },
  },
  {
    key: 'm2_limit_sin', topic: T.lim[0], topicZh: T.lim[1], topicEn: T.lim[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { a, b } = L3[i]
      return {
        q: [`求 $\\lim_{x \\to 0} \\dfrac{\\sin ${a}x}{${b}x}$。`,
            `Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin ${a}x}{${b}x}$.`],
        ans: `$${frac(a, b)}$`,
        wrong: [`$${frac(b, a)}$`, '$1$', '$0$'],
        e: [`基本極限為 $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$，但它要求【正弦內的角】同【分母】完全相同。本題分子的角是 $${a}x$，分母卻是 $${b}x$，故要先湊：$\\dfrac{\\sin ${a}x}{${b}x} = \\dfrac{${a}}{${b}} \\cdot \\dfrac{\\sin ${a}x}{${a}x}$，右邊的分式趨向 $1$，故極限為 $${frac(a, b)}$。直接答 $1$ 是把基本極限硬套而不理會兩個角並不相同，這是本題設下的主要陷阱。答 $0$ 的把分子的 $\\sin 0 = 0$ 代入而忽略了分母同樣趨於零，$\\frac{0}{0}$ 是不定式，不可直接判為零。最後一項把比例倒轉。`,
            `The standard limit is $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$, but it requires the angle inside the sine to match the denominator exactly. Here the angle is $${a}x$ while the denominator is $${b}x$, so first rewrite: $\\dfrac{\\sin ${a}x}{${b}x} = \\dfrac{${a}}{${b}} \\cdot \\dfrac{\\sin ${a}x}{${a}x}$; the second factor tends to $1$, giving $${frac(a, b)}$. Answering $1$ applies the standard limit without checking that the two angles differ — the main trap here. Answering $0$ substitutes $\\sin 0 = 0$ while ignoring that the denominator also tends to zero; $\\frac{0}{0}$ is indeterminate and cannot be read off as zero. The last option inverts the ratio.`],
      }
    },
  },
  {
    key: 'm2_limit_piecewise', topic: T.lim[0], topicZh: T.lim[1], topicEn: T.lim[2], diff: 'basic', n: 4,
    gen: (i) => {
      const { p, l, r } = L4[i]
      const exists = l === r
      return {
        q: [`設 $f(x) = \\begin{cases} ${l} & x < ${p} \\\\ ${r} & x > ${p} \\end{cases}$。\n\n$\\lim_{x \\to ${p}} f(x)$ 是否存在？若存在，其值為何？`,
            `Let $f(x) = \\begin{cases} ${l} & x < ${p} \\\\ ${r} & x > ${p} \\end{cases}$.\n\nDoes $\\lim_{x \\to ${p}} f(x)$ exist, and if so what is its value?`],
        ans: exists
          ? `存在，且等於 $${l}$`
          : `不存在，因為左極限 $${l}$ 與右極限 $${r}$ 並不相等`,
        wrong: exists
          ? [`不存在，因為 $f(${p})$ 沒有定義`, `存在，且等於 $${l + r}$`, '不存在，因為左極限與右極限並不相等']
          : [`存在，且等於 $${l}$`, `存在，且等於 $${num((l + r) / 2)}$`, `存在，且等於 $${r}$`],
        ansEn: exists
          ? `It exists and equals $${l}$`
          : `It does not exist: the left-hand limit $${l}$ differs from the right-hand limit $${r}$`,
        wrongEn: exists
          ? [`It does not exist, because $f(${p})$ is undefined`, `It exists and equals $${l + r}$`, 'It does not exist, because the one-sided limits differ']
          : [`It exists and equals $${l}$`, `It exists and equals $${num((l + r) / 2)}$`, `It exists and equals $${r}$`],
        e: [`極限存在的條件是【左極限等於右極限】。本題左極限為 $${l}$，右極限為 $${r}$，${exists ? `兩者相等，故極限存在並等於 $${l}$。要留意：函數在 $x = ${p}$ 一點【有沒有定義】同極限是否存在完全無關 —— 極限只描述趨近的過程，不理會該點本身。` : `兩者不相等，故極限不存在。此時不可以取兩者的平均 $${num((l + r) / 2)}$ 或任意一邊的值 —— 極限要求兩邊趨向同一個數，做不到就是不存在，沒有折衷。`}分段函數求極限，必定要分左右兩邊各自檢查，不可只看其中一段。`,
            `A limit exists precisely when the left-hand and right-hand limits agree. Here they are $${l}$ and $${r}$. ${exists ? `They agree, so the limit exists and equals $${l}$. Note that whether $f$ is *defined* at $x = ${p}$ is irrelevant: a limit describes the approach, not the point itself.` : `They differ, so the limit does not exist. Averaging them to $${num((l + r) / 2)}$ or picking one side is not permitted — the limit requires both sides to approach the same value, and where they do not, there is no compromise.`} For a piecewise function, always check each side separately rather than reading off one branch.`],
      }
    },
  },

  // ── 線性方程組 14（現有 20 條全難，本批補 10 易 + 4 中）─────────────────
  {
    key: 'm2_system_unique', topic: T.sys[0], topicZh: T.sys[1], topicEn: T.sys[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { a, b, c, d } = S1[i]
      const det = a * d - b * c
      return {
        q: [`考慮方程組 $\\begin{cases} ${a}x + ${b}y = 7 \\\\ ${c}x + ${d}y = 9 \\end{cases}$。\n\n該方程組的解的情況是？`,
            `Consider $\\begin{cases} ${a}x + ${b}y = 7 \\\\ ${c}x + ${d}y = 9 \\end{cases}$.\n\nWhat can be said about its solutions?`],
        ans: det !== 0 ? '有唯一解' : '沒有唯一解（無解或有無限多解，須進一步檢查）',
        wrong: det !== 0
          ? ['沒有解', '有無限多解', '無法判斷，因為未知數多於方程']
          : ['有唯一解', '必定有無限多解', '無法判斷，因為未知數多於方程'],
        ansEn: det !== 0 ? 'There is a unique solution' : 'There is no unique solution (either none or infinitely many — further checking needed)',
        wrongEn: det !== 0
          ? ['There is no solution', 'There are infinitely many solutions', 'It cannot be decided, as there are more unknowns than equations']
          : ['There is a unique solution', 'There must be infinitely many solutions', 'It cannot be decided, as there are more unknowns than equations'],
        e: [`兩個二元一次方程有唯一解，當且僅當【係數行列式不為零】。此處 $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix} = ${a} \\times ${d} - ${b} \\times ${c} = ${det}$，${det !== 0 ? '不為零，故有唯一解。' : '等於零，故【沒有】唯一解 —— 但零行列式只告訴我們唯一解不存在，究竟是無解還是無限多解，要看兩條方程是否成比例，不能一口斷定。'}幾何上，行列式為零即代表兩條直線平行或重合。方程數同未知數同為兩個，故「未知數多於方程」一項同題目不符。`,
            `A pair of linear equations in two unknowns has a unique solution exactly when the coefficient determinant is non-zero. Here $\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{vmatrix} = ${a} \\times ${d} - ${b} \\times ${c} = ${det}$, which is ${det !== 0 ? 'non-zero, so the solution is unique.' : 'zero, so there is *no* unique solution — though a zero determinant only rules that out; whether there is no solution or infinitely many depends on whether the equations are proportional, which cannot be settled from the determinant alone.'} Geometrically a zero determinant means the two lines are parallel or coincident. There are two equations and two unknowns, so the option about unknowns outnumbering equations does not apply.`],
      }
    },
  },
  {
    key: 'm2_homogeneous', topic: T.sys[0], topicZh: T.sys[1], topicEn: T.sys[2], diff: 'basic', n: 4,
    gen: (i) => {
      const { a, b } = S3[i]
      const ans = (b * 3) / a // ad − bc = 0，取 c = 3
      return {
        q: [`考慮齊次方程組 $\\begin{cases} ${a}x + ${b}y = 0 \\\\ 3x + ky = 0 \\end{cases}$。\n\n求 $k$ 的值，使該方程組有【非零解】。`,
            `Consider the homogeneous system $\\begin{cases} ${a}x + ${b}y = 0 \\\\ 3x + ky = 0 \\end{cases}$.\n\nFind $k$ for which it has a *non-trivial* solution.`],
        ans: `$k = ${num(ans)}$`,
        wrong: [`$k = ${num(-ans)}$`, `$k = ${num((a * 3) / b)}$`, '任何 $k$ 值皆可'],
        ansEn: `$k = ${num(ans)}$`,
        wrongEn: [`$k = ${num(-ans)}$`, `$k = ${num((a * 3) / b)}$`, 'Any value of $k$ will do'],
        e: [`齊次方程組必定有零解（$x = y = 0$）；它有【非零】解，當且僅當係數行列式等於零。故 $\\begin{vmatrix} ${a} & ${b} \\\\ 3 & k \\end{vmatrix} = ${a}k - ${b * 3} = 0$，得 $k = ${num(ans)}$。「任何 $k$ 值皆可」一項混淆了兩件事：任何 $k$ 都能保證【零解】存在，但要有非零解就必須額外令行列式歸零。第一個干擾項漏了符號，第二個把兩條方程的係數對調了位置。`,
            `A homogeneous system always admits the trivial solution $x = y = 0$; it has a *non-trivial* solution exactly when the coefficient determinant vanishes. So $\\begin{vmatrix} ${a} & ${b} \\\\ 3 & k \\end{vmatrix} = ${a}k - ${b * 3} = 0$, giving $k = ${num(ans)}$. The option "any $k$" confuses two things: every $k$ guarantees the *trivial* solution, but a non-trivial one additionally requires the determinant to be zero. The first distractor drops a sign and the second swaps coefficients between the equations.`],
      }
    },
  },
  {
    key: 'm2_three_unknowns', topic: T.sys[0], topicZh: T.sys[1], topicEn: T.sys[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { x, y, z } = S2[i]
      const s1 = x + y + z, s2 = x - y + 2 * z, s3 = 2 * x + y - z
      return {
        q: [`設實數 $x$、$y$、$z$ 同時滿足以下三項條件：\n\n$x + y + z = ${s1}$　　$x - y + 2z = ${s2}$　　$2x + y - z = ${s3}$\n\n試求 $x$ 的值。`,
            `Real numbers $x$, $y$ and $z$ satisfy all three conditions below:\n\n$x + y + z = ${s1}$　　$x - y + 2z = ${s2}$　　$2x + y - z = ${s3}$\n\nFind the value of $x$.`],
        ans: `$x = ${x}$`,
        wrong: [`$x = ${y}$`, `$x = ${z}$`, `$x = ${num(s1 - s2)}$`],
        e: [`用消元法。第一式減第二式消去 $x$：$2y - z = ${s1 - s2}$；第三式減第一式的兩倍消去 $x$：$-y - 3z = ${s3 - 2 * s1}$。兩式聯立解得 $y = ${y}$、$z = ${z}$，代回第一式得 $x = ${s1} - ${y} - ${z} = ${x}$。三元方程組的關鍵在於【每次消去同一個未知數】，若第一步消 $x$、第二步卻消了 $y$，剩下的兩式仍有三個未知數，等於做了白工。其餘干擾項分別是 $y$ 與 $z$ 的值 —— 算對了方程組卻答錯了題目所問的那一個，是本類題目最可惜的失分。`,
            `Eliminate systematically. Subtracting the second equation from the first removes $x$: $2y - z = ${s1 - s2}$. Subtracting twice the first from the third also removes $x$: $-y - 3z = ${s3 - 2 * s1}$. Solving these two gives $y = ${y}$ and $z = ${z}$, and substituting back into the first equation gives $x = ${s1} - ${y} - ${z} = ${x}$. The key with three unknowns is to eliminate the *same* variable each time; eliminating $x$ first and $y$ second leaves two equations still carrying three unknowns. The other distractors are the values of $y$ and $z$ — solving the system correctly but answering for the wrong variable is the most frustrating way to lose these marks.`],
      }
    },
  },

  // ── 數學歸納法 5（現有零易題）───────────────────────────────────────────
  {
    key: 'm2_induction_steps', topic: T.ind[0], topicZh: T.ind[1], topicEn: T.ind[2], diff: 'basic', n: 5,
    gen: (i) => {
      const cases = [
        { q: '在數學歸納法的證明中，「奠基步驟」（起始步驟）的作用是甚麼？', qEn: 'In a proof by mathematical induction, what is the purpose of the base step?',
          a: '驗證命題在最小的一個 $n$ 值上成立，為整條推論鏈提供起點',
          aEn: 'It verifies the statement at the smallest value of $n$, giving the chain of reasoning a starting point',
          w: ['證明命題對所有 $n$ 都成立', '假設命題在 $n = k$ 時成立', '推導出命題在 $n = k+1$ 時成立'] as [string, string, string],
          wEn: ['It proves the statement for all $n$', 'It assumes the statement holds at $n = k$', 'It deduces the statement at $n = k+1$'] as [string, string, string],
          e: '奠基步驟只做一件事：確認第一塊骨牌真的倒下。若沒有它，即使歸納步驟成立，整條鏈也可能從未開始 —— 例如「$n$ 為正整數時 $n = n+1$」的歸納步驟形式上推得下去，但因為沒有任何一個 $n$ 使它成立，命題依然是假的。其餘三項分別是歸納假設、歸納步驟與整個證明的結論，都不是奠基步驟本身。',
          eEn: 'The base step does exactly one thing: it confirms that the first domino actually falls. Without it the chain may never start even when the inductive step is valid — the statement "$n = n+1$ for positive integers" has a formally workable inductive step, yet is false because no $n$ satisfies it. The other options describe the inductive hypothesis, the inductive step and the overall conclusion, none of which is the base step.' },
        { q: '在數學歸納法中，「歸納假設」指的是甚麼？', qEn: 'In mathematical induction, what is the inductive hypothesis?',
          a: '假設命題在某一個 $n = k$ 時成立',
          aEn: 'It assumes the statement holds for one particular $n = k$',
          w: ['假設命題對所有 $n$ 都成立', '驗證命題在 $n = 1$ 時成立', '證明命題在 $n = k+1$ 時成立'] as [string, string, string],
          wEn: ['It assumes the statement holds for every $n$', 'It verifies the statement at $n = 1$', 'It proves the statement at $n = k+1$'] as [string, string, string],
          e: '歸納假設只假設【某一個】 $k$ 成立，然後據此推出 $k+1$ 亦成立。若一開始就假設「對所有 $n$ 成立」，那正是要證明的結論，等於循環論證 —— 這是初學者最常犯的邏輯錯誤。餘下兩項分別是奠基步驟與歸納步驟。',
          eEn: 'The inductive hypothesis assumes the statement holds for *one particular* $k$, and from that deduces it holds for $k+1$. Assuming it for all $n$ at the outset would assume the very conclusion being proved, which is circular — the commonest logical slip for beginners. The remaining options describe the base step and the inductive step.' },
        { q: '若某命題的奠基步驟由 $n = 3$ 開始驗證，並已完成歸納步驟，則該證明確立了命題對哪些 $n$ 成立？', qEn: 'If the base step is verified at $n = 3$ and the inductive step is complete, for which $n$ is the statement established?',
          a: '所有大於或等於 $3$ 的正整數',
          aEn: 'All positive integers greater than or equal to $3$',
          w: ['所有正整數', '只有 $n = 3$', '所有大於 $3$ 的正整數，但不包括 $3$ 本身'] as [string, string, string],
          wEn: ['All positive integers', 'Only $n = 3$', 'All positive integers greater than $3$, excluding $3$ itself'] as [string, string, string],
          e: '歸納法確立的範圍由奠基點起計。奠基於 $n = 3$，歸納步驟把 $3$ 推到 $4$、$4$ 推到 $5$，如此不斷，故涵蓋 $n \\geq 3$ 的所有正整數，而 $3$ 本身正是已驗證的一個，必須包括在內。$n = 1, 2$ 並未經任何步驟觸及，故不能宣稱成立 —— 這是本題的考點：結論的範圍不可超出奠基點。',
          eEn: 'Induction establishes the statement from the base point onwards. Anchored at $n = 3$, the inductive step carries $3$ to $4$, $4$ to $5$, and so on, covering every integer $n \\geq 3$; and $3$ itself, having been verified directly, must be included. Nothing in the argument touches $n = 1$ or $2$, so no claim can be made there — the point being tested is that the conclusion cannot reach below the base point.' },
        { q: '以下哪一項【不是】一個有效的數學歸納法證明所必需的？', qEn: 'Which of the following is *not* required in a valid proof by mathematical induction?',
          a: '驗證命題在每一個具體的 $n$ 值上成立',
          aEn: 'Verifying the statement at every individual value of $n$',
          w: ['驗證奠基步驟', '寫出歸納假設', '由 $n = k$ 推出 $n = k+1$'] as [string, string, string],
          wEn: ['Verifying the base step', 'Stating the inductive hypothesis', 'Deducing $n = k+1$ from $n = k$'] as [string, string, string],
          e: '歸納法的價值正在於【不需要】逐個驗證。命題涉及無限多個 $n$，逐個驗證永遠做不完；歸納法用「奠基 + 遞推」兩步取代無限次驗證，這正是它作為證明方法的意義所在。其餘三項都是必要組成部分，缺一則證明不成立。',
          eEn: 'The whole value of induction is that case-by-case checking is *not* needed. The statement concerns infinitely many $n$, so exhaustive verification could never finish; induction replaces it with two steps, a base case and a recursive one. The other three options are all indispensable parts of the proof.' },
        { q: '某證明完成了歸納步驟，卻【沒有】驗證奠基步驟。該證明的效力如何？', qEn: 'A proof completes the inductive step but omits the base step. What is its status?',
          a: '不成立，因為缺少起點，推論鏈可能從未開始',
          aEn: 'Invalid: with no starting point, the chain of reasoning may never begin',
          w: ['成立，歸納步驟已足夠', '成立，但只適用於偶數', '不成立，因為歸納假設不可以使用'] as [string, string, string],
          wEn: ['Valid — the inductive step is enough on its own', 'Valid, but only for even numbers', 'Invalid, because the inductive hypothesis may not be used'] as [string, string, string],
          e: '歸納步驟只保證「若某個 $k$ 成立，則 $k+1$ 亦成立」，它本身並不保證有任何 $k$ 成立。缺了奠基，就像一排骨牌排得整整齊齊卻沒有人推第一塊。答「歸納步驟已足夠」的正是忽略了這一點。至於歸納假設，它在證明中是可以使用的 —— 使用它並非錯誤，錯誤在於沒有起點。',
          eEn: 'The inductive step only guarantees that *if* some $k$ works then $k+1$ works; it never establishes that any $k$ works. Without a base case the dominoes are lined up but nobody pushes the first one. Answering that the inductive step suffices overlooks exactly this. The inductive hypothesis itself is legitimate to use — using it is not the error; having no starting point is.' },
      ]
      const c = cases[i]
      return { q: [c.q, c.qEn], ans: c.a, wrong: c.w, e: [c.e, c.eEn], ansEn: c.aEn, wrongEn: c.wEn }
    },
  },

  // ── 微積分應用 4（現有零易題，本批補中等）───────────────────────────────
  {
    key: 'm2_tangent_slope', topic: T.app[0], topicZh: T.app[1], topicEn: T.app[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { a, b, c } = A1[i]
      const vx = -b / (2 * a)
      const vy = a * vx * vx + b * vx + c
      return {
        q: [`設 $f(x) = ${a}x^2 ${b >= 0 ? '+' : '−'} ${Math.abs(b)}x ${c >= 0 ? '+' : '−'} ${Math.abs(c)}$。求 $f(x)$ 的極${a > 0 ? '小' : '大'}值。`,
            `Let $f(x) = ${a}x^2 ${b >= 0 ? '+' : '−'} ${Math.abs(b)}x ${c >= 0 ? '+' : '−'} ${Math.abs(c)}$. Find the ${a > 0 ? 'minimum' : 'maximum'} value of $f(x)$.`],
        ans: `$${num(vy)}$`,
        wrong: [`$${num(vx)}$`, `$${c}$`, `$${num(-vy)}$`],
        e: [`極值出現在導函數為零之處。$f'(x) = ${2 * a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b)}$，令其為零得 $x = ${num(vx)}$。因為二次項係數 $${a} ${a > 0 ? '> 0$，拋物線開口向上，此點為極小值點' : '< 0$，拋物線開口向下，此點為極大值點'}。把 $x = ${num(vx)}$ 代回【原函數】得極值 $f(${num(vx)}) = ${num(vy)}$。答 $${num(vx)}$ 的停在了使導數為零的 $x$ 值 —— 那是極值出現的【位置】，不是極值本身，這是本題最主要的失分位。答 $${c}$ 的把 $y$ 截距當成極值，兩者只在頂點恰好落在縱軸上時才相同。`,
            `A turning point occurs where the derivative vanishes. $f'(x) = ${2 * a}x ${b >= 0 ? '+' : '−'} ${Math.abs(b)}$, which is zero at $x = ${num(vx)}$. Since the coefficient of $x^2$ is $${a}${a > 0 ? ' > 0$, the parabola opens upwards and this is a minimum' : ' < 0$, the parabola opens downwards and this is a maximum'}. Substituting back into the *original* function gives $f(${num(vx)}) = ${num(vy)}$. Answering $${num(vx)}$ stops at the $x$-value where the derivative is zero — that is *where* the extremum occurs, not the extremum itself, and it is the main trap here. Answering $${c}$ mistakes the $y$-intercept for the extreme value; the two agree only when the vertex happens to sit on the $y$-axis.`],
      }
    },
  },

  // ── 向量 4 ──────────────────────────────────────────────────────────────
  {
    key: 'm2_perpendicular_vectors', topic: T.vec[0], topicZh: T.vec[1], topicEn: T.vec[2], diff: 'basic', n: 4,
    gen: (i) => {
      const { x1, y1, k } = V1[i]
      const ans = -(x1 * k) / y1
      return {
        q: [`設 $\\vec{a} = (${x1}, ${y1})$、$\\vec{b} = (${k}, t)$。求 $t$ 的值，使 $\\vec{a}$ 與 $\\vec{b}$ 互相垂直。`,
            `Let $\\vec{a} = (${x1}, ${y1})$ and $\\vec{b} = (${k}, t)$. Find $t$ so that $\\vec{a}$ and $\\vec{b}$ are perpendicular.`],
        ans: `$t = ${num(ans)}$`,
        wrong: [`$t = ${num(-ans)}$`, `$t = ${num((y1 * k) / x1)}$`, `$t = ${num(y1 / k)}$`],
        e: [`兩個非零向量垂直，當且僅當其純量積為零：$\\vec{a} \\cdot \\vec{b} = ${x1} \\times ${k} + ${y1}t = 0$，故 $t = ${num(ans)}$。可以代回檢查：$${x1} \\times ${k} + ${y1} \\times ${num(ans)} = 0$。第一個干擾項漏了負號 —— 純量積為零通常要求兩個分量的乘積互相抵銷，故 $t$ 的符號多數同 $\\vec{a}$ 的分量相反，見到答案同號就應該起疑。第二項把兩個分量的角色對調（那是【平行】的條件所用的比例關係）。垂直看純量積，平行看分量成比例，兩者不可混淆。`,
            `Two non-zero vectors are perpendicular exactly when their scalar product is zero: $\\vec{a} \\cdot \\vec{b} = ${x1} \\times ${k} + ${y1}t = 0$, giving $t = ${num(ans)}$. Check by substituting: $${x1} \\times ${k} + ${y1} \\times ${num(ans)} = 0$. The first distractor drops the minus sign — a zero scalar product usually needs the two component products to cancel, so $t$ normally takes the opposite sign to the components of $\\vec{a}$; an answer with matching signs should raise suspicion. The second swaps the roles of the components, which belongs to the proportionality test for *parallel* vectors. Perpendicularity is tested by the scalar product, parallelism by proportional components; the two must not be confused.`],
      }
    },
  },
]

emit('m2', 'm2_rep', archs, 'scripts/qbank/drafts/m2-replace.json')
