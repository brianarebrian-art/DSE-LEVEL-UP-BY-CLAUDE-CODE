# WP3-A+B+C 執行記錄

狀態：**已實作 · WP4 隔離驗收通過** · 2026-11-19（Asia/Hong_Kong）  
批准：創辦人「批 WP3-A+B+C」  
WP4：[`WP4-ACCEPTANCE-2026-11-19.md`](./WP4-ACCEPTANCE-2026-11-19.md)

計劃來源：[`WP2-SITE-IMPROVEMENT-PLAN-2026-11-19.md`](./WP2-SITE-IMPROVEMENT-PLAN-2026-11-19.md)（PR #232）

## 做咗咩

### A — 漏斗 CTA（`math` × `quadratic_equations`）

- `/dse-maths/quadratic-equations`「下一步」改為主 CTA：練習／筆記／列印卷  
- 直達：`/practice?subject=math&topic=quadratic_equations` 等

### B — 合規（AdSlot／robots／emoji）

| 項目 | 結果 |
|------|------|
| `AdSlot` | **main 已刪**（SEO truth PR）；本輪確認無引用 |
| `robots` | **單一來源** `app/robots.ts`；無 `public/robots.txt` |
| off-syllabus emoji 標題 | `CategoryView` 移除 🗣️／🔍／💬（跟 no-emoji 規範） |

### C — paper query ＋ 訪客文案

- `/paper-warrior?subject=&topic=` 由 server `searchParams` 傳入 client 預填（無效 id 忽略）  
- `/notes/{subject}` 紙筆連結帶上當前課題  
- `/result` 訪客文案寫明：刷新／關分頁會清記憶體進度（C1）

## 未做（刻意）

- WP4 完整紅隊／WP5 批准發布  
- Fluid Active CPU 優化（見下）  
- Batch D／E（bank topic 登記、手機大改）

## Fluid Active CPU（WP5 之後）

創辦人 Dashboard（2026-11-19）：**Fluid Active CPU ≈ 6h 9m**（免費原額 ~4h；臨時 3x → 12h 至 Dec 19）。每月爆 quota。

**本輪唔改 Fluid。** WP5 完成後另開工作包，候選方向（待驗證，唔當承諾）：

1. 減 proxy／edge 每 request 工（CSP／rate-limit 路徑、`/api/*` 熱點）  
2. 維持題庫直連 Supabase（已減 Vercel Edge）  
3. 查 Fluid 計費係邊啲 function／middleware 燒 CPU  
4. 避免無謂 preview／重 deploy（同 Functions Storage）  

容量現況摘要：Functions Storage **9.54／10 GB** · Deployment Storage **2.78／10 GB** · Fluid Active CPU **6h9m／12h（3x）**。  
截圖：[`assets/vercel-usage-overview-2026-11-19.png`](./assets/vercel-usage-overview-2026-11-19.png)

## 驗收（WP4 建議）

1. 開 `/dse-maths/quadratic-equations` →「開始二次方程練習」→ 完成一節 → `/result` 見訪客文案  
2. `/notes/math?topic=quadratic_equations` →「印一份紙筆卷」→ subject/topic 已選  
3. `/off-syllabus` 任一分類：無廣告位、標題無 emoji  
4. `curl -sS https://www.dselevelup.com/robots.txt`（發布後）只反映 `app/robots.ts`
