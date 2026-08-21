// ============================================================================
// _gate.mjs — shared OBJECTIVE gate for the human-review draft pipeline.
// ----------------------------------------------------------------------------
// The machine only decides OBJECTIVE things: format, 4-distinct-options, banned
// option shapes, HKEAA terminology red lines, LaTeX `$` balance, within-file
// dedup. It NEVER decides whether an answer is academically CORRECT — that is a
// human's job (review-drafts.mjs → a person → promote-drafts.mjs). This split is
// the whole point: it keeps the "學術正確 = 生死線" rule intact for any
// bulk/LLM-generated drafts, because nothing a machine merely "judged" can reach
// the live bank — only what a named human approved.
//
// Zero dependencies, plain Node ESM. Shared by review-drafts.mjs + promote-drafts.mjs.
// ============================================================================

export const DIFFICULTY_MAP = { basic: 'easy', intermediate: 'medium', hard: 'hard' }
// 三個題型。`text`／`long` 由 2026-07-31 接線 —— 兩者【永不機器批改】：
// 提交後攤開參考答案（long 另加評分準則），由學生自評。閘只驗格式同材料齊備，
// 對錯依然係真人嘅事。
export const SUPPORTED_TYPES = new Set(['mc', 'text', 'long'])
const MIN_QUESTION_LEN = 5
const MIN_EXPLANATION_LEN = 10
const MIN_REFERENCE_LEN = 4
const BANNED_OPTION_PATTERNS = [/以上皆[是非]/, /all of the above/i, /none of the above/i]

// HKEAA terminology / syllabus-scope red lines (mirror scripts/qbank/term-guard.mjs).
// A draft that trips one of these is auto-rejected — it must never reach a human
// reviewer as if it were shippable.
const TERM_REDLINES = [
  { re: /公共財/, msg: '術語紅線：「公共財」→ 應用「共用品」(Public Good)' },
  { re: /企業家才能/, msg: '術語紅線：「企業家才能」→ 應用「企業家職能」(Entrepreneurship)' },
]
// Economics-only scope red line (EDB C&A: point/cross/income elasticity NOT required).
const ECON_REDLINES = [
  { re: /收入彈性|交叉彈性|點彈性|income elasticity|cross elasticity|point elasticity/i, msg: '經濟科超綱：收入／交叉／點彈性 (income/cross/point elasticity) 不在課程範圍' },
]

export const norm = (s) => String(s).trim().replace(/\s+/g, ' ').toLowerCase()
export const slug = (s) => String(s).trim().replace(/\s+/g, '_')

// balanced `$` count, ignoring escaped `\$` currency (same idea as validate-banks.mjs)
function unbalancedDollars(s) {
  const stripped = String(s).replace(/\\\$/g, '')
  return (stripped.match(/\$/g) || []).length % 2 !== 0
}

// Subjects that use `$` ONLY as a currency sign and NEVER as a LaTeX math delimiter.
// For these, ANY bare (unescaped) `$` is a bug: KaTeX would enter math mode on it and
// mangle the text (e.g. "$120,000 … $45" is balanced yet renders the middle as math).
// So we require `\$` for every currency sign. (Control point — remove a subject here
// the day it legitimately needs inline `$…$` math.)
const CURRENCY_ONLY_SUBJECTS = new Set(['bafs', 'economics'])
function hasBareDollar(s) {
  return /(?<!\\)\$/.test(String(s))
}

