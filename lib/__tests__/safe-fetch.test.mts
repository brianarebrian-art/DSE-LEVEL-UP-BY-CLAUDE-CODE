import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { BROTLI_ACCEPT_ENCODING, withBrotliDowngrade } = require('../api/safeFetch.ts') as typeof import('../api/safeFetch')

test('fixed external fetches do not advertise Brotli while preserving other request options', () => {
  const init = withBrotliDowngrade('https://data.weather.gov.hk/weatherAPI/opendata/weather.php', {
    method: 'GET',
    headers: { accept: 'application/json', 'accept-encoding': 'gzip, br' },
  })
  const headers = new Headers(init.headers)
  assert.equal(headers.get('accept-encoding'), BROTLI_ACCEPT_ENCODING)
  assert.equal(headers.get('accept'), 'application/json')
  assert.equal(init.method, 'GET')
})

test('non-Brotli encodings and loopback URLs are not rewritten', () => {
  const explicit = { headers: { 'accept-encoding': 'gzip, deflate' } }
  assert.equal(new Headers(withBrotliDowngrade('https://data.weather.gov.hk/api', explicit).headers).get('accept-encoding'), 'gzip, deflate')
  const local = { headers: { accept: 'application/json' } }
  assert.equal(withBrotliDowngrade('http://127.0.0.1:54321/rest/v1', local), local)
})

test('the helper is wired only into the fixed exam-day upstream and redirects fail closed', () => {
  const fs = require('node:fs') as typeof import('node:fs')
  const source = fs.readFileSync('lib/examDay/upstream.ts', 'utf8')
  assert.match(source, /safeFetch\(url/)
  assert.match(source, /redirect:\s*'error'/)
  assert.doesNotMatch(source, /safeFetch\(endpoint/)
})
