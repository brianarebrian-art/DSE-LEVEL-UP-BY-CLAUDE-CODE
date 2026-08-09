import type { MetadataRoute } from 'next'

// PWA manifest —— 令考生可以「加到主畫面」，之後全屏開啟、冇瀏覽器網址列。
//
// 為何值得做：對象係基層考生，好多用舊機、數據有限。裝到主畫面之後省一次
// 輸入網址、少一層瀏覽器介面，實際上就係多一格屏幕畀題目。零成本、瀏覽器原生。
//
// 刻意【唔】加 service worker：全站離線快取聽落吸引，但快取一寫錯就會令學生
// 長期見到舊題目與舊解析，而且本專案已經有過一次靜態資源長期不更新的事故。
// 離線模式要獨立一個 batch 認真做（並附版本失效機制），唔可以順手掛喺 manifest。
//
// theme_color 取自 globals.css `@theme` 的淺色主題值 —— 此處必須是字面值
// （manifest 由瀏覽器讀取，唔會解析 CSS 變數）。改主題色時記得一併改此處。
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DSE Level Up',
    short_name: 'DSE Level Up',
    description: '免費 DSE 練習平台，涵蓋 25 科獨立改寫試題。掌握邏輯，唔係背答案。',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF8',
    theme_color: '#00726C',
    lang: 'zh-HK',
    categories: ['education'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
