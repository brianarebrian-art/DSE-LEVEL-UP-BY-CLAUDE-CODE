# 自學筆記／課題練習第一階段交付

## 邊界與安全

這是 PR #246 之上的漸進升級，不是把 296 份摘要宣稱為完整教材。以現有香港 DSE 平台為範圍；沒有小學課程／年級對照資料，不把 DSE 內容改標為適合小學生。未改資料庫、登入機制、付費政策或任何題庫題目，未新增 production dependency，未合併或更動正式站。

新增課題筆記、列印說明、練習準備頁及 meta 採繁體中文。保留全站既有英文切換和英文科原文；沒有宣稱已完成全站中文化。新筆記正文固定繁中，並以 lang=zh-HK 標示，避免把英文切換當成已有完整英文教材。

## 實查結構／樣式／SEO

- 現有 `/subjects`、`/subjects/[subject]`、`/notes`、`/notes/[subject]`、`/notes/[subject]/[topic]` 及 `/practice?...` 保留。
- 25 科、296 課題已有資料摘要，但只 5 個課題接上專屬原創圖解。其餘常見為既有內容重組，並不具備完整教學結構。
- 原有筆記用 client 載入正文及個人題庫進度；本輪把課題的學習正文改為 server-rendered，不必等個人資料載入才能看筆記或列印。科目總覽原有個人進度功能保留。
- 現有 QR 編碼器為零依賴 SVG，帶四格靜區。保留原實作與舊練習 URL，不改寫舊紙本的網址。
- 原有 canonical、metadata、sitemap、robots、Organization、WebSite 繼續使用；沒有新造補習中心、地址、評價或認證。
- 37 個課題欠至少一層選擇題，其中可能包含以書寫為主的課題。數量檢查不等於教育品質評核，不應為湊三層而把書寫題改成 MC。

## 這一階段完成甚麼

### 全科共用架構

- 科目總覽：科目圖示、DSE 程度、課題卡、題數及摘要／完整教材界線。
- 課題正文：唯一中文 H1、核心概念、真實筆記要點卡、既有專屬圖解（若有）、應用提示、常見錯誤、可見 FAQ 及同源 JSON-LD。
- 新 `TopicLesson` 擴充格式：學習目標、詞彙、分步例題、檢查方法、自我檢查、挑戰題、作者、更新日期、review=draft。
- 二次方程示範：三組原創例題（因式分解、求根公式、長方形情境）、三條自我檢查、參數重根挑戰及既有拋物線圖解。**編輯草稿，不冒稱教師審定。**
- 其他課題保留既有摘要，明示缺少完整例題等內容，不以同一段模板假充每科完整教材。重點卡是實際筆記內容的視覺整理，**不是**專屬科學／幾何示意圖的替代完成證據。

### 新增穩定練習準備路由

`/practice/[subject]/[topic]` → 顯示課題、真實可用題數、混合／基礎／進階／挑戰 → `/practice?subject=…&topic=…&difficulty=…`。

- 難度選項真正過濾現有 MC bank。所選難度沒有題目則停用；直接手改空難度 URL 也明示無題，不借其他課題或難度補足。
- 數量不足標準 10 題時只出現有題目；不複製題目湊數。
- Google 登入返回 URL 保留難度；不修改 auth、學生進度 schema 或寫入權限。
- 現有混合練習、書寫卷、自適應排序、結果頁正確率／用時等流程保留。**沒有聲稱題庫已全面提高難度。**
- 準備頁是任務入口，維持 noindex／不進 sitemap，避免和筆記內容形成薄內容重複頁。舊 query URL 保留可用。

### PDF／列印／QR

1. 開啟任一課題筆記，按「儲存 PDF（列印）」或「列印筆記」。
2. 使用瀏覽器原生列印，不會自動下載二進位 PDF；在系統視窗選擇儲存／分享。這是明確交代的實作限制，不顯示假「已下載成功」。
3. 文件標題暫設為「科目-課題-自學筆記」，方便預設 PDF 檔名；實際儲存位置和檔名由系統列印介面控制。
4. A4、白底深字、隱藏導覽及按鈕，閉合的自測參考答案在列印時展開。
5. 列印版最後一頁專屬 QR：標題、科目／課題、完整 URL、掃描指示、48mm 黑白 SVG／四格靜區，與頁面難度入口同源。
6. 生成日期按香港時間輸出；內容更新日期只對有實際編輯紀錄的示範課題顯示，沒有把生成日期冒充教師覆核日期。
7. Chromium 使用具名 @page margin box 顯示頁碼／總頁數；Safari／其他列印系統支援不同，可啟用原生頁首／頁尾補足。不能保證所有手機均有同一種 PDF 儲存介面。
8. **預覽 PDF 的 QR 指向正式網域的新路由：正式合併部署前，正式站尚未提供這個新入口。** 本輪驗證的是 PDF 內碼解出正確 payload 及 Preview 路由；不是宣稱已在正式站上線。

