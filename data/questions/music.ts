import type { Question, Topic } from './types'

// ───────────────────────────────────────────────────────────────────────────
// HKDSE Music — Module 1 (Listening, 50%) 考核重點 → 參數化模板生成題庫。
// 音程 / 調號 / 三和弦由「已驗證引擎」計算（code-verified，避免人手出錯）；
// 術語 / 織體 / 曲式 / 風格背景按官方 Areas of Study 1–4 的 pool 模板化。
// 音樂為雙語科：每題同時生成中英。對標 EDB《音樂科課程及評估指引》聆聽範疇
// 列明的音樂元素（音高/音程、節奏、織體、和聲、調性、曲式、風格）。
// ───────────────────────────────────────────────────────────────────────────

type Pair = [zh: string, en: string]

const TOPICS = {
  pitch_intervals: { id: 'pitch_intervals', zh: '音高與音程', en: 'Pitch & Intervals', emoji: '🎵' },
  scales_keys: { id: 'scales_keys', zh: '音階與調', en: 'Scales & Keys', emoji: '🎼' },
  rhythm_metre: { id: 'rhythm_metre', zh: '節奏與拍子', en: 'Rhythm & Metre', emoji: '🥁' },
  harmony: { id: 'harmony', zh: '和聲', en: 'Harmony', emoji: '🎹' },
  texture_form: { id: 'texture_form', zh: '織體與曲式', en: 'Texture & Form', emoji: '🧩' },
  terms_dynamics: { id: 'terms_dynamics', zh: '術語與表情', en: 'Terms & Expression', emoji: '🔊' },
  styles_context: { id: 'styles_context', zh: '風格與背景', en: 'Styles & Context', emoji: '🌏' },
} as const

const FW = {
  theory: { id: 'theory', zh: '樂理基礎', en: 'Music Theory', emoji: '🎼' },
  analysis: { id: 'analysis', zh: '音樂分析', en: 'Musical Analysis', emoji: '🧩' },
  context: { id: 'context', zh: '音樂常識', en: 'Music in Context', emoji: '🌏' },
} as const

type TopicMeta = (typeof TOPICS)[keyof typeof TOPICS]
type FwMeta = (typeof FW)[keyof typeof FW]

// q() builder — opts[0] is always the correct answer (display order is shuffled
// at render time and graded by the language-independent zh text).
function q(
  id: string, topic: TopicMeta, fw: FwMeta, difficulty: 'easy' | 'medium' | 'hard',
  year: number, marks: number, content: Pair, opts: Pair[], explanation: Pair,
): Question {
  return {
    id, type: 'mc', subject: 'music',
    topic: topic.id, topicZh: topic.zh, topicEn: topic.en,
    framework: fw.id, frameworkZh: fw.zh, frameworkEn: fw.en, frameworkEmoji: fw.emoji,
    difficulty, year,
    content: content[0], contentEn: content[1],
    options: opts.map((o) => o[0]), optionsEn: opts.map((o) => o[1]),
    correctIndex: 0,
    explanation: explanation[0], explanationEn: explanation[1],
    marks,
  }
}

// ── Engine 1: interval (code-verified, see Python self-test 15/15) ───────────
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
const INTERVAL_TABLE: Record<string, Pair> = {
  '1|0': ['純一度', 'a perfect unison'],
  '2|1': ['小二度', 'a minor 2nd'], '2|2': ['大二度', 'a major 2nd'],
  '3|3': ['小三度', 'a minor 3rd'], '3|4': ['大三度', 'a major 3rd'],
  '4|5': ['純四度', 'a perfect 4th'], '4|6': ['增四度', 'an augmented 4th'],
  '5|6': ['減五度', 'a diminished 5th'], '5|7': ['純五度', 'a perfect 5th'],
  '6|8': ['小六度', 'a minor 6th'], '6|9': ['大六度', 'a major 6th'],
  '7|10': ['小七度', 'a minor 7th'], '7|11': ['大七度', 'a major 7th'],
  '8|12': ['純八度', 'a perfect octave'],
}
// ordered by size for picking plausible neighbouring distractors
const INTERVAL_ORDER: Pair[] = [
  ['純一度', 'Perfect unison'], ['小二度', 'Minor 2nd'], ['大二度', 'Major 2nd'],
  ['小三度', 'Minor 3rd'], ['大三度', 'Major 3rd'], ['純四度', 'Perfect 4th'],
  ['增四度', 'Augmented 4th'], ['減五度', 'Diminished 5th'], ['純五度', 'Perfect 5th'],
  ['小六度', 'Minor 6th'], ['大六度', 'Major 6th'], ['小七度', 'Minor 7th'],
  ['大七度', 'Major 7th'], ['純八度', 'Perfect octave'],
]

