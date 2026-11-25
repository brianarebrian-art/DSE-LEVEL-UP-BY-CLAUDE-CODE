# docs/00-inventory.md — 技術與題庫盤點

> 生成時間：2026-11-26（Asia/Hong_Kong）  
> 分支：`cursor/qbank-30d-scope-c2e7`  
> 範圍：30 日縮範圍計劃（1B + 2B）Sprint 1  
> 狀態：可驗證事實；非完成宣稱

## 1. 技術棧

| 層 | 實況 |
|---|---|
| Framework | Next.js（見 `package.json`）+ React 19 |
| 樣式 | Tailwind CSS v4 |
| Auth | Supabase Auth · Google OAuth（`@supabase/ssr`） |
| DB | Supabase PostgreSQL |
| 部署 | Vercel |
| 錯誤監控 | Sentry（Session Replay 關閉） |
| 題庫正本 | git：`data/questions/*.ts` |
| 題庫雲端鏡像 | `public.questions` + `question_bank_versions`（anon SELECT） |

## 2. 題數目（已用 `npm run baseline -- --json` 核實）

| 指標 | 數值 |
|---|---:|
| 科目 | 25 |
| 總題數 | **26,428** |
| MC | 25,367 |
| text（短答） | 185 |
| long（長答／結構） | 876 |
| easy / medium / hard | 6,775 / 14,474 / 5,179 |
| withdrawn（不下發學生） | 616 |
| pending-review | 13 |
| 實名 provenance（`REVIEWED_COUNT`） | **5** |

逐科數字見 [`docs/01-baseline.csv`](01-baseline.csv)。總數與宣稱 26,428 **一致**。

## 3. 題目資料結構（`data/questions/types.ts`）

共用欄位：`id`, `type` (`mc`|`text`|`long`), `subject`, `topic`/`topicZh`/`topicEn`, `framework*`, `difficulty`, `year`, `content`/`contentEn?`, `marks`。

| 題型 | 關鍵欄位 | 批改 |
|---|---|---|
| MC | `options`, `correctIndex`, `explanation`, optional `steps`/`optionNotes` | client 比對（現況） |
| text / long | `referenceAnswer`, optional `markingScheme` | **永不自動批改**（憲章 §16.A） |

**缺口：** 題目物件**無** `paper`／卷別欄位；卷面事實另存 [`data/dse-paper-formats.ts`](../data/dse-paper-formats.ts)。`year` 大量為 `0` 或無實用年份軸。`_builder.ts` 約定 `correctIndex: 0`（正確項存於 options[0]，顯示時洗牌）。

## 4. 出題與評分現況

- Session 長度：`SESSION_SIZE = 10`（`lib/entitlements.ts`）
- 抽題：`lib/sessionSample.ts` — easy:medium:hard ≈ 3:5:2
- 選項洗牌：client `PracticeSession`（按中文選項字比對）
- Server 覆核：`POST /api/result/verify`（只回分數，不回逐題答案）
- **答案完整存在於前端／anon SELECT**（憲章 §3.1 刻意設計；2B 將修訂）

## 5. 列印

- `/paper-warrior`：瀏覽器 `window.print()` + CSS
- 確定性 seed：`lib/paper/paper.ts`
- **無** server-side PDF 生成

## 6. 審批流現況

```
drafts → auto-promote（機器閘）→ *-auto.ts → git
可選：review_decisions / *.decisions.json → promote-drafts（default-deny）
撤回：withdraw.mts → withdrawn.json
```

質素表 `dse_question_quality_reviews`（migration 0024）存在，但非學生路徑 live gate。

## 7. 等級估算

- `lib/mastery.ts` + `/predictor`：範圍估計、最少題數門檻、非官方用語
- 書寫題不入準確率
- 不得宣稱等同考評局

## 8. 最大已確認風險

1. 無學科教師；人類無法作為學術正確性最終防線。  
2. 答案前端曝光 ↔「防撞答案」目標衝突（待憲章 2B）。  
3. 機器閘不能驗證學術正確。  
4. 30 日無法誠實完成 26,428 全量 `RELEASED`（已採 1B 縮範圍）。  
5. 生產 schema 與 repo migration 對帳未完成（SEC-P0）。
