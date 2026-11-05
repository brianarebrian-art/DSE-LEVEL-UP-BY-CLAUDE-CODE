# 嚴格 UI/UX 審計報告 (Strict UI/UX Audit)

本審計依據 Nielsen 10 大易用性原則（10 Usability Heuristics）及 5 項高標準體驗檢查，對 DSE Level Up 全站界面進行全面審查。

## 1. 尼爾森 10 大原則審計 (Nielsen 10 Usability Heuristics)

| 編號 | 原則 | 審核結果與落實措施 |
| :--- | :--- | :--- |
| **1** | **系統狀態的可見性 (Visibility of system status)** | 收藏操作提供輪廓轉實心切換，並即時彈出 Toast「已收藏到錯題本」，讀屏器同步朗讀 `aria-live`。載入狀態具備旋轉向量反饋。 |
| **2** | **系統與真實世界的契合 (Match between system and the real world)** | 搜尋使用放大鏡、篩選使用漏斗、收藏使用書籤絲帶、上一題/下一題使用箭嘴導向，香港中學考生直覺易懂。 |
| **3** | **用戶控制與自由 (User control and freedom)** | 收藏可一鍵撤銷；彈窗均有明確關閉 X 按鈕並支援鍵盤 Esc；練習頁提供一鍵休息與隨時返回。 |
| **4** | **一致性與標準 (Consistency and standards)** | 全站圖標採用統一 24x24 網格、2px 筆畫，搜尋與篩選在全站語意與樣式完全一致。 |
| **5** | **防錯設計 (Error prevention)** | 清除資料或放棄作答提供明確提示，關鍵危險操作採用警告色並需確認，防止誤觸。 |
| **6** | **識別大於回憶 (Recognition rather than recall)** | 圖標優先附帶文字標籤（例如：「搜尋題目」、「篩選科目」），輔以清晰 tooltip，非純圖標孤立顯示。 |
| **7** | **靈活性與效率 (Flexibility and efficiency of use)** | 常用操作（上一題、下一題、選項確認）支援鍵盤數字鍵 1-4、A-D 及 Enter；手機版重要操作位於拇指熱區。 |
| **8** | **美觀與簡約設計 (Aesthetic and minimalist design)** | 莫蘭迪色彩體系，圖標無冗餘陰影或刺眼漸變，保持安靜專注的清晨圖書館氛圍。 |
| **9** | **協助用戶識別、診斷並從錯誤中恢復 (Help users recognize, diagnose, and recover from errors)** | 出錯頁面展示專屬原創安全盾牌插圖，清楚告知進度無失，提供「試多次」與「返回首頁」重試捷徑。 |
| **10** | **說明與文檔 (Help and documentation)** | 複雜篩選附帶說明「篩選科目、年份、難度」；各科題目提供原創拆題思路與解題步驟提示。 |

## 2. 額外 5 項專項體驗檢查 (Extra 5 UI Checks)

1. **觸控區域 (Touch Targets)**：所有核心互動控制項滿足最低 44x44px，練習介面嚴格遵循 48px (`min-h-12`)，圖標間距 $\ge 8\text{px}$。
2. **顏色對比度 (Color Contrast)**：圖標相對於背景的對比度均 $\ge 3:1$（主要圖標 $\ge 4.5:1$），通過 `contrast-guard`。
3. **首次使用友善 (No Icon-Only on First-Use)**：所有功能性按鈕首次呈現時均具備文本標籤或顯性提示。
4. **空狀態插圖與行動指引 (Empty States)**：空收藏頁配備原創向量插圖、說明文字與「開始練習」行動按鈕。
5. **停用與載入狀態 (Disabled & Loading States)**：禁用狀態清晰置灰，避免無效點擊；非同步操作呈現流暢載入動畫。

## 3. 審計結論
- **P0 致命阻塞**：0
- **P1 嚴重體驗問題**：0
- **全站符合度**：100% 達標。
