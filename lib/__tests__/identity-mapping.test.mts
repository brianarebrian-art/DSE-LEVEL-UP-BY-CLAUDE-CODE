import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { IdentityMapping, IdentityMappingStore, MappingProvider } from '../auth/identityMappingCore.ts'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const loaded: any = await import('../auth/identityMappingCore.ts')
const core = loaded.default ?? loaded
const resolveBusinessUserId = core.resolveBusinessUserId ?? loaded.resolveBusinessUserId

function memoryStore(seed: IdentityMapping[] = []): IdentityMappingStore {
  const rows = new Map(seed.map((row) => [`${row.provider}:${row.subject}`, row]))
  return {
    async find(provider: MappingProvider, subject: string) {
      return rows.get(`${provider}:${subject}`)?.userId ?? null
    },
    async insertIfAbsent(row) {
      const key = `${row.provider}:${row.subject}`
      if (!rows.has(key)) rows.set(key, row)
    },
  }
}

test('verified Google subject preserves a legacy business user id without email matching', async () => {
  const store = memoryStore()
  const id = await resolveBusinessUserId({ betterAuthUserId: 'ba-user-1', googleSubject: 'google-sub-1' }, store)
  assert.equal(id, 'google-sub-1')
  assert.equal(await store.find('google', 'google-sub-1'), 'google-sub-1')
  assert.equal(await store.find('better_auth_user', 'ba-user-1'), 'google-sub-1')
})

test('an explicit Google link preserves an existing Better Auth business id', async () => {
  const store = memoryStore([
    { provider: 'better_auth_user', subject: 'ba-email-user', userId: 'business-id-1', method: 'better_auth_user_id' },
  ])
  const id = await resolveBusinessUserId({ betterAuthUserId: 'ba-email-user', googleSubject: 'google-sub-2' }, store)
  assert.equal(id, 'business-id-1')
  assert.equal(await store.find('google', 'google-sub-2'), 'business-id-1')
})

test('distinct verified identities with conflicting mappings fail closed and are not merged', async () => {
  const store = memoryStore([
    { provider: 'better_auth_user', subject: 'ba-user-a', userId: 'business-a', method: 'better_auth_user_id' },
    { provider: 'google', subject: 'google-sub-b', userId: 'business-b', method: 'verified_google_subject' },
  ])
  assert.equal(await resolveBusinessUserId({ betterAuthUserId: 'ba-user-a', googleSubject: 'google-sub-b' }, store), null)
})

test('concurrent first-login resolution is idempotent for the same verified identities', async () => {
  const store = memoryStore()
  const input = { betterAuthUserId: 'ba-concurrent', googleSubject: 'google-concurrent' }
  const results = await Promise.all(Array.from({ length: 20 }, () => resolveBusinessUserId(input, store)))
  assert.deepEqual(new Set(results), new Set(['google-concurrent']))
})

test('server mapping never matches on email and missing Google proof stays unmapped', async () => {
  const store = memoryStore()
  const source = readFileSync(join(ROOT, 'lib/auth/server.ts'), 'utf8')
  assert.doesNotMatch(source, /session\.user\.email/)
  assert.match(source, /if \(!google \|\| typeof .*accountId !== 'string'\)/)
  assert.equal(await store.find('google', 'student@example.test'), null)
})
