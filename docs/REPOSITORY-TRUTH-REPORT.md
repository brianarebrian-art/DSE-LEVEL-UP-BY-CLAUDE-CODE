# DSE Level Up — Repository Truth Report

> **基線日期：2026-10-22｜Git SHA：`d25c63740a9184d0303e2558c8ee6f51643258d6`｜工作語言：繁體中文**

## 審核範圍、方法與判讀

- **唯讀基線：**以 `git archive d25c63740a9184d0303e2558c8ee6f51643258d6` 展開至 `/home/ubuntu/dse-baseline-audit`；基線審核沒有修改 `app/`、`lib/`、`components/` 或既有技術文件，只新增本報告。後續修復及驗收另見 `SEO-TECHNICAL-FIXES.md` 和 `SEO-RELEASE-VALIDATION.md`，不能把基線狀態當成新版已部署證據。
- **規約：**已閱讀 `AGENTS.md` 與 `docs/charter.md`。憲章的「完全免費、無廣告」及「不考之地」邊界被用作合規判準；不把歷史註解或未來計畫當成正式站結果。
- **路由實測：**在隔離副本以 `next build --webpack`（成功）及 `next start` 逐一抓取 **130** 個頁面 URL：51 個靜態 page pattern，加上資料展開的 25 科目×2、3 個史料、16 個廣東話場景、10 個不考之地分類，即 79 個動態實例。結果：128 個 HTTP 200、2 個 production-only `/dev/*` HTTP 404。
- **正式站實證：**僅採用 `/home/ubuntu/dse-evidence/` 內 2026-10-22 原始 HTML／header。8 個抽樣公開 landing page（首頁、兩個 Maths、兩個 English、3 個 AI）均為 200，皆有 title、description、canonical、單一 H1；SEO landing pages 各有 3 個 JSON-LD script，首頁有 1 個。`/this-route-does-not-exist` 為 404；網域 HTTP/非 www 會 308 至 `https://www.dselevelup.com/`。
- **狀態詞典：**`VERIFIED`＝基線實測符合；`PARTIAL`＝部分符合／有明確缺口；`MISSING`＝所需項不存在；`BROKEN`＝可重現衝突或違反現行要求；`BLOCKED`＝目前證據不足，不能驗證。嚴重程度 P0/P1/P2 只代表修正優先序，**不代表 Google 已索引或 SEO 已改善**。

## 不可驗證項（不得被宣稱為已改善）

|項目|實際狀態|證據／檔案|是否符合要求|問題|嚴重程度|
|---|---|---|---|---|---|
|Google Search Console 的索引、曝光、CTR、排名、Google-selected canonical|BLOCKED|未提供 GSC property、export 或 URL Inspection 結果；`docs/SEO-AUDIT.md:34-36` 亦正確列為部署後量度|不可驗證|程式碼、sitemap 200 或 meta tag 均不是已索引／排名改善證據|P0|
|Field CWV、LCP/INP/CLS、真實 mobile rendering|BLOCKED|無 CrUX / PSI / RUM 期間資料；本次僅做 HTML/SSR 探針|不可驗證|不可把 local build 或現有影像 alt 當作使用者效能結果|P1|
|正式站完整 95 URL crawl / rendered DOM|BLOCKED|正式站原始證據只覆蓋 8 個公開 landing page、robots、sitemap、404 與 redirect；完整 130 URL 測試是隔離基線|不可驗證|部署版本與基線是否完全同 SHA 未獲 deployment manifest 證明|P1|

## 總表

