import type { Metadata } from 'next'
import SourceLabPageClient from './SourceLabPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata: Metadata = {
  title: '史料判讀室 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: 'DSE 歷史科史料題訓練：將事實、詮釋同立場分開睇。來源未查證嘅會明確標示。', // i18n-exempt
}

export default function Page() {
  return <SourceLabPageClient />
}
