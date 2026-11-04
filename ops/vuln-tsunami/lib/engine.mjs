import { loadAppConfig } from './config.mjs'
import { ingestNvd, fetchWafEdrStatus } from './ingest.mjs'
import { scoreBatch, createLevelTracker } from './scoring.mjs'
import { translateBatch, setTranslateEnabled, getTranslateStats } from './translate.mjs'
import { blockCve, isBlocked, listBlocked, edrIsolatePlaceholder, patchSchedulePlaceholder } from './defense.mjs'
import { mockWafEdrStatus } from './mock.mjs'
import { logEvent, readLogTail } from './logger.mjs'

const levelTracker = createLevelTracker()

const state = {
  cves: [],
  wave: [],
  waveHeight: 0,
  batchScore: 0,
  crit: 0,
  high: 0,
  total: 0,
  level: { level: 1, label: 'LEV1', sum: 0, critCount: 0 },
  lastIngestAt: null,
  lastIngestSource: null,
  simulated: false,
  ingestError: null,
  ingestMs: null,
  wafEdr: mockWafEdrStatus(),
  refreshing: false,
  countdownSec: 60,
}

let timer = null
let countdownTimer = null

export function getState() {
  const cfg = loadAppConfig()
  const cves = state.cves.map((c) => ({
    ...c,
    blocked: isBlocked(c.id),
  }))
  return {
    isolation: '127.0.0.1:3005 · not official website',
    config: {
      pollIntervalSec: cfg.pollIntervalSec,
      resultsPerPage: cfg.resultsPerPage,
      autoBlock: cfg.autoBlock,
      translateEnabled: cfg.translateEnabled,
      hasKey: Boolean(cfg.nvdApiKey),
    },
    assets: cfg.assets,
    cves,
    wave: state.wave,
    waveHeight: state.waveHeight,
    batchScore: state.batchScore,
    counts: { crit: state.crit, high: state.high, total: state.total },
    level: state.level,
    translate: getTranslateStats(),
    lastIngestAt: state.lastIngestAt,
    lastIngestSource: state.lastIngestSource,
    simulated: state.simulated,
    ingestError: state.ingestError,
    ingestMs: state.ingestMs,
    wafEdr: state.wafEdr,
    refreshing: state.refreshing,
    countdownSec: state.countdownSec,
    blocked: listBlocked(),
    logs: readLogTail(60),
  }
}

function buildWave(scored) {
  // X = publish time, Y = CVSS — normalized points for canvas
  return scored
    .filter((c) => c.published)
    .map((c) => ({
      id: c.id,
      t: new Date(c.published).getTime(),
      y: c.cvss || 0,
      tier: c.tier,
      blocked: isBlocked(c.id),
    }))
    .sort((a, b) => a.t - b.t)
}

export async function refreshOnce({ forceTranslate = true } = {}) {
  if (state.refreshing) return getState()
  state.refreshing = true
  const cfg = loadAppConfig()
  setTranslateEnabled(cfg.translateEnabled)
  logEvent('SYSTEM', 'refresh start')

  try {
    const ingest = await ingestNvd({
      apiKey: cfg.nvdApiKey,
      resultsPerPage: cfg.resultsPerPage,
    })
    state.lastIngestSource = ingest.source
    state.simulated = ingest.simulated
    state.ingestMs = ingest.durationMs
    state.ingestError = null

    let scoredPack = scoreBatch(ingest.cves, cfg.assets)
    if (forceTranslate && cfg.translateEnabled) {
      const withZh = await translateBatch(scoredPack.scored, cfg.translateDelayMs)
      scoredPack = { ...scoredPack, scored: withZh }
    } else {
      scoredPack = {
        ...scoredPack,
        scored: scoredPack.scored.map((c) => ({
          ...c,
          descriptionZh: c.descriptionZh || c.description,
          descriptionEn: c.descriptionEn || c.description,
        })),
      }
    }

    levelTracker.note(scoredPack.scored)
    state.cves = scoredPack.scored
    state.crit = scoredPack.crit
    state.high = scoredPack.high
    state.total = scoredPack.total
    state.batchScore = scoredPack.batchScore
    state.waveHeight = scoredPack.waveHeight
    state.wave = buildWave(scoredPack.scored)
    state.level = levelTracker.level()
    state.lastIngestAt = new Date().toISOString()
    state.countdownSec = cfg.pollIntervalSec

    const waf = await fetchWafEdrStatus(cfg.wafEdrStatusUrl)
    state.wafEdr = waf || mockWafEdrStatus()

    logEvent(
      'SYSTEM',
      `refresh ok source=${ingest.source} total=${state.total} batch=${state.batchScore} ${state.level.label}`,
    )
  } catch (err) {
    state.ingestError = err instanceof Error ? err.message : String(err)
    logEvent('SYSTEM', `refresh error: ${state.ingestError}`)
  } finally {
    state.refreshing = false
  }
  return getState()
}

export function startEngine() {
  const cfg = loadAppConfig()
  state.countdownSec = cfg.pollIntervalSec
  if (timer) clearInterval(timer)
  if (countdownTimer) clearInterval(countdownTimer)

  // initial pull (non-blocking)
  refreshOnce().catch(() => {})

  timer = setInterval(() => {
    refreshOnce().catch(() => {})
  }, cfg.pollIntervalSec * 1000)

  countdownTimer = setInterval(() => {
    if (state.refreshing) return
    state.countdownSec = Math.max(0, state.countdownSec - 1)
  }, 1000)

  logEvent('SYSTEM', `engine started poll=${cfg.pollIntervalSec}s port=${cfg.dashboardPort}`)
}

export function stopEngine() {
  if (timer) clearInterval(timer)
  if (countdownTimer) clearInterval(countdownTimer)
  timer = null
  countdownTimer = null
}

export function apiBlock(cveId, ip) {
  const cfg = loadAppConfig()
  return blockCve({ cveId, ip, autoBlock: cfg.autoBlock })
}

export function apiToggleTranslate(enabled) {
  const cfg = loadAppConfig()
  // runtime override without rewriting yaml permanently
  cfg.translateEnabled = Boolean(enabled)
  setTranslateEnabled(cfg.translateEnabled)
  logEvent('SYSTEM', `translate ${cfg.translateEnabled ? 'ON' : 'OFF'}`)
  return getTranslateStats()
}

export function apiEdr(hostId) {
  return edrIsolatePlaceholder(hostId)
}

export function apiPatch(pkg) {
  return patchSchedulePlaceholder(pkg)
}
