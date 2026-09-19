// 新來港 · 香港日常廣東話 —— 內容正本。
//
// ══ 呢個係一個獨立課程，唔屬中文科 ══
// 2026-09-19 由 Yuna 定案：要嘅唔係校園／考試綁課題，係【香港人平時出街
// 真係會講嘅話】。所以十二個主題【全部冇 topicId】，卡片一個練習掣都冇。
//
// 呢個 0/12 唔係疏忽，係刻意，而且睇得到 —— 中文科十九個課題（指定範文、
// 文言閱讀、修辭、實用寫作…）冇一個載得起「試身室喺邊」或者「幫我增值一百蚊」。
// 夾硬綁一個上去會令數據講大話，所以寧可留空。
//
// ⚠️ **憲章條文未跟上。**
//    §1.2「戰場只有一個：香港 DSE」同 §2 目標受眾都係圍住 DSE 寫，
//    而本檔 0/12 —— 即係話「呢個係 DSE 產品嘅一部分」呢個講法，
//    冇咗任何結構上嘅支撐。
//    草案：docs/charter-amendment-2026-09-19-DRAFT.md（⬜ 未簽署）。
//    喺簽咗之前，全部內容仍然要簽名先出得街（見下），所以現階段對學生冇影響。
//
// ══ 每句都要有一個真實溝通目的 ══
// 由「詞彙表」改成「用得出嘅句」。舊版收錄過「係咪」「點呀」「搞掂」呢類
// 單詞 —— 識咗唔等於開得到口。現版每句都帶一個 `purpose`：
// 發問／確認／表達需要／禮貌請求／拒絕修正／請人重複／收尾道謝。
//
// `purpose` 唔淨係畀學生睇，亦令「六句功能夠唔夠散」變成一條驗得到嘅測試
// （見 lib/__tests__/cantonese-review-gate.test.mts 測試 ⑦）。一個淨係教
// 發問、教唔到點樣禮貌拒絕嘅主題，喺數據上面就會睇得出。
//
// ══ 對象係 12–18 歲，唔係成年人 ══
// 清單刻意剔走咗租屋／水電／管理處、銀行／郵局、鄰居 —— 中六生唔會租屋、
// 唔會同管理處交涉水電，嗰啲係家長嘅差事。
//
// 同一個理由影響到逐句嘅寫法：約人嗰句寫「我哋夾錢好唔好？」而唔係
// 「今次我請你」—— 後者假設咗學生畀得起，而呢批學生入面唔係個個畀得起。
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
// 頁面顯示「內容正由真人校對中」，連每張卡涵蓋嘅溝通目的一齊出（結構），
// 但零粵拼入 DOM。填咗真人名，啲句先至 render。
// 迴歸鎖：lib/__tests__/cantonese-review-gate.test.mts
//
// ⚠️ 覆核重點係【粵拼逐個聲調數字】。廣東話、普通話、英文三欄錯咗，任何
//    識廣東話嘅人一眼睇得出；粵拼錯咗要逐個字對先發現 —— 所以覆核唔可以
//    「掃一眼冇問題」就簽。
//
//    寫嗰陣自己都揀唔定嘅，逐個列咗喺 `UNSURE`。由嗰度開始對最有效率，
//    但【唔代表其餘嗰啲一定啱】—— 信心高唔等於啱。

/** 真人覆核簽署。`reviewer` 留白 = 內容唔出街。唔准由機器填。 */
export const REVIEW: { reviewer: string; reviewedAt: string } = {
  reviewer: '',
  reviewedAt: '',
}

export interface UnsureItem {
  /** 廣東話（連上下文，方便覆核人喺頁面搵返） */
  term: string
  /** 寫咗乜、另一個可能係乜 */
  note: string
  /**
   * 呢個音出現喺邊幾個場景。必須係真嘅 topic id ——
   * 測試 ⑩ 會對返 `CANTONESE_TOPICS`。
   *
   * ⚠️ 呢個欄位唔係「標籤」，係接線。場景詳情頁靠佢揀出該場景相關嗰批；
   *    打錯一個字，個場景就會靜靜哋話「冇列出任何唔肯定嘅粵拼」——
   *    而嗰句係假嘅，同時唔會有任何嘢紅。
   */
  scenes: string[]
}

