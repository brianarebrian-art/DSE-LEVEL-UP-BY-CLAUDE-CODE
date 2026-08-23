'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { buildLogEntries, nodeTone, subjectLabel, type LogEntry } from '@/lib/logicLog'
import { getHomestead, type HomesteadState } from '@/lib/homestead'

// 儀表板上的「最近足跡」橫向列（SPEC-GAMIFY-P1 §MVP P0 第 3 項）+ 家園入口。
//
// 橫向滑動用 §2.2 的 3D 卡片轉盤 class；`carousel-card` 的 hover 傾斜在
// SEN／reduced-motion 之下由 globals.css 整層關掉（不是調慢）。
//
// 完全沒有練習紀錄時回 null —— 不對新來的學生擺一列空卡片，那只會令人覺得
// 自己欠了平台一些東西。

const TONE_DOT = {
  quiet: 'bg-ink-muted/40',
  cyan: 'bg-accent',
  pink: 'bg-rose',
  gold: 'bg-gold',
} as const

function shortDate(date: string, en: boolean): string {
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return date
  return en
    ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : `${d.getMonth() + 1}月${d.getDate()}日`
}

export default function TrailStrip({ className = '' }: { className?: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [entries, setEntries] = useState<LogEntry[] | null>(null)
  const [home, setHome] = useState<HomesteadState | null>(null)

  useEffect(() => {
    setEntries(buildLogEntries())
    setHome(getHomestead())
  }, [])

  if (entries === null || entries.length === 0) return null

  return (
    <section className={className} aria-labelledby="trail-strip-heading">
      <div className="flex items-baseline justify-between mb-3">
        <h2 id="trail-strip-heading" className="font-medium text-ink">
          🗺️ {en ? 'Recent trail' : '最近足跡'}
        </h2>
        <Link href="/logic-log" className="text-sm text-accent inline-flex items-center gap-1 min-h-11">
          {en ? 'Full trail' : '完整足跡'}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="carousel-3d -mx-1 overflow-x-auto pb-2">
        <ul className="flex gap-3 px-1">
          {entries.slice(0, 7).map((e) => (
            <li key={e.date} className="shrink-0 w-44">
              <Link
                href="/logic-log"
                className="carousel-card block h-full rounded-2xl border border-line bg-surface-raised p-4"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden className={`w-2.5 h-2.5 rounded-full ${TONE_DOT[nodeTone(e)]}`} />
                  <span className="text-sm font-medium text-ink">{shortDate(e.date, en)}</span>
                </span>
                <span className="block text-xs text-ink-muted mt-2">
                  {en ? `${e.questionsCount} questions · ${e.timeMinutes} min` : `${e.questionsCount} 題 · ${e.timeMinutes} 分鐘`}
                </span>
                {e.subjects.length > 0 && (
                  <span className="block text-xs text-ink-muted mt-1 truncate">
                    {e.subjects.slice(0, 2).map((s) => subjectLabel(s, en)).join(en ? ', ' : '、')}
                  </span>
                )}
                {e.moodNote && (
                  <span className="block text-xs text-ink mt-2 line-clamp-2">「{e.moodNote}」</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {home && (
        <Link
          href="/homestead"
          className="mt-3 flex items-center justify-between rounded-2xl border border-line bg-surface-raised px-5 py-4 min-h-11"
        >
          <span>
            <span className="block text-sm font-medium text-ink">
              🏡 {en ? 'Logic homestead' : '邏輯家園'}
            </span>
            <span className="block text-xs text-ink-muted mt-0.5">
              {home.zones.map((z) => `${z.zone.emoji}${z.level}`).join('  ')}
            </span>
          </span>
          <ArrowRight className="w-4 h-4 text-ink-muted shrink-0" />
        </Link>
      )}
    </section>
  )
}
