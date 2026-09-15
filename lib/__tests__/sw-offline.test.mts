// ============================================================================
// sw-offline.test.mts —— service worker 離線層
// ----------------------------------------------------------------------------
// docs/top20-features-ledger.md #03：「SW 係雙刃劍：寫錯會令用戶永遠食住
// 舊版 app（stale SW 經典事故）」。呢個檔守嘅就係嗰把刀嘅刀口：
//
//   ① 攔咩、唔攔咩（純函數，真跑）—— 攔錯一個 /api 請求，同步喺斷網時
//      會靜靜哋食咗一個舊回應；攔咗 Supabase，題庫版本比對就會永遠「一樣」。
//   ② network-first —— 有網一定行網絡。呢條一變 cache-first，學生就會
//      食住舊版直到下次 bump 版本，而冇任何錯誤訊息。
//   ③ 回滾路徑 —— 冇 ?offline=1 嘅 SW 唔可以處理 fetch，而且要刪離線快取。
//   ④ 單一登記 URL —— 兩個地方用唔同 URL 登記同一個 scope，後嗰個蓋前嗰個。
//   ⑤ 唔存 404 / 重新導向 / opaque —— 存咗 404，斷網時就一直見 404。
//
// ⚠️ 呢度證明唔到離線真係行得通 —— 嗰個要喺運行中瀏覽器斷網實測（見 commit）。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), 'utf8')
const SW = read('public', 'sw.js')

// sw.js 一載入就叫 self.addEventListener（同 push-exam-day.test.mts 一樣嘅替身）
;(globalThis as unknown as { self: unknown }).self ??= {
  addEventListener: () => {},
  registration: { showNotification: () => {} },
  clients: { matchAll: async () => [], openWindow: async () => null },
}
const require_ = createRequire(import.meta.url)
const { shouldHandle, OFFLINE_ON } = require_('../../public/sw.js') as {
  shouldHandle: (req: unknown, origin: string) => boolean
  OFFLINE_ON: boolean
}

const O = 'https://dse-level-up-by-claude-code.vercel.app'
const req = (url: string, method = 'GET', range: string | null = null) => ({
  url,
  method,
  headers: { get: (h: string) => (h === 'range' ? range : null) },
})

test('① 只攔同源 GET 頁面同靜態資源；/api、跨域、HMR、sw.js 本身一律唔攔', () => {
  assert.equal(shouldHandle(req(`${O}/practice?subject=math`), O), true)
  assert.equal(shouldHandle(req(`${O}/_next/static/chunks/app/page-abc.js`), O), true)
  assert.equal(shouldHandle(req(`${O}/api/progress`), O), false, '/api 被攔 —— 斷網時同步會食舊回應')
  assert.equal(shouldHandle(req(`${O}/api/sync/session`, 'POST'), O), false)
  assert.equal(shouldHandle(req(`${O}/practice`, 'POST'), O), false, '非 GET 被攔')
  assert.equal(
    shouldHandle(req('https://aegekxapxgcfdrkzisis.supabase.co/rest/v1/question_bank_versions'), O),
    false,
    'Supabase 被攔 —— 題庫版本比對會永遠攞到舊版本號',
  )
  assert.equal(shouldHandle(req(`${O}/_next/webpack-hmr`), O), false)
  assert.equal(shouldHandle(req(`${O}/sw.js`), O), false, 'SW 快取咗自己 —— 回滾永遠唔會生效')
  assert.equal(shouldHandle(req(`${O}/audio.mp3`, 'GET', 'bytes=0-'), O), false, '分段請求 206 存唔落 Cache API')
  assert.equal(shouldHandle(null, O), false)
})

test('② network-first：先 fetch，失敗先至揾快取', () => {
  const i = SW.indexOf('async function networkFirst(req)')
  assert.ok(i > 0, 'networkFirst 冇咗')
  const body = SW.slice(i, SW.indexOf('\n}\n', i))
  const f = body.indexOf('await fetch(req)')
  const c = body.indexOf('caches.match(req)')
  assert.ok(f > 0 && c > f, '快取排咗喺網絡之前 —— 呢個係 cache-first，學生會食住舊版')
  assert.ok(/catch \(err\)/.test(body) && body.indexOf('caches.match') > body.indexOf('catch (err)'),
    '揾快取唔係喺網絡失敗之後')
  // 刻意冇 timeout：慢網唔等於冇網
  assert.ok(!/setTimeout|AbortSignal\.timeout|Promise\.race/.test(body),
    'networkFirst 加咗 timeout —— 長期慢網嘅學生會永遠食快取')
})

test('③ 回滾：冇 ?offline=1 就唔處理 fetch，而且 activate 刪離線快取', () => {
  assert.equal(OFFLINE_ON, false, '測試環境冇 self.location，應該當關')
  const fetchL = SW.slice(SW.indexOf("self.addEventListener('fetch'"), SW.indexOf("self.addEventListener('fetch'") + 200)
  assert.match(fetchL, /if \(!OFFLINE_ON\) return/, 'fetch handler 冇檢查開關 —— 關咗都照攔')
  assert.match(SW, /k\.startsWith\(CACHE_PREFIX\) && \(!OFFLINE_ON \|\| k !== CACHE\)/,
    'activate 冇喺關閉時刪離線快取 —— 回滾之後舊快取永遠留低')
})

test('④ 全 repo 登記 SW 一律用 SW_URL', () => {
  const offenders: string[] = []
  const walk = (dir: string) => {
    for (const e of readdirSync(join(ROOT, dir))) {
      if (e === '__tests__' || e === 'node_modules' || e.startsWith('.')) continue
      const rel = join(dir, e)
      if (statSync(join(ROOT, rel)).isDirectory()) walk(rel)
      else if (/\.(ts|tsx)$/.test(e)) {
        const s = read(rel)
        if (/serviceWorker\.register\(\s*['"`]/.test(s)) offenders.push(rel)
      }
    }
  }
  for (const d of ['app', 'components', 'lib']) walk(d)
  assert.deepEqual(offenders, [], `呢啲檔用字面 URL 登記 SW：${offenders.join(', ')} —— 會同離線層互相蓋`)
})

test('⑤ 只存正常同源回應（唔存 404、重新導向、opaque）', () => {
  const n = [...SW.matchAll(/res\.ok && res\.type === 'basic'/g)].length
  assert.ok(n >= 2, `存快取嘅位置（networkFirst ＋ warm）只有 ${n} 處有檢查 ok ＋ basic`)
})

test('⑥ sw.js 要 no-cache —— 回滾靠學生部機攞到新版', () => {
  assert.match(read('next.config.ts'), /source: '\/sw\.js', headers: \[\{ key: 'Cache-Control', value: 'no-cache' \}\]/)
})
