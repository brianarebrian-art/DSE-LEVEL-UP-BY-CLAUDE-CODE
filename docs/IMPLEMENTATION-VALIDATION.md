# 五頁實作驗收（唯讀）

**驗收時間：** 2026-10-22（HKT）
**範圍：**

- `/dse-maths/quadratic-equations`
- `/dse-english/writing-format`
- `/dse-maths/question-types/quadratic-discriminant`（使用原創題型解析作版權安全 fallback）
- `/dse-physics/motion-equations`
- `/ai/practice-generator`

> **結論：五頁均只能維持 `Draft`；不可稱為 `Published`。**
>
> 這是一次靜態、唯讀驗收：沒有使用 browser、沒有重新抓取外部來源、沒有執行 Git、build、lint 或完整測試，亦沒有修改任何產品檔。既有 `docs/page-evidence-*.md` 僅作可信的來源／內容覆核紀錄復用；本報告另有直接讀取目前 TSX、`lib`、題庫及 SENSEI 資料的證據。

## 發佈與索引狀態：已確認

| 要求 | 實際證據 | 結果 |
|---|---|---|
| 四個教學草稿一律 noindex | `lib/seoPolicy.ts:10-21` 將四條 editorial 路徑列入 `EDITORIAL_DRAFT_ROUTES`，`createSeoMetadata()` 以 `shouldNoIndex()` 令 `robots.index` 及 `googleBot.index` 均為 false（`lib/seo.ts:17-30`）。 | **CONFIRMED** |
| AI 指南草稿一律 noindex | `/ai` 為 noindex prefix（`lib/seoPolicy.ts:2-8`）；頁面亦顯式傳入 `noIndex: true`（`app/ai/practice-generator/page.tsx:13`）。 | **CONFIRMED** |
| Draft 不進 sitemap | sitemap 先以 `!shouldNoIndex(...)` 過濾（`app/sitemap.ts:83-89`）。故即使靜態陣列仍列出 quadratic、writing、AI 指南（`app/sitemap.ts:42-48`），實際輸出不會含它們；判別式與物理頁亦未列在該陣列。新測試再逐一斷言所有 noindex route 不在輸出中（`lib/__tests__/seo-release-policy.test.mts:65-74`）。 | **CONFIRMED** |
| 不得稱 Published | 五個實際 page source 均無 `Published` 標記；AI 頁明示 `Draft／功能受阻`（`app/ai/practice-generator/page.tsx:41-44`）。 | **CONFIRMED** |

`robots.ts` 只封鎖 `/api/` 而容許公開頁、CSS、JS 與圖片被抓取（`app/robots.ts:4-14`）；對 Draft 的控制在 metadata noindex，而非 robots `Disallow`。這不等於 production 已可索引，亦不構成 production 驗證。

## 五頁條款驗收

