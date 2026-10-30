<!-- generated from app/globals.css by scripts/gen-token-doc.mjs — do not edit -->

# 設計 token

**唯一來源係 `app/globals.css`，唔係呢個檔。** 呢度所有數字都由嗰邊抽出嚟。
改 token 改 CSS，然後重跑：

```bash
node scripts/gen-token-doc.mjs
```

掃到 **273** 個 custom property 宣告，分佈喺 **240** 個 block。

## ⚠️ 被覆蓋嘅宣告

同一個 token 喺預設態宣告咗多過一次。**上面嗰啲畫唔到** —— 後面嗰個贏。
照住早嗰個值去設計，出嚟嘅顏色同實際站唔同。

| token | 畫唔到嘅宣告 | 真正生效 | resolved |
|---|---|---|---|
| `--color-surface` | `#F4F0EA` (L52)<br>`var(--color-ml-canvas)` (L336) | `#f2f2f7` (L1505) | `#f2f2f7` |
| `--color-surface-raised` | `#FFFDF9` (L53)<br>`var(--color-ml-surface)` (L337) | `#ffffff` (L1506) | `#ffffff` |
| `--color-surface-sunken` | `#F0EBE3` (L54)<br>`var(--color-ml-muted)` (L338) | `#e5e5ea` (L1507) | `#e5e5ea` |
| `--color-ink` | `#2C2A29` (L55)<br>`var(--color-ml-ink)` (L339) | `#1c1c1e` (L1508) | `#1c1c1e` |
| `--color-ink-soft` | `#3D3A38` (L56)<br>`#3D3A38` (L340) | `#3a3a3c` (L1509) | `#3a3a3c` |
| `--color-ink-muted` | `#69635F` (L57)<br>`var(--color-ml-ink-soft)` (L341) | `#636366` (L1510) | `#636366` |
| `--color-ink-faint` | `#9C958D` (L59)<br>`#9C958D` (L342) | `#aeaeb2` (L1511) | `#aeaeb2` |
| `--color-accent` | `#57685C` (L60)<br>`var(--color-ml-sage)` (L344) | `#0055aa` (L1512) | `#0055aa` |
| `--color-accent-strong` | `#57685C` (L61)<br>`var(--color-ml-sage)` (L345) | `#0071e3` (L1513) | `#0071e3` |
| `--color-accent-hover` | `#4D584A` (L62)<br>`#4D584A` (L346) | `#0060c0` (L1514) | `#0060c0` |
| `--color-on-accent` | `#FFFFFF` (L63)<br>`var(--color-ml-on-brand)` (L347) | `#ffffff` (L1515) | `#ffffff` |
| `--color-line` | `rgba(44, 42, 41, 0.08)` (L64)<br>`rgba(44, 42, 41, 0.08)` (L348) | `rgba(60, 60, 67, 0.12)` (L1516) | `rgba(60, 60, 67, 0.12)` |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` (L65)<br>`rgba(44, 42, 41, 0.16)` (L349) | `rgba(60, 60, 67, 0.29)` (L1517) | `rgba(60, 60, 67, 0.29)` |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` (L68)<br>`rgba(44, 42, 41, 0.72)` (L351) | `rgba(0, 0, 0, 0.4)` (L1518) | `rgba(0, 0, 0, 0.4)` |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` (L69)<br>`rgba(44, 42, 41, 0.42)` (L352) | `rgba(0, 0, 0, 0.24)` (L1519) | `rgba(0, 0, 0, 0.24)` |
| `--color-gold` | `#706347` (L86)<br>`var(--color-ml-clay)` (L358) | `#b25000` (L1520) | `#b25000` |
| `--color-gold-soft` | `#B7A6A3` (L87)<br>`var(--color-ml-rose)` (L359) | `#ffd60a` (L1521) | `#ffd60a` |
| `--color-gold-strong` | `#5F5144` (L88)<br>`#5F5144` (L360) | `#9a4500` (L1522) | `#9a4500` |
| `--color-violet` | `#5B666F` (L89)<br>`#5B666F` (L361) | `#5856d6` (L1523) | `#5856d6` |
| `--color-violet-strong` | `#4A545C` (L90)<br>`#4A545C` (L362) | `#3634a3` (L1524) | `#3634a3` |
| `--color-rose` | `#845956` (L91)<br>`var(--color-ml-warn)` (L364) | `#d70015` (L1525) | `#d70015` |
| `--color-rose-strong` | `#724D3D` (L92)<br>`#724D3D` (L365) | `#b00012` (L1526) | `#b00012` |
| `--color-on-violet` | `#FFFFFF` (L93) | `#FFFFFF` (L363) | `#FFFFFF` |
| `--grade-5s` | `#846208` (L100) | `#846208` (L371) | `#846208` |
| `--grade-5` | `#16793A` (L101) | `#16793A` (L372) | `#16793A` |
| `--color-ml-canvas` | `#F4F0EA` (L131) | `#f2f2f7` (L1527) | `#f2f2f7` |
| `--color-ml-surface` | `#FFFDF9` (L132) | `#ffffff` (L1528) | `#ffffff` |
| `--color-ml-muted` | `#F0EBE3` (L133) | `#e5e5ea` (L1529) | `#e5e5ea` |
| `--color-ml-ink` | `#2C2A29` (L135) | `#1c1c1e` (L1530) | `#1c1c1e` |
| `--color-ml-ink-soft` | `#69635F` (L136) | `#6c6c70` (L1531) | `#6c6c70` |
| `--color-ml-sage` | `#57685C` (L139) | `#0071e3` (L1532) | `#0071e3` |
| `--color-ml-clay` | `#706347` (L140) | `#b25000` (L1533) | `#b25000` |
| `--color-ml-warn` | `#845956` (L141) | `#d70015` (L1534) | `#d70015` |
| `--color-ml-good` | `#566953` (L143) | `#248a3d` (L1535) | `#248a3d` |
| `--color-ml-on-brand` | `#FFFFFF` (L147) | `#ffffff` (L1536) | `#ffffff` |
| `--color-ml-rose` | `#C5908B` (L148) | `#B7A6A3` (L153) | `#B7A6A3` |
| `--color-ml-mist` | `#AFC2D1` (L149) | `#8A9BA8` (L154) | `#8A9BA8` |
| `--ease-spring-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` (L1100) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1101) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` |

## Resolved — 預設態（冇 `data-theme` 屬性）

@theme ＋ 裸 `:root`，last-wins。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L850) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L14) | — |  |
| `--color-accent` | `#0055aa` | `#0055aa` (L1512) | — |  |
| `--color-accent-hover` | `#0060c0` | `#0060c0` (L1514) | — |  |
| `--color-accent-strong` | `#0071e3` | `#0071e3` (L1513) | — |  |
| `--color-gold` | `#b25000` | `#b25000` (L1520) | — |  |
| `--color-gold-soft` | `#ffd60a` | `#ffd60a` (L1521) | — |  |
| `--color-gold-strong` | `#9a4500` | `#9a4500` (L1522) | — |  |
| `--color-ink` | `#1c1c1e` | `#1c1c1e` (L1508) | — |  |
| `--color-ink-faint` | `#aeaeb2` | `#aeaeb2` (L1511) | — |  |
| `--color-ink-muted` | `#636366` | `#636366` (L1510) | — |  |
| `--color-ink-soft` | `#3a3a3c` | `#3a3a3c` (L1509) | — |  |
| `--color-line` | `rgba(60, 60, 67, 0.12)` | `rgba(60, 60, 67, 0.12)` (L1516) | — |  |
| `--color-line-strong` | `rgba(60, 60, 67, 0.29)` | `rgba(60, 60, 67, 0.29)` (L1517) | — |  |
| `--color-material` | `rgba(255, 255, 255, 0.72)` | `rgba(255, 255, 255, 0.72)` (L1537) | — |  |
| `--color-material-heavy` | `rgba(242, 242, 247, 0.86)` | `rgba(242, 242, 247, 0.86)` (L1538) | — |  |
| `--color-ml-canvas` | `#f2f2f7` | `#f2f2f7` (L1527) | — |  |
| `--color-ml-clay` | `#b25000` | `#b25000` (L1533) | — |  |
| `--color-ml-good` | `#248a3d` | `#248a3d` (L1535) | — |  |
| `--color-ml-ink` | `#1c1c1e` | `#1c1c1e` (L1530) | — |  |
| `--color-ml-ink-soft` | `#6c6c70` | `#6c6c70` (L1531) | — |  |
| `--color-ml-line` | `#8A8377` | `#8A8377` (L144) | — | PC-027↓ 控件邊界（3.16，WCAG 1.4.11）。 |
| `--color-ml-mist` | `#8A9BA8` | `#8A9BA8` (L154) | — | 資訊／交通 —— 純裝飾填色 |
| `--color-ml-muted` | `#e5e5ea` | `#e5e5ea` (L1529) | — |  |
| `--color-ml-on-brand` | `#ffffff` | `#ffffff` (L1536) | — |  |
| `--color-ml-rose` | `#B7A6A3` | `#B7A6A3` (L153) | — | 情緒／關懷 —— 純裝飾填色 |
| `--color-ml-sage` | `#0071e3` | `#0071e3` (L1532) | — |  |
| `--color-ml-surface` | `#ffffff` | `#ffffff` (L1528) | — |  |
| `--color-ml-warn` | `#d70015` | `#d70015` (L1534) | — |  |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L42) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L43) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L45) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L44) | — |  |
| `--color-on-accent` | `#ffffff` | `#ffffff` (L1515) | — |  |
| `--color-on-violet` | `#FFFFFF` | `#FFFFFF` (L363) | — |  |
| `--color-paper` | `#F5E7C8` | `#F5E7C8` (L35) | — | PC-009 試卷紙（暗色模式改舊紙色，見下） |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L36) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L37) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L38) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#d70015` | `#d70015` (L1525) | — |  |
| `--color-rose-strong` | `#b00012` | `#b00012` (L1526) | — |  |
| `--color-scrim` | `rgba(0, 0, 0, 0.4)` | `rgba(0, 0, 0, 0.4)` (L1518) | — |  |
| `--color-scrim-soft` | `rgba(0, 0, 0, 0.24)` | `rgba(0, 0, 0, 0.24)` (L1519) | — |  |
| `--color-subj-clay` | `#706347` | `#706347` (L81) | — | PC-011↓ 4.61 |
| `--color-subj-mist` | `#4D667E` | `#4D667E` (L80) | — | PC-020↓ 4.67 |
| `--color-subj-moss` | `#566953` | `#566953` (L79) | — | PC-032↓ 4.65 |
| `--color-subj-rose` | `#845956` | `#845956` (L82) | — | PC-003↓ 4.69 |
| `--color-subj-sage` | `#57685C` | `#57685C` (L78) | — | PC-016↓ 4.66 |
| `--color-subj-stone` | `#666557` | `#666557` (L83) | — | PC-028↓ 4.68 |
| `--color-surface` | `#f2f2f7` | `#f2f2f7` (L1505) | — |  |
| `--color-surface-raised` | `#ffffff` | `#ffffff` (L1506) | — |  |
| `--color-surface-sunken` | `#e5e5ea` | `#e5e5ea` (L1507) | — |  |
| `--color-violet` | `#5856d6` | `#5856d6` (L1523) | — |  |
| `--color-violet-strong` | `#3634a3` | `#3634a3` (L1524) | — |  |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1101) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L22) | — |  |
| `--grade-1` | `#334155` | `#334155` (L105) | — | 9.47 |
| `--grade-2` | `#475569` | `#475569` (L104) | — | 6.93 |
| `--grade-3` | `#7E22CE` | `#7E22CE` (L103) | — | 6.39 |
| `--grade-4` | `#1E52B8` | `#1E52B8` (L102) | — | 6.50 |
| `--grade-5` | `#16793A` | `#16793A` (L372) | — | 4.62（原 #177E3C 落莫蘭迪底只有 4.33） |
| `--grade-5s` | `#846208` | `#846208` (L371) | — | 4.74（原 #8A6608 落莫蘭迪底只有 4.44） |
| `--grade-5ss` | `#9A5B06` | `#9A5B06` (L99) | — | 4.96 |
| `--grade-u` | `#845956` | `#845956` (L106) | — | = rose／warn，唔用正紅 |
| `--sidebar-w` | `0px` | `0px` (L878) | — |  |