|項目|實際狀態|證據／檔案|是否符合要求|問題|嚴重程度|
|---|---|---|---|---|---|
|基線可重現性與編譯|VERIFIED|`d25c63740…` archive；`/home/ubuntu/jobs/job_g5XGHuER/baseline-build.log`：compile、TypeScript、134 static generation 成功|符合|本地使用 lockfile 的 Next 16.3.8；憲章 §3 所述 16.2.9 已與 `package.json`／lockfile `^16.3.8` 不一致，屬文件過時而非本次 build 失敗|P2|
|完整 page inventory 與動態展開|VERIFIED|`baseline-route-probe-summary.json`；`data/subjects.ts`、`data/history-sources.ts`、`data/cantonese.ts`、`data/offSyllabus/index.ts`|符合|130 個 page URL 均納入本報告；2 個 `/dev/*` 生產 404 是刻意保護|P1|
|HTTP / sitemap 基本正確性|PARTIAL|`app/sitemap.ts`；local `/sitemap.xml` 95 `<loc>`；probe 95 sitemap URL 全在 inventory，且 HTTP 200|部分符合|沒有把 account/dashboard/result/predictor/admin/dev 放入 sitemap 是正確；但 sitemap 同時收入缺 H1、低 SSR 或沒有內連的 URL（詳見 P1）|P1|
|title / description metadata|VERIFIED|130 路由 probe 均收到 title 及 description（頁面自設或 root 繼承）；正式站 8 個抽樣 HTML 同樣存在|符合|`/admin` 與 production 404 dev route 會繼承 root title，非公開 SEO landing；不把此當成公開索引成功|P2|
|canonical 覆蓋|PARTIAL|`baseline-route-probe-summary.json:110-131`|部分符合|95 sitemap URL 中 **21** 沒有 explicit canonical；雖可能由搜尋引擎以自身 URL 處理，卻不符合 `docs/SEO-AUDIT.md` 對公開 landing page 共用 canonical helper 的目標|P1|
|H1 與可見主要內容|PARTIAL|probe：`/capsule`、`/relax`、`/relax/breathing` H1=0；`/practice` 僅 1 個 `sr-only` H1；`/notes/[subject]` 每頁 2 H1（1 visible + 1 sr-only）|部分符合|`sr-only` 是合法輔助／SSR 補強，不應一概標為 spam；但它不應取代**可見主要內容**的 H1 與足夠正文門檻。`/practice` 尤其只靠隱藏 H1；三頁則完全沒有 H1|P1|
|共用 SEO helper 使用|PARTIAL|`lib/seo.ts`；`rg createSeoMetadata`：僅 `/`、兩個 Maths、兩個 English、3 個 AI，共 **8** page 使用 `createSeoMetadata`|部分符合|helper 正確輸出 canonical/OG/Twitter/robots，但其餘公開頁大多手寫 metadata，造成 21 個 sitemap URL 漏 canonical 的可預期漂移風險|P1|
|JSON-LD|PARTIAL|130 SSR response 的 JSON-LD 均可解析；root 有 WebSite/Organization/WebApplication，部分內容有額外graph|部分符合|可解析不等於符合本次每個內容頁需BreadcrumbList、笔記需Article／TechArticle的門檻；多個舊頁只有全站graph。Google Rich Results資格仍未驗證|P1|
|robots 兩份來源與正式站輸出|BROKEN|`public/robots.txt` 與 `app/robots.ts`；隔離 baseline 回應 public 版本（無 `/dashboard`、`/result`），正式站 evidence `robots.txt.txt` 則回 app 版本（含兩項）|不符合|同 repo 兩個來源已有**可重現的不同輸出**。兩者均未為 GPTBot/ClaudeBot/PerplexityBot 加 `/dashboard`、`/result`；雖這兩頁有 noindex，仍與「單一來源」目標衝突|P0|
|sitemap 私密／client-shell／unfinished URL|PARTIAL|`app/sitemap.ts:37-109`；probe summary|部分符合|私密 localStorage 頁 `/dashboard`、`/predictor`、`/result`、`/account` 沒列入 sitemap，正確。惟 sitemap 仍含 `/capsule`（main SSR 0 字/H1 0）、`/relax`（123/H1 0）、`/relax/breathing`（282/H1 0）、`/sensei`（129 字）等較薄初始 HTML|P1|
|內部連結|PARTIAL|SSR anchor graph：`baseline-link-graph.json`；5 sitemap URL 入連=0|部分符合|`/relax/breathing`、`/relax/grounding`、`/relax/group`、`/relax/solo`、`/waiting` 沒有已抓到的 HTML internal inlink；不能只依賴 sitemap|P1|
|公開但未收錄 sitemap 的廣東話 cluster|PARTIAL|`/cantonese`、`/cantonese/learn`、16 scene 皆有 index/follow、canonical、H1（probe），但皆不在 95 loc；`app/sitemap.ts` 無此資料輸入|部分符合|有 **18** 個可索引 canonical URL 未入 sitemap。若刻意低曝光，應 noindex 並保持入口策略；若公開搜尋內容，應從同一資料來源收錄。`public/llms.txt:47-49`「sitemap lists every indexable URL」因此不實|P1|
|影像及 OG 基本檢查|VERIFIED|130 SSR response 共 249 個 `<img>`，缺 `alt` 0；`app/opengraph-image.tsx` 存在；layout 注入 OG/Twitter metadata|符合|這僅覆蓋 SSR `<img>` attribute；沒有量度影像大小、LCP、懶載入、背景圖或社交平台實際抓圖|P2|
|SEO 文件與 80-map 真實性|BROKEN|`docs/seo-content-map.csv`、`docs/SEO-CONTENT-MAP.md`、`docs/SEO-ARCHITECTURE-AND-LAUNCH.md`|不符合|80 CSV rows 只有 78 unique URL；兩個 URL 重複。僅 11 rows／9 unique URL 有 page route，69 rows 尚無 route。Markdown 在 header 後另有 8 行 malformed 2-column table row。架構文件把 `/dse-chinese`、`/past-papers`、`/ai/essay-feedback` 等不存在路徑列成架構，未標明 planned|P0|
|公開廣告／贊助預留 UI 與憲章|BROKEN|`components/AdSlot.tsx`；`app/off-syllabus/[category]/CategoryView.tsx:8,100`；憲章 §1.3/§8（`docs/charter.md:31-33,328`）；`public/llms.txt:53`|不符合|10 個 sitemap 不考之地分類皆渲染「學生友善贊助／廣告預留位置」。未見 AdSense script 或付費交易，故**不宣稱已有第三方廣告**；但可見 ad/sponsor placeholder 已違反「無任何形式廣告」與 llms 的「no ads」對外聲稱|P0|
|私密管理 URL 的 noindex 防線|PARTIAL|`app/admin/page.tsx`、`app/admin/quality/page.tsx`；兩者未設 robots noindex，僅靠 redirect/access control 與 robots Disallow|部分符合|`/admin`、`/admin/quality` 不在 sitemap，且有權限守衛；但文件自己說 robots 不等於 noindex，卻未在這兩頁實作 noindex。應在不阻止 fetch noindex 前先選定一致策略|P1|
|正式站事實與成效宣稱紀律|VERIFIED|`/home/ubuntu/dse-evidence/production-baseline.json`、8 個 HTML `.txt`、`docs/SEO-AUDIT.md:3,34-36`|符合|已有正式站 200/canonical/H1/JSON-LD 的原始 HTML 證據；沒有被誤寫為 GSC 已索引、排名提升或 SEO 成功|P0|

