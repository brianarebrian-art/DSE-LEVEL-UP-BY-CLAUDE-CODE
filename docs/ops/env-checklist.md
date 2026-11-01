# 環境變數 Checklist（Phase 0）

唔好把 secret 值貼入聊天或 commit。只打勾「有／無」。

執行腳本（只檢查**本地** `process.env` 鍵是否非空；CI／本機未必有生產值）：

```bash
npx --yes tsx@4.19.2 scripts/ops/env-checklist.mts
```

## 生產必備（學生核心）

| 變數 | 用途 | Phase 0 筆記 |
|------|------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Vercel 有鍵 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 瀏覽器題庫／auth | Vercel 有鍵 |
| `SUPABASE_SERVICE_ROLE_KEY` | Server 寫入 | Vercel 有鍵 |
| `NEXT_PUBLIC_AUTH_ENABLED` | 顯示登入 | Vercel 有鍵 |
| `NEXT_PUBLIC_SENTRY_DSN` | 錯誤監控 | Vercel 有鍵 |
| `ADMIN_EMAILS` | `/admin` | Vercel 有鍵 |
| `FOUNDER_GOOGLE_SUB` | `/founder` 閘 | Vercel **有鍵**；值請喺 Founder settings 確認「已設定」 |

## 建議但可缺

| 變數 | 缺咗會點 |
|------|-----------|
| `CRON_SECRET` | exam-day nudge 503（Phase 0：**Vercel 未見此鍵**） |
| `REVIEWER_EMAILS` | quality 覆核 API 無人可寫 |
| `WALL_SALT` | 若 wall 仍關可暫緩 |
| `VAPID_*` | 推送功能靜默關閉 |
| `FOUNDER_AI_*` | Founder AI 指令列 unconnected |

## 應視為退役（唔好依賴）

`AUTH_GOOGLE_*`、`AUTH_SECRET`、`AUTH_URL`、Better Auth 相關、`PREMIUM_EMAILS`（付費已刪）。  
Phase 0 **只記錄** Vercel 仍有部分 Auth.js 殘鍵；清理另開批准。
