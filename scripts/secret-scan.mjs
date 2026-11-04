#!/usr/bin/env node
/**
 * secret-scan.mjs — block obvious secret / service-role leaks in tracked source.
 *
 * Milestone A (v6): fail CI when client-reachable trees reference service role
 * env names, or when raw-looking private key blocks appear in app/components/lib.
 *
 * Not a substitute for gitleaks/trufflehog; cheap gate until those are approved.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const SKIP_DIRS = new Set([
  'node_modules',
  '.next',
  '.git',
  'coverage',
  'dist',
  'public',
  'docs',
  'scripts', // server/scripts may read SERVICE_ROLE by design; scanned separately below
])

const CLIENTISH = ['app', 'components', 'lib', 'data', 'utils']

/** Patterns that must never appear outside server-only / scripts. */
const FORBIDDEN_MATERIAL = [
  /BEGIN (RSA |OPENSSH )?PRIVATE KEY/,
  /sk_live_[0-9a-zA-Z]{20,}/,
  /sk_test_[0-9a-zA-Z]{20,}/,
]

const SERVICE_ROLE_NAME = /SUPABASE_SERVICE_ROLE_KEY/
const SERVICE_ROLE_OBJECT = /service_role['"`]\s*:/

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    if (SKIP_DIRS.has(name)) continue
    const abs = join(dir, name)
    const st = statSync(abs)
    if (st.isDirectory()) walk(abs, out)
    else if (/\.(ts|tsx|js|jsx|mjs|cjs|mts)$/.test(name)) out.push(abs)
  }
  return out
}

/** Server route handlers / tests may mention the env name; client modules must not. */
function mayMentionServiceRoleName(rel, src) {
  if (rel === 'utils/supabase/server.ts') return true
  if (src.includes("import 'server-only'") || src.includes('import "server-only"')) return true
  // App Router route handlers / server actions are never shipped as client bundles.
  if (/(^|\/)app\/api\//.test(rel)) return true
  if (/(^|\/)route\.(ts|js|tsx|jsx)$/.test(rel)) return true
  if (/\/__tests__\//.test(rel) || /\.test\.(ts|tsx|mts|js|mjs)$/.test(rel)) return true
  if (src.includes("'use client'") || src.includes('"use client"')) return false
  // Default: server Components under app/ may call getServiceSupabase — still prefer
  // not embedding the env name; allow only material checks there.
  if (rel.startsWith('app/')) return true
  return false
}

const failures = []

for (const top of CLIENTISH) {
  const base = join(ROOT, top)
  for (const file of walk(base)) {
    const rel = relative(ROOT, file).replace(/\\/g, '/')
    const src = readFileSync(file, 'utf8')

    for (const re of FORBIDDEN_MATERIAL) {
      if (re.test(src)) failures.push(`${rel}: matched ${re}`)
    }

    if (!mayMentionServiceRoleName(rel, src)) {
      if (SERVICE_ROLE_NAME.test(src)) {
        failures.push(`${rel}: matched ${SERVICE_ROLE_NAME}`)
      }
      if (SERVICE_ROLE_OBJECT.test(src)) {
        failures.push(`${rel}: matched ${SERVICE_ROLE_OBJECT}`)
      }
    }
  }
}

// scripts may use the env var name; still forbid private key PEM bodies in repo scripts.
for (const file of walk(join(ROOT, 'scripts'))) {
  const rel = relative(ROOT, file)
  const src = readFileSync(file, 'utf8')
  if (/BEGIN (RSA |OPENSSH )?PRIVATE KEY/.test(src)) {
    failures.push(`${rel}: private key block`)
  }
}

if (failures.length) {
  console.error('secret-scan failed:')
  for (const f of failures) console.error('  FAIL', f)
  process.exit(1)
}
console.log('secret-scan OK')
