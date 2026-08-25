> **📍 本文件係 DSE LEVEL UP 憲章嘅唯一正本（canonical）。**
> 2026-08-25 由 `~/Downloads/CLAUDE.md` 移入 repo，納入 git 追蹤 ——
> 此後每次修訂都有 commit、有 diff、有 `git blame`。
>
> `~/Downloads/CLAUDE.md` 已改為指標檔（`@import`），**唔好喺嗰邊改內容** ——
> 兩份會漂移，正正就係 §8.1 記低嗰個「憲章自己同自己打架」。

# DSE LEVEL UP — CLAUDE.md
# 戰場只有一個：香港中學文憑試（DSE）
# 最後更新：2026-08-25 | Brian 簽署停火令（§16 A／B／C／D 四條永久紅線）
# 前次：2026-08-22 | Yuna 核准（§8.1 gamification 解禁）

---

## 1. 最高憲章（不可違反）

1. **學生成效與長期信任為最高原則。** 任何決策若與憲章衝突，一律以學生成效優先。
2. **戰場只有一個：香港 DSE。** 絕對禁止建議全齡層、亞太區擴張、改名 Aethel / WisdomPath / 化城避風港 / Buff 補給艙等已被否決內容。
3. **絕對免費原則（至 2027 DSE 前）。** 2026 年前核心備試功能維持免費。嚴禁建議收費模式、Premium、訂閱。
4. **零版權侵犯。** 所有題目必須使用「原創平行改寫法 (Archetype Masking)」，更換數字、情境、人名，精準保留底層考核邏輯。Footer 每頁必須顯示：「© DSE Level Up 2026. Not affiliated with HKEAA. All questions are independently rewritten for educational purposes.」
5. **每月總技術成本死鎖 US$200 以內。**（2026-07-29 Brian 拍板，2026-08-20 Yuna 確認；舊值 HK$180.81 作廢。與 `scripts/budget-guard.mjs` 一致 —— 兩者將來要一齊改。）嚴禁調用任何需付費嘅第三方 API，嚴禁**新增**套件（尤其 Drizzle ORM、Supabase Auth、Chart.js、D3、Recharts）。
   - ⚠️ **Better Auth 唔屬於呢張禁單** —— `better-auth@^1.6.23` 已經安裝並已接線（`lib/auth/better-auth.ts`、`lib/auth/client.ts`、`lib/auth/session.tsx`、`app/api/auth/[...nextauth]/route.ts`、`app/(auth)/sign-in|sign-up`），係一個由 `NEXT_PUBLIC_AUTH_BACKEND` 控制嘅第二 backend，預設仍然係 Auth.js v5。**唔准當佢係幻覺刪走。**

---

## 2. 項目定位與路徑

- **項目名稱：** DSE LEVEL UP（唯一名稱，非 Aethel / 學無止境 / WisdomPath）
- **官方連結：** https://dse-level-up-by-claude-code.vercel.app/
- **目標受眾：** 12-18 歲香港 DSE 考生（P1 邊緣分數考生、P2 自修生、SEN/基層學生、前線老師/SENCO）
- **創辦人模式：** 業餘娛樂模式，每週一次異步同步
- **生產紀律：** drafts → review-drafts.mjs → 真人逐題批 → promote-drafts.mjs → decisions.json → 人手 wire 入 load.ts。**機器永不自動入庫。**

---

## 3. 技術棧真實版（2026-07-16 鎖定）

- **Framework:** Next.js 16.2.9 + React 19.2.4
- **Styling:** Tailwind CSS v4
- **Auth:** Auth.js v5（Google OAuth）— **無 Supabase Auth，無 Better Auth**
- **Middleware:** proxy.ts — **無 middleware.ts**
- **Database:** Supabase PostgreSQL（僅經 server-only `getServiceSupabase()`）
- **Data:** 100% localStorage（客戶端），Supabase 只作 server-side 備份
- **ORM:** 無 Drizzle ORM
- **Charts:** 純 SVG + Tailwind — **禁 Chart.js / D3 / Recharts**
- **Build:** `--webpack`，dev port 3001
- **Testing:** `npm test`（必須報告 pass/fail count）

---

## 4. Integration Requirement（定義完成標準）

**新模組未完成，直到已 wire 入 live app 並可於運行中 UI 手動驗證。**

- 絕對禁止交付僅有 passing unit tests 嘅 standalone modules。
- 同一 session 內必須同時交付：import + call site + UI 觸發點（route / mode selection / control binding）。
- 超過 3 個檔案嘅變更，必須先進入 Phase 1（read-only audit），產出 impact report，等 Brian/Yuna greenlight 後先准進入 Phase 2（執行）。

