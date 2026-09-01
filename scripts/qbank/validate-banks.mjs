// ============================================================================
// validate-banks.mjs — the 3-point check as a runnable gate (plain Node ESM)
// ----------------------------------------------------------------------------
// Runs TODAY with zero new deps: it transpiles the parametric bank .ts files
// with the project's own `typescript` (already installed), imports the emitted
// question arrays, and runs the full validation the pipeline requires:
//   (1) MC integrity     — exactly 4 options, distinct by BOTH string AND numeric
//                          normalisation (catches the number-vs-"string" dup class),
//                          correctIndex in range, no NaN/undefined/Infinity/empty.
//   (2) LaTeX hygiene     — balanced `$`, no `1x` / `e^{1x}` redundant coefficients,
//                          AND every `$…$` span actually parses under KaTeX.
//
//       ⚠️  2026-08-28：本檔原本只驗 `$` 配對，【不驗大括號配對】。實測後果：
//       一個把 `\mathrm{Mg^{2+}}` 用正則切成 `Mg}` 的母模板，輸出
//       `$\mathrm{Mg}Cl_2}$`（多一個右括號）而本閘一路綠燈。同時揭出
//       chemistry-bank 有 73 條寫成 `\text{H_2O}` —— `\text{}` 會切去文字模式，
//       底線不再是下標語法，KaTeX 直接 parse error，學生見到的是壞掉的公式。
//       所以「$ 配對」這種淺層檢查不足夠：唯一可靠的驗證是【真的渲染一次】。
//       加入本檢查時實測影響：修好那 73 條之後，七個題庫零條 fail。
//   (3) Difficulty split  — per-bank easy/medium/hard vs the 30/50/20 target.
//   + dedup (本檔範圍內)  — duplicate id / identical stem among the 7 parametric
//                          banks listed in BANKS below.
//
// ⚠️  本檔【唔係】全站檢查。BANKS 係一張寫死嘅 7 個 parametric bank 清單，
//     掃到 1,762 條，而全站實有 6,210 條 —— 補底批次（*-floor-batch*.ts）
//     同 *-auto.ts 全部唔喺呢度。2026-08-28 之前檔頭寫住「across ALL banks」，
//     於是連續五個補底批次都報過「validate-banks 通過」，而佢一條都冇睇過。
//
//     全站撞題檢查而家喺 data/questions/__tests__/global-dedup.test.mts，
//     行 `npm test` 必定會跑，唔使人記得。本檔保留原本職責：
//     為【參數化題庫】做 MC 完整性、LaTeX 衞生同 30/50/20 難度比例。
//     難度比例故意唔套落補底批次 —— 補底本來就係全淺題，套上去必紅。
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
// KaTeX 用於「真的渲染一次」檢查。載入失敗時降級為跳過並明示，不靜靜放行。
let KATEX = null
try { KATEX = (await import('katex')).default } catch { console.log('  ⚠️  katex 載入失敗 —— 已跳過渲染檢查（其餘檢查照跑）') }
const _warn = console.warn; console.warn = () => {} // KaTeX 對 CJK 的 strict 警告與本檢查無關

