<!-- generated from app/globals.css by scripts/gen-token-doc.mjs — do not edit -->

# 設計 token

**唯一來源係 `app/globals.css`，唔係呢個檔。** 呢度所有數字都由嗰邊抽出嚟。
改 token 改 CSS，然後重跑：

```bash
node scripts/gen-token-doc.mjs
```

掃到 **167** 個 custom property 宣告，分佈喺 **192** 個 block。

## ⚠️ 被覆蓋嘅宣告

同一個 token 喺預設態宣告咗多過一次。**上面嗰啲畫唔到** —— 後面嗰個贏。
照住早嗰個值去設計，出嚟嘅顏色同實際站唔同。

| token | 畫唔到嘅宣告 | 真正生效 | resolved |
|---|---|---|---|
| `--color-surface` | `#FAFAF8` (L45) | `var(--color-ml-canvas)` (L354) | `#F4F0EA` |
| `--color-surface-raised` | `#FFFFFF` (L46) | `var(--color-ml-surface)` (L355) | `#FFFDF9` |
| `--color-surface-sunken` | `#F5F5F0` (L47) | `var(--color-ml-muted)` (L356) | `#F0EBE3` |
| `--color-ink` | `#1A1A1A` (L59) | `var(--color-ml-ink)` (L357) | `#2C2A29` |
| `--color-ink-soft` | `#2D2D2D` (L60) | `#3D3A38` (L358) | `#3D3A38` |
| `--color-ink-muted` | `#5E5E5E` (L61) | `var(--color-ml-ink-soft)` (L359) | `#69635F` |
| `--color-ink-faint` | `#9CA3AF` (L66) | `#9C958D` (L360) | `#9C958D` |
| `--color-accent` | `#006B65` (L67) | `var(--color-ml-sage)` (L362) | `#57685C` |
| `--color-accent-strong` | `#00726C` (L68) | `var(--color-ml-sage)` (L363) | `#57685C` |
| `--color-accent-hover` | `#005F5A` (L72) | `#4D584A` (L364) | `#4D584A` |
| `--color-on-accent` | `#FFFFFF` (L73) | `var(--color-ml-on-brand)` (L365) | `#FFFFFF` |
| `--color-line` | `rgba(0, 0, 0, 0.06)` (L74) | `rgba(44, 42, 41, 0.08)` (L366) | `rgba(44, 42, 41, 0.08)` |
| `--color-line-strong` | `rgba(0, 0, 0, 0.12)` (L75) | `rgba(44, 42, 41, 0.16)` (L367) | `rgba(44, 42, 41, 0.16)` |
| `--color-scrim` | `rgba(0, 0, 0, 0.70)` (L81) | `rgba(44, 42, 41, 0.72)` (L369) | `rgba(44, 42, 41, 0.72)` |
| `--color-scrim-soft` | `rgba(0, 0, 0, 0.40)` (L82) | `rgba(44, 42, 41, 0.42)` (L370) | `rgba(44, 42, 41, 0.42)` |
| `--color-gold` | `#756238` (L99) | `var(--color-ml-clay)` (L376) | `#706347` |
| `--color-gold-soft` | `#D4A017` (L102) | `var(--color-ml-rose)` (L377) | `#B7A6A3` |
| `--color-gold-strong` | `#725106` (L103) | `#5F5144` (L378) | `#5F5144` |
| `--color-violet` | `#6D28D9` (L104) | `#5B666F` (L379) | `#5B666F` |
| `--color-violet-strong` | `#5B21B6` (L105) | `#4A545C` (L380) | `#4A545C` |
| `--color-rose` | `#C2185B` (L106) | `var(--color-ml-warn)` (L382) | `#845956` |
| `--color-rose-strong` | `#9D1449` (L108) | `#724D3D` (L383) | `#724D3D` |
| `--color-on-violet` | `#FFFFFF` (L111) | `#FFFFFF` (L381) | `#FFFFFF` |
| `--grade-5s` | `#8A6608` (L118) | `#846208` (L389) | `#846208` |
| `--grade-5` | `#177E3C` (L119) | `#16793A` (L390) | `#16793A` |
| `--color-ml-rose` | `#C5908B` (L166) | `#B7A6A3` (L171) | `#B7A6A3` |
| `--color-ml-mist` | `#AFC2D1` (L167) | `#8A9BA8` (L172) | `#8A9BA8` |
| `--ease-spring-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` (L1137) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1138) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` |

## Resolved — 預設態（冇 `data-theme` 屬性）

@theme ＋ 裸 `:root`，last-wins。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L865) | — |  |
| `--color-accent` | `#57685C` | `var(--color-ml-sage)` (L362) | `--color-ml-sage` | 4.75 |
| `--color-accent-hover` | `#4D584A` | `#4D584A` (L364) | — | 白字 7.47 |
| `--color-accent-strong` | `#57685C` | `var(--color-ml-sage)` (L363) | `--color-ml-sage` | 白字掣 5.64 |
| `--color-bg-dark` | `#080C14` | `#080C14` (L35) | — |  |
| `--color-bg-dark-2` | `#0B1120` | `#0B1120` (L36) | — |  |
| `--color-gold` | `#706347` | `var(--color-ml-clay)` (L376) | `--color-ml-clay` | 4.56（四底面） |
| `--color-gold-soft` | `#B7A6A3` | `var(--color-ml-rose)` (L377) | `--color-ml-rose` | 1.97 —— 永遠唔可以做字色 |
| `--color-gold-strong` | `#5F5144` | `#5F5144` (L378) | — | 5.94 / 白字 7.64 |
| `--color-ink` | `#2C2A29` | `var(--color-ml-ink)` (L357) | `--color-ml-ink` |  |
| `--color-ink-faint` | `#9C958D` | `#9C958D` (L360) | — | 2.49 —— 同上游一樣，只准用於停用控件／ |
| `--color-ink-muted` | `#69635F` | `var(--color-ml-ink-soft)` (L359) | `--color-ml-ink-soft` | 4.84 |
| `--color-ink-soft` | `#3D3A38` | `#3D3A38` (L358) | — | 9.51 |
| `--color-line` | `rgba(44, 42, 41, 0.08)` | `rgba(44, 42, 41, 0.08)` (L366) | — |  |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` | `rgba(44, 42, 41, 0.16)` (L367) | — |  |
| `--color-ml-canvas` | `#F4F0EA` | `#F4F0EA` (L149) | — | 頁面底 |
| `--color-ml-clay` | `#706347` | `#706347` (L158) | — | PC-011↓ 強調、失分標示（4.56 / 白字掣 5.63） |
| `--color-ml-good` | `#566953` | `#566953` (L161) | — | PC-032↓ 達標（4.59 / 白字掣 5.68） |
| `--color-ml-ink` | `#2C2A29` | `#2C2A29` (L153) | — | 正文（12.04） |
| `--color-ml-ink-soft` | `#69635F` | `#69635F` (L154) | — | 輔助（4.57，四底面） |
| `--color-ml-line` | `#8A8377` | `#8A8377` (L162) | — | PC-027↓ 控件邊界（3.16，WCAG 1.4.11）。 |
| `--color-ml-mist` | `#8A9BA8` | `#8A9BA8` (L172) | — | 資訊／交通 —— 純裝飾填色 |
| `--color-ml-muted` | `#F0EBE3` | `#F0EBE3` (L151) | — | 次級區塊。⚠️ 規格原值 #E8E2D9 太深， |
| `--color-ml-on-brand` | `#FFFFFF` | `#FFFFFF` (L165) | — | 實心掣上嘅字（Light 用白字） |
| `--color-ml-rose` | `#B7A6A3` | `#B7A6A3` (L171) | — | 情緒／關懷 —— 純裝飾填色 |
| `--color-ml-sage` | `#57685C` | `#57685C` (L157) | — | PC-016↓ 主行動、正確（4.59 / 白字掣 5.68） |
| `--color-ml-surface` | `#FFFDF9` | `#FFFDF9` (L150) | — | 卡片 |
| `--color-ml-warn` | `#845956` | `#845956` (L159) | — | PC-003↓ 超時、警告（4.58 / 白字掣 5.66）。 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L31) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L32) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L34) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L33) | — |  |
| `--color-on-accent` | `#FFFFFF` | `var(--color-ml-on-brand)` (L365) | `--color-ml-on-brand` |  |
| `--color-on-violet` | `#FFFFFF` | `#FFFFFF` (L381) | — |  |
| `--color-paper` | `#F5E7C8` | `#F5E7C8` (L25) | — | PC-009 試卷紙（暗色模式改舊紙色，見下） |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L26) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L27) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L28) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#845956` | `var(--color-ml-warn)` (L382) | `--color-ml-warn` | 4.66 |
| `--color-rose-strong` | `#724D3D` | `#724D3D` (L383) | — | 白字 7.38 |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` | `rgba(44, 42, 41, 0.72)` (L369) | — |  |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` | `rgba(44, 42, 41, 0.42)` (L370) | — |  |
| `--color-subj-clay` | `#706347` | `#706347` (L94) | — | PC-011↓ 4.61 |
| `--color-subj-mist` | `#4D667E` | `#4D667E` (L93) | — | PC-020↓ 4.67 |
| `--color-subj-moss` | `#566953` | `#566953` (L92) | — | PC-032↓ 4.65 |
| `--color-subj-rose` | `#845956` | `#845956` (L95) | — | PC-003↓ 4.69 |
| `--color-subj-sage` | `#57685C` | `#57685C` (L91) | — | PC-016↓ 4.66 |
| `--color-subj-stone` | `#666557` | `#666557` (L96) | — | PC-028↓ 4.68 |
| `--color-surface` | `#F4F0EA` | `var(--color-ml-canvas)` (L354) | `--color-ml-canvas` |  |
| `--color-surface-raised` | `#FFFDF9` | `var(--color-ml-surface)` (L355) | `--color-ml-surface` |  |
| `--color-surface-sunken` | `#F0EBE3` | `var(--color-ml-muted)` (L356) | `--color-ml-muted` |  |
| `--color-text-primary` | `#E2E8F0` | `#E2E8F0` (L37) | — | = slate-200；正文繼續用 slate utilities |
| `--color-text-secondary` | `#94A3B8` | `#94A3B8` (L38) | — | = slate-400 |
| `--color-violet` | `#5B666F` | `#5B666F` (L379) | — | mist-strong 4.95 |
| `--color-violet-strong` | `#4A545C` | `#4A545C` (L380) | — | 白字 7.19 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1138) | — |  |
| `--grade-1` | `#334155` | `#334155` (L123) | — | 9.47 |
| `--grade-2` | `#475569` | `#475569` (L122) | — | 6.93 |
| `--grade-3` | `#7E22CE` | `#7E22CE` (L121) | — | 6.39 |
| `--grade-4` | `#1E52B8` | `#1E52B8` (L120) | — | 6.50 |
| `--grade-5` | `#16793A` | `#16793A` (L390) | — | 4.62（原 #177E3C 落莫蘭迪底只有 4.33） |
| `--grade-5s` | `#846208` | `#846208` (L389) | — | 4.74（原 #8A6608 落莫蘭迪底只有 4.44） |
| `--grade-5ss` | `#9A5B06` | `#9A5B06` (L117) | — | 4.96 |
| `--grade-u` | `#9D1449` | `#9D1449` (L124) | — | 7.30 —— 玫紅，唔用正紅（憲章 §大愛） |
| `--sidebar-w` | `0px` | `0px` (L893) | — |  |

