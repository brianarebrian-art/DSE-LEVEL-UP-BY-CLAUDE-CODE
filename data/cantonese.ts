// 新來港學生・校園廣東話融入（/cantonese）—— 內容正本。
//
// ══ 目的 ══
// 幫新來港學生快啲融入香港學生嘅廣東話環境。對象係 DSE 考生，所以喺憲章
// §1.2「戰場只有一個：香港 DSE」之內；但呢版係【校園語境】，唔係生活求生粵語 ——
// 冇地鐵、冇問路、冇買嘢。第八個題目（口語 vs 書面語）直接服務卷二寫作。
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
  /** 對應 data/questions 嘅真中文科課題，撳得入練習。 */
  topicId: string
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
]
