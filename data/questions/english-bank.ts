import type { Question, Difficulty } from './types'
import { createBank, n, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// english-bank.ts —— 英國語文參數化母模板・第一批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 203 條、分佈 8–22，十二個課題全部遠低於每課題 83 的目標，
// 故為全部十二個課題出題。
//
// ══ 英文科的雙語慣例（沿用 english-floor-b2.ts，不可改）══
//   content / contentEn  ：題幹雙語 —— 英文較弱的學生也要看得懂「在問甚麼」
//   options / optionsEn  ：兩邊【同樣是英文】—— 選項本身就是被考的材料，
//                          翻譯了就等於把答案送出去
//   explanation 系列      ：雙語
// 故本檔選項一律用 `n()`（[en, en]），只有題幹與解析是真雙語 Pair。
//
// ══ 出題原則：資料由題幹提供，學生據此推理 ══
// 與歷史科同一個道理。英文科不可以憑空「創造語言事實」——
// 一條要靠背某個詞搭配才答得到的題，等於考記憶而不是考語文能力，
// 而且一旦搭配判斷有偏差就會出現「兩個選項都說得通」。
// 故本檔一律：【句子／情境由題幹寫死】→【答案由題幹的線索唯一決定】→
// 【解析講的是判斷方法，不是答案本身】。
//
// ⚠️ 不做長答自動批改（憲章 §16.A）。規格書提及的「Tone & Register 雙重語義
// 批改」屬永久禁令，本檔只出選擇題；語域（register）在此是【要學生判斷的對象】，
// 不是拿來評分學生作文的工具。兩者分別在於：前者由題幹提供材料、答案唯一；
// 後者要對學生自由書寫的文字打分，平台一分都不出。
//
// ⚠️ 七條累積教訓（同日九役），開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】（ICT DC2、生物 GE2）。
//   ② 每個迴圈變數【必須出現在題幹】（音樂 HA1）。
//   ③ 補量用值域寬的數值參數，不要用固定枚舉表（音樂第一版只出 152 條）。
//   ④ 迴圈相乘：三層各加一值即八倍，不是加三。
//   ⑤ 改完即量度，不要改完九個才跑一次（旅遊與款待 380 → 1049）。
//   ⑥ 一個模板的組合空間有上限時，要加的是【模板】而不是取值（健康管理、視覺藝術）。
//   ⑦ 【英文科新增】動詞只可用「原形／過去式／過去分詞三者互不相同」的不規則動詞。
//      規則動詞的過去式與過去分詞同形（walked／walked），四個選項會剩下三個，
//      整批被引擎靜默丟棄 —— 這正是教訓①在英文科的具體形態。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  tenses: { id: 'tenses', zh: 'Tenses', en: 'Tenses' },
  grammar: { id: 'grammar', zh: 'Grammar', en: 'Grammar' },
  wordForm: { id: 'word_formation', zh: 'Word Formation', en: 'Word Formation' },
  cloze: { id: 'cloze', zh: 'Cloze & Usage', en: 'Cloze & Usage' },
  vocab: { id: 'vocabulary', zh: 'Vocabulary', en: 'Vocabulary' },
  reading: { id: 'reading', zh: 'Reading Comprehension', en: 'Reading Comprehension' },
  p1Reading: { id: 'paper1_reading', zh: 'DSE Paper 1 Reading', en: 'DSE Paper 1 Reading' },
  p1Inference: { id: 'p1_inference', zh: 'Reading · Inference & Implication', en: 'Reading · Inference & Implication' },
  p1Tone: { id: 'p1_tone', zh: 'Reading · Tone & Attitude', en: 'Reading · Tone & Attitude' },
  p1VocabRef: { id: 'p1_vocab_ref', zh: 'Reading · Vocabulary & Reference', en: 'Reading · Vocabulary & Reference' },
  genreTone: { id: 'genre_tone', zh: 'Genre, Tone & Register', en: 'Genre, Tone & Register' },
  integrated: { id: 'integrated', zh: 'Integrated Skills', en: 'Integrated Skills' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('english')

// 難度按 3:5:2（基礎:中等:拔尖）分派，見憲章 §12。
const diff = (i: number): Difficulty => (i % 10 < 3 ? 'easy' : i % 10 < 8 ? 'medium' : 'hard')

// ── 共用情境素材 ────────────────────────────────────────────────────────
// 全部是校園／社區場景，數字由迴圈給，不牽涉任何真實機構或人物。
const BODIES = [
  { en: 'the library committee', zh: '圖書館委員會' },
  { en: 'the sports council', zh: '體育議會' },
  { en: 'the drama society', zh: '戲劇學會' },
  { en: 'the careers office', zh: '升學及就業輔導組' },
  { en: 'the student union', zh: '學生會' },
  { en: 'the science club', zh: '科學學會' },
  { en: 'the alumni association', zh: '校友會' },
  { en: 'the environment group', zh: '環保小組' },
]

// ── 模板一：Tenses ──────────────────────────────────────────────────────
// 時態由題幹的時間標記唯一決定；四個選項是同一動詞的四種形態，
// 故必然互不相同（教訓⑦：只用三態相異的不規則動詞）。
const VERBS = [
  { base: 'write', past: 'wrote', pp: 'written', ing: 'writing', zh: '撰寫' },
  { base: 'take', past: 'took', pp: 'taken', ing: 'taking', zh: '採取' },
  { base: 'give', past: 'gave', pp: 'given', ing: 'giving', zh: '給予' },
  { base: 'begin', past: 'began', pp: 'begun', ing: 'beginning', zh: '展開' },
  { base: 'choose', past: 'chose', pp: 'chosen', ing: 'choosing', zh: '選定' },
  { base: 'speak', past: 'spoke', pp: 'spoken', ing: 'speaking', zh: '發言' },
  { base: 'know', past: 'knew', pp: 'known', ing: 'knowing', zh: '知悉' },
  { base: 'drive', past: 'drove', pp: 'driven', ing: 'driving', zh: '推動' },
]
const TENSE_FRAMES = [
  { key: 'past', marker: 'Last September', zh: '去年九月', tail: 'its first proposal', zhTail: '首份建議書', rule: 'a finished point in past time', zhRule: '一個已完結的過去時間點' },
  { key: 'past', marker: 'Three terms ago', zh: '三個學期之前', tail: 'a very different line', zhTail: '一條截然不同的路線', rule: 'a finished point in past time', zhRule: '一個已完結的過去時間點' },
  { key: 'pp', marker: 'The proposal has already been', zh: '該建議書已經被', tail: 'twice this year', zhTail: '（今年已兩次）', rule: 'a perfect passive, which needs the third form', zhRule: '完成式被動語態，須用第三態' },
  { key: 'pp', marker: 'By June the notice had been', zh: '到六月，該通告已被', tail: 'to every class', zhTail: '送到每一班', rule: 'a past perfect passive, which needs the third form', zhRule: '過去完成式被動語態，須用第三態' },
  { key: 'base', marker: 'Next term the group will', zh: '下學期該小組將會', tail: 'a revised plan', zhTail: '一份修訂計劃', rule: 'a modal, after which the verb stays in its base form', zhRule: '情態動詞之後，動詞保持原形' },
  { key: 'base', marker: 'The chair asked the group to', zh: '主席請該小組', tail: 'the matter again', zhTail: '再次處理該事項', rule: 'a to-infinitive, which takes the base form', zhRule: '不定式 to 之後用原形' },
  { key: 'ing', marker: 'At this moment the group is', zh: '此刻該小組正在', tail: 'the final version', zhTail: '最後定稿', rule: 'an action in progress right now', zhRule: '此刻正在進行的動作' },
  { key: 'ing', marker: 'They spent the whole of Tuesday', zh: '他們用了整個星期二', tail: 'the same section', zhTail: '同一節內容', rule: 'spend + time, which is followed by the -ing form', zhRule: 'spend + 時間之後接 -ing 形式' },
  { key: 'past', marker: 'In the summer of that year', zh: '該年夏天', tail: 'an open letter', zhTail: '一封公開信', rule: 'a finished point in past time', zhRule: '一個已完結的過去時間點' },
]
TENSE_FRAMES.forEach((f, fi) => {
  VERBS.forEach((v, vi) => {
    const i = fi * VERBS.length + vi
    const correct = f.key === 'past' ? v.past : f.key === 'pp' ? v.pp : f.key === 'base' ? v.base : v.ing
    const wrong = [v.base, v.past, v.pp, v.ing].filter((x) => x !== correct)
    b.add(
      `en_tn_${fi}_${vi}`,
      T.tenses,
      FW.apply,
      diff(i),
      [
        `題幹：「${f.marker} ____ ${f.tail}」（動詞 ${v.base}，意為「${v.zh}」）。空格應填哪一個形態？`,
        `"${f.marker} ____ ${f.tail}." Which form of "${v.base}" fits?`,
      ],
      [n(correct), n(wrong[0]), n(wrong[1]), n(wrong[2])],
      [
        `時態不是靠語感猜，而是由句中的標記決定。此句的標記指向${f.zhRule}，所以只有「${correct}」一個形態成立。做法是先找標記、再對規則，最後才看選項 —— 倒過來先看選項，四個都會「讀落好似都得」。注意 ${v.base} 是不規則動詞，三態各異（${v.base} / ${v.past} / ${v.pp}）；規則動詞的過去式與過去分詞同形，那時就要靠句法而非詞形去分辨。`,
        `Tense is decided by the marker in the sentence, not by ear. Here the marker points to ${f.rule}, so only "${correct}" works. Find the marker, apply the rule, and only then look at the options — done the other way round, all four will "sound possible". Note that "${v.base}" is irregular, so its three forms differ (${v.base} / ${v.past} / ${v.pp}); with a regular verb the past and the participle look identical and you must rely on syntax instead.`,
      ],
    )
  })
})

// ── 模板二：Grammar（主謂一致）──────────────────────────────────────────
// 中間插入的複數名詞是陷阱；真正的主語由量詞決定，單複數唯一。
const QUANTS = [
  { en: 'Each of', zh: '每一位', sg: true },
  { en: 'Every one of', zh: '當中每一位', sg: true },
  { en: 'Neither of', zh: '兩者之中沒有一位', sg: true },
  { en: 'One of', zh: '其中一位', sg: true },
  { en: 'Both of', zh: '兩位', sg: false },
  { en: 'Several of', zh: '當中數位', sg: false },
]
const GNOUNS = [
  { en: 'candidates', zh: '候選人' },
  { en: 'the twelve prefects', zh: '十二位風紀' },
  { en: 'the shortlisted applicants', zh: '入圍申請人' },
  { en: 'the visiting coaches', zh: '到訪教練' },
  { en: 'the exchange students', zh: '交流生' },
  { en: 'the panel members', zh: '評審委員' },
]
const GTIME = [
  { en: 'this week', zh: '本星期', past: false },
  { en: 'last week', zh: '上星期', past: true },
]
QUANTS.forEach((q, qi) => {
  GNOUNS.forEach((nn, ni) => {
    GTIME.forEach((t, ti) => {
      const i = qi * 12 + ni * 2 + ti
      const correct = t.past ? (q.sg ? 'was' : 'were') : q.sg ? 'is' : 'are'
      const wrong = ['is', 'are', 'was', 'were'].filter((x) => x !== correct)
      b.add(
        `en_gr_${qi}_${ni}_${ti}`,
        T.grammar,
        FW.logic,
        diff(i),
        [
          `題幹：「${q.en} ${nn.en} ____ asked to submit a reference ${t.en}.」空格應填哪一個？（提示：${q.zh}${nn.zh}，時間為${t.zh}）`,
          `"${q.en} ${nn.en} ____ asked to submit a reference ${t.en}." Which word fits?`,
        ],
        [n(correct), n(wrong[0]), n(wrong[1]), n(wrong[2])],
        [
          `主謂一致看的是【真正的主語】，不是最貼近動詞的那個名詞。此句的主語是「${q.en}」，屬${q.sg ? '單數' : '複數'}；中間的「${nn.en}」只是 of 片語的一部分，它是複數只是用來引人跌落陷阱。時間標記「${t.en}」再決定用${t.past ? '過去式' : '現在式'}，兩個條件相交，答案只剩「${correct}」。判斷次序：先剝走 of 片語，再看時間標記。`,
          `Agreement follows the real subject, not the noun sitting closest to the verb. The subject here is "${q.en}", which is ${q.sg ? 'singular' : 'plural'}; "${nn.en}" only belongs to the of-phrase and is plural precisely to tempt you. The marker "${t.en}" then fixes the tense as ${t.past ? 'past' : 'present'}. The two conditions together leave only "${correct}". Strip the of-phrase first, then read the time marker.`,
        ],
      )
    })
  })
})

// ── 模板三：Word Formation ──────────────────────────────────────────────
// 詞根固定，句框決定需要哪一個詞性；四個選項是同一詞根的四種形態，必然相異。
const ROOTS = [
  { verb: 'decide', noun: 'decision', adj: 'decisive', adv: 'decisively', zh: '決定' },
  { verb: 'analyse', noun: 'analysis', adj: 'analytical', adv: 'analytically', zh: '分析' },
  { verb: 'persuade', noun: 'persuasion', adj: 'persuasive', adv: 'persuasively', zh: '說服' },
  { verb: 'compete', noun: 'competition', adj: 'competitive', adv: 'competitively', zh: '競爭' },
  { verb: 'create', noun: 'creation', adj: 'creative', adv: 'creatively', zh: '創造' },
  { verb: 'explain', noun: 'explanation', adj: 'explanatory', adv: 'clearly', zh: '解釋' },
  { verb: 'apply', noun: 'application', adj: 'applicable', adv: 'widely', zh: '應用' },
  { verb: 'observe', noun: 'observation', adj: 'observant', adv: 'closely', zh: '觀察' },
  { verb: 'compare', noun: 'comparison', adj: 'comparative', adv: 'comparatively', zh: '比較' },
  { verb: 'inform', noun: 'information', adj: 'informative', adv: 'fully', zh: '告知' },
]
const WF_FRAMES = [
  { pos: 'noun', en: 'The ____ was announced at the end of the meeting.', zh: '會議結束時公布了 ____。', why: 'the slot follows "The" and is the subject of the sentence, so it must be a noun', zhWhy: '空格前有 The、又是全句主語，只能是名詞' },
  { pos: 'noun', en: 'Members asked for a written ____ before the vote.', zh: '成員在表決前要求一份書面 ____。', why: 'the slot follows the article "a" and an adjective, so it must be a noun', zhWhy: '空格前有冠詞 a 加形容詞，只能是名詞' },
  { pos: 'adj', en: 'It proved to be a ____ move for the whole team.', zh: '事實證明那對全隊而言是一個 ____ 的舉措。', why: 'the slot sits between an article and a noun, so it must be an adjective', zhWhy: '空格夾在冠詞與名詞之間，只能是形容詞' },
  { pos: 'adj', en: 'The report was unusually ____ for a first draft.', zh: '作為初稿，該報告異常 ____。', why: 'the slot follows the linking verb "was" and describes the subject, so it must be an adjective', zhWhy: '空格接在系動詞 was 之後、描述主語，只能是形容詞' },
  { pos: 'adv', en: 'She answered the question ____ and sat down.', zh: '她 ____ 回答了問題便坐下。', why: 'the slot modifies the verb "answered", so it must be an adverb', zhWhy: '空格修飾動詞 answered，只能是副詞' },
  { pos: 'adv', en: 'The team worked ____ throughout the whole term.', zh: '整個學期該團隊都 ____ 地工作。', why: 'the slot modifies the verb "worked", so it must be an adverb', zhWhy: '空格修飾動詞 worked，只能是副詞' },
  { pos: 'verb', en: 'The panel will ____ the matter again next month.', zh: '評審團下月將再次 ____ 該事項。', why: 'the slot follows the modal "will", so it must be a base-form verb', zhWhy: '空格接在情態動詞 will 之後，只能是動詞原形' },
]
WF_FRAMES.forEach((f, fi) => {
  ROOTS.forEach((r, ri) => {
    const i = fi * ROOTS.length + ri
    const correct = f.pos === 'noun' ? r.noun : f.pos === 'adj' ? r.adj : f.pos === 'adv' ? r.adv : r.verb
    const wrong = [r.verb, r.noun, r.adj, r.adv].filter((x) => x !== correct)
    if (wrong.length !== 3) return // 同一詞根若有兩個形態同形，整條略過（教訓①）
    b.add(
      `en_wf_${fi}_${ri}`,
      T.wordForm,
      FW.apply,
      diff(i),
      [
        `題幹：「${f.en}」詞根為 ${r.verb}（意為「${r.zh}」）。空格應填哪一個形態？`,
        `"${f.en}" The root is "${r.verb}". Which form fits the blank?`,
      ],
      [n(correct), n(wrong[0]), n(wrong[1]), n(wrong[2])],
      [
        `詞形轉換考的不是背詞表，而是【由句法位置反推詞性】。此句${f.zhWhy}，所以四個形態之中只有「${correct}」填得入。做法：先不要看選項，只看空格前後各一個詞，判斷這個位置需要甚麼詞性，再去選項找對應形態 —— 這樣即使遇上完全陌生的詞根都答得到。`,
        `Word formation is not about memorising lists; it is about reading the slot. Here ${f.why}, so of the four forms only "${correct}" can go in. Cover the options, look at one word on each side of the blank, decide what part of speech the slot needs, and only then match a form — that way an unfamiliar root is still answerable.`,
      ],
    )
  })
})

// ── 模板四：Cloze & Usage（連接詞）──────────────────────────────────────
// 兩個分句的邏輯關係由題幹的數字寫死，連接詞唯一。
const RELS = [
  { key: 'contrast', word: 'however', zh: '轉折', en: 'contrast', others: ['therefore', 'moreover', 'for example'] },
  { key: 'result', word: 'therefore', zh: '因果', en: 'result', others: ['however', 'moreover', 'for example'] },
  { key: 'addition', word: 'moreover', zh: '遞進', en: 'addition', others: ['however', 'therefore', 'for example'] },
  { key: 'example', word: 'for example', zh: '舉例', en: 'exemplification', others: ['however', 'therefore', 'moreover'] },
  { key: 'concession', word: 'even so', zh: '讓步', en: 'concession', others: ['because of this', 'in addition', 'in other words' ] },
]
RELS.forEach((rel, rli) => {
  BODIES.forEach((body, bi) => {
    for (let k = 0; k < 2; k++) {
      if ((rli + bi + k) % 4 === 3) continue // 此課題本已最厚，疏一疏以就均衡
      const i = rli * 16 + bi * 2 + k
      const up = 12 + rli * 7 + bi * 3 + k * 5
      const down = 5 + bi * 2 + k * 3
      const first = `Attendance at ${body.en} rose by ${up} per cent this year`
      const zhFirst = `${body.zh}的出席人數今年上升了 ${up}%`
      const second =
        rel.key === 'contrast' ? `the number of members who renewed fell by ${down} per cent`
        : rel.key === 'result' ? `the room booked for it was changed to one holding ${up * 2} people`
        : rel.key === 'addition' ? `${down} new sub-groups were formed in the same period`
        : rel.key === 'example' ? `its Saturday session alone drew ${up + down} more students than last year`
        : `the committee decided not to expand, because only ${down} of the new members stayed past March`
      const zhSecond =
        rel.key === 'contrast' ? `續會人數卻下跌了 ${down}%`
        : rel.key === 'result' ? `其場地因而改為可容納 ${up * 2} 人的房間`
        : rel.key === 'addition' ? `同期並且新增了 ${down} 個小組`
        : rel.key === 'example' ? `單是星期六一節就比去年多了 ${up + down} 名學生`
        : `委員會仍然決定不擴充，因為新成員之中只有 ${down} 人留到三月之後`
      b.add(
        `en_cl_${rli}_${bi}_${k}`,
        T.cloze,
        FW.logic,
        diff(i),
        [
          `題幹：「${first}; ____ , ${second}.」（${zhFirst}；${zhSecond}。）空格應填哪一個連接詞？`,
          `"${first}; ____ , ${second}." Which connective fits?`,
        ],
        [n(rel.word), n(rel.others[0]), n(rel.others[1]), n(rel.others[2])],
        [
          `連接詞不是靠語感揀，而是先判斷兩個分句之間是甚麼關係。此處前句與後句構成${rel.zh}關係，所以只有「${rel.word}」對得上。方法是把連接詞遮住，用自己的話講出兩句的關係（「相反」「所以」「而且」「例如」「即使如此」），再去找對應那一個 —— 先看選項的話，四個都會覺得讀得通。`,
          `A connective is chosen by first naming the relation between the two clauses, not by ear. Here the second clause stands in a relation of ${rel.en} to the first, so only "${rel.word}" fits. Cover the options, say the relation aloud in your own words, then match it — read the options first and all four will seem to flow.`,
        ],
      )
    }
  })
})

// ── 模板五：Vocabulary（詞義由語境釘死）────────────────────────────────
// 一詞多義：題幹寫死語境，該詞的意思唯一，不必背詞典。
const POLY = [
  { w: 'address', ctx: 'The head of %B% will address the whole school on Friday.', sense: 'speak formally to', wrong: ['write a postal code on', 'move house to', 'be located at'], zh: '正式向……講話', zhCtx: '%ZB%的負責人星期五將向全校 address。' },
  { w: 'draw', ctx: 'The exhibition held by %B% is expected to draw more than four hundred visitors.', sense: 'attract', wrong: ['make a picture of', 'pull a cart for', 'end level with'], zh: '吸引', zhCtx: '%ZB%舉辦的展覽預計會 draw 超過四百名參觀者。' },
  { w: 'issue', ctx: 'The office of %B% will issue every new student with a locker key.', sense: 'formally give out', wrong: ['argue about', 'flow out of', 'a magazine number'], zh: '正式發給', zhCtx: '%ZB%的辦公室會向每位新生 issue 一條儲物櫃鎖匙。' },
  { w: 'run', ctx: 'She has run %B% for three years.', sense: 'manage', wrong: ['move quickly on foot', 'flow downwards', 'stop working'], zh: '管理', zhCtx: '她 run 了%ZB%三年。' },
  { w: 'observe', ctx: 'Members of %B% are asked to observe the ten-minute limit.', sense: 'keep to', wrong: ['look at closely', 'remark upon', 'celebrate a festival'], zh: '遵守', zhCtx: '%ZB%的成員獲要求 observe 十分鐘的限制。' },
  { w: 'reserve', ctx: 'The committee of %B% reserves the right to change the date.', sense: 'keep for itself', wrong: ['book a seat', 'a protected area', 'shyness of manner'], zh: '保留（權利）', zhCtx: '%ZB%的委員會 reserve 更改日期的權利。' },
  { w: 'figure', ctx: 'The attendance figure recorded by %B% in March was the highest so far.', sense: 'a number', wrong: ['a human shape', 'work something out', 'an important person'], zh: '數字', zhCtx: '%ZB%三月錄得的出席 figure 是至今最高。' },
  { w: 'raise', ctx: 'Two members of %B% raised an objection at the meeting.', sense: 'put forward', wrong: ['lift upwards', 'bring up a child', 'increase a price'], zh: '提出', zhCtx: '%ZB%的兩名成員在會上 raise 了一項反對。' },
]
// ⚠️ 教訓②在此有一個更陰險的變體：第一版【有】引用迴圈變數 body，
// 但用的是 `.replace('The exhibition', …)` 這種字面替換，而八個詞條裏面
// 只有兩個含有那個目標字串 —— 其餘六個八次輸出完全相同，
// 被全域撞題棘輪一次過捉出六組。
// 教訓要修正為：引用迴圈變數【不等於】輸出會變，佔位符必須每一條都存在。
// 故此改用 %B% / %ZB% 佔位符，並在下面斷言每條都替換得到。
const fillBody = (tpl: string, token: string, value: string) => {
  if (!tpl.includes(token)) throw new Error(`POLY 模板缺少 ${token}：${tpl}`)
  return tpl.split(token).join(value)
}

POLY.forEach((p, pi) => {
  BODIES.forEach((body, bi) => {
    const i = pi * BODIES.length + bi
    const ctx = fillBody(p.ctx, '%B%', body.en)
    const zhCtx = fillBody(p.zhCtx, '%ZB%', body.zh)
    b.add(
      `en_vc_${pi}_${bi}`,
      T.vocab,
      FW.apply,
      diff(i),
      [
        `題幹：「${ctx}」句中的「${p.w}」是甚麼意思？（${zhCtx}）`,
        `"${ctx}" What does "${p.w}" mean here?`,
      ],
      [n(p.sense), n(p.wrong[0]), n(p.wrong[1]), n(p.wrong[2])],
      [
        `一個詞有多個意思時，決定它的是【這一句的語境】，不是詞典排第一那個。此處的語境把「${p.w}」釘死為「${p.zh}」。三個誘答全部是這個詞在【別的句子】裏成立的意思 —— 它們不是憑空亂寫，而是刻意用真實但不合此句的義項，因為考的正是「選對義項」而不是「識唔識這個詞」。方法：先讀完整句，再問「哪一個意思代入之後整句仍然說得通」。`,
        `When a word has several senses, the sentence decides which one applies — not the first entry in the dictionary. Here the context fixes "${p.w}" as "${p.sense}". All three distractors are real senses of the same word that are simply wrong for this sentence; that is the point of the item. Read the whole sentence first, then ask which sense still makes the sentence work.`,
      ],
    )
  })
})

// ── 模板六：Reading Comprehension（供數據，問可以推出甚麼）──────────────
const READ_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
BODIES.forEach((body, bi) => {
  READ_YEARS.forEach((yr, yi) => {
    const i = bi * READ_YEARS.length + yi
    const joined = 40 + bi * 11 + yi * 7
    const left = 8 + yi * 3
    const net = joined - left
    b.add(
      `en_rd_${bi}_${yi}`,
      T.reading,
      FW.logic,
      diff(i),
      [
        `短文：「In ${yr}, ${joined} students joined ${body.en} and ${left} left it. No other changes were recorded that year.」根據這段文字，可以確定的是甚麼？（${yr} 年有 ${joined} 名學生加入${body.zh}，${left} 名退出，該年沒有其他變動。）`,
        `Passage: "In ${yr}, ${joined} students joined ${body.en} and ${left} left it. No other changes were recorded that year." What does the passage establish?`,
      ],
      [
        n(`Its membership grew by ${net} over the year`),
        n(`Its membership at the end of the year was ${net}`),
        n(`It was the fastest-growing group in the school that year`),
        n(`Students left because they were dissatisfied with it`),
      ],
      [
        `閱讀題的核心是分辨【文中說了甚麼】與【我以為文中說了甚麼】。文中只給出加入與退出兩個數字，所以能確定的只有淨變化 ${joined} − ${left} = ${net}。說「年終人數是 ${net}」是把「變化」當成「總數」—— 文中從未提及年初有多少人。說「全校增長最快」需要與其他組別比較，文中沒有這些資料。說「因為不滿而退出」是替文字加上一個它沒有給的原因。三個誘答分別代表三種最常見的過度推論：混淆變化與總量、無中生有的比較、憑空補上動機。`,
        `Reading questions turn on the difference between what the passage says and what you assume it says. Only two figures are given, so the one thing established is the net change: ${joined} − ${left} = ${net}. Saying the year-end membership was ${net} confuses a change with a total — the passage never says how many members there were to begin with. "Fastest-growing" needs a comparison the passage does not supply. "Because they were dissatisfied" supplies a motive the passage does not give. The three distractors are the three commonest over-readings: change mistaken for total, an invented comparison, and an invented motive.`,
      ],
    )
  })
})

// ── 模板七：DSE Paper 1 Reading（主旨 vs 細節）──────────────────────────
const P1_TOPICS = [
  { en: 'a new timetable', zh: '新時間表', detail: 'the change takes effect after the Easter break' },
  { en: 'a recycling scheme', zh: '回收計劃', detail: 'bins will be placed on every floor' },
  { en: 'a mentoring programme', zh: '師友計劃', detail: 'each pair meets once a fortnight' },
  { en: 'a revised lending policy', zh: '修訂借閱政策', detail: 'the loan period is now three weeks' },
  { en: 'an inter-house contest', zh: '社際比賽', detail: 'entries close at the end of the month' },
  { en: 'a study-skills workshop', zh: '學習技巧工作坊', detail: 'places are limited to thirty' },
  { en: 'a volunteer scheme', zh: '義工計劃', detail: 'a reference letter is issued after forty hours' },
  { en: 'a peer-tutoring trial', zh: '朋輩輔導試驗', detail: 'the trial runs for one term only' },
  { en: 'a revised booking system', zh: '修訂訂場系統', detail: 'bookings open at eight each morning' },
]
P1_TOPICS.forEach((tp, ti) => {
  BODIES.forEach((body, bi) => {
    const i = ti * BODIES.length + bi
    b.add(
      `en_p1r_${ti}_${bi}`,
      T.p1Reading,
      FW.logic,
      diff(i),
      [
        `短文：「${body.en} has published a note on ${tp.en}. Most of the note explains why the change was needed; one sentence near the end adds that ${tp.detail}.」這段文字的主旨最接近哪一項？（全文大部分在解釋為何需要改動，末段一句補充細節。）`,
        `Passage: "${body.en} has published a note on ${tp.en}. Most of the note explains why the change was needed; one sentence near the end adds that ${tp.detail}." What is the main idea?`,
      ],
      [
        n(`The reasons behind ${tp.en}`),
        n(`That ${tp.detail}`),
        n(`A complete history of ${body.en}`),
        n(`A warning that ${tp.en} will be withdrawn`),
      ],
      [
        `主旨題的判斷準則是【篇幅與位置】，不是「哪一句最具體」。文中明言大部分內容在解釋原因，補充細節只佔末段一句 —— 所以主旨是原因，細節只是細節。學生最常犯的錯是揀那個最具體、最像「有料」的句子；但一個只出現一次的細節，無論多具體都不會是主旨。另外兩個誤答一個超出文本範圍（完整歷史），一個加入文中沒有的立場（將被撤回）。`,
        `Main-idea questions are settled by proportion and placement, not by which sentence sounds most concrete. The passage states that most of the note explains the reasons, while the detail occupies a single sentence near the end — so the reasons are the main idea and the detail is a detail. The usual mistake is to pick the most specific-sounding line; a point made once is not the main idea however concrete it is. Of the other two, one goes beyond the text entirely and one adds a stance the text never takes.`,
      ],
    )
  })
})

// ── 模板八：Inference & Implication（言外之意）──────────────────────────
const INFER = [
  { line: 'The hall was booked for two hundred; forty-one chairs were used.', implies: 'Turnout fell well short of what was expected', zh: '出席遠低於預期', wrong: ['The hall was too small for the event', 'Exactly forty-one people were invited', 'The event was cancelled at short notice'] },
  { line: 'The minutes record that the item was "deferred again".', implies: 'The item had already been postponed at least once before', zh: '該事項此前已至少延期過一次', wrong: ['The item was rejected by the committee', 'The minutes were written by a new secretary', 'No one wanted to discuss the item'] },
  { line: 'Only the treasurer signed the report; the other three signature lines were left blank.', implies: 'The report did not carry the agreement of the whole committee', zh: '該報告並未取得全體委員同意', wrong: ['The other three members had resigned', 'The treasurer wrote the report alone', 'The report contained an error'] },
  { line: 'The notice was reissued on Thursday with the date printed in bold.', implies: 'The date in the earlier notice had caused confusion', zh: '早前通告的日期曾引起混淆', wrong: ['The event date had been changed', 'The first notice was never sent out', 'Thursday was the deadline for entries'] },
  { line: 'Attendance was steady until the fee was introduced in October.', implies: 'The fee is a likely reason for the change after October', zh: '費用是十月之後轉變的可能原因', wrong: ['The fee was too high for most members', 'Attendance stopped completely in October', 'October is always a quiet month'] },
  { line: 'The reply thanked the group for its "very detailed" letter and gave no answer to any of its questions.', implies: 'The reply avoided the substance of the letter', zh: '該回覆迴避了信件的實質內容', wrong: ['The letter was too long to read', 'The questions were badly worded', 'The group had written to the wrong office'] },
  { line: 'Sign-ups doubled in the week after the free trial was announced.', implies: 'The announcement is plausibly connected to the rise', zh: '該公布與升幅有合理關連', wrong: ['The free trial was the only reason for the rise', 'Sign-ups will keep doubling every week', 'Members disliked paying the usual fee'] },
  { line: 'Every recommendation in the report begins with the words "subject to funding".', implies: 'None of the recommendations is certain to be carried out', zh: '沒有一項建議是必定會落實的', wrong: ['The report was written by the finance office', 'The recommendations are unusually expensive', 'Funding has already been refused'] },
  { line: 'The survey was sent to members only, and the summary is headed "what students think".', implies: 'The heading claims a wider basis than the survey actually had', zh: '標題所聲稱的基礎闊過調查實際涵蓋的範圍', wrong: ['The survey received very few replies', 'Non-members were refused a copy of the summary', 'The summary was written before the survey closed'] },
]
INFER.forEach((f, fi) => {
  BODIES.forEach((body, bi) => {
    const i = fi * BODIES.length + bi
    b.add(
      `en_inf_${fi}_${bi}`,
      T.p1Inference,
      FW.logic,
      diff(i),
      [
        `短文（出自${body.zh}的紀錄）：「${f.line}」由這句可以合理推出甚麼？`,
        `From the records of ${body.en}: "${f.line}" What can be reasonably inferred?`,
      ],
      [n(f.implies), n(f.wrong[0]), n(f.wrong[1]), n(f.wrong[2])],
      [
        `推論題的分界線在於：合理推論是【由文字必然帶出】，過度推論是【文字容許但未指明】。此句必然帶出的是「${f.zh}」。三個誤答都不是荒謬的，正因為它們讀落合理才難分 —— 它們的共通問題是各自補上了一個文中沒有的環節（原因、數目、後續）。分辨方法：逐個誤答問「文中哪一個字支持這一點」，答不出就是自己加上去的。`,
        `The line between a sound inference and an over-reading is this: a sound inference is forced by the words; an over-reading is merely allowed by them. What is forced here is that ${f.implies.toLowerCase()}. The three distractors are not absurd — that is exactly why they are hard — but each adds a step the text does not supply. Test each one by asking which words support it; if you cannot point at any, you supplied it yourself.`,
      ],
    )
  })
})

// ── 模板九：Tone & Attitude（語氣標記）──────────────────────────────────
const TONES = [
  { line: 'Naturally, no one thought to ask the members first.', tone: 'Critical — "naturally" presents a failure as predictable', zh: '批評 —— 「自然地」把一次失職說成理所當然', wrong: ['Neutral — the writer simply reports the order of events', 'Approving — the writer praises the speed of the decision', 'Uncertain — the writer is unsure whether members were asked'] },
  { line: 'The scheme is, at last, running as it was always meant to.', tone: 'Relieved — "at last" marks a long-delayed improvement', zh: '如釋重負 —— 「終於」標示一項久候的改善', wrong: ['Angry — the writer condemns the way the scheme runs', 'Doubtful — the writer questions whether it runs at all', 'Indifferent — the writer has no view of the scheme'] },
  { line: 'Whether the plan works is, of course, another question entirely.', tone: 'Sceptical — the aside withholds agreement about the outcome', zh: '存疑 —— 插入語保留了對結果的同意', wrong: ['Confident — the writer expects the plan to succeed', 'Hostile — the writer attacks those behind the plan', 'Nostalgic — the writer prefers an earlier plan'] },
  { line: 'It is hard not to admire how much was done with so little.', tone: 'Admiring — the double negative states praise indirectly', zh: '欣賞 —— 雙重否定把讚賞婉轉說出', wrong: ['Resentful — the writer objects to the lack of resources', 'Neutral — the writer only records what was done', 'Apologetic — the writer excuses a poor result'] },
  { line: 'The report runs to sixty pages and answers none of the three questions put to it.', tone: 'Critical — length is set against the failure to answer', zh: '批評 —— 以篇幅對照答非所問', wrong: ['Impressed — the writer notes how thorough the report is', 'Neutral — the writer states two facts without judgement', 'Amused — the writer finds the situation entertaining'] },
  { line: 'One might, generously, call the timetable ambitious.', tone: 'Ironic — "generously" signals that a kinder word is being used', zh: '反語 —— 「寬容地」提示這是刻意用了一個好聽的詞', wrong: ['Sincere — the writer genuinely thinks the timetable ambitious', 'Alarmed — the writer warns of danger in the timetable', 'Formal — the writer keeps a distance from the subject'] },
  { line: 'Members were consulted, in the sense that they were told afterwards.', tone: 'Sarcastic — the qualification cancels the word it follows', zh: '諷刺 —— 補充語把前一個詞的意思抵消', wrong: ['Informative — the writer clarifies how consultation worked', 'Grateful — the writer thanks the members for taking part', 'Cautious — the writer avoids taking any position'] },
  { line: 'The change is welcome; it is also five years late.', tone: 'Qualified approval — praise is granted and then limited', zh: '有保留的認同 —— 先給讚賞、隨即設限', wrong: ['Wholly positive — the writer supports the change without reservation', 'Wholly negative — the writer rejects the change outright', 'Neutral — the writer records the change and its date'] },
  { line: 'We are assured that the matter is receiving attention.', tone: 'Guarded — the passive leaves it unsaid who gave the assurance', zh: '有戒心 —— 被動語態隱去了是誰作出保證', wrong: ['Trusting — the writer accepts the assurance at face value', 'Furious — the writer denounces those responsible', 'Cheerful — the writer is pleased with the progress'] },
]
TONES.forEach((f, fi) => {
  BODIES.forEach((body, bi) => {
    const i = fi * BODIES.length + bi
    b.add(
      `en_tone_${fi}_${bi}`,
      T.p1Tone,
      FW.logic,
      diff(i),
      [
        `短文（一篇評論${body.zh}的文章）：「${f.line}」作者的語氣是甚麼？`,
        `From a comment piece on ${body.en}: "${f.line}" What is the writer's tone?`,
      ],
      [n(f.tone), n(f.wrong[0]), n(f.wrong[1]), n(f.wrong[2])],
      [
        `語氣由【個別用詞】承載，與句子講的內容可以完全相反。此句的關鍵在於${f.zh}。判斷方法是找出那一兩個「本來可以刪掉、但作者偏要寫」的詞（自然地、終於、當然、寬容地、也）—— 內容照樣成立，但態度會隨之消失。「中立」永遠是最誘人的誤答：一句真正中立的陳述不會保留這些標記。`,
        `Tone is carried by individual word choices, and can run opposite to what the sentence states. The key here: ${f.tone.toLowerCase()}. Look for the one or two words that could have been deleted without changing the facts but were kept anyway — remove them and the information survives while the attitude disappears. "Neutral" is always the most tempting wrong answer: a genuinely neutral statement would not keep those markers.`,
      ],
    )
  })
})

// ── 模板十：Vocabulary & Reference（指代還原）──────────────────────────
const REFS = [
  { a: 'the revised handbook', b: 'the old handbook', pron: 'it', sent: 'The office issued the revised handbook to replace the old handbook. It is now the only version in force.', zh: '修訂版手冊' },
  { a: 'the sub-committee', b: 'the main committee', pron: 'it', sent: 'The main committee set up a sub-committee last term. It has met four times since then.', zh: '小組委員會' },
  { a: 'the second proposal', b: 'the first proposal', pron: 'this one', sent: 'Two proposals were tabled. The first was withdrawn before the vote; this one was carried.', zh: '第二份建議' },
  { a: 'the new members', b: 'the founding members', pron: 'they', sent: 'The founding members trained the new members over the summer. They will run the stall in September.', zh: '新成員' },
  { a: 'the deadline', b: 'the announcement', pron: 'it', sent: 'The announcement gave a deadline of 30 April. It was later moved to 14 May.', zh: '截止日期' },
  { a: 'the shorter route', b: 'the coastal route', pron: 'the latter', sent: 'Walkers may take the coastal route or the shorter route; the latter avoids the steep section entirely.', zh: '較短的路線' },
  { a: 'the first workshop', b: 'the second workshop', pron: 'the former', sent: 'The first workshop covered note-taking and the second covered revision; the former filled up within a day.', zh: '第一場工作坊' },
  { a: 'the fee waiver', b: 'the membership fee', pron: 'this', sent: 'The membership fee was kept, but a fee waiver was introduced for those on assistance. This has since doubled sign-ups.', zh: '費用豁免' },
  { a: 'the trial period', b: 'the full scheme', pron: 'it', sent: 'A trial period was run before the full scheme began. It lasted only six weeks.', zh: '試行期' },
  { a: 'the reminder email', b: 'the original invitation', pron: 'the second one', sent: 'An invitation went out in March and a reminder email followed in April; the second one reached far more people.', zh: '提醒電郵' },
]
REFS.forEach((f, fi) => {
  BODIES.forEach((body, bi) => {
    const i = fi * BODIES.length + bi
    b.add(
      `en_ref_${fi}_${bi}`,
      T.p1VocabRef,
      FW.logic,
      diff(i),
      [
        `短文（${body.zh}的通告）：「${f.sent}」句中的「${f.pron}」指的是甚麼？（答案為「${f.zh}」）`,
        `From a notice by ${body.en}: "${f.sent}" What does "${f.pron}" refer to?`,
      ],
      [
        n(f.a),
        n(f.b),
        n(body.en),
        n('the office that issued the notice'),
      ],
      [
        `指代還原不是揀最近那個名詞，而是把候選項【代入原句】看句意是否仍然成立。此處代入「${f.a}」之後整句通順且不自相矛盾，代入「${f.b}」則與句子其餘部分相衝突。最常見的失誤是「就近原則」—— 以為代名詞一定指前面最貼近的名詞；英文的指代由語意決定，不由距離決定。餘下兩個誤答是文中出現過、但語法上根本進不了這個位置的名詞。`,
        `Reference is resolved by substituting each candidate back into the sentence, not by picking the nearest noun. Put "${f.a}" in and the sentence holds together; put "${f.b}" in and it contradicts the rest of the sentence. The commonest error is the proximity rule — assuming a pronoun must point at the closest preceding noun. English reference is settled by meaning, not distance. The remaining two options name things that appear in the passage but cannot fill this slot at all.`,
      ],
    )
  })
})

// ── 模板十一：Genre, Tone & Register（語域配對）────────────────────────
// ⚠️ 此處的 register 是【學生要判斷的對象】，不是拿來批改學生作文的工具。
//    憲章 §16.A：平台不為任何自由書寫的文字打分。
const REG = [
  { aud: 'a formal letter to the school board', zh: '致校董會的正式信件', ok: 'We should be grateful if the Board would reconsider the decision.', wrong: ['Can you guys have another think about this?', 'Hey — any chance of a rethink?', 'Reconsider it. Now.'] },
  { aud: 'a notice on the student noticeboard', zh: '張貼在學生告示板的通告', ok: 'Sign up at the general office before Friday.', wrong: ['It would be appreciated if enrolment were effected prior to Friday.', 'Yo, get your name down before Fri!', 'Enrolment shall hereby close on the aforementioned date.'] },
  { aud: 'a message to a close classmate', zh: '給熟稔同學的訊息', ok: 'Are you free to swap shifts on Saturday?', wrong: ['I write to enquire whether an exchange of duties might be arranged.', 'Swap shifts. Saturday. Confirm.', 'The undersigned requests a variation of the duty roster.'] },
  { aud: 'a speech opening at a prize ceremony', zh: '頒獎禮致辭開首', ok: 'Good morning, and thank you all for being here today.', wrong: ['Right, let us get this over with.', 'To whom it may concern: please be advised as follows.', 'Morning all — quick one before lunch.'] },
  { aud: 'an email to a teacher you do not know well', zh: '致不熟悉的老師的電郵', ok: 'I am writing to ask whether the deadline could be extended.', wrong: ['Give me more time please.', 'Just wondering if you could push the date back a bit?', 'Kindly be informed that an extension is hereby demanded.'] },
  { aud: 'a caption in the school magazine', zh: '校刊的圖片說明', ok: 'The team celebrating after Saturday’s final.', wrong: ['Photographic evidence of post-match celebration is presented herein.', 'omg look at them go!!', 'Please refer to the attached image for further particulars.'] },
  { aud: 'a complaint form sent to a company', zh: '寄予公司的投訴表格', ok: 'The item arrived damaged and I should like a replacement.', wrong: ['Your stuff came broken, sort it out.', 'I was wondering, maybe, if possibly something could be done?', 'Be it known that damage hath been sustained.'] },
  { aud: 'a thank-you note to a visiting speaker', zh: '致到訪講者的謝函', ok: 'Thank you for making time to speak to us last Thursday.', wrong: ['Cheers for dropping by the other day.', 'The Society hereby records its gratitude for services rendered.', 'Your talk was fine, I suppose.'] },
]
REG.forEach((f, fi) => {
  BODIES.forEach((body, bi) => {
    const i = fi * BODIES.length + bi
    b.add(
      `en_reg_${fi}_${bi}`,
      T.genreTone,
      FW.apply,
      diff(i),
      [
        `情境：${body.zh}要撰寫${f.zh}。以下哪一句的語域最合適？`,
        `Context: ${body.en} is writing ${f.aud}. Which sentence has the appropriate register?`,
      ],
      [n(f.ok), n(f.wrong[0]), n(f.wrong[1]), n(f.wrong[2])],
      [
        `語域不是「越正式越好」，而是【與讀者及場合相配】。此處的讀者與場合是${f.zh}，所以要的是這一個層級：太隨便會顯得不尊重，太文縐縐同樣是失準 —— 三個誤答之中通常一個過於隨便、一個過於堆砌、一個語氣失當。判斷方法：先問「誰讀？在甚麼場合讀？」再揀，不要一見「正式」二字就揀最長那句。`,
        `Register is not "the more formal the better"; it is a match with the reader and the occasion. Here the reader and occasion call for this level. Too casual reads as disrespect, but over-formality misses just as badly — among the distractors there is usually one that is too casual, one that is over-elaborate, and one whose tone is simply wrong for the situation. Ask who is reading and on what occasion before choosing, rather than picking the longest sentence on sight.`,
      ],
    )
  })
})

// ── 模板十二：Integrated Skills（由資料表述準確的一句）──────────────────
BODIES.forEach((body, bi) => {
  for (let k = 0; k < 9; k++) {
    const i = bi * 9 + k
    const applied = 60 + bi * 9 + k * 6
    const accepted = 20 + k * 3
    const pct = Math.round((accepted / applied) * 100)
    b.add(
      `en_int_${bi}_${k}`,
      T.integrated,
      FW.apply,
      diff(i),
      [
        `資料：${body.zh}收到 ${applied} 份申請，取錄 ${accepted} 份。以下哪一句最準確地把這組數字寫成一句話？`,
        `Data: ${body.en} received ${applied} applications and accepted ${accepted}. Which sentence states the data most accurately?`,
      ],
      [
        n(`${accepted} of the ${applied} applications were accepted, about ${pct} per cent.`),
        n(`About ${pct} per cent of applicants were rejected.`),
        n(`${applied} students were accepted out of ${accepted} who applied.`),
        n(`Nearly all of the ${applied} applications were successful.`),
      ],
      [
        `綜合能力考的是把資料【原樣】轉成文字，不加不減。此處只有一個寫法同時做到三件事：數字對、比例對、方向對（${accepted} ÷ ${applied} ≈ ${pct}%）。第二個誤答把取錄率說成拒絕率，比例的方向倒轉；第三個把分子分母對調；第四個用「幾乎全部」概括一個約 ${pct}% 的比例，屬於明顯誇大。轉寫資料時的自檢次序是：分子是誰、分母是誰、講緊的是哪一邊。`,
        `Integrated tasks test whether you can restate data exactly — nothing added, nothing dropped. Only one sentence gets all three right at once: the figures, the proportion, and the direction (${accepted} ÷ ${applied} ≈ ${pct}%). The second reverses the direction, reporting an acceptance rate as a rejection rate; the third swaps numerator and denominator; the fourth calls roughly ${pct} per cent "nearly all". When restating data, check in this order: what is on top, what is on the bottom, and which side you are describing.`,
      ],
    )
  }
})

export const englishBank1Questions: Question[] = b.bank
export const englishBank1Drops = b.drops
