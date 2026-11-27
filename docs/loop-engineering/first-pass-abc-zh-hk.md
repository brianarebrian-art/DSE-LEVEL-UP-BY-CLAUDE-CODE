# 在練題首輪 A／B／C

狀態：**未經驗證**。未經教師審核。未套用到學生練習、目錄或批改。

| 項目 | 值 |
|---|---|
| 方法版本 | `first-pass-abc-v1` |
| 政策日期 | 2026-11-27 |
| 重跑 | `npm run loop:first-pass-abc` |
| 只核對 | `npm run loop:first-pass-abc -- --check` |

這不是官方考試統計，不是已驗證的難度提升，也不是約 50 題 `ruleset_proxy_v1` 試點的核實分級。試點檔不是本方法的輸入。不確定應標 A 還是 B 時，標 B。

## 在練題集

在練題是所有 `isActive` 科目經 `loadSubjectQuestions` 在伺服器路徑取出的題目：靜態題庫合併機器閘與實名批次，套用難度覆寫與全庫升級 overlay，再以 `withoutWithheld` 只留下 `published`。不讀雲端鏡像，不補雲端缺少的題，也不刪雲端多出的題。

腳本會把這個集合的 id 與 `getSubjectQuestions` 的已發布題逐科比對，題數必須等於 `TOTAL_QUESTIONS`。對不上就失敗，不另造一個總數。

本提交的在練題是 **26426** 條、**25** 科，與公開練習總數相同。`math_fl_ns04` 與 `mb_n1_5_2` 已由另一變更收起，不在在練題集。

## 規則

先做客觀檢查。沒有客觀 C，才用規則代理分 A／B。

### 客觀 C

以下任一項成立就標 C。原因碼可以多於一個。在練題裡的這些是候選，不是收起。

| 原因碼 | 條件 |
|---|---|
| `missing_id` | 沒有 id |
| `missing_topic` | 沒有課題代號 |
| `unknown_item_type` | 題型不是 `mc`、`text` 或 `long` |
| `duplicate_id` | 同一科的在練題裡 id 重複 |
| `missing_stem` | 題幹空白 |
| `missing_options` | 選擇題選項不足或有空白選項 |
| `invalid_or_duplicate_answer` | 選擇題答案索引無效，或選項文字重複 |
| `missing_answer` | 非選擇題沒有參考答案 |
| `missing_explanation` | 沒有解析，書寫題也沒有評分準則 |
| `figure_referenced_without_asset` | 題幹指向圖，但沒有圖檔欄位 |
| `off_syllabus_topic` | 只對必修數學：課題代號是 `calculus`、`differentiation` 或 `integration` |
| `duplicate_stem` | 同一科裡，題幹經 NFKC、去空白、轉小寫後相同 |

不把題庫裡的 `easy`／`medium`／`hard` 當成「太易」。不借用數學卷別剖面去判其他科超綱。不判斷答案在學科上對不對。

`math_fl_ns04` 與 `mb_n1_5_2` 仍是已確認的 `duplicate_stem`。它們已由另一變更寫入 `withdrawn.json`，本方法只核對還原紀錄，不重複收起。

相對既有 `data/loop-engineering/grade-c.json`，今次沒有新的客觀 C。該清單裡仍在練的 6 條也是 `duplicate_stem`，本輪同樣不收起：

| 科目 | id |
|---|---|
| chinese | `zh_ch_106` |
| chinese | `zh_ch_110` |
| chinese | `zh_ch_112` |
| chinese | `zh_ch_120` |
| english | `en_gr_1` |
| english | `en_gr_2` |

### A／B 代理

沒有客觀 C 之後：

- 非必修數學標 **B**，原因碼 `pending_subject_baseline`。該科還沒有基準剖面，不能標成接近典型要求。
- 必修數學沿用資產地圖的關鍵詞代理，對每一條在練題重算。不讀試點檔。比值是代理綜合分除以該題基準剖面的綜合分。
  - 比值 &lt; 0.9：**B**，`below_typical_demand_proxy`
  - 0.9 ≤ 比值 &lt; 1.1：**A**，`close_to_typical_demand_proxy`
  - 比值 ≥ 1.1：**B**，`above_close_band_unverified`。舊試點會把這一檔標成 A。這裡不能確認它接近典型要求，所以標 B。
- 比值不是有限數：不標 A／B／C，寫入 `unable.json`，原因碼 `proxy_ratio_not_finite`。

A 只表示「代理落在接近典型要求的區間」。它不是出示給學生的決定，也不是教師審核。

## 本提交彙總

| 分級 | 題數 |
|---|---:|
| A | 240 |
| B | 26180 |
| C | 6 |
| 未能分級 | 0 |

A 的 240 條全部在必修數學。B 當中，24789 條是其他科目的 `pending_subject_baseline`，1381 條是數學低於區間，10 條是數學高於區間。C 的 6 條全部是 `duplicate_stem`，仍在練。分科數字在 `data/loop-engineering/first-pass-abc/summary.json`。

## 產出

這些檔只存 id、科目、題型、課題代號、分級、原因碼與方法版本。

| 檔案 | 內容 |
|---|---|
| `data/loop-engineering/first-pass-abc/summary.json` | 題數、分科、原因碼次數 |
| `data/loop-engineering/first-pass-abc/grades/<科目>.json` | 該科每一條在練題 |
| `data/loop-engineering/first-pass-abc/objective-c-candidates.json` | 客觀 C 的 id、科目、原因碼；含已收起的兩條紀錄 |
| `data/loop-engineering/first-pass-abc/unable.json` | 未能分級的列；本提交是空陣列 |

預覽頁是 `/dev/first-pass-grades`。`VERCEL_ENV=production` 回 404。沒有 `VERCEL_ENV` 而 `NODE_ENV=production` 也回 404。`VERCEL_ENV=preview` 不回 404。頁面不進入學生導航。

## 本方法不會做的事

- 不按 B 或本輪在練的客觀 C 隱藏、收起或下架。
- 不改 `loadSubjectQuestions`、練習抽題、目錄或批改。
- 不套用資料庫草稿，不改 `questions` 或 `question_bank_versions`。
- 不同步雲端缺少的 64 條，不刪雲端多出的 107 條。
- 不把題幹寫進分級檔、這份說明、日誌或提交說明。
