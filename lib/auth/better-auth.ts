import 'server-only'
import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

// SERVER-ONLY Better Auth instance. It is constructed ONLY when both a Postgres
// connection string and a secret are present in the environment; until then it is
// `null` and the app transparently keeps using Auth.js (see lib/auth/server.ts and the
// /api/auth route). This is what makes the cutover zero-downtime and reversible.
//
// ⚠️ Every credential is read from process.env at runtime — none is ever written to a
// file. Provide them in .env.local / your host's env (see FLIP-TO-BETTER-AUTH.md):
//   DATABASE_URL            — Supabase Postgres connection string (direct, not pooled-only)
//   BETTER_AUTH_SECRET      — random 32+ char secret (read automatically by betterAuth)
//   BETTER_AUTH_URL         — public base URL, e.g. http://localhost:3001 in dev
//   GOOGLE_CLIENT_ID/SECRET — falls back to the existing AUTH_GOOGLE_* so you can reuse
//                             the same Google OAuth app.

const connectionString = process.env.DATABASE_URL

export const betterAuthEnabled = Boolean(connectionString && process.env.BETTER_AUTH_SECRET)

const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL
const trustedOrigins = [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_BETTER_AUTH_URL].filter(
  (v): v is string => Boolean(v),
)

export const betterAuthServer = betterAuthEnabled
  ? betterAuth({
      // A Pool is lazy — it does not open a connection until the first query, so
      // importing this module at build time never needs a live database.
      database: new Pool({ connectionString }),
      baseURL,
      trustedOrigins: trustedOrigins.length ? trustedOrigins : undefined,
      emailAndPassword: { enabled: true, minPasswordLength: 8, autoSignIn: true },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? '',
        },
      },
      session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
      // Security (directive Task 一.4): built-in CSRF via trusted-origin checks, rate
      // limiting on auth endpoints, secure cookies in production only.
      rateLimit: { enabled: true, window: 60, max: 30 },
      advanced: { useSecureCookies: process.env.NODE_ENV === 'production' },
    })
  : null

// Alias for the Better Auth CLI (`npx @better-auth/cli migrate/generate`), which looks
// for an exported `auth`. Non-null only when the env is configured (i.e. when you run
// the migration). See FLIP-TO-BETTER-AUTH.md.
export const auth = betterAuthServer
