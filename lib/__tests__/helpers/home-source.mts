import assert from 'node:assert/strict'
import ts from '@typescript/typescript6'

// Parse the real section, not comments or a layout-dependent regular expression.
export function heroSection(source: string): string {
  const file = ts.createSourceFile('HomePageClient.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let hero = ''
  function visit(node: ts.Node) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(file) === 'section' &&
      node.openingElement.attributes.properties.some((attribute) =>
        ts.isJsxAttribute(attribute) && attribute.name.getText(file) === 'id' &&
        attribute.initializer && ts.isStringLiteral(attribute.initializer) && attribute.initializer.text === 'homepage-hero')) {
      assert.equal(hero, '', 'homepage hero must be unique')
      hero = node.getText(file)
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  assert.ok(hero, 'homepage hero section found')
  return hero
}
