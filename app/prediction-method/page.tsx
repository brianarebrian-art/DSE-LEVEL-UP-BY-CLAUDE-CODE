import { PageBreadcrumb } from '@/components/Seo/SeoNavigation'
import { completeSeoMetadata } from '@/lib/seo'
import ArticleJsonLd from '@/components/Seo/ArticleJsonLd'
import PredictionMethodClient from './PredictionMethodClient'

// /prediction-method —— 練習表現係點計出嚟。
// 2026-09-30（改進循環 2）：結果頁不再顯示 DSE 等級，下文提到的 92%／83%／70% 分界線表已刪除。
//
// ══ 點解要有呢版 ══
// 信譽審核 §4：「網站已在多處說明等級預測只供參考，這是正確的；但看不到樣本數、
// 校準方法、誤差範圍或最低作答量。」講「僅供參考」係一句免責，唔係一個解釋 ——
// 學生睇完仍然唔知道嗰個 Level 4 憑咩嚟。
//
// 呢版嘅取態：唔係為個算法辯護，係公開佢有幾粗糙。實際數值（92%／83%／70%…）
// 直接由 data/cutoffs.ts 抄過嚟並標明佢係近似值，唔係考評局公布嘅分界線。
export const metadata = completeSeoMetadata({
  title: '練習表現點計 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '說明 DSE Level Up 結果頁如何根據一節練習呈現表現文字與範圍、哪些資料會影響畫面，以及為何這些資訊只可用作回顧練習；頁面公開方法的限制、未涵蓋的考核形式與不確定性，清楚區分本機練習表現摘要和 HKEAA 最終成績，避免把工具輸出誤當正式預測。學生可據此理解畫面所見資料的由來，同時保留對學習需要的自主判斷。', // i18n-exempt: zh-Hant fixed search metadata
}, '/prediction-method')

export default function Page() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <PageBreadcrumb path="/prediction-method" title={String(metadata.title).replace(/\s*\|\s*DSE Level Up$/, '')} />
      <PredictionMethodClient />
      {/* Article 結構化資料 ＋ 頁底可見日期（日期由 lib/articleDates.ts 讀） */}
      <ArticleJsonLd route="/prediction-method" meta={metadata} visibleHeadline="練習表現係點計出嚟" />{/* i18n-exempt: zh-Hant visible H1 parity */}
    </div>
  )
}
