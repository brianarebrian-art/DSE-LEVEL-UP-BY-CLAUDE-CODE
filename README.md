# DSE LEVEL UP

專為香港 DSE 考生而設嘅免費練習平台 —— 25 科、中英雙語、情緒安全同 SEN 友善行先。

https://dse-level-up-by-claude-code.vercel.app/

**100% 免費。** 無 Premium、無訂閱、無廣告。Google 登入只做跨裝置進度同步，唔會解鎖任何額外內容。

## 技術棧

| | |
| --- | --- |
| Framework | Next.js **16.2.9**（App Router） |
| UI | React **19.2.4** + Tailwind **v4** |
| 認證 | Auth.js **v5**（`next-auth@5.0.0-beta.31`，Google OAuth） |
| 資料庫 | Supabase（**server-only**，`service_role`） |
| 數式 | KaTeX |
| 圖表 | 純 SVG + Tailwind（**無** Chart.js / D3 / Recharts） |
| 匯出 | html2canvas（**無** jsPDF —— 新 dep >50KB 一律拒） |

三個容易搞錯嘅位：

- Next.js 16 已將 `middleware.ts` 改名 **`proxy.ts`**。新開一個 `middleware.ts` 會被靜靜忽略。
- `better-auth` 仍然喺 `package.json`，但**休眠中**（藏喺 `NEXT_PUBLIC_AUTH_BACKEND` 後面，未啟用）。**現行認證係 Auth.js v5。**
- Supabase 所有 RLS policy 都係 `service_role` only，`auth.users` 係 0 行 —— 即係話 `auth.uid()` 永遠 NULL，**瀏覽器 client 讀寫唔到任何嘢**。所有數據操作必須經 server-only 嘅 `getServiceSupabase()`。

## 本地開發

```bash
npm install
npm run dev      # http://localhost:3001
npm run build    # 已內建 --webpack
npm run qa       # term-guard + validate-banks + i18n-guard
npm run lint
```

**dev port 釘死喺 3001**，唔可以隨手改 —— Google OAuth 嘅 redirect URI 係按 `localhost:3001` 註冊，跑第二個 port 會 `redirect_uri_mismatch`，登入即刻爆。

**build 一定要行 webpack。** 呢個 flag 已經寫入 `npm run build`；直接行 `next build` 會用 Turbopack，喺冇 system Node 嘅環境會壞。

## 生產紀律

```
concept-webs/ → factory → drafts/ → _gate.mjs（機器客觀閘）
  → review-drafts.mjs → 【真人逐題批】→ decisions.json
  → promote-drafts.mjs → 【人手 wire 入 load.ts + index.ts】→ git push
```

**機器永不自動入庫。** `/admin` 面板只係**記錄決定**，記錄 ≠ 入庫。

⚠️ `promote` 係按科目**覆寫** `<科>-reviewed.ts`。同一科如果有兩批草稿，必須先合併再 promote，否則會冚走前一批。

### 出題規則（會被 `npm run qa` 攔）

- **解析絕不可引選項字母**（A/B/C/D）—— 選項會 Fisher-Yates 洗牌，每次 render 位置都唔同。要引就引干擾項嘅**內容**。
- **禁純記憶題**。每題要考分析／因果／比較／評價／史料詮釋。
- **術語紅線**：共用品（非「公共財」）、企業家職能（非「企業」）；收入／交叉／點彈性全部超綱。
- **非語文科一律標準書面語**，唔可以有廣東話口語。
- 題目一律用**原創平行改寫法**（換數字、情境、人名，保留底層考核邏輯）。真 HKEAA 試卷只作參考，永遠唔抄。

## 免責聲明

本平台提供之試題均為獨立改寫版本，旨在協助考生練習應試技巧，並非香港考試及評核局（HKEAA）官方試題。官方歷屆試題請前往 HKEAA 網站下載。等級預測僅供參考，最終成績以 HKEAA 公布為準。

© DSE Level Up 2026. Not affiliated with HKEAA. All questions are independently rewritten for educational purposes.
