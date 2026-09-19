// 新來港支援 · 香港日常廣東話 —— 內容正本。
//
// ══ 呢個係一個獨立課程，唔屬中文科 ══
// 2026-09-19 由 Yuna 定案：要嘅唔係校園／考試綁課題，係【香港人平時出街
// 真係會講嘅話】。所以十三個主題【全部冇 topicId】，卡片一個練習掣都冇。
//
// 呢個 0/13 唔係疏忽，係刻意，而且睇得到 —— 中文科十九個課題（指定範文、
// 文言閱讀、修辭、實用寫作…）冇一個載得起「試身室喺邊」或者「幫我增值一百蚊」。
// 夾硬綁一個上去會令數據講大話，所以寧可留空。
//
// ⚠️ **憲章條文未跟上，而且缺口比之前大。**
//    §1.2「戰場只有一個：香港 DSE」同 §2 目標受眾都係圍住 DSE 寫。
//    本檔第一版有八個主題綁得返中文科課題（8/12），現版 **0/13** ——
//    即係話「呢個係 DSE 產品嘅一部分」呢個講法，冇咗任何結構上嘅支撐。
//
//    草案：docs/charter-amendment-2026-09-19-DRAFT.md（⬜ 未簽署）。
//    入面三個選項，(c)「納入但擺出 DSE 產品之外」而家先係最準確嘅描述。
//    由創辦人揀 —— 呢個係判斷題，唔係工程題。
//
//    喺簽咗之前，全部內容仍然要簽名先出得街（見下），所以現階段對學生
//    冇任何影響。
//
// ══ 對象係 12–18 歲，唔係成年人 ══
// 清單刻意剔走咗租屋／水電／管理處、銀行／郵局、鄰居 —— 中六生唔會租屋、
// 唔會同管理處交涉水電，嗰啲係家長嘅差事。留低咗嘅十三個，全部係一個
// 新來港中學生一個月內真係會撞到嘅場景。
//
// ⚠️ 十三個，唔係十二個。原指示係「留九個 + 換四個」，而 9 + 4 = 13。
//    冇為咗湊個靚數剷走任何一個。
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
//
//    寫嗰陣自己都揀唔定嘅，逐個列咗喺 `UNSURE`。由嗰度開始對最有效率，
//    但【唔代表其餘嗰啲一定啱】—— 信心高唔等於啱。

/** 真人覆核簽署。`reviewer` 留白 = 內容唔出街。唔准由機器填。 */
export const REVIEW: { reviewer: string; reviewedAt: string } = {
  reviewer: '',
  reviewedAt: '',
}

/**
 * 寫嘅時候自己揀唔定嘅粵拼，覆核時優先對呢批。
 * 格式：`廣東話 → 寫咗乜（另一個可能）`
 */
export const UNSURE: string[] = [
  '幾多錢 → cin2（定 cin4？）',
  '打擾 → jiu2（定 jiu5？）',
  '有冇袋 → doi2（定 doi6？）',
  '插蘇 → caap3 sou1（sou1 定 sou2？）',
  '訂場 → deng6（定 ding6？兩個讀法都有人用）',
  '稱呼 → cing1 fu1（定 cing3 fu1？）',
  '加底 → dai2（定 dai6？）',
]

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
   * 對應 data/questions 嘅真中文科課題。
   *
   * ⚠️ 現版【十三個全部留空】—— 呢個係獨立課程，唔屬中文科（見檔頭）。
   *    欄位保留住，係因為日後若果決定加返校園主題，佢哋係綁得返嘅。
   *    冇 topicId 就唔出練習掣。
   */
  topicId?: string
  whyZh: string
  whyEn: string
  phrases: Phrase[]
}

