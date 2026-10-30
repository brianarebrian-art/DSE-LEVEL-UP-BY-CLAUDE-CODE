'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import MathText from '@/components/MathText'
import { useLocale } from '@/lib/i18n'
import { previewSteps } from '@/lib/explanationPreview'

// Show two or three short pieces as soon as the answer is revealed.
// A question that already carries real `steps` uses those. Prose explanations
// are split on sentence boundaries only — never labelled "step 1", because a
// sentence is not a worked line.
// Students who previously chose "always show everything" keep that preference.
// The control that asked them to stop hiding the text has been removed.

const KEY_ALWAYS_FULL = 'dse_explain_always_full'

export default function StagedExplanation({
  text,
  steps,
  label,
}: {
  /** Full explanation, already in the active language. */
  text: string
  /** Real steps, already in the active language. Absent means prose mode. */
  steps?: string[]
  /** Optional lead-in, for example "Reasoning:". */
  label?: React.ReactNode
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const hasSteps = !!steps && steps.length > 1
  const preview = hasSteps ? null : previewSteps(text)

  const [alwaysFull, setAlwaysFull] = useState(false)
  const [full, setFull] = useState(false)

  useEffect(() => {
    try {
      setAlwaysFull(localStorage.getItem(KEY_ALWAYS_FULL) === '1')
    } catch {
      setAlwaysFull(false)
    }
  }, [])

  useEffect(() => {
    setFull(false)
  }, [text])

  const showAll = () => setFull(true)
  const moreButton = (zh: string, enLabel: string) => (
    <button
      type="button"
      onClick={showAll}
      className="mt-3 inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-accent/30 bg-surface-sunken px-3 text-xs font-medium text-accent transition-colors hover:bg-surface-sunken"
    >
      {en ? enLabel : zh}
      <ChevronDown size={13} aria-hidden />
    </button>
  )

  if (alwaysFull || (!hasSteps && preview && preview.rest.length === 0 && preview.steps.length <= 1)) {
    return (
      <div className="text-sm leading-relaxed text-ink-soft">
        {label}
        <MathText>{text}</MathText>
      </div>
    )
  }

  if (!hasSteps && preview && preview.rest.length === 0) {
    return (
      <div className="text-sm leading-relaxed text-ink-soft">
        {label}
        <div className="mt-1 space-y-2">
          {preview.steps.map((s, i) => (
            <p key={i}>
              <MathText>{s}</MathText>
            </p>
          ))}
        </div>
      </div>
    )
  }

  if (hasSteps && steps) {
    const visible = full || steps.length <= 3 ? steps.length : Math.min(3, steps.length)
    return (
      <div className="text-sm leading-relaxed text-ink-soft">
        {label}
        <ol className="mt-1 space-y-2">
          {steps.slice(0, visible).map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-0.5 shrink-0 text-xs font-medium text-gold">{i + 1}.</span>
              <MathText>{s}</MathText>
            </li>
          ))}
        </ol>
        {visible < steps.length && moreButton('睇埋其餘', 'Show the rest') /* i18n-exempt: both languages are arguments */}
      </div>
    )
  }

  const shown = full ? [...(preview?.steps ?? []), ...(preview?.rest ?? [])] : (preview?.steps ?? [])
  return (
    <div className="text-sm leading-relaxed text-ink-soft">
      {label}
      <div className="mt-1 space-y-2">
        {shown.map((s, i) => (
          <p key={i}>
            <MathText>{s}</MathText>
          </p>
        ))}
      </div>
      {!full && (preview?.rest.length ?? 0) > 0 && moreButton('睇埋其餘', 'Show the rest') /* i18n-exempt: both languages are arguments */}
    </div>
  )
}
