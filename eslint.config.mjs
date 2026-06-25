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
