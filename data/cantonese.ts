// 新來港 · 香港日常廣東話 —— 內容正本。
//
// ══ 對象：由內地嚟香港、12–18 歲嘅學生 ══
// 呢個對象決定晒成個檔點寫。佢哋唔係零基礎 —— 大部分字已經識寫、識意思，
// 缺嘅淨係【讀音】同【香港先有嘅講法】。所以每個場景三樣嘢一齊出：
//
//   1. 六句真係開得到口嘅句（每句帶一個溝通目的）
//   2. 一張詞語表（日常一定撞到嘅字）
//   3. 兩三條學習提示（點記、普通話使用者最易踩嘅陷阱）
//
// 「點樣學廣東話」嗰一版（/cantonese/learn）另外喺 data/cantoneseLearn.ts：
// 六個聲調、普通話→廣東話對應規律、同形異義陷阱。
//
// ⚠️ 場景全部揀 12–18 歲真係會撞到嘅 —— 租屋、水電、管理處、銀行、
//    按揭、報稅一律唔入，嗰啲係家長嘅事。同一個理由影響到逐句寫法：
//    約人嗰句寫「我哋夾錢好唔好？」而唔係「今次我請你」，後者假設咗
//    學生畀得起，而呢批學生入面唔係個個畀得起。
//
// ══ 呢個係獨立課程，唔屬中文科 ══
// 十六個場景【全部冇 topicId】，一個練習掣都冇。中文科十九個課題（指定範文、
// 文言閱讀、修辭、實用寫作…）冇一個載得起「試身室喺邊」或者「掛八號風球」。
// 夾硬綁一個上去會令數據講大話。
// 範圍同憲章 §1.2 之間嘅缺口未補，草案喺
// docs/charter-amendment-2026-09-19-DRAFT.md（⬜ 未簽署）。
//
// ══ 2026-09-19：真人簽名閘剷除 ══
// 舊版要 `REVIEW.reviewer` 有真人名先 render，否則出「內容正由真人校對中」。
// Yuna 裁決改為由 Claude Code 負責校對，內容即時出街。
//
// ⚠️ 換咗嘅係【邊個校對】，唔係【校對到幾深】。所以呢度唔會寫「粵拼已驗證」：
//    我查證唔到任何權威粵拼來源，寫咗就係一個證明唔到嘅聲稱。
//    取而代之嘅係一個【跑得到、重跑得到、會令 npm test 紅】嘅結構檢查 ——
//    lib/jyutping.ts 逐個音節對返粵拼嘅封閉集合（19 聲母 / 約 60 韻母 / 6 聲調）。
//
//    佢證明到：`soung1` 唔係合法音節、`sou9` 冇第 9 聲、`bm4` 唔存在。
//    佢證明唔到：「插蘇」讀 sou1 定 sou2 —— 兩個都合法，邊個啱佢答唔到。
//
//    所以口語有兩個讀法嘅字，寫咗入 `noteZh` 當教學內容（「口語亦有人讀…」）
//    而唔係擺一個警告框 —— 變讀係真實嘅粵語現象，唔係一個缺陷。

import { checkJyutping } from '../lib/jyutping'

/**
 * 內容來源同校對紀錄。
 *
 * ⚠️ 呢個【唔係】一個準確度保證，係一張「做過乜」嘅清單。
 *    憲章 §16.D：描述一個檢查嘅時候，唔可以講得勁過佢實際做過嘅嘢。
 */
export const PROVENANCE = {
  writtenBy: 'Claude Code',
  checkedOn: '2026-09-19',
  /** 逐項都係機器跑得到、而且真係跑緊嘅。跑唔到嘅唔准寫入呢張表。 */
  machineChecks: [
    '每個粵拼音節對返粵拼封閉集合（聲母／韻母／1–6 聲調）',
    '每個場景剛好六句，四欄冇空白，id 唔重複',
    '每個場景至少四種溝通目的，全課程用齊七種',
    '詞語表每個詞都有粵拼、普通話同英文',
  ],
  /** 機器查唔到嘅，寫喺呢度，唔好扮查過。 */
  notChecked: [
    '個音讀得啱唔啱 —— 結構合法唔等於讀音正確',
    '一個詞喺你間學校／你嗰區係咪咁講',
  ],
} as const

/**
 * 一句嘅溝通目的。呢個係一個【封閉集合】—— 加新值之前要諗清楚，
 * 因為測試靠佢量度每個場景嘅功能夠唔夠散。
 *
 * 文字標籤唔喺呢度，喺 lib/dictionary.ts（`cantonese.purposes`）——
 * 呢度擺中文就會有一套唔跟語言切換嘅字。
 */
export type Purpose =
  /** 發問 —— 攞一個唔知道嘅資料 */
  | 'ask'
  /** 確認 —— 核對時間、地點、數量、價錢 */
  | 'confirm'
  /** 表達需要 —— 講出自己要乜 */
  | 'need'
  /** 禮貌請求 —— 要對方做一件事 */
  | 'request'
  /** 拒絕或修正 —— 講「唔要」「唔係咁」而唔失禮 */
  | 'decline'
  /** 請對方重複或講慢啲 —— 聽唔明嗰陣唯一嘅出路 */
  | 'repeat'
  /** 收尾道謝 —— 點樣體面咁完一段對話 */
  | 'close'

export const PURPOSES: Purpose[] = ['ask', 'confirm', 'need', 'request', 'decline', 'repeat', 'close']

export interface Phrase {
  /** 廣東話（香港繁體口語寫法） */
  canto: string
  /** 粵拼，音節之間空格分開；標點跟返廣東話嗰句 */
  jyut: string
  /** 普通話對應講法（唔係逐字直譯） */
  putong: string
  /** 英文（自然講法，唔係逐字直譯） */
  en: string
  /** 呢句用嚟做乜 */
  purpose: Purpose
  /** 文化、用法或者變讀提示。每句都有註就冇人會睇，所以只喺真係需要嗰陣寫。 */
  noteZh?: string
  noteEn?: string
}

/** 詞語表一格。呢啲係字詞層 —— 唔成句，但日日撞到。 */
export interface Word {
  zh: string
  jyut: string
  putong: string
  en: string
}

export interface CantoneseTopic {
  id: string
  zh: string
  en: string
  /**
   * 對應 data/questions 嘅真中文科課題。
   *
   * ⚠️ 現版【十六個全部留空】—— 呢個係獨立課程，唔屬中文科（見檔頭）。
   *    欄位保留住，係因為日後若果決定加返綁得到課題嘅場景，佢哋係綁得返嘅。
   *    冇 topicId 就唔出練習掣。
   */
  topicId?: string
  whyZh: string
  whyEn: string
  /**
   * 安全提示。只擺喺【講到身體、求助、危險】嗰啲場景。
   * 一個學生喺嗰幾版度搵嘅係求救嘅字，唔係一個課程 —— 所以要寫明呢度
   * 唔代替醫生、老師、社工、家長同緊急服務。
   */
  safetyZh?: string
  safetyEn?: string
  phrases: Phrase[]
  /** 日常一定撞到嘅字詞。句係一次過用嘅，詞係拆得開再砌嘅。 */
  words: Word[]
  /** 點樣學呢個場景 —— 記憶法、普通話使用者最易踩嘅陷阱。 */
  learnZh: string[]
  learnEn: string[]
}