## Resolved — `data-theme='cyber'`（暗色）

預設態再由 `:root[data-theme='cyber']` 覆蓋（specificity 0,1,1 贏 0,0,1）。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L865) | — |  |
| `--color-accent` | `#7a9e7e` | `var(--color-ml-sage)` (L220) | `--color-ml-sage` |  |
| `--color-accent-hover` | `#6b8f71` | `#6b8f71` (L222) | — | 規格 --moss-dark。深字掣 4.85 ✅ |
| `--color-accent-strong` | `#7a9e7e` | `var(--color-ml-sage)` (L221) | `--color-ml-sage` |  |
| `--color-bg-dark` | `#080C14` | `#080C14` (L35) | — |  |
| `--color-bg-dark-2` | `#0B1120` | `#0B1120` (L36) | — |  |
| `--color-gold` | `#b8956f` | `var(--color-ml-clay)` (L260) | `--color-ml-clay` | #b8956f 規格 --wood  4.89 |
| `--color-gold-soft` | `#e6ba8b` | `#e6ba8b` (L261) | — | wood ×1.25  7.60 —— 全站 1 處，做 border |
| `--color-gold-strong` | `#d4ab80` | `#d4ab80` (L262) | — | wood ×1.15  6.42 —— 全站 10 處做字色，故要 ≥4.5 |
| `--color-ink` | `#f0e8dc` | `var(--color-ml-ink)` (L204) | `--color-ml-ink` | #f0e8dc  11.16　規格 --text-primary |
| `--color-ink-faint` | `#6b6560` | `#6b6560` (L207) | — | 2.36 —— 停用控件／裝飾專用（原 2.28） |
| `--color-ink-muted` | `#a8a095` | `var(--color-ml-ink-soft)` (L206) | `--color-ml-ink-soft` | #a8a095  5.25　規格 --text-secondary（原 4.63，升咗） |
| `--color-ink-soft` | `#c1bab0` | `#c1bab0` (L205) | — | 7.05　規格冇呢一階，由 --cream 壓暗推導 |
| `--color-line` | `rgba(232, 224, 212, 0.06)` | `rgba(232, 224, 212, 0.06)` (L237) | — |  |
| `--color-line-strong` | `rgba(232, 224, 212, 0.12)` | `rgba(232, 224, 212, 0.12)` (L238) | — |  |
| `--color-ml-canvas` | `#1a1917` | `#1a1917` (L298) | — | 規格 --bg-primary |
| `--color-ml-clay` | `#b8956f` | `#b8956f` (L306) | — | 規格 --wood  文字 4.89 / 深字掣 6.33 |
| `--color-ml-good` | `#9ab89d` | `#9ab89d` (L308) | — | moss ×1.25   文字 6.28 —— 規格冇「達標」色， |
| `--color-ml-ink` | `#f0e8dc` | `#f0e8dc` (L303) | — | 規格 --text-primary    11.16 |
| `--color-ml-ink-soft` | `#a8a095` | `#a8a095` (L304) | — | 規格 --text-secondary   5.25 |
| `--color-ml-line` | `#918a7e` | `#918a7e` (L310) | — | 控件邊界 3.97（WCAG 1.4.11 ≥3:1）。 |
| `--color-ml-mist` | `#8a9fb8` | `#8a9fb8` (L316) | — | 規格 --mist  裝飾（4.99） |
| `--color-ml-muted` | `#2f2e2c` | `#2f2e2c` (L300) | — | 規格 --bg-elevated |
| `--color-ml-on-brand` | `#1a1917` | `#1a1917` (L314) | — | 實心掣上嘅字（Dark 用深字，規格 §3.3 一致） |
| `--color-ml-rose` | `#c49a9a` | `#c49a9a` (L315) | — | 規格 --rose  裝飾（5.45） |
| `--color-ml-sage` | `#7a9e7e` | `#7a9e7e` (L305) | — | 規格 --moss  文字 4.53 / 深字掣 5.87 |
| `--color-ml-surface` | `#252422` | `#252422` (L299) | — | 規格 --bg-card |
| `--color-ml-warn` | `#c49a9a` | `#c49a9a` (L307) | — | 規格 --rose  文字 5.45 / 深字掣 7.06 |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L31) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L32) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L34) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L33) | — |  |
| `--color-on-accent` | `#1a1917` | `var(--color-ml-on-brand)` (L228) | `--color-ml-on-brand` | #1a1917 |
| `--color-on-violet` | `#1a1917` | `#1a1917` (L267) | — | 深字 on 霧藍 = 6.47（白字只有 1.9） |
| `--color-paper` | `#DDD3C6` | `#DDD3C6` (L245) | — | PC-026 舊紙。純白紙落 #1a1917 頁底係 17.57， |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L26) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L27) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L28) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#c49a9a` | `var(--color-ml-warn)` (L265) | `--color-ml-warn` | #c49a9a 規格 --rose  5.45 |
| `--color-rose-strong` | `#b89191` | `#b89191` (L266) | — | rose ×0.94  4.84 —— 有 1 處做字色，故要 ≥4.5 |
| `--color-scrim` | `rgba(10, 9, 9, 0.78)` | `rgba(10, 9, 9, 0.78)` (L239) | — |  |
| `--color-scrim-soft` | `rgba(10, 9, 9, 0.50)` | `rgba(10, 9, 9, 0.50)` (L240) | — |  |
| `--color-subj-clay` | `#b8956f` | `#b8956f` (L325) | — | 規格 --wood   4.89 |
| `--color-subj-mist` | `#8a9fb8` | `#8a9fb8` (L324) | — | 規格 --mist   4.99 |
| `--color-subj-moss` | `#9ab89d` | `#9ab89d` (L323) | — | moss ×1.25    6.28 |
| `--color-subj-rose` | `#c49a9a` | `#c49a9a` (L326) | — | 規格 --rose   5.45 |
| `--color-subj-sage` | `#7a9e7e` | `#7a9e7e` (L322) | — | 規格 --moss   4.53 |
| `--color-subj-stone` | `#c1bab0` | `#c1bab0` (L327) | — | 岩灰          7.05 |
| `--color-surface` | `#1a1917` | `var(--color-ml-canvas)` (L200) | `--color-ml-canvas` | #1a1917 規格 --bg-primary |
| `--color-surface-raised` | `#252422` | `var(--color-ml-surface)` (L201) | `--color-ml-surface` | #252422 規格 --bg-card |
| `--color-surface-sunken` | `#2f2e2c` | `var(--color-ml-muted)` (L202) | `--color-ml-muted` | #2f2e2c 規格 --bg-elevated |
| `--color-text-primary` | `#E2E8F0` | `#E2E8F0` (L37) | — | = slate-200；正文繼續用 slate utilities |
| `--color-text-secondary` | `#94A3B8` | `#94A3B8` (L38) | — | = slate-400 |
| `--color-violet` | `#8a9fb8` | `var(--color-ml-mist)` (L263) | `--color-ml-mist` | #8a9fb8 規格 --mist  4.99 |
| `--color-violet-strong` | `#a8c2e0` | `#a8c2e0` (L264) | — | mist ×1.22  7.40 —— 3 處做字色 |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1138) | — |  |
| `--grade-1` | `#a8a095` | `#a8a095` (L282) | — | 規格 --text-secondary 5.25 |
| `--grade-2` | `#c1bab0` | `#c1bab0` (L281) | — | 岩灰                7.05 |
| `--grade-3` | `#b8956f` | `#b8956f` (L280) | — | 規格 --wood         4.89 |
| `--grade-4` | `#8a9fb8` | `#8a9fb8` (L279) | — | 規格 --mist         4.99 —— 同 5 分開色相 |
| `--grade-5` | `#7a9e7e` | `#7a9e7e` (L278) | — | 規格 --moss         4.53 |
| `--grade-5s` | `#9ab89d` | `#9ab89d` (L277) | — | moss ×1.25          6.28 |
| `--grade-5ss` | `#e8e0d4` | `#e8e0d4` (L276) | — | 規格 --cream        10.36 |
| `--grade-u` | `#c49a9a` | `#c49a9a` (L283) | — | 規格 --rose         5.45 —— 唔用正紅（憲章 §7） |
| `--sidebar-w` | `0px` | `0px` (L893) | — |  |

