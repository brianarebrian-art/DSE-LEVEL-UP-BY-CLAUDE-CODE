# DSE Level Up v6 Phase 4C SEO／AEO／GEO 與測試設計

- **狀態：** Phase 4C 完成，等待批准進入 Phase 5（Milestone A 另批）
- **日期：** 2026-11-04（Asia/Hong_Kong）
- **前置：** Phase 1–4B；現有 `app/sitemap.ts`、`app/robots.ts`、`public/llms.txt`、`components/Seo/*`、`package.json` scripts、CI SEO smoke
- **方法：** 只做設計。**唔**改 code、**唔**新開大量課題頁、**唔**擴 `llms.txt` 至私人 API。
- **原則：** 公開學習內容可被引用；學生進度、帳號、admin、同步 API **永不**進入 sitemap／`llms.txt`／結構化資料。

---

## 0. 現況與差距（設計起點）

| 已有 | 差距 |
|---|---|
| `sitemap.ts` 只收公開有內容頁；排除 dashboard／practice 外殼／api | 缺系統化「課題 Knowledge Hub」範本同批量課題頁策略 |
| `robots.ts` Disallow `/api/`；metadata noindex 政策 | 要確認 `sw.js`／manifest／`llms.txt` 繼續唔被 auth 誤攔（而家靠副檔名／靜態） |
| 根 layout metadata、JSON-LD、`JsonLd` 元件 | 課題頁要有 Course／LearningResource／FAQ／HowTo 等按頁組合 |
| `public/llms.txt` 公開範圍＋免責 | 要隨 Hub 更新連結；仍禁止私人資料 |
| CI：`verify_responses.py` SEO smoke | 缺正式 e2e／RLS／axe／bundle budget script（要建議最小指令，唔大重構） |
| `/dse-maths`、`/dse-english`、`/dse-physics`、`/notes` | 雙軌「筆記 vs 練習」要喺 Hub 範本寫清 |

---

## 1. DSE Knowledge Hub

### 1.1 資訊架構

```text
/hub                          ← Hub 首頁（或擴 /notes 為入口；路由名待批）
/hub/[subject]                ← 科目總覽
/hub/[subject]/[topic]        ← 課題頁（核心可引用單元）
/subjects/[subject]           ← 既有「去練習」目錄（保留）
/dse-*                        ← 既有 SEO 專頁；逐步收斂到 Hub 或互相 canonical
```

**導航契約**

- Hub 頁主 CTA：「開始呢個課題練習」→ `/practice?subject=&topic=`  
- 次 CTA：「返科目練習目錄」→ `/subjects/[subject]`  
- 禁止把 `/dashboard`、`/result`、`/account` 放進 Hub 主線  

**優先科目（建議首批）**

1. 數學（已有 quadratic 等頁可遷移／對齊）  
2. 英文  
3. 物理  
其餘科：有練習題庫先開 stub（定義＋練習連結），唔准空殼灌水。

### 1.2 課題頁範本（每頁固定區塊）

| 次序 | 區塊 | 要求 |
|---|---|---|
| 1 | 標題（課題名，zh-HK） | 品牌／站名喺 layout；課題 H1 唔蓋過站級品牌策略（跟現有 branded pages） |
| 2 | **一句可引用定義** | ≤ 40 字；answer-first；可被 AI Overview 摘錄 |
| 3 | 考核重點 | 3–7 點；對齊 DSE 範圍；超綱標「不考」或唔寫 |
| 4 | 常見題型 | 連去練習篩選或例題（原創／改寫） |
| 5 | Step-by-step 解法 | 1 條典型題；步驟真實；唔假切 |
| 6 | 常見陷阱 | 對齊錯因：概念／題意／計算／格式／陷阱 |
| 7 | FAQ | 3–5 條；每條問答可獨立引用 |
| 8 | 相關練習 | 深連結 practice；標「免費練習」 |
| 9 | 審核者／來源／更新 | 角色、來源類別、`lastModified`；機檢 ≠ 教師審定（誠實） |

**內容品質閘**

- 過 `term-guard`／`claims-guard`／`copy-guard`  
- 無 HKEAA 原題複製；Archetype Masking  
- 無羞辱式比較文案  
- 數學式有短替代描述（4A）  

