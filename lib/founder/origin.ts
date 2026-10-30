import 'server-only'

/**
 * 寫入操作 Origin／CSRF 防護（配合 SameSite cookie）。
 * Auth.js／Better Auth cookie 已 HttpOnly；呢度再要求同源 Origin 或 Referer。
 */
export function assertSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')
  if (!host) return false

  const allowed = new Set<string>()
  const proto = request.headers.get('x-forwarded-proto') || 'https'
  allowed.add(`${proto}://${host}`)
  // 本機 dev
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    allowed.add(`http://${host}`)
    allowed.add(`https://${host}`)
  }
  if (process.env.BETTER_AUTH_URL) allowed.add(process.env.BETTER_AUTH_URL.replace(/\/$/, ''))
  if (process.env.AUTH_URL) allowed.add(process.env.AUTH_URL.replace(/\/$/, ''))
  if (process.env.NEXT_PUBLIC_SITE_URL) allowed.add(process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ''))

  if (origin) {
    try {
      const o = new URL(origin).origin
      return [...allowed].some((a) => a === o)
    } catch {
      return false
    }
  }
  if (referer) {
    try {
      const r = new URL(referer).origin
      return [...allowed].some((a) => a === r)
    } catch {
      return false
    }
  }
  // 無 Origin／Referer：非瀏覽器簡單請求可能冇；對 state-changing 拒絕。
  return false
}
