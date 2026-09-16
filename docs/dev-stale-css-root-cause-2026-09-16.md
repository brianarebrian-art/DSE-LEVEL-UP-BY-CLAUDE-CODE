# 開發機 CSS 凍結 —— 根因（2026-09-16 實測）

**症狀（由 2026-07-22 起斷續出現，今次工程債清單列為「每次 rm -rf .next」）：**
新加嘅 Tailwind class 或者 `app/globals.css` 嘅改動唔會出現喺送出嚟嘅
`/_next/static/css/app/layout.css`，byte 數一個都唔變，restart dev server 都冇用。

## 根因

`next dev --webpack`（Next 16）嘅持久化 webpack 快取擺喺 **`.next/dev/cache`**，
唔係 `.next/cache/webpack`。Tailwind v4 嘅自動來源掃描結果連埋 CSS module 嘅輸出
一齊入咗嗰個快取；**喺 dev server 開住嗰陣新增嘅檔案唔會令佢失效**，
而快取本身跨 restart 存活，所以「重開 server」唔解決問題。

`rm -rf .next` 之所以有效，係因為佢順手將 `.next/dev/cache` 一齊剷。

## 實測（每一步都量 byte 數同 grep 嗰個 class）

種一個全 repo 冇出現過嘅 class（`mt-[37px]`）喺一個【新檔案】入面，然後：

| 做咗乜 | 送出嘅 CSS | 有冇 `mt-[37px]` |
|---|---|---|
| 基線 | 146,175 B | ✗ |
| 新增 `components/__CacheProbe.tsx` ＋ 等 10 秒 | 146,175 B | ✗ |
| `touch app/globals.css` ＋ 等 11 秒 | 146,175 B | ✗ |
| 停 server → `rm -rf .next/cache/webpack`（690MB）→ 重開 | 146,175 B | ✗ |
| 停 server → `rm -rf .next/dev/cache`（380MB）→ 重開 | **146,218 B** | **✓** |

`touch` 冇用，因為檔案內容冇變，個 module 嘅快取照樣命中。

## 點做

```bash
npm run dev:fresh     # rm -rf .next/dev/cache && npm run dev
```

**唔使再 `rm -rf .next`。** 保留 `.next/cache/webpack`（690MB，`next build` 嗰份）
即係下次 build 唔使由零開始。`npm run dev:clean`（全剷）留住畀真係要由零嗰啲情況。

**幾時要用：** 加咗新檔案而入面有全新嘅 class，或者改完 `globals.css` 但改動冇出現。
**唔好每次改 CSS 都跑** —— 平時 HMR 係行得通嘅，無謂每次都畀成個 cold start 嘅代價。

## 診斷次序（唔好靠估）

1. `curl -s http://localhost:3001/_next/static/css/app/layout.css -o /tmp/served.css`
2. `wc -c` 同上一次比。byte 數一模一樣 = 快取命中，唔係你寫錯 CSS。
3. `grep -c 'your\\:class'`（記得 escape）。同時 grep 一個【一定存在】嘅 class
   做對照，分開「成份 CSS 冇載到」同「淨係呢條規則冇生成」。
4. 確認係快取先至 `npm run dev:fresh`。

⚠️ 另有兩個【唔同】嘅成因，唔好撈亂（見 `mobile-overflow-false-negative` 以外嘅
開發筆記）：Lightning CSS 會靜靜哋丟棄含巢狀方括號嘅屬性選擇器
（`[class*="bg-[#FAFAF8]"]`）；而 `npm run build` 就算 dev server 凍結咗都照樣
重新編譯，所以「呢個改動出唔出得街」最快嘅權威答案係 build 一次。
