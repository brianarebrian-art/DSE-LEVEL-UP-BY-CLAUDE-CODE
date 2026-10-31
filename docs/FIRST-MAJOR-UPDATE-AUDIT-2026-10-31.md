# DSE Level Up 第一次大更新審計報告

**審計日期：** 2026-10-31（Asia/Hong_Kong）  
**範圍：** `/workspace` 程式庫與文件（唯讀）  
**方法：** 目錄盤點 + 核心旅程走讀 + migration／事件／Founder OS 對照；三路平行深讀後抽樣核對  
**約束：** 只引用實際存在嘅檔案、route、資料表；無法證實處標「缺少證據」  
**生產狀態：** Vercel Analytics 後台數字、`FOUNDER_GOOGLE_SUB` 實際值、部分 migration 遠端套用狀態 → **缺少證據**（需創辦人／dashboard 核對）

---

## 1. 執行摘要

### 平台而家最強嘅 3 個地方

1. **誠實嘅產品底線已寫入憲章並落地：** 永久免費、無廣告、無付費層（`docs/charter.md` §1；`0015_drop_payment.sql`；`lib/entitlements.ts` 完全開放）；題庫披露「自動檢查 ≠ 教師審定」（`QuestionProvenance.tsx`、`HomePageClient.tsx`）。
2. **核心練習引擎可用：** `/practice` 支援科目／課題／弱點／錯因模式、即時解析（`StagedExplanation`）、結果頁下一步、本機進度與間隔重溫（`PracticeSession.tsx`、`lib/reviewSchedule.ts`、`ReviewScheduler.tsx`）。
3. **Founder OS 權限閘完整且 deny-by-default：** `requireFounder()`／`FOUNDER_EMAILS` + `FOUNDER_GOOGLE_SUB`；layout／頁面／API／Server Actions 多層閘（`docs/founder-os.md`、`lib/auth/founderAllowlist.ts`）；指揮中心已有「今日 Top 5」 intellig 切片。

### 最阻礙終極目標嘅 5 個問題

1. **無法用可查詢事件證明「有效學習節」與進步：** 無產品事件 SDK；漏斗事件名全部未埋點；只有匿名 `practice_counts`（started／completed）+ 登入 blob + Sentry／Vercel 瀏覽。
2. **學習迴圈缺前測／後測／掌握認證：** 現況係短節練習＋課題級間隔重溫＋等級區間估算，唔係「診斷→干預→後測→掌握」系統。
3. **題庫可信度仍偏「機檢入庫、人手事後撤回」：** 有撤回／待核／舉報／質素 schema，但無逐題版本鏈、無每題正確率／用時／放棄率、教師審定覆蓋未知。
4. **資訊架構入口過多、下一步唔唯一：** 「練習」tab → `/subjects`，真正引擎係 `/practice`；另有 `/start`、QuickStart、JustOne、SEO 學科頁、paper-warrior 等平行面。
5. **Founder OS 多個子模組係誠實空殼：** 學習漏斗／增長／APM／內容缺口相對課綱 **unconnected**；overview 全表掃 `user_progress` 有效能債。

### 本次大更新最優先處理嘅 3 件事

1. **Phase 0：** 安全網、baseline、確認環境／migration／Founder 綁定、記錄核心流程基線。
2. **Phase 1：** 收斂「進站→揀科→10 題→解析→完成→回訪」唯一下一步；補齊可查詢核心漏斗事件（喺私隱／憲章允許範圍內）。
3. **Phase 2→3：** 題庫透明度可追蹤 + 用真實數據驅動 Founder OS「今日 Top 5」，唔再加假儀表板。

---

## 2. 產品與資訊架構

### 現狀

