// Two questions after a practice set (audit #8, founders' reply 5a; wording "5 ok", 2026-10-04).
// Only the subject, question, picked answer and language are stored; nothing identifies a student.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { parseFeedback, toFeedbackRow, FEEDBACK_QUESTIONS, FEEDBACK_ANSWERS } = await import('../sessionFeedback.ts')
const read = (p: string) => readFileSync(p, 'utf8')
const strip = (s: string) => s.replace(/^\s*--.*$/gm, '').replace(/^\s*\/\/.*$/gm, '')

test('a valid answer keeps only subject, question, answer and language', () => {
  const r = parseFeedback({ subject: 'ethics-religious', question: 'had_error', answer: 'yes', locale: 'zh', note: '我個名', userId: 'x' })
  assert.ok(r.ok)
  assert.deepEqual(toFeedbackRow(r.value), { subject: 'ethics-religious', question: 'had_error', answer: 'yes', locale: 'zh' })
})

test('bad input is rejected', () => {
  for (const body of [
    null, [], { subject: 'Math', question: 'had_error', answer: 'yes', locale: 'zh' },
    { subject: 'math', question: 'mood', answer: 'yes', locale: 'zh' },
    { subject: 'math', question: 'will_return', answer: 'maybe', locale: 'zh' },
    { subject: 'math', question: 'will_return', answer: 'yes', locale: 'fr' },
  ]) assert.equal(parseFeedback(body).ok, false, JSON.stringify(body))
})

test('the migration matches the allowed values and holds nothing that identifies a student', () => {
  const sql = strip(read('supabase/migrations/0022_session_feedback.sql'))
  const list = (col: string) => sql.match(new RegExp(`${col} in \\(([^)]*)\\)`))![1].match(/'([a-z_]+)'/g)!.map((k) => k.slice(1, -1))
  assert.deepEqual(list('question'), [...FEEDBACK_QUESTIONS])
  assert.deepEqual(list('answer'), [...FEEDBACK_ANSWERS])
  assert.doesNotMatch(sql, /user_id|ip_address|user_agent|email|session_id|\bnote\b|detail/)
  assert.match(sql, /enable row level security/)
  assert.match(sql, /revoke all on table public\.session_feedback from anon, authenticated/)
  assert.doesNotMatch(sql, /create policy/)
})

test('the route reads no session, IP or device', () => {
  const route = strip(read('app/api/feedback/route.ts'))
  assert.doesNotMatch(route, /getSyncUserId|auth\(|x-forwarded-for|x-real-ip|user-agent|cookies\(/)
  assert.match(route, /parseFeedback\(read\.value\)/)
  assert.match(route, /insert\(toFeedbackRow\(parsed\.value\)\)/)
})

test('the card uses the approved wording, says thanks only on { ok: true }, and sits on /result', () => {
  const card = read('components/SessionFeedback.tsx')
  for (const s of ['題入面，你覺得有冇題目出錯？', '下次溫書，你會唔會再用呢度？', "zh: '冇'", "zh: '有'", "zh: '唔肯定'", "zh: '會'", "zh: '唔會'", "zh: '未知'",
    '多謝！下次見到有問題嘅題目，可以喺嗰條題下面撳「呢條題有問題？話我哋知」，我哋就知道係邊條。', '多謝你話我哋知！'])
    assert.ok(card.includes(s), s)
  assert.match(card, /res\.ok && data\?\.ok === true \? 'sent' : 'failed'/)
  assert.match(card, /body: JSON\.stringify\(\{ subject: subjectId, question, answer, locale: en \? 'en' : 'zh' \}\)/)
  assert.match(read('app/result/ResultPageClient.tsx'), /\{result\.subjectId && <SessionFeedback subjectId=\{result\.subjectId\} total=\{result\.total\} \/>\}/)
  assert.match(read('proxy.ts'), /pathname !== '\/api\/feedback' \|\| limiter\.allow\(`f:\$\{ip\}`/)
  assert.match(read('app/privacy/PrivacyClient.tsx'), /'做完練習嘅兩條問題'/)
})
