import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// music-bank.ts —— 音樂科參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 第四批，沿用 ICT／生物／地理三批的做法：只擴充原本最薄的課題。
//
// 音樂科現況為 10 個課題共 260 條，其中 mus_theory_intervals 一個已佔 110 條
// （來自 applied-banks.ts），其餘九個介乎 10 至 35 條，倍差 11.0×。
// 本檔完全不碰 mus_theory_intervals，只為其餘九個課題出題。
//
// ⚠️ 迴圈輸出量在撰寫前已逐個估算（地理科 RC1 曾一口氣出 125 條落最厚的
// 課題，令倍差由 6.0× 惡化至 18.5×，須回頭收窄）。本檔每組模板的目標
// 產出為 20 至 45 條，令九個薄弱課題各自落在 55 至 75 之間。
//
// ⚠️ 選項含中文時不可用 n()：n() 只適用於與語言無關的字串，中文會原封不動
// 流入 optionsEn（地理科 IN1 曾因此令 22 條題的英文選項全是中文）。
//
// ⚠️ 題幹不可只靠英文大小寫區分：validate-banks 的 normStem 會 toLowerCase()。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  theory: { id: 'theory_notation', zh: '樂理與記譜', en: 'Theory & Notation' },
  elements: { id: 'elements', zh: '音樂元素', en: 'Elements of Music' },
  form: { id: 'form_structure', zh: '曲式與結構', en: 'Form & Structure' },
  harmony: { id: 'mus_harmony_form', zh: '和聲・和弦與曲式', en: 'Harmony — chords & form' },
  inst: { id: 'instruments', zh: '樂器與合奏', en: 'Instruments & Ensemble' },
  west: { id: 'western_history', zh: '西方音樂史', en: 'Western Music History' },
  chin: { id: 'chinese_music', zh: '中國音樂', en: 'Chinese Music' },
  listen: { id: 'listening', zh: '聆聽與分析', en: 'Listening & Analysis' },
  create: { id: 'creating', zh: '創作與演奏', en: 'Creating & Performing' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('music')
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v) && v > 0).slice(0, 3)

// ── 樂理與記譜（目標約 40 條）──────────────────────────────────────────────

// TH1 — 附點音符的時值（4/4 拍，四分音符 = 1 拍）
const notes: Array<[string, number, string]> = [
  ['全音符', 4, 'semibreve'], ['二分音符', 2, 'minim'],
  ['四分音符', 1, 'crotchet'], ['八分音符', 0.5, 'quaver'],
]
for (const [zh, beats, en] of notes) {
  for (const dots of [1, 2]) {
    const val = dots === 1 ? beats * 1.5 : beats * 1.75
    const d = distract(val, [beats, beats * 2, beats * 1.25, beats / 2])
    if (d.length < 3) continue
    b.add(`musb_th1_${en}_${dots}`, T.theory, FW.apply, dots === 1 ? 'easy' : 'hard',
      [`在 4/4 拍子中（四分音符為一拍），一個${dots === 1 ? '附點' : '雙附點'}${zh}佔多少拍？`,
       `In 4/4 time with the crotchet as one beat, how many beats does a ${dots === 1 ? 'dotted' : 'double-dotted'} ${en} last?`],
      [n(`$${round(val, 3)}$`), ...d.map((v) => n(`$${round(v, 3)}$`))],
      [`附點使音符延長其原時值的一半：${zh}本身佔 ${beats} 拍，加一點得 $${beats} + ${round(beats / 2, 3)} = ${round(beats * 1.5, 3)}$ 拍。${dots === 2 ? `第二點再延長【第一點的一半】，即再加 $${round(beats / 4, 3)}$ 拍，合共 $${round(val, 3)}$ 拍——常見錯誤是把第二點當成再加原時值的一半。` : '要記住附點加的是原音符時值的一半，而非固定拍數。'}`,
       `A dot lengthens a note by half its own value: a ${en} is ${beats} beats, so with one dot it becomes $${beats} + ${round(beats / 2, 3)} = ${round(beats * 1.5, 3)}$ beats. ${dots === 2 ? `A second dot adds half of THE FIRST DOT, that is a further $${round(beats / 4, 3)}$ beats, giving $${round(val, 3)}$ in all — the common error is to add half the original value again.` : 'Remember the dot adds half the note\'s own value, not a fixed number of beats.'}`])
  }
}

