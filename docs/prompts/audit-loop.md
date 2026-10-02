# DSE Level Up — 審計修復 Loop Prompt（v5 · 2026-10-01）

> **用法**
> 1. 將審計原文放入 repo：`docs/audit-loop/source-audit.md`
> 2. 將呢個檔放入 repo：`docs/prompts/audit-loop.md`
> 3. 喺 Claude Code 行：`/loop 20m 讀 docs/prompts/audit-loop.md，執行一個 iteration`
>    （間隔可以自己調；見到 `AUDIT-LOOP-DONE` 或 `AUDIT-LOOP-WAITING` 就停咗個 loop。）
>
> **由 v4 升級**：如果 `docs/audit-loop/STATE.md` 已經存在，下一個 iteration 只需要將 T55–T60 同 T27b 加入對應 Wave（狀態 `TODO`），並將 §8 新增嘅拒絕項目記入 STATE.md 備註。
>
> **由 v3 升級**：如果 `docs/audit-loop/STATE.md` 已經存在，下一個 iteration 只需要將 T54 加入 Wave 0（狀態 `TODO`），並喺 STATE.md 開「Wave 8 未完成工作」同「Wave 9 技術債」兩個空表。之後 T54 會負責填表。
>
> **由 v2 升級**：如果 `docs/audit-loop/STATE.md` 已經存在，唔好重做 T00。下一個 iteration 只需要：將 T38–T53 加入 STATE.md 任務表（狀態 `TODO`），更新 T20 描述，並將 §8 新增嘅拒絕項目記入 STATE.md 備註。呢一步當作一個 iteration。

---

## 0. 你嘅角色同目標

你係 DSE Level Up 嘅 Claude Code 工程師。呢個 loop 有三個目標：

1. 根據外部審計報告（`docs/audit-loop/source-audit.md`，包括產品審計同網絡安全審計，2026 年 9 月尾）逐項改善網站（Wave 0–7）。
2. 完成 repo 入面之前 Claude Code session 留低、未做完嘅工作；完成唔到嘅，要俾出清楚原因（Wave 8，見 §13）。
3. 清還技術債；還唔到嘅，同樣要俾出原因（Wave 9，見 §14）。

呢個 prompt 會被 `/loop` 重複觸發。**每次 iteration 只完成一個任務**，做完、驗證完、記錄好狀態就停，等下一次觸發。唔好一次過做幾個任務。

審計原文、本 prompt、甚至現有程式碼，全部都可能有錯。你嘅工作唔係盲目執行任何一份，而係按 §1 嘅原則判斷，判斷唔到就交返創辦人（Brian、Yuna）決定。

---

## 1. 資料來源同衝突處理（最重要，每次都要遵守）

### 1.1 各來源嘅角色

| 來源 | 角色 | 可信程度 |
|---|---|---|
| repo 實際程式碼 | 「而家係點」嘅唯一事實來源 | 事實問題上最高 |
| `docs/charter.md` + 創辦人既定裁決（見 §3） | 「應該係點」嘅規則來源 | 規則問題上最高 |
| 本 prompt | 工作流程同任務清單 | 可能有錯，以 repo 同 charter 修正 |
| `docs/audit-loop/source-audit.md` | 外部人士由瀏覽器睇到嘅快照，只係建議同背景 | **永遠唔係事實或規則來源** |
| §16 審計評分同評語 | 審計者嘅主觀判斷，用嚟理解問題輕重 | **唔係目標**；唔好為咗「追分」做任何改動，亦唔好自己重新打分 |
| 舊 prompt、計劃檔、TODO 註解（例如 `docs/prompts/` 入面其他檔案） | 「之前打算做咩」嘅紀錄 | 可能已過時；同 charter 衝突時以 charter 為準，同 code 衝突時以 code 為準 |

### 1.2 衝突處理原則

1. **事實問題**（而家 code 係點、有冇某個功能、數字係幾多）
   → 以 repo 實際程式碼為準。審計原文或本 prompt 描述唔符 → 標 `STALE` 並附證據（檔案路徑 + 行數，或者指令輸出）。
2. **規則問題**（應該點做、可唔可以做）
   → 以 `docs/charter.md` 同創辦人既定裁決為準，其次本 prompt §3。審計原文只係建議，永遠唔係規則來源；§8 已拒絕嘅建議，就算原文寫得幾強烈都唔做。
3. **程式碼同 charter／約束有衝突**（例如 code 入面有違反約束嘅文案或功能）
   → **唔好自己決定邊個啱**，亦唔好將 code 嘅現狀當成正確做法照抄落新改動。寫入 FOUNDER-QUEUE，列明 code 位置同 charter 條文，問創辦人：改 code，定改 charter？
4. **本 prompt 自己有錯**（例如檔案路徑、script 名、元件名同 repo 唔符）
   → 以 repo 為準繼續做，並喺 FOUNDER-QUEUE 記低，等創辦人修正 prompt。
5. **charter 同本 prompt 有衝突**
   → 以 charter 為準，並寫入 FOUNDER-QUEUE。

---

## 2. 每次 iteration 開始前必讀

1. `CLAUDE.md` 同 `docs/charter.md`
2. `docs/audit-loop/STATE.md`（唔存在 → 今次 iteration 做 T00）
3. `docs/audit-loop/FOUNDER-QUEUE.md`（創辦人已經回覆嘅項目，按回覆執行）
4. `docs/audit-loop/source-audit.md` 入面同今次任務相關嘅段落（只作背景參考，唔使每次讀晒全文）
5. `git status` 同 `git log --oneline -5`

---

## 3. 硬性約束（違反任何一條 → 即刻停手，還原今次改動，記錄 BLOCKED）

> 以下係截至 2026-10-01 嘅已知約束。如果同 `docs/charter.md` 有出入，按 §1.2 第 5 條處理。

**技術**
- Next.js 16 App Router + React 19 + Tailwind v4 + Auth.js v5 + Supabase + KaTeX + html2canvas。Next 16 嘅 middleware 叫 `proxy.ts`，新建 `middleware.ts` 會被靜默忽略。
- Dev port 固定 3001（Google OAuth redirect URI 綁定咗）。
- `npm run build` 必須用 webpack，唔用 Turbopack。
- **唔可以加任何新 npm package、付費 API 或外部服務**（包括 Upstash、Plausible、Umami 等）。純 SVG + Tailwind，唔用 chart library。
- 成本優先序：純前端 → PostgreSQL 內建 → SSG → ISR → Edge Function → Serverless。每月成本維持 US$0–200，唔可以超出 Vercel / Supabase 免費額度。
- 所有用戶數據經 server-only `getServiceSupabase()`（service_role）；瀏覽器只可以用 anon key 讀題庫。

**數據同私隱**
- **既定裁決（2026-08-25）**：任何 schema 同時包含 `user_id` + 課題 + 答對率 → 一律拒絕，唔使評估，唔好重提。`lib/sync.ts` 刻意排除呢類數據（commit `9adc536`）。
- 無障礙設定（如 `dse_easy_font`、`dse_quiet_mode`）同情緒／減壓數據只可以存 localStorage，永遠唔入 Supabase、唔混入業務數據。
- 唔可以要求用戶自報係咪 SEN。

