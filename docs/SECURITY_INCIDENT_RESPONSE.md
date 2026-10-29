# Security incident response

Two-person volunteer project. Speed and honesty beat theatre.

## Severity

| Level | Examples | Target ack |
|---|---|---|
| S1 | Service role leak, mass progress wipe, auth bypass | ASAP / same hour |
| S2 | Single-account takeover, XSS with session risk | Same day |
| S3 | Dependency CVE, rate-limit weakness | Next working window |

## Detect

- Sentry alerts (scrubbed)
- Vercel / Supabase anomalous traffic
- Student or researcher email to **dselevelup@gmail.com** / `security.txt`
- CI Dependabot

## Contain

1. Rotate exposed secrets (OAuth, `AUTH_SECRET`, `BETTER_AUTH_SECRET`, service role, VAPID).
2. Revoke Better Auth sessions (`/api/auth/revoke-sessions` or SQL on `session` table after 0027).
3. Disable risky features via env (`NEXT_PUBLIC_AUTH_ENABLED=false`, feature flags) rather than wiping student data.
4. Block abusive IPs via Vercel Firewall when needed.

## Eradicate & recover

- Patch, deploy, verify with tests + staging smoke.
- Restore from backup only with written founder OK and public student notice if learning data affected.
- **Never** treat “fix login” as licence to run `0028` wipe.

## Notify

- Internal: both founders.
- Users: plain-language note on site / IG if personal data or progress integrity impacted.
- Do not publish exploit details in GitHub Issues.

## Post-incident

1. Timeline (UTC + HKT).
2. Root cause + evidence.
3. Fix + regression test.
4. Update this doc / `ENGINEERING_DECISIONS.md` if process changed.

## Contacts

- Security email: dselevelup@gmail.com  
- Public policy: `SECURITY.md`, `public/.well-known/security.txt`
