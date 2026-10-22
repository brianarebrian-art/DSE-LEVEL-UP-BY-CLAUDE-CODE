# English Writing Format 頁面證據

- **頁面：** `/dse-english/writing-format`
- **可見 H1：** `DSE English Writing Format：Letter、Article、Report 與 Speech`
- **內容狀態：** 草稿內容；本檔不把頁面標記為 Published，亦不代表已通過 production gate。

## SEO 與結構核對

| 項目 | 覆核內容 | 結果 |
|---|---|---|
| Canonical | 頁面以 `createSeoMetadata({ path: '/dse-english/writing-format' })` 產生 canonical。 | 已在來源檔設定；未作 production 驗證。 |
| Title 長度 | 以 Python 3 `len(title)` 計算 Unicode code point。 | **160**，在要求的 150–160 範圍內。 |
| Description 長度 | 以 Python 3 `len(description)` 計算 Unicode code point。 | **158**，在要求的 150–160 範圍內。 |
| 結構化資料 | 頁面使用專案既有的 `JsonLd` 安全序列化元件；`articleJsonLd({ title: h1, ... })` 令 `Article.headline` 使用可見 H1。 | 不傳入日期；頁面沒有個人作者、評分或評級聲稱。 |
| 語意結構 | 一個 H1；主要內容置於 `main > article > section`。比較表有 `caption`、欄位 `th scope="col"` 與列標題 `th scope="row"`。 | 已在來源檔實作。 |
| 小螢幕表格 | 比較表置於 `overflow-x-auto` 容器，表格設定 `min-w-[760px]`。 | 需要主 agent 在實際介面作手動檢視。 |
| 內部連結 | `/dse-english`、`/notes/english`、`/reading` 與 `/writing` 均已存在；`/notes/english` 由現有 `[subject]` 動態路由及 `english` 科目 id 解析。 | 四個相關目的地已作靜態路徑核對。 |

## 事實與數學覆核來源及內容

### 數學覆核

本頁為英文寫作教學，**不含數學題目、公式、推導、運算結果或量化成績承諾**，因此沒有可執行的代數或數值驗算。唯一使用的數值為考評局 Assessment Framework 已明列的 Paper 2 時間、題目部分及約略字數，沒有自行推算分數、等級或出題機率。

### 官方來源與可追溯內容

1. **HKEAA 2028 HKDSE English Language Assessment Framework：** 寫作目標包括為不同情境、讀者和目的寫作，並使用合適語氣、文體和體裁特徵；文件列 Paper 2 為兩小時，Part A 是約 200 字的短引導任務，Part B 是約 400 字的較開放任務。[1]
2. **HKEAA English Language Paper 2 FAQ：** 字數提示旨在協助理解任務、組織、時間安排、規劃和校對；明顯少於或多於建議字數均可能妨礙完成兩項任務。[2]
3. **HKEAA 2025 Samples of Candidates' Performance：** 官方頁面提供 Paper 2 考生表現樣本的入口；本頁沒有轉載、改寫或宣稱任何樣本為本站內容。[3]
4. **來源如何反映在頁面：** 首段只將 Assessment Framework 的內容用作「讀者、目的、語氣、體裁」的教學背景；自評段只概述 FAQ 對字數提示、規劃與校對的說明。Letter、Article、Report、Speech 比較、示範題目、大綱和短段均明示為本站原創教學內容，而非官方格式表或範文。

## 內容與功能界線

- 題目指定優先於一般格式慣例；頁面明確說明地址、日期、署名、標題和稱呼不是所有情境的固定必備項目。
- 頁面提供 `#paragraph-structure`、`#connectors-and-sentences`、`#common-format-mistakes` 和 `#self-review` 明確錨點，供相關文法、詞彙與寫作技巧內容連結，不需建立虛構路由。
- 「AI Essay Feedback」CTA 如實說明本站目前**不提供** AI 作文評分、機器作文評分、分數預測或官方閱卷，並只連至既有 `/writing` 自評工具。
- 沒有加入套件、付費 API、AI 生成、機器作文評分、題目資料或考評局官方答案。

## 缺口與交接事項

1. 本次完成來源與靜態內容覆核，並以 TypeScript `transpileModule` 檢查 TSX 語法，結果為 **0** 個語法錯誤；依工作分工，沒有執行 npm、build、lint、test 或 production gate。
2. 內部連結只確認路由檔與動態科目 id；卡片外觀、手機橫向捲動、canonical 實際輸出及 JSON-LD 在整合環境的最終呈現，仍應由主 agent 驗證。
3. Assessment Framework 指向 **2028** 文件，頁面以該年份明示其來源，沒有將其描述為所有年度不變的規則。每年實際題目指示與最新考評局資料仍應優先。
4. 沒有加入作者、發布日期、修改日期、考生表現評分、預測級別或保證成績，因這些資料未獲本頁可核實來源支持。

## References

[1]: https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/eng_lang/2028hkdse-e-elang-9d8.pdf "2028 HKDSE English Language Assessment Framework"

[2]: https://www.hkeaa.edu.hk/en/hkdse/assessment/subject_information/category_a_subjects/eng_lang/faq_q/q4.html "HKEAA English Language Paper 2 FAQ"

[3]: https://www.hkeaa.edu.hk/en/HKDSE/assessment/subject_information/category_a_subjects/eng_lang/sp/2025.html "HKEAA English Language Sample Performance 2025"
