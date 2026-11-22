#!/usr/bin/env node
/**
 * Delete ONLY deployment IDs listed in the founder-approved JSON batches.
 *
 * Source of truth:
 *   docs/ops/functions-storage-approval-2026-11-19.json
 *   keys: batch1_error_canceled, batch2_preview_ready, batch3_old_production_ready
 *
 * Never deletes keep[] or confirm_E[].
 *
 * Usage:
 *   VERCEL_TOKEN=… node scripts/ops/delete-approved-vercel-deployments.mjs --dry-run
 *   VERCEL_TOKEN=… node scripts/ops/delete-approved-vercel-deployments.mjs
 *   VERCEL_TOKEN=… node scripts/ops/delete-approved-vercel-deployments.mjs --batch 1
 *   VERCEL_TOKEN=… BATCHES=1,2 node scripts/ops/delete-approved-vercel-deployments.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const APPROVAL = join(ROOT, 'docs/ops/functions-storage-approval-2026-11-19.json')
const TEAM = process.env.VERCEL_TEAM_SLUG || 'dselevelup'
const TOKEN = process.env.VERCEL_TOKEN
const DRY = process.argv.includes('--dry-run')

const BATCH_KEYS = {
  1: 'batch1_error_canceled',
  2: 'batch2_preview_ready',
  3: 'batch3_old_production_ready',
}

/** Defaults when approval JSON omits target/state (batch3 rows historically did). */
const BATCH_DEFAULTS = {
  1: { target: 'preview', state: '' },
  2: { target: 'preview', state: 'READY' },
  3: { target: 'production', state: 'READY' },
}

function labelTargetState(row, batch) {
  const defaults = BATCH_DEFAULTS[batch] || { target: 'unknown', state: '' }
  const target = row.target || defaults.target
  const state = row.state || defaults.state
  return { target, state }
}

function parseBatches() {
  const argIdx = process.argv.indexOf('--batch')
  if (argIdx >= 0 && process.argv[argIdx + 1]) {
    return String(process.argv[argIdx + 1])
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => n in BATCH_KEYS)
  }
  if (process.env.BATCHES) {
    return String(process.env.BATCHES)
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => n in BATCH_KEYS)
  }
  return [1, 2, 3]
}

if (!TOKEN) {
  console.error('Missing VERCEL_TOKEN. Create one at https://vercel.com/account/tokens')
  process.exit(2)
}

async function api(path, { method = 'GET' } = {}) {
  const url = path.includes('?')
    ? `https://api.vercel.com${path}&slug=${encodeURIComponent(TEAM)}`
    : `https://api.vercel.com${path}?slug=${encodeURIComponent(TEAM)}`
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
  })
  const text = await res.text()
  let body
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = { raw: text }
  }
  if (!res.ok) {
    const err = new Error(`${method} ${path} → ${res.status}`)
    err.status = res.status
    err.body = body
    throw err
  }
  return body
}

async function main() {
  const approval = JSON.parse(readFileSync(APPROVAL, 'utf8'))
  const keep = new Set((approval.keep || []).map((x) => x.id))
  const confirm = new Set((approval.confirm_E || []).map((x) => x.id))
  const batches = parseBatches()

  const targets = []
  for (const n of batches) {
    const key = BATCH_KEYS[n]
    for (const row of approval[key] || []) {
      if (!row?.id) continue
      if (keep.has(row.id)) {
        console.error(`REFUSE: ${row.id} is in keep[]`)
        process.exit(3)
      }
      if (confirm.has(row.id)) {
        console.error(`REFUSE: ${row.id} is in confirm_E[]`)
        process.exit(3)
      }
      const { target, state } = labelTargetState(row, n)
      targets.push({ ...row, batch: n, target, state })
    }
  }

  // Dedupe preserving first batch tag
  const seen = new Set()
  const unique = []
  for (const t of targets) {
    if (seen.has(t.id)) continue
    seen.add(t.id)
    unique.push(t)
  }

  const byTarget = unique.reduce((acc, t) => {
    acc[t.target] = (acc[t.target] || 0) + 1
    return acc
  }, {})
  console.log(`team=${TEAM} dryRun=${DRY} batches=${batches.join(',')}`)
  console.log(`keep=${keep.size} confirm_E=${confirm.size} delete=${unique.length}`)
  console.log(`delete_by_target ${JSON.stringify(byTarget)}`)

  const results = []
  let deleted = 0
  let failed = 0
  for (const t of unique) {
    const label = `batch${t.batch} ${t.id} ${t.target} ${t.state} ${t.branch || ''}`
    if (DRY) {
      console.log(`DRY would delete ${label}`)
      results.push({
        id: t.id,
        batch: t.batch,
        target: t.target,
        state: t.state,
        status: 'dry-run',
      })
      deleted++
      continue
    }
    try {
      await api(`/v13/deployments/${t.id}`, { method: 'DELETE' })
      deleted++
      results.push({
        id: t.id,
        batch: t.batch,
        target: t.target,
        state: t.state,
        status: 'deleted',
      })
      console.log(`deleted ${label}`)
    } catch (e) {
      failed++
      results.push({
        id: t.id,
        batch: t.batch,
        target: t.target,
        state: t.state,
        status: 'failed',
        error: e.message,
        body: e.body || null,
      })
      console.error(`FAIL ${label}: ${e.message}`, e.body || '')
    }
  }

  const out = join(ROOT, 'docs/ops/functions-storage-delete-result-2026-11-19.json')
  writeFileSync(
    out,
    JSON.stringify(
      {
        ranAt_hk: new Date().toLocaleString('en-HK', { timeZone: 'Asia/Hong_Kong' }),
        dryRun: DRY,
        batches,
        deleted,
        failed,
        keep: [...keep],
        results,
      },
      null,
      2,
    ),
  )
  console.log(`wrote ${out}`)
  console.log(`done deleted=${deleted} failed=${failed}`)
  if (failed) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
