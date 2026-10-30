'use client'

import Link from 'next/link'
import { useEffect, useId, useState, useTransition } from 'react'

type CommandResponse = {
  ok: boolean
  kind?: string
  label?: string
  requiresConfirm?: boolean
  confirmationId?: string
  message: string
  links?: { href: string; label: string }[]
  sources?: { label: string; href?: string }[]
  ai?: 'connected' | 'unconnected'
}

export default function FounderCommandBar() {
  const id = useId()
  const [text, setText] = useState('')
  const [result, setResult] = useState<CommandResponse | null>(null)
  const [pendingConfirm, setPendingConfirm] = useState<{
    confirmationId: string
    payloadHash: string
    summary: string
  } | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        document.getElementById(id)?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [id])

  function run(confirm = false) {
    startTransition(async () => {
      setResult(null)
      try {
        const res = await fetch('/api/founder/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            confirm,
            confirmationId: confirm ? pendingConfirm?.confirmationId : undefined,
            payloadHash: confirm ? pendingConfirm?.payloadHash : undefined,
          }),
        })
        const data = (await res.json()) as CommandResponse & {
          confirmationId?: string
          payloadHash?: string
          payloadSummary?: string
        }
        if (!res.ok) {
          setResult({ ok: false, message: data.message || '指令被拒絕或失敗。' })
          return
        }
        if (data.requiresConfirm && data.confirmationId && data.payloadHash) {
          setPendingConfirm({
            confirmationId: data.confirmationId,
            payloadHash: data.payloadHash,
            summary: data.payloadSummary || data.message,
          })
        } else {
          setPendingConfirm(null)
        }
        setResult(data)
      } catch {
        setResult({ ok: false, message: '網絡錯誤，請再試。' })
      }
    })
  }

  return (
    <div className="fos-cmd-bar px-3 py-3 md:px-5">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <label htmlFor={id} className="sr-only">
          Founder AI 指令列
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <input
              id={id}
              value={text}
              onChange={(e) => {
                setText(e.target.value)
                setPendingConfirm(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  run(false)
                }
              }}
              placeholder="指令列：比較錯題回報、待覆核、草擬簡報…（⌘/Ctrl+K）"
              className="w-full rounded-full border border-[var(--fos-border)] bg-[var(--fos-panel)] px-4 py-2.5 text-sm text-[var(--fos-ink)] placeholder:text-[var(--fos-faint)]"
              disabled={pending}
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            onClick={() => run(false)}
            disabled={pending || !text.trim()}
            className="rounded-full border border-[var(--fos-cyan)] bg-[color-mix(in_srgb,var(--fos-cyan)_15%,transparent)] px-4 py-2 text-sm text-[var(--fos-cyan)] disabled:opacity-40"
          >
            {pending ? '處理中…' : '執行'}
          </button>
        </div>
        {pendingConfirm && (
          <div className="fos-panel rounded-lg p-3 text-sm" role="alertdialog" aria-labelledby={`${id}-confirm`}>
            <p id={`${id}-confirm`} className="font-medium text-[var(--fos-warn)]">
              需要確認的副作用操作
            </p>
            <p className="mt-1 text-[var(--fos-muted)]">{pendingConfirm.summary}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-[var(--fos-danger)] px-3 py-1.5 text-[var(--fos-danger)]"
                onClick={() => run(true)}
                disabled={pending}
              >
                確認執行
              </button>
              <button
                type="button"
                className="rounded-lg border border-[var(--fos-border-soft)] px-3 py-1.5 text-[var(--fos-muted)]"
                onClick={() => setPendingConfirm(null)}
              >
                取消
              </button>
            </div>
          </div>
        )}
        {result && (
          <div className="fos-panel p-3 text-sm" role="status">
            <p className="text-[var(--fos-ink)]">{result.message}</p>
            {result.ai === 'unconnected' && (
              <p className="mt-1 text-xs text-[var(--fos-ai)]">
                Founder AI 未接駁：請設定伺服器 FOUNDER_AI_API_KEY 與 FOUNDER_AI_BASE_URL。以下為本地查詢結果。
              </p>
            )}
            {result.links && result.links.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {result.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[var(--fos-cyan)] underline-offset-2 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {result.sources && result.sources.length > 0 && (
              <p className="mt-2 text-xs text-[var(--fos-faint)]">
                來源：{result.sources.map((s) => s.label).join(' · ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
