# DSE Level Up v6 Phase 10 發布後驗證

- **狀態：** **SUPERSEDED**（2026-11-04）——見 [`phase-5-10-reset.md`](./phase-5-10-reset.md)。無 deploy，唔當發布後驗證完成。  
- **原狀態（作廢）：** Phase 10 完成，等待批准  
- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **前置：** [`phase-9-release-plan.md`](./phase-9-release-plan.md)、[`phase-8-acceptance-checklist.md`](./phase-8-acceptance-checklist.md)  
- **發布實況：** 截至本文寫作，**Milestone A PR #177 仍 OPEN、未合併** → **未發生 production 發布**。本檔係驗證工作簿：填咗 **預發布基線**；**發布後 Actual** 留空／Pending，等軌 1 合併後 24–72h 補。  
- **範圍：** 軌 1（A）可驗證；軌 2 產品指標 **N/A**（B–G 未交）。

---

## 0. 總裁決（而家）

| 問題 | 裁決 |
|---|---|
| 有冇完成「發布後驗證」循環？ | **未完成實際循環**——無 deploy 可驗 |
| 預發布技術基線是否就緒？ | **是**（Phase 6–8） |
| 可否宣稱 v6 全量上線健康？ | **否** |

合併 A 並過監察窗後，更新本檔 §1–4 Actual 欄，再改狀態為「軌 1 驗證完成」。

---

## 1. 技術指標

| ID | 指標 | 預發布基線（而家） | 發布後 Actual | 目標／閘 | 狀態 |
|---|---|---|---|---|---|
| V-TECH-01 | Smoke（secret／typecheck／security 單元） | Phase 8 gates Pass | Pending deploy | 全綠 | 基線 OK |
| V-TECH-02 | `npm test` | 1455／0（Phase 6） | Pending | fail=0 | 基線 OK |
| V-TECH-03 | `npm run build`（8GB heap） | Pass（Phase 6） | Pending CI on main | Pass | 基線 OK |
| V-TECH-04 | SEO verify_responses | 339 responses／0 issues | Pending prod URL 抽樣 | 0 issues | 基線 OK |
| V-TECH-05 | Error rate | 未接 RUM 基線數字 | Pending | 唔超過合併前 +1pp | Pending |
| V-TECH-06 | Latency／INP | 未量 S3 baseline | Pending | INP≤300ms 告警；S3 另定 | Blocked／N/A |
| V-TECH-07 | API failure／5xx | Sentry 待對照 | Pending | 無 A 引起尖峰 | Pending |
| V-TECH-08 | Database error | 無 migration | Pending | 無新 DB 錯 | 預期 N/A |
| V-TECH-09 | RLS rejection | 未 staging 實彈 | Pending | 無異常升 | Blocked（P0） |
| V-TECH-10 | Rate limiting | 單元：route-class Pass | Pending：429 率 | 誤傷校網 = 0 | 基線 OK／實網 Pending |
| V-TECH-11 | Feature flag 狀態 | 軌 1 無產品 flag | N/A | — | N/A |
| V-TECH-12 | Rollback readiness | Phase 9 §2.5 已寫 | Pending 演練意識 | 可 Vercel rollback | 計劃 OK |
| V-TECH-13 | PITR | 未確認 | Pending | P0 | Blocked |
| V-TECH-14 | RTO／RPO | 未定 | Pending | P0 | Blocked |
| V-TECH-15 | 舊 view 安全性 | 未專項 | Pending | 無安全漏洞暴露 | 另排 |
| V-TECH-16 | secret:scan／audit CI | 已加諸 A 分支 | Pending on main | 合併後 CI 綠 | 待合併 |

---

## 2. 產品指標

| ID | 指標 | 狀態 | 註 |
|---|---|---|---|
| V-PROD-01 | 錯題重做率 | **N/A** | Milestone E 未交 |
| V-PROD-02 | 錯題重做通過率 | **N/A** | 同上 |
| V-PROD-03 | 7 日 retention check 完成率 | **N/A** | 同上 |
| V-PROD-04 | 學習路線完成率 | **N/A** | 同上 |
| V-PROD-05 | 儀表板 next-action 點擊率 | **N/A** | 同上 |
| V-PROD-06 | 錯誤回報量與處理時間 | **部分既有** | 既有 report 可寫；狀態機／SLA 屬 C——唔當 v6 新指標 Pass |
| V-PROD-07 | 離線合併成功率 | **N/A** | Milestone F |
| V-PROD-08 | 共用 IP 誤 block 率 | **Pending**（軌 1） | 合併後監察；目標 0 |

