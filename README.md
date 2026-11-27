# DSE Level Up

> 香港 DSE 學生的免費溫習平台。／面向香港 DSE 考生的免费学习平台。／A free study platform for Hong Kong DSE students.
>
> 網站 / 网站 / Website: [dselevelup.com](https://www.dselevelup.com/)

本 README 以 `<details>` 分開三種語言；內容一一對應。The language sections below are equivalent.

<details open>
<summary>繁體中文（香港）</summary>

## 專案簡介

DSE Level Up 是一個為香港中學文憑試（DSE）考生而設的免費溫習平台，協助中四至中六學生以短題練習判斷及常見陷阱、檢視學習進度，並透過解析備試。平台不是整卷模擬考。毋須登入即可開始練習；可選 Google 登入只用於跨裝置同步，不會解鎖付費內容。平台不隸屬香港考試及評核局（HKEAA），亦不保證考試成績。

平台永久免費、無廣告、無付費層或付費牆。已登入用戶可無限練習。未登入用戶目前每部裝置可完成一節試用練習，之後需登入才可繼續。此限制與 Source of Truth（2026-11-10 核實）所載「無限題數／不需登入」有差異；較新的專案憲章（2026-11-20）記錄了訪客試用限制。本 README 保留此差異，不將「免費」誤述為訪客無限制；請以最新官網介面及憲章為準。

## 主要功能

以下為 Source of Truth 截至 2026-11-10 所記錄的公開功能；題庫數字為 2026-11-06 核實的快照，會隨題庫變更。詳情參閱[首頁](https://www.dselevelup.com/)、[網站介紹](https://www.dselevelup.com/about)、[科目頁](https://www.dselevelup.com/subjects)、[透明度頁](https://www.dselevelup.com/transparency)、[方法論](https://www.dselevelup.com/methodology)、[信任中心](https://www.dselevelup.com/trust)及[llms.txt](https://www.dselevelup.com/llms.txt)。最新題數請查看[透明度頁](https://www.dselevelup.com/transparency)。

- 25 個 HKDSE 甲類科目（M1、M2 分開計）；當時有 26,419 道練習中題目：25,358 道選擇題及 1,061 道書寫題。
- 短題選擇題練習及解析；一節約 10 題、約 15 分鐘。答錯後先提供第一步提示。
- 書寫題參考答案自評；不由機器批改，亦不計入準確率或練習表現估算。
- 練習結果及進度；可選 Google 登入同步進度。部分本機資料（包括收藏、寫作草稿等）不會同步。
- 可列印練習套及答題紙 paper code。
- 無障礙及舒適設定，包括閱讀尺、易讀字體、字級／行距／字距；另有呼吸空間及時間囊工具。
- 題目回報、匿名意見頁 `/feedback`，以及透明度、信任中心、方法論和學生安全資訊。
- 平台沒有用戶對用戶私訊、留言或按讚功能。

題目由校友與 AI 協作編寫；AI 可協助起草及分類，內容經自動檢查後發布，尚未全部經註冊教師逐題審定。網站會標示覆核狀態，發現錯誤可回報，團隊會按情況修正或收起題目。題目是原創平行改寫，並非 HKEAA 官方試題。

## 產品規格及審核文件

- [產品規格](./docs/PRODUCT_SPEC.md)：現有 MVP 使用者流程、邊界和下一個證據門檻。
- [研究摘要](./docs/RESEARCH.md)：HKEAA 框架、考試報告及同類平台桌面研究；不是用戶調查。
- [假設及待驗證問題](./docs/ASSUMPTIONS.md)：區分創辦人決定、產品假設及尚未證實的需求。
- [題目編寫與難度校準標準](./docs/QUESTION_STANDARD.md)：內容覆核、版權來源及「低 10 個百分點」所需證據。
- [資料模型及邊界](./docs/DATA_MODEL.md)：現行題型、同步白名單和未批准的校準資料提案。
- [測試計劃](./docs/TEST_PLAN.md)、[校準試點路線圖](./docs/ROADMAP.md)、[部署清單](./docs/DEPLOYMENT.md)、[決策記錄](./docs/DECISIONS.md)、[變更記錄](./docs/CHANGELOG.md)。

## 快速開始

### 使用網站

1. 前往 [dselevelup.com](https://www.dselevelup.com/)。
2. 選擇科目並開始練習；登入並非開始使用的必要條件。
3. 如需跨裝置同步，使用網站提供的 Google 登入。
4. 使用網站內的題目回報入口，或電郵 [dselevelup@gmail.com](mailto:dselevelup@gmail.com) 聯絡團隊。

### 本機開發

需求：Node.js `26.x`（見 `package.json`）、npm，以及 Git。

```bash
git clone https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE.git
cd DSE-LEVEL-UP-BY-CLAUDE-CODE
npm ci
npm run dev
```

開啟 `http://localhost:3001`。若要使用 Google 登入或雲端同步，請複製 `.env.example` 為 `.env.local`，並在本機或部署環境填入所需的 Supabase 設定；按 `.env.example` 與相關程式碼確認各變數用途。沒有 Supabase 設定時，請勿假設登入或雲端同步可用。任何 server-only key 都不可使用 `NEXT_PUBLIC_` 前綴，亦不可提交至 Git。

不需要資料庫遷移即可啟動一般本機開發。涉及資料庫結構的工作，請遵循 `supabase/migrations/`、`CONTRIBUTING.md` 及維護者審批流程；不要自行把遷移套用至正式環境。

### 測試及檢查

```bash
npm test
npm run typecheck
npm run lint
npm run qa
npm run secret:scan
```

提交前及建置檢查請參閱 [`docs/PRE_COMMIT_VERIFICATION.md`](./docs/PRE_COMMIT_VERIFICATION.md)。正式建置可用：

```bash
npm run build
```

## 技術棧 / Technology Stack

| 範疇 | 已確認技術 |
| --- | --- |
| 前端與應用框架 | Next.js 16.4.6（App Router）、React 19.3.1、TypeScript（版本以 `package.json` 為準） |
| 樣式 | Tailwind CSS 4 |
| 後端及 API | Next.js Route Handlers／伺服器端程式 |
| 資料庫與身份驗證 | Supabase PostgreSQL、Supabase Auth（Google OAuth）、`@supabase/ssr` |
| 部署 | Vercel |
| 錯誤監察及效能 | Sentry、Vercel Web Analytics、Vercel Speed Insights（以網站正式私隱政策所述為準） |
| 測試與程式碼檢查 | Node.js test runner（由 `tsx` 執行）、TypeScript、ESLint、自訂 QA scripts |
| 套件管理 | npm，使用 `package-lock.json` |

公開高層次技術棧有助安全研究人員理解系統組成及可能的攻擊面，並透過指定私人渠道負責任地回報問題；這不代表授權測試。公開文件不得包含 API 金鑰、資料庫連線字串、秘密金鑰、內部網址、管理後台網址或其他敏感設定。環境變數名稱應以 `.env.example` 和程式碼為準，切勿公開其真實值。

## 私隱與資料安全

- 未登入時，練習資料留在瀏覽器端，不會同步至帳戶；登入後，Supabase 會以帳戶識別碼同步指定的練習進度及設定。可同步的資料包括練習分數、未完成練習、錯題紀錄及（用戶選擇啟用時）無障礙設定。收藏、寫作草稿等部分資料仍只留在裝置。
- 題目回報、練習後意見及 `/feedback` 匿名意見用於改善題目與服務；Source of Truth 記錄匿名意見不收集帳戶、電郵或 IP。另有每日練習總數、Vercel 匿名整體流量／效能統計，以及 Sentry 錯誤監察。網站由 Vercel 託管，帳戶同步資料由 Supabase（PostgreSQL）處理；Google 登入亦受 Google 私隱政策規管。平台表示不出售資料，亦不向第三方分享資料作營銷。
- 帳戶同步資料在帳戶使用期間保留，沒有固定到期日；用戶可在 `/account` 刪除帳戶資料。只存在裝置上的資料可透過清除瀏覽器資料移除。各供應商統計及錯誤記錄的保存期限，請參閱[正式私隱政策](https://www.dselevelup.com/privacy)及相關供應商政策；README 未另行承諾期限。用戶可電郵要求查閱或更正資料。
- 請勿在程式碼、文件、截圖或 issue 中加入真實用戶資料、密碼、token、API key、連線字串或內部基礎設施資訊。

## 安全漏洞回報

請勿在公開 Issue、Pull Request 或其他公開地方披露未修復漏洞。請先閱讀 [`SECURITY.md`](./SECURITY.md)，並以私人方式電郵至 [dselevelup@gmail.com](mailto:dselevelup@gmail.com)。未經書面授權，不得進行破壞性測試、服務阻斷、社交工程、未授權存取或影響真實用戶的測試。發現疑似敏感資料時，請勿複製或轉發；通知維護者作安全處理。

## 貢獻及社群

- 貢獻流程：[`CONTRIBUTING.md`](./CONTRIBUTING.md)
- 社群行為準則：[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- 問題回報：使用 GitHub Issue 表單；安全問題請勿使用公開 Issue。
- 題目／內容問題：使用 GitHub 的 Question / content issue form，避免貼出完整受版權保護的官方試題。

## 授權、免責及聯絡

程式碼、文件及題庫並非採用一般開源授權；請參閱 [`LICENSE`](./LICENSE)。未經書面許可，不得重新發布題庫、練習內容或品牌作其他產品。平台並非 HKEAA 官方網站；練習表現只供參考，考試結果以 HKEAA 公布為準。

維護者／一般聯絡： [dselevelup@gmail.com](mailto:dselevelup@gmail.com)。支援和資料查詢請以網站內聯絡方式及私隱政策為準。社群帳號： [Instagram @dselevelup](https://www.instagram.com/dselevelup) · [Threads @dselevelup](https://www.threads.com/@dselevelup)。

</details>

<details>
<summary>简体中文</summary>

## 项目简介

DSE Level Up 是一个面向香港中学文凭考试（DSE）考生的免费学习平台，帮助中四至中六学生通过短题练习判断力和常见陷阱、查看学习进度，并通过解析备考。平台不是整卷模拟考试。无需登录即可开始练习；可选 Google 登录仅用于跨设备同步，不会解锁付费内容。平台不隶属于香港考试及评核局（HKEAA），也不保证考试成绩。

平台永久免费、无广告、无付费层或付费墙。已登录用户可无限练习。未登录用户目前每台设备可完成一节试用练习，之后需登录才能继续。这与 Source of Truth（2026-11-10 核实）所载“题数无限／无需登录”有差异；较新的项目宪章（2026-11-20）记录了访客试用限制。本 README 保留该差异，不将“免费”误述为访客无限制；请以最新官网界面和宪章为准。

## 主要功能

以下为 Source of Truth 截至 2026-11-10 记录的公开功能；题库数字是 2026-11-06 核实的快照，会随题库变更。详情请参阅[首页](https://www.dselevelup.com/)、[网站介绍](https://www.dselevelup.com/about)、[科目页](https://www.dselevelup.com/subjects)、[透明度页](https://www.dselevelup.com/transparency)、[方法论](https://www.dselevelup.com/methodology)、[信任中心](https://www.dselevelup.com/trust)及[llms.txt](https://www.dselevelup.com/llms.txt)。最新题数请查看[透明度页](https://www.dselevelup.com/transparency)。

- 25 个 HKDSE 甲类科目（M1、M2 分开计算）；当时有 26,419 道练习中题目：25,358 道选择题及 1,061 道书写题。
- 短题选择题练习及解析；一节约 10 题、约 15 分钟。答错后先提供第一步提示。
- 书写题按参考答案自评；不会由机器批改，也不计入准确率或练习表现估算。
- 练习结果与进度；可选 Google 登录同步进度。部分本地数据（包括收藏、写作草稿等）不会同步。
- 可打印练习套及答题纸 paper code。
- 无障碍及舒适设置，包括阅读尺、易读字体、字号／行距／字距；另有呼吸空间及时间囊工具。
- 题目反馈、匿名意见页 `/feedback`，以及透明度、信任中心、方法论和学生安全信息。
- 平台没有用户之间的私信、留言或点赞功能。

题目由校友与 AI 协作编写；AI 可协助起草及分类，内容经自动检查后发布，尚未全部经注册教师逐题审核。网站会标示审核状态，发现错误可反馈，团队会视情况修正或撤下题目。题目为原创平行改写，并非 HKEAA 官方试题。

## 快速开始

### 使用网站

1. 访问 [dselevelup.com](https://www.dselevelup.com/)。
2. 选择科目并开始练习；开始使用不需要登录。
3. 如需跨设备同步，请使用网站提供的 Google 登录。
4. 使用网站内的题目反馈入口，或发送邮件至 [dselevelup@gmail.com](mailto:dselevelup@gmail.com) 联系团队。

### 本地开发

要求：Node.js `26.x`（见 `package.json`）、npm 和 Git。

```bash
git clone https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE.git
cd DSE-LEVEL-UP-BY-CLAUDE-CODE
npm ci
npm run dev
```

打开 `http://localhost:3001`。如需使用 Google 登录或云端同步，请将 `.env.example` 复制为 `.env.local`，并在本地或部署环境中填写所需的 Supabase 配置；请根据 `.env.example` 和相关代码确认各变量用途。没有 Supabase 配置时，不要假设登录或云端同步可用。任何 server-only key 都不能使用 `NEXT_PUBLIC_` 前缀，也不能提交到 Git。

一般本地开发不需要数据库迁移。涉及数据库结构的工作，请遵循 `supabase/migrations/`、`CONTRIBUTING.md` 和维护者审批流程；不要自行将迁移应用到生产环境。

### 测试与检查

```bash
npm test
npm run typecheck
npm run lint
npm run qa
npm run secret:scan
```

提交前及构建检查请参阅 [`docs/PRE_COMMIT_VERIFICATION.md`](./docs/PRE_COMMIT_VERIFICATION.md)。生产构建命令：

```bash
npm run build
```

## 技术栈 / Technology Stack

| 范畴 | 已确认技术 |
| --- | --- |
| 前端与应用框架 | Next.js 16.4.6（App Router）、React 19.3.1、TypeScript（版本以 `package.json` 为准） |
| 样式 | Tailwind CSS 4 |
| 后端及 API | Next.js Route Handlers／服务端代码 |
| 数据库与身份验证 | Supabase PostgreSQL、Supabase Auth（Google OAuth）、`@supabase/ssr` |
| 部署 | Vercel |
| 错误监控与性能 | Sentry、Vercel Web Analytics、Vercel Speed Insights（以网站正式隐私政策说明为准） |
| 测试与代码检查 | Node.js test runner（由 `tsx` 执行）、TypeScript、ESLint、自定义 QA scripts |
| 包管理 | npm，使用 `package-lock.json` |

公开高层次技术栈有助安全研究人员了解系统组成及可能的攻击面，并通过指定私人渠道负责任地报告问题；这不代表获得测试授权。公开文档不得包含 API 密钥、数据库连接字符串、秘密密钥、内部网址、管理后台网址或其他敏感配置。环境变量名称以 `.env.example` 和代码为准，切勿公开其真实值。

## 隐私与数据安全

- 未登录时，练习数据留在浏览器端，不会同步到账户；登录后，Supabase 会通过账户标识符同步指定的练习进度和设置。可同步的数据包括练习分数、未完成练习、错题记录及（用户选择启用时）无障碍设置。收藏、写作草稿等部分数据仍仅保存在设备上。
- 题目反馈、练习后意见及 `/feedback` 匿名意见用于改进题目和服务；Source of Truth 记录匿名意见不收集账户、邮箱或 IP。另外还会有每日练习总数、Vercel 匿名整体流量／性能统计，以及 Sentry 错误监控。网站由 Vercel 托管，账户同步数据由 Supabase（PostgreSQL）处理；Google 登录也受 Google 隐私政策约束。平台表示不出售数据，也不向第三方分享数据用于营销。
- 账户同步数据会在账户使用期间保留，没有固定到期日；用户可在 `/account` 删除账户数据。仅存在设备上的数据可通过清除浏览器数据移除。各供应商统计及错误记录的保存期限，请参阅[正式隐私政策](https://www.dselevelup.com/privacy)及相关供应商政策；README 不另行承诺期限。用户可通过邮件要求查阅或更正数据。
- 请勿在代码、文档、截图或 issue 中加入真实用户数据、密码、token、API key、连接字符串或内部基础设施信息。

## 安全漏洞报告

请勿在公开 Issue、Pull Request 或其他公开渠道披露未修复漏洞。请先阅读 [`SECURITY.md`](./SECURITY.md)，并通过邮件 [dselevelup@gmail.com](mailto:dselevelup@gmail.com) 私下报告。未经书面授权，不得进行破坏性测试、拒绝服务攻击、社会工程、未授权访问或影响真实用户的测试。发现疑似敏感信息时，请勿复制或转发；通知维护者进行安全处理。

## 贡献与社区

- 贡献流程：[`CONTRIBUTING.md`](./CONTRIBUTING.md)
- 社区行为准则：[`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- 问题反馈：使用 GitHub Issue 表单；安全问题请勿使用公开 Issue。
- 题目／内容问题：使用 GitHub 的 Question / content issue form，避免粘贴完整的受版权保护的官方试题。

## 许可、免责声明与联系

代码、文档及题库不采用一般开源许可证；请参阅 [`LICENSE`](./LICENSE)。未经书面许可，不得重新发布题库、练习内容或品牌作为其他产品。平台并非 HKEAA 官方网站；练习表现仅供参考，考试结果以 HKEAA 公布为准。

维护者／一般联系：[dselevelup@gmail.com](mailto:dselevelup@gmail.com)。支持和数据查询请以网站内联系方式及隐私政策为准。社交账号：[Instagram @dselevelup](https://www.instagram.com/dselevelup) · [Threads @dselevelup](https://www.threads.com/@dselevelup)。

</details>

<details>
<summary>English</summary>

## About

DSE Level Up is a free study platform for Hong Kong Diploma of Secondary Education (DSE) candidates. It helps secondary students practise reasoning and common traps through short questions, review progress, and study with explanations. It is not a full-length mock-exam platform. Practice can be started without signing in; optional Google sign-in is only for cross-device progress sync and does not unlock paid content. The platform is not affiliated with the Hong Kong Examinations and Assessment Authority (HKEAA) and does not guarantee exam results.

The platform is permanently free, ad-free, and has no paid tier or paywall. Signed-in users can practise without a question or session cap. Guests can currently complete one trial practice session per device and must sign in to continue. This differs from the Source of Truth verified on 2026-11-10, which says practice is unlimited and does not require sign-in; the newer project charter (2026-11-20) records the guest trial limit. This README preserves the discrepancy rather than implying that free access means unlimited guest access. Refer to the current website and charter.

## Features

The following public facts are recorded in the Source of Truth as of 2026-11-10. The question-bank figures are a snapshot verified on 2026-11-06 and may change. See the [homepage](https://www.dselevelup.com/), [About](https://www.dselevelup.com/about), [subjects](https://www.dselevelup.com/subjects), [transparency](https://www.dselevelup.com/transparency), [methodology](https://www.dselevelup.com/methodology), [trust](https://www.dselevelup.com/trust), and [llms.txt](https://www.dselevelup.com/llms.txt) for supporting details; use the [transparency page](https://www.dselevelup.com/transparency) for the latest counts.

- 25 HKDSE Category A subjects (M1 and M2 counted separately); the snapshot listed 26,419 active practice questions: 25,358 multiple-choice and 1,061 written-response questions.
- Short multiple-choice practice with explanations; a session is about 10 questions and 15 minutes. After an incorrect answer, the first-step hint is shown first.
- Written-response questions are self-assessed against reference answers, never machine-graded, and excluded from accuracy and practice-performance estimates.
- Practice results and progress; optional Google sign-in syncs supported progress. Some device-only data, including bookmarks and writing drafts, is not synced.
- Printable practice sets and answer sheets with paper codes.
- Accessibility and comfort settings, including a reading ruler, easy-read font, font size, line spacing and letter spacing, plus breathing space and time-capsule tools.
- Question reports, an anonymous feedback page at `/feedback`, transparency, trust, methodology, and student-safety information.
- No user-to-user direct messages, comments, or likes.

Questions are co-authored by alumni and AI. AI assists with drafts and classification; questions go live after automated checks and have not all been reviewed question-by-question by registered teachers. Review status is shown, and reported errors may lead to correction or withdrawal. Questions are original parallel rewrites, not official HKEAA exam questions.

## Quick start

### Use the website

1. Visit [dselevelup.com](https://www.dselevelup.com/).
2. Choose a subject and start practising; sign-in is not required to get started.
3. To sync across devices, use the Google sign-in offered on the site.
4. Report a question through the in-site feedback flow, or contact the team at [dselevelup@gmail.com](mailto:dselevelup@gmail.com).

### Local development

Requirements: Node.js `26.x` (see `package.json`), npm, and Git.

```bash
git clone https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE.git
cd DSE-LEVEL-UP-BY-CLAUDE-CODE
npm ci
npm run dev
```

Open `http://localhost:3001`. For Google sign-in or cloud sync, copy `.env.example` to `.env.local` and provide the required Supabase configuration in your local or deployment environment. Check `.env.example` and the relevant code for each variable's purpose. Without Supabase configuration, do not expect sign-in or cloud sync to work. Never prefix a server-only key with `NEXT_PUBLIC_` or commit it to Git.

Database migrations are not required for ordinary local development. For schema work, follow `supabase/migrations/`, `CONTRIBUTING.md`, and maintainer approval requirements; do not apply migrations to production without authorization.

### Tests and checks

```bash
npm test
npm run typecheck
npm run lint
npm run qa
npm run secret:scan
```

See [`docs/PRE_COMMIT_VERIFICATION.md`](./docs/PRE_COMMIT_VERIFICATION.md) for pre-commit and build checks. The production build command is:

```bash
npm run build
```

## Technology Stack / 技術棧 / 技术栈

| Area | Confirmed technology |
| --- | --- |
| Front end and application framework | Next.js 16.4.6 (App Router), React 19.3.1, TypeScript (see `package.json` for the current version) |
| Styling | Tailwind CSS 4 |
| Back end and APIs | Next.js Route Handlers and server-side code |
| Database and authentication | Supabase PostgreSQL, Supabase Auth (Google OAuth), `@supabase/ssr` |
| Deployment | Vercel |
| Error monitoring and performance | Sentry, Vercel Web Analytics, Vercel Speed Insights (see the live privacy policy) |
| Tests and code checks | Node.js test runner (via `tsx`), TypeScript, ESLint, custom QA scripts |
| Package manager | npm with `package-lock.json` |

Publishing a high-level stack helps security researchers understand system components and potential attack surfaces and report issues responsibly through the designated private channel; it does not authorize testing. Public documentation must never contain API keys, database connection strings, secret keys, internal URLs, admin URLs, or other sensitive configuration. Verify environment-variable names against `.env.example` and the code, and never publish their actual values.

## Privacy and data security

- Without sign-in, practice data stays in the browser and is not synced to an account. After sign-in, Supabase syncs selected practice progress and settings using an account identifier. Synced data includes scores, unfinished sessions, incorrect-answer records, and (if enabled by the user) accessibility settings. Some data, such as bookmarks and writing drafts, remains on the device.
- Question reports, post-practice feedback, and anonymous feedback at `/feedback` are used to improve questions and the service. The Source of Truth states that anonymous feedback does not collect an account, email address, or IP address. The service also uses daily practice totals, aggregate Vercel traffic/performance metrics, and Sentry error monitoring. The site is hosted by Vercel; account sync data is processed by Supabase (PostgreSQL). Google sign-in is also subject to Google's privacy policy. The platform says it does not sell data or share it with third parties for marketing.
- Account sync data is retained while the account is in use, with no fixed expiry; users can delete account data at `/account`. Device-only data can be removed by clearing browser data. For retention periods for vendor metrics and error logs, see the [official privacy policy](https://www.dselevelup.com/privacy) and the relevant vendor policies; this README makes no separate retention promise. Users may email to request access to or correction of their data.
- Never put real user data, passwords, tokens, API keys, connection strings, or internal infrastructure details in code, documentation, screenshots, or issues.

## Security reporting

Do not disclose an unpatched vulnerability in a public Issue, Pull Request, or other public venue. Read [`SECURITY.md`](./SECURITY.md) and report privately by email to [dselevelup@gmail.com](mailto:dselevelup@gmail.com). Without written authorization, do not conduct destructive testing, denial-of-service testing, social engineering, unauthorized access, or tests affecting real users. If you find suspected sensitive data, do not copy or forward it; notify maintainers for secure handling.

## Contributing and community

- Contribution process: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Community standards: [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- Issue reports: use the GitHub Issue forms; never use public Issues for security reports.
- Question/content feedback: use the GitHub Question / content issue form and do not reproduce complete copyrighted official exam questions.

## License, disclaimer, and contact

The code, documentation, and question bank are not released under a standard open-source license; see [`LICENSE`](./LICENSE). Do not redistribute the question bank, practice content, or brand as another product without written permission. This is not an official HKEAA website. Practice estimates are for reference only; official results are determined by HKEAA.

Maintainer/general contact: [dselevelup@gmail.com](mailto:dselevelup@gmail.com). For support and data enquiries, use the website contact options and privacy policy. Social accounts: [Instagram @dselevelup](https://www.instagram.com/dselevelup) · [Threads @dselevelup](https://www.threads.com/@dselevelup).

</details>
