#!/usr/bin/env -S npx tsx
// ============================================================================
// repairs/m1-03.mts — rationale repair, batch M1-03 (42 questions, 10 templates)
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repairs/m1-03.mts          → writes the batch file
//   npx tsx scripts/qbank/repair-rationale.mts --batch M1-03   → applies it
//   npx tsx scripts/qbank/restore-computed.mts --batch M1-03   → back into practice
//
// Founders' replies 31-1c, 31-2b and 32a (2026-10-04, 2026-10-08): the second
// computed batch. m1_rep_0011–0012 (the rest of the quotient template M1-01 began),
// 0057–0062 and 0069–0102.
//
// Left out on purpose: m1_rep_0063–0068 (comparing two papers by standard score).
// In 0067 both standard scores are 2, yet the option marked correct reads
// "乙卷，因為其標準分數較高（甲 z = 2，乙 z = 2）". That is a wrong question, not a
// wrong explanation, so it stays withdrawn and goes to the founders; the template
// is held back whole.
//
// Same method as M1-02: parameters from the stem, the four options recomputed and
// each stored option matched to exactly one of them, one note per option. Several
// old explanations described the wrong options inaccurately (for example the
// binomial-variance distractor n(1−p) was called "mixing up p and 1−p"); each note
// says what that option actually computes.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH = 'M1-03'
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => `m1_rep_${String(a + i).padStart(4, '0')}`)
const IDS = [...range(11, 12), ...range(57, 62), ...range(69, 102)]

type Text = { zh: string; en: string }
interface Note { optionId: number; kind: string; zh: string; en: string }
interface Built { template: string; params: Record<string, number>; expected: Record<string, string>; notes: Record<string, Text>; explanation: Text }

/** Up to four decimals, no trailing zeros. */
const num = (v: number) => String(Math.round(v * 1e4) / 1e4)
const signed = (c: number) => (c < 0 ? `− ${-c}` : `+ ${c}`)

function quotient(k: number, c: number): Built {
  const correct = `$\\dfrac{${k * c}}{(x + ${c})^{2}}$`
  return {
    template: 'quotient-kx-over-x+c',
    params: { k, c },
    expected: { correct, reversed: `$\\dfrac{-${k * c}}{(x + ${c})^{2}}$`, numeratorOnly: `$\\dfrac{${k}}{(x + ${c})^{2}}$`, ratio: `$${k}$` },
    // Same notes as M1-01 (scripts/qbank/repairs/m1-01.mts), which repaired the first four of this template.
    notes: {
      correct: { zh: `正確。分子 $u'v - uv' = ${k}(x + ${c}) - ${k}x = ${k * c}$，分母為 $(x + ${c})^{2}$。`, en: `Correct. The numerator is $u'v - uv' = ${k}(x + ${c}) - ${k}x = ${k * c}$ and the denominator is $(x + ${c})^{2}$.` },
      reversed: { zh: `分子寫成 $uv' - u'v$，減法次序調轉了，所以答案的正負號相反。商法則的分子必須是 $u'v$ 在前。`, en: `The numerator was written as $uv' - u'v$, the subtraction the wrong way round, so the sign is flipped. In the quotient rule $u'v$ always comes first.` },
      numeratorOnly: { zh: `分子只寫了 $u' = ${k}$，漏了 $u'v - uv'$ 的結構。`, en: `The numerator is just $u' = ${k}$; the $u'v - uv'$ structure is missing.` },
      ratio: { zh: `分別對分子和分母求導再相除：$\\dfrac{u'}{v'} = \\dfrac{${k}}{1} = ${k}$。商的導數並不等於導數的商。`, en: `This differentiates the top and the bottom separately and divides: $\\dfrac{u'}{v'} = \\dfrac{${k}}{1} = ${k}$. The derivative of a quotient is not the quotient of the derivatives.` },
    },
    explanation: {
      zh: `用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = ${k}x$、$v = x + ${c}$，則 $u' = ${k}$、$v' = 1$。分子 $= ${k}(x + ${c}) - ${k}x \\cdot 1 = ${k * c}$，故導數為 ${correct}。分子的 $x$ 項恰好抵銷，是這類題目的特徵。`,
      en: `Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = ${k}x$ and $v = x + ${c}$, so $u' = ${k}$ and $v' = 1$. The numerator is $${k}(x + ${c}) - ${k}x \\cdot 1 = ${k * c}$, giving ${correct}. The $x$ terms cancel exactly, which is characteristic of this type.`,
    },
  }
}

