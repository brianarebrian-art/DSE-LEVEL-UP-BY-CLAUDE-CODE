<!-- generated from app/globals.css by scripts/gen-token-doc.mjs — do not edit -->

# 設計 token

**唯一來源係 `app/globals.css`，唔係呢個檔。** 呢度所有數字都由嗰邊抽出嚟。
改 token 改 CSS，然後重跑：

```bash
node scripts/gen-token-doc.mjs
```

掃到 **168** 個 custom property 宣告，分佈喺 **193** 個 block。

## ⚠️ 被覆蓋嘅宣告

同一個 token 喺預設態宣告咗多過一次。**上面嗰啲畫唔到** —— 後面嗰個贏。
照住早嗰個值去設計，出嚟嘅顏色同實際站唔同。

| token | 畫唔到嘅宣告 | 真正生效 | resolved |
|---|---|---|---|
| `--color-surface` | `#FAFAF8` (L54) | `var(--color-ml-canvas)` (L363) | `#F4F0EA` |
| `--color-surface-raised` | `#FFFFFF` (L55) | `var(--color-ml-surface)` (L364) | `#FFFDF9` |
| `--color-surface-sunken` | `#F5F5F0` (L56) | `var(--color-ml-muted)` (L365) | `#F0EBE3` |
| `--color-ink` | `#1A1A1A` (L68) | `var(--color-ml-ink)` (L366) | `#2C2A29` |
| `--color-ink-soft` | `#2D2D2D` (L69) | `#3D3A38` (L367) | `#3D3A38` |
| `--color-ink-muted` | `#5E5E5E` (L70) | `var(--color-ml-ink-soft)` (L368) | `#69635F` |
| `--color-ink-faint` | `#9CA3AF` (L75) | `#9C958D` (L369) | `#9C958D` |
| `--color-accent` | `#006B65` (L76) | `var(--color-ml-sage)` (L371) | `#57685C` |
| `--color-accent-strong` | `#00726C` (L77) | `var(--color-ml-sage)` (L372) | `#57685C` |
| `--color-accent-hover` | `#005F5A` (L81) | `#4D584A` (L373) | `#4D584A` |
| `--color-on-accent` | `#FFFFFF` (L82) | `var(--color-ml-on-brand)` (L374) | `#FFFFFF` |
| `--color-line` | `rgba(0, 0, 0, 0.06)` (L83) | `rgba(44, 42, 41, 0.08)` (L375) | `rgba(44, 42, 41, 0.08)` |
| `--color-line-strong` | `rgba(0, 0, 0, 0.12)` (L84) | `rgba(44, 42, 41, 0.16)` (L376) | `rgba(44, 42, 41, 0.16)` |
| `--color-scrim` | `rgba(0, 0, 0, 0.70)` (L90) | `rgba(44, 42, 41, 0.72)` (L378) | `rgba(44, 42, 41, 0.72)` |
| `--color-scrim-soft` | `rgba(0, 0, 0, 0.40)` (L91) | `rgba(44, 42, 41, 0.42)` (L379) | `rgba(44, 42, 41, 0.42)` |
| `--color-gold` | `#756238` (L108) | `var(--color-ml-clay)` (L385) | `#706347` |
| `--color-gold-soft` | `#D4A017` (L111) | `var(--color-ml-rose)` (L386) | `#B7A6A3` |
| `--color-gold-strong` | `#725106` (L112) | `#5F5144` (L387) | `#5F5144` |
| `--color-violet` | `#6D28D9` (L113) | `#5B666F` (L388) | `#5B666F` |
| `--color-violet-strong` | `#5B21B6` (L114) | `#4A545C` (L389) | `#4A545C` |
| `--color-rose` | `#C2185B` (L115) | `var(--color-ml-warn)` (L391) | `#845956` |
| `--color-rose-strong` | `#9D1449` (L117) | `#724D3D` (L392) | `#724D3D` |
| `--color-on-violet` | `#FFFFFF` (L120) | `#FFFFFF` (L390) | `#FFFFFF` |
| `--grade-5s` | `#8A6608` (L127) | `#846208` (L398) | `#846208` |
| `--grade-5` | `#177E3C` (L128) | `#16793A` (L399) | `#16793A` |
| `--color-ml-rose` | `#C5908B` (L175) | `#B7A6A3` (L180) | `#B7A6A3` |
| `--color-ml-mist` | `#AFC2D1` (L176) | `#8A9BA8` (L181) | `#8A9BA8` |
| `--ease-spring-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` (L1153) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1154) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` |

## Resolved — 預設態（冇 `data-theme` 屬性）

@theme ＋ 裸 `:root`，last-wins。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L881) | — |  |
| `--color-accent` | `#57685C` | `var(--color-ml-sage)` (L371) | `--color-ml-sage` | 4.75 |
| `--color-accent-hover` | `#4D584A` | `#4D584A` (L373) | — | 白字 7.47 |
| `--color-accent-strong` | `#57685C` | `var(--color-ml-sage)` (L372) | `--color-ml-sage` | 白字掣 5.64 |
| `--color-bg-dark` | `#080C14` | `#080C14` (L44) | — |  |
| `--color-bg-dark-2` | `#0B1120` | `#0B1120` (L45) | — |  |
| `--color-gold` | `#706347` | `var(--color-ml-clay)` (L385) | `--color-ml-clay` | 4.56（四底面） |
| `--color-gold-soft` | `#B7A6A3` | `var(--color-ml-rose)` (L386) | `--color-ml-rose` | 1.97 —— 永遠唔可以做字色 |
| `--color-gold-strong` | `#5F5144` | `#5F5144` (L387) | — | 5.94 / 白字 7.64 |
| `--color-ink` | `#2C2A29` | `var(--color-ml-ink)` (L366) | `--color-ml-ink` |  |
| `--color-ink-faint` | `#9C958D` | `#9C958D` (L369) | — | 2.49 —— 同上游一樣，只准用於停用控件／ |
| `--color-ink-muted` | `#69635F` | `var(--color-ml-ink-soft)` (L368) | `--color-ml-ink-soft` | 4.84 |
| `--color-ink-soft` | `#3D3A38` | `#3D3A38` (L367) | — | 9.51 |
| `--color-line` | `rgba(44, 42, 41, 0.08)` | `rgba(44, 42, 41, 0.08)` (L375) | — |  |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` | `rgba(44, 42, 41, 0.16)` (L376) | — |  |
| `--color-ml-canvas` | `#F4F0EA` | `#F4F0EA` (L158) | — | 頁面底 |
| `--color-ml-clay` | `#706347` | `#706347` (L167) | — | PC-011↓ 強調、失分標示（4.56 / 白字掣 5.63） |
| `--color-ml-good` | `#566953` | `#566953` (L170) | — | PC-032↓ 達標（4.59 / 白字掣 5.68） |
| `--color-ml-ink` | `#2C2A29` | `#2C2A29` (L162) | — | 正文（12.04） |
| `--color-ml-ink-soft` | `#69635F` | `#69635F` (L163) | — | 輔助（4.57，四底面） |
| `--color-ml-line` | `#8A8377` | `#8A8377` (L171) | — | PC-027↓ 控件邊界（3.16，WCAG 1.4.11）。 |
| `--color-ml-mist` | `#8A9BA8` | `#8A9BA8` (L181) | — | 資訊／交通 —— 純裝飾填色 |
| `--color-ml-muted` | `#F0EBE3` | `#F0EBE3` (L160) | — | 次級區塊。⚠️ 規格原值 #E8E2D9 太深， |
| `--color-ml-on-brand` | `#FFFFFF` | `#FFFFFF` (L174) | — | 實心掣上嘅字（Light 用白字） |
| `--color-ml-rose` | `#B7A6A3` | `#B7A6A3` (L180) | — | 情緒／關懷 —— 純裝飾填色 |
| `--color-ml-sage` | `#57685C` | `#57685C` (L166) | — | PC-016↓ 主行動、正確（4.59 / 白字掣 5.68） |
| `--color-ml-surface` | `#FFFDF9` | `#FFFDF9` (L159) | — | 卡片 |
| `--color-ml-warn` | `#845956` | `#845956` (L168) | — | PC-003↓ 超時、警告（4.58 / 白字掣 5.66）。 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L40) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L41) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L43) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L42) | — |  |
| `--color-on-accent` | `#FFFFFF` | `var(--color-ml-on-brand)` (L374) | `--color-ml-on-brand` |  |
| `--color-on-violet` | `#FFFFFF` | `#FFFFFF` (L390) | — |  |
| `--color-paper` | `#F5E7C8` | `#F5E7C8` (L34) | — | PC-009 試卷紙（暗色模式改舊紙色，見下） |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L35) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L36) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L37) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#845956` | `var(--color-ml-warn)` (L391) | `--color-ml-warn` | 4.66 |
| `--color-rose-strong` | `#724D3D` | `#724D3D` (L392) | — | 白字 7.38 |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` | `rgba(44, 42, 41, 0.72)` (L378) | — |  |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` | `rgba(44, 42, 41, 0.42)` (L379) | — |  |
| `--color-subj-clay` | `#706347` | `#706347` (L103) | — | PC-011↓ 4.61 |
| `--color-subj-mist` | `#4D667E` | `#4D667E` (L102) | — | PC-020↓ 4.67 |
| `--color-subj-moss` | `#566953` | `#566953` (L101) | — | PC-032↓ 4.65 |
| `--color-subj-rose` | `#845956` | `#845956` (L104) | — | PC-003↓ 4.69 |
| `--color-subj-sage` | `#57685C` | `#57685C` (L100) | — | PC-016↓ 4.66 |
| `--color-subj-stone` | `#666557` | `#666557` (L105) | — | PC-028↓ 4.68 |
| `--color-surface` | `#F4F0EA` | `var(--color-ml-canvas)` (L363) | `--color-ml-canvas` |  |
| `--color-surface-raised` | `#FFFDF9` | `var(--color-ml-surface)` (L364) | `--color-ml-surface` |  |
| `--color-surface-sunken` | `#F0EBE3` | `var(--color-ml-muted)` (L365) | `--color-ml-muted` |  |
| `--color-text-primary` | `#E2E8F0` | `#E2E8F0` (L46) | — | = slate-200；正文繼續用 slate utilities |
| `--color-text-secondary` | `#94A3B8` | `#94A3B8` (L47) | — | = slate-400 |
| `--color-violet` | `#5B666F` | `#5B666F` (L388) | — | mist-strong 4.95 |
| `--color-violet-strong` | `#4A545C` | `#4A545C` (L389) | — | 白字 7.19 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1154) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L21) | — |  |
| `--grade-1` | `#334155` | `#334155` (L132) | — | 9.47 |
| `--grade-2` | `#475569` | `#475569` (L131) | — | 6.93 |
| `--grade-3` | `#7E22CE` | `#7E22CE` (L130) | — | 6.39 |
| `--grade-4` | `#1E52B8` | `#1E52B8` (L129) | — | 6.50 |
| `--grade-5` | `#16793A` | `#16793A` (L399) | — | 4.62（原 #177E3C 落莫蘭迪底只有 4.33） |
| `--grade-5s` | `#846208` | `#846208` (L398) | — | 4.74（原 #8A6608 落莫蘭迪底只有 4.44） |
| `--grade-5ss` | `#9A5B06` | `#9A5B06` (L126) | — | 4.96 |
| `--grade-u` | `#9D1449` | `#9D1449` (L133) | — | 7.30 —— 玫紅，唔用正紅（憲章 §大愛） |
| `--sidebar-w` | `0px` | `0px` (L909) | — |  |

