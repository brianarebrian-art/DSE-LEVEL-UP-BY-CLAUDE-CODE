import { test } from 'node:test'
import assert from 'node:assert/strict'
const loaded: any = await import('../api/readJson.ts')
const readJsonLimited = loaded.default?.readJsonLimited ?? loaded.readJsonLimited

const encoder = new TextEncoder()
function request(chunks: Uint8Array[], headers: Record<string, string> = {}) {
  return new Request('http://example.test/api', {
    method: 'POST',
    headers,
    body: new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(chunk)
        controller.close()
      },
    }),
    duplex: 'half',
  } as RequestInit & { duplex: 'half' })
}
const bytes = (s: string) => encoder.encode(s)

test('accepts exact byte limit and handles several chunks', async () => {
  const parts = ['{"a":', '1', '}'].map(bytes)
  assert.deepEqual(await readJsonLimited(request(parts), 7), { ok: true, value: { a: 1 } })
})

test('rejects limit plus one based on actual bytes and cancels immediately', async () => {
  let cancelled = false
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes('{"a":'))
      controller.enqueue(bytes('1} '))
    },
    cancel() { cancelled = true },
  })
  const req = new Request('http://example.test/api', { method: 'POST', body, duplex: 'half' } as RequestInit & { duplex: 'half' })
  assert.deepEqual(await readJsonLimited(req, 7), { ok: false, status: 413, error: 'body too large' })
  assert.equal(cancelled, true)
})

test('ignores absent, malformed, and underreported Content-Length for actual-size checking', async () => {
  assert.equal((await readJsonLimited(request([bytes('{}')]), 2)).ok, true)
  assert.equal((await readJsonLimited(request([bytes('{} ')], { 'content-length': 'nope' }), 2)).status, 413)
  assert.equal((await readJsonLimited(request([bytes('{} ')], { 'content-length': '2' }), 2)).status, 413)
  assert.equal((await readJsonLimited(request([bytes('{}')], { 'content-length': '+999' }), 2)).ok, true)
})

test('strictly valid oversized Content-Length rejects before body consumption', async () => {
  let opened = false
  const body = { getReader() { opened = true; throw new Error('must not read') } }
  const req = { headers: new Headers({ 'content-length': '3' }), body } as unknown as Request
  assert.equal((await readJsonLimited(req, 2)).status, 413)
  assert.equal(opened, false)
})

test('decodes a multibyte UTF-8 character split across chunks', async () => {
  const encoded = bytes('{"text":"中"}')
  const split = encoded.findIndex((b, i) => i > 0 && b >= 0x80)
  const start = split - 1
  assert.deepEqual(await readJsonLimited(request([encoded.slice(0, start + 1), encoded.slice(start + 1)]), encoded.length), {
    ok: true, value: { text: '中' },
  })
})

test('returns 400 for empty, invalid JSON, and invalid UTF-8', async () => {
  assert.equal((await readJsonLimited(request([]), 10)).status, 400)
  assert.deepEqual(await readJsonLimited(request([bytes('{bad}')]), 10), { ok: false, status: 400, error: 'invalid JSON body' })
  assert.equal((await readJsonLimited(request([new Uint8Array([0xc3, 0x28])]), 10)).status, 400)
})

test('returns 400 when reading errors or aborts', async () => {
  const errorBody = new ReadableStream<Uint8Array>({
    start(controller) { controller.enqueue(bytes('{')); controller.error(new Error('read failed')) },
  })
  const errorReq = new Request('http://example.test/api', { method: 'POST', body: errorBody, duplex: 'half' } as RequestInit & { duplex: 'half' })
  assert.equal((await readJsonLimited(errorReq, 20)).status, 400)

  const abortBody = new ReadableStream<Uint8Array>({
    start(controller) { controller.error(new DOMException('aborted', 'AbortError')) },
  })
  const abortReq = new Request('http://example.test/api', { method: 'POST', body: abortBody, duplex: 'half' } as RequestInit & { duplex: 'half' })
  assert.equal((await readJsonLimited(abortReq, 20)).status, 400)
})
