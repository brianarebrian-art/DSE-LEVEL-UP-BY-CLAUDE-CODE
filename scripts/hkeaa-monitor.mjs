// ============================================================================
// hkeaa-monitor.mjs — 課綱監察提醒（David）(plain Node ESM, zero dep)
// ----------------------------------------------------------------------------
// 讀取 docs/hkeaa_intel/syllabus_tracker.md 的「最後確認日期」，任何一項超過
// 90 日即提醒人手核查 HKEAA/EDB 網站（HKEAA 封鎖程式抓取，無法全自動）。
// 用法：node scripts/hkeaa-monitor.mjs   （報告直接輸出 stdout，不落檔）
// ============================================================================

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const FILE = fileURLToPath(new URL('../docs/hkeaa_intel/syllabus_tracker.md', import.meta.url))
const STALE_DAYS = 90
const text = readFileSync(FILE, 'utf8')

const rows = [...text.matchAll(/^\|\s*([^|]+?)\s*\|\s*[^|]*\|\s*(\d{4}-\d{2}-\d{2})\s*\|/gm)]
const today = Date.now()

console.log(`\n${'═'.repeat(64)}\n  HKEAA Intel Report — ${new Date().toISOString().slice(0, 10)}\n${'═'.repeat(64)}`)
let stale = 0
for (const [, item, date] of rows) {
  const age = Math.floor((today - new Date(date).getTime()) / 86_400_000)
  const flag = age > STALE_DAYS ? '🔔 逾期' : '✅'
  if (age > STALE_DAYS) stale++
  console.log(`  ${flag}  ${item} — 最後確認 ${date}（${age} 日前）`)
}
console.log(`${'─'.repeat(64)}`)
console.log(stale
  ? `  🔔 ${stale} 項超過 ${STALE_DAYS} 日未確認 — 請人手檢查 HKEAA 網站更新（程式無法代勞）。`
  : `  ✅ 全部監察項在 ${STALE_DAYS} 日內確認過。`)
console.log(`${'═'.repeat(64)}\n`)
process.exit(0)
