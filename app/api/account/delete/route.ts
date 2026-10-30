import { NextResponse } from 'next/server'
import { BODY_LIMIT, readJsonLimited } from '@/lib/api/readJson'
import { getSyncUserId } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'
import { USER_SCOPED_TABLES, userScopeKey } from '@/lib/privacy/userData'
import {
  makeInternalErasureFailure,
  makePartialErasureFailure,
} from '@/lib/privacy/erasureResponse'

// PDPO erasure right — the signed-in user deletes their OWN server-side data. Scoped
// entirely to the caller's id (never another user's). Server-side data = cloud progress
// = every table in USER_SCOPED_TABLES (lib/privacy/userData.ts). Requires an explicit
// { confirm: true } to avoid misfires.
//
// SEC-R1-003 / FIX-DSE-APP-003: on partial failure the client receives a stable
// error code + correlationId only — never table names, schema, SQL, or stacks.
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const userId = await getSyncUserId()
  if (!userId) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const read = await readJsonLimited<{ confirm?: unknown }>(req, BODY_LIMIT.small)
  if (!read.ok) {
    return NextResponse.json(
      { error: read.status === 413 ? 'body too large' : 'invalid JSON body' },
      { status: read.status },
    )
  }
  const body = (read.value ?? {}) as { confirm?: unknown }
  if (body.confirm !== true) {
    return NextResponse.json({ error: 'confirmation required' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const failed: string[] = []
    for (const table of USER_SCOPED_TABLES) {
      const { error } = await supabase.from(table).delete().eq(userScopeKey(table), userId)
      // 42P01 = undefined_table（表已 drop）→ 當作已清走，唔算失敗。
      if (error && error.code !== '42P01') failed.push(table)
    }

    if (failed.length > 0) {
      const { clientBody, logMessage, logCode } = makePartialErasureFailure(failed)
      safeLog('error', 'api/account/delete partial', { message: logMessage, code: logCode })
      return NextResponse.json(clientBody, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (e) {
    const { clientBody, correlationId } = makeInternalErasureFailure()
    safeLog('error', `api/account/delete cid=${correlationId}`, e)
    return NextResponse.json(clientBody, { status: 500 })
  }
}
