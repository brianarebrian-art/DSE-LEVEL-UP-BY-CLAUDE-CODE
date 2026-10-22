# 動態 metadata 修復

五個資料驅動模板共修復 79 個 description 過短的有效公開實例：25 科目頁、25 筆記頁、16 廣東話場景、10 不考之地分類及3史料頁。`/cantonese/learn` 原已為150字，沒有納入此修復集。

`lib/dynamicSeoDescriptions.ts` 為五種頁面各提供一個實際使用的 helper，基礎內容取自已有科目名稱、公開介紹、題数、課題数、場景與詞語数量、卡片数量、史料時間／地點／分層數量。helper只組合完整且有實際用途的句子，以 Unicode code point 計數，不截斷半句，也沒有以大量關鍵字代替說明。這不是批量生成新內容頁。

| 模板 | 修改 | 有效實例數 |
|---|---|---:|
| `app/subjects/[subject]/page.tsx` | 科目題庫範圍與使用限制的資料驅動摘要 | 25 |
| `app/notes/[subject]/page.tsx` | 課題筆記摘要；安全 LearningResource／BreadcrumbList | 25 |
| `app/cantonese/[sceneId]/page.tsx` | 實際生活場景、句子與詞語摘要，不宣稱DSE科目 | 16 |
| `app/off-syllabus/[category]/page.tsx` | 卡片集合摘要；unsafe JSON.stringify script改nonce JsonLd | 10 |
| `app/source-lab/[id]/page.tsx` | 時間、地點及事實／詮釋／立場分層摘要；安全schema | 3 |

修復子工作已對全部79實例驗證：`count=79`、`min=150`、`max=160`、`bad=[]`、`duplicate=[]`。原始產物為 `/home/ubuntu/jobs/job_AANFVgww/helper-verification.json`，會隨交付證據保存。定向 ESLint與無incremental TypeScript均退出0。

`/notes/[subject]` 的資源名稱對應公開雙語 H1；史料名稱對應預設繁中H1。此兩頁使用LearningResource，而不把導航／資料分層頁虛構成官方閱卷文章。所有JSON-LD經同一 nonce與安全序列化Server Component。既有公開主要內容、個人資料界線、路由與動態ID沒有改變。

上述是 helper 層驗證，不等於正式HTTP或Google驗證。同一最終建置的全sitemap HTTP回應及重複title／description檢查見 `SEO-RELEASE-VALIDATION.md`。資料若未來更新令基礎摘要超長，helper會明確 throw，讓build／runtime驗收發現，而不默默截斷。新增資料時須重跑相關工具並審核文案。
