import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

test('getServiceSupabase module must import server-only', () => {
  const src = readFileSync(join(root, 'utils/supabase/server.ts'), 'utf8')
  assert.match(src, /import ['"]server-only['"]/)
  assert.match(src, /SUPABASE_SERVICE_ROLE_KEY/)
})

test('client auth session logout must wipe device data', () => {
  const src = readFileSync(join(root, 'lib/auth/session.tsx'), 'utf8')
  assert.match(src, /wipeThisDevice/)
  assert.match(src, /hasUnsyncedLocalProgress/)
})
