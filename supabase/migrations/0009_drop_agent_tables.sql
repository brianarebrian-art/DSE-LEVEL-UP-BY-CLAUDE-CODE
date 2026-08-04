-- 0009: 移除 agentic harness 三張表（2026-08-05）
--
-- 決策：Brian (CEO)「技術債執行清單 v1.0」P3.2 —— 立即刪除。
--
-- 事實依據（執行前實測，非引述）：
--   • agent_memory / agent_traces / escalation_queue 三張表均為 0 行。
--   • 唯一寫入者係 app/api/agent/sandbox/route.ts，而全 repo 前端【零呼叫】該
--     route（grep 確認）—— 即係整套 harness 由頭到尾未曾運行過。
--   • lib/agents/sandbox.ts 曾聲明 OUTBOUND_ALLOWLIST = ['api.anthropic.com']，
--     檔案自註「付費推理，唔喺 $0 內」。刪走 = 封死呢條 $0 裂縫。
--
-- ⚠️ escalation_queue 係 agent loop 嘅熔斷佇列，【唔係】SEN 自殘風險升級佇列。
--    平台從來冇、亦唔會有自動精神健康偵測（見 0008 檔頭）。危機支援嘅唯一做法
--    係頁面常駐公開熱線卡，唔受本 migration 影響。
--
-- 0007_agent_memory_mesh.sql 保留唔刪，作為歷史記錄。

DROP TABLE IF EXISTS agent_traces;
DROP TABLE IF EXISTS agent_memory;
DROP TABLE IF EXISTS escalation_queue;
