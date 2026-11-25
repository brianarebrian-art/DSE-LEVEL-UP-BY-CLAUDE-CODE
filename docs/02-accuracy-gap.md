# docs/02-accuracy-gap.md — 答對率落差診斷

> 生成：2026-11-26（Asia/Hong_Kong）  
> 更新：缺陷掃描跑完後（`scripts/qbank/pipeline/defect-scan-pilot.mts` → `docs/gap-defect-scan-results.json`）  
> 狀態：假設清單 + 已知證據；**多數假設仍為 UNKNOWN（缺生產作答聚合）**

## 問題陳述

產品敘事指「DSE Level Up 現有學生答對率低於考評局整體 DSE 答對率」。本檔記錄可檢驗假設與目前可取得證據。**不得在缺數據時宣稱已找出主因比例。**

**核心裁決：** 「平台答對率低過考評局」**唔等於**「題目已經夠難／已經難 10%」。更常見解釋係缺陷令學生無謂失分。缺陷題**唔進入**加難隊列。

## 資料可得性

| 來源 | 狀態 |
|---|---|
| 每題平台答對率（p-value） | **UNKNOWN** — 需登入後 `practice_attempts`／本地 progress 聚合；本環境未連生產唯讀查詢 |
| 考評局公開整體答對率 | 可從 Drive《試題專輯》／考試報告取**統計數字**（D4：不搬題文） |
| 題庫結構缺陷 | 已跑試點 500 題確定性掃描（見下） |

## 假設與初步證據

| ID | 假設 | 現有證據 | 狀態 | 建議檢驗 |
|---|---|---|---|---|
| H1 | 答案鍵錯誤 | withdrawn 616；本輪 param／adversarial 閘 500／500 通過 shape；**近重複選項 14 題**標記 defect | 部分成立 | 數值重算抽樣；缺陷題 withdraw／修 |
| H2 | 超綱 | 憲章禁止 off-syllabus；缺逐題 syllabus map 覆蓋率 | UNKNOWN | 對 `topic_path` ↔ EDB 指引 |
| H3 | 語言晦澀／羞辱語 | 情緒安全 stub：試點 0 命中羞辱語；可讀性盲評未做 | PARTIAL／UNKNOWN | 可讀性指標 + 100 題雙人盲評 |
| H4 | 多於一個合理答案 | 機器閘查四選相異；近重複選項 14＝互斥弱 | PARTIAL | 缺陷題先修；再挑學術互斥 |
| H5 | UI 導致誤答 | 選項洗牌存在；書寫題自評；未見熱區數據 | UNKNOWN | 埋點時長／誤觸（須隱私批准） |
| H6 | 難度真偏高 | DF 註解多 FOUNDATION／STANDARD；無 IRT；**未有 n≥30 校準** → `CALIBRATION_INSUFFICIENT` | UNKNOWN | 只用已過缺陷閘題對照公開 HKEAA 科／卷統計 |

**誠實結論（今日）：** 無法判定「H___ 貢獻 ___%」。結構上 H1／H4 有確定性缺陷證據（14／500）；H6 不能單靠標籤或答對率推斷。主因比例標記為 **UNKNOWN**。

## 缺陷掃描結果（試點 6 科 × 至多 120／科，實際 500）

來源：`docs/gap-defect-scan-results.json`

| 指標 | 數值 |
|---|---|
| 掃描 | 500 |
| 清潔（可進加難隊列） | 486 |
| 缺陷（封鎖加難） | 14 |
| 主缺陷碼 | `near_duplicate_options`（14） |
| 數學缺陷 | 4 |
| 化學缺陷 | 5 |
| 生物缺陷 | 3 |
| 經濟缺陷 | 2 |
| 物理／BAFS 缺陷 | 0 |

**規則：** `enter_raise_queue=false` 嘅題目不得進入 `CURSOR_REWRITE`／抬 DF。

## 可撞答案／規律風險（結構檢驗）

| 風險 | 發現 | 嚴重度 |
|---|---|---|
| 儲存 `correctIndex` 恆為 0 | `_builder.ts` 設計；顯示層洗牌 | 若洗牌失效 → P0 |
| 年份軸缺失 | `year` 多用 0 | P1（溫習軸失敗） |
| 無 paper 欄位 | 抽題不跟卷別比重 | P1 |
| 答案在 anon SELECT／JS | 憲章刻意；可開發者工具取得 | P0（相對 2B；server grade 灰度中） |
| 空 answers 洩鍵 | 已修：`answers.length===0` → 400；未作答唔回 `correctIndex` | 已修 |
| 10 科真實卷面無 MC | `dse-paper-formats.ts` 已標明 | P1（覆蓋誠實） |

## 下一步（不降標準）

1. 缺陷題修／withdraw；唔抬難。  
2. 清潔題進 Cursor 分批改寫（math → 物理／化學／生物／BAFS／經濟）。  
3. 未有 n≥30 作答嘅題目不得標「已校準難度」或對外「已證明難 10%」。
