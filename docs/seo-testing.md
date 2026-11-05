# Google Search Console 索引排查與驗證指南

本文件記錄針對 Google Search Console 報告的索引問題排查結果、標準規範（Canonical）原則與驗證步驟。

---

## 一、Search Console 常見問題與本站架構修復

### 1. 「這是重複網頁；使用者未選取標準網頁」/「替代頁面 (有適當的標準標記)」
- **根本原因**：
  - 訪客或爬蟲透過非正式網域名稱（例如 `dselevelup.com` 或 `dse-level-up-by-claude-code.vercel.app`）存取，或 URL 結尾斜線（trailing slash）不一致時，若未宣告明確標準標籤，Google 會自行判定標準網址。
  - 部分內部轉址或舊網域直接回傳內容，造成 Googlebot 同時抓取多個主機上的相同頁面。
- **本站防護**：
  - **308 永久重新導向**：在 `proxy.ts` 配合 `lib/site.ts` 的 `canonicalSiteRedirectUrl`，將所有來自 `dselevelup.com`、`dse-level-up-by-claude-code.vercel.app` 的請求以 HTTP 308 永久轉導至 `https://www.dselevelup.com`，避免多網域重複。
  - **全站規範網址 (`rel="canonical"`)**：所有公開靜態與動態路由（涵蓋 25 科科目頁 `/subjects/*`、筆記頁 `/notes/*`、史料庫 `/source-lab/*`、粵語練習 `/cantonese/*`、跨學科 `/off-syllabus/*`）均統一透過 `createSeoMetadata` / `completeSeoMetadata` 產生指向 `https://www.dselevelup.com<path>` 的絕對 canonical 標籤。
  - **根 Layout 隔離**：根 `app/layout.tsx` 刻意不預設 `alternates.canonical: '/'`，避免各子頁誤將首頁繼承為自身之標準網址。

### 2. 「遭到『noindex』標記排除」
- **預期行為**：
  - 僅限私有/工具/草稿頁面（如 `/admin`、`/founder`、`/account`、`/dev/*`、`/practice`、未公開之草稿路由等）設置 `noindex`。
  - 公開內容頁面（如科目清單、單科主頁、筆記、方法學、關於我們、透明度中心等）一律設為 `index: true`。
- **Sitemap 一致性**：
  - `app/sitemap.ts` 透過 `shouldNoIndex` 政策排除所有包含 `noindex` 的路徑，確保 `sitemap.xml` 中收錄的頁面 100% 均為可索引的 200 OK 狀態碼網址。

### 3. 找不到網頁 (404)
- **處理原則**：
  - 移除已不存在或未實作之頁面連結（如曾提議的逐題 URL `/question/{id}`，目前未開設故不收錄於 sitemap，避免爬蟲抓取 404）。
  - 對於不存在的科目或資源 ID（如 `/subjects/not-a-subject`、`/source-lab/not-a-source`），由動態頁面直接調用 `notFound()`，回傳標準 404 響應。

### 4. 社交實體關聯 (Instagram / Threads)
- 在全站 `organizationJsonLd` 及根 layout JSON-LD 中，皆於 `sameAs` 陣列聲明官方社交實體：
  - `https://www.instagram.com/dselevelup`
  - `https://www.threads.com/@dselevelup`
- 協助 Google Knowledge Graph 正確將官方 Instagram 帖文與站點實體相互綁定。

---

## 二、本地與線上驗證流程

### 1. 本地 Sitemap 生成檢查
```bash
npx tsx -e "
import sitemap from './app/sitemap.ts';
const urls = sitemap();
console.log('Total URLs:', urls.length);
"
```
確認所有輸出的網址皆以 `https://www.dselevelup.com` 開頭，且無任何 `noindex` 或死連結。

### 2. 響應與 Canonical 標籤煙霧測試
```bash
python3 scripts/seo/verify_responses.py \
  --origin http://127.0.0.1:3001 \
  --canonical-origin https://www.dselevelup.com \
  --routes docs/seo-verification-routes.json \
  --sitemap --strict --output /tmp/dse-seo-smoke
```

### 3. Google Search Console 線上重新驗證
1. 登入 Google Search Console (https://search.google.com/search-console)。
2. 進入「網頁」索引狀態報告。
3. 點擊「這是重複網頁；使用者未選取標準網頁」項目。
4. 點擊「驗證修復」（Validate Fix），通知 Googlebot 重新檢索已修正的 canonical 標籤。