## Resolved — `data-theme='cyber'`（暗色）

預設態再由 `:root[data-theme='cyber']` 覆蓋（specificity 0,1,1 贏 0,0,1）。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L881) | — |  |
| `--color-accent` | `#7a9e7e` | `var(--color-ml-sage)` (L229) | `--color-ml-sage` |  |
| `--color-accent-hover` | `#6b8f71` | `#6b8f71` (L231) | — | 規格 --moss-dark。深字掣 4.85 ✅ |
| `--color-accent-strong` | `#7a9e7e` | `var(--color-ml-sage)` (L230) | `--color-ml-sage` |  |
| `--color-bg-dark` | `#080C14` | `#080C14` (L44) | — |  |
| `--color-bg-dark-2` | `#0B1120` | `#0B1120` (L45) | — |  |
| `--color-gold` | `#b8956f` | `var(--color-ml-clay)` (L269) | `--color-ml-clay` | #b8956f 規格 --wood  4.89 |
| `--color-gold-soft` | `#e6ba8b` | `#e6ba8b` (L270) | — | wood ×1.25  7.60 —— 全站 1 處，做 border |
| `--color-gold-strong` | `#d4ab80` | `#d4ab80` (L271) | — | wood ×1.15  6.42 —— 全站 10 處做字色，故要 ≥4.5 |
| `--color-ink` | `#f0e8dc` | `var(--color-ml-ink)` (L213) | `--color-ml-ink` | #f0e8dc  11.16　規格 --text-primary |
| `--color-ink-faint` | `#6b6560` | `#6b6560` (L216) | — | 2.36 —— 停用控件／裝飾專用（原 2.28） |
| `--color-ink-muted` | `#a8a095` | `var(--color-ml-ink-soft)` (L215) | `--color-ml-ink-soft` | #a8a095  5.25　規格 --text-secondary（原 4.63，升咗） |
| `--color-ink-soft` | `#c1bab0` | `#c1bab0` (L214) | — | 7.05　規格冇呢一階，由 --cream 壓暗推導 |
| `--color-line` | `rgba(232, 224, 212, 0.06)` | `rgba(232, 224, 212, 0.06)` (L246) | — |  |
| `--color-line-strong` | `rgba(232, 224, 212, 0.12)` | `rgba(232, 224, 212, 0.12)` (L247) | — |  |
| `--color-ml-canvas` | `#1a1917` | `#1a1917` (L307) | — | 規格 --bg-primary |
| `--color-ml-clay` | `#b8956f` | `#b8956f` (L315) | — | 規格 --wood  文字 4.89 / 深字掣 6.33 |
| `--color-ml-good` | `#9ab89d` | `#9ab89d` (L317) | — | moss ×1.25   文字 6.28 —— 規格冇「達標」色， |
| `--color-ml-ink` | `#f0e8dc` | `#f0e8dc` (L312) | — | 規格 --text-primary    11.16 |
| `--color-ml-ink-soft` | `#a8a095` | `#a8a095` (L313) | — | 規格 --text-secondary   5.25 |
| `--color-ml-line` | `#918a7e` | `#918a7e` (L319) | — | 控件邊界 3.97（WCAG 1.4.11 ≥3:1）。 |
| `--color-ml-mist` | `#8a9fb8` | `#8a9fb8` (L325) | — | 規格 --mist  裝飾（4.99） |
| `--color-ml-muted` | `#2f2e2c` | `#2f2e2c` (L309) | — | 規格 --bg-elevated |
| `--color-ml-on-brand` | `#1a1917` | `#1a1917` (L323) | — | 實心掣上嘅字（Dark 用深字，規格 §3.3 一致） |
| `--color-ml-rose` | `#c49a9a` | `#c49a9a` (L324) | — | 規格 --rose  裝飾（5.45） |
| `--color-ml-sage` | `#7a9e7e` | `#7a9e7e` (L314) | — | 規格 --moss  文字 4.53 / 深字掣 5.87 |
| `--color-ml-surface` | `#252422` | `#252422` (L308) | — | 規格 --bg-card |
| `--color-ml-warn` | `#c49a9a` | `#c49a9a` (L316) | — | 規格 --rose  文字 5.45 / 深字掣 7.06 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L40) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L41) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L43) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L42) | — |  |
| `--color-on-accent` | `#1a1917` | `var(--color-ml-on-brand)` (L237) | `--color-ml-on-brand` | #1a1917 |
| `--color-on-violet` | `#1a1917` | `#1a1917` (L276) | — | 深字 on 霧藍 = 6.47（白字只有 1.9） |
| `--color-paper` | `#DDD3C6` | `#DDD3C6` (L254) | — | PC-026 舊紙。純白紙落 #1a1917 頁底係 17.57， |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L35) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L36) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L37) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#c49a9a` | `var(--color-ml-warn)` (L274) | `--color-ml-warn` | #c49a9a 規格 --rose  5.45 |
| `--color-rose-strong` | `#b89191` | `#b89191` (L275) | — | rose ×0.94  4.84 —— 有 1 處做字色，故要 ≥4.5 |
| `--color-scrim` | `rgba(10, 9, 9, 0.78)` | `rgba(10, 9, 9, 0.78)` (L248) | — |  |
| `--color-scrim-soft` | `rgba(10, 9, 9, 0.50)` | `rgba(10, 9, 9, 0.50)` (L249) | — |  |
| `--color-subj-clay` | `#b8956f` | `#b8956f` (L334) | — | 規格 --wood   4.89 |
| `--color-subj-mist` | `#8a9fb8` | `#8a9fb8` (L333) | — | 規格 --mist   4.99 |
| `--color-subj-moss` | `#9ab89d` | `#9ab89d` (L332) | — | moss ×1.25    6.28 |
| `--color-subj-rose` | `#c49a9a` | `#c49a9a` (L335) | — | 規格 --rose   5.45 |
| `--color-subj-sage` | `#7a9e7e` | `#7a9e7e` (L331) | — | 規格 --moss   4.53 |
| `--color-subj-stone` | `#c1bab0` | `#c1bab0` (L336) | — | 岩灰          7.05 |
| `--color-surface` | `#1a1917` | `var(--color-ml-canvas)` (L209) | `--color-ml-canvas` | #1a1917 規格 --bg-primary |
| `--color-surface-raised` | `#252422` | `var(--color-ml-surface)` (L210) | `--color-ml-surface` | #252422 規格 --bg-card |
| `--color-surface-sunken` | `#2f2e2c` | `var(--color-ml-muted)` (L211) | `--color-ml-muted` | #2f2e2c 規格 --bg-elevated |
| `--color-text-primary` | `#E2E8F0` | `#E2E8F0` (L46) | — | = slate-200；正文繼續用 slate utilities |
| `--color-text-secondary` | `#94A3B8` | `#94A3B8` (L47) | — | = slate-400 |
| `--color-violet` | `#8a9fb8` | `var(--color-ml-mist)` (L272) | `--color-ml-mist` | #8a9fb8 規格 --mist  4.99 |
| `--color-violet-strong` | `#a8c2e0` | `#a8c2e0` (L273) | — | mist ×1.22  7.40 —— 3 處做字色 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1154) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L21) | — |  |
| `--grade-1` | `#a8a095` | `#a8a095` (L291) | — | 規格 --text-secondary 5.25 |
| `--grade-2` | `#c1bab0` | `#c1bab0` (L290) | — | 岩灰                7.05 |
| `--grade-3` | `#b8956f` | `#b8956f` (L289) | — | 規格 --wood         4.89 |
| `--grade-4` | `#8a9fb8` | `#8a9fb8` (L288) | — | 規格 --mist         4.99 —— 同 5 分開色相 |
| `--grade-5` | `#7a9e7e` | `#7a9e7e` (L287) | — | 規格 --moss         4.53 |
| `--grade-5s` | `#9ab89d` | `#9ab89d` (L286) | — | moss ×1.25          6.28 |
| `--grade-5ss` | `#e8e0d4` | `#e8e0d4` (L285) | — | 規格 --cream        10.36 |
| `--grade-u` | `#c49a9a` | `#c49a9a` (L292) | — | 規格 --rose         5.45 —— 唔用正紅（憲章 §7） |
| `--sidebar-w` | `0px` | `0px` (L909) | — |  |

