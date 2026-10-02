# Founder Queue

最後更新：2026-10-02 · Iteration #1（T00）

每項按 prompt §10 格式。「創辦人回覆」一欄只由 Brian 或 Yuna 填寫，loop 永遠留空。

---

### Q-P1 「機器永遠唔自動發佈」與憲章 §12 不符
- 類型：charter 同 prompt 衝突
- 背景：prompt §3 第 99 行寫「機器永遠唔自動發佈……drafts → `_gate.mjs` → review-drafts → 人手逐題覆核 → `decisions.json` → promote」。憲章 §12（2026-09-26 起）規定預設通道為機器關卡自動上架：`scripts/qbank/auto-promote.mts`，創辦人以 `withdraw.mts` 撤回，並須保留「只經自動檢查」披露。
- 選項：A 修改 prompt §3，改為描述 §12 現行流程 / B 修改憲章，回復人手逐題覆核 / C 維持現狀（loop 按 §1.2 第 5 條以憲章為準）
- Loop 建議：A。憲章是現行規則；無論選哪項，loop 都不會改 `*-reviewed.ts`，最多只產出 drafts 同報告。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P2 反思鎖 30 秒與憲章 §7.2 不符
- 類型：charter 同 prompt 衝突
- 背景：prompt 第 95 行寫「反思鎖 30 秒（創辦人指令，唔好改時長）」；T05 亦以反思鎖為前提。憲章 §7.2 記錄反思鎖已於 2026-09-09 剷除，屬實驗，2026-11-09 覆檢；錯因自診為實驗保留項。
- 選項：A 修改 prompt，刪去反思鎖描述，T05 改為「確認不影響 §7.2 實驗」/ B 恢復反思鎖（須修改憲章 §7.2）/ C 維持現狀（loop 以憲章為準）
- Loop 建議：A。T05 執行前 loop 會先確認改動不影響 2026-11-09 覆檢。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P3 「user_id + 課題 + 答對率一律拒絕」與憲章 §16.E 不符
- 類型：charter 同 prompt 衝突
- 背景：prompt 第 82 行寫「任何 schema 同時包含 `user_id` + 課題 + 答對率 → 一律拒絕」。憲章 §16.E（2026-09-04 修訂，2026-09-09 約束 5 雙簽）准許雲端同步 `dse_topic_stats`，即登入用戶的每課題答對統計，附五條約束。
- 選項：A 修改 prompt，改為引用 §16.E 及其約束 / B 收緊憲章，停止同步 `dse_topic_stats` / C 維持現狀（loop 以憲章為準）
- Loop 建議：A。新 schema 仍逐項按 §16.E 約束審視，不會因為「已准許」而放寬。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P4 雲端 key 名單位置
- 類型：prompt 錯誤
- 背景：prompt 以 `lib/sync.ts` 為雲端同步 key 的定義位置（第 82 行）。實際名單定義於 `lib/cloudKeys.ts`，`lib/sync.ts` 只是使用。
- 選項：A 修改 prompt，改指 `lib/cloudKeys.ts` / B 維持現狀
- Loop 建議：A。Loop 已按 repo 為準繼續工作。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P5 HSTS `preload`
- 類型：code 同約束衝突
- 背景：`next.config.ts:34` 為 `max-age=63072000; includeSubDomains; preload`，production 回應標頭相同。prompt §8 拒絕 `preload`（第 288 行：`vercel.app` 不是我們擁有的域名），T31 亦寫明不加 `preload`。
- 選項：A 刪去 `preload`，保留其餘部分 / B 保留 `preload`（須說明理由並修改 prompt §8）/ C 維持現狀
- Loop 建議：A。`preload` 只對可提交至 hstspreload.org 的自有頂層域名有意義；刪去不影響現有保護。創辦人批准後由 T31 處理。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P6 `middleware.ts` 的描述
- 類型：prompt 錯誤
- 背景：prompt 第 74 行寫「新建 `middleware.ts` 會被靜默忽略」。Next 16 下 `middleware.ts` 與 `proxy.ts` 並存時 build 會報錯，並非靜默忽略。repo 現時只有 `proxy.ts`。`README.md:23` 亦有同一句描述。
- 選項：A 修改 prompt 及 README 為「兩者並存會令 build 失敗，只用 `proxy.ts`」/ B 維持現狀
- Loop 建議：A。結論（只用 `proxy.ts`）不變，只是描述要準確。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P7 「全部由 2026 DSE 考生逐題覆核」無紀錄支持
- 類型：code 同 charter 衝突（事實前提）
- 背景：審計更新二（`source-audit.md` §16.4）及 T01 以「覆核者係 DSE 考生、有人手逐題覆核」為前提。repo 內具名審批紀錄已於 2026-09-25 刪除，`data/provenance.ts` 的 `REVIEWED_COUNT` 為 0；憲章 §12.1 約束 1 規定照實披露「未有真人逐題審批」。
- 選項：A T01 改為按現行 §12 披露重寫措辭，不寫「逐題覆核」/ B 創辦人提供可核實的覆核紀錄，loop 再按紀錄寫措辭 / C 暫停 T01
- Loop 建議：A。公開文案不能寫 repo 無法證明的事；T01 為 SIGN，新舊對照會再交創辦人批核。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P8 `decisions.json` 路徑
- 類型：prompt 錯誤
- 背景：prompt 多處以單一 `decisions.json` 描述（第 99、224 行）。repo 實際為每批次一個檔：`scripts/qbank/drafts/*.decisions.json`。
- 選項：A 修改 prompt 為 `scripts/qbank/drafts/*.decisions.json` / B 維持現狀
- Loop 建議：A。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P9 T28 報告資料庫，以及 README 的 Next 版本
- 類型：方向決定 + prompt 錯誤
- 背景：(1) T28 要求把報告存入資料庫；改進循環 2 R2-6 曾按當時指示決定報告只經電郵、不存資料庫（`docs/ux-loop-progress.md` R2-6）。(2) `README.md:13` 及憲章 §3 均寫 Next.js 16.2.9，`package.json` 為 `^16.3.3`。憲章文末記錄 2026-09-26「§3 Next.js 版本號 Yuna 不同意改，維持原文」。
- 選項：(1) A 按 T28 新建資料表（migration 由創辦人 apply）/ B 維持 R2-6 決定，T28 改為 STALE / C 暫緩 T28；(2) A 更新 README 版本號（憲章不動）/ B 維持現狀
- Loop 建議：(1) 由創辦人決定，loop 不偏向任何一方；(2) B。憲章版本號已有創辦人決定，loop 不改 README 亦不改憲章；只在此記錄差異，如創辦人想 README 跟 `package.json` 再另行指示。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）

### Q-P10 `audit-loop` 的起點包括未上 `main` 的 commit
- 類型：方向決定
- 背景：`audit-loop` 由 `feat/ux-loop` 的 `29e54f8` 開出，包括改進循環 2（R2-1 至 R2-11）全部 commit；`origin/main` 仍為 `8258ab0`。日後 merge `audit-loop` 會連同這些 commit 一起帶入。
- 選項：A 先 merge `feat/ux-loop` 入 `main`，`audit-loop` 之後再 merge / B 兩條 branch 一併審閱後 merge / C 由 `origin/main` 重新開 `audit-loop`（R2 修正會缺席，部分快照結論要重做）
- Loop 建議：A。Loop 不會 push 或 merge，所有 branch 操作由創辦人執行。
- 創辦人回覆：＿＿＿＿（Brian / Yuna 填）
