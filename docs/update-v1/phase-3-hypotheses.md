# DSE Level Up 第一次整體大更新 · Phase 3 假設驗證計劃

**文件版本：** 1.0.0
**日期：** 2026-10-31（Asia/Hong_Kong）
**負責人：** 首席全端工程師兼保安負責人
**狀態：** Phase 3 完成，等待批准進入 Phase 4

---

## 1. 執行摘要 (Executive Summary)

本階段旨在以「低成本、高信度、零破壞線上體驗」為原則，針對 Phase 2 定義的 6 大產品核心假設設計驗證方案。透過假門測試 (Fake-door)、Staging 輕量原型 (Staging Prototype)、小群組訪談 (Small Cohort Interview) 及匿名聚合指標 (Aggregated Analytics)，在正式進行大量編碼與資料庫更動前，檢驗學生對錯題復習、錯因診斷、每週學習路線與透明審核的真實反應。

---

## 2. 假設驗證評估矩陣 (Hypotheses Validation Matrix)

### 假設 1：學生需要錯題復習多過純粹更多題目
- **Hypothesis (假設)：** 考生在掌握薄弱概念時，對「一鍵重做錯題與修復認知」的真實需求與點擊意願，高於在同一科目不斷隨機刷全新題目。
- **Evidence needed (所需證據)：** 完卷結算頁面或 Dashboard 上「重做本次錯題」CTA 的點擊率與完成率，顯著高於「再開一節隨機題目」。
- **Validation method (驗證方法)：** Fake-door 測試與 Staging-only 簡易原型。在練習結果頁提供「一鍵重做本次 3 條錯題」按鈕。
- **Minimum viable test (最小可行測試)：** 於 Staging 環境或 Preview 站點隨機邀請 50 名 DSE 學生進行 1 節 10 題測試，觀察結算時選擇「重做錯題」還是「繼續隨機刷題」。
- **Success threshold (成功閾值)：** $\ge 45\%$ 的錯題學生主動點擊「重做錯題」，且完成重做後的滿意度回饋正面。
- **Failure threshold (失敗閾值)：** $< 20\%$ 的學生點擊重做，多數人直接離開或點擊隨機新題目。
- **If failed, what changes (失敗時調整方案)：** 若學生重做意願低，代表單純原題重做吸引力不足，改為「變式題重溫」（同知識點與邏輯但更換數字/情境），並降低主動觸發頻率。
- **Whether it enters MVP (是否納入 MVP)：** **是 (Yes)** —— 為核心學習閉環不可或缺之基石。
- **Implementation cost (開發成本)：** **S (小)** —— 複用現有 `PracticeSession`，僅需過濾題目 ID 集合。
- **Security impact (保安影響)：** 極低。僅於本機內存或客戶端 Session 傳遞當前錯題 ID。
- **Data privacy impact (私隱影響)：** 零影響。未涉及雲端寫入，不採集學生身分識別資訊。

---

### 假設 2：錯因標籤能幫學生理解錯誤
- **Hypothesis (假設)：** 提供 5 大客觀錯因標籤（概念、題意理解、計算/符號、單位/格式、陷阱邏輯）讓學生在答錯時自診，能促進元認知反思，並顯著提升後續同類題目的重做通過率。
- **Evidence needed (所需證據)：** 標註錯因標籤後重做題目的通過率，明顯高於無標註錯因直接重做；且自診時間在 5 秒內完成，不產生干擾。
- **Validation method (驗證方法)：** 小樣本受控測試 (Small Cohort Test) 與紙面原型/走讀訪談 (Paper Prototype Walkthrough)。
- **Minimum viable test (最小可行測試)：** 邀請 15 位中五/中六同學，提供兩種答錯解析介面（A 組：純文字散文解析；B 組：分步解析 + 點選 5 大錯因標籤），隨後於 3 日後進行同邏輯測試題對照。
- **Success threshold (成功閾值)：** B 組在 3 日後的同邏輯題目通過率較 A 組高出 $\ge 15\%$，且 $\ge 80\%$ 受訪者表示錯因標籤「清晰不繁瑣」。
- **Failure threshold (失敗閾值)：** 兩組重做通過率無統計顯著差異，或 $> 40\%$ 受訪者表示「唔想花時間揀標籤」。
- **If failed, what changes (失敗時調整方案)：** 將錯因標籤改為「完全可選 (Optional)」甚至預設收合；解析直接高亮標出陷阱點，不強制學生主動互動。
- **Whether it enters MVP (是否納入 MVP)：** **是 (Yes)** —— 保留為精簡、可選且一鍵完成之互動。
- **Implementation cost (開發成本)：** **S (小)** —— 輕量 UI 按鈕組與本地日誌更新。
- **Security impact (保安影響)：** 零影響。
- **Data privacy impact (私隱影響)：** 零影響。錯因標籤屬於純認知分類代碼，不涉及個人敏感資料。

