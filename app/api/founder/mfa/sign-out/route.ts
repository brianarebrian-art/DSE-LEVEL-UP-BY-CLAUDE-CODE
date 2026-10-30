import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/auth/supabase-server'
import { clearRecoveryCookie } from '@/lib/founder/mfa/recovery'

export const dynamic = 'force-dynamic'

/** MFA／Founder 登出：清除 Supabase session 同 recovery cookie。 */
export async function POST(req: Request) {
  try {
    const supabase = await getSupabaseServer()
    await supabase.auth.signOut()
  } catch {
    /* ignore */
  }
  try {
    await clearRecoveryCookie()
  } catch {
    /* ignore */
  }
  const url = new URL('/founder/mfa/login', req.url)
  return NextResponse.redirect(url, { status: 303 })
}
