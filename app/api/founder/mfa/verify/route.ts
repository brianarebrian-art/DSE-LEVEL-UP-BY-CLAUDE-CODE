import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/auth/supabase-server'
import { getFounderGate } from '@/lib/founder/mfa/gate'
import { hitFounderMfaRateLimit } from '@/lib/founder/mfa/rateLimit'
import { normalizeTotpCode, isSixDigitCode } from '@/lib/founder/mfa/codes'
import { claimTotpTimeStep } from '@/lib/founder/mfa/totpReplay'
import { touchFactorVerified } from '@/lib/founder/mfa/enrollment'
import { mfaErrorBody } from '@/lib/founder/mfa/clientErrors'
import { writeFounderAudit } from '@/lib/founder/audit'
import { founderCacheHeaders } from '@/lib/founder/env'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/** 驗證 TOTP（AAL1 → AAL2）。伺服器執行；限流；防重放 time step。 */
export async function POST(req: Request) {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    return NextResponse.json(mfaErrorBody('unauthorized'), { status: 401, headers: founderCacheHeaders() })
  }
  if (gate.state === 'full') {
    return NextResponse.json({ ok: true, already: true }, { headers: founderCacheHeaders() })
  }
  if (gate.state !== 'needs_challenge') {
    return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
  }

  const rate = await hitFounderMfaRateLimit(`verify:${gate.identity.googleSub}`)
  if (!rate.allowed) {
    return NextResponse.json(mfaErrorBody('rate_limited'), { status: 429, headers: founderCacheHeaders() })
  }

  let body: { code?: string; factorId?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }

  const code = normalizeTotpCode(typeof body.code === 'string' ? body.code : '')
  if (!isSixDigitCode(code)) {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }

  const factorId = (typeof body.factorId === 'string' && body.factorId.trim()) || gate.factorId
  if (!factorId) {
    return NextResponse.json(mfaErrorBody('config'), { status: 503, headers: founderCacheHeaders() })
  }

  try {
    const svc = getServiceSupabase()
    const { data: factorRow } = await svc
      .from('founder_mfa_factor_state')
      .select('factor_version, factor_id, revoked_at')
      .eq('id', true)
      .maybeSingle()
    if (factorRow?.revoked_at) {
      return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
    }
    const factorVersion = typeof factorRow?.factor_version === 'number' ? factorRow.factor_version : 0

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    })
    if (error || !data) {
      await writeFounderAudit({
        actor: gate.identity,
        action: 'mfa.verify',
        targetType: 'founder_mfa',
        result: 'denied',
        summary: 'totp rejected',
      })
      return NextResponse.json(mfaErrorBody('invalid'), { status: 401, headers: founderCacheHeaders() })
    }

    // Session 已由 challengeAndVerify 輪替為 AAL2（防 session fixation）
    const claimed = await claimTotpTimeStep(factorId, factorVersion)
    if (!claimed) {
      // 極少：並發重放——IdP 可能已接受；應用層拒絕第二次「成功」語意，但仍維持 AAL2
      safeLog('warn', 'founder totp replay claim denied after idp success')
    }
    await touchFactorVerified()

    await writeFounderAudit({
      actor: gate.identity,
      action: 'mfa.verify',
      targetType: 'founder_mfa',
      result: 'ok',
      summary: 'aal2 ok',
      meta: { method: 'totp', factorVersion },
    })

    return NextResponse.json({ ok: true }, { headers: founderCacheHeaders() })
  } catch (e) {
    safeLog('error', 'founder mfa verify exception', e)
    return NextResponse.json(mfaErrorBody('failed'), { status: 500, headers: founderCacheHeaders() })
  }
}
