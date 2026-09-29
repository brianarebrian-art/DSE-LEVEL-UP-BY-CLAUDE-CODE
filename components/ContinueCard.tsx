'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { loadActiveSession, pickContinueTarget, type ContinueTarget } from '@/lib/sessionResume'
import { loadAttempts } from '@/lib/progress'
import { isNotTonight } from '@/lib/notTonight'
import { getSubject } from '@/data/subjects'

// Homepage shortcut for a returning student (2026-09-29).
//
// Before this card, a student who came back to the homepage had to tap
// 開始練習 → pick a subject → 立即開始 before the practice page offered to resume.
// Most students revise on a phone in short gaps; three taps and a long subject
// list is where a gap is lost. The card sends them straight back.
//
// What it deliberately does not do:
//   ✗ no streaks, day counts or "you haven't practised for N days" (charter §8.1)
//   ✗ no scores on the homepage — a returning student may not want the last
//     result in front of them before they have chosen to look
//   ✗ nothing while 今晚唔溫得 is on: the student has said not tonight
// Storage: reads existing localStorage only (dse_active_session, dse_progress).
// Nothing new is written, so nothing new is synced.
export default function ContinueCard() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [target, setTarget] = useState<ContinueTarget | null>(null)

  // Read only after mount: the server has no localStorage, and rendering the card
  // during SSR would mismatch on hydration.
  useEffect(() => {
    if (isNotTonight()) return
    const last = loadAttempts().reduce<{ subjectId: string; timestamp: number } | null>(
      (a, b) => (!a || b.timestamp > a.timestamp ? b : a),
      null,
    )
    setTarget(pickContinueTarget(loadActiveSession(), last?.subjectId ?? null, (id) => !!getSubject(id)?.isActive))
  }, [])

  if (!target) return null
  const subject = getSubject(target.subjectId)
  if (!subject) return null
  const name = en ? subject.shortEn : subject.short

  return (
    <div className="hero-rise mx-auto mb-6 flex max-w-md items-center gap-3 rounded-2xl border border-accent/25 bg-surface-raised p-3 pl-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-muted">
          {target.kind === 'resume'
            ? en
              ? 'You stopped halfway'
              : '上次未做完'
            : en
              ? 'Last time you practised'
              : '上次練緊'}
        </p>
        <p className="truncate text-sm font-medium text-ink">
          <span aria-hidden>{subject.emoji} </span>
          {name}
          {target.kind === 'resume' && (
            <span className="font-normal text-ink-muted">
              {en ? ` · ${target.done}/${target.total} done` : ` · 做咗 ${target.done}/${target.total} 題`}
            </span>
          )}
        </p>
      </div>
      <Link
        href={target.href}
        className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-xl bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
      >
        {target.kind === 'resume'
          ? en
            ? `Continue Q${target.done + 1}`
            : `繼續第 ${target.done + 1} 題`
          : en
            ? 'Another set'
            : '再做一份'}
        <ArrowRight size={16} aria-hidden />
      </Link>
    </div>
  )
}
