import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import ReadingClient from './ReadingClient'

// 2026-08-21：本版原本淨係一個 client component，冇自己嘅 metadata，所以喺搜尋
// 結果同社交預覽入面同全站其他頁共用同一個泛用標題。老師／家長好多時就係由
// 搜尋結果撳入嚟，泛用標題等於冇講過呢版係咩。
//
// Next.js 只認 server component 嘅 `metadata`，所以呢度拆成「殼（server，帶
// metadata）＋ 內容（client，帶 i18n）」—— 同 /privacy、/community-safety 一致。
export const metadata = completeSeoMetadata({
  title: '英文閱讀練習 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '使用原創英文閱讀篇章與題目練習推論、語氣、修辭及從上下文找證據的能力；內容供香港 DSE 考生作額外練習，並非 HKEAA 官方試題、試卷或評分服務，頁面不聲稱取代課堂教學或考評局公布的歷屆試題，讓使用者清楚理解練習素材的來源與用途。學生可把篇章用作補充閱讀，不應據此推斷正式試卷題型、難度或出題安排。', // i18n-exempt: zh-Hant fixed search metadata
}, '/reading')

export default function Page() {
  return (
    <>
      <PageBreadcrumb path="/reading" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <ReadingClient />
    </>
  )
}
