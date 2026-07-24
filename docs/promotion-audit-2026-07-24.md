# 題目入庫審計鏈 — 2026-07-24

> 由 Supabase `review_decisions`（真實簽名層）+ 本地 `*.decisions.json` 導出。
> Fact-Check Protocol 三點對數：**A** 本地 decisions（`pull-decisions` 已同步）·
> **B** Supabase `review_decisions` · **C** live 題庫 `data/questions/*-reviewed.ts`（已 promote + wire + build 綠）。

## 本次 promote 結果（44 題 live）

| 科目 | reviewed.ts | 本次新增 | 保留（合併前已 live） | 簽核人 |
|---|---|---|---|---|
| bafs | 6 | bafs-01…06 | — | 望咩望,未見過海綿寶寶咩? |
| english | 6 | eng-idiom-01…06 | — | 望咩望,未見過海綿寶寶咩? |
| economics | 20 | econ-ms-mc-0…9（10） | econ-sd-mc-0…9（10, brian） | brian + 望咩望… |
| chinese | 12 | art-chinese-*（10） | ctx-demo-1,2（2, brian） | brian + 望咩望… |

**合併保護**：`promote-drafts` 按科目**覆寫** `<科>-reviewed.ts`。economics/chinese 已有 live 題，
故先合併「舊 live + 新批」再 promote，確保 econ 供需 10 題、chinese 跨篇 2 題**冇被覆寫蝕走**。

## 簽名記錄（Step B · Supabase review_decisions）

32 條新題全部 `approved`，簽核人 `望咩望,未見過海綿寶寶咩?`（`/admin` 由 `ADMIN_EMAILS`
allowlist 閘住，只限兩位創辦人登入 → 呢個花名 = 真人創辦人手簽）：

| 批次 | 題數 | decision | 簽核時間（UTC） |
|---|---|---|---|
| bafs-batch | 6 | approved ×6 | 2026-07-23 04:43–04:44 |
| english-idioms-batch | 6 | approved ×6 | 2026-07-23 04:44–04:45 |
| chinese-fanwen-weak-84 | 10 | approved ×10 | 2026-07-17 15:37–15:38 |
| econ-market-structure-mc-10 | 10 | approved ×10 | 2026-07-18 04:06–04:08 |

另外 2 個經舊離線流程簽名（本地 `*.decisions.json`，reviewer=`brian`）：
`econ-supply-demand-mc-10`（10, 2026-07-17）· `chinese-crosstext-demo`（2, 2026-07-17）。

## 過閘記錄

- `promote-drafts.mjs` 對每條 approved 重新過 `gateRow`（format / dedup / 術語）。
- **bafs 曾被硬閘攔截**：bafs-01/03/05 用裸 `$`（貨幣），會被 KaTeX 誤讀為數式起始 → 顯示爆錶。
  已將 28 個裸 `$` → `\$`（跟 `economics-reviewed.ts` 既有慣例；**數字不變、僅顯示修正**）後重跑，通過。
- `validate-banks.mjs` 綠；`npm run build --webpack` 綠（25 科 SSG 全出）。

## 誠實備註

- 簽核花名「望咩望,未見過海綿寶寶咩?」係創辦人自選 handle；因 `/admin` allowlist 只限
  Brian/Yuna，故屬真人簽名。若需更正式 audit 名，可日後喺 `/admin` 用真名重簽。
- 機器全程**只做 promote（機械搬運）**，簽核 100% 由真人喺 Supabase 完成 —— 符合
  「機器永不自動入庫」最高原則。
