// Content Security Policy for every page (set per request in proxy.ts).
//
// 2026-10-04 (audit #7, founders' reply A7-4 B): script-src no longer allows
// 'unsafe-inline'. Each request gets a fresh nonce; Next.js reads it from the request's
// CSP header and stamps it on its own scripts, and app/layout.tsx stamps it on the
// theme script. An inline script without the nonce does not run, so injected markup
// cannot execute script.
//
// Cost of the change: a nonce only works on a page rendered for that request, so every
// page is now rendered on demand instead of being prebuilt (app/layout.tsx reads the
// request headers, which makes the whole tree dynamic).
//
// style-src keeps 'unsafe-inline': React `style` props and KaTeX output are inline style
// attributes, which a nonce cannot cover. Styles cannot run script.
//
// Development keeps 'unsafe-inline' and adds 'unsafe-eval' for webpack HMR and React's
// error overlay, and sends no nonce (a nonce makes browsers ignore 'unsafe-inline').
// Test the nonce path with a production build (`next build` + `next start`).

/** 128 random bits, base64. Unpredictable and unique per request. */
export function createNonce(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return btoa(String.fromCharCode(...bytes))
}

export function buildCsp(nonce: string | null): string {
  const script = nonce ? `'self' 'nonce-${nonce}'` : "'self' 'unsafe-inline' 'unsafe-eval'"
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${script}`,
    `connect-src 'self' https://*.supabase.co https://accounts.google.com${nonce ? '' : ' ws:'}`,
    // youtube-nocookie: the Relax Zone radio iframe, loaded only when the student presses play.
    "frame-src 'self' https://accounts.google.com https://www.youtube-nocookie.com",
    "form-action 'self' https://accounts.google.com",
  ].join('; ')
}