---

## 5. Language & Comment Rules（術語紅線）

**所有代碼註釋、識別符、提交內容必須使用標準書面語（書面語）或英文——絕對禁止粵語口語（口語）形式。**

- 適用範圍：題庫檔案、topic names、inline comments、UI 文案（解析層）
- **UI 情感層**可用廣東話（如「你發現咗一個新盲點💡」），但解析層必須 100% 標準書面語／英文
- 每次 Edit/Write bank/content 檔案後，自動運行 `npm run term-guard --silent`

### 學科術語強制對照表

| 英文術語 | 強制譯法 | 嚴禁用法 |
|---|---|---|
| Public Good | 共用品 | 公共財 |
| Entrepreneurship | 企業家職能 | 企業（單用）|
| Income Elasticity | — | **絕對禁止**（大學超綱）|

- 中文科 12 篇範文必須跨篇組合出題，設置考評局級別陷阱（過度推論、半對半錯、正確、無關）
- 數學科動態參數化 correct-by-construction，解析強制附帶 Casio fx-50FH II / 3650P 計數機 Program 教學
- 英文科 Paper 2 嚴格執行 Tone & Register 雙重語義批改，Paper 3 嚴打 Blind Copying 同 Over-paraphrasing

---

## 6. Validation Gates（數據變更前強制步驟）

**新增或收緊任何 schema/format validation gate 前，必須先查詢影響範圍。**

1. 統計現有幾多 published questions、registered topics、pending admin drafts 會 fail 新 gate
2. 打印 10 個例子
3. 如有影響，必須附 migration plan，**絕對禁止以 feature change 為由令現有數據集失效**
4. 題目 JSON 格式：`correctIndex`（0-3），**非字母式**；選項會洗牌；解析引內容不引字母

---

## 7. 大愛設計與 UDL 紅線

**絕對禁止出現打擊自信嘅元素：**

- ❌ 大紅交叉、❌「FAIL」字眼
- ✅ 改為「再諗下💡」或「你發現咗一個新盲點！」
- ✅ 60 秒逆向鎖死引擎：答錯中高難度題強制凍結界面 60 秒，逼使學生從「概念盲區／審題陷阱／運算粗心」三維自診
- ✅ 無痕 SEN 專注模式（OpenDyslexic 字體、防跳行閱讀尺、隱藏倒數計時器）
- ✅ 考前深呼吸急救室（「我好緊張」按鈕觸發 1 分鐘 4-7-8 呼吸法動畫）
- ✅ 隱藏天賦雷達圖（放棄單一總分，顯示空間幾何直覺等隱藏天賦）

**SEN 功能狀態：全部上線。** ADHD／抑鬱症／焦慮症／讀寫障礙友善系統常駐，零故障保證。

---

## 8. 已否決項目永久攔截（2026-08-22 更新）

以下項目已被徹底否決，**復建 = 不合格**：

- JUPAS 預測器 / admission probability
- 收費模式 / Premium / 訂閱
- 老師平台 / IEP 草案（classes/enrollments/question_events 已刪）
- 虛構統計（Band A+5% / 轉化率 / 假在線人數）
- 假用戶見證
- 舊名 Aethel / WisdomPath / 化城避風港 / Buff 補給艙
- **長答／作文自動批改、打分、評分**（2026-08-25 新增，詳見 §16.A）
- **向未成年人隱瞞 AI 身份**（2026-08-25 新增，詳見 §16.B）
- **預填驗收表**（2026-08-25 新增，詳見 §16.C）
- **「醫療級」字眼／將 build-time 測試講成 runtime 防護**（2026-08-25 新增，詳見 §16.D）
- **瀏覽器端大語言模型**（Qwen 1.5B／每人 600MB 下載）—— 2026-08-25 廢止，改行零模型檢索版

### 8.1 Gamification —— 2026-08-22 解禁

**舊條文（2026-07-16）：**「Gamification（EXP / 段位 / combo / 火焰 / 解鎖機制）」列為永久否決。
**現行條文：** 該項否決**已撤銷**。連擊、EXP、段位、火焰、Boss 模式、解鎖機制、
虛擬貨幣（減壓緩衝區內）**准許製作**。

- **決策：** Brian（CEO）拍板，Yuna（COO）於 2026-08-22 傳達並指示執行。
- **依據文件：**《DSE_Level_Up UI／UX 整改與優化方案（Originkit Edition）》
  v2026-08-22-FINAL，§0 列明「遊戲化全家桶（Combo、XP、Boss、Rank、虛擬貨幣）
  經 CEO 拍板保留」。
