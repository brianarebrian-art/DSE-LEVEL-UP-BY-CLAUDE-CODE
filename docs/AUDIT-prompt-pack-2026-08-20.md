# 六份指令文件事實核查（2026-08-20）

核查對象（`~/Downloads/Dse level up20260820/`）：

| # | 文件 | 性質 | 判決 |
|---|------|------|------|
| 1 | `prompt_harness.md` | 主指令（2,240 行） | **不予安裝**（可救，見 §5） |
| 2 | `dse-level-up.md` | Claude Code skill | **不予安裝** |
| 3 | `DSE_LEVEL_UP_內部機密會議_Claude_Code_Prompt.md` | 會議模式指令 | **部分採用**（檢查清單可用，17 人扮演不做） |
| 4 | `DSE_Level_Up_Marketing_Team_Claude_Code_Prompt.md` | 營銷指令 | **不予安裝**（§4.3 連登、§5.3 私隱宣稱） |
| 5 | `歷史百科-Claude-Code-終極指令.md` | 另一個項目 | **範圍外**，需創辦人拍板 |
| 6 | `DSE_LEVEL_UP_UIUX_重構_Prompt_v2.md` | UI/UX 重構 | **部分採用**（方向對，token 段落會整爛嘢） |

核查方法：只認 filesystem 與 live Supabase 實物，不認文件自述。

---

## 1. Ground Truth 錯誤（照做會刪走運作中的代碼）

### 1.1 🔴 Better Auth 不是幻覺 —— 已安裝並已接線

六份文件全部把 Better Auth 列為「Claude 常見幻覺，實際無」。**這一條現在是錯的。**

```
package.json     better-auth ^1.6.23   （next-auth ^5.0.0-beta.31 並存）
lib/auth/better-auth.ts          betterAuth() 實例
lib/auth/client.ts:9-10          AUTH_BACKEND 開關
lib/auth/session.tsx:72,85,93    兩個 backend 各自的 bridge
app/api/auth/[...nextauth]/route.ts:2-3   toNextJsHandler
app/(auth)/sign-in|sign-up/page.tsx:17-18 email 登入僅在 better-auth 模式開放
```

`AUTH_BACKEND` 由 `NEXT_PUBLIC_AUTH_BACKEND` 決定，**預設 `next-auth`**。即：Auth.js v5 仍是 live 的預設路徑，但 Better Auth 是一個已完成、可用單一環境變數切換的第二 backend。

**風險**：任何 session 照著「Better Auth 是幻覺」這條指令做清理，會刪掉 5 個檔案的可運作代碼與 email 登入路徑。這條必須改寫為事實描述，不能保留為「禁用清單」。

### 1.2 🔴 暗金色值倒轉

文件寫 `--accent-yellow: #B8860B（已修正達 AA）`（harness §9.2、UIUX v2 §3.1）。

實測 `app/globals.css:61-63`：

| Token | 真值 | 對比 |
|---|---|---|
| `--color-gold` | `#7E5D07` | 5.56（淡底 4.51）|
| `--color-gold-soft` | `#D4A017` | 2.17 —— 註釋寫明「永遠唔可以做字色」|
| `--color-gold-strong` | `#725106` | 6.63 |

`#B8860B` 是**修正前**的未達標值。文件把被淘汰的值標成「已修正」，而且 §10.5／§4.5 指定它做「等級下降趨勢線」的顏色 —— 即用一個未過 AA 的色去畫一條學生最需要看清楚的線。

### 1.3 🔴 Token 名全部是新發明

| 文件寫 | 代碼真名 |
|---|---|
| `--bg-primary` / `--bg-secondary` / `--bg-tertiary` | `--color-surface` / `--color-surface-raised` / `--color-surface-sunken` |
| `--text-primary` / `--text-secondary` / `--text-muted` | `--color-ink` / `--color-ink-soft` / `--color-ink-muted` |
| `--accent-primary` | `--color-accent` |

照文件建立 token = 起第二套平行系統。連帶後果：Phase 0 那 28 個硬編碼檔案會被遷移到**錯誤的目標名**，等於做兩次。

