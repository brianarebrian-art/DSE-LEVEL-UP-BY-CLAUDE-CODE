'use client'

import { SUS_STATEMENTS } from '@/lib/research/sus'
import { LIKERT_HINT, NPS_HINT, TASK_LABEL } from '@/lib/research/labels'
import type { AnswerValue, Question, TaskValue } from '@/lib/research/types'
import { cx } from '@/components/research/ui'

function Choice({
  checked,
  name,
  label,
  onChange,
  type,
}: {
  checked: boolean
  name: string
  label: string
  onChange: () => void
  type: 'radio' | 'checkbox'
}) {
  return (
    <label className={cx(
      'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-base',
      checked ? 'border-accent bg-surface-sunken' : 'border-line-strong bg-surface-raised',
    )}>
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-accent"
      />
      <span className="text-ink">{label}</span>
      {checked ? <span className="ml-auto text-xs font-medium text-accent">已選</span> : null}
    </label>
  )
}

export function QuestionField({
  question,
  value,
  onChange,
  error,
}: {
  question: Question
  value: AnswerValue | undefined
  onChange: (next: AnswerValue | undefined) => void
  error?: string | null
}) {
  const helpId = `${question.id}-help`
  const errorId = `${question.id}-error`
  const describedBy = [question.helpText ? helpId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined
  const scale = (start: number, end: number, hint: string, selected: number | null, apply: (score: number) => void) => (
    <div>
      <p id={helpId} className="text-sm leading-6 text-ink-soft">{question.helpText || hint}</p>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-describedby={describedBy}>
        {Array.from({ length: end - start + 1 }, (_, offset) => start + offset).map((score) => (
          <label key={score} className={cx(
            'flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border px-2 text-base font-medium',
            selected === score ? 'border-accent bg-accent text-on-accent' : 'border-line-strong bg-surface-raised text-ink',
          )}>
            <input
              type="radio"
              name={`${question.id}-scale`}
              className="sr-only"
              checked={selected === score}
              onChange={() => apply(score)}
            />
            {score}
            <span className="sr-only">{selected === score ? '，已選' : ''}</span>
          </label>
        ))}
      </div>
    </div>
  )

  let body = null
  if (question.type === 'single' && (value == null || value.type === 'single')) {
    body = (
      <div className="space-y-2">
        {question.options.map((option) => (
          <Choice
            key={option.id}
            type="radio"
            name={question.id}
            label={option.label}
            checked={value?.type === 'single' && value.optionId === option.id}
            onChange={() => onChange({ type: 'single', optionId: option.id })}
          />
        ))}
      </div>
    )
  } else if (question.type === 'multiple' && (value == null || value.type === 'multiple')) {
    const selected = value?.type === 'multiple' ? value.optionIds : []
    body = (
      <div className="space-y-2">
        {question.options.map((option) => (
          <Choice
            key={option.id}
            type="checkbox"
            name={question.id}
            label={option.label}
            checked={selected.includes(option.id)}
            onChange={() => {
              const optionIds = selected.includes(option.id)
                ? selected.filter((id) => id !== option.id)
                : [...selected, option.id]
              onChange(optionIds.length ? { type: 'multiple', optionIds } : undefined)
            }}
          />
        ))}
      </div>
    )
  } else if (question.type === 'likert' && (value == null || value.type === 'likert')) {
    body = scale(1, 5, LIKERT_HINT, value?.type === 'likert' ? value.score : null, (score) => onChange({ type: 'likert', score }))
  } else if (question.type === 'nps' && (value == null || value.type === 'nps')) {
    body = scale(0, 10, NPS_HINT, value?.type === 'nps' ? value.score : null, (score) => onChange({ type: 'nps', score }))
  } else if (question.type === 'task' && (value == null || value.type === 'task')) {
    body = (
      <div className="space-y-2">
        {(Object.keys(TASK_LABEL) as TaskValue[]).map((task) => (
          <Choice
            key={task}
            type="radio"
            name={question.id}
            label={TASK_LABEL[task]}
            checked={value?.type === 'task' && value.value === task}
            onChange={() => onChange({ type: 'task', value: task })}
          />
        ))}
      </div>
    )
  } else if (question.type === 'text' && (value == null || value.type === 'text')) {
    const text = value?.type === 'text' ? value.text : ''
    body = (
      <div>
        <textarea
          value={text}
          onChange={(event) => onChange(event.target.value ? { type: 'text', text: event.target.value } : undefined)}
          rows={5}
          aria-describedby={describedBy}
          className="w-full rounded-lg border border-line-strong bg-surface-raised px-3 py-2 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <p aria-live="polite" className="mt-1 text-sm text-ink-muted">已寫 {text.length} 字</p>
      </div>
    )
  } else if (question.type === 'sus' && (value == null || value.type === 'sus')) {
    const scores = value?.type === 'sus' ? value.scores : Array.from({ length: 10 }, () => 0)
    body = (
      <ol className="space-y-4">
        {SUS_STATEMENTS.map((statement, index) => (
          <li key={statement} className="rounded-lg border border-line p-3">
            <p className="text-sm leading-6 text-ink">{index + 1}. {statement}</p>
            <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={statement}>
              {[1, 2, 3, 4, 5].map((score) => (
                <label key={score} className={cx(
                  'flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium',
                  scores[index] === score ? 'border-accent bg-accent text-on-accent' : 'border-line-strong bg-surface-raised text-ink',
                )}>
                  <input
                    type="radio"
                    name={`${question.id}-sus-${index}`}
                    className="sr-only"
                    checked={scores[index] === score}
                    onChange={() => {
                      const next = scores.slice()
                      next[index] = score
                      onChange({ type: 'sus', scores: next })
                    }}
                  />
                  {score}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <fieldset aria-describedby={describedBy} aria-invalid={error ? true : undefined} className="min-w-0">
      <legend className="text-lg font-semibold leading-7 text-ink">
        {question.prompt || '未命名題目'}
        {question.required ? <span className="ml-2 text-sm font-medium text-warning">必填</span> : <span className="ml-2 text-sm font-normal text-ink-muted">可選</span>}
      </legend>
      {question.helpText && question.type !== 'likert' && question.type !== 'nps' ? (
        <p id={helpId} className="mt-2 text-sm leading-6 text-ink-soft">{question.helpText}</p>
      ) : null}
      <div className="mt-4">{body}</div>
      {error ? <p id={errorId} className="mt-3 text-sm font-medium text-error">{error}</p> : null}
    </fieldset>
  )
}
