#!/usr/bin/env node
// Fail if the website (or other production paths) imports this monitor.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = fileURLToPath(new URL('../..', import.meta.url))
const FORBIDDEN_ROOTS = ['app', 'components', 'lib', 'scripts', 'utils', 'types']
const MARKERS = [
  'ops/vuln-tsunami',
  'vuln-tsunami/monitor',
  'NVD_API_KEY',
  'com.dselevelup.vuln-tsunami',
]

function walk(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name === '.git') continue
    const p = join(dir, name)
    let st
    try {
      st = statSync(p)
    } catch {
      continue
    }
    if (st.isDirectory()) walk(p, out)
    else if (/\.(mjs|mts|js|ts|tsx|jsx|json|md)$/.test(name)) out.push(p)
  }
  return out
}

const hits = []
for (const root of FORBIDDEN_ROOTS) {
  const abs = join(REPO, root)
  for (const file of walk(abs)) {
    const text = readFileSync(file, 'utf8')
    for (const marker of MARKERS) {
      if (text.includes(marker)) {
        hits.push(`${relative(REPO, file)} :: ${marker}`)
      }
    }
  }
}

if (hits.length) {
  console.error('ISOLATION BREACH — website/runtime paths reference vuln-tsunami:')
  for (const h of hits.slice(0, 20)) console.error(`  ${h}`)
  process.exit(1)
}

console.log('Isolation OK: no app/components/lib/scripts/utils/types reference to vuln-tsunami.')
console.log('Next: node ops/vuln-tsunami/monitor.mjs --hours 24')
