# C · 競品公開頁盤點（thinka／DSE5Stars／AceDSE）

狀態：**待研究（部分受阻）** · 2026-10-29（香港時間）  
方法：只公開 URL、`robots.txt`／`sitemap`、正常 GET；遇 **429** 即停。唔複製專有內容、唔登入、唔付費探測。

## 摘要

| 對象 | 公開入口 | 本輪結果 |
|---|---|---|
| Thinka | `https://www.thinka.ai/zh-HK`、`https://app.thinka.ai/` | 行銷首頁 **429**（停）；app 登入頁 **200**。詳情沿用既有 `thinka-public-research-2026-08-24.md` |
| DSE5Stars | `https://www.dse5stars.com/` | **200**；`<title>` 顯示「學而 \| Asterisk · DSE revision…」。`/robots.txt`／`/sitemap.xml` 回 SPA HTML（非純文字 sitemap）— **路由清單受阻** |
| AceDSE | `https://www.acedse.com/` | **200**；sitemap **228** 條 `<loc>`（多語 en／zh-cn）；見下方樣本 |

## AceDSE 公開路由樣本（來自 sitemap，非窮舉抄錄）

- `/`、`/en/`、`/zh-cn/`
- `/subjects/`、`/practice/`
- `/dse-study-guide/`、`/dse-data/`（results／subject-choices／pathways／study-resources）
- `/tools/dse-score-calculator/`
- `/guides/`、`/topics/`、`/knowledge-map/`
- `/pricing/`（存在收費頁——對照我哋永久免費定位）

完整 228 條以對方 sitemap 為準；本報告唔轉載全部 URL 以免變成鏡像清單。

## Thinka

- 本輪 `www.thinka.ai/zh-HK` → **429** → **停止加深爬取**。  
- 既有 2026-08-24 報告仍可用作公開功能／收費／科目盤點參考（標日期）。

## DSE5Stars／Asterisk

- 公開首頁可達；機械 sitemap 未取得。  
- 後續若要路由覆蓋：只用人手瀏覽公開導航，遇登入牆即停。

## 對 DSE LEVEL UP 嘅啟示（假設，待產品決策）

- 競品有收費頁／AI 批改宣稱；我哋憲章禁付費牆同長答自動批改。  
- 公開 SEO 內容結構（subjects／guides／data）可作**覆蓋差距清單**，唔抄文案。  

## 待批准

- 是否安排第二次公開盤點（Thinka 429 後冷卻）。  
- 唔准由本包衍生未批 UI 抄襲或內容搬運。  