**產品文案同設計**
- 唔誇大：唔承諾升級、唔講「100% 準確」。
- 唔比較：冇 streak、冇連勝、冇排行榜、冇「落後 X%」、冇公開百分比。
- 唔報人數：唔可以顯示任何實時或累計人數；只准用靜態句「有同學同你一齊溫」。
- 唔用紅字、唔顯示「FAIL」；答錯用「再諗下💡」或「你發現咗一個新盲點！」。
- 主 UI 用 Morandi 色系；**顏色 token 現時有未決定嘅差異（早期 `:root` 值 vs 實際生效嘅 Morandi ml 色板），任何改顏色 token 嘅動作都要入 FOUNDER-QUEUE，唔好自己揀。**
- **永遠唔用 `dselevelup.hk` 域名**。正式網址係 `https://dse-level-up-by-claude-code.vercel.app`。
- 分享卡已鎖定：只有「錯因破解卡」係主分享卡；卡面冇任何數字（包括年份）、%、x/y、時間、等級、排名、`ig.me`、`dselevelup.hk`。
- 非語文科題目只用標準書面語。
- 練習每節 10 題；反思鎖 30 秒（創辦人指令，唔好改時長）。
- Offline floor：Supabase URL 指向 `http://127.0.0.1:9` 時，同埋離線 reload 之後，`/practice` 仍然要去到第 1/10 題。

**題庫**
- 機器永遠唔自動發佈。**唔可以直接改 `*-reviewed.ts`**。任何題目文字修改都要走：drafts → `_gate.mjs` → review-drafts → 人手逐題覆核 → `decisions.json` → promote。Loop 最多只可以產出 drafts 同報告。
- 解析唔可以引用選項字母（A/B/C/D），因為選項會 Fisher-Yates 洗牌。

**Git 同部署**
- 只喺 `audit-loop` branch 工作。**唔可以 push、唔可以 deploy、唔可以 merge 落 main**。
- 唔可以對 production Supabase 執行任何寫入或 migration。Schema 改動只寫成 `supabase/migrations/` 入面嘅檔案，由創辦人自己 apply。
- 唔改 `.env*`，唔用 `--force`。刪檔案只限 §14.2 證明咗冇被用到嘅 code，或者今次任務明確要求嘅檔案。
- 舊 branch 同 stash 只可以盤點，唔可以 checkout、merge、pop 或刪除。
- 如果 `git status` 有唔係 loop 留低嘅未 commit 改動（即係創辦人手頭嘅嘢）→ 唔好郁，停低匯報。

---

## 4. Gate 定義

| Gate | 意思 | Loop 點做 |
|---|---|---|
| `DIRECT` | 低風險、唔涉產品方向 | 驗證 → 實施 → 測試 → commit |
| `SIGN` | 改動產品行為或公開文案 | 照樣實施同 commit，但 commit message 加 `[SIGN]`，並寫入 FOUNDER-QUEUE 等創辦人批核先可以 merge |
| `FOUNDER` | 需要創辦人決定方向 | **唔寫 code**；將問題、選項、利弊寫入 FOUNDER-QUEUE；等回覆 |
| `REJECTED` | 違反硬性約束 | 永遠唔做（見 §8） |
| `STALE` | 驗證後發現現象唔存在 | 記低證據，標完成 |
| `BLOCKED` | 同一任務連續失敗 3 次，或撞到約束 | 停止該任務，寫原因，跳去下一個 |

---

## 5. Iteration 流程（每次照做）

1. 讀 §2 嘅檔案。
2. 如果上次 iteration 留低未完成嘅 loop 改動：判斷係完成佢定還原佢（`git restore` 只限 loop 自己嘅改動）。
3. 揀任務：FOUNDER-QUEUE 有已回覆但未處理嘅項目 → 優先處理。其次係 STATE.md 入面標咗 `BREAKING` 嘅項目（令 build、qa 或 test 唔過嘅未完成工作或技術債）。否則按 **Wave 次序**（Wave 0 → Wave 9），同一個 Wave 入面按 §7 表格由上至下，揀第一個狀態 `TODO`、Gate 係 `DIRECT` 或 `SIGN`、依賴已完成嘅任務。（編號唔代表次序，因為 v3 新增嘅任務插咗入原有 Wave。）
   FOUNDER 任務唔使寫 code，但每個都要用一個 iteration 寫好 FOUNDER-QUEUE 項目，之後標 `WAITING-FOUNDER`。
4. **驗證**（按 §1.2）：喺 code 入面搵審計描述嘅現象。
   - 搵唔到 → 標 `STALE`，附證據，跳去第 8 步。
   - 發現 code 同 charter 衝突 → 寫 FOUNDER-QUEUE，標 `WAITING-FOUNDER`，跳去第 8 步。
5. **實施**：最細改動。任務太大 → 喺 STATE.md 拆成子任務（如 T20a / T20b），今次只做第一個。
6. **測試**（§6）。任何一項唔過 → 修正；同一任務第 3 次失敗 → 還原並標 `BLOCKED`。
7. **Commit**：`audit-loop(T05): 解析預設展開`；SIGN 任務用 `audit-loop(T06)[SIGN]: …`。
8. 更新 STATE.md（狀態、commit hash、證據、備註），有需要就寫 FOUNDER-QUEUE。可以同任務一齊 commit；冇改 code 嘅 iteration 就單獨 commit 狀態檔。
9. 用 §11 格式匯報，然後結束今次 iteration。

---

## 6. 驗收指令（每個改 code 嘅任務都要跑）

```bash
npm run qa          # 全部 gates 要過
npm test            # 如果 repo 有 test script
npm run build       # webpack，必須成功
```

按任務性質加做：
- **改到 `/practice`、PWA、service worker 或資料載入**：做 offline floor 測試（Supabase URL 指 `http://127.0.0.1:9`，`npm run dev` 喺 3001，確認去到第 1/10 題；再測離線 reload）。
- **改到版面**：用 390px、1024px、1440px、1920px 四個闊度檢查（有 Playwright / browser 工具就截圖，冇就描述檢查方法同 CSS 依據）。
- **改到文案**：grep 確認冇違反 §3 嘅文案約束（冇人數、冇比較、冇紅字、冇 `dselevelup.hk`）。

> 如果上面嘅 script 名同 repo `package.json` 唔符，按 §1.2 第 4 條處理。

---

## 7. 任務清單

