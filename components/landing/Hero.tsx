'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { recordFunnelStep } from '@/lib/analytics/funnel'
import { useLocale } from '@/lib/i18n'
import { TOTAL_QUESTIONS } from '@/data/questions/summary.generated'

export default function Hero() {
  const { locale } = useLocale()
  const en = locale === 'en'

  useEffect(() => {
    recordFunnelStep('landing_view')
  }, [])

  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-8 sm:pb-16 sm:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_55%)]"
      />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-sunken px-3.5 py-1 text-xs font-semibold text-accent shadow-sm">
          <Sparkles size={14} aria-hidden />
          <span>
            {en
              ? `100% Free · ${TOTAL_QUESTIONS.toLocaleString()} DSE Rewritten Questions`
              : `全免費 · ${TOTAL_QUESTIONS.toLocaleString()} 題 DSE 真題改寫題庫`}
          </span>
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl">
          {en
            ? `Master DSE with ${TOTAL_QUESTIONS.toLocaleString()} Free Practice Questions`
            : `涵蓋 ${TOTAL_QUESTIONS.toLocaleString()} 題 DSE 免費題庫，即刻開操`}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
          {en
            ? 'Covering Category A subjects updated for 2027 syllabus. Instant step-by-step diagnostic feedback. No login or subscription required.'
            : '涵蓋各高中甲類科目，緊貼 2027 最新大綱。即時步進診斷解析，唔使登入，完全免費。'}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/start"
            onClick={() => recordFunnelStep('click_start')}
            className="pressable flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-strong px-8 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover sm:w-auto"
          >
            <Zap size={18} aria-hidden />
            <span>{en ? 'Start Practicing Now' : '即刻免費開始練習'}</span>
            <ArrowRight size={16} aria-hidden />
          </Link>
          <Link
            href="/subjects"
            className="pressable flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] border border-line-strong bg-surface px-6 text-base font-medium text-ink transition-colors hover:bg-surface-sunken sm:w-auto"
          >
            <span>{en ? 'Explore All Subjects' : '查看全部科目'}</span>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-accent" aria-hidden />
            <span>{en ? 'No Registration Needed' : '免註冊直接刷題'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-accent" aria-hidden />
            <span>{en ? 'Updated for 2027 Syllabus' : '緊貼 2027 考綱'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-accent" aria-hidden />
            <span>{en ? 'Zero Ads Forever' : '永久無廣告'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
