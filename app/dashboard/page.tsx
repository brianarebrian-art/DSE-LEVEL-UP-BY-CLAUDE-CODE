import { completeSeoMetadata } from '@/lib/seo'
import DashboardPageClient from './DashboardPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '我的進度 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '查看由你本機練習紀錄整理的學習進度與個人統計。', // i18n-exempt: zh-Hant fixed search metadata
}, '/dashboard')

export default function Page() {
  return <DashboardPageClient />
}