| 能力 | 證據 |
|------|------|
| Brand-first 首頁、免費無廣告訊息 | `app/page.tsx`、`app/HomePageClient.tsx`；`lib/dictionary.ts` trust 文案 |
| 智能開始中轉 | `app/start/page.tsx`、`StartRedirect.tsx`、`lib/quickStart.ts` |
| 科目目錄與科目詳情 | `app/subjects/`、`SubjectDetailView` |
| 練習引擎 | `app/practice/PracticeShell.tsx`、`PracticeGate.tsx`、`PracticeSession.tsx`（約 1364 行） |
| 結果與下一步 | `app/result/ResultPageClient.tsx`、`lib/resultNextSteps.ts` |
| 進度／收藏／帳戶 | `app/dashboard/`、`app/bookmarks/`、`app/account/` |
| 信任／透明度／方法論 | `app/trust/`、`app/transparency/`、`app/methodology/`、`app/about/` |
| 導航 | Navbar／BottomNav「練習」=`/subjects`；主 CTA「開始練習」=`/start`（`components/Navbar.tsx`） |
| 沉浸式練習（隱藏 chrome） | `lib/immersiveRoutes.ts` |

**主旅程：**

```text
/ → Continue／QuickStart／全部科目
  → /start（智能）或 /subjects → /subjects/[subject]
  → /practice?subject=…（±topic／mode／size）
  → 答題 + 解析 → /result（size=1 就地收結）
  → 再練／dashboard／間隔重溫
```

### 問題

1. 「練習」語義分裂：tab 落地科目目錄，引擎在 `/practice`。
2. 開練入口過多，缺少單一「而家做呢一步」契約。
3. SEO 學科頁（`/dse-maths`、`/dse-english`、`/dse-physics`）與題庫練習雙軌，易以為兩套產品。
4. Dashboard 資訊密度高（JustOne、光譜、雷達、重溫、弱點…），手機回訪「下一步」唔尖。
5. 平行支線多（`/paper-warrior`、`/answer-sheet`、`/predictor`、`/relax`、`/cantonese`、`/off-syllabus`）——部分合憲章，但搶注意力。

### 證據／檔案／路由

- `components/Navbar.tsx` L70–71：`tabPractice` → `/subjects`
- `components/BottomNav.tsx`：同樣結構
- `app/practice/PracticeShell.tsx`：無 `?subject=` → `MissingSubject`
- `app/HomePageClient.tsx`：多 CTA（Continue、QuickStart、季節 hero）

### 影響

首次用戶可能猶豫；回訪者有 Continue／`/start` 但仍訊息重複；對外「學習操作系統」敘事同實際「短節題庫＋本機適應」有落差。

### 建議

- 建立共用「下一步」決策（未完成→續做；到期重溫→重溫；否則 QuickStart／recommendNext）。
- 對齊「練習」tab：要就改去 `/start`，要就 copy 寫清「練習＝揀科」。
- SEO 學科頁明確標「筆記／概念」vs「開始練習」。
- Dashboard 手機頂部只留「今日一件事」。

---

## 3. 學習體驗

### 現狀

| 功能 | 狀態 | 證據 |
|------|------|------|
| 針對性練習（topic／weakness／cause） | 有 | `PracticeShell` query modes；`lib/recommendNext.ts` |
| 即時解析、分階段揭曉、optionNotes、mcHack | 有 | `StagedExplanation`、`OptionNotes`、`ExplanationBody` |
| 節內「再試一次」 | 部分 | 只重設畫面；計分用首次作答（`PracticeSession.tsx`） |
| 間隔重溫 | 有（課題級） | `lib/reviewSchedule.ts`（1／3／7／14／30 日）；`ReviewScheduler` 註明唔重播原題 |
| 等級區間估算 | 有（非認證） | `lib/mastery.ts`（≥30 有效題）；`/predictor`；`/trust` 明講未外部審計 |
| 低門檻／SEN 友善元素 | 有 | JustOne（`size=1`）、休息日、NTM、沉浸式、觸控 `min-h-11/12` |
| 診斷前測 | **缺少** | 無 pretest 路由／模式；`BlindTestQuestion` 僅首頁示範 |
| 後測 | **缺少** | `/result`＝本節結算，非補救後對照 |
| 掌握認證 | **缺少** | 只有估算；無證書產品（合憲章：唔好過度聲稱） |
| 錯題專用重做卷 | **部分／缺** | 無「只重做今節錯題 ID」專用流程 |

