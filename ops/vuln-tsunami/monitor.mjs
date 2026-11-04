#!/usr/bin/env node
// ============================================================================
// DSE Level Up — Vulnerability Tsunami Defence (desktop-isolated)
// ----------------------------------------------------------------------------
// REAL-TIME NVD poller for the DSE Level Up stack.
// Runs ONLY on the founder MacBook Pro desktop agent.
// MUST stay isolated from the official website (no app/ import, no Vercel).
//
// Output shape: i-have-adhd (action first, numbered, max 5, one next step).
//
// Usage:
//   node monitor.mjs
//   node monitor.mjs --hours 72
//   node monitor.mjs --notify
//   node monitor.mjs --kev-only
// ============================================================================

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadEnv, requireNvdKey, ROOT } from './lib/env.mjs'
import { fetchWatchlistCves } from './lib/nvd.mjs'
import { matchWatchlist, shouldAlert, rankAlerts } from './lib/match.mjs'
import { loadState, saveState, markSeen, isNew } from './lib/state.mjs'
import { formatReport, formatMacNotification } from './lib/format.mjs'
import { notifyMac } from './lib/notify.mjs'

loadEnv()

const config = JSON.parse(readFileSync(join(ROOT, 'config.json'), 'utf8'))

function parseArgs(argv) {
  const args = {
    hours: Number(process.env.LOOKBACK_HOURS) || config.nvd.defaultLookbackHours,
    notify: process.env.NOTIFY === '1',
    kevOnly: false,
    quiet: false,
    json: false,
    resetSeen: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--hours') args.hours = Number(argv[++i])
    else if (a === '--notify') args.notify = true
    else if (a === '--kev-only') args.kevOnly = true
    else if (a === '--quiet') args.quiet = true
    else if (a === '--json') args.json = true
    else if (a === '--reset-seen') args.resetSeen = true
    else if (a === '--help' || a === '-h') {
      console.log(`Usage: node monitor.mjs [--hours N] [--notify] [--kev-only] [--json] [--reset-seen]
Isolated desktop NVD monitor for DSE Level Up. Never import into the website.`)
      process.exit(0)
    }
  }
  if (!Number.isFinite(args.hours) || args.hours <= 0) {
    throw new Error(`Invalid --hours: ${args.hours}`)
  }
  return args
}

async function run() {
  const args = parseArgs(process.argv)
  const apiKey = requireNvdKey()
  let state = loadState()
  if (args.resetSeen) {
    state = { seen: {}, lastRunAt: null, lastOkAt: null, runs: 0 }
  }

  const nowIso = new Date().toISOString()
  const { cves, window, total, queryErrors } = await fetchWatchlistCves({
    apiKey,
    baseUrl: config.nvd.baseUrl,
    lookbackHours: args.hours,
    watchlist: config.watchlist,
    resultsPerPage: Math.min(config.nvd.resultsPerPage, 50),
    minRequestGapMs: Number(process.env.POLL_SLEEP_MS) || config.nvd.minRequestGapMs,
    kevOnly: args.kevOnly,
  })

  const alerts = []
  for (const cve of cves) {
    if (args.kevOnly && !cve.kev) continue
    const hits = matchWatchlist(cve, config.watchlist)
    // KEV sweep may return CVEs outside our stack — only alert on watchlist hits,
    // unless --kev-only was requested (still require a stack hit for actionability).
    if (!shouldAlert(cve, hits, config.triage)) continue
    alerts.push({ cve, hits })
  }

  if (queryErrors?.length && !args.quiet) {
    console.error(`Partial NVD errors (${queryErrors.length}): ${queryErrors[0]}`)
  }

  const ranked = rankAlerts(alerts)
  const newAlerts = ranked.filter((a) => isNew(state, a.cve.id))

  state = markSeen(
    state,
    ranked.map((a) => a.cve.id),
    nowIso,
  )
  state.lastRunAt = nowIso
  state.lastOkAt = nowIso
  state.runs = (state.runs || 0) + 1
  state.lastWindow = window
  state.lastCounts = {
    scanned: cves.length,
    totalReportedByNvd: total,
    alerts: ranked.length,
    newAlerts: newAlerts.length,
  }
  saveState(state)

  const reportDir = join(ROOT, 'reports')
  mkdirSync(reportDir, { recursive: true })
  const reportText = formatReport({
    window,
    scanned: cves.length,
    alerts: ranked,
    newAlerts,
    quiet: args.quiet,
    maxShown: config.adhd.maxAlertsShown,
  })
  writeFileSync(join(reportDir, 'latest.md'), reportText + '\n', 'utf8')
  writeFileSync(
    join(reportDir, `run-${nowIso.replace(/[:.]/g, '-')}.json`),
    JSON.stringify({ window, counts: state.lastCounts, newAlerts }, null, 2) + '\n',
    'utf8',
  )

  if (args.notify && newAlerts.length) {
    const top = newAlerts.slice(0, 3)
    for (const alert of top) {
      notifyMac(formatMacNotification(alert))
    }
  }

  if (args.json) {
    console.log(JSON.stringify({ window, counts: state.lastCounts, newAlerts }, null, 2))
  } else {
    console.log(reportText)
  }

  // Exit 2 when there are NEW actionable alerts (for launchd / desktop agent hooks)
  if (newAlerts.length) process.exitCode = 2
}

run().catch((err) => {
  const msg = err instanceof Error ? err.message : String(err)
  console.error(`NVD monitor failed: ${msg}`)
  console.error('Fix: check NVD_API_KEY in ops/vuln-tsunami/.env, then re-run `node monitor.mjs`.')
  process.exit(1)
})
