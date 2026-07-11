# 27+2 位虛擬專家指令執行報告（2026-07-10）

> 對應文件：`DSE_LEVEL_UP_Claude_Code_Prompts_v2.md`。原則：**做得到嘅做晒；做唔到／唔應該做嘅，白紙黑字解釋。**

## 通用調整（適用於全部專家）

原規格部分假設咗唔存在嘅結構（`src/`+`content/questions/*.json`、Drizzle、Python）。
真實 repo 係 `app/`+`data/questions/*.ts`、Supabase、零依賴 Node scripts；auth 係**雙 backend 架構**
（Auth.js v5 預設，better-auth 已安裝、由 `NEXT_PUBLIC_AUTH_BACKEND` 切換 —— Max 規格所講嘅
Better Auth 有根據，毋須遷移，兩者並存）。
所有任務已**映射到真實架構**執行，功能等價；散裝 JSON 題目檔係冇接線嘅死內容（違反 no-placeholder 紅線），
故所有新題直接寫入已接線嘅 TS bank。

## 逐位交代

| # | 專家 | 狀態 | 做咗乜 / 點解唔做 |
|---|------|------|------------------|
| 1 | Brian (CEO) | ✅ | [today_action.md](today_action.md)：3 大優先行動＋受眾檢查（發現 1 項偏離：AETHEL 全齡層指令 vs 12-18 定位，待創辦人裁決）＋付費依賴檢查。`weekly_mission.md`/`expert_status.json` 未存在，已註明。 |
| 2 | Yuna (COO) | ✅ | 全站負面字眼掃描：**零檢出**（早前已改用正向文案）。PanicButton 唔存在 → 建咗 `BreathingExercise.tsx`（4-7-8）。 |
| 3 | Benjamin (CFO) | ✅ | `scripts/budget-guard.mjs`＋`data/expenses.json`（上限 $180.81、80%/100% 警戒、付費 SDK 掃描）。首次運行即捉到 `@anthropic-ai/sdk` → 列作已審批例外（人文科生成管線用，冇 key 冇費用）。Python→Node（repo 慣例，功能一致）。 |
| 4 | Max (CTO) | ⚠️ 部分 | ✅ API 錯誤統一 `{error,code}` JSON（已核對 8 處）；rate limiting 見 Eric。❌ **唔跟佢嘅版本鎖定表**：表內 Better Auth/Drizzle 同真實棧（Auth.js v5＋Supabase）唔符，遷移 auth 層係無理由嘅破壞性手術。 |
| 5 | Emma (PM-UDL) | ⚠️ 部分 | 60 秒鎖＋三選一錯因**早已上線**；新增 `ReadingRuler.tsx`（SEN）。❌ 「焦慮模式隱藏倒數」與 60 秒反思鎖**教學法直接矛盾**（唔可以又逼反思又話冇時限）；❌ OpenDyslexic 字體需捆綁字體檔＋CSP 調整，入 backlog。 |
| 6 | Luna (法務) | ✅ | Footer 免責聲明**本已上線**（preview 實證）；全部題目為原創改寫、無 HKEAA 抄錄；B2B 文件已附 disclaimer；題目人名用通用虛構情境。 |
| 7 | Carson (經濟) | ✅ | 上輪完成：共用品／企業家職能術語、超綱彈性剷除（對照 EDB 原文）、term-guard 把關。經濟 bank 已 110＋條，遠超「10 條」要求。 |
| 8 | Amity (中文) | ⚠️ 部分 | ✅ 新增 **5 條十二篇跨篇比較 MC**（師說×勸學、岳陽樓記×出師表、登樓×聲聲慢、六國論×始得西山、念奴嬌×登樓），全部設過度推論／半對半錯／張冠李戴陷阱，build 綠。❌ 5 條長答題：MC 平台無長答判分 UI，marking_scheme 冇地方跑；concept_network.json 留待長答功能立項先有意義。 |
| 9 | Arthur (英文) | ✅ 已存在 | 英文 bank 於 spec-realignment 已加 reading／genre-tone／integrated 題型。Paper 2 寫作/Paper 3 Data File 完整卷 = 非 MC 題型，同長答一樣未有承載 UI。 |
| 10 | Victor (數學) | ⚠️ 大部分已存在 | 682 條參數化母題變體（正是佢要嘅「動態題庫」，且 correct-by-construction，驗證比佢個 spec 更嚴）。❌ Casio fx-50FH II 程式按鍵序列：**無實機驗證，教錯計數機程序係學術事故** — 唔出。 |
| 11 | Mia (CMO) | ✅ | `content/marketing/`：threads_post_1（免費平權）、threads_post_2（最後30日搶分故事）、kol_dm_template。零收費暗示、零全齡層內容、無「保證5**」。 |
| 12 | Sarah (社工) | ✅ | `BreathingExercise.tsx`（4-7-8，/focus 頁，preview 實證 phase machine 行到「呼氣 8 秒」）＋`EncouragementWall.tsx`（/result 頁，8 條學長姐留言每日輪 3）＋醫療免責＋撒瑪利亞會熱線。 |
| 13 | Ethan (數據) | ⚠️ 大部分已存在 | `lib/grading.ts` predictGrade＋cutoffs（等級估算）同 `ErrorDNA.tsx`（錯因編碼 A/B/C ≡ 佢嘅 CMT/TMR/MEC）**都已上線**。❌ jupas_recommender：需要各院校**真實收生數據**，AI 生成收生中位數＝呃考生前途 — 等創辦人提供官方數據表即可動工。 |
| 14 | Kate (UI/UX) | ⚠️ 部分＋否決 | RadarChart **已存在**；卡片設計語彙已有。❌ 暗黑賽博 token（#0F0F1A＋霓虹）：同已確立嘅 gentle brand 牴觸（地獄紅黑早前已被否決）— 品牌方向要創辦人拍板先可以推翻。 |
| 15 | Jack (客戶體驗) | ✅ | `content/community/`：ig_group_rules（含危機處理指引；社群平台後定為 Instagram Group）、faq（20 條）、ticket_template（48 小時承諾＋報錯核實流程）。FAQSection UI 唔重複建：/transparency＋/methodology 已承擔此角色。 |
| 16 | Kelly (QA) | ✅ | 佢要嘅 qa_validator＋term_guard = `validate-banks.mjs`（欄位/4選項/難度/去重）＋`term-guard.mjs`（禁語+課綱+書面語），兩個 gate 均 CI-ready、運行全綠。Python→Node。 |
| 17 | Leo (前端) | ⚠️ 部分 | LockScreen（60秒鎖）**已存在**；✅ `ReadingRuler.tsx` 新增並 preview 實證（toggle/overlay/S-M-L）。❌ TimerHidden：練習模式無倒數計時器可隱藏，且同 60 秒鎖矛盾（同 Emma）。 |
| 18 | Alan (後端) | ❌ 不適用 | Drizzle schema/seed/索引**全部建基於唔存在嘅技術棧**。真實後端：Supabase 單表 per-user JSONB，PK 已索引，query 封裝在 `lib/sync.ts`＋`/api/progress`。冇嘢需要遷移。 |
| 19 | Eric (安全) | ✅ | CSP 等全套安全 headers **早已上線**（next.config.ts）；✅ 新增 `proxy.ts` rate limiting（API 60/min、auth 30/10min，429 統一 JSON；Next 16 middleware→proxy 已跟新約定，build 確認 `ƒ Proxy` 註冊）。❌ cookie `sameSite=strict`：會斷 Google OAuth 回調，保持 Auth.js 安全預設 lax。❌ zod：現有手動驗證已足夠，唔加依賴。 |
| 20 | Oscar (編輯) | ✅ | 上輪完成：21 檔約 70 條口語→書面語清洗；港式英語掃描零檢出；term-guard 永久把關。 |
| 21 | Rachel (行政) | ✅ | `content/b2b/`：school_proposal（只承諾已上線功能）、honorary_advisor_invitation（正式函）、investor_update_q2（只列可驗證事實，用戶數據明示由創辦人以實數填寫，唔虛構）。 |
| 22 | David (監察) | ✅ | `docs/hkeaa_intel/`：syllabus_tracker（25 科＋十二篇監察）＋change_alert_template（48小時提報）＋`scripts/hkeaa-monitor.mjs`（90 日 staleness，運行全綠）。HKEAA 封鎖抓取，故設計為人手確認＋程式提醒。 |
| 23 | Richard (物理) | ✅ 已存在 | 407 條參數化＋physics-hell 多步題（動量/能量/內阻/熱平衡/折射）。實驗誤差分析題入 backlog（需圖表配套，硬 MC 化會失真）。 |
| 24 | Chloe (化學) | ✅ 已存在 | 145 條參數化＋chemistry-hell（限量試劑/實驗式/pH/氧化數/異構體，含有機）。配平與狀態符號由參數化構造保證。 |
| 25 | Bella (生物) | ✅ 已存在 | 生物 bank ≥120＋biology-hell（遺傳比例/水勢/負反饋）。長答 marking scheme 同 Amity 理由不適用。 |
| 26 | Henry (中史歷史) | ✅ | `content/today-in-history/`：**7 條當年今日**（1912 民國成立、1919 五四、1997 回歸、1937 七七、1945 日本投降、1949 建國、1911 武昌起義），史實逐條核對、中立客觀、附考試角度。README 講明係 staged content（前端模組未立項，唔上死連結）。中史 bank ≥120 已存在。 |
| 27 | George (地理) | ⚠️ 已存在＋部分 | 地理 MC bank ≥120。❌ 完整 DRQ（data_table＋describe/explain/suggest 逐項判分）：需要新題型 UI＋判分流程，MC 平台未支援 — 同長答一併留待立項。 |
| 28 | Fiona (BAFS) | ✅ 已存在 | 89 條參數化＋bafs-hell。報表平衡（A=L+E）由參數化公式**構造上成立**，比事後 Python 驗證更強。 |
| 29 | Ian (ICT) | ✅ 已存在 | ICT bank ≥120＋ict-hell（演算法追蹤/二補數/位元換算，全部人手驗算）。偽代碼自動執行器留 backlog（現有答案已逐條驗證）。 |

