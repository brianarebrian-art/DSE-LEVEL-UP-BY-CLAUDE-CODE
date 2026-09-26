# 收起的 220 題 —— 倫理與宗教「未見」課題

> **決定：** Yuna（COO）2026-09-26，按憲章 §18 即時生效。原話摘要：「收入黑名單，唔向學生展示……
> 練習隨機出題時排除呢 220 題，等之後逐題補指引再放返。」

## 範圍

`docs/topic-syllabus-map-2027.md` 將倫理與宗教兩個課題標為「未見」：教育局課程及評估指引沒有相應內容，
2027 年評核大綱只設卷一倫理、卷二宗教傳統。

| 課題 id | 名稱 | 題數 | 選擇題 | 填充題 | 長題 |
|---|---|---|---|---|---|
| `religion_philosophy` | 宗教哲學 | 110 | 108 | 2 | 0 |
| `religion_society` | 宗教與社會 | 110 | 108 | 2 | 0 |
| **合計** | | **220** | | | |

## 做了甚麼

- 題目檔**沒有刪除**，全部保留在 `data/questions/ethics-religious*.ts`，供內部審計。
- `data/questions/hidden-topics.ts` 的 `HIDDEN_TOPICS` 列出這兩個課題。題庫的兩條讀取路徑都會略過它們：
  `getSubjectQuestions`／`getSubjectTopics`（`data/questions/index.ts`）及 `loadSubjectQuestions`
  （`data/questions/load.ts`，雲端及靜態兩條路）。
- 效果：練習、課題列表、題數統計、雲端鏡像都不再包含這 220 題。倫理與宗教由 1,087 題變為 867 題，
  全站由 27,326 題變為 27,106 題、298 個課題變為 296 個。
- `getSubjectQuestionsRaw` 刻意不過濾，審計工具仍可讀取全部題目。
- 迴歸鎖：`data/questions/__tests__/hidden-topics.test.mts`。

## 放回的步驟

1. 逐題對照課程及評估指引，改寫或改標課題，經憲章 §12 流程審批。
2. 課題可以整個放回時，在 `HIDDEN_TOPICS` 刪去該課題 id。
3. 執行 `npm run gen:summary`，再執行 `npx tsx scripts/qbank/sync-questions.mts --push`。
4. 更新本文件及 `docs/topic-syllabus-map-2027.md`。

## 題目 id

只列 id，不列題目內容（題庫正本在 repo）。

### `religion_philosophy`（110 題）

```
er_ph_76 er_ph_77 er_ph_78 er_ph_79 er_ph_80 er_ph_81 er_ph_82 er_ph_83 er_ph_84 er_ph_85
er_ph_86 er_ph_87 er_ph_88 er_ph_89 er_ph_90 er_rp_0_0 er_rp_0_1 er_rp_0_2 er_rp_0_3 er_rp_0_4
er_rp_0_5 er_rp_0_6 er_rp_0_7 er_rp_0_8 er_rp_0_9 er_rp_0_10 er_rp_0_11 er_rp_0_12 er_rp_0_13 er_rp_0_14
er_rp_1_0 er_rp_1_1 er_rp_1_2 er_rp_1_3 er_rp_1_4 er_rp_1_5 er_rp_1_6 er_rp_1_7 er_rp_1_8 er_rp_1_9
er_rp_1_10 er_rp_1_11 er_rp_1_12 er_rp_1_13 er_rp_1_14 er_rp_2_0 er_rp_2_1 er_rp_2_2 er_rp_2_3 er_rp_2_4
er_rp_2_5 er_rp_2_6 er_rp_2_7 er_rp_2_8 er_rp_2_9 er_rp_2_10 er_rp_2_11 er_rp_2_12 er_rp_2_13 er_rp_2_14
er_rp_3_0 er_rp_3_1 er_rp_3_2 er_rp_3_3 er_rp_3_4 er_rp_3_5 er_rp_3_6 er_rp_3_7 er_rp_3_8 er_rp_3_9
er_rp_3_10 er_rp_3_11 er_rp_3_12 er_rp_3_13 er_rp_3_14 er_rp_4_0 er_rp_4_1 er_rp_4_2 er_rp_4_3 er_rp_4_4
er_rp_4_5 er_rp_4_6 er_rp_4_7 er_rp_4_8 er_rp_4_9 er_rp_4_10 er_rp_4_11 er_rp_4_12 er_rp_4_13 er_rp_4_14
er_rp_5_0 er_rp_5_1 er_rp_5_2 er_rp_5_3 er_rp_5_4 er_rp_5_5 er_rp_5_6 er_rp_5_7 er_rp_5_8 er_rp_5_9
er_rp_5_10 er_rp_5_11 er_rp_5_12 er_rp_5_13 er_rp_5_14 eth_floor_20 eth_floor_21 eth_floor_22 eth_w3_04 eth_w3_08
```

### `religion_society`（110 題）

```
er_so_106 er_so_107 er_so_108 er_so_109 er_so_110 er_so_111 er_so_112 er_so_113 er_so_114 er_so_115
er_so_116 er_so_117 er_so_118 er_so_119 er_so_120 er_rs_0_0 er_rs_0_1 er_rs_0_2 er_rs_0_3 er_rs_0_4
er_rs_0_5 er_rs_0_6 er_rs_0_7 er_rs_0_8 er_rs_0_9 er_rs_0_10 er_rs_0_11 er_rs_0_12 er_rs_0_13 er_rs_0_14
er_rs_1_0 er_rs_1_1 er_rs_1_2 er_rs_1_3 er_rs_1_4 er_rs_1_5 er_rs_1_6 er_rs_1_7 er_rs_1_8 er_rs_1_9
er_rs_1_10 er_rs_1_11 er_rs_1_12 er_rs_1_13 er_rs_1_14 er_rs_2_0 er_rs_2_1 er_rs_2_2 er_rs_2_3 er_rs_2_4
er_rs_2_5 er_rs_2_6 er_rs_2_7 er_rs_2_8 er_rs_2_9 er_rs_2_10 er_rs_2_11 er_rs_2_12 er_rs_2_13 er_rs_2_14
er_rs_3_0 er_rs_3_1 er_rs_3_2 er_rs_3_3 er_rs_3_4 er_rs_3_5 er_rs_3_6 er_rs_3_7 er_rs_3_8 er_rs_3_9
er_rs_3_10 er_rs_3_11 er_rs_3_12 er_rs_3_13 er_rs_3_14 er_rs_4_0 er_rs_4_1 er_rs_4_2 er_rs_4_3 er_rs_4_4
er_rs_4_5 er_rs_4_6 er_rs_4_7 er_rs_4_8 er_rs_4_9 er_rs_4_10 er_rs_4_11 er_rs_4_12 er_rs_4_13 er_rs_4_14
er_rs_5_0 er_rs_5_1 er_rs_5_2 er_rs_5_3 er_rs_5_4 er_rs_5_5 er_rs_5_6 er_rs_5_7 er_rs_5_8 er_rs_5_9
er_rs_5_10 er_rs_5_11 er_rs_5_12 er_rs_5_13 er_rs_5_14 eth_floor_27 eth_floor_28 eth_floor_29 eth_w3_02 eth_w3_05
```
