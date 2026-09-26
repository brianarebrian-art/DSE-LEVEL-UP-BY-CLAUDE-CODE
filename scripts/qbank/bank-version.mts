// Content hash of one subject's question bank.
//
// Shared by sync-questions.mts (written to Supabase question_bank_versions) and
// gen-question-summary.mts (written to data/questions/bank-versions.generated.ts,
// which ships with the site). The browser uses the cloud copy only when the two
// match, so both sides must compute the version the same way. A second copy of
// this function in either script would drift and silently disable the cloud path.
//
// The hash covers question content, not files: comment edits and file reordering
// must not force every student to re-download a subject. Questions are sorted by
// id before serialising so the loader's merge order does not affect the result.
import { createHash } from 'node:crypto'

const idOf = (q: object) => String((q as { id?: unknown }).id)

export const versionOf = (qs: readonly object[]): string =>
  createHash('sha256')
    .update(JSON.stringify([...qs].sort((a, b) => idOf(a).localeCompare(idOf(b)))))
    .digest('hex').slice(0, 16)
