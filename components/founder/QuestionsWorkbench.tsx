'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import type { QuestionListResult } from '@/lib/founder/questions'

type Query = {
  q: string
  subject: string
  difficulty: string
  page: number
  sort: 'id' | 'topic' | 'difficulty'
}

export default function QuestionsWorkbench({
  initial,
  query,
}: {
  initial: QuestionListResult
  query: Query
}) {
  const router = useRouter()
  const [q, setQ] = useState(query.q)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const t = setTimeout(() => {
      if (q === query.q) return
      push({ ...query, q, page: 1 })
    }, 300)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce only on q
  }, [q])

  function push(next: Query) {
    const params = new URLSearchParams()
    if (next.q) params.set('q', next.q)
    if (next.subject) params.set('subject', next.subject)
    if (next.difficulty) params.set('difficulty', next.difficulty)
    if (next.page > 1) params.set('page', String(next.page))
    if (next.sort !== 'id') params.set('sort', next.sort)
    startTransition(() => {
      router.push(`/founder/questions?${params.toString()}`)
    })
  }

  const totalPages = Math.max(1, Math.ceil(initial.total / initial.pageSize))

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="fos-q-search">
          搜尋題目
        </label>
        <input
          id="fos-q-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋題號／課題／題幹…"
          className="min-w-[12rem] flex-1 rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-3 py-2 text-sm"
        />
        <select
          aria-label="科目"
          className="rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-2 py-2 text-sm"
          value={query.subject}
          onChange={(e) => push({ ...query, subject: e.target.value, page: 1 })}
        >
          <option value="">全部活躍科目</option>
          {initial.subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}（{s.count}）
            </option>
          ))}
        </select>
        <select
          aria-label="難度"
          className="rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-2 py-2 text-sm"
          value={query.difficulty}
          onChange={(e) => push({ ...query, difficulty: e.target.value, page: 1 })}
        >
          <option value="">全部難度</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
        <select
          aria-label="排序"
          className="rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-2 py-2 text-sm"
          value={query.sort}
          onChange={(e) => push({ ...query, sort: e.target.value as Query['sort'], page: 1 })}
        >
          <option value="id">題號</option>
          <option value="topic">課題</option>
          <option value="difficulty">難度</option>
        </select>
      </div>

      <p className="text-xs text-[var(--fos-muted)]">
        共 <span className="tabular-nums text-[var(--fos-ink)]">{initial.total.toLocaleString('zh-HK')}</span> 題
        {pending ? ' · 更新中…' : ''} · 來源 {initial.source}
      </p>

      <div className="fos-panel overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[var(--fos-muted)]">
            <tr>
              <th className="px-3 py-2">題號</th>
              <th className="px-3 py-2">科目</th>
              <th className="px-3 py-2">課題</th>
              <th className="px-3 py-2">難度</th>
              <th className="px-3 py-2">題幹預覽</th>
              <th className="px-3 py-2">狀態</th>
            </tr>
          </thead>
          <tbody>
            {initial.rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-[var(--fos-muted)]">
                  冇符合條件嘅題目（空結果 ≠ 題庫為 0）。
                </td>
              </tr>
            ) : (
              initial.rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--fos-border-soft)] hover:bg-[color-mix(in_srgb,var(--fos-cyan)_5%,transparent)]">
                  <td className="px-3 py-2">
                    <Link href={`/founder/questions/${encodeURIComponent(row.id)}`} className="text-[var(--fos-cyan)]">
                      {row.id}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-[var(--fos-muted)]">{row.subjectName}</td>
                  <td className="px-3 py-2">{row.topic || '—'}</td>
                  <td className="px-3 py-2 tabular-nums">{row.difficulty || '—'}</td>
                  <td className="max-w-xs truncate px-3 py-2 text-[var(--fos-muted)]">{row.stemPreview}</td>
                  <td className="px-3 py-2 text-xs text-[var(--fos-ok)]">已發佈</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          className="rounded border border-[var(--fos-border-soft)] px-3 py-1 disabled:opacity-40"
          disabled={query.page <= 1}
          onClick={() => push({ ...query, page: query.page - 1 })}
        >
          上一頁
        </button>
        <span className="tabular-nums text-[var(--fos-muted)]">
          {query.page} / {totalPages}
        </span>
        <button
          type="button"
          className="rounded border border-[var(--fos-border-soft)] px-3 py-1 disabled:opacity-40"
          disabled={query.page >= totalPages}
          onClick={() => push({ ...query, page: query.page + 1 })}
        >
          下一頁
        </button>
      </div>
    </div>
  )
}
