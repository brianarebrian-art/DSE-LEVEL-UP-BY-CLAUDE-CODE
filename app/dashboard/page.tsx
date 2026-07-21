'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarCheck, Target, BookOpen, TrendingUp, ArrowRight, RotateCcw, Sparkles, Coins, Crosshair } from 'lucide-react'
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
import ErrorDNA from '@/components/ErrorDNA'
import DailyPlan from '@/components/DailyPlan'
import JustOneCard from '@/components/JustOneCard'
import { useSync } from '@/components/SyncProvider'
import type { Dictionary } from '@/lib/dictionary'
// F-NTM: 今晚唔溫得（本地 until-04:00 開關）
import { isNotTonight, setNotTonight } from '@/lib/notTonight'
// F-PRG / F-DNA / F-REV: 學習光譜 + 錯因雷達 + 重溫排程（全部純本地數據）
import DailySpectrum from '@/components/DailySpectrum'
import ErrorRadar from '@/components/ErrorRadar'
import ReviewScheduler from '@/components/ReviewScheduler'
// 計劃A §5.6：精進軌跡（純 SVG，真實 localStorage 數據）— light-first
import ProgressTrajectory from '@/components/ProgressTrajectory'

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
  // F-NTM: 今晚唔溫得 — 開啟時 Dashboard 收起所有推送／計數，只顯示休息畫面
  const [ntm, setNtm] = useState(false)

  // Read client-only progress after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    setStats(computeStats(loadAttempts()))
    setTopics(getTopicStats())
  }, [version])

  // F-NTM: 讀取 + 監聽開關（setNotTonight 會派 dse-ntm 事件）
  useEffect(() => {
    const read = () => setNtm(isNotTonight())
    read()
    window.addEventListener('dse-ntm', read)
    return () => window.removeEventListener('dse-ntm', read)
  }, [])

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8] text-[#6B6B6B]">{t.common.loading}</div>
    )
  }

  // F-NTM: 休息畫面 — 無題目、無計數、無「落後」暗示；/relax 照常開放；04:00 自動失效
  if (ntm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center bg-[#FAFAF8] text-[#2D2D2D]">
        <div className="text-6xl" aria-hidden>🌙</div>
        <h1 className="text-2xl font-medium text-[#1A1A1A]">{en ? 'Not-tonight mode is on' : '今晚唔溫得模式已開啟'}</h1>
        <p className="text-[#6B6B6B] leading-relaxed">
          {en ? 'Rest well tonight. See you tomorrow.' : '今晚好好休息。聽日再見。'}
          <br />
          {en ? 'Your progress has been saved automatically.' : '你嘅進度已自動儲存。'}
        </p>
        <Link
          href="/relax"
          className="min-h-11 inline-flex items-center bg-[#008B84]/10 text-[#008B84] border border-[#008B84]/30 hover:bg-[#008B84]/20 rounded-xl px-6 py-3 font-medium transition-all"
        >
          🌬️ {en ? 'Go to the Breathing Space →' : '去呼吸空間唞一唞 →'}
        </Link>
        <button
          onClick={() => setNotTonight(false)}
          className="min-h-11 text-sm text-[#6B6B6B] hover:text-[#008B84] underline underline-offset-4 transition-colors"
        >
          {en ? 'Turn off early' : '提早關閉呢個模式'}
        </button>
        <p className="text-xs text-[#9CA3AF]">{en ? 'Switches off automatically at 04:00.' : '會喺 04:00 自動關閉。'}</p>
      </div>
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
      <div className="min-h-screen px-4 py-20 bg-[#FAFAF8] text-[#2D2D2D]">
        <div className="max-w-md mx-auto">
          {/* Even with zero history, let new users bind Google to sync */}
          <SyncStatus />
          <div className="text-center">
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-3xl font-medium mb-3 text-[#1A1A1A]">{d.title}</h1>
            <p className="text-[#6B6B6B] mb-8">
              {d.emptyBody}
            </p>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-[#00726C] hover:bg-[#005F5A] text-white font-medium px-6 py-3 rounded-xl transition-all"
            >
              {d.emptyCta} <ArrowRight size={16} />
            </Link>
          </div>
          {/* C6：對住「開始第一份練習」都撳唔落手嗰個，先係最需要呢個入口嗰個 */}
          <JustOneCard stack className="mt-8 text-left" />
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

  // 統計徽章：連續溫習係個人習慣指標，唔係競賽 gamification —— 憲章 §2 禁「火焰」符號，
  // 故保留數值但用中性 CalendarCheck + 主色青，唔用 🔥/橙。
  const statCards = [
    { icon: CalendarCheck, label: d.statStreak, value: `${stats.currentStreak}`, unit: d.statStreakUnit, accent: 'text-[#008B84]' },
    { icon: BookOpen, label: d.statQuestions, value: `${stats.totalQuestions}`, unit: d.statQuestionsUnit, accent: 'text-[#008B84]' },
    { icon: Target, label: d.statAccuracy, value: `${accuracyPct}`, unit: '%', accent: 'text-[#008B84]' },
    { icon: TrendingUp, label: d.statAttempts, value: `${stats.totalAttempts}`, unit: d.statAttemptsUnit, accent: 'text-[#B8860B]' },
  ]

  return (
    <div className="min-h-screen px-4 py-12 bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl sm:text-4xl font-medium mb-1 text-[#1A1A1A]">{d.title}</h1>
            <p className="text-[#6B6B6B] text-sm">
              {d.subtitleA}{stats.activeDays}{d.subtitleB}{stats.totalCorrect}/{stats.totalQuestions}{d.questionsUnit}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/report"
              className="inline-flex items-center gap-2 bg-white border border-[#008B84]/30 text-[#008B84] hover:bg-[#008B84]/[0.06] px-4 py-2.5 rounded-xl transition-all text-sm font-medium"
            >
              📋 {en ? 'Generate report' : '生成報告'}
            </Link>
            <Link
              href="/focus"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F5F5F0] border border-black/[0.12] text-[#2D2D2D] px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              🍅 {en ? 'Focus' : '番茄鐘'}
            </Link>
            {/* F-NTM: 今晚唔溫得開關（柔和款式，唔搶眼） */}
            <button
              onClick={() => setNotTonight(true)}
              title={en ? 'Hide all nudges and counters until 04:00' : '收起所有題目推送同計數，到 04:00 自動恢復'}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#F5F5F0] border border-black/[0.12] text-[#008B84] px-4 py-2.5 rounded-xl transition-all text-sm min-h-11"
            >
              🌙 {en ? 'Not tonight' : '今晚唔溫得'}
            </button>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-[#00726C] hover:bg-[#005F5A] text-white font-medium px-5 py-2.5 rounded-xl transition-all text-sm"
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
            <div key={c.label} className="bg-white border border-black/[0.06] rounded-2xl p-5">
              <c.icon size={18} className={`${c.accent} mb-3`} />
              <div className="text-2xl font-medium text-[#1A1A1A]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {c.value}
                <span className="text-sm text-[#9CA3AF] font-normal ml-1">{c.unit}</span>
              </div>
              <div className="text-xs text-[#6B6B6B] mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* 計劃A §5.6：精進軌跡（每日正確率曲線，真實數據） */}
        <ProgressTrajectory />

        {/* F-PRG: 今日學習光譜（3:5:2 建議節奏，真實作答數據） */}
        <DailySpectrum />

        {/* C6：擺喺「今日計劃」之前 —— 見到成個計劃就無力嗰日，起碼仲有呢條路 */}
        <JustOneCard className="mb-6" />

        {/* Today's plan — AI-free: targets the weakest topics with direct drill links */}
        <DailyPlan />

        {/* F-REV: 錯題重溫智能排程（艾賓浩斯 1/3/7/14/30 日，本地數據） */}
        <div className="mb-10">
          <ReviewScheduler />
        </div>

        {/* 高效 ROI — replaces the EXP/rank vanity meter with honest money-and-time
            framing tied to the free-for-everyone mission (no fabricated peer percentiles). */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-10">
          <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
            <div>
              <div className="text-xs text-[#6B6B6B] mb-1">{en ? 'Efficiency ROI' : '高效溫習 ROI'}</div>
              <div className="text-xl font-medium text-[#1A1A1A]">
                {en ? 'Every drill, a real return' : '每一卷，都係實打實嘅回報'}
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#008B84] bg-[#008B84]/[0.08] border border-[#008B84]/20 px-3 py-1.5 rounded-full">
              <Coins size={13} /> {en ? '100% free · no tutoring fees' : '完全免費 · 慳返補習費'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#F5F5F0] rounded-xl p-4 text-center">
              <Crosshair size={16} className="text-[#B8860B] mx-auto mb-2" />
              <div className="text-2xl font-medium text-[#1A1A1A]" style={{ fontVariantNumeric: 'tabular-nums' }}>{conquered}</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">{en ? 'Blind spots conquered' : '攻克思維盲點'}</div>
            </div>
            <div className="bg-[#F5F5F0] rounded-xl p-4 text-center">
              <BookOpen size={16} className="text-[#008B84] mx-auto mb-2" />
              <div className="text-2xl font-medium text-[#1A1A1A]" style={{ fontVariantNumeric: 'tabular-nums' }}>{stats.totalQuestions}</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">{en ? 'Questions drilled' : '已操練題數'}</div>
            </div>
            <div className="bg-[#F5F5F0] rounded-xl p-4 text-center">
              <CalendarCheck size={16} className="text-[#008B84] mx-auto mb-2" />
              <div className="text-2xl font-medium text-[#1A1A1A]" style={{ fontVariantNumeric: 'tabular-nums' }}>{stats.activeDays}</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">{en ? 'Days invested' : '自主溫習日數'}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              {radarAxes.length >= 3 ? (
                <RadarChart axes={radarAxes} />
              ) : (
                <div className="text-center text-sm text-[#6B6B6B] py-12">
                  {en
                    ? 'Practise a few more topics to unlock your ability radar.'
                    : '再操多幾個唔同課題，就會解鎖你嘅能力雷達圖。'}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-medium text-lg mb-1 text-[#1A1A1A]">🛠️ {en ? 'Blind-spot Repair Worksheet' : '盲點修復卷'}</h3>
              <p className="text-sm text-[#6B6B6B] mb-4">
                {en
                  ? 'Auto-build a 20-question drill from your lowest win-rate topics.'
                  : '自動由你勝率最低嘅課題，砌一份 20 題專屬特訓卷。'}
              </p>
              <button
                onClick={onRepair}
                className="inline-flex items-center gap-2 bg-[#00726C] hover:bg-[#005F5A] text-white font-medium px-5 py-3 rounded-xl transition-all"
              >
                <Sparkles size={16} /> {en ? 'Generate repair worksheet' : '一鍵生成：專屬盲點修復卷'}
              </button>
            </div>
          </div>
        </div>

        {/* Error DNA — distribution of self-diagnosed error causes */}
        <ErrorDNA />

        {/* F-DNA: 錯題 DNA 雷達（30 日三軸分佈 + 規則式洞察） */}
        <div className="mt-6 mb-10">
          <ErrorRadar />
        </div>

        {/* Per-subject performance */}
        <h2 className="text-lg font-medium mb-4 text-[#1A1A1A]">{d.perSubject}</h2>
        <div className="space-y-3 mb-10">
          {stats.subjects.map((s) => {
            const meta = getSubject(s.subjectId)
            const pct = Math.round(s.accuracy * 100)
            return (
              <Link
                key={s.subjectId}
                href={`/subjects/${s.subjectId}`}
                className="block bg-white hover:bg-[#F5F5F0] border border-black/[0.06] rounded-xl p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-medium text-[#1A1A1A]">
                    <span>{meta?.emoji ?? '📘'}</span>
                    {subjName(s.subjectId, s.subjectName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#9CA3AF]">{s.questions}{d.questionsUnit}</span>
                    <span className={`text-xs font-medium text-black px-2 py-0.5 rounded ${gradeBgColors[s.bestGrade] ?? 'bg-slate-400'}`}>
                      {d.bestPrefix}{s.bestGrade}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-black/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#008B84] to-[#7C3AED]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#6B6B6B] w-10 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Weak topics */}
        {stats.weakTopics.length > 0 && (
          <>
            <h2 className="text-lg font-medium mb-4 text-[#1A1A1A]">{d.weakTitle}</h2>
            <div className="bg-[#B8860B]/[0.06] border border-[#B8860B]/25 rounded-2xl p-5 mb-10">
              <div className="space-y-3">
                {stats.weakTopics.map((wt) => (
                  <div key={wt.topic} className="flex items-center justify-between text-sm">
                    <span className="text-[#2D2D2D]">💡 {wt.topic}</span>
                    <span className="text-[#B8860B]" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {wt.correct}/{wt.total}{d.weakCorrectA}{Math.round(wt.accuracy * 100)}%{d.weakCorrectB}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recent attempts */}
        <h2 className="text-lg font-medium mb-4 text-[#1A1A1A]">{d.recentTitle}</h2>
        <div className="bg-white border border-black/[0.06] rounded-2xl divide-y divide-black/[0.06] mb-10">
          {stats.recent.map((a, i) => {
            const meta = getSubject(a.subjectId)
            return (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{meta?.emoji ?? '📘'}</span>
                  <div>
                    <div className="text-sm font-medium text-[#1A1A1A]">{subjName(a.subjectId, a.subjectName)}</div>
                    <div className="text-xs text-[#9CA3AF]">{relativeTime(a.timestamp, d)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#6B6B6B]" style={{ fontVariantNumeric: 'tabular-nums' }}>{a.score}/{a.total}</span>
                  <span className={`text-xs font-medium text-black px-2 py-0.5 rounded ${gradeBgColors[a.grade] ?? 'bg-slate-400'}`}>
                    {a.grade}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* 社群卡：IG Group 影子溫書室（學生自發管理，唔係官方 — /relax/group 有清楚聲明） */}
        <Link
          href="/relax/group"
          className="group block bg-white hover:bg-[#F5F5F0] border border-black/[0.06] rounded-2xl p-5 mb-10 transition-all"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)' }}
                aria-hidden
              >
                📷
              </div>
              <div>
                <div className="text-sm font-medium text-[#1A1A1A]">{en ? 'Shadow Study Room' : '影子溫書室'}</div>
                <div className="text-xs text-[#6B6B6B] mt-0.5">
                  {en ? 'IG Group · run by fellow students' : 'IG Group · 同路人管理'}
                </div>
              </div>
            </div>
            <span className="text-xs text-[#C2185B] shrink-0 group-hover:translate-x-0.5 transition-transform">
              {en ? 'Join the chat →' : '加入傾偈 →'}
            </span>
          </div>
        </Link>

        {/* Reset */}
        <div className="text-center">
          {confirmReset ? (
            <div className="inline-flex items-center gap-3 text-xs flex-wrap justify-center">
              <span className="text-[#6B6B6B]">{d.resetConfirm}</span>
              <button
                onClick={() => { clearProgress(); setStats(computeStats([])); setConfirmReset(false) }}
                className="font-medium text-[#C2185B] hover:text-[#A01450]"
              >
                {en ? 'Confirm reset' : '確定清除'}
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="text-[#9CA3AF] hover:text-[#6B6B6B]"
              >
                {en ? 'Cancel' : '取消'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-[#6B6B6B] transition-colors"
            >
              <RotateCcw size={13} /> {d.resetBtn}
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
