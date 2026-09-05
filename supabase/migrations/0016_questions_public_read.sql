-- ============================================================================
-- 0016_questions_public_read.sql —— 題庫上雲，瀏覽器直連讀取
-- ----------------------------------------------------------------------------
-- 2026-09-05 Brian 指示：題目搬入 Supabase，學生做題時直接向 Supabase 攞，
-- 唔再經 Vercel，藉此慳 Edge Request。憲章 §3 同日修訂以配合（見 docs/charter.md）。
--
-- ⚠️ 本表係【全庫第一張開 anon 讀取 policy 嘅表】。
-- 其餘每一張表（user_progress／profiles／user_settings／review_decisions／
-- push_subscriptions）都係「開 RLS ＋ 零 policy」= anon 全鎖死，寫入一律經
-- server-only service role。呢張刻意唔同，理由如下，唔好照抄去其他表：
--
--   題目本身【已經係公開內容】。而家佢哋 build 入 JS chunk，任何人 view-source
--   都攞得晒，包括 correctIndex。搬上雲【並無】新增任何曝露 —— 曝露程度不變，
--   變嘅只係邊個伺服器出流量。
--
-- ── 三條防線（缺一不可）─────────────────────────────────────────────────────
-- ① anon 只有 SELECT。冇 INSERT／UPDATE／DELETE policy。
--    憲章 §12「機器永不自動入庫」靠呢條 —— 學生（或任何攞到 anon key 嘅人）
--    改唔到一隻字。
--    ⚠️ 下面嗰句 `grant select ... to anon` 【本身唔構成收窄】：Supabase 有
--    ALTER DEFAULT PRIVILEGES，每張新表自動畀齊 anon 全套 DML。真正將 anon
--    收窄到只剩 SELECT 嘅係 0017_questions_revoke_anon_writes.sql —— 兩個檔
--    要一齊睇。詳情（連實測輸出）見 0017 檔頭。
-- ② 寫入只有 service_role，而唯一寫入者係 scripts/qbank/sync-questions.mjs，
--    人手執行。
-- ③ **`data/questions/*.ts` 仍然係唯一正本。** 本表係【衍生鏡像】。
--    正本喺 git 入面：有 diff、有 blame、有 decisions.json 實名簽署。
--    表入面嘅嘢隨時可以由正本重建；反方向唔得。
--    parity 測試（scripts/qbank/sync-questions.mjs --check）確保兩邊一致。
--
--    點解要寫死呢一條：一旦「學生睇到嘅題目」嘅來源變成一張可寫嘅表，
--    覆核管線嗰個「入庫＝一個 commit」嘅保證就會靜靜哋失效 —— 有人 UPDATE
--    一行，冇 diff、冇 blame、冇人知。所以鏡像方向唔准倒轉。
--
-- ── 點解係 jsonb 而唔係逐個欄位 ─────────────────────────────────────────────
-- `data/questions/types.ts` 有三個題型、四十幾個 optional 欄位（steps／mcHack／
-- markingScheme／各自嘅 En 版本…），而且仲會加。逐欄映射即係每次題型加一個欄位
-- 就要出一個 migration，而漏咗一個欄位嘅後果係【靜靜哋丟失內容】。
-- jsonb 令 export 無損，schema 唔會漂移。
-- 提升做真欄位嘅只有四個 —— 全部係篩選用（WHERE），唔係顯示用。
-- ============================================================================

create table if not exists public.questions (
  id           text primary key,
  subject      text not null,
  topic        text not null,
  type         text not null,
  difficulty   text not null,
  -- 題目全文（AnyQuestion 原物件，無損）。
  data         jsonb not null,
  synced_at    timestamptz not null default now()
);

-- 每科一次過攞晒（現行 loader 形狀），或者按課題／題型收窄（將來逐節攞）。
create index if not exists questions_subject_idx      on public.questions (subject);
create index if not exists questions_subject_type_idx on public.questions (subject, type);
create index if not exists questions_subject_topic_idx on public.questions (subject, topic);

-- ── 版本表 ──────────────────────────────────────────────────────────────────
-- 瀏覽器將題庫 cache 落 IndexedDB。要知幾時要重攞，就要有個平嘅版本號。
-- 冇呢張表就只有兩條路：每次都重攞成科（貴），或者永遠唔更新（錯）。
-- 呢張表細到一次過攞晒 25 行都係幾 KB，所以每次開練習先問一句係抵嘅。
create table if not exists public.question_bank_versions (
  subject    text primary key,
  version    text not null,   -- 該科全部題目內容嘅 sha256（前 16 位）
  count      int  not null,
  synced_at  timestamptz not null default now()
);

alter table public.questions              enable row level security;
alter table public.question_bank_versions enable row level security;

-- 防線 ①：anon／authenticated 只有 SELECT，冇任何寫入權。
grant select on public.questions              to anon, authenticated;
grant select on public.question_bank_versions to anon, authenticated;
grant all    on public.questions              to service_role;
grant all    on public.question_bank_versions to service_role;

drop policy if exists "questions_public_read" on public.questions;
create policy "questions_public_read"
  on public.questions for select to anon, authenticated using (true);

drop policy if exists "question_bank_versions_public_read" on public.question_bank_versions;
create policy "question_bank_versions_public_read"
  on public.question_bank_versions for select to anon, authenticated using (true);

-- 防線 ②：寫入只有 service_role。
drop policy if exists "questions_service_all" on public.questions;
create policy "questions_service_all"
  on public.questions for all to service_role using (true) with check (true);

drop policy if exists "question_bank_versions_service_all" on public.question_bank_versions;
create policy "question_bank_versions_service_all"
  on public.question_bank_versions for all to service_role using (true) with check (true);
