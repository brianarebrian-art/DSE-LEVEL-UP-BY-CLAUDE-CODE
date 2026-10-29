# G · 登入／註冊重建與資料重置 — 決策紙

狀態：**已選定 A3 + B1** · 2026-10-29（香港時間，創辦人指示開實作 PR）  
紅線：**「重建登入」≠「清空所有學生資料」。** 未另批禁止 production 全庫 wipe。

## G-A · 認證實作（三選一）

| 選項 | 說明 | 影響 |
|---|---|---|
| A1 維持 Auth.js-only | 繼續 Google JWT | 最低風險；無電郵密碼 |
| A2 Better Auth · Google only | Flip env；建 BA 表；唔開 password | 中風險 |
| **A3 Better Auth · Google＋email/password** ✅ | Brian 2026-09-07 方向；碼已備 | 要 env／建表；私隱文案已可切 |

**本輪選定：A3。** 實作參照：`FLIP-TO-BETTER-AUTH.md`、`G-AUTH-A3-B1-IMPLEMENTATION-2026-10-29.md`；回歸：`email-auth-readiness.test.mts`。

**Production flip／建表 = 另批 R3**（唔喺 agent 自行改 Vercel secret）。

## G-B · 歷史資料（三選一）

| 選項 | 說明 | 影響 |
|---|---|---|
| **B1 保留並遷移** ✅ | 繼續用 Google `sub` 做 sync key | 舊進度可接 |
| B2 凍結舊帳、新登入新 key | 舊雲端資料只讀／可匯出 | 需對外說明 |
| B3 全庫重置 | TRUNCATE／刪用戶表 | **不可復原** |

**本輪選定：B1。B3 否決**（除非創辦人另紙親筆確認範圍、備份、公告）。

## 對外一句

- B1：「登入升級中，你嘅練習進度會保留。」

## 下一步

1. ✅ G1 實作 PR（UX + DRAFT migration `0027`）— 見 `cursor/g-auth-a3-b1-impl-fc22`
2. ⏳ R3：創辦人設 env、審 SQL、flip、驗證舊 Google 進度
3. B3 路徑：關閉，除非另批  
