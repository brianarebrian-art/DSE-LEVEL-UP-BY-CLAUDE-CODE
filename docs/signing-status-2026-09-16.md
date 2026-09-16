# 待簽狀態表 —— 2026-09-16

**一張表睇晒邊樣等緊邊個簽。** 全部數字今日實跑，指令附喺每格。
**機器永不自動入庫（§12）；虛擬 persona 唔可以簽名。** 所有簽名欄留白。

---

## 一、三份草案（已 commit，已推上 origin）

| 草案 | commit | 等緊 | 簽咗之後會發生乜 |
|---|---|---|---|
| [憲章四項不一致](charter-inconsistency-draft-2026-09-16.md) | `87cdeaa` | Brian ⬜　Yuna ⬜ | 改 `docs/charter.md` §3 版本號、§14 色系、§7 刪「零故障保證」、§1 加 7 日副署上限 |
| [中途離開採集提案](proposal-dropout-measurement-2026-09-16.md) | `962e2bd` | Brian ⬜　Yuna ⬜ | 先答「欄位層面新增算唔算新增 key」，再落 `intendedSize` ＋ `abandonedBefore` |
| [內容債清單](content-debt-2026-09-16.md) | `d40ddef` | 各科首席 ⬜（逐科） | 逐科決定點清 745 處；批 145 條草稿；批 12 張數學卡 |

三份都**唔改產品代碼**，簽名前後個站行為唔變。

## 二、憲章四項（實跑核實，2026-09-16）

| # | 條文寫 | 實際 | 指令 |
|---|---|---|---|
| 1 | §3:48 Next.js **16.2.9** | **16.3.2** | `node -p "require('next/package.json').version"` |
| 2 | §14 暗底霓虹 `#00F5D4` 等 | `--color-surface: #FAFAF8`、`--color-ink: #1A1A1A`、`--color-accent: #006B65`；四隻霓虹色**仍然用緊**，喺 `DailyStatsCard`、`ResultPageClient` 嘅導出 PNG 卡 | `grep -nE "^\s*--color-(surface\|ink\|accent):" app/globals.css` |
| 3 | §7:280「零故障保證」 | 撞 §16.D（禁絕對／runtime 聲稱）；冇 runtime 監測 | `grep -n 零故障 docs/charter.md` |
| 4 | §717「⬜ 待 Brian 副署」 | **第 7 日**（2026-09-09 → 09-16）；而 `SESSION_SIZE = 10` 已經上線 | `grep -n "待 Brian 副署" docs/charter.md`；`grep -n "SESSION_SIZE = " lib/entitlements.ts` |

⚠️ 第 4 項最急：**代碼已經跟住一份未生效嘅條文行。** 要麼即日副署，要麼復原
`SESSION_SIZE` 同反思鎖。拖住唔決定，等於冇人答得到「而家份憲章講緊乜」。

## 三、內容債（實跑核實，2026-09-16）

| 項 | 數 | 指令 |
|---|---|---|
| 英文欄夾中文 · **真債** | **745 處 / 685 題**（中文科以外六科） | `npx tsx scripts/qbank/scan-en-cjk.mts` |
| 　同上 · 中文科內 | 122 處 / 68 題 —— 要中文首席確認係原文定漏譯 | 同上 |
| 　同上 · 單語設計 | 18,626 處 —— **唔係債**，唔好順手「修」 | 同上 |
| posref 位置式引用 | **293 條 / 208 個題庫檔**，零新增；草稿 178 檔乾淨 | `node scripts/qbank/check-posref.mjs --banks` |
| 字符債 | **6 處 / 2 檔**（經濟 1 題 2 欄、歷史 4 題） | `npm run qbank:charscan -- --all` |
| 題目草稿待批 | **145 條 / 20 檔**，其中 `*-written-b4` **140 條 / 17 檔** | 見清單 §D |
| SENSEI 數學卡 | **12 張 pending**，reviewer 留白 | 見清單 §E |

**兩條唔可以代簽：** `economics-floor.json`（1 條，審批人 `brian`）、
`ths-floor2.json`（1 條，審批人 `Brian`）—— 要原審批人自己補。

## 四、已經做完、唔使簽嘅（今日實測）

| | 結果 |
|---|---|
| PWA 離線（Supabase 一齊死） | A 做題途中熄 server 照答 · B 斷網 reload 出返第 1/10 題 · C 未開過嘅頁出雙語離線頁 · D 離線旗 0 重 build 後 `dse-offline-v1` 被清 —— 四項綠。模擬方法：build 時 `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:9`，暖機時快取 34 項 |
| 對比度 ＋ 375px | 35 路由 × 2 主題 = 70 次，0 失敗 0 爆版（探針已修祖先 opacity，自測三紅三綠） |
| dev CSS 凍結根因 | 係 `.next/dev/cache`（380MB），**唔係** `.next/cache/webpack`（690MB）；`npm run dev:fresh` 只清前者 |
| 測試閘 | `npm test` 953/953 · `tsc` 0 · `npm run qa` exit 0 |

## 五、SEN 備註（寫喺呢度，唔係口號）

服務對象入面 SEN 同情緒困擾比例高，所以上面每項簽名都要順帶睇呢幾條：

- **讀寫障礙** —— 745 處英文欄夾中文對佢哋最傷（要靠字型同語言一致性）。
  現有支援：OpenDyslexic 字體、防跳行閱讀尺、柔和呈現，全部喺 `A11yPanel`。
- **ADHD** —— 「只做 1 題」入口同 Focus 專注燈（`Shift + F`）已上線，**自選、預設關**。
  所以 5 題卷唔好靜靜哋改預設（§7.1 10-09 覆檢先決定）。
- **ASD** —— 要可預測：休息日護盾文案固定、安靜模式收起段位／EXP，唔好突然改流程。
- **焦慮／抑鬱** —— 冇 Daily Streak、冇斷纜、冇排名（`no-daily-streak.test.mts` 守住）。
  匿名 pulse 如果要做，**唔可以公開「全港 N 人」呢類具體數**（§8 禁虛構統計、
  §16.E 約束 3 禁跨用戶匯總比較）。

---

**重跑成張表：**

```bash
node -p "require('next/package.json').version"
npx tsx scripts/qbank/scan-en-cjk.mts
node scripts/qbank/check-posref.mjs --banks
npm run qbank:charscan -- --all
npm test && npx tsc --noEmit && npm run qa
```
