# CHANGELOG

依藍圖 v2026.07.16-FINAL 執行規範第 15 條，由 2026-07-16 起記錄。更早嘅歷史見 git log。

## 2026-07-19b — Light-first Phase 2：/practice + /subjects 轉淺色（Task #99）

- **`/practice` 做題引擎（`PracticeSession.tsx` 846 行）全轉淺色**：題卡白底、選項 `#F5F5F0`；狀態語意色 —— **答啱=青 `#008B84`、答錯=玫 `#C2185B`（避鮮紅 §4.1）**、反思/提示=金 `#B8860B`、主 CTA=實心青 `#00726C`、MC Hack=紫 `#7C3AED`；weight 收 400-500。
- **順手修 2 條憲章違規**：①60 秒反思鎖預設模式原本 `bg-black/70`+`border-red-700`（黑底鮮紅）—— 違 §4.4「奶油白遮罩、非黑」+ §4.1 禁鮮紅，改兩種模式都用暖淺色（`#FDFBF8`／`#FDFCF8`）；②鎖標題原有 `uppercase`（違 §3.3 禁 ALL CAPS）已剷。
- **支援組件 migrate**：`PracticeSupport`（無障礙工具角浮動白藥丸 + 白卡 modal + 淡黑 scrim；字級 range accent 青）、`NotTonightGate`（白卡確認框）、`PracticeGate`/`page.tsx` loading。
- **`/subjects`**：`SubjectsView`（白卡 grid + 青「已上線」章 + 青 CTA + 青 roadmap 進度 + 青 chips + 白搜尋/排序；**保留每科 hover accentRing 色彩編碼**）、`SubjectDetailView`（青 quick-start banner + 實心青「立即開始」+ 白課題卡 + 英文科寫作/閱讀入口轉紫）。
- **驗收**：tsc 非測試 0 error、殘留暗 token 0；瀏覽器 E2E —— /subjects grid 淺色、/subjects/economics 詳情頁、/practice 實測答錯流程（選項玫框+青正解 → 停一停反思面板金 → 揀錯因 → 思維逆襲解密 → 實心青「下一題」）、console 零 error。
- ⚠️ 60 秒鎖 hard-only，未經 hard 題實機觸發（純色替換，tsc 綠）；剩 Phase 2：其餘內頁（result/methodology/leaderboard/focus/relax/writing/reading/about…）、ThemeToggle、body flip。

## 2026-07-19 — Light-first Phase 2：Dashboard 轉淺色 + 精進軌跡（計劃A 藍圖 / Task #98）

- **背景**：用戶貼「計劃A：外觀大改造」（暗底霓虹 `#0B0F19`+`#00F5D4` 賽博朋克 Landing+Dashboard）—— 同前一 message 剛裝嘅晨曦憲章 §3 Light-first + 已 ship 嘅淺色 landing/Navbar/Footer **正面對撞**。同時計劃A §4/§9 復活多條紅線（醫療級、🔥streak、長答 Regex 批改、404 路由 /exam·/review·/dna、假數「6+ 科」實際 25 科）。**已核實並提報**；用戶拍板「Light-first 做準，計劃A 當 Dashboard 藍圖」。
- **`app/dashboard/page.tsx` 全頁轉淺色**：`#FAFAF8` 底 / 白卡 / `#008B84`·`#B8860B`·`#C2185B` 三強調 / weight 收至 400-500（§3.3）。**去 gamification**：🔥 火焰 streak 改中性 `CalendarCheck`＋青（保留「連續打卡」習慣數值，剷 §2 禁嘅火焰符號）。reset 用玫 `#C2185B` 非鮮紅。全部連結指真路由（無 404）。
- **新增 `components/ProgressTrajectory.tsx`**（計劃A §5.6 唯一真新組件）：純 SVG 每日正確率精進軌跡，數據 100% 由 `loadAttempts()` 逐日聚合（真 localStorage，零虛構曲線），<2 活躍日顯示溫和佔位。
- **6 個內頁子組件 migrate 淺色**：`DailySpectrum`（三段神經色→青/金/玫 on-white）、`ErrorDNA`（DNA 條避鮮紅）、`ErrorRadar`（青邊紫填）、`ReviewScheduler`（錯因 tag 三色）、`DailyPlan`、`SyncStatus`（狀態色避鮮紅）＋ `RadarChart`（硬編碼 `#1e293b`/amber→中性+青）。
- **修全站 Footer 暗縫**：`Footer.tsx` 剷 `mt-20`——透明 margin 原本露出仍暗嘅 `body.bg-bg-dark`，喺淺色 Dashboard 底變黑帶；改為 footer 淺底直貼（暗頁本身睇唔到嗰 gap，中性）。**未 flip 全站 body 底色**（係 Phase 2 最後一步，會令未 migrate 暗頁反爆縫）。
- **驗收**：tsc --noEmit 非測試 0 error；瀏覽器（seed 6 日作答＋7 錯因）—— landing→Navbar→Dashboard→Footer 全程融合淺色、軌跡圖真數據渲染、DNA/雷達/重溫三色讀得清、暗帶消除、console 零 error；seed 已清。
- ⚠️ 剩 Phase 2：其餘 ~50 內頁組件（practice/subjects/focus…）仍暗、ThemeToggle（P2）、45 分鐘溫柔提醒、導航審計、WCAG 全掃；全站 body flip 待內頁清完先做。

