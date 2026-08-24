'use client'

// 今日幾句建議 —— 溫柔每日建議（第 2 週 · 引擎四）
//
// 命名：規格書 §4.5 叫呢個做「今日學習光譜」，但同一版已經有一張
// DailySpectrum 用緊「今日學習光譜」（3:5:2 節奏）。同一頁兩張同名卡
// 對任何人都係困惑，對注意力障礙用戶尤其。故此處改名為「今日幾句建議」，
// 語意亦更貼實情 —— 佢係幾句說話，唔係一幅光譜。
//
// 規格書 §4.5。呢張卡刻意做唔到以下嘢，唔係漏做：
//   • 冇紅點、冇感嘆號、冇未讀數 —— 佢唔會追你
//   • 冇「未完成」狀態；撳走一條唔會扣任何嘢，聽日重新計算
//   • 冇連續日數、冇打卡、冇錯過提示
//   • 一條建議都冇嗰陣，整張卡唔顯示 —— 唔會出一個空殼提你「今日冇嘢做」

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { dismissSuggestion, todaySuggestions, type Suggestion } from '@/lib/gentleSuggestions'

export default function GentleSuggestions() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [items, setItems] = useState<Suggestion[] | null>(null)

  useEffect(() => {
    setItems(todaySuggestions())
  }, [])

  const dismiss = useCallback((id: string) => {
    dismissSuggestion(id)
    setItems((prev) => (prev ? prev.filter((s) => s.id !== id) : prev))
  }, [])

  if (!items || items.length === 0) return null

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6 mb-10">
      <div className="flex items-center gap-2.5 mb-1">
        <Sparkles size={18} aria-hidden className="text-gold shrink-0" />
        <h2 className="text-lg font-medium text-ink">{en ? 'A few suggestions' : '今日幾句建議'}</h2>
      </div>
      <p className="text-xs text-ink-muted mb-4 leading-relaxed">
        {en
          ? 'Suggestions, not tasks. Swipe any of them away — nothing is deducted.'
          : '係建議，唔係任務。唔啱就撳走佢，唔會扣任何嘢。'}
      </p>

      <ul className="space-y-2.5">
        {items.map((s) => (
          <li
            key={s.id}
            className="flex items-start gap-3 bg-surface-sunken border border-line rounded-xl px-4 py-3"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-ink-soft leading-relaxed">{en ? s.en : s.zh}</span>
              {s.href && (
                <Link
                  href={s.href}
                  className="inline-block mt-2 text-xs text-accent hover:underline font-medium"
                >
                  {(en ? s.actionEn : s.actionZh) ?? (en ? 'Open' : '去睇睇')} →
                </Link>
              )}
            </span>
            <button
              onClick={() => dismiss(s.id)}
              aria-label={en ? 'Dismiss this suggestion for today' : '今日唔顯示呢條建議'}
              title={en ? 'Not today' : '今日唔啱'}
              className="shrink-0 min-h-8 min-w-8 w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink-soft hover:bg-surface transition-colors"
            >
              <X size={15} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
