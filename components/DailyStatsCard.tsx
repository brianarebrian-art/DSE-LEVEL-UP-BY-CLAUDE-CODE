'use client'

import { forwardRef } from 'react'

// 每日戰績卡（1080×1920）。html2canvas 影成 PNG 分享。
// 誠實原則：只顯示 REAL session 數據。無 JUPAS、無 streak、無他人排名。
//
// 2026-10-22：由 Cyber 霓虹改為 Morandi 分享色（html2canvas 要字面 hex，
// 唔跟 A11y CSS 變數；數值對齊 globals --color-ml-*／subj 家族，唔用螢光）。

export interface DailyStatsCardData {
  date: string
  subject: string
  questionsDone: number
  accuracy: number
  correctCount: number
  totalCount: number
  timeSpent: string
  avgPerQuestion: string
  tiers?: { label: string; correct: number; total: number; color: string }[]
  strengthTopic?: string
  focusTopic?: string
  siteUrl: string
}

/** Share-card palette — Morandi, not neon. Locked hex for html2canvas. */
export const SHARE_CARD_COLORS = {
  sage: '#7A9E7E',
  clay: '#B8956F',
  mist: '#8A9FB8',
  moss: '#8AAD8E',
  bg: '#1A1917',
  card: '#252422',
  ink: '#F0E8DC',
  sub: '#A8A095',
  faint: '#8A8377',
} as const

const C = SHARE_CARD_COLORS

const Bento = ({ children, border, full }: { children: React.ReactNode; border: string; full?: boolean }) => (
  <div style={{
    background: C.card, border: `1px solid ${border}`, borderRadius: 24, padding: 32,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gridColumn: full ? '1 / -1' : undefined, width: '100%',
  }}>{children}</div>
)

const DailyStatsCard = forwardRef<HTMLDivElement, { data: DailyStatsCardData; en?: boolean; qrSrc?: string }>(
  function DailyStatsCard({ data, en = false, qrSrc = '/qr.png' }, ref) {
    const d = data
    return (
      <div ref={ref} style={{
        width: 1080, height: 1920, background: C.bg, color: C.ink,
        display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 60,
        fontFamily: 'Inter, "PingFang HK", "Microsoft JhengHei", sans-serif', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,158,126,0.08) 0%, transparent 70%)', top: -220, left: -220 }} />
        <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,149,111,0.06) 0%, transparent 70%)', bottom: 120, right: -220 }} />

        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: 52, fontWeight: 700, color: C.sage }}>DSE LEVEL UP</div>
          <div style={{ fontSize: 22, color: C.sub, marginTop: 8 }}>{en ? 'Multiple-choice trains judgement, not the whole paper.' : '選擇題練判斷，唔係成卷掌握。'}</div>
        </div>

        <div style={{ width: '100%', height: 1, background: 'rgba(240,232,220,0.08)', margin: '28px 0 20px' }} />
        <div style={{ fontSize: 22, color: C.sub, marginBottom: 28 }}>{d.date} · {d.subject} · {en ? "Today's stats" : '今日戰績'}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', zIndex: 1 }}>
          <Bento border="rgba(122,158,126,0.28)">
            <div style={{ fontSize: 22, color: C.sub }}>{en ? 'Questions today' : '今日做題'}</div>
            <div style={{ fontSize: 128, fontWeight: 700, color: C.sage, lineHeight: 1 }}>{d.questionsDone}</div>
            <div style={{ fontSize: 26, color: C.sage }}>{en ? 'done' : '道'}</div>
          </Bento>
          <Bento border="rgba(184,149,111,0.28)">
            <div style={{ fontSize: 22, color: C.sub }}>{en ? 'Accuracy' : '正確率'}</div>
            <div style={{ fontSize: 104, fontWeight: 700, color: C.clay, lineHeight: 1 }}>{d.accuracy}%</div>
            <div style={{ fontSize: 22, color: C.sub, marginTop: 8 }}>{d.correctCount} / {d.totalCount} {en ? 'correct' : '做啱'}</div>
          </Bento>
        </div>

        <div style={{ marginTop: 20, width: '100%' }}>
          <Bento border="rgba(138,159,184,0.28)" full>
            <div style={{ fontSize: 30, color: C.mist, fontWeight: 600 }}>{en ? 'Time' : '用時'} {d.timeSpent}</div>
            <div style={{ fontSize: 20, color: C.sub, marginTop: 4 }}>{en ? 'Avg per question' : '平均每題'} {d.avgPerQuestion}</div>
          </Bento>
        </div>

        {d.tiers && d.tiers.length > 0 && (
          <div style={{ marginTop: 20, width: '100%' }}>
            <Bento border="rgba(240,232,220,0.1)" full>
              <div style={{ fontSize: 22, color: C.sub }}>{en ? 'Difficulty breakdown today' : '今日難度分佈'}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 72, marginTop: 20 }}>
                {d.tiers.map((tr) => (
                  <div key={tr.label} style={{ textAlign: 'center' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: tr.color, margin: '0 auto 10px' }} />
                    <div style={{ fontSize: 22, color: C.ink }}>{tr.label}</div>
                    <div style={{ fontSize: 18, color: C.sub, marginTop: 2 }}>{tr.correct}/{tr.total} {en ? 'correct' : '做啱'}</div>
                  </div>
                ))}
              </div>
            </Bento>
          </div>
        )}

        {d.strengthTopic && (
          <div style={{ marginTop: 20, width: '100%' }}>
            <Bento border="rgba(138,173,142,0.28)" full>
              <div style={{ fontSize: 22, color: C.moss, fontWeight: 600 }}>{en ? 'All correct today' : '今日全對嘅課題'}</div>
              <div style={{ fontSize: 40, color: C.ink, fontWeight: 700, marginTop: 8, textAlign: 'center' }}>{en ? `“${d.strengthTopic}”` : `「${d.strengthTopic}」`}</div>
              <div style={{ fontSize: 18, color: C.sub, marginTop: 8 }}>{en ? 'Every question on it was right this session.' : '今節呢個課題嘅題目全部答啱。'}</div>
            </Bento>
          </div>
        )}

        {d.focusTopic && (
          <div style={{ marginTop: 20, width: '100%', background: 'rgba(122,158,126,0.08)', border: '1px solid rgba(122,158,126,0.25)', borderRadius: 24, padding: 32, textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontSize: 22, color: C.clay }}>{en ? "Today's focus to crack" : '今日最想攻克'}</div>
            <div style={{ fontSize: 34, color: C.ink, fontWeight: 700, marginTop: 8 }}>{en ? `“${d.focusTopic}”` : `「${d.focusTopic}」`}</div>
            <div style={{ fontSize: 18, color: C.sub, marginTop: 10 }}>{en ? "You've spotted a spot to level up." : '你發現咗一個可以再進一步嘅位。'}</div>
            <div style={{ fontSize: 20, color: C.sage, fontWeight: 600, marginTop: 4 }}>{en ? "Crack this and you're one step closer to your goal." : '攻克呢度，就離目標更近一步。'}</div>
          </div>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 1 }}>
          <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrSrc} alt="" width={176} height={176} style={{ display: 'block', borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 22, color: C.sage, fontWeight: 600, marginTop: 12 }}>{en ? 'Scan to enter' : '掃描入站'}</div>
          <div style={{ fontSize: 18, color: C.faint, marginTop: 6 }}>{d.siteUrl}</div>
          <div style={{ fontSize: 15, color: C.faint, marginTop: 10 }}>© DSE Level Up 2026 · Not affiliated with HKEAA</div>
        </div>
      </div>
    )
  }
)

export default DailyStatsCard
