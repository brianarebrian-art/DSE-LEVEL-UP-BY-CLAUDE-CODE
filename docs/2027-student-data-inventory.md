# 學生資料路徑盤點

**日次 2｜2026-08-25（週二）｜第 1 週：安全基線**

> **今日唯一主指令（安全日曆 日次 2）：**
> 盤點所有會接觸、儲存、顯示或匯出學生資料的路徑；只記功能、資料類別、所在路徑與風險，
> **不查看或複製任何實際資料。**

**執行方式：** 全部由**原始碼**推導。未連線生產 Supabase、未查詢任何資料列、
未讀取任何學生內容。下面每一項都可以由所列路徑自行覆核。

---

## 🔴 P0 發現：學生揀嘅答案原文會上傳到 Supabase

### 事實鏈（逐段可覆核）

```
lib/sessionResume.ts:25   interface SavedAnswer { selectedZh: string; isCorrect: boolean }
lib/sessionResume.ts:36   ActiveSession.answers: (SavedAnswer | null)[]
lib/sync.ts:68            snapshotLocal() → dse_active_session: readJSON(ACTIVE_SESSION_KEY)
app/api/progress/route.ts:64  upsert({ user_id: userId, progress_data: body.progress })
                              → Supabase 表 user_progress，欄位 progress_data
```

**即係：一個已登入嘅學生，佢喺未完成嗰節練習之中揀過嘅每個選項嘅【文字內容】，
連同啱／錯，會以 `user_id` 為鍵儲存喺 Supabase。**

### 撞邊條紅線

| 文件 | 原文 |
|---|---|
| 安全重規劃 §二 | 「建立、匯出、人工閱讀或持續追蹤某學生的錯題 DNA、準確率曲線、情緒日誌、**作答內容**或成績故事」 |
| 安全重規劃 §三 | 「不收真名、學校、聯絡方式、成績、**答案原文**、錯題、情緒資料、相片或錄音」 |
| 安全協議 §二 | 「新資料欄位、事件、cookie、SDK、表單、同步、分析、日誌、**匯出或人工閱讀個人作答**」 |

**呢個唔係定義邊界問題。`selectedZh` 就係字面意義嘅「答案原文」。**

### ⚠️ 我要更正自己尋日講錯嘅嘢

日次 1 台帳同我當時嘅口頭報告寫住「同步名單只有三個 key」。**唔啱。**
我當時讀咗 `lib/sync.ts:12` 嘅 `KEYS` 常數就下咗結論，但真正嘅上傳 payload
係 `snapshotLocal()`（同檔 64–72 行），**佢除咗嗰三個 key，仲夾埋
`dse_active_session`**。所以係四個內容鍵，唔係三個。

呢個錯直接影響咗尋日「錯題 DNA 三項已合規」嗰段判斷 —— 「匯出」嗰項，
喺 active session 呢條路徑上，**係唔合規**。特此更正。

### 減輕因素（如實列出，唔係辯護）

- 只喺學生**用 Google 登入**做跨裝置同步先會發生；唔登入完全唔會上傳
- `/api/progress` 係 server-only（Auth.js 閘），瀏覽器攞唔到 Supabase key
- 只包含**未完成**嗰一節；`MAX_AGE_MS` = 7 日
- 原意正當：v3.0 F1「另一部機繼續進度」
- 原始碼註釋顯示做過認真取捨（否決過 client-side Supabase Realtime、
  否決過會令進度永久救唔返嘅 AES 方案）

### 🔑 有一條可能好乾淨嘅修法（**今日不執行**）

`lib/sessionResume.ts:16-17` 自己嘅註釋寫住：

> 「Why restoring only needs the question ID order: grading is anchored to option
> TEXT (`correctZh`), never an index, and the drill is **forward-only**」

如果「繼續進度」真係只需要 `questionIds` + `current` + `elapsed`，
咁 **`answers[].selectedZh` 可以喺【上傳前】剝走，本機照樣保留**。
咁樣跨裝置續做功能唔會壞，而答案原文永遠唔離開部機。

⚠️ 未驗證：`answers` 有冇被還原後嘅計分用到。**要日次 3 之後先做，今日只記錄。**

### 測試缺口

冇任何測試或閘覆蓋「上傳 payload 唔可以含答案原文」。
`grep` 全部 `__tests__` 目錄，零命中 `selectedZh` / `ActiveSession`。
→ 建議日後加一條**上傳 payload 白名單測試**（同 responsive-guard 一樣，攔成因）。

---

## 📊 回答尋日嘅未決問題：`dse_topic_stats` 嘅資料粒度

**問題：** 係「聚合匿名統計」定「個人逐課題正確率曲線」？

**答案：個人逐課題累計計數，唔係聚合匿名。**

```
lib/topicStats.ts:17-27
  interface Row {
    subjectId: string
    topic: string      // topic id
    label: string
    labelEn?: string
    total: number      // 呢個學生喺呢個課題做過幾多題
    wrong: number      // 錯咗幾多題
  }
  type Store = Record<string, Row>   // key = `${subjectId}::${topicId}`
```

按你嘅 **L2 定義（平台可讀 → 禁止）**，呢個**係違規**：
資料以 `user_id` 為鍵存喺 `user_progress.progress_data`，service_role 讀得到。

