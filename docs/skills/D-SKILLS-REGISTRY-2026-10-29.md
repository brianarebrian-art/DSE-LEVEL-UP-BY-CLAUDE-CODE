# D · GitHub Skills 固定版本 registry

狀態：**emilkowalski/skills 已安裝** · 2026-10-30。2026-11-10 再釘選四套介面 skills。  
路徑：`.cursor/skills/`。本地約束：`.cursor/skills/DSE-VISUAL-SYSTEM.md`（覆蓋任何想開新色盤、新字體或第二套 token 嘅建議）。

## Registry

| ID | 來源 | 釘選 SHA | License | 用途 |
|---|---|---|---|---|
| `emilkowalski-skills` | https://github.com/emilkowalski/skills | `a81dbca07f2217b7103e510c0f13f8d5b017afc9` | MIT | 介面／動效原則；`apple-design`、`mobile-native`、`emil-design-eng` 等 |
| `apple-design` (dickwu) | https://github.com/dickwu/apple-design-skill | `ff4ebddf0488598723a82bfdce1afb04de0b1c44` | **未標 SPDX** | **只作遠端概念審查**；唔複製 `references/hig/` 入 repo |
| `frontend-ui-engineering` | https://github.com/addyosmani/agent-skills `skills/frontend-ui-engineering` | `301b02b12bff98e4688e6984af6556802322bbde` | MIT，Copyright (c) 2025 Addy Osmani | 介面實作。PIN：`ADDYOSMANI-AGENT-SKILLS.PIN`。授權：`.cursor/skills/vendor/addyosmani-agent-skills/LICENSE` |
| `design-skills` | https://github.com/cuellarfr/design-skills | `7e25e66e87f64f9d3dea22198f9e29937e7c48f5` | MIT，Copyright (c) 2026 Carlos C. | 十個 skill：`accessibility-audit`（WCAG 2.2）、`design-critique`、`design-elevation`、`design-ops`、`design-systems`、`interaction-design`、`journey-mapping`、`ux-research`、`ux-strategy`、`ux-writing`。PIN：`CUELLARFR-DESIGN-SKILLS.PIN` |
| `web-design-guidelines` | https://github.com/vercel-labs/agent-skills `skills/web-design-guidelines` | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | MIT（README 聲明；該 commit 冇 LICENSE 檔） | Vercel Web Interface Guidelines 審查。PIN：`VERCEL-LABS-AGENT-SKILLS.PIN`。出處：`.cursor/skills/vendor/vercel-labs-agent-skills/ATTRIBUTION.md` |
| `impeccable` | https://github.com/pbakaus/impeccable `.cursor/skills/impeccable` | `ec229b48547f24685ffb22aa51c462c5ae27908c` | Apache-2.0 | 只准查字級、間距、對比。唔准改品牌、色盤或視覺身份。PIN：`IMPECCABLE.PIN`。授權同 NOTICE：`.cursor/skills/vendor/impeccable/` |

## 安裝（已執行）

```bash
npx skills add emilkowalski/skills --ref a81dbca07f2217b7103e510c0f13f8d5b017afc9
# 再複製適用 skills 入 .cursor/skills/（唔包 write-swift／animate-expo，憲章禁 native 轉向）
```

2026-11-10 嘅四套係按上表 SHA 複製入 `.cursor/skills/`，冇用 `npx skills add` 成個 vercel 或 Impeccable repo。每個 `SKILL.md` 頂部有本地 wrapper，指向 `.cursor/skills/DSE-VISUAL-SYSTEM.md`。

## 約束

- 唔因 skill 加無關 UI library／新 npm。  
- dickwu HIG 原文唔入 repo。  
- 視覺系統係莫蘭迪（`app/tokens-clear.css`）。skill 唔好開第二套色盤、字體或 token。  
- `impeccable` 只查字級、間距、對比。  
- 更新必須改本 registry SHA 並另批。

## 刻意未安裝

唔好安裝，亦唔好當視覺來源：

- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://github.com/plugin87/ux-ui-agent-skills  
