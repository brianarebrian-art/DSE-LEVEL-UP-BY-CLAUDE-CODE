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

### 要啟用真・OpenDyslexic

1. 由官方 https://opendyslexic.org （SIL Open Font License，免費、可商用）下載 Regular。
2. 轉成 `woff2`，命名 **`OpenDyslexic-Regular.woff2`**，放入本資料夾（`public/fonts/`）。
3. 完成 —— CSP `font-src 'self'` 已允許自寄字型，毋須改設定。

> 唔放字型檔**唔會壞** —— 只係用 fallback 堆疊。字型檔屬第三方資產，唔連同 repo 附上；
> 由你決定是否加入。
