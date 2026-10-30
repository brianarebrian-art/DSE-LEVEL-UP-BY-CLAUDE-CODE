'use client'

import Link from 'next/link'
import { ArrowRight, BookOpen, Brain } from 'lucide-react'
import CountdownBanner from '@/components/CountdownBanner'
import InstallHint from '@/components/InstallHint'
import ContinueCard from '@/components/ContinueCard'
import { subjects, getActiveSubjects } from '@/data/subjects'
// 只攞簽名狀態，唔攞內容 —— 首頁唔需要 48 條對照，攞咗就白白 build 入 bundle。
// 由 summary.generated.ts 攞總數，唔好 import barrel ——
// barrel 靜態 import 齊 25 科題庫，喺 'use client' 檔掂親就會將 2.2MB 題目
// build 入首頁（2026-09-05 生產站實測：首頁載入 28 個題庫 chunk，涵蓋 23 科，
// 一條都冇顯示過）。呢一頁只係想要一個總數。
import { CONTENT_STATS, TOTAL_QUESTIONS, WITHDRAWN_FOR_FAULT } from '@/data/questions/summary.generated'
import { SESSION_SIZE, sessionMinutes } from '@/lib/entitlements'
import { quickStartSubjects, quickStartHref } from '@/lib/quickStart'
import { useLocale } from '@/lib/i18n'
import { getCurrentSeason } from '@/utils/season'
import { getSeasonalHero } from '@/data/heroContent'
import Mascot from '@/components/Mascot'

const activeSubjects = getActiveSubjects()
const quickSubjects = quickStartSubjects()
const sessionMins = sessionMinutes()

// Kept for subject-copy / trust audits: live numbers, not a decorative stat wall.
const statNums = [TOTAL_QUESTIONS, SESSION_SIZE, 0]

