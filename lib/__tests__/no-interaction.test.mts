import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

// ══════════════════════════════════════════════════════════════════════════
//  本平台【永久】唔提供任何用戶對用戶互動。
//  決定人：Yuna（COO）· 2026-08-21 · 見 docs/DECISION-no-interaction.md
// ══════════════════════════════════════════════════════════════════════════
//
// 呢條唔係一般測試，係一個【產品決定嘅執行機制】。
//
// 點解要用測試嚟守：一個「唔好加互動功能」嘅口頭共識，喺三個月後、由另一個人、
// 喺另一個 PR 度，會好自然咁被繞過 —— 唔係因為有人反對呢個決定，而係因為
// 「加個心心咋嘛」睇落唔似「加互動功能」。舊「影子溫書室」就係咁樣一步步長出嚟：
// 先係打氣牆，然後心心，然後 1對1 私訊宣傳，然後語音房。
//
// 所以呢度釘死嘅係【機制】而唔係【功能名】。任何新嘅用戶對用戶路徑，
// 就算叫另一個名，都會撞到下面其中一條。
//
// ⚠️ 讀原始碼而唔係 import —— npm test 釘死 tsx@4.19.2，做唔到 .ts/.tsx 具名 ESM import。

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

const apiRoutes = walk('app/api').filter((f) => f.endsWith('route.ts'))
const sources = ['app', 'components', 'lib'].flatMap((d) => walk(d))

test('舊「影子溫書室」已經完全清走', () => {
  for (const gone of ['app/wall', 'app/api/wall', 'lib/wall', 'app/admin/wall']) {
    assert.ok(!fs.existsSync(gone), `${gone} 仲喺度 —— 呢個功能已於 2026-08-21 決定移除`)
  }
  // 入口都要清 —— 留低一條連去 404 嘅 nav 連結，等於話畀人聽個功能只係「暫時收埋」。
  assert.doesNotMatch(fs.readFileSync('components/Navbar.tsx', 'utf8'), /\/wall/, 'Navbar 仲有 /wall 入口')
})

test('冇任何一條 API 路由係用戶對用戶嘅', () => {
  const SOCIAL = /\b(messages?|dm|chat|inbox|conversation|comments?|posts?|reply|replies|likes?|reactions?|follow|friends?|rooms?|match)\b/i
  const offenders = apiRoutes.filter((f) => SOCIAL.test(f))
  assert.deepEqual(
    offenders,
    [],
    `出現咗社群類 API 路由：\n  ${offenders.join('\n  ')}\n` +
      '見 docs/DECISION-no-interaction.md —— 本平台唔提供任何用戶對用戶互動。' +
      '如果呢條路由其實唔涉及用戶之間傳遞內容，請改一個唔誤導嘅名。',
  )
})

test('冇任何一張表由一個用戶寫、另一個用戶讀', () => {
  // 判準：一張表如果同時帶 user_id（作者）同「內容欄」，佢就係一個互動表。
  // 真相來源係 migrations 檔（宣告意圖），唔係 live DB —— 所以 `wall_posts` 由
  // 0011 drop 咗之後就唔會再出現喺呢度，即使 0011 未套用落生產。呢個係啱嘅：
  // 呢條測試守嘅係「唔准再長出新嘅互動表」，至於幾時真係 drop 係營運決定。
  const MIG = 'supabase/migrations'
  const files = fs.readdirSync(MIG).filter((f) => f.endsWith('.sql')).sort()
  const live = new Map<string, string>()
  for (const f of files) {
    const sql = fs.readFileSync(path.join(MIG, f), 'utf8')
    const createRe = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z_][a-z0-9_]*)\s*\(([\s\S]*?)\n\s*\);/gi
    let m: RegExpExecArray | null
    while ((m = createRe.exec(sql))) live.set(m[1], m[2])
    const dropRe = /drop\s+table\s+(?:if\s+exists\s+)?(?:public\.)?([a-z_][a-z0-9_]*)/gi
    while ((m = dropRe.exec(sql))) live.delete(m[1])
  }
  // ⚠️ 要比對【欄名】而唔係欄型。第一版寫 /\b(...|text|...)\b/ 掃成段 body，
  // 結果中咗 `letter_spacing TEXT` 嘅型別，誤報 user_settings。欄名一定喺行首。
  const CONTENT_COL = /^\s*(content|body|message|post|comment|note)\b/im
  const social = [...live.entries()]
    .filter(([, body]) => /^\s*user_id\b/im.test(body) && CONTENT_COL.test(body))
    .map(([name]) => name)
  assert.deepEqual(social, [], `出現咗用戶內容表：${social.join('、')} —— 見 docs/DECISION-no-interaction.md`)
})

