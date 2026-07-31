# 審核：技術護城河 v1.0（A 錯題 DNA 向量 ／ B 難度校準 ／ C 概念網出題）

> 對象：`dse-level-up-moat-claude-prompt.md`
> 方法：逐條對 **live Supabase**（`aegekxapxgcfdrkzisis`）同真 repo 核；B 段數學照抄跑過
> 性質：Phase 1 唯讀審核（憲章 §4）

---

## 0. 一句話結論

**三條護城河全部建喺同一個唔存在嘅數據資產上面。** A 同 B 需要嘅欄位一個都冇；C 嘅資產係真嘅，而且比文件講嘅**強一倍**，但文件描述錯晒。

更根本：文件 §④ Rule #3 要求「未登入用戶嘅 localStorage 數據必須納入護城河（佢哋佔大多數）」，但三條護城河全部係 `user_id` 主鍵嘅 server 表 —— **呢條規則同成個設計互斥**（見 §4）。

---

## 1. 數據資產實況（一次過講清，三條護城河共用呢個前提）

`user_progress` 實測**只有 6 欄**：

```
id (uuid) · user_id (text) · progress_data (jsonb)
total_questions_done (integer) · last_active_at · updated_at
```

`progress_data` JSONB 嘅 key（98 行，只查 key 名，冇讀學生內容）：

```
syncedAt · updatedAt · dse_progress · dse_free_attempts_total
dse_topic_stats · dse_active_session
```

由呢度可以推出三件事：

1. **`dse_reverse_log` 唔喺入面。** 錯因自診（概念盲區／審題陷阱／運算粗心）**從來冇上過 server**，一直 100% 留喺學生部機。`lib/emotionLog.ts:3` 寫明「純 localStorage，永不上 server」，係刻意設計。
2. Server side 實際有嘅係：每個 session 嘅 `dse_progress`（`subjectId / score / total / topicResults{topic,correct,total} / timestamp`）。即係**逐課題嘅 correct/total**，冇難度、冇錯因、冇 question id、冇逐題時間。
3. `total_questions_done` 喺**全部行都係 0**（front end 從來冇寫過）。

順帶：`dse_free_attempts_total` 仲喺 98 行 `progress_data` 入面同步緊 —— 免費化（task #63）之後遺留嘅死數據，每次同步照上傳。

---

## 2. 護城河 A —— 向量設計本身有數學錯誤

### 2.1 SQL 引用嘅欄位唔存在

文件寫「主表：`user_progress`（`is_correct = false` 嘅紀錄）」。`user_progress` **冇 `is_correct`**，亦冇 `question_id`、`time_spent`。清洗規則「剔除 `time_spent < 5 秒`」冇嘢可剔。

### 2.2 3 個維度嘅編碼方式令相似度失去意義

```
科目編碼,  -- math=0.1, econ=0.2, chi=0.3...
章節編碼,  -- 歸一化 topic_id
```

科目同章節係**名目變數（nominal）**，唔係次序變數。用單一維度嘅實數表示，cosine similarity 就會判定「數學(0.1) 同 經濟(0.2) 比 數學 同 中文(0.3) 更相似」—— 呢個結論冇任何意義。

而且呢個錯誤**直接摧毀護城河 A 自己嘅招牌主張**：「跨科錯誤模式聯繫（數學粗心 → 物理粗心）」。跨科比較正正就係被呢個編碼搞爛嘅嗰樣嘢。10 維入面有 3 維（科目、章節、加上同樣做法嘅難度系數）係壞嘅。

正確做法係 one-hot（每科一維）或者索性喺相似度計算時排除科目維度、改為分組。但咁樣就返返去第 2.3 點。

### 2.3 按文件自己嘅標準，呢個係「基本建設」唔係護城河

餘下嘅維度（三個錯因權重、難度、重複錯誤標記）**本身已經係明文標籤**。喺一組人手砌嘅 10 維向量上做 cosine，等於用一個貴啲嘅方法做：

```sql
GROUP BY cause, difficulty, topic
```

文件 §① 自己寫：「對於任何人用 Vercel + Supabase 都做到嘅嘢，你會直接講『呢個唔係護城河，係基本建設』」。人手砌向量再做相似度，冇學到任何原本冇嘅嘢。

### 2.4 其他

