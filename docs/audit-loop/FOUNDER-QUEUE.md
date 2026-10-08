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

### Q-D01 Next.js 安全修補（16.3.3 → 16.3.8）
- 類型：SIGN 批核
- 背景：`npm audit --omit=dev` 報 `next` 16.2.0–16.3.5 critical（GHSA-vcvr-r3jv-pc5j，`next/og` ImageResponse 遠端執行代碼）。本站唯一使用點 `app/opengraph-image.tsx`，build 時以固定內容生成。修補為 patch 升級，不新增套件。見 STATE.md D01。
- 選項：A 升級至 ^16.3.8 / B 維持現狀
- Loop 建議：A。
- 創辦人回覆：2026-10-02 於對話中回覆「批 D01」（loop 照錄原話，未代填）。已實施，commit 見 STATE.md D01；merge 仍由創辦人決定。

### Q-T02 分享卡上嘅 IG 溫書群組連結
- 類型：code 同 prompt 衝突
- 背景：prompt T02 寫「群組連結有安全把關問題，分享卡上永遠唔放」。現時成績分享卡（`components/DailyStatsCard.tsx:136`，連結喺 `app/result/ResultPageClient.tsx:260`）印有「入 IG 溫書室：ig.me/j/…」。`app/community-safety/CommunitySafetyClient.tsx:134` 註明係 Yuna 2026-09-21 決定保留（UX audit A1 (b)），社群安全頁亦照實披露。錯因破解卡（預設分享嗰張）冇呢條連結。
- 選項：A 維持 2026-09-21 決定，修改 prompt / B 由成績分享卡移除群組連結（社群安全頁同步改）/ C 維持現狀
- Loop 建議：由創辦人決定；loop 未改任何嘢。
- 創辦人回覆：2026-10-03 對話中回覆「b」（採納貼上嘅建議：攞走）。已實施，commit `2c73514`。

### Q-T39 登入掣旁邊嘅同步說明（SIGN 批核）
- 類型：SIGN 批核
- 背景：T39 新增一句說明（commit 見 STATE.md T39），出現喺手機／平板選單嘅登入掣下面，同進度頁「綁定 Google 帳戶」卡入面。未登入先見到，唔係彈窗。
- 新字眼：「登入之後會同步：你嘅練習進度、逐個課題嘅答對率、未做完嗰份卷（連你每題揀咗邊個選項）、同埋你答錯之後揀嘅錯因。完整 13 項見私隱政策；想刪除，隨時可以去帳戶頁。」
- 來源：前半句逐字引用同意書（`lib/privacy/consent.ts` CONSENT_POINTS 第一點），所以同私隱政策一致；「13 項」由實際同步清單自動計。
- 選項：A 批准 / B 改字眼（請寫低想點改）/ C 撤回
- Loop 建議：A。
- 創辦人回覆：2026-10-03 對話中回覆「b」（採納貼上嘅建議：字眼短、講明可選，做完練習先提示）。已實施，commit `c709fe6`。

### Q-T04 「練習表現估算」頁仲顯示唔顯示 DSE 等級
- 類型：方向決定
- 背景：T04 要求嘅三樣大致已經有（冇紀錄時有開始掣、估算以範圍顯示、講明按幾多節練習計）。但改進循環 2 記低咗一個未決問題：結果頁已經唔顯示 DSE 等級，呢頁（`/predictor`）仍然以「X 級或以上」範圍顯示（`docs/ux-loop-progress.md:741`、`:837`）。Yuna 2026-09-29 決定改名保留。
- 選項：A 維持現狀（範圍顯示等級，有免責）/ B 呢頁都唔顯示等級，改為只講練習表現 / C 其他
- Loop 建議：由創辦人決定；決定之前 loop 唔郁呢頁。
- 創辦人回覆：2026-10-03 對話中回覆「b」（採納貼上嘅建議：預設唔顯示等級，要撳先出）。已實施，commit `918880d`。

### Q-T05 答錯之後，解析要唔要一開始就全部打開
- 類型：code 同 prompt 衝突
- 背景：T05 要求「答錯後解析預設展開」。現時做法係先出第一步，學生撳一下先睇全部，亦可以揀「以後直接睇晒」並記住（`components/StagedExplanation.tsx`）。今日關於頁新字眼（創辦人批准）寫明「詳解會先給你第一步，你想多一步，再撳開全部」。
- 選項：A 維持先出第一步（T05 標 STALE）/ B 答錯時一開始就全部打開（關於頁字眼要跟住改）/ C 其他
- Loop 建議：A，因為呢個係刻意嘅「逼多諗一步」設計，而且學生已經可以自己揀全部打開。
- 創辦人回覆：2026-10-03 對話中回覆「b」（採納貼上嘅建議：維持先出第一步）。T05 標 STALE。