- **點解要寫低：** 舊條文同新指令直接對撞。唔喺憲章度調和，每個新 session 都會
  按 §8 攔截遊戲化需求一次 —— 呢個模式（憲章自己同自己打架）過往已重複出現，
  每次都要重新爭論一輪。寫低咗，往後照憲章行事即可。

**解禁之後仍然生效嘅約束（呢幾條冇變）：**

1. **$0 成本**（§5）—— 遊戲化唔可以引入任何付費 API、新套件或雲端用量。
2. **大愛設計紅線**（§7）—— 唔准出現打擊自信嘅元素。連擊中斷、Boss 反擊、
   排名下跌一律唔可以用懲罰性回饋（震屏、紅叉、FAIL 字眼、負面音效）。
   答錯嘅回饋力度必須同答啱一致。
3. **唔可以侵蝕練習流程**（2026-08-22 Yuna 指示）—— 遊戲化層要同 `/practice`
   嘅核心作答流程解耦；練習頁本身嘅節奏、專注度同 SEN 支援優先於遊戲化。
4. **SEN 必須可以整層關掉**（§7）—— 一鍵舒適模式之下，連擊、火焰、粒子、
   成就彈窗全部隱藏，唔係調慢。
5. **虛擬貨幣只限減壓緩衝區內部，嚴禁真實貨幣交易、嚴禁換取任何學習特權**
   （免費原則 §3：遊戲化唔可以變相成為付費牆）。
6. **唔准虛構數據**（§8）—— 排行榜、在線人數、他人成績一律唔可以作假；
   冇真實數據支撐嘅比較功能寧可唔做。

**允許（一直有效）：**「減壓緩衝區」放鬆功能（呼吸動畫、金句輪播、休息按鈕），
必須 $0 成本。解禁之後，減壓緩衝區可以加入房間建造、虛擬貨幣等遊戲化元素，
但放鬆功能本身唔可以被遊戲化任務取代 —— 學生想淨係抖吓，要照樣抖得到。

---

## 9. 品牌語調與金句

**語調：** 學長學姐式共情力與熱血感，絕對唔准冷冰冰企業語氣或過度學術化腔調。

**核心金句（必須熟悉）：**
- 「最後 30 日，唔係溫書，係搶分」
- 「掌握邏輯，唔係背答案。無論數字點變，你都識答」
- 「thinka 幫你學三年，DSE Level Up 幫你贏最後三十分」
- 「Free users = mission. Revenue sustains the mission; the mission is not revenue.」
- 「慳返幾千蚊補習費，攞分嘅真功夫唔應該被窮富擋住」

---

## 10. 三關審核準則（每次輸出前強制自檢）

1. **處事層面：** 有遠見（掌握長遠趨勢）× 精準部署（每步鉅細無遺）× 細節控（學生感受得到用心）
2. **心態層面：** 熱血 Aggressive（加快成功）× 冷靜沉穩（機械人式思考，情緒不主導判斷）
3. **思考層面：** 反思對手成功哲學嘅底層邏輯，將之轉化為自身武器

---

## 11. Kimi 慣性錯誤防範清單（出 spec 前必對照）

- [ ] 無假設 Drizzle / Better Auth / Supabase Auth / middleware.ts
- [ ] 無出 SQL 動已刪／從未存在表
- [ ] correct_answer 用 `correctIndex`（0-3），非字母式
- [ ] 解析用標準書面語／英文，term-guard 攔截口語
- [ ] 無虛構統計／見證／人數
- [ ] 無復用舊名／舊功能（⚠️ gamification 已於 2026-08-22 解禁，見 §8.1，唔屬此列）
- [ ] 無建議收費／新套件／付費 API
- [ ] 無預填驗收表
- [ ] SEN 功能已上線，唔使再講「未上線」
- [ ] **無長答／作文自動批改、打分、評分**（§16.A —— 已復現 20 次，最高頻嘅一項）
- [ ] **AI 功能唔會隱瞞自己係 AI**（§16.B）
- [ ] **驗收表「最終狀態」全部留空，等實跑**（§16.C）
- [ ] **冇「醫療級」，冇將 build-time 測試講成 runtime 防護**（§16.D）

---

## 12. 生產紀律（題目入庫流程）

```
drafts/
  ↓ review-drafts.mjs（自動格式檢查）
  ↓ 真人逐題批（學科首席把關）
  ↓ promote-drafts.mjs（符合 JSON schema）
  ↓ decisions.json（實名審批記錄）
  ↓ 人手 wire 入 load.ts
  ↓ npm test（驗證通過）
```

**每 session 20 題，DIFF_RATIO 3:5:2（basic:intermediate:hard）。**

