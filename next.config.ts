import type { NextConfig } from 'next'

// Security headers (Supabase/Doc-3 P0-2 hardening).
//
// Content-Security-Policy is not set here. Since 2026-10-04 (audit #7, A7-4 B) it carries a
// per-request nonce, so proxy.ts sets it on every page (policy in lib/csp.ts). A second,
// static CSP here would be enforced alongside it and could only make it stricter or
// contradict it.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  // Do not announce the framework in an X-Powered-By header (audit #8, 2026-10-04).
  poweredByHeader: false,
  // /admin 隊列喺 request time 用 fs 讀草稿檔 —— 呢啲檔冇被 import，
  // Vercel file tracing 唔會自動打包，要明示 include。
  outputFileTracingIncludes: {
    // SENSEI 知識卡草稿一併 include —— 唔加嘅話 Vercel 上 /admin 只會見到
    // 題目批次，卡片隊列會靜靜地空白（本地開發正常，所以最易走漏）。
    '/admin': ['./scripts/qbank/drafts/*.json', './data/sensei/*/drafts/*.json'],
  },
  // RFC 9116 §3: the canonical file lives under /.well-known/; the legacy top-level path may
  // redirect to it. Without this, scanners that only try /security.txt get a 404 (audit #7).
  async redirects() {
    return [{ source: '/security.txt', destination: '/.well-known/security.txt', permanent: true }]
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
