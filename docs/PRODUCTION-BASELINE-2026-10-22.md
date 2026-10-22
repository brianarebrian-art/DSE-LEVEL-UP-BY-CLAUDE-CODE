# 正式部署基線：2026-10-22

GitHub `main` 與正式 production 的核實 SHA 都是 `d25c63740a9184d0303e2558c8ee6f51643258d6`。這是本輪修復前版本，不是本輪 PR 已上線的證據。

| 項目 | 真實結果 | 證據 |
|---|---|---|
| GitHub main | d25c63740a9184d0303e2558c8ee6f51643258d6 | `gh repo clone` 後 `git rev-parse origin/main` |
| Vercel 專案 | prj_CQRC5oit3FL5KrrmCaAXxqUugfYu | 2026-10-22 `list_projects`／`get_project` |
| Production deployment | dpl_BgDXhe8AJgDVuFPVnxEijCTbBEQw | `get_deployment` |
| Deployment state / target | READY / production | 同上 |
| GitHub deployment source | main / d25c63740a9184d0303e2558c8ee6f51643258d6 | `meta.githubCommitRef`／`meta.githubCommitSha` |
| 正式網域 | https://www.dselevelup.com | `lib/site.ts`、Vercel alias、HTTP 回應 |
| HTTPS 與 www | HTTP 及 non-www 均 308 到正式 HTTPS www | 有限 HTTP 基線請求 |
| 核心八頁 | 8 個普通訪客 HTTP 200 | 2026-10-22 原始 HTML 抽樣 |
| 未知 URL | HTTP 404 | `/this-route-does-not-exist` |
| Sitemap | HTTP 200、95 URL | 基線 XML；不是 Google 索引數量 |
| 新 PR 上線 | BLOCKED：尚未合併到 main | 不能以本表當作新版本部署 |
| Google 索引／流量 | BLOCKED：無本資源 Search Console 資料 | 部署狀態不提供此數據 |

可重跑的檔案證據原件已保存於本次交付的 evidence；原始隔離環境位置是 `/home/ubuntu/dse-evidence/production-baseline.json` 及相應 HTML 回應。Vercel 操作只讀取本專案部署設定，沒有修改網域、付款方案、資料庫或正式 deployment。
