'use client'

import { Check, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { cardNo, type OffSyllabusCard } from '@/data/offSyllabus'
import { SITE_ORIGIN } from '@/lib/site'

export default function OffSyllabusShareButton({ card }: { card: OffSyllabusCard }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const url = typeof window === 'undefined' ? `${SITE_ORIGIN}/off-syllabus` : window.location.href
    const text = en
      ? `${cardNo(card.id)} ${card.title}\n${card.trivia}\n\nDiscover more free DSE learning at DSE Level Up: ${url}\nThreads: https://www.threads.com/@dselevelup\nInstagram: https://www.instagram.com/dselevelup`
      : `${cardNo(card.id)} ${card.title}\n${card.trivia}\n\n一齊去 DSE Level Up 免費學多樣：${url}\nThreads： https://www.threads.com/@dselevelup\nInstagram： https://www.instagram.com/dselevelup`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-accent/35 px-3 py-2 text-xs font-medium text-accent-strong transition-colors hover:bg-surface-sunken focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[.98]"
      aria-live="polite"
    >
      {copied ? <Check size={15} aria-hidden /> : <Share2 size={15} aria-hidden />}
      {copied ? (en ? 'Copied for sharing' : '已複製分享文字') : (en ? 'Copy share text' : '複製分享文字')}
      {!copied && <Copy size={13} aria-hidden className="opacity-60" />}
    </button>
  )
}
