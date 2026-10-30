// Locks for Supabase Auth Google rebuild (phase 5) + retained wipe DRAFT safety.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('design paper locks C1 memory-only + C2 map + C3 profiles rename', () => {
  const d = read('docs/auth/SUPABASE-GOOGLE-REBUILD-DESIGN.md')
  assert.match(d, /C1/)
  assert.match(d, /auth_identity_map/)
  assert.match(d, /profiles_legacy/)
  assert.match(d, /memory|唔寫長期本機/)
})

test('0030 migration is non-DRAFT filename but still blocks production without 批准發布', () => {
  const path = 'supabase/migrations/0030_supabase_google_auth_rebuild.sql'
  assert.ok(existsSync(join(ROOT, path)), 'missing 0030 migration')
  assert.ok(!existsSync(join(ROOT, 'supabase/migrations/0030_supabase_google_auth_rebuild.DRAFT.sql')))
  const sql = read(path)
  assert.match(sql, /auth_identity_map/)
  assert.match(sql, /learning_progress/)
  assert.match(sql, /批准發布/)
  assert.doesNotMatch(sql, /truncate\s+(table\s+)?(public\.)?user_progress/i)
})

test('DRAFT B3 wipe clears only user-scoped tables and never touches questions', () => {
  const path = 'supabase/migrations/0028_g_b3_user_data_wipe.DRAFT.sql'
  assert.ok(existsSync(join(ROOT, path)), 'missing 0028 DRAFT wipe')
  const sql = read(path)
  for (const t of [
    'user_sessions',
    'user_progress',
    'user_settings',
    'privacy_consents',
    'profiles',
  ]) {
    assert.match(sql, new RegExp(`TRUNCATE TABLE public\\.${t}`, 'i'), t)
  }
  assert.doesNotMatch(sql, /TRUNCATE TABLE public\.questions/i)
  assert.doesNotMatch(sql, /TRUNCATE TABLE public\.question_bank_versions/i)
  assert.doesNotMatch(sql, /TRUNCATE TABLE public\.review_decisions/i)
})

test('navbar / result sign-in CTAs go to /sign-in, not inline Google-only', () => {
  assert.match(read('components/AuthButton.tsx'), /href="\/sign-in"/)
  assert.match(read('components/SignInNote.tsx'), /href="\/sign-in"/)
  assert.doesNotMatch(read('components/AuthButton.tsx'), /authSignInGoogle\(/)
})

test('Google sign-in lands with sync=ok when from sign-in button', () => {
  assert.match(read('components/auth/GoogleSignInButton.tsx'), /signInWithGoogle/)
  assert.match(read('app/(auth)/sign-in/SignInPageClient.tsx'), /dashboard\?sync=ok/)
  assert.ok(existsSync(join(ROOT, 'components/SyncReadyBanner.tsx')))
})

test('Auth.js / Better Auth entrypoints removed', () => {
  assert.ok(!existsSync(join(ROOT, 'auth.ts')))
  assert.ok(!existsSync(join(ROOT, 'lib/auth/better-auth.ts')))
  assert.ok(!existsSync(join(ROOT, 'lib/auth/client.ts')))
  assert.ok(!existsSync(join(ROOT, 'app/api/auth/[...nextauth]/route.ts')))
})
