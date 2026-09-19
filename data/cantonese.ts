// 新來港學生・校園廣東話融入（/cantonese）—— 內容正本。
//
// ══ 目的 ══
// 幫新來港學生快啲融入香港學生嘅廣東話環境。
//
// 1–8 係【校園語境】，各自綁一個中文科真課題，第八個（口語 vs 書面語）
// 直接服務卷二寫作。呢八個喺憲章 §1.2「戰場只有一個：香港 DSE」之內。
//
// ⚠️ 9–12 係【日常生活】（買嘢／買衫／食嘢／交通住行），2026-09-19 由 Yuna
//    指示加入。呢四個【綁唔到任何中文科課題】—— 十九個課題（指定範文、
//    文言閱讀、修辭、實用寫作…）冇一個載得起「試身」同「八達通」。所以
//    佢哋嘅 `topicId` 留空，卡片唔會出「做呢個課題」個掣。
//
//    夾硬綁一個課題上去會令數據講大話，所以寧可留空 —— 而留空亦令「呢四個
//    同前八個唔同性質」呢件事，喺數據本身就睇得到。
//
// ⚠️ **憲章條文未跟上。** §1.2 同 §2 目標受眾都係圍住 DSE 寫，而買衫、搭車
//    同 DSE 冇關係。同一批用語（「唔該」「喺邊度」「幾多錢」「幫幫手」）
//    喺 2026-09-19 早些時曾經以「§1.2 禁通用粵語班」為由否決過，同日下午
//    改為加入 —— 呢個轉向【只喺呢度有紀錄】。
//
//    憲章 §3.3 寫明：代碼同條文要同一日一齊改，否則「下一個 session 讀憲章
//    就會照 §8.2 白名單再起一次」。今次係反方向：下一個 session 讀 §1.2，
//    見到呢版教緊買衫，就會當佢係違規而拆走。
//
//    草案已出：docs/charter-amendment-2026-09-19-DRAFT.md（⬜ 未簽署）。
//    入面列咗三個選項同兩邊理由，由創辦人揀 —— 呢個係判斷題，唔係工程題。
//    喺簽咗之前，呢四個主題【同其餘八個一樣】仍然要簽名先出得街，
//    所以現階段對學生冇任何影響。
//
// ══ 點解要簽名先出得街 ══
// 粵拼係【事實資料】，而且錯咗冇人會知。一個聲調數字寫錯，學生照住讀就係
// 讀錯咗個音，而呢種錯：
//   · term-guard／i18n-guard／copy-guard 全部唔識粵拼，一條都捉唔到
//   · 唔會 build fail、唔會有紅字、唔會有人投訴
//   · 學語言嘅人一旦記錯個音，改返好過學新嘅難
// 而呢批學生正正就係呢版想幫嗰批。
//
// 所以本檔行同題庫一樣嘅規矩（憲章 §12）：REVIEW.reviewer 留白就【唔會出街】，
// 頁面顯示「仲未上線」。填咗真人名，內容先至 render。
// 迴歸鎖：lib/__tests__/cantonese-review-gate.test.mts
//
// ⚠️ 覆核重點係【粵拼逐個聲調數字】。廣東話、普通話、英文三欄錯咗，任何
//    識廣東話嘅人一眼睇得出；粵拼錯咗要逐個字對先發現 —— 所以覆核唔可以
//    「掃一眼冇問題」就簽。

/** 真人覆核簽署。`reviewer` 留白 = 內容唔出街。唔准由機器填。 */
export const REVIEW: { reviewer: string; reviewedAt: string } = {
  reviewer: '',
  reviewedAt: '',
}

export interface Phrase {
  /** 廣東話（口語寫法） */
  canto: string
  /** 粵拼，音節之間空格分開 */
  jyut: string
  /** 普通話對應說法 */
  putong: string
  /** 英文 */
  en: string
}

export interface CampusTopic {
  id: string
  zh: string
  en: string
  /**
   * 對應 data/questions 嘅真中文科課題，撳得入練習。
   *
   * 日常生活主題（9–12）冇 —— 中文科十九個課題冇一個載得起「試身」或者
   * 「八達通」。留空好過夾硬綁一個，見檔頭。冇 topicId 就唔出練習掣。
   */
  topicId?: string
  whyZh: string
  whyEn: string
  phrases: Phrase[]
}

