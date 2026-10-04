#!/usr/bin/env -S npx tsx
// ============================================================================
// repairs/m1-02.mts — rationale repair, batch M1-02 (m1_rep_0013 … m1_rep_0050)
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repairs/m1-02.mts          → writes the batch file
//   npx tsx scripts/qbank/repair-rationale.mts --batch M1-02   → applies it
//
// Founders' replies 31-1c and 31-2b (2026-10-04): computed repairs go back into
// practice after the automated checks, in batches of about 50. This batch plus
// M1-01 (10) makes 48; whole templates only, so the batch stops at 0050.
//
// Seven parametric templates. For each question the parameters are read from the
// stem, the correct answer and the three distractors are recomputed, and every
// STORED option is matched to exactly one of them; that match gives each note its
// optionId. Any option that matches none or more than one stops the script.
//
// The old explanations named the wrong options by position, and several described
// them wrongly (for example, "4(3)^{3}" was said to treat the bracket as "3x"; it
// replaces the bracket with the inner derivative). Each note below describes what
// that option actually did. Formatting fix on the way: ")^{1}" is printed as ")".
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH = 'M1-02'
const IDS = Array.from({ length: 38 }, (_, i) => `m1_rep_${String(i + 13).padStart(4, '0')}`)

type Text = { zh: string; en: string }
interface Note { optionId: number; kind: string; zh: string; en: string }
interface Built { template: string; params: Record<string, number>; expected: Record<string, string>; notes: Record<string, Text>; explanation: Text }

/** "(5x + 1)^{1}" → "(5x + 1)"; "2(5)^{1}" → "2(5)". */
const tidy = (s: string) => s.replace(/\)\^\{1\}(?!\d)/g, ')')
/** Up to four decimals, no trailing zeros: 130/15 → "8.6667", 60/8 → "7.5". */
const num = (v: number) => String(Math.round(v * 1e4) / 1e4)
const pow = (k: number) => (k === 1 ? '' : `^{${k}}`)

function chain(a: number, b: number, n: number): Built {
  const inner = `${a}x + ${b}`
  return {
    template: 'chain-(ax+b)^n',
    params: { a, b, n },
    expected: {
      correct: `$${a * n}(${inner})^{${n - 1}}$`,
      missingInner: `$${n}(${inner})^{${n - 1}}$`,
      exponentKept: `$${a * n}(${inner})^{${n}}$`,
      bracketReplaced: `$${n}(${a})^{${n - 1}}$`,
    },
    notes: {
      correct: {
        zh: `正確。外層導數 $${n}(${inner})${pow(n - 1)}$ 乘以內層導數 $${a}$。`,
        en: `Correct. The outer derivative $${n}(${inner})${pow(n - 1)}$ times the inner derivative $${a}$.`,
      },
      missingInner: {
        zh: `只求了外層的導數，漏了乘以內層 $${inner}$ 的導數 $${a}$。答案的形式看似正確，所以這個錯誤特別難自己察覺。`,
        en: `Only the outer function is differentiated; the inner derivative $${a}$ of $${inner}$ is missing. The form looks right, which makes this slip hard to spot.`,
      },
      exponentKept: {
        zh: `係數 $${a * n}$ 正確，但指數沒有減一：$u^{${n}}$ 求導後應為 $${n}u${pow(n - 1)}$。`,
        en: `The coefficient $${a * n}$ is right, but the power was not reduced: $u^{${n}}$ differentiates to $${n}u${pow(n - 1)}$.`,
      },
      bracketReplaced: {
        zh: `把括號內的 $${inner}$ 換成了它的導數 $${a}$。外層求導時括號內的式子應原封不動，內層導數只作為乘數。`,
        en: `The bracket $${inner}$ was replaced by its derivative $${a}$. Differentiating the outer function leaves the bracket unchanged; the inner derivative is only a multiplier.`,
      },
    },
    explanation: {
      zh: `鏈式法則：把括號 $u = ${inner}$ 當作一個整體。外層 $u^{${n}}$ 的導數是 $${n}u${pow(n - 1)}$，內層 $${inner}$ 的導數是 $${a}$，兩者相乘，得 $${n} \\times ${a}(${inner})${pow(n - 1)} = ${a * n}(${inner})${pow(n - 1)}$。`,
      en: `Chain rule: treat the bracket $u = ${inner}$ as one object. The outer $u^{${n}}$ differentiates to $${n}u${pow(n - 1)}$ and the inner $${inner}$ to $${a}$; multiplying gives $${n} \\times ${a}(${inner})${pow(n - 1)} = ${a * n}(${inner})${pow(n - 1)}$.`,
    },
  }
}

