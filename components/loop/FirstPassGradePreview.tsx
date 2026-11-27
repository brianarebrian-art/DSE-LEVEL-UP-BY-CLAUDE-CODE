import {
  FIRST_PASS_DISCLAIMER_ZH,
  FIRST_PASS_FRAME_ZH,
  FIRST_PASS_LABELS,
  FIRST_PASS_TITLE_ZH,
  NOT_APPLIED_ZH,
  type FirstPassCandidate,
  type FirstPassSummary,
} from '@/lib/loop-engineering/first-pass-abc'

/** 首輪分級的預覽。練習頁與目錄不要掛上。文案只讀 first-pass-abc.ts。 */
export function FirstPassGradePreview({ summary }: { summary: FirstPassSummary }) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-sm text-ink-muted">{FIRST_PASS_FRAME_ZH}</p>
      <h1 className="mt-4 text-xl font-medium text-ink">{FIRST_PASS_TITLE_ZH}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink">{FIRST_PASS_DISCLAIMER_ZH}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink">{NOT_APPLIED_ZH}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{FIRST_PASS_LABELS.proxyNote}</p>

      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-4">
        <div className="rounded-2xl border border-line bg-surface-raised p-4">
          <dt className="text-ink-muted">{FIRST_PASS_LABELS.served}</dt>
          <dd className="mt-1 text-lg font-medium tabular-nums text-ink">{summary.servedSet.itemCount}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-surface-raised p-4">
          <dt className="text-ink-muted">A</dt>
          <dd className="mt-1 text-lg font-medium tabular-nums text-ink">{summary.byGrade.A}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-surface-raised p-4">
          <dt className="text-ink-muted">B</dt>
          <dd className="mt-1 text-lg font-medium tabular-nums text-ink">{summary.byGrade.B}</dd>
        </div>
        <div className="rounded-2xl border border-line bg-surface-raised p-4">
          <dt className="text-ink-muted">C</dt>
          <dd className="mt-1 text-lg font-medium tabular-nums text-ink">{summary.byGrade.C}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm text-ink-muted">
        {FIRST_PASS_LABELS.method} {summary.methodVersion}
        {' · '}
        {FIRST_PASS_LABELS.policyDate} {summary.policyDate}
        {' · '}
        {FIRST_PASS_LABELS.unable} {summary.byGrade.unable}
      </p>

      <section className="mt-8" aria-labelledby="first-pass-subjects">
        <h2 id="first-pass-subjects" className="text-lg font-medium text-ink">{FIRST_PASS_LABELS.subjects}</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead className="bg-surface-raised text-ink">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">{FIRST_PASS_LABELS.subject}</th>
                <th scope="col" className="px-3 py-2 text-right font-medium tabular-nums">{FIRST_PASS_LABELS.items}</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">A</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">B</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">C</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">{FIRST_PASS_LABELS.unable}</th>
              </tr>
            </thead>
            <tbody>
              {summary.bySubject.map((row) => (
                <tr key={row.subject} className="border-t border-line text-ink">
                  <th scope="row" className="px-3 py-2 font-normal">{row.subject}</th>
                  <td className="px-3 py-2 text-right tabular-nums">{row.itemCount}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.A}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.B}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.C}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.unable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <CandidateSection id="first-pass-known" title={FIRST_PASS_LABELS.knownPair} rows={summary.objectiveC.knownConfirmedWithdrawalPair} />
      <CandidateSection id="first-pass-inventoried" title={FIRST_PASS_LABELS.inventoried} rows={summary.objectiveC.alreadyInLoopGradeCInventory} />
      <CandidateSection id="first-pass-new" title={FIRST_PASS_LABELS.newlyFound} rows={summary.objectiveC.newlyFound} />
    </main>
  )
}

function CandidateSection({ id, title, rows }: { id: string; title: string; rows: FirstPassCandidate[] }) {
  return (
    <section className="mt-8" aria-labelledby={id}>
      <h2 id={id} className="text-lg font-medium text-ink">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink">{FIRST_PASS_LABELS.none}</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead className="bg-surface-raised text-ink">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">{FIRST_PASS_LABELS.subject}</th>
                <th scope="col" className="px-3 py-2 font-medium">id</th>
                <th scope="col" className="px-3 py-2 font-medium">{FIRST_PASS_LABELS.reasons}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.subject}-${row.id}`} className="border-t border-line text-ink">
                  <td className="px-3 py-2">{row.subject}</td>
                  <td className="px-3 py-2 break-all">{row.id}</td>
                  <td className="px-3 py-2">{row.reasonCodes.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
