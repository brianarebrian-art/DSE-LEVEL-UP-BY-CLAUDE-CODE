import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// 每一版公開頁都要有自己嘅 <title> 同 description。
//
// ══ 點解 ══
// 2026-08-20 嘅信譽審核發現 7 個核心頁（about／methodology／transparency／reading／
// writing／focus／waiting）全部用緊同一個泛用標題。老師同家長好多時就係由搜尋結果
// 撳入嚟 —— 一個泛用標題等於冇講過呢版係咩。
//
// 呢個唔會由 build 捉到（冇 metadata 唔係錯誤，只係會 fallback 落 layout 嘅預設），
// 亦唔會由人手 review 捉到（加新頁嗰個 PR 唔會有人去對比全站 title）。所以要用閘。
//
// ⚠️ 讀原始碼而唔係 import —— npm test 釘死 tsx@4.19.2，做唔到 .ts/.tsx 具名 ESM import。

/** 唔需要獨立 metadata 嘅頁，每個要有理由。 */
const EXEMPT: { route: string; why: string }[] = [
  { route: 'app/page.tsx', why: '首頁 —— title/description 由 app/layout.tsx 嘅預設提供，本身就係最貼切嗰個。' },
  { route: 'app/dev/answer-cards/page.tsx', why: '開發用內部頁，唔喺 sitemap、唔會出現喺搜尋結果。' },
  { route: 'app/dev/long-session/page.tsx', why: '開發用內部頁，唔喺 sitemap、唔會出現喺搜尋結果。' },
  { route: 'app/admin/page.tsx', why: '管理員後台，noindex，唔會出現喺搜尋結果。' },
]

function pages(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'api') continue // route handler，冇 metadata 概念
      pages(p, out)
    } else if (e.name === 'page.tsx') out.push(p)
  }
  return out
}

const all = pages('app')

test('每一版都有獨立 metadata（或者喺豁免名單並寫明理由）', () => {
  const missing: string[] = []
  for (const f of all) {
    if (EXEMPT.some((e) => e.route === f)) continue
    const src = fs.readFileSync(f, 'utf8')
    // 動態路由由 generateMetadata 提供，一樣算數。
    if (/export const metadata|export async function generateMetadata|export function generateMetadata/.test(src)) continue
    missing.push(f)
  }
  assert.deepEqual(
    missing,
    [],
    `以下頁面冇獨立 metadata，會喺搜尋結果同社交預覽用泛用標題：\n  ${missing.join('\n  ')}\n` +
      "client component 加唔到 metadata —— 要拆成「殼（server + metadata）＋ 內容（client）」，" +
      '參考 app/privacy/page.tsx。',
  )
})

test('title 唔可以係泛用嘅 —— 要講返呢版係咩', () => {
  const GENERIC = /title:\s*['"`](DSE Level Up|首頁|Home|Page)\s*['"`]/i
  const bad = all.filter((f) => GENERIC.test(fs.readFileSync(f, 'utf8')))
  assert.deepEqual(bad, [], `以下頁面嘅 title 太泛用：\n  ${bad.join('\n  ')}`)
})

test('有 metadata 就要有 description —— 搜尋結果嗰兩行係佢', () => {
  const noDesc: string[] = []
  for (const f of all) {
    const src = fs.readFileSync(f, 'utf8')
    if (!/export const metadata/.test(src)) continue
    // noindex 頁唔會出現喺搜尋結果，description 冇意義。
    if (/robots:\s*\{[^}]*index:\s*false/.test(src)) continue
    if (!/description:/.test(src)) noDesc.push(f)
  }
  assert.deepEqual(noDesc, [], `以下頁面有 title 但冇 description：\n  ${noDesc.join('\n  ')}`)
})

test('豁免名單每項都真實存在，並且有實質理由', () => {
  for (const e of EXEMPT) {
    assert.ok(fs.existsSync(e.route), `豁免名單指向唔存在嘅頁：${e.route}`)
    assert.ok(e.why.length > 20, `豁免 ${e.route} 欠實質理由`)
  }
})
