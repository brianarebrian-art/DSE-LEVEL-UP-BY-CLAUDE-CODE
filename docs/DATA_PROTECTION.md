# Data protection — DSE Level Up

Audience: founders + agents. Users are mostly ages 12–18 in Hong Kong.

## Principles

1. **Data minimisation** — Default account fields: provider user id, email, display name. Learning data: progress, topic stats, electives, reverse-log (answers only after charter §16.E dual-sign). Never school, class, ID card, precise location, medical labels.
2. **Separation** — Auth identity ≠ learning blob ≠ analytics events ≠ support/admin notes.
3. **Least privilege** — Browser never holds `SUPABASE_SERVICE_ROLE_KEY`. User tables: RLS enabled, client grants revoked; server routes bind `user_id` after `getSyncUserId()`.
4. **Encryption** — HTTPS in transit; Supabase/Postgres at rest. High-sensitivity outbox URLs treated as secrets; purge after delivery when ops mature.
5. **No secrets in client** — Only `NEXT_PUBLIC_*` publishable values in the bundle.
6. **Erasure** — `/account` + `DELETE /api/me` clears cloud user-scoped rows and local wipe; document push quirks (unlinked devices).

## Stores

| Store | Contents | Access |
|---|---|---|
| localStorage | Progress, settings, a11y, anonymous analytics id | Device |
| Supabase `user_progress` | Sync snapshot | service_role + session user id |
| `analytics_events` | Whitelisted events | service_role insert |
| `question_reports` | question id + category only | service_role |
| `auth_email_outbox` | Auth mail staging | service_role |
| Sentry | Scrubbed errors (`safeLog` / scrub hooks) | Ops |

## Analytics boundaries

Allowed payload keys only (`lib/analytics/events.ts`). Forbidden: passwords, tokens, full email in payload, chat raw text, SEN diagnostic labels, ad IDs.

## Backup & recovery

- Prefer Supabase dashboard PITR / daily backups on the paid tier if enabled; otherwise document manual `pg_dump` by founders.
- Restore drills: restore to staging, never overwrite prod without written dual approval.
- Least privilege for DB: one founder service role in Vercel; rotate on staff change.
- Auth flip and data wipe are **separate** decisions (`docs/auth/G-B3-WIPE-RUNBOOK-2026-10-29.md`).

## Incident readiness

See `docs/SECURITY_INCIDENT_RESPONSE.md`.
