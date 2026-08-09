# DSE LEVEL UP — Claude Code To-Do Prompt（R2 修正版）

**生成日期：** 2026-08-09
**取代：** `DSE-LEVEL-UP-Claude-Code-ToDo-Prompt.md`（R1）
**核實方式：** 逐項對 filesystem、live Supabase（`aegekxapxgcfdrkzisis`）、live Vercel（`prj_CQRC5oit3FL5KrrmCaAXxqUugfYu`）實物核對。

---

## ⛔ R1 修正紀錄 —— 裝 R1 之前必讀

R1 有四處裝落去即有損害，另有兩處數字錯誤源自我方原稿，一處已過時。全部已於本版修正。

### 🔴 修正一：R1 第 72 行「關鍵字批改引擎必中關鍵字同加分關鍵字」—— 已刪除

長答自動批改紅線**又一次復發 —— 累計已於 13 份外部文件攔截**（前 12 份見長期記錄，涵蓋 kate-uiux v-B／v-FINAL、UIUX Constitution PATCH、晨曦憲章 ULTIMATE、Harness v3.0、54 Idea Loop v2、Loop Prompt FINAL §7.2、v5.0 ULTIMATE §15、v6.0 FINAL §10、162 Staff Ideas 六處、Perfect Prompt 2026-07-31 等）。此句雙重錯誤：

1. **與 R1 自己的最高指令第 8 條直接衝突** —— 該條明文寫「長答自動批改永久禁止：只可做學生自我對照嘅溫和非評分提示」。同一份文件，第 19 行禁止，第 72 行要求實作。
2. **該批次根本冇長答題。** 實測 `chinese-fanwen-weak-batch2.json`：10 條全部 `type: "mc"`，10/10 有 `options` 陣列。MC 靠 `correctIndex` 判分，冇任何開放式答案可以「關鍵字批改」。

此句已從 P0-02 移除，並補回正確的 MC 審核準則。

### 🔴 修正二：R1 第 307 行 概念網「五大類」—— 已改回實測值

R1 同一個任務內自相矛盾：第 305 行寫「4 node_types」（正確），第 307 行寫「五大類：字詞解釋、論證手法、思想內容、寫作技巧、跨篇比較」（虛構）。

實測 `docs/concept_network.json`：

```
node_types = ["theme 主旨", "technique 論證/寫作手法", "line 關鍵句", "figure 人物/形象"]
pieces = 12   proven_combinations = 14
```

**4 類，名稱與 R1 所寫五個全部不同。** 此「5 類」虛構已第 4 次出現（commit `eb48fd9` 已記錄前三次）。照 R1 建架構，經濟／生物兩科會照抄一套不存在的分類。

### 🔴 修正三：R1 第 15 行 最高指令第 4 條「60秒逆向鎖死引擎只限中高難度題」—— 已改

實測 `app/practice/PracticeSession.tsx`：

```
:365  if (!isCorrect && currentQ.difficulty === 'hard') setEmoOpen(true)
:407  if (currentQ.difficulty === 'hard') {
```

**只在 `hard` 觸發，冇 medium。** R1 把一個尚未執行的提案寫成了現狀，並升格為紅線；而 R1 自己的 P3-09 又要求「放寬至 medium」—— 紅線與任務互相打架。本版改為陳述實況，並將放寬列為未決提案。

### 🔴 修正四：R1 第 13 行 成本「$0–200 美金」—— 已標回待決

R1 的 P2-01 明文寫住此事「須 Brian + Yuna 雙人簽署」，但 R1 的最高指令第 2 條已經先斬後奏寫成 `$0–200`。憲章數字未經雙簽不得改動，本版最高指令改為指向待決狀態。

### 🟡 修正五：執行總表 P0／P1 數目錯 —— 我方原稿的錯，已更正

R1 總表寫 P0 = 5、P1 = 6。實際文件只有 **P0-01～04（4 個）** 與 **P1-01～05（5 個）**。此錯誤源自我 2026-08-09 原稿的摘要欄，R1 照抄。正確為 **P0 = 4、P1 = 5，紅標任務共 9 項**。

### 🟡 修正六：P3-12「6 科未有指定學科首席」但列出 7 科 —— 我方原稿的錯，已更正

實測 `.claude/skills/` 缺首席者為 **7 科**：旅遊與款待、健康管理與社會關懷、音樂、體育、視覺藝術、科技與生活、倫理與宗教。標題的「6」為我原稿誤植。

### 🟡 修正七：R1 第 798 行「生產部署 `8c7da8b` = HEAD」—— 已過時

生成 R1 之後首頁文案已改動。現況：

| 項目 | 值 |
|---|---|
| 當前 branch | `feat/homepage-copy-update` |
| HEAD | `3bc8941`（style: 主標題上行移除逗號） |
| `main` | `8c7da8b` |
| Vercel 生產 | `8c7da8b` |
| **未部署 commit** | **2 個**（`f8495d9` 文案 + `3bc8941` 逗號），未 push |

即「待部署代碼 = 0」此一結論**已不再成立**。已新增 P1-06 追蹤。

### 🟢 修正八：R1 第 201 行「BAFS 資產負債表數據自動生成且絕對平衡」—— 保留但標為未評估

此句不在我方原稿。技術上可行（參數化生成令借貸恆等），但屬未經評估的新範圍，且與 P2-10「BAFS 表格題技術路線待拍板」相關。本版保留並標明狀態。

