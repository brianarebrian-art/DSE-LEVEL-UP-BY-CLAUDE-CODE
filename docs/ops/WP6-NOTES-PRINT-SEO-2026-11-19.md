# WP6 — 自學筆記／列印 QR／難度／SEO（2026-11-19）

創辦人要求：網站缺圖、題太易、每科每課題自學筆記、可下載／列印、PDF 末頁 QR 回練習、手機友善、SEO／GEO／AEO。

## 憲章約束（已遵守）

| 項 | 做法 |
|----|------|
| 免費／無廣告 | 維持 |
| 唔新增 npm／後端 PDF | 瀏覽器 Print → Save as PDF |
| 唔改 DIFF_RATIO 3:5:2 | **維持**；以 `math-hell` 加厚 hard 池 |
| 無 LLM 寫筆記 | generated + SENSEI + 人手 override |

## 交付

1. **296／296** 課題自學筆記（`data/notes/studyNotes.generated.ts` + overrides）
2. 筆記 UI：列印／儲存 PDF、末頁 QR → `/practice?subject=&topic=`
3. 課題 SEO 頁 `/notes/{subject}/{topic}` + sitemap + `llms.txt`
4. 原創 SVG：`math-quadratic`、`math-trigonometry`（另接現有 3 張 explainer）
5. `math-hell` 9 條 hard 掛入現有 math 課題
6. 手機：橫滑課題、底部固定列印／練習、`min-h-11`、`touch-manipulation`、safe-area

## 誠實限制

- 多數筆記係題庫／模板確定性砌出，唔係老師長文；math 二次方程等有 override
- 3:5:2 抽樣比例未改（要改需憲章雙簽）
- 圖解仍少；可持續喺 `public/explainers/` 加原創 SVG

## 驗證

```bash
npm run gen:study-notes
npx tsx --test lib/__tests__/study-notes-coverage.test.mts lib/__tests__/math-hell.test.mts
```
