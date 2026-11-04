import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './env.mjs'

const DATA_DIR = join(ROOT, 'data')
const STATE_PATH = join(DATA_DIR, 'seen.json')

export function loadState() {
  if (!existsSync(STATE_PATH)) {
    return { seen: {}, lastRunAt: null, lastOkAt: null, runs: 0 }
  }
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'))
  } catch {
    return { seen: {}, lastRunAt: null, lastOkAt: null, runs: 0 }
  }
}

export function saveState(state) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8')
}

export function markSeen(state, cveIds, nowIso) {
  const next = { ...state, seen: { ...state.seen } }
  for (const id of cveIds) {
    if (!next.seen[id]) next.seen[id] = { firstSeenAt: nowIso }
    next.seen[id].lastSeenAt = nowIso
  }
  // Keep last 2000 CVE ids to bound file size
  const ids = Object.keys(next.seen)
  if (ids.length > 2000) {
    ids
      .sort((a, b) => String(next.seen[a].lastSeenAt).localeCompare(String(next.seen[b].lastSeenAt)))
      .slice(0, ids.length - 2000)
      .forEach((id) => delete next.seen[id])
  }
  return next
}

export function isNew(state, cveId) {
  return !state.seen?.[cveId]
}
