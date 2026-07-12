# Question-Bank Pipeline (`scripts/qbank/`)

The **runnable** part of the "24 科 × 1,000 題" pipeline — the safety gate + ratio
control that turns the parametric banks into a real production process. Everything here
runs **today**, with **zero new dependencies** (it transpiles the bank `.ts` with the
project's own `typescript`) and **zero API cost**.

> **Run from the project root** (`dse-level-up/`) with the local Node on PATH:
> ```bash
> export PATH="../.node-local/bin:$PATH"
> ```

## What runs today

### 1. `validate-banks.mjs` — the 3-point gate
```bash
node scripts/qbank/validate-banks.mjs           # all live parametric banks
node scripts/qbank/validate-banks.mjs math m1   # a subset
```
Loads every parametric bank and enforces, exiting non-zero (CI-friendly) on any failure:
- **MC integrity** — exactly 4 options, distinct by **string _and_ numeric** normalisation
  (catches the number-vs-`"string"` duplicate class), `correctIndex` in range, no
  `NaN`/`undefined`/`Infinity`/empty.
- **LaTeX hygiene** — balanced `$` (ignoring escaped `\$` currency), no `1x` / `e^{1x}`
  redundant coefficients.
- **Difficulty split** — per-bank easy/medium/hard vs the **30/50/20** target.
- **Global dedup** — duplicate `id` and identical stem across **all** banks.

> This gate found and forced fixes to real issues in the shipped banks (80× `1x`
> renderings, a currency false-positive) — that's its job. **A bank is not "done" until
> this exits 0.**

**Honest boundary:** answer *correctness* for parametric banks is guaranteed **by
construction** (each `ParametricFamily`'s answer + distractors are computed by one audited
formula, verified once at authoring). This gate enforces **format, dedup, hygiene,
difficulty** — it does **not** re-derive answers. A generic checker can't know each
family's maths; that's exactly why the correct-by-construction approach exists.

### 2. `rebalancer.mjs` — difficulty-ratio control
```bash
node scripts/qbank/rebalancer.mjs               # all banks, target 1000
node scripts/qbank/rebalancer.mjs math 1000     # one bank + custom target
```
Reports, per subject, how many of each tier to **add or trim** to hit exactly
**300 / 500 / 200**, broken down **by family** so you know which loop range to widen next.
It never mutates a bank (widening a family is a deliberate, verified edit).

## Staging / promotion convention (safety)

- New/experimental generation goes to **`data/questions/staging/`** (git-ignored WIP).
- It is promoted to the live `data/questions/*-bank.ts` **only after `validate-banks.mjs`
  exits 0**. Never overwrite a live bank directly.
- IDs are globally unique: `<subjectcode>_<familycode>_<params>` (e.g. `mb_e1_2_3`,
  `pb_h2_3_6`, `m1_m5_50_4_1`). The validator enforces global uniqueness.

## Cost

| Path | Subjects | Cost |
|---|---|---|
| **Parametric (Mode A)** | 數學, 物理, 化學, M1, M2, 經濟(數值), BAFS(數值) | **$0** — pure formula generation, runs offline |
| **LLM (Mode B)** | 中/英文, 史地, 生物概念, 藝術… | **deferred** — needs your decision on Ollama (local, free but you install it) / Groq·Gemini free tier / paid API with cache+batch |

## What is deliberately NOT built here (and why)

The larger spec asked for a SymPy bridge, Ollama/Groq/Gemini generators, and
`sentence-transformers` embeddings. Those are **not** in this folder because they would
**not run today** on this machine (no Python/SymPy, no Ollama, no embedding model, no
`tsx`), and shipping non-running code is the exact failure mode we're avoiding. When you
decide the Mode-B budget, the interfaces to add are: a `staging/` generator per humanities
subject + an independent LLM-judge pass (the existing `scripts/gen-questions.mts` already
implements generate→structural-gate→LLM-judge; it needs your `ANTHROPIC_API_KEY` and is a
paid run **you** execute).

## Human-review draft pipeline (`review-drafts.mjs` → 人手 → `promote-drafts.mjs`)

**The only path allowed to add non-parametric questions to a live bank.** Parametric banks
are correct *by construction*; anything else — LLM output, imported JSON, hand drafts — is
NOT trusted until a **named human approves it question-by-question**. A machine (even an
LLM-judge) must never assert academic correctness — that is the 生死線. This pipeline
enforces the split: the machine does the objective checks, a person does the correctness call.

```
drafts.json ──▶ review-drafts.mjs ──▶ <name>.review.html ──▶ 👤 human ──▶ decisions.json ──▶ promote-drafts.mjs ──▶ <subject>-reviewed.ts
                (auto-reject junk)     (open in a browser)     (approve/reject)                (re-gate + stamp)      (NOT yet live)
```

**Step 1 — gate + review sheet** (writes nothing to any bank):
```bash
node scripts/qbank/review-drafts.mjs --in scripts/qbank/drafts/econ.json --subject economics
```
Runs the objective gate from `_gate.mjs` (4 distinct options, banned 「以上皆是／皆非」,
`correctIndex` range, min lengths, HKEAA term red lines 公共財→共用品 / 企業家才能→企業家職能,
econ elasticity scope, `$` balance, within-file dedup). Machine-catchable junk is
auto-rejected so a human never sees it. Survivors go into a self-contained
`<name>.review.html` — open it in any browser (no server, no deps, year-friendly big
buttons + `A`/`R`/`P`/`J`/`K` keys), approve/reject **each** question on the one thing the
machine won't decide (is it academically correct?), type your name, click **「匯出審批結果」**,
and save the download over `<name>.decisions.json`.

**Step 2 — promote only what a human approved**:
```bash
node scripts/qbank/promote-drafts.mjs --in scripts/qbank/drafts/econ.json --subject economics \
  --decisions scripts/qbank/drafts/econ.decisions.json
```
Default-deny: only rows marked `approved` are written (pending/rejected/missing all dropped).
It **re-gates** every approved row (a careless click can't push a malformed/red-line row
through — it HARD-STOPS and names it), requires a reviewer name, and writes
`data/questions/<subject>-reviewed.ts` **stamped with who approved it and when** — so the
「人手核對」claim is true and auditable. It deliberately does **not** wire the bank into
`load.ts`; that stays a manual second gate (the script prints the exact snippet). Then run
`validate-banks.mjs` (global dedup) and `npm run build -- --webpack`.

**Try it** with the mechanism demo (`drafts/_demo-math.json`, 7 rows: 3 valid + 4 designed to
be auto-rejected). This is the sanctioned home for `scripts/gen-questions.mts` output too —
point the generator at a drafts JSON and review it here instead of letting it auto-write a
live `-generated.ts` bank.

## Humanities factory (`arts-variant-factory.mjs`) — the $0 upstream for 文科

Humanities subjects (中文/英文/史/地/CSD/倫宗) can't be parametrised by number, so the
leverage model is **human concept web → machine variant expansion → 100% human review**:

```
concept-web.json ──▶ arts-variant-factory.mjs ──▶ drafts.json ──▶ (the human-review pipeline above)
   (a person authors     (enumerate template items,       (review-drafts → 👤 → promote-drafts)
    nodes + MC templates   deterministic dedup, skip
    whose answers they set) long-answer, $0)
```

```bash
node scripts/qbank/arts-variant-factory.mjs \
  --web scripts/qbank/concept-webs/chinese-yu-wo-suo-yu.json \
  --out scripts/qbank/drafts/chinese-ywsy.drafts.json
```

A concept web (`concept-webs/*.json`) is authored by a person: `nodes` (documentation) +
`templates[]`. Each MC template has a `stem` (with optional `{var}` slots) and an `items[]`
list; each item is one variant, carrying its own `vars` and — when the answer changes per
item — its own `options`/`correctIndex`/`explanation` (falling back to the template's).
The factory expands items **deterministically** (no `Math.random`), self-checks each variant
through `_gate.mjs`, dedups by normalised stem+options, and writes a `drafts.json`.

**Three deliberate departures from the pasted 文科 spec** (documented so they're not a surprise):
1. **No semantic-similarity dedup.** The spec's `calculateSimilarity > 0.85` needs an
   embedding model this machine doesn't have; we use exact/normalised dedup instead ($0,
   deterministic). Un-shippable "runs nowhere" code is exactly what we avoid.
2. **No "sample 20%".** For academic content an error in the un-sampled 80% would ship —
   that breaks 學術正確=生死線. Every variant goes through the 100% question-by-question
   human review above. The template being pre-authored makes review *fast*, not skippable.
3. **Long-answer templates (`type:"long"`) are skipped + reported**, because the practice
   engine is MC-only. They stay in the concept web for a future long-answer UI.

The sample web `concept-webs/chinese-yu-wo-suo-yu.json` (中文《魚我所欲也》, a 十二篇指定範文)
is a **DRAFT authored by Claude — not yet human-verified**; its `_meta.status` says so, and
nothing ships until Amity/a 中文老師 approves each variant through the pipeline. Author the
other subjects (中史 秦朝, 地理 氣候變化, CSD 一國兩制, …) as more `concept-webs/*.json` on
the identical pattern.

## Phased plan

- **Pilot (now):** the 4 live parametric banks (math 682, physics 407, chemistry 145,
  M1 186 = 1,420) all pass the gate. Next: M2, 經濟(數值), BAFS(數值).
- **Scale — science to 1,000 each:** use `rebalancer.mjs` to see each tier's gap, widen the
  under-target families' loop ranges, re-run `validate-banks.mjs` until green. $0.
- **Scale — humanities:** once the Mode-B budget is set, generate into `staging/`, gate with
  an LLM-judge, promote only what passes. Cache by syllabus area + batch to minimise cost.
