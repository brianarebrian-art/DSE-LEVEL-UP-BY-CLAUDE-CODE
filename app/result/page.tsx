import { completeSeoMetadata } from '@/lib/seo'
import ResultPageClient from './ResultPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '練習結果 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '查看你的本機練習結果、答案解析與個人回顧。', // i18n-exempt: zh-Hant fixed search metadata
}, '/result')

export default function Page() {
  return <ResultPageClient />
}
