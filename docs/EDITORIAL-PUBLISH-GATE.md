# 教學稿 Publish Gate（四篇 Draft）

四篇現時喺 `lib/seoPolicy.ts` 的 `EDITORIAL_DRAFT_ROUTES`，metadata **noindex**，**唔入** sitemap。`/ai/*` 維持 Blocked／noindex（無生成 API），**唔喺本閘解禁範圍**。

## 路徑

| 路徑 | 預期 schema | 本輪狀態（2026-10-22） |
|---|---|---|
| `/dse-maths/quadratic-equations` | Article + BreadcrumbList；headline = 可見 H1 | **Draft** — 未解禁 |
| `/dse-english/writing-format` | 同上 | **Draft** — 未解禁 |
| `/dse-maths/question-types/quadratic-discriminant` | 同上 | **Draft** — 未解禁 |
| `/dse-physics/motion-equations` | 同上 | **Draft** — 未解禁 |

解禁條件：**下列每一項勾選通過** 後，另開 release PR（唔同 UI／SEO 雜項 PR 混埋）：

1. [ ] 內容完整：學習目標、步驟／例題、常見錯誤、真實內鏈（無虛構官方題號）
2. [ ] CTA 誠實：唔指向未實作 AI 生成／作文機評；只連真實 `/subjects`、`/writing`、`/practice` 等
3. [ ] 原始 HTML：單一可見 H1；Article `headline` 與 H1 一致
4. [ ] description 150–160 Unicode 字元；自身 canonical
5. [ ] 手機 390／桌面 768／1440 可讀、表格不爆版
6. [ ] `npm run lint -- --max-warnings=0`、`npm test`、`npm run build` 通過
7. [ ] `python3 scripts/seo/verify_responses.py`（本機 production-mode）對四頁 0 issues（預期 **noindex: true**）
8. [ ] 正式部署後再跑一次 production origin；SHA 對得上
9. [ ] 創辦人確認後：移出 `EDITORIAL_DRAFT_ROUTES`、加入 `STATIC_ROUTES`（或動態清單）、再於 GSC 要求索引

## 本輪審計筆記

- 四頁均有完整教學正文與 `createSeoMetadata`／`articleJsonLd`；仍屬 Draft 係**政策**決定，唔係內容空白。
- 本輪 **唔** 移出 `EDITORIAL_DRAFT_ROUTES`：正式 release gate（部署 SHA、GSC、手機實機）仍要創辦人確認。
- AI 三頁繼續 Blocked；見 `docs/DEPLOYMENT-INDEXING-CHECKLIST.md`。

## 解禁 PR 最小 diff（通過閘之後）

1. `lib/seoPolicy.ts`：由 `EDITORIAL_DRAFT_ROUTES` 刪除四條
2. `app/sitemap.ts`：加入四條 `STATIC_ROUTES`（priority ~0.85）
3. 更新本文件狀態表為 Published；GSC URL Inspection 逐頁要求索引

## 驗證指令

```bash
npm run build && npm run start -- -p 3001 -H 0.0.0.0
python3 scripts/seo/verify_rich_results.py \
  --origin http://127.0.0.1:3001 \
  --canonical-origin https://www.dselevelup.com \
  --paths /dse-maths/quadratic-equations,/dse-english/writing-format,/dse-maths/question-types/quadratic-discriminant,/dse-physics/motion-equations \
  --expect-noindex \
  --output /tmp/dse-editorial-rich
```
