import test from 'node:test'
import assert from 'node:assert/strict'
// ⚠️ 唔可以寫 `import { cachedJson } from '../examDay/upstream.ts'`。
// package.json 冇 `"type": "module"`，所以 tsx 會把 `.ts` 編成 CJS，
// 而 `.mts` 測試睇返轉頭只會見到一個 `default` —— 具名 import 會直接
// SyntaxError。本檔係全 repo 第一個由 `.ts` import runtime 值嘅測試，
// 所以呢個坑之前冇人踩過。用 default interop 就攞得返成個 namespace。
import * as ns from '../examDay/upstream.ts'
// 執行期攞 default（CJS 包住嗰個），型別上攞 namespace —— 兩邊都啱。
const upstream = (ns as unknown as { default?: typeof ns }).default ?? ns
const { cachedJson, __resetCache, TTL } = upstream

// 報告 v4.0 §6.4 要求：「為 429、5xx、空 platform_list 寫 fixture，
// 確保上游變更時即時發現」。呢度用假 fetch 造出嗰三種情況。
//
// 呢批測試守嘅係【熔斷】—— 考試朝早六點半，上游死咗要照出最後一次成功
// 嘅資料同時間戳，唔可以出白畫面。呢個行為冇測試網就會靜靜雞失效
// （例如將來有人把 cachedJson 改成 next.revalidate）。

const realFetch = globalThis.fetch

function stubFetch(seq: Array<{ status: number; body?: unknown } | 'throw'>) {
  let i = 0
  globalThis.fetch = (async () => {
    const step = seq[Math.min(i++, seq.length - 1)]
    if (step === 'throw') throw new Error('network down')
    if (step.status >= 400) return new Response('', { status: step.status })
    return new Response(JSON.stringify(step.body ?? {}), {
      status: 200, headers: { 'content-type': 'application/json' },
    })
  }) as typeof fetch
}
const restore = () => { globalThis.fetch = realFetch; __resetCache() }

test('上游 429 → 出返最後一次成功嘅快取，並標記 stale', async () => {
  __resetCache()
  stubFetch([{ status: 200, body: { v: 'good' } }, { status: 429 }])
  const first = await cachedJson<{ v: string }>('t429', 'https://x.test/a', 0)
  assert.equal(first.data.v, 'good')
  assert.equal(first.stale, false)

  const second = await cachedJson<{ v: string }>('t429', 'https://x.test/a', 0)
  assert.equal(second.data.v, 'good', '429 之後應該照出舊值')
  assert.equal(second.stale, true, '出舊值時必須標記 stale')
  assert.equal(second.fetchedAt, first.fetchedAt, '時間戳要係舊值嗰次，唔係而家')
  restore()
})

test('上游 5xx → 同樣熔斷，唔可以掉錯上去', async () => {
  __resetCache()
  stubFetch([{ status: 200, body: { v: 1 } }, { status: 503 }])
  await cachedJson('t5xx', 'https://x.test/b', 0)
  const r = await cachedJson<{ v: number }>('t5xx', 'https://x.test/b', 0)
  assert.equal(r.data.v, 1)
  assert.equal(r.stale, true)
  restore()
})

test('第一次就失敗（冇舊值可出）→ 要掉錯，唔可以扮成功', async () => {
  __resetCache()
  stubFetch([{ status: 500 }])
  await assert.rejects(() => cachedJson('tcold', 'https://x.test/c', 0))
  restore()
})

test('空 platform_list 唔算失敗 —— 輕鐵冇車一樣係有效答案', async () => {
  __resetCache()
  stubFetch([{ status: 200, body: { status: 1, platform_list: [] } }])
  const r = await cachedJson<{ platform_list: unknown[] }>('tlrt', 'https://x.test/d', 0)
  assert.equal(r.stale, false)
  assert.deepEqual(r.data.platform_list, [])
  restore()
})

test('TTL 之內唔會再打上游', async () => {
  __resetCache()
  let calls = 0
  globalThis.fetch = (async () => {
    calls++
    return new Response(JSON.stringify({ n: calls }), { status: 200 })
  }) as typeof fetch
  await cachedJson('tttl', 'https://x.test/e', 60_000)
  await cachedJson('tttl', 'https://x.test/e', 60_000)
  await cachedJson('tttl', 'https://x.test/e', 60_000)
  assert.equal(calls, 1, 'TTL 內應該只打一次上游')
  restore()
})

test('網絡直接掉錯（唔係 HTTP 狀態碼）一樣要熔斷', async () => {
  __resetCache()
  stubFetch([{ status: 200, body: { ok: true } }, 'throw'])
  await cachedJson('tnet', 'https://x.test/f', 0)
  const r = await cachedJson<{ ok: boolean }>('tnet', 'https://x.test/f', 0)
  assert.equal(r.stale, true)
  restore()
})

test('TTL 數值跟足規格 §6.2（天氣 5–10 分鐘、列車 15–30 秒）', () => {
  assert.ok(TTL.weather >= 5 * 60_000 && TTL.weather <= 10 * 60_000, `天氣 TTL ${TTL.weather}`)
  assert.ok(TTL.train >= 15_000 && TTL.train <= 30_000, `列車 TTL ${TTL.train}`)
})
