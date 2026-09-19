'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'
import MasteryEstimate from '@/components/MasteryEstimate'
import { useLocale } from '@/lib/i18n'
import { loadAttempts, computeStats, type ProgressStats } from '@/lib/progress'
import { getReverseLog } from '@/lib/reverseLog'
import { weeklyAccuracy, causeShares, type WeekBucket, type CauseShares } from '@/lib/scoreStory'
import { DIMENSIONS } from '@/lib/discovery/dimensions'
import { dimensionShort } from '@/lib/discovery/copy'
import { getSubject } from '@/data/subjects'

// 等級預測（/predictor）—— Night Study 設計「Grade Predictor」。
//
// ══ 同設計稿唔同嘅地方，逐項有原因 ══
// ① 設計畫一個「Level 4」。呢度每科一個【範圍】，由 MasteryEstimate 出。
//    設計自己寫住「A range, not a promise」，但畫出嚟係單點 —— 自相矛盾。
//    範圍由 lib/mastery.ts v4 計（對考評局表 5a 實數），唔係 data/cutoffs.ts
//    嗰張百分比表：後者檔頭明寫「唔係一個預測」。
// ② 設計有「Pace 64%」「Confidence 71%」。本站冇量過呢兩樣嘢 —— 照畫就係
//    憲章 §8 虛構統計。剔走。
// ③ 設計嘅「Score Story」係三條線（本週／上週／目標），但冇講「目標」由邊度嚟。
//    呢度得一條：逐週正確率，同憲章 §7.2 覆檢用嘅係同一條 curve。
// ④ 錯題 DNA 呢度只出一個摘要，完整版喺 /dashboard#error-dna。
//    Brian 2026-09-05 將溫書地圖合併返進度頁，唔再另開一份。
//
// 所有數字喺 useEffect 入面讀 localStorage —— 伺服器端冇呢啲數據，
// 喺 render 期間讀會令 SSR 同水合出嚟嘅嘢唔一樣。

const fmt = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')

const DAY = 86_400_000

interface Data {
  stats: ProgressStats
  weeks: WeekBucket[]
  causes: CauseShares
}

// 錯因色跟設計稿：概念 = 乾玫瑰、審題 = 霧藍、粗心 = 陶土。全部係主題 token。
const CAUSE_BAR: Record<'A' | 'B' | 'C', string> = {
  A: 'bg-rose',
  B: 'bg-violet',
  C: 'bg-gold',
}

export default function PredictorClient() {
  const { t, locale } = useLocale()
  const p = t.predictor
  const en = locale === 'en'
  const [data, setData] = useState<Data | null>(null)

  useEffect(() => {
    const attempts = loadAttempts()
    const now = Date.now()
    setData({
      stats: computeStats(attempts),
      weeks: weeklyAccuracy(attempts, now),
      causes: causeShares(getReverseLog(), now - 30 * DAY),
    })
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl italic text-ink sm:text-4xl">{p.title}</h1>
        <p className="mt-2 text-ink-muted">{p.lead}</p>
      </header>

      {data === null ? null : data.stats.totalQuestions === 0 ? (
        <EmptyState p={p} />
      ) : (
        <Body data={data} p={p} en={en} />
      )}

      <p className="mt-10 border-t border-line pt-4 text-xs leading-relaxed text-ink-muted">
        {p.disclaimer}{' '}
        <Link href="/prediction-method" className="text-accent underline underline-offset-2">
          {p.method}
        </Link>
      </p>
    </div>
  )
}

type P = ReturnType<typeof useLocale>['t']['predictor']

function EmptyState({ p }: { p: P }) {
  return (
    <section className="rounded-2xl border border-line bg-surface-raised p-6 sm:p-8">
      <h2 className="font-serif text-xl text-ink">{p.emptyTitle}</h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">{p.emptyBody}</p>
      <Link
        href="/subjects"
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {p.emptyCta}
        <ArrowRight size={16} aria-hidden />
      </Link>
    </section>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 font-serif text-xl text-ink">
      <Leaf size={16} strokeWidth={1.2} aria-hidden className="shrink-0 text-gold" />
      {children}
    </h2>
  )
}

function Body({ data, p, en }: { data: Data; p: P; en: boolean }) {
  const { stats, weeks, causes } = data
  const pct = Math.round(stats.overallAccuracy * 100)
  // 題數多嘅科排先 —— 佢哋嘅估算最可信，應該最先見到。
  const subjects = [...stats.subjects].sort((a, b) => b.questions - a.questions)

  return (
    <>
      {/* 總覽。設計稿呢格有四個數，得「正確率」係真嘅 —— 其餘兩個已剔走（見檔頭 ②）。 */}
      <section className="rounded-2xl border border-line bg-surface-raised p-5 sm:p-6">
        <p className="text-sm text-gold-strong">{p.overall}</p>
        <p className="mt-1 font-serif text-5xl text-ink tabular-nums">
          {pct}
          <span className="text-2xl">%</span>
        </p>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-line-strong"
          role="presentation"
        >
          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
          <span className="tabular-nums">
            {fmt(p.overallMeta, { q: String(stats.totalQuestions), s: String(stats.totalAttempts) })}
          </span>
          <span className="tabular-nums">{fmt(p.activeDays, { n: String(stats.recentActiveDays) })}</span>
        </div>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface-raised p-5 sm:p-6">
          <SectionTitle>{p.storyTitle}</SectionTitle>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">{p.storyLead}</p>
          <WeeklyChart weeks={weeks} p={p} />
        </section>

        <section className="rounded-2xl border border-line bg-surface-raised p-5 sm:p-6">
          <SectionTitle>{p.causesTitle}</SectionTitle>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">{p.causesLead}</p>
          {causes.total === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">{p.causesEmpty}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {DIMENSIONS.map((d) => {
                const n = causes.counts[d.id]
                const share = Math.round((n / causes.total) * 100)
                return (
                  <li key={d.id} className="flex items-center gap-3 text-sm">
                    <span className="w-24 shrink-0 text-ink-soft sm:w-28">{dimensionShort(d.id, en)}</span>
                    <span className="h-3 flex-1 overflow-hidden rounded-full bg-line-strong" role="presentation">
                      <span className={`block h-full rounded-full ${CAUSE_BAR[d.id]}`} style={{ width: `${share}%` }} />
                    </span>
                    <span className="w-10 shrink-0 text-right tabular-nums text-ink">{share}%</span>
                  </li>
                )
              })}
            </ul>
          )}
          <Link
            href="/dashboard#error-dna"
            className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {p.causesMore}
            <ArrowRight size={14} aria-hidden />
          </Link>
        </section>
      </div>

      <section className="mt-8">
        <SectionTitle>{p.subjectsTitle}</SectionTitle>
        <p className="mt-1 max-w-prose text-sm text-ink-muted">{p.subjectsLead}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {subjects.map((s) => {
            const meta = getSubject(s.subjectId)
            const name = meta ? (en ? meta.nameEn : meta.name) : s.subjectName
            return (
              <MasteryEstimate key={s.subjectId} subjectId={s.subjectId} heading={name} headingLevel="h3" />
            )
          })}
        </div>
      </section>

      {/* 下一步。設計稿寫「Review 3 questions from Error DNA」—— 有錯題紀錄先講重溫，
          冇就叫佢再做一節；兩句都係做得到嘅事，唔會指去一個空嘅重溫列表。 */}
      <section className="mt-8 flex flex-col gap-4 rounded-2xl border border-line bg-surface-raised p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex-1">
          <h2 className="font-serif text-xl text-gold-strong">{p.nextTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {causes.total > 0 ? p.nextReview : p.nextStart}
          </p>
        </div>
        <Link
          href={causes.total > 0 ? '/dashboard#review' : '/subjects'}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {causes.total > 0 ? p.nextReviewCta : p.nextStartCta}
          <ArrowRight size={16} aria-hidden />
        </Link>
      </section>
    </>
  )
}

