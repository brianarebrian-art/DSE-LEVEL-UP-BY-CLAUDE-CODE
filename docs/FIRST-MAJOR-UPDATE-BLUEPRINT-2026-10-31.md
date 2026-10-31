# DSE Level Up 第一次整體大更新藍圖

**依據：** `docs/FIRST-MAJOR-UPDATE-AUDIT-2026-10-31.md`  
**日期：** 2026-10-31（Asia/Hong_Kong）  
**原則：** 先審計、後規劃、再分 phase 執行；一次一個 phase；每步可驗證、可回滾、可量度  
**不可妥協：** 核心學習免費、無廣告、不賣學生資料、不以焦慮驅動、不虛構數據、不未經確認改 schema／對外發佈／引入付費服務

---

## 1. 北極星指標

```text
每週完成至少一節有效學習節，
並在後測或間隔複習中顯示知識掌握改善的獨立考生數。
```

### 有效學習節（暫定義 — 待創辦人確認）

```text
完成 10 題
+ 完成率 ≥ 80%（答完／開始；或以本節 answered／目標題數）
+ 有查看錯題解析（註：創辦人 43a 目前不數 explanation_viewed；
  過渡期可用「本節有錯題且結果頁有錯題解析入口被使用」之代理，
  或維持 43a 並將「睇解析」改為結果頁自報／本機旗標，待重新批准）
+ 後測或間隔複習顯示進步（Phase 4 先能量度；Phase 1–3 用完成＋回訪代理）
```

**過渡期北極星代理（Phase 0–1 即可算）：**

```text
每週：practice_counts.completed（科合計）中，
answered ≥ 8 的完成節數；以及 from_result 再練比例；登入用戶 7 日回訪（user_sessions／腳本）。
```

---

## 2. 三層目標

| 層級 | 目標 | 核心指標 |
|------|------|----------|
| 品牌心智 | 考生第一時間諗起 DSE Level Up | 直接流量、品牌搜尋（缺少證據時用 Vercel 直訪代理）、7 日回訪、自然分享 |
| 學習習慣 | 考生持續完成有效學習節 | 每週有效學習節、完成率（completed／started）、連續學習週數 |
| 學習成效 | 考生真正進步 | learning gain、mastery rate、retention、模擬考進步（Phase 4） |

---

## 3. Phase 順序總覽

| 順序 | Phase | 主題 | 依賴 |
|------|-------|------|------|
| 1 | **0** | 安全網與 baseline | — |
| 2 | **1** | 核心學習漏斗修復 | Phase 0 |
| 3 | **2** | 題庫品質與透明度 | Phase 0 |
| 4 | **3** | Founder OS 第一版（接真實數據） | Phase 1–2 數據 |
| 5 | **4** | 學習成效系統 | Phase 1–2 |
| 6 | **5** | 品牌、SEO 與增長基礎 | Phase 1 漏斗穩後 |

**執行規則：** 每個 phase 開始前輸出「改動清單／migration／事件／測試／驗收／回滾」，**等創辦人確認**先改 code。

---

## Phase 0：安全網與基線

### 目標

令之後任何改動可對照、可回滾、唔會喺未知環境上賭。

### 範圍

- Feature branch 紀律（已用 `cursor/*-0afe`）
- 環境變數 checklist（對照 `.env.example`；唔輸出 secret）
- 確認：`FOUNDER_GOOGLE_SUB`、`0029` apply、Vercel Analytics 有無數據、`practice_counts` 近 28 日匯出
- 記錄核心流程關鍵檔案清單（審計附錄 A）
- 最低限度：Sentry 仍可用；Founder audit 寫入唔 silent-fail 而無察覺
- 文件：標記過時 Auth.js 審計文件為 archived／加 banner（唔大改內容）

### 不做什么

- 唔改練習 UX、唔加事件、唔改 schema（除非確認 0029 未 apply 且創辦人批准套用）
- 唔引入新分析 SaaS

