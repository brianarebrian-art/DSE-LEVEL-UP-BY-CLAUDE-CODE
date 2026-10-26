import assert from 'node:assert/strict'
import test from 'node:test'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const policy = require('../supabase/targetPolicy.ts') as typeof import('../supabase/targetPolicy')
const PROD = policy.PRODUCTION_SUPABASE_PROJECT_REF
const PREVIEW = 'abcdefghijklmnopqrst'

 test('production accepts only the verified production Supabase ref', () => {
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PROD}.supabase.co`, 'production'), true)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PREVIEW}.supabase.co`, 'production'), false)
  assert.equal(policy.isAllowedSupabaseDatabaseTarget(`postgresql://postgres:synthetic@db.${PROD}.supabase.co:5432/postgres`, 'production'), true)
})

test('Preview requires an explicit non-production project ref and never accepts production', () => {
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PREVIEW}.supabase.co`, 'preview', PREVIEW), true)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PROD}.supabase.co`, 'preview', PREVIEW), false)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PREVIEW}.supabase.co`, 'preview'), false)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PROD}.supabase.co`, 'preview', PROD), false)
})

test('development requires an explicit non-production project ref', () => {
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PREVIEW}.supabase.co`, 'development', PREVIEW), true)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PROD}.supabase.co`, 'development', PROD), false)
  assert.equal(policy.isAllowedSupabaseDatabaseTarget('postgresql://postgres:synthetic@localhost:54322/postgres', 'development', 'local'), true)
  assert.equal(policy.isAllowedSupabaseDatabaseTarget('postgresql://postgres:synthetic@localhost:54322/postgres', 'preview', 'local'), false)
})

test('API URL parser rejects malformed, insecure, credentialed, and lookalike hosts', () => {
  assert.equal(policy.isAllowedSupabaseApiTarget(`http://${PREVIEW}.supabase.co`, 'preview', PREVIEW), false)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PREVIEW}.supabase.co.evil.example`, 'preview', PREVIEW), false)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://user:pass@${PREVIEW}.supabase.co`, 'preview', PREVIEW), false)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PREVIEW}.supabase.co:8443`, 'preview', PREVIEW), false)
  assert.equal(policy.isAllowedSupabaseApiTarget('not-a-url', 'production'), false)
  assert.equal(policy.isAllowedSupabaseApiTarget(`https://${PREVIEW}.supabase.co`, 'unknown', PREVIEW), false)
})

test('Postgres parser binds both direct and pooler URLs to the explicit project ref', () => {
  assert.equal(policy.isAllowedSupabaseDatabaseTarget(`postgresql://postgres.${PREVIEW}:synthetic@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`, 'preview', PREVIEW), true)
  assert.equal(policy.isAllowedSupabaseDatabaseTarget(`postgresql://postgres.${PROD}:synthetic@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres`, 'preview', PREVIEW), false)
  assert.equal(policy.isAllowedSupabaseDatabaseTarget('postgresql://postgres:synthetic@db.other.example/postgres', 'production'), false)
})
