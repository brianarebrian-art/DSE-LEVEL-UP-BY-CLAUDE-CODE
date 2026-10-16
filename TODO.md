# 升級待辦

- [x] 「不考之地」卡片具備手機優先、可觸控、可用鍵盤的展開互動，並在 reduced-motion 下保留完整內容。
- [x] 卡片分享按鈕可將卡片摘要、當前連結、Threads 與 Instagram 平台連結複製到剪貼簿。
- [x] 公開學科與「不考之地」分類頁具備獨特 title、description、Open Graph、Twitter Card 與 canonical metadata。
- [x] 公開分類頁注入 LearningResource JSON-LD；sitemap 與 route manifest 包含所有動態分類路由。
- [x] 建立固定高度、非遮擋內容、CLS-safe 的響應式廣告／贊助預留版位。
- [x] 通過 TypeScript、lint、build 與既有 QA 驗證；推送 GitHub 並建立 Vercel 預覽部署。

驗證摘要：`tsc --noEmit`、`npm run build` 通過；lint 0 errors（既有 29 warnings）；不考之地/metadata/site-origin 測試 19/19 通過；Vercel deployment `dpl_3RxSZszz7kWTuQ75qgGkWwZHSGhS` READY。
