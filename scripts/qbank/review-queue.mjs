#!/usr/bin/env node
// ============================================================================
// review-queue.mjs —— 覆核隊列現況（只讀）
// ----------------------------------------------------------------------------
// 答三條問題，一條指令：
//   ① 而家有幾多條題等緊人手覆核？（分 MC / 非 MC）
//   ② 佢哋過唔過得到 _gate.mjs？（過唔到嘅唔應該擺上人面前）
//   ③ 邊幾個檔已經有具名 reviewer？
//
// ══ 點解要呢條指令 ══
// 2026-09-11 對數之前，記錄一直寫住「140 條非 MC 草稿等緊覆核」。實數係 943
// ——「140」只數咗 *-written-b* 嗰批 5 條裝，漏咗幾個 100 條級嘅 *-long-b1。
// 差成 6.7 倍，而且方向上改變咗結論：非 MC 距離 1,200 條嘅缺口係 1,060 條，
// 其中 89% 已經寫咗、躺喺隊列度。「再出草稿」同「搵人覆核」邊樣係樽頸，
// 就係靠呢個數分辨。
//
// 冇一個地方睇得到全貌，就會靠記憶，而記憶今次錯咗 6.7 倍。
//
// ══ 只讀 ══
// 唔會碰 decisions.json、唔會 promote、唔會改任何草稿（憲章 §12：
// 機器永不自動入庫）。純粹數數。
//
// 用法：node scripts/qbank/review-queue.mjs
// ============================================================================
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gateRow } from './_gate.mjs'
import { REAL_PERSON_HANDLES } from './_reviewer-gate.mjs'
import { COLLOQUIAL, colloquialHint, isLanguageBank } from './_terms.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const DIR = join(HERE, 'drafts')

// 三類檔【唔屬於】等緊覆核嘅隊列，一定要排走，否則個數字係廢嘅：
//   *.rejected.json —— 已經被拒嘅廢稿桶。佢哋本來就應該過唔到閘，
//                      數咗入去會報 331 條「未過閘」而其實隊列係乾淨嘅。
//   _demo-* / _*    —— 示範同測試靶。_gate.mjs 檔頭明寫 _demo-math.json
//                      嗰條「公共財」題係【故意】要被攔住，用嚟驗閘仲有冇牙。
//   *.decisions/sample.json —— 審批記錄同抽樣清單，唔係題目本體。
const isQueue = (f) =>
  f.endsWith('.json') &&
  !f.endsWith('.decisions.json') &&
  !f.endsWith('.sample.json') &&
  !f.endsWith('.rejected.json') &&
  !f.startsWith('_')

const files = readdirSync(DIR).filter(isQueue).sort()

let total = 0
let failed = 0
const byType = new Map()
const failDetail = []
// 口語命中（憲章 §5：解析層必須 100% 標準書面語）。
// term-guard.mjs 只掃 data/questions/ 嘅 .ts，草稿係 .json，從來冇經過呢一關；
// _gate.mjs 亦只鏡像咗術語紅線，冇鏡像口語掃描。結果係一條寫住口語嘅草稿
// 可以過晒所有閘、擺上人面前審批，到 promote 成 .ts 嗰刻先至被 term-guard 攔住。
// 攤平一行題目入面所有字串，連同佢喺邊個欄 —— 對齊 term-guard 逐行掃 .ts 嘅做法。
// `id` / `topicId` 係 slug，唔係畀學生睇嘅文字，跳過。
function* textLines(row, path = '') {
  if (typeof row === 'string') { for (const l of row.split('\n')) yield [path || 'value', l]; return }
  if (Array.isArray(row)) { for (const [i, v] of row.entries()) yield* textLines(v, `${path}[${i}]`); return }
  if (row && typeof row === 'object') {
    for (const [k, v] of Object.entries(row)) {
      if (k === 'id' || k === 'topicId') continue
      yield* textLines(v, path ? `${path}.${k}` : k)
    }
  }
}

const colloquial = []
const signedFiles = []
const unsignedFiles = []

