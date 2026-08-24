# HOTFIX-0823 執行報告

**執行人：** Claude Code（前端組）
**日期：** 2026-08-24
**分支：** `feat/dse-paper-authenticity`

> **Kelly／Kate 注意：** 本文件所有「最終狀態」欄位**一律留空**，等你哋實測後填。
> 下面「開發側量度」一節係我自己跑嘅數，**唔等於驗收通過** —— 只係交低我改咗乜、
> 點量、量到幾多，等你哋覆核個時有個對照。

---

## 零、開工前必須先講清楚：規格書有四處同實際 repo 對唔上

唔係吹毛求疵 —— 呢四點會直接影響驗收判斷，所以擺喺最前。

### 0.1 ⚠️ 規格書嘅驗收標準本身驗唔到佢想驗嘅嘢

規格書全篇要求：

```
document.documentElement.scrollWidth === window.innerWidth  →  true
```

**呢個檢查喺流動版 Chrome 係假陰性。**

手機 Chrome 遇到內容闊過視窗嘅時候，**唔係**出橫向捲軸，而係**自動撐大版面視窗**
去遷就最闊嗰件內容。實測未修之前嘅首頁：

| 量度項 | 值 |
|---|---|
| 裝置闊度（`visualViewport.width`） | **375** |
| 版面視窗（`window.innerWidth`） | **467** ← 被撐大咗 |
| `document.documentElement.scrollWidth` | **467** |
| `scrollWidth === innerWidth` | **`true`** ← 檢查話「冇溢出」 |
| 實際上有冇爆？ | **有，爆 92px** |

兩邊一齊變大，所以永遠相等。Kelly 照住規格書逐頁撳落去，**十一版全部會顯示通過**，
但部機真係爆緊。而且後果唔止「睇落怪」：版面視窗由 375 撐到 467 ＝ 成頁被瀏覽器
**縮細到 80%**，字細一圈 —— 對讀寫障礙、弱視同 SEN 考生就係直接嘅無障礙倒退。

**建議改用：**

```js
document.documentElement.scrollWidth <= window.visualViewport.width
```

或者更直接嘅訊號：`window.innerWidth > 375` 本身就代表爆咗。

### 0.2 規格書列嘅十一條路由，有五條唔存在

| 規格書寫 | 實際路由 |
|---|---|
| `/exam/:id` | **`/practice`** |
| `/result/:id` | **`/result`**（無 `:id`，讀 localStorage） |
| `/profile` | **`/account`** |
| `/login` | **`/(auth)/sign-in`** |
| `/acknowledgments` | **唔存在** —— 致謝名單係 `components/GuardianCredits.tsx`，嵌喺全站 Footer 入面 |

### 0.3 「50 個 routes」實際係 95 版

`next build --webpack` 輸出：**95 個靜態頁**（63 條路由條目，當中 `[subject]`
等動態段展開成 25 科）。驗收清單如果照 50 去對數會對唔上。

### 0.4 第二階段要求嘅 Supabase 表，2026-07-14 已經刪咗

規格書 Step 2.1 要求喺 `question_events` 表上面起兩個 RPC 函數。**呢張表唔存在** ——
連同 `classes`／`enrollments` 一齊喺 2026-07-14「一刀斬」拆走。而且憲章規定練習資料
100% 存 localStorage，Supabase 只做伺服器端備份。

**做法：** 改喺本機用 localStorage 算（詳見第二節）。結果一模一樣，而且離線可用、
零伺服器往返、零成本。**冇新增任何數據表**（符合紅線）。

---

## 一、死 CSS 驗證與清理

四個全部確認係死 code（全站零組件引用，亦冇動態 class 拼接），已剷走：

| Class | 判定 | 備註 |
|---|---|---|
| `.grade-bar-fill` | 死 → 已刪 | ⚠️ **但 `@keyframes fill-bar` 保留** —— `app/result/ResultPageClient.tsx:399` 用 inline style 直接叫緊個 keyframes。淨係刪咗個 class wrapper。 |
| `.animate-hell-pulse` | 死 → 已刪 | 連 `@keyframes hell-pulse` 一併刪。**佢係紅色答錯脈衝**（`rgba(220,38,38)`），註釋原文寫「reads as menacing」—— 撞正憲章 §7 大愛紅線，剷走係雙重正確。 |
| `.combo-flame-pink` | 死 → 已刪 | 只係顏色變體 |
| `.combo-flame-yellow` | 死 → 已刪 | 只係顏色變體 |

