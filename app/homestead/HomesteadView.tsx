'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { getHomestead, MAX_LEVEL, type HomesteadState, type ZoneState } from '@/lib/homestead'

// 規格書 §模組二。四區 × 五級，純 SVG + CSS（規格書 §MVP：不需要複雜插畫）。
//
// 大愛紅線（憲章 §7）：四個輸入全部是累計計數，等級在數學上不可能下跌。
// 頁面亦不出現任何「你落後了」「距離目標仲差」式的比較——進度條只講「再做
// 多少就升一級」，不講「你未夠」。

/** 各區的等級視覺。層數 = 等級，畫得越滿代表越高級——不用文字標「Lv.5」去壓人。 */
function ZoneArt({ id, level }: { id: ZoneState['zone']['id']; level: number }) {
  const lit = (n: number) => (level >= n ? 1 : 0.12)
  const stroke = 'currentColor'
  const common = { fill: 'none', stroke, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

  if (id === 'forge') {
    return (
      <svg viewBox="0 0 64 64" className="w-full h-full text-rose" aria-hidden>
        <path d="M20 52h24" {...common} opacity={lit(1)} />
        <path d="M26 52c-3-6 1-9 3-13 1 3 3 3 4 6 1-2 2-3 2-5 3 4 4 7 3 12" {...common} opacity={lit(1)} className={level >= 3 ? 'combo-flame' : undefined} />
        <path d="M16 52V38h32v14" {...common} opacity={lit(2)} />
        <path d="M14 38h36" {...common} opacity={lit(3)} />
        <path d="M48 30h8v8h-8z M8 30h8v8H8z" {...common} opacity={lit(4)} />
        <path d="M32 10v6M24 14l3 5M40 14l-3 5" {...common} opacity={lit(5)} />
      </svg>
    )
  }
  if (id === 'garden') {
    return (
      <svg viewBox="0 0 64 64" className="w-full h-full text-accent" aria-hidden>
        <path d="M12 54h40" {...common} opacity={lit(1)} />
        <path d="M32 54V40M32 44c-5 0-7-3-7-6 4 0 7 2 7 6z" {...common} opacity={lit(1)} />
        <path d="M32 40c5 0 7-3 7-7-4 0-7 3-7 7z" {...common} opacity={lit(2)} />
        <path d="M18 54V44M18 46c-4 0-5-3-5-5 3 0 5 2 5 5z" {...common} opacity={lit(3)} />
        <path d="M46 54V42M46 44c4 0 5-3 5-5-3 0-5 2-5 5z" {...common} opacity={lit(4)} />
        <path d="M22 24c4-6 12-8 18-4M26 18l2 4M38 16l-1 4" {...common} opacity={lit(5)} />
      </svg>
    )
  }
  if (id === 'library') {
    return (
      <svg viewBox="0 0 64 64" className="w-full h-full text-gold" aria-hidden>
        <path d="M12 54h40" {...common} opacity={lit(1)} />
        <path d="M18 54V42h6v12M28 54V42h6v12" {...common} opacity={lit(1)} />
        <path d="M38 54V42h6v12" {...common} opacity={lit(2)} />
        <path d="M14 40h36" {...common} opacity={lit(3)} />
        <path d="M18 40V28h6v12M28 40V28h6v12M38 40V28h6v12" {...common} opacity={lit(4)} />
        <path d="M26 18h12v6H26zM32 12v6" {...common} opacity={lit(5)} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full text-purple" aria-hidden>
      <path d="M16 54h32" {...common} opacity={lit(1)} />
      <path d="M28 54l4-16 4 16" {...common} opacity={lit(1)} />
      <path d="M32 38l14-10" {...common} opacity={lit(2)} />
      <path d="M44 24l8 6-8 6-4-6z" {...common} opacity={lit(3)} />
      <path d="M14 20l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" {...common} opacity={lit(4)} />
      <path d="M46 12l1.5 3 3 1.5-3 1.5L46 21l-1.5-3-3-1.5 3-1.5zM24 10l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" {...common} opacity={lit(5)} />
    </svg>
  )
}

function ZonePanel({ z, en }: { z: ZoneState; en: boolean }) {
  const [open, setOpen] = useState(false)
  const pct = Math.round(z.progress * 100)
  return (
    <div className="carousel-card rounded-2xl border border-line bg-surface-raised p-5">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 shrink-0">
          <ZoneArt id={z.zone.id} level={z.level} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink">
            {z.zone.emoji} {en ? z.zone.en : z.zone.zh}
          </p>
          <p className="text-sm text-ink-muted mt-0.5">
            {en ? `Level ${z.level} of ${MAX_LEVEL}` : `第 ${z.level} 級（共 ${MAX_LEVEL} 級）`}
          </p>
          <div className="mt-3 h-2 rounded-full bg-surface-sunken overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}
               aria-label={en ? `${z.zone.en} progress` : `${z.zone.zh}進度`}>
            <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-ink-muted mt-2">
            {z.nextAt === null
              ? (en ? `${z.value} ${z.zone.unitEn} — this zone is fully built.` : `${z.value} ${z.zone.unitZh}——這一區已經建成。`)
              : (en
                  ? `${z.value} / ${z.nextAt} ${z.zone.unitEn} towards the next level`
                  : `${z.value} / ${z.nextAt} ${z.zone.unitZh}，再做就升一級`)}
          </p>
        </div>
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 min-h-11 text-sm text-ink-muted hover:text-ink"
      >
        {open ? (en ? 'Hide' : '收起') : (en ? 'What does this zone stand for?' : '這一區代表甚麼？')}
      </button>
      {open && (
        <p className="text-sm text-ink-muted mt-2 leading-relaxed">
          {en ? z.zone.meaningEn : z.zone.meaningZh}
        </p>
      )}
    </div>
  )
}

export default function HomesteadView() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [state, setState] = useState<HomesteadState | null>(null)

  useEffect(() => { setState(getHomestead()) }, [])

  if (state === null) {
    return <main className="min-h-screen px-4 py-12"><div className="max-w-3xl mx-auto h-64 rounded-2xl bg-surface-raised animate-pulse" /></main>
  }

  const untouched = state.total === state.zones.length

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-6 min-h-11">
          <ArrowLeft className="w-4 h-4" />
          {en ? 'Back to progress' : '返回我的進度'}
        </Link>

        <h1 className="scatter-title text-3xl sm:text-4xl font-medium mb-2 text-ink">
          {en ? 'Logic homestead' : '邏輯家園'}
        </h1>
        <p className="text-ink-muted mb-8">
          {en
            ? 'Four places that grow out of what you actually do. Nothing here is stored separately — wipe this page and it rebuilds itself from your practice records.'
            : '四個地方，全部由你真正做過的事長出來。這一頁沒有另存任何東西——就算清走，它也會由你的練習紀錄重新長返出來。'}
        </p>

        {untouched && (
          <div className="rounded-2xl border border-line bg-surface-raised p-5 mb-8">
            <p className="text-ink">{en ? 'Everything starts at level 1' : '四區都由第一級開始'}</p>
            <p className="text-sm text-ink-muted mt-1">
              {en
                ? 'Nothing here can ever fall back — every input is a running total, so a bad day cannot take a level away.'
                : '這裡的東西不會倒退——四個數字全部只加不減，考得差的一日不會令任何一區跌級。'}
            </p>
          </div>
        )}

        <div className="carousel-3d grid gap-4 sm:grid-cols-2">
          {state.zones.map((z) => <ZonePanel key={z.zone.id} z={z} en={en} />)}
        </div>

        <p className="text-xs text-ink-muted mt-8 leading-relaxed">
          {en
            ? 'The Library counts distinct topics practised and the Observatory counts spaced reviews completed. Neither is a predicted grade: this site does not turn a prediction into a level to chase.'
            : '圖書館數的是做過多少個不同課題，天文台數的是完成過多少次錯題重溫。兩者都不是預測等級——本平台不會把預測變成一個要追的等級。'}
        </p>

        <div className="mt-8">
          <Link href="/logic-log" className="inline-flex items-center min-h-11 px-5 rounded-xl border border-line text-ink">
            {en ? 'See the day-by-day trail' : '睇逐日足跡'}
          </Link>
        </div>
      </div>
    </main>
  )
}
