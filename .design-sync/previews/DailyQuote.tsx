import { DailyQuote } from 'dse-level-up'

// 每日金句輪播。純本地、零成本：每日預設一句（按月日），「換一句」隨機切換，
// localStorage 記已看 id 避免短期重複。
// 佢屬「減壓緩衝區」—— 憲章 §8.1 講明放鬆功能唔可以被遊戲化任務取代，
// 學生想淨係抖吓，要照樣抖得到。

export function Default() {
  return (
    <div className="max-w-md">
      <DailyQuote />
    </div>
  )
}
