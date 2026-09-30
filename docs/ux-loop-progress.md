# UX 改善循環紀錄

**來源：** 2026-09-30 Yuna 貼上的「Claude Code Loop Prompt：DSE Level Up 持續 UX／產品／增長改善循環」，要求由 LOOP 1 開始持續迭代。
**分支：** `feat/ux-loop`（由 `origin/main` 的 `feda328` 開出，已包含信任中心同步數目及 `/practice` 題數標示的修正）。
**憲章 §4：** 該 prompt 列明每輪一個小 slice 及其次序，視作創辦人對所列 slice 的批准。每輪動手前，先在本檔寫明影響範圍；超出 prompt 所列範圍，或屬 prompt 第九節列明須由使用者決定的事項，一律停下。

---

## LOOP 1 — 2026-09-30

- **Slice：** 建立基線。
- **優先級：** 基線（先於 P0）。
- **基線結果：**
  - `npm test` 1089/1089 通過；`npm run qa` rc=0；`npx tsc --noEmit` rc=0；`npm run build` rc=0。
  - `npm run lint` 失敗：29 個 error，全部在 `ds-bundle/`（design-sync 生成的打包檔及 React 副本，已列入 `.gitignore`，CI 的全新 checkout 沒有這個目錄）。原始碼本身沒有 lint error。
- **改動：** `eslint.config.mjs` 忽略 `ds-bundle/**`，理由寫在設定檔內。之後 lint 為 0 error、35 warning。
- **測試：** lint rc=0。沒有新增測試：改動只影響本機生成檔是否被掃描。
- **QA：** 同上。
- **未完成：** 35 個 warning 維持原狀，不在本輪範圍。
- **新風險：** 無。忽略範圍只限生成目錄。
- **下一輪最高優先問題：** P0-A。新用戶由首頁到第一題要經「開始練習 → 科目列表 → 科目頁 → 立即開始」，首屏沒有直接開始 10 題的入口。
- **Commit：** 見 git log（`chore(lint): ignore the generated design-sync bundle`）。

## LOOP 2 — 2026-09-30

- **Slice：** 首頁首屏直接開始 10 題。
- **優先級：** P0-A。
- **影響範圍（動手前）：** `app/page.tsx`（Hero 按鈕區）、新增 `lib/quickStart.ts`、`lib/entitlements.ts`（新增 `sessionMinutes`）、科目頁改用同一函數、新增測試。不改練習流程、題庫、同步或其他頁。
- **改動：**
  - Hero 原本的「開始練習 → 科目列表」大按鈕，改為「揀一科，即刻開始 10 題」及四個核心科目（數學、英文、中文、公民），每格直接連到 `/practice?subject=…`（沿用 `lib/sessionResume.ts` 的 `practiceHref`，與「繼續」卡同一個 URL 規則）。
  - 下面一行寫明「約 15 分鐘 · 唔使登入 · 免費」，再加兩條文字連結：「揀其他科目（共 25 科）」及季節性副入口（放榜季仍是 `/waiting`、`/relax`）。
  - 預計時間由 `sessionMinutes()` 計，科目頁快速開始卡改用同一函數。
  - 為了令 360–1440 闊度的首屏都容得下：四格排成一行；桌面頂部留白、徽章及副標題下方間距各減一級；桌面吉祥物由 208px 闊縮至 176px。
  - `.claude/launch.json` 新增 `dse-level-up-prod`（`next start -p 3001`）。開發伺服器的 Tailwind 快取不會生成新 class（已知問題，見 `docs/dev-stale-css-root-cause-2026-09-16.md`），畫面驗證改用 production build。
- **只選四個核心科目的原因：** 每個 DSE 考生都修這四科；未知道學生選甚麼科之前，這是唯一不需猜測的選擇。其他 21 科仍在同一屏。
- **測試：** 新增 `lib/__tests__/home-quick-start.test.mts`（8 項）：四科都在用、連結是普通一節練習、沒有一科會先彈選修對話框、每科選擇題足夠一節、練習路徑不要求登入、時間只有一個來源、快速開始在信任標記之前、選修科會被捉到。變異測試：加入有選修的科目 → 2 項失敗；科目頁改回自行計 1.5 分鐘 → 1 項失敗。
- **驗證：** `npm test` 1097/1097；`npm run qa` rc=0；`npx tsc --noEmit` rc=0；`npm run lint` 0 error；`npm run build` rc=0。
- **畫面（production build，3001）：**
  - 375×812：四格 y=499–563，文字連結 y=595–639，全在底部浮動按鈕（y=692）之上，無水平捲動。
  - 360×800（英文）：標題一行，四格及兩條連結都在首屏；「Chinese」不截斷。
  - 390×844、430×932、768×1024、1024×768（連結底 757）、1280×800（連結底 795）、1440×900：首屏都見到四格及連結。
  - 由首頁撳「數學」到第一題四個選項出現：1.6 秒，一次點擊。以前要經科目列表、科目頁、「立即開始」。
  - 鍵盤：Tab 有可見焦點框（全站 2px outline）；每格 aria-label 為「數學：開始 10 題」，包含可見文字。
- **未完成／已知問題：**
  - 回訪學生（首屏多一張「繼續第 N 題」卡）在 375×812 時，四格仍在首屏，但兩條文字連結（y=701–745）被左下無障礙按鈕、「閱讀尺」及右下「情緒支援」按鈕遮住。這是浮動工具的問題，科目列表第一張卡的「開始練習」亦被遮住，列為下一輪。
  - 首頁倒數橫額、「2026 DSE 考生製作」字眼及頁尾守護者名單未改動：屬產品方向，待創辦人決定（見上一份 UX 審計核對）。
- **新風險：** `npx tsc --noEmit` 要 15 分鐘，因為 `tsconfig.json` 的 `**/*.ts` 把 `.claude/worktrees/` 兩份完整 repo 副本也計算在內（lint 早已排除 `.claude/**`）。
- **下一輪最高優先問題：** P0-5。手機底部三個浮動工具（無障礙、閱讀尺、情緒支援）會遮住首頁、科目列表及練習頁底部的按鈕。
- **Commit：** 見 git log（`feat(home): start ten questions from the first screen`）。

## LOOP 3 — 2026-09-30

- **Slice：** 練習頁及全站底部浮動工具遮住內容（P0-5，Loop C 第一步「工具收進單一入口」）。
- **優先級：** P0。
- **先做的小修正（另一個 commit）：** `tsconfig.json` 排除 `.claude`、`ds-bundle`。`npx tsc --noEmit` 由 15 分鐘降至約 4 秒，仍涵蓋 762 個專案檔，並以故意寫錯的檔案確認仍會報錯。
- **量度（改動前，375×812，production build）：** 練習頁底部有 6 個浮動控件：字級、易讀字體、今日夠了（y=714–748）、無障礙、閱讀尺、情緒支援（y=766–814）。它們蓋住題目進度點；答錯後第一行回饋「你發現咗一個新盲點」在 y=744，正在這排控件之下。字級及易讀字體與無障礙面板重複。
- **影響範圍：** `components/PracticeSupport.tsx`、`components/ReadingRuler.tsx`、`components/A11yPanel.tsx`、兩個練習頁頂部（`PracticeSession.tsx`、`LongPracticeSession.tsx` 各加一個按鈕）、測試。不改練習邏輯、計時、錯因自診或情緒支援掣。
- **改動：**
  - 練習頁左下角的三粒藥丸移除。字級、易讀字體本來已在無障礙面板。
  - 「今日夠了」移到題目頁頂部，排在「休息吓」旁邊（`休息吓` 早在 2026-07-22 已因同一理由放在頁頂）。按鈕只廣播事件，彈窗、和音及盲點統計仍在 `PracticeSupport`，兩種練習頁共用。彈窗補上 `role="dialog"`、`aria-modal`、標題關聯、Esc 關閉，打開時焦點落在「諗返轉頭，再做多陣」。
  - 無障礙面板新增獨立的「閱讀尺」開關（以前只能用左下角常駐掣或一鍵舒適模式）。
  - 左下角「閱讀尺」掣只在閱讀尺開着時出現，用來調高度或即時關掉；高度改為 48px。
  - 情緒支援掣不變。
- **測試：**
  - 新增 `lib/__tests__/practice-tools.test.mts`（7 項）：字級及易讀字體只在面板；面板閱讀尺開關與尺共用同一 key 及事件；尺的浮動掣只在開着時渲染；兩個練習頁頂部都有「今日夠了」，且在「休息吓」之後；彈窗語義及 Esc；情緒支援掣仍在；負向自測。
  - `hotfix-0823.test.mts` 第三節由「藥丸要橫排」改為更嚴格的「練習頁支援掣不再浮動，唯一 fixed 元素是全屏彈窗」。
  - `route-states.test.mts` 的浮動掣清單移除 `PracticeSupport`（它已沒有浮動掣）。
- **驗證：** `npm test` 1104/1104；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 375×812 練習頁：底部浮動元素只剩左下無障礙、右下情緒支援；頂部依次為「計時、休息吓、今日夠了」。
  - 答對後「答啱！」在 y=652；捲到底時「下一題」在 y=636–695，難度選擇在 y=707–736，都在角落掣（y=748）之上。
  - 「今日夠了」：撳後彈窗出現，焦點在「再做多陣」，Esc 關閉。
  - 面板撳「閱讀尺」：尺及左下 48px 掣出現；撳該掣關閉後，掣消失，面板狀態同步為「關」。**更正（LOOP 5 發現）：** 本輪的驗證腳本以「文字包含『閱讀尺』」找按鈕，實際撳中的是「一鍵舒適模式」（其說明文字亦含『閱讀尺』），所以本項當時未有真正驗證獨立開關，並把測試瀏覽器的舒適模式開着。LOOP 5 已還原設定並重新驗證，結果見 LOOP 5。
  - 360×800 英文：頂部「Question 1 / 10、Timer、Rest、Enough today」不溢出（題號換行成兩行）。
  - `/subjects`：浮動元素只剩兩粒角落掣。
- **未完成／已知問題：**
  - 回訪學生在 375×812 首頁：「揀其他科目」連結最左約 17px 仍在無障礙掣之下（首屏多了「繼續」卡）。捲一下即可見；四格快速開始不受影響。
  - 答錯後的回饋次序（情緒溫度計 → 三維自診 → 解析）在手機首屏看不到，下一輪處理。
- **新風險：** 以前沒有開過面板的閱讀尺使用者，要多撳一次（面板或一鍵舒適模式）才可開尺；已開着的使用者不受影響（掣照常出現）。
- **下一輪最高優先問題：** P0-6。手機答錯後，第一個回應是全屏「而家感覺點？」，之後自診及解析都在首屏以下，頁面不會自動捲到回饋。
- **Commit：** 見 git log（`fix(practice): move floating tools off the question`）。

## LOOP 4 — 2026-09-30

- **Slice：** 答題後回饋在手機首屏以外（P0-6「我啱唔啱？點解？下一步做咩？」）。
- **優先級：** P0。
- **量度（改動前，375×812）：** 答錯後頁面不捲動，第一行「你發現咗一個新盲點」在 y=744，揀錯因的三個按鈕在 y=876 以下；學生在首屏只見到選項變色。讀屏軟件沒有任何答題結果的提示（回饋區塊沒有 live region）。
- **影響範圍：** 新增 `lib/practiceScroll.ts`，`app/practice/PracticeSession.tsx` 加一個 effect、一個 ref、一個讀屏用的 live region；新增測試。不改答題判斷、錯因自診、情緒溫度計或解析內容。
- **改動：**
  - 答題後（如有情緒溫度計，則在它關閉後），若回饋第一行在視窗下四分之一或以下，捲動到第一行位於視窗一半高度；已在上方則不捲。揀了的選項及正確答案仍在上方。
  - 減少動態（系統設定或站內 `no-motion`）時即時跳到位置，不做平滑捲動。
  - 常駐的 `aria-live="polite"` 區域：答對讀「答啱。解析喺下面。」；答錯讀「未答啱。正確答案已經標示，揀一個錯因就睇到詳解。」
- **測試：** 新增 `lib/__tests__/practice-feedback-scroll.test.mts`（6 項）：以實測數字（744／812）計算捲動距離並確認落在一半高度；已在畫面內不捲；選項不會被捲出 sticky 頂欄；壞數值不捲；effect 在情緒溫度計關閉後才執行並顧及減少動態；live region 在答題前已存在。
- **驗證：** `npm test` 1110/1110；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 連續四題選錯：三題回饋原本在首屏以下，捲動後第一行都在 y=406，live region 文字正確；第四題回饋原本已在 y=602，不捲。截圖確認同一屏見到揀錯的選項（燈泡）、正確答案（剔號）及三個錯因按鈕。
- **未完成：**
  - 情緒溫度計路徑（難題答錯）以代碼條件覆蓋，今輪抽到的題目沒有觸發，未有實機畫面。
  - 答錯後仍要先揀錯因才見解析：這是憲章 §7 保留的三維自診，本輪不改。
- **新風險：** 自動捲動可能令習慣自己捲的學生感到頁面「跳」；只在回饋在視窗下四分之一以下時觸發，而且減少動態時不做動畫。
- **下一輪最高優先問題：** P0-B。`/subjects` 首屏是標題、「紙筆戰士」、搜尋、排序及篩選，第一張科目卡在 y=557 才出現，而卡的主要動作是進入科目頁而不是開始 10 題。
- **Commit：** 見 git log（`fix(practice): bring the feedback into view after an answer`）。

