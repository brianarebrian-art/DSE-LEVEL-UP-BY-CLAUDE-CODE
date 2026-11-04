# Vulnerability Tsunami Defence

Desktop-only NVD real-time monitor for the **DSE Level Up** stack.

**Isolated from the official website.** Never import this into `app/`, never put `NVD_API_KEY` in Vercel, never ship it to `www.dselevelup.com`.

Output follows [i-have-adhd](https://github.com/ayghri/i-have-adhd): action first, numbered steps, max 5 alerts, one next step.

## Open the dashboard (localhost:3005)

1. `cd ops/vuln-tsunami`
2. `cp .env.example .env` then paste `NVD_API_KEY=…`
3. `node server.mjs`
4. Browser: [http://127.0.0.1:3005](http://127.0.0.1:3005)
5. Press **立即掃描**

Binds **127.0.0.1:3005 only**. Not the official site (`:3001` / dselevelup.com).

## CLI + launchd (optional)

1. `node monitor.mjs --hours 24 --notify`
2. `bash mac/install-launchd.sh` — every 30 minutes + Notification Center

## What it watches

| Stack piece | Action when hit |
|---|---|
| Next.js / React | Upgrade packages, `npm test`, redeploy |
| Node.js runtime | Check Vercel + local Node patch level |
| Supabase SDK | Upgrade `@supabase/*`, review Auth/RLS notes |
| Sentry / KaTeX / sharp / Vercel | Upgrade or read the vendor bulletin |

Only **HIGH / CRITICAL / CISA KEV** hits against the watchlist raise an alert.

## Commands

```bash
node server.mjs                   # dashboard → http://127.0.0.1:3005
node monitor.mjs                  # last 24h (default)
node monitor.mjs --hours 72       # wider window
node monitor.mjs --notify         # macOS banner on NEW hits
node monitor.mjs --kev-only       # CISA KEV filter only
node monitor.mjs --json           # machine output for agents
node check-isolation.mjs          # prove website does not import this
bash mac/uninstall-launchd.sh     # stop the agent
```

Exit codes: `0` clear · `2` new actionable alerts · `1` hard failure.

## Isolation rules (do not break)

1. Code lives only under `ops/vuln-tsunami/`
2. Key lives only in `ops/vuln-tsunami/.env` (gitignored)
3. No shared import with the Next.js app
4. No Vercel / Supabase / website env reuse
5. `node check-isolation.mjs` must stay green

## Agent output skill

Project skill copy: `.cursor/skills/i-have-adhd/SKILL.md`  
Upstream: https://github.com/ayghri/i-have-adhd

## Cost

NVD API is free. No new npm dependency. Fits charter §5 (no paid SaaS added).
