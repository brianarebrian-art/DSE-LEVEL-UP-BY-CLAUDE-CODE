import type { Metadata } from 'next'
import PredictorClient from './PredictorClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
// noindex：同 /dashboard 一樣，內容全部由 localStorage 喺客戶端生成，
// 伺服器端係空殼（見 app/sitemap.ts 第 ② 類）。
export const metadata: Metadata = {
  title: '等級預測 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  robots: { index: false, follow: false },
}

export default function Page() {
  return <PredictorClient />
}
