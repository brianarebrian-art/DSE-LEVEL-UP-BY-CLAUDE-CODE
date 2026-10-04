'use client'

import { HelpCircle } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { SESSION_SIZE } from '@/lib/entitlements'

// FAQ 手風琴（Jack/客戶體驗）— 用原生 <details>/<summary>：零 JS 狀態、鍵盤
// 無障礙自帶。完整 20 條見 content/community/faq.md；呢度精選 8 條上站。
// Light-first migration (2026-07-21, task #97): 白卡 + #008B84 accent，weight 400/500。

const FAQS: { qZh: string; qEn: string; aZh: string; aEn: string }[] = [
  {
    qZh: '呢個平台真係完全免費？', qEn: 'Is this platform really free?',
    aZh: '係。核心刷題功能永久免費，無會員制、無隱藏收費。我哋行喺免費雲端方案上，營運成本極低。',
    aEn: 'Yes. The core practice features are free forever — no membership, no hidden fees. We run on free-tier cloud infrastructure.',
  },
  {
    qZh: '題目係咪抄歷屆試題？', qEn: 'Are the questions copied from past papers?',
    aZh: '唔係。所有題目都係對照課程及評估指引獨立改寫嘅原創題。歷屆試題版權屬 HKEAA，官方試題請到 HKEAA 網站。透明度頁講清楚每條題目上線前要過邊啲自動檢查。',
    aEn: 'No. Every item is an original rewrite aligned to the syllabus and assessment guide. Past papers are HKEAA copyright — get those from the HKEAA site. The transparency page sets out the automated checks every question passes before it goes live.',
  },
  {
    qZh: '答錯之後會點？', qEn: 'What happens after a wrong answer?',
    aZh: '冇紅色交叉，亦冇「錯咗」兩隻字。解析會即刻出現：先畀你第一步，想睇晒撳一下就得（亦可以揀以後直接睇晒）。冇倒數、冇計時、冇追問題。做書寫題或者用答題紙對答案嗰陣，你仍然可以揀錯因，嗰啲會累積成你嘅錯誤模式。',
    aEn: 'No red cross and no “wrong”. The explanation appears straight away: first step first, one tap for the rest (or choose to always see it all). No countdown, no timer, no follow-up question. When you do written questions or check a paper answer sheet, you can still tag the cause of a mistake, and those tags build your error patterns.',
  },
  {
    qZh: '「錯誤模式」係乜嚟？', qEn: 'What are “error patterns”?',
    aZh: '你每次錯因自診都會累積成一幅分佈圖，話你知自己最常跌喺「概念盲區」「審題陷阱」定「運算粗心」，仲會留意連續同類錯誤。呢啲全部按你自己揀嘅錯因計，唔係系統診斷。',
    aEn: 'Your self-diagnosed error causes build a distribution showing whether you most often trip on concepts, misreading, or careless slips — including repeat streaks. It is all counted from the causes you picked yourself, not a diagnosis by the system.',
  },
  {
    qZh: '我嘅進度存喺邊？會唔會唔見咗？', qEn: 'Where is my progress stored?',
    aZh: '預設存喺你部機（localStorage）。用 Google 登入後會雲端同步，轉機都攞得返。我哋唔賣數據、唔落追蹤廣告。',
    aEn: 'Locally on your device by default; sign in with Google to sync to the cloud. We never sell data or run tracking ads.',
  },
  {
    qZh: '發現題目有錯點算？', qEn: 'What if I find a mistake in a question?',
    aZh: '每條題目答完之後，解析下面都有「呢條題有問題？話我哋知」掣：揀問題類別，撳「送出」就得，會自動帶埋題號；想講多啲，可以 email dselevelup@gmail.com。我哋會對照課綱核實，屬實即修正。',
    aEn: 'After you answer, the explanation of every question has a “Something wrong with this question?” button: pick the kind of problem and press Send, and the question number goes with it. To tell us more, email dselevelup@gmail.com. We verify against the syllabus and fix confirmed errors.',
  },
  {
    qZh: '練習表現估算準唔準？', qEn: 'How accurate is the practice performance estimate?',
    aZh: `只係按你喺本平台表現嘅自我評估參考，並非官方預測，亦唔構成任何成績保證。結果頁唔會出 DSE 等級，只寫你答對幾多題同今節表現；${SESSION_SIZE} 題分辨唔到相鄰等級，我哋唔會扮分辨到。累積估算喺「練習表現估算」頁，做多幾節範圍會收窄。最終成績以 HKEAA 公布為準。`,
    aEn: `It is a self-assessment reference based on your practice here — not an official prediction and never a guarantee. The result page shows no DSE level, only your score and a word about the session: ${SESSION_SIZE} questions cannot separate neighbouring levels, and we will not pretend otherwise. The cumulative estimate is on its own page, and its range narrows as you complete more sets.`,
  },
  {
    qZh: 'SEN 同學有咩支援？', qEn: 'What support is there for SEN students?',
    aZh: '無障礙設定（閱讀尺防跳行、易讀字體、字級、行距、字距、一鍵舒適模式）喺手機頁頂嘅無障礙掣，平板同電腦喺左下角；「先做到呢度」零罪疚收工喺題目頁頂。做題途中隨時撳得休息，唞幾耐計時就順延幾耐；想淨係專注一題就撳 Shift + F 開專注燈。呼吸練習喺「呼吸空間」，每週休息日喺帳戶頁揀。全部自選、預設關。有其他需要歡迎話我哋知。',
    aEn: 'Accessibility settings (reading ruler, easy-read font, text size, line and letter spacing, one-tap comfort mode) sit behind the accessibility button at the top of the page on phones, and in the bottom-left corner on tablets and computers. A guilt-free “Stop here for now” is at the top of each question. You can rest mid-session — the timer is extended by exactly as long as you rest — and Shift + F dims everything around the question. Breathing exercises live in Breathing Space, and weekly rest days are set in your account. All of it is opt-in and off by default. Tell us what else would help.',
  },
]

export default function FAQSection() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6 mt-5">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle size={20} className="text-accent" />
        <h2 className="font-medium text-lg text-ink">{en ? 'FAQ' : '常見問題'}</h2>
      </div>
      <div className="divide-y divide-line">
        {FAQS.map((f, i) => (
          <details key={i} className="group py-2.5">
            <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              <span>{en ? f.qEn : f.qZh}</span>
              <span className="text-ink-muted group-open:rotate-45 transition-transform shrink-0 mt-0.5">＋</span>
            </summary>
            <p className="text-sm text-ink-muted leading-relaxed mt-2 pr-6">{en ? f.aEn : f.aZh}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