/**
 * 寫嘅時候自己揀唔定嘅粵拼，覆核時優先對呢批。
 *
 * ⚠️ 呢張表淨係列「我知道自己唔肯定」嗰啲。真正危險嘅係第三類 ——
 *    寫嗰陣完全冇為意、所以連疑問都冇記低嘅音。嗰啲唔會喺呢度出現。
 *    所以一個場景喺呢度零命中，【唔等於】嗰六句已驗證。
 */
export const UNSURE: UnsureItem[] = [
  { term: '嚟（我係新嚟嘅・我啱啱嚟香港）', note: '寫咗 lai4，定 lei4？兩個都有人讀', scenes: ['greeting'] },
  { term: '稱呼（點稱呼你呀）', note: '寫咗 cing1 fu1，定 cing3 fu1？', scenes: ['greeting'] },
  { term: '廣東話', note: '寫咗 gwong2 dung1 waa2，waa2 定 waa6？', scenes: ['greeting'] },
  { term: '錢（幾多錢・一斤幾多錢・價錢）', note: '寫咗 cin4，定 cin2？', scenes: ['shopping', 'market'] },
  { term: '袋（有冇袋）', note: '寫咗 doi2，定 doi6？名詞「袋」同動詞「袋」唔同音', scenes: ['shopping'] },
  { term: '諗（我諗諗先・等我諗吓先）', note: '寫咗 nam2，定 lam2？', scenes: ['clothes', 'slang'] },
  { term: '位（有冇位坐）', note: '寫咗 wai2，定 wai6？', scenes: ['library'] },
  { term: '插蘇', note: '寫咗 caap3 sou1，sou1 定 sou2？', scenes: ['library'] },
  { term: '訂場（點樣訂個場）', note: '寫咗 deng6，定 ding6？兩個讀法都有人用', scenes: ['hangout'] },
  { term: '聲（大聲啲・細聲啲）', note: '寫咗 seng1，定 sing1？口語同書面唔同', scenes: ['help', 'library'] },
]

/** 揀出同一個場景相關嘅唔肯定項。冇命中回空 array —— 呢個唔代表嗰六句已驗。 */
export const unsureForScene = (sceneId: string): UnsureItem[] =>
  UNSURE.filter((u) => u.scenes.includes(sceneId))

/**
 * 一句嘅溝通目的。呢個係一個【封閉集合】—— 加新值之前要諗清楚，
 * 因為測試 ⑦ 靠佢量度每個主題嘅功能夠唔夠散。
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

export const PURPOSES: Purpose[] = [
  'ask',
  'confirm',
  'need',
  'request',
  'decline',
  'repeat',
  'close',
]

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
  /** 文化或使用情境註，只喺真係需要嗰陣寫 —— 每句都有註就冇人會睇 */
  noteZh?: string
  noteEn?: string
}

