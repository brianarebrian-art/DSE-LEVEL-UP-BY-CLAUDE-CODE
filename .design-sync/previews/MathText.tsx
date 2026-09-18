import { MathText } from 'dse-level-up'

// 題幹／解析嘅數式渲染。`$…$` 行內、`$$…$$` 顯示式，其餘文字會先 HTML-escape
// 先至入 dangerouslySetInnerHTML —— 所以題目入面一個裸 `<` 唔會變成 HTML。
// 窄機（375px）顯示式會自己橫向捲，唔會撐闊成頁（globals.css .katex-display）。

export function Inline() {
  return (
    <p className="max-w-lg text-sm leading-relaxed text-ink">
      <MathText>{'若 $x^2 - 5x + 6 = 0$，則 $x = 2$ 或 $x = 3$。'}</MathText>
    </p>
  )
}

export function DisplayFormula() {
  return (
    <div className="max-w-lg text-sm text-ink">
      <MathText>{'二次公式：$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$'}</MathText>
    </div>
  )
}

export function InequalityStaysText() {
  // 裸 `<` 喺數式之外 —— 要顯示做文字，唔可以當 HTML 食咗佢。
  return (
    <p className="max-w-lg text-sm leading-relaxed text-ink">
      <MathText>{'當 0 < k < 1，函數遞減；當 $k > 1$ 時遞增。'}</MathText>
    </p>
  )
}