## 其他 scope

唔屬於上面兩個全站狀態嘅宣告（media query、無障礙 class、屬性 scope）。
列出嚟係因為漏咗一個 scope，就係一個永遠搵唔到嘅「點解個值唔啱」。

| token | 值 | scope | media | 行 |
|---|---|---|---|---|
| `--color-ink` | `#F0E8DC` | `.on-dark-overlay` | — | L423 |
| `--color-ink-soft` | `#C1BAB0` | `.on-dark-overlay` | — | L424 |
| `--color-ink-muted` | `#A8A095` | `.on-dark-overlay` | — | L425 |
| `--color-ink-faint` | `#6B6560` | `.on-dark-overlay` | — | L426 |
| `--color-accent` | `#7A9E7E` | `.on-dark-overlay` | — | L427 |
| `--color-accent-strong` | `#7A9E7E` | `.on-dark-overlay` | — | L428 |
| `--color-on-accent` | `#1A1917` | `.on-dark-overlay` | — | L429 |
| `--color-surface-sunken` | `#2F2E2C` | `.on-dark-overlay` | — | L430 |
| `--color-line` | `rgba(232, 224, 212, 0.10)` | `.on-dark-overlay` | — | L431 |
| `--color-line-strong` | `rgba(232, 224, 212, 0.20)` | `.on-dark-overlay` | — | L432 |
| `--bottom-nav-h` | `3.5rem` | `html[data-bottomnav='on']` | — | L868 |
| `--bottom-nav-h` | `0px` | `html[data-bottomnav='on']` | `@media (min-width: 768px)` | L875 |
| `--sidebar-w` | `5rem` | `html[data-sidebar='on']` | `@media (min-width: 64rem)` | L899 |
| `--sidebar-w` | `260px` | `html[data-sidebar='on']` | `@media (min-width: 80rem)` | L904 |
| `--particle-speed` | `20s` | `.particle-bg` | — | L972 |
| `--particle-alpha` | `0.15` | `.particle-bg` | — | L973 |
| `--particle-speed` | `12s` | `.particle-combo-1` | — | L983 |
| `--particle-speed` | `8s` | `.particle-combo-2` | — | L984 |
| `--particle-speed` | `5s` | `.particle-combo-3` | — | L985 |
| `--particle-speed` | `40s` | `.particle-calm` | — | L988 |
| `--particle-alpha` | `0.05` | `.particle-calm` | — | L988 |
| `--flame-rgb` | `0, 245, 212` | `.combo-flame` | — | L1081 |
| `--flame-speed` | `1.5s` | `.combo-flame` | — | L1082 |

