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
//   (4) Subject-scoped term + out-of-syllabus red lines consolidated from the
//       162-staff content roadmap (2026-07-26). ONLY unambiguous wrong→right
//       pairs whose wrong form has 0 legitimate use, each scoped to its subject
//       file so existing correct content never trips (verified against banks):
//         econ:        公共物品  ✗ → 共用品   ⭕ (Public Good; 公共財 already global)
//         geography:   天氣化    ✗ → 風化作用 ⭕ (Weathering — not a literal 天氣 rendering)
//         math/M1/M2:  洛必達 (L'Hôpital) / 偏微分 (partial differentiation) ✗ — out of DSE syllabus
//       (Terms like MICE / Limited Liability / CAD-CAM in the roadmap name a
//        correct term but no unambiguous wrong form, so they are NOT gated here —
//        a ban that false-positives on correct content is worse than no ban.)
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

// (2) econ-scoped — out-of-syllabus elasticity (EDB C&A: NOT required) + HK term
const BANNED_ECON = [
  { re: /收入(需求)?彈性|income[ -]elasticity|income elasticity/i, fix: 'remove — income elasticity is NOT in the DSE Economics syllabus' },
  { re: /交叉彈性|cross[ -](price )?elasticity/i, fix: 'remove — cross elasticity is NOT in the DSE Economics syllabus' },
  { re: /點彈性|point elasticity/i, fix: 'remove — point elasticity is NOT in the DSE Economics syllabus' },
  // 162-roadmap L28 (Yuna)：Public Good 官方譯「共用品」，唔可以寫「公共物品」
  //（「公共財」已由 BANNED_GLOBAL 全域攔截）。收窄至 econ 檔，免誤傷他科泛指「公共物品」。
  { re: /公共物品/, fix: '共用品 (HKEAA term for Public Good — 公共物品 is not the DSE term)' },
]

// (3) Cantonese colloquial markers / slang — banned outside the language subjects.
// Single chars that exist ONLY in colloquial Cantonese, plus slang phrases.
const COLLOQUIAL = /[嘅噉冇嘢咗唔喺睇啲乜諗畀嗰嘥攞]|咁樣|秒殺|殺著|撈亂|搞反|搞錯|點樣|而家|依家|好似|邊個/

// 口語 → 書面語建議對照（Oscar 2026-08-13）。
//
// 原本 COLLOQUIAL 命中只印一句通用訊息「question content must be 標準書面語」，
// 唔會講應該改成乜。BANNED_* 各表一直都帶 `fix` 欄，口語表獨缺，令改稿者要自己
// 逐個查。此表補回同一種提示，命中時直接印出建議寫法。
//
// ⚠️ 只收【單向明確】嘅對照。一詞多義者一律留空（回退通用訊息），寧可少提示，
// 唔好提示錯：例如「好似」可解「猶如」亦可解「例如」，「睇」可解「觀察」「閱讀」
// 「診斷」，按上下文而定，機器判斷唔到就唔應該亂建議。
const COLLOQUIAL_FIX = [
  [/而家|依家/, '現時／目前'],
  [/點樣/, '如何'],
  [/邊個/, '哪一個'],
  [/咁樣|噉/, '這樣'],
  [/秒殺|殺著/, '快速解法（避免誇張語）'],
  [/撈亂/, '混淆'],
  [/搞反/, '顛倒'],
  [/搞錯/, '誤解'],
  [/嘥/, '浪費'],
  [/冇/, '沒有'],
  [/唔/, '不'],
  [/喺/, '在'],
  [/嘅/, '的'],
  [/咗/, '了'],
  [/嘢/, '事物'],
  [/啲/, '些'],
  [/乜/, '什麼'],
  [/嗰/, '那'],
  [/諗/, '思考'],
  [/畀/, '給予'],
  [/攞/, '取得'],
]
const colloquialHint = (line) => {
  const hits = COLLOQUIAL_FIX.filter(([re]) => re.test(line)).map(([, fix]) => fix)
  return hits.length ? ` → 建議：${[...new Set(hits)].join('、')}` : ''
}

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
// 地理：Weathering 官方譯「風化作用」，嚴禁直譯「天氣化」(162-roadmap L424, Ursula)。
// 「天氣化」無任何正當用法 → 安全 ban；scope 至 geography 檔。
const BANNED_GEOGRAPHY = [
  { re: /天氣化/, fix: '風化作用 (Weathering — 「天氣化」係字面誤譯，非 HKEAA 術語)' },
]
// 數學/M1/M2：超綱解法。洛必達法則、偏微分唔喺 DSE 課程 (162-roadmap L218, Victor)。
// 同 econ 超綱彈性一樣做法：呢啲詞喺 DSE 範圍內無正當出現，安全 ban。
const BANNED_MATH = [
  { re: /洛必達|羅必達|l['']?h[oô]pital/i, fix: "remove — L'Hôpital's rule is NOT in the DSE Mathematics syllabus" },
  { re: /偏微分|偏導(數|函數)|partial (differentiation|derivative)/i, fix: 'remove — partial differentiation is NOT in the DSE Mathematics/M1/M2 syllabus' },
  // 2026-07-29 譯名紅線：normal distribution 一律譯「正態分佈」。
  // 依據：教育局課程發展議會與香港考試及評核局聯合編訂《數學課程及評估指引（中四至中六）》
  // （2015）—— 全文 145 頁，「正態」見於 6 頁（M1 學習單位 18 至 20），另一譯法 0 頁。
  // 統一前題庫兩種譯法並存，介面出現兩個意義相同的課題入口。
  { re: /常態分佈|常態分布|常態變量/, fix: '正態分佈 (normal distribution — 教育局／考評局《數學課程及評估指引》採「正態」，「常態」非香港課程用語)' },
]