### Wave 0 — 準備同重新量度

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T00 | 開 `audit-loop` branch；建立 `docs/audit-loop/STATE.md`（§10 格式，填入本表所有任務）同 `FOUNDER-QUEUE.md`。重新量度：題目總數同每科數量、由撳科目到出第一題嘅流程、答錯後嘅彈窗次序、解析預設狀態、`robots.txt` 內容、`cdn.tailwindcss.com` 有冇出現喺 repo、production 回應標頭（`curl -sI` 正式網址）。另外核對本 prompt 提到嘅檔案路徑同 script 名係咪存在 | DIRECT | STATE.md 有「現況快照」，逐項列出審計講法 vs 實際（✅ 屬實 / ❌ 唔屬實 / ⚠️ 部分）同證據；prompt 錯誤已寫入 FOUNDER-QUEUE |
| T54 | 盤點未完成工作同技術債：按 §13.1 同 §14.1 嘅清單搜尋 repo，將結果分別填入 STATE.md 嘅 Wave 8（`U01`、`U02`…）同 Wave 9（`D01`、`D02`…）表。每項寫明出處（檔案 + 行數 / commit / branch）、Gate、預計大細（S/M/L）。同審計任務重疊嘅，唔好開新項目，喺對應 T 任務備註註明。令 build、qa 或 test 唔過嘅項目標 `BREAKING`。**今次 iteration 只盤點，唔修改任何 code** | DIRECT（依賴 T00） | STATE.md 有兩個完整表；`BREAKING` 項目已標示 |

### Wave 1 — 信任同誠實（最高優先）

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T01 | 透明度頁同首頁嘅覆核披露：讀 repo 入面題庫流程文件，用**實際**覆核流程重寫措辭（審計方向：講清楚有人手逐題覆核、覆核者係 DSE 考生、未經註冊教師覆核；最終字眼以 repo 事實為準）。首頁披露由細字改為正常字級 info box（Morandi 色，唔用紅/黃警告色），附「發現錯誤話我哋知」入口 | SIGN | 新措辭同 repo 流程文件一致；FOUNDER-QUEUE 附舊/新對照 |
| T02 | 社群安全頁講「分享卡同呼吸空間有 IG 溫習群組連結」：核實實際有冇。如果冇，**預設做法**係將政策文字改為同實際一致；「要唔要加返群組連結」入 FOUNDER-QUEUE（群組連結有安全把關問題，分享卡上永遠唔放） | SIGN | 政策頁每一句同實際行為一致 |
| T03 | Footer 同關於頁加官方帳戶連結：Instagram `https://www.instagram.com/dselevelup`、Threads `https://www.threads.com/@dselevelup`。用文字或內嵌 SVG，`rel="noopener"`，有 `aria-label`。**唔加落分享卡** | DIRECT | 四個闊度都見到；CSP 冇因此出錯 |
| T38 | 練習頁每題嘅覆核狀態 badge：細小、唔嚇人嘅文字標示（措辭同 T01 一致），撳開有一句解釋同「發現錯誤話我哋知」入口。唔用紅/黃警告色 | SIGN（依賴 T01） | 每題見到；措辭同透明度頁一致 |
| T39 | Google 登入同步說明：喺登入按鈕附近（**唔係彈窗**）用一兩句講明登入後會同步咩資料、可以點刪除。內容必須同 `lib/sync.ts` 實際同步嘅欄位同私隱政策逐項對得上；伺服器地點等資料只可以寫 repo 有證據嘅 | SIGN | 說明、`lib/sync.ts`、私隱政策三者一致 |
| T04 | 練習表現估算（predictor）：(a) 空狀態加「開始第一節練習」CTA，同 dashboard 一致；(b) 顯示「估算基於你喺本站做過嘅 X 題」同最少題數提示；(c) 如果而家顯示單一等級，改為範圍。**唔改演算法本身** | SIGN | 冇比較字眼；冇承諾升級；舊有免責聲明保留 |

### Wave 2 — 練習流程摩擦

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T05 | 答錯後解析**預設展開**；保留「收埋」選項同現有偏好設定。先確認同 30 秒反思鎖嘅互動——如果展開會令反思鎖失去作用，停手寫 FOUNDER-QUEUE | SIGN | 反思鎖時長同行為不變；offline floor 過 |
| T06 | 情緒 check-in：由**練習中途嘅全屏 modal** 改為非阻斷式（解析下方一行可略過嘅 emoji 選擇，或者節末一次過問）。**唔刪除功能**，數據繼續只存 localStorage | SIGN | 答錯後零 modal；情緒數據冇入任何 Supabase 表 |
| T07 | 錯因三選一（概念盲區／審題陷阱／運算粗心）：由阻擋解析嘅前置步驟，改為解析底部一撳即記嘅 tag。錯題 DNA 嘅數據來源唔可以斷 | SIGN | 錯題 DNA 頁仍然有數據；相關 tests 過 |
| T08 | 練習頁 skeleton loader 加文字「正在準備你嘅 10 條練習題…」，加 `aria-live="polite"` | DIRECT | 讀屏軟件會讀到 |
| T09 | 首頁底部「開始練習」CTA 唔再跳去 `/start` 再揀一次，改為直接顯示同 hero 一樣嘅科目快捷按鈕 | DIRECT | 由首頁到第一題少一步 |
| T40 | 手機快速切換科目：首頁同練習入口加水平捲動 chip row，顯示最近練習過嘅科目 + 「更多」。最近科目記錄只存 localStorage | SIGN | 390px 下一撳就入到最近科目；冇新 Supabase 欄位 |
| T41 | Web Share API：喺現有「錯因破解卡」分享流程加 `navigator.share`（支援 files 就分享圖片，唔支援就退回現有下載方式）。**卡面內容完全唔改**，繼續遵守 §3 分享卡約束；分享文字只用正式 vercel.app 網址 | SIGN | 手機原生分享面板出現；唔支援嘅瀏覽器退回正常；卡面零數字 |
| T42 | 練習結束頁加一行文字連結「追蹤 @dselevelup 睇更多溫書貼士」（連 T03 嘅官方帳戶）。只限網頁，**唔加落分享卡**，唔用 `ig.me` | SIGN（依賴 T03） | 只出現喺結束頁 |
| T10 | 「今日夠了」按鈕文案：提出 2–3 個中性選項（如「先做到呢度」） | FOUNDER | — |
| T11 | 「下一題想要：跟我節奏／基礎／進階／再深入啲」維度混亂：寫出整理方案 | FOUNDER | — |

