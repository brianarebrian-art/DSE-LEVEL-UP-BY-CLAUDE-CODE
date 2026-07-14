# DSE Level Up — bilingual terminology (HKEAA-aligned)

Single reference for subject-term translations, so question content and UI stay consistent
across 中/EN. Some of these are **machine-enforced** by `scripts/qbank/term-guard.mjs`
(runs in `npm run qa`) — those are marked ✅. Source of truth: HKEAA subject C&A guides and
the EDB Economics C&A supplementary document.

## Economics (Carson red lines)

| 中文（標準書面語） | English (HKEAA) | 嚴禁 / Avoid | Enforced |
|---|---|---|---|
| 共用品 | Public Good | 公共財 / Public Goods | ✅ term-guard |
| 企業家職能 | Entrepreneurship (as a factor of production) | 企業家才能 / 企業 / Enterprise | ✅ term-guard |
| 供需 | Demand and Supply | 需要同供應 | — |
| 機會成本 | Opportunity Cost | 機會嘅成本 | — |
| 邊際效用 | Marginal Utility | 邊際用途 | — |
| 無形之手 | Invisible Hand | 無形手 | — |
| 市場失靈 | Market Failure | 市場失敗 | — |
| 外部效應 | Externalities | 外部性 | — |

> Scope note (EDB Economics C&A supplement, verbatim): *"Point elasticity, cross elasticity
> and income elasticity NOT required."* — enforced by term-guard (收入/交叉/點彈性 banned in
> `data/questions/economics*.ts`).

## Emotional-safety phrasing (Kelly / Emma — 大愛精神)

The platform never shames. These phrasings are the standard across both languages:

| 中文 | English | 嚴禁 / Avoid |
|---|---|---|
| 發現盲點 | Spotlight Your Blind Spot | FAIL / You Failed ✅ (FAIL banned in UI by term-guard) |
| 再想一下 | Think Again | Wrong / Incorrect |
| 思維逆襲解密 | Decode your thinking | 錯晒 / 廢柴 / 失敗者 ✅ term-guard |
| 差勁 / 無藥可救 / 冇得救 | — (never use) | ✅ banned in UI by term-guard |

## How enforcement works

`scripts/qbank/term-guard.mjs` has 4 scans: (1) banned economics terms anywhere in
`data/questions/`; (2) out-of-syllabus elasticity in economics banks; (3) Cantonese-colloquial
register in non-language question banks (question *content* must be 標準書面語 — UI copy is
exempt); (4) shaming words (FAIL / 差勁 / 無藥可救 / …) in `app/` + `components/` user-facing
text. A violation fails `npm run qa` (CI-blocking).

## Note on the i18n architecture (why not next-intl)

The site is already fully bilingual through a **client-side language context**
(`lib/i18n.tsx` + `lib/dictionary.ts`, ~14 sections × 中/EN) with a `LanguageToggle` in the
navbar, persisted in `localStorage` (`dse_locale`). This was a deliberate choice over
`/zh` `/en` locale routing: routing needs locale middleware, and Vercel meters middleware
invocations — at this project's target traffic that threatens the $0/month constraint.
next-intl would duplicate a working system, add locale-routing middleware, and force a
full-site rewrite from `useT()`/`en ? …` to `t('key')` — high regression risk, no user gain.
New pages should use the existing pattern: `useT()` for dictionary strings, or inline
`en ? 'English' : '中文'` via `useLocale()` (as used across the app).

## On 少數族裔 / Race Discrimination Ordinance

Complete English coverage genuinely helps ethnic-minority students, for whom English is often
the stronger language in an English-medium exam context. Note honestly: full support for e.g.
Urdu/Nepali is a *separate, larger* project (new dictionaries + RTL considerations) — not
in scope here, and should not be over-claimed as "RDO compliance." What is in scope and done:
English parity for every user-visible string.
