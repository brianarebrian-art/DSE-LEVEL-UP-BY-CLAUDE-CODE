# Phase 1 影響評估｜零模型 SENSEI（憲章 §4 要求）

**提交人：** Claude Code
**待 greenlight：** Brian（CEO）／Yuna（COO）
**狀態：** 🟡 **read-only 審計完成 —— 未寫任何功能代碼**
**依據：** 2026-08-25 22:23 停火令（Qwen 1.5B 廢止，零模型檢索版啟動）

> 憲章 §4：「超過 3 個檔案嘅變更，必須先進入 Phase 1（read-only audit），
> 產出 impact report，等 Brian/Yuna greenlight 後先准進入 Phase 2（執行）。」
>
> 本報告同時提出 **P0 路線圖入面兩項要先改嘅嘢**。兩項都係地基問題 ——
> 唔改就開工，兩星期後要拆返。

---

## 一、🔴 P0 路線圖兩項要先修正

### 1.1 P0-2 將簽名權交咗畀虛擬 persona

路線圖原文：

> **P0** 第 1-2 週｜Carson/Amity/Arthur/Victor 各注入 **20 張**黃金知識卡片
> （**真人審核簽名**）｜學科軍團

**Carson／Amity／Arthur／Victor 係 skill persona，唔係真人。**

呢個撞正 orchestrator skill 紅線第 2 條（逐字）：

> 虛擬 persona 唔可以簽名 —— Victor / Carson / Amity 等 skill 角色只提供
> **規範同檢查清單**，驗證簽名位**永遠留白**畀真人（Brian / Yuna）

**點解呢項特別要緊：** 零模型版嘅**全部價值**就係嗰句「每張卡有真人簽名」。
如果卡片係 persona「簽」嘅，我哋只係將幻覺由**推理階段**搬去**內容階段** ——
一張冇人真正睇過嘅卡，同一個 1.5B 模型嘅輸出，對學生嚟講分別係零，
但因為佢**睇落**經過審核，反而更難質疑。

Yuna 喺同一份停火令自己講咗答案：

> 「虛擬員工嘅慣性錯誤…**必須由真人（用戶）把關**。AI 出 idea，人做最終決策。」

**建議修正：** 我（或 persona）出**草稿**，`reviewer` 欄**留白**，
行返現有題目管線 —— 由 Brian／Yuna 逐張批，簽真名。
即係 P0-2 應該讀成：「**產出** 80 張草稿卡，**等真人逐張批**」。
20 張／科 × 4 科 = 80 張，人手逐張批係一項實際嘅時間投入，要計入排期。

---

### 1.2 P0-1 將卡片放咗入 Supabase —— 簽名閘會失效

路線圖原文：

> **P0** 第 1-2 週｜建立 `sensei_knowledge` **表結構**｜Alan
> 架構：`Supabase RPC 檢索 sensei_knowledge`

**問題：強制簽名嘅閘喺 git 入面，唔喺資料庫入面。**

`scripts/qbank/promote-drafts.mjs:83-86` ——

```js
if (!reviewer) {
  console.error(`✗ decisions file has no reviewer name in _meta.reviewer —
    a 人手核對 bank must record who approved it.`)
  process.exit(1)
}
```

**冇真人名 = 硬性停機，一行都入唔到庫。** 呢個係現時 25 科題庫嘅實際防線。

而 `scripts/qbank/_gate.mjs` 檔頭亦已經寫低咗同一條原則：

> The machine only decides OBJECTIVE things… It **NEVER** decides whether an answer
> is academically CORRECT — that is a human's job… **nothing a machine merely
> "judged" can reach the live bank — only what a named human approved.**

**一張 Supabase 表冇任何等同物。** 一句 `INSERT` 就入到，冇 reviewer 欄強制、
冇 commit author、冇 diff、冇得 `git blame`。我哋會親手拆咗自己嘅防線。

#### 兩個substrate 逐項對比

| | **repo 資料檔**（`data/sensei/*.ts`） | **Supabase 表** |
|---|---|---|
| 強制真人簽名 | ✅ 沿用 `promote-drafts.mjs` 硬閘 | ❌ 冇等同機制 |
| 審計痕跡 | ✅ `git blame` = 邊個簽、幾時簽 | ❌ 一行 row，冇作者 |
| 檢索速度 | ✅ 本機，即時 | ❌ 每問一次網絡來回 |
| 3 秒法則（Kate） | ✅ 結構上符合 | ⚠️ 差網／地鐵直接爆 |
| 離線 | ✅ 得 | ❌ 唔得 |
| 成本 | ✅ $0（靜態資源） | ⚠️ egress 隨用戶增長 |
| 新表／migration | ✅ 零 | ❌ 要建表 + 上 production + 協議「另行批准」 |
| 改內容 | ⚠️ 要重新部署（Vercel push 自動，約 2 分鐘） | ✅ 即時 |

**唯一嘅真優勢係最後一行**，但內容本身係**批次人手審核**嘅 ——
唔存在「要即刻改一隻字」嘅場景。呢個優勢喺我哋嘅流程入面**冇用**。

#### 體積可行性（已核實）