### 問題

1. 學習科學迴圈斷喺兩頭（無前測基線、無後測關閉）。
2. 「錯題重溫」文案 vs 課題抽題行為可能造成信任摩擦。
3. 解析質素參差：多數 explanation 係散文；真 `steps[]` 可選且稀少（`types.ts` 註釋：現行多數無真步驟）。
4. Text／Long 題靠自評，唔自動批改（誠實設計，但成效量度更難）。

### 證據／檔案／路由

- `data/questions/types.ts`：`topic`／`framework`／`difficulty`／`type`；**無** `knowledgePoint`、`trapType` 學生題庫欄位
- `app/admin/ReviewPanel.tsx`：審題工具有 `trapTypes`（唔在公開題型）
- `components/ReviewScheduler.tsx`：間隔＝課題操練

### 影響

平台能量度「有冇練完」，但能量度唔到「練完之後有冇真係進步」——直接阻礙終極目標第 3 點。

### 建議

- Phase 4 先做可選「摸底 10 題」+ 同型後測，計算 learning gain；**唔宣稱認證／保證升 grade**。
- UI 誠實化：重溫寫「重溫呢個課題」或真按 `questionId` 重播。
- 新題優先要求真 `steps`／`optionNotes`，舊題唔好假切分。

---

## 4. 題庫與內容品質

### 現狀

| 能力 | 狀態 | 證據 |
|------|------|------|
| 題目唯一 `id` | 有 | `data/questions/types.ts`；雲端 PK `0016_questions_public_read.sql` |
| 科目級 bank version（hash） | 有 | `scripts/qbank/bank-version.mts`；`bank-versions.generated.ts`；`question_bank_versions` |
| 逐題 content version | **無** | `types.ts` 無 version 欄 |
| 撤回／待核／原因碼 | 有 | `hidden-topics.ts`、`withdrawn.json`、`pending-review.json`、`withdraw.mts` |
| 機檢披露 | 有 | `qualityFlags.ts`、`QuestionProvenance` |
| 質素審核 DB 框架 | 有 schema | `0024_question_quality_review_framework.sql`；`ai_findings` vs `human_findings` |
| 錯題回報 | 有 | `0020_question_reports.sql`；`ReportQuestionButton`；詳情走 mailto（唔入庫） |
| 自動閘 | 有（非全庫） | `validate-banks.mjs`、`term-guard`、`review-queue.mjs`；`npm run qa` |
| 修正歷史統一表 | **無** | 分散：git、`rationale-repairs.json`、舉報、質素 notes |
| 每題正確率／用時／放棄／回報率 | **無產品管線** | 見下 |

**每題指標：**

- 節級進度：`lib/progress.ts` `AttemptRecord`（登入可同步）
- 匿名節級：`practice_counts`（科／日 started vs completed）
- `practice_attempts`（`0030` schema 含 `question_id`、`is_correct`、`elapsed_ms`）——**應用寫入路徑缺少證據**
- 舉報可按 `question_id` 計數；分母（曝光）無 → 回報率公式缺少證據

### 問題

1. 機器閘入庫 + 事後撤回模型，同「可信」目標有張力（憲章已誠實披露，但覆蓋率未知）。
2. 無逐題版本／勘誤鏈，難以對外證明「邊題幾時改過」。
3. `validate-banks.mjs` 自承唔掃全庫。
4. `lib/questionStatus.ts` 命名易同內容 review status 混淆（實為練習 UX）。

### 證據／資料表

- `data/questions/_builder.ts`、`types.ts`
- Migrations：`0016`、`0020`、`0023`、`0024`、`0030`
- `CONTENT_PROVENANCE.md`、`app/transparency/`

### 影響

考生信任同創辦人「邊題要修」決策都靠不完整訊號；無法計算知識點級 mastery 所需嘅題目表現分佈。

### 建議

