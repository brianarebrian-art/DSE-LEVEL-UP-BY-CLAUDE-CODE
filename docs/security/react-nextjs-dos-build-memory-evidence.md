# React / Next.js Build Memory Evidence (Post-Fix)

- **Branch:** `security/p0-critical-rce-full-fix`
- **Node:** `v22.22.1` (pinned `.nvmrc`: `22.23.4`, `package.json` engines: `>=22.23.4`)
- **npm:** `11.11.0`
- **Next.js:** `16.4.5`
- **React:** `19.2.6`
- **React DOM:** `19.2.6`
- **@sentry/nextjs:** `10.78.0`
- **@supabase/supabase-js:** `2.119.0`
- **sharp:** `0.35.5`
- **Build command:** `NEXT_DISABLE_SOURCEMAP=1 NODE_OPTIONS="--max-old-space-size=4096" npm run build`
- **Result:** Success (Exit code: 0)
- **Memory optimization flag:** `experimental.webpackMemoryOptimizations: true` enabled in `next.config.ts`.
- **Status:** Resolved without OOM crash.

## Verification Details
Production build completed in ~2.2 minutes, compiling 138 static/dynamic routes successfully without Node out-of-memory errors or exit 137.

## Limitation Notes
Build was executed in the local verification sandbox container. Vercel deployment logs and CI execution on `ubuntu-latest-16-cores` runner will be generated upon branch push and pipeline run.
