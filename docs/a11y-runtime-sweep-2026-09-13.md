# 運行時無障礙掃描 —— 2026-09-13

**性質：人手實跑一次嘅量度紀錄，唔係一道閘。**

憲章 §16.D 講明唔可以將 build-time 測試講成 runtime 防護。反過來一樣：
本次掃描喺開發者部機上跑過，**唔等於學生部機上有任何保護**。
佢嘅價值係補一個 `scripts/contrast-guard.mjs` 結構上做唔到嘅嘢 ——
嗰支掃源碼，掃唔到 CSS 變數層層覆蓋之後【實際算出嚟】嘅顏色；
只有真瀏覽器算得到。

**工具：** `scripts/a11y/runtime-probe.js`（純 JS，零依賴 —— 憲章 §5 嚴禁新增套件，
所以冇用 Playwright／Puppeteer）
**環境：** `npm run dev` on **port 3001**、Chromium、`prefers-reduced-motion` 預設
**判準：** WCAG 2.1 AA —— 一般文字 ≥ 4.5:1；大字（≥24px，或 ≥18.66px 粗體）≥ 3:1

---

## 〇、探針自檢（每次掃描之前必跑）

一支未紅過嘅探針，唔知係「冇問題」定係「探針壞咗」。
`__probeSelfTest()` 種四個已知答案嘅元素：

| 種落去嘅元素 | 應該 | 實測 |
|---|---|---|
| `#bbbbbb` on `#ffffff`（1.92:1） | 紅 | ✅ 紅 |
| `rgba(0,0,0,.18)` on `#ffffff`（1.53:1，半透明） | 紅 | ✅ 紅 |
| `#595959` on `#ffffff`（7.0:1） | 綠 | ✅ 綠 |
| `#000000` on `#ffffff`（21:1） | 綠 | ✅ 綠 |

暗色主題下另跑一次：種 `#1a1a20` on `#101014` → 捉到，ratio **1.1**。
呢一步係特意做嘅 —— 上一次掃描暗色主題報 0 失敗，係因為探針壞咗而**碰巧**報 0，
唔係因為冇問題。

---

## 一、對比度 —— 34 條路由 × 2 主題

| | 淺色 `light` | 暗色 `cyber` |
|---|---|---|
| 路由數 | 34 | 34 |
| 掃過嘅文字元素 | 3,192 | 3,192 |
| **AA 失敗** | **0** | **0** |
| 刻意遮蓋（唔算失敗，見下） | 5 | 5 |

兩個主題元素數相同，因為 DOM 一樣、只係 token 值唔同。
逐版數字由實跑逐條記落嚟再相加（`/transparency` 一版就佔 658）——
**唔係估嘅**：初稿我一度寫「3,530」而冇加過，加返實數係 3,192。
憲章 §16.C 禁嘅正正就係嗰個動作，所以連呢句都留住。

逐條路由全部 0 失敗：`/` `/about` `/account` `/answer-sheet` `/bookmarks`
`/capsule` `/community-safety` `/concept-net` `/dashboard` `/dashboard/report`
`/exam-day` `/logic-log` `/methodology` `/notes` `/paper-warrior` `/practice`
`/prediction-method` `/privacy` `/reading` `/relax` `/relax/breathing`
`/relax/grounding` `/relax/group` `/relax/solo` `/result` `/sensei` `/sign-in`
`/sign-up` `/source-lab` `/subjects` `/transparency` `/trust` `/waiting` `/writing`

（`/admin` 重定向去 `/` —— 有權限閘，唔獨立計。）

**主題真係換咗（唔係 attribute 假動作）：** `cyber` 之下 `body` 底色
`rgb(26,25,23)`、字色 `rgb(240,232,220)`；`light` 之下相反。
換主題必須改 `localStorage['dse-theme']` **然後重新載入** ——
開機嗰段 inline script 先係權威，單改 `data-theme` attribute 唔算。

### 5 處「刻意遮蓋」點解唔算失敗

首頁 `BlindTestQuestion` 嘅 `<Black>`：`bg-paper-ink text-paper-ink` ——
前景背景**逐位相同**（ratio 1.00），因為佢係一個「撳咗先睇到」嘅遮蓋數字。

