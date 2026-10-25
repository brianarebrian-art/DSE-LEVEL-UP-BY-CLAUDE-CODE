import 'server-only'
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { resolveAuthBackend } from '@/lib/auth/backendSelection'

// This module never selects Better Auth merely because credentials happen to exist.
// Private and public flags must agree; otherwise auth routes fail closed (no fallback).
export const authBackendSelection = resolveAuthBackend(
  process.env.AUTH_BACKEND,
  process.env.NEXT_PUBLIC_AUTH_BACKEND,
)

const connectionString = process.env.DATABASE_URL
const secret = process.env.BETTER_AUTH_SECRET
const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL
const googleClientId = process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET

export const betterAuthConfigured = Boolean(
  authBackendSelection.backend === 'better-auth' &&
  connectionString && secret && baseURL && googleClientId && googleClientSecret,
)
export const betterAuthEnabled = betterAuthConfigured

export const betterAuthServer = betterAuthConfigured
  ? betterAuth({
      database: new Pool({ connectionString: connectionString! }),
      secret,
      baseURL,
      trustedOrigins: [baseURL!],
      // Email/password stays unavailable until a mail provider, verification, reset,
      // and abuse-control flows are configured and separately accepted.
      emailAndPassword: { enabled: false },
      socialProviders: {
        google: { clientId: googleClientId!, clientSecret: googleClientSecret! },
      },
      account: {
        accountLinking: {
          enabled: true,
          disableImplicitLinking: true,
          allowDifferentEmails: false,
        },
      },
      session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
      rateLimit: { enabled: true, window: 60, max: 30 },
      advanced: {
        useSecureCookies: process.env.NODE_ENV === 'production',
        defaultCookieAttributes: {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        },
      },
    })
  : null

// Alias used by the Better Auth CLI. It is non-null only in an explicitly selected,
// fully configured Better Auth task/preview environment.
export const auth = betterAuthServer
