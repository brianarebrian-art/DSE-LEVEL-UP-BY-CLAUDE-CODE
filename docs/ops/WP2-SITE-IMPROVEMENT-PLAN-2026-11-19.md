# 工作包 2：網站研究、問題定義、假設與實作計劃

狀態：**計劃已修正證據 · WP3-A+B+C 已另開實作** · 2026-11-19（Asia/Hong_Kong）  
本文件**只係計劃**；**唔改**產品代碼（實作喺 [PR #233](https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE/pull/233)）。

**驗收範圍：** 本 PR 係 **ops／容量閘門後嘅 WP2 研究計劃**，**唔**屬 Feedback／auto-optimize 驗收（無 Feedback issue、無 `feedback`／`auto-optimize` 標籤）。

前置：WP0 Graphify 本機地圖 · WP1 Functions Storage 清理（[PR #231](https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE/pull/231)；Dashboard **9.54 GB**／免費 ~10 GB 仍緊；3x 至 Dec 19）。

憲章約束（全程適用）：永久免費、零廣告、US$200 成本死鎖、零版權侵犯、唔擅自加付費 API／新重量級套件。

---

## 1. 研究結論（已核實）

### 1.1 內容模型

| 層 | 事實 | 證據 |
|----|------|------|
| 題庫正本 | `data/questions/` · 約 **26,419** 題 · **25** 科 | `summary.generated.ts` `TOTAL_QUESTIONS` |
| 雲端鏡像 | Supabase `questions`；瀏覽器直連 + IndexedDB | `lib/questionCloud.ts`；憲章 §3.1 |
| 筆記 | **確定性聚合**（題庫＋陷阱字串＋本機錯題），**無** LLM 筆記引擎 | `lib/notes/notes.ts` `buildTopicNote()` |
| 編輯長文 | `/dse-maths/*` 等 SEO／教學頁，與 `notes`／`practice` **未完全串通** | 例：`app/dse-maths/quadratic-equations/page.tsx` 有內部連結，**無** `?topic=quadratic_equations` 練習 CTA |
| 紙筆／QR | 純前端 `window.print()` + 卷碼 QR；**無**後端 PDF | `app/paper-warrior/` · `lib/paper/paper.ts` · `lib/paper/qr.ts` |

### 1.2 核心學生流

```
/ → /subjects/{id} 或 quickStart → /practice?subject=&topic=
                                → /result
/notes/{subject}?topic= → /practice?subject=&topic=  （已接通）
/paper-warrior → 列印／卷碼 → /answer-sheet
```

- 訪客可練；C1：**未登入唔寫** `dse_progress` 入 localStorage（刷新即失當節進度記憶體）  
- 登入 = Supabase Auth Google；同意私隱後先雲端同步  
- 筆記頁 → 練習：已有（`NotesSubjectClient.tsx`）

### 1.3 容量／成本現況

| 指標 | 值 |
|------|-----|
| Functions Storage | **9.54 GB**（已確認讀數；相對 ~10 GB ≈ 95%） |
| 臨時額度 | 3x Until Dec 19 |
| Preview 防護 | Ignored Build Step／docs-only；WP3 仍應避免無謂 preview |

---

## 2. 問題定義（按優先）

### P0 — 信任／合規／可發現性（2026-11-19 覆核）

| ID | 狀態 | 現況證據（覆核） | 備註 |
|----|------|------------------|------|
| P0-A | **已解決（main）** | `components/AdSlot.tsx` **不存在**；`CategoryView` 無廣告／贊助預留 UI | 初稿誤引 `REPOSITORY-TRUTH-REPORT.md`（2026-10-22 基線）；SEO truth PR 已刪 AdSlot |
| P0-B | **已解決（main）** | 只餘 `app/robots.ts`；**無** `public/robots.txt` | 同上：Truth Report 過時；雙 robots 已消 |
| P0-C | **開缺（計劃時）→ 實作於 #233** | 計劃時 `quadratic-equations/page.tsx` 確缺 `/practice?subject=math&topic=quadratic_equations` CTA | 創辦人驗收確認 P0-C 正確；WP3-A 已補 |

### P1 — 體驗／內容可發現性／營運

| ID | 問題 | 證據 |
|----|------|------|
| P1-A | 手機練習流：導航／浮動鈕／多欄堆疊（審計 backlog） | `docs/audit-loop/STATE.md`、`source-audit.md` |
| P1-B | bank／param 題未掛齊 `SUBJECT_TOPICS` → notes／topic 篩選搵唔到 | 各 `*-bank.ts` 註解；`hidden-topics.ts` |
| P1-C | `paper-warrior` 未預填 `?subject=&topic=`（notes→紙筆未閉環） | notes 入口通用；`paper.ts` 支援 topic 但 URL 未串 |
| P1-D | 訪客 C1「刷新失進度」敘事未必夠清楚 | `lib/progress.ts`；結果頁有 Google CTA |

### 非問題（今輪唔當缺口）

- 「要起完整 LLM 筆記／後端 PDF 引擎」——與成本死鎖衝突；現有聚合＋列印已夠垂直切片  
- 「一次改晒 25 科」——超出業餘同步節奏；先一科一課題

---

## 3. 假設（WP3／WP4 驗證）

| # | 假設 | 點樣驗證 | 失敗時 |
|---|------|----------|--------|
| H1 | 數學×二次方程垂直切片可喺**唔加新依賴**下串通：編輯頁→筆記→練習→結果→（可選）紙筆 | 手動路徑 smoke + 既有單元測試 | 縮細為只補 CTA／修 P0 |
| H2 | ~~移除 AdSlot~~ **作廢**（main 已無元件） | 覆核：檔案不存在 | — |
| H3 | ~~統一 robots~~ **作廢**（已係 `app/robots.ts` 單一來源） | 覆核：無 `public/robots.txt` | — |
| H4 | 帶 topic 嘅 paper-warrior 唔增加 Functions Storage（純前端） | 無新 serverless 產物；preview 用 ignore 或 cancel | 唔合併該批 |
| H5 | 題庫正本／雲同步流程唔需要為本切片改 schema | 唔跑新 migration；只用現有 `?topic=` | 任何 schema 改動另開批准 |

---

## 4. 建議垂直切片（WP3 Batch A）

**一科一課題：** `math` + `quadratic_equations`（約 284 題；P0 科；首頁 quick start 含數學）

**完成定義（Acceptance）：**

1. 學生可由 `/dse-maths/quadratic-equations` **一撳**進入 `/practice?subject=math&topic=quadratic_equations`  
2. `/notes/math?topic=quadratic_equations` → 練習 → `/result` 全程可用（訪客）  
3. （可選，同批或 Batch B）`/paper-warrior?subject=math&topic=quadratic_equations` 預填並可列印／卷碼  
4. 憲章：無廣告 UI、無付費 API、無機器批改書寫題、Footer 免責仍在  
5. **唔**為驗證而打 production；preview 能 skip／cancel 就 skip／cancel  

**刻意不做（WP3）：** 新 PDF 服務、LLM、新 chart 套件、改 Auth、改題庫 schema、一次清晒 bank 題登記。

---

## 5. 建議實作批次

| 批次 | 範圍 | 狀態 |
|------|------|------|
| **A** | P0-C 漏斗 CTA（quadratic） | **已批准並實作** → [PR #233](https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE/pull/233) |
| **B** | 原計劃 AdSlot／robots；改為確認已解決＋ off-syllabus 去 emoji | **已批准並實作** → #233（P0-A／B 證據已標「已解決」） |
| **C** | paper-warrior query 預填；訪客 C1 文案 | **已批准並實作** → #233 |
| **D**（另批） | bank 題 topic 登記 | 未開 |
| **E**（另批） | 手機練習 390px | 未開 |

WP4：功能路徑＋紅隊隔離驗收（等 `開 WP4`）。  
WP5：另一次「批准發布」後先上 production。Fluid Active CPU 優化 **WP5 之後**另開。

---

## 6. 容量閘門（貫穿 WP3）

- Functions Storage **9.54 GB** 仍緊 → 每批：docs-only 盡量走 Ignored Build Step；非必要 preview **cancel**  
- 可選下一輪：批准刪 `confirm_E`（18 個近 7 日 preview）再騰空間  
- 禁止為「試清理」而重複 deploy

---

## 7. 證據修正紀錄（回應驗收不合格）

2026-11-19 創辦人驗收指出：

1. 本 PR **唔**入 Feedback／auto-optimize 驗收範圍 — **同意；已於文首標明**。  
2. P0-A／P0-B 證據過時 — **同意；已改為「已解決（main）」並註明 Truth Report 基線日期**。  
3. P0-C 正確 — **維持；實作見 #233**。
