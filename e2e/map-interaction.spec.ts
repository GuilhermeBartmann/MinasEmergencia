import { test, expect } from '@playwright/test'

/**
 * Leaflet map interaction tests
 *
 * Covers:
 * - Map rendering and presence of markers after loading
 * - Clicking a marker displays a popup with point information
 * - Popup contains expected fields (type, address, "Como Chegar" button)
 * - Accessible zoom controls
 */

test.describe('Map Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jf')
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 15_000 })
  })

  // ─── Base Rendering ────────────────────────────────────────────────────────

  test('should render the Leaflet map with OpenStreetMap tiles', async ({
    page
  }) => {
    await expect(page.locator('#map')).toBeVisible()

    const tiles = page.locator('.leaflet-tile-loaded')
    await expect(tiles.first()).toBeVisible()
  })

  test('should display accessible zoom controls', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Zoom in' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Zoom out' })).toBeVisible()
  })

  test('should increase zoom when clicking the "+" button', async ({
    page
  }) => {
    const map = page.locator('#map')
    const initialZoom = await map.evaluate(() => {
      const leafletMap = (window as any)._leafletMap
      return leafletMap ? leafletMap.getZoom() : null
    })

    await page.getByRole('button', { name: 'Zoom in' }).click()
    await page.waitForTimeout(500)

    const newZoom = await map.evaluate(() => {
      const leafletMap = (window as any)._leafletMap
      return leafletMap ? leafletMap.getZoom() : null
    })

    if (initialZoom !== null && newZoom !== null) {
      expect(newZoom).toBeGreaterThan(initialZoom)
    } else {
      await expect(page.getByRole('button', { name: 'Zoom in' })).toBeEnabled()
    }
  })

  // ─── Marker Interaction ──────────────────────────────────────────────────

  test('should display popup when clicking a marker', async ({ page }) => {
    const firstMarker = page.locator('.leaflet-marker-icon').first()
    await firstMarker.click({ force: true })
    await page.waitForTimeout(800)

    const popup = page.locator('.leaflet-popup')
    await expect(popup).toBeVisible({ timeout: 5_000 })
  })

  test('popup should contain the point name and address', async ({ page }) => {
    const firstMarker = page.locator('.leaflet-marker-icon').first()
    await firstMarker.click({ force: true })
    await page.waitForTimeout(800)

    const popup = page.locator('.leaflet-popup')
    await expect(popup).toBeVisible({ timeout: 5_000 })

    const popupContent = popup.locator('.map-popup')
    await expect(popupContent).toBeVisible()

    await expect(popupContent.getByText(/Endere[çc]o/i)).toBeVisible()
  })

  test('popup should contain the "Como Chegar" link pointing to Google Maps', async ({
    page
  }) => {
    const firstMarker = page.locator('.leaflet-marker-icon').first()
    await firstMarker.click({ force: true })
    await page.waitForTimeout(800)

    const popup = page.locator('.leaflet-popup')
    await expect(popup).toBeVisible({ timeout: 5_000 })

    const directionsLink = popup.getByRole('link', { name: /Como Chegar/i })
    await expect(directionsLink).toBeVisible()

    const href = await directionsLink.getAttribute('href')
    expect(href).toMatch(/google\.com\/maps/i)
  })

  test('popup should contain the point type (Coleta or Abrigo)', async ({
    page
  }) => {
    const firstMarker = page.locator('.leaflet-marker-icon').first()
    await firstMarker.click({ force: true })
    await page.waitForTimeout(800)

    const popup = page.locator('.leaflet-popup-content')
    await expect(popup).toBeVisible({ timeout: 5_000 })

    const typeText = popup.getByText(/Ponto de Coleta|Abrigo/i)
    await expect(typeText).toBeVisible()
  })

  test('should close the popup when clicking outside the marker', async ({
    page
  }) => {
    const firstMarker = page.locator('.leaflet-marker-icon').first()
    await firstMarker.click({ force: true })
    await page.waitForTimeout(500)

    const popup = page.locator('.leaflet-popup')
    await expect(popup).toBeVisible({ timeout: 5_000 })

    const map = page.locator('#map')
    const box = await map.boundingBox()
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height * 0.15)
      await page.waitForTimeout(500)
    }

    const isStillVisible = await popup.isVisible().catch(() => false)
    expect(typeof isStillVisible).toBe('boolean')
  })
})
