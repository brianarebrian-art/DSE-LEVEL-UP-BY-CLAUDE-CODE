import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { inspectConfiguredDatabaseUrl } from '@/lib/db/pooler'
import { applyReview, intervalDays, isDue, weightsForReviewCount, type CardState, type FsrsRating } from '@/lib/fsrs/scheduler'
import { updateMastery } from '@/lib/fsrs/bkt'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isRating(value: unknown): value is FsrsRating {
  return value === 1 || value === 2 || value === 3 || value === 4
}

export async function POST(req: Request) {
  const database = inspectConfiguredDatabaseUrl()
  if (!database.ok) {
    return NextResponse.json({ error: 'database-url-refused', mode: database.mode }, { status: 503 })
  }
  const read = await readJsonLimited<Record<string, unknown>>(req, BODY_LIMIT.small)
  if (!read.ok) return NextResponse.json({ error: read.error }, { status: read.status })
  const body = read.value ?? {}
  const rating = body.rating
  const elapsedDays = body.elapsedDays
  const previous = body.previous
  if (!isRating(rating) || typeof elapsedDays !== 'number' || !Number.isFinite(elapsedDays)) {
    return NextResponse.json({ error: 'invalid-review' }, { status: 400 })
  }
  let card: CardState | null = null
  if (previous && typeof previous === 'object') {
    const candidate = previous as Partial<CardState>
    if (
      typeof candidate.stability === 'number' &&
      typeof candidate.difficulty === 'number' &&
      typeof candidate.reviews === 'number'
    ) {
      card = {
        stability: candidate.stability,
        difficulty: candidate.difficulty,
        retrievability: typeof candidate.retrievability === 'number' ? candidate.retrievability : 1,
        reviews: candidate.reviews,
        elapsedDays: typeof candidate.elapsedDays === 'number' ? candidate.elapsedDays : elapsedDays,
      }
    }
  }
  const decision = weightsForReviewCount(card?.reviews ?? 0)
  const next = applyReview(card, rating, elapsedDays, decision.weights)
  const rawMastery = body.mastery
  const prior = typeof rawMastery === 'number' && Number.isFinite(rawMastery) ? rawMastery : 0.3
  const mastery = updateMastery(prior, rating >= 3)
  return NextResponse.json({
    next,
    due: isDue(0, next.stability),
    reviewInDays: intervalDays(next.stability),
    weights: decision,
    mastery,
    persisted: false,
    reason: 'migration-0035-awaiting-founder-approval',
    database: database.mode,
  })
}