### 需要新增或修改嘅檔案（預估）

- `docs/baseline-2026-10-31.md`（數字與 checklist）
- 可選：`docs/SECURITY-audit-2026-09-25.md` 頂部「部分過時」橫額
- 可選：小型 `scripts/analytics/practice-counts-snapshot.mts`（唯讀）

### 資料庫 migration

- 無新 migration（除非確認套用已有 `0029`）

### 事件追蹤

- 無新事件；只讀現有 `practice_counts`／Sentry

### 測試計劃

- `npm test`、`npm run lint`、`npm run build` 通過作為基線綠燈
- 記錄通過時間與 commit SHA

### 驗收標準

- [ ] Baseline 文件寫入 repo，含「有數／缺證據」分欄
- [ ] Founder 閘與 production env 狀態有書面結論
- [ ] CI 綠；無行為變更（或僅文件）

### 回滾方案

- 還原文件 commit；無 schema 則 git revert 即可

### 預期成效指標

- 團隊有共同基線；後續 phase 可算 delta

### 風險

- 生產讀數需創辦人權限；缺則 baseline 不完整但可標「缺少證據」繼續

---

## Phase 1：核心學習漏斗修復

### 目標

60 秒內可開始針對弱項嘅有效練習；「進站→揀科→10 題→完成→解析→回訪」清晰順暢。

### 範圍

- 統一「下一步」決策（首頁／`/start`／dashboard 頂）
- 對齊「練習」tab 語義或 copy
- 修復流動裝置、空狀態、錯誤狀態、CTA 清晰度（喺現有元件上修）
- 核心事件（**需創辦人批准私隱影響**）：優先擴充現有匿名模型或最小 first-party 事件表  
  建議最小集（遵守 43a 暫唔做 explanation_viewed）：
  - 沿用／對齊：`practice_session` started／completed（可保留表欄命名）
  - 新增（待批）：`subject_selected` 或科目頁 CTA；`home_cta_clicked`（只計類型，唔計 PII）
  - `user_returned` 可用 `user_sessions`／本週再次 started 代理，唔強求新事件名

### 不做什么

- 唔做前測／後測（屬 Phase 4）
- 唔重寫 `PracticeSession.tsx`
- 唔加廣告追蹤、唔開 Replay
- 唔強制登入先練習

### 需要新增或修改嘅檔案（預估）

- `lib/quickStart.ts`、`app/start/StartRedirect.tsx`
- `components/Navbar.tsx`／`BottomNav.tsx` 或 dictionary copy
- `app/HomePageClient.tsx`、`DashboardPageClient.tsx`（下一步契約）
- `app/practice/PracticeShell.tsx`／空錯狀態 copy
- 可選：`lib/analytics/*`（白名單）、`app/api/...`、migration
- 私隱頁（若新收集）

### 資料庫 migration

- 若擴事件：新表或擴 `practice_counts`（**必須先批**）
- 否則只改 UX、零 migration

### 事件追蹤

見範圍；每個事件：無 user_id（匿名路徑）、無題目答案、可關旗標

### 測試計劃

- unit：下一步決策、事件 parse
- 手動／E2E 級：手機寬度走完一節
- `npm run qa` 相關閘（copy／i18n／nav）

### 驗收標準

- [ ] 新用戶由首頁 ≤2 次點擊進入第一題（核心科）
- [ ] 無 subject ／ bank 失敗／空池 有明確 CTA
- [ ] 完成率可每週由數據計算（至少 started vs completed）
- [ ] typecheck／lint／build／相關 test 通過

### 回滾方案

- Feature flag 關新事件；UX 用 git revert
- Migration：down SQL 預先寫好

### 預期成效指標

- completed／started ↑；from_result 再練比例穩定或 ↑；首題到達時間 ↓

### 風險

- 私隱版本提升觸發再同意；入口改動影響 SEO／習慣用戶

---

## Phase 2：題庫品質與透明度

### 目標

