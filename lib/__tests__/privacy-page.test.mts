import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// /privacy 嘅「唔可以講大話」測試。
//
// ══ 點解需要 ══
// 一版私隱政策唔會壞喺寫嗰日，佢壞喺【第 90 日】—— 有人加咗一個 key 落同步清單、
// 有人裝咗個分析 SDK、有人加咗張表儲 email。改嗰個人唔會諗起要開 /privacy 睇一睇，
// 因為嗰版嘢喺完全另一個角落。
//
// 所以呢度唔測「頁面 render 到」（嗰個 build 已經測咗），淨係測【頁面聲稱嘅嘢仲係咪真】。

// ⚠️ 呢度【故意唔 import】專案模組，改為讀原始碼解析。
// `npm test` 釘死 tsx@4.19.2，而喺呢個 repo（非 "type":"module"）佢做唔到 .ts/.tsx
// 嘅具名 ESM import —— 會拋 'does not provide an export named …'。全部現有測試都係
// 讀檔，唔係巧合。下次唔好「順手改返 import」，會喺 CI 紅而本機綠。
const INSPECTOR = 'components/StoredDataInspector.tsx'

/** 由原始碼抽出一個 `export const NAME = [ … ] as const` 陣列嘅字串成員。 */
function constArray(file: string, name: string): string[] {
  const src = fs.readFileSync(file, 'utf8')
  const m = new RegExp(`export const ${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`).exec(src)
  assert.ok(m, `${file} 搵唔到 ${name}`)
  return [...m![1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

const PAGE = 'app/privacy/PrivacyClient.tsx'
const SHELL = 'app/privacy/page.tsx'
const SCAN_DIRS = ['app', 'components', 'lib']

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(e.name)) out.push(p)
  }
  return out
}
const sources = SCAN_DIRS.flatMap((d) => walk(d))

/**
 * 剝註解 —— 同 contrast-guard／claims-guard 一致嘅次序（先行註解、後區塊註解）。
 * 檔頭寫住「我哋掃過 PostHog／Mixpanel」係好事，唔可以當成裝咗佢哋。
 */
const stripComments = (s: string) =>
  s
    .split('\n')
    .map((line) => line.replace(/(^|[^:])\/\/.*$/, '$1'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')

/**
 * /privacy 自己兩個檔要排除：佢哋喺【用戶可見文案】入面逐個點名列出我哋掃咗邊啲
 * 追蹤器（「我哋掃過 Google Analytics、PostHog⋯一個都冇」）。剝註解幫唔到，
 * 因為嗰句係 JSX 文字節點。
 */
const PRIVACY_OWN_FILES = new Set([PAGE, SHELL])

test('同步項目數量由代碼算出，唔係硬編喺文案', () => {
  const src = fs.readFileSync(PAGE, 'utf8')
  assert.match(
    src,
    /CLOUD_PROGRESS_KEYS\.length \+ CLOUD_SETTINGS_KEYS\.length/,
    '數量必須由 StoredDataInspector 嘅常數算 —— 硬編一個數，同步清單改嗰日呢版就講錯咗',
  )
  assert.doesNotMatch(src, /【?\d{2} 項】?/, '文案唔可以出現硬編嘅項目數')
})

test('頁面聲稱「心情記錄唔會上傳」—— 佢真係唔喺上雲清單', () => {
  // 呢句係全版最敏感嘅承諾。如果有日有人為咗「跨機睇返心情」而加咗佢落同步清單，
  // 呢條測試就係最後一道防線。
  const cloudKeys = [
    ...constArray(INSPECTOR, 'CLOUD_PROGRESS_KEYS'),
    ...constArray(INSPECTOR, 'CLOUD_SETTINGS_KEYS'),
  ]
  assert.ok(
    !cloudKeys.includes('dse_emotion_log'),
    'dse_emotion_log 入咗上雲清單 —— /privacy 明文寫住佢唔會上傳。' +
      '心理健康紀錄唔應該離開學生部機（見憲章 §7）。',
  )
  for (const k of ['dse_reverse_log', 'dse_bookmarks', 'dse_writing_draft', 'dse_result']) {
    assert.ok(!cloudKeys.includes(k), `/privacy 寫住 ${k} 唔上傳，但佢已經喺上雲清單`)
  }
})

test('頁面聲稱「冇任何分析／追蹤 SDK」—— 掃全站確認', () => {
  const TRACKERS =
    /\bgtag\b|google-analytics|googletagmanager|posthog|mixpanel|@sentry|hotjar|\bfbq\b|plausible|umami|@vercel\/analytics|speed-insights/i
  const hits = sources.filter(
    (f) => !PRIVACY_OWN_FILES.has(f) && TRACKERS.test(stripComments(fs.readFileSync(f, 'utf8'))),
  )
  assert.deepEqual(hits, [], `裝咗追蹤／分析 SDK，但 /privacy 寫住「一個都冇」：\n  ${hits.join('\n  ')}`)
  const pkg = fs.readFileSync('package.json', 'utf8')
  assert.doesNotMatch(pkg, TRACKERS, 'package.json 出現追蹤／分析套件，但 /privacy 寫住「一個都冇」')
})

test('頁面聲稱「唔會將學生 email 寫入資料庫」—— 掃寫入路徑確認', () => {
  // 只容許內部審題人／版主嗰兩欄（唔係學生資料）。
  const ALLOWED = /reviewer_email|moderator_email/
  const bad: string[] = []
  for (const f of sources) {
    const src = fs.readFileSync(f, 'utf8')
    for (const m of src.matchAll(/\.(insert|upsert|update)\(([\s\S]{0,220}?)\)/g)) {
      const payload = m[2]
      if (/\bemail\b/.test(payload) && !ALLOWED.test(payload)) {
        bad.push(`${f} → ${payload.replace(/\s+/g, ' ').slice(0, 80)}`)
      }
    }
  }
  assert.deepEqual(bad, [], `有路徑將 email 寫入資料庫，但 /privacy 寫住冇：\n  ${bad.join('\n  ')}`)
})

test('/privacy 必須由頁尾去到，並且喺 sitemap', () => {
  assert.match(fs.readFileSync('components/Footer.tsx', 'utf8'), /href="\/privacy"/, '頁尾冇私隱政策連結')
  assert.match(fs.readFileSync('app/sitemap.ts', 'utf8'), /'\/privacy'/, 'sitemap 冇 /privacy')
})

test('頁面有獨立 metadata（唔用泛用 title）', () => {
  const shell = fs.readFileSync(SHELL, 'utf8')
  assert.match(shell, /export const metadata/, '欠獨立 metadata')
  assert.match(shell, /title:\s*'私隱政策/, 'title 必須具體')
  assert.match(shell, /description:/, '欠 description —— 家長／學校係由搜尋結果撳入嚟')
})
