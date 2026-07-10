// ============================================================================
// meta-loop.mjs — META_COMMAND_CENTER runner（Brian/Yuna 指揮中心）(zero dep)
// ----------------------------------------------------------------------------
// Agentic Loop v3 嘅外循環落地版：一個指令行晒全部本地 CHECK 層（附錄 2 嘅
// 「本地 Check 唔叫 Claude」策略），計算紅黃綠健康，生成戰情晨報 + 儀表板。
//
//   node scripts/meta-loop.mjs
//
// 輸出：docs/daily_briefing_{date}.md + docs/system_health_dashboard.json
// 退出碼：0=綠 1=紅（任何 gate 失敗）
//
// 誠實邊界：EXECUTE 層（生成題目/組件/文案）係 Claude 喺 session 入面做，
// 唔係呢個 script 自動做 —— 本 script 負責 CHECK/監控/報告，唔會自動改內容。
// ============================================================================

import { execFileSync } from 'node:child_process'
import { readdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const today = new Date().toISOString().slice(0, 10)

const GATES = [
  { line: '題目生產線', name: 'term-guard（術語+課綱+書面語）', cmd: ['scripts/qbank/term-guard.mjs'] },
  { line: '題目生產線', name: 'validate-banks（格式+去重+難度）', cmd: ['scripts/qbank/validate-banks.mjs'] },
  { line: '營運質檢線', name: 'budget-guard（$0 紅線）', cmd: ['scripts/budget-guard.mjs'] },
  { line: '營運質檢線', name: 'hkeaa-monitor（課綱時效）', cmd: ['scripts/hkeaa-monitor.mjs'] },
]

const results = []
for (const g of GATES) {
  let pass = true, tail = ''
  try {
    const out = execFileSync('node', g.cmd.map((c) => ROOT + c), { encoding: 'utf8', timeout: 120_000 })
    tail = out.trim().split('\n').filter((l) => l.includes('✅') || l.includes('⚠️')).slice(-1)[0] ?? 'ok'
  } catch (e) {
    pass = false
    tail = (e.stdout || String(e)).trim().split('\n').filter((l) => l.includes('❌')).slice(0, 2).join(' | ') || 'failed'
  }
  results.push({ ...g, pass, tail: tail.trim() })
}

// pending / manual-review 隊列（loop 失敗升級協議嘅落點）
const reportsDir = ROOT + 'content/reports'
const reports = existsSync(reportsDir) ? readdirSync(reportsDir).filter((f) => f.endsWith('.json')) : []
let manualQueue = 0
for (const f of reports) {
  try {
    const j = JSON.parse(readFileSync(`${reportsDir}/${f}`, 'utf8'))
    manualQueue += Number(j.manual_review_count ?? 0)
  } catch { /* ignore */ }
}

const failed = results.filter((r) => !r.pass).length
const health = failed > 0 ? '🔴 紅' : manualQueue > 20 ? '🔴 紅（pending 堆積）' : manualQueue > 0 ? '🟡 黃' : '🟢 綠'

const briefing = `# 戰情晨報 — ${today}（Meta-Loop 自動生成）

## 系統健康：${health}

| 生產線 | 檢查 | 結果 |
|--------|------|------|
${results.map((r) => `| ${r.line} | ${r.name} | ${r.pass ? '✅' : '❌'} ${r.tail.replace(/\|/g, '·')} |`).join('\n')}

## 異常隊列

- 人工審核隊列（manual_review）：${manualQueue} 條
- Loop 報告存量：${reports.length} 份（content/reports/）

## 指揮中心提示

${failed > 0
  ? '- 🔴 有 gate 失敗 —— 按報告逐項修正後重跑 `node scripts/meta-loop.mjs`。'
  : '- 全部本地 gate 通過。生成類任務（新題/新組件/新文案）喺 Claude Code session 執行後，必須重跑本 script 先算入庫。'}
- 記住：本地 gate 只驗格式/術語/課綱/預算；**學術內容正確性靠出題時逐條人手驗算**，冇任何 script 可以代替。
`

writeFileSync(`${ROOT}docs/daily_briefing_${today}.md`, briefing)
writeFileSync(`${ROOT}docs/system_health_dashboard.json`, JSON.stringify({
  updated: new Date().toISOString(),
  health: failed > 0 ? 'red' : manualQueue > 20 ? 'red' : manualQueue > 0 ? 'yellow' : 'green',
  gates: results.map(({ line, name, pass }) => ({ line, name, pass })),
  manual_review_count: manualQueue,
  reports_count: reports.length,
}, null, 2))

console.log(briefing)
console.log(`已寫入 docs/daily_briefing_${today}.md + docs/system_health_dashboard.json`)
process.exit(failed > 0 ? 1 : 0)
