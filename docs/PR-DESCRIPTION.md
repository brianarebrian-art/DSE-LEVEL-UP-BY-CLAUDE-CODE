# fix(seo): truth-audited metadata, schema and draft learning pages

## 範圍與發布界線

基線 `d25c63740a9184d0303e2558c8ee6f51643258d6`；分支 `seo/truth-audit-quality-pages`。這個PR修復SEO程式及内容真實性，不聲稱已正式部署、Google已索引或搜尋成效增加。四篇教學維持Draft/noindex；三個AI網址維持Blocked/noindex；本輪Published=0。

## 新增／修改／刪除檔案

完整逐檔清單見 [SEO-CHANGED-FILES.md](SEO-CHANGED-FILES.md) 與本PR Files changed。

主要變更：

- `lib/seo.ts`、`lib/seoPolicy.ts`、`lib/dynamicSeoDescriptions.ts`：統一canonical、OG／Twitter、noindex及資料驅動長摘要；保留既有頁面特殊metadata。
- `lib/structuredData.ts`、`components/Seo/JsonLd.tsx`、`SeoNavigation.tsx`、`ArticleJsonLd.tsx`：安全JSON-LD、nonce、headline／H1一致與全公開內容Breadcrumb；筆記為TechArticle。
- `app/sitemap.ts`、`app/robots.ts`：同一索引政策、有效資料展開及唯一robots來源；刪除衝突的`public/robots.txt`。
- 五頁內容：`app/dse-maths/quadratic-equations/page.tsx`、`app/dse-english/writing-format/page.tsx`、`app/dse-maths/question-types/quadratic-discriminant/page.tsx`、`app/dse-physics/motion-equations/page.tsx`、`app/ai/practice-generator/page.tsx`。
- 既有Server wrappers與動態頁：獨特metadata、可見H1、正確slug、安全schema與Breadcrumb；移除巢狀main。
- `app/ai/study-plan/page.tsx`、`app/ai/past-paper-explainer/page.tsx`、`public/llms.txt`：以真實手動指南取代未實作的AI功能宣稱。
- 刪除`components/AdSlot.tsx`及引用，恢復永久無廣告原則。
- 保留RNG、題目ID、題庫內容、私隱及授權邏輯的零警告lint修復；真正UI使用既有locale或可見靜態雙語。
- `lib/__tests__/*`、`scripts/seo/*`、`.github/workflows/ci.yml`：不降低品質斷言；新增production-mode原始HTML smoke及artifact。
- 要求的Truth Report、技術修復、80筆V2清單、部署／索引清單、監測方案與驗收報告全部已加入`docs/`。

## 修復的SEO問題

雙robots來源、公開頁canonical缺口、動態description過短、H1重複／隱藏外殼、未完成及私人外殼進sitemap、場景路由缺失、錯誤科目slug、schema不安全或headline錯配、Breadcrumb覆蓋不足、未實作AI宣稱、廣告预留UI、低質重複內容規劃及過時SEO文件。

Past Paper採使用者允許的原創題型解析後備，不重刊考評局題目或捏造官方marking scheme。寫作CTA是自評；SENSEI是知識卡檢索；题庫抽樣不包裝成即時生成。

## 已驗證

- `npm run lint -- --max-warnings=0`：0 errors、0 warnings。
- `npm test`：1,352／1,352通過，0失敗、0跳過。
- `npm run qa`及`npm run build`／TypeScript：通過。
- 題庫前後指紋完全相同。
- 112個唯一URL、訪客／Googlebot／Twitterbot共336份production-mode原始HTTP：0問題；315個200、21個預期404回應。
- 97個sitemap URL：title、H1、description、canonical跨頁沒有重複；全部Breadcrumb、唯一main；25個學科筆記有TechArticle。
- 8核心URL加2新教學頁，390／768／1440px共30個Chromium視窗：0錯誤；保存可見H1、溢出、鍵盤焦點及截圖。
- 80筆V2 Markdown／CSV、11欄同步：52 Draft、21 Blocked、6 Merged、1 Deleted；Published／PUBLISH NOW=0。

完整本機證據隨交付包提供，摘要見 [SEO-RELEASE-VALIDATION.md](SEO-RELEASE-VALIDATION.md)。遠端GitHub Actions結果須以本PR實際run為準，不能把本機通過冒充遠端CI綠燈。

## 未驗證／未完成

本輪正式deployment SHA、Google索引與Google-selected canonical、Search Console曝光／clicks／CTR／排名、Rich Results、實際field CWV、完整WCAG、CTA analytics及每週／每月GSC監測。

即時AI新題生成與AI Essay Feedback仍不可用；現行憲章對付費API及作文／長答機評有限制。五個TSX內容檔存在不代表五個已提供的AI產品，也不代表五頁Published。

## 需要使用者手動執行

1. 審閱diff及本PR實際CI。確認保留題庫、私隱、免費與無廣告底線後才合併main。
2. 在Vercel核對production READY、merge SHA及正式www HTTPS來源，再按部署清單重跑正式URL原始HTML。
3. 四篇教學解除Draft前另做release確認及sitemap加入；未提供的AI工具繼續Blocked/noindex，不要求建立索引。
4. 提供已驗證`dselevelup.com` Search Console資源權限或原始匯出；逐頁記錄8核心URL的Google索引版本與線上測試。
5. 僅對真正可索引的正式內容提交sitemap／要求索引；保存狀態及日期，不把佇列或sitemap成功當成已索引。

精確步驟見 [DEPLOYMENT-INDEXING-CHECKLIST.md](DEPLOYMENT-INDEXING-CHECKLIST.md)。

## 下一步

先發布驗收四篇完整教學，再作AI功能的合規定位／需求決策，然後取得GSC基線和啟用真正每週／每月監測。不要批量發布80個提案；新內容按真實意圖、來源、內容深度及V2決策排序。
