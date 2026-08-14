import { encodeQR } from '@/lib/paper/qr'

// QR 碼繪製 —— 純 SVG，零依賴（編碼器見 `lib/paper/qr.ts`）。
//
// 顏色刻意寫死黑白，不跟主題變數：
//   QR 的對比度屬功能需求而非裝飾。本站為暗色主題，若沿用主題色，螢幕上會變成
//   深底深碼而掃不到；列印時又需白底黑碼。故一律白底黑碼，並自帶白色靜區。
//   同一做法已見於 `components/DailyStatsCard.tsx`（深色卡上的白底 QR tile）。
//
// 靜區（quiet zone）為規格要求的四格留白，缺少會令部分掃描器辨識失敗，因此由本
// 組件負責繪製，而非交由外層 padding —— 外層 padding 可被覆寫，靜區不可。

const QUIET = 4

export default function QRCode({
  value,
  size = 96,
  className,
}: {
  /** 要編碼的文字。過長會由編碼器拋錯（上限約 213 位元組）。 */
  value: string
  /** 邊長（px）。 */
  size?: number
  className?: string
}) {
  const matrix = encodeQR(value)
  const n = matrix.length
  const span = n + QUIET * 2

  // 以單一 path 繪製所有深色模組：相對於逐個 <rect>，DOM 節點由數百降至一個，
  // 列印與 SVG 序列化都輕得多。
  let d = ''
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) d += `M${c + QUIET} ${r + QUIET}h1v1h-1z`
    }
  }

  return (
    <svg
      viewBox={`0 0 ${span} ${span}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR code"
    >
      <rect width={span} height={span} fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  )
}