### 1.3 MVP vs 延後

| 項目 | MVP（設計後可小步實作） | 延後 |
|---|---|---|
| 範本＋1–3 科示範頁 | 是 | 25 科全覆蓋 |
| 由題庫自動生成全文 | 否（易低質） | 半自動草稿＋人審 |
| 取代所有 `/dse-*` | 否；先 canonical 對齊 | 大規模遷移 |

---

## 2. SEO technical requirements

### 2.1 渲染

- 課題 Hub：**SSR 或 SSG**（優先靜態／ISR 風格，跟現有 Next 16 App Router 慣例；實作前讀 `node_modules/next/dist/docs/`）  
- 個人化頁：維持 noindex（dashboard、result、account、practice 外殼）  
- 練習引擎可 noindex；**內容解釋放 Hub** 先畀爬蟲  

### 2.2 Metadata

每公開頁：

- `title`／`description`（zh-HK；claims-guard）  
- Open Graph／Twitter（現有模式）  
- `canonical` → `https://www.dselevelup.com/...`  
- `robots` 跟 `lib/seoPolicy.ts`  
- `alternates.languages`：至少 `zh-HK`；英文頁 `en`；**唔**假造未有嘅 zh-CN／id／ur 全頁（摘要頁另算）  

### 2.3 Sitemap／robots

- 繼續只用 `app/sitemap.ts`（唔並行 `public/sitemap.xml` 雙來源）  
- Hub 課題頁納入 sitemap；`lastModified` 用內容更新日期  
- `robots.ts`：Disallow `/api/`；允許 `llms.txt`、靜態資產  
- **唔** Disallow `sw.js`／manifest（副檔名已唔經 proxy matcher）  

### 2.4 Semantic HTML／內鏈

- 單一 H1；區塊用 `section`／標題層級  
- Hub ↔ subjects ↔ 相關課題內鏈；避免 orphan  
- 麵包屑：首頁 › 科目 › 課題  

### 2.5 Core Web Vitals（對齊 D3）

| 指標 | 目標 |
|---|---|
| LCP | ≤ 2.5s（入門 Android＋4G） |
| INP | ≤ 200ms |
| CLS | ≤ 0.1 |
| 首頁 JS gzip | ≤ 150KB（S3 預設 blocker，先 baseline） |
| 課題頁 | 唔預載全科題庫；練習 CTA 先 navigation |

### 2.6 zh-HK／香港訊號

- `<html lang="zh-HK">` 預設維持  
- 本地術語、DSE／HKEAA 免責、香港時區內容更新  
- NAP／組織 JSON-LD 用香港聯絡（現有 contact）  

---

## 3. Structured data

按頁組合，唔好一頁塞所有類型。

| 類型 | 用喺 | 備註 |
|---|---|---|
| `Course` | 科目 Hub | provider = DSE Level Up；免費 |
| `LearningResource` | 課題頁 | learningResourceType；inLanguage `zh-HK` |
| `FAQPage` | 課題 FAQ 區 | 同可見 FAQ 一致 |
| `HowTo` | step-by-step 解法 | 步驟同可見文一致 |
| `Article` | 長文方法論／既有文章頁 | 沿用 `ArticleJsonLd` |
| `Person` | 審核角色頁（若有） | 可用角色，慎個人 PII |
| `BreadcrumbList` | Hub 層級 | |
| `Organization` | 根 layout | 已有則對齊 |

驗證：Google Rich Results 測試／Schema 驗證；CI 可抽樣 JSON-LD parse。

---

## 4. AEO／GEO

### 4.1 Answer-first

- 定義句放 H1 後第一段  
- FAQ 問句用學生原話（「點解…」「幾時用…」）  
- 列表可掃描；避免只得長散文  

### 4.2 可被引用資產

- 原創定義、陷阱清單、解法步驟、transparency 數據（題數／撤回——以 transparency 為準）  
- 教師／reviewer **角色**頁：職責同審核標準，唔強制真名  

### 4.3 Freshness

- 課題頁顯示更新日期  
- 題庫 sync／撤回後更新相關 Hub `lastModified`  
- 過期（例如 > 18 個月無覆核）降權或加「待覆核」——唔消失成 404 除非內容錯誤  

### 4.4 `llms.txt`

