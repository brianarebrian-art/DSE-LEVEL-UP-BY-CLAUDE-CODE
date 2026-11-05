# 題目錯誤反映系統 — Phase 1：DB／RLS／WORM

> **狀態：** Phase 1 設計＋migration 草稿已入 repo；**尚未**在 Supabase 執行。  
> **日期：** 2026-11-05（Asia/Hong_Kong）  
> **Migration 草稿：** [`supabase/migrations/0034_error_system_phase1.sql`](../../supabase/migrations/0034_error_system_phase1.sql)  
> **繼承：** 憲章 §12／§16.B／§16.E；現有 `0020_question_reports`、`0024` 質素審核、`0029` Founder OS

---

## 0. 創辦人決策（已鎖）

| # | 決策原文 | Schema／流程落實 |
|---|---|---|
| 1 | 沒有任何一個冷門科目豁免雙審 | `question_replacement_queue.dual_review_required` **恒為 true**（column check + trigger）；**不**建立科目豁免表；promote 必須 `l1_completed_at`＋`l2_completed_at`＋`review_stage='approved'` |
| 2 | 替換題需要 L1 快審 24h | L1＝`review_stage` 嘅 `human_review`；L2＝`second_review`；`l1_due_at` 預設 `now()+24h`；Founder 逾期＝`l1_due_at < now() AND l1_completed_at IS NULL` |
| 3 | 匿名可以舉報 | **擴充**現有 `question_reports`；**不**加 `reporter_id`／IP／email／自由文字；繼續經 `POST /api/report` service_role 寫入 |
| 4 | 新題唔要標「AI生成替換」 | `public_label_zh`／`public_label_en` check **禁止**含「AI生成」等字樣；預設「經自動檢查」／`Automated checks only`（滿足 §12.1／§16.B 機檢披露，又唔加「AI生成替換」） |

產品用語對照：

| 口語 | DB／0024 stage |
|---|---|
| L1 快審 | `human_review` |
| L2／雙審第二人 | `second_review` |
| 冷門單審 | **禁止**（無此狀態） |

---

## 1. 點解唔照抄上傳 prompt 原稿 schema

上傳稿 `question_error_reports(reporter_id, description)` 與現況衝突：

| Prompt 原稿 | 本 Phase 選擇 | 理由 |
|---|---|---|
| 新表 `question_error_reports` + `reporter_id uuid not null` | 擴充 `question_reports` | 匿名決策＋0020 已落地；避免雙軌 |
| `description text not null` | **不存**自由文字 | 憲章 §16.E 約束 5：學生【寫】嘅嘢不上雲；描述仍走 mailto |
| `questions.is_active` / runtime insert 新題 | 撤回用 `withdraw.mts`＋`withdrawn.json`；替換正本仍 `data/questions/*`＋sync | `questions` 係 git 鏡像（0016），唔係 CMS |
| 冷門科豁免雙審標「單審-冷門科」 | **否決** | 決策 1 |
| confidence 高可 `needs_human_review=false` | 替換通道 **必須** L1+L2 | 決策 1＋2 |
| 標「AI生成替換」 | **禁止**該字串；保留「經自動檢查」 | 決策 4＋§12.1／§16.B |
| 通用 `audit_logs` | 新表 `error_system_audit_logs`（WORM）；Founder UI 繼續可用 `founder_audit_events` | Prompt WORM 要求；唔污染營運審計語意 |
| 用戶 20/min 限流 | **沿用**現況 `report` class：**10／10 分鐘／IP** | [`lib/rateLimit.ts`](../../lib/rateLimit.ts)；改數字屬另批 |
| Storage 100MB quota | Phase 1 **只記介面**；唔建 bucket | 匿名舉報無附件上傳 |

---

## 2. 狀態機（`question_reports.status`）

舊值（兼容）：`open`｜`fixed`｜`rejected`

新值：

```
open → queued → investigating → confirmed | needs_human | rejected
                                      ↓
                         （撤回舊題 + 替換佇列雙審）
                                      ↓
                                    fixed
```

- `category`／`locale`／`question_id` 不變，對齊 [`lib/questionReport.ts`](../../lib/questionReport.ts)
- `confidence < 0.8`（後續 Agent）→ `needs_human`，唔自動進替換佇列
- 學生端暫無可追蹤個人狀態（匿名）；Founder 佇列見 [`app/founder/quality/reports`](../../app/founder/quality/reports/page.tsx)
- Founder `PATCH` [`app/api/founder/quality/reports/[id]`](../../app/api/founder/quality/reports/[id]/route.ts) 而家只允 `open|fixed|rejected`；新狀態由後續 Agent／service_role 寫入。擴 Founder UI allowlist 屬 Phase 3／6，唔喺本 Phase 改 runtime 碼

