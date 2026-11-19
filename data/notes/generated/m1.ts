// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "permutation_combination": {
    "subjectId": "m1",
    "topicId": "permutation_combination",
    "titleZh": "排列與組合",
    "titleEn": "Permutations & Combinations",
    "conceptZh": "$C^{5}_{2} = \\frac{5!}{2!(5-2)!} = 10$。",
    "conceptEn": "$C^{5}_{2} = \\frac{5!}{2!(5-2)!} = 10$.",
    "mustKnowZh": [
      "$C^{5}_{2} = \\frac{5!}{2!(5-2)!} = 10$。",
      "$P^{5}_{2} = \\frac{5!}{(5-2)!} = 20$。",
      "$4! = 24$ 種排列。",
      "用補集：總數 $C^9_3$ 減去「全男」$C^5_3$，即至少 1 女。"
    ],
    "mustKnowEn": [
      "$C^{5}_{2} = \\frac{5!}{2!(5-2)!} = 10$.",
      "$P^{5}_{2} = \\frac{5!}{(5-2)!} = 20$.",
      "$4! = 24$ arrangements.",
      "By complement: total $C^9_3$ minus all-male $C^5_3$ gives “at least 1 woman”."
    ],
    "examTipZh": "DSE 作答「排列與組合」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Permutations & Combinations”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$60$ 是【排列】 $P(5, 3)$，適用於職位有分別（例如選主席、秘書、司庫）的情況，數值大 $3!$ 倍；$15$ 用了相乘；$125$ 是可重複選取的情況。判斷用排列還是組合，只需問一句：調換兩個被選者的次序，結果算不算同一種？算，就是組合。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "binomial": {
    "subjectId": "m1",
    "topicId": "binomial",
    "titleZh": "二項式定理",
    "titleEn": "Binomial Theorem",
    "conceptZh": "二項式係數 $C^{4}_{2} = 6$。",
    "conceptEn": "The binomial coefficient $C^{4}_{2} = 6$.",
    "mustKnowZh": [
      "二項式係數 $C^{4}_{2} = 6$。",
      "各係數之和 $= 2^{3} = 8$。",
      "一般項 $T_{r+1} = C^n_r a^{n-r} b^r$。",
      "$(1+x)^n$ 展開有 $n+1$ 項（由 $x^0$ 至 $x^n$）。"
    ],
    "mustKnowEn": [
      "The binomial coefficient $C^{4}_{2} = 6$.",
      "The sum of coefficients $= 2^{3} = 8$.",
      "The general term is $T_{r+1} = C^n_r a^{n-r} b^r$.",
      "$(1+x)^n$ has $n+1$ terms (from $x^0$ to $x^n$)."
    ],
    "examTipZh": "DSE 作答「二項式定理」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Binomial Theorem”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$60$ 是排列 $P^{5}_{3}$（沒有除 $r!$）。",
    "commonTrapEn": "$60$ is the permutation $P^{5}_{3}$ (missing $\\div r!$).",
    "source": "generated"
  },
  "exp_log_calculus": {
    "subjectId": "m1",
    "topicId": "exp_log_calculus",
    "titleZh": "指數對數微積分",
    "titleEn": "Exp/Log Calculus",
    "conceptZh": "$e^x$ 的導數仍是 $e^x$。",
    "conceptEn": "The derivative of $e^x$ is $e^x$.",
    "mustKnowZh": [
      "$e^x$ 的導數仍是 $e^x$。",
      "$\\frac{d}{dx}\\ln x = \\frac{1}{x}$。",
      "鏈式法則：$\\frac{d}{dx}e^{3x} = 3e^{3x}$。",
      "$\\int e^x\\,dx = e^x + C$。"
    ],
    "mustKnowEn": [
      "The derivative of $e^x$ is $e^x$.",
      "$\\frac{d}{dx}\\ln x = \\frac{1}{x}$.",
      "Chain rule: $\\frac{d}{dx}e^{3x} = 3e^{3x}$.",
      "$\\int e^x\\,dx = e^x + C$."
    ],
    "examTipZh": "DSE 作答「指數對數微積分」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Exp/Log Calculus”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2e^{2x} + C$ 漏了連鎖法則帶來的 $\\dfrac{1}{2}$；$\\frac{1}{2}e^{2x} + C$ 多除了一次；$4e^{2x} + C$ 把係數乘了兩次。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "calculus_app": {
    "subjectId": "m1",
    "topicId": "calculus_app",
    "titleZh": "微積分應用",
    "titleEn": "Applications of Calculus",
    "conceptZh": "$f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$。",
    "conceptEn": "$f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$.",
    "mustKnowZh": [
      "$f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$。",
      "極值（極大/極小）出現在 $f'(x) = 0$ 的臨界點。",
      "二階導為正表示曲線下凹向上，臨界點為極小值。",
      "二階導為負表示曲線上凹向下，臨界點為極大值。"
    ],
    "mustKnowEn": [
      "$f'(x) = 2x - 6 = 0 \\Rightarrow x = 3$.",
      "Turning points occur at critical points where $f'(x) = 0$.",
      "A positive second derivative means concave up, so the critical point is a minimum.",
      "A negative second derivative means concave down, so the point is a maximum."
    ],
    "examTipZh": "DSE 作答「微積分應用」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Applications of Calculus”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$14$ m/s 是 $t = 2$ 時的【位移】而非速度；$4$ m/s 是加速度 $\\dfrac{d^2s}{dt^2}$；$7$ m/s 是【平均】速度（位移÷時間），與瞬時速度不同。位移、速度、加速度三者相差一次求導，讀題時要看清楚問邊一個。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "probability_dist": {
    "subjectId": "m1",
    "topicId": "probability_dist",
    "titleZh": "概率分佈",
    "titleEn": "Probability Distributions",
    "conceptZh": "$E(X) = np = 10\\times0.5 = 5$。",
    "conceptEn": "$E(X) = np = 10\\times0.5 = 5$.",
    "mustKnowZh": [
      "$E(X) = np = 10\\times0.5 = 5$。",
      "$\\text{Var}(X) = np(1-p) = 10\\times0.5\\times0.5 = 2.5$。",
      "$\\text{Var}(X) = np(1-p) = 8\\times0.5\\times0.5 = 2$。",
      "二項分佈：固定 $n$ 次獨立試驗、每次成功概率 $p$ 相同、結果二分。"
    ],
    "mustKnowEn": [
      "$E(X) = np = 10\\times0.5 = 5$.",
      "$\\text{Var}(X) = np(1-p) = 10\\times0.5\\times0.5 = 2.5$.",
      "$\\text{Var}(X) = np(1-p) = 8\\times0.5\\times0.5 = 2$.",
      "Binomial: a fixed number $n$ of independent trials, constant success probability $p$, two outcomes each."
    ],
    "examTipZh": "DSE 作答「概率分佈」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Probability Distributions”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.9$ 是方差 $np(1-p)$；$10$ 只抄了試驗次數；$100$ 用了除法。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "normal_distribution": {
    "subjectId": "m1",
    "topicId": "normal_distribution",
    "titleZh": "正態分佈",
    "titleEn": "Normal Distribution",
    "conceptZh": "標準正態分佈 $N(0, 1)$：平均數 0、標準差 1。",
    "conceptEn": "The standard normal $N(0, 1)$ has mean 0 and standard deviation 1.",
    "mustKnowZh": [
      "標準正態分佈 $N(0, 1)$：平均數 0、標準差 1。",
      "正態分佈呈對稱鐘形，平均數=中位數=眾數。",
      "標準化：$Z = \\frac{X - \\mu}{\\sigma}$。",
      "經驗法則：±1σ ≈ 68%、±2σ ≈ 95%、±3σ ≈ 99.7%。"
    ],
    "mustKnowEn": [
      "The standard normal $N(0, 1)$ has mean 0 and standard deviation 1.",
      "The normal curve is a symmetric bell, with mean = median = mode.",
      "Standardise with $Z = \\frac{X - \\mu}{\\sigma}$.",
      "Empirical rule: ±1σ ≈ 68%, ±2σ ≈ 95%, ±3σ ≈ 99.7%."
    ],
    "examTipZh": "DSE 作答「正態分佈」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Normal Distribution”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.25$ 誤除以方差 $\\sigma^2$；$4$ 漏了除以 $\\sigma$。",
    "commonTrapEn": "dividing by the variance $\\sigma^2$ gives $0.25$.",
    "source": "generated"
  },
  "statistics_inference": {
    "subjectId": "m1",
    "topicId": "statistics_inference",
    "titleZh": "統計推斷",
    "titleEn": "Statistical Inference",
    "conceptZh": "隨機抽樣讓每個個體有同等機會被選，減少抽樣偏差。",
    "conceptEn": "Random sampling gives each individual an equal chance, reducing selection bias.",
    "mustKnowZh": [
      "隨機抽樣讓每個個體有同等機會被選，減少抽樣偏差。",
      "樣本越大，抽樣誤差（標準誤差）越小，估計越可靠。",
      "樣本平均數是總體平均數的無偏估計量。",
      "方便抽樣只取易接觸者，樣本不具代表性，偏差大。"
    ],
    "mustKnowEn": [
      "Random sampling gives each individual an equal chance, reducing selection bias.",
      "Larger samples have smaller sampling error (standard error), giving more reliable estimates.",
      "The sample mean is an unbiased estimator of the population mean.",
      "Convenience sampling reaches only accessible people, giving an unrepresentative, biased sample."
    ],
    "examTipZh": "DSE 作答「統計推斷」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Statistical Inference”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$6$ 是母體標準差本身，未除以 $\\sqrt{n}$；$1.5$ 除了 $n$ 而非 $\\sqrt{n}$；$12$ 用了乘法。留意樣本愈大標準誤愈細，但因為分母是 $\\sqrt{n}$，樣本要增至四倍才能令標準誤減半。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "m1_distributions": {
    "subjectId": "m1",
    "topicId": "m1_distributions",
    "titleZh": "概率分佈（高階）",
    "titleEn": "Probability distributions",
    "conceptZh": "$P(X=2)=\\binom{5}{2}(0.2)^2(0.8)^3 = 10 \\times 0.04 \\times 0.512 = 0.2048$。",
    "conceptEn": "$P(X=2)=\\binom{5}{2}(0.2)^2(0.8)^3 = 10 \\times 0.04 \\times 0.512 = 0.2048$.",
    "mustKnowZh": [
      "$P(X=2)=\\binom{5}{2}(0.2)^2(0.8)^3 = 10 \\times 0.04 \\times 0.512 = 0.2048$。",
      "泊松：$P(X=k)=\\dfrac{e^{-\\lambda}\\lambda^k}{k!}$。",
      "二項分佈：平均數 $=np=20\\times 0.3=6$；方差 $=np(1-p)=20\\times 0.3\\times 0.7=4.2$。",
      "二項分佈的方差 $\\operatorname{Var}(X) = np(1-p) = 10 \\times 0.1 \\times 0.9 = 0.9$。"
    ],
    "mustKnowEn": [
      "$P(X=2)=\\binom{5}{2}(0.2)^2(0.8)^3 = 10 \\times 0.04 \\times 0.512 = 0.2048$.",
      "Poisson: $P(X=k)=\\dfrac{e^{-\\lambda}\\lambda^k}{k!}$.",
      "Binomial: mean $=np=20\\times 0.3=6$; variance $=np(1-p)=20\\times 0.3\\times 0.7=4.2$.",
      "For a binomial distribution $\\operatorname{Var}(X) = np(1-p) = 10 \\times 0.1 \\times 0.9 = 0.9$."
    ],
    "examTipZh": "DSE 作答「概率分佈（高階）」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Probability distributions”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$1$ 是期望值 $np$；$0.1$ 誤用 $np^2$；$0.949$ 是標準差，即方差的平方根。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "m1_normal_calc": {
    "subjectId": "m1",
    "topicId": "m1_normal_calc",
    "titleZh": "正態分佈計算",
    "titleEn": "Normal distribution — calculation",
    "conceptZh": "標準化：$Z=\\dfrac{65-50}{10}=1.5$，故 $P(X>65)=P(Z>1.5)=0.0668$。",
    "conceptEn": "Standardise: $Z=\\dfrac{65-50}{10}=1.5$, so $P(X>65)=P(Z>1.5)=0.0668$.",
    "mustKnowZh": [
      "標準化：$Z=\\dfrac{65-50}{10}=1.5$，故 $P(X>65)=P(Z>1.5)=0.0668$。",
      "標準分數 $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{58 - 50}{4} = 2$。",
      "標準分數 $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{42 - 50}{4} = -2$。",
      "標準分數 $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{54 - 50}{4} = \\dfrac{4}{4} = 1$。"
    ],
    "mustKnowEn": [
      "Standardise: $Z=\\dfrac{65-50}{10}=1.5$, so $P(X>65)=P(Z>1.5)=0.0668$.",
      "The standard score is $z = \\frac{x - \\mu}{\\sigma} = \\frac{58 - 50}{4} = 2$, giving the number of standard deviations from the mean, with a negative value meaning below the mean.",
      "The standard score is $z = \\frac{x - \\mu}{\\sigma} = \\frac{42 - 50}{4} = -2$, giving the number of standard deviations from the mean, with a negative value meaning below the mean.",
      "The standard score is $z = \\frac{x - \\mu}{\\sigma} = \\frac{54 - 50}{4} = \\frac{4}{4} = 1$."
    ],
    "examTipZh": "DSE 作答「正態分佈計算」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Normal distribution — calculation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$8$ 只求了差而未除以標準差；$27$ 把減號寫成加號；$0.5$ 上下倒轉。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "differentiation": {
    "subjectId": "m1",
    "topicId": "differentiation",
    "titleZh": "微分",
    "titleEn": "Differentiation",
    "conceptZh": "用冪法則 $\\frac{d}{dx}x^n = n x^{n-1}$，逐項求導得 $3x^2 - 6x + 4$。",
    "conceptEn": "By the power rule $\\frac{d}{dx}x^n = n x^{n-1}$, differentiating term by term gives $3x^2 - 6x + 4$.",
    "mustKnowZh": [
      "用冪法則 $\\frac{d}{dx}x^n = n x^{n-1}$，逐項求導得 $3x^2 - 6x + 4$。",
      "用冪法則 $\\frac{d}{dx}x^n = n x^{n-1}$，逐項求導得 $3x^2 + 4x - 5$。",
      "用冪法則 $\\frac{d}{dx}x^n = n x^{n-1}$，逐項求導得 $3x^2 - 8x - 7$。",
      "用冪法則 $\\frac{d}{dx}x^n = n x^{n-1}$，逐項求導得 $12x^2 + 6x + 6$。"
    ],
    "mustKnowEn": [
      "By the power rule $\\frac{d}{dx}x^n = n x^{n-1}$, differentiating term by term gives $3x^2 - 6x + 4$.",
      "By the power rule $\\frac{d}{dx}x^n = n x^{n-1}$, differentiating term by term gives $3x^2 + 4x - 5$.",
      "By the power rule $\\frac{d}{dx}x^n = n x^{n-1}$, differentiating term by term gives $3x^2 - 8x - 7$.",
      "By the power rule $\\frac{d}{dx}x^n = n x^{n-1}$, differentiating term by term gives $12x^2 + 6x + 6$."
    ],
    "examTipZh": "DSE 作答「微分」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Differentiation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2x^{2}$ 漏了 $\\times n$；$6x^{3}$ 漏了指數減一。",
    "commonTrapEn": "$2x^{2}$ forgets $\\times n$.",
    "source": "generated"
  },
  "integration": {
    "subjectId": "m1",
    "topicId": "integration",
    "titleZh": "積分",
    "titleEn": "Integration",
    "conceptZh": "冪的積分：$\\int ax^n\\,dx = \\dfrac{a}{n+1}x^{n+1}+C = x^{2}+C$。",
    "conceptEn": "$\\int ax^n\\,dx = \\frac{a}{n+1}x^{n+1}+C = x^{2}+C$.",
    "mustKnowZh": [
      "冪的積分：$\\int ax^n\\,dx = \\dfrac{a}{n+1}x^{n+1}+C = x^{2}+C$。",
      "$\\int_0^{3} 2x\\,dx = \\left[x^{2}\\right]_0^{3} = 3^{2} = 9$。",
      "$\\int_0^{2} 3x^{2}\\,dx = \\left[x^{3}\\right]_0^{2} = 2^{3} = 8$。",
      "$\\dfrac{1}{x}$ 的原函數是 $\\ln|x|$（並非 $\\dfrac{x^{0}}{0}$ —— 冪法則在指數為 $-1$ 時失效，這正是本題要考的例外）。"
    ],
    "mustKnowEn": [
      "$\\int ax^n\\,dx = \\frac{a}{n+1}x^{n+1}+C = x^{2}+C$.",
      "$\\int_0^{3} 2x\\,dx = 9$.",
      "$\\int_0^{2} 3x^{2}\\,dx = 8$.",
      "The antiderivative of $\\frac{1}{x}$ is $\\ln|x|$, not $\\frac{x^{0}}{0}$ — the power rule fails at exponent $-1$, and that exception is exactly what this item tests."
    ],
    "examTipZh": "DSE 作答「積分」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Integration”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2x^{2}+C$ 漏了除以 $(n+1)$。",
    "commonTrapEn": "$2x^{2}+C$ forgets $\\div(n+1)$.",
    "source": "generated"
  },
  "binomial_distribution": {
    "subjectId": "m1",
    "topicId": "binomial_distribution",
    "titleZh": "二項分佈",
    "titleEn": "Binomial Distribution",
    "conceptZh": "二項分佈 $E(X) = np = 5 \\times \\frac{1}{5} = 1$。",
    "conceptEn": "Binomial $E(X)=np=1$.",
    "mustKnowZh": [
      "二項分佈 $E(X) = np = 5 \\times \\frac{1}{5} = 1$。",
      "$P(X=r) = \\binom{4}{2}\\left(\\tfrac12\\right)^{2}\\left(\\tfrac12\\right)^{2} = \\dfrac{6}{2^{4}} = \\frac{3}{8}$。",
      "用補集：$P(X\\ge1) = 1 - P(X=0) = 1 - \\left(\\tfrac12\\right)^{3} = 1 - \\dfrac{1}{2^{3}} = \\frac{7}{8}$。",
      "二項分佈的方差為 $\\operatorname{Var}(X) = npq$，其中 $q = 1 - p = \\frac{4}{5}$。"
    ],
    "mustKnowEn": [
      "Binomial $E(X)=np=1$.",
      "$P(X=r) = \\frac{\\binom{4}{2}}{2^{4}} = \\frac{3}{8}$.",
      "Complement: $P(X\\ge1)=1-\\left(\\tfrac12\\right)^{3}=\\frac{7}{8}$.",
      "For a binomial distribution $\\operatorname{Var}(X) = npq$ with $q = 1 - p = \\frac{4}{5}$, giving $25 \\times \\frac{1}{5} \\times \\frac{4}{5} = 4$."
    ],
    "examTipZh": "DSE 作答「二項分佈」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Binomial Distribution”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.8$ 是方差 $np(1-p)$。",
    "commonTrapEn": "$0.8$ is the variance $np(1-p)$.",
    "source": "generated"
  }
}