export const CAMPUS_TOPICS: CampusTopic[] = [
  {
    id: 'greetings',
    zh: '打招呼・寒暄',
    en: 'Greetings and small talk',
    whyZh: '香港人開口第一句好少係「你好」。唔識接呢幾句，成個對話由頭就生硬。',
    whyEn: 'People here rarely open with 你好. Without these the whole exchange is stiff from the first line.',
    phrases: [
      { canto: '早晨', jyut: 'zou2 san4', putong: '早上好', en: 'good morning' },
      { canto: '食咗飯未', jyut: 'sik6 zo2 faan6 mei6', putong: '吃了没有', en: 'have you eaten? (a greeting, not an invitation)' },
      { canto: '點稱呼你', jyut: 'dim2 cing1 fu1 nei5', putong: '怎么称呼', en: 'what should I call you' },
      { canto: '好耐冇見', jyut: 'hou2 noi6 mou5 gin3', putong: '好久不见', en: 'long time no see' },
      { canto: '有心', jyut: 'jau5 sam1', putong: '有心了', en: 'thanks for asking after me' },
      { canto: '得閒飲茶', jyut: 'dak1 haan4 jam2 caa4', putong: '有空喝茶', en: 'let’s catch up sometime' },
    ],
  },
  {
    id: 'shopping',
    zh: '買嘢・講價',
    en: 'Shopping and haggling',
    whyZh: '細舖講得價，連鎖店唔講。開錯口唔會有人話你，但個場面會好尷尬。',
    whyEn: 'Small shops haggle; chains do not. Nobody corrects you, but it lands awkwardly.',
    phrases: [
      { canto: '幾多錢', jyut: 'gei2 do1 cin2', putong: '多少钱', en: 'how much is it' },
      { canto: '我睇睇先', jyut: 'ngo5 tai2 tai2 sin1', putong: '我先看看', en: 'I’m just looking' },
      { canto: '平啲得唔得', jyut: 'peng4 di1 dak1 m4 dak1', putong: '能便宜点吗', en: 'could you do it cheaper' },
      { canto: '有冇平啲嘅', jyut: 'jau5 mou5 peng4 di1 ge3', putong: '有没有便宜点的', en: 'is there a cheaper one' },
      { canto: '唔使找', jyut: 'm4 sai2 zaau2', putong: '不用找了', en: 'keep the change' },
      { canto: '有冇袋', jyut: 'jau5 mou5 doi2', putong: '有没有袋子', en: 'do you have a bag' },
    ],
  },
  {
    id: 'clothes',
    zh: '買衫・試身',
    en: 'Buying clothes',
    whyZh: '碼數同試身嘅講法同內地唔同，講錯就成單嘢卡住。',
    whyEn: 'Sizes and fitting rooms are asked about differently here — get it wrong and the whole thing stalls.',
    phrases: [
      { canto: '試唔試得', jyut: 'si3 m4 si3 dak1', putong: '可以试吗', en: 'can I try it on' },
      { canto: '試身室喺邊', jyut: 'si3 san1 sat1 hai2 bin1', putong: '试衣间在哪', en: 'where is the fitting room' },
      { canto: '有冇大一個碼', jyut: 'jau5 mou5 daai6 jat1 go3 maa5', putong: '有没有大一号', en: 'do you have one size up' },
      { canto: '啱唔啱身', jyut: 'ngaam1 m4 ngaam1 san1', putong: '合不合身', en: 'does it fit' },
      { canto: '有冇第二隻色', jyut: 'jau5 mou5 dai6 ji6 zek3 sik1', putong: '有没有别的颜色', en: 'any other colour' },
      { canto: '換得唔換得', jyut: 'wun6 dak1 m4 wun6 dak1', putong: '能不能换', en: 'can it be exchanged' },
    ],
  },
  {
    id: 'eating',
    zh: '食飯・叫嘢・打包',
    en: 'Ordering and takeaway',
    whyZh: '茶餐廳落單係一套自己嘅簡稱，餐牌上面都唔會解釋。',
    whyEn: 'Cha chaan teng ordering runs on shorthand the menu never explains.',
    phrases: [
      { canto: '落單', jyut: 'lok6 daan1', putong: '点菜', en: 'to order' },
      { canto: '走蔥', jyut: 'zau2 cung1', putong: '不要葱', en: 'hold the spring onion' },
      { canto: '少辣', jyut: 'siu2 laat6', putong: '少辣', en: 'less chilli' },
      { canto: '加底', jyut: 'gaa1 dai2', putong: '加饭', en: 'extra rice or noodles' },
      { canto: '打包', jyut: 'daa2 baau1', putong: '打包', en: 'to take away' },
      { canto: '埋單', jyut: 'maai4 daan1', putong: '买单', en: 'the bill, please' },
    ],
  },
  {
    id: 'transport',
    zh: '搭車・問路',
    en: 'Getting around and asking directions',
    whyZh: '「有落」係小巴專用，唔嗌就過咗站。呢啲嘢冇人會特登教。',
    whyEn: '「有落」is minibus-only — not calling it means missing your stop. Nobody teaches this on purpose.',
    phrases: [
      { canto: '點樣去', jyut: 'dim2 joeng2 heoi3', putong: '怎么去', en: 'how do I get to' },
      { canto: '搭幾多號車', jyut: 'daap3 gei2 do1 hou6 ce1', putong: '坐几号车', en: 'which bus do I take' },
      { canto: '八達通', jyut: 'baat3 daat6 tung1', putong: '八达通', en: 'Octopus card' },
      { canto: '有落', jyut: 'jau5 lok6', putong: '到站下车', en: 'stopping here (shout this on a minibus)' },
      { canto: '轉車', jyut: 'zyun3 ce1', putong: '换乘', en: 'to change lines' },
      { canto: '仲有幾多個站', jyut: 'zung6 jau5 gei2 do1 go3 zaam6', putong: '还有几个站', en: 'how many stops left' },
    ],
  },
  {
    id: 'doctor',
    zh: '睇醫生・藥房',
    en: 'Doctor and pharmacy',
    whyZh: '身體唔舒服嗰陣最唔想搵字，所以呢幾句要熟到唔使諗。',
    whyEn: 'When you feel ill is the worst time to be hunting for words — these should be automatic.',
    phrases: [
      { canto: '我想睇醫生', jyut: 'ngo5 soeng2 tai2 ji1 sang1', putong: '我想看医生', en: 'I would like to see a doctor' },
      { canto: '邊度唔舒服', jyut: 'bin1 dou6 m4 syu1 fuk6', putong: '哪里不舒服', en: 'where does it hurt (what they will ask you)' },
      { canto: '發燒', jyut: 'faat3 siu1', putong: '发烧', en: 'to have a fever' },
      { canto: '好肚痛', jyut: 'hou2 tou5 tung3', putong: '肚子很痛', en: 'a bad stomach ache' },
      { canto: '有冇成藥', jyut: 'jau5 mou5 sing4 joek6', putong: '有没有成药', en: 'any over-the-counter medicine' },
      { canto: '一日食幾多次', jyut: 'jat1 jat6 sik6 gei2 do1 ci3', putong: '一天吃几次', en: 'how many times a day' },
    ],
  },
  {
    id: 'market',
    zh: '街市・超市',
    en: 'Wet market and supermarket',
    whyZh: '街市用斤唔用公斤，而且要開口講數量，同超市攞完就走完全唔同。',
    whyEn: 'Wet markets work in catties, and you have to say the amount out loud — nothing like picking things off a shelf.',
    phrases: [
      { canto: '一斤幾多錢', jyut: 'jat1 gan1 gei2 do1 cin2', putong: '一斤多少钱', en: 'how much per catty' },
      { canto: '要半斤', jyut: 'jiu3 bun3 gan1', putong: '要半斤', en: 'half a catty, please' },
      { canto: '新唔新鮮', jyut: 'san1 m4 san1 sin1', putong: '新不新鲜', en: 'is it fresh' },
      { canto: '幫我切開佢', jyut: 'bong1 ngo5 cit3 hoi1 keoi5', putong: '帮我切开', en: 'could you cut it up for me' },
      { canto: '有冇折', jyut: 'jau5 mou5 zit3', putong: '有没有折扣', en: 'is there a discount' },
      { canto: '邊度埋單', jyut: 'bin1 dou6 maai4 daan1', putong: '在哪结账', en: 'where do I pay' },
    ],
  },
  {
    id: 'help',
    zh: '電話・求助',
    en: 'On the phone and asking for help',
    whyZh: '講電話冇口型冇表情，係最快露底嘅場合。呢幾句買到時間。',
    whyEn: 'On the phone there is no lip-reading and no face — these buy you time.',
    phrases: [
      { canto: '唔該幫幫手', jyut: 'm4 goi1 bong1 bong1 sau2', putong: '请帮个忙', en: 'could you give me a hand' },
      { canto: '我唔識路', jyut: 'ngo5 m4 sik1 lou6', putong: '我不认识路', en: 'I do not know the way' },
      { canto: '可唔可以講慢啲', jyut: 'ho2 m4 ho2 ji5 gong2 maan6 di1', putong: '可以说慢点吗', en: 'could you speak more slowly' },
      { canto: '聽唔到', jyut: 'teng1 m4 dou2', putong: '听不到', en: 'I cannot hear you' },
      { canto: '等陣打畀你', jyut: 'dang2 zan6 daa2 bei2 nei5', putong: '待会打给你', en: 'I will call you back' },
      { canto: '唔好意思打擾晒', jyut: 'm4 hou2 ji3 si1 daa2 jiu2 saai3', putong: '不好意思打扰了', en: 'sorry to have troubled you' },
    ],
  },
  {
    id: 'fillers',
    zh: '口頭禪',
    en: 'Everyday fillers',
    whyZh: '呢幾個字本身冇乜意思，但唔用就會聽落好似硬讀緊課本。',
    whyEn: 'These carry almost no meaning — but without them you sound like you are reading from a textbook.',
    phrases: [
      { canto: '係咪', jyut: 'hai6 mai6', putong: '是不是', en: 'is that so / right?' },
      { canto: '點呀', jyut: 'dim2 aa3', putong: '怎么样', en: 'how’s it going' },
      { canto: '冇所謂', jyut: 'mou5 so2 wai6', putong: '无所谓', en: 'it doesn’t matter' },
      { canto: '搞掂', jyut: 'gaau2 dim6', putong: '搞定', en: 'done / sorted' },
      { canto: '真係㗎', jyut: 'zan1 hai6 gaa3', putong: '真的吗', en: 'really?' },
      { canto: '唔緊要', jyut: 'm4 gan2 jiu3', putong: '没关系', en: 'it’s alright' },
    ],
  },
  {
    id: 'study-spaces',
    zh: '補習社・圖書館',
    en: 'Tutorial centre and library',
    whyZh: '自修室同圖書館係新來港學生最常去、又最少人教點開口嘅地方。',
    whyEn: 'Study rooms and libraries are where newly arrived students spend most time, and where nobody teaches the words.',
    phrases: [
      { canto: '呢度有冇位坐', jyut: 'ni1 dou6 jau5 mou5 wai2 co5', putong: '这里有座位吗', en: 'is there a seat here' },
      { canto: '幾點閂門', jyut: 'gei2 dim2 saan1 mun4', putong: '几点关门', en: 'what time do you close' },
      { canto: '可唔可以借書', jyut: 'ho2 m4 ho2 ji5 ze3 syu1', putong: '可以借书吗', en: 'can I borrow books' },
      { canto: '幾時還書', jyut: 'gei2 si4 waan4 syu1', putong: '什么时候还书', en: 'when is it due back' },
      { canto: '有冇插蘇', jyut: 'jau5 mou5 caap3 sou1', putong: '有没有插座', en: 'is there a power socket' },
      { canto: '靜啲得唔得', jyut: 'zing6 di1 dak1 m4 dak1', putong: '安静点行吗', en: 'could you keep it down' },
    ],
  },
  {
    id: 'phone-data',
    zh: '手機・上網・儲值',
    en: 'Phone, data and topping up',
    whyZh: '增值、數據、叉電 —— 呢幾個字用錯，鋪頭聽唔明你想做乜。',
    whyEn: 'Top-ups, data and charging — the wrong word and the shop has no idea what you want.',
    phrases: [
      { canto: '幫我增值一百蚊', jyut: 'bong1 ngo5 zang1 zik6 jat1 baak3 man1', putong: '帮我充值一百块', en: 'top it up by a hundred, please' },
      { canto: '有冇得上網', jyut: 'jau5 mou5 dak1 soeng5 mong5', putong: '有没有网络', en: 'is there internet here' },
      { canto: '冇晒數據', jyut: 'mou5 saai3 sou3 geoi3', putong: '流量用完了', en: 'I’m out of data' },
      { canto: '我部電話冇電', jyut: 'ngo5 bou6 din6 waa2 mou5 din6', putong: '我手机没电', en: 'my phone is dead' },
      { canto: '借個叉電器', jyut: 'ze3 go3 caa1 din6 hei3', putong: '借个充电器', en: 'lend me a charger' },
      { canto: '收唔到線', jyut: 'sau1 m4 dou2 sin3', putong: '没信号', en: 'there’s no signal' },
    ],
  },
  {
    id: 'going-out',
    zh: '同同學去街',
    en: 'Going out with classmates',
    whyZh: '約唔約到、邊個畀錢 —— 呢幾句講錯，容易變成下次冇人再叫你。',
    whyEn: 'Making plans and settling who pays — get these wrong and the next invitation quietly stops coming.',
    phrases: [
      { canto: '去邊度好', jyut: 'heoi3 bin1 dou6 hou2', putong: '去哪里好', en: 'where should we go' },
      { canto: '夾唔夾到時間', jyut: 'gaap3 m4 gaap3 dou2 si4 gaan3', putong: '时间对得上吗', en: 'can we make the times work' },
      { canto: '食唔食嘢先', jyut: 'sik6 m4 sik6 je5 sin1', putong: '先吃点东西吗', en: 'shall we eat first' },
      { canto: '睇戲', jyut: 'tai2 hei3', putong: '看电影', en: 'to see a film' },
      { canto: '我請你', jyut: 'ngo5 ceng2 nei5', putong: '我请你', en: 'my treat' },
      { canto: '幾點走', jyut: 'gei2 dim2 zau2', putong: '几点走', en: 'what time are we heading off' },
    ],
  },
  {
    id: 'sports',
    zh: '運動・球場',
    en: 'Sport and courts',
    whyZh: '打波係最快識到朋友嘅路，而入面嘅講法全部係口語，書上面搵唔到。',
    whyEn: 'Ball games are the fastest way to make friends here, and every word for it is spoken-only.',
    phrases: [
      { canto: '打波', jyut: 'daa2 bo1', putong: '打球', en: 'to play ball' },
      { canto: '夾唔夾夠人', jyut: 'gaap3 m4 gaap3 gau3 jan4', putong: '人够不够', en: 'have we got enough people' },
      { canto: '差一個人', jyut: 'caa1 jat1 go3 jan4', putong: '差一个人', en: 'we’re one short' },
      { canto: '點樣訂場', jyut: 'dim2 joeng2 deng6 coeng4', putong: '怎么订场地', en: 'how do I book a court' },
      { canto: '落場', jyut: 'lok6 coeng4', putong: '上场', en: 'to get on court' },
      { canto: '邊個贏', jyut: 'bin1 go3 jeng4', putong: '谁赢了', en: 'who won' },
    ],
  },
]
