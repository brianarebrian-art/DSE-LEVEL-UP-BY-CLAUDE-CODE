import OffSyllabusView from './OffSyllabusView'

// 不考之地 —— content outside any DSE subject, learnt just for fun.
//
// Yuna (COO), 2026-09-26, under charter §18: non-DSE content stays inside DSE Level Up
// but out of prominent places. The only entries are the last item of the hamburger
// menu (components/Navbar.tsx) and of the desktop sidebar (components/Sidebar.tsx).
// Tagline, as decided: 「純粹為樂趣而學」. Scope rules: charter §1.2 note.
//
// First (and so far only) item: everyday Cantonese for students new to Hong Kong
// (/cantonese). More non-exam topics may be added later, each by founder decision.

export const metadata = {
  title: '不考之地 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description: '不屬任何 DSE 科目、亦不會在考試出現的內容，純粹為樂趣而學。', // i18n-exempt: 靜態 SEO meta description
}

export default function OffSyllabusPage() {
  return <OffSyllabusView />
}
