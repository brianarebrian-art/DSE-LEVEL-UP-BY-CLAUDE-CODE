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
    '/admin': ['./scripts/qbank/drafts/*.json'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // 虛擬超市（public/supermarket/**）係一個零依賴靜態頁，由
      // /relax/virtual-supermarket 用【同源】iframe 載入，好等 relax layout
      // 嘅緊急熱線橫幅同「一撳離開」照樣包住佢。
      //
      // 全站預設 X-Frame-Options: DENY + frame-ancestors 'none' 會連同源 iframe
      // 都封死，所以呢條路徑單獨放寬到 SAMEORIGIN / 'self' —— 只准本網域嵌自己，
      // 外站一樣嵌唔到。其餘所有 header（nosniff / HSTS / Referrer-Policy 等）
      // 由上面嗰條規則繼續套用，唔受影響。
      {
        source: '/supermarket/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: csp.replace("frame-ancestors 'none'", "frame-ancestors 'self'"),
          },
        ],
      },
    ]
  },
}

export default nextConfig