---

## 13. 免責聲明（每頁必須）

> 「本平台提供之試題均為獨立改寫版本，旨在協助考生練習應試技巧，並非香港考試及評核局（HKEAA）官方試題。官方歷屆試題請前往 HKEAA 網站下載。等級預測僅供參考，最終成績以 HKEAA 公布為準。」

---

## 14. 顏色系統參考（UI/UX）

- 暗色護眼背景 + 霓虹強調色
- 青 `#00F5D4`、粉 `#FF006E`、黃 `#FEE440`、紫 `#9B5DE5`
- 字體：Display 20pt、H1 14pt、H2 11pt、Body 9pt、Caption 7pt
- 風格：Cyber-Academic（暗底霓虹戰鬥風，非白底藍字學校風）

---

## 15. Testing 強制條文

修改題庫、topic registration、或任何模組後：
1. 運行 `npm test` 並報告 pass/fail count
2. **Tests + Working Integration 雙重 required——單獨一樣唔算完成**
3. 如有 fail，先修復，後報告

---

## 16. A／B／C／D 四條永久紅線（2026-08-25 停火令）

**來源：** 2026-08-25 22:23 最高指揮部緊急叫停令，Brian（CEO）簽署、Yuna（COO）傳達。
**適用：** 此後**任何**提案自動適用，**不經討論，直接拒絕**，唔使逐次重新爭論。

---

### 16.A 長答自動批改 —— 永久禁令

> 任何提案出現「**批改／打分／評分**」＋「**長答題／作文／Paper 2／Paper 3**」嘅組合，
> **一律預設拒絕。**

**點解要寫低：** 呢個要求**反覆復現** —— 每一版憲章、規格書、召集令都會重新引入一次，
而且措辭逐字重複（「Tone & Register 雙重語義批改」「嚴打 Blind Copying 同 Over-paraphrasing」
「C/L/O 三維分數」「必中關鍵字同加分關鍵字」）。
唔喺憲章度一次過封死，每個新 session 都要重新爭論一輪。

**復現次數（長期日誌逐次記錄）：** 編號截至 2026-08-20 已到**第 18 次**，
加埋 2026-08-27 兩份停止備忘（SEN 150 項擴展、SENSEI 召集令），**已達 20 次**。

⚠️ 停火令原稿寫「第九次」—— 嗰個係**單一 session 內**嘅計數，並非全紀錄。
真實數字高一倍有多。喺呢度寫低，係因為低估次數會令人以為係偶發疏忽，
但實情係一個**系統性、跨作者、跨文件類型**嘅模式：
出現過嘅載體包括憲章、規格書、skill 定義、我自己嘅 To-Do 清單（改寫後交返）、
題目 JSON schema 本身，甚至一份「自動批改課程」嘅賣點。

#### ⚠️ 現行機制實情（2026-08-25 逐檔核實 —— 與停火令原稿有出入，**以本節為準**）

停火令原稿寫：「現有 Regex 引擎只限客觀題（選擇題、填充題、短答題）」。
**實測：本項目根本冇任何 Regex 批改引擎**，而且填充題／長題**亦唔係機器批改**。

| 題型 | 型別定義 | 實際批改方式 |
|---|---|---|
| `mc` 選擇題 | `data/questions/types.ts:5` | `PracticeSession.tsx:433` `zh === currentQ.correctZh`（`correctZh` 由 `correctIndex` 取得，line 114）—— **唯一由機器判對錯嘅題型** |
| `text` 填充／短答 | `types.ts:43` | `referenceAnswer` 交卷後顯示，**學生自己對照自評**（`TextQuestionCard.tsx:10`） |
| `long` 長題／作文 | `types.ts:68` | 三級自評（全明／部分明白／未明），原始碼註釋明寫 **Never auto-graded**（`LongQuestionCard.tsx:13`） |

核實指令（可自行重跑）：

```
grep -rniE "acceptedAnswers|gradeText|checkText|answerKeywords|rubricMatch" lib/ components/ app/
→ 全 repo 零命中
```

（`keyword` 嘅命中全部係畀學生睇嘅提示文案，例如 `lib/lockoutQuestions.ts:65`
「circle the keywords」，唔係評分邏輯。）

#### 正確條文

> **機器只為 `mc` 出對錯。`text` 同 `long` 平台一分都唔出** ——
> 只提供參考答案／評分準則畀學生自評。

呢個比停火令原稿**更嚴**，而且係現況。

⚠️ **點解唔可以照抄原稿嗰句：**「Regex 引擎可批改填充題、短答題」寫入憲章之後，
會被下一個 session 讀成**授權**，然後真係去起一個 —— 一條用嚟收窄嘅紅線
反而變成放寬。憲章入面嘅「現況描述」如果同實情唔符，殺傷力同假需求一樣大。

