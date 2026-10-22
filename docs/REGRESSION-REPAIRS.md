# 回歸修復紀錄：13 項 npm test 失敗

**日期：** 2026-10-22
**範圍：** 只處理 `/home/ubuntu/dse-evidence/final-test.log` 中的 13 項失敗；未執行完整 `npm test`、未執行 build、未修改題庫資料、未修改 `components/Seo/` 或所有文章頁。

## 修復項目

| 原失敗 | 修復 | 未弱化測試的證據 |
|---|---|---|
| Originkit reduced-motion 降級 | `originkit-motion.test.mts` 改為收集所有 `@media (prefers-reduced-motion: reduce)` 區塊，而非錯把最後一個無關區塊視為唯一區塊。 | 仍逐一要求 `.particle-bg`、`.combo-flame`、`.scatter-title`、`.achievement-pop` 均存在於 reduced-motion 降級規則；SEN 及 light 主題斷言不變。 |
| `llms.txt` 題庫總數、MC／書寫題、逐科數、適用情境 | 恢復由 `summary.generated.ts` 驗證的 26,633 題、25,572 MC、1,061 書寫題與 25 科總數；加入 `When to use this` 及明確的 `Do NOT reach for us` 限制。 | 原本 parity assertions 全數保留；數字仍逐項同即時 generated summary 比對。 |
| 外部 GitHub 連結 | credits 頁的 GitHub 出口改用既有 `ExternalLinkGate`。 | 實際可點擊的外站連結仍需經確認對話框；沒有刪除 `target="_blank"` 禁令。 |
| 分享文字中的社交網址 | 為 `OffSyllabusShareButton` 加入一項具原因的精確白名單：網址僅寫入 clipboard，元件沒有 `<a>`、跳轉或網絡請求。 | 白名單存在性與理由長度檢查維持；其餘外部 URL 仍必須使用閘門。 |
| metadata description | `page-metadata.test.mts` 亦辨識「先宣告 `const description`，再以 object shorthand 傳入 `createSeoMetadata`／`completeSeoMetadata`」的等價有效寫法。 | 測試仍要求 description 已宣告且確實傳入 helper；沒有豁免任何頁面或移除摘要要求。 |
| `/sign-in-error`、`/start` 的 noindex | 兩個測試由掃描舊式 `robots` 原始碼改為載入實際 route `metadata`，驗證一般 robots 與 `googleBot` 均輸出 `index: false`。 | 保留 route 必須呼叫 `completeSeoMetadata`、不得列入 sitemap／仍有導航分類等斷言；改為檢查實際行為，非字串外觀。 |
| `llms.txt` 信任與 AI／歷屆試題誤讀 | 恢復精確文字 `no person approves them beforehand`，將「AI」與官方歷屆試題服務的否定聲明分拆，並把「not been reviewed by registered teachers」及 `opt-in and off by default` 保持為可驗證的完整句。 | `trust-hardening` 的「不得聲稱 AI 分析歷屆試題」掃描和自動發布規則 assertions 均原樣通過；沒有改為 skip 或例外。 |

## 驗證

只執行受影響測試：

```bash
npx --yes tsx@4.19.2 --test \
  components/__tests__/originkit-motion.test.mts \
  lib/__tests__/claim-parity.test.mts \
  lib/__tests__/external-links.test.mts \
  lib/__tests__/page-metadata.test.mts \
  lib/__tests__/seo-structured-data.test.mts \
  lib/__tests__/sign-in-error.test.mts \
  lib/__tests__/start-route.test.mts \
  lib/__tests__/trust-hardening.test.mts
```

結果：**45 passed、0 failed、0 skipped、0 todo**（約 2.05 秒）。

## 未執行項目

- 沒有執行完整 `npm test`（依任務要求只跑受影響測試）。
- 沒有執行 `npm run build`，沒有 commit 或 push。

## 最後完整測試發現的科目摘要名稱耦合

完整1352項測試初輪僅 `subject pages use the fuller search description` 失敗：舊測試要求原始碼字面必須是 `description: subjectMetaDescription(meta)`，而新資料驅動helper已換為 `subjectSeoDescription`。沒有把helper改名偽裝舊行為，也沒有刪除品質要求。

此項現載入真正 `generateMetadata()`，遍歷全部25個有效科目，要求description為150–160 Unicode code points、包含真實科目名稱及原課題介紹、包含即時題数、沒有內部規劃用語、canonical正確，而且title與description沒有重複；舊helper對math的「以科目名稱開始／保留課題列表」斷言仍保留。完整最終結果另見 `SEO-RELEASE-VALIDATION.md`。

同輪lint指出致謝頁兩個未轉義JSX apostrophe，已改成 `&apos;`，英文顯示內容不變；沒有加eslint-disable或調整規則。

實際tsx測試執行環境還指出 route module有兩種匯出形狀：有的提供named `generateMetadata`，有的經CJS default物件包裝。載入現先選真正named function，否則才取default module，避免誤選Next.js的React default頁面函數。這是測試載入相容性修正，25科metadata的內容、長度、真值及獨特性斷言沒有減少。中途失敗log仍保留，最終完整測試另附退出碼。
