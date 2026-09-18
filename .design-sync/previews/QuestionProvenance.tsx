import { QuestionProvenance } from 'dse-level-up'

// 題目來源披露，喺解析區底部。
// 學生對一個免費題庫嘅第一個問題係「啲題係咪求其作出嚟」—— 呢個懷疑好合理，
// 而且靠一句「專家審核」答唔到。所以**兩種狀態都要出**：
// 有實名逐題審批紀錄嘅會講明邊個邊日批，冇嘅就照直講冇，唔會含糊過去。
// （實測：5,201 條 live 題入面得 95 條 1.83% 有實名紀錄。）

export function NamedReviewer() {
  // 呢條真係喺 data/provenance.ts 嘅 REVIEWED 入面（yuna，2026-09-12）。
  // 唔好隨手填個 id —— 填錯就會出返「冇紀錄」嗰個狀態，張卡就講緊假嘢。
  return (
    <div className="max-w-lg">
      <QuestionProvenance questionId="art-chinese-fx-lplxr-yyl-1" />
    </div>
  )
}

export function NoNamedRecord() {
  // 大多數題目係呢個狀態（5,201 條入面 5,106 條）。照直講「冇逐題實名紀錄」
  // 好過扮有 —— 呢個誠實度本身就係學生肯信呢個免費題庫嘅理由。
  return (
    <div className="max-w-lg">
      <QuestionProvenance questionId="econ_ocq_3" />
    </div>
  )
}
