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

## 4. term-guard 攔截自己寫的註釋

`scripts/qbank/term-guard.mjs` **刻意連註釋一齊掃**（避免規範寫喺註釋但正文違規）。
所以喺 `data/questions/*.ts` 的註釋內引用被禁用詞（例如解釋「舊譯法係乜」）
一樣會 FAIL。

**解決**：改寫註釋，用描述代替字面引用。例如寫「舊譯法」而唔係直接寫出該詞。
唔好為咗遷就而放寬 gate。
