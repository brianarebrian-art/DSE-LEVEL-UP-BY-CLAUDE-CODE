#!/usr/bin/env -S npx tsx
// ============================================================================
// repairs/m2-01.mts — rationale repair, batch M2-01 (36 questions, 7 templates)
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repairs/m2-01.mts          → writes the batch file
//   npx tsx scripts/qbank/repair-rationale.mts --batch M2-01   → applies it
//   npx tsx scripts/qbank/restore-computed.mts --batch M2-01   → back into practice
//
// Founders' reply 34a (2026-10-08): continue the computed repairs with M2 and physics,
// and stop to ask about anything that cannot be recomputed. Every withdrawn M2
// question is a fixed-number template, so all 36 are here.
//
// Same method as M1-02 to M1-04: parameters from the stem, the four options
// recomputed, each stored option (Chinese and English at the same index) matched to
// exactly one of them, one note per option. Several old explanations misdescribed
// the distractors, for example:
//   · scalar multiple: "只乘了主對角線" was called a confusion with multiplying by a
//     multiple of the identity matrix, but (nI)A = nA multiplies every entry;
//   · singular matrix: both remaining distractors were said to swap entries, but one
//     of them (a·c − b) does not come from the determinant at all;
//   · perpendicular vectors: one distractor was never explained.
// Where a distractor has no clear method behind it, the note substitutes it back
// and shows the condition fails, instead of inventing a reason.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH = 'M2-01'
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => `m2_rep_${String(a + i).padStart(4, '0')}`)
const IDS = [...range(1, 12), ...range(22, 37), ...range(48, 51), ...range(65, 68)]

type Text = { zh: string; en: string }
interface Note { optionId: number; kind: string; zh: string; en: string }
interface Built {
  template: string
  params: Record<string, number>
  expected: Record<string, string>
  expectedEn: Record<string, string>
  notes: Record<string, Text>
  explanation: Text
}

/** Up to four decimals, no trailing zeros. */
const num = (v: number) => String(Math.round(v * 1e4) / 1e4)
const same = (e: Record<string, string>) => e
/** "ak" with the coefficient 1 left out. */
const coef = (a: number, v: string) => (a === 1 ? v : `${a}${v}`)
const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))
/** p/q in lowest terms: an integer, or \dfrac. */
const frac = (p: number, q: number) => {
  const g = gcd(p, q)
  const [n, d] = [p / g, q / g]
  return d === 1 ? `$${n}$` : `$\\dfrac{${n}}{${d}}$`
}
const fracBare = (p: number, q: number) => frac(p, q).slice(1, -1)