**但有一個分別值得你知，可能影響你點揀方案：**

| | 文件禁嘅「準確率**曲線**」 | `dse_topic_stats` 實況 |
|---|---|---|
| 時間序列 | 有，可以睇到變化軌跡 | ❌ **冇** —— 淨係兩個累計數字 |
| 時間戳 | 有 | ❌ 冇 |
| 逐題紀錄 | 有 | ❌ 冇 |
| 可推斷個人強弱 | 有 | ✅ **有** |

即係話：佢係一張**靜態計分板**，唔係一條曲線。但佢一樣講得出
「呢個學生喺二次方程做過 40 題錯 25 題」。**係咪可接受，係你嘅判斷，我唔幫佢辯護。**

---

## 📋 完整盤點：43 個 localStorage 鍵

### A. 會離開部機（4 個內容鍵 + 3 個記帳標記）

| 鍵 | 資料類別 | 風險 |
|---|---|---|
| `dse_active_session` | **答案原文** + 題目 id + 進度 | 🔴 **P0，見上** |
| `dse_topic_stats` | 個人逐課題 做過／錯咗 計數 | 🔴 待你裁決 |
| `dse_progress` | 每節練習 分數／總數／時戳／逐課題結果 | 🟠 個人成績紀錄 |
| `dse_free_attempts_total` | 累計練習次數 | 🟢 單一數字 |
| `dse_updated_at` / `dse_synced_at` / `dse_sync_owner` | 同步記帳 | 🟢 非學生內容 |

### B. 永遠唔離開部機（36 個）

| 類別 | 鍵 | 備註 |
|---|---|---|
| **情緒／心理** | `dse_emotion_log`、`dse_capsule`、`dse_good_today`、`dse_own_cheers`、`dse_calm_lock`、`dse_not_tonight_until` | ✅ 全部本機。憲章 §7 SEN 支援 |
| **錯因自診** | `dse_reverse_log`、`dse_concept_net`、`dse_review_done`、`dse_daily_spectrum` | ✅ 全部本機。60 秒逆向鎖死引擎 |
| **無障礙偏好** | `dse_easy_font`、`dse_font_size`、`dse_line_height`、`dse_letter_spacing`、`dse_reading_ruler`、`dse_hide_timer`、`dse_answer_sound`、`dse-a11y`、`dse_relax_sensory_pref` | ✅ 純偏好 |
| **學習內容** | `dse_writing_draft`、`dse_logic_log`、`dse-bookmarks`／`dse_bookmarks`、`dse_result` | ✅ 本機。⚠️ `dse_writing_draft` = 學生作文原文，**必須永遠唔准入同步名單** |
| **介面狀態** | `dse-theme`、`dse_locale`、`dse_question_timer`、`dse_focus_today`、`dse_gentle_dismissed`、`dse_nudged_at`、`dse_today_nudge`、`dse_quote_seen`、`dse_seen_*`、`dse_explain_always_full`、`dse-ntm`、`dse-levelup-progress` | 🟢 |

### C. 伺服器路由（7 條，其中 3 條掂 DB）

| 路由 | 掂 DB | 用途 |
|---|---|---|
| `app/api/progress/route.ts` | ⚠️ `user_progress` | 跨裝置同步（**P0 來源**） |
| `app/api/sync/settings/route.ts` | ⚠️ `user_settings` | 無障礙偏好跨機 |
| `app/api/account/delete/route.ts` | ⚠️ 多表 | PDPO 刪除（註釋顯示曾經漏咗 `user_settings`，已修） |
| `app/api/auth/[...nextauth]/route.ts` | — | 登入 |
| `app/api/admin/route.ts` | — | 審題後台 |
| `app/api/lockout/route.ts` | — | 反思鎖 |
| `app/api/result/verify/route.ts` | — | 紙筆戰士對答案 |

---

## 安全證據包

```
# 安全日報｜2026-08-25｜日次 2

## 今日唯一主指令
盤點學生資料路徑；只記功能／類別／路徑／風險，不查看實際資料。

## 範圍
- 目標：完整盤點 + 回答 dse_topic_stats 粒度問題
- 非目標：修任何嘢、改同步、刪功能
- 資料邊界：全部由原始碼推導。未連生產 DB、未查任何資料列
- 外部動作：無

## 證據
- 改動：只新增本文件（0 行程式碼）
- 43 個 localStorage 鍵、7 條 API 路由逐一列出，附檔案行號

## 風險與回滾
- 🔴 P0：答案原文經 dse_active_session 上雲（未修，今日不修）
- 🔴 dse_topic_stats 個人粒度已確認，待裁決
- 更正：尚未修正嘅日次 1 錯誤陳述已喺本文件標明
- 回滾：git checkout -- docs/

## 停止與真人決定
- 見 docs/stop-memos/2026-08-24-conflicts.md（四項）
- 新增第五項：答案原文上雲 → 建議升為 P0

## 明天
- 日次 3（2026-08-26）：盤點站內所有提及情緒、支援、倒數、成績、診斷、跟進或
  聯絡的文案；將有誤導、責備或假承諾的項目列為 P0/P1。
```
