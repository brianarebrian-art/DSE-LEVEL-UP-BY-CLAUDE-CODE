import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// Music "hell" set (5★★). Every answer is theory-verified (interval by letter-count
// + semitones, key signature by sharps/flats, triad by root–3rd–5th quality,
// metre by beat grouping, cadence by chord function). All hard.
const q = makeQ('music')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  theory: { id: 'mus_theory_intervals', zh: '樂理・音程與調號', en: 'Theory — intervals & keys' },
  harmony: { id: 'mus_harmony_form', zh: '和聲・和弦與曲式', en: 'Harmony — chords & form' },
} satisfies Record<string, TopicMeta>
const FW = {
  concept: { id: 'concept', zh: '概念理解', en: 'Concepts', emoji: '📘' },
  apply:   { id: 'apply',   zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `mush_${p}_${++uid}`

const theory: Question[] = [
  q(id('th'), T.theory, FW.apply, 'hard', 2024, 2,
    C('由 D 音向上到 F 音的音程是？（提示：先數音名數目，再數半音）',
      'The interval from D up to F is? (Hint: count letter names first, then semitones.)'),
    [opt('小三度（minor 3rd）', 'a minor 3rd'),
     opt('大三度（major 3rd）', 'a major 3rd'),
     opt('純四度（perfect 4th）', 'a perfect 4th'),
     opt('大二度（major 2nd）', 'a major 2nd')],
    C('D→E→F 共 3 個音名 = 三度；D 到 F 相距 3 個半音（D–D♯–E–F），故為「小三度」。\n\n【陷阱】大三度需 4 個半音（如 D–F♯）；純四度跨 4 個音名；大二度只跨 2 個音名。',
      'D→E→F spans 3 letter names = a 3rd; D to F is 3 semitones (D–D♯–E–F), so a minor 3rd.\n\n【Trap】 A major 3rd needs 4 semitones (e.g. D–F♯); a perfect 4th spans 4 letter names; a major 2nd spans only 2.')),

  q(id('th'), T.theory, FW.concept, 'hard', 2023, 2,
    C('一個大調的調號有「三個升號」（F♯、C♯、G♯）。這個大調及其關係小調分別是？',
      'A major key has a key signature of THREE sharps (F♯, C♯, G♯). This major key and its relative minor are?'),
    [opt('A 大調，關係小調為 升 F 小調（F♯ minor）',
        'A major, with relative minor F♯ minor'),
      opt('E 大調，關係小調為 升 C 小調',
        'E major, relative minor C♯ minor'),
      opt('D 大調，關係小調為 B 小調',
        'D major, relative minor B minor'),
      opt('G 大調，關係小調為 E 小調',
        'G major, relative minor E minor')],
    C('三個升號的大調是 A 大調；關係小調在其下方小三度，即 升 F 小調（共用同一調號）。\n\n【陷阱】E 大調有 4 個升號；D 大調 2 個；G 大調 1 個——升號數目對不上。',
      'Three sharps is A major; its relative minor lies a minor 3rd below, i.e. F♯ minor (sharing the key signature).\n\n【Trap】 E major has 4 sharps; D major 2; G major 1 — the sharp count does not match.')),
]

const harmony: Question[] = [
  q(id('ha'), T.harmony, FW.apply, 'hard', 2024, 2,
    C('一個三和弦由 C、E♭、G♭ 三音組成。這個和弦的性質是？',
      'A triad is built from the notes C, E♭ and G♭. The quality of this chord is?'),
    [opt('減三和弦（diminished）—— 根音 + 小三度 + 減五度',
        'diminished — root + minor 3rd + diminished 5th'),
      opt('大三和弦（major）', 'major'),
      opt('小三和弦（minor）', 'minor'),
      opt('增三和弦（augmented）', 'augmented')],
    C('C 到 E♭ 是小三度，C 到 G♭ 是減五度；根音上疊小三度 + 減五度，正是「減三和弦」。\n\n【陷阱】大三和弦為 C–E–G（大三 + 純五）；小三和弦為 C–E♭–G（小三 + 純五）；增三和弦為 C–E–G♯（大三 + 增五）。關鍵在第五音是減五。',
      'C to E♭ is a minor 3rd and C to G♭ is a diminished 5th; a root with a minor 3rd and diminished 5th is a diminished triad.\n\n【Trap】 Major = C–E–G (major 3rd + perfect 5th); minor = C–E♭–G; augmented = C–E–G♯. The key is the diminished 5th.')),

  q(id('ha'), T.harmony, FW.concept, 'hard', 2023, 2,
    C('一個樂句以「屬和弦 (V) → 主和弦 (I)」結束，給人完滿終止的感覺。同時，6/8 拍號屬於哪一類拍子？（兩部分皆須正確）',
      'A phrase ends “dominant (V) → tonic (I)”, giving a sense of complete closure. Also, 6/8 time is which type of metre? (Both parts must be correct.)'),
    [opt('終止式為「正格／完全終止」(perfect cadence)；6/8 為「複拍子・二拍」(compound duple)',
        'a perfect (authentic) cadence; and 6/8 is compound duple'),
      opt('變格終止 (plagal)；6/8 為單拍子・三拍',
        'a plagal cadence; and 6/8 is simple triple'),
      opt('半終止 (imperfect)；6/8 為複拍子・三拍',
        'an imperfect cadence; and 6/8 is compound triple'),
      opt('正格終止；6/8 為單拍子・二拍',
        'a perfect cadence; and 6/8 is simple duple')],
    C('V→I 是正格（完全）終止，給人完滿收束感。6/8 每小節有兩個附點四分音符的主拍，每拍再分為三，屬「複拍子・二拍」(compound duple)。\n\n【陷阱】變格終止是 IV→I；半終止止於 V；6/8 是「二拍」而非三拍，且為複拍子（每拍三分）而非單拍子。',
      'V→I is a perfect (authentic) cadence, giving full closure. 6/8 has two dotted-crotchet beats per bar, each divided into three — compound duple.\n\n【Trap】 A plagal cadence is IV→I; an imperfect cadence ends on V; 6/8 is duple (not triple) and compound (each beat in three), not simple.')),
]

export const musicHellQuestions: Question[] = [...theory, ...harmony]
export const musicHellTopics: Topic[] = topicList([
  { topic: T.theory,  fw: FW.apply,   count: theory.length },
  { topic: T.harmony, fw: FW.concept, count: harmony.length },
])
