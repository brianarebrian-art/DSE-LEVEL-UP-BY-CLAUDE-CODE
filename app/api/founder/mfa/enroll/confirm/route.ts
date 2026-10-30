import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/auth/supabase-server'
import { getFounderGate } from '@/lib/founder/mfa/gate'
import { consumeEnrollmentToken, activateFactorState } from '@/lib/founder/mfa/enrollment'
import {
  consumeRecoverySession,
  createRecoveryCodes,
  getActiveRecoverySession,
} from '@/lib/founder/mfa/recovery'
import { hitFounderMfaRateLimit } from '@/lib/founder/mfa/rateLimit'
import { normalizeTotpCode, isSixDigitCode } from '@/lib/founder/mfa/codes'
import { mfaErrorBody } from '@/lib/founder/mfa/clientErrors'
import { writeFounderAudit } from '@/lib/founder/audit'
import { founderCacheHeaders } from '@/lib/founder/env'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/** 確認 pending TOTP：驗證碼成功 → 原子消耗 token／recovery session → 啟用因素 → 產生復原碼。 */
export async function POST(req: Request) {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    return NextResponse.json(mfaErrorBody('unauthorized'), { status: 401, headers: founderCacheHeaders() })
  }
  if (gate.state === 'full' || gate.state === 'needs_challenge') {
    return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
  }

  const rate = await hitFounderMfaRateLimit(`enroll-confirm:${gate.identity.googleSub}`)
  if (!rate.allowed) {
    return NextResponse.json(mfaErrorBody('rate_limited'), { status: 429, headers: founderCacheHeaders() })
  }

  let body: { factorId?: string; code?: string; enrollmentToken?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }

  const factorId = typeof body.factorId === 'string' ? body.factorId.trim() : ''
  const code = normalizeTotpCode(typeof body.code === 'string' ? body.code : '')
  if (!factorId || factorId.length > 80 || !isSixDigitCode(code)) {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }

  const viaRecovery = gate.state === 'recovery_reenroll'
  if (viaRecovery) {
    const active = await getActiveRecoverySession(gate.identity.googleSub)
    if (!active) {
      return NextResponse.json(mfaErrorBody('expired'), { status: 403, headers: founderCacheHeaders() })
    }
  } else {
    const token = typeof body.enrollmentToken === 'string' ? body.enrollmentToken : ''
    // 確認前再檢查；成功驗證後先消耗
    const { assertEnrollmentTokenValid } = await import('@/lib/founder/mfa/enrollment')
    if (!(await assertEnrollmentTokenValid(token))) {
      return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
    }
  }

  try {
    const supabase = await getSupabaseServer()
    const { data: verified, error } = await supabase.auth.mfa.challengeAndVerify({
      factorId,
      code,
    })
    if (error || !verified) {
      await writeFounderAudit({
        actor: gate.identity,
        action: 'mfa.enroll_confirm',
        targetType: 'founder_mfa',
        result: 'denied',
        summary: 'totp reject on enroll confirm',
      })
      return NextResponse.json(mfaErrorBody('invalid'), { status: 401, headers: founderCacheHeaders() })
    }

    if (viaRecovery) {
      const consumed = await consumeRecoverySession(gate.identity.googleSub)
      if (!consumed) {
        await supabase.auth.mfa.unenroll({ factorId })
        return NextResponse.json(mfaErrorBody('expired'), { status: 403, headers: founderCacheHeaders() })
      }
    } else {
      const token = typeof body.enrollmentToken === 'string' ? body.enrollmentToken : ''
      const consumed = await consumeEnrollmentToken(token)
      if (!consumed) {
        await supabase.auth.mfa.unenroll({ factorId })
        return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
      }
    }

    // 移除其他已驗證 TOTP（單一因素）
    const { data: factors } = await supabase.auth.mfa.listFactors()
    for (const f of factors?.totp ?? []) {
      if (f.id !== factorId && f.status === 'verified') {
        await supabase.auth.mfa.unenroll({ factorId: f.id })
      }
    }

    const version = await activateFactorState(factorId)
    const recoveryCodes = await createRecoveryCodes(version)

    await writeFounderAudit({
      actor: gate.identity,
      action: 'mfa.enroll_confirm',
      targetType: 'founder_mfa',
      result: 'ok',
      summary: 'mfa factor activated',
      meta: { factorVersion: version, viaRecovery },
    })

    return NextResponse.json(
      {
        ok: true,
        factorVersion: version,
        // 復原碼只喺呢個回應出現一次
        recoveryCodes,
      },
      { headers: founderCacheHeaders() },
    )
  } catch (e) {
    safeLog('error', 'founder mfa enroll confirm exception', e)
    return NextResponse.json(mfaErrorBody('failed'), { status: 500, headers: founderCacheHeaders() })
  }
}
