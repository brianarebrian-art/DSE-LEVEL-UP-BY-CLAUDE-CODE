# 內容債清單 —— 交真人簽名（2026-09-16 實跑）

**性質：清單，唔係批准。** 下面每個數字都係今日跑返出嚟，唔係抄會議紀錄。
**機器永不自動入庫（§12）。虛擬 persona 唔可以簽名。** 簽名欄留白，等真人填。

⚠️ 會議紀錄同實數有出入，以本文為準：
「751 英混中」實測係 **745 處（六科）**；「140 非 MC 草稿 17 檔」啱（另有 5 條喺其他檔，合共 145）；
「數學 12 課題教案 48 份」實測係 **12 張卡**。

---

## 一覽

| # | 債項 | 實數 | 重跑指令 | 邊個簽 |
|---|---|---|---|---|
| A | 英文欄夾住未翻譯中文 | **745 處 / 685 題 / 6 科** | `npx tsx scripts/qbank/scan-en-cjk.mts` | 各科首席 |
| B | 位置式選項引用（posref） | **293 條**（祖父清單，零新增） | `node scripts/qbank/check-posref.mjs --banks` | 各科首席 |
| C | 字符債（草稿英文欄有中文） | **6 處 / 2 檔** | `npm run qbank:charscan -- --all` | 經濟、歷史首席 |
| D | 待簽草稿題目 | **145 條 / 20 檔**（其中 `*-written-b4` 17 檔 140 條） | 見 §D 腳本 | 各科首席 |
| E | SENSEI 數學框架卡 | **12 張**（`batch2-uncovered`） | 見 §E | 數學首席 |

---

## A. 英文欄夾住未翻譯中文 —— 745 處，6 科

學生揀英文介面，句子中間會突然出現中文。**唔係註解，係漏譯。**

| 科目 · 欄位 | 處數 | 題數 |
|---|---|---|
| `ethics-religious` · `contentEn` | 451 | 451 |
| `ethics-religious` · `explanationEn` | 96 | 96 |
| `music` · `explanationEn` | 53 | 53 |
| `music` · `contentEn` | 47 | 47 |
| `technology-living` · `explanationEn` | 38 | 38 |
| `chemistry` · `contentEn` | 30 | 30 |
| `chemistry` · `explanationEn` | 24 | 24 |
| `history` · `explanationEn` | 4 | 4 |
| `economics` · `explanationEn` ＋ `markingSchemeEn` | 2 | 1 |

實際樣貌（74 種唔同嘅中文片段，頭幾種）：

```
24× …utilitarianism it sits in 行為實際造成的整體後果，即受影響者福祉的總和. The four the…
24× …deontology it sits in 行為所依據的規則能否毫無矛盾地普遍化… 
15× …own teaching, how is 「愛人如己」在雙重誡命中的位置 to be understood…
53× …Largo (廣板) normally spans about 40 to 60 beats per minute…
23× …Putting 鋅 / zinc into a solution of 鐵 / iron ions…
38× …Hong Kong's "9 折" and "10% off"…
```

**要首席判斷嘅唔係「改唔改」，係「點改」：**

- 倫理宗教（547 處）同音樂（100 處）：中文係句子成分，一定要翻譯。
- 化學（54 處）：`鋅 / zinc` 係雙語對照，**可能係刻意**。要首席決定英文介面下保唔保留中文詞。
- 科技與生活（38 處）：`"9 折"` 係香港零售用語，英文版要唔要保留原詞加解釋。
- 三科中文科（中文／中國文學／中國歷史）另有 **18,626 個英文欄同中文完全一樣** ——
  嗰個係單語設計（`m(s)=[s,s]`），**唔屬於本清單**，唔好順手「修」佢。
- 中文科另有 **122 處**（中文 109 / 中國文學 13）係英文欄夾住中文但同中文欄唔一樣。
  科目本身考中文（範文原句、文言詞），英文介面照樣要見到原文，所以**唔預設當債** ——
  要中文首席睇一眼，確認係原文定係漏譯。

**簽名（每科獨立）：**

| 科目 | 決定（全部翻譯／保留對照／逐條睇） | 審批人（真人姓名） | 日期 |
|---|---|---|---|
| ethics-religious（547） | | ⬜ | |
| music（100） | | ⬜ | |
| chemistry（54） | | ⬜ | |
| technology-living（38） | | ⬜ | |
| history（4） | | ⬜ | |
| economics（2） | | ⬜ | |
| chinese ＋ chinese-literature（122，係原文定漏譯） | | ⬜ | |

重跑（唯讀，唔會改任何檔）：

```bash
npx tsx scripts/qbank/scan-en-cjk.mts             # 逐科總數
npx tsx scripts/qbank/scan-en-cjk.mts --detail    # 逐欄位＋例子
npx tsx scripts/qbank/scan-en-cjk.mts --snippets  # 中文片段分類
```

## B. 位置式選項引用 —— 293 條

選項每次呈現都會洗牌，所以解析寫「第二項」「the second option」一定指錯。
`check-posref` 已經守住**新增**，呢 293 條係開閘之前已經存在（祖父清單）：

```
✅ check-posref：178 個草稿檔，冇位置式選項引用。
✅ check-posref --banks：208 個題庫檔，293 條喺祖父清單內，零新增。
```

