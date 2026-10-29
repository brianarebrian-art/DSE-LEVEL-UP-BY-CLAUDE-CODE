import { NextResponse } from 'next/server'
import { betterAuthEnabled, betterAuthServer } from '@/lib/auth/better-auth'
import { getSyncUserId } from '@/lib/auth/server'
import { headers } from 'next/headers'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/revoke-sessions — "log out all devices".
 * Better Auth: revoke every server session for the current user.
 * Auth.js (JWT): cannot remote-revoke other devices; returns mode explaining local-only.
 */
export async function POST() {
  if (!betterAuthEnabled || !betterAuthServer) {
    return NextResponse.json({
      ok: false,
      mode: 'next-auth-local-only',
      message:
        'Auth.js JWT sessions cannot be revoked remotely. Sign out on this device; other devices expire with the JWT.',
    })
  }

  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  try {
    const hdrs = await headers()
    await betterAuthServer.api.revokeSessions({ headers: hdrs })
    return NextResponse.json({ ok: true, mode: 'better-auth' })
  } catch (e) {
    safeLog('error', 'api/auth/revoke-sessions', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
