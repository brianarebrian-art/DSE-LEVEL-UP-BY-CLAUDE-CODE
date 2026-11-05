# 支柱 1：知識圖與 FSRS

## 現況

練習頁已經有間隔邏輯的舊測試（失敗或跳過加 1 日，通過走 3、7、14、30 日）。那是固定階梯，不是 FSRS。中文科十二篇有另一張概念網（`docs/concept_network.json`），範圍不是 M2。

這次把 M2、電解、遺傳的先備關係放在 `lib/knowledge/graph.ts`。它是程式內正本，離線可用。`edbCode` 用 `internal:` 前綴，表示對齊公開課程結構的內部鍵，不是已逐份核對的教育局編號。

## 圖

HKDSE M2 在這張圖裡分成 Foundation、Algebra、Calculus、Further。

- Foundation 是 Algebra 的先備
- Algebra 是 Calculus 的先備
- Compulsory Part 是 Calculus 的先備
- Calculus 是 Further 的先備
- Algebra 與 Calculus 都是 Differentiation 的先備

答錯 Differentiation 時，`tracePrerequisites(id, 2)` 會走到 Algebra、Calculus、Foundation、Compulsory Part。Further 是後續，不會被當成先備。

## FSRS-5

預設權重採用 open-spaced-repetition 公開的 FSRS-5 十九個數。前四個是 0.40255、1.18385、3.173、15.69105。指令裡寫的 15.36203 對不上這組公開預設的第四個數，所以程式用公開的 15.69105，並由測試鎖住。

可提取性：

`R = (1 + (19/81) * t / S) ^ -0.5`

請求保留率 0.9 時，間隔日數等於穩定度（四捨五入，最少 1 日）。`R < 0.9` 就視為到期。

第一次評分用 w0–w3 做初始穩定度。之後的成功、失敗，以及同一天內的短期穩定度，按 FSRS-5 公開公式。實作在 `lib/fsrs/scheduler.ts`。

滿 200 次複習之後，`weightsForReviewCount` 仍然交回同一組預設權重，原因是 `optimizer-not-approved`。沒有在請求裡跑優化器。個人化要另一次離線核准，避免在學生請求路徑上改權重。

Bayesian Knowledge Tracing 在 `lib/fsrs/bkt.ts`。先驗 0.3、學習 0.1、猜中 0.2、失誤 0.1。這是起點參數，不是已經擬合的個人模型。頁面上的數字標成掌握估計。

## 資料庫

`supabase/migrations/0035_fsrs_knowledge_graph.DRAFT.sql` 起草了 `knowledge_nodes`、`knowledge_edges`、`fsrs_cards`（含 w0–w18）、`fsrs_reviews`。學生列的政策寫成 `(SELECT auth.uid()) = user_id`。匿名角色沒有權限。

這份是草稿。生產庫是學生正在用的庫，憲章要求 schema 另一次批准才套用。這次沒有執行 `apply_migration`。