- Phase 2：逐題 `content_version` + 修正紀錄；舉報→處理→收起狀態機可視化；自動風險標記與教師審定嚴格分開（沿用 0024 精神）。
- 接線或明確廢棄 `practice_attempts`（唔好留幽靈 schema）。
- 擴大 validate 覆蓋；Founder 題庫健康用「撤回率／待核／舉報／機檢旗標」先跑，唔造假準確率。

---

## 5. 數據與事件追蹤

### 現狀

| 管道 | 性質 | 證據 |
|------|------|------|
| Vercel Web Analytics script | 聚合 page view | `app/layout.tsx`；後台是否有數：**缺少證據**（計劃書曾標「Web Analytics not found」） |
| Vercel Speed Insights | Web Vitals | `@vercel/speed-insights` |
| Sentry | 錯誤；PII 預設關；Replay 關 | `instrumentation*.ts`、`sentry.*.config.ts`、`lib/logScrub.ts` |
| `practice_counts` | 匿名 started／completed（科／日累計） | `lib/practiceCount.ts`（`ENABLED=true`）；只喺 `VERCEL_ENV===production` 寫入；創辦人 43a：**唔數**打開解析 |
| `session_feedback` | 完卷兩問（had_error／will_return） | migration `0022` |
| `question_reports` | 舉報 | `0020` |
| `user_progress` | 登入進度 blob | sync API |
| 離線腳本 | retention／hook-reach | `scripts/analytics/*.mts` |
| 產品事件 SDK／`trackEvent` | **無** | 全庫搜尋 `page_viewed`／`trackEvent`／`anonymous_id`：**無匹配** |

### 缺失事件（相對大更新清單）

全部未見實作（命名事件）：

`page_viewed`, `home_cta_clicked`, `subject_selected`, `practice_session_started`, `question_viewed`, `question_answered`, `explanation_viewed`, `question_skipped`, `practice_session_completed`, `practice_session_abandoned`, `user_returned`, 以及所有 `diagnostic_*`／`mastery_*`／`learning_gain_*`／`retention_*`／`mock_exam_*`。

**近似有：** `practice_counts.event = 'started'|'completed'`（命名唔同；無 session_id／anonymous_id／device／platform）。

**刻意不做（已有創辦人決定）：** `explanation_viewed`（43a）。若 Phase 1 要加，必須重新批准。

### 身分欄位

| 欄位 | 狀態 |
|------|------|
| `anonymous_id` | 缺少證據（程式無） |
| 分析用 `session_id` | 無 |
| `user_id` | 產品表有；匿名計數表無（刻意） |
| `platform`／`device_type` | first-party 缺少證據 |
| `locale` | 有於 reports／feedback |

### 敏感資料風險

| 風險 | 緩解／殘餘 |
|------|------------|
| 登入進度含表現 | service_role + RLS；仍係可識別學習軌跡 |
| 錯題 log 含選項原文（`reverseLog`） | 可上雲；未成年內容敏感 |
| Google sub／電郵 | Auth 必需；低量 PII |
| 舉報詳情 | 刻意唔入庫 |
| Sentry | `sendDefaultPii: false`；Replay 關 |
| IP | `proxy.ts` 記憶體限速，唔持久化 |

### 建議

- Phase 0：確認 Vercel Analytics 有數；匯出 `practice_counts` 近 28 日作 baseline。
- Phase 1：喺私隱／成本死鎖下，擴充**最小**可查詢漏斗（優先 session 完成率、科目選擇、回訪代理）；**唔引入** PostHog／廣告追蹤／Session Replay。
- 任何新事件必須：白名單、無答案原文、可關、更新私隱版本（如需）。
- `explanation_viewed` 維持關閉，除非創辦人改 43a。

---

## 6. 技術架構

### 現狀

