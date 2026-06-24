'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MathText from '@/components/MathText'
import type { Question, Difficulty } from '@/data/questions'
import { getSubject } from '@/data/subjects'
import { predictGrade } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { recordAttempt } from '@/lib/progress'
import { incrementGlobalAttemptsUsed } from '@/lib/freeUsage'
import { getSeen, recordSeen } from '@/lib/seen'
import { weakestTopics, recordTopicOutcomes } from '@/lib/topicStats'
import { touchStreak, addExp, EXP_PER_QUESTION, rollGacha, unlockTheme, setActiveTheme } from '@/lib/gamify'
import { playCorrect, playWrong, playCombo, playHell, playJackpot, isMuted, setMuted } from '@/lib/sfx'
import { useLocale } from '@/lib/i18n'
import { CheckCircle, XCircle, ChevronRight, Clock, Brain, Volume2, VolumeX } from 'lucide-react'

// Combo milestones that fire the on-screen COMBO ×N effect + zap SFX.
const COMBO_MILESTONES = new Set([3, 5, 10, 15, 20, 30])

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// An option carries both languages so the display can switch 中/EN while grading
// stays anchored to the (always-present) Chinese text.
interface PreparedOption {
  zh: string
  en: string | null
}

// A question prepared for display: options shuffled as zh/en pairs, with the
// correct answer kept by its Chinese TEXT — so grading compares a stable,
// language-independent value (never an index, and unaffected by the toggle).
type PreparedQuestion = Question & { shuffledOptions: PreparedOption[]; correctZh: string }

function prepareQuestion(q: Question): PreparedQuestion {
  const pairs: PreparedOption[] = q.options.map((zh, i) => ({ zh, en: q.optionsEn?.[i] ?? null }))
  return { ...q, shuffledOptions: shuffle(pairs), correctZh: q.options[q.correctIndex] }
}

// DSE difficulty mix for a practice run: 30% easy / 50% medium / 20% hard.
const DIFF_RATIO: Record<Difficulty, number> = { easy: 0.3, medium: 0.5, hard: 0.2 }

// Pick `size` questions from a recency-ordered pool honouring the 3:5:2 mix.
// `ordered` is already in preference order (unseen first, then longest-ago-seen);
// we draw per difficulty in that order, then top up from whatever's left if a
// difficulty bucket runs short — so a thin bank never returns fewer than it can.
function pickByDifficulty(ordered: Question[], size: number): Question[] {
  if (ordered.length <= size) return ordered

  const target: Record<Difficulty, number> = {
    easy: Math.round(size * DIFF_RATIO.easy),
    hard: Math.round(size * DIFF_RATIO.hard),
    medium: 0,
  }
  target.medium = size - target.easy - target.hard

  const buckets: Record<Difficulty, Question[]> = { easy: [], medium: [], hard: [] }
  for (const q of ordered) buckets[q.difficulty]?.push(q)

  const chosen: Question[] = []
  const taken = new Set<string>()
  const take = (d: Difficulty, n: number) => {
    for (const q of buckets[d]) {
      if (chosen.length >= size || n <= 0) break
      if (taken.has(q.id)) continue
      chosen.push(q)
      taken.add(q.id)
      n--
    }
  }
  take('easy', target.easy)
  take('medium', target.medium)
  take('hard', target.hard)

  // Top up any shortfall from the remaining pool, keeping recency preference.
  if (chosen.length < size) {
    for (const q of ordered) {
      if (chosen.length >= size) break
      if (taken.has(q.id)) continue
      chosen.push(q)
      taken.add(q.id)
    }
  }
  return chosen
}