## LOOP 5 — 2026-09-30

- **Slice：** `/subjects` 科目卡直接開始 10 題（P0-B 第一步）。
- **優先級：** P0。
- **量度（改動前，375×812）：** 首屏依次是標題、三行介紹、「紙筆戰士」、搜尋、排序（手機分兩行）、篩選；第一張卡在 y=557 開始，卡底寫着「開始練習」（約 y=740，被兩粒角落掣遮住），但整張卡其實只連去科目頁，學生要在科目頁再撳一次「立即開始」。
- **影響範圍：** `app/subjects/SubjectsView.tsx`；新增測試。不改科目頁、搜尋邏輯或題數來源。
- **改動：**
  - 每張在用科目卡分成兩個連結：科目名稱延伸覆蓋整張卡，仍去科目頁；「開始 10 題」疊在最上層，直接開始一節（與首頁快速開始同一條 URL，題數讀 `SESSION_SIZE`）。卡底右邊的提示改為「課題及卷別 ›」，不再用「開始練習」形容去科目頁的動作。
  - 「紙筆戰士」由標題下方移到科目列表之後（仍在本頁，加上「打印 A4 練習卷」說明）；搜尋及排序在手機排成一行；標題及篩選下方間距各減一級；介紹文字在手機用標準字級。
  - 不使用 `data/dse-paper-formats.ts`：該檔屬待法律確認的考評局事實，本輪不增加新的使用位置。
- **測試：** 新增 `lib/__tests__/subjects-quick-start.test.mts`（5 項）：開始連結與首頁同一個 URL 函數、題數不硬編；科目頁連結延伸覆蓋整張卡，開始連結在其上層；卡根元素是 `div`，只有兩個連結，不再用「開始練習」；開始連結 48px，aria-label 包含可見文字；「紙筆戰士」入口仍在，位於列表之後。
- **驗證：** `npm test` 1115/1115；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 375×812：第一張卡 y=396–638，「開始 10 題」y=569–617，在角落掣（y=692）之上；在卡的空白位置撳去 `/subjects/math`，撳按鈕去 `/practice?subject=math`；無水平捲動。
  - 1280×800：三欄，每行的卡同高，「開始 10 題」在同一水平。
  - 重新驗證 LOOP 3 的閱讀尺開關：先清除測試瀏覽器的舒適模式設定；面板「閱讀尺」單獨開啟時，尺及 48px 掣出現，「一鍵舒適模式」維持關，易讀字體不受影響；再撳一次或撳左下掣都能關閉，面板狀態同步。
- **未完成：** Loop B 其餘部分：最近使用的科目、科目頁把課題、書寫卷、SENSEI、考卷結構收進次級區域。
- **新風險：** 對考試沒有選擇題的科目，從列表直接開始時不會經過科目頁的「僅供溫習」說明；卡上仍標示「N 條 MC」。
- **下一輪最高優先問題：** 科目頁（`/subjects/[subject]`）快速開始卡之後是書寫卷、各科專屬工具、考卷結構及 20 多個課題，全部同等顯示。
- **Commit：** 見 git log（`feat(subjects): start ten questions from each subject card`）。

## LOOP 6 — 2026-09-30

- **Slice：** 科目頁的考卷結構收入次級區域（P0-B 第二步）。
- **優先級：** P0。
- **量度（改動前，375×812，數學科）：** 快速開始卡 y=312–522、書寫卷 y=562、SENSEI y=685，之後是 389px 高的「2027 年考卷結構同現有題數」（y=841），「按課題練習」在 y=1270 才出現。
- **影響範圍：** `app/subjects/[subject]/SubjectDetailView.tsx`（該節外層由 `<section>` 改為 `<details>`）；新增測試。內容、數字、來源連結不變。
- **改動：** 考卷結構改為預設收起的 `<details>`，`<summary>` 內保留原本的 `<h2>` 標題及一個箭頭，高 52px。
- **為何不收起課題列表、書寫卷或 SENSEI：** 三者都是練習入口；考卷結構是參考資料。課題列表仍然很長（數學 25 個課題，約 2,400px），留待下一輪處理。
- **測試：** 新增 `lib/__tests__/subject-page-sections.test.mts`（2 項）：考卷結構是預設收起的 `<details>`，summary 內有 `<h2>`，題數、各卷、校本評核及來源連結仍在；兩張練習卡在它之前，課題列表在它之後。
- **驗證：** `npm test` 1117/1117；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 收起時高 54px，「按課題練習」由 y=1270 移到 y=935；展開後高 381px，內含評核大綱來源；鍵盤聚焦 summary 按 Enter 可展開；無水平捲動。
- **未完成：** 課題列表的長度及排序；最近使用的科目。
- **下一輪最高優先問題：** P0-C 其餘：練習頁的 KaTeX 公式在窄屏會否截斷或撐闊頁面，及「下一題」在長解析之後要捲很遠才撳到。
- **Commit：** 見 git log（`feat(subject): fold the paper structure below the practice entries`）。

## LOOP 7 — 2026-09-30

- **Slice：** 完成一節後的「下一步」（P0-6 延伸至一節結尾，Loop B「結果卡快速開始」）。
- **優先級：** P0。
- **先量度的兩項（不改）：**
  - 360×800 連續 10 條 M2 題，題目及解析的 KaTeX 都沒有超出視窗或被截斷。
  - 「下一題」在回饋第一行之下 300–620px，讀完解析自然捲到；不加浮動「下一題」列，因為它會再次蓋住解析及角落掣（LOOP 3 剛移走浮動工具）。
- **量度（改動前，360×800，/result）：** 「再做一次」「揀另一個課題」在 y≈2,470，排在教師報告及 IG 卡之後；「建議加強：某課題」只是文字，不能撳。
- **影響範圍：** 新增 `lib/resultNextSteps.ts`；`app/result/ResultPageClient.tsx`（新增「下一步」區，移除頁底兩個重複按鈕）；`app/practice/PracticeSession.tsx`（`dse_result` 多存 `topicIds`）；新增測試。
- **資料：** `topicIds`（課題顯示名稱 → 課題 id）只寫入 `dse_result`（純本機），不寫入 `dse_progress`（上雲白名單，改 schema 須創辦人批准，憲章 §16.E），做法與同一物件內的 `startedAt` 相同。舊的結果記錄沒有這欄，就只顯示另外兩個按鈕。
- **改動：** 分數卡之後加「下一步」：今次最弱而低於 80% 的課題（沿用頁內「建議加強」的同一規則）變成連結「練返『數列』」，直達 `/practice?subject=…&topic=…`；下面並排「再做一次」「揀另一個課題」。頁底原本的兩個按鈕移除，不重複。課題 id 須符合 `[A-Za-z0-9_-]`，手改或損壞的值不會變成連結。
- **測試：** 新增 `lib/__tests__/result-next-steps.test.mts`（7 項）：最弱課題變成專題連結；全部 80% 以上不出連結；舊記錄仍有兩個按鈕；損壞的 id 不出連結；零題課題不計；「下一步」在等級條及教師報告之前，而且只出現一次；`topicIds` 只寫本機結果，不寫上雲的進度記錄。
- **驗證：** `npm test` 1124/1124；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，360×800）：** 做完一節數學（2/10），「下一步」在 y=935（原本 y≈2,470）：「今次最弱：0/2 練返『數列』」→ `/practice?subject=math&topic=sequences`，撳下去即開始數列專題，第一題四個選項出現；無水平捲動。
- **未完成：** 英文介面的課題名仍是中文（`topicResults` 只存中文名稱，頁內原有的「建議加強」亦一樣）；分數卡在手機高約 870px，「下一步」仍在第二屏頂部。
- **下一輪最高優先問題：** P0-D。768–1023px 平板：練習頁是否善用寬度、側欄抽屜是否正常。
- **Commit：** 見 git log（`feat(result): put next steps under the score`）。

## LOOP 8 — 2026-09-30

- **Slice：** ≥1024px 練習頁題目與回饋並排（P0-D／E 的核心部分）。
- **優先級：** P0。
- **量度（改動前）：**
  - 768×1024（平板直向）：單欄 672px，題目及選項都在首屏，不需要改。
  - 1024×768：題目卡只佔中間 672px，兩邊各約 170px 空白；答題後回饋由 y=668 開始，「下一題」在 y=1171。
- **影響範圍：** `app/practice/PracticeSession.tsx`（外層闊度加 `lg:max-w-6xl`；題目卡及回饋外面包一個只在 lg 生效的兩欄 grid；未答題時右欄一句說明）；新增測試。1023px 或以下沒有任何 class 改變。
- **改動：** lg 起題目在左、回饋在右，兩欄都由頂開始；未答題時右欄顯示「揀咗答案之後，對錯、錯因同解析會喺呢邊出現，唔使捲落去。」（有 `focus-dim`，專注燈開時會淡出）。頂欄、進度條及題目進度點仍佔全寬。
- **測試：** 新增 `lib/__tests__/practice-wide-layout.test.mts`（3 項）：題目卡及回饋在同一個兩欄 grid 內，進度點在 grid 之外；grid 的每個 class 都有 `lg:` 前綴（保證 1023px 以下不變）；未答題說明只在 lg 顯示。
- **驗證：** `npm test` 1127/1127；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 1024×768：題目卡 x=40–524，回饋 x=521 起、y=182；「下一題」y=726–782（原本 1171）；LOOP 4 的自動捲動不觸發（回饋已在上方）；無水平捲動。
  - 1440×900：兩欄各 564px，「下一題」y=706–762，在首屏內。
  - 1023×768：維持單欄 672px，回饋在 y=648，說明句不顯示。
- **未完成／已知問題：**
  - 1024×768 首屏時，「下一題」右端約 40px 與右下角情緒支援掣重疊（捲到底時不重疊）；按鈕文字置中，不受影響。
  - Loop E 的題目導航（navigator）未做：現時一節只能向前，不能跳題，加導航會改變作答規則，要另行決定。
  - 鍵盤快捷鍵已有題目卡下方的提示（1–4／A–D、Enter、Shift+F），未加獨立說明頁。
- **下一輪最高優先問題：** P1-F。錯因只寫入標籤：自診「概念盲區／審題陷阱／運算粗心」之後，同一頁沒有連去相似變式或按錯因練習（`?mode=cause`）的入口。
- **Commit：** 見 git log（`feat(practice): show question and feedback side by side on wide screens`）。

## LOOP 9 — 2026-09-30

- **Slice：** 科目搜尋認得學生常用簡稱，並按相關度排序（P0-B「alias search」）。
- **優先級：** P0。
- **量度（改動前，以現有錯字容忍比對逐一試）：** 「通識」「電腦」「家政」「TL」「Liberal Studies」完全沒有結果；「LS」只配到數學；「ICT」配到 6 科、「eng」配到 6 科，並按頁面預設次序排列（ICT 排在 M2、M1 之後）。
- **影響範圍：** 新增 `lib/subjectSearch.ts`（別名表及排序）；`app/subjects/SubjectsView.tsx` 改用它，並為搜尋框及排序選單加上 `aria-label`（以前只有 placeholder）；一個舊測試的定位字串跟着改名；新增測試。
- **改動：**
  - 別名只作搜尋用途，不會顯示：例如 公民與社會發展「通識／公社／Liberal Studies／LS」、資訊及通訊科技「電腦」、科技與生活「家政／TL」、化學「Chem」、物理「Phy」。
  - 查詢等於簡稱或別名時得 1 分，排第一；其餘仍用原有錯字容忍比對。預設排序下按分數排列（同分維持原次序）；選「名稱 A–Z」或「已上線優先」時照用戶選擇。
  - 搜尋框改為 `type="search"`，`aria-label` 附例子。
- **測試：** 新增 `lib/__tests__/subject-search.test.mts`（8 項）：以前找不到的五個名稱；LS 改配公民；簡稱完全吻合排第一（ICT、eng、Chem、phy、中文、英文、數學、M2）；錯字容忍仍然有效（數学、economcs）；空查詢保持原次序；每個別名都屬真實科目而且不重複；頁面使用同一搜尋函數；搜尋框及選單有可讀名稱。
- **驗證：** `npm test` 1135/1135；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 在搜尋框輸入「通識」只剩「公民與社會發展」；輸入「ICT」時「資訊及通訊科技」排第一；搜尋框外觀與之前一致（高 42px，左側放大鏡位置不變）。
- **未完成：** 「最近使用的科目」未做（Loop B 最後一項）。
- **下一輪最高優先問題：** P0 A–E 主要項目已完成，轉入 P1-F：錯因自診後，同一頁沒有連去同一錯因的練習（`?mode=cause`）或同課題變式。
- **Commit：** 見 git log（`feat(subjects): find subjects by the names students use`）。

## LOOP 10 — 2026-09-30

