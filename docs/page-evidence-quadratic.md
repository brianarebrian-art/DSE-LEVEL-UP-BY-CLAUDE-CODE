# 一元二次方程頁面證據

- **頁面：** `/dse-maths/quadratic-equations`
- **可見 H1：** `DSE Maths 一元二次方程完整筆記`
- **內容狀態：** 草稿內容；本檔不把頁面標記為 Published，亦不代表已通過 production gate。

## SEO 與結構核對

| 項目 | 覆核內容 | 結果 |
|---|---|---|
| Canonical | 頁面以 `createSeoMetadata({ path: '/dse-maths/quadratic-equations' })` 產生 canonical。 | 已在程式碼設定；未作 production 驗證。 |
| Description 長度 | 以 Python 3 `len(description)` 計算 Unicode code point。 | **155**，在要求的 150–160 範圍內。 |
| 結構化資料 | `JsonLd` 使用專案既有安全序列化元件；`Article.headline` 為可見 H1。 | 不含日期、個人作者或評分資料。 |
| 語意結構 | 一個 H1；內容置於 `main > article > section`，所有資料表均有 `caption`、欄位 `th scope="col"` 與列標題 `th scope="row"`。 | 已在來源檔實作。 |
| 小螢幕表格 | 每張寬表均置於 `overflow-x-auto` 容器，並設定最小表寬。 | 需要主 agent 在實際介面作手動檢視。 |

## 數學覆核來源與內容

### 覆核來源

1. **原創推導與基本代數恆等式：** 本頁不轉載考評局歷屆試題、官方題解或評分參考。因式分解以展開相乘核對；配方法以等式兩邊同加相同常數核對；二次公式、判別式及根的和積關係均按 `ax² + bx + c = 0` 的標準代數定義書寫。
2. **Python 3.11 標準函式庫驗算：** 使用 `fractions.Fraction` 對有理根作精確代入，使用 `math.sqrt` 與 `math.isclose(..., abs_tol=1e-12)` 驗算含 `√17` 的兩根。未安裝新套件；環境沒有 SymPy。
3. **程式輸出：** description 為 155 Unicode code points；三條例題的所有根代回值均通過 assertion。

### 逐項驗算紀錄

| 內容 | 覆核計算 | 結果 |
|---|---|---|
| 例題一因式分解 | `6x² + x − 2 = 6x² + 4x − 3x − 2 = (2x − 1)(3x + 2)`；根為 `1/2`、`−2/3`。以 `Fraction` 代入，兩值均為 `0`。 | 正確。 |
| 例題二配方法 | `2x² + 8x − 10 = 0` 同除以 2 後為 `x² + 4x = 5`；兩邊加 4 得 `(x + 2)² = 9`，根為 `1`、`−5`。以 `Fraction` 代入原式，兩值均為 `0`。 | 正確。 |
| 例題三二次公式 | 對 `2x² + 3x − 1 = 0`，`Δ = 3² − 4(2)(−1) = 17`，根為 `(-3 ± √17)/4`。兩根以 Python 浮點值代入，絕對誤差小於 `1e-12`。 | 正確。 |
| 例題三根的和積 | `(-3 + √17)/4 + (-3 − √17)/4 = -3/2 = -b/a`；乘積為 `(9 − 17)/16 = -1/2 = c/a`。 | 正確。 |
| 判別式表 | `Δ > 0`：兩個不同實根；`Δ = 0`：重根；`Δ < 0`：沒有實根。 | 在頁面所註明的實數範圍下正確。 |

### 可重跑的核心驗算

```python
from fractions import Fraction
from math import isclose, sqrt

p1 = lambda x: 6*x*x + x - 2
assert all(p1(r) == 0 for r in (Fraction(1, 2), Fraction(-2, 3)))

p2 = lambda x: 2*x*x + 8*x - 10
assert all(p2(r) == 0 for r in (Fraction(1), Fraction(-5)))

p3 = lambda x: 2*x*x + 3*x - 1
assert all(isclose(p3(r), 0.0, abs_tol=1e-12)
           for r in ((-3 + sqrt(17))/4, (-3 - sqrt(17))/4))
```

## 內容與功能界線

- 「DSE 常見設問」只作溫習分類，正文已明說**不代表必考**，不聲稱出題頻率、預測或保證成績。
- 判別式參數頁的連結明確描述為本站原創解析，並明確不是官方歷屆試題或官方評分參考。
- AI CTA 只連至既有 `/ai/practice-generator`，並在頁面說明目前只提供使用指引及練習平台入口；沒有聲稱即時生成、機器作文批改或自動評分。
- 沒有加入套件、付費 API、題目資料或機器評分功能。

## 缺口與交接事項

1. 本次只作內容和靜態來源核對；依工作分工，**沒有執行 npm、Git、build、lint、test 或 production gate**。主 agent 應按專案流程處理。
2. `/dse-maths/question-types/quadratic-discriminant` 與 `/dse-physics/motion-equations` 是任務指定、供新教學互相連結的路徑；在本次初始檔案檢查時尚未存在。主 agent 應在發布前確認相應新頁已由負責者加入，否則這兩個內部連結會是 404。
3. `/notes/math` 與 `/notes/physics` 使用現有動態筆記路由；它們是否對應足夠課題及最終可見內容，仍應在整合環境手動核實。
4. 本頁刻意只涵蓋實數範圍的一元二次方程；複數根、圖像完整單元及個別年度考試範圍不在本頁作出斷言。
