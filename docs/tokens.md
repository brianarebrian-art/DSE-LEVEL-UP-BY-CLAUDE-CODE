<!-- generated from app/globals.css by scripts/gen-token-doc.mjs — do not edit -->

# 設計 token

**唯一來源係 `app/globals.css`，唔係呢個檔。** 呢度所有數字都由嗰邊抽出嚟。
改 token 改 CSS，然後重跑：

```bash
node scripts/gen-token-doc.mjs
```

掃到 **330** 個 custom property 宣告，分佈喺 **249** 個 block。

## ⚠️ 被覆蓋嘅宣告

同一個 token 喺預設態宣告咗多過一次。**上面嗰啲畫唔到** —— 後面嗰個贏。
照住早嗰個值去設計，出嚟嘅顏色同實際站唔同。

| token | 畫唔到嘅宣告 | 真正生效 | resolved |
|---|---|---|---|
| `--color-surface` | `#F4F0EA` (L53)<br>`var(--color-ml-canvas)` (L338) | `#f4f0ea` (L1521) | `#f4f0ea` |
| `--color-surface-raised` | `#FFFDF9` (L54)<br>`var(--color-ml-surface)` (L339) | `#fffdf9` (L1522) | `#fffdf9` |
| `--color-surface-sunken` | `#F0EBE3` (L55)<br>`var(--color-ml-muted)` (L340) | `#f0ebe3` (L1523) | `#f0ebe3` |
| `--color-ink` | `#2C2A29` (L56)<br>`var(--color-ml-ink)` (L341) | `#2c2a29` (L1524) | `#2c2a29` |
| `--color-ink-soft` | `#3D3A38` (L57)<br>`#3D3A38` (L342) | `#3d3a38` (L1525) | `#3d3a38` |
| `--color-ink-muted` | `#69635F` (L58)<br>`var(--color-ml-ink-soft)` (L343) | `#69635f` (L1526) | `#69635f` |
| `--color-ink-faint` | `#9C958D` (L60)<br>`#9C958D` (L344) | `#9c958d` (L1527) | `#9c958d` |
| `--color-accent` | `#4A656C` (L61)<br>`var(--color-ml-sage)` (L346) | `#4a656c` (L1528) | `#4a656c` |
| `--color-accent-strong` | `#4A656C` (L62)<br>`var(--color-ml-sage)` (L347) | `#4a656c` (L1529) | `#4a656c` |
| `--color-accent-hover` | `#3E555B` (L63)<br>`#4D584A` (L348) | `#3e555b` (L1530) | `#3e555b` |
| `--color-accent-soft` | `#7C9AA6` (L64) | `#7c9aa6` (L1531) | `#7c9aa6` |
| `--color-on-accent` | `#FFFFFF` (L65)<br>`var(--color-ml-on-brand)` (L349) | `#ffffff` (L1532) | `#ffffff` |
| `--color-line` | `rgba(44, 42, 41, 0.08)` (L66)<br>`rgba(44, 42, 41, 0.08)` (L350) | `rgba(44, 42, 41, 0.08)` (L1533) | `rgba(44, 42, 41, 0.08)` |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` (L67)<br>`rgba(44, 42, 41, 0.16)` (L351) | `rgba(44, 42, 41, 0.16)` (L1534) | `rgba(44, 42, 41, 0.16)` |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` (L70)<br>`rgba(44, 42, 41, 0.72)` (L353) | `rgba(44, 42, 41, 0.72)` (L1535) | `rgba(44, 42, 41, 0.72)` |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` (L71)<br>`rgba(44, 42, 41, 0.42)` (L354) | `rgba(44, 42, 41, 0.42)` (L1536) | `rgba(44, 42, 41, 0.42)` |
| `--color-gold` | `#706347` (L88)<br>`var(--color-ml-clay)` (L360) | `#706347` (L1549) | `#706347` |
| `--color-gold-soft` | `#B7A6A3` (L89)<br>`var(--color-ml-rose)` (L361) | `#b7a6a3` (L1550) | `#b7a6a3` |
| `--color-gold-strong` | `#5F5144` (L90)<br>`#5F5144` (L362) | `#5f5144` (L1551) | `#5f5144` |
| `--color-violet` | `#5B666F` (L91)<br>`#5B666F` (L363) | `#5b666f` (L1552) | `#5b666f` |
| `--color-violet-strong` | `#4A545C` (L92)<br>`#4A545C` (L364) | `#4a545c` (L1553) | `#4a545c` |
| `--color-rose` | `#845956` (L93)<br>`var(--color-ml-warn)` (L366) | `#845956` (L1554) | `#845956` |
| `--color-rose-strong` | `#724D3D` (L94)<br>`#724D3D` (L367) | `#724d3d` (L1555) | `#724d3d` |
| `--color-on-violet` | `#FFFFFF` (L95) | `#FFFFFF` (L365) | `#FFFFFF` |
| `--grade-5s` | `#846208` (L102) | `#846208` (L373) | `#846208` |
| `--grade-5` | `#16793A` (L103) | `#16793A` (L374) | `#16793A` |
| `--color-ml-canvas` | `#F4F0EA` (L133) | `#f4f0ea` (L1556) | `#f4f0ea` |
| `--color-ml-surface` | `#FFFDF9` (L134) | `#fffdf9` (L1557) | `#fffdf9` |
| `--color-ml-muted` | `#F0EBE3` (L135) | `#f0ebe3` (L1558) | `#f0ebe3` |
| `--color-ml-ink` | `#2C2A29` (L137) | `#2c2a29` (L1559) | `#2c2a29` |
| `--color-ml-ink-soft` | `#69635F` (L138) | `#69635f` (L1560) | `#69635f` |
| `--color-ml-sage` | `#4A656C` (L141) | `#4a656c` (L1561) | `#4a656c` |
| `--color-ml-clay` | `#706347` (L142) | `#706347` (L1562) | `#706347` |
| `--color-ml-warn` | `#845956` (L143) | `#845956` (L1563) | `#845956` |
| `--color-ml-good` | `#566953` (L145) | `#566953` (L1564) | `#566953` |
| `--color-ml-on-brand` | `#FFFFFF` (L149) | `#ffffff` (L1565) | `#ffffff` |
| `--color-ml-rose` | `#C5908B` (L150) | `#B7A6A3` (L155) | `#B7A6A3` |
| `--color-ml-mist` | `#AFC2D1` (L151) | `#8A9BA8` (L156) | `#8A9BA8` |
| `--ease-spring-settle` | `cubic-bezier(0.22, 1, 0.36, 1)` (L1116) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1117) | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` |

## Resolved — 預設態（冇 `data-theme` 屬性）

@theme ＋ 裸 `:root`，last-wins。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L866) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L15) | — |  |
| `--color-accent` | `#4a656c` | `#4a656c` (L1528) | — |  |
| `--color-accent-hover` | `#3e555b` | `#3e555b` (L1530) | — |  |
| `--color-accent-soft` | `#7c9aa6` | `#7c9aa6` (L1531) | — |  |
| `--color-accent-strong` | `#4a656c` | `#4a656c` (L1529) | — |  |
| `--color-chart-1` | `#4a656c` | `#4a656c` (L1568) | — |  |
| `--color-chart-2` | `#706347` | `#706347` (L1569) | — |  |
| `--color-chart-3` | `#845956` | `#845956` (L1570) | — |  |
| `--color-chart-4` | `#566953` | `#566953` (L1571) | — |  |
| `--color-chart-5` | `#5b666f` | `#5b666f` (L1572) | — |  |
| `--color-chart-6` | `#8a8377` | `#8a8377` (L1573) | — |  |
| `--color-error` | `#845956` | `#845956` (L1543) | — |  |
| `--color-error-strong` | `#724d3d` | `#724d3d` (L1544) | — |  |
| `--color-gold` | `#706347` | `#706347` (L1549) | — |  |
| `--color-gold-soft` | `#b7a6a3` | `#b7a6a3` (L1550) | — |  |
| `--color-gold-strong` | `#5f5144` | `#5f5144` (L1551) | — |  |
| `--color-info` | `#4d667e` | `#4d667e` (L1546) | — |  |
| `--color-info-strong` | `#3f5468` | `#3f5468` (L1547) | — |  |
| `--color-ink` | `#2c2a29` | `#2c2a29` (L1524) | — |  |
| `--color-ink-faint` | `#9c958d` | `#9c958d` (L1527) | — |  |
| `--color-ink-muted` | `#69635f` | `#69635f` (L1526) | — |  |
| `--color-ink-soft` | `#3d3a38` | `#3d3a38` (L1525) | — |  |
| `--color-line` | `rgba(44, 42, 41, 0.08)` | `rgba(44, 42, 41, 0.08)` (L1533) | — |  |
| `--color-line-strong` | `rgba(44, 42, 41, 0.16)` | `rgba(44, 42, 41, 0.16)` (L1534) | — |  |
| `--color-material` | `rgba(255, 253, 249, 0.78)` | `rgba(255, 253, 249, 0.78)` (L1566) | — |  |
| `--color-material-heavy` | `rgba(244, 240, 234, 0.9)` | `rgba(244, 240, 234, 0.9)` (L1567) | — |  |
| `--color-ml-canvas` | `#f4f0ea` | `#f4f0ea` (L1556) | — |  |
| `--color-ml-clay` | `#706347` | `#706347` (L1562) | — |  |
| `--color-ml-good` | `#566953` | `#566953` (L1564) | — |  |
| `--color-ml-ink` | `#2c2a29` | `#2c2a29` (L1559) | — |  |
| `--color-ml-ink-soft` | `#69635f` | `#69635f` (L1560) | — |  |
| `--color-ml-line` | `#8A8377` | `#8A8377` (L146) | — | PC-027↓ 控件邊界（3.16，WCAG 1.4.11）。 |
| `--color-ml-mist` | `#8A9BA8` | `#8A9BA8` (L156) | — | 資訊／交通 —— 純裝飾填色 |
| `--color-ml-muted` | `#f0ebe3` | `#f0ebe3` (L1558) | — |  |
| `--color-ml-on-brand` | `#ffffff` | `#ffffff` (L1565) | — |  |
| `--color-ml-rose` | `#B7A6A3` | `#B7A6A3` (L155) | — | 情緒／關懷 —— 純裝飾填色 |
| `--color-ml-sage` | `#4a656c` | `#4a656c` (L1561) | — |  |
| `--color-ml-surface` | `#fffdf9` | `#fffdf9` (L1557) | — |  |
| `--color-ml-warn` | `#845956` | `#845956` (L1563) | — |  |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L43) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L44) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L46) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L45) | — |  |
| `--color-on-accent` | `#ffffff` | `#ffffff` (L1532) | — |  |
| `--color-on-error` | `#ffffff` | `#ffffff` (L1545) | — |  |
| `--color-on-info` | `#ffffff` | `#ffffff` (L1548) | — |  |
| `--color-on-success` | `#ffffff` | `#ffffff` (L1539) | — |  |
| `--color-on-violet` | `#FFFFFF` | `#FFFFFF` (L365) | — |  |
| `--color-on-warning` | `#ffffff` | `#ffffff` (L1542) | — |  |
| `--color-paper` | `#F5E7C8` | `#F5E7C8` (L36) | — | PC-009 試卷紙（暗色模式改舊紙色，見下） |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L37) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L38) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L39) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#845956` | `#845956` (L1554) | — |  |
| `--color-rose-strong` | `#724d3d` | `#724d3d` (L1555) | — |  |
| `--color-scrim` | `rgba(44, 42, 41, 0.72)` | `rgba(44, 42, 41, 0.72)` (L1535) | — |  |
| `--color-scrim-soft` | `rgba(44, 42, 41, 0.42)` | `rgba(44, 42, 41, 0.42)` (L1536) | — |  |
| `--color-subj-clay` | `#706347` | `#706347` (L83) | — | PC-011↓ 4.61 |
| `--color-subj-mist` | `#4D667E` | `#4D667E` (L82) | — | PC-020↓ 4.67 |
| `--color-subj-moss` | `#566953` | `#566953` (L81) | — | PC-032↓ 4.65 |
| `--color-subj-rose` | `#845956` | `#845956` (L84) | — | PC-003↓ 4.69 |
| `--color-subj-sage` | `#57685C` | `#57685C` (L80) | — | PC-016↓ 4.66 |
| `--color-subj-stone` | `#666557` | `#666557` (L85) | — | PC-028↓ 4.68 |
| `--color-success` | `#566953` | `#566953` (L1537) | — |  |
| `--color-success-strong` | `#4a5c48` | `#4a5c48` (L1538) | — |  |
| `--color-surface` | `#f4f0ea` | `#f4f0ea` (L1521) | — |  |
| `--color-surface-raised` | `#fffdf9` | `#fffdf9` (L1522) | — |  |
| `--color-surface-sunken` | `#f0ebe3` | `#f0ebe3` (L1523) | — |  |
| `--color-violet` | `#5b666f` | `#5b666f` (L1552) | — |  |
| `--color-violet-strong` | `#4a545c` | `#4a545c` (L1553) | — |  |
| `--color-warning` | `#706347` | `#706347` (L1540) | — |  |
| `--color-warning-strong` | `#5f5144` | `#5f5144` (L1541) | — |  |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1117) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L23) | — |  |
| `--grade-1` | `#334155` | `#334155` (L107) | — | 9.47 |
| `--grade-2` | `#475569` | `#475569` (L106) | — | 6.93 |
| `--grade-3` | `#7E22CE` | `#7E22CE` (L105) | — | 6.39 |
| `--grade-4` | `#1E52B8` | `#1E52B8` (L104) | — | 6.50 |
| `--grade-5` | `#16793A` | `#16793A` (L374) | — | 4.62（原 #177E3C 落莫蘭迪底只有 4.33） |
| `--grade-5s` | `#846208` | `#846208` (L373) | — | 4.74（原 #8A6608 落莫蘭迪底只有 4.44） |
| `--grade-5ss` | `#9A5B06` | `#9A5B06` (L101) | — | 4.96 |
| `--grade-u` | `#845956` | `#845956` (L108) | — | = rose／warn，唔用正紅 |
| `--sidebar-w` | `0px` | `0px` (L894) | — |  |

