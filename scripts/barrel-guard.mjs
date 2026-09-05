#!/usr/bin/env node
// ============================================================================
// barrel-guard.mjs —— client 組件唔准 value-import 題庫 barrel
// ----------------------------------------------------------------------------
//   node scripts/barrel-guard.mjs
//
// 守乜：`data/questions/index.ts` 靜態 import 齊 25 科題庫。喺 server 冇問題，
// 但任何 `'use client'` 檔（直接或轉幾手）value-import 佢，webpack 就要將
// 【全部 26,204 條題目】build 入瀏覽器。
//
// 2026-09-05 生產站實測，證實一直發生緊：
//   /          171 個資源 · 28 個題庫 chunk · 2.2MB 未壓縮 · 涵蓋 23 科
//   /subjects  171 個資源 · 28 個題庫 chunk · 全 25 科
//   /relax      38 個資源 · 0 個題庫 chunk（對照組）
// 首頁下載 1,067 條題目資料，一條都冇顯示過 —— 佢只係想要一個總數。
//
// 點解要一個閘而唔係修好就算：呢個洩漏【已經復發過】。
// `2fe936c`（2026-08-21「科目卡改顯示真實題數」）為咗喺卡上顯示一個題數，
// 引入咗第一個 barrel import。嗰次改動本身係啱嘅（顯示實數好過寫死），
// 錯只錯喺攞數字嘅途徑 —— 而個途徑喺 code review 上面完全睇唔出有咩問題。
// 下一次有人想喺 client 顯示題數，仍然會揀同一條路。所以要一個閘。
//
// 正確做法：
//   只要數字／課題名  → data/questions/summary.generated.ts（gzip 12KB）
//   真係要題目內容    → data/questions/load.ts 嘅逐科 lazy loader
//   `import type`     → 隨便（編譯後消失，零成本）
// ============================================================================
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BARREL = resolve(ROOT, 'data/questions/index.ts')
const SCAN = ['app', 'components', 'lib', 'data']

const files = []
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = join(d, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(ts|tsx|mts)$/.test(p) && !/__tests__|\.test\./.test(p)) files.push(p)
  }
}
for (const d of SCAN) walk(join(ROOT, d))

const src = new Map(files.map((f) => [resolve(f), readFileSync(f, 'utf8')]))

// 解析一條 import specifier → 絕對路徑（解唔到就回 null，即外部套件）
function resolveSpec(fromFile, spec) {
  let base
  if (spec.startsWith('@/')) base = resolve(ROOT, spec.slice(2))
  else if (spec.startsWith('.')) base = resolve(dirname(fromFile), spec)
  else return null
  for (const c of [base, base + '.ts', base + '.tsx', join(base, 'index.ts'), join(base, 'index.tsx')]) {
    try { if (statSync(c).isFile()) return resolve(c) } catch { /* 下一個 */ }
  }
  return null
}

// 一個檔嘅【靜態 value import】。刻意排除兩樣：
//   `import type { X }`  —— 編譯後消失
//   `await import(...)`  —— 動態，各自成 chunk，正正係我哋想要嘅嘢
function valueImports(file) {
  const code = src.get(file) ?? ''
  const out = []
  const re = /(^|\n)\s*import\s+(type\s+)?([\s\S]*?)from\s*['"]([^'"]+)['"]/g
  for (const m of code.matchAll(re)) {
    if (m[2]) continue                       // import type { … } from
    // `import { type A, type B } from` —— 全部具名都係 type 就當 type-only
    const clause = m[3].trim()
    if (clause.startsWith('{') && clause.endsWith('}')) {
      const names = clause.slice(1, -1).split(',').map((x) => x.trim()).filter(Boolean)
      if (names.length && names.every((n) => n.startsWith('type '))) continue
    }
    const r = resolveSpec(file, m[4])
    if (r) out.push(r)
  }
  return out
}

const isClient = (f) => /^\s*(['"])use client\1/.test(src.get(f) ?? '')

// 由一個 client 檔行落去，搵去到 barrel 嘅最短鏈
function chainToBarrel(entry) {
  const seen = new Set([entry])
  const q = [[entry]]
  while (q.length) {
    const path = q.shift()
    for (const next of valueImports(path[path.length - 1])) {
      if (next === BARREL) return [...path, next]
      if (seen.has(next)) continue
      seen.add(next)
      q.push([...path, next])
    }
  }
  return null
}

const rel = (p) => relative(ROOT, p)
const bad = []
for (const f of src.keys()) {
  if (!isClient(f)) continue
  const chain = chainToBarrel(f)
  if (chain) bad.push(chain)
}

const line = '─'.repeat(70)
console.log(`\n${line}\n  barrel-guard —— client 組件唔准 value-import 題庫 barrel\n${line}`)
if (!bad.length) {
  const n = [...src.keys()].filter(isClient).length
  console.log(`  ✅ BARREL GUARD PASSED —— 掃咗 ${n} 個 client 組件，冇一個拉到題庫 barrel。`)
  console.log(`${line}\n`)
  process.exit(0)
}
for (const chain of bad) {
  console.log(`\n  ❌ ${rel(chain[0])}`)
  for (let i = 1; i < chain.length; i++) console.log(`     ${'  '.repeat(i)}└─ ${rel(chain[i])}`)
}
console.log(`\n  ${bad.length} 個 client 組件會將全部 26,204 條題目 build 入瀏覽器。`)
console.log(`  只要數字／課題名 → data/questions/summary.generated.ts`)
console.log(`  真係要題目內容   → data/questions/load.ts 嘅 lazy loader`)
console.log(`  淨係要型別       → 改成 \`import type\``)
console.log(`${line}\n`)
process.exit(1)
