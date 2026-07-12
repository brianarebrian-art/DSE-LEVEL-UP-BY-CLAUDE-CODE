'use client'

import { forwardRef } from 'react'

// 每日戰績卡（1080×1920，Cyber-Academic 暗黑學術風 + Bento）。html2canvas 會把呢個
// off-screen DOM 影成 PNG 俾用戶分享去 IG Story。
//
// 誠實原則（Emma/UDL）：只顯示 REAL session 數據 —— 做題數、正確率、用時、難度分佈、
// 今次真嘅強項／最想攻克課題。**冇** 虛構 JUPAS 收生機率、**冇** 「搶多 X 分」預測、
// **冇** 之前特登移除咗嘅 streak/連擊。無紅色、無 FAIL、無他人排名比較。

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
  igLink: string
  siteUrl: string
}

const C = {
  cyan: '#00F5D4', pink: '#FF006E', yellow: '#FEE440', purple: '#9B5DE5',
  bg: '#0A0A0F', card: '#12121A', ink: '#E8E8EC', sub: '#8A8A96', faint: '#5A5A64',
}

const Bento = ({ children, border, full }: { children: React.ReactNode; border: string; full?: boolean }) => (
  <div style={{
    background: C.card, border: `1px solid ${border}`, borderRadius: 24, padding: 32,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gridColumn: full ? '1 / -1' : undefined, width: '100%',
  }}>{children}</div>
)

const DailyStatsCard = forwardRef<HTMLDivElement, { data: DailyStatsCardData }>(function DailyStatsCard({ data }, ref) {
  const d = data
  return (
    <div ref={ref} style={{
      width: 1080, height: 1920, background: C.bg, color: C.ink,
      display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 60,
      fontFamily: 'Inter, "PingFang HK", "Microsoft JhengHei", sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient 光斑 */}
      <div style={{ position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,212,0.05) 0%, transparent 70%)', top: -220, left: -220 }} />
      <div style={{ position: 'absolute', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,0,110,0.04) 0%, transparent 70%)', bottom: 120, right: -220 }} />

      {/* 品牌 */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 52, fontWeight: 700, color: C.cyan, textShadow: '0 0 40px rgba(0,245,212,0.35)' }}>DSE LEVEL UP</div>
        <div style={{ fontSize: 22, color: C.sub, marginTop: 8 }}>最後 30 日，唔係溫書，係搶分</div>
      </div>

      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', margin: '28px 0 20px' }} />
      <div style={{ fontSize: 22, color: C.sub, marginBottom: 28 }}>{d.date} · {d.subject} · 今日戰績</div>

      {/* Bento grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, width: '100%', zIndex: 1 }}>
        <Bento border="rgba(0,245,212,0.18)">
          <div style={{ fontSize: 22, color: C.sub }}>今日做題</div>
          <div style={{ fontSize: 128, fontWeight: 700, color: C.cyan, textShadow: '0 0 40px rgba(0,245,212,0.3)', lineHeight: 1 }}>{d.questionsDone}</div>
          <div style={{ fontSize: 26, color: C.cyan }}>道</div>
        </Bento>
        <Bento border="rgba(254,228,64,0.18)">
          <div style={{ fontSize: 22, color: C.sub }}>正確率</div>
          <div style={{ fontSize: 104, fontWeight: 700, color: C.yellow, textShadow: '0 0 40px rgba(254,228,64,0.3)', lineHeight: 1 }}>{d.accuracy}%</div>
          <div style={{ fontSize: 22, color: C.sub, marginTop: 8 }}>{d.correctCount} / {d.totalCount} 做啱</div>
        </Bento>
      </div>

      {/* 用時 */}
      <div style={{ marginTop: 20, width: '100%' }}>
        <Bento border="rgba(155,93,229,0.18)" full>
          <div style={{ fontSize: 30, color: C.purple, fontWeight: 600 }}>用時 {d.timeSpent}</div>
          <div style={{ fontSize: 20, color: C.sub, marginTop: 4 }}>平均每題 {d.avgPerQuestion}</div>
        </Bento>
      </div>

      {/* 難度分佈（真數據，取代虛假「科目分佈」）*/}
      {d.tiers && d.tiers.length > 0 && (
        <div style={{ marginTop: 20, width: '100%' }}>
          <Bento border="rgba(255,255,255,0.08)" full>
            <div style={{ fontSize: 22, color: C.sub }}>今日難度分佈</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 72, marginTop: 20 }}>
              {d.tiers.map((tr) => (
                <div key={tr.label} style={{ textAlign: 'center' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: tr.color, margin: '0 auto 10px', boxShadow: `0 0 14px ${tr.color}66` }} />
                  <div style={{ fontSize: 22, color: C.ink }}>{tr.label}</div>
                  <div style={{ fontSize: 18, color: C.sub, marginTop: 2 }}>{tr.correct}/{tr.total} 做啱</div>
                </div>
              ))}
            </div>
          </Bento>
        </div>
      )}

      {/* 強項（真數據）*/}
      {d.strengthTopic && (
        <div style={{ marginTop: 20, width: '100%' }}>
          <Bento border="rgba(155,93,229,0.18)" full>
            <div style={{ fontSize: 22, color: C.purple, fontWeight: 600 }}>你今日嘅強項 💜</div>
            <div style={{ fontSize: 40, color: C.ink, fontWeight: 700, marginTop: 8, textAlign: 'center' }}>「{d.strengthTopic}」</div>
            <div style={{ fontSize: 18, color: C.sub, marginTop: 8 }}>呢個位你掌握得好穩，繼續保持。</div>
          </Bento>
        </div>
      )}

      {/* 今日最想攻克（真數據，正向、無 JUPAS/無虛構分數）*/}
      {d.focusTopic && (
        <div style={{ marginTop: 20, width: '100%', background: 'rgba(0,245,212,0.05)', border: '1px solid rgba(0,245,212,0.2)', borderRadius: 24, padding: 32, textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: 22, color: C.yellow }}>今日最想攻克</div>
          <div style={{ fontSize: 34, color: C.ink, fontWeight: 700, marginTop: 8 }}>「{d.focusTopic}」</div>
          <div style={{ fontSize: 18, color: C.sub, marginTop: 10 }}>你發現咗一個可以再進一步嘅位 💡</div>
          <div style={{ fontSize: 20, color: C.cyan, fontWeight: 600, marginTop: 4 }}>攻克呢度，就離目標更近一步。</div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 'auto', textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontSize: 20, color: C.cyan, fontWeight: 600 }}>入 IG 溫書室：{d.igLink}</div>
        <div style={{ fontSize: 18, color: C.faint, marginTop: 6 }}>{d.siteUrl}</div>
        <div style={{ fontSize: 15, color: C.faint, marginTop: 10 }}>© DSE Level Up 2026 · Not affiliated with HKEAA</div>
      </div>
    </div>
  )
})

export default DailyStatsCard
