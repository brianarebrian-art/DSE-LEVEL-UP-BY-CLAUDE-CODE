import type { Metadata } from 'next'
import ReportPageClient from './ReportPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata: Metadata = {
  title: '我嘅溫書地圖 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  robots: { index: false, follow: false },
}

export default function Page() {
  return <ReportPageClient />
}
