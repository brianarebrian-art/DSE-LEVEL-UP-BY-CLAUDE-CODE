# Phase 1 影響評估 —— A2(c)／C1(a)／F1(a)

> **性質：read-only 審計。代碼一行都冇改。** 憲章 §4：超過 3 個檔嘅變更，
> 要先出 impact report，等 Brian／Yuna greenlight 先入 Phase 2。
>
> 三項嘅選項立場已記錄喺 `docs/DECISIONS-ux-audit-2026-09-20.md`，
> **但嗰度嘅簽名欄仍然 ⬜** —— 本報告唔構成 greenlight，只係 greenlight 之前嗰步。
>
> 下面所有數字同 `file:line` 都係 2026-09-21 實跑或實讀，指令列喺每節尾。

---

## 摘要

| | 改幾多個檔 | 最大風險 | 有冇嘢要你另外拍板 |
|---|---|---|---|
| **A2(c)** 兩張卡並存 | 5–6 | 錯因卡可以冇嘢可寫（學生冇答錯／冇自診） | 有：卡上用唔用霓虹色 |
| **C1(a)** 題庫載入唔再永遠轉圈 | 4–5 | 「之前做過嘅科目」冇現成資料源 | 有：用邊個 key |
| **F1(a)** 由錯因揀題 | 7–8 | `CMD_RE` 係 `/g`，用 `.test()` 會隔條漏 | 冇 |

**一個貫穿三項嘅發現：F1 比報告估嘅細好多。** 佢唔使起一個新嘅揀題引擎 ——
現有 `mode='weakness'` 已經示範咗做法：**只改排序，唔掂分層**，
所以 3:5:2 係結構上保住，唔係靠承諾保住（`PracticeSession.tsx:175-183`）。

---

# A2(c) —— 兩張卡並存，由學生揀

## 現況

`components/ShareStatsCardButton.tsx:66` 寫死咗 `<DailyStatsCard>`，
冇任何揀卡嘅位。`app/result/ResultPageClient.tsx:202` 砌好一份
`DailyStatsCardData` 直接傳落去。

html2canvas 影嘅係一個 `position:fixed; left:-99999` 嘅 off-screen 節點
（`ShareStatsCardButton.tsx:65`），**唔可以用 `opacity:0`** —— 檔頭寫明
html2canvas 會尊重 opacity 而影出一張白卡。兩張卡並存要照跟呢個限制。

## 要改嘅檔

| 檔 | 改乜 |
|---|---|
| `components/CauseCard.tsx` | **新檔** —— 錯因破解卡 |
| `components/ShareStatsCardButton.tsx` | 加一個 `variant` prop，off-screen 節點按 variant 換 |
| `app/result/ResultPageClient.tsx` | 砌第二份卡資料；加揀卡 UI |
| `lib/dictionary.ts` | 新文案，中英各一份 |
| `lib/__tests__/share-card.test.mts` | **新檔** —— 鎖住「錯因卡唔准印分數」 |

**5 個檔**（3 改 2 新）。加埋揀卡 UI 如果要獨立組件就 6 個。

## ⚠️ 一個要你拍板嘅設計問題：錯因卡可以冇嘢可寫

錯因卡嘅內容來自 `dse_reverse_log`（`lib/reverseLog.ts:11`），
而嗰個 log **只喺學生答錯之後、撳咗三維自診先會有記錄**。

即係話以下三種情況，張卡係空嘅：

1. 全對 —— 一個錯都冇。
2. 答錯咗但冇撳錯因（自診唔係強制，§7.2 剷咗個鎖之後更加唔係）。
3. 舊記錄：`dse_reverse_log` 上限 **200 條**（`reverseLog.ts:CAP`），
   做得密嘅學生，今日之前嘅會被擠走 —— 但呢張卡只講今日，影響細。

**唔可以靠估填。** 憲章 §8 禁虛構統計。三個做法：

- **(甲)** 冇錯因就唔畀揀錯因卡（掣變灰，旁邊一句「今日冇錯因紀錄」）
- **(乙)** 冇錯因就出一句真嘅替代文案（例如「今日全對」）
- **(丙)** 冇錯因就唔出揀卡 UI，直接回落現有戰績卡

我傾向 **(甲)** —— 佢唔會令一個全對嘅學生以為自己漏咗啲嘢，
亦唔會靜靜哋換走佢揀過嘅嘢。

## ⚠️ 第二個要拍板嘅：張卡用唔用霓虹色

`components/DailyStatsCard.tsx:33` 同 `ResultPageClient.tsx:192-193`
用緊 `--color-neon-*` 畫導出卡 —— html2canvas 鎖定標準色版，唔跟用戶 A11y 變數走。

`docs/charter-inconsistency-draft-2026-09-16.md` 第二項建議嘅條文係
「霓虹四色**只保留喺導出圖卡**」。你 2026-09-21 揀咗「同意」。
新卡屬於導出圖卡，所以照條文係可以用霓虹 —— 但嗰項仲未雙簽。