## 科目與課題覆蓋（2026-11-22 實查快照）

| 科目 | 課題摘要 | 專屬圖解 | 未齊三層 MC 的課題數 |
|---|---:|---:|---:|
| 數學（必修部分） | 25 | 3 | 10 |
| 數學 M2（代數與微積分） | 10 | 1 | 1 |
| 數學 M1（微積分與統計） | 12 | 0 | 3 |
| 物理 | 13 | 0 | 8 |
| 化學 | 14 | 0 | 2 |
| 生物 | 11 | 1 | 0 |
| 英國語文 | 12 | 0 | 0 |
| 中國語文 | 19 | 0 | 9 |
| 企業、會計與財務概論 | 13 | 0 | 2 |
| 資訊及通訊科技 | 10 | 0 | 0 |
| 經濟 | 13 | 0 | 1 |
| 公民與社會發展 | 11 | 0 | 0 |
| 中國歷史 | 10 | 0 | 0 |
| 歷史 | 14 | 0 | 0 |
| 地理 | 10 | 0 | 0 |
| 中國文學 | 10 | 0 | 0 |
| 英語文學 | 10 | 0 | 0 |
| 倫理與宗教 | 8 | 0 | 0 |
| 旅遊與款待 | 10 | 0 | 0 |
| 健康管理與社會關懷 | 11 | 0 | 0 |
| 設計與應用科技 | 10 | 0 | 1 |
| 視覺藝術 | 10 | 0 | 0 |
| 音樂 | 10 | 0 | 0 |
| 體育 | 10 | 0 | 0 |
| 科技與生活 | 10 | 0 | 0 |

**全科共有 296 個課題摘要；完整新教材格式目前只有二次方程示範。** 科目 PDF 合集未實作；逐課題列印／儲存 PDF 已接入。沒有宣稱每課題均有完整例題、三難度題庫或專屬圖解。

## SEO／GEO（生成式搜尋）／AEO

- 課題正文改為初始 HTML 可讀，保留每頁 title、description、self-canonical、OG、Twitter。
- 可見 FAQ 與 FAQPage 由同一函數產生，只用實際筆記內容；沒有加入不存在的問題答案。
- TechArticle 補充自學筆記、DSE 程度、zh-HK、免費等真實語意。既有 WebSite／Organization／BreadcrumbList 沿用；只有實際顯示專屬圖解的頁面加入對應 ImageObject。
- 沒有為湊類型堆疊 EducationalOrganization 認證、虛假 Course、未提供的 Quiz 或 HowTo；schema 適用性與內容一致優先。
- 首頁／科目 → 課題筆記 → 專屬練習，原有網址不刪、不新增中文重複 URL。
- sitemap 的現有課題 canonical 清單繼續使用；本輪沒有 GSC 權限，未提交、未確認 Google 收錄／排名／AI 引用。

## 漸進補內容與提高難度的後續工作

1. **課程範圍決策**：繼續 DSE，或另行提供小學／初中科目與課程對照；不能從現有 DSE 題庫推論。
2. **逐課題教研審核**：補學習目標、完整例題、真實步驟、錯誤原因、詞彙、自測及跨概念挑戰。由熟悉該科的人核對，記錄作者、日期與來源授權。
3. **題庫難度實質重審**：分開記憶、應用與推理需求，檢查題族重複、答案提示及干擾項；先審 37 個缺層課題，再逐科重寫。不只批量更改 easy／medium／hard。
4. **圖片**：按教學概念繪製原創 SVG／流程圖／示意圖，逐一核對內容與 alt；不以裝飾插圖計作教學圖解完成。
5. **PDF 體驗**：若要求無系統對話框的一鍵實體 PDF 檔下載，須另定能穩定嵌入中文字型、分頁、公式與 SVG 的產生方案及成本；目前原生列印沒有這項能力。
6. **實機**：iPhone Safari、Android Chrome、實體印表機及相機掃碼仍需實機驗收，不能以桌面模擬代替。
7. **正式上線**：先處理相依 #245／#246，再覆核此教材及功能 PR；部署後重新驗證正式 QR URL、GSC／Rich Results／Lighthouse／field CWV。

