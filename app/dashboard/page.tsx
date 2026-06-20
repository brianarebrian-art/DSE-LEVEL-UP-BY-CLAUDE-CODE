'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Flame, Target, BookOpen, TrendingUp, ArrowRight, RotateCcw, LogIn } from 'lucide-react'
import {
  loadAttempts,
  computeStats,
  clearProgress,
  type ProgressStats,
} from '@/lib/progress'
import { getSubject } from '@/data/subjects'
import { gradeBgColors } from '@/lib/grading'
import { useLocale } from '@/lib/i18n'
import type { Dictionary } from '@/lib/dictionary'

function relativeTime(ts: number, d: Dictionary['dashboard']): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return d.timeJustNow
  if (min < 60) return `${min}${d.timeMinAgo}`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}${d.timeHrAgo}`
  const day = Math.floor(hr / 24)
  return `${day}${d.timeDayAgo}`
}

export default function DashboardPage() {
  const { t, locale } = useLocale()
  const d = t.dashboard
  const en = locale === 'en'
  const [stats, setStats] = useState<ProgressStats | null>(null)

  // Read client-only progress after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration of localStorage data
    setStats(computeStats(loadAttempts()))
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">{t.common.loading}</div>
    )
  }

  const accuracyPct = Math.round(stats.overallAccuracy * 100)
  // A subject's name in the active locale (falls back to the stored name).
  const subjName = (subjectId: string, stored: string) => {
    const meta = getSubject(subjectId)
    return meta ? (en ? meta.nameEn : meta.name) : stored
  }

  // Empty state — no practice yet.
  if (stats.totalAttempts === 0) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-3xl font-extrabold mb-3">{d.title}</h1>
          <p className="text-slate-400 mb-8">
            {d.emptyBody}
          </p>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            {d.emptyCta} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const statCards = [
    { icon: Flame, label: d.statStreak, value: `${stats.currentStreak}`, unit: d.statStreakUnit, accent: 'text-orange-400' },
    { icon: BookOpen, label: d.statQuestions, value: `${stats.totalQuestions}`, unit: d.statQuestionsUnit, accent: 'text-sky-400' },
    { icon: Target, label: d.statAccuracy, value: `${accuracyPct}`, unit: '%', accent: 'text-green-400' },
    { icon: TrendingUp, label: d.statAttempts, value: `${stats.totalAttempts}`, unit: d.statAttemptsUnit, accent: 'text-violet-400' },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">{d.title}</h1>
            <p className="text-slate-500 text-sm">
              {d.subtitleA}{stats.activeDays}{d.subtitleB}{stats.totalCorrect}/{stats.totalQuestions}{d.questionsUnit}
            </p>
          </div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            {d.continueP} <ArrowRight size={15} />
          </Link>
        </div>

        {/* Login teaser */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <LogIn size={18} className="text-amber-400 shrink-0" />
            <span className="text-slate-400">
              {d.loginTeaserA}<span className="text-slate-300">{d.loginTeaserGoogle}</span>{d.loginTeaserB}
            </span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {statCards.map((c) => (
            <div key={c.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <c.icon size={18} className={`${c.accent} mb-3`} />
              <div className="text-2xl font-extrabold">
                {c.value}
                <span className="text-sm text-slate-500 font-normal ml-1">{c.unit}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Per-subject performance */}
        <h2 className="text-lg font-bold mb-4 text-slate-300">{d.perSubject}</h2>
        <div className="space-y-3 mb-10">
          {stats.subjects.map((s) => {
            const meta = getSubject(s.subjectId)
            const pct = Math.round(s.accuracy * 100)
            return (
              <Link
                key={s.subjectId}
                href={`/subjects/${s.subjectId}`}
                className="block bg-slate-900 hover:bg-slate-800/70 border border-slate-800 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-medium">
                    <span>{meta?.emoji ?? '📘'}</span>
                    {subjName(s.subjectId, s.subjectName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{s.questions}{d.questionsUnit}</span>
                    <span className={`text-xs font-bold text-black px-2 py-0.5 rounded ${gradeBgColors[s.bestGrade] ?? 'bg-slate-500'}`}>
                      {d.bestPrefix}{s.bestGrade}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-slate-400 w-10 text-right">{pct}%</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Weak topics */}
        {stats.weakTopics.length > 0 && (
          <>
            <h2 className="text-lg font-bold mb-4 text-slate-300">{d.weakTitle}</h2>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mb-10">
              <div className="space-y-3">
                {stats.weakTopics.map((wt) => (
                  <div key={wt.topic} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">💡 {wt.topic}</span>
                    <span className="text-amber-300">
                      {wt.correct}/{wt.total}{d.weakCorrectA}{Math.round(wt.accuracy * 100)}%{d.weakCorrectB}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent attempts */}
        <h2 className="text-lg font-bold mb-4 text-slate-300">{d.recentTitle}</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 mb-10">
          {stats.recent.map((a, i) => {
            const meta = getSubject(a.subjectId)
            return (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meta?.emoji ?? '📘'}</span>
                  <div>
                    <div className="text-sm font-medium">{subjName(a.subjectId, a.subjectName)}</div>
                    <div className="text-xs text-slate-500">{relativeTime(a.timestamp, d)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">{a.score}/{a.total}</span>
                  <span className={`text-xs font-bold text-black px-2 py-0.5 rounded ${gradeBgColors[a.grade] ?? 'bg-slate-500'}`}>
                    {a.grade}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={() => {
              if (confirm(d.resetConfirm)) {
                clearProgress()
                setStats(computeStats([]))
              }
            }}
            className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            <RotateCcw size={13} /> {d.resetBtn}
          </button>
        </div>
      </div>
    </div>
  )
}
