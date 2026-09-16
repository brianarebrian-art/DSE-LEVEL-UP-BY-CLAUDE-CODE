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
      // 2026-09-16 加返 PNG。原本淨係得 SVG ＋ favicon.ico：Chrome／Edge 收 SVG，
      // 但唔係每個 Android 瀏覽器都收 —— 收唔到就會攞 32px 嘅 favicon 放大，
      // 主畫面個圖示會糊。對象好多用舊機，所以唔靠單一格式。
      { src: '/icons/owl-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/owl-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // maskable：底色滿版、貓頭鷹縮到 76%，好等 Android 切圓形／水滴形都唔會切到隻鳥
      //（安全區係中央 80%）。冇呢張嘅話，系統會自己加白邊或者切走隻鳥對角。
      { src: '/icons/owl-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      // SVG 'any'：Chrome／Edge 接受作為可安裝圖示，一個檔頂晒 192 同 512。
      { src: '/icons/owl.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
    // iOS 唔讀 manifest 嘅 icons，佢讀 <link rel="apple-touch-icon">。
    // 嗰張圖由 app/apple-icon.png 提供（Next 檔案慣例，會自動出 <link>）——
    // 底色一樣要滿版，因為 iOS 會將透明位填黑。
    // 三張 PNG 全部由 public/icons/owl.svg 產生；改 SVG 記得重新產生（見 docs）。
  }
}
