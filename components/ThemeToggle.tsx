'use client'

import { Sun, Moon, Clock } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useLocale } from '@/lib/i18n'
import type { ThemePref } from '@/lib/theme'

// 主題切換：自動（跟香港日出日落）／ 淺色 ／ 深色霓虹。
// 三段式而非兩段式 —— 學生揀咗淺或深之後就固定，唔會半夜俾系統改返，
// 想交返畀時間決定就撳「自動」。

const fmt = (h: number) =>
  `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`

/**
 * `compact` 用於橫向導航條：只出一粒掣，循環 自動 → 淺色 → 深色。
 *
 * 點解要有 compact：橫向條實測 natural 闊度中文 1,059px、英文 1,210px，斷點設喺
 * 1,280px 已經好貼。三段式控制件（3 × 44px 觸控目標 ＝ 132px）會令英文版超過
 * 斷點，重新出現標籤斷行 —— 即係打返轉頭 2026-07-28 修好嘅問題。
 * 故橫向條用單掣（44px），選單內則用完整三段式，兩者操控同一個狀態。
 */
export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { pref, theme, setPref, sun } = useTheme()
  const { locale } = useLocale()
  const en = locale === 'en'

  const opts: { key: ThemePref; icon: typeof Sun; label: string; hint: string }[] = [
    {
      key: 'auto',
      icon: Clock,
      label: en ? 'Auto' : '自動',
      hint: en
        ? `Follows Hong Kong daylight — light from ${fmt(sun.sunrise)}, dark from ${fmt(sun.sunset)}`
        : `跟香港日照：${fmt(sun.sunrise)} 轉淺色，${fmt(sun.sunset)} 轉深色`,
    },
    { key: 'light', icon: Sun, label: en ? 'Light' : '淺色', hint: en ? 'Always light' : '一直用淺色' },
    { key: 'cyber', icon: Moon, label: en ? 'Dark' : '深色', hint: en ? 'Always dark' : '一直用深色' },
  ]

  if (compact) {
    const cur = opts.find((o) => o.key === pref) ?? opts[0]
    const next = opts[(opts.findIndex((o) => o.key === pref) + 1) % opts.length]
    const Icon = cur.icon
    return (
      <button
        onClick={() => setPref(next.key)}
        title={cur.hint}
        aria-label={
          en
            ? `Colour theme: ${cur.label} (${cur.hint}). Activate for ${next.label}.`
            : `色彩主題：${cur.label}（${cur.hint}）。撳一下轉做${next.label}。`
        }
        className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-ink-muted hover:text-accent hover:bg-line transition-colors"
      >
        <Icon size={18} aria-hidden />
        <span className="sr-only" aria-live="polite">
          {en ? `Current theme: ${theme}` : `目前主題：${theme === 'light' ? '淺色' : '深色'}`}
        </span>
      </button>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label={en ? 'Colour theme' : '色彩主題'}
      className="inline-flex items-center gap-0.5 rounded-lg border border-line p-0.5"
    >
      {opts.map((o) => {
        const Icon = o.icon
        const active = pref === o.key
        return (
          <button
            key={o.key}
            role="radio"
            aria-checked={active}
            title={o.hint}
            onClick={() => setPref(o.key)}
            className={`min-h-11 min-w-11 inline-flex items-center justify-center rounded-md px-2 transition-colors ${
              active ? 'bg-accent-strong text-on-accent' : 'text-ink-muted hover:text-accent'
            }`}
          >
            <Icon size={16} aria-hidden />
            <span className="sr-only">
              {o.label} — {o.hint}
            </span>
          </button>
        )
      })}
      {/* 目前生效主題，只讀，供螢幕閱讀器交代「自動」實際解析成邊個 */}
      <span className="sr-only" aria-live="polite">
        {en ? `Current theme: ${theme}` : `目前主題：${theme === 'light' ? '淺色' : '深色'}`}
      </span>
    </div>
  )
}