function lnQuad(a: number, c: number): Built {
  const f = `${a}x^{2} + ${c}`
  const d = `${2 * a}x`
  return {
    template: 'ln(ax^2+c)',
    params: { a, c },
    expected: {
      correct: `$\\dfrac{${d}}{${f}}$`,
      missingInner: `$\\dfrac{1}{${f}}$`,
      droppedConstant: `$\\dfrac{${d}}{${a}x^{2}}$`,
      logFactor: `$${d} \\ln(${f})$`,
    },
    notes: {
      correct: { zh: `正確。分子是 $f'(x) = ${d}$，分母保留原式 $${f}$。`, en: `Correct. The numerator is $f'(x) = ${d}$ and the denominator keeps $${f}$ as it is.` },
      missingInner: {
        zh: `這是 $\\ln u$ 對 $u$ 的導數 $\\dfrac{1}{u}$，漏了再乘以內層的導數 $${d}$（鏈式法則）。`,
        en: `This is the derivative of $\\ln u$ with respect to $u$, $\\dfrac{1}{u}$, without the inner derivative $${d}$ (chain rule).`,
      },
      droppedConstant: {
        zh: `分子正確，但分母刪去了常數 $${c}$。分母必須是完整的原式 $${f}$。`,
        en: `The numerator is right, but the constant $${c}$ was dropped from the denominator. The denominator must be the whole of $${f}$.`,
      },
      logFactor: {
        zh: `把 $\\ln$ 當成可以留在外面的因子，再乘以內層的導數。對數求導之後不再含 $\\ln$。`,
        en: `This keeps $\\ln$ as a factor and multiplies by the inner derivative. Differentiating a logarithm leaves no $\\ln$ behind.`,
      },
    },
    explanation: {
      zh: `$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子是它的導數。此處 $f(x) = ${f}$，$f'(x) = ${d}$，故答案為 $\\dfrac{${d}}{${f}}$。`,
      en: `$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: the original expression goes in the denominator and its derivative on top. Here $f(x) = ${f}$ and $f'(x) = ${d}$, so the answer is $\\dfrac{${d}}{${f}}$.`,
    },
  }
}

function implicit(p: number, q: number): Built {
  return {
    template: 'implicit-px^2+qy^2',
    params: { p, q },
    expected: {
      correct: `$-\\dfrac{${p}x}{${q}y}$`,
      missingNeg: `$\\dfrac{${p}x}{${q}y}$`,
      numeratorUnreduced: `$-\\dfrac{${2 * p}x}{${q}y}$`,
      denominatorUnreduced: `$-\\dfrac{${p}x}{${2 * q}y}$`,
    },
    notes: {
      correct: {
        zh: `正確。由 $${2 * p}x + ${2 * q}y\\dfrac{dy}{dx} = 0$ 移項，分子分母同除以 $2$。`,
        en: `Correct. Rearrange $${2 * p}x + ${2 * q}y\\dfrac{dy}{dx} = 0$ and divide top and bottom by $2$.`,
      },
      missingNeg: { zh: `漏了負號：$${2 * p}x$ 移到等號另一邊時要變號。`, en: `The minus sign is missing: $${2 * p}x$ changes sign when it moves across the equals sign.` },
      numeratorUnreduced: {
        zh: `分母已除以 $2$，分子 $${2 * p}x$ 卻沒有，兩邊約簡不一致。`,
        en: `The denominator was divided by $2$ but the numerator $${2 * p}x$ was not.`,
      },
      denominatorUnreduced: {
        zh: `分子已除以 $2$，分母 $${2 * q}y$ 卻沒有，兩邊約簡不一致。`,
        en: `The numerator was divided by $2$ but the denominator $${2 * q}y$ was not.`,
      },
    },
    explanation: {
      zh: `兩邊同時對 $x$ 求導。$${p}x^{2}$ 的導數是 $${2 * p}x$；$${q}y^{2}$ 的導數是 $${2 * q}y\\dfrac{dy}{dx}$ —— 因為 $y$ 是 $x$ 的函數，鏈式法則帶出 $\\dfrac{dy}{dx}$。右邊常數的導數為 $0$。由 $${2 * p}x + ${2 * q}y\\dfrac{dy}{dx} = 0$ 得 $\\dfrac{dy}{dx} = -\\dfrac{${2 * p}x}{${2 * q}y} = -\\dfrac{${p}x}{${q}y}$。`,
      en: `Differentiate both sides with respect to $x$. $${p}x^{2}$ gives $${2 * p}x$; $${q}y^{2}$ gives $${2 * q}y\\dfrac{dy}{dx}$ — $y$ is a function of $x$, so the chain rule brings out $\\dfrac{dy}{dx}$. The constant on the right gives $0$. From $${2 * p}x + ${2 * q}y\\dfrac{dy}{dx} = 0$, $\\dfrac{dy}{dx} = -\\dfrac{${2 * p}x}{${2 * q}y} = -\\dfrac{${p}x}{${q}y}$.`,
    },
  }
}

