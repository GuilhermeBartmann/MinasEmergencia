# Guia de PWA - Emergência Coletas

Este documento descreve todas as funcionalidades PWA implementadas no projeto.

## ✅ Implementado

### 1. Service Worker (Workbox)

**Configuração:** `next.config.mjs`

O service worker é gerado automaticamente pelo `@ducanh2912/next-pwa` com estratégias de cache personalizadas:

#### Estratégias de Cache

| Recurso | Estratégia | Cache Name | Duração |
|---------|-----------|------------|---------|
| Google Fonts CSS | CacheFirst | google-fonts-cache | 365 dias |
| Google Fonts Files | CacheFirst | gstatic-fonts-cache | 365 dias |
| OpenStreetMap Tiles | CacheFirst | openstreetmap-tiles-cache | 30 dias (200 entries) |
| Unpkg CDN | CacheFirst | unpkg-cache | 30 dias |
| API Routes | NetworkFirst | api-cache | 5 minutos (10s timeout) |
| Next.js Images | CacheFirst | next-image-cache | 30 dias |
| Next.js Static | CacheFirst | next-static-cache | 365 dias |
| Static Images | CacheFirst | static-image-cache | 30 dias |

#### Cache Strategies Explained

**CacheFirst:**
1. Verifica o cache primeiro
2. Se encontrado, retorna do cache (rápido)
3. Se não encontrado, faz request de rede
4. Armazena resposta no cache para próxima vez

**Ideal para:** Assets estáticos que não mudam (fonts, images, map tiles)

**NetworkFirst:**
1. Tenta request de rede primeiro
2. Se sucesso (< 10s), retorna e atualiza cache
3. Se falha ou timeout, retorna do cache
4. Fallback para cache se offline

**Ideal para:** API calls que precisam ser atualizados mas têm fallback

---

### 2. Manifest (PWA)

**Arquivo:** `public/manifest.json`

```json
{
  "name": "Emergência Coletas - Ajuda para Vítimas de Enchentes",
  "short_name": "Emergência Coletas",
  "description": "Sistema colaborativo para localizar pontos...",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#c0392b",
  "orientation": "portrait-primary",
  "icons": [...],
  "shortcuts": [
    { "name": "Juiz de Fora", "url": "/jf" },
    { "name": "Ubá", "url": "/uba" }
  ]
}
```

**Features:**
- ✅ `display: standalone` (sem barra de navegador)
- ✅ `theme_color` vermelho emergência
- ✅ Ícones 192×192 e 512×512
- ✅ Shortcuts para cidades principais
- ✅ Categories: social, humanitarian
- ✅ Screenshots (mobile + desktop)

---

### 3. Install Prompt

**Componente:** `src/components/pwa/InstallPrompt.tsx`

![Install Prompt Preview]

**Features:**
- ✅ Detecta evento `beforeinstallprompt`
- ✅ Aguarda 10 segundos antes de mostrar (não intrusivo)
- ✅ Banner animado (slide-up) no canto inferior
- ✅ Botões "Instalar" e "Agora não"
- ✅ Não mostra novamente na mesma sessão se dispensado
- ✅ Detecta se já está instalado (`display-mode: standalone`)
- ✅ Ouve evento `appinstalled`

**UX:**
```
┌─────────────────────────────────────┐
│ 📱  Instalar Emergência Coletas  ×  │
│ Adicione à tela inicial para        │
│ acesso rápido durante emergências   │
│ ┌─────────┐  ┌──────────┐          │
│ │ Instalar│  │Agora não │          │
│ └─────────┘  └──────────┘          │
└─────────────────────────────────────┘
```

**Como funciona:**
1. Usuário acessa o site no mobile (Chrome/Edge/Samsung Internet)
2. Após 10 segundos, banner aparece
3. Usuário clica "Instalar"
4. Sistema mostra dialog nativo do navegador
5. Após instalação, ícone aparece na home screen

---

### 4. Offline Indicator

**Componente:** `src/components/pwa/OfflineIndicator.tsx`

