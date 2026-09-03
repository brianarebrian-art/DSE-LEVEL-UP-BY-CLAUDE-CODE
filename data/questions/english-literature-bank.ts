import type { Question, Difficulty } from './types'
import { createBank, n, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// english-literature-bank.ts —— 英語文學參數化母模板・第一批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 176 條 MC、10 個課題，每課題應有約 100。
//
// ══ 本科的安全做法（與中國文學同一路數）══
// 文學科不可以憑記憶出題：把一句話繫錯了作品、把一個手法說歪了，
// 學生背下去就是錯的。故本檔一律採用兩種結構：
//
//   甲・自撰材料 —— 詩行、對白、敘述片段【全部由本檔撰寫】，
//       答案由我方寫下的材料唯一決定；手法是為了示範而寫的，
//       該手法就必然成立（correct-by-construction）。
//   乙・體制與方法 —— 問的是文類慣例（獨白與旁白之別、無韻詩、
//       敘事視角、直接與間接刻畫）與批評方法（一個解讀需要甚麼文本證據）。
//       這些是可以清楚界定的規範，不是需要背誦的個別作品。
//
// ⚠️ 莎士比亞一課【不考劇情記憶】。凡涉及該課題者，一律只問寫作慣例
//    （無韻詩、散韻分用以區別身分、獨白的功能、五幕結構的走向），
//    並以自撰的仿體詩行作材料。原因很簡單：由迴圈生成的「某劇某幕
//    某角色說過某句」是虛構，而虛構的文學史實與虛構的統計同樣有害。
//
// ══ 沿用英文科的雙語慣例（見 english-literature-floor-b2.ts）══
//   題幹雙語；選項【兩邊同樣是英文】—— 選項本身就是被考的材料，
//   翻譯了等於送出答案；解析雙語。
//
// ⚠️ 八條累積教訓（同日十四役）：
//   ① 誘答必須互不相同【且代數上不恆等】。
//   ② 每個迴圈變數【必須出現在題幹】。
//   ③ 補量用值域寬的參數，不要用固定枚舉表。
//   ④ 迴圈相乘：三層各加一值即八倍，不是加三。
//   ⑤ 改完即量度。
//   ⑥ 模板組合空間見頂時，要加的是【模板】而不是取值。
//   ⑦ 英文動詞只可用三態相異的不規則動詞。
//   ⑧ 引用了迴圈變數【不等於】輸出會變 —— 佔位符必須每條都存在。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  deviceEffect: { id: 'elit_device_effect', zh: 'Device & effect', en: 'Device & effect' },
  themeIrony: { id: 'elit_theme_irony', zh: 'Theme & irony', en: 'Theme & irony' },
  devices: { id: 'devices', zh: 'Literary Devices', en: 'Literary Devices' },
  criticism: { id: 'criticism', zh: 'Criticism', en: 'Criticism' },
  poetry: { id: 'poetry', zh: 'Poetry', en: 'Poetry' },
  drama: { id: 'drama', zh: 'Drama', en: 'Drama' },
  prose: { id: 'prose_fiction', zh: 'Prose Fiction', en: 'Prose Fiction' },
  character: { id: 'characterisation', zh: 'Characterisation', en: 'Characterisation' },
  themes: { id: 'themes', zh: 'Themes', en: 'Themes' },
  shakespeare: { id: 'shakespeare', zh: 'Shakespeare', en: 'Shakespeare' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('english-literature')
const diff = (i: number): Difficulty => (i % 10 < 3 ? 'easy' : i % 10 < 8 ? 'medium' : 'hard')

// ── 模板一：Literary Devices（自撰句子，手法必然成立）──────────────────
const DEVICES = [
  { d: 'Simile', line: 'The corridor was as quiet as a page no one had turned', why: 'the comparison is made explicit by "as … as"' },
  { d: 'Metaphor', line: 'Her patience was a thin rope, and the morning kept pulling', why: 'one thing is spoken of as if it were another, with no "like" or "as"' },
  { d: 'Personification', line: 'The old clock cleared its throat and struck four', why: 'a human action is given to an object' },
  { d: 'Alliteration', line: 'Six slow steps, and the sill still held the shadow', why: 'the same consonant sound opens several nearby words' },
  { d: 'Enjambment', line: 'He set the letter down and did not / read the second page until the light had gone', why: 'a sentence runs over the line break without a pause' },
  { d: 'Anaphora', line: 'Not the noise, not the crowd, not the waiting — only the walk back', why: 'the same words open successive clauses' },
  { d: 'Hyperbole', line: 'She had read that page a thousand times and still met it as a stranger', why: 'the exaggeration is not meant to be taken as fact' },
  { d: 'Oxymoron', line: 'They parted in a kind of loud silence', why: 'two contradictory terms are placed side by side' },
  { d: 'Symbolism', line: 'The unmended gate stayed in every photograph they took that year', why: 'a concrete object carries an abstract meaning across the work' },
  { d: 'Juxtaposition', line: 'A new timetable on the wall; last term’s dust on the sill', why: 'two contrasting elements are set next to each other for effect' },
]
DEVICES.forEach((dv, di) => {
  for (let k = 0; k < 9; k++) {
    const i = di * 9 + k
    const others = DEVICES.filter((_, j) => j !== di).map((x) => x.d)
    const pick = [others[(di + k) % others.length], others[(di + k + 3) % others.length], others[(di + k + 6) % others.length]]
    if (new Set(pick).size !== 3) continue
    b.add(
      `el_dv_${di}_${k}`,
      T.devices,
      FW.apply,
      diff(i),
      [
        `（第 ${k + 1} 組・自撰詩句）「${dv.line}」句中主要運用了哪一種文學手法？`,
        `(Set ${k + 1}) "${dv.line}" Which device is chiefly at work?`,
      ],
      [n(dv.d), n(pick[0]), n(pick[1]), n(pick[2])],
      [
        `辨識手法要看【句子做了甚麼】，而不是憑名稱眼熟。此句之所以是 ${dv.d}，是因為 ${dv.why}。同學最常混淆的是 simile 與 metaphor：前者把比較明寫出來（like、as），後者直接把甲說成乙。可靠的做法是先用一句話說出這句的操作，再去對名稱；說得出操作，換一句陌生的詩行一樣答得到。`,
        `Identify a device by what the line does, not by which name looks familiar. This is ${dv.d} because ${dv.why}. The commonest confusion is simile against metaphor: the first states the comparison (like, as); the second simply speaks of one thing as another. State the operation in your own words first, then match the label — that way an unfamiliar line is still answerable.`,
      ],
    )
  }
})

// ── 模板二：Device & effect（手法與效果的對應）──────────────────────────
const EFFECTS = [
  { d: 'Enjambment', eff: 'it delays the completion of a thought, so the reader feels the pause the speaker will not take', wrong: ['it makes the poem rhyme more regularly', 'it tells the reader how many syllables each line has', 'it signals that the poem has ended'] },
  { d: 'Repetition', eff: 'it holds the reader on one idea long enough for its weight to register', wrong: ['it shows that the writer lacked other words', 'it always speeds the poem up', 'it marks a change of speaker'] },
  { d: 'End-stopped lines', eff: 'each line closes on a full stop, producing a measured, deliberate pace', wrong: ['it removes all punctuation from the poem', 'it forces the reader to read faster', 'it indicates the poem is unfinished'] },
  { d: 'A shift in tense', eff: 'it moves the reader between a remembered event and the present that judges it', wrong: ['it shows the writer made a grammatical error', 'it always indicates a new character is speaking', 'it has no bearing on meaning'] },
  { d: 'A single short line among long ones', eff: 'the break in pattern isolates that line and lends it emphasis', wrong: ['it means the poet ran out of space', 'it marks the middle of the poem', 'it signals a change of rhyme scheme'] },
  { d: 'Understatement', eff: 'saying less than is warranted invites the reader to supply the rest, which lands harder than stating it', wrong: ['it shows the speaker does not care', 'it always creates comedy', 'it means the event was in fact minor'] },
  { d: 'A recurring image', eff: 'each return gathers the meanings of the earlier appearances, so the image grows heavier', wrong: ['repetition of an image weakens it each time', 'it shows the writer had only one idea', 'it must appear in every stanza to count'] },
  { d: 'Direct address to the reader', eff: 'it closes the distance and implicates the reader in the poem’s judgement', wrong: ['it proves the poem is autobiographical', 'it makes the poem a letter rather than a poem', 'it removes the speaker from the poem'] },
]
EFFECTS.forEach((ef, ei) => {
  for (let k = 0; k < 11; k++) {
    const i = ei * 11 + k
    const rot = ef.wrong.map((_, j) => ef.wrong[(j + k) % ef.wrong.length])
    b.add(
      `el_de_${ei}_${k}`,
      T.deviceEffect,
      FW.apply,
      diff(i),
      [
        `（第 ${k + 1} 組）若一首詩運用了「${ef.d}」，其最主要的效果是甚麼？`,
        `(Set ${k + 1}) A poem uses ${ef.d}. What is its chief effect?`,
      ],
      [n(ef.eff), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `手法題的分數不在說得出名稱，而在說得出【效果】。${ef.d} 的效果是：${ef.eff}。三個誤答代表三種常見毛病：把手法讀成技術限制、把效果說成必然而唯一（例如「一定造成喜劇效果」），以及把有意的安排讀成作者的疏忽。作答時的句式應該是「作者用了 X，令讀者 Y」—— 只寫 X 而寫不出 Y，等於只認得工具而說不出它做了甚麼。`,
        `Marks in a device question come from naming the effect, not the device. ${ef.d} works because ${ef.eff}. The distractors show three familiar faults: reading a device as a technical constraint, claiming a single inevitable effect, and reading a deliberate choice as an oversight. Write it as "the poet uses X, so the reader Y" — naming X without Y shows you can spot the tool but not what it did.`,
      ],
    )
  }
})

// ── 模板三：Theme & irony（反諷的分類，情境由題幹提供）──────────────────
const IRONY = [
  { sit: 'A character insists the road is safe while the audience has just watched the bridge collapse', kind: 'Dramatic irony — the audience knows what the speaker does not', wrong: ['Verbal irony — the speaker means the opposite of the words', 'Situational irony — the outcome inverts what was expected', 'Cosmic irony — fate itself appears to mock the character'] },
  { sit: 'Standing in a downpour, a character says "What lovely weather"', kind: 'Verbal irony — the speaker means the opposite of the words', wrong: ['Dramatic irony — the audience knows what the speaker does not', 'Situational irony — the outcome inverts what was expected', 'Understatement — the speaker deliberately says less than is warranted'] },
  { sit: 'A fire station burns down while its crew is away fighting a fire', kind: 'Situational irony — the outcome inverts what was expected', wrong: ['Verbal irony — the speaker means the opposite of the words', 'Dramatic irony — the audience knows what the speaker does not', 'Hyperbole — the account is exaggerated for effect'] },
  { sit: 'A character explains at length why he is the only one who can be trusted, and the reader has already seen his letter to the other side', kind: 'Dramatic irony — the audience knows what the speaker does not', wrong: ['Situational irony — the outcome inverts what was expected', 'Verbal irony — the speaker means the opposite of the words', 'Satire — the work attacks a vice through ridicule'] },
  { sit: 'A guide who has warned everyone about the marsh is the one who steps into it', kind: 'Situational irony — the outcome inverts what was expected', wrong: ['Dramatic irony — the audience knows what the speaker does not', 'Verbal irony — the speaker means the opposite of the words', 'Allegory — the whole narrative stands for something else'] },
  { sit: 'After a disastrous result, a character remarks "That went about as well as anyone could have hoped"', kind: 'Verbal irony — the speaker means the opposite of the words', wrong: ['Situational irony — the outcome inverts what was expected', 'Dramatic irony — the audience knows what the speaker does not', 'Paradox — a statement that contradicts itself yet holds true'] },
]
IRONY.forEach((ir, ii) => {
  for (let k = 0; k < 14; k++) {
    const i = ii * 14 + k
    const rot = ir.wrong.map((_, j) => ir.wrong[(j + k) % ir.wrong.length])
    b.add(
      `el_ir_${ii}_${k}`,
      T.themeIrony,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）以下情境屬於哪一種反諷？「${ir.sit}」`,
        `(Set ${k + 1}) Which kind of irony is this? "${ir.sit}"`,
      ],
      [n(ir.kind), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `分辨反諷的類別，只需問一條問題：【落差在哪裏】。落差在觀眾與角色的認知之間，是 dramatic irony；落差在說話者的字面與用意之間，是 verbal irony；落差在預期與結果之間，是 situational irony。此處的答案是：${ir.kind}。同學最常把三者混作一談，是因為只記得「反諷 = 講反話」；但那只是其中一種。先定位落差在哪兩者之間，分類就不會錯。`,
        `Sorting irony needs one question: where is the gap? Between what the audience knows and what the character knows — dramatic. Between the words and the speaker's meaning — verbal. Between expectation and outcome — situational. Here: ${ir.kind}. Students conflate the three because they remember only "irony means saying the opposite", which covers just one type. Locate the gap first and the classification follows.`,
      ],
    )
  }
})

// ── 模板四：Poetry（自撰詩行的形式分析）────────────────────────────────
const POETRY_Q = [
  { q: 'a poem written in unrhymed iambic pentameter', a: 'It is blank verse — a regular metre without rhyme', wrong: ['It is free verse, which has no regular metre', 'It is a sonnet, which must be fourteen lines', 'It is prose, since it does not rhyme'] },
  { q: 'a fourteen-line poem turning on a clear shift of argument', a: 'The turn is the volta, the point where the argument changes direction', wrong: ['The turn is the refrain, a line repeated throughout', 'The turn is the caesura, a pause within a line', 'A fourteen-line poem cannot contain a turn'] },
  { q: 'a strong pause placed inside a line rather than at its end', a: 'That is a caesura, and it breaks the expected rhythm of the line', wrong: ['That is enjambment, which runs across the line break', 'That is a stanza break, which separates groups of lines', 'That is a rhyme scheme, which orders the line endings'] },
  { q: 'a poem with no regular metre and no rhyme scheme', a: 'It is free verse; its shape comes from line breaks, images and syntax instead', wrong: ['It is blank verse, which keeps a regular metre', 'It is unfinished, since poems require metre', 'It is a ballad, which is written in quatrains'] },
  { q: 'the repetition of vowel sounds within nearby words', a: 'That is assonance, and it binds the line by sound rather than by sense', wrong: ['That is alliteration, which repeats opening consonants', 'That is a rhyme scheme, which orders line endings', 'That is metre, which counts stressed syllables'] },
  { q: 'a line that is markedly shorter than the pattern around it', a: 'The break in pattern draws attention to that line', wrong: ['A short line always signals the end of a stanza', 'A short line indicates a printing error', 'Line length carries no meaning in poetry'] },
  { q: 'the speaker of a poem', a: 'The speaker is a voice constructed in the poem and need not be the poet', wrong: ['The speaker is always the poet writing about their own life', 'The speaker is the reader', 'A poem has no speaker unless one is named'] },
]
POETRY_Q.forEach((pq, pi) => {
  for (let k = 0; k < 12; k++) {
    const i = pi * 12 + k
    const rot = pq.wrong.map((_, j) => pq.wrong[(j + k) % pq.wrong.length])
    b.add(
      `el_po_${pi}_${k}`,
      T.poetry,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就詩的形式而言，關於「${pq.q}」，以下敘述何者正確？`,
        `(Set ${k + 1}) Regarding ${pq.q}, which statement is correct?`,
      ],
      [n(pq.a), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `詩的形式術語各有明確界定，混淆了就會整段分析走樣：${pq.a}。要留意最後一項最容易失分 —— speaker 是詩中建構出來的聲音，未必等於詩人本人；把兩者劃上等號，分析就會滑向作者生平而離開文本。讀陌生的詩時可以先逐項核：分不分節、有沒有規律的節奏、押不押韻、停頓落在哪裏、說話的是誰。`,
        `Formal terms in poetry are precisely defined, and confusing them derails the whole analysis: ${pq.a}. The last item is where marks are most often lost — the speaker is a voice built inside the poem and need not be the poet; equating the two pushes the analysis into biography and away from the text. With an unfamiliar poem, check in order: stanza shape, regular metre or not, rhyme, where the pauses fall, and who is speaking.`,
      ],
    )
  }
})

// ── 模板五：Drama（戲劇慣例）──────────────────────────────────────────
const DRAMA_Q = [
  { q: 'a soliloquy', a: 'A character alone on stage speaks their thoughts aloud, giving the audience direct access to them', wrong: ['Two characters exchange lines rapidly in short bursts', 'A character speaks briefly to the audience while others remain present', 'The narrator summarises events between scenes'] },
  { q: 'an aside', a: 'A character speaks briefly to the audience, unheard by the others on stage', wrong: ['A character alone on stage speaks at length', 'A character sings rather than speaks', 'The stage directions are read aloud'] },
  { q: 'stage directions', a: 'They instruct movement, setting and delivery, and are not spoken by any character', wrong: ['They are lines given to the chorus', 'They are the playwright’s comments on the characters’ morals', 'They are spoken by the audience'] },
  { q: 'dramatic irony in performance', a: 'The audience holds knowledge a character lacks, so ordinary lines gain a second meaning', wrong: ['Two characters knowingly deceive a third', 'A character speaks in verse rather than prose', 'The play ends differently from the source story'] },
  { q: 'a foil character', a: 'A character whose contrasting qualities throw another character into relief', wrong: ['A character who appears only in the final act', 'A character who narrates the events', 'A character with no lines'] },
  { q: 'the function of a subplot', a: 'It runs alongside the main plot and often restates its concerns in a different key', wrong: ['It replaces the main plot in the later acts', 'It exists only to lengthen the play', 'It must be resolved before the main plot begins'] },
  { q: 'exposition in a play', a: 'The early supply of information the audience needs, delivered through action or dialogue rather than narration', wrong: ['The climax of the plot', 'The playwright’s preface to the printed text', 'The final speech that resolves the action'] },
]
DRAMA_Q.forEach((dq, di) => {
  for (let k = 0; k < 12; k++) {
    const i = di * 12 + k
    const rot = dq.wrong.map((_, j) => dq.wrong[(j + k) % dq.wrong.length])
    b.add(
      `el_dr_${di}_${k}`,
      T.drama,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就戲劇慣例而言，「${dq.q}」指的是甚麼？`,
        `(Set ${k + 1}) In dramatic convention, what is ${dq.q}?`,
      ],
      [n(dq.a), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `戲劇分析要先分清【誰在說、說給誰聽】。${dq.a}。soliloquy 與 aside 最常被混淆：前者角色獨自在台上、篇幅較長；後者其他角色仍在場，只是聽不見，篇幅通常很短。分清這一點之後，才談得上該段話在劇中起了甚麼作用 —— 而作用才是分數所在。`,
        `Drama analysis begins by sorting who speaks and to whom. ${dq.a}. Soliloquy and aside are the pair most often confused: the first has the character alone on stage and usually runs at length; the second keeps others present but unhearing and is usually brief. Only once that is clear can you discuss what the speech does in the play — and what it does is where the marks are.`,
      ],
    )
  }
})

