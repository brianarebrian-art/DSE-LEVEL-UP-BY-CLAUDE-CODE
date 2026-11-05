// @ts-expect-error: Playwright tests executed via npx playwright
import { test, expect } from '@playwright/test'

test.describe('Icons & Visual Asset Integrity', () => {
  // @ts-expect-error: Page parameter
  test('Header and primary navigation have visible SVG icons', async ({ page }) => {
    await page.goto('/')
    const icons = page.locator('svg')
    const count = await icons.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(count, 5); i++) {
      const box = await icons.nth(i).boundingBox()
      if (box) {
        expect(box.width).toBeGreaterThan(0)
        expect(box.height).toBeGreaterThan(0)
      }
    }
  })

  // @ts-expect-error: Page parameter
  test('Bookmarks empty state shows original illustration and action CTA', async ({ page }) => {
    await page.goto('/bookmarks')
    const emptyIllustration = page.locator('svg.w-36')
    await expect(emptyIllustration).toBeVisible()
    const startBtn = page.getByRole('link', { name: /開始練習|Start practising/ })
    await expect(startBtn).toBeVisible()
  })

  // @ts-expect-error: Page parameter
  test('Buttons with icons have accessible names and aria-labels', async ({ page }) => {
    await page.goto('/')
    const buttons = page.locator('button, a[role="button"]')
    const count = await buttons.count()

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i)
      const isVisible = await btn.isVisible()
      if (!isVisible) continue

      const text = (await btn.textContent())?.trim()
      const ariaLabel = await btn.getAttribute('aria-label')
      const title = await btn.getAttribute('title')

      expect(Boolean(text || ariaLabel || title)).toBeTruthy()
    }
  })
})