**Features:**
- ✅ Detecta `navigator.onLine`
- ✅ Ouve eventos `online` e `offline`
- ✅ Badge animado no topo quando offline
- ✅ Pulsing red dot indicator

**UX:**
```
┌──────────────────────────┐
│ 🔴 Você está offline     │
└──────────────────────────┘
```

---

### 5. Offline Fallback Page

**Arquivo:** `src/app/offline/page.tsx`

![Offline Page Preview]

**Features:**
- ✅ Página estática em cache
- ✅ Design consistente com o app
- ✅ Instruções claras
- ✅ Botões de ação:
  - "Tentar Novamente" (reload)
  - "Voltar" (history.back)
  - "Ir para Página Inicial"
- ✅ Contatos de emergência (funcionam offline via `tel:`)
- ✅ Explicação do modo offline

**Service Worker Fallback:**
```javascript
// Quando offline e página não está em cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline'))
  );
});
```

---

### 6. Ícones PWA

**Necessários:**
- `public/icon-192.png` - 192×192px (Android)
- `public/icon-512.png` - 512×512px (Android, splash screen)
- `public/apple-touch-icon.png` - 180×180px (iOS)
- `public/favicon.ico` - 16×16, 32×32, 48×48 (navegador)

**Geração:**
```bash
# Use ferramenta online
https://realfavicongenerator.net/

# Ou Canva/Figma:
1. Design 512×512px
2. Fundo #c0392b (vermelho emergência)
3. Emoji/ícone 🆘 centralizado
4. Exporte PNG
5. Redimensione para 192×192 e 180×180
```

**Script helper:**
```bash
npm run icons:info
# Mostra instruções para gerar ícones
```

---

### 7. Meta Tags (Head)

**Adicionado em:** `src/app/layout.tsx`

```tsx
export const metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Emergência Coletas',
  },
  themeColor: '#c0392b',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};
```

---

## 📊 Funcionalidades PWA

### ✅ Instalável
- Android: Chrome, Edge, Samsung Internet
- iOS: Safari (parcial - sem service worker)
- Desktop: Chrome, Edge (Windows, Mac, Linux)

### ✅ Offline-First
- Páginas visitadas ficam em cache
- Map tiles em cache (200 tiles, 30 dias)
- Assets estáticos em cache (365 dias)
- API com fallback para cache

### ✅ App-like Experience
- Sem barra de navegador (standalone)
- Splash screen automática
- Theme color consistente
- Shortcuts para cidades

### ✅ Performance
- Cache agressivo para assets
- Network-first para API (dados frescos)
- Preload de fonts
- Lazy load de mapa

---

## 🧪 Como Testar

### Mobile (Android)

1. **Build de produção:**
   ```bash
   npm run build
   npm start
   ```

2. **Acesse via ngrok/Vercel:**
   - Service Workers só funcionam em HTTPS
   - Localhost é exceção (funciona em HTTP)

3. **Chrome DevTools:**
   - F12 > Application > Service Workers
   - Verificar se está "activated and running"
   - Application > Manifest - ver manifest.json
   - Application > Cache Storage - ver caches criados

4. **Instalar:**
   - Chrome Menu > "Adicionar à tela inicial"
   - Ou usar banner automático após 10s

5. **Testar offline:**
   - Chrome DevTools > Network > Offline
   - Navegar pelo app
   - Verificar que páginas em cache funcionam

### Desktop

1. **Chrome (recomendado):**
   - Acesse site em HTTPS
   - Address bar > ícone "Instalar"
   - Ou menu > "Instalar Emergência Coletas"

2. **Edge:**
   - Similar ao Chrome
   - Menu > Apps > "Instalar este site como aplicativo"

### iOS (Safari)

**Limitações:**
- Sem service worker (até iOS 16.4+)
- Instalação manual apenas

**Instalação:**
1. Safari > Share button
2. "Add to Home Screen"
3. Editar nome se necessário
4. Adicionar

---

## 🔍 Lighthouse PWA Audit

**Checklist:**