#### 結構性防護（唔准拆）

`StepHints` 嘅唯一 prop 係 `subjectId` —— 佢**收唔到學生寫嘅嘢**，
所以長答自動批改喺物理上唔可能發生。呢個唔係巧合，係設計。

---

### 16.B AI 身份誠實義務

> SENSEI 或任何其他 AI 功能，**可以**採用師兄師姐語氣，
> 但**被問及是否真人時必須如實回答**。
> **絕對禁止向未成年人隱瞞 AI 身份。**

#### 標準回答（停火令核准，逐字）

> 「Sensei 係 DSE LEVEL UP 嘅 AI 學習助手，設計成師兄師姐嘅語氣陪你溫書。
> 雖然 Sensei 唔係真人，但背後嘅知識同建議全部係由考過 DSE 嘅團隊審核過嘅。」

#### 點解

用戶群係 **12–18 歲**。一個中六生半夜三點同「師兄」傾偈，
以為對面係真人嗰陣**投放嘅信任**，同佢知道係 AI 完全唔同。
再配合情緒語氣適配，一個情緒低落嘅學生會將佢當成情感支持。

呢條同 §8 禁「假用戶見證」「虛構 persona 當真人」係同一條原則 ——
只不過今次個虛構對象係 24 小時貼身嘅。

**語氣同誠實唔矛盾。** 親切、唔端架子、講返自己點衰過 —— 全部照做得。

#### 執行要求

1. 介面永遠有一個**唔遮得住**嘅 AI 標示（唔可以摺埋、唔可以只喺首次出現）
2. 「你係咪真人／你係咪 AI／你係唔係機械人」必須觸發如實回答 ——
   唔可以繞開、唔可以打哈哈、唔可以反問
3. 呢個判定必須有測試鎖住，唔可以只靠 prompt

---

### 16.C 預填驗收表 —— 即時停火

> 驗收表任何「最終狀態」欄位**必須留空**，直到有人**實際跑過**。
> **「冇人跑就填」呢個動作本身就係違規，不論數字最終啱唔啱。**

**觸發即停火，唔使爭論。** 適用於：QA 閘表、測試 pass/fail 數、tsc／eslint 狀態、
build 結果、「已上線／已完成」欄位。

**點解要寫「不論數字啱唔啱」：** 2026-08-25 嗰張七閘表最後驗出嚟七項全部真係綠 ——
但佢係**填先、跑後**。今次啱，下次唔啱嗰陣一樣會綠，而且冇人會再核。
一張填得出「✅ 真實閘：有無假陳述？通過」而冇人跑過嘅表，本身就係佢要捉嘅嘢。

**執行：**
1. 虛擬 persona **唔可以做驗收人**（Kelly／Ghost／Plaaaaaa 等只提供檢查清單）
2. 數字由實跑者填，並附可重跑嘅指令
3. 未跑嘅一律寫「⬜ 待驗證」，唔准寫 ✅

---

### 16.D 禁止 runtime／醫療防護聲稱

> 唔准用「**醫療級**」三個字。
> 唔准將 **build-time 測試**講成 **runtime 防護**。

**判例（2026-08-25，光敏感）：**

| 寫過 | 實情 |
|---|---|
| 「**自動攔截**超過 3Hz 嘅閃爍動畫，癲癇／光敏感學生可以**安心溫書**」 | 3Hz 閘係 `lib/__tests__/sen-accessibility.test.mts:321` 一個 **build-time 測試**，掃 `globals.css` 然後 fail build。**runtime 攔截 = 零** |

**點解呢項比一般誇大嚴重：** 一個光敏感學生睇到「有自動攔截」，可能因此
**唔開自己部機或瀏覽器嘅光敏防護**。呢個唔止係誇大，係一個**會改變學生安全行為**
嘅假聲稱。

**正確講法（准用）：**

> 「我哋自己嘅動畫全部低於 3Hz，而且有測試鎖住，唔會有一日改壞咗都冇人知。」

呢句已經夠好，而且係真。

**通用規則：** 描述任何安全／無障礙功能之前，先答一條問題 ——
**「呢樣嘢喺學生部機上運行緊，定係喺我哋部 CI 度運行緊？」**
答案係後者，就唔可以用保護學生嘅語氣去講。

---

*此文件由 Yuna（COO）核准，Brian（CEO）確認生效。任何更新須經雙人簽署。*
*DSE LEVEL UP — 戰場只有一個，目標只有一個：幫香港考生贏最後三十分。*
