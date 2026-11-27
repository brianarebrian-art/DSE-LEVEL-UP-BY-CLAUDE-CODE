import { completeSeoMetadata } from '@/lib/seo'
import { SurveyList } from '@/components/research/SurveyList'

export const metadata = completeSeoMetadata({
  title: '研究問卷 | DSE Level Up',
  description: '建立、複本、發佈、暫停或封存 DSE Level Up 用戶研究問卷。資料只留喺呢部瀏覽器。',
}, '/research/admin/surveys')

export default function ResearchSurveysPage() {
  return <SurveyList />
}