---

## 🎯 最高指令（R2）

你是 DSE LEVEL UP 平台的 Claude Code 執行代理。所有操作必須遵守以下憲章紅線：

1. **零版權侵犯** —— 所有題目必須使用「原創平行改寫法（Archetype Masking）」，嚴禁直接抄錄 HKEAA 官方試題。
2. **零額外成本** —— 嚴禁調用需付費的第三方 API，嚴禁引入新套件。
   ⚠️ 每月成本上限的實際數字**待決**：`CLAUDE.md:13` 現寫 HK$180.81，實際自 2026-07-30 起為 US$200。修改憲章數字須 Brian + Yuna 雙人簽署（見 P2-01）。在雙簽完成前，一律以「不增加任何新增經常性支出」為操作準則。
3. **機器永不自動入庫** —— 所有 `decisions.json` 的 `_meta.reviewer` 一律留白，只認 Brian / Yuna 真名。虛擬 persona（Victor／Amity／Max 等）只提供規範與檢查清單，永不簽名。
4. **大愛設計** —— 絕不使用大紅交叉或「FAIL」字眼。
   ⚠️ 60 秒逆向鎖死引擎**現時只在 `difficulty === 'hard'` 觸發**（`PracticeSession.tsx:365`、`:407`）。放寬至 medium 屬**未決提案**（P3-09），未經拍板不得實作；即使拍板亦須同時設每日觸發上限與可跳過機制，否則由「幫助」變「懲罰」。
5. **SEN 友善** —— OpenDyslexic 字體、防跳行閱讀尺、隱藏倒數計時器、4-7-8 呼吸法。
   ⚠️ OpenDyslexic 字型檔目前**不存在**（見 P0-04），該功能實際未生效。
6. **免費核心** —— 平台維持 100% 免費，嚴禁任何收費功能開發。
7. **術語紅線** —— Public Good =「共用品」禁「公共財」；Entrepreneurship =「企業家職能」禁「企業」；Income Elasticity 絕對禁用（大學超綱）；normalisation =「規範化」禁「正規化」。
   ⚠️ 反向陷阱：1NF/2NF/3NF 官方譯「第一／第二／第三範式」，**不是**「正規形」；且「比熱容量／比熱容」、「限制因素／限制因子」兩組**均為官方並存譯法，不可統一**。
8. **長答自動批改永久禁止** —— 不得做關鍵字覆蓋率、必中關鍵字、加分關鍵字、Tone & Register 語義批改、Blind Copying 偵測。只可做學生自我對照的溫和非評分提示。**此條已復發 9 次，見到即攔。**
9. **自動情緒偵測永久禁止** —— 不得做 NLP 自殺／自殘偵測。只可做靜態熱線指引 + 人審。
10. **心理健康 PII 不得入庫** —— `/relax` 系列必須純 localStorage。

### 事實核查協議（執行任何「已審批／已入庫」指令前必跑）

```
Step A  filesystem —— decisions.json 的 _meta.reviewer 是否非空？
Step B  Supabase  —— review_decisions 表有無對應記錄？
Step C  live 題庫 —— load.ts 與 index.ts 有無該題 id？
→ 三點齊備方當「真實入庫」；任一點對不上 = 視為「未入庫」
```

---

## 📊 執行總表（R2 更正）

| 分類 | 項目總數 | P0（今日必做） | P1（聽日必做） |
|---|---|---|---|
| 🔧 待生效（代碼已部署，學生觸達唔到） | 13 | 3 | 3 |
| 📝 待開發（連代碼都未寫） | 21 | 1 | 2 |
| 🚚 待部署（新增：本機有 commit 未推） | 1 | 0 | 1 |
| **合計** | **35** | **4** | **6** |

紅標任務共 **10 項**：P0-01～04、P1-01～06。

---

# ═══════════════════════════════════════
# L1 戰區一：最高指揮部
# ═══════════════════════════════════════

## 🔴 P0-01: `math-long-batch-1` 逐條真人審批簽名
**狀態**：🔧 待生效 ｜ **工時**：機器 0.5h／**真人審批 2–3h** ｜ **紅線**：❌ 否（但簽名位絕不可代簽）

1. 讀 `scripts/qbank/drafts/math-long-batch-1.decisions.json` —— 現況 `_meta.reviewer: ""`、10 條全 `pending`。
2. 逐條核（Victor 標準）：題目符合數學科規範；解析附 Casio fx-50FH II／3650P Program 教學；100% 標準書面語；難度標籤正確。
3. **真人**填 `_meta.reviewer`（Brian 或 Yuna），10 條逐條 approved／rejected。
4. `node scripts/qbank/promote-drafts.mjs --out math-long`
5. Wire 入 `data/questions/load.ts` **同** `data/questions/index.ts`（漏其一 → `loader-parity.test.mts` 紅）。
6. `npm test` 綠。

**驗收**：live 站撳「數學 → 長題目練習」真係做到題，唔再顯示「準備中」。

---

## 🔴 P0-02: `chinese-fanwen-weak-batch2` 逐條真人審批簽名
**狀態**：🔧 待生效 ｜ **工時**：機器 0.5h／**真人審批 1.5h** ｜ **紅線**：❌ 否