function buildPool(
  bank: Question[],
  subjectId: string,
  topicFilter: string | null,
  sessionSize: number,
  mode: 'normal' | 'weakness',
): PreparedQuestion[] {
  const base = topicFilter ? bank.filter((q) => q.topic === topicFilter) : bank

  let ordered: Question[]
  if (mode === 'weakness') {
    // Repair worksheet: surface the user's weakest topics (lowest win-rate) first,
    // padded by the rest so a 20-Q run can still fill. Stratification below is
    // unchanged, so the 3:5:2 mix still holds within the weakness slice.
    const weak = new Set(weakestTopics({ subjectId, min: 1, limit: 4 }).map((e) => e.topic))
    const weakQs = shuffle(base.filter((q) => weak.has(q.topic)))
    const rest = shuffle(base.filter((q) => !weak.has(q.topic)))
    ordered = [...weakQs, ...rest]
  } else {
    // Prefer questions the user hasn't been shown recently: unseen ones first (in
    // random order), then the longest-ago-seen, so re-doing a subject surfaces
    // fresh questions and only repeats once the whole bank is exhausted.
    const seen = getSeen(subjectId) // recently-shown ids, most-recent first
    const recency = new Map(seen.map((id, i) => [id, i]))
    const unseen = shuffle(base.filter((q) => !recency.has(q.id)))
    const seenOldestFirst = base
      .filter((q) => recency.has(q.id))
      .sort((a, b) => recency.get(b.id)! - recency.get(a.id)!)
    ordered = [...unseen, ...seenOldestFirst]
  }

  // Stratify to the DSE 3:5:2 mix, then shuffle so difficulties aren't clustered.
  return shuffle(pickByDifficulty(ordered, sessionSize)).map(prepareQuestion)
}

type AnswerState = { selectedZh: string; isCorrect: boolean } | null

function buildTopicResults(qs: PreparedQuestion[], ans: AnswerState[]) {
  const map: Record<string, { topic: string; correct: number; total: number }> = {}
  qs.forEach((q, i) => {
    if (!map[q.topic]) map[q.topic] = { topic: q.topicZh, correct: 0, total: 0 }
    map[q.topic].total++
    if (ans[i]?.isCorrect) map[q.topic].correct++
  })
  return Object.values(map)
}

// Per-topic outcomes keyed by topic ID (+ display label) for the weakness tally.
function buildTopicOutcomes(qs: PreparedQuestion[], ans: AnswerState[]) {
  const map: Record<string, { topic: string; label: string; correct: number; total: number }> = {}
  qs.forEach((q, i) => {
    const e = map[q.topic] ?? { topic: q.topic, label: q.topicZh, correct: 0, total: 0 }
    e.total++
    if (ans[i]?.isCorrect) e.correct++
    map[q.topic] = e
  })
  return Object.values(map)
}

const optionLetters = ['A', 'B', 'C', 'D']

interface SessionProps {
  bank: Question[]
  subjectId: string
  topicFilter: string | null
  sessionSize: number
  countsAgainstFreeQuota: boolean
  mode?: 'normal' | 'weakness'
}

