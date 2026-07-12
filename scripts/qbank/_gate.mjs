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
const MIN_QUESTION_LEN = 5
const MIN_EXPLANATION_LEN = 10
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

// The OBJECTIVE gate for one raw draft row. Returns an array of hard errors; empty
// array = the row is well-formed and compliant enough to be shown to a human for the
// (subjective) correctness call. Non-empty = auto-rejected, never reaches a human.
export function gateRow(row, subject) {
  const e = []
  if (typeof row?.id !== 'string' || !row.id.trim()) e.push('missing/blank id')
  if (row?.type !== 'mc') e.push(`type must be "mc" (got ${JSON.stringify(row?.type)})`)
  if (typeof row?.topic !== 'string' || !row.topic.trim()) e.push('missing/blank topic')
  if (!(row?.difficulty in DIFFICULTY_MAP)) e.push(`difficulty must be basic|intermediate|hard (got ${JSON.stringify(row?.difficulty)})`)
  if (typeof row?.question !== 'string' || row.question.trim().length < MIN_QUESTION_LEN) e.push('question too short / missing')

  const opts = row?.options
  if (!Array.isArray(opts) || opts.length !== 4) {
    e.push(`options must be exactly 4 (got ${Array.isArray(opts) ? opts.length : 'non-array'})`)
  } else {
    if (opts.some((o) => typeof o !== 'string' || !o.trim())) e.push('an option is blank/non-string')
    if (new Set(opts.map(norm)).size !== opts.length) e.push('duplicate options')
    if (opts.some((o) => BANNED_OPTION_PATTERNS.some((p) => p.test(String(o))))) e.push('banned 「以上皆是/皆非 · all/none of the above」 option')
  }

  if (!Number.isInteger(row?.correctIndex) || row.correctIndex < 0 || row.correctIndex > 3) e.push('correctIndex must be an integer 0..3')
  if (typeof row?.explanation !== 'string' || row.explanation.trim().length < MIN_EXPLANATION_LEN) e.push('explanation too short / missing (詳細解釋 required)')

  // terminology / scope red lines across all visible text
  const blob = [row?.question, ...(Array.isArray(opts) ? opts : []), row?.explanation].filter((x) => typeof x === 'string').join('\n')
  for (const r of TERM_REDLINES) if (r.re.test(blob)) e.push(r.msg)
  if (subject === 'economics') for (const r of ECON_REDLINES) if (r.re.test(blob)) e.push(r.msg)

  // LaTeX hygiene
  if (typeof row?.question === 'string' && unbalancedDollars(row.question)) e.push('unbalanced `$` in question (LaTeX)')
  if (Array.isArray(opts)) opts.forEach((o, i) => { if (typeof o === 'string' && unbalancedDollars(o)) e.push(`unbalanced \`$\` in option ${i}`) })

  return e
}

// Map an APPROVED, gated row → the app's Question shape (monolingual zh; UI falls back
// to zh in EN mode — same as the importer). `framework:'reviewed'` marks provenance so
// these are distinguishable from parametric / imported banks. No extra fields are added
// (keeps it assignable to Question[] with no excess-property errors).
export function toReviewedQuestion(row, subject) {
  return {
    id: row.id.trim(),
    type: 'mc',
    subject,
    topic: slug(row.topic),
    topicZh: row.topic.trim(),
    framework: 'reviewed',
    frameworkZh: '人手核對題',
    frameworkEmoji: '✅',
    difficulty: DIFFICULTY_MAP[row.difficulty],
    year: 0,
    content: row.question.trim(),
    options: row.options.map((o) => String(o).trim()),
    correctIndex: row.correctIndex,
    explanation: row.explanation.trim(),
    marks: 1,
  }
}
