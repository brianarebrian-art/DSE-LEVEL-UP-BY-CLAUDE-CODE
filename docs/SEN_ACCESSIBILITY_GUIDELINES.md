# SEN & accessibility guidelines

Practical checklist for DSE Level Up (Hong Kong secondary students).

## Language & emotion

- No shaming, threats, or ranking students against each other.
- Do not tie self-worth to a predicted grade.
- Wrong answers → calm next step, not punishment.
- Avoid countdown pressure by default; timer hideable (`dse_hide_timer` / A11y panel).
- Near stress content, keep Hong Kong help resources reachable (site relax / support entry points).

## Content modes

- Prefer short summary + optional detailed explanation.
- Bilingual: Traditional Chinese (HK) + English where the product claims bilingual.
- Step-by-step worked reasoning for STEM where feasible.

## Interface

- OpenDyslexic optional; adjustable text size via a11y settings.
- Contrast: follow `contrast-guard` / token docs; avoid light-on-light.
- Respect `prefers-reduced-motion`; no decorative flashing.
- Keyboard operable; visible focus; `min-h-11` touch targets on primary actions.
- Screen reader: meaningful labels on icon-only controls.

## Data

- Never store SEN diagnoses or medical labels in analytics or profiles.
- Comfort / a11y prefs stay device-local unless explicitly sync-approved settings paths.

## Verification

- `lib/__tests__/sen-accessibility.test.mts`
- `npm run qa` contrast / copy guards
- Manual: keyboard-only practice session on mobile width
