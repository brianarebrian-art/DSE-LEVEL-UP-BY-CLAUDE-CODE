import { logEvent } from './logger.mjs'
import { mockCves } from './mock.mjs'

const NVD = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
const PROXY = 'https://api.allorigins.win/raw?url='

function extractCvss(metrics = {}) {
  const v31 = metrics.cvssMetricV31?.[0]?.cvssData
  const v30 = metrics.cvssMetricV30?.[0]?.cvssData
  const v2 = metrics.cvssMetricV2?.[0]?.cvssData
  const data = v31 || v30 || v2
  if (!data) return { score: null, severity: 'UNKNOWN' }
  return {
    score: data.baseScore ?? null,
    severity: (data.baseSeverity || 'UNKNOWN').toUpperCase(),
  }
}

function normalize(item) {
  const cve = item.cve
  const { score, severity } = extractCvss(cve.metrics || {})
  const en = (cve.descriptions || []).find((d) => d.lang === 'en')
  return {
    id: cve.id,
    published: cve.published,
    lastModified: cve.lastModified,
    description: (en || cve.descriptions?.[0])?.value?.trim() || '(no description)',
    score,
    severity,
    kev: Boolean(cve.cisaExploitAdd) || Boolean(cve.cisaVulnerabilityName),
    references: (cve.references || []).slice(0, 3).map((r) => r.url),
    simulated: false,
  }
}

async function fetchDirect(url, apiKey) {
  const headers = {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent': 'DSE-Level-Up-Vuln-Tsunami/2.0',
  }
  if (apiKey) headers.apiKey = apiKey
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`NVD HTTP ${res.status}`)
  return res.json()
}

async function fetchViaProxy(url) {
  const proxied = PROXY + encodeURIComponent(url)
  const res = await fetch(proxied, {
    headers: { Accept: 'application/json', 'User-Agent': 'DSE-Level-Up-Vuln-Tsunami/2.0' },
  })
  if (!res.ok) throw new Error(`proxy HTTP ${res.status}`)
  return res.json()
}

/**
 * Pull latest CVEs. ~10–20s when healthy; falls back to allorigins then mock.
 */
function toNvdDate(d) {
  return new Date(d).toISOString().replace('Z', '')
}

export async function ingestNvd({ apiKey, resultsPerPage = 20, lookbackHours = 168 }) {
  const started = Date.now()
  const end = new Date()
  const start = new Date(end.getTime() - lookbackHours * 3600_000)
  const params = new URLSearchParams({
    resultsPerPage: String(resultsPerPage),
    startIndex: '0',
    lastModStartDate: toNvdDate(start),
    lastModEndDate: toNvdDate(end),
  })
  const url = `${NVD}?${params}`

  try {
    const data = await fetchDirect(url, apiKey)
    const cves = (data.vulnerabilities || []).map(normalize)
    logEvent('NVD', `OK direct count=${cves.length} ms=${Date.now() - started}`)
    return { cves, source: 'nvd-direct', simulated: false, durationMs: Date.now() - started }
  } catch (err1) {
    logEvent('NVD', `direct fail: ${err1.message}`)
    try {
      const data = await fetchViaProxy(url)
      const cves = (data.vulnerabilities || []).map(normalize)
      logEvent('NVD', `OK proxy count=${cves.length} ms=${Date.now() - started}`)
      return { cves, source: 'allorigins-proxy', simulated: false, durationMs: Date.now() - started }
    } catch (err2) {
      logEvent('NVD', `proxy fail: ${err2.message} → mock`)
      const cves = mockCves()
      return { cves, source: 'mock', simulated: true, durationMs: Date.now() - started }
    }
  }
}

export async function fetchWafEdrStatus(url) {
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    })
    if (!res.ok) throw new Error(`status ${res.status}`)
    const data = await res.json()
    return { ...data, ok: true, simulated: Boolean(data.simulated) }
  } catch (err) {
    logEvent('SYSTEM', `WAF/EDR status unreachable: ${err.message}`)
    return null
  }
}
