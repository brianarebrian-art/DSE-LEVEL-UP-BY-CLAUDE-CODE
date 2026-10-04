import { NextResponse, type NextRequest } from 'next/server'
import { createLimiter, isAuthSensitivePath } from '@/lib/rateLimit'
import { buildCsp, createNonce } from '@/lib/csp'

// API rate limiting (Eric/資安 — $0 方案). In-memory sliding window per IP.
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
const WINDOW_MS = 60_000
const LIMIT_GENERAL = 60 // per IP per minute across /api/*
const AUTH_WINDOW_MS = 10 * 60_000
const LIMIT_AUTH = 30 // per IP per 10 min on /api/auth/* (OAuth needs a handful; brute force needs hundreds)

// 限流本身喺 lib/rateLimit.ts（純函數，有測試；Map 有上限）。
const limiter = createLimiter({ maxKeys: 2000, staleMs: AUTH_WINDOW_MS })

function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anon'
  // 嚴格桶只覆蓋暴力破解面 —— 邊啲路徑、點解 session 唔包，見 lib/rateLimit.ts
  // isAuthSensitivePath 嘅註釋。
  const { pathname } = request.nextUrl
  const isAuthSensitive = isAuthSensitivePath(pathname)
  const ok = isAuthSensitive
    ? limiter.allow(`a:${ip}`, AUTH_WINDOW_MS, LIMIT_AUTH)
    : limiter.allow(`g:${ip}`, WINDOW_MS, LIMIT_GENERAL)
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
  const { pathname } = request.nextUrl
  if (pathname === '/api' || pathname.startsWith('/api/')) return rateLimit(request)
  return withCsp(request)
}

// Everything except build assets and files with an extension (images, sw.js, robots.txt,
// sitemap.xml, the web manifest, security.txt): those are not HTML and need no nonce.
export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}
