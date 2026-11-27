# docs/28 — 全庫「難 10%」客觀結構證明

> 2026-11-26（Asia/Hong_Kong）  
> 可重現、可機器複核。**唔係**學生實測 `ratio_p`。

## 問題

無生產逐題作答（`practice_attempts=0`）同官方逐題 `hkeaa_ref_p` 時，無法用 `docs/26` 嘅 `ratio_p≈0.9` 做實證宣稱。  
本證明改用專案既有、已寫死公式嘅 **DF 模型**（`docs/05`）做客觀結構證據。

## 定義（來自 docs/05）

\[
DF = 0.30C + 0.20S + 0.15R + 0.15D + 0.10U + 0.10M
\]

| 標籤 | 操作定義 |
|---|---|
| `DSE_PLUS_10` | 相對升級前，\(DF\) 至少 **+0.4σ**（目標 +0.5σ ≈ 答對率相對降 10%） |

映射（文件寫明）：+0.4～0.6σ ≈ 答對率相對下降 **8–12%**；中點 0.5σ ↔ 相對比值 ≈ 0.9。

每題：

\[
\sigma\_lift = \frac{DF_{post}-DF_{pre}}{\sigma_{pre}},\quad
\text{pass} \iff \sigma\_lift \ge 0.4
\]

## 結果（機器產出）

見 [`docs/plus10-objective-proof.json`](./plus10-objective-proof.json)（由 `prove-plus10-objective.mts` 產生）。

| 指標 | 數值 |
|---|---|
| 題數 | **26,428／26,428** |
| 全部達標（≥0.4σ） | **是** |
| \(\sigma_{pre}\) | 見 JSON `baseline.sigma_pre` |
| 最小 \(\sigma\_lift\) | 見 JSON `verdict.min_sigma_lift`（≥0.4） |
| 平均 \(\sigma\_lift\) | 見 JSON `verdict.mean_sigma_lift` |
| 平均隱含相對比值 | 見 JSON `verdict.mean_implied_ratio`（≤0.9 表示平均至少難 10%） |

## 重現步驟

```bash
npx tsx scripts/qbank/pipeline/cursor-upgrade-full-bank.mts
npx tsx scripts/qbank/pipeline/prove-plus10-objective.mts
# 期望：all_pass=true, pass=26428, fail=0
```

比較路徑：`loadSubjectQuestions(id, { skipUpgradeOverlay: true|false })`。

## 誠實邊界

| 可宣稱 | 不可宣稱 |
|---|---|
| 全庫每題結構 DF ≥ +0.4σ（docs/05 難 10% 帶） | 學生實測 `ratio_p≈0.9`（仍 UNKNOWN） |
| 可重現腳本／JSON 數字 | `RELEASED`（仍為 0，等創辦人簽署） |
| Overlay 已接線 loader | 官方逐題 facility 對照 |

## 相關

- 公式：[`docs/05-difficulty-model.md`](./05-difficulty-model.md)
- P 值實證路徑：[`docs/26-pvalue-accuracy-metrics.md`](./26-pvalue-accuracy-metrics.md)
- 升級管線：`scripts/qbank/pipeline/cursor-upgrade-full-bank.mts`
- 證明腳本：`scripts/qbank/pipeline/prove-plus10-objective.mts` / `df-proxy.mts`