## P0／P1 優先問題

|優先|問題（只陳述可重現事實）|最小處置方向|
|---|---|---|
|P0|**移除或正式決策 `AdSlot`。**10 個 sitemap `/off-syllabus/[category]` 頁透過 `CategoryView` 渲染廣告／贊助預留位置，與憲章的永久無廣告及 llms「no ads」衝突；尚無證據顯示已接第三方廣告。|刪除可見 ad/sponsor placeholder，或先取得憲章明確修訂；同步核對 llms 與 sitemap 類別頁。|
|P0|**收斂 robots 為一個生成來源。**同一 baseline 的 local response 與已存正式站 response 不同：前者選 public 靜態檔，後者選 app metadata route。|只保留一個來源；部署後抓取 robots 並檢查 `*` 及 named-bot groups 完整、sitemap 指向正確。|
|P0|**把 SEO content map 明確標為 backlog，或實作／刪除錯列。**20 個 P0 rows 中 11 rows 暫無 route：/dse-chinese, /dse-biology, /dse-chemistry, /dse-physics, /dse-economics, /dse-bafs, /ai/essay-feedback, /past-papers, /dse-study-plan, /dse-exam-tips, /dse-revision-guide。|內容地圖每次發布前以 route inventory 驗證；不存在的 URL 不可被描述為現有架構或加到連結／sitemap。|
|P1|**為 21 個 sitemap URL 補明確 self-canonical，或在規範中正式允許省略。**|共用 `createSeoMetadata` 或一致的 helper；發佈後用 raw HTML 抽查，不能以 GSC 已選 canonical 作假設。|
|P1|**修復 sitemap 內無 H1／弱初始 HTML／孤島頁。**`/capsule`、`/relax`、`/relax/breathing` 無 H1；`/practice` 僅 sr-only H1；5 個 relax/waiting URL 沒 SSR inlink。|只讓有可見目的、H1、足夠靜態說明和正常內連的公開頁進 sitemap；否則 noindex/移出 sitemap。保留 sr-only 作無障礙，不把它當唯一 SEO 本文。|
|P1|**決定 Cantonese cluster 的索引意圖。**18 個 URL 可 index、帶 canonical，卻未在 sitemap；llms 的「每個 indexable URL」說法已錯。|若要收錄，將 `SCENE_IDS`／learn／landing 納入 sitemap 及 internal content graph；若非公開搜尋內容，設定 noindex。|
|P1|**管理頁 noindex 與 access control 分工清楚化。**|保留權限檢查；明確設 noindex，避免單靠 robots Disallow。|

## Route inventory（實測基線）

**欄位說明：**「T/D」= title / meta description 在 SSR HTML 存在；`helper`= `createSeoMetadata`；H1 三個數字依序為總數／可見／`sr-only`；`in`= 被同一 130-route SSR HTML 中 `<a>` 指到的來源數。此為靜態初始 HTML；不把 client hydration 後狀態當成已被 crawler 驗證。

