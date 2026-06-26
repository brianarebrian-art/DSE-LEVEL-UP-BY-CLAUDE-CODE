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
import { useLocale } from '@/lib/i18n'
import { CheckCircle, XCircle, ChevronRight, Clock, Brain, Zap } from 'lucide-react'
import DifficultyBadge from '@/components/DifficultyBadge'

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

// 地獄模式 difficulty mix: 10% easy / 40% medium / 50% hard — biased toward each
// bank's hardest questions (pickByDifficulty tops up from what's left if a bank is
// thin on hard ones, so it never returns fewer than it can).
const DIFF_RATIO: Record<Difficulty, number> = { easy: 0.1, medium: 0.4, hard: 0.5 }

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

// Per-tier tally (L2–3 / L4 / L5+) powering the result page's diagnostic warning:
// scoring 100% on L2–3 yet missing any L4/L5+ question is the "執分位 ≠ 5**" trap.
export type DifficultyResults = Record<Difficulty, { correct: number; total: number }>
function buildDifficultyResults(qs: PreparedQuestion[], ans: AnswerState[]): DifficultyResults {
  const out: DifficultyResults = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  }
  qs.forEach((q, i) => {
    out[q.difficulty].total++
    if (ans[i]?.isCorrect) out[q.difficulty].correct++
  })
  return out
}

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
      setAnswerState({ selectedZh: zh, isCorrect: zh === currentQ.correctZh })
    },
    [answerState, currentQ]
  )

  const next = useCallback(() => {
    const newAnswers = [...answers, answerState]
    setAnswers(newAnswers)
    setAnswerState(null)

    if (current + 1 >= totalQ) {
      const score = newAnswers.filter((a) => a?.isCorrect).length
      const subjectName = subjectMeta ? tr(subjectMeta.name, subjectMeta.nameEn) : tr('練習', 'Practice')
      const topicResults = buildTopicResults(questions, newAnswers)
      const difficultyResults = buildDifficultyResults(questions, newAnswers)
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const grade = predictGrade(score, getPracticeCutoffs(totalQ, subjectId)).grade
      const resultData = {
        score,
        total: totalQ,
        subjectId,
        subjectName,
        topicFilter: topicFilter ?? null,
        topicResults,
        difficultyResults,
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
      // Update the weakness tally (powers the dashboard radar / repair worksheet).
      recordTopicOutcomes(subjectId, buildTopicOutcomes(questions, newAnswers))
      // Free users: a completed run counts against their platform-wide quota.
      if (countsAgainstFreeQuota) incrementGlobalAttemptsUsed()
      router.push('/result')
    } else {
      setCurrent((c) => c + 1)
    }
  }, [answers, answerState, current, totalQ, questions, startTime, router, subjectId, subjectMeta, topicFilter, countsAgainstFreeQuota, tr])

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
      <div className="max-w-2xl mx-auto">

        {/* Subject label + weakness badge */}
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 mb-4 animate-slide-up">
          {/* Meta */}
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <DifficultyBadge difficulty={currentQ.difficulty} locale={locale === 'en' ? 'en' : 'zh'} />
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
            {answerState.isCorrect ? (
              /* Correct — calm acknowledgement, no fanfare. */
              <div className="rounded-2xl p-5 mb-4 border bg-green-500/10 border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={18} className="text-green-400" />
                  <span className="text-green-400 font-semibold">{t.practice.correct}</span>
                </div>
                <div className="flex items-start gap-1.5 text-sm text-slate-400 leading-relaxed">
                  <Brain size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <MathText>{tr(currentQ.explanation, currentQ.explanationEn)}</MathText>
                </div>
              </div>
            ) : (
              /* Wrong → reframed as 思維逆襲解密: the error IS the lesson, not a failure.
                 Calm amber insight tone — no red shaming, no shake. */
              <div className="rounded-2xl p-5 mb-4 border bg-amber-500/10 border-amber-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Brain size={18} className="text-amber-400" />
                  <span className="text-amber-300 font-semibold">{tr('🔍 思維逆襲解密', '🔍 Mind-flip decode')}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  {tr(
                    '唔緊要 —— 睇穿你今次中咗嘅思維盲區，先係真正攞分嘅一刻。',
                    'No stress — seeing through the blind spot you just hit is exactly where marks are won.',
                  )}
                </p>
                <div className="text-sm text-slate-300 leading-relaxed border-t border-amber-500/15 pt-3">
                  <span className="text-amber-400 text-xs font-bold mr-1">💡 {tr('正解思路：', 'Reasoning: ')}</span>
                  <MathText>{tr(currentQ.explanation, currentQ.explanationEn)}</MathText>
                </div>
              </div>
            )}

            {/* Path B — 名師速解 / MC Hack (the exam shortcut, distinct from the
                formal Path A reasoning above). Shown whenever the question carries one. */}
            {currentQ.mcHack && (
              <div className="rounded-2xl p-5 mb-4 border bg-indigo-500/10 border-indigo-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={18} className="text-indigo-300" />
                  <span className="text-indigo-200 font-semibold">{tr('⚡ 名師速解（MC Hack）', '⚡ MC Hack — exam shortcut')}</span>
                </div>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  {tr(
                    '考場上唔使寫足證明 —— 呢招專為 MC 而設，秒級攞分。',
                    'No full proof needed in the exam — this is the MC-only quick kill.',
                  )}
                </p>
                <div className="text-sm text-slate-200 leading-relaxed border-t border-indigo-500/15 pt-3">
                  <MathText>{tr(currentQ.mcHack, currentQ.mcHackEn)}</MathText>
                </div>
              </div>
            )}

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
