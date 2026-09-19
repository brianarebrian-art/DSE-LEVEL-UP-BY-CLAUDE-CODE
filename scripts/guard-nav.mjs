#!/usr/bin/env node
/**
 * guard-nav —— 每一條 route 都要有人決定佢有冇前／後頁導航。
 *
 * ══ 守緊乜 ══
 * `components/PageNav.tsx` 掛喺 AppShell 一次，讀 `lib/pageOrder.ts` 決定自己
 * 出唔出。好處係新開一條 route 唔使記得去加組件；壞處係【新開一條 route 冇人
 * 決定佢屬邊一類，佢就默默冇導航】—— 冇錯誤、冇測試紅、冇人發現。
 *
 * 呢個閘就係補返嗰一步：掃 `app/**​/page.tsx`，每一條 route 必須屬於三者之一 ——
 *   ① PAGE_ORDER（主瀏覽循環）
 *   ② IMMERSIVE_ROUTES（全屏任務模式，自動豁免）
 *   ③ EXCLUDED 並且寫低【書面理由】
 * 三樣都唔係就 exit 1，逼人去 lib/pageOrder.ts 明示佢屬邊一類。
 *
 * ══ 第二條不變式 ══
 * PAGE_ORDER 同 IMMERSIVE_ROUTES 唔可以有交集。`immersiveRoutes.ts` 檔頭寫明
 * 全屏係為咗「唔好將『隨時可以走去第二度』呢個念頭一路擺喺眼前」；將一條全屏
 * route 加入循環，就係喺練習頁底部原封不動擺返個念頭落去。呢樣 ① 本身捉唔到
 *（route 的確喺 PAGE_ORDER 入面，合法），所以要獨立一條斷言。
 *
 * 用法：node scripts/guard-nav.mjs
 * 唯讀，零依賴。
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

// ── 由 TS 原始碼讀常數 ────────────────────────────────────────────────────
// 唔 import：呢兩個檔係 TS，而本閘要喺純 node 底下跑（同其餘 guard 一致，
// 唔想為咗一個閘拉 tsx 落 qa 鏈）。所以用窄 regex 抽，抽唔到就當係錯，
// 唔會靜靜哋當成空清單放行 —— 空清單會令成個閘變成永遠綠。
function arrayFrom(file, name) {
  const src = readFileSync(join(ROOT, file), 'utf8')
  const m = src.match(new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`))
  if (!m) fail(`喺 ${file} 抽唔到 ${name} —— 個閘會變成永遠綠，所以當錯處理。`)
  const out = [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
  if (!out.length) fail(`${file} 嘅 ${name} 係空 —— 當錯處理，理由同上。`)
  return out
}

function recordFrom(file, name) {
  const src = readFileSync(join(ROOT, file), 'utf8')
  const m = src.match(new RegExp(`export const ${name}[^=]*=\\s*\\{([\\s\\S]*?)\\n\\}`))
  if (!m) fail(`喺 ${file} 抽唔到 ${name}。`)
  const out = {}
  for (const x of m[1].matchAll(/'([^']+)'\s*:\s*'([^']*)'/g)) out[x[1]] = x[2]
  return out
}

const problems = []
function fail(msg) {
  console.error(`\n  ❌ NAV GUARD —— ${msg}\n`)
  process.exit(1)
}

const PAGE_ORDER = arrayFrom('lib/pageOrder.ts', 'PAGE_ORDER')
const IMMERSIVE = arrayFrom('lib/immersiveRoutes.ts', 'IMMERSIVE_ROUTES')
const EXCLUDED = recordFrom('lib/pageOrder.ts', 'EXCLUDED')

// ── app/ 底下每個 page.tsx → route ────────────────────────────────────────
// route group `(auth)` 喺 URL 上面唔出現，但佢係 lib/pageOrder 入面嘅 key，
// 所以【保留】括號段 —— 兩邊要用同一個寫法，否則永遠對唔上。
function routes(dir = 'app', out = []) {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const rel = `${dir}/${e.name}`
    if (e.isDirectory()) routes(rel, out)
    else if (e.name === 'page.tsx') out.push(rel.replace(/^app/, '').replace(/\/page\.tsx$/, '') || '/')
  }
  return out
}

const isImmersive = (r) => IMMERSIVE.some((p) => r === p || r.startsWith(`${p}/`))

const all = routes().sort()
const unclassified = []
const noReason = []
for (const r of all) {
  if (PAGE_ORDER.includes(r)) continue
  if (isImmersive(r)) continue
  if (r in EXCLUDED) {
    if (!EXCLUDED[r].trim()) noReason.push(r)
    continue
  }
  unclassified.push(r)
}

// 第二條不變式：循環入面唔可以有全屏 route
const clash = PAGE_ORDER.filter(isImmersive)

// 第三條：EXCLUDED 入面唔應該有已經唔存在嘅 route（刪咗頁但留低條目 = 死規則）
const stale = Object.keys(EXCLUDED).filter((r) => !all.includes(r))

const line = '─'.repeat(70)
console.log(`\n${line}\n  guard-nav —— 前／後頁導航覆蓋（lib/pageOrder.ts 單一來源）\n${line}`)

if (unclassified.length) {
  problems.push(
    `${unclassified.length} 條 route 未分類 —— 佢哋而家【冇】前／後頁導航，而冇人決定過：\n` +
      unclassified.map((r) => `       ${r}`).join('\n') +
      `\n     去 lib/pageOrder.ts：加入 PAGE_ORDER，或者加入 EXCLUDED 並寫低理由。`,
  )
}
if (noReason.length) {
  problems.push(`EXCLUDED 有條目冇寫理由：${noReason.join(', ')}`)
}
if (clash.length) {
  problems.push(
    `PAGE_ORDER 出現全屏任務模式 route：${clash.join(', ')}\n` +
      `     immersiveRoutes.ts 檔頭寫明全屏係為咗唔好將「隨時可以走去第二度」擺喺眼前。`,
  )
}
if (stale.length) {
  problems.push(`EXCLUDED 有條目對應唔到任何 page.tsx（頁刪咗？）：${stale.join(', ')}`)
}

if (problems.length) {
  for (const p of problems) console.error(`  ❌ ${p}`)
  console.error(`${line}\n`)
  process.exit(1)
}

console.log(
  `  ✅ NAV GUARD PASSED —— ${all.length} 條 route 全部有人決定過：` +
    `${PAGE_ORDER.length} 條喺循環、${all.filter(isImmersive).length} 條全屏豁免、` +
    `${all.filter((r) => r in EXCLUDED).length} 條明示排除（各有書面理由）。`,
)
console.log(`${line}\n`)
