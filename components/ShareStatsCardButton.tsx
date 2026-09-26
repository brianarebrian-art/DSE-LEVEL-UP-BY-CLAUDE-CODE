'use client'

import { useRef, useState } from 'react'
import { ImageDown } from 'lucide-react'
import DailyStatsCard, { type DailyStatsCardData } from '@/components/DailyStatsCard'
import CauseCard from '@/components/CauseCard'
import type { CauseCardData } from '@/lib/causeCard'

// 「分享戰績卡到 IG Story」——把 off-screen 嘅 DailyStatsCard 用 html2canvas 影成 PNG，
// 再經 Web Share API（手機，可直接揀 Instagram）或下載（桌面）交俾用戶。
//
// 點解 html2canvas 而唔係 @vercel/og：用瀏覽器自己嘅字型 → 中文正常顯示、零 Edge Function
// invocation（最貼 $0）、繞開 @vercel/og 嘅 CJK 字型嵌入死結。html2canvas 動態 import，
// 唔會入主 bundle。分享係用戶自發（分享自己嘅數據），非代發。
//
// UX audit A2 (c), 2026-09-26: two cards side by side, the student picks one.
// The cause card (components/CauseCard.tsx) is the default; the score card is kept as
// "Classic score card". With no cause recorded today the cause option is disabled and
// the score card is used (docs/PHASE1-impact-2026-09-21.md, option 甲).

type Variant = 'cause' | 'score'

export default function ShareStatsCardButton({
  data,
  causeData = null,
  en = false,
}: {
  data: DailyStatsCardData
  causeData?: CauseCardData | null
  en?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<Variant>('cause')
  const variant: Variant = picked === 'cause' && causeData ? 'cause' : 'score'
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleShare = async () => {
    if (busy || !cardRef.current) return
    setBusy(true)
    setErr(null)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: variant === 'cause' ? '#F4F0EA' : '#0A0A0F',
        scale: 1,
        logging: false,
        useCORS: true,
      })
      const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), 'image/png'))
      if (!blob) throw new Error('no blob')
      const file = new File([blob], `dse-level-up-${variant === 'cause' ? 'causes' : 'stats'}-${Date.now()}.png`, { type: 'image/png' })

      // 手機：Web Share（可揀 IG Story）；否則下載。
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title:
            variant === 'cause'
              ? en ? 'What tripped me up today' : '今日我搵到嘅錯因'
              : en ? 'My DSE Level Up daily stats' : '我嘅 DSE LEVEL UP 今日戰績',
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      // 用戶取消分享唔當錯
      if (e instanceof DOMException && e.name === 'AbortError') { /* cancelled */ }
      else setErr(en ? 'Could not generate the card — please try again.' : '暫時整唔到分享卡，請再試一次。')
    } finally {
      setBusy(false)
    }
  }

  const option = (v: Variant, label: string, note: string | null, disabled: boolean) => (
    <label
      className={`flex min-h-11 flex-1 items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${
        disabled ? 'cursor-not-allowed border-line text-ink-muted' : 'cursor-pointer border-line-strong text-ink-soft has-[:checked]:border-accent has-[:checked]:bg-surface-sunken'
      }`}
    >
      <input
        type="radio"
        name="share-card"
        value={v}
        checked={variant === v}
        disabled={disabled}
        onChange={() => setPicked(v)}
        className="mt-0.5 accent-[var(--color-accent)]"
      />
      <span>
        <span className="block font-medium">{label}</span>
        {note && <span className="block text-xs text-ink-muted">{note}</span>}
      </span>
    </label>
  )

  return (
    <>
      <fieldset className="no-print">
        <legend className="mb-2 text-sm text-ink-muted">{en ? 'Choose a card to share' : '揀一張卡分享'}</legend>
        <div className="flex flex-col gap-2 sm:flex-row">
          {option(
            'cause',
            en ? 'Cause card' : '錯因破解卡',
            causeData
              ? en ? 'The causes you found today. No score.' : '今日搵到嘅錯因，冇分數'
              : en ? 'No causes recorded today' : '今日冇錯因紀錄',
            !causeData,
          )}
          {option('score', en ? 'Classic score card' : '傳統成績卡', en ? 'Accuracy, time and tiers' : '正確率、用時同難度分佈', false)}
        </div>
      </fieldset>
      <button
        onClick={handleShare}
        disabled={busy}
        className="no-print mt-3 w-full flex items-center justify-center gap-2 border border-accent/40 text-accent font-semibold py-3.5 rounded-xl transition-all hover:bg-surface-sunken disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 20px rgba(0,245,212,0.12)' }}
      >
        <ImageDown size={16} /> {busy ? (en ? 'Generating…' : '生成緊分享卡…') : en ? 'Share to IG Story' : '分享到 IG Story'}
      </button>
      {err && <p className="no-print text-xs text-gold mt-2 text-center">{err}</p>}

      {/* off-screen 全尺寸卡（html2canvas 影呢個）。用 left:-99999 藏起 —— 不可用 opacity:0，
          因為 html2canvas 會尊重 opacity 而影出空白。aria-hidden 唔影響無障礙。 */}
      <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}>
        {variant === 'cause' && causeData ? (
          <CauseCard ref={cardRef} data={causeData} en={en} />
        ) : (
          <DailyStatsCard ref={cardRef} data={data} en={en} />
        )}
      </div>
    </>
  )
}
