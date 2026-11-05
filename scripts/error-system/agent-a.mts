#!/usr/bin/env -S npx tsx
// ============================================================================
// agent-a.mts — Queue Creator（錯誤反映 Phase 3）
// ----------------------------------------------------------------------------
//   npx tsx scripts/error-system/agent-a.mts              # dry-run：列出會寫嘅檔
//   npx tsx scripts/error-system/agent-a.mts --write      # 寫 .grok-queue/report-*.json
//   npx tsx scripts/error-system/agent-a.mts --write --push-status
//       # 另將 DB status open→queued（需 0034 已 apply）
//   npx tsx scripts/error-system/agent-a.mts --fixture path.json
//   npx tsx scripts/error-system/agent-a.mts --limit 10
//
// 預設 dry-run，唔改 DB、唔寫檔。`--push-status` 需要 0034 已 apply（status 含
// `queued`）；未 apply 時只 `--write` 佇列檔，status 維持 `open`。
//
// 唔用 Vercel Realtime 常駐（成本／邊界）；由 Cursor Agent／ops 週期執行本腳本。
// 並發：update … where status='open' 樂觀鎖；0 row = 已被其他 worker 取走。
// ============================================================================
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const QUEUE_DIR = join(ROOT, '.grok-queue')

const qr = (await import(join(ROOT, 'lib/errorSystem/queueReport.ts'))) as typeof import('../../lib/errorSystem/queueReport.ts')
const {
  buildQueueReport,
  isProcessableReportStatus,
  parseQueueReport,
  queueFileName,
} = qr
type BankQuestionLite = import('../../lib/errorSystem/queueReport.ts').BankQuestionLite
type ReportRow = import('../../lib/errorSystem/queueReport.ts').ReportRow

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const PUSH_STATUS = args.includes('--push-status')
const arg = (n: string) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}
const LIMIT = Number(arg('limit') ?? '50')
const FIXTURE = arg('fixture')

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

async function loadBankQuestion(questionId: string): Promise<BankQuestionLite | null> {
  const idx = (await import(join(ROOT, 'data/questions/index.ts'))) as {
    SUBJECTS?: { id: string }[]
    getSubjectQuestionsRaw: (id: string) => BankQuestionLite[]
  }
  // Prefer SUBJECTS from data/subjects if barrel exports differ
  const subjectsMod = (await import(join(ROOT, 'data/subjects.ts'))) as {
    subjects: { id: string }[]
  }
  for (const s of subjectsMod.subjects) {
    const list = idx.getSubjectQuestionsRaw(s.id)
    const hit = list.find((q) => q.id === questionId)
    if (hit) {
      return {
        id: hit.id,
        type: hit.type,
        subject: hit.subject || s.id,
        topic: hit.topic,
        difficulty: hit.difficulty,
        content: hit.content,
        contentEn: hit.contentEn,
        options: hit.options,
        optionsEn: hit.optionsEn,
        correctIndex: hit.correctIndex,
        referenceAnswer: hit.referenceAnswer,
      }
    }
  }
  return null
}

async function fetchOpenReports(): Promise<ReportRow[]> {
  if (FIXTURE) {
    const raw = JSON.parse(readFileSync(join(ROOT, FIXTURE), 'utf8')) as ReportRow | ReportRow[]
    const rows = Array.isArray(raw) ? raw : [raw]
    return rows.filter((r) => isProcessableReportStatus(r.status)).slice(0, LIMIT)
  }
  const dot = envFromDotLocal()
  const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || dot.NEXT_PUBLIC_SUPABASE_URL
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || dot.SUPABASE_SERVICE_ROLE_KEY
  if (!URL_ || !KEY) {
    console.error('✗ Supabase env missing (or pass --fixture path.json for offline)')
    process.exit(1)
  }
  const qs = new URLSearchParams({
    select: 'id,question_id,category,locale,status,created_at',
    status: 'eq.open',
    order: 'created_at.asc',
    limit: String(Number.isFinite(LIMIT) && LIMIT > 0 ? LIMIT : 50),
  })
  const r = await fetch(`${URL_}/rest/v1/question_reports?${qs}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
  if (!r.ok) {
    console.error(`✗ fetch question_reports: ${r.status} ${(await r.text()).slice(0, 300)}`)
    process.exit(1)
  }
  return (await r.json()) as ReportRow[]
}

async function markQueued(reportId: string | number): Promise<'ok' | 'skipped' | 'error'> {
  const dot = envFromDotLocal()
  const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || dot.NEXT_PUBLIC_SUPABASE_URL
  const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || dot.SUPABASE_SERVICE_ROLE_KEY
  if (!URL_ || !KEY) return 'error'
  const r = await fetch(
    `${URL_}/rest/v1/question_reports?id=eq.${encodeURIComponent(String(reportId))}&status=eq.open`,
    {
      method: 'PATCH',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ status: 'queued' }),
    },
  )
  if (!r.ok) {
    const body = await r.text()
    console.error(`✗ status→queued id=${reportId}: ${r.status} ${body.slice(0, 300)}`)
    console.error('  (Need migration 0034 applied for status=queued, or omit --push-status)')
    return 'error'
  }
  const rows = (await r.json()) as unknown[]
  return rows.length ? 'ok' : 'skipped'
}

const rows = await fetchOpenReports()
if (!rows.length) {
  console.log('✓ no open question_reports')
  process.exit(0)
}

mkdirSync(QUEUE_DIR, { recursive: true })

let wrote = 0
let skipped = 0
let failed = 0

for (const row of rows) {
  if (!isProcessableReportStatus(row.status)) {
    skipped++
    continue
  }
  const q = await loadBankQuestion(row.question_id)
  if (!q) {
    console.error(`✗ question not in bank: ${row.question_id} (report ${row.id})`)
    failed++
    continue
  }
  let payload
  try {
    payload = buildQueueReport(row, q)
  } catch (e) {
    console.error(`✗ build report ${row.id}:`, e instanceof Error ? e.message : e)
    failed++
    continue
  }
  const check = parseQueueReport(payload)
  if (!check.ok) {
    console.error(`✗ validate report ${row.id}: ${check.error}`)
    failed++
    continue
  }
  const file = join(QUEUE_DIR, queueFileName(row.id))
  if (existsSync(file)) {
    console.log(`· skip existing ${queueFileName(row.id)}`)
    skipped++
    continue
  }
  const json = `${JSON.stringify(payload, null, 2)}\n`
  if (!WRITE) {
    console.log(`○ dry-run would write ${queueFileName(row.id)} subject=${payload.subject} category=${payload.category}`)
    continue
  }
  writeFileSync(file, json, 'utf8')
  wrote++
  console.log(`✓ wrote ${queueFileName(row.id)}`)
  if (PUSH_STATUS && !FIXTURE) {
    const st = await markQueued(row.id)
    if (st === 'ok') console.log(`  → status queued`)
    else if (st === 'skipped') console.log(`  → status already taken`)
    else failed++
  }
}

console.log(`done write=${wrote} skipped=${skipped} failed=${failed} mode=${WRITE ? 'write' : 'dry-run'}`)
process.exit(failed ? 1 : 0)
