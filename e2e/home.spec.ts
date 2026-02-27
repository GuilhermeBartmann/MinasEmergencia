import { test, expect } from '@playwright/test'

/**
 * Home page tests (/)
 *
 * Covers:
 * - Rendering of main elements
 * - City selector (JF and Ubá)
 * - Partner sites section and "See more" button
 * - Footer with emergency numbers
 */

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render the system title and description', async ({ page }) => {
    await expect(page).toHaveTitle(/Emergência Coletas/i)

    await expect(
      page.getByRole('heading', { name: 'Emergência Coletas', level: 1 })
    ).toBeVisible()

    await expect(
      page.getByText('Sistema colaborativo para localizar pontos de doação')
    ).toBeVisible()
  })

  test('should display the security warning against scams', async ({
    page
  }) => {
    await expect(
      page.getByText(/verifique sempre a autenticidade dos pontos de coleta/i)
    ).toBeVisible()
  })

  test('should display both enabled cities in the selector', async ({
    page
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Selecione sua cidade', level: 2 })
    ).toBeVisible()

    await expect(page.locator('a[href="/jf"]')).toBeVisible()
    await expect(page.locator('a[href="/uba"]')).toBeVisible()
  })

  test('should navigate to the JF page when clicking the card', async ({
    page
  }) => {
    await page.locator('a[href="/jf"]').click()

    await expect(page).toHaveURL('/jf')
    await expect(
      page.getByRole('heading', { name: /Emergência Juiz de Fora/i, level: 1 })
    ).toBeVisible()
  })

  test('should navigate to the Ubá page when clicking the card', async ({
    page
  }) => {
    await page.locator('a[href="/uba"]').click()

    await expect(page).toHaveURL('/uba')
    await expect(
      page.getByRole('heading', { name: /Emergência Ubá/i, level: 1 })
    ).toBeVisible()
  })

  test('should display partner sites section with visible links', async ({
    page
  }) => {
    await expect(
      page.getByRole('heading', { name: /Sites parceiros/i })
    ).toBeVisible()

    await expect(
      page.getByRole('link', { name: /Faça sua Doação/i })
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /SOS Minas/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /SOS JF/i })).toBeVisible()
  })

  test('should reveal more partners when clicking "Ver mais"', async ({
    page
  }) => {
    const showMoreBtn = page.getByRole('button', { name: /Ver mais/i })
    await expect(showMoreBtn).toBeVisible()

    await showMoreBtn.click()
    const showLessBtn = page.getByRole('button', { name: /Ver menos/i })
    const disappeared = await showMoreBtn.isHidden().catch(() => false)
    const showLessAppeared = await showLessBtn.isVisible().catch(() => false)

    expect(disappeared || showLessAppeared).toBeTruthy()
  })

  test('should display system features (map, registration, real-time)', async ({
    page
  }) => {
    await expect(
      page.getByRole('heading', { name: 'Mapa Interativo' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Cadastro Rápido' })
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Tempo Real' })
    ).toBeVisible()
  })

  test('should display emergency links in the footer', async ({ page }) => {
    await expect(
      page.getByRole('link', { name: /Defesa Civil.*199/i })
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Bombeiros.*193/i })
    ).toBeVisible()
  })
})
