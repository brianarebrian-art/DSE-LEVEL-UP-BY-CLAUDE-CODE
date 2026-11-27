import { completeSeoMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import AnswerSheetClient from './AnswerSheetClient'

// 紙筆對答案 —— 由卷號（或紙上 QR）重建同一份卷，開卷即出全部答案 → 自剔 →
// 錯因自診入 reverseLog → 成績入 dse_progress / dse_topic_stats。
// useSearchParams 需要 Suspense 邊界（App Router 靜態頁要求）。
//
// ── 伺服器端內容（2026-07-29，Backlog A-34）──────────────────────────────────
// 原本 Suspense fallback 只係一個「…」，而全頁內容都喺 client，
// 即係爬蟲攞到嘅 HTML 由頭到尾得一個省略號。
// 而家補返 server 端標題與用法說明（呢啲本來就係靜態文字，唔涉個人數據），
// fallback 亦由「…」改為有意義嘅載入提示。互動邏輯無任何改動。

export const metadata = completeSeoMetadata({
  title: '紙筆對答案 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '確認做完列印練習卷後，以卷號開啟答案紙，對照正確答案、解析並自行記錄紙筆練習結果。', // i18n-exempt: zh-Hant fixed search metadata
}, '/answer-sheet')

export default function AnswerSheetPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <div className="sr-only">
        {/* 2026-10-01（R2-11）：原本係 h1，同頁面本身的 h1 重複（全頁兩個 h1）。 */}
        <p>紙筆對答案 · Paper answer sheet{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</p>
        <p>輸入卷號後，先確認已經做完，系統才重建該卷並顯示正確答案與解析。純題目卷不會印出 QR 或卷號。你可對照紙上答案逐題自行批改，就答錯的題目自我診斷錯因，並將成績存入個人進度。所有題目為原創改寫，並非香港考試及評核局（HKEAA）官方試題。{/* i18n-exempt: 雙語已並列，緊接下段英文（server component 冇 locale） */}</p>
        <p>
          Enter the paper code and confirm that you have finished. Only then does the page rebuild that paper
          and show the answers and explanations. A questions-only paper does not print a QR code or a paper code.
          Not affiliated with the HKEAA.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl px-4 py-8 text-sm text-ink-muted">
            載入中… · Loading…{/* i18n-exempt: 雙語已並列（Suspense fallback 喺 server component 內，冇 locale） */}
          </div>
        }
      >
        <AnswerSheetClient />
      </Suspense>
    </div>
  )
}
