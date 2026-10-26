import { test } from 'node:test'
import assert from 'node:assert/strict'
const loaded: any = await import('../auth/backendSelection.ts')
const resolveAuthBackend = loaded.default?.resolveAuthBackend ?? loaded.resolveAuthBackend

test('both unset retain the current Auth.js source', () => {
  assert.deepEqual(resolveAuthBackend(undefined, undefined), { backend: 'authjs', error: null })
})

test('Better Auth is selected only when private and public flags agree', () => {
  assert.deepEqual(resolveAuthBackend('better-auth', 'better-auth'), { backend: 'better-auth', error: null })
  assert.deepEqual(resolveAuthBackend('authjs', 'next-auth'), { backend: 'authjs', error: null })
})

test('a client/server backend mismatch or invalid flag fails closed', () => {
  assert.deepEqual(resolveAuthBackend(undefined, 'better-auth'), { backend: null, error: 'mismatch' })
  assert.deepEqual(resolveAuthBackend('better-auth', undefined), { backend: null, error: 'mismatch' })
  assert.deepEqual(resolveAuthBackend('supabase', 'supabase'), { backend: null, error: 'invalid' })
})
