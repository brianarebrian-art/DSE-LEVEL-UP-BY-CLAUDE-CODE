// NVD CVE API 2.0 client — zero dependencies, desktop-only.
// Docs: https://nvd.nist.gov/developers/vulnerabilities

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function toNvdDate(d) {
  // NVD wants ISO-8601 with milliseconds; drop Z for compatibility with their parser.
  return new Date(d).toISOString().replace('Z', '')
}

export function extractCvss(metrics = {}) {
  const v31 = metrics.cvssMetricV31?.[0]?.cvssData
  const v30 = metrics.cvssMetricV30?.[0]?.cvssData
  const v2 = metrics.cvssMetricV2?.[0]?.cvssData
  const data = v31 || v30 || v2
  if (!data) return { score: null, severity: 'UNKNOWN', version: null }
  return {
    score: data.baseScore ?? null,
    severity: (data.baseSeverity || 'UNKNOWN').toUpperCase(),
    version: data.version || null,
  }
}

export function extractDescription(descriptions = []) {
  const en = descriptions.find((d) => d.lang === 'en')
  return (en || descriptions[0])?.value?.trim() || '(no description)'
}

export function normalizeCve(item) {
  const cve = item.cve
  const { score, severity, version } = extractCvss(cve.metrics || {})
  return {
    id: cve.id,
    published: cve.published,
    lastModified: cve.lastModified,
    description: extractDescription(cve.descriptions || []),
    score,
    severity,
    cvssVersion: version,
    kev: Boolean(cve.cisaExploitAdd) || Boolean(cve.cisaVulnerabilityName),
    cisaName: cve.cisaVulnerabilityName || null,
    cisaActionDue: cve.cisaActionDue || null,
    references: (cve.references || []).slice(0, 5).map((r) => r.url),
  }
}

async function nvdGet(url, headers, minRequestGapMs) {
  let attempt = 0
  while (attempt < 5) {
    const res = await fetch(url, { headers })
    if (res.status === 429 || res.status >= 500) {
      attempt += 1
      await sleep(Math.max(minRequestGapMs * (attempt + 1), attempt * 12_000))
      continue
    }
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      const hint = res.headers.get('message') || body.slice(0, 200)
      throw new Error(`NVD HTTP ${res.status}: ${hint}`)
    }
    return res.json()
  }
  throw new Error(
    'NVD unavailable after 5 retries (429/5xx). Fix: wait 2 minutes, re-run `node monitor.mjs`.',
  )
}

async function fetchQuery({
  apiKey,
  baseUrl,
  params,
  resultsPerPage = 50,
  minRequestGapMs = 6500,
  maxPages = 5,
}) {
  const headers = {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    'User-Agent':
      'DSE-Level-Up-Vuln-Tsunami/1.0 (desktop-isolated; contact=dselevelup@gmail.com)',
    apiKey,
  }

  const all = []
  let startIndex = 0
  let total = Infinity
  let pages = 0

  while (startIndex < total && pages < maxPages) {
    if (pages > 0) await sleep(minRequestGapMs)
    const q = new URLSearchParams(params)
    q.set('resultsPerPage', String(resultsPerPage))
    q.set('startIndex', String(startIndex))
    const data = await nvdGet(`${baseUrl}?${q.toString()}`, headers, minRequestGapMs)
    total = data.totalResults ?? 0
    const batch = data.vulnerabilities || []
    all.push(...batch.map(normalizeCve))
    startIndex += batch.length || resultsPerPage
    pages += 1
    if (batch.length === 0) break
  }

  return { cves: all, total }
}

/**
 * Targeted poll: one query per watchlist primary keyword + optional KEV sweep.
 * Avoids dumping the entire NVD modification window (which triggers Cloudflare 502s).
 */
export async function fetchWatchlistCves({
  apiKey,
  baseUrl,
  lookbackHours,
  watchlist,
  resultsPerPage = 50,
  minRequestGapMs = 6500,
  kevOnly = false,
}) {
  const end = new Date()
  const start = new Date(end.getTime() - lookbackHours * 3600_000)
  const window = { start: start.toISOString(), end: end.toISOString() }
  const dateParams = {
    lastModStartDate: toNvdDate(start),
    lastModEndDate: toNvdDate(end),
  }

  const byId = new Map()
  const queries = []

  if (kevOnly) {
    queries.push({ label: 'kev', params: { ...dateParams, hasKev: '' } })
  } else {
    queries.push({ label: 'kev', params: { ...dateParams, hasKev: '' } })
    for (const item of watchlist) {
      const kw = (item.keywords && item.keywords[0]) || item.id
      queries.push({
        label: item.id,
        params: { ...dateParams, keywordSearch: kw },
      })
    }
  }

  let queryIndex = 0
  for (const q of queries) {
    if (queryIndex > 0) await sleep(minRequestGapMs)
    queryIndex += 1
    try {
      const { cves } = await fetchQuery({
        apiKey,
        baseUrl,
        params: q.params,
        resultsPerPage,
        minRequestGapMs,
        maxPages: 3,
      })
      for (const cve of cves) {
        if (!byId.has(cve.id)) byId.set(cve.id, cve)
      }
    } catch (err) {
      // Keep going on a single keyword failure; surface at the end if everything failed.
      q.error = err instanceof Error ? err.message : String(err)
    }
  }

  const failed = queries.filter((q) => q.error)
  if (byId.size === 0 && failed.length === queries.length) {
    throw new Error(`All NVD queries failed. First: ${failed[0].error}`)
  }

  return {
    cves: [...byId.values()],
    window,
    total: byId.size,
    queryErrors: failed.map((q) => `${q.label}: ${q.error}`),
  }
}
