import { QUESTION_STATUS_LABEL, type QuestionStatus } from '@/lib/questionStatus'

// 練習頁頂的各題狀態列（UX 循環 LOOP 19；創辦人決定 2，2026-09-30）。
//
// 取代原本頁頂的細進度條及頁底的一行圓點：圓點只靠顏色分對錯、沒有題號，
// 而且在回饋及解析之下，答題時看不到。這一列放在頁頂，每格有題號。
// 只顯示，不可撳（決定 2 選 A）：用 <ol>／<li>，沒有按鈕或連結。
// 「答啱」與「發現盲點」除了顏色，邊框亦不同（實線／虛線），色弱亦分得出。
const STYLE: Record<QuestionStatus, string> = {
  correct: 'border-accent bg-accent/15 text-accent-strong',
  blindSpot: 'border-dashed border-gold bg-gold/10 text-gold-strong',
  current: 'border-accent-strong bg-accent-strong text-on-accent font-semibold',
  todo: 'border-line text-ink-muted',
}

export default function QuestionStatusStrip({
  statuses,
  current,
  en,
}: {
  statuses: readonly QuestionStatus[]
  current: number
  en: boolean
}) {
  return (
    <ol aria-label={en ? 'Question status' : '各題狀態'} className="flex gap-1">
      {statuses.map((s, i) => {
        const label = en ? QUESTION_STATUS_LABEL[s].en : QUESTION_STATUS_LABEL[s].zh
        return (
          <li
            key={i}
            aria-current={i === current ? 'step' : undefined}
            className={`flex h-6 min-w-0 flex-1 items-center justify-center rounded-md border text-[11px] leading-none tabular-nums transition-colors ${STYLE[s]}`}
          >
            <span aria-hidden>{i + 1}</span>
            <span className="sr-only">{en ? `Question ${i + 1}: ${label}` : `第 ${i + 1} 題：${label}`}</span>
          </li>
        )
      })}
    </ol>
  )
}