**題型實測：10 條全部 `type: "mc"`，10/10 有 `options`。此批冇長答題。**

1. 讀 `scripts/qbank/drafts/chinese-fanwen-weak-batch2.decisions.json` —— `_meta.reviewer: ""`、10 條全 `pending`。
2. 逐條核（Amity 標準）：
   - 12 篇範文跨篇組合命題，組合須避開 `concept_network.json` 已用盡的 14 條 `proven_combinations`
   - 四個選項各設陷阱型：correct／half_right／over_interpretation／concept_swap／concept_reversal／keyword_misread／irrelevant
   - `correctIndex` 分佈 0..3 各有，唔可以有位置規律
   - **解析只引選項內容、不引字母**（選項運行時洗牌）
   - 100% 標準書面語
   - topicId 落喺已宣告 id（`fanwen_diction`／`fanwen_content`／`fanwen_lines`），零孤兒課題
   > ⛔ **不得加入任何關鍵字批改邏輯。** MC 靠 `correctIndex` 判分；`marking_scheme` 只供人眼參考，機器唔按 keywords 出分。R1 此處原有「關鍵字批改引擎」一句已刪。
3. **真人**填 `_meta.reviewer` + 逐條裁決。
4. `node scripts/qbank/promote-drafts.mjs --out chinese-fanwen-weak`
   ⚠️ **必須用 `--out`** —— promote 屬覆寫而非追加，唔用會冚走 `chinese-reviewed.ts`（2026-08-07 實際發生過）。
5. Wire 入 `load.ts` 同 `index.ts` → `npm test` 綠。

---

## 🔴 P1-01: 打氣牆 pending 帖審批
**狀態**：🔧 待生效 ｜ **工時**：0.25h ｜ **紅線**：⚠️ 是 —— 自動偵測已否決

實測（2026-08-09）：`wall_posts` 唯一一行 `id=028f7e5a-5923-4520-a762-5b61ce61b4ba`、`status=pending`、**已等 4 日 02 小時**、`moderator_email=null`。

1. 登入 `/admin/wall` 人手審批或退回。
2. `moderator_email` 填審批人 email。
3. 定明營運承諾（建議 48 小時內必審）—— 學生投稿石沉大海比冇呢個功能更傷。

```
❌ 絕對禁止自動情緒偵測／NLP 自殺偵測
✅ 只做：人審 + 靜態熱線指引
   2896 0000 生命熱線 ／ 2382 0000 撒瑪利亞防止自殺會
   （過往規格多次寫錯 2389 2222，必須用上述已核實號碼）
```

---

## 🔴 P1-06: 首頁文案 2 個 commit 未推送（R2 新增）
**狀態**：🚚 待部署 ｜ **工時**：0.1h ｜ **紅線**：❌ 否

branch `feat/homepage-copy-update` 有 `f8495d9`（hero 冠軍文案）+ `3bc8941`（主標題上行去逗號），本機已驗收（test 204/204、qa 三閘綠、build 81/81、瀏覽器中英文實測），但**未推送**：呢部機冇 GitHub 憑證（`osxkeychain` 無 github.com entry、無 SSH key、無 `gh` CLI）。

```bash
cd /Users/yunawong0128/Downloads/EdwardAI-Skills-Pack/dse-level-up && git push -u origin feat/homepage-copy-update
```

---

## P2-01: `CLAUDE.md` 憲章第 5 條成本數字失實
**狀態**：📝 待資源確認 ｜ **工時**：0.5h ｜ **紅線**：⚠️ 是 —— 憲章修改須雙人簽署

`/Users/yunawong0128/Downloads/CLAUDE.md:13` 寫 HK$180.81，實際自 2026-07-30 起 US$200。改數字 + 註明生效日 + 說明死鎖上限是否同步上調。**須 Brian + Yuna 雙簽。** 在雙簽前，本 prompt 最高指令第 2 條維持「不增加任何新增經常性支出」。

## P2-02: orchestrator skill 數字不一致
**狀態**：📝 待資源確認 ｜ **工時**：0.25h ｜ **紅線**：❌ 否

實測 `.claude/skills/` = **188** 個。內文「162」改為 188，或講清 162 係 `docs/AGENT-IDEAS-162.md` 構想清單而非已安裝 skill 數。

## P2-03: `*.review.html` gitignore 決策
**狀態**：📝 待資源確認 ｜ **工時**：0.25h ｜ **紅線**：❌ 否

`git ls-files` 列出 6 個。二選一：(A) 加入 `.gitignore` 當純生成物；(B) 保留當審批留痕。**必須揀一個**，唔可以維持「有時 commit 有時唔 commit」。已問 3 次未有回覆。

---

# ═══════════════════════════════════════
# L1 戰區二：學科軍團
# ═══════════════════════════════════════

## 🔴 P0-03: 108 條孤兒課題註冊
**狀態**：🔧 待生效 ｜ **工時**：3–4h（**真人審批 0h**）｜ **紅線**：❌ 否

實測分佈：chemistry 29（`mole_concept`）· math 25 · economics 20 · chinese 12 · m1 10（`binomial_theorem`）· english 6 · bafs 6。

呢啲題**已經供應緊學生**，但 topic id 未喺該科 `*Topics` 陣列宣告，`getSubjectTopics()` 計唔到，學生喺科目頁揀課題時完全隱形。

