import SubjectsView from './SubjectsView'

export const metadata = {
  title: '科目總覽 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description: '25 個 HKDSE 科目都有原創改寫嘅 MC 練習；部分考核形式未於本站提供。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/subjects' },
}

export default function SubjectsPage() {
  return <SubjectsView />
}
