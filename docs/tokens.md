<!-- generated from app/globals.css by scripts/gen-token-doc.mjs — do not edit -->

# 設計 token

**唯一來源係 `app/globals.css`，唔係呢個檔。** 呢度所有數字都由嗰邊抽出嚟。
改 token 改 CSS，然後重跑：

```bash
node scripts/gen-token-doc.mjs
```

掃到 **169** 個 custom property 宣告，分佈喺 **208** 個 block。

## ⚠️ 被覆蓋嘅宣告

同一個 token 喺預設態宣告咗多過一次。**上面嗰啲畫唔到** —— 後面嗰個贏。
照住早嗰個值去設計，出嚟嘅顏色同實際站唔同。

| token | 畫唔到嘅宣告 | 真正生效 | resolved |
|---|---|---|---|
| `--color-surface` | `#FAFAF8` (L57) | `var(--color-ml-canvas)` (L366) | `#F4F0EA` |
| `--color-surface-raised` | `#FFFFFF` (L58) | `var(--color-ml-surface)` (L367) | `#FFFDF9` |
| `--color-surface-sunken` | `#F5F5F0` (L59) | `var(--color-ml-muted)` (L368) | `#F0EBE3` |
| `--color-ink` | `#1A1A1A` (L71) | `var(--color-ml-ink)` (L369) | `#2C2A29` |
| `--color-ink-soft` | `#2D2D2D` (L72) | `#3D3A38` (L370) | `#3D3A38` |
| `--color-ink-muted` | `#5E5E5E` (L73) | `var(--color-ml-ink-soft)` (L371) | `#69635F` |
| `--color-ink-faint` | `#9CA3AF` (L78) | `#9C958D` (L372) | `#9C958D` |
| `--color-accent` | `#006B65` (L79) | `var(--color-ml-sage)` (L374) | `#57685C` |
| `--color-accent-strong` | `#00726C` (L80) | `var(--color-ml-sage)` (L375) | `#57685C` |
| `--color-accent-hover` | `#005F5A` (L84) | `#4D584A` (L376) | `#4D584A` |
| `--color-on-accent` | `#FFFFFF` (L85) | `var(--color-ml-on-brand)` (L377) | `#FFFFFF` |
| `--color-line` | `rgba(0, 0, 0, 0.06)` (L86) | `rgba(44, 42, 41, 0.08)` (L378) | `rgba(44, 42, 41, 0.08)` |
| `--color-line-strong` | `rgba(0, 0, 0, 0.12)` (L87) | `rgba(44, 42, 41, 0.16)` (L379) | `rgba(44, 42, 41, 0.16)` |
| `--color-scrim` | `rgba(0, 0, 0, 0.70)` (L93) | `rgba(44, 42, 41, 0.72)` (L381) | `rgba(44, 42, 41, 0.72)` |
| `--color-scrim-soft` | `rgba(0, 0, 0, 0.40)` (L94) | `rgba(44, 42, 41, 0.42)` (L382) | `rgba(44, 42, 41, 0.42)` |
| `--color-gold` | `#756238` (L111) | `var(--color-ml-clay)` (L388) | `#706347` |
| `--color-gold-soft` | `#D4A017` (L114) | `var(--color-ml-rose)` (L389) | `#B7A6A3` |
| `--color-gold-strong` | `#725106` (L115) | `#5F5144` (L390) | `#5F5144` |
| `--color-violet` | `#6D28D9` (L116) | `#5B666F` (L391) | `#5B666F` |
| `--color-violet-strong` | `#5B21B6` (L117) | `#4A545C` (L392) | `#4A545C` |
| `--color-rose` | `#C2185B` (L118) | `var(--color-ml-warn)` (L394) | `#845956` |
| `--color-rose-strong` | `#9D1449` (L120) | `#724D3D` (L395) | `#724D3D` |
| `--color-on-violet` | `#FFFFFF` (L123) | `#FFFFFF` (L393) | `#FFFFFF` |
| `--grade-5s` | `#8A6608` (L130) | `#846208` (L401) | `#846208` |
| `--grade-5` | `#177E3C` (L131) | `#16793A` (L402) | `#16793A` |
| `--color-ml-rose` | `#C5908B` (L178) | `#B7A6A3` (L183) | `#B7A6A3` |
| `--color-ml-mist` | `#AFC2D1` (L179) | `#8A9BA8` (L184) | `#8A9BA8` |
| `--ease-spring-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` (L1175) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1176) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` |

## Resolved — 預設態（冇 `data-theme` 屬性）

@theme ＋ 裸 `:root`，last-wins。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L902) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L16) | — |  |
| `--color-accent` | `#57685C` | `var(--color-ml-sage)` (L374) | `--color-ml-sage` | 4.75 |
| `--color-accent-hover` | `#4D584A` | `#4D584A` (L376) | — | 白字 7.47 |
| `--color-accent-strong` | `#57685C` | `var(--color-ml-sage)` (L375) | `--color-ml-sage` | 白字掣 5.64 |
| `--color-bg-dark` | `#080C14` | `#080C14` (L47) | — |  |
| `--color-bg-dark-2` | `#0B1120` | `#0B1120` (L48) | — |  |
| `--color-gold` | `#706347` | `var(--color-ml-clay)` (L388) | `--color-ml-clay` | 4.56（四底面） |
| `--color-gold-soft` | `#B7A6A3` | `var(--color-ml-rose)` (L389) | `--color-ml-rose` | 1.97 —— 永遠唔可以做字色 |
| `--color-gold-strong` | `#5F5144` | `#5F5144` (L390) | — | 5.94 / 白字 7.64 |
| `--color-ink` | `#2C2A29` | `var(--color-ml-ink)` (L369) | `--color-ml-ink` |  |
| `--color-ink-faint` | `#9C958D` | `#9C958D` (L372) | — | 2.49 —— 同上游一樣，只准用於停用控件／ |
| `--color-ink-muted` | `#69635F` | `var(--color-ml-ink-soft)` (L371) | `--color-ml-ink-soft` | 4.84 |
| `--color-ink-soft` | `#3D3A38` | `#3D3A38` (L370) | — | 9.51 |
| `--color-line` | `rgba(44, 42, 41, 0.08)` | `rgba(44, 42, 41, 0.08)` (L378) | — |  |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` | `rgba(44, 42, 41, 0.16)` (L379) | — |  |
| `--color-ml-canvas` | `#F4F0EA` | `#F4F0EA` (L161) | — | 頁面底 |
| `--color-ml-clay` | `#706347` | `#706347` (L170) | — | PC-011↓ 強調、失分標示（4.56 / 白字掣 5.63） |
| `--color-ml-good` | `#566953` | `#566953` (L173) | — | PC-032↓ 達標（4.59 / 白字掣 5.68） |
| `--color-ml-ink` | `#2C2A29` | `#2C2A29` (L165) | — | 正文（12.04） |
| `--color-ml-ink-soft` | `#69635F` | `#69635F` (L166) | — | 輔助（4.57，四底面） |
| `--color-ml-line` | `#8A8377` | `#8A8377` (L174) | — | PC-027↓ 控件邊界（3.16，WCAG 1.4.11）。 |
| `--color-ml-mist` | `#8A9BA8` | `#8A9BA8` (L184) | — | 資訊／交通 —— 純裝飾填色 |
| `--color-ml-muted` | `#F0EBE3` | `#F0EBE3` (L163) | — | 次級區塊。⚠️ 規格原值 #E8E2D9 太深， |
| `--color-ml-on-brand` | `#FFFFFF` | `#FFFFFF` (L177) | — | 實心掣上嘅字（Light 用白字） |
| `--color-ml-rose` | `#B7A6A3` | `#B7A6A3` (L183) | — | 情緒／關懷 —— 純裝飾填色 |
| `--color-ml-sage` | `#57685C` | `#57685C` (L169) | — | PC-016↓ 主行動、正確（4.59 / 白字掣 5.68） |
| `--color-ml-surface` | `#FFFDF9` | `#FFFDF9` (L162) | — | 卡片 |
| `--color-ml-warn` | `#845956` | `#845956` (L171) | — | PC-003↓ 超時、警告（4.58 / 白字掣 5.66）。 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L43) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L44) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L46) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L45) | — |  |
| `--color-on-accent` | `#FFFFFF` | `var(--color-ml-on-brand)` (L377) | `--color-ml-on-brand` |  |
| `--color-on-violet` | `#FFFFFF` | `#FFFFFF` (L393) | — |  |
| `--color-paper` | `#F5E7C8` | `#F5E7C8` (L37) | — | PC-009 試卷紙（暗色模式改舊紙色，見下） |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L38) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L39) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L40) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#845956` | `var(--color-ml-warn)` (L394) | `--color-ml-warn` | 4.66 |
| `--color-rose-strong` | `#724D3D` | `#724D3D` (L395) | — | 白字 7.38 |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` | `rgba(44, 42, 41, 0.72)` (L381) | — |  |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` | `rgba(44, 42, 41, 0.42)` (L382) | — |  |
| `--color-subj-clay` | `#706347` | `#706347` (L106) | — | PC-011↓ 4.61 |
| `--color-subj-mist` | `#4D667E` | `#4D667E` (L105) | — | PC-020↓ 4.67 |
| `--color-subj-moss` | `#566953` | `#566953` (L104) | — | PC-032↓ 4.65 |
| `--color-subj-rose` | `#845956` | `#845956` (L107) | — | PC-003↓ 4.69 |
| `--color-subj-sage` | `#57685C` | `#57685C` (L103) | — | PC-016↓ 4.66 |
| `--color-subj-stone` | `#666557` | `#666557` (L108) | — | PC-028↓ 4.68 |
| `--color-surface` | `#F4F0EA` | `var(--color-ml-canvas)` (L366) | `--color-ml-canvas` |  |
| `--color-surface-raised` | `#FFFDF9` | `var(--color-ml-surface)` (L367) | `--color-ml-surface` |  |
| `--color-surface-sunken` | `#F0EBE3` | `var(--color-ml-muted)` (L368) | `--color-ml-muted` |  |
| `--color-text-primary` | `#E2E8F0` | `#E2E8F0` (L49) | — | = slate-200；正文繼續用 slate utilities |
| `--color-text-secondary` | `#94A3B8` | `#94A3B8` (L50) | — | = slate-400 |
| `--color-violet` | `#5B666F` | `#5B666F` (L391) | — | mist-strong 4.95 |
| `--color-violet-strong` | `#4A545C` | `#4A545C` (L392) | — | 白字 7.19 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1176) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L24) | — |  |
| `--grade-1` | `#334155` | `#334155` (L135) | — | 9.47 |
| `--grade-2` | `#475569` | `#475569` (L134) | — | 6.93 |
| `--grade-3` | `#7E22CE` | `#7E22CE` (L133) | — | 6.39 |
| `--grade-4` | `#1E52B8` | `#1E52B8` (L132) | — | 6.50 |
| `--grade-5` | `#16793A` | `#16793A` (L402) | — | 4.62（原 #177E3C 落莫蘭迪底只有 4.33） |
| `--grade-5s` | `#846208` | `#846208` (L401) | — | 4.74（原 #8A6608 落莫蘭迪底只有 4.44） |
| `--grade-5ss` | `#9A5B06` | `#9A5B06` (L129) | — | 4.96 |
| `--grade-u` | `#9D1449` | `#9D1449` (L136) | — | 7.30 —— 玫紅，唔用正紅（憲章 §大愛） |
| `--sidebar-w` | `0px` | `0px` (L930) | — |  |

