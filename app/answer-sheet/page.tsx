import { Suspense } from 'react'
import AnswerSheetClient from './AnswerSheetClient'

// 紙筆對答案 —— 由卷號重建同一份卷，自報答案 → 揭曉 → 錯因自診入 reverseLog。
// useSearchParams 需要 Suspense 邊界（App Router 靜態頁要求）。
export default function AnswerSheetPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#2D2D2D]">
      <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-8 text-sm text-[#6B6B6B]">…</div>}>
        <AnswerSheetClient />
      </Suspense>
    </div>
  )
}
