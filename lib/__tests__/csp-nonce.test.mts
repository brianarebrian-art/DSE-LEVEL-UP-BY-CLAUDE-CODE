// Per-request CSP nonce (audit #7, founders' reply A7-4 B, 2026-10-04).
// script-src must not allow 'unsafe-inline' in production; every page must render per
// request (a prebuilt page has no nonce, so the browser would block all of its scripts).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const { buildCsp, createNonce } = await import('../csp.ts')
const read = (p: string) => readFileSync(p, 'utf8')

const directive = (csp: string, name: string) => csp.split('; ').find((d) => d.startsWith(name + ' ')) ?? ''

test('production policy: scripts need the nonce, no unsafe-inline or unsafe-eval', () => {
  const csp = buildCsp('abc123')
  const script = directive(csp, 'script-src')
  assert.equal(script, "script-src 'self' 'nonce-abc123'")
  for (const d of ["default-src 'self'", "object-src 'none'", "frame-ancestors 'none'", "base-uri 'self'"]) assert.ok(csp.includes(d), d)
  assert.doesNotMatch(directive(csp, 'connect-src'), /ws:/)
})

test('nonces are random and at least 128 bits', () => {
  const a = createNonce(), b = createNonce()
  assert.notEqual(a, b)
  assert.ok(Buffer.from(a, 'base64').length >= 16)
  assert.match(a, /^[A-Za-z0-9+/]+=*$/)
})

test('proxy sets the policy on pages and overwrites any client-sent nonce', () => {
  const proxy = read('proxy.ts')
  assert.match(proxy, /headers\.delete\('x-nonce'\)/)
  assert.match(proxy, /headers\.set\('content-security-policy', csp\)/)
  assert.match(proxy, /response\.headers\.set\('Content-Security-Policy', csp\)/)
  assert.match(proxy, /process\.env\.NODE_ENV === 'production' \? createNonce\(\) : null/)
  // the matcher must not skip pages, only build assets and files with an extension
  assert.match(proxy, /matcher: \['\/\(\(\?!_next\/static\|_next\/image\|\.\*\\\\\.\[a-zA-Z0-9\]\+\$\)\.\*\)'\]/)
})

test('next.config no longer sends a second, static CSP', () => {
  assert.doesNotMatch(read('next.config.ts'), /key: 'Content-Security-Policy'/)
})

test('the root layout reads the nonce from the request and stamps its inline scripts', () => {
  const layout = read('app/layout.tsx')
  assert.match(layout, /export default async function RootLayout/)
  assert.match(layout, /\(await headers\(\)\)\.get\('x-nonce'\)/)
  const inline = layout.match(/<script\b[^>]*>/g) ?? []
  assert.ok(inline.length > 0)
  for (const tag of layout.split('<script').slice(1)) assert.match(tag.slice(0, 200), /nonce=\{nonce\}/, 'every <script> in the layout needs the nonce')
})

test('no route opts back into static rendering', () => {
  const offenders: string[] = []
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(tsx?|mts)$/.test(f) && /export const (dynamic = 'force-static'|revalidate = )/.test(read(p))) offenders.push(p)
    }
  }
  walk('app')
  assert.deepEqual(offenders, [])
})
