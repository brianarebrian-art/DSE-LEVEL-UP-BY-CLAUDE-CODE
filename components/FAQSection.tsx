'use client'

import { HelpCircle } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

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
    aZh: '唔係。所有題目都係對照課程及評估指引獨立改寫嘅原創題。歷屆試題版權屬 HKEAA，官方試題請到 HKEAA 網站。',
    aEn: 'No. Every question is independently written against the C&A guides. Past papers are HKEAA copyright — get the official ones from HKEAA.',
  },
  {
    qZh: '點解答錯會鎖 60 秒？', qEn: 'Why am I locked for 60 seconds after a wrong answer?',
    aZh: '錯題唔反思，操幾多都冇用。60 秒內你要診斷自己嘅錯因（概念／審題／粗心）並答對反思題，先解得鎖。怕壓力可以開「柔和計時」。',
    aEn: 'Drilling without reflection is wasted effort. In those 60 seconds you diagnose your error cause and answer a follow-up. A “Calm timer” mode is available.',
  },
  {
    qZh: '「錯因 DNA」係乜嚟？', qEn: 'What is “Error DNA”?',
    aZh: '你每次錯因自診都會累積成一幅分佈圖，話你知自己最常跌喺「概念盲區」「審題陷阱」定「運算粗心」，仲會偵測連續同類錯誤。',
    aEn: 'Your self-diagnosed error causes build a distribution showing whether you most often trip on concepts, misreading, or careless slips — including repeat streaks.',
  },
  {
    qZh: '我嘅進度存喺邊？會唔會唔見咗？', qEn: 'Where is my progress stored?',
    aZh: '預設存喺你部機（localStorage）。用 Google 登入後會雲端同步，轉機都攞得返。我哋唔賣數據、唔落追蹤廣告。',
    aEn: 'Locally on your device by default; sign in with Google to sync to the cloud. We never sell data or run tracking ads.',
  },
  {
    qZh: '發現題目有錯點算？', qEn: 'What if I find a mistake in a question?',
    aZh: 'Email dselevelup@gmail.com 或喺社群 #平台反饋 留言。我哋會對照課綱核實，屬實即修正——學術準確係我哋嘅生死線。',
    aEn: 'Email dselevelup@gmail.com. We verify against the syllabus and fix confirmed errors — academic accuracy is our red line.',
  },
  {
    qZh: '等級預測準唔準？', qEn: 'How accurate is the level estimate?',
    aZh: '只係按你喺本平台表現嘅自我評估參考，並非官方預測，亦唔構成任何成績保證。最終成績以 HKEAA 公布為準。',
    aEn: 'It is a self-assessment reference based on your practice here — not an official prediction and never a guarantee.',
  },
  {
    qZh: 'SEN 同學有咩支援？', qEn: 'What support is there for SEN students?',
    aZh: '練習頁左下角有「閱讀尺」（防跳行）、「易讀字體」同「唞一唞」呼吸練習；反思鎖有柔和計時模式。有其他需要歡迎話我哋知。',
    aEn: 'The practice page has a reading ruler, an easy-font toggle, a breathing exercise, and a calm-timer mode for the reflection lock. Tell us what else would help.',
  },
]

export default function FAQSection() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mt-5">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle size={20} className="text-[#008B84]" />
        <h2 className="font-medium text-lg text-[#1A1A1A]">{en ? 'FAQ' : '常見問題'}</h2>
      </div>
      <div className="divide-y divide-black/[0.06]">
        {FAQS.map((f, i) => (
          <details key={i} className="group py-2.5">
            <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-medium text-[#2D2D2D] hover:text-[#1A1A1A] transition-colors">
              <span>{en ? f.qEn : f.qZh}</span>
              <span className="text-[#9CA3AF] group-open:rotate-45 transition-transform shrink-0 mt-0.5">＋</span>
            </summary>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mt-2 pr-6">{en ? f.aEn : f.aZh}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
