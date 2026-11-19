// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "differentiation": {
    "subjectId": "m2",
    "topicId": "differentiation",
    "titleZh": "微分法",
    "titleEn": "Differentiation",
    "conceptZh": "冪法則：$\\frac{d}{dx}(2x^{3}) = 2\\cdot3\\,x^{2} = 6x^{2}$。",
    "conceptEn": "Power rule: $\\frac{d}{dx}(2x^{3}) = 2\\cdot3\\,x^{2} = 6x^{2}$.",
    "mustKnowZh": [
      "冪法則：$\\frac{d}{dx}(2x^{3}) = 2\\cdot3\\,x^{2} = 6x^{2}$。",
      "冪法則：$\\frac{d}{dx}(3x^{2}) = 3\\cdot2\\,x = 6x$。",
      "鏈式法則：外層 $n(\\cdot)^{n-1}$ 乘內層導數 $2$，得 $6(2x+1)^{2}$。",
      "鏈式法則：外層 $n(\\cdot)^{n-1}$ 乘內層導數 $3$，得 $6(3x+1)$。"
    ],
    "mustKnowEn": [
      "Power rule: $\\frac{d}{dx}(2x^{3}) = 2\\cdot3\\,x^{2} = 6x^{2}$.",
      "Power rule: $\\frac{d}{dx}(3x^{2}) = 3\\cdot2\\,x = 6x$.",
      "Chain rule: outer $n(\\cdot)^{n-1}$ times inner derivative $2$ gives $6(2x+1)^{2}$.",
      "Chain rule: outer $n(\\cdot)^{n-1}$ times inner derivative $3$ gives $6(3x+1)$."
    ],
    "examTipZh": "DSE 作答「微分法」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Differentiation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$18$ 只計算了 $f(3)$ 而未求導；$36$ 忘記把指數減一；$6$ 漏掉了係數 $2$。",
    "commonTrapEn": "$18$ evaluates $f(3)$ without differentiating; $36$ forgets to reduce the exponent by one; $6$ drops the coefficient $2$.",
    "source": "generated",
    "explainerSrc": "/explainers/m2-differentiation.svg"
  },
  "integration": {
    "subjectId": "m2",
    "topicId": "integration",
    "titleZh": "積分法",
    "titleEn": "Integration",
    "conceptZh": "冪法則積分：$\\int 3x^{2}\\,dx = \\frac{3}{3}x^{3} + C = x^{3} + C$。",
    "conceptEn": "Power rule: $\\int 3x^{2}\\,dx = \\frac{3}{3}x^{3} + C = x^{3} + C$.",
    "mustKnowZh": [
      "冪法則積分：$\\int 3x^{2}\\,dx = \\frac{3}{3}x^{3} + C = x^{3} + C$。",
      "$\\int_0^{2} 3x\\,dx = \\left[\\frac{3x^2}{2}\\right]_0^{2} = 6$。",
      "$\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x} + C$。",
      "先求原函數：$\\int x^{2}\\,dx = \\dfrac{x^{3}}{3}$。"
    ],
    "mustKnowEn": [
      "Power rule: $\\int 3x^{2}\\,dx = \\frac{3}{3}x^{3} + C = x^{3} + C$.",
      "$\\int_0^{2} 3x\\,dx = \\left[\\frac{3x^2}{2}\\right]_0^{2} = 6$.",
      "$\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x} + C$.",
      "First find the antiderivative: $\\int x^{2}\\,dx = \\frac{x^{3}}{3}$. Then substitute the limits: $\\left[\\frac{x^{3}}{3}\\right]_{0}^{3} = \\frac{3^{3}}{3} - 0 = \\frac{27}{3} = 9$. A…"
    ],
    "examTipZh": "DSE 作答「積分法」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Integration”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$12$ 漏了除以 $2$。",
    "commonTrapEn": "$12$ forgets to divide by $2$.",
    "source": "generated"
  },
  "limits": {
    "subjectId": "m2",
    "topicId": "limits",
    "titleZh": "極限",
    "titleEn": "Limits",
    "conceptZh": "$\\frac{(x-3)(x+3)}{x-3} = x + 3$，代入得 $6$。",
    "conceptEn": "$\\frac{(x-3)(x+3)}{x-3} = x + 3$, substituting gives $6$.",
    "mustKnowZh": [
      "$\\frac{(x-3)(x+3)}{x-3} = x + 3$，代入得 $6$。",
      "改寫為 $2\\cdot\\frac{\\sin 2x}{2x}$，極限 $= 2\\times 1 = 2$。",
      "$x$ 越大 $\\frac{1}{x}$ 越接近 0。",
      "同除以最高次 $x^2$，比值趨近 $\\frac{3}{1}=3$。"
    ],
    "mustKnowEn": [
      "$\\frac{(x-3)(x+3)}{x-3} = x + 3$, substituting gives $6$.",
      "Rewrite as $2\\cdot\\frac{\\sin 2x}{2x}$; the limit is $2\\times 1 = 2$.",
      "As $x$ grows, $\\frac{1}{x}$ approaches 0.",
      "Divide by the highest power $x^2$; the ratio tends to $\\frac{3}{1}=3$."
    ],
    "examTipZh": "DSE 作答「極限」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Limits”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0$ 把直接代入所得的不定式 $\\tfrac{0}{0}$ 當成 $0$，不定式須先化簡；$3$ 化簡後只代入了 $x$，漏了加 $3$；$9$ 只取了分子的常數。",
    "commonTrapEn": "$0$ treats the indeterminate form $\\frac{0}{0}$ from direct substitution as $0$; $3$ forgets to add $3$ after simplifying; $9$ takes only the constant in the numerator.",
    "source": "generated"
  },
  "matrices": {
    "subjectId": "m2",
    "topicId": "matrices",
    "titleZh": "矩陣與行列式",
    "titleEn": "Matrices & Determinants",
    "conceptZh": "$\\det = ad - bc = (2)(4) - (1)(3) = 5$。",
    "conceptEn": "$\\det = ad - bc = (2)(4) - (1)(3) = 5$.",
    "mustKnowZh": [
      "$\\det = ad - bc = (2)(4) - (1)(3) = 5$。",
      "$\\det(I) = (1)(1) - (0)(0) = 1$。",
      "矩陣相加 = 對應元素相加。",
      "純量乘法 = 每個元素乘以 3。"
    ],
    "mustKnowEn": [
      "$\\det = ad - bc = (2)(4) - (1)(3) = 5$.",
      "$\\det(I) = (1)(1) - (0)(0) = 1$.",
      "Matrix addition adds corresponding entries.",
      "Scalar multiplication multiplies every entry by 3."
    ],
    "examTipZh": "DSE 作答「矩陣與行列式」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Matrices & Determinants”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "11 計成 $ad+bc$；$-5$ 把 $bc-ad$ 倒轉；8 只取 $ad$。",
    "commonTrapEn": "11 computes $ad+bc$; $-5$ inverts to $bc-ad$; 8 keeps only $ad$.",
    "source": "generated"
  },
  "vectors": {
    "subjectId": "m2",
    "topicId": "vectors",
    "titleZh": "向量",
    "titleEn": "Vectors",
    "conceptZh": "點積 $= 3\\cdot1 + 4\\cdot2 = 11$。",
    "conceptEn": "Dot product $= 3\\cdot1 + 4\\cdot2 = 11$.",
    "mustKnowZh": [
      "點積 $= 3\\cdot1 + 4\\cdot2 = 11$。",
      "$|\\vec{v}| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$。",
      "向量加法逐分量相加：$(1+3, 2+4)=(4,6)$。",
      "純量乘法逐分量相乘：$(3\\cdot 2, 3\\cdot(-1))=(6,-3)$。"
    ],
    "mustKnowEn": [
      "Dot product $= 3\\cdot1 + 4\\cdot2 = 11$.",
      "$|\\vec{v}| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.",
      "Add componentwise: $(1+3, 2+4)=(4,6)$.",
      "Scalar multiply each component: $(6,-3)$."
    ],
    "examTipZh": "DSE 作答「向量」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Vectors”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$9$ 只計了第一項。",
    "commonTrapEn": "$9$ is only the first term.",
    "source": "generated"
  },
  "mathematical_induction": {
    "subjectId": "m2",
    "topicId": "mathematical_induction",
    "titleZh": "數學歸納法",
    "titleEn": "Mathematical Induction",
    "conceptZh": "將 $n=k+1$ 代入公式得 $\\frac{(k+1)(k+2)}{2}$。",
    "conceptEn": "Substituting $n=k+1$ gives $\\frac{(k+1)(k+2)}{2}$.",
    "mustKnowZh": [
      "將 $n=k+1$ 代入公式得 $\\frac{(k+1)(k+2)}{2}$。",
      "$n=1$：左邊 $=1$，右邊 $=1^2=1$，兩者相等。",
      "缺少基礎步，骨牌沒有起點，證明無效。",
      "代入 $n = 5$：$\\dfrac{5(5+1)}{2} = \\dfrac{5 \\times 6}{2} = 15$。"
    ],
    "mustKnowEn": [
      "Substituting $n=k+1$ gives $\\frac{(k+1)(k+2)}{2}$.",
      "At $n=1$: LHS $=1$, RHS $=1^2=1$ — they match.",
      "Without the base case the \"dominoes\" have no starting point — the proof fails.",
      "With $n = 5$: $\\frac{5(5+1)}{2} = \\frac{5 \\times 6}{2} = 15$."
    ],
    "examTipZh": "DSE 作答「數學歸納法」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Mathematical Induction”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$30$ 漏了除以 2；$10$ 把 $n+1$ 寫成 $n-1$；$25$ 誤用 $n^2$。",
    "commonTrapEn": "$30$ omits the division by 2; $10$ writes $n-1$ for $n+1$; $25$ uses $n^2$.",
    "source": "generated"
  },
  "binomial_theorem": {
    "subjectId": "m2",
    "topicId": "binomial_theorem",
    "titleZh": "二項式定理",
    "titleEn": "Binomial Theorem",
    "conceptZh": "$\\binom{5}{2}=\\frac{5!}{2!\\,3!}=\\frac{5\\times4}{2}=10$。",
    "conceptEn": "$\\binom{5}{2}=\\frac{5!}{2!\\,3!}=\\frac{5\\times4}{2}=10$.",
    "mustKnowZh": [
      "$\\binom{5}{2}=\\frac{5!}{2!\\,3!}=\\frac{5\\times4}{2}=10$。",
      "$x^2$ 項係數為 $\\binom{5}{2}=10$。",
      "$x^3$ 項係數為 $\\binom{6}{3}=\\frac{6\\times5\\times4}{3\\times2}=20$。",
      "$x^2$ 項 $=\\binom{4}{2}\\,2^{2}x^{2}=6\\times4\\,x^2=24x^2$，故係數為 $24$。"
    ],
    "mustKnowEn": [
      "$\\binom{5}{2}=\\frac{5!}{2!\\,3!}=\\frac{5\\times4}{2}=10$.",
      "The coefficient of $x^2$ is $\\binom{5}{2}=10$.",
      "The coefficient of $x^3$ is $\\binom{6}{3}=\\frac{6\\times5\\times4}{3\\times2}=20$.",
      "The $x^2$ term is $\\binom{4}{2}\\,2^{2}x^{2}=6\\times4\\,x^2=24x^2$, so the coefficient is $24$."
    ],
    "examTipZh": "DSE 作答「二項式定理」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Binomial Theorem”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$20$ 取錯了項（$r$ 差一，因為展開式由 $x^0$ 開始數，第 $k$ 項對應 $x^{k-1}$）；$12$ 用了相乘；$6$ 只抄了指數。",
    "commonTrapEn": "$20$ takes the wrong term, since the expansion is counted from $x^0$ so the $k$-th term carries $x^{k-1}$; $12$ multiplies; $6$ copies the exponent.",
    "source": "generated"
  },
  "calculus_app": {
    "subjectId": "m2",
    "topicId": "calculus_app",
    "titleZh": "微積分應用",
    "titleEn": "Applications of Calculus",
    "conceptZh": "$f'(x)=2x-4=0 \\Rightarrow x=2$，$f(2)=3$。",
    "conceptEn": "$f'(x)=2x-4=0 \\Rightarrow x=2$, and $f(2)=3$.",
    "mustKnowZh": [
      "$f'(x)=2x-4=0 \\Rightarrow x=2$，$f(2)=3$。",
      "$f'(x)=2x-6=0 \\Rightarrow x=3$，$f(3)=-4$。",
      "$\\frac{dy}{dx}=3x^{2}$，代入 $x=2$ 得斜率 $12$。",
      "$\\frac{dy}{dx}=2x$，代入 $x=3$ 得斜率 $6$。"
    ],
    "mustKnowEn": [
      "$f'(x)=2x-4=0 \\Rightarrow x=2$, and $f(2)=3$.",
      "$f'(x)=2x-6=0 \\Rightarrow x=3$, and $f(3)=-4$.",
      "$\\frac{dy}{dx}=3x^{2}$; at $x=2$ the slope is $12$.",
      "$\\frac{dy}{dx}=2x$; at $x=3$ the slope is $6$."
    ],
    "examTipZh": "DSE 作答「微積分應用」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Applications of Calculus”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$3$ 求導時漏了因子 2；$6$ 是曲線上該點的 $y$ 坐標而非斜率；$4$ 漏掉了一次項的導數 $1$。",
    "commonTrapEn": "$3$ loses the factor 2 when differentiating; $6$ is the $y$-coordinate of the point, not the slope; $4$ omits the derivative $1$ of the linear term.",
    "source": "generated"
  },
  "m2_vectors_3d": {
    "subjectId": "m2",
    "topicId": "m2_vectors_3d",
    "titleZh": "三維向量",
    "titleEn": "3-D vectors",
    "conceptZh": "$|\\mathbf{a}|=\\sqrt{1^2+2^2+2^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$。",
    "conceptEn": "$|\\mathbf{a}|=\\sqrt{1^2+2^2+2^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$.",
    "mustKnowZh": [
      "$|\\mathbf{a}|=\\sqrt{1^2+2^2+2^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$。",
      "$\\cos\\theta=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}=\\dfrac{1}{1\\cdot\\sqrt2}=\\dfrac{1}{\\sqrt2}$，故 $\\theta=45^\\circ$。",
      "三維向量的模 $|\\mathbf{v}| = \\sqrt{a^2 + b^2 + c^2} = \\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{9} = 3$。",
      "點積是對應分量相乘後相加：$1(4) + 2(5) + 3(6) = 4 + 10 + 18 = 32$。"
    ],
    "mustKnowEn": [
      "$|\\mathbf{a}|=\\sqrt{1^2+2^2+2^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$.",
      "$\\cos\\theta=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}=\\dfrac{1}{1\\cdot\\sqrt2}=\\dfrac{1}{\\sqrt2}$, so $\\theta=45^\\circ$.",
      "The magnitude is $|\\mathbf{v}| = \\sqrt{a^2 + b^2 + c^2} = \\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{9} = 3$.",
      "The dot product multiplies corresponding components and adds: $1(4) + 2(5) + 3(6) = 4 + 10 + 18 = 32$. The result is a scalar rather than a vector, which is the key difference…"
    ],
    "examTipZh": "DSE 作答「三維向量」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “3-D vectors”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "9 漏了開方（停在平方和）；5 把分量相加（1+2+2）；$\\sqrt5$ 漏了其中一個分量。",
    "commonTrapEn": "9 forgets the square root (stops at the sum of squares); 5 adds the components (1+2+2); $\\sqrt5$ drops a component.",
    "source": "generated"
  },
  "linear_systems": {
    "subjectId": "m2",
    "topicId": "linear_systems",
    "titleZh": "線性方程組",
    "titleEn": "Systems of Linear Equations",
    "conceptZh": "克拉瑪法則：$\\Delta = 2\\cdot3 - 1\\cdot1 = 5$，$x = \\dfrac{\\begin{vmatrix} 4 & 1 \\\\ 7 & 3 \\end{vmatrix}}{\\Delta} = \\dfrac{5}{5} = 1$。",
    "conceptEn": "Cramer: $x = \\frac{c_1b_2 - b_1c_2}{\\Delta} = 1$.",
    "mustKnowZh": [
      "克拉瑪法則：$\\Delta = 2\\cdot3 - 1\\cdot1 = 5$，$x = \\dfrac{\\begin{vmatrix} 4 & 1 \\\\ 7 & 3 \\end{vmatrix}}{\\Delta} = \\dfrac{5}{5} = 1$。",
      "係數行列式 $\\Delta = 1(1) - 2(3) = -5 \\neq 0$，故有唯一解。",
      "係數行列式 $\\Delta = 2(3) - 1(1) = 5 \\neq 0$，故有唯一解。",
      "二元一次方程組有唯一解的充要條件是係數行列式不為零。"
    ],
    "mustKnowEn": [
      "Cramer: $x = \\frac{c_1b_2 - b_1c_2}{\\Delta} = 1$.",
      "The coefficient determinant is $\\Delta = 1(1) - 2(3) = -5 \\neq 0$, so the solution is unique. Replacing the first column by the constants, $\\Delta_x = 5(1) - 2(5) = -5$, hence $x…",
      "The coefficient determinant is $\\Delta = 1(1) - 2(3) = -5 \\neq 0$, so the solution is unique. Replacing the first column by the constants, $\\Delta_x = 5(1) - 2(10) = -15$, hence…",
      "The coefficient determinant is $\\Delta = 2(3) - 1(1) = 5 \\neq 0$, so the solution is unique. Replacing the first column by the constants, $\\Delta_x = 4(3) - 1(7) = 5$, hence $x =…"
    ],
    "examTipZh": "DSE 作答「線性方程組」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Systems of Linear Equations”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2$ 是 $y$ 的解，並非 $x$。",
    "commonTrapEn": "$2$ is $y$, not $x$.",
    "source": "generated"
  }
}