1. 每個 id 要麼註冊入該科 Topics 陣列（附 `zh`／`en`／`framework`／`emoji`），要麼 remap 去現有 id。
2. 參考 `docs/topic-remap-worklist.md`。
3. 孤兒掃描歸零 → `npm test` 綠。

**呢項係四個 P0 入面唯一一個唔使真人審批、機器可以自己做完嘅。**

---

## 🔴 P1-02: 理科長題目破冰（物理・化學・生物）
**狀態**：📝 設計稿階段 ｜ **工時**：機器 4h／科 · 真人審批 3h／科 ｜ **紅線**：❌ 否

管道已全通並已部署：`makeLong()` 工廠、`_gate.mjs` 雙語閘、`LongPracticeSession` runner、`LongQuestionCard` 三段摺疊。實測 25 科只有 chinese 有 26 條書寫題，其餘 **24 科為 0**。

每科首批走完整管線：drafts → `_gate.mjs` → `review-drafts.mjs` → 真人逐條批 → `promote-drafts.mjs --out` → wire 入 `load.ts` + `index.ts` → `npm test`。憲章 §12：每批 20 題、DIFF_RATIO 3:5:2。

**負責人**：Richard（物理首席）／Chloe（化學首席）／Bella（生物首席）

## 🔴 P1-03: 數學組長題目（數學・M1・M2）
**狀態**：📝 設計稿階段 ｜ **工時**：機器 4h／科 · 真人審批 3h／科 ｜ **紅線**：❌ 否

數學：現成 `math-long-batch-1`（10 條待簽，見 P0-01）即第一批。M1／M2：未有草稿，需從頭生成。解析須附 Casio fx-50FH II／3650P Program 教學。

**負責人**：Victor（數學科首席）

## P2-04: 商科長題目（BAFS・經濟）
**狀態**：📝 設計稿階段 ｜ **工時**：機器 4h／科 · 真人審批 3h／科 ｜ **紅線**：❌ 否

BAFS：`bafs-batch-2`（6 條）已喺 drafts 但完全冇 decisions 檔（見 P2-08）。
經濟：術語紅線 —— Public Good =「共用品」、Income Elasticity 絕對禁用。
⚠️ 「BAFS 資產負債表數據自動生成且絕對平衡」屬 R1 新增、**未經評估**的範圍，與 P2-10 技術路線相關，拍板前不得動工。

**負責人**：Fiona（BAFS 首席）／Carson（經濟首席）

## P2-05: 語文組長題目（英文・中國文學・英國文學）
**狀態**：📝 設計稿階段 ｜ **工時**：機器 4h／科 · 真人審批 3h／科 ｜ **紅線**：⚠️ 是

⛔ 英文科**絕不可**做 Tone & Register 自動語義批改，亦不可做 Blind Copying 偵測。只可做學生自我對照的溫和非評分提示。

**負責人**：Arthur（英文首席）

## P3-01: 人文組長題目（地理・歷史・中史・CSD・倫宗）
**狀態**：📝 待虛擬員工分配 ｜ **工時**：機器 4h／科 · 真人審批 3h／科 ｜ **紅線**：❌ 否

**倫理與宗教科喺 188 個 skill 入面搵唔到對應首席** → 指派兼任，或該科長題目押後。

**負責人**：George（`george-geography-chief`／`george-csd-chief`）· Henry（`henry-history-chief`／`henry-chist-chief`）· 倫宗待指派

## P3-02: 應用組長題目（8 科）
**狀態**：📝 待虛擬員工分配 ｜ **工時**：機器 4h／科 · 真人審批 3h／科 ｜ **紅線**：❌ 否

8 科入面 **6 科冇首席**：旅款・健管・音樂・體育・視藝・科技與生活。ICT 長題目**依賴 P1-04 偽代碼作答區先做得成**。

**負責人**：Ian（`ian-ict-chief`／`ian-dat-chief`）

## P2-06: 中文科實用文題型（現時 0 條）
**狀態**：📝 設計稿階段 ｜ **工時**：機器 3h · 真人審批 2h ｜ **紅線**：❌ 否

實測 chinese topic 分佈：`argument_essay` 得 8 條，全部議論文。實用文（書信／演講辭／建議書／通告）一條都冇。新增 topic 屬創辦人決策。

**負責人**：Amity（中文科首席）

## P2-07: 中文範文薄弱篇補題
**狀態**：📝 設計稿階段 ｜ **工時**：機器 3h · 真人審批 2h ｜ **紅線**：❌ 否

實測題面出現次數：月下獨酌 2 · 登樓 3 · 聲聲慢 3 · 青玉案 3 · 論仁論孝論君子 3 · 念奴嬌 4 · 山居秋暝 4（對比出師表 11 · 岳陽樓記 11 · 勸學 9）。六篇每篇補到 ≥8 條。

**負責人**：Amity（中文科首席）

## P2-08: 5 個草稿檔完全冇 `decisions.json`（27 條題卡住）
**狀態**：🔧 待生效 ｜ **工時**：機器 1h · 真人審批 3h ｜ **紅線**：❌ 否

`bafs-batch-2`(6) · `econ-crossunit-batch`(5) · `english-crossunit-batch`(5) · `math-crossunit-batch`(5) · `_demo-math`(7)。呢啲題連「等人批」呢一步都未入到。跑 `review-drafts.mjs` 生成審核表 → 真人逐條批 → promote → wire → test。

