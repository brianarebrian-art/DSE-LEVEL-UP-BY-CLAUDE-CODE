'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import BackButton from './BackButton'

// 👥 戰友集結區 — Instagram Group 影子溫書室（00 後遊戲化包裝，IG 最終版 spec）。
// 真實連結已開通，由 school.q.1（學生自發）管理 —— 唔係官方頻道，卡片內有清楚聲明
// （法律免責內容原封不動，只加英文對照）。後備通道：email waitlist（/api/ig-waitlist）。
const INSTAGRAM_GROUP_LINK = 'https://ig.me/j/AbYCy6ZUDR-yWVPN/'
const IG_GROUP_NAME = 'DSE LEVEL UP 影子溫書室' // i18n-exempt: IG 群組真實名稱（專有名詞）；英文另有 gloss
const IG_GROUP_ADMIN = 'school.q.1'

// 神經霓虹色系（賽博學術風）
// FIX: [A3][A4] 遊戲術語清除：「簽到 Buff」→「心情記錄」、「開黑語音房」→「群組語音房」、
//               「打卡」→「記錄心情」（CEO 命名修訂 2026-07-15）
const IG_FEATURES = [
  { icon: '📸', titleZh: '每日心情記錄', titleEn: 'Daily mood log', descZh: '深夜溫書記錄心情，互相打氣唔孤單', descEn: 'Log your mood on late-night study sessions — keep each other going', color: '#00F5D4' },
  { icon: '💬', titleZh: '科目戰術討論區', titleEn: 'Subject tactics board', descZh: 'Econ／中文／英文／數學互助', descEn: 'Econ / Chinese / English / Maths — help each other out', color: '#FF006E' },
  { icon: '🕳️', titleZh: '1對1 戰友傾偈', titleEn: '1-on-1 buddy chat', descZh: '私訊樹洞，講完就算，冇人會 judge', descEn: 'A private vent space — say it and let it go, no judgement', color: '#9B5DE5' },
  { icon: '📌', titleZh: '精選攻略', titleEn: 'Curated guides', descZh: '溫書資源、錯題整理、考試貼士', descEn: 'Study resources, mistake logs, exam tips', color: '#FEE440' },
  { icon: '🎙️', titleZh: '群組語音房（安靜模式）', titleEn: 'Group voice room (quiet mode)', descZh: '偶爾開群組語音，一齊溫書', descEn: 'Occasional group voice sessions — study together', color: '#00F5D4' },
]

const TAGS = [
  { zh: '🌙 深夜溫書記錄心情', en: '🌙 Late-night mood logs' },
  { zh: '📚 科目互助', en: '📚 Subject help' },
  { zh: '🫂 樹洞傾偈', en: '🫂 Vent & chat' },
]

