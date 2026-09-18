import { ThemeProvider, ThemeToggle } from 'dse-level-up'

// ⚠️ ThemeToggle 係全站唯一需要 ThemeProvider 嘅組件，所以喺呢度自己包返。
// ThemeProvider 冇放入 cfg.provider —— 佢預設 `auto`（跟香港日出日落切日夜），
// 即係同一個組件唔同時間 capture 會出唔同顏色，評分冇得重現。
// 其餘 77 個組件喺產品預設（淺色莫蘭迪）之下 render。

export function ThreeWay() {
  return (
    <ThemeProvider>
      <div className="max-w-sm">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}

export function Compact() {
  // 橫向導航條用：只出一粒掣，循環 自動 → 淺色 → 深色。
  return (
    <ThemeProvider>
      <ThemeToggle compact />
    </ThemeProvider>
  )
}
