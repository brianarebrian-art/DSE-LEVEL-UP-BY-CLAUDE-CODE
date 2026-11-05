# 圖標設計系統指引 (Icon Design System)

本指引定義 DSE Level Up 全站圖標設計、幾何約束、命名規範與無障礙標準。

## 1. 設計幾何與基礎規格 (Geometric Principles)
- **基礎視窗 (viewBox)**：統一為 `0 0 24 24`。
- **筆畫粗細 (Stroke Width)**：統一為 `2px`。
- **端點與轉角 (Caps & Joins)**：一律採用 `stroke-linecap="round"` 與 `stroke-linejoin="round"`。
- **填充規則 (Fill)**：線條圖標統一 `fill="none"`、`stroke="currentColor"`；實心態圖標統一 `fill="currentColor"`、`stroke="none"`。
- **嚴禁第三方商標與字體圖標庫**：所有圖標必須由幾何基元（circle, line, polyline, polygon, path）自主繪製，零外部 CDN 依賴。

## 2. 圖標命名與資產位置
- 存放位置：`src/assets/icons/original/*.svg` 與 `src/components/ui/Icon.tsx`。
- 命名規範：小寫英文字母加連字符（kebab-case），如 `search`、`filter`、`bookmark`、`bookmark-filled`、`chevron-right`。

## 3. 尼爾森 10 大原則映射與預期行為 (Nielsen Mapping & States)

| 圖標名稱 | 點擊預期行為 (Expected Action on Click) | 尼爾森原則映射 (Nielsen Principle) | 狀態設計 (State Design) |
| :--- | :--- | :--- | :--- |
| `search` | 開啟題目搜尋輸入框或跳轉題目搜尋 | 識別大於回憶 (Recognition rather than recall) | 懸停邊框加深、焦點可見外框 |
| `filter` | 展開科目、年份、難度等篩選面板 | 靈活性與效率 (Flexibility and efficiency) | 啟用/未啟用標記點 |
| `bookmark` | 將本題目收藏至個人錯題本 | 系統狀態的可見性 (Visibility of system status) | 外框 (未收藏) -> 實心 (已收藏) + Toast 反饋 |
| `flag` | 開啟錯題回報對話框並填寫問題分類 | 協助診斷與恢復錯誤 (Help recognize/recover errors) | 點擊喚起 Dialog |
| `chevron-right` | 切換至下一道練習題目 | 系統與真實世界契合 (Match real world) | 懸停微移、最後一題轉為「查看結果」 |
| `close` | 關閉當前對話框或面板 | 用戶控制與自由 (User control and freedom) | 懸停輕微縮放、支援 Esc 快捷鍵 |

## 4. 無障礙與觸控規範 (Accessibility & Touch Targets)
1. **觸控目標**：點擊區域必須達到最低 44x44px，練習介面嚴格遵循 48px (`min-h-12`)。
2. **無障礙朗讀**：若為純圖標按鈕，必須具備顯式 `aria-label`；若圖標已有相鄰文字說明，圖標設為 `aria-hidden="true"`。
3. **顏色對比度**：圖標對比度相對於底色須達到 $3:1$ 以上（WCAG 2.1 AA）。