function second(a: number, b: number, c: number): Built {
  const f1 = `${3 * a}x^{2} + ${2 * b}x + ${c}`
  return {
    template: 'second-derivative-cubic',
    params: { a, b, c },
    expected: {
      correct: `$${6 * a}x + ${2 * b}$`,
      firstOnly: `$${f1}$`,
      keptX: `$${6 * a}x + ${2 * b}x$`,
      third: `$${6 * a}$`,
    },
    notes: {
      correct: { zh: `正確。對 $f'(x) = ${f1}$ 再求導一次。`, en: `Correct. Differentiate $f'(x) = ${f1}$ once more.` },
      firstOnly: { zh: `這是 $f'(x)$，只求了一次導數。題目問的是 $f''(x)$，要再求導一次。`, en: `This is $f'(x)$, one derivative only. The question asks for $f''(x)$, so differentiate again.` },
      keptX: { zh: `$${2 * b}x$ 求導後應為 $${2 * b}$，$x$ 要消去；這裏把 $x$ 保留了。`, en: `$${2 * b}x$ differentiates to $${2 * b}$; the $x$ should go, but it was kept.` },
      third: { zh: `這是 $f'''(x)$，多求了一次導數。`, en: `This is $f'''(x)$: one derivative too many.` },
    },
    explanation: {
      zh: `求導兩次。第一次：$f'(x) = ${f1}$。第二次：$f''(x) = ${6 * a}x + ${2 * b}$ —— 常數項 $${c}$ 在第二次求導時變成 $0$。`,
      en: `Differentiate twice. First: $f'(x) = ${f1}$. Second: $f''(x) = ${6 * a}x + ${2 * b}$ — the constant $${c}$ becomes $0$ on the second differentiation.`,
    },
  }
}

function increasing(a: number, k: number): Built {
  const v = k / (2 * a)
  if (!Number.isInteger(v)) throw new Error(`increasing: ${k}/${2 * a} is not an integer`)
  const lead = `${a === 1 ? '' : a}x^{2}`
  return {
    template: 'increasing-ax^2-kx',
    params: { a, k },
    expected: { correct: `$x > ${v}$`, reversed: `$x < ${v}$`, forgotCoefficient: `$x > ${k}$`, positive: `$x > 0$` },
    notes: {
      correct: { zh: `正確。解 $${2 * a}x - ${k} > 0$，得 $x > ${v}$。`, en: `Correct. Solving $${2 * a}x - ${k} > 0$ gives $x > ${v}$.` },
      reversed: { zh: `不等號方向反了：$x < ${v}$ 時 $f'(x) < 0$，那是遞減的範圍。`, en: `The inequality is the wrong way round: for $x < ${v}$, $f'(x) < 0$, which is where $f$ decreases.` },
      forgotCoefficient: {
        zh: `把 $f'(x)$ 寫成 $x - ${k}$，漏了 $${lead}$ 求導時帶出的係數 $${2 * a}$。`,
        en: `This takes $f'(x)$ as $x - ${k}$, missing the coefficient $${2 * a}$ that comes from differentiating $${lead}$.`,
      },
      positive: {
        zh: `$x > 0$ 只是「正數」，但頂點在 $x = ${v}$，不在原點；$0 < x < ${v}$ 時函數其實在下降。`,
        en: `$x > 0$ just means "positive", but the vertex is at $x = ${v}$, not at the origin; for $0 < x < ${v}$ the function is falling.`,
      },
    },
    explanation: {
      zh: `函數遞增即導數為正。$f'(x) = ${2 * a}x - ${k}$，令 $f'(x) > 0$，得 $x > ${v}$。亦可用圖像檢查：這是開口向上的拋物線，頂點在 $x = ${v}$，頂點右邊上升、左邊下降。`,
      en: `A function increases where its derivative is positive. $f'(x) = ${2 * a}x - ${k}$; $f'(x) > 0$ gives $x > ${v}$. Check with the graph: an upward parabola with its vertex at $x = ${v}$, rising to the right of the vertex and falling to the left.`,
    },
  }
}

