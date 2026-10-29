// G-A3 + G-B3 + S1 locks: decision docs, wipe DRAFT only touches user tables,
// Better Auth migration never wipes, sign-in stays multi-method + session continuity.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('decision paper locks A3 + B3 + S1 (same-device session)', () => {
  const d = read('docs/auth/G-AUTH-AND-DATA-RESET-DECISIONS-2026-10-29.md')
  assert.match(d, /已選定 A3 \+ B3 \+ S1/)
  assert.match(d, /選定：A3/)
  assert.match(d, /選定：B3/)
  assert.match(d, /S1 同裝置 session 延續/)
  assert.match(d, /S2 跨裝置免密自動登入[\s\S]*否決/)
  assert.match(d, /0028_g_b3_user_data_wipe\.DRAFT\.sql/)
})

test('DRAFT Better Auth migration creates BA tables and never truncates user_progress', () => {
  const path = 'supabase/migrations/0027_better_auth_tables.DRAFT.sql'
  assert.ok(existsSync(join(ROOT, path)), 'missing 0027 DRAFT migration')
  const sql = read(path)
  assert.match(sql, /create table if not exists public\."user"/i)
  assert.match(sql, /create table if not exists public\."session"/i)
  assert.doesNotMatch(sql, /truncate\s+(table\s+)?(public\.)?user_progress/i)
  assert.doesNotMatch(sql, /drop\s+table\s+(if\s+exists\s+)?(public\.)?user_progress/i)
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
  assert.match(sql, /G-B3/)
  assert.match(sql, /DRAFT/)
})

test('navbar / result sign-in CTAs go to /sign-in (multi-method), not Google-only', () => {
  assert.match(read('components/AuthButton.tsx'), /href="\/sign-in"/)
  assert.match(read('components/SignInNote.tsx'), /href="\/sign-in"/)
  assert.doesNotMatch(read('components/AuthButton.tsx'), /authSignInGoogle\(/)
})

test('email auth success lands on dashboard with sync=ok banner flag (S1 session path)', () => {
  const s = read('lib/auth/session.tsx')
  assert.match(s, /callbackURL = '\/dashboard\?sync=ok'/)
  assert.ok(existsSync(join(ROOT, 'components/SyncReadyBanner.tsx')))
})

test('B3 wipe runbook requires backup and announcement before apply', () => {
  const r = read('docs/auth/G-B3-WIPE-RUNBOOK-2026-10-29.md')
  assert.match(r, /備份/)
  assert.match(r, /公告/)
  assert.match(r, /唔准.*TRUNCATE|唔會自行對 production/i)
})
