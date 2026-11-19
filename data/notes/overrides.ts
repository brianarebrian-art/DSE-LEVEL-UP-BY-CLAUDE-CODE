import type { StudyNote } from './types'

/**
 * 人手覆寫的自學筆記（優先於 generated）。
 * 只放已覆核、可當溫書讀嘅正文；其餘課題靠 generated。
 */
export const STUDY_NOTE_OVERRIDES: Record<string, Record<string, StudyNote>> = {
  math: {
    quadratic_equations: {
      subjectId: 'math',
      topicId: 'quadratic_equations',
      titleZh: '二次方程',
      titleEn: 'Quadratic Equations',
      conceptZh:
        '二次方程 ax² + bx + c = 0（a ≠ 0）可用因式分解、配方法或求根公式求解。判別式 Δ = b² − 4ac 決定實根數目：Δ > 0 兩實根、Δ = 0 重根、Δ < 0 無實根。',
      conceptEn:
        'A quadratic ax² + bx + c = 0 (a ≠ 0) can be solved by factorising, completing the square, or the quadratic formula. The discriminant Δ = b² − 4ac decides the number of real roots.',
      mustKnowZh: [
        '求根公式：x = (−b ± √Δ) / (2a)',
        '兩根之和 = −b/a，兩根之積 = c/a',
        '先移項成一般式再讀 a、b、c',
        '圖像與 x 軸交點個數 = 實根個數',
      ],
      mustKnowEn: [
        'Formula: x = (−b ± √Δ) / (2a)',
        'Sum of roots = −b/a; product = c/a',
        'Rearrange to general form before reading a, b, c',
        'x-intercepts of the graph match the real roots',
      ],
      examTipZh:
        '題目問「交點個數」或「有冇實根」時，先算 Δ；問對稱式（α²+β² 等）時，化成 (α+β)² − 2αβ，唔使先求根。',
      examTipEn:
        'For “how many intersections” or “real roots?”, compute Δ first. For symmetric expressions in the roots, rewrite via sum and product instead of solving.',
      commonTrapZh:
        '未整理成 ax²+bx+c=0 就讀係數；把兩根之和寫成 −b 而漏除 a；判別式開方後漏 ±。',
      commonTrapEn:
        'Reading coefficients before rearranging to general form; writing sum of roots as −b instead of −b/a; dropping the ± after the square root.',
      explainerSrc: '/explainers/math-quadratic.svg',
      source: 'override',
    },
    trigonometry: {
      subjectId: 'math',
      topicId: 'trigonometry',
      titleZh: '三角函數',
      titleEn: 'Trigonometry',
      conceptZh:
        '正弦、餘弦、正切描述直角三角形邊比，亦可用單位圓推廣到任意角。正弦／餘弦定律處理非直角三角形；特殊角（30°／45°／60°）要背熟。',
      conceptEn:
        'Sine, cosine and tangent relate sides of a right triangle and extend to any angle via the unit circle. The sine and cosine rules handle non-right triangles; memorise 30°/45°/60° values.',
      mustKnowZh: [
        'sin²θ + cos²θ = 1',
        '正弦定律：a/sin A = b/sin B = c/sin C',
        '餘弦定律：c² = a² + b² − 2ab cos C',
        '注意象限符號：第二象限 sin 正、cos／tan 負',
      ],
      mustKnowEn: [
        'sin²θ + cos²θ = 1',
        'Sine rule: a/sin A = b/sin B = c/sin C',
        'Cosine rule: c² = a² + b² − 2ab cos C',
        'Watch quadrant signs (e.g. QII: sin +, cos/tan −)',
      ],
      examTipZh: '畫圖標已知邊角；用正弦定律前先確認有冇 SSA 模糊情況（ambiguous case）。',
      examTipEn: 'Sketch and label known sides/angles. Before the sine rule, check for the SSA ambiguous case.',
      commonTrapZh: '計算機仍在弧度模式；混淆對邊／鄰邊；餘弦定律符號用錯（內角／外角）。',
      commonTrapEn: 'Calculator left in radian mode; mixing opposite/adjacent; wrong sign in the cosine rule.',
      explainerSrc: '/explainers/math-trigonometry.svg',
      source: 'override',
    },
    probability: {
      subjectId: 'math',
      topicId: 'probability',
      titleZh: '概率',
      titleEn: 'Probability',
      conceptZh:
        '概率量度事件發生的可能性，介乎 0 與 1。互斥事件相加；獨立事件相乘。條件概率 P(A|B) = P(A∩B)/P(B)。',
      conceptEn:
        'Probability measures likelihood between 0 and 1. Add for mutually exclusive events; multiply for independent ones. Conditional probability: P(A|B) = P(A∩B)/P(B).',
      mustKnowZh: [
        'P(A′) = 1 − P(A)',
        '獨立：P(A∩B) = P(A)P(B)',
        '互斥：P(A∪B) = P(A) + P(B)',
        '樹形圖／維恩圖幫手唔漏情況',
      ],
      mustKnowEn: [
        'P(A′) = 1 − P(A)',
        'Independent: P(A∩B) = P(A)P(B)',
        'Mutually exclusive: P(A∪B) = P(A) + P(B)',
        'Tree / Venn diagrams reduce missed cases',
      ],
      examTipZh: '先分清「有放回」同「無放回」——無放回會改分母，唔可以當獨立。',
      examTipEn: 'Separate with-replacement from without-replacement — the latter changes the denominator.',
      commonTrapZh: '把互斥當獨立；條件概率分母用錯樣本空間；漏計「至少一個」的補集法。',
      commonTrapEn: 'Treating exclusive as independent; wrong sample space for conditionals; missing the complement for “at least one”.',
      source: 'override',
    },
  },
}
