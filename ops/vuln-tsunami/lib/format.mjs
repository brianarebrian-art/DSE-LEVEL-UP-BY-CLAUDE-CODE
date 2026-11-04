// ADHD-friendly report formatter (i-have-adhd rules).
// Lead with action. Number steps. Cap visible list. End with one next step.

function truncate(text, n = 180) {
  const t = String(text || '').replace(/\s+/g, ' ').trim()
  if (t.length <= n) return t
  return t.slice(0, n - 1) + '…'
}

function primaryAction(alert) {
  const hit = alert.hits[0]
  if (alert.cve.kev) {
    return `Treat ${alert.cve.id} as exploited-in-the-wild (CISA KEV). ${hit?.actionHint || 'Patch now.'}`
  }
  return hit?.actionHint || `Review ${alert.cve.id} against the DSE Level Up stack.`
}

export function formatReport({ window, scanned, alerts, newAlerts, quiet, maxShown = 5 }) {
  const lines = []
  const top = newAlerts.slice(0, maxShown)
  const hidden = Math.max(0, newAlerts.length - top.length)

  if (top.length === 0) {
    lines.push('No new HIGH/CRITICAL stack hits this window. Stack watchlist is clear.')
    lines.push('')
    lines.push(`Window: ${window.start} → ${window.end}`)
    lines.push(`Scanned: ${scanned} CVE(s). Alerts total (incl. seen): ${alerts.length}.`)
    lines.push('')
    lines.push('Next: leave launchd running, or re-check with `node monitor.mjs --hours 72`.')
    return lines.join('\n')
  }

  const first = top[0]
  lines.push(primaryAction(first))
  lines.push('')
  lines.push(`NEW ${top.length}${hidden ? ` (+${hidden} more)` : ''} · window ${window.start.slice(0, 16)}Z`)
  lines.push('')

  top.forEach((alert, i) => {
    const c = alert.cve
    const labels = alert.hits.map((h) => h.label).join(', ')
    lines.push(`${i + 1}. ${c.id} · ${c.severity}${c.score != null ? ` ${c.score}` : ''}${c.kev ? ' · KEV' : ''} · ${labels}`)
    lines.push(`   ${truncate(c.description)}`)
    lines.push(`   Do: ${primaryAction(alert)}`)
    if (c.references?.[0]) lines.push(`   Link: ${c.references[0]}`)
    lines.push('')
  })

  if (hidden > 0) {
    lines.push(`+${hidden} more in reports/latest.md (ask for the next 5).`)
    lines.push('')
  }

  if (!quiet) {
    lines.push(`Time: ~5 min to triage the top item; ~30 min if a dependency bump is needed.`)
    lines.push('')
  }

  lines.push(`Next: open ${first.cve.id} — ${first.hits[0]?.label || 'stack'} — and apply the patch or upgrade.`)
  return lines.join('\n')
}

export function formatMacNotification(alert) {
  const c = alert.cve
  const title = `Vuln Tsunami · ${c.id}`
  const body = `${c.severity}${c.score != null ? ` ${c.score}` : ''}${c.kev ? ' KEV' : ''} · ${alert.hits.map((h) => h.label).join(', ')}\n${primaryAction(alert)}`
  return { title, body }
}
