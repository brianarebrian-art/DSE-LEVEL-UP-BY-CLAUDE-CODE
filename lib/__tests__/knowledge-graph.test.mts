import test from 'node:test'
import assert from 'node:assert/strict'

const KG: any = await import('../knowledgeGraph.ts')
const {
  createKnowledgeGraph,
  hasCyclicDependency,
  tracePrerequisites,
  getRecommendedPrerequisiteNode,
} = KG.default?.createKnowledgeGraph ? KG.default : KG

test('Knowledge Graph: 正確建立圖譜並偵測循環相依', () => {
  const nodes = [
    {
      id: 'math_algebra',
      subjectId: 'math',
      nameZh: '基礎代數',
      nameEn: 'Basic Algebra',
      prerequisites: [],
    },
    {
      id: 'math_quadratic',
      subjectId: 'math',
      nameZh: '二次方程',
      nameEn: 'Quadratic Equations',
      prerequisites: ['math_algebra'],
    },
    {
      id: 'm2_calculus',
      subjectId: 'm2',
      nameZh: '微積分入門',
      nameEn: 'Introduction to Calculus',
      prerequisites: ['math_quadratic'],
    },
  ]

  const graph = createKnowledgeGraph(nodes)
  assert.equal(hasCyclicDependency(graph), false, '線性依賴不應存在循環')

  // 加入循環節點測試
  const cyclicNodes = [
    {
      id: 'node_a',
      subjectId: 'math',
      nameZh: '節點甲',
      nameEn: 'Node A',
      prerequisites: ['node_b'],
    },
    {
      id: 'node_b',
      subjectId: 'math',
      nameZh: '節點乙',
      nameEn: 'Node B',
      prerequisites: ['node_a'],
    },
  ]
  const cyclicGraph = createKnowledgeGraph(cyclicNodes)
  assert.equal(hasCyclicDependency(cyclicGraph), true, '雙向依賴應判定為循環環路')
})

test('Knowledge Graph: 追溯前置依賴與推薦最基礎前置節點', () => {
  const nodes = [
    {
      id: 'phy_vectors',
      subjectId: 'physics',
      nameZh: '向量基礎',
      nameEn: 'Vector Basics',
      prerequisites: [],
    },
    {
      id: 'phy_forces',
      subjectId: 'physics',
      nameZh: '力的平衡與分解',
      nameEn: 'Forces & Equilibrium',
      prerequisites: ['phy_vectors'],
    },
    {
      id: 'phy_motion',
      subjectId: 'physics',
      nameZh: '二維運動學',
      nameEn: '2D Kinematics',
      prerequisites: ['phy_forces'],
    },
  ]

  const graph = createKnowledgeGraph(nodes)

  const prerequisites = tracePrerequisites(graph, 'phy_motion')
  assert.deepEqual(prerequisites, ['phy_vectors', 'phy_forces'])

  const recommended = getRecommendedPrerequisiteNode(graph, 'phy_motion')
  assert.equal(recommended?.id, 'phy_vectors', '當二維運動學多次出錯，應推薦最根本的向量基礎')

  const standalone = getRecommendedPrerequisiteNode(graph, 'phy_vectors')
  assert.equal(standalone?.id, 'phy_vectors', '無前置概念時應回傳自身')
})