// The OBJECTIVE gate for one raw draft row. Returns an array of hard errors; empty
// array = the row is well-formed and compliant enough to be shown to a human for the
// (subjective) correctness call. Non-empty = auto-rejected, never reaches a human.
export function gateRow(row, subject) {
  const e = []
  const type = row?.type ?? 'mc'
  if (typeof row?.id !== 'string' || !row.id.trim()) e.push('missing/blank id')
  // 2026-07-31：由「只收 mc」放寬至三個題型。呢個係【放鬆】而唔係收緊 ——
  // 已核實現有 13 個草稿檔 79 條題目 type 100% 係 'mc'，數學上唔可能因為放寬而
  // 有任何一條由「過」變「唔過」（憲章 §6 影響統計）。
  if (!SUPPORTED_TYPES.has(type)) e.push(`type must be mc|text|long (got ${JSON.stringify(row?.type)})`)
  if (typeof row?.topic !== 'string' || !row.topic.trim()) e.push('missing/blank topic')
  // NOTE（2026-07-28 稽核）：`topic` 喺草稿入面一直係【人類可讀標籤】（例如
  // 「需求變動 vs 需求量變動」），promote 時由 slug() 變成 topic id。中文標籤
  // slug 完唔會 match 任何已宣告 id ⇒ 條題目變成「孤兒課題」，學生用課題入口
  // 永遠篩唔到（實測 58 條）。
  //
  // 呢度【刻意唔加格式閘】：全部現有草稿（連 21 條等緊人手審嘅）都係用標籤，
  // 一加就會全部誤殺。正確做法係喺 promote 嗰刻先解析＋驗證 topic id
  // （見 promote-drafts.mjs），因為嗰刻先係「入庫」。
  // 實況：node scripts/qbank/topic-coverage.mjs
  if (!(row?.difficulty in DIFFICULTY_MAP)) e.push(`difficulty must be basic|intermediate|hard (got ${JSON.stringify(row?.difficulty)})`)
  if (typeof row?.question !== 'string' || row.question.trim().length < MIN_QUESTION_LEN) e.push('question too short / missing')

  const opts = row?.options
  if (type === 'mc') {
    if (!Array.isArray(opts) || opts.length !== 4) {
      e.push(`options must be exactly 4 (got ${Array.isArray(opts) ? opts.length : 'non-array'})`)
    } else {
      if (opts.some((o) => typeof o !== 'string' || !o.trim())) e.push('an option is blank/non-string')
      if (new Set(opts.map(norm)).size !== opts.length) e.push('duplicate options')
      if (opts.some((o) => BANNED_OPTION_PATTERNS.some((p) => p.test(String(o))))) e.push('banned 「以上皆是/皆非 · all/none of the above」 option')
    }

    if (!Number.isInteger(row?.correctIndex) || row.correctIndex < 0 || row.correctIndex > 3) e.push('correctIndex must be an integer 0..3')
  } else {
    // ── text／long：無客觀答案，機器【永不】判對錯 ────────────────────────────
    // 呢兩個題型嘅設計就係：提交後攤開參考答案（long 再加評分準則），學生自評。
    // 所以閘只驗「自評所需材料齊唔齊」，唔會、亦唔可以驗「答案啱唔啱」。
    if (typeof row?.referenceAnswer !== 'string' || row.referenceAnswer.trim().length < MIN_REFERENCE_LEN) {
      e.push(`referenceAnswer too short / missing —— ${type} 題冇參考答案，學生就冇嘢對照，自評做唔到`)
    }
    // 雙語：全站中英切換，英文介面嘅學生自評時見到中文參考答案＝冇得對照。
    // 型別上 `referenceAnswerEn` 係 optional（舊 MC 記錄相容），但書寫題入庫必須有。
    // 語言科（中文／英文／中國文學／英語文學）慣例係 En 欄重複同一串（`m(s)=[s,s]`），
    // 所以呢度只驗「存在且非空」，唔驗「同中文唔同」—— 25 科一致適用，唔使豁免名單。
    if (typeof row?.referenceAnswerEn !== 'string' || row.referenceAnswerEn.trim().length < MIN_REFERENCE_LEN) {
      e.push(`referenceAnswerEn too short / missing —— 英文介面嘅學生自評時會冇參考答案可對`)
    }
    // 有中文評分準則就一定要有英文版，反之亦然 —— 攤開一半空白比冇更差。
    if (typeof row?.markingScheme === 'string' && row.markingScheme.trim()) {
      if (typeof row?.markingSchemeEn !== 'string' || !row.markingSchemeEn.trim()) {
        e.push('markingScheme 有中文但冇英文（markingSchemeEn）')
      }
    } else if (typeof row?.markingSchemeEn === 'string' && row.markingSchemeEn.trim()) {
      e.push('markingSchemeEn 有英文但冇中文（markingScheme）')
    }
    // 反向閘：唔准偷偷帶 MC 欄位扮客觀題。一旦帶咗，前端就可能誤當 MC render，
    // 甚至有人日後接上自動批改 —— 呢個係憲章紅線（長答案禁機器批改）嘅守門位。
    if (opts !== undefined) e.push(`${type} 題唔可以帶 \`options\`（呢個題型冇選項）`)
    if (row?.correctIndex !== undefined) e.push(`${type} 題唔可以帶 \`correctIndex\`（呢個題型冇客觀對錯）`)
    // long 題嘅評分準則屬選填，但一旦有就要係非空字串（免得攤開一片空白）
    if (row?.markingScheme !== undefined && (typeof row.markingScheme !== 'string' || !row.markingScheme.trim())) {
      e.push('markingScheme 如提供則不可為空')
    }
    // 上限 2026-08-21 由 60 放寬至 150。
    //
    // 點解要改：中國語文卷二整卷 2 小時 15 分（135 分鐘），其中乙部命題寫作
    // 佔全卷 70%，實際作答時間約 90 分鐘。舊上限 60 之下，一條真實長度的
    // 作文題根本入唔到庫 —— 唔係題目有問題，係個閘當初只見過 45 分鐘以內
    // 嘅題目。若為遷就個閘而填 60，等於向學生講一個假時限。
    //
    // 影響統計（憲章 §6 —— 改閘前必須先查）：改動前全部草稿及題庫嘅
    // suggestedMinutes 值為 5/6/8/9/10/11/12/15/40/45，最大 45。呢個係
    // 【放寬】，數學上唔可能有任何一行由「過」變「唔過」。
    //
    // 150 而唔係無上限：仍然要捉得住手民之誤（例如 900 當 90）。
    // 150 分鐘已覆蓋現行最長嘅單卷（中文卷二 135 分鐘）。
    if (row?.suggestedMinutes !== undefined && (!Number.isInteger(row.suggestedMinutes) || row.suggestedMinutes < 1 || row.suggestedMinutes > 150)) {
      e.push('suggestedMinutes 如提供須為 1..150 的整數')
    }
    if (type === 'text' && row?.markingScheme !== undefined) e.push('text 題唔設 markingScheme（步驟分屬 long 題）')
  }

  if (typeof row?.explanation !== 'string' || row.explanation.trim().length < MIN_EXPLANATION_LEN) e.push('explanation too short / missing (詳細解釋 required)')

  // terminology / scope red lines across all visible text.
  // 非 MC 題嘅參考答案同評分準則一樣係【學生睇得到嘅正文】，術語紅線必須照掃 ——
  // 唔可以因為佢唔係選項就漏咗。
  const blob = [
    row?.question,
    ...(Array.isArray(opts) ? opts : []),
    row?.explanation,
    row?.referenceAnswer,
    row?.markingScheme,
  ].filter((x) => typeof x === 'string').join('\n')
  for (const r of TERM_REDLINES) if (r.re.test(blob)) e.push(r.msg)
  if (subject === 'economics') for (const r of ECON_REDLINES) if (r.re.test(blob)) e.push(r.msg)

  // LaTeX hygiene — every subject: `$…$` math must be balanced
  if (typeof row?.question === 'string' && unbalancedDollars(row.question)) e.push('unbalanced `$` in question (LaTeX)')
  if (Array.isArray(opts)) opts.forEach((o, i) => { if (typeof o === 'string' && unbalancedDollars(o)) e.push(`unbalanced \`$\` in option ${i}`) })
  // 長題目最容易出事：參考答案通常有多行推導，一個漏咗嘅 `$` 會令成段變數學模式
  for (const k of ['referenceAnswer', 'markingScheme']) {
    if (typeof row?.[k] === 'string' && unbalancedDollars(row[k])) e.push(`unbalanced \`$\` in ${k} (LaTeX)`)
  }

  // Currency-only subjects: forbid ANY bare `$` (must be `\$`) so KaTeX never math-modes money
  if (CURRENCY_ONLY_SUBJECTS.has(subject)) {
    const fields = [
      ['question', row?.question],
      ...(Array.isArray(opts) ? opts.map((o, i) => [`option ${i}`, o]) : []),
      ['explanation', row?.explanation],
      ['referenceAnswer', row?.referenceAnswer],
      ['markingScheme', row?.markingScheme],
    ]
    for (const [where, val] of fields) {
      if (typeof val === 'string' && hasBareDollar(val)) e.push(`unescaped currency \`$\` in ${where} — use \`\\$\` (${subject} has no LaTeX math)`)
    }
  }

  return e
}

