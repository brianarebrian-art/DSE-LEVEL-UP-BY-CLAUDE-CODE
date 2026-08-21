import type { Metadata } from 'next'
import SoloPageClient from './SoloPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata: Metadata = {
  title: '獨處充電 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: 'Lo-fi 電台、雨聲白噪音、雙耳節拍同番茄鐘。效果因人而異，唔會作任何醫療聲稱。', // i18n-exempt
}

export default function Page() {
  return <SoloPageClient />
}