## Resolved — `data-theme='cyber'`（暗色）

預設態再由 `:root[data-theme='cyber']` 覆蓋（specificity 0,1,1 贏 0,0,1）。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L850) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L14) | — |  |
| `--color-accent` | `#409cff` | `#409cff` (L1548) | — |  |
| `--color-accent-hover` | `#0060c0` | `#0060c0` (L1550) | — |  |
| `--color-accent-strong` | `#0071e3` | `#0071e3` (L1549) | — |  |
| `--color-gold` | `#ff9f0a` | `#ff9f0a` (L1554) | — |  |
| `--color-gold-soft` | `#ffd60a` | `#ffd60a` (L1555) | — |  |
| `--color-gold-strong` | `#ffb340` | `#ffb340` (L1556) | — |  |
| `--color-ink` | `#f5f5f7` | `#f5f5f7` (L1544) | — |  |
| `--color-ink-faint` | `#636366` | `#636366` (L1547) | — |  |
| `--color-ink-muted` | `#98989d` | `#98989d` (L1546) | — |  |
| `--color-ink-soft` | `#ebebf5` | `#ebebf5` (L1545) | — |  |
| `--color-line` | `rgba(84, 84, 88, 0.65)` | `rgba(84, 84, 88, 0.65)` (L1552) | — |  |
| `--color-line-strong` | `rgba(142, 142, 147, 0.45)` | `rgba(142, 142, 147, 0.45)` (L1553) | — |  |
| `--color-material` | `rgba(28, 28, 30, 0.72)` | `rgba(28, 28, 30, 0.72)` (L1571) | — |  |
| `--color-material-heavy` | `rgba(0, 0, 0, 0.72)` | `rgba(0, 0, 0, 0.72)` (L1572) | — |  |
| `--color-ml-canvas` | `#000000` | `#000000` (L1561) | — |  |
| `--color-ml-clay` | `#ff9f0a` | `#ff9f0a` (L1567) | — |  |
| `--color-ml-good` | `#30d158` | `#30d158` (L1569) | — |  |
| `--color-ml-ink` | `#f5f5f7` | `#f5f5f7` (L1564) | — |  |
| `--color-ml-ink-soft` | `#98989d` | `#98989d` (L1565) | — |  |
| `--color-ml-line` | `#918a7e` | `#918a7e` (L292) | — | 控件邊界 3.97（WCAG 1.4.11 ≥3:1）。 |
| `--color-ml-mist` | `#8a9fb8` | `#8a9fb8` (L298) | — | 規格 --mist  裝飾（4.99） |
| `--color-ml-muted` | `#2c2c2e` | `#2c2c2e` (L1563) | — |  |
| `--color-ml-on-brand` | `#ffffff` | `#ffffff` (L1570) | — |  |
| `--color-ml-rose` | `#c49a9a` | `#c49a9a` (L297) | — | 規格 --rose  裝飾（5.45） |
| `--color-ml-sage` | `#409cff` | `#409cff` (L1566) | — |  |
| `--color-ml-surface` | `#1c1c1e` | `#1c1c1e` (L1562) | — |  |
| `--color-ml-warn` | `#ff453a` | `#ff453a` (L1568) | — |  |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L42) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L43) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L45) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L44) | — |  |
| `--color-on-accent` | `#ffffff` | `#ffffff` (L1551) | — |  |
| `--color-on-violet` | `#1a1917` | `#1a1917` (L249) | — | 深字 on 霧藍 = 6.47（白字只有 1.9） |
| `--color-paper` | `#DDD3C6` | `#DDD3C6` (L227) | — | PC-026 舊紙。純白紙落 #1a1917 頁底係 17.57， |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L36) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L37) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L38) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#ff453a` | `#ff453a` (L1559) | — |  |
| `--color-rose-strong` | `#ff6961` | `#ff6961` (L1560) | — |  |
| `--color-scrim` | `rgba(10, 9, 9, 0.78)` | `rgba(10, 9, 9, 0.78)` (L221) | — |  |
| `--color-scrim-soft` | `rgba(10, 9, 9, 0.50)` | `rgba(10, 9, 9, 0.50)` (L222) | — |  |
| `--color-subj-clay` | `#b8956f` | `#b8956f` (L307) | — | 規格 --wood   4.89 |
| `--color-subj-mist` | `#8a9fb8` | `#8a9fb8` (L306) | — | 規格 --mist   4.99 |
| `--color-subj-moss` | `#9ab89d` | `#9ab89d` (L305) | — | moss ×1.25    6.28 |
| `--color-subj-rose` | `#c49a9a` | `#c49a9a` (L308) | — | 規格 --rose   5.45 |
| `--color-subj-sage` | `#7a9e7e` | `#7a9e7e` (L304) | — | 規格 --moss   4.53 |
| `--color-subj-stone` | `#c1bab0` | `#c1bab0` (L309) | — | 岩灰          7.05 |
| `--color-surface` | `#000000` | `#000000` (L1541) | — |  |
| `--color-surface-raised` | `#1c1c1e` | `#1c1c1e` (L1542) | — |  |
| `--color-surface-sunken` | `#2c2c2e` | `#2c2c2e` (L1543) | — |  |
| `--color-violet` | `#5e5ce6` | `#5e5ce6` (L1557) | — |  |
| `--color-violet-strong` | `#7d7aff` | `#7d7aff` (L1558) | — |  |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1101) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L22) | — |  |
| `--grade-1` | `#a8a095` | `#a8a095` (L264) | — | 規格 --text-secondary 5.25 |
| `--grade-2` | `#c1bab0` | `#c1bab0` (L263) | — | 岩灰                7.05 |
| `--grade-3` | `#b8956f` | `#b8956f` (L262) | — | 規格 --wood         4.89 |
| `--grade-4` | `#8a9fb8` | `#8a9fb8` (L261) | — | 規格 --mist         4.99 —— 同 5 分開色相 |
| `--grade-5` | `#7a9e7e` | `#7a9e7e` (L260) | — | 規格 --moss         4.53 |
| `--grade-5s` | `#9ab89d` | `#9ab89d` (L259) | — | moss ×1.25          6.28 |
| `--grade-5ss` | `#e8e0d4` | `#e8e0d4` (L258) | — | 規格 --cream        10.36 |
| `--grade-u` | `#c49a9a` | `#c49a9a` (L265) | — | 規格 --rose         5.45 —— 唔用正紅（憲章 §7） |
| `--sidebar-w` | `0px` | `0px` (L878) | — |  |