| 路徑 | 內容／例題 | SEO、JSON-LD、內鏈 | CTA／功能真實性 | 靜態結論 |
|---|---|---|---|---|
| `/dse-maths/quadratic-equations` | 因式分解、配方法、二次公式、判別式／根性質齊備（`page.tsx:81-170`）；三條逐步例題（`:87-96`, `:106-115`, `:125-133`）；7 項錯誤與修正（`:173-195`）；常見設問有非「必考」聲明（`:198-215`）。 | `createSeoMetadata` 與 Article schema（`:11-17`, `:29`）；Breadcrumb（`:22-26`）；原創判別式 fallback、Maths／Physics 章節連結（`:214`, `:221`）。 | CTA 如實指向**使用指引**，並寫明不承諾即時生成／批改／自動評分（`:225-228`）。 | **內容 PASS；Draft** |
| `/dse-english/writing-format` | 四文體比較表（`:31-71`）、段落結構（`:74-82`）、連接詞／句式（`:85-95`）、原創大綱與短段（`:97-114`）、5 項格式錯誤（`:117-125`）。 | `createSeoMetadata` 及 Article schema（`:11`, `:18`）；Breadcrumb（`:15`）；`/notes/english`、`/writing`、`/reading` 均為實際 route（`:94`, `:141`, `:145-149`）。 | **AI Essay Feedback 不存在，誠實導向自評而非偽造功能**（`:138-141`）。 | **內容 PASS；AI feedback BLOCKED；Draft** |
| `/dse-maths/question-types/quadratic-discriminant` | 清楚聲明為原創、非官方題解（`:36-40`）；考核重點表（`:42-77`）、分步參數題（`:80-90`）、失分位及兩題相似原創題（`:131-153`）。此為使用者容許的版權 fallback，並非聲稱 Past Paper 題解。 | `createSeoMetadata`、Article schema、Breadcrumb 分別在 `:10-15`, `:29`, `:20-25`；四個相關實際內鏈在 `:183-186`。 | SENSEI CTA 的「只檢索已由真人審核知識卡」獲程式支持，見本報告後段。 | **內容 PASS；copyright-safe fallback；Draft** |
| `/dse-physics/motion-equations` | 一維勻加速限制、四方程、v–t 圖表、三題完整例題與 7 項錯誤修正均存在（`:52-163`）；DSE 題型明示「不代表必考」（`:166-169`）；官方 HKEAA 資源外連（`:172-175`）。 | `createSeoMetadata` 與 Article schema（`:12-30`）、Breadcrumb（`:35-41`）；4 個實際相關內鏈（`:184-190`）。 | CTA 只前往真實物理題庫，並明示**沒有** AI 自動解題／作文評分（`:177-180`）。 | **內容 PASS；literal AI-practice feature BLOCKED；Draft** |
| `/ai/practice-generator` | 有痛點、支援的真實科目／課題／模式、輸入輸出例子、操作步驟、私隱、FAQ 及相關內容連結（`:47-176`, `:181-186`）。 | metadata 對本頁 noindex（`:13`）；Article `headline` 同可見 H1 一致（`:15-23`, `:40`）；WebApplication schema **正確只指向真實 `/practice` 題庫**（`:29-34`, `:135-140`）。 | 明示沒有 prompt→新題 API、AI 任意生成或作文評分（`:41-44`, `:135-140`）；這是題庫指南而不是可用生成器。 | **BLOCKED；不可作生成器發佈** |

## 靜態 SEO 一致性：已直接驗證

| 項目 | 結果與證據 |
|---|---|
| H1、Article headline parity | 五頁各有一個本地 `<h1>`；三頁把同一 H1 常數傳入 `articleJsonLd`（quadratic `:7,17,32`；writing `:7,18,21`；discriminant `:7,29,32`）；physics schema 的 `headline` 使用 `pageHeading`（`app/dse-physics/motion-equations/page.tsx:8,19-30,47`）；AI Article 使用 `visibleH1`（`app/ai/practice-generator/page.tsx:9,15-23,40`）。**已確認 parity。** |
| BreadcrumbList | 全部五頁使用 `Breadcrumb`；元件同時輸出可見 `<nav>` 及 `breadcrumbJsonLd(items)`（`components/Seo/SeoNavigation.tsx:7-21`）。 |
| Metadata、canonical、OG、Twitter | 五頁均使用 `createSeoMetadata`；helper 以 `SITE_ORIGIN` 產生 canonical、Open Graph、Twitter 與 robots（`lib/seo.ts:17-41`）。 |
| Description 150–160 字元 | 以 Python 3 `len()` 讀取目前 source 常數：quadratic **155**、writing **158**、discriminant **150**、physics **150**、AI guide **158**；全數範圍內。 |
| 正式網域沒有散落硬編 | 對 `app/`、`components/`、`lib/`、`data/`、`scripts/`（排除測試／文件）掃描正式及舊 Vercel 網域後，唯一實際 URL 字面值為 `lib/site.ts:9` 的 `SITE_ORIGIN`；sitemap、metadata 和 schema 均 import 它（`app/sitemap.ts:21`, `lib/seo.ts:2`）。 |
| 內部目的地真實存在 | 以 Python 檢查五頁所有 source-level `href`／Breadcrumb `path`（query string 已剝離，並容許 `[subject]` 動態路由）：**0 條未解析**。包括 `/notes/math`、`/notes/physics`、`/notes/english`、`/subjects/math`、`/subjects/physics`、`/practice`、`/sensei` 及五條互連頁。 |