function zToX(mu: number, sigma: number, z: number): Built {
  const x = num(mu + z * sigma)
  const off = num(z * sigma)
  const above = z > 0
  return {
    template: 'normal-x-from-z',
    params: { mu, sigma, z },
    expected: { correct: `$${x}$`, reversed: `$${num(mu - z * sigma)}$`, offsetOnly: `$${off}$`, zPlusMean: `$${num(mu + z)}$` },
    notes: {
      correct: { zh: `正確。$x = \\mu + z\\sigma = ${mu} + (${z})(${sigma}) = ${x}$。`, en: `Correct. $x = \\mu + z\\sigma = ${mu} + (${z})(${sigma}) = ${x}$.` },
      reversed: {
        zh: `用了 $\\mu - z\\sigma$，方向反了：$z ${above ? '> 0' : '< 0'}$ 表示觀測值${above ? '高於' : '低於'}平均值。`,
        en: `This uses $\\mu - z\\sigma$, the wrong direction: $z ${above ? '> 0' : '< 0'}$ means the value is ${above ? 'above' : 'below'} the mean.`,
      },
      offsetOnly: { zh: `$z\\sigma = ${off}$ 只是偏離平均值的距離，還要加上平均值 $${mu}$。`, en: `$z\\sigma = ${off}$ is only the distance from the mean; the mean $${mu}$ still has to be added.` },
      zPlusMean: {
        zh: `把 $z$ 直接加上平均值，漏了乘以標準差 $${sigma}$：$z$ 是「多少個標準差」，要先乘以標準差才是實際數值。`,
        en: `This adds $z$ straight to the mean without multiplying by the standard deviation $${sigma}$: $z$ counts standard deviations, so multiply first.`,
      },
    },
    explanation: {
      zh: `把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉，得 $x = \\mu + z\\sigma = ${mu} + (${z})(${sigma}) = ${x}$。$z ${above ? '> 0' : '< 0'}$，所以觀測值${above ? '高於' : '低於'}平均值 $${mu}$。`,
      en: `Rearrange $z = \\dfrac{x - \\mu}{\\sigma}$ to $x = \\mu + z\\sigma = ${mu} + (${z})(${sigma}) = ${x}$. Since $z ${above ? '> 0' : '< 0'}$, the value is ${above ? 'above' : 'below'} the mean $${mu}$.`,
    },
  }
}

function normalApprox(n: number, p: number): Built {
  const q = Math.round((1 - p) * 1e6) / 1e6
  const mean = num(n * p)
  const v = num(n * p * q)
  const sd = num(Math.sqrt(n * p * q))
  const ms = (m: string, s: string) => `$\\mu = ${m}$，$\\sigma = ${s}$`
  return {
    template: 'binomial-normal-approximation',
    params: { n, p },
    expected: { correct: ms(mean, sd), varianceAsSd: ms(mean, v), failuresMean: ms(num(n * q), sd), missingQ: ms(mean, num(Math.sqrt(n * p))) },
    notes: {
      correct: { zh: `正確。$\\mu = np = ${mean}$，$\\sigma = \\sqrt{np(1-p)} = \\sqrt{${v}} \\approx ${sd}$。`, en: `Correct. $\\mu = np = ${mean}$ and $\\sigma = \\sqrt{np(1-p)} = \\sqrt{${v}} \\approx ${sd}$.` },
      varianceAsSd: { zh: `$${v}$ 是變異數 $np(1-p)$；標準差要再開平方根。`, en: `$${v}$ is the variance $np(1-p)$; the standard deviation is its square root.` },
      failuresMean: { zh: `$n(1-p) = ${num(n * q)}$ 是失敗次數的期望值；題目問的平均值是 $np$。`, en: `$n(1-p) = ${num(n * q)}$ is the expected number of failures; the mean asked for is $np$.` },
      missingQ: { zh: `$\\sqrt{np} \\approx ${num(Math.sqrt(n * p))}$ 漏了因子 $(1-p)$；變異數是 $np(1-p)$。`, en: `$\\sqrt{np} \\approx ${num(Math.sqrt(n * p))}$ leaves out the factor $(1-p)$; the variance is $np(1-p)$.` },
    },
    explanation: {
      zh: `逼近的正態分佈沿用二項分佈的平均值與變異數：$\\mu = np = ${n} \\times ${p} = ${mean}$，$\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(q)} = ${v}$。標準差是變異數的平方根：$\\sigma = \\sqrt{${v}} \\approx ${sd}$。`,
      en: `The approximating normal distribution keeps the binomial mean and variance: $\\mu = np = ${n} \\times ${p} = ${mean}$ and $\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(q)} = ${v}$. The standard deviation is the square root of the variance: $\\sigma = \\sqrt{${v}} \\approx ${sd}$.`,
    },
  }
}

