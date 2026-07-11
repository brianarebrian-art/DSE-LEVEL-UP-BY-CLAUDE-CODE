import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/roles'
import { createClass, listTeacherClasses } from '@/lib/teacher/classes'
import { safeLog } from '@/lib/safeLog'

// Teacher-only: list / create the caller's own classes. Every query is scoped to
// teacher_id = the caller (no IDOR surface — a teacher only ever sees their own rows).
export const dynamic = 'force-dynamic'

export async function GET() {
  const teacher = await requireRole('teacher')
  if (!teacher) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  try {
    return NextResponse.json({ classes: await listTeacherClasses(teacher.userId) })
  } catch (e) {
    safeLog('error', 'api/teacher/classes GET', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const teacher = await requireRole('teacher')
  if (!teacher) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: { name?: unknown; subject?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const subject = typeof body.subject === 'string' && body.subject.trim() ? body.subject.trim() : null
  if (!name || name.length > 80 || (subject && subject.length > 40)) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 })
  }

  try {
    return NextResponse.json({ class: await createClass(teacher.userId, name, subject) })
  } catch (e) {
    safeLog('error', 'api/teacher/classes POST', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
