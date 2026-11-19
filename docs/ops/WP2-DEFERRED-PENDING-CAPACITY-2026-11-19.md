# 工作包 2：暫緩（容量閘門未過）

狀態：**未開始／受阻（等創辦人開 WP2）** · 2026-11-19（Asia/Hong_Kong）

## 點解未交完整改善計劃

工作包 1 Batch 1–3 **已批准並已刪除**（158／158）；正式站 smoke 通過。  
Dashboard：**Functions Storage = 9.54 GB**（已確認讀數；相對免費 ~10 GB 仍緊；3x 至 Dec 19）。見 [`FUNCTIONS-STORAGE-RELEASE-2026-11-19.md`](./FUNCTIONS-STORAGE-RELEASE-2026-11-19.md)。  
按指令：未獲明示前唔大規模實作／唔為 WP2 新增部署驗證。

依賴：

1. ~~批准~~ [`FUNCTIONS-STORAGE-APPROVAL-2026-11-19.md`](./FUNCTIONS-STORAGE-APPROVAL-2026-11-19.md)  
2. ~~執行刪除~~  
3. ~~Dashboard 讀數~~（9.54 GB）＋~~正式站 smoke~~  
4. **創辦人明示開 WP2**（或先批下一輪刪除，例如 `confirm_E`）

## 清理通過後 WP2 會涵蓋（預告，非正式計劃）

基於現況盤點（合理假設，待 WP2 正式核實）：

- 內容模型：題庫正本 `data/questions/`；筆記係聚合（[`lib/notes/notes.ts`](../../lib/notes/notes.ts)），**未**有完整自學筆記／PDF 引擎  
- P0／P1：安全、核心練習流、手機、成本（`proxy.ts` CSP／Fluid CPU、preview 增長）  
- 垂直切片：先一科一課題完整筆記→練習→（若批准）PDF／QR  
- 憲章約束：永久免費、US$200 成本死鎖、零版權侵犯、唔擅自加付費 API  

**正式 WP2 計劃會另開一次批准**，先唔實作。
