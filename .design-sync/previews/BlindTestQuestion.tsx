import { BlindTestQuestion } from 'dse-level-up'

// 盲測題卡。⚠️ 憲章 §7.1／§7.2 相關嘅「盲測黑題模式」係 2026-11-09 覆檢
// 先決定嘅項目 —— 呢個組件存在唔等於個模式已經拍板。預覽只係呈現組件本身。

export function Default() {
  return (
    <div className="max-w-lg">
      <BlindTestQuestion />
    </div>
  )
}