## 2026-07-17f — Admin 審核面板 /admin（Task #95）

- **新增**：`/admin`（server 頁，ADMIN_EMAILS env 白名單 + Auth.js session 閘，唔夠身份即彈返首頁）＋ `/api/admin`（GET 歷史/POST 決定，reviewer 一律取自 session）＋ `ReviewPanel` client（逐題 A/R/P、備註、就地更新唔 reload、重新裁決）＋ `0004_review_decisions.sql`（**用戶要落 Supabase SQL editor 行**）＋ `scripts/qbank/pull-decisions.mjs`（雲端決定拉返 repo 生成 decisions.json → 照行 promote）。統計卡實時由真題庫計（唔寫死數字）。
- **同原 spec 刻意唔同（已提報）**：①冇 `profiles.role` 欄——admin=env 白名單，唔重引 teacher 詞彙；②admin email 唔寫死喺公開 repo 源碼——用 `ADMIN_EMAILS` env；③RLS 改「開 RLS 零 policy」——原 spec 嘅 `auth.jwt()` policy 假設 Supabase Auth，本 stack（Auth.js + service role）永不 match；④9pt 字體規格不採納（Leo 紅線）；⑤冇 `promoted_at/by` 欄——promote 審計軌跡在 reviewed.ts 檔頭+git，唔兩處記錄；⑥spec 漏咗「回程路」，pull-decisions.mjs 補上（含「雲端空+本地已簽」拒覆寫護欄）。
- **驗收**：qa 三綠 + build 綠（`/admin`、`/api/admin` 以 ƒ dynamic 註冊）+ E2E：未登入 `/admin` → 302 返首頁（實測 path=/）、`/api/admin` → 403；pull 腳本無 env 時安全拒絕。**面板要生效需**：行 0004 SQL + 喺 .env.local 同 Vercel 設 `ADMIN_EMAILS`。
- 順手清咗 `.env.example` 嘅免費化殘留（ALLOWED_EMAILS/PREMIUM_EMAILS，code 零引用）＋補 Supabase env 說明。

## 2026-07-18 — Light-first Phase 2 P0：Navbar + Footer 轉淺色（晨曦行動 Task 1-2）

- **kate-uiux skill 升級 v-FINAL「晨曦行動」**（取代 v-B，v-B 封存 `SKILL.md.bak.v-B-2026-07-18`）：§1 blocklist 補齊「虛擬 persona 當真人導師」「假 SOS 熱線」兩紅線。裝前修咗作者又漏 patch 嘅 §15 英文科「Tone & Register 雙重批改／嚴打盲抄」（同 §1 blocklist 打對台，第三次），已剷。
- **Task 1 Navbar（`Navbar.tsx` + `LanguageToggle.tsx` + `AuthButton.tsx`）**：純白底 + #1A1A1A 文字 + #008B84 accent + #00726C 實心掣（WCAG AA）。**保留全部真結構**（5 條 i18n 連結 subjects/dashboard/methodology/leaderboard/about + LanguageToggle + AuthButton + mobile aria）—— prompt 範例會刪 3 條連結兼寫死中文破 i18n，冇照抄。
- **Task 2 Footer（`Footer.tsx`）**：light-first 三層（Doormat 導航 / Trust 信任+HKEAA 免責 / Compliance 合規）。**拒紅線**：唔列 Carson/Amity/Victor 為真人導師、無真熱線就唔放假號、只連真實路由（/transparency，唔整 /privacy /terms 404）。i18n 全沿用。
- 驗收：qa 三綠 + build 綠 + 瀏覽器（landing 融合、Footer 三層渲染、console 零 error）。
- ⚠️ 過渡接縫：白 Navbar/淺 Footer 現夾住仍暗色嘅內頁（practice/dashboard/methodology…）—— 預期，Phase 2 剩餘 task（內頁 ~50 檔 + ThemeToggle + 45 分鐘提醒 + 導航審計 + WCAG 全掃）migrate 完先消除。

