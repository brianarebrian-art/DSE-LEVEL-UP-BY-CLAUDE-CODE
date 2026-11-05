# Sentry Tunnel Hardening Evidence

- **Date:** 2026-11-05
- **CVE Fixed:** CVE-2026-114139 tunnelRoute bypass
- **Component:** `proxy.ts` (Next.js 16 Request Proxy) & `@sentry/nextjs@10.78.0`

## Hardening Rule
`proxy.ts` strictly validates inbound paths targeting `/monitoring`:
- Allowed: Exact `/monitoring` route (e.g. `/monitoring?o=...&p=...`), passed to Sentry SDK.
- Blocked: Any subpath starting with `/monitoring/` (e.g. `/monitoring/evil-path`, `/monitoring/internal`) is immediately rejected with HTTP `404 Not Found`.

## Automated Test Results
```text
Testing /monitoring/evil-path -> status: 404
Testing /monitoring -> status: 200 has CSP: true
```

## Limitation Notes
Proxy request filtering was verified via NextRequest unit mock execution. Live edge route filtering should be monitored on the Vercel preview deployment.