|路由|來源／sitemap|HTTP|metadata|canonical|H1（總/可見/sr）|JSON-LD|SSR 字元／in|狀態|
|---|---|---:|---|---|---|---|---:|---|
|`/`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 掌握邏輯 唔係背答案|1：WebSite \| Organization \| We…|1361 / 125|VERIFIED|
|`/about`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 關於 DSE Level Up|3：WebSite \| Organization \| We…|2097 / 120|PARTIAL|
|`/account`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 個人檔案與帳戶|1：WebSite \| Organization \| We…|362 / 120|VERIFIED|
|`/admin`|靜態・非 sitemap|200|T/D 繼承 root|—|0/0/0 |1：WebSite \| Organization \| We…|8 / 0|PARTIAL|
|`/admin/quality`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|8 / 0|PARTIAL|
|`/ai/past-paper-explainer`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 AI DSE Past Paper 題解工具|3：WebSite \| Organization \| We…|241 / 1|VERIFIED|
|`/ai/practice-generator`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 AI DSE 練習題生成器|3：WebSite \| Organization \| We…|311 / 3|VERIFIED|
|`/ai/study-plan`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 AI DSE 個人化學習計劃|3：WebSite \| Organization \| We…|235 / 2|VERIFIED|
|`/answer-sheet`|靜態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 紙筆對答案|1：WebSite \| Organization \| We…|521 / 1|VERIFIED|
|`/bookmarks`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 我嘅收藏|1：WebSite \| Organization \| We…|62 / 120|VERIFIED|
|`/cantonese`|靜態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 新來港・香港日常廣東話|2：WebSite \| Organization \| We…|10094 / 18|PARTIAL|
|`/cantonese/clinic`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 睇醫生及去藥房|2：WebSite \| Organization \| We…|1520 / 1|PARTIAL|
|`/cantonese/clothes`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 買衫及試身|2：WebSite \| Organization \| We…|1216 / 1|PARTIAL|
|`/cantonese/food`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 食飯、叫餐及打包|2：WebSite \| Organization \| We…|1081 / 1|PARTIAL|
|`/cantonese/greeting`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 打招呼及寒暄|2：WebSite \| Organization \| We…|1409 / 1|PARTIAL|
|`/cantonese/hangout`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 同學約人、去街及運動場|2：WebSite \| Organization \| We…|1313 / 1|PARTIAL|
|`/cantonese/help`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 電話求助及請人幫手|2：WebSite \| Organization \| We…|1524 / 1|PARTIAL|
|`/cantonese/learn`|靜態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 點樣學廣東話|2：WebSite \| Organization \| We…|1790 / 17|PARTIAL|
|`/cantonese/leisure`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 打機、煲劇及興趣|2：WebSite \| Organization \| We…|1273 / 1|PARTIAL|
|`/cantonese/library`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 補習社及圖書館|2：WebSite \| Organization \| We…|1203 / 1|PARTIAL|
|`/cantonese/market`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 街市及超級市場|2：WebSite \| Organization \| We…|1092 / 1|PARTIAL|
|`/cantonese/mobile`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 手機、上網及增值|2：WebSite \| Organization \| We…|1357 / 1|PARTIAL|
|`/cantonese/numbers`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 數字、時間及日期|2：WebSite \| Organization \| We…|1162 / 1|PARTIAL|
|`/cantonese/school`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 學校日常|2：WebSite \| Organization \| We…|1313 / 1|PARTIAL|
|`/cantonese/shopping`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 買嘢及問價|2：WebSite \| Organization \| We…|1169 / 1|PARTIAL|
|`/cantonese/slang`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 香港常用口頭語及閒聊|2：WebSite \| Organization \| We…|1134 / 1|PARTIAL|
|`/cantonese/transport`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 搭車及問路|2：WebSite \| Organization \| We…|1192 / 1|PARTIAL|
|`/cantonese/weather`|動態・非 sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 天氣及打風|2：WebSite \| Organization \| We…|1277 / 1|PARTIAL|
|`/capsule`|靜態・sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|0 / 2|MISSING|
|`/community-safety`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 學生安全|2：WebSite \| Organization \| We…|1606 / 120|PARTIAL|
|`/concept-net`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 知識概念網|1：WebSite \| Organization \| We…|91 / 0|VERIFIED|
|`/credits`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 守護者致謝名單|1：WebSite \| Organization \| We…|551 / 120|VERIFIED|
|`/dashboard`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|17 / 125|VERIFIED|
|`/dev/answer-cards`|靜態・非 sitemap|404|T/D 繼承 root|—|0/0/0 |0|0 / 0|VERIFIED|
|`/dev/long-session`|靜態・非 sitemap|404|T/D 繼承 root|—|0/0/0 |0|0 / 0|VERIFIED|
|`/dse-english`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 DSE English 英文筆記與寫作技巧|3：WebSite \| Organization \| We…|325 / 2|VERIFIED|
|`/dse-english/writing-format`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 DSE English writing format 指南|3：WebSite \| Organization \| We…|634 / 2|VERIFIED|
|`/dse-maths`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 DSE Maths 數學筆記與題解|3：WebSite \| Organization \| We…|316 / 2|VERIFIED|
|`/dse-maths/quadratic-equations`|靜態・sitemap|200|T/D ✓・helper|✓|1/1/0 DSE Maths 一元二次方程|3：WebSite \| Organization \| We…|839 / 4|VERIFIED|
|`/exam-day`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|187 / 0|PARTIAL|
|`/logic-log`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|0 / 0|VERIFIED|
|`/methodology`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 點解改寫版練習 真係可以幫你考好 DSE？|2：WebSite \| Organization \| We…|1437 / 120|PARTIAL|
|`/notes`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 知識凝結|1：WebSite \| Organization \| We…|891 / 25|PARTIAL|
|`/notes/bafs`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 企業、會計與財務概論 知識凝結筆記 · 企業、會計與財務概…|1：WebSite \| Organization \| We…|666 / 2|PARTIAL|
|`/notes/biology`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 生物 知識凝結筆記 · 生物 revision notes…|1：WebSite \| Organization \| We…|569 / 2|PARTIAL|
|`/notes/chemistry`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 化學 知識凝結筆記 · 化學 revision notes…|1：WebSite \| Organization \| We…|677 / 2|PARTIAL|
|`/notes/chinese`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 中國語文 知識凝結筆記 · 中國語文 revision n…|1：WebSite \| Organization \| We…|1142 / 2|PARTIAL|
|`/notes/chinese-history`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 中國歷史 知識凝結筆記 · 中國歷史 revision n…|1：WebSite \| Organization \| We…|689 / 2|PARTIAL|
|`/notes/chinese-literature`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 中國文學 知識凝結筆記 · 中國文學 revision n…|1：WebSite \| Organization \| We…|639 / 2|PARTIAL|
|`/notes/csd`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 公民與社會發展 知識凝結筆記 · 公民與社會發展 revi…|1：WebSite \| Organization \| We…|806 / 2|PARTIAL|
|`/notes/design-tech`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 設計與應用科技 知識凝結筆記 · 設計與應用科技 revi…|1：WebSite \| Organization \| We…|675 / 2|PARTIAL|
|`/notes/economics`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 經濟 知識凝結筆記 · 經濟 revision notes…|1：WebSite \| Organization \| We…|697 / 2|PARTIAL|
|`/notes/english`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 英國語文 知識凝結筆記 · 英國語文 revision n…|1：WebSite \| Organization \| We…|817 / 2|PARTIAL|
|`/notes/english-literature`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 英語文學 知識凝結筆記 · 英語文學 revision n…|1：WebSite \| Organization \| We…|588 / 2|PARTIAL|
|`/notes/ethics-religious`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 倫理與宗教 知識凝結筆記 · 倫理與宗教 revision…|1：WebSite \| Organization \| We…|530 / 2|PARTIAL|
|`/notes/geography`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 地理 知識凝結筆記 · 地理 revision notes…|1：WebSite \| Organization \| We…|642 / 2|PARTIAL|
|`/notes/health-management`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 健康管理與社會關懷 知識凝結筆記 · 健康管理與社會關懷 …|1：WebSite \| Organization \| We…|679 / 2|PARTIAL|
|`/notes/history`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 歷史 知識凝結筆記 · 歷史 revision notes…|1：WebSite \| Organization \| We…|863 / 2|PARTIAL|
|`/notes/ict`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 資訊及通訊科技 知識凝結筆記 · 資訊及通訊科技 revi…|1：WebSite \| Organization \| We…|666 / 2|PARTIAL|
|`/notes/m1`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 數學 M1（微積分與統計） 知識凝結筆記 · 數學 M1（…|1：WebSite \| Organization \| We…|725 / 2|PARTIAL|
|`/notes/m2`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 數學 M2（代數與微積分） 知識凝結筆記 · 數學 M2（…|1：WebSite \| Organization \| We…|607 / 2|PARTIAL|
|`/notes/math`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 數學（必修部分） 知識凝結筆記 · 數學（必修部分） re…|1：WebSite \| Organization \| We…|1061 / 2|PARTIAL|
|`/notes/music`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 音樂 知識凝結筆記 · 音樂 revision notes…|1：WebSite \| Organization \| We…|609 / 2|PARTIAL|
|`/notes/pe`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 體育 知識凝結筆記 · 體育 revision notes…|1：WebSite \| Organization \| We…|593 / 2|PARTIAL|
|`/notes/physics`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 物理 知識凝結筆記 · 物理 revision notes…|1：WebSite \| Organization \| We…|645 / 2|PARTIAL|
|`/notes/technology-living`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 科技與生活 知識凝結筆記 · 科技與生活 revision…|1：WebSite \| Organization \| We…|589 / 2|PARTIAL|
|`/notes/ths`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 旅遊與款待 知識凝結筆記 · 旅遊與款待 revision…|1：WebSite \| Organization \| We…|652 / 2|PARTIAL|
|`/notes/visual-arts`|動態・sitemap|200|T/D ✓・頁面/動態|✓|2/1/1 視覺藝術 知識凝結筆記 · 視覺藝術 revision n…|1：WebSite \| Organization \| We…|628 / 2|PARTIAL|
|`/off-syllabus`|靜態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 不考之地|1：WebSite \| Organization \| We…|397 / 120|VERIFIED|
|`/off-syllabus/cantonese-slang`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🗣️ 地道廣東話與潮語解密|2：WebSite \| Organization \| We…|6416 / 1|BROKEN|
|`/off-syllabus/careers`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🧭 職場前瞻與斜槓探索|2：WebSite \| Organization \| We…|6108 / 1|BROKEN|
|`/off-syllabus/food`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🍜 香港飲食與茶餐廳文化|2：WebSite \| Organization \| We…|5911 / 1|BROKEN|
|`/off-syllabus/growth`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🌱 社交、心理與自我成長|2：WebSite \| Organization \| We…|6087 / 1|BROKEN|
|`/off-syllabus/hk-trivia`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🏙️ 香港冷知識與城市探索|2：WebSite \| Organization \| We…|6070 / 1|BROKEN|
|`/off-syllabus/life-skills`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🧰 實用生活生存技能|2：WebSite \| Organization \| We…|5991 / 1|BROKEN|
|`/off-syllabus/money`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 💰 理財、消費與小資智慧|2：WebSite \| Organization \| We…|5997 / 1|BROKEN|
|`/off-syllabus/tech-ai`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🤖 科技、AI 與未來工具|2：WebSite \| Organization \| We…|6306 / 1|BROKEN|
|`/off-syllabus/transport`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🚋 香港交通與城市網絡|2：WebSite \| Organization \| We…|5946 / 1|BROKEN|
|`/off-syllabus/visual`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 📷 攝影、視覺與流行美學|2：WebSite \| Organization \| We…|5867 / 1|BROKEN|
|`/paper-warrior`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 列印練習卷|1：WebSite \| Organization \| We…|791 / 121|PARTIAL|
|`/practice`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/0/1 DSE 練習題庫 · HKDSE Practice|1：WebSite \| Organization \| We…|2695 / 35|PARTIAL|
|`/prediction-method`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 練習表現係點計出嚟|2：WebSite \| Organization \| We…|1968 / 120|PARTIAL|
|`/predictor`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 練習表現估算|1：WebSite \| Organization \| We…|78 / 120|VERIFIED|
|`/privacy`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 私隱政策|1：WebSite \| Organization \| We…|3337 / 120|PARTIAL|
|`/reading`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 原創平行對齊閱讀篇章|1：WebSite \| Organization \| We…|7073 / 1|PARTIAL|
|`/relax`|靜態・sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|123 / 122|MISSING|
|`/relax/breathing`|靜態・sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|282 / 0|MISSING|
|`/relax/grounding`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 5-4-3-2-1 落地練習|1：WebSite \| Organization \| We…|257 / 0|PARTIAL|
|`/relax/group`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 👥 戰友集結區|1：WebSite \| Organization \| We…|577 / 0|PARTIAL|
|`/relax/solo`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 🎧 獨處充電|1：WebSite \| Organization \| We…|328 / 0|PARTIAL|
|`/result`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|4 / 0|VERIFIED|
|`/sensei`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 知識卡|1：WebSite \| Organization \| We…|129 / 4|PARTIAL|
|`/sign-in`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 登入|1：WebSite \| Organization \| We…|39 / 0|VERIFIED|
|`/sign-in-error`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 未登入到|1：WebSite \| Organization \| We…|0 / 0|VERIFIED|
|`/sign-up`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|1/1/0 建立帳戶|1：WebSite \| Organization \| We…|34 / 0|VERIFIED|
|`/source-lab`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 史料判讀室|1：WebSite \| Organization \| We…|366 / 4|PARTIAL|
|`/source-lab/appeasement-munich`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 慕尼黑協定與綏靖政策的評價|1：WebSite \| Organization \| We…|593 / 1|VERIFIED|
|`/source-lab/berlin-blockade`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 柏林封鎖|1：WebSite \| Organization \| We…|757 / 1|VERIFIED|
|`/source-lab/versailles-231`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 《凡爾賽和約》第二三一條|1：WebSite \| Organization \| We…|599 / 1|VERIFIED|
|`/start`|靜態・非 sitemap|200|T/D ✓・頁面/動態|—|0/0/0 |1：WebSite \| Organization \| We…|11 / 120|VERIFIED|
|`/subjects`|靜態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 科目總覽|1：WebSite \| Organization \| We…|2260 / 120|VERIFIED|
|`/subjects/bafs`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 💼 企業、會計與財務概論|2：WebSite \| Organization \| We…|1148 / 3|VERIFIED|
|`/subjects/biology`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🧬 生物|2：WebSite \| Organization \| We…|1024 / 3|VERIFIED|
|`/subjects/chemistry`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 ⚗️ 化學|2：WebSite \| Organization \| We…|1110 / 3|VERIFIED|
|`/subjects/chinese`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🇨🇳 中國語文|2：WebSite \| Organization \| We…|1401 / 3|VERIFIED|
|`/subjects/chinese-history`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 📜 中國歷史|2：WebSite \| Organization \| We…|1036 / 3|VERIFIED|
|`/subjects/chinese-literature`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 ✍️ 中國文學|2：WebSite \| Organization \| We…|1022 / 3|VERIFIED|
|`/subjects/csd`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🏛️ 公民與社會發展|2：WebSite \| Organization \| We…|1036 / 3|VERIFIED|
|`/subjects/design-tech`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🛠️ 設計與應用科技|2：WebSite \| Organization \| We…|1093 / 3|VERIFIED|
|`/subjects/economics`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 📈 經濟|2：WebSite \| Organization \| We…|1149 / 3|VERIFIED|
|`/subjects/english`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🇬🇧 英國語文|2：WebSite \| Organization \| We…|1532 / 5|VERIFIED|
|`/subjects/english-literature`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 📖 英語文學|2：WebSite \| Organization \| We…|1146 / 3|VERIFIED|
|`/subjects/ethics-religious`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🕊️ 倫理與宗教|2：WebSite \| Organization \| We…|998 / 3|VERIFIED|
|`/subjects/geography`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🗺️ 地理|2：WebSite \| Organization \| We…|1066 / 3|VERIFIED|
|`/subjects/health-management`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 ❤️‍🩹 健康管理與社會關懷|2：WebSite \| Organization \| We…|1100 / 3|VERIFIED|
|`/subjects/history`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🌍 歷史|2：WebSite \| Organization \| We…|1137 / 4|VERIFIED|
|`/subjects/ict`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 💻 資訊及通訊科技|2：WebSite \| Organization \| We…|1037 / 3|VERIFIED|
|`/subjects/m1`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 📊 數學 M1（微積分與統計）|2：WebSite \| Organization \| We…|1040 / 3|VERIFIED|
|`/subjects/m2`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 📐 數學 M2（代數與微積分）|2：WebSite \| Organization \| We…|991 / 3|VERIFIED|
|`/subjects/math`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🔢 數學（必修部分）|2：WebSite \| Organization \| We…|1478 / 121|VERIFIED|
|`/subjects/music`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🎵 音樂|2：WebSite \| Organization \| We…|1048 / 3|VERIFIED|
|`/subjects/pe`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🏃 體育|2：WebSite \| Organization \| We…|997 / 3|VERIFIED|
|`/subjects/physics`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 ⚡ 物理|2：WebSite \| Organization \| We…|1086 / 3|VERIFIED|
|`/subjects/technology-living`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🍳 科技與生活|2：WebSite \| Organization \| We…|1083 / 3|VERIFIED|
|`/subjects/ths`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 ✈️ 旅遊與款待|2：WebSite \| Organization \| We…|969 / 3|VERIFIED|
|`/subjects/visual-arts`|動態・sitemap|200|T/D ✓・頁面/動態|✓|1/1/0 🎨 視覺藝術|2：WebSite \| Organization \| We…|1046 / 3|VERIFIED|
|`/transparency`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 透明度報告|2：WebSite \| Organization \| We…|1919 / 120|PARTIAL|
|`/trust`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 信任中心|2：WebSite \| Organization \| We…|775 / 120|PARTIAL|
|`/waiting`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 放榜前，我哋陪你|1：WebSite \| Organization \| We…|330 / 0|PARTIAL|
|`/writing`|靜態・sitemap|200|T/D ✓・頁面/動態|—|1/1/0 AI 作曲爭議|1：WebSite \| Organization \| We…|2018 / 4|PARTIAL|

