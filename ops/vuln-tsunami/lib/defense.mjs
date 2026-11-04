import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { platform } from 'node:os'
import { ROOT } from './env.mjs'
import { logEvent } from './logger.mjs'

const blocked = new Map() // cveId -> { at, ip?, mode }

export function listBlocked() {
  return [...blocked.entries()].map(([id, meta]) => ({ id, ...meta }))
}

export function isBlocked(cveId) {
  return blocked.has(cveId)
}

/**
 * One-click block: mark intercepted + optional pfctl via actions/block_ip.sh
 */
export function blockCve({ cveId, ip = null, autoBlock = false }) {
  const at = new Date().toISOString()
  let pf = { ran: false, ok: false, detail: 'skipped' }

  if (autoBlock && ip && platform() === 'darwin') {
    const script = join(ROOT, 'actions', 'block_ip.sh')
    if (existsSync(script)) {
      const r = spawnSync('bash', [script, ip], { encoding: 'utf8', timeout: 15_000 })
      pf = {
        ran: true,
        ok: r.status === 0,
        detail: (r.stdout || r.stderr || '').trim().slice(0, 300),
      }
    } else {
      pf = { ran: false, ok: false, detail: 'block_ip.sh missing' }
    }
  }

  blocked.set(cveId, { at, ip, mode: pf.ran ? 'pfctl' : 'ui-only', pf })
  logEvent('SYSTEM', `BLOCK ${cveId} mode=${pf.ran ? 'pfctl' : 'ui-only'}`, { ip, pf })
  return { ok: true, cveId, at, statusZh: '已攔截', pf }
}

/** Placeholder — CrowdStrike / SentinelOne (~40 min integration) */
export function edrIsolatePlaceholder(hostId) {
  logEvent('SYSTEM', `EDR isolate placeholder host=${hostId || 'n/a'} (CrowdStrike/SentinelOne TBD)`)
  return {
    ok: false,
    placeholder: true,
    message: 'EDR 隔離接口預留（CrowdStrike / SentinelOne，約 40 分鐘接入）',
  }
}

/** Placeholder — brew upgrade / MDM (~30 min) */
export function patchSchedulePlaceholder(packageName) {
  logEvent('SYSTEM', `PATCH schedule placeholder pkg=${packageName || 'n/a'} (brew/MDM TBD)`)
  return {
    ok: false,
    placeholder: true,
    message: 'Patch 排程接口預留（brew upgrade / MDM，約 30 分鐘接入）',
  }
}
