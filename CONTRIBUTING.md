# Contributing / 貢獻 / 贡献

<details open>
<summary>繁體中文（香港）</summary>

多謝你幫手改善 DSE Level Up。學生只想溫習的話，請直接使用[網站](https://www.dselevelup.com/)；毋須 GitHub 帳戶。

## 開始前

- 閱讀 `docs/charter.md`，了解永久免費、無廣告、學生信任優先及原創改寫題目的原則。
- 每個 Pull Request 盡量只處理一項清晰工作；說明對學生的影響。
- 不要提交 `.env*`、憑證、真實用戶資料、API key、token 或其他秘密。
- 不要提交未獲准公開的題庫材料；遵守 `docs/qbank/` 的版權及發布閘門。
- 身份驗證、RLS、帳戶刪除、資料庫結構或正式環境資料變更，必須先取得維護者明確審批。不得自行修改正式資料或套用正式資料庫遷移。

## 開發環境

需要 Node.js `26.x`、npm、Git。

```bash
git clone https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE.git
cd DSE-LEVEL-UP-BY-CLAUDE-CODE
npm ci
npm run dev
```

開發伺服器位於 `http://localhost:3001`。要測試登入或雲端同步，請在本機建立 `.env.local`，按 `.env.example` 配置所需環境變數；不要把實際值放在 issue、文件或 commit。一般前端開發毋須登入或資料庫遷移。

## 建議貢獻流程

1. 在 GitHub 搜尋現有 Issues 和 Pull Requests，避免重複工作。Bug 使用 Bug report 表單；新功能建議使用 Feature request 表單。請勿用公開 Issue 回報安全漏洞，改看 [`SECURITY.md`](./SECURITY.md)。
2. Fork repository，從最新 `main` 建立明確命名的 feature branch。
3. 安裝依賴、作出聚焦變更，並補充或更新測試及文件。
4. 執行適用檢查：

   ```bash
   npm test
   npm run typecheck
   npm run lint
   npm run qa
   npm run secret:scan
   ```

   變更涉及正式建置時，再執行 `npm run build`。完整要求見 [`docs/PRE_COMMIT_VERIFICATION.md`](./docs/PRE_COMMIT_VERIFICATION.md)。
5. 使用清晰 commit message，建議遵循 Conventional Commits，例如 `feat:`、`fix:`、`docs:`、`refactor:`、`test:`、`chore:`。
6. 開啟 Pull Request，填寫 repository 的 PR 模板；說明目的、學生影響、測試結果及未完成事項。較大或仍在討論中的變更可先開 Draft PR。
7. 等待維護者 review，按意見修訂。CI 通過不代表已獲准部署或合併；涉及受保護資料或正式環境的變更，須另行取得明確批准。

## 審查原則

提交內容需聚焦、可理解、可測試，符合憲章、私隱和安全要求。維護者可要求修改、暫緩或拒絕不符合要求的貢獻。不要在 PR 中加入使用者個人資料、秘密或未修復漏洞細節。

## 聯絡

行為準則見 [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)；安全漏洞見 [`SECURITY.md`](./SECURITY.md)。一般聯絡：[dselevelup@gmail.com](mailto:dselevelup@gmail.com)。

</details>

<details>
<summary>简体中文</summary>

感谢你帮助改进 DSE Level Up。如果你只是想学习，请直接使用[网站](https://www.dselevelup.com)，无需 GitHub 账户。

## 开始之前

- 阅读 `docs/charter.md`，了解永久免费、无广告、学生信任优先及原创改写题目的原则。
- 每个 Pull Request 尽量只处理一项明确工作，并说明对学生的影响。
- 不要提交 `.env*`、凭据、真实用户数据、API key、token 或其他秘密。
- 不要提交未经批准公开的题库材料；遵守 `docs/qbank/` 中的版权和发布检查。
- 身份验证、RLS、账户删除、数据库结构或生产数据变更，必须先取得维护者明确审批。不得自行修改生产数据或应用生产数据库迁移。

## 开发环境

需要 Node.js `26.x`、npm、Git。

```bash
git clone https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE.git
cd DSE-LEVEL-UP-BY-CLAUDE-CODE
npm ci
npm run dev
```

开发服务器地址为 `http://localhost:3001`。如需测试登录或云端同步，请在本地创建 `.env.local`，按 `.env.example` 配置所需环境变量；不要把实际值写入 issue、文档或 commit。一般前端开发无需登录或数据库迁移。

## 建议贡献流程

1. 在 GitHub 搜索现有 Issues 和 Pull Requests，避免重复工作。Bug 使用 Bug report 表单；新功能建议使用 Feature request 表单。不要通过公开 Issue 报告安全漏洞，请参阅 [`SECURITY.md`](./SECURITY.md)。
2. Fork repository，从最新 `main` 创建命名清晰的 feature branch。
3. 安装依赖，完成聚焦的修改，并补充或更新测试和文档。
4. 运行适用检查：

   ```bash
   npm test
   npm run typecheck
   npm run lint
   npm run qa
   npm run secret:scan
   ```

   修改涉及生产构建时，再运行 `npm run build`。完整要求见 [`docs/PRE_COMMIT_VERIFICATION.md`](./docs/PRE_COMMIT_VERIFICATION.md)。
5. 使用清晰的 commit message，建议遵循 Conventional Commits，例如 `feat:`、`fix:`、`docs:`、`refactor:`、`test:`、`chore:`。
6. 创建 Pull Request 并填写仓库 PR 模板；说明目的、对学生的影响、测试结果及未完成事项。较大或仍在讨论的变更可以先创建 Draft PR。
7. 等待维护者 review，并按意见修改。CI 通过不代表已获准部署或合并；涉及受保护数据或生产环境的变更，须另行取得明确批准。

## 审查原则

提交内容应聚焦、易于理解和测试，并符合项目章程、隐私及安全要求。维护者可要求修改、暂缓或拒绝不符合要求的贡献。不要在 PR 中加入用户个人信息、秘密或未修复漏洞的细节。

## 联系

行为准则见 [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)；安全漏洞见 [`SECURITY.md`](./SECURITY.md)。一般联系：[dselevelup@gmail.com](mailto:dselevelup@gmail.com)。

</details>

<details>
<summary>English</summary>

Thank you for helping improve DSE Level Up. Students who only want to study can use the [website](https://www.dselevelup.com/) without a GitHub account.

## Before you start

- Read `docs/charter.md` for the permanently free, ad-free, student-trust-first principles and the requirement for independently rewritten questions.
- Keep each Pull Request focused on one clear change and describe its impact on students.
- Never commit `.env*` files, credentials, real user data, API keys, tokens, or other secrets.
- Do not submit question-bank material that is not approved for release; follow copyright and release gates in `docs/qbank/`.
- Changes involving authentication, RLS, account deletion, database schema, or production data require explicit maintainer approval first. Do not independently modify production data or apply production migrations.

## Development setup

Requires Node.js `26.x`, npm, and Git.

```bash
git clone https://github.com/brianarebrian-art/DSE-LEVEL-UP-BY-CLAUDE-CODE.git
cd DSE-LEVEL-UP-BY-CLAUDE-CODE
npm ci
npm run dev
```

The development server runs at `http://localhost:3001`. To test sign-in or cloud sync, create `.env.local` locally and configure the required variables based on `.env.example`; never put actual values in issues, docs, or commits. Ordinary front-end work does not require sign-in or a database migration.

## Suggested contribution workflow

1. Search existing GitHub Issues and Pull Requests to avoid duplicate work. Use the Bug report form for bugs and Feature request form for suggestions. Never report security vulnerabilities in public Issues; see [`SECURITY.md`](./SECURITY.md).
2. Fork the repository and create a clearly named feature branch from the latest `main`.
3. Install dependencies, make a focused change, and add or update relevant tests and documentation.
4. Run the applicable checks:

   ```bash
   npm test
   npm run typecheck
   npm run lint
   npm run qa
   npm run secret:scan
   ```

   Also run `npm run build` when changes affect the production build. See [`docs/PRE_COMMIT_VERIFICATION.md`](./docs/PRE_COMMIT_VERIFICATION.md) for the full checklist.
5. Write a clear commit message. Conventional Commits are recommended, for example `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, and `chore:`.
6. Open a Pull Request using the repository template. Describe the purpose, student impact, test results, and any unfinished work. A Draft PR is suitable for larger changes or work still under discussion.
7. Wait for maintainer review and address requested changes. Passing CI does not authorize deployment or merging; changes involving protected data or production require separate explicit approval.

## Review principles

Contributions should be focused, understandable, testable, and consistent with the project charter, privacy, and security requirements. Maintainers may request changes, defer, or decline contributions that do not meet these requirements. Do not include personal user data, secrets, or unpatched vulnerability details in a PR.

## Contact

See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) for community standards and [`SECURITY.md`](./SECURITY.md) for vulnerability reports. General contact: [dselevelup@gmail.com](mailto:dselevelup@gmail.com).

</details>