## 第二輪執行（2026-07-10 同日補完 — 將可做嘅 skip 反轉做晒）

| 專家 | 新完成項 |
|------|---------|
| Emma / Leo | **柔和計時**：60 秒鎖新增「柔和」掣 —— 進度條代替紅色數字倒數、暖色代替紅黑（只改呈現，60 秒反思照樣執行，教學法無損）。TimerHidden 原文正是「隱藏數字改進度條」，重讀後確認無矛盾，故執行。 |
| Emma | **易讀字體**：練習頁「易讀字體」開關（BDA 風格指引推薦嘅系統字體堆疊 Verdana/Tahoma 等）。OpenDyslexic CDN 抓取失敗（404），且 BDA 本身推薦系統無襯線字體、研究證據更強 —— 系統堆疊係更好方案，非妥協。 |
| Yuna / Sarah | **唞一唞掣**：練習頁左下角常駐，隨時打開 4-7-8 呼吸 overlay（PanicButton 落地喺壓力現場）。 |
| Jack | **FAQSection 上站**：8 條精選 FAQ 以原生 `<details>` 手風琴掛入 /about（零 JS 狀態、鍵盤無障礙）。 |
| Ethan | **重複模式警示**：ErrorDNA 新增連續 ≥3 次同類錯因偵測（佢規格嘅 CMT-TMR 循環警告）。 |
| Kelly | **npm scripts**：`npm run qa` / `qa:budget` / `qa:intel` 寫入 package.json。 |
| Brian | `docs/weekly_mission.md` + `docs/expert_status.json` 建立（晨報依賴嘅兩個輸入檔）。 |
| Luna | `docs/legal_audit.md` 審核記錄（7 項全過 + 2 項非阻塞待辦）。 |
| Eric | `docs/security_audit.md`（現有防護 + 誠實限制 + 滲透界線）。 |
| Max | **事實修正**：better-auth 唔係幻想棧 —— repo 係雙 auth backend（next-auth 預設／better-auth env 切換），毋須遷移。Drizzle 維持不適用。 |

### 第二輪維持唔做（解釋不變）

- **Victor Casio 程式**：無實機驗證按鍵序列 = 學術事故風險。
- **Ethan jupas_recommender**：等創辦人提供官方收生數據，AI 唔可以作數。
- **Kate 暗黑賽博 token**：gentle brand 係創辦人早前裁決，要推翻請明示。
- **長答/DRQ/Paper 2-3 完整卷**：需要新題型 UI + 判分流程，屬獨立立項，唔係一個 prompt 做到。
- **Alan Drizzle schema/seed**：技術棧不符（Supabase JSONB 單表）。

## 本輪驗證記錄

- 四個 guard script 全綠：budget-guard／hkeaa-monitor／term-guard／validate-banks（1,740 題 gate-passed）
- `next build --webpack` 綠燈，`ƒ Proxy (Middleware)` 已註冊
- Preview 實證：/focus 呼吸練習運作、/practice 閱讀尺 toggle+overlay+SML、console 零錯誤
- **未推送**：全部改動只在本地，需 GitHub Desktop commit＋push 先會上線
