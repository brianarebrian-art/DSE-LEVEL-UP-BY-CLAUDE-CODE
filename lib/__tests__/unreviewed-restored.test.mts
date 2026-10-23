// The practice label for machine-restored questions must list the same ids as the repair log.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { UNREVIEWED_RESTORED_IDS } = await import('../../data/questions/unreviewed-restored.ts')
const log = JSON.parse(readFileSync('data/questions/rationale-repairs.json', 'utf8')) as Record<string, { stage?: string; restoreBasis?: string }>

test('unreviewed restored ids match stage restored and restoreBasis machine-gate', () => {
  const fromLog = Object.entries(log)
    .filter(([, r]) => r.stage === 'restored' && r.restoreBasis === 'machine-gate')
    .map(([id]) => id)
    .sort()
  assert.deepEqual([...UNREVIEWED_RESTORED_IDS].sort(), fromLog)
})
