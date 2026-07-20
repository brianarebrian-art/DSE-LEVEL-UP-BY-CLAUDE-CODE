'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react'
import { quotes } from '@/data/quotes'
import { useLocale } from '@/lib/i18n'

// 方向二：每日正向金句輪播（light-first）。純本地、零成本。
// 每日預設一句（date-of-month），「換一句」隨機切換；localStorage 記已看 id
// 避免短期重複（滿咗就重置）。client-only 讀取避免 SSR/CSR 日期不一致。

const SEEN_KEY = 'dse_quote_seen'

function loadSeen(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]')
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

export default function DailyQuote() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [idx, setIdx] = useState<number | null>(null)

  // 初始：當日金句（date-of-month 取模），純 client。
  useEffect(() => {
    setIdx(new Date().getDate() % quotes.length)
  }, [])

  const shuffle = useCallback(() => {
    const seen = new Set(loadSeen())
    let pool = quotes.map((_, i) => i).filter((i) => !seen.has(i) && i !== idx)
    if (pool.length === 0) pool = quotes.map((_, i) => i).filter((i) => i !== idx) // 全看完 → 重置
    const next = pool[Math.floor(Math.random() * pool.length)] ?? 0
    setIdx(next)
    try {
      const merged = Array.from(new Set([...loadSeen(), next]))
      localStorage.setItem(SEEN_KEY, JSON.stringify(merged.slice(-quotes.length)))
    } catch {
      /* ignore */
    }
  }, [idx])

  const q = idx === null ? null : quotes[idx]

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-8 text-center">
      <QuoteIcon size={22} className="mx-auto mb-4 text-[#008B84]" aria-hidden />
      <p className="min-h-[3.5rem] text-xl leading-relaxed text-[#1A1A1A]">
        {q ? (en ? q.en : q.zh) : ' '}
      </p>
      <p className="mt-3 text-sm text-[#9CA3AF]">— DSE LEVEL UP</p>
      <button
        onClick={shuffle}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#008B84]/30 bg-white px-5 py-2.5 text-sm font-medium text-[#008B84] transition-all hover:bg-[#008B84]/[0.06]"
      >
        <RefreshCw size={15} /> {en ? 'Another one' : '換一句'}
      </button>
    </div>
  )
}
