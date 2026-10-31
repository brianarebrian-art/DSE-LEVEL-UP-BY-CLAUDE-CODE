'use client'

import { useState, useTransition } from 'react'
import {
  previewQuestionStatusBatch,
  confirmQuestionStatusBatch,
} from '@/lib/founder/actions'

/**
 * 批量上下架：先 preview 攞 confirmationToken，再 confirm 寫入 founder_publish_batches。
 * 唔直接改靜態題庫檔。表未 migrate 時 confirm 會回 db error —— UI 如實顯示。
 */
export default function BatchStatusActions() {
  const [raw, setRaw] = useState('')
  const [nextStatus, setNextStatus] = useState<'published' | 'withdrawn'>('withdrawn')
  const [token, setToken] = useState<string | null>(null)
  const [ids, setIds] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function parseIds(text: string): string[] {
    return [
      ...new Set(
        text
          .split(/[\s,，、;；]+/)
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ].slice(0, 200)
  }

  function onPreview() {
    const nextIds = parseIds(raw)
    setMessage(null)
    setToken(null)
    setIds([])
    startTransition(async () => {
      const res = await previewQuestionStatusBatch({ ids: nextIds, nextStatus })
      if (!res.ok) {
        setMessage(`預覽失敗：${res.error ?? 'unknown'}`)
        return
      }
      setIds(res.ids ?? nextIds)
      setToken(res.confirmationToken ?? null)
      setMessage(`預覽 OK：${res.count ?? nextIds.length} 題 → ${nextStatus}。請再確認。`)
    })
  }

  function onConfirm() {
    if (!token || !ids.length) return
    setMessage(null)
    startTransition(async () => {
      const res = await confirmQuestionStatusBatch({
        ids,
        nextStatus,
        confirmationToken: token,
      })
      if (!res.ok) {
        setMessage(`確認失敗：${res.error ?? 'unknown'}（靜態題庫未改動）`)
        setToken(null)
        return
      }
      setMessage(`已記錄批次：${res.count ?? ids.length} 題（pending／draft；唔會原地改題庫檔）。`)
      setToken(null)
      setIds([])
      setRaw('')
    })
  }

  return (
    <div className="fos-panel space-y-3 p-4">
      <label className="block text-xs text-[var(--fos-muted)]" htmlFor="fos-batch-ids">
        題號清單（逗號／換行分隔，最多 200）
      </label>
      <textarea
        id="fos-batch-ids"
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value)
          setToken(null)
        }}
        rows={4}
        className="w-full rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-3 py-2 font-mono text-sm"
        placeholder="m1_rep_0001, phy_rep_0012…"
      />
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label="目標狀態"
          className="rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-2 py-2 text-sm"
          value={nextStatus}
          onChange={(e) => {
            setNextStatus(e.target.value as 'published' | 'withdrawn')
            setToken(null)
          }}
        >
          <option value="withdrawn">withdrawn（收起）</option>
          <option value="published">published（發佈意圖）</option>
        </select>
        <button
          type="button"
          disabled={pending || !raw.trim()}
          onClick={onPreview}
          className="rounded-lg border border-[var(--fos-cyan)] px-3 py-2 text-sm text-[var(--fos-cyan)] disabled:opacity-40"
        >
          預覽
        </button>
        <button
          type="button"
          disabled={pending || !token}
          onClick={onConfirm}
          className="rounded-lg bg-[var(--fos-cyan)] px-3 py-2 text-sm font-medium text-[var(--fos-bg)] disabled:opacity-40"
        >
          確認寫入批次
        </button>
      </div>
      {message ? <p className="text-sm text-[var(--fos-ink)]">{message}</p> : null}
      {pending ? <p className="text-xs text-[var(--fos-muted)]">處理中…</p> : null}
    </div>
  )
}
