// 生成 design-sync 用嘅 barrel entry ＋ componentSrcMap。
//
// 點解要自己生成：呢個 repo 嘅組件全部係 `export default function X`，
// 而 converter 嘅 synth-entry 用 `export * from '<file>'` —— `export *`
// 唔會帶 default，所以 `@ds-bundle` header 嘅 exports 係 0，
// `window.DSELevelUp` 空手而回，79 個預覽全部攞唔到組件。
//
// 用法（改完 components/ 之後重跑）：
//   node .design-sync/gen-entry.mjs
//
// 產出：
//   .design-sync/ds-entry.ts          —— 交畀 package-build.mjs --entry
//   .design-sync/component-src-map.json —— 貼入 config.json 嘅 componentSrcMap
//
// 唯讀 repo，只寫上面兩個檔。
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const SRC = join(ROOT, 'components')

/** 跳過：唔係學生見到嘅 UI，或者上傳咗都冇意義。 */
const SKIP = new Set(['Providers'])

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) return walk(p)
    return n.endsWith('.tsx') ? [p] : []
  })
}

const lines = ["import './ds-process-shim'", '']
const srcMap = {}
let defaults = 0
let named = 0

for (const file of walk(SRC).sort()) {
  const code = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file).replace(/\.tsx$/, '')
  const spec = `../${rel}`
  const base = file.split('/').pop().replace(/\.tsx$/, '')

  const def = code.match(/export default function ([A-Z][A-Za-z0-9]*)/)
  const bareDefault = /export default\s/.test(code) && !def
  const name = def?.[1] ?? base
  if (!SKIP.has(name) && (def || bareDefault)) {
    lines.push(`export { default as ${name} } from '${spec}'`)
    srcMap[name] = relative(ROOT, file)
    defaults++
  }

  // PascalCase 具名 export（例如 Skeleton.tsx 入面嘅 PracticeSkeleton）。
  // ⚠️ 第二個字必須係細楷／數字 —— 唔限制嘅話 `FONT`、`MIN`、`CATEGORIES`
  //    呢類全大寫常數都會當咗組件（實際踩過，第一版生成咗 8 個假組件）。
  const names = [...code.matchAll(/export (?:function|const) ([A-Z][a-z0-9][A-Za-z0-9]*)/g)]
    .map((m) => m[1])
    .filter((n) => n !== name && !SKIP.has(n))
  for (const n of [...new Set(names)]) {
    lines.push(`export { ${n} } from '${spec}'`)
    srcMap[n] = relative(ROOT, file)
    named++
  }
}

// Provider 要喺 bundle 入面先做得 cfg.provider —— 佢唔喺 components/ 入面。
lines.push('', "export { LanguageProvider } from '../lib/i18n'")

writeFileSync(join(ROOT, '.design-sync/ds-entry.ts'), lines.join('\n') + '\n')
writeFileSync(join(ROOT, '.design-sync/component-src-map.json'), JSON.stringify(srcMap, null, 2) + '\n')

console.log(`ds-entry.ts: ${defaults} 個 default export ＋ ${named} 個具名 export`)
console.log(`componentSrcMap: ${Object.keys(srcMap).length} 個組件`)
console.log(`跳過: ${[...SKIP].join(', ') || '（冇）'}`)
