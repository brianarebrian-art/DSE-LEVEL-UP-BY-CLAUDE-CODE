import { NextResponse } from 'next/server'
import { getCurrentProfile } from '@/lib/auth/roles'
import { setConsent } from '@/lib/teacher/classes'
import { safeLog } from '@/lib/safeLog'

// The student sets their OWN consent for a class they've joined. This is the gate that
// decides whether Phase 2 will log their question_events and whether a teacher may see
// their data. A student can only ever change their own enrollment (scoped in setConsent).
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const me = await getCurrentProfile()
  if (!me) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let body: { classId?: unknown; consent?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  const classId = typeof body.classId === 'string' ? body.classId.trim() : ''
  const consent = body.consent === 'granted' || body.consent === 'declined' ? body.consent : null
  if (!classId || !consent) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 })
  }

  try {
    const updated = await setConsent(me.userId, classId, consent)
    if (!updated) return NextResponse.json({ error: 'not enrolled' }, { status: 404 })
    return NextResponse.json({ ok: true, classId, consent })
  } catch (e) {
    safeLog('error', 'api/enrollment/consent', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
