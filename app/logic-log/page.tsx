import type { Metadata } from 'next'
import LogicLogView from './LogicLogView'

// 每日溫習足跡（SPEC-GAMIFY-P1 §模組一）。內容 100% 由學生自己的 localStorage
// 導出——沒有伺服器紀錄，故 noindex。入口由「我的進度」頁的橫向足跡列提供，
// 刻意不入 Navbar：橫向條實測已迫到 1,024px 斷點（見 components/Navbar.tsx）。
export const metadata: Metadata = {
  title: '溫習足跡 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，不跟 client locale
  robots: { index: false, follow: false },
}

export default function LogicLogPage() {
  return <LogicLogView />
}