⚠️ **基底 `.combo-flame` 冇刪** —— `app/homestead/HomesteadView.tsx:25` 用緊。

順帶：`lib/__tests__/sen-accessibility.test.mts` 嘅 `DEAD_CSS` 豁免名單**清空咗**。
以前 `.grade-bar-fill` 靠佢豁免「動畫必須做 reduced-motion 降級」呢條測試；家陣個
class 冇咗，豁免名單保持空白 ＝ 任何動畫 class 都必須做降級，冇後門。

---

## 二、`/logic-log` 方案 B：累積制

「連續 N 日有足跡」→ **本月溫習 N 日 ＋ 總共溫習 N 日**（去重日數）。

### 點解唔用 Supabase RPC

見 §0.4。改為 `lib/logicLog.ts` 新增 `computeActiveDays()`（純函數）同
`buildActiveDays()`（讀 localStorage）。

**呢個唔係就住現實嘅折衷 —— repo 本身已經有同一個決定嘅先例：**
`lib/progress.ts` 嘅 `computeRecentActiveDays()` 早就將「連續打卡」改成窗口計數，
註釋寫得好清楚：

> 連續計數的問題不在於使用了火焰符號，而在於【中斷一日即歸零】：學生休息一天，
> 畫面就把過往的累積一次抹掉，等同宣告「之前的努力白費」。

我照跟呢個既有模式，冇另創一套。

### 順手剷埋 `currentStreak()`

UI 唔再用之後，我連函數本身都刪咗（唔係淨係唔顯示）。理由：留住一個現成嘅
streak 函數，等於留低一個「接返落去」嘅邀請。`isConsecutive()` **保留** ——
佢淨係用嚟畫時間軸節點之間嘅連接線，唔係計分。

### 時區

用返全站同一把尺：`lib/hkTime.ts` 嘅 `hkDayString()`（HKT，**04:00 日界線**，
唔係午夜）。「本月」＝ 該日字串嘅 `YYYY-MM` 前綴。

---

## 三、375px 響應式

### 3.1 真兇：一個裝飾光暈

全站掃描（165 個 `.tsx`）＋ 逐頁瀏覽器量度之後，**唯一**確認嘅橫向溢出源頭：

```
app/page.tsx:98   <div className="… h-[280px] w-[560px] -translate-x-1/2 … blur-3xl" />
```

首頁 hero 嘅裝飾光暈寫死 560px。喺 375px 機上左右各爆 93px，觸發 §0.1 講嘅版面
視窗撐大。改成 `w-full max-w-[560px]`：**桌面版一模一樣（實測 1024px／1280px
之下仍然係 560px），手機版啱啱好 375px。**

### 3.2 規格書講嘅其他頁，實測冇爆

我冇照單全收改嘢 —— 逐版量度過先決定。以下係實測結果：

| 規格書判定 | 實測 |
|---|---|
| 主頁「Footer 溢出」 | **Footer 冇爆。** 佢已經係 `grid sm:grid-cols-3`（375px 自動單欄）＋ `text-xs` 合規層。爆嘅係光暈，唔係 Footer。 |
| 致謝名單頁「已確認中招」 | **冇獨立路由**（見 §0.2），內容喺 Footer 內，隨 Footer 一齊冇爆。 |
| 儀表板「高風險」 | **`scrollWidth` 375，零溢出元素。** |
| 結果頁「高風險」 | 375 通過。`/dashboard/report` 十三個 SVG **全部有 viewBox**，冇一個寫死闊度。 |
| 練習頁「高風險」 | 375 通過，KaTeX 數式六條全部喺框內。 |

**所以我冇改 Footer。** 一個冇壞嘅共用組件，改咗係全站回歸風險，唔值。

### 3.3 規格書 Step 3.1-B 嘅前提唔成立