function singular(a: number, b: number, c: number): Built {
  const bc = b * c
  const k = bc / a, swapped = (a * b) / c, combined = a * c - b
  const det = (x: number) => num(a * x - bc)
  const kv = (x: number) => `$k = ${num(x)}$`
  const expected = { correct: kv(k), signFlip: kv(-k), swapped: kv(swapped), combined: kv(combined) }
  const detLine = `$\\det A = ${coef(a, 'k')} - (${b})(${c}) = ${coef(a, 'k')} - ${bc}$`
  const detLineEn = detLine
  return {
    template: 'singular-2x2-find-k',
    params: { a, b, c },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。${detLine}，令其為 $0$ 得 $k = ${num(k)}$。`, en: `Correct. ${detLineEn}; setting it to $0$ gives $k = ${num(k)}$.` },
      signFlip: { zh: `正負號錯了。代回得 $\\det A = ${a}(${num(-k)}) - ${bc} = ${det(-k)}$，不等於零。`, en: `The sign is wrong. Substituting gives $\\det A = ${a}(${num(-k)}) - ${bc} = ${det(-k)}$, which is not zero.` },
      swapped: { zh: `這是解 $${coef(c, 'k')} - (${a})(${b}) = 0$ 的結果，把矩陣元素的位置對調了。代回原矩陣得 $\\det A = ${det(swapped)}$，不等於零。`, en: `This solves $${coef(c, 'k')} - (${a})(${b}) = 0$, with the entries in the wrong places. In the actual matrix, $\\det A = ${det(swapped)}$, which is not zero.` },
      combined: { zh: `$${a} \\times ${c} - ${b} = ${num(combined)}$ 並非由行列式得出。代回得 $\\det A = ${det(combined)}$，不等於零。`, en: `$${a} \\times ${c} - ${b} = ${num(combined)}$ does not come from the determinant. Substituting gives $\\det A = ${det(combined)}$, which is not zero.` },
    },
    explanation: {
      zh: `一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。${detLine}，令其為 $0$ 得 $k = ${num(k)}$。題目問的是【沒有】逆矩陣；若求「有逆矩陣」的條件，答案會是一個範圍（$k \\neq ${num(k)}$），而不是單一數值。`,
      en: `A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. ${detLineEn}; setting it to $0$ gives $k = ${num(k)}$. The question asks when there is *no* inverse; the condition for an inverse would be a range ($k \\neq ${num(k)}$), not a single value.`,
    },
  }
}

function scalar(n: number, p: number, q: number, r: number, s: number): Built {
  const M = (w: number, x: number, y: number, z: number) => `$\\begin{pmatrix} ${w} & ${x} \\\\ ${y} & ${z} \\end{pmatrix}$`
  const expected = {
    correct: M(n * p, n * q, n * r, n * s),
    diagonalOnly: M(n * p, q, r, n * s),
    added: M(p + n, q + n, r + n, s + n),
    transposed: M(n * p, n * r, n * q, n * s),
  }
  const ans = expected.correct.slice(1, -1)
  return {
    template: 'scalar-multiple-2x2',
    params: { n, p, q, r, s },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。每個元素都乘以 $${n}$。`, en: `Correct. Every entry is multiplied by $${n}$.` },
      diagonalOnly: { zh: `只把主對角線上的元素乘以 $${n}$，另外兩個元素 $${q}$、$${r}$ 原封不動；純量乘法要把每一個元素都乘以 $${n}$。`, en: `Only the leading diagonal is multiplied by $${n}$; the other two entries $${q}$ and $${r}$ are left unchanged. A scalar multiple multiplies every entry.` },
      added: { zh: `每個元素都加上了 $${n}$，把乘法做成了加法。`, en: `$${n}$ has been added to every entry instead of multiplying it.` },
      transposed: { zh: `每個元素都乘對了，但右上與左下兩個元素對調了位置（即轉置）。純量乘法不會改變元素的位置。`, en: `Every entry is multiplied correctly, but the top-right and bottom-left entries have swapped places (a transpose). A scalar multiple does not move any entry.` },
    },
    explanation: {
      zh: `純量乘法要把該數乘以矩陣的【每一個】元素，元素的位置保持不變，故 $${n}A = ${ans}$。結果的行數和列數與原矩陣相同。`,
      en: `A scalar multiple multiplies *every* entry of the matrix and leaves each entry where it is, so $${n}A = ${ans}$. The result has the same numbers of rows and columns as $A$.`,
    },
  }
}

