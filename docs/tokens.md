<!-- generated from app/globals.css by scripts/gen-token-doc.mjs — do not edit -->

# 設計 token

**唯一來源係 `app/globals.css`，唔係呢個檔。** 呢度所有數字都由嗰邊抽出嚟。
改 token 改 CSS，然後重跑：

```bash
node scripts/gen-token-doc.mjs
```

掃到 **165** 個 custom property 宣告，分佈喺 **223** 個 block。

## ⚠️ 被覆蓋嘅宣告

同一個 token 喺預設態宣告咗多過一次。**上面嗰啲畫唔到** —— 後面嗰個贏。
照住早嗰個值去設計，出嚟嘅顏色同實際站唔同。

| token | 畫唔到嘅宣告 | 真正生效 | resolved |
|---|---|---|---|
| `--color-surface` | `#F4F0EA` (L53) | `var(--color-ml-canvas)` (L337) | `#F4F0EA` |
| `--color-surface-raised` | `#FFFDF9` (L54) | `var(--color-ml-surface)` (L338) | `#FFFDF9` |
| `--color-surface-sunken` | `#F0EBE3` (L55) | `var(--color-ml-muted)` (L339) | `#F0EBE3` |
| `--color-ink` | `#2C2A29` (L56) | `var(--color-ml-ink)` (L340) | `#2C2A29` |
| `--color-ink-soft` | `#3D3A38` (L57) | `#3D3A38` (L341) | `#3D3A38` |
| `--color-ink-muted` | `#69635F` (L58) | `var(--color-ml-ink-soft)` (L342) | `#69635F` |
| `--color-ink-faint` | `#9C958D` (L60) | `#9C958D` (L343) | `#9C958D` |
| `--color-accent` | `#57685C` (L61) | `var(--color-ml-sage)` (L345) | `#57685C` |
| `--color-accent-strong` | `#57685C` (L62) | `var(--color-ml-sage)` (L346) | `#57685C` |
| `--color-accent-hover` | `#4D584A` (L63) | `#4D584A` (L347) | `#4D584A` |
| `--color-on-accent` | `#FFFFFF` (L64) | `var(--color-ml-on-brand)` (L348) | `#FFFFFF` |
| `--color-line` | `rgba(44, 42, 41, 0.08)` (L65) | `rgba(44, 42, 41, 0.08)` (L349) | `rgba(44, 42, 41, 0.08)` |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` (L66) | `rgba(44, 42, 41, 0.16)` (L350) | `rgba(44, 42, 41, 0.16)` |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` (L69) | `rgba(44, 42, 41, 0.72)` (L352) | `rgba(44, 42, 41, 0.72)` |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` (L70) | `rgba(44, 42, 41, 0.42)` (L353) | `rgba(44, 42, 41, 0.42)` |
| `--color-gold` | `#706347` (L87) | `var(--color-ml-clay)` (L359) | `#706347` |
| `--color-gold-soft` | `#B7A6A3` (L88) | `var(--color-ml-rose)` (L360) | `#B7A6A3` |
| `--color-gold-strong` | `#5F5144` (L89) | `#5F5144` (L361) | `#5F5144` |
| `--color-violet` | `#5B666F` (L90) | `#5B666F` (L362) | `#5B666F` |
| `--color-violet-strong` | `#4A545C` (L91) | `#4A545C` (L363) | `#4A545C` |
| `--color-rose` | `#845956` (L92) | `var(--color-ml-warn)` (L365) | `#845956` |
| `--color-rose-strong` | `#724D3D` (L93) | `#724D3D` (L366) | `#724D3D` |
| `--color-on-violet` | `#FFFFFF` (L94) | `#FFFFFF` (L364) | `#FFFFFF` |
| `--grade-5s` | `#846208` (L101) | `#846208` (L372) | `#846208` |
| `--grade-5` | `#16793A` (L102) | `#16793A` (L373) | `#16793A` |
| `--color-ml-rose` | `#C5908B` (L149) | `#B7A6A3` (L154) | `#B7A6A3` |
| `--color-ml-mist` | `#AFC2D1` (L150) | `#8A9BA8` (L155) | `#8A9BA8` |
| `--ease-spring-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` (L1101) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1102) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` |

## Resolved — 預設態（冇 `data-theme` 屬性）

@theme ＋ 裸 `:root`，last-wins。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L851) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L15) | — |  |
| `--color-accent` | `#57685C` | `var(--color-ml-sage)` (L345) | `--color-ml-sage` | 4.75 |
| `--color-accent-hover` | `#4D584A` | `#4D584A` (L347) | — | 白字 7.47 |
| `--color-accent-strong` | `#57685C` | `var(--color-ml-sage)` (L346) | `--color-ml-sage` | 白字掣 5.64 |
| `--color-gold` | `#706347` | `var(--color-ml-clay)` (L359) | `--color-ml-clay` | 4.56（四底面） |
| `--color-gold-soft` | `#B7A6A3` | `var(--color-ml-rose)` (L360) | `--color-ml-rose` | 1.97 —— 永遠唔可以做字色 |
| `--color-gold-strong` | `#5F5144` | `#5F5144` (L361) | — | 5.94 / 白字 7.64 |
| `--color-ink` | `#2C2A29` | `var(--color-ml-ink)` (L340) | `--color-ml-ink` |  |
| `--color-ink-faint` | `#9C958D` | `#9C958D` (L343) | — | 2.49 —— 同上游一樣，只准用於停用控件／ |
| `--color-ink-muted` | `#69635F` | `var(--color-ml-ink-soft)` (L342) | `--color-ml-ink-soft` | 4.84 |
| `--color-ink-soft` | `#3D3A38` | `#3D3A38` (L341) | — | 9.51 |
| `--color-line` | `rgba(44, 42, 41, 0.08)` | `rgba(44, 42, 41, 0.08)` (L349) | — |  |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` | `rgba(44, 42, 41, 0.16)` (L350) | — |  |
| `--color-ml-canvas` | `#F4F0EA` | `#F4F0EA` (L132) | — | 頁面底 |
| `--color-ml-clay` | `#706347` | `#706347` (L141) | — | PC-011↓ 強調、失分標示（4.56 / 白字掣 5.63） |
| `--color-ml-good` | `#566953` | `#566953` (L144) | — | PC-032↓ 達標（4.59 / 白字掣 5.68） |
| `--color-ml-ink` | `#2C2A29` | `#2C2A29` (L136) | — | 正文（12.04） |
| `--color-ml-ink-soft` | `#69635F` | `#69635F` (L137) | — | 輔助（4.57，四底面） |
| `--color-ml-line` | `#8A8377` | `#8A8377` (L145) | — | PC-027↓ 控件邊界（3.16，WCAG 1.4.11）。 |
| `--color-ml-mist` | `#8A9BA8` | `#8A9BA8` (L155) | — | 資訊／交通 —— 純裝飾填色 |
| `--color-ml-muted` | `#F0EBE3` | `#F0EBE3` (L134) | — | 次級區塊。⚠️ 規格原值 #E8E2D9 太深， |
| `--color-ml-on-brand` | `#FFFFFF` | `#FFFFFF` (L148) | — | 實心掣上嘅字（Light 用白字） |
| `--color-ml-rose` | `#B7A6A3` | `#B7A6A3` (L154) | — | 情緒／關懷 —— 純裝飾填色 |
| `--color-ml-sage` | `#57685C` | `#57685C` (L140) | — | PC-016↓ 主行動、正確（4.59 / 白字掣 5.68） |
| `--color-ml-surface` | `#FFFDF9` | `#FFFDF9` (L133) | — | 卡片 |
| `--color-ml-warn` | `#845956` | `#845956` (L142) | — | PC-003↓ 超時、警告（4.58 / 白字掣 5.66）。 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L43) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L44) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L46) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L45) | — |  |
| `--color-on-accent` | `#FFFFFF` | `var(--color-ml-on-brand)` (L348) | `--color-ml-on-brand` |  |
| `--color-on-violet` | `#FFFFFF` | `#FFFFFF` (L364) | — |  |
| `--color-paper` | `#F5E7C8` | `#F5E7C8` (L36) | — | PC-009 試卷紙（暗色模式改舊紙色，見下） |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L37) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L38) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L39) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#845956` | `var(--color-ml-warn)` (L365) | `--color-ml-warn` | 4.66 |
| `--color-rose-strong` | `#724D3D` | `#724D3D` (L366) | — | 白字 7.38 |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` | `rgba(44, 42, 41, 0.72)` (L352) | — |  |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` | `rgba(44, 42, 41, 0.42)` (L353) | — |  |
| `--color-subj-clay` | `#706347` | `#706347` (L82) | — | PC-011↓ 4.61 |
| `--color-subj-mist` | `#4D667E` | `#4D667E` (L81) | — | PC-020↓ 4.67 |
| `--color-subj-moss` | `#566953` | `#566953` (L80) | — | PC-032↓ 4.65 |
| `--color-subj-rose` | `#845956` | `#845956` (L83) | — | PC-003↓ 4.69 |
| `--color-subj-sage` | `#57685C` | `#57685C` (L79) | — | PC-016↓ 4.66 |
| `--color-subj-stone` | `#666557` | `#666557` (L84) | — | PC-028↓ 4.68 |
| `--color-surface` | `#F4F0EA` | `var(--color-ml-canvas)` (L337) | `--color-ml-canvas` |  |
| `--color-surface-raised` | `#FFFDF9` | `var(--color-ml-surface)` (L338) | `--color-ml-surface` |  |
| `--color-surface-sunken` | `#F0EBE3` | `var(--color-ml-muted)` (L339) | `--color-ml-muted` |  |
| `--color-violet` | `#5B666F` | `#5B666F` (L362) | — | mist-strong 4.95 |
| `--color-violet-strong` | `#4A545C` | `#4A545C` (L363) | — | 白字 7.19 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1102) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L23) | — |  |
| `--grade-1` | `#334155` | `#334155` (L106) | — | 9.47 |
| `--grade-2` | `#475569` | `#475569` (L105) | — | 6.93 |
| `--grade-3` | `#7E22CE` | `#7E22CE` (L104) | — | 6.39 |
| `--grade-4` | `#1E52B8` | `#1E52B8` (L103) | — | 6.50 |
| `--grade-5` | `#16793A` | `#16793A` (L373) | — | 4.62（原 #177E3C 落莫蘭迪底只有 4.33） |
| `--grade-5s` | `#846208` | `#846208` (L372) | — | 4.74（原 #8A6608 落莫蘭迪底只有 4.44） |
| `--grade-5ss` | `#9A5B06` | `#9A5B06` (L100) | — | 4.96 |
| `--grade-u` | `#845956` | `#845956` (L107) | — | = rose／warn，唔用正紅 |
| `--sidebar-w` | `0px` | `0px` (L879) | — |  |