// TH2 — 小節內剩餘拍數
for (const [top, bottom] of [[4, 4], [3, 4], [2, 4], [6, 8], [5, 4]] as Array<[number, number]>) {
  for (const used of [0.5, 1, 1.5, 2, 2.5, 3]) {
    const total = bottom === 8 ? top / 2 : top
    const left = total - used
    if (left <= 0) continue
    const d = distract(left, [total + used, used, total, left / 2])
    if (d.length < 3) continue
    b.add(`musb_th2_${top}${bottom}_${String(used).replace('.', '')}`, T.theory, FW.apply, bottom === 4 ? 'easy' : 'medium',
      [`在 ${top}/${bottom} 拍子中（以四分音符為一拍計算），某小節已寫入合共 ${used} 拍。仍須補入多少拍才滿一小節？`,
       `In ${top}/${bottom} time, counting the crotchet as one beat, a bar already contains ${used} beats. How many more beats are needed to complete it?`],
      [n(`$${round(left, 3)}$`), ...d.map((v) => n(`$${round(v, 3)}$`))],
      [`${top}/${bottom} 拍子每小節${bottom === 8 ? `有 ${top} 個八分音符，折合 ${total} 個四分音符拍` : `有 ${top} 拍`}。已用 ${used} 拍，故尚欠 $${total} - ${used} = ${round(left, 3)}$ 拍。要留意分母代表【以哪一種音符為一拍】：6/8 的分母 8 指八分音符，換算成四分音符拍時要除以 2，這一步是複拍子題最常見的失分位。`,
       `A bar of ${top}/${bottom} contains ${bottom === 8 ? `${top} quavers, equivalent to ${total} crotchet beats` : `${top} beats`}. With ${used} already used, $${total} - ${used} = ${round(left, 3)}$ beats remain. Note that the lower figure states WHICH NOTE COUNTS AS ONE BEAT: the 8 in 6/8 means a quaver, so converting to crotchet beats requires dividing by two — the step where compound-time questions are most often lost.`])
  }
}

// ── 音樂元素（目標約 40 條）────────────────────────────────────────────────

// EL1 — 力度記號由弱至強的次序
const dyn: Array<[string, string, number]> = [
  ['pp', 'pianissimo', 1], ['p', 'piano', 2], ['mp', 'mezzo-piano', 3],
  ['mf', 'mezzo-forte', 4], ['f', 'forte', 5], ['ff', 'fortissimo', 6],
]
for (const [sym, name, rank] of dyn) {
  for (const other of dyn) {
    if (other[2] === rank) continue
    if (Math.abs(other[2] - rank) > 2) continue
    const louder = rank > other[2] ? sym : other[0]
    const opts: Array<[string, string]> = [
      [`${louder} 較響`, `${louder} is louder`],
      [`${louder === sym ? other[0] : sym} 較響`, `${louder === sym ? other[0] : sym} is louder`],
      ['兩者響度相同', 'the two are equally loud'],
      ['須視乎樂器而定，記號本身不表示響度', 'it depends on the instrument; the marking itself indicates nothing'],
    ]
    b.add(`musb_el1_${sym}_${other[0]}`, T.elements, FW.apply, 'easy',
      [`力度記號 ${sym}（${name}）與 ${other[0]}（${other[1]}）相比，哪一個較響？`,
       `Comparing the dynamic markings ${sym} (${name}) and ${other[0]} (${other[1]}), which is louder?`],
      opts,
      [`力度記號由弱至強的次序為 pp → p → mp → mf → f → ff。${sym} 排第 ${rank}，${other[0]} 排第 ${other[2]}，故 ${louder} 較響。要留意 mezzo（m）表示「中等」：mp 比 p 響，mf 比 f 弱——加了 m 之後向中間靠攏，而非單純加強。力度是【相對】的，同一個 f 在獨奏與樂團之中的實際音量並不相同，但記號之間的相對次序不變。`,
       `The dynamic markings run from soft to loud as pp → p → mp → mf → f → ff. Here ${sym} is ${rank}th and ${other[0]} is ${other[2]}th, so ${louder} is louder. Note that mezzo (m) means "moderately": mp is louder than p, and mf is softer than f — adding the m moves the marking towards the middle rather than intensifying it. Dynamics are RELATIVE: the same f is not the same absolute volume in a solo and in an orchestra, but the order between markings never changes.`])
  }
}