### Wave 3 — 版面錯誤（純修 bug）

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T12 | 手機浮動按鈕（情緒支援／無障礙）遮住正文：主內容加足夠 `padding-bottom`，或者將按鈕移離內容區 | DIRECT | 390px 下首頁、dashboard、關於頁冇任何文字被遮 |
| T13 | 手機底部 nav 截斷內容：內容區 `padding-bottom` = nav 高度 + `env(safe-area-inset-bottom)` | DIRECT | 所有有 bottom nav 嘅頁面最後一行完整可見 |
| T14 | 「加到主畫面」橫幅：首次訪問唔顯示，完成第一節練習後先顯示（flag 存 localStorage） | DIRECT | 首次打開首頁冇橫幅；完成一節後出現 |
| T15 | Desktop sidebar 加 `position: sticky; top: 0; height: 100dvh; overflow-y: auto` | DIRECT | 1920px 捲到底仍見到導航 |
| T16 | 1024px 純圖標 sidebar：每個圖標加 `aria-label` 同 hover/focus tooltip（純 CSS，唔加 package） | DIRECT | 鍵盤 Tab 過去會見到標籤 |
| T17 | 手機字級：題目正文 ≥17px、選項 ≥16px、footer 免責 ≥13px。確認同「易讀字型」設定唔衝突 | DIRECT | 390px 量度符合 |
| T18 | 科目網格最後一行唔平均：改用 `repeat(auto-fill, minmax(…, 1fr))` | DIRECT | 1024px 冇孤零零一張卡 |
| T55 | 大螢幕（≥1440px）科目網格改為 5–6 欄（例如 `minmax` 自動排列），令 1920px 唔再只用中間窄柱。**只改科目網格**，唔係桌面版全面重設計 | DIRECT（建議喺 T18 之後） | 1440px、1920px 欄數增加；1024px、390px 冇變差 |
| T19 | 次要文字對比度：量度所有次要文字（footer、sidebar quote 等），列出低於 4.5:1 嘅位置同建議色值。**只量度同報告，唔改 token** | FOUNDER | FOUNDER-QUEUE 有完整列表 |
| T20 | 練習頁中大型裝置版面：768–1279px 兩欄（題目＋解析），≥1280px 先三欄；手機版「呢一題」context 收成可展開 accordion，答錯後嘅錯因 tag 同解析用 bottom sheet 由底部滑出，減少捲動。Bottom sheet 要可以用鍵盤同讀屏軟件操作、可以關閉。必須拆子任務 | SIGN | 四個闊度都冇擠迫換行；offline floor 過 |
| T43 | 中型裝置（768–1279px）一般頁面（首頁、dashboard、科目頁、關於頁等）內容區太窄：放寬 `max-width`、減少左右留白。**唔係桌面版全面重設計**，只調寬度同 padding | SIGN | 1024px 內容區明顯用多咗螢幕；390px 同 1920px 冇變差 |
| T44 | 大螢幕 footer 欄位：改用 `repeat(auto-fit, minmax(200px, 1fr))` 令佢喺闊螢幕展開。**只改版面，唔改連結分組**（分組等 T25 決定） | DIRECT | 1920px footer 唔再擠喺中間 |
| T45 | 全局鍵盤導航快捷鍵：**唔可以用 Ctrl/Cmd + 數字**（同瀏覽器切換分頁衝突）。用兩鍵序列（例如 `g` 再按 `p` 去練習）或者其他唔撞瀏覽器同讀屏軟件嘅組合；焦點喺輸入框時停用；要有設定可以關閉（WCAG 2.1.4）；唔可以撞現有嘅 1–4 同 Shift+F | SIGN | 有快捷鍵說明；可關閉；現有練習頁快捷鍵正常 |
| T46 | 收藏頁空狀態：核實而家顯示咩；如果冇引導，加同 dashboard 一致嘅鼓勵文案 + 「開始練習」CTA | DIRECT | 空收藏頁有 CTA |

### Wave 4 — 內容同資訊架構

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T21 | 非語文科口語檢查：寫一個**只讀**掃描 script（或加入 `npm run qa` 嘅 warning 模式，唔好令現有 qa fail），搵出非語文科題幹入面嘅粵語口語字（如 嘅、咗、唔、喺、哋、佢、啲、靠住）。輸出報告到 `docs/audit-loop/colloquial-report.md`。**唔改 `*-reviewed.ts`**；如需修改，只產出 drafts 交人手覆核 | DIRECT | 報告列出科目、題目 ID、問題字眼 |
| T57 | 中文科題目口語化範圍：原文話中文科、英文科題目都有口語化問題，但 T21 只掃非語文科。先用 T21 嘅 script 以只讀方式掃一次中文科，列出結果同例子；然後問創辦人：中文科要唔要納入標準書面語規則（有啲題目可能係刻意保留口語，例如語境、對話或修辭題）。英文科唔適用粵語字掃描，原文所指如有需要另行定義 | FOUNDER（依賴 T21） | FOUNDER-QUEUE 有掃描結果同例子 |
| T22 | 首頁盲測 demo 選項用中文數字（五十°）：先睇 code 註解確認係咪刻意設計；如果唔係，改為阿拉伯數字 | SIGN | 同練習頁格式一致 |
| T23 | 實作為主科目（音樂、體育、視藝、科技與生活等）嘅科目卡同科目頁加說明：「MC 練習只覆蓋筆試相關知識，實作、創作同演奏需要另外準備」 | SIGN | 文案冇誇大；冇數字比較 |
| T56 | 科目頁分組：原文建議將科目分為「筆試為主」同「實作為主」兩組顯示，唔好平等並列。寫出分組方案（每科歸邊組、分組標題字眼、對 SEN 同「唔標籤化」原則嘅影響） | FOUNDER | — |
| T24 | 每科 SEO landing page（`/subjects/[id]`）：補 `metadata`（title、description）同 200–300 字科目介紹。**只可以用 repo 已有嘅課程資料**，唔可以自己作 DSE 佔分比例或任何考評局數據；唔確定嘅就唔寫。每科一個子任務 | SIGN | 每頁有獨立 metadata；冇捏造數據 |
| T25 | 資訊架構：「不考之地」改名、「呼吸空間」vs「休息吓」統一、三個分析頁（進度／錯誤模式／練習表現）合併、footer 分組、英文 tagline、slogan「你唔係一個人」。寫一份整合方案 | FOUNDER | — |
| T26 | 方法論頁加例子：審計建議引用具體 past paper 題號，**唔好照做**（冇核實來源有捏造風險）。改為提議用我哋自己嘅原創平行改寫題做例子 | FOUNDER | — |
| T58 | 原創性記錄：核實題目生成流程嘅記錄（concept-webs、drafts、`_gate.mjs` 結果、review-drafts、`decisions.json`）有冇完整保留喺 repo，係咪足以證明題目係原創平行改寫。寫一份 `docs/audit-loop/originality-records.md`：列出記錄位置、覆蓋範圍、缺口。**唔改題庫檔案**；有缺口嘅補救方法入 FOUNDER-QUEUE | DIRECT | 文件列明每科記錄係咪齊全 |
| T59 | 抽樣覆核機制：原文建議每科抽 5–10% 題目再覆核，錯誤率超過 2% 就暫停該科重新覆核。寫出可行方案（邊個抽、點抽、點記錄、暫停點樣執行同顯示），唔假設可以請註冊教師 | FOUNDER | — |
| T49 | 首頁結構：原文建議壓縮至 3 屏內、合併盲測 demo + 方法論 demo + 統計、刪除「點解完全免費」section（改為 hero 下一行）、改 hero 標語、加 elevator pitch、大螢幕將盲測 demo 放 hero 右半。寫一份整合方案（現有 section 列表、每個 section 嘅去留選項、同使命句「掌握邏輯，唔係背答案」嘅關係） | FOUNDER | — |
| T50 | 每科「覆核進度」指標：原文建議顯示「數學：已覆核 45%」。**注意可能撞「冇公開百分比」約束**；列出選項（唔顯示／用文字分級／用百分比並修改約束）俾創辦人揀 | FOUNDER | — |

