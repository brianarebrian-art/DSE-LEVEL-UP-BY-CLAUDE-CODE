# Raw knowledge sources (generator input)

Plain-text / Markdown reference material that the offline question generator
(`scripts/gen-questions.mts`) ingests as a **strict knowledge base** when writing
new questions for a subject.

## Convention

```
data/raw-sources/<subjectId>/*.md      <- one or more .md / .txt files
```

- `<subjectId>` matches a key in `data/questions/index.ts` (e.g. `math`, `physics`).
- Every `.md` and `.txt` file inside the folder is concatenated and injected into
  the generator's system prompt, instructing the model to **respect these facts,
  shortcuts and calculator techniques** and never contradict them.
- These files are **reference only** — they are NOT shipped to the website and are
  NOT imported by any app code. They exist purely to ground generation.

## Why

The model is strong but generic. Feeding it the specific HKDSE shortcuts, exam
conventions and **calculator key-sequences** that local students actually use makes
generated questions and their "combat analysis" explanations exam-authentic instead
of textbook-generic.

Keep entries factual, concise, and exam-focused. Do not paste copyrighted past-paper
questions here — write techniques and facts in your own words.
