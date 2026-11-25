# docs/15-release-approval.md

## 本輪發布請求：**不請求 RELEASED**

| 閘 | 狀態 |
|---|---|
| 憲章 2B 簽署 | 未簽 |
| 外部 LLM | **禁用**（唔申請預算） |
| 生產 migration 0038 | DRAFT 未 apply |
| 最終一次簽署 | 0（創辦人要求做完先簽） |
| APPROVED | 0 |
| RELEASED | 0 |
| 實證難 10% | **0**（僅有 `DSE_PLUS_10` 意圖草稿） |

簽署範圍只可以係已 `ADVERSARIAL_PASSED`（或以上）清單；禁止對 `LEGACY_UNCALIBRATED` 一次過「全庫放行」。  
灰度：`PRACTICE_SERVER_GRADE=1` 僅試點科 + 回滾開關。

## 本輪可簽清單（待創辦人一次簽署）

全庫升級後：見 [`docs/27-full-bank-upgrade.md`](./27-full-bank-upgrade.md) 與 [`docs/signoff-pack-full-upgrade-ids.json`](./signoff-pack-full-upgrade-ids.json)。

| 批次 | 數量 | Loader |
|---|---|---|
| **全庫 overlay 升級** | **26,428** `ADVERSARIAL_PASSED` | **已接** `applyFullUpgradeOverlay` |
| 早期 pilot／batch1 包 | 見 `signoff-pack-batch1*` | 已被全庫 overlay 覆蓋 |

`RELEASED` 仍為 0，直至創辦人一次簽署。實證難 10% 仍未宣稱。
