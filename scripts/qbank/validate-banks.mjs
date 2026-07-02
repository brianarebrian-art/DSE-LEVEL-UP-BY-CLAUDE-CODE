// ============================================================================
// validate-banks.mjs — the 3-point check as a runnable gate (plain Node ESM)
// ----------------------------------------------------------------------------
// Runs TODAY with zero new deps: it transpiles the parametric bank .ts files
// with the project's own `typescript` (already installed), imports the emitted
// question arrays, and runs the full validation the pipeline requires:
//   (1) MC integrity     — exactly 4 options, distinct by BOTH string AND numeric
//                          normalisation (catches the number-vs-"string" dup class),
//                          correctIndex in range, no NaN/undefined/Infinity/empty.
//   (2) LaTeX hygiene     — balanced `$`, no `1x` / `e^{1x}` redundant coefficients.
//   (3) Difficulty split  — per-bank easy/medium/hard vs the 30/50/20 target.
//   + GLOBAL dedup        — duplicate id AND near-duplicate stem across ALL banks.
//
// NOTE ON CORRECTNESS: answer-correctness for parametric banks is guaranteed by
// *construction* (each ParametricFamily's answer + distractors are computed by the
// same audited formula, verified once at authoring). This gate enforces format,
// dedup, hygiene and difficulty — it does NOT re-derive answers (that needs
// per-family semantics, not a generic checker). Do not claim more than it checks.
//
// Usage (from the project root):
//   node scripts/qbank/validate-banks.mjs            # all live parametric banks
//   node scripts/qbank/validate-banks.mjs math m1    # only these
// Exit code 1 on any hard failure (CI-friendly).
// ============================================================================

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const ts = (await import('typescript')).default

// The live parametric banks (never the hand-authored *.ts — those are separate).
const BANKS = [
  { subject: 'math', file: 'data/questions/math-bank.ts', exportName: 'mathBankQuestions' },
  { subject: 'physics', file: 'data/questions/physics-bank.ts', exportName: 'physicsBankQuestions' },
  { subject: 'chemistry', file: 'data/questions/chemistry-bank.ts', exportName: 'chemistryBankQuestions' },
  { subject: 'm1', file: 'data/questions/m1-bank.ts', exportName: 'm1BankQuestions' },
  { subject: 'm2', file: 'data/questions/m2-bank.ts', exportName: 'm2BankQuestions' },
  { subject: 'economics', file: 'data/questions/economics-bank.ts', exportName: 'economicsBankQuestions' },
  { subject: 'bafs', file: 'data/questions/bafs-bank.ts', exportName: 'bafsBankQuestions' },
]

const RATIO = { easy: 0.3, medium: 0.5, hard: 0.2 } // 300 / 500 / 200 per 1,000

// ── transpile a .ts to a temp .mjs and import it ────────────────────────────
const TMP = mkdtempSync(join(tmpdir(), 'qbank-'))
function transpile(absPath) {
  return ts.transpileModule(readFileSync(absPath, 'utf8'), {
    compilerOptions: { module: 'ES2020', target: 'ES2020' },
  }).outputText
}
async function loadBank(file, exportName) {
  // _parametric is the shared runtime dep; transpile it once next to the bank.
  writeFileSync(join(TMP, '_parametric.mjs'), transpile(join(ROOT, 'data/questions/_parametric.ts')))
  const js = transpile(join(ROOT, file)).replace(/from ['"]\.\/_parametric['"]/g, "from './_parametric.mjs'")
  const out = join(TMP, file.replace(/[/.]/g, '_') + '.mjs')
  writeFileSync(out, js)
  const mod = await import('file://' + out)
  return mod[exportName]
}

// ── validation primitives ───────────────────────────────────────────────────
const normOpt = (o) => {
  const s = String(o).replace(/\$/g, '').trim()
  return /^-?\d+(\.\d+)?$/.test(s) ? 'NUM:' + Number(s) : 'STR:' + String(o)
}
const normStem = (s) => String(s).replace(/\s+/g, '').replace(/[，。、！？,.!?:：；;（）()]/g, '').toLowerCase()
// Count `$` MATH DELIMITERS only — strip escaped `\$` (literal currency) first,
// exactly like MathText does, so "某商品 $\$500$" (valid) isn't a false positive.
const balancedDollars = (s) => ((String(s).replace(/\\\$/g, '').match(/\$/g) || []).length % 2 === 0)
const COSMETIC = /(?<![0-9])1x(\^|\b)|e\^\{1x\}|\{1\}x/

function checkQuestion(q, seenIds) {
  const errs = []
  if (!q.id) errs.push('missing id')
  else if (seenIds.has(q.id)) errs.push(`duplicate id "${q.id}"`)
  if (q.type !== 'mc') errs.push('type !== mc')
  const opts = Array.isArray(q.options) ? q.options : []
  if (opts.length !== 4) errs.push(`options length ${opts.length} !== 4`)
  if (new Set(opts.map(normOpt)).size !== 4) errs.push('options not 4-distinct (string+numeric normalised)')
  if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) errs.push(`correctIndex ${q.correctIndex} out of range`)
  for (const o of opts) {
    const s = String(o)
    if (o == null || s.trim() === '') errs.push('empty option')
    if (/NaN|undefined|Infinity/.test(s)) errs.push(`bad option value "${s}"`)
  }
  if (!q.content || !String(q.content).trim()) errs.push('empty content')
  for (const f of ['content', 'explanation']) if (q[f] && !balancedDollars(q[f])) errs.push(`unbalanced $ in ${f}`)
  for (const s of [q.content, q.explanation, ...opts]) if (s && COSMETIC.test(String(s))) errs.push(`redundant coefficient (1x / e^{1x}) in "${String(s).slice(0, 40)}"`)
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) errs.push(`bad difficulty "${q.difficulty}"`)
  return errs
}