### Route handler、metadata route 與非 page 路徑

|路由／檔案|實際狀態|證據／檔案|是否符合要求|問題|嚴重程度|
|---|---|---|---|---|---|
|`/api/account/delete`、`/api/admin`、`/api/admin/quality`、`/api/admin/users/stats`、`/api/auth/[...nextauth]`、`/api/cron/exam-day-nudge`、`/api/exam-day/brief`、`/api/feedback`、`/api/me`、`/api/practice-count`、`/api/privacy/consent`、`/api/progress`、`/api/push/subscribe`、`/api/report`、`/api/result/verify`、`/api/sync/session`、`/api/sync/settings`|VERIFIED|17 個 `app/api/**/route.ts`；robots 對 `/api/` Disallow；sitemap 未列|符合 sitemap 排除|本次不發送會改變資料的 API request，未宣稱 endpoint business logic 已逐一驗證|P2|
|`/robots.txt`|BROKEN|`public/robots.txt`、`app/robots.ts`、local/production raw output 不同|不符合單一來源|詳見 robots P0|P0|
|`/sitemap.xml`|VERIFIED|`app/sitemap.ts`；local/prod evidence 各 95 loc|符合輸入完整性|內容品質與 sitemap inclusion 缺口另列 P1|P1|
|`/opengraph-image`、`/apple-icon.png`、`/favicon.ico`、`/manifest.webmanifest`|VERIFIED|`app/opengraph-image.tsx`、`apple-icon.png`、`favicon.ico`、`manifest.ts`|存在|未做第三方社交 crawler 的 card rendering 驗證|P2|
|`/.well-known/security.txt`、`/llms.txt`|PARTIAL|`public/.well-known/security.txt`、`public/llms.txt`|檔案存在|llms 的 sitemap 全覆蓋與無廣告聲稱和基線不一致|P1|

