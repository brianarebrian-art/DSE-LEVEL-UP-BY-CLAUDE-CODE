import { NextResponse, type NextRequest } from 'next/server'
import { isAuthSensitivePath } from '@/lib/rateLimit'
import { allowDistributed, getClientIp } from '@/lib/distributedRateLimit'
import { buildCsp, createNonce } from '@/lib/csp'

const LIMIT_MESSAGE = { error: 'Too many requests, please slow down.', code: 'RATE_LIMITED' }

async function rateLimit(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = getClientIp(request)

  // Redis provides shared limits across Vercel isolates. Keep a conservative local
  // fallback only when the integration is not configured in a local environment.
  const bucket = isAuthSensitivePath(pathname) ? 'auth' : pathname === '/api/report' || pathname === '/api/feedback' ? 'report' : pathname === '/api/practice-count' ? 'count' : 'general'
  const ok = await allowDistributed(ip, bucket)

  if (!ok) {
    return NextResponse.json(LIMIT_MESSAGE, {
      status: 429,
      headers: { 'Retry-After': bucket === 'auth' || bucket === 'report' || bucket === 'count' ? '600' : '60' },
    })
  }

  return NextResponse.next()
}

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/api' || pathname.startsWith('/api/')) return rateLimit(request)
  return withCsp(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}