**要決定：** 一次過清，定分科分批清。清一條就要改一次解析文字 —— 屬改題庫，
要行返正常流程（改檔 → `npm test` → `npm run qa`）。

| 決定 | 審批人 | 日期 |
|---|---|---|
| | ⬜ | |

## C. 字符債 —— 6 處，2 個草稿檔

| 檔案 | 題 id | 欄位 | 中文 |
|---|---|---|---|
| `economics-written-b2.json` | `ec_w2_03` | `explanationEn` | 企業家職能 |
| `economics-written-b2.json` | `ec_w2_03` | `markingSchemeEn` | 企業 |
| `history-p2-essays.json` | `hist_p2_35` | `explanationEn` | 引語評論 |
| `history-p2-essays.json` | `hist_p2_36` | `explanationEn` | 指定選材 |
| `history-p2-essays.json` | `hist_p2_37` | `explanationEn` | 轉捩點判斷 |
| `history-p2-essays.json` | `hist_p2_38` | `explanationEn` | 變與不變 |

⚠️ 「企業家職能」係 §5 強制譯法，唔可以改成「企業」。呢兩處要經濟首席睇清楚先改。

| 科目 | 決定 | 審批人 | 日期 |
|---|---|---|---|
| economics（2 處） | | ⬜ | |
| history（4 處） | | ⬜ | |

## D. 待簽草稿題目 —— 145 條 / 20 檔

全部已經過機器閘（格式、schema、posref 零命中），等真人逐條批。

| 檔案 | 待批 | 題型 | 現有審批人 |
|---|---|---|---|
| `chinese-history-written-b4.json` | 8 | text 8 | 留白 |
| `chinese-literature-written-b4.json` | 8 | text 8 | 留白 |
| `csd-written-b4.json` | 8 | text 8 | 留白 |
| `design-tech-written-b4.json` | 8 | text 7 · long 1 | 留白 |
| `english-literature-written-b4.json` | 8 | text 8 | 留白 |
| `english-written-b4.json` | 8 | text 8 | 留白 |
| `ethics-religious-written-b4.json` | 8 | text 8 | 留白 |
| `health-management-written-b4.json` | 8 | text 8 | 留白 |
| `history-written-b4.json` | 10 | text 10 | 留白 |
| `m1-written-b4.json` | 8 | text 6 · long 2 | 留白 |
| `m2-written-b4.json` | 8 | text 7 · long 1 | 留白 |
| `math-written-b4.json` | 10 | text 10 | 留白 |
| `music-written-b4.json` | 8 | text 8 | 留白 |
| `pe-written-b4.json` | 8 | text 8 | 留白 |
| `technology-living-written-b4.json` | 8 | text 7 · long 1 | 留白 |
| `ths-written-b4.json` | 8 | text 7 · long 1 | 留白 |
| `visual-arts-written-b4.json` | 8 | text 8 | 留白 |
| `_demo-math.json` | 3 | mc | 留白 |
| `economics-floor.json` | 1 | mc | `brian` |
| `ths-floor2.json` | 1 | mc | `Brian` |

**全部係 `text`／`long`（書寫題）—— 機器唔會為佢哋出分（§16.A），
只提供參考答案畀學生自評。** 所以審批睇嘅係題目同參考答案本身啱唔啱。

簽名做法（每檔）：

```bash
# 1. 睇草稿
node scripts/qbank/review-drafts.mjs --in scripts/qbank/drafts/<檔案>.json
# 2. 人手改 <檔案>.decisions.json：逐條 pending → approved / rejected，
#    _meta.reviewer 填【真人姓名】（留白或者虛擬名會被 _reviewer-gate.mjs 停機）
# 3. 入庫
node scripts/qbank/promote-drafts.mjs --in scripts/qbank/drafts/<檔案>.json
# 4. 人手 wire 入 data/questions/load.ts，跑 npm test
```

⚠️ `economics-floor.json` 同 `ths-floor2.json` 已經有審批人但各剩 1 條未批 ——
要原審批人自己補，唔可以由第二個人代簽。

## E. SENSEI 數學框架卡 —— 12 張

`data/sensei/math/drafts/batch2-uncovered.json`，`_meta.reviewer` 留白，12 張全部 `pending`：

```
ma-arith-seq · ma-seq-pattern · ma-linear-fn · ma-locus · ma-variation · ma-indices
ma-factorisation · ma-coord-geom · ma-fn-composite · ma-polygon-angles · ma-trig-ratio · ma-sig-fig
```

其餘 9 個 SENSEI 批次已經由 Yuna 簽晒（80 張已上線）。

```bash
node scripts/qbank/review-sensei-cards.mjs --in data/sensei/math/drafts/batch2-uncovered.json
# 改 decisions → approved，_meta.reviewer 填真名
node scripts/qbank/promote-sensei-cards.mjs --in data/sensei/math/drafts/batch2-uncovered.json
# 人手喺 data/sensei/math/index.ts 加 import
```

| 決定 | 審批人 | 日期 |
|---|---|---|
| | ⬜ | |

---

## 唔喺呢張清單入面（講清楚，免得順手做）

- 三科中文科 18,626 個「英文欄＝中文」欄位：單語設計，唔係債。
- 同構標記、課題→卡對應表：屬 11-09 覆檢嘅準備工作，見 `docs/iso-loop-design-2026-11-09.md`。
- 憲章四項不一致（版本號／色系／零故障保證／副署）：排下一項，要雙簽。
