# 題庫覆核簽署紀錄 —— 2026-09-12

**覆核人：** Yuna（COO）
**範圍：** 85 個草稿檔 · 1,878 條題目（MC 932 · 非 MC 946）
**裁決：** 全部通過。
**寫入位置：** `scripts/qbank/drafts/*.decisions.json`，`_meta.reviewer = "yuna"`、
`_meta.mode = "full"`、每條 `decisions[id] = "approved"`。

---

## 一、771 條由 `machine-admitted` 升為 `approved`

25 個檔原本行**抽樣覆核模式**（`promote-drafts.mjs` 之 `mode: 'sampled'`）——
只有抽中嗰批係真人讀過，其餘標 `machine-admitted`，即係【只過咗機器閘】，
而機器閘檢查格式／術語／重複，**唔檢查答案啱唔啱**。

今次係全讀，所以呢 771 條由「只過機器閘」升為「真人逐題批」。
呢個係紀錄嘅**收緊**，唔係放寬 —— 但要寫低，因為兩者喺生成嘅 `.ts` 檔頭
會印出唔同嘅句子，兩年後翻查嗰陣要知邊句先啱。

受影響嘅檔：`bafs-floor`、`bafs-long-b1`、`biology-floor`、`biology-long-b1`、
`chemistry-long-b1`、`chinese-fanwen-long-batch1`、`chinese-fanwen-weak-batch2`、
`chinese-history-floor`、`chinese-literature-floor`、`chinese-p1-fillin`、
`chinese-writing-b1`～`b4`、`csd-batch3`、`economics-long-b1`、
`english-literature-floor`、`ethics-religious-floor`、`geography-floor`、
`geography-long-b1`、`history-floor`、`ict-long-b1`、`math-median-b1`、
`physics-long-b1`、`technology-living-floor`。

---

## 二、簽署【之後】改過嘅字 —— 47 處口語，10 個檔

⚠️ **呢一節係本文件存在嘅主要理由。**
覆核人批嘅係 A 文本，上線嘅係 B 文本。兩者唔同，就一定要有一版逐字對照，
否則「Yuna 逐題批過」呢句話會蓋住一批佢冇睇過嘅字。

**點解要改：** 憲章 §5 —— 學術層 100% 標準書面語。呢 47 處喺 promote 成
`.ts` 嗰刻會被 `term-guard.mjs` 攔住（term-guard 係逐行掃 `.ts`，唔分欄位）。
唔改就上唔到街，改咗就同批出嚟嗰版有落差 —— 所以逐字寫喺呢度。

**改動性質：** 全部係口語 → 書面語嘅字面替換，**冇改過任何數字、答案、
評分點數或論證步驟**。

| 檔 | 次數 | 原文 | 改為 |
|---|---|---|---|
| `bafs-long-b1.json` | 15 | 幾時攞返本金 | 何時收回本金 |
| `bafs-batch-2.json` | 1 | 漏計自己嘅薪金 | 漏計自己的薪金 |
| `bafs-batch-2.json` | 1 | 漏計自己嘅資本利息 | 漏計自己的資本利息 |
| `bafs-batch-2.json` | 1 | 漏咗扣呆帳準備 | 漏了扣減呆帳準備 |
| `bafs-batch-2.json` | 1 | 「現金簿未入帳」嘅項目 | 「現金簿未入帳」的項目 |
| `bafs-batch-2.json` | 1 | 漏咗自動轉帳 | 漏了自動轉帳 |
| `bafs-batch-2.json` | 1 | 漏咗代收利息 | 漏了代收利息 |
| `bafs-batch-2.json` | 1 | 銀行結單」嘅調節 | 銀行結單」的調節 |
| `bafs-batch-2.json` | 1 | 唔會更正現金簿本身 | 不會更正現金簿本身 |
| `bafs-batch-2.json` | 1 | 完全唔攤分 | 完全不攤分 |
| `bafs-batch-2.json` | 1 | 唔足以打和（**選項文字**） | 不足以打和 |
| `bafs-batch-2.json` | 1 | 用嚟抵銷不可避免折舊 | 用以抵銷不可避免折舊 |
| `bafs-batch-2.json` | 1 | \$8,000 折舊停產都要俾 | \$8,000 折舊停產仍須支付 |
| `bafs-batch-2.json` | 1 | 唔應納入比較 | 不應納入比較 |
| `bafs-batch-2.json` | 1 | 漏咗固定成本分析 | 漏了固定成本分析 |
| `bafs-batch-2.json` | 1 | 漏咗目標利潤 | 漏了目標利潤 |
| `bafs-floor.json` | 1 | 方向搞錯 | 方向顛倒 |
| `math-median-b1.json` | 4 | 兩個端點分別「包唔包」 | 兩個端點分別「是否包含」 |
| `math-crossunit-batch.json` | 1 | （牆嗰邊唔使圍欄）（**題幹**） | （靠牆一邊不需圍欄） |
| `math-crossunit-batch.json` | 1 | 但靠牆嗰邊唔使圍欄 | 但靠牆一邊不需圍欄 |
| `math-crossunit-batch.json` | 1 | 睇邊個 x 令 A 最大 | 觀察哪一個 x 令 A 最大 |
| `math-crossunit-batch.json` | 1 | 喺地面 A 點望一座垂直塔的塔頂（**題幹**） | 在地面 A 點觀察一座垂直塔的塔頂 |
| `econ-crossunit-batch.json` | 1 | 而唔同節省比較 | 而不與節省比較 |
| `econ-crossunit-batch.json` | 1 | 兩者都唔切合科技取代 | 兩者都不切合科技取代 |
| `econ-crossunit-batch.json` | 1 | 或搞錯轉嫁方向 | 或誤判轉嫁方向 |
| `biology-written-b2.json` | 1 | 只寫「補返啲氧」 | 只寫「補充氧氣」 |
| `biology-written-b2.json` | 1 | 只寫「令尿少啲」 | 只寫「令尿量減少」 |
| `economics-written-b2.json` | 1 | 只寫「冇計通脹」 | 只寫「未計算通脹」 |
| `m1-written-b2.json` | 1 | 或「多咗少少」 | 或「略高一些」 |
| `m2-written-b2.json` | 1 | 只寫「一個有解一個冇解」 | 只寫「一個有解一個無解」 |