function secondTest(a: number, k: number, c: number, x0: number): Built {
  if (2 * a * x0 !== k) throw new Error(`secondTest: x = ${x0} is not stationary for ${a}x^2 - ${k}x`)
  const s = 2 * a
  return {
    template: 'second-derivative-test-quadratic',
    params: { a, k, c, x0 },
    expected: {
      correct: `極小值點，因為 $f''(${x0}) = ${s} > 0$`,
      reversed: `極大值點，因為 $f''(${x0}) = ${s} > 0$`,
      inflection: `拐點，因為 $f''(${x0}) = 0$`,
      firstDerivative: `極大值點，因為 $f'(${x0}) = 0$`,
    },
    notes: {
      correct: { zh: `正確。$f''(${x0}) = ${s} > 0$，曲線向上凹，是極小值點。`, en: `Correct. $f''(${x0}) = ${s} > 0$: the curve is concave up, so this is a minimum.` },
      reversed: { zh: `$f''(${x0}) > 0$ 的計算對，但結論反了：$f'' > 0$ 是極小值，$f'' < 0$ 才是極大值。`, en: `$f''(${x0}) > 0$ is right, but the conclusion is reversed: $f'' > 0$ means a minimum; $f'' < 0$ a maximum.` },
      inflection: {
        zh: `$f''(x)$ 恆等於 $${s}$，不等於 $0$。而且即使 $f'' = 0$，二階導數判別法亦只是未能判斷，並不表示該點是拐點。`,
        en: `$f''(x)$ is $${s}$ everywhere, not $0$. Even where $f'' = 0$, the test is only inconclusive; it does not make the point an inflection.`,
      },
      firstDerivative: {
        zh: `$f'(${x0}) = 0$ 只說明這是駐點，不能分辨極大或極小；要看 $f''$ 的正負。`,
        en: `$f'(${x0}) = 0$ only shows the point is stationary; it cannot tell a maximum from a minimum. Look at the sign of $f''$.`,
      },
    },
    explanation: {
      zh: `二階導數判別法：先找駐點（$f'(x) = 0$），再看該點的二階導數。$f'(x) = ${s}x - ${k}$，在 $x = ${x0}$ 時為 $0$，所以是駐點；$f''(x) = ${s}$，恆為正。$f'' > 0$ 表示曲線在該處向上凹（形如「U」），所以是極小值點。`,
      en: `Second-derivative test: find where $f'(x) = 0$, then look at $f''$ there. $f'(x) = ${s}x - ${k}$ is $0$ at $x = ${x0}$, so the point is stationary; $f''(x) = ${s}$ is always positive. $f'' > 0$ means the curve is concave up (a "U" shape), so the point is a minimum.`,
    },
  }
}