- **Slice：** 由錯因到補救（P1-F）。
- **優先級：** P1。
- **量度（改動前）：** 答錯並揀錯因後，練習頁只寫「已記錄錯因 → 已寫入逆向錯題本」。現有的重溫排程（第 1／3／7／14／30 日，只在「進度」頁出現，每日最多 5 條）及「按錯因練習」（`?mode=cause`，只在「進度」頁的錯題指紋卡、同一錯因連續 3 次時出現）在練習頁及結果頁都沒有提及。
- **影響範圍：** `lib/reviewSchedule.ts`（每日上限改為具名常數 `DAILY_REVIEW_LIMIT`，數值不變）；`lib/causeMode.ts`（新增 `causePracticeHref`）；`components/ErrorDNA.tsx`（改用它）；`lib/resultNextSteps.ts`（新增 `sessionCause`）；`app/result/ResultPageClient.tsx`；`app/practice/PracticeSession.tsx`（一句說明）；測試。沒有新的儲存欄位，沒有第二套重溫或錯因邏輯。
- **改動：**
  - 揀錯因後多一句：「呢題會喺第 1、3、7、14、30 日出現喺『進度』頁嘅重溫（每日最多 5 條）。」數字讀 `INTERVALS` 及 `DAILY_REVIEW_LIMIT`。
  - 結果頁「下一步」：如本節有揀錯因，顯示次數最多的一個（同數取最近揀的），「今節揀咗 N 次呢個錯因　專練『審題陷阱』」，連去按錯因排序的一節。只在該錯因確實有題可排前（`causeHasMaterial`）及結果記錄有開始時間時顯示。
  - 按錯因練習的 URL 只在 `causePracticeHref` 組成，錯題指紋卡及結果頁共用。
- **「已核實補救資料」：** 本輪沒有加入知識卡或新解說。SENSEI 知識卡只有四科、具名覆核；計數機貼士卡未核實的在 production 隱藏。沒有核實資料的科目，不顯示任何補救內容，而不是生成一段。
- **測試：** 新增 `lib/__tests__/cause-remedy.test.mts`（6 項）：本節最多的錯因（忽略本節前及其他科）；同數取最近；只在有題可排及有開始時間時出連結；URL 可解析回錯因模式；兩處共用 URL 函數；說明句數字來自排程常數、不硬編。更新 `cause-mode.test.mts` 一項（由檢查 ErrorDNA 內的 URL 字串，改為檢查它呼叫共用函數，並驗證函數輸出）；`result-next-steps.test.mts` 一個定位字串。
- **驗證：** `npm test` 1141/1141；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812，經濟科一節，7 題揀「審題陷阱」）：** 第一題揀錯因後出現重溫說明句，內容正確；結果頁「下一步」依次為「今次最弱：0/1 練返『國際貿易』」（y=893）、「今節揀咗 7 次呢個錯因　專練『審題陷阱』」（y=971）、「再做一次／揀另一個課題」（y=1049）；撳錯因連結即開始經濟科「🎯 專攻審題陷阱」一節，第一題四個選項出現。
- **未完成：** 同一模板家族的「相似變式」未有獨立入口（按課題練習已涵蓋同課題題目）；圖示不一致（練習頁錯因用 🧠🎯🧮，發現卡用 🧩🔍✏️），屬既有問題，未改。
- **下一輪最高優先問題：** P1-G／H：題目來源披露（`QuestionProvenance`）及題數單一來源——先核對現有披露是否準確、題數在首頁、科目頁、練習頁、信任頁、sitemap 是否由同一來源計算。
- **Commit：** 見 git log（`feat(practice): point a chosen error cause to review and practice`）。

## LOOP 11 — 2026-09-30

- **Slice：** 題數及科目數只從題庫及科目表計算（P1-H）。
- **優先級：** P1。
- **盤點：** 首頁、`/subjects`、科目頁、`/practice`、`/trust`、`/transparency` 的題數已經讀 `summary.generated.ts` 或題庫，並有 `summary-parity` 等測試。仍然寫死的有：
  - `app/opengraph-image.tsx`：社交分享預覽圖寫「5,167 questions, 25 subjects」，實數是 26,510。分享連結到 WhatsApp、IG、Facebook 時就會顯示這個舊數字。
  - 「25 科／25 subjects」寫死在 `app/layout.tsx`（OG、Twitter 描述及 JSON-LD）、`app/manifest.ts`、`app/practice/page.tsx`、`app/notes/page.tsx` 的 metadata，以及 `/subjects` 介紹句（`lib/dictionary.ts` 中英各一）。
- **改動：** 預覽圖改讀 `TOTAL_QUESTIONS` 及 `getActiveSubjects().length`；各 metadata 的科目數改讀 `getActiveSubjects().length`；`/subjects` 介紹句本來前半已經顯示實數，後半改為「全部科目」，不再重複數字。`public/llms.txt` 不變（已有 claim-parity 測試對數）。
- **測試：** 新增 `lib/__tests__/count-sources.test.mts`（3 項）：掃描 `app/`、`components/`、`lib/dictionary.ts`、`data/heroContent.ts` 的程式碼（不含註解），不准出現寫死的題數（四位數以上加「questions／條／題」）或 20–29 科；預覽圖讀實數；負向自測。負向自測第一次執行就發現掃描式對「25 科」是盲的（中文字後沒有英文字詞邊界），修正後才通過，所以第一項的通過是在修正後的掃描式下得出。
- **驗證：** `npm test` 1144/1144；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：** `/opengraph-image` 渲染為「Free HKDSE practice — 26,510 questions, 25 subjects」；`/manifest.webmanifest` 描述為「涵蓋 25 科」。
- **未完成：** 已部署的網站在 push 及重新部署前仍然送出舊預覽圖；社交平台會快取預覽圖，更新後可能要用各平台的除錯工具重新抓取。
- **下一輪最高優先問題：** P1-G：題目來源披露。現有披露只寫「經自動檢查」或「待核」加報錯入口，沒有課綱版本及修訂日期。
- **Commit：** 見 git log（`fix(copy): read question and subject counts from the bank everywhere`）。

## LOOP 12 — 2026-09-30

- **Slice：** 題目來源披露只顯示有紀錄的資料（P1-G）。
- **優先級：** P1。
- **盤點：** `QuestionProvenance` 已如實顯示「經自動檢查」或「待核」（附具體問題）及報錯入口；報錯內容已含題號。題目資料（`data/questions/types.ts`）沒有逐題的課綱年份、修訂日期或覆核人欄位；具名覆核紀錄已於 2026-09-25 按 Yuna 指示刪除。2027 範圍核查仍暫停（`WAITING_FOR_COPYRIGHT_CLARIFICATION`）。
- **改動：**
  - 解析底部的披露多一行「題號 mb_h1_4_3」（等寬字、可一次選取），學生可以向老師或我哋引用。
  - `/transparency#provenance` 加一段：每題都有題號；題目紀錄沒有逐題記錄對照哪一年的課綱、何時最後修訂，所以題目上不標示這兩項。`/transparency` 的修改日期改為 2026-09-30（UTC）。
  - 沒有加入課綱年份、修訂日期、覆核人或「已覆核」字眼。
- **測試：** 新增 `lib/__tests__/question-provenance-id.test.mts`（4 項）：披露顯示題號，與報錯內容同一個；披露不出現課綱年份、修訂日期、覆核人；題目型別沒有這些欄位（若日後加入，測試會提示要更新披露及透明度頁）；透明度頁寫明兩項未有紀錄。
- **驗證：** `npm test` 1148/1148；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 答錯並揀錯因後，解析底部顯示「題號 mb_h1_4_3」，闊 301px，無水平捲動。
- **需要創辦人決定（不阻塞循環）：** 是否要為每題建立課綱年份或修訂日期欄位。這要先有人手核對的範圍事實，與暫停中的 2027 範圍核查及考評局版權問題相連。
- **下一輪最高優先問題：** P1-I：側欄／手機選單按學生任務分組。
- **Commit：** 見 git log（`feat(provenance): show the question ID and say what is not recorded`）。

## LOOP 13 — 2026-09-30

- **Slice：** 桌面側欄按學生要做的事分組（P1-I）。
- **優先級：** P1。
- **量度（改動前）：** 側欄七項一條直落，同等份量：我的進度、練習、錯題 DNA、等級預測、呼吸空間、收藏、不考之地。「練習」排第二，「收藏」排第六。練習頁本身是全屏模式，沒有側欄，所以「練習中只留核心操作」已經成立。手機的三橫選單及底部四格未改（底部已經是練習／進度／收藏／帳戶）。
- **影響範圍：** `components/Sidebar.tsx`、`lib/dictionary.ts`（三個組名，中英各一）、`app/globals.css`（一條矮屏幕規則）、`docs/tokens.md`（生成檔，按 qa 提示重跑）、新增測試。
- **改動：**
  - 三組：溫習（練習、收藏）→ 分析（我的進度、錯題 DNA、等級預測）→ 休息（呼吸空間）；「不考之地」照舊在最尾、貼底、沒有組名。目的地、名稱、圖示都沒有改。
  - 每組 `role="group"` 並有 `aria-label`；闊側欄（≥1280px）顯示組名，80px 圖標欄（1024–1279px）以分隔線代替。
  - 清單區可自行捲動（`overflow-y-auto`），不會切走最尾幾項。
  - 1280×720 量到分組後清單比可用高度多 76px，「不考之地」要捲才見到；高度 760px 或以下收起側欄底部的裝飾金句（`.sidebar-quote`，寫在 `@layer` 之外以蓋過 `xl:flex`）。
- **測試：** 新增 `lib/__tests__/sidebar-groups.test.mts`（5 項）：目的地只重新分組、沒有增減；練習排第一、四組連續、不考之地最尾；每組有 group 角色及中英組名；清單可捲動；矮屏幕收起金句的規則在最外層。
- **驗證：** `npm test` 1153/1153；`qa` rc=0（第一次失敗：`docs/tokens.md` 未跟 `globals.css` 更新，重跑生成器後通過）；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 1280×720：金句收起，清單高 529px，不用捲，「不考之地」在 y=652–704。
  - 1280×800：金句顯示，清單剛好容得下（523／523）。
  - 1024×768：80px 圖標欄，組與組之間有分隔線，不用捲。
- **未完成：** 手機三橫選單（`components/Navbar.tsx`，五項）未分組；它只有五項，暫不需要。
- **下一輪最高優先問題：** P1-J：可恢復狀態，包括題庫載入失敗、空題庫、同步衝突、登入失敗、下架題目、書寫自評。
- **Commit：** 見 git log（`feat(nav): group the sidebar by what the student is doing`）。

## LOOP 14 — 2026-09-30

- **Slice：** 登入失敗後可以返回練習（P1-J 其中一項）。
- **優先級：** P1。
- **盤點 P1-J 六項：**
  - 題庫載入失敗：已有 `BankLoadError`（`app/practice/PracticeGate.tsx`），講明原因、列出本機做過的科目、有「再試一次」。
  - 空題庫：MC 及書寫卷都有空狀態及返回連結。
  - 同步衝突：已有 `sync-merge-union`、`sync-data-boundary`、`topic-stats-sync` 測試及 `sync:conflict-repro` 腳本。
  - 下架題目：`withdrawn-lock` 測試鎖住收藏頁及紙筆戰士不會出收起題。
  - 書寫自評：`SelfAssessment` 五級自評，對照參考答案及評分準則，機器不批改。
  - **登入失敗：沒有處理。** `auth.ts` 沒有設定錯誤頁，取消或失敗的 Google 登入會去 Auth.js 內建的英文錯誤頁，沒有提到「唔登入都用得」，也沒有返回練習的連結。
- **影響範圍：** `auth.ts`（`pages.error`）、新增 `app/sign-in-error/`（server 外殼加 client 內容）、新增 `lib/auth/signInError.ts`、`lib/pageOrder.ts`（路由分類）、`scripts/integration-guard.mjs`（豁免名單加一條並寫明理由）、新增測試。
- **改動：** 新頁「未登入到」：按錯誤代碼分三種說法（取消／服務出錯／其他），代碼本身不顯示；一律說明「唔使登入都用得，照樣可以做題，練習紀錄留喺呢部機；登入淨係為咗跨機同步進度」（沿用 claims-guard 建議的真話）；主按鈕「返去練習」，取消及其他情況另有「再試一次登入」，服務出錯時改為「遲啲再試」並連去信任中心。`noindex`，不入 sitemap。
- **測試：** 新增 `lib/__tests__/sign-in-error.test.mts`（5 項）：Auth.js 指向新頁；代碼分類，未知或惡意值一律歸入一般說法；頁面有「唔使登入都用得」及返回練習連結，只分類不顯示原始代碼；`noindex`、已分類、不入 sitemap；接線閘豁免有理由。
- **驗證：** `npm test` 1157/1157（加最後一項前）；`qa` rc=0（第一次失敗：接線閘指新路由沒有站內連結，按規定加入豁免名單並寫明是 Auth.js 重新導向入口）；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** `?error=AccessDenied`、`?error=Configuration`、`?error=<b>x</b>` 三種都顯示正確說法；HTML 內沒有回顯 `<b>`；兩個按鈕高 48px；`<meta name="robots">` 為 `noindex, nofollow`。
- **未能驗證：** 真實的 Google 登入失敗重新導向。Claude 不可以輸入登入憑證，所以只驗證了設定及頁面本身；Better Auth 後備（`NEXT_PUBLIC_AUTH_BACKEND=better-auth`，預設不啟用）的錯誤流程未改。
- **下一輪：** P1 F–J 已全部有處理或有記錄的原因。檢查循環停止條件，並處理之前記下的已知問題（回訪學生首頁連結被角落掣遮住、1024×768「下一題」與情緒支援掣重疊）。
- **Commit：** 見 git log（`feat(auth): a sign-in error page that leads back to practice`）。

## LOOP 15 — 2026-09-30

