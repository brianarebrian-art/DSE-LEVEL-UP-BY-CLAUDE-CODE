import { appendFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './env.mjs'

const LOG_PATH = join(ROOT, 'vulntsunami.log')
const MAX_MEMORY = 200
const memory = []

export function logEvent(category, message, extra = null) {
  const cat = String(category || 'SYSTEM').toUpperCase()
  const allowed = new Set(['NVD', 'TRANSLATE', 'SYSTEM'])
  const kind = allowed.has(cat) ? cat : 'SYSTEM'
  const ts = new Date().toISOString()
  const line = `[${ts}] [${kind}] ${message}${extra != null ? ` | ${JSON.stringify(extra)}` : ''}`
  memory.push(line)
  if (memory.length > MAX_MEMORY) memory.splice(0, memory.length - MAX_MEMORY)
  try {
    appendFileSync(LOG_PATH, line + '\n', 'utf8')
  } catch {
    /* ignore disk errors on desktop */
  }
  return line
}

export function readLogTail(n = 80) {
  return memory.slice(-n)
}

export function getLogPath() {
  return LOG_PATH
}

// ensure parent exists when writing first time
try {
  mkdirSync(ROOT, { recursive: true })
} catch {
  /* ignore */
}