- **Next.js 16 + React 19 + Tailwind 4**（`package.json`；憲章鎖定）
- **Auth：** 唯一 Supabase Auth Google（`@supabase/ssr`）；Auth.js／Better Auth 已拆除（`docs/charter.md` §3；2026-10-30）
- **Proxy：** `proxy.ts`（域名、rate limit、CSP nonce）；**無** `middleware.ts`；**未見** Supabase cookie refresh 喺 proxy
- **DB：** Supabase；題庫 anon SELECT；用戶表多 revoke + service_role 寫入
- **CI：** `.github/workflows/ci.yml`：test → qa 多閘 → eslint → build → SEO smoke
- **測試：** `npm test`（tsx）；題庫／lib／components 測試；`founder-auth`、`no-payment-assets` 等
- **SEO：** `sitemap.ts`、`robots.ts`、`structuredData.ts`、`seoPolicy.ts`（`/founder` noindex）
- **成本死鎖：** 月 US$200；禁新增付費 API／圖表套件（憲章 §1.5）

### 技術債

1. 大量 `docs/*` 仍寫 Auth.js／Better Auth（與現役矛盾）。
2. 部分程式註解過時（如 progress route、Founder SessionsBody）。
3. Founder 子頁大量 unconnected 殼。
4. `0027_better_auth_tables.DRAFT.sql` 等草稿仍在。
5. `PracticeSession.tsx` 體積大（~1364 行）——維護風險，但唔應為現代化而整頁重寫。
6. `types.ts` 仍有 `frameworkEmoji` 欄位（UI 禁 emoji；需確認渲染路徑）。

### 安全風險

| 級別 | 項目 |
|------|------|
| 已控 | Founder／Admin／Reviewer 分離；service role server-only；付費層已刪 |
| 中 | Rate limit per-instance（非分散式） |
| 待核 | 生產 `FOUNDER_GOOGLE_SUB` 是否已綁；`0029` 是否已 apply（audit fail-open） |
| 低 | 題庫 anon 可爬（設計）；push 可未登入寫入 |

舊審計 `docs/SECURITY-audit-2026-09-25.md`／`security_audit.md` 部分條目已過時——唔好當現役真相。

### 效能風險

1. Founder overview 全表 `select` `user_progress.progress_data`（`lib/founder/metrics.ts`）。
2. Layout 與頁面重複 `loadPlatformOverview()`。
3. 練習 bank lazy load 已有；題庫體積增長仍係首屏風險。

### 測試與部署風險

- CI 強；本地 `qa` 閘多。
- 生產 env／migration 齊全度：**缺少證據**。
- `practice-count` 只在 production 寫入 → preview 無法用真實計數驗證。

### 建議

- Phase 0：環境 checklist、確認 0029／Founder sub、文件清漂移。
- 優先修復與抽取，唔整棧重寫。
- Overview 改聚合查詢；`platformStatus` 唔好單靠靜態題庫報 optimal。

---

## 7. 創辦人營運能力

### 現狀

- 路由齊：`/founder` + briefing／decisions／goals／ops／students／subjects／questions／ai／quality／growth／finance／engineering／settings（`lib/founder/nav.ts`）
- 指揮中心：情報嚴重度徽章、今日決策 Top 5（`intel.slice(0,5)`）、科目星圖（sessions30d opacity）
- 錯題回報隊列：`/founder/quality/reports` ← `question_reports`
- Audit log：`founder_audit_events`（`0029`）+ settings／security
- 權限：電郵硬編碼 + Google sub；Admin ≠ Founder

### 缺失

| 能力 | 狀態 |
|------|------|
| 紅黃綠系統警報（獨立產品） | 只有 severity 徽章，無統一「系統燈號」 |
| 題庫健康分 | 無；只有覆核／報告計數 |
| 跨學生錯題分析工作台 | 無（且憲章限制） |
| 學習漏斗 | **unconnected**（`/founder/growth`） |
| 內容缺口 vs 課綱 | 只有題數排序；明示 ≠ 課綱完成度 |
| APM／錯誤率儀表 | 刻意 unconnected |
| 由數據自動產生可執行 Top 5 | 部分（intel）；缺漏斗／題庫健康輸入 |

### 建議

