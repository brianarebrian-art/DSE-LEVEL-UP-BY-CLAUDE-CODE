import test from 'node:test'
import assert from 'node:assert/strict'
import * as schedulerNs from '../fsrs/scheduler.ts'
import * as bktNs from '../fsrs/bkt.ts'

const fsrs = (schedulerNs as unknown as { default?: typeof schedulerNs }).default ?? schedulerNs
const bkt = (bktNs as unknown as { default?: typeof bktNs }).default ?? bktNs

test('default weights are the published FSRS-5 set of 19', () => {
  assert.equal(fsrs.FSRS5_DEFAULT_WEIGHTS.length, 19)
  assert.equal(fsrs.FSRS5_DEFAULT_WEIGHTS[0], 0.40255)
  assert.equal(fsrs.FSRS5_DEFAULT_WEIGHTS[1], 1.18385)
  assert.equal(fsrs.FSRS5_DEFAULT_WEIGHTS[2], 3.173)
  assert.equal(fsrs.FSRS5_DEFAULT_WEIGHTS[3], 15.69105)
})

test('a new Good rating schedules about three days and is not due immediately', () => {
  const card = fsrs.applyReview(null, 3, 0)
  assert.equal(card.reviews, 1)
  assert.equal(card.elapsedDays, 0)
  assert.equal(fsrs.intervalDays(card.stability), 3)
  assert.equal(fsrs.isDue(0, card.stability), false)
  assert.ok(Math.abs(fsrs.retrievability(card.stability, card.stability) - 0.9) < 1e-9)
})

test('retrievability falls below 0.9 once elapsed days pass stability', () => {
  const card = fsrs.applyReview(null, 3, 0)
  assert.equal(fsrs.isDue(card.stability + 0.1, card.stability), true)
  assert.equal(fsrs.selectDue([{ stability: card.stability, elapsedDays: card.stability + 1 }]).length, 1)
})

test('Again after a gap lowers stability compared with Good', () => {
  const start = fsrs.applyReview(null, 3, 0)
  const again = fsrs.applyReview(start, 1, 4)
  const good = fsrs.applyReview(start, 3, 4)
  assert.ok(again.stability < good.stability)
  assert.equal(again.reviews, 2)
})

test('weights stay on the default set before and after 200 reviews', () => {
  assert.equal(fsrs.weightsForReviewCount(199).reason, 'below-200-reviews')
  assert.equal(fsrs.weightsForReviewCount(200).reason, 'optimizer-not-approved')
  assert.equal(fsrs.weightsForReviewCount(200).personalized, false)
  assert.deepEqual(fsrs.weightsForReviewCount(200).weights, fsrs.FSRS5_DEFAULT_WEIGHTS)
})

test('mastery rises after a correct observation and stays inside 0 to 1', () => {
  const next = bkt.updateMastery(bkt.DEFAULT_BKT.pL0, true)
  assert.ok(next > bkt.DEFAULT_BKT.pL0)
  assert.ok(next <= 1)
  const missed = bkt.updateMastery(bkt.DEFAULT_BKT.pL0, false)
  assert.ok(missed < next)
  assert.ok(missed >= 0)
})
