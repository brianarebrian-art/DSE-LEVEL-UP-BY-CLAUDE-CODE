'use client'

import Link from 'next/link'
import { ArrowRight, Brain, Zap } from 'lucide-react'
import MathText from '@/components/MathText'
import { subjects, getActiveSubjects } from '@/data/subjects'
import { useLocale } from '@/lib/i18n'

const activeSubjects = getActiveSubjects()
const totalSubjects = subjects.length

const statNums = ['10', '120+', '25']
const testimonialNames = ['Marco L.', 'Rachel C.', 'Jayden K.']

export default function HomePage() {
  const { t, locale } = useLocale()
  const h = t.home

  const stats = [
    { num: statNums[0], unit: locale === 'en' ? '' : '年', label: h.statsItems[0].label },
    { num: statNums[1], unit: '', label: h.statsItems[1].label },
    { num: statNums[2], unit: locale === 'en' ? '' : '個', label: h.statsItems[2].label },
  ]

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">

          {/* Live users badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-8 text-sm text-amber-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
            {h.liveBadge}
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-[1.15] tracking-tight">
            {h.headline1}
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              {h.headline2}
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-3 max-w-2xl mx-auto">
            {h.subhead}
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-slate-600 mb-10">
            <span>{h.trust1}</span>
            <span>·</span>
            <span>{h.trust2}</span>
            <span>·</span>
            <span>{h.trust3}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subjects"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {h.ctaStart} <ArrowRight size={18} />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl text-base transition-all"
            >
              <Brain size={18} className="text-amber-400" /> {h.ctaMethod}
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            {h.demoTitle}
          </h2>
          <p className="text-slate-500 text-center mb-12">
            {h.demoSub}
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{h.step1Label}</span>
              </div>
              <div className="text-xs text-amber-400 mb-3 font-mono">2023 DSE Math Paper 1 Q1</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {h.demoSolve}<MathText>$2x^2 + 3x - 5 = 0$</MathText>{h.demoFind}<MathText>$x$</MathText>{h.demoValueEnd}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-600">
                {h.demoAnswer}<MathText>{'$x = 1$'}</MathText>{h.demoOr}<MathText>{'$x = -\\frac{5}{2}$'}</MathText>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{h.step2Label}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔄</span>
                <span className="text-amber-400 text-sm font-semibold">{h.step2Framework}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {h.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">{h.step3Label}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-semibold">{h.step3Tag}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {h.demoSolve}<MathText>$3x^2 + 5x - 2 = 0$</MathText>{h.demoFind}<MathText>$x$</MathText>{h.demoValueEnd}
              </p>
              <Link
                href="/subjects/math"
                className="block text-center text-sm bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 py-2 rounded-lg transition-all"
              >
                {h.step3Cta}
              </Link>
            </div>
          </div>

          {/* Arrow connecting the steps on desktop */}
          <p className="text-center text-slate-600 text-sm mt-6">
            {h.demoNote}
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 mb-1">
                  {s.num}<span className="text-2xl">{s.unit}</span>
                </div>
                <div className="text-slate-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8 text-slate-300">{h.proofTitle}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {h.testimonials.map((t, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-sm font-medium text-slate-200">{testimonialNames[i]}</div>
                <div className="text-xs text-amber-500">{t.grade}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            {h.subjectsTitle}
          </h2>
          <p className="text-slate-500 text-center mb-12">
            {activeSubjects.length}{h.subjectsSubA}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {activeSubjects.map((s) => (
              <Link
                key={s.id}
                href={`/subjects/${s.id}`}
                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 text-center transition-all"
              >
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-sm mb-1">{locale === 'en' ? s.shortEn : s.short}</div>
                <div className="text-[11px] text-green-400 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> {t.common.live}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              {h.roadmapA}{totalSubjects}{h.roadmapB} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{h.ctaTitle}</h2>
          <p className="text-slate-500 mb-8">{h.ctaSub}</p>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-5 rounded-xl text-lg transition-all hover:scale-[1.02]"
          >
            {h.ctaBtn} <ArrowRight size={22} />
          </Link>
          <p className="text-slate-600 text-sm mt-4">{h.ctaNote}</p>
        </div>
      </section>
    </div>
  )
}