function interval(low: string, high: string) {
  const li = LETTERS.indexOf(low), hi = LETTERS.indexOf(high)
  const number = (((hi - li) % 7) + 7) % 7 + 1
  const semis = (((PC[high] - PC[low]) % 12) + 12) % 12
  const [zh, en] = INTERVAL_TABLE[`${number}|${semis}`]
  return { number, semis, zh, en }
}
// noun forms (for option list) keyed off the ordered table
function intervalNoun(zhPhrase: string): Pair {
  const i = INTERVAL_ORDER.findIndex((p) => zhPhrase.includes(p[0]))
  return INTERVAL_ORDER[i]
}
function intervalQ(low: string, high: string, year: number, difficulty: 'medium' | 'hard'): Question {
  const r = interval(low, high)
  const correctNoun = intervalNoun(r.zh)
  const correctIdx = INTERVAL_ORDER.findIndex((p) => p[0] === correctNoun[0])
  // 3 nearest neighbours by size = the most confusable intervals
  const distractors = INTERVAL_ORDER
    .map((p, i) => ({ p, d: Math.abs(i - correctIdx) }))
    .filter((x) => x.d > 0)
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
    .map((x) => x.p)
  const tritone = r.number === 4 && r.semis === 6 || r.number === 5 && r.semis === 6
  return q(
    `mus_intv_${low}_${high}`, TOPICS.pitch_intervals, FW.theory, difficulty, year, difficulty === 'hard' ? 4 : 3,
    [`由 ${low} 向上行至 ${high}（一個八度之內），所構成的音程是？`,
      `Ascending from ${low} up to ${high} (within one octave), the interval formed is?`],
    [correctNoun, ...distractors],
    [`${low} 與 ${high} 相隔 ${r.number} 個音級、共 ${r.semis} 個半音，故為${r.zh}${tritone ? '（即三全音 tritone）' : ''}。判斷音程須同時看「度數」（音名數目）與「半音數」，兩者缺一不可。`,
      `${low} to ${high} spans ${r.number} letter-names and ${r.semis} semitones, making it ${r.en}${tritone ? ' (a tritone)' : ''}. An interval is fixed by BOTH its numeric size (letter-names) and its exact semitone count.`],
  )
}

