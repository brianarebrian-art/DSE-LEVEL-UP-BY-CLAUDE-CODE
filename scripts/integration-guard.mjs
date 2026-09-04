// integration-guard —— 接線檢查（憲章第 4 條）
//
// ══ 點解需要 ══
// 憲章第 4 條：「新模組未完成，直到已 wire 入 live app 並可於運行中 UI 手動驗證。」
// 呢條係本項目最常犯、而且最難自己發現嘅錯：組件寫好、測試全綠、tsc 過、
// build 過 —— 但全世界冇一個地方 import 過佢，學生永遠見唔到。
// 冇任何現有工具會就住呢件事出聲。
//
// 掃三樣：
//   ① components/ 入面有冇檔案完全冇被 import
//   ② lib/ 入面有冇模組完全冇被 import
//   ③ app/ 入面有冇靜態路由，全站冇任何一條連結指過去
//
// ③ 有一張明示豁免名單（ALLOW_UNLINKED）。豁免要寫低理由 ——
// 一條「知道佢冇連結」嘅路由同一條「唔覺意漏咗連結」嘅路由，喺掃描器眼中
// 一模一樣，分別只喺有冇人講過。/waiting 就係咁樣漏咗好耐（2026-08-23 修正）。
//
// 落閘當日實測：components 0、lib 0、未連結路由 3（全部喺豁免名單）。

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()

/** 明示豁免：唔應該有站內連結嘅路由，逐條寫低理由。 */
const ALLOW_UNLINKED = {
  '/admin': '題目審批後台，只俾管理員直接輸入網址入',
  '/dev/answer-cards': '開發用預覽頁，唔屬於學生流程',
  '/dev/long-session': '開發用預覽頁，唔屬於學生流程',
  // ⚠️ 呢個豁免有到期日，唔同上面幾條。
  // /confirm-payment 嘅正式入口係價格頁 /support（規格 D3-5，仲未起）。
  // 而家係暗部署：頁面 noindex、Stripe 未接、按鈕撳唔落。
  // /support 一起好就【即刻刪走呢一行】—— 到時仲留住，就變成一條
  // 真係冇人入得到嘅付款頁，而個閘會由「捉到」變成「被叫收聲」。
  '/confirm-payment': '暗部署中（憲章 §8.2，2026-09-19 開賣）。入口 /support 未起 —— /support 上線即刪此豁免',
}

const files = []
function walk(dir) {
  if (!existsSync(join(ROOT, dir))) return
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`
    if (e.isDirectory()) {
      if (e.name !== '__tests__') walk(rel)
      continue
    }
    if (/\.(ts|tsx)$/.test(e.name)) files.push(rel)
  }
}
walk('app')
walk('components')
walk('lib')
walk('data')

const src = new Map(files.map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]))
const findings = []

// ── ① components/ ──────────────────────────────────────────────────────────
for (const rel of files.filter((f) => f.startsWith('components/'))) {
  const base = rel.replace(/^components\//, '').replace(/\.tsx?$/, '')
  const leaf = base.split('/').pop()
  let used = 0
  for (const [other, code] of src) {
    if (other === rel) continue
    if (new RegExp(`@/components/${base}(['"\`])`).test(code)) used++
    else if (new RegExp(`from '\\./${leaf}'`).test(code)) used++
  }
  if (used === 0) findings.push([rel, '組件冇被任何地方 import —— 學生永遠見唔到'])
}

// ── ② lib/ ─────────────────────────────────────────────────────────────────
for (const rel of files.filter((f) => f.startsWith('lib/'))) {
  const short = rel.replace(/^lib\//, '').replace(/\.tsx?$/, '')
  const leaf = short.split('/').pop()
  let used = 0
  for (const [other, code] of src) {
    if (other === rel) continue
    if (new RegExp(`@/lib/${short}(['"\`/]|$)`, 'm').test(code)) used++
    else if (new RegExp(`from '\\.\\.?/[^']*${leaf}(\\.ts)?'`).test(code)) used++
  }
  if (used === 0) findings.push([rel, '模組冇被任何地方 import'])
}

// ── ③ 路由 ─────────────────────────────────────────────────────────────────
const routes = files
  .filter((f) => /^app\/.*page\.tsx$/.test(f))
  .map((f) => '/' + f.replace(/^app\//, '').replace(/\/?page\.tsx$/, ''))
  .map((r) => r.replace(/\/\((.*?)\)/g, '') || '/')

const unlinked = []
for (const r of routes) {
  if (r === '/' || r.includes('[')) continue
  let linked = 0
  for (const code of src.values()) {
    if (new RegExp(`href=["'\`]${r}(["'\`?#/])`).test(code)) linked++
    else if (new RegExp(`href=\\{\`${r}`).test(code)) linked++
    else if (new RegExp(`push\\(['"\`]${r}['"\`]`).test(code)) linked++
    // 導覽陣列寫法：`{ href: '/sensei', key: 'sensei' }`，之後由 `href={l.href}` 渲染。
    // 呢個係真實接線，但上面三個 pattern 全部睇唔到 —— 2026-08-25 誤報過一次。
    else if (new RegExp(`href:\\s*['"\`]${r}['"\`]`).test(code)) linked++
  }
  if (linked === 0 && !(r in ALLOW_UNLINKED)) {
    findings.push([r, '路由全站冇任何連結指過去 —— 只有搜尋引擎入得到'])
  } else if (linked === 0) {
    unlinked.push(r)
  }
}

const LINE = '─'.repeat(70)
console.log(`\n${LINE}`)
console.log('  integration-guard —— 接線檢查（憲章第 4 條）')
console.log(LINE)
if (findings.length === 0) {
  console.log(`  ✅ INTEGRATION GUARD PASSED —— 冇孤兒組件／模組／路由。`)
  console.log(`     （已明示豁免嘅未連結路由：${unlinked.length} 條）`)
  console.log(LINE)
  process.exit(0)
}
for (const [what, why] of findings) console.log(`  ❌ ${what}\n     ${why}`)
console.log(`\n  ${findings.length} 項未接線。憲章第 4 條：接線先算完成。`)
console.log(LINE)
process.exit(1)
