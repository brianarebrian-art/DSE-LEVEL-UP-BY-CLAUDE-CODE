import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import OffSyllabusView from './OffSyllabusView'
import { CATEGORIES } from '@/data/offSyllabus'

// 不考之地 —— content outside any DSE subject, learnt just for fun.
//
// Yuna (COO), 2026-09-26, under charter §18: non-DSE content stays inside DSE Level Up
// but out of prominent places. The only entries are the last item of the hamburger
// menu (components/Navbar.tsx) and of the desktop sidebar (components/Sidebar.tsx).
// Tagline, as decided: 「純粹為樂趣而學」. Scope rules: charter §1 point 2.1.
//
// Holds the everyday-Cantonese course (/cantonese) and, from 2026-09-27, 200 topic
// cards in 10 categories (data/offSyllabus, one page per category).

export const metadata = completeSeoMetadata({
  title: '不考之地 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '探索不屬任何 DSE 考試科目的廣東話生活支援與知識話題卡；這個角落不計分、不記錄進度，也不把興趣內容包裝成備試捷徑，只為仍在準備香港 DSE 的學生保留純粹為樂趣而學的空間，按分類閱讀香港、科技、生活及未來工作等主題。分類頁只為閱讀與探索而設，不會把瀏覽行為轉成分數、排名或其他學習比較，讓興趣自行展開。', // i18n-exempt: zh-Hant fixed search metadata
}, '/off-syllabus')

export default function OffSyllabusPage() {
  // Only the category list goes to the client; the cards load on each category page.
  const categories = CATEGORIES.map(({ slug, emoji, title, titleEn, cards }) => ({ slug, emoji, title, titleEn, count: cards.length }))
  return (
    <>
      <PageBreadcrumb path="/off-syllabus" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <OffSyllabusView categories={categories} />
    </>
  )
}
