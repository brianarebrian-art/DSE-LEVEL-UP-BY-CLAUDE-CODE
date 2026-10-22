import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import ArticleJsonLd from '@/components/Seo/ArticleJsonLd'
import CommunitySafetyClient from './CommunitySafetyClient'

// /community-safety —— 學生安全。
//
// ══ 2026-08-21 重寫 ══
// 上一版寫嘅係「影子溫書室點樣審核」。而家個牆已經整個刪走（見
// docs/DECISION-no-interaction.md），所以呢版嘅答案由「我哋點管一個社群」
// 變成「我哋唔會有一個要管嘅社群」。
//
// 呢個唔係退場，係一個更硬嘅承諾：一個唔存在嘅功能，唔會失守。
//
// 2026-08-21 對住代碼核實：
//   · 零用戶對用戶路徑 —— 冇訊息、冇留言、冇心心、冇跟隨、冇配對、冇語音
//   · 零用戶內容表（migrations 掃過）
//   · 零在線人數（真實或虛構）
//   · /focus 房號係純前端、各自計時、零資料交換 —— 界線由測試釘死
//   全部由 lib/__tests__/no-interaction.test.mts 守住
export const metadata = completeSeoMetadata({
  title: '學生安全 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '說明 DSE Level Up 為何不設私訊、留言、按讚、配對或任何學生互動功能，並列出使用外部網絡服務時應留意的安全界線與求助方向；頁面不以平台代替家長、學校、專業人員或緊急支援，讓學生在學習以外亦可理解自己的網絡安全選擇。相關說明著重預防與資訊界線，並提醒使用者遇到實際風險時尋求適當支援，並求助。', // i18n-exempt: zh-Hant fixed search metadata
}, '/community-safety')

export default function CommunitySafetyPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PageBreadcrumb path="/community-safety" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <CommunitySafetyClient />
      {/* Article 結構化資料 ＋ 頁底可見日期（日期由 lib/articleDates.ts 讀） */}
      <ArticleJsonLd route="/community-safety" meta={metadata} />
    </div>
  )
}
