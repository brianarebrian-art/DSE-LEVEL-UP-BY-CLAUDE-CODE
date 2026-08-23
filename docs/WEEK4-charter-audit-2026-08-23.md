# 第 4 週 憲章紅線逐條核對報告

**日期：** 2026-08-23
**範圍：**《學習動機引擎》第 1–3 週交付物 + 全站現況
**方法：** 全部由 filesystem 實測，冇一項由記憶或文件推斷。每項附可自行重跑嘅指令。
**簽核欄：** 留白。本報告只提供證據，唔代表任何人已批核。

---

## 一、驗收指令與結果

| 指令 | 結果 |
|---|---|
| `npm run qa` | **6/6 PASS**（term-guard / validate-banks / i18n-guard / contrast-guard / claims-guard / integration-guard） |
| `npm test` | **537 / 537 pass, 0 fail** |
| `npx tsc --noEmit` | clean |
| `npx eslint app components lib` | clean |
| `npm run build -- --webpack` | 95 頁綠 |

現況：科目 **25**、題庫 **5,898** 條、孤兒課題 **0**、孤兒組件／模組／路由 **0**。

---

## 二、憲章逐條

### 第 3 條 —— 100% 免費（至 2027 DSE 前）

| 檢查 | 結果 |
|---|---|
| 付費／訂閱／Premium／paywall／HK$ 定價字眼 | **0 個檔** |
| Stripe／PayPal／PayMe／checkout SDK | **0 個檔** |
| `/upgrade` 路由 | 不存在 |

重跑：`grep -rniE 'premium\|訂閱\|付費牆\|paywall\|HK\$ ?[0-9]' app components lib`

### 第 4 條 —— Integration Requirement（接線先算完成）

2026-08-23 新增 `scripts/integration-guard.mjs`，已入 `npm run qa`。

| 檢查 | 結果 |
|---|---|
| 孤兒組件（65 個 components 冇人 import） | **0** |
| 孤兒模組（55 個 lib 冇人 import） | **0** |
| 冇任何站內連結嘅路由 | **3**，全部明示豁免並寫低理由 |

豁免名單：`/admin`（管理員直接輸網址）、`/dev/answer-cards`、`/dev/long-session`（開發用預覽）。

**本週發現並修正兩處：**

1. `/waiting`（放榜前緩衝空間，內有真實求助熱線）一直喺 sitemap 但全站零連結指過去
   —— 只有由搜尋引擎入得到。已由呼吸空間接返入去。
2. `/reading` 嘅 hydration 不匹配：一個會被伺服器渲染嘅 client component，
   喺 `useMemo` 初始化器用 `Math.random()` 洗牌選項，於是伺服器同瀏覽器洗出唔同次序，
   React hydration 失敗、成棵樹喺客戶端重繪、console 每次載入都報錯。
   `tsc`／`eslint`／`build` 全部唔會捉。已改為由題目 key 導出嘅**決定性洗牌**
   （實測：跨載入次序穩定、正確答案分佈 A/B/C/D = 4/3/2/3，冇集中喺任何一個位），
   並新增 `hydration-safety.test.mts` 鎖住（落閘實測 165 個 .tsx → 0 處）。

### 第 5 條 —— 每月技術成本 ≤ US$200

| 檢查 | 結果 |
|---|---|
| 套件總數 | 20 |
| `drizzle-orm` | 冇 |
| `@supabase/auth-helpers-nextjs` | 冇 |
| `chart.js` / `d3` / `recharts` | 全部冇 |
| `better-auth` | 已安裝 —— 憲章 §5 明示豁免，非幻覺 |
| 第 1–3 週新增套件 | **0** |
| 第 1–3 週新增付費 API | **0** |
| 第 1–3 週新增數據表 | **0**（全部 localStorage） |

`html2canvas` 已安裝，屬 `/dashboard/report` PNG 匯出既有依賴，非本批新增，純客戶端零成本。