/** 四個核心科目，一撳開始一節（首頁頂部及底部共用，audit loop T09）。 */
function QuickStartGrid({ labelledBy, en }: { labelledBy: string; en: boolean }) {
  return (
    <ul aria-labelledby={labelledBy} className="grid grid-cols-4 gap-2 sm:gap-3">
      {quickSubjects.map((s) => (
        <li key={s.id}>
          <Link
            href={quickStartHref(s.id)}
            aria-label={en ? `${s.shortEn}: start ${SESSION_SIZE} questions` : `${s.short}：開始 ${SESSION_SIZE} 題`}
            className="flex min-h-[64px] flex-col items-center justify-center gap-1 rounded-xl bg-accent-strong px-1 text-base font-medium text-on-accent transition-[colors,transform] duration-100 hover:bg-accent-hover active:scale-[0.97]"
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

  // Silence unused warning while keeping the audited constant in source.
  void subjects.length
  void statNums

  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <CountdownBanner />
      <InstallHint />

      {/* ── HERO ──
          溫習工作台：首屏只留品牌輕提示 + 一句任務 + 繼續／四科。
          長段覆核喺信任列；演示牆已收。 */}
      <section className="relative px-4 pt-6 pb-10 sm:pt-10 sm:pb-12">
        <div className="relative z-10 mx-auto max-w-3xl text-center md:text-left">
          {/* class 名保留 hero-mascot + justify-center：corner-buttons 測試同手機「有 Continue 就收吉祥物」CSS 依賴。 */}
          <div className="hero-mascot hero-rise mb-4 flex justify-center md:justify-start">
            <div className="w-[72px] sm:w-[96px]">
              <Mascot pose="reading" height={96} priority className="w-full" />
            </div>
          </div>

          <p className="hero-rise hero-rise-1 mb-2 text-sm font-medium text-accent">
            {en ? 'Study desk' : '溫習工作台'}
            <span className="text-ink-muted"> · {hero.badge}</span>
          </p>

          <h1 className="hero-rise hero-rise-1 mb-3 text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl md:text-5xl">
            {en ? 'What do you want to revise tonight?' : '今晚想溫邊科？'}
          </h1>

          <p className="hero-rise hero-rise-2 mx-auto mb-5 max-w-2xl text-base text-ink-muted md:mx-0 sm:text-lg">
            {en
              ? `One set ≈ ${SESSION_SIZE} multiple-choice questions · about ${sessionMins} minutes · no sign-in needed · free, no ads.`
              : `一節約 ${SESSION_SIZE} 條選擇題 · 約 ${sessionMins} 分鐘 · 唔使登入 · 免費無廣告。`}
          </p>

          <div className="hero-rise hero-rise-2 mb-5">
            <ContinueCard />
          </div>

          <div className="hero-rise hero-rise-2 mx-auto mb-4 max-w-md md:mx-0">
            <p id="quick-start-label" className="mb-3 text-base font-medium text-ink">
              {en ? `Or pick a subject to start ${SESSION_SIZE} questions` : `或者揀一科，即刻開始 ${SESSION_SIZE} 題`}
            </p>
            <QuickStartGrid labelledBy="quick-start-label" en={en} />
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 md:justify-start">
              <Link
                href={hero.ctaStartHref}
                className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-accent-strong underline underline-offset-4"
              >
                {en ? `All ${activeSubjects.length} subjects` : `揀其他科目（共 ${activeSubjects.length} 科）`}
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

          <ul className="hero-rise hero-rise-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-ink-muted md:justify-start">
            <li>{h.trust1}</li>
            <li>{h.trust2}</li>
            <li>{h.trust3}</li>
          </ul>
        </div>
      </section>

      {/* ── 信任列 ──
          一行摘要 + 透明度連結；長段披露保留（憲章／trust 測試），唔再搶首屏。 */}
      <section className="border-y border-line bg-surface-sunken px-4 py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-xs text-ink-muted">
          <span>
            {TOTAL_QUESTIONS.toLocaleString()}
            {locale === 'en' ? ' rewritten questions' : ' 條改寫題目'}
          </span>
          <span aria-hidden className="text-ink-faint">·</span>
          <span>
            {activeSubjects.length}
            {locale === 'en' ? ' subjects' : ' 科'}
          </span>
          <span aria-hidden className="text-ink-faint">·</span>
          <span>{locale === 'en' ? 'Not affiliated with the HKEAA' : '與考評局無從屬關係'}</span>
          <span aria-hidden className="text-ink-faint">·</span>
          <Link href="/trust" prefetch={false} className="inline-flex min-h-11 items-center font-medium text-accent-strong underline underline-offset-2">
            {locale === 'en' ? 'Check any of this' : '逐項查得到'}
          </Link>
        </div>
        <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-ink-muted">
          {locale === 'en'
            ? `Questions go live after automated checks and have not been reviewed by registered teachers. ${CONTENT_STATS.published.toLocaleString()} are in practice and ${CONTENT_STATS.withdrawn.toLocaleString()} are withdrawn (${WITHDRAWN_FOR_FAULT.toLocaleString()} because a fault was found; the rest were pure recall and have been replaced). Another ${CONTENT_STATS.machineRestored.toLocaleString()} were recomputed by a program and are kept out of practice until someone who knows the subject checks them. `
            : `題目經自動檢查上線，未經註冊教師審定。練習中 ${CONTENT_STATS.published.toLocaleString()} 條，已收起 ${CONTENT_STATS.withdrawn.toLocaleString()} 條（其中 ${WITHDRAWN_FOR_FAULT.toLocaleString()} 條係發現有錯，其餘係純背誦題，已經換走）。另有 ${CONTENT_STATS.machineRestored.toLocaleString()} 條由程式重算、未經人手覆核，已暫停放入練習。`}
          <Link href="/transparency" prefetch={false} className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-accent-strong">
            {locale === 'en' ? 'Same figures on the transparency page' : '同透明度頁同一個數'}
          </Link>
        </p>
      </section>

      {/* ── 了解點樣練（單一深潛，取代舊演示牆）── */}
      <section className="bg-surface px-4 py-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-lg font-medium text-ink">
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
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-line-strong px-4 text-sm font-medium text-accent-strong transition-colors hover:border-accent hover:bg-surface-sunken"
          >
            <BookOpen size={16} aria-hidden />
            {en ? 'Sources & checks' : '題庫來源同核對'}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-surface-sunken px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-medium text-ink sm:text-4xl">{h.ctaTitle}</h2>
          <p id="quick-start-label-bottom" className="mb-8 text-ink-muted">{h.ctaSub}</p>
          <div className="mx-auto max-w-md">
            <QuickStartGrid labelledBy="quick-start-label-bottom" en={en} />
            <Link
              href="/subjects"
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-accent-strong underline underline-offset-4"
            >
              {en ? `All ${activeSubjects.length} subjects` : `揀其他科目（共 ${activeSubjects.length} 科）`}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-muted">{h.ctaNote}</p>
        </div>
      </section>
    </div>
  )
}
