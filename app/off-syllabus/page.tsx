import OffSyllabusView from './OffSyllabusView'
import { CATEGORIES } from '@/data/offSyllabus'
import { SITE_ORIGIN } from '@/lib/site'

// 不考之地 —— content outside any DSE subject, learnt just for fun.
//
// Yuna (COO), 2026-09-26, under charter §18: non-DSE content stays inside DSE Level Up
// but out of prominent places. The only entries are the last item of the hamburger
// menu (components/Navbar.tsx) and of the desktop sidebar (components/Sidebar.tsx).
// Tagline, as decided: 「純粹為樂趣而學」. Scope rules: charter §1 point 2.1.
//
// Holds the everyday-Cantonese course (/cantonese) and, from 2026-09-27, 200 topic
// cards in 10 categories (data/offSyllabus, one page per category).

export const metadata = {
  title: '不考之地 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description: '不屬任何 DSE 科目、亦不會在考試出現的內容，純粹為樂趣而學。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/off-syllabus' },
  openGraph: {
    type: 'website',
    url: `${SITE_ORIGIN}/off-syllabus`,
    title: '不考之地｜純粹為樂趣而學 | DSE Level Up',
    description: '200 張不考冷知識卡，探索廣東話、香港、科技、生活與未來工作。',
    siteName: 'DSE Level Up',
  },
  twitter: {
    card: 'summary_large_image',
    title: '不考之地｜DSE Level Up',
    description: '200 張不考冷知識卡，純粹為樂趣而學。',
  },
}

export default function OffSyllabusPage() {
  // Only the category list goes to the client; the cards load on each category page.
  const categories = CATEGORIES.map(({ slug, emoji, title, titleEn, cards }) => ({ slug, emoji, title, titleEn, count: cards.length }))
  return <OffSyllabusView categories={categories} />
}
