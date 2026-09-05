-- ============================================================================
-- 0015_drop_payment.sql —— 剷除整套收費系統嘅資料層
-- ----------------------------------------------------------------------------
-- 2026-09-05 Brian 裁決：Delete 晒成個 payment 系統，照舊完全免費、無限題目。
--
-- 剷嘅係 0013（付費表）同 0014（Plus 裝置 LRU）建立嘅五張表。
--
-- ── 剷之前逐張數過（唔係估）────────────────────────────────────────────────
--   plus_entitlements  0 行
--   purchases          0 行
--   consent_logs       0 行
--   plus_devices       0 行
--   site_config        1 行（feature flag，冇任何代碼讀過 —— grep 全 repo
--                      除咗 0013 本身零命中）
-- 全部係暗部署期間建立、從未開賣，所以【冇一筆真實交易、冇一個學生嘅同意聲明】
-- 會因為呢個 migration 而消失。呢點好重要：如果曾經收過一蚊，§4.3 稅務保留
-- 七年就會令「剷表」變成違規動作，屆時正確做法係停用而非刪除。今次唔係。
--
-- ── 順帶解走三個懸而未決嘅政策問題 ─────────────────────────────────────────
-- lib/privacy/userData.ts 之前為呢三張表寫低咗「待創辦人決定」：
--   ① 刪帳號之後付費表仍然可識別身分（保留 vs 匿名化）
--   ② consent_logs 冇保留期上限（chargeback 窗口係月計，唔應該留七年）
--   ③ /privacy 頁面「你可以刪除自己嘅資料」因呢三張表而有例外，但頁面未講
-- 表冇咗，三個問題一齊冇咗 —— 而唔係繼續掛住。
--
-- ⚠️ 唔可逆。要恢復收費就要重新走一次 0013 + 0014，並且重新雙簽憲章 §8.2。
-- ============================================================================

drop table if exists public.plus_devices;
drop table if exists public.consent_logs;
drop table if exists public.purchases;
drop table if exists public.plus_entitlements;
drop table if exists public.site_config;
