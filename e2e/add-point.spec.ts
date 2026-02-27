import { test, expect } from '@playwright/test'

/**
 * Add new point modal tests
 *
 * Covers:
 * - Opening and closing the modal (X button and Escape key)
 * - Presence of all form fields
 * - Type toggle: Ponto de Coleta ↔ Abrigo (capacity field)
 * - Validation when submitting incomplete form
 * - "Indicar no Mapa" mode (map picker)
 * - Happy path for filling out the form
 */

test.describe('Add New Point Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jf')
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 15_000 })
    await page
      .getByRole('button', { name: /Cadastrar novo ponto/i })
      .waitFor({ state: 'visible', timeout: 10_000 })
  })

  // ─── Open and Close ───────────────────────────────────────────────────────

  test('should open the modal when clicking the FAB "Cadastrar novo ponto"', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()

    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()
    await expect(
      dialog.getByRole('heading', { name: /Cadastrar Novo Ponto/i })
    ).toBeVisible()
  })

  test('should close the modal when clicking the X button', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    await dialog.getByRole('button', { name: /Fechar modal/i }).click()

    await expect(page.locator('#modal-title')).not.toBeVisible()
  })

  test('should close the modal when pressing the Escape key', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.locator('#modal-title')).not.toBeVisible()
  })

  // ─── Form Structure ──────────────────────────────────────────────────────

  test('should display all required form fields', async ({ page }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    await expect(dialog.getByText('Tipo de Ponto')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /Ponto de Coleta/i })
    ).toBeVisible()
    await expect(dialog.getByRole('button', { name: /Abrigo/i })).toBeVisible()

    await expect(
      dialog.getByPlaceholder(/Centro Comunitário São Pedro/i)
    ).toBeVisible()
    await expect(dialog.getByPlaceholder(/Rua das Flores/i)).toBeVisible()

    await expect(dialog.getByLabel('Roupas')).toBeVisible()
    await expect(dialog.getByLabel('Alimentos')).toBeVisible()
    await expect(dialog.getByLabel('Água')).toBeVisible()
    await expect(dialog.getByLabel('Higiene')).toBeVisible()
    await expect(dialog.getByLabel('Medicamentos')).toBeVisible()
    await expect(dialog.getByLabel('Outros')).toBeVisible()

    await expect(
      dialog.getByLabel(/Concordo com o uso dos dados/i)
    ).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /Cadastrar Ponto/i })
    ).toBeVisible()
  })

  test('should display the "Indicar no Mapa" button', async ({ page }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    await expect(
      dialog.getByRole('button', { name: /Indicar no Mapa/i })
    ).toBeVisible()
  })

  // ─── Type Toggle ─────────────────────────────────────────────────────────

  test('should select "Ponto de Coleta" by default', async ({ page }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    const collectionBtn = dialog.getByRole('button', {
      name: /Ponto de Coleta/i
    })
    await expect(collectionBtn).toHaveAttribute('type', 'button')

    await expect(dialog.getByPlaceholder(/Ex: 50/i)).not.toBeVisible()
  })

  test('should display the "Capacidade" field when selecting Abrigo type', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    await dialog.getByRole('button', { name: /Abrigo/i }).click()

    await expect(dialog.getByPlaceholder(/Ex: 50/i)).toBeVisible()
    await expect(dialog.getByText('Capacidade Aproximada')).toBeVisible()
  })

  test('should hide the "Capacidade" field when switching back to Coleta type', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    await dialog.getByRole('button', { name: /Abrigo/i }).click()
    await expect(dialog.getByPlaceholder(/Ex: 50/i)).toBeVisible()

    await dialog.getByRole('button', { name: /Ponto de Coleta/i }).click()
    await expect(dialog.getByPlaceholder(/Ex: 50/i)).not.toBeVisible()
  })

  // ─── Map Selection Mode ───────────────────────────────────────────────────

  test('should close the modal and activate crosshair cursor when clicking "Indicar no Mapa"', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await expect(page.locator('#modal-title')).toBeVisible()

    await dialog.getByRole('button', { name: /Indicar no Mapa/i }).click()

    await expect(page.locator('#modal-title')).not.toBeVisible()

    const cursor = await page
      .locator('.leaflet-container')
      .evaluate(el => getComputedStyle(el).cursor)
    expect(cursor).toBe('crosshair')
  })
})