## 內容地圖與文件交叉核對（不逐項搜尋內容）

|項目|實際狀態|證據／檔案|是否符合要求|問題|嚴重程度|
|---|---|---|---|---|---|
|CSV 格式|VERIFIED|`docs/seo-content-map.csv`：81 行（header + 80 data），每行 8 欄；BOM 可由 UTF-8-SIG 正確讀取；無完全相同 row|符合基本 CSV 格式|這不代表 URL 已實作|P2|
|CSV 重複|PARTIAL|80 rows、78 unique URLs；`/dse-maths/quadratic-equations`、`/dse-english/writing-format` 各出現兩次（P0/P1）|不符合單一 URL roadmap|若重複是「階段升級」意圖，應以同一 row 的欄位或 status 表示，避免兩套 title brief 漂移|P1|
|Markdown 內容地圖|BROKEN|`docs/SEO-CONTENT-MAP.md:6-13` 有 8 行 2-column malformed table row；其後 80 data rows 與 CSV 相同（已比對）|不符合 Markdown table 格式|渲染器或審閱者可能把空 separator 誤讀成資料列|P1|
|架構文件時效|PARTIAL|`docs/SEO-ARCHITECTURE-AND-LAUNCH.md:6-10` 列出 `/dse-chinese`、`/dse-biology`、`/past-papers`、`/ai/essay-feedback`；相應 page route 不存在|不符合「現況」語意|文件沒有將這些 URL 清楚標成未實作計畫；可保留 roadmap，但需標記 planned 且不能作 launch claim|P1|
|SEO audit 的量度紀律|VERIFIED|`docs/SEO-AUDIT.md:3,34-36` 明確說明無 GSC/Lighthouse、不要將程式當 Google index 證據|符合真實性要求|此份審核同樣不宣稱流量、索引或 SEO 改善|P0|

