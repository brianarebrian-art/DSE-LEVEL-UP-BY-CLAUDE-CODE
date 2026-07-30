'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { WALL_TAG_KEYS, WALL_TAG_EMOJI, type WallTagKey } from '@/lib/wall/tags'
import { shouldSurfaceHotline } from '@/lib/wall/safety'

// 審核後台 client（中文單語，founder-only 內部工具）。
interface PendingPost {
  id: string
  author_hash: string
  content: string
  tags: string[]
  created_at: string
}

export default function WallModeration({ reviewer }: { reviewer: string }) {
  const [pending, setPending] = useState<PendingPost[]>([])
  const [doneToday, setDoneToday] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [err, setErr] = useState(false)

  const load = useCallback(async () => {
    setErr(false)
    try {
      const res = await fetch('/api/wall/moderate', { cache: 'no-store' })
      if (!res.ok) throw new Error('load failed')
      const data = await res.json()
      setPending(Array.isArray(data.pending) ? data.pending : [])
      setDoneToday(data.doneToday ?? 0)
    } catch {
      setErr(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function decide(id: string, decision: 'approved' | 'rejected') {
    setBusy(id)
    try {
      const res = await fetch('/api/wall/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, decision }),
      })
      if (res.ok) {
        setPending((prev) => prev.filter((p) => p.id !== id))
        setDoneToday((n) => n + 1)
      }
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <div className="h-24 rounded-xl border border-line bg-surface-raised animate-pulse" />

  if (err) {
    return (
      <p className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold-strong">
        ⚠️ 讀取失敗 —— Supabase 未連通，或 <code>wall_posts</code> 表未建（要先 apply migration 0008）。{/* i18n-exempt: admin 內部工具 */}
      </p>
    )
  }

  return (
    <div>
      <div className="mb-4 flex gap-3">
        <Stat label="待審核" /* i18n-exempt: admin */ value={pending.length} className="text-rose" />
        <Stat label="近 24 小時已處理" /* i18n-exempt: admin */ value={doneToday} className="text-accent" />
      </div>

      {pending.length === 0 ? (
        <div className="rounded-xl border border-line bg-surface-raised p-8 text-center text-sm text-ink-muted">
          🎉 冇嘢等緊審。收工。{/* i18n-exempt: admin */}
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((p) => {
            const flagged = shouldSurfaceHotline(p.content)
            return (
              <div key={p.id} className="rounded-xl border border-line bg-surface-raised p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-ink-faint">
                  <span className="font-medium text-violet">{p.author_hash}</span>
                  <span>·</span>
                  <span>{new Date(p.created_at).toLocaleString('zh-HK', { hour12: false })}</span>
                </div>
                {flagged && (
                  <p className="mb-2 rounded-lg border border-rose/25 bg-rose/[0.06] px-3 py-2 text-xs leading-relaxed text-rose-strong">
                    {/* i18n-exempt: admin 內部工具 */}
                    ⚠️ 呢則留言撞到危機關鍵字。發帖者本人已即時見到熱線卡。請你人手判斷係咪需要格外留神{/* i18n-exempt: admin */}
                    ——【但唔好自動當危機處理／唔好因為呢個 flag 就 reject】。關鍵字只係提示，唔準。{/* i18n-exempt: admin */}
                  </p>
                )}
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{p.content}</p>
                {p.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.tags.map((t) =>
                      WALL_TAG_KEYS.includes(t as WallTagKey) ? (
                        <span key={t} className="rounded-full bg-line px-2 py-0.5 text-xs text-ink-muted">
                          {WALL_TAG_EMOJI[t as WallTagKey]} {t}
                        </span>
                      ) : null,
                    )}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => decide(p.id, 'approved')}
                    disabled={busy === p.id}
                    className="min-h-11 inline-flex items-center gap-1.5 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-40"
                  >
                    <Check size={15} /> 通過並公開{/* i18n-exempt: admin */}
                  </button>
                  <button
                    onClick={() => decide(p.id, 'rejected')}
                    disabled={busy === p.id}
                    className="min-h-11 inline-flex items-center gap-1.5 rounded-lg border border-line-strong px-4 py-2 text-sm text-ink-muted hover:border-rose hover:text-rose disabled:opacity-40"
                  >
                    <X size={15} /> 隱藏{/* i18n-exempt: admin */}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="mt-8 text-xs leading-relaxed text-ink-muted">
        審核員：{reviewer}。呢個係 minor UGC 出街嘅唯一路徑 —— 冇任何自動放行。承諾：每日至少掃一次呢個 queue（同日，唔好拖到 24 小時）。{/* i18n-exempt: admin */}
      </p>
    </div>
  )
}

function Stat({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-raised px-4 py-2">
      <div className={`text-xl font-semibold ${className}`}>{value}</div>
      <div className="text-xs text-ink-muted">{label}</div>
    </div>
  )
}
