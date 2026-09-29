import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Offline tooling (gen-questions, _scan) — already excluded from the build typecheck.
    "**/*.mts",
    // Agent scaffolding. `.claude/worktrees/` holds git worktrees checked out
    // INSIDE the repo, i.e. entire duplicate copies of this codebase — without
    // this, a bare `npx eslint` lints the copy too and reported 12,038 problems
    // (2,237 errors) that do not exist in the real source. Nothing under
    // `.claude/` ships; it currently holds only launch.json and worktrees/,
    // so ignoring the whole directory costs no real coverage and also covers
    // any worktree a future session creates.
    ".claude/**",
    // design-sync output (gitignored, .gitignore line 50): a compiled bundle of
    // this app plus a vendored copy of React. A local `npm run lint` linted it
    // and failed with 29 errors, all inside React's own source; a fresh checkout
    // (CI) never has the directory. The sources it is built from are still linted.
    "ds-bundle/**",
  ]),
  {
    // This app deliberately hydrates localStorage in mount effects across many
    // components (a low-cost, intentional pattern, e.g. usePlan / dashboard / sync).
    // `set-state-in-effect` is a false positive here, so disable it project-wide
    // rather than scatter per-line directives through unrelated files.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
