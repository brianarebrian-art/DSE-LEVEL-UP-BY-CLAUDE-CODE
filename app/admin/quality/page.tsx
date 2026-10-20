import { redirect } from 'next/navigation'
import { requireReviewer } from '@/lib/auth/reviewerAllowlist'
import QualityReviewClient from './QualityReviewClient'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: '逐題質素覆核工作台 | DSE Level Up',
  description: '供獲授權教師、科目編輯及義工使用的 DSE Level Up 題目質素覆核介面。',
}

export default async function QualityReviewPage() {
  const reviewer = await requireReviewer()
  if (!reviewer) redirect('/')
  return <QualityReviewClient initialReviewer={{ name: reviewer.name, role: reviewer.role }} />
}
