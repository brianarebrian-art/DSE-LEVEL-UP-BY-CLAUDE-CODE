import NextAuth, { type DefaultSession } from 'next-auth'
import Google from 'next-auth/providers/google'

// Auth.js (NextAuth v5). Reads AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and AUTH_SECRET
// from the environment automatically. Without them, the session endpoint simply
// returns no session (the app still runs); sign-in works once the env vars are set.
// JWT session strategy → no database required for login itself.
//
// Sign-in is OPEN and grants NO special access — the platform is 100% free for
// everyone. Google login exists only so a user can sync their progress across
// devices (see lib/sync.ts); `session.user.id` is the stable account key for that.

declare module 'next-auth' {
  interface Session {
    user: { id?: string } & DefaultSession['user']
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  trustHost: true,
  callbacks: {
    async session({ session, token }) {
      // `token.sub` is the user's stable Google account id — the key used to scope
      // their synced progress (email can change, the sub does not).
      if (session.user && token.sub) session.user.id = token.sub
      return session
    },
  },
})
