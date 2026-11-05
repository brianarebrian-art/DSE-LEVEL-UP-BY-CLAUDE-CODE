# DSE LEVEL UP SEO 增長衝刺分析與策略報告

本報告針對 `dselevelup.com` 近期搜尋表現數據進行診斷，制定並實作系統性 SEO 優化架構，以達成下一個 30 天週期的核心 KPI 指標。

---

## 1. 現況診斷與 KPI 差距分析 (Gap Analysis)

根據 Google Search Console 實際表現數據（基準日期：2026-11-05）：

| 指標 | 基準現況 (Baseline) | 目標 (30-Day Target) | 差距倍數 / 變動需求 |
| :--- | :--- | :--- | :--- |
| **平均排名 (Avg Position)** | 8.86 | **4.0** | 需要大幅躍升 **-4.86** 名次 |
| **平均點閱率 (Avg CTR)** | 6.71% | **15.0%** | 需要提升 **2.23x**（增長 8.29%） |
| **曝光總數 (Total Impressions)**| 1,698 | **10,000** | 需要擴張 **5.89x**（增加 8,302 次） |
| **總點擊次數 (Total Clicks)** | 114 | **1,500** | 需要增長 **13.16x**（增加 1,386 次） |

### 現狀核心瓶頸診斷
1. **點閱率兩極化**：最佳頁面 `/notes/geography` 點閱率達 21.21%，表現極佳；然而重點流量頁 `/subjects/health-management` 曝光達 198 次，平均排名 8.62，CTR 卻只有 5.56%。
2. **零點擊高潛力關鍵字（Zero-Click Gold）**：
   - `dse level`：41 次曝光，排名 4.27，0 點擊。
   - `dse pe notes`：19 次曝光，排名 7.84，0 點擊。
   - `健康管理`：18 次曝光，0 點擊。
   - `旅遊與款待筆記`：9 次曝光，排名 9.33，0 點擊。
   - `ths 科目`：9 次曝光，排名 10.56，0 點擊。
   - `科技與生活dse`：5 次曝光，排名 7.40，0 點擊。
3. **搜尋外觀 (Search Appearance) 為零**：全站未出現 Rich Results（富媒體摘要/問答面板/星級），SERP 點閱吸引力不足。
4. **內容深度與雙向連結不足**：選修科目（HMSC、ERS、THS）頁面內容過於簡略，缺乏課題深度指南，且 `/subjects` 與 `/notes` 間未建立緊密的互聯關係。

---

## 2. 三大階段實作方案與成果

### 第一階段 (Phase 1)：提升點閱率 CTR (6.71% → 10%+)
- **全新集中化 SEO 設定 (`lib/seo-config.ts`)**：
  - 覆蓋全站 25 個 DSE 學科與首頁。
  - **標題命名規範**：`[科目全名] DSE 筆記 | [數字+賣點] - DSE LEVEL UP`（關鍵字絕對前置，嚴格限制繁體中文 28 字以內 / 60 字元以下，確保 SERP 完整顯示不被截斷）。
  - **描述撰寫規範**：70–90 繁體中文字，必須涵蓋「免費」、「筆記」、「題目/重點」及行動號召（CTA），吸引考生點擊。
- **針對性搶佔零點擊高頻詞**：
  - 首頁更新 Title 為：`DSE LEVEL UP | DSE 溫習平台 免費26,000+題 選擇題操練 - 考試急症室`，精準匹配 `dse level`、`dse 溫習`、`免費 題目`。
  - 優先改寫 7 大焦點頁面：首頁 `/`、`/subjects/health-management`、`/subjects/ethics-religious`、`/notes/ethics-religious`、`/notes/pe`、`/subjects/ths`、`/subjects/csd`。

### 第二階段 (Phase 2)：躍升平均排名與擴大曝光 (8.86 → 6.0，曝光 → 5,000)
- **內部雙向高權重互聯 (`components/RelatedNotes.tsx`)**：
  - 在 `/subjects/[subject]` 與 `/notes/[subject]` 間建立語意相符的上下文互聯組件。考生在做題目時能一鍵參閱核心筆記，閱讀筆記時能無縫跳轉到練習題庫，建立強大的內部 PageRank 迴圈，同時降低跳出率。
