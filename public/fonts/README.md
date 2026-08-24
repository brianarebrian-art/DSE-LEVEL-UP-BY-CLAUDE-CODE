# public/fonts — 易讀字體（SEN）

「易讀字體」開關（左下 ♿ 無障礙面板）會套用 `html.font-easy`（見 `app/globals.css`）。

## OpenDyslexic（可選，非必須）

`globals.css` 的 `@font-face` 已預留 `OpenDyslexic`，字型堆疊排第一：

```
font-family: 'OpenDyslexic', Verdana, Tahoma, 'Trebuchet MS', 'Comic Sans MS', … ;
```

- **有放字型檔** → 自動採用真・OpenDyslexic。
- **冇放** → 瀏覽器靜靜跳過，fallback 落後面的 BDA（英國讀寫障礙協會）系統無襯線
  堆疊 + 加寬字距/行距/左對齊。功能一樣即時可用，$0、零 CSP 例外。

### 現況：字型檔已放入（2026-08-24，HOTFIX-0823 第四階段）

`OpenDyslexic-Regular.woff2` 已經喺本資料夾入面，`/fonts/OpenDyslexic-Regular.woff2`
由 404 變成 200。出處記錄如下，方便日後核實同更新：

| 項目 | 值 |
|---|---|
| 來源 | jsDelivr CDN，鏡像 npm 套件 `@fontsource/opendyslexic@5.3.0` |
| 檔案路徑 | `files/opendyslexic-latin-400-normal.woff2` |
| 大小 | 115,280 bytes（≈113 KB） |
| SHA-256 | `f007004af3cda5d8076e57c943f8cc8d00a0da25988b1ae1048683d60e7cac1a` |
| 授權 | SIL Open Font License 1.1（OFL-1.1）—— 免費、可商用、可自寄 |
| 上游 | https://opendyslexic.org |

**注意：只係下載咗一個字型檔，冇裝任何 npm 套件**（憲章 §5 禁新增套件）。
`@fontsource/opendyslexic` 冇出現喺 `package.json`，jsDelivr 純粹當成一個靜態
檔案來源。網站執行時亦冇任何 CDN 請求 —— 字型由本站自寄，CSP `font-src 'self'` 照舊。

### 實測行為（2026-08-24 於 375px 量度）

- **英文**用真・OpenDyslexic：同一句 `Handwriting` 喺 40px 之下，OpenDyslexic 闊 318px、
  Verdana 闊 248px —— 即係**闊咗 28%**。
- **中文自動退回 PingFang TC**：OpenDyslexic 係 latin-only，冇 CJK 字符。實測
  「溫習足跡」經字型堆疊同直接用 PingFang TC 量度都係 162px，即係逐字退回得乾淨，
  唔會出現豆腐格。呢個正正係想要嘅行為：英文享受讀寫障礙友善字形，中文維持原本字型。
- 因為英文闊咗 28%，所以**每次改版都要喺開住易讀字體之下再驗一次 375px**，
  唔可以淨係驗預設字體。

### 要換／移除字型

- **換版本**：照上表重新下載，覆蓋同名檔案，更新上表嘅大小同 SHA-256。
- **移除**：直接刪咗個 woff2 就得 —— `globals.css` 嘅 `@font-face` 會靜靜跳過，
  fallback 落 BDA（英國讀寫障礙協會）系統無襯線堆疊，功能一樣可用，**唔會壞**。
