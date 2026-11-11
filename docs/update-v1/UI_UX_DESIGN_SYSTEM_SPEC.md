# DSE Level Up：UI／UX 旗艦設計規範與系統實踐架構（方向 C：Apple 風格精緻節奏流）

本文件由首席產品設計師、UX 架構師及前端工程負責人制定，作為全站介面重塑之最高基準規範。

---

## 1. 核心設計哲學（Apple-Inspired Clarity & Restraint）

- **內容優先（Content First）**：所有視覺元素皆為學習內容與判斷訓練服務，去除所有無實質功用的裝飾邊框與圖形干擾。
- **大氣留白（Generous & Precise Whitespace）**：保持呼吸感，段落間距與模組垂直節奏清晰舒展，避免高壓環境下的資訊焦慮。
- **克制色彩（Restrained Semantic Palette）**：以溫潤中性底色配合高對比度墨色，強調色嚴格收斂至關鍵導引與點擊焦點。
- **物理減速（Purposeful Spring & Ease-out）**：互動與過渡採用臨界阻尼自然減速（`--ease-out`），零彈跳過衝，並提供無障礙瞬間降級機制。
- **極致易用（Frictionless Action）**：落實一鍵即刻開始（免登入做題）、大尺寸觸控保護（`min-h-12` / 48px）與 WCAG 2.2 AA 無障礙標準。

---

## 2. 語意化 Token 與階層定義

### 2.1 顏色體系（Tokens）
- **Surface Layer**：
  - Canvas（頁面底）：`var(--color-surface)`
  - Raised（卡片表面）：`var(--color-surface-raised)`
  - Sunken（凹陷背景）：`var(--color-surface-sunken)`
  - Material Chrome（毛玻璃磨砂）：`var(--color-material)` 搭配 `backdrop-filter: blur(20px)`
- **Ink Layer（文字層級）**：
  - Primary Ink：`var(--color-ink)`（對比度 ≥ 11:1）
  - Muted Ink：`var(--color-ink-muted)`（對比度 ≥ 4.5:1，WCAG AA）
  - Accent / Focus：`var(--color-accent)` / `var(--color-accent-strong)`

### 2.2 比例與幾何（Geometry）
- 控制元件圓角：`var(--radius-control)`（12px）
- 內容卡片圓角：`var(--radius-card)`（16px）
- 全屏與彈窗圓角：`var(--radius-sheet)`（20px）
- 最小觸控高度：全站互動按鍵確保 ≥ 48px

---

## 3. 代表性頁面與元件模式

1. **頂部導覽列（Navbar）**：輕透固定於視窗頂部，磨砂玻璃自然過渡，次級功能智慧折疊。
2. **首頁 Hero**：標題直截了當宣示產品價值，快速開始按鈕矩陣直接進入核心 10 題選擇題訓練。
3. **無障礙一體化（A11y Panel）**：支援易讀字體、閱讀尺、專注燈光、高對比度及減少動態，守護不同特質之考生。

---

*本規範為 DSE Level Up 全站後續擴展與頁面實作之唯一設計基準。*
