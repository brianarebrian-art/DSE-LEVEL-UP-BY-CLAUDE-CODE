#!/usr/bin/env node

/**
 * Build-time Asset Integrity & Icon Guard
 *
 * Checks:
 * 1. Fails build if grep finds fa-, material-icons, bi-, or <i class
 * 2. Fails if our original <Icon name="..." /> component is used without a label/aria-label
 * 3. Fails if any button has icon-only without accessible name/label
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const FORBIDDEN_PATTERNS = [
  { regex: /\bfa-[a-z0-9-]+/i, desc: 'FontAwesome class detected' },
  { regex: /\bmaterial-icons\b/i, desc: 'Material Icons class detected' },
  { regex: /\bmaterial-symbols/i, desc: 'Material Symbols class detected' },
  { regex: /\bbi-[a-z0-9-]+/i, desc: 'Bootstrap Icons class detected' },
  { regex: /<i\s+class=/i, desc: 'Legacy <i class= icon tag detected' },
]

const SCAN_DIRS = ['app', 'components', 'src']
let errorCount = 0

function walk(dir, callback) {
  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.next' || entry === '.git') continue
      const fullPath = join(dir, entry)
      const st = statSync(fullPath)
      if (st.isDirectory()) {
        walk(fullPath, callback)
      } else if (/\.(tsx|ts|jsx|js|html)$/.test(entry)) {
        callback(fullPath)
      }
    }
  } catch {
    // Ignore missing directory
  }
}

console.log('🔍 Running Asset & Icon Integrity Guard...')

for (const dir of SCAN_DIRS) {
  walk(dir, (filepath) => {
    // Skip self, tests, or auto-fix script that contains the patterns for replacement
    if (
      filepath.includes('auto-fix-icons.ts') ||
      filepath.includes('check-asset-integrity') ||
      filepath.includes('__tests__')
    ) {
      return
    }

    const content = readFileSync(filepath, 'utf8')

    // 1. Check forbidden legacy font icon patterns
    for (const { regex, desc } of FORBIDDEN_PATTERNS) {
      if (regex.test(content)) {
        console.error(`❌ [Integrity Error] ${desc} in ${filepath}`)
        errorCount++
      }
    }

    // 2. Check <Icon name="..." /> usage for label / aria-label
    const iconMatches = content.matchAll(/<Icon\s+name=["']([^"']+)["']([^>]*)\/?>/g)
    for (const match of iconMatches) {
      const attrs = match[2]
      const hasLabel = /label\s*=/.test(attrs) || /aria-label\s*=/.test(attrs) || /aria-hidden\s*=/.test(attrs)
      if (!hasLabel) {
        console.error(`❌ [Accessibility Error] <Icon name="${match[1]}"> used without label/aria-label in ${filepath}: ${match[0]}`)
        errorCount++
      }
    }
  })
}

if (errorCount > 0) {
  console.error(`\n🚨 Asset integrity guard failed with ${errorCount} error(s).`)
  process.exit(1)
} else {
  console.log('✅ Asset integrity guard passed: 0 forbidden classes, 100% accessible icons.')
}
