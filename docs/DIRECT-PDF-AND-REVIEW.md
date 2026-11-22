# 直接 PDF 下載與全題庫機器審查

## 此輪完成與不代表的事項

- 課題的「直接下載 PDF」下載實際 application/pdf attachment，不開列印視窗。
- 全部296課題及25科摘要合集均已在Node產生成功，沒有把「檔案存在」當成教材已完整。
- 合集收錄現有摘要及一份擴充示範教材；其餘295課題仍缺教研編寫／逐科覆核，不假稱已完成。
- 逐題機器審查覆蓋26,428題，報告記錄現有難度、解析／人工步驟欄位、題族大小及最長正確選項等待審證據。這些是啟發式警示，**不是難度或學科正確性判決**；人工覆核數保持0，不批量重標難度。
- 未持有Google Search Console授權，未提交GSC。沒有實體iOS／Android／相機／印表機，不會把瀏覽器模擬寫成實機驗收。

## 功能與來源

- `/api/notes-pdf/[subject]?topic=[topic]`：單課題PDF。
- `/api/notes-pdf/[subject]`：本科現有摘要合集，含目錄，每課題各有QR頁。
- 只接受現有active科目及已註冊課題，未找到回404。沒有任意外部URL／檔案路徑／使用者TeX輸入。
- PDFKit伺服器端文字／字型子集嵌入，MathJax將repository內TeX轉向量SVG，再由svg-to-pdfkit繪製；不使用瀏覽器截圖當PDF文字。
- 原創圖解只讀固定registry路徑；禁止SVG外部文件或圖片請求。公式不能解析時503並提示列印替代，不輸出假成功。
- WenQuanYi Zen Hei完整字型、授權及GPL字型嵌入例外在`assets/fonts/`。PDF只嵌用到的子集，不把17MB字型送入瀏覽器JS。
- 二次方程圖內繁中標籤改為字形向量輪廓，並保留title／desc／aria-label；重建工具`node scripts/notes/outline-diagram.mjs`與原始SVG在`scripts/notes/`。因此不依賴img內SVG能否找到中文字型。
- 介面未有儲存偏好時一律繁中，即使瀏覽器是英文；已明確儲存英文選擇仍保留，英文科原文不翻掉。**不是宣稱全站所有既有雙語編輯頁都已中文化。**
- 生成日期與內容覆核日期分開；PDF頁腳含科目／課題／頁碼。合集每課題QR頁可返回相應練習。
- API套用原有一般API限流；CDN快取1日。這不是分散式防濫用保證，請監測PDF CPU與流量；新增服務沒有付費API。
- `next.config.ts`明列serverExternalPackages與字型／圖解file tracing，部署後仍須實際下載驗證，僅build通過不足以證明資產存在。

## 可重現機器審查

```sh
npx --no-install tsx scripts/notes/audit-learning.mts artifacts/learning-review
```

輸出`question-review.csv`（逐題，UTF-8 BOM）、`topic-review.json`（逐課題）與`summary.json`。現有快照在`docs/learning-review/`；逐題CSV以對話下載交付，避免把大型衍生報告混入瀏覽器bundle。

報告不修改題庫，也不判定「有steps就一定有教學價值」。重複題族或最長正確選項都可能有合理例外；須學科人員實際看題、驗算、比較干擾項與課程，逐題記錄原因後才可改題或難度。沒有教師授權、訪談、官方書本或內容授權的假聲稱。

## 正式QR目前狀態（2026-11-22）

經批准已在此專案建立296條**只限正式host**的臨時307 Bulk Redirects：

`https://www.dselevelup.com/practice/{subject}/{topic}` → `https://www.dselevelup.com/practice?subject={subject}&topic={topic}`

- 精確路徑匹配，不是萬用字元、不匹配preview域、不匹配其他頁。初始project bulk redirects及versions均為空，未覆蓋既有規則。
- 逐條與296課題清單比對後promote，版本`04a1a934-13bb-4640-b029-2f9630b0bc4f`，平台回讀isLive=true、redirectCount=296。
- 只把新QR入口接至已存在的對應練習，沒有把草稿教材或新版程式部署到正式站。
- 生產HTTPS實際回應／實體相機掃碼尚未從此環境獨立量到；平台設定已驗證不等於實機驗收。
- **部署新課題準備頁前必須移除此批臨時規則**，否則project redirects優先於deployment，會略過新準備頁。不可永久遺留。
- 回滾至初始空集合：在沒有其他人新增規則的情況下，用`vercel redirects import empty.json --force --project dse-level-up-by-claude-code --scope dselevelup`（empty.json內容為`[]`）建立空版本，核對後promote。若已有其他人新增，必須先完整匯出並只移除這296條，不可覆蓋他人的規則。

