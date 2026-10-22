import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import ArticleJsonLd from '@/components/Seo/ArticleJsonLd'
import TrustClient from './TrustClient'

// /trust —— 信任中心。
//
// ══ 點解要多一版 ══
// 到 2026-08-21 為止，可驗證嘅資料散落喺五版：/transparency、/privacy、
// /community-safety、/prediction-method、/methodology。
// 每一版本身都準，但一個家長或者老師想「快速判斷呢個平台可唔可以畀學生用」，
// 要自己喺 footer 逐條撳入去砌返個全貌。
//
// 呢版唔加任何新聲稱 —— 佢只做一件事：將已經存在嘅答案排好，並且喺最頂寫清楚
// 我哋【唔係】咩。頭三行就講唔係官方、唔係認證、唔係危機服務，係刻意嘅：
// 一版信任頁如果由「我哋幾好」開始，讀者第一個反應就係戒備。
export const metadata = completeSeoMetadata({
  title: '信任中心 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '在同一頁核對 DSE Level Up 的服務身分、題目來源、資料處理、學生安全與練習表現說明，並連結到各項原始政策與方法頁；平台清楚說明自己不是 HKEAA、認證機構、醫療服務或危機支援，讓學生、家長和教師可先看限制與可查證依據，再決定是否使用。所有連結頁均保留其詳細內容，方便讀者回到原文核對，而非只依賴摘要判斷。', // i18n-exempt: zh-Hant fixed search metadata
}, '/trust')

export default function Page() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PageBreadcrumb path="/trust" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <TrustClient />
      {/* Article 結構化資料 ＋ 頁底可見日期（日期由 lib/articleDates.ts 讀） */}
      <ArticleJsonLd route="/trust" meta={metadata} />
    </div>
  )
}
