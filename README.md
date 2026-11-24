# DSE Level Up

> 香港 DSE 學生的免費溫習平台。／面向香港 DSE 考生的免费学习平台。／A free study platform for Hong Kong DSE students.
>
> 網站 / 网站 / Website: [dselevelup.com](https://www.dselevelup.com/)

本 README 以 `<details>` 分開三種語言；內容一一對應。The language sections below are equivalent.

<details open>
<summary>繁體中文（香港）</summary>

## 專案簡介

DSE Level Up 是一個為香港中學文憑試（DSE）考生而設的免費溫習平台，協助中四至中六學生練習、檢視學習進度，並以清晰解析和較低壓力的方式備試。毋須登入即可使用網站大部分內容；Google 登入用於跨裝置同步，不會解鎖付費內容。平台不隸屬香港考試及評核局（HKEAA），亦不保證考試成績。

平台維持永久免費、無廣告、無付費層的原則。未登入使用者目前可完成一節試用練習；登入後可繼續使用練習。詳情及任何限制以網站當前介面為準。

## 主要功能

以下功能以目前程式碼及公開網站為準；個別功能可能因登入狀態或可用資料而有不同體驗。

- DSE 科目及選擇題練習，附答案解析。
- 練習結果與進度檢視；登入後可在裝置間同步支援的進度資料。
- 收藏、錯題回顧及科目筆記等學習工具。
- 字級、易讀字體、閱讀尺等無障礙及閱讀設定。
- 繁體中文、簡體中文及英文內容；實際翻譯覆蓋因頁面而異。
- 題目回報、透明度、方法論及學生安全資訊。

題目是原創平行改寫，並非 HKEAA 官方試題；題目經自動檢查後發布，並非每題都已由註冊教師審定。平台不提供未經文件確認的未來功能承諾。

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
| 前端與應用框架 | Next.js 16（App Router）、React 19、TypeScript |
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
- 已登入後提交的題目回報、練習後意見及自願提交的意見，用於改善題目與服務；相關回報不會記錄帳戶、IP 或裝置。另有每日練習總數、Vercel 匿名整體流量／效能統計，以及 Sentry 錯誤監察。網站由 Vercel 託管，帳戶同步資料由 Supabase（PostgreSQL）處理；Google 登入亦受 Google 私隱政策規管。平台表示不出售資料，亦不向第三方分享資料作營銷。
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

DSE Level Up 是一个面向香港中学文凭考试（DSE）考生的免费学习平台，帮助中四至中六学生练习、查看学习进度，并通过清晰解析和较低压力的方式备考。无需登录即可使用网站的大部分内容；Google 登录用于跨设备同步，不会解锁付费内容。平台不隶属于香港考试及评核局（HKEAA），也不保证考试成绩。

平台坚持永久免费、无广告、无付费层。未登录用户目前可完成一节试用练习；登录后可继续使用练习。详情及任何限制以网站当前界面为准。

## 主要功能

以下功能以当前代码和公开网站为准；个别功能可能因登录状态或可用数据而有不同体验。

- DSE 科目及选择题练习，附答案解析。
- 练习结果与进度查看；登录后可在设备间同步受支持的进度数据。
- 收藏、错题回顾及科目笔记等学习工具。
- 字号、易读字体、阅读尺等无障碍及阅读设置。
- 繁体中文、简体中文及英文内容；不同页面的翻译覆盖程度可能不同。
- 题目反馈、透明度、方法论及学生安全信息。

题目为原创平行改写，并非 HKEAA 官方试题；题目经自动检查后发布，并非每题都已由注册教师审核。平台不会承诺未经文档确认的未来功能。

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
| 前端与应用框架 | Next.js 16（App Router）、React 19、TypeScript |
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
- 登录后提交的题目反馈、练习后意见及自愿提交的反馈用于改进题目和服务；相关反馈不记录账户、IP 或设备。另外还会有每日练习总数、Vercel 匿名整体流量／性能统计，以及 Sentry 错误监控。网站由 Vercel 托管，账户同步数据由 Supabase（PostgreSQL）处理；Google 登录也受 Google 隐私政策约束。平台表示不出售数据，也不向第三方分享数据用于营销。
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

DSE Level Up is a free study platform for Hong Kong Diploma of Secondary Education (DSE) candidates. It helps secondary students practise, review their progress, and prepare with clear explanations in a lower-pressure environment. Most of the site can be used without signing in; Google sign-in is for cross-device sync and unlocks no paid content. The platform is not affiliated with the Hong Kong Examinations and Assessment Authority (HKEAA) and does not guarantee exam results.

The platform is permanently free, ad-free, and has no paid tier. Guests can currently complete one trial practice set; signing in allows continued practice. Check the live site for current details and any limits.

## Features

The following reflects the current code and public website. Some features may vary by sign-in status or data availability.

- DSE subjects and multiple-choice practice with answer explanations.
- Practice results and progress review; supported progress data can sync across devices after sign-in.
- Learning tools including bookmarks, incorrect-answer review, and subject notes.
- Accessibility and reading settings such as font sizing, an easy-read font, and a reading ruler.
- Traditional Chinese, Simplified Chinese, and English content; translation coverage varies by page.
- Question feedback, transparency, methodology, and student-safety information.

Questions are independently rewritten and are not official HKEAA exam questions. They are published after automated checks; not every question has been reviewed by a registered teacher. No unconfirmed future features are promised here.

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
| Front end and application framework | Next.js 16 (App Router), React 19, TypeScript |
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
- Question reports, post-practice feedback, and feedback a user chooses to submit after signing in are used to improve questions and the service; those submissions do not record an account, IP, or device. The service also uses daily practice totals, aggregate Vercel traffic/performance metrics, and Sentry error monitoring. The site is hosted by Vercel; account sync data is processed by Supabase (PostgreSQL). Google sign-in is also subject to Google's privacy policy. The platform says it does not sell data or share it with third parties for marketing.
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
