'use client'

import Link from 'next/link'
import { ArrowRight, Compass } from 'lucide-react'
import { useLocale, useT } from '@/lib/i18n'

export interface CategorySummary {
  slug: string
  emoji: string
  title: string
  titleEn: string
  count: number
}

// Client view for /off-syllabus. Each card is one piece of non-exam content; the
// card copy lives with that content's own dictionary block.
export default function OffSyllabusView({ categories }: { categories: CategorySummary[] }) {
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'
  const o = t.offSyllabus
  const items = [{ href: '/cantonese', title: t.cantonese.homeTitle, lead: t.cantonese.homeLead, cta: t.cantonese.homeCta }]

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-4xl">
        <div className="mb-2 flex items-center gap-1 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">{t.common.home}</Link>
        </div>

        <div className="flex items-center gap-2">
          <Compass size={22} className="shrink-0 text-accent" aria-hidden />
          <h1 className="text-2xl font-medium text-ink">{t.nav.offSyllabus}</h1>
        </div>
        <p className="mt-1 font-serif text-lg text-ink-soft">{o.tagline}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{o.lead}</p>

        <ul className="mt-8 grid gap-4">
          {items.map((it) => (
            <li key={it.href} className="rounded-2xl border border-line bg-surface-raised p-6">
              <h2 className="text-lg font-medium text-ink">{it.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{it.lead}</p>
              <Link
                href={it.href}
                className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line-strong px-4 py-2 text-sm font-medium text-accent-strong transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {it.cta}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12" aria-labelledby="topic-cards">
          <h2 id="topic-cards" className="text-xl font-medium text-ink">{o.cardsTitle}</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">{o.cardsLead}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/off-syllabus/${c.slug}`}
                  className="flex min-h-16 items-center gap-3 rounded-2xl border border-line bg-surface-raised p-4 transition-colors hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <span className="text-2xl" aria-hidden>{c.emoji}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{en ? c.titleEn : c.title}</span>
                    <span className="block text-xs text-ink-muted">{c.count}{o.cardsUnit}</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-accent" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
