import { DifficultyBadge } from 'dse-level-up'

// 難度標籤。`hard` 刻意乜都唔 render —— 拔尖題嘅難度靠題目本身傳達，
// 唔會喺學生答之前先標籤佢（見 lib/difficulty.ts 檔頭）。所以呢度冇 Hard 一格：
// 一格空白證明唔到嘢，反而會被當成壞咗。

export function Foundation() {
  return <DifficultyBadge difficulty="easy" />
}

export function Advanced() {
  return <DifficultyBadge difficulty="medium" />
}

export function InQuestionHeader() {
  return (
    // 卡身用返 PracticeSession 自己嗰個寫法（rounded-2xl ＋ 同色淡底 ＋ /30 邊），
    // 唔係另起一套 —— 預覽卡係畀 design agent 照抄嘅。
    <div className="max-w-md rounded-2xl border border-accent/30 bg-accent/[0.10] p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-medium text-ink-muted">經濟 · 供給與需求</span>
        <DifficultyBadge difficulty="medium" />
      </div>
      <p className="text-sm leading-relaxed text-ink">
        政府為某類住宅設定租金上限，並低於市場均衡水平。假設其他因素不變，
        下列哪一項最可能在該市場出現？
      </p>
    </div>
  )
}