規格書要求「將閱讀尺同設定由 Footer 移除，另建 FAB」。**兩粒掣本來就唔喺 Footer。**
佢哋一直都係獨立全局組件，掛喺 `app/layout.tsx`：

- `components/A11yPanel.tsx` —— ♿ 設定，`fixed floating-bottom left-4 z-50`，48×48
- `components/ReadingRuler.tsx` —— 閱讀尺，`fixed floating-bottom left-20 z-50`
- 全部用 `.floating-bottom` utility，**已經計埋底欄高度同 `env(safe-area-inset-bottom)`**

⚠️ 而且規格書指定嘅新位置（右下角）**已經有嘢**：`components/GlobalA11y.tsx` 嘅
「我好緊張」求助掣坐緊 `right-4`。搬過去會撞正一個情緒危機支援入口（憲章 §7）。
**所以我冇搬。**

### 3.4 但係喺附近揾到一個【真】問題 —— 而且係規格書嗰個檢查驗唔到嘅

喺 **iPhone SE（375×667，規格書自己寫嘅基準機）** 實測練習頁：

`components/PracticeSupport.tsx` 三粒藥丸（字級／易讀字體／今日夠了）打**直排**，
高 118px，由下而上壓住答題區 —— **四個選項之中有三個被遮住**：

| 選項 | 被遮 |
|---|---|
| A | 0% |
| B | **19%** |
| C | **24%** |
| D | **13%** |

呢個係**縱向遮擋**：闊度由頭到尾都係 375，`scrollWidth === innerWidth` 永遠 true。
規格書全篇檢查都捉唔到。

**改法：** 直排 → 橫排（`flex-col` → `flex-row flex-wrap`），字級滑桿改為浮喺掣
上面嘅 popover（`absolute bottom-full`），唔再參與橫排流。

- 佔用高度：**118px → 34px**
- 三個功能**一個都冇收埋**、冇多一下撳、冇減低可發現性
- 純粹係佔用形狀由「一條直柱」變成「一條橫帶」

**⚠️ 呢項要 Kate 拍板。** 誠實講：橫排令個帶闊咗（右邊界 111px → 312px），
所以**啱啱落喺嗰 34px 帶入面**嘅選項會遮得比以前多；但**會落入嗰個帶嘅捲動位置
少咗七成**。我認為淨值係好咗（一條薄橫帶讀落似工具列，容易一眼略過；一條高柱
壓住句子中間更混亂），但呢個係 UI/UX 判斷，唔係我單方面拍得板嘅嘢。

另外實測確認：**捲動之後全部選項 0% 被遮** —— 呢種浮動掣覆蓋屬短暫、可解，
唔係死鎖。

---

## 四、OpenDyslexic 字體

**之前：** `globals.css` 有 `@font-face` 指去 `/fonts/OpenDyslexic-Regular.woff2`，
但 `public/fonts/` 入面只有一個 README → 每次撳「易讀字體」都行一次 404。

功能其實**冇壞**（`font-display: swap` ＋ 靜靜 fallback 落 BDA 系統字體堆疊），
所以呢個係「攞唔到真字體」，唔係「壞咗」。

**已放入字體檔，出處記錄：**

| 項目 | 值 |
|---|---|
| 來源 | jsDelivr CDN，鏡像 npm 套件 `@fontsource/opendyslexic@5.3.0` |
| 檔案 | `files/opendyslexic-latin-400-normal.woff2` |
| 大小 | 115,280 bytes（≈113 KB，規格書估 150KB） |
| SHA-256 | `f007004af3cda5d8076e57c943f8cc8d00a0da25988b1ae1048683d60e7cac1a` |
| 授權 | **SIL Open Font License 1.1** —— 免費、可商用、可自寄 |
| 檔頭驗證 | `wOF2OTTO` ✓ 真 woff2 |

**冇裝任何 npm 套件**（憲章 §5）。`package.json` 冇多咗嘢，jsDelivr 純粹當成一個
靜態檔案來源。網站執行時零 CDN 請求 —— 字型自寄，CSP `font-src 'self'` 照舊。

### 實測行為

