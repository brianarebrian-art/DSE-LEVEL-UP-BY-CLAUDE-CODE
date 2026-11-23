'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSubject } from '@/data/subjects'
import { SESSION_SIZE } from '@/lib/entitlements'
import { getSubjectTopics, type Difficulty, type MCQuestion } from '@/data/questions'

const LEVELS: { id: Difficulty; label: string; description: string }[] = [
  { id: 'easy', label: '基礎', description: '鞏固概念與基本應用' },
  { id: 'medium', label: '中階', description: '應用概念及多步推理' },
  { id: 'hard', label: '挑戰', description: '綜合應用與進階思考' },
]

export default function PracticeSetup({
  subjectId,
  topicFilter,
  bank,
  presetDifficulty,
}: {
  subjectId: string
  topicFilter: string | null
  bank: MCQuestion[]
  presetDifficulty?: Difficulty
}) {
  const router = useRouter()
  const counts = {
    easy: bank.filter((question) => question.difficulty === 'easy').length,
    medium: bank.filter((question) => question.difficulty === 'medium').length,
    hard: bank.filter((question) => question.difficulty === 'hard').length,
  }
  const firstAvailable = LEVELS.find((level) => counts[level.id] > 0)?.id ?? 'easy'
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    presetDifficulty && counts[presetDifficulty] > 0 ? presetDifficulty : firstAvailable,
  )
  const [requestedCount, setRequestedCount] = useState(() => Math.min(SESSION_SIZE, Math.max(1, bank.length)))
  const availableCount = counts[selectedDifficulty]
  const selectedCount = Math.min(requestedCount, availableCount)
  const countOptions = [...new Set([
    ...[1, 5, 10, 15, 20].filter((count) => count <= availableCount),
    ...(availableCount > 0 ? [Math.min(availableCount, 20)] : []),
  ])].sort((a, b) => a - b)
  const subjectName = getSubject(subjectId)?.name ?? subjectId
  const topicName = topicFilter
    ? getSubjectTopics(subjectId).find((topic) => topic.id === topicFilter)?.zh ?? topicFilter
    : '全科練習'

  const startPractice = () => {
    if (!selectedCount) return
    const query = new URLSearchParams({
      subject: subjectId,
      difficulty: selectedDifficulty,
      size: String(selectedCount),
    })
    if (topicFilter) query.set('topic', topicFilter)
    router.push(`/practice?${query.toString()}`)
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 pb-28 sm:py-12">
      <Link href={topicFilter ? `/notes/${encodeURIComponent(subjectId)}/${encodeURIComponent(topicFilter)}` : '/notes'} className="inline-flex min-h-11 items-center text-sm text-accent-strong underline underline-offset-4">
        返回課題筆記
      </Link>
      <header className="mt-4">
        <p className="text-sm font-medium text-ink-muted">{subjectName}</p>
        <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">{topicName}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">先選擇難度和題數；開始後會從該課題的題庫抽題。</p>
      </header>

      <fieldset className="mt-8">
        <legend className="text-base font-semibold text-ink">選擇難度</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3" role="group" aria-label="練習難度">
          {LEVELS.map((level) => {
            const isSelected = selectedDifficulty === level.id
            return (
              <button
                key={level.id}
                type="button"
                disabled={counts[level.id] === 0}
                aria-pressed={isSelected}
                onClick={() => {
                  setSelectedDifficulty(level.id)
                  setRequestedCount(Math.min(SESSION_SIZE, counts[level.id]))
                }}
                className={`min-h-20 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong disabled:cursor-not-allowed disabled:opacity-50 ${isSelected ? 'border-accent-strong bg-surface-sunken' : 'border-line bg-surface-raised hover:bg-surface-sunken'}`}
              >
                <span className="block font-semibold text-ink">{level.label}</span>
                <span className="mt-1 block text-xs text-ink-muted">{level.description}</span>
                <span className="mt-2 block text-xs text-ink-muted">可用 {counts[level.id]} 題</span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="practice-question-count" className="text-sm font-semibold text-ink">本次題數</label>
        <select
          id="practice-question-count"
          value={selectedCount || ''}
          disabled={countOptions.length === 0}
          onChange={(event) => setRequestedCount(Number(event.target.value))}
          className="mt-2 block min-h-12 w-full rounded-xl border border-line-strong bg-surface-raised px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
        >
          {countOptions.length === 0 && <option value="">暫無可用題目</option>}
          {countOptions.map((count) => <option key={count} value={count}>{count} 題</option>)}
        </select>
        {availableCount === 0 && <p role="status" className="mt-2 text-sm text-ink-muted">這個課題暫時沒有此難度的題目，請選擇其他級別。</p>}
      </div>

      <button
        type="button"
        onClick={startPractice}
        disabled={selectedCount === 0}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-accent-strong px-5 text-base font-semibold text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong disabled:cursor-not-allowed disabled:opacity-50"
      >
        開始練習（{selectedCount} 題）
      </button>
    </main>
  )
}
