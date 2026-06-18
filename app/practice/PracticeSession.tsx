'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import MathText from '@/components/MathText'
import { getSubjectQuestions, type Question } from '@/data/questions'
import { getSubject } from '@/data/subjects'
import { predictGrade } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { recordAttempt } from '@/lib/progress'
import { CheckCircle, XCircle, ChevronRight, Clock, Brain } from 'lucide-react'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// A question prepared for display: options shuffled, correct answer kept by TEXT
// so grading compares text (never index) and survives the option shuffle.
type PreparedQuestion = Question & { shuffledOptions: string[]; correctText: string }

function prepareQuestion(q: Question): PreparedQuestion {
  return { ...q, shuffledOptions: shuffle(q.options), correctText: q.options[q.correctIndex] }
}

function buildPool(subjectId: string, topicFilter: string | null): PreparedQuestion[] {
  const all = getSubjectQuestions(subjectId)
  const pool = topicFilter ? all.filter((q) => q.topic === topicFilter) : all
  return shuffle(pool).map(prepareQuestion)
}

type AnswerState = { selectedText: string; isCorrect: boolean } | null

function buildTopicResults(qs: PreparedQuestion[], ans: AnswerState[]) {
  const map: Record<string, { topic: string; correct: number; total: number }> = {}
  qs.forEach((q, i) => {
    if (!map[q.topic]) map[q.topic] = { topic: q.topicZh, correct: 0, total: 0 }
    map[q.topic].total++
    if (ans[i]?.isCorrect) map[q.topic].correct++
  })
  return Object.values(map)
}

const optionLetters = ['A', 'B', 'C', 'D']

interface SessionProps {
  subjectId: string
  topicFilter: string | null
}

// A single practice run. This component is loaded client-only (via next/dynamic
// ssr:false in page.tsx), so the lazy `useState` initializers below can safely use
// Math.random()/Date.now() without causing a server/client hydration mismatch.
// It is re-mounted (via `key`) whenever subject/topic changes, re-running the shuffle.
export default function PracticeSession({ subjectId, topicFilter }: SessionProps) {
  const router = useRouter()
  const subjectMeta = getSubject(subjectId)

  const [questions] = useState<PreparedQuestion[]>(() => buildPool(subjectId, topicFilter))
  const [startTime] = useState(() => Date.now())
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>([])
  const [answerState, setAnswerState] = useState<AnswerState>(null)
  const [elapsed, setElapsed] = useState(0)

  // Live timer.
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime])

  const currentQ = questions[current]
  const totalQ = questions.length
  const progress = totalQ > 0 ? (current / totalQ) * 100 : 0

  const selectOption = useCallback(
    (text: string) => {
      if (answerState !== null || !currentQ) return
      setAnswerState({ selectedText: text, isCorrect: text === currentQ.correctText })
    },
    [answerState, currentQ]
  )

  const next = useCallback(() => {
    const newAnswers = [...answers, answerState]
    setAnswers(newAnswers)
    setAnswerState(null)

    if (current + 1 >= totalQ) {
      const score = newAnswers.filter((a) => a?.isCorrect).length
      const subjectName = subjectMeta?.name ?? '練習'
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
      router.push('/result')
    } else {
      setCurrent((c) => c + 1)
    }
  }, [answers, answerState, current, totalQ, questions, startTime, router, subjectId, subjectMeta, topicFilter])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // No questions for this subject/topic yet.
  if (totalQ === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl">{subjectMeta?.emoji ?? '📝'}</div>
        <p className="text-slate-400">
          {subjectMeta ? `${subjectMeta.name} 嘅練習` : '呢個練習'}仲未上線。
        </p>
        <Link href="/subjects" className="text-amber-400 hover:text-amber-300 underline">
          睇下其他已上線科目 →
        </Link>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">載入中…</div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">

        {/* Subject label */}
        {subjectMeta && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <span>{subjectMeta.emoji}</span>
            <span className="text-slate-300 font-medium">{subjectMeta.name}</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>
              第 {current + 1} / {totalQ} 題
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
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
              <span>{currentQ.frameworkEmoji}</span>
              {currentQ.frameworkZh}
            </span>
            <span className="text-xs text-slate-600 bg-slate-800 px-3 py-1 rounded-full">
              {currentQ.topicZh}
            </span>
            <span className="text-xs text-slate-600 bg-slate-800 px-3 py-1 rounded-full ml-auto">
              {currentQ.year}
            </span>
          </div>

          {/* Content */}
          <p className="text-lg leading-relaxed mb-8 text-slate-100">
            <MathText>{currentQ.content}</MathText>
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.shuffledOptions.map((opt, idx) => {
              const isCorrectOpt = opt === currentQ.correctText
              const isSelectedWrong =
                answerState !== null && opt === answerState.selectedText && !answerState.isCorrect

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
                  onClick={() => selectOption(opt)}
                  disabled={answerState !== null}
                  className={`w-full text-left flex items-start gap-3 border rounded-xl px-4 py-3 transition-all option-btn ${style}`}
                >
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-400 mt-0.5">
                    {optionLetters[idx]}
                  </span>
                  <span className="leading-relaxed text-sm sm:text-base">
                    <MathText>{opt}</MathText>
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
                    <span className="text-green-400 font-semibold">答啱！</span>
                  </>
                ) : (
                  <>
                    <XCircle size={18} className="text-red-400" />
                    <span className="text-red-400 font-semibold">答錯了——再思考一下</span>
                  </>
                )}
              </div>
              <div className="flex items-start gap-1.5 text-sm text-slate-400 leading-relaxed">
                <Brain size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <MathText>{currentQ.explanation}</MathText>
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={next}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {current + 1 >= totalQ ? '睇結果 🎉' : (
                <>下一題 <ChevronRight size={18} /></>
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
