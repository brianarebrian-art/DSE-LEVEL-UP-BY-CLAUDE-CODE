import { NextResponse } from 'next/server'

/** Reject browser requests initiated by a different origin for state-changing APIs. */
export function requireSameOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get('origin')
  if (!origin) return null

  const url = new URL(request.url)
  if (origin !== url.origin) {
    return NextResponse.json({ error: 'cross-site request blocked' }, { status: 403 })
  }
  return null
}
