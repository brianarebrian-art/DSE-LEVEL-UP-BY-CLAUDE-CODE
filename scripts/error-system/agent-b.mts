#!/usr/bin/env -S npx tsx
// ============================================================================
// agent-b.mts — Executor（錯誤反映 Phase 5）
// ----------------------------------------------------------------------------
//   npx tsx scripts/error-system/agent-b.mts                 # dry-run
//   npx tsx scripts/error-system/agent-b.mts --write         # 寫 draft＋replacement queue＋audit
//   npx tsx scripts/error-system/agent-b.mts --write --withdraw
//       # 另對 shouldWithdraw 個案執行 withdraw.mts（改 withdrawn.json）
//   npx tsx scripts/error-system/agent-b.mts --write --push-status
//       # 更新 question_reports.status（需 0034）
//
// 硬規則：confidence>=0.8 仍然「即 fixed／跳過雙審」。
// 替換路徑 → confirmed + human_review（l1_due_at=+24h）+ dual_review_required。
// 唔呼叫 Grok／xAI API；唔 runtime INSERT questions。
// ============================================================================
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const INV_DIR = join(ROOT, '.grok-investigations')
const QUEUE_DIR = join(ROOT, '.grok-queue')
const REPL_DIR = join(ROOT, '.grok-replacement-queue')
const DRAFT_DIR = join(ROOT, 'drafts/error-replacements')
const AUDIT_DIR = join(ROOT, '.grok-investigations/_audit')

const agentB = (await import(join(ROOT, 'lib/errorSystem/agentB.ts'))) as typeof import('../../lib/errorSystem/agentB.ts')
const inv = (await import(join(ROOT, 'lib/errorSystem/investigationResult.ts'))) as typeof import('../../lib/errorSystem/investigationResult.ts')
const queue = (await import(join(ROOT, 'lib/errorSystem/queueReport.ts'))) as typeof import('../../lib/errorSystem/queueReport.ts')

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const WITHDRAW = args.includes('--withdraw')
const PUSH_STATUS = args.includes('--push-status')

function envFromDotLocal(): Record<string, string> {
  const p = join(ROOT, '.env.local')
  const out: Record<string, string> = {}
  if (!existsSync(p)) return out
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

function listResults(): string[] {
  if (!existsSync(INV_DIR)) return []
  return readdirSync(INV_DIR)
    .filter((f) => f.startsWith('result-') && f.endsWith('.json') && !f.startsWith('_'))
    .sort()
}

function loadQueueReport(reportId: string) {
  const p = join(QUEUE_DIR, queue.queueFileName(reportId))
  if (!existsSync(p)) return null
  const parsed = queue.parseQueueReport(JSON.parse(readFileSync(p, 'utf8')))
  return parsed.ok ? parsed.value : null
}

async function pushReportStatus(reportId: string, status: string): Promise<boolean> {
  const dot = envFromDotLocal()
  const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || dot.NEXT_PUBLIC_SUPABASE_URL
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || dot.SUPABASE_SERVICE_ROLE_KEY
  if (!URL_ || !KEY) {
    console.error('✗ Supabase env missing for --push-status')
    return false
  }
  const r = await fetch(`${URL_}/rest/v1/question_reports?id=eq.${encodeURIComponent(reportId)}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ status }),
  })
  if (!r.ok) {
    console.error(`✗ status→${status} id=${reportId}: ${r.status} ${(await r.text()).slice(0, 300)}`)
    return false
  }
  return true
}

function runWithdraw(subject: string, questionId: string, reportId: string): boolean {
  const reason = `ERROR_REPORT_${reportId}`
  const res = spawnSync(
    'npx',
    ['--yes', 'tsx@4.19.2', 'scripts/qbank/withdraw.mts', '--subject', subject, '--id', questionId, '--reason', reason],
    { cwd: ROOT, encoding: 'utf8' },
  )
  if (res.status !== 0) {
    console.error(res.stdout || '')
    console.error(res.stderr || '')
    return false
  }
  console.log(res.stdout.trim())
  return true
}

mkdirSync(REPL_DIR, { recursive: true })
mkdirSync(DRAFT_DIR, { recursive: true })
mkdirSync(AUDIT_DIR, { recursive: true })

const files = listResults()
if (!files.length) {
  console.log('✓ no result-*.json in .grok-investigations')
  process.exit(0)
}

let handled = 0
let wrote = 0
let failed = 0

for (const file of files) {
  const raw = JSON.parse(readFileSync(join(INV_DIR, file), 'utf8'))
  const parsed = inv.parseInvestigationResult(raw)
  if (!parsed.ok) {
    console.error(`✗ invalid ${file}: ${parsed.error}`)
    failed++
    continue
  }
  const result = parsed.value
  const report = loadQueueReport(result.report_id)
  if (!report) {
    console.error(`✗ missing queue report for ${result.report_id} (need .grok-queue/report-${result.report_id}.json)`)
    failed++
    continue
  }
  const decision = agentB.decideAgentBAction(result)
  handled++
  console.log(
    `· ${file} → action=${decision.action} status=${decision.reportStatus} withdraw=${decision.shouldWithdraw} enqueue=${decision.enqueueReplacement}`,
  )
  console.log(`  ${decision.reason}`)

  if (!WRITE) continue

  const audit = agentB.buildAgentBAuditEvent({
    action: `agent_b.${decision.action}`,
    target_type: 'question_report',
    target_id: result.report_id,
    report_id: result.report_id,
    summary: decision.reason,
  })
  writeFileSync(
    join(AUDIT_DIR, `audit-${result.report_id}-${Date.now()}.json`),
    `${JSON.stringify(audit, null, 2)}\n`,
    'utf8',
  )

  if (decision.enqueueReplacement) {
    const draftName = agentB.replacementDraftFileName(result.report_id)
    const draftPath = join(DRAFT_DIR, draftName)
    const draftRel = `drafts/error-replacements/${draftName}`
    if (!existsSync(draftPath)) {
      const stub = agentB.buildReplacementDraftStub(report)
      writeFileSync(draftPath, `${JSON.stringify(stub, null, 2)}\n`, 'utf8')
      console.log(`  ✓ draft ${draftRel}`)
    }
    const replName = agentB.replacementQueueFileName(result.report_id)
    const replPath = join(REPL_DIR, replName)
    if (!existsSync(replPath)) {
      const item = agentB.buildReplacementQueueFile({
        report,
        result,
        draftRef: draftRel,
      })
      writeFileSync(replPath, `${JSON.stringify(item, null, 2)}\n`, 'utf8')
      console.log(`  ✓ ${replName} l1_due_at=${item.l1_due_at} dual_review_required=true`)
      wrote++
    } else {
      console.log(`  · skip existing ${replName}`)
    }
  }

  if (decision.shouldWithdraw) {
    if (WITHDRAW) {
      if (!runWithdraw(report.subject, report.question_id, result.report_id)) failed++
      else console.log(`  ✓ withdrawn ${report.subject}/${report.question_id}`)
    } else {
      console.log(`  ○ would withdraw ${report.subject}/${report.question_id} (pass --withdraw)`)
    }
  }

  if (PUSH_STATUS) {
    const ok = await pushReportStatus(result.report_id, decision.reportStatus)
    if (ok) console.log(`  → DB status ${decision.reportStatus}`)
    else failed++
  }
}

console.log(`done handled=${handled} wrote=${wrote} failed=${failed} mode=${WRITE ? 'write' : 'dry-run'}`)
process.exit(failed ? 1 : 0)
