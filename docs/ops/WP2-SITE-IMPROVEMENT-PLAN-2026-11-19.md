# 工作包 2：網站研究、問題定義、假設與實作計劃

狀態：**計劃已提交 · 等創辦人批准先開 WP3** · 2026-11-19（Asia/Hong_Kong）  
本文件**只係計劃**；**唔改**產品代碼、**唔**新增部署驗證、**唔**自動開 WP3–5。

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

### P0 — 信任／合規／可發現性

| ID | 問題 | 證據 | 影響 |
|----|------|------|------|
| P0-A | 可見「贊助／廣告預留」UI 與憲章「零廣告」衝突 | `components/AdSlot.tsx`；`docs/REPOSITORY-TRUTH-REPORT.md` | 對外聲稱同憲章不一致 |
| P0-B | 雙重 robots／SEO 地圖與真實 route 不完全對齊 | `public/robots.txt` + `app/robots.ts`；Truth Report | 爬蟲／索引混亂 |
| P0-C | 編輯長文（`/dse-maths/*`）缺直達課題練習 CTA | `quadratic-equations/page.tsx` 無 `/practice?subject=math&topic=quadratic_equations` | 學習漏斗斷開 |

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
| H2 | 移除／熄 `AdSlot` 唔破壞 off-syllabus 版面 | 視覺檢查 `/off-syllabus/*` | 改為中性「相關連結」區（仍零廣告） |
| H3 | 統一 robots 單一來源唔影響正式索引意圖 | diff `robots.ts` vs 需要嘅 allow/disallow；抽查 sitemap | 回滾並只修衝突行 |
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

## 5. 建議實作批次（批准後先做）

| 批次 | 範圍 | 風險 | 依賴 |
|------|------|------|------|
| **A** | P0-C 漏斗 CTA（quadratic）＋ smoke 清單 | 低 | 無 |
| **B** | P0-A 移除／熄 AdSlot；P0-B robots 單一來源 | 中（合規＋SEO） | 憲章：維持零廣告 |
| **C** | P1-C paper-warrior query 預填；P1-D 訪客進度文案 | 低 | A |
| **D**（另批） | P1-B bank 題 topic 登記（只數學二次方程相關先） | 中 | 內容稽核 |
| **E**（另批） | P1-A 手機練習 390px 最小改動 | 中 | 設計約束／audit |

WP4：功能路徑＋紅隊（廣告回歸、robots、C1 文案、練習錯題）隔離驗收。  
WP5：另一次「批准發布」後先上 production，再做發布後驗證。

---

## 6. 容量閘門（貫穿 WP3）

- Functions Storage **9.54 GB** 仍緊 → 每批：docs-only 盡量走 Ignored Build Step；非必要 preview **cancel**  
- 可選下一輪：批准刪 `confirm_E`（18 個近 7 日 preview）再騰空間  
- 禁止為「試清理」而重複 deploy

---

## 7. 待你批准（回覆用）

請回覆其中一種（可組合）：

1. **`批 WP3-A`** — 只做數學二次方程 CTA／漏斗（推薦第一步）  
2. **`批 WP3-A+B`** — 另加 AdSlot＋robots  
3. **`批 WP3-A+B+C`** — 再加 paper query＋訪客文案  
4. **`改切片：…`** — 換科／課題  
5. **`先刪 confirm_E`** — 再騰 Functions Storage 先實作  

未收到上述明示前，**唔開始 WP3 代碼**。
