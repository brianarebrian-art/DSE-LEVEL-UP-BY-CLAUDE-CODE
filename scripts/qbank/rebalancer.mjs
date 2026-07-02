// ============================================================================
// rebalancer.mjs — difficulty-ratio monitor + control logic (plain Node ESM)
// ----------------------------------------------------------------------------
// Reports each bank's live easy/medium/hard split against the 300/500/200
// (30/50/20) target for a 1,000-question subject, and tells you EXACTLY how many
// of each tier to add (or trim), broken down by ParametricFamily — so you know
// which family's loop range to widen/narrow next. This is the "ratio control"
// the pipeline needs; it does not mutate banks (widening a family's range is a
// deliberate, verified edit — never an automated one).
//
// Runs TODAY, zero deps beyond the project's own `typescript`.
//   node scripts/qbank/rebalancer.mjs                 # all banks, target 1000
//   node scripts/qbank/rebalancer.mjs math 1000       # one bank + custom target
// ============================================================================

import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const ts = (await import('typescript')).default

const BANKS = [
  { subject: 'math', file: 'data/questions/math-bank.ts', exportName: 'mathBankQuestions' },
  { subject: 'physics', file: 'data/questions/physics-bank.ts', exportName: 'physicsBankQuestions' },
  { subject: 'chemistry', file: 'data/questions/chemistry-bank.ts', exportName: 'chemistryBankQuestions' },
  { subject: 'm1', file: 'data/questions/m1-bank.ts', exportName: 'm1BankQuestions' },
  { subject: 'm2', file: 'data/questions/m2-bank.ts', exportName: 'm2BankQuestions' },
  { subject: 'economics', file: 'data/questions/economics-bank.ts', exportName: 'economicsBankQuestions' },
  { subject: 'bafs', file: 'data/questions/bafs-bank.ts', exportName: 'bafsBankQuestions' },
]
const RATIO = { easy: 0.3, medium: 0.5, hard: 0.2 }

const TMP = mkdtempSync(join(tmpdir(), 'qbank-rb-'))
const transpile = (abs) => ts.transpileModule(readFileSync(abs, 'utf8'), { compilerOptions: { module: 'ES2020', target: 'ES2020' } }).outputText
async function loadBank(file, exportName) {
  writeFileSync(join(TMP, '_parametric.mjs'), transpile(join(ROOT, 'data/questions/_parametric.ts')))
  const js = transpile(join(ROOT, file)).replace(/from ['"]\.\/_parametric['"]/g, "from './_parametric.mjs'")
  const out = join(TMP, file.replace(/[/.]/g, '_') + '.mjs')
  writeFileSync(out, js)
  return (await import('file://' + out))[exportName]
}

// family key = id up to the first numeric segment ("mb_e1_2_3" -> "mb_e1")
function famKey(id) {
  const out = []
  for (const s of String(id).split('_')) { if (/^-?\d/.test(s)) break; out.push(s) }
  return out.join('_')
}

const args = process.argv.slice(2)
const subjArg = args.find((a) => !/^\d+$/.test(a))
const target = Number(args.find((a) => /^\d+$/.test(a))) || 1000
const banks = subjArg ? BANKS.filter((b) => b.subject === subjArg) : BANKS

const want = { easy: Math.round(target * RATIO.easy), medium: Math.round(target * RATIO.medium), hard: Math.round(target * RATIO.hard) }

console.log(`\n${'═'.repeat(72)}\n  Rebalancer — target ${target}/subject  (拔尖 ${want.hard} / 普通 ${want.medium} / 補底 ${want.easy})\n${'═'.repeat(72)}`)

for (const b of banks) {
  const qs = await loadBank(b.file, b.exportName)
  const by = { easy: 0, medium: 0, hard: 0 }
  const fams = {} // famKey -> { difficulty, count }
  for (const q of qs) {
    by[q.difficulty]++
    const k = famKey(q.id)
    ;(fams[k] ??= { difficulty: q.difficulty, count: 0 }).count++
  }
  const tot = qs.length
  console.log(`\n▍${b.subject}  —  ${tot} / ${target}  (${((100 * tot) / target).toFixed(0)}% of target)`)
  for (const d of ['easy', 'medium', 'hard']) {
    const label = { easy: '補底 easy  ', medium: '普通 medium', hard: '拔尖 hard  ' }[d]
    const gap = want[d] - by[d]
    const sign = gap > 0 ? `➕ add ${gap}` : gap < 0 ? `➖ trim ${-gap}` : '✓ on target'
    console.log(`   ${label}: ${String(by[d]).padStart(4)} / ${want[d]}   ${sign}`)
  }
  // families grouped by tier, so you know which loops to widen/narrow
  for (const d of ['easy', 'medium', 'hard']) {
    const list = Object.entries(fams).filter(([, v]) => v.difficulty === d).sort((a, b2) => b2[1].count - a[1].count)
    if (list.length) console.log(`     ${d} families: ${list.map(([k, v]) => `${k}(${v.count})`).join('  ')}`)
  }
}

console.log(`\n${'─'.repeat(72)}\n  Control logic: to reach exact ${want.easy}/${want.medium}/${want.hard}, widen the loop`)
console.log(`  ranges of the under-target tiers' families (each extra parameter tuple = more`)
console.log(`  questions), then re-run validate-banks.mjs before promoting. No auto-mutation.`)
console.log(`${'═'.repeat(72)}\n`)
