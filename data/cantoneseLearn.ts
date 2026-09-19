// 「點樣學廣東話」—— /cantonese/learn 嘅內容正本。
//
// ══ 點解要有呢一版 ══
// 十六個場景教嘅係【講咩】。但一個識普通話嘅學生睇住 `caap3 sou1` 照讀，
// 讀出嚟係普通話腔 —— 因為佢用緊普通話嘅音系去讀一套唔同嘅音。
// 呢版教嘅係【點讀、點記、點由普通話推過去】。
//
// ══ 對象係識普通話嘅新來港學生，唔係零基礎外國人 ══
// 呢個分別決定咗成版點寫。一個識普通話嘅人有一樣好大嘅優勢：
// 大部分字佢已經識寫、識意思，缺嘅淨係【讀音】。所以最高槓桿嘅唔係詞彙表，
// 係「普通話 X 音 → 廣東話通常係 Y 音」呢啲對應規律 ——
// 一條規律一次過解鎖幾百個字。
//
// ⚠️ 下面啲對應規律係【傾向】，唔係定律。每條都寫咗例外，因為一條講到
//    好似冇例外嘅規律，學生一撞到例外就會覺得成套嘢唔可信。

export interface ToneDrill {
  /** 同一個聲母韻母、淨係變聲調 —— 聽得出分別先至講得出分別 */
  syllable: string
  words: { tone: number; zh: string; jyut: string; meaningZh: string; meaningEn: string }[]
}

export interface SoundRule {
  titleZh: string
  titleEn: string
  /** 普通話嗰邊係咩 */
  fromZh: string
  fromEn: string
  /** 廣東話嗰邊變成咩 */
  toZh: string
  toEn: string
  examples: { zh: string; pu: string; jyut: string }[]
  /** 例外。一條扮到冇例外嘅規律，學生一撞到就會覺得成套嘢唔可信。 */
  exceptionZh: string
  exceptionEn: string
}

export interface Trap {
  titleZh: string
  titleEn: string
  bodyZh: string
  bodyEn: string
}

/**
 * 聲調操練。廣東話六個聲調，普通話四個 —— 多出嚟嘅唔係「難咗」，
 * 係普通話冇嘅【低音區】：第 4、5、6 聲全部喺低音域打轉。
 *
 * 一組同音節不同調嘅字擺埋一齊，係最快聽得出分別嘅方法。
 */
export const TONE_DRILLS: ToneDrill[] = [
  {
    syllable: 'si',
    words: [
      { tone: 1, zh: '詩', jyut: 'si1', meaningZh: '詩歌', meaningEn: 'poem' },
      { tone: 2, zh: '史', jyut: 'si2', meaningZh: '歷史', meaningEn: 'history' },
      { tone: 3, zh: '試', jyut: 'si3', meaningZh: '試（考試、試身）', meaningEn: 'to try / test' },
      { tone: 4, zh: '時', jyut: 'si4', meaningZh: '時間', meaningEn: 'time' },
      { tone: 5, zh: '市', jyut: 'si5', meaningZh: '街市、市場', meaningEn: 'market' },
      { tone: 6, zh: '事', jyut: 'si6', meaningZh: '事情', meaningEn: 'matter' },
    ],
  },
  {
    syllable: 'fan',
    words: [
      { tone: 1, zh: '分', jyut: 'fan1', meaningZh: '分開、分數', meaningEn: 'to divide / marks' },
      { tone: 2, zh: '粉', jyut: 'fan2', meaningZh: '粉（米粉）', meaningEn: 'powder / noodles' },
      { tone: 3, zh: '訓', jyut: 'fan3', meaningZh: '訓練', meaningEn: 'to train' },
      { tone: 4, zh: '焚', jyut: 'fan4', meaningZh: '焚燒', meaningEn: 'to burn' },
      { tone: 5, zh: '奮', jyut: 'fan5', meaningZh: '奮鬥', meaningEn: 'to strive' },
      { tone: 6, zh: '份', jyut: 'fan6', meaningZh: '一份', meaningEn: 'a portion' },
    ],
  },
]

