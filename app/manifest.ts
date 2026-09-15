import type { MetadataRoute } from 'next'

// PWA manifest —— 令考生可以「加到主畫面」，之後全屏開啟、冇瀏覽器網址列。
//
// 為何值得做：對象係基層考生，好多用舊機、數據有限。裝到主畫面之後省一次
// 輸入網址、少一層瀏覽器介面，實際上就係多一格屏幕畀題目。零成本、瀏覽器原生。
//
// 離線：2026-09-13 起由 public/sw.js 嘅離線層負責（network-first，生產預設關，
// 由 NEXT_PUBLIC_SW_OFFLINE 開 —— 見 lib/pwa/swUrl.ts）。
// 原本呢度寫住「刻意唔加 service worker」，理由（快取寫錯會令學生長期見到舊題目）
// 【仍然成立】，所以離線層係按住嗰個理由設計，唔係推翻佢：有網一定行網絡，
// 快取只喺真係斷網先用。詳細見 sw.js 檔頭。
//
// 色值：必須係字面值（manifest 由瀏覽器讀，唔會解析 CSS 變數）。
// ⚠️ 2026-09-13 之前呢度係 '#00726C' ／ '#FAFAF8' —— 係 2026-09-02 莫蘭迪調色盤
//    上線之前嘅青色主題，一直冇跟住改。而家用淺色主題實測值（localhost:3001，
//    getComputedStyle）：canvas #F4F0EA。改主題色時記得一併改此處同 public/icons/owl.svg。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DSE Level Up',
    short_name: 'DSE Level Up',
    description: '免費 DSE 練習平台，涵蓋 25 科獨立改寫試題。掌握邏輯，唔係背答案。',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F0EA',
    theme_color: '#F4F0EA',
    lang: 'zh-HK',
    categories: ['education'],
    icons: [
      // SVG 'any'：Chrome／Edge 接受作為可安裝圖示，一個檔頂晒 192 同 512。
      // 冇呢個嘅話，Chrome 唔會當呢個站「可安裝」—— favicon.ico 太細。
      { src: '/icons/owl.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
  }
}
