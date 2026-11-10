import { completeSeoMetadata } from '@/lib/seo'
import AcceptanceClient from './AcceptanceClient'

export const metadata = completeSeoMetadata({
  title: '隔離驗收儀表板 | DSE Level Up', // i18n-exempt: admin internal only
  description: '展示 UI/UX 轉換漏斗重設、SEO/GEO/AEO 題目靜態頁與 AI 爬蟲支援、以及廣告 Landing 與預算控管成果。', // i18n-exempt: admin internal only
}, '/acceptance')

export default function AcceptancePage() {
  return <AcceptanceClient />
}
