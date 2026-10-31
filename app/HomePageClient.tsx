'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Brain } from 'lucide-react'
import CountdownBanner from '@/components/CountdownBanner'
import InstallHint from '@/components/InstallHint'
import ContinueCard from '@/components/ContinueCard'
import { subjects, getActiveSubjects } from '@/data/subjects'
import { CONTENT_STATS, TOTAL_QUESTIONS, WITHDRAWN_FOR_FAULT } from '@/data/questions/summary.generated'
import { SESSION_SIZE, sessionMinutes } from '@/lib/entitlements'
import { quickStartSubjects, quickStartHref } from '@/lib/quickStart'
import { useLocale } from '@/lib/i18n'
import { getCurrentSeason } from '@/utils/season'
import { getSeasonalHero } from '@/data/heroContent'
import Mascot from '@/components/Mascot'
import BlindTestQuestion from '@/components/BlindTestQuestion'

const activeSubjects = getActiveSubjects()
const quickSubjects = quickStartSubjects()
const sessionMins = sessionMinutes()
const statNums = [TOTAL_QUESTIONS, SESSION_SIZE, 0]

function QuickStartGrid({ labelledBy, en }: { labelledBy: string; en: boolean }) {
  return (
    <ul aria-labelledby={labelledBy} className="grid grid-cols-4 gap-2 sm:gap-3">
      {quickSubjects.map((s) => (
        <li key={s.id}>
          <Link
            href={quickStartHref(s.id)}
            aria-label={en ? `${s.shortEn}: start ${SESSION_SIZE} questions` : `${s.short}：開始 ${SESSION_SIZE} 題`}
            className="pressable flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-[var(--radius-control)] bg-accent-strong px-1 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover"
          >
            {en ? s.shortEn : s.short}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function HomePage() {
  const { t, locale } = useLocale()
  const h = t.home
  const en = locale === 'en'
  const hero = getSeasonalHero(getCurrentSeason(), locale === 'en')

  void subjects.length
  void statNums

  return (
    <div className="min-h-[100svh] bg-surface text-ink-soft">
      <CountdownBanner />
      <InstallHint />

      {/* ── HERO ── Morandi: brand-first, warm wash, one composition.
          hero-rise = CSS-only 入場（唔靠 JS／animate-on-scroll）。 */}
      <section className="relative overflow-hidden px-4 pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_55%),radial-gradient(ellipse_60%_40%_at_90%_20%,color-mix(in_srgb,var(--color-ml-mist)_10%,transparent),transparent_50%)]"
        />
        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
          <div className="hero-rise text-center md:text-left">
            <p className="mb-3 text-sm font-semibold tracking-wide text-accent">
              DSE Level Up
              <span className="font-medium text-ink-muted"> · {hero.badge}</span>
            </p>
            <h1 className="hero-rise-1 mb-4 text-4xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-5xl md:text-[3.25rem]">
              {en ? 'Practise judgment, not memorisation.' : '練判斷，唔係背答案。'}
            </h1>
            <p className="mx-auto mb-6 max-w-xl text-base leading-relaxed text-ink-muted md:mx-0 sm:text-lg">
              {en
                ? `About ${SESSION_SIZE} multiple-choice questions · ~${sessionMins} minutes · free, no ads, no sign-in required.`
                : `約 ${SESSION_SIZE} 條選擇題 · ${sessionMins} 分鐘左右 · 免費無廣告，唔使登入。`}
            </p>
            <div className="mb-5">
              <ContinueCard />
            </div>
            <div className="mx-auto max-w-md md:mx-0">
              <p id="quick-start-label" className="mb-3 text-sm font-medium text-ink">
                {en ? `Or start ${SESSION_SIZE} questions in a core subject` : `或者揀核心科，開始 ${SESSION_SIZE} 題`}
              </p>
              <QuickStartGrid labelledBy="quick-start-label" en={en} />
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 md:justify-start">
                <Link
                  href={hero.ctaStartHref}
                  className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent underline underline-offset-4"
                >
                  {en ? `All ${activeSubjects.length} subjects` : `全部 ${activeSubjects.length} 科`}
                  <ArrowRight size={14} aria-hidden />
                </Link>
                <Link
                  href={hero.ctaSecHref}
                  prefetch={false}
                  className="inline-flex min-h-11 items-center gap-1 text-sm text-ink-soft underline underline-offset-4"
                >
                  <Brain size={14} aria-hidden className="text-accent" /> {hero.ctaSecLabel}
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-mascot relative mx-auto mb-4 flex w-full max-w-sm justify-center md:mb-0 md:max-w-none">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
              <div
                aria-hidden
                className="absolute inset-4 rounded-full bg-accent/10 blur-2xl"
              />
              <Mascot pose="reading" height={280} priority className="relative w-full" />
            </div>
          </div>
        </div>

        <ul className="relative z-10 mx-auto mt-8 flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-ink-muted md:justify-start">
          <li>{h.trust1}</li>
          <li>{h.trust2}</li>
          <li>{h.trust3}</li>
        </ul>
      </section>
      {/* ── 信任列 ── （切片終點；信任 chips 仍屬 hero 內） */}

      <section className="border-y border-line bg-surface-sunken px-4 py-5">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-xs text-ink-muted">
          <span>
            {TOTAL_QUESTIONS.toLocaleString()}
            {locale === 'en' ? ' rewritten questions' : ' 條改寫題目'}
          </span>
          <span aria-hidden className="text-ink-faint">
            ·
          </span>
          <span>
            {activeSubjects.length}
            {locale === 'en' ? ' subjects' : ' 科'}
          </span>
          <span aria-hidden className="text-ink-faint">
            ·
          </span>
          <span>{locale === 'en' ? 'Not affiliated with the HKEAA' : '與考評局無從屬關係'}</span>
          <span aria-hidden className="text-ink-faint">
            ·
          </span>
          <Link
            href="/trust"
            prefetch={false}
            className="inline-flex min-h-11 items-center font-medium text-accent underline underline-offset-2"
          >
            {locale === 'en' ? 'Check any of this' : '逐項查得到'}
          </Link>
        </div>
        <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-ink-muted">
          {locale === 'en'
            ? `Questions go live after automated checks and have not been reviewed by registered teachers. ${CONTENT_STATS.published.toLocaleString()} are in practice and ${CONTENT_STATS.withdrawn.toLocaleString()} are withdrawn (${WITHDRAWN_FOR_FAULT.toLocaleString()} because a fault was found; the rest were pure recall and have been replaced). Another ${CONTENT_STATS.machineRestored.toLocaleString()} were recomputed by a program and are kept out of practice until someone who knows the subject checks them. `
            : `題目經自動檢查上線，未經註冊教師審定。練習中 ${CONTENT_STATS.published.toLocaleString()} 條，已收起 ${CONTENT_STATS.withdrawn.toLocaleString()} 條（其中 ${WITHDRAWN_FOR_FAULT.toLocaleString()} 條係發現有錯，其餘係純背誦題，已經換走）。另有 ${CONTENT_STATS.machineRestored.toLocaleString()} 條由程式重算、未經人手覆核，已暫停放入練習。`}
          <Link
            href="/transparency"
            prefetch={false}
            className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-accent"
          >
            {locale === 'en' ? 'Same figures on the transparency page' : '同透明度頁同一個數'}
          </Link>
        </p>
      </section>

      <section className="bg-surface px-4 py-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {en ? 'How practice works here' : '呢度點樣練'}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {en
                ? 'Short multiple-choice sets that train judgment — not a full paper simulator.'
                : '短選擇題節流，練判斷同常見陷阱 —— 唔係成卷模擬考。'}
            </p>
          </div>
          <Link
            href="/methodology"
            prefetch={false}
            className="pressable inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[var(--radius-control)] border border-line-strong px-4 text-sm font-semibold text-accent transition-colors hover:border-accent hover:bg-surface-sunken"
          >
            <BookOpen size={16} aria-hidden />
            {en ? 'Sources & checks' : '題庫來源同核對'}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
        {/* 示範盲測卡放喺首屏以下，唔搶 hero；接線符合憲章第 4 條。 */}
        <div className="mx-auto mt-10 max-w-xl">
          <BlindTestQuestion />
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-surface-sunken px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-semibold text-ink sm:text-4xl">{h.ctaTitle}</h2>
          <p id="quick-start-label-bottom" className="mb-8 text-ink-muted">
            {h.ctaSub}
          </p>
          <div className="mx-auto max-w-md">
            <QuickStartGrid labelledBy="quick-start-label-bottom" en={en} />
            <Link
              href="/subjects"
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-accent underline underline-offset-4"
            >
              {en ? `All ${activeSubjects.length} subjects` : `全部 ${activeSubjects.length} 科`}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-muted">{h.ctaNote}</p>
        </div>
      </section>
    </div>
  )
}
