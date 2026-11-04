# DSE Level Up v6 Phase 8 隔離驗收清單

- **狀態：** **SUPERSEDED**（2026-11-04）——見 [`phase-5-10-reset.md`](./phase-5-10-reset.md)。  
- **原狀態（作廢）：** Phase 8 完成，等待批准  
- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **基線：** Phase 7 tip（含 Milestone A · Phase 6／7 文件）  
- **驗收範圍（強制）：** 只驗 **Milestone A＋既有主線**。Milestone B–G 標 **N/A（Out of scope）**——見 [`phase-5-status.md`](./phase-5-status.md)、[`phase-7-remediation-report.md`](./phase-7-remediation-report.md) §8。  
- **方法：** 自動化閘重跑＋靜態／文件對帳。**無** staging RLS 實彈；**無**全流程 browser 錄影（產品閉環多數 N/A；A 項以單元／接線＋Phase 6 SEO smoke 為證）。  
- **硬閘：** P0 未答 → 唔宣稱「可上 production 遷移／全量發布」。

圖例：**Pass**／**Fail**／**N/A**／**Blocked**（要外部條件）。

---

## 0. 總裁決

| 題 | 裁決 |
|---|---|
| 喺「只交 Milestone A」收窄 scope 下，保安地基可否合併進主線？ | **有條件 Pass**（見 §1、§9；PR #177 仍待合併） |
| 喺「全量 v6 產品閉環」下是否可隔離驗收通過？ | **不通過**——診斷路線、錯題修復閉環、Hub、op-log 遷移等仍 **N/A** |
| 可否進入全量 100% 發布（Phase 9 原意）？ | **否**——見 Phase 9 計劃應改為「A 可旗標／文件發布；產品 milestone 另批」 |

---

## 1. 產品驗收（總 prompt §13）

| ID | 準則 | 結果 | 說明／Evidence |
|---|---|---|---|
| A-PROD-01 | 新學生 10 分鐘內完成診斷並得到學習路線 | **N/A** | 入門診斷／每週計劃屬 Milestone E；未實作 |
| A-PROD-02 | 清楚知道最弱 3 個課題 | **N/A** | Top-3 weak 屬 E；Dashboard 有既有掌握度／錯題 DNA，但唔等於 v6 驗收定義嘅「診斷後 Top 3」 |
| A-PROD-03 | 完成錯題重做並看到修復結果 | **N/A** | v6 錯題修復閉環屬 E；既有 reverse log／重溫唔當本 milestone 驗收 Pass |
| A-PROD-04 | 儀表板回答「有冇進步、下一步做咩」 | **N/A** | Next-best-action／月度摘要屬 E；既有 dashboard 提示位唔當 v6 Pass |
| A-PROD-05 | 錯誤回報可提交、追蹤、顯示狀態 | **部分既有／N/A** | 既有 `/api/report` 可提交（Phase 6 單元綠）；狀態追蹤／provenance 擴展屬 C → 追蹤 UI **N/A** |
| A-PROD-06 | 內容來源、審核、修正紀錄清楚 | **N/A** | Milestone C／G；`/trust`／`/transparency` 既有頁唔等於新 provenance 體系完成 |
| A-PROD-07 | RLS 阻止跨用戶存取 | **Blocked** | 要 staging／P0；文件 readiness Pass；實彈 **未做**（T-RLS-001） |
| A-PROD-08 | 異常登入、rate limit、audit log | **部分 Pass** | Rate limit route-class：**Pass**（單元）；異常登入告警／完整 audit：**N/A／既有 founder audit 未擴** |
| A-PROD-09 | 手機／低網速／離線／共用裝置／共用 IP | **部分 Pass／N/A** | 共用 IP 友善限流設計＋單元：**Pass**；離線 op-log／裝置手動：**N/A／Blocked**（F／手動） |
| A-PROD-10 | 無障礙模式可用 | **部分 Pass／N/A** | contrast／copy／claims qa：**Pass**；axe／200%／鍵盤專項：**N/A**（D／F） |
| A-PROD-11 | SEO metadata／sitemap／structured data | **部分 Pass／N/A** | 現有路由 SEO smoke 339／0：**Pass**（Phase 6）；Hub／llms.txt：**N/A**（G） |
| A-PROD-12 | 舊資料遷移 0 丢失 | **N/A** | 未遷移；禁止未 drill |
| A-PROD-13 | 離線合併唔覆蓋學生進度 | **N/A** | Milestone F op-log 未做 |
| A-PROD-14 | 共用 IP 唔誤 block 學校等 | **部分 Pass／Blocked** | 分桶單元 Pass；真人 NAT=0：**Blocked**（發布監察） |
| A-PROD-15 | 黑名單唔誤殺宗教／LGBTQ／妥瑞／共融用語 | **Pass**（閘） | `qa:claims`＋`qa:copy` 本輪綠（phase-8-evidence/gates.txt） |