export const CANTONESE_TOPICS: CantoneseTopic[] = [
  {
    id: 'greeting',
    zh: '打招呼及寒暄',
    en: 'Greetings and small talk',
    whyZh: '香港人開口第一句好少係「你好」。唔識接呢幾句，成個對話由頭就生硬。',
    whyEn: 'People here rarely open with 你好. Without these the whole exchange is stiff from the first line.',
    phrases: [
      {
        canto: '早晨，我係新嚟嘅',
        jyut: 'zou2 san4, ngo5 hai6 san1 lai4 ge3',
        putong: '早上好，我是新来的',
        en: 'Morning — I’m new here.',
        purpose: 'need',
        noteZh: '「早晨」淨係上晝用，下晝再講就會怪。「嚟」口語亦有好多人讀 lei4，兩個都通。',
        noteEn: '早晨 is morning-only. 嚟 is commonly heard as lei4 as well as lai4 — both are fine.',
      },
      { canto: '點稱呼你呀？', jyut: 'dim2 cing1 fu1 nei5 aa3', putong: '怎么称呼你', en: 'What should I call you?', purpose: 'ask' },
      {
        canto: '食咗飯未呀？',
        jyut: 'sik6 zo2 faan6 mei6 aa3',
        putong: '吃了没有',
        en: 'Have you eaten?',
        purpose: 'confirm',
        noteZh: '呢句係招呼語，唔係約你食飯。答「食咗」或者「未呀」就得。',
        noteEn: 'This is a greeting, not an invitation. “食咗” or “未呀” is a complete answer.',
      },
      {
        canto: '唔好意思，我未聽明，可唔可以講慢啲？',
        jyut: 'm4 hou2 ji3 si1, ngo5 mei6 teng1 ming4, ho2 m4 ho2 ji5 gong2 maan6 di1',
        putong: '不好意思，我没听懂，可以说慢点吗',
        en: 'Sorry, I didn’t catch that — could you say it more slowly?',
        purpose: 'repeat',
      },
      {
        canto: '我啱啱嚟香港，廣東話仲學緊',
        jyut: 'ngo5 ngaam1 ngaam1 lai4 hoeng1 gong2, gwong2 dung1 waa2 zung6 hok6 gan2',
        putong: '我刚来香港，广东话还在学',
        en: 'I just moved to Hong Kong — I’m still learning Cantonese.',
        purpose: 'need',
        noteZh: '講咗呢句，對方通常會自動講慢啲。唔使當係道歉。',
        noteEn: 'Saying this usually gets people to slow down on their own. It is not an apology.',
      },
      { canto: '得閒再傾，我要返班先', jyut: 'dak1 haan4 zoi3 king1, ngo5 jiu3 faan1 baan1 sin1', putong: '有空再聊，我要去上课了', en: 'Let’s talk again — I’ve got class.', purpose: 'close' },
    ],
    words: [
      { zh: '早晨', jyut: 'zou2 san4', putong: '早上好', en: 'good morning' },
      { zh: '唔該', jyut: 'm4 goi1', putong: '麻烦你／谢谢', en: 'please / thanks / excuse me' },
      { zh: '多謝', jyut: 'do1 ze6', putong: '谢谢（收到东西）', en: 'thank you (for a gift)' },
      { zh: '唔好意思', jyut: 'm4 hou2 ji3 si1', putong: '不好意思', en: 'sorry / excuse me' },
      { zh: '係呀', jyut: 'hai6 aa3', putong: '是啊', en: 'yes / that’s right' },
      { zh: '唔係', jyut: 'm4 hai6', putong: '不是', en: 'no / not so' },
      { zh: '得閒', jyut: 'dak1 haan4', putong: '有空', en: 'free / not busy' },
      { zh: '傾偈', jyut: 'king1 gai2', putong: '聊天', en: 'to chat' },
    ],
    learnZh: [
      '「唔該」同「多謝」唔通用：人哋幫你做嘢講唔該，人哋畀嘢你講多謝。收咗利是講「唔該」會好怪。',
      '「唔該」仲係「借借、讓一讓」嘅意思 —— 喺地鐵想行過，講呢兩個字就得。',
    ],
    learnEn: [
      '唔該 and 多謝 are not interchangeable: 唔該 for a favour done, 多謝 for something given.',
      '唔該 also means “excuse me, coming through” — it is what you say to get past people.',
    ],
  },
  {
    id: 'school',
    zh: '學校日常',
    en: 'School day',
    whyZh: '一日入面最長嗰段時間喺學校，但課本教嘅「請問洗手間在哪裏」同小息實際講嘅嘢差好遠。',
    whyEn: 'School is where most of the day goes, and what the textbook teaches is not what gets said at break.',
    phrases: [
      { canto: '今堂上咩？', jyut: 'gam1 tong4 soeng5 me1', putong: '这节课上什么', en: 'What have we got this period?', purpose: 'ask' },
      { canto: '呢份功課幾時要交？', jyut: 'ni1 fan6 gung1 fo3 gei2 si4 jiu3 gaau1', putong: '这份作业什么时候交', en: 'When is this homework due?', purpose: 'confirm' },
      { canto: '我唔識做，可唔可以教我？', jyut: 'ngo5 m4 sik1 zou6, ho2 m4 ho2 ji5 gaau3 ngo5', putong: '我不会做，可以教我吗', en: 'I can’t do it — could you show me?', purpose: 'request' },
      {
        canto: '老師，我聽唔切，可唔可以再講一次？',
        jyut: 'lou5 si1, ngo5 teng1 m4 cit3, ho2 m4 ho2 ji5 zoi3 gong2 jat1 ci3',
        putong: '老师，我跟不上，可以再说一次吗',
        en: 'Sir/Miss, I couldn’t keep up — could you say that again?',
        purpose: 'repeat',
        noteZh: '當面通常直接叫 Miss 或者 Sir，唔會叫「老師」。「老師」多數用喺書面同正式場合。',
        noteEn: 'To their face, students here usually say Miss or Sir rather than 老師.',
      },
      { canto: '我今日唔舒服，想請假', jyut: 'ngo5 gam1 jat6 m4 syu1 fuk6, soeng2 cing2 gaa3', putong: '我今天不舒服，想请假', en: 'I’m not well today — I’d like to be excused.', purpose: 'need' },
      { canto: '小息落去買嘢食？', jyut: 'siu2 sik1 lok6 heoi3 maai5 je5 sik6', putong: '课间下去买点吃的', en: 'Want to go down and get something at break?', purpose: 'ask' },
    ],
    words: [
      { zh: '返學', jyut: 'faan1 hok6', putong: '上学', en: 'to go to school' },
      { zh: '放學', jyut: 'fong3 hok6', putong: '放学', en: 'school ends' },
      { zh: '小息', jyut: 'siu2 sik1', putong: '课间休息', en: 'break time' },
      { zh: '功課', jyut: 'gung1 fo3', putong: '作业', en: 'homework' },
      { zh: '測驗', jyut: 'caak1 jim6', putong: '小测', en: 'a test' },
      { zh: '班主任', jyut: 'baan1 zyu2 jam6', putong: '班主任', en: 'form teacher' },
      { zh: '飯堂', jyut: 'faan6 tong4', putong: '食堂', en: 'canteen' },
      { zh: '遲到', jyut: 'ci4 dou3', putong: '迟到', en: 'to be late' },
    ],
    learnZh: [
      '「切」呢個字好有用：聽唔切、食唔切、趕唔切、做唔切 —— 全部係「嚟唔切、跟唔上」嘅意思。',
      '「返」＝去（返學、返工、返屋企），唔係「回來」。普通話使用者最易喺呢個字撞板。',
    ],
    learnEn: [
      '切 is worth learning as a pattern: 聽唔切 / 食唔切 / 趕唔切 all mean “can’t keep up in time”.',
      '返 means “to go to”, not “to return”: 返學 = go to school, 返工 = go to work.',
    ],
  },
  {
    id: 'shopping',
    zh: '買嘢及問價',
    en: 'Shopping and asking prices',
    whyZh: '細舖講得價，連鎖店唔講。開錯口冇人會話你，但個場面會好尷尬。',
    whyEn: 'Small shops haggle; chains do not. Nobody corrects you, but it lands awkwardly.',
    phrases: [
      { canto: '呢個幾多錢呀？', jyut: 'ni1 go3 gei2 do1 cin4 aa3', putong: '这个多少钱', en: 'How much is this?', purpose: 'ask' },
      {
        canto: '我睇睇先，唔該',
        jyut: 'ngo5 tai2 tai2 sin1, m4 goi1',
        putong: '我先看看，谢谢',
        en: 'Just looking, thanks.',
        purpose: 'decline',
        noteZh: '唔想買嘅時候講呢句就夠，唔使解釋原因。',
        noteEn: 'This is enough on its own — no reason needs to follow.',
      },
      {
        canto: '平啲得唔得呀？',
        jyut: 'peng4 di1 dak1 m4 dak1 aa3',
        putong: '能便宜点吗',
        en: 'Could you do it a bit cheaper?',
        purpose: 'request',
        noteZh: '街市、排檔、細舖講得。連鎖店、便利店、超市唔講價。',
        noteEn: 'Fine at markets, stalls and small shops. Chains and supermarkets do not haggle.',
      },
      { canto: '唔該，你可唔可以再講一次？', jyut: 'm4 goi1, nei5 ho2 m4 ho2 ji5 zoi3 gong2 jat1 ci3', putong: '麻烦你，可以再说一次吗', en: 'Sorry — could you say that once more?', purpose: 'repeat' },
      { canto: '我要呢個，唔該', jyut: 'ngo5 jiu3 ni1 go3, m4 goi1', putong: '我要这个，谢谢', en: 'I’ll take this one, thanks.', purpose: 'need' },
      {
        canto: '有冇袋呀？',
        jyut: 'jau5 mou5 doi2 aa3',
        putong: '有没有袋子',
        en: 'Do you have a bag?',
        purpose: 'confirm',
        noteZh: '香港膠袋要收費，舖頭唔會自動畀。「袋」作名詞讀 doi2，作動詞（袋住）讀 doi6。',
        noteEn: 'Plastic bags are charged for here. As a noun 袋 is doi2; as a verb (to pocket) it is doi6.',
      },
    ],
    words: [
      { zh: '幾多錢', jyut: 'gei2 do1 cin4', putong: '多少钱', en: 'how much' },
      { zh: '平', jyut: 'peng4', putong: '便宜', en: 'cheap' },
      { zh: '貴', jyut: 'gwai3', putong: '贵', en: 'expensive' },
      { zh: '找錢', jyut: 'zaau2 cin4', putong: '找钱', en: 'to give change' },
      { zh: '收唔收卡', jyut: 'sau1 m4 sau1 kaat1', putong: '收不收卡', en: 'do you take cards' },
      { zh: '膠袋', jyut: 'gaau1 doi2', putong: '塑料袋', en: 'plastic bag' },
      { zh: '八達通', jyut: 'baat3 daat6 tung1', putong: '八达通', en: 'Octopus card' },
      { zh: '大減價', jyut: 'daai6 gaam2 gaa3', putong: '大减价', en: 'sale' },
    ],
    learnZh: [
      '「平」喺廣東話＝便宜，唔係「平均」。「平啲」＝便宜點，呢個係最常用嘅講價開場。',
      '香港講錢用「蚊」：一百蚊、五十蚊。講「一百塊」聽得明，但一聽就知唔係本地。',
    ],
    learnEn: [
      '平 means “cheap” in Cantonese, not “flat/average”. 平啲 = a bit cheaper.',
      'Dollars are counted in 蚊 here: 一百蚊 = one hundred dollars.',
    ],
  },
  {
    id: 'clothes',
    zh: '買衫及試身',
    en: 'Buying clothes and trying things on',
    whyZh: '碼數同試身嘅講法同內地唔同，講錯就成單嘢卡住。',
    whyEn: 'Sizes and fitting rooms are asked about differently here — get it wrong and the whole thing stalls.',
    phrases: [
      { canto: '可唔可以試吓？', jyut: 'ho2 m4 ho2 ji5 si3 haa5', putong: '可以试一下吗', en: 'Can I try this on?', purpose: 'request' },
      { canto: '試身室喺邊呀？', jyut: 'si3 san1 sat1 hai2 bin1 aa3', putong: '试衣间在哪', en: 'Where’s the fitting room?', purpose: 'ask' },
      { canto: '有冇大一個碼？', jyut: 'jau5 mou5 daai6 jat1 go3 maa5', putong: '有没有大一号', en: 'Do you have the next size up?', purpose: 'confirm' },
      { canto: '呢件有冇第二隻色？', jyut: 'ni1 gin6 jau5 mou5 dai6 ji6 zek3 sik1', putong: '这件有没有别的颜色', en: 'Does this come in another colour?', purpose: 'ask' },
      {
        canto: '我諗諗先，唔該晒',
        jyut: 'ngo5 nam2 nam2 sin1, m4 goi1 saai3',
        putong: '我再想想，谢谢',
        en: 'Let me think about it — thanks.',
        purpose: 'decline',
        noteZh: '「諗」亦有人讀 lam2 —— 廣東話好多 n- 開頭嘅字，口語會讀成 l-（你 nei5 → lei5 一樣咁普遍）。',
        noteEn: '諗 is also heard as lam2: many n- initials shift to l- in casual speech (你 nei5 → lei5 likewise).',
      },
      {
        canto: '如果唔啱著，換唔換得？',
        jyut: 'jyu4 gwo2 m4 ngaam1 zoek3, wun6 m4 wun6 dak1',
        putong: '如果不合身，能换吗',
        en: 'If it doesn’t fit, can I exchange it?',
        purpose: 'confirm',
        noteZh: '好多細舖係「特價不設退換」，所以買之前問一句。',
        noteEn: 'Many small shops do not accept returns on sale items, so ask before paying.',
      },
    ],
    words: [
      { zh: '件衫', jyut: 'gin6 saam1', putong: '衣服', en: 'a top / garment' },
      { zh: '條褲', jyut: 'tiu4 fu3', putong: '裤子', en: 'trousers' },
      { zh: '對鞋', jyut: 'deoi3 haai4', putong: '鞋', en: 'a pair of shoes' },
      { zh: '碼數', jyut: 'maa5 sou3', putong: '尺码', en: 'size' },
      { zh: '試身室', jyut: 'si3 san1 sat1', putong: '试衣间', en: 'fitting room' },
      { zh: '啱身', jyut: 'ngaam1 san1', putong: '合身', en: 'fits well' },
      { zh: '校服', jyut: 'haau6 fuk6', putong: '校服', en: 'school uniform' },
      { zh: '退換', jyut: 'teoi3 wun6', putong: '退换', en: 'return or exchange' },
    ],
    learnZh: [
      '廣東話每樣嘢有自己嘅量詞：一件衫、一條褲、一對鞋、一隻錶。講錯量詞唔會聽唔明，但好明顯。',
      '「啱」（ngaam1）＝啱身、啱你、啱晒 —— 一個字覆蓋「合適／對／正好」，係最抵學嘅字之一。',
    ],
    learnEn: [
      'Cantonese pairs each noun with its own measure word: 一件衫, 一條褲, 一對鞋.',
      '啱 (ngaam1) covers “fits / correct / just right” — one of the highest-value single words to learn.',
    ],
  },
  {
    id: 'food',
    zh: '食飯、叫餐及打包',
    en: 'Eating out, ordering and takeaway',
    whyZh: '茶餐廳落單係一套自己嘅簡稱，餐牌上面都唔會解釋。',
    whyEn: 'Cha chaan teng ordering runs on shorthand the menu never explains.',
    phrases: [
      { canto: '唔該，落單', jyut: 'm4 goi1, lok6 daan1', putong: '麻烦你，点菜', en: 'Excuse me — we’d like to order.', purpose: 'need' },
      { canto: '呢個辣唔辣㗎？', jyut: 'ni1 go3 laat6 m4 laat6 gaa3', putong: '这个辣不辣', en: 'Is this spicy?', purpose: 'ask' },
      {
        canto: '走蔥，唔該',
        jyut: 'zau2 cung1, m4 goi1',
        putong: '不要葱，谢谢',
        en: 'Hold the spring onion, please.',
        purpose: 'request',
        noteZh: '「走X」＝唔要X（走冰、走甜、走辣）。相反「加底」＝加飯或加麵，要加錢。',
        noteEn: '走X means “without X” (走冰 = no ice, 走甜 = no sugar). 加底 is extra rice or noodles, at extra cost.',
      },
      { canto: '唔該，我唔食得辣', jyut: 'm4 goi1, ngo5 m4 sik6 dak1 laat6', putong: '麻烦你，我不能吃辣', en: 'Sorry — I can’t eat spicy food.', purpose: 'decline' },
      { canto: '唔該打包', jyut: 'm4 goi1 daa2 baau1', putong: '麻烦打包', en: 'To take away, please.', purpose: 'request' },
      { canto: '唔該，埋單', jyut: 'm4 goi1, maai4 daan1', putong: '麻烦买单', en: 'The bill, please.', purpose: 'close' },
    ],
    words: [
      { zh: '落單', jyut: 'lok6 daan1', putong: '点菜', en: 'to order' },
      { zh: '埋單', jyut: 'maai4 daan1', putong: '买单', en: 'the bill' },
      { zh: '外賣', jyut: 'ngoi6 maai6', putong: '外卖', en: 'takeaway' },
      { zh: '凍檸茶', jyut: 'dung3 ning4 caa4', putong: '冰柠檬茶', en: 'iced lemon tea' },
      { zh: '走冰', jyut: 'zau2 bing1', putong: '去冰', en: 'no ice' },
      { zh: '加底', jyut: 'gaa1 dai2', putong: '加饭／加面', en: 'extra rice or noodles' },
      { zh: '碟頭飯', jyut: 'dip6 tau4 faan6', putong: '盖浇饭', en: 'rice plate' },
      { zh: '唔該埋單', jyut: 'm4 goi1 maai4 daan1', putong: '麻烦买单', en: 'bill please' },
    ],
    learnZh: [
      '茶餐廳落單係一套簡稱系統：走X（唔要）、加X（多加）、靚X（好嘅）。識咗個系統就唔使逐個詞背。',
      '「凍」＝冰嘅，「熱」＝熱嘅。叫嘢飲一定要講清楚，唔講通常會出熱嗰款。',
    ],
    learnEn: [
      'Cha chaan teng ordering is a system: 走X (without), 加X (extra), so you learn the pattern rather than each phrase.',
      '凍 = iced, 熱 = hot. Say which — the default is usually hot.',
    ],
  },
  {
    id: 'transport',
    zh: '搭車及問路',
    en: 'Getting around and asking directions',
    whyZh: '「有落」係小巴專用，唔嗌就過咗站。呢啲嘢冇人會特登教。',
    whyEn: '「有落」is minibus-only — not calling it means missing your stop. Nobody teaches this on purpose.',
    phrases: [
      { canto: '唔該，請問點去地鐵站？', jyut: 'm4 goi1, cing2 man6 dim2 heoi3 dei6 tit3 zaam6', putong: '请问地铁站怎么走', en: 'Excuse me — how do I get to the MTR station?', purpose: 'ask' },
      { canto: '係咪搭呢架車？', jyut: 'hai6 mai6 daap3 ni1 gaa3 ce1', putong: '是不是坐这辆车', en: 'Is this the right bus?', purpose: 'confirm' },
      {
        canto: '有落，唔該！',
        jyut: 'jau5 lok6, m4 goi1',
        putong: '到站下车',
        en: 'Stopping here, please!',
        purpose: 'request',
        noteZh: '小巴冇落車鐘，要開聲嗌，而且要早一個街口嗌。唔嗌就過站。',
        noteEn: 'Minibuses have no stop bell — you call this out, about a block early.',
      },
      { canto: '唔好意思，你頭先講邊個站？', jyut: 'm4 hou2 ji3 si1, nei5 tau4 sin1 gong2 bin1 go3 zaam6', putong: '不好意思，你刚才说哪个站', en: 'Sorry — which stop did you say?', purpose: 'repeat' },
      { canto: '仲有幾多個站？', jyut: 'zung6 jau5 gei2 do1 go3 zaam6', putong: '还有几个站', en: 'How many stops to go?', purpose: 'confirm' },
      {
        canto: '唔該，去邊度增值？',
        jyut: 'm4 goi1, heoi3 bin1 dou6 zang1 zik6',
        putong: '请问在哪儿充值',
        en: 'Excuse me — where can I top up?',
        purpose: 'need',
        noteZh: '八達通喺便利店、地鐵站同好多舖頭都增值得。',
        noteEn: 'Octopus tops up at convenience stores, MTR stations and many shops.',
      },
    ],
    words: [
      { zh: '地鐵', jyut: 'dei6 tit3', putong: '地铁', en: 'the MTR' },
      { zh: '小巴', jyut: 'siu2 baa1', putong: '小巴', en: 'minibus' },
      { zh: '巴士', jyut: 'baa1 si2', putong: '公交车', en: 'bus' },
      { zh: '的士', jyut: 'dik1 si2', putong: '出租车', en: 'taxi' },
      { zh: '有落', jyut: 'jau5 lok6', putong: '到站下车', en: 'stopping here (on a minibus)' },
      { zh: '轉車', jyut: 'zyun3 ce1', putong: '换乘', en: 'to change lines' },
      { zh: '過馬路', jyut: 'gwo3 maa5 lou6', putong: '过马路', en: 'to cross the road' },
      { zh: '增值', jyut: 'zang1 zik6', putong: '充值', en: 'to top up' },
    ],
    learnZh: [
      '香港交通工具好多係英文音譯：巴士（bus）、的士（taxi）、小巴。聽落似英文就通常真係英文嚟。',
      '問路先講「唔該」再講「請問」，係最穩陣嘅開場 —— 淨係「請問」會有少少硬。',
    ],
    learnEn: [
      'Many transport words are English borrowings: 巴士 (bus), 的士 (taxi).',
      'Open with 唔該 before 請問 — 請問 on its own lands a little stiff.',
    ],
  },
  {
    id: 'clinic',
    zh: '睇醫生及去藥房',
    en: 'Seeing a doctor and at the pharmacy',
    whyZh: '身體唔舒服嗰陣最唔想搵字，所以呢幾句要熟到唔使諗。',
    whyEn: 'When you feel ill is the worst time to be hunting for words — these should be automatic.',
    safetyZh: '呢一頁係語言參考，唔代替醫生、護士、老師、社工或者家長。唔舒服要搵身邊可信任嘅大人；緊急情況打 999。',
    safetyEn:
      'This page is language reference only. It does not replace a doctor, nurse, teacher, social worker or your family. If you feel unwell, tell a trusted adult; in an emergency call 999.',
    phrases: [
      { canto: '我想睇醫生', jyut: 'ngo5 soeng2 tai2 ji1 sang1', putong: '我想看医生', en: 'I’d like to see a doctor.', purpose: 'need' },
      {
        canto: '我肚痛，痛咗兩日',
        jyut: 'ngo5 tou5 tung3, tung3 zo2 loeng5 jat6',
        putong: '我肚子痛，痛了两天',
        en: 'I have a stomach ache — it’s been two days.',
        purpose: 'need',
        noteZh: '講埋「痛咗幾耐」好重要。醫生第一句多數就係問呢樣。',
        noteEn: 'Saying how long it has hurt matters — it is usually the doctor’s first question.',
      },
      {
        canto: '我唔舒服，可唔可以幫我搵老師，或者打電話畀我屋企人？',
        jyut: 'ngo5 m4 syu1 fuk6, ho2 m4 ho2 ji5 bong1 ngo5 wan2 lou5 si1, waak6 ze2 daa2 din6 waa2 bei2 ngo5 uk1 kei2 jan4',
        putong: '我不舒服，可以帮我找老师，或者打电话给我家人吗',
        en: 'I don’t feel well — could you find a teacher, or call my family?',
        purpose: 'request',
        noteZh: '喺學校唔舒服，呢句係最重要嗰句。唔使講得靚，講得出就得。',
        noteEn: 'If you feel ill at school, this is the one to have ready. It does not need to come out neatly.',
      },
      { canto: '呢隻藥一日食幾多次？', jyut: 'ni1 zek3 joek6 jat1 jat6 sik6 gei2 do1 ci3', putong: '这个药一天吃几次', en: 'How many times a day do I take this?', purpose: 'confirm' },
      {
        canto: '唔該，可唔可以寫低？我怕記唔住',
        jyut: 'm4 goi1, ho2 m4 ho2 ji5 se2 dai1? ngo5 paa3 gei3 m4 zyu6',
        putong: '麻烦你，可以写下来吗？我怕记不住',
        en: 'Could you write it down? I’m worried I’ll forget.',
        purpose: 'repeat',
        noteZh: '聽唔晒醫生講嘅嘢好平常。要求寫低唔失禮，而且返到屋企查得返。',
        noteEn: 'Not catching everything a doctor says is normal. Asking for it in writing is not rude.',
      },
      {
        canto: '我對呢隻藥敏感',
        jyut: 'ngo5 deoi3 ni1 zek3 joek6 man5 gam2',
        putong: '我对这个药过敏',
        en: 'I’m allergic to this medicine.',
        purpose: 'decline',
        noteZh: '香港講「敏感」，唔講「過敏」。呢個字講錯，對方可能聽唔出係嚴重事。',
        noteEn: 'Hong Kong says 敏感, not 過敏. The wrong word can make it sound less serious than it is.',
      },
    ],
    words: [
      { zh: '唔舒服', jyut: 'm4 syu1 fuk6', putong: '不舒服', en: 'unwell' },
      { zh: '發燒', jyut: 'faat3 siu1', putong: '发烧', en: 'to have a fever' },
      { zh: '頭痛', jyut: 'tau4 tung3', putong: '头痛', en: 'headache' },
      { zh: '咳', jyut: 'kat1', putong: '咳嗽', en: 'to cough' },
      { zh: '藥房', jyut: 'joek6 fong2', putong: '药店', en: 'pharmacy' },
      { zh: '敏感', jyut: 'man5 gam2', putong: '过敏', en: 'allergic' },
      { zh: '睇醫生', jyut: 'tai2 ji1 sang1', putong: '看医生', en: 'to see a doctor' },
      { zh: '急症室', jyut: 'gap1 zing3 sat1', putong: '急诊室', en: 'A&E' },
    ],
    learnZh: [
      '「睇」＝看：睇醫生、睇戲、睇書、睇下。呢個字用途極闊，係最先要熟嗰批。',
      '身體部位＋「痛」就成句：頭痛、肚痛、喉嚨痛、牙痛。唔使記成句，記個公式就得。',
    ],
    learnEn: [
      '睇 means “to look/see” and is everywhere: 睇醫生, 睇戲, 睇書.',
      'Body part + 痛 makes the phrase: 頭痛, 肚痛, 牙痛 — learn the pattern, not each phrase.',
    ],
  },
  {
    id: 'market',
    zh: '街市及超級市場',
    en: 'Wet market and supermarket',
    whyZh: '街市用斤唔用公斤，而且要開口講數量，同超市攞完就走完全唔同。',
    whyEn: 'Wet markets work in catties, and you have to say the amount out loud.',
    phrases: [
      {
        canto: '一斤幾多錢呀？',
        jyut: 'jat1 gan1 gei2 do1 cin4 aa3',
        putong: '一斤多少钱',
        en: 'How much per catty?',
        purpose: 'ask',
        noteZh: '香港一斤約 605 克，唔係 500 克。價錢牌寫嘅通常係斤價。',
        noteEn: 'A Hong Kong catty is about 605g, not 500g. Price tags usually quote per catty.',
      },
      { canto: '要半斤，唔該', jyut: 'jiu3 bun3 gan1, m4 goi1', putong: '要半斤，谢谢', en: 'Half a catty, please.', purpose: 'need' },
      { canto: '唔該幫我切開佢', jyut: 'm4 goi1 bong1 ngo5 cit3 hoi1 keoi5', putong: '麻烦帮我切开', en: 'Could you cut it up for me?', purpose: 'request' },
      {
        canto: '唔該，唔使咁多',
        jyut: 'm4 goi1, m4 sai2 gam3 do1',
        putong: '不用这么多',
        en: 'That’s too much — a bit less, please.',
        purpose: 'decline',
        noteZh: '檔主秤多咗好平常，開聲叫少啲唔係失禮，秤之前講就最好。',
        noteEn: 'Stallholders often scoop more than you asked for. Say so before it goes on the scale.',
      },
      { canto: '係咪呢個價錢？', jyut: 'hai6 mai6 ni1 go3 gaa3 cin4', putong: '是这个价钱吗', en: 'Is that the price?', purpose: 'confirm' },
      { canto: '邊度埋單呀？', jyut: 'bin1 dou6 maai4 daan1 aa3', putong: '在哪结账', en: 'Where do I pay?', purpose: 'ask' },
    ],
    words: [
      { zh: '街市', jyut: 'gaai1 si5', putong: '菜市场', en: 'wet market' },
      { zh: '超市', jyut: 'ciu1 si5', putong: '超市', en: 'supermarket' },
      { zh: '斤', jyut: 'gan1', putong: '斤（约605克）', en: 'catty (about 605g)' },
      { zh: '新鮮', jyut: 'san1 sin1', putong: '新鲜', en: 'fresh' },
      { zh: '生果', jyut: 'saang1 gwo2', putong: '水果', en: 'fruit' },
      { zh: '餸', jyut: 'sung3', putong: '菜（配饭的）', en: 'dishes to go with rice' },
      { zh: '凍肉', jyut: 'dung3 juk6', putong: '冻肉', en: 'frozen meat' },
      { zh: '收銀處', jyut: 'sau1 ngan4 cyu3', putong: '收银台', en: 'checkout' },
    ],
    learnZh: [
      '「餸」呢個字普通話冇對應：指配飯嘅菜。「買餸」＝買做飯嘅材料，唔係「买菜叶」。',
      '街市講斤、超市講克，兩個地方數字單位唔同，聽價錢之前要先知自己喺邊。',
    ],
    learnEn: [
      '餸 has no Putonghua equivalent: it means the dishes eaten with rice. 買餸 = shop for dinner.',
      'Wet markets quote per catty; supermarkets use grams — know which one you are standing in.',
    ],
  },
  {
    id: 'help',
    zh: '電話求助及請人幫手',
    en: 'On the phone and asking for help',
    whyZh: '講電話冇口型冇表情，係最快露底嘅場合。呢幾句買到時間。',
    whyEn: 'On the phone there is no lip-reading and no face — these buy you time.',
    safetyZh:
      '遇到即時危險，唔好自己處理：搵身邊可信任嘅大人（老師、社工、家長），或者打 999。呢一頁淨係教講法，唔係求助途徑。',
    safetyEn:
      'If you are in immediate danger, do not handle it alone — go to a trusted adult (a teacher, social worker or your family), or call 999. This page teaches wording, not where to get help.',
    phrases: [
      { canto: '唔該，可唔可以幫幫手？', jyut: 'm4 goi1, ho2 m4 ho2 ji5 bong1 bong1 sau2', putong: '麻烦你，可以帮个忙吗', en: 'Excuse me — could you give me a hand?', purpose: 'request' },
      { canto: '我唔識路，可唔可以話我知點行？', jyut: 'ngo5 m4 sik1 lou6, ho2 m4 ho2 ji5 waa6 ngo5 zi1 dim2 haang4', putong: '我不认识路，可以告诉我怎么走吗', en: 'I don’t know the way — could you tell me how to get there?', purpose: 'need' },
      {
        canto: '聽唔清楚，可唔可以大聲啲？',
        jyut: 'teng1 m4 cing1 co2, ho2 m4 ho2 ji5 daai6 seng1 di1',
        putong: '听不清楚，可以大声点吗',
        en: 'I can’t hear you — could you speak up?',
        purpose: 'repeat',
        noteZh: '「聲」喺大聲、細聲讀 seng1（口語音）；喺聲音、聲調就讀 sing1（書面音）。同一個字兩個讀法好常見。',
        noteEn: '聲 is seng1 in everyday words like 大聲, but sing1 in formal ones like 聲調. Two readings of one character is common.',
      },
      {
        canto: '我唔肯定，等我問下老師先',
        jyut: 'ngo5 m4 hang2 ding6, dang2 ngo5 man6 haa5 lou5 si1 sin1',
        putong: '我不确定，我先问一下老师',
        en: 'I’m not sure — let me check with my teacher first.',
        purpose: 'decline',
        noteZh: '唔肯定就唔好應承。呢句買到時間，而且冇人會因此覺得你唔掂。',
        noteEn: 'Do not agree to something you are unsure of. This buys time, and nobody thinks less of you for it.',
      },
      { canto: '等陣我打返畀你，得唔得？', jyut: 'dang2 zan6 ngo5 daa2 faan1 bei2 nei5, dak1 m4 dak1', putong: '我待会儿打回给你，行吗', en: 'Can I call you back in a bit?', purpose: 'confirm' },
      { canto: '唔該晒你，唔好意思阻你咁耐', jyut: 'm4 goi1 saai3 nei5, m4 hou2 ji3 si1 zo2 nei5 gam3 noi6', putong: '太谢谢你了，不好意思耽误你这么久', en: 'Thanks so much — sorry to have kept you.', purpose: 'close' },
    ],
    words: [
      { zh: '幫手', jyut: 'bong1 sau2', putong: '帮忙', en: 'to help' },
      { zh: '打電話', jyut: 'daa2 din6 waa2', putong: '打电话', en: 'to make a call' },
      { zh: '搵', jyut: 'wan2', putong: '找', en: 'to look for' },
      { zh: '屋企人', jyut: 'uk1 kei2 jan4', putong: '家人', en: 'family' },
      { zh: '警察', jyut: 'ging2 caat3', putong: '警察', en: 'police' },
      { zh: '社工', jyut: 'se5 gung1', putong: '社工', en: 'social worker' },
      { zh: '唔緊要', jyut: 'm4 gan2 jiu3', putong: '没关系', en: 'it’s alright' },
      { zh: '得唔得', jyut: 'dak1 m4 dak1', putong: '行不行', en: 'is that OK?' },
    ],
    learnZh: [
      '「得」＝可以、行。「得唔得？」係問，「得」係答。普通話講「行」，廣東話講「得」。',
      '「搵」＝找：搵人、搵嘢、搵工、搵唔到。呢個字一日會用好多次。',
    ],
    learnEn: [
      '得 (dak1) is Cantonese for “OK/can”: 得唔得？ = is that alright? 得 = yes.',
      '搵 means “to look for”: 搵人, 搵工, 搵唔到 — you will use it many times a day.',
    ],
  },
  {
    id: 'weather',
    zh: '天氣及打風',
    en: 'Weather and typhoons',
    whyZh: '八號風球同黑雨會停課，而通知全部用廣東話講。聽唔明呢幾個詞，就會係全班得你一個照樣返學。',
    whyEn: 'Signal 8 and black rain close schools, and the announcements are all in Cantonese. Miss these words and you are the one who turns up.',
    phrases: [
      { canto: '今日落唔落雨？', jyut: 'gam1 jat6 lok6 m4 lok6 jyu5', putong: '今天下不下雨', en: 'Is it going to rain today?', purpose: 'ask' },
      {
        canto: '打風喎，聽日使唔使返學？',
        jyut: 'daa2 fung1 wo3, ting1 jat6 sai2 m4 sai2 faan1 hok6',
        putong: '要刮台风了，明天要上学吗',
        en: 'There’s a typhoon coming — do we have school tomorrow?',
        purpose: 'confirm',
        noteZh: '香港人講風球淨係講號數：三號、八號、十號。「掛八號」＝ 掛八號風球，中小學停課。',
        noteEn: 'Typhoon signals are referred to by number alone: 三號, 八號, 十號. At signal 8 schools close.',
      },
      { canto: '記得帶遮', jyut: 'gei3 dak1 daai3 ze1', putong: '记得带伞', en: 'Remember your umbrella.', purpose: 'request' },
      {
        canto: '今日好熱，成身都濕晒',
        jyut: 'gam1 jat6 hou2 jit6, sing4 san1 dou1 sap1 saai3',
        putong: '今天好热，浑身都湿透了',
        en: 'It’s boiling — I’m soaked through.',
        purpose: 'need',
        noteZh: '「晒」放喺動詞後面＝完全、全部：濕晒、食晒、走晒。',
        noteEn: '晒 after a verb means “completely”: 濕晒 soaked, 食晒 all eaten, 走晒 all gone.',
      },
      { canto: '落大雨，我遲少少到', jyut: 'lok6 daai6 jyu5, ngo5 ci4 siu2 siu2 dou3', putong: '下大雨，我会晚一点到', en: 'Heavy rain — I’ll be a bit late.', purpose: 'need' },
      { canto: '黑雨停課，唔使返學喇', jyut: 'hak1 jyu5 ting4 fo3, m4 sai2 faan1 hok6 laa3', putong: '黑雨停课，不用上学了', en: 'Black rainstorm — school’s off.', purpose: 'close' },
    ],
    words: [
      { zh: '打風', jyut: 'daa2 fung1', putong: '刮台风', en: 'typhoon weather' },
      { zh: '風球', jyut: 'fung1 kau4', putong: '台风信号', en: 'typhoon signal' },
      { zh: '黑雨', jyut: 'hak1 jyu5', putong: '黑色暴雨', en: 'black rainstorm warning' },
      { zh: '停課', jyut: 'ting4 fo3', putong: '停课', en: 'classes suspended' },
      { zh: '落雨', jyut: 'lok6 jyu5', putong: '下雨', en: 'to rain' },
      { zh: '遮', jyut: 'ze1', putong: '雨伞', en: 'umbrella' },
      { zh: '好焗', jyut: 'hou2 guk6', putong: '很闷热', en: 'muggy' },
      { zh: '冷氣', jyut: 'laang5 hei3', putong: '空调', en: 'air conditioning' },
    ],
    learnZh: [
      '「遮」就係雨傘。廣東話日常好少講「傘」，講「遮」。',
      '「落」＝下：落雨、落雪、落車、落樓下。同「落單」個「落」係同一個字，意思由後面嗰個詞決定。',
    ],
    learnEn: [
      '遮 is the everyday word for umbrella; 傘 is rarely said.',
      '落 means “to come/go down”: 落雨 (rain), 落車 (get off), 落樓下 (go downstairs).',
    ],
  },
  {
    id: 'slang',
    zh: '香港常用口頭語及閒聊',
    en: 'Everyday fillers and small talk',
    whyZh: '呢幾句本身冇乜實質資訊，但唔用就會聽落好似喺度讀課本。',
    whyEn: 'These carry almost no information — but without them you sound like you are reading from a textbook.',
    phrases: [
      { canto: '搞掂晒喇！', jyut: 'gaau2 dim6 saai3 laa3', putong: '都搞定了', en: 'All sorted!', purpose: 'close' },
      { canto: '冇所謂，你話事', jyut: 'mou5 so2 wai6, nei5 waa6 si6', putong: '无所谓，你决定', en: 'I don’t mind — you decide.', purpose: 'decline' },
      { canto: '真係㗎？', jyut: 'zan1 hai6 gaa3', putong: '真的吗', en: 'Really?', purpose: 'confirm' },
      { canto: '唔緊要，冇事嘅', jyut: 'm4 gan2 jiu3, mou5 si6 ge3', putong: '没关系，没事的', en: 'It’s alright, no harm done.', purpose: 'close' },
      {
        canto: '係咪呀？我唔係好明',
        jyut: 'hai6 mai6 aa3? ngo5 m4 hai6 hou2 ming4',
        putong: '是吗？我不太明白',
        en: 'Is that right? I don’t quite follow.',
        purpose: 'repeat',
        noteZh: '「唔係好明」比「唔明」軟啲，唔會令對方覺得自己講得差。',
        noteEn: '唔係好明 is softer than 唔明 — it does not imply the other person explained badly.',
      },
      { canto: '等我諗吓先', jyut: 'dang2 ngo5 nam2 haa5 sin1', putong: '让我想一下', en: 'Let me think about it for a sec.', purpose: 'need' },
    ],
    words: [
      { zh: '好正', jyut: 'hou2 zeng3', putong: '很棒', en: 'great / awesome' },
      { zh: '搞掂', jyut: 'gaau2 dim6', putong: '搞定', en: 'done / sorted' },
      { zh: '冇所謂', jyut: 'mou5 so2 wai6', putong: '无所谓', en: 'I don’t mind' },
      { zh: '咁啱', jyut: 'gam3 ngaam1', putong: '这么巧', en: 'what a coincidence' },
      { zh: '唔知喎', jyut: 'm4 zi1 wo3', putong: '不知道呢', en: 'no idea' },
      { zh: '係咁先', jyut: 'hai6 gam2 sin1', putong: '就这样吧', en: 'that’s it for now' },
      { zh: '慢慢嚟', jyut: 'maan6 maan6 lai4', putong: '慢慢来', en: 'take your time' },
      { zh: '唔使客氣', jyut: 'm4 sai2 haak3 hei3', putong: '不用客气', en: 'you’re welcome' },
    ],
    learnZh: [
      '語氣助詞（呀 aa3、啦 laa1、喎 wo3、囉 lo1、嘅 ge3）唔係可有可無。「幾點走」似查問，「幾點走呀？」先似傾偈。',
      '「係咁先」係收線／走人嘅標準講法，唔係「就這樣」咁生硬。',
    ],
    learnEn: [
      'The particles 呀 / 啦 / 喎 / 囉 / 嘅 are not optional — without them every sentence lands as a command.',
      '係咁先 is the standard way to wrap up a call or a chat.',
    ],
  },
  {
    id: 'library',
    zh: '補習社及圖書館',
    en: 'Tutorial centre and library',
    whyZh: '自修室同圖書館係新來港學生最常去、又最少人教點開口嘅地方。',
    whyEn: 'Study rooms and libraries are where newly arrived students spend most time, and where nobody teaches the words.',
    phrases: [
      {
        canto: '呢度有冇位坐？',
        jyut: 'ni1 dou6 jau5 mou5 wai2 co5',
        putong: '这里有座位吗',
        en: 'Is there a seat here?',
        purpose: 'ask',
        noteZh: '「位」指座位嗰陣讀 wai2（變調），讀返本音 wai6 就係「位置、地位」。',
        noteEn: '位 is wai2 when it means a seat (a changed tone); wai6 is the base reading, as in “position”.',
      },
      { canto: '你哋幾點閂門？', jyut: 'nei5 dei6 gei2 dim2 saan1 mun4', putong: '你们几点关门', en: 'What time do you close?', purpose: 'confirm' },
      { canto: '我想借呢本書', jyut: 'ngo5 soeng2 ze3 ni1 bun2 syu1', putong: '我想借这本书', en: 'I’d like to borrow this book.', purpose: 'need' },
      { canto: '幾時要還？', jyut: 'gei2 si4 jiu3 waan4', putong: '什么时候要还', en: 'When is it due back?', purpose: 'confirm' },
      {
        canto: '唔該，附近有冇插蘇？',
        jyut: 'm4 goi1, fu6 gan6 jau5 mou5 caap3 sou1',
        putong: '请问附近有没有插座',
        en: 'Excuse me — is there a power socket nearby?',
        purpose: 'ask',
        noteZh: '香港叫「插蘇」唔叫「插座」。講「插座」對方多數都明，但會即刻聽得出你唔係本地。',
        noteEn: 'Hong Kong says 插蘇, not 插座. People will understand 插座 — they will also hear that you are new.',
      },
      { canto: '唔好意思，可唔可以細聲啲？', jyut: 'm4 hou2 ji3 si1, ho2 m4 ho2 ji5 sai3 seng1 di1', putong: '不好意思，可以小声点吗', en: 'Sorry — could you keep it down a bit?', purpose: 'request' },
    ],
    words: [
      { zh: '自修室', jyut: 'zi6 sau1 sat1', putong: '自习室', en: 'study room' },
      { zh: '補習社', jyut: 'bou2 zaap6 se5', putong: '补习班', en: 'tutorial centre' },
      { zh: '圖書館', jyut: 'tou4 syu1 gun2', putong: '图书馆', en: 'library' },
      { zh: '借書', jyut: 'ze3 syu1', putong: '借书', en: 'to borrow a book' },
      { zh: '還書', jyut: 'waan4 syu1', putong: '还书', en: 'to return a book' },
      { zh: '插蘇', jyut: 'caap3 sou1', putong: '插座', en: 'power socket' },
      { zh: '閂門', jyut: 'saan1 mun4', putong: '关门', en: 'to close (a shop)' },
      { zh: '溫書', jyut: 'wan1 syu1', putong: '复习', en: 'to revise' },
    ],
    learnZh: [
      '「閂」＝關：閂門、閂燈、閂水喉。普通話冇呢個字嘅口語用法，要特別記。',
      '「溫書」＝複習。香港學生唔講「複習」，一律講「溫書」。',
    ],
    learnEn: [
      '閂 means “to close/shut”: 閂門, 閂燈. It has no everyday Putonghua equivalent.',
      '溫書 is the word for revising — 複習 is not used in speech here.',
    ],
  },
  {
    id: 'mobile',
    zh: '手機、上網及增值',
    en: 'Phone, internet and topping up',
    whyZh: '增值、數據、叉電 —— 呢幾個字用錯，鋪頭聽唔明你想做乜。',
    whyEn: 'Top-ups, data and charging — the wrong word and the shop has no idea what you want.',
    phrases: [
      {
        canto: '唔該，幫我增值一百蚊',
        jyut: 'm4 goi1, bong1 ngo5 zang1 zik6 jat1 baak3 man1',
        putong: '麻烦帮我充值一百块',
        en: 'Could you top it up by a hundred, please?',
        purpose: 'need',
        noteZh: '香港叫「蚊」唔叫「塊」。「一百蚊」＝一百港元。',
        noteEn: 'Hong Kong dollars are counted in 蚊, not 塊.',
      },
      { canto: '呢度有冇得上網？', jyut: 'ni1 dou6 jau5 mou5 dak1 soeng5 mong5', putong: '这里能上网吗', en: 'Is there internet here?', purpose: 'ask' },
      {
        canto: '我部電話冇晒電，可唔可以借個叉電器？',
        jyut: 'ngo5 bou6 din6 waa2 mou5 saai3 din6, ho2 m4 ho2 ji5 ze3 go3 caa1 din6 hei3',
        putong: '我手机没电了，可以借个充电器吗',
        en: 'My phone is dead — could I borrow a charger?',
        purpose: 'request',
        noteZh: '香港叫「叉電」唔叫「充電」，個插頭叫「叉電器」。',
        noteEn: 'Charging is 叉電 here, not 充電, and a charger is a 叉電器.',
      },
      { canto: '我收唔到線，聽唔到你講嘢', jyut: 'ngo5 sau1 m4 dou2 sin3, teng1 m4 dou2 nei5 gong2 je5', putong: '我没信号，听不到你说话', en: 'I’ve got no signal — I can’t hear you.', purpose: 'repeat' },
      { canto: '係咪要密碼先上到網？', jyut: 'hai6 mai6 jiu3 mat6 maa5 sin1 soeng5 dou2 mong5', putong: '是不是要密码才能上网', en: 'Do I need a password to get online?', purpose: 'confirm' },
      {
        canto: '唔使喇，多謝',
        jyut: 'm4 sai2 laa3, do1 ze6',
        putong: '不用了，谢谢',
        en: 'No thanks, I’m fine.',
        purpose: 'decline',
        noteZh: '電話舖好多時會推你轉台或者加月費計劃。唔想要就講呢句，唔使解釋。',
        noteEn: 'Phone shops often push plan upgrades. This declines it — no explanation needed.',
      },
    ],
    words: [
      { zh: '手機', jyut: 'sau2 gei1', putong: '手机', en: 'mobile phone' },
      { zh: '叉電', jyut: 'caa1 din6', putong: '充电', en: 'to charge' },
      { zh: '增值', jyut: 'zang1 zik6', putong: '充值', en: 'to top up' },
      { zh: '上網', jyut: 'soeng5 mong5', putong: '上网', en: 'to go online' },
      { zh: '數據', jyut: 'sou3 geoi3', putong: '流量', en: 'mobile data' },
      { zh: '密碼', jyut: 'mat6 maa5', putong: '密码', en: 'password' },
      { zh: '收唔到線', jyut: 'sau1 m4 dou2 sin3', putong: '没信号', en: 'no signal' },
      { zh: '死機', jyut: 'sei2 gei1', putong: '死机', en: 'to freeze / crash' },
    ],
    learnZh: [
      '香港人日常會夾英文：send 個 file 畀我、book 場、chill 吓。夾雜唔係講得差，係本地講法。',
      '「部」係手機、電腦嘅量詞：一部電話、一部電腦。唔係「個」。',
    ],
    learnEn: [
      'Locals mix English in constantly (“send 個 file 畀我”). That is normal here, not sloppy.',
      'Phones and computers take the measure word 部: 一部電話, 一部電腦.',
    ],
  },
  {
    id: 'numbers',
    zh: '數字、時間及日期',
    en: 'Numbers, time and dates',
    whyZh: '約時間、問價、搭車 —— 全部建喺數字上面。數字講唔出，其餘十五個場景都行唔通。',
    whyEn: 'Making plans, asking prices, taking a bus — all of it sits on numbers. Without them the other fifteen scenes stall.',
    phrases: [
      { canto: '而家幾點？', jyut: 'ji4 gaa1 gei2 dim2', putong: '现在几点', en: 'What time is it?', purpose: 'ask' },
      { canto: '三點半喺門口等', jyut: 'saam1 dim2 bun3 hai2 mun4 hau2 dang2', putong: '三点半在门口等', en: 'Meet at the door at half three.', purpose: 'confirm' },
      {
        canto: '聽日星期幾？',
        jyut: 'ting1 jat6 sing1 kei4 gei2',
        putong: '明天星期几',
        en: 'What day is tomorrow?',
        purpose: 'ask',
        noteZh: '「聽日」＝明天、「尋日」＝昨天、「前日」「後日」照推。呢幾個同普通話完全唔同，要死記。',
        noteEn: '聽日 = tomorrow, 尋日 = yesterday. These differ completely from Putonghua and have to be memorised.',
      },
      { canto: '等我一陣，五分鐘就返', jyut: 'dang2 ngo5 jat1 zan6, ng5 fan1 zung1 zau6 faan1', putong: '等我一下，五分钟就回来', en: 'Give me a sec — back in five.', purpose: 'request' },
      { canto: '我遲十分鐘，唔好意思', jyut: 'ngo5 ci4 sap6 fan1 zung1, m4 hou2 ji3 si1', putong: '我晚十分钟，不好意思', en: 'I’ll be ten minutes late, sorry.', purpose: 'need' },
      { canto: '夠鐘喇，走得喇', jyut: 'gau3 zung1 laa3, zau2 dak1 laa3', putong: '时间到了，可以走了', en: 'Time’s up — we can go.', purpose: 'close' },
    ],
    words: [
      { zh: '而家', jyut: 'ji4 gaa1', putong: '现在', en: 'now' },
      { zh: '聽日', jyut: 'ting1 jat6', putong: '明天', en: 'tomorrow' },
      { zh: '尋日', jyut: 'cam4 jat6', putong: '昨天', en: 'yesterday' },
      { zh: '星期', jyut: 'sing1 kei4', putong: '星期', en: 'week / day of week' },
      { zh: '一個鐘', jyut: 'jat1 go3 zung1', putong: '一个小时', en: 'one hour' },
      { zh: '一陣間', jyut: 'jat1 zan6 gaan1', putong: '一会儿', en: 'in a moment' },
      { zh: '夠鐘', jyut: 'gau3 zung1', putong: '时间到了', en: 'time’s up' },
      { zh: '幾多號', jyut: 'gei2 do1 hou6', putong: '几号', en: 'what date' },
    ],
    learnZh: [
      '「鐘」＝小時：一個鐘、半個鐘。「分鐘」先係分。講「一個小時」聽得明，但唔係本地講法。',
      '鐘點用「點」：三點、三點半、三點十五分。同普通話一樣，呢個唔使重新學。',
    ],
    learnEn: [
      '鐘 means “hour”: 一個鐘 = one hour, 半個鐘 = half an hour. 分鐘 is for minutes.',
      'Clock times use 點, the same as Putonghua — this part you already know.',
    ],
  },
  {
    id: 'hangout',
    zh: '同學約人、去街及運動場',
    en: 'Making plans, going out and the sports ground',
    whyZh: '約唔約到、夠唔夠人、邊個畀錢 —— 呢幾句講錯，容易變成下次冇人再叫你。',
    whyEn: 'Making plans, getting the numbers and settling who pays — get these wrong and the next invitation quietly stops coming.',
    phrases: [
      {
        canto: '聽日得唔得閒？一齊去街',
        jyut: 'ting1 jat6 dak1 m4 dak1 haan4? jat1 cai4 heoi3 gaai1',
        putong: '明天有空吗？一起出去',
        en: 'Free tomorrow? Let’s go out.',
        purpose: 'ask',
        noteZh: '「去街」＝出街行吓，唔一定有目的地，亦唔一定要買嘢。',
        noteEn: '去街 just means going out for a wander — no destination and no spending implied.',
      },
      { canto: '我哋幾點喺邊度等？', jyut: 'ngo5 dei6 gei2 dim2 hai2 bin1 dou6 dang2', putong: '我们几点在哪儿等', en: 'What time and where shall we meet?', purpose: 'confirm' },
      {
        canto: '我今日唔得閒，第日先啦',
        jyut: 'ngo5 gam1 jat6 m4 dak1 haan4, dai6 jat6 sin1 laa1',
        putong: '我今天没空，改天吧',
        en: 'Can’t today — another time.',
        purpose: 'decline',
        noteZh: '加返「第日先啦」，人哋先知你係真係唔得閒，唔係唔想去。',
        noteEn: 'Adding 第日先啦 signals you are busy rather than uninterested.',
      },
      {
        canto: '我哋夾錢好唔好？',
        jyut: 'ngo5 dei6 gaap3 cin4 hou2 m4 hou2',
        putong: '我们平摊好不好',
        en: 'Shall we split it?',
        purpose: 'request',
        noteZh: '同學之間夾錢好平常，唔會尷尬。講定咗好過事後計。',
        noteEn: 'Splitting the cost is completely normal between classmates.',
      },
      { canto: '夠唔夠人打波？', jyut: 'gau3 m4 gau3 jan4 daa2 bo1', putong: '人够不够打球', en: 'Have we got enough people for a game?', purpose: 'confirm' },
      {
        canto: '點樣訂個場？',
        jyut: 'dim2 joeng2 deng6 go3 coeng4',
        putong: '怎么订场地',
        en: 'How do I book a court?',
        purpose: 'ask',
        noteZh: '康文署嘅場要預先訂。「訂」喺呢度讀 deng6（口語），書面音係 ding6。',
        noteEn: 'LCSD courts must be booked ahead. 訂 is deng6 in speech; ding6 is the formal reading.',
      },
    ],
    words: [
      { zh: '去街', jyut: 'heoi3 gaai1', putong: '出去逛', en: 'to go out' },
      { zh: '夾錢', jyut: 'gaap3 cin4', putong: '平摊', en: 'to split the cost' },
      { zh: '打波', jyut: 'daa2 bo1', putong: '打球', en: 'to play ball' },
      { zh: '落場', jyut: 'lok6 coeng4', putong: '上场', en: 'to get on court' },
      { zh: '差一個', jyut: 'caa1 jat1 go3', putong: '差一个人', en: 'one short' },
      { zh: '訂場', jyut: 'deng6 coeng4', putong: '订场地', en: 'to book a court' },
      { zh: '第日', jyut: 'dai6 jat6', putong: '改天', en: 'another day' },
      { zh: '一齊', jyut: 'jat1 cai4', putong: '一起', en: 'together' },
    ],
    learnZh: [
      '「夾」＝湊／配合：夾錢、夾時間、夾唔夾夠人。約人嗰陣一定會用到。',
      '好多字有「口語音」同「書面音」兩個讀法（訂 deng6／ding6、聲 seng1／sing1）。口語場合用口語音。',
    ],
    learnEn: [
      '夾 means “to pool or coordinate”: 夾錢 (split the cost), 夾時間 (find a time that works).',
      'Many characters have a colloquial and a literary reading (訂 deng6 / ding6). Use the colloquial one when speaking.',
    ],
  },
  {
    id: 'leisure',
    zh: '打機、煲劇及興趣',
    en: 'Games, shows and hobbies',
    whyZh: '呢啲係識朋友嘅入場券。講唔出自己鍾意咩，就淨係得返「你好」同「食咗飯未」。',
    whyEn: 'This is how friendships start. Without it you are stuck at 你好 and 食咗飯未.',
    phrases: [
      { canto: '你平時得閒做咩？', jyut: 'nei5 ping4 si4 dak1 haan4 zou6 me1', putong: '你平时有空做什么', en: 'What do you do in your free time?', purpose: 'ask' },
      { canto: '我鍾意打機，你玩唔玩？', jyut: 'ngo5 zung1 ji3 daa2 gei1, nei5 waan2 m4 waan2', putong: '我喜欢打游戏，你玩吗', en: 'I’m into games — do you play?', purpose: 'need' },
      {
        canto: '呢套劇好正，你睇咗未？',
        jyut: 'ni1 tou3 kek6 hou2 zeng3, nei5 tai2 zo2 mei6',
        putong: '这部剧很棒，你看了吗',
        en: 'This show’s great — have you seen it?',
        purpose: 'confirm',
        noteZh: '「正」（zeng3）＝好、棒。「好正」比「好好」自然好多，係最常用嘅讚法。',
        noteEn: '正 (zeng3) means “great”. 好正 is far more natural than 好好.',
      },
      { canto: '我唔係好識玩，你教下我', jyut: 'ngo5 m4 hai6 hou2 sik1 waan2, nei5 gaau3 haa5 ngo5', putong: '我不太会玩，你教教我', en: 'I’m not very good — show me how.', purpose: 'request' },
      { canto: '今次唔玩喇，我要做功課', jyut: 'gam1 ci3 m4 waan2 laa3, ngo5 jiu3 zou6 gung1 fo3', putong: '这次不玩了，我要做作业', en: 'I’ll sit this one out — I’ve got homework.', purpose: 'decline' },
      { canto: '得閒再嗌我', jyut: 'dak1 haan4 zoi3 aai3 ngo5', putong: '有空再叫我', en: 'Give me a shout next time.', purpose: 'close' },
    ],
    words: [
      { zh: '打機', jyut: 'daa2 gei1', putong: '打游戏', en: 'to play video games' },
      { zh: '煲劇', jyut: 'bou1 kek6', putong: '刷剧', en: 'to binge a series' },
      { zh: '睇戲', jyut: 'tai2 hei3', putong: '看电影', en: 'to see a film' },
      { zh: '聽歌', jyut: 'teng1 go1', putong: '听歌', en: 'to listen to music' },
      { zh: '好悶', jyut: 'hou2 mun6', putong: '很无聊', en: 'boring' },
      { zh: '嗌', jyut: 'aai3', putong: '叫', en: 'to call out to someone' },
      { zh: '玩', jyut: 'waan2', putong: '玩', en: 'to play' },
      { zh: '鍾意', jyut: 'zung1 ji3', putong: '喜欢', en: 'to like' },
    ],
    learnZh: [
      '「煲」本來係煮嘢（煲湯），「煲劇」＝一次過睇好多集。廣東話好多詞係借日常動作嚟講第二樣嘢。',
      '「鍾意」＝喜歡。呢個詞一日用好多次，而且同普通話完全唔同字，要早啲熟。',
    ],
    learnEn: [
      '煲 literally means to simmer (煲湯); 煲劇 is to binge-watch. Cantonese often borrows everyday actions this way.',
      '鍾意 is “to like” — a completely different word from Putonghua’s 喜欢, and one you will use daily.',
    ],
  },
]

