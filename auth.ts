import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

// Auth.js (NextAuth v5). Reads AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET and AUTH_SECRET
// from the environment automatically. Without them, the session endpoint simply
// returns no session (the app still runs); sign-in works once the env vars are set.
// JWT session strategy → no database required for login itself. Cross-device
// progress sync (a later phase) will add a database adapter here.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  trustHost: true,
})
