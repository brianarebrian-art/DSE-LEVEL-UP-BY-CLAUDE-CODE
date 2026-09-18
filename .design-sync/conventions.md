## How to build with DSE LEVEL UP

A Hong Kong DSE exam-practice platform. Students are 12–18, many of them SEN or
anxious, and a large share study late at night on a phone. Several conventions
below exist because of that, not for taste — where that is the case it says so.

### Wrap every screen in `LanguageProvider`

60 of the 78 components call `useLocale()`, and it **throws** outside the
provider — an unwrapped screen renders blank, not untranslated:

```jsx
<LanguageProvider>
  <YourScreen />
</LanguageProvider>
```

`ThemeProvider` is separate and optional. It defaults to `auto` (Hong Kong
sunrise/sunset), so a screen wrapped in it renders light or dark depending on
the clock. Wrap in it only when you are building the theme switcher itself;
everything else should render in the default light palette.

### Styling: Tailwind utilities over semantic tokens — never raw colour

Colours are always addressed by role, never by hex or by Tailwind's own palette.
`text-gray-500` and `bg-[#FAFAF8]` are both wrong; the token is the API.

| Family | Values | Use for |
|---|---|---|
| `surface` | `bg-surface` · `bg-surface-raised` · `bg-surface-sunken` | page ground · cards · inset rows |
| `ink` | `text-ink` · `text-ink-soft` · `text-ink-muted` · `text-ink-faint` | body · secondary · captions · **disabled only** |
| `line` | `border-line` · `border-line-strong` | hairlines · emphasised borders |
| `accent` | `text-accent` · `bg-accent` · `bg-accent-strong` · `hover:bg-accent-hover` · `text-on-accent` | the sage green primary action |
| `gold` · `rose` · `violet` | `text-gold` `bg-gold/[0.10]` `border-gold/30` … | reflective states · gentle alerts · tiers |

Per-subject accents are **CSS variables only** — `var(--color-subj-sage)`,
`-clay`, `-mist`, `-moss`, `-rose`, `-stone`. There are no `subj-*` utility
classes; write them as inline style or through your own rule.

`text-ink-faint` is reserved for disabled controls — it does not meet AA as body
text. There is no `text-muted-foreground` in this system; `text-ink-muted` is the
one to reach for.

The card idiom throughout the app is a tinted panel, not a drop shadow:

```jsx
<div className="rounded-2xl border border-accent/30 bg-accent/[0.10] p-5">…</div>
```

**Neon (`--color-neon-*`) is not part of the UI.** Those four colours exist only
for the PNG cards a student exports and shares — `DailyStatsCard` is the one in
this library. Those images leave the site, so they are locked to a fixed palette
instead of following the viewer's theme. Never use them on a screen.

### Copy rules that are not style preferences

- Never write **FAIL**, a red cross, or a streak/day-count. A wrong answer opens
  with 「你發現咗一個新盲點💡」, and feedback for wrong must be no louder than for
  right.
- Never show rankings, class averages, percentiles, or other students' results.
  The platform has no user-to-user surface and does not invent one.
- Never claim a prediction of a DSE grade. Estimates are shown as a range with
  the reason the range is wide.
- Explanations quote option **content**, never a position — options are shuffled
  on every render, so 「第二項」/「option B」 always points at the wrong thing.

### Where the truth is

- `_ds/<folder>/styles.css` and its imports — every token, resolved.
- `components/<group>/<Name>/<Name>.prompt.md` — per-component API and examples.
- `<Name>.d.ts` — the props interface. A prop typed `unknown` with a trailing
  comment (`data: unknown; // DailyStatsCardData`) means the shape could not be
  flattened; the `.prompt.md` example shows a real value.

### A screen, end to end

```jsx
<LanguageProvider>
  <main className="min-h-screen bg-surface px-4 py-6">
    <div className="mx-auto max-w-lg space-y-4">
      <MasteryRing label="供求分析" correct={17} total={20} />
      <div className="rounded-2xl border border-line bg-surface-raised p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs font-medium text-ink-muted">經濟 · 供給與需求</span>
          <DifficultyBadge difficulty="medium" />
        </div>
        <p className="text-sm leading-relaxed text-ink">
          <MathText>{'若 $x^2 - 5x + 6 = 0$，則 $x$ 的值為何？'}</MathText>
        </p>
      </div>
      <HotlineCard />
    </div>
  </main>
</LanguageProvider>
```
