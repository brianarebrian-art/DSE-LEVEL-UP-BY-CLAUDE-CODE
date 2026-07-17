# CHANGELOG

依藍圖 v2026.07.16-FINAL 執行規範第 15 條，由 2026-07-16 起記錄。更早嘅歷史見 git log。

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
