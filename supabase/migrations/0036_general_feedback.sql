-- 0036 —— 匿名一般意見（general_feedback）
--
-- /feedback 送出嘅情景選擇，同學生自願寫低嘅短句。
-- 欄位只有 id、payload、created_at。冇 user_id、電郵、IP、cookie、裝置。
-- 寫入只經 app/api/feedback-general/route.ts（server-only service role，唔讀 session）。
-- anon、authenticated、public 無任何權限，RLS 開啟且不設 policy，同 0022 session_feedback。

create table if not exists public.general_feedback (
  id uuid primary key default gen_random_uuid(),
  payload jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.general_feedback
  drop constraint if exists general_feedback_payload_shape;

alter table public.general_feedback
  add constraint general_feedback_payload_shape check (
    jsonb_typeof(payload) = 'object'
    and octet_length(payload::text) <= 8192
    and (payload->>'version') = '1'
    and not jsonb_exists_any(payload, array[
      'user_id', 'userId', 'userid', 'uid', 'sub',
      'ip', 'ip_address', 'ipAddress',
      'email', 'email_address',
      'cookie', 'cookies',
      'authorization', 'auth',
      'user_agent', 'userAgent',
      'phone', 'session', 'session_id', 'sessionId',
      'token', 'password', 'name'
    ])
  );

alter table public.general_feedback enable row level security;

revoke all on table public.general_feedback from public;
revoke all on table public.general_feedback from anon, authenticated;

drop policy if exists general_feedback_insert on public.general_feedback;

create index if not exists general_feedback_created_idx
  on public.general_feedback (created_at desc);
