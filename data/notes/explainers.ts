/** 課題 → 原創 SVG 圖解（public/explainers）。唔用 emoji。 */
export const TOPIC_EXPLAINERS: Record<string, string> = {
  'm2:differentiation': '/explainers/m2-differentiation.svg',
  'chemistry:electrolysis': '/explainers/chem-electrolysis.svg',
  'biology:genetics': '/explainers/bio-genetics.svg',
  'biology:inheritance': '/explainers/bio-genetics.svg',
  'biology:mendelian': '/explainers/bio-genetics.svg',
  'math:quadratic_equations': '/explainers/math-quadratic.svg',
  'math:trigonometry': '/explainers/math-trigonometry.svg',
  'math:trig_3d': '/explainers/math-trigonometry.svg',
}

export function topicExplainerSrc(subjectId: string, topicId: string, fromNote?: string): string | null {
  if (fromNote) return fromNote
  return TOPIC_EXPLAINERS[`${subjectId}:${topicId}`] ?? null
}