function polyLimit(x0: number, A: number, B: number, C: number): Built {
  const f = (x: number) => A * x * x + B * x + C
  const expected = {
    correct: `$${num(f(x0))}$`,
    noConstant: `$${num(f(x0) - C)}$`,
    derivative: `$${num(2 * A * x0 + B)}$`,
    atOne: `$${num(f(1))}$`,
  }
  const sub = `${A}(${x0})^2 ${B < 0 ? '−' : '+'} ${Math.abs(B)}(${x0}) ${C < 0 ? '−' : '+'} ${Math.abs(C)}`
  const dname = B === 0 ? `${2 * A}x` : `${2 * A}x ${B < 0 ? '−' : '+'} ${Math.abs(B)}`
  return {
    template: 'polynomial-limit-substitution',
    params: { x0, A, B, C },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。多項式是連續函數，直接代入：$${sub} = ${num(f(x0))}$。`, en: `Correct. A polynomial is continuous, so substitute directly: $${sub} = ${num(f(x0))}$.` },
      noConstant: { zh: `代入時漏了常數項 $${C < 0 ? '−' : ''}${Math.abs(C)}$。`, en: `The constant term $${C < 0 ? '−' : ''}${Math.abs(C)}$ has been left out.` },
      derivative: { zh: `這是把 $x = ${x0}$ 代入導函數 $${dname}$ 的結果。求極限不是求導數。`, en: `This substitutes $x = ${x0}$ into the derivative $${dname}$. A limit is not a derivative.` },
      atOne: { zh: `這是 $x = 1$ 時的函數值；題目要的是 $x \\to ${x0}$。`, en: `This is the value at $x = 1$; the question asks about $x \\to ${x0}$.` },
    },
    explanation: {
      zh: `多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入：$${sub} = ${num(f(x0))}$。只有代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。`,
      en: `A polynomial is continuous everywhere, and the limit of a continuous function at a point equals its value there, so substitute directly: $${sub} = ${num(f(x0))}$. Simplifying first is needed only when substitution gives an indeterminate form such as $\\frac{0}{0}$, which is not the case here.`,
    },
  }
}

function homogeneous(a: number, b: number, c: number): Built {
  const bc = b * c
  const k = bc / a, cross = (a * c) / b
  const det = (x: number) => num(a * x - bc)
  const kv = (x: number) => `$k = ${num(x)}$`
  const expected = { correct: kv(k), signFlip: kv(-k), crossPaired: kv(cross), anyK: '任何 $k$ 值皆可' }
  const vm = `$\\begin{vmatrix} ${a} & ${b} \\\\ ${c} & k \\end{vmatrix} = ${coef(a, 'k')} - ${bc}$`
  return {
    template: 'homogeneous-system-find-k',
    params: { a, b, c },
    expected,
    expectedEn: { ...expected, anyK: 'Any value of $k$ will do' },
    notes: {
      correct: { zh: `正確。係數行列式 ${vm}，令其為 $0$ 得 $k = ${num(k)}$。`, en: `Correct. The coefficient determinant is ${vm}; setting it to $0$ gives $k = ${num(k)}$.` },
      signFlip: { zh: `正負號錯了。代回得行列式 $= ${a}(${num(-k)}) - ${bc} = ${det(-k)}$，不等於零。`, en: `The sign is wrong. Substituting gives a determinant of $${a}(${num(-k)}) - ${bc} = ${det(-k)}$, not zero.` },
      crossPaired: { zh: `這是解 $${coef(b, 'k')} - (${a})(${c}) = 0$ 的結果，交叉相乘時配錯了元素。代回得行列式 $= ${det(cross)}$，不等於零。`, en: `This solves $${coef(b, 'k')} - (${a})(${c}) = 0$, pairing the wrong entries. Substituting gives a determinant of $${det(cross)}$, not zero.` },
      anyK: { zh: `任何 $k$ 都保證有零解 $x = y = 0$，但題目要的是非零解，這必須令係數行列式為零。`, en: `Any $k$ gives the zero solution $x = y = 0$, but a non-trivial solution needs the coefficient determinant to be zero.` },
    },
    explanation: {
      zh: `齊次方程組必定有零解（$x = y = 0$）；它有【非零】解，當且僅當係數行列式等於零。故 ${vm.slice(0, -1)} = 0$，得 $k = ${num(k)}$。`,
      en: `A homogeneous system always has the zero solution ($x = y = 0$); it has a *non-trivial* solution exactly when the coefficient determinant is zero. So ${vm.slice(0, -1)} = 0$, giving $k = ${num(k)}$.`,
    },
  }
}

function perpendicular(a1: number, a2: number, b1: number): Built {
  const t = -(a1 * b1) / a2, parallel = (a2 * b1) / a1, ratio = a2 / b1
  const dot = (x: number) => num(a1 * b1 + a2 * x)
  const tv = (x: number) => `$t = ${num(x)}$`
  const expected = { correct: tv(t), signFlip: tv(-t), parallel: tv(parallel), ratio: tv(ratio) }
  const line = (x: number) => `${a1} \\times ${b1} + (${a2})(${num(x)}) = ${dot(x)}`
  return {
    template: 'perpendicular-vectors-find-t',
    params: { a1, a2, b1 },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。$\\vec{a} \\cdot \\vec{b} = ${line(t)}$。`, en: `Correct. $\\vec{a} \\cdot \\vec{b} = ${line(t)}$.` },
      signFlip: { zh: `正負號錯了。代回得 $\\vec{a} \\cdot \\vec{b} = ${line(-t)}$，不等於零。`, en: `The sign is wrong. Substituting gives $\\vec{a} \\cdot \\vec{b} = ${line(-t)}$, not zero.` },
      parallel: { zh: `這是令兩個向量【平行】的值（分量成比例：$\\dfrac{t}{${b1}} = \\dfrac{${a2}}{${a1}}$）。垂直看純量積，平行看分量成比例。`, en: `This value makes the vectors *parallel* (components in proportion: $\\dfrac{t}{${b1}} = \\dfrac{${a2}}{${a1}}$). Perpendicular means a zero scalar product; parallel means proportional components.` },
      ratio: { zh: `$\\dfrac{${a2}}{${b1}} = ${num(ratio)}$ 並非由純量積得出。代回得 $\\vec{a} \\cdot \\vec{b} = ${line(ratio)}$，不等於零。`, en: `$\\dfrac{${a2}}{${b1}} = ${num(ratio)}$ does not come from the scalar product. Substituting gives $\\vec{a} \\cdot \\vec{b} = ${line(ratio)}$, not zero.` },
    },
    explanation: {
      zh: `兩個非零向量互相垂直，當且僅當其純量積為零：$\\vec{a} \\cdot \\vec{b} = ${a1} \\times ${b1} + ${a2 < 0 ? `(${a2})t` : coef(a2, 't')} = 0$，故 $t = ${num(t)}$。代回檢查：$${line(t)}$。`,
      en: `Two non-zero vectors are perpendicular exactly when their scalar product is zero: $\\vec{a} \\cdot \\vec{b} = ${a1} \\times ${b1} + ${a2 < 0 ? `(${a2})t` : coef(a2, 't')} = 0$, so $t = ${num(t)}$. Check: $${line(t)}$.`,
    },
  }
}