## 2026-07-18 — Light-first Phase 1：landing 轉「清晨圖書館」淺色（UI/UX 憲章 §3）

- **決策背景**：憲章要全站 light-first，但實掃有 **53 檔硬編碼 dark-only class**（text-white/bg-slate-9…）—— 一鍵翻變數會白字白底爆版。故分階段：Phase 1 = landing（旗艦面）自足淺色；Phase 2 = inner 面逐檔 migrate 後先翻全域 default。
- **app/page.tsx 全面轉 light-first**：暖白底 #FAFAF8／卡片白／降飽和青 #00A8A0（取代 amber）／暗金 #D4A017；字重只用 400/500；純 CSS + Intersection Observer 進場動畫 + 大數字 count-up（globals.css 加 `.animate-on-scroll`，尊重 prefers-reduced-motion）。**自足淺色，唔郁全域 body → inner 暗色頁零影響、零爆版。** 盲測黑題卡刻意保留深色做「終端」對比。
- **誠實修正憲章筆誤**：規格牆數字用真實 **25 科**（憲章 §4 寫「4科」係筆誤）；**冇宣傳計數機/醫療級**（前者草稿未上線、後者 overclaim）。
- 驗收：qa 三綠 + build 綠 + 瀏覽器實測（hero/count-up/科目格/盲測卡全部渲染、真數字、console 零 error）。
- **未做（Phase 2，task #97）**：全域 ThemeToggle + Navbar/Footer/practice/dashboard/admin 等 ~52 檔 migrate；全部核心面 theme-agnostic 後先將 default 由 dark 翻 light。頂部 Navbar 現仍暗色（淺頁深導覽，可接受，Phase 2 統一）。

## 2026-07-18 — Admin 面板 UX：審完自動跳下一題 + 快捷鍵

- `ReviewPanel.tsx`：狀態上移到父層集中管理，加「活躍卡」概念 —— 提交成功後顯示「✓ 已記錄，載入下一題…」800ms，再自動遞進至下一條 pending（跨批次繞行），平滑捲入畫面中央，全程唔 reload。
- 快捷鍵（只喺活躍卡生效，一次只一個 listener）：`A/R/P` 或 `1/2/3` = 通過/退回/暫緩，`Enter` = 提交。**打緊備註（input focus）時自動唔搶鍵**（原 spec 冇呢個防呆，打「1」會誤觸通過）；`Cmd/Ctrl/Alt` 組合鍵放行（唔搶 Cmd+R）。頂部進度條 + 「本節已記錄 N · 待審 X/Y」。
- 誠實修正：原 spec 完成畫面寫「累積簽名 22 → 22+N」——（1）22 係虛構數（實際 12）；（2）更關鍵，喺面板撳「通過」只係【記錄決定】入 Supabase，唔等於入題庫。改用「本節已記錄 N 條決定」+ 明寫「⚠️ 記錄 ≠ 入庫，仍需本地 pull→promote→wire→push」。
- 對齊實際組件：原 spec code 針對幻想結構（DraftQueue/DraftReviewCard、question_text、A/R/P），實接真組件（ReviewPanel、question、approved/rejected/pending）。
- 驗收：qa 三綠 + build 綠（/admin、/api/admin 皆 ƒ）；瀏覽器實測未登入 `/admin` 正確 redirect 返首頁（安全閘生效）。面板內部 UX 需登入 admin session 先睇到（Google 登入不可代做）。

## 2026-07-17f — Admin 審核面板 /admin（瀏覽器逐題 A/R/P，Task #95）

