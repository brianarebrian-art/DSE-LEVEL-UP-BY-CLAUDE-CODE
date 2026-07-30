# TROUBLESHOOTING — 反覆出現的環境問題

只記錄**實際撞過、並且會再撞**的問題。每條包含：症狀、如何確認、如何解決。
未親自遇過的問題不要寫進來。

---

## 1. 改完 `globals.css`，但瀏覽器完全冇反應

**已撞 4 次**（2026-07-16、07-22、07-28、07-29）。最近一次是新增主題 token，
源檔明明有 26 處 `--color-surface` 等定義，瀏覽器讀 `getComputedStyle` 全部回傳空字串。

### 如何確認（唔好靠肉眼睇）

比對「源檔」與「實際供應的 CSS」：

```bash
node -e "
(async()=>{
  const html = await (await fetch('http://localhost:3001/')).text();
  const css  = [...html.matchAll(/href=\"([^\"]*\.css[^\"]*)\"/g)].map(m => m[1]);
  for (const u of css) {
    const t = await (await fetch('http://localhost:3001' + u)).text();
    console.log(u, 'bytes=' + t.length, '含 --color-surface:', t.includes('--color-surface'));
  }
})();
"
```

源檔 `grep -c` 有、但供應的 CSS 冇 → 即係本問題。

### 解決

**必須先停 server，再清快取。** 邊跑邊清會得到 Internal Server Error（試過）。

```bash
npm run clean   # rm -rf .next
npm run dev
```

或一步到位：`npm run dev:clean`

### 未確定的部分（唔好當結論）

未查證根因。可能與 Tailwind v4 的 Lightning CSS 增量快取有關，但**未經證實** ——
唔好喺文件或 commit message 寫「呢個係 Next.js／Tailwind 已知行為」，
因為冇查過上游 issue。目前只當作「已知症狀 + 已知解法」處理。

---

## 2. Tailwind v4 會靜靜掉走含嵌套方括號的 attribute selector

**2026-07-28 撞到。** 寫 `[class*="bg-[#FAFAF8]"]` 這種 selector，Lightning CSS
會**整條規則消失**，同一次編輯的其他規則正常生效，所以極易誤判為快取問題。

### 如何分辨兩者

- **快取問題**：同一次編輯的**全部**標記都喺供應的 CSS 入面搵唔到。
- **解析器掉走**：**只有**含嵌套方括號那條搵唔到，其餘正常。

用「數數量」而非「有／冇」去判斷：

```bash
grep -c 'class\*=' app/globals.css          # 源檔
# 對比供應的 CSS 入面同一個 pattern 的數量
```

### 解決

改用唔含方括號的 selector（例如直接用 `.min-h-screen`），或改為語意 token。

---

## 3. `.git/index.lock` 殘留，git 命令全部失敗

**已撞 3 次。** 訊息係「Another git process seems to be running」。

### 確認係殘留而非真的有進程

```bash
ls -l .git/index.lock          # 0 bytes 且時間戳好舊 = 殘留
pgrep -fl git | grep -v pgrep  # 冇輸出 = 冇活住的 git 進程
```

**兩項都符合先可以刪。** 有活住的進程時強行刪會弄壞索引。

```bash
rm -f .git/index.lock
```

### 已知成因之一

`git stash` 失敗（例如「could not write index」）之後會留低鎖。
2026-07-29 就係咁樣造成的。

---

## 4. 對比度稽核量出嚟嘅數字係錯的（三個必踩陷阱）

**2026-07-30 三個都撞過。** 稽核工具喺 `scripts/contrast-audit.js`（用法見檔首）。
以下三個錯誤各自造成過一批假數字，唔好重蹈：

### (a) 唔合成半透明底色 → 高估對比

`text-accent bg-accent/12` 呢類同色淡底藥丸，係全站最容易踩嘅陷阱。
只讀 `getComputedStyle(el).backgroundColor` 會拎到 `rgba(...,0.12)`，
或者跳去最近嘅不透明祖先 —— 兩者都唔會做 alpha 合成。
實際上淡底會拉近前後景，對比比純底再跌約 0.9。

**症狀**：首頁報「0 不合格」，但藥丸文字肉眼明顯偏淡。
**解法**：由 root 向 element 逐層合成（`effBg()` 就係做呢件事）。

### (b) 用 `canvas.fillStyle` 讀色 → 整層底色被靜靜跳過

Tailwind v4 調色盤（`bg-amber-400` 等）`getComputedStyle` 會回
`oklch(0.828 0.189 84.429)`。`fillStyle` 對 oklch **唔會**正規化成 rgb/hex，
於是 parse 回 null，而「解析唔到就跳過呢層」會令「黑字落琥珀掣」
變成「黑字落深藍卡」。

**症狀**：一次過 11 個假陽性，全部係 `text-black` 落彩色徽章。
**解法**：真正光柵化 —— 畫落 1×1 canvas 再 `getImageData`。
解析唔到嘅要計入 `unresolved` 報出嚟，**唔准當透明處理**。

### (c) 喺 console 直接翻 `data-theme` 唔 reload → 讀到兩個主題嘅混合值

全站有 `transition-colors`。未走完就量，會讀到「A 主題前景 ＋ B 主題背景」。

**症狀**：同一個元素喺 light 報「深字落深底」、喺 cyber 報「淺字落淺底」，
前後景剛好對調 —— 見到呢個 pattern 就一定係本問題，唔係真缺陷。
實際造成過：/practice 由真實 5 項虛報成 15 項；A11y 面板由 3 項虛報成 13 項；
首頁由真實 42 項虛報成 48 項。

**解法**：一個主題一次，`localStorage.setItem('dse-theme','cyber')` 之後
`location.reload()`。翻 attribute 只可以用嚟粗篩，唔可以用嚟落結論。

### 另外：token 底 ＋ 寫死字色 ＝ 一定有一個主題睇唔到

呢個唔係量度錯誤，係真 bug，而且會反覆出現。凡係卡底用 `bg-surface-raised`
（跟主題）而文字用寫死 `text-slate-*`／`#hex`（唔跟主題），就必然有一個主題
變「深字落深底」或「淺字落淺底」。反方向一樣成立：底色寫死深色（例如
`/dashboard/report`、A11y 面板）而文字靠 body 繼承 `text-ink`，淺色主題下就會
變 1.1:1。**兩邊必須同時跟主題，或者同時寫死。**

---

## 5. term-guard 攔截自己寫的註釋

`scripts/qbank/term-guard.mjs` **刻意連註釋一齊掃**（避免規範寫喺註釋但正文違規）。
所以喺 `data/questions/*.ts` 的註釋內引用被禁用詞（例如解釋「舊譯法係乜」）
一樣會 FAIL。

**解決**：改寫註釋，用描述代替字面引用。例如寫「舊譯法」而唔係直接寫出該詞。
唔好為咗遷就而放寬 gate。