實測逐項核過，唔係靠讀源碼：

| 驗嘅嘢 | 結果 |
|---|---|
| 5 個遮蓋塊全部撳得開 | ✅ |
| 揭開之後探針命中 | **0**（變 `text-paper-warn` 疊 `bg-paper-ink/10`，合格） |
| 揭開之後 `role="button"` 有冇收返 | ✅ 收返（唔會留死 tab 停駐點） |
| 未揭開時有冇鍵盤路徑 | ✅ `role=button` ＋ `tabIndex=0` ＋ `onKeyDown`（Enter／Space）＋ focus ring |
| 有冇 `aria-label` | ✅「顯示被遮蓋嘅數值」 |

探針嘅豁免判斷刻意收得窄：**前景背景 byte-identical ＋ 有 `aria-label` ＋
`role="button"` 三項同時成立**才豁免。意外整出嚟嘅低對比幾乎唔會剛好完全同色。

---

## 二、375px 橫向爆版 —— 34 條路由 × 2 主題

> ### ⚠️ 2026-09-15 更正：本節嘅量法【結構上量唔到嘢】，下面「0 爆版」唔作數
>
> `globals.css` 由 **2026-08-24（HOTFIX-0823）** 起有 `html { overflow-x: clip }` 安全網。
> 頁面層因此【永遠捲唔郁】，闊過屏幕嘅內容係**直接被裁走**，唔會出橫向捲動。
> 本節用嘅 `__ovf()` 淨係靠「`scrollTo(400)` 之後 `scrollX > 0`」判斷 ——
> 喺呢個設定之下 `scrollX` 一定係 0，所以「0 爆版」係**必然結果，唔係量出嚟嘅結果**。
> 同一段文字下面仲寫住「唔可以用 `scrollWidth === innerWidth`」—— 我避開咗一個假陰性，
> 行咗入另一個。探針從來冇紅過，而一支未紅過嘅探針分唔到「冇問題」同「探針壞咗」。
>
> **2026-09-15 重量（有效）：** `__ovf()` 改為量元素 —— 有冇元素伸出屏幕右邊，而佢同
> `<html>` 之間冇任何裁剪／捲動嘅祖先（即係靠 html 嘅 clip 先冚住）。先跑新加嘅
> `__ovfSelfTest()`：直接放嘅 800px 元素 → 捉到；放喺 `overflow-x:auto` 容器入面 → 唔誤報。
> 過咗先掃。375px（`visualViewport.width` 375）：
>
> | 範圍 | 結果 |
> |---|---|
> | 35 條路由（清單同下表；`/admin` 未登入會 redirect 去 `/`） | **0 條內容被 html 安全網裁走** |
>
> 結論恰巧同 09-13 一樣，但 09-13 嗰次冇資格講呢句。
> **限制：** 組件自己用 `overflow-hidden` 裁走嘅內容唔會報（好多圓角卡同裝飾係刻意咁做）；
> 練習頁每次只抽到一條隨機題。長算式呢一類已經由 `.katex-display { overflow-x: auto }`
> （同日加）處理 —— 題庫最長嘅顯示式有 300 幾字元 TeX，375px 一定闊過屏幕，冇呢條
> 規則嘅話係**被裁走**，學生睇唔到算式右半。

**全部 0 爆版。**（⚠️ 見上面更正 —— 呢句喺 09-13 係冇根據嘅）

量法：`visualViewport.width` 實測 **375**（`innerWidth` 報 383 —— 差 8px），
然後喺三個捲動高度各試 `scrollTo(400, y)`，睇 `scrollX` 有冇離開 0。

⚠️ **唔可以用 `scrollWidth === innerWidth` 判斷** —— Chrome 爆版嗰陣會撐大
layout viewport，兩個數照樣相等，係一個必然嘅假陰性。唯一可靠嘅係
**真係捲，然後睇捲得郁唔郁**。

---

## 三、互動狀態（靜態載入掃唔到嘅嘢）

學生時間最多嗰個畫面唔係任何一版嘅初始狀態，所以另外實跑：

