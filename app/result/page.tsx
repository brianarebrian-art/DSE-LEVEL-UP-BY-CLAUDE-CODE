'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Share2, RotateCcw, ClipboardCopy, ClipboardCheck } from 'lucide-react'
import { predictGrade, gradeColors, gradeBgColors, type GradeResult } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { getSubject } from '@/data/subjects'
import { useLocale } from '@/lib/i18n'
import EncouragementWall from '@/components/EncouragementWall'
import ShareStatsCardButton from '@/components/ShareStatsCardButton'
import { type DailyStatsCardData } from '@/components/DailyStatsCard'

interface TopicResult {
  topic: string
  correct: number
  total: number
}

type TierKey = 'easy' | 'medium' | 'hard'
type DifficultyResults = Record<TierKey, { correct: number; total: number }>

interface StoredResult {
  score: number
  total: number
  subjectId?: string
  subjectName?: string
  topicFilter?: string | null
  topicResults: TopicResult[]
  difficultyResults?: DifficultyResults
  elapsed: number
}

function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setVal(Math.round(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [target, duration])
  return val
}

export default function ResultPage() {
  const { t, locale } = useLocale()
  const r = t.result
  const [result, setResult] = useState<StoredResult | null>(null)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [showBadge, setShowBadge] = useState(false)
  const [shared, setShared] = useState(false)
  const [reportCopied, setReportCopied] = useState(false)
  const [siteHost, setSiteHost] = useState('')

  // Hydrate the result from localStorage on mount. This must run client-side
  // (reading during render would mismatch the SSR'd HTML), so setState here is intentional.
  useEffect(() => {
    setSiteHost(window.location.host)
    const raw = localStorage.getItem('dse_result')
    if (!raw) return
    const data: StoredResult = JSON.parse(raw)
    const gr = predictGrade(data.score, getPracticeCutoffs(data.total, data.subjectId ?? 'practice'))
    setResult(data)
    setGradeResult(gr)
    setTimeout(() => setShowBadge(true), 1600)
  }, [])

  const displayScore = useCountUp(result?.score ?? 0, 1400)
  const displayPct = useCountUp(
    result ? Math.round((result.score / result.total) * 100) : 0,
    1400
  )

  if (!result || !gradeResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#FAFAF8] text-[#2D2D2D]">
        <p className="text-[#6B6B6B]">{r.notFound}</p>
        <Link href="/practice" className="text-[#008B84] underline">{r.backToPractice}</Link>
      </div>
    )
  }

  const barWidth = Math.round((result.score / result.total) * 100)
  const color = gradeColors[gradeResult.grade] ?? '#64748B'
  const bgColor = gradeBgColors[gradeResult.grade] ?? 'bg-slate-400'
  const formatTime = (s: number) => `${Math.floor(s / 60)}${r.timeMin}${s % 60}${r.timeSec}`

  // Subject name in the active locale (falls back to the stored name).
  const subjMeta = result.subjectId ? getSubject(result.subjectId) : undefined
  const subjName = subjMeta
    ? (locale === 'en' ? subjMeta.nameEn : subjMeta.name)
    : (result.subjectName ?? r.defaultSubject)

  // 中文科診斷警示：在 L2–3 基礎鞏固題全對（100%），卻在任何 L4/L5+ 題失手時觸發。
  // 戳破「答對基礎題 ≠ 5**」的錯覺；文意推論措辭只適用於中文閱讀，故僅限中文科。
  const dr = result.difficultyResults
  const baseAllCorrect = !!dr && dr.easy.total > 0 && dr.easy.correct === dr.easy.total
  const higherHasMiss =
    !!dr && (dr.medium.correct < dr.medium.total || dr.hard.correct < dr.hard.total)
  const showChineseWarning = result.subjectId === 'chinese' && baseAllCorrect && higherHasMiss

  // 戰績卡真數據 —— 只用 REAL session 數據；無虛構 JUPAS/搶分數/streak。
  const tierMeta: { key: TierKey; label: string; color: string }[] = [
    { key: 'easy', label: locale === 'en' ? 'Foundation' : '補底', color: '#34D399' },
    { key: 'medium', label: locale === 'en' ? 'Standard' : '普通', color: '#FEE440' },
    { key: 'hard', label: locale === 'en' ? 'Top-tier' : '拔尖', color: '#9B5DE5' },
  ]
  const cardTiers = dr
    ? tierMeta.filter((m) => dr[m.key].total > 0).map((m) => ({ label: m.label, correct: dr[m.key].correct, total: dr[m.key].total, color: m.color }))
    : []
  const ratioSorted = [...result.topicResults].filter((tt) => tt.total > 0).sort((a, b) => b.correct / b.total - a.correct / a.total)
  const bestTopic = ratioSorted[0]
  const worstTopic = ratioSorted[ratioSorted.length - 1]
  const cardData: DailyStatsCardData = {
    date: new Date().toLocaleDateString(locale === 'en' ? 'en-GB' : 'zh-HK'),
    subject: subjName,
    questionsDone: result.total,
    accuracy: Math.round((result.score / result.total) * 100),
    correctCount: result.score,
    totalCount: result.total,
    timeSpent: formatTime(result.elapsed),
    avgPerQuestion: formatTime(Math.round(result.elapsed / Math.max(1, result.total))),
    tiers: cardTiers,
    strengthTopic: bestTopic && bestTopic.correct === bestTopic.total && bestTopic.topic !== worstTopic?.topic ? bestTopic.topic : undefined,
    focusTopic: worstTopic && worstTopic.correct < worstTopic.total ? worstTopic.topic : undefined,
    igLink: 'ig.me/j/AbYCy6ZUDR-yWVPN',
    siteUrl: siteHost || 'dse-level-up-by-claude-code.vercel.app',
  }

  // ── Teacher hand-in report. Fills the fixed template with real diagnostic data;
  // Name/Class stay as blanks for the student to complete.
  const buildTeacherReport = (): string => {
    const divider = '-'.repeat(50)
    const pct = Math.round((result.score / result.total) * 100)
    const date = new Date().toISOString().slice(0, 10)
    const ranked = [...result.topicResults].sort(
      (a, b) => a.correct / a.total - b.correct / b.total
    )
    const weak = ranked.filter((tr) => tr.correct / tr.total < 1)
    const weakLines = (weak.length ? weak : ranked).slice(0, 2)
    const en = locale === 'en'
    const weaknesses = weakLines.length
      ? weakLines.map((tr) => `- ${tr.topic} (${tr.correct}/${tr.total})`).join('\n')
      : en ? '- None — consistent accuracy across all topics' : '- 無 —— 各課題表現一致'
    const topWeak = weakLines[0]?.topic
    const actions = topWeak
      ? en
        ? `Prioritise targeted drilling on ${weakLines.map((w) => w.topic).join(' and ')}; review the Path A worked solutions, then re-attempt the L5+ elite-challenge set to convert recognition into mastery.`
        : `優先針對 ${weakLines.map((w) => w.topic).join('、')} 集中操練；重溫 Path A 詳解，再重做 L5+ 拔尖挑戰題，將「識」化為「熟」。`
      : en
        ? 'Maintain momentum: advance to full timed past-paper sets to consolidate exam pacing.'
        : '保持節奏：進階到全份計時歷屆試題，鞏固考試步速。'
    return [
      en ? '[DSE Level Up — Student Diagnostic Report]' : '【DSE Level Up — 學生診斷報告】',
      divider,
      en ? 'Student Name: ____________________' : '學生姓名：____________________',
      en ? 'Class & No.: ____________________' : '班別及學號：____________________',
      `${en ? 'Date' : '日期'}: ${date}`,
      `${en ? 'Subject Evaluated' : '評估科目'}: ${subjName}`,
      divider,
      `${en ? 'Diagnostic Level' : '診斷等級'}: ${gradeResult.grade}`,
      `${en ? 'Accuracy Rate' : '準確率'}: ${result.score}/${result.total} (${pct}%)`,
      en ? 'Core Blind Spots Identified:' : '已識別核心盲點：',
      weaknesses,
      `${en ? 'Recommended Actions' : '建議行動'}: ${actions}`,
      divider,
      en ? '*Generated by DSE Level Up — free DSE practice for everyone.' : '*由 DSE Level Up 生成 —— 免費 DSE 練習，人人可用。',
    ].join('\n')
  }

  const copyTeacherReport = () => {
    navigator.clipboard.writeText(buildTeacherReport()).then(() => {
      setReportCopied(true)
      setTimeout(() => setReportCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Subject context */}
        {(result.subjectName || subjMeta) && (
          <div className="text-center text-sm text-[#6B6B6B]">
            {subjName}{r.mixedResult}
          </div>
        )}

        {/* Grade badge + Score */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-8 text-center">
          {showBadge && (
            <div
              className="inline-block text-6xl mb-4 animate-pop-in"
              style={{ animationDelay: '0ms' }}
            >
              {gradeResult.grade === '5**' ? '🏆'
                : gradeResult.grade === '5*' ? '⭐'
                : gradeResult.grade === '5' ? '🎉'
                : gradeResult.grade === '4' ? '💪'
                : '📚'}
            </div>
          )}

          <div className="text-5xl sm:text-6xl font-medium mb-1" style={{ color }}>
            {displayScore} / {result.total}
          </div>
          <div className="text-[#6B6B6B] mb-4" style={{ fontVariantNumeric: 'tabular-nums' }}>{displayPct}%</div>

          {/* Predicted grade */}
          <div className="mb-4">
            <span className="text-[#6B6B6B] text-sm">{r.predictedGrade}</span>
            <div
              className={`inline-block ml-2 px-4 py-1 rounded-full text-black font-medium text-lg ${bgColor}`}
            >
              {gradeResult.grade}
            </div>
          </div>

          <p className="text-[#6B6B6B] text-sm mb-6">
            {r.gradeMessages[gradeResult.grade]}
          </p>

          {/* Marks to next grade */}
          {gradeResult.marksToNextGrade !== null && gradeResult.nextGrade && (
            <div className="inline-flex items-center gap-2 text-sm text-[#B8860B] bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-full px-4 py-2">
              {r.marksToNext
                .replace('{grade}', gradeResult.nextGrade)
                .replace('{marks}', String(gradeResult.marksToNextGrade))}
            </div>
          )}
        </div>

        {/* 中文科診斷警示 — 基礎全對但高階失手：戳破「執分位 ≠ 5**」的錯覺 */}
        {showChineseWarning && (
          <div className="bg-[#C2185B]/[0.06] border border-[#C2185B]/25 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#C2185B] text-lg">⚠️</span>
              <span className="text-[#C2185B] font-medium text-sm">{locale === 'en' ? 'Top-tier diagnostic alert' : '拔尖診斷警示'}</span>
            </div>
            <p className="text-sm text-[#2D2D2D] leading-relaxed">
              {locale === 'en'
                ? 'You scored 100% on the foundation-consolidation questions, but still fell short on the higher-order inference questions. In the real DSE, easy questions are only “marks to bank” — to reliably secure Level 4 or above you must conquer the top-tier challenge questions. Getting the basics right is never proof you can reach 5** in the exam.'
                : '你在基礎鞏固題得分率為 100%，但在高階文意推論題中仍有不足。在真實 DSE 中，簡單題目僅為『執分位』，若要穩奪 Level 4 或以上，必須克服拔尖挑戰題。答對基礎題絕不代表能在文憑試中取得 5**。'}
            </p>
          </div>
        )}

        {/* Grade bar */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6">
          <div className="text-sm font-medium text-[#1A1A1A] mb-4">{r.gradePosition}</div>

          {/* Grade scale */}
          <div className="relative">
            <div className="h-3 bg-black/[0.06] rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${barWidth}%`,
                  background: `linear-gradient(to right, #E2E2DC, ${color})`,
                  animation: 'fill-bar 1.2s ease-out forwards',
                  ['--fill-width' as string]: `${barWidth}%`,
                }}
              />
            </div>

            {/* Grade markers */}
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
              <span>0</span>
              {['1', '2', '3', '4', '5', '5*', '5**'].map((g) => (
                <span key={g} style={{ color: gradeColors[g] }}>
                  {g}
                </span>
              ))}
              <span>{result.total}</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-[#9CA3AF] text-center">
            {r.timeUsedA}{formatTime(result.elapsed)}
          </div>
        </div>

        {/* Topic breakdown */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6">
          <div className="text-sm font-medium text-[#1A1A1A] mb-4">{r.topicAnalysis}</div>
          <div className="space-y-3">
            {result.topicResults.map((tr) => {
              const pct = Math.round((tr.correct / tr.total) * 100)
              return (
                <div key={tr.topic}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#2D2D2D]">{tr.topic}</span>
                    <span
                      className={pct >= 80 ? 'text-[#008B84]' : pct >= 50 ? 'text-[#B8860B]' : 'text-[#C2185B]'}
                    >
                      {tr.correct}/{tr.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 80 ? 'bg-[#008B84]' : pct >= 50 ? 'bg-[#B8860B]' : 'bg-[#C2185B]'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Weakest topic recommendation */}
          {(() => {
            const weak = [...result.topicResults].sort(
              (a, b) => a.correct / a.total - b.correct / b.total
            )[0]
            if (weak && weak.correct / weak.total < 0.8) {
              return (
                <div className="mt-4 p-3 bg-[#B8860B]/10 border border-[#B8860B]/20 rounded-xl text-sm text-[#B8860B]">
                  {r.weakAdviceA}<strong>{weak.topic}</strong>{r.weakAdviceB}{weak.correct}/{weak.total}{r.weakAdviceC}
                </div>
              )
            }
          })()}
        </div>

        {/* Teacher hand-in tool — copies the fixed report template to clipboard */}
        <button
          onClick={copyTeacherReport}
          className="no-print w-full flex items-center justify-center gap-2 bg-[#7C3AED]/10 hover:bg-[#7C3AED]/20 border border-[#7C3AED]/30 text-[#7C3AED] font-medium py-3.5 rounded-xl transition-all"
        >
          {reportCopied ? <ClipboardCheck size={16} className="text-[#008B84]" /> : <ClipboardCopy size={16} />}
          {reportCopied
            ? (locale === 'en' ? 'Report copied — paste to your teacher' : '已複製報告 —— 貼給老師即可')
            : (locale === 'en' ? 'Copy Report to Teacher' : '複製成績報告給老師')}
        </button>

        {/* 分享戰績卡到 IG Story（誠實版：真數據 only，html2canvas 客戶端）*/}
        <ShareStatsCardButton data={cardData} en={locale === 'en'} />

        {/* Action buttons */}
        <div className="no-print grid sm:grid-cols-2 gap-3">
          <Link
            href={`/practice?subject=${result.subjectId ?? 'math'}`}
            className="flex items-center justify-center gap-2 bg-[#00726C] hover:bg-[#005F5A] text-white font-medium py-4 rounded-xl transition-all"
          >
            <RotateCcw size={16} /> {r.retry}
          </Link>
          <Link
            href={`/subjects/${result.subjectId ?? 'math'}`}
            className="flex items-center justify-center gap-2 bg-white hover:bg-[#F5F5F0] border border-black/[0.12] text-[#2D2D2D] py-4 rounded-xl transition-all"
          >
            {r.pickTopic} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Share */}
        <button
          onClick={() => {
            const text = `${r.shareTextA}${subjName}${r.shareTextB}${result.score}/${result.total}${r.shareTextC}${gradeResult.grade}${r.shareTextD}`
            if (navigator.share) {
              navigator.share({ text }).catch(() => {})
            } else {
              navigator.clipboard.writeText(text)
              setShared(true)
              setTimeout(() => setShared(false), 1800)
            }
          }}
          className="no-print w-full flex items-center justify-center gap-2 text-[#6B6B6B] hover:text-[#008B84] border border-black/[0.10] py-3 rounded-xl transition-all text-sm"
        >
          <Share2 size={14} /> {shared ? r.shareCopied : r.shareScore}
        </button>

        {/* 過來人打氣牆（Sarah — 完成練習嘅情緒時刻） */}
        <EncouragementWall />

        {/* Disclaimer */}
        <p className="text-xs text-[#9CA3AF] text-center">
          {r.disclaimer}
        </p>
      </div>
    </div>
  )
}