- **英文**用真 OpenDyslexic：`document.fonts.check('16px OpenDyslexic')` = `true`
- **中文自動退回 PingFang TC**：OpenDyslexic 係 latin-only。實測「溫習足跡」經字型
  堆疊同直接用 PingFang TC 量度都係 162px ＝ 逐字退回得乾淨，**冇豆腐格**
- ⚠️ **英文闊咗 28%**（`Handwriting` @40px：OpenDyslexic 318px vs Verdana 248px）

因為闊咗 28%，我**特登開住易讀字體再驗多次 375px**（首頁／`/subjects`／`/reading`／
`/logic-log`／`/account`）—— 全部零溢出。往後改版都要照做，唔可以淨係驗預設字體。

---

## 五、防復發

### 5.1 新閘：`scripts/responsive-guard.mjs`（已入 `npm run qa`，而家 **7 個閘**）

點解用靜態掃描唔用 headless 瀏覽器：Playwright／Puppeteer 都係新套件，
憲章 §5 唔准。靜態掃描零依賴、零成本，攔到嘅係**成因**唔係症狀。

攔四樣嘢：寫死像素闊度（>343px 又冇 `max-w-` 封頂）、`w-screen`／`100vw`、
SVG 寫死 width 又冇 viewBox、全局保險被誤刪。

**閘本身驗證過會叫：** 我特登將首頁改返做 `w-[560px]`，閘即刻捉到並指出行號；
改返之後靜晒。一個永遠唔會叫嘅閘等於冇。

（開發途中閘捉到自己一個 bug：原本個 regex 食咗前面個 `}`，令第二個 `html {}`
區塊配對唔到。已改用 lookbehind。）

### 5.2 全局保險（`app/globals.css`）

```css
html { overflow-x: hidden; overflow-x: clip; max-width: 100%; }
img, svg, video, canvas, iframe { max-width: 100%; }
body { overflow-wrap: break-word; }
```

⚠️ **用 `clip` 唔用 `hidden`：** `overflow: hidden` 會令元素變成捲動容器，
`position: sticky` 嘅子元素會失效 —— `app/relax/components/NowPlayingBar.tsx`
正正用緊 `sticky bottom-4`。`clip` 只裁剪、唔建立捲動容器。先寫 `hidden` 做舊
瀏覽器後備，再寫 `clip` 畀支援嘅覆蓋。

⚠️ **呢層係安全網，唔係修理。** 真正嘅溢出要喺元件度解，靠呢度冚住會令問題喺
舊版 iOS Safari 走返出嚟。所以先修 `page.tsx`，再加保險。

### 5.3 回歸測試：`lib/__tests__/hotfix-0823.test.mts`（5 條）

鎖住：字體檔存在且係真 woff2、全站唔准再出「連續 N 日」、`currentStreak` 唔准
返嚟、練習頁支援掣唔准變返直柱、全局保險唔准被刪。

寫嘅時候第 2 條即刻誤報咗 `components/GoodTodayCard.tsx` —— 嗰句係
「唔記連續日數，唔計次數」，即係**明文講自己冇做連續打卡**。已收窄成必須有
真實數字（`\d+` 或 `${…}`）夾喺中間先算違規，六個案例逐個驗過。
**一句聲明唔做某件事，唔可以當成做咗嗰件事。**

---

## 六、開發側量度（⚠️ 唔等於驗收通過，Kelly 請自行覆核）

判定條件：`scrollWidth <= visualViewport.width` **而且** `innerWidth` 冇被撐大。

### 六個斷點（首頁）

| 斷點 | 版面視窗 | scrollWidth | 被撐大？ | 溢出元素 |
|---|---|---|---|---|
| 375×812 | 375 | 375 | 否 | 0 |
| 375×667（SE） | 375 | 375 | 否 | 0 |
| 390×844 | 390 | 390 | 否 | 0 |
| 412×915 | 412 | 412 | 否 | 0 |
| 768×1024 | 768 | 762 | 否 | 0 |
| 1024×768 | 1024 | 1018 | 否 | 0 |
| 1280×832 | 1280 | 1274 | 否 | 0 |

### 375px 逐頁（大部分開住易讀字體量）

