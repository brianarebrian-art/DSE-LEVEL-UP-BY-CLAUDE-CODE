// ============================================================================
// practice-count.test.mts — anonymous practice counts (founders' reply 40a, 2026-10-08)
// ----------------------------------------------------------------------------
// docs/learning-loop-measurement-plan-2026-10-08.md, option 丙. Per day and subject:
// how many sets started (and whether from the result page) and how many finished.
// Nothing identifies a student, nothing is shown to students, and nothing is sent until
// PRACTICE_COUNTS_ENABLED is switched on together with the privacy page.
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const P = await import('../practiceCount.ts')
const { parsePracticeCount, toRpcArgs, withFromResult, cameFromResult, PRACTICE_EVENTS, PRACTICE_COUNTS_ENABLED } = P
const read = (p: string) => readFileSync(p, 'utf8')
const strip = (s: string) => s.replace(/^\s*--.*$/gm, '').replace(/^\s*\/\/.*$/gm, '')
const MIGRATION = 'supabase/migrations/0023_practice_counts.sql'

test('a start keeps only subject, event and where it came from', () => {
  const r = parsePracticeCount({ subject: 'm2', event: 'started', fromResult: true, userId: 'x', email: 'a@b.c' })
  assert.ok(r.ok)
  assert.deepEqual(r.value, { subject: 'm2', event: 'started', fromResult: true, answered: 0 })
  assert.deepEqual(toRpcArgs(r.value), { p_subject: 'm2', p_event: 'started', p_from_result: true, p_answered: 0 })
})

test('a finish keeps only subject, event and the number of questions', () => {
  const r = parsePracticeCount({ subject: 'physics', event: 'completed', answered: 10 })
  assert.ok(r.ok)
  assert.deepEqual(r.value, { subject: 'physics', event: 'completed', fromResult: false, answered: 10 })
})

test('bad input is rejected', () => {
  for (const body of [
    null, [], 'x',
    { subject: 'Physics', event: 'started', fromResult: false },
    { subject: 'not-a-subject', event: 'started', fromResult: false },
    { subject: 'math', event: 'viewed', fromResult: false },
    { subject: 'math', event: 'started' },
    { subject: 'math', event: 'started', fromResult: 'yes' },
    { subject: 'math', event: 'started', fromResult: false, answered: 3 },
    { subject: 'math', event: 'completed', answered: 0 },
    { subject: 'math', event: 'completed', answered: 2.5 },
    { subject: 'math', event: 'completed', answered: 101 },
    { subject: 'math', event: 'completed', answered: 10, fromResult: true },
  ]) assert.equal(parsePracticeCount(body).ok, false, JSON.stringify(body))
})

test('the migration matches the events and holds nothing that identifies a student', () => {
  const sql = strip(read(MIGRATION))
  const events = sql.match(/event in \(([^)]*)\)/)![1].match(/'([a-z_]+)'/g)!.map((k) => k.slice(1, -1))
  assert.deepEqual(events, [...PRACTICE_EVENTS])
  assert.doesNotMatch(sql, /user_id|ip_address|user_agent|email|session_id|timestamptz|question_id|\banswer\b/)
  assert.match(sql, /primary key \(day, subject, event, from_result\)/, 'running totals, one row per day, subject and event')
  assert.match(sql, /enable row level security/)
  assert.match(sql, /revoke all on table public\.practice_counts from anon, authenticated/)
  assert.doesNotMatch(sql, /create policy/)
  assert.match(sql, /revoke all on function public\.bump_practice_count\(text, text, boolean, integer\) from public, anon, authenticated/)
  assert.match(sql, /set search_path = public/)
})

test('the route reads no session, IP or device, and stores nothing unless enabled on production', () => {
  const route = strip(read('app/api/practice-count/route.ts'))
  assert.doesNotMatch(route, /getSyncUserId|auth\(|x-forwarded-for|x-real-ip|user-agent|cookies\(|headers\(/)
  assert.match(route, /if \(!PRACTICE_COUNTS_ENABLED \|\| process\.env\.VERCEL_ENV !== 'production'\) \{/)
  assert.match(route, /parsePracticeCount\(read\.value\)/)
  assert.match(route, /\.rpc\(FN, toRpcArgs\(parsed\.value\)\)/)
  assert.match(read('proxy.ts'), /pathname !== '\/api\/practice-count' \|\| limiter\.allow\(`c:\$\{ip\}`/)
})

test('the practice page counts one start per new set and a finish on both ways to finish', () => {
  const src = read('app/practice/PracticeSession.tsx')
  assert.equal((src.match(/event: 'started'/g) ?? []).length, 1)
  assert.equal((src.match(/event: 'completed'/g) ?? []).length, 2, 'the one-question finish and the normal finish')
  assert.match(src, /if \(startCounted\.current \|\| resumedRef\.current \|\| resumeOffer \|\| questions\.length === 0\) return/)
  assert.match(src, /resumedRef\.current = true/)
})

test('the result page marks its practise-again links, and only those', () => {
  assert.equal(withFromResult('/practice?subject=math'), '/practice?subject=math&from=result')
  assert.equal(withFromResult('/practice?subject=math&topic=probability'), '/practice?subject=math&topic=probability&from=result')
  assert.ok(cameFromResult('?subject=math&from=result'))
  assert.ok(!cameFromResult('?subject=math'))
  const page = read('app/result/ResultPageClient.tsx')
  for (const h of ['steps.weakest.href', 'steps.cause.href', 'steps.retryHref']) assert.ok(page.includes(`href={withFromResult(${h})}`), h)
  assert.ok(page.includes('href={steps.topicsHref}'), 'the subject page link is not a practice set')
})

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) return n === '__tests__' ? [] : files(p)
    return /\.(ts|tsx)$/.test(n) ? [p] : []
  })
}

test('no page or component reads the counts back: students never see them', () => {
  const all = [...files('app'), ...files('components'), ...files('lib')]
  // Nothing selects from the table; only the write route calls the function.
  assert.deepEqual(all.filter((p) => /from\(['"]practice_counts['"]\)/.test(read(p))), [])
  assert.deepEqual(all.filter((p) => /['"]bump_practice_count['"]/.test(read(p))), ['app/api/practice-count/route.ts'])
})

test('the counts are on only while the privacy page describes them', () => {
  const privacy = read('app/privacy/PrivacyClient.tsx')
  if (PRACTICE_COUNTS_ENABLED) {
    assert.match(privacy, /title=\{en \? 'Counting practice sets' : '數練習次數'\}/, 'the privacy page must describe the counts while they are on')
    // 43a: opening an explanation is not counted, so nothing about explanations is sent.
    assert.doesNotMatch(strip(read('lib/practiceCount.ts')), /explanation/i)
  } else {
    // While off, the client sends nothing.
    assert.match(read('lib/practiceCount.ts'), /export function sendPracticeCount\(c: PracticeCount\): void \{\n  if \(!PRACTICE_COUNTS_ENABLED\) return/)
  }
})