// EL2 — 速度標記與每分鐘拍數
const tempi: Array<[string, string, number, number]> = [
  ['Largo', '廣板', 40, 60], ['Adagio', '柔板', 66, 76], ['Andante', '行板', 76, 108],
  ['Moderato', '中板', 108, 120], ['Allegro', '快板', 120, 168], ['Presto', '急板', 168, 200],
]
for (const [it, zh, lo, hi] of tempi) {
  for (const bpm of [lo + 3, Math.round((lo + hi) / 2), hi - 3]) {
    const others = tempi.filter((t) => t[0] !== it).slice(0, 3)
    b.add(`musb_el2_${it}_${bpm}`, T.elements, FW.logic, bpm === lo + 3 ? 'easy' : 'medium',
      [`某樂曲標示的速度為每分鐘 ${bpm} 拍。以下哪一個速度術語最切合？`,
       `A piece is marked at ${bpm} beats per minute. Which tempo term best fits?`],
      [[`${it}（${zh}）`, it], ...others.map((t) => [`${t[0]}（${t[1]}）`, t[0]] as [string, string])],
      [`${it}（${zh}）的常見範圍約為每分鐘 ${lo} 至 ${hi} 拍，${bpm} 落在此範圍之內。速度術語源自意大利文，本身描述的是【性格】而非精確數字——Andante 原意為「行走」，Allegro 原意為「歡快」。故不同版本標示的數值範圍略有出入，考試以常見範圍為準，而演奏時仍須顧及樂曲的風格與時期。`,
       `${it} (${zh}) normally spans about ${lo} to ${hi} beats per minute, and ${bpm} falls within it. Tempo terms come from Italian and describe CHARACTER rather than exact figures — Andante originally means "walking" and Allegro "cheerful". Published ranges therefore differ slightly between editions; examinations use the common ranges, while performance must also weigh the style and period of the music.`])
  }
}

// ── 和聲・和弦與曲式（目標約 45 條）────────────────────────────────────────