function definite(k: number, a: number, b: number): Built {
  const F = (t: number) => (k * t * t) / 2
  const ans = num(F(b) - F(a))
  return {
    template: 'definite-integral-kx',
    params: { k, a, b },
    expected: { correct: `$${ans}$`, reversed: `$${num(F(a) - F(b))}$`, upperOnly: `$${num(F(b))}$`, constantTimesLength: `$${num(k * (b - a))}$` },
    notes: {
      correct: { zh: `正確。$F(${b}) - F(${a}) = ${num(F(b))} - ${num(F(a))} = ${ans}$。`, en: `Correct. $F(${b}) - F(${a}) = ${num(F(b))} - ${num(F(a))} = ${ans}$.` },
      reversed: { zh: `用了下限減上限 $F(${a}) - F(${b})$，所以正負號相反。`, en: `This takes the lower limit minus the upper, $F(${a}) - F(${b})$, so the sign is flipped.` },
      upperOnly: { zh: `只代入了上限：$F(${b}) = ${num(F(b))}$，沒有減去 $F(${a}) = ${num(F(a))}$。`, en: `Only the upper limit was used: $F(${b}) = ${num(F(b))}$, without subtracting $F(${a}) = ${num(F(a))}$.` },
      constantTimesLength: {
        zh: `$${k} \\times (${b} - ${a}) = ${num(k * (b - a))}$：把 $f(x) = ${k}x$ 當成常數 $${k}$ 乘以區間長度。只有被積函數是常數時才可以這樣做。`,
        en: `$${k} \\times (${b} - ${a}) = ${num(k * (b - a))}$ treats $f(x) = ${k}x$ as the constant $${k}$ times the interval length, which works only for a constant integrand.`,
      },
    },
    explanation: {
      zh: `先求原函數：$F(x) = \\displaystyle\\int ${k}x \\, dx = \\dfrac{${k}x^{2}}{2}$。再代入上下限相減：$F(${b}) - F(${a}) = \\dfrac{${k}(${b})^{2}}{2} - \\dfrac{${k}(${a})^{2}}{2} = ${num(F(b))} - ${num(F(a))} = ${ans}$。`,
      en: `Find an antiderivative: $F(x) = \\displaystyle\\int ${k}x \\, dx = \\dfrac{${k}x^{2}}{2}$. Then subtract the lower limit from the upper: $F(${b}) - F(${a}) = \\dfrac{${k}(${b})^{2}}{2} - \\dfrac{${k}(${a})^{2}}{2} = ${num(F(b))} - ${num(F(a))} = ${ans}$.`,
    },
  }
}

