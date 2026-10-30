import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth/server'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/**
 * One-shot legacy progress migrate: Google identity `sub` → auth.users.id via
 * auth_identity_map, then best-effort copy from user_progress into learning_progress.
 *
 * Security: session required; legacy_google_sub is NEVER accepted from the client.
 */
export async function POST() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  let service
  try {
    service = getServiceSupabase()
  } catch {
    return NextResponse.json({ ok: false, reason: 'no_service' }, { status: 503 })
  }

  let legacySub: string | null = null
  try {
    const { data: listed, error: listErr } = await service.auth.admin.getUserById(user.id)
    if (!listErr && listed.user?.identities) {
      const g = listed.user.identities.find((i) => i.provider === 'google')
      legacySub =
        g?.id ??
        (typeof g?.identity_data?.sub === 'string' ? g.identity_data.sub : null) ??
        null
    }
  } catch (e) {
    safeLog('error', 'migrate-legacy: getUserById failed', e)
  }

  if (!legacySub || typeof legacySub !== 'string' || legacySub.length > 128) {
    return NextResponse.json({ ok: true, migrated: false, reason: 'no_google_sub' })
  }

  const { data: existing } = await service
    .from('auth_identity_map')
    .select('legacy_google_sub, migrated_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing?.migrated_at) {
    return NextResponse.json({ ok: true, migrated: false, reason: 'already' })
  }

  const { error: mapErr } = await service.from('auth_identity_map').upsert(
    {
      legacy_google_sub: legacySub,
      user_id: user.id,
      source: 'pending',
    },
    { onConflict: 'legacy_google_sub' },
  )
  if (mapErr) {
    safeLog('error', 'migrate-legacy: map upsert failed')
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  const { data: legacyRow } = await service
    .from('user_progress')
    .select('progress_data, updated_at')
    .eq('user_id', legacySub)
    .maybeSingle()

  if (!legacyRow?.progress_data) {
    await service
      .from('auth_identity_map')
      .update({ migrated_at: new Date().toISOString(), source: 'user_progress_empty' })
      .eq('user_id', user.id)
    return NextResponse.json({ ok: true, migrated: true, reason: 'empty' })
  }

  try {
    const blob = legacyRow.progress_data as {
      dse_progress?: Array<{
        subjectId?: string
        score?: number
        total?: number
        timestamp?: number
      }>
    }
    const attempts = Array.isArray(blob?.dse_progress) ? blob.dse_progress : []
    const bySubject = new Map<string, { correct: number; total: number; last: number }>()
    for (const a of attempts) {
      if (!a?.subjectId || typeof a.subjectId !== 'string') continue
      const cur = bySubject.get(a.subjectId) ?? { correct: 0, total: 0, last: 0 }
      cur.correct += Number(a.score) || 0
      cur.total += Number(a.total) || 0
      cur.last = Math.max(cur.last, Number(a.timestamp) || 0)
      bySubject.set(a.subjectId, cur)
    }
    for (const [subjectId, s] of bySubject) {
      await service.from('learning_progress').upsert(
        {
          user_id: user.id,
          subject_id: subjectId,
          topic_id: null,
          status: s.total > 0 ? 'in_progress' : 'not_started',
          correct_count: Math.max(0, Math.min(s.correct, s.total)),
          attempt_count: Math.max(0, s.total),
          last_practiced_at: s.last > 0 ? new Date(s.last).toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,subject_id,topic_id' },
      )
    }
  } catch (e) {
    safeLog('error', 'migrate-legacy: parse/write failed', e)
  }

  await service
    .from('auth_identity_map')
    .update({ migrated_at: new Date().toISOString(), source: 'user_progress' })
    .eq('user_id', user.id)

  return NextResponse.json({ ok: true, migrated: true })
}
