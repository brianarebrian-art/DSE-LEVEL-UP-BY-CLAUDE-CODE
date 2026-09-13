#!/usr/bin/env node
// ============================================================================
// charscan.mjs —— 掃草稿入面「語言錯置」嘅字元
// ----------------------------------------------------------------------------
// 存在嘅理由：有一類錯誤【所有現有閘都捉唔到】。
//
// 2026-09-12 實測揾到兩個：
//   ① technology-living：「宜以當造food材為主」—— 一個英文字漏咗入中文句子
//   ② design-tech：「легible」—— 西里爾「лег」＋ ible，睇落同 legible 一樣
//
// 兩者都全部過關：
//   · _gate.mjs        唔掃字元集              → 過
//   · term-guard.mjs   掃口語同術語，冇呢條規則  → 過
//   · JSON.parse       語法合法                → 過
//   · tsc / npm test   草稿唔入型別系統         → 過
// 唯一會發現嘅係學生 —— 而佢見到嘅係畫面上一個唔通順嘅句子。
//
// ══ 三次收窄（唔收窄就會變成狼來了）══
// ① 語言科（english* / chinese*）一律豁免 —— 佢哋嘅題幹本來就係英文／中英並存，
//    唔豁免就會令 english-literature 成科假報（同 term-guard 嘅 isLanguageBank 同理）。
// ② 只攔西里爾，唔攔希臘 —— Δv、π、θ、σ 係正當數理符號。
// ③ 先剝走 LaTeX（$…$ 同 \command）—— times / sqrt / mathrm / sigma 全部係
//    英文小寫，唔剝走就會喺 m1／m2 假報 36 處。
// ④ 只攔【夾喺兩個中文字之間】嘅英文字，唔攔括號／引號內嘅術語對照。
//    「流動比率（current ratio）」係 BAFS／ICT／經濟嘅正常寫法，實測 419 處
//    大部分都係咁；一刀切會令個閘永遠紅，等於冇閘。真 bug 嘅特徵係
//    「當造food材」—— 中文字直接貼住英文字，冇括號、冇空格。
//
// 一個日日嗌錯嘅閘，兩個星期之後就冇人再睇。收窄同攔截一樣重要。
//
// ══ 基線棘輪（憲章 §6）══
// 落閘當日實測 75 處，全部喺【既有】草稿檔，新寫嘅 17 個 b4 檔零命中。
// 直接硬閘會令現有草稿一次過失效，等於「以功能改動為由令現有數據集失效」——
// 憲章 §6 明文禁止。所以行基線制：既有檔各記一個上限，只可以減唔可以加；
// 基線以外嘅檔一有命中即 exit 1。
//
// ⚠️ 基線係一張【債務清單】，唔係批准。入面有真 bug（例如 math-p1-long 嘅
// questionEn 寫住「化簡」—— 英文介面學生會見到中文），亦有正當命中
// （例如 history-p2-essays 嘅中文解析引述英文考問句式「To what extent do you agree」，
// economics 嘅英文解析引述中文術語「企業家職能」）。兩者混在一起，
// 所以基線只可以逐檔人手清，唔可以一鍵改。
//
// 用法：npm run qbank:charscan
//       npm run qbank:charscan -- --all   連基線內嘅命中一併列出
// ============================================================================

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DIR = 'scripts/qbank/drafts'
const CJK = /[一-鿿]/
const CYRILLIC = /[Ѐ-ӿ]/
const LANG_BANK = /^(english|chinese)/
const ZH_FIELDS = ['question', 'explanation', 'referenceAnswer', 'markingScheme']
// 正當地出現喺中文句子裡面嘅小寫英文縮寫。
const ALLOWED_LOWER = new Set(['ph', 'kcal', 'rpm', 'vs', 'et', 'al', 'www', 'com'])

// 檔名 → 容許命中數上限。只可以減，唔可以加。
const BASELINE = {
  // 2026-09-12 收窄 ④ 之後實測。三個檔，合共 75 處，全部係既有草稿。
  //
  // math-p1-long 嗰 69 處係【真 bug 而且已經上線】：questionEn / markingSchemeEn /
  // explanationEn 入面夾住中文（「一個長方體」「三維三角的整個技巧」）。
  // 英文介面嘅學生做緊一條中英夾雜嘅題目，而冇任何閘會嗌。
  // 本批唔順手改 —— 嗰 20 條題已由 brian 2026-08-27 逐題簽名批過，
  // 改內容須重新覆核（憲章 §12）。記入基線＝記入待辦，唔係批准。
  //
  // 另外 6 處經查屬正當引述：history-p2-essays 嘅英文解析引述中文考問術語，
  // economics-written-b2 嘅英文解析引述「企業家職能」本身。
  // 兩者都係「正在討論嗰個詞」，剝走反而令解析講唔通。
  'math-p1-long.json': 69,
  'history-p2-essays.json': 4,
  'economics-written-b2.json': 2,
}
const SHOW_ALL = process.argv.includes('--all')

