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

function relativeTime(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return '剛剛'
  if (min < 60) return `${min} 分鐘前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} 小時前`
  const day = Math.floor(hr / 24)
  return `${day} 日前`
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ProgressStats | null>(null)

  // Read client-only progress after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration of localStorage data
    setStats(computeStats(loadAttempts()))
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">載入中…</div>
    )
  }

  const accuracyPct = Math.round(stats.overallAccuracy * 100)

  // Empty state — no practice yet.
  if (stats.totalAttempts === 0) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-3xl font-extrabold mb-3">我的進度</h1>
          <p className="text-slate-400 mb-8">
            你仲未開始練習。做完第一份練習後，呢度就會記錄你嘅連續打卡、正確率同各科表現。
          </p>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            開始第一份練習 <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const statCards = [
    { icon: Flame, label: '連續打卡', value: `${stats.currentStreak}`, unit: '日', accent: 'text-orange-400' },
    { icon: BookOpen, label: '已練習題數', value: `${stats.totalQuestions}`, unit: '題', accent: 'text-sky-400' },
    { icon: Target, label: '整體正確率', value: `${accuracyPct}`, unit: '%', accent: 'text-green-400' },
    { icon: TrendingUp, label: '練習次數', value: `${stats.totalAttempts}`, unit: '次', accent: 'text-violet-400' },
  ]

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">我的進度</h1>
            <p className="text-slate-500 text-sm">
              已活躍 {stats.activeDays} 日 · 共答對 {stats.totalCorrect}/{stats.totalQuestions} 題
            </p>
          </div>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all text-sm"
          >
            繼續練習 <ArrowRight size={15} />
          </Link>
        </div>

        {/* Login teaser */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <LogIn size={18} className="text-amber-400 shrink-0" />
            <span className="text-slate-400">
              進度暫存喺呢部裝置。<span className="text-slate-300">Google 登入</span>後嘅跨裝置同步功能開發中（需數據庫）。
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
        <h2 className="text-lg font-bold mb-4 text-slate-300">各科表現</h2>
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
                    {s.subjectName}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{s.questions} 題</span>
                    <span className={`text-xs font-bold text-black px-2 py-0.5 rounded ${gradeBgColors[s.bestGrade] ?? 'bg-slate-500'}`}>
                      最佳 {s.bestGrade}
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
            <h2 className="text-lg font-bold mb-4 text-slate-300">建議加強</h2>
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mb-10">
              <div className="space-y-3">
                {stats.weakTopics.map((t) => (
                  <div key={t.topic} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">💡 {t.topic}</span>
                    <span className="text-amber-300">
                      {t.correct}/{t.total} 正確（{Math.round(t.accuracy * 100)}%）
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent attempts */}
        <h2 className="text-lg font-bold mb-4 text-slate-300">最近練習</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800 mb-10">
          {stats.recent.map((a, i) => {
            const meta = getSubject(a.subjectId)
            return (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meta?.emoji ?? '📘'}</span>
                  <div>
                    <div className="text-sm font-medium">{a.subjectName}</div>
                    <div className="text-xs text-slate-500">{relativeTime(a.timestamp)}</div>
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
              if (confirm('確定要清除所有進度紀錄？此動作無法復原。')) {
                clearProgress()
                setStats(computeStats([]))
              }
            }}
            className="inline-flex items-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            <RotateCcw size={13} /> 清除進度紀錄
          </button>
        </div>
      </div>
    </div>
  )
}
