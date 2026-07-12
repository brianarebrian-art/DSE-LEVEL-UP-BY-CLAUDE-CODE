'use client'

import { useRef, useState } from 'react'
import { ImageDown } from 'lucide-react'
import DailyStatsCard, { type DailyStatsCardData } from '@/components/DailyStatsCard'

// 「分享戰績卡到 IG Story」——把 off-screen 嘅 DailyStatsCard 用 html2canvas 影成 PNG，
// 再經 Web Share API（手機，可直接揀 Instagram）或下載（桌面）交俾用戶。
//
// 點解 html2canvas 而唔係 @vercel/og：用瀏覽器自己嘅字型 → 中文正常顯示、零 Edge Function
// invocation（最貼 $0）、繞開 @vercel/og 嘅 CJK 字型嵌入死結。html2canvas 動態 import，
// 唔會入主 bundle。分享係用戶自發（分享自己嘅數據），非代發。

export default function ShareStatsCardButton({ data, en = false }: { data: DailyStatsCardData; en?: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handleShare = async () => {
    if (busy || !cardRef.current) return
    setBusy(true)
    setErr(null)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#0A0A0F', scale: 1, logging: false, useCORS: true })
      const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), 'image/png'))
      if (!blob) throw new Error('no blob')
      const file = new File([blob], `dse-level-up-stats-${Date.now()}.png`, { type: 'image/png' })

      // 手機：Web Share（可揀 IG Story）；否則下載。
      const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }
      if (nav.canShare && nav.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: en ? 'My DSE Level Up daily stats' : '我嘅 DSE LEVEL UP 今日戰績' })
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
      else setErr(en ? 'Could not generate the card — please try again.' : '暫時整唔到戰績卡，請再試一次。')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={handleShare}
        disabled={busy}
        className="no-print w-full flex items-center justify-center gap-2 border border-[#00F5D4]/40 text-[#00F5D4] font-semibold py-3.5 rounded-xl transition-all hover:bg-[#00F5D4]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ boxShadow: '0 0 20px rgba(0,245,212,0.12)' }}
      >
        <ImageDown size={16} /> {busy ? (en ? 'Generating…' : '生成緊戰績卡…') : en ? 'Share stats card to IG Story' : '分享戰績卡到 IG Story'}
      </button>
      {err && <p className="no-print text-xs text-amber-400/90 mt-2 text-center">{err}</p>}

      {/* off-screen 全尺寸卡（html2canvas 影呢個）。用 left:-99999 藏起 —— 不可用 opacity:0，
          因為 html2canvas 會尊重 opacity 而影出空白。aria-hidden 唔影響無障礙。 */}
      <div aria-hidden style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }}>
        <DailyStatsCard ref={cardRef} data={data} en={en} />
      </div>
    </>
  )
}
