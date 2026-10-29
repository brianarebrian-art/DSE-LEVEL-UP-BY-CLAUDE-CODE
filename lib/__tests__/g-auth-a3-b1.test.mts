// G-A3 + G-B1 locks: decision docs, DRAFT migration must not wipe progress,
// and sign-in entry points stay multi-method (/sign-in) without forcing wipe.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('decision paper locks A3 + B1 and rejects B3 wipe this round', () => {
  const d = read('docs/auth/G-AUTH-AND-DATA-RESET-DECISIONS-2026-10-29.md')
  assert.match(d, /已選定 A3 \+ B1/)
  assert.match(d, /本輪選定：A3/)
  assert.match(d, /本輪選定：B1/)
  assert.match(d, /B3 否決/)
})

test('DRAFT Better Auth migration creates BA tables and never truncates user_progress', () => {
  const path = 'supabase/migrations/0027_better_auth_tables.DRAFT.sql'
  assert.ok(existsSync(join(ROOT, path)), 'missing 0027 DRAFT migration')
  const sql = read(path)
  assert.match(sql, /create table if not exists public\."user"/i)
  assert.match(sql, /create table if not exists public\."session"/i)
  assert.match(sql, /create table if not exists public\."account"/i)
  assert.match(sql, /create table if not exists public\."verification"/i)
  assert.doesNotMatch(sql, /truncate\s+(table\s+)?(public\.)?user_progress/i)
  assert.doesNotMatch(sql, /drop\s+table\s+(if\s+exists\s+)?(public\.)?user_progress/i)
  assert.match(sql, /G-B1/)
})

test('navbar / result sign-in CTAs go to /sign-in (multi-method), not Google-only', () => {
  assert.match(read('components/AuthButton.tsx'), /href="\/sign-in"/)
  assert.match(read('components/SignInNote.tsx'), /href="\/sign-in"/)
  assert.doesNotMatch(read('components/AuthButton.tsx'), /authSignInGoogle\(/)
})

test('email auth success lands on dashboard with sync=ok banner flag', () => {
  const s = read('lib/auth/session.tsx')
  assert.match(s, /callbackURL = '\/dashboard\?sync=ok'/)
  assert.ok(existsSync(join(ROOT, 'components/SyncReadyBanner.tsx')))
})
