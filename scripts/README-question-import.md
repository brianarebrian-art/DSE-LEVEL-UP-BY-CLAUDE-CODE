# Importing a generated MC bank (with a quality gate)

Turns a spec-format JSON bank (e.g. `dse-25k-bank/m1.json`) into a typed TS bank the
app loads — **but only questions that pass the quality gate.** Bad/duplicate questions
are rejected, not silently imported, so bulk-generated banks can't quietly break the
"academic correctness = 生死線" rule.

## 1. Validate + convert

```bash
# dry run — just see the accept/reject report, writes nothing
node scripts/import-bank.mjs --in dse-25k-bank/m1.json --subject m1 --dry

# real run — writes data/questions/m1-imported.ts (only the accepted questions)
node scripts/import-bank.mjs --in dse-25k-bank/m1.json --subject m1
```

`--subject` must match the loader key in `data/questions/load.ts`
(`math`, `m1`, `m2`, `physics`, `chinese-history`, `ict`, `bafs`, `ths`, `design-tech`,
`health-management`, `technology-living`, `ethics-religious`, `visual-arts`, `pe`,
`music`, … — see the `loaders` map).

## 2. What the quality gate rejects

| Reason | Rule |
|---|---|
| missing/blank id, subject, topic, question | required, non-empty |
| `type` ≠ `"mc"` | only MC supported by this importer |
| difficulty not `basic\|intermediate\|hard` | mapped → `easy\|medium\|hard` |
| question shorter than 5 chars | too thin |
| options ≠ exactly 4, or any blank | DSE MC = 4 options |
| **duplicate options** | the app's builder forbids identical options |
| **「以上皆是／皆非 / all/none of the above」** | spec's 選項設計原則 |
| `correctIndex` not an integer 0–3 | must point at a real option |
| explanation shorter than 10 chars | 詳細解釋 required |
| **duplicate id** / **duplicate question text** | de-dup across the file |

The report also prints the accepted difficulty split (easy/medium/hard) so you can check
it against your 20 / 50 / 30 target.

## 3. Wire the accepted bank into the loader

Edit `data/questions/load.ts` and merge the generated export into that subject, e.g. M1:

```ts
m1: async () => {
  const [base, imported] = await Promise.all([
    import('./m1'),
    import('./m1-imported'),
  ])
  return [...base.m1Questions, ...imported.M1ImportedQuestions]
},
```

(The export name is the camel-cased subject id + `ImportedQuestions`, e.g.
`m1` → `M1ImportedQuestions`, `chinese-history` → `ChineseHistoryImportedQuestions`.)

Then `npm run build -- --webpack` — the generated bank is plain `Question[]`, so it
type-checks and code-splits exactly like the hand-authored banks.

## Notes / honesty
- Imported questions are **monolingual (zh)**; the UI falls back to zh in EN mode.
- They carry `framework: 'imported'`, `year: 0`, `marks: 1` (no exam-year label).
- The gate enforces **format + de-dup**, not subject-matter truth. It cannot verify that
  an answer is academically correct — that still needs human/броute-force review,
  especially for `hard` items. Do **not** claim these are "人手核對" on the site unless
  they actually are.
