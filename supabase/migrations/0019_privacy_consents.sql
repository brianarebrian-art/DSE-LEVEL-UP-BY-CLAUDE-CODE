-- 0019 —— 私隱政策同意紀錄
--
-- 依據：Yuna（COO）2026-09-09 指示「如果之前已經註冊成為用戶嘅話，我哋需要
--       再俾佢哋簽返註冊同意嗰個 Privacy Policy，等佢哋知道返我哋會採集啲咩
--       數據」；Phase 1 影響評估 docs/PHASE1-privacy-consent-gate.md（選項 B）。
--
-- 點解今日先至需要呢張表：2026-09-08 §16.E 修訂之後，上雲嘅嘢多咗兩樣
-- （未完成嗰節嘅答案原文、錯因自診）。多咗嘢採集，就更加需要一份講得清楚、
-- 而且簽得低嘅同意書。
--
-- ══════════════════════════════════════════════════════════════════
-- 呢張表【冇】乜嘢，同佢有乜嘢一樣重要
-- ══════════════════════════════════════════════════════════════════
--
-- 冇 ip_address。冇 user_agent。冇家長電郵。冇 email。
--
-- 呢個判斷直接沿用已剷走嗰張 `consent_logs`（0013_plus_payment.sql 檔頭）：
-- 為咗「證明佢同意過」呢一個用途，而多開一個未成年人個人資料類別，唔值。
-- 用戶群係 12–18 歲 —— 每多一欄，就多一樣洩得出去嘅嘢。
--
-- 留低嘅係聲明本身：邊個、幾時、同意咗邊一版。呢個就係全部證據。
--
-- ⚠️ `policy_version` 係本表最重要嘅一欄。冇佢，紀錄就淨係證明到
--    「佢撳過個掣」，證明唔到佢究竟同意咗乜。文案一改就要 bump ——
--    有 build-time 測試守住（lib/__tests__/privacy-consent.test.mts）。
--
-- ⚠️ 本表【唔經 lib/sync.ts 白名單】—— 佢唔係 localStorage 同步嘅嘢，
--    係一張獨立表，由 server-only service role 讀寫。§16.E 白名單
--    維持三個 key，不受本表影響。
--
-- ⚠️ 本檔唔係法律意見。香港 PDPO 下未成年人同意嘅效力要執業律師判斷。
--    luna-legal 係 skill 角色，唔可以簽法務驗收（憲章 §16.C）。

create table if not exists public.privacy_consents (
  user_id         text        primary key,
  policy_version  text        not null,
  consented_at    timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

comment on table  public.privacy_consents is
  '私隱政策同意紀錄。一個用戶一行，重新同意就覆蓋。刻意唔存 IP／user-agent／email。';
comment on column public.privacy_consents.policy_version is
  '用戶同意嗰陣睇到嘅政策版本（lib/privacy/consent.ts POLICY_VERSION）。文案改咗要 bump，否則舊紀錄會扮成同意過新版。';

-- ── 權限 ──────────────────────────────────────────────────────────
--
-- ⚠️ Supabase 有 `ALTER DEFAULT PRIVILEGES`，新表會自動畀齊 anon ＋
--    authenticated 全套 DML。所以【一定要顯式 revoke】—— 呢點喺 0016
--    原稿寫錯過（以為唔 grant 就等於冇權），0017 實測捉返。
--    同意紀錄係一份證據：學生自己改得到，佢就唔再係證據。
--
-- 讀寫一律經 server-only service role（app/api/privacy/consent/route.ts），
-- service role 繞過 grant 同 RLS，所以以下 revoke 唔影響正常運作。

revoke all on public.privacy_consents from anon, authenticated;

alter table public.privacy_consents enable row level security;
-- 零 policy = deny-all。同 user_progress 一樣嘅做法：唯一入口係 service role。

-- ── 套用後應該點驗（實跑，唔准預先打勾 —— 憲章 §16.C）──────────────
--
--   ✅ 2026-09-09 套用，實測：rows 0 · RLS on · anon SELECT/INSERT = false
--                              · authenticated SELECT/UPDATE = false
--   ✅ /api/privacy/consent 未登入 → 401
--   ✅ 未登入路由全部 200（/ · /practice · /privacy · /dashboard · /relax · /subjects）
--        —— 同意閘冇擋住任何嘢，選項 B 成立
--   ⬜ 登入 → 見到同意 modal → 撳同意 → 表出現 1 行，policy_version 正確
--   ⬜ 撳「唔同意」→ 表維持 0 行，而練習／雷達圖／SEN 設定全部照用得
--        （呢兩項要真人登入先驗到 —— 冇人跑過就唔准打勾，憲章 §16.C）
