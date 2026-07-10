import type { NextConfig } from 'next'

// Security headers (Supabase/Doc-3 P0-2 hardening). Tuned to what this app actually
// loads: self-hosted next/font (Inter) + bundled KaTeX CSS (no font CDN), Google
// avatars over https, and Google OAuth (redirect-based). Supabase is server-only.
//
// CSP keeps 'unsafe-inline' for script/style — Next's bootstrap scripts, KaTeX's
// inline math styles and framer-motion's inline transforms all need it (no nonce
// pipeline here). In dev we additionally allow 'unsafe-eval' + ws: so webpack HMR
// keeps working; production drops both.
const isDev = process.env.NODE_ENV !== 'production'

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  `connect-src 'self' https://*.supabase.co https://accounts.google.com${isDev ? ' ws:' : ''}`,
  // youtube-nocookie: Relax Zone 的官方 Lo-fi iframe embed（只在用戶點播時載入）
  "frame-src 'self' https://accounts.google.com https://www.youtube-nocookie.com",
  "form-action 'self' https://accounts.google.com",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