## Resolved — `data-theme='cyber'`（暗色）

預設態再由 `:root[data-theme='cyber']` 覆蓋（specificity 0,1,1 贏 0,0,1）。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L851) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L15) | — |  |
| `--color-accent` | `#7a9e7e` | `var(--color-ml-sage)` (L203) | `--color-ml-sage` |  |
| `--color-accent-hover` | `#6b8f71` | `#6b8f71` (L205) | — | 規格 --moss-dark。深字掣 4.85 ✅ |
| `--color-accent-strong` | `#7a9e7e` | `var(--color-ml-sage)` (L204) | `--color-ml-sage` |  |
| `--color-gold` | `#b8956f` | `var(--color-ml-clay)` (L243) | `--color-ml-clay` | #b8956f 規格 --wood  4.89 |
| `--color-gold-soft` | `#e6ba8b` | `#e6ba8b` (L244) | — | wood ×1.25  7.60 —— 全站 1 處，做 border |
| `--color-gold-strong` | `#d4ab80` | `#d4ab80` (L245) | — | wood ×1.15  6.42 —— 全站 10 處做字色，故要 ≥4.5 |
| `--color-ink` | `#f0e8dc` | `var(--color-ml-ink)` (L187) | `--color-ml-ink` | #f0e8dc  11.16　規格 --text-primary |
| `--color-ink-faint` | `#6b6560` | `#6b6560` (L190) | — | 2.36 —— 停用控件／裝飾專用（原 2.28） |
| `--color-ink-muted` | `#a8a095` | `var(--color-ml-ink-soft)` (L189) | `--color-ml-ink-soft` | #a8a095  5.25　規格 --text-secondary（原 4.63，升咗） |
| `--color-ink-soft` | `#c1bab0` | `#c1bab0` (L188) | — | 7.05　規格冇呢一階，由 --cream 壓暗推導 |
| `--color-line` | `rgba(232, 224, 212, 0.06)` | `rgba(232, 224, 212, 0.06)` (L220) | — |  |
| `--color-line-strong` | `rgba(232, 224, 212, 0.12)` | `rgba(232, 224, 212, 0.12)` (L221) | — |  |
| `--color-ml-canvas` | `#1a1917` | `#1a1917` (L281) | — | 規格 --bg-primary |
| `--color-ml-clay` | `#b8956f` | `#b8956f` (L289) | — | 規格 --wood  文字 4.89 / 深字掣 6.33 |
| `--color-ml-good` | `#9ab89d` | `#9ab89d` (L291) | — | moss ×1.25   文字 6.28 —— 規格冇「達標」色， |
| `--color-ml-ink` | `#f0e8dc` | `#f0e8dc` (L286) | — | 規格 --text-primary    11.16 |
| `--color-ml-ink-soft` | `#a8a095` | `#a8a095` (L287) | — | 規格 --text-secondary   5.25 |
| `--color-ml-line` | `#918a7e` | `#918a7e` (L293) | — | 控件邊界 3.97（WCAG 1.4.11 ≥3:1）。 |
| `--color-ml-mist` | `#8a9fb8` | `#8a9fb8` (L299) | — | 規格 --mist  裝飾（4.99） |
| `--color-ml-muted` | `#2f2e2c` | `#2f2e2c` (L283) | — | 規格 --bg-elevated |
| `--color-ml-on-brand` | `#1a1917` | `#1a1917` (L297) | — | 實心掣上嘅字（Dark 用深字，規格 §3.3 一致） |
| `--color-ml-rose` | `#c49a9a` | `#c49a9a` (L298) | — | 規格 --rose  裝飾（5.45） |
| `--color-ml-sage` | `#7a9e7e` | `#7a9e7e` (L288) | — | 規格 --moss  文字 4.53 / 深字掣 5.87 |
| `--color-ml-surface` | `#252422` | `#252422` (L282) | — | 規格 --bg-card |
| `--color-ml-warn` | `#c49a9a` | `#c49a9a` (L290) | — | 規格 --rose  文字 5.45 / 深字掣 7.06 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L43) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L44) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L46) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L45) | — |  |
| `--color-on-accent` | `#1a1917` | `var(--color-ml-on-brand)` (L211) | `--color-ml-on-brand` | #1a1917 |
| `--color-on-violet` | `#1a1917` | `#1a1917` (L250) | — | 深字 on 霧藍 = 6.47（白字只有 1.9） |
| `--color-paper` | `#DDD3C6` | `#DDD3C6` (L228) | — | PC-026 舊紙。純白紙落 #1a1917 頁底係 17.57， |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L37) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L38) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L39) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#c49a9a` | `var(--color-ml-warn)` (L248) | `--color-ml-warn` | #c49a9a 規格 --rose  5.45 |
| `--color-rose-strong` | `#b89191` | `#b89191` (L249) | — | rose ×0.94  4.84 —— 有 1 處做字色，故要 ≥4.5 |
| `--color-scrim` | `rgba(10, 9, 9, 0.78)` | `rgba(10, 9, 9, 0.78)` (L222) | — |  |
| `--color-scrim-soft` | `rgba(10, 9, 9, 0.50)` | `rgba(10, 9, 9, 0.50)` (L223) | — |  |
| `--color-subj-clay` | `#b8956f` | `#b8956f` (L308) | — | 規格 --wood   4.89 |
| `--color-subj-mist` | `#8a9fb8` | `#8a9fb8` (L307) | — | 規格 --mist   4.99 |
| `--color-subj-moss` | `#9ab89d` | `#9ab89d` (L306) | — | moss ×1.25    6.28 |
| `--color-subj-rose` | `#c49a9a` | `#c49a9a` (L309) | — | 規格 --rose   5.45 |
| `--color-subj-sage` | `#7a9e7e` | `#7a9e7e` (L305) | — | 規格 --moss   4.53 |
| `--color-subj-stone` | `#c1bab0` | `#c1bab0` (L310) | — | 岩灰          7.05 |
| `--color-surface` | `#1a1917` | `var(--color-ml-canvas)` (L183) | `--color-ml-canvas` | #1a1917 規格 --bg-primary |
| `--color-surface-raised` | `#252422` | `var(--color-ml-surface)` (L184) | `--color-ml-surface` | #252422 規格 --bg-card |
| `--color-surface-sunken` | `#2f2e2c` | `var(--color-ml-muted)` (L185) | `--color-ml-muted` | #2f2e2c 規格 --bg-elevated |
| `--color-violet` | `#8a9fb8` | `var(--color-ml-mist)` (L246) | `--color-ml-mist` | #8a9fb8 規格 --mist  4.99 |
| `--color-violet-strong` | `#a8c2e0` | `#a8c2e0` (L247) | — | mist ×1.22  7.40 —— 3 處做字色 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1102) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L23) | — |  |
| `--grade-1` | `#a8a095` | `#a8a095` (L265) | — | 規格 --text-secondary 5.25 |
| `--grade-2` | `#c1bab0` | `#c1bab0` (L264) | — | 岩灰                7.05 |
| `--grade-3` | `#b8956f` | `#b8956f` (L263) | — | 規格 --wood         4.89 |
| `--grade-4` | `#8a9fb8` | `#8a9fb8` (L262) | — | 規格 --mist         4.99 —— 同 5 分開色相 |
| `--grade-5` | `#7a9e7e` | `#7a9e7e` (L261) | — | 規格 --moss         4.53 |
| `--grade-5s` | `#9ab89d` | `#9ab89d` (L260) | — | moss ×1.25          6.28 |
| `--grade-5ss` | `#e8e0d4` | `#e8e0d4` (L259) | — | 規格 --cream        10.36 |
| `--grade-u` | `#c49a9a` | `#c49a9a` (L266) | — | 規格 --rose         5.45 —— 唔用正紅（憲章 §7） |
| `--sidebar-w` | `0px` | `0px` (L879) | — |  |

