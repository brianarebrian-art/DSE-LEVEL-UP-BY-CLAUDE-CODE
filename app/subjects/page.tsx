import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import { getActiveSubjects } from '@/data/subjects'
import { SUBJECT_SUMMARY, TOTAL_QUESTIONS } from '@/data/questions/summary.generated'
import { SITE_ORIGIN } from '@/lib/site'
import { JsonLd } from '@/components/Seo/JsonLd'
import SubjectsView from './SubjectsView'

const active = getActiveSubjects()
const SUBJECT_COUNT = active.length

export const metadata = completeSeoMetadata({
  title: '科目總覽 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  // 150 Unicode chars at current SUBJECT_COUNT／TOTAL_QUESTIONS（seo description gate）。
  description: `瀏覽 DSE Level Up 提供的 ${SUBJECT_COUNT} 個香港 DSE 學科練習入口（合共 ${TOTAL_QUESTIONS} 條原創改寫題），按科目查看課題範圍與可用題型；不同科目的內容和考核形式並不相同，頁面會以實際題庫為準，不把未提供的卷別或技能宣稱為已涵蓋，材料均非 HKEAA 官方試題或評分安排。學生可由此選科後開始練習。`, // i18n-exempt: zh-Hant fixed search metadata
}, '/subjects')

export default function SubjectsPage() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_ORIGIN}/subjects#list`,
    name: 'HKDSE subjects on DSE Level Up',
    numberOfItems: active.length,
    itemListElement: active.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `${SITE_ORIGIN}/subjects/${s.id}`,
      description: `${SUBJECT_SUMMARY[s.id]?.mc ?? 0} MC, ${SUBJECT_SUMMARY[s.id]?.written ?? 0} written`,
    })),
  }

  return (
    <>
      <PageBreadcrumb path="/subjects" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <JsonLd data={itemList} />
      <SubjectsView />
    </>
  )
}
