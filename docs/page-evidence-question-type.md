# 判別式題型解析頁證據

本檔對應 `/dse-maths/question-types/quadratic-discriminant`，頁面 H1 為「DSE Maths 二次方程判別式題型解析（非官方題解）」。頁面定位為原創教學內容；不轉載、重組或標示任何考評局年份、試卷或題號。

## 課程與來源核對

教育局《Mathematics Curriculum and Assessment Guide》把「Quadratic equations in one unknown」列於必修部分 Number and Algebra strand。當中的學習目標包括以二次公式解方程、理解判別式與根的性質的關係，以及解決涉及二次方程的問題。[1] 因此，頁面只講解係數辨認、Δ = b² − 4ac、兩個不同實根／重根／沒有實根，及參數不等式；沒有聲稱某種題型必考。

考評局數學科資料頁列出 Assessment Framework、Curriculum and Assessment Guide、Samples of Candidates' Performance、Level Descriptors 與 Other Resources。[2] 頁面只把該官方資料頁提供為外部核對入口，沒有把它描述為本站題解的來源，也沒有複製其試題或評分材料。

## 原創數學內容覆核

代表題為 `x² − 2(p + 1)x + (p − 1)² = 0`。令 `a = 1`、`b = −2(p + 1)`、`c = (p − 1)²`，則：

`Δ = [−2(p + 1)]² − 4(1)(p − 1)² = 4[(p + 1)² − (p − 1)²] = 16p`。

題目要求兩個不同實根，故須 `Δ > 0`，結論為 `p > 0`。代入 `p = 2`、`0`、`−1` 分別得到 `Δ = 32`、`0`、`−16`，對應兩個不同實根、重根、沒有實根，與結論一致。

相似題一為 `x² + (m − 3)x + m = 0` 的重根條件：`Δ = (m − 3)² − 4m = m² − 10m + 9 = (m − 1)(m − 9)`，故 `m = 1` 或 `9`；代回分別為 `(x − 1)² = 0` 及 `(x + 3)² = 0`。相似題二為 `tx² − 4x + 1 = 0` 的兩個不同實根條件：先要求 `t ≠ 0`，再由 `16 − 4t > 0` 得 `t < 4`，合併為 `t < 4` 且 `t ≠ 0`。所有例子均為本頁新寫的代數式，並非官方試題的轉錄或標記。

## 頁面實作核對

- 使用 `createSeoMetadata`，path 為 `/dse-maths/question-types/quadratic-discriminant`，因此 canonical 由既有 SEO helper 生成。
- 使用主元件提供的 `JsonLd` 及 `articleJsonLd`。Article `headline` 輸入與可見 H1 同為「DSE Maths 二次方程判別式題型解析（非官方題解）」；沒有填寫日期、個人作者或評分。
- Breadcrumb 最後一項同樣使用該 H1。頁內維持一個 H1；兩張資料表均設有 `caption` 和 `th scope`，外層為 `overflow-x-auto`。
- SEO description 以 Python `len()` 核對為 **150** 個 Unicode code points，符合 150–160 的要求。
- 內部延伸連結為 `/dse-maths/quadratic-equations`、`/notes/math`、`/subjects/math`、`/dse-physics/motion-equations`，另有實際存在的 `/sensei` CTA。科目練習路徑使用 `math`，沒有使用 `mathematics`。
- SENSEI CTA 明示其為只檢索真人審核知識卡的 AI 學習助手，不聲稱任意生成答案或機器作文評分。

## 缺口與交付邊界

本頁沒有加入 `Published` 標記，也沒有聲稱已通過 production gate。未執行 Git 操作、npm 指令或 production build；主代理應在整合後依其流程處理建置、測試與發布閘關。

課程依據採用 2017 年版課程及評估指引；考試年度的 assessment framework 或安排如有更新，應在發布前由數學科編輯以當年官方資料再核對。由於沒有官方原題授權，保留原創題型解析和官方資料外連是刻意的版權 fallback，而不是官方 Past Paper 題解替代品。

## References

[1]: https://www.edb.gov.hk/attachment/en/curriculum-development/kla/ma/curr/CA_2017_e.pdf "Mathematics Curriculum and Assessment Guide"

[2]: https://www.hkeaa.edu.hk/en/hkdse/assessment/subject_information/category_b_subjects/hkdse_subj.html?A1&1&4 "HKDSE Mathematics subject information"
