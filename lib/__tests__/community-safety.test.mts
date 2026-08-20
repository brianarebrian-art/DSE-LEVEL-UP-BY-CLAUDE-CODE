import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// /community-safety 嘅「唔可以講大話」測試。
//
// ⚠️ 讀原始碼而唔係 import —— 原因見 privacy-page.test.mts 同一段註解
// （npm test 釘死 tsx@4.19.2，做唔到 .ts/.tsx 具名 ESM import）。
//
// 呢版對學生講咗三句好硬嘅話。三句都係「今日啱、將來好易變假」嗰種：
//   ①「冇任何私訊功能」
//   ②「由待審變公開冇任何自動途徑」
//   ③「唔會自動偵測情緒危機、唔會標記、唔會儲存、唔會通知任何人」
// 第三句仲係憲章紅線（見 memory sen-selfharm-detection-redline）。

const PAGE = 'app/community-safety/CommunitySafetyClient.tsx'
const SHELL = 'app/community-safety/page.tsx'
const SAFETY = 'lib/wall/safety.ts'
const MODERATE = 'app/api/wall/moderate/route.ts'
const WALL_API = 'app/api/wall/route.ts'

const stripComments = (s: string) =>
  s
    .split('\n')
    .map((line) => line.replace(/(^|[^:])\/\/.*$/, '$1'))
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(e.name)) out.push(p)
  }
  return out
}

test('聲稱①「冇任何私訊功能」—— 冇任何用戶對用戶訊息路由', () => {
  const routes = walk('app/api').filter((f) => f.endsWith('route.ts'))
  const messaging = routes.filter((f) => /\b(messages?|dm|chat|inbox|conversation)\b/i.test(f))
  assert.deepEqual(
    messaging,
    [],
    `出現咗訊息類 API，但 /community-safety 寫住「冇任何私訊功能」：\n  ${messaging.join('\n  ')}`,
  )
})

test('聲稱②「由待審變公開冇任何自動途徑」—— 只有 admin 路由設得到 approved', () => {
  const setters: string[] = []
  for (const f of walk('app').concat(walk('lib'))) {
    const src = stripComments(fs.readFileSync(f, 'utf8'))
    if (/status:\s*['"]approved['"]/.test(src)) setters.push(f)
  }
  // 現時零命中係【正常而且更好】—— 審核路由用 `status: decision`，而 decision 先要
  // 通過 DECISIONS 白名單。所以呢度唔可以斷言「一定等於 [MODERATE]」（我第一版就係
  // 咁寫，結果紅咗），要斷言嘅係「除咗審核路由，冇第二處寫得到 approved」。
  const outsiders = setters.filter((f) => f !== MODERATE)
  assert.deepEqual(
    outsiders,
    [],
    `只有 ${MODERATE}（有 requireAdmin 白名單）先可以令帖變 approved。而家：\n  ${outsiders.join('\n  ')}`,
  )
  // 該路由必須真係擋住非 admin，而且 decision 要受白名單約束。
  const mod = fs.readFileSync(MODERATE, 'utf8')
  assert.match(mod, /requireAdmin\(\)/, '審核路由必須 requireAdmin')
  assert.match(mod, /DECISIONS.*includes\(decision\)/, 'decision 必須受白名單約束，唔可以照收 client 傳咩就寫咩')

  // 新帖一律 pending —— 唔可以有人改成「短過 N 字就直接出」之類。
  const api = stripComments(fs.readFileSync(WALL_API, 'utf8'))
  assert.match(api, /status:\s*'pending'/, '新帖必須一律 pending')
  assert.doesNotMatch(api, /status:\s*['"]approved['"]/, '發帖路由唔可以設 approved')
})

test('聲稱③ 危機字眼掃描唔會標記／儲存／通知任何人', () => {
  const src = stripComments(fs.readFileSync(SAFETY, 'utf8'))
  // 呢個模組應該純函數：入字串，出 boolean。任何 DB／網絡／通知都係紅線。
  for (const forbidden of ['supabase', 'fetch(', 'insert', 'upsert', 'update(', 'notify', 'sendMail']) {
    assert.ok(
      !src.includes(forbidden),
      `lib/wall/safety.ts 出現「${forbidden}」—— 呢個模組只准判斷「要唔要向發帖者本人顯示熱線卡」。` +
        '自動自殘偵測 + 危機自動介入 + 存精神健康 PII 係永久紅線。',
    )
  }
  // 呼叫端：唔可以因為掃到危機詞而改變帖嘅去向。
  const api = stripComments(fs.readFileSync(WALL_API, 'utf8'))
  assert.doesNotMatch(
    api,
    /shouldSurfaceHotline\([^)]*\)\s*(?:\?|&&|\|\|)/,
    'shouldSurfaceHotline 嘅結果被攞去做分支 —— 佢只准原樣回畀 client 顯示熱線卡，唔准影響帖去向',
  )
})

test('每則已公開留言都有舉報途徑，而且真係去到人手上', () => {
  const wall = fs.readFileSync('app/wall/WallClient.tsx', 'utf8')
  assert.match(wall, /reportMailto/, '帖上面欠舉報途徑')
  assert.match(wall, /mailto:dselevelup@gmail\.com/, '舉報必須去到真實可達嘅收件地址')
  assert.match(wall, /postId/, '舉報信必須帶帖編號，否則我哋搵唔返係邊條')
})

test('頁面唔可以承諾一個守唔到嘅回應時間', () => {
  const src = fs.readFileSync(PAGE, 'utf8')
  // 兩個創辦人、業餘營運。24／48／72 小時 SLA 係守唔到嘅。
  //
  // ⚠️ 唔可以淨係 grep 個詞組 —— 呢版【本身就講緊】「冇 24 小時回應承諾」，
  // 而嗰句正正係我哋要保留嘅嘢。所以要睇上文有冇否定詞（我第一版漏咗，紅咗）。
  const SLA = /(24|48|72)\s*小時(內)?(回應|處理)|within\s+(24|48|72)\s*hours/g
  const promises: string[] = []
  for (const m of src.matchAll(SLA)) {
    const lead = src.slice(Math.max(0, m.index! - 12), m.index!)
    if (!/[冇唔無不]|\bno\b|\bnot\b|never/i.test(lead)) promises.push(m[0])
  }
  assert.deepEqual(
    promises,
    [],
    `出現咗【正面】回應時間承諾：${promises.join('、')}。` +
      '憲章寫明創辦人係業餘模式、每週一次異步同步 —— 呢種 SLA 守唔到。',
  )
})

test('必須由頁尾去到，喺 sitemap，並有獨立 metadata', () => {
  assert.match(fs.readFileSync('components/Footer.tsx', 'utf8'), /href="\/community-safety"/, '頁尾冇連結')
  assert.match(fs.readFileSync('app/sitemap.ts', 'utf8'), /'\/community-safety'/, 'sitemap 冇呢版')
  const shell = fs.readFileSync(SHELL, 'utf8')
  assert.match(shell, /export const metadata/, '欠獨立 metadata')
  assert.match(shell, /title:\s*'社群安全守則/, 'title 必須具體')
})