## 數學與題庫例子：Python 唯一計算工具

已用 Python 3 assertion 重新驗算，全部通過：

- 二次方程三條例題：`6x²+x−2` 的兩根、`2x²+8x−10` 的兩根、`2x²+3x−1` 的含 `√17` 兩根；
- 判別式 fallback：`Δ=16p` 的 `p=2,0,-1`，以及兩條相似題的重根條件；
- 物理三例：加速 `v=19, s=69`、煞車 `t=4, s=40`、上拋／回落 `v(1)=4.9, s(1)=9.8, h=11.025, t=3, v=-14.7`；
- 題庫示例 `x²−4x+3=0` 的 `x=1,3`。

既有資料／來源界線沿用 `docs/page-evidence-quadratic.md`、`page-evidence-writing.md`、`page-evidence-question-type.md`、`page-evidence-physics.md` 與 `page-evidence-practice-guide.md`；本次沒有重新研究外部數學或考評局來源。

## SENSEI CTA：有程式支援，**不是** AI 生成 API

判別式頁的 CTA 描述與現有 code 一致：

1. `app/sensei/SenseiClient.tsx:13-19` 明定零模型、檢索卡片、未命中不生成；`:62-67` 只載入各科卡並以 `rankCards()` 取結果；`:178-182` 未命中時明言不會編造答案。
2. 卡片型別強制包含 `reviewer` 及 `reviewedAt`（`data/sensei/types.ts:49-56`），前端亦顯示兩者（`app/sensei/SenseiClient.tsx:196-203`）。
3. Math 資料被明確 import 到實際索引（`data/sensei/math/index.ts:1-13`）；已上線的 `ma-discriminant` 卡含 `reviewer: "Yuna"` 和 `reviewedAt: "2026-08-27"`（`data/sensei/math/reviewed/batch1-algebra.ts:11-33`）。

因此「真人審核知識卡」CTA **受現有 code 和實際 data 支持**；不得把它描述為 LLM／自由生成／作文批改 API。

## 已確認缺陷（P0／P1）及 acceptance holes

| 級別 | 狀態 | 確切檔案／行號 | 影響及必須處置 |
|---|---|---|---|
| **P0** | **沒有發現已確認的 P0** | — | 五頁沒有將現有題庫或 SENSEI 誤稱為即時生成 API；本次 Python 例題驗算亦沒有失敗。這不是 production pass。 |
| **P1** | **BLOCKED：AI 練習生成器不存在** | `app/ai/practice-generator/page.tsx:13,41-44,135-140`；實際題庫只載入既有 MC／書寫題：`app/practice/PracticeGate.tsx:128-144,172-195`、`data/questions/load.ts:398-421`。 | 頁面可作**noindex 題庫使用指南**，但不能驗收為「AI 生成個人化 DSE 練習題」這項可用產品；不可 Published，不可把 CTA 改成生成承諾。若要解除，需真實且受控的 prompt→新題服務、資料處理／私隱設計及端到端驗證。 |
| **P1** | **BLOCKED：AI Essay Feedback 不可用** | `app/dse-english/writing-format/page.tsx:138-141` 直接說明不提供 AI／機器作文評分、分數預測或官方閱卷，按鈕只到 `/writing` 自評。 | 這是正確的**非偽造 CTA**，但未滿足「可用 AI Essay Feedback」功能。應繼續保持 Draft/noindex；只能稱為寫作自評入口，不能稱已提供 AI feedback。 |
| **P1** | **BLOCKED：物理頁沒有 AI 練習功能** | `app/dse-physics/motion-equations/page.tsx:177-180` 明說沒有 AI 自動解題，CTA 只到 `/subjects/physics`。 | 正確地避免假功能；但「AI 練習 CTA」的字面產品需求未能通過。要麼保留此真實題庫 CTA 並把需求定義為非 AI 練習，要麼在功能存在後再驗收為 AI CTA。 |
| **Acceptance hole（測試，不代表目前頁面失效）** | 現有新測試不會守住五頁的 description 長度、每頁 H1/Article headline parity、或這些 noindex 草稿的全部內鏈。 | `lib/__tests__/page-metadata.test.mts:39-72` 只檢查 metadata／description 的存在和泛用 title；`lib/__tests__/seo-release-policy.test.mts:22-80` 對 generic input 及 sitemap policy；`lib/__tests__/sitemap-routes.test.mts:51-55` 只檢查 `STATIC_ROUTES` 的 page 存在。 | 本次以直接 source＋Python 補足並得 PASS；後續若修改這五頁，應加入逐頁來源級 assertion，否則 150–160 長度、headline parity 或內鏈可在不觸發現有 gate 下退化。 |

