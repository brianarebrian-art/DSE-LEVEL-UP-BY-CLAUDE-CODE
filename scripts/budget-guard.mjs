// ============================================================================
// budget-guard.mjs — 平台營運成本監控 (plain Node ESM, zero dep)
// ----------------------------------------------------------------------------
// 2026-07-29：上限由 HK$180.81 改為 US$200（Brian 拍板）。Vercel／Supabase 免費額度
// 受查詢率限制，超額須升級付費方案，故預留空間。此上限屬【支出側】——
// 【2026-09-04 更新】憲章 §3 原「絕對免費原則」已修訂為「核心免費 ＋ Plus 自願支持」，
// §8.2 白名單准許 5 個 SKU。本上限仍然只管【支出側】，與收入側無關 ——
// 唔可以因為有收入就調高上限，亦唔可以據此擴大 §5 例外範圍。
// ----------------------------------------------------------------------------
// 1. 讀取 data/expenses.json（{date, category, amount_usd}[]），計算本月累計支出：
//      ≥80% 上限 → ⚠️ 警告；≥100% → 🚨 封殺令（exit 1）
// 2. 掃描 package.json dependencies，檢查有無已知「付費服務」SDK（Stripe、
//    SendGrid、AWS、Twilio 等）——發現即紅色警報（exit 1）。
// 用法：node scripts/budget-guard.mjs
// （原規格為 Python；本 repo 慣例係零依賴 Node script，功能一致。）
// ============================================================================

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../', import.meta.url))
const { monthly_cap_usd: CAP, expenses } = JSON.parse(readFileSync(ROOT + 'data/expenses.json', 'utf8'))
const pkg = JSON.parse(readFileSync(ROOT + 'package.json', 'utf8'))

const now = new Date()
const thisMonth = (d) => {
  const x = new Date(d)
  return x.getFullYear() === now.getFullYear() && x.getMonth() === now.getMonth()
}
const spent = expenses.filter((e) => thisMonth(e.date)).reduce((s, e) => s + Number(e.amount_usd || 0), 0)
const pct = CAP > 0 ? (100 * spent) / CAP : 0

console.log(`\n${'═'.repeat(60)}\n  Budget Guard — ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}\n${'═'.repeat(60)}`)
console.log(`  本月支出：US$${spent.toFixed(2)} / 上限 US$${CAP.toFixed(2)}（${pct.toFixed(2)}%）`)

let fail = 0
if (pct >= 100) { console.log('  🚨 封殺令：本月支出已達上限，停止一切新增開支！'); fail++ }
else if (pct >= 80) console.log('  ⚠️ 警告：本月支出已達上限 80%，請審慎。')
else console.log('  ✅ 預算健康。')

// 付費服務 SDK 掃描（名單針對常見 PSP/雲服務；免費開源套件不在此列）
const PAID = /^(stripe|@stripe\/|@sendgrid\/|aws-sdk|@aws-sdk\/|twilio|@twilio\/|mailgun|@mailgun\/|openai|@anthropic-ai\/sdk|braintree|paypal)/
// 已審批例外（有文件根據，非走漏）：
//   @anthropic-ai/sdk — 人文科題庫生成管線（scripts/gen-questions.mts）專用。
//   只有創辦人主動設置 ANTHROPIC_API_KEY 先會產生費用；平台運行時完全不引用。
//   stripe / @stripe/* — 憲章 §5 例外一（2026-09-04 Brian ＋ Yuna 雙簽），
//   §8.2 受控收費框架之必要基礎設施。按交易百分比收費、無月費，不計入月度死鎖。
//   例外嚴格限於 Stripe：SendGrid／Resend／AWS／Twilio 等仍然係紅色警報。
const EXCEPTIONS = new Set(['@anthropic-ai/sdk', 'stripe'])
const EXCEPTION_PREFIX = /^@stripe\//
const approved = (d) => EXCEPTIONS.has(d) || EXCEPTION_PREFIX.test(d)
// 例外分兩類，訊息唔可以撈亂 —— Stripe 係真係會按交易產生費用，唔係「只喺創辦人開 key 時」。
const KEY_GATED = new Set(['@anthropic-ai/sdk'])
const deps = { ...pkg.dependencies, ...pkg.devDependencies }
const hits = Object.keys(deps).filter((d) => PAID.test(d))
const alerts = hits.filter((d) => !approved(d))
const known = hits.filter(approved)
for (const d of known) {
  console.log(
    KEY_GATED.has(d)
      ? `  ⚠️ 已審批例外：${d}（僅創辦人提供 API key 時產生費用）`
      : `  ⚠️ 已審批例外：${d}（憲章 §5 例外一 —— 按交易百分比收費，屬變動成本）`,
  )
}
if (alerts.length) { console.log(`  🚨 紅色警報：發現未審批付費服務 SDK — ${alerts.join(', ')}`); fail += alerts.length }
else console.log('  ✅ 無未審批付費服務 SDK。')

console.log(`${'═'.repeat(60)}\n`)
process.exit(fail ? 1 : 0)
