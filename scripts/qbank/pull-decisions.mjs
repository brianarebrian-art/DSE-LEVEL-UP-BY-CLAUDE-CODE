#!/usr/bin/env node
// ============================================================================
// pull-decisions.mjs — Admin 面板嘅「回程路」。
// ----------------------------------------------------------------------------
// /admin 面板將逐題決定寫入 Supabase review_decisions（傳送層）。呢個腳本
// 將某批次嘅雲端決定拉返落 repo，生成同 review.html 匯出格式一致嘅
// <batch>.decisions.json —— 之後照行 promote-drafts.mjs 正常流程。
//
//   node scripts/qbank/pull-decisions.mjs --batch econ-supply-demand-mc-10
//
// 安全設計：
//   • service key 只從 .env.local / 環境變數讀，永不打印、永不寫檔。
//   • 同一題多筆決定 → 取最新（created_at 最大）。
//   • 雲端零紀錄而本地 decisions.json 已有非 pending 決定 → 拒絕覆寫（防止
//     一次誤跑冚走已簽名嘅本地審批）。
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
const arg = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : null }
const BATCH = arg('batch')
if (!BATCH) {
  console.error('usage: node scripts/qbank/pull-decisions.mjs --batch <drafts-file-stem>')
  process.exit(2)
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const DRAFTS = join(ROOT, 'scripts', 'qbank', 'drafts')
const draftsPath = join(DRAFTS, `${BATCH}.json`)
if (!existsSync(draftsPath)) {
  console.error(`✗ drafts file not found: scripts/qbank/drafts/${BATCH}.json`)
  process.exit(1)
}
const rows = JSON.parse(readFileSync(draftsPath, 'utf8'))
const subject = rows[0]?.subject ?? 'unknown'

// ── env（.env.local 优先，其次 process.env）；值永不打印 ─────────────────────
function envFromDotLocal() {
  const p = join(ROOT, '.env.local')
  const out = {}
  if (!existsSync(p)) return out
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}
const dot = envFromDotLocal()
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || dot.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || dot.SUPABASE_SERVICE_ROLE_KEY
if (!URL_ || !KEY) {
  console.error('✗ Supabase env missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env.local)')
  process.exit(1)
}

// ── 拉決定（asc 迭代，後者覆蓋 → 自然取最新）────────────────────────────────
const q = `${URL_}/rest/v1/review_decisions?batch=eq.${encodeURIComponent(BATCH)}` +
  `&select=draft_id,decision,reviewer_name,reviewer_email,created_at&order=created_at.asc&limit=1000`
const res = await fetch(q, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } })
if (!res.ok) {
  console.error(`✗ Supabase query failed: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
  process.exit(1)
}
const cloud = await res.json()

const latest = new Map() // draft_id -> {decision, reviewer_name, created_at}
for (const d of cloud) latest.set(d.draft_id, d)

const decPath = join(DRAFTS, `${BATCH}.decisions.json`)
if (latest.size === 0) {
  let hasLocal = false
  if (existsSync(decPath)) {
    const doc = JSON.parse(readFileSync(decPath, 'utf8'))
    hasLocal = Object.values(doc?.decisions ?? {}).some((v) => v !== 'pending')
  }
  console.error(hasLocal
    ? `✗ 雲端冇 ${BATCH} 嘅紀錄，而本地 decisions.json 已有非 pending 決定 —— 拒絕覆寫。`
    : `✗ 雲端冇 ${BATCH} 嘅任何決定 —— 先去 /admin 審完先。`)
  process.exit(1)
}

// ── 生成 decisions.json（同 review.html 匯出格式一致）───────────────────────
const decisions = {}
const reviewers = new Set()
let latestAt = ''
const counts = { approved: 0, rejected: 0, pending: 0 }
for (const row of rows) {
  const hit = latest.get(row.id)
  const decision = hit?.decision ?? 'pending'
  decisions[row.id] = decision
  counts[decision] = (counts[decision] ?? 0) + 1
  if (hit?.reviewer_name) reviewers.add(hit.reviewer_name)
  if (hit?.created_at && hit.created_at > latestAt) latestAt = hit.created_at
}

const out = {
  _meta: {
    source: `${BATCH}.json`,
    subject,
    reviewer: [...reviewers].join(' + '),
    reviewedAt: latestAt.slice(0, 10),
    pulledFrom: 'supabase:review_decisions',
  },
  decisions,
}
writeFileSync(decPath, JSON.stringify(out, null, 2) + '\n')

console.log(`✓ pulled ${latest.size} cloud decision(s) → scripts/qbank/drafts/${BATCH}.decisions.json`)
console.log(`  reviewer: ${out._meta.reviewer || '(missing!)'} · ${out._meta.reviewedAt}`)
console.log(`  approved ${counts.approved} / rejected ${counts.rejected} / pending ${counts.pending}`)
console.log(`\n  NEXT: node scripts/qbank/promote-drafts.mjs --in scripts/qbank/drafts/${BATCH}.json --subject ${subject} --decisions scripts/qbank/drafts/${BATCH}.decisions.json`)