## 正式站 raw evidence 摘要

|實測項|實際狀態|證據／檔案|是否符合要求|問題|嚴重程度|
|---|---|---|---|---|---|
|首頁與 7 個 SEO landing HTML|VERIFIED|`/home/ubuntu/dse-evidence/{home,dse-maths,dse-maths__quadratic-equations,dse-english,dse-english__writing-format,ai__practice-generator,ai__study-plan,ai__past-paper-explainer}.txt`|抽樣符合|每個抽樣均有 raw title/description/canonical/`index, follow`/單 H1；首頁 JSON-LD 1，其他 7 頁各 3。只是抽樣，非全站索引證明|P1|
|正式 sitemap / robots|PARTIAL|`sitemap.xml.txt` 95 URL；`robots.txt.txt`|格式與 sitemap URL 數量符合 source|production robots 內容與 baseline local static robots 不同，正是雙來源問題|P0|
|未知 URL|VERIFIED|`this-route-does-not-exist.txt`、`production-baseline.json`|符合 HTTP 404 行為|404 HTML 繼承 root title/robots，但 status=404；不將其稱為可索引 page|P2|
|裸網域與 HTTP canonical host|VERIFIED|`production-baseline.json:290-325`|符合|http、non-www 皆 308 至 `https://www.dselevelup.com/`|P2|

