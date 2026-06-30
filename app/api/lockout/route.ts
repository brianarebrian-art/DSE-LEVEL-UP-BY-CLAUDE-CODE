import { NextResponse } from 'next/server'
import { startLockout, verifyUnlock, lockoutServerEnabled } from '@/lib/lockout/serverToken'

// Per-request only — never cached.
export const dynamic = 'force-dynamic'

// POST { action: 'start', questionId } → { enabled, token, expiresAt }
// POST { action: 'verify', token }     → { enabled, unlocked }
// When LOCKOUT_SECRET is unset the route reports { enabled: false } and the client
// falls back to the local timer (fail-open).
export async function POST(request: Request) {
  if (!lockoutServerEnabled) return NextResponse.json({ enabled: false })

  let body: { action?: string; questionId?: string; token?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  if (body.action === 'start' && typeof body.questionId === 'string') {
    return NextResponse.json({ enabled: true, ...startLockout(body.questionId) })
  }
  if (body.action === 'verify' && typeof body.token === 'string') {
    const { valid, expired } = verifyUnlock(body.token)
    return NextResponse.json({ enabled: true, unlocked: valid && expired })
  }
  return NextResponse.json({ error: 'bad request' }, { status: 400 })
}
