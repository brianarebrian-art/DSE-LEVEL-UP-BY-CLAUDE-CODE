# DSE Level Up — Pre-commit Verification

所有變更在提交前，必須完成以下驗證。只有全部項目通過，才可執行 `git commit` 及推送至共享分支。

## 1. 功能驗證

- 確認核心邏輯、題庫載入、練習流程、路由及導航正常。
- 檢查所有受影響 routes 是否可正常存取及導航。
- 目前基準：94 條 routes 均運作正常。

## 2. 測試執行

```bash
npm test
```

- 全部單元測試與整合測試必須通過。
- 目前基準：1,455 passed、0 failed。

## 3. 程式碼質素

```bash
npm run typecheck
npm run qa
```

- `typecheck` 必須零錯誤。
- `qa` 必須全部通過，包括：

  - `term-guard`
  - `check-posref`
  - `validate-banks`
  - `i18n-guard`
  - `contrast-guard`
  - `emoji-guard`
  - `claims-guard`
  - `integration-guard`
  - `responsive-guard`
  - `barrel-guard`
  - `copy-guard`
  - `token-doc`
  - `guard-nav`

## 4. 題庫與資料正確性

- 題庫須通過參數化驗證。
- 題目難度光譜須符合規範。
- 目前基準：9,183 題驗證通過。

## 5. 用戶體驗

- 確認 375px 流動裝置視窗沒有爆版或水平捲動問題。
- 確認文字與背景對比度符合可讀性要求。
- 由 `responsive-guard` 及 `contrast-guard` 把關。

## 6. 安全與私隱

```bash
npm run secret:scan
npm audit --omit=dev --audit-level=high
```

- 不得提交 API keys、憑證、用戶資料、測試帳戶或其他敏感資訊。
- 生產依賴不得存在 high 或 critical 安全漏洞。
- 目前基準：secret scan 通過；audit 零 high/critical 漏洞。

## 7. 文件與變更範圍

- 如修改資料結構、部署流程、環境變數或公開 API，必須同步更新相關文件。
- 如無相關變更，可在 PR 描述中註明「No documentation changes required」。

## 8. 建置與煙霧測試

```bash
npm run build
```

- 生產建置必須成功。
- 建議於本地啟動生產伺服器後，檢查主要頁面及 sitemap。
- 目前基準：339 個頁面與 sitemap 檢查均為 0 錯誤。

## 提交前最後檢查

```bash
git status
```

- 確認 working tree clean，或只包含本次變更相關檔案。
- 確認 commit message 清楚描述變更目的、範圍及影響。
- 任何檢查失敗時，不得提交；應先修正問題後重新執行完整驗證。
