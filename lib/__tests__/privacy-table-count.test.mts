// The privacy page states how many tables account deletion clears, from
// USER_SCOPED_TABLES.length. A duplicate entry made it say 8 when there were 7 (R2-11).
import { test } from 'node:test'
import assert from 'node:assert/strict'

type Mod = typeof import('../privacy/userData.ts')
const raw = (await import('../privacy/userData.ts')) as Mod & { default?: Mod }
const { USER_SCOPED_TABLES } = raw.default ?? raw

test('every user-scoped table is listed once', () => {
  const list = USER_SCOPED_TABLES as readonly string[]
  assert.equal(new Set(list).size, list.length, `duplicates: ${list.filter((t, i) => list.indexOf(t) !== i)}`)
})
