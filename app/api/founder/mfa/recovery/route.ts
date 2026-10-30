import { NextResponse } from 'next/server'
import { getFounderGate } from '@/lib/founder/mfa/gate'
import { consumeRecoveryCode } from '@/lib/founder/mfa/recovery'
import { hitFounderMfaRateLimit } from '@/lib/founder/mfa/rateLimit'
import { mfaErrorBody } from '@/lib/founder/mfa/clientErrors'
import { writeFounderAudit } from '@/lib/founder/audit'
import { founderCacheHeaders } from '@/lib/founder/env'
import { getSupabaseServer } from '@/lib/auth/supabase-server'
import { revokeFactorState } from '@/lib/founder/mfa/enrollment'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/**
 * 用復原碼進入受限 recovery session。
 * 必須已通過創辦人 Google 身份；成功後撤銷舊因素版本並要求重新綁定。
 */
export async function POST(req: Request) {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    return NextResponse.json(mfaErrorBody('unauthorized'), { status: 401, headers: founderCacheHeaders() })
  }
  // full 亦可用復原碼做緊急重綁（先 step-down）
  if (gate.state === 'needs_enroll' && !('identity' in gate)) {
    return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
  }

  const identity = gate.identity
  const rate = await hitFounderMfaRateLimit(`recovery:${identity.googleSub}`)
  if (!rate.allowed) {
    return NextResponse.json(mfaErrorBody('rate_limited'), { status: 429, headers: founderCacheHeaders() })
  }

  let body: { code?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }

  const raw = typeof body.code === 'string' ? body.code : ''
  const result = await consumeRecoveryCode(identity, raw)
  if (!result.ok) {
    await writeFounderAudit({
      actor: identity,
      action: 'mfa.recovery',
      targetType: 'founder_mfa',
      result: 'denied',
      summary: 'recovery code rejected',
    })
    return NextResponse.json(mfaErrorBody('invalid'), { status: 401, headers: founderCacheHeaders() })
  }

  try {
    // 撤銷舊因素版本；unenroll IdP factors
    await revokeFactorState('recovery_code_used')
    const supabase = await getSupabaseServer()
    const { data: factors } = await supabase.auth.mfa.listFactors()
    for (const f of [...(factors?.totp ?? []), ...(factors?.all ?? [])]) {
      if (f.factor_type === 'totp') {
        try {
          await supabase.auth.mfa.unenroll({ factorId: f.id })
        } catch {
          /* continue */
        }
      }
    }

    await writeFounderAudit({
      actor: identity,
      action: 'mfa.recovery',
      targetType: 'founder_mfa',
      result: 'ok',
      summary: 'recovery session started; reenroll required',
    })

    return NextResponse.json(
      { ok: true, next: '/founder/mfa/enroll' },
      { headers: founderCacheHeaders() },
    )
  } catch (e) {
    safeLog('error', 'founder mfa recovery exception', e)
    return NextResponse.json(mfaErrorBody('failed'), { status: 500, headers: founderCacheHeaders() })
  }
}
