import test from 'node:test'
import assert from 'node:assert/strict'

/**
 * v6 Spaced repetition schedule calculation helper.
 * Rules:
 * - fail: +1 day retry
 * - skip: treat as fail (+1 day retry, NOT +7 days)
 * - pass progression: +3, +7, +14, +30 days
 */
export function calculateNextReviewInterval(currentIntervalDays: number | null, outcome: 'pass' | 'fail' | 'skip'): number {
  if (outcome === 'fail' || outcome === 'skip') {
    return 1
  }

  // Pass outcome: progress through [3, 7, 14, 30]
  if (currentIntervalDays === null || currentIntervalDays <= 1) {
    return 3
  }
  if (currentIntervalDays === 3) {
    return 7
  }
  if (currentIntervalDays === 7) {
    return 14
  }
  return 30
}

test('Spaced repetition logic: fail or skip always schedules next review for +1 day', () => {
  assert.equal(calculateNextReviewInterval(null, 'fail'), 1, 'First failure schedules +1 day')
  assert.equal(calculateNextReviewInterval(3, 'fail'), 1, 'Failure from 3 days drops to +1 day')
  assert.equal(calculateNextReviewInterval(7, 'fail'), 1, 'Failure from 7 days drops to +1 day')
  assert.equal(calculateNextReviewInterval(14, 'fail'), 1, 'Failure from 14 days drops to +1 day')

  assert.equal(calculateNextReviewInterval(null, 'skip'), 1, 'Skipping initial review schedules +1 day')
  assert.equal(calculateNextReviewInterval(3, 'skip'), 1, 'Skipping 3-day review schedules +1 day (not +7 days)')
  assert.equal(calculateNextReviewInterval(7, 'skip'), 1, 'Skipping 7-day review schedules +1 day')
})

test('Spaced repetition logic: pass advances through +3, +7, +14, +30 days', () => {
  assert.equal(calculateNextReviewInterval(null, 'pass'), 3, 'Initial pass schedules +3 days')
  assert.equal(calculateNextReviewInterval(1, 'pass'), 3, 'Pass from +1 day retry schedules +3 days')
  assert.equal(calculateNextReviewInterval(3, 'pass'), 7, 'Pass from +3 days schedules +7 days')
  assert.equal(calculateNextReviewInterval(7, 'pass'), 14, 'Pass from +7 days schedules +14 days')
  assert.equal(calculateNextReviewInterval(14, 'pass'), 30, 'Pass from +14 days schedules +30 days')
  assert.equal(calculateNextReviewInterval(30, 'pass'), 30, 'Pass from +30 days stays at +30 days')
})
