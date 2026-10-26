import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

test('Preview Better Auth uses only DSE_PREVIEW credentials and explicit preview DB target', () => {
  const src = readFileSync('lib/auth/better-auth.ts', 'utf8')
  assert.match(src, /process\.env\.VERCEL_ENV/)
  assert.match(src, /DSE_PREVIEW_DATABASE_URL/)
  assert.match(src, /DSE_PREVIEW_BETTER_AUTH_SECRET/)
  assert.match(src, /DSE_PREVIEW_GOOGLE_CLIENT_ID/)
  assert.match(src, /DSE_PREVIEW_GOOGLE_CLIENT_SECRET/)
  assert.match(src, /isAllowedSupabaseDatabaseTarget\(connectionString, target, projectRef\)/)
  assert.match(src, /const connectionString = target === 'production'[\s\S]*?target === 'preview'[\s\S]*?DSE_PREVIEW_DATABASE_URL/)
  assert.match(src, /const secret = target === 'production'[\s\S]*?target === 'preview'[\s\S]*?DSE_PREVIEW_BETTER_AUTH_SECRET/)
})

test('Auth routes are disabled outside production until dedicated OAuth/session isolation is approved', () => {
  const src = readFileSync('app/api/auth/[...nextauth]/route.ts', 'utf8')
  assert.match(src, /process\.env\.VERCEL_ENV !== 'production'/)
  assert.equal((src.match(/process\.env\.VERCEL_ENV !== 'production'/g) ?? []).length, 2)
})
