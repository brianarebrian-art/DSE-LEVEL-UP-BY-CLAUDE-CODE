import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import { isSchoolEmail } from '@/lib/entitlements'

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
    // `profile` is only present on the initial sign-in. We compute the entitlement
    // once from the verified Google profile and persist it in the JWT, so every
    // later request carries it cheaply without re-checking. Source of truth is the
    // server — the client never decides its own premium status.
    async jwt({ token, profile }) {
      if (profile) {
        const p = profile as { email?: string | null; email_verified?: boolean }
        token.isPremium = isSchoolEmail(p.email, p.email_verified)
      }
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
