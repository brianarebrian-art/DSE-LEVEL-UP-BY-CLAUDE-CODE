# 162人總動員指令書 v2.0 — 事實核查報告

- 核查日期：2026-08-14
- 來源：`~/Downloads/dse_level_up_162_army_command_prompt_v2.md`
- 性質：**系統指令**（自稱適用於 Claude Code、Kimi、所有 AI 生成工具），非計劃書
- 方法：filesystem + Supabase 實表（`aegekxapxgcfdrkzisis`）+ 現行代碼比對
- **結論：不予安裝。** 文件自身有 8 處自相矛盾，架構描述與現實相反，SQL 一經執行即為死結構，且推翻了昨日（v1.1）剛完成的多項修正。

---

## 一、最要緊的一點：文件自己犯了自己列出的錯

§十四「KIMI 慣性錯誤防範清單」列出 9 條慣性錯誤。**本文件犯了其中 5 條：**

| # | 清單條文 | 本文件違反處 |
|---|---|---|
| 2 | 出 SQL 動已刪／從未存在表 → 「先查現有 schema」 | §三 以約 500 行 SQL 建立 `question_events`（2026-07-14 已刪）及 `question_bank`／`student_subject_cycles`／`paper_sessions`／`paper_answers`（從未存在） |
| 5 | 虛構統計 → 「事實核查」 | §十二 稱 YY Lam「$5,700 萬合約 + 分紅，年收 $8,000 萬；冇 pen-test doc」—— 具名真人，數字無來源 |
| 6 | 復用舊名／舊功能 | §十五 同時列出「**化城避風港**」與「**JUPAS 預測器**」，兩者均已否決、且昨日 v1.1 剛刪除 |
| 7 | 建議收費 | §八「若 Vercel Edge Requests 首次爆額，**以『提升用戶使用質素』名義**推出 Premium」 |
| 8 | 預填驗收表 → 「禁止自動化」 | §5.2 decisions.json 樣本已預填 `"approved_by": "Amity"`、`"reviewed_by": "Kelly"`、`"term_guard_by": "Oscar"` |

§八 那條尤其要指出：不只是重新引入 Premium（v1.1 已刪兩處），更加上「**以…名義**」的措辭 —— 即指示對外掩飾真實原因。這比單純收費更成問題。

§5.2 亦踩中另一條長期紅線：Amity／Kelly／Oscar 是虛構角色，**虛擬 persona 不得在 `decisions.json` 簽名**，該欄位只供 Brian／Yuna 兩位真人。

---

## 二、🔴 §0.1「GROUND TRUTH — 不可假設」寫錯了架構

| §0.1 聲稱 | 實測 |
|---|---|
| 數據存取「**100% 雲端 PostgreSQL**」，常見錯誤「用 localStorage」 | CLAUDE.md §3：Data = **100% localStorage**（客戶端），61 個檔案依此設計。Supabase 只作 server-side 備份 |
| Auth「Auth.js v5，**非 Supabase Auth**」✅ 正確 | 但 §三 每一條外鍵都寫 `REFERENCES **auth.users**(id)` —— 那正是 Supabase Auth 的表 |

**實測 `auth.users` = 0 行。**

即：§三 全套 SQL 若真的執行，5 張新表的每一次 INSERT 都會違反外鍵約束而失敗。**這套 schema 一 apply 就是死的。** 文件在 §0.1 親自寫下「非 Supabase Auth」，然後在 §三 全篇違反自己這一行。

同時 §0.1 把「用 localStorage」列為常見錯誤 —— 這是 v1.0 的 C-Strict 錯誤，昨日 v1.1 已還原，今日再度出現且升格為「不可假設的 GROUND TRUTH」。

---

## 三、🔴 長答自動批改 —— 第 17 次，且今次升格為紅線

v1.1 已把 M2.1／M2.2 改為「學生自評，無機器打分」。v2.0 不但推翻，還把關鍵字批改寫進**題目 schema 本身**，令每一科每一題都必須攜帶：

