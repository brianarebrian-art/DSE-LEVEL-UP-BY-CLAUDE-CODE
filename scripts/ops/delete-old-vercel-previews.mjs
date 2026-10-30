#!/usr/bin/env node
/**
 * Delete old Vercel preview (and failed/canceled) deployments to free
 * Hobby Function Storage / Deployment Storage.
 *
 * Requires env VERCEL_TOKEN (https://vercel.com/account/tokens).
 *
 * Keeps:
 * - all production Ready deployments that still have an active alias, plus
 *   the newest KEEP_PRODUCTION Ready production deployments
 * - the newest KEEP_PREVIEW Ready preview deployments (default 0)
 *
 * Usage:
 *   VERCEL_TOKEN=… node scripts/ops/delete-old-vercel-previews.mjs
 *   VERCEL_TOKEN=… node scripts/ops/delete-old-vercel-previews.mjs --dry-run
 *   VERCEL_TOKEN=… KEEP_PREVIEW=3 node scripts/ops/delete-old-vercel-previews.mjs
 */
const TEAM = process.env.VERCEL_TEAM_SLUG || 'dselevelup'
const PROJECT = process.env.VERCEL_PROJECT || 'dse-level-up-by-claude-code'
const KEEP_PRODUCTION = Number(process.env.KEEP_PRODUCTION || 3)
const KEEP_PREVIEW = Number(process.env.KEEP_PREVIEW || 0)
const DRY = process.argv.includes('--dry-run')
const TOKEN = process.env.VERCEL_TOKEN

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

async function listAllDeployments() {
  const out = []
  let until
  for (let page = 0; page < 50; page++) {
    const q = new URLSearchParams({
      app: PROJECT,
      limit: '100',
    })
    if (until) q.set('until', String(until))
    const data = await api(`/v6/deployments?${q}`)
    const batch = data.deployments || []
    if (!batch.length) break
    out.push(...batch)
    const next = data.pagination?.next
    if (!next) break
    until = next
  }
  return out
}

function classify(d) {
  const target = d.target || null
  const state = d.state || d.readyState || ''
  return { target, state, id: d.uid || d.id, created: d.created || d.createdAt || 0, url: d.url }
}

async function main() {
  console.log(`team=${TEAM} project=${PROJECT} dryRun=${DRY}`)
  console.log(`keep production Ready=${KEEP_PRODUCTION} preview Ready=${KEEP_PREVIEW}`)

  const raw = await listAllDeployments()
  const deps = raw.map(classify).filter((d) => d.id)
  console.log(`listed ${deps.length} deployments`)

  const prodReady = deps
    .filter((d) => d.target === 'production' && d.state === 'READY')
    .sort((a, b) => b.created - a.created)
  const previewReady = deps
    .filter((d) => d.target !== 'production' && d.state === 'READY')
    .sort((a, b) => b.created - a.created)

  const keep = new Set([
    ...prodReady.slice(0, KEEP_PRODUCTION).map((d) => d.id),
    ...previewReady.slice(0, KEEP_PREVIEW).map((d) => d.id),
  ])

  // Never delete BUILDING / QUEUED mid-flight without cancel — skip them.
  const skipLive = new Set(
    deps.filter((d) => ['BUILDING', 'QUEUED', 'INITIALIZING'].includes(d.state)).map((d) => d.id),
  )

  const toDelete = deps.filter((d) => !keep.has(d.id) && !skipLive.has(d.id))
  console.log(`keep ${keep.size}; skip live ${skipLive.size}; delete ${toDelete.length}`)

  let deleted = 0
  let failed = 0
  for (const d of toDelete) {
    const label = `${d.id} ${d.target || 'preview'} ${d.state} ${d.url || ''}`
    if (DRY) {
      console.log(`DRY would delete ${label}`)
      deleted++
      continue
    }
    try {
      await api(`/v13/deployments/${d.id}`, { method: 'DELETE' })
      deleted++
      console.log(`deleted ${label}`)
    } catch (e) {
      failed++
      console.error(`FAIL ${label}: ${e.message}`, e.body || '')
    }
  }

  console.log(`done deleted=${deleted} failed=${failed}`)
  if (failed) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
