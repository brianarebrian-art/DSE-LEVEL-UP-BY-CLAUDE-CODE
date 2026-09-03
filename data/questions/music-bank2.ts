import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// music-bank2.ts —— 音樂參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 承接 music-bank.ts。音樂現為 521 條、分佈 25–110（4.4 倍）。
// 本檔【只】為每課題目標 100 之下的九個課題出題，
// 已達標的 mus_theory_intervals(110) 一條不加。
//
// 音樂被視為概念與聽感的科目，但可 correct-by-construction 的部分不少：
// 拍號與小節音符數、音程半音數、大調音階的升降記號數、和弦組成音、
// 樂曲時值與速度、樂團編制人數、曲式段落數 —— 全部由數字或規則算出。
//
// ⚠️ 誘答必須互不相同【且在數學上不恆等】。同日 ICT DC2 與生物 GE2 兩役：
// 誘答字面不同而代數上恆等，去重後只剩兩個，整組靜默丟棄而審視源碼
// 不會發現。本檔每個模板寫完即以實測產出數字核對。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  create: { id: 'creating', zh: '創作與演奏', en: 'Creating & Performing' },
  west: { id: 'western_history', zh: '西方音樂史', en: 'Western Music History' },
  form: { id: 'form_structure', zh: '曲式與結構', en: 'Form & Structure' },
  inst: { id: 'instruments', zh: '樂器與合奏', en: 'Instruments & Ensemble' },
  harmony: { id: 'mus_harmony_form', zh: '和聲・和弦與曲式', en: 'Harmony — chords & form' },
  chin: { id: 'chinese_music', zh: '中國音樂', en: 'Chinese Music' },
  elements: { id: 'elements', zh: '音樂元素', en: 'Elements of Music' },
  listen: { id: 'listening', zh: '聆聽與分析', en: 'Listening & Analysis' },
  theory: { id: 'theory_notation', zh: '樂理與記譜', en: 'Theory & Notation' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('music')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 樂理與記譜 ────────────────────────────────────────────────────────────

// TH1 — 一小節可容納的音符數 = 拍號分子 × (拍號分母 ÷ 音符時值分母)
const BEATS: [number, number, string][] = [
  [2, 4, '二四'], [3, 4, '三四'], [4, 4, '四四'], [6, 8, '六八'], [9, 8, '九八'], [3, 8, '三八'], [5, 4, '五四'],
]
for (const [num, den, zhName] of BEATS) {
  for (const noteDen of [8, 16]) {
    if (noteDen <= den) continue
    const count = num * (noteDen / den)
    if (!Number.isInteger(count)) continue
    const noteZh = noteDen === 8 ? '八分音符' : '十六分音符'
    const d = distract(count, [num, noteDen / den, num + noteDen / den])
    if (d.length < 3) continue
    b.add(`musb2_th1_${num}_${den}_${noteDen}`, T.theory, FW.apply, 'easy',
      [`一首樂曲的拍號為 ${zhName}拍子（${num}/${den}）。一個完整小節可容納多少個${noteZh}？`,
       `A piece is in ${num}/${den} time. How many ${noteDen === 8 ? 'quavers' : 'semiquavers'} fill one complete bar?`],
      [qty(count, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`拍號分母 ${den} 表示以${den === 4 ? '四分音符' : '八分音符'}為一拍，分子 ${num} 表示每小節 ${num} 拍。一個${den === 4 ? '四分音符' : '八分音符'}等於 ${noteDen / den} 個${noteZh}，故一小節共 $${num} \\times ${noteDen / den} = ${count}$ 個。答 $${num}$ 是把「拍數」當成「音符數」—— 兩者只在音符時值恰好等於一拍時相同。`,
       `The lower number ${den} says the beat is a ${den === 4 ? 'crotchet' : 'quaver'} and the upper number ${num} gives ${num} beats per bar. Each beat holds ${noteDen / den} of the shorter note, so the bar holds $${num} \\times ${noteDen / den} = ${count}$. Answering $${num}$ confuses the BEAT COUNT with the NOTE COUNT — they agree only when the note value equals one beat.`])
  }
}

// TH2 — 附點音符時值 = 原時值 × 1.5
for (const beats of [1, 2, 4, 8, 16]) {
  const dotted = beats * 1.5
  const d = distract(dotted, [beats * 2, beats, beats + 1])
  if (d.length < 3) continue
  b.add(`musb2_th2_${beats}`, T.theory, FW.logic, 'easy',
    [`一個音符本身佔 ${beats} 拍。在其後加上一個附點後，該音符共佔多少拍？`,
     `A note is worth ${beats} beat(s). How many beats is it worth once a dot is added?`],
    [qty(dotted, '拍', 'beats'), ...d.map((v) => qty(v, '拍', 'beats'))],
    [`附點的作用是把原音符的時值【加上其一半】，即 $${beats} + ${beats / 2} = ${dotted}$ 拍，等於原時值的 1.5 倍。答 $${beats * 2}$ 是把附點當成延長記號（tie）或倍增 —— 附點加的是一半，不是一倍。這也是六八拍子常寫成兩個附點四分音符的原因：$1.5 + 1.5 = 3$ 拍，恰好是六個八分音符。`,
     `A dot ADDS HALF the note's own value: $${beats} + ${beats / 2} = ${dotted}$ beats, that is 1.5 times the original. Answering $${beats * 2}$ treats the dot as a tie or a doubling — a dot adds a half, not a whole. This is also why 6/8 is often written as two dotted crotchets: $1.5 + 1.5 = 3$ beats, exactly six quavers.`])
}

// ── 音樂元素 ──────────────────────────────────────────────────────────────

// EL1 — 演奏時間 = 總拍數 ÷ 每分鐘拍數
for (const bars of [16, 24, 32, 48, 64, 96, 128]) {
  for (const bpm of [60, 80, 90, 120, 160]) {
    const beats = bars * 4
    const sec = (beats / bpm) * 60
    if (!Number.isInteger(sec)) continue
    const d = distract(sec, [bars, beats, bpm])
    if (d.length < 3) continue
    b.add(`musb2_el1_${bars}_${bpm}`, T.elements, FW.apply, 'medium',
      [`一段四四拍子的樂曲共 ${bars} 小節，速度為每分鐘 ${bpm} 拍。演奏這段音樂需時多少秒？`,
       `A passage in 4/4 time runs ${bars} bars at ${bpm} beats per minute. How many seconds does it take to perform?`],
      [qty(sec, '秒', 's'), ...d.map((v) => qty(v, '秒', 's'))],
      [`四四拍子每小節 4 拍，${bars} 小節共 $${bars} \\times 4 = ${beats}$ 拍。速度 ${bpm} 拍／分鐘，故需 $${beats} \\div ${bpm} = ${(beats / bpm).toFixed(2)}$ 分鐘 = ${sec} 秒。速度標記直接決定樂曲長度：同一份樂譜以 ${bpm} 與以 ${bpm * 2} 演奏，時間相差一倍，而音符一個都沒有改變。`,
       `In 4/4 each bar has 4 beats, so ${bars} bars give $${bars} \\times 4 = ${beats}$ beats. At ${bpm} beats per minute that is $${beats} \\div ${bpm} = ${(beats / bpm).toFixed(2)}$ minutes, or ${sec} seconds. The tempo marking alone sets the duration: the same score at ${bpm} and at ${bpm * 2} differs twofold in length without a single note changing.`])
  }
}

// EL2 — 力度層級之間的級數
const DYN = ['pp', 'p', 'mp', 'mf', 'f', 'ff']
for (let i = 0; i < DYN.length; i++) {
  for (let j = i + 1; j < DYN.length; j++) {
    const steps = j - i
    const d = distract(steps, [j, i, steps + 1])
    if (d.length < 3) continue
    b.add(`musb2_el2_${i}_${j}`, T.elements, FW.logic, 'easy',
      [`力度記號由弱至強依次為 pp、p、mp、mf、f、ff。由 ${DYN[i]} 增強至 ${DYN[j]}，跨越了多少個力度層級？`,
       `Dynamic markings run pp, p, mp, mf, f, ff from soft to loud. How many levels are crossed going from ${DYN[i]} to ${DYN[j]}?`],
      [qty(steps, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`由 ${DYN[i]} 數到 ${DYN[j]}，中間跨越 ${steps} 個層級。留意力度記號是【相對】而非絕對：f 在獨奏長笛與在整隊管弦樂團之下，實際音量差距極大。作曲家標 ${DYN[j]} 的意思是「比 ${DYN[i]} 明顯響一截」，而非某個固定分貝。`,
       `Counting from ${DYN[i]} to ${DYN[j]} crosses ${steps} levels. Note that dynamics are RELATIVE, not absolute: an f on a solo flute and an f from a full orchestra differ enormously in actual loudness. Marking ${DYN[j]} means "clearly louder than ${DYN[i]}", not a fixed decibel figure.`])
  }
}

// ── 和聲・和弦與曲式 ──────────────────────────────────────────────────────

// HA1 — 由根音與和弦性質推出五音
//
// ⚠️ 2026-09-03：本模板首版的題幹【沒有引用 root 迴圈變數】，只問「根音至
// 五音相距多少半音」—— 十二個 root 出了十二條一模一樣的題，被 global-dedup
// 閘攔下（大三、小三各一組，共 24 條重複）。
// 這與健康管理 HM 一役是同一形狀，該批的結論寫得很清楚：
// 【變體的題幹若不含迴圈變數，它就只能出一條】。
// 現改為把根音寫進題幹並問五音音名，root 才真正參與出題。
const PITCH = ['C', '升 C', 'D', '升 D', 'E', 'F', '升 F', 'G', '升 G', 'A', '升 A', 'B']
const PITCH_EN = ['C', 'C sharp', 'D', 'D sharp', 'E', 'F', 'F sharp', 'G', 'G sharp', 'A', 'A sharp', 'B']
const TRIADS: [string, string, number, number][] = [
  ['大三和弦', 'major', 4, 3], ['小三和弦', 'minor', 3, 4],
  ['減三和弦', 'diminished', 3, 3], ['增三和弦', 'augmented', 4, 4],
]
for (const [zhName, enName, lower, upper] of TRIADS) {
  for (const root of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
    const fifth = (root + lower + upper) % 12
    const third = (root + lower) % 12
    const d = distract(fifth, [third, root, (root + 7) % 12])
    if (d.length < 3) continue
    b.add(`musb2_ha1_${enName}_${root}`, T.harmony, FW.logic, 'medium',
      [`以 ${PITCH[root]} 為根音的${zhName}，根音至三音相距 ${lower} 個半音，三音至五音相距 ${upper} 個半音。若以 C 為 0、依半音順序編號至 B 為 11，該和弦五音的編號為多少？`,
       `A ${enName} triad on ${PITCH_EN[root]} has ${lower} semitones from root to third and ${upper} from third to fifth. Numbering pitches with C as 0 rising by semitone to B as 11, what is the number of its fifth?`],
      [qty(fifth, '', ''), ...d.map((v) => qty(v, '', ''))],
      [`根音 ${PITCH[root]} 編號 ${root}，加上 $${lower} + ${upper} = ${lower + upper}$ 個半音得 ${root + lower + upper}${root + lower + upper >= 12 ? `，超出 11 故減 12 得 ${fifth}` : `，即 ${fifth}`}（音名 ${PITCH[fifth]}）。四種三和弦的分別全在這兩段的排列：大三 4+3、小三 3+4（對調而總距同為 7，即純五度），減三 3+3（總距 6）、增三 4+4（總距 8）。所以【只聽五度】分不出大小三和弦，要聽三音（本題的三音編號為 ${third}）。`,
       `The root ${PITCH_EN[root]} is number ${root}; adding $${lower} + ${upper} = ${lower + upper}$ semitones gives ${root + lower + upper}${root + lower + upper >= 12 ? `, which exceeds 11, so subtract 12 for ${fifth}` : `, that is ${fifth}`} (${PITCH_EN[fifth]}). The four triads differ purely in how the two intervals are arranged: major 4+3 and minor 3+4 swap them yet both span 7, a perfect fifth, while diminished 3+3 spans 6 and augmented 4+4 spans 8. So the FIFTH ALONE cannot separate major from minor — the third does, and here it is number ${third}.`])
  }
}

// HA2 — 大調音階的升號數（五度圈）
const SHARP_KEYS: [string, string, number][] = [
  ['C', 'C', 0], ['G', 'G', 1], ['D', 'D', 2], ['A', 'A', 3],
  ['E', 'E', 4], ['B', 'B', 5], ['升 F', 'F sharp', 6],
]
for (const [zhKey, enKey, sharps] of SHARP_KEYS) {
  const d = distract(sharps, [sharps + 1, 7 - sharps, sharps * 2])
  if (d.length < 3) continue
  b.add(`musb2_ha2_${enKey.replace(/ /g, '_')}`, T.harmony, FW.logic, 'medium',
    [`${zhKey}大調的調號有多少個升號？`,
     `How many sharps are in the key signature of ${enKey} major?`],
    [qty(sharps, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`${zhKey}大調有 ${sharps} 個升號。五度圈的規律是：由 C 大調（0 個升號）每向上一個純五度，升號就多一個 —— C、G、D、A、E、B、升 F 依次為 0 至 6 個。記住這條規律，就不必逐個調背誦，因為它同時解釋了為何調號會是這個數目。`,
     `${enKey} major has ${sharps} sharp(s). The circle of fifths runs: from C major with none, each step up a perfect fifth adds one sharp — C, G, D, A, E, B, F sharp give 0 through 6. Learn the rule and no key needs separate memorising, because the rule also explains WHY the count is what it is.`])
}

// ── 曲式與結構 ────────────────────────────────────────────────────────────

// FO1 — 迴旋曲式的段落總數
for (const episodes of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
  const sections = episodes * 2 + 1
  const d = distract(sections, [episodes, episodes + 1, episodes * 2])
  if (d.length < 3) continue
  b.add(`musb2_fo1_${episodes}`, T.form, FW.logic, 'medium',
    [`一首迴旋曲有 ${episodes} 個插段，每個插段之間及首尾均出現主題段。全曲共有多少個段落？`,
     `A rondo has ${episodes} episodes, with the refrain appearing between each pair and at both ends. How many sections does the whole piece have?`],
    [qty(sections, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`迴旋曲式為 A–B–A–C–A⋯ 的排列：${episodes} 個插段之間及首尾共需 ${episodes + 1} 次主題段，加上 ${episodes} 個插段，合共 $${episodes + 1} + ${episodes} = ${sections}$ 個段落。主題段永遠比插段多一個 —— 因為它既開頭又結尾，這正是「迴旋」的意思。`,
     `A rondo runs A–B–A–C–A⋯: ${episodes} episodes require ${episodes + 1} statements of the refrain to separate them and close both ends, giving $${episodes + 1} + ${episodes} = ${sections}$ sections in all. There is always one more refrain than episode, because the refrain both opens and closes — which is what "rondo" means.`])
}

// ── 樂器與合奏 ────────────────────────────────────────────────────────────

// IN1 — 弦樂組人數合計
for (const v1 of [8, 10, 12, 14, 16, 18]) {
  for (const v2 of [6, 8, 10, 12, 14]) {
    for (const va of [4, 6, 8]) {
      const total = v1 + v2 + va
      const d = distract(total, [v1 + v2, v1, v1 * 2])
      if (d.length < 3) continue
      b.add(`musb2_in1_${v1}_${v2}_${va}`, T.inst, FW.apply, 'easy',
        [`某管弦樂團的第一小提琴 ${v1} 人、第二小提琴 ${v2} 人、中提琴 ${va} 人。這三個聲部合共多少人？`,
         `An orchestra has ${v1} first violins, ${v2} second violins and ${va} violas. How many players are in these three sections combined?`],
        [qty(total, '人', ''), ...d.map((v) => qty(v, '人', ''))],
        [`合共 $${v1} + ${v2} + ${va} = ${total}$ 人。管弦樂團的弦樂人數遠多於管樂，原因不在於弦樂重要些，而在於【音量】：一支雙簧管的音量已可與數把小提琴相當，故要用人數平衡。這也是弦樂聲部一人一份譜、管樂多為一人一聲部的原因。`,
         `The total is $${v1} + ${v2} + ${va} = ${total}$. Orchestras carry far more strings than winds not because strings matter more but because of VOLUME: a single oboe can match several violins, so numbers are used to balance. It is also why string players share a part while wind players usually have one each.`])
    }
  }
}

// ── 西方音樂史 ────────────────────────────────────────────────────────────

// WH1 — 時期跨度年數
const ERAS: [string, string, number, number][] = [
  ['巴洛克', 'Baroque', 1600, 1750], ['古典', 'Classical', 1750, 1820],
  ['浪漫', 'Romantic', 1820, 1900], ['文藝復興', 'Renaissance', 1400, 1600],
  ['二十世紀', 'Twentieth-century', 1900, 2000],
]
for (const [zhEra, enEra, start, end] of ERAS) {
  const span = end - start
  const d = distract(span, [end, start, span / 2])
  if (d.length < 3) continue
  b.add(`musb2_wh1_${enEra.replace(/[^A-Za-z]/g, '')}`, T.west, FW.apply, 'easy',
    [`${zhEra}時期一般界定為 ${start} 年至 ${end} 年。該時期橫跨多少年？`,
     `The ${enEra} period is generally dated from ${start} to ${end}. How many years does it span?`],
    [qty(span, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
    [`$${end} - ${start} = ${span}$ 年。要留意這些年份是【後人劃定的方便界線】，不是當時的人宣布的 —— 沒有作曲家在 ${end} 年決定改寫另一種風格。分期的實際情況是重疊與漸變，界線附近的作品往往兩邊特徵都有。`,
     `$${end} - ${start} = ${span}$ years. Note these dates are BOUNDARIES DRAWN AFTERWARDS for convenience, not announcements made at the time — no composer resolved in ${end} to write differently. Periods in fact overlap and shade into one another, and works near a boundary usually show features of both.`])
}

// ── 中國音樂 ──────────────────────────────────────────────────────────────

// CM1 — 五聲音階的音數與音程
for (const notes of [5, 6, 7]) {
  const gaps = notes - 1
  const d = distract(gaps, [notes, notes + 1, gaps - 1])
  if (d.length < 3) continue
  const nameZh = notes === 5 ? '五聲音階（宮商角徵羽）' : notes === 6 ? '六聲音階' : '七聲音階'
  b.add(`musb2_cm1_${notes}`, T.chin, FW.logic, 'medium',
    [`中國${nameZh}在一個八度之內含 ${notes} 個音（不含高八度的主音）。相鄰兩音之間共有多少個音程？`,
     `A Chinese ${notes}-note scale contains ${notes} pitches within an octave, excluding the upper tonic. How many intervals lie between adjacent notes?`],
    [qty(gaps, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`${notes} 個音之間有 $${notes} - 1 = ${gaps}$ 個相鄰音程。五聲音階的特徵在於【沒有半音】—— 宮商角徵羽之間全是大二度與小三度，因此任何兩音同時奏出都不會出現尖銳的不協和，這正是它聽起來平和的原因，也是它容易與西方大調混淆之處：兩者都用相同的音，分別在於五聲少了兩個。`,
     `With ${notes} pitches there are $${notes} - 1 = ${gaps}$ adjacent intervals. What defines the pentatonic scale is the ABSENCE OF SEMITONES — gong, shang, jue, zhi and yu are separated only by major seconds and minor thirds, so no two notes sounded together clash sharply. That is why it sounds settled, and also why it is confused with the Western major scale: they share pitches, and the pentatonic simply omits two.`])
}

// ── 聆聽與分析 ────────────────────────────────────────────────────────────

// LI1 — 主題重現次數與間隔小節數
for (const gap of [4, 8, 12, 16, 24, 32]) {
  for (const times of [3, 4, 5, 6]) {
    const bars = gap * (times - 1)
    const d = distract(bars, [gap * times, gap, times])
    if (d.length < 3) continue
    b.add(`musb2_li1_${gap}_${times}`, T.listen, FW.apply, 'medium',
      [`聆聽一段樂曲時，某主題每隔 ${gap} 小節重現一次，全曲合共出現 ${times} 次。由第一次出現至最後一次出現，中間相隔多少小節？`,
       `In a piece a theme recurs every ${gap} bars and appears ${times} times in all. How many bars separate its first appearance from its last?`],
      [qty(bars, '小節', 'bars'), ...d.map((v) => qty(v, '小節', 'bars'))],
      [`出現 ${times} 次即中間有 $${times} - 1 = ${times - 1}$ 段間隔，每段 ${gap} 小節，故共 $${gap} \\times ${times - 1} = ${bars}$ 小節。答 $${gap * times}$ 多算了一段 —— 這是典型的「柵欄與柱」問題：${times} 根柱之間只有 ${times - 1} 段柵欄。`,
       `Appearing ${times} times leaves $${times} - 1 = ${times - 1}$ gaps of ${gap} bars each, so $${gap} \\times ${times - 1} = ${bars}$ bars. Answering $${gap * times}$ counts one gap too many — the classic fencepost problem: ${times} posts enclose only ${times - 1} spans.`])
  }
}

// ── 創作與演奏 ────────────────────────────────────────────────────────────

// CR1 — 樂句與樂段：小節總數 = 樂句數 × 每句小節數
for (const phrases of [2, 3, 4, 6, 8, 10, 12]) {
  for (const barsEach of [2, 4, 8, 12, 16]) {
    const total = phrases * barsEach
    const d = distract(total, [phrases + barsEach, phrases, barsEach])
    if (d.length < 3) continue
    b.add(`musb2_cr1_${phrases}_${barsEach}`, T.create, FW.apply, 'easy',
      [`創作一段樂曲，共 ${phrases} 個樂句，每句 ${barsEach} 小節。全段合共多少小節？`,
       `A passage is written with ${phrases} phrases of ${barsEach} bars each. How many bars in total?`],
      [qty(total, '小節', 'bars'), ...d.map((v) => qty(v, '小節', 'bars'))],
      [`合共 $${phrases} \\times ${barsEach} = ${total}$ 小節。四小節一句、八小節一段是西方調性音樂最常見的方整結構 —— 之所以聽起來「自然」，並非因為它必然如此，而是聽慣了。刻意打破方整（例如五小節一句）正是許多作曲家製造不安或推進感的手法。`,
       `The total is $${phrases} \\times ${barsEach} = ${total}$ bars. Four-bar phrases in eight-bar periods are the commonest squared structure in Western tonal music — it sounds "natural" not because it must be so but because ears are used to it. Deliberately breaking the square, say with a five-bar phrase, is exactly how many composers create unease or forward pressure.`])
  }
}

// CR2 — 移調：升高 n 個半音後的音高編號
for (const from of [0, 2, 4, 5, 7, 9, 11]) {
  for (const up of [1, 2, 3, 5, 7]) {
    const to = (from + up) % 12
    const d = distract(to, [from, up, (from + up + 12) % 12 === to ? from + up : from - up])
    if (d.length < 3) continue
    b.add(`musb2_cr2_${from}_${up}`, T.create, FW.logic, 'hard',
      [`以 C 為 0、依半音順序編號至 B 為 11。將編號 ${from} 的音升高 ${up} 個半音，所得音的編號為多少？`,
       `Number the pitches with C as 0 and rising by semitone to B as 11. Raising pitch number ${from} by ${up} semitones gives which number?`],
      [qty(to, '', ''), ...d.map((v) => qty(v, '', ''))],
      [`$${from} + ${up} = ${from + up}$，${from + up >= 12 ? `超出 11 故減 12 得 ${to}` : `仍在 0 至 11 之內，故為 ${to}`}。移調的本質就是把每個音同加一個常數再取十二的餘數 —— 因為八度之後音名重複。明白了這一點，移調就不是背調號，而是一次加法。`,
       `$${from} + ${up} = ${from + up}$, ${from + up >= 12 ? `which exceeds 11, so subtract 12 to get ${to}` : `still within 0 to 11, so ${to}`}. Transposition is nothing more than adding a constant to every pitch and taking the remainder modulo twelve, because note names repeat at the octave. Seen that way, transposing is an addition rather than a set of key signatures to memorise.`])
  }
}

// ── 補充模板：以數值範圍取代固定枚舉 ─────────────────────────────────────
// 上面的 ERAS／TRIADS／SHARP_KEYS 是【枚舉表】，項數固定即產出封頂
// （5、4、7 條），無法靠擴闊迴圈補量。以下改用真正的數值參數。

// TH3 — 音符時值換算：一個長音符等於多少個短音符
for (const longer of [1, 2, 4, 8, 16]) {
  for (const shorter of [2, 4, 8, 16, 32]) {
    if (shorter <= longer) continue
    const count = shorter / longer
    if (!Number.isInteger(count)) continue
    const nameOf = (v: number) => v === 1 ? '全音符' : v === 2 ? '二分音符' : v === 4 ? '四分音符' : v === 8 ? '八分音符' : v === 16 ? '十六分音符' : '三十二分音符'
    const d = distract(count, [count * 2, count / 2, shorter - longer])
    if (d.length < 3) continue
    b.add(`musb2_th3_${longer}_${shorter}`, T.theory, FW.logic, 'easy',
      [`一個${nameOf(longer)}等於多少個${nameOf(shorter)}？`,
       `How many ${nameOf(shorter)} equal one ${nameOf(longer)}?`],
      [qty(count, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`西方記譜的音符時值以【二分之一】遞減：每細一級，時值減半，數目加倍。由${nameOf(longer)}到${nameOf(shorter)}相隔 $\\log_2(${count}) = ${Math.log2(count)}$ 級，故一個等於 ${count} 個。整套系統都是 2 的次方，這也是為何三等分（三連音）要另加記號 —— 二分制本身表達不到。`,
       `Western note values halve at each step: shorter by one level means half the duration and twice the count. From the longer to the shorter is $\\log_2(${count}) = ${Math.log2(count)}$ level(s), so one equals ${count}. The whole system runs on powers of two, which is exactly why dividing into three (a triplet) needs a special marking — the binary scheme cannot express it.`])
  }
}

// HA3 — 和弦轉位：n 個音的和弦有多少個轉位（含原位）
for (const tones of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) {
  const d = distract(tones, [tones - 1, tones + 1, tones * 2])
  if (d.length < 3) continue
  b.add(`musb2_ha3_${tones}`, T.harmony, FW.logic, 'medium',
    [`一個由 ${tones} 個不同音組成的和弦，把最低音依次移高八度。連同原位在內，共可排出多少種不同的低音排列？`,
     `A chord built from ${tones} different notes has its lowest note moved up an octave repeatedly. Including root position, how many distinct bass arrangements arise?`],
    [qty(tones, '種', ''), ...d.map((v) => qty(v, '種', ''))],
    [`每移一次，低音就換成和弦的下一個音；移 ${tones} 次之後低音回到原來的音，故共 ${tones} 種排列（原位加 ${tones - 1} 個轉位）。三和弦有 3 種、七和弦有 4 種 —— 轉位數【等於】和弦音數，因為每個音都輪流做過一次低音。答 $${tones - 1}$ 是只數轉位而漏了原位。`,
     `Each move puts the next chord tone in the bass; after ${tones} moves the original note returns, giving ${tones} arrangements — root position plus ${tones - 1} inversions. A triad has 3 and a seventh chord 4: the count EQUALS the number of chord tones, since each takes a turn in the bass. Answering $${tones - 1}$ counts only the inversions and omits root position.`])
}

// FO2 — 變奏曲：主題加 n 次變奏的總段落數與總小節數
for (const variations of [4, 5, 6, 8, 10, 12]) {
  for (const barsEach of [8, 16, 24, 32]) {
    const total = (variations + 1) * barsEach
    const d = distract(total, [variations * barsEach, barsEach, variations + barsEach])
    if (d.length < 3) continue
    b.add(`musb2_fo2_${variations}_${barsEach}`, T.form, FW.apply, 'medium',
      [`一首變奏曲由主題及 ${variations} 次變奏組成，主題與每次變奏均為 ${barsEach} 小節。全曲共多少小節？`,
       `A theme-and-variations work has a theme and ${variations} variations, each of ${barsEach} bars. How many bars in total?`],
      [qty(total, '小節', 'bars'), ...d.map((v) => qty(v, '小節', 'bars'))],
      [`主題本身也是一個段落，故共 $${variations} + 1 = ${variations + 1}$ 段，每段 ${barsEach} 小節，合共 $${variations + 1} \\times ${barsEach} = ${total}$ 小節。答 $${variations * barsEach}$ 漏了主題 —— 變奏曲的結構是「先示主題，再逐次改造」，沒有主題就無從變起。`,
       `The theme is itself a section, so there are $${variations} + 1 = ${variations + 1}$ sections of ${barsEach} bars, giving $${variations + 1} \\times ${barsEach} = ${total}$ bars. Answering $${variations * barsEach}$ omits the theme — the form states a theme and then reworks it, and without the statement there is nothing to vary.`])
  }
}

// FO3 — 賦格：聲部依次進入所需的小節數
for (const voices of [2, 3, 4, 5, 6, 7]) {
  for (const spacing of [2, 3, 4, 5, 6, 8, 10, 12]) {
    const bars = (voices - 1) * spacing
    const d = distract(bars, [voices * spacing, spacing, voices])
    if (d.length < 3) continue
    b.add(`musb2_fo3_${voices}_${spacing}`, T.form, FW.logic, 'hard',
      [`一首 ${voices} 聲部賦格的呈示部，各聲部相隔 ${spacing} 小節依次進入。由第一個聲部進入至最後一個聲部進入，相隔多少小節？`,
       `In the exposition of a ${voices}-voice fugue the voices enter ${spacing} bars apart. How many bars separate the first entry from the last?`],
      [qty(bars, '小節', 'bars'), ...d.map((v) => qty(v, '小節', 'bars'))],
      [`${voices} 個聲部之間有 $${voices} - 1 = ${voices - 1}$ 段間隔，每段 ${spacing} 小節，故 $${voices - 1} \\times ${spacing} = ${bars}$ 小節。答 $${voices * spacing}$ 多算一段 —— 又是柵欄與柱：${voices} 個進入點之間只有 ${voices - 1} 段距離。呈示部的長度正由這個數目決定，聲部愈多，主題鋪陳得愈久。`,
       `${voices} voices leave $${voices} - 1 = ${voices - 1}$ gaps of ${spacing} bars, so $${voices - 1} \\times ${spacing} = ${bars}$ bars. Answering $${voices * spacing}$ counts one gap too many — the fencepost problem again: ${voices} entries enclose only ${voices - 1} spans. The exposition's length follows directly, so more voices means a longer unfolding of the subject.`])
  }
}

// WH2 — 作曲家在世年數
for (const born of [1685, 1732, 1756, 1770, 1797, 1810, 1833, 1862, 1875]) {
  for (const lived of [31, 35, 38, 56, 57, 63, 65, 77]) {
    const died = born + lived
    if (died > 1960) continue
    const d = distract(lived, [died, born, died - 1900])
    if (d.length < 3) continue
    b.add(`musb2_wh2_${born}_${lived}`, T.west, FW.apply, 'easy',
      [`某作曲家生於 ${born} 年，卒於 ${died} 年。他在世共多少年？`,
       `A composer was born in ${born} and died in ${died}. How many years did they live?`],
      [qty(lived, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${died} - ${born} = ${lived}$ 年。音樂史上多位重要作曲家壽命極短 —— 舒伯特三十一歲、莫扎特三十五歲、孟德爾遜三十八歲。他們的作品數量之所以驚人，不在於時間長，而在於起步早：多數自幼受訓，十餘歲已在寫成熟作品。`,
       `$${died} - ${born} = ${lived}$ years. Several major composers died remarkably young — Schubert at thirty-one, Mozart at thirty-five, Mendelssohn at thirty-eight. Their output is astonishing not because they had long careers but because they began early: most were trained from childhood and were writing mature work in their teens.`])
  }
}

// CM2 — 中國樂器弦數與音域
for (const strings of [2, 3, 4, 5, 7, 8, 13, 16, 18, 21, 25]) {
  for (const perString of [1, 2, 3, 4, 5]) {
    const notes = strings * perString
    const d = distract(notes, [strings, perString, strings + perString])
    if (d.length < 3) continue
    b.add(`musb2_cm2_${strings}_${perString}`, T.chin, FW.apply, 'medium',
      [`某中國彈撥樂器有 ${strings} 條弦，每條弦在常用把位內可奏出 ${perString} 個音。在該把位內合共可奏出多少個音？`,
       `A Chinese plucked instrument has ${strings} strings, each yielding ${perString} pitch(es) within the common playing position. How many pitches are available in that position?`],
      [qty(notes, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`合共 $${strings} \\times ${perString} = ${notes}$ 個音。中國彈撥樂器的音域策略與西方不同：古箏、揚琴靠【弦數多】覆蓋音域，二胡則靠【兩條弦上按不同位置】。前者換音快而轉調難，後者轉調易而換音須靠準確的按弦 —— 樂器的構造直接決定了它擅長甚麼樣的樂曲。`,
       `That gives $${strings} \\times ${perString} = ${notes}$ pitches. Chinese plucked instruments cover their range differently from Western ones: the zheng and yangqin use MANY STRINGS, while the erhu stops different points on just two. The first changes notes quickly but modulates awkwardly; the second modulates freely but depends on accurate stopping — the construction itself decides what music the instrument suits.`])
  }
}

// EL3 — 漸強漸弱：速度由 a 變 b 所需小節數與每小節變化量
for (const from of [60, 72, 80, 96, 100]) {
  for (const to of [120, 132, 144, 160]) {
    for (const bars of [4, 8, 16]) {
      const step = (to - from) / bars
      if (!Number.isInteger(step)) continue
      const d = distract(step, [to - from, bars, from])
      if (d.length < 3) continue
      b.add(`musb2_el3_${from}_${to}_${bars}`, T.elements, FW.apply, 'hard',
        [`一段音樂由每分鐘 ${from} 拍【均勻】加快至每分鐘 ${to} 拍，歷時 ${bars} 小節。平均每小節速度增加多少拍？`,
         `A passage accelerates evenly from ${from} to ${to} beats per minute over ${bars} bars. By how many beats per minute does the tempo rise per bar, on average?`],
        [qty(step, '拍', 'bpm'), ...d.map((v) => qty(v, '拍', 'bpm'))],
        [`總增幅 $${to} - ${from} = ${to - from}$ 拍，分攤於 ${bars} 小節，即每小節 $${to - from} \\div ${bars} = ${step}$ 拍。要留意「均勻加快」是一個【簡化】：實際演奏中的漸快多為先慢後急，聽感上才自然。這條算式給的是譜面上的平均值，不是演奏者真正做的事。`,
         `The total rise is $${to} - ${from} = ${to - from}$ bpm spread over ${bars} bars, that is $${to - from} \\div ${bars} = ${step}$ bpm per bar. Note that "evenly" is a SIMPLIFICATION: a real accelerando usually starts gently and gathers late, which is what sounds natural. The arithmetic gives the average on the page, not what the performer actually does.`])
    }
  }
}

// LI2 — 樂曲總長度換算：分秒
for (const min of [2, 3, 4, 5, 6, 8, 10, 12]) {
  for (const sec of [15, 30, 45]) {
    const total = min * 60 + sec
    const d = distract(total, [min * 60, min + sec, sec])
    if (d.length < 3) continue
    b.add(`musb2_li2_${min}_${sec}`, T.listen, FW.apply, 'easy',
      [`一首樂曲長 ${min} 分 ${sec} 秒。合共多少秒？`,
       `A piece lasts ${min} minutes and ${sec} seconds. How many seconds is that in total?`],
      [qty(total, '秒', 's'), ...d.map((v) => qty(v, '秒', 's'))],
      [`$${min} \\times 60 + ${sec} = ${min * 60} + ${sec} = ${total}$ 秒。聆聽分析題常要求指出某事件出現在第幾秒，而唱片標示多為分秒制 —— 換算之後才對得上時間軸。答 $${min * 60}$ 漏了餘下的 ${sec} 秒。`,
       `$${min} \\times 60 + ${sec} = ${min * 60} + ${sec} = ${total}$ seconds. Listening questions often ask at which second an event occurs while recordings are labelled in minutes and seconds, so the conversion is what lines the two up. Answering $${min * 60}$ drops the remaining ${sec} seconds.`])
  }
}

// CR3 — 節拍器：每分鐘拍數與每拍秒數互換
for (const bpm of [40, 45, 48, 50, 54, 56, 60, 63, 66, 69, 72, 75, 80, 84, 88, 90, 96, 100, 108, 112, 120, 126, 132, 144, 150, 160, 176, 200]) {
  const msPerBeat = Math.round((60 / bpm) * 1000)
  const d = distract(msPerBeat, [bpm, Math.round(60 / bpm), bpm * 60])
  if (d.length < 3) continue
  b.add(`musb2_cr3_${bpm}`, T.create, FW.apply, 'medium',
    [`節拍器設定為每分鐘 ${bpm} 拍。相鄰兩拍之間相隔多少毫秒？`,
     `A metronome is set to ${bpm} beats per minute. How many milliseconds separate consecutive beats?`],
    [qty(msPerBeat, '毫秒', 'ms'), ...d.map((v) => qty(v, '毫秒', 'ms'))],
    [`一分鐘 = 60000 毫秒，分成 ${bpm} 拍，故每拍 $60000 \\div ${bpm} = ${msPerBeat}$ 毫秒。速度與每拍時值成【反比】：速度加倍，間隔減半。這也是為何速度標記由 ${bpm} 改為 ${bpm * 2} 聽起來變化如此劇烈 —— 間隔一下子少了一半。`,
     `A minute is 60000 ms divided into ${bpm} beats, so each beat spans $60000 \\div ${bpm} = ${msPerBeat}$ ms. Tempo and beat duration are INVERSELY related: double the tempo and the interval halves. That is also why moving a marking from ${bpm} to ${bpm * 2} sounds so drastic — the gap is instantly cut in half.`])
}

export const musicBank4Questions: Question[] = b.bank
