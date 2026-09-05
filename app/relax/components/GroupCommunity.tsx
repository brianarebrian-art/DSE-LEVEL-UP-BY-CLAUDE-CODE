'use client'

import { useLocale } from '@/lib/i18n'
import ExternalLinkGate from '@/components/ExternalLinkGate'
import BackButton from './BackButton'

// 👥 戰友集結區 — Instagram Group 影子溫書室（00 後遊戲化包裝，IG 最終版 spec）。
// 真實連結已開通，由 school.q.1（學生自發）管理 —— 唔係官方頻道，卡片內有清楚聲明
// （法律免責內容原封不動，只加英文對照）。
//
// 2026-08-20 安全化（信譽審核 §1）—— 三項結構改動，全部可 revert：
//  ① 免責由頁底搬到 CTA【上面】。舊版次序係「立即組隊」大按鈕 → …… → 「唔係官方
//     頻道」。學生撳完就已經離開，先至有機會碌到嗰段字。免責喺點擊之後出現＝冇免責。
//  ② 刪走「1對1 戰友傾偈（私訊樹洞）」同「群組語音房」兩張宣傳卡。呢兩項唔係
//     「有呢個功能」，係我哋喺一個心理支援脈絡度【主動推銷未成年人同陌生人私訊／
//     語音】。群組本身保留（真實學生社群，加閘門就夠），但呢句唔應該由我哋講。
//  ③ 移除「留低聯絡」email 表單。原因唔係文案問題 —— 佢寫入嘅 `ig_group_waitlist`
//     表【喺任何 schema 都唔存在，亦冇任何 migration 建過佢】，所以由第一日起每個
//     學生撳「通知我」都只會見到「未能記錄」。即係我哋喺度問未成年人攞 email，
//     而個嘢根本冇運作過。零收集 → 移除冇損失。要恢復嘅話係產品決定：需要一個
//     migration，同埋一個「值唔值得為咗連結失效通知而儲未成年人 email」嘅答案。
const INSTAGRAM_GROUP_LINK = 'https://ig.me/j/AbYCy6ZUDR-yWVPN/'
const IG_GROUP_NAME = 'DSE LEVEL UP 影子溫書室' // i18n-exempt: IG 群組真實名稱（專有名詞）；英文另有 gloss
const IG_GROUP_ADMIN = 'school.q.1'

// 神經霓虹色系（賽博學術風）
// FIX: [A3][A4] 遊戲術語清除：「簽到 Buff」→「心情記錄」、「開黑語音房」→「群組語音房」、
//               「打卡」→「記錄心情」（CEO 命名修訂 2026-07-15）
const IG_FEATURES = [
  { icon: '📸', titleZh: '每日心情記錄', titleEn: 'Daily mood log', descZh: '深夜溫書記錄心情，互相打氣唔孤單', descEn: 'Log your mood on late-night study sessions — keep each other going', color: 'var(--color-subj-sage)' },
  { icon: '💬', titleZh: '科目戰術討論區', titleEn: 'Subject tactics board', descZh: 'Econ／中文／英文／數學互助', descEn: 'Econ / Chinese / English / Maths — help each other out', color: 'var(--color-subj-rose)' },
  { icon: '📌', titleZh: '精選攻略', titleEn: 'Curated guides', descZh: '溫書資源、錯題整理、考試貼士', descEn: 'Study resources, mistake logs, exam tips', color: 'var(--color-subj-clay)' },
]

const TAGS = [
  { zh: '🌙 深夜溫書記錄心情', en: '🌙 Late-night mood logs' },
  { zh: '📚 科目互助', en: '📚 Subject help' },
]

