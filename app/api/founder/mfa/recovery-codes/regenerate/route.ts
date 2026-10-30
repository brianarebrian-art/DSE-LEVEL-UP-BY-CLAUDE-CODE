import { NextResponse } from 'next/server'
import { requireFounderApi } from '@/lib/auth/founderAllowlist'
import { requireRecentMfaStepUp } from '@/lib/founder/mfa/stepUp'
import { createRecoveryCodes } from '@/lib/founder/mfa/recovery'
import { getServiceSupabase } from '@/utils/supabase/server'
import { hitFounderMfaRateLimit } from '@/lib/founder/mfa/rateLimit'
import { normalizeTotpCode, isSixDigitCode } from '@/lib/founder/mfa/codes'
import { mfaErrorBody } from '@/lib/founder/mfa/clientErrors'
import { writeFounderAudit } from '@/lib/founder/audit'
import { founderCacheHeaders } from '@/lib/founder/env'
import { getSupabaseServer } from '@/lib/auth/supabase-server'
import { getFounderGate } from '@/lib/founder/mfa/gate'
import { claimTotpTimeStep } from '@/lib/founder/mfa/totpReplay'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/**
 * 重新產生復原碼：需要 full Founder + 近期 MFA（或新 TOTP）。
 * 新碼生效後舊碼全部失效。
 */
export async function POST(req: Request) {
  const founder = await requireFounderApi()
  if (!founder) {
    return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
  }

  const rate = await hitFounderMfaRateLimit(`recovery-regen:${founder.googleSub}`)
  if (!rate.allowed) {
    return NextResponse.json(mfaErrorBody('rate_limited'), { status: 429, headers: founderCacheHeaders() })
  }

  let body: { code?: string; confirm?: boolean }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }
  if (body.confirm !== true) {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }

  const stepUp = await requireRecentMfaStepUp()
  if (!stepUp.ok) {
    const code = normalizeTotpCode(typeof body.code === 'string' ? body.code : '')
    if (!isSixDigitCode(code)) {
      return NextResponse.json(mfaErrorBody('step_up_required'), { status: 403, headers: founderCacheHeaders() })
    }
    const gate = await getFounderGate()
    if (gate.state !== 'full') {
      return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
    }
    try {
      const supabase = await getSupabaseServer()
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: gate.factorId,
        code,
      })
      if (error) {
        return NextResponse.json(mfaErrorBody('invalid'), { status: 401, headers: founderCacheHeaders() })
      }
      await claimTotpTimeStep(gate.factorId, gate.factorVersion)
    } catch (e) {
      safeLog('warn', 'recovery regen step-up failed', e)
      return NextResponse.json(mfaErrorBody('invalid'), { status: 401, headers: founderCacheHeaders() })
    }
  }

  try {
    const svc = getServiceSupabase()
    const { data: row } = await svc
      .from('founder_mfa_factor_state')
      .select('factor_version')
      .eq('id', true)
      .maybeSingle()
    const version = typeof row?.factor_version === 'number' ? row.factor_version : 0
    const codes = await createRecoveryCodes(version)

    await writeFounderAudit({
      actor: founder,
      action: 'mfa.recovery_regen',
      targetType: 'founder_mfa',
      result: 'ok',
      summary: 'recovery codes rotated',
      meta: { factorVersion: version },
    })

    return NextResponse.json({ ok: true, recoveryCodes: codes }, { headers: founderCacheHeaders() })
  } catch (e) {
    safeLog('error', 'recovery regen failed', e)
    return NextResponse.json(mfaErrorBody('failed'), { status: 500, headers: founderCacheHeaders() })
  }
}
