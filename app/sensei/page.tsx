import type { Metadata } from 'next'
import SenseiClient from './SenseiClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata: Metadata = {
  title: 'SENSEI | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: 'SENSEI 是 DSE Level Up 的 AI 學習助手：只檢索由真人審核過的知識卡片，不會自行生成答案。', // i18n-exempt
}

export default function Page() {
  return <SenseiClient />
}
