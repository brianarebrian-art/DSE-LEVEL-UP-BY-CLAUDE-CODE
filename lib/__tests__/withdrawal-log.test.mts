// Withdrawal log on /transparency (audit #7, founders' reply A7-3 A, 2026-10-04).
// Lists the latest batches by date and reason with per-subject counts; never question ids or
// text, and free-text reasons are published only under a generic label.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { groupWithdrawals, recentWithdrawals, repairStats } = await import('../../data/questions/repair-stats.ts')
const { WITHDRAW_CODES } = await import('../../data/questions/hidden-topics.ts')

const names = (id: string) => ({ zh: `科${id}`, en: id })
const codes = { CODE_A: 'internal description' }

test('groups by date and reason, newest first, with per-subject counts', () => {
  const data = {
    math: { m1: { date: '2026-09-01', reason: 'CODE_A' }, m2: { date: '2026-10-01', reason: 'CODE_A' } },
    bafs: { b1: { date: '2026-09-01', reason: 'CODE_A' }, b2: { date: '2026-09-01', reason: 'CODE_A' } },
  }
  const out = groupWithdrawals(data, codes, names, 10)
  assert.deepEqual(out.map((b) => [b.date, b.total]), [['2026-10-01', 1], ['2026-09-01', 3]])
  assert.deepEqual(out[1].subjects, [{ zh: '科bafs', en: 'bafs', count: 2 }, { zh: '科math', en: 'math', count: 1 }])
})

test('free-text reasons are grouped as OTHER and never passed on', () => {
  const data = { math: { m1: { date: '2026-10-02', reason: 'the diagram in Q12 is wrong' } } }
  const out = groupWithdrawals(data, codes, names, 10)
  assert.equal(out[0].reason, 'OTHER')
  assert.doesNotMatch(JSON.stringify(out), /diagram|m1/)
})

test('keeps only the latest batches', () => {
  const data = { math: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`q${i}`, { date: `2026-09-${String(i + 1).padStart(2, '0')}`, reason: 'CODE_A' }])) }
  const out = groupWithdrawals(data, codes, names, 10)
  assert.equal(out.length, 10)
  assert.equal(out[0].date, '2026-09-15')
})

test('the real log adds up to the withdrawn count and lists no question ids', () => {
  const all = recentWithdrawals(1000)
  assert.equal(all.reduce((n, b) => n + b.total, 0), repairStats().withdrawnNow)
  assert.doesNotMatch(JSON.stringify(recentWithdrawals()), /_rep_|_fm\d|"id"/)
})

test('every reason code has a plain-words label on the page', () => {
  const page = readFileSync('app/transparency/TransparencyClient.tsx', 'utf8')
  for (const code of Object.keys(WITHDRAW_CODES)) assert.match(page, new RegExp(`case '${code}':`), `${code} needs a label`)
  assert.match(readFileSync('app/transparency/page.tsx', 'utf8'), /withdrawals=\{recentWithdrawals\(\)\}/)
})