## 其他 scope

唔屬於上面兩個全站狀態嘅宣告（media query、無障礙 class、屬性 scope）。
列出嚟係因為漏咗一個 scope，就係一個永遠搵唔到嘅「點解個值唔啱」。

| token | 值 | scope | media | 行 |
|---|---|---|---|---|
| `--color-ink` | `#F0E8DC` | `.on-dark-overlay` | — | L432 |
| `--color-ink-soft` | `#C1BAB0` | `.on-dark-overlay` | — | L433 |
| `--color-ink-muted` | `#A8A095` | `.on-dark-overlay` | — | L434 |
| `--color-ink-faint` | `#6B6560` | `.on-dark-overlay` | — | L435 |
| `--color-accent` | `#7A9E7E` | `.on-dark-overlay` | — | L436 |
| `--color-accent-strong` | `#7A9E7E` | `.on-dark-overlay` | — | L437 |
| `--color-on-accent` | `#1A1917` | `.on-dark-overlay` | — | L438 |
| `--color-surface-sunken` | `#2F2E2C` | `.on-dark-overlay` | — | L439 |
| `--color-line` | `rgba(232, 224, 212, 0.10)` | `.on-dark-overlay` | — | L440 |
| `--color-line-strong` | `rgba(232, 224, 212, 0.20)` | `.on-dark-overlay` | — | L441 |
| `--bottom-nav-h` | `3.5rem` | `html[data-bottomnav='on']` | — | L884 |
| `--bottom-nav-h` | `0px` | `html[data-bottomnav='on']` | `@media (min-width: 768px)` | L891 |
| `--sidebar-w` | `5rem` | `html[data-sidebar='on']` | `@media (min-width: 64rem)` | L915 |
| `--sidebar-w` | `260px` | `html[data-sidebar='on']` | `@media (min-width: 80rem)` | L920 |
| `--particle-speed` | `20s` | `.particle-bg` | — | L988 |
| `--particle-alpha` | `0.15` | `.particle-bg` | — | L989 |
| `--particle-speed` | `12s` | `.particle-combo-1` | — | L999 |
| `--particle-speed` | `8s` | `.particle-combo-2` | — | L1000 |
| `--particle-speed` | `5s` | `.particle-combo-3` | — | L1001 |
| `--particle-speed` | `40s` | `.particle-calm` | — | L1004 |
| `--particle-alpha` | `0.05` | `.particle-calm` | — | L1004 |
| `--flame-rgb` | `0, 245, 212` | `.combo-flame` | — | L1097 |
| `--flame-speed` | `1.5s` | `.combo-flame` | — | L1098 |