// HA1 — 三和弦的組成（半音數）
const roots = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
for (const r of roots) {
  for (const quality of ['大三和弦', '小三和弦', '減三和弦', '增三和弦']) {
    const spec: Record<string, [number, number]> = {
      '大三和弦': [4, 7], '小三和弦': [3, 7], '減三和弦': [3, 6], '增三和弦': [4, 8],
    }
    const [third, fifth] = spec[quality]
    const opts: Array<[string, string]> = Object.entries(spec).map(([q, [a, c]]) =>
      [`根音上方 ${a} 個半音與 ${c} 個半音`, `${a} and ${c} semitones above the root`] as [string, string])
    const correct = opts.find((o) => o[0] === `根音上方 ${third} 個半音與 ${fifth} 個半音`)!
    const rest = opts.filter((o) => o !== correct).slice(0, 3)
    b.add(`musb_ha1_${r}_${quality}`, T.harmony, FW.apply, quality === '大三和弦' || quality === '小三和弦' ? 'medium' : 'hard',
      [`以 ${r} 為根音的${quality}，其第三音與第五音分別在根音上方多少個半音？`,
       `For a ${quality === '大三和弦' ? 'major' : quality === '小三和弦' ? 'minor' : quality === '減三和弦' ? 'diminished' : 'augmented'} triad on ${r}, how many semitones above the root are the third and the fifth?`],
      [correct, ...rest],
      [`四種三和弦的半音結構固定：大三和弦 4 + 7、小三和弦 3 + 7、減三和弦 3 + 6、增三和弦 4 + 8。${quality}故為根音上方 ${third} 與 ${fifth} 個半音。記憶方法：先看第五音——純五度（7 半音）者為大或小，減三和弦的五音降低半音（6），增三和弦的五音升高半音（8）；再看第三音是大三度（4）還是小三度（3），即可完全區分四者。`,
       `The four triad types have fixed semitone structures: major 4 + 7, minor 3 + 7, diminished 3 + 6, augmented 4 + 8. This one is therefore ${third} and ${fifth} semitones above the root. A reliable method: look at the fifth first — a perfect fifth (7) means major or minor, a diminished triad flattens it to 6 and an augmented triad sharpens it to 8; then check whether the third is major (4) or minor (3), which separates all four.`])
  }
}

// HA2 — 大調音階級數上的和弦性質
for (const deg of [1, 2, 3, 4, 5, 6, 7]) {
  const quality = [1, 4, 5].includes(deg) ? '大三和弦' : deg === 7 ? '減三和弦' : '小三和弦'
  const qEn = quality === '大三和弦' ? 'major' : quality === '小三和弦' ? 'minor' : 'diminished'
  const opts: Array<[string, string]> = [
    ['大三和弦', 'major'], ['小三和弦', 'minor'], ['減三和弦', 'diminished'], ['增三和弦', 'augmented'],
  ]
  const correct = opts.find((o) => o[0] === quality)!
  b.add(`musb_ha2_${deg}`, T.harmony, FW.logic, deg === 7 ? 'hard' : [1, 4, 5].includes(deg) ? 'easy' : 'medium',
    [`在自然大調音階之上，建立於第 ${deg} 級的三和弦屬哪一種性質？`,
     `In a natural major scale, what is the quality of the triad built on degree ${deg}?`],
    [correct, ...opts.filter((o) => o !== correct).slice(0, 3)],
    [`大調各級三和弦的性質固定：第一、四、五級為大三和弦，第二、三、六級為小三和弦，第七級為減三和弦。第 ${deg} 級因而是${quality}。這個排列並非規定，而是由音階本身的全音與半音分佈自然產生——把音階的音按三度疊置，各級之間的音程結構自然不同。掌握此表之後，功能和聲的分析（主、下屬、屬）便有了基礎。`,
     `The triad qualities in a major key are fixed: degrees 1, 4 and 5 are major, degrees 2, 3 and 6 are minor, and degree 7 is diminished. Degree ${deg} is therefore ${qEn}. This pattern is not a rule imposed from outside but follows from the distribution of tones and semitones in the scale itself: stacking scale notes in thirds produces different interval structures at each degree. Once this table is secure, functional analysis (tonic, subdominant, dominant) has a foundation.`])
}

// ── 樂器與合奏（目標約 40 條）──────────────────────────────────────────────