### Wave 5 — 反饋同數據（零新服務）

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T27 | 唯讀數據查詢：先用 `information_schema` 同 `pg_tables` 摸清實際表結構，然後喺 `scripts/metrics/` 寫 SQL 檔：每日活躍、每週活躍、10 題完答率、科目使用分佈。**只出聚合數字，唔出個人層級資料**；唔建 view、唔改 schema；由創辦人自己喺 Supabase SQL Editor 跑 | DIRECT | SQL 檔有註解解釋每條 query；冇觸及 user_id + 課題 + 答對率組合 |
| T27b | 喺 T27 嘅 SQL 檔加「錯誤舉報數量」（按科目、按原因聚合）。只出聚合數字 | DIRECT（依賴 T28 嘅 migration 已由創辦人 apply） | Query 只用 `question_reports` 表 |
| T28 | 每題「舉報問題」入口由文字連結改為明顯嘅 icon button + 簡短表單。儲存方案：新表 `question_reports`（`question_id`, `reason`, `note`, `created_at`），**唔存 user_id**；寫 migration 檔 + RLS（只准 service_role 寫）+ server route（有基本防濫用）。同步更新私隱政策 | SIGN | Migration 未 apply；私隱政策同實際一致 |
| T29 | 節末反饋：「今次練習體驗點？」1–5 選擇 + 可選文字。新表 `session_feedback`（`rating`, `note`, `subject`, `created_at`），**唔存 user_id、唔存答對率**。同 T28 一樣寫 migration + RLS + 私隱政策更新 | SIGN | 同上；UI 冇評分人數或平均分顯示 |
| T60 | 「社群已驗證」標籤（無數字版）：學生可以撳「呢條題目冇問題」，累積到某個門檻後題目顯示「社群已驗證」，**永遠唔顯示人數**。寫出方案：儲存方式（唔可以用 user_id + 課題 + 答對率組合）、防濫用、門檻、同 T38 覆核 badge 點並存 | FOUNDER | — |
| T30 | 第三方 analytics（Plausible / Umami 等）：私隱政策而家承諾「冇任何分析服務」，加唔加係方向問題 | FOUNDER | — |
| T51 | 數據最小化：原文指私隱政策收集「開過 app 嘅日期」但冇用到。核實 code 實際有冇收、用喺邊；寫建議（停收／保留並講明用途）。**唔好自己刪欄位** | FOUNDER | — |
| T52 | 一次性用戶調查：唔使寫 code。喺 FOUNDER-QUEUE 草擬 3 條問題（最常用邊科、最唔滿意咩、會唔會推薦俾同學），措辭要遵守 §3 文案約束，由創辦人自己用 Google Form 發 | FOUNDER | — |

### Wave 6 — 安全

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T31 | HSTS：用 T00 嘅 `curl -sI` 結果判斷。Production 已經有 `Strict-Transport-Security` → `STALE`。冇 → 喺 `next.config` 嘅 `headers()` 加 `max-age=63072000; includeSubDomains`（**唔加 `preload`**，因為 `vercel.app` 唔係我哋擁有嘅域名） | DIRECT | 標頭出現喺 build 後嘅設定 |
| T32 | Tailwind CDN：grep 全 repo 搵 `cdn.tailwindcss.com`。搵唔到 → `STALE`（我哋用本地 Tailwind v4）。搵到 → 移除並確認樣式冇壞 | DIRECT | grep 結果寫入 STATE.md |
| T33 | CSP `unsafe-inline`：**唔好實施**。寫一份設計筆記：Next 16 正確做法係喺 `proxy.ts` 產生 nonce 並設 CSP header，代價係相關頁面變動態渲染，會影響 SSG、成本同 offline floor。列出受影響頁面同取捨 | FOUNDER | — |
| T34 | Rate limiting：檢查私隱政策講嘅「伺服器喺記憶體按 IP 計算請求次數」有冇實際實施。有 → 記錄位置；冇 → 喺寫入型 API route 加簡單 in-memory 限流（註明 serverless 多實例下只係盡力而為），**唔用任何外部服務** | SIGN | 私隱政策同實際一致 |
| T35 | Auth.js `redirect` callback：確認只接受同源 URL；未有就加 | DIRECT | 有對應 test 或手動驗證記錄 |
| T36 | 加 `public/.well-known/security.txt`：`Contact: mailto:dselevelup@gmail.com`、`Expires:`（一年後）、`Preferred-Languages: zh-HK, en`、`Canonical: https://dse-level-up-by-claude-code.vercel.app/.well-known/security.txt` | DIRECT | Build 後路徑可存取 |
| T37 | RLS 審計：寫 `scripts/metrics/rls-audit.sql`（列出 `public` schema 每張表嘅 `rowsecurity` 同 `pg_policies`），由創辦人跑完貼返結果；loop 再根據結果寫建議。**唔改任何 policy** | DIRECT | SQL 檔存在；FOUNDER-QUEUE 有「請跑呢個檔」項目 |
| T53 | Vercel access token 同 deploy hook 定期輪換：帳戶管理事項，唔係 code。喺 FOUNDER-QUEUE 寫一份簡短 checklist | FOUNDER | — |

### Wave 7 — 效能

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| T47 | 練習頁載入速度：**先量度**（由撳科目到第一題出現嘅時間，用瀏覽器 Performance API 或 devtools，唔加任何 package 落 `package.json`），分網絡正常同慢速兩種情況記錄。如果真係慢，寫原因分析同優化方案（SSG、service worker cache 等），每個方案拆成獨立 SIGN 子任務；必須符合成本優先序同 offline floor | DIRECT（量度）／SIGN（優化） | STATE.md 有量度數字同方法 |
| T48 | 首頁首屏 owl 圖片：`next/image` 加 `priority`；其他非首屏圖片確認係 lazy load | DIRECT | Build 過；首屏圖片冇 lazy |

### Wave 8 — 完成未完成工作（由 T54 填表，規則見 §13）

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| U01… | 由 T54 盤點產生 | 按 §13.2 | 按 §13.3 |

### Wave 9 — 清還技術債（由 T54 填表，規則見 §14）

| ID | 任務 | Gate | 驗收 |
|---|---|---|---|
| D01… | 由 T54 盤點產生 | 按 §14.2 | 按 §14.3 |

---

## 8. 已拒絕嘅審計建議（永遠唔做，唔好重提）

