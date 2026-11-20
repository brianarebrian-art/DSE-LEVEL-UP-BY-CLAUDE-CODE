// Unsigned product-improvement writes must not insert. Signed-in writes keep the old row shape.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { insertOnlyIfSignedIn, signedInsertHttp } = await import('../api/signedWrite.ts')
const { parseFeedback, toFeedbackRow } = await import('../sessionFeedback.ts')
const { parseGeneralFeedback } = await import('../generalFeedback.ts')
const { parseReport, toRow } = await import('../questionReport.ts')

const read = (p: string) => readFileSync(p, 'utf8')

test('a missing user id never calls insert and answers 401', async () => {
  let calls = 0
  for (const userId of [null, '']) {
    const outcome = await insertOnlyIfSignedIn(userId, { kept: true }, async () => {
      calls += 1
      return { error: null }
    })
    assert.deepEqual(outcome, { status: 'unauthenticated' })
    assert.deepEqual(signedInsertHttp(outcome), { body: { error: 'unauthenticated' }, status: 401 })
  }
  assert.equal(calls, 0)
})

test('a signed-in caller inserts once, and a database error does not pretend success', async () => {
  let calls = 0
  let saved: unknown = null
  const ok = await insertOnlyIfSignedIn('auth-users-uuid', { subject: 'math' }, async (row) => {
    calls += 1
    saved = row
    return { error: null }
  })
  assert.deepEqual(ok, { status: 'ok' })
  assert.deepEqual(signedInsertHttp(ok), { body: { ok: true }, status: 200 })
  assert.equal(calls, 1)
  assert.deepEqual(saved, { subject: 'math' })

  const missing = await insertOnlyIfSignedIn('auth-users-uuid', { subject: 'math' }, async () => {
    calls += 1
    return { error: { code: 'PGRST205' } }
  })
  assert.equal(signedInsertHttp(missing).status, 503)
  assert.deepEqual(signedInsertHttp(missing).body, { error: 'unavailable' })

  const broken = await insertOnlyIfSignedIn('auth-users-uuid', { subject: 'math' }, async () => {
    calls += 1
    return { error: { code: '23514' } }
  })
  assert.equal(signedInsertHttp(broken).status, 500)
  assert.equal(calls, 3)
})

test('session feedback, general feedback and question reports keep their old rows', async () => {
  const session = parseFeedback({
    subject: 'ethics-religious',
    question: 'will_return',
    answer: 'unsure',
    locale: 'zh',
    userId: 'student-1',
    note: '我個名',
  })
  assert.equal(session.ok, true)
  if (!session.ok) return

  const general = parseGeneralFeedback({
    features: { just_one_card: 'helped_a_bit' },
    locale: 'en',
    email: 'a@b.com',
  })
  assert.equal(general.ok, true)
  if (!general.ok) return

  const report = parseReport({
    questionId: 'chist_floor_07',
    category: 'answer',
    locale: 'zh',
    detail: '我個名係…',
  })
  assert.equal(report.ok, true)
  if (!report.ok) return

  const rows = [
    toFeedbackRow(session.value),
    { payload: general.value },
    toRow(report.value),
  ]
  const inserted: unknown[] = []
  for (const row of rows) {
    const denied = await insertOnlyIfSignedIn(null, row, async () => {
      inserted.push(row)
      return { error: null }
    })
    assert.equal(denied.status, 'unauthenticated')
  }
  assert.deepEqual(inserted, [])

  for (const row of rows) {
    const allowed = await insertOnlyIfSignedIn('auth-users-uuid', row, async (value) => {
      inserted.push(value)
      return { error: null }
    })
    assert.equal(allowed.status, 'ok')
  }
  assert.deepEqual(inserted, rows)
  for (const row of inserted) {
    assert.equal(JSON.stringify(row).includes('student-1'), false)
    assert.equal(JSON.stringify(row).includes('a@b.com'), false)
    assert.equal(JSON.stringify(row).includes('user_id'), false)
    assert.equal(JSON.stringify(row).includes('我個名'), false)
  }
})

test('the three write routes gate on getSyncUserId before any insert', () => {
  for (const file of ['app/api/feedback/route.ts', 'app/api/feedback-general/route.ts', 'app/api/report/route.ts']) {
    const route = read(file).replace(/^\s*\/\/.*$/gm, '')
    const gate = route.indexOf('if (!userId)')
    const insert = route.indexOf('.insert(')
    assert.ok(route.includes('getSyncUserId()'), file)
    assert.ok(route.includes("error: 'unauthenticated'"), file)
    assert.ok(route.includes('status: 401'), file)
    assert.ok(gate !== -1 && insert > gate, file)
    assert.equal(route.split('.from(').length - 1, 1, file)
  }
})
