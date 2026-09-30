// 知識卡頁的起手問題（UX 循環 LOOP 35；第二份 loop prompt §25）。
// 每一條都必須真的找到指定的已批准知識卡（排第一），否則學生第一次試就撞到「沒有卡片」
// 或錯的卡。lib/__tests__/sensei-starters.test.mts 用真卡片逐條核對。
// 中英分開：知識卡大多只有中文關鍵字，英文介面只放英文卡找得到的問題。
export const SENSEI_STARTERS = {
  zh: [
    { q: '判別式同圖像交點有咩關係？', card: 'ma-discriminant' },
    { q: '共用品點解有搭便車問題？', card: 'ec-free-rider' },
    { q: '文言文點樣判斷虛詞？', card: 'zh-c-xuci' },
  ],
  en: [
    { q: 'How do I describe trends in Paper 3 data?', card: 'en-int-trends' },
    { q: 'How do I judge tone and register in English Paper 2?', card: 'en-reg-audience' },
  ],
} as const