/**
 * 普通話 → 廣東話 嘅對應規律。
 *
 * ⚠️ 第一條（入聲）係最重要嗰條，所以擺第一。普通話完全冇入聲，
 *    而廣東話大量常用字都係入聲 —— 唔知呢件事，就會一路讀長咗個音。
 */
export const SOUND_RULES: SoundRule[] = [
  {
    titleZh: '入聲：普通話冇、廣東話好多',
    titleEn: 'Checked tones: gone from Putonghua, everywhere in Cantonese',
    fromZh: '普通話讀出嚟拖得長嘅字',
    fromEn: 'Syllables you can hold in Putonghua',
    toZh: '廣東話有一批字以 -p、-t、-k 收尾，聲音戛然而止，拖唔長',
    toEn: 'Cantonese has syllables ending in -p, -t, -k that stop dead and cannot be held',
    examples: [
      { zh: '十', pu: 'shí（拖得長）', jyut: 'sap6' },
      { zh: '一', pu: 'yī（拖得長）', jyut: 'jat1' },
      { zh: '食', pu: 'shí（拖得長）', jyut: 'sik6' },
      { zh: '六', pu: 'liù（拖得長）', jyut: 'luk6' },
      { zh: '北', pu: 'běi（拖得長）', jyut: 'bak1' },
    ],
    exceptionZh:
      '呢個唔係例外多唔多嘅問題，係要留意收尾個音【唔出聲】—— sap6 個 p 唔會爆出嚟，' +
      '得個嘴形，好似講到一半停咗。讀成「sa-pu」就變咗日文。',
    exceptionEn:
      'The final consonant is unreleased: the p in sap6 is a closed mouth, not a puff of air. ' +
      'Saying “sa-pu” turns it into Japanese.',
  },
  {
    titleZh: '普通話 ch-／sh-／zh- 捲舌音，廣東話冇',
    titleEn: 'Putonghua retroflex ch-/sh-/zh- do not exist in Cantonese',
    fromZh: 'zh、ch、sh（舌尖捲起）',
    fromEn: 'zh, ch, sh (tongue curled back)',
    toZh: 'z、c、s（舌尖平放，同 j、q、x 嗰組合併）',
    toEn: 'z, c, s (tongue flat)',
    examples: [
      { zh: '知', pu: 'zhī', jyut: 'zi1' },
      { zh: '茶', pu: 'chá', jyut: 'caa4' },
      { zh: '書', pu: 'shū', jyut: 'syu1' },
      { zh: '是', pu: 'shì', jyut: 'si6' },
    ],
    exceptionZh: '廣東話完全冇捲舌音，所以呢條係少數真係冇例外嘅規律 —— 捲住舌頭講廣東話一定唔啱。',
    exceptionEn: 'Cantonese has no retroflex sounds at all, so this one really has no exceptions.',
  },
  {
    titleZh: '普通話 -n 同 -ng 分唔清？廣東話分得好嚴',
    titleEn: 'Cantonese keeps -n and -ng strictly apart',
    fromZh: '好多普通話使用者（尤其南方）講 -n 同 -ng 差唔多',
    fromEn: 'Many Putonghua speakers merge -n and -ng',
    toZh: '廣東話兩個係唔同字，撈亂咗人哋會聽錯',
    toEn: 'In Cantonese they are different words — merging them gets you misheard',
    examples: [
      { zh: '新 vs 星', pu: 'xīn / xīng', jyut: 'san1 / sing1' },
      { zh: '晚 vs 網', pu: 'wǎn / wǎng', jyut: 'maan5 / mong5' },
      { zh: '身 vs 生', pu: 'shēn / shēng', jyut: 'san1 / saang1' },
    ],
    exceptionZh: '收 -m 嘅字（心 sam1、三 saam1、點 dim2）係第三種收尾，普通話已經冇咗，唔好併入 -n。',
    exceptionEn:
      'There is also a third ending, -m (心 sam1, 三 saam1, 點 dim2), which Putonghua lost entirely — do not fold it into -n.',
  },
]

