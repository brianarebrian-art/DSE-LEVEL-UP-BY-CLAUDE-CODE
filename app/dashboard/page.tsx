'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Flame, Target, BookOpen, TrendingUp, ArrowRight, RotateCcw, Sparkles, Coins, Crosshair } from 'lucide-react'
import {
  loadAttempts,
  computeStats,
  clearProgress,
  type ProgressStats,
} from '@/lib/progress'
import { getSubject } from '@/data/subjects'
import { gradeBgColors } from '@/lib/grading'
import { useLocale } from '@/lib/i18n'
import { getTopicStats, weakestTopics, winRate, type TopicStatEntry } from '@/lib/topicStats'
import RadarChart from '@/components/RadarChart'
import SyncStatus from '@/components/SyncStatus'
import { useSync } from '@/components/SyncProvider'
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
  const router = useRouter()
  const { version } = useSync() // re-read local progress after a cloud pull/merge
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [topics, setTopics] = useState<TopicStatEntry[]>([])
  const [confirmReset, setConfirmReset] = useState(false)

  // Read client-only progress after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    setStats(computeStats(loadAttempts()))
    setTopics(getTopicStats())
  }, [version])

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
        <div className="max-w-md mx-auto">
          {/* Even with zero history, let new users bind Google to sync */}
          <SyncStatus />
          <div className="text-center">
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
      </div>
    )
  }

  // Radar axes: the user's most-practised topics, each scored by win rate (0–1).
  const radarAxes = [...topics]
    .sort((a, b) => b.total - a.total)
    .slice(0, 6)
    .map((e) => ({ label: e.label, value: winRate(e) }))
  // ROI: topics the user has a solid grip on (≥70% win rate over a real sample).
  const conquered = topics.filter((e) => e.total >= 4 && winRate(e) >= 0.7).length
  const onRepair = () => {
    // Free for everyone: target the subject of the single weakest topic
    // (fallback: most-practised).
    const weak = weakestTopics({ min: 1, limit: 1 })[0]
    const sid = weak?.subjectId ?? stats.subjects[0]?.subjectId
    if (sid) router.push(`/practice?subject=${sid}&mode=weakness`)
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
          <div className="flex items-center gap-2">
            <Link
              href="/focus"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              🍅 {en ? 'Focus' : '番茄鐘'}
            </Link>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              {d.continueP} <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Cross-device sync status (replaces the old on-device teaser) */}
        <SyncStatus />

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

        {/* 高效 ROI — replaces the EXP/rank vanity meter with honest money-and-time
            framing tied to the 每日一蚊 mission (no fabricated peer percentiles). */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10">
          <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
            <div>
              <div className="text-xs text-slate-500 mb-1">{en ? 'Efficiency ROI' : '高效溫習 ROI'}</div>
              <div className="text-xl font-extrabold">
                {en ? 'Every drill, a real return' : '每一卷，都係實打實嘅回報'}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
              <Coins size={13} /> {en ? '≈ HK$1 / day · vs cram HK$200+/lesson' : '每日 ≈ HK$1 · 補習社一堂 HK$200+'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-800/40 rounded-xl p-4 text-center">
              <Crosshair size={16} className="text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold">{conquered}</div>
              <div className="text-[11px] text-slate-500 mt-1">{en ? 'Blind spots conquered' : '攻克思維盲點'}</div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4 text-center">
              <BookOpen size={16} className="text-sky-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold">{stats.totalQuestions}</div>
              <div className="text-[11px] text-slate-500 mt-1">{en ? 'Questions drilled' : '已操練題數'}</div>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-4 text-center">
              <Flame size={16} className="text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-extrabold">{stats.activeDays}</div>
              <div className="text-[11px] text-slate-500 mt-1">{en ? 'Days invested' : '自主溫習日數'}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              {radarAxes.length >= 3 ? (
                <RadarChart axes={radarAxes} />
              ) : (
                <div className="text-center text-sm text-slate-500 py-12">
                  {en
                    ? 'Practise a few more topics to unlock your ability radar.'
                    : '再操多幾個唔同課題，就會解鎖你嘅能力雷達圖。'}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-lg mb-1">🛠️ {en ? 'Weakness Repair Worksheet' : '弱項修復卷'}</h3>
              <p className="text-sm text-slate-400 mb-4">
                {en
                  ? 'Auto-build a 20-question drill from your lowest win-rate topics.'
                  : '自動由你勝率最低嘅課題，砌一份 20 題專屬特訓卷。'}
              </p>
              <button
                onClick={onRepair}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3 rounded-xl transition-all"
              >
                <Sparkles size={16} /> {en ? 'Generate repair worksheet' : '智能生成：專屬弱項修復卷'}
              </button>
            </div>
          </div>
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
          {confirmReset ? (
            <div className="inline-flex items-center gap-3 text-xs flex-wrap justify-center">
              <span className="text-slate-400">{d.resetConfirm}</span>
              <button
                onClick={() => { clearProgress(); setStats(computeStats([])); setConfirmReset(false) }}
                className="font-medium text-red-400 hover:text-red-300"
              >
                {en ? 'Confirm reset' : '確定清除'}
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                {en ? 'Cancel' : '取消'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              <RotateCcw size={13} /> {d.resetBtn}
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