**負責人**：Kelly（QA 總監）統籌各科首席

## P4-01: 概念網擴展（經濟＋生物）
**狀態**：📝 待技術評估 ｜ **工時**：6h／科 ｜ **紅線**：❌ 否

實測 `docs/concept_network.json` v1.1：**12 pieces、4 node_types、14 proven_combinations**，全部中文。

**真實 `node_types`（R1 寫錯，此為實測值）：**

```json
["theme 主旨", "technique 論證/寫作手法", "line 關鍵句", "figure 人物/形象"]
```

> ⛔ R1 所寫「五大類：字詞解釋、論證手法、思想內容、寫作技巧、跨篇比較」**不存在於檔案內**，五個名稱全部對唔上。此虛構已第 4 次出現（`eb48fd9` 記錄前三次）。新科目必須沿用上方 4 類實測結構。

**負責人**：各科首席；架構由 Ethan（數據）定

---

# ═══════════════════════════════════════
# L1 戰區三：技術裝甲師
# ═══════════════════════════════════════

## 🔴 P1-04: ICT 偽代碼／SQL／Python 作答區
**狀態**：📝 設計稿階段 ｜ **工時**：3h ｜ **紅線**：❌ 否

實測 `components/LongQuestionCard.tsx:80` 只有 `font-mono` class。缺：Tab 鍵縮排保留（現時 Tab 會跳出 textarea）、語言標籤、等寬預覽。

實作：Tab 插入空格且唔跳焦點；換行保留上一行縮排；題目可宣告 `codeLang` 並顯示標籤。約 2 個檔案。

**驗收**：ICT 學生寫到有縮排嘅偽代碼／Python。
**呢項係所有題型任務入面最快見效嗰個，亦係 ICT 長題目（P3-02）嘅前置條件。**

**負責人**：Leo（前端）；規範由 Ian（ICT 首席）提供

## P2-09: 是非判斷題型（`type: 'tf'`）
**狀態**：📝 待技術評估 ｜ **工時**：8h ｜ **紅線**：❌ 否

實測 `types.ts` 只有 `MCQuestion`／`TextQuestion`／`LongQuestion`，`_gate.mjs` 亦無對應閘。需改：types.ts 型別 → `_builder.ts` `makeTF()` → `_gate.mjs` 閘 → `promote-drafts.mjs` → 答題卡組件 → 練習 runner 分支 → 統計歸類（**是非題屬客觀題，計入準確率；長題目唔計**）。約 6–8 個檔案。

**負責人**：Max（CTO）定型別 → Leo（前端）做卡

## P2-10: BAFS 表格題（財務狀況表／損益表填格）
**狀態**：📝 待技術評估 ｜ **工時**：評估 2h／實作 10h ｜ **紅線**：⚠️ 需拍板

二選一：**(A) 結構化欄位輸入**（機器比對數字；財務報表格數係客觀對錯，不屬主觀評分，故不撞長答自動批改紅線）｜ **(B) 純 textarea 自評**。**建議 (A)**，但界定「數值比對算唔算自動批改」屬產品決策。

**負責人**：Max（CTO）評估 → Fiona（BAFS 首席）定格式 → Yuna 拍板

## P3-03: BAFS／視藝／設計與應用科技 畫圖題
**狀態**：📝 待技術評估 ｜ **工時**：評估 3h／實作 8–20h ｜ **紅線**：⚠️ 需拍板

三條路：canvas 手繪／上傳相／純文字描述自評。**核心矛盾：機器永不批改 → 畫完點自評？** 建議先做「參考圖 + 自評三級」—— 學生喺紙上畫，喺屏幕對照。上傳相會引入用戶內容儲存，觸及 PDPO。

**負責人**：Max（CTO）評估 → Yuna（COO）拍板

## P2-11: `lib/sync.ts` 零測試（176 行）
**狀態**：📝 待技術評估 ｜ **工時**：4h ｜ **紅線**：❌ 否

`lib/__tests__/` 有 7 個測試檔，冇一個測 `lib/sync.ts`。此模組負責 localStorage ↔ Supabase 雙向同步，錯咗會靜靜蝕學生進度。加四類測試：merge 邏輯／衝突處理／空狀態／壞 JSON。

**負責人**：Alan（後端）

## P2-12: `dse_free_attempts_total` 死數據移除
**狀態**：🔧 待生效 ｜ **工時**：1.5h ｜ **紅線**：❌ 否

`lib/sync.ts` 第 4／14／50／67／84／115／137 行仍讀寫此 key。平台自 2026-07-12 起 100% 免費，冇 attempt 上限，此 counter 恆為死數。移除時須確保舊裝置 payload 帶此欄位唔會炸。

**負責人**：Alan（後端）

## P3-04: `/api/sync/session` 死路由
**狀態**：🔧 待生效 ｜ **工時**：2h ｜ **紅線**：❌ 否

live `user_sessions` = **0 行**，而 `app/api/sync/session/route.ts` 存在；`lib/studyTime.ts:6` 更明文寫住設計上唔需要呢張表。二選一：接通前端寫入，或刪路由 + drop 表（要 migration）。**後果：任何「昨日／時段」統計現時計唔到。**

**負責人**：Alan（後端）

