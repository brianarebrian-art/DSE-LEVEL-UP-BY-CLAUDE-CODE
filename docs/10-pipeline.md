# docs/10-pipeline.md

## 指令

| 步驟 | 指令 |
|---|---|
| 參數／對抗閘 | `param-check.mts`（庫） |
| 產能探針 | `npx tsx scripts/qbank/pipeline/throughput-probe.mts` |
| Dry-run 50 | `npx tsx scripts/qbank/pipeline/dry-run-pipeline.mts` |
| 試點 500 | `npx tsx scripts/qbank/pipeline/pilot-upgrade-500.mts` |
| Legacy 標記 | `npx tsx scripts/qbank/pipeline/mark-legacy.mts` |
| 指紋 | `npx tsx scripts/qbank/pipeline/gen-fingerprints.mts` |

## 閘序

`DRAFT → PARAM_CHECKED → (AI_BLIND 待 LLM) → ADVERSARIAL_PASSED → HUMAN_SPOT_CHECKED → APPROVED → RELEASED`

本輪 AI_BLIND = `SKIPPED_NO_LLM`（誠實記錄於 ledger reason）。
