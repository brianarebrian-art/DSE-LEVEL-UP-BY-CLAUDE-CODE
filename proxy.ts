import { NextResponse, type NextRequest } from 'next/server'

// API rate limiting (Eric/資安 — $0 方案). In-memory sliding window per IP.
// Next 16 renamed `middleware` → `proxy` (see node_modules/next/dist/docs/…/proxy.md).
//
// HONEST LIMITATION: proxy instances don't share state across edge isolates, so on
// Vercel this is best-effort per-instance throttling — it blunts bursts and naive
// brute force at $0, but is NOT a distributed limiter (that needs KV/Redis, Stage 2).
const WINDOW_MS = 60_000
const LIMIT_GENERAL = 60 // per IP per minute across /api/*
const AUTH_WINDOW_MS = 10 * 60_000
const LIMIT_AUTH = 30 // per IP per 10 min on /api/auth/* (OAuth needs a handful; brute force needs hundreds)

const hits = new Map<string, number[]>()

function allow(key: string, windowMs: number, limit: number): boolean {
  const now = Date.now()
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (list.length >= limit) {
    hits.set(key, list)
    return false
  }
  list.push(now)
  hits.set(key, list)
  // keep the map bounded — prune stale keys occasionally
  if (hits.size > 2000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > AUTH_WINDOW_MS)) hits.delete(k)
  }
  return true
}

export function proxy(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'anon'
  const isAuth = request.nextUrl.pathname.startsWith('/api/auth')
  const ok = isAuth ? allow(`a:${ip}`, AUTH_WINDOW_MS, LIMIT_AUTH) : allow(`g:${ip}`, WINDOW_MS, LIMIT_GENERAL)
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests, please slow down.', code: 'RATE_LIMITED' },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
