// A failed or cancelled sign-in lands on a page that leads back to practice
// (UX loop 14, P1-J, 2026-09-30).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const E = pick(await import('../auth/signInError.ts'))
const read = (p: string) => readFileSync(p, 'utf8')

test('Auth.js sends sign-in errors to our page', () => {
  assert.match(read('auth.ts'), /pages: \{ error: '\/sign-in-error' \}/)
})

test('known codes get their own wording; anything else gets the general message', () => {
  assert.equal(E.signInErrorKind('AccessDenied'), 'denied')
  assert.equal(E.signInErrorKind('Configuration'), 'service')
  assert.equal(E.signInErrorKind('OAuthCallback'), 'service')
  for (const other of ['Verification', 'Default', '', null, undefined, '<script>']) {
    assert.equal(E.signInErrorKind(other), 'general', String(other))
  }
  for (const k of ['denied', 'service', 'general'] as const) {
    assert.ok(E.SIGN_IN_ERROR_COPY[k].zh && E.SIGN_IN_ERROR_COPY[k].en, k)
  }
})

test('the page says practice works without signing in and links back to it', () => {
  const view = read('app/sign-in-error/SignInErrorView.tsx')
  assert.match(view, /唔使登入都用得/)
  assert.match(view, /href="\/subjects"/)
  // The raw code from the URL is only classified, never rendered.
  assert.doesNotMatch(view, /\{[^}]*get\('error'\)[^}]*\}\s*</)
  assert.match(view, /signInErrorKind\(useSearchParams\(\)\.get\('error'\)\)/)
})

test('the page is not indexed and is classified for page navigation', () => {
  assert.match(read('app/sign-in-error/page.tsx'), /robots: \{ index: false, follow: false \}/)
  assert.match(read('lib/pageOrder.ts'), /'\/sign-in-error': '/)
  assert.doesNotMatch(read('app/sitemap.ts'), /sign-in-error/)
})

test('the integration guard knows why nothing links to the page', () => {
  assert.match(read('scripts/integration-guard.mjs'), /'\/sign-in-error': '登入失敗時由 Auth\.js 重新導向入嚟/)
})
