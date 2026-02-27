import { test, expect } from '@playwright/test'

/**
 * Add new point form tests
 *
 * Desktop: FAB button → opens Modal (role="dialog", #modal-title)
 * Mobile:  Bottom nav "Cadastrar" tab → inline form (no modal)
 *
 * Covers:
 * - Opening and closing the form
 * - Presence of all form fields
 * - Type toggle: Ponto de Coleta ↔ Abrigo (capacity field)
 * - "Indicar no Mapa" map picker mode
 */

// ─── DESKTOP ─────────────────────────────────────────────────────────────────

test.describe('Add New Point - Desktop (Modal)', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop only: uses FAB + modal')

  test.beforeEach(async ({ page }) => {
    await page.goto('/jf')
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 15_000 })
    await page
      .getByRole('button', { name: /Cadastrar novo ponto/i })
      .waitFor({ state: 'visible', timeout: 10_000 })
  })

  // ─── Open and Close ─────────────────────────────────────────────────────

  test('should open the modal when clicking the FAB', async ({ page }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()

    await expect(page.locator('#modal-title')).toBeVisible()
    await expect(
      page.getByRole('heading', { name: /Cadastrar Novo Ponto/i })
    ).toBeVisible()
  })

  test('should close the modal when clicking the X button', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
    await expect(page.locator('#modal-title')).toBeVisible()

    const dialog = page.getByRole('dialog', { name: /Cadastrar Novo Ponto/i })
    await dialog.getByRole('button', { name: /Fechar modal/i }).click()

    await expect(page.locator('#modal-title')).not.toBeVisible()
  })

  test('should close the modal when pressing the Escape key', async ({
    page
  }) => {
    await page.getByRole('button', { name: /Cadastrar novo ponto/i }).click()
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

// ─── MOBILE ──────────────────────────────────────────────────────────────────

test.describe('Add New Point - Mobile (Inline Form)', () => {
  test.skip(
    ({ isMobile }) => !isMobile,
    'Mobile only: uses bottom nav tab + inline form'
  )

  test.beforeEach(async ({ page }) => {
    await page.goto('/jf')
    await page.waitForSelector('.leaflet-marker-icon', { timeout: 15_000 })
    await page
      .locator('nav button:has-text("Cadastrar")')
      .waitFor({ state: 'visible', timeout: 10_000 })
  })

  // ─── Open and Close ─────────────────────────────────────────────────────

  test('should show the form when clicking the "Cadastrar" tab', async ({
    page
  }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()

    await expect(
      page.getByRole('heading', { name: /Cadastrar Ponto/i })
    ).toBeVisible()
    await expect(page.locator('form')).toBeVisible()
  })

  test('should return to map view when clicking the "Ver Mapa" tab', async ({
    page
  }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()
    await expect(page.locator('form')).toBeVisible()

    await page.locator('nav button:has-text("Ver Mapa")').click()

    await expect(page.locator('form')).not.toBeVisible()
    await expect(page.locator('#map')).toBeVisible()
  })

  // ─── Form Structure ──────────────────────────────────────────────────────

  test('should display all required form fields', async ({ page }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()
    const form = page.locator('form')
    await expect(form).toBeVisible()

    await expect(form.getByText('Tipo de Ponto')).toBeVisible()
    await expect(
      form.getByRole('button', { name: /Ponto de Coleta/i })
    ).toBeVisible()
    await expect(form.getByRole('button', { name: /Abrigo/i })).toBeVisible()
    await expect(
      form.getByPlaceholder(/Centro Comunitário São Pedro/i)
    ).toBeVisible()
    await expect(form.getByPlaceholder(/Rua das Flores/i)).toBeVisible()
    await expect(form.getByLabel('Roupas')).toBeVisible()
    await expect(form.getByLabel('Alimentos')).toBeVisible()
    await expect(form.getByLabel('Água')).toBeVisible()
    await expect(form.getByLabel('Higiene')).toBeVisible()
    await expect(form.getByLabel('Medicamentos')).toBeVisible()
    await expect(form.getByLabel('Outros')).toBeVisible()
    await expect(form.getByLabel(/Concordo com o uso dos dados/i)).toBeVisible()
    await expect(
      form.getByRole('button', { name: /Cadastrar Ponto/i })
    ).toBeVisible()
  })

  test('should display the "Indicar no Mapa" button', async ({ page }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()
    const form = page.locator('form')
    await expect(form).toBeVisible()

    await expect(
      form.getByRole('button', { name: /Indicar no Mapa/i })
    ).toBeVisible()
  })

  // ─── Type Toggle ─────────────────────────────────────────────────────────

  test('should select "Ponto de Coleta" by default', async ({ page }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()
    const form = page.locator('form')
    await expect(form).toBeVisible()

    const collectionBtn = form.getByRole('button', { name: /Ponto de Coleta/i })
    await expect(collectionBtn).toHaveAttribute('type', 'button')
    await expect(form.getByPlaceholder(/Ex: 50/i)).not.toBeVisible()
  })

  test('should display the "Capacidade" field when selecting Abrigo type', async ({
    page
  }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()
    const form = page.locator('form')
    await expect(form).toBeVisible()

    await form.getByRole('button', { name: /Abrigo/i }).click()

    await expect(form.getByPlaceholder(/Ex: 50/i)).toBeVisible()
    await expect(form.getByText('Capacidade Aproximada')).toBeVisible()
  })

  test('should hide the "Capacidade" field when switching back to Coleta type', async ({
    page
  }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()
    const form = page.locator('form')
    await expect(form).toBeVisible()

    await form.getByRole('button', { name: /Abrigo/i }).click()
    await expect(form.getByPlaceholder(/Ex: 50/i)).toBeVisible()

    await form.getByRole('button', { name: /Ponto de Coleta/i }).click()
    await expect(form.getByPlaceholder(/Ex: 50/i)).not.toBeVisible()
  })

  // ─── Map Selection Mode ───────────────────────────────────────────────────

  test('should switch to map view and activate crosshair when clicking "Indicar no Mapa"', async ({
    page
  }) => {
    await page.locator('nav button:has-text("Cadastrar")').click()
    const form = page.locator('form')
    await expect(form).toBeVisible()

    await form.getByRole('button', { name: /Indicar no Mapa/i }).click()

    await expect(form).not.toBeVisible()
    await expect(page.locator('#map')).toBeVisible()

    const cursor = await page
      .locator('.leaflet-container')
      .evaluate(el => getComputedStyle(el).cursor)
    expect(cursor).toBe('crosshair')
  })
})
