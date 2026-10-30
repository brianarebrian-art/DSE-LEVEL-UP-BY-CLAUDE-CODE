import { NextResponse } from 'next/server'
import { getSupabaseServer } from '@/lib/auth/supabase-server'
import { getFounderGate } from '@/lib/founder/mfa/gate'
import { assertEnrollmentTokenValid } from '@/lib/founder/mfa/enrollment'
import { getActiveRecoverySession } from '@/lib/founder/mfa/recovery'
import { hitFounderMfaRateLimit } from '@/lib/founder/mfa/rateLimit'
import { FOUNDER_MFA_ISSUER, FOUNDER_TOTP_HINT } from '@/lib/founder/mfa/config'
import { mfaErrorBody } from '@/lib/founder/mfa/clientErrors'
import { writeFounderAudit } from '@/lib/founder/audit'
import { founderCacheHeaders } from '@/lib/founder/env'
import { FOUNDER_EMAIL } from '@/lib/auth/founderIdentity'
import { safeLog } from '@/lib/safeLog'

export const dynamic = 'force-dynamic'

/**
 * 開始 TOTP 綁定（Supabase Auth MFA enroll → pending factor）。
 * 需要：創辦人 Google 身份 +（enrollment token 或有效 recovery session）+ 近期登入（enrollment 路徑）。
 * 回傳 factorId、secret、otpauth uri、IdP 產生嘅 SVG QR（唔經第三方 QR API）。
 */
export async function POST(req: Request) {
  const gate = await getFounderGate()
  if (gate.state === 'denied') {
    return NextResponse.json(mfaErrorBody('unauthorized'), { status: 401, headers: founderCacheHeaders() })
  }
  if (gate.state === 'full' || gate.state === 'needs_challenge') {
    return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
  }

  const rate = await hitFounderMfaRateLimit(`enroll:${gate.identity.googleSub}`)
  if (!rate.allowed) {
    return NextResponse.json(mfaErrorBody('rate_limited'), { status: 429, headers: founderCacheHeaders() })
  }

  let body: { enrollmentToken?: string }
  try {
    body = (await req.json()) as { enrollmentToken?: string }
  } catch {
    return NextResponse.json(mfaErrorBody('invalid'), { status: 400, headers: founderCacheHeaders() })
  }

  const viaRecovery = gate.state === 'recovery_reenroll'
  if (viaRecovery) {
    const active = await getActiveRecoverySession(gate.identity.googleSub)
    if (!active) {
      return NextResponse.json(mfaErrorBody('expired'), { status: 403, headers: founderCacheHeaders() })
    }
  } else {
    if (!gate.recentAuth) {
      return NextResponse.json(mfaErrorBody('step_up_required'), { status: 403, headers: founderCacheHeaders() })
    }
    const token = typeof body.enrollmentToken === 'string' ? body.enrollmentToken : ''
    if (!(await assertEnrollmentTokenValid(token))) {
      await writeFounderAudit({
        actor: gate.identity,
        action: 'mfa.enroll_token_reject',
        targetType: 'founder_mfa',
        result: 'denied',
        summary: 'enrollment token invalid or missing',
      })
      return NextResponse.json(mfaErrorBody('forbidden'), { status: 403, headers: founderCacheHeaders() })
    }
  }

  try {
    const supabase = await getSupabaseServer()
    const { getServiceSupabase } = await import('@/utils/supabase/server')
    const { data: factorRow } = await getServiceSupabase()
      .from('founder_mfa_factor_state')
      .select('revoked_at')
      .eq('id', true)
      .maybeSingle()
    const forceReplace = viaRecovery || Boolean(factorRow?.revoked_at)

    // 清掉 pending；復原／撤銷後重綁時亦移除舊 verified TOTP
    const { data: factors } = await supabase.auth.mfa.listFactors()
    const all = [...(factors?.all ?? [])]
    for (const f of all) {
      if (f.factor_type !== 'totp') continue
      if (f.status === 'unverified' || forceReplace) {
        await supabase.auth.mfa.unenroll({ factorId: f.id })
      }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Google Authenticator',
      issuer: FOUNDER_MFA_ISSUER,
    })
    if (error || !data) {
      safeLog('warn', 'founder mfa enroll start failed', error)
      return NextResponse.json(mfaErrorBody('failed'), { status: 500, headers: founderCacheHeaders() })
    }

    await writeFounderAudit({
      actor: gate.identity,
      action: 'mfa.enroll_start',
      targetType: 'founder_mfa',
      result: 'ok',
      summary: viaRecovery ? 'pending enroll via recovery' : 'pending enroll via token',
      meta: { viaRecovery },
    })

    // 唔記 secret／uri／qr 入 log
    return NextResponse.json(
      {
        factorId: data.id,
        // secret／uri 只喺呢個受保護回應出現一次（pending）；確認後唔再回傳
        secret: data.totp.secret,
        uri: data.totp.uri,
        // IdP SVG；前端本地渲染，唔打第三方 QR API
        qrSvg: data.totp.qr_code,
        account: FOUNDER_EMAIL,
        issuer: FOUNDER_MFA_ISSUER,
        hint: FOUNDER_TOTP_HINT,
      },
      { headers: founderCacheHeaders() },
    )
  } catch (e) {
    safeLog('error', 'founder mfa enroll start exception', e)
    return NextResponse.json(mfaErrorBody('failed'), { status: 500, headers: founderCacheHeaders() })
  }
}
