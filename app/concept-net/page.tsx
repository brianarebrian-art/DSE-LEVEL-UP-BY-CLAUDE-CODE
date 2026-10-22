import { completeSeoMetadata } from '@/lib/seo'
import ConceptNetView from './ConceptNetView'

// 知識概念網（規格書 §4.4）。節點嘅發光狀態 100% 由學生自己嘅 localStorage 推導，
// 冇伺服器紀錄，故 noindex。入口由「我的進度」頁提供，刻意唔入 Navbar ——
// 橫向條實測已迫到 1,024px 斷點（見 components/Navbar.tsx）。
export const metadata = completeSeoMetadata({
  title: '知識概念網 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '以你的本機練習紀錄顯示學科概念連結與完成狀態的個人概念網。', // i18n-exempt: zh-Hant fixed search metadata
}, '/concept-net')

export default function ConceptNetPage() {
  return <ConceptNetView />
}
