import { test, expect } from '@playwright/test'

/**
 * City page tests (/:citySlug)
 *
 * Covers:
 * - Header: title, back button, emergency link
 * - Security banner
 * - Statistics panel (total points, collections, shelters)
 * - Leaflet map rendering
 * - Map legend (visibility and collapsing)
 * - Registration FAB visible
 * - Navigation back to home
 */

test.describe('City Page (/jf)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jf')
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 15_000 })
  })

  test('should have the correct title in the browser tab', async ({ page }) => {
    await expect(page).toHaveTitle(/Emergência JF/i)
  })

  test('should display the header with title and emergency link', async ({
    page
  }) => {
    await expect(
      page.getByRole('heading', { name: /Emergência Juiz de Fora/i, level: 1 })
    ).toBeVisible()

    const emergencyLink = page.locator('a[href="tel:199"]').first()
    await expect(emergencyLink).toBeVisible()
    await expect(emergencyLink).toHaveAttribute('href', 'tel:199')
  })

  test('should display the back button to the home page', async ({ page }) => {
    const backBtn = page.getByRole('link', {
      name: /Voltar para página inicial/i
    })
    await expect(backBtn).toBeVisible()
    await expect(backBtn).toHaveAttribute('href', '/')
  })

  test('should navigate back to home when clicking the back button', async ({
    page
  }) => {
    await page
      .getByRole('link', { name: /Voltar para página inicial/i })
      .click()
    await expect(page).toHaveURL('/')
    await expect(
      page.getByRole('heading', { name: 'Emergência Coletas', level: 1 })
    ).toBeVisible()
  })

  test('should display the security alert banner', async ({ page }) => {
    await expect(
      page.getByText(/verifique sempre a autenticidade dos pontos de coleta/i)
    ).toBeVisible()
  })

  test('should display the statistics panel with numeric counts', async ({
    page
  }) => {
    await expect(
      page.getByText('Total de Pontos', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText('Pontos de Coleta', { exact: true })
    ).toBeVisible()
    await expect(page.getByText('Abrigos', { exact: true })).toBeVisible()

    const statsNumbers = page.locator('main').getByText(/^\d+$/)
    await expect(statsNumbers.first()).toBeVisible()
  })

  test('should render the Leaflet map with markers', async ({ page }) => {
    await expect(page.locator('#map')).toBeVisible()

    const markers = page.locator('.leaflet-marker-icon')
    await expect(markers.first()).toBeVisible()

    const count = await markers.count()
    expect(count).toBeGreaterThan(1)
  })

  test('should display the map legend with point types', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /Legenda do Mapa/i })
    ).toBeVisible()

    await expect(
      page.getByText('Ponto de Coleta', { exact: true })
    ).toBeVisible()
    await expect(page.getByText('Abrigo', { exact: true })).toBeVisible()
    await expect(
      page.getByText(/Clique nos marcadores para ver detalhes/i)
    ).toBeVisible()
  })

  test('should collapse and expand the map legend', async ({ page }) => {
    const collapseBtn = page.getByRole('button', {
      name: /Minimizar legenda/i
    })
    const expandBtn = page.getByRole('button', { name: /Expandir legenda/i })

    const isLegendExpanded = await collapseBtn.isVisible()

    if (isLegendExpanded) {
      await collapseBtn.click()
      await expect(expandBtn).toBeVisible()

      await expandBtn.click()
      await expect(collapseBtn).toBeVisible()
      await expect(page.getByText('Ponto de Coleta')).toBeVisible()
    } else {
      await expect(expandBtn).toBeVisible()
      await expandBtn.click()
      await expect(collapseBtn).toBeVisible()

      await collapseBtn.click()
      await expect(expandBtn).toBeVisible()
    }
  })

  test('should display the FAB button to register a new point', async ({
    page
  }) => {
    const fabBtn = page.getByRole('button', { name: /Cadastrar novo ponto/i })
    await expect(fabBtn).toBeVisible()
  })
})

test.describe('Invalid Route', () => {
  test('should display not-found page for nonexistent city', async ({
    page
  }) => {
    const response = await page.goto('/cidade-inexistente')
    const status = response?.status() ?? 0
    const isNotFound =
      status === 404 ||
      (await page
        .getByText(/not found|não encontrad/i)
        .isVisible()
        .catch(() => false))
    expect(status === 404 || isNotFound).toBeTruthy()
  })
})