/** 由 id 攞場景。搵唔到回 `undefined`，畀 route 自己決定 404。 */
export const topicById = (id: string): CantoneseTopic | undefined =>
  CANTONESE_TOPICS.find((t) => t.id === id)

/** 場景 id，畀 `generateStaticParams` 用。冇第二張手寫清單。 */
export const SCENE_IDS: string[] = CANTONESE_TOPICS.map((t) => t.id)

/**
 * 全部粵拼嘅結構問題。空 array = 每個音節都係結構上合法嘅粵拼。
 *
 * ⚠️ 空 array【唔代表讀音正確】—— 見檔頭。呢個係測試用嘅單一入口，
 *    令「邊啲字串算粵拼」呢個定義只寫一次：句、詞語表，兩邊一齊掃。
 */
export function jyutpingProblems(): string[] {
  const out: string[] = []
  for (const t of CANTONESE_TOPICS) {
    for (const p of t.phrases) {
      for (const b of checkJyutping(p.jyut)) out.push(`${t.id} / ${p.canto} → 「${b.syllable}」${b.reason}`)
    }
    for (const w of t.words) {
      for (const b of checkJyutping(w.jyut)) out.push(`${t.id} / 詞語「${w.zh}」→ 「${b.syllable}」${b.reason}`)
    }
  }
  return out
}