export interface CantoneseTopic {
  id: string
  zh: string
  en: string
  /**
   * 對應 data/questions 嘅真中文科課題。
   *
   * ⚠️ 現版【十二個全部留空】—— 呢個係獨立課程，唔屬中文科（見檔頭）。
   *    欄位保留住，係因為日後若果決定加返校園主題，佢哋係綁得返嘅。
   *    冇 topicId 就唔出練習掣。
   */
  topicId?: string
  whyZh: string
  whyEn: string
  /**
   * 安全提示。只擺喺【講到身體、求助、危險】嗰啲主題。
   * 一個學生喺呢兩版度搵嘅係求救嘅字，唔係一個課程 —— 所以要寫明呢度
   * 唔代替醫生、老師、社工、家長同緊急服務。
   */
  safetyZh?: string
  safetyEn?: string
  phrases: Phrase[]
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
        noteZh: '「早晨」淨係上晝用。下晝再講就會怪，一般冇特別招呼語，點個頭都得。',
        noteEn: '早晨 is morning-only. In the afternoon people often just nod — there is no fixed equivalent.',
      },
      {
        canto: '點稱呼你呀？',
        jyut: 'dim2 cing1 fu1 nei5 aa3',
        putong: '怎么称呼你',
        en: 'What should I call you?',
        purpose: 'ask',
      },
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
      {
        canto: '得閒再傾，我要返班先',
        jyut: 'dak1 haan4 zoi3 king1, ngo5 jiu3 faan1 baan1 sin1',
        putong: '有空再聊，我要去上课了',
        en: 'Let’s talk again — I’ve got class.',
        purpose: 'close',
      },
    ],
  },
  {
    id: 'shopping',
    zh: '買嘢及問價',
    en: 'Shopping and asking prices',
    whyZh: '細舖講得價，連鎖店唔講。開錯口冇人會話你，但個場面會好尷尬。',
    whyEn: 'Small shops haggle; chains do not. Nobody corrects you, but it lands awkwardly.',
    phrases: [
      {
        canto: '呢個幾多錢呀？',
        jyut: 'ni1 go3 gei2 do1 cin4 aa3',
        putong: '这个多少钱',
        en: 'How much is this?',
        purpose: 'ask',
      },
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
        noteEn: 'Fine at markets, stalls and small shops. Chains, convenience stores and supermarkets do not haggle.',
      },
      {
        canto: '唔該，你可唔可以再講一次？',
        jyut: 'm4 goi1, nei5 ho2 m4 ho2 ji5 zoi3 gong2 jat1 ci3',
        putong: '麻烦你，可以再说一次吗',
        en: 'Sorry — could you say that once more?',
        purpose: 'repeat',
      },
      {
        canto: '我要呢個，唔該',
        jyut: 'ngo5 jiu3 ni1 go3, m4 goi1',
        putong: '我要这个，谢谢',
        en: 'I’ll take this one, thanks.',
        purpose: 'need',
      },
      {
        canto: '有冇袋呀？',
        jyut: 'jau5 mou5 doi2 aa3',
        putong: '有没有袋子',
        en: 'Do you have a bag?',
        purpose: 'confirm',
        noteZh: '香港膠袋要收費，舖頭唔會自動畀。',
        noteEn: 'Plastic bags are charged for here, so shops do not hand them out automatically.',
      },
    ],
  },
  {
    id: 'clothes',
    zh: '買衫及試身',
    en: 'Buying clothes and trying things on',
    whyZh: '碼數同試身嘅講法同內地唔同，講錯就成單嘢卡住。',
    whyEn: 'Sizes and fitting rooms are asked about differently here — get it wrong and the whole thing stalls.',
    phrases: [
      {
        canto: '可唔可以試吓？',
        jyut: 'ho2 m4 ho2 ji5 si3 haa5',
        putong: '可以试一下吗',
        en: 'Can I try this on?',
        purpose: 'request',
      },
      {
        canto: '試身室喺邊呀？',
        jyut: 'si3 san1 sat1 hai2 bin1 aa3',
        putong: '试衣间在哪',
        en: 'Where’s the fitting room?',
        purpose: 'ask',
      },
      {
        canto: '有冇大一個碼？',
        jyut: 'jau5 mou5 daai6 jat1 go3 maa5',
        putong: '有没有大一号',
        en: 'Do you have the next size up?',
        purpose: 'confirm',
      },
      {
        canto: '呢件有冇第二隻色？',
        jyut: 'ni1 gin6 jau5 mou5 dai6 ji6 zek3 sik1',
        putong: '这件有没有别的颜色',
        en: 'Does this come in another colour?',
        purpose: 'ask',
      },
      {
        canto: '我諗諗先，唔該晒',
        jyut: 'ngo5 nam2 nam2 sin1, m4 goi1 saai3',
        putong: '我再想想，谢谢',
        en: 'Let me think about it — thanks.',
        purpose: 'decline',
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
  },
  {
    id: 'food',
    zh: '食飯、叫餐及打包',
    en: 'Eating out, ordering and takeaway',
    whyZh: '茶餐廳落單係一套自己嘅簡稱，餐牌上面都唔會解釋。',
    whyEn: 'Cha chaan teng ordering runs on shorthand the menu never explains.',
    phrases: [
      {
        canto: '唔該，落單',
        jyut: 'm4 goi1, lok6 daan1',
        putong: '麻烦你，点菜',
        en: 'Excuse me — we’d like to order.',
        purpose: 'need',
      },
      {
        canto: '呢個辣唔辣㗎？',
        jyut: 'ni1 go3 laat6 m4 laat6 gaa3',
        putong: '这个辣不辣',
        en: 'Is this spicy?',
        purpose: 'ask',
      },
      {
        canto: '走蔥，唔該',
        jyut: 'zau2 cung1, m4 goi1',
        putong: '不要葱，谢谢',
        en: 'Hold the spring onion, please.',
        purpose: 'request',
        noteZh: '「走X」＝唔要X（走冰、走甜、走辣）。相反「加底」＝加飯或加麵，要加錢。',
        noteEn: '走X means “without X” (走冰 = no ice, 走甜 = no sugar). 加底 is the opposite — extra rice or noodles, at extra cost.',
      },
      {
        canto: '唔該，我唔食得辣',
        jyut: 'm4 goi1, ngo5 m4 sik6 dak1 laat6',
        putong: '麻烦你，我不能吃辣',
        en: 'Sorry — I can’t eat spicy food.',
        purpose: 'decline',
      },
      {
        canto: '唔該打包',
        jyut: 'm4 goi1 daa2 baau1',
        putong: '麻烦打包',
        en: 'To take away, please.',
        purpose: 'request',
      },
      {
        canto: '唔該，埋單',
        jyut: 'm4 goi1, maai4 daan1',
        putong: '麻烦买单',
        en: 'The bill, please.',
        purpose: 'close',
      },
    ],
  },
  {
    id: 'transport',
    zh: '搭車及問路',
    en: 'Getting around and asking directions',
    whyZh: '「有落」係小巴專用，唔嗌就過咗站。呢啲嘢冇人會特登教。',
    whyEn: '「有落」is minibus-only — not calling it means missing your stop. Nobody teaches this on purpose.',
    phrases: [
      {
        canto: '唔該，請問點去地鐵站？',
        jyut: 'm4 goi1, cing2 man6 dim2 heoi3 dei6 tit3 zaam6',
        putong: '请问地铁站怎么走',
        en: 'Excuse me — how do I get to the MTR station?',
        purpose: 'ask',
      },
      {
        canto: '係咪搭呢架車？',
        jyut: 'hai6 mai6 daap3 ni1 gaa3 ce1',
        putong: '是不是坐这辆车',
        en: 'Is this the right bus?',
        purpose: 'confirm',
      },
      {
        canto: '有落，唔該！',
        jyut: 'jau5 lok6, m4 goi1',
        putong: '到站下车',
        en: 'Stopping here, please!',
        purpose: 'request',
        noteZh: '小巴冇落車鐘，要開聲嗌，而且要早一個街口嗌。唔嗌就過站。',
        noteEn: 'Minibuses have no stop bell — you call this out, about a block early. Stay quiet and you go past your stop.',
      },
      {
        canto: '唔好意思，你頭先講邊個站？',
        jyut: 'm4 hou2 ji3 si1, nei5 tau4 sin1 gong2 bin1 go3 zaam6',
        putong: '不好意思，你刚才说哪个站',
        en: 'Sorry — which stop did you say?',
        purpose: 'repeat',
      },
      {
        canto: '仲有幾多個站？',
        jyut: 'zung6 jau5 gei2 do1 go3 zaam6',
        putong: '还有几个站',
        en: 'How many stops to go?',
        purpose: 'confirm',
      },
      {
        canto: '唔該，去邊度增值？',
        jyut: 'm4 goi1, heoi3 bin1 dou6 zang1 zik6',
        putong: '请问在哪儿充值',
        en: 'Excuse me — where can I top up?',
        purpose: 'need',
        noteZh: '八達通喺便利店、地鐵站同好多舖頭都增值得。呢句唔止用喺八達通。',
        noteEn: 'Octopus tops up at convenience stores, MTR stations and many shops. The phrase works for other stored-value cards too.',
      },
    ],
  },
  {
    id: 'clinic',
    zh: '睇醫生及去藥房',
    en: 'Seeing a doctor and at the pharmacy',
    whyZh: '身體唔舒服嗰陣最唔想搵字，所以呢幾句要熟到唔使諗。',
    whyEn: 'When you feel ill is the worst time to be hunting for words — these should be automatic.',
    safetyZh:
      '呢一頁係語言參考，唔代替醫生、護士、老師、社工或者家長。唔舒服要搵身邊可信任嘅大人；緊急情況打 999。',
    safetyEn:
      'This page is language reference only. It does not replace a doctor, nurse, teacher, social worker or your family. If you feel unwell, tell a trusted adult; in an emergency call 999.',
    phrases: [
      {
        canto: '我想睇醫生',
        jyut: 'ngo5 soeng2 tai2 ji1 sang1',
        putong: '我想看医生',
        en: 'I’d like to see a doctor.',
        purpose: 'need',
      },
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
      {
        canto: '呢隻藥一日食幾多次？',
        jyut: 'ni1 zek3 joek6 jat1 jat6 sik6 gei2 do1 ci3',
        putong: '这个药一天吃几次',
        en: 'How many times a day do I take this?',
        purpose: 'confirm',
      },
      {
        canto: '唔該，可唔可以寫低？我怕記唔住',
        jyut: 'm4 goi1, ho2 m4 ho2 ji5 se2 dai1? ngo5 paa3 gei3 m4 zyu6',
        putong: '麻烦你，可以写下来吗？我怕记不住',
        en: 'Could you write it down? I’m worried I’ll forget.',
        purpose: 'repeat',
        noteZh: '聽唔晒醫生講嘅嘢好平常。要求寫低唔失禮，而且字面嘢返到屋企查得返。',
        noteEn: 'Not catching everything a doctor says is normal. Asking for it in writing is not rude, and you can look it up later.',
      },
      {
        canto: '我對呢隻藥敏感',
        jyut: 'ngo5 deoi3 ni1 zek3 joek6 man5 gam2',
        putong: '我对这个药过敏',
        en: 'I’m allergic to this medicine.',
        purpose: 'decline',
        noteZh: '香港講「敏感」，唔講「過敏」。呢個字講錯，對方可能聽唔出係嚴重事。',
        noteEn: 'Hong Kong says 敏感, not 過敏. Using the wrong word can make it sound less serious than it is.',
      },
    ],
  },
  {
    id: 'market',
    zh: '街市及超級市場',
    en: 'Wet market and supermarket',
    whyZh: '街市用斤唔用公斤，而且要開口講數量，同超市攞完就走完全唔同。',
    whyEn: 'Wet markets work in catties, and you have to say the amount out loud — nothing like picking things off a shelf.',
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
      {
        canto: '要半斤，唔該',
        jyut: 'jiu3 bun3 gan1, m4 goi1',
        putong: '要半斤，谢谢',
        en: 'Half a catty, please.',
        purpose: 'need',
      },
      {
        canto: '唔該幫我切開佢',
        jyut: 'm4 goi1 bong1 ngo5 cit3 hoi1 keoi5',
        putong: '麻烦帮我切开',
        en: 'Could you cut it up for me?',
        purpose: 'request',
      },
      {
        canto: '唔該，唔使咁多',
        jyut: 'm4 goi1, m4 sai2 gam3 do1',
        putong: '不用这么多',
        en: 'That’s too much — a bit less, please.',
        purpose: 'decline',
        noteZh: '檔主秤多咗好平常，開聲叫少啲唔係失禮，秤之前講就最好。',
        noteEn: 'Stallholders often scoop more than you asked for. Saying so is normal — best said before it goes on the scale.',
      },
      {
        canto: '係咪呢個價錢？',
        jyut: 'hai6 mai6 ni1 go3 gaa3 cin4',
        putong: '是这个价钱吗',
        en: 'Is that the price?',
        purpose: 'confirm',
      },
      {
        canto: '邊度埋單呀？',
        jyut: 'bin1 dou6 maai4 daan1 aa3',
        putong: '在哪结账',
        en: 'Where do I pay?',
        purpose: 'ask',
      },
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
      {
        canto: '唔該，可唔可以幫幫手？',
        jyut: 'm4 goi1, ho2 m4 ho2 ji5 bong1 bong1 sau2',
        putong: '麻烦你，可以帮个忙吗',
        en: 'Excuse me — could you give me a hand?',
        purpose: 'request',
      },
      {
        canto: '我唔識路，可唔可以話我知點行？',
        jyut: 'ngo5 m4 sik1 lou6, ho2 m4 ho2 ji5 waa6 ngo5 zi1 dim2 haang4',
        putong: '我不认识路，可以告诉我怎么走吗',
        en: 'I don’t know the way — could you tell me how to get there?',
        purpose: 'need',
      },
      {
        canto: '聽唔清楚，可唔可以大聲啲？',
        jyut: 'teng1 m4 cing1 co2, ho2 m4 ho2 ji5 daai6 seng1 di1',
        putong: '听不清楚，可以大声点吗',
        en: 'I can’t hear you — could you speak up?',
        purpose: 'repeat',
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
      {
        canto: '等陣我打返畀你，得唔得？',
        jyut: 'dang2 zan6 ngo5 daa2 faan1 bei2 nei5, dak1 m4 dak1',
        putong: '我待会儿打回给你，行吗',
        en: 'Can I call you back in a bit?',
        purpose: 'confirm',
      },
      {
        canto: '唔該晒你，唔好意思阻你咁耐',
        jyut: 'm4 goi1 saai3 nei5, m4 hou2 ji3 si1 zo2 nei5 gam3 noi6',
        putong: '太谢谢你了，不好意思耽误你这么久',
        en: 'Thanks so much — sorry to have kept you.',
        purpose: 'close',
      },
    ],
  },
  {
    id: 'slang',
    zh: '香港常用口頭語及閒聊',
    en: 'Everyday fillers and small talk',
    whyZh: '呢幾句本身冇乜實質資訊，但唔用就會聽落好似喺度讀課本。',
    whyEn: 'These carry almost no information — but without them you sound like you are reading from a textbook.',
    phrases: [
      {
        canto: '搞掂晒喇！',
        jyut: 'gaau2 dim6 saai3 laa3',
        putong: '都搞定了',
        en: 'All sorted!',
        purpose: 'close',
      },
      {
        canto: '冇所謂，你話事',
        jyut: 'mou5 so2 wai6, nei5 waa6 si6',
        putong: '无所谓，你决定',
        en: 'I don’t mind — you decide.',
        purpose: 'decline',
      },
      {
        canto: '真係㗎？',
        jyut: 'zan1 hai6 gaa3',
        putong: '真的吗',
        en: 'Really?',
        purpose: 'confirm',
      },
      {
        canto: '唔緊要，冇事嘅',
        jyut: 'm4 gan2 jiu3, mou5 si6 ge3',
        putong: '没关系，没事的',
        en: 'It’s alright, no harm done.',
        purpose: 'close',
      },
      {
        canto: '係咪呀？我唔係好明',
        jyut: 'hai6 mai6 aa3? ngo5 m4 hai6 hou2 ming4',
        putong: '是吗？我不太明白',
        en: 'Is that right? I don’t quite follow.',
        purpose: 'repeat',
        noteZh: '「唔係好明」比「唔明」軟啲，唔會令對方覺得自己講得差。',
        noteEn: '唔係好明 is softer than 唔明 — it does not imply the other person explained badly.',
      },
      {
        canto: '等我諗吓先',
        jyut: 'dang2 ngo5 nam2 haa5 sin1',
        putong: '让我想一下',
        en: 'Let me think about it for a sec.',
        purpose: 'need',
      },
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
      },
      {
        canto: '你哋幾點閂門？',
        jyut: 'nei5 dei6 gei2 dim2 saan1 mun4',
        putong: '你们几点关门',
        en: 'What time do you close?',
        purpose: 'confirm',
      },
      {
        canto: '我想借呢本書',
        jyut: 'ngo5 soeng2 ze3 ni1 bun2 syu1',
        putong: '我想借这本书',
        en: 'I’d like to borrow this book.',
        purpose: 'need',
      },
      {
        canto: '幾時要還？',
        jyut: 'gei2 si4 jiu3 waan4',
        putong: '什么时候要还',
        en: 'When is it due back?',
        purpose: 'confirm',
      },
      {
        canto: '唔該，附近有冇插蘇？',
        jyut: 'm4 goi1, fu6 gan6 jau5 mou5 caap3 sou1',
        putong: '请问附近有没有插座',
        en: 'Excuse me — is there a power socket nearby?',
        purpose: 'ask',
        noteZh: '香港叫「插蘇」，唔叫「插座」。講「插座」對方多數都明，但會即刻聽得出你唔係本地。',
        noteEn: 'Hong Kong says 插蘇, not 插座. People will still understand 插座 — they will also immediately hear that you are new.',
      },
      {
        canto: '唔好意思，可唔可以細聲啲？',
        jyut: 'm4 hou2 ji3 si1, ho2 m4 ho2 ji5 sai3 seng1 di1',
        putong: '不好意思，可以小声点吗',
        en: 'Sorry — could you keep it down a bit?',
        purpose: 'request',
      },
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
        noteEn: 'Hong Kong dollars are counted in 蚊, not 塊. 一百蚊 is one hundred dollars.',
      },
      {
        canto: '呢度有冇得上網？',
        jyut: 'ni1 dou6 jau5 mou5 dak1 soeng5 mong5',
        putong: '这里能上网吗',
        en: 'Is there internet here?',
        purpose: 'ask',
      },
      {
        canto: '我部電話冇晒電，可唔可以借個叉電器？',
        jyut: 'ngo5 bou6 din6 waa2 mou5 saai3 din6, ho2 m4 ho2 ji5 ze3 go3 caa1 din6 hei3',
        putong: '我手机没电了，可以借个充电器吗',
        en: 'My phone is dead — could I borrow a charger?',
        purpose: 'request',
        noteZh: '香港叫「叉電」唔叫「充電」，個插頭叫「叉電器」。',
        noteEn: 'Charging is 叉電 here, not 充電, and a charger is a 叉電器.',
      },
      {
        canto: '我收唔到線，聽唔到你講嘢',
        jyut: 'ngo5 sau1 m4 dou2 sin3, teng1 m4 dou2 nei5 gong2 je5',
        putong: '我没信号，听不到你说话',
        en: 'I’ve got no signal — I can’t hear you.',
        purpose: 'repeat',
      },
      {
        canto: '係咪要密碼先上到網？',
        jyut: 'hai6 mai6 jiu3 mat6 maa5 sin1 soeng5 dou2 mong5',
        putong: '是不是要密码才能上网',
        en: 'Do I need a password to get online?',
        purpose: 'confirm',
      },
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
      {
        canto: '我哋幾點喺邊度等？',
        jyut: 'ngo5 dei6 gei2 dim2 hai2 bin1 dou6 dang2',
        putong: '我们几点在哪儿等',
        en: 'What time and where shall we meet?',
        purpose: 'confirm',
      },
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
        noteEn: 'Splitting the cost is completely normal between classmates. Agreeing up front is easier than working it out after.',
      },
      {
        canto: '夠唔夠人打波？',
        jyut: 'gau3 m4 gau3 jan4 daa2 bo1',
        putong: '人够不够打球',
        en: 'Have we got enough people for a game?',
        purpose: 'confirm',
      },
      {
        canto: '點樣訂個場？',
        jyut: 'dim2 joeng2 deng6 go3 coeng4',
        putong: '怎么订场地',
        en: 'How do I book a court?',
        purpose: 'ask',
        noteZh: '康文署嘅場要預先訂，部分要用「智方便」或者親身去辦事處。',
        noteEn: 'LCSD courts must be booked in advance — some need the iAM Smart app or a visit to the office.',
      },
    ],
  },
]

/** 由 id 攞場景。搵唔到回 `undefined`，畀 route 自己決定 404。 */
export const topicById = (id: string): CantoneseTopic | undefined =>
  CANTONESE_TOPICS.find((t) => t.id === id)

/** 十二個場景 id，畀 `generateStaticParams` 用。冇第二張手寫清單。 */
export const SCENE_IDS: string[] = CANTONESE_TOPICS.map((t) => t.id)