function throughPoint(k: number, a: number, b: number): Built {
  const h = k / 2
  if (!Number.isInteger(h)) throw new Error(`throughPoint: ${k}/2 is not an integer`)
  const C = b - h * a * a
  return {
    template: 'antiderivative-through-point',
    params: { k, a, b },
    expected: {
      correct: `$y = ${h}x^{2} ${signed(C)}$`,
      noConstant: `$y = ${h}x^{2}$`,
      notHalved: `$y = ${k}x^{2} ${signed(C)}$`,
      signFlipped: `$y = ${h}x^{2} ${signed(-C)}$`,
    },
    notes: {
      correct: { zh: `正確。$y = ${h}x^{2} + C$，代入 $(${a}, ${b})$ 得 $C = ${C}$。`, en: `Correct. $y = ${h}x^{2} + C$; substituting $(${a}, ${b})$ gives $C = ${C}$.` },
      noConstant: { zh: `漏了積分常數 $C$。題目給出曲線經過的點，就是要用它求出 $C$。`, en: `The constant of integration $C$ is missing. The given point is there to find $C$.` },
      notHalved: { zh: `$${k}x$ 的原函數是 $\\dfrac{${k}x^{2}}{2} = ${h}x^{2}$；這裏沒有除以 $2$。`, en: `An antiderivative of $${k}x$ is $\\dfrac{${k}x^{2}}{2} = ${h}x^{2}$; this one is not divided by $2$.` },
      signFlipped: { zh: `常數的正負號錯了：由 $${b} = ${h}(${a})^{2} + C$ 得 $C = ${C}$。`, en: `The constant has the wrong sign: $${b} = ${h}(${a})^{2} + C$ gives $C = ${C}$.` },
    },
    explanation: {
      zh: `不定積分得 $y = \\dfrac{${k}x^{2}}{2} + C = ${h}x^{2} + C$，其中 $C$ 是積分常數，要用題目給的點定出來。代入 $(${a}, ${b})$：$${b} = ${h}(${a})^{2} + C$，得 $C = ${C}$。`,
      en: `Integrating gives $y = \\dfrac{${k}x^{2}}{2} + C = ${h}x^{2} + C$, where the constant $C$ is fixed by the given point. Substituting $(${a}, ${b})$: $${b} = ${h}(${a})^{2} + C$, so $C = ${C}$.`,
    },
  }
}

function area(c: number, b: number): Built {
  const exact = (c * b ** 3) / 3
  const unit = (v: number) => `$${num(v)}$ 平方單位`
  const cx = `${c === 1 ? '' : c}x^{2}`
  const cb3 = `${c === 1 ? '' : c}(${b})^{3}`
  return {
    template: 'area-under-cx^2',
    params: { c, b },
    expected: { correct: unit(exact), height: unit(c * b * b), halfInstead: unit((c * b ** 3) / 2), halved: unit(exact / 2) },
    notes: {
      correct: { zh: `正確。$\\displaystyle\\int_{0}^{${b}} ${cx}\\,dx = \\dfrac{${cb3}}{3} \\approx ${num(exact)}$。`, en: `Correct. $\\displaystyle\\int_{0}^{${b}} ${cx}\\,dx = \\dfrac{${cb3}}{3} \\approx ${num(exact)}$.` },
      height: { zh: `$${num(c * b * b)}$ 是 $x = ${b}$ 時曲線的高度 $y$，不是面積；面積要用積分求。`, en: `$${num(c * b * b)}$ is the height $y$ of the curve at $x = ${b}$, not an area; the area needs an integral.` },
      halfInstead: { zh: `原函數除錯了數：$x^{2}$ 的原函數是 $\\dfrac{x^{3}}{3}$，不是 $\\dfrac{x^{3}}{2}$。`, en: `The antiderivative divides by the wrong number: for $x^{2}$ it is $\\dfrac{x^{3}}{3}$, not $\\dfrac{x^{3}}{2}$.` },
      halved: { zh: `把正確面積再除以 $2$，似是套用了三角形面積公式；曲線下的區域不是三角形。`, en: `This halves the correct area, as if using the triangle formula; the region under a curve is not a triangle.` },
    },
    explanation: {
      zh: `曲線下的面積由定積分求出：$\\displaystyle\\int_{0}^{${b}} ${cx}\\,dx = \\left[\\dfrac{${c === 1 ? '' : c}x^{3}}{3}\\right]_{0}^{${b}} = \\dfrac{${cb3}}{3} - 0 \\approx ${num(exact)}$ 平方單位。`,
      en: `The area under the curve is a definite integral: $\\displaystyle\\int_{0}^{${b}} ${cx}\\,dx = \\left[\\dfrac{${c === 1 ? '' : c}x^{3}}{3}\\right]_{0}^{${b}} = \\dfrac{${cb3}}{3} - 0 \\approx ${num(exact)}$ square units.`,
    },
  }
}

