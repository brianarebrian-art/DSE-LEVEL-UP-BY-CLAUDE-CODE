import type { Metadata } from 'next'
import RelaxPageClient from './RelaxPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata: Metadata = {
  title: '呼吸空間 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '考試壓力大嗰陣嘅緩衝區：呼吸、接地、獨處充電。純本機，唔會儲存你嘅情緒紀錄。', // i18n-exempt
}

export default function Page() {
  return <RelaxPageClient />
}
