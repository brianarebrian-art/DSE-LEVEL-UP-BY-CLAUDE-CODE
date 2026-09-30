// API request bodies have a size ceiling, and /api/progress stores only allow-listed keys
// (UX loop 28, 2026-09-30; hardening prompt §30, charter §16.E).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const mod: any = await import('../api/readJson.ts')
const R = mod.default?.readJsonLimited ? mod.default : mod
const req = (body: string, headers: Record<string, string> = {}) =>
  new Request('http://x/api', { method: 'POST', body, headers })

test('reads JSON within the limit; rejects too large (by header or by actual size) and bad JSON', async () => {
  assert.deepEqual(await R.readJsonLimited(req('{"a":1}'), 100), { ok: true, value: { a: 1 } })
  const big = JSON.stringify({ a: 'x'.repeat(200) })
  assert.equal((await R.readJsonLimited(req(big), 100)).status, 413)
  assert.equal((await R.readJsonLimited(req('{}', { 'content-length': '999999' }), 100)).status, 413)
  // Multi-byte text counts in bytes, not characters.
  assert.equal((await R.readJsonLimited(req(JSON.stringify('中'.repeat(40))), 100)).status, 413)
  assert.equal((await R.readJsonLimited(req('{not json'), 100)).status, 400)
})

test('the limits leave room above the largest rows measured in production on 2026-09-30', () => {
  assert.ok(R.BODY_LIMIT.progress >= 30 * 29_617, 'progress: largest row 29.6 KB')
  assert.ok(R.BODY_LIMIT.small >= 100 * 308, 'settings: largest row 308 bytes')
})

function routes(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? routes(p) : f === 'route.ts' ? [p] : []
  })
}

test('no API route reads a request body without the ceiling', () => {
  for (const f of routes('app/api')) {
    const src = readFileSync(f, 'utf8')
    assert.doesNotMatch(src, /\b(req|request)\.(json|text|arrayBuffer|formData)\(\)/, f)
    if (/readJsonLimited\(/.test(src)) assert.match(src, /BODY_LIMIT\.(progress|small)/, f)
  }
})

test('/api/progress stores only the charter §16.E keys, from the single list', () => {
  const src = readFileSync('app/api/progress/route.ts', 'utf8')
  assert.match(src, /import \{ CLOUD_PROGRESS_KEYS \} from '@\/lib\/cloudKeys'/)
  assert.match(src, /new Set<string>\(\[\.\.\.CLOUD_PROGRESS_KEYS, 'updatedAt', 'syncedAt'\]\)/)
  assert.match(src, /progress_data: progress,/)
  assert.doesNotMatch(src, /progress_data: body\.progress/)
  const inspector = readFileSync('components/StoredDataInspector.tsx', 'utf8')
  assert.match(inspector, /export \{ CLOUD_PROGRESS_KEYS, CLOUD_SETTINGS_KEYS, CLOUD_KEYS \} from '@\/lib\/cloudKeys'/)
  assert.doesNotMatch(inspector, /export const CLOUD_PROGRESS_KEYS/, 'one list, not two')
})

test('the snapshot the browser sends has no key the server would drop', async () => {
  const sync = readFileSync('lib/sync.ts', 'utf8')
  const body = sync.slice(sync.indexOf('export function snapshotLocal'), sync.indexOf('// ── 逐課題統計嘅 CRDT'))
  const sent = [...body.matchAll(/(?:^\s*|\{ )(dse_[a-z_]+|updatedAt|syncedAt):/gm)].map((m) => m[1])
  const { CLOUD_PROGRESS_KEYS } = await import('../cloudKeys.ts')
  const allowed = new Set<string>([...CLOUD_PROGRESS_KEYS, 'updatedAt', 'syncedAt'])
  assert.ok(sent.length >= 8, `found ${sent.join(',')}`)
  for (const k of sent) assert.ok(allowed.has(k), k)
})

// Refinement loop 2 (2026-09-30; prompt §37): the check above only knows the names
// `req` and `request`. Read each handler's own parameter name so a route written as
// POST(r) cannot bypass the ceiling either.
test('no handler reads its body directly, whatever the parameter is called', () => {
  const bypass: string[] = []
  for (const f of routes('app/api')) {
    const src = readFileSync(f, 'utf8')
    for (const m of src.matchAll(/export\s+async\s+function\s+(?:POST|PUT|PATCH|DELETE)\s*\(\s*(\w+)/g)) {
      const name = m[1]
      if (new RegExp(`\\b${name}\\.(json|text|arrayBuffer|formData|blob)\\(\\)`).test(src)) bypass.push(`${f} (${name})`)
      if (new RegExp(`\\b${name}\\.body\\b`).test(src)) bypass.push(`${f} (${name}.body)`)
    }
  }
  assert.deepEqual(bypass, [])
})
