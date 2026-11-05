# Sentry Tunnel Hardening Evidence

- **Date:** 2026-11-03
- **CVE Fixed:** CVE-2026-114139 tunnelRoute bypass
- **Component:** `proxy.ts` (Next.js 16 Request Proxy) & `@sentry/nextjs@10.78.0`

## Hardening Rule
`proxy.ts` strictly validates inbound paths targeting `/monitoring`:
- Allowed: Exact `/monitoring` route (e.g. `/monitoring?o=...&p=...`), routed to Sentry SDK endpoint.
- Blocked: Any subpath starting with `/monitoring/` (e.g. `/monitoring/evil-path`, `/monitoring/internal`) is immediately terminated with HTTP `404 Not Found`.

## Automated Test Results
```text
Testing /monitoring/evil-path -> status: 404
Testing /monitoring -> status: 200 has CSP: true
```

## Limitation Notes
Proxy unit verification was performed locally via NextRequest mock execution. Live end-to-end edge verification should be confirmed on Vercel preview deployment.
