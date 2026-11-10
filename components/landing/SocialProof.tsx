'use client'

import { useEffect, useState } from 'react'
import { Users, FileCheck2, BookMarked } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { TOTAL_QUESTIONS } from '@/data/questions/summary.generated'

export default function SocialProof() {
  const { locale } = useLocale()
  const en = locale === 'en'

  const [completedSessions, setCompletedSessions] = useState(14820)

  return (
    <section className="border-y border-line bg-surface-sunken/60 py-6">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Users size={20} aria-hidden />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-ink">
                12,500+
              </div>
              <div className="text-xs text-ink-muted">
                {en ? 'Active HK DSE Students' : '香港中四至中六學生操練中'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FileCheck2 size={20} aria-hidden />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-ink">
                {completedSessions.toLocaleString()}+
              </div>
              <div className="text-xs text-ink-muted">
                {en ? 'Practice Papers Completed' : '已完成操練試卷份數'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-center sm:justify-start sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <BookMarked size={20} aria-hidden />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-ink">
                {TOTAL_QUESTIONS.toLocaleString()}
              </div>
              <div className="text-xs text-ink-muted">
                {en ? 'Free Questions in Bank' : '題庫真題改寫總題數'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
