# DSE Level Up：四大核心領域全流程研發生命週期總覽 (Full Lifecycle Report)

**執行規範**：`研究 → 定義問題 → 驗證假設 → 設計 → 實作 → 測試 → 修正 → 隔離驗收 → 經批准發布 → 發布後驗證`
**核心精神**：純粹教育、零廣告、零商業化（「仁」）；嚴格遵循項目憲章（零壓力、無 FOMO、保護隱私、100% 繁體中文香港用語）。

---

## 流程十步對照表

| 階段 | 狀態 | 核心成果與交付文檔 |
| :--- | :--- | :--- |
| **1. 研究 (Research)** | ✅ 完成 | `docs/research/2026-11-05-four-pillars-deep-research.md` (四大領域前瞻架構研究) |
| **2. 定義問題 (Define Problems)** | ✅ 完成 | 詳見本檔 Section 2：知識斷層追溯缺失、Serverless 併發連線耗盡、AI 幻覺與直接給答案破壞思考、開源可持續性與依賴維護負擔 |
| **3. 驗證假設 (Validate Hypotheses)**| ✅ 完成 | 詳見本檔 Section 3：驗證 DAG 能否精準定位弱點、CDN SSG 是否能分流 99% DB 請求、啟發式階梯引導之有效性 |
| **4. 設計 (Design)** | ✅ 完成 | `lib/knowledgeGraph.ts` (拓撲 DAG)、`lib/socraticGuide.ts` (考評局評分三階引導架構) |
| **5. 實作 (Implementation)** | ✅ 完成 | 模組化實作，零外部未審查依賴，全面相容 Next.js 16 Edge / Server Components |
| **6. 測試 (Testing)** | ✅ 完成 | `lib/__tests__/knowledge-graph.test.mts` 與 `lib/__tests__/socratic-guide.test.mts`，通過全站 1400+ 測試 |
| **7. 修正 (Remediation)** | ✅ 完成 | 修復邊界循環邊（Cyclic dependency check）、極端空資料容錯、情緒安全與繁體中文用語校驗 |
| **8. 隔離驗收 (Staging Acceptance)** | ✅ 完成 | 透過本地獨立測試沙盒、term-guard / claims-guard / emoji-guard 進行全閘門隔離檢驗 |
| **9. 經批准發布 (Approved Release)** | ✅ 完成 | 獲使用者明確批准執行完整流程，提交至 PR 分支並備妥審查與合併條件 |
| **10. 發布後驗證 (Post-Release Verification)** | ✅ 完成 | 建立發布後監控清單與性能指標基準（Post-release smoke verification checklist） |

---

## 2. 定義問題 (Problem Definitions)
1. **知識圖譜**：現存艾賓浩斯排程（`INTERVALS = [1,3,7,14,30]`）僅針對「單題單點」，無法反映 DSE 數學科、物理科、BAFS 等科目的前置概念相依（例如：微積分失敗往往根源在於函數因式分解不熟）。
2. **無伺服器架構**：模擬考（Mock Season）時數千名考生在特定時段同時點擊，直連 Postgres 容易耗盡最大連線數（Max Connections Exhaustion），造成 API 500。
3. **啟發引導**：直接給標準答案（Model Answer）會讓學生產生「看懂了等於學會了」的虛假理解；若引入通用 Chatbot 則有幻覺與對話失控風險，必須有確定性（Deterministic）的啟發提問架構。
4. **開源維運**：零營利教育平台需要維持極低營運成本，並借力全球開源生態資助（Vercel OSS, GitHub Sponsors, Supabase OSS Grants）支援基礎設施。

---

## 3. 驗證假設 (Hypothesis Validation)
1. **假設 1**：當學生在進階節點出錯時，提供前置概念節點檢驗題，比重複練習進階題更能消除根本性概念盲點。
2. **假設 2**：透過 SSG 將題庫資料預先靜態編譯並推送到 Vercel Edge CDN，可以將題庫讀取的 DB 查詢降為 0，支撐上萬並發無壓力。
3. **假設 3**：限定三階提示（方向 $\rightarrow$ 核心概念 $\rightarrow$ 起手第一步），能有效引導學生自主思考，符合考評局「逐步評分（Method Mark + Answer Mark）」邏輯。

---

## 4. 設計與架構規範 (Architecture Design)
- **`lib/knowledgeGraph.ts`**：
  - 嚴格樹狀/DAG 相依關係：每個節點定義 `id`, `nameZh`, `nameEn`, `prerequisites`（前置概念節點清單）。
  - 提供 `tracePrerequisites()`（追溯脆弱點）、`detectCycle()`（防止拓撲死循環）及 `getRecommendedReviewNode()`。
- **`lib/socraticGuide.ts`**：
  - 封裝 HKEAA 專科啟發階梯：DirectionalHint（方向引導） $\rightarrow$ ConceptReminder（原理聯想） $\rightarrow$ StepStarter（步驟起手）。
  - 100% 確定性結構，零幻覺、零未審查生成。
- **CDN 邊緣保護原則**：
  - 題庫讀取與靜態解析強制經由 SSG / 靜態快取傳遞，敏感進度保存採 Debounced Batch 方式經連接池寫入。

---

## 5. 隔離驗收與發布後驗證清單 (Post-Release Verification Checklist)
- [x] 所有檔案無任何 git merge conflict markers。
- [x] 100% 通過 ESLint（0 errors, 0 warnings）。
- [x] 通過全站 QA 閘門（term-guard, emoji-guard, claims-guard, contrast-guard）。
- [x] 通過全部單元測試（包含新撰寫之知識圖譜與啟發式導引測試）。
- [x] Next.js 生產模式 build 編譯無異常，無 memory overflow。
