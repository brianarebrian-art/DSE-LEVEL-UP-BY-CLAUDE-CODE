'use client'

import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'
import { notesInDisplayOrder, type DisplayOption } from '@/lib/optionNotes'
import type { OptionNote } from '@/data/questions/types'

// Per-option rationale, shown after the student answers (2026-09-29).
//
// Each note is printed under the option it explains, quoting that option's own text,
// in the order the student saw the options. It never says "the second option": the
// link between note and option is `optionId` (lib/optionNotes.ts), not position.
// Questions without notes render nothing here and keep their prose explanation.
export default function OptionNotes({
  notes,
  options,
  correctId,
  selectedZh,
}: {
  notes: readonly OptionNote[] | undefined
  /** The options exactly as displayed, in display order. */
  options: readonly DisplayOption[]
  /** Stored index of the correct option (the question's correctIndex). */
  correctId: number
  /** The option the student picked, by its Chinese text (grading is anchored to it). */
  selectedZh: string | null
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const rows = notesInDisplayOrder(notes, options)
  if (!rows.length) return null

  return (
    <div className="mt-3 border-t border-gold/15 pt-3">
      <p className="mb-2 text-xs font-medium text-ink-muted">{en ? 'Option by option' : '逐個選項睇'}</p>
      <ul className="space-y-2">
        {rows.map(({ option, note }) => {
          const correct = option.optionId === correctId
          const picked = option.zh === selectedZh
          return (
            <li
              key={option.optionId}
              className={`rounded-lg border p-3 text-sm ${correct ? 'border-accent/30 bg-accent/[0.05]' : 'border-line bg-surface-raised'}`}
            >
              <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-medium text-ink">
                  <MathText>{en && option.en ? option.en : option.zh}</MathText>
                </span>
                {correct && <span className="text-xs font-medium text-accent-strong">{en ? 'Correct answer' : '正確答案'}</span>}
                {picked && !correct && <span className="text-xs font-medium text-ink-muted">{en ? 'Your choice' : '你揀咗呢個'}</span>}
              </div>
              <p className="leading-relaxed text-ink-soft">
                <MathText>{en && note.en ? note.en : note.zh}</MathText>
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
