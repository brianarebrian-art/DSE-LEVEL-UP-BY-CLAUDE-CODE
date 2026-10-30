'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export function AiJobActionsClient({ id, status }: { id: string; status: string }) {
  const router = useRouter()
  const [msg, setMsg] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const canRetry = status === 'failed'
  const canCancel = status === 'queued' || status === 'running'
  if (!canRetry && !canCancel) return null

  function act(kind: 'retry' | 'cancel') {
    startTransition(async () => {
      setMsg(null)
      const res = await fetch(`/api/founder/ai/jobs/${encodeURIComponent(id)}/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean }
      if (!res.ok) {
        setMsg(data.error || '操作失敗')
        return
      }
      setMsg(kind === 'retry' ? '已重新排隊' : '已取消')
      router.refresh()
    })
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
      {canRetry && (
        <button type="button" className="text-[var(--fos-cyan)] disabled:opacity-40" disabled={pending} onClick={() => act('retry')}>
          重試
        </button>
      )}
      {canCancel && (
        <button type="button" className="text-[var(--fos-warn)] disabled:opacity-40" disabled={pending} onClick={() => act('cancel')}>
          取消
        </button>
      )}
      {msg && <span className="text-[var(--fos-muted)]">{msg}</span>}
    </div>
  )
}
