// Question reports sent to the site (audit #7, founders' reply "a", 2026-10-04).
// Only what the student picks is stored: question id, category, language, time. The student's
// own description never reaches the site (charter §16.E constraint 5), and nothing links a
// report to a student.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { parseReport, toRow, CATEGORIES } = await import('../questionReport.ts')
const read = (p: string) => readFileSync(p, 'utf8')
const strip = (s: string) => s.replace(/^\s*--.*$/gm, '').replace(/^\s*\/\/.*$/gm, '')

test('a valid report keeps only id, category and language', () => {
  const r = parseReport({ questionId: 'chist_floor_07', category: 'answer', locale: 'zh', detail: '我個名係…', name: 'x' })
  assert.ok(r.ok)
  assert.deepEqual(r.value, { questionId: 'chist_floor_07', category: 'answer', locale: 'zh' })
  assert.deepEqual(Object.keys(toRow(r.value)).sort(), ['category', 'locale', 'question_id'])
})

test('bad input is rejected', () => {
  for (const body of [
    null, [], 'x',
    { questionId: '', category: 'answer', locale: 'zh' },
    { questionId: 'a b', category: 'answer', locale: 'zh' },
    { questionId: 'x'.repeat(101), category: 'answer', locale: 'zh' },
    { questionId: 'q1', category: 'nope', locale: 'zh' },
    { questionId: 'q1', category: 'answer', locale: 'fr' },
  ]) assert.equal(parseReport(body).ok, false, JSON.stringify(body)?.slice(0, 60))
})

test('the migration matches the categories and holds nothing that identifies a student', () => {
  const sql = strip(read('supabase/migrations/0020_question_reports.sql'))
  const keys = sql.match(/category in \(([^)]*)\)/)![1].match(/'([a-z]+)'/g)!.map((k) => k.slice(1, -1))
  assert.deepEqual(keys, CATEGORIES.map((c) => c.key))
  assert.doesNotMatch(sql, /user_id|ip_address|user_agent|email|detail|\bname\b/)
  assert.match(sql, /enable row level security/)
  assert.match(sql, /revoke all on table public\.question_reports from anon, authenticated/)
  assert.doesNotMatch(sql, /create policy/)
})

test('the API route reads no session, IP or device, and says when the table is missing', () => {
  const route = strip(read('app/api/report/route.ts'))
  assert.doesNotMatch(route, /getSyncUserId|auth\(|x-forwarded-for|x-real-ip|user-agent|cookies\(/)
  assert.match(route, /parseReport\(read\.value\)/)
  assert.match(route, /insert\(toRow\(parsed\.value\)\)/)
  assert.match(route, /'PGRST205'/)
  assert.match(route, /status: missing \? 503 : 500/)
})

test('the button sends no description and only says "received" on { ok: true }', () => {
  const src = read('components/ReportQuestionButton.tsx')
  const body = src.match(/body: JSON\.stringify\((\{[^}]*\})\)/)![1]
  assert.equal(body, "{ questionId, category: cat, locale: en ? 'en' : 'zh' }")
  assert.match(src, /setSend\(res\.ok && data\?\.ok === true \? 'sent' : 'failed'\)/)
  assert.match(src, /傳送唔到。請用下面嘅電郵寄出。/)
  assert.match(src, /呢度寫嘅字只會經你自己嘅電郵寄出，本站唔會儲存。/)
})

test('reports have their own per-IP limit, and the privacy page explains them', () => {
  assert.match(read('proxy.ts'), /pathname !== '\/api\/report' \|\| limiter\.allow\(`r:\$\{ip\}`, AUTH_WINDOW_MS, LIMIT_REPORT\)/)
  const privacy = read('app/privacy/PrivacyClient.tsx')
  assert.match(privacy, /'報告題目問題'/)
  assert.match(privacy, /唔會記低你嘅帳戶、IP 位址或者裝置/)
})
