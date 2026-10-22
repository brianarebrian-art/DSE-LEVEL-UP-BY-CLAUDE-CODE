import { completeSeoMetadata } from '@/lib/seo'
import PredictorClient from './PredictorClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
// noindex：同 /dashboard 一樣，內容全部由 localStorage 喺客戶端生成，
// 伺服器端係空殼（見 app/sitemap.ts 第 ② 類）。
export const metadata = completeSeoMetadata({
  title: '練習表現估算 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '查看由你本機練習紀錄產生的練習表現估算與使用說明。', // i18n-exempt: zh-Hant fixed search metadata
}, '/predictor')

export default function Page() {
  return <PredictorClient />
}
