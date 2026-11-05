/**
 * 課程知識圖的程式內正本。
 * edbCode 是內部鍵，用來對齊公開課程結構，不是教育局文件上的正式編號。
 * 生產資料庫草稿見 supabase/migrations/0035_fsrs_knowledge_graph.DRAFT.sql。
 */

export type KnowledgeRelation = 'prerequisite' | 'related'

export type KnowledgeNode = {
  id: string
  subject: string
  topic: string
  topicZh: string
  edbCode: string
}

export type KnowledgeEdge = {
  fromId: string
  toId: string
  relation: KnowledgeRelation
}

export const KNOWLEDGE_NODES: readonly KnowledgeNode[] = [
  { id: 'cp-math', subject: 'math', topic: 'Compulsory Part', topicZh: '必修部分', edbCode: 'internal:MATH-CP' },
  { id: 'm2-foundation', subject: 'm2', topic: 'Foundation', topicZh: '基礎', edbCode: 'internal:M2-FOUNDATION' },
  { id: 'm2-algebra', subject: 'm2', topic: 'Algebra', topicZh: '代數', edbCode: 'internal:M2-ALGEBRA' },
  { id: 'm2-calculus', subject: 'm2', topic: 'Calculus', topicZh: '微積分', edbCode: 'internal:M2-CALCULUS' },
  { id: 'm2-further', subject: 'm2', topic: 'Further', topicZh: '進階', edbCode: 'internal:M2-FURTHER' },
  { id: 'm2-differentiation', subject: 'm2', topic: 'Differentiation', topicZh: '微分', edbCode: 'internal:M2-DIFFERENTIATION' },
  { id: 'chem-ions', subject: 'chemistry', topic: 'Ions', topicZh: '離子', edbCode: 'internal:CHEM-IONS' },
  { id: 'chem-redox', subject: 'chemistry', topic: 'Redox', topicZh: '氧化還原', edbCode: 'internal:CHEM-REDOX' },
  { id: 'chem-electrolysis', subject: 'chemistry', topic: 'Electrolysis', topicZh: '電解', edbCode: 'internal:CHEM-ELECTROLYSIS' },
  { id: 'bio-cell', subject: 'biology', topic: 'Cell', topicZh: '細胞', edbCode: 'internal:BIO-CELL' },
  { id: 'bio-meiosis', subject: 'biology', topic: 'Meiosis', topicZh: '減數分裂', edbCode: 'internal:BIO-MEIOSIS' },
  { id: 'bio-genetics', subject: 'biology', topic: 'Genetics', topicZh: '遺傳', edbCode: 'internal:BIO-GENETICS' },
]

export const KNOWLEDGE_EDGES: readonly KnowledgeEdge[] = [
  { fromId: 'm2-foundation', toId: 'm2-algebra', relation: 'prerequisite' },
  { fromId: 'm2-algebra', toId: 'm2-calculus', relation: 'prerequisite' },
  { fromId: 'cp-math', toId: 'm2-calculus', relation: 'prerequisite' },
  { fromId: 'm2-calculus', toId: 'm2-further', relation: 'prerequisite' },
  { fromId: 'm2-algebra', toId: 'm2-differentiation', relation: 'prerequisite' },
  { fromId: 'm2-calculus', toId: 'm2-differentiation', relation: 'prerequisite' },
  { fromId: 'm2-differentiation', toId: 'm2-further', relation: 'related' },
  { fromId: 'chem-ions', toId: 'chem-redox', relation: 'prerequisite' },
  { fromId: 'chem-redox', toId: 'chem-electrolysis', relation: 'prerequisite' },
  { fromId: 'bio-cell', toId: 'bio-meiosis', relation: 'prerequisite' },
  { fromId: 'bio-meiosis', toId: 'bio-genetics', relation: 'prerequisite' },
]

const NODE_BY_ID = new Map(KNOWLEDGE_NODES.map((node) => [node.id, node]))

export function knowledgeNode(id: string): KnowledgeNode | undefined {
  return NODE_BY_ID.get(id)
}

/**
 * 由課題沿 prerequisite 反向走，最多 depth 層。
 * related 邊不納入回溯，避免把後續課題當成先備。
 */
export function tracePrerequisites(nodeId: string, depth = 2): KnowledgeNode[] {
  const found = new Map<string, KnowledgeNode>()
  const visit = (id: string, remaining: number) => {
    if (remaining <= 0) return
    for (const edge of KNOWLEDGE_EDGES) {
      if (edge.toId !== id || edge.relation !== 'prerequisite') continue
      const node = NODE_BY_ID.get(edge.fromId)
      if (!node || found.has(node.id)) continue
      found.set(node.id, node)
      visit(node.id, remaining - 1)
    }
  }
  visit(nodeId, depth)
  return [...found.values()]
}
