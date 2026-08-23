# Originkit UI／UX 指令 —— Phase 1 衝突報告（read-only）

> 對象文件：`dse-level-up-uiux-originkit-prompt.md`（自述為「DSE LEVEL UP Design System Engine, Originkit Edition」）
> 稽核日期：2026-08-22　·　方式：逐項對 filesystem 實物同 CLAUDE.md 條文，不憑記憶、不憑文件自述
> 憲章 §4：超過 3 個檔案嘅變更，必須先出 Phase 1 影響報告，等 Brian／Yuna greenlight 先准執行
> **本報告冇改動任何產品代碼。**

---

## 零、一句總結

呢份文件係一份**完整、寫得好細緻嘅設計系統**，但佢嘅**核心身分係「競技場 × 遊戲化」**——
Combo 火焰、XP 條、Boss 血量、Rank 徽章、排行榜、虛擬貨幣。
而呢一整套，正正係本平台 **2026-07-20 親手剷走並喺代碼入面寫低理由**嘅嘢。

剝走遊戲化之後，文件仲有五樣真正有價值嘅純 CSS 視覺資產，值得單獨拎出嚟用。
其餘部分要麼踩紅線，要麼講錯咗本平台嘅實際架構。

**判斷：不可整份執行。可執行部分見第六節。**

---

## 一、踩憲章永久紅線（§8「復建 = 不合格」）

呢啲唔係「意見不同」，係代碼入面留低咗剷走紀錄嘅嘢。

### 1.1 遊戲化全家桶

| 文件章節 | 要求 | 代碼實證 |
|---|---|---|
| §2.6 Combo Flame Bar | 連擊火焰條，×5 轉黃、×10 轉粉兼加速 | `app/relax/components/SoloPlayer.tsx:166` — 「遊戲術語清除：『回藍／refill MP』『Buff』『combo』→ 中性描述」 |
| §3.3 Progress & XP Bars | XP 條、升級爆炸 | `components/DailySpectrum.tsx:10` — 「大愛紅線：無 XP／升級／通關／血量字眼」 |
| §4.2 Dashboard | Streak Counter、XP Leaderboard | `components/Navbar.tsx:27-28` — 「排行榜 (leaderboard) removed 2026-07-20 — it was a fabricated-student gamification leaderboard (fake ranks + 🔥streak + fake stats), a §禁 gamification + §禁虛構 red line」 |
| §4.4 Boss Battle Mode | Boss 血量條、Boss 反擊、擊破動畫 | 同上；`DailySpectrum.tsx:10` 明文禁「血量」字眼 |
| §4.5 Result Page | Rank 徽章旋轉、level-up banner、金屬環進化 | 同上 |
| §4.7 減壓緩衝區 | 虛擬貨幣、HHA 評分系統、家具擺放 | 憲章 §8「允許：減壓緩衝區放鬆功能，必須 $0 成本，**與 gamification 劃清界線**」 |

憲章 §8 原文：**「Gamification（EXP / 段位 / combo / 火焰 / 解鎖機制）」已被徹底否決，復建 = 不合格。**

### 1.2 Premium

- §1.1 色彩表：`--aurora-purple` 用途寫住 **"Premium hints, unlocks, rare rewards"**
- §10 Anti-Patterns：**"Platform is 100% free. Premium is emergency-only."**

憲章 §1.3：**絕對免費原則（至 2027 DSE 前）… 嚴禁建議收費模式、Premium、訂閱。**
「emergency-only」都係 Premium。呢個 token 一入 design system，日後每個新頁都會有個「紫色 = 付費」嘅語意位等緊人填。

### 1.3 用戶對用戶

§4.7：**"Memory wall: Floating image wall with user achievement screenshots"**

2026-08-21 你拍板：**永不做用戶對用戶。** 影子溫書室打氣牆當時已經建好，最後亦係 gate 住冇上線。
「其他學生嘅成就截圖」係 UGC + 社交比較，兩樣都喺線外。

