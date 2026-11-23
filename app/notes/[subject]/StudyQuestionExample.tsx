'use client'

import MathText from '@/components/MathText'
import type { MCQuestion } from '@/data/questions'

type StudyQuestionExampleProps = {
  question: MCQuestion
  locale: 'zh' | 'en'
  title: string
  description: string
}

export default function StudyQuestionExample({ question, locale, title, description }: StudyQuestionExampleProps) {
  const isEnglish = locale === 'en'
  const options = isEnglish && question.optionsEn?.length ? question.optionsEn : question.options
  const steps = isEnglish && question.stepsEn?.length ? question.stepsEn : question.steps
  const explanation = isEnglish ? question.explanationEn ?? question.explanation : question.explanation
  const answer = options[question.correctIndex]

  return (
    <section className="mt-5 rounded-xl border border-line bg-surface-raised p-4" aria-labelledby={`example-${question.id}`}>
      <h3 id={`example-${question.id}`} className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{description}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft"><MathText>{isEnglish ? question.contentEn ?? question.content : question.content}</MathText></p>
      <ol className="mt-3 list-[upper-alpha] space-y-2 pl-6 text-sm leading-relaxed text-ink-soft" aria-label={isEnglish ? 'Answer options' : '題目選項'}>
        {options.map((option, index) => (
          <li key={`${question.id}-${index}`} className="pl-1"><MathText>{option}</MathText></li>
        ))}
      </ol>
      <details className="mt-4 rounded-lg bg-surface-sunken p-3">
        <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold text-accent-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong">
          {isEnglish ? 'Reveal the answer and explanation' : '查看答案及解析'}
        </summary>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-soft">
          <p><strong className="text-ink">{isEnglish ? 'Correct answer:' : '正確答案：'}</strong> <MathText>{answer ?? '—'}</MathText></p>
          {steps?.length ? (
            <>
              <p className="font-medium text-ink">{isEnglish ? 'Solution steps' : '解題步驟'}</p>
              <ol className="list-decimal space-y-1 pl-5">
                {steps.map((step, index) => <li key={`${question.id}-step-${index}`}><MathText>{step}</MathText></li>)}
              </ol>
            </>
          ) : (
            <p><strong className="text-ink">{isEnglish ? 'Reasoning:' : '解題思路：'}</strong> <MathText>{explanation}</MathText></p>
          )}
        </div>
      </details>
    </section>
  )
}
