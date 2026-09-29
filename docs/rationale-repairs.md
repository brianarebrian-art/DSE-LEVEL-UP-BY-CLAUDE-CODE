# 解析修復：176 條位置式解析題

**決定：** Yuna，2026-09-29（見 `docs/DECISIONS-2026-09-29.md` 第一、第六節）。
**狀態來源：** `data/questions/rationale-repairs.json`。本文件只記錄流程與更正，不記錄進度數字；進度以該 JSON 為準，並顯示在 /transparency。

## 一、問題是甚麼

這 176 條題目的解析以位置指稱選項，例如「第二項」「the second option」。選項每次呈現都會洗牌，所以這類字眼必然會指錯。

### 更正紀錄：參照錯，不等於推理錯

`bafs_rep_0018` 的解析寫「第二項把期初與期末的加減調轉」。

- 按題目儲存的次序，第二個選項（\$250）是正確答案。
- 句子描述的其實是另一個選項：期初與期末存貨對調，得 \$270。
- 句中的會計推理是對的，錯的只是「第二項」這個指稱。所以不洗牌也無法修正，必須改寫。
- 這個例子不應被說成「解析推理錯誤」。它已存為回歸樣本 `lib/__tests__/fixtures/rationale-option-mismatch.json`。

M1 第一批亦是同一情況。以 `m1_rep_0002` 為例，舊解析的「第一個干擾項……直接相乘」，實際描述的選項並不在那個位置。

## 二、結構性修正（2026-09-29）

不再依靠「寫解析時記得不要用位置」，而是讓解析沒有機會指錯：

- `MCQuestion.optionNotes`：每個選項一條解析，以 `optionId` 對應。`optionId` 即該選項在儲存陣列中的索引，不受洗牌影響。
- 練習頁在學生作答後，把每條解析顯示在它所屬的選項下面，並引用選項原文，按學生當時看到的次序排列（`components/OptionNotes.tsx`、`lib/optionNotes.ts`）。
- 舊題沒有 `optionNotes`，照舊只顯示解析全文。新舊可以共存，毋須全庫遷移。
- 回歸測試：
  - `lib/__tests__/option-notes.test.mts`：同一題洗牌 100 次，每次每條解析都對應同一個 `optionId`；另有 bafs 回歸樣本。
  - `lib/__tests__/withdrawn-lock.test.mts`：撤回題不會出現在練習池、題數、單題練習、推薦、列印試卷，而收藏頁會顯示撤回狀態。

## 三、每題的階段

```
withdrawn → rewritten → automated-checked → content-reviewed → restored
```

| 階段 | 由誰 | 怎樣記錄 |
|---|---|---|
| withdrawn | 創辦人決定 | `withdrawn.json` 有日期與原因 |
| rewritten, automated-checked | Claude，以腳本生成及檢查 | `scripts/qbank/repair-rationale.mts --batch <名>` |
| content-reviewed | **一位真人**：Yuna、Brian 或其指定的人 | 在 `rationale-repairs.json` 的 `contentReview` 填上姓名與日期 |
| restored | 內容覆核之後 | `withdraw.mts --undo`，再執行 `npm run gen:summary`，並把階段改為 `restored` |

- `lib/__tests__/rationale-repairs.test.mts` 是階段之間的閘：
  - 未到 `restored` 的題目必須仍在撤回名單內。
  - `content-reviewed` 及 `restored` 必須有覆核人姓名。
  - 之前的階段不得預先填上覆核人（憲章 §16.C）。
  - 題庫內容必須與批次檔一致。如果舊草稿被重新入庫、蓋過修好的版本，測試會失敗。
- Claude 不會替任何人填寫覆核人，亦不會自行恢復題目。

## 四、批次

- 10 題一批。先做 M1 90 題：學生已少了約 9% 的 M1 題目。
- 每批的覆核表放在 `docs/rationale-repairs/<批次>.md`。

| 批次 | 題目 | 模板 | 生成腳本 |
|---|---|---|---|
| M1-01 | m1_rep_0001–0010 | 積法則 $x^a \sin bx$（6 題）；商法則 $\dfrac{kx}{x+c}$（4 題） | `scripts/qbank/repairs/m1-01.mts` |

### M1-01 的內容修正

- 選項內的「$2x^{1}$」改為「$2x$」，只影響 $a = 2$ 的題目。
- 商法則「答 $k$」這個干擾項，舊解析說是「當成一次函數直接求導」。實際錯法是分子、分母各自求導再相除（$u'/v'$），已照實描述。
- 解析全文只保留推導，用書面語。舊文的「$\sin$ 同 $\cos$」屬口語，已改。
- 參數化題的正確答案與三個干擾項由程式重新計算，再逐一對上儲存的選項；每條解析的位置由這個配對決定。測試亦以另一套程式重算一次。
