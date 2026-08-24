import type { Metadata } from 'next'
import ConceptNetView from './ConceptNetView'

// 知識概念網（規格書 §4.4）。節點嘅發光狀態 100% 由學生自己嘅 localStorage 推導，
// 冇伺服器紀錄，故 noindex。入口由「我的進度」頁提供，刻意唔入 Navbar ——
// 橫向條實測已迫到 1,024px 斷點（見 components/Navbar.tsx）。
export const metadata: Metadata = {
  title: '知識概念網 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  robots: { index: false, follow: false },
}

export default function ConceptNetPage() {
  return <ConceptNetView />
}