## Resolved — `data-theme='cyber'`（暗色）

預設態再由 `:root[data-theme='cyber']` 覆蓋（specificity 0,1,1 贏 0,0,1）。

| token | resolved | 宣告 | 經過 | 備註 |
|---|---|---|---|---|
| `--bottom-nav-h` | `0px` | `0px` (L866) | — |  |
| `--breakpoint-desk` | `90rem` | `90rem` (L15) | — |  |
| `--color-accent` | `#8aa6a1` | `#8aa6a1` (L1583) | — |  |
| `--color-accent-hover` | `#6b8f8a` | `#6b8f8a` (L1585) | — |  |
| `--color-accent-soft` | `#7c9aa6` | `#7c9aa6` (L1586) | — |  |
| `--color-accent-strong` | `#8aa6a1` | `#8aa6a1` (L1584) | — |  |
| `--color-chart-1` | `#8aa6a1` | `#8aa6a1` (L1621) | — |  |
| `--color-chart-2` | `#b8956f` | `#b8956f` (L1622) | — |  |
| `--color-chart-3` | `#c49a9a` | `#c49a9a` (L1623) | — |  |
| `--color-chart-4` | `#a0b39b` | `#a0b39b` (L1624) | — |  |
| `--color-chart-5` | `#8a9fb8` | `#8a9fb8` (L1625) | — |  |
| `--color-chart-6` | `#918a7e` | `#918a7e` (L1626) | — |  |
| `--color-error` | `#c49a9a` | `#c49a9a` (L1596) | — |  |
| `--color-error-strong` | `#b89191` | `#b89191` (L1597) | — |  |
| `--color-gold` | `#b8956f` | `#b8956f` (L1602) | — |  |
| `--color-gold-soft` | `#e6ba8b` | `#e6ba8b` (L1603) | — |  |
| `--color-gold-strong` | `#d4ab80` | `#d4ab80` (L1604) | — |  |
| `--color-info` | `#7c9aa6` | `#7c9aa6` (L1599) | — |  |
| `--color-info-strong` | `#8aa6b0` | `#8aa6b0` (L1600) | — |  |
| `--color-ink` | `#f0e8dc` | `#f0e8dc` (L1579) | — |  |
| `--color-ink-faint` | `#6b6560` | `#6b6560` (L1582) | — |  |
| `--color-ink-muted` | `#a8a095` | `#a8a095` (L1581) | — |  |
| `--color-ink-soft` | `#c1bab0` | `#c1bab0` (L1580) | — |  |
| `--color-line` | `rgba(232, 224, 212, 0.06)` | `rgba(232, 224, 212, 0.06)` (L1588) | — |  |
| `--color-line-strong` | `rgba(232, 224, 212, 0.12)` | `rgba(232, 224, 212, 0.12)` (L1589) | — |  |
| `--color-material` | `rgba(37, 36, 34, 0.78)` | `rgba(37, 36, 34, 0.78)` (L1619) | — |  |
| `--color-material-heavy` | `rgba(26, 25, 23, 0.9)` | `rgba(26, 25, 23, 0.9)` (L1620) | — |  |
| `--color-ml-canvas` | `#1a1917` | `#1a1917` (L1609) | — |  |
| `--color-ml-clay` | `#b8956f` | `#b8956f` (L1615) | — |  |
| `--color-ml-good` | `#a0b39b` | `#a0b39b` (L1617) | — |  |
| `--color-ml-ink` | `#f0e8dc` | `#f0e8dc` (L1612) | — |  |
| `--color-ml-ink-soft` | `#a8a095` | `#a8a095` (L1613) | — |  |
| `--color-ml-line` | `#918a7e` | `#918a7e` (L294) | — | 控件邊界 3.97（WCAG 1.4.11 ≥3:1）。 |
| `--color-ml-mist` | `#8a9fb8` | `#8a9fb8` (L300) | — | 規格 --mist  裝飾（4.99） |
| `--color-ml-muted` | `#2f2e2c` | `#2f2e2c` (L1611) | — |  |
| `--color-ml-on-brand` | `#1a1917` | `#1a1917` (L1618) | — |  |
| `--color-ml-rose` | `#c49a9a` | `#c49a9a` (L299) | — | 規格 --rose  裝飾（5.45） |
| `--color-ml-sage` | `#8aa6a1` | `#8aa6a1` (L1614) | — |  |
| `--color-ml-surface` | `#252422` | `#252422` (L1610) | — |  |
| `--color-ml-warn` | `#c49a9a` | `#c49a9a` (L1616) | — |  |
| `--color-neon-cyan` | `#00F5D4` | `#00F5D4` (L43) | — |  |
| `--color-neon-pink` | `#FF006E` | `#FF006E` (L44) | — |  |
| `--color-neon-purple` | `#9B5DE5` | `#9B5DE5` (L46) | — |  |
| `--color-neon-yellow` | `#FEE440` | `#FEE440` (L45) | — |  |
| `--color-on-accent` | `#1a1917` | `#1a1917` (L1587) | — |  |
| `--color-on-error` | `#1a1917` | `#1a1917` (L1598) | — |  |
| `--color-on-info` | `#1a1917` | `#1a1917` (L1601) | — |  |
| `--color-on-success` | `#1a1917` | `#1a1917` (L1592) | — |  |
| `--color-on-violet` | `#1a1917` | `#1a1917` (L251) | — | 深字 on 霧藍 = 6.47（白字只有 1.9） |
| `--color-on-warning` | `#1a1917` | `#1a1917` (L1595) | — |  |
| `--color-paper` | `#DDD3C6` | `#DDD3C6` (L229) | — | PC-026 舊紙。純白紙落 #1a1917 頁底係 17.57， |
| `--color-paper-ink` | `#2C2A29` | `#2C2A29` (L37) | — | 墨、遮蓋條（淺紙 11.66 / 舊紙 6.36） |
| `--color-paper-muted` | `#4A4642` | `#4A4642` (L38) | — | 輔助字（7.63 / 4.16） |
| `--color-paper-warn` | `#6B2B2B` | `#6B2B2B` (L39) | — | PC-004 陷阱標示（8.55 / 4.66）。 |
| `--color-rose` | `#c49a9a` | `#c49a9a` (L1607) | — |  |
| `--color-rose-strong` | `#b89191` | `#b89191` (L1608) | — |  |
| `--color-scrim` | `rgba(10, 9, 9, 0.78)` | `rgba(10, 9, 9, 0.78)` (L223) | — |  |
| `--color-scrim-soft` | `rgba(10, 9, 9, 0.50)` | `rgba(10, 9, 9, 0.50)` (L224) | — |  |
| `--color-subj-clay` | `#b8956f` | `#b8956f` (L309) | — | 規格 --wood   4.89 |
| `--color-subj-mist` | `#8a9fb8` | `#8a9fb8` (L308) | — | 規格 --mist   4.99 |
| `--color-subj-moss` | `#9ab89d` | `#9ab89d` (L307) | — | moss ×1.25    6.28 |
| `--color-subj-rose` | `#c49a9a` | `#c49a9a` (L310) | — | 規格 --rose   5.45 |
| `--color-subj-sage` | `#7a9e7e` | `#7a9e7e` (L306) | — | 規格 --moss   4.53 |
| `--color-subj-stone` | `#c1bab0` | `#c1bab0` (L311) | — | 岩灰          7.05 |
| `--color-success` | `#a0b39b` | `#a0b39b` (L1590) | — |  |
| `--color-success-strong` | `#8aa68a` | `#8aa68a` (L1591) | — |  |
| `--color-surface` | `#1a1917` | `#1a1917` (L1576) | — |  |
| `--color-surface-raised` | `#252422` | `#252422` (L1577) | — |  |
| `--color-surface-sunken` | `#2f2e2c` | `#2f2e2c` (L1578) | — |  |
| `--color-violet` | `#8a9fb8` | `#8a9fb8` (L1605) | — |  |
| `--color-violet-strong` | `#a8c2e0` | `#a8c2e0` (L1606) | — |  |
| `--color-warning` | `#b8956f` | `#b8956f` (L1593) | — |  |
| `--color-warning-strong` | `#c4a484` | `#c4a484` (L1594) | — |  |
| `--ease-spring-settle` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` | `linear(0.0000, 0.0788, 0.2360, 0.4028, 0.5508, 0.6709, 0.7636, 0.8328, 0.8831, 0.9191, 0.9444, 0.9621, 0.9743, 0.9826, 0.9883, 0.9922, 0.9948, 0.9965, 0.9977, 0.9985, 0.9990, 0.9993, 0.9996, 0.9997, 0.9998, 0.9999, 1.0000)` (L1117) | — |  |
| `--font-serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` | `var(--font-garamond), 'Songti TC', 'PMingLiU', 'Noto Serif TC', 'Noto Serif CJK TC', 'Source Han Serif TC', Georgia, serif` (L23) | — |  |
| `--grade-1` | `#a8a095` | `#a8a095` (L266) | — | 規格 --text-secondary 5.25 |
| `--grade-2` | `#c1bab0` | `#c1bab0` (L265) | — | 岩灰                7.05 |
| `--grade-3` | `#b8956f` | `#b8956f` (L264) | — | 規格 --wood         4.89 |
| `--grade-4` | `#8a9fb8` | `#8a9fb8` (L263) | — | 規格 --mist         4.99 —— 同 5 分開色相 |
| `--grade-5` | `#7a9e7e` | `#7a9e7e` (L262) | — | 規格 --moss         4.53 |
| `--grade-5s` | `#9ab89d` | `#9ab89d` (L261) | — | moss ×1.25          6.28 |
| `--grade-5ss` | `#e8e0d4` | `#e8e0d4` (L260) | — | 規格 --cream        10.36 |
| `--grade-u` | `#c49a9a` | `#c49a9a` (L267) | — | 規格 --rose         5.45 —— 唔用正紅（憲章 §7） |
| `--sidebar-w` | `0px` | `0px` (L894) | — |  |

