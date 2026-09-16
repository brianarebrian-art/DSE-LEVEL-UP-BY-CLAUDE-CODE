import type { NextConfig } from 'next'

// Security headers (Supabase/Doc-3 P0-2 hardening). Tuned to what this app actually
// loads: self-hosted next/font (Inter) + bundled KaTeX CSS (no font CDN), Google
// avatars over https, and Google OAuth (redirect-based). Supabase is server-only.
//
// CSP keeps 'unsafe-inline' for script/style — Next's bootstrap scripts and KaTeX's
// inline math styles need it (no nonce pipeline here). In dev we additionally allow
// 'unsafe-eval' + ws: so webpack HMR keeps working; production drops both.
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
  // youtube-nocookie: Relax Zone 官方電台 iframe（只在用戶點播時載入，私隱優先）。
  // 用「常規上載影片」ID（非直播）—— 直播 ID 會輪替、結束後變成無法嵌入嘅錄影存檔。
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
  // /admin 隊列喺 request time 用 fs 讀草稿檔 —— 呢啲檔冇被 import，
  // Vercel file tracing 唔會自動打包，要明示 include。
  outputFileTracingIncludes: {
    // SENSEI 知識卡草稿一併 include —— 唔加嘅話 Vercel 上 /admin 只會見到
    // 題目批次，卡片隊列會靜靜地空白（本地開發正常，所以最易走漏）。
    '/admin': ['./scripts/qbank/drafts/*.json', './data/sensei/*/drafts/*.json'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // service worker 腳本唔可以被 CDN／瀏覽器 cache 住：回滾（NEXT_PUBLIC_SW_OFFLINE=0）
      // 同緊急換版本都靠學生部機攞到新嘅 sw.js。瀏覽器本身檢查 SW 更新時會繞過
      // HTTP cache，但 CDN 唔會 —— 明寫 no-cache，唔靠預設。
      { source: '/sw.js', headers: [{ key: 'Cache-Control', value: 'no-cache' }] },
      // The /supermarket/:path* iframe exception (SAMEORIGIN) was removed on 2026-09-16.
      // Its only consumer, the virtual supermarket, was deleted on 2026-09-05 (charter §8.1.1).
      // An unused relaxation of a security header must not remain in place.
    ]
  },
}

export default nextConfig