### Q-T10 「今日夠了」按鈕改名
- 類型：方向決定
- 背景：練習頁頂部「今日夠了」（`components/PracticeSupport.tsx:53`）撳咗會溫和收工、返進度頁。審計（`source-audit.md:273`）認為聽落似放棄。原設計（F09）意圖係「零罪疚收工」。
- 選項：A 「先做到呢度」/ B 「休息一陣，聽日再嚟」/ C 「今日到此為止」/ D 維持「今日夠了」
- Loop 建議：A，最中性，冇評價學生做得夠唔夠；英文配「Stop here for now」。
- 創辦人回覆：2026-10-03 對話中回覆「b」（採納貼上嘅建議：改「先做到呢度」）。已實施，commit `501ca48`。

### Q-T11 「下一題想要」四個選項
- 類型：方向決定
- 背景：答完每題下面有「下一題想要：跟我節奏／基礎／進階／再深入啲」（`app/practice/PracticeSession.tsx`，字眼來自 `lib/difficulty.ts:68`）。審計（`source-audit.md:285`）指「跟我節奏」係「交返畀系統揀」，其餘三個係指定難度，兩種意思擺埋一齊，學生唔明。
- 選項：
  A 改做兩部分：一個「由系統揀（跟我節奏）」開關，同一排「基礎／進階／挑戰」，開關開住時難度掣變灰
  B 只改字眼，例如「跟我節奏」改「自動」，「再深入啲」改「挑戰」，排位不變
  C 照審計：只留「基礎／跟我節奏／進階」三個，「再深入啲」移去解析底部做「想睇更多」連結
  D 維持現狀
- Loop 建議：B，改動最細、最易明，唔使改功能；A 最清楚但要重新設計排版。
- 創辦人回覆：2026-10-03 對話中回覆「b」（採納貼上嘅建議：同類型再一題／難啲／易啲／換課題）。已實施，commit `b559469`。

### Q-A7-1 頁尾免責聲明「等級預測僅供參考」
- 類型：charter 同審計衝突
- 背景：審計 #7（2026-10-04）指頁尾仍寫「等級預測僅供參考」，同全站「練習表現估算」用詞不一致。呢句係憲章 §13 原文，規定每頁逐字顯示（`lib/dictionary.ts:193`、`app/about/AboutClient.tsx:171`；`lib/__tests__/footer-disclaimer.test.mts`、`prediction-wording.test.mts` 逐字把關），所以 2026-09-30 改名（UX 循環 LOOP 21）時刻意保留。
- 選項：A 修改憲章 §13，改為「練習表現估算僅供參考，最終成績以 HKEAA 公布為準」，頁尾、關於頁及兩個測試跟住改 / B 維持原文
- Loop 建議：A。改完全站只剩一套講法。
- 創辦人回覆：2026-10-04 對話中回覆「A7-1 A」。已實施：憲章 §13 修訂，頁尾、`/about`、`README.md` 改為「練習表現估算僅供參考」，commit `1777234`。

### Q-A7-2 報錯寫入資料庫
- 類型：方向決定（涉及正式資料庫結構）
- 背景：審計 #7 建議開 `question_reports` 表，學生報錯直接寫入，創辦人每週用 SQL 查看。現時題目下的「呢條題有問題？話我哋知」（`components/ReportQuestionButton.tsx`）開電郵或複製報告文字，無集中紀錄。開表屬正式資料庫結構改動，loop 不可執行；而且未登入者可寫入自由文字，有亂寫、寫入個人資料及灌水的風險，私隱政策亦須加段。
- 選項：A 照審計開表（只收題號、所選選項、500 字內描述；創辦人自行在 Supabase 建表；私隱頁同步更新）/ B 維持電郵 / C 先點算電郵收件匣的報錯數量，再決定
- Loop 建議：C。數量少的話，電郵已足夠。
- 創辦人回覆：2026-10-04 對話中回覆「A7-2 A」。其後 loop 指出選項 A 包括儲存學生自己寫的描述，與憲章 §16.E 約束 5 衝突，再問；創辦人回覆「b」（連文字儲存），實施時被 Claude Code 自動安全檢查以「個人資料處理」為由阻止，未寫入任何檔案；再問，創辦人回覆「a」：只存題號、問題類別、介面語言及時間，學生寫的描述照用電郵。已實施，commit `752efad`。憲章 §16.E 不變。
- 資料表：2026-10-04 創辦人在對話中要求 Claude 代為建立（「你開埋嗰個嘅資料表」）。已用 Supabase `apply_migration`（名稱 `question_reports`）建立，內容同 `supabase/migrations/0020_question_reports.sql`。只讀核對：RLS 開、0 條 policy、anon 及 authenticated 無讀寫權、service_role 可讀寫、6 欄、0 行；`public` 由 8 張表變 9 張。同日創辦人回覆「我唔會推送……維持原狀」，loop 誤解為「不想合併」；創辦人其後澄清是「不懂得合併」，並回覆「a」：照 loop 的步驟用 GitHub Desktop 推送及合併。

