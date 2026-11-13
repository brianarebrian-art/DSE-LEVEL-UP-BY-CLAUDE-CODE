// Anonymous /feedback. Only a scenario payload is stored. Nothing identifies a student.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { parseGeneralFeedback, reflectionCard, FEATURE_IDS, FEATURE_CHOICES, FEATURE_LABEL, A11Y_IDS, COMFORT_DURING_QUESTION, WOM_DESCRIBE_LABEL } = await import('../generalFeedback.ts')
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
    comfort: { after_wrong: [], note: '' },
    word_of_mouth: { describe: [], change: '' },
    aha: { had_moment: true, text: '原來係咁' },
    locale: 'zh',
  })
  assert.equal(JSON.stringify(r.value).includes('student-1'), false)
  assert.equal(JSON.stringify(r.value).includes('a@b.com'), false)
  assert.equal(JSON.stringify(r.value).includes('secret'), false)
})

test('numeric ratings are rejected and a blank form still submits', () => {
  assert.equal(parseGeneralFeedback({ features: { focus_light: 5 } }).ok, false)
  assert.equal(parseGeneralFeedback({ features: { focus_light: '5' } }).ok, false)
  assert.equal(parseGeneralFeedback({ comfort: { during: 3 } }).ok, false)
  assert.equal(parseGeneralFeedback({ comfort: { during: '5' } }).ok, false)
  const blank = parseGeneralFeedback({})
  assert.equal(blank.ok, true)
  if (!blank.ok) return
  assert.equal(blank.value.accessibility.note, '')
  assert.equal(blank.value.aha.text, '')
  assert.equal(blank.value.comfort.note, '')
  assert.equal(blank.value.word_of_mouth.change, '')
  assert.equal(JSON.stringify(blank.value).includes('rating'), false)
  const whitespace = parseGeneralFeedback({ aha: { had_moment: false, text: '   ' } })
  assert.equal(whitespace.ok, true)
  if (!whitespace.ok) return
  assert.equal(whitespace.value.aha.text, '')
  assert.equal(parseGeneralFeedback({ features: { just_one_card: 'not_tried' } }).ok, true)
})

test('comfort and word of mouth stay optional and are not scores', () => {
  const filled = parseGeneralFeedback({
    email: 'a@b.com',
    ip: '1.2.3.4',
    userId: 'student-1',
    comfort: {
      during: 'at_ease',
      after_wrong: ['useful_next', 'uncomfortable_labelled', 'useful_next'],
      note: '個「再試一次」 a@b.com',
    },
    word_of_mouth: {
      recommend: 'if_asked',
      describe: ['free_no_login', 'other'],
      other: '字太細',
      change: '解析短少少',
    },
    accessibility: { note: '' },
    aha: { text: '' },
  })
  assert.ok(filled.ok)
  if (!filled.ok) return
  assert.deepEqual(filled.value.comfort, {
    during: 'at_ease',
    after_wrong: ['useful_next', 'uncomfortable_labelled'],
    note: '個「再試一次」',
  })
  assert.deepEqual(filled.value.word_of_mouth, {
    recommend: 'if_asked',
    describe: ['free_no_login', 'other'],
    other: '字太細',
    change: '解析短少少',
  })
  assert.equal(filled.value.accessibility.note, '')
  assert.equal(filled.value.aha.text, '')
  assert.equal(JSON.stringify(filled.value).includes('a@b.com'), false)
  assert.equal(JSON.stringify(filled.value).includes('student-1'), false)

  const otherHidden = parseGeneralFeedback({
    word_of_mouth: { describe: ['gentler_mood'], other: '唔應該出現' },
  })
  assert.ok(otherHidden.ok)
  if (!otherHidden.ok) return
  assert.equal(otherHidden.value.word_of_mouth.other, undefined)
  assert.deepEqual(otherHidden.value.word_of_mouth.describe, ['gentler_mood'])

  const card = reflectionCard(filled.value, 'zh')
  assert.doesNotMatch(card.text, /[1-5]\s*\/\s*5|星|分[數级]|分數|等級|排名/)
  assert.match(card.text, /幾放鬆，繼續得/)
  assert.match(card.text, /字太細/)
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

test('the migration has only id, payload and created_at, and is insert-only', () => {
  const sql = strip(read('supabase/migrations/0036_general_feedback.sql'))
  const body = sql.match(/create table if not exists public\.general_feedback \(([\s\S]*?)\n\);/)
  assert.ok(body)
  assert.match(body![1], /\bid\s+uuid\b/)
  assert.match(body![1], /\bpayload\s+jsonb\b/)
  assert.match(body![1], /\bcreated_at\s+timestamptz\b/)
  assert.doesNotMatch(body![1], /user_id|ip_address|email|cookie/)
  assert.match(sql, /enable row level security/)
  assert.match(sql, /grant insert on table public\.general_feedback to anon, authenticated/)
  assert.match(sql, /for insert/)
  assert.doesNotMatch(sql, /for select|for update|for delete/)
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
  assert.equal(FEATURE_LABEL.emergency_room.zh, '溫習支援')
  assert.equal(COMFORT_DURING_QUESTION.zh, '答緊題／睇完結果嗰陣，你多啲係？（單選）')
  assert.equal(WOM_DESCRIBE_LABEL.gentler_mood.zh, '氣氛溫和啲')
  const client = read('app/feedback/FeedbackClient.tsx')
  assert.match(client, /id="feedback-a11y-note"/)
  assert.match(client, /name=\{id\}/)
  assert.match(client, /htmlFor=\{id\}/)
  assert.match(client, /id="feedback-aha-note"/)
  assert.match(client, /id="feedback-comfort-note"/)
  assert.match(client, /id="feedback-wom-other"/)
  assert.match(client, /id="feedback-return-note"/)
  assert.match(client, /focus-visible:outline/)
  assert.doesNotMatch(client, /醫院|考試急症室|嗎陣|氛圍溫和啲|[★☆]|1–5|1-5/)
  assert.doesNotMatch(read('lib/generalFeedback.ts'), /考試急症室|嗎陣|氛圍溫和啲/)
  assert.doesNotMatch(read('app/feedback/page.tsx'), /考試急症室/)
  assert.deepEqual([...FEATURE_IDS], ['just_one_card', 'error_analysis', 'focus_light', 'quiet_mode', 'emergency_room', 'accessibility'])
  assert.deepEqual([...FEATURE_CHOICES], ['not_tried', 'helped_a_bit', 'very_useful', 'not_for_me'])
  assert.deepEqual([...A11Y_IDS], ['contrast', 'keyboard', 'screen_reader', 'reduced_motion'])
})