### 1.4 🔴 `--text-muted: #8A8A8A` 不過 AA

白底約 **3.5:1**，低於 4.5:1。而文件指定它給 caption 與時間戳 —— 正是 `globals.css` 註釋明言必須用 `--color-ink-muted`（#5E5E5E，5.93）而非 `--color-ink-faint` 的場合。

同一份文件 §10.4／§25.4 要求 Lighthouse Accessibility ≥ 95。兩者不能同時成立。

### 1.5 🔴 Supabase 規模誇大

harness §6.2 稱「已完成：12 張表 Schema、4 支 RPC」，並附「虛擬員工 42 人已全部簽名核實，零 P0/P1 漏洞」。

實測 live（project `aegekxapxgcfdrkzisis`）public schema = **7 張表**：

```
user_progress    136 行
user_settings    114 行
review_decisions 114 行
profiles           6 行
wall_posts         1 行
wall_likes         0 行
user_sessions      0 行   ← 前端從不寫入
```

`supabase/migrations/` 內 **0 支 RPC**（grep `CREATE FUNCTION` 命中 0 個檔）。

「42 人已簽名核實」是要求接受一次從未發生的審核。虛擬 persona 不能簽名 —— 這條紅線寫在 orchestrator skill 第 2 條，harness 卻在自己的 Ground Truth 章節違反它。

### 1.6 🟡 `concept-webs/` 不存在

會議 doc §五把生產線寫成 `concept-webs/` → factory → `drafts/` → `_gate.mjs`。第一段目錄不存在。真實管線起點是 `drafts/`。

### 1.7 🟡 題數自打嘴巴

`lib/entitlements.ts:9` → `SESSION_SIZE = 20`。

harness §6.4 寫「每 session 固定 20 題，DIFF_RATIO 3:5:2」，§8.2 與 §10.1 寫「預設 5 題」。同一份文件兩個數，而 3:5:2 分層在 5 題上除不盡。

---

## 2. 憲章紅線違反

### 2.1 🔴 C-Strict / Zero-Local-Write（第 4 次復活）

出現位置：harness §6.1／§6.2／§16.4、`dse-level-up.md` §三、會議 doc §五、UIUX v2 §8.2／§11。

實測影響面：**62 個檔案**使用 localStorage，**50 個 `setItem` 呼叫點**。

照做要拆掉：dashboard、錯題本、bookmarks、`dse_topic_stats`、`dse_reverse_log`、`dse_daily_spectrum`、`dse_review_done`、`/relax` 全部功能、以及上星期才交付的 `/answer-sheet` 自評與紙筆戰士。

而且 **harness §10.2 自己寫**「首頁主按鈕直接開始做題，使用 localStorage 匿名 ID」，UIUX v2 §4.2 同樣。同一份文件內，§6 禁止的東西 §10 要求實作。

`/relax` 必須維持純 localStorage 另有獨立理由：情緒數據上雲 = 儲存精神健康 PII。

### 2.2 🔴 長答題機器批改（第 18 份文件）

- harness §13.1／§13.3：`marking_scheme` 含 `keywords`、`match_type: any/all/exact`、「必中關鍵字同加分關鍵字」
- harness §七、會議 §六、`dse-level-up.md` §二：「Tone & Register 雙重語義批改」「嚴打 Blind Copying / Over-paraphrasing」

`data/questions/types.ts` 寫住「書寫題永不由機器批改」。7 月 31 日 Brian 裁定：書寫題自評只寫 topicStats + reverseLog，不入 `recordAttempt`。這是已落地的架構決定，不是待議項。

`marking_scheme` 可以保留 —— 但只作**人眼參考**，機器不按 keywords 出分。

### 2.3 🔴 收費復活

harness §20.2：「若 Vercel Edge Requests 首次爆額，將以『提升用戶使用質素』名義推出 Premium 訂閱套餐」。
harness §五 與 `dse-level-up.md` §九.1 更進一步，教我在用戶要求收費時**照這個說法回答**。