- ✅ Registers a service worker
- ✅ Responds with 200 when offline
- ✅ Contains valid manifest.json
- ✅ Configures viewport for mobile
- ✅ Provides apple-touch-icon
- ✅ Themed address bar (theme-color)
- ✅ Content sized correctly for viewport
- ✅ Display set to standalone/fullscreen

**Expected Score: 100/100**

```bash
npx lighthouse https://emergenciacoletas.vercel.app --only-categories=pwa --view
```

---

## 📦 Tamanho dos Caches

### Estimativas

| Cache | Entradas | Tamanho Médio | Total Estimado |
|-------|----------|---------------|----------------|
| Map Tiles | 200 | 20KB | ~4MB |
| Google Fonts | 10 | 50KB | ~500KB |
| Static Assets | 100 | 10KB | ~1MB |
| Next.js Static | 100 | 15KB | ~1.5MB |
| API Cache | 50 | 5KB | ~250KB |
| **TOTAL** | **460** | - | **~7.25MB** |

**Quota do navegador:**
- Chrome: ~6-60GB (depende do espaço disponível)
- Nosso app: < 10MB
- **Muito abaixo do limite** ✅

---

## 🚀 Deploy Checklist

### Pré-deploy

- [ ] Ícones criados (192, 512, apple-touch, favicon)
- [ ] manifest.json validado (https://manifest-validator.appspot.com/)
- [ ] Service worker testado localmente
- [ ] Offline page funcional
- [ ] Install prompt testado em mobile

### Pós-deploy

- [ ] HTTPS habilitado (obrigatório)
- [ ] Service worker registrado (DevTools > Application)
- [ ] Manifest detectado (DevTools > Application > Manifest)
- [ ] Lighthouse PWA score: 100
- [ ] Testar instalação em:
  - [ ] Android (Chrome)
  - [ ] Android (Edge)
  - [ ] Desktop (Chrome)
  - [ ] Desktop (Edge)
  - [ ] iOS (Safari) - se possível

### Monitoramento

- [ ] Google Analytics > Events > "app_install"
- [ ] Vercel Analytics > Web Vitals
- [ ] Erros de service worker (Sentry/LogRocket)

---

## 🐛 Troubleshooting

### Service Worker não registra

**Causa:** Não está em HTTPS ou localhost

**Solução:**
- Deploy para Vercel (HTTPS automático)
- Ou use ngrok: `ngrok http 3000`

### Manifest não encontrado

**Causa:** Path incorreto ou CORS

**Solução:**
- Verificar que `public/manifest.json` existe
- Verificar `manifest` em layout.tsx metadata
- Testar: `https://seu-dominio.com/manifest.json`

### Install prompt não aparece

**Causas possíveis:**
1. Já instalado
2. Dispensado recentemente (Chrome: 3 meses de cooldown)
3. iOS (não suporta)
4. Critérios de instalação não atendidos

**Solução:**
- Chrome DevTools > Application > Manifest > "Add to homescreen"
- Forçar evento: `chrome://flags/#bypass-app-banner-engagement-checks`

### Cache não funciona offline

**Causa:** Service worker não ativo

**Solução:**
1. DevTools > Application > Service Workers
2. Verificar status: "activated and is running"
3. "Update on reload" OFF
4. Recarregar página

### Map tiles não carregam offline

**Causa:** Tiles não visitados não estão em cache

**Solução:**
- Cache só armazena tiles **visitados**
- Fazer pan/zoom pelo mapa em áreas importantes
- Aguardar tiles carregarem
- Testar offline novamente

---

## 📞 Recursos

- **next-pwa Docs:** https://ducanh-next-pwa.vercel.app/
- **Workbox:** https://developers.google.com/web/tools/workbox
- **PWA Checklist:** https://web.dev/pwa-checklist/
- **Manifest Generator:** https://www.simicart.com/manifest-generator.html/
- **Icon Generator:** https://realfavicongenerator.net/

---

✅ **PWA Totalmente Implementado!**

O app agora é:
- ✅ Instalável
- ✅ Offline-first
- ✅ App-like
- ✅ Performático
