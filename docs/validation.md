# 假設驗證

日期：2026-11-05（香港時間）。

## 假設 A：裸的 `auth.uid()` 在 1000 行上會慢到需要立刻改生產政策

結果：不成立於這個庫的現況。

生產政策裡，裸 `auth.uid()` 的 `qual` 是 0 條，包在 `(SELECT auth.uid())` 的是 8 條。

1000 行臨時表在同一個會 `ROLLBACK` 的語句裡建立，沒有留下資料。

| 寫法 | 計劃 | 執行時間 |
| --- | --- | --- |
| `user_id = pg_temp.volatile_uid()` | 函數被內聯成常數，Index Only Scan | 0.148 ms |
| `user_id = (SELECT pg_temp.volatile_uid())` | InitPlan，Index Only Scan | 0.150 ms |

兩者都遠低於 50 ms。沒有重現 1840 ms 對 0.21 ms，因為行數不是 100 萬，而且這個 SQL 函數被規劃器內聯了。`auth.uid()` 的逐行成本要用不能內聯的函數加大表才看得到。這次拒絕在學生庫上做那個實驗。

## 假設 B：網站正在用 5432 長連線

結果：執行路徑不是。`SUPABASE_URL` 是 HTTPS。應用程式不讀 `POSTGRES_URL`。三條 sensitive 的 Postgres URL 沒有解出，不能說它們的埠。直連主機名是 `db.aegekxapxgcfdrkzisis.supabase.co`。

## 假設 C：三次提示可以不靠付費模型

結果：成立。`socratic-tutor` 測試 4 項通過，正確選項沒有出現在提示裡，微分的第三次回溯包含代數。

## 假設 D：可以在這次把 FSRS 表寫進生產庫

結果：不執行。該庫是學生生產庫，憲章要求 schema 另一次批准。草稿在 `supabase/migrations/0035_fsrs_knowledge_graph.DRAFT.sql`。
