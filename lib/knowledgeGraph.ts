// DSE 專屬知識圖譜核心模型（Knowledge Graph Topology）
//
// 貫徹「零虛構」、「因材施教」與「情緒安全」原則：
// 1. 建立各科課題間的 DAG（有向無環圖）依賴拓撲。
// 2. 當學生在某進階課題連續出錯時，自動沿圖向上追溯其最基礎之前置依賴節點，
//    協助找出概念盲點，而非盲目催促做相同進階題。
// 3. 嚴格禁止任何 FOMO、競爭排行或懲罰機制。

export interface ConceptNode {
  id: string
  subjectId: string
  nameZh: string
  nameEn: string
  /** 前置概念節點 ID 清單（必須先掌握才能順暢理解本概念） */
  prerequisites: string[]
  /** 核心考察維度或關鍵字清單（對齊考評局課程指引） */
  keywords?: string[]
}

export type KnowledgeGraph = Map<string, ConceptNode>

/** 建立標準圖譜結構 */
export function createKnowledgeGraph(nodes: ConceptNode[]): KnowledgeGraph {
  const map = new Map<string, ConceptNode>()
  for (const node of nodes) {
    map.set(node.id, node)
  }
  return map
}

/**
 * 拓撲圖循環檢測（防止課程相依出現死循環）
 * 回傳 true 代表存在環（Cycle），圖譜無效
 */
export function hasCyclicDependency(graph: KnowledgeGraph): boolean {
  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(nodeId: string): boolean {
    visited.add(nodeId)
    inStack.add(nodeId)

    const node = graph.get(nodeId)
    if (node) {
      for (const preId of node.prerequisites) {
        if (!visited.has(preId)) {
          if (dfs(preId)) return true
        } else if (inStack.has(preId)) {
          return true
        }
      }
    }

    inStack.delete(nodeId)
    return false
  }

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      if (dfs(nodeId)) return true
    }
  }

  return false
}

/**
 * 追溯所有前置弱點節點（由淺入深拓撲排序）
 * @param graph 知識圖譜
 * @param targetNodeId 目標出錯課題節點
 * @returns 按照先後依賴次序排列的所有前置節點 ID 清單
 */
export function tracePrerequisites(graph: KnowledgeGraph, targetNodeId: string): string[] {
  const result: string[] = []
  const visited = new Set<string>()

  function collect(nodeId: string) {
    const node = graph.get(nodeId)
    if (!node) return

    for (const preId of node.prerequisites) {
      if (!visited.has(preId)) {
        visited.add(preId)
        collect(preId)
        result.push(preId)
      }
    }
  }

  collect(targetNodeId)
  return result
}

/**
 * 根據多次出錯紀錄推薦優先重溫的前置基礎節點
 * @param graph 知識圖譜
 * @param failedNodeId 發生多次錯誤之課題
 * @returns 建議優先複習之基礎概念節點（若無前置則回傳自身）
 */
export function getRecommendedPrerequisiteNode(graph: KnowledgeGraph, failedNodeId: string): ConceptNode | null {
  const target = graph.get(failedNodeId)
  if (!target) return null

  const prerequisites = tracePrerequisites(graph, failedNodeId)
  if (prerequisites.length === 0) {
    return target
  }

  // 回傳最基礎的第一個前置節點
  const rootId = prerequisites[0]
  return graph.get(rootId) ?? target
}