## P3-05: `user_progress.total_questions_done` 死欄位
**狀態**：🔧 待生效 ｜ **工時**：1.5h ｜ **紅線**：❌ 否

live SQL：`total=136, zero_done=136, has_topic_stats=136`。真實進度住喺 `progress_data` JSON 的 `dse_topic_stats`。此欄位永遠 0，任何人用佢做報表都會得出「全部學生零練習」。接通寫入，或 drop 欄位。

**負責人**：Alan（後端）

## P3-06: `PracticeSession.tsx` 1,079 行拆分
**狀態**：📝 待技術評估 ｜ **工時**：6h ｜ **紅線**：❌ 否

拆到每檔 < 400 行，行為零改變（現有測試須全綠）。

**負責人**：Leo（前端）

## P4-02: Light-first 設計系統 Phase 2
**狀態**：📝 設計稿階段 ｜ **工時**：8h ｜ **紅線**：❌ 否

Phase 1 已上線（`@theme` token 化、WCAG AA 全綠）。Phase 2 餘下 18 個檔案仍有寫死色值。導出面／hex-alpha 拼接／SVG attribute 三類刻意保留。

**負責人**：Kate（UI/UX）

## P3-07: 2 個死草稿檔清除
**狀態**：🔧 待生效 ｜ **工時**：0.5h ｜ **紅線**：❌ 否

`agent-smoke`(1) · `agent-v5-batch`(6)。對應的 `app/api/agent` + `lib/agents` + 三張表已於 `e0b6c4e` 刪除，呢啲草稿冇下游。確認冇價值後刪檔，或明文標記為歸檔樣本。

**負責人**：Max（CTO）

---

# ═══════════════════════════════════════
# L1 戰區四：心理醫療團
# ═══════════════════════════════════════

## 🔴 P0-04: OpenDyslexic 字型檔缺失
**狀態**：🔧 待生效 ｜ **工時**：1h ｜ **紅線**：❌ 否（SIL OFL，零版權風險、零成本）

實測 `public/fonts/` 只有 `README.md`，**冇 `OpenDyslexic-Regular.woff2`**。`app/globals.css:315` 的 `@font-face` 已部署，但字型檔唔存在 → 學生撳「SEN 專注模式」靜靜 fallback 去 Verdana，**零錯誤提示**。憲章第 5 條列此為已上線功能 —— 憲章與實況唔對版。

1. 由 opendyslexic.org 下載 Regular（SIL OFL，免費可商用）
2. 轉 woff2，命名 `OpenDyslexic-Regular.woff2`，放入 `public/fonts/`
3. live 站開 SEN 模式，DevTools 確認 computed `font-family` 真係 OpenDyslexic

**負責人**：Emma（PM-UDL）取檔 → Kate（UI/UX）驗收

## P2-13: 專業求助邊界告示
**狀態**：📝 設計稿階段 ｜ **工時**：2h ｜ **紅線**：⚠️ 是

`/relax`、`/waiting`、打氣牆三處加靜態告示：「本平台唔提供心理輔導，如有需要請聯絡專業服務」+ **2896 0000 生命熱線** ／ **2382 0000 撒瑪利亞防止自殺會**。措辭經 Sarah 審。

```
❌ 絕對禁止自動情緒偵測／NLP 自殺偵測（SEN-07 已永久否決）
✅ 只做：靜態告示 + 人審
```

**負責人**：Sarah（社工）撰文 → Emma（PM-UDL）放位

## P2-14: 打氣牆危機內容處理流程（紅線改造版）
**狀態**：📝 待資源確認 ｜ **工時**：3h ｜ **紅線**：⚠️ 是

原規格「自動偵測危機內容」= 已否決紅線。可做版本：(1) `/admin/wall` 審核介面固定顯示求助熱線同處理指引；(2) 定明「幾耐內必審」；(3) 投稿頁靜態顯示熱線。**零自動判斷、零心理健康 PII 入庫。**

**負責人**：Sarah（社工）定流程 → Yuna（COO）拍板

## P3-08: 減壓區數據隔離建置檢查
**狀態**：📝 待技術評估 ｜ **工時**：2h ｜ **紅線**：⚠️ 是

確認 `/relax` 系列（呼吸／grounding／虛擬超市／solo／group）冇將任何情緒狀態寫入 Supabase。出實測報告逐個路由列明寫入目標；如有寫入 server，即改純 localStorage。

**負責人**：Max（CTO）查 → Emma（PM-UDL）驗收

## P3-09: 60 秒逆向鎖死是否放寬至中難度（**未決提案**）
**狀態**：📝 設計稿階段 ｜ **工時**：4h ｜ **紅線**：⚠️ 是

**實測現況：只在 `difficulty === 'hard'` 觸發**（`PracticeSession.tsx:365`、`:407`）。R1 寫「現時只有中高難度觸發」係錯。

產品計劃 O2.1 建議放寬至 medium。**風險：觸發過密會由「幫助」變「懲罰」，直接撞憲章大愛紅線。** 若拍板實作，必須同時具備：每日觸發上限、學生可跳過、情緒溫度計「😰 跳去 /relax」路徑保持可用；上線後觀察一週。

**負責人**：Emma（PM-UDL）定閾值 → Leo（前端）實作 → Yuna 拍板

---

# ═══════════════════════════════════════
# L1 戰區五：滲透情報局
# ═══════════════════════════════════════

