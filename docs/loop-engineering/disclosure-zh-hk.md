# 披露文案（定稿）

狀態：2026-11-27（香港時間）定稿。正本是 `lib/loop-engineering/disclosure.ts`。本頁收錄的句子必須與程式常數相同。預覽元件 `components/loop/LoopDisclosurePreview.tsx` 只讀這些常數，不另寫一套。

`wiredToProductionUi` 與學生作答開關都是關閉。練習開始畫面與成績頁今次不掛接，等 P0 #260 合併後再做。

## (a) 預測等級

出示位置：與預測等級同一個畫面，不可只放在別的頁。

預測等級是 DSE Level Up 的非官方平台估算，並不是香港考試及評核局的評級，也不能代替文憑試成績。每次出示預測等級，必須在同一個畫面標明這是非官方平台估算。

## (b) 題庫來源

本題庫由 DSE Level Up 自編，不是香港考試及評核局的試題，未經考評局許可或認可，亦未經 HKDSE 學科教師審核。

## 預覽題標示

未經 HKDSE 學科教師審核

## 掛接位置（P0 #260 合併後才做）

不要在本分支改這兩個檔，也不要改練習開始畫面或成績頁。

| 掛接點 | 元件 | 位置 |
|---|---|---|
| `app/result/ResultPageClient.tsx` | 預測等級披露 | 與預測等級同一個畫面，不可只放在別的頁 |
| `app/practice/` 的練習開始畫面 | 題庫來源披露 | 學生開始作答前能看見；P0 合併後再掛 |

可復用元件：`components/loop/LoopDisclosurePreview.tsx`。預覽路由 `/dev/loop-disclosure` 在 `VERCEL_ENV=production` 時回 404，所以不會出現在 dselevelup.com 或 www.dselevelup.com。沒有 `VERCEL_ENV` 而 `NODE_ENV=production` 時同樣 404。`VERCEL_ENV=preview` 可以顯示。

## 尚未取代的舊句

成績 API 與練習 session API 仍有較短的既有聲明。今次按範圍不改這兩條學生路徑，所以它們還不是這份定稿的出口。P0 掛接時應改為讀 `lib/loop-engineering/disclosure.ts`，避免兩套文案。

| 位置 | 現況 |
|---|---|
| `app/api/practice/grade/route.ts` 的 `predictionDisclaimer` | 仍是較短的非官方預測句，不是本頁 (a) |
| `app/api/practice/session/route.ts` 的 `disclaimer` | 仍是較短的非官方練習卷句，不是本頁 (b) |

## 學生作答

不啟用。不得把學生答案用於難度校準或 AI。真實學生實測的問卷在 `prompts/questionnaire-blocked.md`，狀態是「待批准」。