**准許**

- 站簡介、免責、公開 Hub／科目／transparency／privacy 連結  
- 公開題庫規模（摘要數字）  

**禁止**

- 學生進度、mistakes、API 路徑詳情、admin、service 角色說明、內部 migration  
- 可複製大量原題全文（防刮取過量；維持摘要＋連結）  

更新流程：Hub 合併後同步改 `public/llms.txt`；`claims-guard`／人手過目。

### 4.5 hreflang／繁簡

- 有真英文頁先輸出 `en`  
- 繁簡搜尋：唔自動整站轉簡中；可用搜尋同義／內部詞表（延後）；**唔**用破壞性能嘅即時全頁轉換  

### 4.6 Citation-friendly

- 短段落、明確出處、更新日期、非 HKEAA 聲明固定可見  

---

## 5. Testing plan

每類列目的、範圍、工具、Pass 準則。詳細 case 喺 Phase 6 填 Actual。

### 5.1 Unit

- `recommendNext`、`mergeSnapshots`／未來 op-log、`safeRedirect`、rate limit、錯因映射、checksum helper  
- 指令：`npm test`  

### 5.2 Integration

- `/api/progress` allow-list、consent、delete 狀態機（設計後）、report 驗證  
- 盡量用現有 `lib/__tests__`；新 API 加 failing test 先（要批准）  

### 5.3 E2E

- **而家無** `test:e2e`。建議最小：Playwright 煙測「首頁→科目→練習一題」（另批先加依賴——憲章慎新增套件）  
- 過渡：CI 既有 `scripts/seo/verify_responses.py`＋手動 computerUse／browser  

### 5.4 RLS

- Student A token 讀 Student B mistakes／progress = 0  
- anon 寫 `user_progress` 失敗  
- 0030／新表政策矩陣（4B）  
- 只喺 staging／本地容器；**唔**對生產做攻擊性寫入  

### 5.5 Auth

- 未登入 401 敏感 API  
- admin／founder 拒絕普通學生  
- OAuth callback open redirect 負向  
- 登出清除（D5）  

### 5.6 Abuse

- report／feedback 超限 429  
- practice-count 學校 IP 模擬唔誤封  
- 偽造 `X-Forwarded-For`  

### 5.7 Performance

- bundle gzip 報告（建議加 `qa:budget` 以外嘅 bundle 腳本——另批）  
- Lighthouse CI 抽樣首頁＋一課題頁（另批）  
- 對照 D3  

### 5.8 Accessibility

- axe-core 核心流（首頁、練習、dashboard、Hub）  
- 200% 放大、鍵盤、skip link、`prefers-reduced-motion`  
- 現有 `qa:contrast`、`A11yPanel`  

### 5.9 Content QA

- `npm run qa`（term／posref／validate-banks／i18n／contrast／emoji／claims／copy…）  
- Hub 抽樣：定義、陷阱、免責  

### 5.10 SEO／AEO QA

- sitemap 含 Hub、無私人徑  
- 每頁 canonical／OG  
- JSON-LD 類型正確  
- `llms.txt` 無敏感  
- robots 抽樣  

### 5.11 Security exercises

- Level 1／2／3：跟總 prompt §16；要 P0 事故負責人同 staging  
- Level 1 可先做被動檢查（headers、暴露路徑、example 路由 production 404）  

### 5.12 離線合併／共用 IP／裝置／遷移／成本

| 測試 | Pass |
|---|---|
| 離線合併 | 完成節 union；未完成節 op log 無整節覆蓋 |
| 共用 IP | 誤 block = 0；合理 429 政策 |
| 共用裝置 | 登出後下一位睇唔到上一位進度 |
| 遷移 checksum | 丢失率 0 |
| 成本 breaker | 超帽拒非必要寫；靜態練習仍可用 |

### 5.13 測試 ID 慣例（Phase 6 用）

`T-{AREA}-{NNN}`，例如 `T-RLS-001`、`T-SEO-014`。每案：Purpose、Steps、Expected、Actual、Pass／Fail、Evidence、Severity、Fix link。

---

## 6. Local verification commands

以 [`package.json`](../../package.json) 為準。**優先用現有**；缺嘅只建議、唔擅自大改 CI。

