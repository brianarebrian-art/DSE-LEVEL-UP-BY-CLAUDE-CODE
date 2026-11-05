# Vercel Build Hardening Evidence

- **Branch:** `security/p0-critical-rce-full-fix`
- **Target Deployment:** Vercel `hkg1`
- **Framework:** `nextjs` (Next.js 16.4.5)
- **Install Command:** `npm ci --ignore-scripts`

## Configured Hardening (`vercel.json`)
```json
{
  "framework": "nextjs",
  "installCommand": "npm ci --ignore-scripts",
  "regions": ["hkg1"],
  "crons": [
    { "path": "/api/cron/exam-day-nudge", "schedule": "0 14 * * *" },
    { "path": "/api/cron/exam-day-nudge", "schedule": "30 22 * * *" }
  ]
}
```

## Dashboard Requirements
- `NODE_VERSION`: `22.x`
- `NODE_OPTIONS`: `--max-old-space-size=12288`
- Build Machine: 16GB
- Edge / WAF Settings: Rate limit POST 100/min, max request body 1MB.

## Limitation Notes
Build machine settings and Vercel WAF limits require confirmation in the Vercel project dashboard. Local build verification passed cleanly with `experimental.webpackMemoryOptimizations: true`.
