/**
 * 應用程式日常讀寫走 Supabase HTTPS，不佔用 Postgres 連線。
 * 若日後設定 DATABASE_URL 或 POSTGRES_URL，只接受 transaction pooler 的 6543。
 */

export type PoolerMode = 'unset' | 'transaction' | 'direct' | 'session-pooler' | 'invalid'

export type PoolerCheck = {
  ok: boolean
  mode: PoolerMode
}

export function inspectDatabaseUrl(url: string | undefined | null): PoolerCheck {
  if (!url) return { ok: true, mode: 'unset' }
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { ok: false, mode: 'invalid' }
  }
  const port = parsed.port || (parsed.protocol.startsWith('postgres') ? '5432' : '')
  const host = parsed.hostname
  if (port === '6543' && host.includes('pooler.supabase.com')) {
    return { ok: true, mode: 'transaction' }
  }
  if (port === '5432' && host.startsWith('db.')) return { ok: false, mode: 'direct' }
  if (port === '5432') return { ok: false, mode: 'session-pooler' }
  return { ok: false, mode: 'invalid' }
}

export function inspectConfiguredDatabaseUrl(): PoolerCheck {
  return inspectDatabaseUrl(process.env.DATABASE_URL || process.env.POSTGRES_URL)
}
