# docs/04-throughput-probe.md — 產能探針

> 日期：2026-11-26（Asia/Hong_Kong）  
> 指令：`npx tsx scripts/qbank/pipeline/throughput-probe.mts`

## 方法

1. 從 5 個試點科各抽 10 題（共 50）：math, physics, chemistry, biology, bafs。  
2. 對每題跑**確定性**管線（無外部 LLM；A7）：  
   - PARAM_CHECKED：schema／選項相異／題幹非空／雙語欄位存在性  
   - ADVERSARIAL 子集：重複選項、空解析、correctIndex 越界、選項數 < 4（MC）  
   - SIMILARITY stub：與同科隨機 20 題 bigram Jaccard（閾值 0.85 標記）  
3. 記錄牆鐘時間與通過／失敗。  
4. LLM 成本欄：在未批 key 前記 `N/A`；有 key 後重跑盲審段。

## 結果（首次確定性探針 · 2026-11-26）

腳本輸出：[`docs/04-throughput-probe-results.json`](04-throughput-probe-results.json)

| 指標 | 值 |
|---|---|
| n | 50（5 科 × 10） |
| PARAM_CHECKED 通過 | 50／50 |
| ADVERSARIAL（確定性子集）通過 | 50／50 |
| 高相似度旗標（≥0.85） | 0 |
| 平均確定性閘耗時 | ~0.4 ms／題 |
| LLM 單題成本 | **N/A**（未批 FOUNDER_AI） |

### 產能判讀（嚴格）

確定性閘**不是**瓶頸。瓶頸是：(1) 付費 LLM 盲審／改寫；(2) 兩人抽檢簽署。

| 條件 | 試點上限 |
|---|---|
| 無 LLM 預算 | **500**（僅參數升級＋確定性閘＋抽檢；唔宣稱學術盲審完成） |
| LLM 已批且重測日產能 ≥250 全流程 | 可上修至 2,500 |
| 抽檢不合格率 > 15% | 立即停產，下修批次 |

**本輪鎖定：試點上限 = 500**，直至 C2 簽署。

## 誠實聲明

本探針**不能**估計「學術正確盲審」產能；只能估計格式／對抗腳本吞吐。腳本曾輸出「日產能數億」——該數字對全流程**無效**，已作廢。