每題可追蹤版本／狀態／收起原因／修正；自動檢查與教師審定嚴格分開；創辦人看得見題庫健康。

### 範圍

- 題目 `content_version`（或等價）與修正紀錄模型
- 舉報→處理→fixed／rejected／withdrawn 工作流（強化現有 `question_reports`）
- 自動風險標記（沿用 quality flags）與人工覆核狀態（0024）
- Founder 可見：撤回率、待核、開放舉報、機檢旗標數
- 學生端繼續誠實披露（Provenance）

### 不做什么

- 唔宣稱全庫教師審定
- 唔為晒全庫人手重審（唔可行）
- 唔接每題準確率除非有合法數據源

### 需要新增或修改嘅檔案（預估）

- `data/questions/types.ts`、builder、sync 腳本
- `supabase/migrations/00xx_question_revisions.sql`（待設計）
- `app/founder/quality/*`、`lib/founder/metrics.ts`
- `QuestionProvenance.tsx`、transparency copy
- `scripts/qbank/*`

### 資料庫 migration

- 修正／版本表或 jsonb 歷史；與 0024 對齊；**先批後 apply**

### 事件追蹤

- 營運向：report_resolved（可寫 founder_audit）；非學生漏斗

### 測試計劃

- qbank validate；withdraw／pending 過濾；founder quality API 授權測試

### 驗收標準

- [ ] 任一撤回題可查原因與日期
- [ ] 學生 UI 唔把機檢寫成教師審定
- [ ] Founder 可列出 Top 開放舉報
- [ ] migration 可 up／down

### 回滾方案

- 停用新欄讀寫；舊 JSON 撤回機制仍可用

### 預期成效指標

- 開放舉報平均處理時間 ↓；重複類缺陷撤回批次可追溯

### 風險

- sync 鏡像與 repo 正本衝突；migration 影響 sync-questions

---

## Phase 3：Founder OS 第一版（接線）

### 目標

創辦人每日知：今日有冇事、邊科有問題、邊題要修、邊度投資；輸出可執行 Top 5。

### 範圍

- 紅黃綠（或沿用 alert／warn／ok）系統燈號：題庫／漏斗／錯誤／舉報
- 題庫健康（Phase 2 輸出）
- 錯題工作台（reports）
- 科目熱力／星圖改為接 `practice_counts`
- 學習漏斗（Phase 1 事件）— 有數先取消 unconnected
- 內容缺口：題數 + 待核／撤回（誠實標籤）
- 今日 Top 5：由規則引擎由真實指標生成
- audit log 已有則強化危險操作確認
- 權限維持 server-side

### 不做什么

- 唔造假數據填圖表
- 唔做跨學生答題內容瀏覽
- 唔加 Chart 禁套件（用現有 CSS／簡單 SVG）
- 唔開放 `/founder` 公開

### 需要新增或修改嘅檔案（預估）

- `lib/founder/metrics.ts`、`CommandCenter.tsx`、`app/founder/growth/*`
- `lib/founder/actions.ts`（確認對話）
- 可選聚合 SQL／RPC（取代全表掃 progress_data）

### 資料庫 migration

- 可選：物化／RPC 聚合；或無

### 事件追蹤

- 讀 Phase 1–2；寫 `founder_audit_events`

### 測試計劃

- `founder-auth.test.mts`；未授權 403；指標 unconnected vs ok 單元測試

### 驗收標準

- [ ] 非創辦人無法存取（已有，回歸）
- [ ] Top 5 每條有「點解」+「去邊頁處理」
- [ ] growth 漏斗唔再係空殼（或仍 unconnected 但有明確 blocked-by）
- [ ] overview 唔再無上限拉全表 JSON（或有硬上限＋警告）

### 回滾方案

- 還原 metrics 模組；UI 退回 unconnected

### 預期成效指標

- 創辦人每週異步同步前可 5 分鐘內決定 Top 行動

### 風險

- 0029 未 apply → 先 Phase 0 解決；誤讀小樣本百分比

