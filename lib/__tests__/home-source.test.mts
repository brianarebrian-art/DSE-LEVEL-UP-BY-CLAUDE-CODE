import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { heroSection } from './helpers/home-source.mts'

test('hero extraction ignores changed comments and handles nested sections', () => {
  const section = '<section id="homepage-hero"><section>nested</section><div id="quick-start" /></section>'
  assert.equal(heroSection(`{/* arbitrary copy */}${section}<section>later</section>`), section)
})

test('hero and quick-start regressions cannot pass with an empty slice', () => {
  assert.throws(() => heroSection('<section id="other" />'), /hero section found/)
  assert.throws(() => heroSection('{/* <section id="homepage-hero">fake</section> */}'), /hero section found/)
  const source = readFileSync('app/HomePageClient.tsx', 'utf8')
  assert.match(heroSection(source), /id="quick-start"/)
  assert.throws(() => assert.match(heroSection(source.replace('id="quick-start"', 'id="removed"')), /id="quick-start"/))
})