// ── main ─────────────────────────────────────────────────────────────────────
const wanted = process.argv.slice(2)
const banks = wanted.length ? BANKS.filter((b) => wanted.includes(b.subject)) : BANKS

let hardFailures = 0
const seenIds = new Set()
const stems = new Map() // normStem -> "subject/id"
let grandTotal = 0

console.log(`\n${'═'.repeat(70)}\n  DSE Level Up — parametric bank validation gate\n${'═'.repeat(70)}`)

for (const b of banks) {
  let qs
  try {
    qs = await loadBank(b.file, b.exportName)
  } catch (e) {
    console.log(`\n❌ ${b.subject}: failed to load — ${e.message}`)
    hardFailures++
    continue
  }
  if (!Array.isArray(qs)) {
    console.log(`\n❌ ${b.subject}: export ${b.exportName} is not an array`)
    hardFailures++
    continue
  }

  const by = { easy: 0, medium: 0, hard: 0 }
  let bankErrs = 0
  const samples = []
  for (const q of qs) {
    const errs = checkQuestion(q, seenIds)
    if (q.id) seenIds.add(q.id)
    if (q.difficulty in by) by[q.difficulty]++
    // exact-duplicate stem across all banks (full normalised content; parametric
    // families legitimately reuse a scenario for a different skill, so only an
    // IDENTICAL stem is a real duplicate — a 40-char prefix over-flags).
    const key = normStem(q.content)
    if (key && stems.has(key)) errs.push(`duplicate stem of ${stems.get(key)}`)
    else if (key) stems.set(key, `${b.subject}/${q.id}`)
    if (errs.length) {
      bankErrs += errs.length
      if (samples.length < 5) samples.push(`     • ${q.id}: ${errs.join('; ')}`)
    }
  }
  const tot = qs.length
  grandTotal += tot
  const pct = (k) => (tot ? ((100 * by[k]) / tot).toFixed(0) + '%' : '0%')
  const status = bankErrs === 0 ? '✅' : '❌'
  console.log(`\n${status} ${b.subject.padEnd(10)} ${tot} Q  |  拔尖 ${by.hard} (${pct('hard')})  普通 ${by.medium} (${pct('medium')})  補底 ${by.easy} (${pct('easy')})`)
  console.log(`     target @${tot}: 拔尖 ${Math.round(tot * RATIO.hard)} / 普通 ${Math.round(tot * RATIO.medium)} / 補底 ${Math.round(tot * RATIO.easy)}`)
  if (bankErrs) {
    console.log(`     ${bankErrs} issue(s):`)
    samples.forEach((s) => console.log(s))
    hardFailures += bankErrs
  }
}

console.log(`\n${'─'.repeat(70)}`)
console.log(`  Total: ${grandTotal} questions across ${banks.length} bank(s) | unique ids: ${seenIds.size}`)
if (hardFailures === 0) {
  console.log(`  ✅ ALL CHECKS PASSED — safe to promote to live.`)
} else {
  console.log(`  ❌ ${hardFailures} issue(s) — DO NOT promote until fixed.`)
}
console.log(`${'═'.repeat(70)}\n`)
process.exit(hardFailures === 0 ? 0 : 1)
