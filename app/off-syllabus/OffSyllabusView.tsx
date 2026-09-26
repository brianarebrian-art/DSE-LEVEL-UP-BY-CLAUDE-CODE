'use client'

import Link from 'next/link'
import { ArrowRight, Compass } from 'lucide-react'
import { useT } from '@/lib/i18n'

// Client view for /off-syllabus. Each card is one piece of non-exam content; the
// card copy lives with that content's own dictionary block.
export default function OffSyllabusView() {
  const t = useT()
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
      </div>
    </div>
  )
}
