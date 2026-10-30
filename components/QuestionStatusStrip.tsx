import { QUESTION_STATUS_LABEL, type QuestionStatus } from '@/lib/questionStatus'

// 判斷軌：練習頁頂各題狀態（UX LOOP 19；Phase 3 signature）。
// 只顯示、不可跳題。答啱／發現盲點除顏色外，邊框亦不同（實線／虛線）。
const STYLE: Record<QuestionStatus, string> = {
  correct: 'border-accent bg-accent/15 text-accent-strong',
  blindSpot: 'border-dashed border-gold bg-gold/10 text-gold-strong',
  current: 'border-accent-strong bg-accent-strong text-on-accent font-semibold ring-1 ring-accent-strong/30',
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
    <div>
      <ol aria-label={en ? 'Question status' : '各題狀態'} className="flex gap-1">
        {statuses.map((s, i) => {
          const label = en ? QUESTION_STATUS_LABEL[s].en : QUESTION_STATUS_LABEL[s].zh
          return (
            <li
              key={i}
              aria-current={i === current ? 'step' : undefined}
              className={`flex h-7 min-w-0 flex-1 items-center justify-center rounded-md border text-[11px] leading-none tabular-nums transition-colors duration-150 ${STYLE[s]}`}
            >
              <span aria-hidden>{i + 1}</span>
              <span className="sr-only">{en ? `Question ${i + 1}: ${label}` : `第 ${i + 1} 題：${label}`}</span>
            </li>
          )
        })}
      </ol>
      {/* Nielsen H6／H10：可見說明（唔淨係 sr-only）——減少「點解撳唔到跳題」嘅猜測。 */}
      <p className="practice-status-hint mt-1.5 text-[11px] leading-snug text-ink-muted">
        {en
          ? 'Numbers show progress only — you can’t jump back. The correct option stays on this question.'
          : '題號只顯示進度，唔可以跳返已做嘅題。正確答案留喺而家呢題。'}
      </p>
    </div>
  )
}
