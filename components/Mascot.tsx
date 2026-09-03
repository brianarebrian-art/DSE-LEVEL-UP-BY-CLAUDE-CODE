import Image from 'next/image'
import { POSES, type Pose } from '@/lib/mascot'

// 吉祥物。擺邊、擺邊隻，全部喺 lib/mascot.ts 定，唔喺呢度。
//
// ══ 幾個刻意嘅決定 ══
//
// 1. `aria-hidden` —— 佢係裝飾，唔載任何文字冇嘅資訊。讀屏用戶聽到
//    「一隻貓頭鷹捧住杯」對佢完成任務毫無幫助，只係多咗一句要聽。
//    如果將來有一隻吉祥物真係載住資訊（例如指住某個掣），
//    嗰陣先加 alt，唔好而家預先加定。
//
// 2. 舒適模式一開就收埋 —— `html.no-motion` 之下 `display:none`（見 globals.css）。
//    佢唔郁，點解要收？因為對 ADHD 同視覺敏感嘅學生嚟講，一幅大插畫
//    本身就係視覺噪音，唔郁一樣搶注意力。憲章 §7：SEN 要「整層關掉」，
//    唔係「調細」。用 CSS 做唔用 JS：零 hydration 風險，而且自動接返
//    無障礙面板嗰個「一鍵舒適模式」，唔使另開一個開關畀人揾。
//
// 3. 尺寸由 POSES 表帶落嚟 —— 每隻圖嘅原生比例唔同（398×321 到 241×325）。
//    寫死一個 size 會壓扁其中幾隻。呢度用高度做基準，闊度按原生比例計。
export default function Mascot({
  pose,
  height = 160,
  className = '',
  priority = false,
}: {
  pose: Pose
  /** 顯示高度（px）。闊度按原圖比例自動計，唔會壓扁。 */
  height?: number
  className?: string
  /** 首屏主圖用 true（Landing hero），其餘一律留 false 以免搶頻寬。 */
  priority?: boolean
}) {
  const { w, h } = POSES[pose]
  const width = Math.round((w / h) * height)
  return (
    <Image
      src={`/owl/${pose}.png`}
      alt=""
      aria-hidden
      width={width}
      height={height}
      priority={priority}
      className={`mascot pointer-events-none select-none ${className}`}
    />
  )
}