test('冇任何在線人數／打卡人數（真實或虛構）', () => {
  // 憲章 §8 禁虛構統計；而「真實在線人數」一樣係一種用戶對用戶訊號。
  // ⚠️ 只認【計數】寫法，唔認普通散文。呢個 pattern 收緊咗兩次：
  //   第一版 /(online|active)\s*(now|users?|count)/ → 中咗 `activeCount`（科目數）
  //   第二版 /(people)\s*(online)/ → 中咗「young people online」（講網絡安全嘅句子）
  // 一個成日誤報嘅閘，最後一定會被人加豁免繞過，咁就等於冇。所以寧願窄。
  const PRESENCE =
    /onlineCount|usersOnline|onlineUsers|activeNow|currently\s+online|在線人數|同時在線|正在線上|\d+\s*人(而家|正在|喺度|在線)|\d+\s*(students?|users?)\s*(online|here|studying)/i
  const hits = sources.filter((f) => PRESENCE.test(stripComments(fs.readFileSync(f, 'utf8'))))
  assert.deepEqual(hits, [], `出現咗在線人數：\n  ${hits.join('\n  ')}`)
})

// 2026-09-05：原本呢度有一條測試守住 /focus 嘅房號純前端。
// /focus（自律番茄鐘 ＋ 自律房間）已整頁剷除，所以測試連同守護對象一齊移除 ——
// 一條指住唔存在檔案嘅測試唔係「多一重保障」，佢一定 fail，而 fail 咗之後
// 通常會被人順手刪走，連帶隔籬幾條真正有用嘅都會冇人再睇。
// 下面「時間囊零 server」嗰幾條係同一條界線嘅其餘部分，全部維持有效。

test('時間囊內容永遠唔上雲', () => {
  // 學生寫畀自己嘅字，同 dse_emotion_log 同一級：唔可以離開部機。
  const inspector = fs.readFileSync('components/StoredDataInspector.tsx', 'utf8')
  const cloud = /export const CLOUD_(PROGRESS|SETTINGS)_KEYS\s*=\s*\[([\s\S]*?)\]/g
  const keys: string[] = []
  for (const m of inspector.matchAll(cloud)) keys.push(...[...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]))
  for (const k of ['dse_capsule', 'dse_emotion_log']) {
    assert.ok(!keys.includes(k), `${k} 入咗上雲清單 —— 呢啲係學生寫畀自己嘅字，唔應該離開部機`)
  }
})

test('時間囊本身零 server、零互動', () => {
  const files = ['lib/capsule/store.ts', 'app/capsule/CapsuleClient.tsx', 'app/capsule/page.tsx']
  for (const f of files) {
    const src = stripComments(fs.readFileSync(f, 'utf8'))
    for (const forbidden of ['fetch(', 'supabase', '/api/', 'useAuthSession']) {
      assert.ok(!src.includes(forbidden), `${f} 出現「${forbidden}」—— 時間囊必須純本機`)
    }
  }
})

test('封存中嘅囊唔顯示倒數（憲章 §7：倒數＝壓力）', () => {
  const src = fs.readFileSync('app/capsule/CapsuleClient.tsx', 'utf8')
  assert.doesNotMatch(src, /仲有\s*\{|days?\s*(left|remaining)|daysLeft/i, '封存中嘅囊唔可以顯示剩餘日數')
})

test('決定文件必須存在 —— 測試講「唔准」，文件講「點解」', () => {
  const doc = 'docs/DECISION-no-interaction.md'
  assert.ok(fs.existsSync(doc), `${doc} 唔見咗 —— 一條冇解釋嘅禁令，遲早會被當成過時規矩繞過`)
  const src = fs.readFileSync(doc, 'utf8')
  assert.ok(src.length > 800, '決定文件太短 —— 要寫清楚點解、放棄咗咩、用咩接住')
})
