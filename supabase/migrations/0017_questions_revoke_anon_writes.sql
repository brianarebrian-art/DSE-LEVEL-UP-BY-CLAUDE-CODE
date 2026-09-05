-- ============================================================================
-- 0017_questions_revoke_anon_writes.sql —— 補返 0016 一個【冇成立嘅防線】
-- ----------------------------------------------------------------------------
-- 2026-09-05，0016 落咗之後即刻用 anon 身分實試四種操作，發現：
--
--   SELECT  1002 行讀得到          ← 預期之內
--   INSERT  被 RLS 擋              ← 預期之內
--   UPDATE  zero rows affected     ← ⚠️ 唔係 "permission denied"
--   DELETE  zero rows affected     ← ⚠️ 同上
--
-- 「zero rows affected」同「permission denied」係兩件事。前者代表 anon
-- 【有】UPDATE 權限，只係 RLS 令佢見唔到任何一行可以改。查 grant 證實：
--
--   anon → DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE
--
-- Supabase 對 public schema 設有 ALTER DEFAULT PRIVILEGES，每一張新表自動
-- 授予 anon／authenticated 全套 DML。所以 0016 嗰句 `grant select ... to anon`
-- 【完全冇作用】—— anon 本來就已經有齊，嗰句一個權限都冇加，亦一個都冇收窄。
--
-- 後果：0016 檔頭寫「防線 ①：anon 只有 SELECT…亦冇 grant」係【失實】。
-- 實情係得一層 RLS 頂住。RLS 一層唔算冇用，但同「兩層」係兩回事 ——
-- 將來有人為咗某個功能加一條 write policy，RLS 一鬆，grant 就即刻接住，
-- 而讀 0016 註釋嗰個人會以為仲有第二層守住。
--
-- 呢個正正係憲章 §16.D 講嗰種錯：寫低一個【聽落有、實際冇】嘅防護。
-- 分別只在於今次個對象係下一個改呢張表嘅開發者，唔係學生。
--
-- 所以呢度真係 revoke 一次，令 0016 嗰句描述變成事實，而唔係改細段文字算數。
-- 之後 anon 對呢兩張表【只剩 SELECT】，RLS 同 grant 兩層各自獨立成立。
--
-- 覆核指令（應該只見到 SELECT）：
--   select grantee, privilege_type from information_schema.role_table_grants
--   where table_schema='public' and table_name='questions' and grantee='anon';
-- ============================================================================

revoke insert, update, delete, truncate, references, trigger
  on public.questions              from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger
  on public.question_bank_versions from anon, authenticated;
