# J · 最少事件 tracking plan＋每週決策報告骨架（DRAFT）

狀態：**待批准** · 2026-10-29  
Session Replay：**預設唔開**。

## 最少事件白名單（建議）

| 事件 | 用途 | 禁止附帶 |
|---|---|---|
| `practice_started` | 漏斗 | 密碼／token／完整 email／題目全文 |
| `practice_completed` | 完成率 | 同上 |
| `question_answered` | 可選；只要科／難度／對錯 | 唔要 raw PII |
| `explanation_viewed` | 解析使用 | 同上 |
| `auth_sync_error` | 登入／同步異常（聚合） | 唔要 stack 內 secret |

現有已披露量度：Vercel Web Analytics、Speed Insights、Sentry 錯誤、匿名 `practice_counts`／部分 feedback 表——**唔自動等於**上表產品事件已實作。

## 每週一頁決策報告骨架

標題：`週報 YYYY-MM-DD`（香港時間）

1. 開始／完成練習（總量／按科若有）  
2. 三大阻礙（登入、載入、題目、同步…）  
3. 題目優先（壞題／收起／待審）  
4. 登入／同步異常  
5. 三個決策（要創辦人拍板）  
6. 未知／待研究  

## 待批准

- 白名單是否夠用／要加刪。  
- 用邊個免費／已有管道收集（禁止未批新付費 SDK）。  
