import { completeSeoMetadata } from '@/lib/seo'
import { SettingsPanel } from '@/components/research/SettingsPanel'

export const metadata = completeSeoMetadata({
  title: '研究設定 | DSE Level Up',
  description: '調較用戶研究工作台嘅顯示密度，以及預覽載入、空白同錯誤狀態。唔會刪走示範數據。',
}, '/research/admin/settings')

export default function ResearchSettingsPage() {
  return <SettingsPanel />
}
