#!/usr/bin/env -S npx tsx
// ============================================================================
// cursor-handoff.mts — 由 replacement queue 印出 Cursor Agent prompt
// ----------------------------------------------------------------------------
//   npm run error:cursor-handoff
//   npm run error:cursor-handoff -- --report 9001
//
// 唔呼叫任何付費 API。只讀 .grok-replacement-queue／drafts／investigations。
// ============================================================================
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REPL_DIR = join(ROOT, '.grok-replacement-queue')
const DRAFT_DIR = join(ROOT, 'drafts/error-replacements')
const INV_DIR = join(ROOT, '.grok-investigations')
const QUEUE_DIR = join(ROOT, '.grok-queue')

const args = process.argv.slice(2)
const only = (() => {
  const i = args.indexOf('--report')
  return i >= 0 ? String(args[i + 1]) : null
})()

function listReplacements(): string[] {
  if (!existsSync(REPL_DIR)) return []
  return readdirSync(REPL_DIR)
    .filter((f) => f.startsWith('replacement-') && f.endsWith('.json') && !f.startsWith('_'))
    .sort()
}

function readJson(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>
  } catch {
    return null
  }
}

const files = listReplacements().filter((f) => (only ? f === `replacement-${only}.json` : true))
if (files.length === 0) {
  console.log('No replacement-*.json in .grok-replacement-queue/ — run agent-b --write first.')
  process.exit(0)
}

for (const f of files) {
  const repl = readJson(join(REPL_DIR, f))
  if (!repl) continue
  const reportId = String(repl.report_id)
  const draftPath = join(DRAFT_DIR, `draft-${reportId}.json`)
  const draft = readJson(draftPath)
  const result = readJson(join(INV_DIR, `result-${reportId}.json`))
  const report = readJson(join(QUEUE_DIR, `report-${reportId}.json`))

  const subject = String(repl.subject_slug ?? draft?.subject ?? 'unknown')
  const oldId = String(repl.old_question_id ?? draft?.old_question_id ?? '')
  const topic = String((draft?.topic as string) || (report as { original_question?: { topic?: string } })?.original_question?.topic || '')
  const difficulty = String((draft?.difficulty as string) || '')
  const l1Due = String(repl.l1_due_at ?? '')

  const prompt = `你係 DSE Level Up 題庫替換助手（錯誤反映 Phase 5 接手）。

## 任務
為已撤回／待替換題生成【同一科、同一課題、同一難度】嘅替換 MC（或原 type），寫入：
\`${draftPath.replace(ROOT + '/', '')}\`

將 \`status\` 由 \`awaiting_generation\` 改為 \`draft_ready\`（仍未上線）。

## 約束（憲章）
- 絕對免費站；唔好加付費 API／廣告
- 原創平行改寫；n-gram 唔好貼近考評局原文
- 公開 provenance 只用「經自動檢查」；禁止「AI生成替換」
- 必須保留 dual_review：之後仲要 L1 human_review（截止 ${l1Due || '＋24h'}）同 L2 second_review
- 唔好 runtime 改 production DB；唔好跳過 withdraw 紀錄
- 數理科答案要 correct-by-construction（可驗證計法）

## 個案
- report_id: ${reportId}
- subject: ${subject}
- old_question_id: ${oldId}
- topic: ${topic || '(見 draft／report)'}
- difficulty: ${difficulty || '(見 draft)'}
- bot: ${String((result as { assigned_bot_id?: string } | null)?.assigned_bot_id ?? (repl.investigation as { assigned_bot_id?: string } | undefined)?.assigned_bot_id ?? '')}
- confidence: ${String((result as { confidence?: number } | null)?.confidence ?? (repl.investigation as { confidence?: number } | undefined)?.confidence ?? '')}
- error_type: ${String((result as { error_type?: string } | null)?.error_type ?? '')}

## 參考檔（只讀）
- replacement: .grok-replacement-queue/${f}
- draft stub: drafts/error-replacements/draft-${reportId}.json
- investigation: .grok-investigations/result-${reportId}.json（若有）
- queue report: .grok-queue/report-${reportId}.json（若有）

## 完成定義
1. draft JSON 含完整題幹／選項／correctIndex／explanation（雙語若原題有）
2. 自檢：無重複選項、correctIndex=0 慣例或明示、陷阱說明誠實
3. 開 PR 只改 draft 檔（同必要測試）；標題註明 report ${reportId}
4. 唔 mark question_reports 為 fixed；唔 promote 入 bank
`

  console.log('\n' + '='.repeat(72))
  console.log(`REPORT ${reportId} → copy prompt below into Cursor Cloud Agent`)
  console.log('='.repeat(72) + '\n')
  console.log(prompt)
}
