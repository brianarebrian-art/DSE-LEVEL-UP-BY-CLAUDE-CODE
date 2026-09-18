# design-sync 筆記 —— dse-level-up

呢個 repo 唔係一般嘅 design system library，所以有幾個一定要記低嘅位。

## 這個 repo 的形狀

- **Next.js app，唔係 library。** `package.json` 係 `private: true`，冇 `main`／`module`／
  `exports`、冇 `dist/`、冇 Storybook。所以行 **package shape ＋ synth-entry**
  （converter 自己由 `components/` 合成一個 entry，log 會見到 `[NO_DIST]`）。
  「run the package's build」呢句唔適用 —— `npm run build` 出嘅係 Next.js app，唔係 dist。
- **要 `node_modules/dse-level-up` self-symlink。** npm 唔會 self-install，而 converter 喺
  冇 `--entry` 嗰陣會去 `node_modules/<pkg>/` 搵 package.json，搵唔到就 ENOENT crash。
  修法（每次 `npm ci` 之後都要再做一次，因為 `npm ci` 會清走）：

  ```bash
  ln -sfn .. node_modules/dse-level-up
  ```

- `cfg.srcDir = "components"`。唔設嘅話 converter 會揀 `lib/`（佢順序係 src → lib →
  components），而 `lib/` 入面係邏輯唔係組件。
- `tsconfig.json` 有註釋（jsonc），`node -p require(...)` 讀唔到，但 esbuild／ts-morph 讀得到。

## ⚠️ guidelinesGlob —— 唔好用預設值

預設 `['docs/guides/**/*.md', 'docs/*.md', 'guides/**/*.md']` 會將**成個 `docs/` 樹
70 份檔**當成 design guidelines 打包上傳，入面包括 `charter.md`、四份憲章修訂、
`signing-status-*.md`、`security_audit.md`、`legal_audit.md`、`PENTEST-SCOPING.md`、
`2027-student-data-inventory.md`。呢啲係治理／保安／學生數據文件，**唔應該上外部服務**。

2026-09-18 已經改成明文列出六份真係設計／無障礙嘅檔。加新檔要自己加入去，
**唔好改返做 glob**。憲章入面同設計有關嘅條文（§7 大愛設計紅線、§14 色系）
應該寫入 `.design-sync/conventions.md`，而唔係上傳成份憲章。

## ⚠️ 兩個一定要自己砌嘅嘢（2026-09-18 實測踩過）

### 1. 組件係 `export default`，synth-entry 攞唔到

Converter 嘅 synth-entry 寫 `export * from '<file>.tsx'`，而 `export *`
**唔會帶 default export**。呢個 repo 74 個組件全部係 `export default function`，
結果係 `@ds-bundle` header 嘅 `exports` 係 **0**，`window.DSELevelUp` 空手而回，
79 個預覽全部攞唔到組件。

修法：`.design-sync/gen-entry.mjs` 生成一個真 barrel
（`export { default as X } from '../components/X'`），再用 `--entry` 指住佢：

```bash
node .design-sync/gen-entry.mjs   # 出 ds-entry.ts ＋ component-src-map.json
node .ds-sync/package-build.mjs --config .design-sync/config.json \
  --node-modules ./node_modules --entry ./.design-sync/ds-entry.ts --out ./ds-bundle
```

`--entry` 仲有一個副作用係要嘅：PKG_DIR 會由 entry 向上行搵到 repo 根嘅
`package.json`，唔再撞 `node_modules/dse-level-up` 個 ENOENT。

**加咗新組件就要重跑 `gen-entry.mjs`，並且將 `component-src-map.json` 貼返入
config 嘅 `componentSrcMap`** —— 冇 `.d.ts` tree，converter 淨係靠呢個 map 認組件。