### 1.4 自動情緒偵測

- §2.1：「On anxiety detection (3 wrong answers): particles slow to 40s」
- §4.4：「Anxiety detection: 3 wrong answers → auto-disable combo flame, slow particles, show calming message」

現行設計係**學生自己講**（`components/EmotionTags.tsx`、情緒溫度計），唔係機器判。
「答錯三條 = 焦慮」係一個未經驗證嘅行為推論：可能係佢揀緊難題練、可能係佢喺趕時間。
機器一旦開始替學生標籤情緒狀態並改變介面，就進入咗醫療性判斷嘅範圍，而我哋冇任何依據去做呢個判斷。

---

## 二、對本平台架構描述錯誤（照做會反向改壞）

| 文件寫 | 實況 | 證據 |
|---|---|---|
| §8「Database: Supabase PostgreSQL \| 100% cloud, **ZERO localStorage for business data**」 | **完全相反。** 學習數據 100% 喺 localStorage，Supabase 只做 server-side 備份 | `lib/progress.ts:1` — "Client-side learning-progress store (localStorage)"；CLAUDE.md §3「Data: 100% localStorage（客戶端），Supabase 只作 server-side 備份」 |
| §4.6「Admin / **Teacher** Dashboard」、K-anonymity 指標 | **老師平台 2026-07-14 已一刀斬。** `app/teacher` 唔存在。`app/admin` 存在，但係草稿覆核面板，唔係老師儀表板 | `ls app/teacher` → No such file；憲章 §8「老師平台 / IEP 草案（classes/enrollments/question_events 已刪）」 |
| §6.1「Progress saved automatically **every 10 seconds**」 | 配合上面「100% cloud」一齊做 = 每個用戶每 10 秒一次 DB 寫入 | 憲章 §5：每月總技術成本**死鎖 US$200 以內**。呢個寫入頻率冇成本估算就寫入 spec，係預算風險 |
| §1.1 四色 `#00E5C9 / #FF2D7A / #FFE15C / #A855F7` | 憲章 §14 同代碼係 `#00F5D4 / #FF006E / #FEE440 / #9B5DE5` | `app/globals.css:14-17` |

### 2.1 換色會作廢一份已完成嘅無障礙審核

`app/globals.css:88-97` 逐個 token 記低咗實測對比度：

```
ink       #E8ECF4 → 15.90:1  AAA
ink-soft  #D4DAE6 → 13.42:1  AAA
ink-muted #9CA3AF →  7.42:1  AAA
accent    #00F5D4 → 13.46:1  AAA
⚠️ 實心掣刻意用【深色字】on 霓虹青（13.46:1）。白字 on #00F5D4 只有 1.40:1，
   等同睇唔到 —— 呢個係最易踩的陷阱，改色前必須重新計算。
霓虹粉 #FF006E（4.91:1）與紫 #9B5DE5（4.56:1）僅達 AA 下限，只可用於大字、
圖示與裝飾，不得用作長段正文。
```

文件只列 hex，冇一個對比度數字。照換色 = 全部重新計過，而且文件冇講明佢嘅色達唔達標。

### 2.2 字體：四套新字型，其中兩套係 CJK

§1.2 要求按科目切換 `Playfair Display`、`JetBrains Mono`、`Noto Serif TC`、`Noto Sans TC`。

現時只載一套 `Inter`（`app/layout.tsx:2`，next/font 自寄），OpenDyslexic 已自寄（`globals.css:345`）。

**CJK 字型檔大細係拉丁字型嘅幾十倍**，而且冇得好好 subset。我哋嘅學生好多用平價手機同有限數據。
文件將字型當作純美學選擇，冇提過呢個代價。呢個係技術問題，唔係紅線問題，但要有數先好決定。

---

## 三、同已署名嘅現行文件正面相撞

