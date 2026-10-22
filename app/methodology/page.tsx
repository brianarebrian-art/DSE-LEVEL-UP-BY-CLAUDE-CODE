import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import ArticleJsonLd from '@/components/Seo/ArticleJsonLd'
import MethodologyClient from './MethodologyClient'

// 2026-08-21：本版原本淨係一個 client component，冇自己嘅 metadata，所以喺搜尋
// 結果同社交預覽入面同全站其他頁共用同一個泛用標題。老師／家長好多時就係由
// 搜尋結果撳入嚟，泛用標題等於冇講過呢版係咩。
//
// Next.js 只認 server component 嘅 `metadata`，所以呢度拆成「殼（server，帶
// metadata）＋ 內容（client，帶 i18n）」—— 同 /privacy、/community-safety 一致。
export const metadata = completeSeoMetadata({
  title: '出題方法 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '了解 DSE Level Up 如何以原創平行改寫建立練習題、如何交代題目來源與限制，以及為何書寫題只提供參考答案和自評方向而不作機器批改；頁面同時說明自動檢查與人手覆核各自能做和不能做的事，讓使用者按可查證資訊理解題庫的適用範圍。使用者可從中分辨練習素材的教育用途、相關技術處理與仍需自行核對的部分。', // i18n-exempt: zh-Hant fixed search metadata
}, '/methodology')

export default function Page() {
  return (
    <>
      <PageBreadcrumb path="/methodology" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <MethodologyClient />
      {/* Article 結構化資料 ＋ 頁底可見日期（日期由 lib/articleDates.ts 讀） */}
      <ArticleJsonLd route="/methodology" meta={metadata} visibleHeadline="點解改寫版練習真係可以幫你考好 DSE？" />{/* i18n-exempt: zh-Hant visible H1 parity */}
    </>
  )
}