// IS1 — 移調樂器：記譜音與實音的關係
const transposing: Array<[string, string, number, string]> = [
  ['降 B 調單簧管', 'B♭ clarinet', 2, '大二度'],
  ['降 B 調小號', 'B♭ trumpet', 2, '大二度'],
  ['F 調圓號', 'F horn', 7, '純五度'],
  ['降 E 調中音薩克管', 'E♭ alto saxophone', 9, '大六度'],
]
for (const [zh, en, semi, intv] of transposing) {
  for (const note of ['C', 'D', 'F', 'G', 'A']) {
    b.add(`musb_is1_${en.slice(0, 6)}_${note}`, T.inst, FW.apply, 'hard',
      [`${zh}屬移調樂器，其記譜音較實際發出的音高${intv}。若要令它發出 ${note} 音，記譜應寫哪一個音？`,
       `The ${en} is a transposing instrument whose written pitch sounds a ${intv === '大二度' ? 'major second' : intv === '純五度' ? 'perfect fifth' : 'major sixth'} lower. To sound a ${note}, what pitch must be written?`],
      [[`較 ${note} 高${intv}的音`, `a note a ${intv === '大二度' ? 'major second' : intv === '純五度' ? 'perfect fifth' : 'major sixth'} above ${note}`],
       [`較 ${note} 低${intv}的音`, `a note a ${intv === '大二度' ? 'major second' : intv === '純五度' ? 'perfect fifth' : 'major sixth'} below ${note}`],
       [`與 ${note} 相同的音`, `the same note, ${note}`],
       [`較 ${note} 高八度的音`, `a note an octave above ${note}`]],
      [`移調樂器的記譜音與實音相差一個固定音程。${zh}的記譜音比實音高${intv}（${semi} 個半音），故欲得實音 ${note}，記譜就要寫高${intv}的音。判斷方向的方法：樂器名稱中的調號指出「當演奏者看見 C 時實際發出甚麼音」——${zh}看見 C 發出的是比 C 低${intv}的音，可見記譜高於實音，故由實音反推記譜時要【向上】移。`,
       `A transposing instrument's written pitch differs from its sounding pitch by a fixed interval. For the ${en} the written note sounds a ${intv === '大二度' ? 'major second' : intv === '純五度' ? 'perfect fifth' : 'major sixth'} lower (${semi} semitones), so to sound ${note} the part must be written that interval higher. To fix the direction, read the key in the instrument's name as "what sounds when the player sees a C": for the ${en}, a written C sounds lower, so the notation lies above the sounding pitch and working back from sound to notation means transposing UP.`])
  }
}

// IS2 — 弦樂四重奏與樂團編制
for (const [ens, zh, count, members, membersEn] of [
  ['string quartet', '弦樂四重奏', 4, '第一小提琴、第二小提琴、中提琴、大提琴', 'first violin, second violin, viola, cello'],
  ['piano trio', '鋼琴三重奏', 3, '鋼琴、小提琴、大提琴', 'piano, violin, cello'],
  ['woodwind quintet', '木管五重奏', 5, '長笛、雙簧管、單簧管、巴松管、圓號', 'flute, oboe, clarinet, bassoon, horn'],
  ['brass quintet', '銅管五重奏', 5, '兩支小號、圓號、長號、大號', 'two trumpets, horn, trombone, tuba'],
] as Array<[string, string, number, string, string]>) {
  for (const q of ['成員數目', '樂器組合']) {
    if (q === '成員數目') {
      const d = distract(count, [count + 1, count - 1, count + 2])
      if (d.length < 3) continue
      b.add(`musb_is2_${ens.slice(0, 8)}_n`, T.inst, FW.apply, 'easy',
        [`${zh}由多少位演奏者組成？`, `How many players make up a ${ens}?`],
        [qty(count, '位', ''), ...d.map((v) => qty(v, '位', ''))],
        [`${zh}的標準編制為 ${count} 位：${members}。室內樂編制的名稱直接指出人數（三重奏三人、四重奏四人、五重奏五人），但【樂器組合】則按傳統固定，並非任意搭配——這正是下一題要考的部分。`,
         `A ${ens} has ${count} players in its standard form: ${membersEn}. Chamber ensemble names state the number directly (trio three, quartet four, quintet five), but the CHOICE of instruments is fixed by tradition rather than free — which is what the companion question examines.`])
    } else {
      const wrong: Array<[string, string]> = [
        ['兩支小提琴、兩支中提琴', 'two violins and two violas'],
        ['長笛、小提琴、大提琴、鋼琴', 'flute, violin, cello and piano'],
        ['四支同型號的樂器', 'four instruments of the same type'],
      ]
      b.add(`musb_is2_${ens.slice(0, 8)}_c`, T.inst, FW.logic, 'medium',
        [`${zh}的標準樂器組合為何？`, `What is the standard instrumentation of a ${ens}?`],
        [[members, membersEn], wrong[0], wrong[1], wrong[2]],
        [`${zh}的標準組合為${members}。要留意編制之所以固定，是因為它決定了音域的覆蓋與音色的平衡：以弦樂四重奏為例，兩把小提琴、中提琴與大提琴恰好覆蓋高、中、低三個音區，四個聲部可以完整呈現四聲部和聲，這正是它成為作曲家最常用室內樂編制的原因。`,
         `The standard combination is: ${membersEn}. The instrumentation is fixed because it determines the range covered and the balance of timbres. In a string quartet, two violins, a viola and a cello span high, middle and low registers, and the four parts can present four-part harmony complete — which is why it became the chamber medium composers used most.`])
    }
  }
}

