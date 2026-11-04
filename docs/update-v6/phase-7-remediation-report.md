# DSE Level Up v6 Phase 7 修正報告

- **狀態：** **SUPERSEDED**（2026-11-04）——見 [`phase-5-10-reset.md`](./phase-5-10-reset.md)。  
- **原狀態（作廢）：** Phase 7 完成，等待批准  
- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **前置：** [`phase-6-test-report.md`](./phase-6-test-report.md)（基線 Milestone A `416e075`）  
- **方法：** 分類 Phase 6 Fail／Blocked；可即修嘅做細 PR；其餘寫清 Root cause、Fix、Regression、Evidence、Owner、Deadline 佔位。  
- **硬閘：** 仍然禁止 production migration／key rotation／遠端 RLS（P0 未答）。

---

## 0. 摘要

| 類別 | 數量 | 本輪處理 |
|---|---|---|
| Fail（可執行案） | **0** | 無程式缺陷可修 |
| Blocked → 排程 remediation | 28 | 全數入冊；按 P0–P3 |
| 程序缺口 | 1 | 新增 [`phase-5-status.md`](./phase-5-status.md)：Phase 5 只完成 A |
| 即修（細） | 1 | CI build 加 `NODE_OPTIONS=--max-old-space-size=8192`（T-PERF-002） |
| 驗證關閉 | 1 | T-AUTH-005：確認已有 `auth-callback.test.mts` open-redirect 防衛 |

**根因總覽：** 多數 Blocked **唔係測試失敗**，而係 **Phase 5 Milestone B–G 未實作**，同 **P0／staging 未就緒**。假修復（空殼 UI／空 migration）禁止。

---

## 1. Fail 項目

無。

---

## 2. P0 remediation

每項：Root cause · Fix · Regression · Verification · Owner · Deadline。

### R-P0-001 · Phase 5 未完成卻進入測試／後續 Phase

| 欄 | 內容 |
|---|---|
| 關聯 | 程序；影響 T-* 大量 Blocked；對齊用戶關注「Phase 5 有冇完整先至 Phase 6」 |
| Root cause | Phase 5 要求 Milestone A–G 逐個完成；實際只交付 A。Phase 6 已誠實標 Blocked，但缺一份總狀態檔易被誤讀為「實作完」。 |
| Fix | 新增 `phase-5-status.md`；後續 Phase 8–10 驗收／發布必須引用本檔，唔可當全量完成。 |
| Regression | 文件存在且列 B–G = 未開始 |
| Verification | 本 PR 含該檔 |
| Owner | 工程（agent）／創辦人確認 |
| Deadline | 本 Phase 7（已做） |
| 狀態 | **Done（文件）** |

### R-P0-002 · 三項 P0 未答 → RLS／PITR／遷移全 Locked

| 欄 | 內容 |
|---|---|
| 關聯 | T-RLS-001–003、T-SEC-006／007、T-OPS-003／004 |
| Root cause | 無書面 production／staging 身分、部署來源、incident commander／PITR |
| Fix | 創辦人書面答三項；先 staging 只讀對帳（`milestone-a-rls-readiness.md` SQL）；PITR drill 後先考慮任何 migration |
| Regression | `test:rls`（待建）＋drill 記錄 |
| Verification | 對帳結果貼回 docs／FOUNDER-QUEUE |
| Owner | **創辦人**（阻塞） |
| Deadline | 未定（等人） |
| 狀態 | **Open · 等人** |

### R-P0-003 · 離線合併／checksum 未達 D4／D5 遷移標準

| 欄 | 內容 |
|---|---|
| 關聯 | T-OPS-003、T-OPS-004、T-UNIT-007 |
| Root cause | Milestone E／F 未做；現有 blob merge／CAP 200 風險 Phase 1 已登記 |
| Fix | 設計已在 4B；實作 op-log＋checksum；**無 drill 唔遷移** |
| Regression | merge／checksum 單元＋staging 回填 diff=0 |
| Verification | 丢失率 0 報告 |
| Owner | 工程（等 Milestone E／F 批准） |
| Deadline | 未定 |
| 狀態 | **Open · 等 Milestone 批准** |

---

## 3. P1 remediation

### R-P1-001 · 私隱／同意／刪除（Milestone B）

| 欄 | 內容 |
|---|---|
| 關聯 | T-INT-003、T-INT-004 |
| Root cause | Milestone B 未開工；S1／S2 未最終法律確認 |
| Fix | 批准後：易讀 PICS、同意／刪除狀態機 UI＋文案；**唔** apply 新表直至 S1／S2／P0 |
| Regression | 文案快照；冷靜期可撤回測試（設計後） |
| Verification | 私隱頁同實作一致（無假承諾） |
| Owner | 工程＋創辦人／法律 |
| Deadline | 未定 |
| 狀態 | **Open** |

### R-P1-002 · Auth live／staging 煙測

| 欄 | 內容 |
|---|---|
| 關聯 | T-AUTH-004、T-SEC-006、部分 T-INT-002 |
| Root cause | 無 staging 憑證；本輪只跑 unit／靜態 |
| Fix | staging 環境就緒後：未登入 401、429 分桶、登出 wipe 手動 |
| Regression | 煙測 checklist 入 Phase 8 |
| Verification | 截圖／日誌 |
| Owner | 工程（等 P0） |
| Deadline | 未定 |
| 狀態 | **Open** |

### R-P1-003 · 共用裝置手動驗證

