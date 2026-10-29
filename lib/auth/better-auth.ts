import 'server-only'
import { betterAuth } from 'better-auth'
import { magicLink } from 'better-auth/plugins'
import { Pool } from 'pg'
import { sendAuthEmail } from '@/lib/auth/sendAuthEmail'

// SERVER-ONLY Better Auth instance. Constructed ONLY when Postgres + secret +
// NEXT_PUBLIC_AUTH_BACKEND=better-auth are present; otherwise null and Auth.js stays live.
// See FLIP-TO-BETTER-AUTH.md and docs/AUTH_ARCHITECTURE.md.
//
// Credentials are read from process.env at runtime — never written to a file.

const connectionString = process.env.DATABASE_URL

export const betterAuthEnabled = Boolean(
  connectionString &&
    process.env.BETTER_AUTH_SECRET &&
    process.env.NEXT_PUBLIC_AUTH_BACKEND === 'better-auth',
)

const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL
const trustedOrigins = [process.env.BETTER_AUTH_URL, process.env.NEXT_PUBLIC_BETTER_AUTH_URL].filter(
  (v): v is string => Boolean(v),
)

const requireEmailVerification = process.env.AUTH_REQUIRE_EMAIL_VERIFICATION === 'true'

const appleId = process.env.APPLE_CLIENT_ID?.trim()
const appleSecret = process.env.APPLE_CLIENT_SECRET?.trim()
const appleEnabled = Boolean(appleId && appleSecret)

export const betterAuthServer = betterAuthEnabled
  ? betterAuth({
      database: new Pool({ connectionString }),
      baseURL,
      trustedOrigins: trustedOrigins.length ? trustedOrigins : undefined,
      emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        autoSignIn: !requireEmailVerification,
        requireEmailVerification,
        revokeSessionsOnPasswordReset: true,
        sendResetPassword: async ({ user, url }) => {
          await sendAuthEmail({
            kind: 'reset_password',
            to: user.email,
            subject: 'DSE Level Up — reset password / 重設密碼',
            url,
          })
        },
      },
      emailVerification: {
        sendOnSignUp: requireEmailVerification,
        sendVerificationEmail: async ({ user, url }) => {
          await sendAuthEmail({
            kind: 'verify_email',
            to: user.email,
            subject: 'DSE Level Up — verify email / 驗證電郵',
            url,
          })
        },
      },
      socialProviders: {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID ?? '',
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET ?? '',
        },
        ...(appleEnabled
          ? {
              apple: {
                clientId: appleId!,
                clientSecret: appleSecret!,
                // App ID / Services ID from Apple Developer; optional appBundleIdentifier for native later
                ...(process.env.APPLE_APP_BUNDLE_IDENTIFIER
                  ? { appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER }
                  : {}),
              },
            }
          : {}),
      },
      plugins: [
        magicLink({
          sendMagicLink: async ({ email, url }) => {
            await sendAuthEmail({
              kind: 'magic_link',
              to: email,
              subject: 'DSE Level Up — sign-in link / 登入連結',
              url,
            })
          },
        }),
      ],
      session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
      rateLimit: { enabled: true, window: 60, max: 30 },
      advanced: { useSecureCookies: process.env.NODE_ENV === 'production' },
    })
  : null

export const auth = betterAuthServer
export const appleSignInConfigured = appleEnabled