## 其他 scope

唔屬於上面兩個全站狀態嘅宣告（media query、無障礙 class、屬性 scope）。
列出嚟係因為漏咗一個 scope，就係一個永遠搵唔到嘅「點解個值唔啱」。

| token | 值 | scope | media | 行 |
|---|---|---|---|---|
| `--color-ink` | `#F0E8DC` | `.on-dark-overlay` | — | L406 |
| `--color-ink-soft` | `#C1BAB0` | `.on-dark-overlay` | — | L407 |
| `--color-ink-muted` | `#A8A095` | `.on-dark-overlay` | — | L408 |
| `--color-ink-faint` | `#6B6560` | `.on-dark-overlay` | — | L409 |
| `--color-accent` | `#7A9E7E` | `.on-dark-overlay` | — | L410 |
| `--color-accent-strong` | `#7A9E7E` | `.on-dark-overlay` | — | L411 |
| `--color-on-accent` | `#1A1917` | `.on-dark-overlay` | — | L412 |
| `--color-surface-sunken` | `#2F2E2C` | `.on-dark-overlay` | — | L413 |
| `--color-line` | `rgba(232, 224, 212, 0.10)` | `.on-dark-overlay` | — | L414 |
| `--color-line-strong` | `rgba(232, 224, 212, 0.20)` | `.on-dark-overlay` | — | L415 |
| `--bottom-nav-h` | `3.5rem` | `html[data-bottomnav='on']` | — | L854 |
| `--bottom-nav-h` | `0px` | `html[data-bottomnav='on']` | `@media (min-width: 768px)` | L861 |
| `--sidebar-w` | `5rem` | `html[data-sidebar='on']` | `@media (min-width: 48rem)` | L886 |
| `--sidebar-w` | `260px` | `html[data-sidebar='on']` | `@media (min-width: 80rem)` | L891 |
| `--particle-speed` | `20s` | `.particle-bg` | — | L959 |
| `--particle-alpha` | `0.15` | `.particle-bg` | — | L960 |
| `--particle-speed` | `12s` | `.particle-combo-1` | — | L970 |
| `--particle-speed` | `8s` | `.particle-combo-2` | — | L971 |
| `--particle-speed` | `5s` | `.particle-combo-3` | — | L972 |
| `--particle-speed` | `40s` | `.particle-calm` | — | L975 |
| `--particle-alpha` | `0.05` | `.particle-calm` | — | L975 |
| `--flame-rgb` | `0, 245, 212` | `.combo-flame` | — | L1045 |
| `--flame-speed` | `1.5s` | `.combo-flame` | — | L1046 |