| 頁 | 路由 | 溢出 |
|---|---|---|
| 主頁 | `/` | 0 |
| 科目總覽 | `/subjects` | 0 |
| 儀表板 | `/dashboard` | 0 |
| 溫書地圖 | `/dashboard/report` | 0（13 個 SVG 全部有 viewBox） |
| 練習頁 | `/practice?subject=m2` | 0（KaTeX ×6 全部喺框內） |
| 閱讀頁 | `/reading` | 0 |
| 邏輯日誌 | `/logic-log` | 0 |
| 帳戶頁 | `/account` | 0 |
| 透明度（有表格） | `/transparency` | 0 |

### 建置

| 項目 | 結果 |
|---|---|
| `npm run qa` | **7/7 PASS**（新增 responsive-guard） |
| `npm test` | **545/545**（新增 5 條） |
| `npx tsc --noEmit` | clean |
| `npx eslint app components lib scripts data` | clean |
| `npm run build -- --webpack` | **95 版全綠** |

⚠️ 淨係打 `npx eslint`（唔帶路徑）會報 **12,038 個問題** —— 全部嚟自
`.claude/worktrees/nostalgic-montalcini-a21f8f/`，即係一個 checkout 咗喺 repo
入面嘅 git worktree（＝成份代碼嘅複本）。真源碼係乾淨嘅。已另開 task 處理。

---

## 七、Kelly 驗收清單（**狀態欄留空，等你填**）

### 第一輪：375px 基準

| # | 頁面 | 路由（已修正） | 最終狀態 |
|---|---|---|---|
| 1 | 主頁 | `/` | ⬜ |
| 2 | 致謝名單 | Footer 內（無獨立路由） | ⬜ |
| 3 | 科目總覽 | `/subjects` | ⬜ |
| 4 | 登入頁 | `/sign-in` | ⬜ |
| 5 | 儀表板 | `/dashboard` | ⬜ |
| 6 | 練習頁 | `/practice?subject=…` | ⬜ |
| 7 | 結果頁 | `/result` | ⬜ |
| 8 | 閱讀頁 | `/reading` | ⬜ |
| 9 | 等待頁 | `/waiting` | ⬜ |
| 10 | 邏輯日誌 | `/logic-log` | ⬜ |
| 11 | 帳戶頁 | `/account` | ⬜ |

**每頁請用（唔好用規格書原本嗰句，理由見 §0.1）：**

```js
document.documentElement.scrollWidth <= window.visualViewport.width
```

### 第二輪：開住易讀字體重驗（英文闊 28%）

| # | 頁 | 最終狀態 |
|---|---|---|
| 1 | 主頁 | ⬜ |
| 2 | 練習頁 | ⬜ |
| 3 | 結果頁 | ⬜ |
| 4 | 閱讀頁 | ⬜ |
| 5 | 邏輯日誌 | ⬜ |

### 第三輪：跨斷點

| 斷點 | 最終狀態 |
|---|---|
| 390 / 412 / 768 / 1024 / 1280 | ⬜ |

---

## 八、要拍板嘅事

1. **練習頁支援掣橫排（§3.4）** —— 要 Kate 睇。數字：118px → 34px，
   遮住嘅選項由三個變一個，但嗰一個遮多咗。三個功能一個冇少。
2. **錯因「概念盲區」固定用玫紅** —— 三色圖例嘅類別色，但概念盲區最常見，
   學生會見到好多紅。（上一輪已提，仍未決）
3. **`.claude/worktrees/` 嗰個 worktree 仲要唔要？** —— 見 §六尾。
   `git worktree list` 見到，未經同意我唔會刪。

---

## 九、我冇做嘅嘢（連同理由）

| 冇做 | 理由 |
|---|---|
| 改 Footer 排版 | 實測冇爆（§3.2）。改一個冇壞嘅全站共用組件 ＝ 淨係得回歸風險。 |
| 將 SEN 掣搬去右下角 | 嗰個位有「我好緊張」求助掣（§3.3）。 |
| 起新 FAB 組件 | 已經存在，掛咗喺 `layout.tsx`（§3.3）。 |
| Supabase RPC | 表冇咗，而且撞紅線（§0.4）。 |
| 填 Kelly 驗收表 | 規格書明文話留空。 |
