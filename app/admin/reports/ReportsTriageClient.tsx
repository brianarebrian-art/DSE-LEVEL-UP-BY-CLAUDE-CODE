'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

type Row = {
  id: number
  created_at: string
  question_id: string
  category: string
  locale: string
  status: string
  priority_score: number
  admin_note: string | null
}

type Rev = {
  id: string
  question_id: string
  revision_status: string
  ai_confidence: number | null
  change_summary: string
  created_at: string
}

export default function ReportsTriageClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [rows, setRows] = useState<Row[]>([])
  const [revs, setRevs] = useState<Rev[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | string | null>(null)

  const load = useCallback(async () => {
    setError(null)
    try {
      const [r, v] = await Promise.all([
        fetch('/api/admin/reports?status=open').then((x) => x.json()),
        fetch('/api/admin/revisions?status=queue').then((x) => x.json()),
      ])
      if (!Array.isArray(r.rows)) throw new Error('reports')
      setRows(r.rows)
      setRevs(Array.isArray(v.rows) ? v.rows : [])
    } catch {
      setError(en ? 'Could not load queue.' : '載入佇列失敗。')
    }
  }, [en])

  useEffect(() => {
    void load()
  }, [load])

  async function patchReport(id: number, patch: Record<string, unknown>) {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      })
      if (!res.ok) throw new Error('patch')
      await load()
    } catch {
      setError(en ? 'Update failed.' : '更新失敗。')
    } finally {
      setBusyId(null)
    }
  }

  async function draftFromReport(row: Row) {
    setBusyId(row.id)
    try {
      const res = await fetch('/api/admin/revisions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          questionId: row.question_id,
          sourceReportId: row.id,
          revisionStatus: 'human_review',
          aiConfidence: 0.4,
          changeSummary: en
            ? `Draft from student report (${row.category}). Human must verify before any bank edit.`
            : `由學生回報（${row.category}）產生草稿。未人工覆核前唔准改題庫。`,
          diffJson: {
            rationale: 'Grouped from category-only report; no student free-text stored.',
            category: row.category,
          },
        }),
      })
      if (!res.ok) throw new Error('draft')
      await patchReport(row.id, { status: 'ai_drafted', priority_score: Math.max(row.priority_score, 40) })
    } catch {
      setError(en ? 'Could not create AI draft stub.' : '建立 AI 草稿失敗。')
      setBusyId(null)
    }
  }

  async function decideRev(id: string, decision: 'approve' | 'reject') {
    setBusyId(id)
    try {
      const res = await fetch('/api/admin/revisions', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      })
      if (!res.ok) throw new Error('decide')
      await load()
    } catch {
      setError(en ? 'Decision failed.' : '決定寫入失敗。')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-ink">
          {en ? 'Question report triage' : '題目回報 triage'}
        </h1>
        <Link href="/admin/quality" className="text-sm text-accent hover:underline">
          {en ? 'Quality desk' : '質素覆核台'}
        </Link>
      </div>
      <p className="text-sm text-ink-muted mb-6 leading-relaxed">
        {en
          ? 'Students only send a category — never free-text on our servers. AI drafts always need human approval before any bank publish.'
          : '學生只送類別，伺服器唔收自由文字。AI 草稿一定要人工批准先可以考慮改題庫。'}
      </p>
      {error && (
        <p className="text-sm text-rose mb-4" role="alert">
          {error}
        </p>
      )}

      <h2 className="text-lg font-bold text-ink mb-3">{en ? 'Open reports' : '未處理回報'}</h2>
      <ul className="space-y-3 mb-10">
        {rows.length === 0 && (
          <li className="text-sm text-ink-muted">{en ? 'Queue empty.' : '佇列係空嘅。'}</li>
        )}
        {rows.map((row) => (
          <li key={row.id} className="border border-line rounded-xl p-4 bg-surface-raised">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-mono text-ink">{row.question_id}</span>
              <span className="text-ink-muted">{row.status}</span>
            </div>
            <p className="text-sm text-ink-soft mt-1">
              {row.category} · {row.locale} · priority {row.priority_score}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                disabled={busyId === row.id}
                className="min-h-11 px-3 py-2 text-sm rounded-xl border border-line-strong"
                onClick={() => patchReport(row.id, { status: 'triaged', priority_score: 30 })}
              >
                {en ? 'Triaged' : '已分流'}
              </button>
              <button
                type="button"
                disabled={busyId === row.id}
                className="min-h-11 px-3 py-2 text-sm rounded-xl border border-accent/40 text-accent"
                onClick={() => void draftFromReport(row)}
              >
                {en ? 'Create AI draft stub' : '建立 AI 草稿'}
              </button>
              <button
                type="button"
                disabled={busyId === row.id}
                className="min-h-11 px-3 py-2 text-sm rounded-xl border border-line-strong"
                onClick={() => patchReport(row.id, { status: 'fixed' })}
              >
                {en ? 'Mark fixed' : '標為已修'}
              </button>
              <button
                type="button"
                disabled={busyId === row.id}
                className="min-h-11 px-3 py-2 text-sm rounded-xl border border-rose/40 text-rose"
                onClick={() => patchReport(row.id, { status: 'rejected' })}
              >
                {en ? 'Reject' : '拒絕'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold text-ink mb-3">{en ? 'Revision queue' : '修訂佇列'}</h2>
      <ul className="space-y-3">
        {revs.length === 0 && (
          <li className="text-sm text-ink-muted">{en ? 'No drafts waiting.' : '未有待審草稿。'}</li>
        )}
        {revs.map((rev) => (
          <li key={rev.id} className="border border-line rounded-xl p-4 bg-surface-raised">
            <div className="flex flex-wrap justify-between gap-2 text-sm">
              <span className="font-mono text-ink">{rev.question_id}</span>
              <span className="text-ink-muted">{rev.revision_status}</span>
            </div>
            <p className="text-sm text-ink-soft mt-2 leading-relaxed">{rev.change_summary}</p>
            {rev.ai_confidence != null && (
              <p className="text-xs text-ink-muted mt-1">AI confidence: {rev.ai_confidence}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                type="button"
                disabled={busyId === rev.id}
                className="min-h-11 px-3 py-2 text-sm rounded-xl bg-accent-strong text-on-accent font-semibold"
                onClick={() => void decideRev(rev.id, 'approve')}
              >
                {en ? 'Approve (still not auto-published)' : '批准（仍唔會自動上架）'}
              </button>
              <button
                type="button"
                disabled={busyId === rev.id}
                className="min-h-11 px-3 py-2 text-sm rounded-xl border border-rose/40 text-rose"
                onClick={() => void decideRev(rev.id, 'reject')}
              >
                {en ? 'Reject draft' : '拒絕草稿'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