| | `kate-uiux`（現行） | Originkit（新） |
|---|---|---|
| 版本 | 2026-07-18-**FINAL** | 自述 Master |
| 署名 | Kate Law + Leo Tsang + Emma Ng + **Yuna** | 無 |
| 方向 | **Light-first「清晨圖書館」** | 「White/light mode default」列為 **Anti-Pattern**，只准暗色 |

兩份都話自己權威。代碼現時支援雙主題（`:root` Light + `:root[data-theme='cyber']` 深夜霓虹），
即係實際上行緊 kate-uiux 嘅 Light-first + 可切換。

**呢個唔係我可以自己揀嘅。** 邊份作準，要你同 Brian 定。

---

## 四、文件自身嘅內部矛盾

### 4.1 一邊禁 emoji，一邊規定 emoji 文案

- §8 技術表：「Icons \| Lucide React \| **FORBIDDEN: Emojis as icons**」
- §9 檢查表：「**No Emoji Icons**: Lucide icons only」
- 但 §7.2 禁用詞表規定用「**再諗下💡**」「你發現咗一個新盲點」
- 但 §4.4 規定「你發現咗一個新盲點**💡**」
- 但 §4.2 規定「今日進度：**🔥** 3/20 題」

憲章 §7 有做呢個分辨，文件冇：**功能性圖標用 lucide，情感層可以用 emoji。**
呢個分辨我 2026-08-22 已經照憲章實施咗（commit `9be1f5a`：功能性 emoji 轉 lucide，情感層原封不動）。
文件如果照字面執行，會連 `TodayNote.tsx:97`、`EmotionTags.tsx:36` 嘅情感層 emoji 都剷埋——
而嗰啲正正係憲章 §7 明文要求嘅嘢。

### 4.2 一邊話唔嚇學生，一邊要求答錯震屏

- §6.3 焦慮友善：「NO red warning colors… never alarm」
- 但 §4.4 Boss Battle：「Wrong answer: 'Boss 反擊' — **gentle screen shake**」
- 同 §2.5：答錯彈粉紅色衝擊波

答錯之後畫面震——就算「gentle」——都係一個負面驚嚇回饋。憲章 §7 要求答錯係「你發現咗一個新盲點」，
唔係「你被反擊」。呢兩樣喺同一份文件入面共存，代表寫嗰陣冇對過 §7。

### 4.3 一邊禁 JS 動畫，一邊要求 JS 動畫

§8 寫「Animation: CSS transitions + keyframes **ONLY**」，但 §2.4 Grid Cursor Tracker 要求
「SVG + JS, throttled 16ms, mousemove handler」。自相矛盾，不過影響輕微。

---

## 五、已經做咗嘅（照做 = 重做）

| 文件要求 | 實況 | 證據 |
|---|---|---|
| §5 60 秒逆向鎖死引擎 | **已上線** | `components/HourglassTimer.tsx`（沙漏取代倒數，deadline 制防漂移）、三維自診已接線 |
| §6.4 OpenDyslexic + 閱讀尺 | **已上線** | `globals.css:345` 自寄字型、`components/ReadingRuler.tsx` |
| §6 SEN 全套 | **已上線** | `A11yPanel`（一鍵舒適模式）、`GlobalA11y`、`BreathingExercise` |
| §6.3「我好緊張」→ 4-7-8 呼吸 | **已上線** | `app/relax/components/BreathingExercise.tsx`，三種節奏 + 語音引導 + reduced-motion 降級 |
| §8 圖表純 SVG，禁 Chart.js/D3/Recharts | **已符合** | `components/RadarChart.tsx`、`ErrorRadar.tsx` 純 SVG；`package.json` 冇任何圖表庫 |
| §8 禁 Framer Motion / GSAP / Lottie / Three.js | **已符合** | `package.json` 全部 dependencies：`@supabase/supabase-js, better-auth, html2canvas, katex, lucide-react, next, next-auth, pg, react, react-dom` |
| §9 Footer HKEAA 免責 | **已上線** | `components/Footer.tsx:115` |
| §9 No Emoji Icons | **已完成（按憲章 §7 分層）** | commit `9be1f5a` |
| §1.4 reduced-motion 全域尊重 | **已上線** | `globals.css` 五處 `@media (prefers-reduced-motion: reduce)` |

