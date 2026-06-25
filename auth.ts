import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { resolveIsPremium } from '@/lib/entitlements'

// Auth.js (NextAuth v5). Reads AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and AUTH_SECRET
// from the environment automatically. Without them, the session endpoint simply
// returns no session (the app still runs); sign-in works once the env vars are set.
// JWT session strategy → no database required for login itself. Cross-device
// progress sync (a later phase) will add a database adapter here.

// Expose the premium entitlement on the typed Session. (The JWT already permits
// extra claims via its `Record<string, unknown>` index signature, so `isPremium`
// can live on the token without any further module augmentation.)
declare module 'next-auth' {
  interface Session {
    user: { id?: string; isPremium?: boolean } & DefaultSession['user']
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  trustHost: true,
  callbacks: {
    // Sign-in is OPEN — any Google account may log in. Access level is decided by
    // `isPremium` below: guests and other accounts get the free 4-subject tier;
    // ALLOWED_EMAILS (testers), PREMIUM_EMAILS (paid) and verified @lhymss.net school
    // emails get Premium automatically (no manual approval). To restrict who may sign
    // in again, add a `signIn({ user })` callback that returns false to deny.
    //
    // `isPremium` is recomputed on EVERY token refresh — not just at sign-in — so a
    // server-side entitlement change (e.g. an email added to ALLOWED_EMAILS and the
    // site redeployed) takes effect on the user's next session refresh, with no forced
    // sign-out/in. On the initial sign-in `profile` carries the verified-email flag; on
    // later refreshes we reuse the email already stored on the token. (Google never
    // falsely reports email_verified, so an undefined flag on refresh is safe — see
    // isSchoolEmail.) The server stays the source of truth; the client never decides
    // its own Premium status.
    async jwt({ token, profile }) {
      const p = profile as { email?: string | null; email_verified?: boolean } | undefined
      const email = p?.email ?? token.email
      token.isPremium = resolveIsPremium(email, p?.email_verified)
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // `token.sub` is the user's stable Google account id — the right key for
        // the future paid-entitlements / device-limit database (email can change,
        // the sub does not). Surfacing it now so Stage 2 can rely on it.
        if (token.sub) session.user.id = token.sub
        session.user.isPremium = Boolean(token.isPremium)
      }
      return session
    },
  },
})
