import { defineConfig, devices } from '@playwright/test'

/**
 * Configuração do Playwright para testes E2E
 * Executa contra o ambiente de produção: https://minas-emergencia.com
 */
export default defineConfig({
  testDir: './e2e',

  /* Timeout global por teste */
  timeout: 30_000,

  /* Timeout para expects individuais */
  expect: {
    timeout: 10_000
  },

  /* Execução paralela desabilitada para testes que dependem do Firebase */
  fullyParallel: false,
  workers: 1,

  /* Quantidade de retentativas em caso de falha */
  retries: 1,

  /* Reporter no terminal */
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    /* URL base – todos os testes usam `baseURL` como raiz */
    baseURL: 'https://minas-emergencia.com',

    /* Capturar trace apenas na primeira retentativa */
    trace: 'on-first-retry',

    /* Screenshot somente em falha */
    screenshot: 'only-on-failure',

    /* Idioma do browser */
    locale: 'pt-BR',

    /* Viewport padrão (desktop) */
    viewport: { width: 1280, height: 720 }
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    }
  ]
})
