# G · 登入實作備註 — 2026-10-29

> **歷史註記：** 本檔原鎖定 **A3 + B1**（#137）。同日創辦人改選 **B3 wipe + S1 session**。  
> 現行決策以 `G-AUTH-AND-DATA-RESET-DECISIONS-2026-10-29.md` 同 `G-B3-WIPE-RUNBOOK-2026-10-29.md` 為準。

## 仍有效（A3 碼）

- 雙 backend 閘、`/sign-in`／`/sign-up`、Google＋電郵 UI（BA 開先有電郵）
- S1：已登入訪 `/sign-in` → redirect dashboard；JWT／BA session cookie 同裝置延續
- `getSyncUserId()`：Google → `accountId`（= `sub`）；wipe 後同一 Google 帳戶會寫入**全新**空進度
- DRAFT `0027`：只建 BA 四表（唔 wipe）

## B3 新增

- DRAFT `0028_g_b3_user_data_wipe.DRAFT.sql` — 只清用戶表；**未套用 production**
- R4 必須：備份 → 公告 → 創辦人手跑 SQL

## Production cutover 建議次序

1. R4 wipe（`0028`）  
2. R3 Better Auth env + `0027`  
3. 驗證：新 Google／電郵登入、跨裝置 sync、刪帳、S1 cookie 延續  
