# 審核：Claude Code Perfect Prompt（2026-07-31）

> 對象：`claude_code_perfect_prompt.md`，擬作**系統級前置提示**
> 性質：呢份唔係一次性 spec —— 裝咗之後會影響**之後每一次輸出**，所以錯一條就會長期複製。
> 方法：逐條對真 repo、live Supabase、已安裝憲章 skill 核。

---

## 0. 結論

技術棧、生產紀律、法務三章**準確**，可以直接用。

但有 **5 條裝咗會即刻造成損害**，其中 1 條係**倒退**（推翻一個已經改好嘅更正），1 條會**真係執行錯嘅工具**。修好呢 5 條先好裝。

---

## 🔴 A. 裝咗會造成損害（5 條）

### A1. §2 長答案關鍵字自動批改 —— 第 8 次復發，而且係倒退

§2 中文科：「長答題設**必中關鍵字同加分關鍵字**」
§2 英文科：「Paper 2 嚴格執行 **Tone & Register 雙重語義批改**」「Paper 3 **嚴打** Blind Copying 同 Over-paraphrasing」

呢三處要求機器按關鍵字／語義自動判分。同一份文件 §6 就寫住「**機器永不自動入庫**」。

**關鍵在於：呢條紅線上次已經改好咗。** 已安裝嘅 `dse-level-up-claude-code-ultimate-prompt/SKILL.md` 第 18–20 行明文記錄：

> 本 skill 版本已將 §5 三處降級為「參考關鍵字自我對照／溫和非評分提示」，與 §2/§13 對齊

現行代碼亦已落實（`app/practice/LongPracticeSession.tsx`）：

> 自評係學生自己講，唔係客觀分。混入去就等於將主觀數據當客觀指標展示。

裝呢份未修版 = 推翻已完成嘅更正。

**改法**（照抄已安裝版嘅措辭）：
- 中文科 → 「長答題可設參考關鍵字／加分關鍵字清單畀學生**自我對照**；機器永不自動出分」
- 英文科 Paper 2 → 「可標示 Tone & Register 參考重點供**學生自評**」
- 英文科 Paper 3 → 「重疊率**溫和非評分提示**」（「嚴打」屬懲罰語氣，撞 §3 大愛設計）

### A2. §4 色彩系統 —— 五隻色全部落現行淺色主題唔合格

§4 色表描述嘅係**舊嘅純暗色狀態**。repo 早已完成 light-first 遷移，`globals.css` 淺色為預設，暗色係 `[data-theme='cyber']` 覆寫。實測憲章色落真實淺色底：

| 憲章色 | 頁面底 #FAFAF8 | 卡底 #FFFFFF | AA 4.5 |
|---|---|---|---|
| 青 `#00F5D4` | **1.34** | 1.40 | ❌ |
| 黃 `#FEE440` | **1.23** | 1.28 | ❌ |
| 粉 `#FF006E` | 3.67 | 3.83 | ❌ |
| 紫 `#9B5DE5` | 3.95 | 4.13 | ❌ |
| 次色字 `#8B949E` | 2.94 | 3.08 | ❌ |

對照 repo 現行淺色 token：`accent #006B65` = **6.11** ✅、`gold #7E5D07` = **5.81** ✅。

照 §4 個表寫 code，會一次過推翻 commit `bb27544`（兩個主題、20+ 頁、0 不合格）嘅全部成果。

**改法**：§4 改為兩欄（Light 預設 / Cyber 覆寫），值取自 `app/globals.css` 而非硬寫；並註明 `#00F5D4` 係 **cyber-only**。

### A3. §8 `/SIMPLIFY` 喺呢個環境係另一件事，而且會真係執行

§8 寫「`/SIMPLIFY` = 解析簡化」。但呢個環境有一個**內建同名 skill**，功能係「review the changed code for reuse, simplification, efficiency… then apply the fixes」——**會對 codebase 做重構並改檔案**。

呢個係五條入面最危險嗰條：其餘四條係寫錯字，呢條係按落去會動代碼。

另外七個指令**唔存在**：`/ANALOGY`、`/ACTIONITEMS`、`/IDEAS20`、`/HOOK+`、`/CAPTION+`、`/THREAD`（加上撞名嘅 `/SIMPLIFY`）。

實際存在嘅內容類 skill 只有 10 個：`eli10`、`tone`、`sum3`、`proof`、`human`、`compare`、`steps`、`meetingnotes`、`dse-build-auto`、`dse-level-up-orchestrator`。

**改法**：刪走七個唔存在嘅；`/SIMPLIFY` 改名（例如 `/PLAINER`）或直接刪，唔可以留住同內建 skill 撞名。

### A4. §12 復活「化城避風港」，而 §9 自己禁咗

