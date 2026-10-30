# 首頁 Link prefetch 收斂（2026-10-29）

狀態：**已落地程式改動，待合併** · 對應 2026-10-28 首頁效能稽核 Performance WP。

## 稽核界線（唔好讀錯）

- 稽核量度屬 **lab-only**（本機／合成環境嘅 TTFB、FCP 觀察）。
- **唔會**喺呢度宣稱正式站 Core Web Vitals、CrUX 欄位資料，或任何 **Lighthouse 分數**（包括「分數提升了 X」）。
- 本 WP 只收斂「首屏附近、非練習主路徑」嘅 Next.js `<Link>` 預取，減低同主 CTA 搶帶寬嘅風險假設；成效要用之後真實欄位／可控 lab 再量，唔好用估算分冒充。

## 做法

| 類別 | 路由例子 | Prefetch |
|---|---|---|
| 練習主路徑 | 快速開始 `/practice?subject=…`、`ContinueCard`、Navbar／BottomNav「開始練習」`/start`、殼層「練習」`/subjects`、科目卡 | **保持預設**（允許預取） |
| 次要殼層／資訊 | `/bookmarks`、`/dashboard`、`/predictor`、`/relax`、`/off-syllabus`、`/notes`、`/account`、`/about`、`/credits`、首頁 `/transparency`、`/trust`、季節副 CTA（`hero.ctaSecHref`） | **`prefetch={false}`** |

改動檔：`app/HomePageClient.tsx`、`components/Navbar.tsx`、`components/Sidebar.tsx`、`components/BottomNav.tsx`。  
靜態回歸：`lib/__tests__/home-prefetch.test.mts`。

## 點解唔用「全站關預取」

主 CTA（繼續／快速開始／開始練習）仍然預取，避免為慳首屏而拖慢學生最常撳嘅下一步。次要路由多數喺側欄／底欄常駐，預設 viewport 預取會喺首屏前後一齊開火，呢度先關佢哋。
