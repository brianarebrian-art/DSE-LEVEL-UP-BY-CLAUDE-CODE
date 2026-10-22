# DSE Level Up — 本輪 SEO 發版驗收

**驗收日期：2026-10-22（香港時間）。基線：`d25c63740a9184d0303e2558c8ee6f51643258d6`。分支：`seo/truth-audit-quality-pages`。**

## 結論

本輪交付可建置的 Next.js 修復、四篇完整教學草稿、一篇誠實的題庫使用指南、逐項重審的80筆內容地圖，以及部署／監測文件。**本機品質閘已通過；本輪 Published = 0。** 四篇教學保持 Draft/noindex，三個AI網址保持 Blocked/noindex；即時生成與作文機評沒有被偽造為已提供。

正式網站尚未部署本輪修復，沒有 Search Console 資源授權、Google索引版本、搜尋成效或真實使用者效能資料。這些一律不能從下列通過結果推導。

## 1. 同一版本的工程品質閘

| 檢查 | 結果 | 證據（完整交付包的 evidence 目錄） |
|---|---|---|
| `npm run lint -- --max-warnings=0` | 通過：0 errors、0 warnings | `accepted-release/lint.log`、`checks.json` |
| `npm test` | 1,352 / 1,352 通過；0失敗、0跳過 | `accepted-release/test.log` |
| `npm run qa` | 所有原有品質閘通過，包括術語、情緒安全、題庫結構、宣稱、對比、i18n、導航及接線 | `accepted-release/qa.log` |
| `npm run build` | Next.js 16.3.8 webpack 正式建置及 TypeScript 通過 | `accepted-release/build.log` |
| 題庫前後指紋 | 完全相同 | `qbank-parity/qbank-fingerprint-before.jsonl`、`qbank-fingerprint-after.jsonl` |
| 新增工具／CI | Python語法通過；CI YAML由現有js-yaml成功解析；相同HTTP命令在本機通過 | `scripts/seo/`、`.github/workflows/ci.yml` |

中途曾有JSX apostrophe、過時helper名稱斷言與tsx模組載入形狀造成失敗，已修正並重跑完整測試。最終結果不是拿中途局部通過拼成整站成功；處置見 `REGRESSION-REPAIRS.md`。i18n零命中不代表所有教材已全文翻譯：固定教材及靜態雙語的範圍見 `EDITORIAL-LANGUAGE-POLICY.md`、`UI-LANGUAGE-REMEDIATION.md`。

## 2. 不執行JavaScript的原始 HTTP 驗收

以最新 `npm run build` 後的 `npm run start` 服務測試，沒有用dev代替。命令與新增PR CI相同：

```bash
python3 scripts/seo/verify_responses.py \
  --origin http://127.0.0.1:3001 \
  --canonical-origin https://www.dselevelup.com \
  --routes docs/seo-verification-routes.json \
  --sitemap --strict --output /tmp/dse-seo-smoke
```

共 **112個獨立URL × 訪客、Googlebot、Twitterbot三種User-Agent = 336份原始回應，0項驗證問題**。其中315份200回應、21份預期404回應；404涵蓋未知靜態網址、不存在的科目／筆記／史料／場景／分類及production-only開發頁。

**97個實際sitemap網址**全部通過：單一H1、自身canonical、150–160 Unicode字符description、OG／Twitter metadata、JSON解析、安全nonce及索引政策。跨這97頁的title、H1、description與canonical沒有重複；全部有BreadcrumbList及唯一main。25個學科筆記實例有TechArticle，headline與真正H1一致。

證據：`evidence/accepted-http/responses.json`、每個URL／User-Agent的原始HTML，以及 `evidence/accepted-summary.json`。Sitemap來源是 `app/sitemap.ts`；私有外殼、帳戶、後台、測試、感謝、AI及編輯草稿不在輸出中。`robots.txt`只保留App Router單一來源，不阻擋公開CSS／JavaScript／圖片；noindex不是存取控制，原有權限仍保留。

測試User-Agent不是來自Google的真實爬蟲。未登入後台、未提交覆核決定、未讀取學生個人資料；不把這個公開／指定路由範圍稱為所有授權角色的端到端驗收。

## 3. 手機、平板與桌面

八個指定核心URL及兩個新增教學URL，在390×844、768×1024、1440×1000共 **30個實際Chromium視窗檢查，0錯誤**：可見H1唯一、main及main-content ID唯一、無未受保護的水平溢出、無瀏覽器執行期例外。每頁保存Tab焦點紀錄、全頁和頁首截圖，表格另外保存細節。拍攝前回到頁首，避免把鍵盤導航後的頁底誤當首屏。

人工檢视390px英文文體頁與AI指南首屏：正文可讀、標題可見，指南在首屏明示「Draft／功能受阻」及沒有prompt→新題API。表格可在窄屏閱讀，必要時由有提示的容器承接水平捲動。

