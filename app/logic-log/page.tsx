import { completeSeoMetadata } from '@/lib/seo'
import LogicLogView from './LogicLogView'

// 每日溫習足跡（SPEC-GAMIFY-P1 §模組一）。內容 100% 由學生自己的 localStorage
// 導出——沒有伺服器紀錄，故 noindex。入口由「我的進度」頁的橫向足跡列提供，
// 刻意不入 Navbar：橫向條實測已迫到 1,024px 斷點（見 components/Navbar.tsx）。
export const metadata = completeSeoMetadata({
  title: '溫習足跡 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '查看由你本機練習紀錄整理的溫習足跡與累積學習活動。', // i18n-exempt: zh-Hant fixed search metadata
}, '/logic-log')

export default function LogicLogPage() {
  return <LogicLogView />
}
