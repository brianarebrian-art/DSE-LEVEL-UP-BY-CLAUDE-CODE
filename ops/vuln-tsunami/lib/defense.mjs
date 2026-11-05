import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, appendFileSync } from 'node:fs'
import { join } from 'node:path'
import { platform } from 'node:os'
import { ROOT } from './env.mjs'
import { logEvent } from './logger.mjs'

const blocked = new Map()
const defenseRuns = []

export function listBlocked() {
  return [...blocked.entries()].map(([id, meta]) => ({ id, ...meta }))
}

export function isBlocked(cveId) {
  return blocked.has(cveId)
}

export function listDefenseRuns() {
  return defenseRuns.slice(-40)
}

function runScript(name, args = []) {
  const script = join(ROOT, 'actions', name)
  if (!existsSync(script)) {
    return { ran: false, ok: false, detail: `${name} missing` }
  }
  const r = spawnSync('bash', [script, ...args.map(String)], {
    encoding: 'utf8',
    timeout: 20_000,
  })
  return {
    ran: true,
    ok: r.status === 0,
    detail: ((r.stdout || '') + (r.stderr || '')).trim().slice(0, 400),
    status: r.status,
  }
}

export function blockCve({ cveId, ip = null, autoBlock = false }) {
  const at = new Date().toISOString()
  let pf = { ran: false, ok: false, detail: 'skipped' }

  if (autoBlock && ip && platform() === 'darwin') {
    pf = runScript('block_ip.sh', [ip])
  }

  blocked.set(cveId, { at, ip, mode: pf.ran ? 'pfctl' : 'ui-only', pf })
  logEvent('SYSTEM', `BLOCK ${cveId} mode=${pf.ran ? 'pfctl' : 'ui-only'}`, { ip, pf })
  return { ok: true, cveId, at, statusZh: '已攔截', pf }
}

/** WAF: write rule artifact + optional shell hook */
export function wafAutoRule({ cves = [], dryRun = true } = {}) {
  const dir = join(ROOT, 'data', 'defense')
  mkdirSync(dir, { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const rules = cves.slice(0, 30).map((c) => ({
    id: c.id,
    action: 'block',
    match: c.id,
    tsunamiScore: c.tsunamiScore,
    reason: 'tsunami-auto-waf',
  }))
  const file = join(dir, `waf-rules-${stamp}.json`)
  writeFileSync(file, JSON.stringify({ generatedAt: stamp, dryRun, rules }, null, 2) + '\n')
  const sh = dryRun
    ? { ran: false, ok: true, detail: 'dry-run (auto_defense_live=false)' }
    : runScript('waf_rule.sh', [file])
  logEvent('SYSTEM', `WAF auto-rule rules=${rules.length} file=${file} dryRun=${dryRun}`, sh)
  return { ok: true, file, rules: rules.length, sh, dryRun }
}

/** EDR: isolate hosts tied to matched assets */
export function edrAutoIsolate({ hostIds = [], dryRun = true } = {}) {
  const hosts = hostIds.length ? hostIds : ['founder-mac']
  const results = []
  for (const hostId of hosts) {
    const sh = dryRun
      ? { ran: false, ok: true, detail: 'dry-run' }
      : runScript('edr_isolate.sh', [hostId])
    logEvent('SYSTEM', `EDR isolate host=${hostId} dryRun=${dryRun}`, sh)
    results.push({ hostId, sh })
  }
  return {
    ok: true,
    placeholder: dryRun,
    message: dryRun
      ? `EDR 隔離已排程（dry-run）${hosts.join(', ')} — 接 CrowdStrike/SentinelOne`
      : `EDR 隔離已執行：${hosts.join(', ')}`,
    results,
  }
}

/** Patch: schedule package upgrades for affected stack */
export function patchAutoSchedule({ packages = [], dryRun = true } = {}) {
  const pkgs = packages.length ? packages : ['next', 'react', 'node']
  const dir = join(ROOT, 'data', 'defense')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, 'patch-queue.jsonl')
  const line = JSON.stringify({
    at: new Date().toISOString(),
    packages: pkgs,
    dryRun,
  })
  appendFileSync(file, line + '\n')
  const sh = dryRun
    ? { ran: false, ok: true, detail: 'dry-run' }
    : runScript('patch_schedule.sh', pkgs)
  logEvent('SYSTEM', `PATCH schedule pkgs=${pkgs.join(',')} dryRun=${dryRun}`, sh)
  return {
    ok: true,
    placeholder: dryRun,
    message: dryRun
      ? `Patch 排程已寫入 ${file}（dry-run）— 接 brew upgrade / MDM`
      : `Patch 排程已執行：${pkgs.join(', ')}`,
    file,
    sh,
  }
}

/**
 * Defense Matrix — fire on LEV4+ tsunami.
 * Always writes SYSTEM logs. Live side-effects only when live=true.
 */
export function runDefenseMatrix({ level, cves = [], live = false } = {}) {
  const at = new Date().toISOString()
  const critical = cves.filter((c) => c.tier === 'critical')
  const hostIds = [
    ...new Set(
      critical.flatMap((c) => (c.assets || []).map((a) => a.id)).filter(Boolean),
    ),
  ].slice(0, 8)
  const packages = [
    ...new Set(
      critical.flatMap((c) => {
        const names = (c.assets || []).map((a) => a.id)
        return names
          .map((id) => {
            if (id.includes('next')) return 'next'
            if (id.includes('react')) return 'react'
            if (id.includes('node')) return 'node'
            if (id.includes('supabase')) return '@supabase/supabase-js'
            if (id.includes('sentry')) return '@sentry/nextjs'
            return null
          })
          .filter(Boolean)
      }),
    ),
  ]

  logEvent(
    'SYSTEM',
    `DEFENSE MATRIX START ${level?.label || 'LEV?'} crit=${critical.length} live=${live}`,
  )

  const waf = wafAutoRule({ cves: critical, dryRun: !live })
  const edr = edrAutoIsolate({
    hostIds: hostIds.length ? hostIds : ['founder-mac'],
    dryRun: !live,
  })
  const patch = patchAutoSchedule({ packages, dryRun: !live })

  // Auto-mark critical CVEs as blocked in UI when matrix runs
  for (const c of critical.slice(0, 20)) {
    if (!blocked.has(c.id)) {
      blocked.set(c.id, { at, ip: null, mode: 'matrix', pf: { ran: false, ok: true, detail: 'matrix' } })
    }
  }

  const run = { at, level: level?.label, waf, edr, patch, live }
  defenseRuns.push(run)
  logEvent(
    'SYSTEM',
    `DEFENSE MATRIX DONE ${level?.label} waf=${waf.rules} edr=${edr.results?.length} patch=${packages.length}`,
  )
  return run
}

// Back-compat names used by API buttons
export function edrIsolatePlaceholder(hostId) {
  return edrAutoIsolate({ hostIds: [hostId || 'founder-mac'], dryRun: true })
}

export function patchSchedulePlaceholder(packageName) {
  return patchAutoSchedule({
    packages: packageName ? [packageName] : ['next'],
    dryRun: true,
  })
}
