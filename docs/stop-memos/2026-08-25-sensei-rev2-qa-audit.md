# 核實備忘｜2026-08-25｜SENSEI 修訂版 + QA 審核令

**提交人：** Claude Code
**待決定：** Brian（CEO）／Yuna（COO）
**狀態：** 🟠 **未動代碼 —— 六項要修正，四項事實錯誤，三項核實正確**

> 呢份修訂版比前一份好好多（零模型方向、$0 論證、舊機平權論述都啱）。
> 但入面有**一張預填嘅七閘驗收表**，同**一條將 persona 簽名寫成 NOT NULL 欄位**嘅 SQL。
> 兩項都係管治層問題，唔係技術問題 —— 而管治層問題唔捉，下個 session 會當既成事實。

---

## 一、🔴 Kelly 七閘全綠 = 預填驗收表

第三戰區「QA 七閘審核」七項全部預先填咗 ✅。

**Kelly 係 skill persona，冇跑過任何嘢。** 撞兩條明文：

| 出處 | 原文 |
|---|---|
| 憲章 §11 | 「**無預填驗收表**」 |
| 你哋 HOTFIX-0823 原令 | 「所有『最終狀態』欄位**留空** —— 等 Kelly 實測後填寫，**唔可以擅自判定「完成」**」 |

**最尖嗰點：** 第 ⑦ 閘寫「**真實閘：有無假陳述或「假已完成」？✅ 通過**」。
一張冇人跑過就填綠嘅表，去認證「冇假已完成」—— 呢張表本身就係佢要捉嘅嘢。

### 真實跑出嚟嘅數（2026-08-25，逐項實跑）

| 項目 | 結果 |
|---|---|
| `npm run qa`（7 閘） | ✅ 7/7 |
| `npm test` | ✅ **558/558** |
| `npx tsc --noEmit` | ✅ clean |
| `npx eslint` | ✅ clean |
| `next build --webpack` | ✅ 95 頁（`e9aa7c7` 時實測） |

**數字啱嘅。** 問題唔係數字，係**冇人跑就填**呢個動作 ——
今次啱，下次唔啱嗰陣一樣會綠。

---

## 二、🔴 `signed_by TEXT NOT NULL` —— persona 簽名升級成資料庫欄位

第五戰區逐字：

> 中文｜**Amity 簽名**　英文｜**Arthur 簽名**　數學｜**Victor 簽名**　經濟｜**Carson 簽名**
> Carson：「真人簽名：**我 Carson 親手簽名負責**」

配 Alan 嘅 schema：

```sql
signed_by TEXT NOT NULL,   -- 學科首席真人簽名
```

**Carson／Amity／Arthur／Victor 係 skill persona。** 撞 orchestrator 紅線第 2 條：

> 虛擬 persona 唔可以簽名…驗證簽名位**永遠留白**畀真人（Brian / Yuna）

⚠️ **`NOT NULL` 令情況更差，唔係更好。** 一個必填簽名欄，填住一個唔存在嘅人名 ——
呢個唔係「冇審核」，係「**製造咗一條睇落有審核嘅紀錄**」。
留白至少睇得出未批；填 persona 名，兩年後冇人分得出邊張卡真係有人睇過。

呢個亦係我 Phase 1 報告第 1.1 節嗰項，今次由排期表**升級**成 schema 約束。

---

## 三、🔴 「零新表」同 `CREATE TABLE` 相隔三行

Alan 開場：

> 「數據庫 Schema 最終確認 —— **零新表**，只擴展現有結構。」

同一個 code block 入面：

```sql
CREATE TABLE sensei_knowledge (...)
```

**一張新表就係一張新表。** 呢個同前一版「Zero-Data-Leak vs `sensei_memory`」
係同一種自相矛盾 —— 聲明同內容對唔上，而聲明嗰句會被引用，內容嗰句會被執行。

（我 Phase 1 報告主張改用 `data/sensei/` repo 資料層，理由係
`promote-drafts.mjs:83` 嘅強制簽名閘喺 git 唔喺 DB。呢項仍然待決。）

---

## 四、🔴 `sensei_profile` 入面裝住兩樣已拒絕嘅嘢

```sql
ALTER TABLE profiles ADD COLUMN sensei_profile JSONB
-- 包含：subjects, overall_level, learning_style, error_dna, strength_dna, sen_preferences
```

| 欄位 | 已裁決 |
|---|---|
| `error_dna` | 2026-08-25 你哋批准嘅**兩層定義**：L1 本機可以，**L2 平台可讀 = 禁止**。JSONB 入 `profiles` 就係 L2 |
| `sen_preferences` | 2026-08-27 SEN 備忘 §1.1 —— **未成年人 SEN 標籤上雲，我唔會建**（就算批准） |

改成 JSONB 欄位而唔係獨立表，**唔改變性質** —— 一樣係
`user_id` 掛住一個未成年人嘅 SEN 設定同錯題剖析，平台讀得到。

**呢個係 SEN 資料上雲第三次出現**（原 SEN 召集令 → 前一版 SENSEI `sensei_profile.mood_log` → 今次）。

---

## 五、🔴 對外文案兩項：「醫療級」+ 一項唔存在嘅 runtime 防護

### 5.1 「醫療級」—— 明文禁令，今次係實際貼文

