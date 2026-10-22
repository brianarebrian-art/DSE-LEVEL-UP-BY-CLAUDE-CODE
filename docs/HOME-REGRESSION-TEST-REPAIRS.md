# 首頁回歸測試來源修復

**日期：** 2026-10-22
**範圍：** `lib/__tests__` 內六個首頁相關測試，以及本紀錄。

## 背景

`app/page.tsx` 現在是伺服器組合層：它負責 metadata、渲染 `<HomePageClient />`，另附一段 SEO 導覽。首頁的互動 UI、Hero、快速開始、統計牆、信任披露、吉祥物與 `ContinueCard` 已移至 `app/HomePageClient.tsx`。

基線紀錄 `/home/ubuntu/dse-evidence/baseline-test.log` 中以下失敗均由測試仍直接掃描舊的 `app/page.tsx` 引起，而非產品功能缺失：

| 測試檔 | 基線失敗的首頁驗證 | 修復後讀取來源 |
|---|---|---|
| `continue-card.test.mts` | `<ContinueCard />` 接線 | `app/HomePageClient.tsx` |
| `corner-buttons.test.mts` | `.hero-mascot` 與 continue card 的避讓 | `app/HomePageClient.tsx` |
| `home-no-katex.test.mts` | 純文字算式與首頁元件的 KaTeX 依賴 | `app/HomePageClient.tsx` |
| `home-quick-start.test.mts` | `sessionMinutes()`、Hero 快速開始、底部 CTA | `app/HomePageClient.tsx` |
| `subject-copy.test.mts` | `statNums` 與 Hero 首次繪製可見性 | `app/HomePageClient.tsx` |
| `trust-copy.test.mts` | Hero 的自動檢查／註冊教師審定披露 | `app/HomePageClient.tsx` |

## 變更原則

- **只更正來源路徑。** 所有原有 regex、正向功能驗證及 negative self-test 均保留。
- 不新增 skip、disable 或移除 assertion。
- 沒有修改 App 程式、SEO、package、對外 claims 或其他測試。

## 驗證

已在 repo 根目錄執行：

```bash
/home/ubuntu/.npm/_npx/045a0aaf03fbb29c/node_modules/.bin/tsx --test \
  lib/__tests__/continue-card.test.mts \
  lib/__tests__/corner-buttons.test.mts \
  lib/__tests__/home-no-katex.test.mts \
  lib/__tests__/home-quick-start.test.mts \
  lib/__tests__/subject-copy.test.mts \
  lib/__tests__/trust-copy.test.mts
```

結果：**38 passed、0 failed、0 skipped、0 todo**（約 2.0 秒）。完整輸出存於：
`/home/ubuntu/jobs/job_zns9XUza/specified-home-regression-tests.log`。
