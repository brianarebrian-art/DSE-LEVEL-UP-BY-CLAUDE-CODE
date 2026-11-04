// Tsunami Ingestion — NVD + CISA KEV + optional VulnCheck, every minute
import { logEvent } from './logger.mjs'
import { mockCves } from './mock.mjs'

const NVD = 'https://services.nvd.nist.gov/rest/json/cves/2.0'
const CISA_KEV =
  'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
const VULNCHECK_INDEX = 'https://api.vulncheck.com/v3/index/nist-nvd2'
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

function normalizeNvd(item) {
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
    sources: ['nvd'],
    references: (cve.references || []).slice(0, 3).map((r) => r.url),
    simulated: false,
  }
}

function toNvdDate(d) {
  return new Date(d).toISOString().replace('Z', '')
}

async function fetchJson(url, headers = {}) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'User-Agent': 'DSE-Level-Up-Vuln-Tsunami/3.0',
      ...headers,
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url.slice(0, 80)}`)
  return res.json()
}

async function fetchViaProxy(url) {
  return fetchJson(PROXY + encodeURIComponent(url))
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
  const headers = apiKey ? { apiKey } : {}

  try {
    const data = await fetchJson(url, headers)
    const cves = (data.vulnerabilities || []).map(normalizeNvd)
    logEvent('NVD', `OK direct count=${cves.length} ms=${Date.now() - started}`)
    return { cves, source: 'nvd-direct', simulated: false, durationMs: Date.now() - started }
  } catch (err1) {
    logEvent('NVD', `direct fail: ${err1.message}`)
    try {
      const data = await fetchViaProxy(url)
      const cves = (data.vulnerabilities || []).map(normalizeNvd)
      logEvent('NVD', `OK proxy count=${cves.length} ms=${Date.now() - started}`)
      return { cves, source: 'allorigins-proxy', simulated: false, durationMs: Date.now() - started }
    } catch (err2) {
      logEvent('NVD', `proxy fail: ${err2.message}`)
      throw err2
    }
  }
}

/** CISA Known Exploited Vulnerabilities — recent additions only (lookbackDays). */
export async function ingestCisaKev({ limit = 20, lookbackDays = 30 } = {}) {
  const started = Date.now()
  try {
    let data
    try {
      data = await fetchJson(CISA_KEV)
    } catch {
      data = await fetchViaProxy(CISA_KEV)
    }
    const cutoff = Date.now() - lookbackDays * 86_400_000
    const vulns = (data.vulnerabilities || [])
      .filter((v) => {
        const t = Date.parse(v.dateAdded || '')
        return Number.isFinite(t) ? t >= cutoff : false
      })
      .sort((a, b) => String(b.dateAdded).localeCompare(String(a.dateAdded)))
      .slice(0, limit)
    const cves = vulns.map((v) => ({
      id: v.cveID,
      published: v.dateAdded ? `${v.dateAdded}T00:00:00.000` : new Date().toISOString(),
      lastModified: v.dueDate ? `${v.dueDate}T00:00:00.000` : new Date().toISOString(),
      description: `${v.vulnerabilityName || v.cveID}: ${v.shortDescription || ''}`.trim(),
      score: 9.0,
      severity: 'CRITICAL',
      kev: true,
      sources: ['cisa-kev'],
      references: [
        'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
      ],
      simulated: false,
      vendorProject: v.vendorProject || null,
      product: v.product || null,
    }))
    logEvent('NVD', `CISA-KEV OK recent=${cves.length} ms=${Date.now() - started}`)
    return { cves, source: 'cisa-kev', ok: true }
  } catch (err) {
    logEvent('NVD', `CISA-KEV fail: ${err.message}`)
    return { cves: [], source: 'cisa-kev', ok: false, error: err.message }
  }
}

/**
 * Optional VulnCheck Index (requires vulncheck_api_key).
 * Free community token — if missing, skip without failing the poll.
 */
export async function ingestVulnCheck({ apiKey, limit = 20 } = {}) {
  if (!apiKey) {
    logEvent('NVD', 'VulnCheck skipped (no vulncheck_api_key)')
    return { cves: [], source: 'vulncheck', ok: false, skipped: true }
  }
  const started = Date.now()
  try {
    const url = `${VULNCHECK_INDEX}?limit=${limit}`
    const data = await fetchJson(url, { Authorization: `Bearer ${apiKey}` })
    const rows = data.data || data.vulnerabilities || data.results || []
    const cves = rows.slice(0, limit).map((row) => {
      const id = row.cve || row.id || row.CVE || row.cveID
      const metrics = row.metrics || row.cvss || {}
      const score =
        metrics.cvssMetricV31?.[0]?.cvssData?.baseScore ??
        row.cvss3_score ??
        row.cvss ??
        null
      return {
        id,
        published: row.published || row.date_published || new Date().toISOString(),
        lastModified: row.lastModified || row.date_updated || new Date().toISOString(),
        description: row.summary || row.description || `VulnCheck entry ${id}`,
        score: score != null ? Number(score) : 7.5,
        severity: score >= 9 ? 'CRITICAL' : score >= 7 ? 'HIGH' : 'MEDIUM',
        kev: Boolean(row.kev || row.cisa_kev),
        sources: ['vulncheck'],
        references: [`https://nvd.nist.gov/vuln/detail/${id}`],
        simulated: false,
      }
    }).filter((c) => c.id)
    logEvent('NVD', `VulnCheck OK count=${cves.length} ms=${Date.now() - started}`)
    return { cves, source: 'vulncheck', ok: true }
  } catch (err) {
    logEvent('NVD', `VulnCheck fail: ${err.message}`)
    return { cves: [], source: 'vulncheck', ok: false, error: err.message }
  }
}