function binomialVar(n: number, p: number): Built {
  const q = Math.round((1 - p) * 1e6) / 1e6
  const v = n * p * q
  return {
    template: 'binomial-variance',
    params: { n, p },
    expected: { correct: `$${num(v)}$`, mean: `$${num(n * p)}$`, sd: `$${num(Math.sqrt(v))}$`, missingP: `$${num(n * q)}$` },
    notes: {
      correct: { zh: `正確。$np(1-p) = ${n} \\times ${p} \\times ${num(q)} = ${num(v)}$。`, en: `Correct. $np(1-p) = ${n} \\times ${p} \\times ${num(q)} = ${num(v)}$.` },
      mean: { zh: `$np = ${num(n * p)}$ 是期望值 $E(X)$，不是變異數；變異數還要乘以 $(1-p)$。`, en: `$np = ${num(n * p)}$ is the expected value $E(X)$, not the variance; the variance also multiplies by $(1-p)$.` },
      sd: { zh: `$\\sqrt{${num(v)}} \\approx ${num(Math.sqrt(v))}$ 是標準差；變異數不用開方。`, en: `$\\sqrt{${num(v)}} \\approx ${num(Math.sqrt(v))}$ is the standard deviation; the variance is not square-rooted.` },
      missingP: { zh: `$n(1-p) = ${num(n * q)}$ 漏了因子 $p$；變異數是 $np(1-p)$。`, en: `$n(1-p) = ${num(n * q)}$ leaves out the factor $p$; the variance is $np(1-p)$.` },
    },
    explanation: {
      zh: `二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(q)} = ${num(v)}$。期望值 $np$ 與變異數 $np(1-p)$ 用同一組參數，但意義不同。`,
      en: `The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = ${n} \\times ${p} \\times ${num(q)} = ${num(v)}$. The mean $np$ and the variance $np(1-p)$ use the same parameters but measure different things.`,
    },
  }
}

function atLeastOne(n: number, p: number): Built {
  const q = Math.round((1 - p) * 1e6) / 1e6
  const p0 = q ** n
  const p1 = n * p * q ** (n - 1)
  return {
    template: 'binomial-at-least-one',
    params: { n, p },
    expected: { correct: `$${num(1 - p0)}$`, complement: `$${num(p0)}$`, exactlyOne: `$${num(p1)}$`, expectation: `$${num(n * p)}$` },
    notes: {
      correct: { zh: `正確。$1 - P(X = 0) = 1 - (${num(q)})^{${n}} \\approx ${num(1 - p0)}$。`, en: `Correct. $1 - P(X = 0) = 1 - (${num(q)})^{${n}} \\approx ${num(1 - p0)}$.` },
      complement: { zh: `$(${num(q)})^{${n}} \\approx ${num(p0)}$ 是 $P(X = 0)$，即一次也沒有成功；題目問的是它的補集。`, en: `$(${num(q)})^{${n}} \\approx ${num(p0)}$ is $P(X = 0)$, no success at all; the question asks for its complement.` },
      exactlyOne: { zh: `$${num(p1)}$ 是 $P(X = 1)$，只計了恰好一次；「至少一次」還包括兩次或以上。`, en: `$${num(p1)}$ is $P(X = 1)$, exactly one success; "at least one" also includes two or more.` },
      expectation: { zh: `$np = ${num(n * p)}$ 是期望值（次數），不是概率。`, en: `$np = ${num(n * p)}$ is the expected number of successes, not a probability.` },
    },
    explanation: {
      zh: `「至少一次」的反面是「一次也沒有」：$P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - ${p})^{${n}} \\approx 1 - ${num(p0)} = ${num(1 - p0)}$。用補集只需計一項。`,
      en: `The opposite of "at least one" is "none": $P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - ${p})^{${n}} \\approx 1 - ${num(p0)} = ${num(1 - p0)}$. The complement needs only one term.`,
    },
  }
}