§12 哲學對照表：「同苦化城 | **化城避風港** + 4-7-8 呼吸法 + 錯題共鳴區 + 影子溫書室」
§9 否決清單：「❌ 舊名: Aethel / WisdomPath / **化城避風港** / Buff 補給艙」

同一份文件，一邊禁一邊用。repo 已於 2026-07-15 按 CEO 指令統一改名「**呼吸空間 / Breathing Space**」（`app/relax/layout.tsx:5`）。

留意：「同苦化城」作為**哲學概念**仍在 repo（`GroundingExercise.tsx:121` 註解），冇問題；出事嘅係攞佢做**產品名**。

**改法**：§12 該欄改為「呼吸空間（Breathing Space）」。

### A5. §4 黃色用途寫住「Streak」

§4 色表：「黃色 `#FEE440` | 燈絲、溫暖元素、**Streak**」

§9 明文禁 gamification。而「連續打卡」數據卡今日（commit `7b16d6f`）先至剷走，改為「近 30 日練習」—— 正正因為斷一日歸零對焦慮學生係壓力源。

**改法**：刪「Streak」二字。

---

## 🟡 B. 事實錯誤（唔會即刻造成損害，但會傳播）

| # | 位置 | 文件講 | 實際 |
|---|---|---|---|
| B1 | §2 中文科 | 概念網「**29** 個節點分**五**大類，以《魚我所欲也》為例」 | `docs/concept_network.json`：**12 篇 · 58 節點 · 4 類**（theme／technique／line／figure）。《魚我所欲也》本身只有 5 節點。**第三份文件同一個錯** |
| B2 | §0.3 vs §9 | §0.3「收費實驗僅限 2026 年研究」 | §9「❌ 收費模式 / Premium / 訂閱」。內部矛盾；repo 實測**零收費殘留**（task #63 免費化） |
| B3 | §0.4 | 成本上限「$0–200 美金」 | `CLAUDE.md` 寫「$180.81」。兩個數要對齊 |
| B4 | §4 | 吉祥物 Lumina（狀態 idle/celebrate/think/comfort/talk） | repo **零命中**。屬未建構想，唔應該放喺「規範」章 |
| B5 | §4 | Body **9pt**（＝12px） | 對讀寫障礙／SEN 平台偏細；16px 先係可讀性基線。同 §3「無痕 SEN 專注模式」自相矛盾 |
| B6 | §3 | 「今日能打開嚟已經**好參**」 | 錯字。而 §8 自己有 `/PROOF` 攔錯字 |

---

## ✅ C. 準確，可直接採用

- **附錄 A 技術棧**：Next 16.2.9 / React 19.2.4 / Tailwind v4 / Auth.js v5 / 無 Drizzle・Better Auth・Supabase Auth / `proxy.ts` / `--webpack` / port 3001 —— 逐項對得上
- **§6 生產紀律**：drafts → review → 真人逐題批 → promote → 實名 decisions.json → 人手 wire。3:5:2、`correctIndex`(0–3)、選項洗牌、解析引內容不引字母 —— 全對
- **§5 法務**：免責聲明同 Footer 字句同 `components/Footer.tsx` 一致
- **§0.5 榮譽協作者**（非僱員、無薪酬、$0、權限限前端 Bug 回報）—— 同已上線嘅守護者致謝一致
- **§10 Kimi 清單** 9 項全對
- **§9 否決清單本身**準確（問題喺 §12 同 §4 違反佢）

---

## D. 順帶：已安裝嗰份 skill 都有兩處要更新

`dse-level-up-claude-code-ultimate-prompt/SKILL.md`：

- 第 56 行、第 228 行：「目前題庫只支援 `type:"mc"`」—— **已過時**。`text` 同 `long` 兩個題型已於 2026-07-31 落地（`_gate.mjs` `SUPPORTED_TYPES = {mc, text, long}`、`LongPracticeSession.tsx`、`?mode=long`）
- 第 319 行：「Bella | 生物 | **長答題關鍵字覆蓋率 90%+**」—— 呢個 KPI 隱含關鍵字批改，同已更正嘅 §5 唔一致，屬殘留

---

## E. 建議

1. **修好 A1–A5 先好裝。** A1 尤其重要 —— 佢係推翻一個已完成嘅更正，裝咗等於白做。
2. A3 建議即刻處理，因為 `/SIMPLIFY` 撞名會**真係改代碼**。
3. 裝嘅時候應該**取代**而唔係並存 `dse-level-up-claude-code-ultimate-prompt`；兩份憲章同時存在，下一次就會有人問「跟邊份」。
4. §4 色表唔應該硬寫 hex —— 指向 `app/globals.css` 嘅 `@theme` 區塊，先唔會再次同實際脫節。