## 其他 scope

唔屬於上面兩個全站狀態嘅宣告（media query、無障礙 class、屬性 scope）。
列出嚟係因為漏咗一個 scope，就係一個永遠搵唔到嘅「點解個值唔啱」。

| token | 值 | scope | media | 行 |
|---|---|---|---|---|
| `--color-ink` | `#F0E8DC` | `.on-dark-overlay` | — | L405 |
| `--color-ink-soft` | `#C1BAB0` | `.on-dark-overlay` | — | L406 |
| `--color-ink-muted` | `#A8A095` | `.on-dark-overlay` | — | L407 |
| `--color-ink-faint` | `#6B6560` | `.on-dark-overlay` | — | L408 |
| `--color-accent` | `#7A9E7E` | `.on-dark-overlay` | — | L409 |
| `--color-accent-strong` | `#7A9E7E` | `.on-dark-overlay` | — | L410 |
| `--color-on-accent` | `#1A1917` | `.on-dark-overlay` | — | L411 |
| `--color-surface-sunken` | `#2F2E2C` | `.on-dark-overlay` | — | L412 |
| `--color-line` | `rgba(232, 224, 212, 0.10)` | `.on-dark-overlay` | — | L413 |
| `--color-line-strong` | `rgba(232, 224, 212, 0.20)` | `.on-dark-overlay` | — | L414 |
| `--bottom-nav-h` | `3.5rem` | `html[data-bottomnav='on']` | — | L853 |
| `--bottom-nav-h` | `0px` | `html[data-bottomnav='on']` | `@media (min-width: 768px)` | L860 |
| `--sidebar-w` | `5rem` | `html[data-sidebar='on']` | `@media (min-width: 48rem)` | L885 |
| `--sidebar-w` | `260px` | `html[data-sidebar='on']` | `@media (min-width: 80rem)` | L890 |
| `--particle-speed` | `20s` | `.particle-bg` | — | L958 |
| `--particle-alpha` | `0.15` | `.particle-bg` | — | L959 |
| `--particle-speed` | `12s` | `.particle-combo-1` | — | L969 |
| `--particle-speed` | `8s` | `.particle-combo-2` | — | L970 |
| `--particle-speed` | `5s` | `.particle-combo-3` | — | L971 |
| `--particle-speed` | `40s` | `.particle-calm` | — | L974 |
| `--particle-alpha` | `0.05` | `.particle-calm` | — | L974 |
| `--flame-rgb` | `0, 245, 212` | `.combo-flame` | — | L1044 |
| `--flame-speed` | `1.5s` | `.combo-flame` | — | L1045 |
| `--color-ink` | `#000000` | `:root` | `@media (prefers-contrast: more)` | L1605 |
| `--color-ink-soft` | `#1c1c1e` | `:root` | `@media (prefers-contrast: more)` | L1606 |
| `--color-ink-muted` | `#3a3a3c` | `:root` | `@media (prefers-contrast: more)` | L1607 |
| `--color-accent` | `#0051a8` | `:root` | `@media (prefers-contrast: more)` | L1608 |
| `--color-accent-strong` | `#0051a8` | `:root` | `@media (prefers-contrast: more)` | L1609 |
| `--color-accent-hover` | `#003d80` | `:root` | `@media (prefers-contrast: more)` | L1610 |
| `--color-line` | `rgba(0, 0, 0, 0.45)` | `:root` | `@media (prefers-contrast: more)` | L1611 |
| `--color-line-strong` | `rgba(0, 0, 0, 0.7)` | `:root` | `@media (prefers-contrast: more)` | L1612 |
| `--color-material` | `#ffffff` | `:root` | `@media (prefers-contrast: more)` | L1613 |
| `--color-material-heavy` | `#ffffff` | `:root` | `@media (prefers-contrast: more)` | L1614 |
| `--color-ink` | `#ffffff` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1617 |
| `--color-ink-soft` | `#f5f5f7` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1618 |
| `--color-ink-muted` | `#d1d1d6` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1619 |
| `--color-accent` | `#64d2ff` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1620 |
| `--color-accent-strong` | `#64d2ff` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1621 |
| `--color-accent-hover` | `#70d7ff` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1622 |
| `--color-on-accent` | `#000000` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1623 |
| `--color-line` | `rgba(255, 255, 255, 0.55)` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1624 |
| `--color-line-strong` | `rgba(255, 255, 255, 0.8)` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1625 |
| `--color-material` | `#1c1c1e` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1626 |
| `--color-material-heavy` | `#000000` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1627 |
| `--color-ink` | `#000000` | `html[data-contrast='more']` | — | L1631 |
| `--color-ink-soft` | `#1c1c1e` | `html[data-contrast='more']` | — | L1632 |
| `--color-ink-muted` | `#3a3a3c` | `html[data-contrast='more']` | — | L1633 |
| `--color-accent` | `#0051a8` | `html[data-contrast='more']` | — | L1634 |
| `--color-accent-strong` | `#0051a8` | `html[data-contrast='more']` | — | L1635 |
| `--color-accent-hover` | `#003d80` | `html[data-contrast='more']` | — | L1636 |
| `--color-line` | `rgba(0, 0, 0, 0.45)` | `html[data-contrast='more']` | — | L1637 |
| `--color-line-strong` | `rgba(0, 0, 0, 0.7)` | `html[data-contrast='more']` | — | L1638 |
| `--color-material` | `#ffffff` | `html[data-contrast='more']` | — | L1639 |
| `--color-material-heavy` | `#ffffff` | `html[data-contrast='more']` | — | L1640 |
| `--color-ink` | `#ffffff` | `html[data-contrast='more'][data-theme='cyber']` | — | L1643 |
| `--color-ink-soft` | `#f5f5f7` | `html[data-contrast='more'][data-theme='cyber']` | — | L1644 |
| `--color-ink-muted` | `#d1d1d6` | `html[data-contrast='more'][data-theme='cyber']` | — | L1645 |
| `--color-accent` | `#64d2ff` | `html[data-contrast='more'][data-theme='cyber']` | — | L1646 |
| `--color-accent-strong` | `#64d2ff` | `html[data-contrast='more'][data-theme='cyber']` | — | L1647 |
| `--color-accent-hover` | `#70d7ff` | `html[data-contrast='more'][data-theme='cyber']` | — | L1648 |
| `--color-on-accent` | `#000000` | `html[data-contrast='more'][data-theme='cyber']` | — | L1649 |
| `--color-line` | `rgba(255, 255, 255, 0.55)` | `html[data-contrast='more'][data-theme='cyber']` | — | L1650 |
| `--color-line-strong` | `rgba(255, 255, 255, 0.8)` | `html[data-contrast='more'][data-theme='cyber']` | — | L1651 |
| `--color-material` | `#1c1c1e` | `html[data-contrast='more'][data-theme='cyber']` | — | L1652 |
| `--color-material-heavy` | `#000000` | `html[data-contrast='more'][data-theme='cyber']` | — | L1653 |

