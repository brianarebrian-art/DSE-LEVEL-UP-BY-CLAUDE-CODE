import { ReportQuestionButton } from 'dse-level-up'

// 回報題目有錯。學生係題庫品質嘅第一線 —— 5,201 條題入面只有 95 條有實名
// 逐題審批紀錄，所以呢個掣唔係裝飾。

export function Inline() {
  return <ReportQuestionButton questionId="econ_oc_1" variant="inline" />
}

export function Standalone() {
  return (
    <div className="max-w-lg">
      <ReportQuestionButton questionId="econ_oc_1" variant="standalone" />
    </div>
  )
}
