# Vulnerability Tsunami Defence (desktop-isolated)

**Decision:** 2026-11-04 — founder request for a real-time NVD monitoring system for DSE Level Up, running on MacBook Pro desktop automation, **completely isolated** from the official website.

| Item | Value |
|---|---|
| Code | `ops/vuln-tsunami/` |
| Dashboard | `node ops/vuln-tsunami/server.mjs` → **http://127.0.0.1:3005** |
| WAF/EDR stub | `http://127.0.0.1:8765/status` |
| Config | `config.yaml` (from `config.example.yaml`; gitignored) |
| Layers | Ingest 60s · Scoring/LEV · Defense Matrix · ZH translate (MyMemory) |
| MenuBar | `python3 mac/main.py` label **VT** (no emoji) |
| Website coupling | **None** — isolation guard · not port 3001 / not Vercel |
| Cost | NVD + MyMemory free; zero new npm deps; charter §5 OK |

## Why isolated

1. Charter §5 cost lock — do not grow the Vercel/website surface.
2. NVD key must never enter student-facing or Vercel env.
3. Founder desktop agent can notify locally without touching student traffic.

## Rotate key if leaked

If `NVD_API_KEY` appeared in chat, commit, or screenshot: request a new key at https://nvd.nist.gov/developers/request-an-api-key and replace `ops/vuln-tsunami/.env` only.