| 審計建議 | 拒絕原因 |
|---|---|
| Streak、每日挑戰連續日數、同班排行榜 | 違反「唔比較」 |
| 「已有 X 名學生使用」、「今日有 X 人一齊練習」 | 違反「唔報人數」，只准用「有同學同你一齊溫」 |
| 成績分享卡（例如「答啱 8 題」） | 分享卡已鎖定為冇數字嘅錯因破解卡 |
| 每題「X 人確認無誤」社群驗證計數 | 公開人數；如創辦人想要，佢哋會另行提出 |
| 購買或使用 `dselevelup.hk` | 違反域名約束 |
| Upstash、Plausible 等外部服務 | 違反零新服務／成本約束（analytics 方向見 T30） |
| Vercel Deployment Protection | 會令 production 學生入唔到網站 |
| robots.txt 刪走 `/account`、`/sign-in` 等 Disallow | robots.txt 唔係保安措施，刪咗反而令私人頁面可能被索引；保持現狀 |
| HSTS `preload` | `vercel.app` 唔係我哋擁有 |
| 自訂 SVG icon set、owl mascot 統一、整套 button design system、Cmd+K、split view、桌面版全面重設計 | 審計自己都建議暫緩；1–2 人團隊之後再議 |
| 招募註冊教師覆核、專業責任保險、HKEAA 相似度比對 | 屬創辦人層面決定，唔係 code 任務 |
| AI 個性化學習路徑、AI「錯因深度分析報告」 | 要用付費 API，違反成本約束；亦容易形成 user_id + 課題 + 答對率嘅組合，撞 2026-08-25 裁決 |
| 練習頁「今日正確率」即時 stats panel | 顯示百分比，違反「唔比較／冇公開百分比」 |
| 答錯某類題目時彈出相關 IG 帖文 | 練習中途彈出物，同 T06 減少打斷嘅方向相反 |
| 科目卡「MC 幫助程度：高／中／低」標籤 | 為科目貼分級標籤，有標籤化問題；核心問題已由 T23 嘅說明文字處理 |
| Ctrl/Cmd + 數字快捷鍵 | 同瀏覽器切換分頁衝突；改用 T45 嘅做法 |
| 「邀請同學一齊練」專屬 link，睇到邊個朋友都喺度練 | 顯示朋友活動屬於比較同人數，違反「唔比較／唔報人數」 |
| 以提升 §16 嘅評分作為目標 | 評分係外部主觀判斷，部分基於過時或錯誤前提；目標係解決具體問題，唔係追分 |

---

## 9. 審計原文入面已知嘅技術錯誤（實施時唔好照抄）

- **`experimental: { nonce: true }`**：Next.js 冇呢個設定。Nonce 要喺 `proxy.ts` 自己產生。
- **Tailwind CDN vs CSP**：原文同時話 CSP 係 `script-src 'self' 'unsafe-inline'`，又話頁面由 `cdn.tailwindcss.com` 載入 script——兩者矛盾（CSP 會擋咗嗰個 script）。以 T32 嘅 grep 結果為準。
- **HSTS**：Vercel 喺 `*.vercel.app` 通常已經自動加 HSTS。以 T00 嘅 `curl` 結果為準。
- **「寫入只允許 service_role」**：本身已經係我哋嘅架構，唔係新問題；T37 只係核實。
- **Rate limit 測試**：原文只發咗 5 個請求就話冇限流，證據唔足。T34 以 code 為準。
- **數字**：26,497 條、每科 866–1624 條、載入 3–5 秒等，全部以 T00 重新量度為準。
- **SQL 表名**：原文嘅 `practice_sessions` 等表名係估嘅。T27 以 `information_schema` 實際結果為準。

---

## 10. 狀態檔格式

`docs/audit-loop/STATE.md`：

```markdown
# Audit Loop State
最後更新：<ISO 時間> · Iteration #<n> · Branch: audit-loop

## 現況快照（T00）
| 審計講法 | 實際 | 證據 |
|---|---|---|

## 任務
| ID | Gate | 狀態 | Commit | 證據／備註 |
|---|---|---|---|---|
| T00 | DIRECT | DONE | abc1234 | … |
| T01 | SIGN | TODO | | |
```

狀態值：`TODO` / `IN-PROGRESS` / `DONE` / `STALE` / `WAITING-FOUNDER` / `BLOCKED(n/3)` / `CANNOT-COMPLETE`（只限 U、D 任務，必須附 §13.4 原因代碼）。另外可以加標記 `BREAKING`。

`docs/audit-loop/FOUNDER-QUEUE.md` 每項格式：

```markdown
### Q-T10 「今日夠了」改名
- 類型：方向決定 / code 同 charter 衝突 / prompt 錯誤 / SIGN 批核
- 背景：…（code 位置、charter 條文、原文出處）
- 選項：A … / B … / C 維持現狀
- Loop 建議：…（附原因）
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）
```

---

## 11. 每次 iteration 匯報格式（廣東話，簡短）

```
【Iteration #n】T05 解析預設展開 — DONE [SIGN]
驗證：審計講法屬實（components/…/Explanation.tsx:42 預設 collapsed）
改動：…（一至兩句）
測試：qa ✅ build ✅ offline floor ✅
Commit：abc1234
新增 FOUNDER-QUEUE：無
下一個：T06
```

---

## 12. 停止條件

- 所有 T、U、D 任務都係 `DONE` / `STALE` / `BLOCKED` / `WAITING-FOUNDER` / `CANNOT-COMPLETE`，而 FOUNDER-QUEUE 冇已回覆但未處理嘅項目 →
  1. 喺 STATE.md 尾加「總結」：完成幾多、STALE 幾多、BLOCKED 幾多、等緊創辦人嘅項目、所有 `[SIGN]` commit 列表（方便創辦人逐個批核）。
  2. 確認 `docs/audit-loop/UNFINISHED-REPORT.md`（§15）已經列齊所有完成唔到嘅項目同原因。
  2b. 寫 `docs/audit-loop/AUDIT-COVERAGE.md`：按 §16 每一個評分維度同評語，列出對應任務同最終狀態（例如「數據基礎設施 0/10 → T27 DONE、T27b WAITING-FOUNDER、T30 WAITING-FOUNDER」）。**只列事實，唔好自己重新打分。**
  3. 輸出 `AUDIT-LOOP-DONE`，提醒用戶停止 `/loop`。
- 撞到 §3 任何硬性約束而無法繞過 → 停低匯報，唔好自己估。
- 連續 3 個 iteration 都冇任何可做任務（全部等創辦人）→ 輸出 `AUDIT-LOOP-WAITING`，提醒用戶先處理 FOUNDER-QUEUE。

---

## 13. 完成未完成工作（Wave 8）

### 13.1 點樣搵（T54 盤點用）

逐項搜尋，每項都要記出處：

1. **舊計劃同 prompt**：`docs/prompts/`、`docs/` 入面其他 STATE、計劃、Wave 清單（例如之前嘅 200 個改善建議 prompt），搵出標咗未完成、或者 git log 搵唔到對應 commit 嘅項目。
2. **Git**：未 merge 落 main 嘅本地 branch（`git branch --no-merged main`）、`git stash list`。**只盤點，唔 checkout、唔 merge、唔 pop stash。**
3. **Code 註解**：`TODO`、`FIXME`、`HACK`、`XXX`、`WIP`、「未完成」、「之後再做」。
4. **Tests**：`.skip`、`.todo`、`xit`、`xdescribe`、被註解咗嘅 test。
5. **半成品**：已經有 UI 但冇接駁、已經寫咗但冇被任何地方 import 嘅模組、feature flag 長期關閉嘅功能、`supabase/migrations/` 入面寫咗但 code 冇用到嘅 schema。
6. **文件同 code 唔一致**：README、CLAUDE.md、charter 描述咗但 code 冇實施嘅功能（例如 README 寫 Next.js 16.2.9，實際係 ^16.3.2）。