function rationalInfinity(p: number, m: number, q: number, n: number): Built {
  const ratio = frac(p, q), inverse = frac(q, p)
  const none = '不存在（趨向無限大）', noneEn = 'Does not exist (tends to infinity)'
  const kind = m === n ? 'same' : m < n ? 'lower' : 'higher'
  // The four options are always 0, "does not exist", p/q and q/p; which one is correct depends on the degrees.
  const pool: Record<string, [string, string]> = { zero: ['$0$', '$0$'], infinite: [none, noneEn], ratio: [ratio, ratio], inverse: [inverse, inverse] }
  const correctKey = kind === 'same' ? 'ratio' : kind === 'lower' ? 'zero' : 'infinite'
  const expected: Record<string, string> = {}, expectedEn: Record<string, string> = {}
  for (const [k, [zh, en]] of Object.entries(pool)) {
    const key = k === correctKey ? 'correct' : k
    expected[key] = zh
    expectedEn[key] = en
  }
  const degZh = `分子最高次為 $${m}$ 次，分母為 $${n}$ 次`
  const degEn = `the numerator has degree $${m}$ and the denominator degree $${n}$`
  const reason: Text = kind === 'same'
    ? { zh: `兩者同次，極限等於最高次項係數之比 $\\dfrac{${p}}{${q}} = ${fracBare(p, q)}$`, en: `equal degrees, so the limit is the ratio of the leading coefficients, $\\dfrac{${p}}{${q}} = ${fracBare(p, q)}$` }
    : kind === 'lower'
      ? { zh: `分母次數較高，分母增長得快得多，故極限為 $0$`, en: `the denominator has the higher degree and grows much faster, so the limit is $0$` }
      : { zh: `分子次數較高，分子增長得快得多，故極限不存在（趨向無限大）`, en: `the numerator has the higher degree and grows much faster, so there is no finite limit` }
  const notes: Record<string, Text> = {
    zero: { zh: `極限為 $0$ 只在分母次數較高時成立；本題${degZh}。`, en: `The limit is $0$ only when the denominator has the higher degree; here ${degEn}.` },
    infinite: { zh: `極限不存在只在分子次數較高時成立；本題${degZh}。`, en: `There is no finite limit only when the numerator has the higher degree; here ${degEn}.` },
    ratio: { zh: `係數之比 $${fracBare(p, q)}$ 只在分子分母同次時才是極限；本題${degZh}。應先比較次數，同次才比係數。`, en: `The coefficient ratio $${fracBare(p, q)}$ is the limit only when the degrees are equal; here ${degEn}. Compare degrees first, coefficients only when they are equal.` },
    inverse: kind === 'same'
      ? { zh: `把係數之比倒轉了：應是分子係數除以分母係數 $\\dfrac{${p}}{${q}}$。`, en: `The coefficient ratio is upside down: it is the numerator's coefficient over the denominator's, $\\dfrac{${p}}{${q}}$.` }
      : { zh: `這是倒轉了的係數之比；而且本題${degZh}，次數不同時極限並不取決於係數。`, en: `This is the coefficient ratio upside down; and here ${degEn}, so with unequal degrees the coefficients do not decide the limit.` },
  }
  notes.correct = { zh: `正確。${degZh}，${reason.zh}。`, en: `Correct. Here ${degEn}: ${reason.en}.` }
  delete notes[correctKey]
  return {
    template: 'rational-limit-at-infinity',
    params: { p, m, q, n },
    expected,
    expectedEn,
    notes,
    explanation: {
      zh: `$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題${degZh}，${reason.zh}。判斷次序應為：先比次數，同次才比係數。`,
      en: `As $x \\to \\infty$ the limit of a rational expression depends only on the *highest-degree terms* of the numerator and denominator; lower terms and constants fade away. Here ${degEn}: ${reason.en}. Compare degrees first, and coefficients only when the degrees are equal.`,
    },
  }
}

