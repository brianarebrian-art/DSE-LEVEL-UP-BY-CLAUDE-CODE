#!/usr/bin/env npx tsx
/**
 * 部署擁有人用：產生 Founder MFA enrollment token。
 *
 * 用法（本機／部署環境，有 service role）：
 *   npx tsx scripts/founder-mfa-enroll-token.mts [--ttl-minutes 30] [--label ops]
 *
 * 原碼只印到 stdout 一次；伺服器只存 SHA-256 雜湊。
 * 唔好把 token 寫入 Git、公開 env、URL 或一般應用日誌。
 *
 * 需要環境變數：
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 * 並已套用 supabase/migrations/0032_founder_mfa.sql
 */

import { createHash, randomBytes } from 'node:crypto'
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

  const ttl = Math.min(Math.max(Number(arg('--ttl-minutes', '30')), 5), 24 * 60)
  const label = (arg('--label', 'deploy-operator') ?? 'deploy-operator').slice(0, 120)
  const note = (arg('--note', '') ?? '').slice(0, 200) || null

  const token = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(token, 'utf8').digest('hex')
  const expiresAt = new Date(Date.now() + ttl * 60_000).toISOString()

  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error } = await supabase.from('founder_mfa_enrollment_tokens').insert({
    token_hash: tokenHash,
    expires_at: expiresAt,
    created_by_label: label,
    note,
  })
  if (error) {
    console.error('Insert failed:', error.message)
    process.exit(1)
  }

  console.log('FOUNDER_MFA_ENROLLMENT_TOKEN (show once; store offline):')
  console.log(token)
  console.log('')
  console.log(`expires_at=${expiresAt}`)
  console.log(`ttl_minutes=${ttl}`)
  console.log('Hash stored in founder_mfa_enrollment_tokens; plaintext is not saved.')
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : 'failed')
  process.exit(1)
})
