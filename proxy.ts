import { NextResponse, type NextRequest } from 'next/server'
import { apiRouteClass, createLimiter, isUnmeteredApiPath, limitForRouteClass } from '@/lib/rateLimit'
import { buildCsp, createNonce } from '@/lib/csp'
import { canonicalSiteRedirectUrl } from '@/lib/site'

// API rate limiting (Eric/資安 — $0 方案). In-memory sliding window per IP + route class.
// Next 16 renamed `middleware` → `proxy` (see node_modules/next/dist/docs/…/proxy.md).
//
// ⚠️ 唔好開 middleware.ts。Next 16.3.2 見到 middleware.ts 同 proxy.ts 同時存在，
//    `next build` 會直接 throw（node_modules/next/dist/build/index.js：
//    "Both middleware file … and proxy file … are detected. Please use … only."）——
//    唔係靜靜哋被忽略，係 build 紅。有人照舊教學開 middleware.ts，會喺 build 嗰刻撞到。
//
// HONEST LIMITATION: proxy instances don't share state across edge isolates, so on
// Vercel this is best-effort per-instance throttling — it blunts bursts and naive
// brute force at $0, but is NOT a distributed limiter (that needs KV/Redis, Stage 2).
//
// v6 Milestone A / D5: school／hostel／subdivided-flat NAT — rate-limit only, never ban.
// Route classes (lib/rateLimit.ts) give sync／practice-count wider buckets so a class
// on one IP is not 429'd by the old single 60/min general bucket.

const AUTH_WINDOW_MS = 10 * 60_000

// 限流本身喺 lib/rateLimit.ts（純函數，有測試；Map 有上限）。
const limiter = createLimiter({ maxKeys: 2000, staleMs: AUTH_WINDOW_MS })

function clientIp(request: NextRequest): string {
  // Prefer the left-most X-Forwarded-For hop when the platform appends; still forgeable
  // if the edge does not overwrite — treat as best-effort identity, never as ban key.
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anon'
  )
}

function rateLimit(request: NextRequest) {
  const ip = clientIp(request)
  const { pathname } = request.nextUrl
  const routeClass = apiRouteClass(pathname)
  const { windowMs, limit } = limitForRouteClass(routeClass)
  const ok = limiter.allow(`${routeClass}:${ip}`, windowMs, limit)
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests, please slow down.', code: 'RATE_LIMITED' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }
  return NextResponse.next()
}

// Pages: a fresh CSP nonce per request (lib/csp.ts; audit #7, founders' reply A7-4 B).
// Next.js reads the nonce from the request's CSP header while rendering; the layout reads
// x-nonce for its own inline script. Both request headers are overwritten here, so a value
// sent by the client is never trusted.
function withCsp(request: NextRequest) {
  const nonce = process.env.NODE_ENV === 'production' ? createNonce() : null
  const csp = buildCsp(nonce)
  const headers = new Headers(request.headers)
  headers.delete('x-nonce')
  if (nonce) headers.set('x-nonce', nonce)
  headers.set('content-security-policy', csp)
  const response = NextResponse.next({ request: { headers } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export function proxy(request: NextRequest) {
  // 生產站舊域／非 www → 永久導向 https://www.dselevelup.com（保留 path／query）
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  const canonical = canonicalSiteRedirectUrl(host, request.url)
  if (canonical) {
    return NextResponse.redirect(canonical, 308)
  }

  const { pathname } = request.nextUrl

  // Hardening for CVE-2026-114139 tunnelRoute bypass:
  // Sentry tunnelRoute uses exact '/monitoring'. Any subpath like '/monitoring/*' must be rejected with 404.
  if (pathname.startsWith('/monitoring/')) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // OAuth callback + migrate: strict auth bucket (see isAuthSensitivePath).
  if (pathname === '/auth/callback' || pathname.startsWith('/auth/callback/')) {
    return rateLimit(request)
  }
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    // 公開健康探測唔計入限流。429 會被 Uptime Kuma 當成服務故障。
    if (isUnmeteredApiPath(pathname)) return NextResponse.next()
    return rateLimit(request)
  }
  return withCsp(request)
}

// Everything except build assets and files with an extension (images, sw.js, robots.txt,
// sitemap.xml, the web manifest, security.txt): those are not HTML and need no nonce.
// Keep /monitoring in the matcher so arbitrary subpaths cannot bypass this proxy. The patched
// Sentry SDK handles only its exact tunnel endpoint; unrelated requests still reach this guard.
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}