### 6.1 現有（每個 milestone 應跑相關子集）

```bash
npm run dev          # next dev -p 3001 --webpack
npm run build        # next build --webpack
npm run start
npm run lint         # CI 用：npx eslint . --max-warnings=0
npm test             # tsx --test data/questions、lib、components
npm run qa           # 題庫＋i18n＋contrast＋emoji＋claims＋copy 等閘
npm run qa:budget    # US$200 依賴／開支帽
npm run qa:copy
npm run qa:contrast
npm run qa:i18n
npx tsc --noEmit     # 慣例 typecheck（無 npm script；建議保持一條文件化指令）
```

CI 另有：`scripts/seo/verify_responses.py`（production-mode smoke）。

### 6.2 建議新增（要批准先加）

| 建議 script | 用途 | 備註 |
|---|---|---|
| `typecheck` | `tsc --noEmit` | 只加 script 別名 |
| `test:rls` | staging SQL／API 案例 | 需 staging 憑證 |
| `test:a11y` | axe 抽樣 | 慎增依賴；可先 npx |
| `qa:bundle` | 首頁／練習 gzip 預算 | 對齊 D3／S3 |
| `secret:scan` | 擋 PR | Milestone A |
| `test:e2e` | Playwright 煙測 | **憲章新增套件要批准** |

### 6.3 Milestone 完成時建議最少組合

1. `npx tsc --noEmit`  
2. `npx eslint . --max-warnings=0`  
3. `npm test`  
4. `npm run qa`（若觸及文案／題庫／a11y token）  
5. `npm run build`  
6. `npm audit --omit=dev`  
7. secret scan（待加）  
8. 相關專項：RLS／離線／共用 IP／axe／bundle  

---

## 7. 同 Phase 5＋保安演習嘅介面

| Phase 5 Milestone | 4C 測試焦點 |
|---|---|
| A 保安 | Auth、abuse、headers、secret scan、共用 IP |
| B 私隱 | 同意／刪除文案、多語摘要 QA |
| C 內容 | Content QA、provenance SEO |
| D 練習解剖 | a11y 鍵盤、copy-guard |
| E 錯題／路線 | 單元＋合併＋指標事件（另批埋點） |
| F 離線／性能／a11y | bundle、LCP、axe、離線合併 |
| G SEO | Hub、sitemap、JSON-LD、`llms.txt` |

未完成 4C 批准前，唔開始 Milestone 實作（除非你另批 A 提前）。

---

## 8. 開放問題

1. Hub 路由用 `/hub` 還是擴建 `/notes`？  
2. 首批科目是否數學／英文／物理？  
3. 是否批准加 `typecheck` script 別名（唔改工具鏈）？  
4. Playwright e2e 是否允許新依賴？  
5. 英文 Hub 是否同期，定先 zh-HK？  

---

## 9. Phase 4C 完成清單

### 已完成項目

1. Knowledge Hub IA＋課題範本  
2. SEO 技術要求  
3. 結構化資料地圖  
4. AEO／GEO／`llms.txt` 邊界  
5. 測試計劃（單元至保安／離線／成本）  
6. 本地驗證指令（現有＋建議）  

### 產出檔案

- `docs/update-v6/phase-4c-seo-testing-design.md`

### 發現嘅風險

- 無 e2e 框架；煙測靠 SEO script＋手動。  
- 自動生成 Hub 內容易違反「唔求其」。  
- `llms.txt` 若誤加 API 會違保安。  
- Bundle blocker（S3）未 baseline 會卡無關 hotfix——要先量。  

### 未解決問題

- 第 8 節；P0／S1–S5 仍然影響 Phase 5 資料里程碑。  

### 下一 Phase 建議

- **Phase 5 Milestone A：保安地基**（另批「批准進入 Phase 5」或「批准 Milestone A」）。  
- 設計階段（1–4C）已齊；實作必須小步、可回滾。  
- **仍然禁止** production migration，直至 P0 有答。  

### 需要你確認嘅決策

1. Hub 路徑命名  
2. 首批科目  
3. 是否進入 Phase 5／只先 A  
4. 可否加 `typecheck` 別名同 secret scan（唔加新重型框架）  
5. e2e 依賴批准與否  

**Phase 4C 完成，等待批准。**
