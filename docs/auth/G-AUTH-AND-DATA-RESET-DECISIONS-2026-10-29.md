# G · 登入／註冊重建與資料重置 — 決策紙（DRAFT）

狀態：**待批准** · 2026-10-29（香港時間）  
紅線：**「重建登入」≠「清空所有學生資料」。** 未另批禁止 production 全庫 wipe。

## G-A · 認證實作（三選一）

| 選項 | 說明 | 影響 |
|---|---|---|
| **A1 維持 Auth.js-only** | 繼續 Google JWT | 最低風險；無電郵密碼 |
| **A2 Better Auth · Google only** | Flip env；建 BA 表；唔開 password | 中風險；要 `DATABASE_URL`／secret（創辦人自設） |
| **A3 Better Auth · Google＋email/password** | 2026-09-07 Brian 曾裁決方向；碼已備 | 要電郵驗證方案／成本；私隱文案已可切 |

建議（文件預設）：若要「註冊重建」體驗 → **A3**；若只求穩定 → **A1**。  
實作參照：`FLIP-TO-BETTER-AUTH.md`；回歸：`email-auth-readiness.test.mts`。

**Production flip／建表 = 另批 R3。**

## G-B · 歷史資料（三選一）

| 選項 | 說明 | 影響 |
|---|---|---|
| **B1 保留並遷移**（建議） | 繼續用 Google `sub` 做 sync key | 舊進度可接；信任成本最低 |
| **B2 凍結舊帳、新登入新 key** | 舊雲端資料只讀／可匯出 | 需對外說明；唔 wipe |
| **B3 全庫重置** | TRUNCATE／刪用戶表 | **不可復原**；要書面範圍、備份、公告、第二道批准 |

建議：**B1**。B3 預設否決，除非創辦人親筆確認。

## 對外一句（草稿，未發布）

- B1：「登入升級中，你嘅練習進度會保留。」  
- B3（若堅持）：「我們將於〔日期〕重置雲端練習進度；請先匯出／知悉不可復原。」

## 下一步（你批決策後）

1. G1：按 G-A 開實作 Draft PR（仍唔自行設 production env）。  
2. G2：按 G-B 寫 runbook；僅 B3 先進入不可復原關卡。  
