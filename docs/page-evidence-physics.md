# DSE Physics 勻加速運動方程頁面證據

- **頁面路徑：** `/dse-physics/motion-equations`
- **內容範圍：** 一維勻加速運動的正負方向、五個變數與 SI 單位、四條方程的限制、v–t 圖、三題原創分步例題、常見錯誤及官方資源連結。
- **狀態說明：** 本文件只記錄內容與數學覆核，並不提供部署或發佈判定。

## 來源與內容依據

勻加速方程只可在加速度恆定的模型下直接使用；若加速度有明顯變化，應分段處理。平均速度 `½(u + v)` 亦以加速度恆定為前提。[1] 頁面因此明確限制方程為一維恆定加速度運動，並以降落傘打開、空氣阻力改變作為不應整段硬套公式的例子。

速度—時間圖的斜率代表加速度，圖線下的有向面積代表位移；求總路程時，位於時間軸下方的部分須取面積大小另行相加。[2] 頁面以有 caption 和欄位標題的語意表格說明此分別，沒有聲稱使用圖像資產。

物理科官方外部資源連結使用考評局的 HKDSE Physics 科目頁。該頁列出 Assessment Framework、Curriculum and Assessment Guide、Samples of Candidates' Performance、Sample Papers 等官方項目。[3] 本頁不複製或改寫考評局試題，僅以原創數字情境教學，並引導讀者到官方頁查看當前可取得的資料。

## Python 數學覆核

以下計算以 Python 的 `math.isclose` 逐項斷言；所有斷言通過。量綱亦按 `m s⁻¹ + (m s⁻²)(s) = m s⁻¹` 和 `(m s⁻¹)(s) + (m s⁻²)(s²) = m` 核對。

| 原創例題 | Python 核對結果 | 單位與正負覆核 |
|---|---|---|
| 直線加速：`u = +4.0 m s⁻¹`、`a = +2.5 m s⁻²`、`t = 6.0 s` | `v = +19 m s⁻¹`；`s = +69 m`；並以 `½(u + v)t` 再得 `69 m` | 向東設為正；速度和位移均為正；兩種位移公式相符。 |
| 煞車：`u = +20 m s⁻¹`、`a = −5.0 m s⁻²`、`v = 0` | `t = 4.0 s`；`s = +40 m` | 向東設為正；減速度為負，但煞車前位移仍為正。 |
| 鉛直上拋：`u = +14.7 m s⁻¹`、`a = −9.8 m s⁻²` | `v(1.0 s) = +4.9 m s⁻¹`；`s(1.0 s) = +9.8 m`；最高點 `+11.025 m`，頁面按 3 個有效數字寫作 `+11.0 m`；回到拋出點 `t = 3.0 s`、`v = −14.7 m s⁻¹` | 向上設為正。計算明確以近地面重力加速度恆定、忽略空氣阻力為題設假定；回落速度為負，方向向下。 |

## 頁面實作覆核

- 只有一個 H1，文字為 **「DSE Physics 勻加速運動方程：公式與分步例題」**。
- `createSeoMetadata` 接收正確 site-relative path；description 以 Python `len()` 核對為 **150 個 Unicode 字元**。
- Article JSON-LD 透過既有 `JsonLd` 元件輸出；其 `headline` 直接引用 H1 常數。結構化資料沒有加入日期、個人作者或評分資料。
- Breadcrumb 包含既有 `/subjects/physics`；正文及相關內容提供 `/subjects/physics`、`/notes/physics`、`/practice` 和指定的數學教學路徑。兩個表格均有 `caption`、`th scope`，並置於 `overflow-x-auto` 容器，避免窄螢幕的表格橫向溢出。
- CTA 明確說明本站目前沒有把本頁例題或用戶上載題目交給 AI 自動生成解題的功能，亦不提供機器作文評分；按鈕只連至既有物理科練習入口。

## 缺口與整合注意

1. 最終靜態檢查已確認 `/dse-maths/question-types/quadratic-discriminant` 存在；本頁的跨教學連結可隨整合一併保留。
2. 依任務邊界，未執行 runtime、production gate 或部署驗證；這些程序及任何發佈判定須由主代理負責。
3. 本頁不作搜尋量、必考題型、成效、作者、日期或評分聲稱；「DSE 常見題型」一節已明示只作溫習分類，不代表必考。
4. 沒有加入套件、付費 API、站內物理 hub、sitemap、robots、layout 或其他頁面變更。

## References

[1]: https://openstax.org/books/college-physics-2e/pages/2-5-motion-equations-for-constant-acceleration-in-one-dimension "Motion Equations for Constant Acceleration in One Dimension"

[2]: https://openstax.org/books/physics/pages/2-4-velocity-vs-time-graphs "Velocity vs. Time Graphs"

[3]: https://www.hkeaa.edu.hk/en/hkdse/hkdse_subj.html?A2&2&20 "HKDSE Elective Subjects Physics"
