// One source for every question count, and only published questions reach students
// (UX loop 20, 2026-09-30; Yuna's hardening loop prompt §2–§3).
//
// Before: the home page and practice showed 26,510, /transparency showed 597 withdrawn,
// and nothing on the site explained how they related (an older home page showed 27,106,
// which is the authored total minus the held-back topics). The 13 questions the
// positional check could not classify stayed in practice while they waited for a person.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const { getSubjectQuestions, getSubjectQuestionsRaw } = await import('../../data/questions/index.ts')
const { CONTENT_STATS, TOTAL_QUESTIONS } = await import('../../data/questions/summary.generated.ts')
const ht: any = await import('../../data/questions/hidden-topics.ts')
const HT = ht.default?.contentStatus ? ht.default : ht
const { subjects } = await import('../../data/subjects.ts')
const active = subjects.filter((s: { isActive?: boolean }) => s.isActive !== false)

test('the four statuses add up to the authored total, and published is the practice pool', () => {
  const s = CONTENT_STATS
  assert.equal(s.published + s.withdrawn + s.withheldTopic + s.pendingReview, s.totalAuthored)
  assert.equal(s.published, TOTAL_QUESTIONS)
  const live = active.reduce((n: number, x: { id: string }) => n + getSubjectQuestions(x.id).length, 0)
  assert.equal(live, s.published, 'run npm run gen:summary')
})

test('the generated counts match a recount of the real bank', () => {
  const c = { totalAuthored: 0, published: 0, withdrawn: 0, withheldTopic: 0, pendingReview: 0 }
  const key = { published: 'published', withdrawn: 'withdrawn', withheld_topic: 'withheldTopic', pending_review: 'pendingReview' } as const
  for (const s of active) for (const q of getSubjectQuestionsRaw(s.id)) {
    c.totalAuthored++
    c[key[HT.contentStatus(s.id, q) as keyof typeof key]]++
  }
  assert.deepEqual({ ...CONTENT_STATS }, c, 'run npm run gen:summary')
})

test('the homepage count of questions withdrawn for a fault leaves out the pure-recall replacements', async () => {
  const { WITHDRAWN_FOR_FAULT } = await import('../../data/questions/summary.generated.ts')
  let fault = 0
  let recall = 0
  for (const s of active) for (const q of getSubjectQuestionsRaw(s.id)) {
    if (HT.contentStatus(s.id, q) !== 'withdrawn') continue
    if (HT.withdrawnReason(s.id, q.id) === 'PURE_RECALL') recall++
    else fault++
  }
  assert.equal(WITHDRAWN_FOR_FAULT, fault, 'run npm run gen:summary')
  assert.equal(fault + recall, CONTENT_STATS.withdrawn)
  assert.ok(recall >= 100, 'the 2026-10-09 pure-recall withdrawals are counted')
})

test('no student-facing pool contains a question that is not published', () => {
  for (const s of active) {
    for (const q of getSubjectQuestions(s.id)) assert.equal(HT.contentStatus(s.id, q), 'published', `${s.id}/${q.id}`)
  }
  // The filter used by both read paths (index.ts and load.ts, cloud and static).
  const [subject, byId] = Object.entries(HT.PENDING_REVIEW)[0] as [string, Record<string, unknown>]
  const pendingId = Object.keys(byId)[0]
  const kept = HT.withoutWithheld(subject, [{ id: pendingId, topic: 't' }, { id: '__live__', topic: 't' }])
  assert.deepEqual(kept.map((q: { id: string }) => q.id), ['__live__'])
  const load = read('data/questions/load.ts')
  assert.equal((load.match(/return withoutWithheld\(subjectId, /g) ?? []).length, 2, 'cloud and static paths both filter')
})

test('pending review is exactly the class C list the positional check could not decide', () => {
  const cls = JSON.parse(read('data/questions/posref-classification.json')) as { rows: { subject: string; id: string; class: string }[] }
  const want = cls.rows.filter((r) => r.class === 'C').map((r) => `${r.subject}/${r.id}`).sort()
  const got = Object.entries(HT.PENDING_REVIEW as Record<string, Record<string, { reason: string }>>)
    .flatMap(([s, ids]) => Object.entries(ids).map(([id, e]) => {
      assert.ok(HT.PENDING_CODES[e.reason], `${s}/${id}: unknown reason ${e.reason}`)
      return `${s}/${id}`
    })).sort()
  assert.deepEqual(got, want, 'run scripts/qbank/classify-posref.mts --write')
  assert.equal(CONTENT_STATS.pendingReview, want.length)
})

test('transparency shows the breakdown from the same source, passed from the server', () => {
  const page = read('app/transparency/page.tsx')
  assert.match(page, /import \{ CONTENT_STATS \} from '@\/data\/questions\/summary\.generated'/)
  assert.match(page, /content=\{CONTENT_STATS\}/)
  const client = read('app/transparency/TransparencyClient.tsx')
  assert.doesNotMatch(client, /from '@\/data\/questions\/summary\.generated'/, 'the client gets numbers only, not the topic lists')
  for (const k of ['published', 'withdrawn', 'withheldTopic', 'pendingReview', 'totalAuthored']) {
    assert.match(client, new RegExp(`n\\(content\\.${k}\\)`), k)
  }
  const visible = client.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  assert.doesNotMatch(visible, /照常出題|stay in practice until/, 'old copy said unclear questions stayed live')
})

test('a bookmarked pending question says it is held back, not gone', () => {
  const src = read('app/bookmarks/BookmarksView.tsx')
  assert.match(src, /isPendingReview\(bm\.subjectId, bm\.questionId\) \?/)
})
