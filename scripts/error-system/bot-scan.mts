#!/usr/bin/env -S npx tsx
// ============================================================================
// bot-scan.mts — Phase 4 Grok Bot file-scan harness（無 xAI API Key）
// ----------------------------------------------------------------------------
//   npx tsx scripts/error-system/bot-scan.mts                 # dry-run：列邊個 bot 會拎
//   npx tsx scripts/error-system/bot-scan.mts --bot math-bot
//   npx tsx scripts/error-system/bot-scan.mts --stub --write  # 寫低 confidence stub result
//   npx tsx scripts/error-system/bot-scan.mts --all-bots --stub --write
//
// 正式 Grok VM 跟 `.grok-bots/*.md` 自己重做題；本 harness 只做：
//   路由 + schema 驗證 +（可選）誠實 stub（confidence 0.45 → needs_human）
// 忽略 `_` 開頭檔；已有 result-{id}.json 則 skip。
// ============================================================================
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const QUEUE_DIR = join(ROOT, '.grok-queue')
const OUT_DIR = join(ROOT, '.grok-investigations')

const routing = (await import(join(ROOT, 'lib/errorSystem/botRouting.ts'))) as typeof import('../../lib/errorSystem/botRouting.ts')
const queue = (await import(join(ROOT, 'lib/errorSystem/queueReport.ts'))) as typeof import('../../lib/errorSystem/queueReport.ts')
const inv = (await import(join(ROOT, 'lib/errorSystem/investigationResult.ts'))) as typeof import('../../lib/errorSystem/investigationResult.ts')

const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const STUB = args.includes('--stub')
const ALL = args.includes('--all-bots')
const arg = (n: string) => {
  const i = args.indexOf(`--${n}`)
  return i >= 0 ? args[i + 1] : undefined
}
const botArg = arg('bot') as import('../../lib/errorSystem/botRouting.ts').BotId | undefined

if (botArg && !(routing.BOT_IDS as readonly string[]).includes(botArg)) {
  console.error(`✗ unknown bot: ${botArg} (want ${routing.BOT_IDS.join('|')})`)
  process.exit(2)
}
if (WRITE && !STUB) {
  console.error('✗ --write requires --stub in Phase 4 harness (full re-solve is Grok VM only)')
  process.exit(2)
}

const bots: import('../../lib/errorSystem/botRouting.ts').BotId[] = ALL
  ? [...routing.BOT_IDS]
  : botArg
    ? [botArg]
    : [...routing.BOT_IDS]

function listQueueFiles(): string[] {
  if (!existsSync(QUEUE_DIR)) return []
  return readdirSync(QUEUE_DIR)
    .filter((f) => f.startsWith('report-') && f.endsWith('.json') && !f.startsWith('_'))
    .sort()
}

mkdirSync(OUT_DIR, { recursive: true })

let claimed = 0
let wrote = 0
let skipped = 0
let failed = 0

const files = listQueueFiles()
if (!files.length) {
  console.log('✓ no report-*.json in .grok-queue (underscore examples are ignored)')
  process.exit(0)
}

for (const file of files) {
  const path = join(QUEUE_DIR, file)
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    console.error(`✗ parse ${file}:`, e instanceof Error ? e.message : e)
    failed++
    continue
  }
  const parsed = queue.parseQueueReport(raw)
  if (!parsed.ok) {
    console.error(`✗ invalid queue ${file}: ${parsed.error}`)
    failed++
    continue
  }
  const report = parsed.value
  const owner = routing.botForSubject(report.subject)

  for (const botId of bots) {
    if (!routing.botClaimsSubject(botId, report.subject)) continue
    claimed++
    const outName = inv.resultFileName(report.report_id)
    const outPath = join(OUT_DIR, outName)
    if (existsSync(outPath)) {
      console.log(`· skip existing ${outName} (${botId})`)
      skipped++
      continue
    }
    if (!STUB) {
      console.log(`○ ${file} → ${botId} (owner=${owner}) dry-run`)
      continue
    }
    const result = inv.buildStubInvestigation(report, botId)
    const check = inv.parseInvestigationResult(result)
    if (!check.ok) {
      console.error(`✗ stub invalid for ${file}: ${check.error}`)
      failed++
      continue
    }
    if (!WRITE) {
      console.log(`○ stub dry-run ${outName} bot=${botId} confidence=${result.confidence}`)
      continue
    }
    writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
    wrote++
    console.log(`✓ wrote ${outName} bot=${botId} confidence=${result.confidence} dual_review_required=true`)
  }
}

console.log(
  `done claimed=${claimed} wrote=${wrote} skipped=${skipped} failed=${failed} mode=${WRITE ? 'write' : 'dry-run'} stub=${STUB}`,
)
process.exit(failed ? 1 : 0)