⚠️ generator 第一版將 `FONT`／`LINE`／`MIN`／`CATEGORIES`／`CLOUD` 呢類**全大寫常數**
當咗組件（8 個假組件）。而家個 regex 要求第二個字係細楷／數字。加新常數唔會再中招，
但如果有真組件叫兩個字母（例如 `Qr`），就要自己確認。

### 2. `process is not defined`

esbuild 只 define 咗 `process.env.NODE_ENV`，其餘 `process.env.*`
（`NEXT_PUBLIC_AUTH_BACKEND`、`NEXT_PUBLIC_SW_OFFLINE`…）原樣留低，
瀏覽器冇 `process` → 第一次 render check **79/79 全掛**。

修法：`.design-sync/ds-process-shim.ts`，喺 `ds-entry.ts` **第一個 import**。
唔可以擺喺 entry body —— ESM 先 evaluate 晒所有 import 先行 body，
而有組件喺 module top-level 就讀 `process.env`。

`cfg` 冇 `define` 呢個 key，而 skill 明文講唔好 fork `lib/bundle.mjs`
（佢定義緊同 app self-check 嘅輸出契約），所以 shim 係正路。

### 3. `cssEntry` 一定要指編譯輸出，唔可以指 `app/globals.css`

`app/globals.css` 第一行係 `@import "tailwindcss"` —— 佢係**源檔**。
餵佢做 `cssEntry`，`@theme` 嘅 CSS 變數會過到，但 `rounded-xl`／`bg-gold/10`／
`text-ink` 呢啲 utility class **一條 rule 都冇**。2026-09-18 實測嘅樣：
文字 render 到，但淺到幾乎睇唔到，冇邊框冇底色。

修法：`npm run build` 之後跑 `node .design-sync/gen-css.mjs`，佢會由
`.next/static/css/` 揀最大嗰個（主 stylesheet）抄去 `.design-sync/.cache/compiled.css`，
`cssEntry` 指住嗰個。Next 嘅檔名帶 content hash，所以唔可以直接寫死入 config。

⚠️ 即係話 **fresh clone 要先 `npm run build` 先做得 design-sync**，
因為 `.cache/` 係 gitignore 嘅。

### 4. 冇 `.d.ts` → props 全部塌成 `[key: string]: unknown`

converter 嘅 props 由【已 build 嘅 `.d.ts` tree】嚟（`lib/dts.mjs` 讀
`package.json` 嘅 `types`／`typings`）。呢個 repo 冇 emit 過 `.d.ts`，
所以 78 個組件嘅 `<Name>Props` 全部係空 —— 而嗰個 interface 正正就係
design agent 唯一睇到嘅 API 契約。

修法：`node .design-sync/gen-dts-props.mjs` 用 ts-morph 由 src 抽，
出 `dts-props.json`，貼入 config 嘅 `dtsPropsFor`（37 個有 prop，41 個零 prop）。
具名型別（`Difficulty`）會展開做字面 union；object 型別（`TextQuestion`）
展唔開就降級做 `unknown` 並喺同一行留返個名做註釋 —— **唔好扮知**。

## Provider 鏈

- 60 個組件用 `useLocale()`（`@/lib/i18n` 嘅 `LanguageProvider`）—— 冇佢預覽會白畫面。
- `ThemeProvider`（`components/ThemeProvider.tsx`，default export，`createContext`）
  管淺色／`cyber` 暗色。
- `SyncProvider`、`SettingsSync` 係雲端同步，預覽唔需要（而且會打 network）。
- 6 個組件 import `next/navigation`（`useRouter`／`usePathname`）—— 冇 App Router
  context 會 throw，要 stub 或者 skip。

## 憲章相關約束

- **§5 嚴禁新增套件**：converter 嘅 `esbuild`／`ts-morph`／`playwright` 全部裝喺
  `.ds-sync/` 自己個 `package.json`，**冇掂過 repo 嘅 `package.json` 同 lockfile**，
  `scripts/budget-guard.mjs` 掃唔到。`.ds-sync/`、`ds-bundle/` 已入 `.gitignore`。