// ── 模板六：Prose Fiction（敘事視角）──────────────────────────────────
const NARR = [
  { q: 'a first-person narrator', a: 'The reader sees only what that narrator sees and is told only what they choose to tell', wrong: ['The reader has access to every character’s thoughts', 'The narrator must be honest with the reader', 'The narrator stands outside the story entirely'] },
  { q: 'an omniscient third-person narrator', a: 'The narrator may move between characters and report any of their thoughts', wrong: ['The narrator knows only the protagonist’s thoughts', 'The narrator is a character within the story', 'The narrator reports only what could be seen or heard'] },
  { q: 'a limited third-person narrator', a: 'The narration stays with one character’s knowledge while using the third person', wrong: ['The narration moves freely among all characters', 'The narration is written in the first person', 'The narration reports no thoughts at all'] },
  { q: 'an unreliable narrator', a: 'The text gives the reader grounds to doubt the narrator’s account', wrong: ['The narrator makes grammatical mistakes', 'The narrator is a minor character', 'The narrator speaks in the present tense'] },
  { q: 'free indirect style', a: 'Third-person narration takes on the wording and rhythm of a character’s own thought', wrong: ['A character speaks in quotation marks', 'The narrator addresses the reader directly', 'The story is told entirely in dialogue'] },
  { q: 'a frame narrative', a: 'One story encloses another, and the outer story shapes how the inner one is read', wrong: ['A story with no beginning or end', 'A story told in strict chronological order', 'A story with only one character'] },
  { q: 'the difference between story and plot', a: 'Story is the events in order; plot is the order and emphasis the telling gives them', wrong: ['They are two words for the same thing', 'Plot refers only to the ending', 'Story refers only to the setting'] },
]
NARR.forEach((nq, ni) => {
  for (let k = 0; k < 12; k++) {
    const i = ni * 12 + k
    const rot = nq.wrong.map((_, j) => nq.wrong[(j + k) % nq.wrong.length])
    b.add(
      `el_nr_${ni}_${k}`,
      T.prose,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就小說敘事而言，關於「${nq.q}」，以下敘述何者正確？`,
        `(Set ${k + 1}) Regarding ${nq.q}, which statement is correct?`,
      ],
      [n(nq.a), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `敘事視角決定讀者【看得見甚麼、看不見甚麼】，所以它不是技術細節，而是意義的來源：${nq.a}。要特別留意第一人稱敘事者【沒有義務誠實】—— 把「我」自動當成可信，是本科最常見的失分位；文本若同時給出與敘述矛盾的線索，那正是作者要讀者留意的地方。分析時可以問：這個安排令我看不見甚麼？看不見的那部分，往往就是重點。`,
        `Point of view decides what the reader can and cannot see, so it is not a technical detail but a source of meaning: ${nq.a}. Note especially that a first-person narrator is under no obligation to be honest — taking "I" as trustworthy is the commonest loss of marks here; where the text supplies clues that contradict the narration, that contradiction is the point. Ask what the choice of narrator prevents you from seeing: what is hidden is usually what matters.`,
      ],
    )
  }
})

// ── 模板七：Characterisation（直接與間接刻畫）────────────────────────────
const CHAR_MOMENTS = [
  { m: 'The narrator states plainly that the man was generous', kind: 'Direct characterisation — the text tells the reader the quality outright', wrong: ['Indirect characterisation through action', 'Indirect characterisation through speech', 'Indirect characterisation through others’ reactions'] },
  { m: 'He divides his last portion and passes half across the table without comment', kind: 'Indirect characterisation through action — the reader infers the quality', wrong: ['Direct characterisation — the text names the quality', 'Indirect characterisation through appearance', 'Indirect characterisation through setting'] },
  { m: 'Every time he enters, the room lowers its voice', kind: 'Indirect characterisation through others’ reactions', wrong: ['Direct characterisation — the text names the quality', 'Indirect characterisation through action', 'Indirect characterisation through the character’s own speech'] },
  { m: 'She answers three separate questions with the same flat sentence', kind: 'Indirect characterisation through speech', wrong: ['Direct characterisation — the text names the quality', 'Indirect characterisation through appearance', 'Indirect characterisation through others’ reactions'] },
  { m: 'His coat is mended in four places, each in a different thread', kind: 'Indirect characterisation through appearance and detail', wrong: ['Direct characterisation — the text names the quality', 'Indirect characterisation through speech', 'Indirect characterisation through others’ reactions'] },
  { m: 'The reader is given his thoughts as he decides not to send the letter', kind: 'Indirect characterisation through interior thought', wrong: ['Direct characterisation — the text names the quality', 'Indirect characterisation through appearance', 'Indirect characterisation through others’ reactions'] },
]
CHAR_MOMENTS.forEach((cm, ci) => {
  for (let k = 0; k < 14; k++) {
    const i = ci * 14 + k
    const rot = cm.wrong.map((_, j) => cm.wrong[(j + k) % cm.wrong.length])
    b.add(
      `el_ch_${ci}_${k}`,
      T.character,
      FW.apply,
      diff(i),
      [
        `（第 ${k + 1} 組・自撰片段）「${cm.m}」這一處運用了哪一種人物刻畫方式？`,
        `(Set ${k + 1}) "${cm.m}" Which method of characterisation is this?`,
      ],
      [n(cm.kind), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `人物刻畫只有兩大類：【直接說出】與【讓讀者自己推】。此處是：${cm.kind}。間接刻畫再細分為動作、說話、外貌與細節、他人反應、內心思想五種途徑 —— 分得出途徑，分析才有具體可寫。要留意作品往往同時用上兩類，而最有力的人物通常是「說出來的」與「做出來的」之間有落差的那一種；察覺到落差，就是高階的分析。`,
        `Characterisation divides in two: the text tells you, or it lets you infer. Here: ${cm.kind}. Indirect characterisation runs through five routes — action, speech, appearance and detail, others' reactions, and interior thought. Naming the route gives your analysis something concrete to work with. Note that works often use both kinds at once, and the most compelling characters are those where the told and the shown do not match; noticing that gap is the higher-order move.`,
      ],
    )
  }
})

