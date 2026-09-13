// ============================================================================
// live-charscan.mts —— 掃【學生真正見到嘅】題目，En 欄有冇中文／全角標點
// ----------------------------------------------------------------------------
// 點解要同 charscan.mjs 並存（唔係重複）：
//
//   charscan.mjs  掃 scripts/qbank/drafts/*.json  —— 我哋【手寫】嘅嘢
//   本檔          掃 runtime 載入嘅全部題目        —— 學生【見到】嘅嘢
//
// 兩者唔重疊。2026-09-13 實測：charscan 報 6 處（全部係既有基線），
// 而 runtime 掃出 **751 處**非語言科 En 欄夾住中文。
// 差距嘅原因：28,381 條上線題目裡面絕大部分經 `makeQ` / `_builder.ts` /
// `_parametric.ts` 程式生成，字面上唔喺任何 draft 檔出現過，所以 charscan
// 由設計上就掃唔到。
//
// 樣本（ethics-religious，451 條 contentEn 之一）：
//   "Sorting normative theories needs one question: where does the criterion
//    sit? For Utilitarianism it sits in 行為實際造成的整體後果，即…"
// 一個揀英文介面嘅學生，讀到一半會撞返中文。呢個同 math-p1-long 嗰 69 處
// 係同一類 bug，只不過大 7 倍，而且一直冇任何閘掃過。
//
// ══ 語言科豁免 ══
// chinese* / english* 一律豁免，同 charscan.mjs 收窄 ① 同一理由：
// 中文科嘅 contentEn 有可能正當引述《岳陽樓記》原文。實測語言科 7,055 處，
// 唔豁免個閘就永遠紅，等於冇閘。
//
// ══ 全角標點刻意唔計入基線 ══
// 【Marking Scheme】呢個版面標籤喺英文解析度大面積使用（中文側係「【評分準則】」），
// 屬一貫排版而唔係 bug。本檔只計 CJK 漢字；全角標點由 charscan.mjs 喺
// draft 層攔（新寫嘅嘢），已上線嗰批唔追溯。
//
// ══ 基線棘輪（憲章 §6）══
// 751 處全部係【既有且已上線】。直接硬閘 = 以功能改動為由令現有數據集失效，
// §6 明文禁止。所以逐科記一個上限，只可以減唔可以加；未列嘅科目一有命中即 exit 1。
// 基線係債務清單，唔係批准 —— 清嘅辦法同 math-p1-long 一樣：
// 出提案 → 真人簽 → 套用 → 減基線（見 docs/qbank-en-fix-math-p1-long.md）。
//
// 用法：npm run qbank:live-charscan
//       npm run qbank:live-charscan -- --all    連基線內嘅命中一併列出
// ============================================================================

// ⚠️ dynamic import 而唔係具名 import：tsx 之下 `.ts` 模組（CJS interop）
// 唔可以由 `.mts` 具名 import 出 runtime 值，會 SyntaxError。同 live-ids.mts 一致。
const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions, loadWrittenQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
  loadWrittenQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../data/questions/load.ts')
const { getActiveSubjects } = await mod<{
  getActiveSubjects: () => Array<{ id: string }>
}>('../../data/subjects.ts')

const CJK = /[一-鿿]/
const LANG = /^(chinese|english)/

// 科目 → 容許命中數上限。只可以減，唔可以加。2026-09-13 實測。
const BASELINE: Record<string, number> = {
  // 全部係【真 bug 而且已經上線】：英文介面嘅學生讀到一半撞返中文。
  // 619 條不同嘅原始字串（唔係一個模板重複），所以要逐條重寫，
  // 工作量約為 math-p1-long 嗰單嘅 7 倍。已批嘅題目改內容須重新覆核（§12）。
  'ethics-religious': 547,
  music: 100,
  chemistry: 54, // 多數係雙語對照（「硫酸 / sulfuric acid」）—— 對香港考生有用，清之前要逐條分辨
  'technology-living': 38,
  history: 8, // 英文解析引述中文考問術語，經查屬正當（同 charscan 基線同一批）
  economics: 4, // 英文解析引述「企業家職能」本身，剝走反而講唔通
}

const SHOW_ALL = process.argv.includes('--all')
type Hit = { subject: string; id: string; field: string; sample: string }
const hits: Hit[] = []
let total = 0
let langExempt = 0

const walk = (subject: string, q: Record<string, unknown>, prefix = '') => {
  for (const [k, v] of Object.entries(q)) {
    if (typeof v === 'string') {
      if (!/En$/.test(k) || !CJK.test(v)) continue
      if (LANG.test(subject)) { langExempt++; continue }
      hits.push({ subject, id: String(q.id ?? '?'), field: prefix + k, sample: v.match(/.{0,25}[一-鿿]+.{0,25}/)?.[0] ?? '' })
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => { if (x && typeof x === 'object') walk(subject, x as Record<string, unknown>, `${prefix}${k}[${i}].`) })
    } else if (v && typeof v === 'object') {
      walk(subject, v as Record<string, unknown>, `${prefix}${k}.`)
    }
  }
}

for (const s of getActiveSubjects()) {
  const qs = await loadSubjectQuestions(s.id)
  let written: Array<Record<string, unknown>> = []
  // 寫作題唔係每科都有 —— 冇就跳過，唔好令成個掃描死。
  try { written = await loadWrittenQuestions(s.id) } catch { /* 呢科冇寫作題 */ }
  for (const q of [...qs, ...written]) { total++; walk(s.id, q) }
}

const bySubject = new Map<string, number>()
for (const h of hits) bySubject.set(h.subject, (bySubject.get(h.subject) ?? 0) + 1)

const over: Array<[string, number, number]> = []
for (const [s, n] of bySubject) {
  const cap = BASELINE[s]
  if (cap === undefined) over.push([s, n, 0])
  else if (n > cap) over.push([s, n, cap])
}

console.log(`\n上線題目 En 欄掃描 —— ${total} 條題目（語言科豁免 ${langExempt} 處）`)
console.log(`非語言科命中 ${hits.length} 處 · 基線外 ${over.length} 個科目\n`)

const shown = SHOW_ALL ? hits : hits.filter((h) => over.some((o) => o[0] === h.subject))
for (const h of shown.slice(0, 40)) {
  console.log(`  ${h.subject.padEnd(18)} ${h.id.padEnd(22)} ${h.field.padEnd(16)} ${h.sample}`)
}
if (shown.length > 40) console.log(`  …… 另有 ${shown.length - 40} 處`)

if (over.length) {
  console.log('\n✗ 基線外命中：')
  for (const [s, n, cap] of over) console.log(`   ${s}：${n} 處（基線 ${cap}）`)
  console.log('\n基線只可以減唔可以加。新命中請喺落 draft 嗰層修好。')
  process.exit(1)
}

console.log('  ✅ 冇新增命中。')
console.log(`     既有 ${hits.length} 處仍在基線之內 —— 基線係債務清單，唔係批准。`)
console.log('     逐處列出：npm run qbank:live-charscan -- --all')
