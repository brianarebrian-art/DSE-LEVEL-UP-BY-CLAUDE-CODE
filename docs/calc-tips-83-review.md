# #83 計數機貼士卡 — 真機驗證清單（首批 5 Topic）

**狀態：草稿（2026-07-16 起草）。全部 5 張卡 `verified: false`，production 唔會顯示。**

## 點解要人手驗證

貼士卡教學生喺考場撳計數機 —— program 碼撳錯一個字元、選單路徑講錯一步，
學生喺考場就會亂。呢個係學術生死線範圍：**機器（AI）可以起草、可以核對數學公式，
但唔可以代替真人喺實體 Casio fx-50FH II（或 fx-3650P II）逐步撳一次。**

數學公式部分（每張卡嘅 program 邏輯、測試數據預期輸出）已由起草方獨立驗算；
**要人手核實嘅重點係「按鍵步驟」同「選單路徑」**（唔同機版有出入，起草方已刻意
寫到通用層面，驗證時請按真機修正到準確為止）。

## 驗證流程（每張卡）

1. 打開 `data/calcTips.ts`，搵到對應卡。
2. 喺真機按「按鍵步驟」由零開始輸入 program（或操作內置功能）。
3. 用卡底 `testZh` 嘅**兩組測試數據**行一次，核對每個輸出（包括 Math ERROR 情況）。
4. 步驟寫法同真機有出入 → 直接改 `steps` 內文。
5. 全部核對無誤 → 將該卡 `verified: false` 改 `true`，`verifiedBy` 填實名（Brian／Yuna／真名協作者）。
6. 跑 `npm run qa` + `npm run build -- --webpack`，綠燈先算完成。

> 改咗 `verified: true` 嗰刻，張卡就會喺 production 對學生可見 —— 簽名前請確保步驟 2–3 係「今日親手撳過」，唔係「上次記得啱」。

## 驗證清單

### 卡 1 二次方程求根 Program（topic: quadratic_equations）
- [ ] Program 輸入一次成功（P1–P4 任一位）
- [ ] 測試 A：a=1, b=−2, c=−2 → D=12；根 ≈ 2.7321 / −0.7321
- [ ] 測試 B：a=1, b=2, c=5 → D=−16；√D 一步出 Math ERROR
- [ ] 按鍵步驟與真機選單一致（有出入已修正）
- 驗證人（實名）：＿＿＿＿＿＿ 日期：＿＿＿＿＿＿

### 卡 2 兩點全套 Program（topic: coordinate_geometry）
- [ ] Program 輸入一次成功
- [ ] 測試 A：(1,2) 與 (4,6) → 距離 5；中點 (2.5, 4)；斜率 ≈ 1.3333
- [ ] 測試 B：(2,1) 與 (2,5) → 距離 4；中點 (2,3)；斜率一步出 Math ERROR
- [ ] 按鍵步驟與真機選單一致
- 驗證人（實名）：＿＿＿＿＿＿ 日期：＿＿＿＿＿＿

### 卡 3 等差數列 Program（topics: sequences / arithmetic_sequence）
- [ ] Program 輸入一次成功
- [ ] 測試 A：a=3, d=4, n=10 → T=39；S=210
- [ ] 測試 B：a=20, d=−3, n=7 → T=2；S=77
- [ ] 按鍵步驟與真機選單一致
- 驗證人（實名）：＿＿＿＿＿＿ 日期：＿＿＿＿＿＿

### 卡 4 內置 nCr／nPr 鍵（topic: permutation_combination）
- [ ] 8C3 = 56；8P3 = 336（兩個鍵位置與 SHIFT 層確認）
- [ ] 補集示範：C(6,3)−C(3,3) = 19
- [ ] 按鍵步驟與真機一致
- 驗證人（實名）：＿＿＿＿＿＿ 日期：＿＿＿＿＿＿

### 卡 5 SD 統計模式（topic: statistics）
- [ ] 模式切換 + 清除舊數據步驟與真機一致
- [ ] 測試 A：2, 4, 6 → x̄=4；σ ≈ 1.6330；s=2（兩個鍵都撳一次分清 σ／s）
- [ ] 測試 B：1, 1, 1, 5 → x̄=2；σ ≈ 1.7321
- [ ] 確認「離開 SD 模式數據仍殘留」現象並核對卡上陷阱寫法
- 驗證人（實名）：＿＿＿＿＿＿ 日期：＿＿＿＿＿＿

## 前端行為（已實裝）

- `components/CalcTipCard.tsx` 掛喺練習頁解析底部（MC Hack 之後），按題目 topic 命中先出現。
- `verified: false` → **production 完全唔 render**；`npm run dev`（port 3001）先見到草稿 + ⚠️ 警示章，方便審批時對住螢幕撳機。
- 禁 GIF：純文字步驟 + CSS 編號鍵帽，零外部資產。

## 下一批（驗收後先開）

circles（圓心半徑 program）、logarithms（換底）、trigonometry（餘弦定理）、
percentage（複利）、probability —— 待首批 5 張全部簽名上線再排。
