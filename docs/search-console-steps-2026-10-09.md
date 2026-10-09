# 新網址上線後要由創辦人親自做的設定（2026-10-09）

對應創辦人回覆 59a（先試登入）及 60a（Claude 寫步驟，創辦人用自己的 Google 帳戶做）。
以下每一步都要登入創辦人自己的帳戶，Claude 不會、亦不可以代為登入。

---

## 第一部分：試 Google 登入（59a）

1. 用手機或電腦打開 https://www.dselevelup.com
2. 按右上角「登入」，揀 Google 帳戶。
3. 登入後回到網站，右上角應見到自己的頭像或名字。

**成功：** 告訴 Claude「登入得」即可。

**失敗**（例如見到 `redirect_uri_mismatch`、登入後又變返未登入、或者出錯頁）：
告訴 Claude 見到甚麼字，然後照以下三步改（2026-10-09 唯讀檢查發現：網站設定仍指向舊網址
`dse-level-up-by-claude-code.vercel.app`，這是最可能的原因）：

1. **Google Cloud Console**（https://console.cloud.google.com）→ 左邊選單「API 和服務」→「憑證」
   → 按網站用的那個「OAuth 2.0 用戶端 ID」：
   - 「已授權的 JavaScript 來源」加一行：`https://www.dselevelup.com`
   - 「已授權的重新導向 URI」加一行：`https://www.dselevelup.com/api/auth/callback/google`
   - 舊的兩行**不要刪**，按「儲存」。
2. **Vercel**（https://vercel.com）→ 網站項目 → Settings → Environment Variables：
   找到 `AUTH_URL`（如沒有，找 `NEXTAUTH_URL`），把值改為 `https://www.dselevelup.com`，儲存。
   （Client secret 等其他值不要改，亦不要貼給任何人。）
3. Vercel → Deployments → 最新一個 → 右邊「⋯」→ Redeploy。完成後再試一次登入。

---

## 第二部分：Google Search Console（60a）

Search Console 是 Google 的免費工具，用來告訴 Google「這個網站是我的」，並查看網站在 Google 搜尋的表現。

### 甲、證明網站是你的（約 10 分鐘，生效可能要等數小時）

1. 打開 https://search.google.com/search-console ，用創辦人的 Google 帳戶登入。
2. 按左上角「新增資源」→ 揀左邊的 **「網域」**（不是右邊的「網址前置字元」）→ 輸入 `dselevelup.com` → 繼續。
3. Google 會顯示一串以 `google-site-verification=` 開頭的文字，按「複製」。**先不要關這個視窗。**
4. 另開一頁去 https://vercel.com → 上方「Domains」→ 按 `dselevelup.com` → 「DNS Records」
   （2026-10-09 查核：這個網域的 DNS 由 Vercel 管理，所以在 Vercel 加）。
5. 新增一條紀錄：
   - Name：留空（或填 `@`）
   - Type：`TXT`
   - Value：貼上第 3 步複製的文字
   - 按「Add」。
6. 回到 Search Console 那個視窗，按「驗證」。
   如果話未找到，不用擔心，等一兩個小時再按一次「驗證」。

### 乙、交網站地圖（驗證成功後，約 2 分鐘）

1. Search Console 左邊選單 →「Sitemap」。
2. 輸入 `https://www.dselevelup.com/sitemap.xml` → 按「提交」。
3. 狀態顯示「成功」即可。之後 Google 會自己定期再讀，不用重複提交。

### 丙、請 Google 盡快更新首頁標題（約 2 分鐘）

1. Search Console 最上方的搜尋欄，輸入 `https://www.dselevelup.com/` → Enter。
2. 等它檢查完，按「要求建立索引」。
3. 新標題「DSE Level Up | DSE 溫習平台 | 掌握 DSE 核心邏輯」通常數日至數星期內出現在 Google。
   注意：Google 有時會自行改寫搜尋結果的標題，這不是我們可以控制的。

### 丁、不需要做的事

- **「網址變更」工具不用做。** 舊網址已經用永久轉址（308）自動轉到新網址，Google 會自己跟著轉。
  而且這個工具要求舊網址也要證明是你的，`vercel.app` 這個網域不屬於我們，做不到。
- 不需要付費，不需要安裝任何東西。

### 戊、可選：Bing（約 5 分鐘）

部分 AI 搜尋工具（例如 ChatGPT 的搜尋）會用 Bing 的資料，所以值得加。

1. 打開 https://www.bing.com/webmasters ，用同一個 Google 帳戶登入。
2. 揀「從 Google Search Console 匯入」，跟指示授權。匯入後網站和網站地圖會自動加好。

---

## 第三部分：2026-10-09 開頁速度量度（PageSpeed Insights，唯讀）

量度網址：https://www.dselevelup.com/ （當時線上版本為 PR #85 合併後的版本）

| | 效能 | 無障礙 | 最佳做法 | SEO | AI 代理瀏覽 |
|---|---|---|---|---|---|
| 手機（模擬慢速 4G） | 91 | 100 | 100 | 100 | 2/3 |
| 電腦 | 100 | 100 | 100 | 100 | 2/3 |

- 手機：首次顯示內容 1.0 秒、最大內容顯示 3.2 秒、版面跳動 0。
- 「真實用戶數據」顯示「沒有資料」：Google 要累積足夠訪客數據才會顯示，不是錯誤。
- 「AI 代理瀏覽」扣分原因：`llms.txt` 沒有連結格式。已於同日改好（`public/llms.txt`「Main sections」改為連結），
  要合併部署後才會反映。
- 手機版可再改善的地方（未處理，不影響使用）：阻擋顯示的檔案約 0.3 秒、未用到的 JavaScript 約 49 KiB。