| 位置 | 內容 |
|---|---|
| §0.2 學科術語**紅線表** | 「英文：Tone & Register 雙重批改」列為強制規則 |
| §2 中文 JSON | 每個 `marking_scheme` point 帶 `keywords` + `match_type: "any"` |
| §2 英文 JSON | `"trap_check": "blind_copying_detection"` |
| §2 數學 JSON | 每個 step 帶 `keywords`（如 `["x=1/3", "x=-2", "x=0.333"]`） |
| §2 其餘 12 科 | 「每題**必須**有 marking_scheme JSONB」 |
| §4.1 流程圖 | 「即時批改（MCQ + **關鍵字匹配短答**）」 |
| §6 `generateErrorDNA()` | 以 `answerText.length < 10` 判定「概念不懂」，並接收 `markingScheme` 參數 |

`data/questions/types.ts` 的硬性規則：**書寫題永不由機器批改**，亦不計入客觀準確率與等級預測（2026-07-31 Brian 拍板）。

以往此紅線多是出現在某一節；今次是寫進資料結構，一旦採用，之後每一條新題都會自帶關鍵字批改欄位，回頭極難。

---

## 四、🔴 §四 紙筆戰士代碼有四處實錯

### 4.1 `params` 用法錯 —— 照抄即 build 失敗

```tsx
params: { sessionCode: string }        // v2.0 寫法
params.sessionCode.toUpperCase()       // 同步存取
```

本 repo 的 Next.js 中 `params` 是 Promise。現行代碼（`app/subjects/[subject]/page.tsx:17`）：

```tsx
params: Promise<{ subject: string }>
const { subject } = await params
```

### 4.2 async server component 內用 `onClick`

`PaperPage` 是 `async function`（server component），內含 `onClick={() => window.print()}`。server component 無 client handler，此按鈕不會運作。

### 4.3 `QRCodeSVG` 無 import，且需要新套件

文件註明「QR Code 組件（**純 SVG 生成**）」，但 `QRCodeSVG` 是 `qrcode.react` 的匯出。實測 **repo 沒有安裝任何 QR 套件**。新增套件觸及成本／依賴紅線；§八 卻同時把「QR Code 生成 $0 — 純 SVG」列入成本表。

### 4.4 🔴 QR 網址錯 —— 且印上紙後無法補救

```
dse-level-up.vercel.app/paper-mark/{code}     ← v2.0
dse-level-up-by-claude-code.vercel.app        ← 實際網域（app/layout.tsx:16、app/sitemap.ts:20）
```

這是**紙筆**功能：QR 碼印在實體試卷上。網址錯即學生掃出死連結，而紙已印出，無法事後修正。四項之中以此項後果最不可逆。

---

## 五、🔴 §16.1「啟動前必做」要求復建已刪除的系統

| 檢查項 | 現實 |
|---|---|
| 「確認 Supabase 已執行 `0002_teacher_radar.sql`」 | 教師雷達 2026-07-14 一刀斬，相關表已刪且未復建 |
| 「確認 `roles.ts` 已更新」 | `lib/auth/roles.ts` 已隨同刪除 |
| 「確認 seed 第一個 admin 已建立」 | admin 路由已刪 |
| 「Build green（**50 routes**）」 | 實際 **83 頁**；v1.1 已修正，v2.0 倒退 |

照此清單執行，等於把一個已刻意移除的子系統重新裝回去。

---

## 六、🟠 16,000 題目標的算術

實測題庫 **5,201 條 / 25 科**。目標 16,000 → 需新增 **10,799 條**。

生產紀律要求**真人逐題批**，且虛擬 persona 不得簽名 —— 即這批審核只能由 Brian／Yuna 兩位真人完成。

> 10,799 條 × 每條 2 分鐘 = **360 小時**
> 分 12 週（§2.1 Wave 1–3）= **每週 30 小時**

創辦人現況為「業餘娛樂模式，每週一次異步同步」。每週 30 小時純審核與此不相容。

兩條路二選一：**調低題數目標**，或**明確改變審核制度**（後者須 Brian + Yuna 雙簽，因為它動的是「機器永不自動入庫」這條核心紅線）。不能兩者都不動而假設目標可達。

另注：§2.1 只列 16 科，但平台現有 **25 科**；「16 科 × 1,000」的基數本身與現況不符。

---

## 七、🟠 昨日剛修好、今日又倒退的項目

