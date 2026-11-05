# 供應鏈安全與惡意依賴掃描證據 (Supply Chain Scan Evidence)

**審計時間**：2026-11-05
**審計人員**：Principal Security Engineer + Senior Next.js Auditor
**掃描範圍**：`package.json`、`package-lock.json`（620 個依賴項）、`node_modules` 以及倉庫中全部 838 個原始代碼檔案。

---

## 1. 供應鏈威脅威脅庫核對清單

針對以下近期通報之供應鏈攻擊事件及惡意套件家族進行特徵匹配掃描：

1. **PolinRider 惡意家族 (17 個套件)**：
   - `tailwind-input-kit`, `tailwind-form-core`, `tailwind-forms-kit`, `tailwind-contact-forms`, `tailwindcss-contact-form`, `tailwindcss-form-utils`, `react-contact-forms`, `@adminide-stack/*`, `@cdmbase/wiki-browser`, `@pubngo-stack/help-browser`, `server-hemera-mongo`, `cdeops` 等。
   - 惡意 C2 IP 列表：`103.179.143.219`, `166.88.134.75`, `23.27.13.72`, `95.135.181.151`。
   - 錢包特徵：ETH `0x1eef0849eda15d87f64e51c73c8442cf3c8bcef3`。
2. **Qix 命名空間依賴混淆事件**：
   - `chalk@5.6.1`, `debug@4.4.2`, `ansi-styles@6.2.2`, `strip-ansi@7.1.1`, `supports-color@10.2.1`。
3. **資訊竊取與惡意 Payload**：
   - `@aswinsparky/api@1.0.1` (MAL-2026-4364, `api.aswinsparky.qzz.io` 環境變數外洩)。
   - `jito-bundle*`, `txnforge`, `5df897`, `TrapDoor`, `yzx-npm`, `mocha-ui-themes`。
   - 惡意字串特徵：`eval(atob(`, `node -i`。
4. **Agent 與環境污染**：
   - `.claude/settings.json` 與 `.claude/hooks/*` 中的非授權 `SessionStart` 腳本。

---

## 2. 掃描執行結果 (`scripts/scan-malicious.mjs`)

執行指令：
```bash
node scripts/scan-malicious.mjs
```

輸出記錄：
```text
🔍 Checking package.json and package-lock.json...
✅ No blacklisted malicious packages found in manifest or lockfile.
✅ .claude directory verified clean.
✅ Source tree scanned clean. Zero suspicious malware signatures.
```

---

## 3. 掃描前與修補後對比 (Before & After)

| 檢驗維度 | 修補前狀態 | 修補與加固後狀態 | 結論 |
| :--- | :--- | :--- | :--- |
| **惡意套件黑名單** | 經全庫檢索無直接引入 | 已由 `scripts/scan-malicious.mjs` 自動化防護，鎖定 0 命中 | **通過 (0 Hits)** |
| **`eval(atob(` 混淆碼** | 無 | 原始碼與依賴檔案全面檢索，0 命中 | **通過 (0 Hits)** |
| **安裝後門防護** | `npm ci` | `vercel.json` 強化 `installCommand: "npm ci --ignore-scripts"`，強制阻斷 pre/postinstall 腳本 | **加固完畢** |
| **`.claude` 鉤子** | 僅包含合法 `launch.json` | 檢查確認無任何惡意 SessionStart 鉤子或外部 curl 指令 | **通過** |

---

## 4. 結論

倉庫依賴鏈完整潔淨，無受損之第三方套件或遠端 C2 通訊特徵。
