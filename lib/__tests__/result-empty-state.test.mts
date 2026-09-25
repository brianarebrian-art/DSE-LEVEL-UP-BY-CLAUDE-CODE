// /result empty state and `dse_result` parsing.
//
// Two defects fixed on 2026-09-25:
//   1. Before the mount effect read localStorage, `result` was null, so the page
//      rendered "no practice result found" first on every visit, including right
//      after a student finished a session. The server-rendered HTML contained the
//      same message.
//   2. `dse_result` was passed to JSON.parse unguarded and its shape was never
//      checked. DataPortability imports the key after checking only that it is an
//      object, so `{}` from a backup file crashed the page during render.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..', '..')
const FILE = 'app/result/ResultPageClient.tsx'

const ns: any = await import('../../app/result/ResultPageClient.tsx')
const { readStoredResult } = (ns.default?.readStoredResult ? ns.default : ns) as {
  readStoredResult: (raw: string | null) => { score: number; total: number } | null
}

const valid = { score: 7, total: 10, topicResults: [], elapsed: 312 }
const enc = (o: unknown) => JSON.stringify(o)

test('a record written by PracticeSession is accepted', () => {
  assert.equal(readStoredResult(enc(valid))?.score, 7)
  assert.equal(readStoredResult(enc({ ...valid, score: 0 }))?.score, 0)
  assert.equal(readStoredResult(enc({ ...valid, score: 10 }))?.score, 10)
})

test('unusable values return null instead of throwing', () => {
  const bad: [string, string | null][] = [
    ['missing key', null],
    ['empty string', ''],
    ['not JSON', '{"score":'],
    ['JSON null', 'null'],
    ['JSON number', '42'],
    ['empty object (passes the DataPortability import check)', '{}'],
    ['topicResults missing', enc({ score: 1, total: 2, elapsed: 3 })],
    ['elapsed missing', enc({ score: 1, total: 2, topicResults: [] })],
    ['score as string', enc({ ...valid, score: '7' })],
    ['score above total', enc({ ...valid, score: 11 })],
    ['negative score', enc({ ...valid, score: -1 })],
    ['total zero', enc({ ...valid, score: 0, total: 0 })],
    ['fractional total', enc({ ...valid, total: 10.5 })],
  ]
  for (const [label, raw] of bad) {
    assert.doesNotThrow(() => readStoredResult(raw), label)
    assert.equal(readStoredResult(raw), null, label)
  }
})

test('the empty state is not rendered before localStorage has been read', () => {
  const src = readFileSync(join(ROOT, FILE), 'utf8')
  const loading = src.indexOf('if (!checked)')
  const empty = src.indexOf('if (!result || !gradeResult)')
  assert.ok(loading > -1, 'the not-yet-checked branch is missing')
  assert.ok(empty > -1, 'the empty-state branch is missing')
  assert.ok(loading < empty, 'the not-yet-checked branch must return before the empty state')
  assert.match(src, /setChecked\(true\)/, 'nothing ever marks localStorage as read')
})

test('the empty state explains why and offers a next step, in both locales', async () => {
  const dict: any = await import('../dictionary.ts')
  const d = dict.default?.dictionary ?? dict.dictionary ?? dict.default ?? dict
  for (const locale of ['zh', 'en']) {
    const r = d[locale]?.result
    assert.ok(r, `${locale}.result missing`)
    for (const k of ['emptyTitle', 'emptyBody', 'emptyStart', 'emptyProgress']) {
      assert.ok(typeof r[k] === 'string' && r[k].length > 0, `${locale}.result.${k} missing`)
    }
    // The old copy ended in an ellipsis, which reads as "still loading".
    assert.doesNotMatch(r.emptyTitle, /…|\.\.\./, `${locale}.result.emptyTitle reads as a loading message`)
  }
})
