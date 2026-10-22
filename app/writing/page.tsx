import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import WritingClient from './WritingClient'

// 2026-08-21：本版原本淨係一個 client component，冇自己嘅 metadata，所以喺搜尋
// 結果同社交預覽入面同全站其他頁共用同一個泛用標題。老師／家長好多時就係由
// 搜尋結果撳入嚟，泛用標題等於冇講過呢版係咩。
//
// Next.js 只認 server component 嘅 `metadata`，所以呢度拆成「殼（server，帶
// metadata）＋ 內容（client，帶 i18n）」—— 同 /privacy、/community-safety 一致。
export const metadata = completeSeoMetadata({
  title: '英文寫作自評 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '以公開評核概念為參考，協助你逐項檢視英文寫作的任務回應、組織、語言與修訂方向；本頁提供的是自評支架，不會讀取後自動替文章評分、批改或給出 DSE 等級，學生須對照自己的文章與參考資料作判斷，並可把結果視為下一次練習的檢查清單，而非正式考評。使用者可按自己的需要反覆修訂與比較，不必提交文章、公開內容或接受自動評分。', // i18n-exempt: zh-Hant fixed search metadata
}, '/writing')

export default function Page() {
  return (
    <>
      <PageBreadcrumb path="/writing" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <WritingClient />
    </>
  )
}
