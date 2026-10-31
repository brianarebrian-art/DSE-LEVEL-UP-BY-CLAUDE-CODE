/**
 * Phase 0：檢查環境變數鍵是否存在且非空。
 * 永不印出值。退出碼：缺必備鍵 → 1；只缺建議鍵 → 0（warn）。
 */
const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_AUTH_ENABLED',
  'NEXT_PUBLIC_SENTRY_DSN',
  'ADMIN_EMAILS',
  'FOUNDER_GOOGLE_SUB',
] as const

const RECOMMENDED = [
  'CRON_SECRET',
  'REVIEWER_EMAILS',
  'WALL_SALT',
  'NEXT_PUBLIC_VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY',
  'VAPID_SUBJECT',
] as const

const RETIRED_IF_SET = [
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
  'AUTH_SECRET',
  'AUTH_URL',
  'BETTER_AUTH_SECRET',
  'PREMIUM_EMAILS',
] as const

function present(key: string): boolean {
  const v = process.env[key]
  return typeof v === 'string' && v.trim().length > 0
}

let missingRequired = 0
console.log('=== REQUIRED ===')
for (const key of REQUIRED) {
  const ok = present(key)
  console.log(`${ok ? 'OK  ' : 'MISS'}  ${key}`)
  if (!ok) missingRequired++
}

console.log('=== RECOMMENDED ===')
for (const key of RECOMMENDED) {
  console.log(`${present(key) ? 'OK  ' : 'miss'}  ${key}`)
}

console.log('=== RETIRED (warn if set) ===')
for (const key of RETIRED_IF_SET) {
  if (present(key)) console.log(`WARN  ${key} is set (retired stack; do not rely on it)`)
}

if (missingRequired > 0) {
  console.log(`\n${missingRequired} required key(s) missing in this process env.`)
  process.exit(1)
}
console.log('\nRequired keys present in this process env.')
