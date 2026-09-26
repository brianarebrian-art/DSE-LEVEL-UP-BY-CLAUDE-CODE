# 課題與教育局課程指引對照表（2027 年文憑試）

> **狀態：唯讀審核結果。** 本文件只記錄對照結果，**未有刪除、修改或新增任何題目**。
> 表中「部分」及「未見」的處理方法須由創辦人決定；任何刪除或替換均須經憲章 §12 的人手審批流程。
>
> 審核日期：2026-09-26 ｜ 審核人：Claude（AI）—— 判斷屬閱讀指引後的意見，須由學科負責人覆核。
> 由 Yuna（COO）2026-09-26 批准進行（「題庫守門員」三條規則中的規則 ②）。

## 做法

1. 由教育局網站下載 25 科（23 份）現行《課程及評估指引》（中四至中六）。
2. 逐份確認版本是否適用於 **2027 年文憑試考生**（即 2024/25 年度升讀中四者）。
   經濟及中國文學的最新版本由 2025/26 年度中四起生效，故改用前一版。
3. 以網站現有 298 個已登記課題（合共 27,321 題），逐個對照指引的課程架構章節，記錄章節名稱及 PDF 頁碼。
4. 對可疑課題抽樣閱讀題目（每個約 12 題），並以經濟科指引列明「NOT required」的概念掃描全科題目。

**版權：** 指引版權屬教育局。本文件只引用章節名稱及頁碼，不轉載指引內文；指引 PDF 不存入 repo，需要時按表內連結重新下載。
**頁碼：** 一律為 PDF 檔的頁序，而非指引印刷頁碼。

## 判斷分類

| 分類 | 意思 |
|---|---|
| 必修 | 課題屬指引必修部分 |
| 選修 | 課題只屬某選修單元或某組別；未選該選修的學生不必溫習 |
| 前備 | 初中（或小學）內容；指引列明公開試假定已掌握，但並非高中學習重點 |
| 部分 | 課題部分題目符合指引，部分超出範圍、深度不符或與課題名稱不符 |
| 未見 | 指引沒有相關內容 |

## 總結

| 分類 | 課題數 | 題數 |
|---|--:|--:|
| 必修 | 259 | 23,823 |
| 選修 | 18 | 1,797 |
| 前備 | 6 | 291 |
| 部分 | 13 | 1,190 |
| 未見 | 2 | 220 |

「必修」只代表課題名稱與指引相符，**不保證課題內每一題的深度都在指引範圍內**。本次沒有逐題閱讀全部題目。

## 主要發現（題目層面）

| 科目 | 課題／題目 | 題數 | 發現 |
|---|---|--:|---|
| 倫理與宗教 | `religion_philosophy` | 110 | 指引全文沒有宗教哲學（設計論證、惡的難題等）。**未見** |
| 倫理與宗教 | `religion_society` | 110 | 多為研究宗教群體的方法；指引沒有此部分，最接近的 Faiths in Action 屬體驗學習，2027 年評核大綱不考。**未見** |
| 倫理與宗教 | `eth_floor_26` | 1 | 考伊斯蘭教；指引列明伊斯蘭教單元尚未推行 |
| 經濟 | `ppf` | 69 | 必修部分明文不需要生產可能線，只屬選修二（2015 版 p.30、p.32） |
| 經濟 | `econ-ms-mc-4`／`-8`／`-9` | 3 | 以 MR＝MC 分析壟斷定價；必修明文不需要，屬選修一（p.24、p.31） |
| 經濟 | `econ_mf_90` | 1 | 解說使用指引列明不需要的「帕累托」一詞（題目本身沒有問題） |
| BAFS | 折舊、比率、成本定價（六個課題） | 566 | 指引只在會計組選修出現（p.26–30）；商業管理組學生不必溫習 |
| BAFS | `financial_mgmt` | 99 | 只屬商業管理組選修（p.35） |
| 物理 | `pb_e4` 系列（`pressure_density`） | 30 | 質量密度 ρ = m/V，指引沒有，屬初中科學 |
| 歷史 | `hisb_di1` 系列（`dictatorship`） | 48 | 議席過半算術題，並非歷史內容 |
| 中國歷史 | `ch_hkt` 系列（`hk_taiwan`） | 92 | 以虛構朝代出題的通用比較方法題，與「香港與兩岸」課題不符 |
| 旅遊與款待 | `ths_hotel_metrics` | 84 | 入住率、平均房價、RevPAR 計算指引未見；指引只提及房租類型（p.25） |
| 科技與生活 | `tl_nutrition_calc` | 96 | 能量值（千卡）計算指引未見 |
| 設計與應用科技 | `dat_mechanisms_calc` | 98 | 力矩、機械利益只見於選修單元三（p.35） |
| 數學 | 百分數、多邊形、相似、近似、因數倍數 | 224 | 初中或小學內容；指引列明假定已掌握（p.128） |

## 本次沒有做的事

- 沒有逐題閱讀 27,321 題；只抽樣閱讀可疑課題，並對經濟科做關鍵詞掃描。
- 沒有核對英國文學、中國文學的 **2027 年指定作品**（屬評核大綱範圍，並非課程指引）。
- 沒有修改 `lib/electives.ts` 的 `TOPIC_SCOPE`。按本表，經濟 `ppf`、BAFS 會計組課題等可以加入選修篩選，但須另行決定。

## 逐科對照

### 數學（必修部分）（`math`）