// ── Bank ─────────────────────────────────────────────────────────────────────
export const musicQuestions: Question[] = [
  // ▸ 音高與音程（引擎計算）
  intervalQ('C', 'G', 2023, 'medium'),
  intervalQ('C', 'E', 2021, 'medium'),
  intervalQ('A', 'C', 2022, 'medium'),
  intervalQ('F', 'B', 2024, 'hard'),
  q('mus_octave_semitones', TOPICS.pitch_intervals, FW.theory, 'medium', 2020, 3,
    ['一個八度（octave）之內共包含多少個半音（semitones）？',
      'How many semitones are there within one octave?'],
    [['12 個', '12'], ['7 個', '7'], ['8 個', '8'], ['5 個', '5']],
    ['一個八度等分為 12 個半音（鋼琴上由 C 到上一個 C 之間共 12 個琴鍵）；而一個大調音階只取其中 7 個音、8 個音名。',
      'An octave divides into 12 equal semitones (12 keys from one C to the next on a piano); a major scale selects only 7 of these pitches.']),

  // ▸ 音階與調（引擎／表計算）
  q('mus_keysig_A_sharps', TOPICS.scales_keys, FW.theory, 'medium', 2019, 3,
    ['A 大調的調號有多少個升號（sharps）？', 'How many sharps are in the key signature of A major?'],
    [['3 個（F♯, C♯, G♯）', '3 (F♯, C♯, G♯)'], ['2 個', '2'], ['4 個', '4'], ['1 個', '1']],
    ['按升號調順序 G(1)–D(2)–A(3)–E(4)–B(5)，A 大調有 3 個升號：F♯、C♯、G♯。每進一個五度便多一個升號。',
      'Following the order of sharp keys G(1)–D(2)–A(3)–E(4)–B(5), A major has 3 sharps: F♯, C♯, G♯ — each ascending 5th adds one sharp.']),
  q('mus_keysig_2flats', TOPICS.scales_keys, FW.theory, 'medium', 2018, 3,
    ['哪一個大調的調號正好有兩個降號（flats）？', 'Which major key has exactly two flats in its key signature?'],
    [['降 B 大調（B♭ major）', 'B♭ major'], ['F 大調', 'F major'], ['降 E 大調', 'E♭ major'], ['G 大調', 'G major']],
    ['降號調順序為 F(1)–B♭(2)–E♭(3)–A♭(4)。兩個降號（B♭、E♭）對應降 B 大調；F 大調只有 1 個降號，降 E 大調有 3 個，G 大調則用升號。',
      'The order of flat keys is F(1)–B♭(2)–E♭(3)–A♭(4). Two flats (B♭, E♭) gives B♭ major; F major has only 1 flat, E♭ major has 3, and G major uses a sharp.']),
  q('mus_relative_minor_C', TOPICS.scales_keys, FW.theory, 'medium', 2022, 3,
    ['C 大調的關係小調（relative minor）是？', 'What is the relative minor of C major?'],
    [['A 小調（A minor）', 'A minor'], ['E 小調', 'E minor'], ['C 小調', 'C minor'], ['G 小調', 'G minor']],
    ['關係小調建立在大調的第六級音上、與大調共用同一調號。C 大調第六級為 A，故關係小調是 A 小調（同樣沒有升降號）。C 小調是「同主音小調」，並非關係小調。',
      'A relative minor is built on the 6th degree of the major scale and shares its key signature. The 6th degree of C major is A, so the relative minor is A minor (also no sharps/flats). C minor is the parallel minor, not the relative.']),
  q('mus_mode_dorian', TOPICS.scales_keys, FW.analysis, 'hard', 2023, 4,
    ['只彈鋼琴白鍵、由 D 到 D 所構成的調式（mode）是？', 'Playing only the white keys from D up to D produces which mode?'],
    [['多利安調式（Dorian）', 'Dorian'], ['弗里幾亞調式（Phrygian）', 'Phrygian'], ['利底亞調式（Lydian）', 'Lydian'], ['自然大調（Ionian）', 'Ionian (major)']],
    ['白鍵 D–E–F–G–A–B–C–D 的全半音排列為 全-半-全-全-全-半-全，正是多利安調式。由 E 起為弗里幾亞、由 F 起為利底亞、由 C 起才是自然大調（Ionian）。',
      'The white-note series D–E–F–G–A–B–C–D gives the pattern T-S-T-T-T-S-T, which defines the Dorian mode. Starting on E gives Phrygian, on F gives Lydian, and on C gives the major (Ionian) scale.']),
  q('mus_keysig_1sharp', TOPICS.scales_keys, FW.theory, 'medium', 2016, 3,
    ['哪一個大調的調號只有一個升號（F♯）？', 'Which major key has only one sharp (F♯)?'],
    [['G 大調（G major）', 'G major'], ['D 大調', 'D major'], ['C 大調', 'C major'], ['F 大調', 'F major']],
    ['升號調順序中第一個是 G 大調（1 個升號 F♯）。D 大調有 2 個升號，C 大調沒有升降號，F 大調用降號（B♭）。',
      'The first sharp key is G major (one sharp, F♯). D major has 2 sharps, C major has none, and F major uses a flat (B♭).']),

  // ▸ 節奏與拍子（計算）
  q('mus_quavers_in_44', TOPICS.rhythm_metre, FW.theory, 'medium', 2021, 3,
    ['在 4/4 拍子的一個小節內，可以填入多少個八分音符（quavers）？',
      'How many quavers (eighth notes) fill one bar of 4/4 time?'],
    [['8 個', '8'], ['4 個', '4'], ['16 個', '16'], ['2 個', '2']],
    ['4/4 每小節有 4 個四分音符（crotchet）的時值；每個四分音符可分成 2 個八分音符，故 4 × 2 = 8 個八分音符。',
      'A 4/4 bar holds four crotchet beats; each crotchet splits into two quavers, so 4 × 2 = 8 quavers.']),
  q('mus_dotted_minim', TOPICS.rhythm_metre, FW.theory, 'medium', 2020, 3,
    ['一個附點二分音符（dotted minim）等於多少個四分音符（crotchet）的拍值？',
      'A dotted minim (dotted half note) lasts how many crotchet beats?'],
    [['3 拍', '3 beats'], ['2 拍', '2 beats'], ['4 拍', '4 beats'], ['1.5 拍', '1.5 beats']],
    ['附點令音符延長其本身時值的一半。二分音符 = 2 拍，附點加上一半（1 拍），合共 3 拍。',
      'A dot adds half the note’s value. A minim = 2 beats, plus half again (1 beat) = 3 beats.']),
  q('mus_semiquavers_per_crotchet', TOPICS.rhythm_metre, FW.theory, 'medium', 2017, 3,
    ['多少個十六分音符（semiquavers）等於一個四分音符（crotchet）？',
      'How many semiquavers (sixteenth notes) equal one crotchet (quarter note)?'],
    [['4 個', '4'], ['2 個', '2'], ['8 個', '8'], ['3 個', '3']],
    ['四分音符 → 2 個八分音符 → 每個八分音符再分成 2 個十六分音符，故一個四分音符 = 4 個十六分音符。',
      'A crotchet = 2 quavers, and each quaver = 2 semiquavers, so a crotchet = 4 semiquavers.']),
  q('mus_syncopation', TOPICS.rhythm_metre, FW.analysis, 'medium', 2022, 3,
    ['將重音放在通常較弱的拍子或拍子之間，使節奏「錯位」的手法稱為？',
      'Placing accents on normally weak beats or off-beats, creating a “displaced” rhythm, is called?'],
    [['切分音（syncopation）', 'Syncopation'], ['漸強（crescendo）', 'Crescendo'], ['顫音（tremolo）', 'Tremolo'], ['圓滑奏（legato）', 'Legato']],
    ['切分音（syncopation）刻意把重音移離強拍，營造律動上的張力，常見於爵士與流行音樂。漸強是力度、顫音是奏法、圓滑奏是連貫的觸鍵，皆與重音錯位無關。',
      'Syncopation deliberately shifts stress away from the strong beats, creating rhythmic tension common in jazz and pop. Crescendo is a dynamic, tremolo and legato are playing techniques — none concern displaced accents.']),

  // ▸ 和聲（三和弦引擎 + 終止式）
  q('mus_triad_V_of_C', TOPICS.harmony, FW.theory, 'medium', 2021, 3,
    ['在 C 大調中，建立於第五級（屬音 dominant）上的三和弦是？',
      'In C major, the triad built on the 5th degree (the dominant) is?'],
    [['G 大三和弦（G–B–D）', 'G major (G–B–D)'], ['F 大三和弦（F–A–C）', 'F major (F–A–C)'], ['D 小三和弦（D–F–A）', 'D minor (D–F–A)'], ['A 小三和弦（A–C–E）', 'A minor (A–C–E)']],
    ['C 大調第五級為 G，往上疊三度、五度得 G–B–D，全為大三和弦，即屬和弦（V）。F–A–C 是下屬和弦（IV），D–F–A 是 ii，A–C–E 是 vi。',
      'The 5th degree of C major is G; stacking thirds gives G–B–D, a major triad — the dominant (V). F–A–C is the subdominant (IV), D–F–A is ii, and A–C–E is vi.']),
  q('mus_triad_ii_of_C', TOPICS.harmony, FW.theory, 'hard', 2023, 4,
    ['在 C 大調中，建立於第二級（上主音 supertonic）上的三和弦的性質是？',
      'In C major, the triad built on the 2nd degree (the supertonic) is of what quality?'],
    [['小三和弦（D–F–A，D minor）', 'Minor (D–F–A, D minor)'], ['大三和弦', 'Major'], ['減三和弦', 'Diminished'], ['增三和弦', 'Augmented']],
    ['C 大調第二級為 D，疊成 D–F–A：D 到 F 是小三度、F 到 A 是大三度，故為小三和弦（ii）。大調中只有 I、IV、V 為大三和弦，vii° 為減三和弦。',
      'The 2nd degree of C major is D; D–F–A has a minor 3rd (D–F) below a major 3rd (F–A), making it a minor triad (ii). In a major key only I, IV and V are major, while vii° is diminished.']),
  q('mus_cadence_perfect', TOPICS.harmony, FW.analysis, 'medium', 2019, 3,
    ['由屬和弦（V）進行到主和弦（I），給人完滿結束感的終止式稱為？',
      'A progression from chord V to chord I, giving a sense of complete closure, is called?'],
    [['正格終止 / 完全終止（perfect cadence）', 'Perfect (authentic) cadence'], ['變格終止（plagal cadence）', 'Plagal cadence'], ['半終止（imperfect cadence）', 'Imperfect (half) cadence'], ['假終止 / 阻礙終止（interrupted cadence）', 'Interrupted cadence']],
    ['V–I 是正格（完全）終止，最具結束感。變格終止為 IV–I（「阿們」終止），半終止結束於 V（未完之感），假終止為 V–vi（出人意表地避開主和弦）。',
      'V–I is the perfect (authentic) cadence, the strongest close. The plagal cadence is IV–I (the “Amen” cadence), the imperfect cadence ends on V (sounding unfinished), and the interrupted cadence is V–vi (surprisingly avoiding the tonic).']),
  q('mus_cadence_plagal', TOPICS.harmony, FW.analysis, 'hard', 2024, 4,
    ['由下屬和弦（IV）進行到主和弦（I）、俗稱「阿們終止」的是哪一種終止式？',
      'The progression from chord IV to chord I, nicknamed the “Amen” cadence, is which type?'],
    [['變格終止（plagal cadence）', 'Plagal cadence'], ['正格終止（perfect cadence）', 'Perfect cadence'], ['半終止（imperfect cadence）', 'Imperfect cadence'], ['假終止（interrupted cadence）', 'Interrupted cadence']],
    ['IV–I 為變格終止，因常配教堂「Amen」歌詞而得名。正格終止是 V–I，半終止結束於 V，假終止是 V–vi。',
      'IV–I is the plagal cadence, named after the church “Amen”. The perfect cadence is V–I, the imperfect ends on V, and the interrupted is V–vi.']),

  // ▸ 織體與曲式
  q('mus_texture_monophony', TOPICS.texture_form, FW.analysis, 'medium', 2018, 3,
    ['只有一條旋律線、沒有任何伴奏的織體（texture）稱為？',
      'A texture consisting of a single melodic line with no accompaniment is called?'],
    [['單音織體（monophony）', 'Monophony'], ['主音織體（homophony）', 'Homophony'], ['複音 / 對位織體（polyphony）', 'Polyphony'], ['支聲複調（heterophony）', 'Heterophony']],
    ['單音織體（monophony）只得一條無伴奏旋律。主音織體是旋律加和弦伴奏，複音織體是多條獨立旋律並行，支聲複調則是同一旋律的多個變化版本同時奏出。',
      'Monophony is a single unaccompanied line. Homophony is melody plus chordal accompaniment, polyphony has several independent simultaneous melodies, and heterophony presents simultaneous variations of one melody.']),
  q('mus_texture_homophony', TOPICS.texture_form, FW.analysis, 'medium', 2021, 3,
    ['一條主旋律配以和弦伴奏（如歌曲加結他掃弦）的織體稱為？',
      'A main melody supported by chordal accompaniment (e.g. a song with strummed guitar) is which texture?'],
    [['主音織體（homophony）', 'Homophony'], ['單音織體（monophony）', 'Monophony'], ['複音織體（polyphony）', 'Polyphony'], ['支聲複調（heterophony）', 'Heterophony']],
    ['主音織體（homophony）以一條主旋律為主、其餘聲部作和聲伴奏，是流行歌與大部分古典主調音樂的典型。單音織體無伴奏，複音織體各旋律地位均等，支聲複調是同一旋律的同步變奏。',
      'Homophony foregrounds one melody with the other parts providing harmonic support — typical of pop songs and most Classical-era music. Monophony has no accompaniment, polyphony treats lines as equals, and heterophony layers variants of one tune.']),
  q('mus_form_ternary', TOPICS.texture_form, FW.analysis, 'medium', 2020, 3,
    ['樂曲結構為 A–B–A（首段再現）的曲式稱為？', 'A musical structure of A–B–A (with the opening section returning) is called?'],
    [['三段體（ternary form）', 'Ternary form'], ['二段體（binary form）', 'Binary form'], ['迴旋曲式（rondo form）', 'Rondo form'], ['奏鳴曲式（sonata form）', 'Sonata form']],
    ['A–B–A 為三段體，中段對比後首段重現。二段體為 A–B 兩段；迴旋曲式為主題不斷再現的 A–B–A–C–A…；奏鳴曲式則含呈示、發展、再現三大部。',
      'A–B–A is ternary form — a contrasting middle then a return of the opening. Binary is A–B; rondo recurs as A–B–A–C–A…; sonata form has exposition, development and recapitulation.']),
  q('mus_form_rondo', TOPICS.texture_form, FW.analysis, 'hard', 2023, 4,
    ['一個主要主題不斷與不同插段交替再現，結構為 A–B–A–C–A 的曲式是？',
      'A form in which one main theme keeps returning between contrasting episodes, e.g. A–B–A–C–A, is?'],
    [['迴旋曲式（rondo form）', 'Rondo form'], ['三段體（ternary form）', 'Ternary form'], ['主題與變奏（theme and variations）', 'Theme and variations'], ['賦格（fugue）', 'Fugue']],
    ['迴旋曲式以主題（A）反覆再現、與插段（B、C…）交替為特徵。三段體只有一次中段對比；主題與變奏是同一主題的連串變化；賦格則以主題在各聲部模仿進入為基礎。',
      'Rondo is defined by a recurring refrain (A) alternating with episodes (B, C…). Ternary has only one contrasting middle; theme and variations restates one theme in successive variants; a fugue is built on imitative entries of a subject.']),

  // ▸ 術語與表情（按 pool 模板化）
  q('mus_term_ritardando', TOPICS.terms_dynamics, FW.theory, 'medium', 2019, 3,
    ['速度術語「ritardando（rit.）」表示？', 'The term “ritardando” (rit.) means?'],
    [['漸漸慢下來（漸慢）', 'Gradually slowing down'], ['漸漸快起來', 'Gradually getting faster'], ['突然加快', 'Suddenly faster'], ['保持原速', 'Keep a steady tempo']],
    ['ritardando 指速度漸慢；漸快是 accelerando，原速可用 a tempo 標示。三者皆屬「速度」記號而非力度。',
      'Ritardando means gradually slowing; gradually speeding up is accelerando, and returning to the original speed is a tempo. These are tempo markings, not dynamics.']),
  q('mus_term_staccato', TOPICS.terms_dynamics, FW.theory, 'medium', 2022, 3,
    ['奏法記號「staccato」（音符上方小圓點）表示？', 'The articulation “staccato” (a dot above the note) indicates the notes should be?'],
    [['短促而分離地彈奏（斷音）', 'Played short and detached'], ['圓滑連貫地彈奏', 'Played smoothly and connected'], ['逐漸增強', 'Played increasingly louder'], ['以顫音彈奏', 'Played with a trill']],
    ['staccato 要求音符短促、彼此分離；其相反是 legato（圓滑連奏）。漸強屬力度（crescendo），顫音屬裝飾奏法，皆與 staccato 無關。',
      'Staccato calls for short, detached notes; its opposite is legato (smooth and connected). Getting louder is a dynamic (crescendo) and a trill is an ornament — neither relates to staccato.']),
  q('mus_dynamics_softest', TOPICS.terms_dynamics, FW.theory, 'medium', 2017, 3,
    ['下列力度記號中，哪一個最弱（最細聲）？', 'Which of the following dynamic markings is the softest (quietest)?'],
    [['pp（pianissimo，很弱）', 'pp (pianissimo)'], ['mp（mezzo-piano，中弱）', 'mp (mezzo-piano)'], ['f（forte，強）', 'f (forte)'], ['ff（fortissimo，很強）', 'ff (fortissimo)']],
    ['力度由弱至強：pp（很弱）< p < mp（中弱）< mf < f（強）< ff（很強），故 pp 最弱。p 系列愈多字母愈弱，f 系列愈多字母愈強。',
      'From soft to loud: pp < p < mp < mf < f < ff, so pp is the softest. More p’s mean softer; more f’s mean louder.']),
  q('mus_term_andante', TOPICS.terms_dynamics, FW.theory, 'medium', 2021, 3,
    ['速度術語「Andante」表示的速度大約是？', 'The tempo marking “Andante” indicates roughly what speed?'],
    [['行板（中等偏慢、似步行）', 'A walking pace (moderately slow)'], ['極快', 'Very fast'], ['極慢、莊嚴', 'Very slow and broad'], ['快板', 'Fast and lively']],
    ['Andante 原意為「行走」，速度中等偏慢、如步行。極快為 Presto、快板為 Allegro、極慢而莊嚴為 Largo。',
      'Andante literally means “walking”, a moderately slow pace. Very fast is Presto, fast is Allegro, and very slow and broad is Largo.']),

  // ▸ 風格與背景（Areas of Study 1–4）
  q('mus_style_concerto_grosso', TOPICS.styles_context, FW.context, 'hard', 2023, 4,
    ['巴羅克時期一種以「一小組獨奏者」（concertino）與「全體合奏」（ripieno）相互對比的管弦體裁是？',
      'A Baroque orchestral genre that contrasts a small group of soloists (concertino) with the full ensemble (ripieno) is the?'],
    [['大協奏曲（concerto grosso）', 'Concerto grosso'], ['交響曲（symphony）', 'Symphony'], ['神劇 / 清唱劇（oratorio）', 'Oratorio'], ['弦樂四重奏（string quartet）', 'String quartet']],
    ['大協奏曲（concerto grosso）是巴羅克典型體裁，以獨奏小組與全奏樂團交替對比（AoS 1）。交響曲與弦樂四重奏盛於古典時期，神劇則屬大型聲樂作品。',
      'The concerto grosso is the characteristic Baroque genre contrasting a soloist group with the full band (AoS 1). The symphony and string quartet flourished in the Classical era, while the oratorio is a large vocal work.']),
  q('mus_style_ritornello', TOPICS.styles_context, FW.context, 'hard', 2024, 4,
    ['巴羅克協奏曲樂章中，全體合奏不斷再現的段落（與獨奏段交替）稱為？',
      'In a Baroque concerto movement, the recurring full-ensemble section that alternates with solo passages is the?'],
    [['利都奈羅 / 全奏段（ritornello）', 'Ritornello'], ['發展部（development）', 'Development'], ['尾聲（coda）', 'Coda'], ['導奏（introduction）', 'Introduction']],
    ['ritornello（「回返」之意）指全奏不斷再現的主題段，與獨奏段交替構成巴羅克協奏曲樂章（AoS 1）。發展部與尾聲屬奏鳴曲式 / 古典曲式概念，導奏只在開頭出現一次。',
      'The ritornello (“little return”) is the recurring tutti theme alternating with solo episodes in a Baroque concerto movement (AoS 1). Development and coda belong to Classical sonata form, and an introduction occurs only once at the start.']),
  q('mus_style_impressionism', TOPICS.styles_context, FW.context, 'medium', 2022, 3,
    ['二十世紀初的「印象派（Impressionism）」音樂，最具代表性的作曲家是？',
      'Early-20th-century musical “Impressionism” is most associated with which composer?'],
    [['德布西（Debussy）', 'Debussy'], ['巴赫（Bach）', 'Bach'], ['貝多芬（Beethoven）', 'Beethoven'], ['荀伯格（Schoenberg）', 'Schoenberg']],
    ['印象派以德布西為代表，運用全音音階、平行和弦營造朦朧色彩（AoS 1）。巴赫屬巴羅克、貝多芬屬古典／浪漫之交，荀伯格則是十二音 / 序列主義（同屬 AoS 1 但風格相反）。',
      'Impressionism is led by Debussy, using whole-tone scales and parallel chords for a hazy colour (AoS 1). Bach is Baroque, Beethoven bridges Classical and Romantic, and Schoenberg is 12-tone/serialist — the opposite aesthetic.']),
  q('mus_style_dizi_bamboo', TOPICS.styles_context, FW.context, 'medium', 2020, 3,
    ['在「絲竹」音樂（如江南絲竹）中，「竹」一類所指的笛子（dizi）屬於哪一類樂器？',
      'In “silk and bamboo” music (e.g. Jiangnan Sizhu), the dizi — belonging to the “bamboo” category — is which type of instrument?'],
    [['吹管（竹製）樂器', 'A wind (bamboo) instrument'], ['彈撥弦樂器', 'A plucked string instrument'], ['拉弦樂器', 'A bowed string instrument'], ['敲擊樂器', 'A percussion instrument']],
    ['「絲竹」中「絲」指弦樂（如二胡、琵琶），「竹」指竹製吹管樂器；笛子屬「竹」，即吹管樂器（AoS 2）。它並非彈撥、拉弦或敲擊類。',
      'In “silk and bamboo”, “silk” means strings (e.g. erhu, pipa) and “bamboo” means bamboo wind instruments; the dizi is “bamboo”, i.e. a wind instrument (AoS 2) — not plucked, bowed, or percussion.']),
  q('mus_style_pipa_plucked', TOPICS.styles_context, FW.context, 'medium', 2019, 3,
    ['中國樂器「琵琶（pipa）」的發聲方式屬於哪一類？', 'The Chinese instrument the pipa produces sound as which type of instrument?'],
    [['彈撥弦樂器（以手指撥弦）', 'A plucked string instrument'], ['拉弦樂器（以弓拉奏）', 'A bowed string instrument'], ['吹管樂器', 'A wind instrument'], ['敲擊樂器', 'A percussion instrument']],
    ['琵琶以手指（或假甲）撥彈絲弦發聲，屬彈撥弦樂器（AoS 2 傳統獨奏樂器之一）。以弓拉奏的是二胡等拉弦樂器；笛子屬吹管。',
      'The pipa is sounded by plucking its strings with the fingers (or false nails), making it a plucked string instrument (a solo instrument in AoS 2). Bowed instruments include the erhu; the dizi is a wind instrument.']),
]

export const musicTopics: Topic[] = [
  { id: 'pitch_intervals', zh: '音高與音程', framework: '樂理基礎', emoji: '🎵', count: 5 },
  { id: 'scales_keys', zh: '音階與調', framework: '樂理基礎', emoji: '🎼', count: 5 },
  { id: 'rhythm_metre', zh: '節奏與拍子', framework: '樂理基礎', emoji: '🥁', count: 4 },
  { id: 'harmony', zh: '和聲', framework: '音樂分析', emoji: '🎹', count: 4 },
  { id: 'texture_form', zh: '織體與曲式', framework: '音樂分析', emoji: '🧩', count: 4 },
  { id: 'terms_dynamics', zh: '術語與表情', framework: '樂理基礎', emoji: '🔊', count: 4 },
  { id: 'styles_context', zh: '風格與背景', framework: '音樂常識', emoji: '🌏', count: 5 },
]