CLAUDE.md §3：2027 DSE 前絕對免費，嚴禁建議收費模式、Premium、訂閱。2026-07-12 已執行「免費化」，`/upgrade` 頁面與所有 tiering 已刪除。

這不是替我準備一個應急方案，是預先寫好一段讓我在被問到時說出口的稿。

### 2.4 🔴 Gamification 復活，且自打嘴巴

| 位置 | 內容 | 與之衝突的條文 |
|---|---|---|
| harness §20.3 | 虛擬超市「進度解鎖」「完成度評分」「HHA 評分」「社交展示」，自認「已納入 gamification 框架管理」 | 同一份 §16「禁止 解鎖機制」 |
| UIUX v2 §4.5 / harness §10.5 | 徽章「連續 3 日溫書」 | 同一份 §11／§16「禁止 Streak（連續天數）」 |
| 同上 | 徽章「深夜戰士（凌晨做題）」 | §8 情緒安全網 —— 這是在獎勵凌晨兩點做題 |

「深夜戰士」尤其要拿掉。整份文件的敘事前提是「凌晨兩點壓力爆煲的學生」，然後發一個徽章鼓勵他重複那個行為。

### 2.5 🔴 已否決項目復活

- **JUPAS 預測器** —— harness §3.5 哲學對照表「衣裏明珠 → 潛能提醒 + 錯題價值化 + JUPAS 預測器」。CLAUDE.md §8 永久否決。
- **老師平台 / IEP 草案** —— harness §3.3 P4、Marketing §3 P4「大數據儀表板、錯題 DNA、IEP 草案」。2026-07-14 一刀斬，`classes`/`enrollments`/`question_events` 三表已刪，migration 0003 已套用。
- **化城避風港** —— UIUX v2 §4.6、harness §10.6。2026-07-15 已更名「呼吸空間 / Breathing Space」。

### 2.6 🔴 假數據功能

- **影子溫書室**「而家有 X 個戰友同你一齊溫書」（harness §8.1／§10.6、UIUX v2 §4.6.3）—— 已拒絕過（F-SSR）。`user_sessions` **0 行**，沒有任何數據源，唯一實作方式是編。
- **錯題共鳴區**「X 個戰友都錯過」—— 需要 `question_events`，該表 2026-07-14 已刪。

### 2.7 🟡 錯題 DNA 編碼自相矛盾

harness §20.5 稱 `CMT-TMR-MEC` 循環編碼是「平台最大嘅多巴胺來源同技術護城河」。
harness §10.3 與 UIUX v2 §4.3 寫「禁止顯示 CMT-TMR-MEC 等編碼」，理由是「我似實驗品」。

UIUX v2 那一邊是對的。編碼留在內部數據結構，UI 一律出人話。

---

## 3. 對外宣稱與法律風險

### 3.1 🔴「零版權風險」—— 被自己的制度列為紅燈

會議 doc §八「三級宣稱制度」明文把「零版權風險」列入 🔴 **禁止**。
但 Marketing §2.2 與 harness §3.2 都把「零版權風險平行對齊改寫法」放在四大賣點**第一位**。

Archetype Masking 降低風險，不等於零風險。對外說「零」是給自己開一張兌現不了的支票。改為可驗證的描述：「所有題目獨立改寫，非 HKEAA 官方試題」。

### 3.2 🔴「醫療級」情緒安全網

「醫療級 60 秒逆向鎖死引擎」「醫療級情緒安全網」在四份文件出現。

平台不是醫療器械，沒有臨床驗證。在香港，以醫療效能作招徠涉及《不良廣告（醫藥）條例》風險。內部用作設計標準的比喻可以，寫進對外賣點不行。

### 3.3 🔴 連登「無意中分享」= 隱瞞關聯的推薦

Marketing §4.3、harness §11.1：

> 口吻：「無意中分享」…「有冇人試過……」→ 個人體驗 →「幾好用，免費嘅」→ 不主動貼 link，等人問先 PM

這是指示扮演無關第三方去推薦自家產品。我不會寫這類文案。