- **Slice：** 角落掣（無障礙、情緒支援）遮住可撳內容的兩處（P0-5 收尾）。
- **優先級：** P0。
- **量度（改動前）：**
  - 回訪學生（有「繼續」卡）在 375×812 首頁：「揀其他科目」「睇吓點運作」在 y=701–745，在左下無障礙掣及右下情緒支援掣（y=692 起）之下。
  - 1024×768 練習頁：右欄「下一題」右端（x≈1002）落在情緒支援掣（x=954–1002）之下。
- **影響範圍：** `components/ContinueCard.tsx`（加 `data-continue-card`）、`app/page.tsx`（吉祥物外層加 `hero-mascot`）、`app/globals.css`（一條手機規則）、`docs/tokens.md`（生成檔）、`app/practice/PracticeSession.tsx`（一個 class）、新增測試及一個舊測試的定位字串。
- **改動：**
  - 手機闊度（<640px）而首屏有「繼續」卡時，收起吉祥物（用 `section:has([data-continue-card])`）。吉祥物的作用是讓初次來的人認得網站；初次訪客（沒有「繼續」卡）所見不變。
  - 練習頁在 1024–1279px 時，兩欄右邊多留 56px（`lg:max-xl:pr-14`）；1280px 起版面已置中，不需要。
- **測試：** 新增 `lib/__tests__/corner-buttons.test.mts`（2 項）；`practice-wide-layout.test.mts` 的定位字串跟着更新。
- **驗證：** `npm test` 1160/1160；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 375×812 回訪學生：吉祥物收起；「繼續第 4 題」y=182–226，四格 y=474–538，兩條連結 y=570–614；與角落掣沒有重疊。
  - 375×812 初次訪客（暫時移走本機進度紀錄，驗證後放回）：吉祥物照常顯示，沒有「繼續」卡。
  - 1024×768：「下一題」右端 x=946，情緒支援掣由 x=954 開始，不再重疊。代價：右欄窄了，「下一題」由 y=726 移到 y=762，要捲約 50px。
- **下一輪：** 檢查循環停止條件。
- **Commit：** 見 git log（`fix(layout): keep links and 下一題 clear of the corner buttons`）。

## LOOP 16 — 2026-09-30

- **Slice：** `/subjects` 最近練過的科目（P0-B 最後一項）。
- **優先級：** P0。
- **量度（改動前）：** 回訪學生要在 25 張卡中搜尋或捲動才找到自己的科目；首頁「繼續」卡只提供最後一科。
- **影響範圍：** `lib/quickStart.ts`（新增純函數 `recentSubjectIds`）、`app/subjects/SubjectsView.tsx`、新增測試、`subjects-quick-start.test.mts` 一個 import 格式比對放寬（仍要求從 `@/lib/quickStart` 取 `quickStartHref`）。
- **改動：**
  - 搜尋框上方一行「最近練過」，最多三科，最新的排前，每格 48px，直接開始一節（與其他快速開始同一 URL）。只讀本機現有練習紀錄（`dse_progress`），不新增任何儲存；掛載後才讀；初次訪客沒有這一行。不再上線的科目會略過。
  - 讀屏標題「最近練過：直接開始 10 題」保留為 `sr-only`，可見的「最近練過」與科目放同一行；手機介紹句改為 14px（桌面不變）。兩者都是為了不把第一張卡的「開始 10 題」推到左下無障礙掣之下。
- **測試：** 新增 `lib/__tests__/recent-subjects.test.mts`（4 項）：最新先、每科一次、最多三科；略過下線科目、無紀錄無此行；不改動輸入；頁面在 effect 內讀紀錄，每格連去一節、48px。
- **驗證：** `npm test` 1164/1164；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812，本機有三科紀錄）：** 中文：三格在同一行（y=284），第一張卡「開始 10 題」y=605–653，在無障礙掣（y=692）之上。英文：第一張卡較長，「開始 10 題」y=684–732，與無障礙掣重疊約 40px，捲一下即可。
- **需要創辦人決定：** 手機左下角無障礙掣及右下角情緒支援掣會蓋住每頁首屏底部的內容，本循環已在五處個別避開，但卡片內容一長就會再出現。徹底的做法是把手機的無障礙入口移入頂欄或底部導航（情緒支援掣是否同樣處理亦需決定）。這會改變 SEN 功能的入口位置，所以不自行改。
- **Commit：** 見 git log（`feat(subjects): show recently practised subjects first`）。

## LOOP 17 — 2026-09-30

- **Slice：** 答題流程所有控件至少 48px 高（P0-5「48px touch target」）。
- **優先級：** P0。
- **量度（改動前，375×812，答錯並揀錯因後掃描主區）：** 頂部返回、計時、休息吓、今日夠了 44px；「睇埋成個解析」「以後唔好收埋」44px；情緒標籤三個 44px；收藏 44px；「下一題想要」四個難度 27px；披露句內「呢個代表咩」13px、「呢條題有問題？話我哋知」18px。
- **影響範圍：** `app/practice/PracticeSession.tsx`、`app/practice/LongPracticeSession.tsx`、`components/PracticeSupport.tsx`、`components/StagedExplanation.tsx`、`components/BookmarkButton.tsx`、`components/EmotionTags.tsx`：`min-h-11` 改為 `min-h-12`（共 24 處），難度選擇改為 48px；新增測試。後三個組件亦用於其他頁，那些頁的控件同樣變為 48px。
- **不改：** 披露句內的兩條文字連結屬句內連結（WCAG 2.5.8 的例外），改成 48px 會拆散句子。
- **測試：** 新增 `lib/__tests__/practice-touch-targets.test.mts`（2 項）：六個檔案不再有 `min-h-11`；難度選擇為 48px。
- **驗證：** `npm test` 1166/1166；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 同一流程重新掃描，低於 48px 的只剩上述兩條句內連結；頂部按鈕 48px；無水平捲動。
- **Commit：** 見 git log（`fix(practice): 48px targets throughout the answer flow`）。

## 創辦人決定 — 2026-09-30（LOOP 17 暫停後）

Yuna 於 2026-09-30 在對話中回覆 LOOP 17 的暫停報告，逐項決定如下，並指示先寫入本檔再由 LOOP 18 繼續。每輪仍是一個小 slice、一個 commit，跑齊 test、qa、tsc、lint、build；不 push。

| # | 事項 | 決定 | 處理 |
|---|---|---|---|
| 1 | 手機左下角無障礙掣 | 選 A：移入頂欄或底部導航；右下角情緒支援掣保留原位 | LOOP 18 |
| 2 | 練習頁題目導航 | 選 A：只顯示第 1–10 題的狀態，不可跳題（維持只能向前作答） | 下一輪起 |
| 3 | 浮動「下一題」列 | 選 B：不做 | 不做；本檔記錄即可 |
| 4 | 逐題課綱年份及修訂日期 | 暫緩，等 2027 範圍核查（PHASE2_PAUSED）及考評局版權釐清 | 不做 |
| 5 | 首頁 DSE 倒數橫額 | 預設收起，改為學生自行開啟的「考期模式」 | 之後一輪 |
| 6 | 「2026 DSE 考生製作」字眼 | 改為與課程版本及覆核狀態相關、較準確的文案 | 之後一輪 |
| 7 | 守護者致謝名單 | 由首頁（頁尾）移到關於／信任頁 | 之後一輪 |

**執行上的界線：**

- 第 1 項只改手機闊度的入口位置，面板內容、設定鍵及同步不變；桌面維持現狀。沒有頂欄入口的頁面，左下角掣照舊顯示，不會令任何頁面失去無障礙入口。
- 第 2 項不改變作答次序、計分、計時或 60 秒鎖；狀態列不可撳。
- 第 5 項的開關只存本機，不加入雲端同步鍵（信任中心同步數目 14 不變）。
- 第 6 項的新文案只可寫已核實的事實（題目上線前經自動檢查、未經逐題人手覆核、沒有逐題課綱年份），不可聲稱與考評局文件對齊。

## LOOP 18 — 2026-09-30

- **Slice：** 手機的無障礙入口移到頁頂（創辦人決定 1）。
- **優先級：** P0（角落掣遮擋，LOOP 2、15、16 個別避開過的問題）。
- **影響範圍：** `components/A11yPanel.tsx`（新增頁頂按鈕 `A11yButton`、浮動掣加 `a11y-fab`、由遠處開啟時的焦點處理）、`components/Navbar.tsx`、`app/practice/PracticeSession.tsx`、`app/practice/LongPracticeSession.tsx`（放按鈕；長題目頁頂的題號改為不斷行）、`app/globals.css`（一條手機規則）、`docs/tokens.md`（生成檔）、新增測試。面板內容、設定鍵、同步及情緒支援掣不變。
- **改動：**
  - 手機闊度（<768px）在頁頂放無障礙按鈕：一般頁面在漢堡掣旁邊；選擇題練習在 sticky 的頂行最右；長題目練習在「今日夠了」旁邊。按鈕與浮動掣開同一個面板（同一個 event），48×48，`aria-haspopup="dialog"`。
  - 頁面有頁頂按鈕時，手機闊度收起左下角浮動掣（`body:has([data-a11y-trigger]) .a11y-fab`）。以「有沒有按鈕」判斷，不列路由：呼吸空間、紙筆戰士、答題紙等沒有頁頂的全屏頁，浮動掣照舊顯示。768px 起（平板、桌面）維持浮動掣。
  - 由頁頂按鈕或頁尾連結開啟時，焦點移到面板的「關閉」；按 Esc 或關閉後，焦點返回發起的按鈕。由浮動掣開啟的行為不變。
- **測試：** 新增 `lib/__tests__/a11y-header-entry.test.mts`（5 項）：按鈕與面板同一 event、只在手機顯示、48px；浮動掣只在有按鈕時收起、斷點 767px、沒有無條件收起的規則；三個頁頂都有按鈕，練習頁的在 sticky 行內；焦點移入及返回；情緒支援掣不受影響。變異測試：規則改為無條件收起、Navbar 拿走按鈕 → 2 項失敗。
- **驗證：** `npm test` 1171/1171；`qa` rc=0（第一次失敗：`docs/tokens.md` 要重新生成）；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 375×812 首頁：頁頂按鈕 x=263、y=8、48×48；浮動掣 `display:none`；情緒支援掣仍在 x=311、y=692；無水平捲動。撳按鈕後面板打開、焦點在「關閉」；按 Esc 後面板關閉、焦點返回按鈕。
  - 375×812 選擇題練習（公民與社會發展、錯因模式，最長的組合）：按鈕 x=311；中文頂行因科目名及錯因標籤各斷成兩行，由一行變高至 64px；英文 76px。一般模式不受影響。
  - 375×812 長題目練習：英文「1 of 3」原本被擠成兩行，已改為不斷行；中英文頂行都是 48px。
  - 375×812 呼吸空間：沒有頁頂按鈕，浮動掣照舊在左下（x=16、y=748）。
  - 767px 只有頁頂按鈕，768px 只有浮動掣：同一時間只有一個入口。
  - LOOP 16 記下的英文 `/subjects` 重疊已消失：第一張卡「Start 10 questions」x=37–207、y=684–732，左下再沒有浮動掣；情緒支援掣在 x=311 起，不重疊。
- **未改：** 沒有頁頂的全屏頁（呼吸空間、紙筆戰士、答題紙）仍用浮動掣；如要一併移走，需要先為這些頁加頁頂，屬另一個 slice。
- **下一輪：** 創辦人決定 2（第 1–10 題狀態列，不可跳題）。
- **Commit：** 見 git log（`feat(a11y): phone accessibility entry in the page header`）。

## LOOP 19 — 2026-09-30

- **Slice：** 練習頁第 1–10 題狀態列（創辦人決定 2：只顯示，不可跳題）。
- **優先級：** P1（練習流程）。
- **量度（改動前）：** 頁頂只有一條 6px 進度條；各題對錯只在頁底一行 12px 圓點顯示，沒有題號，只靠顏色分對錯，並在回饋及解析之下，答題時看不到。
- **影響範圍：** 新增 `lib/questionStatus.ts`、`components/QuestionStatusStrip.tsx`；`app/practice/PracticeSession.tsx`（進度條換成狀態列，移除頁底圓點）；測試：新增 `question-status.test.mts`，`practice-wide-layout.test.mts` 及 `answer-feedback.test.mts` 的定位改指狀態列（要求不變：答錯用金色、不用紅色）。
- **改動：** 頁頂一列十格，每格有題號；已答的分「答啱」（實線）及「發現盲點」（虛線、金色），現時一題實心，其餘「未做」。用 `<ol>`，現時一題 `aria-current="step"`，每格有讀屏文字（例如「第 2 題：發現盲點」）。沒有按鈕、連結或點擊處理；轉題仍只經「下一題」。
- **測試：** 5 項新測試。變異測試：加點擊處理、盲點改實線 → 2 項失敗。
- **驗證：** `npm test` 1176/1176（第一次 1 項失敗：舊測試鎖住已移除的圓點寫法，已改指狀態列）；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 狀態列 y=140、高 24、每格 31px；答五題後顯示「答啱、盲點、盲點、答啱、盲點、而家」；無水平捲動；舊圓點 0 個。測試作答紀錄已從瀏覽器清走。
- **Commit：** 見 git log（`feat(practice): status strip for questions 1–10, display only`）。

---

# 第二份 loop prompt：AUTONOMOUS PRODUCT REPAIR & HARDENING LOOP（2026-09-30）

Yuna 於 LOOP 19 途中貼上，要求按 P0 → P3 持續修復，不再詢問是否繼續。沿用：一輪一個 commit；不 push；§4 以該 prompt 作所列項目的批准；考評局文件不給 AI 讀取（2026-09-30 決定）；不代簽；雲端同步鍵及 Supabase 結構不在未有創辦人決定下改動。與憲章或既有決定衝突的項目，記錄於下文「未執行項目」，不停下。

