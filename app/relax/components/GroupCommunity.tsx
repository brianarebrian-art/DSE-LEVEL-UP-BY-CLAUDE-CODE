'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import ExternalLinkGate from '@/components/ExternalLinkGate'
import BackButton from './BackButton'

// 👥 戰友集結區 — Instagram Group 影子溫書室（00 後遊戲化包裝，IG 最終版 spec）。
// 真實連結已開通，由 school.q.1（學生自發）管理 —— 唔係官方頻道，卡片內有清楚聲明
// （法律免責內容原封不動，只加英文對照）。後備通道：email waitlist（/api/ig-waitlist）。
//
// 2026-08-20 安全化（信譽審核 §1）—— 三項結構改動，全部可 revert：
//  ① 免責由頁底搬到 CTA【上面】。舊版次序係「立即組隊」大按鈕 → …… → 「唔係官方
//     頻道」。學生撳完就已經離開，先至有機會碌到嗰段字。免責喺點擊之後出現＝冇免責。
//  ② 刪走「1對1 戰友傾偈（私訊樹洞）」同「群組語音房」兩張宣傳卡。呢兩項唔係
//     「有呢個功能」，係我哋喺一個心理支援脈絡度【主動推銷未成年人同陌生人私訊／
//     語音】。群組本身保留（真實學生社群，加閘門就夠），但呢句唔應該由我哋講。
//  ③ email 收集點補《私隱條例》DPP1(3) 式告知：邊個收、做乜、點刪除。
const INSTAGRAM_GROUP_LINK = 'https://ig.me/j/AbYCy6ZUDR-yWVPN/'
const IG_GROUP_NAME = 'DSE LEVEL UP 影子溫書室' // i18n-exempt: IG 群組真實名稱（專有名詞）；英文另有 gloss
const IG_GROUP_ADMIN = 'school.q.1'

// 神經霓虹色系（賽博學術風）
// FIX: [A3][A4] 遊戲術語清除：「簽到 Buff」→「心情記錄」、「開黑語音房」→「群組語音房」、
//               「打卡」→「記錄心情」（CEO 命名修訂 2026-07-15）
const IG_FEATURES = [
  { icon: '📸', titleZh: '每日心情記錄', titleEn: 'Daily mood log', descZh: '深夜溫書記錄心情，互相打氣唔孤單', descEn: 'Log your mood on late-night study sessions — keep each other going', color: '#00F5D4' },
  { icon: '💬', titleZh: '科目戰術討論區', titleEn: 'Subject tactics board', descZh: 'Econ／中文／英文／數學互助', descEn: 'Econ / Chinese / English / Maths — help each other out', color: '#FF006E' },
  { icon: '📌', titleZh: '精選攻略', titleEn: 'Curated guides', descZh: '溫書資源、錯題整理、考試貼士', descEn: 'Study resources, mistake logs, exam tips', color: '#FEE440' },
]

const TAGS = [
  { zh: '🌙 深夜溫書記錄心情', en: '🌙 Late-night mood logs' },
  { zh: '📚 科目互助', en: '📚 Subject help' },
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

        <div className="flex flex-wrap gap-2 mb-4">
          {TAGS.map((tag) => (
            <span key={tag.zh} className="px-3 py-1.5 rounded-full text-xs border border-neon-pink/40 bg-neon-pink/10 text-neon-pink">
              {en ? tag.en : tag.zh}
            </span>
          ))}
        </div>

        {/* 關於管理員 — 學生自發，唔係官方（法律免責內容，NON-NEGOTIABLE，中文原文不變）。
            2026-08-20：由頁底搬到【CTA 上面】，令學生喺撳走之前一定睇得到。 */}
        <div className="rounded-xl bg-black/30 border border-white/10 p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-lg" aria-hidden>👤</span>
            <div>
              <div className="text-sm font-medium text-[#E8E8EC]">{en ? 'Before you join' : '入群之前'}</div>
              <div className="text-xs text-[#8B8B96] leading-relaxed mt-1">
                {en
                  ? `This group is created and run by ${IG_GROUP_ADMIN}, a student-led study space — not an official DSE LEVEL UP channel. For any issues, please contact the group admin directly.`
                  : `呢個群組由 ${IG_GROUP_ADMIN} 開設同管理，係學生自發嘅溫書空間，唔係 DSE LEVEL UP 官方頻道。如有問題，請直接聯絡群組管理員。`}
              </div>
              <ul className="text-xs text-[#8B8B96] leading-relaxed mt-2 space-y-1 list-disc pl-4">
                <li>{en ? 'Never share your phone number, address, school or photos with people you don’t know.' : '唔好向唔認識嘅人畀電話、地址、就讀學校或者相片。'}</li>
                <li>{en ? 'If anyone asks to move to private chat, asks for photos, or makes you uncomfortable — leave and tell an adult you trust.' : '如果有人要求私下傾、要相，或者令你唔舒服 —— 離開，並且話畀你信得過嘅大人知。'}</li>
                <li>{en ? 'We cannot moderate that group and cannot see what happens in it.' : '我哋無法審核嗰個群組，亦睇唔到入面發生咩事。'}</li>
              </ul>
            </div>
          </div>
        </div>

        <ExternalLinkGate
          href={INSTAGRAM_GROUP_LINK}
          platform="Instagram"
          extraWarning={
            en
              ? 'This group is student-run, not an official DSE LEVEL UP channel — we cannot moderate its content or direct messages. Never share your phone number, address, school or photos with strangers.'
              : '呢個群組由學生自發開設，唔係 DSE LEVEL UP 官方頻道，我哋無法審核入面嘅內容或者私訊。唔好同陌生人分享電話、地址、學校或者相片。'
          }
          className="block w-full text-center min-h-11 py-3 rounded-[10px] text-white font-bold text-sm transition-all active:scale-[0.98] hover:shadow-[0_0_28px_rgba(155,93,229,0.5)]"
          style={{ background: 'linear-gradient(90deg, var(--color-neon-pink), var(--color-neon-purple))' }}
        >
          {en ? 'Team up now →' : '立即組隊 →'}
        </ExternalLinkGate>
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
            {/* 收集點告知（《個人資料（私隱）條例》DPP1(3)：喺收集時或之前講清楚）。
                唔可以淨係喺私隱政策頁寫 —— 學生係喺呢度打 email，就要喺呢度睇到。 */}
            <p className="text-[11px] text-[#8B8B96] leading-relaxed mt-3">
              {en
                ? 'Collected by DSE Level Up and stored on our database. Used only to notify you if the group link changes or when new free study resources are out — never sold, never used for ads. Providing it is optional. To have it deleted, email us and we will remove it.'
                : '由 DSE Level Up 收集並存放喺我哋嘅資料庫。只會用嚟通知你群組連結變更或者新嘅免費溫書資源，唔會出售，亦唔會用作廣告。填唔填係自願嘅。想刪除，電郵我哋就會移除。'}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
