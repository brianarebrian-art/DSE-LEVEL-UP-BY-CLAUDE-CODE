# 憲章修訂草案 —— 2026-09-25：取消「真人逐題實名審批」程序（⬜ 未簽署，未生效）

> **狀態：草案。** 提出人：Yuna（COO），2026-09-25。
>
> 按憲章尾註「任何更新須經雙人簽署」，本文件**唔會**寫入 `docs/charter.md`，
> 直至 Brian 同 Yuna 都喺下面簽咗名 —— 沿用 `charter-amendment-2026-09-15-DRAFT.md`
> 訂立嘅做法。

---

## 已經做咗、唔使等呢份草案嘅部分

2026-09-25 Yuna 指示刪除**現有**審批紀錄，經 Phase 1 影響報告後執行
（branch `chore/remove-review-records`，commit `06fd353`）：

- 121 個已簽名 `decisions.json`（2,534 個 approved）連同對應草稿同覆核頁刪除
- `data/provenance.ts` 重生，`REVIEWED_COUNT` = 0
- 公開頁所有「實名審批」「逐題人手核對」聲稱剷走或者改寫
- 101 個題庫檔頭唔再寫審批人名

刪除現有紀錄**唔係**憲章修訂 —— 憲章講嘅係程序，唔係某一批紀錄。
所以嗰部分即日生效，而**程序本身**要等本草案雙簽。

⚠️ Supabase `review_decisions` 嗰 197 行另行處理（見報告），唔喺本草案範圍。

---

## 要改嘅條文

| 位置 | 現行 | 建議 |
|---|---|---|
| §2 生產紀律 | drafts → review-drafts.mjs → **真人逐題批** → promote-drafts.mjs → **decisions.json** → 人手 wire 入 load.ts | ⬜ 待定（見下面問題一） |
| §12 流程圖 | 「真人逐題批（學科首席把關）」「decisions.json（實名審批記錄）」兩步 | ⬜ 待定 |
| §11 | 「驗收表『最終狀態』全部留空，等實跑」等條目 | 不受影響 |

---

## 簽署之前一定要答嘅問題

### 問題一：「機器永不自動入庫」靠咩守？

§2 同 §12 嘅底線係**機器永不自動入庫**。現行程序由兩個人手關口守住：

1. 真人逐題批（寫入 `decisions.json`）
2. 人手 wire 入 `load.ts`

取消第 1 個之後，只剩第 2 個。第 2 個係一個 commit —— 佢證明有人決定咗
「呢批上線」，但**唔證明有人睇過每一條題**。

| 選項 | 意思 |
|---|---|
| (a) 淨係保留「人手 wire 入 load.ts」 | 最少改動。對外唔可以再講「逐題經人審」 |
| (b) 改為抽樣覆核（例如每批抽 N 條，簽名記錄喺 commit message） | 有人睇過，但唔係每條 |
| (c) 由 Claude Code 校對取代 | 同 2026-09-19 `/cantonese` 嘅做法一致。對外要講明「由 AI 校對」（§16.B 精神） |

### 問題二：長題目頁嗰句點改？

`app/practice/LongPracticeSession.tsx` 同 `app/subjects/[subject]/SubjectDetailView.tsx`
而家寫住「長題目要逐條經真人審批先會上線，所以出得慢」。程序一取消，呢句就唔再成立。
**簽署之前唔改** —— 喺條文生效前改，等於代碼行先過憲章。

### 問題三：SENSEI 知識卡跟唔跟？

`data/sensei/*/drafts/*.decisions.json`（10 個檔）係另一套審批紀錄，
今次**冇**刪。`/sensei` 頁寫住「只檢索由具名真人審核過的知識卡」。
如果程序一齊取消，呢句同呢 10 個檔都要處理。

---

## 簽署後要改嘅代碼（簽之前一行都唔郁）

- `scripts/qbank/promote-drafts.mjs` —— 而家冇 `decisions.json` 就唔會 promote
- `app/admin/` 審批面板、`scripts/qbank/pull-decisions.mjs`、`review-drafts.mjs`
- `scripts/gen-provenance.mjs`、`data/provenance.ts`、`lib/__tests__/trust-disclosure.test.mts`
- 上面問題二、三提到嘅文案
- `.claude/skills/dse-level-up-orchestrator` 嘅「事實核查協議」Step A
  （以 `decisions.json` reviewer 欄判斷「已入庫」）

---

## 簽署

| | 選項（問題一） | 簽名 | 日期 |
|---|---|---|---|
| Brian（CEO） | ⬜ | ⬜ | ⬜ |
| Yuna（COO） | ⬜ | ⬜ | ⬜ |

*虛擬 persona 唔可以簽。Claude 唔會代任何人簽或者剔。*
