-- 0005 — D2 孤兒 arena 表清理 + D3 收緊 rls_auto_enable() 權限
-- 已於 2026-07-22 經 Supabase MCP apply_migration 套用到 aegekxapxgcfdrkzisis（生產）。
-- 呢個檔案係 repo 側嘅紀錄本，內容同已套用嘅兩條 migration 一致。

-- ─────────────────────────────────────────────────────────────────────────────
-- D2：drop 孤兒 arena 表（gamification 紅線）
--
-- 來自 0001_arena.sql（競技對戰：invite_code / score / earned_points / time_limit）。
-- 套用前實測：
--   • arenas / arena_participants / arena_answers 三表全部 0 行
--   • 全站零 code 引用（僅 3 處無關字眼：一句英文題目正文用到 "arena" 一字、兩句註解）
--   • 外鍵只由 arena_participants / arena_answers 指返 arenas，無其他表依賴
-- 故照依賴次序 drop，唔使 CASCADE。
-- ─────────────────────────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.arena_answers;
DROP TABLE IF EXISTS public.arena_participants;
DROP TABLE IF EXISTS public.arenas;

-- ─────────────────────────────────────────────────────────────────────────────
-- D3：收緊 public.rls_auto_enable() 嘅 EXECUTE（defence in depth）
--
-- ⚠️ 更正一個流傳咗嘅講法：呢個函數**唔係**「anon 可以經 /rest/v1/rpc/ 調用」。
-- 佢係 RETURNS event_trigger，掛喺 event trigger `ensure_rls`（ddl_command_end）。
-- Postgres 唔容許直接 SELECT 一個 returns event_trigger 嘅函數，PostgREST 亦唔會
-- 曝露佢 —— 所以原本嘅 anon grant 係多餘、而唔係一個可利用嘅洞。
--
-- 照收緊嘅理由：多餘權限本身就唔應該存在，兼且可以令 security advisor 收聲。
-- Event trigger 觸發時唔會檢查 EXECUTE 權限，所以 revoke 之後
-- `ensure_rls` 繼續正常自動為新建表開 RLS（已實測 evtenabled 仍為 'O'）。
-- ─────────────────────────────────────────────────────────────────────────────
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- 套用後實測結果：
--   to_regclass('public.arenas' / '…participants' / '…answers') = null, null, null
--   rls_auto_enable proacl = {postgres=X/postgres,service_role=X/postgres}
--   ensure_rls evtenabled = 'O'（仍然生效）
--   user_progress = 24 行（完全冇受影響）
