-- 0032 —— Founder OS Google Authenticator（TOTP）輔助表
--
-- TOTP secret 由 Supabase Auth MFA 管理，本應用【唔】另存 secret 明文／密文。
-- 本 migration 只存：enrollment token 雜湊、復原碼雜湊、因素版本、限流、審計輔助。
-- 寫入／讀取只經 server-only service role；anon／authenticated 無任何權限。
-- 唔會重置學生／題庫資料。

-- ── Enrollment token（部署擁有人發出；短效、單次、只存雜湊）──────────
create table if not exists public.founder_mfa_enrollment_tokens (
  id              uuid primary key default gen_random_uuid(),
  token_hash      text not null unique check (char_length(token_hash) = 64),
  created_at      timestamptz not null default timezone('utc', now()),
  expires_at      timestamptz not null,
  consumed_at     timestamptz,
  created_by_label text check (created_by_label is null or char_length(created_by_label) <= 120),
  note            text check (note is null or char_length(note) <= 200),
  check (expires_at > created_at)
);

create index if not exists founder_mfa_enroll_tokens_exp_idx
  on public.founder_mfa_enrollment_tokens (expires_at)
  where consumed_at is null;

alter table public.founder_mfa_enrollment_tokens enable row level security;
revoke all on table public.founder_mfa_enrollment_tokens from anon, authenticated;

-- ── MFA 因素版本（重設／緊急撤銷時遞增；舊 Session 因 AAL／版本失效）──
create table if not exists public.founder_mfa_factor_state (
  id                boolean primary key default true check (id),
  factor_id         text check (factor_id is null or char_length(factor_id) <= 80),
  factor_version    integer not null default 0 check (factor_version >= 0),
  enrolled_at       timestamptz,
  last_verified_at  timestamptz,
  last_totp_step    bigint,
  revoked_at        timestamptz,
  revoke_reason     text check (revoke_reason is null or char_length(revoke_reason) <= 200),
  updated_at        timestamptz not null default timezone('utc', now())
);

-- 若表已存在（重跑／熱修），補欄位
alter table public.founder_mfa_factor_state
  add column if not exists last_totp_step bigint;

insert into public.founder_mfa_factor_state (id, factor_version)
values (true, 0)
on conflict (id) do nothing;

alter table public.founder_mfa_factor_state enable row level security;
revoke all on table public.founder_mfa_factor_state from anon, authenticated;

-- ── 復原碼（只存雜湊；原碼只顯示一次）──────────────────────────────
create table if not exists public.founder_mfa_recovery_codes (
  id              uuid primary key default gen_random_uuid(),
  code_hash       text not null unique check (char_length(code_hash) = 64),
  factor_version  integer not null check (factor_version >= 0),
  created_at      timestamptz not null default timezone('utc', now()),
  used_at         timestamptz,
  used_by_sub     text check (used_by_sub is null or char_length(used_by_sub) <= 128)
);

create index if not exists founder_mfa_recovery_unused_idx
  on public.founder_mfa_recovery_codes (factor_version)
  where used_at is null;

alter table public.founder_mfa_recovery_codes enable row level security;
revoke all on table public.founder_mfa_recovery_codes from anon, authenticated;

-- ── 復原工作階段（用復原碼後：受限，必須重新綁定 TOTP）────────────
create table if not exists public.founder_mfa_recovery_sessions (
  id              uuid primary key default gen_random_uuid(),
  session_hash    text not null unique check (char_length(session_hash) = 64),
  google_sub      text not null check (char_length(google_sub) between 1 and 128),
  created_at      timestamptz not null default timezone('utc', now()),
  expires_at      timestamptz not null,
  consumed_at     timestamptz,
  check (expires_at > created_at)
);

alter table public.founder_mfa_recovery_sessions enable row level security;
revoke all on table public.founder_mfa_recovery_sessions from anon, authenticated;

-- ── 共享限流（跨 instance；唔只靠記憶體）──────────────────────────
create table if not exists public.founder_mfa_rate_limits (
  bucket_key      text primary key check (char_length(bucket_key) between 1 and 200),
  window_started  timestamptz not null,
  hit_count       integer not null default 0 check (hit_count >= 0),
  blocked_until   timestamptz,
  updated_at      timestamptz not null default timezone('utc', now())
);

alter table public.founder_mfa_rate_limits enable row level security;
revoke all on table public.founder_mfa_rate_limits from anon, authenticated;

-- 原子遞增限流
create or replace function public.founder_mfa_rate_hit(
  p_key text,
  p_window_ms integer,
  p_limit integer,
  p_block_ms integer
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  now_ts timestamptz := timezone('utc', now());
  win_start timestamptz;
  hits integer;
  blocked timestamptz;
  new_hits integer;
begin
  if p_key is null or char_length(p_key) < 1 or char_length(p_key) > 200 then
    return jsonb_build_object('allowed', false, 'reason', 'bad_key');
  end if;

  select window_started, hit_count, blocked_until
    into win_start, hits, blocked
    from public.founder_mfa_rate_limits
   where bucket_key = p_key
   for update;

  if blocked is not null and blocked > now_ts then
    return jsonb_build_object('allowed', false, 'reason', 'blocked', 'retry_after_ms',
      greatest(0, (extract(epoch from (blocked - now_ts)) * 1000)::integer));
  end if;

  if win_start is null or win_start + (p_window_ms || ' milliseconds')::interval < now_ts then
    win_start := now_ts;
    hits := 0;
  end if;

  new_hits := hits + 1;

  insert into public.founder_mfa_rate_limits as r (bucket_key, window_started, hit_count, blocked_until, updated_at)
  values (
    p_key,
    win_start,
    new_hits,
    case when new_hits >= p_limit then now_ts + (p_block_ms || ' milliseconds')::interval else null end,
    now_ts
  )
  on conflict (bucket_key) do update set
    window_started = excluded.window_started,
    hit_count = excluded.hit_count,
    blocked_until = excluded.blocked_until,
    updated_at = excluded.updated_at;

  if new_hits > p_limit then
    return jsonb_build_object('allowed', false, 'reason', 'rate_limited', 'hits', new_hits);
  end if;
  return jsonb_build_object('allowed', true, 'hits', new_hits);
end;
$$;

revoke all on function public.founder_mfa_rate_hit(text, integer, integer, integer) from public, anon, authenticated;
-- 只准 service role 經 PostgREST 呼叫；應用用 service role client.rpc
grant execute on function public.founder_mfa_rate_hit(text, integer, integer, integer) to service_role;
