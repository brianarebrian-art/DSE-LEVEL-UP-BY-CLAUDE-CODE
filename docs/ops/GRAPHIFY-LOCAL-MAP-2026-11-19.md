# Graphify 本機 code map（工作包 0）

狀態：**已安裝／已建索引** · 記錄時間：2026-11-19（Asia/Hong_Kong）  
Graphify **唔係**原始碼或平台資料嘅替代品；刪除／發布仍要以 Vercel／測試證據為準。

## 安裝

| 項目 | 值 |
|------|-----|
| Package | `graphifyy==0.9.112`（CLI：`graphify`） |
| 安裝方式 | `uv tool install graphifyy`（本機 tool env；**未**入網站 `package.json`） |
| Backend | `GRAPHIFY_BACKEND=none` + `extract --code-only` |
| Cursor 整合 | `graphify install --project --platform cursor` → [`.cursor/rules/graphify.mdc`](../../.cursor/rules/graphify.mdc) |
| 既有 rules | 全部未改（reply-zh-hk／no-emoji／vuln-tsunami 等） |
| Git hooks | **未**安裝 |
| Cloud MCP | **未**連接 |

## 索引

| 項目 | 值 |
|------|-----|
| Commit | `62331d60` |
| 產物 | 本機 `graphify-out/`（已 gitignore；**唔部署**） |
| 規模 | 7423 nodes · 15693 edges · 377 communities |
| Code 檔 | 1484（跳過 407 非 code：docs／images／papers） |
| 關係 | ~99% EXTRACTED · ~1% INFERRED |

### 已知缺口

- SQL migrations：未裝 `graphifyy[sql]` → 39 個 `.sql` 無符號（需讀原始檔補足）。
- 動態路由／設定／外部服務：圖未必涵蓋；改動前用精準搜尋核實。
- `tokens-clear.css` 被敏感過濾略過（誤報風險：改名或接受略過）。

## 主要模組（責任）

```text
app/                 路由與頁面（practice／notes／subjects／api）
components/          UI
data/questions/      題庫正本（TS）；load.ts 按科 lazy import
data/subjects.ts     科目 metadata
lib/auth/            Supabase Google OAuth（server／browser／session）
lib/notes/notes.ts   題庫確定性聚合筆記（非 AI）
lib/progress.ts      本機／記憶體進度
lib/sync.ts          本機 key 與雲端同步協調
proxy.ts             全站入口：canonical redirect + rate limit + CSP nonce
utils/supabase/      getServiceSupabase（service role，server-only）
vercel.json          hkg1 + cron → /api/cron/exam-day-nudge
```

## 關鍵流程（抽查）

1. **Request 邊界**  
   `proxy()` → `canonicalSiteRedirectUrl` → `rateLimit`／`isUnmeteredApiPath` → `withCsp`／`buildCsp`（[`proxy.ts`](../../proxy.ts)、[`lib/csp.ts`](../../lib/csp.ts)）。  
   影響：幾乎每個 HTML 請求都動態處理 → Fluid CPU。

2. **Auth**  
   `GoogleSignInButton` → `signInWithGoogle` → browser Supabase；server 身份：`getSyncUserId`／`getAuthUser`（[`lib/auth/server.ts`](../../lib/auth/server.ts)）。  
   `proxy` 與 `getSyncUserId` **無**直接 call path（邊界與身份分層）。

3. **進度**  
   Client：`lib/progress.ts` + `lib/sync.ts`；雲端：`app/api/progress/route.ts` `GET`／`POST` → `getServiceSupabase`／`currentUserId`（唔信任 client `user_id`）。

4. **筆記**  
   [`lib/notes/notes.ts`](../../lib/notes/notes.ts)：`buildTopicNote`／`extractTrap` ← 題庫 + reverseLog + topicStats；UI：`app/notes/[subject]/NotesSubjectClient.tsx`。

5. **Cron／成本入口**  
   [`vercel.json`](../../vercel.json) `crons` → [`app/api/cron/exam-day-nudge/route.ts`](../../app/api/cron/exam-day-nudge/route.ts)。  
   另：大量 preview deployment 推高 Functions Storage（見 WP1）。

## 使用方式

```bash
export PATH="$HOME/.local/bin:$PATH"
export GRAPHIFY_BACKEND=none
graphify query "具體問題"
graphify explain "<節點或檔案>"
graphify path "<nodeA>" "<nodeB>"
# 改碼後（影響範圍）：graphify update .
```

唔好把整份 `graph.json` 貼入對話。
