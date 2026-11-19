# WP4 隔離驗收（WP3-A+B+C）

狀態：**通過（隔離）** · 2026-11-19（Asia/Hong_Kong）  
範圍：功能路徑＋紅隊回歸；**未**批准 production 發布（WP5）。

實作分支：`cursor/wp3-abc-funnel-compliance-67b4` · PR #233

## 驗收矩陣

| ID | 檢查 | 方法 | 結果 |
|----|------|------|------|
| A1 | quadratic 頁有 `/practice?subject=math&topic=quadratic_equations` | 單元測試 `paper-query-params` + 源碼 | **PASS** |
| A2 | 同頁筆記／列印 CTA | 同上 | **PASS** |
| B1 | 無 `components/AdSlot.tsx`、無廣告預留文案 | 檔案／rg + 測試 | **PASS** |
| B2 | robots 單一來源 `app/robots.ts`；無 `public/robots.txt` | 檔案 + 測試 | **PASS** |
| B3 | production `robots.txt` 對齊（Allow／Disallow /api／Sitemap） | `curl www.dselevelup.com/robots.txt` → 200 | **PASS** |
| B4 | off-syllabus 標題無 emoji | `emoji-guard` + rg | **PASS** |
| C1 | `resolvePaperSubject/Topic` 接受 math×quadratic；拒無效 | 單元測試 5 項 | **PASS** |
| C2 | notes 紙筆連結帶 subject+topic | 源碼 rg | **PASS** |
| C3 | `/result` 訪客 C1 文案（刷新清記憶體） | 單元測試 | **PASS** |
| P1 | production quadratic **尚未**有新 CTA | `curl` 正式頁 | **預期**（等 WP5） |

## 紅隊筆記

- Truth Report（2026-10-22）對 AdSlot／雙 robots **過時**；以 main 現況為準。  
- Fluid Active CPU（~6h9m）**唔**喺本輪範圍；WP5 後另開。  
- 本環境缺完整 `node_modules`，未跑全量 `next build`；WP4 以單元測試＋正式站合規抽查＋源碼斷言為隔離證據。

## 修復（WP4 期間）

- 抽出 `lib/paper/queryParams.ts` 供測試  
- 新增 `lib/__tests__/paper-query-params.test.mts`（8／8 PASS）

## 下一步

回覆 **`批准發布`**（或等價）先開 WP5：合併 #233 → production → 再 curl／人手 smoke 正式站 CTA。
