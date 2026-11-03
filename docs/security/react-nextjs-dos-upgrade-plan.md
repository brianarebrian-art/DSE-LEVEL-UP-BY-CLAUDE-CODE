# React／Next.js DoS 升級準備計劃

## Current resolved versions

以 `package.json` 及 `package-lock.json` 為準：

- `next`: `16.4.2`
- `react`: `19.2.4`
- `react-dom`: `19.2.4`
- `react-server-dom-webpack`: 未直接宣告／未見 lockfile entry
- `react-server-dom-turbopack`: 未直接宣告／未見 lockfile entry
- `react-server-dom-parcel`: 未直接宣告／未見 lockfile entry

`node_modules` 未安裝；以上不是 installed-tree 證據。

## Target versions

- `react`、`react-dom`: `>=19.2.6`，保持 matching versions。
- `next`: 保持 `>=16.4.1`；目前 `16.4.2` 已符合 supplied advisory range 外要求，是否升級由 hotfix validation 決定。
- 如 resolved graph 出現任何 `react-server-dom-*`，必須確認 `>=19.2.6`。

## Upgrade commands（獲批准後才可執行）

```bash
npm install next@latest react@19.2.6 react-dom@19.2.6
npm ls next react react-dom react-server-dom-webpack react-server-dom-turbopack react-server-dom-parcel --all
npm ci
```

實際版本應以批准時 advisory fixed version、相容性及 lockfile resolution 為準；本文件建立階段不可執行以上 command。

## Expected lockfile changes

- `package.json` React package declarations 可能由 `19.2.4` 變為 `19.2.6` 或更高 patched version。
- `package-lock.json` root dependency 及 resolved React runtime integrity/version entries 會更新。
- 不應加入無關 dependency；任何 `react-server-dom-*` 新 entry 必須記錄來源及版本。

## Compatibility risks

- React runtime 與 `react-dom` 不 matching。
- Next.js 16.4.x、Webpack bundler、Sentry wrapper、Server Actions 行為變化。
- lockfile transitive graph、TypeScript type、SSR/RSC serialization、cache 或 deployment output 改變。
- Supabase auth、founder batch preview/confirmation、origin checks 及 service worker smoke path 回歸。

## Required regression tests

- `npm ci` 後 `npm ls` 無 supplied affected versions。
- `npm run lint`、`npm run build`、`npm run test`、`npm run qa`、`npm run typecheck`（若 script 存在）。
- Founder batch preview/confirmation、authorization、origin checks、關鍵 read-only 學生流程。
- Sentry error ingestion、security headers、health check。

## DoS regression test plan

只可於 staging／preview，以 synthetic payload、固定低 concurrency、明確 stop condition 執行；不可對 production 攻擊。詳細步驟見 `react-nextjs-dos-regression-test.md`。

## Staging verification steps

1. 建立 unpatched preview 與 patched preview，隔離資料及環境變數。
2. 記錄兩者 baseline CPU、latency、5xx、health-check。
3. 先跑 smoke tests，再跑受控 synthetic payload test；每個階段保留 deployment、commit、時間及 metrics。
4. 比較 resource ceiling、recovery time、429/413/WAF events 及正常流量成功率。
5. 任何 fail criteria 觸發 stop、rollback、incident note，不可推送 production。

## Rollback plan

停止 promotion；回到最後已驗證 patched deployment。只 revert hotfix commit／lockfile change，不 reset unrelated commits。若舊 artifact 仍 affected，禁止回滾至該 artifact，改用已驗證 patched artifact 或保持 action disabled。

## Approval gates

1. Security owner 確認 advisory fixed versions。
2. Engineering owner 確認 compatibility／lockfile diff。
3. Staging DoS regression pass，並由 SRE 確認 alerts。
4. Product/data owner 確認無學生資料、schema 或業務邏輯改動。
5. Incident commander 批准 promotion；production rollback window、communication owner 及 evidence location 已指定。
