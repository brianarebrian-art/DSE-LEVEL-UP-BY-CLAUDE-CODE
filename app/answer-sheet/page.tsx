import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  title: '紙筆對答案 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description:
    '掃描紙筆戰士試卷上的 QR 或輸入卷號，即時顯示全卷正確答案與解析。對照紙上答案自行批改，答錯可自診概念盲區、審題陷阱或運算粗心，成績併入個人進度。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/answer-sheet' },
}

export default function AnswerSheetPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <div className="sr-only">
        <h1>紙筆對答案 · Paper answer sheet{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h1>
        <p>掃描「紙筆戰士」列印卷上的 QR 碼，或輸入卷號，系統會以同一組亂數重建完全相同的試卷，並即時顯示全卷正確答案與解析。你可對照紙上答案逐題自行批改，就答錯的題目自我診斷錯因（概念盲區、審題陷阱、運算粗心），並將成績存入個人進度與錯因雷達。所有題目為原創改寫，並非香港考試及評核局（HKEAA）官方試題。{/* i18n-exempt: 雙語已並列，緊接下段英文（server component 冇 locale） */}</p>
        <p>
          Scan the QR code on a printed Paper Warrior paper, or enter its paper code, to rebuild the identical
          paper and see every correct answer and explanation immediately. Mark your paper against it, log the
          cause of each mistake, and save the result to your progress. Not affiliated with the HKEAA.
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