// ── 模板八：Themes（主題與題材、情節之別）──────────────────────────────
const THEME_Q = [
  { subj: 'a novel in which two neighbours quarrel over a boundary for thirty years', theme: 'How small grievances harden into identity when neither side can afford to be the one who yields', wrong: ['Two neighbours quarrel over a boundary', 'Boundaries and fences', 'The novel is set over thirty years'] },
  { subj: 'a play in which a family keeps a secret to protect one of its members', theme: 'That protection can become its own form of harm when it is never re-examined', wrong: ['A family keeps a secret', 'Secrets and families', 'The play has several acts'] },
  { subj: 'a poem in which a speaker returns to a house that has been sold', theme: 'That places outlast the claims we make on them, and memory is not possession', wrong: ['A speaker returns to a house', 'Houses and memory', 'The poem is written in the past tense'] },
  { subj: 'a story in which a young worker is repeatedly promised a promotion', theme: 'How deferred reward can be used as a means of control', wrong: ['A worker is promised a promotion', 'Work and promotion', 'The story is told in the third person'] },
  { subj: 'a novel in which a translator alters one word in a treaty', theme: 'That small acts of authorship carry consequences their author cannot limit', wrong: ['A translator alters a word', 'Translation and treaties', 'The novel is set in one city'] },
  { subj: 'a play in which a teacher and a student exchange roles over a term', theme: 'That authority is a position rather than a property of the person holding it', wrong: ['A teacher and a student exchange roles', 'Teaching and learning', 'The play lasts one term'] },
]
THEME_Q.forEach((tq, ti) => {
  for (let k = 0; k < 14; k++) {
    const i = ti * 14 + k
    const rot = tq.wrong.map((_, j) => tq.wrong[(j + k) % tq.wrong.length])
    b.add(
      `el_th_${ti}_${k}`,
      T.themes,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就${tq.subj}而言，以下哪一項是【主題】而非題材或情節？`,
        `(Set ${k + 1}) For ${tq.subj}, which of the following is the theme rather than the subject or the plot?`,
      ],
      [n(tq.theme), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `主題、題材與情節三者最易混淆，但分別很清楚：情節是【發生了甚麼】，題材是【關於甚麼】，主題是【作品就此提出了甚麼看法】。所以主題必然是一個可以同意或反對的句子，而不是一個名詞短語。此處的主題是：「${tq.theme}」。三個誤答分別是情節複述、題材名詞、以及形式描述 —— 三者都不能被同意或反對，這就是最快的檢驗方法：把選項讀一次，問「我可以不同意這句話嗎」；不能，它就不是主題。`,
        `Theme, subject and plot are the trio students most often merge, yet the distinction is clean: plot is what happens, subject is what it is about, and theme is what the work proposes about that subject. A theme is therefore a sentence one can agree or disagree with, never a noun phrase. Here: "${tq.theme}". The distractors are, in turn, a plot summary, a subject label, and a formal description — none can be agreed or disagreed with, which is the fastest test: read the option and ask whether you could dissent from it. If not, it is not the theme.`,
      ],
    )
  }
})

// ── 模板九：Shakespeare（只考寫作慣例，不考劇情記憶）────────────────────
// ⚠️ 一律不問「某劇某幕發生了甚麼」。由迴圈生成的劇情就是虛構，
//    而虛構的文學史實與虛構的統計同樣有害。
const SHAKE_Q = [
  { q: 'the metre in which most of the verse is written', a: 'Iambic pentameter — five stressed beats to a line, unrhymed in the dialogue', wrong: ['Rhyming couplets throughout every scene', 'Free verse with no regular beat', 'Prose divided into numbered paragraphs'] },
  { q: 'the usual reason a scene switches from verse to prose', a: 'The switch commonly marks a change of social register, situation or state of mind', wrong: ['It signals that the scene was written by another hand', 'It shows that the printer ran short of space', 'It means the scene is not part of the plot'] },
  { q: 'the function of a rhyming couplet at the end of a scene', a: 'It closes the scene audibly, signalling to the audience that the action has shifted', wrong: ['It indicates that a character has died', 'It marks the interval', 'It shows the speaker is lying'] },
  { q: 'what a soliloquy conventionally gives the audience', a: 'Direct access to a character’s reasoning, which the other characters do not share', wrong: ['A summary of events the audience has missed', 'The playwright’s own opinion of the character', 'A speech addressed to another character on stage'] },
  { q: 'the conventional shape of a five-act structure', a: 'Rising complication towards a mid-point turn, then consequences working out to a close', wrong: ['Five self-contained stories with no connection', 'The climax placed in the first act', 'Five acts of equal length by rule'] },
  { q: 'the role of the fool or clown figure', a: 'Licensed to speak plainly to those in power, often voicing what others cannot', wrong: ['Present only to lengthen the performance', 'Forbidden from speaking to the main characters', 'Always the villain of the piece'] },
  { q: 'why characters often speak at length before acting', a: 'The speech is the action in a theatre without cinematic devices: deliberation is dramatised aloud', wrong: ['The playwright was paid by the line', 'Audiences of the time could not follow physical action', 'Speaking replaces plot entirely'] },
]
SHAKE_Q.forEach((sq, si) => {
  for (let k = 0; k < 12; k++) {
    const i = si * 12 + k
    const rot = sq.wrong.map((_, j) => sq.wrong[(j + k) % sq.wrong.length])
    b.add(
      `el_sh_${si}_${k}`,
      T.shakespeare,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組・寫作慣例）就莎士比亞劇作的寫作慣例而言，關於「${sq.q}」，以下敘述何者正確？`,
        `(Set ${k + 1}) On Shakespearean dramatic convention, regarding ${sq.q}, which statement is correct?`,
      ],
      [n(sq.a), n(rot[0]), n(rot[1]), n(rot[2])],
      [
        `本題考的是【寫作慣例】而不是劇情記憶 —— 慣例可以遷移到任何一齣未讀過的劇，劇情不能。此處：${sq.a}。溫習時最值得掌握的是「散文與韻文的切換」：它幾乎每一次都在標示身分、處境或心神的轉變，答題時指得出這一點，比複述情節有用得多。`,
        `This tests convention, not plot recall — convention transfers to any play you have not read; plot does not. Here: ${sq.a}. The single most useful thing to hold on to is the switch between verse and prose: it almost always marks a change in status, circumstance or state of mind, and pointing that out earns far more than retelling the story.`,
      ],
    )
  }
})

