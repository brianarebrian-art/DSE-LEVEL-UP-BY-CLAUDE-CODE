# DSE Level Up 發布說明 (Release Notes)

## 版本摘要
本次發布圍繞三大戰略方向：**高轉化 UI/UX**、**SEO / GEO / AEO 搜尋與 AI 引擎引用架構**、以及**低成本廣告轉化獲客體系**。

---

## 核心更新亮點

### 1. DIRECTION 1: UI/UX 高轉化漏斗
- **首頁重設**：採用 Morandi 色系與高對比 CTA，3 秒內講清「全免費 · 27,321 題 · 免註冊即操」。
- **真實動態 Social Proof**：整合已完成試卷數與活躍練習計數，建立即時信任感。
- **練習介面遊戲化即時反饋** (`PracticeGameUI`)：
  - 答對/答錯即時微回饋動畫與步進考評解析，消除「管理後台感」。
  - 零干擾進度感，提升練習專注與完成度。
- **本機轉換漏斗追蹤** (`lib/analytics/funnel.ts`)：
  - 支援 `landing_view` → `click_start` → `register_complete` → `finish_first_session` 四階段無 DB 輕量追蹤。

### 2. DIRECTION 2: SEO + GEO + AEO 全面升級
- **27,321 題 Programmatic SEO**：
  - 每條題目具備獨立可索引靜態頁面：`/questions/[subject]/[id]`。
  - 完整注入 Schema.org `QAPage` 與 `BreadcrumbList` 結構化資料，提升 Google Rich Results 命中率。
- **AI 引擎標準與爬蟲支援**：
  - `public/robots.txt` 與 `app/robots.ts`：放行 `GPTBot`、`ClaudeBot`、`Google-Extended`、`PerplexityBot`。
  - 端點發布：`/llms-full.txt`、`/ai.txt`、以及分批題目 Sitemap `/sitemap-questions.xml`。

### 3. DIRECTION 3: Sell 免費與廣告獲客
- **3 個高轉化 Landing Pages**：
  - `/free`：主打全免費、免註冊直接刷題。
  - `/free-vs-tutor`：對比大型補習社，月省數千元，直擊痛點。
  - `/dse-2027`：緊貼 2027 DSE 最新考綱，剔除過期考法。
- **廣告預算自動止損** (`docs/ads-budget-control.md`)：
  - 每日預算嚴格限制：$50 - $100 HKD。
  - 單日 CPA > $15 HKD 即時自動暫停，杜絕預算暴衝。

---

## 兩階段發布規劃 (Two-Phase Rollout)
1. **第一階段（SEO & AI 架構先行）**：
   - 發布 `robots.txt`、`sitemap-questions.xml`、`llms-full.txt`、`ai.txt` 與靜態題目頁。
   - 觀察 24 小時 Google Search Console 抓取與 Index 狀態，確保無 Schema 解析錯誤。
2. **第二階段（UI/UX 與廣告 Landing 全面推展）**：
   - 發布新版首頁 Hero、SocialProof 與 3 個廣告落地頁。
   - 啟動 Meta Advantage+ 與 Google PMax 小額預算投放測試。
