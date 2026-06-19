// Bilingual UI strings. `zh` is the source of truth; `en` is typed as `typeof zh`
// so TypeScript flags any missing or extra key while translating. Add new UI
// sections here as more pages are localised.
const zh = {
  nav: {
    subjects: '科目',
    progress: '我的進度',
    methodology: '方法論',
    leaderboard: '排行榜',
    about: '關於我們',
    startPractice: '開始練習',
  },
  footer: {
    tagline1: '改寫版歷屆試題，掌握核心邏輯。',
    tagline2: '由 2026 DSE 考生製作。',
    practiceHeading: '練習',
    linkMath: '數學',
    linkMethodology: '方法論',
    linkLeaderboard: '排行榜',
    aboutHeading: '關於',
    aboutUs: '關於我們',
    contact: '聯絡我們',
    disclaimerLabel: '免責聲明：',
    disclaimerBody:
      '本平台提供之試題均為獨立改寫版本，旨在協助考生練習應試技巧，並非香港考試及評核局（HKEAA）官方試題。官方歷屆試題請前往 HKEAA 網站下載。等級預測僅供參考，最終成績以 HKEAA 公布為準。',
    copyright: '© 2026 DSE Level Up · 非商業用途 · 保留所有權利',
  },
  practice: {
    progress: '第 {n} / {total} 題',
    correct: '答啱！',
    wrong: '答錯了——再思考一下',
    next: '下一題',
    seeResult: '睇結果 🎉',
    loading: '載入中…',
    notLive: '{subject} 嘅練習仲未上線。',
    notLiveGeneric: '呢個練習仲未上線。',
    otherSubjects: '睇下其他已上線科目 →',
  },
}

const en: typeof zh = {
  nav: {
    subjects: 'Subjects',
    progress: 'My Progress',
    methodology: 'Method',
    leaderboard: 'Leaderboard',
    about: 'About',
    startPractice: 'Start Practice',
  },
  footer: {
    tagline1: 'Rewritten past-paper questions — master the core logic.',
    tagline2: 'Made by a 2026 DSE candidate.',
    practiceHeading: 'Practice',
    linkMath: 'Mathematics',
    linkMethodology: 'Method',
    linkLeaderboard: 'Leaderboard',
    aboutHeading: 'About',
    aboutUs: 'About Us',
    contact: 'Contact',
    disclaimerLabel: 'Disclaimer:',
    disclaimerBody:
      'All questions on this platform are independently rewritten versions intended to help candidates practise exam skills; they are not official HKEAA papers. Please download official past papers from the HKEAA website. Grade predictions are for reference only — final results are as published by the HKEAA.',
    copyright: '© 2026 DSE Level Up · Non-commercial · All rights reserved',
  },
  practice: {
    progress: 'Question {n} / {total}',
    correct: 'Correct!',
    wrong: 'Incorrect — think again',
    next: 'Next',
    seeResult: 'See result 🎉',
    loading: 'Loading…',
    notLive: '{subject} practice is not live yet.',
    notLiveGeneric: 'This practice is not live yet.',
    otherSubjects: 'Browse other live subjects →',
  },
}

export const dictionary = { zh, en }

export type Locale = keyof typeof dictionary
export type Dictionary = typeof zh
