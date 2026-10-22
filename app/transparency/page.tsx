import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import ArticleJsonLd from '@/components/Seo/ArticleJsonLd'
import TransparencyClient from './TransparencyClient'
import { repairStats, recentWithdrawals } from '@/data/questions/repair-stats'
import { CONTENT_STATS } from '@/data/questions/summary.generated'

// 2026-08-21：本版原本淨係一個 client component，冇自己嘅 metadata，所以喺搜尋
// 結果同社交預覽入面同全站其他頁共用同一個泛用標題。老師／家長好多時就係由
// 搜尋結果撳入嚟，泛用標題等於冇講過呢版係咩。
//
// Next.js 只認 server component 嘅 `metadata`，所以呢度拆成「殼（server，帶
// metadata）＋ 內容（client，帶 i18n）」—— 同 /privacy、/community-safety 一致。
export const metadata = completeSeoMetadata({
  title: '透明度 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '查閱 DSE Level Up 如何製作及更新題目、AI 在哪些環節參與、哪些內容經自動檢查或覆核，以及發現問題後如何收起或修正；頁面以實際題庫統計、修復紀錄和資料處理方式說明限制，不把系統檢查描述成真人或教師逐題認證，方便學生、家長和教師核對平台聲稱。讀者可由頁內連結回到各說明，查看技術流程、內容處理與學生資料政策。', // i18n-exempt: zh-Hant fixed search metadata
}, '/transparency')

export default function Page() {
  return (
    <>
      <PageBreadcrumb path="/transparency" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      {/* 修復數字在 server 計算，只把數字傳到瀏覽器（data/questions/repair-stats.ts）。 */}
      <TransparencyClient stats={repairStats()} content={CONTENT_STATS} withdrawals={recentWithdrawals()} />
      {/* Article 結構化資料 ＋ 頁底可見日期（日期由 lib/articleDates.ts 讀） */}
      <ArticleJsonLd route="/transparency" meta={metadata} visibleHeadline="透明度報告" />{/* i18n-exempt: zh-Hant visible H1 parity */}
    </>
  )
}
