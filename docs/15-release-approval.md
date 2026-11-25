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

簽署範圍只可以係已 `ADVERSARIAL_PASSED`（或以上）清單；禁止對 `LEGACY_UNCALIBRATED` 一次過「全庫放行」。  
灰度：`PRACTICE_SERVER_GRADE=1` 僅試點科 + 回滾開關。
