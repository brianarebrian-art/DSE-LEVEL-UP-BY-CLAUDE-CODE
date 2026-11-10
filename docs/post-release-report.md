# Post-Release Verification & Monitoring Report (發布後驗證清單)

## 驗證排程與執行目標 (D+1 至 D+7)

| 時間點 | 驗證項目 | 目標值 / 驗收標準 | 監控工具 / 指令 |
|---|---|---|---|
| **D+1 (24小時)** | SEO 端點 HTTP 狀態與爬蟲通訊 | `/robots.txt`、`/llms-full.txt`、`/ai.txt`、`/sitemap-questions.xml` 回傳 200，無 500 錯誤 | `curl -I https://dselevelup.com/llms-full.txt` |
| **D+1 (24小時)** | Google Search Console 結構化資料 | QAPage Schema 無 Critical Issue，Rich Results 檢測合法 | Google Search Console 網址審查 |
| **D+3 (72小時)** | Vercel Analytics 首頁轉化率 | 首頁到點擊開始轉換率預期由 <5% 提升至 >20% | Vercel Analytics Funnel |
| **D+7 (一週)** | 搜尋引擎收錄覆蓋率 | Google 索引題目頁數由 ~100 題擴展至 >5,000 題 | Search Console Coverage Report |
| **D+7 (一週)** | AI 引用就緒度抽測 (GEO/AEO) | 執行 `scripts/seo/validate-citation.mjs`，測試外部模型引用比例 | `node scripts/seo/validate-citation.mjs` |
| **D+7 (一週)** | 廣告投放轉換成本 (CPA) | Meta/Google Ads CPA < $15 HKD，無觸發自動暫停止損 | Meta Ads Manager / Google Ads |

---

## 異常排查與應對措施 (Rollback & Fix Protocol)
1. **若 Google Search Console 報 Schema 格式錯誤**：
   - 檢查 `lib/seo/schemas.ts` 的 `QAPage` 定義，確認 `mainEntity.acceptedAnswer` 包含完整字串且非 null。
2. **若特定廣告組 CPA > $15 HKD**：
   - 廣告預算控管腳本自動觸發暫停；若未暫停則立即手動進入 Meta/Google 後台關閉該 Campaign。
3. **若題目靜態頁面引致記憶體激增**：
   - 確認 Next.js 採用 ISR / on-demand 渲染，避免一次性靜態預算導致 out-of-memory。
