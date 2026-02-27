# Guia de Testes E2E

## Visão Geral

Os testes E2E utilizam o [Playwright](https://playwright.dev/) e rodam diretamente contra o **ambiente de produção** (`https://minas-emergencia.com`). Não é necessário iniciar nenhum servidor local.

> ⚠️ **Importante:** Como os testes rodam em produção, eles são somente leitura por design. Testes que gravariam dados no Firestore (envio de formulários) foram removidos intencionalmente para evitar poluir o banco de dados de produção.

---

## Pré-requisitos

Node.js e npm já instalados. Instale os navegadores do Playwright na primeira configuração:

```bash
npx playwright install chromium
```

---

## Executando os Testes

### Todos os testes (desktop + mobile)

```bash
npm run test:e2e
```

### Somente desktop (Chromium 1280×720)

```bash
npx playwright test --project=chromium
```

### Somente mobile (Pixel 5 – 393×851)

```bash
npx playwright test --project=mobile-chrome
```

### Modo interativo (UI)

```bash
npm run test:e2e:ui
```

### Modo debug (abre o navegador visualmente, passo a passo)

```bash
npm run test:e2e:debug
```

### Visualizar o último relatório HTML

```bash
npm run test:e2e:report
```

### Executar um arquivo específico

```bash
npx playwright test e2e/home.spec.ts --project=chromium
```

### Executar um teste específico pelo nome

```bash
npx playwright test --grep "should render the Leaflet map" --project=mobile-chrome
```

---

## Arquivos de Teste

| Arquivo                       | Descrição                                                              |
| ----------------------------- | ---------------------------------------------------------------------- |
| `e2e/home.spec.ts`            | Página inicial (`/`) — título, seletor de cidade, links, rodapé        |
| `e2e/city-page.spec.ts`       | Página da cidade (`/jf`) — cabeçalho, estatísticas, mapa, legenda, nav |
| `e2e/add-point.spec.ts`       | Formulário de cadastro — modal desktop e formulário inline mobile      |
| `e2e/map-interaction.spec.ts` | Mapa Leaflet — tiles, marcadores, popups, controles de zoom            |

---

## Projetos (Navegadores)

A configuração define dois projetos de teste no `playwright.config.ts`:

| Projeto         | Dispositivo    | Viewport   |
| --------------- | -------------- | ---------- |
| `chromium`      | Desktop Chrome | 1280 × 720 |
| `mobile-chrome` | Pixel 5        | 393 × 851  |

---

## Comportamento Desktop vs Mobile

O aplicativo possui layouts diferentes dependendo do tamanho da tela. Alguns testes consideram isso com `isMobile` ou `test.skip`:

| Funcionalidade         | Desktop                                 | Mobile                                                 |
| ---------------------- | --------------------------------------- | ------------------------------------------------------ |
| Cadastrar novo ponto   | Botão FAB → Modal (`#modal-title`)      | Aba "Cadastrar" na navbar inferior → Formulário inline |
| Legenda do mapa        | Expandida por padrão, com texto de dica | Recolhida por padrão, sem texto de dica                |
| Painel de estatísticas | Exibe o rótulo "Pontos de Coleta"       | Layout compacto, rótulo oculto                         |
| Link de emergência     | Texto completo + número                 | Ícone + número apenas                                  |

Os testes em `add-point.spec.ts` usam `test.skip(({ isMobile }) => ...)` para garantir que cada bloco `describe` rode apenas na plataforma correta.

---

## Configuração

Todas as configurações estão em `playwright.config.ts`:

```
baseURL:    https://minas-emergencia.com   ← produção
timeout:    30s por teste
retries:    1
workers:    1 (serial, evita condições de corrida no Firebase)
trace:      na primeira nova tentativa
screenshot: somente em falha
```

---

## Artefatos

Após uma execução de testes, os artefatos são salvos em:

- `test-results/` — capturas de tela e traces dos testes com falha
- `playwright-report/` — relatório HTML completo

Para inspecionar um arquivo de trace:

```bash
npx playwright show-trace test-results/<nome-do-teste>/trace.zip
```