function sinLimit(p: number, q: number): Built {
  const expected = { correct: frac(p, q), inverse: frac(q, p), one: '$1$', zero: '$0$' }
  return {
    template: 'sin-px-over-qx',
    params: { p, q },
    expected,
    expectedEn: same(expected),
    notes: {
      correct: { zh: `正確。$\\dfrac{\\sin ${p}x}{${q}x} = \\dfrac{${p}}{${q}} \\cdot \\dfrac{\\sin ${p}x}{${p}x} \\to \\dfrac{${p}}{${q}} \\times 1 = ${fracBare(p, q)}$。`, en: `Correct. $\\dfrac{\\sin ${p}x}{${q}x} = \\dfrac{${p}}{${q}} \\cdot \\dfrac{\\sin ${p}x}{${p}x} \\to \\dfrac{${p}}{${q}} \\times 1 = ${fracBare(p, q)}$.` },
      inverse: { zh: `比例倒轉了：正弦內的角 $${p}x$ 要放在分子一方，應是 $\\dfrac{${p}}{${q}}$。`, en: `The ratio is upside down: the angle $${p}x$ inside the sine belongs on top, giving $\\dfrac{${p}}{${q}}$.` },
      one: { zh: `$\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$ 要求正弦內的角與分母相同；本題是 $${p}x$ 對 $${q}x$，要先湊成相同。`, en: `$\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$ needs the angle and the denominator to match; here they are $${p}x$ and $${q}x$, so adjust first.` },
      zero: { zh: `分子 $\\sin 0 = 0$，但分母同樣趨於零；$\\frac{0}{0}$ 是不定式，不可直接判為零。`, en: `The numerator tends to $\\sin 0 = 0$, but so does the denominator; $\\frac{0}{0}$ is indeterminate, not zero.` },
    },
    explanation: {
      zh: `基本極限 $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$ 要求正弦內的角與分母完全相同。本題分子的角是 $${p}x$，分母是 $${q}x$，故先湊：$\\dfrac{\\sin ${p}x}{${q}x} = \\dfrac{${p}}{${q}} \\cdot \\dfrac{\\sin ${p}x}{${p}x}$。右邊的分式趨向 $1$，故極限為 $${fracBare(p, q)}$。`,
      en: `The standard limit $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$ needs the angle inside the sine to match the denominator exactly. Here they are $${p}x$ and $${q}x$, so rewrite: $\\dfrac{\\sin ${p}x}{${q}x} = \\dfrac{${p}}{${q}} \\cdot \\dfrac{\\sin ${p}x}{${p}x}$. The second factor tends to $1$, so the limit is $${fracBare(p, q)}$.`,
    },
  }
}

