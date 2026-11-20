# 系統圖標與資產盤點清單 (Asset Inventory)

本文件盤點全站圖標與視覺資產現況，落實 100% 自主控管、零外部 CDN 依賴，並符合香港 DSE 中學生無障礙及使用者體驗標準。

## 1. 盤點概覽 (Summary)

- **外部 CDN 狀態**：全站零引用外部 CDN（例如 FontAwesome、Material Icons、Google Fonts Icons、cdnjs 外部樣式表均已確認為 0）。
- **圖標體系現況**：主要使用內建輕量 SVG 組件及向量圖標，全站現有約 85 處引入點。
- **目標架構**：
  1. 建立 `src/components/ui/Icon.tsx` 與 `components/ui/Icon.tsx`，以原生原創 24x24 2px-stroke SVG 為核心。
  2. 建立 `src/assets/icons/original/*.svg`（13+ 個全新原創 SVG）。
  3. 建立 `src/assets/illustrations/*.svg`（2+ 個空狀態與錯誤狀態原創向量插圖）。
  4. 建立 `src/lib/auto-fix-icons.ts` 自動攔截及替換舊有 class 格式（如 `<i class="fa-...">`、`<span class="material-icons">`）。
  5. 構建建置期防護（`scripts/check-asset-integrity.mjs`）與自動化測試（Playwright `tests/icons-and-images.spec.ts`）。

## 2. 核心原創圖標清單 (Original Core Icons - 13+)

所有原創圖標皆由幾何基元（線條、圓形、矩形、多邊形）親手繪製，嚴禁複製第三方版權圖形：

| 圖標名稱 | 視覺用途 | 規範尺寸 | 筆畫粗細 | 預設標籤 / 意圖 | 狀態變化 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `search` | 題庫搜尋、課題檢索 | 24x24 | 2px | 搜尋題目 | 懸停高亮、聚焦邊框 |
| `filter` | 科目篩選、難度篩選 | 24x24 | 2px | 篩選科目與條件 | 啟用/未啟用態 |
| `bookmark` | 題目收藏／加入錯題本 | 24x24 | 2px | 收藏題目 | 輪廓 (未收藏) -> 實心 (已收藏) |
| `flag` | 舉報錯題、內容勘誤 | 24x24 | 2px | 舉報錯題 | 點擊反饋 |
| `chevron-right` | 下一題、前進動作 | 24x24 | 2px | 下一題 | 懸停位移、禁用態置灰 |
| `chevron-left` | 上一題、返回前頁 | 24x24 | 2px | 上一題 | 懸停位移、禁用態置灰 |
| `close` | 關閉對話框／面板 | 24x24 | 2px | 關閉 | 懸停縮放 |
| `alert-circle` | 警告提示、錯誤提示 | 24x24 | 2px | 注意事項 | 警戒警示色 |
| `check-circle` | 正確反饋、操作成功 | 24x24 | 2px | 答對／已完成 | 成功綠色、動畫進場 |
| `moon` | 深色主題切換、夜間模式 | 24x24 | 2px | 切換夜間模式 | 激活亮起 |
| `sun` | 淺色主題切換、日間模式 | 24x24 | 2px | 切換日間模式 | 激活亮起 |
| `refresh` | 重新出題、重試操作 | 24x24 | 2px | 重新整理 | 旋轉過渡效果 |
| `share` | 分享成果、匯出卡片 | 24x24 | 2px | 分享結果 | 複製成功 Toast |

## 3. 原創插圖清單 (Original Illustrations - 4+)

1. **`empty-state`**：收藏夾為空、科目搜尋無結果等。
2. **`error-state`**：錯誤頁、404。
3. **`study-desk`**：關於頁頭圖（溫書枱）。
4. **`method-flow`**：方法論頁頭圖（題型→分析→改寫→練習）。
5. **`SpotIcon`（17+）**：填補清空 emoji 後嘅視覺空缺（About 四核、方法論步驟、5-4-3-2-1、社群功能卡等）。
6. **`public/assets/illustrations/study-desk.jpg`**：同主題靜態參考圖（可選；預設 UI 仍用 SVG）。

## 4. 全站頁面與組件對照表 (Page Placement Audit)

| 頁面 / 組件路徑 | 圖標 / 插圖位置 | 功能目的 | 無障礙與觸控規範 |
| :--- | :--- | :--- | :--- |
| `components/Navbar.tsx` | 頂欄搜尋、篩選與選單 | 搜尋題目、切換功能選單 | 觸控區域 $\ge$ 44x44px，具體 aria-label |
| `components/BookmarkButton.tsx` | 練習卡片右上角 | 題目收藏／移出租題本 | 即時反饋 Toast，外框切換為填滿 |
| `components/ReportQuestionButton.tsx` | 題目卡片右下角 | 學生錯題勘誤回報 | 點擊喚起 Dialog，清楚錯誤分類 |
| `app/practice/PracticeSession.tsx` | 答題底部按鈕列 | 「上一題」與「下一題」引導 | 圖標加文字標籤，支援鍵盤快捷鍵 |
| `components/GlobalA11y.tsx` / Modal | 各彈窗右上角 | 關閉按鈕（Close X） | 鍵盤 Esc 可關閉，聚焦清晰 |
| `app/bookmarks/BookmarksView.tsx` | 錯題本為空時 | 空狀態插圖展示 | 配搭「開始做題」按鈕及圖標 |
| `app/error.tsx` | 全域錯誤捕獲 | 錯誤狀態插圖展示 | 配搭「重新嘗試」按鈕及圖標 |
