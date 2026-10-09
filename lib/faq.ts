import { SESSION_SIZE, sessionMinutes } from '@/lib/entitlements'
import type { Topic } from '@/data/questions/types'

// Questions and answers shown on the page and repeated as FAQPage structured data
// (founders' reply 61a, 2026-10-09: "optimise the Q&A structure for AI answer engines").
// One source for both: structured data that differs from the visible text is a claim
// readers cannot check, and search engines may ignore or penalise it. The structured
// data carries the Chinese text, matching `inLanguage: 'zh-HK'` elsewhere on the site.
//
// Deliberately built from the site's own question bank only. The paper structure on the
// subject page (which exam parts cannot be practised here, whether the exam has multiple
// choice) comes from data/dse-paper-formats.ts, which is derived from HKEAA frameworks and
// may take no new uses after 2026-09-30 (CONTENT_PROVENANCE.md §3). Repeating it here as
// data for AI answer engines would be one, so it stays only where it already was.

export interface FaqEntry { qZh: string; qEn: string; aZh: string; aEn: string }
export interface FaqItem { q: string; a: string }

// Moved from components/FAQSection.tsx so /about can emit FAQPage data from the same text.
// The full list of 20 questions is in content/community/faq.md; these 8 are on the site.
export const ABOUT_FAQS: FaqEntry[] = [
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

export function localiseFaq(items: FaqEntry[], en: boolean): FaqItem[] {
  return items.map((f) => ({ q: en ? f.qEn : f.qZh, a: en ? f.aEn : f.aZh }))
}

/** A topic that has at least one question; the subject page shows only these. */
export function hasQuestions(t: Topic): boolean {
  return (t.mcCount ?? t.count) > 0 || (t.writtenCount ?? 0) > 0
}

const n = (x: number) => x.toLocaleString('en-US')

/**
 * The questions shown at the foot of each subject page. Every figure comes from the
 * live bank (the same counts the page shows above), never from text written by hand.
 */
export function subjectFaq(
  s: { id: string; name: string; nameEn: string; mc: number; written: number; topics: Topic[] },
  en: boolean,
): FaqItem[] {
  const name = en ? s.nameEn : s.name
  const covered = s.topics.filter(hasQuestions).length
  const perSet = Math.min(SESSION_SIZE, s.mc)
  const minutes = sessionMinutes(perSet)

  const countA = en
    ? `There are ${n(s.mc)} multiple-choice${s.written > 0 ? ` and ${n(s.written)} written` : ''} questions across ${covered} topics. Each practice set draws ${perSet} multiple-choice questions and takes about ${minutes} minutes.`
    : `現有 ${n(s.mc)} 條選擇題${s.written > 0 ? `同 ${n(s.written)} 條書寫題` : ''}，分佈喺 ${covered} 個課題。每節練習抽 ${perSet} 條選擇題，大約 ${minutes} 分鐘。`

  return [
    { q: en ? `How many ${name} practice questions are there?` : `${name}有幾多條練習題？`, a: countA },
    {
      q: en ? 'Are these HKDSE past-paper questions?' : '題目係咪 DSE 歷屆試題？',
      a: en
        ? 'No. Every question is an original rewrite aligned to the curriculum and assessment guide, co-authored by DSE alumni with AI. Questions go live after automated checks and have not been reviewed by registered teachers. Past papers are HKEAA copyright; get them from the HKEAA website.'
        : '唔係。全部係對照課程及評估指引獨立改寫嘅原創題，由 DSE 舊生同 AI 協作編寫，經自動檢查上線，未經註冊教師審定。歷屆試題版權屬 HKEAA，請到 HKEAA 網站下載。',
    },
    {
      q: en ? 'Is it free? Do I need an account?' : '使唔使錢？要唔要登入？',
      a: en
        ? 'Everything is free, with no paid tier, and you can practise without signing in. Signing in with Google only syncs your progress to your other devices; it unlocks nothing extra.'
        : '全部免費，冇付費層，唔使登入都做得。用 Google 登入只係將進度同步去你其他裝置，唔會解鎖額外功能。',
    },
  ]
}

/** schema.org FAQPage for items that are visible on the page at `url`. */
export function faqPageSchema(items: FaqItem[], url: string) {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: 'zh-HK',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
