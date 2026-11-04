// Shared scan engine used by CLI (monitor.mjs) and localhost:3005 dashboard.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { requireNvdKey, ROOT } from './env.mjs'
import { fetchWatchlistCves } from './nvd.mjs'
import { matchWatchlist, shouldAlert, rankAlerts } from './match.mjs'
import { loadState, saveState, markSeen, isNew } from './state.mjs'
import { formatReport, formatMacNotification } from './format.mjs'
import { notifyMac } from './notify.mjs'

export function loadConfig() {
  return JSON.parse(readFileSync(join(ROOT, 'config.json'), 'utf8'))
}

export async function runScan(options = {}) {
  const config = loadConfig()
  const hours =
    Number(options.hours) ||
    Number(process.env.LOOKBACK_HOURS) ||
    config.nvd.defaultLookbackHours
  const notify = Boolean(options.notify)
  const kevOnly = Boolean(options.kevOnly)
  const quiet = Boolean(options.quiet)
  const resetSeen = Boolean(options.resetSeen)

  if (!Number.isFinite(hours) || hours <= 0) {
    throw new Error(`Invalid hours: ${hours}`)
  }

  const apiKey = requireNvdKey()
  let state = loadState()
  if (resetSeen) {
    state = { seen: {}, lastRunAt: null, lastOkAt: null, runs: 0 }
  }

  const nowIso = new Date().toISOString()
  const { cves, window, total, queryErrors } = await fetchWatchlistCves({
    apiKey,
    baseUrl: config.nvd.baseUrl,
    lookbackHours: hours,
    watchlist: config.watchlist,
    resultsPerPage: Math.min(config.nvd.resultsPerPage, 50),
    minRequestGapMs: Number(process.env.POLL_SLEEP_MS) || config.nvd.minRequestGapMs,
    kevOnly,
  })

  const alerts = []
  for (const cve of cves) {
    if (kevOnly && !cve.kev) continue
    const hits = matchWatchlist(cve, config.watchlist)
    if (!shouldAlert(cve, hits, config.triage)) continue
    alerts.push({ cve, hits })
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
    quiet,
    maxShown: config.adhd.maxAlertsShown,
  })
  writeFileSync(join(reportDir, 'latest.md'), reportText + '\n', 'utf8')
  writeFileSync(
    join(reportDir, `run-${nowIso.replace(/[:.]/g, '-')}.json`),
    JSON.stringify({ window, counts: state.lastCounts, newAlerts }, null, 2) + '\n',
    'utf8',
  )

  if (notify && newAlerts.length) {
    for (const alert of newAlerts.slice(0, 3)) {
      notifyMac(formatMacNotification(alert))
    }
  }

  return {
    window,
    counts: state.lastCounts,
    newAlerts,
    alerts: ranked,
    reportText,
    queryErrors: queryErrors || [],
    hasNew: newAlerts.length > 0,
  }
}

export function readDashboardSnapshot() {
  const config = loadConfig()
  const state = loadState()
  let latestReport = ''
  let latestRun = null

  try {
    latestReport = readFileSync(join(ROOT, 'reports', 'latest.md'), 'utf8')
  } catch {
    latestReport = ''
  }

  try {
    const files = readdirSync(join(ROOT, 'reports'))
      .filter((f) => f.startsWith('run-') && f.endsWith('.json'))
      .sort()
      .reverse()
    if (files[0]) {
      latestRun = JSON.parse(readFileSync(join(ROOT, 'reports', files[0]), 'utf8'))
    }
  } catch {
    latestRun = null
  }

  return {
    isolation: '127.0.0.1 only · not the official website',
    portHint: 3005,
    watchlist: config.watchlist.map((w) => ({ id: w.id, label: w.label })),
    state: {
      lastRunAt: state.lastRunAt,
      lastOkAt: state.lastOkAt,
      runs: state.runs || 0,
      lastCounts: state.lastCounts || null,
      lastWindow: state.lastWindow || null,
    },
    latestReport,
    latestRun,
    hasKey: Boolean((process.env.NVD_API_KEY || '').trim()),
  }
}
