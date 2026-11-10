# DSE Level Up visual system

Local constraint for every skill that points here. It overrides the upstream skill when the two disagree. The product already has a visual system. These skills check and implement against that system. They do not invent a second one.

Source of truth: `app/tokens-clear.css`.

## Tokens already in use

Use these. Do not add a parallel palette, typeface, spacing scale, radius scale, or token prefix.

- Color: `--color-ml-*`, `--color-surface`, `--color-surface-raised`, `--color-surface-sunken`, `--color-ink`, `--color-ink-soft`, `--color-ink-muted`, `--color-ink-faint`, `--color-accent`, `--color-accent-strong`, `--color-accent-hover`, `--color-accent-soft`, `--color-on-accent`
- Status: `--color-success`, `--color-warning`, `--color-error`, `--color-info`, and the existing `-strong` / `-on-*` pairs. Status is never color alone.
- Type: `--font-sans`, `--font-serif`, `--text-caption`, `--text-footnote`, `--text-body`, `--text-callout`, `--text-title`, `--text-headline`, `--text-display`, `--leading-tight`, `--leading-snug`, `--leading-body`
- Space: `--space-1` through `--space-6`, then `--space-8`, `--space-10`, `--space-12`, `--space-16`
- Radius and motion already in that file: `--radius-control`, `--radius-card`, `--radius-sheet`, `--ease-out`, `--ease-in-out`, `--duration-press`, `--duration-ui`, `--duration-panel`

`--font-sans` and `--font-serif` are already chosen (Noto Sans TC / CJK gothic stack, and Songti TC / CJK serif stack). Do not add Inter, a Google font, or a new brand face.

`--color-ink-faint` and `--color-accent-soft` are not sole text. `--color-neon-*` is for export PNG cards only, not live UI. Dark theme stays `[data-theme=cyber]`. Higher contrast stays `[data-contrast=more]` and `prefers-contrast: more`.

Tailwind, Carbon, Polaris, Spectrum, Lightning, Material, HIG, or any other product's palette is not this product's system. A skill may keep those notes as external reading. It must not copy their colors, type, or identity into the app.

## Impeccable

Impeccable is installed, and in this repo it is only a check for typography, spacing, and contrast.

Allowed: read `reference/typeset.md`, `reference/layout.md`, and the contrast, type, and spacing items in `reference/audit.md`. Report findings against the tokens above. If a fix is explicitly requested, change only spacing, type hierarchy, or contrast, and only by reusing tokens that already exist. Do not add a font, a hex color, or a new custom property.

Not allowed, even if the upstream skill or a command name asks for it: changing the brand, palette, or visual identity; `colorize`, `bolder`, `overdrive`, `delight`, `generate`, `live`, `shape`, `init`, `document`, `extract`, `craft`, `new-work`, `polish`, `quieter`, `clarify`, `animate`, or a full-product critique. Do not write `PRODUCT.md`, `DESIGN.md`, or a surface brief. Do not run `scripts/impeccable`, download its binary, or turn on its hooks. Do not pick a face from `scripts/data/font-index.json`.

## Other limits

- Do not add npm packages, including motion, sonner, recharts, base-ui, Zustand, React Query, or Storybook. Charts stay the existing pure SVG. This product is a Next.js website.
- Do not add emoji. Use the existing original SVG icons.
- Do not edit `AGENTS.md`. Do not rewrite student-facing layout, copy, or components unless the task explicitly asks for that change. Do not add secondary labels or descriptions the layout already explains.
- Product rules stay as they are: free, no ads, no paywall, no daily cap. Original rewrites are not HKEAA papers. Do not offer an official grade prediction. The in-product name for practice feedback is 練習表現估算.
- Do not install or treat as a visual source: `nextlevelbuilder/ui-ux-pro-max-skill`, `plugin87/ux-ui-agent-skills`.

## Licenses

| Skill | Pin | License |
|---|---|---|
| `frontend-ui-engineering` | `addyosmani/agent-skills@301b02b12bff98e4688e6984af6556802322bbde` | MIT, Copyright (c) 2025 Addy Osmani. `.cursor/skills/vendor/addyosmani-agent-skills/LICENSE` |
| cuellarfr design-skills (`accessibility-audit` is WCAG 2.2) | `cuellarfr/design-skills@7e25e66e87f64f9d3dea22198f9e29937e7c48f5` | MIT, Copyright (c) 2026 Carlos C. `.cursor/skills/vendor/cuellarfr-design-skills/LICENSE` |
| `web-design-guidelines` | `vercel-labs/agent-skills@1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` `skills/web-design-guidelines` | MIT as declared in the upstream README. That commit has no LICENSE file. `.cursor/skills/vendor/vercel-labs-agent-skills/ATTRIBUTION.md` |
| `impeccable` | `pbakaus/impeccable@ec229b48547f24685ffb22aa51c462c5ae27908c` | Apache-2.0. `.cursor/skills/vendor/impeccable/LICENSE` and `NOTICE.md` |
