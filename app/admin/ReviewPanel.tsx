'use client'

import { useState } from 'react'

// Admin 審核面板互動層（中文單語內部工具，i18n-exempt 全檔適用）。
// 每撳一次「提交」即 POST 一筆去 /api/admin；狀態就地更新，唔會 reload 成頁
//（原 spec 嘅 window.location.reload() 會令審到一半嘅捲動位/展開狀態全失）。

export interface BatchRow {
  id: string
  subject: string
  topic: string
  difficulty: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  trapTypes: string[]
  dnaTag: string
  status: string // pending | approved | rejected
  decidedBy: string
}

export interface Batch {
  batch: string
  subject: string
  rows: BatchRow[]
}

export interface HistoryRow {
  batch: string
  draft_id: string
  subject: string
  topic: string | null
  decision: string
  comment: string | null
  reviewer_name: string | null
  created_at: string
}

// 草稿銀碼以 \$ 逃逸（LaTeX 閘要求）；顯示層還原做 $，唔郁底層數據。
const unesc = (s: string) => s.replace(/\\\$/g, '$')

const DIFF_ZH: Record<string, string> = { basic: '基礎', intermediate: '核心', hard: '進階' } // i18n-exempt: admin
const STATUS_ZH: Record<string, string> = { pending: '待審', approved: '已通過', rejected: '已退回' } // i18n-exempt: admin

