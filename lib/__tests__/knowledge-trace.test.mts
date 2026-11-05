import test from 'node:test'
import assert from 'node:assert/strict'
import * as graphNs from '../knowledge/graph.ts'

const graph = (graphNs as unknown as { default?: typeof graphNs }).default ?? graphNs

test('M2 is Foundation, Algebra, Calculus and Further, and Calculus depends on the Compulsory Part', () => {
  const topics = new Set(graph.KNOWLEDGE_NODES.filter((node) => node.subject === 'm2').map((node) => node.topic))
  for (const topic of ['Foundation', 'Algebra', 'Calculus', 'Further']) {
    assert.equal(topics.has(topic), true)
  }
  assert.equal(
    graph.KNOWLEDGE_EDGES.some((edge) => edge.fromId === 'cp-math' && edge.toId === 'm2-calculus' && edge.relation === 'prerequisite'),
    true,
  )
})

test('a miss on Differentiation walks back to Algebra within two layers', () => {
  const ids = graph.tracePrerequisites('m2-differentiation', 2).map((node) => node.id)
  assert.equal(ids.includes('m2-algebra'), true)
  assert.equal(ids.includes('m2-calculus'), true)
  assert.equal(ids.includes('m2-foundation'), true)
  assert.equal(ids.includes('cp-math'), true)
  assert.equal(ids.includes('m2-further'), false)
})
