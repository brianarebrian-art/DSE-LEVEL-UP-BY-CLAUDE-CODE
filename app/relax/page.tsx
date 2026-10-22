import { completeSeoMetadata } from '@/lib/seo'
import RelaxPageClient from './RelaxPageClient'

// 拆殼原因見 app/about/page.tsx —— Next.js 只認 server component 嘅 `metadata`。
export const metadata = completeSeoMetadata({
  title: '呼吸空間 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '在溫習壓力較大時選用呼吸、接地或獨處充電工具，按自己的節奏短暫休息後再回到學習；這些內容不替代醫療、心理治療、學校輔導或危機支援，平台不會收集你的情緒回答或健康資料，若你感到不安全或需要即時協助，應聯絡可信任人士或當地緊急服務。每項工具均可隨時自行開始或停止，休息後可按需要隨時再回到原本的溫習安排。', // i18n-exempt: zh-Hant fixed search metadata
}, '/relax')

export default function Page() {
  return <RelaxPageClient />
}