## P3-10: 2026 年考評局課程修訂追蹤
**狀態**：📝 待資源確認 ｜ **工時**：4h ｜ **紅線**：❌ 否

`docs/dse-syllabus-sources.md` 已記錄已核實的 HKEAA／EDB 來源（已知 4 科有修訂）。逐科比對現有題庫涵蓋 vs 2026 修訂版，列出需增／需刪課題。憲章要求考評局變更 48 小時內提報。

**負責人**：David（考評局動態監察）

## P4-03: 錯題 DNA 上雲
**狀態**：📝 待技術評估 ｜ **工時**：評估 3h／實作 10h ｜ **紅線**：⚠️ 需拍板

現時純 localStorage，換裝置即失。建議 `user_error_dna` 聚合表（唔存個別答題記錄）。成本估算約 40,000 calls／1,000 MAU ≈ Supabase 免費額 4%（**估算，非實測**）。⚠️ 必須先解決「未登入學生點算」—— 全站主打免登入可用，強制登入會撞平權原則。

**負責人**：Ethan（數據）設計 → Alan（後端）實作 → Benjamin（CFO）核成本

## P4-04: 框架熱力圖
**狀態**：📝 待技術評估 ｜ **工時**：8h ｜ **紅線**：❌ 否

⚠️ 產品計劃建議用經濟科試點，**實測唔適合**：`quantitative:115` 係題型唔係概念、`macro:3` vs `macro_modelling:29` 未合併、`reviewed:20` 係來源標籤唔係框架。**建議改用中文＋生物試點**。純 SVG + Tailwind（禁 Chart.js／D3／Recharts）。

**負責人**：Ethan（數據）

---

# ═══════════════════════════════════════
# L1 戰區六：後勤要塞
# ═══════════════════════════════════════

## 🔴 P1-05: `WALL_SALT` 喺 Vercel 有冇設
**狀態**：🔧 待生效 ｜ **工時**：0.25h ｜ **紅線**：⚠️ 是 —— secret 絕不可經對話傳遞

`lib/wall/identity.ts:18` fallback 鏈：`WALL_SALT ?? AUTH_SECRET ?? 'shadow-study-room'`。**冇設唔會報錯，會靜靜用第二或第三個值**；第三個係硬編碼公開字串 → 匿名 hash 可被任何人重算 → 打氣牆匿名性失效。

**冇任何工具讀得到 Vercel env，呢項只有創辦人查得到。** 如冇設，用 `openssl rand -base64 33` 自行生成，**直接貼入 Vercel dashboard，切勿貼入對話或寫入任何檔案**。

**負責人**：Yuna（COO）親自查；技術說明由 Max（CTO）提供

## P2-15: `rls_auto_enable()` SECURITY DEFINER 稽核
**狀態**：📝 待技術評估 ｜ **工時**：2h ｜ **紅線**：❌ 否

以 definer 權限執行且匿名可調用，屬高風險面，從未稽核。讀函式定義 → 確認實際行為 → 決定 `REVOKE EXECUTE FROM anon` 抑或保留（附理由）。

**負責人**：Max（CTO）

## P3-11: 全庫術語二次掃描
**狀態**：📝 待資源確認 ｜ **工時**：4h ｜ **紅線**：⚠️ 是

`docs/TERMINOLOGY.md` 已確立 EDB《常用英漢辭彙》為權威。對 5,201 條題目跑全庫掃描，列出候選不一致，**逐個查證先改**。

```
⛔ 誤「統一」並存譯法會製造 40+ 條假錯誤：
   比熱容量／比熱容      ← 兩者皆official
   限制因素／限制因子    ← 兩者皆official
   第一/二/三範式        ← 官方；「正規形」先係錯
```

**負責人**：Oscar（編輯）／Kelly（QA）

## P4-05: `npm run qa` 加 orphan-topic 閘
**狀態**：📝 待技術評估 ｜ **工時**：2h（**清完孤兒之後**）｜ **紅線**：⚠️ 是

加 CI 閘：題目 topic 唔喺該科 Topics 陣列即紅測試。⚠️ 憲章 §6：加新閘前必須先統計現有幾多條會 fail（= **108**）+ 打印 10 個例子 + 附 migration plan。**即係要先做完 P0-03 先加閘，否則即刻紅。**

**負責人**：Kelly（QA）

---

# ═══════════════════════════════════════
# L1 戰區七：特別行動組
# ═══════════════════════════════════════

## P2-16: 定「長題目上線順序」總表
**狀態**：📝 待資源確認 ｜ **工時**：1h ｜ **紅線**：❌ 否

24 科唔可能同時開；真人審批係唯一樽頸（每科約 3h → 24 科 ≈ 72 小時真人工時）。建議次序（按考生人數）：數學 → 中文 → 英文 → 經濟 → 生物 → 化學 → 物理 → BAFS → 其餘。**每週鎖定 1–2 科。**

**負責人**：Yuna（COO）

## P3-12: **7** 科未有指定學科首席 skill（R1 標題寫「6」，錯）
**狀態**：📝 待虛擬員工分配 ｜ **工時**：1h ｜ **紅線**：❌ 否

實測 188 個 skill 入面搵唔到首席：**旅遊與款待 · 健康管理與社會關懷 · 音樂 · 體育 · 視覺藝術 · 科技與生活 · 倫理與宗教（共 7 科）**。每科指派兼任首席，或明文決定呢幾科只做 MC 唔做長題目。

