import { completeSeoMetadata } from '@/lib/seo'
import { redirect } from 'next/navigation'
import { requireReviewer } from '@/lib/auth/reviewerAllowlist'
import QualityReviewClient from './QualityReviewClient'

export const dynamic = 'force-dynamic'
export const metadata = completeSeoMetadata({
  title: '逐題質素覆核工作台 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '僅供獲授權覆核人員逐題檢視 DSE Level Up 題目品質與提交覆核決定的內部工作台。', // i18n-exempt: zh-Hant fixed search metadata
}, '/admin/quality')

export default async function QualityReviewPage() {
  const reviewer = await requireReviewer()
  if (!reviewer) redirect('/')
  return <QualityReviewClient initialReviewer={{ name: reviewer.name, role: reviewer.role }} />
}
