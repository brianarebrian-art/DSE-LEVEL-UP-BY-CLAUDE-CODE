// ============================================================================
// math-median-b1.mts —— 數學：11 個未達中位數嘅課題，補至中位數 44
// ----------------------------------------------------------------------------
// 2026-09-05 Brian 裁決：先把現有課題補到【該科中位數】，新課題第二輪先做。
// 數學 1539 條 / 25 課題，中位數 44（平均數 61.6 —— 兩者差咁遠係因為
// 「二次方程」283 條、「等差數列」142 條把平均數扯高咗，所以中位數先係
// 一個講得通嘅「追平」目標）。
//
// 缺口（跑 npx tsx scripts/qbank/builders/_gap.mts 可重算）：
//   因數與倍數 32→12 · 統計 34→10 · 相似形 34→10 · 不等式 35→9
//   排列組合 35→9 · 數系 36→8 · 等比數列 37→7 · 概率 38→6
//   圓的幾何 40→4 · 三維三角 40→4 · 對數 43→1        合共 80 條
//
// 難度 24 / 40 / 16 = 3 : 5 : 2（憲章 §12）。
//
// ── 點解每個原型都刻意換咗問法，而唔係換數字 ──────────────────────────────
// _archetype.mts 講得好清楚：「把同一條題嘅數字隨機化，生成一百條，句子骨架
// 仍然完全相同」。呢 11 個課題現有嘅題目正正就係咁 —— 不等式 29 條入面幾乎
// 全部係「解不等式 $ax + b > 0$」，等比數列 37 條全部係「首項為 #、公比為 #，
// 求第 # 項」。再照嗰個骨架寫 80 條，課題數字會夠，但學生見到嘅仍然係同一條題。
// 所以每個原型都由【問法】入手：問嘅嘢、畀嘅嘢、答嘅嘢至少有一樣同現有嗰批唔同。
//
// ⚠️ 解析【唔會】寫計數機 program 步驟。
// 憲章 §5 要求數學科附 Casio fx-50FH II／3650P 教學，但本項目嘅實作係
// data/calcTips.ts 嘅獨立貼士卡，唔係寫入解析 —— 而嗰啲卡有一條學術生死線：
// 「每張卡必須由真人喺實體計數機逐步撳過…先可以將 verified 改做 true」。
// 機器寫一段冇人撳過嘅按鍵步驟入解析，就係一段冇人驗證過嘅指示扮成已驗證，
// 同 §16.C／§16.D 係同一個病。要補計數機教學，去 calcTips.ts 加卡再真人驗證。
//
//   npx tsx scripts/qbank/builders/math-median-b1.mts
// ============================================================================
import { emit, type Arch, type Inst } from './_archetype.mts'

const OUT = 'scripts/qbank/drafts/math-median-b1.json'

/** 分數化簡顯示 —— 干擾項要係「一個具名嘅錯」，唔可以係未化簡嘅同一個數。 */
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a))
const frac = (n: number, d: number): string => {
  const g = gcd(n, d) || 1
  const [N, D] = [n / g, d / g]
  return D === 1 ? `$${N}$` : `$\\dfrac{${N}}{${D}}$`
}