export const CAMPUS_TOPICS: CampusTopic[] = [
  {
    id: 'classroom',
    zh: '課室用語',
    en: 'In the classroom',
    topicId: 'chars_errors',
    whyZh: '呢批字日日聽到，但好多都係香港獨有講法，內地課室唔會咁講。',
    whyEn: 'You hear these every day, and many are specific to Hong Kong classrooms.',
    phrases: [
      { canto: '老師', jyut: 'lou5 si1', putong: '老师', en: 'teacher' },
      { canto: '上堂', jyut: 'soeng5 tong4', putong: '上课', en: 'to have a lesson' },
      { canto: '落堂', jyut: 'lok6 tong4', putong: '下课', en: 'lesson ends' },
      { canto: '功課', jyut: 'gung1 fo3', putong: '作业', en: 'homework' },
      { canto: '抄筆記', jyut: 'caau1 bat1 gei3', putong: '记笔记', en: 'to take notes' },
      { canto: '派卷', jyut: 'paai3 gyun2', putong: '发卷子', en: 'to hand out papers' },
    ],
  },
  {
    id: 'recess',
    zh: '小息傾偈',
    en: 'Talking at recess',
    topicId: 'comprehension',
    whyZh: '小息係最快融入嘅時候，但同學講嘢快，慣用語多。',
    whyEn: 'Recess is where you settle in fastest — but classmates talk quickly and use a lot of set phrases.',
    phrases: [
      { canto: '小息', jyut: 'siu2 sik1', putong: '课间休息', en: 'recess / break' },
      { canto: '傾偈', jyut: 'king1 gai2', putong: '聊天', en: 'to chat' },
      { canto: '飯堂', jyut: 'faan6 tong4', putong: '食堂', en: 'canteen' },
      { canto: '一齊去', jyut: 'jat1 cai4 heoi3', putong: '一起去', en: 'to go together' },
      { canto: '等陣先', jyut: 'dang2 zan6 sin1', putong: '等一下', en: 'hold on a moment' },
      { canto: '一陣見', jyut: 'jat1 zan6 gin3', putong: '待会见', en: 'see you later' },
    ],
  },
  {
    id: 'homework',
    zh: '功課同測驗',
    en: 'Homework and tests',
    topicId: 'practical_writing',
    whyZh: '呢批詞關乎交唔交到功課、知唔知幾時測驗，講錯會真係蝕底。',
    whyEn: 'These decide whether you hand work in on time and whether you know when a test is — getting them wrong costs you.',
    phrases: [
      { canto: '測驗', jyut: 'caak1 jim6', putong: '测验', en: 'test / quiz' },
      { canto: '考試', jyut: 'haau2 si3', putong: '考试', en: 'examination' },
      { canto: '溫書', jyut: 'wan1 syu1', putong: '复习', en: 'to revise' },
      { canto: '交功課', jyut: 'gaau1 gung1 fo3', putong: '交作业', en: 'to hand in homework' },
      { canto: '補交', jyut: 'bou2 gaau1', putong: '补交', en: 'to hand in late' },
      { canto: '溫唔切', jyut: 'wan1 m4 cit3', putong: '来不及复习', en: 'no time left to revise' },
    ],
  },
  {
    id: 'teachers',
    zh: '同師長講嘢',
    en: 'Speaking to teachers',
    topicId: 'rhetoric',
    whyZh: '同老師講嘢要有禮貌但唔使太生硬。呢幾句係最常用、最安全嘅講法。',
    whyEn: 'Polite without being stiff. These are the most common and safest ways to put it.',
    phrases: [
      { canto: '請問', jyut: 'cing2 man6', putong: '请问', en: 'may I ask' },
      { canto: '我唔明', jyut: 'ngo5 m4 ming4', putong: '我不明白', en: 'I do not understand' },
      { canto: '可唔可以再講一次', jyut: 'ho2 m4 ho2 ji5 zoi3 gong2 jat1 ci3', putong: '可以再说一遍吗', en: 'could you say that again' },
      { canto: '我遲到咗', jyut: 'ngo5 ci4 dou3 zo2', putong: '我迟到了', en: 'I am late' },
      { canto: '唔好意思', jyut: 'm4 hou2 ji3 si1', putong: '不好意思', en: 'sorry / excuse me' },
      { canto: '唔該晒', jyut: 'm4 goi1 saai3', putong: '太谢谢了', en: 'thanks very much' },
    ],
  },
  {
    id: 'peers',
    zh: '同學之間',
    en: 'Among classmates',
    topicId: 'idioms_vocab',
    whyZh: '同學之間講嘢唔會照書面語。聽唔明呢幾句，好易以為人哋唔想同你講嘢。',
    whyEn: 'Classmates do not talk like a textbook. Missing these is easily mistaken for being left out.',
    phrases: [
      { canto: '係咪', jyut: 'hai6 mai6', putong: '是不是', en: 'is it / isn’t it' },
      { canto: '點呀', jyut: 'dim2 aa3', putong: '怎么样', en: 'how’s it going' },
      { canto: '冇所謂', jyut: 'mou5 so2 wai6', putong: '无所谓', en: 'it doesn’t matter' },
      { canto: '搞掂', jyut: 'gaau2 dim6', putong: '搞定', en: 'done / sorted' },
      { canto: '唔使驚', jyut: 'm4 sai2 geng1', putong: '不用怕', en: 'no need to worry' },
      { canto: '好耐冇見', jyut: 'hou2 noi6 mou5 gin3', putong: '好久不见', en: 'long time no see' },
    ],
  },
  {
    id: 'school-life',
    zh: '校園生活同活動',
    en: 'School life and activities',
    topicId: 'fanwen_diction',
    whyZh: '課外活動係識朋友最快嘅路。報唔到名，多數係因為唔知佢哋講緊乜。',
    whyEn: 'Activities are the fastest way to make friends. Missing out usually means not following what was said.',
    phrases: [
      { canto: '課外活動', jyut: 'fo3 ngoi6 wut6 dung6', putong: '课外活动', en: 'extracurricular activity' },
      { canto: '學會', jyut: 'hok6 wui2', putong: '社团', en: 'club / society' },
      { canto: '週會', jyut: 'zau1 wui2', putong: '周会', en: 'assembly' },
      { canto: '報名', jyut: 'bou3 ming4', putong: '报名', en: 'to sign up' },
      { canto: '開會', jyut: 'hoi1 wui2', putong: '开会', en: 'to hold a meeting' },
      { canto: '旅行', jyut: 'leoi5 hang4', putong: '旅行', en: 'school trip' },
    ],
  },
  {
    id: 'help',
    zh: '禮貌同求助',
    en: 'Politeness and asking for help',
    topicId: 'classical_lexis',
    whyZh: '「唔該」同「多謝」喺香港分得好清楚，用錯唔會有人話你，但聽落就係唔啱。',
    whyEn: 'Hong Kong separates 唔該 and 多謝 sharply. Nobody corrects you, but it sounds off.',
    phrases: [
      { canto: '唔該', jyut: 'm4 goi1', putong: '劳驾 / 谢谢', en: 'excuse me / thanks (for a service)' },
      { canto: '多謝', jyut: 'do1 ze6', putong: '谢谢', en: 'thank you (for a gift or kindness)' },
      { canto: '唔緊要', jyut: 'm4 gan2 jiu3', putong: '没关系', en: 'it’s alright' },
      { canto: '幫我手', jyut: 'bong1 ngo5 sau2', putong: '帮我一下', en: 'give me a hand' },
      { canto: '借借', jyut: 'ze3 ze3', putong: '借过', en: 'excuse me (let me past)' },
      { canto: '唔好客氣', jyut: 'm4 hou2 haak3 hei3', putong: '不用客气', en: 'you’re welcome' },
    ],
  },
  {
    id: 'spoken-written',
    zh: '口語轉書面語',
    en: 'From speech to written Chinese',
    topicId: 'argument_essay',
    whyZh: '呢個題目直接影響卷二。口語詞寫入作文，論點企得住都一樣失分。',
    whyEn: 'This one hits Paper 2 directly: spoken words in an essay cost marks even when the argument holds.',
    phrases: [
      { canto: '畀', jyut: 'bei2', putong: '给', en: 'to give → write 給' },
      { canto: '睇', jyut: 'tai2', putong: '看', en: 'to look / read → write 看 or 閱讀' },
      { canto: '嘅', jyut: 'ge3', putong: '的', en: 'possessive particle → write 的' },
      { canto: '冇', jyut: 'mou5', putong: '没有', en: 'not have → write 沒有' },
      { canto: '係', jyut: 'hai6', putong: '是', en: 'to be → write 是' },
      { canto: '唔', jyut: 'm4', putong: '不', en: 'not → write 不' },
    ],
  },

  // ── 9–12：日常生活 ─────────────────────────────────────────────────────
  // 冇 topicId，冇練習掣。範圍問題見檔頭 ⚠️。
  {
    id: 'shopping',
    zh: '買嘢',
    en: 'Shopping',
    whyZh: '香港鋪頭講價、找續嘅講法同內地唔同，聽唔明好容易畀人當唔識行情。',
    whyEn: 'How prices and change are talked about here differs from the mainland.',
    phrases: [
      { canto: '幾多錢', jyut: 'gei2 do1 cin2', putong: '多少钱', en: 'how much is it' },
      { canto: '我睇睇先', jyut: 'ngo5 tai2 tai2 sin1', putong: '我先看看', en: 'I’m just looking' },
      { canto: '平啲得唔得', jyut: 'peng4 di1 dak1 m4 dak1', putong: '能便宜点吗', en: 'can you do it cheaper' },
      { canto: '唔使找', jyut: 'm4 sai2 zaau2', putong: '不用找了', en: 'keep the change' },
      { canto: '刷卡得唔得', jyut: 'caat3 kaat1 dak1 m4 dak1', putong: '可以刷卡吗', en: 'can I pay by card' },
      { canto: '有冇袋', jyut: 'jau5 mou5 doi2', putong: '有没有袋子', en: 'do you have a bag' },
    ],
  },
  {
    id: 'clothes',
    zh: '買衫',
    en: 'Buying clothes',
    whyZh: '碼數、試身、換貨呢幾樣，唔識講就成單交易都卡住。',
    whyEn: 'Sizes, trying on and exchanges — not having the words stalls the whole thing.',
    phrases: [
      { canto: '試身', jyut: 'si3 san1', putong: '试穿', en: 'to try on' },
      { canto: '有冇細碼', jyut: 'jau5 mou5 sai3 maa5', putong: '有没有小号', en: 'do you have a small' },
      { canto: '大碼', jyut: 'daai6 maa5', putong: '大号', en: 'large size' },
      { canto: '啱唔啱身', jyut: 'ngaam1 m4 ngaam1 san1', putong: '合不合身', en: 'does it fit' },
      { canto: '換得唔換得', jyut: 'wun6 dak1 m4 wun6 dak1', putong: '能不能换', en: 'can it be exchanged' },
      { canto: '有冇第二隻色', jyut: 'jau5 mou5 dai6 ji6 zek3 sik1', putong: '有没有别的颜色', en: 'any other colour' },
    ],
  },
  {
    id: 'eating',
    zh: '食嘢',
    en: 'Eating out',
    whyZh: '茶餐廳落單係一套自己嘅簡稱。「走青」「少甜」唔係書面語，但日日都用。',
    whyEn: 'Ordering in a cha chaan teng runs on its own shorthand — not textbook Chinese, but used daily.',
    phrases: [
      { canto: '落單', jyut: 'lok6 daan1', putong: '点菜', en: 'to order' },
      { canto: '走青', jyut: 'zau2 ceng1', putong: '不要葱', en: 'hold the spring onion' },
      { canto: '少甜', jyut: 'siu2 tim4', putong: '少糖', en: 'less sugar' },
      { canto: '打包', jyut: 'daa2 baau1', putong: '打包', en: 'to take away' },
      { canto: '埋單', jyut: 'maai4 daan1', putong: '买单', en: 'the bill, please' },
      { canto: '唔該加水', jyut: 'm4 goi1 gaa1 seoi2', putong: '请加点水', en: 'more water, please' },
    ],
  },
  {
    id: 'transport',
    zh: '交通住行',
    en: 'Getting around',
    whyZh: '「有落」係小巴專用，唔嗌就過咗站。呢啲嘢冇人會特登教。',
    whyEn: '「有落」is minibus-only — not calling it means missing your stop. Nobody teaches this on purpose.',
    phrases: [
      { canto: '搭車', jyut: 'daap3 ce1', putong: '坐车', en: 'to take transport' },
      { canto: '八達通', jyut: 'baat3 daat6 tung1', putong: '八达通', en: 'Octopus card' },
      { canto: '落車', jyut: 'lok6 ce1', putong: '下车', en: 'to get off' },
      { canto: '轉車', jyut: 'zyun3 ce1', putong: '换乘', en: 'to change lines' },
      { canto: '有落', jyut: 'jau5 lok6', putong: '到站下车', en: 'stopping here (on a minibus)' },
      { canto: '幾點埋站', jyut: 'gei2 dim2 maai4 zaam6', putong: '几点到站', en: 'when does it get in' },
    ],
  },
]
