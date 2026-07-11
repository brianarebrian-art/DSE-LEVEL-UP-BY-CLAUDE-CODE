// ============================================================================
// term-guard.mjs — HKEAA terminology + register gate (plain Node ESM, zero dep)
// ----------------------------------------------------------------------------
// Enforces the content red lines set by the subject reviewer (Carson) and the
// EDB C&A Guide, so a violation can never silently ship again:
//
//   (1) HKEAA terminology — anywhere in data/questions/:
//         「公共財」   ✗ → 「共用品」   ⭕ (Public Good, HK official term)
//         「企業家才能」✗ → 「企業家職能」⭕ (Entrepreneurship as factor)
//   (2) Economics syllabus scope — economics*.ts only. The EDB Economics C&A
//       supplementary document states verbatim: "(N.B. Point elasticity, cross
//       elasticity and income elasticity NOT required)". So:
//         收入彈性 / 交叉彈性 / 點彈性 / income|cross|point elasticity  ✗
//   (3) Written-Chinese register (標準書面語) — every bank EXCEPT the language
//       subjects (chinese*, english*, which legitimately quote colloquial or
//       literary usage): Cantonese colloquial markers and slang must not
//       appear in question content.
//
// Usage (from the project root):
//   node scripts/qbank/term-guard.mjs
// Exit code 1 on any violation (CI-friendly). Pairs with validate-banks.mjs.
// ============================================================================

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = fileURLToPath(new URL('../../data/questions/', import.meta.url))
const ROOT = fileURLToPath(new URL('../../', import.meta.url))

// (1) wrong terms — banned everywhere (HKEAA official terms on the right)
const BANNED_GLOBAL = [
  { re: /公共財/, fix: '共用品 (HKEAA term for Public Good)' },
  { re: /企業家才能/, fix: '企業家職能 (Entrepreneurship as factor of production)' },
]

// (2) out-of-syllabus elasticity — banned in economics files (EDB C&A: NOT required)
const BANNED_ECON = [
  { re: /收入(需求)?彈性|income[ -]elasticity|income elasticity/i, fix: 'remove — income elasticity is NOT in the DSE Economics syllabus' },
  { re: /交叉彈性|cross[ -](price )?elasticity/i, fix: 'remove — cross elasticity is NOT in the DSE Economics syllabus' },
  { re: /點彈性|point elasticity/i, fix: 'remove — point elasticity is NOT in the DSE Economics syllabus' },
]

// (3) Cantonese colloquial markers / slang — banned outside the language subjects.
// Single chars that exist ONLY in colloquial Cantonese, plus slang phrases.
const COLLOQUIAL = /[嘅噉冇嘢咗唔喺睇啲乜諗畀嗰嘥攞]|咁樣|秒殺|殺著|撈亂|搞反|搞錯|點樣|而家|依家|好似|邊個/

const isLanguageBank = (name) => /^(chinese|english)/.test(name)

let violations = 0
const report = (file, lineNo, rule, excerpt) => {
  violations++
  console.log(`  ❌ ${file}:${lineNo}  [${rule}]`)
  console.log(`     ${excerpt.trim().slice(0, 110)}`)
}

console.log(`\n${'═'.repeat(70)}\n  DSE Level Up — terminology & register gate (term-guard)\n${'═'.repeat(70)}\n`)

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.ts')).sort()) {
  const lines = readFileSync(join(DIR, file), 'utf8').split('\n')
  const isEcon = /^economics/.test(file)
  lines.forEach((line, i) => {
    for (const { re, fix } of BANNED_GLOBAL) if (re.test(line)) report(file, i + 1, `banned term → use ${fix}`, line)
    if (isEcon) for (const { re, fix } of BANNED_ECON) if (re.test(line)) report(file, i + 1, fix, line)
    if (!isLanguageBank(file) && COLLOQUIAL.test(line)) report(file, i + 1, '口語/俗語 — question content must be 標準書面語', line)
  })
}

// ── (4) 無紅字掃描（TOP20 #14，Kelly/Emma 情緒安全）：app/ + components/ 嘅
// 用戶可見文案禁止出現羞辱/罪疚字眼。名單收窄至高信度詞，避免誤傷代碼註解。
const RED_WORDS = /(?<![A-Za-z])FAIL(?![A-Za-z])|錯晒|廢柴|失敗者|你唔夠努力|你好廢|冇希望|差勁|無藥可救|冇得救/
function scanUiDir(dir) {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) { scanUiDir(rel); continue }
    if (!entry.name.endsWith('.tsx')) continue
    readFileSync(join(ROOT, rel), 'utf8').split('\n').forEach((line, i) => {
      const t = line.trim()
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return // 技術註解豁免（spec 白名單）
      if (RED_WORDS.test(line)) report(rel, i + 1, '情緒安全 — 用戶文案禁止羞辱/罪疚字眼', line)
    })
  }
}
scanUiDir('app')
scanUiDir('components')

console.log(`${'─'.repeat(70)}`)
if (violations === 0) {
  console.log(`  ✅ TERM GUARD PASSED — terminology, register and emotional-safety scans are clean.`)
} else {
  console.log(`  ❌ ${violations} violation(s) — fix before shipping.`)
}
console.log(`${'═'.repeat(70)}\n`)
process.exit(violations === 0 ? 0 : 1)