const archs: Arch[] = [

  // ── 因數與倍數 12 條（basic 6 ＋ intermediate 6）─────────────────────────
  // 現有 32 條集中喺「求 HCF／LCM 本身」。呢兩個原型改為【由質因數分解反推】
  // 同【用 HCF×LCM＝兩數之積 反推另一數】，兩者都係考評局常見嘅逆向問法。
  {
    key: 'fm_divisor_count', topic: 'factors_multiples',
    topicZh: '因數與倍數', topicEn: 'Factors & Multiples',
    diff: 'basic', n: 6,
    gen: (i): Inst => {
      // 正因數個數 = 各質因數指數加一之積。錯法：忘記「加一」、把乘變加。
      const P: [number, number][] = [[2, 3], [4, 1], [3, 4], [3, 3], [5, 2], [1, 6]]
      const [a, b] = P[i]
      const ans = (a + 1) * (b + 1)
      return {
        q: [
          `設 $N = 2^{${a}} \\times 3^{${b}}$。$N$ 的正因數共有多少個？`,
          `Let $N = 2^{${a}} \\times 3^{${b}}$. How many positive factors does $N$ have?`,
        ],
        ans: `$${ans}$`,
        wrong: [`$${a * b}$`, `$${(a + 1) + (b + 1)}$`, `$${a + b}$`],
        e: [
          `正因數個數等於各質因數指數【各加一】之後相乘：$(${a}+1)(${b}+1) = ${ans}$。`
          + `答 $${a * b}$ 是把兩個指數直接相乘，漏了「加一」——「加一」對應該質因數取零次方（即不取）的情況。`
          + `答 $${(a + 1) + (b + 1)}$ 是把兩個因數個數相加而非相乘，忽略了兩個質因數的取法互相獨立。`
          + `答 $${a + b}$ 則連「加一」和「相乘」兩步都略去。`,
          `The number of positive factors is the product of (each exponent + 1): $(${a}+1)(${b}+1) = ${ans}$. `
          + `Answering $${a * b}$ multiplies the exponents without adding one — the "+1" covers taking that prime to the power zero. `
          + `Answering $${(a + 1) + (b + 1)}$ adds the two counts instead of multiplying, ignoring that the two choices are independent. `
          + `Answering $${a + b}$ drops both steps.`,
        ],
      }
    },
  },
  {
    key: 'fm_hcf_lcm_reverse', topic: 'factors_multiples',
    topicZh: '因數與倍數', topicEn: 'Factors & Multiples',
    diff: 'intermediate', n: 6,
    gen: (i): Inst => {
      // 兩數之積 = HCF × LCM。已驗證每組 (g, l, a) 都真係符合。
      const P: [number, number, number][] = [
        [6, 72, 24], [4, 60, 20], [9, 90, 45], [5, 100, 20], [8, 120, 40], [7, 84, 28],
      ]
      const [g, l, a] = P[i]
      const ans = (g * l) / a
      return {
        q: [
          `兩個正整數的最大公因數為 $${g}$，最小公倍數為 $${l}$。若其中一個數為 $${a}$，求另一個數。`,
          `Two positive integers have H.C.F. $${g}$ and L.C.M. $${l}$. If one of them is $${a}$, find the other.`,
        ],
        ans: `$${ans}$`,
        wrong: [`$${l / g}$`, `$${l - a}$`, `$${(a * l) / g}$`],
        e: [
          `兩數之積等於最大公因數與最小公倍數之積：$${a} \\times x = ${g} \\times ${l}$，故 $x = ${ans}$。`
          + `答 $${l / g}$ 是計了 $\\text{L.C.M.} \\div \\text{H.C.F.}$，那是兩數各自「獨有部分」之積，不是其中一個數。`
          + `答 $${l - a}$ 把最小公倍數當成兩數之和。`
          + `答 $${(a * l) / g}$ 則把公式寫反成 $x = a \\times \\text{L.C.M.} \\div \\text{H.C.F.}$。`,
          `The product of the two numbers equals H.C.F. × L.C.M.: $${a} \\times x = ${g} \\times ${l}$, so $x = ${ans}$. `
          + `Answering $${l / g}$ computes L.C.M. ÷ H.C.F., which is the product of the parts unique to each number, not one of the numbers. `
          + `Answering $${l - a}$ treats the L.C.M. as the sum of the two numbers. `
          + `Answering $${(a * l) / g}$ inverts the formula.`,
        ],
      }
    },
  },

  // ── 統計 10 條（basic 4 ＋ intermediate 6）────────────────────────────────
  // 現有 34 條全部係「求平均數／中位數／眾數／全距／標準差」。呢兩個原型改為
  // 【四分位數間距】同【數據整體線性變換後各統計量點變】——後者係 PDF 點名
  // 嘅高頻考點（「每個數據加上或乘以一常數時，平均數、中位數、標準差的規律」）。
  {
    key: 'st_iqr', topic: 'statistics',
    topicZh: '統計', topicEn: 'Statistics',
    diff: 'basic', n: 4,
    gen: (i): Inst => {
      // 8 個數據，Q1 = 第 2、3 個平均，Q3 = 第 6、7 個平均（已排序）。
      const P: number[][] = [
        [3, 5, 7, 8, 10, 12, 14, 15],
        [2, 4, 6, 8, 12, 14, 18, 20],
        [1, 6, 8, 10, 12, 14, 16, 20],
        [4, 5, 9, 11, 12, 15, 18, 21],
      ]
      const d = P[i]
      const q1 = (d[1] + d[2]) / 2
      const q3 = (d[5] + d[6]) / 2
      const ans = q3 - q1
      return {
        q: [
          `下列 8 個數據已由小至大排列：$${d.join(', ')}$。求其四分位數間距。`,
          `The following 8 data are arranged in ascending order: $${d.join(', ')}$. Find the inter-quartile range.`,
        ],
        ans: `$${ans}$`,
        wrong: [`$${d[7] - d[0]}$`, `$${q3}$`, `$${(d[3] + d[4]) / 2}$`],
        e: [
          `8 個數據分成上下兩半各 4 個：下半的中位數 $Q_1 = \\dfrac{${d[1]}+${d[2]}}{2} = ${q1}$，`
          + `上半的中位數 $Q_3 = \\dfrac{${d[5]}+${d[6]}}{2} = ${q3}$，故四分位數間距 $= ${q3} - ${q1} = ${ans}$。`
          + `答 $${d[7] - d[0]}$ 求的是全距（最大減最小），量度的是整體散佈而非中間一半的散佈。`
          + `答 $${q3}$ 只寫出上四分位數而未相減。`
          + `答 $${(d[3] + d[4]) / 2}$ 求的是整組數據的中位數，屬於集中趨勢而非離差。`,
          `Split the 8 data into two halves of 4: $Q_1 = \\dfrac{${d[1]}+${d[2]}}{2} = ${q1}$ and `
          + `$Q_3 = \\dfrac{${d[5]}+${d[6]}}{2} = ${q3}$, so the IQR $= ${q3} - ${q1} = ${ans}$. `
          + `Answering $${d[7] - d[0]}$ gives the range, which measures overall spread rather than the spread of the middle half. `
          + `Answering $${q3}$ stops at the upper quartile without subtracting. `
          + `Answering $${(d[3] + d[4]) / 2}$ gives the median, a measure of central tendency, not of dispersion.`,
        ],
      }
    },
  },
  {
    key: 'st_linear_transform', topic: 'statistics',
    topicZh: '統計', topicEn: 'Statistics',
    diff: 'intermediate', n: 6,
    gen: (i): Inst => {
      // 每個數據 x → kx + c：平均數 → km + c，標準差 → |k|s（加常數不影響離差）。
      const P: [number, number, number, number][] = [
        [8, 3, 2, 5], [12, 4, 3, 1], [20, 6, 2, 7], [15, 5, 4, 2], [10, 2, 5, 3], [25, 8, 3, 4],
      ]
      const [m, s, k, c] = P[i]
      const ans = k * s
      return {
        q: [
          `一組數據的平均數為 $${m}$，標準差為 $${s}$。若把每個數據都乘以 $${k}$，然後再加 $${c}$，求新數據的標準差。`,
          `A set of data has mean $${m}$ and standard deviation $${s}$. Each datum is multiplied by $${k}$ and then increased by $${c}$. Find the new standard deviation.`,
        ],
        ans: `$${ans}$`,
        wrong: [`$${k * s + c}$`, `$${s}$`, `$${k * m + c}$`],
        e: [
          `標準差量度的是數據相對自身平均數的散佈。整組加上同一個常數，每個數據與平均數的距離不變，`
          + `故加 $${c}$ 對標準差沒有影響；乘以 $${k}$ 則把所有距離同時放大 $${k}$ 倍，故新標準差 $= ${k} \\times ${s} = ${ans}$。`
          + `答 $${k * s + c}$ 把常數也加了上去，等於誤以為平移會令數據變得更分散。`
          + `答 $${s}$ 則連乘法的影響一併忽略。`
          + `答 $${k * m + c}$ 求的是新平均數 —— 平均數會隨平移改變，標準差不會，兩者不可混用同一條式。`,
          `Standard deviation measures spread about the mean. Adding the same constant to every datum leaves each distance from the mean unchanged, `
          + `so adding $${c}$ has no effect; multiplying by $${k}$ scales every distance by $${k}$, giving $${k} \\times ${s} = ${ans}$. `
          + `Answering $${k * s + c}$ adds the constant as well, as if a shift made the data more spread out. `
          + `Answering $${s}$ ignores the scaling too. `
          + `Answering $${k * m + c}$ is the new mean — the mean shifts, the standard deviation does not.`,
        ],
      }
    },
  },

  // ── 相似形與相似立體 10 條（intermediate 6 ＋ hard 4）─────────────────────
  // 現有 34 條全部由【長度比】推面積／體積比。呢兩個原型走反方向（由體積比
  // 推表面積比）同走截錐（平截頭體）——後者係卷一乙部常見嘅組合題型。
  {
    key: 'ss_volume_to_area', topic: 'similar_solids',
    topicZh: '相似形與相似立體', topicEn: 'Similar Figures & Solids',
    diff: 'intermediate', n: 6,
    gen: (i): Inst => {
      const P: [number, number][] = [[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5]]
      const [a, b] = P[i]
      return {
        q: [
          `兩個相似立體的體積比為 $${a ** 3} : ${b ** 3}$。求它們的表面積比。`,
          `Two similar solids have volumes in the ratio $${a ** 3} : ${b ** 3}$. Find the ratio of their surface areas.`,
        ],
        ans: `$${a ** 2} : ${b ** 2}$`,
        wrong: [`$${a} : ${b}$`, `$${a ** 3} : ${b ** 3}$`, `$${a ** 4} : ${b ** 4}$`],
        e: [
          `體積比等於長度比的三次方，故長度比為 $${a} : ${b}$；表面積比則等於長度比的平方，即 $${a ** 2} : ${b ** 2}$。`
          + `答 $${a} : ${b}$ 停在長度比，未再平方。`
          + `答 $${a ** 3} : ${b ** 3}$ 把體積比直接當成表面積比。`
          + `答 $${a ** 4} : ${b ** 4}$ 則把三次方再平方，多做了一步。`
          + `關鍵在於先由已知的比【還原長度比】，再按所求維度升冪，而不是在體積比上直接加減次方。`,
          `Volume ratio is the cube of the length ratio, so the lengths are in the ratio $${a} : ${b}$; surface areas are the square of that, $${a ** 2} : ${b ** 2}$. `
          + `Answering $${a} : ${b}$ stops at the length ratio. `
          + `Answering $${a ** 3} : ${b ** 3}$ reuses the volume ratio. `
          + `Answering $${a ** 4} : ${b ** 4}$ squares the cube. `
          + `The method is to recover the length ratio first, then raise it to the power the question asks for.`,
        ],
      }
    },
  },
  {
    key: 'ss_frustum_split', topic: 'similar_solids',
    topicZh: '相似形與相似立體', topicEn: 'Similar Figures & Solids',
    diff: 'hard', n: 4,
    gen: (i): Inst => {
      // 圓錐平行底面截開：上錐與原錐長度比 a : b ⇒ 體積比 a³ : b³，
      // 故 上錐 : 平截頭體 = a³ : (b³ − a³)。
      const P: [number, number][] = [[1, 2], [1, 3], [2, 3], [3, 4]]
      const [a, b] = P[i]
      const top = a ** 3
      const rest = b ** 3 - a ** 3
      return {
        q: [
          `一個圓錐被一平行於底面的平面截開。截面以上的小圓錐的高與原圓錐的高之比為 $${a} : ${b}$。求小圓錐的體積與平截頭體（下半部分）的體積之比。`,
          `A cone is cut by a plane parallel to its base. The height of the small cone above the cut is to the height of the original cone as $${a} : ${b}$. Find the ratio of the volume of the small cone to the volume of the frustum below.`,
        ],
        ans: `$${top} : ${rest}$`,
        wrong: [`$${a ** 3} : ${b ** 3}$`, `$${a} : ${b - a}$`, `$${a ** 2} : ${b ** 2 - a ** 2}$`],
        e: [
          `小圓錐與原圓錐相似，長度比 $${a} : ${b}$，故體積比 $${a ** 3} : ${b ** 3}$。`
          + `平截頭體並非一個相似立體，它的體積要用【原圓錐減去小圓錐】求得：$${b ** 3} - ${a ** 3} = ${rest}$，`
          + `故所求之比為 $${top} : ${rest}$。`
          + `答 $${a ** 3} : ${b ** 3}$ 是小圓錐與【原圓錐】之比，題目問的是與下半部分之比。`
          + `答 $${a} : ${b - a}$ 用長度比作差，沒有升到三次方。`
          + `答 $${a ** 2} : ${b ** 2 - a ** 2}$ 用了平方（表面積的冪次）而非立方。`,
          `The small cone is similar to the whole cone with length ratio $${a} : ${b}$, so their volumes are in the ratio $${a ** 3} : ${b ** 3}$. `
          + `The frustum is not a similar solid; its volume is whole minus small: $${b ** 3} - ${a ** 3} = ${rest}$, giving $${top} : ${rest}$. `
          + `Answering $${a ** 3} : ${b ** 3}$ compares the small cone with the whole cone, not with the frustum. `
          + `Answering $${a} : ${b - a}$ subtracts length ratios without cubing. `
          + `Answering $${a ** 2} : ${b ** 2 - a ** 2}$ uses the square (the power for area) instead of the cube.`,
        ],
      }
    },
  },

  // ── 不等式 9 條（basic 5 ＋ intermediate 4）───────────────────────────────
  // 現有 29 條幾乎全部係「解不等式 $ax + b > 0$」。呢兩個原型改為
  // 【由變數範圍求代數式範圍】同【複合不等式數整數解個數】。
  {
    key: 'in_range_of_expr', topic: 'inequalities',
    topicZh: '不等式', topicEn: 'Inequalities',
    diff: 'basic', n: 5,
    gen: (i): Inst => {
      // 負係數令不等號調轉 —— 呢個就係本題要考嘅位。
      const P: [number, number, number, number][] = [
        [-3, 4, 5, 2], [-1, 6, 9, 3], [-2, 3, 7, 4], [1, 6, 11, 2], [-4, 2, 8, 3],
      ]
      const [lo, hi, c, k] = P[i]
      const maxV = c - k * lo   // x 最細 ⇒ 式最大
      const minV = c - k * hi
      return {
        q: [
          `已知 $${lo} \\le x \\le ${hi}$。求 $${c} - ${k}x$ 的最大值。`,
          `Given $${lo} \\le x \\le ${hi}$, find the greatest value of $${c} - ${k}x$.`,
        ],
        ans: `$${maxV}$`,
        wrong: [`$${minV}$`, `$${c + k * hi}$`, `$${c - k * (hi - lo)}$`],
        e: [
          `$x$ 前的係數為 $-${k}$，是負數，所以 $x$ 越小，整個式的值越大。`
          + `把 $x = ${lo}$（範圍中最小值）代入：$${c} - ${k}(${lo}) = ${maxV}$。`
          + `答 $${minV}$ 是代入了 $x = ${hi}$，即把「$x$ 取最大」誤當成「式取最大」，正正忽略了負係數會令大小關係調轉。`
          + `答 $${c + k * hi}$ 把減號當成加號。`
          + `答 $${c - k * (hi - lo)}$ 則先算了範圍的長度再代入，但範圍的長度並非 $x$ 的一個可取值。`,
          `The coefficient of $x$ is $-${k}$, which is negative, so the expression is greatest when $x$ is smallest. `
          + `Substituting $x = ${lo}$ gives $${c} - ${k}(${lo}) = ${maxV}$. `
          + `Answering $${minV}$ substitutes $x = ${hi}$, treating "largest $x$" as "largest value" and missing that a negative coefficient reverses the order. `
          + `Answering $${c + k * hi}$ reads the minus sign as a plus. `
          + `Answering $${c - k * (hi - lo)}$ substitutes the width of the interval, which is not a possible value of $x$.`,
        ],
      }
    },
  },
  {
    key: 'in_integer_solutions', topic: 'inequalities',
    topicZh: '不等式', topicEn: 'Inequalities',
    diff: 'intermediate', n: 4,
    gen: (i): Inst => {
      // 同時滿足 x > p 同 x ≤ q 嘅整數個數 = q − floor(p) （p 非整數時）
      const P: [number, number][] = [[2, 9], [4, 13], [3, 11], [5, 16]]
      const [p, q] = P[i]
      const ans = q - p            // 整數 p+1 … q
      return {
        q: [
          `求同時滿足 $x > ${p}$ 及 $x \\le ${q}$ 的整數 $x$ 的個數。`,
          `Find the number of integers $x$ satisfying both $x > ${p}$ and $x \\le ${q}$.`,
        ],
        ans: `$${ans}$`,
        wrong: [`$${ans + 1}$`, `$${ans - 1}$`, `$${q}$`],
        e: [
          `$x > ${p}$ 且 $x$ 為整數，故最小可取 $${p + 1}$；$x \\le ${q}$ 容許取到 $${q}$。`
          + `由 $${p + 1}$ 至 $${q}$ 共有 $${q} - ${p + 1} + 1 = ${ans}$ 個整數。`
          + `答 $${ans + 1}$ 把 $${p}$ 也算了進去，但 $x > ${p}$ 是嚴格不等式，$${p}$ 不符合。`
          + `答 $${ans - 1}$ 把 $${q}$ 剔除了，但 $x \\le ${q}$ 是包含等號的，$${q}$ 符合。`
          + `答 $${q}$ 誤把上限當成個數。兩個端點分別「包唔包」，是這類題唯一的分野。`,
          `Since $x > ${p}$ and $x$ is an integer, the smallest value is $${p + 1}$; $x \\le ${q}$ allows $${q}$. `
          + `From $${p + 1}$ to $${q}$ there are $${q} - ${p + 1} + 1 = ${ans}$ integers. `
          + `Answering $${ans + 1}$ includes $${p}$, but $x > ${p}$ is strict. `
          + `Answering $${ans - 1}$ excludes $${q}$, but $x \\le ${q}$ includes it. `
          + `Answering $${q}$ mistakes the upper bound for the count. Whether each endpoint is included is the whole point of this type.`,
        ],
      }
    },
  },

  // ── 排列與組合 9 條（intermediate 6 ＋ hard 3）────────────────────────────
  // 現有 35 條集中喺「排成一行」同「抽 3 個數」。呢兩個原型改為【圓桌排列】
  // 同【分組（不分先後）】—— 兩者都要處理「重複計算」，係本課題真正嘅難點。
  {
    key: 'pc_circular', topic: 'permutation_combination',
    topicZh: '排列與組合', topicEn: 'Permutations & Combinations',
    diff: 'intermediate', n: 6,
    gen: (i): Inst => {
      const N = [4, 5, 6, 7, 8, 9][i]
      const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1))
      const ans = fact(N - 1)
      return {
        q: [
          `$${N}$ 名同學圍着一張圓桌而坐。若只考慮各人的相對位置（即整體旋轉後視為同一種坐法），共有多少種不同的坐法？`,
          `$${N}$ students sit around a round table. If only relative positions matter (rotations of the whole arrangement count as the same), how many different seatings are there?`,
        ],
        ans: `$${ans}$`,
        wrong: [`$${fact(N)}$`, `$${fact(N - 2)}$`, `$${fact(N) / 2}$`],
        e: [
          `圓桌排列要先固定一人作參考點，其餘 $${N - 1}$ 人再排成一行，故坐法為 $(${N}-1)! = ${ans}$ 種。`
          + `答 $${fact(N)}$ 是直線排列 $${N}!$，把 $${N}$ 種只差一個整體旋轉的坐法重複計算了。`
          + `答 $${fact(N - 2)}$ 多固定了一人，等於把相對位置也固定了兩個。`
          + `答 $${fact(N) / 2}$ 是把「可翻轉」（如手鏈）的情況再除以 $2$，但圓桌的左右手方向是可分辨的，不應再除。`,
          `For a round table, fix one person as reference and arrange the remaining $${N - 1}$ in a line: $(${N}-1)! = ${ans}$. `
          + `Answering $${fact(N)}$ uses the linear count $${N}!$, counting each seating $${N}$ times over (once per rotation). `
          + `Answering $${fact(N - 2)}$ fixes one person too many. `
          + `Answering $${fact(N) / 2}$ also divides by $2$ for reflections, which applies to a bracelet but not to a table where left and right are distinguishable.`,
        ],
      }
    },
  },
  {
    key: 'pc_equal_groups', topic: 'permutation_combination',
    topicZh: '排列與組合', topicEn: 'Permutations & Combinations',
    diff: 'hard', n: 3,
    gen: (i): Inst => {
      // 2n 件不同物品分成兩【無標籤】組，每組 n 件：C(2n, n) / 2
      const n = [2, 3, 4][i]
      const C = (a: number, b: number): number => {
        let r = 1
        for (let t = 0; t < b; t++) r = (r * (a - t)) / (t + 1)
        return Math.round(r)
      }
      const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1))
      const half = C(2 * n, n)
      const ans = half / 2
      // ⚠️ 唔可以用 C(2n−1, n−1) 做干擾項：佢【恆等於】正解
      // （$C^{2n-1}_{n-1} = C^{2n}_{n} \times \frac{n}{2n} = C^{2n}_{n}/2$），
      // 即係「固定一件物品喺其中一堆」本身就係一個正確解法，唔係一個錯。
      // 2026-09-05 首次生成時三條實例全部被 _archetype 嘅「四個選項並非互異」
      // 攔住 —— 個閘捉到嘅唔係排版問題，係我揀錯咗一個數學上等價嘅式。
      const wEachChooses = 2 ** (2 * n)   // 每件物品各自二選一入邊堆
      const wLineUp = fact(2 * n) / 2     // 把「分堆」當成「排隊」再除以 2
      return {
        q: [
          `把 $${2 * n}$ 件互不相同的物品平均分成兩堆，每堆 $${n}$ 件。若兩堆之間沒有分別（即不指定哪一堆是第一堆），共有多少種分法？`,
          `$${2 * n}$ distinct objects are divided equally into two piles of $${n}$. If the two piles are indistinguishable (neither is designated as the first), how many ways are there?`,
        ],
        ans: `$${ans}$`,
        wrong: [`$${half}$`, `$${wEachChooses}$`, `$${wLineUp}$`],
        e: [
          `先選出其中 $${n}$ 件成一堆：$C^{${2 * n}}_{${n}} = ${half}$ 種。`
          + `但這樣做把每一種分法都數了兩次 —— 選出某一組作第一堆，與選出其補集作第一堆，得到的是同一個分堆結果。`
          + `由於兩堆沒有分別，須除以 $2$，得 $${ans}$ 種。`
          + `答 $${half}$ 漏了除以 $2$，等於默認兩堆有先後之分。`
          + `答 $${wEachChooses}$ 是讓每件物品各自選擇入哪一堆（$2^{${2 * n}}$），既沒有限制每堆恰好 $${n}$ 件，也沒有處理重複計算。`
          + `答 $${wLineUp}$ 是把 $${2 * n}$ 件物品排成一列再除以 $2$，那計的是排列而非分堆，同一堆內部的次序不應該分開計算。`,
          `First choose $${n}$ objects for one pile: $C^{${2 * n}}_{${n}} = ${half}$. `
          + `This counts every division twice — choosing a set for the "first" pile and choosing its complement give the same division. `
          + `Since the piles are indistinguishable, divide by $2$ to get $${ans}$. `
          + `Answering $${half}$ omits the division, implicitly ordering the piles. `
          + `Answering $${wEachChooses}$ lets each object pick a pile independently ($2^{${2 * n}}$), enforcing neither the equal sizes nor the double-count correction. `
          + `Answering $${wLineUp}$ arranges all $${2 * n}$ objects in a line and halves it, which counts orderings within a pile that should not be distinguished.`,
        ],
      }
    },
  },

  // ── 數系 8 條（basic 4 ＋ intermediate 4）─────────────────────────────────
  // 現有 35 條集中喺「化簡 $\sqrt{n}$」同「下列何者必定是無理數」。呢兩個
  // 原型改為【分母有理化】同【二次根式的平方展開】。
  {
    key: 'ns_rationalise', topic: 'number_systems',
    topicZh: '數系', topicEn: 'Number Systems',
    diff: 'basic', n: 4,
    gen: (i): Inst => {
      const P: [number, number][] = [[2, 3], [5, 2], [3, 7], [6, 5]]
      const [k, r] = P[i]   // k / √r
      return {
        q: [
          `將 $\\dfrac{${k}}{\\sqrt{${r}}}$ 的分母有理化。`,
          `Rationalise the denominator of $\\dfrac{${k}}{\\sqrt{${r}}}$.`,
        ],
        ans: `$\\dfrac{${k}\\sqrt{${r}}}{${r}}$`,
        wrong: [
          `$\\dfrac{${k}\\sqrt{${r}}}{\\sqrt{${r}}}$`,
          `$${k}\\sqrt{${r}}$`,
          `$\\dfrac{${k}}{${r}}$`,
        ],
        e: [
          `分子分母同乘 $\\sqrt{${r}}$：$\\dfrac{${k}}{\\sqrt{${r}}} \\times \\dfrac{\\sqrt{${r}}}{\\sqrt{${r}}} = \\dfrac{${k}\\sqrt{${r}}}{${r}}$，`
          + `因為 $\\sqrt{${r}} \\times \\sqrt{${r}} = ${r}$。`
          + `寫成分母仍留有 $\\sqrt{${r}}$ 的那一項，只把分子乘了而分母未乘，等於改變了原式的值。`
          + `寫成 $${k}\\sqrt{${r}}$ 是把分母整個丟掉。`
          + `寫成 $\\dfrac{${k}}{${r}}$ 則把 $\\sqrt{${r}}$ 直接當成 $${r}$，忽略了根號。`,
          `Multiply numerator and denominator by $\\sqrt{${r}}$: $\\dfrac{${k}}{\\sqrt{${r}}} \\times \\dfrac{\\sqrt{${r}}}{\\sqrt{${r}}} = \\dfrac{${k}\\sqrt{${r}}}{${r}}$, since $\\sqrt{${r}} \\times \\sqrt{${r}} = ${r}$. `
          + `The option still carrying $\\sqrt{${r}}$ in the denominator multiplies only the numerator, changing the value. `
          + `The option $${k}\\sqrt{${r}}$ discards the denominator entirely. `
          + `The option $\\dfrac{${k}}{${r}}$ treats $\\sqrt{${r}}$ as $${r}$.`,
        ],
      }
    },
  },
  {
    key: 'ns_surd_square', topic: 'number_systems',
    topicZh: '數系', topicEn: 'Number Systems',
    diff: 'intermediate', n: 4,
    gen: (i): Inst => {
      const P: [number, number][] = [[2, 3], [3, 5], [2, 7], [5, 6]]
      const [a, b] = P[i]   // (√a + √b)²
      const ab = a * b
      return {
        q: [
          `展開並化簡 $(\\sqrt{${a}} + \\sqrt{${b}})^2$。`,
          `Expand and simplify $(\\sqrt{${a}} + \\sqrt{${b}})^2$.`,
        ],
        ans: `$${a + b} + 2\\sqrt{${ab}}$`,
        wrong: [`$${a + b}$`, `$${a + b} + \\sqrt{${ab}}$`, `$${a + b} + 2\\sqrt{${a + b}}$`],
        e: [
          `按完全平方公式 $(x+y)^2 = x^2 + 2xy + y^2$，其中 $x = \\sqrt{${a}}$、$y = \\sqrt{${b}}$：`
          + `$x^2 = ${a}$、$y^2 = ${b}$、$2xy = 2\\sqrt{${a}}\\sqrt{${b}} = 2\\sqrt{${ab}}$，故答案為 $${a + b} + 2\\sqrt{${ab}}$。`
          + `只答 $${a + b}$ 是把括號內兩項分別平方而略去中間項，即誤用了 $(x+y)^2 = x^2+y^2$。`
          + `答 $${a + b} + \\sqrt{${ab}}$ 漏了中間項的係數 $2$。`
          + `答 $${a + b} + 2\\sqrt{${a + b}}$ 把兩個根號內的數相加而非相乘 —— $\\sqrt{${a}}\\sqrt{${b}} = \\sqrt{${a} \\times ${b}}$，不是 $\\sqrt{${a}+${b}}$。`,
          `Using $(x+y)^2 = x^2 + 2xy + y^2$ with $x = \\sqrt{${a}}$, $y = \\sqrt{${b}}$: `
          + `$x^2 = ${a}$, $y^2 = ${b}$, $2xy = 2\\sqrt{${ab}}$, giving $${a + b} + 2\\sqrt{${ab}}$. `
          + `Answering $${a + b}$ squares each term and drops the cross term, i.e. uses $(x+y)^2 = x^2+y^2$. `
          + `Answering $${a + b} + \\sqrt{${ab}}$ omits the coefficient $2$. `
          + `Answering $${a + b} + 2\\sqrt{${a + b}}$ adds inside the surd instead of multiplying: $\\sqrt{${a}}\\sqrt{${b}} = \\sqrt{${ab}}$.`,
        ],
      }
    },
  },

  // ── 等比數列 7 條（intermediate 4 ＋ hard 3）──────────────────────────────
  // 現有 37 條全部係「首項為 #、公比為 #，求第 # 項」。呢兩個原型改為
  // 【由兩項反推公比】同【無窮等比級數求和】。
  {
    key: 'gs_ratio_from_terms', topic: 'geometric_sequence',
    topicZh: '等比數列', topicEn: 'Geometric Sequence',
    diff: 'intermediate', n: 4,
    gen: (i): Inst => {
      // T2 = ar, T4 = ar³ ⇒ T4/T2 = r² ⇒ r = √(T4/T2)（取正值）
      const P: [number, number, number][] = [[3, 2, 2], [5, 3, 3], [2, 4, 2], [7, 2, 5]]
      const [a, r, _n] = P[i]
      const t2 = a * r
      const t4 = a * r ** 3
      return {
        q: [
          `一等比數列的第 $2$ 項為 $${t2}$，第 $4$ 項為 $${t4}$。若公比為正數，求該公比。`,
          `The 2nd term of a geometric sequence is $${t2}$ and the 4th term is $${t4}$. Given that the common ratio is positive, find it.`,
        ],
        ans: `$${r}$`,
        wrong: [`$${t4 / t2}$`, `$${t4 - t2}$`, `$${a}$`],
        e: [
          `由 $T_2 = ar$ 及 $T_4 = ar^3$ 得 $\\dfrac{T_4}{T_2} = r^2 = \\dfrac{${t4}}{${t2}} = ${r ** 2}$，`
          + `公比為正，故 $r = ${r}$。`
          + `答 $${t4 / t2}$ 停在 $r^2$ 未開方 —— 第 $2$ 項與第 $4$ 項之間相隔【兩個】公比，不是一個。`
          + `答 $${t4 - t2}$ 用了相減，那是等差數列求公差的做法。`
          + `答 $${a}$ 求的是首項，並非題目所問。`,
          `From $T_2 = ar$ and $T_4 = ar^3$, $\\dfrac{T_4}{T_2} = r^2 = \\dfrac{${t4}}{${t2}} = ${r ** 2}$; as $r > 0$, $r = ${r}$. `
          + `Answering $${t4 / t2}$ stops at $r^2$ — there are two ratio steps between the 2nd and 4th terms, not one. `
          + `Answering $${t4 - t2}$ subtracts, which is how a common difference is found in an arithmetic sequence. `
          + `Answering $${a}$ gives the first term, which is not what is asked.`,
        ],
      }
    },
  },
  {
    key: 'gs_sum_to_infinity', topic: 'geometric_sequence',
    topicZh: '等比數列', topicEn: 'Geometric Sequence',
    diff: 'hard', n: 3,
    gen: (i): Inst => {
      // S∞ = a / (1 − r)，|r| < 1
      const P: [number, number, number][] = [[6, 1, 3], [8, 1, 2], [10, 2, 5]]
      const [a, rn, rd] = P[i]
      return {
        q: [
          `一無窮等比數列的首項為 $${a}$，公比為 $\\dfrac{${rn}}{${rd}}$。求該數列所有項的總和。`,
          `An infinite geometric sequence has first term $${a}$ and common ratio $\\dfrac{${rn}}{${rd}}$. Find the sum of all its terms.`,
        ],
        ans: frac(a * rd, rd - rn),
        wrong: [frac(a * rd, rd + rn), frac(a, 1), frac(a * rn, rd)],
        e: [
          `公比的絕對值小於 $1$，故總和收斂：$S_\\infty = \\dfrac{a}{1-r} = \\dfrac{${a}}{1 - \\frac{${rn}}{${rd}}} = ${frac(a * rd, rd - rn).replace(/\$/g, '')}$。`
          + `答 ${frac(a * rd, rd + rn)} 把分母寫成 $1+r$，正負號寫反。`
          + `答 ${frac(a, 1)} 只寫出首項，未求和。`
          + `答 ${frac(a * rn, rd)} 求的是該數列的第 $2$ 項。`
          + `注意 $S_\\infty$ 的公式只在 $|r| < 1$ 時成立；公比若大於或等於 $1$，各項不會越來越細，總和不存在。`,
          `Since $|r| < 1$ the sum converges: $S_\\infty = \\dfrac{a}{1-r} = \\dfrac{${a}}{1 - \\frac{${rn}}{${rd}}} = ${frac(a * rd, rd - rn).replace(/\$/g, '')}$. `
          + `The option ${frac(a * rd, rd + rn)} uses $1+r$ in the denominator, reversing a sign. `
          + `The option ${frac(a, 1)} gives only the first term. `
          + `The option ${frac(a * rn, rd)} gives the sequence's 2nd term. `
          + `Note the formula holds only for $|r| < 1$; otherwise the terms do not shrink and no finite sum exists.`,
        ],
      }
    },
  },

  // ── 概率 6 條（basic 5 ＋ hard 1）─────────────────────────────────────────
  // 現有 38 條集中喺「袋中取球」同「擲骰」。呢兩個原型改為【兩次擲骰點數相同】
  // 同【「至少一次」用補集】——後者係最常見嘅失分位。
  {
    key: 'pr_same_outcome', topic: 'probability',
    topicZh: '概率', topicEn: 'Probability',
    diff: 'basic', n: 5,
    gen: (i): Inst => {
      const n = [4, 6, 8, 10, 12][i]
      return {
        q: [
          `一個各面出現機會均等的 $${n}$ 面骰子連續擲兩次。求兩次擲出的數字相同的概率。`,
          `A fair $${n}$-sided die is thrown twice. Find the probability that the two numbers obtained are the same.`,
        ],
        ans: frac(1, n),
        wrong: [frac(1, n * n), frac(n, n * n - n), frac(2, n)],
        e: [
          `第一次擲出甚麼都可以，關鍵只在第二次是否與第一次相同 —— 第二次有 $${n}$ 個等可能結果，其中 $1$ 個符合，`
          + `故概率為 ${frac(1, n).replace(/\$/g, '')}。（亦可數：$${n} \\times ${n} = ${n * n}$ 個結果中有 $${n}$ 個是相同的。）`
          + `答 ${frac(1, n * n)} 只算了某一個【指定】數字連續出現兩次的概率，但題目沒有指定是哪一個數字。`
          + `答 ${frac(n, n * n - n)} 把分母寫成「不相同的結果數」，分母應為全部結果數。`
          + `答 ${frac(2, n)} 把「兩次」誤當成分子要乘 $2$。`,
          `The first throw can be anything; what matters is whether the second matches it. The second throw has $${n}$ equally likely outcomes, $1$ of which matches, so the probability is ${frac(1, n).replace(/\$/g, '')}. `
          + `(Equivalently, $${n}$ of the $${n * n}$ ordered outcomes are matches.) `
          + `The option ${frac(1, n * n)} is the probability of one *specified* number appearing twice, but no number is specified. `
          + `The option ${frac(n, n * n - n)} uses the count of non-matching outcomes as the denominator. `
          + `The option ${frac(2, n)} doubles the numerator because there are two throws.`,
        ],
      }
    },
  },
  {
    key: 'pr_at_least_one', topic: 'probability',
    topicZh: '概率', topicEn: 'Probability',
    diff: 'hard', n: 1,
    gen: (): Inst => {
      // 連擲 3 次，每次成功概率 1/6，求至少一次成功 = 1 − (5/6)³ = 91/216
      return {
        q: [
          '擲一粒公正骰子三次。求至少有一次擲出 $6$ 點的概率。',
          'A fair die is thrown three times. Find the probability of obtaining at least one six.',
        ],
        ans: '$\\dfrac{91}{216}$',
        wrong: ['$\\dfrac{1}{2}$', '$\\dfrac{125}{216}$', '$\\dfrac{3}{216}$'],
        e: [
          '「至少一次」的反面是「一次都沒有」，後者容易直接計算：三次都不是 $6$ 點的概率為 '
          + '$\\left(\\dfrac{5}{6}\\right)^3 = \\dfrac{125}{216}$，故所求概率 $= 1 - \\dfrac{125}{216} = \\dfrac{91}{216}$。'
          + '答 $\\dfrac{1}{2}$ 把三次機會直接加起來（$\\dfrac{1}{6} \\times 3$）再約簡，'
          + '但「至少一次」的各種情況並非互斥，相加會把「兩次或三次都中」重複計算。'
          + '答 $\\dfrac{125}{216}$ 求的是一次都沒有的概率，忘了用 $1$ 減。'
          + '答 $\\dfrac{3}{216}$ 則把分子誤當成擲的次數。',
          'The complement of "at least one" is "none", which is easier to compute: the probability of no six in three throws is '
          + '$\\left(\\dfrac{5}{6}\\right)^3 = \\dfrac{125}{216}$, so the answer is $1 - \\dfrac{125}{216} = \\dfrac{91}{216}$. '
          + 'The option $\\dfrac{1}{2}$ adds the three chances ($\\dfrac{1}{6} \\times 3$), but the cases are not mutually exclusive, so this double-counts throws where two or three sixes occur. '
          + 'The option $\\dfrac{125}{216}$ is the probability of no six, without subtracting from $1$. '
          + 'The option $\\dfrac{3}{216}$ mistakes the number of throws for the numerator.',
        ],
      }
    },
  },

  // ── 圓的幾何特性 4 條（intermediate 4）───────────────────────────────────
  // 現有 40 條集中喺切線、弦、圓內接四邊形同直線與圓相交。呢個原型改為
  // 【由一般式讀出圓心與半徑】—— 屬坐標幾何與圓的交界，卷二常見。
  {
    key: 'ci_centre_radius', topic: 'circles',
    topicZh: '圓的幾何特性', topicEn: 'Properties of Circles',
    diff: 'intermediate', n: 4,
    gen: (i): Inst => {
      // x² + y² + Dx + Ey + F = 0 ⇒ 圓心 (−D/2, −E/2)
      const P: [number, number, number][] = [[-6, 8, -11], [4, -2, -20], [-2, -10, 10], [8, 6, -24]]
      const [D, E, F] = P[i]
      const cx = -D / 2
      const cy = -E / 2
      const sgn = (v: number) => (v >= 0 ? `+ ${v}` : `- ${Math.abs(v)}`)
      return {
        q: [
          `圓 $C: x^2 + y^2 ${sgn(D)}x ${sgn(E)}y ${sgn(F)} = 0$ 的圓心坐標是甚麼？`,
          `What are the coordinates of the centre of the circle $C: x^2 + y^2 ${sgn(D)}x ${sgn(E)}y ${sgn(F)} = 0$?`,
        ],
        ans: `$(${cx}, ${cy})$`,
        wrong: [`$(${D}, ${E})$`, `$(${-D}, ${-E})$`, `$(${D / 2}, ${E / 2})$`],
        e: [
          `一般式 $x^2 + y^2 + Dx + Ey + F = 0$ 的圓心為 $\\left(-\\dfrac{D}{2}, -\\dfrac{E}{2}\\right)$。`
          + `此處 $D = ${D}$、$E = ${E}$，故圓心為 $(${cx}, ${cy})$。`
          + `答 $(${D}, ${E})$ 直接把係數當坐標，既沒有變號也沒有除以 $2$。`
          + `答 $(${-D}, ${-E})$ 變了號但漏了除以 $2$。`
          + `答 $(${D / 2}, ${E / 2})$ 除了 $2$ 但漏了變號。`
          + `兩步缺一不可 —— 這條式來自配方 $\\left(x + \\dfrac{D}{2}\\right)^2 + \\left(y + \\dfrac{E}{2}\\right)^2 = \\dfrac{D^2+E^2-4F}{4}$。`
          + `常數項 $${F}$ 只影響半徑，不影響圓心。`,
          `For the general form $x^2 + y^2 + Dx + Ey + F = 0$ the centre is $\\left(-\\dfrac{D}{2}, -\\dfrac{E}{2}\\right)$. `
          + `Here $D = ${D}$ and $E = ${E}$, so the centre is $(${cx}, ${cy})$. `
          + `The option $(${D}, ${E})$ reads off the coefficients directly, neither halving nor changing sign. `
          + `The option $(${-D}, ${-E})$ changes sign but does not halve. `
          + `The option $(${D / 2}, ${E / 2})$ halves but does not change sign. `
          + `Both steps come from completing the square. The constant $${F}$ affects only the radius, not the centre.`,
        ],
      }
    },
  },

  // ── 三維三角學 4 條（hard 4）─────────────────────────────────────────────
  // 現有 40 條集中喺「側棱與底面所成的角」。呢個原型改為【二面角】——
  // PDF 點名卷一乙部必考「兩平面夾角（Dihedral angle）」，而現有題庫零覆蓋。
  {
    key: 't3_dihedral', topic: 'trig_3d',
    topicZh: '三維三角學', topicEn: '3-D Trigonometry',
    diff: 'hard', n: 4,
    gen: (i): Inst => {
      // 正四棱錐：底邊 2a、高 h。側面與底面的二面角 θ 滿足 tan θ = h / a
      // （a 為底邊之半，即由底面中心到底邊中點的距離）。
      const P: [number, number][] = [[6, 4], [8, 3], [10, 12], [4, 5]]
      const [side, h] = P[i]
      const a = side / 2
      const deg = (Math.atan(h / a) * 180) / Math.PI
      const r1 = Math.round(deg * 10) / 10
      const wrongAtan = (x: number) => Math.round(((Math.atan(x) * 180) / Math.PI) * 10) / 10
      const w1 = wrongAtan(h / side)                       // 用整條底邊而非一半
      const w2 = wrongAtan(h / (a * Math.SQRT2))            // 用底面對角線之半（那是側棱的角）
      const w3 = Math.round((90 - deg) * 10) / 10           // 求了餘角
      return {
        q: [
          `正四棱錐 $V\\text{-}ABCD$ 的底面 $ABCD$ 為邊長 $${side}$ 的正方形，頂點 $V$ 在底面中心的正上方，高為 $${h}$。求側面與底面所成的二面角（準至最接近的 $0.1^\\circ$）。`,
          `In the right pyramid $V\\text{-}ABCD$, the base $ABCD$ is a square of side $${side}$, the apex $V$ is vertically above the centre of the base, and the height is $${h}$. Find the dihedral angle between a lateral face and the base, correct to the nearest $0.1^\\circ$.`,
        ],
        ans: `$${r1}^\\circ$`,
        wrong: [`$${w1}^\\circ$`, `$${w2}^\\circ$`, `$${w3}^\\circ$`],
        e: [
          `二面角要在【垂直於兩面交線】的方向上量度。交線是底邊，故取底邊的中點 $M$：`
          + `$OM$ 由底面中心垂直指向底邊，長度為底邊之半 $= ${a}$，而 $VO = ${h}$ 為高，$VM \\perp$ 底邊。`
          + `於是 $\\tan\\theta = \\dfrac{VO}{OM} = \\dfrac{${h}}{${a}}$，$\\theta = ${r1}^\\circ$。`
          + `答 $${w1}^\\circ$ 用了整條底邊 $${side}$ 而非其一半，即量錯了 $OM$。`
          + `答 $${w2}^\\circ$ 用了底面中心到【頂點】的距離，那求出的是側棱與底面的夾角，不是兩個面的夾角。`
          + `答 $${w3}^\\circ$ 求了餘角，即量了 $VM$ 與底面法線的夾角。`
          + `辨認二面角的關鍵，是先問「兩個面的交線在哪裏」，再在該線的垂直方向取角。`,
          `A dihedral angle is measured perpendicular to the line of intersection. That line is a base edge, so take its midpoint $M$: `
          + `$OM$ runs from the centre perpendicular to the edge and has length half the side $= ${a}$, while $VO = ${h}$ is the height. `
          + `Hence $\\tan\\theta = \\dfrac{${h}}{${a}}$ and $\\theta = ${r1}^\\circ$. `
          + `The option $${w1}^\\circ$ uses the full side $${side}$ instead of half of it. `
          + `The option $${w2}^\\circ$ uses the distance from the centre to a *vertex*, which gives the angle between a lateral edge and the base, not between two faces. `
          + `The option $${w3}^\\circ$ gives the complement. `
          + `The key is to locate the line of intersection first, then measure perpendicular to it.`,
        ],
      }
    },
  },

  // ── 對數 1 條（hard 1）───────────────────────────────────────────────────
  // 現有 43 條集中喺求值同解指數方程。呢條改為【換底後用已知量表示】。
  {
    key: 'lg_change_base', topic: 'logarithms',
    topicZh: '對數與指數', topicEn: 'Logarithms & Exponentials',
    diff: 'hard', n: 1,
    gen: (): Inst => ({
      q: [
        '已知 $\\log_a b = m$（其中 $a > 0$、$a \\ne 1$、$b > 0$）。用 $m$ 表示 $\\log_{a^2} b^3$。',
        'Given $\\log_a b = m$ where $a > 0$, $a \\ne 1$, $b > 0$, express $\\log_{a^2} b^3$ in terms of $m$.',
      ],
      ans: '$\\dfrac{3m}{2}$',
      wrong: ['$\\dfrac{2m}{3}$', '$6m$', '$m^{3/2}$'],
      e: [
        '指數在真數上可以提出到係數：$\\log_{a^2} b^3 = 3\\log_{a^2} b$。'
        + '底數上的指數則提出為【倒數】：$\\log_{a^2} b = \\dfrac{1}{2}\\log_a b$。'
        + '兩者合起來得 $3 \\times \\dfrac{1}{2} \\times m = \\dfrac{3m}{2}$。'
        + '答 $\\dfrac{2m}{3}$ 把兩個位置調轉了 —— 真數的指數應在分子，底數的指數應在分母。'
        + '答 $6m$ 把兩個指數相乘，等於把底數的指數也當成可以直接提出的係數。'
        + '答 $m^{3/2}$ 把係數寫成了次方。'
        + '可用換底公式覆核：$\\log_{a^2} b^3 = \\dfrac{\\log_a b^3}{\\log_a a^2} = \\dfrac{3m}{2}$。',
        'An exponent on the argument comes out as a coefficient: $\\log_{a^2} b^3 = 3\\log_{a^2} b$. '
        + 'An exponent on the base comes out as its *reciprocal*: $\\log_{a^2} b = \\dfrac{1}{2}\\log_a b$. '
        + 'Together, $3 \\times \\dfrac{1}{2} \\times m = \\dfrac{3m}{2}$. '
        + 'The option $\\dfrac{2m}{3}$ swaps the two positions. '
        + 'The option $6m$ multiplies the exponents, treating the base exponent as an ordinary coefficient. '
        + 'The option $m^{3/2}$ turns the coefficient into a power. '
        + 'Check by change of base: $\\log_{a^2} b^3 = \\dfrac{\\log_a b^3}{\\log_a a^2} = \\dfrac{3m}{2}$.',
      ],
    }),
  },
]

emit('math', 'math_med_b1', archs, OUT)
