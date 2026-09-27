'use client'

import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useLocale, useT } from '@/lib/i18n'
import { cardNo, type OffSyllabusCard } from '@/data/offSyllabus'

// A category of topic cards. Each card is a native <details>: closed it shows the
// number, title and one-line hook, so the page scans like a list; open it shows the
// rest. Nothing to answer and nothing recorded (charter §1 point 2.1).
//
// Card text is Cantonese in both languages; only the labels follow the language toggle.

export default function CategoryView({
  emoji,
  title,
  titleEn,
  cards,
}: {
  emoji: string
  title: string
  titleEn: string
  cards: OffSyllabusCard[]
}) {
  const t = useT()
  const o = t.offSyllabus
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex items-center gap-1 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
          <span aria-hidden>/</span>
          <Link href="/off-syllabus" className="hover:text-accent">{t.nav.offSyllabus}</Link>
        </div>

        <h1 className="flex items-center gap-2 text-2xl font-medium text-ink">
          <span aria-hidden>{emoji}</span>
          {en ? titleEn : title}
        </h1>
        <p className="mt-1 font-serif text-base text-ink-soft">{o.tagline}</p>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-ink-muted">{o.aiNote}</p>
        {o.enNote && <p className="mt-1 text-xs text-ink-muted">{o.enNote}</p>}

        <ul className="mt-6 grid gap-3">
          {cards.map((c) => (
            <li key={c.id}>
              <details className="group rounded-2xl border border-line bg-surface-raised">
                <summary className="flex min-h-11 cursor-pointer list-none items-start gap-3 rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                  <span className="mt-0.5 shrink-0 text-xs text-ink-muted" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {cardNo(c.id)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{c.title}</span>
                    <span className="mt-0.5 block text-sm text-ink-muted">{c.hook}</span>
                  </span>
                  <ChevronDown size={18} className="mt-0.5 shrink-0 text-ink-muted transition-transform group-open:rotate-180" aria-hidden />
                </summary>

                <div className="space-y-5 border-t border-line px-4 pb-5 pt-4 text-sm leading-relaxed">
                  <p className="text-xs text-ink-muted">
                    {[...c.tags, t.nav.offSyllabus].map((tag) => `#${tag}`).join(' ')}
                  </p>

                  <section>
                    <h2 className="font-medium text-ink">🗣️ {o.life}</h2>
                    <h3 className="mt-2 text-xs font-medium text-ink-muted">{o.scene}</h3>
                    <p>{c.scene}</p>
                    <h3 className="mt-2 text-xs font-medium text-ink-muted">{o.dialogue}</h3>
                    {c.dialogue.map((line, i) => (
                      <p key={i} className="text-ink">{line}</p>
                    ))}
                    <h3 className="mt-2 text-xs font-medium text-ink-muted">{o.explain}</h3>
                    <ul className="ml-4 list-disc space-y-0.5">
                      {c.explain.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h2 className="font-medium text-ink">🔍 {o.trivia}</h2>
                    <p className="mt-1">{c.trivia}</p>
                  </section>

                  <section className="rounded-xl bg-surface-sunken p-3">
                    <h2 className="font-medium text-ink">💬 {o.chat}</h2>
                    <p className="mt-1">{c.chat}</p>
                  </section>
                </div>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
