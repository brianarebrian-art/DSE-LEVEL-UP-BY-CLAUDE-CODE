# Loop Engineering

## 第 3–4 星期定稿（2026-11-27）

量表、審核流程、披露文案與抽樣範圍已定稿。這不是已驗證的「DSE+10%」。批量重構屬第 5–8 星期，本星期不開始，也不上正式站。

| 交付 | 位置 |
|---|---|
| 五維量表定稿 | `docs/loop-engineering/rubric-zh-hk.md`、`lib/loop-engineering/rubric.ts` |
| 審核流程定稿 | `docs/loop-engineering/review-process-zh-hk.md` |
| 升級 Prompt、AI 初審 Prompt、兩人覆核精簡表 | `docs/loop-engineering/prompts/` |
| 披露文案定稿 | `docs/loop-engineering/disclosure-zh-hk.md`、`lib/loop-engineering/disclosure.ts` |
| 抽樣範圍書面紀錄 | `docs/loop-engineering/week34-sample-scope-zh-hk.md` |

抽樣範圍是必修數學、200 至 500 條升級草稿，只留預覽。覆核是兩人批次覆核，不是資深 HKDSE 學科教師雙審。細節以抽樣範圍紀錄為準，不要收窄成單一題量。

## 第 1–2 星期

日期：2026-11-26 至 2026-12-09（香港時間）。

本目錄先做基礎與一次管線試跑。不改寫數百題，不上正式站，不套用本輪的資料庫草稿，也不啟動學生實測。

12 星期的可執行範圍是資產地圖、可覆核的難度標準，以及「AI 初審 → 兩人批次覆核 → 預覽」。全庫已驗證的難度提升不是這次承諾。抽樣範圍已於 2026-11-27 書面確認；批量重構仍屬第 5–8 星期。

## 本輪有什麼

| 交付 | 位置 |
|---|---|
| 五維量表與公式 (1) | `docs/loop-engineering/rubric-zh-hk.md`、`lib/loop-engineering/rubric.ts` |
| 可查閱資產列 | `npm run loop:query -- --subject math --type mc --grade C` |
| 精簡摘要與 C 級清單 | `data/loop-engineering/catalog-summary.json`、`data/loop-engineering/grade-c.json` |
| 約 50 題規則代理評分 | `data/loop-engineering/math-compulsory-pilot-scores.json` |
| 重跑腳本 | `npm run loop:math-map` |
| 管線狀態與硬閘 | `lib/loop-engineering/pipeline.ts` |
| 升級提示、AI 初審提示、兩人覆核表 | `docs/loop-engineering/prompts/` |
| 專家表與實測問卷 | 已存放，專家表未啟用；問卷狀態是「待批准」 |
| 披露文案定稿 | `docs/loop-engineering/disclosure-zh-hk.md` |
| 8 條未發佈試跑草稿 | `data/loop-engineering/week12-dry-run.json` |
| 資料表草稿 | `supabase/migrations/0039_loop_engineering_week12.DRAFT.sql` |

## 狀態

`loop2_draft` → `loop3_ai_first_review` → `loop4_two_person_review` → `preview`

AI 初審未通過，不能進入人手覆核。預覽題必須標明「未經 HKDSE 學科教師審核」，`published` 維持 false，難度宣稱維持「未驗證」。

Loop 5 不寫進可儲存狀態。任何進入真實學生實測的嘗試都回報「待批准」。

## 資產地圖怎麼讀

地圖覆蓋 `loadSubjectQuestions('math')` 的在練題，也就是學生現時會見到的必修數學自編題。已收起、待覆核與未恢復的題不在此池。雲端缺少的 64 條與雲端多出的 107 條都沒有同步或刪除。`question_bank_versions` 沒有改動。

查閱不把題幹寫進倉庫：

```
npm run loop:query -- --write-summary
npm run loop:query -- --subject math --type mc --grade C
npm run loop:query -- --subject math --grade unscored --count
```

分級只有 `C`（客觀缺陷）和 `unscored`（尚未人手評 A／B）。`math_fl_ns04` 與 `mb_n1_5_2` 留在 C 級清單，本分支不收起、不改寫。其他科可以查，但基準剖面仍標為待該科大綱讀法，不借用數學的卷別剖面，也不捏造考評局統計。約 50 題的五維分留在試點檔，不得當成公式 (1) 已驗證。

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
