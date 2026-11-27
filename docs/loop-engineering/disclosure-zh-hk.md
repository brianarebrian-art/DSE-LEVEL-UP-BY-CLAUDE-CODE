# 披露文案草稿

狀態：文案已可復用。本分支不改練習頁或成績頁，避免與 P0 分支衝突。預覽頁只在非正式環境顯示。

程式常數：`lib/loop-engineering/disclosure.ts`。`wiredToProductionUi` 與學生作答開關都是關閉。

## (a) 預測等級

出示位置：與預測等級同一個結果畫面，不可只放在別的頁。

預測等級只是 DSE Level Up 的非官方參考估算，並不是香港考試及評核局的評級，也不能代替文憑試成績。每次出示預測等級時，這句說明必須出現在同一個結果畫面。

## (b) 題庫來源

本題庫由 DSE Level Up 自行編寫，不是香港考試及評核局的官方試題，未經考評局許可或認可，亦未經 HKDSE 學科教師審核。

## 預覽題標示

未經 HKDSE 學科教師審核

## 掛接位置（P0 合併後才做）

不要在本分支改這兩個檔。P0 正在改練習出題與成績路徑。

| 掛接點 | 元件 | 位置 |
|---|---|---|
| `app/result/ResultPageClient.tsx` | 預測等級披露 | 與預測等級同一個結果區塊，不可只放在別的頁 |
| `app/practice/` 的練習開始畫面 | 題庫來源披露 | 學生開始作答前能看見；P0 合併後再掛 |

可復用元件：`components/loop/LoopDisclosurePreview.tsx`。它讀 `lib/loop-engineering/disclosure.ts`。預覽路由 `/dev/loop-disclosure` 在 `VERCEL_ENV=production` 時回 404，所以不會出現在 dselevelup.com。

## 學生作答

不啟用。不得把學生答案用於難度校準或 AI。真實學生實測的問卷在 `prompts/questionnaire-blocked.md`，狀態是「待批准」。