const N = '(-?\\d+)'
function build(content: string): Built {
  let m: RegExpMatchArray | null
  if ((m = content.match(new RegExp(`A = \\\\begin\\{pmatrix\\} ${N} & ${N} \\\\\\\\ ${N} & k \\\\end\\{pmatrix\\}\\$。求 \\$k\\$ 的值，使 \\$A\\$ 【沒有】逆矩陣`)))) return singular(+m[1], +m[2], +m[3])
  if ((m = content.match(new RegExp(`A = \\\\begin\\{pmatrix\\} ${N} & ${N} \\\\\\\\ ${N} & ${N} \\\\end\\{pmatrix\\}\\$。求 \\$(\\d+)A\\$`)))) return scalar(+m[5], +m[1], +m[2], +m[3], +m[4])
  if ((m = content.match(/\\lim_\{x \\to (-?\d+)\} \((\d+)x\^2 ([+−]) (\d+)x ([+−]) (\d+)\)/))) return polyLimit(+m[1], +m[2], (m[3] === '−' ? -1 : 1) * +m[4], (m[5] === '−' ? -1 : 1) * +m[6])
  if ((m = content.match(/\\begin\{cases\} (\d+)x \+ (\d+)y = 0 \\\\ (\d+)x \+ ky = 0 \\end\{cases\}/))) return homogeneous(+m[1], +m[2], +m[3])
  if ((m = content.match(/\\vec\{a\} = \((-?\d+), (-?\d+)\)\$、\$\\vec\{b\} = \((-?\d+), t\)\$。求 \$t\$ 的值，使 \$\\vec\{a\}\$ 與 \$\\vec\{b\}\$ 互相垂直/))) return perpendicular(+m[1], +m[2], +m[3])
  if ((m = content.match(/\\lim_\{x \\to \\infty\} \\dfrac\{(\d*)x\^(\d+) \+ 1\}\{(\d*)x\^(\d+) \+ x\}/))) return rationalInfinity(m[1] ? +m[1] : 1, +m[2], m[3] ? +m[3] : 1, +m[4])
  if ((m = content.match(/\\lim_\{x \\to 0\} \\dfrac\{\\sin (\d+)x\}\{(\d+)x\}/))) return sinLimit(+m[1], +m[2])
  throw new Error(`stem matches no template: ${content}`)
}

const mod = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (mod.default?.getSubjectQuestionsRaw ? mod.default : mod) as {
  getSubjectQuestionsRaw: (s: string) => Array<{ id: string; content: string; options: string[]; optionsEn?: string[]; correctIndex: number }>
}
const bank = new Map(idx.getSubjectQuestionsRaw('m2').map((q) => [q.id, q]))

const out = []
for (const id of IDS) {
  const q = bank.get(id)
  if (!q) throw new Error(`${id} not in the raw m2 bank`)
  const t = build(q.content)
  if (new Set(Object.values(t.expected)).size !== 4) throw new Error(`${id}: two kinds give the same option`)
  const notes: Note[] = q.options.map((opt, optionId) => {
    const kinds = Object.entries(t.expected).filter(([, s]) => s === opt).map(([k]) => k)
    if (kinds.length !== 1) throw new Error(`${id} option ${optionId} "${opt}" matched ${kinds.length} kinds`)
    if ((q.optionsEn ?? q.options)[optionId] !== t.expectedEn[kinds[0]]) throw new Error(`${id} option ${optionId}: English "${q.optionsEn?.[optionId]}" is not ${kinds[0]}`)
    return { optionId, kind: kinds[0], ...t.notes[kinds[0]] }
  })
  const correct = notes.filter((n) => n.kind === 'correct').map((n) => n.optionId)
  if (correct.length !== 1 || correct[0] !== q.correctIndex) throw new Error(`${id}: recomputed correct option ${correct} ≠ stored ${q.correctIndex}`)
  out.push({ id, template: t.template, params: t.params, options: q.options, optionsEn: q.optionsEn ?? q.options, explanation: t.explanation.zh, explanationEn: t.explanation.en, optionNotes: notes })
}

mkdirSync(join(ROOT, 'data/questions/rationale-repairs'), { recursive: true })
writeFileSync(
  join(ROOT, `data/questions/rationale-repairs/${BATCH}.json`),
  JSON.stringify({ batch: BATCH, subject: 'm2', computed: true, generatedBy: 'scripts/qbank/repairs/m2-01.mts', repairs: out }, null, 2) + '\n',
)
console.log(`✓ ${BATCH}: ${out.length} repairs written to data/questions/rationale-repairs/${BATCH}.json`)