## 其他 scope

唔屬於上面兩個全站狀態嘅宣告（media query、無障礙 class、屬性 scope）。
列出嚟係因為漏咗一個 scope，就係一個永遠搵唔到嘅「點解個值唔啱」。

| token | 值 | scope | media | 行 |
|---|---|---|---|---|
| `--color-ink` | `#F0E8DC` | `.on-dark-overlay` | — | L407 |
| `--color-ink-soft` | `#C1BAB0` | `.on-dark-overlay` | — | L408 |
| `--color-ink-muted` | `#A8A095` | `.on-dark-overlay` | — | L409 |
| `--color-ink-faint` | `#6B6560` | `.on-dark-overlay` | — | L410 |
| `--color-accent` | `#7A9E7E` | `.on-dark-overlay` | — | L411 |
| `--color-accent-strong` | `#7A9E7E` | `.on-dark-overlay` | — | L412 |
| `--color-on-accent` | `#1A1917` | `.on-dark-overlay` | — | L413 |
| `--color-surface-sunken` | `#2F2E2C` | `.on-dark-overlay` | — | L414 |
| `--color-line` | `rgba(232, 224, 212, 0.10)` | `.on-dark-overlay` | — | L415 |
| `--color-line-strong` | `rgba(232, 224, 212, 0.20)` | `.on-dark-overlay` | — | L416 |
| `--bottom-nav-h` | `3.5rem` | `html[data-bottomnav='on']` | — | L869 |
| `--bottom-nav-h` | `0px` | `html[data-bottomnav='on']` | `@media (min-width: 768px)` | L876 |
| `--sidebar-w` | `5rem` | `html[data-sidebar='on']` | `@media (min-width: 48rem)` | L901 |
| `--sidebar-w` | `260px` | `html[data-sidebar='on']` | `@media (min-width: 80rem)` | L906 |
| `--particle-speed` | `20s` | `.particle-bg` | — | L974 |
| `--particle-alpha` | `0.15` | `.particle-bg` | — | L975 |
| `--particle-speed` | `12s` | `.particle-combo-1` | — | L985 |
| `--particle-speed` | `8s` | `.particle-combo-2` | — | L986 |
| `--particle-speed` | `5s` | `.particle-combo-3` | — | L987 |
| `--particle-speed` | `40s` | `.particle-calm` | — | L990 |
| `--particle-alpha` | `0.05` | `.particle-calm` | — | L990 |
| `--flame-rgb` | `0, 245, 212` | `.combo-flame` | — | L1060 |
| `--flame-speed` | `1.5s` | `.combo-flame` | — | L1061 |
| `--color-ink` | `#141414` | `:root` | `@media (prefers-contrast: more)` | L1659 |
| `--color-ink-soft` | `#1a1816` | `:root` | `@media (prefers-contrast: more)` | L1660 |
| `--color-ink-muted` | `#4a4541` | `:root` | `@media (prefers-contrast: more)` | L1661 |
| `--color-accent` | `#3a545c` | `:root` | `@media (prefers-contrast: more)` | L1662 |
| `--color-accent-strong` | `#3a545c` | `:root` | `@media (prefers-contrast: more)` | L1663 |
| `--color-accent-hover` | `#2f454c` | `:root` | `@media (prefers-contrast: more)` | L1664 |
| `--color-on-accent` | `#ffffff` | `:root` | `@media (prefers-contrast: more)` | L1665 |
| `--color-success` | `#3f5340` | `:root` | `@media (prefers-contrast: more)` | L1666 |
| `--color-warning` | `#5a4a35` | `:root` | `@media (prefers-contrast: more)` | L1667 |
| `--color-error` | `#6b4040` | `:root` | `@media (prefers-contrast: more)` | L1668 |
| `--color-info` | `#3a545c` | `:root` | `@media (prefers-contrast: more)` | L1669 |
| `--color-line` | `rgba(20, 20, 20, 0.45)` | `:root` | `@media (prefers-contrast: more)` | L1670 |
| `--color-line-strong` | `rgba(20, 20, 20, 0.7)` | `:root` | `@media (prefers-contrast: more)` | L1671 |
| `--color-material` | `#fffdf9` | `:root` | `@media (prefers-contrast: more)` | L1672 |
| `--color-material-heavy` | `#f4f0ea` | `:root` | `@media (prefers-contrast: more)` | L1673 |
| `--color-ink` | `#fff8f0` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1676 |
| `--color-ink-soft` | `#f0e8dc` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1677 |
| `--color-ink-muted` | `#d4ccc0` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1678 |
| `--color-accent` | `#a3c0bb` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1679 |
| `--color-accent-strong` | `#a3c0bb` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1680 |
| `--color-accent-hover` | `#b5cec9` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1681 |
| `--color-on-accent` | `#1a1917` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1682 |
| `--color-success` | `#b5c9b0` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1683 |
| `--color-warning` | `#d4ab80` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1684 |
| `--color-error` | `#d4a8a8` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1685 |
| `--color-info` | `#a3c0bb` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1686 |
| `--color-line` | `rgba(255, 248, 240, 0.55)` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1687 |
| `--color-line-strong` | `rgba(255, 248, 240, 0.8)` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1688 |
| `--color-material` | `#252422` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1689 |
| `--color-material-heavy` | `#1a1917` | `:root[data-theme='cyber']` | `@media (prefers-contrast: more)` | L1690 |
| `--color-ink` | `#141414` | `html[data-contrast='more']` | — | L1694 |
| `--color-ink-soft` | `#1a1816` | `html[data-contrast='more']` | — | L1695 |
| `--color-ink-muted` | `#4a4541` | `html[data-contrast='more']` | — | L1696 |
| `--color-accent` | `#3a545c` | `html[data-contrast='more']` | — | L1697 |
| `--color-accent-strong` | `#3a545c` | `html[data-contrast='more']` | — | L1698 |
| `--color-accent-hover` | `#2f454c` | `html[data-contrast='more']` | — | L1699 |
| `--color-on-accent` | `#ffffff` | `html[data-contrast='more']` | — | L1700 |
| `--color-success` | `#3f5340` | `html[data-contrast='more']` | — | L1701 |
| `--color-warning` | `#5a4a35` | `html[data-contrast='more']` | — | L1702 |
| `--color-error` | `#6b4040` | `html[data-contrast='more']` | — | L1703 |
| `--color-info` | `#3a545c` | `html[data-contrast='more']` | — | L1704 |
| `--color-line` | `rgba(20, 20, 20, 0.45)` | `html[data-contrast='more']` | — | L1705 |
| `--color-line-strong` | `rgba(20, 20, 20, 0.7)` | `html[data-contrast='more']` | — | L1706 |
| `--color-material` | `#fffdf9` | `html[data-contrast='more']` | — | L1707 |
| `--color-material-heavy` | `#f4f0ea` | `html[data-contrast='more']` | — | L1708 |
| `--color-ink` | `#fff8f0` | `html[data-contrast='more'][data-theme='cyber']` | — | L1711 |
| `--color-ink-soft` | `#f0e8dc` | `html[data-contrast='more'][data-theme='cyber']` | — | L1712 |
| `--color-ink-muted` | `#d4ccc0` | `html[data-contrast='more'][data-theme='cyber']` | — | L1713 |
| `--color-accent` | `#a3c0bb` | `html[data-contrast='more'][data-theme='cyber']` | — | L1714 |
| `--color-accent-strong` | `#a3c0bb` | `html[data-contrast='more'][data-theme='cyber']` | — | L1715 |
| `--color-accent-hover` | `#b5cec9` | `html[data-contrast='more'][data-theme='cyber']` | — | L1716 |
| `--color-on-accent` | `#1a1917` | `html[data-contrast='more'][data-theme='cyber']` | — | L1717 |
| `--color-success` | `#b5c9b0` | `html[data-contrast='more'][data-theme='cyber']` | — | L1718 |
| `--color-warning` | `#d4ab80` | `html[data-contrast='more'][data-theme='cyber']` | — | L1719 |
| `--color-error` | `#d4a8a8` | `html[data-contrast='more'][data-theme='cyber']` | — | L1720 |
| `--color-info` | `#a3c0bb` | `html[data-contrast='more'][data-theme='cyber']` | — | L1721 |
| `--color-line` | `rgba(255, 248, 240, 0.55)` | `html[data-contrast='more'][data-theme='cyber']` | — | L1722 |
| `--color-line-strong` | `rgba(255, 248, 240, 0.8)` | `html[data-contrast='more'][data-theme='cyber']` | — | L1723 |
| `--color-material` | `#252422` | `html[data-contrast='more'][data-theme='cyber']` | — | L1724 |
| `--color-material-heavy` | `#1a1917` | `html[data-contrast='more'][data-theme='cyber']` | — | L1725 |

