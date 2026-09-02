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
  //
  // 2026-09-02：沉浸式名單由 BottomNav 搬咗入 lib/immersiveRoutes.ts，
  // 因為 AppShell（Navbar／Footer）都要用同一張。呢個斷言跟住搬，
  // 而且順手擴闊：三個消費點缺一唔可 —— 名單、底欄、外殼。
  assert.ok(/isImmersiveRoute/.test(src), '底欄冇用共用嘅沉浸式判斷')

  const list = readFileSync(new URL('../../lib/immersiveRoutes.ts', import.meta.url).pathname, 'utf8')
  assert.ok(/IMMERSIVE_ROUTES/.test(list), '冇沉浸式路由名單')
  assert.ok(/'\/practice'/.test(list), '練習頁應收起底欄，否則會食走垂直空間兼易誤撳')

  const shell = readFileSync(new URL('../AppShell.tsx', import.meta.url).pathname, 'utf8')
  assert.ok(/isImmersiveRoute/.test(shell), 'AppShell 冇用沉浸式判斷 —— 練習頁會走返個 Navbar 出嚟')
  assert.ok(/!immersive && navbar/.test(shell), 'AppShell 冇喺沉浸式模式收起 Navbar')
  assert.ok(/!immersive && footer/.test(shell), 'AppShell 冇喺沉浸式模式收起 Footer')

  assert.ok(/aria-current/.test(src), '冇標示當前分頁')
  assert.ok(/md:hidden/.test(src), '底欄唔應該喺桌面出現')
})

test('練習頁必須自己有離開路徑 —— 全屏模式冇咗 Navbar', () => {
  const src = readFileSync(new URL('../../app/practice/PracticeSession.tsx', import.meta.url).pathname, 'utf8')
  // 呢條唔係樣式檢查，係防困死：Navbar 一收起，練習頁就係唯一出口。
  assert.ok(
    /href="\/subjects"/.test(src),
    '練習頁冇返回科目頁嘅連結 —— 學生會困死喺全屏狀態，只剩瀏覽器返回掣',
  )
})

// ── 導覽收斂（2026-08-21）──────────────────────────────────────────────────
test('頂部導覽收成四條內容入口，並且 /bookmarks 有咗入口', () => {
  const src = readFileSync(new URL('../Navbar.tsx', import.meta.url).pathname, 'utf8')
  // 由 `}[] = [` 之後先開始切 —— 唔可以用第一個 `]`，嗰個係型別註釋 `}[]` 嘅。
  const start = src.indexOf('}[] = [', src.indexOf('const navLinks'))
  const block = src.slice(start, src.indexOf('\n]', start))
  const hrefs = [...block.matchAll(/href: '([^']+)'/g)].map((m) => m[1])
  assert.deepEqual(hrefs, ['/subjects', '/dashboard', '/bookmarks', '/notes'])
  // /bookmarks 本來喺全站導覽入面一個入口都冇 —— 唔好又剷走。
  assert.ok(hrefs.includes('/bookmarks'), '/bookmarks 又冇咗導覽入口')
})

test('橫向導覽條喺 lg(1024px) 出，唔係 xl(1280px)', () => {
  const src = readFileSync(new URL('../Navbar.tsx', import.meta.url).pathname, 'utf8')
  // 實測：六條連結時連結組 natural 闊度 1,020px，要 xl 先擺得落 ——
  // 即係全部平板同細 mon 手提電腦都淨係得漢堡選單。收成四條之後 815px，
  // 1024px 下兩種語言都唔會斷行（實測 getClientRects().length === 1）。
  assert.ok(!/\bxl:(flex|hidden)\b/.test(src), 'Navbar 仲有 xl 斷點 —— 平板會冇咗橫向導航')
  assert.ok(/\blg:flex\b/.test(src) && /\blg:hidden\b/.test(src), '橫向條／漢堡掣應該用 lg 斷點')
})

test('紙筆戰士降級之後仍然有唔止一個入口', () => {
  const places = [
    ['../../app/subjects/SubjectsView.tsx', '科目總覽頁'],
    ['../Footer.tsx', 'Footer'],
  ]
  for (const [rel, name] of places) {
    const src = readFileSync(new URL(rel, import.meta.url).pathname, 'utf8')
    assert.ok(/\/paper-warrior/.test(src), `${name} 冇紙筆戰士入口 —— 由導覽降級落嚟就唔可以兩邊都冇`)
  }
})
