import { test } from 'node:test'
import assert from 'node:assert/strict'

// tsx loads lib/*.ts as CommonJS here, so named exports sit on `default`.
type Mod = typeof import('../analytics/events.ts')
const raw = (await import('../analytics/events.ts')) as Mod & { default?: Mod }
const { parseAnalyticsEvent, scrubPayload, ANALYTICS_EVENT_NAMES } = raw.default ?? raw

test('whitelist includes the required product events', () => {
  for (const n of [
    'question_viewed',
    'question_answered',
    'question_bookmarked',
    'mistake_review_started',
    'topic_practice_completed',
    'question_reported',
    'login_completed',
    'signup_completed',
  ]) {
    assert.ok((ANALYTICS_EVENT_NAMES as readonly string[]).includes(n), n)
  }
})

test('scrubPayload drops email-like and unknown keys', () => {
  const scrubbed = scrubPayload({
    subjectId: 'math',
    email: 'student@school.edu.hk',
    freeText: 'I feel anxious',
    correct: false,
    elapsedMs: 1200,
  })
  assert.deepEqual(scrubbed, { subjectId: 'math', correct: false, elapsedMs: 1200 })
})

test('parseAnalyticsEvent requires a known event and an actor', () => {
  assert.equal(parseAnalyticsEvent({ eventName: 'nope', anonymousId: 'abcdefgh' }).ok, false)
  assert.equal(parseAnalyticsEvent({ eventName: 'login_completed' }).ok, false)
  const ok = parseAnalyticsEvent({
    eventName: 'question_answered',
    anonymousId: 'abcdefghij',
    payload: { questionId: 'math.q1', correct: true, password: 'secret' },
  })
  assert.equal(ok.ok, true)
  if (ok.ok) {
    assert.equal(ok.value.payload.questionId, 'math.q1')
    assert.equal('password' in ok.value.payload, false)
  }
})
