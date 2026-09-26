'use client'

import { forwardRef } from 'react'
import type { CauseCardData } from '@/lib/causeCard'
import type { ReverseCause } from '@/lib/reverseLog'

// Cause card: 1080×1920 PNG for sharing, captured off-screen by html2canvas
// (components/ShareStatsCardButton.tsx). UX audit A2 (c), 2026-09-26.
//
// No score of any kind (see lib/causeCard.ts). Colours are fixed literals, not theme
// tokens, because an exported image must look the same whoever made it
// (scripts/theme-migrate.mjs excludes this file). The palette is the site's light
// Morandi (charter §14), not the neon of the score card.

const C = {
  bg: '#F4F0EA', card: '#FBF9F5', ink: '#2C2A29', sub: '#5C5752', line: '#E2DBD0', sage: '#57685C',
}

const CAUSE: Record<ReverseCause, { emoji: string; zh: string; en: string; color: string; nextZh: string; nextEn: string }> = {
  A: {
    emoji: '🧠', zh: '概念盲區', en: 'Concept blind spot', color: '#6D28D9',
    nextZh: '做題之前，先重溫該課題的定義和前提。',
    nextEn: 'Revisit the topic’s definitions and conditions before drilling.',
  },
  B: {
    emoji: '🎯', zh: '審題陷阱', en: 'Misreading the question', color: '#7E5D07',
    nextZh: '作答之前，先圈出「最多、至少、除了、不是」等字眼。',
    nextEn: 'Circle words like “at least”, “except” and “not” before answering.',
  },
  C: {
    emoji: '🧮', zh: '運算粗心', en: 'Careless calculation', color: '#006B65',
    nextZh: '每算完一步，即時驗算一次。',
    nextEn: 'Check each result as soon as you have it.',
  },
}

const CauseCard = forwardRef<HTMLDivElement, { data: CauseCardData; en?: boolean; qrSrc?: string }>(
  function CauseCard({ data, en = false, qrSrc = '/qr.png' }, ref) {
    const top = CAUSE[data.causes[0]]
    return (
      <div ref={ref} style={{
        width: 1080, height: 1920, background: C.bg, color: C.ink,
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 80,
        fontFamily: '"Noto Serif TC", "PingFang HK", "Microsoft JhengHei", serif',
      }}>
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 2, color: C.sage }}>DSE LEVEL UP</div>
        <div style={{ fontSize: 26, color: C.sub, marginTop: 14 }}>{data.date} · {data.subject}</div>

        <div style={{ width: '100%', height: 2, background: C.line, margin: '56px 0' }} />

        <div style={{ fontSize: 68, fontWeight: 700, textAlign: 'center', lineHeight: 1.3 }}>
          {en ? 'What tripped me up today' : '今日我搵到嘅錯因'}
        </div>
        <div style={{ fontSize: 28, color: C.sub, marginTop: 20, textAlign: 'center' }}>
          {en ? 'Knowing why is the first step.' : '知道點解錯，係進步嘅第一步。'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%', marginTop: 64 }}>
          {data.causes.map((c) => (
            <div key={c} style={{
              display: 'flex', alignItems: 'center', gap: 28, background: C.card,
              border: `3px solid ${CAUSE[c].color}`, borderRadius: 28, padding: '36px 44px',
            }}>
              <span style={{ fontSize: 64 }}>{CAUSE[c].emoji}</span>
              <span style={{ fontSize: 48, fontWeight: 700 }}>{en ? CAUSE[c].en : CAUSE[c].zh}</span>
            </div>
          ))}
        </div>

        <div style={{ width: '100%', marginTop: 56, background: C.card, border: `2px solid ${C.line}`, borderRadius: 28, padding: '40px 44px' }}>
          <div style={{ fontSize: 28, color: C.sage, fontWeight: 700 }}>{en ? 'Next time I will' : '下次我會'}</div>
          <div style={{ fontSize: 40, marginTop: 14, lineHeight: 1.45 }}>{en ? top.nextEn : top.nextZh}</div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 16, border: `2px solid ${C.line}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="" width={176} height={176} style={{ display: 'block', borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 24, color: C.sage, fontWeight: 700, marginTop: 14 }}>{en ? 'Scan to practise free' : '掃描免費練習'}</div>
          <div style={{ fontSize: 22, color: C.sub, marginTop: 8 }}>{data.siteUrl}</div>
          <div style={{ fontSize: 18, color: C.sub, marginTop: 12 }}>© DSE Level Up 2026 · Not affiliated with HKEAA</div>
        </div>
      </div>
    )
  }
)

export default CauseCard
