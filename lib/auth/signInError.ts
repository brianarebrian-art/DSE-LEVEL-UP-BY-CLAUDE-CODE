// What to tell a student when Google sign-in did not complete (UX loop 14, P1-J, 2026-09-30).
//
// auth.ts had no error page, so a cancelled or failed sign-in landed on Auth.js's
// built-in page: English only, no mention that practice works without signing in,
// and no way back to practice. Auth.js now redirects to /sign-in-error?error=<code>.
//
// Only a few codes get their own wording; every other code, or none, gets the general
// message. The raw code is never shown: it is meant for developers, not students.

export type SignInErrorKind = 'denied' | 'service' | 'general'

export function signInErrorKind(code: string | null | undefined): SignInErrorKind {
  if (code === 'AccessDenied') return 'denied'
  if (code === 'Configuration' || code === 'OAuthSignin' || code === 'OAuthCallback' || code === 'CallbackRouteError') return 'service'
  return 'general'
}

export const SIGN_IN_ERROR_COPY: Record<SignInErrorKind, { zh: string; en: string }> = {
  denied: {
    zh: '你取消咗 Google 登入，或者冇畀權限。',
    en: 'Google sign-in was cancelled or permission was not given.',
  },
  service: {
    zh: '登入服務暫時出咗問題，唔係你做錯咗乜。',
    en: 'The sign-in service had a problem. It was not anything you did.',
  },
  general: {
    zh: '登入冇完成。',
    en: 'Sign-in did not finish.',
  },
}
