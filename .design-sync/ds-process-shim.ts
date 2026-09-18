// design-sync 專用 —— 唔屬於產品代碼，唔會 build 入 Next.js app。
//
// 點解要有佢：converter 用 esbuild 將組件 bundle 成一個瀏覽器 IIFE，
// 而 esbuild 只會將 `process.env.NODE_ENV` 換走，其餘 `process.env.*`
// （`NEXT_PUBLIC_AUTH_BACKEND`、`NEXT_PUBLIC_SW_OFFLINE` 等）原樣留低。
// 瀏覽器冇 `process`，所以 2026-09-18 第一次 render check 時 79 個預覽
// 全部掛 `ReferenceError: process is not defined`。
//
// ⚠️ 佢一定要喺 `ds-entry.ts` 第一個 import —— ESM 按 import 次序 evaluate，
// 有組件喺 module top-level 就讀 `process.env`，shim 遲一步就已經太遲。
const g = globalThis as { process?: { env: Record<string, string | undefined> } }
g.process ??= { env: {} }
g.process.env ??= {}

export {}
