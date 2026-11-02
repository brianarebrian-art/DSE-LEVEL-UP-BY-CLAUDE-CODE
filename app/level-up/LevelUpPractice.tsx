'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, CircleAlert, RotateCcw, Sparkles } from 'lucide-react'

type Question = {
  prompt: string
  topic: string
  options: string[]
  answer: number
  explanation: string
}

const questions: Question[] = [
  {
    prompt: 'A student says: “The graph is steeper, so its y-intercept must be larger.” Which response is most accurate?',
    topic: 'Reading graphs',
    options: ['Always true', 'Only true when the slope is positive', 'Not necessarily true', 'Only true for straight lines'],
    answer: 2,
    explanation: '斜率描述線的傾斜程度，y 截距描述線同 y 軸交點，兩者係不同概念。',
  },
  {
    prompt: 'Which change would make a conclusion from a survey more reliable?',
    topic: 'Evidence and reasoning',
    options: ['Ask fewer people', 'Use a more representative sample', 'Remove unexpected answers', 'Only ask close friends'],
    answer: 1,
    explanation: '樣本越能代表目標群體，結論通常越可靠；唔應該因為答案出乎預期就刪走。',
  },
  {
    prompt: 'A quantity increases from 80 to 100. What is the percentage increase?',
    topic: 'Percentage change',
    options: ['20%', '25%', '80%', '125%'],
    answer: 1,
    explanation: '增加量係 20，再除以原本的 80：20 ÷ 80 = 25%。',
  },
]

export default function LevelUpPractice() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(boolean | null)[]>([])
  const [completed, setCompleted] = useState(false)
  const question = questions[current]
  const answered = selected !== null
  const score = useMemo(() => answers.filter(Boolean).length, [answers])

  function chooseOption(index: number) {
    if (answered) return
    setSelected(index)
  }

  function goNext() {
    if (selected === null) return
    const nextAnswers = [...answers]
    nextAnswers[current] = selected === question.answer
    setAnswers(nextAnswers)
    if (current === questions.length - 1) {
      setCompleted(true)
      return
    }
    setCurrent((value) => value + 1)
    setSelected(null)
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setCompleted(false)
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-[100svh] bg-surface px-4 py-5 text-ink sm:px-6">
        <div className="mx-auto flex min-h-[calc(100svh-2.5rem)] max-w-xl flex-col justify-center gap-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent">
            <Sparkles aria-hidden />
            一節完成
          </div>
          <section className="rounded-[1.75rem] border border-line bg-surface-raised p-6 shadow-sm sm:p-8">
            <p className="text-sm text-ink-muted">今次學習節</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">你答對 {score}／{questions.length} 題</h1>
            <p className="mt-3 text-base leading-7 text-ink-soft">
              {percentage >= 67 ? '基本概念掌握得唔錯，下一步可以集中處理仍然唔穩嘅課題。' : '今次唔需要追求滿分，先將錯題修正，再用短節奏重做一次。'}
            </p>
            <div className="mt-6 rounded-2xl bg-surface-sunken p-4">
              <p className="text-sm font-semibold text-ink">下一步建議</p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">重溫「Evidence and reasoning」，再做 3 題錯題修正。</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={restart} className="pressable inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-strong px-4 text-sm font-semibold text-on-accent hover:bg-accent-hover">
                <RotateCcw aria-hidden /> 再做一次
              </button>
              <Link href="/progress" className="pressable inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-line-strong px-4 text-sm font-semibold text-ink hover:bg-surface-sunken">
                睇學習進度 <ArrowRight aria-hidden />
              </Link>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100svh] bg-surface px-4 py-4 text-ink sm:px-6 sm:py-6">
      <div className="mx-auto flex min-h-[calc(100svh-2rem)] max-w-xl flex-col">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" aria-label="返回首頁" className="pressable inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line text-ink-muted hover:bg-surface-sunken">
            <ArrowLeft aria-hidden />
          </Link>
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-accent">DSE LEVEL UP</p>
            <p className="mt-1 text-sm text-ink-muted">3 題短練習 · 示範版</p>
          </div>
          <span className="min-w-11 text-right text-sm font-semibold text-ink-muted">{current + 1}/{questions.length}</span>
        </header>

        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-surface-sunken" aria-label={`已完成 ${current} 題`}>
          <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${(current / questions.length) * 100}%` }} />
        </div>

        <section className="mt-8 flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-surface-sunken px-3 py-1 text-xs font-semibold text-ink-muted">{question.topic}</span>
            <span className="text-xs text-ink-muted">唔使計時</span>
          </div>
          <h1 className="mt-5 text-[1.65rem] font-semibold leading-tight tracking-tight sm:text-3xl">{question.prompt}</h1>

          <div className="mt-7 flex flex-col gap-3" role="radiogroup" aria-label="答案選項">
            {question.options.map((option, index) => {
              const isSelected = selected === index
              const isCorrect = answered && index === question.answer
              const isWrong = answered && isSelected && !isCorrect
              return (
                <button key={option} type="button" onClick={() => chooseOption(index)} disabled={answered} aria-pressed={isSelected} className={`pressable flex min-h-14 items-center gap-3 rounded-2xl border px-4 text-left text-base transition-colors ${isCorrect ? 'border-accent bg-accent/10' : isWrong ? 'border-rose bg-rose/10' : isSelected ? 'border-accent bg-accent/10' : 'border-line-strong bg-surface-raised hover:border-accent'}`}>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-sm font-semibold text-ink-muted">{String.fromCharCode(65 + index)}</span>
                  <span className="flex-1 leading-6">{option}</span>
                  {isCorrect && <Check aria-hidden className="text-accent" />}
                  {isWrong && <CircleAlert aria-hidden className="text-rose" />}
                </button>
              )
            })}
          </div>

          {answered && (
            <aside className="mt-5 rounded-2xl border border-line bg-surface-sunken p-4" aria-live="polite">
              <p className="text-sm font-semibold text-ink">{selected === question.answer ? '判斷啱咗' : '先唔緊要，睇下點解'}</p>
              <p className="mt-1 text-sm leading-6 text-ink-muted">{question.explanation}</p>
            </aside>
          )}

          <div className="mt-auto pt-6">
            <button type="button" onClick={goNext} disabled={!answered} className="pressable inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-accent-strong px-5 text-base font-semibold text-on-accent hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-45">
              {current === questions.length - 1 ? '睇今次結果' : '下一題'} <ArrowRight aria-hidden />
            </button>
            <p className="mt-3 text-center text-xs text-ink-muted">答錯唔代表你唔識；每題都會講清楚判斷位。</p>
          </div>
        </section>
      </div>
    </div>
  )
}