function coefficientSum(a: number, b: number, n: number): Built {
  const ans = (a + b) ** n
  return {
    template: 'sum-of-coefficients',
    params: { a, b, n },
    expected: { correct: `$${ans}$`, termwise: `$${a ** n + b ** n}$`, twoToN: `$${2 ** n}$`, product: `$${(a + b) * n}$` },
    notes: {
      correct: { zh: `正確。代入 $x = 1$：$(${a} + ${b})^{${n}} = ${ans}$。`, en: `Correct. Put $x = 1$: $(${a} + ${b})^{${n}} = ${ans}$.` },
      termwise: { zh: `$${a}^{${n}} + ${b}^{${n}} = ${a ** n + b ** n}$：把指數分別作用在兩項上，但 $(u + v)^{${n}} \\neq u^{${n}} + v^{${n}}$。`, en: `$${a}^{${n}} + ${b}^{${n}} = ${a ** n + b ** n}$ applies the power to each term separately, but $(u + v)^{${n}} \\neq u^{${n}} + v^{${n}}$.` },
      twoToN: { zh: `$2^{${n}} = ${2 ** n}$ 是 $(x + 1)^{${n}}$ 的係數之和，即把兩個係數都當成 $1$。`, en: `$2^{${n}} = ${2 ** n}$ is the coefficient sum of $(x + 1)^{${n}}$, as if both coefficients were $1$.` },
      product: { zh: `$(${a} + ${b}) \\times ${n} = ${(a + b) * n}$：把乘方當成乘法。`, en: `$(${a} + ${b}) \\times ${n} = ${(a + b) * n}$ treats the power as a multiplication.` },
    },
    explanation: {
      zh: `展開式對任何 $x$ 都成立。代入 $x = 1$，每一項的 $x^{k}$ 都變成 $1$，剩下的就是所有係數之和：$(${a} \\times 1 + ${b})^{${n}} = ${a + b}^{${n}} = ${ans}$，毋須展開。`,
      en: `The expansion holds for every $x$. Putting $x = 1$ turns each $x^{k}$ into $1$, leaving the sum of all coefficients: $(${a} \\times 1 + ${b})^{${n}} = ${a + b}^{${n}} = ${ans}$, with no expanding needed.`,
    },
  }
}

function standardError(sigma: number, n: number): Built {
  const rt = Math.sqrt(n)
  if (!Number.isInteger(rt)) throw new Error(`standardError: ${n} is not a perfect square`)
  return {
    template: 'standard-error-of-mean',
    params: { sigma, n },
    expected: { correct: `$${num(sigma / rt)}$`, populationSd: `$${sigma}$`, overN: `$${num(sigma / n)}$`, times: `$${num(sigma * rt)}$` },
    notes: {
      correct: { zh: `正確。$\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sigma}}{\\sqrt{${n}}} = \\dfrac{${sigma}}{${rt}} = ${num(sigma / rt)}$。`, en: `Correct. $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sigma}}{\\sqrt{${n}}} = \\dfrac{${sigma}}{${rt}} = ${num(sigma / rt)}$.` },
      populationSd: { zh: `$${sigma}$ 是總體的標準差；樣本平均數的波動較小，要除以 $\\sqrt{n}$。`, en: `$${sigma}$ is the population standard deviation; the sample mean varies less, so divide by $\\sqrt{n}$.` },
      overN: { zh: `$\\dfrac{${sigma}}{${n}} \\approx ${num(sigma / n)}$ 除以了 $n$，應除以 $\\sqrt{n}$。`, en: `$\\dfrac{${sigma}}{${n}} \\approx ${num(sigma / n)}$ divides by $n$; it should be $\\sqrt{n}$.` },
      times: { zh: `$${sigma} \\times \\sqrt{${n}} = ${num(sigma * rt)}$ 把除號當成乘號；樣本越大，標準誤應該越小。`, en: `$${sigma} \\times \\sqrt{${n}} = ${num(sigma * rt)}$ multiplies instead of dividing; a larger sample should give a smaller standard error.` },
    },
    explanation: {
      zh: `樣本平均數的標準差為 $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sigma}}{\\sqrt{${n}}} = \\dfrac{${sigma}}{${rt}} = ${num(sigma / rt)}$。樣本越大，樣本平均數越集中；但標準誤隨樣本量的平方根下降，所以樣本量要增至四倍，標準誤才減半。`,
      en: `The standard deviation of the sample mean is $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{${sigma}}{\\sqrt{${n}}} = \\dfrac{${sigma}}{${rt}} = ${num(sigma / rt)}$. Larger samples give a more concentrated mean, but the standard error falls with the square root of the sample size: four times the sample halves it.`,
    },
  }
}