// A single practice run. This component is loaded client-only (via next/dynamic
// ssr:false in page.tsx), so the lazy `useState` initializers below can safely use
// Math.random()/Date.now() without causing a server/client hydration mismatch.
// It is re-mounted (via `key`) whenever subject/topic changes, re-running the shuffle.
export default function PracticeSession({
  bank,
  subjectId,
  topicFilter,
  sessionSize,
  countsAgainstFreeQuota,
  mode = 'normal',
}: SessionProps) {
  const router = useRouter()
  const { locale, t } = useLocale()
  const subjectMeta = getSubject(subjectId)

  const [questions] = useState<PreparedQuestion[]>(() => buildPool(bank, subjectId, topicFilter, sessionSize, mode))
  const [startTime] = useState(() => Date.now())
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [answerState, setAnswerState] = useState<AnswerState>(null)
  const [elapsed, setElapsed] = useState(0)

  // Dopamine engine: in-session combo, the transient COMBO ×N flash, the 5% gacha
  // jackpot toast, and a mute toggle.
  const [combo, setCombo] = useState(0)
  const [comboFx, setComboFx] = useState<number | null>(null)
  const [jackpot, setJackpot] = useState(false)
  const [muted, setMutedState] = useState(false)
  useEffect(() => {
    setMutedState(isMuted())
  }, [])
  useEffect(() => {
    if (comboFx === null) return
    const id = setTimeout(() => setComboFx(null), 1100)
    return () => clearTimeout(id)
  }, [comboFx])

  // Show the English string when the UI is in English and a translation exists;
  // otherwise fall back to the Chinese original (so untranslated subjects still work).
  const tr = useCallback(
    (zh: string, en?: string | null) => (locale === 'en' && en ? en : zh),
    [locale]
  )

  // Remember which questions were shown so the next run can avoid repeating them.
  useEffect(() => {
    recordSeen(subjectId, questions.map((q) => q.id))
  }, [subjectId, questions])

  // Live timer.
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime])

  const currentQ = questions[current]
  const totalQ = questions.length
  const progress = totalQ > 0 ? (current / totalQ) * 100 : 0

  const selectOption = useCallback(
    (zh: string) => {
      if (answerState !== null || !currentQ) return
      const isCorrect = zh === currentQ.correctZh
      setAnswerState({ selectedZh: zh, isCorrect })

      if (!isCorrect) {
        setCombo(0)
        playWrong()
        return
      }
      const newCombo = combo + 1
      setCombo(newCombo)
      const hell = currentQ.difficulty === 'hard'
      if (COMBO_MILESTONES.has(newCombo)) {
        setComboFx(newCombo)
        playCombo(newCombo)
      } else if (hell) {
        playHell()
      } else {
        playCorrect()
      }
      // 5% gacha drop for nailing a 🔴 hell-level question → unlock the cyber theme.
      if (hell && rollGacha(0.05) && unlockTheme('cyber')) {
        setJackpot(true)
        playJackpot()
      }
    },
    [answerState, currentQ, combo]
  )

  const next = useCallback(() => {
    const newAnswers = [...answers, answerState]
    setAnswers(newAnswers)
    setAnswerState(null)

    if (current + 1 >= totalQ) {
      const score = newAnswers.filter((a) => a?.isCorrect).length
      const subjectName = subjectMeta ? tr(subjectMeta.name, subjectMeta.nameEn) : tr('練習', 'Practice')
      const topicResults = buildTopicResults(questions, newAnswers)
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const grade = predictGrade(score, getPracticeCutoffs(totalQ, subjectId)).grade
      const resultData = {
        score,
        total: totalQ,
        subjectId,
        subjectName,
        topicFilter: topicFilter ?? null,
        topicResults,
        elapsed,
      }
      localStorage.setItem('dse_result', JSON.stringify(resultData))
      // Persist to the long-term progress log (powers the dashboard / streaks).
      recordAttempt({
        subjectId,
        subjectName,
        topicFilter: topicFilter ?? null,
        score,
        total: totalQ,
        grade,
        topicResults,
        elapsed,
        timestamp: Date.now(),
      })
      // Gamification: advance the daily streak, bank EXP, update the weakness tally.
      touchStreak()
      addExp(totalQ * EXP_PER_QUESTION)
      recordTopicOutcomes(subjectId, buildTopicOutcomes(questions, newAnswers))
      // Free users: a completed run counts against their platform-wide quota.
      if (countsAgainstFreeQuota) incrementGlobalAttemptsUsed()
      router.push('/result')
    } else {
      setCurrent((c) => c + 1)
    }
  }, [answers, answerState, current, totalQ, questions, startTime, router, subjectId, subjectMeta, topicFilter, countsAgainstFreeQuota])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // No questions for this subject/topic yet.
  if (totalQ === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl">{subjectMeta?.emoji ?? '📝'}</div>
        <p className="text-slate-400">
          {subjectMeta
            ? t.practice.notLive.replace('{subject}', tr(subjectMeta.name, subjectMeta.nameEn))
            : t.practice.notLiveGeneric}
        </p>
        <Link href="/subjects" className="text-amber-400 hover:text-amber-300 underline">
          {t.practice.otherSubjects}
        </Link>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">{t.practice.loading}</div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10">
      {/* Combo flash */}
      {comboFx !== null && (
        <div className="fixed inset-x-0 top-24 z-40 flex justify-center pointer-events-none">
          <div className="animate-combo text-4xl sm:text-5xl font-extrabold text-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.7)]">
            COMBO ×{comboFx} 🔥
          </div>
        </div>
      )}

      {/* Gacha jackpot toast */}
      {jackpot && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="animate-jackpot bg-slate-900 border border-amber-500/50 rounded-2xl px-5 py-4 max-w-sm w-full shadow-2xl text-center">
            <div className="text-2xl mb-1">🎉🎰</div>
            <div className="font-bold text-amber-400 mb-1">{tr('隱藏彩蛋解鎖！', 'Easter egg unlocked!')}</div>
            <p className="text-xs text-slate-400 mb-3">
              {tr('你撼低咗地獄題，抽中 5% 隱藏主題：Cyberpunk 黑客界面。', 'You cracked a hell question and hit the 5% drop: the Cyberpunk theme.')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveTheme('cyber'); setJackpot(false) }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded-lg text-sm"
              >
                {tr('即刻試', 'Try it')}
              </button>
              <button
                onClick={() => setJackpot(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 rounded-lg text-sm"
              >
                {tr('遲啲', 'Later')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">

        {/* Subject label + weakness badge + mute */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          {subjectMeta && (
            <>
              <span>{subjectMeta.emoji}</span>
              <span className="text-slate-300 font-medium">{tr(subjectMeta.name, subjectMeta.nameEn)}</span>
            </>
          )}
          {mode === 'weakness' && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
              🛠️ {tr('弱項修復卷', 'Repair worksheet')}
            </span>
          )}
          <button
            onClick={() => { const m = !muted; setMuted(m); setMutedState(m) }}
            className="ml-auto text-slate-500 hover:text-slate-300 transition-colors"
            title={muted ? tr('開音效', 'Unmute') : tr('靜音', 'Mute')}
            aria-label="toggle sound"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>
              {t.practice.progress.replace('{n}', String(current + 1)).replace('{total}', String(totalQ))}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {formatTime(elapsed)}
            </span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-4 ${answerState && !answerState.isCorrect ? 'animate-shake' : 'animate-slide-up'}`}>
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
              <span>{currentQ.frameworkEmoji}</span>
              {tr(currentQ.frameworkZh, currentQ.frameworkEn)}
            </span>
            <span className="text-xs text-slate-600 bg-slate-800 px-3 py-1 rounded-full">
              {tr(currentQ.topicZh, currentQ.topicEn)}
            </span>
            <span className="text-xs text-slate-600 bg-slate-800 px-3 py-1 rounded-full ml-auto">
              {currentQ.year}
            </span>
          </div>

          {/* Content */}
          <p className="text-lg leading-relaxed mb-8 text-slate-100">
            <MathText>{tr(currentQ.content, currentQ.contentEn)}</MathText>
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.shuffledOptions.map((opt, idx) => {
              const isCorrectOpt = opt.zh === currentQ.correctZh
              const isSelectedWrong =
                answerState !== null && opt.zh === answerState.selectedZh && !answerState.isCorrect

              let style =
                'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-600 cursor-pointer'

              if (answerState !== null) {
                if (isCorrectOpt) {
                  style = 'border-green-500 bg-green-500/10 cursor-default'
                } else if (isSelectedWrong) {
                  style = 'border-red-500 bg-red-500/10 cursor-default'
                } else {
                  style = 'border-slate-800 bg-slate-800/30 opacity-50 cursor-default'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => selectOption(opt.zh)}
                  disabled={answerState !== null}
                  className={`w-full text-left flex items-start gap-3 border rounded-xl px-4 py-3 transition-all option-btn ${style}`}
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 mt-0.5">
                    {optionLetters[idx]}
                  </span>
                  <span className="leading-relaxed text-sm sm:text-base">
                    <MathText>{tr(opt.zh, opt.en)}</MathText>
                  </span>
                  {answerState !== null && isCorrectOpt && (
                    <CheckCircle size={18} className="text-green-400 ml-auto shrink-0 mt-0.5" />
                  )}
                  {isSelectedWrong && (
                    <XCircle size={18} className="text-red-400 ml-auto shrink-0 mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Feedback + Next */}
        {answerState !== null && (
          <div className="animate-slide-up">
            {/* Feedback box */}
            <div
              className={`rounded-2xl p-5 mb-4 border ${
                answerState.isCorrect
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {answerState.isCorrect ? (
                  <>
                    <CheckCircle size={18} className="text-green-400" />
                    <span className="text-green-400 font-semibold">{t.practice.correct}</span>
                  </>
                ) : (
                  <>
                    <XCircle size={18} className="text-red-400" />
                    <span className="text-red-400 font-semibold">{t.practice.wrong}</span>
                  </>
                )}
              </div>
              <div className="flex items-start gap-1.5 text-sm text-slate-400 leading-relaxed">
                <Brain size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <MathText>{tr(currentQ.explanation, currentQ.explanationEn)}</MathText>
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={next}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {current + 1 >= totalQ ? t.practice.seeResult : (
                <>{t.practice.next} <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        )}

        {/* Score tracker */}
        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalQ }).map((_, i) => {
            let color = 'bg-slate-800'
            if (i < answers.length) {
              color = answers[i]?.isCorrect ? 'bg-green-500' : 'bg-red-500'
            } else if (i === current) {
              color = 'bg-amber-500'
            }
            return <div key={i} className={`w-3 h-3 rounded-full ${color} transition-colors`} />
          })}
        </div>
      </div>
    </div>
  )
}