### 13.2 Gate 判斷

- 原計劃已經有 Gate → 沿用原 Gate。
- 純粹補完已決定嘅功能、唔改產品方向 → `DIRECT`。
- 會改動用戶睇到嘅行為或文案 → `SIGN`。
- 原計劃冇講清楚要點做、或者同 charter／現有 code 有衝突 → `FOUNDER`（按 §1.2）。

### 13.3 驗收

同審計任務一樣跑 §6 全部檢查。完成後喺原出處更新狀態（例如刪走已處理嘅 TODO 註解、喺舊計劃檔標完成），等之後唔會再被當成未完成。

### 13.4 完成唔到點算

完成唔到嘅，標 `CANNOT-COMPLETE`，**一定要俾原因**，用以下代碼之一，再加一兩句具體解釋：

| 代碼 | 意思 |
|---|---|
| `NEED-FOUNDER` | 需要創辦人決定方向或批核 |
| `VIOLATES-CONSTRAINT` | 完成佢會違反 §3 或 charter（寫明邊一條） |
| `NEED-EXTERNAL-ACCESS` | 需要 production Supabase、Vercel 帳戶、Google Console 等 loop 冇權限嘅地方 |
| `NEED-DEPENDENCY` | 需要新 package、付費 API 或外部服務 |
| `NEED-HUMAN-REVIEW` | 涉及題庫內容，要人手逐題覆核 |
| `UNCLEAR-SPEC` | 原計劃資料唔足，估唔到原意 |
| `TOO-RISKY` | 冇足夠 test 保護，改動可能破壞現有功能；寫明需要先補咩 test |
| `SUPERSEDED` | 已被後來嘅決定或功能取代（寫明被乜取代） |
| `BLOCKED-3X` | 試咗 3 次都唔過驗收（附最後一次錯誤訊息） |

---

## 14. 清還技術債（Wave 9）

### 14.1 點樣搵（T54 盤點用）

1. `npx tsc --noEmit` 嘅錯誤；`@ts-ignore`、`@ts-expect-error`、`as any`、明確 `any` 類型。
2. Lint 警告（用 repo 現有 lint 設定，唔好加新規則）。
3. 冇被用到嘅 export、檔案、npm package（用 grep 同 build 證明）。
4. 重複 code（同一段邏輯喺 3 個或以上地方出現）。
5. 冇 test 保護嘅核心邏輯（題目抽選、等級預測、錯題 DNA、`lib/sync.ts`、offline 載入）。
6. 寫死嘅數值、魔術數字、應該用 design token 但寫死咗嘅值（**顏色 token 例外**，見 §3，一律入 FOUNDER）。
7. `npm audit` 結果同過時嘅 package（只盤點）。
8. 過時文件（README、CLAUDE.md 同實際 code 唔符）。
9. Console 警告（hydration warning、React key warning 等）。

### 14.2 Gate 判斷同安全規則

技術債嘅改動**必須唔改變任何用戶睇到嘅行為**。做唔到呢點就唔係技術債清理，要轉做 `SIGN` 或 `FOUNDER`。

| 類型 | Gate |
|---|---|
| 修 TypeScript 錯誤、移除 `any`、修 lint 警告、修 console 警告 | `DIRECT` |
| 補 test（只加 test，唔改被測 code） | `DIRECT` |
| 刪冇用到嘅 code 同檔案（grep + build + test 證明冇被用到） | `DIRECT` |
| 刪冇用到嘅 npm package | `SIGN` |
| 更新過時文件 | `DIRECT` |
| 抽走重複 code、重構 | `SIGN`，而且**必須先有 test 覆蓋**；冇 test 就先開一個補 test 嘅 D 任務 |
| `npm audit` 修補：patch 同 minor 版本 | `SIGN` |
| `npm audit` 修補：major 版本升級 | `FOUNDER` |
| 改 Supabase schema、RLS、資料結構 | `FOUNDER` |
| 改題庫檔案（`*-reviewed.ts` 等） | 一律 `CANNOT-COMPLETE`，代碼 `NEED-HUMAN-REVIEW` |

### 14.3 驗收

- 改動前後 §6 全部檢查都要過，而且 test 數量唔可以減少（刪 test 只限被刪 code 嘅 test）。
- 每次只清一項技術債，一個 commit：`audit-loop(D07): 移除 lib/foo.ts 冇用嘅 export`。
- 完成唔到 → 標 `CANNOT-COMPLETE`，用 §13.4 嘅原因代碼。

### 14.4 範圍界線

「還晒所有技術債」嘅意思係：**T54 盤點到嘅每一項，最後都要係 `DONE` 或者 `CANNOT-COMPLETE`（附原因）**，唔可以有項目無聲無息咁消失。但唔好為咗清債而做大型重寫；一項債如果要改超過約 10 個檔案，先拆細，拆唔細就標 `CANNOT-COMPLETE`（`TOO-RISKY`）並寫明建議做法。

---

## 15. 完成唔到嘅項目總報告

檔案：`docs/audit-loop/UNFINISHED-REPORT.md`。每次有項目標 `CANNOT-COMPLETE` 或 `BLOCKED`，即刻加入呢個檔。格式：

```markdown
# 完成唔到嘅項目
最後更新：<ISO 時間>

## 按原因分類統計
| 原因代碼 | 數量 |
|---|---|

## 明細
### U03 錯題 DNA 匯出 PDF
- 出處：docs/prompts/ideas-200-claude-code.md 第 142 行
- 原因代碼：NEED-DEPENDENCY
- 解釋：需要 PDF 生成 library，違反「唔加新 package」約束；現有 html2canvas 只可以出圖片。
- 要完成需要：創辦人決定係咪接受只出圖片，或者批准新 package。
```

Loop 結束時，呢份報告就係俾 Brian 同 Yuna 嘅「完成唔到清單」：每一項都講明點解做唔到、要乜先做得到。

---

## 16. 審計評分同評語（背景參考，唔係任務）

> 以下係審計原文入面所有評分、評語同最終判斷嘅整理。用途係俾你理解審計者覺得邊啲問題最嚴重，同埋喺 loop 結束時寫 `AUDIT-COVERAGE.md`。
> **注意**：呢啲係外部人士嘅主觀判斷，部分建基於已知過時或錯誤嘅前提（例如透明度頁措辭令審計者以為「零人手覆核」、Tailwind CDN、題目數量）。唔好將評分當目標，唔好自己重新打分，唔好為咗回應評語而違反 §3。

### 16.1 審計者向創辦人提出嘅 5 條關鍵問題

| 問題 | 對應任務 |
|---|---|
| 有幾多條題目經過真人教師逐題覆核？「自動檢查」覆蓋咩準則？ | T01、T38、T58、T59 |
| 題目嘅評分準則對照係咪由註冊教師或考評局相關人士審定？ | T01（披露措辭） |
| 每日活躍用戶同 7 日／30 日留存率係咩水平？ | T27 |
| Google 登入用戶完成 10 題嘅完答率有幾高？ | T27 |
| 有冇收集過學生反饋？最常被投訴係咩？ | T28、T29、T52 |