## 回滾

無資料遷移。未合併前可關閉本草稿 PR；合併後可 revert 此功能 commit。保留舊 `/practice?subject=…&topic=…` 與所有 notes URL；新 QR 路由一旦印發，日後不得直接刪除，須保留相容頁或逐課題轉址。

## 本輪新增／修改檔案

- `README.md`
- `app/README-loading.md`
- `app/globals.css`
- `app/notes/[subject]/[topic]/error.tsx`
- `app/notes/[subject]/[topic]/loading.tsx`
- `app/notes/[subject]/[topic]/page.tsx`
- `app/notes/[subject]/page.tsx`
- `app/practice/PracticeGate.tsx`
- `app/practice/PracticeShell.tsx`
- `app/practice/[subject]/[topic]/error.tsx`
- `app/practice/[subject]/[topic]/loading.tsx`
- `app/practice/[subject]/[topic]/page.tsx`
- `components/QRCode.tsx`
- `components/StudyNoteActions.tsx`
- `components/TopicStudyNote.tsx`
- `components/__tests__/route-states.test.mts`
- `data/notes/lessons.ts`
- `docs/TOPIC-NOTES-PHASE1.md`
- `docs/tokens.md`
- `lib/__tests__/topic-learning.test.mts`
- `lib/notes/topicLearning.ts`
- `public/explainers/math-quadratic-study.svg`

## 本機實跑結果

- 完整測試 **1,570 passed、0 failed、0 skipped**；TypeScript、ESLint（0 warnings）、13 項 QA、secret scan、production dependency audit（0 vulnerabilities）通過。
- 本機 development 瀏覽器：360／390／430／768／1440px 的二次方程頁無水平溢出、唯一 H1、正確 canonical。原始 HTML 含學習目標與例題，FAQ/schema 逐項一致。
- 筆記區 axe WCAG 自動檢查 0 violations；不代表完整 WCAG 或螢幕閱讀器人工審核。
- PDF 按鈕發出一次原生列印請求，暫用正確科目／課題檔名；該請求在測試中攔截，不把它當成操作系統已儲存成功。
- 使用 headless Chromium 產生 **6 頁 A4 PDF**。獨立 PDF.js 解析確認頁碼／總頁數、收合答案、最後頁標題與完整網址；jsQR 在 1×／1.5×／2× 點陣化結果均解出正確課題 URL。
- 新準備頁實際可開啟及選取挑戰難度，表單指向既有 runner；準備頁 meta 為 noindex。真實作答／Google OAuth 與所有難度全流程仍須在 Preview／實機擴大驗收。
- 測試工具僅在臨時驗證環境使用，**沒有加入 production 或 repository dependencies**。
- 本機 4 GiB 限制會終止大型總覽／全站編譯，因此不將本機 production build 或舊科目總覽的 local rendering 記為通過；採已批准的遠端 CI／Vercel build 驗收。最新遠端結果及 Preview 畫面核對以 PR 描述為準。

### Preview 教材圖解覆核

首次 Preview 覆核發現舊二次方程 SVG 的拋物線與「兩個交點」標示不一致。新增 `public/explainers/math-quadratic-study.svg`，用明確函數 y = x² − 4x + 3 繪製，兩根 (1,0)／(3,0)、頂點 (2,−1)，全圖繁體中文。新增測試獨立計算曲線控制點、兩根及頂點，避免只修標籤不修圖。只在新筆記頁替換，不覆寫其他頁仍使用的舊素材；其他使用處留待專屬內容覆核。

遠端首次 production build 已確認 `/notes/[subject]`、`/notes/[subject]/[topic]`、`/practice/[subject]/[topic]` 均標為 `ƒ`，與載入邊界的動態路由合約一致。修正版最新提交仍需重新 build／Preview 核對，以 PR 描述最終結果為準。
