// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "quadratic_equations": {
    "subjectId": "math",
    "topicId": "quadratic_equations",
    "titleZh": "二次方程",
    "titleEn": "Quadratic Equations",
    "conceptZh": "判別式 b² − 4ac 決定二次方程實根的數目，同時決定拋物線與橫軸的位置關係：大於零為兩個交點，等於零為相切，小於零為不相交。",
    "conceptEn": "判別式 b² − 4ac 決定二次方程實根的數目，同時決定拋物線與橫軸的位置關係：大於零為兩個交點，等於零為相切，小於零為不相交。",
    "mustKnowZh": [
      "x² − 2x − 2 = 0 的判別式為 12，大於零，故有兩個相異實根，圖像與橫軸有兩個交點；x² + 2x + 5 = 0 的判別式為 −16，圖像整條在橫軸之上。",
      "因式分解為 $(x - 1)(x - 3) = 0$。",
      "因式分解為 $(x + 1)(x - 4) = 0$。"
    ],
    "mustKnowEn": [
      "x² − 2x − 2 = 0 的判別式為 12，大於零，故有兩個相異實根，圖像與橫軸有兩個交點；x² + 2x + 5 = 0 的判別式為 −16，圖像整條在橫軸之上。",
      "Factorise as $(x - 1)(x - 3) = 0$.",
      "Factorise as $(x + 1)(x - 4) = 0$."
    ],
    "examTipZh": "題目若問「有多少個交點」或「圖像是否與橫軸相交」，一律轉為判別式問題；兩種問法指向同一項計算。",
    "examTipEn": "題目若問「有多少個交點」或「圖像是否與橫軸相交」，一律轉為判別式問題；兩種問法指向同一項計算。",
    "commonTrapZh": "未把方程整理為一般式便讀出係數。例如 3x² = 2x + 5 必須先移項成 3x² − 2x − 5 = 0，否則 b 與 c 都會取錯。",
    "commonTrapEn": "$(x - 1) = 0$ gives $x = 1$ (flip the sign as you move it across), NOT $-1$. So $x = 1$ or $x = 3$ — every distractor here is a sign trap, so check each root.",
    "source": "sensei",
    "explainerSrc": "/explainers/math-quadratic.svg"
  },
  "probability": {
    "subjectId": "math",
    "topicId": "probability",
    "titleZh": "概率",
    "titleEn": "Probability",
    "conceptZh": "互斥指兩事件不能同時發生，即 P(A 且 B) 等於零；獨立指一方發生與否不影響另一方，即 P(A 且 B) 等於 P(A) 乘 P(B)。兩者是不同性質。",
    "conceptEn": "互斥指兩事件不能同時發生，即 P(A 且 B) 等於零；獨立指一方發生與否不影響另一方，即 P(A 且 B) 等於 P(A) 乘 P(B)。兩者是不同性質。",
    "mustKnowZh": [
      "擲一枚骰子，出現一點與出現二點互斥；擲兩枚骰子，第一枚出現一點與第二枚出現二點則互相獨立。",
      "「同色」＝「兩紅」或「兩藍」：$\\frac{C_3^2 + C_4^2}{C_7^2} = \\frac{3+6}{21} = \\frac{9}{21} = \\frac{3}{7}$。",
      "$\\frac{C_4^2 + C_6^2}{C_{10}^2} = \\frac{6+15}{45} = \\frac{21}{45} = \\frac{7}{15}$。"
    ],
    "mustKnowEn": [
      "擲一枚骰子，出現一點與出現二點互斥；擲兩枚骰子，第一枚出現一點與第二枚出現二點則互相獨立。",
      "“Same colour” = “two red” or “two blue”: $\\frac{C_3^2 + C_4^2}{C_7^2} = \\frac{3+6}{21} = \\frac{9}{21} = \\frac{3}{7}$.",
      "$\\frac{C_4^2 + C_6^2}{C_{10}^2} = \\frac{6+15}{45} = \\frac{21}{45} = \\frac{7}{15}$."
    ],
    "examTipZh": "判斷之前先問：兩事件可否同時發生。不可以便是互斥，可以則再檢查機率是否相乘成立。",
    "examTipEn": "判斷之前先問：兩事件可否同時發生。不可以便是互斥，可以則再檢查機率是否相乘成立。",
    "commonTrapZh": "把互斥當成獨立。兩個機率皆非零的互斥事件必定不獨立，因為其一發生時另一必定不發生，影響顯然存在。",
    "commonTrapEn": "When revising “Probability”, check definitions and units carefully.",
    "source": "sensei"
  },
  "functions": {
    "subjectId": "math",
    "topicId": "functions",
    "titleZh": "函數與建模",
    "titleEn": "Functions & Modelling",
    "conceptZh": "把二次函數寫成 a(x − h)² + k 之後，頂點為 (h, k)。當 a 大於零時 k 為最小值，a 小於零時 k 為最大值。",
    "conceptEn": "把二次函數寫成 a(x − h)² + k 之後，頂點為 (h, k)。當 a 大於零時 k 為最小值，a 小於零時 k 為最大值。",
    "mustKnowZh": [
      "y = x² − 6x + 5 改寫為 y = (x − 3)² − 4，可直接讀出頂點 (3, −4)，最小值為 −4，於 x = 3 時取得。",
      "配方得 $f(x) = -(x - 2)^2 + 5$，頂點在 $x = 2$，極大值 $= 5$（即頂點的 $y$ 值，非 $x$ 值）。",
      "配方得 $f(x) = (x + 1)^2 - 4$，頂點在 $x = -1$，極小值 $= -4$（即頂點的 $y$ 值，非 $x$ 值）。"
    ],
    "mustKnowEn": [
      "y = x² − 6x + 5 改寫為 y = (x − 3)² − 4，可直接讀出頂點 (3, −4)，最小值為 −4，於 x = 3 時取得。",
      "Completing the square: $f(x) = -(x - 2)^2 + 5$, vertex at $x = 2$, maximum value $= 5$ (the vertex's $y$-value, not its $x$-value).",
      "Completing the square: $f(x) = (x + 1)^2 - 4$, vertex at $x = -1$, minimum value $= -4$ (the vertex's $y$-value, not its $x$-value)."
    ],
    "examTipZh": "凡題目問最大值、最小值或對稱軸，一律先完成平方；三個問題在完成平方之後都是直接讀出來的。",
    "examTipEn": "凡題目問最大值、最小值或對稱軸，一律先完成平方；三個問題在完成平方之後都是直接讀出來的。",
    "commonTrapZh": "把 (x − 3)² 的頂點橫坐標讀成 −3。括號內是 x 減 h，故 h 等於 3，符號在此最容易看錯。",
    "commonTrapEn": "When revising “Functions & Modelling”, check definitions and units carefully.",
    "source": "sensei"
  },
  "trigonometry": {
    "subjectId": "math",
    "topicId": "trigonometry",
    "titleZh": "三角函數",
    "titleEn": "Trigonometry",
    "conceptZh": "改動發生在括號內則影響橫向且方向相反：y = f(x − h) 是向右移 h。改動在括號外則影響縱向且方向直觀：y = f(x) + k 是向上移 k。",
    "conceptEn": "改動發生在括號內則影響橫向且方向相反：y = f(x − h) 是向右移 h。改動在括號外則影響縱向且方向直觀：y = f(x) + k 是向上移 k。",
    "mustKnowZh": [
      "由 y = x² 得 y = (x − 3)²，圖像向右移三個單位；得 y = x² + 3 則向上移三個單位。兩者的移動方向不同。",
      "由 $\\sin^2\\theta + \\cos^2\\theta = 1$：$\\cos\\theta = \\sqrt{1 - \\frac{9}{25}} = \\frac{4}{5}$（銳角取正）。",
      "$\\sin\\theta = \\sqrt{1 - \\frac{25}{169}} = \\sqrt{\\frac{144}{169}} = \\frac{12}{13}$。"
    ],
    "mustKnowEn": [
      "由 y = x² 得 y = (x − 3)²，圖像向右移三個單位；得 y = x² + 3 則向上移三個單位。兩者的移動方向不同。",
      "From $\\sin^2\\theta + \\cos^2\\theta = 1$: $\\cos\\theta = \\sqrt{1 - \\frac{9}{25}} = \\frac{4}{5}$ (positive for an acute angle).",
      "$\\sin\\theta = \\sqrt{1 - \\frac{25}{169}} = \\sqrt{\\frac{144}{169}} = \\frac{12}{13}$."
    ],
    "examTipZh": "先判斷改動在括號內還是括號外，再決定橫向或縱向；括號內一律記住方向與符號相反。",
    "examTipEn": "先判斷改動在括號內還是括號外，再決定橫向或縱向；括號內一律記住方向與符號相反。",
    "commonTrapZh": "把 y = f(x − 3) 當成向左移。括號內的減號對應向右，這一點與直覺相反，是本課題最常見的錯誤。",
    "commonTrapEn": "When revising “Trigonometry”, check definitions and units carefully.",
    "source": "sensei",
    "explainerSrc": "/explainers/math-trigonometry.svg"
  },
  "statistics": {
    "subjectId": "math",
    "topicId": "statistics",
    "titleZh": "統計",
    "titleEn": "Statistics",
    "conceptZh": "標準差量度數據相對平均數的離散程度。數值大表示分佈分散，數值小表示集中，本身不含優劣判斷。",
    "conceptEn": "標準差量度數據相對平均數的離散程度。數值大表示分佈分散，數值小表示集中，本身不含優劣判斷。",
    "mustKnowZh": [
      "兩班平均分同為六十分，甲班標準差為五，乙班為二十。甲班成績集中，乙班則高低懸殊，兩班的教學需要並不相同。",
      "$\\frac{4+8+6+10+7}{5} = \\frac{35}{5} = 7$。",
      "$5$ 出現 3 次，最頻繁，故眾數為 $5$。"
    ],
    "mustKnowEn": [
      "兩班平均分同為六十分，甲班標準差為五，乙班為二十。甲班成績集中，乙班則高低懸殊，兩班的教學需要並不相同。",
      "$\\frac{4+8+6+10+7}{5} = \\frac{35}{5} = 7$.",
      "$5$ appears three times (most frequent), so the mode is $5$."
    ],
    "examTipZh": "比較兩組數據時必須同時提及平均數與標準差；只講其中一項，無法說明兩組分佈的差異。",
    "examTipEn": "比較兩組數據時必須同時提及平均數與標準差；只講其中一項，無法說明兩組分佈的差異。",
    "commonTrapZh": "把標準差小理解為成績好。標準差只講分散程度，一班全部不及格亦可以有很小的標準差。",
    "commonTrapEn": "When revising “Statistics”, check definitions and units carefully.",
    "source": "sensei"
  },
  "logarithms": {
    "subjectId": "math",
    "topicId": "logarithms",
    "titleZh": "對數與指數",
    "titleEn": "Logarithms & Exponents",
    "conceptZh": "對數把乘除轉為加減：log(ab) = log a + log b，log(a/b) = log a − log b，log(aⁿ) = n log a。加法與減法本身不能拆開。",
    "conceptEn": "對數把乘除轉為加減：log(ab) = log a + log b，log(a/b) = log a − log b，log(aⁿ) = n log a。加法與減法本身不能拆開。",
    "mustKnowZh": [
      "log(a + b) 不等於 log a + log b；(log a)/(log b) 不等於 log(a/b)；(log a)ⁿ 不等於 n log a。三者都是常見的誤寫。",
      "$2^3 = 8$，故 $\\log_2 8 = 3$。",
      "$10^3 = 1000$，故值為 $3$。"
    ],
    "mustKnowEn": [
      "log(a + b) 不等於 log a + log b；(log a)/(log b) 不等於 log(a/b)；(log a)ⁿ 不等於 n log a。三者都是常見的誤寫。",
      "$2^3 = 8$, so $\\log_2 8 = 3$.",
      "$10^3 = 1000$, so the value is $3$."
    ],
    "examTipZh": "每次動用定律前，先確認括號內是乘、除還是次方。是加減便不能拆，只能先計出括號內的值。",
    "examTipEn": "每次動用定律前，先確認括號內是乘、除還是次方。是加減便不能拆，只能先計出括號內的值。",
    "commonTrapZh": "把 log a − log b 與 (log a)/(log b) 混用。前者等於 log(a/b)，後者是換底公式的形式，兩者意義完全不同。",
    "commonTrapEn": "$2$ is just the base.",
    "source": "sensei"
  },
  "sequences": {
    "subjectId": "math",
    "topicId": "sequences",
    "titleZh": "數列",
    "titleEn": "Sequences",
    "conceptZh": "$a_n = a + (n-1)d = 3 + 9\\times4 = 39$。",
    "conceptEn": "$a_n = a + (n-1)d = 3 + 9\\times4 = 39$.",
    "mustKnowZh": [
      "$a_n = a + (n-1)d = 3 + 9\\times4 = 39$。",
      "$a_n = a + (n-1)d = 7 + 8\\times-2 = -9$。",
      "$a_n = a + (n-1)d = -4 + 6\\times6 = 32$。",
      "$a_n = a\\,r^{n-1} = 2\\times3^{3} = 54$。"
    ],
    "mustKnowEn": [
      "$a_n = a + (n-1)d = 3 + 9\\times4 = 39$.",
      "$a_n = a + (n-1)d = 7 + 8\\times-2 = -9$.",
      "$a_n = a + (n-1)d = -4 + 6\\times6 = 32$.",
      "$a_n = a\\,r^{n-1} = 2\\times3^{3} = 54$."
    ],
    "examTipZh": "DSE 作答「數列」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Sequences”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$9$ 誤用了 $n - 1$（等差數列的首項公式 $a + (n-1)d$ 中的 $n-1$ 屬於公差項，不可套到通項上）；$10$ 漏了常數項；$7$ 把係數與常數項對調。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "percentage": {
    "subjectId": "math",
    "topicId": "percentage",
    "titleZh": "百分數與利率",
    "titleEn": "Percentages & Interest",
    "conceptZh": "累積頻數曲線的縱軸是累積至該點的數據數目。要讀中位數便在總數一半的位置橫向切入，再向下讀出對應數值。",
    "conceptEn": "累積頻數曲線的縱軸是累積至該點的數據數目。要讀中位數便在總數一半的位置橫向切入，再向下讀出對應數值。",
    "mustKnowZh": [
      "四十個數據的累積頻數曲線，中位數在縱軸二十處讀出；下四分位數在十處，上四分位數在三十處。",
      "售價 $= 200 \\times (1 + 20\\%) = 200 \\times 1.",
      "單利 $I = \\frac{P\\,r\\,t}{100} = \\frac{1000\\times5\\times3}{100} = 150$。"
    ],
    "mustKnowEn": [
      "四十個數據的累積頻數曲線，中位數在縱軸二十處讀出；下四分位數在十處，上四分位數在三十處。",
      "Selling price $= 200 \\times (1 + 20\\%) = 200 \\times 1.",
      "Simple interest $I = \\frac{P\\,r\\,t}{100} = \\frac{1000\\times5\\times3}{100} = 150$."
    ],
    "examTipZh": "先在縱軸算好要用的位置並標記，再一次過讀出三個四分位數，比逐個重新計算省時而且不易出錯。",
    "examTipEn": "先在縱軸算好要用的位置並標記，再一次過讀出三個四分位數，比逐個重新計算省時而且不易出錯。",
    "commonTrapZh": "把累積頻數當作頻數來讀。累積頻數曲線必定不下降，若讀出「某組頻數」需要相鄰兩點相減。",
    "commonTrapEn": "$\\$190$ decreases instead.",
    "source": "sensei"
  },
  "coordinate_geometry": {
    "subjectId": "math",
    "topicId": "coordinate_geometry",
    "titleZh": "坐標幾何",
    "titleEn": "Coordinate Geometry",
    "conceptZh": "距離 $= \\sqrt{(3-0)^2 + (4-0)^2} = \\sqrt{25} = 5$。",
    "conceptEn": "Distance $= \\sqrt{(3-0)^2 + (4-0)^2} = \\sqrt{25} = 5$.",
    "mustKnowZh": [
      "距離 $= \\sqrt{(3-0)^2 + (4-0)^2} = \\sqrt{25} = 5$。",
      "距離 $= \\sqrt{(2-(-1))^2 + (3-(-1))^2} = \\sqrt{25} = 5$。",
      "中點 $= (\\frac{2+6}{2}, \\frac{4+8}{2}) = (4, 6)$。",
      "中點 $= (\\frac{-2+4}{2}, \\frac{3+7}{2}) = (1, 5)$。"
    ],
    "mustKnowEn": [
      "Distance $= \\sqrt{(3-0)^2 + (4-0)^2} = \\sqrt{25} = 5$.",
      "Distance $= \\sqrt{(2-(-1))^2 + (3-(-1))^2} = \\sqrt{25} = 5$.",
      "Midpoint $= (\\frac{2+6}{2}, \\frac{4+8}{2}) = (4, 6)$.",
      "Midpoint $= (\\frac{-2+4}{2}, \\frac{3+7}{2}) = (1, 5)$."
    ],
    "examTipZh": "DSE 作答「坐標幾何」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Coordinate Geometry”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$\\frac{1}{3}$ 把分子分母倒轉（用了 $x$ 的變化除以 $y$ 的變化）；$6$ 只算了 $y$ 的變化，漏了除以 $x$ 的變化；$-3$ 符號弄錯。",
    "commonTrapEn": "$25$ forgets the square root.",
    "source": "generated"
  },
  "inequalities": {
    "subjectId": "math",
    "topicId": "inequalities",
    "titleZh": "不等式",
    "titleEn": "Inequalities",
    "conceptZh": "解二次不等式應先求出對應方程的根，再按開口方向判斷函數值在哪些區間為正或為負，而非死記符號規則。",
    "conceptEn": "解二次不等式應先求出對應方程的根，再按開口方向判斷函數值在哪些區間為正或為負，而非死記符號規則。",
    "mustKnowZh": [
      "x² − x − 6 > 0 的根為 −2 與 3，開口向上，函數值在兩根之外為正，故解為 x < −2 或 x > 3。",
      "移項得 $x > 3$。",
      "移項得 $2x > 8$，兩邊除以正數 $2$，不等號方向不變，$x > 4$。"
    ],
    "mustKnowEn": [
      "x² − x − 6 > 0 的根為 −2 與 3，開口向上，函數值在兩根之外為正，故解為 x < −2 或 x > 3。",
      "Moving the constant across gives $x > 3$.",
      "Rearranging, $2x > 8$; dividing by the positive number $2$ keeps the sign, so $x > 4$."
    ],
    "examTipZh": "在草稿畫一條粗略的拋物線並標出兩根，再看題目要求高於還是低於橫軸，直接讀出區間，比背規則穩妥。",
    "examTipEn": "在草稿畫一條粗略的拋物線並標出兩根，再看題目要求高於還是低於橫軸，直接讀出區間，比背規則穩妥。",
    "commonTrapZh": "把「兩根之外」與「兩根之間」調轉，或在開口向下時仍沿用開口向上的結論。開口方向必須先確定。",
    "commonTrapEn": "$-3$ changes sign when moved, so it is not $x > -3$.",
    "source": "sensei"
  },
  "circles": {
    "subjectId": "math",
    "topicId": "circles",
    "titleZh": "圓的幾何特性",
    "titleEn": "Properties of Circles",
    "conceptZh": "【標準證明 Marking Scheme】切線垂直於過切點的半徑，故 $\\angle OAP=\\angle OBP=90^\\circ$。",
    "conceptEn": "【Marking Scheme】Tangent $\\perp$ radius at contact, so $\\angle OAP=\\angle OBP=90^\\circ$.",
    "mustKnowZh": [
      "【標準證明 Marking Scheme】切線垂直於過切點的半徑，故 $\\angle OAP=\\angle OBP=90^\\circ$。",
      "【標準證明 Marking Scheme】由圓心向弦作垂線，垂足平分該弦（垂直於弦的直徑平分弦），故半弦長 $=\\tfrac{16}{2}=8$。",
      "【標準證明 Marking Scheme】$\\triangle ABD$ 中 $AB=AD$，故底角相等：$\\angle ADB=\\angle ABD=50^\\circ$。",
      "配方求圓心半徑：$C$ 的圓心 $(2,-1)$、半徑 $3$。"
    ],
    "mustKnowEn": [
      "【Marking Scheme】Tangent $\\perp$ radius at contact, so $\\angle OAP=\\angle OBP=90^\\circ$.",
      "【Marking Scheme】The perpendicular from the centre bisects the chord, so the half-chord $=\\tfrac{16}{2}=8$.",
      "【Marking Scheme】In $\\triangle ABD$, $AB=AD$ so base angles are equal: $\\angle ADB=\\angle ABD=50^\\circ$.",
      "Complete the square: centre $(2,-1)$, radius $3$."
    ],
    "examTipZh": "DSE 作答「圓的幾何特性」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Properties of Circles”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$130^\\circ$ 是圓心角本身（漏除以 $2$）；$25^\\circ$ 是 $\\tfrac{1}{2}\\angle APB$；$50^\\circ$ 直接抄題目。",
    "commonTrapEn": "$-5 \\pm 3$ drops the $\\sqrt{5}$.",
    "source": "generated"
  },
  "trig_3d": {
    "subjectId": "math",
    "topicId": "trig_3d",
    "titleZh": "三維三角學",
    "titleEn": "3D Trigonometry",
    "conceptZh": "【標準證明 Marking Scheme】$G$ 在底面的投影為 $C$，故 $AG$ 與底面的夾角即 $\\angle GAC$。",
    "conceptEn": "【Marking Scheme】The projection of $G$ on the base is $C$, so the required angle is $\\angle GAC$.",
    "mustKnowZh": [
      "【標準證明 Marking Scheme】$G$ 在底面的投影為 $C$，故 $AG$ 與底面的夾角即 $\\angle GAC$。",
      "【標準證明 Marking Scheme】設 $M$ 為一底邊的中點。",
      "底面對角線一半 $= \\dfrac{6\\sqrt2}{2} = 4.",
      "空間對角線須把畢氏定理用兩次：先求底面對角線 $\\sqrt{1^2 + 2^2}$，再與高組成第二個直角三角形，得 $\\sqrt{1^2 + 2^2 + 2^2} = \\sqrt{9} = 3$。"
    ],
    "mustKnowEn": [
      "【Marking Scheme】The projection of $G$ on the base is $C$, so the required angle is $\\angle GAC$.",
      "【Marking Scheme】Let $M$ be the midpoint of a base edge.",
      "Half-diagonal $= \\dfrac{6\\sqrt2}{2} \\approx 4.",
      "A space diagonal needs Pythagoras twice: first the base diagonal $\\sqrt{1^2 + 2^2}$, then that together with the height in a second right-angled triangle, giving $\\sqrt{1^2 + 2^2 …"
    ],
    "examTipZh": "DSE 作答「三維三角學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “3D Trigonometry”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$51^\\circ=\\tan^{-1}\\!\\frac{10}{8}$ 誤用「邊長 $8$」作鄰邊；$39^\\circ=\\tan^{-1}\\!\\frac{8}{10}$ 把對邊鄰邊倒轉；$50^\\circ$ 是胡亂約整。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated",
    "explainerSrc": "/explainers/math-trigonometry.svg"
  },
  "permutation_combination": {
    "subjectId": "math",
    "topicId": "permutation_combination",
    "titleZh": "排列與組合",
    "titleEn": "Permutations & Combinations",
    "conceptZh": "【標準證明 Marking Scheme】先排 $4$ 名男生：$4!",
    "conceptEn": "【Marking Scheme】Arrange the $4$ boys: $4!",
    "mustKnowZh": [
      "【標準證明 Marking Scheme】先排 $4$ 名男生：$4!",
      "【標準證明 Marking Scheme】用「補集」最快。",
      "【標準證明 Marking Scheme】把 $3$ 名女生「綑綁」成一個整體，與 $4$ 名男生合共 $5$ 個單位排列：$$5!",
      "三數之和為奇 ⇔ 奇數個數為奇 ⇒ 「3 奇」或「1 奇 2 偶」。"
    ],
    "mustKnowEn": [
      "【Marking Scheme】Arrange the $4$ boys: $4!",
      "【Marking Scheme】Use the complement.",
      "【Marking Scheme】Bind the $3$ girls into one block; with the $4$ boys that is $5$ units: $$5!",
      "Sum odd ⇔ an odd number of odds ⇒ 3-odd or 1-odd-2-even."
    ],
    "examTipZh": "DSE 作答「排列與組合」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Permutations & Combinations”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$5040=7!$ 是「忽略限制」；$720=6!$ 或 $144=4!\\times6$ 是「分組方法用錯」。",
    "commonTrapEn": "using the unconditional total 84 ignores \"sum is odd\".",
    "source": "generated"
  },
  "locus": {
    "subjectId": "math",
    "topicId": "locus",
    "titleZh": "軌跡與坐標",
    "titleEn": "Locus & Coordinates",
    "conceptZh": "【標準證明 Marking Scheme】與兩定點等距的軌跡是線段 $AB$ 的垂直平分線。",
    "conceptEn": "【Marking Scheme】The locus equidistant from two points is the perpendicular bisector of $AB$.",
    "mustKnowZh": [
      "【標準證明 Marking Scheme】與兩定點等距的軌跡是線段 $AB$ 的垂直平分線。",
      "【標準證明 Marking Scheme】設 $P=(x,y)$。",
      "$PA=2PB ⇒ PA^2=4PB^2$：$x^2+y^2 = 4[(x - 6)^2+y^2]$。",
      "$PA=2PB ⇒ PA^2=4PB^2$：$x^2+y^2 = 4[x^2+(y - 6)^2]$。"
    ],
    "mustKnowEn": [
      "【Marking Scheme】The locus equidistant from two points is the perpendicular bisector of $AB$.",
      "【Marking Scheme】Let $P=(x,y)$.",
      "$PA=2PB ⇒ PA^2=4PB^2$.",
      "The midpoint is the average of the two points: $\\left(\\frac{1 + 5}{2},\\ \\frac{1 + 7}{2}\\right) = (3,\\ 4)$."
    ],
    "examTipZh": "DSE 作答「軌跡與坐標」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Locus & Coordinates”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$y=x+1$ 正是直線 $AB$ 本身（忘了取垂直）；$x+y-1=0$ 用錯中點/符號；$x+y+7=0$ 是常數項符號錯。",
    "commonTrapEn": "using $PA=PB$ gives the perpendicular bisector (a straight line), which is wrong.",
    "source": "generated"
  },
  "polygons": {
    "subjectId": "math",
    "topicId": "polygons",
    "titleZh": "多邊形與角",
    "titleEn": "Polygons & Angles",
    "conceptZh": "多邊形外角和恆為 $360^\\circ$，每個外角 $=\\frac{360^\\circ}{10}=36^\\circ$。",
    "conceptEn": "The exterior angles of a polygon always sum to $360^\\circ$, so each exterior angle $=\\frac{360^\\circ}{10}=36^\\circ$.",
    "mustKnowZh": [
      "多邊形外角和恆為 $360^\\circ$，每個外角 $=\\frac{360^\\circ}{10}=36^\\circ$。",
      "內角和公式為 $(n-2) \\times 180^\\circ$。",
      "每隻內角 $= 180^\\circ -$ 每隻外角 $= 180 - 120 = 60^\\circ$；亦可用 $(n-2)\\times 180 \\div n = 180 \\div 3 = 60^\\circ$，兩條路徑必須一致。",
      "正多邊形各外角相等，外角和恆為 $360^\\circ$，故每隻外角 $= 360 \\div 5 = 72^\\circ$。"
    ],
    "mustKnowEn": [
      "The exterior angles of a polygon always sum to $360^\\circ$, so each exterior angle $=\\frac{360^\\circ}{10}=36^\\circ$.",
      "The interior angle sum is $(n-2) \\times 180^\\circ$.",
      "Each interior angle is $180^\\circ$ minus each exterior angle $= 180 - 120 = 60^\\circ$; equivalently $(n-2)\\times 180 \\div n = 180 \\div 3 = 60^\\circ$, and the two routes must agree.",
      "A regular polygon has equal exterior angles summing to $360^\\circ$, so each is $360 \\div 5 = 72^\\circ$."
    ],
    "examTipZh": "DSE 作答「多邊形與角」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Polygons & Angles”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$900^\\circ$ 漏減 2；$720^\\circ$ 只減 1；$360^\\circ$ 是外角和，與邊數無關。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "similar_solids": {
    "subjectId": "math",
    "topicId": "similar_solids",
    "titleZh": "相似形與相似立體",
    "titleEn": "Similar Figures & Solids",
    "conceptZh": "邊長比 $=\\sqrt{16}:\\sqrt{25}=4:5$，體積比為邊長比的立方 $=4^3:5^3=64:125$。",
    "conceptEn": "The ratio of lengths $=\\sqrt{16}:\\sqrt{25}=4:5$, and the ratio of volumes is the cube of the ratio of lengths $=4^3:5^3=64:125$.",
    "mustKnowZh": [
      "邊長比 $=\\sqrt{16}:\\sqrt{25}=4:5$，體積比為邊長比的立方 $=4^3:5^3=64:125$。",
      "相似立體的面積比等於長度比的平方：$1^2 : 2^2 = 1 : 4$。",
      "相似立體的體積比等於長度比的立方：$1^3 : 2^3 = 1 : 8$。",
      "相似立體只有三條比：長度 $k$、面積 $k^{2}$、體積 $k^{3}$。"
    ],
    "mustKnowEn": [
      "The ratio of lengths $=\\sqrt{16}:\\sqrt{25}=4:5$, and the ratio of volumes is the cube of the ratio of lengths $=4^3:5^3=64:125$.",
      "Areas of similar solids are in the square of the length ratio: $1^2 : 2^2 = 1 : 4$.",
      "Volumes of similar solids are in the cube of the length ratio: $1^3 : 2^3 = 1 : 8$.",
      "Similar solids involve only three ratios: length $k$, area $k^{2}$ and volume $k^{3}$."
    ],
    "examTipZh": "DSE 作答「相似形與相似立體」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Similar Figures & Solids”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$1 : 2$ 直接用長度比；$1 : 8$ 用了立方（那是體積比）；$2 : 4$ 誤把「平方」當成乘 2。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "variation": {
    "subjectId": "math",
    "topicId": "variation",
    "titleZh": "變分",
    "titleEn": "Variation",
    "conceptZh": "正比即 $y = kx$。",
    "conceptEn": "Direct variation means $y = kx$.",
    "mustKnowZh": [
      "正比即 $y = kx$。",
      "反比即 $xy = k$（乘積不變）。",
      "(c) 是本題的分水嶺。",
      "設 $z = \\dfrac{k}{w}$。"
    ],
    "mustKnowEn": [
      "Direct variation means $y = kx$.",
      "Inverse variation means $xy = k$, a constant product.",
      "Part (c) separates the candidates.",
      "Let $y = kx$."
    ],
    "examTipZh": "DSE 作答「變分」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Variation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$6$ 誤當成加法關係；$16$ 漏了先求 $k$；$2$ 用了反比。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "approximation": {
    "subjectId": "math",
    "topicId": "approximation",
    "titleZh": "近似與誤差",
    "titleEn": "Approximation & Error",
    "conceptZh": "有效數字由左邊第一個非零數字起計，即由 5 起：5、0、6 為頭三位。",
    "conceptEn": "Significant figures are counted from the first non-zero digit on the left, that is from 5: the first three are 5, 0 and 6.",
    "mustKnowZh": [
      "有效數字由左邊第一個非零數字起計，即由 5 起：5、0、6 為頭三位。",
      "準確至最接近 $1$ cm，表示真值與量得值相差不超過半個單位，即 $1 \\div 2 = 0.",
      "準確至最接近 $2$ cm，表示真值與量得值相差不超過半個單位，即 $2 \\div 2 = 1$ cm。",
      "百分誤差 $=$ 絕對誤差 $\\div$ 真值 $\\times 100\\%$。"
    ],
    "mustKnowEn": [
      "Significant figures are counted from the first non-zero digit on the left, that is from 5: the first three are 5, 0 and 6.",
      "Correct to the nearest $1$ cm means the true value differs by at most half a unit, that is $1 \\div 2 = 0.",
      "Correct to the nearest $2$ cm means the true value differs by at most half a unit, that is $2 \\div 2 = 1$ cm.",
      "Percentage error is absolute error ÷ true value × 100%."
    ],
    "examTipZh": "DSE 作答「近似與誤差」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Approximation & Error”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$21$ cm 加了整個單位；$19.5$ cm 是下限；$20$ cm 是量得值本身。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "number_systems": {
    "subjectId": "math",
    "topicId": "number_systems",
    "titleZh": "數系",
    "titleEn": "Number Systems",
    "conceptZh": "$\\frac{22}{7}$ 是分數（有理數）；$1.",
    "conceptEn": "$\\frac{22}{7}$ is a fraction (rational); $1.",
    "mustKnowZh": [
      "$\\frac{22}{7}$ 是分數（有理數）；$1.",
      "把根號內的數分解出完全平方因子：$12 = 4 \\times 3$，而 $\\sqrt{4} = 2$，故 $\\sqrt{12} = 2\\sqrt{3}$。",
      "$\\sqrt{16} = 4$，可寫成兩個整數之比，故為有理數。",
      "$50 = 25 \\times 2$，而 $25$ 為完全平方數，故 $\\sqrt{50} = \\sqrt{25} \\times \\sqrt{2} = 5\\sqrt{2}$。"
    ],
    "mustKnowEn": [
      "$\\frac{22}{7}$ is a fraction (rational); $1.",
      "Extract the perfect-square factor: $12 = 4 \\times 3$ and $\\sqrt{4} = 2$, so $\\sqrt{12} = 2\\sqrt{3}$.",
      "$\\sqrt{16} = 4$, which can be written as a ratio of two integers, so it is rational.",
      "Since $50 = 25 \\times 2$ and $25$ is a perfect square, $\\sqrt{50} = \\sqrt{25} \\times \\sqrt{2} = 5\\sqrt{2}$."
    ],
    "examTipZh": "DSE 作答「數系」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Number Systems”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$4\\sqrt{3}$ 把 $4$ 整個搬出根號而未開方；$2\\sqrt{6}$ 只抽走一個 $2$；$3\\sqrt{2}$ 把兩個因子的角色調轉。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "indices": {
    "subjectId": "math",
    "topicId": "indices",
    "titleZh": "指數定律",
    "titleEn": "Laws of Indices",
    "conceptZh": "對數把乘除轉為加減：log(ab) = log a + log b，log(a/b) = log a − log b，log(aⁿ) = n log a。加法與減法本身不能拆開。",
    "conceptEn": "對數把乘除轉為加減：log(ab) = log a + log b，log(a/b) = log a − log b，log(aⁿ) = n log a。加法與減法本身不能拆開。",
    "mustKnowZh": [
      "log(a + b) 不等於 log a + log b；(log a)/(log b) 不等於 log(a/b)；(log a)ⁿ 不等於 n log a。三者都是常見的誤寫。",
      "兩式相乘：$(2^x 3^x)(2^y 3^y)=108\\times 72=7776$，即 $6^{x+y}=6^5$，故 $x+y=5$。",
      "同底數相乘，指數相加：$x^{2} \\cdot x^{3} = x^{2+3} = x^{5}$。"
    ],
    "mustKnowEn": [
      "log(a + b) 不等於 log a + log b；(log a)/(log b) 不等於 log(a/b)；(log a)ⁿ 不等於 n log a。三者都是常見的誤寫。",
      "Multiplying the two equations: $(2^x 3^x)(2^y 3^y)=108\\times 72=7776$, that is $6^{x+y}=6^5$, so $x+y=5$.",
      "Same base multiplied ⇒ add exponents: $x^{5}$."
    ],
    "examTipZh": "每次動用定律前，先確認括號內是乘、除還是次方。是加減便不能拆，只能先計出括號內的值。",
    "examTipEn": "每次動用定律前，先確認括號內是乘、除還是次方。是加減便不能拆，只能先計出括號內的值。",
    "commonTrapZh": "把 log a − log b 與 (log a)/(log b) 混用。前者等於 log(a/b)，後者是換底公式的形式，兩者意義完全不同。",
    "commonTrapEn": "$x^{6}$ multiplies the exponents.",
    "source": "sensei"
  },
  "linear_functions": {
    "subjectId": "math",
    "topicId": "linear_functions",
    "titleZh": "一次函數",
    "titleEn": "Linear Functions",
    "conceptZh": "改動發生在括號內則影響橫向且方向相反：y = f(x − h) 是向右移 h。改動在括號外則影響縱向且方向直觀：y = f(x) + k 是向上移 k。",
    "conceptEn": "改動發生在括號內則影響橫向且方向相反：y = f(x − h) 是向右移 h。改動在括號外則影響縱向且方向直觀：y = f(x) + k 是向上移 k。",
    "mustKnowZh": [
      "由 y = x² 得 y = (x − 3)²，圖像向右移三個單位；得 y = x² + 3 則向上移三個單位。兩者的移動方向不同。",
      "代入 $x=2$：$f(2) = 2(2) + 1 = 4 + 1 = 5$。"
    ],
    "mustKnowEn": [
      "由 y = x² 得 y = (x − 3)²，圖像向右移三個單位；得 y = x² + 3 則向上移三個單位。兩者的移動方向不同。",
      "Substitute $x=2$: $2(2)+1=5$."
    ],
    "examTipZh": "先判斷改動在括號內還是括號外，再決定橫向或縱向；括號內一律記住方向與符號相反。",
    "examTipEn": "先判斷改動在括號內還是括號外，再決定橫向或縱向；括號內一律記住方向與符號相反。",
    "commonTrapZh": "把 y = f(x − 3) 當成向左移。括號內的減號對應向右，這一點與直覺相反，是本課題最常見的錯誤。",
    "commonTrapEn": "When revising “Linear Functions”, check definitions and units carefully.",
    "source": "sensei"
  },
  "factors_multiples": {
    "subjectId": "math",
    "topicId": "factors_multiples",
    "titleZh": "因數與倍數",
    "titleEn": "Factors & Multiples",
    "conceptZh": "$12 = 6 \\times 2$、$18 = 6 \\times 3$，公有最大因數為 $6$。",
    "conceptEn": "$12$ and $18$ share the largest factor $6$.",
    "mustKnowZh": [
      "$12 = 6 \\times 2$、$18 = 6 \\times 3$，公有最大因數為 $6$。",
      "把兩數作質因數分解，取【共有】質因數的【較低】次方相乘：$16$ 與 $40$ 的最大公因數為 $8$。",
      "最小公倍數取【全部】質因數的【較高】次方相乘，亦可用 $\\dfrac{4 \\times 6}{\\text{HCF}} = \\dfrac{24}{2} = 12$。",
      "正因數個數等於各質因數指數【各加一】之後相乘：$(2+1)(3+1) = 12$。"
    ],
    "mustKnowEn": [
      "$12$ and $18$ share the largest factor $6$.",
      "Factorise both numbers into primes and multiply the COMMON primes taken to the LOWER power: the highest common factor of $16$ and $40$ is $8$.",
      "The lowest common multiple multiplies ALL primes taken to the HIGHER power, or equivalently $\\frac{4 \\times 6}{\\text{HCF}} = \\frac{24}{2} = 12$.",
      "The number of positive factors is the product of (each exponent + 1): $(2+1)(3+1) = 12$."
    ],
    "examTipZh": "DSE 作答「因數與倍數」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Factors & Multiples”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$36$ 是最小公倍數 (L.C.M.)，不可混淆。",
    "commonTrapEn": "$36$ is the L.C.M., not the H.C.F.",
    "source": "generated"
  },
  "arithmetic_sequence": {
    "subjectId": "math",
    "topicId": "arithmetic_sequence",
    "titleZh": "等差數列",
    "titleEn": "Arithmetic Sequences",
    "conceptZh": "$T_{10}=S_{10}-S_{9}=(100+40)-(81+36)=140-117=23$。",
    "conceptEn": "$T_{10}=S_{10}-S_{9}=(100+40)-(81+36)=140-117=23$.",
    "mustKnowZh": [
      "$T_{10}=S_{10}-S_{9}=(100+40)-(81+36)=140-117=23$。",
      "$T_n = a + (n-1)d = 1 + (6-1)\\times2 = 1 + 10 = 11$。",
      "(c) 是卷一常見的「求最小 $n$」題型。",
      "本題考核等差數列通項與求和公式的基本運用。"
    ],
    "mustKnowEn": [
      "$T_{10}=S_{10}-S_{9}=(100+40)-(81+36)=140-117=23$.",
      "$T_n = a+(n-1)d = 11$.",
      "Part (c) is the familiar \"find the least $n$\" type in Paper 1."
    ],
    "examTipZh": "DSE 作答「等差數列」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Arithmetic Sequences”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$13$ 用了 $n$ 而非 $n-1$（off-by-one）。",
    "commonTrapEn": "$13$ uses $n$ instead of $n-1$.",
    "source": "generated"
  },
  "geometric_sequence": {
    "subjectId": "math",
    "topicId": "geometric_sequence",
    "titleZh": "等比數列",
    "titleEn": "Geometric Sequences",
    "conceptZh": "$T_n = a r^{\\,n-1} = 1\\times 2^{4} = 1\\times 16 = 16$。",
    "conceptEn": "$T_n = a r^{n-1} = 16$.",
    "mustKnowZh": [
      "$T_n = a r^{\\,n-1} = 1\\times 2^{4} = 1\\times 16 = 16$。",
      "$|r| = \\dfrac{1}{3} < 1$，$S_\\infty = \\dfrac{a}{1-r} = \\dfrac{2}{1 - \\frac{1}{3}} = \\dfrac{2}{\\frac{2}{3}} = 3$。",
      "$|r| = \\dfrac{1}{4} < 1$，$S_\\infty = \\dfrac{a}{1-r} = \\dfrac{2}{1 - \\frac{1}{4}} = \\dfrac{2}{\\frac{3}{4}} = \\frac{8}{3}$。",
      "(c) 與第 10 題的「求最小 $n$」同屬一類，同樣必須驗證兩端：$n=10$ 不成立、$n=11$ 成立。"
    ],
    "mustKnowEn": [
      "$T_n = a r^{n-1} = 16$.",
      "$S_\\infty = \\frac{a}{1-r} = 3$.",
      "$S_\\infty = \\frac{a}{1-r} = \\frac{8}{3}$.",
      "Part (c) belongs to the same \"least $n$\" family as question 10, and again both ends must be verified: $n=10$ fails and $n=11$ succeeds."
    ],
    "examTipZh": "DSE 作答「等比數列」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Geometric Sequences”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$32$ 用了 $r^{n}$（漏減一）。",
    "commonTrapEn": "$32$ uses $r^{n}$.",
    "source": "generated"
  },
  "polynomials": {
    "subjectId": "math",
    "topicId": "polynomials",
    "titleZh": "餘式與因式定理",
    "titleEn": "Remainder & Factor Theorem",
    "conceptZh": "多項式 f(x) 除以 (x − a) 的餘式為 f(a)，此為餘式定理；當 f(a) 等於零時 (x − a) 為 f(x) 的因式，此為因式定理，即餘式定理的特例。",
    "conceptEn": "多項式 f(x) 除以 (x − a) 的餘式為 f(a)，此為餘式定理；當 f(a) 等於零時 (x − a) 為 f(x) 的因式，此為因式定理，即餘式定理的特例。",
    "mustKnowZh": [
      "f(x) = x³ − 2x² − 5x + 6，代入 f(1) = 0，故 (x − 1) 是因式，其後可用長除法或比較係數求出其餘因式。",
      "$2x^2+5x-12=(2x-3)(x+4)$，故 $(2x-3)$ 是其因式。",
      "餘式定理：餘數 $= f(1) = 1^2 - 3(1) + 1 = 1 - 3 + 1 = -1$。"
    ],
    "mustKnowEn": [
      "f(x) = x³ − 2x² − 5x + 6，代入 f(1) = 0，故 (x − 1) 是因式，其後可用長除法或比較係數求出其餘因式。",
      "$2x^2+5x-12=(2x-3)(x+4)$, so $(2x-3)$ is a factor.",
      "Remainder theorem: remainder $= f(1) = -1$."
    ],
    "examTipZh": "找因式時由 c 的因數逐個試代，通常在頭數個之內命中；命中一個之後立即降次，餘下的用二次方程處理。",
    "examTipEn": "找因式時由 c 的因數逐個試代，通常在頭數個之內命中；命中一個之後立即降次，餘下的用二次方程處理。",
    "commonTrapZh": "除以 (x + 2) 時代入 x = 2。應代入使括號為零的值，即 x = −2，符號錯誤會令整題方向偏離。",
    "commonTrapEn": "$5$ substitutes $x=-1$.",
    "source": "sensei"
  }
}
