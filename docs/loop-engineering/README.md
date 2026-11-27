# Loop Engineering 第 1–2 星期

日期：2026-11-26 至 2026-12-09（香港時間）。

本目錄只做基礎與一次管線試跑。不改寫數百題，不上正式站，不套用本輪的資料庫草稿，也不啟動學生實測。

12 星期的可執行範圍是資產地圖、可覆核的難度標準，以及「AI 初審 → 兩人批次覆核 → 預覽」。全庫已驗證的難度提升不是這次承諾。200 至 500 條抽樣升級留在其後的星期。

## 本輪有什麼

| 交付 | 位置 |
|---|---|
| 五維量表與公式 (1) | `docs/loop-engineering/rubric-zh-hk.md`、`lib/loop-engineering/rubric.ts` |
| 必修數學在練題資產地圖 | `data/loop-engineering/math-compulsory-asset-map.json` |
| 約 50 題規則代理評分 | `data/loop-engineering/math-compulsory-pilot-scores.json` |
| 重跑腳本 | `npm run loop:math-map` |
| 管線狀態與硬閘 | `lib/loop-engineering/pipeline.ts` |
| 升級提示、AI 初審提示、兩人覆核表 | `docs/loop-engineering/prompts/` |
| 專家表與實測問卷 | 已存放，專家表未啟用；問卷狀態是「待批准」 |
| 披露文案草稿 | `docs/loop-engineering/disclosure-zh-hk.md` |
| 8 條未發佈試跑草稿 | `data/loop-engineering/week12-dry-run.json` |
| 資料表草稿 | `supabase/migrations/0039_loop_engineering_week12.DRAFT.sql` |

## 狀態

`loop2_draft` → `loop3_ai_first_review` → `loop4_two_person_review` → `preview`

AI 初審未通過，不能進入人手覆核。預覽題必須標明「未經 HKDSE 學科教師審核」，`published` 維持 false，難度宣稱維持「未驗證」。

Loop 5 不寫進可儲存狀態。任何進入真實學生實測的嘗試都回報「待批准」。

## 資產地圖怎麼讀

地圖覆蓋 `loadSubjectQuestions('math')` 的在練題，也就是學生現時會見到的必修數學自編題。已收起、待覆核與未恢復的題不在此池。雲端缺少的 64 條與雲端多出的 107 條都沒有同步或刪除。`question_bank_versions` 沒有改動。

每題有課題、題型、分值、題幹／選項／答案／解析／圖的完整度，以及由卷別與分值帶推出的基準剖面。沒有客觀缺陷的題，A／B 維持 `unscored`。約 50 題的五維分是規則代理，摘要會寫明須人工確認。

## 試跑怎麼讀

8 條草稿用來證明閘門，不是一批已核准的新題。

- 6 條走到未發佈預覽。簽署種類是 `scaffold_not_subject_teacher`，兩欄覆核人不是獨立學科教師。
- 1 條只加大指數，AI 初審退回，到不了人手覆核。
- 1 條 AI 初審通過，但兩人覆核清單未過，退回草稿。
- 其中一條預覽題曾嘗試進入 Loop 5，嘗試被拒絕，狀態沒有改成實測。

## 不要做的事

- 不要把本輪 migration 套用到正式 Supabase。
- 不要把試跑草稿寫入在練題庫。
- 不要發放 `questionnaire-blocked.md`。
- 不要進入、下載或索引第三方試題資料夾。
- 不要把官方試題全文或實質部分寫進系統、提示或紀錄。
