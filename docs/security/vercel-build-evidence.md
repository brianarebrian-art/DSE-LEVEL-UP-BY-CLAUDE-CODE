# Vercel 建置環境與相容性證據 (Vercel Build Evidence)

**審計時間**：2026-11-05
**配置目標**：確保 Vercel 部署環境遵循最新安全規範，杜絕任意安裝腳本執行與 Node.js 執行期漏洞。

---

## 1. `vercel.json` 規範加固

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm ci --ignore-scripts",
  "regions": ["hkg1"],
  "crons": [
    { "path": "/api/cron/exam-day-nudge", "schedule": "0 14 * * *" },
    { "path": "/api/cron/exam-day-nudge", "schedule": "30 22 * * *" }
  ]
}
```

- **$schema**: 引入 Vercel 官方 JSON Schema 進行驗證。
- **framework**: 明確指定 `nextjs`。
- **Node 版本控制**: 依 Vercel 規範於 `package.json`（`engines.node: "20.x"`）及 `.nvmrc`（`20`）鎖定執行期環境。
- **installCommand**: 使用 `npm ci --ignore-scripts`，封鎖所有套件之 preinstall/postinstall 惡意腳本執行。
- **regions**: 限定於 `["hkg1"]`（香港節點），確保最低延遲與合規要求。

---

## 2. 驗證結論

建置配置與 CI 工作流完全契合，確保無論在本地或雲端部署環境中均具備一致的安全保護基線。
