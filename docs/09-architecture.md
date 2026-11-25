# docs/09-architecture.md

## 事實來源

- 題目正本：git `data/questions/*.ts`
- 生命週期帳本：`data/questions/lifecycle/*.json`（本輪新增；尚未寫回 TS 正本）
- 雲端鏡像：Supabase `questions`（衍生）
- 練習（現況）：client 抽題／計分
- 練習（2B 試點，flag 關）：`POST /api/practice/session` + `/grade`

## 狀態機

見 `data/questions/lifecycle/statuses.ts` + migration DRAFT `0038_item_lifecycle_audit.DRAFT.sql`。

## 安全邊界

- service role：server-only
- session HMAC：`PRACTICE_SESSION_HMAC_SECRET`
- 校準事件：未開寫（C3 未簽）
