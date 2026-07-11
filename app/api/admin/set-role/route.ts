import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/roles'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

// Admin-only role elevation — the ONLY way a user becomes teacher/admin (adopts the
// spec's CRITICAL finding: no self-serve teacher). Everyone else stays 'student'.
// The FIRST admin must be seeded once directly in SQL (see the migration header).
export const dynamic = 'force-dynamic'

const ROLES = new Set(['student', 'teacher', 'admin'])

export async function POST(req: Request) {
  const admin = await requireRole('admin')
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: { targetUserId?: unknown; role?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }
  const targetUserId = typeof body.targetUserId === 'string' ? body.targetUserId.trim() : ''
  const role = typeof body.role === 'string' ? body.role : ''
  if (!targetUserId || !ROLES.has(role)) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 })
  }

  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: targetUserId, role }, { onConflict: 'user_id' })
    if (error) throw error
    return NextResponse.json({ ok: true, targetUserId, role })
  } catch (e) {
    safeLog('error', 'api/admin/set-role', e)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
