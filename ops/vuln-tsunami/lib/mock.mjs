/** Offline fallback CVEs — always tagged [模擬] */
export function mockCves() {
  const now = Date.now()
  return [
    {
      id: 'CVE-SIM-2026-0001',
      published: new Date(now - 3600_000).toISOString(),
      lastModified: new Date(now - 1800_000).toISOString(),
      description:
        '[模擬] Simulated Next.js SSRF in image optimization when remotePatterns are misconfigured.',
      score: 9.1,
      severity: 'CRITICAL',
      kev: false,
      references: ['https://nvd.nist.gov/'],
      simulated: true,
      assetHints: ['next-web', 'vercel-edge'],
    },
    {
      id: 'CVE-SIM-2026-0002',
      published: new Date(now - 7200_000).toISOString(),
      lastModified: new Date(now - 4000_000).toISOString(),
      description:
        '[模擬] Simulated Node.js Brotli decoder overflow affecting unpatched runtimes.',
      score: 9.8,
      severity: 'CRITICAL',
      kev: true,
      references: ['https://nodejs.org/'],
      simulated: true,
      assetHints: ['node-runtime'],
    },
    {
      id: 'CVE-SIM-2026-0003',
      published: new Date(now - 10_800_000).toISOString(),
      lastModified: new Date(now - 9000_000).toISOString(),
      description: '[模擬] Simulated Supabase Auth session fixation under rare race conditions.',
      score: 7.5,
      severity: 'HIGH',
      kev: false,
      references: ['https://supabase.com/'],
      simulated: true,
      assetHints: ['supabase-auth'],
    },
  ]
}

export function mockWafEdrStatus() {
  return {
    ok: true,
    source: 'mock',
    simulated: true,
    waf: { status: 'online', blocked_today: 0, label: '[模擬] WAF' },
    edr: { status: 'standby', isolated_hosts: 0, label: '[模擬] EDR' },
    updatedAt: new Date().toISOString(),
  }
}
