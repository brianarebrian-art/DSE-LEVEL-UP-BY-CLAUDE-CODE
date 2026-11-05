# 題目錯誤反映系統 — Phase 6：UI／通知／共融黑名單／共用 IP

> **狀態：** 舉報文案、匿名成功回饋、共融詞庫、共用 IP 限流測試已入 repo。  
> **日期：** 2026-11-05（Asia/Hong_Kong）  
> **繼承：** phase-1…5；四決策（無冷門豁免、L1 24h、**匿名舉報**、唔標「AI生成替換」）

---

## 0. 本 Phase 交付

| 路徑 | 用途 |
|---|---|
| [`components/ReportQuestionButton.tsx`](../../components/ReportQuestionButton.tsx) | 觸發「覺得有錯？一按即查」；成功「已收到，{科目\|分科}助教查緊」＋匿名說明 |
| [`lib/inclusiveFilter.ts`](../../lib/inclusiveFilter.ts) | 客戶端共融掃描（電郵詳情警告；**唔**入 API／§16.E） |
| [`lib/__tests__/inclusive-filter.test.mts`](../../lib/__tests__/inclusive-filter.test.mts) | 肥老／fei lou／hak gwai 擋；失敗率／同志／黑板 放行 |
| [`lib/__tests__/rate-limit.test.mts`](../../lib/__tests__/rate-limit.test.mts) | 學校 NAT 約 500 次練習流量；report 窄桶 429 非 ban |
| 本檔 | 驗收說明 |

**Phase 6 完成，等待批准。**

---

## 1. UI 文案（對齊 prompt §6＋決策 3／4）

| 位置 | 文案 |
|---|---|
| 觸發掣 | 「覺得有錯？一按即查」／`Think it is wrong? Tap to check` |
| 送出成功 | 「已收到，{科目}助教查緊」；無 `subjectLabel` 時用「分科助教」 |
| 匿名說明 | 修好**唔會**私人通知；下架見透明度頁 |
| Provenance | 維持「經自動檢查」；**禁止**「AI生成替換」 |

可選 prop：`subjectLabel` — 練習頁有科名時傳入，對齊 prompt 嘅 `{科目}助教`。

---

## 2. 「修復後通知」點解唔做

上傳 prompt 寫：

> 修復後：通知「多謝你，你舉報啱咗…」

創辦人決策 **3＝匿名舉報**（無 `reporter_id`、API 唔記帳戶／IP）。  
因此**無收件人**可推送；Phase 6 改為成功回饋內誠實講明，並指去 `/transparency`。  
若日後改「可選登入追蹤」，先要改 schema／§16.E 決策，唔喺本 Phase 偷加。

---

## 3. 共融黑名單

- **擋：** `肥老`、`衰L`／全形、`fei lou`、`hak gwai`、`黑鬼`（NFKC＋小寫）
- **放：** `失敗率`、`放下執念`、`同志`、`黑板`（同句有擋詞仍會擋）
- **範圍：** 只警告電郵詳情框；「送出」只傳題號＋類別，**不受**詞庫影響

---

## 4. 共用 IP（學校 NAT）

| 路徑 class | 窗口 | 上限 | 用意 |
|---|---|---|---|
| `sync` | 1 min | 120 | 練習／進度唔因 NAT 互掐 |
| `count` | 10 min | 120 | 一班齊做完 |
| `report` | 10 min | 10 | 防刷舉報；429 唔 ban |
| （無） | — | — | **無 IP 黑名單** |

測試模擬同 IP 10 分鐘內 500 次交錯 sync／count／report：練習流量大多通過；report 窄桶仍會 429。

誠實限制：Vercel 每 instance 各自 Map（見 `lib/rateLimit.ts` 檔頭）；真正分散式限流靠 Firewall。

---

## 5. 驗收清單

- [x] 觸發文案「覺得有錯？一按即查」
- [x] 成功回饋「已收到，…助教查緊」
- [x] 匿名：無修復推送；UI 講明
- [x] 唔出現「AI生成替換」
- [x] 黑名單：失敗率／同志放行；肥老擋
- [x] 共用 IP：500 練習向流量測試；report 429 非 ban
- [ ] （營運）練習頁傳入 `subjectLabel`（可選跟進）
- [ ] （營運）0034 migration apply — 唔屬本 Phase UI

---

## 6. 下一 Phase

本系列 Phase 1–6 代碼路徑已齊。後續若再開工：apply 0034、接 live bot VM、練習頁 `subjectLabel`、透明度頁展示 withdraw／replacement 狀態。