- `econ` / `chi` **唔係真 id**（真實係 `economics`、`chinese`）。呢個係連續第三份文件出現同一個錯。
- `vector` extension **確實已安裝**（0.8.0）—— 文件講「唔使 npm install」係啱嘅。
- `ivfflat ... WITH (lists = 100)` 喺一個只得幾百行嘅表上，比直接全掃更慢。ivfflat 要有相當行數先有意義。
- `find_similar_mistakes` 有 `WHERE mv.user_id = p_user_id`，即係**純個人查詢**；文件 Rule 必須做到 #2 講嘅 k-anonymity ≥5 喺呢段 code 入面根本冇實現，亦冇適用場景。

---

## 3. 護城河 B —— 三個比例加埋唔等於 1

### 3.1 SQL 引用嘅四個欄位，全部唔存在

```sql
FROM public.user_progress
WHERE user_id = ... AND subject = ... AND created_at > ...
-- SELECT AVG(CASE WHEN difficulty = 'easy' AND is_correct ...
```

`subject`、`difficulty`、`is_correct`、`created_at` —— **四個都冇**。呢個違反文件自己 §④ Rule #1「禁假設 schema」。

### 3.2 數學錯：比例唔歸一化

三段 `CASE` 各自獨立輸出，之間冇任何約束。照抄跑 9 個代表組合：

```
easy=0.95 hard=0.25 → 0.15 / 0.65 / 0.10 = 0.90 ✗
easy=0.95 hard=0.40 → 0.15 / 0.50 / 0.15 = 0.80 ✗
easy=0.95 hard=0.60 → 0.15 / 0.50 / 0.25 = 0.90 ✗
easy=0.80 hard=0.25 → 0.25 / 0.50 / 0.10 = 0.85 ✗
easy=0.80 hard=0.40 → 0.25 / 0.50 / 0.15 = 0.90 ✗
easy=0.80 hard=0.60 → 0.25 / 0.50 / 0.25 = 1.00 ✓
easy=0.70 hard=0.25 → 0.35 / 0.50 / 0.10 = 0.95 ✗
easy=0.70 hard=0.40 → 0.35 / 0.50 / 0.15 = 1.00 ✓
easy=0.70 hard=0.60 → 0.35 / 0.45 / 0.25 = 1.05 ✗
```

**9 個之中 7 個唔等於 1.00**，範圍 0.80–1.05。抽題比例加唔埋一，行為就冇定義。

### 3.3「維持 60-75%」係聲稱，唔係實現

文件寫「目標：讓學生整體正確率維持在 60-75%（學習區）」。但嗰張 `CASE` 表係一個**靜態查表**，冇任何一步計算實際整體正確率，亦冇同 60-75% 呢個目標比較過。冇回饋 = 唔係控制器。

同樣，「防止震盪：每日最多變動 ±10%」喺 SQL 入面**完全冇實現** —— `ON CONFLICT DO UPDATE` 係硬覆寫。

### 3.4 撞已上線契約同大愛設計

- 3:5:2 係已上線嘅服題契約（憲章 §12）。逐人校準等於靜靜廢除佢，屬憲章 §6「唔准以 feature change 為由令現有保證失效」。
- 更值得諗：一個**永遠**將學生維持喺 60-75% 正確率嘅引擎，對進步中嘅學生嘅體驗係「無論我幾努力，都仍然錯三成」。對焦慮傾向學生，呢個係結構性嘅挫敗感來源。

---

## 4. 中心矛盾：Rule #3 同成個設計互斥

> §④ Rule #3：「禁強制登入：未登入用戶嘅 localStorage 數據必須納入護城河（**佢哋佔大多數**）」

但 A／B／C 三條全部係 `user_id` 做主鍵嘅 server 表。要將匿名未成年人嘅 localStorage 數據放上 server，只有兩條路：

- **(a) 要求登入** —— 直接撞 Rule #3 自己；
- **(b) 發一個裝置級 pseudo-id** —— 即係 device fingerprint，撞「禁追蹤未成年人」。

冇第三條路。呢個唔係實作細節，係設計層面嘅死結。

**附帶嘅隱私姿態改變**：錯因自診而家 100% 本地，係刻意紅線。搬上 server 係實質改變，要創辦人 + 法務決定，唔應該當成「起護城河」順手做。

---

## 5. 護城河 C —— 資產係真嘅，但文件描述錯晒（而且低估咗）

`docs/concept_network.json` **確實存在**，而且已經被 `data/questions/chinese.ts:516` 引用緊。實測：