---

## 3. 信任指標

| ID | 指標 | 狀態 | 註 |
|---|---|---|---|
| V-TRUST-01 | 內容回報處理時間 | 既有流程；未訂 v6 SLA | 唔當本軌 Pass |
| V-TRUST-02 | 修正狀態正確性 | **N/A** | Milestone C |
| V-TRUST-03 | 未審核內容外露事件 | 既有 hidden／withdrawn 閘；Hub 未建 | 持續 |
| V-TRUST-04 | Security／privacy 頁可見 | 既有 `/trust` `/privacy` | 既有；B 易讀 PICS **N/A** |
| V-TRUST-05 | 刪除權 30 日達成率 | **N/A** | Milestone B＋P0 |
| V-TRUST-06 | 分級審核達成率 | **N/A** | Milestone C |
| V-TRUST-07 | 原創判定達成率 | **N/A** | Milestone C |
| V-TRUST-08 | claims／copy 閘 | Phase 8 **Pass** | 預發布 |

---

## 4. 無障礙指標

| ID | 指標 | 狀態 |
|---|---|---|
| V-A11Y-01 | axe critical | **N/A**（未建 axe CI） |
| V-A11Y-02 | 200% 放大無橫向捲動 | **N/A**（未手動本輪） |
| V-A11Y-03 | 鍵盤可完成核心流程 | **N/A** |
| V-A11Y-04 | TTS／OpenDyslexic | 既有能力未本輪驗證 | **N/A** |
| V-A11Y-05 | contrast-guard | 含於 `npm run qa` Phase 6 Pass | 基線 OK |

---

## 5. 軌 1 合併後 24–72h 操作清單（等人執行）

合併「批准合併 Milestone A」並 deploy 後：

1. [ ] 記錄 deploy 時間（Asia/Hong_Kong）同 commit SHA  
2. [ ] 抽樣：Google 登入、練習一題、progress POST、登出（含未同步 confirm 文案）  
3. [ ] 未驗證 email 嘅 allowlist 帳不可入 admin（如有測試帳）  
4. [ ] 睇 Sentry／429／health 24h 同 72h  
5. [ ] 填本檔 Actual 欄；若觸發 Phase 9 rollback criteria → 執行 rollback 並記  
6. [ ] 更新本檔狀態句為「軌 1 發布後驗證完成」或「已 rollback」  

---

## 6. 已知缺口（唔當發布成功）

1. Phase 5 只完成 A（`phase-5-status.md`）  
2. P0 未答  
3. 無 production 發布 → Phase 10 實際循環未跑  
4. 產品／信任／a11y 多數 N/A  
5. 登出 wipe 缺雙帳戶手動證據  

---

## 7. 成本（發布後）

| 項 | 預發布 | 發布後 |
|---|---|---|
| `qa:budget` | Pass | 合併後重跑 |
| 新付費服務 | 無 | 應仍無 |
| Storage | 關 | 應仍關 |

---

## 8. 同 v6 文件鏈

| 文件 | 角色 |
|---|---|
| phase-1 … 4c | 設計 |
| phase-5-status | 實作進度（只 A） |
| milestone-a-* | A 完成報告／runbook |
| phase-6 | 測試 |
| phase-7 | 修正 |
| phase-8 | 隔離驗收 |
| phase-9 | 兩軌發布計劃 |
| **phase-10（本檔）** | 發布後驗證工作簿 |

PR 鏈（文件／A）：#177（A）· #178（6）· #179（7）· #180（8）· #181（9）· 本 Phase 10 PR。

---

## 9. 完成清單

### 已完成（本 Phase）

1. 建立發布後驗證指標表（技術／產品／信任／a11y）  
2. 記入預發布基線同 N/A／Pending  
3. 寫明「未 deploy → 循環未完成」  
4. 合併後 24–72h 操作清單  

### 未完成（要外部動作）

- 實際 production 驗證 Actual  
- P0／Milestone B–G  

### 需要你確認

1. 是否 **批准合併 Milestone A**（先有發布，Phase 10 Actual 先填得）？  
2. 是否接受「Phase 10 而家只係工作簿」？  
3. P0／Milestone B？  

**Phase 10 完成，等待批准。**
