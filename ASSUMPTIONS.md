# ASSUMPTIONS.md

> 無法確認而自行假設的事項。每條標明影響範圍。  
> 更新：2026-11-26（Asia/Hong_Kong）

| ID | 假設 | 依據／缺口 | 影響範圍 | 若假設錯誤 |
|---|---|---|---|---|
| A1 | 創辦人決定 1B／2B 於本對話生效，憲章正文仍須另 PR 簽署後才算法律／產品正本 | 對話確認；憲章未改 | 全部 2B 工程 | 須回滾 session API／遙測 |
| A2 | 30 日成功 = 盤點 + 管線 + 試點 ≥500 `ADVERSARIAL_PASSED`，非 26428 `RELEASED` | 計劃 1B | 對外宣稱、分數卡 | 若堅持全量則 FAIL |
| A3 | Drive 資料夾為研究用第三方彙編，非平台擁有 | 用戶說明 | 版權、相似度 | 須停止結構提取以外用途 |
| A4 | 綜合科學／組合科學不在平台 25 科內，本計劃不新增科目 | `data/subjects.ts` 無此二科 | 指紋卡覆蓋 | 若要納入須另開科目工程 |
| A5 | 儲存 `correctIndex:0` + 顯示洗牌在現網有效 | 代碼約定；未做對抗測試證明無洩漏 | 防撞答案 | 洗牌 bug → P0 |
| A6 | 生產作答答對率聚合目前不可在本 agent 環境直接查 | 無生產 DB 憑證用於分析 | `02-accuracy-gap` | 有唯讀權限則更新假設比例 |
| A7 | **不使用任何額外 LLM API**（創辦人 2026-11-26）；只靠 Cursor Agent + 確定性腳本 | `docs/23-no-external-llm-policy.md` | 全量改寫產能 | 不可用外部並行盲審提速 |
| A8 | 試點科預設 math/physics/chemistry/biology/bafs/economics | 計劃；可按產能下修 | Sprint 3 題數 | 產能不足則縮至 ≥500 |
| A9 | server PDF 套件可能觸及「禁新增套件」憲章；優先強化 print CSS | charter §1.5 | Sprint 5 | 另批套件例外才做 PDF |
| A10 | 匿名校準事件不含 user_id／IP／自由文字答案原文以外之最小欄位 | 2B + 安全策略 | Sprint 4 schema | 過量收集 → 停用 |
| A11 | 人類於**全部就緒後一次簽署**；過程中不逐日簽。簽署 ≠ 學科教師審定 | 創辦人 2026-11-26 | 發布閘 | 文案不得寫「教師審定」；未過閘不得簽入 RELEASED |
| A12 | `LEGACY_UNCALIBRATED` 可對學生繼續提供練習，但 UI 須可查狀態 | 1B 縮範圍 | Sprint 6 | 若禁下發則須大範圍 withdraw |

## 明確非假設（已核實）

- 題數 26,428：`npm run baseline -- --json` 於 2026-11-26 01:22 HKT 確認。  
- Drive 根目錄可 list。  
- `REVIEWED_COUNT = 5`。
