// Agentic Harness v5 · Phase 4 — 成本 / 質量斷路（$0；純判定）
//
// 四大高危升級（文件 §3.3）中，Tier 0 落實：② 成本破 $10、③ 連續 Evaluator BLOCK。
// ①「重複無進度」由 sandbox route 的指紋去重負責；④ 置信度屬 Tier 1（需模型自報）。

export interface BreakerConfig {
  maxCostPerTaskUsd: number
  maxConsecutiveBlocks: number
}

export const DEFAULT_BREAKER: BreakerConfig = { maxCostPerTaskUsd: 10, maxConsecutiveBlocks: 3 }

export type BreakerReason = 'cost_break' | 'consecutive_block' | null

export interface BreakerInput {
  recentCostUsd: number // 窗口內累計成本（由 telemetry.recentCostUsd 提供）
  consecutiveBlocks: number // 連續 Evaluator BLOCK 次數
}

export function checkBreaker(
  inp: BreakerInput,
  cfg: BreakerConfig = DEFAULT_BREAKER,
): { open: boolean; reason: BreakerReason; message: string } {
  if (inp.recentCostUsd > cfg.maxCostPerTaskUsd) {
    return {
      open: true,
      reason: 'cost_break',
      message: `累計成本 $${inp.recentCostUsd.toFixed(2)} 突破安全鎖 $${cfg.maxCostPerTaskUsd}`,
    }
  }
  if (inp.consecutiveBlocks >= cfg.maxConsecutiveBlocks) {
    return { open: true, reason: 'consecutive_block', message: `連續 ${inp.consecutiveBlocks} 次 Evaluator BLOCK` }
  }
  return { open: false, reason: null, message: 'ok' }
}
