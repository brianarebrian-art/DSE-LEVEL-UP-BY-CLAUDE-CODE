# Security Policy

## Reporting a vulnerability

Email **dselevelup@gmail.com** with:

- Affected URL or component
- Steps to reproduce (**no** destructive probes against production student data)
- Likely impact on student accounts, progress, or exam integrity

Please **do not** open a public GitHub issue for sensitive findings.

Also see: [https://www.dselevelup.com/.well-known/security.txt](https://www.dselevelup.com/.well-known/security.txt)

Preferred languages: **zh-HK**, English.

## Scope

**In scope:** authentication and sessions, cross-device sync identifiers, account deletion / erasure, API authorization, injection, exposed secrets, unsafe logging of tokens or emails.

**Out of scope without prior written OK:** load-testing production, social-engineering students, accessing other users’ accounts, scraping the full question bank for republication.

## Response targets (best effort)

| Severity | Ack | Next update |
|---|---|---|
| Credential leak / auth bypass | within 24h | Daily until mitigated |
| Student data exposure | within 24h | Daily |
| Lower-risk bug | within 7 days | When patched |

## Our commitments (small team)

- We aim to acknowledge reports and triage as fast as a two-person volunteer project can.
- There is **no paid bug bounty**.
- Responsible disclosure: we prefer coordinated fix before public detail.
- “Fix login / improve security” does **not** mean we will wipe the production database. Data resets need a separate, written founder decision and public notice.
- Playbook: `docs/SECURITY_INCIDENT_RESPONSE.md`.

## For maintainers (short)

- Prefer defence in depth: least privilege keys, scrubbed logs, hashed secrets at rest, size limits on request bodies.
- Never put `service_role` or OAuth client secrets in the browser bundle or public Issues.
