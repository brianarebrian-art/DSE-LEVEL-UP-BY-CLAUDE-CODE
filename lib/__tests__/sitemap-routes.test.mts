// sitemap 列出嘅每一條靜態路由，都要真係有一個 page.tsx。
//
// ══ 點解要有呢條 ══
// app/sitemap.ts 檔頭第 ① 條寫明：列出一條唔存在嘅路由「等於主動邀請爬蟲索引 404，
// 比沒有 sitemap 更差」。但冇任何嘢驗過佢 —— 2026-09-05 剷除 /focus 嗰陣，
// sitemap 嗰行漏咗清，之後兩個星期一直向搜尋引擎報告一版 404，冇任何測試紅過。
// 同一段註釋入面亦仲寫住 `/dashboard/report`，都係同日刪咗嘅頁。
//
// 已有嘅測試全部係單向：「/privacy 必須喺 sitemap」「/community-safety 必須喺 sitemap」。
// 反方向 —— sitemap 入面嘅嘢必須存在 —— 冇人守。呢條守嘅係成個方向，唔係 /focus 一條。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const APP = join(ROOT, 'app')

/** STATIC_ROUTES 入面每一個 `path: '...'`。動態段（逐科、史料）由資料生成，唔喺呢度。 */
function sitemapPaths(): string[] {
  const src = readFileSync(join(APP, 'sitemap.ts'), 'utf8')
  const block = src.slice(src.indexOf('STATIC_ROUTES'), src.indexOf('export default'))
  return [...block.matchAll(/path:\s*'([^']*)'/g)].map((m) => m[1])
}

/**
 * 一條 URL 路徑有冇對應嘅 page.tsx。
 * 路由組 `(auth)` 唔會出現喺 URL，所以每一層都要容許穿過任何 `(xxx)` 資料夾。
 */
function resolves(urlPath: string): boolean {
  const segs = urlPath.split('/').filter(Boolean)
  const walk = (dir: string, i: number): boolean => {
    if (i === segs.length) return existsSync(join(dir, 'page.tsx'))
    const direct = join(dir, segs[i])
    if (existsSync(direct) && statSync(direct).isDirectory() && walk(direct, i + 1)) return true
    return readdirSync(dir, { withFileTypes: true }).some(
      (d) => d.isDirectory() && /^\(.+\)$/.test(d.name) && walk(join(dir, d.name), i),
    )
  }
  return walk(APP, 0)
}

test('resolves() 本身分得出有同冇 —— 唔可以永遠答 true', () => {
  assert.equal(resolves(''), true, '首頁都搵唔到，resolver 壞咗')
  assert.equal(resolves('/privacy'), true)
  assert.equal(resolves('/focus'), false, '/focus 已於 2026-09-05 剷除，resolver 唔應該搵到')
  assert.equal(resolves('/this-route-does-not-exist'), false)
})

test('sitemap 列出嘅每一條靜態路由都有 page.tsx', () => {
  const paths = sitemapPaths()
  assert.ok(paths.length >= 10, `只抽到 ${paths.length} 條，解析方式可能已經同 sitemap.ts 對唔上`)
  const dead = paths.filter((p) => !resolves(p))
  assert.deepEqual(dead, [], `sitemap 向搜尋引擎報告緊唔存在嘅頁：${dead.join('、')}`)
})