## 測試與未完成驗收

本機PDF產生已覆蓋296課題＋25科合集；全部296課題的末頁QR由獨立PDF.js渲染後交jsQR解碼，payload逐一對齊課題網址。抽樣數學／物理／數學合集確認中文文字可擷取、字型嵌入、頁碼與最後頁URL。MathJax對`\\mathrm{C_nH_{2n+2}}`的單字元下標解析有差異，PDF adapter明確加上等價括號`C_{n}`，不改來源教材語意，化學課題也已全量產生。

實際HTTP attachment、瀏覽器下載、遠端CI／Preview runtime結果以PR描述最終紀錄為準。iOS Safari／Android Chrome儲存、列印、外部PDF閱讀器、相機／紙本掃碼與專業學科覆核仍需對應人員／裝置。下載可用不等於學習成效或搜尋成效。

## GSC及後續上線

GSC仍需資源擁有人：在已驗證的`dselevelup.com`或`https://www.dselevelup.com/`資源提交`https://www.dselevelup.com/sitemap.xml`，以URL Inspection核對公開頁。不向本助理提供Google密碼／token；正式環境需要驗證資料時由擁有人自行設定。索引、曝光、排名及AI引用未驗證。

PR仍相依#247，應先處理基底合併與教材發布閘，不用較舊preview直接覆蓋目前main。直接下載功能可獨立審核；295課題內容與26,428題學科重審需逐項完成，不能以自動摘要冒充。

## 本輪實跑證據

- 321個匯出（296課題＋25科合集）全部產生成功；最大約478KB，產生器逐次測得最慢約2.2秒（不含首次Next編譯，非線上效能保證）。
- 296份課題PDF最後頁均經獨立PDF.js渲染、jsQR解碼，296個payload與科目／課題完全相符。
- 本機瀏覽器以en-US啟動：預設html lang仍為zh-HK；點擊「直接下載 PDF」收到`數學（必修部分）-二次方程-自學筆記.pdf`，HTTP為application/pdf及attachment，不開列印視窗。實際合集HTTP下載成功；無效課題404。
- 數學／物理單課題與數學合集抽樣：PDF文字可擷取繁中、字型嵌入、頁碼正確、QR正確。數學合集71頁，這是現有25課題摘要，不是71頁已教研覆核教材。
- 字型及數式測試不等於實體手機、第三方閱讀器、印表機或香港字形偏好驗收；最終遠端API資產追蹤／runtime仍須按最新PR Preview核對。

完整本機回歸：**1,577測試通過、0失敗、0略過**；TypeScript、ESLint 0 warnings、13QA及secret scan通過；production依賴audit為0 vulnerabilities。已知4GiB sandbox無法穩定完成大型production build，沿用先前批准的遠端CI／Vercel build驗收，不以本機dev成功冒充production成功。

## 本次檔案

- `README.md`
- `app/api/notes-pdf/[subject]/route.ts`
- `app/notes/[subject]/[topic]/page.tsx`
- `app/notes/[subject]/page.tsx`
- `assets/fonts/GPL-2.txt`
- `assets/fonts/README.md`
- `assets/fonts/WenQuanYi-LICENSE.txt`
- `assets/fonts/wqy-zenhei.ttc`
- `components/StudyNoteActions.tsx`
- `docs/DIRECT-PDF-AND-REVIEW.md`
- `docs/learning-review/summary.json`
- `docs/learning-review/topic-review.json`
- `lib/__tests__/direct-pdf.test.mts`
- `lib/__tests__/language-switch.test.mts`
- `lib/localePreference.ts`
- `lib/notes/pdfDocument.ts`
- `lib/notes/pdfRequest.ts`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `public/explainers/math-quadratic-study.svg`
- `scripts/notes/audit-learning.mts`
- `scripts/notes/math-quadratic-source.svg`
- `scripts/notes/outline-diagram.mjs`