// ICT：normalisation 官方譯「規範化」。依據：教育局《資訊及通訊科技科常用英漢辭彙》
//（technology-edu/resources/computer-edu/ICT_glossary.pdf，2023 年 1 月更新）——
// 「normalisation → 規範化；規格化」，全表無「正規化」。「正規化」屬台灣／內地譯法。
// 加閘前已量影響範圍：修正 ict.ts 兩處後，data/questions/ 餘下 0 處，故零遷移成本。
// ⚠️ 同一份辭彙表列明 1NF/2NF/3NF 官方譯「第一／第二／第三範式」，**不是**「正規形」。
// 切勿反向加閘：chinese.ts 亦有一處「正確範式」屬一般用法，任何「範式」規則都會誤殺。
const BANNED_ICT = [
  { re: /正規化/, fix: '規範化 (normalisation — 教育局《ICT 常用英漢辭彙》採「規範化；規格化」)' },
]

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
  const isGeography = /^geography/.test(file)
  const isMath = /^(math|m1|m2)/.test(file)
  const isIct = /^ict/.test(file)
  lines.forEach((line, i) => {
    for (const { re, fix } of BANNED_GLOBAL) if (re.test(line)) report(file, i + 1, `banned term → use ${fix}`, line)
    if (isEcon) {
      for (const { re, fix } of BANNED_ECON) if (re.test(line)) report(file, i + 1, fix, line)
      if (BANNED_ECON_BARE_QIYE.re.test(line)) report(file, i + 1, BANNED_ECON_BARE_QIYE.fix, line)
    }
    if (isPhysics) for (const { re, fix } of BANNED_PHYSICS) if (re.test(line)) report(file, i + 1, fix, line)
    if (isChemistry) for (const { re, fix } of BANNED_CHEMISTRY) if (re.test(line)) report(file, i + 1, fix, line)
    if (isBafs) for (const { re, fix } of BANNED_BAFS) if (re.test(line)) report(file, i + 1, fix, line)
    if (isGeography) for (const { re, fix } of BANNED_GEOGRAPHY) if (re.test(line)) report(file, i + 1, fix, line)
    if (isMath) for (const { re, fix } of BANNED_MATH) if (re.test(line)) report(file, i + 1, fix, line)
    if (isIct) for (const { re, fix } of BANNED_ICT) if (re.test(line)) report(file, i + 1, fix, line)
    if (!isLanguageBank(file) && COLLOQUIAL.test(line))
      report(file, i + 1, `口語/俗語 — question content must be 標準書面語${colloquialHint(line)}`, line)
  })
}

// ── (4) 無紅字掃描（TOP20 #14，Kelly/Emma 情緒安全）：app/ + components/ 嘅
// 用戶可見文案禁止出現羞辱/罪疚字眼。名單收窄至高信度詞，避免誤傷代碼註解。
// 2026-07-15 加「弱項/落後/成績單」（設計規範文案紅線：→ 發現盲點/進步空間/溫書地圖）。
// 「排名/輸/差過」冇加：排行榜功能合法用「排名」，「輸/差」單字誤傷太多（輸入/差異）。
const RED_WORDS = /(?<![A-Za-z])FAIL(?![A-Za-z])|錯晒|廢柴|失敗者|你唔夠努力|你好廢|冇希望|差勁|無藥可救|冇得救|弱項|落後|成績單/
const scanCopyFile = (rel) => {
  readFileSync(join(ROOT, rel), 'utf8').split('\n').forEach((line, i) => {
    const t = line.trim()
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return // 技術註解豁免（spec 白名單）
    if (RED_WORDS.test(line)) report(rel, i + 1, '情緒安全 — 用戶文案禁止羞辱/罪疚字眼', line)
  })
}
function scanUiDir(dir) {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`
    if (entry.isDirectory()) { scanUiDir(rel); continue }
    // 2026-08-13 由 .tsx 擴至 .ts：文案唔止住喺 component 入面，route handler
    // 同 metadata 檔（.ts）一樣會出用戶可見字句。
    if (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) continue
    scanCopyFile(rel)
  }
}
scanUiDir('app')
scanUiDir('components')

// ── 情緒安全掃描：app/ + components/ 以外嘅【文案來源檔】────────────────────
// 2026-08-13 補漏。原本 scanUiDir 只行 app/ 同 components/，於是全站兩大文案
// 集中地反而完全冇受檢：
//   lib/dictionary.ts   —— 全站中英對照字串表（footer 免責聲明亦喺此）
//   lib/i18n.tsx        —— locale provider，亦夾雜少量字串
//   data/heroContent.ts —— 主頁 hero 六季文案，係最多人見到嘅一段字
// 呢幾個檔一旦寫入羞辱/罪疚字眼，會直接出現喺首屏，卻唔會被任何閘攔住。
for (const rel of ['lib/dictionary.ts', 'lib/i18n.tsx', 'data/heroContent.ts']) scanCopyFile(rel)

console.log(`${'─'.repeat(70)}`)
if (violations === 0) {
  console.log(`  ✅ TERM GUARD PASSED — terminology, register and emotional-safety scans are clean.`)
} else {
  console.log(`  ❌ ${violations} violation(s) — fix before shipping.`)
}
console.log(`${'═'.repeat(70)}\n`)
process.exit(violations === 0 ? 0 : 1)