Mia 嘅 Threads 稿：

> 「DSE LEVEL UP 新增**醫療級**光敏保護…**#醫療級安全網**」

> 安全重規劃 §二：聲稱「**醫療級**」情緒安全…= **絕對禁止**

我 2026-08-27 SEN 備忘第 6 項已經標咗待決 —— 未有決定，而今次已經寫成待發文案。
（另：Claude Code 唔會撰寫或發布對外貼文。）

### 5.2 將 build-time 測試講成 runtime 醫療防護 —— 呢項最要緊

文案：

> 「**自動攔截**超過 3Hz 嘅閃爍動畫，癲癇／光敏感學生可以**安心溫書**」

Emma 表：「自動**檢測並攔截**超過 3Hz 的閃爍動畫」

**實情：3Hz 閘係一個 build-time 測試，唔係 runtime 防護。**

| | 實際 |
|---|---|
| 位置 | `lib/__tests__/sen-accessibility.test.mts:321` |
| 機制 | 掃 `globals.css`，**只計 `infinite` 動畫**，超標就 fail build |
| runtime 攔截 | **零**（全 repo 唯一 `flash` 命中係 `app/admin/ReviewPanel.tsx:273` 一個提交成功提示，同閃爍無關）|

佢保護嘅係「**我哋唔會出街一個 strobe**」，**唔係**「學生瀏覽期間有嘢幫佢擋」。

⚠️ 同一個光敏感學生講「有自動攔截，可以安心溫書」，佢可能因此**唔開自己部機**
**或瀏覽器嘅光敏防護**。呢個唔止係誇大，係一個**會影響安全行為**嘅假聲稱。

正確講法：「**我哋自己嘅動畫全部低於 3Hz，而且有測試鎖住，唔會有一日改壞咗都冇人知**」——
呢句已經夠好，而且係真。

---

## 六、🟠 四項事實錯誤（逐項已核實）

| # | 文件寫 | 實情 |
|---:|---|---|
| 1 | 讀寫障礙友善：**語音朗讀 ✅ 已上線** | ❌ `speechSynthesis` **全站只出現喺 `app/relax/components/BreathingExercise.tsx`** —— 呼吸練習嘅語音導引，**唔係讀題**。讀寫障礙語音朗讀**未上線**（我 SEN 備忘 §三已標「要先做可行性」） |
| 2 | 自閉症友善：**社交故事教學 ✅ 已上線** | ❌ `grep 社交故事` → **0 個檔** |
| 3 | 一鍵舒適模式 =「字體/**行距**/**對比**/計時器/動畫」 | ❌ `A11yPanel.tsx:179` = `easy && hideTimer && ruler && noMotion && !sound` = 易讀字體／隱藏計時器／**閱讀尺**／減少動態／**靜音**。**行距同對比唔喺入面** |
| 4 | 分支「**5 commits**，未 push」 | ❌ 實際 **9 個**（`b470638`…`7e061e2`） |

另：抑鬱症友善「負責人：**Sarah**」—— Sarah 係虛構社工 persona，
呢個名唔應該出現喺任何**負責人**欄（見 SEN 備忘 §1.2）。

---

## 七、✅ 核實正確嘅（唔好連呢啲都當錯）

| 項目 | 核實 |
|---|---|
| `skeleton-breathe` = **0.42Hz** | ✅ 準確。`globals.css:380` `2.4s infinite` → 1/2.4 = 0.4167Hz |
| 3Hz 閘**只計 infinite 動畫**，一次性入場動畫閃爍數為零 | ✅ 準確（`:321` `if (!/\binfinite\b/.test(...)) continue`）|
| 用 `0.01ms` 而非 `animation: none`，防元素停喺透明 | ✅ 準確，而且係我實際選呢個寫法嘅原因 |
| 猜測校正 v4 已有，唔使重複實作 | ✅ 準確（`lib/mastery.ts:89`）|
| 意圖識別純規則引擎、零向量搜索 | ✅ 方向正確 |
| 「零模型係賣點，唔係妥協」+「基層學生用舊機，都配擁有好工具」 | ✅ **啱，而且同憲章金句一致** |

---

## 需要你哋嘅決定

| # | 項目 | 我嘅立場 |
|---:|---|---|
| 1 | 七閘驗收表由 persona 預填 | ❌ 撞 §11 + 你哋自己 HOTFIX 原令；驗收欄留白，我跑完填實數 |
| 2 | `signed_by NOT NULL` 填 persona 名 | ❌ **唔建** —— 製造假審核鏈，比留白差 |
| 3 | 「零新表」聲明 vs `CREATE TABLE` | ⬜ 二選一；我仍主張 `data/sensei/`（Phase 1 §1.2）|
| 4 | `sensei_profile` 含 `error_dna` + `sen_preferences` | ❌ **唔建** —— L2 平台可讀 + 未成年 SEN 標籤上雲（第三次）|
| 5 | 「醫療級」對外文案 | ❌ 明文禁令；另 Claude Code 唔寫貼文 |
| 6 | 3Hz 講成 runtime 防護 | ❌ **必須改** —— 會影響光敏感學生嘅安全行為 |

**以上未有書面決定之前，一行代碼、一句 SQL 都唔會加。**
本次唯一改動係本文件。
