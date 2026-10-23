// Shared long-answer boilerplate. The same paragraph is stored as `explanation`
// on hundreds of written items (economics, ICT, physics, and others). It talks
// like a mark scheme — calculation steps, what markers reward — even when the
// item is not a calculation. The item-specific text is `referenceAnswer`.
// Do not present this paragraph as an explanation of the question in front of the student.

// Callers pass the string the student is reading (`tr(zh, en)`), so both
// languages have to match. The English lines are the stored translations of
// the same boilerplate, not a looser paraphrase.
const GENERIC_WRITING_GUIDE =
  /本題考核的是【由(?:資料|數據)走到結論】|What is being assessed is the whole path from the (?:data|figures) to the conclusion/

export function isGenericWritingGuide(text: string | null | undefined): boolean {
  return !!text && GENERIC_WRITING_GUIDE.test(text)
}

/** The three-part scale copied onto long items. It already says it is not an HKEAA scheme. */
const GENERIC_MARKING_SCALE =
  /本題分三部分評分（本平台練習用尺度）|Three parts \(a practice scale used on this platform\)/

export function isGenericMarkingScale(text: string | null | undefined): boolean {
  return !!text && GENERIC_MARKING_SCALE.test(text)
}