---

## 2. Milestone A 專項驗收

| ID | 準則 | 結果 | Evidence |
|---|---|---|---|
| A-SEC-01 | `server-only` on service helper | **Pass** | typecheck＋server-only test；gates.txt |
| A-SEC-02 | secret:scan 擋 client 洩漏 | **Pass** | secret-scan OK |
| A-SEC-03 | CI audit high+ | **Pass** | Phase 6／CI workflow |
| A-SEC-04 | Admin／Reviewer 要 email verified | **Pass** | admin-verified-email tests |
| A-SEC-05 | 登出同步／confirm／wipe 接線 | **Pass**（接線） | session.tsx；手動兩帳戶仍 **Blocked** |
| A-SEC-06 | Route-class 限流；只 429 唔 ban | **Pass** | rate-limit tests |
| A-SEC-07 | `/monitoring` 留喺 matcher | **Pass** | csp-nonce test |
| A-SEC-08 | Secret／RLS／backup runbook 文件 | **Pass** | `milestone-a-*.md` |
| A-SEC-09 | 無 production migration／key rotate | **Pass**（遵守硬閘） | 狀態檔＋PR 說明 |

---

## 3. 工程閘（本輪重跑）

| 閘 | 結果 | Evidence |
|---|---|---|
| secret:scan | Pass | phase-8-evidence/gates.txt |
| typecheck | Pass | 同上 |
| Security 單元子集 28／28 | Pass | 同上 |
| qa:budget | Pass | 同上 |
| qa:claims | Pass | 同上 |
| qa:copy | Pass | 同上 |
| 全庫 `npm test`／build／SEO | 引用 Phase 6 | 1455／0；build；SEO 339／0——本輪為快未重跑全量（隊列尚有後續 Phase；證據仍有效於同基線） |

---

## 4. Known issues

1. **Phase 5 不完整**——只 A；全量產品驗收不通過。  
2. **P0 未答**——RLS 實彈、PITR Level 3、遷移一律 Blocked。  
3. **登出 wipe 未做雙帳戶手動證明**。  
4. **Edge 限流仍 IP 分桶**——無 Redis；已登入 user_id 分桶未做。  
5. **npm moderate**（KaTeX／Sentry glob）——唔用 `--force`；排程升級。  
6. **Build 需 8GB heap**——CI 已加 `NODE_OPTIONS`（Phase 7）。  
7. **Dashboard／錯題既有功能**存在，但**唔**計入 v6 Milestone E 驗收 Pass，避免範圍膨脹。

---

## 5. Rollback plan

| 層 | 做法 |
|---|---|
| Milestone A code | 還原／關閉 PR #177；無限流 schema |
| CI secret／audit／NODE_OPTIONS | 還原 workflow |
| 文件 Phase 6–8 | 保留作審計；唔影響 runtime |
| DB | 本系列 **無** production 變更可回滾 |

Rollback criteria（若錯誤合併 A）：error rate、錯誤 429 誤傷校網、secret 外洩跡象 → 即 revert A＋輪 key（見 secret runbook）。

---

## 6. 成本報表（靜態）

| 項 | 狀態 |
|---|---|
| `qa:budget` US$200 閘 | **Pass**（本輪） |
| 新付費 SDK | 無（除已審批 `@anthropic-ai/sdk` 例外） |
| Storage 上傳 | 仍然未開放 |
| Runtime cost breaker | **未做**（N/A／Milestone F） |
| 本系列 agent 改動額外匯費 | 文件＋CI＋限流；無新雲服務 |

---

## 7. Screenshots／browser evidence

| 項 | 狀態 |
|---|---|
| SEO／HTML production-mode smoke | Phase 6：`seo-verify` 339／0（非截圖；機器證據） |
| Milestone A UI 錄影 | **未做**——登出 wipe 建議合併後補 |
| 診斷／錯題閉環／Hub | **N/A**——無產品可錄 |

Agent 本輪 gates：`/opt/cursor/artifacts/phase-8-evidence/gates.txt`。

---

## 8. 同 Phase 9／10 嘅邊界

- Phase 9 **唔好**按「全量 5%→100% 產品旗標」理解，除非你另批 B–G 或書面收窄只發布 A。  
- 建議 Phase 9 產出：`phase-9-release-plan.md` 分兩軌——**(軌 1) Milestone A 合併**；**(軌 2) 產品 milestone 待批**。  
- Phase 10 指標同樣只對已上線範圍有意義。

---

## 9. 簽署式結論

| 角色 | 問題 | 建議勾選 |
|---|---|---|
| 工程 | A 保安地基技術驗收（自動化） | **Pass** |
| 工程 | 全量 v6 隔離驗收 | **Fail／不適用**（範圍未交） |
| 創辦人 | 是否接受「只合併 A，產品後續另批」 | **待你確認** |
| 創辦人 | P0 三項 | **待答** |

**Phase 8 完成，等待批准。**