- **§16.C 唔准預填**：render check 冇跑過就唔可以講「全部綠」。

### 5. KaTeX CSS 喺【細】嗰個 chunk

`gen-css.mjs` 第一版揀最大嗰個 CSS chunk，結果漏咗 KaTeX（393 條 `.katex` 規則
喺 28KB 嗰個，Tailwind 主 sheet 喺 88KB 嗰個）。冇咗 `.katex-mathml` 嗰條隱藏規則，
**每條數式都會出雙份**：KaTeX 排版版 ＋ MathML fallback 純文字版。
現時 `gen-css.mjs` 會將全部 chunk 合埋。

KaTeX 字體要另外拎：`cfg.extraFonts` 加 `node_modules/katex/dist/katex.min.css`
（converter 會 parse 佢再抄啲 woff2 入 `fonts/`）。唔加嘅話 27 個 @font-face
會被當 dead block 丟走，數式會用 fallback 字體。

## 唔 author 預覽嘅組件（連原因）

- **OfflineBadge** —— 佢讀 `SettingsSync` 個 context，而嗰個 `Ctx` **冇 export**，
  所以靜態環境入面永遠係 `idle`（component 本身 `return null`）。
  唯一嘅辦法係包成個 `SettingsSync`，但佢又要 `useAuthSession` ＋ 會真係打網絡。
  退返 floor card 係誠實嘅結果 —— 唔好為咗填滿張卡而砌一個假 badge。

- **EmotionThermometer ／ RestMode** —— 兩個都係 React **portal** 出去
  `document.body` 嘅浮層。試過三種做法都唔得：
  1. 直接 render → 面板頂部被切走（`fixed` 對住 viewport 定位）
  2. `cfg.overrides` 加 `cardMode: single` ＋ 加高 viewport → 一樣切
  3. 包一個帶 `transform` 嘅容器做 containing block → portal 根本唔理佢，出咗去 body，卡變空白

  一張切爛或者空白嘅卡，**比 floor card 差** —— floor card 至少誠實講「呢個未 author」。
  所以兩個都唔 author。要睇真身要喺 `localhost:3001` 開。

- **Mascot** —— 佢用 `next/image` 由 `/owl/<pose>.png` 攞圖（`public/owl/`，824KB）。
  Bundle 只帶 CSS 同字體，**唔帶 `public/` 嘅圖片**，所以五個姿勢全部出破圖 icon。
  converter 冇一個 cfg key 係用嚟搬任意靜態資產嘅（`extraFonts` 只收字體）。
  同一類問題亦影響 **QRCode**（`/qr.png`）。
  要修嘅話得兩條路：喺 preview 度用 data-URI inline 張圖（824KB 會入晒每張卡），
  或者等 converter 支援靜態資產。兩條都唔抵，所以退返 floor card。

- **PrivacyConsentGate ／ InstallHint ／ InAppBrowserNotice ／ ReadingRuler** ——
  四個都係**條件式**組件：未同意私隱條款／未收到 `beforeinstallprompt`／唔係
  in-app browser／閱讀尺未開，就 `return null`。靜態卡入面條件永遠唔成立，
  所以只會出空白。要造狀態就要喺 preview 度扮 UA、扮事件，
  等於寫一個假嘅瀏覽器環境 —— 嗰個唔係「組件真身」，係一個仿製品。

- **AppShell ／ GlobalA11y ／ ServiceWorkerRegister ／ SettingsSync ／
  SyncProvider ／ ThemeProvider ／ ArticleJsonLd** —— 七個都**冇視覺表面**：
  佢哋係 layout wrapper、全域事件 listener、SW 註冊、context provider，
  或者一個 `<script type="application/ld+json">`。render 出嚟本身就係「冇嘢」，
  所以 floor card 已經係最準確嘅呈現。`AppShell` 另外仲要 App Router context。

