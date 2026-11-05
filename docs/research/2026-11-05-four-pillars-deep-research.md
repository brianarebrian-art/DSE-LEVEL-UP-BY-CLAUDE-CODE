# DSE Level Up：四大核心領域深度研究報告（Phase 1 研究階段）

**報告日期**：2026-11-05
**流程階段**：第一步 —— 研究（Research）
**目標方針**：秉持零收入、零廣告、純粹教育（「仁」）理念，針對知識圖譜、高併發邊緣架構、啟發式提問引導，以及開源可持續營運展開架構級研究。

---

## 領域一：DSE 專屬知識圖譜與演算法演進 (Knowledge Graphs & Spaced Repetition)

### 1. 現狀架構與痛點
- 現有系統具備艾賓浩斯間隔排程（`1 / 3 / 7 / 14 / 30` 天，記錄於 `lib/progress.ts`），但在跨課題（Cross-Topic）的相依性追溯上仍處於扁平結構。
- 當學生在進階課題（如微積分 Calculus / 向量 Vectors）重複答錯時，單純重推相同進階題目容易造成挫敗感，缺乏「診斷前置概念脆弱點（Prerequisite Knowledge Deficiency）」的機制。

### 2. 知識圖譜拓撲設計（HKDSE Curriculum DAG）
- **DAG（有向無環圖）模型**：
  - 將 DSE 課程各科指引切分為「概念原子節點（Concept Node）」，並建立有向邊（`requires` / `reinforces`）。
  - *範例*：`math_quad_eq`（二次方程） $\leftarrow$ `math_algebra_factorization`（因式分解）。
  - *範例*：`m2_integration`（微積分積分） $\leftarrow$ `m2_differentiation`（微分） $\leftarrow$ `math_functions`（函數）。
- **追溯降級（Remediation Fallback）演算法**：
  - 連續 2 次錯題時，演算法不僅排定間隔複習，更沿著 DAG 向上走訪父節點，選取 1 條基礎前置概念題目進行「無聲檢驗」。若前置題亦出錯，優先標定前置節點為脆弱點。

### 3. 個人化間隔重複演算法優化（FSRS / Adaptive Half-Life）
- 現有間隔為靜態陣列；進階研究建議引入基於難度系數與穩定度的改良模型：
  $$I = S \times (1 + \text{factor} \times \text{retrievability})$$
- 保持項目憲章原則：零 FOMO、零連續天數綁架、無懲罰。跳過或答錯一律於 +1 天溫和提醒，不發出催促通知。

---

## 領域二：無伺服器架構的高併發最佳化 (Serverless Infrastructure Optimization)

### 1. 現狀分析與瓶頸點
- 專案依賴 Vercel Serverless Functions 與 Supabase Postgres。在模擬試（Mock Exam）尖峰時段，數千考生可能同時提交進度與讀取題庫，容易耗盡資料庫直接連線數（Direct Connection Exhaustion）。

### 2. 資料庫連線池與交易最佳化 (Connection Pooling & Transaction Tuning)
- **Supavisor 交易模式（Transaction Mode）**：
  - Serverless Route Handler（如 `/api/progress`、`/api/sync/session`）嚴格切換至 Supabase 連接池端口（Port 6543 / PgBouncer or Supavisor Transaction Mode）。
  - 嚴禁在 Serverless 函式內開啟長生命週期連線或未使用池化直接直連 5432。
- **批次合併寫入（Write Batching & Debouncing）**：
  - 前端答題紀錄先於本機 `localStorage` 累積並經防抖（Debounce），在一個 Session 結束或背景定時批次 `UPSERT`，大幅減少 DB 交易頻率。

### 3. Edge 邊緣運算與靜態生成極大化 (Edge Caching & ISR / SSG)
- **題庫與解析 100% 靜態化（Statically Baked CDN）**：
  - 9,183 條公開題庫及非個人化解說全面透過 SSG 預編譯為靜態 JSON/HTML，託管於 Vercel Edge Network（如 `hkg1` 香港邊緣節點）。
  - 學生讀取題庫、歷屆概念解析時，0 流量打到 Supabase 資料庫，邊緣快取命中率達 99% 以上，響應時間維持在 < 50ms。