替代做法同樣有效：表明身份的分享（「我哋做咗個免費 DSE 題庫，想搵人試」）在連登不但可行，可信度反而更高，也不會在被起底時毀掉整個品牌。

### 3.4 🔴「零登入。連你個名都唔使畀」

Marketing §5.3 與 harness §17 範例 3，借 Canvas 外洩事件宣傳。

平台**有** Google OAuth 登入，`profiles` 表有 6 行真實用戶記錄。這句是假的。

在一則以「別人洩露了你的資料」為主題的帖文裡，講一句關於自己私隱做法的不實陳述 —— 這是所有宣稱裡最容易被反噬的一種。真話同樣夠力：「唔使登入都用得，登入淨係為咗跨機同步進度」。

### 3.5 🟡 具名真人的財務數字

harness §3.4：「YY Lam：2023-2025 年合約固定報酬 5,700 萬加分紅，年收入 8,000 萬」。

對一個真實、可識別的在生人士的未經證實收入斷言。即使只放內部文件，一旦流出即誹謗風險。競品分析不需要這個數字也成立。

### 3.6 🟡「首創」「香港首個」

三級宣稱制度自己的 🟢 綠燈例子是「香港首個內建錯因 DNA 診斷嘅 DSE 平台」—— 一個無法驗證的第一宣稱，按它自己對紅燈的定義（「絕對性、無證據嘅排名宣稱」）應該是紅燈。

制度本身很好，例子要換。

### 3.7 🟡 榮譽協作者以 LinkedIn 推薦信抵薪

harness §20.4：真實朋友、單次任務、$0 報酬、回報為虛擬鳴謝／LinkedIn 推薦信。

這是創辦人的人事決定，不由我拍板。只提一點：涉及真實朋友的無償工作安排，值得在動手前確認清楚雙方預期，尤其「LinkedIn 推薦信」是一份會長期留在對方公開檔案上的東西。

---

## 4. 無障礙倒退

| # | 條文 | 問題 |
|---|---|---|
| 1 | `user-scalable=no, maximum-scale=1.0`（UIUX §7.1、harness §23.1）| **WCAG 1.4.4 失敗**。iOS 10+ 起已忽略此設定，所以它只在 Android 生效 —— 即只傷害其中一半用戶。而且文件自己已要求 body ≥16px，防 zoom 的原始理由不存在。**直接刪掉整個 `maximum-scale`／`user-scalable`。** |
| 2 | Landscape 顯示「請轉返豎屏使用 📱」 | **WCAG 1.3.4 失敗**。使用固定支架、輪椅托架的用戶轉不到。應該支援橫屏，不是擋。 |
| 3 | `dse-level-up.md` §五 字級 Body **9pt**（≈12px）、Caption 7pt | 與 harness §9.3 的 16px 直接打架。9pt 正文對一個 SEN 平台是災難。 |
| 4 | `feTurbulence numOctaves="5"` 全頁紙張紋理（§13.2／附錄）| 與 60fps、Lighthouse ≥90、3G <2 秒三項驗收衝突，在目標受眾的舊 Android 上尤甚。要紋理就用一張預先算好的 tiled PNG／SVG data-URI，不要 live filter。 |
| 5 | 「禁止 emoji 作為主要圖示」vs 全文用 🕳️🧠✏️ 做錯因圖示 | 自相矛盾，選一邊。 |

---

## 5. 其他要修的

### 5.1 「嘅」不是口語紅線

`dse-level-up.md` §一.3、harness §2.1 把「嘅」列為絕對禁止的港式口語。

- 整份文件自己從頭到尾用「嘅」
- CLAUDE.md §5 明文：**UI 情感層可用廣東話**，只有解析層必須 100% 書面語
- 真實的 `scripts/qbank/term-guard.mjs` 不攔「嘅」

這條規則寫錯了對象。紅線是**層次**（解析層 vs 情感層），不是某幾個字。照字面執行會把「你發現咗一個新盲點💡」這類已核准文案判為違規。

### 5.2 禁 Lucide 的實際規模

實測：**54 個檔案**引用 `lucide-react`，涵蓋 79 個不同圖示。

