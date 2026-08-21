# UI／UX 整改方案 —— Phase 1 逐項對碼（read-only）

> 對象文件：`DSE_Level_Up_UI／UX_整改與優化方案.md`（文件自述由 Manus AI 整理）
> 稽核日期：2026-08-21　·　方式：逐項對 filesystem 實物，不憑記憶、不憑文件聲稱
> 憲章 §4：超過 3 個檔案嘅變更，必須先出 Phase 1 影響報告，等 Brian／Yuna greenlight 先准執行。
> **本報告冇改動任何產品代碼。**

---

## 一、先講最重要嗰句：方案入面嘅 P0，大部分已經上線咗

方案把「Design Tokens、信任中心、非官方聲明、私隱說明」列為第 1 週 P0。
逐項對過代碼，呢批嘢喺 2026-07-16 至 07-30 已經做完。若照文件當 to-do list 執行，
等於重做已完成嘅工作，並且有機會覆蓋咗當時做過對比度實測嘅數值。

| 方案項目 | 實況 | 證據 |
|---|---|---|
| §3.2 全站 Design Tokens | **已完成** | `app/globals.css` `@theme`：霓虹四色 + Light／Cyber 雙主題語意 token（surface／ink／accent／line） |
| §6.3 對比度達 WCAG AA | **已完成並實測** | globals.css 註釋逐個 token 記低三底面最差值：ink 15.91、ink-soft 12.59、ink-muted 5.93、accent 5.83／淡底 4.67；`ink-faint` 2.43 明文標為「刻意保留，只准用於 1.4.3 豁免嘅停用控件同 aria-hidden 裝飾」 |
| §2.2 信任中心 | **已存在** | `/trust`（＋`/transparency` `/methodology` `/privacy` `/accessibility` `/prediction-method` `/community-safety` `/about`），Footer 全部連得到 |
| §2.1 唔可以有未證實宣稱 | **已鎖死** | 憲章 §8 永久攔截虛構統計／假見證／假在線人數；本輪覆核冇發現任何一項 |
| §9「首頁數字要有來源」 | **已完成，而且做法比方案更嚴** | `/trust` 同首頁嘅題數係**即時由題庫算**。兩處代碼都留咗同一句註釋：硬編一個「5,201」落去，加減題嗰日就會靜靜哋講錯 |
| §6.3 reduced-motion | **已完成** | `globals.css` 五處 `@media (prefers-reduced-motion: reduce)`；`app/page.tsx` 亦有 JS 層檢查 |
| §6.4 SEN 控制 | **已上線** | `A11yPanel`（一鍵舒適模式）、`ReadingRuler`、OpenDyslexic 自寄字型、`GlobalA11y` |
| §5.6 資料清除 | **已完成** | `/account` PDPO 抹除、`DataPortability`、`StoredDataInspector` |
| §5.3 限時模式應為可選 | **已完成** | `HourglassTimer` 沙漏（deadline 制）取代高壓倒數；`BlindTestQuestion` 為獨立模式 |
| §3.1 改用 Lucide 圖標 | **套件已裝** | `lucide-react` 已在 `dependencies`，56 個檔案用緊 —— 唔屬憲章 §5 嘅「新增套件」 |
| §5.4「弱項雷達圖要小心」 | **立場一致** | `RadarChart`／`ErrorRadar` 只食 localStorage 真實 topicStats，冇能力診斷包裝 |

---

## 二、真正嘅缺口（五項，全部已核實）

### ~~缺口 1：「報告題目問題」喺練習頁完全唔存在~~ —— **本條寫錯咗，已更正**

> **2026-08-21 更正：呢一條係我核錯。** 報錯入口一直都存在，喺
> `components/QuestionProvenance.tsx`（同日 commit `77769aa` 上嘅），
> 而且喺 `PracticeSession.tsx:879` 同 `:914` 兩處都有 render ——
> 即係答啱答錯兩條分支都出得到。
>
> 出錯原因：我當時只 grep 咗 `app/practice/`、`app/result/` 同
> `StagedExplanation.tsx` 三個位就落結論「冇任何入口」，冇 grep
> 真正裝住佢嗰個元件。**檔案範圍窄過結論範圍**，係呢一次稽核最直接嘅教訓。

實際仲欠嘅係三樣（已於 commit `0218f64` 做完）：

1. **mailto 會靜默失敗** —— 冇設定郵件程式嘅裝置撳落去乜都唔會發生，
   學生以為報咗其實冇。新版永遠攤開報告全文，唔靠郵件程式一樣寄得出。
2. **收藏／錯題頁冇入口** —— 重溫嗰陣先發現問題係常見情況，
   之前要記住題號返去練習頁先報得到。
3. **分類寫喺信件內文叫學生自己刪** —— 多數人唔會刪，收到嘅報告冇得分流。
   改為七個掣仔逐個揀。

### 缺口 2：冇 route-level `loading.tsx` ／ `error.tsx`

方案 §4.2 要求四種狀態齊全。實測全站只有 `app/global-error.tsx` 同 `app/not-found.tsx`，
**冇任何一條路由有自己嘅 loading 或 error 邊界**。`PracticeSession.tsx:693` 嘅載入狀態
係一句純文字「載入中…」，`components/Skeleton.tsx` 存在但未鋪到主要路由。

