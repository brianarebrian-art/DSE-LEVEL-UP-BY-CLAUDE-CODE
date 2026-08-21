// ============================================================================
// route-states.test.mts —— 路由層錯誤／載入狀態
// ----------------------------------------------------------------------------
// 守三樣：
//   1. root `error.tsx` 存在，而且【唔會】把錯誤原訊息 render 出去。
//      生產環境下客戶端 render 錯誤嘅原訊息係會送到瀏覽器嘅，
//      裏面可以帶住檔案路徑同內部結構。
//   2. `loading.tsx` 只准出現喺 build 標記 `ƒ`（每次請求即時 render）嘅路由。
//      靜態／SSG 路由加咗只會令仲有用嘅舊頁面提早被骨架屏取代 ——
//      實測客戶端導航嘅空白期係 0ms，冇嘢好填。理由詳見 app/README-loading.md。
//   3. 錯誤頁要畀得返一條搵到人嘅路（錯誤編號 + 回報），
//      同題目勘誤入口同一個原則：唔淨係話「出咗事」。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const APP = new URL('../../app', import.meta.url).pathname

/** build 標記 `ƒ` 嘅使用者頁面路由 —— 只有呢啲准有 loading.tsx。 */
const DYNAMIC_ROUTES = new Set(['admin', 'dev/answer-cards', 'dev/long-session'])

function walk(dir: string, rel = ''): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.') || name === 'api') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full, rel ? `${rel}/${name}` : name))
    else if (name === 'loading.tsx') out.push(rel)
  }
  return out
}

test('root error.tsx 存在且唔會外洩錯誤原訊息', () => {
  const src = readFileSync(join(APP, 'error.tsx'), 'utf8')
  assert.ok(/'use client'/.test(src), 'error.tsx 必須係 client component')
  assert.ok(/reset/.test(src), '冇提供重試')
  // 只准展示 digest；render `error.message` 會外洩內部結構。
  assert.ok(!/\{\s*error\.message\s*\}/.test(src), 'error.tsx 唔可以 render error.message')
  assert.ok(/error\.digest/.test(src), '應展示 digest 畀學生報障時引用')
})

test('錯誤頁要畀得返一條搵到人嘅路', () => {
  const src = readFileSync(join(APP, 'error.tsx'), 'utf8')
  assert.ok(/mailto:/.test(src), '冇回報入口')
  assert.ok(/role="alert"/.test(src), '讀屏用戶收唔到錯誤通知')
})

test('loading.tsx 只准出現喺動態路由（靜態路由加咗會製造閃動）', () => {
  const found = walk(APP)
  const bad = found.filter((r) => !DYNAMIC_ROUTES.has(r))
  assert.deepEqual(
    bad,
    [],
    `以下路由喺 build 入面係靜態／SSG，唔應該有 loading.tsx：\n  ${bad.join('\n  ')}\n` +
      '（先睇 app/README-loading.md 嘅實測數據；要加就先確認嗰條路由 build 標記係 ƒ）',
  )
})
