# Vercel Build Hardening Evidence (Latest Configuration)

- **Branch:** `security/p0-critical-rce-full-fix`
- **Target Deployment:** Vercel `hkg1`
- **Framework:** `nextjs` (Next.js 16.4.5)
- **Install Command:** `npm ci --ignore-scripts`
- **React Version:** `19.3.1` (Latest Stable)
- **Supabase JS:** `2.119.0` (Latest release)

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
- `NODE_VERSION`: `22.x` (or `26.x` for latest active LTS)
- `NODE_OPTIONS`: `--max-old-space-size=12288`
- Build Machine: 16GB
- Edge / WAF Settings: Rate limit POST 100/min, max request body 1MB.

## Limitation Notes
Vercel dashboard settings (16GB build machine, WAF rate limit) require dashboard administrator access. Local builds compile cleanly with `experimental.webpackMemoryOptimizations: true`.