// ── 西方音樂史（目標約 36 條）──────────────────────────────────────────────

const periods: Array<[string, string, number, number]> = [
  ['巴洛克時期', 'Baroque', 1600, 1750],
  ['古典時期', 'Classical', 1750, 1820],
  ['浪漫時期', 'Romantic', 1820, 1900],
  ['二十世紀', 'Twentieth-century', 1900, 2000],
]
for (const [zh, en, from, to] of periods) {
  for (const yr of [from + 10, from + 30, Math.round((from + to) / 2), to - 30, to - 10]) {
    const others = periods.filter((p) => p[0] !== zh).slice(0, 3)
    b.add(`musb_wh1_${en}_${yr}`, T.west, FW.logic, 'medium',
      [`一首創作於 ${yr} 年的西方藝術音樂作品，最可能屬於哪一個時期？`,
       `A work of Western art music composed in ${yr} most likely belongs to which period?`],
      [[`${zh}（約 ${from}–${to}）`, `${en} (c. ${from}–${to})`],
       ...others.map((p) => [`${p[0]}（約 ${p[2]}–${p[3]}）`, `${p[1]} (c. ${p[2]}–${p[3]})`] as [string, string])],
      [`${yr} 年落在${zh}（約 ${from} 至 ${to} 年）之內。要留意時期的分界是【後人歸納】而非當時的規定，故各書所載年份略有出入，且交界前後數十年往往風格並存——例如貝多芬跨越古典與浪漫兩期，其作品無法乾淨地劃入其一。答這類題應以常見分期為準，同時明白分期是理解風格演變的工具，而非硬性的界線。`,
       `The year ${yr} falls within the ${en} period (about ${from}–${to}). Note that period boundaries are a LATER GENERALISATION rather than a rule observed at the time, so published dates differ slightly and styles overlap for decades around each boundary — Beethoven straddles Classical and Romantic, and his output cannot be assigned cleanly to either. Use the common divisions when answering, while understanding that periodisation is a tool for grasping stylistic change, not a hard line.`])
  }
}

// ── 中國音樂（目標約 35 條）────────────────────────────────────────────────

