import type { Metadata } from 'next'
import DashboardPageClient from './DashboardPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata: Metadata = {
  title: '我的進度 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  robots: { index: false, follow: false },
}

export default function Page() {
  return <DashboardPageClient />
}
