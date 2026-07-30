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
    // 反向閘：唔准偷偷帶 MC 欄位扮客觀題。一旦帶咗，前端就可能誤當 MC render，
    // 甚至有人日後接上自動批改 —— 呢個係憲章紅線（長答案禁機器批改）嘅守門位。
    if (opts !== undefined) e.push(`${type} 題唔可以帶 \`options\`（呢個題型冇選項）`)
    if (row?.correctIndex !== undefined) e.push(`${type} 題唔可以帶 \`correctIndex\`（呢個題型冇客觀對錯）`)
    // long 題嘅評分準則屬選填，但一旦有就要係非空字串（免得攤開一片空白）
    if (row?.markingScheme !== undefined && (typeof row.markingScheme !== 'string' || !row.markingScheme.trim())) {
      e.push('markingScheme 如提供則不可為空')
    }
    if (row?.suggestedMinutes !== undefined && (!Number.isInteger(row.suggestedMinutes) || row.suggestedMinutes < 1 || row.suggestedMinutes > 60)) {
      e.push('suggestedMinutes 如提供須為 1..60 的整數')
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
  const base = {
    id: row.id.trim(),
    type,
    subject,
    topic: slug(row.topic),
    topicZh: row.topic.trim(),
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
  if (type === 'long') {
    if (typeof row.markingScheme === 'string') out.markingScheme = row.markingScheme.trim()
    if (Number.isInteger(row.suggestedMinutes)) out.suggestedMinutes = row.suggestedMinutes
  }
  return out
}
