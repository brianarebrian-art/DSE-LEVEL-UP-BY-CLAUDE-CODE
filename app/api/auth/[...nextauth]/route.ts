import { NextRequest, NextResponse } from 'next/server'
import { handlers as nextAuthHandlers } from '@/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { authBackendSelection, betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'

const betterAuthHandlers = betterAuthEnabled && betterAuthServer
  ? toNextJsHandler(betterAuthServer)
  : null

function unavailable() {
  return NextResponse.json({ error: 'authentication-unavailable' }, { status: 503 })
}

export async function GET(request: NextRequest) {
  if (authBackendSelection.backend === 'authjs') return nextAuthHandlers.GET(request)
  if (authBackendSelection.backend === 'better-auth' && betterAuthHandlers) return betterAuthHandlers.GET(request)
  return unavailable()
}

export async function POST(request: NextRequest) {
  if (authBackendSelection.backend === 'authjs') return nextAuthHandlers.POST(request)
  if (authBackendSelection.backend === 'better-auth' && betterAuthHandlers) return betterAuthHandlers.POST(request)
  return unavailable()
}
