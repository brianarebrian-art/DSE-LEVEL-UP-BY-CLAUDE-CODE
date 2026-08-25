# SENSEI 知識卡片庫 —— 生產紀律

零模型版 SENSEI 的內容層。學生提問時系統**檢索**一張已簽署的卡片，**不生成**任何新內容。

## 為何放在 repo 而非 Supabase

強制簽名的閘在 git，不在資料庫。`scripts/qbank/_reviewer-gate.mjs` 會在沒有真人姓名時
`exit(1)`，一行都入不了庫；一句 `INSERT` 卻可以繞過所有檢查，而且沒有 commit author、
沒有 diff、無法 `git blame`。卡片庫的全部價值在於「每張卡有真人簽名」，所以簽名鏈
必須在版本控制之內。

附帶好處：逐科動態 `import()`，離線即時開啟，零 egress 成本，舊 Android 不受影響。

## 流程

```
data/sensei/<科>/drafts/<批次>.json          ← 出草稿（虛擬 persona 只做到這一步）
  ↓ node scripts/qbank/review-sensei-cards.mjs --in <草稿>
  ↓   機器客觀閘：格式、四段式齊備、長度、重複、strict schema
  ↓   產生 <批次>.decisions.json，reviewer 留白、全部 pending
  ↓ 真人逐張改成 "approved" / "rejected"，並在 _meta.reviewer 填真名
  ↓ node scripts/qbank/promote-sensei-cards.mjs --in <草稿>
  ↓   簽名閘：留白或虛擬 persona 一律停機
  ↓   default-deny：不是 "approved" 一律不要
  ↓ data/sensei/<科>/reviewed/<批次>.ts
  ↓ 【人手】在 data/sensei/<科>/index.ts 加 import
  ↓ npm test
```

**機器永不自動入庫**（憲章 §12）。最後一步刻意保留為人手操作。

## 卡片格式

四段式：`concept`【概念】→ `example`【例子】→ `examTechnique`【考試技巧】→ `commonTrap`【常見陷阱】。
每段 10–300 字。範本見 `economics/drafts/_demo.json`。

⚠️ **卡片沒有任何分數欄位，亦不可加入**（憲章 §16.A）。
`_card-gate.mjs` 的 `STRICT_KEYS` 是白名單：任何 `score` / `marks` / `markingCriteria`
之類的欄位都會被攔，並有測試鎖住。卡片可以**講解**評分準則，不可以**輸出**分數。

## 簽名權

只有真人（Brian／Yuna 或真人代號）可以簽。Carson、Amity、Victor、Arthur 等是
skill persona，`_reviewer-gate.mjs` 會攔截。**這不是疏忽，不要「順手補上」。**
