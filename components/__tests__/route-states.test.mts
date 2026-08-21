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

// ── 手機底部導航 ────────────────────────────────────────────────────────────
test('底欄高度只喺一個地方定義，浮動掣一律靠變數讓位', () => {
  const css = readFileSync(new URL('../../app/globals.css', import.meta.url).pathname, 'utf8')
  assert.ok(/--bottom-nav-h/.test(css), 'globals.css 冇定義 --bottom-nav-h')
  // 底欄係 md:hidden；變數必須跟返同一個斷點，否則桌面會為咗一條睇唔見嘅欄讓位。
  assert.ok(
    /@media\s*\(min-width:\s*768px\)[\s\S]{0,160}--bottom-nav-h:\s*0/.test(css),
    '桌面斷點冇把 --bottom-nav-h 歸零 —— 浮動掣會為咗一條 display:none 嘅底欄讓出 3.5rem',
  )
  // 浮動掣唔准再硬編 bottom：硬編就唔會跟住底欄郁。
  for (const f of ['A11yPanel', 'GlobalA11y', 'ReadingRuler', 'PracticeSupport']) {
    const src = readFileSync(new URL(`../${f}.tsx`, import.meta.url).pathname, 'utf8')
    assert.ok(
      !/bottom-\[max\(/.test(src),
      `${f}.tsx 仲有硬編 bottom-[max(…)]，應改用 .floating-bottom* —— 否則底欄一出就會壓住佢`,
    )
    assert.ok(/floating-bottom/.test(src), `${f}.tsx 冇用 .floating-bottom*`)
  }
})

test('底欄四個入口指向真實路由，並且喺沉浸式模式收起', () => {
  const src = readFileSync(new URL('../BottomNav.tsx', import.meta.url).pathname, 'utf8')
  for (const href of ['/subjects', '/dashboard', '/bookmarks', '/account']) {
    assert.ok(src.includes(`'${href}'`), `底欄冇 ${href}`)
  }
  // /bookmarks 本來喺全站導覽入面完全冇入口 —— 呢個係底欄補返嘅實際缺口，唔好又剷走。
  assert.ok(/IMMERSIVE/.test(src), '冇沉浸式路由名單')
  assert.ok(/'\/practice'/.test(src), '練習頁應收起底欄，否則會食走垂直空間兼易誤撳')
  assert.ok(/aria-current/.test(src), '冇標示當前分頁')
  assert.ok(/md:hidden/.test(src), '底欄唔應該喺桌面出現')
})
