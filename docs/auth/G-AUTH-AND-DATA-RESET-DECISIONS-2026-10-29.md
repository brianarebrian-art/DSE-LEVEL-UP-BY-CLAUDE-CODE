# G · 登入／註冊重建與資料重置 — 決策紙

狀態：**已選定 A3 + B3 + S1** · 2026-10-29（香港時間）  
創辦人確認（同日）：**production 用戶相關資料清空（B3）**；**同裝置 session 延續（S1）**（唔做跨裝置免密自動登入）。

## G-A · 認證實作

| 選項 | 說明 | 影響 |
|---|---|---|
| A1 維持 Auth.js-only | 繼續 Google JWT | 最低風險；無電郵密碼 |
| A2 Better Auth · Google only | Flip env；建 BA 表；唔開 password | 中風險 |
| **A3 Better Auth · Google＋email/password** ✅ | Brian 2026-09-07 方向；碼已備 | 要 env／建表 |

**選定：A3。** Production flip／建表 = **R3**（創辦人設 Vercel env + 審／跑 `0027`）。

## G-B · 歷史資料

| 選項 | 說明 | 影響 |
|---|---|---|
| B1 保留並遷移 | 繼續用 Google `sub` sync key | 舊進度可接 |
| B2 凍結舊帳 | 舊雲端只讀／可匯出 | 需對外說明 |
| **B3 全庫用戶資料重置** ✅ | TRUNCATE 用戶相關表 | **不可復原** |

**選定：B3**（創辦人 2026-10-29 書面確認：必須清除相關用戶數據；要備份、定範圍、對外公告後先套用）。

**範圍（清）：** `user_progress`、`user_settings`、`profiles`、`user_sessions`、`privacy_consents`；若已建 Better Auth 表則連 `session`／`account`／`verification`／`user`。  
**範圍（唔清）：** `questions`、`question_bank_versions`、`review_decisions`、匿名 `question_reports`／`session_feedback`／`practice_counts`。

**套用 = R4**（另紙 checklist；agent **唔會**自行對 production 執行 TRUNCATE）。DRAFT SQL：`supabase/migrations/0028_g_b3_user_data_wipe.DRAFT.sql`。

## G-S · 「自動登入」含義

| 選項 | 說明 |
|---|---|
| **S1 同裝置 session 延續** ✅ | Cookie／session 仍有效 → 返嚟唔使再撳；換機或清 cookie → 要 Google 或電郵密碼 |
| S2 跨裝置免密自動登入 | 否決（中學生私隱／保安風險過高） |

## 對外一句（B3）

「登入系統升級中：舊雲端練習進度會清空，之後重新登入再同步。題庫同免費練習唔受影響。」

## 下一步

1. ✅ G1 碼（A3 骨架 + `/sign-in`）已入 main（#137）
2. 本 PR：鎖定 B3+S1、DRAFT wipe、公告草稿、更新 cutover 文案
3. ⏳ **R4**：創辦人完成備份 → 公告 → 親手套用 `0028` DRAFT
4. ⏳ **R3**：Better Auth env + `0027`（可喺 wipe 前後；建議 wipe 後再 flip，避免舊 session 殘留）
