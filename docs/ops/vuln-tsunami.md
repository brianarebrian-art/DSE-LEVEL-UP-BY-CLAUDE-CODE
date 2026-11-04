# Vulnerability Tsunami Defence (desktop-isolated)

**Decision:** 2026-11-04 — founder request for a real-time NVD monitoring system for DSE Level Up, running on MacBook Pro desktop automation, **completely isolated** from the official website.

| Item | Value |
|---|---|
| Code | `ops/vuln-tsunami/` |
| Runtime | MacBook Pro + launchd (every 30 min) |
| Data source | NVD CVE API 2.0 (`apiKey` header) |
| Output style | [i-have-adhd](https://github.com/ayghri/i-have-adhd) |
| Website coupling | **None** — isolation guard: `node ops/vuln-tsunami/check-isolation.mjs` |
| Cost | NVD free tier; zero new npm deps; charter §5 OK |

## Why isolated

1. Charter §5 cost lock — do not grow the Vercel/website surface.
2. NVD key must never enter student-facing or Vercel env.
3. Founder desktop agent can notify locally without touching student traffic.

## Rotate key if leaked

If `NVD_API_KEY` appeared in chat, commit, or screenshot: request a new key at https://nvd.nist.gov/developers/request-an-api-key and replace `ops/vuln-tsunami/.env` only.