### 5.1 一項直接衝突嘅「已做」

§4.2：「**NEVER show raw percentages.** Use:「今日進度：🔥 3/20 題」」

現時 `app/dashboard/DashboardPageClient.tsx:175` 同 `:396` 都顯示準確率百分比。
呢個要唔要改係產品決定，唔係紅線 —— 但要留意文件建議嘅替代寫法（🔥 + 分數）本身帶住 streak 火焰。

---

## 六、真正可以用嘅部分（$0、純 CSS、零紅線）

文件入面有五樣視覺資產，同遊戲化冇必然關係，剝離出嚟就用得：

| 資產 | 文件章節 | 可落地位置 | 成本 |
|---|---|---|---|
| Scatter title 進場動畫 | §1.2 | 首頁 hero、科目頁標題 | 純 CSS keyframes，$0 |
| Particle field 點陣背景 | §2.1 | 儀表板、練習頁底層 | `background-image` + `animation`，$0 |
| 3D 卡片輪播 | §2.2 | `/subjects` 科目選擇 | `perspective` + `preserve-3d`，$0 |
| Grid cursor tracker | §2.4 | 結果頁雷達圖背景 | SVG + rAF，$0（觸控裝置停用） |
| Metallic ring | §2.3 | Loading 指示、Logo | SVG `linearGradient` + rotate，$0 |

**落地條件（我建議寫入執行單）：**
1. 一律套現行 `#00F5D4` 色系，**唔換 hex**，保住 `globals.css:88-97` 嗰份實測對比度
2. 全部要有 `prefers-reduced-motion: reduce` 降級（同現有五處一致）
3. Particle field **唔綁 combo**，速度固定；SEN 模式隱藏（呢點文件 §2.1 本身都有寫）
4. Metallic ring **唔可以做 rank badge**，只做 loading／logo
5. Scatter title **唔用喺題目正文同解析**（文件 §1.2 亦已註明）

---

## 七、要你同 Brian 決定嘅三件事

CLAUDE.md 文末：**「任何更新須經雙人簽署。」** 以下三項超出我可以自己判斷嘅範圍。

**決定一：kate-uiux（Light-first 清晨圖書館） vs Originkit（Dark-only 競技場），邊份作準？**
　□ 維持 kate-uiux　□ 改行 Originkit　□ 兩者合併（要寫明點合）
　簽署：Yuna ______　Brian ______

**決定二：憲章 §8 gamification 禁令，維持定解除？**
　（維持 = 上面第一節七項全部唔做；解除 = 要先改 CLAUDE.md §8，我先至可以做）
　□ 維持　□ 解除（需列明解除範圍）
　簽署：Yuna ______　Brian ______

**決定三：憲章 §1.3 絕對免費 / §8 收費永久否決，維持定解除？**
　（影響 §1.1 `--aurora-purple` 嘅 Premium 語意）
　□ 維持　□ 解除
　簽署：Yuna ______　Brian ______

**在三項簽妥之前，我只會執行第六節嘅五項視覺資產，而且要你另外開聲叫我做。**

---

## 八、順帶交代：題庫進度

呢份報告係 read-only，冇郁過題庫。未完成嘅工作停喺：

- 補底 **317 條全部完成**，25 科全部派得出憲章 3:5:2（由 6 科唔達標 → 0 科）
- 模板替換 **106 / 1,172**（化學 22、經濟 84 已入庫並接線）
- 書寫題 **0 / 524**（實測數，非早前報嘅 492 —— 因為 1:10 係相對比例，MC 增加令目標一齊升）

全部已 commit，**未 push**。

---

*報告人：Claude Code　·　2026-08-22　·　本報告未改動任何產品代碼*