**負責人**：Yuna（COO）

---

# ═══════════════════════════════════════
# 🎯 48 小時建議執行次序
# ═══════════════════════════════════════

## Phase 1 —— 立即見效（1.6h，唔使真人審批）

| # | 任務 | 戰區 | 工時 | 學生影響 |
|:-:|:--|:--|:-:|:--|
| 1 | P0-04 OpenDyslexic 字型檔 | 心理醫療團 | 1h | SEN 功能由假變真 |
| 2 | P1-01 打氣牆 pending 帖 | 最高指揮部 | 0.25h | 學生已等 4 日 |
| 3 | P1-05 WALL_SALT 確認 | 後勤要塞 | 0.25h | 打氣牆匿名性 |
| 4 | P1-06 推送 2 個 commit | 最高指揮部 | 0.1h | 首頁新文案上線 |

## Phase 2 —— 機器可獨力完成（3–4h）

| # | 任務 | 戰區 | 工時 |
|:-:|:--|:--|:-:|
| 5 | P0-03 108 條孤兒課題 | 學科軍團 | 3–4h（真人 0h） |

## Phase 3 —— 題目解鎖（真人審批 3.5–4.5h）

| # | 任務 | 機器 | 真人審批 |
|:-:|:--|:-:|:-:|
| 6 | P0-01 math-long-batch-1 | 0.5h | 2–3h |
| 7 | P0-02 chinese-fanwen-weak-batch2 | 0.5h | 1.5h |

## Phase 4 —— 技術解鎖（3h）

| # | 任務 | 解鎖 |
|:-:|:--|:--|
| 8 | P1-04 ICT 偽代碼作答區 | ICT 長題目前置條件 |

## Phase 5 —— 本週收尾（P2）

P2-08 五個無 decisions 草稿（機器 1h／真人 3h）· P2-07 中文薄弱範文（機器 3h／真人 2h）· P2-13 專業求助告示（2h）· P2-11 `lib/sync.ts` 測試（4h）· P2-09 是非題型（8h）

---

# 📋 刻意不包括的項目

| 唔列入 | 原因 |
|---|---|
| `/dev/answer-cards`、`/dev/long-session` 生產 404 | **正確設計**，開發預覽面刻意 `notFound()` |
| 中文「曲二首／四塊玉／折桂令」零覆蓋 | **唔屬 DSE 十二篇指定文言範文**；實測 12 篇全部有覆蓋 |
| 收費／Premium／訂閱 | 憲章永久禁止 |
| JUPAS 預測器、老師平台、gamification、假統計、假見證 | 已否決，復建 = 不合格 |
| 長答自動批改／關鍵字覆蓋率／Tone & Register 語義批改 | **累計已於 13 份文件攔截**，永久禁止 |
| 自動自殘／情緒 NLP 偵測 | SEN-07 已永久否決 |
| 舊名 Aethel／WisdomPath／化城避風港／Buff 補給艙 | 已否決 |

---

# 📊 實測數據出處總表（R2）

| 數字 | 來源 | 值 |
|---|---|---|
| 題庫總數 | `getSubjectQuestions()` 全 25 科加總 | 5,201（MC 5,175 + 書寫題 26） |
| 有書寫題的科目 | `getWrittenQuestions()` | **1／25**（只有中文，26 條全 `long`） |
| 孤兒課題題目 | 逐科比對 `getSubjectTopics()` vs 題目 `topic` | **108** |
| 測試 | `npm test` | **204 pass / 0 fail** |
| Supabase 表 | `list_tables` (public) | 7 張：`profiles`(6) · `user_settings`(114) · `user_progress`(136) · `user_sessions`(**0**) · `review_decisions`(114) · `wall_posts`(1) · `wall_likes`(0) |
| 生產部署 | Vercel `list_deployments` | `8c7da8b`（= `main`），READY |
| 本機 HEAD | `git log` | `3bc8941` on `feat/homepage-copy-update`，**2 commit 未推** |
| 已安裝 skill | `ls .claude/skills/` | **188** |
| 概念網 | `docs/concept_network.json` v1.1 | 12 pieces / **4** node_types / 14 proven_combinations |
| `node_types` 實際值 | 同上 | `theme 主旨` · `technique 論證/寫作手法` · `line 關鍵句` · `figure 人物/形象` |
| 60 秒鎖死觸發條件 | `PracticeSession.tsx:365, :407` | **只有 `difficulty === 'hard'`** |
| `chinese-fanwen-weak-batch2` 題型 | 讀 draft JSON | **10/10 `type: "mc"`**，全部有 `options` |
| 未簽草稿 | 逐個 `*.decisions.json` 讀 `_meta.reviewer` | 2 個未簽（20 條）· 5 個冇 decisions 檔（27 條）· 2 個死檔（7 條） |
| 打氣牆 | live SQL | 1 條 pending，已等 **4 日 02 小時**，`moderator_email` null |

---

*R2 由機器逐條核實生成。所有「已完成／已審批」聲稱均經 Step A（filesystem）→ Step B（Supabase）→ Step C（live 題庫）三點核對。*
*任何入庫簽名位一律留白 —— 機器永不自動入庫。虛擬 persona 永不簽名。*
