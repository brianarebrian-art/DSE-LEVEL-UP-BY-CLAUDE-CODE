'use client'

import Link from 'next/link'
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react'
import {
  subjects,
  priorityOrder,
  type SubjectMeta,
} from '@/data/subjects'
import { useLocale } from '@/lib/i18n'
import { usePlan } from '@/lib/usePlan'
import { isFreeSubject } from '@/lib/entitlements'

// Tailwind needs literal class names, so map accents explicitly.
const accentRing: Record<string, string> = {
  amber: 'hover:border-amber-500/50 hover:bg-amber-500/5',
  cyan: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
  sky: 'hover:border-sky-500/50 hover:bg-sky-500/5',
  violet: 'hover:border-violet-500/50 hover:bg-violet-500/5',
  emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
  green: 'hover:border-green-500/50 hover:bg-green-500/5',
  rose: 'hover:border-rose-500/50 hover:bg-rose-500/5',
  red: 'hover:border-red-500/50 hover:bg-red-500/5',
  blue: 'hover:border-blue-500/50 hover:bg-blue-500/5',
  orange: 'hover:border-orange-500/50 hover:bg-orange-500/5',
  teal: 'hover:border-teal-500/50 hover:bg-teal-500/5',
  pink: 'hover:border-pink-500/50 hover:bg-pink-500/5',
  fuchsia: 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5',
  indigo: 'hover:border-indigo-500/50 hover:bg-indigo-500/5',
  slate: 'hover:border-slate-500/50 hover:bg-slate-500/5',
  lime: 'hover:border-lime-500/50 hover:bg-lime-500/5',
}

export default function SubjectsView() {
  const { t, locale } = useLocale()
  const { isPremium, authEnabled } = usePlan()
  const tl = t.subjectsList
  const activeCount = subjects.filter((s) => s.isActive).length
  const name = (s: SubjectMeta) => (locale === 'en' ? s.nameEn : s.name)
  const desc = (s: SubjectMeta) => (locale === 'en' ? s.descriptionEn : s.description)

  const ActiveCard = ({ s }: { s: SubjectMeta }) => {
    const premiumLocked = authEnabled && !isPremium && !isFreeSubject(s.id)
    const freeBadge = authEnabled && !isPremium && isFreeSubject(s.id)
    return (
      <Link
        href={`/subjects/${s.id}`}
        className={`group relative bg-slate-900 border border-slate-800 rounded-xl p-5 transition-all ${accentRing[s.accent] ?? ''}`}
      >
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={10} /> {t.common.live}
          </span>
        </div>
        <div className="text-3xl mb-3">{s.emoji}</div>
        <div className="font-bold mb-1">{name(s)}</div>
        <div className="text-xs text-slate-500 mb-3 leading-relaxed">{desc(s)}</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-amber-400 font-medium">
            {tl.startPractice} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
          {premiumLocked && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              <Lock size={10} /> {t.premium.paidTag}
            </span>
          )}
          {freeBadge && (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
              {t.premium.freeTag}
            </span>
          )}
        </div>
      </Link>
    )
  }

  const ComingSoonCard = ({ s }: { s: SubjectMeta }) => (
    <div className="relative bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 opacity-70">
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
          <Lock size={10} /> {s.launchDate ?? t.common.comingSoon}
        </span>
      </div>
      <div className="text-3xl mb-3 grayscale opacity-80">{s.emoji}</div>
      <div className="font-bold mb-1 text-slate-300">{name(s)}</div>
      <div className="text-xs text-slate-600 leading-relaxed">{desc(s)}</div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-slate-500 text-sm mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-slate-300">{t.common.home}</Link>
            <span>/</span>
            <span>{tl.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{tl.title}</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            {tl.introA}
            <span className="text-amber-400">{activeCount}{tl.introLiveA}</span>{tl.introB}
          </p>
        </div>

        {/* Roadmap progress bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-12">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">{tl.progressLabel}</span>
            <span className="text-amber-400 font-medium">
              {activeCount} / {subjects.length}{tl.progressUnit}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
              style={{ width: `${(activeCount / subjects.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-3">
            {tl.strategy}
          </p>
        </div>

        {/* Grouped by priority */}
        <div className="space-y-12">
          {priorityOrder.map((p) => {
            const group = subjects.filter((s) => s.priority === p)
            if (group.length === 0) return null
            const info = tl.priorities[p]
            return (
              <section key={p}>
                <div className="mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
                      {p}
                    </span>
                    {info.label}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{info.desc}</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.map((s) =>
                    s.isActive ? (
                      <ActiveCard key={s.id} s={s} />
                    ) : (
                      <ComingSoonCard key={s.id} s={s} />
                    )
                  )}
                </div>
              </section>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-400 mb-2">{tl.footerTitle}</p>
          <p className="text-sm text-slate-600 mb-4">
            {tl.footerBody}
          </p>
          <a
            href="mailto:dselevelup@gmail.com"
            className="inline-flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl transition-all"
          >
            {tl.footerBtn}
          </a>
        </div>
      </div>
    </div>
  )
}