const hits = []
let files = 0, rows = 0

for (const f of readdirSync(DIR).sort()) {
  if (!f.endsWith('.json') || f.startsWith('_')
    || f.endsWith('.decisions.json') || f.endsWith('.rejected.json') || f.endsWith('.sample.json')) continue
  let data
  try { data = JSON.parse(readFileSync(join(DIR, f), 'utf8')) } catch { continue }
  const arr = Array.isArray(data) ? data : (data.questions ?? data.rows ?? data.drafts ?? [])
  if (!Array.isArray(arr) || !arr.length) continue
  files++
  const isLang = LANG_BANK.test(f)
  for (const q of arr) {
    rows++
    for (const [k, v] of Object.entries(q)) {
      if (typeof v !== 'string') continue
      if (CYRILLIC.test(v)) {
        hits.push([f, q.id, k, '西里爾字母', v.match(/\S*[Ѐ-ӿ]\S*/)?.[0] ?? ''])
      }
      if (isLang) continue
      if (/En$/.test(k) && CJK.test(v)) {
        hits.push([f, q.id, k, '英文欄有中文', v.match(/[一-鿿]+/)?.[0] ?? ''])
      }
      if (!/En$/.test(k) && ZH_FIELDS.includes(k)) {
        // 剝走 LaTeX 之後才掃 —— 見檔頭收窄 ③。
        const stripped = v.replace(/\$[^$]*\$/g, ' ').replace(/\\[A-Za-z]+/g, ' ')
        // 收窄 ④：只攔【夾喺兩個中文字之間、冇任何分隔】嘅英文字。
        // 呢個正是真 bug 嘅特徵（「當造food材」—— 造 + food + 材 直接相連）。
        // 括號或引號入內嘅英文屬術語對照（「流動比率（current ratio）」），
        // 係 BAFS／ICT／經濟等科目嘅正常寫法，一律唔算。
        const sandwiched = [...stripped.matchAll(/[一-鿿]([a-z]{3,})[一-鿿]/g)]
          .map((m) => m[1]).filter((w) => !ALLOWED_LOWER.has(w))
        const bad = [...new Set(sandwiched)]
        if (bad.length) hits.push([f, q.id, k, '中文字之間夾住英文字', bad.join(' ')])
      }
    }
  }
}

const byFile = new Map()
for (const h of hits) byFile.set(h[0], (byFile.get(h[0]) ?? 0) + 1)

const over = []
for (const [f, n] of byFile) {
  const cap = BASELINE[f]
  if (cap === undefined) over.push([f, n, 0])
  else if (n > cap) over.push([f, n, cap])
}

console.log(`\n字元錯置掃描 —— ${files} 個草稿檔 · ${rows} 條題目`)
console.log(`基線內 ${hits.length - over.reduce((a, x) => a + x[1], 0)} 處 · 基線外 ${over.length} 個檔\n`)

const shown = SHOW_ALL ? hits : hits.filter((h) => over.some((o) => o[0] === h[0]))
for (const [f, id, field, kind, sample] of shown) {
  console.log(`  ❌ ${f} · ${id} · ${field}`)
  console.log(`     ${kind}：${sample}`)
}

if (!over.length) {
  console.log('  ✅ 冇新增命中。')
  console.log(`     既有 ${hits.length} 處仍在基線之內 —— 基線係債務清單，唔係批准。`)
  console.log('     逐檔列出：npm run qbank:charscan -- --all\n')
  process.exit(0)
}
console.log('\n以下超出基線 —— 新寫嘅草稿唔應該有任何命中：')
for (const [f, n, cap] of over) {
  console.log(cap === 0 ? `  ✗ ${f}：${n} 處（唔喺基線之內）` : `  ✗ ${f}：由 ${cap} 增至 ${n}`)
}
console.log('')
process.exit(1)