這不是 Phase 0 一星期能做完的事，而且 `lucide-react` 是 10 個 dependency 之一，全部替換後應該一併移除，否則白付 bundle 成本。建議改為漸進：新組件用手繪 SVG，舊的隨頁面重構逐步換。

### 5.3 Caveat / Kalam 沒有中文字符

兩者都是拉丁字體。繁中產品把它們設為 Display 字體，結果是中文標題全部 fallback 到系統字體 —— 英文標題手寫、中文標題機器，反而做出文件想消滅的那種不一致感。

要手寫感就找有繁中覆蓋的字體，或者手寫風只用在數字與分數（「4/5」這種確實是拉丁字符）。

### 5.4 歷史百科是另一個項目

`歷史百科-Claude-Code-終極指令.md` 與 DSE 無關：Next.js 14（這邊 16）、另一個 repo、另一個受眾（全球讀者，非 12-18 歲考生）。它**通不過 harness 自己的 §四 受眾關**。

三點要先講清楚：
1. 它要我 deploy 到 Vercel 並交回公開網址 —— 我登入不到創辦人的 Vercel 帳戶，這步必須由本人做。
2. 它要我生成六日戰爭條目，含「具體檔案編號」來源。**檔案編號不能砌**。聯合國安理會第 242 號決議是真的、可引的；具體傷亡數字與檔案編號必須逐條查證，查不到就留空，不能為了填滿格式而發明。
3. 這是一個從零起的完整項目，不是 DSE 的一個 phase。要做的話應該分開開工。

---

## 6. 可以直接採用的部分

這幾份文件不是全錯，以下經核對後屬實或有用：

- **三級宣稱制度**（🟢/🟡/🔴 框架）—— 好制度，換掉綠燈例子即可用
- **GT-4 已知陷阱** —— `globals.css` stale cache、`footer{display:none}` 殺掉卷號與 HKEAA 免責聲明，兩件都是我們自己踩過的，記錄準確
- **Tailwind v4 arbitrary value 覆寫不到** + **α≤0.15 藥丸陷阱** —— 準確
- **參考 App 分析**（Things 3 字級分層、Linear 語意色克制、Apple Books 把閱讀設定當一等公民）—— 準確且有用，尤其「唔標籤化為無障礙模式」這個判斷
- **Duolingo 紅線**（偷語氣，不偷 streak/XP/聯賽）—— 寫得好
- **Phase 排序**（做題流程 > 首頁）—— 對。136 個用戶的樽頸是留存
- **正向批改語言庫** —— 與現行一致
- **手機硬指標**：touch target ≥48px、body ≥16px、解析同頁不跳轉、所有可撳元素有 `:active` —— 全部值得做
- **`correctIndex` 0-3 非字母式、選項洗牌、解析引內容不引字母** —— 與代碼一致
- **機器永不自動入庫** —— 與代碼一致

---

## 7. 建議

**不要安裝任何一份為常駐 skill。** 理由：每一份都在自己的「Ground Truth」章節裡放了會刪走運作中代碼的錯誤事實（§1.1 Better Auth、§1.5 表數、§1.2 色值），而常駐 skill 的錯誤會在每個 session 重複生效。

要保留價值，建議：
1. 把 §6 那批經核實的內容併入現有 `CLAUDE.md` 與 orchestrator skill
2. UI/UX 重構照 UIUX v2 的 **Phase 排序**做，但 token 一律用真名（§1.3），色值一律用 `globals.css` 現值（§1.2）
3. §1 的七項 Ground Truth 錯誤要回寫入源頭文件，否則下一版 prompt 會再帶著同樣的錯誤回來

**同時要更新 CLAUDE.md 本身** —— 它 §3 寫「每月總技術成本死鎖 $180.81」，而 `scripts/budget-guard.mjs:4` 記錄 2026-07-29 Brian 已改為 US$200。文件與 guard 不一致，需要創辦人確認以哪個為準。

---

© DSE Level Up 2026. Not affiliated with HKEAA.
All questions are independently rewritten for educational purposes.
