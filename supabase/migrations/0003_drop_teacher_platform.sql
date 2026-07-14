-- 0003_drop_teacher_platform.sql — 一刀斬：徹底移除「老師大數據平台」(Teacher Radar)。
-- =============================================================================
-- 決策：平台唔做老師登入／班級／同意書數據存取，改為學生自用「生成報告」（純前端，
-- localStorage 聚合，唔讀任何 server 表）。呢個 migration 剷走 0002_teacher_radar.sql
-- 起嘅所有嘢（0002 檔案已從 repo 刪除 —— 如果你從未喺 Supabase 執行過 0002，
-- 呢度嘅 DROP IF EXISTS 全部係無害 no-op，照跑無妨）。
--
-- 對照返實際 schema 嘅注意位：
--   • 冇 `class_invite_codes` 呢張表（join code 係 classes 嘅一欄）—— 無嘢可 drop。
--   • index 會隨 table 一齊 drop，毋須逐個 DROP INDEX。
--   • question_events 一併剷走：consent-gated 逐題記錄（Phase 2）從未實裝，張表
--     一直係空；老師平台冇咗之後佢冇任何讀者，留低只係私隱面。
--   • profiles 保留（帳戶刪除 API 會清 caller 自己嗰行），role 收窄至 student|admin。
--
-- 喺 Supabase SQL Editor 執行。VACUUM 唔可以喺 transaction 入面行，所以本檔冇包
-- BEGIN/COMMIT；如果你嘅執行器自動包 transaction，最尾嘅 VACUUM 請分開單獨行。

drop table if exists public.question_events;
drop table if exists public.enrollments;
drop table if exists public.classes;

-- profiles: role 只允許 student | admin（teacher 廢除）。先把既有 teacher 降級，
-- 再換 CHECK constraint（constraint 名對齊 0002 嘅預設命名；兩個名都試）。
do $$
begin
  if to_regclass('public.profiles') is not null then
    update public.profiles set role = 'student' where role = 'teacher';
    alter table public.profiles drop constraint if exists profiles_role_check;
    alter table public.profiles add constraint profiles_role_check check (role in ('student','admin'));
  end if;
end $$;

-- 最後（如你嘅執行器包 transaction，請單獨執行呢句）：
VACUUM;