## ⚠️ 預覽環境冇任何 `NEXT_PUBLIC_*` env

`process` shim 供嘅係一個空 `env`，所以**每一條 env 分支都行「關」嗰邊**：
`NEXT_PUBLIC_AUTH_ENABLED`、`NEXT_PUBLIC_AUTH_BACKEND`、`NEXT_PUBLIC_SW_OFFLINE`
統統 undefined。影響到嘅卡最少有 `SyncStatus`（出「進度暫存喺呢部裝置」）同
`AuthButton`。**呢個唔係 bug，但睇卡嘅人要知**，否則會以為跨裝置同步未上線。
如果日後想 render 開咗 auth 嘅狀態，要喺 shim 度填返個 env 值，
並且喺卡嘅註釋講明嗰個係扮出嚟嘅。

- **Navbar ／ BottomNav ／ Sidebar ／ A11yPanel ／ AuthButton ／ NotTonightGate** ——
  六個都喺靜態卡度 render 唔到嘢，原因各有唔同：
  頭三個用 `next/navigation` 嘅 `usePathname`／`useRouter`，冇 App Router context
  就係一片空白；`A11yPanel` 係 `fixed` 浮動掣＋面板，同 portal 浮層一樣出唔到全身；
  `AuthButton` 喺 `NEXT_PUBLIC_AUTH_ENABLED` 未設之下 `return null`；
  `NotTonightGate` 未觸發之前唔會 render children。
  全部退返 floor card —— 一張空白卡比 floor card 差，因為佢會被讀成「呢個組件係空嘅」。

## Known render warns（已逐個睇過，唔係新問題）

- `[RENDER_THIN] QRCode` —— QR 碼係畫出嚟嘅圖形，一個字都冇，所以量文字嘅檢查
  自然報空。實際截圖兩格都畫到完整 QR（`SiteLink` 同 `Larger` 尺寸唔同）。良性。
- `[GRID_OVERFLOW] PracticeSupport ／ ShareStatsCardButton` —— 兩個都用 fixed／
  整幅闊度佈局，喺多欄格網入面會撐出格外。已加 `cardMode: single`。

## Re-sync risks（下次跑之前睇呢段）

- `npm ci` 會清走 `node_modules/dse-level-up` symlink → build 會 ENOENT。先重建個 link。
- `guidelinesGlob` 係明文清單，**唔會**自動跟到新加嘅設計文件；亦即係話有人加咗份
  新 UI 文件入 `docs/`，要自己加入 config 先會上傳。呢個係刻意嘅。
- 組件數會跟住 `components/*.tsx` 郁。今次 79 個（80 個 PascalCase export 減 1 個
  enum/type/context/hook）。數量大跳動就要睇下係咪 `srcDir` 被改過。
- `app/globals.css` 73KB 係單一 token 來源；莫蘭迪主色同四隻霓虹色（只用喺導出 PNG 卡）
  都喺入面，改咗色系要重跑先會同步。

## `docs/tokens.md` 係生成檔（2026-09-18 加入 guidelines）

`guidelinesGlob` 第七份 `docs/tokens.md` **唔係人手寫**，由
`scripts/gen-token-doc.mjs` 讀 `app/globals.css` 生成。

- 重跑全量 sync 之前先跑 `npm run tokens:doc`，否則上傳嘅係舊表。
- `npm run qa` 尾段有 `gen-token-doc.mjs --check`，過期會 exit 1，所以
  正常流程唔會漏 —— 但 design-sync 唔行 `qa`，呢度特登寫低。
- 佢出【resolved】值唔係宣告清單：`--color-accent-strong` 喺 `@theme`
  宣告 `#00726C`，但 `:root`（L363）指去 sage `#57685C` 贏咗。
  design agent 照 `@theme` 揀色就會成套偏綠青。65 個 token 入面 28 個係咁。