function zScore(mu: number, sigma: number, x: number): Built {
  const z = num((x - mu) / sigma)
  const unit = (v: string) => `$${v}$ 個標準差`
  return {
    template: 'z-score-normal',
    params: { mu, sigma, x },
    expected: {
      correct: unit(z),
      differenceOnly: unit(num(x - mu)),
      scoreOverSigma: unit(num(x / sigma)),
      meanOverSigma: unit(num(mu / sigma)),
    },
    notes: {
      correct: { zh: `正確。$\\dfrac{${x} - ${mu}}{${sigma}} = ${z}$。`, en: `Correct. $\\dfrac{${x} - ${mu}}{${sigma}} = ${z}$.` },
      differenceOnly: {
        zh: `$${x} - ${mu} = ${num(x - mu)}$ 是分數的差距，單位仍然是「分」；還要除以標準差 $${sigma}$。`,
        en: `$${x} - ${mu} = ${num(x - mu)}$ is the gap in marks; it still has to be divided by the standard deviation $${sigma}$.`,
      },
      scoreOverSigma: {
        zh: `$\\dfrac{${x}}{${sigma}}$：直接把分數除以標準差，漏了先減去平均分 $${mu}$。`,
        en: `$\\dfrac{${x}}{${sigma}}$ divides the score by the standard deviation without first subtracting the mean $${mu}$.`,
      },
      meanOverSigma: {
        zh: `$\\dfrac{${mu}}{${sigma}}$：這是平均分除以標準差，與小明的分數無關。`,
        en: `$\\dfrac{${mu}}{${sigma}}$ is the mean divided by the standard deviation; it has nothing to do with the student's score.`,
      },
    },
    explanation: {
      zh: `標準分數量度的是「距離平均值有多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{${x} - ${mu}}{${sigma}} = ${z}$。先減平均值得出差距，再除以標準差，把差距換算成標準差的數目。`,
      en: `A standard score measures how many standard deviations a value is from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{${x} - ${mu}}{${sigma}} = ${z}$. Subtract the mean to get the gap, then divide by the standard deviation to count it in standard deviations.`,
    },
  }
}

function build(content: string): Built {
  let m: RegExpMatchArray | null
  if ((m = content.match(/\\left\(\((\d+)x \+ (\d+)\)\^\{(\d+)\}\\right\)/))) return chain(+m[1], +m[2], +m[3])
  if ((m = content.match(/\\ln\((\d+)x\^\{2\} \+ (\d+)\)/))) return lnQuad(+m[1], +m[2])
  if ((m = content.match(/\$(\d+)x\^\{2\} \+ (\d+)y\^\{2\} = \d+\$/))) return implicit(+m[1], +m[2])
  if ((m = content.match(/f\(x\) = (\d+)x\^\{3\} \+ (\d+)x\^\{2\} \+ (\d+)x\$。求 \$f''\(x\)\$/))) return second(+m[1], +m[2], +m[3])
  if ((m = content.match(/f\(x\) = (\d*)x\^\{2\} -(\d+) x\$。求 \$f\(x\)\$ 為【遞增】/))) return increasing(+(m[1] || 1), +m[2])
  if ((m = content.match(/f\(x\) = (\d*)x\^\{2\} -(\d+) x \+ (\d+)\$。試用二階導數判別法，判斷 \$x = (\d+)\$/))) return secondTest(+(m[1] || 1), +m[2], +m[3], +m[4])
  if ((m = content.match(/平均分 \$(\d+)\$，標準差 \$(\d+)\$。小明考獲 \$(\d+)\$ 分/))) return zScore(+m[1], +m[2], +m[3])
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
  // Options that carry words (the second-derivative test, the z-score units) have their
  // own English text; keep it. Pure-maths options are the same in both languages.
  const en = q.optionsEn && q.optionsEn.some((o, i) => o !== q.options[i]) ? q.optionsEn : q.options.map(tidy)
  out.push({
    id,
    template: t.template,
    params: t.params,
    options: q.options.map(tidy),
    optionsEn: en,
    explanation: t.explanation.zh,
    explanationEn: t.explanation.en,
    optionNotes: notes,
  })
}

mkdirSync(join(ROOT, 'data/questions/rationale-repairs'), { recursive: true })
const file = join(ROOT, `data/questions/rationale-repairs/${BATCH}.json`)
writeFileSync(file, JSON.stringify({ batch: BATCH, subject: 'm1', computed: true, generatedBy: 'scripts/qbank/repairs/m1-02.mts', repairs: out }, null, 2) + '\n')
console.log(`✓ ${BATCH}: ${out.length} repairs written to data/questions/rationale-repairs/${BATCH}.json`)
