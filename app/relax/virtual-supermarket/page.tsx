import SupermarketFrame from '../components/SupermarketFrame'

// /relax/virtual-supermarket — 🛒 虛擬超市
//
// 實作本體係一個【零依賴純靜態頁】：public/supermarket/（HTML + CSS + vanilla JS，
// 無 React、無 Tailwind、無 npm 套件），依 supermarket.md v2.0 §5.1／§5.5 規格。
// 本 React 頁只做一件事：喺原路由用同源 iframe 載入佢，令 app/relax/layout.tsx
// 嘅緊急熱線橫幅同「一撳離開」照樣包住個超市（嗰兩樣係 NON-NEGOTIABLE）。
//
// 同源 iframe 共用 localStorage，所以超市讀 `dse_progress` 派溫習幣毋須
// postMessage —— 規格 §5.2 禁 postMessage，此處遵守。

export const metadata = {
  title: '🛒 虛擬超市 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale 切換
  description: '溫書溫到攰，入嚟行陣、買嘢、砌屋，充電後再出發。', // i18n-exempt: 靜態 SEO meta description
}

export default function VirtualSupermarketPage() {
  return <SupermarketFrame />
}