- Phase 3 只接「已有真實資料」：`practice_counts`、reports、withdrawn／pending、Sentry 聚合（若成本允許）、題庫靜態健康。
- 保持 unconnected 誠實標籤；禁止假圖表。
- 生產核實 `FOUNDER_GOOGLE_SUB` + `0029`。

---

## 8. 不應該做嘅事

1. **為現代化而重寫** `PracticeSession`／Auth／整個 App Router。
2. **引入 PostHog／GA／廣告像素／Session Replay**（違私隱與「無追蹤廣告」）。
3. **重建付費層／Stripe／每日額度**（憲章永久禁止）。
4. **新增 Chart.js／D3／Recharts 等付費或禁套件**（成本死鎖）。
5. **宣稱保證升 grade／掌握認證／把相關當因果**。
6. **做有圖但無行動嘅儀表板**（增長漏斗未有數據前唔好「美化」）。
7. **一次過改晒 schema + 全站 UI + 事件**（不可回滾）。
8. **SEN 診斷上雲、情緒檔、對單一 user 心理預測**（J 策略 Draft 禁止）。
9. **擴大「不考之地」搶首頁注意力**（憲章 2.1：入口只在次要選單）。
10. **用假 steps 自動切分舊 explanation**（`types.ts` 已警告）。

**看似有用、應延後：** mock exam 產品化、社交比較、教師平台（曾 drop）、多語言全面 SEO 路由重構、AI 自動批改寫作題、完整 knowledge graph UI。

---

## 9. 整改優先級

### P0 — 直接影響學習、信任、安全或核心轉化

1. 核心漏斗可完成性（流動裝置、CTA、空錯狀態、唯一下一步）
2. Baseline 與安全網（env、Founder 閘、0029、錯誤追蹤、rollback）
3. 最小可查詢學習節指標（基於現有 `practice_counts` + 必要補點；遵守 43a）
4. 題庫舉報→處理可見性（創辦人可行動）
5. 文件／註解與現役 Auth 一致（防下次 session 誤重建 Auth.js）

### P1 — 可量度成效與可持續營運

1. 題目版本／修正紀錄／審核狀態機
2. Founder OS：題庫健康 + 漏斗（接真實事件）+ 今日 Top 5 可執行化
3. 診斷前測／後測／learning gain（知識點或 topic 級）
4. 錯題重試產品誠實化（原題或文案）
5. overview 查詢效能

### P2 — 品牌、SEO、效能與長期擴展

1. 首頁價值主張強化（免費／無廣告／有效／可信）但唔堆第一屏
2. FAQ／structured data／OG／雙語 SEO route 一致性
3. 分享／教師合作／錯題通報入口
4. Core Web Vitals、bank 體積
5. 清除 DRAFT migrations／過時審計文件歸檔

---

## 附錄 A — 證據索引（摘要）

| 領域 | 關鍵路徑 |
|------|----------|
| 憲章 | `docs/charter.md` |
| 首頁 | `app/HomePageClient.tsx` |
| 練習 | `app/practice/*` |
| 結果 | `app/result/ResultPageClient.tsx` |
| 題型 | `data/questions/types.ts` |
| 匿名計數 | `lib/practiceCount.ts`、`0023`、`docs/learning-loop-measurement-plan-2026-10-08.md` §9–10 |
| Founder | `docs/founder-os.md`、`app/founder/**`、`lib/founder/**`、`0029` |
| Auth | `lib/auth/*`、`0030` |
| CI | `.github/workflows/ci.yml` |

## 附錄 B — 缺少證據清單（需創辦人／dashboard）

1. Vercel Web Analytics 是否真有數據  
2. 生產 `FOUNDER_GOOGLE_SUB` 是否已綁兩位創辦人  
3. `0029_founder_os.sql` 生產套用狀態  
4. `0024` 質素佇列真人覆核進度／列數  
5. `practice_attempts` 是否有任何生產寫入  
6. 近 28 日 `practice_counts` 匯出（baseline）  
7. 正式／Preview 環境變數 checklist（唔需要貼 secret）  
