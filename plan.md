# DSE LEVEL UP 增長升級實作計劃

## 目標
在既有 Next.js + Tailwind + Supabase 架構上，以增量方式提升「不考之地」的互動、手機可用性、搜尋/AI 引擎理解度，以及免費核心下的低干擾分享與廣告預留。

## 設計
- **候選風格**：Clean Glassmorphism（0.06）、暖色學習卡片（0.04）、極簡報紙排版（0.02）。
- **選擇**：Clean Glassmorphism。以現有莫蘭迪主題 token 為底，使用半透明 raised surface、細邊框和柔和陰影，保留護眼與 SEN 設計。
- **核心原則**：內容優先、觸控優先、動效可中止、減少動態效果時仍完整可讀。
- **互動**：用 native details 保持無 JS fallback；卡片開合以 opacity/translate 動效增添回饋；分享按鈕給即時 copied 狀態。
- **SEO/GEO/AEO**：分類與科目頁採 SSG；metadata 由實際資料衍生；LearningResource/ItemList JSON-LD 與 sitemap 同源，不公開私人頁。
- **變現**：AdSlot 固定最小高度，未接入廣告網路前只顯示安靜預留提示，不遮擋內容。

## 專案結構
- `app/off-syllabus/`：首頁、分類頁、動態 metadata、JSON-LD。
- `components/OffSyllabusShareButton.tsx`：分享文字/剪貼簿互動。
- `components/AdSlot.tsx`：CLS-safe 廣告預留。
- `app/sitemap.ts`、`public/manus-routes.json`：可索引路由清單。
