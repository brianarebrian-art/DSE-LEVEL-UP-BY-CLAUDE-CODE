import type { FaqEntry } from '@/lib/faq'
import { SESSION_SIZE } from '@/lib/entitlements'

// Editorial copy for founder review. These questions explain existing product rules;
// they are not claimed to come from customer interviews or to promise exam outcomes.
export const HOME_INTRO = {
  zh: 'DSE Level Up 為香港考生提供免費原創改寫練習、課題筆記及英文寫作自評。先選一科，再按自己的節奏練習；本站並非考評局官方網站。',
  en: 'DSE Level Up is a free learning platform for Hong Kong DSE students, with independently rewritten practice questions, topic notes and English writing self-checks. Choose a subject and work at your own pace. This is not an official HKEAA website.',
} as const

export const HOME_ROUTES = [
  { href: '/subjects', labelZh: '按科目練習', labelEn: 'Practise by subject', detailZh: '選擇科目與課題，用原創改寫題檢查理解，再核對解析。', detailEn: 'Choose a subject and topic, try original rewrites, then check the explanations.' },
  { href: '/dse-maths', labelZh: '數學解題路線', labelEn: 'Maths learning route', detailZh: '從二次方程與判別式開始，先理解步驟，再練習。', detailEn: 'Start with quadratic equations and the discriminant: understand the steps before practising.' },
  { href: '/dse-english', labelZh: '英文閱讀與寫作', labelEn: 'English reading and writing', detailZh: '辨認讀者、目的與文體，配合閱讀材料及寫作自評。', detailEn: 'Identify the reader, purpose and text type, with reading materials and writing self-checks.' },
] as const

export const HOME_FAQS: FaqEntry[] = [
  {
    qZh: 'DSE Level Up 適合誰使用？', qEn: 'Who is DSE Level Up for?',
    aZh: '主要為香港 DSE 考生而設，提供原創改寫練習、課題筆記與學習工具。選擇題幫助練習判斷，不等於掌握整份試卷；請配合學校教學及教師指引。',
    aEn: 'It is designed for Hong Kong DSE students, with independently rewritten practice, topic notes and learning tools. Multiple-choice practice trains judgement, not mastery of an entire paper. Use it alongside school teaching and teacher guidance.',
  },
  {
    qZh: '需要付費或登入嗎？', qEn: 'Do I need to pay or sign in?',
    aZh: `全部功能免費，沒有廣告或付費層。同一裝置未登入可完成一節試用，標準選擇題練習為 ${SESSION_SIZE} 題；之後需用 Google 登入繼續，登入後不限節數，並可同步進度。`,
    aEn: `All features are free, with no ads or paid tier. On the same device, you can complete one set without signing in; a standard multiple-choice set has ${SESSION_SIZE} questions. After that, sign in with Google to continue with unlimited sets and progress sync.`,
  },
  {
    qZh: '題目是官方歷屆試題或經教師審定嗎？', qEn: 'Are these official past papers or teacher-reviewed questions?',
    aZh: '不是。題目為獨立改寫版本，經自動檢查上線，未經註冊教師審定；本站與考評局無從屬關係。發現疑問時請使用題目回報功能，並到透明度頁核對內容狀態。',
    aEn: 'No. Questions are independent rewrites published after automated checks and have not been reviewed by registered teachers. We are not affiliated with the HKEAA. Use the question-reporting tool if something seems wrong, and check the transparency page for content status.',
  },
  {
    qZh: '英文寫作工具會自動評分嗎？', qEn: 'Does the English writing tool grade my work?',
    aZh: '不會。英文寫作工具提供自評清單，不會代寫、進行 AI 作文評分或提供官方分數。請按題目要求檢查內容、組織及語言，並向教師尋求回饋。',
    aEn: 'No. The English writing tool offers a self-checklist; it does not write or AI-grade essays or provide official marks. Check content, organisation and language against the task, and ask a teacher for feedback.',
  },
]