// ── 逐週正確率 ────────────────────────────────────────────────────────────
// 純 SVG（憲章 §3：禁圖表庫）。冇練習嗰週唔畫點、條線喺嗰度斷開 ——
// 用 0 填補會將「冇做」畫成「全錯」。
const W = 320
const H = 168
const PAD = { l: 34, r: 14, t: 16, b: 26 }

function WeeklyChart({ weeks, p }: { weeks: WeekBucket[]; p: P }) {
  const filled = weeks.filter((w) => w.accuracy !== null)
  if (filled.length < 2) return <p className="mt-4 text-sm text-ink-muted">{p.storyEmpty}</p>

  const n = weeks.length
  const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / (n - 1)
  const y = (v: number) => PAD.t + (1 - v) * (H - PAD.t - PAD.b)
  const label = (w: WeekBucket) => (w.weeksAgo === 0 ? p.thisWeek : fmt(p.weeksAgo, { n: String(w.weeksAgo) }))

  // 連續有值嘅點先連成一段
  const segments: string[] = []
  let cur: string[] = []
  weeks.forEach((w, i) => {
    if (w.accuracy === null) {
      if (cur.length > 1) segments.push(cur.join(' '))
      cur = []
    } else cur.push(`${x(i)},${y(w.accuracy)}`)
  })
  if (cur.length > 1) segments.push(cur.join(' '))

  const lastIdx = weeks.map((w) => w.accuracy !== null).lastIndexOf(true)
  const summary = weeks
    .filter((w) => w.accuracy !== null)
    .map((w) => `${label(w)} ${Math.round(w.accuracy! * 100)}%`)
    .join(', ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 block h-auto w-full" role="img" aria-label={`${p.storyTitle}: ${summary}`}>
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} className="stroke-line-strong" strokeDasharray="3 4" />
          <text x={PAD.l - 6} y={y(v) + 3} textAnchor="end" className="fill-ink-muted text-[10px] tabular-nums">
            {Math.round(v * 100)}%
          </text>
        </g>
      ))}
      {segments.map((pts) => (
        <polyline key={pts} points={pts} fill="none" className="stroke-accent" strokeWidth={2} strokeLinejoin="round" />
      ))}
      {weeks.map((w, i) =>
        w.accuracy === null ? null : (
          <circle key={i} cx={x(i)} cy={y(w.accuracy)} r={i === lastIdx ? 4.5 : 3} className="fill-accent" />
        ),
      )}
      {lastIdx >= 0 && (
        <text
          x={x(lastIdx)}
          y={y(weeks[lastIdx].accuracy!) - 9}
          textAnchor={lastIdx === n - 1 ? 'end' : 'middle'}
          className="fill-ink text-[11px] font-medium tabular-nums"
        >
          {Math.round(weeks[lastIdx].accuracy! * 100)}%
        </text>
      )}
      {/* 只標頭同尾 —— 八個標籤喺手機闊度會撞埋一齊 */}
      {[0, n - 1].map((i) => (
        <text
          key={i}
          x={x(i)}
          y={H - 6}
          textAnchor={i === 0 ? 'start' : 'end'}
          className="fill-ink-muted text-[10px]"
        >
          {label(weeks[i])}
        </text>
      ))}
    </svg>
  )
}
