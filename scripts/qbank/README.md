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

## Phased plan

- **Pilot (now):** the 4 live parametric banks (math 682, physics 407, chemistry 145,
  M1 186 = 1,420) all pass the gate. Next: M2, 經濟(數值), BAFS(數值).
- **Scale — science to 1,000 each:** use `rebalancer.mjs` to see each tier's gap, widen the
  under-target families' loop ranges, re-run `validate-banks.mjs` until green. $0.
- **Scale — humanities:** once the Mode-B budget is set, generate into `staging/`, gate with
  an LLM-judge, promote only what passes. Cache by syllabus area + batch to minimise cost.
