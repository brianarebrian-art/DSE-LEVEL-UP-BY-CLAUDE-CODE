import { completeSeoMetadata } from '@/lib/seo'
import ExamDayClient from './ExamDayClient'

export const metadata = completeSeoMetadata({
  title: '考試日管家 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '按本機選擇整理考試日天氣與交通公開資料的個人準備工具。', // i18n-exempt: zh-Hant fixed search metadata
}, '/exam-day')

export default function Page() {
  return <ExamDayClient />
}