## 掃過嘅 block

| 行 | selector |
|---|---|
| L11 | `@theme` |
| L179 | `:root[data-theme='cyber']` |
| L335 | `:root` |
| L404 | `.on-dark-overlay` |
| L417 | `body` |
| L423 | `html` |
| L442 | `html` |
| L453 | `img, svg, video, canvas, iframe` |
| L458 | `img, video` |
| L465 | `body` |
| L469 | `.katex` |
| L476 | `.animate-on-scroll` |
| L482 | `.animate-on-scroll.visible` |
| L486 | `.stagger-1` |
| L487 | `.stagger-2` |
| L488 | `.stagger-3` |
| L489 | `.stagger-4` |
| L490 | `@media (prefers-reduced-motion: reduce)` |
| L491 | `@media (prefers-reduced-motion: reduce) › .animate-on-scroll` |
| L500 | `@keyframes hero-rise` |
| L501 | `@keyframes hero-rise › from` |
| L502 | `@keyframes hero-rise › to` |
| L504 | `.hero-rise` |
| L505 | `.hero-rise-1` |
| L506 | `.hero-rise-2` |
| L507 | `.hero-rise-3` |
| L508 | `@media (prefers-reduced-motion: reduce)` |
| L509 | `@media (prefers-reduced-motion: reduce) › .hero-rise` |
| L512 | `::-webkit-scrollbar` |
| L515 | `::-webkit-scrollbar-track` |
| L518 | `::-webkit-scrollbar-thumb` |
| L534 | `@keyframes pop-in` |
| L535 | `@keyframes pop-in › 0%` |
| L536 | `@keyframes pop-in › 100%` |
| L539 | `@keyframes slide-up` |
| L540 | `@keyframes slide-up › from` |
| L541 | `@keyframes slide-up › to` |
| L546 | `@keyframes fill-bar` |
| L547 | `@keyframes fill-bar › from` |
| L548 | `@keyframes fill-bar › to` |
| L551 | `.animate-pop-in` |
| L555 | `.animate-slide-up` |
| L569 | `@media print` |
| L580 | `@media print › nav, footer:not(.print-keep), button:not(.print-keep), .no-print, nextjs-portal` |
| L586 | `@media print › html, body` |
| L595 | `@media print › .min-h-screen` |
| L599 | `@media print › body, body *` |
| L611 | `@media print › [class*="bg-slate-9"], [class*="bg-slate-8"], [class*="bg-amber-5"], [class*="bg-rose-5"], [class*="bg-indigo-5"], [class*="bg-green-5"], [class*="bg-emerald-5"]` |
| L618 | `@media print › @page` |
| L623 | `@media print › .rounded-2xl, .rounded-xl` |
| L629 | `@media print › .paper-sheet` |
| L635 | `@media print › .paper-q` |
| L640 | `@media print › .paper-write-space` |
| L663 | `html.no-motion *, html.no-motion *::before, html.no-motion *::after` |
| L668 | `html.no-motion` |
| L678 | `@keyframes skeleton-breathe` |
| L679 | `@keyframes skeleton-breathe › 0%, 100%` |
| L680 | `@keyframes skeleton-breathe › 50%` |
| L682 | `.skeleton` |
| L688 | `@media (prefers-reduced-motion: reduce)` |
| L689 | `@media (prefers-reduced-motion: reduce) › .skeleton` |
| L696 | `@font-face` |
| L703 | `html.font-easy body` |
| L713 | `html.font-easy .font-serif` |
| L719 | `html.font-easy p, html.font-easy li` |
| L731 | `html.a11y-spacing body, html.a11y-spacing p, html.a11y-spacing li, html.a11y-spacing label, html.a11y-spacing button` |
| L769 | `html.focus-light .focus-dim` |
| L774 | `html.focus-light .focus-dim:hover, html.focus-light .focus-dim:focus-within` |
| L786 | `.katex-display` |
| L796 | `.skip-link` |
| L806 | `.skip-link:focus` |
| L827 | `@keyframes sand-stream` |
| L828 | `@keyframes sand-stream › to` |
| L830 | `.hourglass-stream` |
| L834 | `.hourglass-soft .hourglass-stream` |
| L837 | `@media (prefers-reduced-motion: reduce)` |
| L838 | `@media (prefers-reduced-motion: reduce) › .hourglass-stream` |
| L849 | `:root` |
| L852 | `html[data-bottomnav='on']` |
| L858 | `@media (min-width: 768px)` |
| L859 | `@media (min-width: 768px) › html[data-bottomnav='on']` |
| L863 | `.floating-bottom` |
| L877 | `:root` |
| L883 | `@media (min-width: 48rem)` |
| L884 | `@media (min-width: 48rem) › html[data-sidebar='on']` |
| L888 | `@media (min-width: 80rem)` |
| L889 | `@media (min-width: 80rem) › html[data-sidebar='on']` |
| L897 | `html.no-motion .mascot` |
| L902 | `.floating-left` |
| L905 | `.floating-left-2` |
| L910 | `.floating-bottom-2` |
| L913 | `.floating-bottom-3` |
| L925 | `.floating-panel-max-h` |
| L957 | `.particle-bg` |
| L964 | `@keyframes particle-drift` |
| L965 | `@keyframes particle-drift › from` |
| L966 | `@keyframes particle-drift › to` |
| L969 | `.particle-combo-1` |
| L970 | `.particle-combo-2` |
| L971 | `.particle-combo-3` |
| L974 | `.particle-calm` |
| L979 | `.scatter-title` |
| L982 | `@keyframes scatter-in` |
| L983 | `@keyframes scatter-in › from` |
| L984 | `@keyframes scatter-in › to` |
| L989 | `.answer-feedback` |
| L993 | `.answer-feedback-miss` |
| L996 | `@keyframes answer-feedback` |
| L997 | `@keyframes answer-feedback › from` |
| L998 | `@keyframes answer-feedback › to` |
| L1004 | `.shockwave, .shockwave-gold, .pulse-correct` |
| L1011 | `.blindspot-in` |
| L1014 | `@keyframes blindspot-in` |
| L1015 | `@keyframes blindspot-in › from` |
| L1016 | `@keyframes blindspot-in › to` |
| L1022 | `.ring-draw` |
| L1025 | `@keyframes ring-draw` |
| L1026 | `@keyframes ring-draw › from` |
| L1031 | `.radar-grow` |
| L1036 | `@keyframes radar-grow` |
| L1037 | `@keyframes radar-grow › from` |
| L1038 | `@keyframes radar-grow › to` |
| L1043 | `.combo-flame` |
| L1051 | `@keyframes flame-pulse` |
| L1052 | `@keyframes flame-pulse › 0%, 100%` |
| L1053 | `@keyframes flame-pulse › 50%` |
| L1058 | `.carousel-3d` |
| L1059 | `.carousel-card` |
| L1063 | `.carousel-card:hover` |
| L1064 | `.carousel-card[aria-current='true']` |
| L1068 | `.ring-rotate` |
| L1069 | `@keyframes ring-rotate` |
| L1070 | `@keyframes ring-rotate › from` |
| L1071 | `@keyframes ring-rotate › to` |
| L1099 | `:root` |
| L1111 | `.achievement-pop` |
| L1114 | `@keyframes achievement-pop` |
| L1115 | `@keyframes achievement-pop › from` |
| L1116 | `@keyframes achievement-pop › to` |
| L1126 | `.relax-in` |
| L1141 | `@keyframes ml-q-enter` |
| L1142 | `@keyframes ml-q-enter › from` |
| L1143 | `@keyframes ml-q-enter › to` |
| L1145 | `@keyframes ml-q-leave` |
| L1146 | `@keyframes ml-q-leave › from` |
| L1147 | `@keyframes ml-q-leave › to` |
| L1149 | `.ml-q-enter` |
| L1150 | `.ml-q-leave` |
| L1153 | `.ml-press` |
| L1154 | `.ml-press:active` |
| L1158 | `.ml-pick-on` |
| L1159 | `.ml-pick` |
| L1162 | `@keyframes ml-reveal` |
| L1163 | `@keyframes ml-reveal › from` |
| L1164 | `@keyframes ml-reveal › to` |
| L1166 | `.ml-reveal` |
| L1169 | `@keyframes ml-modal-in` |
| L1170 | `@keyframes ml-modal-in › from` |
| L1171 | `@keyframes ml-modal-in › to` |
| L1173 | `.ml-modal-in` |
| L1177 | `.ml-stagger` |
| L1183 | `.ml-lift` |
| L1184 | `.ml-lift:hover` |
| L1189 | `@keyframes ml-notice` |
| L1190 | `@keyframes ml-notice › 0%, 100%` |
| L1191 | `@keyframes ml-notice › 50%` |
| L1193 | `.ml-notice` |
| L1197 | `@media (prefers-reduced-motion: reduce)` |
| L1198 | `@media (prefers-reduced-motion: reduce) › .ml-q-enter, .ml-q-leave, .ml-reveal, .ml-modal-in, .ml-stagger` |
| L1202 | `@media (prefers-reduced-motion: reduce) › .ml-press, .ml-pick, .ml-lift` |
| L1203 | `@media (prefers-reduced-motion: reduce) › .ml-press:active, .ml-pick-on, .ml-lift:hover` |
| L1204 | `@media (prefers-reduced-motion: reduce) › .ml-notice` |
| L1216 | `html.font-easy .ml-q-enter, html.font-easy .ml-q-leave, html.font-easy .ml-reveal, html.font-easy .ml-modal-in, html.font-easy .ml-stagger, html.font-easy .ml-notice` |
| L1223 | `html.font-easy .ml-press, html.font-easy .ml-pick, html.font-easy .ml-lift` |
| L1228 | `html.font-easy .ml-press:active, html.font-easy .ml-pick-on, html.font-easy .ml-lift:hover` |
| L1233 | `@keyframes relax-in` |
| L1234 | `@keyframes relax-in › from` |
| L1235 | `@keyframes relax-in › to` |
| L1242 | `:root[data-theme='light'] .particle-bg, :root[data-theme='light'] .combo-flame` |
| L1250 | `html.font-easy .particle-bg, html.font-easy .combo-flame` |
| L1257 | `html.font-easy .scatter-title, html.font-easy .achievement-pop, html.font-easy .shockwave, html.font-easy .ring-rotate, html.font-easy .carousel-card` |
| L1264 | `html.font-easy .shockwave` |
| L1272 | `html.font-easy .answer-feedback, html.font-easy .answer-feedback-miss, html.font-easy .pulse-correct, html.font-easy .blindspot-in, html.font-easy .ring-draw, html.font-easy .radar-grow` |
| L1286 | `html.font-easy .relax-in, html.font-easy .animate-slide-up, html.font-easy .animate-pop-in, html.font-easy .skeleton` |
| L1293 | `@media (prefers-reduced-motion: reduce)` |
| L1299 | `@media (prefers-reduced-motion: reduce) › .particle-bg, .combo-flame, .scatter-title, .achievement-pop, .ring-rotate, .carousel-card` |
| L1303 | `@media (prefers-reduced-motion: reduce) › .scatter-title` |
| L1304 | `@media (prefers-reduced-motion: reduce) › .achievement-pop` |
| L1305 | `@media (prefers-reduced-motion: reduce) › .carousel-card:hover` |
| L1306 | `@media (prefers-reduced-motion: reduce) › .shockwave` |
| L1315 | `@media (prefers-reduced-motion: reduce) › .answer-feedback, .answer-feedback-miss, .pulse-correct, .blindspot-in, .ring-draw, .radar-grow, .relax-in` |
| L1330 | `@media (prefers-reduced-motion: reduce) › .animate-slide-up, .animate-pop-in` |
| L1340 | `@media (max-height: 760px)` |
| L1341 | `@media (max-height: 760px) › .sidebar-quote` |
| L1348 | `@media (max-width: 639px)` |
| L1349 | `@media (max-width: 639px) › section:has([data-continue-card]) .hero-mascot` |
| L1356 | `@media (max-width: 767px)` |
| L1357 | `@media (max-width: 767px) › body:has([data-a11y-trigger]) .a11y-fab` |
| L1362 | `.off-syllabus-card-body` |
| L1366 | `@keyframes off-syllabus-reveal` |
| L1367 | `@keyframes off-syllabus-reveal › from` |
| L1368 | `@keyframes off-syllabus-reveal › to` |
| L1370 | `@media (prefers-reduced-motion: reduce)` |
| L1371 | `@media (prefers-reduced-motion: reduce) › .off-syllabus-card-body` |
| L1378 | `.practice-session-revealed` |
| L1388 | `.practice-session-revealed > .practice-session-column` |
| L1396 | `.practice-revealed-scroll` |
| L1404 | `.practice-option` |
| L1408 | `@media (max-width: 639px)` |
| L1409 | `@media (max-width: 639px) › .practice-option` |
| L1412 | `@media (max-width: 639px) › .practice-options-stack` |
| L1416 | `.practice-explain` |
| L1419 | `.practice-miss` |
| L1423 | `.practice-next-bar` |
| L1437 | `.practice-retry-btn` |
| L1452 | `.practice-retry-btn:hover` |
| L1455 | `.practice-next-btn` |
| L1470 | `.practice-next-btn:hover` |
| L1476 | `.practice-next-btn:focus-visible, .practice-retry-btn:focus-visible, .practice-option:focus-visible, .practice-feedback:focus-visible` |
| L1482 | `body:has(.practice-session) [role="dialog"][aria-label="無障礙設定"], body:has(.practice-session) [role="dialog"][aria-label="Accessibility options"]` |
| L1490 | `body:has(.practice-session) .a11y-fab` |
| L1493 | `body:has(.practice-session) [data-reading-ruler-fab]` |
| L1497 | `body:has(.practice-session) [data-sos-fab]` |
| L1504 | `:root` |
| L1540 | `:root[data-theme='cyber']` |
| L1576 | `.chrome-material` |
| L1581 | `@media (prefers-reduced-transparency: reduce)` |
| L1582 | `@media (prefers-reduced-transparency: reduce) › .chrome-material` |
| L1590 | `.pressable` |
| L1593 | `.pressable:active` |
| L1596 | `@media (prefers-reduced-motion: reduce)` |
| L1597 | `@media (prefers-reduced-motion: reduce) › .pressable:active` |
| L1603 | `@media (prefers-contrast: more)` |
| L1604 | `@media (prefers-contrast: more) › :root` |
| L1616 | `@media (prefers-contrast: more) › :root[data-theme='cyber']` |
| L1630 | `html[data-contrast='more']` |
| L1642 | `html[data-contrast='more'][data-theme='cyber']` |
| L1657 | `.chart-grid` |
| L1660 | `.chart-mark` |
| L1664 | `.chart-label` |
