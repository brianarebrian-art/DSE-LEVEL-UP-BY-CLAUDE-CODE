# 全站合規認證報告 — 2026-07-11（full_site_audit）

**結論：🟢 全站 0 未解決錯誤 — 通過合規認證。**

| 專家檢查 | 範圍 | 結果 |
|---------|------|------|
| Kelly（格式） | 7 個參數化 bank（1,735 題）＋ 全部 TS bank 經 `next build` 類型檢查 | ✅ validate-banks 全過；build 綠 |
| Oscar（語言） | data/questions/ ＋ content/ 全文件 | ✅ term-guard 全過（術語＋書面語）；純漢字簡體掃描零檢出 |
| Luna（版權/聲明） | content/ 對外文件 14 份 ＋ 全站 Footer | ✅ 14/14 附 Not-affiliated 免責；Footer 經 layout 全站注入（瀏覽器實證） |
| Emma（情緒） | content/ ＋ UI 文案 | ✅ 負面/責備字眼零檢出（本次審核中軟化 faq 一句「冇用」→「事倍功半」，1 項自動修正） |
| Eric（安全） | next.config CSP/HSTS 等 6 項 header；proxy.ts rate limit | ✅ 全部在位（詳見 docs/security_audit.md，含誠實限制清單） |
| Benjamin（$0） | package.json 依賴掃描 | ✅ 無未審批付費 SDK（@anthropic-ai/sdk 為已審批例外） |

## 本次審核期間的自動修正（auto_fixes）

1. `content/community/faq.md`：「操幾多都冇用」→「操極都事倍功半」（Emma 情緒規則）
2. `data/questions/economics.ts`（econ batch 初稿）：「搞反」→「弄反」（Oscar 俗語規則，term-guard 捕獲）

## 人工隊列（manual_queue）

無。

## 覆核方式

任何改動後執行 `node scripts/meta-loop.mjs` 重新認證（gate 全綠＝合規）。
