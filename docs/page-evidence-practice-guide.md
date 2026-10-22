# 頁面證據 — 練習題庫指南

## 範圍與狀態

| 項目 | 已核對結果 |
|---|---|
| 頁面 | `/ai/practice-generator` |
| 可見 H1 | `AI 生成個人化 DSE 練習題` |
| 狀態 | **Draft／功能受阻（Blocked）**；不可標示為 Published。 |
| SEO | 以 `createSeoMetadata` 設定 canonical，並明確傳入 `noIndex: true`。 |
| metadata description | `本頁說明 DSE Level Up 現有題庫如何按科目、課題與練習模式抽題，列出可用網址參數、資料處理和功能限制。網站目前沒有讓學生輸入 prompt 即時生成新題的 API；AI 任意生成與作文自動評分均不支援。請使用現有題庫練習、查看解析並自行核對，勿把抽樣結果視為即時 AI 產出或教師評語；請以題庫設定為準。`；以 Python `len()` 按 Unicode code point 核對為 **158** 字元。 |

## 實作與內容依據

| 來源 | 已覆核內容 | 頁面如何使用事實 |
|---|---|---|
| `AGENTS.md:1-5` | 要求先讀取本版本 Next.js 的本地文件。 | 已閱讀 `node_modules/next/dist/docs/.../generate-metadata.md`；靜態 `metadata` 只可在 Server Component 匯出（該文件第 104-120 行）。 |
| `lib/seo.ts:8-41` | `createSeoMetadata` 接受 `path` 與 `noIndex`，並建立絕對 canonical 和 robots。 | 使用 `path: '/ai/practice-generator'` 及 `noIndex: true`；未改動共用工具。 |
| `components/Seo/SeoNavigation.tsx:7-22` | `Breadcrumb` 同時輸出可見麵包屑與 BreadcrumbList JSON-LD。 | 以首頁和本頁 H1 作麵包屑。 |
| `components/Seo/JsonLd.tsx:1-8` | `JsonLd` 從 request headers 取得 nonce，並經 `serializeJsonLd` 安全序列化。 | 直接使用既有 `JsonLd`；沒有自行輸出 `<script>` 或自行序列化。 |
| `lib/site.ts:1-9` | 正式站點為 `https://www.dselevelup.com`。 | Article JSON-LD 的 `url` 和 `mainEntityOfPage` 使用此正式來源。 |
| `app/practice/PracticeShell.tsx:23-46` | 實際解析 `subject`、`topic`、`mode`、`cause`、`size`。只有 `weakness`、`long`、帶有效 A/B/C 的 `cause` 被識別；`size=1` 是唯一細卷尺寸。 | 表格只列這些實際參數；明示沒有 `difficulty` 網址參數，未識別 mode 回到一般練習。 |
| `app/practice/PracticeGate.tsx:128-195` | 選擇題由 `loadSubjectMCQuestions`，書寫題由 `loadWrittenQuestions` 載入；`mode=long` 走獨立書寫題流程。 | 不把書寫題說成生成器，亦不承諾每一課題都有書寫題。 |
| `app/practice/PracticeSession.tsx:91-196` | `buildPool()` 對精確 `topic` 篩選，預設以 30% easy、50% medium、20% hard 分層；weakness 模式只重排既有 pool。 | 說明為題庫抽樣與重排，不稱為即時 AI 出題或 AI 診斷。 |
| `data/questions/load.ts:359-421` | 題庫先嘗試版本相符的雲端副本，否則回落已編譯的科目題庫；MC 與 text/long 題型在此過濾。 | 說明「現有題庫」而非宣稱每次都生成內容。 |
| `data/subjects.ts:28-40, 75-87, 120-132` | 科目 id `math`、`physics`、`english` 為 active subjects。 | 使用這三個真實 `subject` 值。 |
| `data/questions/math.ts:15-30`、`data/questions/english.ts:11-21`、`data/questions/physics.ts:10-17` | 課題 id 分別包括 `quadratic_equations`、`grammar`、`mechanics`。 | 所有 CTA 和相關連結均使用已註冊的精確 topic id。 |
| `app/privacy/PrivacyClient.tsx:53-80, 83-142, 246-260` | 不登入時資料預設在瀏覽器；登入才同步指定進度與設定；寫作草稿刻意不同步；可自行刪除。 | 私隱段落只概述這些已實查內容，並說明此頁沒有 prompt 輸入欄。 |

## 數學覆核：題庫示例 `math_quad_1`

**題庫來源：** `data/questions/math.ts:82-103`。

1. `quad()` 以根 `r1`、`r2` 建立方程 `x² − (r1 + r2)x + r1r2 = 0`，正確選項是 `x = r1` 或 `x = r2`。
2. 第一組參數為 `[1, 3, 2023, 'medium']`，故本頁所用條目 `math_quad_1` 的題目是：`x² − 4x + 3 = 0`。
3. 獨立手算：
   - `(x − 1)(x − 3) = x² − 4x + 3`；
   - 令任一因式為零，得 `x = 1` 或 `x = 3`；
   - 代入驗證：`1² − 4(1) + 3 = 0`，`3² − 4(3) + 3 = 0`。
4. 頁面清楚標示這是**題庫示例，不是即時 AI 結果**。未把題目中的 `year` 欄位轉述為 HKEAA 年份或出處。

## 結構化資料覆核

- Breadcrumb JSON-LD 由既有 `Breadcrumb` 元件產生。
- Article JSON-LD 的 `headline` 與唯一可見 H1 完全相同：`AI 生成個人化 DSE 練習題`。
- Article JSON-LD 不含臆造的 `datePublished`、`dateModified`、個人作者或 rating。
- `softwareApplicationJsonLd()` 只標示真實 `/practice` 應用，名稱為「DSE 練習題庫」；頁面正文已明說此 schema **不是**生成器的聲稱。

## 缺口與限制

1. 審查時 repo **沒有** `lib/practiceBuilder.ts`，亦沒有名為 `queryParser` 的模組；實際選題邏輯位於 `app/practice/PracticeSession.tsx` 的 `buildPool()`，網址解析位於 `app/practice/PracticeShell.tsx`。本頁據此描述，不虛構缺失元件。
2. 未發現讓學生提交 prompt 並取得新題的 API、LLM 接線或作文自動評分實作。因此此頁維持 **Blocked**，不加入 API、付費服務或套件，也不聲稱 AI 功能可用。
3. 題庫可依科目、課題和模式抽樣，但指定課題是否有足夠 MC 或書寫題取決於現有題庫；本頁沒有承諾題數、即時性、教師評閱或成績效果。
4. 未執行 Git、npm 或 production build；最終整合與 production gate 由主 agent 負責。
