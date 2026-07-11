import { NextResponse } from 'next/server'
import { getCurrentProfile } from '@/lib/auth/roles'

// Teacher Radar foundation — "who am I + what role". Every teacher/student feature
// starts here. Per-request only; never cached. Returns role only (not the raw account
// id — the client doesn't need its own Google sub).
export const dynamic = 'force-dynamic'

export async function GET() {
  const profile = await getCurrentProfile()
  if (!profile) return NextResponse.json({ authenticated: false, role: null })
  return NextResponse.json({ authenticated: true, role: profile.role })
}