- `/admin`（server component + `ReviewPanel` client）：Google 登入 + `ADMIN_EMAILS` 白名單閘，非 admin `redirect('/')`（唔透露頁面存在）。實時統計卡（Live/簽名/覆蓋率/待審由真題庫計，零寫死）+ 待審隊列（讀 `scripts/qbank/drafts/*.json`）+ 雲端審核歷史。
- `/api/admin` GET/POST：reviewer 一律取自 session（唔信 client 自報），寫入 Supabase `review_decisions`（migration `0004`）。`lib/auth/adminAllowlist.ts` backend-agnostic（Auth.js 今日 / Better Auth 之後）。
- `scripts/qbank/pull-decisions.mjs`：雲端決定拉返 repo 生成 `<batch>.decisions.json` → 照行 `promote-drafts.mjs`。**入庫唯一路徑仍然係本地 promote + 人手 wire + git push —— 面板只記錄決定，機器永不自動入庫。**
- 修正原 spec 4 位（已提報）：RLS 開而零 policy（本 stack 用 service role 唔用 Supabase Auth，原 `auth.jwt()` policy 係死码）；admin email 入 env 唔寫死喺公開 repo；唔重引 `profiles.role`/teacher 詞彙（0003 已剷）；`next.config` 加 `outputFileTracingIncludes` 令 Vercel serverless 讀到 drafts。
- 驗收：qa 三綠 + build 綠（`/admin`、`/api/admin` 皆 ƒ 動態路由）。**啟用步驟（人手）：Supabase 跑 0004 + Vercel 設 `ADMIN_EMAILS` + push。**

## 2026-07-17e — F-CTX 跨篇對決首批 2 題入庫（中文科首批人手核對題）

- Brian 實名簽批 2/2（魚我所欲也×岳陽樓記／六國論×出師表）→ `promote-drafts.mjs` 出 `data/questions/chinese-reviewed.ts` → wire `load.ts` + `index.ts`。跨篇對決功能由「草稿」正式變「有 live 內容」。
- 驗收：qa 三綠 + build 綠 + E2E（`?topic=跨篇比較示範` 出 2/2、✅ badge、答對後深解析完整渲染、console 零 error）。中文 155→157。
- ⚠️ 管線備忘：promote 按科目覆寫 `<科>-reviewed.ts` —— #84 範文批次簽批後，必須將兩份 drafts+decisions 合併再 promote，否則會冚走本批 2 題（負責人：Claude，唔使人手記）。

## 2026-07-17d — Econ 供需 MC 10 題：首批人手核對題入庫（Task #94）

- **人手審批管線首次全程走通（非語文科首例）**：草稿（carson-econ-chief 規範，3:5:2，每題 trapTypes+dnaTag+深解析）→ `_gate.mjs` 機器閘（`\$` 銀碼逃逸修正後 10/10）→ 驗收報告修正（「每爐」→「每批次」；另 6 項口語指控核實為 chat 轉述、不在檔案）→ **Brian 實名簽批 10/10 approved（2026-07-17）** → `promote-drafts.mjs` 產出 `data/questions/economics-reviewed.ts`（reviewer 蓋印）→ 人手 wire 入 `load.ts` + `index.ts`。
- 誠實決定：**不附機器英譯** —— Brian 審批嘅係中文版；EN 介面 fallback 顯示中文，英文版需另行人手審批先加。
- Topic 用細分中文 id（如 `需求變動_vs_需求量變動`）：錯因雷達獨立分組、`?topic=` 直達可用；不入科目頁 topic 篩選清單（設計內）。
- 驗收：qa 三綠 + validate-banks 全 pass + build 綠；瀏覽器 E2E：`?topic=` 只出該 reviewed 題、「✅ 人手核對題」badge 顯示、選項運行時洗牌、答對後書面語解析完整渲染、console 零 error。經濟綜合練習題數 258→268。

## 2026-07-17c — 憲章 v3.2 §1.4：日界線改行香港時間（HKT）基準

- 新增 `lib/hkTime.ts`：`hkDayString()`（YYYY-MM-DD，HKT，04:00 日界線）+ `nextHkFourAm()`。HKT = UTC+8 全年無夏令，純本地運算 —— **零網絡、零依賴、$0**。
- 接線：`dailySpectrum` 每日光譜重置 + `notTonight` 失效時刻改以 HKT 計，唔跟裝置時區（香港裝置行為不變；時區設錯／人在外地先有差異，而家同全港學生一致）。
- 澄清（檔頭已記）：HKO 開放數據 API 係天氣／警告數據，唔係授時服務；為攞時間加網絡請求反而令慢網學生每日重置失效。
- 驗收：7 個邊界值單元自測全過（03:59/04:00 正點/凌晨/日間）+ 練習頁 E2E（光譜日字串命中 HKT 預期）+ qa 三綠 + build 綠。

## 2026-07-17b — 憲章 v3.0-philosophy 落地首項：60 秒冷靜艙定稿文案