## LOOP 20 — 2026-09-30

- **Slice：** 題數唯一來源，以及未判斷題目不再出題（新 prompt §2、§3，P0）。
- **量度（改動前）：**
  - 已編寫 27,326 條；練習池 26,510；已收起 597；倫理與宗教科兩個暫緩課題 220 條（其中 1 條同時已收起）。
  - 題數顯示在首頁及練習頁（26,510），收起數在透明度頁（597）。站內沒有任何地方說明兩者關係，讀者只能自行相加，得 27,107。prompt 所引首頁的 27,106 即 27,326 − 220，是較早版本的顯示；26,510 + 597 多出的 1，就是那條同時暫緩及收起的題目。
  - 位置詞檢查判斷不到的 13 條（C 類：`el_po_6_*` 12 條、`dath_me_1`）一直照常出題，等人手判斷。
- **影響範圍：** `data/questions/hidden-topics.ts`（新增 `PENDING_REVIEW`、`contentStatus`、`withoutWithheld` 改用它）、新增 `data/questions/pending-review.json`、`scripts/gen-question-summary.mts`（產生 `CONTENT_STATS`，四項相加不等於總數或 published 不等於練習池就不寫檔）、`summary.generated.ts` 及 `bank-versions.generated.ts`（重新產生）、`scripts/qbank/classify-posref.mts`（`--write` 時同時重寫 pending 清單）、`app/transparency/{page,TransparencyClient}.tsx`、`app/bookmarks/BookmarksView.tsx`、`public/llms.txt`（題數）、`docs/rationale-repairs.md` 及佇列檔的說明、測試。
- **改動：**
  - 每條已編寫題目只有一個狀態：`published`、`withdrawn`、`withheld_topic`、`pending_review`（次序：已知錯誤 > 暫緩課題 > 待判斷）。只有 `published` 會出題；兩條讀取路徑（`index.ts`；`load.ts` 的雲端及靜態）都經同一個 `withoutWithheld`。
  - 產生器輸出 `CONTENT_STATS = { totalAuthored 27,326, published 26,497, withdrawn 597, withheldTopic 219, pendingReview 13 }`；`TOTAL_QUESTIONS` 等於 `published`。
  - 透明度頁新增「題庫數字」四格及一句說明（四個數相加等於總數，網站其他題數即「練習中」）；數字由 server 傳入。C 類說明由「照常出題」改為「暫時唔出題」。
  - 收藏了待判斷題目的學生，看到「暫時收起，等人手睇」，而不是「已經唔喺題庫」。
- **與既有決定的關係：** Yuna 2026-09-29 第四次決定原本讓 C 類照常上線；新 prompt §3 要求未判斷內容不得進入練習池。以較新的指示為準。可逆：人手判斷寫入 `posref-review-decisions.json` 後重跑 `classify-posref.mts --write --apply`，清單會自動更新。
- **測試：** 新增 `lib/__tests__/content-stats.test.mts`（6 項）：四項相加；與真題庫重算一致；練習池沒有非 published 題目，兩條讀取路徑都過濾；pending 清單等於 C 類清單；透明度頁由 server 取數；收藏說明。舊測試的定位跟新寫法更新，要求不變：`family-difficulty`（不在練習池的覆寫題必須是非 published）、`hidden-topics`（收起與暫緩在同一個狀態函數）、`rationale-repairs`（透明度頁由 server 取數）、`claim-parity`（`llms.txt` 題數改為 26,497；英國文學 1,027、設計與科技 1,022）。
- **驗證：** `npm test` 1182/1182；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 透明度頁四格「26,497／597／219／13」，說明句總數 27,326，無水平捲動；首頁只出現 26,497 一個題數。
- **未做：** 雲端題庫鏡像不用重新推送：過濾在讀取時進行。已部署的正式網站要等下次部署才會用新數字。
- **Commit：** 見 git log（`fix(content): one status per question, one source for every count`）。

## LOOP 21 — 2026-09-30

- **Slice：** 「等級預測」改名，不再以成績預測的名義呈現（新 prompt §6，P0）。
- **量度（改動前）：** 側欄、`/predictor` 標題及 `<title>`、進度頁卡片、科目頁快速開始、首頁結尾 CTA 註腳、全站 meta description 都寫「等級預測／即時等級預測／Grade Predictor」。估算本身已經只出範圍、分開講三種不確定性，並在第三點講明「唔係一個預測」；問題在名稱承諾了更多。
- **影響範圍：** `lib/dictionary.ts`（中英各 6 處）、`app/layout.tsx`（meta description）、`app/predictor/page.tsx`、`app/dashboard/DashboardPageClient.tsx`、`components/FAQSection.tsx`、`app/transparency/TransparencyClient.tsx`、`app/methodology/MethodologyClient.tsx`、`app/practice/LongPracticeSession.tsx`、`components/MasteryEstimate.tsx`、新增測試。路由 `/predictor` 不變。
- **改動：**
  - 名稱：側欄「練習表現」；頁面「練習表現估算」；科目頁「練習表現估算（唔係成績預測）」；英文 Practice performance（estimate）。
  - 每個範圍（結果頁及 `/predictor` 共用 `MasteryEstimate`）下面直接一句：「呢個係按你喺本站練習計出嚟嘅學習指標，唔係考評局成績預測。」
  - meta description 由「改寫版歷屆試題 + 即時等級預測……涵蓋 25 個」改為「原創 DSE 練習題，選擇題即時批改，附練習表現估算……並非考評局官方網站」，同時去掉寫死的科目數。
- **刻意不改：** 頁尾及 `/about` 的免責聲明句「等級預測僅供參考，最終成績以 HKEAA 公布為準」是憲章 §13 逐字要求的，`footer-disclaimer.test.mts` 亦鎖住。建議創辦人把 §13 改為「練習表現估算僅供參考，並非 HKEAA 成績預測……」，改憲章後再同步頁尾。
- **測試：** 新增 `lib/__tests__/prediction-wording.test.mts`（3 項）：`app`、`components` 及字典內（去除註釋後）沒有把估算稱為成績預測的字眼，只容許 §13 句及其英譯、以及「不是成績預測」的否定句；新名稱在位；範圍下方 400 字元內有說明句。
- **驗證：** `npm test` 1185/1185；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，1280×800）：** `/predictor` 的 `<title>`「練習表現估算 | DSE Level Up」、h1「練習表現估算」、側欄「練習表現」，無水平捲動。測試瀏覽器的練習量不足以出範圍，範圍下的說明句由測試覆蓋。
- **Commit：** 見 git log（`fix(trust): call the practice estimate what it is, not a grade prediction`）。

## LOOP 22 — 2026-09-30

- **Slice：** 「2026 DSE 考生製作」及暗示題目取自歷屆試題的文案（創辦人決定 6；新 prompt §31、§38，P0）。
- **量度（改動前）：** 首頁信任標記「✓ 2026 DSE 考生製作」；頁尾「改寫版歷屆試題，掌握核心邏輯。／由 2026 DSE 考生製作。」；首頁「高效」卡「拆穿歷屆試題嘅底層邏輯」；SEO keywords 含「歷屆試題」。首頁沒有任何地方講題目的覆核狀態。
- **影響範圍：** `lib/dictionary.ts`（中英 tagline1、tagline2、trust1）、`app/page.tsx`（信任標記下一行、「高效」卡）、`app/layout.tsx`（keywords）、`components/Footer.tsx`（一行註釋）、新增測試。
- **改動：**
  - 信任標記：「✓ 課題初步對照 2027 年課程指引」（英文 first pass）。依據 `docs/topic-syllabus-map-2027.md`：298 個課題已對照教育局指引，但屬 AI 初步對照，未經學科負責人覆核，故寫「初步」。
  - 信任標記下一行：「題目經自動檢查上線，未經逐題人手覆核。點樣做」，連去 `/transparency`，連結 44px 高。
  - 頁尾：「原創 DSE 練習題，掌握核心邏輯。」＋「課題初步對照 2027 年文憑試課程指引；題目經自動檢查上線，未經逐題人手覆核。」
  - 「高效」卡改為「拆穿 DSE 常見題型嘅底層邏輯」；keywords 去掉「歷屆試題」「改寫試題」。
- **測試：** 新增 `lib/__tests__/trust-copy.test.mts`（3 項）。
- **驗證：** `npm test` 1188/1188；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 信任標記「✓ 課題初步對照 2027 年課程指引 | ✓ 全部功能免費 | ✓ 無廣告」；覆核句 y=748；「點樣做」36×44，與情緒支援掣（y=692–740）不重疊；頁尾兩句正確；無水平捲動。
- **需要留意：** `/writing` 有一句「取材自 2023 DSE 英文卷二『Poems & Songs』主題的原創練習題」，以及 `/prediction-method` 說等級分佈數字「由考評局 PDF 直接抽出」。兩者都涉及考評局出版物，按 2026-09-30 版權決定待法律釐清，下一輪寫入 `CONTENT_PROVENANCE.md`，本輪不改。
- **Commit：** 見 git log（`fix(trust): state curriculum and review status instead of who made the site`）。

## LOOP 23 — 2026-09-30

- **Slice：** 建立 `CONTENT_PROVENANCE.md`（新 prompt §31、§32，P0 法律／來源）。
- **量度（改動前）：** repo 沒有集中的來源紀錄。考評局衍生資料散落三處：`data/dse-2025-level-distribution.json`、`data/dse-level-drift.json`（2026-08-23 以腳本從考評局 PDF 抽數，`MasteryEstimate` 使用）、`data/dse-paper-formats.ts`（AI 協助核對評核大綱）。`/writing` 有「取材自 2023 DSE 英文卷二」的描述。repo 內沒有「試卷 → 模型 → 改寫」的出題流程；`data/raw-sources/math/` 只有兩份人手寫的技巧筆記。
- **影響範圍：** 新增 `CONTENT_PROVENANCE.md`（repo 根目錄）、新增測試。不改任何資料或功能。
- **內容：** 五節：練習題、課程指引對照、考評局衍生資料（逐檔寫用途、來源、取得方法、標記、法律狀態）、其他內容、不做的事；最後列三項待創辦人決定。開頭寫明不是法律意見、沒有取得任何授權；題數不另抄，指向 `CONTENT_STATS`。
- **刻意不改：** 三個考評局衍生資料檔及 `/writing` 描述維持原狀。按 2026-09-30 規則它們屬「待法律釐清」，是否保留、改由真人核實標記 `HUMAN_VERIFIED_FACT`，或移除功能，由創辦人決定。
- **測試：** 新增 `lib/__tests__/content-provenance.test.mts`（3 項）：`data/`（題庫以外）凡提及考評局的檔案都要列入；不得聲稱法律上沒有問題或已獲授權；題數不抄入文件。
- **驗證：** `npm test` 1191/1191；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。純文件及測試，無畫面改動。
- **Commit：** 見 git log（`docs(provenance): record where every kind of content comes from`）。

## LOOP 24 — 2026-09-30

- **Slice：** `/subjects` 不再寫「25 科已全部上線」（新 prompt §8，P0）。
- **量度（改動前）：** 介紹句「HKDSE 甲類科目（M1、M2 分開計），25 科已全部上線。全部科目嘅 MC 練習完全免費」。實情：25 科都有選擇題；書寫題每科 9 至 128 條（倫理與宗教 9 條，多科 13 條）；全站沒有聆聽、說話、實作、校本評核練習。
- **影響範圍：** `lib/dictionary.ts`（中英 `introLiveA`、`introB`，新增 `introWrittenA/B/C`）、`app/subjects/SubjectsView.tsx`、新增測試。
- **改動：** 介紹句改為「25 科都有選擇題練習；書寫題（對照參考答案自評）每科 9 至 128 條不等。本站未有聆聽、說話、實作同校本評核練習。全部免費，無限次做。」範圍由 `SUBJECT_SUMMARY` 即時計，文案本身不含數字。
- **未做（prompt §8 的逐科 coverage schema）：** 要逐科分「不適用」與「尚未涵蓋」，需要知道每科考卷有沒有聆聽、說話、實作等部分，即考評局評核大綱的資料。這些資料在 `data/dse-paper-formats.ts`，屬 2026-09-30 起不新增用途、待法律釐清的檔案（`CONTENT_PROVENANCE.md` §3）。所以本輪只寫本站有甚麼、沒有甚麼，不逐科判斷適用與否；待創辦人決定該檔的處理方法後再做。
- **測試：** 新增 `lib/__tests__/subject-coverage-copy.test.mts`（3 項）。
- **驗證：** `npm test` 1194/1194；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 介紹句 4 行（y=188、高 80）；第一張卡「開始 10 題」y=645–693，仍在首屏及底部導航之上；無水平捲動。
- **Commit：** 見 git log（`fix(subjects): say what is covered instead of "all live"`）。

## LOOP 25 — 2026-09-30

