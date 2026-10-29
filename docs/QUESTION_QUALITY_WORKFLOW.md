# Question quality workflow

## Student report (live)

- UI: `ReportQuestionButton` → `POST /api/report`
- Storage: `question_reports` — **question id + category + locale only** (no free-text, no user id)
- Charter §16.E: student prose stays in their own email if they choose to write more

## Admin triage (new)

- UI: `/admin/reports` (ADMIN_EMAILS)
- Statuses: `new` / `triaged` / `ai_drafted` / `human_review` / `fixed` / `rejected` (legacy `open` accepted)
- Actions: triage, create AI draft stub, mark fixed/rejected
- Priority score 0–100

## AI assist (human-gated)

1. Admin creates row in `question_revisions` (`ai_drafted` or `human_review`).
2. Diff + rationale in `diff_json` — never student PII.
3. Human **approve** → `approved` (still **not** auto-published to the bank).
4. Publish remains a separate git / `promote-drafts` / sync-questions step by founders.
5. Reject → `rejected`.

Constraint in SQL: `published` requires `reviewed_at` — and API never sets `published` in the approve path today (approve → `approved` only). This prevents silent AI publish.

## Related systems

- `/admin/quality` + `dse_question_quality_reviews` (rubric scoring, curriculum frameworks)
- Offline parametric drafts under `scripts/qbank/`
- Runbook: `docs/qbank/AI-ASSIST-OPTIMIZATION-RUNBOOK.md`

## Quality metrics (ops)

- Time-to-triage (created_at → triaged_at)
- Draft acceptance (approved / ai_drafted)
- Re-report rate after fixed (same question_id)
- Hotspots view `v_question_report_hotspots`