// Map an APPROVED, gated row → the app's Question shape (monolingual zh; UI falls back
// to zh in EN mode — same as the importer). `framework:'reviewed'` marks provenance so
// these are distinguishable from parametric / imported banks. No extra fields are added
// (keeps it assignable to Question[] with no excess-property errors).
export function toReviewedQuestion(row, subject) {
  const type = row.type ?? 'mc'
  // 課題 id 解析（2026-07-31）：
  //
  // 舊行為 —— `topic: slug(row.topic)`。草稿嘅 `topic` 一直係人類可讀標籤
  // （例如「二次方程」），slug 完仍然係中文，match 唔到任何已宣告 topic id
  // （例如 quadratic_equations），於是條題目變成孤兒課題，學生用課題入口
  // 永遠篩唔到（實測已造成 58 條）。
  //
  // 新增【可選】欄位 `topicId`：作者可以明確寫低真實 id，同時用 `topicZh`
  // （或 `topic`）做顯示標籤。純加法 —— 冇填 `topicId` 嘅現有草稿行為逐字不變，
  // 一條都唔會受影響。新草稿建議一律填，唔好再製造孤兒。
  const topicId = typeof row.topicId === 'string' && row.topicId.trim()
    ? row.topicId.trim()
    : slug(row.topic)
  const topicLabel = typeof row.topicZh === 'string' && row.topicZh.trim()
    ? row.topicZh.trim()
    : row.topic.trim()
  const base = {
    id: row.id.trim(),
    type,
    subject,
    topic: topicId,
    topicZh: topicLabel,
    framework: 'reviewed',
    frameworkZh: '人手核對題',
    frameworkEmoji: '✅',
    difficulty: DIFFICULTY_MAP[row.difficulty],
    year: 0,
    content: row.question.trim(),
    explanation: row.explanation.trim(),
  }

  if (type === 'mc') {
    return {
      ...base,
      options: row.options.map((o) => String(o).trim()),
      correctIndex: row.correctIndex,
      marks: 1,
    }
  }

  // text／long：刻意【唔輸出】options／correctIndex。呢兩個欄位一旦存在，
  // 前端或者日後嘅批改邏輯就有機會當佢係客觀題處理 —— 而呢個題型永不機器批改。
  const out = {
    ...base,
    referenceAnswer: row.referenceAnswer.trim(),
    // 長題目按實際分值計；文字題維持 1 分（同 MC 一致）。
    marks: type === 'long' ? (Number.isInteger(row.marks) ? row.marks : 1) : 1,
  }
  // 2026-08-07 修正：英文欄一直被丟棄。上方閘明明【要求】referenceAnswerEn 必須
  // 存在（否則英文介面嘅學生自評時冇嘢對照），但此處從未 copy 出去 —— 閘同
  // promoter 兩邊講唔同嘢，驗完就掉。首批長題入庫時實測 0/20 帶到英文欄。
  if (typeof row.referenceAnswerEn === 'string' && row.referenceAnswerEn.trim()) {
    out.referenceAnswerEn = row.referenceAnswerEn.trim()
  }
  if (typeof row.questionEn === 'string' && row.questionEn.trim()) out.contentEn = row.questionEn.trim()
  if (typeof row.explanationEn === 'string' && row.explanationEn.trim()) out.explanationEn = row.explanationEn.trim()
  if (type === 'long') {
    if (typeof row.markingScheme === 'string') out.markingScheme = row.markingScheme.trim()
    if (typeof row.markingSchemeEn === 'string' && row.markingSchemeEn.trim()) {
      out.markingSchemeEn = row.markingSchemeEn.trim()
    }
    if (Number.isInteger(row.suggestedMinutes)) out.suggestedMinutes = row.suggestedMinutes
  }
  return out
}