`data/questions/economics.ts` = **87K**，而家經 `data/questions/load.ts`
逐科 `import()` 動態分包，25 科已經行緊。卡片庫照抄同一個模式：
**讀經濟嘅學生只下載經濟卡**。100 張卡／科屬同一數量級，冇問題。

**建議修正：** P0-1 由「建立 Supabase 表」改為「建立 `data/sensei/` 資料層 +
草稿管線」。**零新表、零 migration、零新批准。**
將來真要雲端同步，可以再加 —— 但反過嚟（由雲端搬返落 git）就要重做審核鏈。

---

## 二、📁 Blast radius（如獲 greenlight）

### 2.1 新增檔案（唔影響任何現有行為）

| 檔案 | 內容 |
|---|---|
| `lib/sensei/types.ts` | 卡片 schema：四段式（概念／例子／考試技巧／常見陷阱） |
| `lib/sensei/intent.ts` | 關鍵詞 → subject/topic 規則引擎，純 JS，零套件 |
| `lib/sensei/identity.ts` | **§16.B 誠實層** —— 「你係咪真人」偵測 + 標準回答 |
| `lib/sensei/load.ts` | 逐科動態 import（抄 `data/questions/load.ts` 模式） |
| `data/sensei/*.ts` | 已簽名卡片（**初始為空**，等真人批） |
| `scripts/qbank/drafts/sensei-*.json` | 草稿，`reviewer` 留白 |
| `scripts/qbank/review-sensei-cards.mjs` | 客觀閘（格式／term-guard／重複） |
| `scripts/qbank/promote-sensei-cards.mjs` | 簽名閘（**沿用 `:83` 嗰段邏輯**） |
| `app/sensei/page.tsx` + client | 頁面 |
| `lib/__tests__/sensei-*.test.mts` | 測試（含 §16.B 誠實測試） |

⚠️ `promote-sensei-cards.mjs` 係**同一套紀律、卡片專用嘅閘**，
唔係逐字重用 —— `_gate.mjs` 現有規則係題目專用（4 個相異選項、`correctIndex` 等）。
簽名嗰段（`:83-86`）逐字照抄，卡片格式驗證另寫。**呢點唔想含混過去。**

### 2.2 需要改嘅現有檔案 —— **只有 3 個**

| 檔案 | 改動 | 點解一定要改 |
|---|---|---|
| `app/sitemap.ts` | 加 `/sensei` | 現有 20 條路由都喺度登記 |
| `components/BottomNav.tsx` **或** `components/Navbar.tsx` | 加入口 | `scripts/integration-guard.mjs` 會 fail 一條**冇任何站內連結**嘅路由 |
| `scripts/i18n-guard.mjs` 覆蓋範圍 | 新頁自動納入 | 新 `app/` 頁面必須雙語 |

**即係話：現有檔案改動 = 3 個，啱啱喺憲章 §4 門檻。**
新增檔案唔改任何現有行為，風險集中喺上面 3 個。

### 2.3 七道 qa 閘影響

| 閘 | 影響 |
|---|---|
| `term-guard` | ⚠️ **卡片內容必過** —— 解析層 100% 書面語 |
| `validate-banks` | ✅ 唔掃 `data/sensei/` |
| `i18n-guard` | ⚠️ 新頁要雙語；記住用 `en ? :` 三元，**唔可以** `[zh,en]` tuple |
| `contrast-guard` | ⚠️ 新 UI 要過對比度 |
| `claims-guard` | ⚠️ **卡片唔可以寫「考評局只接受 X」呢類冇證據嘅聲稱**（原提案犯過） |
| `integration-guard` | ⚠️ 見 2.2 —— 唔接線就 fail |
| `responsive-guard` | ⚠️ 新 UI 要過 375px |

### 2.4 現有測試基線：**49 個測試檔 / 558 passing**，本次應為純新增。

---

## 三、🟢 建議嘅 P0 修訂版

| 原路線圖 | 修訂 |
|---|---|
| P0-1 建立 `sensei_knowledge` **Supabase 表** | → 建立 **`data/sensei/` repo 資料層 + 草稿管線**（零新表） |
| P0-2 persona 各注入 20 張（**真人審核簽名**） | → **產出 80 張草稿**，`reviewer` **留白**，Brian／Yuna 逐張批 |
| P1 Client-side 規則引擎 | ✅ 不變 |
| P1 `/sensei` 頁面 | ✅ 不變 |
| P2 語氣包裝層 | ✅ 不變，**加 §16.B 誠實層 + 測試** |

---

## 四、需要你哋 greenlight 嘅嘢

| # | 項目 | 我建議 |
|---:|---|---|
| 1 | P0-2 改為「草稿 + 真人逐張批，persona 唔簽名」 | ✅ 必須 —— 撞紅線 |
| 2 | P0-1 由 Supabase 表改為 repo 資料層 | ✅ 強烈建議 —— 簽名閘先保得住 |
| 3 | 上面 2.1 新增檔案 + 2.2 **3 個**現有檔案改動 | ⬜ 等 greenlight |
| 4 | 邊 4 科先行（原定 Econ／中／英／數） | ⬜ 確認 |

**未 greenlight 之前，一行功能代碼都唔會寫。**
本報告係 read-only 審計，唯一已寫入嘅係憲章 §16（你哋明文指示嘅）。
