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
  // P1-4 (Oscar 2026-07-16)：常見錯字 —— 「機會成本」嘅手民之誤
  { re: /期會成本/, fix: '機會成本 (typo)' },
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

// ── P1-4 科目常數/格式鎖（Oscar 2026-07-16）。全部「單位錨定」以防誤殺
// 計算結果啱好等於嗰個數字嘅正常選項（例如 49÷5=9.8 作為長度）。
// 物理：DSE 慣例 g = 10 m/s²，禁 9.8/9.81 掛住加速度單位出現
const BANNED_PHYSICS = [
  { re: /9\.8\d*\s*(m\s*\/?\s*s|N\s*\/?\s*kg|ms⁻²|米每秒)/i, fix: 'g must be 10 m/s² (DSE convention) — 9.8/9.81 掛單位出現即違規' },
]
// 化學：DSE 用 RTP 摩爾體積 24 dm³/mol，禁 STP 嘅 22.4 掛體積單位出現
const BANNED_CHEMISTRY = [
  { re: /22\.4\s*(dm|L\b|升|立方分米)/i, fix: 'molar volume must be 24 dm³/mol at RTP (DSE) — 22.4 係 STP 值' },
]
// BAFS：2026 起全面直式（Vertical Form）財務報表，禁橫式/T-Form 字眼。
// (?<![A-Za-z]) 防 "past accounts" 呢類英文子串誤殺。
const BANNED_BAFS = [
  { re: /(?<![A-Za-z])T[-\s]?(form|account)|丁字帳|T\s?字帳|橫式(帳|賬|報表)/i, fix: '2026 syllabus mandates Vertical Form — 橫式/T-Form 已廢除，不得出現於題目或解析' },
]
// 經濟：「企業」淨係喺「生產要素」語境先係 Entrepreneurship 誤譯（正解 = 企業家職能）。
// 指公司嘅「私人企業／企業破產」等唔喺紅線內 —— 收窄至同行有「要素」先觸發，防誤殺。
const BANNED_ECON_BARE_QIYE = {
  re: /(要素[^。]*(?<!家)企業(?!家))|((?<!家)企業(?!家)[^。]*要素)/,
  fix: '生產要素請寫「企業家職能」，唔可以淨寫「企業」',
}

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
  const isPhysics = /^physics/.test(file)
  const isChemistry = /^chemistry/.test(file)
  const isBafs = /^bafs/.test(file)
  lines.forEach((line, i) => {
    for (const { re, fix } of BANNED_GLOBAL) if (re.test(line)) report(file, i + 1, `banned term → use ${fix}`, line)
    if (isEcon) {
      for (const { re, fix } of BANNED_ECON) if (re.test(line)) report(file, i + 1, fix, line)
      if (BANNED_ECON_BARE_QIYE.re.test(line)) report(file, i + 1, BANNED_ECON_BARE_QIYE.fix, line)
    }
    if (isPhysics) for (const { re, fix } of BANNED_PHYSICS) if (re.test(line)) report(file, i + 1, fix, line)
    if (isChemistry) for (const { re, fix } of BANNED_CHEMISTRY) if (re.test(line)) report(file, i + 1, fix, line)
    if (isBafs) for (const { re, fix } of BANNED_BAFS) if (re.test(line)) report(file, i + 1, fix, line)
    if (!isLanguageBank(file) && COLLOQUIAL.test(line)) report(file, i + 1, '口語/俗語 — question content must be 標準書面語', line)
  })
}

// ── (4) 無紅字掃描（TOP20 #14，Kelly/Emma 情緒安全）：app/ + components/ 嘅
// 用戶可見文案禁止出現羞辱/罪疚字眼。名單收窄至高信度詞，避免誤傷代碼註解。
// 2026-07-15 加「弱項/落後/成績單」（設計規範文案紅線：→ 發現盲點/進步空間/溫書地圖）。
// 「排名/輸/差過」冇加：排行榜功能合法用「排名」，「輸/差」單字誤傷太多（輸入/差異）。
const RED_WORDS = /(?<![A-Za-z])FAIL(?![A-Za-z])|錯晒|廢柴|失敗者|你唔夠努力|你好廢|冇希望|差勁|無藥可救|冇得救|弱項|落後|成績單/
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
