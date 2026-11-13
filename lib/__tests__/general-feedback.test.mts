// Anonymous /feedback. Only a scenario payload is stored. Nothing identifies a student.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { parseGeneralFeedback, reflectionCard, FEATURE_IDS, FEATURE_CHOICES, A11Y_IDS } = await import('../generalFeedback.ts')
const read = (p: string) => readFileSync(p, 'utf8')
const strip = (s: string) => s.replace(/^\s*--.*$/gm, '').replace(/^\s*\/\/.*$/gm, '')

test('a valid form keeps scenario answers and drops identity fields', () => {
  const r = parseGeneralFeedback({
    userId: 'student-1',
    email: 'a@b.com',
    ip: '1.2.3.4',
    features: { focus_light: 'very_useful', quiet_mode: 'not_tried', score: 5 },
    accessibility: { answers: { contrast: 'comfortable' }, note: '字夠清楚 a@b.com' },
    aha: { had_moment: true, text: '原來係咁' },
    locale: 'zh',
    authorization: 'Bearer secret',
  })
  assert.ok(r.ok)
  if (!r.ok) return
  assert.deepEqual(r.value, {
    version: 1,
    features: { focus_light: 'very_useful', quiet_mode: 'not_tried' },
    accessibility: { answers: { contrast: 'comfortable' }, note: '字夠清楚' },
    aha: { had_moment: true, text: '原來係咁' },
    locale: 'zh',
  })
  assert.equal(JSON.stringify(r.value).includes('student-1'), false)
  assert.equal(JSON.stringify(r.value).includes('a@b.com'), false)
  assert.equal(JSON.stringify(r.value).includes('secret'), false)
})

test('numeric ratings and an empty form are rejected', () => {
  assert.equal(parseGeneralFeedback({ features: { focus_light: 5 } }).ok, false)
  assert.equal(parseGeneralFeedback({ features: { focus_light: '5' } }).ok, false)
  assert.equal(parseGeneralFeedback({}).ok, false)
  assert.equal(parseGeneralFeedback({ aha: { had_moment: false, text: '   ' } }).ok, false)
  assert.equal(parseGeneralFeedback({ features: { just_one_card: 'not_tried' } }).ok, true)
})

test('the reflection card has no score', () => {
  const parsed = parseGeneralFeedback({
    features: { just_one_card: 'helped_a_bit', error_analysis: 'not_for_me' },
    aha: { had_moment: true },
    locale: 'zh',
  })
  assert.ok(parsed.ok)
  if (!parsed.ok) return
  const card = reflectionCard(parsed.value, 'zh')
  assert.equal(card.title, '一句冇分數嘅話')
  assert.match(card.text, /只做一題有少少幫助/)
  assert.match(card.text, /錯因分析暫時唔係我嘅方式/)
  assert.match(card.text, /原來係咁/)
  assert.doesNotMatch(card.text, /[1-5]\s*\/\s*5|星|分[數级]|分數|等級|排名/)
})

test('the migration has only id, payload and created_at, and client roles cannot write', () => {
  const sql = strip(read('supabase/migrations/0036_general_feedback.sql'))
  const body = sql.match(/create table if not exists public\.general_feedback \(([\s\S]*?)\n\);/)
  assert.ok(body)
  assert.match(body![1], /\bid\s+uuid\b/)
  assert.match(body![1], /\bpayload\s+jsonb\b/)
  assert.match(body![1], /\bcreated_at\s+timestamptz\b/)
  assert.doesNotMatch(body![1], /user_id|ip_address|email|cookie/)
  assert.match(sql, /general_feedback_payload_shape/)
  assert.match(sql, /octet_length\(payload::text\) <= 8192/)
  assert.match(sql, /general_feedback_created_idx/)
  assert.match(sql, /created_at desc/)
  assert.match(sql, /enable row level security/)
  assert.match(sql, /revoke all on table public\.general_feedback from public/)
  assert.match(sql, /revoke all on table public\.general_feedback from anon, authenticated/)
  assert.doesNotMatch(sql, /grant\s+(insert|select|update|delete|all)\b/i)
  assert.doesNotMatch(sql, /create policy/)
  assert.doesNotMatch(sql, /for select|for update|for delete|for insert/)
})

test('the route inserts payload only and does not read identity', async () => {
  const route = strip(read('app/api/feedback-general/route.ts'))
  assert.doesNotMatch(route, /cookies\(|headers\.get|x-forwarded-for|x-real-ip|user-agent|getSyncUserId|auth\(/)
  assert.match(route, /parseGeneralFeedback\(read\.value\)/)
  assert.match(route, /insert\(\{ payload: parsed\.value \}\)/)
  assert.match(read('app/feedback/FeedbackClient.tsx'), /\/api\/feedback-general/)
  assert.match(read('app/feedback/FeedbackClient.tsx'), /credentials: 'omit'/)
  const { apiRouteClass, limitForRouteClass } = await import('../rateLimit.ts')
  assert.equal(apiRouteClass('/api/feedback-general'), 'report')
  assert.equal(limitForRouteClass('report').limit, 10)
  assert.deepEqual([...FEATURE_IDS], ['just_one_card', 'error_analysis', 'focus_light', 'quiet_mode', 'emergency_room', 'accessibility'])
  assert.deepEqual([...FEATURE_CHOICES], ['not_tried', 'helped_a_bit', 'very_useful', 'not_for_me'])
  assert.deepEqual([...A11Y_IDS], ['contrast', 'keyboard', 'screen_reader', 'reduced_motion'])
})