### 16.2 第一版產品審計

**整體評語**：核心理念「掌握邏輯唔係背答案」正確，但執行配唔上野心。主要批評：題目未經人手逐題覆核就上線，解析由 AI 生成只過自動檢查；1920px 桌面版內容塞喺約 600–700px 窄柱；全站零分享機制、零社交連結、零增長引擎；答錯後「揀錯因 → 情緒彈窗 → 睇解析」三重摩擦。

**差距評分：3.5 / 10**。理念清晰、內容基礎唔錯（數學科解析質素算合格），但桌面佈局、交互摩擦、增長機制、品牌一致性、題目覆核差距巨大；最致命係零增長機制同三重答題摩擦。

**會唔會俾自己小朋友用：唔會**。原因唔係內容差，而係大量 AI 生成題目未經人手覆核，無法確認每條答案同解析正確；熱門科目覆核到 70% 以上先會推薦。

**最終判斷**
- **考生角度**：理科 MC 練習有一定價值，解析合格，但三重摩擦浪費時間，學生要自己判斷解析可信度。可以用，但唔可以盲信。
- **投資角度：唔會投**。零分享、零社交、零 analytics、零 retention 機制；未覆核題目係計時炸彈，一個學生公開投訴就會令口碑崩塌。投資前要：加分享、加 analytics、覆核熱門 6 科、修桌面佈局。
- **Portfolio 角度**：作為 side project／MVP 可以寫，理念、內容基礎、私隱同透明度頁嘅誠實態度值得肯定；作為正式產品唔可以寫，因為桌面佈局、交互摩擦、零增長、品牌唔統一，面試官喺 1920px 打開會質疑設計能力。

### 16.3 更新一：知道有 Instagram / Threads 帳戶之後

**評分：3.5 → 4 / 10**。團隊有增長意識（IG 內容製作），但網站完全冇連結去 IG／Threads，社群安全頁承諾嘅呼吸空間 IG 群組連結亦唔存在，反映產品同營銷割裂——「有增長引擎但冇接駁到車」。

- **投資角度**：由「唔會投」調為「觀察中」；如果一週內完成網站同社交媒體雙向連結、修好呼吸空間連結、加 Web Share API，會重新評估。
- **Portfolio 角度**：面試官會質疑產品整合能力——有宣傳渠道但冇接駁產品。
- **考生角度**：不變。考生要嘅係即刻做題、即刻睇完整解析、唔被打斷。

### 16.4 更新二：知道覆核由 2026 DSE 考生做、冇 Admin 後台、冇收集反饋之後

**修正方向：更嚴厲。**

| 維度 | 原評分 | 修正評分 | 審計者原因 |
|---|---|---|---|
| 題目質素與覆核 | 3 / 10 | 2.5 / 10 | 學生覆核唔等於專業覆核；透明度頁「未經逐題人手覆核」措辭係「誤導性準確」 |
| 數據基礎設施 | 未評 | 0 / 10 | 冇 Admin 後台、冇 analytics，完全盲飛 |
| 用戶反饋機制 | 未評 | 0 / 10 | 冇反饋渠道，產品同用戶斷裂 |
| 整體產品成熟度 | 3.5 / 10 | 3 / 10 | 有 IG 帳戶 +0.5，但零數據基建同零反饋 −1 |

**修正後差距評分：3 / 10**。審計者認為零數據基礎設施係成份審計最嚴重嘅發現，比所有 UI 問題加埋更嚴重，因為冇數據就唔知道邊個問題真係令學生流失。

- **考生角度**：由考生覆核、未經教師審定、團隊睇唔到數據、未收集過反饋，等於喺黑暗中運行；數學科解析合格（審計者實際驗證過），其餘 24 科要考生自己判斷，呢個負擔唔應該由考生承擔。
- **投資角度**：閉門造車，好似冇儀表板嘅飛機師；投資前必須先建好數據基建。
- **Portfolio 角度**：反映嘅唔係技術能力不足，而係產品意識不足——唔知道用戶點解用、用得開唔開心、會唔會返嚟。

### 16.5 更新三：知道係 1–2 人、零預算、純公益團隊之後

**重新校準**：之前部分建議（招募註冊教師、自訂 icon set、完整 Admin 後台）對 1–2 人團隊太重，改為只推薦一至兩週內做得到、影響最大嘅改動。

**審計者嘅最後評語**：一至兩個人、零預算，做出覆蓋 25 科嘅免費平台，有清晰理念、誠實私隱政策、活躍 IG，本身值得尊重。但純公益唔等於可以降低標準；學生嘅信任係免費得嚟，所以更脆弱，一條錯誤解析就可能令口碑反轉。最迫切係確認數據庫有咩表、跑第一條 query、第一次睇到自己嘅活躍人數同完答率。

### 16.6 網絡安全審計

**總結評語**：基礎安全**遠超預期**。冇暴露 Supabase URL、API key、Google OAuth client ID、用戶數據或源代碼；CSP、X-Frame-Options、Permissions-Policy 配置正確。對 1–2 人公益項目嚟講係令人驚喜地好。

**通過嘅檢查（20 項，全部評為「優秀」）**：Supabase URL／API key 冇暴露、OAuth client ID 冇暴露、`.env` 403、`.git` 403、源代碼設定檔 403、source maps 403、localStorage／sessionStorage 冇敏感數據、冇 cookie、冇 X-Powered-By、冇 `__NEXT_DATA__`、RSC payload 冇 email／UUID、open redirect 被擋、Auth.js 內建 CSRF、`/api/progress` 401 同 `/api/admin` 403、XSS 測試被 Vercel WAF 擋、CSP 完整、X-Frame-Options DENY、Permissions-Policy 停用 camera／mic／geolocation、Referrer-Policy strict-origin-when-cross-origin、X-Content-Type-Options nosniff。

| 類別 | 評分 | 審計者備註 | 對應任務 |
|---|---|---|---|
| 客戶端密鑰保護 | 10 / 10 | 冇任何密鑰暴露 | — |
| API 認證 | 9 / 10 | 所有 endpoint 有保護 | T35 |
| HTTP 安全標頭 | 7 / 10 | CSP 好，但缺 HSTS 同有 `unsafe-inline` | T31、T33 |
| 攻擊面 | 8 / 10 | robots.txt 暴露路徑、缺 rate limiting | T34（robots.txt 已拒絕） |
| 供應鏈安全 | 7 / 10 | Tailwind CDN 係風險 | T32 |
| Supabase RLS | 未驗證 | 要創辦人自查 | T37 |
| **整體** | **8 / 10** | 對 1–2 人團隊係優秀水平 | — |

> 提醒：§9 列出咗安全審計入面已知嘅技術錯誤，部分扣分可能建基於錯誤前提（例如 HSTS、Tailwind CDN），以 T00、T31、T32 嘅驗證結果為準。