---

### 假設 3：每週學習路線能提高完成率
- **Hypothesis (假設)：** 提供「每週 3 至 5 次、每次 15-30 分鐘」具備明確目標之個人化學習路線，能降低面對海量題庫的無助感，提高長期完課率與留存率。
- **Evidence needed (所需證據)：** 接受入門診斷並獲得每週學習路線的學生，在 14 日內的累計練習完成節數與活躍天數，顯著高於自主隨意選科的學生。
- **Validation method (驗證方法)：** Staging-only 原型與佇列事件分析 (Cohort Analytics)。
- **Minimum viable test (最小可行測試)：** 於 Staging 建立簡易診斷流程，產生固定 3 節/週的任務清單，邀請 30 位同學體驗一週。
- **Success threshold (成功閾值)：** $\ge 50\%$ 的測試學生能完成每週至少 2 節既定學習任務。
- **Failure threshold (失敗閾值)：** $< 25\%$ 的學生完成既定路線，多數人在第 2 次任務後流失。
- **If failed, what changes (失敗時調整方案)：** 取消「固定週次」框架，改為極簡的「今日一件事 (Single Next Step)」，不顯示多日規劃，避免學生因落後排程產生心理負擔。
- **Whether it enters MVP (是否納入 MVP)：** **是 (Yes)** —— 以「柔性、隨時可暫停、不製造落後感」之形式實作。
- **Implementation cost (開發成本)：** **M (中)** —— 需規劃入門診斷前測題組與週排程邏輯。
- **Security impact (保安影響)：** 低。學習計劃儲存需綁定已驗證身分或本地狀態。
- **Data privacy impact (私隱影響)：** 低。僅記錄課題代碼與完成時間戳。

---

### 假設 4：進度儀表板能令學生知道下一步
- **Hypothesis (假設)：** 儀表板頂部呈現唯一的「Next Best Action」及 Top 3 弱項課題，能有效消除資訊焦慮，讓學生登入後 5 秒內明確知道「下一步做咩」。
- **Evidence needed (所需證據)：** 學生進入 Dashboard 後，點擊主導引 CTA 的平均決策時間 $\le 8$ 秒，點擊率 $\ge 60\%$。
- **Validation method (驗證方法)：** 使用者可用性測試 (Usability Test) 與點擊埋點 (Clickstream Event)。
- **Minimum viable test (最小可行測試)：** 製作 Dashboard 兩種佈局原型（A：現有複雜光譜/雷達/多入口；B：聚焦「Top 3 弱項 + 今日唯一行動」），測試 10 位學生的第一眼反應與點擊路徑。
- **Success threshold (成功閾值)：** 9/10 受訪者能在 5 秒內指出自己最弱的科目課題，並明確知道點擊哪裡開始改善。
- **Failure threshold (失敗閾值)：** $> 30\%$ 受訪者感到困惑，或仍花費超過 15 秒尋找練習按鈕。
- **If failed, what changes (失敗時調整方案)：** 進一步精簡 Dashboard，直接將首頁或 Dashboard 頂部替換為「智能繼續」單一主按鈕，徹底隱藏非必要圖表。
- **Whether it enters MVP (是否納入 MVP)：** **是 (Yes)** —— 優先優化 Dashboard 資訊階層。
- **Implementation cost (開發成本)：** **S (小)** —— 重構 Dashboard 前端視圖，收斂資訊密度。
- **Security impact (保安影響)：** 零影響。
- **Data privacy impact (私隱影響)：** 零影響。

---