### Q-A7-3 公開「最近退回」清單
- 類型：方向決定
- 背景：審計 #7 建議公開最近修正。現有紀錄 `data/questions/withdrawn.json` 共 597 條，全部是 2026-09-29 同一批（解析以「第二項／最後一項」指選項，選項洗牌後會指錯）。紀錄只有日期及原因代碼，無題目內容。
- 選項：A 在 `/transparency` 加一段「最近退回」：日期、科目、條數、原因（白話），由 `withdrawn.json` 自動產生 / B 不公開
- Loop 建議：A。資料已存在，無需後台。
- 創辦人回覆：2026-10-04 對話中回覆「A7-3 A」。已實施：`/transparency`「最近退回紀錄」，commit `fb42589`（測試修正 `c8eca66`）。

### Q-A7-4 CSP `script-src 'unsafe-inline'`
- 類型：技術取捨
- 背景：審計 #7 指 CSP 容許內嵌程式碼。要移除，Next.js 須為每次請求產生 nonce，全站預先產生的靜態頁（build 共 125 頁）都要改為每次由伺服器即時產生：開頁較慢，Vercel 用量增加，或超出免費額度（憲章 §1）。現時無任何地方把用戶輸入當 HTML 顯示：`dangerouslySetInnerHTML` 只用於 JSON-LD 常量、主題初始化腳本，以及 `components/MathText.tsx`（非數學文字先轉義）。
- 選項：A 暫時維持；日後如加入顯示用戶文字的功能，再處理 / B 現在改用 nonce
- Loop 建議：A。
- 創辦人回覆：2026-10-04 對話中回覆「A7-4 B」。已實施：每次請求產生 CSP nonce，`script-src` 取消 `unsafe-inline`，全站頁面改為即時產生，commit `b79cc36`。

### Q-17 選擇題「揀最長」撞中
- 類型：方向決定（題庫）
- 背景：2026-10-04 只讀測試，練習中選擇題「揀唯一最長的選項」命中 50.7%（隨機 25%），中國歷史 99.2%、中國語文 93.2%、中國文學 90.7%、英語文學 82.6%、倫理與宗教 82.2%、公民與社會發展 81.4%、歷史 79.3%、視覺藝術 70.0%。
- 選項：17A 新題自動檢查 / 17B 中史 50 條試點改寫，睇樣本先擴展 / 17C 練習表現估算頁講明 / 17D 暫不處理。追問：17A-2 每科新題合計命中率上限 40%（a 加 / b 不加）；17B-2 上線後同步雲端（a 直接 / b 再問）；17C 字眼（ok / 修改）。
- Loop 建議：17A ＋ 17B；17A-2 a。
- 創辦人回覆：2026-10-04 對話中回覆「17a 17b 17c」，其後「17A-2a 17B-2a 17C ok 18a」。已實施，見 `STATE.md` 同日紀錄及 `docs/option-length-pilot-2026-10-04.md`；17B 擴展與否待創辦人睇樣本後決定。

### Q-18 中國歷史 3 個「答案永遠一樣」的模板
- 類型：方向決定（題庫）
- 背景：`ch_sq_*`、`ch_lq_*`、`ch_mod_*` 各 92 條，四個選項逐字相同，正解永遠同一句，做過一次即記得答案。
- 創辦人回覆：2026-10-04「18a」：記低，17B 試點之後再處理。⬜ 未處理。

### Q-33 `m1_rep_0063–0068`（以標準分數比較兩份卷）
- 創辦人回覆：2026-10-08「33a」。已實施：0063–0066、0068 修復並恢復（M1-04）；0067 繼續收起。

### Q-36 IG 群組入口卡
- 背景：2026-10-08 創辦人日報指群組入口與「本站無用戶互動」不一致。群組頁本身已有聲明及離站確認，入口卡沒有。
- 創辦人回覆：2026-10-08「36a」。已實施：兩張入口卡加「喺 Instagram・站外・唔係官方」。

### Q-37 量度學生有沒有做完、有沒有再練
- 創辦人回覆：2026-10-08「37b」。已寫計劃書 `docs/learning-loop-measurement-plan-2026-10-08.md`；⬜ 等創辦人批准，批准前不收集任何新資料。

### Q-38 憲章 §7.1 覆檢紀錄（2026-10-09 到期）
- 背景：現有資料量不到中途離開率（見 STATE 2026-10-08）。`charter-review-dates.test.mts` 由 2026-10-09 起要求 `docs/charter-review-2026-10-09.md`，否則測試失敗。
- ⬜ 等創辦人決定。

### Q-39 物理選項的 Ω 寫法
- 背景：17 題物理選項寫 `\text{\Omega}`，KaTeX 無法解析，學生見到紅色「\Omega」；11 題已上線。
- ⬜ 等創辦人決定。
