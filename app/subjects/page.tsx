import SubjectsView from './SubjectsView'

export const metadata = {
  title: '科目總覽 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description: '涵蓋所有 HKDSE 科目的改寫版練習——核心科目已上線，其餘陸續推出。', // i18n-exempt: 靜態 SEO meta description
}

export default function SubjectsPage() {
  return <SubjectsView />
}
