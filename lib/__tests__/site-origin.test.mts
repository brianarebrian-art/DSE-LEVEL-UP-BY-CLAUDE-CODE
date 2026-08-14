// 站點網址單一來源保證。
//
// 背景：紙筆戰士會把對答案連結【印上實體試卷】。紙一旦印出就冇得改，網址錯 =
// 學生掃出死連結。原本 app/layout.tsx 同 app/sitemap.ts 各有一份網域字面值，
// layout.tsx 個註釋仲寫住「三處必須一致」—— 即係已知風險，但只靠人手守。
//
// 現時兩個 .ts 檔已改為匯入 `lib/site.ts`，結構上唔可能漂移。剩返 public/robots.txt
// 係靜態檔，匯入唔到，所以由呢個測試核對。

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = (rel: string) => readFileSync(fileURLToPath(new URL('../../' + rel, import.meta.url)), 'utf8')
const { SITE_ORIGIN } = await import('../site.ts')

test('SITE_ORIGIN 格式正確（https、無尾斜線）', () => {
  assert.match(SITE_ORIGIN, /^https:\/\/[a-z0-9.-]+$/, '須為 https 且無路徑、無尾斜線')
  assert.ok(!SITE_ORIGIN.endsWith('/'), '尾斜線會令拼出嚟嘅網址出現雙斜線')
})

test('layout.tsx 同 sitemap.ts 已改用匯入，冇再各自寫死網域', () => {
  for (const f of ['app/layout.tsx', 'app/sitemap.ts']) {
    const src = read(f)
    assert.match(src, /from '@\/lib\/site'/, `${f} 須由 @/lib/site 匯入網域`)
    assert.ok(
      !/const\s+(SITE_URL|DOMAIN)\s*=\s*'https:/.test(src),
      `${f} 唔可以再有自己嗰份網域字面值`,
    )
  }
})

test('robots.txt 嘅 Sitemap 行同 SITE_ORIGIN 一致', () => {
  const robots = read('public/robots.txt')
  const line = robots.split('\n').find((l) => l.trim().toLowerCase().startsWith('sitemap:'))
  assert.ok(line, 'robots.txt 須有 Sitemap 行')
  const url = line!.split(/:\s*/).slice(1).join(':').trim()
  assert.equal(url, `${SITE_ORIGIN}/sitemap.xml`)
})

test('對答案深連結指向正式網域，並帶得返卷號', async () => {
  const { answerSheetUrl, decodePaperCode } = await import('../paper/paper.ts')
  const spec = { subject: 'math', topic: 'quadratic_equations', size: 20, seed: '3f2a' }
  const url = answerSheetUrl(spec)
  assert.ok(url.startsWith(`${SITE_ORIGIN}/answer-sheet?p=`), `深連結須指向正式網域，實得 ${url}`)
  // 掃描後由 ?p= 還原返同一份卷 —— 呢條係整個紙筆流程嘅接駁點
  const code = decodeURIComponent(new URL(url).searchParams.get('p') ?? '')
  assert.deepEqual(decodePaperCode(code), spec)
})