## Resolved — `data-theme='cyber'`（暗色）

預設態再由 `:root[data-theme='cyber']` 覆蓋（specificity 0,1,1 贏 0,0,1）。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L902) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L16) | — |  |
| `--color-accent` | `#7a9e7e` | `var(--color-ml-sage)` (L232) | `--color-ml-sage` |  |
| `--color-accent-hover` | `#6b8f71` | `#6b8f71` (L234) | — | 規格 --moss-dark。深字掣 4.85 ✅ |
| `--color-accent-strong` | `#7a9e7e` | `var(--color-ml-sage)` (L233) | `--color-ml-sage` |  |
| `--color-bg-dark` | `#080C14` | `#080C14` (L47) | — |  |
| `--color-bg-dark-2` | `#0B1120` | `#0B1120` (L48) | — |  |
| `--color-gold` | `#b8956f` | `var(--color-ml-clay)` (L272) | `--color-ml-clay` | #b8956f 規格 --wood  4.89 |
| `--color-gold-soft` | `#e6ba8b` | `#e6ba8b` (L273) | — | wood ×1.25  7.60 —— 全站 1 處，做 border |
| `--color-gold-strong` | `#d4ab80` | `#d4ab80` (L274) | — | wood ×1.15  6.42 —— 全站 10 處做字色，故要 ≥4.5 |
| `--color-ink` | `#f0e8dc` | `var(--color-ml-ink)` (L216) | `--color-ml-ink` | #f0e8dc  11.16　規格 --text-primary |
| `--color-ink-faint` | `#6b6560` | `#6b6560` (L219) | — | 2.36 —— 停用控件／裝飾專用（原 2.28） |
| `--color-ink-muted` | `#a8a095` | `var(--color-ml-ink-soft)` (L218) | `--color-ml-ink-soft` | #a8a095  5.25　規格 --text-secondary（原 4.63，升咗） |
| `--color-ink-soft` | `#c1bab0` | `#c1bab0` (L217) | — | 7.05　規格冇呢一階，由 --cream 壓暗推導 |
| `--color-line` | `rgba(232, 224, 212, 0.06)` | `rgba(232, 224, 212, 0.06)` (L249) | — |  |
| `--color-line-strong` | `rgba(232, 224, 212, 0.12)` | `rgba(232, 224, 212, 0.12)` (L250) | — |  |
| `--color-ml-canvas` | `#1a1917` | `#1a1917` (L310) | — | 規格 --bg-primary |
| `--color-ml-clay` | `#b8956f` | `#b8956f` (L318) | — | 規格 --wood  文字 4.89 / 深字掣 6.33 |
| `--color-ml-good` | `#9ab89d` | `#9ab89d` (L320) | — | moss ×1.25   文字 6.28 —— 規格冇「達標」色， |
| `--color-ml-ink` | `#f0e8dc` | `#f0e8dc` (L315) | — | 規格 --text-primary    11.16 |
| `--color-ml-ink-soft` | `#a8a095` | `#a8a095` (L316) | — | 規格 --text-secondary   5.25 |
| `--color-ml-line` | `#918a7e` | `#918a7e` (L322) | — | 控件邊界 3.97（WCAG 1.4.11 ≥3:1）。 |
| `--color-ml-mist` | `#8a9fb8` | `#8a9fb8` (L328) | — | 規格 --mist  裝飾（4.99） |
| `--color-ml-muted` | `#2f2e2c` | `#2f2e2c` (L312) | — | 規格 --bg-elevated |
| `--color-ml-on-brand` | `#1a1917` | `#1a1917` (L326) | — | 實心掣上嘅字（Dark 用深字，規格 §3.3 一致） |
| `--color-ml-rose` | `#c49a9a` | `#c49a9a` (L327) | — | 規格 --rose  裝飾（5.45） |
| `--color-ml-sage` | `#7a9e7e` | `#7a9e7e` (L317) | — | 規格 --moss  文字 4.53 / 深字掣 5.87 |
| `--color-ml-surface` | `#252422` | `#252422` (L311) | — | 規格 --bg-card |
| `--color-ml-warn` | `#c49a9a` | `#c49a9a` (L319) | — | 規格 --rose  文字 5.45 / 深字掣 7.06 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L43) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L44) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L46) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L45) | — |  |
| `--color-on-accent` | `#1a1917` | `var(--color-ml-on-brand)` (L240) | `--color-ml-on-brand` | #1a1917 |
| `--color-on-violet` | `#1a1917` | `#1a1917` (L279) | — | 深字 on 霧藍 = 6.47（白字只有 1.9） |
| `--color-paper` | `#DDD3C6` | `#DDD3C6` (L257) | — | PC-026 舊紙。純白紙落 #1a1917 頁底係 17.57， |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L38) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L39) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L40) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#c49a9a` | `var(--color-ml-warn)` (L277) | `--color-ml-warn` | #c49a9a 規格 --rose  5.45 |
| `--color-rose-strong` | `#b89191` | `#b89191` (L278) | — | rose ×0.94  4.84 —— 有 1 處做字色，故要 ≥4.5 |
| `--color-scrim` | `rgba(10, 9, 9, 0.78)` | `rgba(10, 9, 9, 0.78)` (L251) | — |  |
| `--color-scrim-soft` | `rgba(10, 9, 9, 0.50)` | `rgba(10, 9, 9, 0.50)` (L252) | — |  |
| `--color-subj-clay` | `#b8956f` | `#b8956f` (L337) | — | 規格 --wood   4.89 |
| `--color-subj-mist` | `#8a9fb8` | `#8a9fb8` (L336) | — | 規格 --mist   4.99 |
| `--color-subj-moss` | `#9ab89d` | `#9ab89d` (L335) | — | moss ×1.25    6.28 |
| `--color-subj-rose` | `#c49a9a` | `#c49a9a` (L338) | — | 規格 --rose   5.45 |
| `--color-subj-sage` | `#7a9e7e` | `#7a9e7e` (L334) | — | 規格 --moss   4.53 |
| `--color-subj-stone` | `#c1bab0` | `#c1bab0` (L339) | — | 岩灰          7.05 |
| `--color-surface` | `#1a1917` | `var(--color-ml-canvas)` (L212) | `--color-ml-canvas` | #1a1917 規格 --bg-primary |
| `--color-surface-raised` | `#252422` | `var(--color-ml-surface)` (L213) | `--color-ml-surface` | #252422 規格 --bg-card |
| `--color-surface-sunken` | `#2f2e2c` | `var(--color-ml-muted)` (L214) | `--color-ml-muted` | #2f2e2c 規格 --bg-elevated |
| `--color-text-primary` | `#E2E8F0` | `#E2E8F0` (L49) | — | = slate-200；正文繼續用 slate utilities |
| `--color-text-secondary` | `#94A3B8` | `#94A3B8` (L50) | — | = slate-400 |
| `--color-violet` | `#8a9fb8` | `var(--color-ml-mist)` (L275) | `--color-ml-mist` | #8a9fb8 規格 --mist  4.99 |
| `--color-violet-strong` | `#a8c2e0` | `#a8c2e0` (L276) | — | mist ×1.22  7.40 —— 3 處做字色 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1176) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L24) | — |  |
| `--grade-1` | `#a8a095` | `#a8a095` (L294) | — | 規格 --text-secondary 5.25 |
| `--grade-2` | `#c1bab0` | `#c1bab0` (L293) | — | 岩灰                7.05 |
| `--grade-3` | `#b8956f` | `#b8956f` (L292) | — | 規格 --wood         4.89 |
| `--grade-4` | `#8a9fb8` | `#8a9fb8` (L291) | — | 規格 --mist         4.99 —— 同 5 分開色相 |
| `--grade-5` | `#7a9e7e` | `#7a9e7e` (L290) | — | 規格 --moss         4.53 |
| `--grade-5s` | `#9ab89d` | `#9ab89d` (L289) | — | moss ×1.25          6.28 |
| `--grade-5ss` | `#e8e0d4` | `#e8e0d4` (L288) | — | 規格 --cream        10.36 |
| `--grade-u` | `#c49a9a` | `#c49a9a` (L295) | — | 規格 --rose         5.45 —— 唔用正紅（憲章 §7） |
| `--sidebar-w` | `0px` | `0px` (L930) | — |  |