function build(content: string): Built {
  let m: RegExpMatchArray | null
  if ((m = content.match(/\\dfrac\{(\d+)x\}\{x \+ (\d+)\}/))) return quotient(+m[1], +m[2])
  if ((m = content.match(/N\((\d+), (\d+)\^\{2\}\)\$。已知某觀測值的標準分數為 \$z = (-?[\d.]+)\$/))) return zToX(+m[1], +m[2], +m[3])
  if ((m = content.match(/B\((\d+), ([\d.]+)\)\$。當 \$n\$ 足夠大時可用正態分佈逼近/))) return normalApprox(+m[1], +m[2])
  if ((m = content.match(/f\(x\) = (\d+)x\$。試求 \$f\$ 在區間 \$\[(\d+), (\d+)\]\$ 上的定積分值/))) return definite(+m[1], +m[2], +m[3])
  if ((m = content.match(/\\dfrac\{dy\}\{dx\} = (\d+)x\$，且曲線經過點 \$\((\d+), (\d+)\)\$/))) return throughPoint(+m[1], +m[2], +m[3])
  if ((m = content.match(/曲線 \$y = (\d*)x\^\{2\}\$ 與 \$x\$ 軸及直線 \$x = (\d+)\$/))) return area(m[1] ? +m[1] : 1, +m[2])
  if ((m = content.match(/B\((\d+), ([\d.]+)\)\$。求 \$\\mathrm\{Var\}\(X\)\$/))) return binomialVar(+m[1], +m[2])
  if ((m = content.match(/B\((\d+), ([\d.]+)\)\$。求 \$P\(X \\geq 1\)\$/))) return atLeastOne(+m[1], +m[2])
  if ((m = content.match(/求 \$\((\d+)x \+ (\d+)\)\^\{(\d+)\}\$ 展開式中【所有係數之和】/))) return coefficientSum(+m[1], +m[2], +m[3])
  if ((m = content.match(/總體的標準差為 \$(\d+)\$。現從中隨機抽取一個大小為 \$(\d+)\$ 的樣本/))) return standardError(+m[1], +m[2])
  throw new Error(`stem matches no template: ${content}`)
}

const mod = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (mod.default?.getSubjectQuestionsRaw ? mod.default : mod) as {
  getSubjectQuestionsRaw: (s: string) => Array<{ id: string; content: string; options: string[]; optionsEn?: string[]; correctIndex: number }>
}
const bank = new Map(idx.getSubjectQuestionsRaw('m1').map((q) => [q.id, q]))

const out = []
for (const id of IDS) {
  const q = bank.get(id)
  if (!q) throw new Error(`${id} not in the raw m1 bank`)
  const t = build(q.content)
  const notes: Note[] = q.options.map((opt, optionId) => {
    const kinds = Object.entries(t.expected).filter(([, s]) => s === opt).map(([k]) => k)
    if (kinds.length !== 1) throw new Error(`${id} option ${optionId} "${opt}" matched ${kinds.length} kinds`)
    return { optionId, kind: kinds[0], ...t.notes[kinds[0]] }
  })
  const correct = notes.filter((n) => n.kind === 'correct').map((n) => n.optionId)
  if (correct.length !== 1 || correct[0] !== q.correctIndex) throw new Error(`${id}: recomputed correct option ${correct} ≠ stored ${q.correctIndex}`)
  // Options with words (σ/μ pairs, square units) keep their own English text.
  const en = q.optionsEn && q.optionsEn.some((o, i) => o !== q.options[i]) ? q.optionsEn : q.options
  out.push({ id, template: t.template, params: t.params, options: q.options, optionsEn: en, explanation: t.explanation.zh, explanationEn: t.explanation.en, optionNotes: notes })
}

mkdirSync(join(ROOT, 'data/questions/rationale-repairs'), { recursive: true })
writeFileSync(
  join(ROOT, `data/questions/rationale-repairs/${BATCH}.json`),
  JSON.stringify({ batch: BATCH, subject: 'm1', computed: true, generatedBy: 'scripts/qbank/repairs/m1-03.mts', repairs: out }, null, 2) + '\n',
)
console.log(`✓ ${BATCH}: ${out.length} repairs written to data/questions/rationale-repairs/${BATCH}.json`)