| 欄 | 內容 |
|---|---|
| 關聯 | T-OPS-002、T-AUTH-003（手動部分） |
| Root cause | 接線已 Pass；缺兩帳戶瀏覽器驗證 |
| Fix | 手動：帳戶 A 有本機進度 → 登出 → 帳戶 B／訪客唔見 A 資料 |
| Regression | 可後補 e2e（要依賴批准） |
| Verification | 錄影／截圖 |
| Owner | 工程／創辦人 |
| Deadline | Milestone A 合併後盡快 |
| 狀態 | **Open** |

### R-P1-004 · 內容 provenance／Hub 依賴後續 milestone

| 欄 | 內容 |
|---|---|
| 關聯 | T-CONTENT-002／003、T-SEO-002–004 |
| Root cause | Milestone C／G 未做 |
| Fix | 按 4A／4C 設計實作；禁止未審內容外露 |
| Regression | qa＋SEO verify 擴 routes |
| Verification | Hub 抽樣＋sitemap |
| Owner | 工程 |
| Deadline | 未定 |
| 狀態 | **Open** |

### R-P1-005 · 性能／a11y blocker 未量

| 欄 | 內容 |
|---|---|
| 關聯 | T-PERF-003、T-A11Y-002／003 |
| Root cause | S3 未最終確認；無 axe／Lighthouse CI；Milestone D／F 未做 |
| Fix | 先量 baseline；確認 S3；再加閘（另批依賴） |
| Regression | bundle／axe 報告 |
| Verification | 對照 D3 |
| Owner | 工程＋創辦人（S3） |
| Deadline | 未定 |
| 狀態 | **Open** |

### R-P1-006 · 學校 NAT 誤 block 監察

| 欄 | 內容 |
|---|---|
| 關聯 | T-ABUSE-006 |
| Root cause | 限流邏輯已改；缺真實流量監察 |
| Fix | 發布／beta 期間盯 429；誤傷則放寬 class 或審批白名單（只 log） |
| Regression | 誤 block 計數 = 0 |
| Verification | 日誌／指標 |
| Owner | 創辦人 ops |
| Deadline | 進 Phase 9 前 |
| 狀態 | **Open** |

---

## 4. P2 remediation

| ID | 關聯 | Root cause | Fix | 狀態 |
|---|---|---|---|---|
| R-P2-001 | T-E2E-001 | 無 Playwright；憲章慎依賴 | 另批先加最小煙測 | Open · 等人批准 |
| R-P2-002 | T-PERF-004、T-A11Y-004 | 缺 bundle／motion 專項 | Milestone F | Open |
| R-P2-003 | T-SEC-004 | KaTeX／Sentry transitive moderate | 協調升級；**禁** `audit fix --force` | Open · 排程 |
| R-P2-004 | T-ABUSE-005 | 無 Redis；IP 分桶限制 | 文件已誠實；分散式限流另批 | Accepted risk／另批 |
| R-P2-005 | T-OPS-005 | 無 runtime cost breaker | Milestone F 設計落地 | Open |
| R-P2-006 | T-UNIT-007 | op-log helper 未寫 | 隨 E／F | Open |

---

## 5. P3 remediation

### R-P3-001 · CI／本地 build OOM（T-PERF-002）

| 欄 | 內容 |
|---|---|
| Root cause | Next webpack production build 峰值記憶體高；細 heap 會 Abort |
| Fix | CI `Build check` 設 `NODE_OPTIONS=--max-old-space-size=8192` |
| Regression | CI build 綠 |
| Verification | workflow diff；本地已用同值 build Pass（Phase 6） |
| Owner | 工程 |
| Deadline | Phase 7（本 PR） |
| 狀態 | **Done** |

---

## 6. 本輪已關閉／驗證

| 項 | 做法 | Evidence |
|---|---|---|
| R-P0-001 狀態透明 | 新增 `phase-5-status.md` | 本 PR |
| R-P3-001 build heap | CI env | `.github/workflows/ci.yml` |
| T-AUTH-005 open redirect | 確認既有 `lib/__tests__/auth-callback.test.mts`（`safeInternalPath`） | 測試檔存在；隨 `npm test` 綠 |

---

## 7. 明確不做（本 Phase）

- 假 UI 滿足 Blocked 案  
- production／staging schema 變更  
- `npm audit fix --force`  
- 未批准加 Playwright／axe 重型依賴  
- 一次過開工 Milestone B–G  

---

## 8. Phase 8 介面（預告）

Phase 8 驗收清單必須：

1. 引用 `phase-5-status.md`——只驗收 **已完成 milestone** 能力；  
2. 未完成 milestone 標 **N/A／Out of scope**（除非你另收窄或批准實作）；  
3. 唔用 Phase 6 嘅 Blocked 當「產品 Fail」要求即發 hotfix。

---

## 9. 完成清單

### 已完成

1. 分類 Fail=0／Blocked→P0–P3 remediation  
2. 程序修正：`phase-5-status.md`  
3. CI build heap 即修  
4. 確認 open-redirect 既有覆蓋  

### 產出

- `docs/update-v6/phase-7-remediation-report.md`（本檔）  
- `docs/update-v6/phase-5-status.md`  
- `.github/workflows/ci.yml`（NODE_OPTIONS）  

### 需要你確認

1. 批准進入 Phase 8（隔離驗收——須接受「只驗 A＋既有主線」）？  
2. 是否批准 **Milestone B**（解鎖最多 P1）？  
3. 三項 P0？  
4. Playwright／axe 依賴？  

**Phase 7 完成，等待批准。**
