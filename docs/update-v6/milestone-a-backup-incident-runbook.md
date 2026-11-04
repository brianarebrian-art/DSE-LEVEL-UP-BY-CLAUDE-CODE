# Milestone A：Backup／PITR 與事故回應 runbook

- **狀態：** 操作文件完成；**未**指定 Incident commander；**未**做 Level 3 實彈演練  
- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **硬閘：** P0 #3（負責人、backup／PITR、RTO、RPO）未書面確認前，唔可宣稱「演練合格」或對 production 做破壞性 restore  

對齊：`phase-4b-data-security-design.md` §8；升級參考 `docs/security/H-THREAT-MODEL-AND-INCIDENT-DRILL-2026-10-29.md`（Auth 以 **Supabase Auth · Google** 為準，忽略稿內 Auth.js／Better Auth 字眼）。

---

## 1. Backup／PITR（待驗證目標，唔當 SLA）

| 項 | 現況／設計 |
|---|---|
| Backup schedule | 依 Supabase 計劃；**要書面確認**實際保留日數 |
| PITR | 任何 production migration／大量資料搬遷前必須確認 **on**，並完成至少一次 restore drill |
| RTO／RPO | **待創辦人定數字**；本文件只列程序 |
| App rollback | feature flag off；讀路徑切回 `user_progress` blob；migration 只准 additive |
| Checksum（D4） | mismatch → 人工；禁止自動覆蓋學生進度 |

### 1.1 遷移前最低清單（將來）

1. 確認 PITR on。  
2. 快照／匯出關鍵表（至少 `user_progress`）。  
3. Staging 先跑回填＋checksum。  
4. 失敗時讀路徑回滾；表可留、旗關。

---

## 2. 嚴重級

| 級 | 例 | 初響目標 |
|---|---|---|
| SEV1 | 多用戶資料外洩、`service_role` 外洩、大範圍錯寫／錯刪 | 即宣告；可停寫；撤 key |
| SEV2 | 單用戶 IDOR、學校共用 IP 大規模誤 429、登入全面失敗 | 1h 內圍堵 |
| SEV3 | 單點 bug、成本告警、文案／SEO 錯誤 | 工作時內 |

---

## 3. 角色

| 角色 | 狀態 |
|---|---|
| Incident commander | **未指定**（P0 阻擋） |
| 技術回應 | 創辦人／工程輪值（待定） |
| 對外溝通 | 必須創辦人批准模板後先發 |

未指定 commander 前：任何 SEV1 仍由發現者即刻執行「撤 key／限流／關旗」技術圍堵，同時通知創辦人。

---

## 4. Containment（摘要）

1. **偵測／分類**（目標 ≤ 30 min）：SEV、影響面、是否 key 外洩。  
2. **宣告**：頻道、開始時間、決策 log（時間戳）。  
3. **圍堵：**  
   - 外洩 → 即 rotate Supabase／cron／VAPID（見 `milestone-a-secret-remediation.md`）  
   - 濫用 → 收緊 route-class 限流；**唔封禁成個學校 CIDR**（D5）  
   - 壞功能 → feature flag off；必要時 Vercel rollback  
   - 寫壞資料 → 停相關 POST；準備 PITR／定向修復  
4. **影響評估：** 用戶清單、時間窗、資料類別（學習軌跡／email）。  
5. **通報決策**（目標 ≤ 24h）：是否通知受影響用戶；創辦人拍板。  
6. **修復／restore drill**（若需要）。  
7. **72h 內 post-mortem**。

### 4.1 共用 IP／共用裝置特別叮囑

- 限流只 429＋`Retry-After`；**永不** IP ban 名單自動永久封鎖。  
- 登出路徑已嘗試同步 → confirm 放棄 → `wipeThisDevice`（Milestone A）。  
- 誤傷全校：放寬該 `routeClass` 或臨時加「只 log 唔 block」白名單（須審批）；事後監査。

---

## 5. 演練級別

| Level | 內容 | Milestone A |
|---|---|---|
| 1 | 文件走讀＋本 runbook／secret／RLS 清單 | 本 PR 文件 |
| 2 | Staging 模擬 429、登出 wipe、secret-scan 擋 PR | 可本地重跑 CI 子集 |
| 3 | 指定 commander＋PITR restore＋對外模板演練 | **阻擋**（P0） |

情境 A–D：沿用 H 文件桌面步驟；Auth 改為 Google OAuth／`/auth/callback`。

---

## 6. 模板

### 6.1 內部 post-mortem

- 時間線  
- 影響（用戶數、資料類）  
- 根因  
- 做得好／唔好  
- 行動項（owner、期限）  
- 是否要改 runbook／CI／限流  

### 6.2 外部聲明（創辦人批准後）

- 承認已知範圍；唔承認未證實事項  
- 學生叮囑：留意電郵、如指示重新登入  
- 聯絡途徑  
- 唔要求密碼（本站 Google only——唔好叫人「改網站密碼」造成釣魚口實）

---

## 7. 監察訊號（現有／期望）

| 訊號 | 通道 |
|---|---|
| 5xx／異常量 | Sentry／平台 |
| 429 激增（尤其學校時段） | 日誌／將來指標 |
| Auth 回調失敗 | Sentry／auth 桶 |
| 成本／egress | `qa:budget`；將來 breaker |
| RLS／授權失敗 | `safeLog`／audit（擴建另批） |

唔記：password、API key、完整 token、長期原始 IP。

---

## 8. Rollback（應用）

- Milestone A code：還原 PR／commit；無限流 schema。  
- CI secret／audit step：還原 workflow。  
- DB：本 Milestone 無 production 變更。

---

## 9. 驗收

- [x] Backup／PITR 程序同硬閘寫明  
- [x] SEV、圍堵、共用 IP 叮囑  
- [x] Post-mortem／對外模板骨架  
- [ ] Incident commander 人名（**未定**）  
- [ ] RTO／RPO 數字（**未定**）  
- [ ] Level 3 PITR drill（**未做**）
