# 載入速度目標（0.2 秒）

創辦人要求全站頁面載入縮短至 **0.2 秒**。

## 可達到嘅部分

| 目標 | 做法 |
|------|------|
| 香港用戶 TTFB | Functions 預設區域 `hkg1`（Vercel project + `preferredRegion`） |
| 首頁／非數學頁 payload | 根 layout **唔再**全域載入 KaTeX CSS（~24KB）；改由 `MathText` 按需引入 |
| 靜態圖示／吉祥物 | `/owl/*`、`/icons/*` 長 cache（`immutable`） |
| Fluid Compute | 已開，減少冷啟動 |

## 唔可以保證「每一頁、每一次」都係 0.2 秒嘅原因

1. **CSP 每請求 nonce**（audit #7 / A7-4 B）：`app/layout.tsx` 讀 `headers()` → 全站動態渲染 → HTML 係 `private, no-store`，**CDN 唔可以快取 HTML**。Nonce 同靜態／ISR 互斥（見 Next.js CSP 指南）。
2. **網絡物理下限**：香港 ↔ 伺服器 RTT、TLS、裝置 CPU；完整「頁面可用」還要下載 JS／字型／圖片，唔止 TTFB。
3. **登入／Founder／Admin 頁**：必須即時查 Auth／資料庫，無法同公開行銷頁一樣預渲染。

若要逼近「公開頁 CDN HIT < 200ms」，需要**另行批准**改 CSP 策略（例如 hash／外部 theme script + 允許公開路由 ISR），會改寫現有安全測試 `lib/__tests__/csp-nonce.test.mts`。

## 量度

- Vercel Speed Insights（正式環境）
- `curl -w '%{time_starttransfer}\n' -o /dev/null -s https://www.dselevelup.com/`
