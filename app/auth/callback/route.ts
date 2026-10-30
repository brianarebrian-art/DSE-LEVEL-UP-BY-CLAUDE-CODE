import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { safeInternalPath } from '@/lib/auth/safeRedirect'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/**
 * Supabase Auth OAuth callback: exchange `code` for session cookies,
 * upsert profiles, then redirect to a safe internal path.
 * Legacy progress migration is triggered best-effort (must not block login).
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = safeInternalPath(url.searchParams.get('next'), '/dashboard')
  const origin = url.origin

  if (!code) {
    return NextResponse.redirect(`${origin}/sign-in?error=oauth`)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    safeLog('error', 'auth/callback: missing supabase env')
    return NextResponse.redirect(`${origin}/sign-in?error=oauth`)
  }

  const cookieStore = await cookies()
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options)
        }
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    safeLog('error', 'auth/callback: exchangeCodeForSession failed')
    return NextResponse.redirect(`${origin}/sign-in?error=oauth`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const meta = user.user_metadata ?? {}
    const displayName =
      (meta.full_name as string | undefined) ??
      (meta.name as string | undefined) ??
      null
    const avatarUrl = (meta.avatar_url as string | undefined) ?? null

    const { error: profileErr } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        display_name: displayName,
        email: user.email ?? null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    if (profileErr) {
      safeLog('error', 'auth/callback: profiles upsert failed')
    }

    const { error: learningErr } = await supabase
      .from('learning_profiles')
      .upsert({ user_id: user.id }, { onConflict: 'user_id' })
    if (learningErr) {
      safeLog('error', 'auth/callback: learning_profiles upsert failed')
    }

    // Best-effort legacy migrate — failures must not block sign-in.
    try {
      const migrateUrl = new URL('/api/auth/migrate-legacy', origin)
      await fetch(migrateUrl, {
        method: 'POST',
        headers: {
          cookie: cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join('; '),
        },
      })
    } catch {
      safeLog('error', 'auth/callback: migrate-legacy trigger failed')
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
