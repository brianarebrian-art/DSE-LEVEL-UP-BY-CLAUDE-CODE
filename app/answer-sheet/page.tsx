import type { Metadata } from 'next'
import { Suspense } from 'react'
import AnswerSheetClient from './AnswerSheetClient'

// 紙筆對答案 —— 由卷號重建同一份卷，自報答案 → 揭曉 → 錯因自診入 reverseLog。
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
    '輸入紙筆戰士卷號，重建同一份試卷並逐題對答案。答錯可即場自診概念盲區、審題陷阱或運算粗心。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/answer-sheet' },
}

export default function AnswerSheetPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="sr-only">
        <h1>紙筆對答案 · Paper answer sheet{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h1>
        <p>輸入「紙筆戰士」列印卷上的卷號，系統會以同一組亂數重建完全相同的試卷。逐題輸入你在紙上的答案，即時揭曉對錯，並可就答錯的題目自我診斷錯因（概念盲區、審題陷阱、運算粗心），記錄會併入你的錯因雷達。所有題目為原創改寫，並非香港考試及評核局（HKEAA）官方試題。{/* i18n-exempt: 雙語已並列，緊接下段英文（server component 冇 locale） */}</p>
        <p>
          Enter the paper code printed on a Paper Warrior mock paper to rebuild the identical paper, mark your
          written answers question by question, and log the cause of each mistake. Not affiliated with the HKEAA.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="mx-auto max-w-2xl px-4 py-8 text-sm text-[#6B6B6B]">
            載入中… · Loading…{/* i18n-exempt: 雙語已並列（Suspense fallback 喺 server component 內，冇 locale） */}
          </div>
        }
      >
        <AnswerSheetClient />
      </Suspense>
    </div>
  )
}