證據：`evidence/accepted-browser/browser-results.json`與30組截圖。鍵盤焦點紀錄包含可見outline；原有contrast guard通過。這不是完整WCAG認證、每個裝置的實機驗收、Google行動索引判斷或真實Core Web Vitals。

## 4. 五頁内容與功能邊界

| 頁面 | 已交付內容 | 實際狀態／未完成要求 |
|---|---|---|
| `/dse-maths/quadratic-equations` | 因式分解、配方法、公式、判別式與根；3條完整例題、7項錯誤訂正及實際內鏈 | Draft/noindex；AI CTA只到誠實使用指南，非可用即時生成器 |
| `/dse-english/writing-format` | Letter、Article、Report、Speech比較，讀者／語氣／結構、連接詞、大綱與格式錯誤 | Draft/noindex；CTA為真正寫作自評，AI Essay Feedback仍Blocked |
| `/dse-maths/question-types/quadratic-discriminant` | 原創判別式題型、逐步參數解法、失分位與兩條相似題 | 採使用者允許的版權後備，明確非官方Past Paper題解；Draft/noindex |
| `/dse-physics/motion-equations` | 一維勻加速條件、四公式、v–t表格、3條分步例題與7項錯誤 | Draft/noindex；CTA為現有物理題庫，不是AI出題 |
| `/ai/practice-generator` | 真實支援範圍、輸入網址／題庫輸出示例、步驟、限制、私隱、FAQ；WebApplication只描述真正`/practice` | Blocked/noindex；不是已提供的AI生成器 |

數學、物理及示例的覆核見 `page-evidence-*.md`、`IMPLEMENTATION-VALIDATION.md`。所有主要內部目的地有實際路由；原錯誤slug已改為math／english／physics。SENSEI檢索真人審核卡，不作自由生成。沒有虛构官方評分準則、教師認證、評分、作者、日期、用戶數或成果保證。

## 5. 內容地圖

原80筆已逐項審核，而不是發布80頁。V2的11欄在Markdown與CSV同步；狀態為52 Draft、21 Blocked、6 Merged、1 Deleted，PUBLISH NOW／Published為0。優先決策為39 P1 NEXT、13 P2 LATER、21 BLOCKED、6 MERGE、1 DELETE。

其中合併紀錄不建立第二個canonical；過時中文卷四提案已刪除。非Merged／Deleted提案的description也經格式檢查為150–160字符，但提案文字不是已上線內容。不存在的工具、授權或考綱證據不足不能靠填滿表格變成可發布。

## 6. 尚未完成／受阻

| 項目 | 原因／所需資訊 | 影響／建議行動 |
|---|---|---|
| 本輪正式部署 | 修復只在獨立分支，未合併main及核對production SHA | 先審閱PR及實際CI；合併後核對Vercel READY與merge SHA，再抓取正式URL |
| 四篇教學Published | 尚未完成正式HTML及release確認；仍有意保持編輯Draft政策 | 通過後另做release PR，解除四個Draft並將真實URL加入sitemap；不能先標Published |
| 即時AI生成、作文機評 | repo沒有相應API；現行憲章禁止新增付費第三方API及作文／長答自動評分 | 先作產品／憲章決策，或接受非AI題庫與自評定位；不能將指南當成功能交付 |
| 官方Past Paper題解 | 未有可公開重刊授權 | 本輪已交付允許的原創題型解析；要正式題解須提供來源與適用授權 |
| Search Console、Google-selected canonical、索引及成效 | 無已驗證資源權限、URL Inspection或Performance匯出 | 按部署清單提供資源權限或原始匯出，逐頁記錄8個核心URL；沒有資料填Blocked，不填0 |
| Rich Results、field CWV、完整WCAG／實機 | 沒有Google測試／CrUX期間資料或完整可存取性審核 | 不把schema解析、靜態對比閘或一次Chromium檢查當成認證 |
| 每週／每月監測 | 文件、KPI及CI回歸檢查已交付，但沒有GSC資料授權及週期排程 | 決定負責人及授權後啟用真正監測；PR CI不是GSC監測系統 |

## 7. 下一步及交付物

完整交付包包含使用者要求的八項：Truth Report、技術修復、V2 Markdown／CSV、五頁完整Next.js程式碼、部署／索引清單、監測方案、sitemap及PR描述，並附原始驗收證據。全部新增／修改／刪除檔案見 `SEO-CHANGED-FILES.md`。

先處理四篇已完成教學的正式release，而不是批量建立更多頁；AI功能應先決定合規定位。Search Console的精確操作、8 URL紀錄及判斷標準在 `DEPLOYMENT-INDEXING-CHECKLIST.md`。任何部署、sitemap提交或要求索引都不能被記作Google已收錄或SEO成效提升。