- **公開讀取與私有寫入隔離**：
  - 讀題 100% 走邊緣靜態快取；答題進度寫入經由輕量 Edge/Serverless API 經 RLS 驗證後入庫。

---

## 領域三：啟發式教學的 Prompt Engineering (Heuristic AI Guidance)

### 1. 核心理念與項目原則
- **「不憤不啟，不悱不發」**：
  - 項目憲章第 7 條與硬性限制嚴格禁止直接產出標準答案、AI 閒聊或端出未經審核的幻覺解析。
  - AI 的定位是「思維鷹架（Cognitive Scaffolding）」而非「代筆者」。

### 2. 考評局（HKEAA）評分標準與關鍵字檢測（Keyword Scoring Heuristics）
- HKEAA 評分準則通常採取「Marking Scheme Keywords + Logical Step Breakdown」。
- 提示詞架構應定義三級啟發引導：
  1. **Level 1（方向點撥）**：不提公式與答案，僅指出題幹忽略的已知條件（例如：「留意題目提到三角形是圓內接四邊形，這代表對角有什麼關係？」）。
  2. **Level 2（原理關聯）**：引導學生聯想核心定理（「諗下圓內接四邊形對角互補的性質。」）。
  3. **Level 3（分步提示）**：只提供第一步代數式起手式，剩下的推理留給學生自行推導。

### 3. 系統提示詞（System Prompt）架構原型
```markdown
角色：你是一位具備 15 年 HKEAA 評卷經驗的資深導師。
原則：
1. 嚴禁直接給出最終答案、運算結果或直接列出完整步驟。
2. 每次只問一個啟發性問題，引導學生自行發現錯誤。
3. 採用道地香港粵語書面語/專科用語（繁體中文），語氣溫和鼓勵，零貶低、零施壓。
4. 檢查學生回答時，對比考評局評分核心關鍵字，若缺乏關鍵字，提示其思考論述維度。
```

---

## 領域四：開源專案維運與資源拓展 (Open-Source Sustainability)

### 1. 零廣告、純公益教育的開源運作模式
- **典範借鑑**：
  - 參考維基媒體基金會（Wikimedia）、Khan Academy、freeCodeCamp 及 OpenStax 的發展歷程。
  - 保持技術架構與題庫完全開源透明，杜絕商業化推銷、個資轉售或廣告追蹤，建立無可撼動的公信力（Trust & Integrity）。

### 2. 科技巨頭開源與非牟利計畫申請藍圖
- **Vercel for Open Source / Non-Profit Sponsorship**：
  - 申請官方開源專案支援計畫，爭取免費企業級頻寬、Edge Network 支援與構建資源。
- **GitHub Sponsors & Public Good Recognition**：
  - 設立 GitHub Sponsors，開通透明贊助管道；申請 GitHub for Nonprofits 與 Public Good 徽章。
- **Google Cloud & Supabase Open Source Grant**：
  - 申請 Google Cloud for Startups / Non-profits 教育雲端額度，支援後端運算與安全防禦。
  - 申請 Supabase Open Source Partner 計畫，獲取免費 Pro/Team 級別的 Database 連線數與備份額度。

### 3. 開發者社群與治理生態（Community Governance）
- **Issue 範本與貢獻標準（Good First Issue / SOP）**：
  - 將題庫校對、繁體中文術語統一、A11y 無障礙優化標註為 `good-first-issue`。
  - 透過現有的 `term-guard`、`emoji-guard`、`contrast-guard` 自動化閘門，讓全球志工提交 PR 時能獲得即時反饋，確保程式碼與題庫品質不被稀釋。

---

## 下一步流程規劃（Following SOP Harness）
按照標準流程：
1. **研究（本報告完成）** $\rightarrow$
2. **定義問題（Define Problems）**：挑選四領域中優先權最高且最具急迫性之痛點（如：連線池與邊緣讀取架構優化）。
3. **驗證假設（Validate Hypotheses）** $\rightarrow$
4. **設計（Design）** $\rightarrow$
5. **實作（Implementation）** $\rightarrow$
6. **測試與驗收（Verification & Acceptance）**。