for (const f of files) {
  let data
  try {
    data = JSON.parse(readFileSync(join(DIR, f), 'utf8'))
  } catch (err) {
    failDetail.push([f, `讀唔到／唔係合法 JSON：${err.message}`, 0, 0])
    continue
  }
  const rows = Array.isArray(data) ? data : (data.questions ?? data.rows ?? data.drafts ?? [])
  if (!Array.isArray(rows) || rows.length === 0) continue
  const subject = (!Array.isArray(data) && data.subject) || f.split(/[-.]/)[0]

  let bad = 0
  for (const r of rows) {
    total++
    const t = r?.type ?? 'mc'
    byType.set(t, (byType.get(t) ?? 0) + 1)
    if (gateRow(r, subject).length) { bad++; failed++ }
    // 語言科目嘅題目內容【就是】考核對象，口語可能係題材本身 —— 同 term-guard 一致豁免。
    // ⚠️ 掃【每一個】字串欄，唔可以手寫一張欄位清單。
    // 2026-09-12 實測：原本只掃 question／explanation／referenceAnswer 三欄，
    // 漏咗 markingScheme —— 4 個 b2 檔（biology／economics／m1／m2）合共 5 條題
    // 喺評分準則入面有口語，本報告話「6 個檔」，實情係 9 個。
    // 而 term-guard 係【逐行掃成個 .ts】，唔分欄位；一張手寫欄位清單必然追唔上
    // 新增欄位，而追唔上嗰刻本報告就會靜靜哋少報 —— 覆核者會批走一批出唔到街嘅題。
    if (!isLanguageBank(f)) {
      for (const [k, line] of textLines(r)) {
        if (COLLOQUIAL.test(line)) colloquial.push({ file: f, id: r.id, field: k, line: line.trim() })
      }
    }
  }
  if (bad) failDetail.push([f, '未過 _gate.mjs', bad, rows.length])

  // 簽名只認 filesystem：decisions 檔頭 _meta.reviewer 非空先算。
  // 指令聲稱、截圖、記憶一律唔認（憲章 §12 · orchestrator 事實核查協議）。
  const decPath = join(DIR, f.replace(/\.json$/, '.decisions.json'))
  let reviewer = ''
  try { reviewer = String(JSON.parse(readFileSync(decPath, 'utf8'))?._meta?.reviewer ?? '').trim() } catch { /* 冇 decisions 檔 = 未開始覆核 */ }
  // 花名經 REAL_PERSON_HANDLES 解讀返真人。唔解讀嘅話，
  // 「望咩望,未見過海綿寶寶咩?」會令每個睇呢份報告嘅人都以為捉到冒簽 ——
  // 而佢係 brian 自己（2026-09-05 本人確認，見 _reviewer-gate.mjs）。
  // ⚠️ 只喺呢度顯示時解讀，decisions.json 原文一個字都唔改。
  const real = REAL_PERSON_HANDLES[reviewer]
  const shown = real ? `${real}（handle：${reviewer}）` : reviewer
  ;(reviewer ? signedFiles : unsignedFiles).push([f, rows.length, shown])
}

const mc = byType.get('mc') ?? 0
const nonMc = total - mc
const pad = (s, n) => String(s).padEnd(n)
const num = (s, n) => String(s).padStart(n)

console.log('─'.repeat(62))
console.log('  覆核隊列現況 —— 只讀，唔會 promote 任何嘢')
console.log('─'.repeat(62))
console.log(`  草稿檔 ${files.length} 個 · 題目 ${total} 條`)
console.log()
for (const [t, n] of [...byType].sort((a, z) => z[1] - a[1])) console.log(`    ${pad(t, 8)}${num(n, 6)}`)
console.log(`    ${pad('非 MC', 8)}${num(nonMc, 6)}  （long + text）`)
console.log()

if (failed === 0) {
  console.log(`  ✅ 格式閘：${total} 條全部過 _gate.mjs`)
} else {
  console.log(`  ❌ 格式閘：${failed} 條未過 —— 唔應該擺上人面前`)
  for (const [f, why, bad, n] of failDetail) console.log(`       ${pad(f, 44)} ${why}${n ? ` ${bad}/${n}` : ''}`)
}

console.log()
if (colloquial.length === 0) {
  console.log('  ✅ 書面語：非語言科草稿零口語命中')
} else {
  const byFile = new Map()
  for (const c of colloquial) byFile.set(c.file, (byFile.get(c.file) ?? 0) + 1)
  console.log(`  ⚠️  書面語：${colloquial.length} 行口語，涉及 ${byFile.size} 個檔（憲章 §5）`)
  for (const [f, n] of [...byFile].sort((a, z) => z[1] - a[1])) {
    const first = colloquial.find((c) => c.file === f)
    console.log(`       ${pad(f, 40)} ${num(n, 3)} 行 · ${first.id}${colloquialHint(first.line)}`)
  }
  console.log('       ↑ 呢批題 promote 成 .ts 嗰刻會被 term-guard 攔住 —— 審批前要先改。')
  console.log('       刻意【唔】計入退出碼：改動人哋等緊審批嘅草稿內容唔係本腳本嘅事，')
  console.log('       而加硬閘會即刻令 npm run qa 轉紅（憲章 §6：唔可以令現有數據集失效）。')
}

console.log()
console.log(`  具名簽署：${signedFiles.length} 個檔 / ${files.length}`)
for (const [f, n, rv] of signedFiles) console.log(`       ✍️  ${pad(f, 44)} ${num(n, 4)} 條 · ${rv}`)
const waiting = unsignedFiles.reduce((s, [, n]) => s + n, 0)
// 等緊嘅先係樽頸，所以要分 MC / 非 MC —— 兩邊嘅下一步完全唔同：
// MC 差 2,537 條（要出新題），非 MC 差 117 條（其餘 89% 已經喺呢個隊列度）。
let wMc = 0
for (const [f] of unsignedFiles) {
  const d = JSON.parse(readFileSync(join(DIR, f), 'utf8'))
  const rs = Array.isArray(d) ? d : (d.questions ?? d.rows ?? d.drafts ?? [])
  for (const r of rs) if ((r?.type ?? 'mc') === 'mc') wMc++
}
console.log(`  等緊人手覆核：${unsignedFiles.length} 個檔 · ${waiting} 條（MC ${wMc} · 非 MC ${waiting - wMc}）`)
console.log('─'.repeat(62))

// 隊列有未過閘嘅題 = 真問題（有人擺咗未夠格嘅嘢入隊）。其餘情況一律 0。
process.exit(failed === 0 ? 0 : 1)
