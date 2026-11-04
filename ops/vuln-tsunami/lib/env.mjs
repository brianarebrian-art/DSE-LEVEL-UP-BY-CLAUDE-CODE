// Load ops/vuln-tsunami/.env without touching the Next.js app env files.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(fileURLToPath(new URL('../monitor.mjs', import.meta.url)))

export function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const path = join(ROOT, name)
    if (!existsSync(path)) continue
    const text = readFileSync(path, 'utf8')
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq < 1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (process.env[key] === undefined) process.env[key] = value
    }
  }
}

export function requireNvdKey() {
  const key = (process.env.NVD_API_KEY || '').trim()
  if (!key) {
    throw new Error(
      'Missing NVD_API_KEY. Fix: copy ops/vuln-tsunami/.env.example to .env and paste your key.',
    )
  }
  return key
}

export { ROOT }