## 掃過嘅 block

| 行 | selector |
|---|---|
| L12 | `@theme` |
| L181 | `:root[data-theme='cyber']` |
| L337 | `:root` |
| L406 | `.on-dark-overlay` |
| L419 | `body` |
| L425 | `html` |
| L444 | `html` |
| L455 | `img, svg, video, canvas, iframe` |
| L460 | `img, video` |
| L467 | `body` |
| L471 | `.katex` |
| L478 | `.animate-on-scroll` |
| L484 | `.animate-on-scroll.visible` |
| L488 | `.stagger-1` |
| L489 | `.stagger-2` |
| L490 | `.stagger-3` |
| L491 | `.stagger-4` |
| L492 | `@media (prefers-reduced-motion: reduce)` |
| L493 | `@media (prefers-reduced-motion: reduce) › .animate-on-scroll` |
| L502 | `@keyframes hero-rise` |
| L503 | `@keyframes hero-rise › from` |
| L504 | `@keyframes hero-rise › to` |
| L506 | `.hero-rise` |
| L507 | `.hero-rise-1` |
| L508 | `.hero-rise-2` |
| L509 | `.hero-rise-3` |
| L510 | `@media (prefers-reduced-motion: reduce)` |
| L511 | `@media (prefers-reduced-motion: reduce) › .hero-rise` |
| L514 | `::-webkit-scrollbar` |
| L517 | `::-webkit-scrollbar-track` |
| L520 | `::-webkit-scrollbar-thumb` |
| L536 | `@keyframes pop-in` |
| L537 | `@keyframes pop-in › 0%` |
| L538 | `@keyframes pop-in › 100%` |
| L541 | `@keyframes slide-up` |
| L542 | `@keyframes slide-up › from` |
| L543 | `@keyframes slide-up › to` |
| L552 | `@keyframes fill-bar` |
| L553 | `@keyframes fill-bar › from` |
| L554 | `@keyframes fill-bar › to` |
| L557 | `.fill-bar` |
| L561 | `@media (prefers-reduced-motion: reduce)` |
| L562 | `@media (prefers-reduced-motion: reduce) › .fill-bar` |
| L567 | `.animate-pop-in` |
| L571 | `.animate-slide-up` |
| L585 | `@media print` |
| L596 | `@media print › nav, footer:not(.print-keep), button:not(.print-keep), .no-print, nextjs-portal` |
| L602 | `@media print › html, body` |
| L611 | `@media print › .min-h-screen` |
| L615 | `@media print › body, body *` |
| L627 | `@media print › [class*="bg-slate-9"], [class*="bg-slate-8"], [class*="bg-amber-5"], [class*="bg-rose-5"], [class*="bg-indigo-5"], [class*="bg-green-5"], [class*="bg-emerald-5"]` |
| L634 | `@media print › @page` |
| L639 | `@media print › .rounded-2xl, .rounded-xl` |
| L645 | `@media print › .paper-sheet` |
| L651 | `@media print › .paper-q` |
| L656 | `@media print › .paper-write-space` |
| L679 | `html.no-motion *, html.no-motion *::before, html.no-motion *::after` |
| L684 | `html.no-motion` |
| L694 | `@keyframes skeleton-breathe` |
| L695 | `@keyframes skeleton-breathe › 0%, 100%` |
| L696 | `@keyframes skeleton-breathe › 50%` |
| L698 | `.skeleton` |
| L704 | `@media (prefers-reduced-motion: reduce)` |
| L705 | `@media (prefers-reduced-motion: reduce) › .skeleton` |
| L712 | `@font-face` |
| L719 | `html.font-easy body` |
| L729 | `html.font-easy .font-serif` |
| L735 | `html.font-easy p, html.font-easy li` |
| L747 | `html.a11y-spacing body, html.a11y-spacing p, html.a11y-spacing li, html.a11y-spacing label, html.a11y-spacing button` |
| L785 | `html.focus-light .focus-dim` |
| L790 | `html.focus-light .focus-dim:hover, html.focus-light .focus-dim:focus-within` |
| L802 | `.katex-display` |
| L812 | `.skip-link` |
| L822 | `.skip-link:focus` |
| L843 | `@keyframes sand-stream` |
| L844 | `@keyframes sand-stream › to` |
| L846 | `.hourglass-stream` |
| L850 | `.hourglass-soft .hourglass-stream` |
| L853 | `@media (prefers-reduced-motion: reduce)` |
| L854 | `@media (prefers-reduced-motion: reduce) › .hourglass-stream` |
| L865 | `:root` |
| L868 | `html[data-bottomnav='on']` |
| L874 | `@media (min-width: 768px)` |
| L875 | `@media (min-width: 768px) › html[data-bottomnav='on']` |
| L879 | `.floating-bottom` |
| L893 | `:root` |
| L899 | `@media (min-width: 48rem)` |
| L900 | `@media (min-width: 48rem) › html[data-sidebar='on']` |
| L904 | `@media (min-width: 80rem)` |
| L905 | `@media (min-width: 80rem) › html[data-sidebar='on']` |
| L913 | `html.no-motion .mascot` |
| L918 | `.floating-left` |
| L921 | `.floating-left-2` |
| L926 | `.floating-bottom-2` |
| L929 | `.floating-bottom-3` |
| L941 | `.floating-panel-max-h` |
| L973 | `.particle-bg` |
| L980 | `@keyframes particle-drift` |
| L981 | `@keyframes particle-drift › from` |
| L982 | `@keyframes particle-drift › to` |
| L985 | `.particle-combo-1` |
| L986 | `.particle-combo-2` |
| L987 | `.particle-combo-3` |
| L990 | `.particle-calm` |
| L995 | `.scatter-title` |
| L998 | `@keyframes scatter-in` |
| L999 | `@keyframes scatter-in › from` |
| L1000 | `@keyframes scatter-in › to` |
| L1005 | `.answer-feedback` |
| L1009 | `.answer-feedback-miss` |
| L1012 | `@keyframes answer-feedback` |
| L1013 | `@keyframes answer-feedback › from` |
| L1014 | `@keyframes answer-feedback › to` |
| L1020 | `.shockwave, .shockwave-gold, .pulse-correct` |
| L1027 | `.blindspot-in` |
| L1030 | `@keyframes blindspot-in` |
| L1031 | `@keyframes blindspot-in › from` |
| L1032 | `@keyframes blindspot-in › to` |
| L1038 | `.ring-draw` |
| L1041 | `@keyframes ring-draw` |
| L1042 | `@keyframes ring-draw › from` |
| L1047 | `.radar-grow` |
| L1052 | `@keyframes radar-grow` |
| L1053 | `@keyframes radar-grow › from` |
| L1054 | `@keyframes radar-grow › to` |
| L1059 | `.combo-flame` |
| L1067 | `@keyframes flame-pulse` |
| L1068 | `@keyframes flame-pulse › 0%, 100%` |
| L1069 | `@keyframes flame-pulse › 50%` |
| L1074 | `.carousel-3d` |
| L1075 | `.carousel-card` |
| L1079 | `.carousel-card:hover` |
| L1080 | `.carousel-card[aria-current='true']` |
| L1084 | `.ring-rotate` |
| L1085 | `@keyframes ring-rotate` |
| L1086 | `@keyframes ring-rotate › from` |
| L1087 | `@keyframes ring-rotate › to` |
| L1115 | `:root` |
| L1127 | `.achievement-pop` |
| L1130 | `@keyframes achievement-pop` |
| L1131 | `@keyframes achievement-pop › from` |
| L1132 | `@keyframes achievement-pop › to` |
| L1142 | `.relax-in` |
| L1157 | `@keyframes ml-q-enter` |
| L1158 | `@keyframes ml-q-enter › from` |
| L1159 | `@keyframes ml-q-enter › to` |
| L1161 | `@keyframes ml-q-leave` |
| L1162 | `@keyframes ml-q-leave › from` |
| L1163 | `@keyframes ml-q-leave › to` |
| L1165 | `.ml-q-enter` |
| L1166 | `.ml-q-leave` |
| L1169 | `.ml-press` |
| L1170 | `.ml-press:active` |
| L1174 | `.ml-pick-on` |
| L1175 | `.ml-pick` |
| L1178 | `@keyframes ml-reveal` |
| L1179 | `@keyframes ml-reveal › from` |
| L1180 | `@keyframes ml-reveal › to` |
| L1182 | `.ml-reveal` |
| L1185 | `@keyframes ml-modal-in` |
| L1186 | `@keyframes ml-modal-in › from` |
| L1187 | `@keyframes ml-modal-in › to` |
| L1189 | `.ml-modal-in` |
| L1193 | `.ml-stagger` |
| L1199 | `.ml-lift` |
| L1200 | `.ml-lift:hover` |
| L1205 | `@keyframes ml-notice` |
| L1206 | `@keyframes ml-notice › 0%, 100%` |
| L1207 | `@keyframes ml-notice › 50%` |
| L1209 | `.ml-notice` |
| L1213 | `@media (prefers-reduced-motion: reduce)` |
| L1214 | `@media (prefers-reduced-motion: reduce) › .ml-q-enter, .ml-q-leave, .ml-reveal, .ml-modal-in, .ml-stagger` |
| L1218 | `@media (prefers-reduced-motion: reduce) › .ml-press, .ml-pick, .ml-lift` |
| L1219 | `@media (prefers-reduced-motion: reduce) › .ml-press:active, .ml-pick-on, .ml-lift:hover` |
| L1220 | `@media (prefers-reduced-motion: reduce) › .ml-notice` |
| L1232 | `html.font-easy .ml-q-enter, html.font-easy .ml-q-leave, html.font-easy .ml-reveal, html.font-easy .ml-modal-in, html.font-easy .ml-stagger, html.font-easy .ml-notice` |
| L1239 | `html.font-easy .ml-press, html.font-easy .ml-pick, html.font-easy .ml-lift` |
| L1244 | `html.font-easy .ml-press:active, html.font-easy .ml-pick-on, html.font-easy .ml-lift:hover` |
| L1249 | `@keyframes relax-in` |
| L1250 | `@keyframes relax-in › from` |
| L1251 | `@keyframes relax-in › to` |
| L1258 | `:root[data-theme='light'] .particle-bg, :root[data-theme='light'] .combo-flame` |
| L1266 | `html.font-easy .particle-bg, html.font-easy .combo-flame` |
| L1273 | `html.font-easy .scatter-title, html.font-easy .achievement-pop, html.font-easy .shockwave, html.font-easy .ring-rotate, html.font-easy .carousel-card` |
| L1280 | `html.font-easy .shockwave` |
| L1288 | `html.font-easy .answer-feedback, html.font-easy .answer-feedback-miss, html.font-easy .pulse-correct, html.font-easy .blindspot-in, html.font-easy .ring-draw, html.font-easy .radar-grow` |
| L1302 | `html.font-easy .relax-in, html.font-easy .animate-slide-up, html.font-easy .animate-pop-in, html.font-easy .skeleton` |
| L1309 | `@media (prefers-reduced-motion: reduce)` |
| L1315 | `@media (prefers-reduced-motion: reduce) › .particle-bg, .combo-flame, .scatter-title, .achievement-pop, .ring-rotate, .carousel-card` |
| L1319 | `@media (prefers-reduced-motion: reduce) › .scatter-title` |
| L1320 | `@media (prefers-reduced-motion: reduce) › .achievement-pop` |
| L1321 | `@media (prefers-reduced-motion: reduce) › .carousel-card:hover` |
| L1322 | `@media (prefers-reduced-motion: reduce) › .shockwave` |
| L1331 | `@media (prefers-reduced-motion: reduce) › .answer-feedback, .answer-feedback-miss, .pulse-correct, .blindspot-in, .ring-draw, .radar-grow, .relax-in` |
| L1346 | `@media (prefers-reduced-motion: reduce) › .animate-slide-up, .animate-pop-in` |
| L1356 | `@media (max-height: 760px)` |
| L1357 | `@media (max-height: 760px) › .sidebar-quote` |
| L1364 | `@media (max-width: 639px)` |
| L1365 | `@media (max-width: 639px) › section:has([data-continue-card]) .hero-mascot` |
| L1372 | `@media (max-width: 767px)` |
| L1373 | `@media (max-width: 767px) › body:has([data-a11y-trigger]) .a11y-fab` |
| L1378 | `.off-syllabus-card-body` |
| L1382 | `@keyframes off-syllabus-reveal` |
| L1383 | `@keyframes off-syllabus-reveal › from` |
| L1384 | `@keyframes off-syllabus-reveal › to` |
| L1386 | `@media (prefers-reduced-motion: reduce)` |
| L1387 | `@media (prefers-reduced-motion: reduce) › .off-syllabus-card-body` |
| L1394 | `.practice-session-revealed` |
| L1404 | `.practice-session-revealed > .practice-session-column` |
| L1412 | `.practice-revealed-scroll` |
| L1420 | `.practice-option` |
| L1424 | `@media (max-width: 639px)` |
| L1425 | `@media (max-width: 639px) › .practice-option` |
| L1428 | `@media (max-width: 639px) › .practice-options-stack` |
| L1432 | `.practice-explain` |
| L1435 | `.practice-miss` |
| L1439 | `.practice-next-bar` |
| L1453 | `.practice-retry-btn` |
| L1468 | `.practice-retry-btn:hover` |
| L1471 | `.practice-next-btn` |
| L1486 | `.practice-next-btn:hover` |
| L1492 | `.practice-next-btn:focus-visible, .practice-retry-btn:focus-visible, .practice-option:focus-visible, .practice-feedback:focus-visible` |
| L1498 | `body:has(.practice-session) [role="dialog"][aria-label="無障礙設定"], body:has(.practice-session) [role="dialog"][aria-label="Accessibility options"]` |
| L1506 | `body:has(.practice-session) .a11y-fab` |
| L1509 | `body:has(.practice-session) [data-reading-ruler-fab]` |
| L1513 | `body:has(.practice-session) [data-sos-fab]` |
| L1520 | `:root` |
| L1575 | `:root[data-theme='cyber']` |
| L1630 | `.chrome-material` |
| L1635 | `@media (prefers-reduced-transparency: reduce)` |
| L1636 | `@media (prefers-reduced-transparency: reduce) › .chrome-material` |
| L1644 | `.pressable` |
| L1647 | `.pressable:active` |
| L1650 | `@media (prefers-reduced-motion: reduce)` |
| L1651 | `@media (prefers-reduced-motion: reduce) › .pressable:active` |
| L1657 | `@media (prefers-contrast: more)` |
| L1658 | `@media (prefers-contrast: more) › :root` |
| L1675 | `@media (prefers-contrast: more) › :root[data-theme='cyber']` |
| L1693 | `html[data-contrast='more']` |
| L1710 | `html[data-contrast='more'][data-theme='cyber']` |
| L1729 | `.chart-grid` |
| L1732 | `.chart-mark` |
| L1736 | `.chart-label` |
| L1739 | `.chart-series-1` |
| L1740 | `.chart-series-2` |
| L1741 | `.chart-series-3` |
| L1742 | `.chart-series-4` |
| L1743 | `.chart-series-5` |
| L1744 | `.chart-series-6` |