| 項目 | 文件講 | 實際 |
|---|---|---|
| 篇數 | 12 | **12 ✓** |
| 概念節點 | 29 | **58** |
| 節點類別 | 5 類（字詞解釋／論證手法／思想內容／寫作技巧／跨篇比較） | **4 類**：`theme 主旨`／`technique 論證/寫作手法`／`line 關鍵句`／`figure 人物/形象` |
| 已驗證組合 | 未提 | **`proven_combinations` 已有 10 條** |

逐篇節點數：論仁論孝論君子 6、魚我所欲也 5、逍遙遊 4、勸學 5、廉頗藺相如 5、出師表 5、師說 4、始得西山宴遊記 4、岳陽樓記 4、六國論 4、唐詩三首 6、詞三首 6。另有 `scripts/qbank/concept-webs/` 三篇獨立概念網。

- 「29 節點 × 五大類別 = 141 種組合」**三重錯**：節點數錯、類別數錯、而且 29 × 5 = 145 唔係 141。（就算數啱，節點本身已經按類別分好，相乘冇意義。）
- 文件個 `CONCEPT_NODES` code sample 同真檔案結構完全對唔上，而且只覆蓋《魚我所欲也》一篇。
- `getWeakestConceptCombo(userId)` 入面個 `userId` 唔喺 `generateConceptCombo()` 嘅參數列 —— **唔 compile**。
- 兩張建議嘅 Postgres 表（`concept_coverage`／`student_concept_weakness`）加唔到任何嘢：覆蓋率喺離線資產度數得到，學生弱點喺 localStorage 度有齊。

**護城河 C 嘅價值喺個 JSON 同啲題目本身，唔喺 schema。** 而佢已經存在。

---

## 6. 真正嘅護城河喺邊

按文件自己嘅定義（對手今日開新平台，物理上複製唔到），現有嘅係：

1. **5,166 條真人逐題審核嘅 MC** + 審核管線（`decisions.json` 實名簽署、`_gate.mjs`、term-guard）。呢個係唯一真正需要時間同人手先累積到嘅資產。
2. **`docs/concept_network.json`** —— 12 篇 × 58 節點 × 10 條已驗證組合。跨篇組合題係考評局真正嘅分水嶺，而呢個結構係人手砌嘅。
3. **憲章約束下嘅 UDL 設計**（60 秒逆向鎖死、三維錯因自診、無紅叉、SEN 常駐）。可以被抄，但抄嘅人要先接受「唔做 gamification」呢個商業上唔直觀嘅決定。

三樣都係**內容同紀律**，唔係 schema。

---

## 7. 唯一一件值得做而且乾淨嘅嘢

護城河 A 嘅招牌主張（**跨科錯因聯繫**）本身係好 insight，而且**數據已經齊晒，喺本機**：`dse_reverse_log` 每條記錄都有 `subjectId` + `cause` + `topicId` + `ts`。

而現有 `components/ErrorRadar.tsx` 只計三軸總分佈，**完全冇睇 `subjectId`** —— 即係「數學粗心 → 物理粗心」呢個聯繫，數據有，但冇人計。

前端版本可以同時滿足文件自己嗰啲互相矛盾嘅要求：

- 未登入用戶（大多數）一樣有效 —— 真正符合 Rule #3
- 零 server、零 PDPO 暴露、零新套件、$0
- 錯因自診維持 100% 本地紅線不變
- 可解釋（Rule 必須做到 #4）：直接講「你喺數學同物理都係『運算粗心』最多」
- 漸進（#5）：數據少就唔顯示，唔會亂噏

**但要老實講：呢個係一個有用嘅功能，唔係護城河。** 對手抄呢個功能要一個下晝。真正抄唔到嘅係上面 §6 三樣。

---

## 8. 建議

1. **A、B 兩條唔好做**，唔係「改改就得」—— A 嘅向量設計有數學錯誤且按文件自己標準唔算護城河；B 嘅比例加唔埋一，而且撞已上線嘅 3:5:2 契約。
2. **C 唔使做** —— 資產已經喺度，而且比文件講嘅好。要加強就係**多出幾條跨篇組合題**（task #84 正在做），唔係加兩張表。
3. 若要投資護城河，投喺 §6 嗰三樣：題目深度、概念網覆蓋、憲章紀律。
4. §7 嗰件事可以做，但要正名為「功能」而唔係「護城河」。
