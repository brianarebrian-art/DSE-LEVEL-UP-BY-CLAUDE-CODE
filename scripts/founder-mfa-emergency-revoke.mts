#!/usr/bin/env npx tsx
/**
 * 部署擁有人用：緊急撤銷 Founder MFA 因素版本（離線復原第一步）。
 *
 * 會：遞增 factor_version、標記 revoked、作廢未用復原碼。
 * 唔會：自動放行後台、產生萬用碼、提供公開 endpoint。
 *
 * 之後創辦人需：Google 登入 → 新 enrollment token → 重新綁定 TOTP。
 *
 *   npx tsx scripts/founder-mfa-emergency-revoke.mts --reason "lost-phone-no-codes"
 */

import { createClient } from '@supabase/supabase-js'

function arg(name: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(name)
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return fallback
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  const reason = (arg('--reason') ?? '').trim()
  if (!reason || reason.length < 4) {
    console.error('Required: --reason <short-audit-reason>')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: cur, error: readErr } = await supabase
    .from('founder_mfa_factor_state')
    .select('factor_version')
    .eq('id', true)
    .maybeSingle()
  if (readErr) {
    console.error(readErr.message)
    process.exit(1)
  }
  const nextVersion = (cur?.factor_version ?? 0) + 1
  const now = new Date().toISOString()
  const { error } = await supabase.from('founder_mfa_factor_state').upsert({
    id: true,
    factor_id: null,
    factor_version: nextVersion,
    revoked_at: now,
    revoke_reason: reason.slice(0, 200),
    updated_at: now,
  })
  if (error) {
    console.error(error.message)
    process.exit(1)
  }
  await supabase
    .from('founder_mfa_recovery_codes')
    .update({ used_at: now, used_by_sub: 'revoked' })
    .is('used_at', null)

  console.log(`revoked ok; factor_version=${nextVersion}`)
  console.log('Next: issue enrollment token; founder Google sign-in + re-enroll TOTP.')
  console.log('Also unenroll IdP factors via Supabase Dashboard / Admin API if still present.')
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : 'failed')
  process.exit(1)
})
