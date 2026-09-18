import { CalcTipCard } from 'dse-level-up'

// 計數機貼士卡（Casio fx-50FH II／3650P），擺喺解析底部嘅折疊區。
//
// ⚠️ 學術生死線閘：`verified: false` 嘅卡喺 **production 完全唔 render**。
// 預覽 build 係 development，所以呢度會見到草稿連「未經真機驗證」警示 ——
// 即係話呢張卡而家仲未上得線，要真人真機行過先。唔好照抄嚟當已驗證嘅樣。

export function QuadraticSolver() {
  return (
    <div className="max-w-lg">
      <CalcTipCard topicId="quadratic_equations" />
    </div>
  )
}

export function NoTipForThisTopic() {
  // 冇對應貼士嘅課題：整個區塊消失（return null），唔留空殼、唔寫「暫無貼士」。
  return (
    <div className="max-w-lg text-sm text-ink-muted">
      <CalcTipCard topicId="chinese_classical_prose" />
      <p>（呢個課題冇計數機貼士 —— 上面刻意乜都唔 render）</p>
    </div>
  )
}