// CM1 — 五聲音階
const pentatonic: Array<[string, string, number]> = [
  ['宮', 'gong', 0], ['商', 'shang', 2], ['角', 'jue', 4], ['徵', 'zhi', 7], ['羽', 'yu', 9],
]
for (const [zh, py, semi] of pentatonic) {
  for (const key of ['C', 'D', 'F', 'G', 'A', 'B', 'E']) {
    const d = pentatonic.filter((p) => p[2] !== semi).slice(0, 3)
    b.add(`musb_cm1_${py}_${key}`, T.chin, FW.apply, key === 'C' || key === 'G' ? 'easy' : 'medium',
      [`以 ${key} 為宮音的五聲音階中，「${zh}」音在宮音上方多少個半音？`,
       `In a pentatonic scale with ${key} as gong, how many semitones above gong does "${zh}" (${py}) lie?`],
      [qty(semi, '個半音', 'semitones'), ...d.map((p) => qty(p[2], '個半音', 'semitones'))],
      [`中國五聲音階由宮、商、角、徵、羽五音組成，各音在宮音上方的半音數固定為 0、2、4、7、9，故「${zh}」為 ${semi} 個半音。此音階最顯著的特徵是【不含半音關係】——五個音彼此相隔至少一個全音，因而沒有西方大調中導音向主音的強烈傾向，旋律的走向也因此較為平和開闊。`,
       `The Chinese pentatonic scale comprises gong, shang, jue, zhi and yu, lying a fixed 0, 2, 4, 7 and 9 semitones above gong, so "${zh}" is ${semi}. The scale's defining feature is that it contains NO SEMITONE STEPS: every pair of adjacent notes is at least a whole tone apart, so there is no leading note pulling towards a tonic as in a Western major key, and melodic movement is correspondingly more open and less directed.`])
  }
}

// ── 聆聽與分析（目標約 36 條）──────────────────────────────────────────────

// LI1 — 由拍速與小節數推算時長
for (const bpm of [60, 72, 90, 100, 120, 144]) {
  for (const bars of [8, 12, 16, 24, 32]) {
    for (const beatsPerBar of [3, 4]) {
      const sec = Number((((bars * beatsPerBar * 60) / bpm)).toFixed(1))
      const d = distract(sec, [bars * beatsPerBar, sec * 2, bars * bpm / 60])
      if (d.length < 3) continue
      b.add(`musb_li1_${bpm}_${bars}_${beatsPerBar}`, T.listen, FW.apply, bpm === 60 || bpm === 120 ? 'easy' : 'medium',
        [`某段音樂為每小節 ${beatsPerBar} 拍，速度為每分鐘 ${bpm} 拍，全段共 ${bars} 小節。這段音樂約需演奏多少秒？`,
         `A passage is in ${beatsPerBar} beats to the bar at ${bpm} beats per minute and runs for ${bars} bars. Approximately how many seconds does it last?`],
        [qty(sec, '秒', 's'), ...d.map((v) => qty(round(v, 1), '秒', 's'))],
        [`總拍數 = 小節數 × 每小節拍數 = $${bars} \\times ${beatsPerBar} = ${bars * beatsPerBar}$ 拍。每拍所需時間 = $\\dfrac{60}{${bpm}}$ 秒，故總時長 = $${bars * beatsPerBar} \\times \\dfrac{60}{${bpm}} = ${sec}$ 秒。此式在編曲與錄音時常用：要令一段音樂配合固定長度的畫面，可反過來由目標秒數推算所需的小節數或速度。`,
         `Total beats = bars × beats per bar = $${bars} \\times ${beatsPerBar} = ${bars * beatsPerBar}$. Each beat lasts $\\dfrac{60}{${bpm}}$ seconds, so the passage runs $${bars * beatsPerBar} \\times \\dfrac{60}{${bpm}} = ${sec}$ seconds. The relationship is used constantly in arranging and recording: to fit music to a fixed length of film, the calculation is simply run backwards to find the tempo or number of bars required.`])
    }
  }
}

// ── 創作與演奏（目標約 35 條）──────────────────────────────────────────────