- **Slice：** 「錯題 DNA／錯因 DNA／錯題指紋」改名「錯誤模式」，並講明是學生自選錯因的統計（新 prompt §12、§13，P1）。
- **量度（改動前）：** 側欄「錯題 DNA」；進度頁「你嘅錯題指紋」「🧬 錯題 DNA 雷達」；FAQ「錯因 DNA 係乜嚟」。資料來源只是學生答錯後自己揀的三個錯因，頁面沒有講這是自我判斷。
- **影響範圍：** `lib/dictionary.ts`、`components/ErrorDNA.tsx`、`components/ErrorRadar.tsx`、`components/FAQSection.tsx`、新增測試。組件名、`#error-dna` 錨點及 `dse_reverse_log` 不變。
- **改動：** 名稱改為「錯誤模式／Error patterns」；卡片說明「按你每次答錯之後自己揀嘅錯因統計。呢個係你自己嘅判斷，唔係網站幫你診斷。」；雷達說明「你自己揀嘅錯因分佈」；FAQ 同步。
- **未執行（與創辦人決定衝突）：**
  - prompt §12 把錯因由三個改為六個（加「方法揀錯」「粗心」「我唔確定」等）。
  - prompt §14 答錯後可以「我唔確定」或「直接睇解析」。
  - 兩項都會改變憲章 §7.2 的實驗：Yuna 2026-09-09 起剷走 30 秒鎖、保留三維自診，為期兩個月，2026-11-09 按逐週正確率覆檢。憲章明寫只剷凍結、不動自診，「個變數先至乾淨」。實驗期間加略過或改分類，覆檢就分不清正確率變化的原因。
  - 六分類亦會改變已上雲的 `dse_reverse_log` 內容（§16.E）。
  - 建議 2026-11-09 覆檢時一併決定。
- **測試：** 新增 `lib/__tests__/error-pattern-naming.test.mts`（2 項）。
- **驗證：** `npm test` 1196/1196；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，1280×800，`/dashboard`）：** 全頁沒有「DNA」「指紋」；兩個標題「你嘅錯誤模式」「錯誤模式（最近 30 日）」；說明句在；側欄連結「錯誤模式」；無水平捲動。
- **Commit：** 見 git log（`fix(copy): error patterns, not Error DNA`）。

## LOOP 26 — 2026-09-30

- **Slice：** 首頁倒數預設收起，改為學生自行開啟的「考期模式」（創辦人決定 5）。
- **量度（改動前）：** 每個訪客打開首頁，頂部先見「距 190 日 · 2027 DSE 開考」及一句提示；沒有關閉方法。
- **影響範圍：** 新增 `lib/examCountdown.ts`、`components/ExamCountdownToggle.tsx`；`components/CountdownBanner.tsx`（關閉時不顯示，聽開關事件）；`app/account/AccountPageClient.tsx`（放在休息日之後）；`components/StoredDataInspector.tsx`（新鍵的說明）；新增測試。
- **改動：** 新本機鍵 `dse_exam_countdown`（'1' 為開），預設不存在即關。帳戶頁「考期模式」一個 48px 按鈕（`aria-pressed`），說明日期在考評局公布時間表之前是估算。不上雲；不在 `lib/sync.ts`、`lib/settingsSync.ts` 或信任中心的同步鍵內，同步數目仍是 14。
- **測試：** 新增 `lib/__tests__/exam-countdown.test.mts`（5 項）：預設關、開關往返、儲存被封鎖時當關、橫額關閉時不渲染、開關在帳戶頁且列入本機資料、不是雲端鍵。
- **驗證：** `npm test` 1201/1201；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 首頁沒有倒數；帳戶頁撳「開啟倒數」（48px）後變「倒數已開」、`aria-pressed=true`；返首頁顯示「距 190 日 · 2027 DSE 開考」。驗證後已刪除測試用的設定。
- **Commit：** 見 git log（`feat(home): exam countdown only when the student turns it on`）。

## LOOP 27 — 2026-09-30

- **Slice：** 守護者致謝名單由頁尾移到 `/about`（創辦人決定 7）。
- **量度（改動前）：** 名單在頁尾，每一頁（包括首頁）都出現。
- **影響範圍：** `components/Footer.tsx`（移除）、`app/about/AboutClient.tsx`（加入）、`components/GuardianCredits.tsx`（標題由 h3 改為 h2，加 id）、新增測試。
- **改動：** 名單放在關於頁「聯絡我們」之後，外層 `<section id="guardians">`，標題 h2，與該頁其他段落同一層級；名單內「致謝，不是認證」的說明不變。選 `/about` 而不是 `/trust`：組件本身提醒這類名單容易被讀成資安審計或品質認證，放在信任中心會加重這個誤讀。
- **測試：** 新增 `lib/__tests__/guardians-on-about.test.mts`（2 項）。
- **驗證：** `npm test` 1203/1203；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** 首頁全文沒有「守護者」；`/about` 有 `#guardians`，h2「🛡️ 守護者致謝名單」排在「聯絡我們」之後；無水平捲動。
- **已知：** 手機頁尾仍高 875px（三欄連結直排加免責聲明），可在之後的 P2 輪收窄。
- **Commit：** 見 git log（`feat(about): move the guardians list from the footer to /about`）。

## LOOP 28 — 2026-09-30

- **Slice：** API 請求大小上限，及 `/api/progress` 在 server 端只存白名單 key（新 prompt §30，P0 安全／資料完整）。
- **量度（改動前）：**
  - 六條讀 JSON 的 API 都直接 `request.json()`，沒有大小上限；已登入的用戶可以上傳任意大小的進度，`/api/progress` 原樣寫入 `user_progress`。
  - 上雲白名單（憲章 §16.E）只由瀏覽器端遵守；改過的 client 可以把任何 key 寫入雲端。
  - 限流（`lib/rateLimit.ts`）只在單一 instance 內計數，檔頭已寫明這個限制，真正的分散式限流要在 Vercel Firewall 設定。本輪不改。
- **正式資料庫量度（2026-09-30，只讀大小，不讀內容）：** `user_progress` 214 行，最大 29,617 bytes，中位 1,094，p95 9,346；`user_settings` 189 行，最大 308 bytes。
- **影響範圍：** 新增 `lib/api/readJson.ts`、`lib/cloudKeys.ts`（上雲 key 清單由 `components/StoredDataInspector.tsx` 移出，原檔再匯出，import 不變）；六個 route（progress、sync/settings、admin、account/delete、push/subscribe、result/verify）；三個測試改讀新位置；新增測試。
- **改動：**
  - `readJsonLimited`：先看 `content-length`，讀取後再按實際 bytes 檢查。超過回 413，JSON 錯回 400（沿用各 route 原本的錯誤字串）。上限：進度 1 MB（約為現時最大一行的 35 倍），其餘 64 KB。
  - `/api/progress` 只保留 `CLOUD_PROGRESS_KEYS` 及 `updatedAt`、`syncedAt`，其他 key 丟棄。瀏覽器本來就只送這些 key，所以對現有用戶沒有影響。
  - 附帶修正：body 為 `null` 時，原本會拋錯回 500，現在回 400。
- **測試：** 新增 `lib/__tests__/api-body-limit.test.mts`（5 項）：上限內可讀；按 header、按實際大小、多位元組文字都會回 413；壞 JSON 回 400；上限高於實測最大行；`app/api` 所有 route 都沒有直接讀 body；進度 route 用同一份白名單；瀏覽器送出的 key 全部在白名單內。`privacy-page`、`no-interaction`、`exam-countdown` 三個測試改讀 `lib/cloudKeys.ts`，並加上「確實找到清單」的檢查，避免因找不到而空過。
- **驗證：** `npm test` 1208/1208；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **實測（production build，瀏覽器 fetch）：** `/api/result/verify` 70 KB → 413 `body too large`；壞 JSON → 400；正常大小照舊驗證；`/api/progress` 未登入 → 401。已登入路徑未能實測，因為 Claude 不可以登入。
- **Commit：** 見 git log（`fix(api): body size ceiling and a server-side allow-list for progress`）。

## LOOP 29 — 2026-09-30

- **Slice：** FAQ 講錯工具位置（新 prompt §28「無障礙控制要容易發現」；P1 準確性）。
- **量度（改動前）：** 關於頁 FAQ「SEN 同學有咩支援」寫「練習頁左下角係無障礙工具角……同埋今日夠了」，`content/community/faq.md` 亦寫閱讀尺是「練習頁左下角嘅開關」。LOOP 3 起「今日夠了」在題目頁頂；LOOP 18 起手機的無障礙入口在頁頂。
- **影響範圍：** `components/FAQSection.tsx`（中英）、`content/community/faq.md`、新增測試。
- **改動：** 改為「無障礙設定（閱讀尺、易讀字體、字級、行距、字距、一鍵舒適模式）喺手機頁頂嘅無障礙掣，平板同電腦喺左下角；今日夠了喺題目頁頂」。
- **測試：** 新增 `lib/__tests__/faq-tool-locations.test.mts`（1 項），同時核對文案所依據的兩個事實（Navbar 有頁頂按鈕、練習頁有「今日夠了」）。
- **驗證：** `npm test` 1209/1209；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。純文案，無版面改動。
- **Commit：** 見 git log（`fix(faq): say where the accessibility tools are now`）。

## LOOP 30 — 2026-09-30

- **Slice：** 報告題目問題加「課題分類錯」（新 prompt §34，P1）。
- **量度（改動前）：** 報告掣已有 7 類：答案、解析、題目歧義、排版、超綱／難度、懷疑抄官方試題、其他。prompt 要求的類別只缺「課題分類錯」。
- **影響範圍：** `components/ReportQuestionButton.tsx`（多一類）、新增測試。
- **不改：** prompt 要求「internal content issue schema」。報告目前經電郵或複製全文送出，網站不儲存；組件檔頭寫明這是刻意的（避免「有掣但寫入唔到」）。要改為入資料庫，須新增資料表，涉及私隱及 Supabase 結構，屬創辦人決定。
- **測試：** 新增 `lib/__tests__/report-categories.test.mts`（2 項）。
- **驗證：** `npm test` 1211/1211；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **Commit：** 見 git log（`feat(report): a category for questions filed under the wrong topic`）。

## LOOP 31 — 2026-09-30

- **Slice：** `/start`：頂欄「開始練習」對回訪學生直接去練習（新 prompt §11，P1）。
- **量度（改動前）：** 首頁已可一撳開始（LOOP 2）、回訪有「繼續」卡；但頂欄（桌面及手機選單）的「開始練習」一律去 `/subjects`，回訪學生仍要再揀科。
- **影響範圍：** `lib/quickStart.ts`（新增 `startHref`，沿用首頁「繼續」卡的 `pickContinueTarget`）、新增 `app/start/{page,StartRedirect}.tsx`、`components/Navbar.tsx`（兩個 CTA）、`lib/pageOrder.ts`（路由分類）、新增測試。
- **改動：** `/start` 只讀本機紀錄：有未做完、練習頁會提供續做的一節 → 回到那一節；否則最近一科開新一節；沒有紀錄 → `/subjects`。用 `router.replace`，按返回不會停在中轉頁；轉頁失敗時頁面有「揀科目」連結。`noindex`。
- **測試：** 新增 `lib/__tests__/start-route.test.mts`（4 項）：初次訪客、最近一科（略過下線科目）、續做（含課題；未答或已完成不續做；下線科目不提供）、頁面及頂欄接線。
- **驗證：** `npm test` 1215/1215；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，1280×800）：** 測試瀏覽器有紀錄時 `/start` → `/practice?subject=economics`；暫時移走紀錄後 `/start` → `/subjects`（驗證後已放回）；首頁頂欄「開始練習」`href="/start"`。
- **Commit：** 見 git log（`feat(nav): 開始練習 resumes or starts practice for returning students`）。

## LOOP 32 — 2026-09-30

- **Slice：** 科目頁回答「下一步做咩」，逐課題顯示答對率連證據量（新 prompt §9、§41，P1）。
- **量度（改動前）：** 科目頁只列題數、課題及題數；回訪學生看不到自己上次做到哪裏、哪個課題最弱，要自己去進度頁找。
- **影響範圍：** 新增 `lib/topicEvidence.ts`（純函數）、`components/SubjectProgressPanel.tsx`；`app/subjects/[subject]/SubjectDetailView.tsx`（放卡片、課題卡加一行）；新增測試。只讀本機已有的 `dse_progress`、`dse_topic_stats`，不寫入、不上傳。
- **改動：**
  - 科目頁頂「你喺呢科」：上次練習日期及分數；建議下一步，並附「做 10 題『X』· 約 15 分鐘」（48px）。建議的課題按以下次序選：有至少 5 題紀錄、未達「穩定」、答對率最低的課題；沒有的話選第一個未做過、有選擇題的課題；兩者都沒有就不建議。卡底註明「只按你喺呢部機嘅練習計。做得少嘅課題，只當參考。」沒有紀錄的學生不會見到這張卡。
  - 每張課題卡加一行：不足 5 題寫「做過 N 題，未夠判斷」；5 題以上寫「答對 62% · 一般 · 13 題（證據少）」。評語只有「要加強／一般／穩定」，永不寫「已掌握」；不足 15 題加「證據少」。
- **測試：** 新增 `lib/__tests__/topic-evidence.test.mts`（5 項）：不足 5 題無評語；評語門檻及「證據少」；壞紀錄不出不可能的數字；沒有「掌握」字眼；下一步的選擇次序（證據不足不選、純書寫課題不選）；頁面接線及 hook 在提早 return 之前。
- **驗證：** `npm test` 1220/1220；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812，`/subjects/math`，測試瀏覽器有少量紀錄）：** 卡片顯示「上次練習：9月30日，4 / 10」「建議下一步：『概率』，你喺呢度仲未做過」，按鈕 48px 連去 `?topic=probability`；做過的課題顯示「做過 1 題，未夠判斷」；「綜合練習」仍在首屏；無水平捲動。
- **未做：** prompt §15–§18 的 adaptive loop（同構題 → 轉移題）、learner model、每題的 variant taxonomy。題庫沒有「同一技能」及「變體類型」欄位；要做須為 26,000 題加標記，屬題庫結構改動（憲章 §6 先查影響）。本輪的建議只用現有的課題統計。
- **Commit：** 見 git log（`feat(subject): what to do next, with the evidence behind it`）。