export default function GroupCommunity() {
  const { locale } = useLocale()
  const en = locale === 'en'
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
      setError(en ? 'Couldn’t save that — try again shortly, or reach the admin directly on IG.' : '未能記錄，請過一陣再試，或者直接喺 IG 搵管理員。')
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <BackButton />
      <div className="mt-4 mb-4 text-center">
        <h1 className="text-2xl font-bold text-[#E8E8EC]">👥 {en ? 'Squad HQ' : '戰友集結區'}</h1>
        <p className="text-sm text-[#8B8B96] mt-1">{en ? "You're not alone. Come team up — don't grind solo." : '你唔係一個人。入嚟組隊，唔單打獨鬥。'}</p>
      </div>

      {/* 狀態列（霓虹，誠實文案 —— 唔用作假嘅在線／打卡數字） */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-5 text-xs">
        <span className="text-neon-pink">🔥 {en ? 'Late-night squad HQ · anonymous group study' : '深夜戰友集結區 · 匿名組隊溫書'}</span>
        <span className="text-neon-cyan">📍 {en ? 'Just showing up makes you one of us' : '入到嚟就已經係一分子'}</span>
      </div>

      {/* 公會招募令：玻璃擬態 + 霓虹邊框發光，hover 上浮 + 發光增強 */}
      <div className="rounded-xl bg-white/5 backdrop-blur-md border border-neon-pink/40 p-5 mb-4 transition-all hover:-translate-y-0.5 hover:border-neon-pink/70 hover:shadow-[0_0_28px_rgba(255,0,110,0.3)]">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)' }}
            aria-hidden
          >
            📷
          </div>
          <div>
            <h2 className="text-base font-bold text-[#E8E8EC]">{en ? 'DSE LEVEL UP · Shadow Study Room' : IG_GROUP_NAME}</h2>
            <p className="text-xs text-[#8B8B96]">{en ? 'The DSE final stretch · anonymous group study' : 'DSE 最後戰線 · 匿名組隊溫書'}</p>
            <p className="text-xs text-[#8B8B96]">{en ? "Run by fellow students who've been there · not official, more like comrades" : '由同路人學長姐管理 · 唔係官方，更似戰友'}</p>
          </div>
        </div>

        <p className="text-sm text-[#8B8B96] leading-relaxed mb-4">
          {en
            ? "A pressure-free space. Ask why Econ works the way it does, moan that the Chinese set texts are too hard, or just say “I'm wrecked today.” People who get it have your back — you don't grind alone."
            : '一個冇壓力嘅空間。你可以問 Econ 點解，可以呻中文範文太難，可以純粹講「今日好攰」。同路人罩住你，唔單打獨鬥。'}
        </p>

        <div className="flex flex-wrap gap-2 mb-5">
          {TAGS.map((tag) => (
            <span key={tag.zh} className="px-3 py-1.5 rounded-full text-xs border border-neon-pink/40 bg-neon-pink/10 text-neon-pink">
              {en ? tag.en : tag.zh}
            </span>
          ))}
        </div>

        <a
          href={INSTAGRAM_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center min-h-11 py-3 rounded-[10px] text-white font-bold text-sm transition-all active:scale-[0.98] hover:shadow-[0_0_28px_rgba(155,93,229,0.5)]"
          style={{ background: 'linear-gradient(90deg, var(--color-neon-pink), var(--color-neon-purple))' }}
        >
          {en ? 'Team up now →' : '立即組隊 →'}
        </a>
      </div>

      {/* 功能一覽：Bento Box 網格，每張獨立霓虹色 icon + hover 動畫 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {IG_FEATURES.map((f) => (
          <div
            key={f.titleZh}
            className="rounded-xl bg-[#14141B] border border-white/10 p-4 transition-all hover:-translate-y-0.5"
            style={{ ['--glow' as string]: f.color }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2"
              style={{ background: `${f.color}1f`, boxShadow: `0 0 12px ${f.color}33` }}
              aria-hidden
            >
              {f.icon}
            </div>
            <div className="text-sm font-medium text-[#E8E8EC]">{en ? f.titleEn : f.titleZh}</div>
            <div className="text-xs text-[#8B8B96] mt-0.5">{en ? f.descEn : f.descZh}</div>
          </div>
        ))}
      </div>

      {/* 關於管理員 — 學生自發，唔係官方（法律免責內容，NON-NEGOTIABLE，中文原文不變，加英文對照） */}
      <div className="rounded-xl bg-[#14141B] border border-white/5 p-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-lg" aria-hidden>👤</span>
          <div>
            <div className="text-sm font-medium text-[#E8E8EC]">{en ? 'About the admin' : '關於管理員'}</div>
            <div className="text-xs text-[#8B8B96] leading-relaxed mt-1">
              {en
                ? `This group is created and run by ${IG_GROUP_ADMIN}, a student-led study space — not an official DSE LEVEL UP channel. For any issues, please contact the group admin directly.`
                : `呢個群組由 ${IG_GROUP_ADMIN} 開設同管理，係學生自發嘅溫書空間，唔係 DSE LEVEL UP 官方頻道。如有問題，請直接聯絡群組管理員。`}
            </div>
          </div>
        </div>
      </div>

      {/* 後備通道：email 通知（連結失效／資源更新） */}
      <div className="rounded-xl bg-[#14141B] border border-white/5 p-5">
        <h3 className="text-sm font-medium mb-2 text-[#E8E8EC]">📧 {en ? 'Leave your contact' : '留低聯絡'}</h3>
        <p className="text-xs text-[#8B8B96] mb-3">
          {en ? "In case the IG group link stops working, or you'd like updates on new study resources." : '如果 IG Group 連結失效，或者你想收到最新溫書資源通知。'}
        </p>

        {submitted ? (
          <p className="text-sm text-neon-cyan">{en ? "✓ Saved — we'll let you know when there's news" : '✓ 已記錄，有消息會通知你'}</p>
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
                className="flex-1 min-w-0 px-3 py-2.5 min-h-11 bg-[#0A0A0F] border border-white/10 rounded-[10px] text-sm text-[#E8E8EC] placeholder-[#8B8B96] focus:border-neon-pink/50 focus:outline-none"
              />
              <button
                onClick={() => void handleNotify()}
                disabled={!email.trim().includes('@') || sending}
                className="px-4 py-2.5 min-h-11 bg-[#14141B] border border-neon-pink/30 rounded-[10px] text-sm text-neon-pink disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                {sending ? (en ? 'Saving…' : '記錄中…') : en ? 'Notify me' : '通知我'}
              </button>
            </div>
            {error && <p className="text-xs text-amber-400/90 mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}
