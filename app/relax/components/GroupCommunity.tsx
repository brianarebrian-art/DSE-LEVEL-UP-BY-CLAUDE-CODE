'use client'

import { useState } from 'react'
import BackButton from './BackButton'

// 同大家一齊 — Instagram Group 影子溫書室（IG 最終版 spec，2026-07-11）。
// 真實連結已開通，由 school.q.1（學生自發）管理 —— 唔係官方頻道，卡片內有清楚聲明。
// 後備通道：email waitlist（POST /api/ig-waitlist，Supabase ig_group_waitlist）。
const INSTAGRAM_GROUP_LINK = 'https://ig.me/j/AbYCy6ZUDR-yWVPN/'
const IG_GROUP_NAME = 'DSE LEVEL UP 影子溫書室'
const IG_GROUP_ADMIN = 'school.q.1'

const IG_FEATURES = [
  { icon: '📷', title: '限時動態打卡', desc: '深夜溫書打卡，互相監督唔孤單' },
  { icon: '💬', title: '群組聊天', desc: '科目互助區，Econ／中文／英文／數學' },
  { icon: '✉️', title: '私訊樹洞', desc: '一對一傾偈，講完就算，冇人會 judge' },
  { icon: '📌', title: '精選動態', desc: '溫書資源、錯題整理、考試貼士' },
  { icon: '🎙️', title: '語音傾偈', desc: '偶爾開群組語音，一齊溫書（安靜模式）' },
]

export default function GroupCommunity() {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNotify = async () => {
    const trimmed = email.trim()
    if (!trimmed || !trimmed.includes('@') || sending) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch('/api/ig-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })
      if (!res.ok) throw new Error('bad status')
      setSubmitted(true)
    } catch {
      setError('未能記錄，請過一陣再試，或者直接喺 IG 搵管理員。')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <BackButton />
      <div className="mt-4 mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#E8E8EC]">👥 同大家一齊</h1>
        <p className="text-sm text-[#8B8B96] mt-1">
          你唔係一個人。入嚟傾偈、問問題、或者純粹睇人打卡。
        </p>
      </div>

      {/* 主卡：IG Group 真連結 CTA */}
      <div className="rounded-xl bg-[#14141B] border border-[#FF006E]/20 p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)' }}
            aria-hidden
          >
            📷
          </div>
          <div>
            <h2 className="text-base font-bold text-[#E8E8EC]">{IG_GROUP_NAME}</h2>
            <p className="text-xs text-[#8B8B96]">Instagram Group · 由 {IG_GROUP_ADMIN} 管理</p>
          </div>
        </div>

        <p className="text-sm text-[#8B8B96] leading-relaxed mb-4">
          一個冇壓力嘅空間。你可以問 Econ 點解，可以呻中文範文太難，
          可以純粹講「今日好攰」。由同路人管理，唔係官方，更似朋友。
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {['🌙 深夜溫書打卡', '📚 科目互助', '🫂 樹洞傾偈'].map((tag) => (
            <span key={tag} className="px-2.5 py-1.5 bg-[#FF006E]/10 rounded-full text-xs text-[#FF006E]">
              {tag}
            </span>
          ))}
        </div>

        <a
          href={INSTAGRAM_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center min-h-11 py-3 rounded-[10px] bg-[#FF006E] text-[#0A0A0F] font-medium text-sm hover:bg-[#FF006E]/90 active:scale-[0.98] transition-all"
        >
          加入 IG Group →
        </a>
      </div>

      {/* 群組功能一覽 */}
      <div className="rounded-xl bg-[#14141B] border border-white/5 p-5 mb-4">
        <h3 className="text-sm font-medium mb-3 text-[#8B8B96]">📋 群組功能一覽</h3>
        <div className="space-y-3">
          {IG_FEATURES.map((feature) => (
            <div key={feature.title} className="flex items-start gap-3">
              <span className="text-lg" aria-hidden>{feature.icon}</span>
              <div>
                <div className="text-sm font-medium text-[#E8E8EC]">{feature.title}</div>
                <div className="text-xs text-[#8B8B96]">{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 關於管理員 — 學生自發，唔係官方（透明聲明，NON-NEGOTIABLE） */}
      <div className="rounded-xl bg-[#14141B] border border-white/5 p-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-lg" aria-hidden>👤</span>
          <div>
            <div className="text-sm font-medium text-[#E8E8EC]">關於管理員</div>
            <div className="text-xs text-[#8B8B96] leading-relaxed mt-1">
              呢個群組由 {IG_GROUP_ADMIN} 開設同管理，係學生自發嘅溫書空間，
              唔係 DSE LEVEL UP 官方頻道。如有問題，請直接聯絡群組管理員。
            </div>
          </div>
        </div>
      </div>

      {/* 後備通道：email 通知（連結失效／資源更新） */}
      <div className="rounded-xl bg-[#14141B] border border-white/5 p-5">
        <h3 className="text-sm font-medium mb-2 text-[#E8E8EC]">📧 留低聯絡</h3>
        <p className="text-xs text-[#8B8B96] mb-3">
          如果 IG Group 連結失效，或者你想收到最新溫書資源通知。
        </p>

        {submitted ? (
          <p className="text-sm text-[#00F5D4]">✓ 已記錄，有消息會通知你</p>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleNotify() }}
                placeholder="your@email.com"
                aria-label="Email"
                className="flex-1 min-w-0 px-3 py-2.5 min-h-11 bg-[#0A0A0F] border border-white/10 rounded-[10px] text-sm text-[#E8E8EC] placeholder-[#8B8B96] focus:border-[#FF006E]/50 focus:outline-none"
              />
              <button
                onClick={() => void handleNotify()}
                disabled={!email.trim().includes('@') || sending}
                className="px-4 py-2.5 min-h-11 bg-[#14141B] border border-[#FF006E]/30 rounded-[10px] text-sm text-[#FF006E] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                {sending ? '記錄中…' : '通知我'}
              </button>
            </div>
            {error && <p className="text-xs text-amber-400/90 mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}
