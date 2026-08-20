'use client'

import { ExternalLink } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 守護者致謝名單（2026-07-30）。調性：謙遜、社群感 —— 唔係「贊助商名單」，
// 而係「一齊砌出嚟嘅同路人」。低調，唔搶上方內容風頭。
//
// ── 對規格嘅三處修正（規格所寫嘅唔存在／同全站唔一致）─────────────────────────
// 1. 規格點名要用 `dse-border-divider`／`dse-text-secondary`／`dse-text-tertiary`／
//    `dse-bg-surface-muted`／`dse-text-accent` 五個 token —— 本 repo 【一個都冇】。
//    Tailwind 對未定義嘅 utility 唔會報錯，只會唔生成 class，結果就係「冇色」→
//    繼承父層色 —— 即係今日修足一日嘅同一類 bug。已按規格列出嘅意圖對應到真 token：
//      divider → border-line · secondary → ink-soft · tertiary → ink-muted
//      surface-muted → surface-sunken · accent → accent
// 2. 規格寫 Light accent = `#0066CC`（藍）。全站 accent 係青 `#006B65`；用藍會同
//    全站色系斷裂。已用真 token（Cyber 值 `#00F5D4` 同規格一致）。
// 3. 規格要求上下各一條分隔線。下面嗰條【刻意唔加】：Footer 嘅 Trust 層緊接住
//    已經有 `border-t border-line`，兩條線相距 8px 會變成視覺缺陷。
//
// 對比度（實測值見 app/globals.css）：ink-soft 落卡底 12.59／10.65；
// ink-muted 落 surface-sunken 5.82／7.71；accent 落 surface-sunken 4.76／13.99。
//
// 金句刻意【兩個語言都保留原文廣東話】—— 係當事人自己講嘅話，唔代他翻譯。

interface Guardian {
  name: string
  /** 貢獻項目。zh 為原文（不可改），en 為譯文，供英文版讀者理解。 */
  contributions: { zh: string; en: string }[]
  /** 原文金句，兩個語言都照樣顯示。 */
  quoteZh: string
  github: string
  githubLabel: string
}

// 日後加人只需喺呢度 append，卡片會自動循環渲染。
const guardians: Guardian[] = [
  {
    name: 'HugoWong',
    contributions: [
      { zh: '發現數學科微積分題分類錯誤', en: 'Spotted the misclassified calculus questions in Mathematics' },
      { zh: '協助驗證 Supabase 性能架構', en: 'Helped verify the Supabase performance headroom' },
      { zh: '提出 localStorage 篡改防禦方案', en: 'Proposed a localStorage tamper-defence approach' },
    ],
    quoteZh: '掌握邏輯，唔係背答案。寫 code 同溫書，其實都係同一個道理。',
    github: 'https://github.com/hugow0528',
    githubLabel: 'github.com/hugow0528',
  },
]

export default function GuardianCredits() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="py-8">
      <div className="border-t border-line mb-8" />

      <h3 className="text-lg font-medium text-ink-soft mb-4">
        🛡️ {en ? 'Guardians — with thanks' : '守護者致謝名單'}
      </h3>

      <p className="text-sm text-ink-muted mb-6 leading-relaxed">
        {en
          ? 'DSE Level Up is a $0-budget, non-profit project built purely to make revision easier for every Hong Kong DSE candidate. Below are the technical fellow travellers who chose to give their time to students —'
          : 'DSE Level Up 係一個 $0 預算、純粹幫全港 DSE 考生輕鬆溫書嘅非營利專案。以下係願意為學生付出嘅技術同路人——'}
      </p>

      {guardians.map((g) => (
        <div key={g.name} className="bg-surface-sunken rounded-lg p-4 mb-6">
          <p className="font-medium text-ink-soft mb-2">{g.name}</p>
          <ul className="text-sm text-ink-muted mb-3 space-y-1">
            {g.contributions.map((c) => (
              <li key={c.zh}>· {en ? c.en : c.zh}</li>
            ))}
          </ul>
          <p className="text-sm text-ink-muted italic mb-3">「{g.quoteZh}」</p>
          <a
            href={g.github}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-11 inline-flex items-center gap-1 text-sm text-accent hover:underline"
          >
            {/* 規格寫用 lucide 嘅 `Github` icon —— 本 repo lucide-react 1.20.0 冇呢個
                export（品牌 icon 已因商標理由移除，只剩 GitBranch／GitFork 等通用 git
                圖示）。用 ExternalLink 代替：既存在，語意亦準確（開新分頁去外站）。 */}
            <ExternalLink size={14} aria-hidden />
            {g.githubLabel}
          </a>
        </div>
      ))}

      {/* 免責 —— 「協助驗證 Supabase 性能架構」「提出 localStorage 篡改防禦方案」
          呢類字眼好容易被讀成第三方資安審計或品質認證。呢度係致謝，唔係認證，
          必須喺名單緊接住講清楚，唔可以留白等人自己詮釋。 */}
      <p className="text-xs text-ink-muted leading-relaxed mb-6 border border-line rounded-xl p-3 bg-surface-sunken">
        {en
          ? 'This list is a thank-you, not an endorsement. It does not represent a third-party audit, a security certification, or any warranty as to the accuracy of the content. Everyone above contributed voluntarily in their own time, and none of them is responsible for the platform as a whole.'
          : '以上名單純屬感謝，並非背書。它不代表第三方審計、資訊保安認證，亦不構成對內容準確性的任何保證。各位均為義務貢獻，不對平台整體承擔責任。'}
      </p>

      <p className="text-sm text-ink-muted leading-relaxed">
        {en
          ? 'If you have found a bug, a vulnerability or anything that worries you security-wise, do get in touch. We have no bug bounty, no cash prize and no swag — but we would like to offer you one thing: a permanent, public place on this Guardians list.'
          : '如果你都發現咗 Bug、漏洞，或者有安全疑慮，歡迎 DM 我哋。我哋冇 Bug Bounty、冇獎金、冇禮品，但想送你一份心意：永久公開嘅「守護者致謝名單」。'}
      </p>
    </div>
  )
}