## LOOP 33 — 2026-09-30

- **Slice：** 書寫題的自我檢查清單，並講明本站不評分（新 prompt §26；憲章 §16.A）。
- **量度（改動前）：** 長題目提交後只有一個三級自評「完全掌握／部分明白／仲未掌握」，沒有告訴學生應該對照甚麼；「完全掌握」是學生對自己掌握程度的宣稱，其實只是和參考答案比較。
- **影響範圍：** `components/LongQuestionCard.tsx`（清單、標籤）、`app/answer-sheet/AnswerSheetClient.tsx`（同一組標籤）、新增測試。
- **改動：**
  - 提交後、自評之前多一個「自己對一對」：先寫「本站唔會幫你評分。對住參考答案同評分準則，剔低你嘅答案做到嘅項目。呢度唔會儲存。」，再列四項（內容完整、概念正確、論點有證據、結構清晰），每項 44px。剔選只保存在頁面狀態，不存、不送、不計分，也不影響下面的自評。
  - 自評三級改為「大致對到／對到部分／未對到」，問題改為「整體嚟講，你嘅答案同參考答案有幾接近？」。資料值（full／partial／none）不變，課題統計不受影響。
- **測試：** 新增 `lib/__tests__/written-self-check.test.mts`（3 項）。
- **驗證：** `npm test` 1223/1223；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812，歷史科長題目）：** 提交後見到清單及說明句；四項各 44px；剔選可用；自評三級顯示新標籤；localStorage 沒有新增清單相關的鍵；無水平捲動。測試時輸入的「test」沒有寫入 localStorage。
- **Commit：** 見 git log（`feat(written): a four-point self-check, and say the site does not mark`）。

## LOOP 34 — 2026-09-30

- **Slice：** 頁底「上一頁／下一頁」改為按學生意圖的「下一步」（新 prompt §23，P1）。
- **量度（改動前）：** 首頁、科目、進度、收藏、筆記、帳戶六頁底部是「上一頁：首頁｜下一頁：我的進度」這類按頁面樹排的連結。
- **影響範圍：** `lib/pageOrder.ts`（新增 `INTENT_LINKS`、`intentLinks()`，刪去已無用的 `neighbours()`）、`components/PageNav.tsx`（重寫）、`lib/dictionary.ts`（刪去已無用的 `pageNav` 字串）、新增測試。`PAGE_ORDER` 及 `scripts/guard-nav.mjs` 的分類規則不變。
- **改動：** 每頁兩個 48px 按鈕：第一個（實心）去 `/start`，文字按頁面寫「繼續練習」或「再做 10 題」；第二個（框線）是該頁之後最常做的事：首頁「揀其他科目」、科目「查看錯題」、進度「查看錯題」、收藏「睇進度」、筆記「揀科目」、帳戶「睇進度」。`nav` 的名稱改為「下一步」。
- **測試：** 新增 `lib/__tests__/intent-nav.test.mts`（2 項）：六頁各有兩個連結、第一個是練習、第二個不指向自己、目的地 route 存在；全屏及資訊頁沒有這一行；組件不再用前後頁。
- **驗證：** `npm test` 1225/1225；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812，`/dashboard`）：** 底部「再做 10 題」（`/start`）及「查看錯題」（`/bookmarks`），各 48px；舊的「頁面導航」已不存在；無水平捲動。
- **Commit：** 見 git log（`feat(nav): next-step links instead of previous and next page`）。

## LOOP 35 — 2026-09-30

- **Slice：** SENSEI 頁以「知識卡」為主名，並提供保證找得到卡的起手問題（新 prompt §24、§25，P1）。
- **量度（改動前）：** `/sensei` 標題只寫「SENSEI」，學生要讀完說明才知道是查卡，不是會自行作答的聊天機械人；沒有起手問題，隨便問容易撞到「沒有卡片」。
- **影響範圍：** 新增 `lib/sensei/starters.ts`；`app/sensei/SenseiClient.tsx`（標題、說明、起手問題、把提問邏輯抽成 `run()`）；`app/sensei/page.tsx`（`<title>`）；新增測試。檢索邏輯、身份問題處理、AI 標示（憲章 §16.B）不變。
- **改動：**
  - h1 改為「知識卡」，下面細字「SENSEI」。
  - 說明改為「答案只來自本站已由具名真人審核的知識卡……不會自行寫新答案」。
  - 中文三條、英文兩條起手問題（44px），撳下即問。每條都指定應找到的卡，測試用真卡片核對該卡排第一。英文只放英文卡找得到的問題，因為知識卡大多只有中文關鍵字。
- **測試：** 新增 `lib/__tests__/sensei-starters.test.mts`（2 項）。
- **驗證：** `npm test` 1227/1227；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** AI 標示仍在最上；h1「知識卡」；三條起手問題各 44px；撳第一條後顯示判別式的卡；無水平捲動。
- **Commit：** 見 git log（`feat(sensei): call it knowledge cards and offer questions that find one`）。

## LOOP 36 — 2026-09-30

- **Slice：** 「紙筆戰士」改為次要名稱，主名稱用「列印練習卷」（新 prompt §24，P1）。
- **量度（改動前）：** 頁尾、科目列表、對答案頁都用「紙筆戰士」作連結文字，學生要點入去才知道是列印練習卷；頁面 `<title>`「模擬卷練習」及描述「計時模擬卷」又是另一個名稱，而一份只有 10 題，不是完整模擬卷。
- **影響範圍：** `lib/dictionary.ts`（`nav.paper`）、`app/paper-warrior/{PaperWarriorClient,page}.tsx`、`app/subjects/SubjectsView.tsx`、`app/answer-sheet/{AnswerSheetClient,page}.tsx`、新增測試。路由 `/paper-warrior` 不變；已印出的試卷上的 QR 連結不受影響。
- **改動：** 連結及 h1 用「列印練習卷／Printable practice set」；h1 下面細字「紙筆戰士」；科目列表連結「列印練習卷（A4，用紙筆做）」；`<title>` 及描述統一為列印練習卷，不再稱「計時模擬卷」。
- **測試：** 新增 `lib/__tests__/plain-vocabulary.test.mts`（2 項）。
- **驗證：** `npm test` 1229/1229；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812）：** `/paper-warrior` h1「列印練習卷」、副題「紙筆戰士」；科目列表及頁尾連結為新名稱；無水平捲動。
- **Commit：** 見 git log（`fix(copy): call the printable set what it is`）。

## LOOP 37 — 2026-09-30

- **Slice：** 練習以外各頁的觸控目標至少 44px（新 prompt §21、§22，P1）。
- **量度（改動前，360×800，production build，逐頁掃描主區及導航）：**
  - 八頁都沒有水平捲動：首頁、科目、`/subjects/math`、練習、進度、帳戶、收藏、知識卡。
  - 低於 44px 的控件：頁尾全部連結 17px；麵包屑 20px；科目篩選 30px；搜尋及排序 42px；首頁「逐項查得到」16px、「睇晒全部科路線圖」20px、示範卡「立即練習」38px；進度頁「繼續練習」40px、「綁定 Google 帳戶」36px、「清除進度紀錄」16px；帳戶頁兩個清除掣 42px、「取消」字掣；科目列表「告訴我哋你想要嘅課題」38px。
  - 練習頁及收藏頁沒有低於 44px 的控件。
- **影響範圍：** `components/Footer.tsx`、`components/SyncStatus.tsx`、`components/BlindTestQuestion.tsx`（一句文案）、`app/page.tsx`、`app/subjects/SubjectsView.tsx`、`app/subjects/[subject]/SubjectDetailView.tsx`、`app/dashboard/DashboardPageClient.tsx`、`app/account/AccountPageClient.tsx`、新增測試。
- **改動：**
  - 以上控件全部加 `min-h-11`（44px），文字連結改為 `inline-flex items-center`。
  - 頁尾兩欄連結在手機改為兩欄排列，所以頁尾反而矮了（875 → 795px）。
  - 首頁示範卡的「答錯？先診斷你嘅錯因 · Reverse Error Diagnosis」改為「答錯？先揀你嘅錯因」（§24 用詞）。
- **不改：** 首頁示範題中被遮住的數字（撳一下顯示）是句內文字，高 20px，改成 44px 會拆散句子行距；屬 WCAG 2.5.8 的句內例外。
- **測試：** 新增 `lib/__tests__/content-touch-targets.test.mts`（3 項）。
- **驗證：** `npm test` 1232/1232；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 360×800 重掃：首頁只剩示範題的四個遮字；科目頁沒有低於 44px 的控件；第一張卡「開始 10 題」y=661。
  - 手機橫放 812×375 練習頁：無水平捲動；sticky 頂行 64px；選項各 56px，要捲動才見；812px 屬平板闊度，所以用左下角浮動掣。
- **已知：** 橫放時左下、右下兩個浮動掣會在捲動中蓋住選項兩端約 48px；選項中間仍可撳。
- **Commit：** 見 git log（`fix(a11y): 44px targets across the content pages`）。

## LOOP 38 — 2026-09-30

- **Slice：** 首頁不再需要 KaTeX（新 prompt §36，P2 效能）。
- **量度（改動前，production build，375×812，瀏覽器實測）：**
  - 首頁載入 31 個 JS、共 1,348 KB（未壓縮）。最大四個是 KaTeX 256 KB、Next 235 KB、react-dom 196 KB、頁面 95 KB。KaTeX 只用於示範區六條固定算式。
  - 另一個 67 KB chunk 含 Supabase URL 及 anon key，但沒有 `supabase-js`，只以 `fetch` 讀 PostgREST，符合憲章 §3.1 約束 6。
  - 練習頁沒有載入整個題庫，只有單科。
- **影響範圍：** `app/page.tsx`（移除 `MathText`，六條算式改為純文字小組件）、新增測試。
- **改動：** 示範算式寫成「2x² + 3x − 5 = 0」「x = −5/2」等純文字（襯線斜體），讀屏軟件會把上標讀作 squared。
- **結果：** 首頁初始 HTML 的 19 個 script 不再包括 KaTeX。瀏覽器仍會在頁面載入後預先抓取 KaTeX（`startTime` 89ms，屬首頁上練習頁連結的預取），不阻塞首屏；首頁本身不再依賴它。
- **測試：** 新增 `lib/__tests__/home-no-katex.test.mts`（2 項）：首頁及其直接用到的組件都不 import `MathText` 或 `katex`。
- **驗證：** `npm test` 1234/1234；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **Commit：** 見 git log（`perf(home): plain-text demo formulas, KaTeX off the first load`）。

## LOOP 39 — 2026-09-30

- **Slice：** 平板（768–1023px）有常駐側欄（新 prompt §20，P1）。
- **量度（改動前）：** 手機底部導航在 768px 起收起（`md:hidden`），側欄要 1024px 起才出（`lg:flex`）。平板闊度兩者都沒有，只有頂部漢堡選單，每次轉頁都要先開選單。
- **影響範圍：** `components/Sidebar.tsx`、`components/AppShell.tsx`、`components/Footer.tsx`、`components/Navbar.tsx`（各一個斷點 lg → md）、`app/globals.css`（`--sidebar-w` 的斷點 64rem → 48rem）、`docs/tokens.md`（生成檔）、新增測試。1280px 起的完整側欄及 1024px 起的頂欄內容不變。
- **改動：** 768px 起顯示側欄的 80px 圖示列，內容、頂欄、頁尾同時讓位，左下浮動掣隨變數移到圖示列右邊。
- **測試：** 新增 `lib/__tests__/tablet-rail.test.mts`（1 項）：側欄、三個讓位、CSS 變數都在 md 生效，與底部導航的 `md:hidden` 同一斷點。
- **驗證：** `npm test` 1235/1235；`qa` rc=0（第一次失敗：`docs/tokens.md` 要重新生成）；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，`/subjects`）：**
  - 768×1024：圖示列 80px（8 個連結），內容左邊讓 80px，左下浮動掣 x=96，底部導航不顯示，無水平捲動。
  - 767px：圖示列不顯示，底部導航顯示，內容不讓位。
  - 任何闊度都只有一種常駐導航。
- **Commit：** 見 git log（`feat(layout): the side bar's icon rail on tablets`）。

## LOOP 40 — 2026-09-30

