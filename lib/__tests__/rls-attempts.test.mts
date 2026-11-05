import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

test('RLS Policy Matrix: practice_attempts and learning_progress must deny DELETE to authenticated students', () => {
  const migration0030 = readFileSync(
    join(process.cwd(), 'supabase/migrations/0030_supabase_google_auth_rebuild.sql'),
    'utf8',
  )

  // 1. practice_attempts must NOT grant DELETE to authenticated
  const practiceAttemptsGrant = migration0030.match(
    /GRANT\s+([A-Z,\s]+)\s+ON\s+TABLE\s+public\.practice_attempts\s+TO\s+authenticated;/i,
  )
  assert.ok(practiceAttemptsGrant, 'practice_attempts must have explicit GRANT to authenticated')
  assert.ok(
    !practiceAttemptsGrant[1].includes('DELETE'),
    'practice_attempts must NOT grant DELETE to authenticated (append-only history)',
  )
  assert.ok(
    !migration0030.includes('practice_attempts_delete_own'),
    'practice_attempts must not define practice_attempts_delete_own policy',
  )

  // 2. learning_progress must NOT grant DELETE to authenticated
  const learningProgressGrant = migration0030.match(
    /GRANT\s+([A-Z,\s]+)\s+ON\s+TABLE\s+public\.learning_progress\s+TO\s+authenticated;/i,
  )
  assert.ok(learningProgressGrant, 'learning_progress must have explicit GRANT to authenticated')
  assert.ok(
    !learningProgressGrant[1].includes('DELETE'),
    'learning_progress must NOT grant DELETE to authenticated',
  )
  assert.ok(
    !migration0030.includes('CREATE POLICY learning_progress_delete_own'),
    'learning_progress must NOT have active learning_progress_delete_own policy',
  )
})
