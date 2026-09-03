// 貓頭鷹吉祥物 —— 規格 §5.1 嘅【佔位符】實作。
//
// ⚠️ 呢個唔係規格圖入面嗰隻手繪貓頭鷹。規格 §5.1 寫明：
//   「優先使用 PNG/SVG 透明背景插畫（由設計師提供）。若暫無素材，使用
//     CSS/SVG 簡化版本作佔位符，但必須預留替換接口。」
// 素材未有，所以行第二條路。呢度係嗰個「替換接口」：
//
//   換法：喺 public/owl/ 放 nav-owl.png，然後將下面 <svg> 換成
//         <Image src="/owl/nav-owl.png" … />，其餘呼叫點一律唔使動
//         （全站只經 <OwlMark size={…} /> 用佢）。
//
// 刻意做得簡單 —— 一個假扮成手繪插畫嘅 SVG，會令人以為素材已經到手，
// 於是冇人再去搵設計師。一個明顯係佔位符嘅圖形唔會。
//
// 全部用色行 token，兩個主題自動跟。

export default function OwlMark({
  size = 40,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="DSE Level Up"
    >
      {/* 身 —— 連帽衫（規格 §5.1：永遠深苔綠） */}
      <path
        d="M20 13c6.1 0 10 4.3 10 10.5S26.6 34 20 34 10 30.2 10 23.5 13.9 13 20 13Z"
        fill="var(--color-accent)"
        opacity="0.9"
      />
      {/* 頭 */}
      <circle cx="20" cy="16" r="9" fill="var(--color-ink-soft)" />
      {/* 耳羽 */}
      <path d="M12.4 9.6 15.6 12M27.6 9.6 24.4 12" stroke="var(--color-ink-soft)" strokeWidth="2.4" strokeLinecap="round" />
      {/* 眼 —— 大眼、無攻擊性（規格 §5.1） */}
      <circle cx="16.6" cy="16" r="3.1" fill="var(--color-surface)" />
      <circle cx="23.4" cy="16" r="3.1" fill="var(--color-surface)" />
      <circle cx="16.6" cy="16.3" r="1.5" fill="var(--color-ink)" />
      <circle cx="23.4" cy="16.3" r="1.5" fill="var(--color-ink)" />
      {/* 喙 */}
      <path d="M20 18.6 18.7 20.8h2.6L20 18.6Z" fill="var(--color-gold)" />
      {/* 書 —— 捧書站立姿 */}
      <path d="M13 26.5h14v5.2H13z" fill="var(--color-surface-sunken)" />
      <path d="M20 26.5v5.2" stroke="var(--color-ink-faint)" strokeWidth="1" />
    </svg>
  )
}
