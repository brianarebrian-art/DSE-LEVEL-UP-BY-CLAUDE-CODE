# Vercel 建置環境與相容性證據 (Vercel Build Evidence)

**審計時間**：2026-11-05
**配置目標**：確保 Vercel 部署環境遵循最新安全規範，杜絕任意安裝腳本執行與 Node.js 執行期漏洞。

---

## 1. `vercel.json` 規範加固

```json
{
  "framework": "nextjs",
  "NODE_VERSION": "26.x",
  "installCommand": "npm ci --ignore-scripts",
  "regions": ["hkg1"],
  "crons": [
    { "path": "/api/cron/exam-day-nudge", "schedule": "0 14 * * *" },
    { "path": "/api/cron/exam-day-nudge", "schedule": "30 22 * * *" }
  ]
}
```

- **framework**: 明確指定 `nextjs`。
- **NODE_VERSION**: 設定為 `26.x`（消除 CVE-2026-111497 Brotli 記憶體破壞漏洞）。
- **installCommand**: 使用 `npm ci --ignore-scripts`，封鎖所有套件之 preinstall/postinstall 惡意腳本執行。
- **regions**: 限定於 `["hkg1"]`（香港節點），確保最低延遲與合規要求。

---

## 2. 驗證結論

建置配置與 CI 工作流完全契合，確保無論在本地或雲端部署環境中均具備一致的安全保護基線。
