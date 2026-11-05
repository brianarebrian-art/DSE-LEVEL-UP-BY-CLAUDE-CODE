# UI 參考

Mobbin 的 `search_screens` 回覆需要付費方案，所以這裡沒有 Duolingo、Quizlet、Anki 或 Khan Academy 的截圖。沒有改從網頁下載那些 App 的畫面，避免把別人的介面檔收進倉庫。

這次先備頁借用的是這些產品裡常見、而且不依賴截圖也能講清的結構：

- 一條路徑上先看到課題，再看到下一步
- 答不上時退回先備，而不是立刻公布最終式
- 複習時間用「約 N 日後」，不用排名

頁面在 `/review/trace`，入口在進度頁「先備回溯」。視覺沿用現有的 Morandi token（紙色、墨色、加深的灰藍），沒有新的 npm 套件，沒有 emoji。