## 掃過嘅 block

| 行 | selector |
|---|---|
| L13 | `@theme` |
| L206 | `:root[data-theme='cyber']` |
| L362 | `:root` |
| L431 | `.on-dark-overlay` |
| L444 | `body` |
| L450 | `html` |
| L469 | `html` |
| L480 | `img, svg, video, canvas, iframe` |
| L485 | `img, video` |
| L492 | `body` |
| L496 | `.katex` |
| L503 | `.animate-on-scroll` |
| L509 | `.animate-on-scroll.visible` |
| L513 | `.stagger-1` |
| L514 | `.stagger-2` |
| L515 | `.stagger-3` |
| L516 | `.stagger-4` |
| L517 | `@media (prefers-reduced-motion: reduce)` |
| L518 | `@media (prefers-reduced-motion: reduce) › .animate-on-scroll` |
| L521 | `::-webkit-scrollbar` |
| L524 | `::-webkit-scrollbar-track` |
| L527 | `::-webkit-scrollbar-thumb` |
| L543 | `@keyframes pop-in` |
| L544 | `@keyframes pop-in › 0%` |
| L545 | `@keyframes pop-in › 100%` |
| L548 | `@keyframes slide-up` |
| L549 | `@keyframes slide-up › from` |
| L550 | `@keyframes slide-up › to` |
| L553 | `@keyframes fill-bar` |
| L554 | `@keyframes fill-bar › from` |
| L555 | `@keyframes fill-bar › to` |
| L558 | `.animate-pop-in` |
| L562 | `.animate-slide-up` |
| L576 | `@media print` |
| L587 | `@media print › nav, footer:not(.print-keep), button:not(.print-keep), .no-print, nextjs-portal` |
| L593 | `@media print › html, body` |
| L602 | `@media print › .min-h-screen` |
| L606 | `@media print › body, body *` |
| L618 | `@media print › [class*="bg-slate-9"], [class*="bg-slate-8"], [class*="bg-amber-5"], [class*="bg-rose-5"], [class*="bg-indigo-5"], [class*="bg-green-5"], [class*="bg-emerald-5"]` |
| L625 | `@media print › @page` |
| L630 | `@media print › .rounded-2xl, .rounded-xl` |
| L636 | `@media print › .paper-sheet` |
| L642 | `@media print › .paper-q` |
| L647 | `@media print › .paper-write-space` |
| L670 | `html.no-motion *, html.no-motion *::before, html.no-motion *::after` |
| L675 | `html.no-motion` |
| L685 | `@keyframes skeleton-breathe` |
| L686 | `@keyframes skeleton-breathe › 0%, 100%` |
| L687 | `@keyframes skeleton-breathe › 50%` |
| L689 | `.skeleton` |
| L695 | `@media (prefers-reduced-motion: reduce)` |
| L696 | `@media (prefers-reduced-motion: reduce) › .skeleton` |
| L703 | `@font-face` |
| L710 | `html.font-easy body` |
| L720 | `html.font-easy .font-serif` |
| L726 | `html.font-easy p, html.font-easy li` |
| L738 | `html.a11y-spacing body, html.a11y-spacing p, html.a11y-spacing li, html.a11y-spacing label, html.a11y-spacing button` |
| L776 | `html.focus-light .focus-dim` |
| L781 | `html.focus-light .focus-dim:hover, html.focus-light .focus-dim:focus-within` |
| L793 | `.katex-display` |
| L803 | `.skip-link` |
| L813 | `.skip-link:focus` |
| L834 | `@keyframes cmd-hl-in` |
| L835 | `@keyframes cmd-hl-in › from` |
| L836 | `@keyframes cmd-hl-in › to` |
| L838 | `.cmd-hl` |
| L847 | `.cmd-hl-soft` |
| L851 | `@media (prefers-reduced-motion: reduce)` |
| L852 | `@media (prefers-reduced-motion: reduce) › .cmd-hl` |
| L858 | `@keyframes sand-stream` |
| L859 | `@keyframes sand-stream › to` |
| L861 | `.hourglass-stream` |
| L865 | `.hourglass-soft .hourglass-stream` |
| L868 | `@media (prefers-reduced-motion: reduce)` |
| L869 | `@media (prefers-reduced-motion: reduce) › .hourglass-stream` |
| L880 | `:root` |
| L883 | `html[data-bottomnav='on']` |
| L889 | `@media (min-width: 768px)` |
| L890 | `@media (min-width: 768px) › html[data-bottomnav='on']` |
| L894 | `.floating-bottom` |
| L908 | `:root` |
| L913 | `@media (min-width: 64rem)` |
| L914 | `@media (min-width: 64rem) › html[data-sidebar='on']` |
| L918 | `@media (min-width: 80rem)` |
| L919 | `@media (min-width: 80rem) › html[data-sidebar='on']` |
| L927 | `html.no-motion .mascot` |
| L932 | `.floating-left` |
| L935 | `.floating-left-2` |
| L940 | `.floating-bottom-2` |
| L943 | `.floating-bottom-3` |
| L955 | `.floating-panel-max-h` |
| L987 | `.particle-bg` |
| L994 | `@keyframes particle-drift` |
| L995 | `@keyframes particle-drift › from` |
| L996 | `@keyframes particle-drift › to` |
| L999 | `.particle-combo-1` |
| L1000 | `.particle-combo-2` |
| L1001 | `.particle-combo-3` |
| L1004 | `.particle-calm` |
| L1009 | `.scatter-title` |
| L1012 | `@keyframes scatter-in` |
| L1013 | `@keyframes scatter-in › from` |
| L1014 | `@keyframes scatter-in › to` |
| L1022 | `.shockwave` |
| L1034 | `@keyframes shockwave-expand` |
| L1035 | `@keyframes shockwave-expand › from` |
| L1036 | `@keyframes shockwave-expand › to` |
| L1049 | `.pulse-correct` |
| L1052 | `@keyframes pulse-correct` |
| L1053 | `@keyframes pulse-correct › 0%` |
| L1054 | `@keyframes pulse-correct › 100%` |
| L1058 | `.shockwave-gold` |
| L1064 | `.blindspot-in` |
| L1067 | `@keyframes blindspot-in` |
| L1068 | `@keyframes blindspot-in › from` |
| L1069 | `@keyframes blindspot-in › to` |
| L1075 | `.ring-draw` |
| L1078 | `@keyframes ring-draw` |
| L1079 | `@keyframes ring-draw › from` |
| L1084 | `.radar-grow` |
| L1089 | `@keyframes radar-grow` |
| L1090 | `@keyframes radar-grow › from` |
| L1091 | `@keyframes radar-grow › to` |
| L1096 | `.combo-flame` |
| L1104 | `@keyframes flame-pulse` |
| L1105 | `@keyframes flame-pulse › 0%, 100%` |
| L1106 | `@keyframes flame-pulse › 50%` |
| L1111 | `.carousel-3d` |
| L1112 | `.carousel-card` |
| L1116 | `.carousel-card:hover` |
| L1117 | `.carousel-card[aria-current='true']` |
| L1121 | `.ring-rotate` |
| L1122 | `@keyframes ring-rotate` |
| L1123 | `@keyframes ring-rotate › from` |
| L1124 | `@keyframes ring-rotate › to` |
| L1152 | `:root` |
| L1164 | `.achievement-pop` |
| L1167 | `@keyframes achievement-pop` |
| L1168 | `@keyframes achievement-pop › from` |
| L1169 | `@keyframes achievement-pop › to` |
| L1179 | `.relax-in` |
| L1194 | `@keyframes ml-q-enter` |
| L1195 | `@keyframes ml-q-enter › from` |
| L1196 | `@keyframes ml-q-enter › to` |
| L1198 | `@keyframes ml-q-leave` |
| L1199 | `@keyframes ml-q-leave › from` |
| L1200 | `@keyframes ml-q-leave › to` |
| L1202 | `.ml-q-enter` |
| L1203 | `.ml-q-leave` |
| L1207 | `.ml-press` |
| L1208 | `.ml-press:active` |
| L1212 | `.ml-pick-on` |
| L1213 | `.ml-pick` |
| L1216 | `@keyframes ml-reveal` |
| L1217 | `@keyframes ml-reveal › from` |
| L1218 | `@keyframes ml-reveal › to` |
| L1220 | `.ml-reveal` |
| L1223 | `@keyframes ml-modal-in` |
| L1224 | `@keyframes ml-modal-in › from` |
| L1225 | `@keyframes ml-modal-in › to` |
| L1227 | `.ml-modal-in` |
| L1231 | `.ml-stagger` |
| L1237 | `.ml-lift` |
| L1238 | `.ml-lift:hover` |
| L1243 | `@keyframes ml-notice` |
| L1244 | `@keyframes ml-notice › 0%, 100%` |
| L1245 | `@keyframes ml-notice › 50%` |
| L1247 | `.ml-notice` |
| L1251 | `@media (prefers-reduced-motion: reduce)` |
| L1252 | `@media (prefers-reduced-motion: reduce) › .ml-q-enter, .ml-q-leave, .ml-reveal, .ml-modal-in, .ml-stagger` |
| L1256 | `@media (prefers-reduced-motion: reduce) › .ml-press, .ml-pick, .ml-lift` |
| L1257 | `@media (prefers-reduced-motion: reduce) › .ml-press:active, .ml-pick-on, .ml-lift:hover` |
| L1258 | `@media (prefers-reduced-motion: reduce) › .ml-notice` |
| L1270 | `html.font-easy .ml-q-enter, html.font-easy .ml-q-leave, html.font-easy .ml-reveal, html.font-easy .ml-modal-in, html.font-easy .ml-stagger, html.font-easy .ml-notice` |
| L1277 | `html.font-easy .ml-press, html.font-easy .ml-pick, html.font-easy .ml-lift` |
| L1282 | `html.font-easy .ml-press:active, html.font-easy .ml-pick-on, html.font-easy .ml-lift:hover` |
| L1287 | `@keyframes relax-in` |
| L1288 | `@keyframes relax-in › from` |
| L1289 | `@keyframes relax-in › to` |
| L1296 | `:root[data-theme='light'] .particle-bg, :root[data-theme='light'] .combo-flame` |
| L1304 | `html.font-easy .particle-bg, html.font-easy .combo-flame` |
| L1311 | `html.font-easy .scatter-title, html.font-easy .achievement-pop, html.font-easy .shockwave, html.font-easy .ring-rotate, html.font-easy .carousel-card` |
| L1318 | `html.font-easy .shockwave` |
| L1325 | `html.font-easy .pulse-correct, html.font-easy .blindspot-in, html.font-easy .ring-draw, html.font-easy .radar-grow` |
| L1342 | `html.font-easy .relax-in, html.font-easy .animate-slide-up, html.font-easy .animate-pop-in, html.font-easy .skeleton, html.font-easy .cmd-hl` |
| L1349 | `@media (prefers-reduced-motion: reduce)` |
| L1355 | `@media (prefers-reduced-motion: reduce) › .particle-bg, .combo-flame, .scatter-title, .achievement-pop, .ring-rotate, .carousel-card` |
| L1359 | `@media (prefers-reduced-motion: reduce) › .scatter-title` |
| L1360 | `@media (prefers-reduced-motion: reduce) › .achievement-pop` |
| L1361 | `@media (prefers-reduced-motion: reduce) › .carousel-card:hover` |
| L1362 | `@media (prefers-reduced-motion: reduce) › .shockwave` |
| L1369 | `@media (prefers-reduced-motion: reduce) › .pulse-correct, .blindspot-in, .ring-draw, .radar-grow, .relax-in` |
| L1384 | `@media (prefers-reduced-motion: reduce) › .animate-slide-up, .animate-pop-in` |