## 其他 scope

唔屬於上面兩個全站狀態嘅宣告（media query、無障礙 class、屬性 scope）。
列出嚟係因為漏咗一個 scope，就係一個永遠搵唔到嘅「點解個值唔啱」。

| token | 值 | scope | media | 行 |
|---|---|---|---|---|
| `--color-ink` | `#F0E8DC` | `.on-dark-overlay` | — | L435 |
| `--color-ink-soft` | `#C1BAB0` | `.on-dark-overlay` | — | L436 |
| `--color-ink-muted` | `#A8A095` | `.on-dark-overlay` | — | L437 |
| `--color-ink-faint` | `#6B6560` | `.on-dark-overlay` | — | L438 |
| `--color-accent` | `#7A9E7E` | `.on-dark-overlay` | — | L439 |
| `--color-accent-strong` | `#7A9E7E` | `.on-dark-overlay` | — | L440 |
| `--color-on-accent` | `#1A1917` | `.on-dark-overlay` | — | L441 |
| `--color-surface-sunken` | `#2F2E2C` | `.on-dark-overlay` | — | L442 |
| `--color-line` | `rgba(232, 224, 212, 0.10)` | `.on-dark-overlay` | — | L443 |
| `--color-line-strong` | `rgba(232, 224, 212, 0.20)` | `.on-dark-overlay` | — | L444 |
| `--bottom-nav-h` | `3.5rem` | `html[data-bottomnav='on']` | — | L905 |
| `--bottom-nav-h` | `0px` | `html[data-bottomnav='on']` | `@media (min-width: 768px)` | L912 |
| `--sidebar-w` | `5rem` | `html[data-sidebar='on']` | `@media (min-width: 48rem)` | L937 |
| `--sidebar-w` | `260px` | `html[data-sidebar='on']` | `@media (min-width: 80rem)` | L942 |
| `--particle-speed` | `20s` | `.particle-bg` | — | L1010 |
| `--particle-alpha` | `0.15` | `.particle-bg` | — | L1011 |
| `--particle-speed` | `12s` | `.particle-combo-1` | — | L1021 |
| `--particle-speed` | `8s` | `.particle-combo-2` | — | L1022 |
| `--particle-speed` | `5s` | `.particle-combo-3` | — | L1023 |
| `--particle-speed` | `40s` | `.particle-calm` | — | L1026 |
| `--particle-alpha` | `0.05` | `.particle-calm` | — | L1026 |
| `--flame-rgb` | `0, 245, 212` | `.combo-flame` | — | L1119 |
| `--flame-speed` | `1.5s` | `.combo-flame` | — | L1120 |

