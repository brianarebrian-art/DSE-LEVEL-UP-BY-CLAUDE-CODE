# Lint Baseline Remediation

**範圍：** `/home/ubuntu/dse-evidence/baseline-lint.log` 所列 29 個 warning 中，本次處理 **25 個**。`app/subjects/[subject]/page.tsx` 與 `app/cantonese/**/page.tsx` 的 4 個「unused eslint-disable directive」依分工交由主 agent，未作任何修改。

## 修正原則

- **不新增** `eslint-disable`、`eslint-ignore`，不調整 ESLint 設定或規則。
- 不改 SEO、metadata、sitemap、robots、package 設定或其他未列入基準 log 的程式檔。
- 題庫程式中，即使某變數目前不參與題目文字，凡是已有解構、計算或狀態讀取的流程均以 `void` 明確讀取，而不是直接刪除；這可保留既有初始化、迭代與可能的副作用，避免影響題目輸出、ID 序列或未來的 seeded/RNG 行為。
- `PrivacyConsentGate` 的 `state` 初始化與所有 `setState` 流程完整保留；僅以 `void state` 標示其目前被刻意保留。

## 改動明細

| 檔案 | 已消除 warning | 修正與理由 |
|---|---:|---|
| `.design-sync/previews/StudyTimeInsight.tsx` | 1 | 移除未使用、純數值且無副作用的 `hour` 常數；保留實際使用的 `day`。 |
| `app/account/AccountPageClient.tsx` | 1 | 移除未使用的 `next/link` 匯入。 |
| `app/exam-day/ExamDayClient.tsx` | 1 | `PlaceHint` 保持原有 `en` 參數簽名，在函式內以 `void en` 明確讀取，避免呼叫端／型別介面改動。 |
| `components/PrivacyConsentGate.tsx` | 1 | 保留 `state`、`setState`、初始值及 consent 流程；加上 `void state` 以消除未讀取 warning。 |
| `data/questions/biology-bank2.ts` | 1 | 移除未使用的 `round` 匯入；不影響題庫執行。 |
| `data/questions/chemistry-bank.ts` | 4 | 保留週期表與化學計量元組的完整解構與 `forEach` 執行；以 `void el`、`void grp`、`void mrA`、`void mrB` 明確讀取目前未用欄位。 |
| `data/questions/chinese.ts` | 1 | `retire` 繼續接收並讀取 `_consumedId`，且保持空陣列輸出；呼叫端仍會先執行 `id()`，故後續持久化題目 ID 序列不變。 |
| `data/questions/design-tech-bank.ts` | 2 | 移除未使用的 `n` 匯入；保留每個 stage 的完整解構，並以 `void order` 保留順序欄位讀取。 |
| `data/questions/health-management-bank.ts` | 5 | 移除未使用的 `n` 匯入；四段第二變體仍會建立 `others` 候選項陣列，再以 `void others` 保留既有計算與迭代。 |
| `data/questions/music-bank.ts` | 1 | 保留 `Object.entries(spec)` 回呼的完整鍵值解構，以 `void q` 明確讀取未進入選項文案的鍵；選項生成不變。 |
| `data/questions/visual-arts-bank.ts` | 2 | 移除未使用的 `n`、`round` 匯入；不影響題庫執行。 |
| `lib/jyutping.ts` | 1 | 移除只建立 `INITIALS` 別名、從未使用且無副作用的 `INITIAL_SET`。 |
| `scripts/copy-guard.mjs` | 1 | 移除未使用的 `statSync` 匯入。 |
| `scripts/qbank/gen-long-drafts.mjs` | 1 | 移除從未呼叫、只包裝 `rows.push` 且無初始化副作用的 `push` 別名；保留既有 `rows` 初始化並以 `void rows` 明確讀取。 |
| `scripts/qbank/sample-review.mjs` | 1 | 保留 `Object.entries(byDiff)` 的鍵值解構與抽樣迴圈，以 `void d` 明確讀取難度鍵。 |
| `scripts/qbank/validate-banks.mjs` | 1 | 保留讀取原始 `console.warn` 與覆寫以抑制 KaTeX CJK strict 警告的流程；以 `void _warn` 明確讀取保存值。 |

## 驗證

- 已在修改前後對 7 個受影響題庫模組的所有匯出陣列計算 JSON SHA-256 與長度；每一項結果完全一致，證明題目內容、順序及題目 ID parity 未變。前後指紋存於工作目錄的 `qbank-fingerprint-before.jsonl` 與 `qbank-fingerprint-after.jsonl`。
- 已以 `./node_modules/.bin/eslint --max-warnings=0` 僅檢查上述 16 個受影響程式檔，結果 **0 errors、0 warnings**。未執行全 repository lint，避免把其他 agent 正在處理的 4 個 baseline warning 或並行修改納入本次結果。