- **Slice：** 1440px 起練習頁三欄：背景、題目、回饋（新 prompt §19，P1）。
- **量度（改動前，1440×900）：** 兩欄（題目 564px、回饋 564px）置中，左右各約 144px 空白；做題時看不到自己本科哪個課題最弱，要離開練習去進度頁。
- **影響範圍：** 新增 `components/PracticeContextRail.tsx`；`lib/topicEvidence.ts`（新增 `weakestInSubject`）；`app/practice/PracticeSession.tsx`（容器及 grid 各加一個 1440px class，左欄放第一格）；`app/globals.css`（新增具名斷點 `--breakpoint-desk: 90rem`）；`docs/tokens.md`（生成檔）；測試：新增一個，`practice-wide-layout.test.mts` 的定位字串及「只用 lg 前綴」的檢查改為容許 `desk:`（1024px 以下不變的要求不變）。
- **改動：** 1440px 起容器 1296px，grid 為 220px｜題目｜回饋。左欄 sticky，內容：「呢一題」的課題名；「本科最需要練」三個課題，每個附答對率、評語及題數，規則與科目頁相同（至少 5 題、未達穩定、按答對率排）；沒有足夠題數時寫「暫時講唔到」。左欄只顯示，不放連結，避免做題途中離開。課題名取自本機 `dse_topic_stats`，不把全科課題表載入練習頁。1439px 以下左欄 `display:none`，版面與之前相同。
- **過程中的錯誤：** 第一次用 `min-[1440px]:grid-cols-[…]`，實測左欄闊 564px、題目被擠到第二欄。原因是 Tailwind v4 把任意值斷點 `min-[…]` 的規則排在 `lg:` 之前，同一元素上的 `lg:grid-cols-2` 蓋過了它。改用 `@theme` 具名斷點 `desk`（排在 xl 之後）後正常，測試亦鎖住要用具名斷點。
- **測試：** 新增 `lib/__tests__/practice-context-rail.test.mts`（3 項）。
- **驗證：** `npm test` 1238/1238；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build）：**
  - 1440×900：左欄 x=72–292（220px）、題目 316–830、回饋 854–1368；右欄右邊在情緒支援掣（x=1376 起）之前；無水平捲動。
  - 1439px：左欄不顯示，題目 x=144、闊 564，與改動前相同。
- **Commit：** 見 git log（`feat(practice): a context column on wide screens`）。

## LOOP 41 — 2026-09-30

- **Slice：** 刪去虛構的「掌握度 +1」（新 prompt §41；憲章 §8 不虛構數據）。
- **量度（改動前）：** 進度頁「今日學習光譜」做齊 3:5:2 時顯示「✨ 今日光譜完成，掌握度 +1」。網站沒有任何會因此加一的掌握度數值。其餘掌握度顯示已核對：課題圓環在少於 4 題時已標明樣本少；科目頁（LOOP 32）及練習頁左欄（LOOP 40）都附題數；全站沒有「已掌握」字眼。
- **影響範圍：** `components/DailySpectrum.tsx`（一句）、新增測試。
- **改動：** 改為「✨ 今日光譜完成」。
- **測試：** 新增 `lib/__tests__/no-fake-mastery.test.mts`（2 項）。
- **驗證：** `npm test` 1240/1240；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。純文案。
- **Commit：** 見 git log（`fix(copy): no invented mastery +1`）。

## LOOP 42 — 2026-09-30

- **Slice：** 結果頁不再講「你嘅真實水平」，加上「唔係考評局成績預測」及 h1（新 prompt §6、§28；P0）。
- **量度：**
  - 標題結構審核（production build，桌面，伺服器 HTML 加上渲染後的 DOM）：首頁、科目、科目詳情、進度、收藏、帳戶、練習表現、透明度、關於、知識卡、列印練習卷、筆記、信任中心、私隱，每頁剛好一個 h1，沒有跳級，都有 `<main>`。只有 `/result` 沒有 h1，讀屏用戶以標題導航時由 h2 開始。
  - 結果頁範圍句寫「以呢 10 題計。考慮到樣本大小，你嘅真實水平大概喺 Level 3 至 4 之間」。十題改寫題不能推斷一個人的真實水平；範圍框亦沒有直接說明這不是考評局成績預測。
- **影響範圍：** `lib/dictionary.ts`（中英 `rangeSingle`、`rangeSpan`、`cutoffOrigin`）、`app/result/ResultPageClient.tsx`（h1）、新增測試。
- **改動：**
  - 範圍句改為「你今次嘅練習表現大約對應 Level X（至 Y）」。
  - 範圍框說明句開頭加「呢個係本站練習數據嘅學習指標，唔係考評局成績預測。」
  - 分數卡頂加 h1「練習結果」。
- **測試：** 新增 `lib/__tests__/result-wording.test.mts`（3 項）。
- **驗證：** `npm test` 1243/1243；`qa` rc=0；`tsc` rc=0；`lint` 0 error；`build` rc=0。
- **畫面（production build，375×812，`/result`，測試瀏覽器最近一節）：** h1「練習結果」；範圍句「以呢 10 題計，考慮到樣本細，你今次嘅練習表現大約對應 Level 1 至 4」；有「唔係考評局成績預測」；全頁沒有「真實水平」；無水平捲動。
- **未改（需創辦人決定）：** 結果頁仍以 DSE 等級名（5**、5*…）顯示「今次表現等級」，並按等級顯示 🏆⭐ 等圖示。等級顯示是現有產品設計，附有誠實範圍及方法頁；要否改為不用 DSE 等級名，屬產品方向。
- **Commit：** 見 git log（`fix(result): this session's practice, not your true level`）。

## 第二份 loop prompt：未執行項目及原因（LOOP 42 之後）

| prompt 條文 | 內容 | 未做的原因 | 需要的決定或工作 |
|---|---|---|---|
| §12、§14 | 錯因改六類、加「我唔確定」或「直接睇解析」 | 憲章 §7.2 反思鎖實驗（2026-09-09 至 2026-11-09）刻意只剷凍結、保留三維自診；中途加略過或改分類，覆檢就分不清正確率變化的原因。六分類亦會改變已上雲的 `dse_reverse_log`（§16.E） | 2026-11-09 覆檢時一併決定 |
| §15–§18 | 同構題 → 轉移題的 adaptive loop、learner model、variant taxonomy | 題庫沒有「技能」及「變體類型」欄位；要為約 26,000 題加標記，屬題庫結構改動（憲章 §6 先查影響） | 創辦人決定是否開這個題庫工程 |
| §4 Layer C–E | 每題的 curriculumTopic、skill、assessmentObjective、reviewStatus 等欄位 | 同上，需要逐題資料；Layer D 的評核目標屬考評局資料 | 同上；Layer D 另需考評局資料的法律路線 |
| §8 | 逐科分「不適用」與「尚未涵蓋」 | 需要各科考卷組成（考評局評核大綱），資料在 `data/dse-paper-formats.ts`，2026-09-30 起不新增用途 | `CONTENT_PROVENANCE.md` §6 第 1 項 |
| §27 | `assessmentConfig.v2027` | 同上；2027 範圍核查仍為 PHASE2_PAUSED | 同上 |
| §29 | 聚合漏斗統計（landing → 選科 → 第一題 → 完成 → 下一節） | 第一份 loop prompt 禁止新增 analytics；網站私隱頁承諾未登入不記錄；`user_sessions` 表前端從未寫入 | 創辦人決定是否收集、收甚麼、私隱頁如何改 |
| §34 | 題目問題入資料庫 | 目前經電郵或複製送出，刻意不存；要存須新表及私隱說明 | 創辦人決定 |
| §6 | 結果頁的 DSE 等級名（5**、5*…）及 🏆⭐ | 現有產品設計，已附誠實範圍、「唔係考評局成績預測」及方法頁 | 創辦人決定是否改為不用 DSE 等級名 |
| §6 | 頁尾及 `/about` 免責句「等級預測僅供參考」 | 憲章 §13 逐字要求 | 改憲章 §13 後同步頁尾 |
| §31 | 三個考評局衍生資料檔、`/writing` 的「取材自 2023 DSE 英文卷二」 | 2026-09-30 版權規則下待法律釐清 | `CONTENT_PROVENANCE.md` §6 |

**已確認毋須改動：** §37 題庫載入失敗有說明及「再試一次」；§35「答案唯一」已由 `structural.test.mts` 鎖住（四個相異選項、`correctIndex` 在範圍內、題號唯一）；§38 各頁 metadata 及結構化資料沒有官方或預測字眼；§39 結果頁已有分享卡（不含身份資料）；§40 答錯後第 1／3／7／14／30 日重溫，即 prompt 所講的「昨日錯、今日驗證」，不另建第二套。

---

# 改進循環 2（2026-09-30，第三份 loop prompt「AUTONOMOUS REFINEMENT LOOP 2」）

原則：不改 §7.2 實驗（`DEFERRED_EXPERIMENT_CHANGE`）；與既有決定衝突者標 `DECISION_CONFLICT`，不自行推翻。

## R2-1 結果頁不再顯示 DSE 等級（prompt §3–§5）

- 新增 `lib/practiceBand.ts`：`getPracticePerformanceBand(correct, total)` → 證據不足／需要鞏固／發展中／相對穩定；少於 `MIN_BAND_EVIDENCE`（= `MIN_EVIDENCE` = 5）題不分類。
- `/result`：刪去等級徽章（🏆⭐）、「今次表現等級」、等級區間、等級刻度、「距離下一級差幾分」、各難度層的「約 2–3／4／5 級」、`MasteryEstimate`；分享文字及教師報告不再附等級；教師報告刪去「歷屆試題」。
- `/prediction-method`：刪去 5**–1 分界線表及 Wilson 區間一節，改為說明「本節表現」四個字眼的規則。
- 刪除無人使用的 `lib/gradeConfidence.ts`（及其測試）與 `TIER_LEVEL_BANDS`。
- **取代的舊決定：** Yuna 2026-09-26「在結果頁顯示各難度層對應等級」。本 prompt §4 明文要求結果頁不再用 5**、5*、4、3 等標籤，屬明確授權。
- `STALE_CHARTER_COPY`：頁尾及 `/about` 的「等級預測僅供參考」為憲章 §13 逐字條文，本輪不改。
- `DECISION_CONFLICT`：`/predictor`（練習表現估算）仍以 Level 範圍顯示。Yuna 2026-09-29 決定改名保留；本 prompt 只明確授權結果頁。未改。
- 測試：`practice-band.test.mts`（新）；`tier-level-bands`、`result-wording`、`result-empty-state`、`result-next-steps`、`prediction-wording`、`trust-hardening` 改錨點（要求不變或更嚴）。

## R2-2 其他頁面的等級外洩（prompt §7）

- `/dashboard`：刪去各科「最佳 5**」標籤；最近練習的等級標籤改為本節表現字眼（`getPracticePerformanceBand`）。
- `/paper-warrior` 答題紙：「已存 … · 等級 X」刪去等級。`/writing`：自評平均分不再換算成「預估 5**／4／3」，改為中性字眼並註明不是 DSE 等級。
- `/api/result/verify` 不再回傳 `grade`（前端已不使用）。
- `/trust`、FAQ、頁尾連結「表現等級點計」改為描述現況。
- 保留：`dse_progress` 內的 `grade` 欄位（上雲 key，改結構需創辦人決定），只是不再顯示。
- 測試：`no-grade-leakage.test.mts`。瀏覽器實測：`/dashboard` 兩節顯示「需要鞏固」「相對穩定」、無 5**；`/writing` 三項 7 分顯示「自評相對穩定（不是 DSE 等級）」。

## R2-3 舊題數全 repo 核對（prompt §2、§46）

| 位置 | 判斷 | 處理 |
|---|---|---|
| `public/llms.txt`「we hold 27,106 original items」 | 過時對外文案 | 改為練習池數字；`claim-parity` 掃描加入「items」，並加反向自測（舊檔會 fail） |
| `app/page.tsx` 註釋「信任列顯示 27,106」 | 過時註釋 | 刪去數字 |
| `docs/PHASE1-scope-check-2026-09-30.md`（26,510） | 歷史文件 | 加「歷史紀錄」說明，指向 `CONTENT_STATS` |
| `docs/ux-loop-progress.md`、`DECISIONS-*`、`UNMAPPED-220.md` | 有日期的歷史紀錄 | 保留 |
| `trust-hardening.test.mts` 的 597 | 2026-09-29 批次大小（歷史），非現行統計 | 改名 `HISTORICAL_BATCH_2026_09_29` |
| `content-stats`、`count-sources` 測試內的舊數字 | 註釋或反向自測 fixture | 保留 |

`app/`、`components/`、`lib/` 無其他 hard-code 題數。

## R2-4 Adaptive Recommendation V1（prompt §8–§13、§40）

- 新增 `lib/recommendNext.ts`：`recommendNextPractice({subject, questionCounts, topicEvidence, recentErrors, recentSessions})` → `{subject, topic, reason, estimatedMinutes}`。零 migration，只讀本機已有的 `dse_topic_stats`、`dse_reverse_log`、`dse_progress` 及已發布題數。
  - 次序：①本科最近 10 次答錯（14 日內）集中在同一課題（≥2 次，且該課題已答 ≥5 題）；②已答 ≥5 題、未達「穩定」中答對率最低；③未試過的課題。
  - 只推薦有已發布選擇題的課題；剛以 80% 以上完成的課題（3 小時內）不即時再推。
  - 取代 `topicEvidence.nextStep()`（已移除，測試搬到 `recommend-next.test.mts`）。
- 科目頁「你喺呢科」改用此函數，原因句寫「最近較需要鞏固：…」，不說「最弱」。
- 同一門檻套用到 `DailyPlan`（原本答 1 題即列入）及 `gentleSuggestions`（原本 2 題）；結果頁「今次最弱」改「今次較需要鞏固」。
- 瀏覽器實測（production）：`/subjects/math` 顯示「建議下一步：「概率」。最近較需要鞏固：你喺呢科最近 3 次答錯，有 3 次喺呢個課題。」；按鈕 48px，點擊後到 `/practice?subject=math&topic=probability`。
- 未做（下一個 project）：skill graph、learner model、變體生成、mastery 更新。無資料庫改動。