---

## 3. 新表摘要

### 3.1 `question_error_triage`

分流／調查結果：`report_id`、`assigned_bot_id`、`is_valid`、`confidence`、`evidence` jsonb、`grok_reasoning`（ops 證據，非學生自寫描述）。

### 3.2 `question_replacement_queue`

| 欄位 | 作用 |
|---|---|
| `old_question_id` / `draft_ref` / `new_question_id` | 關聯舊題與 git 草稿／新題號 |
| `review_stage` | 預設 `human_review`；經 `second_review` → `approved` |
| `l1_due_at` | 預設建立後 24h |
| `dual_review_required` | check = true；trigger 強制寫回 true |
| `public_label_*` | 學生可見文案；禁 AI生成字樣 |
| `internal_source` | ops-only：`error_replacement`｜`manual_replacement` |
| promote check | `promoted_at` 非空 ⇒ L1+L2 已完成且 `approved` |

**唔重用** `review_items`（間隔重溫表，見 v6 4B §1.6）。

### 3.3 `error_system_audit_logs`（WORM）

- 只准 INSERT
- `BEFORE UPDATE OR DELETE` → `prevent_error_system_audit_mutation()` raise  
- 記 withdraw／queue／review／promote；**唔**存學生 PII 或自由文字舉報描述

---

## 4. RLS／權限

沿用 0020／0018 模式：

| 表 | RLS | anon／authenticated | service_role |
|---|---|---|---|
| `question_reports` | ON（已有） | REVOKE ALL；零 client policy | 經 `/api/report`、Founder API |
| `question_error_triage` | ON | REVOKE ALL | GRANT ALL |
| `question_replacement_queue` | ON | REVOKE ALL | GRANT ALL |
| `error_system_audit_logs` | ON | REVOKE ALL | GRANT ALL |

**禁止：** `auth.uid() = reporter_id` 類 policy（與匿名決策相反）。

---

## 5. 限流／共用 IP／quota（設計紀錄）

| 項目 | Phase 1 立場 |
|---|---|
| `/api/report` | 已入 `proxy.ts` → `apiRouteClass='report'` → **10 req／10 min／IP**（記憶體滑窗） |
| 共用 IP（學校／宿舍） | 對齊 v6 Milestone A：**只限流、唔 ban**；Phase 1 唔改 limiter 實作 |
| Storage 100MB／egress | 無附件；驗收項留空至有上傳需求再開 bucket＋`pg_advisory_xact_lock` |
| 同題並發 | 後續 Agent 用 `pg_advisory_xact_lock(hashtext(question_id))`；Phase 1 只定介面 |

---

## 6. 雙審＋L1 24h 流程（本 Phase 鎖定）

```
AnonReport (/api/report)
  → status 擴充機
  → question_error_triage
       ├ confidence < 0.8 → needs_human
       └ valid → withdraw.mts（舊題）
              → question_replacement_queue (l1_due_at=+24h)
                   → human_review (L1)
                   → second_review (L2，全科，無豁免)
                   → approved → qbank promote／sync
                   → 學生 provenance：「經自動檢查」（非「AI生成替換」）
  → error_system_audit_logs (WORM append)
```

---

## 7. 驗收 checklist（Phase 1 文件／草稿）

- [x] 四決策寫入本文件與 `0034` 檔頭
- [x] 無 `reporter_id`／`description`／科目豁免表
- [x] `question_reports.status` 擴充值已定義
- [x] triage／replacement_queue／WORM audit SQL 草稿齊
- [x] RLS = service_role only；WORM trigger 定義
- [x] L1 24h 預設＋promote 雙審約束
- [x] 公開標籤禁「AI生成」；預設「經自動檢查」
- [x] 限流現況（10／10min）已記錄；Storage quota 標為非本 Phase
- [ ] **Supabase 執行 0034** — 等批准
- [ ] Phase 2+（file queue／bots／Agent／UI）— 等批准後再開

---

## 8. 之後 Phase（今次不開工）

| Phase | 內容 |
|---|---|
| 2 | `.grok-queue/`、`.grok-investigations/`、`.grok-bots/`、`.cursor/rules/error-system.mdc` |
| 3 | Agent A Queue Creator（Realtime／掃 pending） |
| 4 | Grok Bot 分科掃 file |
| 5 | Agent B Executor（withdraw＋生成草稿＋入 replacement_queue；**唔跳雙審**） |
| 6 | UI 文案／通知／黑名單／共用 IP 測試 |

一律遵守本 Phase 四決策。

---

**Phase 1 完成，等待批准**