function mergeCves(lists) {
  const byId = new Map()
  for (const list of lists) {
    for (const cve of list) {
      if (!cve?.id) continue
      const prev = byId.get(cve.id)
      if (!prev) {
        byId.set(cve.id, { ...cve, sources: [...(cve.sources || [])] })
        continue
      }
      const sources = new Set([...(prev.sources || []), ...(cve.sources || [])])
      byId.set(cve.id, {
        ...prev,
        ...cve,
        kev: Boolean(prev.kev || cve.kev),
        score: Math.max(Number(prev.score) || 0, Number(cve.score) || 0) || prev.score || cve.score,
        sources: [...sources],
        description: (cve.description && cve.description.length > (prev.description || '').length
          ? cve.description
          : prev.description),
      })
    }
  }
  return [...byId.values()]
}

/**
 * Full tsunami pull: NVD + CISA KEV + VulnCheck (+ CMDB/WAF context fetched by engine).
 */
export async function ingestTsunami({
  nvdApiKey,
  vulncheckApiKey,
  resultsPerPage = 20,
  lookbackHours = 168,
} = {}) {
  const started = Date.now()
  const sources = []
  const buckets = []

  try {
    const nvd = await ingestNvd({
      apiKey: nvdApiKey,
      resultsPerPage,
      lookbackHours,
    })
    buckets.push(nvd.cves)
    sources.push(nvd.source)
  } catch (err) {
    logEvent('NVD', `NVD unavailable: ${err.message}`)
  }

  const kev = await ingestCisaKev({ limit: 40 })
  if (kev.cves.length) {
    buckets.push(kev.cves)
    sources.push('cisa-kev')
  }

  const vc = await ingestVulnCheck({ apiKey: vulncheckApiKey, limit: resultsPerPage })
  if (vc.cves.length) {
    buckets.push(vc.cves)
    sources.push('vulncheck')
  }

  let cves = mergeCves(buckets)
  let simulated = false
  if (!cves.length) {
    cves = mockCves().map((c) => ({ ...c, sources: ['mock'] }))
    sources.push('mock')
    simulated = true
    logEvent('NVD', 'all feeds failed → mock [模擬]')
  }

  return {
    cves,
    source: sources.join('+'),
    sources,
    simulated,
    durationMs: Date.now() - started,
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

/** Pull recent WAF/EDR log lines if the stub exposes /logs */
export async function fetchWafEdrLogs(baseStatusUrl) {
  try {
    const u = new URL(baseStatusUrl)
    u.pathname = '/logs'
    const res = await fetch(u.toString(), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data.logs) ? data.logs.slice(-40) : []
  } catch {
    return []
  }
}
