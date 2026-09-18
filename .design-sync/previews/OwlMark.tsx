import { OwlMark } from 'dse-level-up'

// 品牌貓頭鷹標記（純 SVG，冇圖片檔）。PWA 圖示同 apple-touch-icon 都係由
// `public/icons/owl.svg` 生成，而嗰個檔由本組件抽出 —— 改呢度要一齊改嗰邊。
// 顏色係莫蘭迪 sage `#57685C`，唔係舊嗰套霓虹。

export function Default() {
  return <OwlMark />
}

export function Sizes() {
  return (
    <div className="flex items-end gap-6">
      <OwlMark size={24} />
      <OwlMark size={40} />
      <OwlMark size={64} />
    </div>
  )
}

export function InBrandLockup() {
  return (
    <div className="flex items-center gap-3">
      <OwlMark size={36} />
      <span className="text-lg font-semibold tracking-tight text-ink">DSE LEVEL UP</span>
    </div>
  )
}
