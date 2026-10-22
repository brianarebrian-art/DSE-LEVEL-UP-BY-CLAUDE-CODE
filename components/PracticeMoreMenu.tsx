'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Coffee, MoreHorizontal, Timer } from 'lucide-react'
import { EnoughTodayButton } from '@/components/PracticeSupport'

/** 練習頂欄次要操作：計時／休息／今日夠了，收入「更多」以免搶題號焦點。 */
export default function PracticeMoreMenu({
  en,
  hideTimer,
  perQTimer,
  qLeftLabel,
  qLeftUrgent,
  onCycleTimer,
  onRest,
}: {
  en: boolean
  hideTimer: boolean
  perQTimer: number
  qLeftLabel: string | null
  qLeftUrgent: boolean
  onCycleTimer: () => void
  onRest: () => void
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={en ? 'More practice tools' : '更多練習工具'}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 min-h-12 px-2 -my-2 rounded-lg text-ink-muted hover:text-ink-soft transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <MoreHorizontal size={16} aria-hidden />
        <span className="text-[11px]">{en ? 'More' : '更多'}</span>
        {!hideTimer && perQTimer !== 0 && qLeftLabel && (
          <span
            className={`text-[11px] tabular-nums ${qLeftUrgent ? 'text-gold' : 'text-ink-muted'}`}
            aria-hidden
          >
            {qLeftLabel}
          </span>
        )}
      </button>
      {open && (
        <div
          id={panelId}
          role="menu"
          className="absolute right-0 top-full z-40 mt-1 min-w-[11rem] rounded-xl border border-line bg-surface-raised p-1 shadow-md"
        >
          {!hideTimer && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onCycleTimer()
              }}
              aria-label={
                perQTimer === 0
                  ? en
                    ? 'Turn on the optional per-question timer'
                    : '開啟逐題計時（可選）'
                  : en
                    ? `Per-question timer ${perQTimer}s — tap to change`
                    : `逐題計時 ${perQTimer} 秒，撳一下換設定`
              }
              title={
                en
                  ? 'Per-question timer: off / 60s / 90s. Time-up never ends anything.'
                  : '逐題計時：關 / 60 秒 / 90 秒。時間到唔會強制結束。'
              }
              className={`flex w-full min-h-12 items-center gap-2 rounded-lg px-3 text-left text-sm transition-colors hover:bg-surface-sunken ${
                perQTimer === 0 ? 'text-ink-muted' : 'text-accent'
              }`}
            >
              <Timer size={14} aria-hidden />
              {perQTimer === 0 ? (en ? 'Timer' : '計時') : `${perQTimer}s`}
              {qLeftLabel && perQTimer !== 0 && (
                <span className={`ml-auto text-xs tabular-nums ${qLeftUrgent ? 'text-gold' : 'text-ink-muted'}`}>
                  {qLeftLabel}
                </span>
              )}
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onRest()
            }}
            className="flex w-full min-h-12 items-center gap-2 rounded-lg px-3 text-left text-sm text-ink-muted transition-colors hover:bg-surface-sunken hover:text-accent-strong"
          >
            <Coffee size={14} aria-hidden />
            {en ? 'Rest' : '休息吓'}
          </button>
          <div className="border-t border-line px-1 py-0.5" role="none">
            <EnoughTodayButton />
          </div>
        </div>
      )}
    </div>
  )
}