// The live parametric banks (never the hand-authored *.ts — those are separate).
const BANKS = [
  { subject: 'math', file: 'data/questions/math-bank.ts', exportName: 'mathBankQuestions' },
  { subject: 'physics', file: 'data/questions/physics-bank.ts', exportName: 'physicsBankQuestions' },
  { subject: 'chemistry', file: 'data/questions/chemistry-bank.ts', exportName: 'chemistryBankQuestions' },
  { subject: 'm1', file: 'data/questions/m1-bank.ts', exportName: 'm1BankQuestions' },
  { subject: 'm2', file: 'data/questions/m2-bank.ts', exportName: 'm2BankQuestions' },
  { subject: 'economics', file: 'data/questions/economics-bank.ts', exportName: 'economicsBankQuestions' },
  { subject: 'bafs', file: 'data/questions/bafs-bank.ts', exportName: 'bafsBankQuestions' },
  // 應用科目計算型題庫（六科共用一個檔案，見該檔頭部說明）。
  // 一個新 bank 若不登記在此，本閘會靜靜略過它 —— 綠燈但沒有掃過。
  { subject: 'ict', file: 'data/questions/ict-bank.ts', exportName: 'ictBank3Questions' },
  { subject: 'biology', file: 'data/questions/biology-bank.ts', exportName: 'biologyBank3Questions' },
  { subject: 'geography', file: 'data/questions/geography-bank.ts', exportName: 'geographyBank2Questions' },
  { subject: 'music', file: 'data/questions/music-bank.ts', exportName: 'musicBank3Questions' },
  { subject: 'technology-living', file: 'data/questions/technology-living-bank.ts', exportName: 'technologyLivingBank3Questions' },
  { subject: 'pe', file: 'data/questions/pe-bank.ts', exportName: 'peBank3Questions' },
  { subject: 'design-tech', file: 'data/questions/design-tech-bank.ts', exportName: 'designTechBank3Questions' },
  { subject: 'health-management', file: 'data/questions/health-management-bank.ts', exportName: 'healthManagementBank2Questions' },
  { subject: 'visual-arts', file: 'data/questions/visual-arts-bank.ts', exportName: 'visualArtsBank2Questions' },
  { subject: 'ths', file: 'data/questions/applied-banks.ts', exportName: 'thsBankQuestions' },
  { subject: 'technology-living', file: 'data/questions/applied-banks.ts', exportName: 'technologyLivingBankQuestions' },
  { subject: 'design-tech', file: 'data/questions/applied-banks.ts', exportName: 'designTechBankQuestions' },
  { subject: 'pe', file: 'data/questions/applied-banks.ts', exportName: 'peBankQuestions' },
  { subject: 'biology', file: 'data/questions/applied-banks.ts', exportName: 'biologyBankQuestions' },
  { subject: 'music', file: 'data/questions/applied-banks.ts', exportName: 'musicBankQuestions' },
  { subject: 'ict', file: 'data/questions/applied-banks.ts', exportName: 'ictBankQuestions' },
  { subject: 'geography', file: 'data/questions/applied-banks.ts', exportName: 'geographyBankQuestions' },
  { subject: 'biology', file: 'data/questions/applied-banks.ts', exportName: 'biologyBank2Questions' },
  { subject: 'health-management', file: 'data/questions/applied-banks.ts', exportName: 'healthManagementBankQuestions' },
  { subject: 'pe', file: 'data/questions/applied-banks.ts', exportName: 'peBank2Questions' },
  { subject: 'ths', file: 'data/questions/applied-banks.ts', exportName: 'thsBank2Questions' },
  { subject: 'technology-living', file: 'data/questions/applied-banks.ts', exportName: 'technologyLivingBank2Questions' },
  { subject: 'ict', file: 'data/questions/applied-banks.ts', exportName: 'ictBank2Questions' },
  { subject: 'music', file: 'data/questions/applied-banks.ts', exportName: 'musicBank2Questions' },
  { subject: 'design-tech', file: 'data/questions/applied-banks.ts', exportName: 'designTechBank2Questions' },
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
  // Shared runtime deps of a bank file; transpile them once next to the bank.
  //   _parametric — createBank / formatting helpers (every bank)
  //   _builder    — topicList, used since 2026-07-28 so each bank exports its own
  //                 課題清單 (see the topic-coverage audit); without this the
  //                 import would dangle and every bank "failed to load".
  for (const dep of ['_parametric', '_builder']) {
    writeFileSync(join(TMP, `${dep}.mjs`), transpile(join(ROOT, `data/questions/${dep}.ts`)))
  }
  const js = transpile(join(ROOT, file)).replace(
    /from ['"]\.\/(_parametric|_builder)['"]/g,
    "from './$1.mjs'",
  )
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

// ── 抽出所有數學區段 ────────────────────────────────────────────────────────
// 逐字掃描：遇到反斜線就連下一個字一併跳過，所以數學模式內的 `\$`（金額）
// 不會被誤當成分界符。用正則 /(?<!\\)\$([^$]+)\$/ 做這件事會在
// `$\$200$` 上切出一個孤立的 `\`，製造 30 條假陽性（實測）。
function mathSpans(str) {
  const out = []
  let i = 0, open = -1
  const s = String(str)
  while (i < s.length) {
    if (s[i] === '\\') { i += 2; continue }
    if (s[i] === '$') { if (open < 0) open = i; else { out.push(s.slice(open + 1, i)); open = -1 } }
    i++
  }
  return out
}

/** 每個數學區段都要真的渲染得到。strict:false 對齊 MathText 的 live 行為。 */
function katexErrors(katex, s) {
  const errs = []
  for (const span of mathSpans(s)) {
    try { katex.renderToString(span, { throwOnError: true, strict: false }) }
    catch (e) { errs.push(`KaTeX parse failed on "${span.slice(0, 32)}" — ${String(e.message).slice(0, 60)}`) }
  }
  return errs
}
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
  if (KATEX) for (const f of ['content', 'contentEn', 'explanation', 'explanationEn']) {
    if (q[f]) for (const e of katexErrors(KATEX, q[f])) errs.push(`${f}: ${e}`)
  }
  if (KATEX) for (const o of opts) for (const e of katexErrors(KATEX, o)) errs.push(`option: ${e}`)
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

console.log(`\n${'═'.repeat(70)}\n  DSE Level Up — parametric bank validation gate（7 個參數化題庫，非全站）\n${'═'.repeat(70)}`)

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
console.log(`  Total: ${grandTotal} questions across ${banks.length} parametric bank(s) | unique ids: ${seenIds.size}`)
console.log(`  ⚠️  本檔唔掃補底批次同 *-auto.ts。全站撞題檢查行 npm test（global-dedup.test.mts）。`)
if (hardFailures === 0) {
  console.log(`  ✅ 參數化題庫檢查全部通過（唔代表全站 —— 全站撞題見 npm test）。`)
} else {
  console.log(`  ❌ ${hardFailures} issue(s) — DO NOT promote until fixed.`)
}
console.log(`${'═'.repeat(70)}\n`)
process.exit(hardFailures === 0 ? 0 : 1)
