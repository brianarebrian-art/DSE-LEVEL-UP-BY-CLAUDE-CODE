import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import FeedbackClient from './FeedbackClient'

export const metadata = completeSeoMetadata({
  title: '匿名意見 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '匿名意見頁，可以唔填。用情景選擇話我哋知邊啲功能有幫助，包括只做一題、錯因分析、專注燈、安靜模式、考試急症室同無障礙，亦可以講一個「原來係咁」嘅瞬間。唔記帳戶、電郵或 IP，送出後冇分數。', // i18n-exempt: zh-Hant fixed search metadata
}, '/feedback')

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      <PageBreadcrumb path="/feedback" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <FeedbackClient />
    </div>
  )
}