// CR1 — 移調後的調號
const keySharps: Array<[string, number]> = [
  ['C', 0], ['G', 1], ['D', 2], ['A', 3], ['E', 4], ['B', 5], ['F♯', 6],
]
for (const [k, sharps] of keySharps) {
  for (const steps of [1, 2, 3, 4, 5]) {
    const newSharps = (sharps + steps) % 12
    if (newSharps > 6) continue
    const target = keySharps.find((x) => x[1] === newSharps)
    if (!target) continue
    const d = distract(newSharps, [sharps, sharps + steps + 1, Math.abs(sharps - steps)])
    if (d.length < 3) continue
    b.add(`musb_cr1_${k}_${steps}`, T.create, FW.apply, 'hard',
      [`一首樂曲原為 ${k} 大調。若把它沿五度圈向升號方向移調 ${steps} 個位置，新調的調號有多少個升號？`,
       `A piece is in ${k} major. Moving it ${steps} position${steps > 1 ? 's' : ''} clockwise round the circle of fifths, how many sharps does the new key signature carry?`],
      [qty(newSharps, '個升號', 'sharps'), ...d.map((v) => qty(v, '個升號', 'sharps'))],
      [`五度圈每向升號方向移動一個位置，調號便【多一個升號】：${k} 大調有 ${sharps} 個升號，移動 ${steps} 個位置後為 $${sharps} + ${steps} = ${newSharps}$ 個，即 ${target[0]} 大調。移調在實務上有兩個常見用途：遷就歌手的音域，以及配合移調樂器。要留意移調會改變樂曲的音區與樂器音色，故並非純粹的數字運算——同一首曲移高三度之後，弦樂的共鳴與人聲的張力都會不同。`,
       `Each step clockwise round the circle of fifths ADDS ONE SHARP: ${k} major has ${sharps}, so after ${steps} step${steps > 1 ? 's' : ''} the signature has $${sharps} + ${steps} = ${newSharps}$, that is ${target[0]} major. Transposition serves two everyday purposes: fitting a singer's range, and accommodating transposing instruments. Note that it is not merely arithmetic — moving a piece up a third changes the register and hence the resonance of strings and the strain on voices.`])
  }
}

// ── 曲式與結構（目標約 30 條）──────────────────────────────────────────────

// FS1 — 反覆記號後的實際小節數
for (const bars of [4, 8, 12, 16, 24, 32]) {
  for (const times of [2, 3]) {
    for (const coda of [0, 4, 8]) {
      const total = bars * times + coda
      const d = distract(total, [bars + coda, bars * times, bars, total * 2])
      if (d.length < 3) continue
      b.add(`musb_fs1_${bars}_${times}_${coda}`, T.form, FW.apply, coda === 0 ? 'easy' : 'medium',
        [`某段音樂寫有 ${bars} 小節，標明反覆演奏 ${times} 次${coda ? `，其後另有 ${coda} 小節尾聲` : ''}。實際演奏的總小節數是多少？`,
         `A passage of ${bars} bars is marked to be played ${times} times${coda ? `, followed by a ${coda}-bar coda` : ''}. How many bars are actually played?`],
        [qty(total, '小節', 'bars'), ...d.map((v) => qty(v, '小節', 'bars'))],
        [`實際小節數 = 樂段小節 × 演奏次數${coda ? ' + 尾聲小節' : ''} = $${bars} \\times ${times}${coda ? ` + ${coda}` : ''} = ${total}$ 小節。要留意「反覆 ${times} 次」指【合共演奏 ${times} 次】而非在原本之外再加 ${times} 次——這個讀法上的分歧是排練時最常出現的誤會，故總譜通常會另以文字註明。`,
         `Bars played = bars in the section × number of times${coda ? ' + coda' : ''} = $${bars} \\times ${times}${coda ? ` + ${coda}` : ''} = ${total}$. Note that "played ${times} times" means ${times} times IN TOTAL, not ${times} further repeats after the first — the ambiguity is a standard source of confusion in rehearsal, which is why scores usually spell it out in words as well.`])
    }
  }
}

export const musicBank3Questions: Question[] = b.bank
