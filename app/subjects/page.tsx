import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import SubjectsView from './SubjectsView'

export const metadata = completeSeoMetadata({
  title: '科目總覽 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '瀏覽 DSE Level Up 提供的香港 DSE 學科練習入口，按科目查看原創改寫題目、課題範圍與可用題型；不同科目的內容和考核形式並不相同，頁面會以實際題庫為準，不把未提供的卷別或技能宣稱為已涵蓋，所有練習材料均非 HKEAA 官方試題或官方評分安排。學生可由此選擇符合目前溫習需要的科目，再進入頁面閱讀提供的內容。', // i18n-exempt: zh-Hant fixed search metadata
}, '/subjects')

export default function SubjectsPage() {
  return (
    <>
      <PageBreadcrumb path="/subjects" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <SubjectsView />
    </>
  )
}