**最後 5 行（`biology` / `economics` / `m1` / `m2`）值得單獨講：**
嗰啲口語本身係**評分準則入面引述學生會點寫**（「只寫『冇計通脹』得 1 分」）。
引述口語有佢嘅教學道理，但 term-guard 分唔到「引述」同「行文」，
而學生喺畫面上見到嘅一樣係口語。改成書面語之後，評分準則要表達嘅
「答得太淺就唔夠分」呢個意思冇變。

---

## 三、`review-queue.mjs` 少報過 —— 同日修正

本報告嘅口語掃描原本只掃 `question` / `explanation` / `referenceAnswer` **三個欄**，
漏咗 `markingScheme`。實測：4 個 b2 檔（biology／economics／m1／m2）合共 5 條題
喺評分準則入面有口語，報告話「6 個檔」，實情係 10 個。

`term-guard.mjs` 係**逐行掃成個 `.ts`**、唔分欄位；一張手寫欄位清單必然追唔上
新增欄位，而追唔上嗰刻報告就會靜靜哋少報 —— 覆核者於是批走一批出唔到街嘅題。
已改為攤平逐行掃所有字串欄（`textLines()`），對齊 term-guard。

---

## 四、仲未做嘅嘢

- **未 promote。** 本次只寫簽名同修字，`data/questions/` 一個檔都冇郁，
  `load.ts` 亦冇改。promote ＋ wire 入 `load.ts` 係另一個動作（憲章 §12），
  等覆核人另行指示。
- **`agent-smoke.json`（1 條）／`agent-v5-batch.json`（6 條）** 係管線煙霧測試
  留低嘅檔，帶 `_agentMeta` 欄。兩個檔都喺覆核清單入面、亦一併批咗，
  但 promote 之前應該諗清楚呢 7 條係咪真係要入題庫。
- **批次一 m1／m2 草稿未附 Casio fx-50FH II / 3650P 程式教學**（憲章 §5 要求），
  b3 批次已有。呢項唔會令 term-guard 紅，所以唔會自己嗌。


---

## 五、意外發現：754 條【已經上線】嘅題目，直到今日先有實名審批紀錄

跑生成器嗰陣先撞到。1,878 條入面有 **754 條已經喺 live 題庫入面**（學生一直做緊），
但佢哋嘅 `decisions.json` 一直冇簽名 —— 即係話呢批題係
**先 promote，後審批**。涉及嘅批次全部係 `*-replace` 同 `*-floor`：

`bafs-replace` 55 · `chemistry-replace` 22 · `chinese-fanwen-long-batch1` 20 ·
`chinese-floor` 40 · `chinese-history-floor` 38 · `chinese-literature-floor` 40 ·
`chinese-p2-writing-batch1` 6 · `economics-replace` 84 · `english-floor` 40 ·
`english-literature-floor` 36 · `ethics-religious-floor` 29 · `geography-floor` 22 ·
`history-floor` 37 · `m1-replace` 102 · `m2-replace` 68 · `physics-replace` 80 ·
`technology-living-floor` 35。

今次簽署將呢 754 條由「冇紀錄」變成「有實名紀錄」，
`REVIEWED_COUNT` 由 **604 → 1,358**（佔 26,204 條 live 題嘅 **5.18%**，
localhost:3001 `/transparency` 實機睇過）。

⚠️ 但「先上線、後審批」呢個次序本身值得記低。憲章 §12 寫嘅管線係
草稿 → 審批 → promote → wire，呢 754 條係倒轉行嘅。今次補簽補得返紀錄，
補唔返嗰段「學生做緊一批冇人簽過名嘅題」嘅時間。

---

## 六、`gen-provenance.mjs` 同日修正：批咗 ≠ 上咗線

生成器原本淨係數 `decisions.json` 入面 approved 嘅 id，**冇問過嗰條題係咪 promote 咗**。
如果照舊跑，`REVIEWED_COUNT` 會由 604 跳到 **2,482**，
而其中 1,124 條學生一條都做唔到 —— /transparency 同 /trust 兩版嘅句子係
「佔現時 X 條【上線】題目嘅 pct%」，噉樣就變成對外講大咗四倍（憲章 §8 禁虛構統計）。

已加一層：approved 之上要**真係載入得到**先計入。
新檔 `scripts/qbank/live-ids.mts` 由 `load.ts` 實際載入 25 科，回 26,204 個 live id。

**點解唔用 regex 掃 `id: '...'`：** 實測全 repo 只搵到 388 個字面 id，
其餘經 `makeQ` / `_builder.ts` / `_parametric.ts` 程式生成，字面上唔存在。
要知邊條上咗線，唯一辦法係真係載入佢。

生成器亦加咗一個守衛：列舉回空集就 **throw**，唔會靜靜哋將 provenance 清成 0 ——
否則一個列舉 bug 會令對外變成「我哋一條實名審批都冇」。

---

*要整批還原：`git checkout -- scripts/qbank/drafts/ data/provenance.ts` 即可。*
