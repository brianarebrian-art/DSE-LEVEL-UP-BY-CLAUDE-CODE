# D · 兩個 GitHub Skills 固定版本 registry（DRAFT）

狀態：**待批准（安裝／更新先批准）** · 2026-10-29  
本輪**未執行** `npx skills add`／未寫入 `.cursor/skills` 副本。

## Registry

| ID | 來源 | Default branch HEAD（釘選） | License（API） | 用途摘要 |
|---|---|---|---|---|
| `apple-design` | https://github.com/dickwu/apple-design-skill | `ff4ebddf0488598723a82bfdce1afb04de0b1c44`（main，2026-10-29 查） | **null／未標 SPDX** | Apple HIG 取向 UI 審核 skill |
| `emilkowalski-skills` | https://github.com/emilkowalski/skills | `a81dbca07f2217b7103e510c0f13f8d5b017afc9`（main，2026-10-29 查） | **MIT** | 動效／介面品味 skills 集合 |

查核指令（可重跑）：

```bash
gh api repos/dickwu/apple-design-skill/commits/main --jq .sha
gh api repos/emilkowalski/skills/commits/main --jq .sha
```

## 安裝（只喺批准後）

```bash
# 釘死 SHA，唔追浮動 latest
npx skills add dickwu/apple-design-skill --ref ff4ebddf0488598723a82bfdce1afb04de0b1c44
npx skills add emilkowalski/skills --ref a81dbca07f2217b7103e510c0f13f8d5b017afc9
```

（實際 CLI flag 以當日 `skills` CLI 為準；批准時再核一次。）

## 約束

- 唔因 skill 加無關 UI library。  
- `apple-design-skill` **未見 SPDX license** → 使用前創辦人要接受「授權不明」風險或改選。  
- 更新必須改本 registry 嘅 SHA 並另批。  

## 待批准一句

「准安裝釘選 SHA 嘅兩個 skills 入本 repo／agent 環境」  