| 項目 | v1.1 修正 | v2.0 狀態 |
|---|---|---|
| 連登滲透 | 改為「坦誠分享 + 標示身份」 | §1.5 回復「**無意中分享滲透**」 |
| Gamification | M2.6 刪除全部解鎖／徽章機制 | §7.4「成就系統：連續答對、完成週期、**解鎖**概念節點」 |
| OpenDyslexic | 標為「🔧 待執行」（字型檔未安裝） | §0.4「SEN 功能狀態：**全部已上線**」—— `public/fonts/` 實際只有 README |
| 錯題 DNA 措辭 | （v1.1 未修，本報告第三次提出） | §6 `detectRepetitivePattern()` 輸出「**代表你無真正理解背後原理**」——指責語氣，違反 §7 大愛設計 |
| 概念網節點 | 修正為 18 節點 | §0.2／§1.2 回復「**29 個概念節點，分五大類**」。實測 3 份檔、18 節點、**11 類**（「五大類」為第 5 次出現的同一虛構） |

---

## 八、🟠 §9.1 `preExecutionCheck` 是空殼

該函數讀取 `task.estimatedCost`、`task.targetAudience`、`task.hasHKEAADirectCopy`、`task.hasRedCross`、`task.hasReverseLock`。

**沒有任何流程會產生這些屬性。** 它以「四關審核」之名呈現為閘門，實際上永遠不會攔到任何東西 —— 傳入 `{}` 即全數通過。`task.targetAudience !== "12-18 DSE"` 更是字串相等比對。

真正在運作的閘門是 `scripts/qbank/term-guard.mjs`、`_gate.mjs`、`validate-banks.mjs`、`i18n-guard.mjs`，全部可執行、會 exit 1。文件應指向這些，而非虛構一個。

---

## 九、🟠 §三 抽題 SQL 的效能問題

`get_random_questions()` 每次呼叫：

- `ORDER BY RANDOM()` 對整個 `question_bank`（目標 16,000 行）全表掃描並排序
- 同一個 `id NOT IN (SELECT … FROM question_events …)` 子查詢重複兩次（Step 4 與 Step 5）

在 Supabase Free tier 上，這是每一次練習都付一次全表排序的代價。若要保留此設計，應改用 `TABLESAMPLE` 或先取候選集再抽樣，並把已答集合改為 `LEFT JOIN … IS NULL` 或 `EXCEPT`。

---

## 十、✅ 文件中正確的部分

不宜連好的一併丟棄。以下與現實相符，值得保留：

- §0.1 無 Drizzle ORM ✅、Auth.js v5 ✅、`proxy.ts` 非 `middleware.ts` ✅、`--webpack` + port 3001 ✅、禁 Chart.js/D3/Recharts ✅
- §0.2 經濟術語紅線（共用品／企業家職能／收入彈性）✅ —— `term-guard.mjs` 已實作
- §0.3 Archetype Masking 與 Footer 免責聲明 ✅ —— 免責聲明已有測試守住（2026-08-13）
- §0.4 禁大紅交叉／「FAIL」✅ —— `term-guard.mjs` RED_WORDS 已實作
- §6.2 正向反饋語句庫 ✅ —— 措辭得體，可直接用（惟 §6.1 的指責語句須刪）
- §十三 免責聲明全文 ✅ —— 與 `lib/dictionary.ts` 現行文案一致

---

## 十一、建議

**不予安裝為系統指令。** 若要保留其價值，建議拆成兩份：

1. **一份真正的 ground truth 摘要** —— 只寫已核實的架構事實（本報告 §十 那批），刪去 §0.1 的 localStorage 反轉。
2. **一份紙筆戰士 2.0 提案** —— 概念本身值得做（離線練習對基層學生有實際價值），但須：
   - 改用現行 localStorage 架構或明確走 `profiles.id`，**不得引用 `auth.users`**
   - 修正 `params` Promise、server component onClick、QR 網址
   - QR 用零依賴自繪 SVG，或改為只印 Session Code + 短網址
   - 移除全部 `keywords` 批改欄位；長答改為出示參考答案供學生自評

§三 的 SQL、§2 的 marking_scheme schema、§6.1 的 DNA 推斷、§八 的 Premium 條款、§16.1 的啟動清單，五項建議整段刪除。

---

*本報告由 Claude 核查產出，未經 Brian／Yuna 簽署，不構成任何項目批准。*
