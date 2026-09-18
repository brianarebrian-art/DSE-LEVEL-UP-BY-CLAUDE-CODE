import { StepHints } from 'dse-level-up'

// 分步提示。⚠️ 呢個組件**唯一嘅 prop 係 `subjectId`** —— 佢由頭到尾收唔到
// 學生寫嘅嘢。呢個唔係巧合，係設計：憲章 §16.A 長答自動批改永久禁令嘅
// 結構性防護就係佢（「StepHints 收唔到學生寫嘅嘢，所以長答自動批改喺物理上
// 唔可能發生」）。改佢之前請讀返憲章嗰段。
//
// 佢亦刻意冇：冇 textarea、冇提交、冇比對、冇「用咗提示」嘅記錄、冇次數上限。

// ⚠️ 收埋狀態同科目無關（兩科都係同一行「需要提示？（無消耗，隨時可以跳過）」），
// 所以唔會為咗湊夠格數而放兩科 —— 兩格一模一樣係冇資訊嘅。
// 要睇展開之後逐科唔同嘅步驟，要喺 localhost:3001 撳開。

export function Collapsed() {
  return (
    <div className="max-w-lg">
      <StepHints subjectId="math" />
    </div>
  )
}

export function InExplanationFooter() {
  // 真實位置：解析區底部，喺參考答案之後。
  return (
    <div className="max-w-lg rounded-2xl border border-accent/30 bg-accent/[0.10] p-5">
      <p className="mb-3 text-sm leading-relaxed text-ink">
        參考答案：判別式為零，故 <span className="font-medium">k = 6</span> 或{' '}
        <span className="font-medium">k = −6</span>。
      </p>
      <StepHints subjectId="math" />
    </div>
  )
}