### 第 6 條 —— Validation Gates（落閘前先量影響）

本週擴咗兩個閘，兩個都先做影響評估：

| 閘 | 擴展範圍 | 影響評估 | 決定 |
|---|---|---|---|
| term-guard 情緒安全 | 由 3 個寫死檔案 → 整個 `lib/` | lib/ 53 檔 → **命中 0 處** | 落閘 |
| term-guard 情緒安全 | 曾考慮擴至 `data/questions/` | **命中 8 處**，全部正當學術內容（「中國逐漸落後於世界潮流」「科技太落後」「粗放農業」） | **唔落閘** —— 紅字表為 UI 回饋校準，唔適用於科目內容 |
| contrast-guard | 由 `app/`+`components/` → 加 `lib/` | **命中 0 處** | 落閘 |

`lib/` 原本有 10 個檔帶用戶可見文案（`arena` / `breathingPatterns` / `conceptNet` /
`gentleSuggestions` / `stepHints` / `homestead` / `lockoutQuestions` / `truth-engine` /
`difficulty` / `grading`），從來冇受過情緒安全同對比度檢查。

### 第 7 條 —— 大愛設計與 UDL

| 檢查 | 結果 |
|---|---|
| 學生介面出現大紅交叉（`<XCircle` / ❌） | **0** |
| `FAIL` 字眼 | **0** |
| 震動 API（`navigator.vibrate`） | **0** |
| 答錯選項用玫紅底／邊 | **0** |
| 60 秒逆向鎖死 | 上線，實測會觸發 |
| 情緒溫度計 | 上線，實測會觸發 |
| 無痕 SEN 專注模式 | 上線（易讀字體／閱讀尺／隱藏計時器／靜音） |
| 深呼吸急救室 | 上線（SOS 掣 → 4-7-8 呼吸 + 真實熱線） |
| 隱藏天賦雷達圖 | 上線（`RadarChart`，數據變動會重新展開） |

**本週發現並修正兩處：**

1. `/reading` 係另一個練習介面，答錯仲用緊 `XCircle` + 玫紅。第 1 週改答錯回饋
   嗰陣只改咗 `/practice`。已對齊為金色燈泡，並加**全域測試**鎖住，唔再靠人手記得。
2. `/result`「拔尖診斷警示」用紅色 ⚠️ 同「仍有不足」「絕不代表能取得 5**」，
   對象係一個基礎題**全部答對**嘅學生。學術內容一個字冇改（執分位 ≠ 5**、
   要攻高階推論題），改嘅係呈現：紅→金、⚠️→💡、「警示」→「下一段分數喺邊」。

`app/admin/ReviewPanel.tsx` 仍有 ❌（「退回」掣）—— 管理員工具，非學生介面，不在此紅線範圍。

### 第 8.1 條 —— Gamification 六條約束（2026-08-22 解禁後仍生效）

| 約束 | 現況 |
|---|---|
| ① $0 成本 | 第 1–3 週零新套件、零新表、零付費 API |
| ② 唔准懲罰性回饋 | 答對脈衝同答錯衝擊波**同為 600ms、同一曲線**，測試鎖住 |
| ③ 唔可以侵蝕練習流程 | 難度選擇器只喺答咗之後出現；自適應**只排序唔重抽**，3:5:2 分毫不變（實測 6/10/4） |
| ④ SEN 可以整層關掉 | 一鍵舒適模式 = 易讀字體＋閱讀尺＋隱藏計時器＋靜音，四項一齊；動畫 `animation:none` 而非調慢 |
| ⑤ 虛擬貨幣只限減壓區 | 虛擬超市零貨幣零結帳；無真實貨幣交易 |
| ⑥ 唔准虛構數據 | 假在線人數／假見證／同人比較：**0** |