export function ReviewPanel({ batches, history, dbOk }: { batches: Batch[]; history: HistoryRow[]; dbOk: boolean }) {
  return (
    <div>
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-neon-cyan">📋 待審隊列{/* i18n-exempt: admin */}</h2>
        {batches.length === 0 && (
          <p className="text-sm text-text-secondary">而家冇任何草稿批次 —— 出咗新草稿先會喺度出現。{/* i18n-exempt: admin */}</p>
        )}
        {batches.map((b) => (
          <BatchBlock key={b.batch} batch={b} dbOk={dbOk} />
        ))}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-neon-purple">📜 審核歷史（雲端最新 200 筆）{/* i18n-exempt: admin */}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-text-secondary">未有雲端紀錄。{/* i18n-exempt: admin */}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-dark-2 text-xs text-text-secondary">
                <tr>
                  <th className="px-3 py-2">時間{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">批次 / 題目{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">決定{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">覆核人{/* i18n-exempt: admin */}</th>
                  <th className="px-3 py-2">備註{/* i18n-exempt: admin */}</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-text-secondary">{h.created_at?.slice(0, 16).replace('T', ' ')}</td>
                    <td className="px-3 py-2">{h.batch} · {h.draft_id}</td>
                    <td className="px-3 py-2">{STATUS_ZH[h.decision] ?? h.decision}</td>
                    <td className="px-3 py-2">{h.reviewer_name ?? '—'}</td>
                    <td className="px-3 py-2 text-xs text-text-secondary">{h.comment ?? ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function BatchBlock({ batch, dbOk }: { batch: Batch; dbOk: boolean }) {
  const pending = batch.rows.filter((r) => r.status === 'pending').length
  return (
    <div className="mb-6 rounded-2xl border border-white/10 bg-bg-dark-2/60 p-4">
      <h3 className="mb-3 font-semibold">
        {batch.batch}
        <span className="ml-2 text-sm text-text-secondary">
          {batch.subject} · {batch.rows.length} 題 · 待審 {pending}{/* i18n-exempt: admin */}
        </span>
      </h3>
      {batch.rows.map((r) => (
        <ReviewCard key={r.id} batchName={batch.batch} row={r} dbOk={dbOk} />
      ))}
    </div>
  )
}

function ReviewCard({ batchName, row, dbOk }: { batchName: string; row: BatchRow; dbOk: boolean }) {
  const [status, setStatus] = useState(row.status)
  const [decidedBy, setDecidedBy] = useState(row.decidedBy)
  const [choice, setChoice] = useState<'approved' | 'rejected' | 'pending' | null>(null)
  const [comment, setComment] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [open, setOpen] = useState(row.status === 'pending')

  async function submit() {
    if (!choice || busy) return
    setBusy(true)
    setErr('')
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: batchName, draft_id: row.id, subject: row.subject, topic: row.topic, decision: choice, comment }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus(choice)
      setDecidedBy('你') // i18n-exempt: admin
      setOpen(false)
    } catch {
      setErr('提交失敗 —— 檢查網絡或 Supabase 配置後再試。') // i18n-exempt: admin
    } finally {
      setBusy(false)
    }
  }

  const statusChip =
    status === 'approved' ? 'text-green-400 border-green-400/40' : status === 'rejected' ? 'text-neon-pink border-neon-pink/40' : 'text-neon-yellow border-neon-yellow/40'

  return (
    <div className="mb-3 rounded-xl border border-white/10 bg-bg-dark p-4">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center gap-2 text-left">
        <span className={`rounded-full border px-2 py-0.5 text-xs ${statusChip}`}>{STATUS_ZH[status] ?? status}</span>
        {row.difficulty && <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-text-secondary">{DIFF_ZH[row.difficulty] ?? row.difficulty}</span>}
        {row.dnaTag && <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-text-secondary">🧠 {row.dnaTag}</span>}
        <span className="min-w-0 flex-1 truncate text-sm">{row.id} · {unesc(row.question)}</span>
        <span className="text-text-secondary">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="mt-3">
          <p className="mb-3 leading-relaxed">{unesc(row.question)}</p>
          <div className="mb-3 space-y-2">
            {row.options.map((opt, i) => (
              <div key={i} className={`rounded-lg border p-3 text-sm ${i === row.correctIndex ? 'border-green-500/50 bg-green-500/10' : 'border-white/10'}`}>
                {unesc(opt)}
                {i === row.correctIndex && <span className="ml-2 text-xs text-green-400">✓ 正解{/* i18n-exempt: admin */}</span>}
                {row.trapTypes[i] && row.trapTypes[i] !== 'correct' && (
                  <span className="ml-2 rounded bg-white/5 px-1.5 py-0.5 text-xs text-text-secondary">{row.trapTypes[i]}</span>
                )}
              </div>
            ))}
          </div>
          <div className="mb-4 rounded-lg border border-white/10 bg-bg-dark-2/60 p-3 text-sm leading-relaxed">
            <span className="mb-1 block text-xs text-text-secondary">解析{/* i18n-exempt: admin */}</span>
            {unesc(row.explanation)}
          </div>

          {status === 'pending' ? (
            <div className="flex flex-wrap items-center gap-2">
              <DecisionBtn label="✅ 通過" /* i18n-exempt: admin */ active={choice === 'approved'} activeCls="bg-green-600 text-white" onClick={() => setChoice('approved')} />
              <DecisionBtn label="❌ 退回" /* i18n-exempt: admin */ active={choice === 'rejected'} activeCls="bg-neon-pink text-white" onClick={() => setChoice('rejected')} />
              <DecisionBtn label="⏸️ 暫緩" /* i18n-exempt: admin */ active={choice === 'pending'} activeCls="bg-neon-yellow text-black" onClick={() => setChoice('pending')} />
              <input
                type="text"
                placeholder="備註（可選）" // i18n-exempt: admin
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-w-40 flex-1 rounded-lg border border-white/10 bg-bg-dark-2 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={submit}
                disabled={!choice || busy || !dbOk}
                className="rounded-lg bg-neon-cyan px-5 py-2 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                {busy ? '提交中…' : '提交決定'}{/* i18n-exempt: admin */}
              </button>
              {err && <span className="text-xs text-neon-pink">{err}</span>}
            </div>
          ) : (
            <p className="flex items-center gap-3 text-sm text-text-secondary">
              <span>已由 {decidedBy || '本地審批'} 裁決。{/* i18n-exempt: admin */}</span>
              <button type="button" onClick={() => setStatus('pending')} className="rounded-lg bg-white/5 px-3 py-1 text-xs hover:bg-white/10">
                🔄 重新裁決（新決定取最新）{/* i18n-exempt: admin */}
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

function DecisionBtn({ label, active, activeCls, onClick }: { label: string; active: boolean; activeCls: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200 ${active ? activeCls : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
    >
      {label}
    </button>
  )
}
