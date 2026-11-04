/**
 * Scoring:
 * - per CVE: CVSS * assetImportance * exposure  (normalized /5/5 so base≈CVSS)
 * - batch:   crit*4 + high*2 + total
 * - levels:  嚴重≥9 / 高危≥7 / 中危<7  (by CVSS)
 * - wave:    batch weighted height
 * - LEV4 if critCount*weight surge in 10 minutes (crit score sum >= 15)
 */

export function riskLabelZh(score) {
  if (score == null) return '未知'
  if (score >= 9) return '嚴重'
  if (score >= 7) return '高危'
  return '中危'
}

export function riskTier(score) {
  if (score == null) return 'unknown'
  if (score >= 9) return 'critical'
  if (score >= 7) return 'high'
  return 'medium'
}

function matchAssets(cve, assets) {
  const text = `${cve.id} ${cve.description}`.toLowerCase()
  const hits = []
  for (const a of assets) {
    const tokens = [a.id, a.name, ...(a.keywords || [])]
      .filter(Boolean)
      .flatMap((t) => {
        const s = String(t).toLowerCase()
        const parts = s.split(/[\s/_-]+/).filter((p) => p.length >= 3)
        return [s, ...parts, s.replace(/\.js$/, '')]
      })
    if (tokens.some((t) => t.length >= 3 && text.includes(t))) hits.push(a)
  }
  if (cve.assetHints?.length) {
    for (const id of cve.assetHints) {
      const a = assets.find((x) => x.id === id)
      if (a && !hits.includes(a)) hits.push(a)
    }
  }
  if (!hits.length && assets[0]) hits.push(assets[0])
  return hits.slice(0, 3)
}

export function scoreCve(cve, assets) {
  const cvss = Number(cve.score) || 0
  const matched = matchAssets(cve, assets)
  const importance = matched[0]?.importance ?? 3
  const exposure = matched[0]?.exposure ?? 3
  // CVSS × importance × exposure, scaled so importance/exposure of 5 → ×1
  const composite = cvss * (importance / 5) * (exposure / 5)
  return {
    ...cve,
    cvss,
    composite: Math.round(composite * 10) / 10,
    tier: riskTier(cvss),
    tierZh: riskLabelZh(cvss),
    assets: matched.map((a) => ({ id: a.id, name: a.name, importance: a.importance, exposure: a.exposure })),
    blocked: Boolean(cve.blocked),
  }
}

export function scoreBatch(cves, assets) {
  const scored = cves.map((c) => scoreCve(c, assets))
  let crit = 0
  let high = 0
  for (const c of scored) {
    if (c.tier === 'critical') crit += 1
    else if (c.tier === 'high') high += 1
  }
  const total = scored.length
  // crit*4 + high*2 + total
  const batchScore = crit * 4 + high * 2 + total
  const waveHeight = Math.min(100, Math.round(batchScore * 2.2 + crit * 8))
  return { scored, crit, high, total, batchScore, waveHeight }
}

/**
 * Track critical surge in a 10-minute window.
 * Auto-escalate to LEV4 when sum of critical CVSS in window >= 15.
 */
export function createLevelTracker() {
  const criticalEvents = [] // { at, score, id }

  function note(scoredList) {
    const now = Date.now()
    const seen = new Set(criticalEvents.map((e) => e.id))
    for (const c of scoredList) {
      if (c.tier !== 'critical') continue
      if (seen.has(c.id)) {
        // refresh timestamp for existing id inside window
        const row = criticalEvents.find((e) => e.id === c.id)
        if (row) row.at = now
        continue
      }
      seen.add(c.id)
      criticalEvents.push({ at: now, score: c.cvss || 0, id: c.id })
    }
    const cutoff = now - 10 * 60_000
    while (criticalEvents.length && criticalEvents[0].at < cutoff) criticalEvents.shift()
  }

  function level() {
    const sum = criticalEvents.reduce((s, e) => s + e.score, 0)
    const critCount = criticalEvents.length
    // LEV5: extreme (sum>=30 or critCount>=5)
    if (sum >= 30 || critCount >= 5) return { level: 5, label: 'LEV5', sum, critCount }
    // LEV4: crit surge >= 15 in 10 min
    if (sum >= 15) return { level: 4, label: 'LEV4', sum, critCount }
    if (sum >= 9 || critCount >= 2) return { level: 3, label: 'LEV3', sum, critCount }
    if (sum > 0) return { level: 2, label: 'LEV2', sum, critCount }
    return { level: 1, label: 'LEV1', sum, critCount }
  }

  return { note, level, criticalEvents }
}