### 假設 5：透明審核狀態會提升信任
- **Hypothesis (假設)：** 在題目卡片清楚公開標示「題目來源（原創/平行改寫/公開資料衍生）」、「改寫邏輯與考核重點」、「審核狀態（待審/已審/已修正）」及錯誤回報狀態，能顯著提升學生對題庫質素的信任，並提高主動提交優質錯誤回報的比例。
- **Evidence needed (所需證據)：** 學生在遇到爭議題目時，因看見透明審核與回報管道而給予正面評價，錯誤回報中有效回報（真正題目或解析瑕疵）比例提升。
- **Validation method (驗證方法)：** 小群組問卷訪談 (Interview Script) 與回報管道抽樣。
- **Minimum viable test (最小可行測試)：** 在 100 條具備完整 Provenance 標籤的數學與物理題目中展示透明標籤，訪談 12 位曾有疑慮的學生對標籤的感知價值。
- **Success threshold (成功閾值)：** $\ge 75\%$ 受訪者表示「見到審核狀態同改寫重點會更有信心」，回報系統有效瑕疵回報率提升。
- **Failure threshold (失敗閾值)：** 學生表示「完全唔睇呢啲標籤」或「標期待審核反而令我懷疑題目唔啱」。
- **If failed, what changes (失敗時調整方案)：** 若「待審」標記引發不信任，將未經人工覆審的題目暫限於特定練習庫，公開預設只展示通過機檢標準之題目，文案淡化流程細節，突出「題目檢核通過標準」。
- **Whether it enters MVP (是否納入 MVP)：** **是 (Yes)** —— 符合憲章核心價值「透明可信」。
- **Implementation cost (開發成本)：** **S (小)** —— 擴充題目詳情與回報狀態頁面組件。
- **Security impact (保安影響)：** 極低。唯讀展示題目中繼資料。
- **Data privacy impact (私隱影響)：** 零影響。

---

### 假設 6：免費核心閉環可帶來留存
- **Hypothesis (假設)：** 「永久免費、零廣告、不催逼、可見進步」的核心閉環，足以驅動學生在 7 日與 14 日後自然回訪，毋須依賴外部推送轟炸或懲罰性 Streak。
- **Evidence needed (所需證據)：** 依靠「聽日有 3 條錯題到期重溫」之溫和邀請，學生的 7 日/14 日自然回訪率能穩定達到或超越業界同類教育產品水準（$\ge 35\%$）。
- **Validation method (驗證方法)：** 離線日誌與聚合 Session 分析（`scripts/analytics/retention.mts` 與匿名計數）。
- **Minimum viable test (最小可行測試)：** 對現有真實活躍考生佇列，在完卷頁面強化「聽日到期預告」，對比前後 14 日回訪率。
- **Success threshold (成功閾值)：** 7 日回訪率提升 $\ge 5$ 個百分點，且學生無被催逼之負面抱怨。
- **Failure threshold (失敗閾值)：** 回訪率無改善，學生做完一節後不再返回。
- **If failed, what changes (失敗時調整方案)：** 強化「PWA 離線支援」與可選之「考試日溫柔提醒」，加強與中學自修室或老師協作引導，絕不妥協引入惡意遊戲化。
- **Whether it enters MVP (是否納入 MVP)：** **是 (Yes)** —— 作為平台長期定位之根本依歸。
- **Implementation cost (開發成本)：** **S (小)** —— 調整完卷頁文案與提示時機。
- **Security impact (保安影響)：** 零影響。
- **Data privacy impact (私隱影響)：** 嚴格遵守憲章，不採集設備指紋，不進行跨站追蹤。

---

## 3. MVP 納入與延後建議 (MVP Recommendation)

### 建議納入 MVP 的假設 (Enter MVP)
1. **假設 1 (錯題復習大於刷題)：** 核心價值所在，開發成本低，能立即解決「反覆做錯同類題」痛點。
2. **假設 2 (錯因標籤促進元認知)：** 設計為輕量、可跳過、無負擔自診，直接支撐個人化弱項分析。
3. **假設 4 (儀表板 Next Best Action)：** 消除選擇困難，引導學生快速進入修復流程。
4. **假設 5 (透明審核與回報狀態)：** 建立平台品牌信任與差異化護城河的核心。

### 建議延後驗證或分階段推進的假設 (Deferred / Phased)
1. **假設 3 (每週學習路線)：**
   - *延後理由：* 完整的每週 3-5 次排程邏輯涉及較多狀態變更與診斷前測題組編排（成本 M），建議在 Phase 5 優先實作輕量「入門 10 題診斷 + 薄弱點推薦」，待基礎錯題系統穩定後，再進一步展開完整週次日曆式計劃。
2. **假設 6 (留存閉環深度指標)：**
   - *延後理由：* 14 日以上之長週期留存驗證需要真實生產部署後持續累積數據，將列為發布後（Phase 10）技術與產品追蹤核心，不阻礙 MVP 前期建置。

---

**Phase 3 完成，等待批准。**
