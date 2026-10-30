# D · 兩個 GitHub Skills 固定版本 registry

狀態：**部分安裝** · 2026-10-30（香港時間）覆核  
觸發：收到兩個 repo URL，視為按本登記安裝。  
SHA 當日再查，與 2026-10-29 釘選相同。

## Registry

| ID | 來源 | 釘選 SHA | License（API） | 本 repo 狀態 |
|---|---|---|---|---|
| `apple-design` | https://github.com/dickwu/apple-design-skill | `ff4ebddf0488598723a82bfdce1afb04de0b1c44`（main，2026-10-28） | **null／未標 SPDX** | **未安裝** |
| `emilkowalski-skills` | https://github.com/emilkowalski/skills | `a81dbca07f2217b7103e510c0f13f8d5b017afc9`（main，2026-10-28） | **MIT** | **已安裝** |

查核指令（可重跑）：

```bash
gh api repos/dickwu/apple-design-skill/commits/main --jq .sha
gh api repos/emilkowalski/skills/commits/main --jq .sha
```

## 已安裝（emilkowalski/skills）

由釘選 commit 複製入 `.cursor/skills/`，檔案與該 commit 嘅 `skills/` 目錄一致。  
授權全文：`.cursor/skills/vendor/emilkowalski-skills/LICENSE`。  
`skills` CLI 1.7.4 冇 `--ref`，所以用 `git checkout` 該 SHA 再複製，唔追浮動 main。

| Skill 目錄 | 備註 |
|---|---|
| `emil-design-eng` | 介面品味主 skill |
| `animate` | 網頁動效 |
| `animation-performance` | 掉幀 |
| `animation-vocabulary` | 動效用語 |
| `apple-design` | WWDC 流體介面，譯成網頁。唔係 dickwu 嗰套 HIG 原文 |
| `review-animations` | 審動效 |
| `improve-animations` | 只出計劃，唔改碼 |
| `find-animation-opportunities` | 只讀建議 |
| `remove-animations` | 只刪多餘動效 |
| `mobile-native` | 手機瀏覽器手感 |
| `break-ui` | 極端資料 |
| `prototype` | 要明確叫用 |
| `pick-ui-library` | `disable-model-invocation`。建議套件唔等於可安裝 |
| `ask-sonner` | 本 repo 未用 Sonner；唔好為咗 skill 加套件 |
| `animate-expo` | React Native。本產品唔用 |
| `write-swift` | 本產品唔用 |

使用約束（亦見 `.cursor/rules/design-skills.mdc`）：

- 唔因 skill 加無關 UI library，亦唔新增 npm 套件。
- 圖表維持純 SVG。憲章禁止 Chart.js、D3、Recharts。
- 唔好改去 Swift 或 React Native。
- 更新必須改本 registry 嘅 SHA 並另批。

## 未安裝（dickwu/apple-design-skill）

未寫入 `.cursor/skills`。原因：

1. GitHub API 嘅 license 仍係 `null`。README 寫 guideline 屬 Apple，並話 “use them at your own discretion”，呢句唔係授權。
2. `references/hig/*.md`（buttons、design-principles 等已抽樣）保留 Apple 網站原文。憲章零版權侵犯；本 repo 唔複製該批頁面。
3. 登記原本要求創辦人先接受「授權不明」風險。今次只收到兩個 URL，未有呢句接受，所以唔裝。

若要安裝，需要另一句明確接受：可以將 Apple 原文頁面寫入本 repo，或改為只裝作者手寫檔（`SKILL.md`、`references/cross-platform.md`、`references/code-audit.md`）而唔包含 `references/hig/`。

唔好執行 `node scripts/pull-hig.mjs`。
