-- 0011 —— 移除「影子溫書室」資料表。
--
-- 背景：見 docs/DECISION-no-interaction.md（2026-08-21，Yuna）。
-- 本平台永久唔提供任何用戶對用戶互動，`/wall` 整個功能已經由代碼庫刪走。
--
-- ⚠️ 執行前必讀
--   · 呢個係【不可逆】操作。套用之前，`wall_posts` 有 1 行 pending（從未公開）。
--     如果想留底，先 `select * from wall_posts;` 匯出。
--   · 套用之後，`lib/privacy/userData.ts` 嘅 `wall_posts` / `wall_likes` 可以留住
--     唔使即刻改 —— 刪除路由對 42P01（表唔存在）當作 no-op，唔會令刪帳號失敗。
--   · 未套用亦唔會有問題：代碼冇任何路徑再讀寫呢兩張表。

drop table if exists public.wall_likes;
drop table if exists public.wall_posts;