---

## Phase 4：學習成效系統

### 目標

知識點／課題級：診斷→針對練→解析→錯題重做→後測→間隔複習→掌握估計（非虛假認證）。

### 範圍

- 可選 diagnostic 10 題（topic 覆蓋）
- 後測與 learning gain = 後測正確率 − 前測正確率
- 錯題按 questionId 重試（產品誠實）
- mastery／retention 指標（本機＋可選登入同步）
- 事件（待批）：`diagnostic_*`、`mastery_check_*`、`learning_gain_calculated`、`question_retried`、`retention_check_completed` 等
- 進度報告頁（學生自見；唔公開羞辱比較）

### 不做什么

- 唔發「掌握證書」若無外部效度
- 唔保證升 grade
- 唔強制人人走完整 loop（可選）

### 需要新增或修改嘅檔案（預估）

- `app/practice` modes、`lib/mastery.ts` 擴充、新 `lib/learningGain.ts`
- result／dashboard 入口
- migration：學習成效摘要表（匿名聚合 vs 登入個人 — 待設計）

### 資料庫 migration

- 視私隱模型；個人成效優先本機，雲端僅登入同意後

### 事件追蹤

見範圍；嚴格白名單

### 測試計劃

- learning gain 計算單元測試；模式路由；無登入可完成 diagnostic

### 驗收標準

- [ ] 可對一組 fixture 算出 learning gain
- [ ] 文案唔把估算當認證
- [ ] 北極星「改善」可變現（至少登入或本機 cohort 腳本）

### 回滾方案

- flag 關 diagnostic／post-test 入口

### 預期成效指標

- 有後測嘅節數中 learning gain > 0 比例；retention check 答對率

### 風險

- 題目不足導致前後測同題污染；樣本小唔可對外宣傳

---

## Phase 5：品牌、SEO 與增長基礎

### 目標

心智：免費、無廣告、有效、可信；可發現、可分享、可合作。

### 範圍

- 首頁價值主張重寫（遵守 hero budget／brand-first；無 emoji）
- 關於／創辦理念／透明度頁對齊
- FAQ、structured data、sitemap、robots、OG
- 中英雙語與 SEO-friendly route 一致性審計修復
- 分享、推薦、教師合作、錯題通報入口（非 dark pattern）

### 不做什么

- 唔靠焦慮文案
- 唔買量到付唔起（成本死鎖）
- 唔喺第一屏堆 stats／schedule

### 需要新增或修改嘅檔案（預估）

- `HomePageClient.tsx`、`about`、`trust`、`transparency`、`lib/faq.ts`、`structuredData.ts`、`sitemap.ts`

### 資料庫 migration

- 無

### 事件追蹤

- CTA 類型計數（若 Phase 1 已有）

### 測試計劃

- SEO smoke、copy-guard、claims-guard、i18n-guard

### 驗收標準

- [ ] claims-guard 通過
- [ ] 首屏 brand test 通過（去 nav 仍識品牌）
- [ ] 無憲章違規聲稱

### 回滾方案

- 還原行銷 copy commit

### 預期成效指標

- 直訪／品牌搜尋代理 ↑；約頁／透明度頁瀏覽 ↑

### 風險

- SEO 大改路由導致舊連結失效（要用 redirect）

---

## 4. 建議立即確認嘅創辦人決定

1. **有效學習節**暫定義是否接受？`explanation_viewed` 繼續跟 43a 唔數？
2. Phase 1 新事件：只擴 UX、定係批准最小新匿名事件？
3. Phase 0 需要你提供：Vercel Analytics 截圖／有無數據、`practice_counts` 匯出、`FOUNDER_GOOGLE_SUB` 已綁確認（是／否）、`0029` 已 apply（是／否）
4. Phase 順序是否按 0→1→2→3→4→5？定係 2 與 1 對調？

---

## 5. 下一句指令（建議）

```text
確認 Phase 0，開始建立安全網與 baseline。
```
