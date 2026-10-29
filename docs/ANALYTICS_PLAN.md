# Analytics plan — privacy-first product learning

## Why

Improve questions and UX without building dossiers on children.

## Collect (whitelist)

Events in `lib/analytics/events.ts`:

- `question_viewed`, `question_answered`, `question_bookmarked`
- `mistake_review_started`, `topic_practice_completed`, `question_reported`
- `login_completed`, `signup_completed`
- `practice_started`, `practice_completed`, `explanation_viewed`, `auth_sync_error`

Payload keys only: subject/topic/question ids, difficulty, correct, elapsedMs, locale, mode, category, sessionSize, coarse platformHint.

Actors: `anonymous_id` (local) and/or `subject_key` from server `getSyncUserId()`.

## Do not collect

ID card, address, school, class, legal name, precise geo, chat raw text, medical/SEN diagnoses, ad click IDs, passwords, tokens, full email inside payload.

## Pipeline

1. Client `trackEvent` → `POST /api/analytics/event` (size-limited).
2. Server validates + scrubs; attaches real subject key if logged in.
3. Insert `analytics_events` (migration `0029`, RLS, no client grants).
4. Views: `v_analytics_topic_practice`, `v_analytics_hard_questions`, `v_question_report_hotspots`.
5. Weekly: `npm run analytics:weekly` → `docs/analytics/weekly-YYYY-MM-DD.md`.

## Existing complementary metrics

Anonymous `practice_counts`, session feedback, Vercel Web Analytics / Speed Insights, Sentry — disclosed on privacy page; not a substitute for the whitelist above.

## Opt-out

`NEXT_PUBLIC_ANALYTICS_EVENTS=false` disables client emission.
