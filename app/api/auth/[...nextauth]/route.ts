import { handlers as nextAuthHandlers } from '@/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'

// Single /api/auth/* mount that serves the ACTIVE backend: Better Auth once it is
// configured (DATABASE_URL + BETTER_AUTH_SECRET present), otherwise the existing
// Auth.js Google handler. Both libraries route off the request URL, so the catch-all
// segment name is irrelevant — flipping the backend needs no route change, just env.
const betterAuthHandlers =
  betterAuthEnabled && betterAuthServer ? toNextJsHandler(betterAuthServer) : null

export const GET = betterAuthHandlers ? betterAuthHandlers.GET : nextAuthHandlers.GET
export const POST = betterAuthHandlers ? betterAuthHandlers.POST : nextAuthHandlers.POST
