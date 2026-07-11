import { NextResponse } from 'next/server'
import { getCurrentProfile } from '@/lib/auth/roles'
import { joinByCode } from '@/lib/teacher/classes'
import { safeLog } from '@/lib/safeLog'

// Any authenticated user joins a class by its code (a capability token). Enrolling
// starts consent at 'pending' — NO data is collected and the teacher sees NOTHING
// until the student grants consent via /api/enrollment/consent (privacy invariant).
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const me = await getCurrentProfile()
  if (!me) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: { joinCode?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  const code = typeof body.joinCode === 'string' ? body.joinCode.trim().toUpperCase() : ''
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    return NextResponse.json({ error: 'invalid code' }, { status: 400 })
  }

  try {
    const result = await joinByCode(me.userId, code)
    if (!result) return NextResponse.json({ error: 'class not found' }, { status: 404 })
    return NextResponse.json({ ...result, consentRequired: true })
  } catch (e) {
    safeLog('error', 'api/student/join', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