指引：[Mathematics C&A Guide（2007，2017 年 12 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/CA_2017_e.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `quadratic_equations` | 二次方程 | 284 | 必修 | LU1 Quadratic equations in one unknown（p.25） |
| `probability` | 概率 | 44 | 必修 | LU16 More about probability（p.44） |
| `functions` | 函數與建模 | 52 | 必修 | LU2 Functions and graphs（p.27）；LU9（p.34） |
| `trigonometry` | 三角函數 | 47 | 必修 | LU14 More about trigonometry（p.42） |
| `statistics` | 統計 | 44 | 必修 | LU17 Measures of dispersion；LU18 Uses and abuses of statistics（p.44–46） |
| `logarithms` | 對數與指數 | 44 | 必修 | LU3 Exponential and logarithmic functions（p.29） |
| `sequences` | 數列 | 85 | 必修 | LU7 Arithmetic and geometric sequences（p.32） |
| `percentage` | 百分數與利率 | 45 | 前備 | 初中內容；指引 p.128 列明公開試假定已掌握 S1–3 內容 |
| `coordinate_geometry` | 坐標幾何 | 57 | 必修 | LU10 Equations of straight lines（p.35）；LU13 Equations of circles（p.41） |
| `inequalities` | 不等式 | 44 | 必修 | LU8 Inequalities and linear programming（p.34） |
| `circles` | 圓的幾何特性 | 44 | 必修 | LU11 Basic properties of circles（p.36） |
| `trig_3d` | 三維三角學 | 44 | 必修 | LU14（p.42） |
| `permutation_combination` | 排列與組合 | 44 | 必修 | LU15 Permutations and combinations（p.43） |
| `locus` | 軌跡與坐標 | 70 | 必修 | LU12 Loci（p.40） |
| `polygons` | 多邊形與角 | 47 | 前備 | 初中內容（p.128） |
| `similar_solids` | 相似形與相似立體 | 44 | 前備 | 初中內容（p.128） |
| `variation` | 變分 | 65 | 必修 | LU6 Variations（p.32） |
| `approximation` | 近似與誤差 | 44 | 前備 | 初中內容（p.128） |
| `number_systems` | 數系 | 44 | 必修 | LU1.8–1.9 數系與複數（p.27） |
| `indices` | 指數定律 | 64 | 必修 | LU3.1 有理指數（p.29）；整數指數屬初中 |
| `linear_functions` | 一次函數 | 76 | 必修 | LU10（p.35）；部分屬初中 |
| `factors_multiples` | 因數與倍數 | 44 | 前備 | 抽樣所見為整數 H.C.F. 計算，屬小學／初中；必修只有 LU4 多項式的 H.C.F.／L.C.M.（p.31） |
| `arithmetic_sequence` | 等差數列 | 142 | 必修 | LU7（p.32） |
| `geometric_sequence` | 等比數列 | 45 | 必修 | LU7（p.32） |
| `polynomials` | 餘式與因式定理 | 61 | 必修 | LU4 More about polynomials（p.31） |

### 數學 M2（代數與微積分）（`m2`）

指引：[Mathematics C&A Guide（2007，2017 年 12 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/CA_2017_e.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `differentiation` | 微分法 | 108 | 必修 | M2 LU7（p.73） |
| `integration` | 積分法 | 103 | 必修 | M2 LU9–10（p.76–78） |
| `limits` | 極限 | 103 | 必修 | M2 LU6（p.72） |
| `matrices` | 矩陣與行列式 | 105 | 必修 | M2 LU12–13（p.80） |
| `vectors` | 向量 | 98 | 必修 | M2 LU15–17（p.82–85） |
| `mathematical_induction` | 數學歸納法 | 101 | 必修 | M2 LU2（p.68） |
| `binomial_theorem` | 二項式定理 | 94 | 必修 | M2 LU3（p.69） |
| `calculus_app` | 微積分應用 | 102 | 必修 | M2 LU8、LU11（p.75、p.79） |
| `m2_vectors_3d` | 三維向量 | 102 | 必修 | M2 LU15–17（p.82–85） |
| `linear_systems` | 線性方程組 | 103 | 必修 | M2 LU14（p.82） |

### 數學 M1（微積分與統計）（`m1`）

指引：[Mathematics C&A Guide（2007，2017 年 12 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/CA_2017_e.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `permutation_combination` | 排列與組合 | 67 | 前備 | 必修 LU15；指引 p.128 列明延伸部分假定已掌握必修內容 |
| `binomial` | 二項式定理 | 85 | 必修 | M1 LU1 Binomial expansion（p.53） |
| `exp_log_calculus` | 指數對數微積分 | 68 | 必修 | M1 LU2–4（p.54–56） |
| `calculus_app` | 微積分應用 | 107 | 必修 | M1 LU6–8（p.58–59） |
| `probability_dist` | 概率分佈 | 82 | 必修 | M1 LU11–12（p.61–62） |
| `normal_distribution` | 正態分佈 | 81 | 必修 | M1 LU16–18（p.63–64） |
| `statistics_inference` | 統計推斷 | 63 | 必修 | M1 LU19–20（p.65–66） |
| `m1_distributions` | 概率分佈（高階） | 63 | 必修 | M1 LU11–15（p.61–63） |
| `m1_normal_calc` | 正態分佈計算 | 122 | 必修 | M1 LU17–18（p.64） |
| `differentiation` | 微分 | 144 | 必修 | M1 LU3–5（p.55–57） |
| `integration` | 積分 | 80 | 必修 | M1 LU7–9（p.58–61） |
| `binomial_distribution` | 二項分佈 | 71 | 必修 | M1 LU13（p.63） |

### 物理（`physics`）

指引：[Physics C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Phy_C_and_A_Guide_updated_e_20151126.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `mechanics` | 力學 | 92 | 必修 | II Force and Motion（p.25） |
| `electricity` | 電學 | 222 | 必修 | IV Electricity and Magnetism（p.25） |
| `heat` | 熱學 | 69 | 必修 | I Heat and Gases（p.25） |
| `waves` | 波動 | 80 | 必修 | III(a) Nature and properties of waves（p.25） |
| `optics` | 光學 | 74 | 必修 | III(b) Light（p.25） |
| `radioactivity` | 放射現象 | 90 | 必修 | V Radioactivity and Nuclear Energy（p.25） |
| `phys_hell_mechanics` | 多步計算・力學 | 65 | 必修 | II（p.25） |
| `phys_hell_elec_heat` | 多步計算・電與熱 | 53 | 必修 | I、IV（p.25） |
| `phys_hell_wave_optics` | 多步計算・波動光學放射 | 68 | 必修 | III、V（p.25） |
| `kinematics` | 運動學 | 105 | 必修 | II(a) Position and movement（p.25） |
| `force_motion` | 力與運動 | 89 | 必修 | II(b) Force and motion（p.25） |
| `pressure_density` | 壓強與密度 | 66 | 部分 | 氣體壓強屬 I(d) Gases（p.25、p.28–32）；指引並無質量密度（全文只有 magnetic flux density）。`pb_e4` 系列 30 條 ρ = m/V 屬初中科學 |
| `work_energy` | 功、能與功率 | 88 | 必修 | II(d) Work, energy and power（p.25） |

### 化學（`chemistry`）

指引：[Chemistry C&A Guide（2007，2018 年 6 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Chem_C_and_A_Guide_updated_Eng_22082018.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `mole` | 摩爾概念 | 100 | 必修 | III Metals（p.34、p.38） |
| `acids_bases` | 酸鹼 | 114 | 必修 | IV Acids and bases（p.24、p.39–42） |
| `redox` | 氧化還原 | 57 | 必修 | VII Redox reactions, chemical cells and electrolysis（p.24） |
| `rates_energy` | 反應速率與能量 | 92 | 必修 | VIII Chemical reactions and energy；IX Rate of reaction（p.24） |
| `bonding` | 化學鍵 | 75 | 必修 | II Microscopic world I；VI Microscopic world II（p.24） |
| `periodic_table` | 週期表 | 48 | 必修 | II、VI、XII Patterns in the chemical world（p.28–32、p.49、p.73） |
| `organic` | 有機化學 | 55 | 必修 | V Fossil fuels and carbon compounds；XI Chemistry of carbon compounds（p.24） |
| `chem_hell_quant` | 定量計算（高階） | 134 | 必修 | III、IV（p.34–42） |
| `chem_hell_redox_equil` | 氧化還原與平衡 | 44 | 必修 | VII、X Chemical equilibrium（p.24） |
| `chem_hell_organic` | 有機化學（高階） | 36 | 必修 | XI（p.24） |
| `formula_mass` | 化學式與式量 | 48 | 必修 | II（p.30–31） |
| `concentration` | 濃度 | 129 | 必修 | IV（molarity，p.39–42） |
| `gas_volume` | 氣體體積 | 62 | 必修 | IX Rate of reaction（molar volume，p.60–62） |
| `stoichiometry` | 化學計量 | 67 | 必修 | III（p.34–38） |

### 生物（`biology`）

指引：[Biology C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Bio_C_and_A_Guide_updated_e_20151126.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `cells` | 細胞 | 100 | 必修 | I Cells and Molecules of Life（p.24） |
| `genetics` | 遺傳 | 93 | 必修 | II Genetics and Evolution（p.24） |
| `human_body` | 人體系統 | 99 | 必修 | III(b) Essential life processes in animals（p.25） |
| `coordination` | 神經與協調 | 99 | 必修 | III(d) Coordination and response（p.25） |
| `enzymes` | 酶 | 98 | 必修 | I(e) Cellular energetics（p.24） |
| `photosynthesis` | 光合作用 | 109 | 必修 | I(e)；III(a)（p.24–25） |
| `ecology` | 生態 | 100 | 必修 | III(f) Ecosystems（p.25） |
| `digestion` | 營養與消化 | 117 | 必修 | III(b)（p.25） |
| `bio_genetics_logic` | 遺傳推理 | 93 | 必修 | II（p.24） |
| `bio_physio_chain` | 生理機制・因果鏈 | 100 | 必修 | III（p.25） |
| `bio_data_ecology` | 數據與生態 | 105 | 必修 | III(f)（p.25）；部分題材與選修 VI Applied Ecology 重疊 |

### 英國語文（`english`）

指引：[English Language C&A Guide（2021，2021/22 年度中四起）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/eng-edu/Curriculum%20Document/English%20Language%20Curriculum%20and%20Assessment%20Guide%20(Secondary%204%20-%206)%20(2021).pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `grammar` | Grammar | 93 | 必修 | Language items and communicative functions（p.19、p.38–41） |
| `tenses` | Tenses | 92 | 必修 | 同上；語法附錄（p.87–91） |
| `vocabulary` | Vocabulary | 87 | 必修 | p.19、p.38–41 |
| `word_formation` | Word Formation | 91 | 必修 | p.19、p.46、p.93–94 |
| `reading` | Reading Comprehension | 86 | 必修 | Reading（p.18–21） |
| `genre_tone` | Genre, Tone & Register | 87 | 必修 | Genre, tone and register（p.51–52） |
| `integrated` | Integrated Skills | 94 | 必修 | Integrated skills（p.76–80） |
| `cloze` | Cloze & Usage | 81 | 必修 | p.74 |
| `paper1_reading` | DSE Paper 1 Reading | 87 | 必修 | Reading（p.18–21） |
| `p1_inference` | Reading · Inference & Implication | 84 | 必修 | Reading（p.19、p.46） |
| `p1_tone` | Reading · Tone & Attitude | 84 | 必修 | p.51–52 |
| `p1_vocab_ref` | Reading · Vocabulary & Reference | 93 | 必修 | p.19、p.46 |

### 中國語文（`chinese`）

指引：[中國語文課程及評估指引（2021，2021/22 年度中四起）](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/CHI_LANG_CAGuide_2021.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `fanwen_content` | 指定範文・內容 | 63 | 必修 | 指定文言經典精選篇章（p.51） |
| `fanwen_diction` | 指定範文・字詞 | 69 | 必修 | 同上（p.51） |
| `fanwen_lines` | 指定範文・名句手法 | 73 | 必修 | 同上（p.51） |
| `classical` | 課外文言閱讀 | 60 | 必修 | 閱讀範疇（文言） |
| `comprehension` | 白話閱讀理解 | 62 | 必修 | 閱讀範疇（白話） |
| `rhetoric` | 修辭手法 | 56 | 必修 | 語文知識（修辭，p.17、p.25） |
| `idioms_vocab` | 成語與詞語 | 60 | 必修 | 語文知識（p.60） |
| `chars_errors` | 字音字形與病句 | 53 | 部分 | 指引以「語文基礎知識」概括（p.15、p.21），未有逐項列出字音、字形、病句；公開試卷一亦不設獨立語文知識部分 |
| `classical_lexis` | 文言實詞・一詞多義 | 61 | 必修 | 閱讀範疇（文言） |
| `paragraph_function` | 段落結構與作用 | 61 | 必修 | 閱讀範疇（p.37） |
| `argument_essay` | 論說文・思辨立意 | 79 | 必修 | 寫作範疇（p.14、p.25） |
| `narrative_essay` | 命題寫作・記敘抒情 | 75 | 必修 | 寫作範疇（p.26） |
| `descriptive_essay` | 命題寫作・描寫 | 65 | 必修 | 寫作範疇 |
| `mixed_essay` | 命題寫作・綜合 | 65 | 必修 | 寫作範疇 |
| `practical_writing` | 實用寫作 | 75 | 必修 | 寫作範疇（實用寫作，p.51、p.55） |
| `material_essay` | 材料作文・立意與引申 | 10 | 必修 | 寫作範疇 |
| `classical_moral_infer` | 課外文言・寓意推論 | 59 | 必修 | 閱讀範疇（文言） |
| `classical_passage_read` | 課外文言・篇章精讀 | 60 | 必修 | 閱讀範疇（文言） |
| `classical_compare` | 課外文言・比較閱讀 | 52 | 必修 | 閱讀範疇（比較閱讀，p.14–15） |

### 企業、會計與財務概論（`bafs`）

指引：[BAFS C&A Guide（2020 年 10 月，2022/23 年度中四起）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/BAFS%20C&A%20Guide_e_oct%202020_clean.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `business_env` | 商業環境 | 24 | 必修 | 兩組共同必修：Business Environment（p.21–23） |
| `management` | 管理 | 25 | 必修 | 會計組必修 Basics of Management（p.21、p.24）；商管組選修 |
| `accounting` | 會計 | 105 | 必修 | 商管組必修 Basics of Accounting（p.21、p.32）；會計組選修 |
| `financial_mgmt` | 財務管理 | 99 | 選修 | 商管組選修 Financial Management（p.35） |
| `personal_finance` | 個人理財 | 134 | 必修 | 兩組共同必修：Basics of Personal Financial Management（p.24） |
| `bafs_ratio_analysis` | 比率分析（高階） | 90 | 選修 | 會計組選修（p.29）；商管組選修財務管理亦有比率分析（p.25–26），2026-09-26 更正（原寫「全文只在此頁出現」） |
| `bafs_costing_pricing` | 成本・定價・回本 | 86 | 選修 | 會計組選修 Cost Accounting（p.29–30）；回本期另見商管組 p.35 |
| `bafs_depreciation` | 折舊計算 | 103 | 選修 | 會計組選修（p.26–27）；全文只在此兩頁出現折舊 |
| `financial_statements` | 財務報表 | 99 | 部分 | 會計組選修（p.26–29）；商管組必修只涉基礎（p.32） |
| `ratios` | 財務比率 | 96 | 選修 | 會計組選修（p.29） |
| `depreciation` | 折舊 | 101 | 選修 | 會計組選修（p.26–27） |
| `interest` | 利息 | 104 | 必修 | 個人理財：Time Value of Money（p.24） |
| `costing` | 成本與定價 | 90 | 選修 | 會計組選修 Cost Accounting（p.29–30） |

### 資訊及通訊科技（`ict`）

指引：[ICT C&A Guide（2021，2022/23 年度中四起）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/ICT_C&A_Guide_e_final.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `data_representation` | 資料表示與處理 | 115 | 必修 | A Information Processing（p.16、p.24） |
| `computer_systems` | 電腦系統與硬件 | 118 | 必修 | B Computer System Fundamentals（p.16、p.27） |
| `networking` | 網絡與互聯網 | 117 | 必修 | C Internet and its Applications（p.16、p.31–32） |
| `programming` | 程式編寫與算法 | 117 | 必修 | D Computational Thinking and Programming（p.37）；選修 Algorithm and Programming |
| `databases` | 資料庫 | 118 | 必修 | 必修 A：單一資料表及簡單 SQL（p.25）；多表、正規化屬選修 Databases（p.47–50） |
| `security_ethics` | 資訊保安與道德 | 114 | 必修 | E Social Implications（p.43） |
| `multimedia_web` | 多媒體與網絡技術 | 116 | 必修 | A（多媒體，p.24）、C（HTML，p.31–34）；選修 Web Application Development |
| `ict_data_rep_calc` | 資料表示計算 | 97 | 必修 | A（p.24） |
| `ict_logic_algo` | 邏輯與算法 | 103 | 必修 | D（p.37） |
| `ict_network_calc` | 網絡計算 | 96 | 必修 | C（p.32） |

### 經濟（`economics`）

指引：[Economics C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/7.Econ_C&A_Guide_updated_e_(2015.11.24)_r.pdf) —— 適用於 2027。2025 年更新版由 2025/26 年度中四起生效（即 2028 年文憑試起）；兩版的「NOT required」列表逐條比對，除一處措辭外完全相同

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `basic_concepts` | 基礎概念 | 68 | 必修 | A Basic Economic Concepts（p.19） |
| `ppf` | 生產可能線（PPF） | 69 | 選修 | 選修二 Extension of Trade Theory（p.32）。必修 J 明文「Illustration by the production possibilities frontier NOT required」（p.30）；A 亦無生產可能線 |
| `demand_supply` | 需求與供應 | 92 | 必修 | C Market and Price（p.22） |
| `elasticity` | 彈性 | 100 | 必修 | C（價格彈性，p.22–23）；點彈性、交叉彈性、收入彈性明文不需要。題庫掃描：零命中 |
| `firm_production` | 廠商與生產 | 113 | 必修 | B Firms and Production（p.20） |
| `market_structure` | 市場結構 | 93 | 部分 | D Competition and Market Structure（p.24）；以 MR、MC 曲線分析明文不需要，屬選修一 Monopoly Pricing（p.31）。題庫有 3 條（econ-ms-mc-4／8／9） |
| `market_failure` | 市場失靈 | 86 | 必修 | E Efficiency, Equity and the Role of Government（p.25）；指引無「市場失靈」一詞，內容屬 E。econ_mf_90 解說用了指引列明不需要的「帕累托」 |
| `macroeconomics` | 宏觀經濟 | 115 | 必修 | F–I（p.26–28） |
| `trade` | 國際貿易 | 87 | 必修 | J International Trade and Finance（p.30） |
| `econ_micro_calc` | 微觀計算（高階） | 73 | 必修 | B–E（p.20–25） |
| `econ_macro_calc` | 宏觀計算（高階） | 103 | 必修 | F–I（p.26–28） |
| `econ_trade_failure` | 貿易與市場失靈 | 71 | 必修 | E、J（p.25、p.30） |
| `market` | 市場效率 | 60 | 必修 | E（p.25） |

### 公民與社會發展（`csd`）

指引：[Citizenship and Social Development C&A Guide（2021，2021/22 年度中四起）](https://cs.edb.edcity.hk/file/C_and_A_guide/202106/CS_CAG_S4-6_Eng_2021.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `hk_constitution` | 「一國兩制」與憲制秩序 | 97 | 必修 | 主題一 Hong Kong under “One Country, Two Systems”（p.13、p.19–20） |
| `hk_rule_of_law` | 法治、權利與責任 | 110 | 必修 | 主題一（p.13） |
| `hk_society` | 香港社會與參與 | 96 | 必修 | 主題一（p.19–20） |
| `china_reform` | 改革開放與國家發展 | 99 | 必修 | 主題二 Our Country since Reform and Opening-up（p.24–25） |
| `china_tech_power` | 科技創新與綜合國力 | 98 | 必修 | 主題二（p.24–25） |
| `globalization` | 經濟全球化 | 97 | 必修 | 主題三 Interconnectedness and Interdependence（p.28–29） |
| `interdependence` | 互聯相依的世界 | 104 | 必修 | 主題三（p.28–29） |
| `sustainability` | 可持續發展與公共衞生 | 97 | 必修 | 主題三（可持續發展、公共衞生，p.28–31） |
| `csd_data_response` | 資料回應・數據詮釋 | 87 | 必修 | 三個主題的資料回應能力 |
| `csd_stakeholder_eval` | 多角度評鑑・持份者權衡 | 85 | 必修 | 同上 |
| `csd_concept_apply` | 概念應用・當代世界 | 86 | 必修 | 同上 |

### 中國歷史（`chinese-history`）

指引：[中國歷史課程及評估指引（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/pshe/CHistCAGuide_updated_c_20180108_clean.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `preqin_polity` | 先秦政治 | 113 | 必修 | 必修 夏商周（p.20） |
| `qinhan_tang` | 秦漢至隋唐制度 | 114 | 必修 | 必修 秦漢至隋唐（p.21–23） |
| `song_qing` | 宋元明清 | 113 | 必修 | 必修 宋元、明清（p.24） |
| `late_qing` | 晚清變局 | 114 | 必修 | 必修 列強的入侵、改革與革命（p.25） |
| `revolution` | 辛亥革命 | 113 | 必修 | 必修 改革與革命（p.25） |
| `republic` | 民國發展 | 113 | 必修 | 必修 民初政局、國共分合、抗日戰爭（p.26–27） |
| `prc` | 中共建國至改革 | 89 | 必修 | 必修 社會主義建設至改革開放（p.28） |
| `hk_taiwan` | 香港與兩岸 | 112 | 部分 | 香港、澳門回歸及兩岸交流見必修（p.29）。但 112 條中 92 條（`ch_hkt` 系列）是以虛構朝代出題的通用比較方法題，內容與課題名稱不符 |
| `chist_ancient_institution` | 古代制度・因果 | 103 | 必修 | 必修古代部分；選修專題「制度與政治演變」（p.37–38） |
| `chist_modern_causation` | 近現代變局・評價 | 103 | 必修 | 必修近代部分（p.25–29） |

### 歷史（`history`）

指引：[History C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/10.Hist_C&A_Guide_e(2015.9.25)_edit_r_23%20Oct_r1.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `ww1` | 第一次世界大戰 | 77 | 必修 | Theme B (4) Major conflicts and the quest for peace（p.21） |
| `ww2` | 第二次世界大戰 | 88 | 必修 | Theme B (4)（p.21） |
| `cold_war` | 冷戰 | 71 | 必修 | Theme B (4)(iii)（p.21） |
| `dictatorship` | 極權主義興起 | 68 | 部分 | 兩次大戰之間的因果屬 Theme B (4)(ii)（p.21）；納粹崛起等 15 條相符。但 68 條中 48 條（`hisb_di1` 系列）是議席過半算術題，並非歷史內容 |
| `intl_coop` | 國際合作 | 83 | 必修 | Theme B (5) The quest for cooperation and prosperity（p.22） |
| `china_mod` | 中國現代化 | 74 | 必修 | Theme A (2)（p.19） |
| `japan_mod` | 日本現代化 | 78 | 必修 | Theme A (3)(i)（p.20） |
| `hk_seasia` | 香港與東南亞 | 66 | 必修 | Theme A (1)、(3)（p.18、p.20） |
| `hk_mod` | 香港的現代化與蛻變 | 86 | 必修 | Theme A (1)（p.18） |
| `seasia` | 東南亞：由殖民地到獨立國家 | 87 | 必修 | Theme A (3)(ii)（p.20） |
| `postwar_conflicts` | 戰後衝突與聯合國 | 76 | 必修 | Theme B (4)(iii)（p.21） |
| `hist_causation` | 因果分析・導火線與根源 | 82 | 必修 | 歷史技能（全課程） |
| `hist_significance` | 影響與意義評價 | 74 | 必修 | 歷史技能（全課程） |
| `hist_source` | 史料判讀 | 79 | 必修 | 歷史技能（全課程） |

### 地理（`geography`）

指引：[Geography C&A Guide（2007，2022 年 7 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/Geography%20C&A%20Guide%202022-eng.pdf) —— 適用（指引未列生效學年；必修七課題及四個選修與 2027 年評核大綱一致）

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `plate_hazards` | 板塊與自然災害 | 119 | 必修 | 必修 (1) Opportunities and Risks（p.16） |
| `rivers_coasts` | 河流與海岸環境 | 127 | 必修 | 必修 (2) Managing Rivers and Coastal Environments（p.16） |
| `weather_climate` | 天氣與氣候 | 115 | 選修 | 選修 Weather and Climate（p.16）；指引說明此選修延伸必修的基本概念 |
| `urban` | 城市發展 | 113 | 必修 | 必修 (4) Building a Sustainable City（p.16） |
| `industry` | 工業區位 | 112 | 必修 | 必修 (3) Changing Industrial Location（p.16） |
| `food` | 糧食與飢荒 | 125 | 必修 | 必修 (5) Combating Famine（p.16） |
| `rainforest` | 熱帶雨林 | 93 | 必修 | 必修 (6) Disappearing Green Canopy（p.16） |
| `climate_change` | 氣候變化與環境管理 | 117 | 必修 | 必修 (7) Climate Change（p.16） |
| `geo_process_chain` | 地理過程・因果鏈 | 98 | 必修 | 必修各單元 |
| `geo_data_manage` | 數據與環境管理 | 94 | 必修 | 必修各單元 |

### 中國文學（`chinese-literature`）

指引：[中國文學課程及評估指引（2007，2014 年 1 月更新）](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/curriculum-past-documents/Chi_Lit_C_and_A_Guide_updated_c_20141119.pdf) —— 適用於 2027。2025 年修訂版由 2025/26 年度中四起生效（即 2028 年文憑試起），本表未採用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `pre_qin_han` | 先秦兩漢文學 | 105 | 必修 | 必修：研習古今詩歌、散文、小說、戲劇，概略認識中國文學發展脈絡（p.18） |
| `tang_poetry` | 唐詩 | 105 | 必修 | 同上（p.18） |
| `song_ci` | 宋詞 | 105 | 必修 | 同上（p.18） |
| `yuan_drama` | 元曲戲劇 | 105 | 必修 | 同上（p.18） |
| `ming_qing` | 明清小說 | 106 | 必修 | 同上（p.18） |
| `genres` | 文學體裁 | 112 | 必修 | 文類（p.12、p.15、p.17–18） |
| `techniques` | 寫作手法 | 112 | 必修 | 寫作手法（p.16–17、p.19） |
| `appreciation` | 文學鑑賞 | 109 | 必修 | 賞析與評論（p.18） |
| `clit_poetry_appreciation` | 詩詞鑑賞・手法與意境 | 101 | 必修 | 同上 |
| `clit_craft_compare` | 風格比較・婉約與豪放 | 95 | 必修 | 同上 |

### 英語文學（`english-literature`）

指引：[Literature in English C&A Guide（2023，2023/24 年度中四起）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/eng-edu/Curriculum%20Document/LiE_CAGuide_2023.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `poetry` | Poetry | 106 | 必修 | Poetry（p.12–13、p.40–42） |
| `drama` | Drama | 105 | 必修 | Drama（p.12–16） |
| `prose_fiction` | Prose Fiction | 106 | 必修 | Novel and short story（p.31–37） |
| `devices` | Literary Devices | 109 | 必修 | p.32–34、p.49–50 |
| `characterisation` | Characterisation | 105 | 必修 | p.13、p.33、p.36 |
| `themes` | Themes | 105 | 必修 | p.13、p.30–35 |
| `shakespeare` | Shakespeare | 105 | 必修 | 以 Shakespeare 劇作作 drama 研習例子（p.49–50）；是否屬 2027 指定作品，須另查評核大綱 |
| `criticism` | Criticism | 104 | 必修 | Practical criticism（p.28、p.52）；抽樣所見為細讀與論證，符合。指引明言 literary theory 超出學生程度（p.52） |
| `elit_device_effect` | Device & effect | 99 | 必修 | p.32–34 |
| `elit_theme_irony` | Theme & irony | 95 | 必修 | p.13、p.34 |

### 倫理與宗教（`ethics-religious`）

指引：[Ethics and Religious Studies C&A Guide（2007，2019 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/ERS_CA%20Guide_updated_e_(2019.12.03)_clean_for%20upload.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `ethical_theories` | 規範倫理學 | 116 | 必修 | 必修 Module 1 Normative Ethics（p.15–16） |
| `applied_ethics` | 應用倫理 | 104 | 必修 | 必修 Module 2 Personal and Social Issues（p.17–21） |
| `moral_concepts` | 道德概念 | 108 | 必修 | Module 1 The Nature of Morality（p.15） |
| `christianity` | 基督宗教 | 110 | 選修 | 選修 I Module 2 Christianity（p.14、p.31–47） |
| `buddhism` | 佛教 | 110 | 選修 | 選修 I Module 1 Buddhism（p.14、p.22–30） |
| `religion_philosophy` | 宗教哲學 | 110 | 未見 | 指引全文沒有宗教哲學；抽樣所見題目考設計論證、宇宙論證、惡的難題、帕斯卡賭注 |
| `religion_ethics` | 宗教倫理 | 110 | 部分 | Module 1「Morality and religion」只談道德與宗教的關係（p.15）；佛教戒律（p.28–30）、基督宗教教導（p.41–47）屬各自選修。題目中的神命論、自然法等理論名稱指引未見；eth_floor_26 考伊斯蘭教，而伊斯蘭教單元指引列明「later phase」未推行（p.14） |
| `religion_society` | 宗教與社會 | 110 | 未見 | 指引沒有宗教社會學；抽樣所見多為「研究宗教群體的方法」。最接近的 Faiths in Action（選修 II，p.14、p.49）是體驗學習；2027 年評核大綱只設卷一倫理、卷二宗教傳統，不考此部分 |
| `eth_theory_apply` | 規範倫理・理論應用 | 107 | 必修 | Module 1、2（p.15–21） |
| `eth_meta_reason` | 道德推理・後設反思 | 102 | 必修 | Module 1 Moral reasoning（p.15）；抽樣所見為推理謬誤，符合 |

### 旅遊與款待（`ths`）

指引：[Tourism and Hospitality Studies C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/11.THS_C&A_Guide_e(2015.11.24)PSHE%20section.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `intro` | 旅遊與款待業概論 | 92 | 必修 | I Introduction to Tourism（p.18–19） |
| `service` | 優質顧客服務 | 114 | 必修 | IV Customer Relations and Services（p.35–36） |
| `destinations` | 旅遊目的地 | 101 | 必修 | III Destination Geography（p.33） |
| `accommodation` | 住宿營運 | 109 | 必修 | II Introduction to Hospitality（p.25） |
| `food_beverage` | 餐飲服務 | 96 | 必修 | II（p.25） |
| `travel_trade` | 旅行社與會展 | 96 | 必修 | I（MICE，p.24） |
| `sustainable` | 可持續旅遊 | 115 | 必修 | V Trends and Issues（p.37） |
| `impacts` | 旅遊影響 | 105 | 必修 | I、V（p.21、p.37） |
| `ths_hotel_metrics` | 酒店營運計算 | 84 | 部分 | II 只提及房租類型及住客週期（p.25）；入住率、平均房價、RevPAR 計算指引未見 |
| `ths_concept_analysis` | 概念分析・服務與可持續 | 109 | 必修 | IV、V |

### 健康管理與社會關懷（`health-management`）

指引：[HMSC C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/HMSC_CA_Guide_e_2015.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `health_concept` | 健康概念 | 88 | 必修 | 必修（p.21、p.31–33） |
| `lifespan` | 人生發展 | 92 | 必修 | 必修 Personal Development, Social Care and Health Across the Lifespan（p.21） |
| `care_systems` | 醫療與社會照顧系統 | 84 | 必修 | 必修 Health and Social Care in the Local and the Global Contexts（p.21） |
| `health_promotion` | 促進健康 | 101 | 必修 | 必修（p.21、p.38–40）；另有選修一延伸 |
| `community_care` | 社區照顧 | 89 | 必修 | 必修 Topic 4（p.42）；另有選修二延伸 |
| `public_health` | 公共衞生與疾病預防 | 105 | 必修 | 必修（p.39、p.42） |
| `care_ethics` | 照顧倫理 | 88 | 必修 | 必修（p.36、p.44） |
| `care_skills` | 照顧技巧 | 99 | 部分 | 指引沒有獨立的照顧技巧課題；緊急應變（p.44）、服務目的含急救（p.47）屬相關內容，實務操作須另行判斷 |
| `hm_holistic_concept` | 整全健康・概念應用 | 91 | 必修 | 必修（p.31–33） |
| `hm_prevention_levels` | 三級預防分類 | 88 | 必修 | 必修 Topic 4（p.42） |
| `hm_care_ethics_determinants` | 照顧倫理與健康決定因素 | 96 | 部分 | 照顧倫理屬必修（p.36、p.44）；「健康決定因素」一詞指引未見 |

### 設計與應用科技（`design-tech`）

指引：[DAT C&A Guide（2007，2015 年 11 月更新）＋ 2020 年 12 月補充說明](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/DAT_CAGuide_e_2015.pdf) —— 適用（補充說明由 2022/23 年度中四起）

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `design_process` | 設計過程 | 91 | 必修 | 必修 Strand 1 Design and Innovation（p.21–23） |
| `design_elements` | 設計元素與原則 | 95 | 必修 | Strand 1（p.23） |
| `materials` | 材料與特性 | 92 | 必修 | Strand 2 Technological Principles（p.25）；2020 年補充說明列明材料範圍 |
| `structures_mech` | 結構與機械 | 116 | 部分 | 補充說明（2020）把機構列入 Strand 2 及選修單元三的範圍；主指引中機構只見於選修單元三（p.35） |
| `manufacturing` | 生產工序 | 112 | 必修 | Strand 2（p.25）；補充說明列明工序範圍 |
| `cad_cam` | 電腦輔助設計與製造 | 113 | 必修 | Strand 1 設計傳意；選修單元五 Visualisation and CAD Modelling |
| `ergonomics` | 人體工學 | 103 | 必修 | Strand 1（p.24） |
| `sustainability` | 可持續設計 | 106 | 必修 | Strand 3 Value and Impact（p.27） |
| `dat_mechanisms_calc` | 結構與機械・計算 | 98 | 部分 | 力矩、機械利益只見於選修單元三 Design Implementation and Material Processing（p.35） |
| `dat_materials_reason` | 材料與結構・推理 | 97 | 必修 | Strand 2（p.25） |

### 視覺藝術（`visual-arts`）

指引：[Visual Arts C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/arts-edu/curriculum-docs/VA_CAGuide_e_2015.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `art_appreciation` | 藝術評賞 | 98 | 必修 | Visual arts appreciation and criticism in context（p.12–15） |
| `elements_principles` | 藝術元素與原則 | 94 | 必修 | p.13、p.17、p.21 |
| `western_art` | 西方藝術 | 101 | 必修 | p.12 |
| `chinese_art` | 中國藝術 | 104 | 必修 | p.12、p.30 |
| `media_techniques` | 媒材與技法 | 98 | 必修 | p.15、p.18、p.20–21 |
| `modern_contemporary` | 現代與當代藝術 | 115 | 必修 | p.24 |
| `visual_design` | 視覺設計 | 104 | 必修 | p.12–13 |
| `art_context` | 藝術與文化 | 97 | 必修 | p.12–15 |
| `va_formal_analysis` | 形式分析・元素與原則 | 89 | 必修 | p.13、p.21 |
| `va_history_context` | 藝術史・技法與風格 | 113 | 必修 | p.12–15 |

### 音樂（`music`）

指引：[Music C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/arts-edu/curriculum-docs/Music_CnA_Guide_e_25-11-2015.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `elements` | 音樂元素 | 108 | 必修 | Listening（p.18） |
| `theory_notation` | 樂理與記譜 | 94 | 必修 | p.18、p.27–28 |
| `form_structure` | 曲式與結構 | 109 | 必修 | p.18 |
| `western_history` | 西方音樂史 | 113 | 必修 | Western classical music（p.18、p.25–26） |
| `chinese_music` | 中國音樂 | 94 | 必修 | Chinese instrumental music、Cantonese operatic music（p.18） |
| `instruments` | 樂器與合奏 | 110 | 必修 | p.18–20 |
| `listening` | 聆聽與分析 | 104 | 必修 | Listening（p.18） |
| `creating` | 創作與演奏 | 96 | 必修 | Performing、Creating（p.19–20） |
| `mus_theory_intervals` | 樂理・音程與調號 | 111 | 必修 | p.18、p.27–28 |
| `mus_harmony_form` | 和聲・和弦與曲式 | 88 | 必修 | p.18、p.25–26 |

### 體育（`pe`）

指引：[Physical Education C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pe/curriculum-doc/PE%20C&A%20Guide_2015_e.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `anatomy` | 解剖學 | 97 | 必修 | Theme 1 Body Maintenance（p.15、p.20、p.22–23） |
| `physiology` | 運動生理學 | 90 | 必修 | Theme 1（p.15、p.20） |
| `biomechanics` | 生物力學 | 102 | 必修 | 九個理論部分之一（p.15、p.34） |
| `fitness_training` | 體適能與訓練 | 113 | 必修 | Theme 1、2（p.16–17、p.22–24） |
| `nutrition_health` | 營養與健康 | 131 | 必修 | Theme 1（p.15、p.17、p.22） |
| `injuries` | 運動創傷 | 91 | 必修 | p.17、p.24 |
| `psychology` | 運動心理學 | 110 | 必修 | Theme 2 Self Enhancement（p.15、p.17–18、p.25） |
| `sport_society` | 運動與社會 | 101 | 必修 | Theme 3 Care for the Community（p.15、p.18、p.26） |
| `pe_physiology_calc` | 運動生理計算 | 94 | 必修 | Theme 1（p.20） |
| `pe_biomech_systems` | 生物力學與能量系統 | 103 | 必修 | p.15、p.34 |

### 科技與生活（`technology-living`）

指引：[Technology and Living C&A Guide（2007，2015 年 11 月更新）](https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/TL_CAGuide_e_2015.pdf) —— 適用

| 課題 id | 課題 | 題數 | 判斷 | 指引位置（PDF 頁碼）／說明 |
|---|---|--:|---|---|
| `nutrition` | 膳食營養素 | 93 | 選修 | 食品科技組：Nutrition, Diet and Health Concerns（p.25–26） |
| `lifecycle` | 生命週期營養 | 89 | 選修 | 食品科技組（不同生命階段，p.24、p.29） |
| `meal_planning` | 膳食計劃 | 116 | 選修 | 食品科技組（p.25–30） |
| `food_science` | 食物科學 | 114 | 選修 | 食品科技組（p.20、p.26） |
| `food_safety` | 食物安全 | 98 | 選修 | 食品科技組（p.20、p.30） |
| `fibres` | 纖維與布料 | 108 | 選修 | 時裝、服飾與紡織組（p.20） |
| `fashion` | 成衣與時尚 | 110 | 選修 | 時裝、服飾與紡織組（p.20） |
| `consumer` | 消費與可持續 | 103 | 必修 | 兩組共有（p.20、p.22） |
| `tl_nutrition_calc` | 營養計算 | 96 | 部分 | 屬食品科技組營養範疇（p.25–26），但能量值（千卡）計算指引未見 |
| `tl_food_textile_sci` | 食物與紡織科學 | 106 | 必修 | 兩組各自的科學部分 |

## 待決定事項（未執行）

1. **「未見」課題（220 題）**：倫理與宗教 `religion_philosophy`、`religion_society`。可選：收起不出題、改標課題、或經 §12 流程刪除並重寫。
   **2026-09-26 已決定（Yuna，按 §18）：收起不出題，題目保留作審計。** 見 `docs/UNMAPPED-220.md`。
2. **「部分」課題**：先由學科負責人確認哪些題目超出範圍，再逐批處理。
3. **選修篩選**：是否按本表把經濟 `ppf`（選修二）、BAFS 會計組課題、`financial_mgmt`（商業管理組）加入 `TOPIC_SCOPE`。
4. **「前備」課題**：初中內容保留作溫習，抑或降低出題比例。

任何刪除、替換或篩選改動，均不在本次審核範圍內。
