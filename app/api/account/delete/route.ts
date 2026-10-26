import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { createCorrelationId } from '@/lib/api/correlationId'
import { accountDeleteError, type AccountDeleteErrorCode } from '@/lib/api/accountDeleteErrors'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { USER_SCOPED_TABLES, BETTER_AUTH_TABLES } from '@/lib/privacy/userData'
import { betterAuthEnabled, betterAuthServer } from '@/lib/auth/better-auth'

// PDPO erasure right — scoped entirely to the authenticated caller's own stable id.
// Deleting the same user's rows is idempotent, so a partial failure can be retried;
// never report 200 until every required deletion has completed.
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const correlationId = createCorrelationId()
  const fail = (code: AccountDeleteErrorCode) => {
    const result = accountDeleteError(code, correlationId)
    return NextResponse.json(result.body, { status: result.status })
  }

  try {
    const userId = await getSyncUserId()
    if (!userId) return fail('AUTHENTICATION_REQUIRED')

    const read = await readJsonLimited<{ confirm?: unknown }>(req, BODY_LIMIT.small)
    if (!read.ok) return fail(read.status === 413 ? 'REQUEST_TOO_LARGE' : 'INVALID_REQUEST')
    const body = (read.value ?? {}) as { confirm?: unknown }
    if (body.confirm !== true) return fail('CONFIRMATION_REQUIRED')

    const supabase = getServiceSupabase()
    const failed: string[] = []
    for (const table of USER_SCOPED_TABLES) {
      const { error } = await supabase.from(table).delete().eq('user_id', userId)
      // 42P01 = table no longer exists; tolerate as a no-op, but retry any other failure.
      if (error && error.code !== '42P01') failed.push(table)
    }

    // Better Auth records use Better Auth's id/email keys, not the app's stable sync id.
    if (betterAuthEnabled && betterAuthServer) {
      const session = await betterAuthServer.api.getSession({ headers: await headers() })
      const betterAuthUserId = session?.user?.id
      const email = session?.user?.email
      for (const { table, key, of } of BETTER_AUTH_TABLES) {
        const value = of === 'email' ? email : betterAuthUserId
        if (!value) continue
        const { error } = await supabase.from(table).delete().eq(key, value)
        if (error && error.code !== '42P01') failed.push(table)
      }
    }

    if (failed.length > 0) {
      // Intentionally do not pass the table list or any row/provider details to logs.
      safeLog('error', 'api/account/delete partial', { code: 'APP_PARTIAL_FAILURE' }, correlationId)
      return fail('DELETION_INCOMPLETE')
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    safeLog('error', 'api/account/delete', error, correlationId)
    return fail('DELETION_FAILED')
  }
}