## 掃過嘅 block

| 行 | selector |
|---|---|
| L13 | `@theme` |
| L209 | `:root[data-theme='cyber']` |
| L365 | `:root` |
| L434 | `.on-dark-overlay` |
| L447 | `body` |
| L453 | `html` |
| L472 | `html` |
| L483 | `img, svg, video, canvas, iframe` |
| L488 | `img, video` |
| L495 | `body` |
| L499 | `.katex` |
| L506 | `.animate-on-scroll` |
| L512 | `.animate-on-scroll.visible` |
| L516 | `.stagger-1` |
| L517 | `.stagger-2` |
| L518 | `.stagger-3` |
| L519 | `.stagger-4` |
| L520 | `@media (prefers-reduced-motion: reduce)` |
| L521 | `@media (prefers-reduced-motion: reduce) › .animate-on-scroll` |
| L530 | `@keyframes hero-rise` |
| L531 | `@keyframes hero-rise › from` |
| L532 | `@keyframes hero-rise › to` |
| L534 | `.hero-rise` |
| L535 | `.hero-rise-1` |
| L536 | `.hero-rise-2` |
| L537 | `.hero-rise-3` |
| L538 | `@media (prefers-reduced-motion: reduce)` |
| L539 | `@media (prefers-reduced-motion: reduce) › .hero-rise` |
| L542 | `::-webkit-scrollbar` |
| L545 | `::-webkit-scrollbar-track` |
| L548 | `::-webkit-scrollbar-thumb` |
| L564 | `@keyframes pop-in` |
| L565 | `@keyframes pop-in › 0%` |
| L566 | `@keyframes pop-in › 100%` |
| L569 | `@keyframes slide-up` |
| L570 | `@keyframes slide-up › from` |
| L571 | `@keyframes slide-up › to` |
| L574 | `@keyframes fill-bar` |
| L575 | `@keyframes fill-bar › from` |
| L576 | `@keyframes fill-bar › to` |
| L579 | `.animate-pop-in` |
| L583 | `.animate-slide-up` |
| L597 | `@media print` |
| L608 | `@media print › nav, footer:not(.print-keep), button:not(.print-keep), .no-print, nextjs-portal` |
| L614 | `@media print › html, body` |
| L623 | `@media print › .min-h-screen` |
| L627 | `@media print › body, body *` |
| L639 | `@media print › [class*="bg-slate-9"], [class*="bg-slate-8"], [class*="bg-amber-5"], [class*="bg-rose-5"], [class*="bg-indigo-5"], [class*="bg-green-5"], [class*="bg-emerald-5"]` |
| L646 | `@media print › @page` |
| L651 | `@media print › .rounded-2xl, .rounded-xl` |
| L657 | `@media print › .paper-sheet` |
| L663 | `@media print › .paper-q` |
| L668 | `@media print › .paper-write-space` |
| L691 | `html.no-motion *, html.no-motion *::before, html.no-motion *::after` |
| L696 | `html.no-motion` |
| L706 | `@keyframes skeleton-breathe` |
| L707 | `@keyframes skeleton-breathe › 0%, 100%` |
| L708 | `@keyframes skeleton-breathe › 50%` |
| L710 | `.skeleton` |
| L716 | `@media (prefers-reduced-motion: reduce)` |
| L717 | `@media (prefers-reduced-motion: reduce) › .skeleton` |
| L724 | `@font-face` |
| L731 | `html.font-easy body` |
| L741 | `html.font-easy .font-serif` |
| L747 | `html.font-easy p, html.font-easy li` |
| L759 | `html.a11y-spacing body, html.a11y-spacing p, html.a11y-spacing li, html.a11y-spacing label, html.a11y-spacing button` |
| L797 | `html.focus-light .focus-dim` |
| L802 | `html.focus-light .focus-dim:hover, html.focus-light .focus-dim:focus-within` |
| L814 | `.katex-display` |
| L824 | `.skip-link` |
| L834 | `.skip-link:focus` |
| L855 | `@keyframes cmd-hl-in` |
| L856 | `@keyframes cmd-hl-in › from` |
| L857 | `@keyframes cmd-hl-in › to` |
| L859 | `.cmd-hl` |
| L868 | `.cmd-hl-soft` |
| L872 | `@media (prefers-reduced-motion: reduce)` |
| L873 | `@media (prefers-reduced-motion: reduce) › .cmd-hl` |
| L879 | `@keyframes sand-stream` |
| L880 | `@keyframes sand-stream › to` |
| L882 | `.hourglass-stream` |
| L886 | `.hourglass-soft .hourglass-stream` |
| L889 | `@media (prefers-reduced-motion: reduce)` |
| L890 | `@media (prefers-reduced-motion: reduce) › .hourglass-stream` |
| L901 | `:root` |
| L904 | `html[data-bottomnav='on']` |
| L910 | `@media (min-width: 768px)` |
| L911 | `@media (min-width: 768px) › html[data-bottomnav='on']` |
| L915 | `.floating-bottom` |
| L929 | `:root` |
| L935 | `@media (min-width: 48rem)` |
| L936 | `@media (min-width: 48rem) › html[data-sidebar='on']` |
| L940 | `@media (min-width: 80rem)` |
| L941 | `@media (min-width: 80rem) › html[data-sidebar='on']` |
| L949 | `html.no-motion .mascot` |
| L954 | `.floating-left` |
| L957 | `.floating-left-2` |
| L962 | `.floating-bottom-2` |
| L965 | `.floating-bottom-3` |
| L977 | `.floating-panel-max-h` |
| L1009 | `.particle-bg` |
| L1016 | `@keyframes particle-drift` |
| L1017 | `@keyframes particle-drift › from` |
| L1018 | `@keyframes particle-drift › to` |
| L1021 | `.particle-combo-1` |
| L1022 | `.particle-combo-2` |
| L1023 | `.particle-combo-3` |
| L1026 | `.particle-calm` |
| L1031 | `.scatter-title` |
| L1034 | `@keyframes scatter-in` |
| L1035 | `@keyframes scatter-in › from` |
| L1036 | `@keyframes scatter-in › to` |
| L1044 | `.shockwave` |
| L1056 | `@keyframes shockwave-expand` |
| L1057 | `@keyframes shockwave-expand › from` |
| L1058 | `@keyframes shockwave-expand › to` |
| L1071 | `.pulse-correct` |
| L1074 | `@keyframes pulse-correct` |
| L1075 | `@keyframes pulse-correct › 0%` |
| L1076 | `@keyframes pulse-correct › 100%` |
| L1080 | `.shockwave-gold` |
| L1086 | `.blindspot-in` |
| L1089 | `@keyframes blindspot-in` |
| L1090 | `@keyframes blindspot-in › from` |
| L1091 | `@keyframes blindspot-in › to` |
| L1097 | `.ring-draw` |
| L1100 | `@keyframes ring-draw` |
| L1101 | `@keyframes ring-draw › from` |
| L1106 | `.radar-grow` |
| L1111 | `@keyframes radar-grow` |
| L1112 | `@keyframes radar-grow › from` |
| L1113 | `@keyframes radar-grow › to` |
| L1118 | `.combo-flame` |
| L1126 | `@keyframes flame-pulse` |
| L1127 | `@keyframes flame-pulse › 0%, 100%` |
| L1128 | `@keyframes flame-pulse › 50%` |
| L1133 | `.carousel-3d` |
| L1134 | `.carousel-card` |
| L1138 | `.carousel-card:hover` |
| L1139 | `.carousel-card[aria-current='true']` |
| L1143 | `.ring-rotate` |
| L1144 | `@keyframes ring-rotate` |
| L1145 | `@keyframes ring-rotate › from` |
| L1146 | `@keyframes ring-rotate › to` |
| L1174 | `:root` |
| L1186 | `.achievement-pop` |
| L1189 | `@keyframes achievement-pop` |
| L1190 | `@keyframes achievement-pop › from` |
| L1191 | `@keyframes achievement-pop › to` |
| L1201 | `.relax-in` |
| L1216 | `@keyframes ml-q-enter` |
| L1217 | `@keyframes ml-q-enter › from` |
| L1218 | `@keyframes ml-q-enter › to` |
| L1220 | `@keyframes ml-q-leave` |
| L1221 | `@keyframes ml-q-leave › from` |
| L1222 | `@keyframes ml-q-leave › to` |
| L1224 | `.ml-q-enter` |
| L1225 | `.ml-q-leave` |
| L1229 | `.ml-press` |
| L1230 | `.ml-press:active` |
| L1234 | `.ml-pick-on` |
| L1235 | `.ml-pick` |
| L1238 | `@keyframes ml-reveal` |
| L1239 | `@keyframes ml-reveal › from` |
| L1240 | `@keyframes ml-reveal › to` |
| L1242 | `.ml-reveal` |
| L1245 | `@keyframes ml-modal-in` |
| L1246 | `@keyframes ml-modal-in › from` |
| L1247 | `@keyframes ml-modal-in › to` |
| L1249 | `.ml-modal-in` |
| L1253 | `.ml-stagger` |
| L1259 | `.ml-lift` |
| L1260 | `.ml-lift:hover` |
| L1265 | `@keyframes ml-notice` |
| L1266 | `@keyframes ml-notice › 0%, 100%` |
| L1267 | `@keyframes ml-notice › 50%` |
| L1269 | `.ml-notice` |
| L1273 | `@media (prefers-reduced-motion: reduce)` |
| L1274 | `@media (prefers-reduced-motion: reduce) › .ml-q-enter, .ml-q-leave, .ml-reveal, .ml-modal-in, .ml-stagger` |
| L1278 | `@media (prefers-reduced-motion: reduce) › .ml-press, .ml-pick, .ml-lift` |
| L1279 | `@media (prefers-reduced-motion: reduce) › .ml-press:active, .ml-pick-on, .ml-lift:hover` |
| L1280 | `@media (prefers-reduced-motion: reduce) › .ml-notice` |
| L1292 | `html.font-easy .ml-q-enter, html.font-easy .ml-q-leave, html.font-easy .ml-reveal, html.font-easy .ml-modal-in, html.font-easy .ml-stagger, html.font-easy .ml-notice` |
| L1299 | `html.font-easy .ml-press, html.font-easy .ml-pick, html.font-easy .ml-lift` |
| L1304 | `html.font-easy .ml-press:active, html.font-easy .ml-pick-on, html.font-easy .ml-lift:hover` |
| L1309 | `@keyframes relax-in` |
| L1310 | `@keyframes relax-in › from` |
| L1311 | `@keyframes relax-in › to` |
| L1318 | `:root[data-theme='light'] .particle-bg, :root[data-theme='light'] .combo-flame` |
| L1326 | `html.font-easy .particle-bg, html.font-easy .combo-flame` |
| L1333 | `html.font-easy .scatter-title, html.font-easy .achievement-pop, html.font-easy .shockwave, html.font-easy .ring-rotate, html.font-easy .carousel-card` |
| L1340 | `html.font-easy .shockwave` |
| L1347 | `html.font-easy .pulse-correct, html.font-easy .blindspot-in, html.font-easy .ring-draw, html.font-easy .radar-grow` |
| L1364 | `html.font-easy .relax-in, html.font-easy .animate-slide-up, html.font-easy .animate-pop-in, html.font-easy .skeleton, html.font-easy .cmd-hl` |
| L1371 | `@media (prefers-reduced-motion: reduce)` |
| L1377 | `@media (prefers-reduced-motion: reduce) › .particle-bg, .combo-flame, .scatter-title, .achievement-pop, .ring-rotate, .carousel-card` |
| L1381 | `@media (prefers-reduced-motion: reduce) › .scatter-title` |
| L1382 | `@media (prefers-reduced-motion: reduce) › .achievement-pop` |
| L1383 | `@media (prefers-reduced-motion: reduce) › .carousel-card:hover` |
| L1384 | `@media (prefers-reduced-motion: reduce) › .shockwave` |
| L1391 | `@media (prefers-reduced-motion: reduce) › .pulse-correct, .blindspot-in, .ring-draw, .radar-grow, .relax-in` |
| L1406 | `@media (prefers-reduced-motion: reduce) › .animate-slide-up, .animate-pop-in` |
| L1416 | `@media (max-height: 760px)` |
| L1417 | `@media (max-height: 760px) › .sidebar-quote` |
| L1424 | `@media (max-width: 639px)` |
| L1425 | `@media (max-width: 639px) › section:has([data-continue-card]) .hero-mascot` |
| L1432 | `@media (max-width: 767px)` |
| L1433 | `@media (max-width: 767px) › body:has([data-a11y-trigger]) .a11y-fab` |