**兩個選擇：** 新卡跟現有戰績卡用霓虹（一致），
定係新卡用莫蘭迪（同網站一致，同分享出去嘅觀感唔同）。

## 重跑

```bash
grep -n "DailyStatsCard" components/ShareStatsCardButton.tsx
grep -n "CAP" lib/reverseLog.ts
grep -rn "color-neon" components/DailyStatsCard.tsx app/result/ResultPageClient.tsx
```

---

# C1(a) —— 題庫載入唔再永遠轉圈

## 真正壞喺邊（同報告講嘅唔完全一樣）

報告話「`fetchVersion` 冇 timeout」。呢句啱，但**唔係主因**。

`lib/questionCloud.ts:133-138` 已經有 try/catch：離線／DNS 死就回落 cache，
再唔得就回 `null`，由 caller 回落靜態 chunk。檔頭仲明寫「攞唔到雲端係一個
【預期之內】嘅狀態，唔係例外」。**雲端呢條路已經安全。**

真正會吊死嘅係**靜態 chunk 嘅 `import()`**：

```
data/questions/load.ts:22-40   math: Promise.all([ import(...) × 8 ])
app/practice/PracticeGate.tsx:63,65   .then(...)   ← 冇 .catch
```

chunk 未 cache ＋ 冇網 → `import()` reject → `.then` 永遠唔行 →
`mcBank` 永遠 `null` → `PracticeGate.tsx:84` 永遠返 `<Loading />`。
讀屏用戶聽到嘅係一個唔會停嘅 `aria-busy` ＋「載入中」。

**仲有一個報告冇捉到嘅放大效應：`Promise.all`。**
數學科一次過 `import()` **8 個** chunk。學生就算已經 cache 咗 7 個，
第 8 個攞唔到，`Promise.all` 一樣全部 reject —— 佢會得返零，唔係得返七成。
（中文 8 個、生物 5 個、ICT 5 個，情況一樣。）

## 要改嘅檔

| 檔 | 改乜 |
|---|---|
| `app/practice/PracticeGate.tsx` | 兩個 `.then` 加 `.catch`；加 `error` state 同錯誤畫面 |
| `lib/questionCloud.ts` | `fetchVersion` 加 `AbortController` ＋ 3–4 秒上限（`signal` 參數已經有，line 108） |
| `lib/dictionary.ts` | 錯誤文案，中英各一 |
| `lib/__tests__/practice-gate-offline.test.mts` | **新檔** |

**4 個檔**（3 改 1 新）。如果錯誤畫面要獨立組件就 5 個。

## ⚠️ 要你拍板：「列返之前做過嘅科目」攞邊度嘅資料

報告建議錯誤文案列返學生之前做過嘅科目。**但冇一個現成 key 直接答到呢條問題。**
候選：

- `dse_topic_stats` —— 有逐課題紀錄，推得返科目，但係**已上雲**嘅 key（§16.E）
- `getSeen(subjectId)` —— 逐科分開存，要逐科問一次先知邊科有記錄
- `dse_progress` —— 有節紀錄

**最細嘅做法：唔列科目**，淨係講「呢科未存喺部機，有網嗰陣再開一次就會存低」
＋ 一條返 `/subjects` 嘅連結。**零新資料源、零新 key**，而且對一個而家喺港鐵、
乜都做唔到嘅學生嚟講，資訊量一樣。

我傾向呢個。要列科目嘅話請講，我會另外評估。

## ⚠️ 唔好順手改嘅嘢

`public/sw.js` **刻意唔為導航加 timeout** —— 呢個判斷係啱嘅，唔好一齊改。
題庫超時之後用嘅係同一份正本衍生嘅靜態 chunk，唔係舊資料，所以唔撞佢嗰個顧慮。

## 重跑

```bash
grep -n "\.then\|\.catch" app/practice/PracticeGate.tsx
grep -n "Promise.all" data/questions/load.ts | head
sed -n '105,140p' lib/questionCloud.ts
```

---

# F1(a) —— 由錯因揀題（`mode=cause`）

## 比預期細：有現成先例

`mode='weakness'` 已經示範咗點做（`app/practice/PracticeSession.tsx:174-183`）：
佢**只做一件事 —— 重排 `ordered`**，跟住落面 `pickByDifficulty` 原封不動按 3:5:2 分層。
檔入面自己寫住「Stratification below is unchanged, so the 3:5:2 mix still holds」。

所以 `mode='cause'` 係 `buildPool` 嘅**第三條分支**，唔係一個新引擎。
憲章 §7「按 3:5:2 出卷」**結構上**保住，唔使靠承諾。

## 三種錯因各自要用唔同資料源（呢點要講清楚）