// ── 模板十：Criticism（一個解讀需要甚麼證據）────────────────────────────
const CRIT = [
  { claim: 'the poem is critical of the institution it describes', need: 'Point to word choices or juxtapositions in the poem that carry disapproval', bad: 'Cite the poet’s known political views from outside the poem' },
  { claim: 'the narrator is unreliable', need: 'Point to places where the text supplies information that contradicts the narration', bad: 'Argue that the narrator seems unlikeable' },
  { claim: 'the ending is deliberately left open', need: 'Point to what the final passage withholds and to earlier questions it does not resolve', bad: 'Say that the reader is left wanting more' },
  { claim: 'the setting functions symbolically', need: 'Show that the setting recurs at points of significance and shifts with the action', bad: 'Note that the setting is described in detail' },
  { claim: 'two characters are set up as foils', need: 'Identify the specific qualities in which they contrast and the scenes that place them together', bad: 'Observe that they appear in the same work' },
  { claim: 'the work resists a single interpretation', need: 'Show two readings that the text supports and the passages that sustain each', bad: 'State that different readers feel differently about it' },
  { claim: 'the shift in tense is meaningful', need: 'Show where the shifts fall and what changes in the reader’s position at those points', bad: 'Count how many tense shifts occur' },
]
CRIT.forEach((cr, ci) => {
  for (let k = 0; k < 12; k++) {
    const i = ci * 12 + k
    b.add(
      `el_cr_${ci}_${k}`,
      T.criticism,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）若要在評論中提出「${cr.claim}」這個解讀，最必要的支持是甚麼？`,
        `(Set ${k + 1}) To argue in an essay that ${cr.claim}, what support is indispensable?`,
      ],
      [
        n(cr.need),
        n(cr.bad),
        n('Quote a published critic who has said the same thing'),
        n('Describe how strongly the work affected you as a reader'),
      ],
      [
        `文學評論與讀後感的分別，在於【解讀有沒有文本證據】。要提出「${cr.claim}」，必要的支持是：${cr.need}。三個誤答代表三種無效支持：以作者的生平或立場代替文本（那只能證明作者是怎樣的人，不能證明這一篇怎樣寫）、以他人的評語代替自己的舉證（引用可以佐證，不能取代分析），以及以感受的強度代替證據。作答前的自檢只有一問：我這句判斷，指得出文中哪一處嗎？指不出就要改判斷，而不是加強語氣。`,
        `Criticism differs from a reading response in one respect: whether the reading is anchored in the text. To argue that ${cr.claim}, you must ${cr.need.charAt(0).toLowerCase()}${cr.need.slice(1)}. The distractors are three kinds of non-evidence: the writer's life or opinions (which show what the writer was like, not what this text does), another critic's verdict (useful as corroboration, never as substitute), and the strength of your own response. One self-check before you write: can I point to a place in the text? If not, change the claim rather than raising the volume.`,
      ],
    )
  }
})

export const englishLiteratureBank1Questions: Question[] = b.bank
export const englishLiteratureBank1Drops = b.drops
