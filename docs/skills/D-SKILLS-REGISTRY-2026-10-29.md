# D · GitHub Skills 固定版本 registry

狀態：**emilkowalski/skills 已安裝** · 2026-10-30  
路徑：`.cursor/skills/`（PIN：`EMILKOWALSKI-SKILLS.PIN`）

## Registry

| ID | 來源 | 釘選 SHA | License | 用途 |
|---|---|---|---|---|
| `emilkowalski-skills` | https://github.com/emilkowalski/skills | `a81dbca07f2217b7103e510c0f13f8d5b017afc9` | MIT | 介面／動效原則；`apple-design`、`mobile-native`、`emil-design-eng` 等 |
| `apple-design` (dickwu) | https://github.com/dickwu/apple-design-skill | `ff4ebddf0488598723a82bfdce1afb04de0b1c44` | **未標 SPDX** | **只作遠端概念審查**；唔複製 `references/hig/` 入 repo |

## 安裝（已執行）

```bash
npx skills add emilkowalski/skills --ref a81dbca07f2217b7103e510c0f13f8d5b017afc9
# 再複製適用 skills 入 .cursor/skills/（唔包 write-swift／animate-expo，憲章禁 native 轉向）
```

## 約束

- 唔因 skill 加無關 UI library／新 npm。  
- dickwu HIG 原文唔入 repo。  
- 更新必須改本 registry SHA 並另批。  
