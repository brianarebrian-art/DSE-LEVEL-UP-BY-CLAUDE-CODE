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

// ── 類級閘：任何自家網域字面值都唔准出現喺 lib/site.ts 以外 ────────────────
//
// 2026-09-20 加。上面四條測試守住嘅係【搵到 bug 嗰幾個檔】——
// app/layout.tsx、app/sitemap.ts、robots.txt、紙筆深連結。
// 但同一類 bug 喺另一個檔靜靜哋活咗好耐：`lib/dictionary.ts` 嘅 `shareTextD`
// 寫死咗 `dselevelup.hk`，而 layout.tsx 同 sitemap.ts 兩處註釋都寫住
// 「dselevelup.hk 尚未購入」（Brian 2026-07-29 拍板）。
// 即係每一次學生撳「分享成績」，都係叫同學去一個本項目擁有唔到嘅網域 ——
// 任何人註冊咗就接收得到呢批流量。呢個唔止係漂移，係一個對外嘅信譽同安全缺口。
//
// 所以個閘要守【類】，唔係守嗰個檔：掃全部出貨源碼，唔准有自家網域字面值。
//
// ⚠️ 必須剝註釋先掃 —— 上述兩處註釋【要】留低（佢哋記錄緊個裁決本身）。
// 剝註釋嗰陣唔可以見到 `//` 就斬，因為 `https://` 自己就有 `//`。

import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

/** 自家品牌網域（唔包第三方，例如 ig.me／hkeaa／supabase）。 */
const OWN_DOMAIN = /dselevelup\.[a-z]{2,}|dse-level-up[\w-]*\.(?:vercel\.app|hk|com|net|org)/gi

/** 剝走註釋，但保住 `https://` 入面嗰對斜線。 */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

// 已知、刻意留低嘅例外 —— 逐個寫明理由。寫喺度係為咗【睇得見】，
// 唔係為咗收埋：一個冇名冇姓嘅豁免，同冇個閘冇分別。
const OWN_DOMAIN_EXEMPT: Record<string, string> = {
  // 只係用嚟解析相對路徑嘅 base，值本身永遠唔會顯示畀學生。
  // 一行嘅修正（改 import SITE_ORIGIN），但唔屬於今次改動範圍。
  'components/ExternalLinkGate.tsx': '相對網址解析用嘅 URL base，唔會外露',
}

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '__tests__' || name.startsWith('.')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) sourceFiles(full, out)
    else if (/\.(ts|tsx|mts)$/.test(name)) out.push(full)
  }
  return out
}

test('自家網域唔准寫死喺 lib/site.ts 以外（掃全部出貨源碼）', () => {
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const offenders: string[] = []

  for (const dir of ['app', 'components', 'lib', 'data']) {
    for (const file of sourceFiles(join(root, dir))) {
      const rel = relative(root, file)
      if (rel === 'lib/site.ts' || rel in OWN_DOMAIN_EXEMPT) continue
      const hits = stripComments(readFileSync(file, 'utf8')).match(OWN_DOMAIN)
      if (hits) offenders.push(`${rel} → ${[...new Set(hits)].join('、')}`)
    }
  }

  assert.deepEqual(
    offenders,
    [],
    '網域字面值只可以住喺 lib/site.ts。由 @/lib/site 匯入 SITE_ORIGIN 代替：\n' + offenders.join('\n'),
  )
})

test('閘本身捉得到（負向自測）', () => {
  // 冇呢條，上面條測試就算永遠掃唔到嘢都會綠 —— 一個綠住嘅壞閘比冇閘更差。
  const bad = `const t = '一齊練 DSE：dselevelup.hk'`
  assert.ok(stripComments(bad).match(OWN_DOMAIN), '偵測器應該捉到文案入面嘅自家網域')

  // 註釋入面嘅提及要放行（layout.tsx／sitemap.ts 靠呢個行為留住裁決紀錄）。
  const okComment = `// dselevelup.hk 尚未購入\nconst x = 1`
  assert.equal(stripComments(okComment).match(OWN_DOMAIN), null, '註釋入面嘅提及唔應該當違規')

  // `https://` 嘅雙斜線唔可以被當成註釋起點而斬掉半行。
  const proto = `const u = 'https://dselevelup.hk/a'`
  assert.ok(stripComments(proto).match(OWN_DOMAIN), '剝註釋唔可以食咗 https:// 之後嘅內容')
})
