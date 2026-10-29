# G-B3 · Production 用戶資料清空 — 執行手冊（R4）

狀態：**DRAFT · 未套用 production**  
決策：`G-AUTH-AND-DATA-RESET-DECISIONS-2026-10-29.md`（A3 + B3 + S1）  
SQL：`supabase/migrations/0028_g_b3_user_data_wipe.DRAFT.sql`

## 絕對唔好做

- Agent／CI **唔准**對 live Supabase 自動跑 TRUNCATE
- 唔好連題庫、審題、匿名遙測一齊清
- 未備份、未公告，唔好按執行

## 創辦人 checklist（按次序）

1. **備份**  
   - Supabase Dashboard → 或 `pg_dump` 至少：`user_progress`、`user_settings`、`profiles`、`user_sessions`、`privacy_consents`  
   - 將備份檔放到只有創辦人可讀嘅位置；記低時間（香港時間）
2. **對外公告**（見下方草稿）— Instagram／站內信任頁／Threads 擇一或全部  
3. **維護窗**（建議 15–30 分鐘）：可選開 Vercel Attack Mode／暫時關 sync  
4. **審 SQL**：開 `0028_*.DRAFT.sql`，確認只有用戶表、有 `WHERE`／表名白名單註解  
5. **執行**：喺 Supabase SQL editor（service role）跑該檔；或 rename 去掉 `.DRAFT` 後用 CLI migrate  
6. **核對**：  
   ```sql
   SELECT 'user_progress' AS t, COUNT(*) FROM user_progress
   UNION ALL SELECT 'user_settings', COUNT(*) FROM user_settings
   UNION ALL SELECT 'profiles', COUNT(*) FROM profiles
   UNION ALL SELECT 'user_sessions', COUNT(*) FROM user_sessions
   UNION ALL SELECT 'privacy_consents', COUNT(*) FROM privacy_consents;
   -- 期望全部 0
   SELECT COUNT(*) FROM questions; -- 必須 > 0（題庫仍在）
   ```
7. **本機**：用戶清 cookie／storage 或登出再登；S1：同裝置新 session 建立後會延續  
8. **（可選）R3**：再套用 `0027` + Better Auth env

## 對外公告草稿（粵語）

> DSE Level Up 會升級登入系統（Google，之後會加電郵）。  
> **升級期間會清空舊嘅雲端練習進度**（本機未同步嘅進度請自行截圖／留意）。  
> 題庫、免費練習、SEN 舒適模式不受影響。  
> 升級後用同一 Google 帳戶重新登入即可再同步。  
> 有問題：dselevelup@gmail.com

English short：

> We’re upgrading sign-in. **Cloud practice progress will be reset.** The free question bank is unchanged. Sign in again with Google (email coming) to sync fresh progress.

## Session 行為（S1）

- **唔係**「已註冊就跨裝置免密自動登入」  
- Cookie／session 仍有效 → 返嚟網站唔使再撳  
- 換機、清 cookie、私隱模式 → 要再 Google 或電郵密碼