## 掃過嘅 block

| 行 | selector |
|---|---|
| L13 | `@theme` |
| L197 | `:root[data-theme='cyber']` |
| L353 | `:root` |
| L422 | `.on-dark-overlay` |
| L435 | `body` |
| L441 | `html` |
| L460 | `html` |
| L471 | `img, svg, video, canvas, iframe` |
| L476 | `img, video` |
| L483 | `body` |
| L487 | `.katex` |
| L494 | `.animate-on-scroll` |
| L500 | `.animate-on-scroll.visible` |
| L504 | `.stagger-1` |
| L505 | `.stagger-2` |
| L506 | `.stagger-3` |
| L507 | `.stagger-4` |
| L508 | `@media (prefers-reduced-motion: reduce)` |
| L509 | `@media (prefers-reduced-motion: reduce) › .animate-on-scroll` |
| L512 | `::-webkit-scrollbar` |
| L515 | `::-webkit-scrollbar-track` |
| L518 | `::-webkit-scrollbar-thumb` |
| L534 | `@keyframes pop-in` |
| L535 | `@keyframes pop-in › 0%` |
| L536 | `@keyframes pop-in › 100%` |
| L539 | `@keyframes slide-up` |
| L540 | `@keyframes slide-up › from` |
| L541 | `@keyframes slide-up › to` |
| L544 | `@keyframes fill-bar` |
| L545 | `@keyframes fill-bar › from` |
| L546 | `@keyframes fill-bar › to` |
| L549 | `.animate-pop-in` |
| L553 | `.animate-slide-up` |
| L567 | `@media print` |
| L578 | `@media print › nav, footer:not(.print-keep), button:not(.print-keep), .no-print, nextjs-portal` |
| L584 | `@media print › html, body` |
| L593 | `@media print › .min-h-screen` |
| L597 | `@media print › body, body *` |
| L609 | `@media print › [class*="bg-slate-9"], [class*="bg-slate-8"], [class*="bg-amber-5"], [class*="bg-rose-5"], [class*="bg-indigo-5"], [class*="bg-green-5"], [class*="bg-emerald-5"]` |
| L616 | `@media print › @page` |
| L621 | `@media print › .rounded-2xl, .rounded-xl` |
| L627 | `@media print › .paper-sheet` |
| L633 | `@media print › .paper-q` |
| L638 | `@media print › .paper-write-space` |
| L661 | `html.no-motion *, html.no-motion *::before, html.no-motion *::after` |
| L666 | `html.no-motion` |
| L676 | `@keyframes skeleton-breathe` |
| L677 | `@keyframes skeleton-breathe › 0%, 100%` |
| L678 | `@keyframes skeleton-breathe › 50%` |
| L680 | `.skeleton` |
| L686 | `@media (prefers-reduced-motion: reduce)` |
| L687 | `@media (prefers-reduced-motion: reduce) › .skeleton` |
| L694 | `@font-face` |
| L701 | `html.font-easy body` |
| L710 | `html.font-easy p, html.font-easy li` |
| L722 | `html.a11y-spacing body, html.a11y-spacing p, html.a11y-spacing li, html.a11y-spacing label, html.a11y-spacing button` |
| L760 | `html.focus-light .focus-dim` |
| L765 | `html.focus-light .focus-dim:hover, html.focus-light .focus-dim:focus-within` |
| L777 | `.katex-display` |
| L787 | `.skip-link` |
| L797 | `.skip-link:focus` |
| L818 | `@keyframes cmd-hl-in` |
| L819 | `@keyframes cmd-hl-in › from` |
| L820 | `@keyframes cmd-hl-in › to` |
| L822 | `.cmd-hl` |
| L831 | `.cmd-hl-soft` |
| L835 | `@media (prefers-reduced-motion: reduce)` |
| L836 | `@media (prefers-reduced-motion: reduce) › .cmd-hl` |
| L842 | `@keyframes sand-stream` |
| L843 | `@keyframes sand-stream › to` |
| L845 | `.hourglass-stream` |
| L849 | `.hourglass-soft .hourglass-stream` |
| L852 | `@media (prefers-reduced-motion: reduce)` |
| L853 | `@media (prefers-reduced-motion: reduce) › .hourglass-stream` |
| L864 | `:root` |
| L867 | `html[data-bottomnav='on']` |
| L873 | `@media (min-width: 768px)` |
| L874 | `@media (min-width: 768px) › html[data-bottomnav='on']` |
| L878 | `.floating-bottom` |
| L892 | `:root` |
| L897 | `@media (min-width: 64rem)` |
| L898 | `@media (min-width: 64rem) › html[data-sidebar='on']` |
| L902 | `@media (min-width: 80rem)` |
| L903 | `@media (min-width: 80rem) › html[data-sidebar='on']` |
| L911 | `html.no-motion .mascot` |
| L916 | `.floating-left` |
| L919 | `.floating-left-2` |
| L924 | `.floating-bottom-2` |
| L927 | `.floating-bottom-3` |
| L939 | `.floating-panel-max-h` |
| L971 | `.particle-bg` |
| L978 | `@keyframes particle-drift` |
| L979 | `@keyframes particle-drift › from` |
| L980 | `@keyframes particle-drift › to` |
| L983 | `.particle-combo-1` |
| L984 | `.particle-combo-2` |
| L985 | `.particle-combo-3` |
| L988 | `.particle-calm` |
| L993 | `.scatter-title` |
| L996 | `@keyframes scatter-in` |
| L997 | `@keyframes scatter-in › from` |
| L998 | `@keyframes scatter-in › to` |
| L1006 | `.shockwave` |
| L1018 | `@keyframes shockwave-expand` |
| L1019 | `@keyframes shockwave-expand › from` |
| L1020 | `@keyframes shockwave-expand › to` |
| L1033 | `.pulse-correct` |
| L1036 | `@keyframes pulse-correct` |
| L1037 | `@keyframes pulse-correct › 0%` |
| L1038 | `@keyframes pulse-correct › 100%` |
| L1042 | `.shockwave-gold` |
| L1048 | `.blindspot-in` |
| L1051 | `@keyframes blindspot-in` |
| L1052 | `@keyframes blindspot-in › from` |
| L1053 | `@keyframes blindspot-in › to` |
| L1059 | `.ring-draw` |
| L1062 | `@keyframes ring-draw` |
| L1063 | `@keyframes ring-draw › from` |
| L1068 | `.radar-grow` |
| L1073 | `@keyframes radar-grow` |
| L1074 | `@keyframes radar-grow › from` |
| L1075 | `@keyframes radar-grow › to` |
| L1080 | `.combo-flame` |
| L1088 | `@keyframes flame-pulse` |
| L1089 | `@keyframes flame-pulse › 0%, 100%` |
| L1090 | `@keyframes flame-pulse › 50%` |
| L1095 | `.carousel-3d` |
| L1096 | `.carousel-card` |
| L1100 | `.carousel-card:hover` |
| L1101 | `.carousel-card[aria-current='true']` |
| L1105 | `.ring-rotate` |
| L1106 | `@keyframes ring-rotate` |
| L1107 | `@keyframes ring-rotate › from` |
| L1108 | `@keyframes ring-rotate › to` |
| L1136 | `:root` |
| L1148 | `.achievement-pop` |
| L1151 | `@keyframes achievement-pop` |
| L1152 | `@keyframes achievement-pop › from` |
| L1153 | `@keyframes achievement-pop › to` |
| L1163 | `.relax-in` |
| L1178 | `@keyframes ml-q-enter` |
| L1179 | `@keyframes ml-q-enter › from` |
| L1180 | `@keyframes ml-q-enter › to` |
| L1182 | `@keyframes ml-q-leave` |
| L1183 | `@keyframes ml-q-leave › from` |
| L1184 | `@keyframes ml-q-leave › to` |
| L1186 | `.ml-q-enter` |
| L1187 | `.ml-q-leave` |
| L1191 | `.ml-press` |
| L1192 | `.ml-press:active` |
| L1196 | `.ml-pick-on` |
| L1197 | `.ml-pick` |
| L1200 | `@keyframes ml-reveal` |
| L1201 | `@keyframes ml-reveal › from` |
| L1202 | `@keyframes ml-reveal › to` |
| L1204 | `.ml-reveal` |
| L1207 | `@keyframes ml-modal-in` |
| L1208 | `@keyframes ml-modal-in › from` |
| L1209 | `@keyframes ml-modal-in › to` |
| L1211 | `.ml-modal-in` |
| L1215 | `.ml-stagger` |
| L1221 | `.ml-lift` |
| L1222 | `.ml-lift:hover` |
| L1227 | `@keyframes ml-notice` |
| L1228 | `@keyframes ml-notice › 0%, 100%` |
| L1229 | `@keyframes ml-notice › 50%` |
| L1231 | `.ml-notice` |
| L1235 | `@media (prefers-reduced-motion: reduce)` |
| L1236 | `@media (prefers-reduced-motion: reduce) › .ml-q-enter, .ml-q-leave, .ml-reveal, .ml-modal-in, .ml-stagger` |
| L1240 | `@media (prefers-reduced-motion: reduce) › .ml-press, .ml-pick, .ml-lift` |
| L1241 | `@media (prefers-reduced-motion: reduce) › .ml-press:active, .ml-pick-on, .ml-lift:hover` |
| L1242 | `@media (prefers-reduced-motion: reduce) › .ml-notice` |
| L1254 | `html.font-easy .ml-q-enter, html.font-easy .ml-q-leave, html.font-easy .ml-reveal, html.font-easy .ml-modal-in, html.font-easy .ml-stagger, html.font-easy .ml-notice` |
| L1261 | `html.font-easy .ml-press, html.font-easy .ml-pick, html.font-easy .ml-lift` |
| L1266 | `html.font-easy .ml-press:active, html.font-easy .ml-pick-on, html.font-easy .ml-lift:hover` |
| L1271 | `@keyframes relax-in` |
| L1272 | `@keyframes relax-in › from` |
| L1273 | `@keyframes relax-in › to` |
| L1280 | `:root[data-theme='light'] .particle-bg, :root[data-theme='light'] .combo-flame` |
| L1288 | `html.font-easy .particle-bg, html.font-easy .combo-flame` |
| L1295 | `html.font-easy .scatter-title, html.font-easy .achievement-pop, html.font-easy .shockwave, html.font-easy .ring-rotate, html.font-easy .carousel-card` |
| L1302 | `html.font-easy .shockwave` |
| L1309 | `html.font-easy .pulse-correct, html.font-easy .blindspot-in, html.font-easy .ring-draw, html.font-easy .radar-grow` |
| L1326 | `html.font-easy .relax-in, html.font-easy .animate-slide-up, html.font-easy .animate-pop-in, html.font-easy .skeleton, html.font-easy .cmd-hl` |
| L1333 | `@media (prefers-reduced-motion: reduce)` |
| L1339 | `@media (prefers-reduced-motion: reduce) › .particle-bg, .combo-flame, .scatter-title, .achievement-pop, .ring-rotate, .carousel-card` |
| L1343 | `@media (prefers-reduced-motion: reduce) › .scatter-title` |
| L1344 | `@media (prefers-reduced-motion: reduce) › .achievement-pop` |
| L1345 | `@media (prefers-reduced-motion: reduce) › .carousel-card:hover` |
| L1346 | `@media (prefers-reduced-motion: reduce) › .shockwave` |
| L1353 | `@media (prefers-reduced-motion: reduce) › .pulse-correct, .blindspot-in, .ring-draw, .radar-grow, .relax-in` |
| L1368 | `@media (prefers-reduced-motion: reduce) › .animate-slide-up, .animate-pop-in` |
