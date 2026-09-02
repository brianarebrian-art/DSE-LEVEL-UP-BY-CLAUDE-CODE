import type { Metadata } from 'next'
import ExamDayClient from './ExamDayClient'

export const metadata: Metadata = {
  title: '考試日管家 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '考試朝早嘅天氣同車務，一版睇晒。資料來自香港天文台同 data.gov.hk 公開資料。', // i18n-exempt
}

export default function Page() {
  return <ExamDayClient />
}