**本週發現並修正：** `.animate-slide-up`（答題回饋面板用緊）同 `.animate-pop-in`
由一開始就冇納入 `prefers-reduced-motion` —— 開咗系統「減少動態效果」嘅前庭敏感
用戶，每答一題照樣見到成塊面板由下面掹上嚟。已修正，並改為**通用測試**：
任何帶 `animation` 嘅 class 都必須喺 reduced-motion 靜止，唔再逐個寫死。

### 第 8 條 —— 已否決項目

| 項目 | 結果 |
|---|---|
| JUPAS 預測器 / admission probability | **0** |
| 收費模式 / Premium / 訂閱 | **0** |
| 老師平台（`classes` / `enrollments` / `question_events`） | **0** |
| 虛構統計 / 假在線人數 | **0** |
| 假用戶見證 | **0** |
| 舊名 Aethel / WisdomPath / 化城避風港 / Buff 補給艙 | **0** |

### 第 13 條 —— 免責聲明

中文版齊備（並非考評局官方試題／獨立改寫／等級預測僅供參考），已有測試守住。

**本週發現並修正：** 原測試只驗中文版。非華語考生睇嘅係英文 footer，
免責聲明對佢哋一樣具法律意義。已加英文版斷言（`not official HKEAA papers` /
`independently rewritten` / `for reference only`）。

---

## 三、未解決 / 需創辦人裁決

呢啲**冇**擅自改動，因為佢哋係產品決定唔係 bug。

| # | 事項 | 現況 | 建議 |
|---|---|---|---|
| 1 | OpenDyslexic 字體檔 | `@font-face` 有宣告，但 `public/fonts/` 只有 README —— 每次開易讀字體都 404 之後靜靜落後備堆疊 | 二擇一：(a) 將 `OpenDyslexic-Regular.woff2` 放入 `public/fonts/`（約 150KB、$0）；(b) 剷走個 `@font-face`。後備堆疊（Verdana/Tahoma/Trebuchet/Comic Sans）已由測試守住，功能唔會壞 |
| 2 | 錯因三分類用玫紅 | `ErrorDNA` 同 `ReviewScheduler` 將「概念盲區」固定用玫紅。屬三色圖例嘅其中一隻類別色，唔係判斷 —— 但概念盲區係最常見錯因，學生會見到好多紅 | 要唔要換一組唔含紅系嘅三色？換色會影響已上線嘅圖例辨識 |
| 3 | 溫習足跡顯示「連續 N 日」 | `/logic-log` 喺 streak ≥ 3 先顯示。§8.1 已解禁 gamification，但規格書 §4.5 嘅「無連續日數壓力展示」原則同佢有張力 —— 斷咗個數就會消失，隱含損失感 | 保留／改為累計日數／整個攞走 |
| 4 | 死 CSS | `.grade-bar-fill`、`.animate-hell-pulse`、`.combo-flame-pink`、`.combo-flame-yellow` 定義咗但零使用（`animate-hell-pulse` 用紅色脈衝，幸好冇上線） | 剷走定留住 |
| 5 | 待審題目 | 386 條、16 個批次，reviewer 欄空白 | 真人逐題批 —— 機器永不自動入庫 |

---

## 四、我做唔到嘅部分（如實列出）

| 規格書第 4 週項目 | 狀態 | 原因 |
|---|---|---|
| 情緒安全審核（UDL 醫療團 Emma/Sarah 簽署） | **做唔到** | Emma／Sarah 係虛擬 persona。憲章紅線：虛擬 persona 唔可以簽名。技術層面嘅情緒安全檢查我做咗（見第 7 條），但**專業簽核必須真人** |
| 10–20 位學生封閉測試 | **做唔到** | 需要真實學生。測試方案已備妥，見 `docs/WEEK4-closed-beta-protocol.md`，等真人執行 |
| 數據漏斗分析 | **做唔到** | 需要真實使用數據。現時零 server-side 事件記錄（`question_events` 已刪、`user_sessions` 0 行），而補返會撞「禁止新增數據表」紅線 |

**本報告冇任何一項結果係模擬、估算或代簽。**
