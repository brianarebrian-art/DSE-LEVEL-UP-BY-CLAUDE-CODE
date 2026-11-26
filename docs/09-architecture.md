# docs/09-architecture.md

## 事實來源

- 題目正本：git `data/questions/*.ts`
- 生命週期帳本：`data/questions/lifecycle/*.json`（本輪新增；尚未寫回 TS 正本）
- 雲端鏡像：Supabase `questions`（衍生）
- 練習：`GET /api/practice/catalog` 只回題幹與選項；`POST /api/practice/check` 在學生提交後先評分並回傳該題解析
- 純題目卷：`POST /api/paper/build` 不回答案；`POST /api/paper/key` 在學生確認做完後才回該卷答案
- 書籤：`POST /api/questions/bundle` 只回已收藏題幹。筆記：`POST /api/notes/topic` 只回該課題統計、陷阱摘錄，以及學生已經錯過的題的解析。概念網：打開一篇後 `GET /api/concept-net/preview` 最多四條，不含選項與 correctIndex
- 舊 2B token 路徑（`POST /api/practice/session` + `/grade`）仍由 `PRACTICE_SERVER_GRADE` 關閉，練習介面不再依賴它

## 狀態機

見 `data/questions/lifecycle/statuses.ts` + migration DRAFT `0038_item_lifecycle_audit.DRAFT.sql`。

## 安全邊界

- service role：server-only
- session HMAC：`PRACTICE_SESSION_HMAC_SECRET`
- 校準事件：未開寫（C3 未簽）