- 60 秒鎖標題「強制反思鎖 · 60 秒」→「**60 秒冷靜艙**」（§6.2 命名 + 大愛設計，紅色語氣退場）；aria-label 同步。
- 沙漏下方新增失敗學定稿句（§1.2）：「過去係過去，未來係未來。由呢一瞬間開始。」（雙語）。
- qa 三綠 + build 綠 + dev 實測（鎖觸發後標題/aria/定稿句全部命中）。
- 其餘 v3 新功能（我話事模式／考綱風向儀／裸帳本等）按 P-gate 排隊；憲章衝突項（PWA vs Service Worker 永久否決、長答 keywords 批改禁令、等級預測虛構修正因子等）已另行向 Brian/Yuna 提報，未拍板前不動工。

## 2026-07-17 — #84 範文薄弱篇草稿批次 + 覆核管線質量元數據（vFINAL-QUALITY）

### 新增（草稿，未入庫）
- **#84 範文薄弱篇 10 道草稿**：《論仁、論孝、論君子》6 題 + 《月下獨酌（其一）》4 題，批次精準 3:5:2（basic 3／intermediate 5／hard 2）。概念網 `scripts/qbank/concept-webs/chinese-lun-ren-xiao-junzi.json`、`chinese-yue-xia-du-zhuo.json` → 工廠出 `drafts/chinese-fanwen-weak-84.json`（機器客觀閘 0 自動拒）→ `…review.html` 審批表 + `…decisions.json`（全 pending，等 Brian/Yuna 實名）。每題按質量憲章帶 `trapTypes`（每選項陷阱角色）+ `dnaTag`（CMT/TMR/MEC，對應自診 A/B/C）+「點解啱＋點解每個干擾項誤導」深解析，correctIndex 一律 0。

### 變更
- **arts-variant-factory.mjs**：passthrough `trapTypes`／`dnaTag`（item → template fallback），純 reviewer 元數據，唔影響 gate、promote 唔帶入庫。
- **review-drafts.mjs**：審批卡新增 錯因 DNA 章 + 每選項陷阱標籤 chip + 模板溯源 badge；修正難度標籤唔識 basic/intermediate 詞彙嘅顯示問題。

### 驗收證據
- 工廠兩次運行 0 壞件；review 頁瀏覽器實測（標籤/章/溯源全部顯示）；qa 三綠 + build 綠；live 題庫零改動。

## 2026-07-16 — P1 收官批次（P1-6-R1~R3 + P1-7-R1~R2）

### 新增
- **沙漏 SVG 霓虹動效**（P1-6-R1，`components/HourglassTimer.tsx`）：60 秒反思鎖以純 SVG 沙漏取代數字倒數；非線性沙流（前快後慢，easeOut）；柔和／情緒柔和模式減速降飽和；完成時框轉綠；`role="timer"` + aria-label。倒數改由絕對 deadline 計算（舊逐秒 setTimeout 鏈會累積漂移）。
- **指令字自動高亮**（P1-6-R2，`components/CommandWordText.tsx`）：學生自診「B. 審題陷阱」後，題幹 HKEAA 指令字先亮起（英文 except/not/must/only… + 中文 除了/並非/必須/不包括…）。純 React span 拆分，零新增 dangerouslySetInnerHTML；KaTeX 數式段不受影響；負向斷言防「消除了／所有權／一定程度」誤亮。
- **鎖尾 5 秒溫和提示音**（P1-6-R3，`lib/lockChime.ts`）：正弦波雙耳節拍 220/224Hz（柔和 174/178Hz、音量 0.15→0.08），5 響每響 0.8s，gain envelope 防 pop；100% 程序化生成零音檔；唔支援 Web Audio 時靜默降級；獨立 AudioContext 用完即 close。

### 變更
- **霓虹色 CSS 變數化**（P1-7-R1，`app/globals.css` @theme）：neon-cyan/pink/yellow/purple + bg-dark 等入 Tailwind v4 @theme；13 個 live UI 檔案嘅硬編碼 hex 遷移至 utilities/var()。刻意保留字面 hex：html2canvas 導出面（DailyStatsCard／溫書地圖報告）、GroupCommunity hex-alpha 拼接、ErrorRadar SVG presentation attributes。
- **過渡曲線統一**（P1-7-R2）：`pop-in` 過衝彈跳曲線 cubic-bezier(0.34,1.56,…) 移除，keyframes 統一 Material 曲線；globals.css 記錄全站時長層次（微交互 150／組件 200／彈窗 250／頁面 300ms）。

### 驗收證據
- `npm run qa` 三綠 + `next build --webpack` 綠。
- 瀏覽器實測：沙漏標準／柔和／完成三態截圖；「不包括」高亮截圖（bafs 4P 題）；提示音 AudioContext×1 + oscillator×10 計數器實證；console 零 error。