| 錯因 | 資料源 | 點揀 |
|---|---|---|
| 🎯 審題陷阱 | **題庫本身** —— 題幹有冇指令字 | 掃 `q.content`，命中指令字詞庫嘅排前 |
| 🧮 運算粗心 | `dse_reverse_log` 記過 C 嘅 `topicId` ＋ 題目有數式 | 交集 |
| 🧠 概念盲區 | `dse_reverse_log` 記過 A 嘅 `topicId` | 該課題嘅題排前 |

即係話「審題陷阱」嗰條**唔使睇學生歷史**，掃題庫就得 ——
呢條對一個啱啱開始用、冇咩紀錄嘅學生一樣行得通。另外兩條要有紀錄先有用。

⚠️ `dse_reverse_log` 上限 **200 條**（`lib/reverseLog.ts` `CAP = 200`）。
做得密嘅學生，超過 200 條之前嘅錯因會被擠走 ——
呢個唔係 bug，但「由錯因揀題」嘅可用歷史就係最近 200 條，唔係全部。

## ⚠️ 一個一定會踩中嘅陷阱：`CMD_RE` 係 `/gi`

```
components/CommandWordText.tsx:17   const CMD_RE = /(...)/gi
```

佢**帶 `g` flag**。`RegExp.prototype.test()` 對住一個 `/g` 正則係**有狀態**嘅：
每次成功之後 `lastIndex` 會向前行，下一次由嗰度先開始搵。
喺一個迴圈入面 `CMD_RE.test(q.content)` 逐條題掃 —— **會隔一條漏一條**，
而且唔會報錯，個功能只會「有時準有時唔準」。

**實跑（2026-09-21，同一段文字連續四次）：**

```
同一段文字連續四次 .test() → [ true, false, true, false ]
每次 new RegExp（冇 g）     → [ true, true, true, true ]
```

現時冇呢個問題，因為佢淨係畀 `String.split(CMD_RE)` 用（`CommandWordText.tsx:43`），
`split` 唔食 `lastIndex`。一搬去揀題邏輯就會撞。

**做法：** 搬入 `lib/` 嗰陣導出一個函數（例如 `hasCommandWord(text)`），
入面每次自己 `new RegExp(SRC, 'i')`（唔要 `g`），唔好導出個帶 `g` 嘅正則本體。
連同一條負向自測：連續兩次對同一段文字要得到同一個答案。

## 要改嘅檔

| 檔 | 改乜 |
|---|---|
| `lib/commandWords.ts` | **新檔** —— 詞庫來源 ＋ `hasCommandWord()` |
| `components/CommandWordText.tsx` | 改為 import，唔再自己定義 |
| `app/practice/PracticeShell.tsx` | `mode` 加認 `'cause'`（line 28 嗰條三元） |
| `app/practice/PracticeGate.tsx` | `mode` 型別加闊，傳落去 |
| `app/practice/PracticeSession.tsx` | `buildPool` 第三條分支 ＋ `mode` 型別 |
| `components/ErrorDNA.tsx` | 入口掣「專攻審題陷阱」 |
| `lib/dictionary.ts` | 文案 |
| `lib/__tests__/cause-mode.test.mts` | **新檔** —— 含上面嗰條負向自測 |

**8 個檔**（6 改 2 新）。

## 同 B2 有重疊

B2 你揀咗改 `ErrorDNA.tsx` 嘅呈現（玫紅改金色）。F1 嘅入口掣都係加喺同一個檔。
**兩項一齊做會慳一次 review**，而且唔會出現「啱啱改完個框、又再改一次」。

## 重跑

```bash
sed -n '162,200p' app/practice/PracticeSession.tsx
sed -n '16,18p' components/CommandWordText.tsx
grep -n "CAP" lib/reverseLog.ts
```

---

## 三項嘅先後

呢個係建議，唔係裁決。

1. **C1(a)** —— 4 個檔，唯一一項而家會令學生乜都做唔到。
2. **F1(a) ＋ B2** —— 一齊做，共用 `ErrorDNA.tsx`。
3. **A2(c)** —— 最尾，因為佢要你先答上面兩條設計問題（空卡點算、用唔用霓虹）。

## 等緊你嘅四個答案

| | 問題 |
|---|---|
| A2-1 | 錯因卡冇嘢可寫嗰陣：(甲) 掣變灰 ／ (乙) 出替代文案 ／ (丙) 回落戰績卡 |
| A2-2 | 新卡用霓虹（同現有導出卡一致）定莫蘭迪（同網站一致） |
| C1-1 | 錯誤文案列唔列「之前做過嘅科目」（列＝要多一個資料源） |
| — | 三項嘅簽名欄仍然 ⬜。本報告唔構成 greenlight。 |

---

**本報告冇驗收表，亦冇任何 ✅。** 三項一行代碼都未寫，冇嘢跑得（§16.C）。
