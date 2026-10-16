'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export default function OffSyllabusShare({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false)

  async function share() {
    const url = window.location.href
    const message = `${text}\n\nThreads：${url}\nInstagram 限時動態：${url}`
    try {
      if (navigator.share) {
        await navigator.share({ title, text: message, url })
      } else {
        await navigator.clipboard.writeText(message)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      // User cancellation is expected; no error state is needed.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label={copied ? '分享文字已複製' : `分享${title}`}
    >
      {copied ? <Check data-icon="inline-start" aria-hidden /> : <Share2 data-icon="inline-start" aria-hidden />}
      {copied ? '已複製' : '分享這張卡'}
    </button>
  )
}