## 掃過嘅 block

| 行 | selector |
|---|---|
| L12 | `@theme` |
| L180 | `:root[data-theme='cyber']` |
| L336 | `:root` |
| L405 | `.on-dark-overlay` |
| L418 | `body` |
| L424 | `html` |
| L443 | `html` |
| L454 | `img, svg, video, canvas, iframe` |
| L459 | `img, video` |
| L466 | `body` |
| L470 | `.katex` |
| L477 | `.animate-on-scroll` |
| L483 | `.animate-on-scroll.visible` |
| L487 | `.stagger-1` |
| L488 | `.stagger-2` |
| L489 | `.stagger-3` |
| L490 | `.stagger-4` |
| L491 | `@media (prefers-reduced-motion: reduce)` |
| L492 | `@media (prefers-reduced-motion: reduce) › .animate-on-scroll` |
| L501 | `@keyframes hero-rise` |
| L502 | `@keyframes hero-rise › from` |
| L503 | `@keyframes hero-rise › to` |
| L505 | `.hero-rise` |
| L506 | `.hero-rise-1` |
| L507 | `.hero-rise-2` |
| L508 | `.hero-rise-3` |
| L509 | `@media (prefers-reduced-motion: reduce)` |
| L510 | `@media (prefers-reduced-motion: reduce) › .hero-rise` |
| L513 | `::-webkit-scrollbar` |
| L516 | `::-webkit-scrollbar-track` |
| L519 | `::-webkit-scrollbar-thumb` |
| L535 | `@keyframes pop-in` |
| L536 | `@keyframes pop-in › 0%` |
| L537 | `@keyframes pop-in › 100%` |
| L540 | `@keyframes slide-up` |
| L541 | `@keyframes slide-up › from` |
| L542 | `@keyframes slide-up › to` |
| L547 | `@keyframes fill-bar` |
| L548 | `@keyframes fill-bar › from` |
| L549 | `@keyframes fill-bar › to` |
| L552 | `.animate-pop-in` |
| L556 | `.animate-slide-up` |
| L570 | `@media print` |
| L581 | `@media print › nav, footer:not(.print-keep), button:not(.print-keep), .no-print, nextjs-portal` |
| L587 | `@media print › html, body` |
| L596 | `@media print › .min-h-screen` |
| L600 | `@media print › body, body *` |
| L612 | `@media print › [class*="bg-slate-9"], [class*="bg-slate-8"], [class*="bg-amber-5"], [class*="bg-rose-5"], [class*="bg-indigo-5"], [class*="bg-green-5"], [class*="bg-emerald-5"]` |
| L619 | `@media print › @page` |
| L624 | `@media print › .rounded-2xl, .rounded-xl` |
| L630 | `@media print › .paper-sheet` |
| L636 | `@media print › .paper-q` |
| L641 | `@media print › .paper-write-space` |
| L664 | `html.no-motion *, html.no-motion *::before, html.no-motion *::after` |
| L669 | `html.no-motion` |
| L679 | `@keyframes skeleton-breathe` |
| L680 | `@keyframes skeleton-breathe › 0%, 100%` |
| L681 | `@keyframes skeleton-breathe › 50%` |
| L683 | `.skeleton` |
| L689 | `@media (prefers-reduced-motion: reduce)` |
| L690 | `@media (prefers-reduced-motion: reduce) › .skeleton` |
| L697 | `@font-face` |
| L704 | `html.font-easy body` |
| L714 | `html.font-easy .font-serif` |
| L720 | `html.font-easy p, html.font-easy li` |
| L732 | `html.a11y-spacing body, html.a11y-spacing p, html.a11y-spacing li, html.a11y-spacing label, html.a11y-spacing button` |
| L770 | `html.focus-light .focus-dim` |
| L775 | `html.focus-light .focus-dim:hover, html.focus-light .focus-dim:focus-within` |
| L787 | `.katex-display` |
| L797 | `.skip-link` |
| L807 | `.skip-link:focus` |
| L828 | `@keyframes sand-stream` |
| L829 | `@keyframes sand-stream › to` |
| L831 | `.hourglass-stream` |
| L835 | `.hourglass-soft .hourglass-stream` |
| L838 | `@media (prefers-reduced-motion: reduce)` |
| L839 | `@media (prefers-reduced-motion: reduce) › .hourglass-stream` |
| L850 | `:root` |
| L853 | `html[data-bottomnav='on']` |
| L859 | `@media (min-width: 768px)` |
| L860 | `@media (min-width: 768px) › html[data-bottomnav='on']` |
| L864 | `.floating-bottom` |
| L878 | `:root` |
| L884 | `@media (min-width: 48rem)` |
| L885 | `@media (min-width: 48rem) › html[data-sidebar='on']` |
| L889 | `@media (min-width: 80rem)` |
| L890 | `@media (min-width: 80rem) › html[data-sidebar='on']` |
| L898 | `html.no-motion .mascot` |
| L903 | `.floating-left` |
| L906 | `.floating-left-2` |
| L911 | `.floating-bottom-2` |
| L914 | `.floating-bottom-3` |
| L926 | `.floating-panel-max-h` |
| L958 | `.particle-bg` |
| L965 | `@keyframes particle-drift` |
| L966 | `@keyframes particle-drift › from` |
| L967 | `@keyframes particle-drift › to` |
| L970 | `.particle-combo-1` |
| L971 | `.particle-combo-2` |
| L972 | `.particle-combo-3` |
| L975 | `.particle-calm` |
| L980 | `.scatter-title` |
| L983 | `@keyframes scatter-in` |
| L984 | `@keyframes scatter-in › from` |
| L985 | `@keyframes scatter-in › to` |
| L990 | `.answer-feedback` |
| L994 | `.answer-feedback-miss` |
| L997 | `@keyframes answer-feedback` |
| L998 | `@keyframes answer-feedback › from` |
| L999 | `@keyframes answer-feedback › to` |
| L1005 | `.shockwave, .shockwave-gold, .pulse-correct` |
| L1012 | `.blindspot-in` |
| L1015 | `@keyframes blindspot-in` |
| L1016 | `@keyframes blindspot-in › from` |
| L1017 | `@keyframes blindspot-in › to` |
| L1023 | `.ring-draw` |
| L1026 | `@keyframes ring-draw` |
| L1027 | `@keyframes ring-draw › from` |
| L1032 | `.radar-grow` |
| L1037 | `@keyframes radar-grow` |
| L1038 | `@keyframes radar-grow › from` |
| L1039 | `@keyframes radar-grow › to` |
| L1044 | `.combo-flame` |
| L1052 | `@keyframes flame-pulse` |
| L1053 | `@keyframes flame-pulse › 0%, 100%` |
| L1054 | `@keyframes flame-pulse › 50%` |
| L1059 | `.carousel-3d` |
| L1060 | `.carousel-card` |
| L1064 | `.carousel-card:hover` |
| L1065 | `.carousel-card[aria-current='true']` |
| L1069 | `.ring-rotate` |
| L1070 | `@keyframes ring-rotate` |
| L1071 | `@keyframes ring-rotate › from` |
| L1072 | `@keyframes ring-rotate › to` |
| L1100 | `:root` |
| L1112 | `.achievement-pop` |
| L1115 | `@keyframes achievement-pop` |
| L1116 | `@keyframes achievement-pop › from` |
| L1117 | `@keyframes achievement-pop › to` |
| L1127 | `.relax-in` |
| L1142 | `@keyframes ml-q-enter` |
| L1143 | `@keyframes ml-q-enter › from` |
| L1144 | `@keyframes ml-q-enter › to` |
| L1146 | `@keyframes ml-q-leave` |
| L1147 | `@keyframes ml-q-leave › from` |
| L1148 | `@keyframes ml-q-leave › to` |
| L1150 | `.ml-q-enter` |
| L1151 | `.ml-q-leave` |
| L1154 | `.ml-press` |
| L1155 | `.ml-press:active` |
| L1159 | `.ml-pick-on` |
| L1160 | `.ml-pick` |
| L1163 | `@keyframes ml-reveal` |
| L1164 | `@keyframes ml-reveal › from` |
| L1165 | `@keyframes ml-reveal › to` |
| L1167 | `.ml-reveal` |
| L1170 | `@keyframes ml-modal-in` |
| L1171 | `@keyframes ml-modal-in › from` |
| L1172 | `@keyframes ml-modal-in › to` |
| L1174 | `.ml-modal-in` |
| L1178 | `.ml-stagger` |
| L1184 | `.ml-lift` |
| L1185 | `.ml-lift:hover` |
| L1190 | `@keyframes ml-notice` |
| L1191 | `@keyframes ml-notice › 0%, 100%` |
| L1192 | `@keyframes ml-notice › 50%` |
| L1194 | `.ml-notice` |
| L1198 | `@media (prefers-reduced-motion: reduce)` |
| L1199 | `@media (prefers-reduced-motion: reduce) › .ml-q-enter, .ml-q-leave, .ml-reveal, .ml-modal-in, .ml-stagger` |
| L1203 | `@media (prefers-reduced-motion: reduce) › .ml-press, .ml-pick, .ml-lift` |
| L1204 | `@media (prefers-reduced-motion: reduce) › .ml-press:active, .ml-pick-on, .ml-lift:hover` |
| L1205 | `@media (prefers-reduced-motion: reduce) › .ml-notice` |
| L1217 | `html.font-easy .ml-q-enter, html.font-easy .ml-q-leave, html.font-easy .ml-reveal, html.font-easy .ml-modal-in, html.font-easy .ml-stagger, html.font-easy .ml-notice` |
| L1224 | `html.font-easy .ml-press, html.font-easy .ml-pick, html.font-easy .ml-lift` |
| L1229 | `html.font-easy .ml-press:active, html.font-easy .ml-pick-on, html.font-easy .ml-lift:hover` |
| L1234 | `@keyframes relax-in` |
| L1235 | `@keyframes relax-in › from` |
| L1236 | `@keyframes relax-in › to` |
| L1243 | `:root[data-theme='light'] .particle-bg, :root[data-theme='light'] .combo-flame` |
| L1251 | `html.font-easy .particle-bg, html.font-easy .combo-flame` |
| L1258 | `html.font-easy .scatter-title, html.font-easy .achievement-pop, html.font-easy .shockwave, html.font-easy .ring-rotate, html.font-easy .carousel-card` |
| L1265 | `html.font-easy .shockwave` |
| L1273 | `html.font-easy .answer-feedback, html.font-easy .answer-feedback-miss, html.font-easy .pulse-correct, html.font-easy .blindspot-in, html.font-easy .ring-draw, html.font-easy .radar-grow` |
| L1287 | `html.font-easy .relax-in, html.font-easy .animate-slide-up, html.font-easy .animate-pop-in, html.font-easy .skeleton` |
| L1294 | `@media (prefers-reduced-motion: reduce)` |
| L1300 | `@media (prefers-reduced-motion: reduce) › .particle-bg, .combo-flame, .scatter-title, .achievement-pop, .ring-rotate, .carousel-card` |
| L1304 | `@media (prefers-reduced-motion: reduce) › .scatter-title` |
| L1305 | `@media (prefers-reduced-motion: reduce) › .achievement-pop` |
| L1306 | `@media (prefers-reduced-motion: reduce) › .carousel-card:hover` |
| L1307 | `@media (prefers-reduced-motion: reduce) › .shockwave` |
| L1316 | `@media (prefers-reduced-motion: reduce) › .answer-feedback, .answer-feedback-miss, .pulse-correct, .blindspot-in, .ring-draw, .radar-grow, .relax-in` |
| L1331 | `@media (prefers-reduced-motion: reduce) › .animate-slide-up, .animate-pop-in` |
| L1341 | `@media (max-height: 760px)` |
| L1342 | `@media (max-height: 760px) › .sidebar-quote` |
| L1349 | `@media (max-width: 639px)` |
| L1350 | `@media (max-width: 639px) › section:has([data-continue-card]) .hero-mascot` |
| L1357 | `@media (max-width: 767px)` |
| L1358 | `@media (max-width: 767px) › body:has([data-a11y-trigger]) .a11y-fab` |
| L1363 | `.off-syllabus-card-body` |
| L1367 | `@keyframes off-syllabus-reveal` |
| L1368 | `@keyframes off-syllabus-reveal › from` |
| L1369 | `@keyframes off-syllabus-reveal › to` |
| L1371 | `@media (prefers-reduced-motion: reduce)` |
| L1372 | `@media (prefers-reduced-motion: reduce) › .off-syllabus-card-body` |
| L1379 | `.practice-session-revealed` |
| L1389 | `.practice-session-revealed > .practice-session-column` |
| L1397 | `.practice-revealed-scroll` |
| L1405 | `.practice-option` |
| L1409 | `@media (max-width: 639px)` |
| L1410 | `@media (max-width: 639px) › .practice-option` |
| L1413 | `@media (max-width: 639px) › .practice-options-stack` |
| L1417 | `.practice-explain` |
| L1420 | `.practice-miss` |
| L1424 | `.practice-next-bar` |
| L1438 | `.practice-retry-btn` |
| L1453 | `.practice-retry-btn:hover` |
| L1456 | `.practice-next-btn` |
| L1471 | `.practice-next-btn:hover` |
| L1477 | `.practice-next-btn:focus-visible, .practice-retry-btn:focus-visible, .practice-option:focus-visible, .practice-feedback:focus-visible` |
| L1483 | `body:has(.practice-session) [role="dialog"][aria-label="無障礙設定"], body:has(.practice-session) [role="dialog"][aria-label="Accessibility options"]` |
| L1491 | `body:has(.practice-session) .a11y-fab` |
| L1494 | `body:has(.practice-session) [data-reading-ruler-fab]` |
| L1498 | `body:has(.practice-session) [data-sos-fab]` |
