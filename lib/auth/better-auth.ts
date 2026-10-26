import 'server-only'
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { resolveAuthBackend } from '@/lib/auth/backendSelection'
import { deploymentTarget, isAllowedSupabaseDatabaseTarget } from '@/lib/supabase/targetPolicy'

// Private and public flags must agree; otherwise auth routes fail closed (no fallback).
export const authBackendSelection = resolveAuthBackend(
  process.env.AUTH_BACKEND,
  process.env.NEXT_PUBLIC_AUTH_BACKEND,
)

const target = deploymentTarget(process.env.VERCEL_ENV)
const projectRef = target === 'preview'
  ? process.env.DSE_PREVIEW_SUPABASE_PROJECT_REF
  : target === 'development'
    ? process.env.DSE_DEVELOPMENT_SUPABASE_PROJECT_REF
    : undefined
const connectionString = target === 'production'
  ? process.env.DATABASE_URL
  : target === 'preview'
    ? process.env.DSE_PREVIEW_DATABASE_URL
    : target === 'development'
      ? process.env.DSE_DEVELOPMENT_DATABASE_URL
      : undefined
const secret = target === 'production'
  ? process.env.BETTER_AUTH_SECRET
  : target === 'preview'
    ? process.env.DSE_PREVIEW_BETTER_AUTH_SECRET
    : target === 'development'
      ? process.env.DSE_DEVELOPMENT_BETTER_AUTH_SECRET
      : undefined
const baseURL = target === 'production'
  ? process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL
  : target === 'preview'
    ? process.env.DSE_PREVIEW_BETTER_AUTH_URL
    : target === 'development'
      ? process.env.DSE_DEVELOPMENT_BETTER_AUTH_URL
      : undefined
const googleClientId = target === 'production'
  ? process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID
  : target === 'preview'
    ? process.env.DSE_PREVIEW_GOOGLE_CLIENT_ID
    : target === 'development'
      ? process.env.DSE_DEVELOPMENT_GOOGLE_CLIENT_ID
      : undefined
const googleClientSecret = target === 'production'
  ? process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET
  : target === 'preview'
    ? process.env.DSE_PREVIEW_GOOGLE_CLIENT_SECRET
    : target === 'development'
      ? process.env.DSE_DEVELOPMENT_GOOGLE_CLIENT_SECRET
      : undefined
const databaseTargetAllowed = isAllowedSupabaseDatabaseTarget(connectionString, target, projectRef)

export const betterAuthConfigured = Boolean(
  authBackendSelection.backend === 'better-auth' &&
  databaseTargetAllowed && connectionString && secret && baseURL && googleClientId && googleClientSecret,
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
// fully configured, environment-isolated task/preview environment.
export const auth = betterAuthServer
