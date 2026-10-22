# 編輯教材語言政策

## 原則

DSE Level Up 同時有可切換語言的互動介面，以及由編輯撰寫、以繁體中文（香港）授課的固定教材。兩者不可混為一談：

- **互動 UI**（按鈕、輸入、錯誤訊息、帳戶流程、進度與其他會隨使用者操作改變的內容）必須使用既有 i18n 機制，或提供真正可理解的靜態雙語標籤；不可用 `i18n-exempt` 假裝已翻譯。
- **固定教材**可維持單一繁體中文版本，因為其目的是以香港 DSE 課堂語境講解概念，而不是宣稱已有完整英文 locale。
- 固定教材的搜尋 metadata 同樣以目標搜尋語言撰寫；這是 SEO 的固定文案，並非 client locale 的替代品。

> `node scripts/i18n-guard.mjs` 顯示「0 漏譯」，只代表其 CJK 字面量 regex 沒有發現未標記或未配對的行。它**不代表**整站或任何教材已完成全文英文翻譯，也不應被當作翻譯覆蓋率指標。

## 固定 `zh-Hant` 教材路由

下列新增文章在內容容器以 `lang="zh-Hant"` 劃出明確語言邊界；教材行以逐行 `i18n-exempt: zh-Hant editorial content` 註記，讓 guard 的例外範圍可審計：

| 路由 | 教材用途 | 固定語言 |
|---|---|---|
| `/dse-english` | 英文科學習路線與自評入口 | `zh-Hant` |
| `/dse-english/writing-format` | Letter、Article、Report、Speech 文體教學 | `zh-Hant` |
| `/dse-maths` | 數學溫習與二次方程學習路線 | `zh-Hant` |
| `/dse-maths/quadratic-equations` | 一元二次方程概念及原創例題 | `zh-Hant` |
| `/dse-maths/question-types/quadratic-discriminant` | 判別式參數題原創解析 | `zh-Hant` |
| `/dse-physics/motion-equations` | 勻加速運動方程與原創例題 | `zh-Hant` |
| `/ai/study-plan` | 手動規劃溫習步驟的指南 | `zh-Hant` |
| `/ai/past-paper-explainer` | 原創拆題流程指南 | `zh-Hant` |
| `/ai/practice-generator` | 現有題庫的使用限制與操作指南 | `zh-Hant` |

SEO `title` 與 `description` 一律在同一來源行以 `// i18n-exempt: zh-Hant SEO metadata` 註明。這只適用於固定搜尋文案，不能複製到真正隨 locale 改變的 UI 文案。

## 英語示例的處理

教材可在繁中解說中保留原文英語例子；這不是英文版頁面。英語句子應以語義標記指出，例如：

```tsx
<p lang="en">Letter: I am writing to suggest setting up a reading corner …</p>
<span lang="en">Furthermore, … / In addition, …</span>
```

現有例子位於 `/dse-english` 和 `/dse-english/writing-format`，用來示範英語寫作語氣、連接詞與段落，而非提供整頁英譯。周邊的說明、題目拆解及評核限制仍是 `zh-Hant` 教材。

## 導覽與連結

共用導覽的固定 label 應採用清楚的靜態雙語文字（例如中文名稱加英文說明），或在其固定繁中教材範圍內標示語言。文章內的相關閱讀連結可保留教材語言，但不得藉此豁免平台通用的互動控制。

所有新增／修改時應遵守以下檢查順序：

1. 先判斷文字是可互動 UI、固定教材、還是固定 SEO metadata。
2. UI 使用實際 i18n 或清楚雙語標籤；不要新增假的 `tr()`、locale 判斷或全域豁免。
3. 固定教材以 `lang="zh-Hant"` 劃界，並在每個含 CJK 的來源行使用合法、不可見的 JSX 註記；在 JSX 文字內使用 `{/* … */}`，不可把 `//` 寫成可見文字。
4. 固定 SEO metadata 使用行尾 `// i18n-exempt: zh-Hant SEO metadata`。
5. 執行 guard 後，以人工檢閱確認語言界線及例外理由仍然正確。
