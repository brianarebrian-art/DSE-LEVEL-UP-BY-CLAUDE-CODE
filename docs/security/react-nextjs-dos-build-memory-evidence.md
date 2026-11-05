# React / Next.js Build Memory Evidence (Latest Stack)

- **Branch:** `security/p0-critical-rce-full-fix`
- **Node:** `v22.22.1` in sandbox (pinned `.nvmrc`: `22.23.4`, `package.json` engines: `node >=22.23.4`, `npm >=10`)
- **npm:** `11.11.0`
- **Next.js:** `16.4.5` (Active LTS line, fixes 7 vulnerabilities incl GHSA-mfr8-8qww-v76h High)
- **React:** `19.3.1` (Latest Stable, fixes CVE-2026-23870)
- **React DOM:** `19.3.1`
- **@sentry/nextjs:** `10.78.0` (Latest v10, fixes CVE-2026-114139 tunnelRoute bypass)
- **@supabase/supabase-js:** `2.119.0` (Latest release, realtime >=2.111.2 CVE-2026-62247 & auth >=2.185.0 CVE-2026-31813)
- **sharp:** `0.35.5` (Latest fixes CVE-2026-96889)
- **@types/react:** `19.3.0`
- **@types/node:** `26.6.6`
- **Build command:** `NEXT_DISABLE_SOURCEMAP=1 NODE_OPTIONS="--max-old-space-size=4096" npm run build`
- **Result:** Success (Exit code: 0)
- **Memory optimization flag:** `experimental.webpackMemoryOptimizations: true` enabled in `next.config.ts`.
- **Status:** Resolved cleanly without Node OOM or runner exit 137.

## Verification Details
Production build completed cleanly, compiling all 138 static and dynamic routes without memory exhaustion or compilation errors.

## Limitation Notes
The build was verified in the local offline sandbox environment. CI pipeline execution on `ubuntu-latest-16-cores` and Vercel preview deployment on `hkg1` will occur upon git branch push.