## 審核界限

- 未檢索或評定每一個 80-map 內容主題的學術正確性；僅核對 CSV/Markdown 結構、重複與 route 存在性，符合本次分工。
- 未執行會寫入資料、登入、管理、Cron 或第三方服務的測試；API 表只記錄 route inventory 與 sitemap/robots 邊界。
- 未把 `sr-only` 一律視為 keyword spam：它可服務讀屏與 SSR 可讀性；本報告的問題僅限其成為公開頁**唯一**主要 H1/正文、或和可見 H1 重複時。
- 未聲稱任何 GSC 索引、自然流量、排名、Core Web Vitals 或 SEO 改善。這些必須以 deployment SHA 對應的正式站 crawl、GSC URL Inspection／Performance export 及 field data 再驗證。

---

**審核產物與可重跑證據（非產品檔）：**`/home/ubuntu/jobs/job_g5XGHuER/baseline-build.log`、`baseline-route-probe-full.csv`、`baseline-route-probe-summary.json`、`baseline-link-graph.json`、`baseline-image-issues.json`。

## 主審補充：部署來源與 AI 功能

2026-10-22 主審透過 Vercel `get_deployment` 核實 production deployment `dpl_BgDXhe8AJgDVuFPVnxEijCTbBEQw` 的 `githubCommitRef=main`、`githubCommitSha=d25c63740a9184d0303e2558c8ee6f51643258d6`，狀態 READY。因此上表「production 是否對應基線 SHA」這個子項已由 BLOCKED 改為 VERIFIED；完整正式 130 URL 抓取仍未執行，不能將隔離本機結果說成正式網站完整實測。

|項目|實際狀態|證據／檔案|是否符合要求|問題|嚴重程度|
|---|---|---|---|---|---|
|即時 AI 練習生成、作文評分、計劃生成及 Past Paper 上傳／題解 API|MISSING|基線 17 個 `app/api/**/route.ts` 無相關生成 route；`app/practice/PracticeGate.tsx` 為現有題庫練習；`app/writing/page.tsx` 明示書寫題永不機器批改|不符合工具宣稱|AI landing page 的存在不是工具實作證據，必須撤回可用功能宣稱、保留 Blocked 並 noindex，不得為完成 SEO 而新增違反政策的付費 API|P0|
|metadata 編輯門檻完整性|PARTIAL|上表 T/D 僅核實標籤存在；核心頁 description 字符量度及全站 lint 另存本輪驗證|尚未符合全部門檻|T/D VERIFIED 不代表 description 150–160、全站獨特、功能正確或 Published；基線 lint 有 0 errors、29 warnings|P1|

本報告 inventory 的 VERIFIED 僅指該列記錄的基線結構／回應事實，不是對內容完整性、工具功能、所有品質門檻或 Google 索引的發布批准。修復後狀態另見 `SEO-TECHNICAL-FIXES.md`。