## 實際功能核對：AI 指南並非行銷假設

- `/practice` 將 `subject`、`topic`、`mode` 和唯一的 `size=1` 解析為實際 props（`app/practice/PracticeShell.tsx:23-46`）；`weakness`、`long`、具有效 `cause` 的 `cause` 是受識別模式。
- `PracticeSession` 只從既有題庫篩選、重排並按 **30% easy／50% medium／20% hard** 抽題（`app/practice/PracticeSession.tsx:91-196`）；它不呼叫 LLM。
- 正常 session 的 `SESSION_SIZE` 是 **10**（`lib/entitlements.ts:9-33`），與 AI 指南 `app/ai/practice-generator/page.tsx:52-55` 的說明一致。
- 真實 subject ids `math`、`physics`、`english` 分別在 `data/subjects.ts:28-40,75-87,120-132`；數學 `quadratic_equations` topic id 在 `data/questions/math.ts:14-30`。AI 指南使用的 URL 均有效。

## 不應視為完成

- **不得把 sitemap／metadata source 或 `.next/trace` 當成部署、production HTML、Google 收錄、URL Inspection、手機體驗或 Search Console 成功。** `.next/trace` 只是本地建置 trace，並非上述驗證。
- **不得把 `/ai/practice-generator`、SENSEI 或 `/writing` 自評稱為 prompt 生成器、AI 作文評分器或自動評分服務。**
- **不得把判別式 fallback 說成 HKEAA Past Paper 題解。** 本頁正確地只提供原創題型解析。

## 本次未執行（依範圍，非未知缺陷）

沒有 browser／production HTML、Search Console、URL Inspection、手機人工視覺驗收、完整 build、lint 或 repo-wide test。它們是 release gate，非本次唯讀靜態驗收可替代；在完成前，上述五頁均維持 Draft。

## 後續整合驗收（取代本報告未執行項的狀態）

後續已完成最新版本完整1,352項測試、零警告lint、QA與production build；112個獨立URL／336份原始HTTP回應及30項Chromium視窗檢查均0問題。五頁description、H1／Article headline及CSP nonce由 `scripts/seo/verify_responses.py` 在原始HTML核對，現亦接入PR CI，故原表中的這些runtime acceptance holes已補足；完整證據與限制見 `SEO-RELEASE-VALIDATION.md`。

最終狀態是四篇教學 **Draft/noindex**，AI題庫指南 **Blocked/noindex**。正式部署、Google索引、生成器與AI Essay Feedback仍未完成，不得把本機通過視作Published。所有主內部目的地的source-level靜態覆核仍有效，但不把URL存在當作未實作功能已提供。