/**
 * 同形異義 —— 最危險嗰類，因為個字你識寫、識普通話意思，
 * 所以唔會覺得自己需要查。
 */
export const TRAPS: Trap[] = [
  {
    titleZh: '「唔該」同「多謝」唔一樣',
    titleEn: '唔該 and 多謝 are not interchangeable',
    bodyZh:
      '人哋幫你做咗一件事 → 唔該（m4 goi1）。人哋送咗嘢畀你 → 多謝（do1 ze6）。' +
      '收咗利是講「唔該」會好怪。「唔該」同時係「唔好意思，借借」嘅意思 —— ' +
      '喺人多嘅地方想行過，就係講呢兩個字。',
    bodyEn:
      'Someone did something for you → 唔該. Someone gave you something → 多謝. ' +
      '唔該 also means “excuse me, coming through” — it is what you say to get past people in a crowd.',
  },
  {
    titleZh: '「得」同「行」係兩個「可以」',
    titleEn: 'Two different ways to say “OK”',
    bodyZh:
      '普通話講「行」，廣東話講「得」（dak1）。問「得唔得？」＝行不行；答「得」＝可以。' +
      '講「行唔行」廣東話人聽得明，但一聽就知你唔係本地。',
    bodyEn:
      'Putonghua uses 行; Cantonese uses 得 (dak1). 得唔得？ = is that OK? 得 = yes. ' +
      'People will understand 行唔行 but immediately hear that you are new.',
  },
  {
    titleZh: '啲語氣助詞唔係可有可無',
    titleEn: 'The little particles are not optional',
    bodyZh:
      '呀（aa3）、啦（laa1）、喎（wo3）、囉（lo1）、嘅（ge3）—— 冇咗佢哋，' +
      '每句都會聽落好硬、好似命令。「幾點走」同「幾點走呀？」差好遠：前者似查問，後者先似傾偈。',
    bodyEn:
      'Without 呀, 啦, 喎, 囉, 嘅, every sentence lands as a command. ' +
      '「幾點走」sounds like an interrogation; 「幾點走呀？」sounds like a conversation.',
  },
  {
    titleZh: '唔使驚講錯 —— 香港人自己都夾雜',
    titleEn: 'Mistakes are fine — locals mix languages too',
    bodyZh:
      '香港人日常會講「send 個 file 畀我」「book 場」「chill 吓」。' +
      '夾雜英文唔係講得差，係本地講法。你講錯咗個音，通常冇人會笑你 —— ' +
      '反而唔開口先至冇人知你想講咩。',
    bodyEn:
      'Locals say things like “send 個 file 畀我” and “book 場”. Mixing English in is normal here, ' +
      'not sloppy. Getting a tone wrong rarely draws comment — staying silent is what leaves you unheard.',
  },
]

/** 每日五分鐘嘅具體做法。唔寫「多聽多講」呢種講咗等於冇講嘅嘢。 */
export const PRACTICE_STEPS: { zh: string; en: string }[] = [
  {
    zh: '揀一個場景，六句讀出聲三次。讀出聲同心裡面讀完全唔同 —— 個音要經過把口先記得穩。',
    en: 'Pick one scene and read its six lines aloud three times. Reading aloud is not the same as reading silently.',
  },
  {
    zh: '每句先讀粵拼、再讀廣東話。分開嚟讀，先至捉到自己邊個音係靠估。',
    en: 'Read the Jyutping first, then the characters. Splitting them shows you which sounds you were guessing.',
  },
  {
    zh: '一日揀一句，當日真係用一次。用過一次嘅句，比讀過十次嘅句記得耐。',
    en: 'Use one line for real each day. A line you have actually said sticks better than one you have read ten times.',
  },
  {
    zh: '聽唔明就即刻講「可唔可以講慢啲？」。呢句本身就係練習 —— 而且用得越多，其餘嘅句越有機會聽得明。',
    en: 'When you lose the thread, say 可唔可以講慢啲？ It is itself practice, and it buys you every other line.',
  },
]