export default function GroupCommunity() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div>
      <BackButton />
      <div className="mt-4 mb-4 text-center">
        <h1 className="text-2xl font-bold text-ink">👥 {en ? 'Squad HQ' : '戰友集結區'}</h1>
        <p className="text-sm text-ink-muted mt-1">{en ? "You're not alone. Come team up — don't grind solo." : '你唔係一個人。入嚟組隊，唔單打獨鬥。'}</p>
      </div>

      {/* 狀態列（霓虹，誠實文案 —— 唔用作假嘅在線／打卡數字） */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mb-5 text-xs">
        <span className="text-subj-rose">🔥 {en ? 'Late-night squad HQ · anonymous group study' : '深夜戰友集結區 · 匿名組隊溫書'}</span>
        <span className="text-accent">📍 {en ? 'Just showing up makes you one of us' : '入到嚟就已經係一分子'}</span>
      </div>

      {/* 公會招募令：玻璃擬態 + 霓虹邊框發光，hover 上浮 + 發光增強 */}
      <div className="rounded-xl bg-surface-sunken backdrop-blur-md border border-subj-rose/40 p-5 mb-4 transition-all hover:-translate-y-0.5 hover:border-subj-rose/70 hover:shadow-[0_0_28px_rgba(255,0,110,0.3)]">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-neutral-800 text-white text-xl shrink-0"
            /* ⚠️ Instagram 官方品牌漸變，刻意寫死 —— 品牌色唔跟我哋嘅主題走，
               改成莫蘭迪就唔再認得出係 Instagram。呢個唔係漏網之魚。 */
            style={{ background: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)' }}
            aria-hidden
          >
            📷
          </div>
          <div>
            <h2 className="text-base font-bold text-ink">{en ? 'DSE LEVEL UP · Shadow Study Room' : IG_GROUP_NAME}</h2>
            <p className="text-xs text-ink-muted">{en ? 'The DSE final stretch · anonymous group study' : 'DSE 最後戰線 · 匿名組隊溫書'}</p>
            <p className="text-xs text-ink-muted">{en ? "Run by fellow students who've been there · not official, more like comrades" : '由同路人學長姐管理 · 唔係官方，更似戰友'}</p>
          </div>
        </div>

        <p className="text-sm text-ink-muted leading-relaxed mb-4">
          {en
            ? "A pressure-free space. Ask why Econ works the way it does, moan that the Chinese set texts are too hard, or just say “I'm wrecked today.” People who get it have your back — you don't grind alone."
            : '一個冇壓力嘅空間。你可以問 Econ 點解，可以呻中文範文太難，可以純粹講「今日好攰」。同路人罩住你，唔單打獨鬥。'}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {TAGS.map((tag) => (
            <span key={tag.zh} className="px-3 py-1.5 rounded-full text-xs border border-subj-rose/40 bg-subj-rose/10 text-subj-rose">
              {en ? tag.en : tag.zh}
            </span>
          ))}
        </div>

        {/* 關於管理員 — 學生自發，唔係官方（法律免責內容，NON-NEGOTIABLE，中文原文不變）。
            2026-08-20：由頁底搬到【CTA 上面】，令學生喺撳走之前一定睇得到。 */}
        <div className="rounded-xl bg-black/30 border border-line p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-lg" aria-hidden>👤</span>
            <div>
              <div className="text-sm font-medium text-ink">{en ? 'Before you join' : '入群之前'}</div>
              <div className="text-xs text-ink-muted leading-relaxed mt-1">
                {en
                  ? `This group is created and run by ${IG_GROUP_ADMIN}, a student-led study space — not an official DSE LEVEL UP channel. For any issues, please contact the group admin directly.`
                  : `呢個群組由 ${IG_GROUP_ADMIN} 開設同管理，係學生自發嘅溫書空間，唔係 DSE LEVEL UP 官方頻道。如有問題，請直接聯絡群組管理員。`}
              </div>
              <ul className="text-xs text-ink-muted leading-relaxed mt-2 space-y-1 list-disc pl-4">
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
          className="block w-full text-center min-h-11 py-3 rounded-[10px] bg-accent-strong text-on-accent font-bold text-sm transition-all active:scale-[0.98] hover:bg-accent-hover"
        >
          {en ? 'Team up now →' : '立即組隊 →'}
        </ExternalLinkGate>
      </div>

      {/* 功能一覽：Bento Box 網格，每張獨立霓虹色 icon + hover 動畫 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {IG_FEATURES.map((f) => (
          <div
            key={f.titleZh}
            className="rounded-xl bg-surface-raised border border-line p-4 transition-all hover:-translate-y-0.5"
            style={{ ['--glow' as string]: f.color }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2"
              style={{ background: `${f.color}1f`, boxShadow: `0 0 12px ${f.color}33` }}
              aria-hidden
            >
              {f.icon}
            </div>
            <div className="text-sm font-medium text-ink">{en ? f.titleEn : f.titleZh}</div>
            <div className="text-xs text-ink-muted mt-0.5">{en ? f.descEn : f.descZh}</div>
          </div>
        ))}
      </div>

    </div>
  )
}
