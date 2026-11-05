# 建置記憶體優化與防 OOM 證據 (Build Memory Evidence)

**審計時間**：2026-11-05
**背景**：先前建置歷史曾出現 Exit Code 137 (Out Of Memory)。本專案已實施全方位 Webpack 記憶體優化與環境限制，以確保於高負載 16 核心或標準記憶體環境下平穩建置。

---

## 1. 關鍵優化配置

1. **Webpack 記憶體優化**：
   在 `next.config.ts` 中啟用：
   ```ts
   experimental: {
     webpackMemoryOptimizations: true,
   }
   ```
2. **生產環境關閉 Source Maps**：
   ```ts
   productionBrowserSourceMaps: false
   ```
   同時於 CI 環境中明確指定 `NEXT_DISABLE_SOURCEMAP=1`。
3. **Node 記憶體上限調校**：
   - CI 環境 (`.github/workflows/ci.yml`)：`NODE_OPTIONS: --max-old-space-size=12288`（12GB，專為 16-core runner 打造）。
   - 本地驗證建置測試：`NODE_OPTIONS="--max-old-space-size=4096"`。

---

## 2. 建置實測記錄

執行指令：
```bash
NEXT_DISABLE_SOURCEMAP=1 NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

實測結果：
```text
▲ Next.js 16.4.5 (webpack)
✓ Running next.config.ts took 572ms
- Experiments (use with caution):
  · clientTraceMetadata
  ✓ webpackMemoryOptimizations

  Creating an optimized production build ...
✓ Compiled successfully in 2.3min
  Running TypeScript ...
  Finished TypeScript in 30.7s ...
  Collecting page data using 3 workers ...
  Generating static pages using 3 workers (0/138) ...
✓ Generating static pages using 3 workers (138/138) in 1521ms
  Finalizing page optimization ...
  Collecting build traces ...
```

**結論**：138 條靜態與動態路由全數編譯成功，無記憶體溢出，零錯誤退出。