| 狀態 | 對比度失敗 | 爆版 | 附帶核實 |
|---|---|---|---|
| `/practice?subject=math` 題目載入 | 0 | 否 | — |
| 答錯後 → 三維自診出現 | 0 | 否 | **冇倒數 UI**（§7.2 實驗狀態正確） |
| 撳錯因後 → 解析攤開 | 0 | 否 | 冇「FAIL」字樣（§7 大愛設計） |
| `A11yPanel` 覆蓋層打開 | 0 | 否 | — |

### 順帶驗返「柔和呈現」嗰個掣

憲章 §7.2 記低過：呢個掣曾經因為 re-entrant（副作用擺喺 `setCalm` updater
入面，而 `dse-a11y` listener 又會 `setCalm`）而撳完彈返原位，
**四條測試全綠但個掣係壞嘅**。今次實撳：

| | 撳之前 | 撳之後 |
|---|---|---|
| `aria-pressed` | `false` | `true` |
| `localStorage['dse_calm_lock']` | （冇） | `1` |

冇復發。

---

## 三之二、掃出並修好嘅一處 —— `/dashboard` 快捷掣行

**「0 橫向爆版」通過，唔代表版面喺 375px 讀得到。** 呢一處就係反例：

`app/dashboard/DashboardPageClient.tsx` 嘅快捷掣行本來係
`<div className="flex items-center gap-2">`，四個掣。375px 之下 flex 把佢哋
壓到 **75–82px 闊**，中文標籤逐字斷行：

| 掣 | 修正前闊度 | 行數 | 字／行 |
|---|---|---|---|
| 考試日管家 | 82px | 4 | 1.3 |
| 我嘅收藏 | 75px | **5** | **0.8** |
| 今晚唔溫得 | 82px | 4 | 1.3 |
| 繼續練習 | 81px | **5** | **0.8** |

四個字排成五行。**冇任何現有檢查會嗌**：`responsive-guard.mjs` 掃源碼
爆版風險、`scrollX` 探針量橫向捲動，兩者都通過 —— 因為佢真係冇爆版，
佢只係讀唔到。

**修正：** 加一個 `flex-wrap`。修正後 113–127px 闊、標籤單行、2×2 排列，
桌面（824px）實測仍然同一行，設計語言零改動。

**點解唔用 `overflow-x-auto`：** 橫向捲動會令第四個掣（「繼續練習」——
呢一行最重要嗰個）喺窄機收埋咗。換行乜都見到。

⚠️ **冇加自動化迴歸鎖。** 一條 grep 某個 class 字串嘅測試太脆（改個
class 名就假紅／假綠），而真正量得到嘅方法要無頭瀏覽器，即係新套件（§5）。
所以只喺代碼加咗一段解釋點解 `flex-wrap` 唔可以剷。**呢個係一個已知缺口。**

---

## 四、桌面闊度補掃

375px 掃唔到桌面專屬版面，所以文字量最大嗰 7 版另跑一次
（`innerWidth` 824）：`/transparency`（654 個元素）`/reading` `/` `/subjects`
`/methodology` `/notes` `/writing` —— 兩個主題各 **0 失敗**。

---

## 五、本次掃描唔涵蓋嘅範圍（講清楚，免得被當成「全站已保證」）

- **只係 2026-09-13 一次快照。** 冇任何機制阻止下一個 commit 改壞 ——
  要有，就要一支無頭瀏覽器，而嗰個係新套件（§5）。
- **冇量 focus ring 嘅對比度**（WCAG 1.4.11 非文字對比）。
- **冇量動畫頻率。** 3Hz 閘一直係 build-time（`sen-accessibility.test.mts`），
  §16.D 判例已經記低：唔可以講成 runtime 攔截。
- **只試過一條互動路徑**（答錯 → 自診 → 解析）。答啱嘅分支、
  時間囊、SOS 對話框等未逐個試。

## 重跑

```bash
npm run dev
```

然後喺 DevTools Console：貼晒 `scripts/a11y/runtime-probe.js`，再跑
`__probeSelfTest()` → `__probe()` → `__ovf()`。
換主題：`localStorage.setItem('dse-theme','cyber')` 之後**重新載入**。