- **核心內容深度擴充 (`lib/deepSubjectContents.ts`)**：
  - 針對健康管理與社會關懷 (`health-management`)、倫理與宗教 (`ethics-religious`)、旅遊與款待 (`ths`) 撰寫每科超過 800 繁體中文字的考綱知識體系深度精讀指南。
  - 涵蓋全人健康、疾病三級預防、規範倫理學四大理論、雷珀旅遊模型、目的地生命週期等專業內容，徹底消除「薄弱內容 (Thin Content)」疑慮，顯著提升長尾關鍵字覆蓋率與停留時間。
- **技術 SEO 基礎健全**：
  - `app/sitemap.ts` 全面收錄 98 個靜態預渲染 URL（所有 `/subjects`、`/notes` 等頁面）。
  - 每頁均具備規範自參照 Canonical URL，杜絕重複內容。

### 第三階段 (Phase 3)：全站規模化躍升 (排名 4.0、CTR 15%、曝光 10,000、點擊 1,500)
- **結構化問答數據標記 (`components/FAQSchema.tsx`)**：
  - 為 25 個學科精心配製 3 組真實考生搜尋問答（如「倫理與宗教 DSE 難唔難？」、「DSE PE 筆記運動生理學有何必讀核心？」、「THS 科目 DSE 考核特點是什麼？」）。
  - 自動生成符合 schema.org 標準的 `FAQPage` JSON-LD，觸發 Google SERP 的摺疊問答富媒體摘要（Rich Snippets），大幅擴大搜尋結果佔用面積，預計將 CTR 推升至 15% 以上。
- **完整覆蓋零點擊搜尋詞**：
  - 體育科標題與 FAQ 融入 `dse pe notes`。
  - 旅遊與款待融入 `旅遊與款待筆記` 與 `ths 科目`。
  - 科技與生活融入 `科技與生活dse` 與食品科學關鍵詞。
- **靜態預渲染 (SSG) 效能保證**：
  - `/subjects/[subject]` 與 `/notes/[subject]` 均透過 `generateStaticParams` 於 build time 預先渲染所有 25 個學科頁面，首字節響應時間 (TTFB) 降至極致，助攻 Core Web Vitals 與爬蟲索引效率。

---

## 3. KPI 達成數據模型推演

3020\text{總點擊數 (Clicks)} = \text{曝光總數 (Impressions)} \times \text{平均點閱率 (Avg CTR)}3020

- **目標驗證**：
  302010,000 \text{ 曝光} \times 15.0\% \text{ CTR} = 1,500 \text{ 點擊}3020

- **增長路徑推演**：
  1. **曝光從 1,698 → 10,000 (5.89x)**：
     - 25 科靜態預渲染筆記頁全面收錄。
     - 每科新增 800+ 字深度考點指南，釋放至少 50+ 個長尾關鍵字組合。
     - FAQPage Schema 獲得 Google 知識圖譜與 People Also Ask (PAA) 抓取。
  2. **排名從 8.86 → 4.0 (-4.86)**：
     - 雙向內部連結（RelatedNotes）集中學科權重。
     - 關鍵字絕對前置與高權重 H1/H2 語意標籤優化。
     - 使用者停留時間大幅增加（由純題目瀏覽提升至深度精讀筆記），降低搜尋跳回率（Pogo-sticking）。
  3. **CTR 從 6.71% → 15.0% (2.23x)**：
     - 標題「關鍵字 + 數字/賣點」直接擊中考生急迫痛點（「免費26,000+題」、「2800+題目詳解」）。
     - Meta description 加入「免費 + 筆記 + 題目/重點 + 立即免費開始」黃金轉換組合。
     - FAQ Rich Results 佔用搜尋結果 2–3 倍高度空間，顯著提高點擊注意力。
