import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '../..')

test('writeFounderAudit 原始碼承諾回傳 persisted 布林', () => {
  const src = readFileSync(join(root, 'lib/founder/audit.ts'), 'utf8')
  assert.match(src, /persisted:\s*boolean/)
  assert.match(src, /persisted:\s*true/)
  assert.match(src, /persisted:\s*false/)
})

test('schemaProbe 探測三張 0029 核心表', () => {
  const src = readFileSync(join(root, 'lib/founder/schemaProbe.ts'), 'utf8')
  assert.match(src, /founder_audit_events/)
  assert.match(src, /founder_operational_tasks/)
  assert.match(src, /founder_feature_flags/)
  assert.match(src, /ready:\s*auditEvents/)
})

test('metrics 喺 schema 未就緒時降為 degraded 並推 alert intel', () => {
  const src = readFileSync(join(root, 'lib/founder/metrics.ts'), 'utf8')
  assert.match(src, /probeFounderOsSchema/)
  assert.match(src, /founder-os-schema-0029/)
  assert.match(src, /platformStatus[\s\S]*degraded/)
})

test('Phase 0 baseline 同 0029 runbook 存在', () => {
  const baseline = readFileSync(join(root, 'docs/baseline-2026-10-31.md'), 'utf8')
  assert.match(baseline, /24\.2%/)
  assert.match(baseline, /繼續唔數/)
  const runbook = readFileSync(join(root, 'docs/ops/APPLY-0029-FOUNDER-OS.md'), 'utf8')
  assert.match(runbook, /尚未套用/)
})
