// ============================================================================
// article-jsonld.test.mts —— Article 結構化資料嘅日期同範圍
// ----------------------------------------------------------------------------
// datePublished／dateModified 係對搜尋器同讀者嘅公開聲稱。守三件事：
//   ① 日期格式啱、次序啱（發布 ≤ 更新 ≤ 今日）
//   ② 唔係「一個預設日期填晒」—— 一份規格書提議全部預設 2026-09-15，
//      將 6 月已存在嘅頁寫成 9 月發布係虛構日期（憲章 §8）
//   ③ 只標真正嘅文章頁；練習／科目頁唔係文章，標 Article 係誤導性結構化資料
// ⚠️ 冇對 git log —— CI 係淺 clone（actions/checkout 預設 fetch-depth 1），攞唔到歷史。
//    日期來源嘅真確性靠 lib/articleDates.ts 檔頭寫明嘅生成方法 ＋ commit 紀錄。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), 'utf8')
const { ARTICLE_DATES } = (await import('../articleDates.ts')) as {
  ARTICLE_DATES: Record<string, { published: string; modified: string }>
}
const ISO = /^\d{4}-\d{2}-\d{2}$/
const today = new Date().toISOString().slice(0, 10)

test('① 日期格式同次序：發布 ≤ 更新 ≤ 今日', () => {
  for (const [r, d] of Object.entries(ARTICLE_DATES)) {
    assert.match(d.published, ISO, `${r} published 格式錯`)
    assert.match(d.modified, ISO, `${r} modified 格式錯`)
    assert.ok(!Number.isNaN(Date.parse(d.published)), `${r} published 唔係有效日期`)
    assert.ok(d.published <= d.modified, `${r} 更新日期早過發布日期`)
    assert.ok(d.modified <= today, `${r} 更新日期喺未來`)
  }
})

test('② 唔係一個預設日期填晒', () => {
  const pubs = new Set(Object.values(ARTICLE_DATES).map((d) => d.published))
  assert.ok(pubs.size > 1, '全部頁面同一日發布 —— 似係預設值，唔係真實日期')
})

test('③ 只標文章頁 —— 練習／科目頁唔可以標 Article', () => {
  for (const r of Object.keys(ARTICLE_DATES)) {
    assert.ok(!/^\/(subjects|practice|dashboard|result|account)/.test(r), `${r} 唔係文章，唔可以標 Article`)
  }
})

test('④ 用咗 ArticleJsonLd 嘅頁一定有登記日期（冇登記會靜靜哋乜都唔出）', () => {
  for (const d of readdirSync(join(ROOT, 'app'))) {
    const p = join(ROOT, 'app', d, 'page.tsx')
    if (!existsSync(p)) continue
    const m = readFileSync(p, 'utf8').match(/<ArticleJsonLd route="([^"]+)"/)
    if (m) assert.ok(ARTICLE_DATES[m[1]], `${m[1]} 用咗 ArticleJsonLd 但冇喺 lib/articleDates.ts 登記`)
  }
})

test('⑤ 日期要可見，而且 headline／description 取自頁面 metadata（唔另抄一份）', () => {
  const c = read('components', 'Seo', 'ArticleJsonLd.tsx')
  assert.equal([...c.matchAll(/<time dateTime=/g)].length, 2, '頁底冇齊兩個 <time>（發布＋更新）')
  assert.match(c, /meta\.title/, 'headline 唔係由 metadata 取')
  assert.match(c, /meta\.description/, 'description 唔係由 metadata 取')
})