### ~~缺口 3：導覽係 6 個平排入口~~ —— **已完成（2026-08-21）**

原本寫「要 founder 揀邊個降級」。Yuna 回覆「立即做埋」，即由我拍板，記錄如下。

**真正嘅理由唔係「方案叫收就收」，係量出嚟嘅：**

| | 連結組 natural 闊度 | 橫向條斷點 | 後果 |
|---|---:|---|---|
| 收斂前（6 條） | **1,020px** | `xl` 1280px | 全部平板同細 mon 手提電腦淨係得漢堡選單 |
| 收斂後（4 條） | **815px** | `lg` 1024px | 多咗一整個裝置級別攞返真正導航 |

實測 1024px 下中英文都唔斷行（`getClientRects().length === 1`）、冇 overflow；
1023px 乾淨咁跌返落漢堡。

**四條：** `/subjects`、`/dashboard`、`/bookmarks`、`/notes`

**降級三條：**
- `/methodology`、`/about` —— 本來已經喺 Footer，剷出導覽零成本
- `/paper-warrior`（紙筆戰士）—— 佢係一種**練習模式**，唔係「進度」「收藏」嘅同級物。
  降級唔等於收埋：已同時擺入科目總覽頁（Printer 圖標）同 Footer「練習」欄。

**升上嚟：** `/bookmarks` —— 佢本來喺全站導覽入面**一個入口都冇**。

桌面第四條係「知識凝結」而手機底欄係「帳戶」，呢個唔一致係刻意嘅：
桌面右上角已經有 Google 登入掣，再放「帳戶」係重複；手機底欄嗰四格拇指範圍
之內就冇登入掣。

### 缺口 4：冇手機底部導航

方案 §6.1。實測 `Navbar` 係 `fixed top-0`，手機用漢堡選單（已有 `aria-label`、已有 44px 觸控高度）。
底部導航會改善單手操作，但要同已上線嘅浮動按鈕（SOS／呼吸空間／A11y）爭安全區位置 ——
root layout 已設 `viewportFit:'cover'` 同 safe-area，加底欄要重新排一次。

### 缺口 5：193 個 emoji 散落各處

方案 §3.1 建議以 SVG 圖標取代。lucide 已裝，技術上冇障礙。
但要留意憲章 §7：UI 情感層**准用**廣東話同表情（「你發現咗一個新盲點💡」），
一刀切剷走 emoji 會削弱大愛設計嗰層。建議只換「功能性圖標」，保留情感層。

---

## 三、方案入面要 founder 拍板 ／ 同憲章有張力嘅項目

| 方案項目 | 問題 | 建議 |
|---|---|---|
| §2.3 買 `.hk` ／ `.com` 域名 | 屬**經常性支出**。憲章 §5 每月總技術成本死鎖 US$200，`scripts/budget-guard.mjs` 同步 | 唔屬技術決定，founder 拍板。域名本身唔會帶來信任，方案自己都咁講 |
| §3.1 引入 Noto Sans TC | CJK 字型檔以 MB 計，會明顯拖慢首屏；現時中文行系統字型（PingFang TC／微軟正黑），本身可讀 | **建議唔做**。收益細，代價大，SEN 用戶已有 OpenDyslexic 自寄字型 |
| §8 P2「智能推薦」 | 若指外部 AI API，直接觸憲章 §5 禁付費 API | 只准 $0 本地實作（現有 `ReviewScheduler` 艾賓浩斯 1/3/7/14/30 已係呢類） |
| §8 P2「分享進度卡」 | 已經有 —— `/dashboard/report` 溫書地圖，html2canvas 導 PNG，純 localStorage | 已完成，唔使再做 |
| §5.4「今日建議」 | 已有 `DailyPlan`、`DailySpectrum`、`GoodTodayCard`、`TodayNote` | 屬重組而非新建 |

另外一點要講明白：呢份文件係 AI 整理嘅**提案**，唔係已核實嘅現況報告。
佢對本平台現狀嘅描述有相當部分過時（把已上線嘅 P0 當未做）。
應當作「值得參考嘅檢查清單」，唔應當作「待辦事項逐條執行」。

---

## 四、建議嘅執行次序（等 greenlight）

| 次序 | 工作 | 檔案影響 | 點解排呢個位 |
|---|---|---|---|
| **1** | 練習頁／解析頁加「呢條題有問題」入口 | 約 3–4 個 | 唯一一個**直接改善題庫質素**嘅 UI 改動。題庫 5,000+ 條，學生係最密嘅一張網 |
| **2** | 主要路由補 `loading.tsx` ／ `error.tsx` | 約 6–8 個 | 純加檔，唔改現有邏輯，風險最低 |
| 3 | 手機底部導航 | 約 4–6 個 | 要重排 safe-area，同浮動按鈕有衝突，需要真機驗證 |
| 4 | 導覽收斂 | 約 2–3 個 | 要 founder 先決定邊兩個功能降級 |
| 5 | 功能性 emoji → lucide | 幾十個 | 收益細、觸及面廣，排最後；情感層 emoji 保留 |

**建議由第 1 項開始，做完一項驗一項**，唔好照方案嘅「四週節奏」一次過推 ——
呢個平台嘅 P0 大部分已經喺線上，一次過大改嘅風險高過收益。

---

*本報告只做核對，未改任何產品代碼。要開始邊一項，等 Brian／Yuna 講。*
